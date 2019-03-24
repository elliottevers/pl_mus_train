import {live} from "../live/live";
import {clip} from "../clip/clip";
import {track} from "../track/track";

export namespace utils {

    import Clip = clip.Clip;
    import Track = track.Track;

    export let cleanse_path = (path) => {
        return path.replace('/"', '')
    };

    export let get_clip_on_this_device_at_index = (index: number): Clip => {
        // TODO: implement
        return
    };

    export let get_path_this_track = () => {
        // @ts-ignore
        import LiveApiJs = live.LiveApiJs;

        let this_device = new LiveApiJs('this_device');

        let path_this_device = this_device.get_path();

        return path_this_device.split(' ').slice(0, 3).join(' ');
    };

    export let get_this_track = (): Track => {
        // TODO: use the method above
        return
    };

    export class PathLive  {

        // pre-sending message
        public static to_vector(path_live: string) {
            let message = [];

            for (let word of path_live.split(' ')) {
                let cleansed = word.replace(/"/g, "");

                if (isNaN(Number(cleansed))) {
                    message.push(cleansed)
                } else {
                    message.push(Number(cleansed))
                }
            }

            return message
        }

        public static to_message(path_live: string) {
            return PathLive.to_vector(path_live)
        }

        // parsing sent message
        public static to_string(vector_path_live: string[]) {
            return PathLive.to_message(vector_path_live.join(' ')).join(' ');
        }
    }

    export let remainder = (top, bottom) => {
        return ((top % bottom) + bottom) % bottom
    };

    export let division_int = (top, bottom) => {
        return Math.floor(top/bottom)
    };

    export let path_clip_from_list_path_device = (list_path_device) => {
        // list_path_device.shift();

        list_path_device[list_path_device.length - 2] = 'clip_slots';

        list_path_device.push('clip');

        let path_clip = list_path_device.join(' ');

        return path_clip;
    };

    export class Set {
        _data;

        constructor(items) {
            this._data = {};
            this.addItems(items);
        }

        addItem = function(value) {
            this._data[value] = true;
            return this;
        };

        removeItem = function(value) {
            delete this._data[value];
            return this;
        };

        addItems = function(values) {
            for (var i = 0; i < values.length; i++) {
                this.addItem(values[i]);
            }
            return this;
        };

        removeItems = function(values) {
            for (var i = 0; i < values.length; i++) {
                this.removeItem(values[i]);
            }
            return this;
        };

        contains = function(value) {
            return !!this._data[value];
        };

        reset = function() {
            this._data = {};
            return this;
        };

        data = function() {
            return Object.keys(this._data);
        };

        each = function(callback) {
            var data = this.data();
            for (var i = 0; i < data.length; i++) {
                callback(data[i]);
            }
        }
    }
}
