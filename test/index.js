"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
var assert = require("assert");
var note_1 = require("../src/note/note");
describe("note", function () {
    it("should store pitch information", function () {
        var note = new note_1.note.Note(60, 0, 4, 100, 0);
        assert.equal(note.pitch, 60);
    });
});
//# sourceMappingURL=index.js.map