const inquirer = require('inquirer');


function sqlAdd(what) {

  switch (what) {
    case 'department':
      return("INSERT INTO ? (?) VALUES (?);");
      break;
    case 'role':
      return("INSERT INTO ? (?,?,?) VALUES (?,?,?);");
      break;
    case 'employee':
      return("INSERT INTO ? (?,?,?,?) VALUES (?,?,?,?);");
      break;
  }

}


function sqlDelete(input) {

  return("delete" + input);
}

function sqlView(input) {
  switch (input) {
    case 'manager':
      return("SELECT DISTINCT " + input +"_id FROM employee");
      break;
    default: 
      return("SELECT * FROM " + input);
      break;
  }
}
                

module.exports = {
  sqlAdd: sqlAdd,
  sqlDelete: sqlDelete,
  sqlView: sqlView
}