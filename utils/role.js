const inquirer = require("inquirer");
const mainData = require("./datalink");

class Role {
    constructor(id, title, salary, departmentId) {
        this.id = id;
        this.title = title;
        this.salary = salary;
        this.departmentId = departmentId;
    }

    async getRoleTitle() {
        while (!this.title) {
            const answ = await inquirer
                .prompt([{
                    type: 'input',
                    message: `What is the name of role?`,
                    name: 'roleName',
                },]);
            answ.roleName ? this.title = answ.roleName.trim() : console.log('\x1b[31m', `You did not entered name of role!!!`, '\x1b[31m');
        }
    }

    async getRoleSalary() {
        while (!this.salary) {
            const answ = await inquirer
                .prompt([{
                    type: 'input',
                    message: `What is the salary of the role?`,
                    name: 'salary',
                },]);
            answ.salary ? this.salary = answ.salary.trim() : console.log('\x1b[31m', `You did not entered salary for the role!!!`, '\x1b[31m');
        }
    }

    async getDepartmentId() {
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

        departmentList.forEach(element => {
            if (element.department_name === departmentFromList) {
                this.departmentId = element.id;
            }
        });
    }
}

module.exports = Role;

