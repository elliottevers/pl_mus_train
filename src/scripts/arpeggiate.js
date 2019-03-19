"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("../live/live");
var clip_1 = require("../clip/clip");
var LiveApiJs = live_1.live.LiveApiJs;
var harmony_1 = require("../music/harmony");
var Harmony = harmony_1.harmony.Harmony;
var ClipDao = clip_1.clip.ClipDao;
var Clip = clip_1.clip.Clip;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var notes_polyphonic = [];
var notes_arpegiatted = [];
var cached = false;
var toggle = function (val) {
    var arpeggiate = Boolean(val);
    var this_device = new live_1.live.LiveApiJs('this_device');
    var path_this_device = this_device.get_path();
    var list_this_device = path_this_device.split(' ');
    var index_this_track = Number(list_this_device[2]);
    var path_clip = ['live_set', 'tracks', index_this_track, 'clip_slots', 0, 'clip'].join(' ');
    var clip = new Clip(new ClipDao(new LiveApiJs(path_clip), new Messenger(env, 0)));
    if (!cached) {
        notes_polyphonic = clip.get_notes(clip.get_start_marker(), 0, clip.get_end_marker(), 128);
        var groups_notes_arpegiatted = Harmony.arpeggiate(notes_polyphonic);
        for (var _i = 0, groups_notes_arpegiatted_1 = groups_notes_arpegiatted; _i < groups_notes_arpegiatted_1.length; _i++) {
            var group = groups_notes_arpegiatted_1[_i];
            // let logger = new Logger(env);
            // logger.log(JSON.stringify(group));
            notes_arpegiatted = notes_arpegiatted.concat(group);
        }
        cached = true;
    }
    if (arpeggiate) {
        clip.remove_notes(clip.get_start_marker(), 0, clip.get_end_marker(), 128);
        clip.set_notes(notes_arpegiatted);
    }
    else {
        clip.remove_notes(clip.get_start_marker(), 0, clip.get_end_marker(), 128);
        clip.set_notes(notes_polyphonic);
    }
};
if (typeof Global !== "undefined") {
    Global.arpeggiate = {};
    Global.arpeggiate.toggle = toggle;
}
//# sourceMappingURL=arpeggiate.js.map