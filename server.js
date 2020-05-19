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
        console.log(command + "=" + values );
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
      
       console.log(todo);
        switch (todo) {
            case 'Manage department':         
                todoLevel1 = await inquirer.prompt(db.manageDepartment);
                console.log(todoLevel1);
                switch (todoLevel1.manageD) {
                    case 'Add department':
                        const nameDepartment = await inquirer.prompt(db.addDepartment);
                        const addDepartment = sql.sqlAdd("department");
                        const table = mysql.raw("department");
                        const column = mysql.raw("name");
                        console.table(await query(addDepartment,[table,column,nameDepartment.nameD],connection));
                        break;
        
                    case 'Remove department':
                        const deleteDepartment = sql.sqlDelete("department");
                        console.log(deleteDepartment);
                        break;
                        
                    case 'View department':
                        const viewDepartment = sql.sqlView("department");
                        console.table(await query(viewDepartment,"department",connection));
                        break;
                        
                    default:
                        break;
                  }
                break;     

            case 'Manage role':
                todoLevel1 = await inquirer.prompt(db.manageRole);
                console.log(todoLevel1);
                switch (todoLevel1.manageR) {
                    case 'Add role':
                        // collect departments ids
                        const departmentNames = sql.sqlView("department");
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
                        console.table(await query(addRole,[table, column1,column2, column3, newRole.nameR, newRole.salaryR, newRole.department.depId],connection));
                                                
                        break;
         
                    case 'Remove role':
                        const deleteRole = sql.sqlDelete("role");
                        console.log(deleteRole);
                        break;
                         
                    case 'View roles':
                        const viewRole = sql.sqlView("role");
                        console.table(await query(viewRole,"role",connection));
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
                        const roleNames = sql.sqlView("role");
                        const roles = await query(roleNames,"role",connection);
                        // keep ROLE ids in Rids array
                        const Rids = [];
                        for (item of roles) {
                            Rids.push(item.id);
                        }

                        // collect available MANAGER ids (use select with distinct)
                        const managerNames = sql.sqlView("manager");
                        const managers = await query(managerNames,"employee",connection);
                        // keep MANAGER ids in Mids array
                        const Mids = [];
                        for (item of managers) {
                            // we need string because of null
                            Mids.push(String(item.manager_id));
                        }
                        console.log(Mids)
;                                                
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
                        
                        console.log(newEmployee);

                        // obtain SQL query for adding new employee
                        const addEmployee = sql.sqlAdd("employee");
                        const table = mysql.raw("employee");
                        const column1 = mysql.raw("first_name");
                        const column2 = mysql.raw("last_name");
                        const column3 = mysql.raw("role_id");
                        const column4 = mysql.raw("manager_id");
                        // add new employee
                        console.table(await query(addEmployee,[table, column1, column2, column3, column4, newEmployee.nameE, newEmployee.lastNameE, newEmployee.role.roleId, newEmployee.manager.managerId],connection));
                       break;
         
                    case 'Remove employee':
                        const deleteEmployee = sql.sqlDelete("employee");
                        console.log(deleteEmployee);
                        break;
                         
                    case 'View employees':
                        const viewEmployee = sql.sqlView("employee");
                        console.table(await query(viewEmployee,"employee",connection));
                        break;
                         
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
