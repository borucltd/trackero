// ===========================================================================
// MODULES global
// ===========================================================================
const path = require('path');



// Function which does the routing to non-api GET requests
function htmlRoutes(server) {

// /notes route
server.get("/notes", function(req, res) {

    
    res.sendFile(path.join(__dirname, "../public/notes.html"));
  });

// /assets/[css|js]/file route
server.get("/assets/:type/:name", function(req, res) {

 

  if (req.params.type === "css" || req.params.type === "js") {
    res.sendFile(path.join(__dirname, `../public/assets/${req.params.type}/${req.params.name}`));

  } else {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  }

});

// anything else will return index.html
server.get("/*", function(req, res) {
    
  
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

}

// module exports function htmlRoutes as object
module.exports = htmlRoutes