'use strict';
var validTime = function(time) {
    var result = time.toString();
    if (result.length === 1) {
        result = '0' + result;
    }
    return result;
};

module.exports = function () {
    return {
        // Здесь как-то хранится дата ;)
        date: null,

        // А здесь часовой пояс
        timezone: null,

        // Выводит дату в переданном формате
        format: function (pattern) {
            var minutesDate = this.date + parseInt(this.timezone) * 60;
            var numberToDay = {
                0: 'ПН',
                1: 'ВТ',
                2: 'СР',
                3: 'ЧТ'
            };
            var day = minutesDate / (60 * 24);
            if (day < 0) {
                day = 'СБ';
                minutesDate += 60 * 24;
            } else {
                day = parseInt(minutesDate / (60 * 24));
                minutesDate -= day * 60 * 24;
                day = numberToDay[day];
            }
            var hours = parseInt(minutesDate / 60);
            minutesDate -= hours * 60;
            hours = validTime(hours);
            var minutes = validTime(minutesDate);
            var result = pattern.replace('%DD', day);
            result = result.replace('%HH', hours);
            result = result.replace('%MM', minutes);
            return result;
        },

        // Возвращает кол-во времени между текущей датой и переданной `moment`
        // в человекопонятном виде
        fromMoment: function (moment) {
        }
    };
};
