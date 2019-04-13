import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {live, live as li} from "../live/live";
import {clip} from "../clip/clip";
import LiveApiJs = live.LiveApiJs;
import ClipDao = clip.ClipDao;
import Clip = clip.Clip;
import TreeModel = require("tree-model");
import {note as n, note} from "../note/note";
import Note = note.Note;
const _ = require('underscore');

declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;
declare function post(message?: any): void;
declare let Dict: any;

export {}

declare let Global: any;

let env: string = 'max';

if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}

let notes_raw = [];
let notes_consolidated = [];
let cached: boolean = false;

let toggle = (val: number) => {

    let consolidate = Boolean(val);

    let this_device = new li.LiveApiJs('this_device');

    let path_this_device = this_device.get_path();

    let list_this_device = path_this_device.split(' ');

    let index_this_track = Number(list_this_device[2]);

    let path_clip = ['live_set', 'tracks', index_this_track, 'clip_slots', 0, 'clip'].join(' ');

    let clip = new Clip(
        new ClipDao(
            new LiveApiJs(
                path_clip
            ),
            new Messenger(env, 0)
        )
    );

    if (!cached) {
        notes_raw = clip.get_notes(
            clip.get_start_marker(),
            0,
            clip.get_end_marker(),
            128
        );

        cached = true;

        let note_group_head: TreeModel.Node<Note> = notes_raw[0];

        for (let i_note of _.range(1, notes_raw.length)) {

            let note = notes_raw[Number(i_note)];

            let note_last = notes_raw[Number(i_note) - 1];

            if (note_group_head.model.note.pitch === note.model.note.pitch) {
                continue
            }

            let tree: TreeModel = new TreeModel();

            let note_consolidated = tree.parse(
                {
                    id: -1, // TODO: hashing scheme for clip id and beat start
                    note: new n.Note(
                        note_group_head.model.note.pitch,
                        note_group_head.model.note.beat_start,
                        note_last.model.note.get_beat_end() - note_group_head.model.note.beat_start,
                        note_group_head.model.note.velocity,
                        0
                    ),
                    children: [

                    ]
                }
            );

            notes_consolidated.push(
                note_consolidated
            );

            note_group_head = note;
        }
    }

    if (consolidate) {
        clip.remove_notes(
            clip.get_start_marker(),
            0,
            clip.get_end_marker(),
            128
        );
        clip.set_notes(
            notes_consolidated
        )
    } else {
        clip.remove_notes(
            clip.get_start_marker(),
            0,
            clip.get_end_marker(),
            128
        );
        clip.set_notes(
            notes_raw
        )
    }
};

if (typeof Global !== "undefined") {
    Global.consolidate = {};
    Global.consolidate.toggle = toggle;
}
