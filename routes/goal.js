var Goal = require('../models/Goal');
var GoalHelper = require('../lib/goalLib');

// goal toggle timer get
// /goal/:goalId/toggleTimer
exports.toggleTimer = function(req, res, next){
	var goalId = req.params.goalId;
	
	if(typeof goalId === 'undefined'){
		console.log('Goal id provided in params is undefined.');
		res.redirect('/profile');	
	}
	
	Goal.findById(goalId, function(err, goal){
		if(goal){
			// If the timer has not already been started, start it.
			if(goal.timerStart === 0){
				console.log('Starting timer.');
				Goal.update({ _id: goalId }, { $set: { timerStart: Date.now(), lastUpdateTime: new Date() }}, function(){
					res.redirect('/profile');
				});
			}
			// If the timer has already been started, find the elapsed time and log it.
			else{
				var deltaTime = Date.now() - goal.timerStart;
				console.log('Ending ' + goal.title + ' timer with ' + deltaTime + ' milliseconds.');
				
				var date = new Date();
				
				// Update everything.
				Goal.update({ _id: goalId }, {
					$set: { 
						loggedDayHours: goal.loggedDayHours + (deltaTime / 3600000),
						loggedWeekHours: goal.loggedWeekHours + (deltaTime / 3600000),
						loggedTotalHours: goal.loggedTotalHours + (deltaTime / 3600000),
						timerStart: 0
					}
				}, 
				function(){					
					// Only log current day hours for day log. (If user ended timer on different day than start.)
					var midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0,0,0);
					GoalHelper.newDaySinceLastLogged(goal, function(isNewDay){
						if(isNewDay){
							var hoursSinceMidnight = (date.getTime() - midnight.getTime()) / 3600000;
							Goal.update({ _id: goalId }, { $set: { loggedDayHours: hoursSinceMidnight, }}, function(){
								console.log('Past midnight since timer start. Time added: ' + hoursSinceMidnight);
							});
						}
					});
					
					// Only log current week hours for week log. (If user ended timer on different week than start).
					var midnightSunday = new Date(date.getFullYear(), date.getMonth(), (date.getDate() - date.getDay()), 0,0,0);
					GoalHelper.newWeekSinceLastLogged(goal, function(isNewWeek){
						if(isNewWeek){
							var hoursSinceMidnightSunday = (date.getTime() - midnightSunday.getTime()) / 3600000;
							console.log('Hours since midnight Sunday ' + hoursSinceMidnightSunday);
							Goal.update({ _id: goalId }, { $set: { loggedWeekHours: hoursSinceMidnightSunday, }}, function(){
								console.log('Past Sunday midnight since timer start. Time added: ' + hoursSinceMidnightSunday);
							});
						}
					});
					
					// Finished updating. Update last update time.
					Goal.update({ _id: goalId }, { $set: { lastUpdateTime: date, }}, function(){
						console.log('Goal ' + goal.title + ' updated on ' + date.toLocaleString());
					});
					
					res.redirect('/profile');
				});
			}
		}
		else{
			next(err);
		}
	});
};

// GET edit page
// /goal/:goalId/edit
exports.edit = function(req, res, next){
	console.log('edit page');
	var goalId = req.params.goalId;
	
	if(typeof goalId === 'undefined'){
		console.log('Goal id provided in params is undefined.');
		res.redirect('/profile');	
	}
	
	Goal.findById(goalId, function(err, goal){
		if(goal){
			var goalType = goal.goalType;
			switch(goalType){
				case 'master':
					res.render('editGoal/master', {
						title: 'Edit Master Goal',
						goalId: goalId
					});
					break;
				case 'practiced':
					res.render('editGoal/practiced', {
						title: 'Edit Practice Goal',
						goalId: goalId
					});
					break;
				case 'custom':
					res.render('editGoal/custom', {
						title: 'Edit Custom Goal',
						goalId: goalId
					});
					break;
				default:
					next(err);
			}
		}
		else{
			next(err);
		}
	});
};

// /goal/:goalId/delete
exports.delete = function(req, res, next){
	var goalId = req.params.goalId;
	console.log('deleting goal');
	
	if(typeof goalId === 'undefined'){
		console.log('Goal id provided in params is undefined.');
		res.redirect('/profile');	
	}
	
	Goal.remove({ _id: goalId }, function(err){
		if(err) return next(err);
		
		res.redirect('/profile');
	});
};

// POST
// /goal/:goalId/edit
exports.updateTime = function(req, res, next){
	var goalId = req.params.goalId;
	var hours = parseFloat(req.body.hours);
	var minutes = parseFloat(req.body.minutes);
	var action = req.body.action;
	
	hours = isNaN(hours) ? 0 : hours;
	minutes = isNaN(minutes) ? 0 : minutes / 60;	
	var time = hours + minutes;
	
	if(typeof goalId === 'undefined'){
		console.log('Goal id provided in params is undefined.');
		res.redirect('/profile');	
	}
	
	Goal.findById(goalId, function(err, goal){
		if(goal){
			var loggedDay = goal.loggedDayHours;
			var loggedWeek = goal.loggedWeekHours;
			var loggedTotal = goal.loggedTotalHours;
			
			if(action === 'remove'){
				console.log('Removing time manually.');
				loggedDay = Math.max(0, loggedDay - time);
				loggedWeek = Math.max(0, loggedWeek - time);
				loggedTotal = Math.max(0, loggedTotal - time);
			}
			else if(action === 'add'){
				console.log('Adding time manually.');
				loggedDay = loggedDay + time;
				loggedWeek = loggedWeek + time;
				loggedTotal = loggedTotal + time;
			}
			
			Goal.update({ _id: goalId }, { $set: { loggedDayHours: loggedDay, loggedWeekHours: loggedWeek, loggedTotalHours: loggedTotal }}, function(){
				console.log('Time for goal ' + goal.title + ' was updated manually.');
			});
			
			res.redirect('/profile');
		}
		else{
			next(err);
		}
	});
};