"use strict";
// autowatch = 1;
Object.defineProperty(exports, "__esModule", { value: true });
// var l = require('./logger.js');
// var n = require('./note.js');
// var tr = require('./tree.js');
// var cd = require('./clip_dao.js');
var note_1 = require("../note/note");
var TreeModel = require("tree-model");
var clip;
(function (clip) {
    // TODO: custom type
    var Note = note_1.note.Note;
    var Clip = /** @class */ (function () {
        function Clip(clip_dao) {
            this.clip_dao = clip_dao;
        }
        Clip.prototype.get_num_measures = function () {
            return this.get_end_marker() / 4;
        };
        Clip.prototype.get_end_marker = function () {
            return this.clip_dao.get_end_marker();
        };
        // TODO: annotations
        Clip.prototype.load_notes = function () {
            this.notes = this.get_notes(0, 0, 16, 128);
        };
        // TODO: annotations
        Clip.prototype.get_pitch_max = function () {
            var pitch_max = 0;
            for (var note_2 in this.notes) {
                if (note_2.data.pitch > pitch_max) {
                    pitch_max = note_2.data.pitch;
                }
            }
            return pitch_max;
        };
        // TODO: annotations
        Clip.prototype.get_pitch_min = function () {
            var pitch_min = 128;
            for (var note_3 in this.notes) {
                if (note_3.data.pitch < pitch_min) {
                    pitch_min = note_3.data.pitch;
                }
            }
            return pitch_min;
        };
        Clip.prototype.get_ambitus = function () {
            return [this.get_pitch_min(), this.get_pitch_max()];
        };
        Clip.prototype.set_loop_bracket_lower = function (beat) {
            this.clip_dao.set_loop_bracket_lower(beat);
        };
        Clip.prototype.set_loop_bracket_upper = function (beat) {
            this.clip_dao.set_loop_bracket_upper(beat);
        };
        Clip.prototype.set_clip_endpoint_lower = function (beat) {
            this.clip_dao.set_clip_endpoint_lower(beat);
        };
        Clip.prototype.set_clip_endpoint_upper = function (beat) {
            this.clip_dao.set_clip_endpoint_upper(beat);
        };
        Clip.prototype.fire = function () {
            this.clip_dao.fire();
        };
        Clip.prototype.stop = function () {
            this.clip_dao.stop();
        };
        // TODO: return list of tree nodes
        Clip.prototype.get_notes = function () {
            if (this.notes === null) {
                var beat_start = void 0, pitch_midi_min = void 0, beat_end = void 0, pitch_midi_max = void 0;
                beat_start = 0;
                beat_end = this.get_end_marker();
                pitch_midi_min = 0;
                pitch_midi_max = 128;
                return this._parse_notes(this._get_notes(beat_start, pitch_midi_min, beat_end, pitch_midi_max));
            }
            else {
                return this.notes;
            }
        };
        Clip.prototype._get_notes = function (beat_start, pitch_midi_min, beat_end, pitch_midi_max) {
            return this.clip_dao.get_notes(beat_start, pitch_midi_min, beat_end, pitch_midi_max);
        };
        // TODO: return list of tree nodes
        Clip.prototype._parse_notes = function (notes) {
            var data = [];
            var notes_parsed = [];
            var pitch;
            var beat_start;
            var beats_duration;
            var velocity;
            var b_muted;
            var index_num_expected_notes = null;
            for (var i = 0; i < notes.length; i++) {
                if (notes[i] === 'done') {
                    continue;
                }
                if (notes[i] === 'note') {
                    data = [];
                    continue;
                }
                if (notes[i] === 'notes') {
                    data = [];
                    continue;
                }
                if (i === index_num_expected_notes) {
                    data = [];
                    continue;
                }
                data.push(notes[i]);
                if (data.length === 5) {
                    pitch = data[0];
                    beat_start = data[1];
                    beats_duration = data[2];
                    velocity = data[3];
                    b_muted = data[4];
                    var tree = new TreeModel();
                    // let model: any = {
                    //     id: new Note(
                    //         pitch,
                    //         beat_start,
                    //         beats_duration,
                    //         velocity,
                    //         b_muted
                    //     ),
                    //     children: [
                    //
                    //     ]
                    // };
                    notes_parsed.push(
                    // new tr.Tree(
                    //     null,
                    //     new n.Note(
                    //         pitch,
                    //         beat_start,
                    //         beats_duration,
                    //         velocity,
                    //         b_muted
                    //     )
                    // )
                    // tree.parse(model)
                    tree.parse({
                        id: new Note(pitch, beat_start, beats_duration, velocity, b_muted),
                        children: []
                    }));
                }
            }
            function compare(note_former, note_latter) {
                // l.log(note_former.data);
                if (note_former.data.beat_start < note_latter.data.beat_start)
                    return -1;
                if (note_former.data.beat_start > note_latter.data.beat_start)
                    return 1;
                return 0;
            }
            notes_parsed.sort(compare);
            // TODO: fail gracefully
            // if (notes_parsed.length !== num_expected_notes) {
            //     throw "notes retrieved from clip less than expected"
            // }
            // l.log(notes_parsed);
            return notes_parsed;
        };
        return Clip;
    }());
    clip.Clip = Clip;
})(clip = exports.clip || (exports.clip = {}));
//# sourceMappingURL=clip.js.map