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
var Parse = algorithm_1.algorithm.Parse;
var MONOPHONY = constants_1.modes_texture.MONOPHONY;
var track_1 = require("../../src/track/track");
var TrackDaoVirtual = track_1.track.TrackDaoVirtual;
var Track = track_1.track.Track;
var song_1 = require("../../src/song/song");
var SongDaoVirtual = song_1.song.SongDaoVirtual;
var scene_1 = require("../../src/scene/scene");
var Scene = scene_1.scene.Scene;
var Song = song_1.song.Song;
var SceneDaoVirtual = scene_1.scene.SceneDaoVirtual;
var segment_1 = require("../../src/segment/segment");
var Segment = segment_1.segment.Segment;
var freeze_1 = require("../../src/serialize/freeze");
var TrainFreezer = freeze_1.freeze.TrainFreezer;
var thaw_1 = require("../../src/serialize/thaw");
var TrainThawer = thaw_1.thaw.TrainThawer;
var _ = require('underscore');
var tree = new TreeModel();
var segment_note_1_parse = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 0, 4, 90, 0),
    children: []
});
var segment_note_2_parse = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 4, 4, 90, 0),
    children: []
});
var note_melody_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 0, 1, 90, 0),
    children: []
});
var note_melody_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(53, 1, 1, 90, 0),
    children: []
});
var note_melody_3 = tree.parse({
    id: -1,
    note: new note_1.note.Note(55, 2, 1, 90, 0),
    children: []
});
var note_melody_4 = tree.parse({
    id: -1,
    note: new note_1.note.Note(56, 3, 1, 90, 0),
    children: []
});
var note_melody_5 = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 4, 1, 90, 0),
    children: []
});
var note_melody_6 = tree.parse({
    id: -1,
    note: new note_1.note.Note(53, 5, 1, 90, 0),
    children: []
});
var note_melody_7 = tree.parse({
    id: -1,
    note: new note_1.note.Note(55, 6, 1, 90, 0),
    children: []
});
var note_melody_8 = tree.parse({
    id: -1,
    note: new note_1.note.Note(56, 7, 1, 90, 0),
    children: []
});
var note_melody_parsed_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 0, 2, 90, 0),
    children: []
});
var note_melody_parsed_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(53, 2, 2, 90, 0),
    children: []
});
var note_melody_parsed_3 = tree.parse({
    id: -1,
    note: new note_1.note.Note(55, 4, 2, 90, 0),
    children: []
});
var note_melody_parsed_4 = tree.parse({
    id: -1,
    note: new note_1.note.Note(56, 6, 2, 90, 0),
    children: []
});
var note_summarized_melody_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 0, 4, 90, 0),
    children: []
});
var note_summarized_melody_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(55, 4, 4, 90, 0),
    children: []
});
// TODO: shouldn't this be automatically determined by the trainer?
var note_summarized_root = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 1, 8, 90, 0),
    children: []
});
var mode_texture_parse = MONOPHONY;
var mode_control_parse = VOCAL;
var user_input_handler_parse = new UserInputHandler(mode_texture_parse, mode_control_parse);
var env_parse = 'node_for_max';
// env_parse = 'node';
var messenger_parse = new Messenger(env_parse, 0, 'render_parse');
var algorithm_train_parse = new Parse();
algorithm_train_parse.set_depth(3);
var window_local_parse = new MatrixWindow(384, 384, messenger_parse);
var scene, scenes;
scenes = [];
scene = new Scene(new SceneDaoVirtual());
scenes.push(scene);
scene = new Scene(new SceneDaoVirtual());
scenes.push(scene);
var song_parse = new Song(new SongDaoVirtual(scenes));
// let num_clip_slots = 2;
// USER INPUT CLIP - HAS THE SEGMENTS
var clip_dao_virtual, clip_user_input;
var clips_user_input = [];
clip_dao_virtual = new LiveClipVirtual([segment_note_1_parse]);
clip_dao_virtual.beat_start = 0;
clip_dao_virtual.beat_end = 4;
clip_user_input = new Clip(clip_dao_virtual);
clips_user_input.push(clip_user_input);
clip_dao_virtual = new LiveClipVirtual([segment_note_2_parse]);
clip_dao_virtual.beat_start = 4;
clip_dao_virtual.beat_end = 8;
clip_user_input = new Clip(clip_dao_virtual);
clips_user_input.push(clip_user_input);
var track_user_input = new Track(new TrackDaoVirtual(clips_user_input));
// TARGET CLIP
var clips_target = [];
var clip_target;
clip_dao_virtual = new LiveClipVirtual([
    note_melody_1,
    note_melody_2,
    note_melody_3,
    note_melody_4
]);
clip_dao_virtual.beat_start = 0;
clip_dao_virtual.beat_end = 4;
clip_target = new Clip(clip_dao_virtual);
clips_target.push(clip_target);
clip_dao_virtual = new LiveClipVirtual([
    note_melody_5,
    note_melody_6,
    note_melody_7,
    note_melody_8
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
var trainer_local_parse = new Trainer(window_local_parse, user_input_handler_parse, algorithm_train_parse, track_target, track_user_input, song_parse, segments, messenger_parse);
// test case - 2 segments, 2 notes a piece
trainer_local_parse.commence();
trainer_local_parse.accept_input([note_melody_parsed_1, note_melody_parsed_2]);
trainer_local_parse.accept_input([note_melody_parsed_3, note_melody_parsed_4]);
trainer_local_parse.render_window();
trainer_local_parse.clear_window();
TrainFreezer.freeze(trainer_local_parse, '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_parse.json', env_parse);
// TODO: batch up the notes into the segments
trainer_local_parse = new Trainer(window_local_parse, user_input_handler_parse, algorithm_train_parse, track_target, track_user_input, song_parse, segments, messenger_parse, true);
var matrix_deserialized = TrainThawer.thaw_notes_matrix('/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_parse.json', env_parse);
trainer_local_parse.commence();
// skip over the layer of segments
var input_left = true;
while (input_left) {
    var coord_current = trainer_local_parse.iterator_matrix_train.get_coord_current();
    var coord_user_input_history = algorithm_train_parse.coord_to_index_history_user_input(coord_current);
    if (trainer_local_parse.iterator_matrix_train.done || matrix_deserialized[coord_user_input_history[0]][coord_user_input_history[1]].length === 0) {
        algorithm_train_parse.terminate(trainer_local_parse.struct_train, segments);
        algorithm_train_parse.pause(song_parse, trainer_local_parse.segment_current.scene);
        input_left = false;
        continue;
    }
    trainer_local_parse.accept_input(matrix_deserialized[coord_user_input_history[0]][coord_user_input_history[1]]);
}
trainer_local_parse.virtualized = false;
trainer_local_parse.render_window();
//# sourceMappingURL=parse.js.map