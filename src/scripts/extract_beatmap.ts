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

let messenger_beat_start = new Messenger(env, 0, 'beat_start');

let messenger_beat_end = new Messenger(env, 0, 'beat_end');

let messenger_run = new Messenger(env, 0, 'run');

let extract_beatmap_manual = () => {

    // // get highlighted clip
    //
    // let beat_start = clip_audio_warped.get_loop_bracket_lower();
    //
    // let beat_end = clip_audio_warped.get_loop_bracket_upper();
    //
    // // let messenger_beat_start = new Messenger(env, 0, 'beat_start');
    //
    // messenger_beat_start.message(beat_start);
    //
    // messenger_beat_end.message(beat_end);
    //
    // messenger_run.message(['bang']);
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
    // Global.export_clips.add = add;
    // Global.export_clips.remove = remove;
    // Global.export_clips.export_clips = export_clips;
    // Global.export_clips.set_length = set_length;
    // Global.export_clips.set_tempo = set_tempo;
}
