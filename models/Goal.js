var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Goal = new Schema({
	ownername: String,
	title: String,
	description: String,
	loggedDayHours: Number,
	loggedWeekHours: Number,
	loggedTotalHours: Number,
	totalHoursPerDay: Number,
	totalHoursPerWeek: Number,
	totalHoursToGoal: Number,
	timerStart: Number,
	startTime: Number,
	durationDays: Number,
	lastUpdateTime: Date,
	goalType: String
});

module.exports = mongoose.model('Goal', Goal);