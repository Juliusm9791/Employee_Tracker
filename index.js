const mysql = require('mysql2/promise');
const inquirer = require("inquirer");
const questions = require("./utils/questions");

async function main(table, key) {
  const db = await mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'Julius123!',
      database: 'company_db'
    },
  );
  switch (key) {
    case "show":
      const [rows] = await db.execute(table);
      console.table(rows)
      break;

    case "insert":
      await db.query(table);
      break;

  }
}

async function startApp() {
  let answer = "";
  while (answer !== "Quit") {
    let { whatToDo } = await inquirer.prompt(questions[0]);
    switch (whatToDo) {
      case "Add Employee":

        break;
      case "Update Employee Role":

        break;
      case "View All Roles":
        await main('SELECT * FROM employee_role', "show")
        break;
        
      case "Add Role":
        let { roleName } = await inquirer.prompt(questions[2]);
        let { salary } = await inquirer.prompt(questions[3]);
        let { departmentFromList } = await inquirer.prompt(questions[4]);
        let test = `INSERT INTO employee_role (title, salary) VALUES ("${roleName}","${salary}");`;
        console.log(test)
        await main(test, "insert")
        break;

      case "View All Departaments":
        await main('SELECT * FROM department', "show")
        break;

      case "Add Departament":
        let { departamentName } = await inquirer.prompt(questions[1]);
        await main(`INSERT INTO department (department_name) VALUES ("${departamentName}");`, "insert")
        break;

      case "Quit":
        answer = "Quit";
        process.exit();
    }
  }
}

startApp();