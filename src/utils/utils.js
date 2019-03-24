"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils;
(function (utils) {
    // import LiveApiJs = live.LiveApiJs;
    var FactoryLive = /** @class */ (function () {
        function FactoryLive() {
        }
        FactoryLive.get_clip_slot = function (id_clip_slot) {
            // @ts-ignore
            // import LiveApiJs = live.LiveApiJs;
            // return new ClipSlot(
            //     new ClipSlotDao(
            //         new LiveApiJs(
            //             id_clip_slot
            //         ),
            //         new Messenger('max', 0)
            //     )
            // )
            return;
        };
        FactoryLive.get_clip_at_index = function (index_track, index_clip_slot, messenger) {
            // @ts-ignore
            // import LiveApiJs = live.LiveApiJs;
            // return new Clip(
            //     new ClipDao(
            //         new LiveApiJs(
            //             ['live_set', 'tracks', String(index_track), 'clips', String(index_clip_slot), 'clip'].join(' ')
            //         ),
            //         messenger
            //     )
            // );
            return;
        };
        FactoryLive.get_clip_slot_at_index = function (index_track, index_clip_slot, messenger) {
            // @ts-ignore
            // import LiveApiJs = live.LiveApiJs;
            // return new ClipSlot(
            //     new ClipSlotDao(
            //         new LiveApiJs(
            //             ['live_set', 'tracks', String(index_track), 'clips', String(index_clip_slot)].join(' ')
            //         ),
            //         messenger
            //     )
            // );
            return;
        };
        FactoryLive.clip_from_path = function (path, messenger) {
            // @ts-ignore
            // import LiveApiJs = live.LiveApiJs;
            // return new Clip(
            //     new ClipDao(
            //         new LiveApiJs(
            //             path
            //         ),
            //         messenger
            //     )
            // )
            return;
        };
        return FactoryLive;
    }());
    utils.FactoryLive = FactoryLive;
    utils.cleanse_path = function (path) {
        return path.replace('/"', '');
    };
    //
    // export let get_clip_on_this_device_at_index = (index: number): Clip => {
    //     // TODO: implement
    //     return
    // };
    utils.get_path_this_track = function () {
        // @ts-ignore
        // import LiveApiJs = live.LiveApiJs;
        // let this_device = new LiveApiJs('this_device');
        //
        // let path_this_device = this_device.get_path();
        //
        // return path_this_device.split(' ').slice(0, 3).join(' ');
        //
        return;
    };
    utils.get_this_track = function () {
        // @ts-ignore
        // import LiveApiJs = live.LiveApiJs;
        // let this_device = new LiveApiJs('this_device');
        //
        // return new Track(
        //     new TrackDao(
        //         new LiveApiJs(
        //             ['id', String(this_device.get_id())].join(' ')
        //         ),
        //         new Messenger('max', 0)  // this only works in Max anyway...
        //     )
        // )
        return;
    };
    var PathLive = /** @class */ (function () {
        function PathLive() {
        }
        // pre-sending message
        PathLive.to_vector = function (path_live) {
            var message = [];
            for (var _i = 0, _a = path_live.split(' '); _i < _a.length; _i++) {
                var word = _a[_i];
                var cleansed = word.replace(/"/g, "");
                if (isNaN(Number(cleansed))) {
                    message.push(cleansed);
                }
                else {
                    message.push(Number(cleansed));
                }
            }
            return message;
        };
        PathLive.to_message = function (path_live) {
            return PathLive.to_vector(path_live);
        };
        // parsing sent message
        PathLive.to_string = function (vector_path_live) {
            return PathLive.to_message(vector_path_live.join(' ')).join(' ');
        };
        return PathLive;
    }());
    utils.PathLive = PathLive;
    utils.remainder = function (top, bottom) {
        return ((top % bottom) + bottom) % bottom;
    };
    utils.division_int = function (top, bottom) {
        return Math.floor(top / bottom);
    };
    utils.path_clip_from_list_path_device = function (list_path_device) {
        // list_path_device.shift();
        list_path_device[list_path_device.length - 2] = 'clip_slots';
        list_path_device.push('clip');
        var path_clip = list_path_device.join(' ');
        return path_clip;
    };
    var Set = /** @class */ (function () {
        function Set(items) {
            this.addItem = function (value) {
                this._data[value] = true;
                return this;
            };
            this.removeItem = function (value) {
                delete this._data[value];
                return this;
            };
            this.addItems = function (values) {
                for (var i = 0; i < values.length; i++) {
                    this.addItem(values[i]);
                }
                return this;
            };
            this.removeItems = function (values) {
                for (var i = 0; i < values.length; i++) {
                    this.removeItem(values[i]);
                }
                return this;
            };
            this.contains = function (value) {
                return !!this._data[value];
            };
            this.reset = function () {
                this._data = {};
                return this;
            };
            this.data = function () {
                return Object.keys(this._data);
            };
            this.each = function (callback) {
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    callback(data[i]);
                }
            };
            this._data = {};
            this.addItems(items);
        }
        return Set;
    }());
    utils.Set = Set;
})(utils = exports.utils || (exports.utils = {}));
//# sourceMappingURL=utils.js.map