const inquirer = require('inquirer');


function sqlAdd(where,what) {

  return("INSERT INTO ? (?) VALUES (?);");

}

function sqlDelete(input) {

  return("delete" + input);
}

function sqlView(input) {
   return("SELECT * FROM " + input);
}

                  

module.exports = {
  sqlAdd: sqlAdd,
  sqlDelete: sqlDelete,
  sqlView: sqlView
}