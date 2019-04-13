import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {live as li} from "../live/live";
import {utils} from "../utils/utils";
import {track} from "../track/track";
import TrackDao = track.TrackDao;
import Track = track.Track;

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

let messenger = new Messenger(env, 0);


let extract_beatmap_manual = () => {

    let this_device = new li.LiveApiJs('this_device');

    let track = new Track(
        new TrackDao(
            new li.LiveApiJs(
                utils.get_path_track_from_path_device(this_device.get_path())
            ),
            messenger
        )
    );

    track.load_clip_slots();

    let clip_slot = track.get_clip_slot_at_index(0);

    clip_slot.load_clip();

    let clip_audio_warped = clip_slot.get_clip();

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

    messenger.message(['run', 'bang']);
};

let test = () => {

};


if (typeof Global !== "undefined") {
    Global.extract_beatmap = {};
    Global.extract_beatmap.extract_beatmap_manual = extract_beatmap_manual;
}
