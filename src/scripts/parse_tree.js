"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("../live/live");
var clip_1 = require("../clip/clip");
var window_1 = require("../render/window");
var logger_1 = require("../log/logger");
var song_1 = require("../song/song");
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var messenger = new Messenger(env, 0);
var song_dao = new song_1.song.SongDao(new live_1.live.LiveApiJs("live_set"), new messenger_1.message.Messenger(env, 1, "song"), true);
var song = new song_1.song.Song(song_dao);
var boundary_change_record_interval = function (int) {
    song.set_session_record(int);
};
var pwindow;
var elaboration;
var clip_user_input;
var clip_target;
var bound_lower, bound_upper;
var logger = new logger_1.log.Logger(env);
var confirm = function () {
    elaboration = clip_user_input.get_notes(bound_lower, 0, bound_upper, 128);
    pwindow.elaborate(elaboration, bound_lower, bound_upper);
    var messages_notes = pwindow.get_messages_render_clips();
    var messages_tree = pwindow.get_messages_render_tree();
    // most recent summarization
    var notes_leaves = pwindow.get_notes_leaves();
    // send rendering messages
    messenger.message(["clear"]);
    for (var _i = 0, messages_notes_1 = messages_notes; _i < messages_notes_1.length; _i++) {
        var message_1 = messages_notes_1[_i];
        message_1.unshift('render');
        messenger.message(message_1);
        // logger.log(message);
    }
    for (var _a = 0, messages_tree_1 = messages_tree; _a < messages_tree_1.length; _a++) {
        var message_2 = messages_tree_1[_a];
        message_2.unshift('render');
        messenger.message(message_2);
        // logger.log(message);
    }
    clip_target.remove_notes(0, 0, 0, 128);
    clip_target.set_notes(notes_leaves);
};
var reset = function () {
    clip_user_input.remove_notes(bound_lower, 0, bound_upper, 128);
};
var init_render = function () {
    // TODO: make configurable
    var dim = 16 * 6 * 4;
    pwindow = new window_1.window.Pwindow(dim, dim, new messenger_1.message.Messenger(env, 0));
    pwindow.set_clip(clip_target);
};
var set_clip_target = function () {
    var live_api_to_target = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
    var key_route = 'clip_target';
    clip_target = new clip_1.clip.Clip(new clip_1.clip.ClipDao(live_api_to_target, new messenger_1.message.Messenger(env, 0), true, key_route));
    clip_target.set_path_deferlow('set_path_clip_target');
};
var set_clip_user_input = function () {
    var live_api_user_input = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
    var key_route = 'clip_user_input';
    clip_user_input = new clip_1.clip.Clip(new clip_1.clip.ClipDao(live_api_user_input, new messenger_1.message.Messenger(env, 0), true, key_route));
    clip_user_input.set_path_deferlow('set_path_clip_user_input');
};
var set_bound_upper = function (beat) {
    bound_upper = Number(beat);
};
var set_bound_lower = function (beat) {
    bound_lower = Number(beat);
};
if (typeof Global !== "undefined") {
    Global.parse_tree = {};
    Global.parse_tree.confirm = confirm;
    Global.parse_tree.reset = reset;
    Global.parse_tree.init_render = init_render;
    Global.parse_tree.set_clip_target = set_clip_target;
    Global.parse_tree.set_clip_user_input = set_clip_user_input;
    Global.parse_tree.set_bound_upper = set_bound_upper;
    Global.parse_tree.set_bound_lower = set_bound_lower;
}
//# sourceMappingURL=parse_tree.js.map