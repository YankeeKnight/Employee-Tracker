-- departments --
INSERT INTO department (dpt_name)
VALUES ("Operations"),
       ("Pitching"),
       ("Infield"),
       ("Outfield");

-- roles --
INSERT INTO role (title, salary, department_id)
VALUES  ("General Manager", 20000000, 1),
        ("Manager", 750000, 1),
        ("Starting Pitcher", 36000000, 2),
        ("Captain", 40000000, 4),
        ("Fielder", 32000000, 3),
        ("Outfielder", 10000000, 4),
        ("Closer", 3000000, 2);

-- employee --
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES ("Brian", "Cashman", 1, 1),
       ("Aaron", "Boone", 2, 2),
       ("Aaron", "Judge", 3, 4),
       ("Jonathan", "Loaisiga", null, 7),
       ("Josh", "Donaldson", null, 5),
       ("Aaron", "Hicks", null, 6),
       ("Gerrit", "Cole", null, 3);

-- for creation --
SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;