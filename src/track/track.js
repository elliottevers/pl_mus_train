"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var live_1 = require("../live/live");
var clip_1 = require("../clip/clip");
var clip_slot_1 = require("../clip_slot/clip_slot");
var _ = require('underscore');
var track;
(function (track) {
    var LiveApiJs = live_1.live.LiveApiJs;
    var Clip = clip_1.clip.Clip;
    var ClipDao = clip_1.clip.ClipDao;
    var ClipSlot = clip_slot_1.clip_slot.ClipSlot;
    var ClipSlotDao = clip_slot_1.clip_slot.ClipSlotDao;
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
            this.clip_slots = [];
            this.track_dao = track_dao;
        }
        Track.get_clip_at_index = function (index_track, index_clip_slot, messenger) {
            return new Clip(new ClipDao(new LiveApiJs(['live_set', 'tracks', String(index_track), 'clips', String(index_clip_slot), 'clip'].join(' ')), messenger));
        };
        Track.get_clip_slot_at_index = function (index_track, index_clip_slot, messenger) {
            return new ClipSlot(new ClipSlotDao(new LiveApiJs(['live_set', 'tracks', String(index_track), 'clips', String(index_clip_slot)].join(' ')), messenger));
        };
        Track.prototype.get_index = function () {
            return Number(this.track_dao.get_path().split(' ')[2]);
        };
        Track.prototype.load_clip_slots = function () {
            this.clip_slots = this.track_dao.get_clip_slots();
            // let logger = new Logger('max');
            // logger.log(this.track_dao.get_clip_slots().length);
        };
        Track.prototype.mute = function () {
            this.track_dao.mute(true);
        };
        Track.prototype.unmute = function () {
            this.track_dao.mute(false);
        };
        // public load_clips(): void {
        //     //
        //     let id_pairs: string[][] = this.get_clip_slots();
        //     for (let id_pair of id_pairs) {
        //         let clip_slot = new ClipSlot(
        //             new ClipSlotDao(
        //                 new LiveApiJs(
        //                     id_pair.join(' ')
        //                 ),
        //                 this.track_dao.messenger
        //             )
        //         );
        //
        //         if (clip_slot.b_has_clip()) {
        //             this.clip
        //         }
        //     }
        // }
        Track.prototype.load_clips = function () {
            this.load_clip_slots();
            // let logger = new Logger('max');
            // logger.log(JSON.stringify(this.clip_slots))
            for (var _i = 0, _a = this.clip_slots; _i < _a.length; _i++) {
                var clip_slot_2 = _a[_i];
                clip_slot_2.load_clip();
                // if (clip_slot.b_has_clip()) {
                //     logger.log(JSON.stringify(clip_slot.get_clip().get_notes_within_markers()))
                // }
            }
        };
        Track.prototype.delete_clips = function () {
            for (var _i = 0, _a = this.clip_slots; _i < _a.length; _i++) {
                var clip_slot_3 = _a[_i];
                clip_slot_3.delete_clip();
            }
        };
        Track.prototype.create_clip_at_index = function (index, length_beats) {
            this.clip_slots[index].create_clip(length_beats);
        };
        Track.prototype.get_clip_slot_at_index = function (index_clip_slot) {
            return this.clip_slots[index_clip_slot];
        };
        // TODO: should return null if the there aren't even that many scenes
        Track.prototype.get_clip_at_index = function (index) {
            var clip_slot = this.clip_slots[index];
            return clip_slot.get_clip();
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
                var clip_slot_4 = _a[_i];
                notes_amassed = notes_amassed.concat(clip_slot_4.get_clip().get_notes_within_markers());
            }
            return notes_amassed;
        };
        Track.prototype.get_path = function () {
            // TODO: implement
            return;
        };
        return Track;
    }());
    track.Track = Track;
    // TODO: please change everything in here
    var TrackDaoVirtual = /** @class */ (function () {
        function TrackDaoVirtual(clips) {
            this.clips = clips;
        }
        TrackDaoVirtual.prototype.mute = function () {
        };
        // get_num_clip_slots(): number {
        //     return this.num_clip_slots;
        // }
        TrackDaoVirtual.prototype.get_notes = function () {
            var notes_amassed = [];
            for (var _i = 0, _a = this.clips; _i < _a.length; _i++) {
                var clip_2 = _a[_i];
                notes_amassed = notes_amassed.concat(clip_2.get_notes(clip_2.get_loop_bracket_lower(), 0, clip_2.get_loop_bracket_upper(), 128));
            }
            return notes_amassed;
        };
        TrackDaoVirtual.prototype.get_clip_slots = function () {
            return;
        };
        return TrackDaoVirtual;
    }());
    track.TrackDaoVirtual = TrackDaoVirtual;
    var TrackDao = /** @class */ (function () {
        function TrackDao(live_api, messenger) {
            this.live_api = live_api;
            this.messenger = messenger;
        }
        TrackDao.prototype.get_clip_slots = function () {
            var _this = this;
            var data_clip_slots = this.live_api.get("clip_slots");
            var clip_slots = [];
            var clip_slot = [];
            for (var i_datum in data_clip_slots) {
                var datum = data_clip_slots[Number(i_datum)];
                clip_slot.push(datum);
                if (Number(i_datum) % 2 === 1) {
                    clip_slots.push(clip_slot);
                }
            }
            return clip_slots.map(function (id_clip_slot) {
                return new ClipSlot(new ClipSlotDao(new LiveApiJs(id_clip_slot), _this.messenger));
            });
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
            return;
        };
        return TrackDao;
    }());
    track.TrackDao = TrackDao;
})(track = exports.track || (exports.track = {}));
//# sourceMappingURL=track.js.map