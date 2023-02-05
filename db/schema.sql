-- erase database if exists, create database called employee_db --
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

-- use database employee_db --
USE employee_db;

-- create department table --
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    dpt_name VARCHAR(30),
    PRIMARY KEY (id)
);

-- create role table --
CREATE TABLE role (
    id INT AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    INDEX department_index (department_id),
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

--create employee table --
CREATE TABLE employee (
    id INT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    INDEX role_index (role_id),
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
    manager_id INT,
    INDEX manager_index (manager_id),
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);