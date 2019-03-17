import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {live as li} from "../live/live";
import {log} from "../log/logger";
import Logger = log.Logger;
import {utils} from "../utils/utils";
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

let test = () => {

    // extract segments from sole clip

    // delete clip

    // for each list of notes, create a clip, then set notes

    // 1) create a bunch of empty clips below the currently selected one

    // get track index of highlighted clip

    let clipslot_highlighted = new li.LiveApiJs(
        'live_set view highlighted_clip_slot'
    );

    let path_track = clipslot_highlighted.get_path();

    let index_track = path_track.split(' ')[2];

    let logger = new Logger(env);

    logger.log(index_track);

    // "live_set tracks 3 clip_slots 0"

    // TODO: start/end markers of clip, loop endpoints, delete first one

    let beats_length_clip = 8;

    for (let i of _.range(1, 5)) {
        let constituents_path = ['live_set', 'tracks', String(index_track), 'clip_slots', String(i)];
        let path_live = constituents_path.join(' ');
        let clipslot = new li.LiveApiJs(
            path_live
        );
        clipslot.call('create_clip', String(beats_length_clip));
        // logger.log(i)
    }

    // logger.log(clipslot_highlighted.get_id());
    //
    // logger.log(clipslot_highlighted.get_path());

};

if (typeof Global !== "undefined") {
    Global.segmenter = {};
    Global.segmenter.test = test;
}
