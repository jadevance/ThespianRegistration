var app = require("../app");
var db = app.get("db");

var Users = function() {};

Users.findOrMakeUser = function(userSessionInfo, callback) {
	db.users.findOne({google_id: userSessionInfo.id}, function(error, user) {
		if (error) {
			callback(error, undefined)
		} else if (!user) {
			const userLevel = Users.userLevel(userSessionInfo.emails[0].value);
			db.users.save({google_id: userSessionInfo.id,
											email: userSessionInfo.emails[0].value,
											first_name: userSessionInfo.name.givenName,
											last_name: userSessionInfo.name.familyName,
											complete_profile: false,
											user_level: userLevel},
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

Users.updateProfile = function(formData, userData, callback) {
	db.users.findOne({id: userData.id}, function(error, user) {
		if (error) {
			callback(error, undefined)
		} else {
			db.users.save({id: user.id,
										first_name: formData.first_name,
										last_name: formData.last_name,
										phone: formData.phone,
										teacher_type: formData.teacher_type, complete_profile: true},
				function(error, updatedUser) {
				if (error) {
					callback(error, undefined);
				} else {
					callback(null, updatedUser);
				}
			})
		}
	})
},

	Users.userLevel = function(email) {
		if (email === process.env.ADMIN1 || email === process.env.ADMIN2) {
			return 1
		} else {
			return 2
		}
	}

module.exports = Users;