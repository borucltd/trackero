const inquirer = require('inquirer');
const mysql = require('mysql');

class database {

  constructor() {

    // question to establish database connection
    this.questions = [
      {
        name: 'databaseUrl',
        type: 'input',
        default: 'employeedb.cp4ki52legr7.ap-southeast-2.rds.amazonaws.com',
        message: 'Enter your DB url:',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Enter your DB url:';
          }
        }
      },
      {
          name: 'databasePort',
          type: 'input',
          default: '3306',
          message: 'Enter your DB port:',
          validate: function( value ) {
            if (value.match(/[0-9]/gi)) { 
              return true;
          }  
              return 'Enter your DB port:';         
          }
        },
      {
        name: 'databaseUser',
        type: 'input',
        default: 'tracker_admin',
        message: 'Enter your DB username:',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Enter your DB username:';
          }
        }
      },
      {
        name: 'databasePassword',
        type: 'password',
        default: 'r,#RHh%.g~.6kB@h',
        message: 'Please enter your password:',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your password:';
          }
        }
      },
      {
          name: 'databaseName',
          type: 'input',
          default: 'tracker_DB',
          message: 'Please enter your DB name:',
          validate: function(value) {
            if (value.length) {
              return true;
            } else {
              return 'Please enter your DB name:';
            }
          }
        }
    ];

    // questions to manage 1st level menu
    this.toDoQuestions = [
      {
        name: 'todo',
        type: 'list',
        message: 'What would you like to do?:',
        choices: [
        'Manage department',
        'Manage role',
        'Manage employee',
        'Exit']
      }
    ];

    // questions to manage department
    this.manageDepartment = [
      {
        name: 'manageD',
        type: 'list',
        message: 'What would you like to do?:',
        choices: [
        'Add department',
        'Remove department',
        'View department',
        'Back']
      }
    ];

    // questions to manage role
    this.manageRole = [
      {
        name: 'manageR',
        type: 'list',
        message: 'What would you like to do?:',
        choices: [
        'Add role',
        'Remove role',
        'View roles',
        'Back']
      }
    ];

     // questions to manage employee
    this.manageEmployee = [
      {
        name: 'manageE',
        type: 'list',
        message: 'What would you like to do?:',
        choices: [
        'Add employee',
        'Remove employee',
        'Update employee',
        'View employees',
        'Back']
      }
    ];

    // questions to add new department
    this.addDepartment = [
      {
        name: 'nameD',
        type: 'input',
        default: 'new_department',
        message: 'Please enter name of the department:',
        validate: function(value) {
            if (value.length) {
              return true;
            } else {
              return 'Please enter name of the department:';
            }
          }
        }
      
    ];

    // questions to add new role
    this.addRole = [
      {
        name: 'nameR',
        type: 'input',
        default: 'new_role',
        message: 'Please enter name of the role:',
        validate: function(value) {
            if (value.length) {
              return true;
            } else {
              return 'Please enter name of the role:';
            }
          }
        },
        {
          name: 'salaryR',
          type: 'input',
          default: '0.0',
          message: 'Please enter salary for the role:',
          validate: function(value) {
              if (value.length) {
                return true;
              } else {
                return 'Please enter salary for the role:';
              }
            }
          }     
    ];

    // questions to add new employee
    this.addEmployee = [
      {
        name: 'nameE',
        type: 'input',
        default: 'new_name',
        message: 'Please enter first name of the employee:',
        validate: function(value) {
            if (value.length) {
              return true;
            } else {
              return 'Please enter first name of the employee:';
            }
          }
        },
        {
          name: 'lastNameE',
          type: 'input',
          default: 'new_last_name',
          message: 'Please enter last name of the employee:',
          validate: function(value) {
              if (value.length) {
                return true;
              } else {
                return 'Please enter last name of the employee:';
              }
            }
          }     
    ];  
  }

  // method to set up DB connection
  setupConnection(answers) {
      return mysql.createConnection({
        host: answers.databaseUrl,
        port: answers.databasePort,
        user: answers.databaseUser,
        password: answers.databasePassword,
        database: answers.databaseName    
      })
  }

  // ===========================================================================
  // FUNCTIONS taken from GS
  // ===========================================================================
  // Wrap connection.connect() in a promise!
  connect(connection) {
    return new Promise((resolve, reject) => {
        connection.connect(err => {
            if (err) reject(err); // oh no!
            else resolve(); // oh yeah!            
        })
    })
  }

  // Wrap connection.query() in a promise!
  query(command, values, conn) {
    return new Promise((resolve, reject) => {
        //console.log(command + "=" + values );
        conn.query(command, values, (error, results) => {
            if (error) reject(error); // nay!
            else resolve(results); // yay!
        })
    })
  }
}

module.exports = database;
