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

    this.toDoQuestions = [
      {
        name: 'todo',
        type: 'list',
        message: 'What would you like to do?:',
        choices: [
        'Manage department',
        'Manage role',
        'Manage employee',
        'Generic operations',
        'Exit']
      }
    ];

    this.manageDepartment = [
      {
        name: 'manageD',
        type: 'list',
        message: 'What would you like to do?:',
        choices: [
        'Add department',
        'Remove department',
        'View department']
      }
    ];

    this.manageRole = [
      {
        name: 'manageR',
        type: 'list',
        message: 'What would you like to do?:',
        choices: [
        'Add role',
        'Remove role',
        'View roles']
      }
    ];

    this.manageEmployee = [
      {
        name: 'manageE',
        type: 'list',
        message: 'What would you like to do?:',
        choices: [
        'Add employee',
        'Remove employee',
        'View employees']
      }
    ];

    this.genericOperations = [
      {
        name: 'manageE',
        type: 'list',
        message: 'What would you like to do?:',
        choices: [
        'Add employee',
        'Remove employee',
        'View employees']
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
