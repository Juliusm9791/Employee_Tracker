module.exports = [{
    type: 'list',
    message: "What would you like to do?.",
    name: 'whatToDo',
    choices: ["View All Employee", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departaments", "Add Departament", "Update Employee Manager", "View Employees By Manager", "View Employees By Department", "View departments budgets", "\x1b[31mDelete From Database\x1b[0m", "\x1b[7m--Quit--\x1b[0m"],
},
{
    type: 'input',
    message: `What is the name of the departament?`,
    name: 'departamentName',
},
]