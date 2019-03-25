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
import MatrixWindow = window.MatrixWindow;
import {trainer as module_trainer} from "../../src/train/trainer";
import Trainer = module_trainer.Trainer;
import {modes_control, modes_texture} from "../../src/constants/constants";
import VOCAL = modes_control.VOCAL;
import MONOPHONY = modes_texture.MONOPHONY;
import Derive = algorithm.Derive;
import {track} from "../../src/track/track";
import TrackDaoVirtual = track.TrackDaoVirtual;
import {song as module_song} from "../../src/song/song";
import SongDaoVirtual = module_song.SongDaoVirtual;
import {scene as module_scene} from "../../src/scene/scene";
import Scene = module_scene.Scene;
import Song = module_song.Song;
import SceneDaoVirtual = module_scene.SceneDaoVirtual;
import Track = track.Track;
import {segment} from "../../src/segment/segment";
import Segment = segment.Segment;


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

let algorithm_train = new Derive();

algorithm_train.set_depth(
    4
);

let window_local = new MatrixWindow(
    384,
    384,
    messenger
);


let scene, scenes;

scenes = [];

// first scene
scene = new Scene(
    new SceneDaoVirtual(

    )
);

scenes.push(scene);


// second scene
scene = new Scene(
    new SceneDaoVirtual(

    )
);

scenes.push(scene);


// third scene
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


// USER INPUT CLIP - HAS THE SEGMENTS

let clip_dao_virtual, clip_user_input;

let clips_user_input = [];


// first segment
clip_dao_virtual = new LiveClipVirtual([note_2_1]);

clip_dao_virtual.beat_start = 0;

clip_dao_virtual.beat_end = 16;

clip_user_input = new Clip(
    clip_dao_virtual
);

clips_user_input.push(clip_user_input);



// second segment
clip_dao_virtual = new LiveClipVirtual([note_2_2]);

clip_dao_virtual.beat_start = 16;

clip_dao_virtual.beat_end = 48;

clip_user_input = new Clip(
    clip_dao_virtual
);

clips_user_input.push(clip_user_input);



// third segment
clip_dao_virtual = new LiveClipVirtual([note_2_3]);

clip_dao_virtual.beat_start = 48;

clip_dao_virtual.beat_end = 64;

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


// these shouldn't matter for deriving
clip_dao_virtual = new LiveClipVirtual(
    []
);

clip_dao_virtual.beat_start = 0;

clip_dao_virtual.beat_end = 64;

clip_target = new Clip(
    clip_dao_virtual
);

clips_target.push(clip_target);

let track_target = new Track(
    new TrackDaoVirtual(
        clips_target
    )
);


track_target.load_clips();

track_user_input.load_clips();

let segments = Segment.from_notes(
    track_user_input.get_notes()
);

// assign scenes to segments
for (let segment of segments) {
    segment.set_scene(
        new Scene(
            new SceneDaoVirtual()
        )
    )
}


let trainer_local = new Trainer(
    window_local,
    user_input_handler,
    algorithm_train,
    track_target,
    track_user_input,
    song,
    segments,
    messenger
);

// test case - 2 segments, 2 notes a piece

trainer_local.commence(

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

trainer_local.clear_window(

);

let freezer_parse = new TrainFreezer(
    env
);

freezer_parse.freeze(
    trainer_local,
    '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_parse.json'
);

let thawer_parse = new TrainThawer(
    env
);

let config_parse = {
    'window': window_local,
    'user_input_handler': user_input_handler,
    'trainable': algorithm_train,
    'track_target': track_target,
    'track_user_input': track_user_input,
    'song': song,
    'segments': segments,
    'messenger': messenger,
    'env': env
};

let train_thawed_parse = thawer_parse.thaw(
    '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_parse.json',
    config_parse
);

train_thawed_parse.render_window(

);