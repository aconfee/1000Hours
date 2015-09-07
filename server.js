var http = require('http');
var app = require('./app');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/1000Hours');

var port = Number(process.env.PORT || app.get('port'));

// App main logic
http.createServer(app).listen(port, function(){
	console.log("Express server listening on port " + port);
});