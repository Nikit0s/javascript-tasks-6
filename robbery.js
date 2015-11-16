'use strict';

var moment = require('./moment');
var minutesInDay = 60 * 24;

var dateToMinutes = function (rawDate) {
    var daysToNumber = {
        'ПН': 0,
        'ВТ': minutesInDay,
        'СР': minutesInDay * 2
    };
    var re = /[ \:]/;
    var splittedDate = rawDate.split(re);
    var minutes = 0;
    if (splittedDate.length === 3) {
        var reminder = splittedDate[2].substr(2);
        splittedDate[2] = splittedDate[2].substr(0, 2);
        splittedDate.push(reminder);
        minutes += daysToNumber[splittedDate[0]] + parseInt(splittedDate[1]) * 60 +
            parseInt(splittedDate[2]) - parseInt(splittedDate[3] * 60);
        return minutes;
    }
    var reminder = splittedDate[1].substr(2);
    splittedDate.push(reminder);
    minutes += parseInt(splittedDate[0]) * 60 + parseInt(splittedDate[1]) -
        parseInt(splittedDate[2] * 60);
    return minutes;
};

var checkAvailable = function (thief, gang, minute) {
    var gaps = gang[thief];
    for (var i = 0; i < gaps.length; i++) {
        if ((minute >= gaps[i].from) && (minute < gaps[i].to)) {
            return false;
        }
    }
    return true;
};

// Выбирает подходящий ближайший момент начала ограбления
module.exports.getAppropriateMoment = function (json, minDuration, workingHours) {
    var appropriateMoment = moment();
    appropriateMoment.timezone = parseInt(workingHours.from.substr(-2));

    // 1. Читаем json
    // 2. Находим подходящий ближайший момент начала ограбления
    // 3. И записываем в appropriateMoment
    var gang = JSON.parse(json);
    var friends = Object.keys(gang);
    friends.forEach(function (person) {
        var timeGaps = gang[person];
        timeGaps.forEach(function (gap) {
            gap.from = dateToMinutes(gap.from);
            gap.to = dateToMinutes(gap.to);
        });
    });
    var bankOpened = [];
    var workingStart = dateToMinutes(workingHours.from);
    var workingEnd = dateToMinutes(workingHours.to);
    for (var i = 0; i < 3; i++) {
        var currentDay = {
            from: i * minutesInDay + workingStart,
            to: i * minutesInDay + workingEnd
        };
        bankOpened.push(currentDay);
    }
    var thiefs = Object.keys(gang);
    var momentMinute = -1;
    for (var i = 0; i < 3; i++) {
        var currentStart = bankOpened[i].from;
        var currentEnd = bankOpened[i].to;
        var clock = 0;
        for (var j = currentStart; j <= currentEnd; j++) {
            if (clock === minDuration) {
                momentMinute = j - minDuration;
                break;
            }
            var allAvailable = true;
            for (var k = 0; k < thiefs.length; k++) {
                if (!checkAvailable(thiefs[k], gang, j)) {
                    clock = 0;
                    allAvailable = false;
                    break;
                }
            }
            if (allAvailable) {
                clock += 1;
            }
        }
        if (momentMinute > -1) {
            break;
        }
    }
    appropriateMoment.date = momentMinute;

    return appropriateMoment;
};

// Возвращает статус ограбления (этот метод уже готов!)
module.exports.getStatus = function (moment, robberyMoment) {
    if (moment.date < robberyMoment.date) {
        // «До ограбления остался 1 день 6 часов 59 минут»
        return robberyMoment.fromMoment(moment);
    }

    return 'Ограбление уже идёт!';
};
