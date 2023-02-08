//import { viewAllDepartments, viewAllRoles, viewAllEmployees } from './view';
const view = require("./view");
const inquirer = require('inquirer');
const mysql = require('mysql2');
const { printTable } = require('console-table-printer');



const connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "sisterjo",
    database: "employee_manager_db"
});

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

module.exports = { addDepartment, addRole, addEmployee };