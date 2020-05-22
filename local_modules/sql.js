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

function sqlView(input) {

  switch (input) {
    case 'manager':
      return("SELECT DISTINCT " + input +"_id FROM employee");
      break;
    case 'employee': 
      return("SELECT ?,?,?,?,? FROM ? LEFT JOIN ? ON ? = ? LEFT JOIN ? ON ? = ? ;");
      break;
    case 'role': 
      return("SELECT ?,?,? FROM ? LEFT JOIN ? ON ? = ? ;");
      break;
    case 'deleterole':
      //select role.id, role.title, department.name from role left join department on role.department_id = department.id;
      return("SELECT ?, ?, ? FROM ? LEFT JOIN ? ON ? = ?"); 
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

function sqlUpdateEmployee() {
  return("UPDATE ? SET ? = ?, ? = ?, ? = ?, ? =? WHERE id = ? ;");
}

function sqlDelete() {
  return("DELETE FROM ? WHERE id=?;");
}


                

module.exports = {
  sqlAdd: sqlAdd,
  sqlDelete: sqlDelete,
  sqlView: sqlView,
  sqlUpdateEmployee: sqlUpdateEmployee
}