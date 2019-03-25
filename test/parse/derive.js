"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var note_1 = require("../../src/note/note");
var TreeModel = require("tree-model");
var user_input_1 = require("../../src/control/user_input");
var UserInputHandler = user_input_1.user_input.UserInputHandler;
var messenger_1 = require("../../src/message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("../../src/live/live");
var LiveClipVirtual = live_1.live.LiveClipVirtual;
var clip_1 = require("../../src/clip/clip");
var Clip = clip_1.clip.Clip;
var algorithm_1 = require("../../src/train/algorithm");
var window_1 = require("../../src/render/window");
var MatrixWindow = window_1.window.MatrixWindow;
var trainer_1 = require("../../src/train/trainer");
var Trainer = trainer_1.trainer.Trainer;
var constants_1 = require("../../src/constants/constants");
var VOCAL = constants_1.modes_control.VOCAL;
var MONOPHONY = constants_1.modes_texture.MONOPHONY;
var Derive = algorithm_1.algorithm.Derive;
var track_1 = require("../../src/track/track");
var TrackDaoVirtual = track_1.track.TrackDaoVirtual;
var song_1 = require("../../src/song/song");
var SongDaoVirtual = song_1.song.SongDaoVirtual;
var scene_1 = require("../../src/scene/scene");
var Scene = scene_1.scene.Scene;
var Song = song_1.song.Song;
var SceneDaoVirtual = scene_1.scene.SceneDaoVirtual;
var Track = track_1.track.Track;
var segment_1 = require("../../src/segment/segment");
var Segment = segment_1.segment.Segment;
var tree = new TreeModel();
// let notes_segments;
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
var note_3_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 2, 4, 90, 0),
    children: []
});
var note_3_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(53, 8, 3, 90, 0),
    children: []
});
var note_3_3 = tree.parse({
    id: -1,
    note: new note_1.note.Note(48, 17, 4, 90, 0),
    children: []
});
var note_3_4 = tree.parse({
    id: -1,
    note: new note_1.note.Note(50, 42, 6, 90, 0),
    children: []
});
var note_3_5 = tree.parse({
    id: -1,
    note: new note_1.note.Note(40, 54, 4, 90, 0),
    children: []
});
var note_3_6 = tree.parse({
    id: -1,
    note: new note_1.note.Note(45, 59, 2, 90, 0),
    children: []
});
var note_4_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 7, 1, 90, 0),
    children: []
});
var note_4_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 25, 3, 90, 0),
    children: []
});
var notes_segments = [note_2_1, note_2_2, note_2_3];
var mode_texture = MONOPHONY;
var mode_control = VOCAL;
var user_input_handler = new UserInputHandler(mode_texture, mode_control);
var env = 'node_for_max';
env = 'node';
var messenger = new Messenger(env, 0, 'render_derive');
var algorithm_train = new Derive();
algorithm_train.set_depth(3);
var window_local = new MatrixWindow(384, 384, messenger);
var scene, scenes;
scenes = [];
// first scene
scene = new Scene(new SceneDaoVirtual());
scenes.push(scene);
// second scene
scene = new Scene(new SceneDaoVirtual());
scenes.push(scene);
// third scene
scene = new Scene(new SceneDaoVirtual());
scenes.push(scene);
var song = new Song(new SongDaoVirtual(scenes));
// USER INPUT CLIP - HAS THE SEGMENTS
var clip_dao_virtual, clip_user_input;
var clips_user_input = [];
// first segment
clip_dao_virtual = new LiveClipVirtual([note_2_1]);
clip_dao_virtual.beat_start = 0;
clip_dao_virtual.beat_end = 16;
clip_user_input = new Clip(clip_dao_virtual);
clips_user_input.push(clip_user_input);
// second segment
clip_dao_virtual = new LiveClipVirtual([note_2_2]);
clip_dao_virtual.beat_start = 16;
clip_dao_virtual.beat_end = 48;
clip_user_input = new Clip(clip_dao_virtual);
clips_user_input.push(clip_user_input);
// third segment
clip_dao_virtual = new LiveClipVirtual([note_2_3]);
clip_dao_virtual.beat_start = 48;
clip_dao_virtual.beat_end = 64;
clip_user_input = new Clip(clip_dao_virtual);
clips_user_input.push(clip_user_input);
var track_user_input = new Track(new TrackDaoVirtual(clips_user_input));
// TARGET CLIP
var clips_target = [];
var clip_target;
// these shouldn't matter for deriving
clip_dao_virtual = new LiveClipVirtual([]);
clip_dao_virtual.beat_start = 0;
clip_dao_virtual.beat_end = 64;
clip_target = new Clip(clip_dao_virtual);
clips_target.push(clip_target);
var track_target = new Track(new TrackDaoVirtual(clips_target));
track_target.load_clips();
track_user_input.load_clips();
var segments = Segment.from_notes(track_user_input.get_notes());
// assign scenes to segments
for (var _i = 0, segments_1 = segments; _i < segments_1.length; _i++) {
    var segment_2 = segments_1[_i];
    segment_2.set_scene(new Scene(new SceneDaoVirtual()));
}
var trainer_local = new Trainer(window_local, user_input_handler, algorithm_train, track_target, track_user_input, song, segments, messenger);
// test case - 2 segments, 2 notes a piece
trainer_local.commence();
trainer_local.accept_input([note_3_1, note_3_2]);
// trainer_local.accept_input(
//     [note_3_3, note_3_4]
// );
//
//
// trainer_local.accept_input(
//     [note_3_5, note_3_6]
// );
//
// trainer_local.accept_input(
//     [note_4_1]
// );
//
// trainer_local.accept_input(
//     [note_4_2]
// );
trainer_local.render_window();
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
//# sourceMappingURL=derive.js.map