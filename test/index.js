"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
var assert = require("assert");
var note_1 = require("../src/note/note");
var TreeModel = require("tree-model");
describe("note", function () {
    it("should store pitch information", function () {
        var note = new note_1.note.Note(60, 0, 4, 100, 0);
        assert.equal(note.pitch, 60);
    });
});
describe('tree', function () {
    it('works', function () {
        var tree = new TreeModel();
        var root = tree.parse({
            id: 1,
            children: [
                {
                    id: 11,
                    children: [{ id: 111 }]
                },
                {
                    id: 12,
                    children: [{ id: 121, attribute_test: 'hello world' }, { id: 122 }]
                },
                {
                    id: 13
                }
            ]
        });
        var path_length = root.first(function (node) { return node.model.attribute_test === 'hello world'; });
        assert.equal(path_length, 2);
    });
});
//# sourceMappingURL=index.js.map