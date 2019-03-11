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
import MatrixWindow = window.MatrixWindow;
import {trainer} from "../../src/train/trainer";
import Trainer = trainer.Trainer;
import {modes_control, modes_texture} from "../../src/constants/constants";
import MONOPONY = modes_texture.MONOPONY;
import VOCAL = modes_control.VOCAL;
import Parse = algorithm.Parse;


let tree: TreeModel = new TreeModel();

// let tree: TreeModel = new TreeModel();

let segment_note_1_parse = tree.parse(
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

let segment_note_2_parse = tree.parse(
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


let note_melody_1 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            51,
            1,
            1,
            90,
            0
        ),
        children: [

        ]
    }
);

let note_melody_2 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            53,
            2,
            1,
            90,
            0
        ),
        children: [

        ]
    }
);



let note_melody_3 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            55,
            3,
            1,
            90,
            0
        ),
        children: [

        ]
    }
);

let note_melody_4 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            56,
            4,
            1,
            90,
            0
        ),
        children: [

        ]
    }
);


let note_melody_5 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            51,
            5,
            1,
            90,
            0
        ),
        children: [

        ]
    }
);

let note_melody_6 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            53,
            6,
            1,
            90,
            0
        ),
        children: [

        ]
    }
);



let note_melody_7 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            55,
            7,
            1,
            90,
            0
        ),
        children: [

        ]
    }
);

let note_melody_8 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            56,
            8,
            1,
            90,
            0
        ),
        children: [

        ]
    }
);



let note_melody_parsed_1 = tree.parse(
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

let note_melody_parsed_2 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            53,
            3,
            2,
            90,
            0
        ),
        children: [

        ]
    }
);



let note_melody_parsed_3 = tree.parse(
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

let note_melody_parsed_4 = tree.parse(
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



let note_summarized_melody_1 = tree.parse(
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

let note_summarized_melody_2 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            55,
            5,
            4,
            90,
            0
        ),
        children: [

        ]
    }
);

let note_summarized_root = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            51,
            1,
            8,
            90,
            0
        ),
        children: [

        ]
    }
);


let mode_texture_parse = MONOPONY;
let mode_control_parse = VOCAL;

let user_input_handler_parse = new UserInputHandler(
    mode_texture_parse,
    mode_control_parse
);

let env_parse: string = 'node_for_max';
env_parse = 'node';


let messenger_parse = new Messenger(env_parse, 0, 'render_parse');

let window_local_parse = new MatrixWindow(
    384,
    384,
    messenger_parse
);

let algorithm_train_parse = new Parse(
    user_input_handler_parse
);

algorithm_train_parse.set_depth(
    3
);

// stubs
let song_parse = {
    set_overdub: (int) => {},
    set_session_record: (int) => {}
};

let clip_user_input_parse = {
    fire: () => {},
    stop: () => {},
    set_endpoints_loop: (former, latter) => {}
};

let notes_segments_parse = [
    segment_note_1_parse,
    segment_note_2_parse
];

let notes_target_clip_parse = [
    note_melody_1,
    note_melody_2,
    note_melody_3,
    note_melody_4,
    note_melody_5,
    note_melody_6,
    note_melody_7,
    note_melody_8
];

let segments_parse: Segment[] = [];

for (let note of notes_segments_parse) {
    segments_parse.push(
        new Segment(
            note
        )
    )
}

let clip_dao_virtual_parse = new LiveClipVirtual(notes_target_clip_parse);

let clip_target_virtual_parse = new Clip(clip_dao_virtual_parse);

let trainer_local_parse = new Trainer(
    window_local_parse,
    user_input_handler_parse,
    algorithm_train_parse,
    clip_user_input_parse,
    clip_target_virtual_parse,
    song_parse,
    segments_parse,
    messenger_parse
);

// test case - 2 segments, 2 notes a piece

trainer_local_parse.init(

);

trainer_local_parse.accept_input(
    [note_melody_parsed_1, note_melody_parsed_2]
);

trainer_local_parse.accept_input(
    [note_melody_parsed_3, note_melody_parsed_4]
);

trainer_local_parse.render_window(

);
//
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
//     '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train.json'
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
//     'clip_target_virtual': clip_target_virtual_parse,
//     'song': song_parse,
//     'segments': segments_parse,
//     'messenger': messenger_parse,
//     'env': env_parse
// };
//
// let train_thawed_parse = thawer_parse.thaw(
//     '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train.json',
//     config_parse
// );
//
// train_thawed_parse.render_window(
//
// );