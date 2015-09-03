var User = require('../models/User');

exports.isLoggedIn = function(uid, next, cb){
	
	// Known bug https://github.com/Automattic/mongoose/pull/3271
	if(typeof uid === 'undefined'){
		console.log('No user with the id ' + uid + ' could be found.');			
		return cb(false);
	}

	User.findById(uid, function(err, user){
		if(err) return next(err);

		// Check if user is already logged in.
		if(user){
			console.log('Found user ' + user.username + ' already logged in.');	
			return cb(true, user);
		}
		else{
			console.log('No user with the id ' + uid + ' could be found.');			
			return cb(false);
		}		
	});
};