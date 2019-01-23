"use strict";
// Globals defined in Max environment
Object.defineProperty(exports, "__esModule", { value: true });
// NB: comment for Max compilation, uncomment for running compiled JS with node
// let inlets, outlets, autowatch;
// let Global: any = {};
var clip_5 = require("./clip/clip");
var messenger_1 = require("./message/messenger");
var sinon = require("sinon");
var window_1 = require("./render/window");
var logger_1 = require("./log/logger");
inlets = 1;
outlets = 1;
autowatch = 1;
Global.main = function main() {
    // clip 1
    var clip_dao_1 = new clip_5.clip.ClipDao(0, 0, new messenger_1.message.Messenger('node', 0), false);
    sinon.stub(clip_dao_1, "get_start_marker").callsFake(function () {
        return 0;
    });
    sinon.stub(clip_dao_1, "get_end_marker").callsFake(function () {
        return 4;
    });
    sinon.stub(clip_dao_1, "get_notes").callsFake(function () {
        return ["notes", 1, "note", 50, 0, 4, 127, 0, "done"];
    });
    // clip 2
    var clip_dao_2 = new clip_5.clip.ClipDao(0, 0, new messenger_1.message.Messenger('node', 0), false);
    sinon.stub(clip_dao_2, "get_start_marker").callsFake(function () {
        return 0;
    });
    sinon.stub(clip_dao_2, "get_end_marker").callsFake(function () {
        return 4;
    });
    sinon.stub(clip_dao_2, "get_notes").callsFake(function () {
        return ["notes", 2, "note", 50, 0, 2, 127, 0, "note", 54, 2, 2, 127, 0, "done"];
    });
    // clip 3
    var clip_dao_3 = new clip_5.clip.ClipDao(0, 0, new messenger_1.message.Messenger('node', 0), false);
    sinon.stub(clip_dao_3, "get_start_marker").callsFake(function () {
        return 0;
    });
    sinon.stub(clip_dao_3, "get_end_marker").callsFake(function () {
        return 4;
    });
    sinon.stub(clip_dao_3, "get_notes").callsFake(function () {
        return ["notes", 3, "note", 50, 0, 1, 127, 0, "note", 52, 1, 1, 127, 0, "note", 54, 2, 2, 127, 0, "done"];
    });
    // clip 4
    var clip_dao_4 = new clip_5.clip.ClipDao(0, 0, new messenger_1.message.Messenger('node', 0), false);
    sinon.stub(clip_dao_4, "get_start_marker").callsFake(function () {
        return 0;
    });
    sinon.stub(clip_dao_4, "get_end_marker").callsFake(function () {
        return 4;
    });
    sinon.stub(clip_dao_4, "get_notes").callsFake(function () {
        return ["notes", 4, "note", 50, 0, 1, 127, 0, "note", 52, 1, 1, 127, 0, "note", 54, 2, 1, 127, 0, "note", 55, 3, 1, 127, 0, "done"];
    });
    var clip_1 = new clip_5.clip.Clip(clip_dao_1);
    var clip_2 = new clip_5.clip.Clip(clip_dao_2);
    var clip_3 = new clip_5.clip.Clip(clip_dao_3);
    var clip_4 = new clip_5.clip.Clip(clip_dao_4);
    clip_1.load_notes();
    clip_2.load_notes();
    clip_3.load_notes();
    clip_4.load_notes();
    var dim = 16 * 6 * 4;
    var pwindow = new window_1.window.Pwindow(dim, dim, new messenger_1.message.Messenger('node', 0));
    pwindow.add_clip(clip_4);
    pwindow.add_clip(clip_3);
    pwindow.add_clip(clip_2);
    pwindow.add_clip(clip_1);
    var messages = pwindow.get_messages_render_clips();
    var logger = new logger_1.log.Logger('node');
    for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
        var message = messages_1[_i];
        logger.log(message);
    }
};
// NB: commeno
// NB: comment for Max compilation, uncomment for running compiled JS with node
//# sourceMappingURL=renderer.js.map