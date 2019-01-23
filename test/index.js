"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
var assert = require("chai").assert;
var sinon = require("sinon");
var sinonTest = require('sinon-test');
var test = sinonTest(sinon);
describe('tree', function () {
    it('works', function () {
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
    });
});
var phrase_1 = require("../src/phrase/phrase");
var messenger_1 = require("../src/message/messenger");
var clip_5 = require("../src/clip/clip");
var window_1 = require("../src/render/window");
describe('Phrase', function () {
    it('is capable of iteration', test(function () {
        // TODO: make 1 phrase consisting of quarter notes
        // TODO: iterate twice and ensure that the result starts on beat 3
        // TODO: make clip DAO stub
        var messenger = new messenger_1.message.Messenger('node', 0);
        var clip_dao = new clip_5.clip.ClipDao(0, 0, messenger, false);
        sinon.stub(clip_dao, "get_start_marker").callsFake(function () {
            return 0;
        });
        sinon.stub(clip_dao, "get_end_marker").callsFake(function () {
            return 4;
        });
        sinon.stub(clip_dao, "get_notes").callsFake(function () {
            return ["notes", 2, "note", 50, 0, 1, 127, 0, "note", 52, 1, 1, 127, 0, "note", 54, 2, 2, 127, 0, "done"];
        });
        var clip = new clip_5.clip.Clip(clip_dao);
        clip.load_notes();
        var phrase = new phrase_1.phrase.Phrase(clip.get_start_marker(), clip.get_end_marker(), clip);
        var note_iterator = phrase.note_iterator;
        // TODO: see why undefined
        // let note = note_iterator.next().value;
        // TODO: assert result starts on beat 3
        // throw 'testing'
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
describe('Pwindow', test(function () {
    it("calculates rendering messages for multiple clips correctly", test(function () {
        var env = 'node';
        var stub1LiveAPI = {
            get: function () { return 0; },
            set: function () { },
            call: function () { }
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
        var stub2LiveAPI = {
            get: function () { return 0; },
            set: function () { },
            call: function () { }
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
        var stub3LiveAPI = {
            get: function () { return 0; },
            set: function () { },
            call: function () { }
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
        var stub4LiveAPI = {
            get: function () { return 0; },
            set: function () { },
            call: function () { }
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
        var clip_dao_1 = new clip_5.clip.ClipDao(stub1LiveAPI, new messenger_1.message.Messenger(env, 0), false);
        sinon.stub(clip_dao_1, "get_start_marker").callsFake(function () {
            return 0;
        });
        sinon.stub(clip_dao_1, "get_end_marker").callsFake(function () {
            return 4;
        });
        sinon.stub(clip_dao_1, "get_notes").callsFake(function () {
            return ["notes", 1, "note", 50, 0, 4, 127, 0, "done"];
        });
        // clip 2
        var clip_dao_2 = new clip_5.clip.ClipDao(stub2LiveAPI, new messenger_1.message.Messenger(env, 0), false);
        sinon.stub(clip_dao_2, "get_start_marker").callsFake(function () {
            return 0;
        });
        sinon.stub(clip_dao_2, "get_end_marker").callsFake(function () {
            return 4;
        });
        sinon.stub(clip_dao_2, "get_notes").callsFake(function () {
            return ["notes", 2, "note", 50, 0, 2, 127, 0, "note", 54, 2, 2, 127, 0, "done"];
        });
        // clip 3
        var clip_dao_3 = new clip_5.clip.ClipDao(stub3LiveAPI, new messenger_1.message.Messenger(env, 0), false);
        sinon.stub(clip_dao_3, "get_start_marker").callsFake(function () {
            return 0;
        });
        sinon.stub(clip_dao_3, "get_end_marker").callsFake(function () {
            return 4;
        });
        sinon.stub(clip_dao_3, "get_notes").callsFake(function () {
            return ["notes", 3, "note", 50, 0, 1, 127, 0, "note", 52, 1, 1, 127, 0, "note", 54, 2, 2, 127, 0, "done"];
        });
        // clip 4
        var clip_dao_4 = new clip_5.clip.ClipDao(stub4LiveAPI, new messenger_1.message.Messenger(env, 0), false);
        sinon.stub(clip_dao_4, "get_start_marker").callsFake(function () {
            return 0;
        });
        sinon.stub(clip_dao_4, "get_end_marker").callsFake(function () {
            return 4;
        });
        sinon.stub(clip_dao_4, "get_notes").callsFake(function () {
            return ["notes", 4, "note", 50, 0, 1, 127, 0, "note", 52, 1, 1, 127, 0, "note", 54, 2, 1, 127, 0, "note", 55, 3, 1, 127, 0, "done"];
        });
        var clip_1 = new clip_5.clip.Clip(clip_dao_1);
        var clip_2 = new clip_5.clip.Clip(clip_dao_2);
        var clip_3 = new clip_5.clip.Clip(clip_dao_3);
        var clip_4 = new clip_5.clip.Clip(clip_dao_4);
        clip_1.load_notes();
        clip_2.load_notes();
        clip_3.load_notes();
        clip_4.load_notes();
        var dim = 16 * 6 * 4;
        var pwindow = new window_1.window.Pwindow(dim, dim, new messenger_1.message.Messenger(env, 0));
        pwindow.add_clip(clip_4);
        pwindow.add_clip(clip_3);
        pwindow.add_clip(clip_2);
        pwindow.add_clip(clip_1);
        var messages = pwindow.get_messages_render_clips();
        assert.deepEqual(messages[0], ['paintrect', 0, 368, 96, 384]);
        assert.deepEqual(messages[1], ['paintrect', 96, 336, 192, 352]);
        assert.deepEqual(messages[2], ['paintrect', 192, 304, 288, 320]);
        assert.deepEqual(messages[3], ['paintrect', 288, 288, 384, 304]);
        assert.deepEqual(messages[4], ['paintrect', 0, 268.8, 96, 288]);
        assert.deepEqual(messages[5], ['paintrect', 96, 230.4, 192, 249.6]);
        assert.deepEqual(messages[6], ['paintrect', 192, 192, 384, 211.2]);
        assert.deepEqual(messages[7], ['paintrect', 0, 172.8, 192, 192]);
        assert.deepEqual(messages[8], ['paintrect', 192, 96, 384, 115.2]);
        assert.deepEqual(messages[9], ['paintrect', 0, 0, 384, 96]);
    }));
    it("calculates rendering messages of a single clip correctly", test(function () {
        var stubLiveAPI = {
            get: function () { return 0; },
            set: function () { },
            call: function () { }
        };
        var stub_clip_dao = new clip_5.clip.ClipDao(stubLiveAPI, new messenger_1.message.Messenger('node', 0), false);
        sinon.stub(stub_clip_dao, "get_start_marker").callsFake(function () {
            return 0;
        });
        sinon.stub(stub_clip_dao, "get_end_marker").callsFake(function () {
            return 4;
        });
        sinon.stub(stub_clip_dao, "get_notes").callsFake(function () {
            return ["notes", 4, "note", 50, 0, 1, 127, 0, "note", 52, 1, 1, 127, 0, "note", 54, 2, 1, 127, 0, "note", 55, 3, 1, 127, 0, "done"];
        });
        var clip = new clip_5.clip.Clip(stub_clip_dao);
        clip.load_notes();
        var dim = 16 * 6 * 4;
        var pwindow = new window_1.window.Pwindow(dim, dim, new messenger_1.message.Messenger('node', 0));
        pwindow.add_clip(clip);
        var messages = pwindow.get_messages_render_clips();
        assert.deepEqual(messages[0], ['paintrect', 0, 320, 96, 384]);
        assert.deepEqual(messages[1], ['paintrect', 96, 192, 192, 256]);
        assert.deepEqual(messages[2], ['paintrect', 192, 64, 288, 128]);
        assert.deepEqual(messages[3], ['paintrect', 288, 0, 384, 64]);
    }));
}));
//# sourceMappingURL=index.js.map