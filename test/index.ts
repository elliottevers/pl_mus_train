import "mocha";
import * as assert from "assert";
import {note as n} from "../src/note/note"
import TreeModel = require("tree-model");

describe("note", ()=>{
    it("should store pitch information", ()=>{
        let note = new n.Note(60, 0, 4, 100, 0);
        assert.equal(note.pitch, 60);
    });
});

describe('tree', function () {
    it('works', ()=>{
        let tree = new TreeModel();

        let root = tree.parse({
            id: 1,
            children: [
                {
                    id: 11,
                    children: [{id: 111}]
                },
                {
                    id: 12,
                    children: [{id: 121, attribute_test: 'hello world'}, {id: 122}]
                },
                {
                    id: 13
                }
            ]
        });

        let path_length = root.first(function (node) {     return node.model.attribute_test === 'hello world'; });
        assert.equal(path_length, 2);
    })
});