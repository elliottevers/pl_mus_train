import {note as n} from "../../src/note/note";
import {set_depth_tree_export} from "../../src/scripts/parse_tree";
import TreeModel = require("tree-model");
import {user_input} from "../../src/control/user_input";
import UserInputHandler = user_input.UserInputHandler;
import {window} from "../../src/render/window";
import ListWindow = window.ListWindow;
import {trainer} from "../../src/train/trainer";
import Trainer = trainer.Trainer;
import {algorithm} from "../../src/train/algorithm";
import {struct} from "../../src/train/struct";
import StructTree = struct.StructTree;
import Detect = algorithm.Detect;
import {message} from "../../src/message/messenger";
import Messenger = message.Messenger;
import {live} from "../../src/live/live";
import LiveClipVirtual = live.LiveClipVirtual;
import {segment} from "../../src/segment/segment";
import Segment = segment.Segment;
import {clip} from "../../src/clip/clip";
import Clip = clip.Clip;
import {serialize} from "../../src/serialize/serialize";
import TrainThawer = deserialize.TrainThawer;
import TrainFreezer = serialize.TrainFreezer;
import {deserialize} from "../../src/serialize/deserialize";


let tree: TreeModel = new TreeModel();

let segment_note_1 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            51,
            1,
            4,
            90,
            0
        ),
        children: [

        ]
    }
);

let segment_note_2 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            51,
            5,
            4,
            90,
            0
        ),
        children: [

        ]
    }
);



let note_target_1_subtarget_1 = tree.parse(
    {
            id: -1, // TODO: hashing scheme for clip id and beat start
            note: new n.Note(
                51,
                1,
                2,
                90,
                0
            ),
            children: [

            ]
    }
);

let note_target_1_subtarget_2 = tree.parse(
    {
            id: -1, // TODO: hashing scheme for clip id and beat start
            note: new n.Note(
                53,
                1,
                2,
                90,
                0
            ),
            children: [

            ]
    }
);



let note_target_2_subtarget_1 = tree.parse(
    {
            id: -1, // TODO: hashing scheme for clip id and beat start
            note: new n.Note(
                52,
                3,
                2,
                90,
                0
            ),
            children: [

            ]
    }
);

let note_target_2_subtarget_2 = tree.parse(
    {
            id: -1, // TODO: hashing scheme for clip id and beat start
            note: new n.Note(
                54,
                3,
                2,
                90,
                0
            ),
            children: [

            ]
    }
);



let note_target_3_subtarget_1 = tree.parse(
    {
            id: -1, // TODO: hashing scheme for clip id and beat start
            note: new n.Note(
                53,
                5,
                2,
                90,
                0
            ),
            children: [

            ]
    }
);

let note_target_3_subtarget_2 = tree.parse(
    {
            id: -1, // TODO: hashing scheme for clip id and beat start
            note: new n.Note(
                55,
                5,
                2,
                90,
                0
            ),
            children: [

            ]
    }
);



let note_target_4_subtarget_1 = tree.parse(
    {
            id: -1, // TODO: hashing scheme for clip id and beat start
            note: new n.Note(
                54,
                7,
                2,
                90,
                0
            ),
            children: [

            ]
    }
);

let note_target_4_subtarget_2 = tree.parse(
    {
            id: -1, // TODO: hashing scheme for clip id and beat start
            note: new n.Note(
                56,
                7,
                2,
                90,
                0
            ),
            children: [

            ]
    }
);


let mode_texture = 'harmonic';
let mode_control = 'instrumental';

let user_input_handler = new UserInputHandler(
    mode_texture,
    mode_control
);

let window = new ListWindow(

);

let algorithm = new Detect(
    user_input_handler
);

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

let notes_segments = [
    segment_note_1,
    segment_note_2
];

let notes_targets = [
    note_target_1_subtarget_1,
    note_target_1_subtarget_2,
    note_target_2_subtarget_1,
    note_target_2_subtarget_2,
    note_target_3_subtarget_1,
    note_target_3_subtarget_2,
    note_target_4_subtarget_1,
    note_target_4_subtarget_2
];

let segments: Segment[] = [];

for (let note of notes_segments) {
    segments.push(
        new Segment(
            note
        )
    )
}

let clip_dao_virtual = new LiveClipVirtual(notes_targets);

let clip_target_virtual = new Clip(clip_dao_virtual);

let messenger = new Messenger('node', 0);

let trainer = new Trainer(
    window,
    user_input_handler,
    algorithm,
    clip_user_input,
    clip_target_virtual,
    song,
    segments,
    messenger
);

// test case - 2 segments, 2 notes a piece

trainer.init(

);

trainer.accept_input(
    note_target_1_subtarget_1
);

trainer.accept_input(
    note_target_1_subtarget_2
);

trainer.accept_input(
    note_target_2_subtarget_1
);

trainer.accept_input(
    note_target_2_subtarget_2
);

trainer.accept_input(
    note_target_3_subtarget_1
);

trainer.clear_window(

);

let freezer = new TrainFreezer(
    'node'
);

freezer.freeze(
    trainer,
    '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train.json'
);

let thawer = new TrainThawer(
    'node'
);

let train_thawed = thawer.thaw(
    '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train.json'
);

train_thawed.render_window(

);

// verify that it look
