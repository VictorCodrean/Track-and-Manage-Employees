USE employees_DB;

INSERT INTO department (name)
VALUES ("Management"),
("Engineering"),
("Safety"),
("Sales"),
("Exploration");

INSERT INTO role (title, salary, department_id)
VALUES("Manager", 130000, 1),
("Senior Developer", 110000, 2),
("Junior Developer", 70000, 2),
("Tester", 50000, 2),
("Safety officer", 45000, 3),
("Account Executive", 80000, 4),
("Sales Specialist", 45000, 4),
("Intern", 40000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Snow", 1, NULL),
("Vitea", "Brinzila", 2, 1),
("Cornel", "Cerap", 3, 2),
("Radu", "Brinza", 5, 1),
("Ion", "Andrei", 4, NULL),
("Jora", "Kardan", 7, 8),
("Borea", "Tigan", 8, NULL),
("Ileana", "Frunza", 6, 1);