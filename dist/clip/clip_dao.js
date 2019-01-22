"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clip_dao;
(function (clip_dao) {
    var ClipDao = /** @class */ (function () {
        function ClipDao(index_track, index_clip_slot, messenger, deferlow) {
            var path = "live_set tracks " + index_track + " clip_slots " + index_clip_slot + " clip";
            this.clip_live = new LiveAPI(null, path);
            this.messenger = messenger;
            this.deferlow = deferlow;
        }
        ClipDao.prototype.get_end_marker = function () {
            return this.clip_live.get('end_marker');
        };
        ClipDao.prototype.set_loop_bracket_lower = function (beat) {
            if (this.deferlow) {
                this.messenger.message(["clip_endpoints", "loop_start", beat, "set"]);
            }
            else {
                this.clip_live.set('loop_start', beat);
            }
        };
        ClipDao.prototype.set_loop_bracket_upper = function (beat) {
            if (this.deferlow) {
                this.messenger.message(["clip_endpoints", "loop_end", beat, "set"]);
            }
            else {
                this.clip_live.set('loop_end', beat);
            }
        };
        ClipDao.prototype.set_clip_endpoint_lower = function (beat) {
            if (this.deferlow) {
                this.messenger.message(["clip_endpoints", "start_marker", beat, "set"]);
            }
            else {
                this.clip_live.set('start_marker', beat);
            }
        };
        ClipDao.prototype.set_clip_endpoint_upper = function (beat) {
            if (this.deferlow) {
                this.messenger.message(["clip_endpoints", "end_marker", beat, "set"]);
            }
            else {
                this.clip_live.set('end_marker', beat);
            }
        };
        ClipDao.prototype.fire = function () {
            if (this.deferlow) {
                this.messenger.message(["clip_endpoints", "fire", "call"]);
            }
            else {
                this.clip_live.call('fire');
            }
        };
        ;
        ClipDao.prototype.stop = function () {
            if (this.deferlow) {
                this.messenger.message(["clip_endpoints", "stop", "call"]);
            }
            else {
                this.clip_live.call('stop');
            }
        };
        ;
        ClipDao.prototype.get_notes = function (beat_start, pitch_midi_min, beat_end, pitch_midi_max) {
            return this.clip_live.call('get_notes', beat_start, pitch_midi_min, beat_end, pitch_midi_max);
        };
        ;
        return ClipDao;
    }());
    clip_dao.ClipDao = ClipDao;
})(clip_dao = exports.clip_dao || (exports.clip_dao = {}));
//# sourceMappingURL=clip_dao.js.map