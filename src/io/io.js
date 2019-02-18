"use strict";
// let exporter = new io.Exporter(
//     filepath='slkdfjlsdkfjldkf'
// );
//
// exporter.setNotes(
//     notes=notes,
//     name_part='melody'
// );
//
// exporter.setNotes(
//     notes=notes,
//     name_part='chords'
// );
//
// exporter.setNotes(
//     notes=notes,
//     name_part='bass'
// );
//
// exporter.setTempo(
//     bpm=bpm
// );
//
// exporter.setLengthTrack(
//     beats=beats
// );
Object.defineProperty(exports, "__esModule", { value: true });
// import {note as n} from "../note/note";
// import TreeModel = require("tree-model");
// import {live} from "../live/live";
// import {message} from "../message/messenger";
var clip_1 = require("../clip/clip");
var io;
(function (io) {
    var Exporter = /** @class */ (function () {
        function Exporter(filepath_export, name_dict) {
            this.filepath_export = filepath_export;
            this.dict = new Dict(name_dict);
        }
        Exporter.prototype.set_notes = function (id_clip, notes, name_part) {
            var clip = {};
            clip['notes'] = notes;
            clip['part'] = name_part;
            this.clips[id_clip] = clip;
        };
        Exporter.prototype.unset_notes = function (id_clip, name_part) {
            this.clips[id_clip] = null;
        };
        Exporter.prototype.set_tempo = function (bpm) {
            this.tempo = bpm;
        };
        Exporter.prototype.set_length = function (beats) {
            this.length_beats = beats;
        };
        Exporter.get_messages = function (notes) {
            var messages = [];
            messages.push(['notes', notes.length.toString()].join(' '));
            for (var i_note in notes) {
                messages.push(notes[i_note].model.note.encode());
            }
            messages.push(['notes', 'done'].join(' '));
            return messages;
        };
        Exporter.prototype.export_clips = function (partnames) {
            var _a;
            for (var id_clip in this.clips) {
                var clip = this.clips[id_clip];
                var name_part = clip['part'];
                if (partnames.indexOf(name_part) !== -1) {
                    var key = [name_part, 'notes'].join('::');
                    this.dict.replace("melody::notes", "");
                    (_a = this.dict).set.apply(_a, [key].concat(Exporter.get_messages(clip['notes'])));
                    // TODO: tempo
                    // TODO: length of song in beats
                }
            }
        };
        return Exporter;
    }());
    io.Exporter = Exporter;
    var Importer = /** @class */ (function () {
        function Importer(filepath_import, name_dict) {
            this.filepath_import = filepath_import;
            this.dict = new Dict(name_dict);
        }
        Importer.prototype.import = function () {
            this.dict.import_json(this.filepath_import);
        };
        Importer.prototype.get_notes = function (name_part) {
            var key = [name_part, 'notes'].join('::');
            return clip_1.clip.Clip.parse_note_messages(this.dict.get(key));
        };
        return Importer;
    }());
    io.Importer = Importer;
})(io = exports.io || (exports.io = {}));
//# sourceMappingURL=io.js.map