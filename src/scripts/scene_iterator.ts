import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {live as li} from "../live/live";
import {log} from "../log/logger";
import Logger = log.Logger;
import {utils} from "../utils/utils";
import {song as module_song} from "../song/song";
import Song = module_song.Song;
import SongDao = module_song.SongDao;
// import {Segment} from "../segment/segment";
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

let i;

i = -1;

let direction_forward = true;

// let test = () => {
//     let path_scene = "live_set view selected_scene"
// };

let scenes = [];

// initialize

for (let i of _.range(0, 5)) {
    let path_scene = ['live_set', 'scenes', Number(i)].join(' ');
    // let path_live = constituents_path.join(' ');
    let scene = new li.LiveApiJs(
        path_scene
    );
    scenes.push(scene)
    // scenes.call('create_clip', String(beats_length_clip));
}


let song = new Song(
    new SongDao(
        new li.LiveApiJs(
            'live_set'
        ),
        new Messenger(env, 0),
        false
    )
);



let next = () => {
    let value_increment = (direction_forward) ? 1 : -1;

    i += value_increment;

    if (i < 0) {
        throw 'scene iterator < 0'
    }

    if (i < scenes.length) {
        // return {
        //     value: this.segments[this.i],
        //     done: false
        // }
        let force_legato = String(1);
        scenes[i].call('fire', force_legato)
    } else {
        // return {
        //     value: null,
        //     done: true
        // }
        song.stop()
    }
};

if (typeof Global !== "undefined") {
    Global.scene_iterator = {};
    Global.scene_iterator.next = next;
}


// export class SegmentIterator {
//     private segments: Segment[];
//     public direction_forward: boolean;
//     private i: number;
//
//     constructor(segments: Segment[], direction_forward: boolean) {
//         this.segments = segments;
//         this.direction_forward = direction_forward;
//         this.i = -1;
//     }
//
//     // TODO: type declarations
//     public next() {
//         let value_increment = (this.direction_forward) ? 1 : -1;
//
//         this.i += value_increment;
//
//         if (this.i < 0) {
//             throw 'segment iterator < 0'
//         }
//
//         if (this.i < this.segments.length) {
//             return {
//                 value: this.segments[this.i],
//                 done: false
//             }
//         } else {
//             return {
//                 value: null,
//                 done: true
//             }
//         }
//     }
//
//     public current() {
//         if (this.i > -1) {
//             return this.segments[this.i];
//         } else {
//             return null;
//         }
//     }
//
//     public reset() {
//         this.i = -1;
//     }
//
//     public get_index_current() {
//         return this.i;
//     }
// }
