-- erase database if exists, create database called employee_manager_db --
DROP DATABASE IF EXISTS employee_manager_db;
CREATE DATABASE employee_manager_db;

-- use database employee_manager_db --
USE employee_manager_db;

-- create department table --
CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dpt_name VARCHAR(30)
);

-- create role table --
CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

-- create employee table --
CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);