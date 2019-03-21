import {message as m, message} from "../message/messenger";
import Messenger = message.Messenger;
import {live, live as li} from "../live/live";
import {clip, clip as c} from "../clip/clip";
import LiveApiJs = live.LiveApiJs;
import {log} from "../log/logger";
import Logger = log.Logger;
import {io} from "../io/io";
import Exporter = io.Exporter;
import {utils} from "../utils/utils";
import {harmony} from "../music/harmony";
import Harmony = harmony.Harmony;
import ClipDao = clip.ClipDao;
import Clip = clip.Clip;

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

let notes_original = [];
let notes_filtered = [];
// let cached: boolean = false;

let get_clip = () => {
    let this_device = new li.LiveApiJs('this_device');

    let path_this_device = this_device.get_path();

    let list_this_device = path_this_device.split(' ');

    let index_this_track = Number(list_this_device[2]);

    let path_clip = ['live_set', 'tracks', index_this_track, 'clip_slots', '0', 'clip'].join(' ');

    return new Clip(
        new ClipDao(
            new LiveApiJs(
                path_clip
            ),
            new Messenger(env, 0)
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
