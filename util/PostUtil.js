const auth = require('./AuthUtil'),
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