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
import {algorithm} from "../../src/train/algorithm";
import {freeze, thaw} from "../../src/serialize/serialize";
import TrainFreezer = freeze.TrainFreezer;
import TrainThawer = thaw.TrainThawer;
import {window} from "../../src/render/window";
import {trainer} from "../../src/train/trainer";
import Trainer = trainer.Trainer;
import {modes_control, modes_texture} from "../../src/constants/constants";
import POLYPHONY = modes_texture.POLYPHONY;
import INSTRUMENTAL = modes_control.INSTRUMENTAL;
import MatrixWindow = window.MatrixWindow;
import Predict = algorithm.Predict;
import {scene as module_scene} from "../../src/scene/scene";
import SceneDaoVirtual = module_scene.SceneDaoVirtual;
import {track} from "../../src/track/track";
import TrackDaoVirtual = track.TrackDaoVirtual;
import {song as module_song} from "../../src/song/song";
import SongDaoVirtual = module_song.SongDaoVirtual;
import Scene = module_scene.Scene;
import Song = module_song.Song;
import Track = track.Track;


let tree: TreeModel = new TreeModel();

let segment_note_1 = tree.parse(
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

let segment_note_2 = tree.parse(
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



let note_target_1_subtarget_1 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            51,
            0,
            2,
            90,
            0
        ),
        children: [

        ]
    }
);

// let note_target_1_subtarget_2 = tree.parse(
//     {
//         id: -1, // TODO: hashing scheme for clip id and beat start
//         note: new n.Note(
//             53,
//             1,
//             2,
//             90,
//             0
//         ),
//         children: [
//
//         ]
//     }
// );



let note_target_2_subtarget_1 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            52,
            2,
            2,
            90,
            0
        ),
        children: [

        ]
    }
);

// let note_target_2_subtarget_2 = tree.parse(
//     {
//         id: -1, // TODO: hashing scheme for clip id and beat start
//         note: new n.Note(
//             54,
//             3,
//             2,
//             90,
//             0
//         ),
//         children: [
//
//         ]
//     }
// );



let note_target_3_subtarget_1 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            53,
            4,
            2,
            90,
            0
        ),
        children: [

        ]
    }
);

// let note_target_3_subtarget_2 = tree.parse(
//     {
//         id: -1, // TODO: hashing scheme for clip id and beat start
//         note: new n.Note(
//             55,
//             5,
//             2,
//             90,
//             0
//         ),
//         children: [
//
//         ]
//     }
// );



let note_target_4_subtarget_1 = tree.parse(
    {
        id: -1, // TODO: hashing scheme for clip id and beat start
        note: new n.Note(
            54,
            6,
            2,
            90,
            0
        ),
        children: [

        ]
    }
);

// let note_target_4_subtarget_2 = tree.parse(
//     {
//         id: -1, // TODO: hashing scheme for clip id and beat start
//         note: new n.Note(
//             56,
//             7,
//             2,
//             90,
//             0
//         ),
//         children: [
//
//         ]
//     }
// );


let mode_texture = POLYPHONY;
let mode_control = INSTRUMENTAL;

let user_input_handler = new UserInputHandler(
    mode_texture,
    mode_control
);

let env: string = 'node_for_max';
// env = 'node';


let messenger = new Messenger(env, 0, 'render_predict');

let algorithm_train = new Predict(
);

let window_train = new MatrixWindow(
    384,
    384,
    messenger
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

let song = new Song(
    new SongDaoVirtual(
        scenes
    )
);

// let num_clip_slots = 2;


// USER INPUT CLIP - HAS THE SEGMENTS

let clip_dao_virtual, clip_user_input;

let clips_user_input = [];


clip_dao_virtual = new LiveClipVirtual([segment_note_1]);

clip_dao_virtual.beat_start = 0;

clip_dao_virtual.beat_end = 4;

clip_user_input = new Clip(
    clip_dao_virtual
);

clips_user_input.push(clip_user_input);



clip_dao_virtual = new LiveClipVirtual([segment_note_2]);

clip_dao_virtual.beat_start = 4;

clip_dao_virtual.beat_end = 8;

clip_user_input = new Clip(
    clip_dao_virtual
);

clips_user_input.push(clip_user_input);



let track_user_input = new Track(
    new TrackDaoVirtual(
        clips_user_input
    )
);

// TARGET CLIP

let clips_target = [];

let clip_target;

clip_dao_virtual = new LiveClipVirtual(
    [
        note_target_1_subtarget_1,
        note_target_2_subtarget_1,
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
        note_target_3_subtarget_1,
        note_target_4_subtarget_1,
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
        clips_target
    )
);

let trainer_local = new Trainer(
    window_train,
    user_input_handler,
    algorithm_train,
    track_target,
    track_user_input,
    song,
    messenger
);

// test case - 2 segments, 2 notes a piece

trainer_local.commence(

);

trainer_local.accept_input(
    [note_target_1_subtarget_1]
);

// trainer_local.accept_input(
//     [note_target_1_subtarget_2]
// );

trainer_local.accept_input(
    [note_target_2_subtarget_1]
);

// trainer_local.accept_input(
//     [note_target_2_subtarget_2]
// );

trainer_local.accept_input(
    [note_target_3_subtarget_1]
);

trainer_local.render_window(

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
//     '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_detect.json'
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
//     'clip_target': clip_target,
//     'song': song,
//     'segments': segments,
//     'messenger': messenger,
//     'env': env
// };
//
// let train_thawed = thawer.thaw(
//     '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_detect.json',
//     config
// );
//
// train_thawed.render_window(
//
// );