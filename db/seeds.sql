-- departments --
INSERT INTO department (dpt_name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

-- roles --
INSERT INTO role (title, salary, department_id)
VALUES  ("Lead Engineer", 150000, 2),
        ("Legal Team Lead", 250000, 4),
        ("Accountant", 125000, 3),
        ("Sales Lead", 100000, 1),
        ("Salesperson", 80000, 1),
        ("Software Engineer", 120000, 2),
        ("Lawyer", 190000, 4);

-- employee --
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES ("Albert", "Abreu", null, 1),
       ("Jhony", "Brito", null, 2),
       ("Gerrit", "Cole", null, 3),
       ("Jimmy", "Cordero", 1, 4),
       ("Nestor", "Cortes", 4, 5),
       ("Scott", "Effross", 1, 6),
       ("Delvi", "Garcia", 2, 7);

-- for creation --
SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;