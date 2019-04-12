import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {live as li} from "../live/live";
import {song as module_song} from "../song/song";
import Song = module_song.Song;
import SongDao = module_song.SongDao;
import {scene} from "../scene/scene";
import Scene = scene.Scene;
import SceneIterator = scene.SceneIterator;
import SceneDao = scene.SceneDao;
const _ = require('underscore');

declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;
declare function post(message?: any): void;
declare let Dict: any;

export {}

declare let Global: any;

let env: string = 'max';

if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}

// initialize

let song = new Song(
    new SongDao(
        new li.LiveApiJs(
            'live_set'
        ),
        new Messenger(env, 0),
        false
    )
);


let num_scenes = song.get_num_scenes();

let scenes = [];

let messenger = new Messenger(env, 0);

for (let i of _.range(0, num_scenes)) {
    let path_scene = ['live_set', 'scenes', Number(i)].join(' ');
    let scene = new Scene(
        new SceneDao(
            new li.LiveApiJs(
                path_scene
            ),
            messenger
        )
    );
    scenes.push(scene)
}

let scene_iterator = new SceneIterator(scenes, true);

let scene_current: Scene;

let next = () => {
    let obj_next = scene_iterator.next();

    // let logger = new Logger(env);

    // logger.log(JSON.stringify(obj_next));

    if (obj_next.done) {
        song.stop();

        return
    }

    scene_current = obj_next.value;

    scene_current.fire(true);
};


if (typeof Global !== "undefined") {
    Global.scene_iterator = {};
    Global.scene_iterator.next = next;
}


