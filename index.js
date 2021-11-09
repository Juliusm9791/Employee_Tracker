const mysql = require('mysql2');
const inquirer = require("inquirer");

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'Julius123!',
    database: 'classlist_db'
  },
  console.log(`Connected to the classlist_db database.`)
);

// Query database
db.query('SELECT * FROM department', function (err, results) {
  console.log(results);
});

db.query('SELECT * FROM employee_role', function (err, results) {
  console.log(results);
});

db.query('SELECT * FROM employee', function (err, results) {
  console.log(results);
});