const inquirer = require('inquirer');
const mysql = require('mysql2');
const { printTable } = require('console-table-printer');

class View {
    constructor() { }
}


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

module.exports = View;