import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {live} from "../live/live";
import {clip} from "../clip/clip";
import {harmony} from "../music/harmony";
import Harmony = harmony.Harmony;
import ClipDao = clip.ClipDao;
import Clip = clip.Clip;
import Env = live.Env;
import LiveApiFactory = live.LiveApiFactory;
import TypeIdentifier = live.TypeIdentifier;

declare let autowatch: any;
declare function post(message?: any): void;
declare let Global: any;

let env: Env = Env.MAX;

if (env === Env.MAX) {
    post('recompile successful');
    autowatch = 1;
}

let arpeggiate = () => {

    let path_clip = 'live_set view highlighted_clip_slot clip';

    // TODO: convert to node?
    let clip = new Clip(
        new ClipDao(
            LiveApiFactory.create(
                Env.MAX,
                path_clip,
                TypeIdentifier.PATH
            )
        )
    );

    let notes_polyphonic = clip.get_notes(
        clip.get_start_marker(),
        0,
        clip.get_end_marker(),
        128
    );

    let groups_notes_arpegiatted = Harmony.arpeggiate(
        notes_polyphonic
    );

    let notes_arpegiatted = [];

    for (let group of groups_notes_arpegiatted) {
        notes_arpegiatted = notes_arpegiatted.concat(group)
    }

    clip.remove_notes(
        clip.get_start_marker(),
        0,
        clip.get_end_marker(),
        128
    );
    clip.set_notes(
        notes_arpegiatted
    )
};

if (typeof Global !== "undefined") {
    Global.arpeggiate = {};
    Global.arpeggiate.arpeggiate = arpeggiate;
}
