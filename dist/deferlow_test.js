"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clip_1 = require("./clip/clip");
var messenger_1 = require("./message/messenger");
var live_1 = require("./live/live");
var env = 'max';
if (env === 'max') {
    autowatch = 1;
}
var live_api_summarization;
live_api_summarization = new live_1.live.LiveApiJs("live_set tracks " + 18 + " clip_slots " + 0 + " clip");
var clip_summarization = new clip_1.clip.Clip(new clip_1.clip.ClipDao(live_api_summarization, new messenger_1.message.Messenger(env, 0), false));
var live_api_user_input;
live_api_user_input = new live_1.live.LiveApiJs("live_set tracks " + 17 + " clip_slots " + 0 + " clip");
var clip_user_input = new clip_1.clip.Clip(new clip_1.clip.ClipDao(live_api_user_input, new messenger_1.message.Messenger(env, 0), false));
var reset = function (index_track_user_input) {
    clip_user_input.remove_notes(0, 0, 2, 128);
};
var set = function () {
    clip_summarization.set_notes(clip_user_input.get_notes(0, 0, 2, 128));
};
var get = function () {
    var notes = clip_user_input.get_notes(0, 0, 2, 128);
    for (var _i = 0, notes_1 = notes; _i < notes_1.length; _i++) {
        var node = notes_1[_i];
        post("beat_start");
        post("\n");
        post(node.model.note.beat_start);
        post("\n");
        post("pitch");
        post("\n");
        post(node.model.note.pitch);
        post("\n");
    }
};
if (typeof Global !== "undefined") {
    Global.deferlow_test = {};
    Global.deferlow_test.reset = reset;
    Global.deferlow_test.get = get;
    Global.deferlow_test.set = set;
}
//# sourceMappingURL=deferlow_test.js.map