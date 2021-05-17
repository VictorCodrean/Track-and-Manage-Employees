USE employees_DB;

SELECT
        employee.id AS ID,
        employee.first_name AS First_Name,
        employee.last_name AS Last_Name,
        role.title AS Title,
        role.salary AS Salary,
        department.name AS Department
        FROM employee 
        JOIN role ON (employee.role_id = role.id)
        JOIN department ON department.id = role.department_id
        
         
  SELECT
 	 	role.title AS Title,
		role.salary AS Salary,
        department.name AS Department,
        department.id AS Dep_Id
		FROM role
        JOIN department ON (role.department_id = department.id)
        