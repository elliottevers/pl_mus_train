"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("underscore");
var control;
(function (control) {
    var string_to_root_note_map = {
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
                strings[num_strings - Number(i)] = new control.String(string_to_root_note_map[num_strings - Number(i)], messenger);
                // strings.push(new control.String(string_to_root_note_map[num_strings - Number(i)], messenger))
            };
            _.times(num_strings, create_string);
            this.strings = strings;
            this.num_frets = num_frets;
        }
        // get_coordinate_duple(coordinate_scalar: number) {
        //     let position_string = Math.floor(coordinate_scalar/ this.num_frets);
        //     let position_fret = coordinate_scalar % this.num_frets;
        //     return [position_string + 1, position_fret]
        // }
        // fret(coordinate_duple: number[]) {
        //     // string, position fret
        //     let string_fretted = this.strings[coordinate_duple[0]];
        //     string_fretted.fret(coordinate_duple[1]);
        // }
        Fretboard.prototype.fret = function (position_string, position_fret) {
            // string, position fret
            // post(position_string - 1);
            // log.Logger.log_max_static(this.strings);
            // let string_fretted = this.strings[(position_string - 1).toString()];
            var string_fretted = this.strings[position_string];
            string_fretted.fret(position_fret);
        };
        Fretboard.prototype.dampen = function (position_string) {
            // for (string of this.strings) {
            //     string.dampen()
            // }
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
            this.note_root = note_root;
            this.messenger = messenger;
            // this.fret_fretted = null;
            this.fret_highest_fretted = 0;
        }
        // is_sounding(): boolean {
        //     return this.note_sounding === null;
        // }
        // TODO: don't make this an argument
        String.prototype.dampen = function (position_string) {
            // this.messenger.message([this.note_sounding, 0]);
            // this.note_sounding = null;
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
            return this.get_note(this.fret_highest_fretted);
        };
        // fret(position_fret: number) {
        //     if (this.fret_fretted === null || this.fret_fretted < position_fret) {
        //         this.fret_fretted = position_fret;
        //     }
        // }
        String.prototype.fret = function (position_fret) {
            this.fret_highest_fretted = position_fret;
        };
        return String;
    }());
    control.String = String;
})(control = exports.control || (exports.control = {}));
//# sourceMappingURL=control.js.map