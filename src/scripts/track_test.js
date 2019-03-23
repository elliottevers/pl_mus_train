"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var live_1 = require("../live/live");
var LiveApiJs = live_1.live.LiveApiJs;
var logger_1 = require("../log/logger");
var Logger = logger_1.log.Logger;
var track_1 = require("../track/track");
var TrackDao = track_1.track.TrackDao;
var Track = track_1.track.Track;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var test = function () {
    var track = new Track(new TrackDao(new LiveApiJs('live_set tracks 2')));
    var logger = new Logger(env);
    logger.log(track.get_num_clip_slots());
};
if (typeof Global !== "undefined") {
    Global.track_test = {};
    Global.track_test.test = test;
}
//# sourceMappingURL=track_test.js.map