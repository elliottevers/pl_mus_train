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
var window_1 = require("../../src/render/window");
var MatrixWindow = window_1.window.MatrixWindow;
var trainer_1 = require("../../src/train/trainer");
var Trainer = trainer_1.trainer.Trainer;
var constants_1 = require("../../src/constants/constants");
var VOCAL = constants_1.modes_control.VOCAL;
var Parse = algorithm_1.algorithm.Parse;
var MONOPHONY = constants_1.modes_texture.MONOPHONY;
var tree = new TreeModel();
// let tree: TreeModel = new TreeModel();
var segment_note_1_parse = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 1, 4, 90, 0),
    children: []
});
var segment_note_2_parse = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 5, 4, 90, 0),
    children: []
});
var note_melody_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 1, 1, 90, 0),
    children: []
});
var note_melody_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(53, 2, 1, 90, 0),
    children: []
});
var note_melody_3 = tree.parse({
    id: -1,
    note: new note_1.note.Note(55, 3, 1, 90, 0),
    children: []
});
var note_melody_4 = tree.parse({
    id: -1,
    note: new note_1.note.Note(56, 4, 1, 90, 0),
    children: []
});
var note_melody_5 = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 5, 1, 90, 0),
    children: []
});
var note_melody_6 = tree.parse({
    id: -1,
    note: new note_1.note.Note(53, 6, 1, 90, 0),
    children: []
});
var note_melody_7 = tree.parse({
    id: -1,
    note: new note_1.note.Note(55, 7, 1, 90, 0),
    children: []
});
var note_melody_8 = tree.parse({
    id: -1,
    note: new note_1.note.Note(56, 8, 1, 90, 0),
    children: []
});
var note_melody_parsed_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 1, 2, 90, 0),
    children: []
});
var note_melody_parsed_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(53, 3, 2, 90, 0),
    children: []
});
var note_melody_parsed_3 = tree.parse({
    id: -1,
    note: new note_1.note.Note(55, 5, 2, 90, 0),
    children: []
});
var note_melody_parsed_4 = tree.parse({
    id: -1,
    note: new note_1.note.Note(56, 7, 2, 90, 0),
    children: []
});
var note_summarized_melody_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 1, 4, 90, 0),
    children: []
});
var note_summarized_melody_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(55, 5, 4, 90, 0),
    children: []
});
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
var algorithm_train_parse = new Parse(user_input_handler_parse);
var window_local_parse = new MatrixWindow(384, 384, messenger_parse, algorithm_train_parse);
algorithm_train_parse.set_depth(3);
// stubs
var song_parse = {
    set_overdub: function (int) { },
    set_session_record: function (int) { },
    stop: function () { }
};
var clip_user_input_parse = {
    fire: function () { },
    stop: function () { },
    set_endpoints_loop: function (former, latter) { }
};
var clip_user_input_parse_synchronous = {
    fire: function () { },
    stop: function () { },
    set_endpoints_loop: function (former, latter) { }
};
var scene = {
    fire: function () { },
};
var notes_segments_parse = [
    segment_note_1_parse,
    segment_note_2_parse
];
var notes_target_clip_parse = [
    note_melody_1,
    note_melody_2,
    note_melody_3,
    note_melody_4,
    note_melody_5,
    note_melody_6,
    note_melody_7,
    note_melody_8
];
var segments_parse = [];
for (var _i = 0, notes_segments_parse_1 = notes_segments_parse; _i < notes_segments_parse_1.length; _i++) {
    var note = notes_segments_parse_1[_i];
    var segment_2 = new Segment(note);
    // @ts-ignore
    segment_2.set_scene(scene);
    segments_parse.push(segment_2);
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
var clip_dao_virtual_parse = new LiveClipVirtual(notes_target_clip_parse);
var clip_target_virtual_parse = new Clip(clip_dao_virtual_parse);
var trainer_local_parse = new Trainer(window_local_parse, user_input_handler_parse, algorithm_train_parse, clip_user_input_parse, clip_user_input_parse_synchronous, 
// clip_target_virtual_parse.get_notes(
//     clip_target_virtual_parse.get_beat_start(),
//     0,
//     clip_target_virtual_parse.get_beat_end(),
//     128
// ),
notes_target_clip_parse, song_parse, segments_parse, messenger_parse);
// test case - 2 segments, 2 notes a piece
trainer_local_parse.init();
trainer_local_parse.accept_input([note_melody_parsed_1, note_melody_parsed_2]);
trainer_local_parse.accept_input([note_melody_parsed_3, note_melody_parsed_4]);
// trainer_local_parse.render_window(
//
// );
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
//# sourceMappingURL=parse.js.map