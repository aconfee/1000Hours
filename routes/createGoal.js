var User = require('../models/User');
var UserHelper = require('../lib/userLib');
var Goal = require('../models/Goal');

// Choose between master, practiced, and custom goal.
// /createGoal
exports.chooseType = function(req, res, next){
	res.render('createGoal/chooseType', {
		title: 'Choose Goal Type'
	});
};

// Fill in the details for a new goal
// /createGoal/:type
exports.detailsForm = function(req, res, next){
	var goalType = req.params.type;
	
	UserHelper.isLoggedIn(req.cookies.uid, next, function(isLoggedIn, user, err){		
		if(isLoggedIn){
			if(goalType === 'master'){
				res.render('createGoal/master', {
					title: 'Create Master Goal'
				});
			}
			else if(goalType === 'practiced'){
				res.render('createGoal/practiced', {
					title: 'Create Practice Goal'
				});
			}
			else if(goalType === 'custom'){
				res.render('createGoal/custom', {
					title: 'Create Custom Goal'
				});
			}
			else{
				console.log('Type specified in route is unrecognized.');
			}
		}
		else{
			res.render('login', {
				title: 'Login'
			});
		}
	});
};

// New goal post request.
// /createGoal/:type
exports.saveDetails = function(req, res, next){
	var goalType = req.params.type;
	var title = req.body.title;
	var description = req.body.description;
	
	UserHelper.isLoggedIn(req.cookies.uid, next, function(isLoggedIn, user){
		if(isLoggedIn){
			console.log('Saving new goal ' + title + ' for ' + user.username);
			
			if(goalType === 'master'){
				console.log('Saving master goal.');
				var monthsToCompleteGoal = req.body.months;
				var daysToCompleteGoal = Math.trunc((monthsToCompleteGoal / 12) * 365);
				var weeksToCompleteGoal = daysToCompleteGoal / 7;
				if(weeksToCompleteGoal < 1){
					weeksToCompleteGoal = 1;
				}
				
				var totalGoalHours = 1000;				
				var date = new Date();	
							
				Goal.create({
					ownername: user.username,
					title: title,
					description: description,
					loggedDayHours: 0,
					loggedWeekHours: 0,
					loggedTotalHours: 0,				
					totalHoursPerDay: totalGoalHours / daysToCompleteGoal,
					totalHoursPerWeek: totalGoalHours / weeksToCompleteGoal,
					totalHoursToGoal: totalGoalHours,
					timerStart: 0,
					startTime: date.getTime(), // Expected % complete = (CurrentTime - startTime)in days / durationDays
					durationDays: daysToCompleteGoal,
					lastUpdateTime: date
				}, function(err){
					if(err) throw err;
					
					console.log('Goal created.');
					res.redirect('/profile');
				});	
			}
			else if(goalType === 'practiced'){
				console.log('Saving practiced goal.');
				
				var hoursPerDay = 0;
				var hoursPerWeek = 0;
				var date = new Date();
				
				var hours = req.body.hours;
				var interval = req.body.interval;
				if(interval === 'day'){
					hoursPerDay = hours;
					hoursPerWeek = hours * 7;					
				}
				else if(interval === 'week'){
					hoursPerDay = hours / 7;
					hoursPerWeek = hours;
				}	
							
				Goal.create({
					ownername: user.username,
					title: title,
					description: description,
					loggedDayHours: 0,
					loggedWeekHours: 0,
					loggedTotalHours: 0,				
					totalHoursPerDay: hoursPerDay,
					totalHoursPerWeek: hoursPerWeek,
					totalHoursToGoal: -1,
					timerStart: 0,
					startTime: date.getTime(), // Expected % complete = (CurrentTime - startTime)in days / durationDays
					durationDays: -1,
					lastUpdateTime: date
				}, function(err){
					if(err) throw err;
					
					console.log('Goal created.');
					res.redirect('/profile');
				});	
			}
			else if(goalType === 'custom'){
				console.log('Saving custom goal.');
				var totalGoalHours = req.body.hours;				
				var date = new Date();	
				var endDate = new Date(req.body.year, req.body.month, req.body.day);
				console.log('Custom end date ' + endDate.toLocaleString());
				if(endDate.getTime() - date.getTime() <= 0){
					return next();
				}
				
				var daysToCompleteGoal = Math.trunc(((endDate.getTime() - date.getTime()) / 86400000));
				var weeksToCompleteGoal = daysToCompleteGoal / 7;
				if(weeksToCompleteGoal < 1){
					weeksToCompleteGoal = 1;
				}
							
				Goal.create({
					ownername: user.username,
					title: title,
					description: description,
					loggedDayHours: 0,
					loggedWeekHours: 0,
					loggedTotalHours: 0,				
					totalHoursPerDay: totalGoalHours / daysToCompleteGoal,
					totalHoursPerWeek: totalGoalHours / weeksToCompleteGoal,
					totalHoursToGoal: totalGoalHours,
					timerStart: 0,
					startTime: date.getTime(), // Expected % complete = (CurrentTime - startTime)in days / durationDays
					durationDays: daysToCompleteGoal,
					lastUpdateTime: date
				}, function(err){
					if(err) throw err;
					
					console.log('Goal created.');
					res.redirect('/profile');
				});	
			}
		}
		else{
			res.render('login', {
				title: 'Login'
			});
		}
	});
};