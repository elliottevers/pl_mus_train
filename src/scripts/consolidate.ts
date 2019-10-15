import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {live} from "../live/live";
import {clip} from "../clip/clip";
import ClipDao = clip.ClipDao;
import Clip = clip.Clip;
import TreeModel = require("tree-model");
import {note as n, note} from "../note/note";
import Note = note.Note;
import LiveApiFactory = live.LiveApiFactory;
import TypeIdentifier = live.TypeIdentifier;
import Env = live.Env;
const _ = require('underscore');

declare let autowatch: any;
declare function post(message?: any): void;
declare let Global: any;

let env: Env = Env.MAX;

if (env === Env.MAX) {
    post('recompile successful');
    autowatch = 1;
}

let consolidate = () => {

    let path_clip = 'live_set view highlighted_clip_slot clip';

    // TODO: convert to node?
    let clip = new Clip(
        new ClipDao(
            LiveApiFactory.create(
                Env.MAX,
                path_clip,
                TypeIdentifier.PATH
            ),
            new Messenger(Env.MAX, 0)
        )
    );

    let notes_raw = clip.get_notes(
        clip.get_start_marker(),
        0,
        clip.get_end_marker(),
        128
    );

    let notes_consolidated = [];

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

    clip.remove_notes(
        clip.get_start_marker(),
        0,
        clip.get_end_marker(),
        128
    );
    clip.set_notes(
        notes_consolidated
    )
};

if (typeof Global !== "undefined") {
    Global.consolidate = {};
    Global.consolidate.consolidate = consolidate;
}
