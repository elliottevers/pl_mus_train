import {message as m, message} from "../message/messenger";
import Messenger = message.Messenger;
import {live, live as li} from "../live/live";
import {clip as c} from "../clip/clip";
import LiveApiJs = live.LiveApiJs;
import {log} from "../log/logger";
import Logger = log.Logger;
import {io} from "../io/io";
import Exporter = io.Exporter;
import {utils} from "../utils/utils";

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

let dir_projects = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_projects/';

let file_json_comm = dir_projects + 'json_live.json';

let exporter = new Exporter(
    file_json_comm
);

let part_names = new utils.Set([]);

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

// let add = (name_part) => {
//
//     let song = new li.LiveApiJs(
//         'live_set'
//     );
//
//     let clip_highlighted = new li.LiveApiJs(
//         'live_set view highlighted_clip_slot clip'
//     );
//
//     let clip = new c.Clip(
//         new c.ClipDao(
//             clip_highlighted,
//             new m.Messenger(env, 0),
//             false
//         )
//     );
//
//     let notes = clip.get_notes(
//         0,
//         0,
//         clip_highlighted.get("length"),
//         128
//     );
//
//     exporter.set_notes(
//         name_part,
//         notes
//     );
// };

let export_part = (name_part) => {

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
        clip.get_loop_bracket_lower(),
        0,
        clip.get_loop_bracket_upper() - clip.get_loop_bracket_lower(),
        128
    );

    // let logger = new Logger(env);
    //
    // logger.log(JSON.stringify(notes));

    exporter.set_notes(
        name_part,
        notes
    );

    part_names.addItem(name_part)
};

let remove = (name_part) => {
    exporter.unset_notes(
        name_part
    );

    part_names.removeItem(name_part)
};


let export_clips = () => {

    let clips_to_export = [];

    for (let name_part of part_names.data()) {
        clips_to_export.push(name_part)
    }

    exporter.export_clips(
        clips_to_export
    );

    let messenger = new Messenger(env, 0);
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
    Global.clip_exporter = {};
    Global.clip_exporter.test = test;
    Global.clip_exporter.export_part = export_part;
    Global.clip_exporter.export_clips = export_clips;
    Global.clip_exporter.remove = remove;
    Global.clip_exporter.set_length = set_length;
    Global.clip_exporter.set_tempo = set_tempo;
}
