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

let import_part = (name_part) => {

    let logger = new Logger(env);

    // TODO: this works when we want to create a clip from scratch - figure out how to work into workflow

    // let clipslot_highlighted = new li.LiveApiJs(
    //     'live_set view highlighted_clip_slot'
    // );

    // clipslot_highlighted.call('create_clip', '297');

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
    Global.clip_importer.import_part = import_part;
}
