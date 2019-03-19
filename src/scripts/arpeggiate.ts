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

let notes_polyphonic = [];
let notes_arpegiatted = [];
let cached: boolean = false;

let toggle = (val: number) => {

    let arpeggiate = Boolean(val);

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
        notes_polyphonic = clip.get_notes(
            clip.get_start_marker(),
            0,
            clip.get_end_marker(),
            128
        );

        let groups_notes_arpegiatted = Harmony.arpeggiate(
            notes_polyphonic
        );

        for (let group of groups_notes_arpegiatted) {
            // let logger = new Logger(env);
            // logger.log(JSON.stringify(group));
            notes_arpegiatted = notes_arpegiatted.concat(group)
        }

        cached = true;
    }

    if (arpeggiate) {
        clip.remove_notes(
            clip.get_start_marker(),
            0,
            clip.get_end_marker(),
            128
        );
        clip.set_notes(
            notes_arpegiatted
        )
    } else {
        clip.remove_notes(
            clip.get_start_marker(),
            0,
            clip.get_end_marker(),
            128
        );
        clip.set_notes(
            notes_polyphonic
        )
    }
};

if (typeof Global !== "undefined") {
    Global.arpeggiate = {};
    Global.arpeggiate.toggle = toggle;
}
