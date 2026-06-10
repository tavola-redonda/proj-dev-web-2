#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"

load_env_file() {
  local env_file="$1"
  local line key value

  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line%$'\r'}"

    if [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]]; then
      continue
    fi

    if [[ "$line" == export\ * ]]; then
      line="${line#export }"
    fi

    if [[ "$line" != *"="* ]]; then
      continue
    fi

    key="${line%%=*}"
    value="${line#*=}"

    key="${key//[[:space:]]/}"

    if [[ "$key" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]; then
      if [[ "$value" == '"'*'"' && ${#value} -ge 2 ]]; then
        value="${value:1:-1}"
      elif [[ "$value" == "'"*"'" && ${#value} -ge 2 ]]; then
        value="${value:1:-1}"
      fi

      printf -v "$key" '%s' "$value"
      export "$key"
    fi
  done < "$env_file"
}

if [[ -f "$ENV_FILE" ]]; then
  load_env_file "$ENV_FILE"
fi

TOMCAT_HOME="${TOMCAT_HOME:-}"

resolve_tomcat_home() {
  if [[ -n "${TOMCAT_HOME:-}" && -d "$TOMCAT_HOME" ]]; then
    return 0
  fi

  local tomcat_dir
  tomcat_dir="$(find "$PROJECT_ROOT/apps" -maxdepth 1 -type d -name 'apache-tomcat-*' | sort | head -n 1 || true)"
  if [[ -n "$tomcat_dir" ]]; then
    TOMCAT_HOME="$tomcat_dir"
    echo "TOMCAT_HOME nao definido; usando $TOMCAT_HOME" >&2
    return 0
  fi

  local tomcat_zip
  tomcat_zip="$(find "$PROJECT_ROOT/apps" -maxdepth 1 -type f -name 'apache-tomcat-*.zip' | sort | head -n 1 || true)"
  if [[ -n "$tomcat_zip" ]]; then
    if ! command -v unzip >/dev/null 2>&1; then
      echo "Tomcat encontrado em $tomcat_zip, mas o comando 'unzip' nao esta instalado." >&2
      return 1
    fi

    unzip -q "$tomcat_zip" -d "$PROJECT_ROOT/apps"
    tomcat_dir="${tomcat_zip%.zip}"
    if [[ -d "$tomcat_dir" ]]; then
      TOMCAT_HOME="$tomcat_dir"
      echo "TOMCAT_HOME nao definido; usando $TOMCAT_HOME" >&2
      return 0
    fi
  fi

  return 1
}

if [[ -z "$TOMCAT_HOME" ]]; then
  if ! resolve_tomcat_home; then
    echo "TOMCAT_HOME nao definido. Ex: export TOMCAT_HOME=/home/usuario/projetos/proj_dev_web/apps/apache-tomcat-10.1.54" >&2
    exit 1
  fi
elif [[ ! -d "$TOMCAT_HOME" ]]; then
  if ! resolve_tomcat_home; then
    echo "TOMCAT_HOME invalido no .env: $TOMCAT_HOME. Use um caminho Linux valido no WSL ou remova a variavel para autodeteccao." >&2
    exit 1
  fi
fi

if ! chmod +x "$TOMCAT_HOME/bin"/*.sh; then
  echo "Nao foi possivel ajustar permissao em $TOMCAT_HOME/bin/*.sh" >&2
  exit 1
fi

DB_USER="${DB_USER:-app}"
DB_PASS="${DB_PASS:-app123}"
DB_NAME="${DB_NAME:-dbteste}"

# Create dynamic SQL to set up user from .env variables
DYNAMIC_SQL=$(cat <<EOF
CREATE DATABASE IF NOT EXISTS \`$DB_NAME\`;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF
)

if ! echo "$DYNAMIC_SQL" | sudo mysql; then
  echo "Falha ao criar usuario e banco de dados" >&2
  exit 1
fi

SETUP_SQL="$PROJECT_ROOT/setup.sql"
if [[ -f "$SETUP_SQL" ]]; then
  if ! sudo mysql "$DB_NAME" < "$SETUP_SQL"; then
    echo "Falha ao executar setup.sql" >&2
    exit 1
  fi
fi

BUILD_DIR="$PROJECT_ROOT/build/WEB-INF/classes"
WEBAPP_DIR="$PROJECT_ROOT/src/main/webapp"
LIB_DIR="$WEBAPP_DIR/WEB-INF/lib"
WAR_NAME="proj_dev_web.war"
WAR_PATH="$PROJECT_ROOT/$WAR_NAME"

mkdir -p "$BUILD_DIR"

find "$PROJECT_ROOT/src/main/java" -name "*.java" > "$PROJECT_ROOT/.sources.txt"

javac -encoding UTF-8 -d "$BUILD_DIR" \
  -classpath "$TOMCAT_HOME/lib/*:$LIB_DIR/*" \
  @"$PROJECT_ROOT/.sources.txt"

jar -cvf "$WAR_PATH" -C "$WEBAPP_DIR" . -C "$PROJECT_ROOT/build" WEB-INF

cp "$WAR_PATH" "$TOMCAT_HOME/webapps/"
"$TOMCAT_HOME/bin/catalina.sh" run
