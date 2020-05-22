const inquirer = require('inquirer');

function sqlInsert(what) {

  let sqlQuery;

  switch (what) {
    case 'department':
      sqlQuery = "INSERT INTO ? (?) VALUES (?);";
      break;
    case 'role':
      sqlQuery = "INSERT INTO ? (?,?,?) VALUES (?,?,?);";
      break;
    case 'employee':
      sqlQuery = "INSERT INTO ? (?,?,?,?) VALUES (?,?,?,?);";
      break;
  }

  return sqlQuery;
}

function sqlView(what) {

  let sqlQuery;

  switch (what) {
    case 'generic':
      return("SELECT * FROM ? ;");
      break; 
    case 'unique_ids':
      return("SELECT DISTINCT ? FROM ? ;");
      break;
    case 'single_join': 
      return("SELECT ?,?,? FROM ? LEFT JOIN ? ON ? = ? ;");
      break; 
    case 'double_join': 
      return("SELECT ?,?,?,?,? FROM ? LEFT JOIN ? ON ? = ? LEFT JOIN ? ON ? = ? ;");
      break;
       
  }

  return sqlQuery;
}

function sqlUpdateEmployee() {
  return("UPDATE ? SET ? = ?, ? = ?, ? = ?, ? =? WHERE id = ? ;");
}

function sqlDelete() {
  return("DELETE FROM ? WHERE id=? ;");
}
               
module.exports = {
  sqlInsert: sqlInsert,
  sqlDelete: sqlDelete,
  sqlView: sqlView,
  sqlUpdateEmployee: sqlUpdateEmployee
}