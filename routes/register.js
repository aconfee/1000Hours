var Credentials = require('../models/Credentials');
var bcrypt = require('bcrypt');

// Register post request.
exports.userRegister = function(req, res, next){
	// TODO: get credentials from form
	var username = req.body.username;
	var password = req.body.password;
	var passwordConfirm = req.body.passwordConfirm;
	
	if(password != passwordConfirm){
		res.render('register', {
			title: 'Register', 
			message: 'Passwords do not match.'
		});
		
		return;		
	}
	
	Credentials.find({username: username}, function(err, users){
		if(err) return next(err);

		console.log(users);
		// If username already exists, don't register.
		if(users.length > 0){
			console.log('Found user ' + users[0].username + ' already exists.');	
			res.render('register', {
				title: 'Register', 
				message: 'User already exists.'
			});	
		}
		else{
			console.log('Passwords match and no user exists. Creating user...');
	
			// Hash password
			hashPassword(password, function(err, hash, salt){
				if(err) return next(err);
				console.log('Password hashed.');
				
				// Add new user to the db.
				Credentials.create({
					username: username,
					password: hash, 
					salt: salt
				}, function(err){
					if(err) throw err;
					
					console.log('Successfully registered user.');
					res.redirect('/login');
				});
			});
		}
	});
};

// The login form.
exports.form = function(req, res, next){
	res.render('register', {
		title: 'Register'
	});
};

// Secure the password.
var hashPassword = function(password, fn){
	bcrypt.genSalt(12, function(err, salt){
		if(err) return fn(err);
		bcrypt.hash(password, salt, function(err, hash){
			if(err) return fn(err);
			fn(err, hash, salt);
		});
	});
};