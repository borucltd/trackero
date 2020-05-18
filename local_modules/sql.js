const inquirer = require('inquirer');


function sqlAdd(input) {
  return("adddddd" + input);

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