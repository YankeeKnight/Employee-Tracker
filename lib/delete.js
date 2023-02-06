const inquirer = require('inquirer');
const mysql = require('mysql2');
const { printTable } = require('console-table-printer');

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