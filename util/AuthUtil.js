var base64 = require('base-64');

exports.authenticate = (key) => {
    var apiKey = base64.decode(key);

    if (apiKey != process.env.API_KEY) {
        console.log('You do not have a valid api key to continue.');

        return 404;
    }

    return 200;
}