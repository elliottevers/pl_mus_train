import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {live} from "../live/live";
import {clip, clip as c} from "../clip/clip";
import {io} from "../io/io";
import Clip = clip.Clip;
import ClipDao = clip.ClipDao;
import LiveApiFactory = live.LiveApiFactory;
import TypeIdentifier = live.TypeIdentifier;
import Env = live.Env;

declare let autowatch: any;
declare function post(message?: any): void;
declare let Dict: any;
declare let Global: any;

let env: Env = Env.MAX;

if (env === Env.MAX) {
    post('recompile successful');
    autowatch = 1;
}

let length_beats: number = null;

let set_length_beats = (beats) => {
    length_beats = beats
};

let get_length_beats = () => {
    if (length_beats === null) {
        throw 'length is null, cannot determine size of clip'
    }
    return length_beats
};

let import_part = (name_part) => {

    // TODO: this works when we want to create a clip from scratch - figure out how to work into workflow

    let clipslot_highlighted = LiveApiFactory.create(
        Env.MAX,
        'live_set view highlighted_clip_slot',
        TypeIdentifier.PATH
    );

    let clip_highlighted = LiveApiFactory.create(
        Env.MAX,
        'live_set view highlighted_clip_slot clip',
        TypeIdentifier.PATH
    );

    let clip: Clip;

    let clip_exists = Number(clip_highlighted.get_id()) !== 0;

    if (!clip_exists) {
        // TODO: get the beat of end of last note
        clipslot_highlighted.call('create_clip', Number(get_length_beats()));

        clip_highlighted = LiveApiFactory.create(
            Env.MAX,
            'live_set view highlighted_clip_slot clip',
            TypeIdentifier.PATH
        );
    }

    clip = new Clip(
        new ClipDao(
            clip_highlighted,
            new Messenger(Env.MAX, 0)
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

    let messenger = new Messenger(Env.MAX, 0);

    messenger.message(['part_imported'])
};

let test = () => {

};

if (typeof Global !== "undefined") {
    Global.clip_importer = {};
    Global.clip_importer.import_part = import_part;
    Global.clip_importer.set_length_beats = set_length_beats;
}
