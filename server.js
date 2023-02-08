// dependancies
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();

// dependency for where all functions live
const functions = require("./lib/functions.js");

const connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
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

    functions.startPrompts();
});