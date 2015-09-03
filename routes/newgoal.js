var User = require('../models/User');
var UserHelper = require('../lib/userLib');
var Goal = require('../models/Goal');

// New goal post request.
exports.createGoal = function(req, res, next){
	var title = req.body.title;
	var description = req.body.description;
	
	UserHelper.isLoggedIn(req.cookies.uid, next, function(isLoggedIn, user){
		if(isLoggedIn){
			console.log('Saving new goal ' + title + ' for ' + user.username);
			
			Goal.create({
				ownername: user.username,
				title: title,
				description: description,
				daylog: 0,
				weeklog: 0,
				totallog: 0,
				enddate: '12/25/2016'
			}, function(err){
				if(err) throw err;
				
				// TODO: Add goal title to user.
				res.redirect('/profile');
			});	
		}
		else{
			res.render('login', {
				title: 'Login'
			});
		}
	});
};

exports.form = function(req, res, next){
	UserHelper.isLoggedIn(req.cookies.uid, next, function(isLoggedIn, user, err){		
		if(isLoggedIn){
			res.render('newgoal', {
				title: 'Create Goal'
			});	
		}
		else{
			res.render('login', {
				title: 'Login'
			});
		}
	});
};