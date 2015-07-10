var mongoose = require('mongoose');
var User = mongoose.model('User');
var data = {};

data.addu = function(req,res){
	var user = new User({fname:req.body.fname, lname:req.body.lname, email:req.body.email, password:req.body.password, created_at: new Date()})
	user.save(function(err, response){
		if(err){
			console.log("Error")
		}
		else{
			res.json(response);
		}
	})
}
data.showoneu = function(req,res){
	User.find({_id:req.session.user_id}, function(err, results){
		res.json(results);
	})
}
module.exports = data;