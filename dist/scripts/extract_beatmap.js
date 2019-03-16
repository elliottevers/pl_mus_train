"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var messenger_beat_start = new Messenger(env, 0, 'beat_start');
var messenger_beat_end = new Messenger(env, 0, 'beat_end');
var messenger_run = new Messenger(env, 0, 'run');
var extract_beatmap_manual = function () {
    // // get highlighted clip
    //
    // let beat_start = clip_audio_warped.get_loop_bracket_lower();
    //
    // let beat_end = clip_audio_warped.get_loop_bracket_upper();
    //
    // // let messenger_beat_start = new Messenger(env, 0, 'beat_start');
    //
    // messenger_beat_start.message(beat_start);
    //
    // messenger_beat_end.message(beat_end);
    //
    // messenger_run.message(['bang']);
};
var test = function () {
    // let song = new li.LiveApiJs(
    //     'live_set'
    // );
    //
    // let clip_highlighted = new li.LiveApiJs(
    //     'live_set view highlighted_clip_slot clip'
    // );
    //
    // let length_clip = clip_highlighted.get("length");
    //
    // let tempo = song.get("tempo");
    //
    // let logger = new Logger(env);
    //
    // logger.log(clip_highlighted.get_id())
};
if (typeof Global !== "undefined") {
    Global.export_clips = {};
    Global.export_clips.test = test;
    // Global.export_clips.add = add;
    // Global.export_clips.remove = remove;
    // Global.export_clips.export_clips = export_clips;
    // Global.export_clips.set_length = set_length;
    // Global.export_clips.set_tempo = set_tempo;
}
//# sourceMappingURL=extract_beatmap.js.map