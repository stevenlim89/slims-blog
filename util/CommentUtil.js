const models = require('../models');

exports.createComment = (req, res) => {
    var postKey = req.body.postKey;

    var commentModel = new models.Comment();
    
    commentModel.postKey = postKey;
    commentModel.firstName = req.body.firstName;
    commentModel.lastName = req.body.lastName;
    commentModel.subject = req.body.subject;
    commentModel.body = req.body.body;
    commentModel.date = new Date();
    
    commentModel.save((error) => {
        if (error) {
            console.log('Was not able to save comment.');

            return;
        }
    });

    res.redirect('/post/' + postKey);
}