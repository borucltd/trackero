const inquirer = require('inquirer');
const mysql = require('mysql');

// database constructor

class database {

  constructor() {

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
          type: 'number',
          default: '3306',
          message: 'Enter your DB port:',
          validate: function( value ) {
            if (value.length) {
              return true;
            } else {
              return 'Enter your DB port:';
            }
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

  }

  setupConnection(answers) {
      return mysql.createConnection({
        host: answers.databaseUrl,
        port: answers.databasePort,
        user: answers.databaseUser,
        password: answers.databasePassword,
        database: answers.databaseName    
      })
  }
     
  }

module.exports = database;
