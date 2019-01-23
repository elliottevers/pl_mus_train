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
        //     attribute_test: 'hello world',
        //     children: [
        //         {
        //             id: 11,
        //             children: [{id: 111}]
        //         },
        //         {
        //             id: 12,
        //             children: [{id: 121}, {id: 122}]
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

import {window as w} from "../src/render/window";
import {log} from "../src/log/logger";


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
        // let note = note_iterator.next().value;

        // TODO: assert result starts on beat 3

        // throw 'testing'

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

describe('Pwindow', test(()=>{
    it("calculates rendering messages for multiple clips correctly", test(()=>{

        let env: string = 'node';

        let stub1LiveAPI = {
            get: () => {return 0},
            set: () => {},
            call: () => {}
        };

        // sinon.stub(stub1LiveAPI, "get").callsFake(() => {
        //
        // });
        // sinon.stub(stub1LiveAPI, "set").callsFake(() => {
        //
        // });
        // sinon.stub(stub1LiveAPI, "call").callsFake(() => {
        //
        // });

        let stub2LiveAPI = {
            get: () => {return 0},
            set: () => {},
            call: () => {}
        };

        // sinon.stub(stub2LiveAPI, "get").callsFake(() => {
        //
        // });
        // sinon.stub(stub2LiveAPI, "set").callsFake(() => {
        //
        // });
        // sinon.stub(stub2LiveAPI, "call").callsFake(() => {
        //
        // });

        let stub3LiveAPI = {
            get: () => {return 0},
            set: () => {},
            call: () => {}
        };

        // sinon.stub(stub3LiveAPI, "get").callsFake(() => {
        //
        // });
        // sinon.stub(stub3LiveAPI, "set").callsFake(() => {
        //
        // });
        // sinon.stub(stub3LiveAPI, "call").callsFake(() => {
        //
        // });

        let stub4LiveAPI = {
            get: () => {return 0},
            set: () => {},
            call: () => {}
        };

        // sinon.stub(stub4LiveAPI, "get").callsFake(() => {
        //
        // });
        // sinon.stub(stub4LiveAPI, "set").callsFake(() => {
        //
        // });
        // sinon.stub(stub4LiveAPI, "call").callsFake(() => {
        //
        // });

        // clip 1
        let clip_dao_1 = new c.ClipDao(
            stub1LiveAPI,
            new m.Messenger(env, 0),
            false
        );
        sinon.stub(clip_dao_1, "get_start_marker").callsFake(() => {
            return 0;
        });
        sinon.stub(clip_dao_1, "get_end_marker").callsFake(() => {
            return 4;
        });
        sinon.stub(clip_dao_1, "get_notes").callsFake(() => {
            return ["notes",1,"note",50,0,4,127,0,"done"]
        });


        // clip 2
        let clip_dao_2 = new c.ClipDao(
            stub2LiveAPI,
            new m.Messenger(env, 0),
            false
        );
        sinon.stub(clip_dao_2, "get_start_marker").callsFake(() => {
            return 0;
        });
        sinon.stub(clip_dao_2, "get_end_marker").callsFake(() => {
            return 4;
        });
        sinon.stub(clip_dao_2, "get_notes").callsFake(() => {
            return ["notes",2,"note",50,0,2,127,0,"note",54,2,2,127,0,"done"]
        });


        // clip 3
        let clip_dao_3 = new c.ClipDao(
            stub3LiveAPI,
            new m.Messenger(env, 0),
            false
        );

        sinon.stub(clip_dao_3, "get_start_marker").callsFake(() => {
            return 0;
        });
        sinon.stub(clip_dao_3, "get_end_marker").callsFake(() => {
            return 4;
        });
        sinon.stub(clip_dao_3, "get_notes").callsFake(() => {
            return ["notes",3,"note",50,0,1,127,0,"note",52,1,1,127,0,"note",54,2,2,127,0,"done"]
        });


        // clip 4
        let clip_dao_4 = new c.ClipDao(
            stub4LiveAPI,
            new m.Messenger(env, 0),
            false
        );

        sinon.stub(clip_dao_4, "get_start_marker").callsFake(() => {
            return 0;
        });
        sinon.stub(clip_dao_4, "get_end_marker").callsFake(() => {
            return 4;
        });
        sinon.stub(clip_dao_4, "get_notes").callsFake(() => {
            return ["notes",4,"note",50,0,1,127,0,"note",52,1,1,127,0,"note",54,2,1,127,0,"note",55,3,1,127,0,"done"]
        });

        let clip_1 = new c.Clip(clip_dao_1);
        let clip_2 = new c.Clip(clip_dao_2);
        let clip_3 = new c.Clip(clip_dao_3);
        let clip_4 = new c.Clip(clip_dao_4);

        clip_1.load_notes();
        clip_2.load_notes();
        clip_3.load_notes();
        clip_4.load_notes();

        var dim = 16 * 6 * 4;

        var pwindow = new w.Pwindow(
            dim,
            dim,
            new m.Messenger(env, 0)
        );

        pwindow.add_clip(clip_4);
        pwindow.add_clip(clip_3);
        pwindow.add_clip(clip_2);
        pwindow.add_clip(clip_1);

        let messages = pwindow.get_messages_render_clips();

        assert.deepEqual(
            messages[0],
            ['paintrect', 0, 368, 96, 384]
        );

        assert.deepEqual(
            messages[1],
            ['paintrect', 96, 336, 192, 352]
        );

        assert.deepEqual(
            messages[2],
            ['paintrect', 192, 304, 288, 320]
        );

        assert.deepEqual(
            messages[3],
            ['paintrect', 288, 288, 384, 304]
        );

        assert.deepEqual(
            messages[4],
            ['paintrect', 0, 268.8, 96, 288]
        );

        assert.deepEqual(
            messages[5],
            ['paintrect', 96, 230.4, 192, 249.6]
        );

        assert.deepEqual(
            messages[6],
            ['paintrect', 192, 192, 384, 211.2]
        );

        assert.deepEqual(
            messages[7],
            ['paintrect', 0, 172.8, 192, 192]
        );

        assert.deepEqual(
            messages[8],
            ['paintrect', 192, 96, 384, 115.2]
        );

        assert.deepEqual(
            messages[9],
            ['paintrect', 0, 0, 384, 96]
        );

    }));

    it("calculates rendering messages of a single clip correctly", test(()=>{

        let stubLiveAPI = {
            get: () => {return 0},
            set: () => {},
            call: () => {}
        };

        let stub_clip_dao = new c.ClipDao(
            stubLiveAPI,
            new m.Messenger('node', 0),
            false
        );

        sinon.stub(stub_clip_dao, "get_start_marker").callsFake(() => {
            return 0;
        });
        sinon.stub(stub_clip_dao, "get_end_marker").callsFake(() => {
            return 4;
        });
        sinon.stub(stub_clip_dao, "get_notes").callsFake(() => {
            return ["notes",4,"note",50,0,1,127,0,"note",52,1,1,127,0,"note",54,2,1,127,0,"note",55,3,1,127,0,"done"]
        });

        var clip = new c.Clip(stub_clip_dao);

        clip.load_notes();

        var dim = 16 * 6 * 4;

        var pwindow = new w.Pwindow(
            dim,
            dim,
            new m.Messenger('node', 0)
        );

        pwindow.add_clip(clip);

        let messages = pwindow.get_messages_render_clips();

        assert.deepEqual(
            messages[0],
            ['paintrect', 0, 320, 96, 384]
        );

        assert.deepEqual(
            messages[1],
            ['paintrect', 96, 192, 192, 256]
        );

        assert.deepEqual(
            messages[2],
            ['paintrect', 192, 64, 288, 128]
        );

        assert.deepEqual(
            messages[3],
            ['paintrect', 288, 0, 384, 64]
        );
    }));

}));