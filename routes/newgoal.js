var User = require('../models/User');
var UserHelper = require('../lib/userLib');
var Goal = require('../models/Goal');

// New goal post request.
exports.createMasterGoal = function(req, res, next){
	var title = req.body.title;
	var description = req.body.description;
	var monthsToCompleteGoal = req.body.months;
	var daysToCompleteGoal = Math.trunc((monthsToCompleteGoal / 12) * 365);
	var totalGoalHours = 1000;
	
	UserHelper.isLoggedIn(req.cookies.uid, next, function(isLoggedIn, user){
		if(isLoggedIn){
			console.log('Saving new goal ' + title + ' for ' + user.username);
			
			var date = new Date();
			var dateUTC = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
				
			Goal.create({
				ownername: user.username,
				title: title,
				description: description,
				loggedDayHours: 0,
				loggedWeekHours: 0,
				loggedTotalHours: 0,				
				totalHoursPerDay: totalGoalHours / daysToCompleteGoal,
				totalHoursPerWeek: totalGoalHours / (daysToCompleteGoal / 7),
				totalHoursToGoal: totalGoalHours,
				timerStart: 0,
				startTime: (new Date()).getTime(), // Expected % complete = (CurrentTime - startTime)in days / durationDays
				durationDays: daysToCompleteGoal,
				lastUpdateUTC: dateUTC
			}, function(err){
				if(err) throw err;
				
				console.log('Goal created.');
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