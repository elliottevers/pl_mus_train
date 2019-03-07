"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var note_4 = require("../../src/note/note");
var TreeModel = require("tree-model");
var user_input_1 = require("../../src/control/user_input");
var UserInputHandler = user_input_1.user_input.UserInputHandler;
var ListWindow = window.ListWindow;
var Trainer = trainer.Trainer;
var Detect = algorithm.Detect;
var tree = new TreeModel();
var notes_segments;
var note1 = tree.parse({
    id: -1,
    note: new note_4.note.Note(51, 7, 1, 90, 0),
    children: []
});
var note2 = tree.parse({
    id: -1,
    note: new note_4.note.Note(51, 25, 3, 90, 0),
    children: []
});
var mode_texture = 'harmonic';
var mode_control = 'instrumental';
var user_input_handler = new UserInputHandler(mode_texture, mode_control);
var window = new ListWindow();
var algorithm = new Detect(user_input_handler);
var trainer = new Trainer(window, algorithm, user_input_handler, clip_user_input, messenger);
// test case - 2 segments, 2 notes a piece
notes_segments = [note1, note2];
trainer.set_segments(notes_segments);
trainer.init(); // calls next() under the hood, emits intervals to the UserInputHandler, renders the region of interest to cue user
trainer.accept(note_1);
trainer.accept(note_2);
trainer.accept(note_3);
trainer.clear_render();
var freezer = new TrainFreezer('node');
freezer.freeze(trainer, '/path/to/file');
var thawer = new TrainThawer('node');
var train_thawed = thawer.thaw('/path/to/file');
train_thawed.render();
// verify that it look
//# sourceMappingURL=train.js.map