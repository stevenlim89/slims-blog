var dateTime = require('date-and-time');

exports.getDateString = (date) => {
    dateTime.format(date, 'ddd MMM DD YYYY');

    var dateArray = date.toString().split(' ');
    
    return dateArray[0] + ' ' + dateArray[1] + ' ' + dateArray[2] + ' ' + dateArray[3];
}