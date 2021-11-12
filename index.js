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
      case "View All Employee":
        const employees = await mainData(`SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_mane, title, department_name AS department, salary, CONCAT(m.first_name, " ", m.last_name) AS manager
                                        FROM employee e
                                        JOIN employee_role ON e.employee_role = employee_role.id
                                        JOIN department ON employee_role.department = department.id
                                        LEFT JOIN employee m ON e.manager_id = m.id
                                        ORDER BY first_name ASC`, "get");
        console.table("\x1b[32m", employees, "\x1b[32m");
        break;
      case "Add Employee":
        await addEmployee();
        break;
      case "Update Employee Role":
        await updateRole();
        break;
      case "View All Roles":
        const roles = await mainData(`SELECT employee_role.id AS id, title, department.department_name AS department, salary 
                                      FROM employee_role 
                                      JOIN department ON employee_role.department = department.id 
                                      GROUP BY id`, "get");
        console.table("\x1b[32m", roles, "\x1b[32m");
        break;

      case "Add Role":
        await addRole();
        break;

      case "View All Departaments":
        const department = await mainData(`SELECT id, department_name 
                                           FROM department 
                                           GROUP BY department_name 
                                           ORDER BY department_name ASC`, "get");
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
  await mainData(`INSERT INTO employee (first_name, last_name, employee_role) VALUES ("${employee.firstName}", "${employee.lastName}", "${employee.roleId}");`, "insert")
  console.log("\x1b[33m", "Employee added!", "\x1b[33m")
}

async function updateRole() {
  const selectEmployee = await mainData(`SELECT id, first_name, last_name 
                                           FROM employee 
                                           ORDER BY first_name ASC`, "get");

  const selectRole = await mainData(`SELECT id, title
                                     FROM employee_role 
                                     ORDER BY title ASC`, "get");

  let employeeArray = [];
  selectEmployee.forEach(element => { employeeArray.push(element.first_name + " " + element.last_name) });

  let roleArray = [];
  selectRole.forEach(element => { roleArray.push(element.title) });

  let { updatedRole } = await inquirer.prompt({
    type: 'list',
    message: `Which employee's role do you want to update?`,
    name: 'updatedRole',
    choices: employeeArray,
  });

  let { assignUpdatedRole } = await inquirer.prompt({
    type: 'list',
    message: `Which role do you want to assign for the selested employee?`,
    name: 'assignUpdatedRole',
    choices: roleArray,
  });

  let { id: roleId } = selectRole.find(element => element.title === assignUpdatedRole);
  let { id: employeeId } = selectEmployee.find(element => (element.first_name + " " + element.last_name) === updatedRole);

  await mainData(`UPDATE employee
                  SET employee_role =  "${roleId}"
                  WHERE id = "${employeeId}";`, "insert");
  console.log("\x1b[33m", "Employee role updated!", "\x1b[33m")
}

startApp();
