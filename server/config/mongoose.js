var mongoose = require('mongoose');
var fs = require('fs');

//connect to db
mongoose.connect('mongodb://localhost/eyeChat_db');

//require all models in directory
var models_path = __dirname + '/../models';
fs.readdirSync(models_path).forEach(function(file) {
	if (file.indexOf('.js') > 0) {
		require(models_path + '/' + file);
	}
});