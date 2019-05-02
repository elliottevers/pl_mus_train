import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {live as li} from "../live/live";
import {utils} from "../utils/utils";
import {track} from "../track/track";
import TrackDao = track.TrackDao;
import Track = track.Track;
import {song} from "../song/song";
import Song = song.Song;
import SongDao = song.SongDao;
import {clip} from "../clip/clip";
import Clip = clip.Clip;
import ClipDao = clip.ClipDao;
import {log} from "../log/logger";
import Logger = log.Logger;

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

let extract_beatmap_raw = () => {

    let song = new Song(
        new SongDao(
            new li.LiveApiJs(
                'live_set'
            ),
            new Messenger(env, 0),
            false
        )
    );

    let clip_highlighted = new Clip(
        new ClipDao(
            new li.LiveApiJs(
                'live_set view highlighted_clip_slot clip'
            ),
            messenger
        )
    );

    // NB: these are in seconds because the clip is presumed to not be in "warp" mode

    messenger.message(['s_beat_start', clip_highlighted.get_start_marker()]);

    messenger.message(['s_beat_end', clip_highlighted.get_loop_bracket_upper()]);

    messenger.message(['tempo', song.get_tempo()]);

    messenger.message(['manual', 0, 'bang']);

    messenger.message(['run', 'bang']);
};

let extract_beatmap_warped = () => {

    let this_device = new li.LiveApiJs('this_device');

    let track = new Track(
        new TrackDao(
            new li.LiveApiJs(
                utils.get_path_track_from_path_device(this_device.get_path())
            ),
            messenger
        )
    );

    let song = new Song(
        new SongDao(
            new li.LiveApiJs(
                'live_set'
            ),
            new Messenger(env, 0),
            false
        )
    );

    track.load_clip_slots();

    let clip_slot = track.get_clip_slot_at_index(0);

    clip_slot.load_clip();

    let clip_audio_warped = clip_slot.get_clip();

    let beat_start_marker = clip_audio_warped.get_start_marker();

    let beat_end_marker = clip_audio_warped.get_end_marker();

    let length_beats = (clip_audio_warped.get_end_marker() - clip_audio_warped.get_start_marker());

    messenger.message(['beat_start', beat_start_marker]);

    messenger.message(['beat_end', beat_end_marker]);

    messenger.message(['length_beats', length_beats]);

    messenger.message(['tempo', song.get_tempo()]);

    messenger.message(['manual', 1, 'bang']);

    messenger.message(['run', 'bang']);
};

let test = () => {

};


if (typeof Global !== "undefined") {
    Global.extract_beatmap = {};
    Global.extract_beatmap.extract_beatmap_warped = extract_beatmap_warped;
    Global.extract_beatmap.extract_beatmap_raw = extract_beatmap_raw;
}
