INSERT INTO department (department_name)
VALUES ("HR"),
       ("Sales"),
       ("Service"),
       ("Accounting");
       
INSERT INTO employee_role (title, salary, department)
VALUES ("Sales Representative", 74000, 2),
       ("Sales Manager", 120000, 2),
       ("HR Manager", 130000, 1),
       ("Office Administrator", 70000, 1),
       ("Service Manager", 110000, 3),
       ("Service Engineer", 120000, 3),
       ("Electrical Engineer", 80000, 3),
       ("Accounting Manager", 115000, 4),
       ("Bookkeeper", 68000, 4),
       ("Accountant", 95000, 4);

INSERT INTO employee (first_name, last_name, employee_role, manager_id)
VALUES ("Shaurya", "Chandler", 1, 2),
       ("Clay", "Stott", 2, NULL),
       ("Sannah ", "Keller", 3, NULL),
       ("Paris", "Marsden", 4, 3),
       ("Harlee", "House", 5, NULL),
       ("Anisah", "Garza", 6, 5),
       ("Bear", "Lawrence", 7, 5),
       ("Macauly", "Fox", 8, NULL),
       ("Julie", "Couch", 9, 8),
       ("Orion", "Gillespie", 10, 8);     