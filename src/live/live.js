"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var live;
(function (live) {
    var LiveApiJs = /** @class */ (function () {
        function LiveApiJs(path) {
            this.live_api = new LiveAPI(null, path);
        }
        LiveApiJs.prototype.get = function (property) {
            return this.live_api.get(property);
        };
        LiveApiJs.prototype.set = function (property, value) {
            this.live_api.set(property, value);
        };
        LiveApiJs.prototype.call = function (func) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a;
            return (_a = this.live_api).call.apply(_a, [func].concat(args));
        };
        LiveApiJs.prototype.get_id = function () {
            return this.live_api.id;
        };
        LiveApiJs.prototype.get_path = function () {
            return this.live_api.path;
        };
        LiveApiJs.prototype.get_children = function () {
            return this.live_api.children;
        };
        return LiveApiJs;
    }());
    live.LiveApiJs = LiveApiJs;
    var LiveClipVirtual = /** @class */ (function () {
        function LiveClipVirtual(notes) {
            this.notes = notes;
        }
        LiveClipVirtual.prototype.get_end_marker = function () {
            return this.notes[this.notes.length - 1].model.note.get_beat_end();
        };
        LiveClipVirtual.prototype.get_start_marker = function () {
            return this.notes[0].model.note.beat_start;
        };
        LiveClipVirtual.prototype.set_loop_bracket_lower = function (beat) {
            return;
        };
        LiveClipVirtual.prototype.set_loop_bracket_upper = function (beat) {
            return;
        };
        LiveClipVirtual.prototype.set_clip_endpoint_lower = function (beat) {
            return;
        };
        LiveClipVirtual.prototype.set_clip_endpoint_upper = function (beat) {
            return;
        };
        LiveClipVirtual.prototype.fire = function () {
            return;
        };
        LiveClipVirtual.prototype.stop = function () {
            return;
        };
        LiveClipVirtual.prototype.set_notes = function (notes) {
            for (var _i = 0, notes_1 = notes; _i < notes_1.length; _i++) {
                var note = notes_1[_i];
                this.notes.push(note);
            }
        };
        LiveClipVirtual.prototype.get_notes = function (beat_start, pitch_midi_min, beat_end, pitch_midi_max) {
            var prefix, notes, suffix;
            prefix = ["notes", this.notes.length.toString()];
            notes = [];
            for (var _i = 0, _a = this.notes; _i < _a.length; _i++) {
                var node = _a[_i];
                notes.push("note");
                notes.push(node.model.note.pitch.toString());
                notes.push(node.model.note.beat_start.toString());
                notes.push(node.model.note.beats_duration.toString());
                notes.push(node.model.note.velocity.toString());
                notes.push(node.model.note.muted.toString());
            }
            suffix = ["done"];
            return prefix.concat(notes).concat(suffix);
        };
        LiveClipVirtual.prototype.remove_notes = function (beat_start, pitch_midi_min, beat_end, pitch_midi_max) {
            return;
        };
        return LiveClipVirtual;
    }());
    live.LiveClipVirtual = LiveClipVirtual;
})(live = exports.live || (exports.live = {}));
//# sourceMappingURL=live.js.map