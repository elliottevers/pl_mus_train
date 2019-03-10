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
var serialize_1 = require("../../src/serialize/serialize");
var TrainFreezer = serialize_1.freeze.TrainFreezer;
var TrainThawer = serialize_1.thaw.TrainThawer;
var window_1 = require("../../src/render/window");
var ListWindow = window_1.window.ListWindow;
var trainer_1 = require("../../src/train/trainer");
var Trainer = trainer_1.trainer.Trainer;
var constants_1 = require("../../src/constants/constants");
var POLYPHONY = constants_1.modes_texture.POLYPHONY;
var INSTRUMENTAL = constants_1.modes_control.INSTRUMENTAL;
var tree = new TreeModel();
var segment_note_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 1, 4, 90, 0),
    children: []
});
var segment_note_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 5, 4, 90, 0),
    children: []
});
var note_target_1_subtarget_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(51, 1, 2, 90, 0),
    children: []
});
var note_target_1_subtarget_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(53, 1, 2, 90, 0),
    children: []
});
var note_target_2_subtarget_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(52, 3, 2, 90, 0),
    children: []
});
var note_target_2_subtarget_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(54, 3, 2, 90, 0),
    children: []
});
var note_target_3_subtarget_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(53, 5, 2, 90, 0),
    children: []
});
var note_target_3_subtarget_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(55, 5, 2, 90, 0),
    children: []
});
var note_target_4_subtarget_1 = tree.parse({
    id: -1,
    note: new note_1.note.Note(54, 7, 2, 90, 0),
    children: []
});
var note_target_4_subtarget_2 = tree.parse({
    id: -1,
    note: new note_1.note.Note(56, 7, 2, 90, 0),
    children: []
});
var mode_texture = POLYPHONY;
var mode_control = INSTRUMENTAL;
var user_input_handler = new UserInputHandler(mode_texture, mode_control);
var messenger = new Messenger('node', 0);
var window_local = new ListWindow(384, 384, messenger);
var algorithm_train = new Detect(user_input_handler);
// stubs
var song = {
    set_overdub: function (int) { },
    set_session_record: function (int) { }
};
var clip_user_input = {
    fire: function () { },
    stop: function () { },
    set_endpoints_loop: function (former, latter) { }
};
var notes_segments = [
    segment_note_1,
    segment_note_2
];
var notes_target_clip = [
    note_target_1_subtarget_1,
    note_target_1_subtarget_2,
    note_target_2_subtarget_1,
    note_target_2_subtarget_2,
    note_target_3_subtarget_1,
    note_target_3_subtarget_2,
    note_target_4_subtarget_1,
    note_target_4_subtarget_2
];
var segments = [];
for (var _i = 0, notes_segments_1 = notes_segments; _i < notes_segments_1.length; _i++) {
    var note = notes_segments_1[_i];
    segments.push(new Segment(note));
}
var clip_dao_virtual = new LiveClipVirtual(notes_target_clip);
var clip_target_virtual = new Clip(clip_dao_virtual);
var trainer_local = new Trainer(window_local, user_input_handler, algorithm_train, clip_user_input, clip_target_virtual, song, segments, messenger);
// test case - 2 segments, 2 notes a piece
trainer_local.init();
trainer_local.accept_input([note_target_1_subtarget_1]);
trainer_local.accept_input([note_target_1_subtarget_2]);
trainer_local.accept_input([note_target_2_subtarget_1]);
trainer_local.accept_input([note_target_2_subtarget_2]);
trainer_local.accept_input([note_target_3_subtarget_1]);
trainer_local.clear_window();
var freezer = new TrainFreezer('node');
freezer.freeze(trainer_local, '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train.json');
var thawer = new TrainThawer('node');
var train_thawed = thawer.thaw('/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train.json');
train_thawed.render_window();
// verify that it looks correct in window
//# sourceMappingURL=train.js.map