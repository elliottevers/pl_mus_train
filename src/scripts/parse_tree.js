"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("../live/live");
var clip_1 = require("../clip/clip");
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var messenger = new Messenger(env, 0);
var mute = function () {
    var clip_highlighted = new live_1.live.LiveApiJs('live_set view selected_track' // 'live_set view highlighted_clip_slot clip'
    );
    clip_highlighted.set("mute", 1);
    // post(clip_highlighted.get("name"))
};
var unmute = function () {
    var clip_highlighted = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
    clip_highlighted.set("muted", 0);
};
var counter = 0;
var highlighted_first;
var highlighted_second;
var test = function () {
    var api = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
    //
    // messenger.message([api.get_path()])
    var clip_highlighted = new clip_1.clip.Clip(new clip_1.clip.ClipDao(api, new messenger_1.message.Messenger(env, 0, "highlighted"), true));
    if (counter % 2 == 0) {
        clip_highlighted.set_loop_bracket_lower(0);
        clip_highlighted.set_loop_bracket_upper(2);
    }
    else {
        clip_highlighted.set_loop_bracket_upper(4);
        clip_highlighted.set_loop_bracket_lower(2);
    }
    counter = counter + 1;
    post(counter);
};
var first = function () {
    highlighted_first = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
    // clip_highlighted.set("mute", 1);
};
var second = function () {
    highlighted_second = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
    // clip_highlighted.set("mute", 1);
};
var mute_first_highlighted = function () {
    highlighted_first.set('muted', 1);
};
// test();
if (typeof Global !== "undefined") {
    Global.parse_tree = {};
    Global.parse_tree.mute = mute;
    Global.parse_tree.unmute = unmute;
    Global.parse_tree.test = test;
    Global.parse_tree.first = first;
    Global.parse_tree.second = second;
    Global.parse_tree.mute_first_highlighted = mute_first_highlighted;
}
//# sourceMappingURL=parse_tree.js.map