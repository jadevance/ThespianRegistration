var app = require('../app.js');
var db = app.get('db');

var ie_seeds = require("../db/seeds/ie.json");
var ies = ie_seeds.length;

var make = function(){
  for (var ie of ie_seeds) {
    db.event.save(ie, function(err, res) {
      console.log("saved: ", JSON.stringify(res));
      ies--
      if (ies <= 0) {
        process.exit()
      }
    })
  }
};

make();