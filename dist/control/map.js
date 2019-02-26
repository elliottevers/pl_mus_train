"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var control_1 = require("./control");
var _ = require("underscore");
var map;
(function (map) {
    var FretMapper = /** @class */ (function () {
        function FretMapper(messenger) {
            this.root = {
                6: 3
            };
            this.map_generic_interval = {
                1: 6,
                2: 6,
                3: 6,
                4: 5,
                5: 5,
                6: 5,
                7: 4,
                8: 4,
                9: 4,
                10: 3,
                11: 3,
                12: 3,
                13: 2,
                14: 2,
                15: 2,
                16: 1,
                17: 1,
                18: 1
            };
            this.strings = {
                6: _.range(control_1.control.string_to_root_note_map[6], control_1.control.string_to_root_note_map[6] + 12),
                5: _.range(control_1.control.string_to_root_note_map[5], control_1.control.string_to_root_note_map[5] + 12),
                4: _.range(control_1.control.string_to_root_note_map[4], control_1.control.string_to_root_note_map[4] + 12),
                3: _.range(control_1.control.string_to_root_note_map[3], control_1.control.string_to_root_note_map[3] + 12),
                2: _.range(control_1.control.string_to_root_note_map[2], control_1.control.string_to_root_note_map[2] + 12),
                1: _.range(control_1.control.string_to_root_note_map[1], control_1.control.string_to_root_note_map[1] + 12),
            };
            // TODO: create 'config' that generates 'root', 'map_generic_interval', 'notes_per_string'
            this.messenger = messenger;
        }
        FretMapper.prototype.play = function (note_midi) {
            var coordinate = this.map(note_midi);
            if (this.coordinate_last_played != null) {
                this.messenger.message(this.coordinate_last_played.concat([0]));
            }
            this.messenger.message(coordinate.concat([1]));
            this.coordinate_last_played = coordinate;
        };
        FretMapper.prototype.get_index_string = function (interval_generic, offset_octave) {
            var interval = interval_generic + offset_octave * 7;
            if (interval > 18) {
                return 1;
            }
            else if (interval < 1) {
                return 6;
            }
            else {
                return this.map_generic_interval[interval];
            }
        };
        FretMapper.prototype.map = function (note_midi) {
            var note_lower = this.strings[6][this.root[6]];
            var note_upper = note_midi;
            var index_string = this.get_index_string(FretMapper.get_interval_generic(FretMapper.get_interval(note_upper, note_lower)), FretMapper.get_offset_octave(note_upper, note_lower));
            var position_fret = this.strings[index_string].indexOf(note_midi);
            return [index_string, position_fret];
        };
        FretMapper.get_offset_octave = function (note_upper, note_lower) {
            var octaves = [-12, 0, 12, 24, 36];
            var interval = note_upper - note_lower;
            for (var i_octave in octaves) {
                if (interval > octaves[Number(i_octave)] && interval < octaves[Number(i_octave) + 1]) {
                    return Number(i_octave) - 1;
                }
            }
        };
        FretMapper.get_interval = function (upper, lower) {
            var diff = (upper - lower);
            return ((diff % 12) + 12) % 12;
        };
        FretMapper.get_interval_generic = function (interval) {
            switch (interval) {
                case 0: {
                    return 1;
                }
                case 1: {
                    return 2;
                }
                case 2: {
                    return 2;
                }
                case 3: {
                    return 3;
                }
                case 4: {
                    return 3;
                }
                case 5: {
                    return 4;
                }
                case 6: {
                    return 5;
                }
                case 7: {
                    return 5;
                }
                case 8: {
                    return 6;
                }
                case 9: {
                    return 6;
                }
                case 10: {
                    return 7;
                }
                case 11: {
                    return 7;
                }
            }
        };
        return FretMapper;
    }());
    map.FretMapper = FretMapper;
})(map = exports.map || (exports.map = {}));
//# sourceMappingURL=map.js.map