import {note as n} from "../../src/note/note";
import TreeModel = require("tree-model");
import {user_input} from "../../src/control/user_input";
import UserInputHandler = user_input.UserInputHandler;
import {message} from "../../src/message/messenger";
import Messenger = message.Messenger;
import {live} from "../../src/live/live";
import LiveClipVirtual = live.LiveClipVirtual;
import {clip} from "../../src/clip/clip";
import Clip = clip.Clip;
import {window} from "../../src/render/window";
import MatrixWindow = window.MatrixWindow;
import {trainer} from "../../src/train/trainer";
import Trainer = trainer.Trainer;
import {modes_control, modes_texture} from "../../src/constants/constants";
import VOCAL = modes_control.VOCAL;
import MONOPHONY = modes_texture.MONOPHONY;
import {track} from "../../src/track/track";
import TrackDaoVirtual = track.TrackDaoVirtual;
import Track = track.Track;
import {song} from "../../src/song/song";
import SongDaoVirtual = song.SongDaoVirtual;
import {scene as module_scene} from "../../src/scene/scene";
import Scene = module_scene.Scene;
import Song = song.Song;
import SceneDaoVirtual = module_scene.SceneDaoVirtual;
import {segment} from "../../src/segment/segment";
import Segment = segment.Segment;
import {freeze} from "../../src/serialize/freeze";
import TrainFreezer = freeze.TrainFreezer;
import {thaw} from "../../src/serialize/thaw";
import TrainThawer = thaw.TrainThawer;
import {parsed} from "../../src/algorithm/parsed";
import Parsed = parsed.Parsed;
import StructTrain = trainer.StructTrain;
import {parse} from "../../src/parse/parse";
import StructParse = parse.StructParse;
import {parse as algo_parse} from "../../src/algorithm/parse";
import Parse = algo_parse.Parse;
import {iterate} from "../../src/train/iterate";
import FORWARDS = iterate.FORWARDS;
import BACKWARDS = iterate.BACKWARDS;
const _ = require('underscore');


let tree: TreeModel = new TreeModel();

let segment_note_1_parse = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            51,
            0,
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
            4,
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
            0,
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
            1,
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
            2,
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
            3,
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
            4,
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
            5,
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
            6,
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
            7,
            1,
            90,
            0
        ),
        children: [

        ]
    }
);



// let note_melody_parsed_1 = tree.parse(
//     {
//         id: -1, // TODO: hashing scheme for clip id and beat start
//         note: new n.Note(
//             51,
//             0,
//             2,
//             90,
//             0
//         ),
//         children: [
//
//         ]
//     }
// );
//
// let note_melody_parsed_2 = tree.parse(
//     {
//         id: -1, // TODO: hashing scheme for clip id and beat start
//         note: new n.Note(
//             53,
//             2,
//             1.9,
//             90,
//             0
//         ),
//         children: [
//
//         ]
//     }
// );

let note_melody_parsed_1 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            51,
            0.192290261822,
            1.83437630078,
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
            2.18303857601,
            1.74149652431,
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
            4,
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
            6,
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
            0,
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
            4,
            4,
            90,
            0
        ),
        children: [

        ]
    }
);

// TODO: shouldn't this be automatically determined by the trainer?
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


let mode_texture_parse = MONOPHONY;

let mode_control_parse = VOCAL;

let user_input_handler_parse = new UserInputHandler(
    mode_texture_parse,
    mode_control_parse
);

let env_parse: string = 'node_for_max';
// env_parse = 'node';


let messenger_parse = new Messenger(env_parse, 0, 'render_parse');

let algorithm_train_parse = new Parse(

);

algorithm_train_parse.set_depth(
    3
);

let window_local_parse = new MatrixWindow(
    384,
    384,
    messenger_parse
);


let scene, scenes;

scenes = [];

scene = new Scene(
    new SceneDaoVirtual(

    )
);

scenes.push(scene);

scene = new Scene(
    new SceneDaoVirtual(

    )
);

scenes.push(scene);

let song_parse = new Song(
    new SongDaoVirtual(
        scenes
    )
);

// let num_clip_slots = 2;


// USER INPUT CLIP - HAS THE SEGMENTS

