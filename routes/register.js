var Credentials = require('../models/Credentials');

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
	
	console.log('Passwords match. Sending data...');
	
	// Add new user to the db.
	Credentials.create({
		username: username,
		password: password
	}, function(err){
		if(err) throw err;
		
		console.log('Successfully registered user.');
		res.redirect('/login');
	});
};

// The login form.
exports.form = function(req, res, next){
	res.render('register', {
		title: 'Register'
	});
};