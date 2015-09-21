var Goal = require('../models/Goal');
var self = this;
self.updatesPending = 0;

exports.getUserGoals = function(username, next, cb){
	console.log('Finding goals for user ' + username);
	Goal.find({'ownername': username}, function(err, goals){
		if(err) return next(err);
		
		console.log((new Date()).toLocaleString());
		for(var i = 0; i < goals.length; ++i){
			console.log('Refreshing goal ' + goals[i].title);
			
			// If it's a new day, or one day has elapsed.
			self.newDaySinceLastLogged(goals[i], function(isNewDay){
				if(isNewDay && goals[i].loggedDayHours != 0){
					++self.updatesPending;
					Goal.update({ _id: goals[i]._id }, { $set: { loggedDayHours: 0 } }, function(err, numAffected){
						if(err) cb(err);						
						console.log('Cleared day goal for ' + numAffected);
						--self.updatesPending;
						
						self.updatesArePending(function(updatesPending){
							if(!updatesPending){
								
								// Refresh the list.
								Goal.find({'ownername': username}, function(err, goals){
									return cb(goals);
								});
							}
						});
					});
				}
			});

			// If it's a new week, or one week has elapsed.
			self.newWeekSinceLastLogged(goals[i], function(isNewWeek){
				if(isNewWeek && goals[i].loggedWeekHours != 0){
					++self.updatesPending;
					Goal.update({ _id: goals[i]._id }, { $set: { loggedWeekHours: 0 } }, function(err, numAffected){
						if(err) cb(err);						
						console.log('Cleared week log for goal ' + numAffected);
						--self.updatesPending;
						
						self.updatesArePending(function(updatesPending){
							if(!updatesPending){
								
								// Refresh the list.
								Goal.find({'ownername': username}, function(err, goals){
									return cb(goals);
								});
							}
						});
					});
				}
			});
			
			if(i === goals.length - 1){
				console.log('Loop finished.');
				self.updatesArePending(function(updatesPending){
					if(!updatesPending){
						
						// Refresh the list.
						Goal.find({'ownername': username}, function(err, goals){
							cb(goals);
						});
					}
				});
			}
		}
	});
};

self.updatesArePending = function(cb){
	if(self.updatesPending > 0){
		console.log('Updates are still pending.');
		return cb(true);
	}
	else{
		console.log('Updates are not pending.');
		return cb(false);
	}
}

exports.newDaySinceLastLogged = function(goal, cb){
	var date = new Date();
	var deltaMillis = date.getTime() - goal.lastUpdateTime.getTime();
	var deltaDays = deltaMillis / 86400000;
	
	// If it's a new day, clear day log.
	var dayOfMonthLastLogged = goal.lastUpdateTime.getDate(); // 1 - 31
	var currentDayOfMonth = date.getDate();
				
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
	var deltaMillis = date.getTime() - goal.lastUpdateTime.getTime();
	var deltaDays = deltaMillis / 86400000;
			
	// If it's a new week, clear week log.
	var dayOfWeekLastLogged = goal.lastUpdateTime.getDay(); // 0 - 6
	var currentDayOfWeek = date.getDay();
	
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