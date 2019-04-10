"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("../live/live");
var utils_1 = require("../utils/utils");
var track_1 = require("../track/track");
var TrackDao = track_1.track.TrackDao;
var Track = track_1.track.Track;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var messenger = new Messenger(env, 0);
var extract_beatmap_manual = function () {
    var this_device = new live_1.live.LiveApiJs('this_device');
    var track = new Track(new TrackDao(new live_1.live.LiveApiJs(utils_1.utils.get_path_track_from_path_device(this_device.get_path())), messenger));
    track.load_clip_slots();
    var clip_slot = track.get_clip_slot_at_index(0);
    clip_slot.load_clip();
    var clip_audio_warped = clip_slot.get_clip();
    // let logger = new Logger(env);
    //
    // logger.log(JSON.stringify(clip_audio_warped.clip_dao.clip_live.get_id()));
    //
    // logger.log(JSON.stringify(clip_audio_warped.get_name()));
    //
    // logger.log(JSON.stringify(clip_audio_warped.get_id()));
    //
    // // logger.log(JSON.stringify(clip_audio_warped.get_end_marker()));
    //
    // logger.log(JSON.stringify(clip_audio_warped.get_loop_bracket_upper()));
    //
    // return;
    var beat_start_marker = clip_audio_warped.get_start_marker();
    var beat_end_marker = clip_audio_warped.get_end_marker();
    var loop_bracket_lower = clip_audio_warped.get_loop_bracket_lower();
    var loop_bracket_upper = clip_audio_warped.get_loop_bracket_upper();
    var length_beats = (clip_audio_warped.get_end_marker() - clip_audio_warped.get_start_marker());
    messenger.message(['beat_start_marker', beat_start_marker]);
    messenger.message(['beat_end_marker', beat_end_marker]);
    messenger.message(['loop_bracket_lower', loop_bracket_lower]);
    messenger.message(['loop_bracket_upper', loop_bracket_upper]);
    messenger.message(['length-beats', length_beats]);
    messenger.message(['run', 'bang']);
};
var test = function () {
};
if (typeof Global !== "undefined") {
    Global.extract_beatmap = {};
    Global.extract_beatmap.extract_beatmap_manual = extract_beatmap_manual;
}
//# sourceMappingURL=extract_beatmap.js.map