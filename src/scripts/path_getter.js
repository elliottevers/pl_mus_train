"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("../live/live");
var utils_1 = require("../utils/utils");
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var get_selected_track = function () {
    var track_highlighted = new live_1.live.LiveApiJs('live_set view selected_track clip_slots 0 clip');
    // let logger = new Logger(env);
    var path_live = track_highlighted.get_path();
    var messenger = new Messenger(env, 0);
    messenger.message(utils_1.utils.PathLive.to_message(path_live));
    // logger.log(
    //     clip_highlighted.get_path().split(' ')
    // )
    // track_highlighted.get_children();
    // exporter.set_length(
    //     clip_highlighted.get("length")
    // );
};
if (typeof Global !== "undefined") {
    Global.path_getter = {};
    Global.path_getter.get_selected_track = get_selected_track;
}
//# sourceMappingURL=path_getter.js.map