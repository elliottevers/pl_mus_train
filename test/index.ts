import "mocha";
import * as assert from "assert";
import {note as n} from "../src/note/note"

describe("note", ()=>{
    it("should store pitch information", ()=>{
        let note = new n.Note(60, 0, 4, 100, 0);
        assert.equal(note.pitch, 60);
    });
});