// ===========================================================================
// NPM modules
// ===========================================================================
const inquirer = require('inquirer');
const mysql = require('mysql');

// ===========================================================================
// LOCAL modules
// ===========================================================================
const terminal = require("./local_modules/terminal");
const database = require("./local_modules/database");




// functions taken from GS
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
async function query(command, values) {
    return new Promise((resolve, reject) => {
        connection.query(command, values, (error, results) => {
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


    console.log("let's move on");
    
   

}

// ===========================================================================
// MAIN
// ===========================================================================
main();
