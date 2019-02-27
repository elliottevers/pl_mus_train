"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("underscore");
var control;
(function (control) {
    control.string_to_root_note_map = {
        6: 40,
        5: 45,
        4: 50,
        3: 55,
        2: 59,
        1: 64
    };
    var Fretboard = /** @class */ (function () {
        function Fretboard(num_strings, num_frets, messenger) {
            var strings = {};
            var create_string = function (i) {
                strings[num_strings - Number(i)] = new control.String(control.string_to_root_note_map[num_strings - Number(i)], messenger);
            };
            _.times(num_strings, create_string);
            this.strings = strings;
            this.num_frets = num_frets;
        }
        Fretboard.prototype.fret = function (position_string, position_fret, status) {
            var string_fretted = this.strings[position_string];
            string_fretted.fret(position_fret, status);
        };
        Fretboard.prototype.dampen = function (position_string) {
            this.strings[position_string].dampen(position_string);
        };
        Fretboard.prototype.pluck = function (position_string) {
            this.strings[position_string].pluck(position_string);
        };
        return Fretboard;
    }());
    control.Fretboard = Fretboard;
    var String = /** @class */ (function () {
        function String(note_root, messenger) {
            this.frets = [false, false, false, false, false, false, false, false, false, false, false, false];
            this.note_root = note_root;
            this.messenger = messenger;
        }
        // TODO: don't make this an argument
        String.prototype.dampen = function (position_string) {
            // TODO: will have to flush on a per string basis
            this.messenger.message(['string' + position_string, 'dampen', position_string]);
        };
        String.prototype.get_note = function (position_fret) {
            return this.note_root + position_fret;
        };
        String.prototype.pluck = function (position_string) {
            this.messenger.message(['string' + position_string, 'pluck', this.will_sound_note(), 127]);
        };
        String.prototype.will_sound_note = function () {
            return this.get_note(this.get_fret_max());
        };
        String.prototype.get_fret_max = function () {
            var open = true;
            var fretted = [];
            var b_fretted;
            for (var i_fret in this.frets) {
                b_fretted = this.frets[i_fret];
                if (open && b_fretted) {
                    open = false;
                }
                if (b_fretted) {
                    fretted.push(Number(i_fret));
                }
            }
            if (open) {
                return 0;
            }
            else {
                return Math.max.apply(Math, fretted);
            }
        };
        String.prototype.fret = function (position_fret, status) {
            this.frets[position_fret] = status;
        };
        return String;
    }());
    control.String = String;
})(control = exports.control || (exports.control = {}));
//# sourceMappingURL=control.js.map