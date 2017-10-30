var models = require('../models');
var mongoose = require('mongoose');

function encodeUrl(){
	return Math.floor((1+ Math.random()) * 0x100).toString(8).substring(1);
}

exports.getShortenedURL = (req, res) => {
	var url = req.body.url;
  var encode = encodeUrl();
  console.log(encode);
  models.Url.findOne({'originalUrl': url}, (error, urlFromDB) => {
  	if(error){
  		console.log('There was an error');
  	}
  	else if (urlFromDB){
  		console.log('The url exists');
  	}
  	else{
  		var urlObj = new models.Url({
				originalUrl: url,
				newUrl: encode  	
  		});
  		console.log('Saving');
  		urlObj.save((error) => {
  			if(error){
  				console.log('Could not save document to the db');
  			}
  		});
  	}
  });
	res.redirect('/');
};

exports.redirect = (req, res) => {
	var code = req.params.code;
	console.log(code);
	models.Url.findOne({'newUrl': code}, (error, url) => { 
		if(error){
			console.log('There was an error retrieving the url');
		}
		else if(url){
			console.log('Url retrieved');
			res.redirect(301, url.originalUrl);
			next();
		}
	});
};