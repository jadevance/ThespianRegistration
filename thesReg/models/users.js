var app = require("../app");
var db = app.get("db");

var Users = function() {};

Users.findOrMakeUser = function(userSessionInfo, callback) {
	db.users.findOne({google_id: userSessionInfo.id}, function(error, user) {
		if (error) {
			callback(error, undefined)
		} else if (!user) {
			db.users.save({google_id: userSessionInfo.id,
											email: userSessionInfo.emails[0].value,
											first_name: userSessionInfo.name.givenName,
											last_name: userSessionInfo.name.familyName},
				function(error, newUser) {
					if (error || !newUser) {
						callback(error, undefined)
					} else {
						callback(null, newUser)
					}
				})
		} else {
			callback(null, user)
		}
	})
};

module.exports = Users;