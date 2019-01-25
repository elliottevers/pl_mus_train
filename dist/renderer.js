"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clip_5 = require("./clip/clip");
var messenger_1 = require("./message/messenger");
var window_1 = require("./render/window");
var live_1 = require("./live/live");
// const sinon = require("sinon");
// let env: string = process.argv[2];
// TODO: handle better - if set to max, can't run in node, but can compile TypeScript to max object
// if we switch from node execution to max execution, will max have stopped watching?
var env = 'max';
if (env === 'max') {
    autowatch = 1;
}
var main = function () {
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
        live_api_1 = new live_1.live.LiveApiJs(15, 0);
        live_api_2 = new live_1.live.LiveApiJs(14, 0);
        live_api_3 = new live_1.live.LiveApiJs(13, 0);
        live_api_4 = new live_1.live.LiveApiJs(12, 0);
    }
    // clip 1
    var clip_dao_1 = new clip_5.clip.ClipDao(live_api_1, new messenger_1.message.Messenger(env, 0), false);
    // sinon.stub(clip_dao_1, "get_start_marker").callsFake(() => {
    //     return 0;
    // });
    // sinon.stub(clip_dao_1, "get_end_marker").callsFake(() => {
    //     return 4;
    // });
    // sinon.stub(clip_dao_1, "get_notes").callsFake(() => {
    //     return ["notes",1,"note",50,0,4,127,0,"done"]
    // });
    // clip 2
    var clip_dao_2 = new clip_5.clip.ClipDao(live_api_2, new messenger_1.message.Messenger(env, 0), false);
    // sinon.stub(clip_dao_2, "get_start_marker").callsFake(() => {
    //     return 0;
    // });
    // sinon.stub(clip_dao_2, "get_end_marker").callsFake(() => {
    //     return 4;
    // });
    // sinon.stub(clip_dao_2, "get_notes").callsFake(() => {
    //     return ["notes",2,"note",50,0,2,127,0,"note",54,2,2,127,0,"done"]
    // });
    // clip 3
    var clip_dao_3 = new clip_5.clip.ClipDao(live_api_3, new messenger_1.message.Messenger(env, 0), false);
    // sinon.stub(clip_dao_3, "get_start_marker").callsFake(() => {
    //     return 0;
    // });
    // sinon.stub(clip_dao_3, "get_end_marker").callsFake(() => {
    //     return 4;
    // });
    // sinon.stub(clip_dao_3, "get_notes").callsFake(() => {
    //     return ["notes",3,"note",50,0,1,127,0,"note",52,1,1,127,0,"note",54,2,2,127,0,"done"]
    // });
    // clip 4
    var clip_dao_4 = new clip_5.clip.ClipDao(live_api_4, new messenger_1.message.Messenger(env, 0), false);
    // sinon.stub(clip_dao_4, "get_start_marker").callsFake(() => {
    //     return 0;
    // });
    // sinon.stub(clip_dao_4, "get_end_marker").callsFake(() => {
    //     return 4;
    // });
    // sinon.stub(clip_dao_4, "get_notes").callsFake(() => {
    //     return ["notes",4,"note",50,0,1,127,0,"note",52,1,1,127,0,"note",54,2,1,127,0,"note",55,3,1,127,0,"done"]
    // });
    var clip_1 = new clip_5.clip.Clip(clip_dao_1);
    var clip_2 = new clip_5.clip.Clip(clip_dao_2);
    var clip_3 = new clip_5.clip.Clip(clip_dao_3);
    var clip_4 = new clip_5.clip.Clip(clip_dao_4);
    clip_1.load_notes();
    clip_2.load_notes();
    clip_3.load_notes();
    clip_4.load_notes();
    var dim = 16 * 6 * 4;
    var pwindow = new window_1.window.Pwindow(dim, dim, new messenger_1.message.Messenger(env, 0));
    pwindow.set_clip(clip_1);
    pwindow.elaborate(clip_2.get_notes(), clip_2.get_notes()[0].model.note.beat_start, clip_2.get_notes()[1].model.note.get_beat_end());
    pwindow.elaborate(clip_3.get_notes().slice(0, 2), clip_3.get_notes().slice(0, 2)[0].model.note.beat_start, clip_3.get_notes().slice(0, 2)[1].model.note.get_beat_end());
    pwindow.elaborate(clip_4.get_notes().slice(2, 4), clip_4.get_notes().slice(2, 4)[0].model.note.beat_start, clip_4.get_notes().slice(2, 4)[1].model.note.get_beat_end());
    var messages_notes = pwindow.get_messages_render_clips();
    var messages_tree = pwindow.get_messages_render_tree();
    // let logger = new log.Logger(env);
    var messenger = new messenger_1.message.Messenger(env, 0);
    messenger.message(messages_notes.length.toString());
    messenger.message(messages_tree.length.toString());
    for (var _i = 0, messages_notes_1 = messages_notes; _i < messages_notes_1.length; _i++) {
        var message = messages_notes_1[_i];
        messenger.message(message);
        // logger.log(message);
        // outlet(0, message);
    }
    for (var _a = 0, messages_tree_1 = messages_tree; _a < messages_tree_1.length; _a++) {
        var message = messages_tree_1[_a];
        messenger.message(message);
        // outlet(0, message);
    }
};
if (typeof Global !== "undefined") {
    Global.renderer = {};
    Global.renderer.main = main;
}
// main();
post('hello world');
//# sourceMappingURL=renderer.js.map