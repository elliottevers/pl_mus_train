"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clip_1 = require("../clip/clip");
var messenger_1 = require("../message/messenger");
var io;
(function (io) {
    var Messenger = messenger_1.message.Messenger;
    var Exporter = /** @class */ (function () {
        function Exporter(filepath_export, name_dict) {
            this.filepath_export = filepath_export;
            this.dict = new Dict(name_dict);
            this.clips = {};
        }
        Exporter.prototype.set_notes = function (id_clip, notes, name_part) {
            var clip = {};
            clip['notes'] = notes;
            clip['part'] = name_part;
            this.clips[id_clip] = clip;
        };
        Exporter.prototype.unset_notes = function (id_clip) {
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
            var messenger = new Messenger('max', 0);
            // messenger.message([this.clips.toString()]);
            for (var id_clip in this.clips) {
                var clip = this.clips[id_clip];
                var name_part = clip['part'];
                if (partnames.indexOf(name_part) !== -1) {
                    var key = [name_part, 'notes'].join('::');
                    this.dict.replace(key, "");
                    // messenger.message(Exporter.get_messages(clip['notes']));
                    (_a = this.dict).set.apply(_a, [key].concat(Exporter.get_messages(clip['notes'])));
                    // TODO: tempo
                    // TODO: length of song in beats
                }
            }
            this.dict.replace('tempo', this.tempo);
            // TODO: get the max of the lengths of each of the clips
            this.dict.replace('length_beats', this.length_beats);
            // this.dict.set(key, ...Exporter.get_messages(clip['notes']));
            this.dict.export_json(this.filepath_export);
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