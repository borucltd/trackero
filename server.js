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

// main function
async function main() {

    // clean terminal
    terminal.terminalClear();

    // create database objects
    const db = new database();

    // setup connection parameters
    const answers = await inquirer.prompt(db.questions);
    const connection = db.setupConnection(answers);
    
    // connect to database
    try {
        await db.connect(connection);
        console.log(`Connected to ${answers.databaseName}! Session ID: `, connection.threadId);

    } catch (error) {
        console.log(`Can't connect to ${answers.databaseName} !! : ${error}`);
    }

    // variable
    let submenu;
    while (true)
    {
        // main menu
        const menu = await inquirer.prompt(db.toDoQuestions);
        const tableD = mysql.raw("department");
        const tableR = mysql.raw("role");
        const tableE = mysql.raw("employee");
        
        switch (menu.todo) {
            case 'Manage department':         
                
                submenu = await inquirer.prompt(db.manageDepartment);
                const column = mysql.raw("name");
                const sqlAddDepartment = sql.sqlInsert("department");
                const sqlViewDepartments = sql.sqlView("generic");

                switch (submenu.manageD) {

                    case 'Add department':
        
                        const newDepartment = await inquirer.prompt(db.addDepartment);               
                        try {
                            await db.query(sqlAddDepartment,[tableD,column,newDepartment.nameD],connection);
                            console.log(`${newDepartment.nameD} was added.`);
                        } catch (error) {
                            console.log(`Error: ${error}`);
                        }
                        break;
        
                    case 'Remove department':

                        // collect departments ids
                        const departments = await db.query(sqlViewDepartments,tableD,connection);
                        const departmentsNames = departments.map(item => item.name);
                        const deleteDepartment = await inquirer.prompt({
                            name: 'depName',
                            type: 'list',
                            message: 'Select department to be removed:',
                            choices: departmentsNames
                        });
                        // this is id of the department to be removed
                        const deleteDepartmentID = departments.filter( (item) => { 
                            if (item.name === deleteDepartment.depName) {
                                return item
                            }
                        });
                        const sqlDeleteDepartment = sql.sqlDelete();
                        try {
                            await db.query(sqlDeleteDepartment,[tableD, deleteDepartmentID[0].id],connection);
                            console.log(`${deleteDepartmentID[0].name} was removed.`);
                        } catch (error) {
                            console.log(`Error: ${error}`);
                        }            
                        break;
                        
                    case 'View department':
                        
                        console.table(await db.query(sqlViewDepartments,tableD,connection));
                        break;
                        
                    default:
                        break;
                  }
                break;

            case 'Manage role':

                submenu = await inquirer.prompt(db.manageRole);
                
                const column1 = mysql.raw("title");
                const column2 = mysql.raw("salary");
                const column3 = mysql.raw("department_id");
                const sqlAddRole = sql.sqlInsert("role");
                const sqlViewRoles = sql.sqlView("generic");

                const rawViewArguments = ["role.title",
                        "role.salary",
                        "department.name",
                        "role",
                        "department",
                        "role.department_id",
                        "department.id"];
                const viewArguments = rawViewArguments.map(mysql.raw);  


                const rawRemoveArguments = ["role.id",
                        "role.title",
                        "department.name",
                        "role",
                        "department",
                        "role.department_id",                     
                        "department.id"];

                const removeArguments = rawRemoveArguments.map(mysql.raw);  

                const deleteSql = sql.sqlDelete(); 
                
                switch (submenu.manageR) {

                    case 'Add role':

                        // collect departments names
                        const sqlViewDepartments = sql.sqlView("generic");
                        const departments = await db.query(sqlViewDepartments,tableD,connection);
                        const departmentsNames = [];
                        for (item of departments) {
                            departmentsNames.push(String(item.name));
                        }

                        const newRole = await inquirer.prompt(db.addRole);

                        department = await inquirer.prompt({
                            name: 'depName',
                            type: 'list',
                            message: 'Select department name for the role:',
                            choices: departmentsNames
                        });

                        // this is id of the department to be removed
                        let useDepartmentID = departments.filter( (item) => { 
                         
                            if (item.name === department.depName) {
                                return item.id;
                            }
                        });

                        try {
                            await db.query(sqlAddRole,[tableR, column1, column2, column3, newRole.nameR, newRole.salaryR, useDepartmentID[0].id],connection);
                            console.log(`${newRole.nameR} was added.`);
                        } catch (error) {
                            console.log(`${error}`);
                        }                    
                        break;
         
                    case 'Remove role':

                        // collect role ids and respective departments' names
                        const roleNames = sql.sqlView("single_join");
                        
                        const roles = await db.query(roleNames,removeArguments,connection);
                        const rolesList = [];
                        for (item of roles) {
                            rolesList.push(item.id + " " +  item.title + " " +  item.name);
                        }

                        const deleteRole = await inquirer.prompt({
                            name: 'roleName',
                            type: 'list',
                            message: 'Select role to be removed:',
                            choices: rolesList
                        });

                        // separate role ID
                        const deleteRoleID = deleteRole.roleName.split(/\s/g)[0];
                        
                        try {
                            await db.query(deleteSql,[mysql.raw("role"),deleteRoleID],connection);
                            console.log(`${deleteRole.roleName} was deleted.`);

                        } catch (error) {
                            console.log(`${error}`);
                        }
                        break;
                         
                    case 'View roles':
                                  
                        console.table(await db.query(sqlViewRoles,tableR,connection));
                        break;
                         
                    default:
                        break;
                   }
                break;


                break;                
            case 'Manage employee':
                submenu = await inquirer.prompt(db.manageEmployee);
                break;               
            case 'Exit':
                console.log("Thank you, bye!");
                break;
          }


          
        // exit from loop
        if (menu.todo === 'Exit') {
            break;
        }         
    }
  
    // disconnect from database
    try {
        connection.end();
        console.log(`Session disconnected.`);
    } catch (error) {
        console.log(`Error in disconnecting : ${error}`);
    } 
}

// ===========================================================================
// MAIN
// ===========================================================================
main().catch(err => console.log(err));
