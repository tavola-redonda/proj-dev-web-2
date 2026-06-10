FROM tomcat:10.1-jdk17-temurin-jammy AS build

WORKDIR /app

COPY src/main/java ./src/main/java
COPY src/main/webapp ./src/main/webapp

RUN mkdir -p build/WEB-INF/classes \
    && find src/main/java -name "*.java" > .sources.txt \
    && javac -encoding UTF-8 -d build/WEB-INF/classes -classpath "/usr/local/tomcat/lib/*:src/main/webapp/WEB-INF/lib/*" @.sources.txt \
    && jar -cvf proj_dev_web.war -C src/main/webapp . -C build WEB-INF

FROM tomcat:10.1-jdk17-temurin-jammy AS runtime

RUN rm -rf /usr/local/tomcat/webapps/*

COPY --from=build /app/proj_dev_web.war /usr/local/tomcat/webapps/proj_dev_web.war

EXPOSE 8080

CMD ["catalina.sh", "run"]
