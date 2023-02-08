const inquirer = require('inquirer');
const mysql = require('mysql2');
const { printTable } = require('console-table-printer');

const add = require("./add");
const edit = require("./edit");
const del = require("./delete");

const connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "sisterjo",
    database: "employee_manager_db"
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
                add.addDepartment();
                break;

            case "Add a Role":
                add.addRole();
                break;

            case "Add an Employee":
                add.addEmployee();
                break;

            case "Update Employee Role":
                edit.updateEmployeeRole();
                break;

            case "Update Employee Manager":
                edit.updateManager();
                break;

            case "Delete Department":
                del.delDept();
                break;

            case "Delete Role":
                del.delRole();
                break;

            case "Delete Employee":
                del.delEmp();
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

module.exports = { startPrompts, viewAllDepartments, viewAllRoles, viewAllEmployees, empByDept, empByManager, seeBudget };