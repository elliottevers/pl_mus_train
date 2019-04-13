
export namespace utils {

    export let cleanse_id = (string_id): string => {
        return String(string_id).split(',').join(' ')
    };

    // accepts a path directly from the DAO object
    export let cleanse_path = (path): string => {
        // return path.replace('/"', '')
        return String(path).split(' ').map((text) => {
            return text.replace('\"', '')
        }).join(' ')
    };

    export let get_path_track_from_path_device = (path) => {
        return path.split(' ').slice(0, 3).join(' ');
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

    export let path_clip_from_list_path_device = (list_path_device) => {

        list_path_device[list_path_device.length - 2] = 'clip_slots';

        list_path_device.push('clip');

        let path_clip = list_path_device.join(' ');

        return path_clip;
    };

    export let remainder = (top, bottom) => {
        return ((top % bottom) + bottom) % bottom
    };

    export let division_int = (top, bottom) => {
        return Math.floor(top/bottom)
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
