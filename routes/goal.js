var Goal = require('../models/Goal');

exports.toggleTimer = function(req, res, next){
	console.log('Toggling the timer');
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
				Goal.update({ _id: goalId }, { $set: { timerStart: Date.now() }}, function(){
					res.redirect('/profile');
				});
			}
			// If the timer has already been started, find the elapsed time and log it.
			else{
				var deltaTime = Date.now() - goal.timerStart;
				console.log('Ending timer with ' + deltaTime + ' miliseconds.');
				
				var date = new Date();
				var dateUTC = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
				console.log('Time added to: ' + goal.title + '. ' + date.toLocaleString)
				
				Goal.update({ _id: goalId }, {
					$set: { 
						loggedDayHours: goal.loggedDayHours + (deltaTime / 3600000),
						loggedWeekHours: goal.loggedWeekHours + (deltaTime / 3600000),
						loggedTotalHours: goal.loggedTotalHours + (deltaTime / 3600000),
						timerStart: 0,
						lastUpdateUTC: dateUTC
					}
				}, 
				function(){
					res.redirect('/profile');
				});
			}
		}
		else{
			next(err);
		}
	});
};