import "mocha";
// import * as assert from "assert";
import {note as n} from "../src/note/note"
import TreeModel = require("tree-model");
const assert = require('chai').assert;

describe("note", ()=>{
    // it("should store pitch information", ()=>{
    //     let note = new n.Note(60, 0, 4, 100, 0);
    //     assert.equal(note.pitch, 60);
    // });
});

describe('tree', function () {
    it('works', ()=>{
        // let tree = new TreeModel();
        //
        // let root = tree.parse({
        //     id: 1,
        //     children: [
        //         {
        //             id: 11,
        //             children: [{id: 111}]
        //         },
        //         {
        //             id: 12,
        //             children: [{id: 121, attribute_test: 'hello world'}, {id: 122}]
        //         },
        //         {
        //             id: 13
        //         }
        //     ]
        // });
        //
        // let path_length = root.first(function (node) {     return node.model.attribute_test === 'hello world'; });
        // assert.equal(path_length, 2);
    })
});

describe('Phrase', ()=>{

    it('is capable of iteration', ()=>{
        // var index_track = 9;
        // var index_clip_slot = 0;
        // var path_clip = 'live_set tracks 9 clip_slots 0 clip';

        // TODO: make 1 phrase consisting of quarter notes
        // TODO: iterate twice and ensure that the result starts on beat 3
        // TODO: make clip DAO stub

        var deferlow = false;

        var int_outlet = 0;

        var messenger = m.Messenger('max', int_outlet);

        var clip_dao = new cd.ClipDao(index_track, index_clip_slot, messenger, deferlow);

        var clip = new c.Clip(clip_dao);

        var data_phrase = [0, 8];

        var phrase = new Phrase(
            data_phrase[0],
            data_phrase[1],
            clip
        );

        var direction_forward = true;

        // TODO: have to mock notes
        phrase.load_notes(direction_forward);

        var note_iterator = phrase.note_iterator;

        var note = note_iterator.next().value;

        // l.log(note);
    })
    // function test() {
    //     // TODO: mock this track
    //     var index_track = 9;
    //     var index_clip_slot = 0;
    //     // var path_clip = 'live_set tracks 9 clip_slots 0 clip';
    //
    //     var deferlow = false;
    //
    //     var int_outlet = 0;
    //
    //     var messenger = m.Messenger('max', int_outlet);
    //
    //     var clip_dao = new cd.ClipDao(index_track, index_clip_slot, messenger, deferlow);
    //
    //     var clip = new c.Clip(clip_dao);
    //
    //     var data_phrase = [0, 8];
    //
    //     var phrase = new Phrase(
    //         data_phrase[0],
    //         data_phrase[1],
    //         clip
    //     );
    //
    //     var direction_forward = true;
    //
    //     // TODO: have to mock notes
    //     phrase.load_notes(direction_forward);
    //
    //     var note_iterator = phrase.note_iterator;
    //
    //     var note = note_iterator.next().value;
    //
    //     l.log(note);
    // }
});

describe('PredictionPreprocessor', ()=> {
    it('obeys limit', ()=>{

    });

    it('resets properly', ()=>{

    });
    // function test() {
    //
    //     function assert(statement) {
    //         if (!eval(statement)) {
    //             throw statement
    //         }
    //     }
    //
    //     var prediction_preprocessor = new PredictionPreprocessor('monophonic_guitar');
    //
    //     assert('prediction_preprocessor.get_state_primed() === false');
    //
    //     prediction_preprocessor.accept(60);
    //
    //     assert('prediction_preprocessor.get_state_primed() === true');
    //     assert('JSON.stringify(prediction_preprocessor.get_prediction()) === JSON.stringify([60])');
    //
    //     prediction_preprocessor.accept(62);
    //     prediction_preprocessor.accept(64);
    //
    //     assert('prediction_preprocessor.get_state_primed() === true');
    //     assert('JSON.stringify(prediction_preprocessor.get_prediction()) === JSON.stringify([60])');
    //
    //     prediction_preprocessor.reset();
    //
    //     assert('JSON.stringify(prediction_preprocessor.get_prediction()) === JSON.stringify([])');
    // }
});

describe('Target', ()=>{
   it('iterates over both phrases and notes', ()=>{
       // TODO: make 2 phrase, each a measure long, consisting of quarter notes
       // TODO: iterate until the first note of the second phrase
   }) ;
});