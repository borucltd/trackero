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


function sqlUpdateEmployee() {

  return("UPDATE ? SET ? = ?, ? = ?, ? = ?, ? =? WHERE id = ? ;");
}



function sqlDelete(input) {

  return("delete" + input);
}

function sqlView(input) {

  switch (input) {
    case 'manager':
      return("SELECT DISTINCT " + input +"_id FROM employee");
      break;
    case 'employee': //this is sick
      return("SELECT ?,?,?,?,? FROM ? LEFT JOIN ? ON ? = ? LEFT JOIN ? ON ? = ? ;");
      break;
    case 'role': //this is sick too
      return("SELECT ?,?,? FROM ? LEFT JOIN ? ON ? = ? ;");
      break;
    case 'genericrole':
      return("SELECT * FROM role");
      break;
    case 'genericmanager':
      return("SELECT DISTINCT manager_id FROM employee");
      break;
    case 'genericdepartment':
        return("SELECT * FROM department");
        break;
    case 'genericemployee':
        return("SELECT * FROM employee");
        break;
  }
}
                

module.exports = {
  sqlAdd: sqlAdd,
  sqlDelete: sqlDelete,
  sqlView: sqlView,
  sqlUpdateEmployee: sqlUpdateEmployee
}