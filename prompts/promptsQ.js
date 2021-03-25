const inquirer = require("inquirer");
const cTable = require("console.table");

// Start promptsQuestion
function startPrompts(connection) {
    const options = [
        "Add department",
        "Add role",
        "Add employee",
        "View departments",
        "View roles",
        "View employees",
        "Update employees role",
        "Remove a department",
        "Remove role",
        "Remove employee",
        "Quit"
    ];
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "Select an option from given choices:",
        choices: options
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
                case "Update employees role":
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
                    // employeesList(connection);
                    quitPrompts(connection);
                    break;
            }
        })
}

function viewDepartments(connection) {
    var query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
        if (err) throw err;
        if (res.length === 0) {
            console.log("No departments available.");
            menuOrQuit(connection);
        } else {
            console.table(res)
            menuOrQuit(connection);
        }
    });
};

function viewRoles(connection) {
    var query = "SELECT * FROM role";
    connection.query(query, function (err, res) {
        if (err) throw err;
        if (res.length === 0) {
            console.log("No roles available.");
            menuOrQuit(connection);
        } else {
            console.table(res)
            menuOrQuit(connection);
        }
    });
}

function viewEmployees(connection) {
    var query = `SELECT
        employee.id AS ID,
        employee.first_name AS First,
        employee.last_name AS Last,
        role.title AS Title,
        role.salary AS Salary,
        department.name AS Department,
        department.id AS depId
        FROM employee JOIN role
        ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id`;
    connection.query(query, function (err, res) {
        if (err) throw err;
        if (res.length === 0) {
            console.log("No employees available.");
            menuOrQuit(connection);
        } else {
            console.table(res)
            menuOrQuit(connection);
        }
    });
}

