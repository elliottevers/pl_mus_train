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
        Exporter.prototype.set_notes = function (name_part, notes) {
            this.clips[name_part] = notes;
        };
        Exporter.prototype.unset_notes = function (name_part) {
            this.clips[name_part] = null;
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
            for (var name_part in this.clips) {
                var notes = this.clips[name_part];
                if (partnames.indexOf(name_part) !== -1) {
                    var key = [name_part, 'notes'].join('::');
                    this.dict.replace(key, "");
                    (_a = this.dict).set.apply(_a, [key].concat(Exporter.get_messages(notes)));
                }
            }
            this.dict.replace('tempo', this.tempo);
            this.dict.replace('length_beats', this.length_beats);
            this.dict.export_json(this.filepath_export);
            messenger.message(['python']);
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