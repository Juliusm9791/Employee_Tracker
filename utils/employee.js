const inquirer = require("inquirer");

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

    async getRoleId(getRoleId) {
        this.roleId = getRoleId.id;
    }

    async getManagerId(getManagerId) {
        this.managerId = getManagerId.id;
    }
}

module.exports = Employee;