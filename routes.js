var base64 = require('base-64'),
    dateTime = require('date-and-time'),
    models = require('./models'),
    mongoose = require('mongoose'),
    randomString = require('randomstring');

exports.createPost = (req, res) => {
    var apiKey = base64.decode(req.headers.authorization);

    if (apiKey != process.env.API_KEY) {
        console.log('You do not have a valid api key to continue.');
        res.sendStatus(404);
        return;
    }

    var postModel = new models.Post();

    postModel.key = randomString.generate(8);
    postModel.title = req.body.title;
    postModel.subject = req.body.subject;
    postModel.body = req.body.body;
    postModel.categories = [];
    postModel.date = new Date();
 
    postModel.save((error) => {
        if (error) {
            console.log('Could not save post.');
        }
    });

    res.sendStatus(200);
}

exports.renderPage = (req, res) => {
    var routes = req.url.split('/');
    var url = routes[1];

    switch(url) {
        case '': res.render('index'); break;
        case 'about': res.render('about'); break;
        case 'contact': res.render('contact'); break;
        case 'food': res.render('food'); break;
        case 'travel': res.render('travel'); break;
        case 'blog': res.render('blog'); break;
        case 'post': var postKey = routes[2]; if (postKey == '') { res.redirect('/'); } 
            else { renderPost(routes[2], res); } break;
        default: res.render('index');
    }
}

function renderPost(postKey, res) {
    var commentModel = models.Comment,
        postModel = models.Post;

    postModel.findOne({ key: postKey }, (error, postResult) => {
        if (error) {
            console.log('Could not find post with given key.');
            return;
        }

        commentModel.find({ postKey: postKey }, (error, commentResult) => {
            if (error) {
                console.log('There was an error trying to find the comments.');
            }

            res.render('single', { post: postResult, comments: commentResult });
        });
    });
}