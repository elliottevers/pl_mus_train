import {message as m, message} from "../message/messenger";
import Messenger = message.Messenger;
import {live, live as li} from "../live/live";
import {clip, clip as c} from "../clip/clip";
import LiveApiJs = live.LiveApiJs;
import {log} from "../log/logger";
import Logger = log.Logger;
import {io} from "../io/io";
import Exporter = io.Exporter;
import Importer = io.Importer;
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

let dir_projects = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_projects/';

let file_json_comm = dir_projects + 'json_live.json';

// let exporter = new Exporter(
//     '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/music/src/cache/json/live/from_live.json'
// );

// let set_length = () => {
//     let clip_highlighted = new li.LiveApiJs(
//         'live_set view highlighted_clip_slot clip'
//     );
//
//     exporter.set_length(
//         clip_highlighted.get("length")
//     );
//
// };

// let set_tempo = () => {
//     let song = new li.LiveApiJs(
//         'live_set'
//     );
//
//     exporter.set_tempo(
//         song.get('tempo')
//     );
// };

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

// let remove = (name_part) => {
//     exporter.unset_notes(
//         name_part
//     );
// };
//
//
// let export_clips = () => {
//     exporter.export_clips(
//         ['melody', 'chord', 'bass']
//     )
// };

let import_clip = (name_part) => {

    let logger = new Logger(env);

    // let dict = new Dict();

    // let file_test = '/Users/elliottevers/Downloads/from_live.json';

    // dict.import_json(file_json_comm);

    // logger.log(JSON.stringify(dict.get()));

    // logger.log(file_json_comm)

    // let logger = new Logger(env);
    //
    // let importer = new Importer(file_json_comm, name_part);
    //
    // let notes = importer.get_notes(name_part);

    let clipslot_highlighted = new li.LiveApiJs(
        'live_set view highlighted_clip_slot'
    );

    clipslot_highlighted.call('create_clip', '297');

    let dict = new Dict();

    dict.import_json(file_json_comm);

    let notes = c.Clip.parse_note_messages(
        dict.get([name_part, 'notes'].join('::'))
    );

    let clip_highlighted = new li.LiveApiJs(
        'live_set view highlighted_clip_slot clip'
    );

    let clip = new Clip(
        new ClipDao(
            clip_highlighted,
            new Messenger(env, 0)
        )
    );

    clip.set_notes(notes);

    // logger.log(JSON.stringify(clipslot_highlighted.get_children()));
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
    Global.clip_importer = {};
    Global.clip_importer.import_clip = import_clip;
    // Global.export_clips.add = add;
    // Global.export_clips.remove = remove;
    // Global.export_clips.export_clips = export_clips;
    // Global.export_clips.set_length = set_length;
    // Global.export_clips.set_tempo = set_tempo;
}
