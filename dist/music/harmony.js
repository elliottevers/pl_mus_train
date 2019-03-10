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
            // TODO: should probably factor in beat end as well, but this works for now
            var grouped = _.groupBy(notes, function (note) {
                return note.model.note.beat_start;
            });
            var notes_grouped = [];
            for (var beat_start in grouped) {
                notes_grouped.push(grouped[beat_start]);
            }
            return notes_grouped;
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