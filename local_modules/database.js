// import mysql module
const mysql = require("mysql");

// database cuntructor
function initateDatabase (databaseUrl,databasePort,databaseUser,databasePassword,databaseName)  {
    
    // attributes
    this.databaseUrl= databaseUrl;
    this.databasePort = databasePort;
    this.databaseUser = databaseUser;
    this.databasePassword = databasePassword;
    this.databaseName = databaseName;

    // method to connect to DB
    this.connectDB = function () {

        // define connection 
        const connection = mysql.createConnection({
            host: this.databaseUrl,
            port: this.databasePort,
            user: this.databaseUser,
            password: this.databasePassword,
            database: this.databaseName
        });

        connection.connect(function(err) {
            if (err) {
                console.error("Error connecting to " + databaseName);
               //console.error("Error connecting to " + databaseName + " : " + err.stack);
                return;
            }
            console.log("Connected to " + databaseName + " as id " + connection.threadId);
            });
        } 

    // method to query DB
    this.queryDB = function (sql,parameters) {

        connection.query(sql, parameters, function(err, result) {
            if (err) {
              return res.status(500).end();
            }
        });
    }
}

module.exports = initateDatabase;