let clip_dao_virtual, clip_user_input;

let clips_user_input = [];


clip_dao_virtual = new LiveClipVirtual([segment_note_1_parse]);

clip_dao_virtual.beat_start = 0;

clip_dao_virtual.beat_end = 4;

clip_user_input = new Clip(
    clip_dao_virtual
);

clips_user_input.push(clip_user_input);



clip_dao_virtual = new LiveClipVirtual([segment_note_2_parse]);

clip_dao_virtual.beat_start = 4;

clip_dao_virtual.beat_end = 8;

clip_user_input = new Clip(
    clip_dao_virtual
);

clips_user_input.push(clip_user_input);



let track_user_input = new Track(
    new TrackDaoVirtual(
        clips_user_input,
        new Messenger(env_parse, 0)
    )
);

// TARGET CLIP

let clips_target = [];

let clip_target;

clip_dao_virtual = new LiveClipVirtual(
    [
        note_melody_1,
        note_melody_2,
        note_melody_3,
        note_melody_4
    ]
);

clip_dao_virtual.beat_start = 0;

clip_dao_virtual.beat_end = 4;

clip_target = new Clip(
    clip_dao_virtual
);

clips_target.push(clip_target);



clip_dao_virtual = new LiveClipVirtual(
    [
        note_melody_5,
        note_melody_6,
        note_melody_7,
        note_melody_8
    ]
);

clip_dao_virtual.beat_start = 4;

clip_dao_virtual.beat_end = 8;

clip_target = new Clip(
    clip_dao_virtual
);

clips_target.push(clip_target);


let track_target = new Track(
    new TrackDaoVirtual(
        clips_target,
        new Messenger(env_parse, 0)
    )
);

track_target.load_clips();

track_user_input.load_clips();

let segments = Segment.from_notes(
    track_user_input.get_notes()
);

// assign scenes to segments
for (let i_segment in segments) {
    let segment = segments[Number(i_segment)];

    segment.set_scene(
        new Scene(
            new SceneDaoVirtual()
        )
    );

    segment.set_clip_user_input(
        clips_user_input[Number(i_segment)]
    )
}

// let direction = BACKWARDS;
let direction = FORWARDS;

algorithm_train_parse.set_direction(direction);

let trainer_local_parse = new Trainer(
    window_local_parse,
    user_input_handler_parse,
    algorithm_train_parse,
    track_target,
    track_user_input,
    song_parse,
    segments,
    messenger_parse
);

// test case - 2 segments, 2 notes a piece

trainer_local_parse.commence(

);

if (direction === FORWARDS) {
    trainer_local_parse.accept_input(
        [note_melody_parsed_1, note_melody_parsed_2]
    );

    // trainer_local_parse.accept_input(
    //     [note_melody_parsed_3, note_melody_parsed_4]
    // );
} else {

    trainer_local_parse.accept_input(
        [note_melody_parsed_3, note_melody_parsed_4]
    );

    // trainer_local_parse.accept_input(
    //     [note_melody_parsed_1, note_melody_parsed_2]
    // );
}

trainer_local_parse.render_window(

);


trainer_local_parse.clear_window(

);

let filename_save = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/test/cache/train_parse.json';

TrainFreezer.freeze(
    trainer_local_parse,
    filename_save,
    env_parse
);

// TODO: batch up the notes into the segments
trainer_local_parse = new Trainer(
    window_local_parse,
    user_input_handler_parse,
    algorithm_train_parse,
    track_target,
    track_user_input,
    song_parse,
    segments,
    messenger_parse,
    true
);

let matrix_deserialized = TrainThawer.thaw_notes_matrix(
    filename_save,
    env_parse
);

let algorithm_parsed = algorithm_train_parse as Parsed;

algorithm_parsed.restore(
    trainer_local_parse,
    segments,
    matrix_deserialized as StructTrain as StructParse
);

trainer_local_parse.virtualized = false;

trainer_local_parse.restore_user_input();

trainer_local_parse.render_window();

// trainer_local_parse.accept_input(
//     [note_melody_parsed_3, note_melody_parsed_4]
// );

// trainer_local_parse.accept_input(
//     [note_melody_parsed_1, note_melody_parsed_2]
// );
