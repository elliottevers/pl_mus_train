"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var note_1 = require("../note/note");
var TreeModel = require("tree-model");
var _ = require('underscore');
var harmony;
(function (harmony) {
    var Harmony = /** @class */ (function () {
        function Harmony() {
        }
        Harmony.group = function (notes) {
            //     groups_notes = []
            //     unique_onsets_beats = []
            //
            //     def get_beat_start(note):
            //     return note.beat_start
            //
            //     for beat_start, group_note in groupby(notes_live, get_beat_start):
            //     groups_notes.append(list(group_note))
            //     unique_onsets_beats.append(beat_start)
            //
            //     chords = []
            //
            //     for group in groups_notes:
            //
            //     chord = music21.chord.Chord([
            //         music21.note.Note(
            //             pitch=music21.pitch.Pitch(
            //                 midi=note_live.pitch
            //             )
            //         ).name for
            //         note_live
            //         in group
            // ])
            //
            // # TODO: this makes the assumption that all notes in the group have the same offsets and duration
            //
            //     chord.offset = group[-1].beat_start
            //     chord.duration = music21.duration.Duration(group[-1].beats_duration)
            //     chords.append(chord)
            //
            //     return chords
            return;
        };
        Harmony.monophonify = function (notes) {
            function compare(note_former, note_latter) {
                if (note_former.model.note.beat_start < note_latter.model.note.beat_start)
                    return -1;
                if (note_former.model.note.beat_start > note_latter.model.note.beat_start)
                    return 1;
                return 0;
            }
            notes.sort(compare);
            var length_beats = notes[notes.length - 1].model.note.get_beat_end() - notes[0].model.note.beat_start;
            var duration_monophonic = length_beats / notes.length;
            var beat_current = notes[0].model.note.beat_start;
            var notes_monophonic = [];
            var tree = new TreeModel();
            for (var _i = 0, notes_1 = notes; _i < notes_1.length; _i++) {
                var note = notes_1[_i];
                notes_monophonic.push(tree.parse({
                    id: -1,
                    note: new note_1.note.Note(note.model.note.pitch, beat_current, duration_monophonic, note.model.note.velocity, note.model.note.muted),
                    children: []
                }));
                beat_current = beat_current + duration_monophonic;
            }
            return notes_monophonic;
        };
        return Harmony;
    }());
    harmony.Harmony = Harmony;
})(harmony = exports.harmony || (exports.harmony = {}));
//# sourceMappingURL=harmony.js.map