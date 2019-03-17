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
var messenger_beat_start = new Messenger(env, 0, 'beat_start');
var messenger_beat_end = new Messenger(env, 0, 'beat_end');
var messenger_length_beats = new Messenger(env, 0, 'length-beats');
var messenger_run = new Messenger(env, 0, 'run');
var extract_beatmap_manual = function () {
    var clip_audio_warped = new Clip(new ClipDao(new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip'), new Messenger(env, 0)));
    var beat_start = clip_audio_warped.get_loop_bracket_lower();
    var beat_end = clip_audio_warped.get_loop_bracket_upper();
    var length_beats = (clip_audio_warped.get_end_marker() - clip_audio_warped.get_start_marker()) / 4;
    messenger_beat_start.message([Number(beat_start)]);
    messenger_beat_end.message([Number(beat_end)]);
    messenger_length_beats.message([Number(length_beats)]);
    messenger_run.message([]);
};
var test = function () {
};
if (typeof Global !== "undefined") {
    Global.extract_beatmap = {};
    Global.extract_beatmap.extract_beatmap_manual = extract_beatmap_manual;
}
//# sourceMappingURL=extract_beatmap.js.map