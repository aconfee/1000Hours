exports.signout = function(req, res, next){
	console.log('Logging out, clearing cookies.');
	res.clearCookie('uid', {path: '/login'});
	res.clearCookie('uid', {path: '/profile'});
	res.clearCookie('uid', {path: '/newgoal'});
	
	console.log('Redirecting to homepage.');	
	res.redirect('/');
};