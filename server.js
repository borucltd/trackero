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
    let submenu;
    while (true)
    {
        // decide what to do
        const {todo} = await inquirer.prompt(db.toDoQuestions);
      
        switch (todo) {
            case 'Manage department':
                 submenu = db.manageDepartment;
                break;

            case 'Manage role':
                 submenu = db.manageRole;
                break;
                
            case 'Manage employee':
                 submenu = db.manageEmployee;
                break;
                
            case 'Generic operations':
                 submenu = db.genericOperations;
                break;
                
            default:
                console.log("Thank you, bye!");
                break;
          }
          
        // exit from loop
        if (todo === 'Exit') {
            break;
        } else {
            
            const next1 = await inquirer.prompt(submenu);
            console.log(next1);
            const result = await query('SELECT * FROM  ? ', [mysql.raw("department")],connection);
            console.table(result);
        }


        
    }

    // once we finished with the databse quit the connection
    connection.end();

}

// ===========================================================================
// MAIN
// ===========================================================================
main().catch(err => console.log(err));
