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
                        const addDepartment = sql.sqlAdd("department",nameDepartment);
                        console.table(await query(addDepartment,[mysql.raw("department"),mysql.raw("name"),nameDepartment.nameD],connection));
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
                        const addRole = sql.sqlAdd("role");
                        console.log(addRole);
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
                        const addEmployee = sql.sqlAdd("employee");
                        console.log(addEmployee);
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
