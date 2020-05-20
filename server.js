// ===========================================================================
// NPM modules
// ===========================================================================
const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

// ===========================================================================
// LOCAL modules
// ===========================================================================
const terminal = require("./local_modules/terminal");
const database = require("./local_modules/database");
const sql = require("./local_modules/sql");

// ===========================================================================
// FUNCTIONS taken from GS
// ===========================================================================

// Wrap connection.connect() in a promise!
async function connect(connection) {
    return new Promise((resolve, reject) => {
        connection.connect(err => {
            if (err) reject(err); // oh no!
            else resolve(); // oh yeah!            
        })
    })
}

// Wrap connection.query() in a promise!
async function query(command, values,conn) {
    return new Promise((resolve, reject) => {
        //console.log(command + "=" + values );
        conn.query(command, values, (error, results) => {
            if (error) reject(error); // nay!
            else resolve(results); // yay!
        })
    })
}

// main function
async function main() {

    // clean terminal
    terminal.terminalClear();

    // collect database parameters
    const db = new database();
    const answers = await inquirer.prompt(db.questions);
    const connection = db.setupConnection(answers);
    
    await connect(connection);
    console.log(`Connected to ${answers.databaseName}! Session ID: `, connection.threadId);

    // loop here
    let submenu,submenuLevel1,todoLevel1;
    while (true)
    {
        // decide what to do
        const {todo} = await inquirer.prompt(db.toDoQuestions);
      
        switch (todo) {
            case 'Manage department':         
                todoLevel1 = await inquirer.prompt(db.manageDepartment);
                
                switch (todoLevel1.manageD) {
                    case 'Add department':
                        const nameDepartment = await inquirer.prompt(db.addDepartment);
                        const addDepartment = sql.sqlAdd("department");
                        const table = mysql.raw("department");
                        const column = mysql.raw("name");
                        const result = await query(addDepartment,[table,column,nameDepartment.nameD],connection);
                        break;
        
                    case 'Remove department':
                        // collect departments ids
                        const departmentNames = sql.sqlView("genericdepartment");
                        const departments = await query(departmentNames,"department",connection);
                        const names = departments.map(item => item.name);
                        const deleteDepartment = await inquirer.prompt({
                            name: 'depName',
                            type: 'list',
                            message: 'Select department to be removed:',
                            choices: names,
                        });
                        const deleteDepartmentID = departments.filter( (item) => { 
                            if (item.name === deleteDepartment.depName) {
                                return item
                            }
                        });
                        const delDepartment = sql.sqlDelete();
                        const tab = mysql.raw("department");
                        await query(delDepartment,[tab, deleteDepartmentID[0].id],connection);                  
                        break;
                        
                    case 'View department':
                        const viewDepartment = sql.sqlView("genericdepartment");
                        console.table(await query(viewDepartment,"department",connection));
                        break;
                        
                    default:
                        break;
                  }
                break;     

            case 'Manage role':
                todoLevel1 = await inquirer.prompt(db.manageRole);
                
                switch (todoLevel1.manageR) {
                    case 'Add role':
                        // collect departments ids
                        const departmentNames = sql.sqlView("genericdepartment");
                        const departments = await query(departmentNames,"department",connection);
                        const ids = [];
                        for (item of departments) {
                            ids.push(item.id);
                        }
                        const newRole = await inquirer.prompt(db.addRole);
                        newRole.department = await inquirer.prompt({
                            name: 'depId',
                            type: 'list',
                            message: 'Select department id for the role:',
                            choices: ids,
                        });
                        const addRole = sql.sqlAdd("role");
                        const table = mysql.raw("role");
                        const column1 = mysql.raw("title");
                        const column2 = mysql.raw("salary");
                        const column3 = mysql.raw("department_id");
                        //("INSERT INTO ? (?,?,?) VALUES (?,?,?);");
                        const result = await query(addRole,[table, column1,column2, column3, newRole.nameR, newRole.salaryR, newRole.department.depId],connection);
                                                
                        break;
         
                    case 'Remove role':
                        const deleteRole = sql.sqlDelete("role");
                        console.log(deleteRole);
                        break;
                         
                    case 'View roles':
                        

                        const viewRole = sql.sqlView("role");
                        //SELECT ?,?,? FROM ? LEFT JOIN ? ON ? = ? 
                        const arguments = ["role.title",
                        "role.salary",
                        "department.name",
                        "role",
                        "department",
                        "role.department_id",
                        "department.id"];
                        const rawArguments = arguments.map(mysql.raw);                     
                        console.table(await query(viewRole,rawArguments,connection));
                        break;
                         
                    default:
                        break;
                   }
                break;
                
            case 'Manage employee':
                todoLevel1 = await inquirer.prompt(db.manageEmployee);
                switch (todoLevel1.manageE) {
                    case 'Add employee':
                        
                        // collect available ROLE ids
                        const roleNames = sql.sqlView("genericrole");
                        const roles = await query(roleNames,"role",connection);
                        // keep ROLE ids in Rids array
                        const Rids = [];
                        for (item of roles) {
                            Rids.push(item.id);
                        }

                        // collect available MANAGER ids (use select with distinct)
                        const managerNames = sql.sqlView("genericmanager");
                        const managers = await query(managerNames,"employee",connection);
                        // keep MANAGER ids in Mids array
                        const Mids = [];
                        for (item of managers) {
                            // we need string because of null
                            Mids.push(String(item.manager_id));
                        }                                               
                        // collect first_name and last_name
                        const newEmployee = await inquirer.prompt(db.addEmployee);
                        // collect role id and manager id
                        newEmployee.role = await inquirer.prompt({
                            name: 'roleId',
                            type: 'list',
                            message: 'Select role id for the employee:',
                            choices: Rids
                            });
                            
                        newEmployee.manager = await inquirer.prompt({
                            name: 'managerId',
                            type: 'list',
                            message: 'Select role id for the employee:',
                            choices: Mids
                            });                  
                        
                        // obtain SQL query for adding new employee
                        const addEmployee = sql.sqlAdd("employee");
                        const table = mysql.raw("employee");
                        const column1 = mysql.raw("first_name");
                        const column2 = mysql.raw("last_name");
                        const column3 = mysql.raw("role_id");
                        const column4 = mysql.raw("manager_id");
                        // add new employee
                        const result = await query(addEmployee,[table, column1, column2, column3, column4, newEmployee.nameE, newEmployee.lastNameE, newEmployee.role.roleId, newEmployee.manager.managerId],connection);
                       break;
         
                    case 'Update employee':
                        // collect available ROLE ids
                        const UroleNames = sql.sqlView("genericrole");
                        const Uroles = await query(UroleNames,"role",connection);
                        // keep ROLE ids in Rids array
                        const URids = [];
                        for (item of Uroles) {
                            URids.push(item.id);
                        }

                         // collect available MANAGER ids (use select with distinct)
                         const UmanagerNames = sql.sqlView("genericmanager");
                         const Umanagers = await query(UmanagerNames,"employee",connection);
                         // keep MANAGER ids in Mids array
                         const UMids = [];
                         for (item of Umanagers) {
                             // we need string because of null
                             UMids.push(String(item.manager_id));
                         }    
                        
                        // pick up which employee needs to be updated 
                        const viewEmployees = sql.sqlView("genericemployee");
                        const rowdatapackets = await query(viewEmployees,"employee",connection);
                        const employees = [];
                        let record = "";
                        rowdatapackets.forEach(element => {
                            record=`${element.id} ${element.first_name} ${element.last_name} ${element.role_id} ${element.manager_id}`;
                            employees.push(record);
                            
                        });

                        const updateEmployee = await inquirer.prompt({
                            name: 'updateEmployee',
                            type: 'list',
                            message: 'Select employee you want to update:',
                            choices: employees
                            });

                        const updatedEmployee = await inquirer.prompt([
                            {
                                name: 'first_name',
                                type: 'input',
                                default: updateEmployee.first_name, 
                                message: 'Enter new first name:',
                                validate: function( value ) {
                                    if (value.length) {
                                        return true;
                                    } else {
                                        return 'Enter new first name:';
                                    }
                                }
                            },
                            {
                                name: 'last_name',
                                type: 'input',
                                default: updateEmployee.last_name, 
                                message: 'Enter new last name:',
                                validate: function( value ) {
                                    if (value.length) {
                                        return true;
                                    } else {
                                        return 'Enter new last name:';
                                    }
                                }
                            }
                        ]);

                        // collect role id and manager id
                        updatedEmployee.role = await inquirer.prompt({
                            name: 'roleId',
                            type: 'list',
                            message: 'Select new role id for the employee:',
                            choices: URids
                            });
                            
                        updatedEmployee.manager = await inquirer.prompt({
                            name: 'managerId',
                            type: 'list',
                            message: 'Select new manager id for the employee:',
                            choices: UMids
                            });   

                        
                        console.log(updateEmployee.updateEmployee[0]);
                        console.log(updatedEmployee);

                        //UPDATE ? SET ? = ?, ? = ?, ? = ?, ? =? WHERE id = ? ;
                        
                        
                        const uEmployee = sql.sqlUpdateEmployee();                      
                        const Uarguments = [mysql.raw("employee"),
                        mysql.raw("first_name"),
                        updatedEmployee.first_name,
                        mysql.raw("last_name"),
                        updatedEmployee.last_name,
                        mysql.raw("role_id"),
                        updatedEmployee.role.roleId,
                        mysql.raw("manager_id"),
                        updatedEmployee.manager.managerId,
                        updateEmployee.updateEmployee[0]];
                        const results = await query(uEmployee,Uarguments,connection);
                        
                        break;
                         
                    case 'View employees':
                        const viewEmployee = sql.sqlView("employee");
                        //SELECT ?,?,?,?,? FROM ? LEFT JOIN ? ON ? = ? LEFT JOIN ? ON ? = ?
                        const arguments = ["employee.first_name",
                        "employee.last_name",
                        "role.title",
                        "role.salary",
                        "department.name",
                        "employee",
                        "role",
                        "employee.role_id",
                        "role.id",
                        "department",
                        "role.department_id",
                        "department.id"];
                        const rawArguments = arguments.map(mysql.raw);
                        console.table(await query(viewEmployee,rawArguments,connection));
        
                    default:
                        break;
                   }
                break;
                
            default:
                console.log("Thank you, bye!");
                break;
          }
          
        // exit from loop
        if (todo === 'Exit') {
            break;
        }         
    }

    // once we finished with the databse quit the connection
    connection.end();

}

// ===========================================================================
// MAIN
// ===========================================================================
main().catch(err => console.log(err));
