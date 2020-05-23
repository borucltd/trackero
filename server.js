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

    // variables
    let submenu;
    
    const tableD = mysql.raw("department");
    const tableR = mysql.raw("role");
    const tableE = mysql.raw("employee");

    // generate sql queries
    const sqlAddDepartment = sql.sqlInsert("department");
    const sqlAddRole = sql.sqlInsert("role");
    const sqlInsertEmployee = sql.sqlInsert("employee");
    const sqlView = sql.sqlView("generic");                        
    const roleNames = sql.sqlView("single_join");
    const sqlViewManagers = sql.sqlView("unique_ids");
    const sqlViewEmployee = sql.sqlView("double_join"); 
    const sqlDelete = sql.sqlDelete(); 
    const sqlUpdateEmployee = sql.sqlUpdateEmployee();   
            
   

    while (true)
    {
        
        const menu = await inquirer.prompt(db.toDoQuestions);
        
        switch (menu.todo) {
            case 'Manage department':         
                
                submenu = await inquirer.prompt(db.manageDepartment);
                const column = mysql.raw("name");  

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
                        const departments = await db.query(sqlView,tableD,connection);
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
                        
                        try {
                            await db.query(sqlDelete,[tableD, deleteDepartmentID[0].id],connection);
                            console.log(`${deleteDepartmentID[0].name} was removed.`);
                        } catch (error) {
                            console.log(`Error: ${error}`);
                        }            
                        break;
                        
                    case 'View department':
                        
                        console.table(await db.query(sqlView,tableD,connection));
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
                
                switch (submenu.manageR) {

                    case 'Add role':

                        // collect departments names
                        
                        const departments = await db.query(sqlView,tableD,connection);
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
                            await db.query(sqlDelete,[mysql.raw("role"),deleteRoleID],connection);
                            console.log(`${deleteRole.roleName} was deleted.`);

                        } catch (error) {
                            console.log(`${error}`);
                        }
                        break;
                         
                    case 'View roles':
                                  
                        console.table(await db.query(sqlView,tableR,connection));
                        break;
                         
                    default:
                        break;
                   }
                break;

            case 'Manage employee':
                
                submenu = await inquirer.prompt(db.manageEmployee);
 
                // sql arguments
                const RawArgumentsViewEmployee = [
                    "employee.first_name",
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
                    "department.id"
                ];
                const argumentsViewEmployee = RawArgumentsViewEmployee.map(mysql.raw);

                let managers = [];
                let roles = [];
                let Rids = [];
                let Mids = [];
                const columnE1 = mysql.raw("first_name");
                const columnE2 = mysql.raw("last_name");
                const columnE3 = mysql.raw("role_id");
                const columnE4 = mysql.raw("manager_id");               

                switch (submenu.manageE) {

                    case 'Add employee':
                         
                        
                        // collect available ROLE ids
                        roles = await db.query(sqlView,tableR,connection);
                        Rids = [];
                        for (item of roles) {
                            Rids.push(String(item.id));
                        }

                        // collect available MANAGER ids (use select with distinct)
                        managers = await db.query(sqlViewManagers,[columnE4,tableE],connection);
                        Mids = [];
                        for (item of managers) {
                            // we need string because of null
                            Mids.push(String(item.manager_id));
                        }   
                        
                        // collect first_name, last_name, role id and manager_id
                        const newEmployee = await inquirer.prompt(db.addEmployee);

                        newEmployee.role = await inquirer.prompt({
                            name: 'roleId',
                            type: 'list',
                            message: 'Select role for the employee:',
                            choices: Rids
                            });
                            
                        newEmployee.manager = await inquirer.prompt({
                            name: 'managerId',
                            type: 'list',
                            message: 'Select role id for the employee:',
                            choices: Mids
                            });                  

                        // add new employee
                        try {
                            await db.query(sqlInsertEmployee,[tableE, columnE1, columnE2, columnE3, columnE4, newEmployee.nameE, newEmployee.lastNameE, newEmployee.role.roleId, newEmployee.manager.managerId],connection);
                            console.log(`${newEmployee.nameE} ${newEmployee.lastNameE} was added.`);

                        } catch (error) {
                            console.log(`${error}`);
                        }
                                              
                        break;

                    case 'Remove employee':

                        // collect employees who we would like to delete
                        const listOfEmployeesRaw = await db.query(sqlView,tableE,connection);
                        const listOfEmployees = [];
                        for (item of listOfEmployeesRaw) {
                            listOfEmployees.push(item.id + " " +  item.first_name + " " +  item.last_name);
                        }

                        const deleteEmployee = await inquirer.prompt({
                            name: 'employeeName',
                            type: 'list',
                            message: 'Select employee to be removed:',
                            choices: listOfEmployees
                        });

                        // separate role ID
                        const deleteEmployeeID = deleteEmployee.employeeName.split(/\s/g)[0];
                        const sqlDelete = sql.sqlDelete(); 
                        try {
                            await db.query(sqlDelete,[tableE,deleteEmployeeID],connection);
                            console.log(`${deleteEmployee.employeeName} was deleted.`);

                        } catch (error) {
                            console.log(`${error}`);
                        }                    

                        break;
         
                    case 'Update employee':

                        // collect available ROLE ids
                        roles = await db.query(sqlView,tableR,connection);
                        Rids = [];
                        for (item of roles) {
                            Rids.push(String(item.id));
                        }

                        // collect available MANAGER ids (use select with distinct)
                        managers = await db.query(sqlViewManagers,[columnE4,tableE],connection);
                        Mids = [];
                        for (item of managers) {
                            // we need string because of null
                            Mids.push(String(item.manager_id));
                        }   
                        
                        // generate list of employees to choose from 
                        const employees = await db.query(sqlView,tableE,connection);
                        const employeesRecords = [];
                        let employeeRecord = "";
                        employees.forEach(element => {
                            record=`${element.id} ${element.first_name} ${element.last_name} ${element.role_id} ${element.manager_id}`;
                            employeesRecords.push(String(record));
                        });

                        // select an employee from the list
                        const updateEmployee = await inquirer.prompt({
                            name: 'updateEmployee',
                            type: 'list',
                            message: 'Select employee you want to update:',
                            choices: employeesRecords
                            });

                        // new object updated employee first name, last name
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

                        // new object updated employee role id and manager id
                        updatedEmployee.role = await inquirer.prompt({
                            name: 'roleId',
                            type: 'list',
                            message: 'Select new role id for the employee:',
                            choices: Rids
                            });
                            
                        updatedEmployee.manager = await inquirer.prompt({
                            name: 'managerId',
                            type: 'list',
                            message: 'Select new manager id for the employee:',
                            choices: Mids
                            });                      
                        
                        // some arguments need to be escaped
                        const arguments = [
                            mysql.raw("employee"),
                            mysql.raw("first_name"),
                            updatedEmployee.first_name, // new first name
                            mysql.raw("last_name"),
                            updatedEmployee.last_name,  // new last name
                            mysql.raw("role_id"),       
                            updatedEmployee.role.roleId,// new role 
                            mysql.raw("manager_id"),    
                            mysql.raw(updatedEmployee.manager.managerId),  // new manager can also be null...
                            updateEmployee.updateEmployee[0]    // current employee ID doesn't change
                        ];

                        try {
                            
                            const result = await db.query(sqlUpdateEmployee,arguments,connection);
                            console.log(`${updateEmployee.updateEmployee} was updated.`);
                        } catch (error) {
                            
                        }                      
                        break;
                         
                    case 'View employees':
                        
                        try {
                            console.table(await db.query(sqlViewEmployee,argumentsViewEmployee,connection));
                        } catch (error){
                            console.log(`${error}`);
                        }
                       
                        break;
        
                    default:
                        break;
                }

            case 'Exit':
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
