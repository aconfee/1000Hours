var User = require('../models/User');
var UserHelper = require('../lib/userLib');

var Goal = require('../models/Goal');
var GoalHelper = require('../lib/goalLib');

// Get user info and display it. Profile GET method.
exports.show = function(req, res, next){
	var uid = req.cookies.uid;	
	UserHelper.isLoggedIn(uid, next, function(isLoggedIn, user){
		if(isLoggedIn){
			GoalHelper.getUserGoals(user.username, next, function(goals){				
				console.log('Rendering profile.');
				
				res.render('profile', {
					title: 'Profile',
					username: user.username,
					goals: goals
				});	
			});				
		}
		else{
			res.redirect('/login');	
		}
	});
};