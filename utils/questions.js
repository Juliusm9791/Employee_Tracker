module.exports = [{
    type: 'list',
    message: "What would you like to do?.",
    name: 'whatToDo',
    choices: ["View All Employee", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departaments", "Add Departament", "Quit"],
},
{
    type: 'input',
    message: `What is the name of the departament?`,
    name: 'departamentName',
},
// {
//     type: 'input',
//     message: `What is the name of role?`,
//     name: 'roleName',
// },
// {
//     type: 'input',
//     message: `What is the salary of the role?`,
//     name: 'salary',
// },
// {
//     type: 'list',
//     message: "Which departament does the role belongs to?.",
//     name: 'departmentFromList',
//     choices: ["----- ARRAY FROM department TABLE -----"],
// },
// {
//     type: 'input',
//     message: `What is the employee's first name?`,
//     name: 'firstName',
// },
// {
//     type: 'input',
//     message: `What is the employee's last name?`,
//     name: 'lastName',
// },
// {
//     type: 'list',
//     message: "What is the employee's role?.",
//     name: 'roleFromList',
//     choices: ["----- ARRAY FROM employee_role TABLE -----"],
// },
// {
//     type: 'list',
//     message: "Who is the employee's manager?.",
//     name: 'assignManager',
//     choices: ["----- ARRAY FROM filtered manager's employee TABLE -----"],
// },
{
    type: 'list',
    message: `Which employee's role do you want to update?`,
    name: 'updatedRole',
    choices: ["----- ARRAY FROM employee Name, Last name TABLE -----"],
},
{
    type: 'list',
    message: `Which role do you want to assign for the selested employee?`,
    name: 'assignUpdatedRole',
    choices: ["----- ARRAY FROM employee_role TABLE -----"],
},
]