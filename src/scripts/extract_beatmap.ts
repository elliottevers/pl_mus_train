import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {live as li} from "../live/live";
import {clip} from "../clip/clip";
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

// let messenger_beat_start = new Messenger(env, 0, 'beat_start');
//
// let messenger_beat_end = new Messenger(env, 0, 'beat_end');
//
// let messenger_length_beats = new Messenger(env, 0, 'length-beats');
//
// let messenger_run = new Messenger(env, 0, 'run');

let messenger = new Messenger(env, 0);

let extract_beatmap_manual = () => {

    let clip_audio_warped = new Clip(
        new ClipDao(
            new li.LiveApiJs(
                'live_set view highlighted_clip_slot clip'
            ),
            new Messenger(env, 0)
        )
    );

    let beat_start_marker = clip_audio_warped.get_start_marker();

    let beat_end_marker = clip_audio_warped.get_end_marker();

    let loop_bracket_lower = clip_audio_warped.get_loop_bracket_lower();

    let loop_bracket_upper = clip_audio_warped.get_loop_bracket_upper();

    let length_beats = (clip_audio_warped.get_end_marker() - clip_audio_warped.get_start_marker());

    messenger.message(['beat_start_marker', beat_start_marker]);

    messenger.message(['beat_end_marker', beat_end_marker]);

    messenger.message(['loop_bracket_lower', loop_bracket_lower]);

    messenger.message(['loop_bracket_upper', loop_bracket_upper]);

    messenger.message(['length-beats', length_beats]);

    messenger.message(['run']);
};

let test = () => {

};


if (typeof Global !== "undefined") {
    Global.extract_beatmap = {};
    Global.extract_beatmap.extract_beatmap_manual = extract_beatmap_manual;
}
