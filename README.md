# Track Employees and Manage data 

## Table of contents
- [Description](#Description)
- [User Story](#User/Story)
- [Installation](#Installation)
- [Usage](#Usage)
- [Framework HTML/JS](#Framework)
- [Credits](#Credits)
- [Contributors](#Contributing)

## Illustration

![sampleReadme](./assets/illustration.gif)

## Description

Is an interface that makes it easier for non-developers to view and interact with information stored in databases. 
   
## User/Story  
```md
As a business owner
I want to be able to view and manage the departments, roles, and employees in my company
So that I can organize and plan my business
```

## Video_demonstration

[![video](/assets/working_process.png)](https://www.youtube.com/watch?v=Qmq0qqcXSIQ "Video demonstration")

## Installation
```md
git clone <https://github.com/VictorCodrean/Track-and-Manage-Employees.git> (to get the code)
npm i              (to install dependencies (...mysql, inquirer, console.table)) 
node <server.js>       (to run the program)
```

## Usage
```md
* Run the app: node server.js
  It will pop up a menu with options of what you can change/add to database...
* Base options
  * Add departments, roles, employees

  * View departments, roles, employees

  * Update employee roles
```
## Framework
* JS - code:
    * modules imported...
        ```
        const mysql = require("mysql");
        require("dotenv").config()
        const inquirer = require("inquirer");
        const cTable = require("console.table");
        ...
        ```
    * mysql
         ```
        connection.query(query, function (err, res) {
          ...
        })

        const connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
           user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
});
        ```
        
   * inquirer
         ```
        inquirer.prompt({
          ...
        }).then(function(){
          ...
        })
          
        ```
## Credits
 * - [StackOverFlow](https://stackoverflow.com/)
 * - [Npm-mysql](https://www.npmjs.com/package/mysql)
 * - [W3Schools](https://www.w3schools.com/sql/)

## Directory
* [GitHub Source](https://github.com/VictorCodrean/Track-and-Manage-Employees)

## Contributing
Victor Codrean    
*  [Repository link:](https://github.com/VictorCodrean/Track-and-Manage-Employees)

Asking me any questions:

<a href="mailto:codreanvictor@gmail.com" style="text-decoration:none"><img height="20" src = "https://img.shields.io/badge/Gmail-c14438?&style=for-the-badge&logo=gmail&logoColor=white&style=plastic"></a>

[<img height="20" src="https://img.shields.io/badge/-GitHub-black.svg?&style=for-the-badge&logo=github&logoColor=white&style=plastic"/>](https://github.com/VictorCodrean)
