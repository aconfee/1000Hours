var Goal = require('../models/Goal');

exports.getUserGoals = function(username, next, cb){
	console.log('Finding goals for user ' + username);
	Goal.find({'ownername': username}, function(err, goals){
		if(err) return next(err);
		
		for(var i = 0; i < goals.length; ++i){
			console.log('Updating goal ' + goals[i].title);
			
			var date = new Date();
			var dateUTC = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
			var deltaMillis = dateUTC.getTime() - goals[i].lastUpdateUTC.getTime();
			var deltaHours = deltaMillis / 3600000;
			var deltaDays = deltaMillis / 86400000;
			console.log(date.toLocaleString());
			console.log('Last update hour 0 - 23: ' + goals[i].lastUpdateUTC.getUTCHours());
			console.log('Delta last update hour to now: ' + deltaHours);
			console.log('End of day reset ' + (goals[i].lastUpdateUTC.getUTCHours() + deltaHours) + ' / 24');
			
			console.log('Last update day 0 - 6: ' + goals[i].lastUpdateUTC.getUTCDay());
			console.log('Delta last update day to now: ' + deltaDays);
			console.log('End of week reset ' + (goals[i].lastUpdateUTC.getUTCDay() + deltaDays) + ' / 7')
			
			// If it's a new day, clear day log.
			//if(utc.getUTCHours() === 0){
			if(goals[i].lastUpdateUTC.getUTCHours() + deltaHours > 23){
				console.log('Clearing day log for goal ' + goals[i].title);
				Goal.update({ _id: goals[i]._id }, { $set: { loggedDayHours: 0 } });
			}	
			
			// If it's a new week, clear week log.
			//if(utc.getUTCDay() === 0){
			if(goals[i].lastUpdateUTC.getUTCDay() + deltaDays > 6){
				console.log('Clearing week log for goal ' + goals[i].title);
				Goal.update({ _id: goals[i]._id }, { $set: { loggedWeekHours: 0 } });
			}		
		}
		
		cb(goals);
	});
};