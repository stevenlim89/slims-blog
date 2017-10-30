var mongoose = require('mongoose');

var url = new mongoose.Schema({
	originalUrl: String,
	newUrl: String
});

exports.Url = mongoose.model('Url', url);