import "mocha";
import TreeModel = require("tree-model");
const assert = require("chai").assert;
const sinon = require("sinon");
const sinonTest = require('sinon-test');
const test = sinonTest(sinon);

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

import {note as n} from "../src/note/note"

import {phrase as p} from "../src/phrase/phrase"

import {message as m} from "../src/message/messenger"

import {clip as c} from "../src/clip/clip"


describe('Phrase', ()=>{

    it('is capable of iteration', test(()=>{
        // TODO: make 1 phrase consisting of quarter notes
        // TODO: iterate twice and ensure that the result starts on beat 3
        // TODO: make clip DAO stub

        let messenger = new m.Messenger('node', 0);

        let clip_dao = new c.ClipDao(0, 0, messenger, false);

        sinon.stub(clip_dao, "get_start_marker").callsFake(() => {
            return 0;
        });

        sinon.stub(clip_dao, "get_end_marker").callsFake(() => {
            return 4;
        });

        sinon.stub(clip_dao, "get_notes").callsFake(() => {
            return ["notes",2,"note",50,0,1,127,0,"note",52,1,1,127,0,"note",54,2,2,127,0,"done"]
        });

        let clip = new c.Clip(clip_dao);

        clip.load_notes();

        let phrase = new p.Phrase(
            clip.get_start_marker(),
            clip.get_end_marker(),
            clip
        );

        let note_iterator = phrase.note_iterator;

        // TODO: see why undefined
        let note = note_iterator.next().value;

        // TODO: assert result starts on beat 3

    }));
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

describe('Pwindow', ()=>{
    it("sends correct rendering methods for its notes", ()=>{

    });

    // var clip_dao_stub_1 = Object.assign({}, cds.ClipDaoStub);
    // var clip_dao_stub_2 = Object.assign({}, cds.ClipDaoStub);
    // var clip_dao_stub_3 = Object.assign({}, cds.ClipDaoStub);
    // var clip_dao_stub_4 = Object.assign({}, cds.ClipDaoStub);
    //
    // clip_dao_stub_1.get_end_marker = function() {
    //     return JSON.parse('[4]')
    // };
    // clip_dao_stub_2.get_end_marker = function() {
    //     return JSON.parse('[4]')
    // };
    // clip_dao_stub_3.get_end_marker = function() {
    //     return JSON.parse('[4]')
    // };
    // clip_dao_stub_4.get_end_marker = function() {
    //     return JSON.parse('[4]')
    // };
    //
    //
    // clip_dao_stub_1.get_notes = function() {
    //     return JSON.parse('["notes",4,"note",50,0,1,127,0,"note",52,1,1,127,0,"note",54,2,1,127,0,"note",55,3,1,127,0,"done"]')
    // };
    // clip_dao_stub_2.get_notes = function() {
    //     return JSON.parse('["notes",3,"note",50,0,1,127,0,"note",52,1,1,127,0,"note",54,2,2,127,0,"done"]')
    // };
    // clip_dao_stub_3.get_notes = function() {
    //     return JSON.parse('["notes",2,"note",50,0,2,127,0,"note",54,2,2,127,0,"done"]')
    // };
    // clip_dao_stub_4.get_notes = function() {
    //     return JSON.parse('["notes",1,"note",50,0,4,127,0,"done"]')
    // };
    //
    // var clip_1 = new c.Clip(clip_dao_stub_1);
    // var clip_2 = new c.Clip(clip_dao_stub_2);
    // var clip_3 = new c.Clip(clip_dao_stub_3);
    // var clip_4 = new c.Clip(clip_dao_stub_4);
    //
    // clip_1.load_notes();
    // clip_2.load_notes();
    // clip_3.load_notes();
    // clip_4.load_notes();
    //
    // var dim = 16 * 6 * 4;
    // var pwindow = new pw.Pwindow(dim, dim);
    //
    // pwindow.add_clip(clip_4);
    // pwindow.add_clip(clip_3);
    // pwindow.add_clip(clip_2);
    // pwindow.add_clip(clip_1);
    //
    // // TODO:
    // // assert pwindow.get_messages_render_clips() === gt
    // // assert pwindow.get_messages_render_tree() === gt
    //
    // logger.log(pwindow.parse_tree.length)
    // // logger.log(pwindow.get_messages_render_tree());
    // // logger.log(pwindow.get_messages_render_clips().length);
    // // logger.log(pwindow.get_messages_render_notes(0).length);
    //
    // // console.log(clip_dao_stub_1.get_end_marker());
    // // console.log(clip_dao_stub_2.get_notes());
});