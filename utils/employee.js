const inquirer = require("inquirer");
const mainData = require("./datalink");

class Employee {
    constructor(id, firstName, lastName, roleId, managerId) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.roleId = roleId;
        this.managerId = managerId;
    }

    async getEmployeeName() {
        while (!this.firstName) {
            const answ = await inquirer
                .prompt([{
                    type: 'input',
                    message: `What is the employee's first name?`,
                    name: 'firstName',
                },]);
            answ.firstName ? this.firstName = answ.firstName.trim() : console.log('\x1b[31m', `You did not entered employee's first name!!!`, '\x1b[31m');
        }
    }

    async getEmployeeLastName() {
        while (!this.lastName) {
            const answ = await inquirer
                .prompt([{
                    type: 'input',
                    message: `What is the employee's last name?`,
                    name: 'lastName',
                },]);
            answ.lastName ? this.lastName = answ.lastName.trim() : console.log('\x1b[31m', `You did not entered employee's last name!!!`, '\x1b[31m');
        }
    }

    async getRoleId() {
        const roleList = await mainData('SELECT title, employee_role.id AS roleId FROM employee_role GROUP BY title', "get");
        let roleListArray = [];
        roleList.forEach(element => { roleListArray.push(element.title) });

        let { roleFromList } = await inquirer.prompt(
            {
                type: 'list',
                message: "What is the employee's role?.",
                name: 'roleFromList',
                choices: roleListArray,
            },
        );

        roleList.forEach(element => {
            if (element.title === roleFromList) {
                this.roleId = element.roleId;
            }
        });
    }

    async getManagerId() {
        const managersList = await mainData(`SELECT first_name, last_name, title, employee.id AS employeeId FROM employee JOIN employee_role ON employee.employee_role = employee_role.id WHERE title ='Manager'`, "get");
        let managersListArray = [];
        managersList.forEach(element => {
            managersListArray.push((element.first_name + " " + element.last_name + " Employee ID:" + element.employeeId));
        });

        let { assignManager } = await inquirer.prompt(
            {
                type: 'list',
                message: "Who is the employee's manager?.",
                name: 'assignManager',
                choices: managersListArray,
            },
        );

        managersList.forEach(element => {
            if ((element.first_name + " " + element.last_name + " Employee ID:" + element.employeeId) === assignManager) {
                this.managerId = element.employeeId;
            }
        });
    }
}

module.exports = Employee;

