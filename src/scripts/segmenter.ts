import {message as m, message} from "../message/messenger";
import Messenger = message.Messenger;
import {live, live as li} from "../live/live";
import {log} from "../log/logger";
import Logger = log.Logger;
import {utils} from "../utils/utils";
import {segment} from "../segment/segment";
import Segment = segment.Segment;
import {song as module_song} from "../song/song";
import SongDao = module_song.SongDao;
import Song = module_song.Song;
import LiveApiJs = live.LiveApiJs;
import {track as module_track} from "../track/track";
import TrackDao = module_track.TrackDao;
import Track = module_track.Track;
import {scene as module_scen} from "../scene/scene";
import Scene = module_scen.Scene;
const _ = require('underscore');

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

// get the first clip and use its start and end markers to determine the length of the entire song
let get_length_beats = () => {
    // let this_device = new LiveApiJs('this_device');

    let track = new Track(
        new TrackDao(
            new LiveApiJs(
                utils.get_path_this_track()
            ),
            messenger
        )
    );

    track.load_clip_slots();

    let clip_slot = track.get_clip_slot_at_index(0);

    clip_slot.load_clip();

    let clip = clip_slot.get_clip();

    // let clip: Clip = utils.get_clip_on_this_device_at_index(0);

    return clip.get_end_marker() - clip.get_start_marker()

    // let segments_first_clip = new Clip(
    //     new ClipDao(
    //         new LiveApiJs(
    //             this_device.get_path().split(' ').slice(0, 3).concat(['clip_slots', '0', 'clip']).join(' ')
    //         ),
    //         new Messenger(env, 0)
    //     )
    // );
    //
    // return segments_first_clip.get_end_marker() - segments_first_clip.get_start_marker()
};

let expand_segments = () => {
    // let this_device = new li.LiveApiJs('this_device');
    //
    // let path_this_device = this_device.get_path();
    //
    // let list_this_device = path_this_device.split(' ');
    //
    // let index_this_track = Number(list_this_device[2]);

    let track = new Track(
        new TrackDao(
            new LiveApiJs(
                utils.get_path_this_track()
            ),
            messenger
        )
    );

    expand_track(track.get_path())
};

let contract_segments = () => {
    // let this_device = new li.LiveApiJs('this_device');
    //
    // let path_this_device = this_device.get_path();
    //
    // let list_this_device = path_this_device.split(' ');
    //
    // let index_this_track = Number(list_this_device[2]);

    let track = new Track(
        new TrackDao(
            new LiveApiJs(
                utils.get_path_this_track()
            ),
            messenger
        )
    );

    contract_track(track.get_path())
};

let expand_selected_track = () => {
    expand_track('live_set view selected_track')
};

let contract_selected_track = () => {
    contract_track('live_set view selected_track')
};

// Assumption: all clips on "segment track have same length"

