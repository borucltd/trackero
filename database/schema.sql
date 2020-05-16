BEGIN;

DROP DATABASE IF EXISTS tracker_DB;

CREATE DATABASE tracker_DB;

USE tracker_DB;

CREATE USER IF NOT EXISTS 'tracker_admin'@'%' IDENTIFIED BY 'XXXXXXX';
CREATE USER IF NOT EXISTS 'tracker_reader'@'%' IDENTIFIED BY 'XXXXXX';

GRANT ALL ON tracker_DB.* To 'tracker_admin'@'%';
GRANT SELECT ON tracker_DB.* To 'tracker_reader'@'%';
FLUSH PRIVILEGES;

CREATE TABLE department  (

  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
 
);

CREATE TABLE role  (

  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(13, 4),
  department_id INT,
  PRIMARY KEY (id),
  CONSTRAINT fk_departmnet_id FOREIGN KEY (department_id) REFERENCES department(id)
 
);

CREATE TABLE employee  (

  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  PRIMARY KEY (id),
  CONSTRAINT fk_person_id FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
  
);


COMMIT;
