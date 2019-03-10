import {note as n} from "../../src/note/note";
import TreeModel = require("tree-model");
import {user_input} from "../../src/control/user_input";
import UserInputHandler = user_input.UserInputHandler;
import {message} from "../../src/message/messenger";
import Messenger = message.Messenger;
import {live} from "../../src/live/live";
import LiveClipVirtual = live.LiveClipVirtual;
import {segment} from "../../src/segment/segment";
import Segment = segment.Segment;
import {clip} from "../../src/clip/clip";
import Clip = clip.Clip;
import {algorithm} from "../../src/train/algorithm";
import Detect = algorithm.Detect;
import {freeze, thaw} from "../../src/serialize/serialize";
import TrainFreezer = freeze.TrainFreezer;
import TrainThawer = thaw.TrainThawer;
import {window} from "../../src/render/window";
import ListWindow = window.ListWindow;
import {trainer} from "../../src/train/trainer";
import Trainer = trainer.Trainer;
import {modes_control, modes_texture} from "../../src/constants/constants";
import POLYPHONY = modes_texture.POLYPHONY;
import INSTRUMENTAL = modes_control.INSTRUMENTAL;


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


let mode_texture = POLYPHONY;
let mode_control = INSTRUMENTAL;

let user_input_handler = new UserInputHandler(
    mode_texture,
    mode_control
);

let env: string = 'node_for_max';
// env = 'node';


let messenger = new Messenger(env, 0, 'render');

let window_local = new ListWindow(
    384,
    384,
    messenger
);

let algorithm_train = new Detect(
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

let notes_target_clip = [
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

let clip_dao_virtual = new LiveClipVirtual(notes_target_clip);

let clip_target_virtual = new Clip(clip_dao_virtual);

let trainer_local = new Trainer(
    window_local,
    user_input_handler,
    algorithm_train,
    clip_user_input,
    clip_target_virtual,
    song,
    segments,
    messenger
);

// test case - 2 segments, 2 notes a piece

trainer_local.init(

);

trainer_local.accept_input(
    [note_target_1_subtarget_1]
);

trainer_local.accept_input(
    [note_target_1_subtarget_2]
);

trainer_local.accept_input(
    [note_target_2_subtarget_1]
);

trainer_local.accept_input(
    [note_target_2_subtarget_2]
);

trainer_local.accept_input(
    [note_target_3_subtarget_1]
);

// trainer_local.clear_window(
//
// );
//
// let freezer = new TrainFreezer(
//     env
// );
//
// freezer.freeze(
//     trainer_local,
//     '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train.json',
//     env
// );
//
// let thawer = new TrainThawer(
//     env
// );
//
// let config = {
//     'window': window_local,
//     'user_input_handler': user_input_handler,
//     'algorithm': algorithm_train,
//     'clip_user_input': clip_user_input,
//     'clip_target_virtual': clip_target_virtual,
//     'song': song,
//     'segments': segments,
//     'messenger': messenger,
//     'env': env
// };
//
// let train_thawed = thawer.thaw(
//     '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train.json',
//     config
// );
//
// train_thawed.render_window(
//
// );


// TODO: to finish test case, verify that it looks correct in window
