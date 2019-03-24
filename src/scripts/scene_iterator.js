"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("../live/live");
var logger_1 = require("../log/logger");
var Logger = logger_1.log.Logger;
var song_1 = require("../song/song");
var Song = song_1.song.Song;
var SongDao = song_1.song.SongDao;
var scene_1 = require("../scene/scene");
var Scene = scene_1.scene.Scene;
var SceneIterator = scene_1.scene.SceneIterator;
var SceneDao = scene_1.scene.SceneDao;
// import {Segment} from "../segment/segment";
var _ = require('underscore');
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
// initialize
var song = new Song(new SongDao(new live_1.live.LiveApiJs('live_set'), new Messenger(env, 0), false));
var num_scenes = song.get_num_scenes();
var scenes = [];
var messenger = new Messenger(env, 0);
for (var _i = 0, _a = _.range(0, num_scenes); _i < _a.length; _i++) {
    var i = _a[_i];
    var path_scene = ['live_set', 'scenes', Number(i)].join(' ');
    var scene_2 = new Scene(new SceneDao(new live_1.live.LiveApiJs(path_scene), messenger));
    scenes.push(scene_2);
}
var scene_iterator = new SceneIterator(scenes, true);
var scene_current;
var next = function () {
    var obj_next = scene_iterator.next();
    var logger = new Logger(env);
    logger.log(JSON.stringify(obj_next));
    if (obj_next.done) {
        song.stop();
        return;
    }
    scene_current = obj_next.value;
    scene_current.fire(true);
};
if (typeof Global !== "undefined") {
    Global.scene_iterator = {};
    Global.scene_iterator.next = next;
}
//# sourceMappingURL=scene_iterator.js.map