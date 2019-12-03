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
const _ = require('underscore');

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

max_api.addHandler('liveApiResult', (...res) => {
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

let length_beats: number = null;

max_api.addHandler('set_length_beats', (arg_length_beats: number) => {
    length_beats = arg_length_beats;
});

let get_length_beats = () => {
    if (length_beats === null) {
        throw 'length beats has not been set'
    }
    return length_beats;
};

max_api.addHandler('expand_segments', () => {
    let this_device = LiveApiFactory.create(
        Env.NODE_FOR_MAX,
        'this_device',
        TypeIdentifier.PATH
    );

    let track = new Track(
        new TrackDao(
            LiveApiFactory.create(
                Env.NODE_FOR_MAX,
                utils.get_path_track_from_path_device(this_device.get_path()),
                TypeIdentifier.PATH
            )
        )
    );

    expand_track(track.get_path(), 'segment')
});

max_api.addHandler('contract_segments', () => {

    let this_device = LiveApiFactory.create(
        Env.NODE_FOR_MAX,
        'this_device',
        TypeIdentifier.PATH
    );

    let track = new Track(
        new TrackDao(
            LiveApiFactory.create(
                Env.NODE_FOR_MAX,
                utils.get_path_track_from_path_device(this_device.get_path()),
                TypeIdentifier.PATH
            )
        )
    );

    contract_track(track.get_path())
});

max_api.addHandler('expand_selected_track', () => {
    expand_track('live_set view selected_track')
});

max_api.addHandler('contract_selected_track', () => {
    contract_track('live_set view selected_track')
});

let contract_track = (path_track) => {

    let track = new Track(
        new TrackDao(
            LiveApiFactory.create(
                Env.NODE_FOR_MAX,
                path_track,
                TypeIdentifier.PATH
            )
        )
    );

    // clip_slots and clips
    track.load_clips();

    let notes = track.get_notes();

    track.delete_clips();

    track.create_clip_at_index(0, get_length_beats());

    let clip_slot = track.get_clip_slot_at_index(0);

    clip_slot.load_clip();

    let clip = clip_slot.get_clip();

    clip.setMode(true, false);

    clip.set_endpoint_markers(0, get_length_beats());

    clip.set_endpoints_loop(0, get_length_beats());

    notes.forEach(node => {
        node.model.note.muted = 0
    });

    clip.set_notes(notes);

    messenger.message(['done', 'bang'])
};

// TODO: we can't export this, because it could be called from a different track than the one the segments are on...
// NB: assumes the device that calls this is on the track of segments
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
            )
        )
    );

    track_segments.load_clips();

    return track_segments.get_notes();
};

max_api.addHandler('expand_selected_audio_track', () => {
    expand_track_audio('live_set view selected_track')
});

max_api.addHandler('contract_selected_audio_track', () => {
    contract_track_audio('live_set view selected_track')
});

// NB: we assume all training data starts on the first beat
let contract_track_audio = (path_track) => {

    let track = new Track(
        new TrackDao(
            LiveApiFactory.create(
                Env.NODE_FOR_MAX,
                path_track,
                TypeIdentifier.PATH
            )
        )
    );

    track.load_clip_slots();

    let clip_slots = track.get_clip_slots();

    for (let i_clip_slot_audio in clip_slots) {

        let clip_slot_audio = clip_slots[Number(i_clip_slot_audio)];

        if (Number(i_clip_slot_audio) === 0) {

            let clip = Track.get_clip_at_index(
                track.get_index(),
                Number(i_clip_slot_audio),
                Env.NODE_FOR_MAX
            );

            clip.setMode(true, false);

            clip.set_endpoint_markers(0, get_length_beats());

            clip.set_endpoints_loop(0, get_length_beats());

            continue
        }

        if (clip_slot_audio.b_has_clip()) {
            clip_slot_audio.delete_clip()
        }
    }

    messenger.message(['done', 'bang'])
};

let expand_track_audio = (path_track) => {

    // TODO: convert to node?
    let track = new Track(
        new TrackDao(
            LiveApiFactory.create(
                Env.NODE_FOR_MAX,
                path_track,
                TypeIdentifier.PATH
            )
        )
    );

    track.load_clip_slots();

    let clip_slot_audio = track.get_clip_slot_at_index(0);

    let notes_segments = get_notes_segments();

    let song = new Song(
        new SongDao(
            LiveApiFactory.create(
                Env.NODE_FOR_MAX,
                'live_set',
                TypeIdentifier.PATH
            )
        )
    );

    song.load_scenes();

    let clip_first = Track.get_clip_at_index(
        track.get_index(),
        0,
        Env.NODE_FOR_MAX
    );

    let segment_first = new Segment(notes_segments[0]);

    clip_first.setMode(true, false);

    clip_first.set_endpoints_loop(
        segment_first.beat_start,
        segment_first.beat_end
    );

    clip_first.set_endpoint_markers(
        segment_first.beat_start,
        segment_first.beat_end
    );

    for (let i_clipslot of _.range(1, notes_segments.length)) {
        let note_segment = notes_segments[Number(i_clipslot)];

        let scene = song.get_scene_at_index(Number(i_clipslot));

        let scene_exists = scene !== null;

        if (!scene_exists) {
            song.create_scene_at_index(Number(i_clipslot))
        }

        let clip_slot = Track.get_clip_slot_at_index(
            track.get_index(),
            Number(i_clipslot),
            messenger,
            Env.NODE_FOR_MAX
        );

        clip_slot.load_clip();

        if (clip_slot.b_has_clip()) {
            clip_slot.delete_clip()
        }

        clip_slot_audio.duplicate_clip_to(clip_slot);

        clip_slot.load_clip();

        let clip = Track.get_clip_at_index(
            track.get_index(),
            Number(i_clipslot),
            Env.NODE_FOR_MAX
        );

        let segment = new Segment(note_segment);

        clip.setMode(true, false);

        clip.set_endpoints_loop(
            segment.beat_start,
            segment.beat_end
        );

        clip.set_endpoint_markers(
            segment.beat_start,
            segment.beat_end
        );
    }

    messenger.message(['done', 'bang'])
};

let expand_track = (path_track: string, name_part?: string) => {

    // TODO: convert to node?
    let track = new Track(
        new TrackDao(
            LiveApiFactory.create(
                Env.NODE_FOR_MAX,
                path_track,
                TypeIdentifier.PATH
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
            )
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
            messenger,
            Env.NODE_FOR_MAX
        );

        clip_slot.load_clip();

        if (Number(i_segment) === 0) {
            clip_slot.delete_clip()
        }

        clip_slot.create_clip(get_length_beats());

        clip_slot.load_clip();

        let clip = clip_slot.get_clip();

        clip.setMode(true, false);

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

        if (name_part == 'segment') {
            notes_within_segment.forEach(node => {
                node.model.note.muted = 1
            })
        }

        // TODO: non-native scope object is here
        clip.set_notes(notes_within_segment);
    }

    messenger.message(['done', 'bang'])
};