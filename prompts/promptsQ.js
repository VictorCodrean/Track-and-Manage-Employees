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
            "Update employees roles",
            "Remove a department",
            "Remove role",
            "Remove employee",
            "Quit"
        ]
    })
        .then(function (answer) {
            switch (answer.action) {
                case "Add department":
                    addDeppartment(connection);
                    break;
                case "Add role":
                    addRole(connection);
                    break;
                case "Add employee":
                    addemployee(connection);
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
                    updateEmRole(connection);
                    break;
                case "Remove a department":

                    removeDepartment(connection);
                    break;
                case "Remove role":
                    removeRole(connection);
                    break;
                case "Remove employee":
                    removeEmployee(connection);
                    break;
                case "Quit":
                    quitPrompts(connection);
                    break;
            }
        })
}

function viewDepartments(connection) {
    var query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res)
        menuOrQuit(connection);
    });
};

function viewRoles(connection) {
    var query = "SELECT * FROM role";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res)
        menuOrQuit(connection);
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
        menuOrQuit(connection);
    });
}

function updateEmRole(connection) {
    console.log("Updating Employee Role");
    connection.query(`SELECT id, first_name, last_name FROM employee;`, function (err, res) {
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
                                menuOrQuit(connection)
                            })
                        })
                    })
                })
            })
    })
}

function addDeppartment(connection) {
    inquirer.prompt([{
        name: "departmentName",
        type: "input",
        message: "Insert the name of the department to be added"
    }])
        .then(function (answer) {
            var query = `INSERT INTO department (name) VALUES (?)`
            connection.query(query, answer.departmentName, (err, res) => {
                if (err) throw err;
                console.log("Department added");
                connection.query(`SELECT * FROM department`, (err, res) => {
                    console.table(res);
                    menuOrQuit(connection);
                })
            });
        })
}

function addRole(connection) {
    console.log("Adding a new role");
    inquirer.prompt([{
        name: "title",
        type: "input",
        message: "Type in the name/title of new role"
    },
    {
        name: "salary",
        type: "input",
        message: "Type in the salary for the respective title"
    },
    {
        name: "department_id",
        type: "input",
        message: "Type in the departmend Id"
    }
    ]).then(function (answer) {
        var query = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
        var roleValues = [answer.title, answer.salary, answer.department_id];
        connection.query(query, roleValues, (err, res) => {
            if (err) throw err;
            var show = "SELECT * FROM role";
            connection.query(show, (err, res) => {
                if (err) throw err;
                console.table(res);
                menuOrQuit(connection);
            });
        });
    });
};

function addemployee(connection) {
    console.log("Adding a new employee");
    var query = "SELECT * FROM role";
    connection.query(query, (err, res) => {
        if (err) throw err;
        // console.log(res);
        var rolesArr = res.map(role => {
            var object = {
                name: role.title,
                value: role.id
            }
            return object
        })
        // console.log(rolesArr);
        inquirer.prompt([{
            name: "first_name",
            type: "input",
            message: "Type in the first name"
        }, {
            name: "last_name",
            type: "input",
            message: "Type in the last name"
        }, {
            name: "role_id",
            type: "list",
            message: "What's the title/role name?",
            choices: rolesArr
        }
        ]).then(function (answer) {
            connection.query(`SELECT id, first_name, last_name FROM employee;`, (err, res) => {
                if (err) throw err;
                const availableEmployees = res.map(employee => {
                    var availableOption = {
                        name: `${employee.first_name} ${employee.last_name}`,
                        value: employee.id
                    }
                    return availableOption;
                })
                inquirer.prompt({
                    name: "manager_id",
                    type: "list",
                    message: "Who is his manager?",
                    choices: [{ name: "none", value: null }].concat(availableEmployees)
                }).then(function (answer2) {
                    var query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)";
                    var valuesEmpl = [answer.first_name, answer.last_name, answer.role_id, answer2.manager_id];
                    connection.query(query, valuesEmpl, (err, res) => {
                        if (err) throw err;
                        var show = "SELECT * FROM employee";
                        connection.query(show, (err, res) => {
                            if (err) throw err;
                            console.log(`Employee ${answer.first_name} ${answer.last_name} added`);
                            console.table(res);
                            menuOrQuit(connection);
                        });
                    });
                });
            });
        });
    });
};

function removeDepartment(connection) {
    connection.query("SELECT id, name FROM department;", (err, res) => {
        if (err) throw err;
        console.log(res);
        const allDepartments = res.map(department => {
            var returnedDepartments = {
                name: `${department.name}`,
                value: department.id
            }
            return returnedDepartments;
        })
        // console.log(allDepartments);

        inquirer.prompt({
            name: "remove",
            type: "list",
            message: "Select a desired department to be removed",
            choices: allDepartments
        }).then(function (answer) {
            // console.log(answer);
            connection.query("DELETE FROM department WHERE id=?;", [answer.remove], (err, res) => {
                if (err) throw err;
                console.log(`department with id: ${answer.remove}  deleted.`);
                menuOrQuit(connection)
            })
        })
    })
}

function removeRole(connection) {
    connection.query(`SELECT id, title FROM role;`, (err, res) => {
        if (err) throw err;
        console.log(res[0].name);
        // var titleDelete = res.name;
        var arrTitles = res.map(availableTitles => {
            var titlesObject = {
                name: `${availableTitles.title}`,
                value: availableTitles.id
            }
            return titlesObject
        });

        console.log(arrTitles);
        inquirer.prompt({
            name: "remove",
            type: "list",
            message: "Select a role to be removed",
            choices: arrTitles
        }).then(function (answer) {
            connection.query("DELETE FROM role WHERE id =?;", [answer.remove], (err, res) => {
                if (err) throw err;
                // console.log(`Role/title: ${titleDelete} deleted`);
                menuOrQuit(connection);
            });
        });
    });
};

function menuOrQuit(connection) {
    inquirer.prompt({
        name: "mainMenu",
        type: "list",
        message: "Go back to Main Menu?",
        choices: [
            "Yes, back to main Menu",
            "No, exit!"
        ]
    }).then(function (answer) {
        switch (answer.mainMenu) {
            case "Yes, back to main Menu":
                startPrompts(connection);
                break;
            case "No, exit!":
                quitPrompts(connection);
                break;
        }
    });
};

function quitPrompts(connection) {
    console.log("The app is stopped!");
    connection.end();
}

module.exports = startPrompts;
