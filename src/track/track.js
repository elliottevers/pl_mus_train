"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var live_1 = require("../live/live");
var clip_1 = require("../clip/clip");
var messenger_1 = require("../message/messenger");
var _ = require('underscore');
var track;
(function (track_1) {
    var Clip = clip_1.clip.Clip;
    var ClipDao = clip_1.clip.ClipDao;
    var Messenger = messenger_1.message.Messenger;
    track_1.get_notes_on_track = function (path_track) {
        var index_track = Number(path_track.split(' ')[2]);
        var track = new Track(new TrackDao(new live_1.live.LiveApiJs(path_track)));
        var num_clip_slots = track.get_num_clip_slots();
        // let track = new li.LiveApiJs(path_track);
        // let num_clipslots = track.get("clip_slots").length/2;
        var notes_amassed = [];
        for (var _i = 0, _a = _.range(0, num_clip_slots); _i < _a.length; _i++) {
            var i_clipslot = _a[_i];
            var path_clipslot = ['live_set', 'tracks', index_track, 'clip_slots', Number(i_clipslot)].join(' ');
            var clip_2 = new Clip(new ClipDao(new live_1.live.LiveApiJs(path_clipslot.split(' ').concat(['clip']).join(' ')), new Messenger('max', 0)));
            notes_amassed = notes_amassed.concat(clip_2.get_notes(clip_2.get_loop_bracket_lower(), 0, clip_2.get_loop_bracket_upper(), 128));
        }
        return notes_amassed;
    };
    var Track = /** @class */ (function () {
        function Track(track_dao) {
            this.track_dao = track_dao;
        }
        Track.prototype.get_num_clip_slots = function () {
            return this.get_clip_slots().length;
        };
        Track.prototype.get_clip_slots = function () {
            return this.track_dao.get_clip_slots();
        };
        return Track;
    }());
    track_1.Track = Track;
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
        return TrackDao;
    }());
    track_1.TrackDao = TrackDao;
})(track = exports.track || (exports.track = {}));
//# sourceMappingURL=track.js.map