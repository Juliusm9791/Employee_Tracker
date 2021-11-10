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
    case "get":
      const [rows] = await db.execute(table);
      return rows;

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
        const roles = await main('SELECT * FROM employee_role', "get");
        console.table(roles);
        break;

      case "Add Role":
        await addRole();
        break;

      case "View All Departaments":
        const department = await main('SELECT * FROM department', "get");
        console.table(department);
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

async function addRole() {
  let { roleName } = await inquirer.prompt(questions[2]);
  let { salary } = await inquirer.prompt(questions[3]);
  const departmentList = await main('SELECT * FROM department', "get");
  let departamentArray = [];
  departmentList.forEach(element => { departamentArray.push(element.department_name) });

  let { departmentFromList } = await inquirer.prompt(
    {
      type: 'list',
      message: "Which departament does the role belongs to?.",
      name: 'departmentFromList',
      choices: departamentArray,
    },
  );

  let departmentId = null;
  departmentList.forEach(element => {
    if (element.department_name === departmentFromList) {
      departmentId = element.id;
    }
  });

  await main(`INSERT INTO employee_role (title, salary, department) VALUES ("${roleName}", "${salary}", "${departmentId}");`, "insert")
}

startApp();