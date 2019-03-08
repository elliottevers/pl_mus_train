import "mocha";
import TreeModel = require("tree-model");
const assert = require("chai").assert;
const sinon = require("sinon");
const sinonTest = require('sinon-test');
const test = sinonTest(sinon);

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

        let stub_live_api = {
            get: (property: string): any => {return 0},
            set: (property: string, value: any): void => {},
            call: (func: string,  ...args: any[]): any => {return 0}
        };

        let clip_dao = new c.ClipDao(stub_live_api, messenger, false);

        sinon.stub(clip_dao, "get_start_marker").callsFake(() => {
            return 0;
        });

        sinon.stub(clip_dao, "get_end_marker").callsFake(() => {
            return 4;
        });

        sinon.stub(clip_dao, "get_notes_within_markers").callsFake(() => {
            return ["notes",2,"note",50,0,1,127,0,"note",52,1,1,127,0,"note",54,2,2,127,0,"done"]
        });

        let clip = new c.Clip(clip_dao);

        clip.load_notes_within_markers();

        let phrase = new p.Phrase(
            clip.get_start_marker(),
            clip.get_end_marker(),
            clip
        );

        let note_iterator = phrase.note_iterator;

        // TODO: see why undefined
        // let note = note_iterator.next().value;

        // TODO: assert result starts on beat 3

    }));
});