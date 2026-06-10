-- Database and users are now created by run.sh using .env variables
-- This file contains only the schema and initial data

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  telefone VARCHAR(30),
  email VARCHAR(120) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  endereco VARCHAR(255),
  is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS itens_cardapio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  ativo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  endereco_entrega VARCHAR(255) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pedidos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS pedido_itens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  item_cardapio_id INT NOT NULL,
  nome_item VARCHAR(120) NOT NULL,
  categoria_item VARCHAR(60) NOT NULL,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_pedido_itens_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  CONSTRAINT fk_pedido_itens_cardapio FOREIGN KEY (item_cardapio_id) REFERENCES itens_cardapio(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO usuarios (nome, telefone, email, senha_hash, endereco, is_admin)
SELECT 'Admin', '0000000000', 'admin@local', '123', 'Endereco padrao', TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM usuarios WHERE email = 'admin@local'
);

INSERT INTO itens_cardapio (nome, descricao, preco, ativo)
SELECT 'Pizza Margherita', 'Molho de tomate, mussarela e manjericao', 35.90, TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM itens_cardapio WHERE nome = 'Pizza Margherita'
);

INSERT INTO itens_cardapio (nome, descricao, preco, ativo)
SELECT 'Hamburguer Artesanal', 'Pao brioche, carne 180g, queijo e molho', 28.50, TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM itens_cardapio WHERE nome = 'Hamburguer Artesanal'
);

INSERT INTO itens_cardapio (nome, descricao, preco, ativo)
SELECT 'Suco Natural', 'Suco natural de laranja 300ml', 8.00, TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM itens_cardapio WHERE nome = 'Suco Natural'
);

INSERT INTO itens_cardapio (nome, descricao, preco, ativo)
SELECT 'Frango Assado', 'Frango assado com porção de batatas assadas e farofa', 30.00, TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM itens_cardapio WHERE nome = 'Frango Assado'
);

INSERT INTO itens_cardapio (nome, descricao, preco, ativo)
SELECT 'Batata Frita', 'Porção de 200g de batata com molho chedar de acompanhamento', 15.90, TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM itens_cardapio WHERE nome = 'Batata Frita'
);

INSERT INTO itens_cardapio (nome, descricao, preco, ativo)
SELECT 'Pastel de Camarão', 'Porção de 8 pasteis de camarão', 32.00, TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM itens_cardapio WHERE nome = 'Pastel de Camarão'
);

INSERT INTO itens_cardapio (nome, descricao, preco, ativo)
SELECT 'Refrigerante de Cola', 'Refrigerante gelado 350ml', 9.50, TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM itens_cardapio WHERE nome = 'Refrigerante de Cola'
);

INSERT INTO itens_cardapio (nome, descricao, preco, ativo)
SELECT 'Agua com Gas', 'Agua mineral com gas 500ml', 6.00, TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM itens_cardapio WHERE nome = 'Agua com Gas'
);

INSERT INTO itens_cardapio (nome, descricao, preco, ativo)
SELECT 'Pudim de Leite', 'Pudim caseiro com calda de caramelo', 12.90, TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM itens_cardapio WHERE nome = 'Pudim de Leite'
);

INSERT INTO itens_cardapio (nome, descricao, preco, ativo)
SELECT 'Brownie com Sorvete', 'Brownie de chocolate com sorvete de creme', 16.90, TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM itens_cardapio WHERE nome = 'Brownie com Sorvete'
);

INSERT INTO itens_cardapio (nome, descricao, preco, ativo)
SELECT 'Torta de Limão', 'Torta cremosa com cobertura de limão', 14.50, TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM itens_cardapio WHERE nome = 'Torta de Limão'
);