var Credentials = require('../models/Credentials');

// Login post request
exports.userLogin = function(req, res, next){
	console.log('Logging in.');
	
	// Get username and pass from form
	var username = req.body.username;
	var password = req.body.password;
	
	// Find the user
	console.log('Finding the user...');
	Credentials.find({'username': username}, function(err, users){
		if(users.length === 0){
			console.log('No user with the name ' + username + ' could be found.');
			
			res.render ('login', {
				title: 'Login',
				message: 'No user with the name ' + username + ' could be found.'
			});
			
		}
		else{
			// Incorrect password.
			if(users[0].password != password){
				console.log('Incorrect password entered.');				
				res.render('login', {
					title: 'Login',
					message: 'Incorrect password entered.'
				});
			}
			else{
				console.log('Successfully logged in.');	
				
				// Save the uid to both login and profile.
				res.cookie('uid', users[0]._id, { 
					path: '/profile', 
					maxAge: 900000, 
					httpOnly: true 
				});
				
				res.cookie('uid', users[0]._id, { 
					path: '/login', 
					maxAge: 900000, 
					httpOnly: true 
				});
				
				res.redirect('/profile');
			}			
		}	
	});
};

// The login form.
exports.form = function(req, res, next){
	var uid = req.cookies.uid;
	
	// Known bug https://github.com/Automattic/mongoose/pull/3271
	if(typeof uid === 'undefined'){
		console.log('No user with the id ' + uid + ' could be found.');	
		res.render('login', {
			title: 'Login'
		});
		return;
	}
	
	Credentials.findById(uid, function(err, user){
		if(err) return next(err);

		// If corresponding user doens't exist, redirect to login.
		if(user){
			console.log('Found user ' + user.username + ' already logged in.');	
			res.redirect('/profile');		
		}
		else{
			console.log('No user with the id ' + uid + ' could be found.');	
			res.render('login', {
				title: 'Login'
			});
		}
	});
};