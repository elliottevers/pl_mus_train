"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clip_1 = require("../clip/clip");
var messenger_1 = require("../message/messenger");
var logger_1 = require("../log/logger");
var io;
(function (io) {
    var dir_projects = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_projects/';
    io.file_json_comm = dir_projects + 'json_live.json';
    var Messenger = messenger_1.message.Messenger;
    var Logger = logger_1.log.Logger;
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
            this.name_dict = name_dict;
            this.dict = new Dict(name_dict);
        }
        Importer.import = function (name_part) {
            var dict = new Dict();
            dict.import_json(io.file_json_comm);
            return clip_1.clip.Clip.parse_note_messages(dict.get([name_part, 'notes'].join('::')));
        };
        Importer.prototype.import = function () {
            this.dict.import_json(this.filepath_import);
        };
        Importer.prototype.get_notes = function (name_part) {
            var key = [this.name_dict, name_part, 'notes'].join('::');
            var logger = new Logger('max');
            logger.log(key.toString());
            return clip_1.clip.Clip.parse_note_messages(this.dict.get(key));
        };
        return Importer;
    }());
    io.Importer = Importer;
})(io = exports.io || (exports.io = {}));
//# sourceMappingURL=io.js.map