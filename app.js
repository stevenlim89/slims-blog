const express = require('express'),
	handlebars = require('express-handlebars'),
	mongoose = require('mongoose'),
	routes = require('./routes');

// Load environment file
require('dotenv').load();

app = express();

var publicDir = __dirname + '/public';

// set views directory
app.engine('html', handlebars({
	extname: '.html',
	partialsDir: publicDir + '/partials'
}));

app.set('view engine', 'html');
app.set('views', publicDir + '/views');
app.use(express.static(publicDir));

// Body parser for req.body
var parser = {
	body: require('body-parser')
};
app.use(parser.body.urlencoded({ extended: true }));
app.use(parser.body.json());

app.get('/*', routes.renderPage);
app.post('/*', routes.performAction);

// Establish mongodb connection
var db = mongoose.connection;

mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true});

db.on('error', console.error.bind(console, 'Mongo DB Connection Error:'));
db.once('open', function(callback) {
    console.log('Database connected successfully.');
});

// Establish port connection
var port = 5000;

app.listen(process.env.PORT || port, (req, res) => {
	console.log(`Listening on port ${port}`);
});