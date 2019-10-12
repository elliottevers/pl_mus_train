import {message} from "../message/messenger";
import {live} from "../live/live";
import {clip} from "../clip/clip";
import Messenger = message.Messenger;
import ClipDao = clip.ClipDao;
import Clip = clip.Clip;
import LiveApiFactory = live.LiveApiFactory;
import Env = live.Env;
import TypeIdentifier = live.TypeIdentifier;

declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;
declare function post(message?: any): void;
declare let Dict: any;

export {}

declare let Global: any;

let env: Env = Env.MAX;

if (env === Env.MAX) {
    post('recompile successful');
    autowatch = 1;
}

let notes_original = [];
let notes_filtered = [];
// let cached: boolean = false;

let get_clip = () => {
    let this_device = LiveApiFactory.create(
        Env.MAX,
        'this_device',
        TypeIdentifier.PATH
    );

    let path_this_device = this_device.get_path();

    let list_this_device = path_this_device.split(' ');

    let index_this_track = Number(list_this_device[2]);

    let path_clip = ['live_set', 'tracks', index_this_track, 'clip_slots', '0', 'clip'].join(' ');

    return new Clip(
        new ClipDao(
            LiveApiFactory.create(
                Env.MAX,
                path_clip,
                TypeIdentifier.PATH
            ),
            new Messenger(Env.MAX, 0)
        )
    );
};

let undo = () => {

    let clip = get_clip();

    if (notes_original.length === 0) {
        notes_original = clip.get_notes(
            clip.get_start_marker(),
            0,
            clip.get_end_marker(),
            128
        )
    }

    clip.remove_notes(
        clip.get_start_marker(),
        0,
        clip.get_end_marker(),
        128
    );

    clip.set_notes(
        notes_original
    )

};

let filter = (length_beat: number) => {

    let clip = get_clip();

    if (notes_original.length === 0) {
        notes_original = clip.get_notes(
            clip.get_start_marker(),
            0,
            clip.get_end_marker(),
            128
        )
    }

    clip.remove_notes(
        clip.get_start_marker(),
        0,
        clip.get_end_marker(),
        128
    );


    clip.set_notes(
        notes_original.filter((node) => {
            return node.model.note.beats_duration >= length_beat
        })
    )
};

if (typeof Global !== "undefined") {
    Global.filter = {};
    Global.filter.filter = filter;
    Global.filter.undo = undo;
}
