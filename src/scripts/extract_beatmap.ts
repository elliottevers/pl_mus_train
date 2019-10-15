import {message} from "../message/messenger";
import {live} from "../live/live";
import {utils} from "../utils/utils";
import {track} from "../track/track";
import {song} from "../song/song";
import {clip} from "../clip/clip";
import Messenger = message.Messenger;
import TrackDao = track.TrackDao;
import Track = track.Track;
import Song = song.Song;
import SongDao = song.SongDao;
import Clip = clip.Clip;
import ClipDao = clip.ClipDao;
import LiveApiFactory = live.LiveApiFactory;
import TypeIdentifier = live.TypeIdentifier;
import Env = live.Env;

declare let autowatch: any;
declare function post(message?: any): void;
declare let Global: any;

let env: Env = Env.MAX;

if (env === Env.MAX) {
    post('recompile successful');
    autowatch = 1;
}

let messenger = new Messenger(Env.MAX, 0);

let extract_beatmap_raw = () => {

    let song = new Song(
        new SongDao(
            LiveApiFactory.create(
                Env.MAX,
                'live_set',
                TypeIdentifier.PATH
            ),
            new Messenger(Env.MAX, 0),
            false
        )
    );

    let clip_highlighted = new Clip(
        new ClipDao(
            LiveApiFactory.create(
                Env.MAX,
                'live_set view highlighted_clip_slot clip',
                TypeIdentifier.PATH
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

    let this_device = LiveApiFactory.create(
        Env.MAX,
        'this_device',
        TypeIdentifier.PATH
    );

    let track = new Track(
        new TrackDao(
            LiveApiFactory.create(
                Env.MAX,
                utils.get_path_track_from_path_device(this_device.get_path()),
                TypeIdentifier.PATH
            ),
            messenger
        )
    );

    let song = new Song(
        new SongDao(
            LiveApiFactory.create(
                Env.MAX,
                'live_set',
                TypeIdentifier.PATH
            ),
            new Messenger(Env.MAX, 0)
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

if (typeof Global !== "undefined") {
    Global.extract_beatmap = {};
    Global.extract_beatmap.extract_beatmap_warped = extract_beatmap_warped;
    Global.extract_beatmap.extract_beatmap_raw = extract_beatmap_raw;
}
