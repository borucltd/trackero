BEGIN;

USE tracker_DB;

-- define departments
INSERT INTO department (name)
VALUES 
("management"), 	-- 1
("marketing"), 		-- 2
("it"), 			-- 3
("finance"), 		-- 4
("sales"), 			-- 5
("hr"), 			-- 6 
("purchase");		-- 7

-- define roles per department
INSERT INTO role (title,salary,department_id)
VALUES 
("ceo","125000.00",1),  			-- 1
("cto", "115000.00",1), 			-- 2
("cro", "110000.00",1),				-- 3
("team_manager","100000.10",1),		-- 4
("team_manager","99000.10",2),		-- 5
("team_manager","98000.10",3), 		-- 6
("team_manager","97000.10",4), 		-- 7
("team_manager","96000.10",5), 		-- 8
("team_manager","95000.10",6), 		-- 9
("team_manager","94000.10",7), 		-- 10
("senior", "95000.205",2), 			-- 11
("junior", "48600.05",2),			-- 12
("senior", "95000.205",3), 			-- 13
("junior", "48600.05",3),			-- 14
("accountant","80000.150",4), 		-- 15
("assistant","75000.546",4),		-- 16
("senior", "95000.205",5), 			-- 17
("junior", "48600.05",5),			-- 18
("senior", "95000.205",6), 			-- 19
("junior", "48600.05",6),			-- 20
("senior", "95000.205",7), 			-- 21
("junior", "48600.05",7);			-- 22

-- define employees
INSERT INTO employee (first_name,last_name,role_id)
VALUES 
("Coleen","Baxter",1),		-- 1
("Dwayne","Ho",2),			-- 2
("Jeffrey","Forbes",3);		-- 3

-- 1st level management
INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES 
("Sonia","Austin",4,1), 	-- 4
("Miriam","McDaniel",5,1), 	-- 5
("Zane","Gaines",6,1),		-- 6
("Terry","Lewis",7,1), 		-- 7
("Marci","Quinn",8,1), 		-- 8
("German","Jefferson",9,1),	-- 9
("Maryanne","Mays",10,1);	-- 10

--  define ordinary employees with managers
INSERT INTO employee (first_name ,last_name,role_id,manager_id)
VALUES 
("Theron","Warren",11,4), 
("Ortega","Trent",12,4), 
("Avery","Dougherty",13,5),
("Terry","Lewis",14,5), 
("Lewis","Lewis",15,6), 
("German","Jefferson",16,6),
("Rudolf","Serrano",17,7),
("Keven","Sullivan",18,7),
("Briana","Chaney",19,8),
("Misty","Obrien",20,8),
("Andres","Good",21,9),
("Rose","Henderson",22,9);

COMMIT;
