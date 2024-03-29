DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(9,4) NULL,
  stock_quantity INTEGER(10) NULL,
  PRIMARY KEY (item_id)
);

SELECT * FROM products
