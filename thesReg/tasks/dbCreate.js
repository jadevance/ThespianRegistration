var massive = require('massive');
var config = require("../config.js")

var db = massive.connectSync({connectionString : config.connectionString});

db.run("CREATE DATABASE ThespianRegistration;", function(err, res) {
    if (err)
        throw(new Error(err.message));
    console.log(res);
    process.exit();
})