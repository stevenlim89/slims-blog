var express = require('express'),
	handlebars = require("express-handlebars"),
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

app.get('/*', (req, res) => {
	var url = req.url.split('/')[1];

	switch(url) {
		case '': res.render('index'); break;
		case 'about': res.render('about'); break;
		case 'contact': res.render('contact'); break;
		case 'food': res.render('food'); break;
		case 'travel': res.render('travel'); break;
		case 'blog': res.render('blog'); break;
		default: res.render('index');
	}
});

// Database stuff
var port = 5000;

app.listen(process.env.PORT || port, (req, res) => {
	console.log(`Listening on port ${port}`);
});