var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    secret: 'awesome',
    resave: false,
    saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, './client')));
require('./config/mongoose.js');
require('./config/passport.js')(app);
require('./config/routes.js')(app);
app.listen(8000, function(){
	console.log('on 8000');
})