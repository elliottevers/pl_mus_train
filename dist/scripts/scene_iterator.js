"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("../live/live");
var song_1 = require("../song/song");
var Song = song_1.song.Song;
var SongDao = song_1.song.SongDao;
// import {Segment} from "../segment/segment";
var _ = require('underscore');
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var i;
i = -1;
var direction_forward = true;
// let test = () => {
//     let path_scene = "live_set view selected_scene"
// };
var scenes = [];
// initialize
for (var _i = 0, _a = _.range(0, 5); _i < _a.length; _i++) {
    var i_1 = _a[_i];
    var path_scene = ['live_set', 'scenes', Number(i_1)].join(' ');
    // let path_live = constituents_path.join(' ');
    var scene = new live_1.live.LiveApiJs(path_scene);
    scenes.push(scene);
    // scenes.call('create_clip', String(beats_length_clip));
}
var song = new Song(new SongDao(new live_1.live.LiveApiJs('live_set'), new Messenger(env, 0), false));
var next = function () {
    var value_increment = (direction_forward) ? 1 : -1;
    i += value_increment;
    if (i < 0) {
        throw 'scene iterator < 0';
    }
    if (i < scenes.length) {
        // return {
        //     value: this.segments[this.i],
        //     done: false
        // }
        var force_legato = String(1);
        scenes[i].call('fire', force_legato);
    }
    else {
        // return {
        //     value: null,
        //     done: true
        // }
        song.stop();
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
//# sourceMappingURL=scene_iterator.js.map