const inquirer = require("inquirer");
const cTable = require("console.table");

// Start promptsQuestion
function startPrompts(connection) {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "Select an option from given choices:",
        choices: [
            "Add department",
            "Add role",
            "Add employee",
            "View departments",
            "View roles",
            "View employees",
            "Update employees roles"
        ]
    })
        .then(function (answer) {
            switch (answer.action) {
                case "Add department":
                    addDeppartment();
                    break;
                case "Add role":
                    addRole();
                    break;
                case "Add employee":
                    addemployee();
                    break;
                case "View departments":
                    viewDepartments(connection);
                    break;
                case "View roles":
                    viewRoles(connection);
                    break;
                case "View employees":
                    viewEmployees(connection);
                    break;
                case "Update employees roles":
                    updateEmRoles(connection);
                    break;
            }
        })
}

function viewDepartments(connection) {
    var query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res)
        startPrompts(connection);
    });
};

function viewRoles(connection) {
    var query = "SELECT * FROM role";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res)
        startPrompts(connection);
    });
}

function viewEmployees(connection) {
    var query = `SELECT
        employee.id AS ID,
        employee.first_name AS First,
        employee.last_name AS Last,
        role.title AS Title,
        role.salary AS Salary,
        department.name AS Department
        FROM employee INNER JOIN role
        ON (employee.role_id = role.id)
        INNER JOIN department ON role.department_id = department.id`;
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res)
        startPrompts(connection);
    });
}


module.exports = startPrompts;
