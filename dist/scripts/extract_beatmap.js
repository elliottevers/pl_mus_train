"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("../live/live");
var clip_1 = require("../clip/clip");
var Clip = clip_1.clip.Clip;
var ClipDao = clip_1.clip.ClipDao;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
// let messenger_beat_start = new Messenger(env, 0, 'beat_start');
//
// let messenger_beat_end = new Messenger(env, 0, 'beat_end');
//
// let messenger_length_beats = new Messenger(env, 0, 'length-beats');
//
// let messenger_run = new Messenger(env, 0, 'run');
var messenger = new Messenger(env, 0);
var extract_beatmap_manual = function () {
    var clip_audio_warped = new Clip(new ClipDao(new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip'), new Messenger(env, 0)));
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
    messenger.message(['run']);
};
var test = function () {
};
if (typeof Global !== "undefined") {
    Global.extract_beatmap = {};
    Global.extract_beatmap.extract_beatmap_manual = extract_beatmap_manual;
}
//# sourceMappingURL=extract_beatmap.js.map