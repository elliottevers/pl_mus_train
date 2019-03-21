"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("../live/live");
var clip_1 = require("../clip/clip");
var LiveApiJs = live_1.live.LiveApiJs;
var ClipDao = clip_1.clip.ClipDao;
var Clip = clip_1.clip.Clip;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var notes_original = [];
var notes_filtered = [];
// let cached: boolean = false;
var get_clip = function () {
    var this_device = new live_1.live.LiveApiJs('this_device');
    var path_this_device = this_device.get_path();
    var list_this_device = path_this_device.split(' ');
    var index_this_track = Number(list_this_device[2]);
    var path_clip = ['live_set', 'tracks', index_this_track, 'clip_slots', '0', 'clip'].join(' ');
    return new Clip(new ClipDao(new LiveApiJs(path_clip), new Messenger(env, 0)));
};
var undo = function () {
    var clip = get_clip();
    if (notes_original.length === 0) {
        notes_original = clip.get_notes(clip.get_start_marker(), 0, clip.get_end_marker(), 128);
    }
    clip.remove_notes(clip.get_start_marker(), 0, clip.get_end_marker(), 128);
    clip.set_notes(notes_original);
};
var filter = function (length_beat) {
    var clip = get_clip();
    if (notes_original.length === 0) {
        notes_original = clip.get_notes(clip.get_start_marker(), 0, clip.get_end_marker(), 128);
    }
    clip.remove_notes(clip.get_start_marker(), 0, clip.get_end_marker(), 128);
    clip.set_notes(notes_original.filter(function (node) {
        return node.model.note.beats_duration >= length_beat;
    }));
};
if (typeof Global !== "undefined") {
    Global.filter = {};
    Global.filter.filter = filter;
    Global.filter.undo = undo;
}
//# sourceMappingURL=filter.js.map