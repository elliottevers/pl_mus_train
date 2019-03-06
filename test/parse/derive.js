"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var note_1 = require("../../src/note/note");
var TreeModel = require("tree-model");
var parse_tree_1 = require("../../src/scripts/parse_tree");
var messenger_1 = require("../../src/message/messenger");
var Messenger = messenger_1.message.Messenger;
// import {song} from "../../src/song/song";
// import Song = song.Song;
// import SongDao = song.SongDao;
var song = {
    set_overdub: function (int) { },
    set_session_record: function (int) { }
};
var clip_user_input = {
    fire: function () { },
    stop: function () { },
    set_endpoints_loop: function (former, latter) { }
};
var tree = new TreeModel();
var notes_segments;
// let note_1_1 = tree.parse(
//     {
//         id: -1, // TODO: hashing scheme for clip id and beat start
//         note: new n.Note(
//             48,
//             0,
//             48 + 16,
//             90,
//             0
//         ),
//         children: [
//
//         ]
//     }
// );
var note_2_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(48, 0, 16, 90, 0),
    children: []
});
var note_2_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(49, 16, 32, 90, 0),
    children: []
});
var note_2_3 = tree.parse({
    id: -1,
    note: new note_1.note.Note(50, 48, 16, 90, 0),
    children: []
});
// notes_segments = [note_2_1, note_2_2, note_2_3];
notes_segments = [note_2_1, note_2_2];
parse_tree_1.set_depth_tree_export(3);
// let env = 'node';
var env = 'node_for_max';
// let messenger = new Messenger(node, 0);
var messenger = new Messenger(env, 0);
parse_tree_1.begin_train_export(notes_segments, clip_user_input, song, parse_tree_1.add_to_tree_export, messenger);
// add_to_tree(
//     note_1_1
// )
//
// add_to_tree(note_2_1)
// add_to_tree(note_2_2)
// add_to_tree(note_2_3)
// add_to_tree(note_3_1)
// add_to_tree(note_3_2)
// add_to_tree(note_3_3)
//
// add_to_tree(note_3_4)
// add_to_tree(note_3_5)
// add_to_tree(note_3_6)
//# sourceMappingURL=derive.js.map