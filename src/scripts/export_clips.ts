import {message as m, message} from "../message/messenger";
import Messenger = message.Messenger;
import {live, live as li} from "../live/live";
import {clip as c} from "../clip/clip";
import LiveApiJs = live.LiveApiJs;
import {log} from "../log/logger";
import Logger = log.Logger;
import {io} from "../io/io";
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

let exporter = new Exporter(
    '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/music/src/cache/json/live/from_live.json'
);

let set_length = () => {
    let clip_highlighted = new li.LiveApiJs(
        'live_set view highlighted_clip_slot clip'
    );

    exporter.set_length(
        clip_highlighted.get("length")
    );

};

let set_tempo = () => {
    let song = new li.LiveApiJs(
        'live_set'
    );

    exporter.set_tempo(
        song.get('tempo')
    );
};

let add = (name_part) => {

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

    let notes = clip.get_notes(
        0,
        0,
        clip_highlighted.get("length"),
        128
    );

    exporter.set_notes(
        name_part,
        notes
    );
};

let remove = (name_part) => {
    exporter.unset_notes(
        name_part
    );
};


let export_clips = () => {
    exporter.export_clips(
        ['melody', 'chord', 'bass']
    )
};

let test = () => {

    // let song = new li.LiveApiJs(
    //     'live_set'
    // );
    //
    // let clip_highlighted = new li.LiveApiJs(
    //     'live_set view highlighted_clip_slot clip'
    // );
    //
    // let length_clip = clip_highlighted.get("length");
    //
    // let tempo = song.get("tempo");
    //
    // let logger = new Logger(env);
    //
    // logger.log(clip_highlighted.get_id())
};


if (typeof Global !== "undefined") {
    Global.export_clips = {};
    Global.export_clips.test = test;
    Global.export_clips.add = add;
    Global.export_clips.remove = remove;
    Global.export_clips.export_clips = export_clips;
    Global.export_clips.set_length = set_length;
    Global.export_clips.set_tempo = set_tempo;
}
