"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../log/logger");
var Logger = logger_1.log.Logger;
var jsEnv = require('browser-or-node');
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var test = function () {
    // let track = new Track(
    //     new TrackDao(
    //         new LiveApiJs(
    //             'live_set tracks 2'
    //         )
    //     )
    // );
    //
    // let logger = new Logger(env);
    //
    // logger.log(track.get_num_clip_slots());
    var logger = new Logger(env);
    if (jsEnv.isBrowser) {
        // do browser only stuff
        logger.log('this is a browser');
    }
    if (jsEnv.isNode) {
        // do node.js only stuff
        logger.log('this is node');
    }
};
if (typeof Global !== "undefined") {
    Global.track_test = {};
    Global.track_test.test = test;
}
//# sourceMappingURL=track_test.js.map