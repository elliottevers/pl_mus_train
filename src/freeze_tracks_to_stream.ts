import {message as m, message} from "./message/messenger";
import Messenger = message.Messenger;
import {live, live as li} from "./live/live";
import {clip as c} from "./clip/clip";
import LiveApiJs = live.LiveApiJs;
import {log} from "./log/logger";
import Logger = log.Logger;
import {io} from "./io/io";
import Exporter = io.Exporter;

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

let partmap_radio = {
    0: 'melody',
    1: 'chord',
    2: 'bass',
    3: 'segment',
    4: 'key_center'
};

let exporter = new Exporter(
    '/Users/elliottevers/Downloads/from_live.json'
);

// TODO: assumes all clips are same length
let add = (index_part) => {

    let song = new li.LiveApiJs(
        'live_set'
    );

    let clip_highlighted = new li.LiveApiJs(
        'live_set view highlighted_clip_slot clip'
    );

    let clip = new c.Clip(
        new c.ClipDao(
            clip_highlighted,
            new m.Messenger(env, 0),
            false
        )
    );

    let beat_clip_end = clip_highlighted.get("length");

    let notes = clip.get_notes(0, 0, beat_clip_end, 128);

    exporter.set_notes(
        clip_highlighted.get_id(),
        notes,
        partmap_radio[index_part]
    );

    exporter.set_tempo(
        song.get('tempo')
    );

    exporter.set_length(
        beat_clip_end
    );
};

let remove = (index_part) => {
    let clip_highlighted = new li.LiveApiJs(
        'live_set view highlighted_clip_slot clip'
    );

    exporter.unset_notes(
        clip_highlighted.get_id(),
        // partmap_radio[index_part]
    );
};


let export_clips = () => {
    exporter.export_clips(
        ['melody', 'chord', 'bass'],
        // ['chord']
    )
};


let set_midi = (filepath) => {
    // let dict_import = new Dict("dict_import");

    // dict_import.import_json(filepath);

    // let notes = dict_import.get('melody::notes');

    // let live_api: LiveApiJs = new li.LiveApiJs(
    //     'live_set view highlighted_clip_slot clip'
    // );
    //
    // let clip = new c.Clip(
    //     new c.ClipDao(
    //         live_api,
    //         new m.Messenger(env, 0),
    //         false
    //     )
    // );

    // let notes_parsed = c.Clip.parse_note_messages(
    //     notes
    // );
    //
    // clip.set_notes(
    //     notes_parsed
    // );
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

    // let notes = clip.get_notes(0, 0, 8, 128);

    // let name_part = 'melody';

    // let reps = [];
    //
    // dict_export.replace("melody::notes", "");
    //
    // reps.push(
    //     ['notes', notes.length.toString()].join(' ')
    // );
    //
    // for (let i_note in notes) {
    //     reps.push(notes[i_note].model.note.encode());
    // }
    //
    // reps.push(
    //     ['notes', 'done'].join(' ')
    // );
    //
    // // dict_export.set("melody::notes", ...reps);

    dict_export.export_json(filepath);

    let messenger = new Messenger(env, 0);

    messenger.message([filepath])
};

let test = () => {

    let song = new li.LiveApiJs(
        'live_set'
    );

    let clip_highlighted = new li.LiveApiJs(
        'live_set view highlighted_clip_slot clip'
    );

    let length_clip = clip_highlighted.get("length");

    let tempo = song.get("tempo");

    let logger = new Logger(env);

    logger.log(clip_highlighted.get_id())
};


if (typeof Global !== "undefined") {
    Global.freeze_tracks_to_stream = {};
    // Global.midi_io.export_midi = export_midi;
    // Global.midi_io.set_midi = set_midi;
    Global.freeze_tracks_to_stream.test = test;
    Global.freeze_tracks_to_stream.add = add;
    Global.freeze_tracks_to_stream.remove = remove;
    Global.freeze_tracks_to_stream.export_clips = export_clips;
}
