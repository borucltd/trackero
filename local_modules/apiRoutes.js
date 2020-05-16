// ===========================================================================
// MODULES global
// ===========================================================================
const path = require('path');
const fs = require('fs');
const moment = require('moment');


// Reference to our database
const dbFile = path.join(__dirname, "../db/db.json");


// Callback which reads database
function readDatabase(req, res) {

  // read database

  const data = fs.readFileSync(dbFile);
  
  let records = JSON.parse(data);

  // we send back the whole database
  res.json(records);   
}

// Callback which writes to database
function addToDatabase(req, res) {
  
 

  // read database
  fs.readFile(dbFile, (err, data) => {
    
    if (err) {
    
     throw err;
    }
   
    // we need to parse raw data into JSON
    let records = JSON.parse(data);
        
    // add "id" attribute to a new record - unix timestamp
    req.body.id = moment().unix(Number);
    
    // add new record (from HTTP request) to the existing ones
    records.push(req.body);

    // save to a file
 
    fs.writeFile(dbFile, JSON.stringify(records) , (err) => {
      
      if (err) {
  
       throw err;
      }
      
      // once database is updated we are sending back the same data we received
      res.json(req.body); 
    });
  });   
}

// Callback which deletes and write to database
function deleteFromDatabase(req, res) {



  // sync read the database
  const data = fs.readFileSync(dbFile);
  const records = JSON.parse(data);

  // read id from the DELETE request
  const id = parseInt(req.params.id);

  // empty array and i a helper
  const new_records = [];
  let i =0;

  // iterate over database records
  for (let item of records) {

    // compare id of database record and id of request
    if (parseInt(item.id) === id ) {

    
              
    } else {

      // push record to new array
      new_records[i] = item; 
      i++;

    } 
  }

  // write the whole database

  fs.writeFileSync(dbFile, JSON.stringify(new_records))

  // this is the reponse for DELETE request without any data
  res.end();   

}

// Function which does the routing for API requests
function apiRoutes(server) {

  // GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
  server.get("/api/notes", readDatabase);
   
  // POST `/api/notes` - Should receive a new note to save on the request body, 
  // add it to the `db.json` file, and then return the new note to the client.
  server.post("/api/notes", addToDatabase );

  // * DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete.
  server.delete("/api/notes/:id", deleteFromDatabase );

}

// module exports funciton htmlRoutes as object
module.exports = apiRoutes

