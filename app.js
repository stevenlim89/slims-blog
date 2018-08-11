var express = require('express'),
	handlebars = require("express-handlebars"),
    app = express();

// set views directory
app.engine('html', handlebars({ 
	extname: '.html',
	partialsDir: __dirname + '/public/partials'
}));

app.set('view engine', 'html');
app.set('views', __dirname + '/public');
app.use(express.static(__dirname + '/public'));

// Body parser for req.body
var parser = {
	body: require('body-parser')
};
app.use(parser.body.urlencoded({ extended: true }));
app.use(parser.body.json());

// Get methods
app.get('/', (req, res) => {
	res.render('home');
});

app.get('/about', (req, res) => {
	res.render('about');
});

// Database stuff
var port = 5000;

app.listen(process.env.PORT || port, (req, res) => {
	console.log(`Listening on port ${port}`);
});