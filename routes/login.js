var User = require('../models/User');
var UserHelper = require('../lib/userLib');
var bcrypt = require('bcrypt');

// Login post request
exports.userLogin = function(req, res, next){
	console.log('Logging in.');
	
	// Get username and pass from form
	var username = req.body.username;
	var password = req.body.password;
	
	// Find the user
	console.log('Finding the user...');
	User.find({'username': username}, function(err, users){
		if(users.length === 0){
			console.log('No user with the name ' + username + ' could be found.');
			
			res.render ('login', {
				title: 'Login',
				message: 'No user with the name ' + username + ' could be found.'
			});
		}
		else{
			console.log('User found, unhashing password.');
			
			// Validate password.			
			bcrypt.hash(password, users[0].salt, function(err, hash){
				if(err) return next(err);
				
				console.log('unhash is: ' + hash);
				
				if(users[0].password != hash){
					console.log('Incorrect password entered.');				
					res.render('login', {
						title: 'Login',
						message: 'Incorrect password entered.'
					});
				}
				else{
					console.log('Successfully logged in.');	
					
					// Save the uid to pages that need to know.
					res.cookie('uid', users[0]._id, { 
						path: '/profile', 
						maxAge: 86400000, 
						httpOnly: true 
					});
					
					res.cookie('uid', users[0]._id, { 
						path: '/login', 
						maxAge: 86400000, 
						httpOnly: true 
					});
					
					res.cookie('uid', users[0]._id, { 
						path: '/createGoal', 
						maxAge: 86400000, 
						httpOnly: true 
					});
					
					res.cookie('uid', users[0]._id, { 
						path: '/createGoal/:type', 
						maxAge: 86400000, 
						httpOnly: true 
					});
					
					res.redirect('/profile');
				}
			});			
		}	
	});
};

// The login form.
exports.form = function(req, res, next){
	UserHelper.isLoggedIn(req.cookies.uid, next, function(isLoggedIn, user){
		if(isLoggedIn){
			res.redirect('/profile');	
		}
		else{
			res.render('login', {
				title: 'Login'
			});
		}
	});
};