import {message as m, message} from "./message/messenger";
import Messenger = message.Messenger;
import {live, live as li} from "./live/live";
import {clip as c} from "./clip/clip";
import LiveApiJs = live.LiveApiJs;
import {log} from "./log/logger";
import Logger = log.Logger;

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

let set_midi = (filepath) => {
    let dict_import = new Dict("dict_import");

    dict_import.import_json(filepath);

    let notes = dict_import.get('melody::notes');

    let live_api: LiveApiJs = new li.LiveApiJs(
        'live_set view highlighted_clip_slot clip'
    );

    let clip = new c.Clip(
        new c.ClipDao(
            live_api,
            new m.Messenger(env, 0),
            false
        )
    );

    let notes_parsed = c.Clip.parse_note_messages(
        notes
    );

    clip.set_notes(
        notes_parsed
    );
};


let export_midi = (filepath) => {
    let dict_export = new Dict("dict_export");

    let live_api: LiveApiJs;

    live_api = new li.LiveApiJs(
        'live_set view highlighted_clip_slot clip'
    );

    let clip = new c.Clip(
        new c.ClipDao(
            live_api,
            new m.Messenger(env, 0),
            false
        )
    );

    let notes = clip.get_notes(0, 0, 8, 128);

    // let name_part = 'melody';

    let reps = [];

    dict_export.replace("melody::notes", "");

    reps.push(
        ['notes', notes.length.toString()].join(' ')
    );

    for (let i_note in notes) {
        reps.push(notes[i_note].model.note.encode());
    }

    reps.push(
        ['notes', 'done'].join(' ')
    );

    dict_export.set("melody::notes", ...reps);

    dict_export.export_json(filepath);

    let messenger = new Messenger(env, 0);

    messenger.message([filepath])
};


if (typeof Global !== "undefined") {
    Global.midi_io = {};
    Global.midi_io.export_midi = export_midi;
    Global.midi_io.set_midi = set_midi;
}
