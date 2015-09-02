var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/credentials');

var Schema = mongoose.Schema;
var Credentials = new Schema({
	username: String,
	password: String, 
	salt: String
});

module.exports = mongoose.model('Credentials', Credentials);