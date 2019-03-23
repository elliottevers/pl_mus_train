"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var live_1 = require("../live/live");
var clip_1 = require("../clip/clip");
var messenger_1 = require("../message/messenger");
var _ = require('underscore');
var track;
(function (track) {
    var LiveApiJs = live_1.live.LiveApiJs;
    var Clip = clip_1.clip.Clip;
    var ClipDao = clip_1.clip.ClipDao;
    var Messenger = messenger_1.message.Messenger;
    // export let get_notes_on_track = (path_track) => {
    //     let index_track = Number(path_track.split(' ')[2]);
    //
    //     let track = new Track(
    //         new TrackDao(
    //             new li.LiveApiJs(path_track)
    //         )
    //     );
    //
    //     let num_clip_slots = track.get_num_clip_slots();
    //
    //     let notes_amassed = [];
    //
    //     for (let i_clipslot of _.range(0, num_clip_slots)) {
    //         let path_clipslot = ['live_set', 'tracks', index_track, 'clip_slots', Number(i_clipslot)].join(' ');
    //
    //         let clip = new Clip(
    //             new ClipDao(
    //                 new li.LiveApiJs(
    //                     path_clipslot.split(' ').concat(['clip']).join(' ')
    //                 ),
    //                 new Messenger('max', 0)
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
    var Track = /** @class */ (function () {
        function Track(track_dao) {
            this.track_dao = track_dao;
        }
        Track.prototype.mute = function () {
            this.track_dao.mute(1);
        };
        Track.prototype.unmute = function () {
            this.track_dao.mute(0);
        };
        Track.get_clip_at_index = function (index_track, index_clip_slot) {
            return new Clip(new ClipDao(new LiveApiJs(path_clipslot.split(' ').concat(['clip']).join(' ')), new Messenger(env, 0)));
        };
        // TODO: maintain an interval tree
        Track.prototype.get_clip_at_interval = function () {
        };
        Track.prototype.get_index = function () {
        };
        Track.prototype.load_clip_slots = function () {
        };
        Track.prototype.load_clips = function () {
        };
        Track.prototype.load = function () {
        };
        Track.prototype.delete_clips = function () {
        };
        Track.prototype.create_clip_at_index = function () {
        };
        Track.prototype.get_clip_slot_at_index = function () {
        };
        // TODO: should return null if the there aren't even that many scenes
        Track.prototype.get_clip_at_index = function () {
        };
        Track.prototype.get_num_clip_slots = function () {
            return this.get_clip_slots().length;
        };
        Track.prototype.get_clip_slots = function () {
            return this.track_dao.get_clip_slots();
        };
        // NB: assumes that the clips form a perfect partition of the duration inside the start, end marker
        Track.prototype.get_notes = function () {
            var notes_amassed = [];
            for (var _i = 0, _a = this.clip_slots; _i < _a.length; _i++) {
                var clip_2 = _a[_i];
                notes_amassed = notes_amassed.concat(clip_2.get_notes_within_markers());
            }
            return notes_amassed;
        };
        Track.prototype.get_path = function () {
        };
        return Track;
    }());
    track.Track = Track;
    var TrackDaoVirtual = /** @class */ (function () {
        function TrackDaoVirtual(clips) {
            this.clips = clips;
        }
        TrackDaoVirtual.prototype.mute = function () {
        };
        TrackDaoVirtual.prototype.get_num_clip_slots = function () {
            return this.num_clip_slots;
        };
        TrackDaoVirtual.prototype.get_notes = function () {
            var notes_amassed = [];
            for (var _i = 0, _a = this.clips; _i < _a.length; _i++) {
                var clip_3 = _a[_i];
                notes_amassed = notes_amassed.concat(clip_3.get_notes(clip_3.get_loop_bracket_lower(), 0, clip_3.get_loop_bracket_upper(), 128));
            }
            return notes_amassed;
        };
        TrackDaoVirtual.prototype.get_clip_slots = function () {
            // let data_clip_slots = this.live_api.get("clip_slots");
            //
            // let clip_slots = [];
            //
            // let clip_slot = [];
            //
            // for (let i_datum in data_clip_slots) {
            //
            //     let datum = Number(i_datum);
            //
            //     clip_slot.push(datum);
            //
            //     if (Number(i_datum) % 2 === 1) {
            //         clip_slots.push(clip_slot)
            //     }
            // }
            //
            // return clip_slots
            var data = [];
            for (var _i = 0, _a = _.range(0, this.num_clip_slots); _i < _a.length; _i++) {
                var i = _a[_i];
                data.push('id');
                data.push(String(i));
            }
            return data;
        };
        return TrackDaoVirtual;
    }());
    track.TrackDaoVirtual = TrackDaoVirtual;
    var TrackDao = /** @class */ (function () {
        function TrackDao(live_api) {
            this.live_api = live_api;
        }
        TrackDao.prototype.get_clip_slots = function () {
            var data_clip_slots = this.live_api.get("clip_slots");
            var clip_slots = [];
            var clip_slot = [];
            for (var i_datum in data_clip_slots) {
                var datum = Number(i_datum);
                clip_slot.push(datum);
                if (Number(i_datum) % 2 === 1) {
                    clip_slots.push(clip_slot);
                }
            }
            return clip_slots;
        };
        TrackDao.prototype.mute = function (val) {
            if (val) {
                this.live_api.call('mute', '1');
            }
            else {
                this.live_api.call('mute', '0');
            }
        };
        // implement the amassing notes logic
        TrackDao.prototype.get_notes = function () {
        };
        return TrackDao;
    }());
    track.TrackDao = TrackDao;
})(track = exports.track || (exports.track = {}));
//# sourceMappingURL=track.js.map