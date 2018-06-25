/*
  
*/
var Refiner = require('./refiner').Refiner;


var TIMEZONE_OFFSET_PATTERN = new RegExp("^\\s*(GMT|UTC)?(\\+|\\-)(\\d{1,2}):?(\\d{2})", 'i');
var TIMEZONE_OFFSET_SIGN_GROUP = 2;
var TIMEZONE_OFFSET_HOUR_OFFSET_GROUP = 3;
var TIMEZONE_OFFSET_MINUTE_OFFSET_GROUP = 4;

exports.Refiner = function ExtractTimezoneOffsetRefiner() {
    Refiner.call(this);

    this.refine = function(text, results, opt) {

        results.forEach(function(result) {

            if (result.start.isCertain('timezoneName')) {
                return;
            }

            var match = TIMEZONE_OFFSET_PATTERN.exec(text.substring(result.index + result.text.length));
            if (!match) {
                return;
            }

            var hourOffset = parseInt(match[TIMEZONE_OFFSET_HOUR_OFFSET_GROUP]);
            var minuteOffset = parseInt(match[TIMEZONE_OFFSET_MINUTE_OFFSET_GROUP]);
            var timezoneName = hourOffset * 60 + minuteOffset;
            if (match[TIMEZONE_OFFSET_SIGN_GROUP] === '-') {
                timezoneName = -timezoneName;
            }

            if (result.end != null) {
                result.end.assign('timezoneName', timezoneName);
            }

            result.start.assign('timezoneName', timezoneName);
            result.text += match[0];
            result.tags['ExtractTimezoneOffsetRefiner'] = true;
        });

        return results;
    }
}
