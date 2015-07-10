var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var auth = function(req,res,next){
	if(!req.isAuthenticated())
		res.send(401);
	else
		next();
};

passport.use(new LocalStrategy({
	usernameField: 'email'
	},
	function(username, password, done){
		User.findOne({email: username}, function(err, user){
			if(err){return done(err);}
			if(!user){
				return done(null, false, {message: "Incorrect username"});
			}
			if(user.password !== password){
				return done(null, false, {message: "Incorrect password"});
			}
			return done(null, user);
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(_id, done) {
	User.findById(_id, function (err, user) {
		done(err, user);
	});
});

var auth = function(req,res,next){
	if(!req.isAuthenticated())
		res.send(401);
	else
		next();
};

module.exports = function(app){
	app.use(passport.initialize());
	app.use(passport.session());
	app.get('/', function(req, res){
		res.render('index', { title: 'Express' });
	});
	app.get('/users', auth, function(req, res){
		res.send([{name: "user1"}, {name: "user2"}]);
	});
	app.get('/loggedin', function(req,res){
		res.send(req.isAuthenticated() ? req.user: '0');
	});
	app.post('/login', passport.authenticate('local'), function(req,res){
		req.session.user_id = req.user._id
		res.send(req.user);
	});
	app.post('/logout', function(req,res){
		req.logOut();
		res.sendStatus(200);
	})
}