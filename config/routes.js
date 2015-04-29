var data = require('./../server/controllers/adscopes.js');
module.exports = function(app){
	app.post('/add_user', function(req,res){
		data.addu(req,res);
	})
}