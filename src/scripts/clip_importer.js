"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("../live/live");
var clip_1 = require("../clip/clip");
var logger_1 = require("../log/logger");
var Logger = logger_1.log.Logger;
var io_1 = require("../io/io");
var Clip = clip_1.clip.Clip;
var ClipDao = clip_1.clip.ClipDao;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var length_beats;
var set_length_beats = function (beats) {
    length_beats = beats;
};
var import_part = function (name_part) {
    var logger = new Logger(env);
    // TODO: this works when we want to create a clip from scratch - figure out how to work into workflow
    var clipslot_highlighted = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot');
    var clip_highlighted = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
    var clip;
    var clip_exists = Number(clip_highlighted.get_id()) !== 0;
    if (!clip_exists) {
        // TODO: get the beat of end of last note
        clipslot_highlighted.call('create_clip', String(length_beats));
        clip_highlighted = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
    }
    clip = new Clip(new ClipDao(clip_highlighted, new Messenger(env, 0)));
    var dict = new Dict();
    dict.import_json(io_1.io.file_json_comm);
    var notes = clip_1.clip.Clip.parse_note_messages(dict.get([name_part, 'notes'].join('::')));
    clip.remove_notes(clip.get_start_marker(), 0, clip.get_end_marker(), 128);
    clip.set_notes(notes);
    var messenger = new Messenger(env, 0);
    messenger.message(['part_imported']);
};
var test = function () {
};
if (typeof Global !== "undefined") {
    Global.clip_importer = {};
    Global.clip_importer.import_part = import_part;
    Global.clip_importer.set_length_beats = set_length_beats;
}
//# sourceMappingURL=clip_importer.js.map