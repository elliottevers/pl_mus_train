import {note as n} from "../../src/note/note";
import TreeModel = require("tree-model");
import {user_input} from "../../src/control/user_input";
import UserInputHandler = user_input.UserInputHandler;
import {message} from "../../src/message/messenger";
import Messenger = message.Messenger;
import {live as li, live} from "../../src/live/live";
import LiveClipVirtual = live.LiveClipVirtual;
import {segment} from "../../src/segment/segment";
import Segment = segment.Segment;
import {clip} from "../../src/clip/clip";
import Clip = clip.Clip;
import {algorithm} from "../../src/train/algorithm";
import {freeze, thaw} from "../../src/serialize/serialize";
import TrainFreezer = freeze.TrainFreezer;
import TrainThawer = thaw.TrainThawer;
import {window} from "../../src/render/window";
import MatrixWindow = window.MatrixWindow;
import {trainer} from "../../src/train/trainer";
import Trainer = trainer.Trainer;
import {modes_control, modes_texture} from "../../src/constants/constants";
import VOCAL = modes_control.VOCAL;
import Parse = algorithm.Parse;
import MONOPHONY = modes_texture.MONOPHONY;
import Derive = algorithm.Derive;


let tree: TreeModel = new TreeModel();

// let notes_segments;

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

let notes_segments = [note_2_1, note_2_2, note_2_3];


let mode_texture = MONOPHONY;

let mode_control = VOCAL;

let user_input_handler = new UserInputHandler(
    mode_texture,
    mode_control
);

let env: string = 'node_for_max';
// env = 'node';


let messenger = new Messenger(env, 0, 'render_derive');

let algorithm_train = new Derive(
    user_input_handler
);

let window_local = new MatrixWindow(
    384,
    384,
    messenger,
    algorithm_train
);

algorithm_train.set_depth(
    3
);

// stubs
let song = {
    set_overdub: (int) => {},
    set_session_record: (int) => {},
    stop: () => {}
};

let clip_user_input = {
    fire: () => {},
    stop: () => {},
    set_endpoints_loop: (former, latter) => {}
};

let clip_user_input_synchronous = {
    fire: () => {},
    stop: () => {},
    set_endpoints_loop: (former, latter) => {}
};

let scene = {
    fire: () => {},
    // stop: () => {},
    // set_endpoints_loop: (former, latter) => {}
};

// let notes_segments = [
//     note_2_1,
//     note_2_2,
//     note_2_3
// ];

let notes_target_clip = [
    // TODO: make sure we don't do anything with these notes when deriving
    // OTHER THAN mute the target track we're deriving
];

let segments: Segment[] = [];

for (let note of notes_segments) {
    let segment = new Segment(
        note
    );

    // @ts-ignore
    segment.set_scene(scene);

    segments.push(
        segment
    )


    // let note = notes_segments[Number(i_note)];
    // let path_scene = ['live_set', 'scenes', Number(i_note)].join(' ');
    // let segment_local = new Segment(
    //     note
    // );
    // segment_local.set_scene(
    //     new Scene(
    //         new SceneDao(
    //             new li.LiveApiJs(
    //                 path_scene
    //             )
    //         )
    //     )
    // );
}


let trainer_local = new Trainer(
    window_local,
    user_input_handler,
    algorithm_train,
    clip_user_input,
    clip_user_input_synchronous,
    notes_target_clip,
    song,
    segments,
    messenger
);

// test case - 2 segments, 2 notes a piece

trainer_local.init(

);

trainer_local.accept_input(
    [note_3_1, note_3_2]
);

trainer_local.accept_input(
    [note_3_3, note_3_4]
);


trainer_local.accept_input(
    [note_3_5, note_3_6]
);

trainer_local.accept_input(
    [note_4_1]
);

trainer_local.accept_input(
    [note_4_2]
);


trainer_local.render_window(

);


// trainer_local_parse.clear_window(
//
// );
//
// let freezer_parse = new TrainFreezer(
//     env_parse
// );
//
// freezer_parse.freeze(
//     trainer_local_parse,
//     '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_parse.json'
// );
//
// let thawer_parse = new TrainThawer(
//     env_parse
// );
//
// let config_parse = {
//     'window': window_local_parse,
//     'user_input_handler': user_input_handler_parse,
//     'algorithm': algorithm_train_parse,
//     'clip_user_input': clip_user_input_parse,
//     'clip_user_input_synchronous': clip_user_input_parse_synchronous,
//     'clip_target': clip_target_virtual_parse,
//     'song': song_parse,
//     'segments': segments_parse,
//     'messenger': messenger_parse,
//     'env': env_parse
// };
//
// let train_thawed_parse = thawer_parse.thaw(
//     '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_parse.json',
//     config_parse
// );
//
// train_thawed_parse.render_window(
//
// );