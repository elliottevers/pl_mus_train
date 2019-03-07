import {note as n} from "../../src/note/note";
import {set_depth_tree_export} from "../../src/scripts/parse_tree";
import TreeModel = require("tree-model");
import {user_input} from "../../src/control/user_input";
import UserInputHandler = user_input.UserInputHandler;
import {window} from "../../src/render/window";
import ListWindow = window.ListWindow;
import {trainer} from "../../src/train/trainer";
import Trainer = trainer.Trainer;
import {algorithm} from "../../src/train/algorithm";
import {struct} from "../../src/train/struct";
import StructTree = struct.StructTree;
import Detect = algorithm.Detect;


let tree: TreeModel = new TreeModel();

let notes_segments;

let note1 = tree.parse(
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

let note2 = tree.parse(
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


let mode_texture = 'harmonic';
let mode_control = 'instrumental';

let user_input_handler = new UserInputHandler(
    mode_texture,
    mode_control
);

let window = new ListWindow(

);

let algorithm = new Detect(
    user_input_handler
);

let trainer = new Trainer(
    window,
    algorithm,
    user_input_handler,
    clip_user_input,
    messenger
);

// test case - 2 segments, 2 notes a piece

notes_segments = [note1, note2];

trainer.set_segments(notes_segments);

trainer.init(

); // calls next() under the hood, emits intervals to the UserInputHandler, renders the region of interest to cue user

trainer.accept(
    note_1
);

trainer.accept(
    note_2
);

trainer.accept(
    note_3
);

trainer.clear_render(

);

let freezer = new TrainFreezer(
    'node'
);

freezer.freeze(
    trainer,
    '/path/to/file'
);

let thawer = new TrainThawer(
    'node'
);

let train_thawed = thawer.thaw(
    '/path/to/file'
);

train_thawed.render(

);

// verify that it look
