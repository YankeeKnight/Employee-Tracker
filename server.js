// dependancies
const inquirer = require('inquirer');
const mysql = require('mysql2');
const { printTable } = require('console-table-printer');
const View = require("./lib/view");

const view = new View();

const connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "sisterjo",
    database: "employee_manager_db"
});

//connection
connection.connect(function (err) {
    if (err) throw err
    console.log("**********************************************************")
    console.log("|  _______                  __                           |");
    console.log("| |    ___|.--------.-----.|  |.-----.--.--.-----.-----. |");
    console.log("| |    ___||        |  _  ||  ||  _  |  |  |  -__|  -__| |");
    console.log("| |_______||__|__|__|   __||__||_____|___  |_____|_____| |");
    console.log("|                   |__|             |_____|             |");
    console.log("|      _______                                           |");
    console.log("|     |   |   |.---.-.-----.---.-.-----.-----.----.      |");
    console.log("|     |       ||  _  |     |  _  |  _  |  -__|   _|      |");
    console.log("|     |__|_|__||___._|__|__|___._|___  |_____|__|        |");
    console.log("|                                |_____|                 |");
    console.log("|                                                        |");
    console.log("**********************************************************");

    startPrompts();
});

//initialize prompts
function startPrompts() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "choice",
            choices: [
                "View all Departments",
                "View all Roles",
                "View all Employees",
                "View Employees by Department",
                "View Employees by Manager",
                "View Budget for Departments",
                "Add a Department",
                "Add a Role",
                "Add an Employee",
                "Update Employee Role",
                "Update Employee Manager",
                "Delete Department",
                "Delete Role",
                "Delete Employee",
                "Quit"
            ]
        }
    ]).then(function (val) {
        switch (val.choice) {
            case "View all Departments":
                viewAllDepartments();
                break;

            case "View all Roles":
                viewAllRoles();
                break;

            case "View all Employees":
                viewAllEmployees();
                break;

            case "View Employees by Department":
                empByDept();
                break;

            case "View Employees by Manager":
                empByManager();
                break;

            case "View Budget for Departments":
                seeBudget();
                break;

            case "Add a Department":
                addDepartment();
                break;

            case "Add a Role":
                addRole();
                break;

            case "Add an Employee":
                addEmployee();
                break;

            case "Update Employee Role":
                updateEmployeeRole();
                break;

            case "Update Employee Manager":
                updateManager();
                break;

            case "Delete Department":
                delDept();
                break;

            case "Delete Role":
                delRole();
                break;

            case "Delete Employee":
                delEmp();
                break;

            case "Quit":
                process.exit(0);
        }
    })
};

//view all departments
function viewAllDepartments() {
    connection.query("SELECT department.dpt_name AS Department, department.id AS ID FROM department;",
        function (err, results) {
            if (err) throw err
            printTable(results);
            startPrompts();
        })
};

//view all roles
function viewAllRoles() {
    connection.query("SELECT role.title AS Role, role.id AS ID, role.department_id AS Dept_ID, role.salary AS Salary FROM role",
        function (err, results) {
            if (err) throw err
            printTable(results);
            startPrompts();
        })
};

//view all employees
function viewAllEmployees() {
    connection.query("SELECT employee.id AS ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Role, role.salary AS Salary, department.dpt_name AS Department, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id LEFT JOIN employee e on employee.manager_id = e.id;",
        function (err, results) {
            if (err) throw err
            printTable(results);
            startPrompts();
        })
};

//view employees by department
empByDept = () => {
    console.log("Showing Employees by Departments...\n");
    const sql = `SELECT employee.first_name, employee.last_name, department.dpt_name AS Department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id`;

    connection.query(sql, (err, results) => {
        if (err) throw err;
        printTable(results);
        startPrompts();
    });
};

//view employees by manager
empByManager = () => {
    console.log("Showing Employees by Manager...\n");
    const sql = `SELECT employee.first_name, employee.last_name, CONCAT(e.first_name, ' ',e.last_name) AS Manager FROM employee LEFT JOIN employee e ON employee.manager_id = e.id`;

    connection.query(sql, (err, results) => {
        if (err) throw err;
        printTable(results);
        startPrompts();
    });
};

//view dept budget
seeBudget = () => {
    console.log("Displaying current Budget by Department...\n");

    const sql = `SELECT department_id AS ID, department.dpt_name AS Department, SUM(salary) AS Budget FROM role JOIN department ON role.department_id = department.id GROUP BY department_id`;

    connection.query(sql, (err, results) => {
        if (err) throw err;
        printTable(results);
        startPrompts();
    });
};

//add department
function addDepartment() {
    inquirer.prompt([
        {
            name: "dpt_name",
            type: "Input",
            message: "Please enter a new Department to add: "
        }
    ]).then(function (results) {
        connection.query("INSERT INTO department SET ?",
            {
                dpt_name: results.dpt_name
            },
            function (err) {
                if (err) throw err
                console.log('\x1b[44m%s\x1b[0m', results.dpt_name + " was added successfully");
                viewAllDepartments();
            }
        )
    })
};

//add a role
addRole = () => {
    inquirer.prompt([
        {
            name: "role",
            type: "input",
            message: "What Role do you want to add?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the Salary of this Role?"
        }
    ]).then(answer => {
        const params = [answer.role, answer.salary];

        const roleSql = `SELECT dpt_name, id FROM department`;

        connection.query(roleSql, (err, results) => {
            if (err) throw err;

            const dept = results.map(({ dpt_name, id }) => ({ name: dpt_name, value: id }));

            inquirer.prompt([
                {
                    name: "dept",
                    type: "list",
                    message: "What Department does this Role belong to?",
                    choices: dept
                }
            ]).then(deptChoice => {
                const dept = deptChoice.dept;
                params.push(dept);

                const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

                connection.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log('Added ' + answer.role + " to roles.");

                    viewAllRoles();
                });
            });
        });
    });
};


