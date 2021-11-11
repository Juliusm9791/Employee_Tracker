const mysql = require('mysql2/promise');
const inquirer = require("inquirer");
const questions = require("./utils/questions");
const cTable = require('console.table');

async function mainData(table, key) {
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
        await addEmployee();
        break;
      case "Update Employee Role":

        break;
      case "View All Roles":
        const roles = await mainData(`SELECT title FROM employee_role GROUP BY title`, "get");
        console.table("\x1b[32m", roles, "\x1b[32m");
        break;

      case "Add Role":
        await addRole();
        break;

      case "View All Departaments":
        const department = await mainData(`SELECT department_name FROM department GROUP BY department_name`, "get");
        console.table("\x1b[32m", department, "\x1b[32m");
        break;

      case "Add Departament":
        let { departamentName } = await inquirer.prompt(questions[1]);
        await mainData(`INSERT INTO department (department_name) VALUES ("${departamentName}");`, "insert");
        console.log("\x1b[33m", "Department added!", "\x1b[33m")
        break;

      case "Quit":
        answer = "Quit";
        console.log("\x1b[33m", "Good bye!", "\x1b[33m",)
        process.exit();
    }
  }
}

async function addRole() {
  let { roleName } = await inquirer.prompt(questions[2]);
  let { salary } = await inquirer.prompt(questions[3]);
  const departmentList = await mainData('SELECT * FROM department GROUP BY department_name', "get");
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

  await mainData(`INSERT INTO employee_role (title, salary, department) VALUES ("${roleName}", "${salary}", "${departmentId}");`, "insert")
  console.log("\x1b[33m", "Role added!", "\x1b[33m")
}

async function addEmployee() {
  let { firstName } = await inquirer.prompt(questions[4]);
  let { lastName } = await inquirer.prompt(questions[5]);

  const roleList = await mainData('SELECT title, employee_role.id AS roleId FROM employee_role GROUP BY title', "get");
  let roleListArray = [];
  roleList.forEach(element => { roleListArray.push(element.title) });

  const managersList = await mainData(`SELECT first_name, last_name, title, employee.id AS employeeId FROM employee JOIN employee_role ON employee.employee_role = employee_role.id WHERE title ='Manager'`, "get");
  let managersListArray = [];
  managersList.forEach(element => {
    managersListArray.push((element.first_name + " " + element.last_name + " Employee ID:" + element.employeeId));
  });

  let { roleFromList } = await inquirer.prompt(
    {
      type: 'list',
      message: "What is the employee's role?.",
      name: 'roleFromList',
      choices: roleListArray,
    },
  );

  let roleId = null;
  roleList.forEach(element => {
    if (element.title === roleFromList) {
      roleId = element.roleId;
    }
  });

  let { assignManager } = await inquirer.prompt(
    {
      type: 'list',
      message: "Who is the employee's manager?.",
      name: 'assignManager',
      choices: managersListArray,
    },
  );

  let managerId = null;
  managersList.forEach(element => {
    if ((element.first_name + " " + element.last_name + " Employee ID:" + element.employeeId) === assignManager) {
      managerId = element.employeeId;
    }
  });

  await mainData(`INSERT INTO employee (first_name, last_name, employee_role, manager_id) VALUES ("${firstName}", "${lastName}", "${roleId}" , "${managerId}");`, "insert")
  console.log("\x1b[33m", "Employee added!", "\x1b[33m")
}

startApp();
