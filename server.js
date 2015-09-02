var http = require('http');
var app = require('./app');

// App main logic
http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});