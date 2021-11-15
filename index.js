const inquirer = require("inquirer");
const cTable = require('console.table');
const questions = require("./utils/questions");
const mainData = require("./utils/datalink");
const Employee = require("./utils/employee");
const Role = require("./utils/role");

// ---------- Main function to run APP ----------

async function startApp() {
  let answer = "";
  while (answer !== "Quit") {
    let { whatToDo } = await inquirer.prompt(questions[0]);

    switch (whatToDo) {
      case "View All Employee":
        const employees = await mainData(`SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_mane, title, department_name AS department, salary, CONCAT(m.first_name, " ", m.last_name) AS manager
                                          FROM employee e
                                          LEFT JOIN employee_role ON e.employee_role = employee_role.id
                                          LEFT JOIN department ON employee_role.department = department.id
                                          LEFT JOIN employee m ON e.manager_id = m.id
                                          ORDER BY first_name ASC`, "get");
        console.table("\x1b[32m", employees);
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
                                      GROUP BY id
                                      ORDER BY department_name ASC`, "get");
        console.table("\x1b[32m", roles);
        break;

      case "Add Role":
        await addRole();
        break;

      case "View All Departaments":
        const department = await mainData(`SELECT id, department_name 
                                           FROM department 
                                           GROUP BY department_name 
                                           ORDER BY department_name ASC`, "get");
        console.table("\x1b[32m", department);
        break;

      case "Add Departament":
        let { departamentName } = await inquirer.prompt(questions[1]);
        await mainData(`INSERT INTO department (department_name) VALUES ("${departamentName}");`, "insert");
        console.log("\x1b[33m", "Department added!")
        break;

      case "Update Employee Manager":
        await updateManager();
        break;

      case "View Employees By Manager":
        await managersTeam();
        break;

      case "View Employees By Department":
        await viewByDepartment();
        break;

      case "View departments budgets":
        const budgets = await mainData(`SELECT department.id AS id, department_name, SUM(salary) AS department_budget
                                        FROM employee
                                        JOIN employee_role ON employee_role = employee_role.id
                                        JOIN department ON employee_role.department = department.id
                                        GROUP BY department_name
                                        UNION ALL SELECT '--' id, '----------Total' department_name, SUM(salary)
                                        FROM employee
                                        JOIN employee_role ON employee_role = employee_role.id
                                        JOIN department ON employee_role.department = department.id`, "get");
                                          
        console.table("\x1b[32m", budgets);
        break;

      case "\x1b[7m\x1b[31mDelete From Database\x1b[0m":
        await deleteData();
        break;

      case "\x1b[7m--Quit--\x1b[0m":
        answer = "Quit";
        console.log("\x1b[33m", "Good bye!")
        process.exit();
    }
  }
}

// ---------- Add Role ----------

async function addRole() {
  let role = new Role();
  await role.getRoleTitle();
  await role.getRoleSalary();
  let selectedDep = await selectDepartment(`Which departament does the role belongs to?`);
  await role.getDepartmentId(selectedDep);
  await mainData(`INSERT INTO employee_role (title, salary, department) 
                  VALUES ("${role.title}", "${role.salary}", "${role.departmentId}");`, "insert")
  console.log("\x1b[33m", "Role added!")
}

// ---------- Add Employee ----------

async function addEmployee() {
  let employee = new Employee();
  await employee.getEmployeeName();
  await employee.getEmployeeLastName();
  let selectRol = await selectRole(`What is the employee's role?`);
  await employee.getRoleId(selectRol);
  let selectedMan = await selectManager(`Who is the employee's manager?`, "None");
  await employee.getManagerId(selectedMan);
  await mainData(`INSERT INTO employee (first_name, last_name, employee_role, manager_id) 
                  VALUES ("${employee.firstName}", "${employee.lastName}", "${employee.roleId}", "${employee.managerId}");`, "insert")
  console.log("\x1b[33m", "Employee added!")
}

// ---------- Update role ----------

async function updateRole() {
  let selectedEmp = await selectEmployee(`Which employee's role do you want to update?`);
  let selectRol = await selectRole(`Which role do you want to assign for the selected employee?`);

  await mainData(`UPDATE employee
                  SET employee_role =  "${selectRol.id}"
                  WHERE id = "${selectedEmp.id}";`, "insert");
  console.log("\x1b[33m", "Employee's role updated!")
}

// ---------- Update manager ----------

async function updateManager() {
  let selectedEmp = await selectEmployee(`Which employee's manager do you want to update?`);
  let selectedMan = await selectManager(`Which manager do you want to assign for selected employee?`, "None");

  await mainData(`UPDATE employee
                  SET manager_id = ${selectedMan.id}
                  WHERE id = ${selectedEmp.id};`, "insert");
  console.log("\x1b[33m", "Employee's manager updated!")
}

// --------- View employees by manager ---------

async function managersTeam() {
  let selectedMan = await selectManager(`Which manager's team do you want to view?`)

  let team = await mainData(`SELECT employee.id AS id, first_name, last_name, title 
                             FROM employee
                             JOIN employee_role ON employee.employee_role = employee_role.id
                             WHERE manager_id = "${selectedMan.id}";`, "get");
  console.log("\n\x1b[32m", selectedMan.first_name + " " + selectedMan.last_name + " Team:\n");
  console.table(team)
}

// ---------- View employees by department ----------

async function viewByDepartment() {
  let selectedDep = await selectDepartment(`Which department team do you want to view?`);

  let byDepartment = await mainData(`SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_mane, title, salary
                                     FROM employee e
                                     JOIN employee_role ON e.employee_role = employee_role.id
                                     JOIN department ON employee_role.department = department.id
                                     LEFT JOIN employee m ON e.manager_id = m.id
                                     WHERE department = "${selectedDep.id}"
                                     ORDER BY first_name ASC;`, "get");
  console.log("\n\x1b[32m", selectedDep.department_name + " Employees:\n");
  console.table(byDepartment);
}

// ---------- Delete From Database ----------

async function deleteData() {
  let { whatToDelete } = await listQuestions(`What do you want to delete?`, `whatToDelete`, ["Department", "Role", "Employee"]);
  switch (whatToDelete) {
    case "Department":
      let delDepartment = await selectDepartment("Which department you want to dellete?");
      await mainData(`DELETE FROM department WHERE id = ${delDepartment.id}`, "insert");
      console.log("\x1b[33m", `${delDepartment.department_name} department deleted!`);
      break;

    case "Role":
      let delRole = await selectRole("Which role you want to dellete?");
      await mainData(`DELETE FROM employee_role WHERE id = ${delRole.id}`, "insert");
      console.log("\x1b[33m", `${delRole.title} role deleted!`);
      break;

    case "Employee":
      let delEmployee = await selectEmployee("Which employee you want to dellete?");
      await mainData(`DELETE FROM employee WHERE id = ${delEmployee.id}`, "insert");
      console.log("\x1b[33m", `Employee ${delEmployee.first_name} ${delEmployee.last_name} deleted!`);
      break;
  }
}

// ---------- Select manager ----------

async function selectManager(question, optionalToArray) {
  const selectManager = await mainData(`SELECT employee.id AS id, first_name, last_name, title 
                                        FROM employee 
                                        JOIN employee_role ON employee.employee_role = employee_role.id
                                        WHERE title LIKE "%manager%"
                                        ORDER BY first_name ASC`, "get");

  let managerArray;
  optionalToArray ? managerArray = [optionalToArray] : managerArray = [];
  selectManager.forEach(element => { managerArray.push(element.first_name + " " + element.last_name) });

  let { selectedManager } = await listQuestions(question, `selectedManager`, managerArray);

  let selectedManReturn;
  let selectedMan = selectManager.find(element => (element.first_name + " " + element.last_name) === selectedManager);
  selectedMan ? selectedManReturn = selectedMan : selectedManReturn = { id: null }
  return selectedManReturn;
}

// ---------- Select departmaent ----------

async function selectDepartment(question) {
  const departments = await mainData(`SELECT id, department_name 
                                      FROM department 
                                      GROUP BY department_name 
                                      ORDER BY department_name ASC`, "get");

  let departmentsArray = [];
  departments.forEach(element => { departmentsArray.push(element.department_name) });

  let { selectedDepartment } = await listQuestions(question, `selectedDepartment`, departmentsArray);
  let selectedDep = departments.find(element => (element.department_name) === selectedDepartment);
  return selectedDep;
}

// ---------- Select role ----------

async function selectRole(question) {
  const selectRole = await mainData(`SELECT id, title
                                     FROM employee_role 
                                     ORDER BY title ASC`, "get");

  let roleArray = [];
  selectRole.forEach(element => { roleArray.push(element.title) });

  let { assignUpdatedRole } = await listQuestions(question, `assignUpdatedRole`, roleArray);
  let selectRol = selectRole.find(element => element.title === assignUpdatedRole);
  return selectRol;
}

// ---------- Select employee ----------

async function selectEmployee(question) {
  const selectEmployee = await mainData(`SELECT id, first_name, last_name 
                                         FROM employee 
                                         ORDER BY first_name ASC`, "get");

  let employeeArray = [];
  selectEmployee.forEach(element => { employeeArray.push(element.first_name + " " + element.last_name) });

  let { selectedEmployee } = await listQuestions(question, `selectedEmployee`, employeeArray);
  let idAndEmployee = selectEmployee.find(element => (element.first_name + " " + element.last_name) === selectedEmployee);
  return idAndEmployee;
}

// ---------- Function for list questions ----------

async function listQuestions(question, choiceName, choicesArray) {
  let answer = await inquirer.prompt({
    type: 'list',
    message: question,
    name: choiceName,
    choices: choicesArray,
  });
  return answer;
}

startApp();