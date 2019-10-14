import {live} from "../live/live";
import {message} from "../message/messenger";
import {track} from "../track/track";
import LiveApiFactory = live.LiveApiFactory;
import Env = live.Env;
import TypeIdentifier = live.TypeIdentifier;
import Track = track.Track;
import TrackDao = track.TrackDao;
import Messenger = message.Messenger;
import {segment} from "../segment/segment";
import Segment = segment.Segment;
import {song} from "../song/song";
import Song = song.Song;
import SongDao = song.SongDao;
import {utils} from "../utils/utils";

export {}
const max_api = require('max-api');

// @ts-ignore
global.liveApi = {
    responsesProcessed: 0,
    responsesExpected: 0,
    responses: [],
    dynamicResponse: false,
    locked: false
};

let messenger = new Messenger(Env.NODE_FOR_MAX, 0);

max_api.addHandler('liveApiMaxSynchronousResult', (...res) => {
    // @ts-ignore
    global.liveApi.responses = global.liveApi.responses.concat(res.slice(1));

    // @ts-ignore
    global.liveApi.responsesProcessed += 1;

    // @ts-ignore
    if (global.liveApi.dynamicResponse) {
        // @ts-ignore
        global.liveApi.responsesExpected = Number(res[2]) + 2;
        // @ts-ignore
        global.liveApi.dynamicResponse = false;
    }

    // @ts-ignore
    if (global.liveApi.responsesProcessed == global.liveApi.responsesExpected) {
        // @ts-ignore
        global.liveApi.locked = false;
    }
});

let length_beats: number = 8;

let get_length_beats = () => {
    if (length_beats === null) {
        throw 'length beats has not been set'
    }
    return length_beats;
};

let get_notes_segments = () => {

    let this_device = LiveApiFactory.create(
        Env.NODE_FOR_MAX,
        'this_device',
        TypeIdentifier.PATH
    );

    // TODO: convert to node?
    let track_segments = new Track(
        new TrackDao(
            LiveApiFactory.create(
                Env.NODE_FOR_MAX,
                utils.get_path_track_from_path_device(this_device.get_path()),
                TypeIdentifier.PATH
            ),
            messenger
        )
    );

    track_segments.load_clips();

    return track_segments.get_notes();
};

max_api.addHandler('expand_track', (path_track: string, name_part?: string) => {

    path_track = 'live_set tracks 2';

    // TODO: convert to node?
    let track = new Track(
        new TrackDao(
            LiveApiFactory.create(
                Env.NODE_FOR_MAX,
                path_track,
                TypeIdentifier.PATH
            ),
            new Messenger(
                Env.NODE_FOR_MAX,
                0
            )
        )
    );

    track.load_clips();

    let clip_slot = track.get_clip_slot_at_index(0);

    clip_slot.load_clip();

    let clip = clip_slot.get_clip();

    let notes_segments = get_notes_segments();

    if (name_part !== 'segment') {
        clip.cut_notes_at_boundaries(notes_segments);
    }

    let notes_clip = clip.get_notes(
        clip.get_loop_bracket_lower(),
        0,
        clip.get_loop_bracket_upper(),
        128
    );

    let segments: Segment[] = [];

    for (let note of notes_segments) {
        segments.push(
            new Segment(
                note
            )
        )
    }

    let song_read = new Song(
        new SongDao(
            LiveApiFactory.create(
                Env.NODE_FOR_MAX,
                'live_set',
                TypeIdentifier.PATH
            ),
            new Messenger(Env.NODE_FOR_MAX, 0)
        )
    );

    song_read.load_scenes();

    for (let i_segment in segments) {

        let segment = segments[Number(i_segment)];

        let scene = song_read.get_scene_at_index(Number(i_segment));

        let scene_exists = scene !== null;

        if (!scene_exists) {
            song_read.create_scene_at_index(Number(i_segment))
        }

        let clip_slot = Track.get_clip_slot_at_index(
            track.get_index(),
            Number(i_segment),
            new Messenger(Env.NODE_FOR_MAX, 0),
            Env.NODE_FOR_MAX
        );

        clip_slot.load_clip();

        if (Number(i_segment) === 0) {
            clip_slot.delete_clip()
        }

        clip_slot.create_clip(get_length_beats());

        clip_slot.load_clip();

        let clip = clip_slot.get_clip();

        clip.set_endpoints_loop(
            segment.get_endpoints_loop()[0],
            segment.get_endpoints_loop()[1]
        );

        clip.set_endpoint_markers(
            segment.get_endpoints_loop()[0],
            segment.get_endpoints_loop()[1]
        );

        let notes_within_segment = notes_clip.filter(
            node => node.model.note.beat_start >= segment.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment.get_endpoints_loop()[1]
        );

        clip.set_notes(notes_within_segment);
    }

    messenger.message(['done', 'bang'])
});
