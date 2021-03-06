const auth = require('./AuthUtil'),
    dateUtil = require('./DateUtil'),
    models = require('../models'),
    randomString = require('randomstring');

var htmlMinify = require('html-minifier').minify;

exports.createPost = (req, res) => {
    var authCode = auth.authenticate(req.headers.authorization);

    if (authCode == 404) {
        res.sendStatus(authCode);

        return;
    }

    var body = req.body;

    var postModel = new models.Post();

    postModel.key = randomString.generate(8);
    postModel.title = body.title;
    postModel.subject = body.subject;
    postModel.body = htmlMinify(body.body);
    postModel.imageURL = body.imageURL;

    if (typeof body.categories != 'undefined') {
        postModel.categories = body.categories.split(',');
    }

    postModel.date = new Date();
 
    postModel.save((error) => {
        if (error) {
            console.log('Could not save post.');
        }
    });

    res.send({ key: postModel.key, statusCode: authCode });
}

exports.deletePost = (req, res) => {
    var authCode = auth.authenticate(req.headers.authorization);

    if (authCode == 404) {
        res.sendStatus(authCode);

        return;
    }

    models.Post.deleteOne({ key: req.body.postKey }, (error) => {
        if (error) {
            console.log('Could not remove post with given key.');

            return;
        }

        res.sendStatus(authCode);
    });
}

exports.editPost = (req, res) => {
    var authCode = auth.authenticate(req.headers.authorization);

    if (authCode == 404) {
        res.sendStatus(authCode);

        return;
    }

    var body = req.body;

    models.Post.findOne({ key: body.postKey }, (error, postResult) => {
        if (error) {
            console.log('Could not find the post with given key.');

            return;
        }

        if (body.imageURL != '') {
            postResult.imageURL = body.imageURL;
        }
        
        if (body.title != '') {
            postResult.title = body.title;
        }
        
        if (body.subject != '') {
            postResult.subject = body.subject;
        }

        if (body.body != '') {
            postResult.body = htmlMinify(body.body);
        }

        if (typeof body.categories != 'undefined') {
            postResult.categories = body.categories.split(',');
        }

        postResult.date = new Date();

        postResult.save((error) => {
            if (error) {
                console.log('There was an error processing your post. Could not edit post.');

                return;
            }

            res.sendStatus(authCode);
        })
    });
}

exports.getPost = (postKey, res) => {
    var dateUtil = require('./DateUtil');

    var commentModel = models.Comment,
        postModel = models.Post;

    postModel.findOne({ key: postKey }, (error, postResult) => {
        if (error) {
            console.log('Could not find post with given key.');

            return;
        }

        if (postResult == null) {
            return;
        }

        commentModel.find({ postKey: postKey }, (error, commentResult) => {
            if (error) {
                console.log('There was an error trying to find the comments.');

                return;
            }

            postResult.dateString = dateUtil.getDateString(postResult.date);

            for (var i = 0; i < commentResult.length; i++) {
                commentResult[i].dateString = dateUtil.getDateString(commentResult[i].date);
            }

            res.render('single', { post: postResult, comments: commentResult });

            return;
        });
    });
}

exports.getPosts = (res) => {
    models.Post.find({}, (error, postResults) => {
        if (error) {
            console.log('There are no posts available.');

            return;
        }

        res.render('blog', { posts: assignRows(postResults) });
    });
}

exports.getPostsWithLimit = (res, limit) => {
    models.Post.find({}).sort('-date').exec((error, postResults) => {
        if (error) {
            console.log('Could not fetch posts.');

            return;
        }

        var recentPostsArray = [];

        for (var i = 0; i < limit; i++) {
            recentPostsArray.push(postResults[i]);

            recentPostsArray[i].dateString = dateUtil.getDateString(postResults[i].date);
        }

        res.render('index', { recentPosts: recentPostsArray, posts: assignRows(postResults) });
    });
}

function assignRows(postResults) {
    var alternate = false;
    var counter = 0;

    for (var i = 0; i < postResults.length; i++) {
        if (counter == 0) {
            postResults[i].startRowHTML = '<div class="row row-pb-md">';
            
            if (alternate) {
                postResults[i].rowNumber = 8;
                counter += 4;
            }
            else {
                postResults[i].rowNumber = 4;
            }
        }

        if (typeof postResults[i].rowNumber == 'undefined') {
            postResults[i].rowNumber = 4;
        }

        counter += 4;

        if (counter == 12 || i == (postResults.length - 1)) {
            postResults[i].endRowHTML = '</div>';
            alternate = (!alternate);
            counter = 0;
        }

        var pTagIndex = postResults[i].body.indexOf('<p>');
        postResults[i].sample = postResults[i].body.substring(pTagIndex + 4, 100);
        postResults[i].dateString = dateUtil.getDateString(postResults[i].date);
    }

    return postResults;
}