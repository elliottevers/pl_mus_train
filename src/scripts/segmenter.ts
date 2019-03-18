import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {live as li} from "../live/live";
import {log} from "../log/logger";
import Logger = log.Logger;
import {utils} from "../utils/utils";
import {clip} from "../clip/clip";
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


let segment_clip = () => {

    let clipslot_highlighted = new li.LiveApiJs(
        'live_set view highlighted_clip_slot'
    );

    let path_track = clipslot_highlighted.get_path();

    let index_track = path_track.split(' ')[2];

    let clip_highlighted = new Clip(
        new ClipDao(
            new li.LiveApiJs(
                'live_set view highlighted_clip_slot clip'
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

    let notes_segments = io.Importer.import('segment');

    let segments: Segment[] = [];

    for (let note of notes_segments) {
        segments.push(
            new Segment(
                note
            )
        )
    }


    // let logger = new Logger(env);

    let song = new li.LiveApiJs(
        'live_set'
    );

    // for (let i of _.range(0, segments.length + 1)) {
    for (let i_segment in segments) {

        let segment = segments[Number(i_segment)];

        let path_clipslot = ['live_set', 'tracks', String(index_track), 'clip_slots', String(Number(i_segment))];

        let path_live = path_clipslot.join(' ');

        let scene = new li.LiveApiJs(
            ['live_set', 'scenes', String(Number(i_segment))].join(' ')
        );

        let scene_exists = Number(scene.get_id()) !== 0;

        // logger.log(scene.get_path());

        if (!scene_exists) {
            song.call('create_scene', String(Number(i_segment)))
        }

        let clipslot = new li.LiveApiJs(
            path_live
        );

        if (Number(i_segment) === 0) {
            clipslot.call('delete_clip', String(length_beats));
        }

        clipslot.call('create_clip', String(length_beats));

        let path_clip = path_clipslot.concat('clip').join(' ');

        let clip = new Clip(
            new ClipDao(
                new li.LiveApiJs(
                    path_clip
                ),
                new Messenger(env, 0)
            )
        );

        clip.set_loop_bracket_lower(
            segment.get_endpoints_loop()[0]
        );

        clip.set_loop_bracket_upper(
            segment.get_endpoints_loop()[1]
        );

        let notes_within_segment = notes_clip.filter(
            node => segment.get_endpoints_loop()[0] <= node.model.note.beat_start && node.model.note.beat_start < segment.get_endpoints_loop()[0] + segment.get_endpoints_loop()[1]
        );

        clip.set_notes(notes_within_segment)
    }

};

if (typeof Global !== "undefined") {
    Global.segmenter = {};
    Global.segmenter.segment_clip = segment_clip;
    Global.segmenter.set_length_beats = set_length_beats;
}
