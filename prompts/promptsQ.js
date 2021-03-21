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
        FROM employee JOIN role
        ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id`;
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res)
        startPrompts(connection);
    });
}

function updateEmRoles(connection) {
    console.log("Updating Employee Role");
    connection.query(`SELECT * FROM employee AS empl
    JOIN role ON empl.role_id = role.id`, function (err, res) {
        if (err) throw err;
        const availableEmployees = res.map(employee => {
            var availableOption = {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }
            return availableOption;
        })
        inquirer.prompt({
            name: "update",
            type: "list",
            message: "Choose an employee to update",
            choices: availableEmployees
        })
            .then(function (answer) {
                connection.query("SELECT id, title FROM role;", function (err, res) {
                    if (err) throw err;
                    const roles = res.map(role => {
                        var roleChoices = {
                            name: role.title,
                            value: role.id
                        }
                        return roleChoices;
                    });
                    inquirer.prompt({
                        name: "roleUpdate",
                        type: "list",
                        message: "Select the new role for the employee",
                        choices: roles
                    }).then(function (answer2) {
                        var values = [answer2.roleUpdate, answer.update];
                        connection.query("UPDATE employee SET role_id = ? WHERE id=?", values, function (err, res) {
                            if (err) throw err;

                            connection.query("SELECT * FROM employee WHERE id=?", answer.update, function (err, res) {
                                if (err) throw err;
                                console.table(res);
                                startPrompts(connection)
                            })
                        })
                    })
                })
            })
    })
}

module.exports = startPrompts;
