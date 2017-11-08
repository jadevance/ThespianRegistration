var app = require('../app.js');
var db = app.get('db');

var ie_seeds = require("../db/seeds/ie.json");
var ies = ie_seeds.length;

var school_seeds = require("../db/seeds/schools.json");
var schools = school_seeds.length;

var make = function(){
  for (var ie of ie_seeds) {
    db.events.save(ie, function(err, res) {
      ies--
      if ((ies <= 0) && (schools <= 0)) {
        process.exit()
      }
    })
  }

  for (var school of school_seeds) {
    db.schools.save(school, function(err, res) {
      console.log("saved: ", JSON.stringify(res));
      schools--
      if ((ies <= 0) && (schools <= 0)) {
        process.exit()
      }
    })
  }
};

make();