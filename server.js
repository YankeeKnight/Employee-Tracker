// dependancies
const inquirer = require('inquirer');
const mysql = require('mysql2');
const { printTable } = require('console-table-printer');
const { pipeline } = require('stream');
const { start } = require('repl');

const connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "sisterjo",
    database: "employee_db"
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
                "Add a Department",
                "Add a Role",
                "Add an Employee",
                "Update Employee Role"
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
        }
    })
};

//select role
const roleArr = [];
function selectRole() {
    connection.query("SELECT * FROM role",
        function (err, results) {
            if (err) throw err
            for (const i = 0; i < results.length; i++) {
                roleArr.push(results[i].title);
            }
        })
    return roleArr;
};

//show managers for choice in prompt
const managersArr = [];
function selectManager() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
        function (err, results) {
            if (err) throw err
            for (const i = 0; i < results.length; i++) {
                managersArr.push(results[i].first_name);
            }
        })
    return managersArr;
};

//view all departments
function viewAllDepartments() {
    connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER by employee.id;",
        function (err, results) {
            if (err) throw err
            printTable(results);
            startPrompts();
        })
};

//view all roles
function viewAllRoles() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;",
        function (err, results) {
            if (err) throw err
            printTable(results);
            startPrompts();
        })
};

//view all employees
function viewAllEmployees() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id LEFT JOIN employee e on employee.manager_id = e.id;",
        function (err, results) {
            if (err) throw err
            printTable(results);
            startPrompts();
        })
};

//add department
function addDepartment() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Please enter a new Department to add: "
        }
    ]).then(function (results) {
        const query = connection.query("INSERT INTO department SET ?",
            {
                name: results.name
            },
            function (err) {
                if (err) throw err
                printTable(results);
                startPrompts();
            }
        )
    })
};

//add a role
function addRole() {
    connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role",
        function (err, results) {
            inquirer.prompt([
                {
                    name: "Title",
                    type: "Input",
                    message: "Enter new Role: "
                },
                {
                    name: "Salary",
                    type: "input",
                    message: "What is the Salary for this Role?"
                }
            ]).then(function (results) {
                connection.query(
                    "INSERT INTO role SET ?",
                    {
                        title: results.Title,
                        salary: results.Salary,
                    },
                    function (err) {
                        if (err) throw err
                        printTable(results);
                        startPrompts();
                    }
                )
            });
        });
};

//add an employee
function addEmployee() {
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "Enter Employee's First Name: "
        },
        {
            name: "lastName",
            type: "input",
            message: "Enter Employee's Last Name: "
        },
        {
            name: "role",
            type: "list",
            message: "What is the Employee's Role? ",
            choices: selectRole()
        },
        {
            name: "choice",
            type: "rawlist",
            message: "Who is the Employee's Manager? ",
            choices: selectManager()
        }
    ]).then(function (val) {
        const roleId = selectRole().indexOf(val.role) + 1;
        const managerId = selectManager().indexOf(val.choice) + 1;
        connection.query("INSERT INTO employee SET ?",
            {
                first_name: val.firstName,
                last_name: val.lastName,
                manager_id: managerId,
                role_id: roleId
            }, function (err) {
                if (err) throw err
                printTable(val);
                startPrompts();
            })
    })
};

//update role
function updateEmployeeRole() {
    connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;",
        function (err, results) {
            if (err) throw err
            printTable(results);
            inquirer.prompt([
                {
                    name: "lastName",
                    type: "rawlist",
                    choices: function () {
                        const lastName = [];
                        for (const i = 0; i < results.length; i++) {
                            lastName.push(res[i].last_name);
                        }
                        return lastName;
                    },
                    message: "What is the Employee's Last Name? ",
                },
                {
                    name: "role",
                    type: "rawlist",
                    message: "What is the Employee's Role new Role? ",
                    choices: selectRole()
                },
            ]).then(function (val) {
                const roleId = selectRole().indexOf(val.role) + 1;
                connection.query("UPDATE employee SET WHERE ?",
                    {
                        last_name: val.lastName
                    },
                    {
                        role_id: roledId
                    },
                    function (err) {
                        if (err) throw err
                        printTable(val);
                        startPrompts();
                    })
            });
        });
};