// NB: works without highlighting any tracks
// aggregate all the notes in the track's clips
// delete all the track's clips
// set the notes inside of the single clip
let contract_track = (path_track) => {

    // length of first clip
    let length_beats = get_length_beats();

    let track = new Track(
        new TrackDao(
            new li.LiveApiJs(
                path_track
            ),
            messenger
        )
    );

    // clip_slots and clips
    track.load_clips();

    let notes = track.get_notes();

    track.delete_clips();

    track.create_clip_at_index(0, length_beats);

    let clip = track.get_clip_at_index(0);

    clip.set_notes(notes);

    // for (let clip_slot of track.get_clip_slots()) {
    //
    //     if (clip_slot.get_index() === 0) {
    //         continue
    //     }
    //
    //     if (clip_slot.b_has_clip()) {
    //         let clip = clip_slot.clip;
    //         clip_slot.clip.get_notes_within_markers()
    //     }
    //
    //
    // }



    // TODO: the following is one layer of abstraction below the DAO
    // let track = new li.LiveApiJs(path_track);

    // let list_path_track_with_index = track.get_path().split(' ').map((el) => {
    //     return el.replace('\"', '')
    // });
    //
    // let index_track = Number(list_path_track_with_index[2]);
    //
    // track = new li.LiveApiJs(list_path_track_with_index.join(' '));
    //
    // let num_clipslots = track.get("clip_slots").length/2;

    // let notes_amassed = [];
    //
    // // first, amass all notes of clips and delete all clips
    //
    // for (let i_clipslot of _.range(0, num_clipslots)) {
    //     let path_clipslot = ['live_set', 'tracks', index_track, 'clip_slots', Number(i_clipslot)].join(' ');
    //
    //     let api_clipslot_segment = new li.LiveApiJs(path_clipslot);
    //
    //     let clip_segment = new Clip(
    //         new ClipDao(
    //             new li.LiveApiJs(
    //                 path_clipslot.split(' ').concat(['clip']).join(' ')
    //             ),
    //             new Messenger(env, 0)
    //         )
    //     );
    //     notes_amassed = notes_amassed.concat(
    //         clip_segment.get_notes(
    //             clip_segment.get_loop_bracket_lower(),
    //             0,
    //             clip_segment.get_loop_bracket_upper(),
    //             128
    //         )
    //     );
    //
    //     api_clipslot_segment.call('delete_clip')
    // }
    //
    // // create one clip of length "length_beats"
    //
    // let path_clipslot_contracted = ['live_set', 'tracks', String(index_track), 'clip_slots', String(0)];
    //
    // let api_clipslot_contracted = new li.LiveApiJs(
    //     path_clipslot_contracted.join(' ')
    // );
    //
    // api_clipslot_contracted.call('create_clip', String(length_beats));
    //
    // let clip_contracted = new Clip(
    //     new ClipDao(
    //         new li.LiveApiJs(
    //             path_clipslot_contracted.concat(['clip']).join(' ')
    //         ),
    //         new Messenger(env, 0)
    //     )
    // );
    //
    // // add the amassed notes to it
    //
    // clip_contracted.set_notes(
    //     notes_amassed
    // )
};

// export let get_notes_on_track = (path_track) => {
//     let index_track = Number(path_track.split(' ')[2]);
//
//     let track = new li.LiveApiJs(path_track);
//
//     let num_clipslots = track.get("clip_slots").length/2;
//
//     let notes_amassed = [];
//
//     for (let i_clipslot of _.range(0, num_clipslots)) {
//         let path_clipslot = ['live_set', 'tracks', index_track, 'clip_slots', Number(i_clipslot)].join(' ');
//
//         let clip = new Clip(
//             new ClipDao(
//                 new li.LiveApiJs(
//                     path_clipslot.split(' ').concat(['clip']).join(' ')
//                 ),
//                 new Messenger(env, 0)
//             )
//         );
//
//         notes_amassed = notes_amassed.concat(
//             clip.get_notes(
//                 clip.get_loop_bracket_lower(),
//                 0,
//                 clip.get_loop_bracket_upper(),
//                 128
//             )
//         );
//     }
//
//     return notes_amassed
// };


// TODO: we can't export this, because it could be called from a different track than the one the segments are on...
// NB: assumes the device that calls this is on the track of segments
let get_notes_segments = () => {
    // let this_device = new li.LiveApiJs('this_device');
    // let path_this_track = this_device.get_path().split(' ').slice(0, 3).join(' ');
    let track_segments = utils.get_this_track();
    track_segments.load_clips();
    return track_segments.get_notes();
    // return get_notes_on_track(path_this_track)
};

// 'live_set view highlighted_clip_slot'

let test = () => {

};

let expand_selected_audio_track = () => {
    expand_track_audio('live_set view selected_track')
};

let contract_selected_audio_track = () => {
    contract_track_audio('live_set view selected_track')
};

