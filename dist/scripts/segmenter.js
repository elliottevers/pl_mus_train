"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var live_1 = require("../live/live");
var logger_1 = require("../log/logger");
var Logger = logger_1.log.Logger;
var _ = require('underscore');
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var test = function () {
    // extract segments from sole clip
    // delete clip
    // for each list of notes, create a clip, then set notes
    // 1) create a bunch of empty clips below the currently selected one
    // get track index of highlighted clip
    var clipslot_highlighted = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot');
    var path_track = clipslot_highlighted.get_path();
    var index_track = path_track.split(' ')[2];
    var logger = new Logger(env);
    logger.log(index_track);
    // "live_set tracks 3 clip_slots 0"
    // TODO: start/end markers of clip, loop endpoints, delete first one
    var beats_length_clip = 8;
    for (var _i = 0, _a = _.range(1, 5); _i < _a.length; _i++) {
        var i = _a[_i];
        var constituents_path = ['live_set', 'tracks', String(index_track), 'clip_slots', String(i)];
        var path_live = constituents_path.join(' ');
        var clipslot = new live_1.live.LiveApiJs(path_live);
        clipslot.call('create_clip', String(beats_length_clip));
        // logger.log(i)
    }
    // logger.log(clipslot_highlighted.get_id());
    //
    // logger.log(clipslot_highlighted.get_path());
};
if (typeof Global !== "undefined") {
    Global.segmenter = {};
    Global.segmenter.test = test;
}
//# sourceMappingURL=segmenter.js.map