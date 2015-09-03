var Goal = require('../models/Goal');

exports.getUserGoals = function(username, next, cb){
	console.log('Finding goals for user ' + username);
	Goal.find({'ownername': username}, function(err, goals){
		if(err) return next(err);
		cb(goals);
	});
};