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
//# sourceMappingURL=index.js.map