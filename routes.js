const commentUtil = require('./util/CommentUtil'), 
    postUtil = require('./util/PostUtil');

exports.renderPage = (req, res) => {
    var routes = req.url.split('/');
    var url = routes[1];

    switch(url) {
        case '': postUtil.getPostsWithLimit(res, 3); break;
        case 'about': res.render('about'); break;
        case 'contact': res.render('contact'); break;
        case 'blog': postUtil.getPosts(res); break;
        case 'post': var postKey = routes[2]; if (postKey == '') { res.redirect('/'); } 
            else { postUtil.getPost(routes[2], res); } break;
        default: res.render('error');
    }
}

exports.performAction = (req, res) => {
    var routes = req.url.split('/');
    var url = routes[1];

    switch(url) {
        case 'createComment': commentUtil.createComment(req, res); break;
        case 'createPost': postUtil.createPost(req, res); break;
        case 'deletePost': postUtil.deletePost(req, res); break;
        case 'editPost': postUtil.editPost(req, res); break;
        default: res.sendStatus(404);
    }
}