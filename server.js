const mysql = require("mysql");
require("dotenv").config()
const startPrompts = require("./prompts/promptsQ")

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// connect to the mysql server and start prompts
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    console.log("App starts and listening");
    startPrompts(connection);
});
