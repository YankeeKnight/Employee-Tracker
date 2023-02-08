const inquirer = require('inquirer');
const mysql = require('mysql2');
const { printTable } = require('console-table-printer');

const view = require("./view");

const connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "sisterjo",
    database: "employee_manager_db"
});

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

                        view.viewAllEmployees();
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

                        view.viewAllEmployees();
                    });
                });
            });
        });
    });
};

module.exports = { updateEmployeeRole, updateManager };