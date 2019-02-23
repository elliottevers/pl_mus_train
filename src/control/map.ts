import {message} from "../message/messenger";
import {control} from "./control";
const _ = require("underscore");

export namespace map {

    export class FretMapper {

        coordinate_last_played: number[];

        root = {
            6: 3
        };

        messenger;

        map_generic_interval = {
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

        strings = {
            6: _.range(control.string_to_root_note_map[6], 12),
            5: _.range(control.string_to_root_note_map[5], 12),
            4: _.range(control.string_to_root_note_map[4], 12),
            3: _.range(control.string_to_root_note_map[3], 12),
            2: _.range(control.string_to_root_note_map[2], 12),
            1: _.range(control.string_to_root_note_map[1], 12)
        };

        constructor(messenger) {
            // TODO: create 'config' that generates 'root', 'map_generic_interval', 'notes_per_string'
            this.messenger = messenger;
        }

        play(note_midi) {
            let coordinate = this.map(note_midi);
            this.messenger.message(this.coordinate_last_played.push(0));
            this.messenger.message(coordinate.push(1));
            this.coordinate_last_played = coordinate;
        }

        private get_index_string(interval_generic) {
            if (interval_generic > 18) {
                return 1
            } else if (interval_generic < 1) {
                return 6
            } else {
                return this.map_generic_interval[interval_generic]
            }
        }

        map(note_midi) {
            let index_string = this.get_index_string(
                FretMapper.get_interval_generic(
                    FretMapper.get_interval(
                        note_midi,
                        this.root[6]
                    )
                )
            );

            let position_fret = this.strings[index_string].indexOf(note_midi);

            return [index_string, position_fret]
        }

        static get_interval(lower, upper) {
            return (upper - lower) % 12
        }

        static get_interval_generic(interval) {
            switch (interval) {
                case 0: {
                    return 1
                }
                case 1: {
                    return 2
                }
                case 2: {
                    return 2
                }
                case 3: {
                    return 3
                }
                case 4: {
                    return 3
                }
                case 5: {
                    return 4
                }
                case 6: {
                    return 5
                }
                case 7: {
                    return 5
                }
                case 8: {
                    return 6
                }
                case 9: {
                    return 6
                }
                case 10: {
                    return 7
                }
                case 11: {
                    return 7
                }
            }
        }
    }
}