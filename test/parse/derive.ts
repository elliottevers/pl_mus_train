import {note as n, note} from "../../src/note/note";
import TreeModel = require("tree-model");
import {begin_train_export, set_depth_tree_export, add_to_tree_export} from "../../src/scripts/parse_tree";
import {message} from "../../src/message/messenger";
import Messenger = message.Messenger;

// stubs
let song = {
    set_overdub: (int) => {},
    set_session_record: (int) => {}
};

let clip_user_input = {
    fire: () => {},
    stop: () => {},
    set_endpoints_loop: (former, latter) => {}
};


let tree: TreeModel = new TreeModel();

let notes_segments;

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
            49,
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
            50,
            48,
            16,
            90,
            0
        ),
        children: [

        ]
    }
);

let note_3_1 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            51,
            2,
            4,
            90,
            0
        ),
        children: [

        ]
    }
);

let note_3_2 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            53,
            8,
            3,
            90,
            0
        ),
        children: [

        ]
    }
);

let note_3_3 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            48,
            17,
            4,
            90,
            0
        ),
        children: [

        ]
    }
);

let note_3_4 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            50,
            42,
            6,
            90,
            0
        ),
        children: [

        ]
    }
);

let note_3_5 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            40,
            54,
            4,
            90,
            0
        ),
        children: [

        ]
    }
);

let note_3_6 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            45,
            59,
            2,
            90,
            0
        ),
        children: [

        ]
    }
);

let note_4_1 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            51,
            7,
            1,
            90,
            0
        ),
        children: [

        ]
    }
);

let note_4_2 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            51,
            25,
            3,
            90,
            0
        ),
        children: [

        ]
    }
);

notes_segments = [note_2_1, note_2_2, note_2_3];

set_depth_tree_export(4);

let env: string;
env = 'node';
// env = 'node_for_max';
// const Max = require('max-api');

let messenger = new Messenger(env, 0);


begin_train_export(notes_segments, clip_user_input, song, add_to_tree_export, messenger);

add_to_tree_export(
    [note_3_1, note_3_2],
    note_2_1.model.note.beat_start,
    note_2_1.model.note.get_beat_end(),
    clip_user_input,
    song,
    messenger
);

add_to_tree_export(
    [note_3_3, note_3_4],
    note_2_2.model.note.beat_start,
    note_2_2.model.note.get_beat_end(),
    clip_user_input,
    song,
    messenger
);

add_to_tree_export(
    [note_3_5, note_3_6],
    note_2_3.model.note.beat_start,
    note_2_3.model.note.get_beat_end(),
    clip_user_input,
    song,
    messenger
);

add_to_tree_export(
    [note_4_1],
    note_2_1.model.note.beat_start,
    note_2_1.model.note.get_beat_end(),
    clip_user_input,
    song,
    messenger
);

add_to_tree_export(
    [note_4_2],
    note_2_2.model.note.beat_start,
    note_2_2.model.note.get_beat_end(),
    clip_user_input,
    song,
    messenger
);
