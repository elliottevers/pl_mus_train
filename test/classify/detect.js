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
var segment_1 = require("../../src/segment/segment");
var Segment = segment_1.segment.Segment;
var clip_1 = require("../../src/clip/clip");
var Clip = clip_1.clip.Clip;
var algorithm_1 = require("../../src/train/algorithm");
var Detect = algorithm_1.algorithm.Detect;
var window_1 = require("../../src/render/window");
var trainer_1 = require("../../src/train/trainer");
var Trainer = trainer_1.trainer.Trainer;
var constants_1 = require("../../src/constants/constants");
var POLYPHONY = constants_1.modes_texture.POLYPHONY;
var INSTRUMENTAL = constants_1.modes_control.INSTRUMENTAL;
var MatrixWindow = window_1.window.MatrixWindow;
var track_1 = require("../../src/track/track");
var song_1 = require("../../src/song/song");
var Song = song_1.song.Song;
var SongDaoVirtual = song_1.song.SongDaoVirtual;
var Track = track_1.track.Track;
var TrackDaoVirtual = track_1.track.TrackDaoVirtual;
var scene_1 = require("../../src/scene/scene");
var SceneDaoVirtual = scene_1.scene.SceneDaoVirtual;
var Scene = scene_1.scene.Scene;
var freeze_1 = require("../../src/serialize/freeze");
var TrainFreezer = freeze_1.freeze.TrainFreezer;
var thaw_1 = require("../../src/serialize/thaw");
var TrainThawer = thaw_1.thaw.TrainThawer;
var tree = new TreeModel();
var segment_note_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 0, 4, 90, 0),
    children: []
});
var segment_note_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 4, 4, 90, 0),
    children: []
});
var note_target_1_subtarget_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 0, 2, 90, 0),
    children: []
});
var note_target_1_subtarget_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(53, 0, 2, 90, 0),
    children: []
});
var note_target_2_subtarget_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(52, 2, 2, 90, 0),
    children: []
});
var note_target_2_subtarget_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(54, 2, 2, 90, 0),
    children: []
});
var note_target_3_subtarget_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(53, 4, 2, 90, 0),
    children: []
});
var note_target_3_subtarget_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(55, 4, 2, 90, 0),
    children: []
});
var note_target_4_subtarget_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(54, 6, 2, 90, 0),
    children: []
});
var note_target_4_subtarget_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(56, 6, 2, 90, 0),
    children: []
});
var mode_texture = POLYPHONY;
var mode_control = INSTRUMENTAL;
var user_input_handler = new UserInputHandler(mode_texture, mode_control);
var env = 'node_for_max';
// env = 'node';
var messenger = new Messenger(env, 0, 'render_detect');
var algorithm_train = new Detect();
var window_train = new MatrixWindow(384, 384, messenger);
var scene, scenes;
scenes = [];
scene = new Scene(new SceneDaoVirtual());
scenes.push(scene);
scene = new Scene(new SceneDaoVirtual());
scenes.push(scene);
var song = new Song(new SongDaoVirtual(scenes));
// let num_clip_slots = 2;
// USER INPUT CLIP - HAS THE SEGMENTS
var clip_dao_virtual, clip_user_input;
var clips_user_input = [];
clip_dao_virtual = new LiveClipVirtual([segment_note_1]);
clip_dao_virtual.beat_start = 0;
clip_dao_virtual.beat_end = 4;
clip_user_input = new Clip(clip_dao_virtual);
clips_user_input.push(clip_user_input);
clip_dao_virtual = new LiveClipVirtual([segment_note_2]);
clip_dao_virtual.beat_start = 4;
clip_dao_virtual.beat_end = 8;
clip_user_input = new Clip(clip_dao_virtual);
clips_user_input.push(clip_user_input);
var track_user_input = new Track(new TrackDaoVirtual(clips_user_input));
// TARGET CLIP
var clips_target = [];
var clip_target;
clip_dao_virtual = new LiveClipVirtual([
    note_target_1_subtarget_1,
    note_target_1_subtarget_2,
    note_target_2_subtarget_1,
    note_target_2_subtarget_2
]);
clip_dao_virtual.beat_start = 0;
clip_dao_virtual.beat_end = 4;
clip_target = new Clip(clip_dao_virtual);
clips_target.push(clip_target);
clip_dao_virtual = new LiveClipVirtual([
    note_target_3_subtarget_1,
    note_target_3_subtarget_2,
    note_target_4_subtarget_1,
    note_target_4_subtarget_2
]);
clip_dao_virtual.beat_start = 4;
clip_dao_virtual.beat_end = 8;
clip_target = new Clip(clip_dao_virtual);
clips_target.push(clip_target);
var track_target = new Track(new TrackDaoVirtual(clips_target));
track_target.load_clips();
track_user_input.load_clips();
var segments = Segment.from_notes(track_user_input.get_notes());
// assign scenes to segments
for (var i_segment in segments) {
    var segment_2 = segments[Number(i_segment)];
    segment_2.set_scene(new Scene(new SceneDaoVirtual()));
    segment_2.set_clip_user_input(clips_user_input[Number(i_segment)]);
}
var trainer_local = new Trainer(window_train, user_input_handler, algorithm_train, track_target, track_user_input, song, segments, messenger);
// test case - 2 segments, 2 notes a piece
trainer_local.commence();
trainer_local.accept_input([note_target_1_subtarget_1]);
trainer_local.accept_input([note_target_1_subtarget_2]);
trainer_local.accept_input([note_target_2_subtarget_1]);
trainer_local.accept_input([note_target_2_subtarget_2]);
trainer_local.accept_input([note_target_3_subtarget_1]);
trainer_local.render_window();
trainer_local.clear_window();
TrainFreezer.freeze(trainer_local, '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_detect.json', env);
trainer_local = new Trainer(window_train, user_input_handler, algorithm_train, track_target, track_user_input, song, segments, messenger, true);
var notes_thawed = TrainThawer.thaw_notes('/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_detect.json', env);
trainer_local.commence();
for (var _i = 0, notes_thawed_1 = notes_thawed; _i < notes_thawed_1.length; _i++) {
    var note = notes_thawed_1[_i];
    trainer_local.accept_input([note]);
}
trainer_local.virtualized = false;
trainer_local.render_window();
//# sourceMappingURL=detect.js.map