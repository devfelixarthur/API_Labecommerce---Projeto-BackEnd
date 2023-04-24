-- Active: 1679961288296@@127.0.0.1@3306
-- CRIANDO AS TABELAS A SEREM UTILIZADAS NA API:

CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL , 
    name TEXT NOT NULL , 
    email TEXT NOT NULL UNIQUE, 
    password TEXT NOT NULL, 
    createAt DATE DEFAULT(DATETIME('now','localtime'))
);


CREATE TABLE products(
    id TEXT PRIMARY KEY NOT NULL UNIQUE, 
    name TEXT NOT NULL UNIQUE, 
    price REAL NOT NULL, 
    category TEXT NOT NULL,
    description TEXT NOT NULL, 
    imageUrl TEXT NOT NULL
);



CREATE TABLE purchases(
id TEXT PRIMARY KEY NOT NULL UNIQUE,
buyer_id TEXT NOT NULL,
buyer_name TEXT NOT NULL,
totalPrice REAL NOT NULL,
createdAt DATE DEFAULT(DATETIME('now','localtime')),
paid INTEGER NOT NULL,
Foreign Key (buyer_id) REFERENCES users(id)
);

SELECT * FROM purchases;


CREATE TABLE purchase_products (
  id TEXT PRIMARY KEY NOT NULL UNIQUE,
  purchase_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER,
  FOREIGN KEY (purchase_id) REFERENCES purchases(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);


DROP TABLE users;