var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	fname: String,
	lname: String,
	email: String,
	password: String,
	created_at: Date,
	jobsid:[String]
})
var User = mongoose.model('User', UserSchema);