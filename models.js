var mongoose = require('mongoose');

/* Blog Post Schema */
var post = new mongoose.Schema({
    key: String,
    imageURL: String,
    title: String,
    subject: String,
    body: String,
    categories: Array,
    date: Date
});

exports.Post = mongoose.model('Post', post);

// Maybe
var picture = new mongoose.Schema({
    url: String,
    title: String,
    location: String,
    body: String,
    igLink: String
});

exports.Picture = mongoose.model('Picture', picture);

/* Comment Schema */
var comment = new mongoose.Schema({
    postKey: String,
	firstName: String,
    lastName: String,
    subject: String,
    body: String,
    date: Date 
});

exports.Comment = mongoose.model('Comment', comment);