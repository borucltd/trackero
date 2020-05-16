// ===========================================================================
// MODULES global
// ===========================================================================
const inquirer = require('inquirer');

function askDbDetails () {

    const questions = [
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
        name: 'username',
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
        name: 'password',
        type: 'password',
        message: 'Please enter your password:',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your password:';
          }
        }
      }
    ];
    
    return inquirer.prompt(questions);
  },
};


module.exports = askDbDetails;