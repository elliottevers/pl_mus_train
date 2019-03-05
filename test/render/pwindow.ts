import "mocha";
const assert = require("chai").assert;
const sinon = require("sinon");
const sinonTest = require('sinon-test');
const test = sinonTest(sinon);
import {clip as c} from "../../src/clip/clip";
import {message as m} from "../../src/message/messenger";
import {window as w} from "../../src/render/window";
import {note as n} from "../../src/note/note";
import TreeModel = require("tree-model");

describe('Pwindow', test(()=>{

    it('incrementally renders notes of tree (does not need to render an entire clip at once)', test(()=>{
        let env: string = 'node';

        let pwindow = new w.Pwindow(
            60,
            8,
            new m.Messenger(env, 0)
        );

        let tree: TreeModel = new TreeModel();
        // 50,0,4,127,0
        let note_root = tree.parse(
            {
                id: -1, // TODO: hashing scheme for clip id and beat start
                note: new n.Note(
                    50,
                    0,
                    4,
                    127,
                    0
                ),
                children: [

                ]
            }
        );

        let note_2_1 = tree.parse(
            {
                id: -1, // TODO: hashing scheme for clip id and beat start
                note: new n.Note(
                    50,
                    0,
                    2,
                    127,
                    0
                ),
                children: [

                ]
            }
        );

        let note_2_2 = tree.parse(
            {
                id: -1, // TODO: hashing scheme for clip id and beat start
                note: new n.Note(
                    54,
                    2,
                    2,
                    127,
                    0
                ),
                children: [

                ]
            }
        );

        let note_3_1 = tree.parse(
            {
                id: -1, // TODO: hashing scheme for clip id and beat start
                note: new n.Note(
                    50,
                    0,
                    1,
                    127,
                    0
                ),
                children: [

                ]
            }
        );

        let note_3_2 = tree.parse(
            {
                id: -1, // TODO: hashing scheme for clip id and beat start
                note: new n.Note(
                    52,
                    1,
                    1,
                    127,
                    0
                ),
                children: [

                ]
            }
        );

        let note_3_3 = tree.parse(
            {
                id: -1, // TODO: hashing scheme for clip id and beat start
                note: new n.Note(
                    54,
                    2,
                    1,
                    127,
                    0
                ),
                children: [

                ]
            }
        );

        let note_3_4 = tree.parse(
            {
                id: -1, // TODO: hashing scheme for clip id and beat start
                note: new n.Note(
                    55,
                    3,
                    1,
                    127,
                    0
                ),
                children: [

                ]
            }
        );


        pwindow.set_root(
            note_root
        );

        pwindow.elaborate(
            [note_2_1],
            0,
            2,
            1
        );

        pwindow.elaborate(
            [note_2_2],
            2,
            4,
            1
        );

        pwindow.elaborate(
            [note_3_1],
            0,
            1,
            2
        );

        pwindow.elaborate(
            [note_3_2],
            1,
            2,
            2
        );

        pwindow.elaborate(
            [note_3_3],
            2,
            3,
            2
        );

        // pwindow.elaborate(
        //     [note_3_4],
        //     3,
        //     4,
        //     2
        // );


        let messages = pwindow.get_messages_render_clips();

        // for (let m of messages) {
        //     console.log(m.join(' '));
        // }
        //
        // return;

        // TODO: tack on colors to end of message, make color configurable
        // TODO: make order of messages not matter
        assert.deepEqual(
            messages[0],
            [ 'paintrect', 0, 0, 8, 20, 0, 0, 0 ],
        );

        assert.deepEqual(
            messages[1],
            [ 'paintrect', 0, 36, 4, 40, 0, 0, 0 ],
        );

        assert.deepEqual(
            messages[2],
            [ 'paintrect', 4, 20, 8, 24, 0, 0, 0 ],
        );

        assert.deepEqual(
            messages[3],
            [ 'paintrect', 0, 56.66666666666667, 2, 60, 0, 0, 0 ],
        );

        assert.deepEqual(
            messages[4],
            [ 'paintrect', 2, 50, 4, 53.333333333333336, 0, 0, 0 ]
        );

        assert.deepEqual(
            messages[5],
            [ 'paintrect', 4, 43.333333333333336, 6, 46.666666666666664, 0, 0, 0 ],
        );

        // assert.deepEqual(
        //     messages[6],
        //     [ 'paintrect', 6, 40, 8, 43.333333333333336, 0, 0, 0 ],
        // );
    }));
}));