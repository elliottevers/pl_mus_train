import sinon = require("sinon");
import {note as n, note} from "../../src/note/note";
import Note = note.Note;
import TreeModel = require("tree-model");
// import {song} from "../../src/song/song";
// import Song = song.Song;
// import SongDao = song.SongDao;


let song = {
    set_overdub: (int) => {},
    set_session_record: (int) => {}
};

let clip_user_input = {
    fire: () => {},
    stop: () => {},
    set_endpoints_loop: (former, latter) => {}
};


// let names_var_notes = [
//     'note_1_1',
//     'note_2_1',
//     'note_2_2',
//     'note_2_3',
//     'note_3_1',
//     'note_3_2',
//     'note_3_3',
//     'note_3_4',
//     'note_3_5',
//     'note_3_6'
// ];


let tree: TreeModel = new TreeModel();

let notes_segments;

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

let note_2_1 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            48,
            0,
            16,
            90,
            0
        ),
        children: [

        ]
    }
);

let note_2_2 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            48,
            16,
            32,
            90,
            0
        ),
        children: [

        ]
    }
);

let note_2_3 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            48,
            48,
            16,
            90,
            0
        ),
        children: [

        ]
    }
);

notes_segments = [note_2_1, note_2_2, note_2_3];

import {begin_train_export, set_depth_tree_export, add_to_tree_export} from "../../src/scripts/parse_tree";
import {message} from "../../src/message/messenger";
import Messenger = message.Messenger;

set_depth_tree_export(3);

let messenger = new Messenger('node', 0);

begin_train_export(notes_segments, clip_user_input, song, add_to_tree_export, messenger);

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