// NB: we assume all training data starts on the first beat
let contract_track_audio = (path_track) => {

    let length_beats = get_length_beats();

    let track = new Track(
        new TrackDao(
            new li.LiveApiJs(path_track),
            messenger
        )
    );

    track.load_clips();

    let clip_slots = track.get_clip_slots();

    for (let i_clip_slot_audio in clip_slots) {

        let clip_slot_audio = clip_slots[Number(i_clip_slot_audio)];

        if (Number(i_clip_slot_audio) === 0) {
            clip_slot_audio.clip.set_endpoint_markers(0, length_beats);

            continue
        }

        if (clip_slot_audio.b_has_clip()) {
            clip_slot_audio.delete_clip()
        }
    }

    // let track = new li.LiveApiJs(path_track);

    // let list_path_track_with_index = track.get_path().split(' ').map((el) => {
    //     return el.replace('\"', '')
    // });

    // let index_track = Number(list_path_track_with_index[2]);
    //
    // track = new li.LiveApiJs(list_path_track_with_index.join(' '));

    // let num_clipslots = track.get("clip_slots").length/2;

    // let notes_segments = get_notes_segments();

    // for (let i_clipslot of _.range(1, num_clipslots)) {
    //     let path_clipslot = ['live_set', 'tracks', index_track, 'clip_slots', Number(i_clipslot)].join(' ');
    //
    //     let api_clipslot_segment = new li.LiveApiJs(path_clipslot);
    //
    //     api_clipslot_segment.call('delete_clip')
    // }
    //
    // let path_clipslot_contracted = ['live_set', 'tracks', String(index_track), 'clip_slots', String(0)];
    //
    // let clip_contracted = new Clip(
    //     new ClipDao(
    //         new li.LiveApiJs(
    //             path_clipslot_contracted.concat(['clip']).join(' ')
    //         ),
    //         new Messenger(env, 0)
    //     )
    // );
    //
    // clip_contracted.set_endpoints_loop(0, length_beats);
};

let expand_track_audio = (path_track) => {

    // let length_beats = get_length_beats();

    // let clipslot_audio = new li.LiveApiJs(path_clip_slot);

    // let track = new li.LiveApiJs(clipslot_audio.get_path().split(' ').slice(0, 3).join(' '));

    // let index_track = clipslot_audio.get_path().split(' ')[2];

    // let num_clipslots = track.get("clip_slots").length/2;

    let track = new Track(
        new TrackDao(
            new LiveApiJs(
                path_track
            ),
            messenger
        )
    );

    let clip_slot_audio = track.get_clip_slot_at_index(0);

    // TODO: we won't need to do this since we will be creating new ones anyway
    // track.load();

    let notes_segments = get_notes_segments();

    let song = new Song(
        new SongDao(
            new li.LiveApiJs(
                'live_set'
            ),
            new Messenger(env, 0),
            true
        )
    );

    song.set_path_deferlow('set_path_song');

    for (let i_clipslot of _.range(1, notes_segments.length)) {
        let note_segment = notes_segments[Number(i_clipslot)];
        // let notes_segments
        // let clip_slot = new ClipSlot(
        //     new ClipSlotDao(
        //         // utils.get_clipslot_at_index(Number(i_clipslot))
        //     )
        // );

        let scene: Scene = song.get_scene_at_index(Number(i_clipslot));

        // if (track.get_clip_slot_at_index(Number(i_clipslot)) === null) {
        //     let scen
        // }

        let scene_exists = scene !== null;

        if (scene_exists) {
            song.create_scene_at_index(Number(i_clipslot))
        }

        // let clipslot = new li.LiveApiJs(path_clipslot);

        let clip_slot = track.get_clip_slot_at_index(Number(i_clipslot));

        // let clip_slot = new ClipSlot(
        //     new ClipSlotDao(
        //         new LiveApiJs(
        //             utils.get_path_clip_slot_at
        //         )
        //     )
        // )

        // let has_clip = clipslot.get("has_clip")[0] === 1;

        if (clip_slot.b_has_clip()) {
            // clipslot.call("delete_clip")
            clip_slot.delete_clip()
        }







        // let path_clipslot = ['live_set', 'tracks', index_track, 'clip_slots', Number(i_clipslot)].join(' ');
        //
        // let scene = new li.LiveApiJs(
        //     ['live_set', 'scenes', String(Number(i_clipslot))].join(' ')
        // );

        // let scene_exists = Number(scene.get_id()) !== 0;

        // if (!scene_exists) {
        //     song.call('create_scene', String(Number(i_clipslot)))
        // }

        // let clipslot = new li.LiveApiJs(path_clipslot);
        //
        // let has_clip = clipslot.get("has_clip")[0] === 1;
        //
        // if (has_clip) {
        //     clipslot.call("delete_clip")
        // }

        clip_slot_audio.duplicate_clip_to(clip_slot);

        // clipslot_audio.call("duplicate_clip_to", ['id', clipslot.get_id()].join(' '));

        // let clip = new Clip(
        //     new ClipDao(
        //         new LiveApiJs(
        //             path_clipslot.split(' ').concat(['clip']).join(' ')
        //         ),
        //         new Messenger(env, 0)
        //     )
        // );

        let clip = Track.get_clip_at_index(
            track.get_index(),
            Number(i_clipslot),
            messenger
        );

        let segment = new Segment(note_segment);

        clip.set_endpoints_loop(
            segment.beat_start,
            segment.beat_end
        )
    }
};

