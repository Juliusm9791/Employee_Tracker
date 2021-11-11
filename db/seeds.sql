INSERT INTO department (department_name)
VALUES ("HR"),
       ("Sales"),
       ("Service"),
       ("Accounting");
       
INSERT INTO employee_role (title, salary, department)
VALUES ("Engineer", 100000, 3),
       ("Manager", 150000, 1),
       ("Driver", 70000, 3),
       ("Accountant", 100000, 4);

INSERT INTO employee (first_name, last_name, employee_role, manager_id)
VALUES ("Tom", "TOM1", 1, 3),
       ("Sam", "SAM1", 4, 3),
       ("Bob", "BOBMan", 2, NULL),
       ("John", "JOHN1", 3, 3);     