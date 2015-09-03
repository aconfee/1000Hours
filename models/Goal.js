var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Goal = new Schema({
	ownername: String,
	title: String,
	description: String,
	daylog: Number,
	weeklog: Number,
	totallog: Number,
	enddate: Date	
});

module.exports = mongoose.model('Goal', Goal);