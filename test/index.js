"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
var assert = require("chai").assert;
var sinon = require("sinon");
var sinonTest = require('sinon-test');
var test = sinonTest(sinon);
var phrase_1 = require("../src/phrase/phrase");
var messenger_1 = require("../src/message/messenger");
var clip_1 = require("../src/clip/clip");
describe('Phrase', function () {
    it('is capable of iteration', test(function () {
        // TODO: make 1 phrase consisting of quarter notes
        // TODO: iterate twice and ensure that the result starts on beat 3
        // TODO: make clip DAO stub
        var messenger = new messenger_1.message.Messenger('node', 0);
        var stub_live_api = {
            get: function (property) { return 0; },
            set: function (property, value) { },
            call: function (func) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return 0;
            }
        };
        var clip_dao = new clip_1.clip.ClipDao(stub_live_api, messenger, false);
        sinon.stub(clip_dao, "get_start_marker").callsFake(function () {
            return 0;
        });
        sinon.stub(clip_dao, "get_end_marker").callsFake(function () {
            return 4;
        });
        sinon.stub(clip_dao, "get_notes_within_markers").callsFake(function () {
            return ["notes", 2, "note", 50, 0, 1, 127, 0, "note", 52, 1, 1, 127, 0, "note", 54, 2, 2, 127, 0, "done"];
        });
        var clip = new clip_1.clip.Clip(clip_dao);
        clip.load_notes_within_markers();
        var phrase = new phrase_1.phrase.Phrase(clip.get_start_marker(), clip.get_end_marker(), clip);
        var note_iterator = phrase.note_iterator;
        // TODO: see why undefined
        // let note = note_iterator.next().value;
        // TODO: assert result starts on beat 3
    }));
});
describe('PredictionPreprocessor', function () {
    it('obeys limit', function () {
    });
    it('resets properly', function () {
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
describe('Target', function () {
    it('iterates over both phrases and notes', function () {
        // TODO: make 2 phrase, each a measure long, consisting of quarter notes
        // TODO: iterate until the first note of the second phrase
    });
});
// describe('Pwindow', test(()=>{
//
//     it('calculate rendering messages for tree correctly', test(()=>{
//         let env: string = 'node';
//
//         let stub1LiveAPI = {
//             get: () => {return 0},
//             set: () => {},
//             call: () => {}
//         };
//
//         let stub2LiveAPI = {
//             get: () => {return 0},
//             set: () => {},
//             call: () => {}
//         };
//
//         let stub3LiveAPI = {
//             get: () => {return 0},
//             set: () => {},
//             call: () => {}
//         };
//
//         let stub4LiveAPI = {
//             get: () => {return 0},
//             set: () => {},
//             call: () => {}
//         };
//
//         // clip 1
//         let clip_dao_1 = new c.ClipDao(
//             stub1LiveAPI,
//             new m.Messenger(env, 0),
//             false
//         );
//         sinon.stub(clip_dao_1, "get_start_marker").callsFake(() => {
//             return 0;
//         });
//         sinon.stub(clip_dao_1, "get_end_marker").callsFake(() => {
//             return 4;
//         });
//         sinon.stub(clip_dao_1, "get_notes_within_markers").callsFake(() => {
//             return ["notes",1,"note",50,0,4,127,0,"done"]
//         });
//
//
//         // clip 2
//         let clip_dao_2 = new c.ClipDao(
//             stub2LiveAPI,
//             new m.Messenger(env, 0),
//             false
//         );
//         sinon.stub(clip_dao_2, "get_start_marker").callsFake(() => {
//             return 0;
//         });
//         sinon.stub(clip_dao_2, "get_end_marker").callsFake(() => {
//             return 4;
//         });
//         sinon.stub(clip_dao_2, "get_notes_within_markers").callsFake(() => {
//             return ["notes",2,"note",50,0,2,127,0,"note",54,2,2,127,0,"done"]
//         });
//
//
//         // clip 3
//         let clip_dao_3 = new c.ClipDao(
//             stub3LiveAPI,
//             new m.Messenger(env, 0),
//             false
//         );
//
//         sinon.stub(clip_dao_3, "get_start_marker").callsFake(() => {
//             return 0;
//         });
//         sinon.stub(clip_dao_3, "get_end_marker").callsFake(() => {
//             return 4;
//         });
//         sinon.stub(clip_dao_3, "get_notes_within_markers").callsFake(() => {
//             return ["notes",3,"note",50,0,1,127,0,"note",52,1,1,127,0,"note",54,2,2,127,0,"done"]
//         });
//
//
//         // clip 4
//         let clip_dao_4 = new c.ClipDao(
//             stub4LiveAPI,
//             new m.Messenger(env, 0),
//             false
//         );
//
//         sinon.stub(clip_dao_4, "get_start_marker").callsFake(() => {
//             return 0;
//         });
//         sinon.stub(clip_dao_4, "get_end_marker").callsFake(() => {
//             return 4;
//         });
//         sinon.stub(clip_dao_4, "get_notes_within_markers").callsFake(() => {
//             return ["notes",4,"note",50,0,1,127,0,"note",52,1,1,127,0,"note",54,2,1,127,0,"note",55,3,1,127,0,"done"]
//         });
//
//         let clip_1 = new c.Clip(clip_dao_1);
//         let clip_2 = new c.Clip(clip_dao_2);
//         let clip_3 = new c.Clip(clip_dao_3);
//         let clip_4 = new c.Clip(clip_dao_4);
//
//         clip_1.load_notes_within_markers();
//         clip_2.load_notes_within_markers();
//         clip_3.load_notes_within_markers();
//         clip_4.load_notes_within_markers();
//
//         var dim = 16 * 6 * 4;
//
//         var pwindow = new w.Pwindow(
//             dim,
//             dim,
//             new m.Messenger(env, 0)
//         );
//
//         pwindow.set_clip(clip_1);
//
//         pwindow.elaborate(
//             clip_2.get_notes_within_markers(),
//             clip_2.get_notes_within_markers()[0].model.note.beat_start,
//             clip_2.get_notes_within_markers()[1].model.note.get_beat_end()
//         );
//
//         pwindow.elaborate(
//             clip_3.get_notes_within_markers().slice(0, 2),
//             clip_3.get_notes_within_markers().slice(0, 2)[0].model.note.beat_start,
//             clip_3.get_notes_within_markers().slice(0, 2)[1].model.note.get_beat_end()
//         );
//
//         pwindow.elaborate(
//             clip_4.get_notes_within_markers().slice(2, 4),
//             clip_4.get_notes_within_markers().slice(2, 4)[0].model.note.beat_start,
//             clip_4.get_notes_within_markers().slice(2, 4)[1].model.note.get_beat_end()
//         );
//
//         let messages = pwindow.get_messages_render_tree();
//
//         // TODO: tack on colors to end of message, make color configurable
//         // TODO: make order of messages not matter
//         assert.deepEqual(
//             messages[4],
//             ['linesegment', 240, 312, 288, 105.6, 255, 0, 0],
//         );
//
//         assert.deepEqual(
//             messages[5],
//             ['linesegment', 336, 296, 288, 105.6, 255, 0, 0],
//         );
//
//         assert.deepEqual(
//             messages[0],
//             ['linesegment', 96, 182.4, 192, 48, 255, 0, 0],
//         );
//
//         assert.deepEqual(
//             messages[1],
//             ['linesegment', 288, 105.6, 192, 48, 255, 0, 0],
//         );
//
//         assert.deepEqual(
//             messages[2],
//             ['linesegment', 48, 278.4, 96, 182.4, 255, 0, 0]
//         );
//
//         assert.deepEqual(
//             messages[3],
//             ['linesegment', 144, 240, 96, 182.4, 255, 0, 0],
//         );
//     }));
//
//     it("calculates rendering messages for multiple clips correctly", test(()=>{
//
//         let env: string = 'node';
//
//         let stub1LiveAPI = {
//             get: () => {return 0},
//             set: () => {},
//             call: () => {}
//         };
//
//         // sinon.stub(stub1LiveAPI, "get").callsFake(() => {
//         //
//         // });
//         // sinon.stub(stub1LiveAPI, "set").callsFake(() => {
//         //
//         // });
//         // sinon.stub(stub1LiveAPI, "call").callsFake(() => {
//         //
//         // });
//
//         let stub2LiveAPI = {
//             get: () => {return 0},
//             set: () => {},
//             call: () => {}
//         };
//
//         // sinon.stub(stub2LiveAPI, "get").callsFake(() => {
//         //
//         // });
//         // sinon.stub(stub2LiveAPI, "set").callsFake(() => {
//         //
//         // });
//         // sinon.stub(stub2LiveAPI, "call").callsFake(() => {
//         //
//         // });
//
//         let stub3LiveAPI = {
//             get: () => {return 0},
//             set: () => {},
//             call: () => {}
//         };
//
//         // sinon.stub(stub3LiveAPI, "get").callsFake(() => {
//         //
//         // });
//         // sinon.stub(stub3LiveAPI, "set").callsFake(() => {
//         //
//         // });
//         // sinon.stub(stub3LiveAPI, "call").callsFake(() => {
//         //
//         // });
//
//         let stub4LiveAPI = {
//             get: () => {return 0},
//             set: () => {},
//             call: () => {}
//         };
//
//         // sinon.stub(stub4LiveAPI, "get").callsFake(() => {
//         //
//         // });
//         // sinon.stub(stub4LiveAPI, "set").callsFake(() => {
//         //
//         // });
//         // sinon.stub(stub4LiveAPI, "call").callsFake(() => {
//         //
//         // });
//
//         // clip 1
//         let clip_dao_1 = new c.ClipDao(
//             stub1LiveAPI,
//             new m.Messenger(env, 0),
//             false
//         );
//         sinon.stub(clip_dao_1, "get_start_marker").callsFake(() => {
//             return 0;
//         });
//         sinon.stub(clip_dao_1, "get_end_marker").callsFake(() => {
//             return 4;
//         });
//         sinon.stub(clip_dao_1, "get_notes_within_markers").callsFake(() => {
//             return ["notes",1,"note",50,0,4,127,0,"done"]
//         });
//
//
//         // clip 2
//         let clip_dao_2 = new c.ClipDao(
//             stub2LiveAPI,
//             new m.Messenger(env, 0),
//             false
//         );
//         sinon.stub(clip_dao_2, "get_start_marker").callsFake(() => {
//             return 0;
//         });
//         sinon.stub(clip_dao_2, "get_end_marker").callsFake(() => {
//             return 4;
//         });
//         sinon.stub(clip_dao_2, "get_notes_within_markers").callsFake(() => {
//             return ["notes",2,"note",50,0,2,127,0,"note",54,2,2,127,0,"done"]
//         });
//
//
//         // clip 3
//         let clip_dao_3 = new c.ClipDao(
//             stub3LiveAPI,
//             new m.Messenger(env, 0),
//             false
//         );
//
//         sinon.stub(clip_dao_3, "get_start_marker").callsFake(() => {
//             return 0;
//         });
//         sinon.stub(clip_dao_3, "get_end_marker").callsFake(() => {
//             return 4;
//         });
//         sinon.stub(clip_dao_3, "get_notes_within_markers").callsFake(() => {
//             return ["notes",3,"note",50,0,1,127,0,"note",52,1,1,127,0,"note",54,2,2,127,0,"done"]
//         });
//
//
//         // clip 4
//         let clip_dao_4 = new c.ClipDao(
//             stub4LiveAPI,
//             new m.Messenger(env, 0),
//             false
//         );
//
//         sinon.stub(clip_dao_4, "get_start_marker").callsFake(() => {
//             return 0;
//         });
//         sinon.stub(clip_dao_4, "get_end_marker").callsFake(() => {
//             return 4;
//         });
//         sinon.stub(clip_dao_4, "get_notes_within_markers").callsFake(() => {
//             return ["notes",4,"note",50,0,1,127,0,"note",52,1,1,127,0,"note",54,2,1,127,0,"note",55,3,1,127,0,"done"]
//         });
//
//         let clip_1 = new c.Clip(clip_dao_1);
//         let clip_2 = new c.Clip(clip_dao_2);
//         let clip_3 = new c.Clip(clip_dao_3);
//         let clip_4 = new c.Clip(clip_dao_4);
//
//         clip_1.load_notes_within_markers();
//         clip_2.load_notes_within_markers();
//         clip_3.load_notes_within_markers();
//         clip_4.load_notes_within_markers();
//
//         var dim = 16 * 6 * 4;
//
//         var pwindow = new w.Pwindow(
//             dim,
//             dim,
//             new m.Messenger(env, 0)
//         );
//
//         // pwindow.add_clip(clip_4);
//         // pwindow.add_clip(clip_3);
//         // pwindow.add_clip(clip_2);
//         // pwindow.add_clip(clip_1);
//         // pwindow.add_clip(clip_1);
//         // pwindow.add_clip(clip_2);
//         // pwindow.add_clip(clip_3);
//         // pwindow.add_clip(clip_4);
//
//         pwindow.set_clip(clip_1);
//
//         pwindow.elaborate(
//             clip_2.get_notes_within_markers(),
//             clip_2.get_notes_within_markers()[0].model.note.beat_start,
//             clip_2.get_notes_within_markers()[1].model.note.get_beat_end()
//         );
//
//         pwindow.elaborate(
//             clip_3.get_notes_within_markers().slice(0, 2),
//             clip_3.get_notes_within_markers().slice(0, 2)[0].model.note.beat_start,
//             clip_3.get_notes_within_markers().slice(0, 2)[1].model.note.get_beat_end()
//         );
//
//         pwindow.elaborate(
//             clip_4.get_notes_within_markers().slice(2, 4),
//             clip_4.get_notes_within_markers().slice(2, 4)[0].model.note.beat_start,
//             clip_4.get_notes_within_markers().slice(2, 4)[1].model.note.get_beat_end()
//         );
//
//         let messages = pwindow.get_messages_render_clips();
//
//         assert.deepEqual(
//             messages[6],
//             ['paintrect', 0, 368, 96, 384, 0, 0, 0]
//         );
//
//         assert.deepEqual(
//             messages[7],
//             ['paintrect', 96, 336, 192, 352, 0, 0, 0]
//         );
//
//         assert.deepEqual(
//             messages[8],
//             ['paintrect', 192, 304, 288, 320, 0, 0, 0]
//         );
//
//         assert.deepEqual(
//             messages[9],
//             ['paintrect', 288, 288, 384, 304, 0, 0, 0]
//         );
//
//         assert.deepEqual(
//             messages[3],
//             ['paintrect', 0, 268.8, 96, 288, 0, 0, 0]
//         );
//
//         assert.deepEqual(
//             messages[4],
//             ['paintrect', 96, 230.4, 192, 249.6, 0, 0, 0]
//         );
//
//         assert.deepEqual(
//             messages[5],
//             ['paintrect', 192, 192, 384, 211.2, 0, 0, 0]
//         );
//
//         //
//         assert.deepEqual(
//             messages[1],
//             ['paintrect', 0, 172.8, 192, 192, 0, 0, 0]
//         );
//
//         assert.deepEqual(
//             messages[2],
//             ['paintrect', 192, 96, 384, 115.2, 0, 0, 0]
//         );
//
//         //
//         assert.deepEqual(
//             messages[0],
//             ['paintrect', 0, 0, 384, 96, 0, 0, 0]
//         );
//
//     }));
//
//     it("calculates rendering messages of a single clip correctly", test(()=>{
//
//         let stubLiveAPI = {
//             get: () => {return 0},
//             set: () => {},
//             call: () => {}
//         };
//
//         let stub_clip_dao = new c.ClipDao(
//             stubLiveAPI,
//             new m.Messenger('node', 0),
//             false
//         );
//
//         sinon.stub(stub_clip_dao, "get_start_marker").callsFake(() => {
//             return 0;
//         });
//         sinon.stub(stub_clip_dao, "get_end_marker").callsFake(() => {
//             return 4;
//         });
//         sinon.stub(stub_clip_dao, "get_notes_within_markers").callsFake(() => {
//             return ["notes",4,"note",50,0,1,127,0,"note",52,1,1,127,0,"note",54,2,1,127,0,"note",55,3,1,127,0,"done"]
//         });
//
//         var clip = new c.Clip(stub_clip_dao);
//
//         clip.load_notes_within_markers();
//
//         var dim = 16 * 6 * 4;
//
//         var pwindow = new w.Pwindow(
//             dim,
//             dim,
//             new m.Messenger('node', 0)
//         );
//
//         pwindow.add_clip(clip);
//
//         let messages = pwindow.get_messages_render_clips();
//
//         assert.deepEqual(
//             messages[0],
//             ['paintrect', 0, 320, 96, 384, 0, 0, 0]
//         );
//
//         assert.deepEqual(
//             messages[1],
//             ['paintrect', 96, 192, 192, 256, 0, 0, 0]
//         );
//
//         assert.deepEqual(
//             messages[2],
//             ['paintrect', 192, 64, 288, 128, 0, 0, 0]
//         );
//
//         assert.deepEqual(
//             messages[3],
//             ['paintrect', 288, 0, 384, 64, 0, 0, 0]
//         );
//     }));
//
// }));
//# sourceMappingURL=index.js.map