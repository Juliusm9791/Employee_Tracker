module.exports = [{
    type: 'list',
    message: "What would you like to do?.",
    name: 'whatToDo',
    choices: ["View All Employee", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departaments", "Add Departament", "Update Employee Manager", "Quit"],
},
{
    type: 'input',
    message: `What is the name of the departament?`,
    name: 'departamentName',
},
]