function updateEmRole(connection) {
    console.log("Updating Employee Role");
    connection.query(`SELECT id, first_name, last_name FROM employee;`, function (err, res) {
        if (err) throw err;
        if (res.length === 0) {
            console.log(`.....Oooops.....\nNo employees available.`);
            menuOrQuit(connection);
            return;
        }
        const availableEmployees = res.map(employee => {
            var availableOption = {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }
            return availableOption;
        })
        inquirer.prompt({
            name: "employee_id",
            type: "list",
            message: "Choose an employee to update",
            choices: availableEmployees
        }).then(function (answer) {
            connection.query("SELECT id, title FROM role;", function (err, res) {
                if (err) throw err;
                const roles = res.map(role => {
                    var roleChoices = {
                        name: role.title,
                        value: role.id
                    }
                    return roleChoices;
                });
                // console.log(roles);
                inquirer.prompt({
                    name: "roleUpdate",
                    type: "list",
                    message: "Select the new role for the employee",
                    choices: roles
                }).then(function (answer2) {
                    // console.log(answer2);
                    var values = [answer2.roleUpdate, answer.employee_id];
                    // console.log(values);
                    connection.query("UPDATE employee SET role_id = ? WHERE id=?", values, function (err, res) {
                        if (err) throw err;
                        const updatedRole = availableEmployees.find((obj) => obj.value === answer.employee_id);
                        console.log(`${updatedRole.name.toUpperCase()} role Updated! `);
                        const query = `SELECT
		                                        e.id,
                                                e.first_name,
                                                e.last_name,
                                                r.title,
                                                d.name department,
                                                r.salary
	                                            FROM employee e
                                                JOIN role r ON e.role_id = r.id
                                                JOIN department d ON r.department_id = d.id
                                                WHERE e.id=?;`;
                        connection.query(query, answer.employee_id, function (err, res) {
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

                console.log(`Department ${answer.departmentName.toUpperCase()} added`);
                connection.query(`SELECT * FROM department`, (err, res) => {
                    console.table(res);
                    menuOrQuit(connection);
                })
            });
        })
}

function addRole(connection) {
    var depList = [];
    connection.query(`SELECT * FROM department`, function (err, res) {
        if (err) throw err;
        // console.table(res)
        depList = res
        // console.log(depList);
        if (depList.length === 0) {
            console.log(`.....Oooops.....\nNo departments available...\nIn order to add a Role\nyou need to Add a department first.`);
            menuOrQuit(connection);
            return;
        }
        console.log("Adding a new role");
        var query = "SELECT id, name FROM department";
        connection.query(query, (err, res) => {
            console.table(res);
            const departmentsIdAvailable = res.map(obj => {
                var depObjects = {
                    name: obj.name,
                    value: obj.id
                }
                return depObjects;
            })
            // console.log(departmentsIdAvailable);
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
                name: 'department_id',
                type: 'list',
                message: "What's the department for the respective title/role?",
                choices: departmentsIdAvailable
            }
            ]).then(function (answer) {
                var query = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
                var roleValues = [answer.title, answer.salary, answer.department_id];
                // console.log(answer.department_id);
                connection.query(query, roleValues, (err, res) => {
                    if (err) throw err;
                    var show = `SELECT
 	 	                        role.title AS Title,
		                        role.salary AS Salary,
                                department.name AS Department,
                                department.id AS Dep_Id
		                        FROM role
                                JOIN department ON (role.department_id = department.id)`;
                    connection.query(show, (err, res) => {
                        if (err) throw err;
                        console.table(res);
                        const addedRole = departmentsIdAvailable.find((obj) => obj.value === answer.department_id)
                        console.log(`Role ${answer.title.toUpperCase()} added in ${addedRole.name.toUpperCase()} department.`);
                        menuOrQuit(connection);
                    });
                });
            });
        });
    });

};

function addemployee(connection) {
    // var roleList = rolesList(connection);
    // if (roleList.length === 0) {
    //     console.log(`.....Oooops.....\nNo roles available...\nIn order to add an employee\nyou need to Add a role first\nTo add a role\nyou need to have departments available as well`);
    //     menuOrQuit(connection);
    //     return;
    // }
    var roleList = [];
    connection.query(`SELECT * FROM role`, function (err, res) {
        if (err) throw err;
        // console.table(res)
        roleList = res
        // console.log(roleList);
        if (roleList.length === 0) {
            console.log(`.....Oooops.....\nNo roles available...\nIn order to add an employee\nyou need to Add a role first\nTo add a role\nyou need to have departments available as well`);
            menuOrQuit(connection);
            return;
        }
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
                            value: employee.id,
                            id: employee.id
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
    });
};

function removeDepartment(connection) {
    connection.query("SELECT id, name FROM department;", (err, res) => {
        if (err) throw err;
        if (res.length === 0) {
            console.log("No departments available at all");
            menuOrQuit(connection);
            return;
        }
        // console.log(res);
        const returnedDepartments = res.map(department => {
            var returnedDepartment1 = {
                name: `${department.name}`,
                value: department.id
            }
            return returnedDepartment1;
        })
        // console.log(returnedDepartments);

        inquirer.prompt({
            name: "remove",
            type: "list",
            message: "Select a desired department to be removed",
            choices: returnedDepartments
        }).then(function (answer) {
            // console.log(answer);
            const removedDepartment = returnedDepartments.find((obj) => obj.value === answer.remove);
            connection.query("DELETE FROM department WHERE id=?;", [answer.remove], (err, res) => {
                // console.log(removedDepartment);
                if (err) throw err;
                console.log(`${removedDepartment.name.toUpperCase()} department succesfuly deleted.`);

                var query = "SELECT * FROM department";
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    console.table(res)
                    menuOrQuit(connection);
                });
            })
        })
    })
}

function removeRole(connection) {
    connection.query(`SELECT id, title FROM role;`, (err, res) => {
        if (err) throw err;
        if (res.length === 0) {
            console.log("No roles available at all");
            menuOrQuit(connection);
            return;
        }
        var arrTitles = res.map(availableTitles => {
            var titlesObject = {
                name: `${availableTitles.title}`,
                value: availableTitles.id
            }
            return titlesObject;
        });

        // console.log(arrTitles);
        inquirer.prompt({
            name: "remove",
            type: "list",
            message: "Select a role to be removed",
            choices: arrTitles
        }).then(function (answer) {
            connection.query("DELETE FROM role WHERE id =?;", [answer.remove], (err, res) => {
                if (err) throw err;
                // console.log(answer.remove);
                var removedTitle = arrTitles.find((obj) => obj.value === answer.remove)
                // console.log(removedTitle);
                console.log(`Role/title: ${removedTitle.name.toUpperCase()} deleted`);
                menuOrQuit(connection);
            });
        });
    });
};

function removeEmployee(connection) {
    connection.query("SELECT id, first_name, last_name FROM employee;", (err, res) => {
        if (err) throw err;
        if (res.length === 0) {
            console.log("No employess available in dataBase");
            menuOrQuit(connection);
            return;
        }
        console.log(res);
        const availableEmployees = res.map(employee => {
            var availableOption = {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }
            return availableOption;
        });
        // console.log(availableEmployees);
        inquirer.prompt({
            name: "remove",
            type: "list",
            message: "Who you want to be removed?",
            choices: availableEmployees
        }).then(function (answer) {
            // console.log(answer);
            connection.query("DELETE FROM employee WHERE id=?;", [answer.remove], (err, res) => {
                if (err) throw err;
                const emplRemoved = availableEmployees.find((obj) => obj.value === answer.remove);
                // console.log(emplRemoved);
                console.log(`Employee ${emplRemoved.name} removed`);
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

const departmentList = (connection) => {
    // var depList = [];
    // var query = `SELECT * FROM department`
    // connection.query(query, function (err, res) {
    //     if (err) throw err;
    //     // console.table(res)
    //     depList = res
    //     return depList;
    // });
    // console.log(depList);
    // // return depList;
}

const rolesList = (connection) => {
    // var roleList = [];
    // var query = `SELECT * FROM role`
    // connection.query(query, function (err, res) {
    //     if (err) throw err;
    //     // console.table(res)
    //     roleList = res
    //     return roleList;
    // });
    // // console.log(roleList);
    // return roleList;
}
module.exports = startPrompts;
