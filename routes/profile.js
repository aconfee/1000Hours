var Credentials = require('../models/Credentials');

// Get user info and display it.
exports.show = function(req, res, next){
	console.log('Finding user by id.');

	var uid = req.cookies.uid;
	
	// Known bug https://github.com/Automattic/mongoose/pull/3271
	if(typeof uid === 'undefined'){
		console.log('No user with the id ' + uid + ' could be found.');			
		res.redirect('/login');	
		return;
	}

	Credentials.findById(uid, function(err, user){
		if(err) return next(err);

		// Check if user is already logged in.
		if(user){
			console.log('Found user ' + user.username + ' already logged in.');		
			res.render('profile', {
				title: 'Profile',
				username: user.username
			});	
		}
		else{
			console.log('No user with the id ' + uid + ' could be found.');			
			res.redirect('/login');	
		}		
	});
};

exports.logout = function(req, res, next){
	console.log('Logging out, clearing cookies.');
	res.clearCookie('uid', {path: '/login'});
	res.clearCookie('uid', {path: '/profile'});
	
	console.log('Redirecting to homepage.');	
	res.redirect('/');
};