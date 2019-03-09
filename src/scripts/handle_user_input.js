"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("../live/live");
var logger_1 = require("../log/logger");
var song_1 = require("../song/song");
var Logger = logger_1.log.Logger;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var messenger = new Messenger(env, 0);
var logger = new Logger(env);
var song_dao = new song_1.song.SongDao(new live_1.live.LiveApiJs("live_set", env), new messenger_1.message.Messenger(env, 0, "song"), true);
var song = new song_1.song.Song(song_dao);
// export let pwindow: w.Pwindow;
var elaboration;
var clip_user_input;
var clip_segment;
var segment_current;
var segment_iterator;
// let tree_depth_iterator: TreeDepthIterator;
//
// let parse_tree_iterator: ParseTreeIterator;
var layer_parse_tree_current;
var depth_parse_tree;
// export let parse_matrix: ParseMatrix;
var notes_segments;
var confirm = function () {
    elaboration = clip_user_input.get_notes(segment_current.beat_start, 0, segment_current.beat_end - segment_current.beat_start, 128);
    // add_to_tree(
    //     elaboration,
    //     segment_current.beat_start,
    //     segment_current.beat_end
    // );
};
// let start = () => {
//     message
//     this.messenger.mess
// };
//
// let resume = () => {
//
// };
//
// let pause = () => {
//
// };
var load = function (filename) {
    // start_session_train(
    //     ParseMatrix.load(
    //         filename
    //     )
    // )
};
var save = function (filename) {
    // parse_matrix.save(filename);
    // stop_session(clip_user_input, song)
};
//# sourceMappingURL=handle_user_input.js.map