// let notes_segments = io.Importer.import('segment');

let expand_track = (path_track) => {

    let logger = new Logger(env);
    //
    // let clipslot_highlighted = new li.LiveApiJs(
    //     path_clip_slot
    // );
    //
    // let path_track = clipslot_highlighted.get_path();
    //
    // let index_track = path_track.split(' ')[2];
    //
    // let clip_highlighted = new Clip(
    //     new ClipDao(
    //         new li.LiveApiJs(
    //             [path_clip_slot, 'clip'].join(' ')
    //         ),
    //         new Messenger(env, 0)
    //     )
    // );

    let track = new Track(
        new TrackDao(
            new LiveApiJs(
                path_track
            ),
            messenger
        )
    );

    //
    // let clip_slot = new ClipSlot(
    //     new ClipSlotDao(
    //         new LiveApiJs('id 15'),
    //         messenger
    //     )
    // );
    //
    // clip_slot.load_clip();
    //
    // logger.log(JSON.stringify(clip_slot.b_has_clip()));
    // logger.log(path_track);

    // return;


    // logger.log(JSON.stringify(track.track_dao.live_api.get('clip_slots')));

    track.load_clips();

    let clip = track.get_clip_at_index(0);

    // get first clip
    // get its notes

    let notes_clip = clip.get_notes(
        clip.get_loop_bracket_lower(),
        0,
        clip.get_loop_bracket_upper(),
        128
    );

    // TODO: put back in please
    // let notes_segments = get_notes_segments();

    // logger.log(JSON.stringify(notes_clip));

    // return;

    let notes_segments = get_notes_segments();

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
            new li.LiveApiJs(
                'live_set'
            ),
            new Messenger(env, 0),
            false
        )
    );

    let song_write = new Song(
        new SongDao(
            new li.LiveApiJs(
                'live_set'
            ),
            new Messenger(env, 0),
            true,
            'song'
        )
    );

    // let song = new li.LiveApiJs(
    //     'live_set'
    // );

    // let logger = new Logger(env);

    let length_beats = get_length_beats();

    for (let i_segment in segments) {

        let segment = segments[Number(i_segment)];

        // let path_clipslot = ['live_set', 'tracks', String(index_track), 'clip_slots', String(Number(i_segment))];
        //
        // let path_live = path_clipslot.join(' ');

        // let scene = new li.LiveApiJs(
        //     ['live_set', 'scenes', String(Number(i_segment))].join(' ')
        // );

        let scene = song_read.get_scene_at_index(Number(i_segment));

        let scene_exists = scene !== null;

        if (!scene_exists) {
            // song.call('create_scene', String(Number(i_segment)))
            song_write.create_scene_at_index(Number(i_segment))
        }

        // let clipslot = new li.LiveApiJs(
        //     path_live
        // );

        let clip_slot = Track.get_clip_slot_at_index(
            track.get_index(),
            Number(i_segment),
            messenger
        );

        if (Number(i_segment) === 0) {
            // clipslot.call('delete_clip');
            clip_slot.delete_clip()
        }

        clip_slot.create_clip(length_beats);

        clip_slot.load_clip();

        let clip = clip_slot.get_clip();

        // clipslot.call('create_clip', String(length_beats));

        // let path_clip = path_clipslot.concat('clip').join(' ');
        //
        // let clip = new Clip(
        //     new ClipDao(
        //         new li.LiveApiJs(
        //             path_clip
        //         ),
        //         new Messenger(env, 0)
        //     )
        // );

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

        clip.set_notes(notes_within_segment)
    }

};

if (typeof Global !== "undefined") {
    Global.segmenter = {};
    Global.segmenter.expand_selected_track = expand_selected_track;
    Global.segmenter.contract_selected_track = contract_selected_track;
    Global.segmenter.contract_segments = contract_segments;
    Global.segmenter.expand_segments = expand_segments;
    Global.segmenter.expand_selected_audio_track = expand_selected_audio_track;
    Global.segmenter.contract_selected_audio_track = contract_selected_audio_track;
    Global.segmenter.test = test;
}
