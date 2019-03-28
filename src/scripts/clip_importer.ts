import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {live as li} from "../live/live";
import {clip, clip as c} from "../clip/clip";
import {log} from "../log/logger";
import Logger = log.Logger;
import {io} from "../io/io";
import Clip = clip.Clip;
import ClipDao = clip.ClipDao;

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

let length_beats: number;

let set_length_beats = (beats) => {
    length_beats = beats
};

let import_part = (name_part) => {

    let logger = new Logger(env);

    // TODO: this works when we want to create a clip from scratch - figure out how to work into workflow

    let clipslot_highlighted = new li.LiveApiJs(
        'live_set view highlighted_clip_slot'
    );


    let clip_highlighted = new li.LiveApiJs(
        'live_set view highlighted_clip_slot clip'
    );

    let clip: Clip;

    let clip_exists = Number(clip_highlighted.get_id()) !== 0;

    if (!clip_exists) {
        // TODO: get the beat of end of last note
        clipslot_highlighted.call('create_clip', String(length_beats));

        clip_highlighted = new li.LiveApiJs(
            'live_set view highlighted_clip_slot clip'
        );
    }

    clip = new Clip(
        new ClipDao(
            clip_highlighted,
            new Messenger(env, 0)
        )
    );

    let dict = new Dict();

    dict.import_json(io.file_json_comm);

    let notes = c.Clip.parse_note_messages(
        dict.get([name_part, 'notes'].join('::'))
    );

    clip.remove_notes(
        clip.get_start_marker(),
        0,
        clip.get_end_marker(),
        128
    );

    clip.set_notes(notes);

    let messenger = new Messenger(env, 0);

    messenger.message(['part_imported'])
};

let test = () => {

};


if (typeof Global !== "undefined") {
    Global.clip_importer = {};
    Global.clip_importer.import_part = import_part;
    Global.clip_importer.set_length_beats = set_length_beats;
}
