/*

*/
var Refiner = require('./refiner').Refiner;

// Map ABBR -> Offset in minute
var TIMEZONE_NAME_PATTERN = new RegExp("^\\s*\\(?([A-Z]{2,10})\\)?(?=\\W|$)", 'i');
var DEFAULT_TIMEZONE_ABBR_MAP = {
    "CDT": "US/Central",
    "CST": "US/Central",
    "CENTRAL": "US/Central",
    "EAST": "US/Eastern",
    "EASTERN": "US/Eastern",
    "EDT": "US/Eastern",
    "EST": "US/Eastern",
    "MDT": "US/Mountain",
    "MST": "US/Mountain",
    "MOUNTAIN": "US/Mountain",
    "PDT": "US/Pacific",
    "PST": "US/Pacific",
    "PT": "US/Pacific",
    "PACIFIC": "US/Pacific"
}

exports.Refiner = function ExtractTimezoneAbbrRefiner(config) {
	Refiner.call(this, arguments);

	this.refine = function(text, results, opt) {

	    var timezones = new Object(DEFAULT_TIMEZONE_ABBR_MAP);
	    if (opt.timezones) {
	        for (var name in opt.timezones) {
                timezones[name] = opt.timezones[name];
            }
        }

		results.forEach(function(result) {

            if (!result.tags['ENTimeExpressionParser'] &&
                !result.tags['ZHTimeExpressionParser'] &&
                !result.tags['FRTimeExpressionParser'] &&
                !result.tags['DETimeExpressionParser']) {
                return;
            }

            var match = TIMEZONE_NAME_PATTERN.exec(text.substring(result.index + result.text.length));
            if (match) {
                var timezoneAbbr = match[1].toUpperCase();
                if (timezones[timezoneAbbr] === undefined) {
                    return;
                }

                var timezoneName = timezones[timezoneAbbr];
                if (!result.start.isCertain('timezoneName')) {
                    result.start.assign('timezoneName', timezoneName);
                }

                if (result.end != null && !result.end.isCertain('timezoneName')) {
                    result.end.assign('timezoneName', timezoneName);
                }

                result.text += match[0];
                result.tags['ExtractTimezoneAbbrRefiner'] = true;
            }
		});

        return results;
	}
};