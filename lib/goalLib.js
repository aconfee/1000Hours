var Goal = require('../models/Goal');
var self = this;

exports.getUserGoals = function(username, next, cb){
	console.log('Finding goals for user ' + username);
	Goal.find({'ownername': username}, function(err, goals){
		if(err) return next(err);
		
		for(var i = 0; i < goals.length; ++i){
			console.log('Updating goal ' + goals[i].title);
			
			// If it's a new day, or one day has elapsed.
			self.newDaySinceLastLogged(goals[i], function(isNewDay){
				if(isNewDay && goals[i].loggedDayHours != 0){
					console.log('Clearing day log for goal ' + goals[i].title);
					Goal.update({ _id: goals[i]._id }, { $set: { loggedDayHours: 0 } }, function(err, numAffected){
						if(err) cb(err);
						console.log('Cleared day goal for ' + numAffected);
					});
				}
			});

			// If it's a new week, or one week has elapsed.
			self.newWeekSinceLastLogged(goals[i], function(isNewWeek){
				if(isNewWeek && goals[i].loggedWeekHours != 0){
					console.log('Clearing week log for goal ' + goals[i].title);
					Goal.update({ _id: goals[i]._id }, { $set: { loggedWeekHours: 0 } }, function(err, numAffected){
						if(err) cb(err);
						console.log('Cleared day goal for ' + numAffected);
					});
				}
			});		
		}
		
		cb(goals);
	});
};

exports.newDaySinceLastLogged = function(goal, cb){
	var date = new Date();
	var dateUTC = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
	var deltaMillis = dateUTC.getTime() - goal.lastUpdateUTC.getTime();
	var deltaDays = deltaMillis / 86400000;
	
	// If it's a new day, clear day log.
	var dayOfMonthLastLogged = goal.lastUpdateUTC.getUTCDate(); // 1 - 31
	var currentDayOfMonth = dateUTC.getUTCDate();
				
	// If it's a new day, or one day has elapsed.
	if (dayOfMonthLastLogged != currentDayOfMonth || // Day rollover under one month
		deltaDays >= 1) // Day rollover on same day next month
	{
		return cb(true);
	}	
	else{
		return cb(false);
	}
}

exports.newWeekSinceLastLogged = function(goal, cb){
	var date = new Date();
	var dateUTC = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
	var deltaMillis = dateUTC.getTime() - goal.lastUpdateUTC.getTime();
	var deltaDays = deltaMillis / 86400000;
			
	// If it's a new week, clear week log.
	var dayOfWeekLastLogged = goal.lastUpdateUTC.getUTCDay(); // 0 - 6
	var currentDayOfWeek = dateUTC.getUTCDay();
	
	// If it's a new week, or one week has elapsed.
	if (currentDayOfWeek - dayOfWeekLastLogged < 0 || // Week rollover in under 7 days
		(currentDayOfWeek === dayOfWeekLastLogged && deltaDays > 5) || // Week rollover on 7th day
		deltaDays >= 7) // Week rollover after 7th day
	{					
		return cb(true);
	}		
	else{
		return cb(false);
	}
}