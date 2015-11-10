'use strict';

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
                2: 'СР'
            };
            var day = parseInt(minutesDate / (60 * 24));
            minutesDate -= day * 60 * 24;
            day = numberToDay[day];
            var hours = parseInt(minutesDate / 60);
            minutesDate -= hours * 60;
            hours = hours.toString();
            if (hours.length === 1) {
                hours = '0' + hours;
            }
            var minutes = minutesDate.toString();
            if (minutes.length === 1) {
                minutes = '0' + minutes;
            }
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
