// const mysql = require('mysql2/promise');
const inquirer = require("inquirer");
const questions = require("./utils/questions");
const cTable = require('console.table');
const mainData = require("./utils/datalink");
const Employee = require("./utils/employee");
const Role = require("./utils/role");

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
        console.log("\x1b[33m", "Good bye!", "\x1b[33m")
        process.exit();
    }
  }
}

async function addRole() {
  let role = new Role();
  await role.getRoleTitle();
  await role.getRoleSalary();
  await role.getDepartmentId();
  await mainData(`INSERT INTO employee_role (title, salary, department) VALUES ("${role.title}", "${role.salary}", "${role.departmentId}");`, "insert")
  console.log("\x1b[33m", "Role added!", "\x1b[33m")
}

async function addEmployee() {
  let employee = new Employee();
  await employee.getEmployeeName();
  await employee.getEmployeeLastName();
  await employee.getRoleId();
  await employee.getManagerId();
  await mainData(`INSERT INTO employee (first_name, last_name, employee_role, manager_id) VALUES ("${employee.firstName}", "${employee.lastName}", "${employee.roleId}" , "${employee.managerId}");`, "insert")
  console.log("\x1b[33m", "Employee added!", "\x1b[33m")
}

startApp();
