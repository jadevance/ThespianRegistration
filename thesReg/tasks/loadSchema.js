var massive = require('massive');
var config = require("../config.js")

var db = massive.connectSync({connectionString : config.connectionString});

// These comments are copypasta and can maybe be removed
// setup is named such because the folder in db is called setup.
// setup is also a property of the db object
// created a namespace for these scripts
db.schema([], function(err, res) {
    // if (err) {
    //   throw(new Error(err.message))
    // }
    console.log("Yay schema!");
    process.exit();
});

