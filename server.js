const database = require("./local_modules/database");



const myDB = new database("employeedb.cp4ki52legr7.ap-southeast-2.rds.amazonaws.com",
3306,"tracker_admin",'r,#RHh%.g~.6kB@h',"tracker_DB");

myDB.connectDB();
