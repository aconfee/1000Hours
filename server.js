var http = require('http');
var app = require('./app');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/1000Hours');

// App main logic
http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});