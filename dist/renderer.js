"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clip_1 = require("./clip/clip");
var messenger_1 = require("./message/messenger");
var logger_1 = require("./log/logger");
var live_1 = require("./live/live");
var window_1 = require("./render/window");
var song_1 = require("./song/song");
// import Song = song.Song;
// const sinon = require("sinon");
var bound_lower, bound_upper;
outlets = 2;
// let env: string = process.argv[2];
// TODO: handle better - if set to max, can't run in node, but can compile TypeScript to max object
// if we switch from node execution to max execution, will max have stopped watching?
var env = 'max';
if (env === 'max') {
    autowatch = 1;
}
var live_api_user_input;
var live_api_to_elaborate;
var live_api_elaboration;
var clip_user_input;
var clip_to_elaborate;
var clip_elaboration;
var pwindow;
var elaboration;
// let index_track = 18;
// let index_clip_slot = 0;
//
// let path = "live_set tracks " + index_track + " clip_slots " + index_clip_slot + " clip";
//
// live_api_user_input = new li.LiveApiJs(index_track_user_input, index_clip_slot_user_input);
var song_dao = new song_1.song.SongDao(new live_1.live.LiveApiJs("live_set"), new messenger_1.message.Messenger(env, 1, "song"), true);
var song = new song_1.song.Song(song_dao);
var toggle = true;
var boundary_change_record_interval = function (int) {
    song.set_session_record(int);
};
var test = function () {
    // clip_elaboration.remove_notes(
    //     0,
    //     0,
    //     4,
    //     128
    // );
    // post(clip_user_input.get_loop_bracket_upper());
    // post('\n');
    // testing if we can change the looping of phrases automatically
    toggle = !toggle;
    if (toggle) {
        post('true');
        clip_user_input.set_loop_bracket_lower(0);
        clip_user_input.set_loop_bracket_upper(2);
        // clip_user_input.set_loop_bracket_upper(4);
        // clip_user_input.set_loop_bracket_lower(2);
    }
    else {
        post('false');
        // clip_user_input.set_loop_bracket_lower(0);
        // clip_user_input.set_loop_bracket_upper(2);
        clip_user_input.set_loop_bracket_upper(4);
        clip_user_input.set_loop_bracket_lower(2);
    }
};
var set_bound_upper = function (beat) {
    bound_upper = Number(beat);
};
var set_bound_lower = function (beat) {
    bound_lower = Number(beat);
};
var confirm = function () {
    elaboration = clip_user_input.get_notes(bound_lower, 0, bound_upper, 128);
    pwindow.elaborate(elaboration, bound_lower, bound_upper);
    var messages_notes = pwindow.get_messages_render_clips();
    var messages_tree = pwindow.get_messages_render_tree();
    // most recent summarization
    var notes_leaves = pwindow.get_notes_leaves();
    var logger = new logger_1.log.Logger(env);
    var messenger = new messenger_1.message.Messenger(env, 0);
    messenger.message(["clear"]);
    for (var _i = 0, messages_notes_1 = messages_notes; _i < messages_notes_1.length; _i++) {
        var message = messages_notes_1[_i];
        messenger.message(message);
        logger.log(message);
    }
    for (var _a = 0, messages_tree_1 = messages_tree; _a < messages_tree_1.length; _a++) {
        var message = messages_tree_1[_a];
        messenger.message(message);
        logger.log(message);
    }
    // logger.log('about to remove notes');
    // clip_elaboration.remove_notes(
    //     notes_leaves[0].model.note.beat_start,
    //     0,
    //     notes_leaves[notes_leaves.length - 1].model.note.get_beat_end() - notes_leaves[0].model.note.beat_start,
    //     128
    // );
    clip_elaboration.remove_notes(0, 0, 0, 128);
    clip_elaboration.set_notes(notes_leaves);
};
var reset = function () {
    clip_user_input.remove_notes(bound_lower, 0, bound_upper, 128);
};
// maybe init?
var main = function (index_track_to_elaborate, index_clip_slot_to_elaborate, index_track_user_input, index_clip_slot_user_input, index_track_elaboration, index_clip_slot_elaboration) {
    // var clip_1 = new c.Clip(new cd.ClipDao(index_track_1, index_clip_slot_universal, messenger, deferlow));
    // let b_stub_live_api: boolean = false;
    var live_api_1, live_api_2, live_api_3, live_api_4;
    // get(property: string): any;
    // set(property: string, value: any): void;
    // call(func: string): void;
    if (env === 'node') {
        live_api_1 = {
            get: function (property) { return 0; },
            set: function (property, value) { },
            call: function (func) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return 0;
            }
        };
        live_api_2 = {
            get: function (property) { return 0; },
            set: function (property, value) { },
            call: function (func) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return 0;
            }
        };
        live_api_3 = {
            get: function (property) { return 0; },
            set: function (property, value) { },
            call: function (func) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return 0;
            }
        };
        live_api_4 = {
            get: function (property) { return 0; },
            set: function (property, value) { },
            call: function (func) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return 0;
            }
        };
    }
    else {
        // live_api_1 = new li.LiveApiJs(15, 0);
        // live_api_2 = new li.LiveApiJs(14, 0);
        // live_api_3 = new li.LiveApiJs(13, 0);
        // live_api_4 = new li.LiveApiJs(12, 0);
        // "live_set tracks " + index_track + " clip_slots " + index_clip_slot + " clip";
        live_api_user_input = new live_1.live.LiveApiJs("live_set tracks " + index_track_user_input + " clip_slots " + index_clip_slot_user_input + " clip");
        live_api_to_elaborate = new live_1.live.LiveApiJs("live_set tracks " + index_track_to_elaborate + " clip_slots " + index_clip_slot_to_elaborate + " clip");
        live_api_elaboration = new live_1.live.LiveApiJs("live_set tracks " + index_track_elaboration + " clip_slots " + index_clip_slot_elaboration + " clip");
    }
    // clip 1
    // let clip_dao_1 = new c.ClipDao(
    //     live_api_1,
    //     new m.Messenger(env, 0),
    //     false
    // );
    // sinon.stub(clip_dao_1, "get_start_marker").callsFake(() => {
    //     return 0;
    // });
    // sinon.stub(clip_dao_1, "get_end_marker").callsFake(() => {
    //     return 4;
    // });
    // sinon.stub(clip_dao_1, "get_notes_within_markers").callsFake(() => {
    //     return ["notes",1,"note",50,0,4,127,0,"done"]
    // });
    // clip 2
    // let clip_dao_2 = new c.ClipDao(
    //     live_api_2,
    //     new m.Messenger(env, 0),
    //     false
    // );
    // sinon.stub(clip_dao_2, "get_start_marker").callsFake(() => {
    //     return 0;
    // });
    // sinon.stub(clip_dao_2, "get_end_marker").callsFake(() => {
    //     return 4;
    // });
    // sinon.stub(clip_dao_2, "get_notes_within_markers").callsFake(() => {
    //     return ["notes",2,"note",50,0,2,127,0,"note",54,2,2,127,0,"done"]
    // });
    // clip 3
    // let clip_dao_3 = new c.ClipDao(
    //     live_api_3,
    //     new m.Messenger(env, 0),
    //     false
    // );
    // sinon.stub(clip_dao_3, "get_start_marker").callsFake(() => {
    //     return 0;
    // });
    // sinon.stub(clip_dao_3, "get_end_marker").callsFake(() => {
    //     return 4;
    // });
    // sinon.stub(clip_dao_3, "get_notes_within_markers").callsFake(() => {
    //     return ["notes",3,"note",50,0,1,127,0,"note",52,1,1,127,0,"note",54,2,2,127,0,"done"]
    // });
    // clip 4
    // let clip_dao_4 = new c.ClipDao(
    //     live_api_4,
    //     new m.Messenger(env, 0),
    //     false
    // );
    // sinon.stub(clip_dao_4, "get_start_marker").callsFake(() => {
    //     return 0;
    // });
    // sinon.stub(clip_dao_4, "get_end_marker").callsFake(() => {
    //     return 4;
    // });
    // sinon.stub(clip_dao_4, "get_notes_within_markers").callsFake(() => {
    //     return ["notes",4,"note",50,0,1,127,0,"note",52,1,1,127,0,"note",54,2,1,127,0,"note",55,3,1,127,0,"done"]
    // });
    // let clip_1 = new c.Clip(clip_dao_1);
    // let clip_2 = new c.Clip(clip_dao_2);
    // let clip_3 = new c.Clip(clip_dao_3);
    // let clip_4 = new c.Clip(clip_dao_4);
    //
    // clip_1.load_notes_within_markers();
    // clip_2.load_notes_within_markers();
    // clip_3.load_notes_within_markers();
    // clip_4.load_notes_within_markers();
    // TODO: make configurable
    var dim = 16 * 6 * 4;
    pwindow = new window_1.window.Pwindow(dim, dim, new messenger_1.message.Messenger(env, 0));
    // TODO: sample workflowd
    clip_user_input = new clip_1.clip.Clip(new clip_1.clip.ClipDao(live_api_user_input, new messenger_1.message.Messenger(env, 1, "user_input"), true));
    clip_to_elaborate = new clip_1.clip.Clip(new clip_1.clip.ClipDao(live_api_to_elaborate, new messenger_1.message.Messenger(env, 1, "to_elaborate"), true));
    clip_elaboration = new clip_1.clip.Clip(new clip_1.clip.ClipDao(live_api_elaboration, new messenger_1.message.Messenger(env, 1, "elaboration"), true));
    // collect index of clip to sumarize from user
    pwindow.set_clip(clip_to_elaborate);
    // these will be notes collected within the bound specified by the user
    // pwindow.elaborate(
    //     clip_2.get_notes_within_markers(),
    //     clip_2.get_notes_within_markers()[0].model.note.beat_start,
    //     clip_2.get_notes_within_markers()[1].model.note.get_beat_end()
    // );
    //
    // pwindow.elaborate(
    //     clip_3.get_notes_within_markers().slice(0, 2),
    //     clip_3.get_notes_within_markers().slice(0, 2)[0].model.note.beat_start,
    //     clip_3.get_notes_within_markers().slice(0, 2)[1].model.note.get_beat_end()
    // );
    //
    // pwindow.elaborate(
    //     clip_4.get_notes_within_markers().slice(2, 4),
    //     clip_4.get_notes_within_markers().slice(2, 4)[0].model.note.beat_start,
    //     clip_4.get_notes_within_markers().slice(2, 4)[1].model.note.get_beat_end()
    // );
    // let messages_notes = pwindow.get_messages_render_clips();
    //
    // let messages_tree = pwindow.get_messages_render_tree();
    //
    // let logger = new log.Logger(env);
    // let messenger = new m.Messenger(env, 0);
    //
    // // messenger.message(messages_notes.length.toString());
    // // messenger.message(messages_tree.length.toString());
    //
    // for (let message of messages_notes) {
    //     messenger.message(message);
    //     logger.log(message);
    //     // outlet(0, message);
    // }
    //
    // for (let message of messages_tree) {
    //     messenger.message(message);
    //     logger.log(message);
    //     // outlet(0, message);
    // }
};
if (typeof Global !== "undefined") {
    Global.renderer = {};
    Global.renderer.main = main;
    Global.renderer.confirm = confirm;
    Global.renderer.reset = reset;
    Global.renderer.set_bound_lower = set_bound_lower;
    Global.renderer.set_bound_upper = set_bound_upper;
    Global.renderer.test = test;
    Global.renderer.boundary_change_record_interval = boundary_change_record_interval;
}
//# sourceMappingURL=renderer.js.map