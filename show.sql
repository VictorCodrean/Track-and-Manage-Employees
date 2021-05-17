USE employees_DB;

SELECT
        employee.id AS ID,
        employee.first_name AS First_name,
        employee.last_name AS Last_name,
        role.title AS Title,
        role.salary AS Salary,
        department.name AS Department,
        employee.manager_id AS ManagerId,
		employee.last_name AS Manager
        FROM employee 
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        INNER JOIN employee ON employee.manager_id = employee.id
        
        -- employees.CONCAT(first_name, last_name) AS Manager
        -- employee.name AS Manager
        -- WHERE manager_id = employee.id
        -- JOIN employee ON employee.manager_id = employee.id
        SELECT 
				employee.manager_id AS ManagerId,
				employee.last_name AS Manager
				FROM employee 
                INNER JOIN employee ON employee.id = employee.manager_id
		