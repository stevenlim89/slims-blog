var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    shortUrl = require('./processing/url');

// set views directory
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/public/views');
app.use(express.static(__dirname + '/public'));

// Body parser for req.body
var parser = {
	body: require('body-parser')
};
app.use(parser.body.urlencoded({ extended: true }));
app.use(parser.body.json());

// Post and Get methods
app.get('/', (req, res) => {
	res.render('home');
});

app.get('/:code', shortUrl.redirect);

app.post('/getShortenedURL', shortUrl.getShortenedURL);

// Database stuff
var port = 5000;
mongoose.connect('mongodb://stallen:hello@ds011258.mlab.com:11258/heroku_q93csxz1');
var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'Unsuccessful connection'));
connection.once('open', (callback) => {
	console.log('Connection was successful');
});

app.listen(port, (req, res) => {
	console.log(`Listening on port ${port}`);
});