//add an employee
addEmployee = () => {
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "What is the employee's First Name?"
        },
        {
            name: "lastName",
            type: "input",
            message: "What is the employee's Last Name?"
        }
    ]).then(answer => {
        const params = [answer.firstName, answer.lastName]

        const roleSql = `SELECT role.id, role.title FROM role`;

        connection.query(roleSql, (err, results) => {
            if (err) throw err;

            const roles = results.map(({ id, title }) => ({ name: title, value: id }));

            inquirer.prompt([
                {
                    name: "role",
                    type: "list",
                    message: "What is this Employee's Role?",
                    choices: roles
                }
            ]).then(roleChoice => {
                const role = roleChoice.role;
                params.push(role);

                const managerSql = `SELECT * FROM employee`;

                connection.query(managerSql, (err, results) => {
                    if (err) throw err;

                    const managers = results.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

                    inquirer.prompt([
                        {
                            name: "manager",
                            type: "list",
                            message: "Who is the Employee's Manager?",
                            choices: managers
                        }
                    ]).then(managerChoice => {
                        const manager = managerChoice.manager;
                        params.push(manager);

                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

                        connection.query(sql, params, (err, result) => {
                            if (err) throw err;
                            console.log("Employee has been added successfully.")

                            viewAllEmployees();
                        });
                    });
                });
            });
        });
    });
};

//update role
updateEmployeeRole = () => {
    const empSql = `SELECT * FROM employee`;

    connection.query(empSql, (err, results) => {
        if (err) throw err;

        const employees = results.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                name: "name",
                type: "list",
                message: "Which Employee would you like to Update?",
                choices: employees
            }
        ]).then(empChoice => {
            const employee = empChoice.name;
            const params = [];
            params.push(employee);

            const roleSql = `SELECT * FROM role`;

            connection.query(roleSql, (err, results) => {
                if (err) throw err;

                const roles = results.map(({ id, title }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                        name: "role",
                        type: "list",
                        message: "What is the Employee's new Role?",
                        choices: roles
                    }
                ]).then(roleChoice => {
                    const role = roleChoice.role;
                    params.push(role);

                    let employee = params[0]
                    params[0] = role
                    params[1] = employee

                    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                    connection.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log("Employee has been updated.");

                        viewAllEmployees();
                    });
                });
            });
        });
    });
};

//udpate manager
updateManager = () => {
    const employeeSql = `SELECT * FROM employee`;

    connection.query(employeeSql, (err, results) => {
        if (err) throw err;

        const employees = results.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                name: "name",
                type: "list",
                message: "Which Employee would you like to Update?",
                choices: employees
            }
        ]).then(empChoice => {
            const employee = empChoice.name;
            const params = [];
            params.push(employee);

            const managerSql = `SELECT * FROM employee`;

            connection.query(managerSql, (err, results) => {
                if (err) throw err;

                const managers = results.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

                inquirer.prompt([
                    {
                        name: "manager",
                        type: "list",
                        message: "Who is the Employee's Manager?",
                        choices: managers
                    }
                ]).then(managerChoice => {
                    const manager = managerChoice.manager;
                    params.push(manager);

                    let employee = params[0]
                    params[0] = manager
                    params[1] = employee

                    const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

                    connection.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log("Employee has been updated successfully.");

                        viewAllEmployees();
                    });
                });
            });
        });
    });
};

//delete department
delDept = () => {
    const deptSql = `SELECT * FROM department`;

    connection.query(deptSql, (err, results) => {
        if (err) throw err;

        const dept = results.map(({ dpt_name, id }) => ({ name: dpt_name, value: id }));

        inquirer.prompt([
            {
                name: "dept",
                type: "list",
                message: "What Department do you wish to DELETE?",
                choices: dept
            }
        ]).then(deptChoice => {
            const dept = deptChoice.dept;
            const sql = `DELETE FROM department WHERE id = ?`;

            connection.query(sql, dept, (err, result) => {
                if (err) throw err;
                console.log("Deparment has been successfully DELETED.");
                viewAllDepartments();
            });
        });
    });
};

//delete role
delRole = () => {
    const roleSql = `SELECT * FROM role`;

    connection.query(roleSql, (err, results) => {
        if (err) throw err;

        const role = results.map(({ title, id }) => ({ name: title, value: id }));

        inquirer.prompt([
            {
                name: "role",
                type: "list",
                message: "What Role do you wish to DELETE?",
                choices: role
            }
        ]).then(roleChoice => {
            const role = roleChoice.role;
            const sql = `DELETE FROM role WHERE id = ?`;

            connection.query(sql, role, (err, result) => {
                if (err) throw err;
                console.log("This Role has been successfully DELETED.");

                viewAllRoles();
            });
        });
    });
};

//delete employees
delEmp = () => {
    const empSql = `SELECT * FROM employee`;

    connection.query(empSql, (err, results) => {
        if (err) throw err;

        const employees = results.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                name: "name",
                type: "list",
                message: "Select an Employee to DELETE.",
                choices: employees
            }
        ]).then(empChoice => {
            const employee = empChoice.name;

            const sql = `DELETE FROM employee WHERE id = ?`;

            connection.query(sql, employee, (err, result) => {
                if (err) throw err;
                console.log("Employee has been successfully DELETED.");

                viewAllEmployees();
            });
        });
    });
};






