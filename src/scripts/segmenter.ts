import {message as m, message} from "../message/messenger";
import Messenger = message.Messenger;
import {live as li} from "../live/live";
import {log} from "../log/logger";
import Logger = log.Logger;
import {utils} from "../utils/utils";
import {clip as c, clip} from "../clip/clip";
import Clip = clip.Clip;
import ClipDao = clip.ClipDao;
import {io} from "../io/io";
import {segment} from "../segment/segment";
import Segment = segment.Segment;
import {song} from "../song/song";
import SongDao = song.SongDao;
import Song = song.Song;
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

let length_beats: number;

let set_length_beats = (beats) => {
    length_beats = beats
};

// NB: works without highlighting any tracks
let contract_clip = (path_clip_slot) => {

    let device = new li.LiveApiJs(path_clip_slot);

    let path_this_device = device.get_path();

    let list_this_device = path_this_device.split(' ');

    let index_this_track = Number(list_this_device[2]);

    let this_track = new li.LiveApiJs(list_this_device.slice(0, 3).join(' '));

    let num_clipslots = this_track.get("clip_slots").length/2;

    let notes_amassed = [];

    // first, amass all notes of clips and delete all clips

    for (let i_clipslot of _.range(0, num_clipslots)) {
        let path_clipslot = ['live_set', 'tracks', index_this_track, 'clip_slots', Number(i_clipslot)].join(' ');

        let api_clipslot_segment = new li.LiveApiJs(path_clipslot);

        let clip_segment = new Clip(
            new ClipDao(
                new li.LiveApiJs(
                    path_clipslot.split(' ').concat(['clip']).join(' ')
                ),
                new Messenger(env, 0)
            )
        );
        notes_amassed = notes_amassed.concat(
            clip_segment.get_notes(
                clip_segment.get_loop_bracket_lower(),
                0,
                clip_segment.get_loop_bracket_upper(),
                128
            )
        );

        api_clipslot_segment.call('delete_clip')
    }

    // create one clip of length "length_beats"

    let path_clipslot_contracted = ['live_set', 'tracks', String(index_this_track), 'clip_slots', String(0)];

    let api_clipslot_contracted = new li.LiveApiJs(
        path_clipslot_contracted.join(' ')
    );

    api_clipslot_contracted.call('create_clip', String(length_beats));

    let clip_contracted = new Clip(
        new ClipDao(
            new li.LiveApiJs(
                path_clipslot_contracted.concat(['clip']).join(' ')
            ),
            new Messenger(env, 0)
        )
    );

    // add the amassed notes to it

    clip_contracted.set_notes(
        notes_amassed
    )
};

let expand_segments = () => {
    let this_device = new li.LiveApiJs('this_device');

    let path_this_device = this_device.get_path();

    let list_this_device = path_this_device.split(' ');

    let index_this_track = Number(list_this_device[2]);

    expand_clip(['live_set', 'tracks', index_this_track, 'clip_slots', 0].join(' '))
};

let contract_segments = () => {
    let this_device = new li.LiveApiJs('this_device');

    let path_this_device = this_device.get_path();

    let list_this_device = path_this_device.split(' ');

    let index_this_track = Number(list_this_device[2]);

    contract_clip(['live_set', 'tracks', index_this_track, 'clip_slots', 0].join(' '))
};

let expand_highlighted_clip = () => {
    expand_clip('live_set view highlighted_clip_slot')
};

let contract_highlighted_clip = () => {
    contract_clip('live_set view highlighted_clip_slot')
};

export let get_notes_on_track = (path_track) => {
    // let obj = new li.LiveApiJs(path_device);
    //
    // let path_obj = obj.get_path();

    let index_track = Number(path_track.split(' ')[2]);

    let track = new li.LiveApiJs(path_track);

    let num_clipslots = track.get("clip_slots").length/2;

    let notes_amassed = [];

    for (let i_clipslot of _.range(0, num_clipslots)) {
        let path_clipslot = ['live_set', 'tracks', index_track, 'clip_slots', Number(i_clipslot)].join(' ');

        let clip = new Clip(
            new ClipDao(
                new li.LiveApiJs(
                    path_clipslot.split(' ').concat(['clip']).join(' ')
                ),
                new Messenger(env, 0)
            )
        );

        notes_amassed = notes_amassed.concat(
            clip.get_notes(
                clip.get_loop_bracket_lower(),
                0,
                clip.get_loop_bracket_upper(),
                128
            )
        );

        // let logger = new Logger('max');
        // logger.log(JSON.stringify(notes_amassed))
    }

    return notes_amassed
};

export let get_notes_segments = () => {
    let this_device = new li.LiveApiJs('this_device');
    let path_this_track = this_device.get_path().split(' ').slice(0, 3).join(' ');
    // let logger = new Logger('max');
    // logger.log(path_this_track);
    return get_notes_on_track(path_this_track)
};

// let notes_segments = io.Importer.import('segment');

let expand_clip = (path_clip_slot) => {

    let clipslot_highlighted = new li.LiveApiJs(
        path_clip_slot
    );

    let path_track = clipslot_highlighted.get_path();

    let index_track = path_track.split(' ')[2];

    let clip_highlighted = new Clip(
        new ClipDao(
            new li.LiveApiJs(
                [path_clip_slot, 'clip'].join(' ')
            ),
            new Messenger(env, 0)
        )
    );

    let notes_clip = clip_highlighted.get_notes(
        clip_highlighted.get_loop_bracket_lower(),
        0,
        clip_highlighted.get_loop_bracket_upper(),
        128
    );

    let notes_segments = get_notes_segments();

    let segments: Segment[] = [];

    for (let note of notes_segments) {
        segments.push(
            new Segment(
                note
            )
        )
    }

    let song = new li.LiveApiJs(
        'live_set'
    );

    let logger = new Logger(env);

    for (let i_segment in segments) {

        let segment = segments[Number(i_segment)];

        let path_clipslot = ['live_set', 'tracks', String(index_track), 'clip_slots', String(Number(i_segment))];

        let path_live = path_clipslot.join(' ');

        let scene = new li.LiveApiJs(
            ['live_set', 'scenes', String(Number(i_segment))].join(' ')
        );

        let scene_exists = Number(scene.get_id()) !== 0;

        if (!scene_exists) {
            song.call('create_scene', String(Number(i_segment)))
        }

        let clipslot = new li.LiveApiJs(
            path_live
        );

        if (Number(i_segment) === 0) {
            clipslot.call('delete_clip');
        }

        // clipslot.call('create_clip', String(length_beats));

        let logger = new Logger('max');

        logger.log(String(segment.get_endpoints_loop()[1]));
        logger.log(String(segment.get_endpoints_loop()[0]));
        logger.log('---------');

        clipslot.call('create_clip', String(segment.get_endpoints_loop()[1] - segment.get_endpoints_loop()[0]));

        let path_clip = path_clipslot.concat('clip').join(' ');

        let clip = new Clip(
            new ClipDao(
                new li.LiveApiJs(
                    path_clip
                ),
                new Messenger(env, 0)
            )
        );

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
    Global.segmenter.expand_highlighted_clip = expand_highlighted_clip;
    Global.segmenter.contract_highlighted_clip = contract_highlighted_clip;
    Global.segmenter.contract_segments = contract_segments;
    Global.segmenter.expand_segments = expand_segments;
    Global.segmenter.set_length_beats = set_length_beats;
}
