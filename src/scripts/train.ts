import {message as m, message} from "../message/messenger";
import Messenger = message.Messenger;
import {map} from "../control/map";
import FretMapper = map.FretMapper;
import {trainer as tr} from "../train/trainer";
import Trainer = tr.Trainer;
import {freeze, thaw} from "../serialize/serialize";
import TrainThawer = thaw.TrainThawer;
import {algorithm} from "../train/algorithm";
import Detect = algorithm.Detect;
import {live as li, live} from "../live/live";
import LiveClipVirtual = live.LiveClipVirtual;
import {segment} from "../segment/segment";
import Segment = segment.Segment;
import {modes_control, modes_texture} from "../constants/constants";
import INSTRUMENTAL = modes_control.INSTRUMENTAL;
import {clip as c, clip} from "../clip/clip";
import Clip = clip.Clip;
import {user_input} from "../control/user_input";
import UserInputHandler = user_input.UserInputHandler;
import POLYPHONY = modes_texture.POLYPHONY;
import TrainFreezer = freeze.TrainFreezer;
import {window as w} from "../render/window";
import MatrixWindow = w.MatrixWindow;
import LiveApiJs = live.LiveApiJs;
import {log} from "../log/logger";
import Logger = log.Logger;
import MONOPHONY = modes_texture.MONOPHONY;
import VOCAL = modes_control.VOCAL;
import {utils} from "../utils/utils";
import path_clip_from_list_path_device = utils.path_clip_from_list_path_device;
import DETECT = algorithm.DETECT;
import PREDICT = algorithm.PREDICT;
import PARSE = algorithm.PARSE;
import DERIVE = algorithm.DERIVE;
import Predict = algorithm.Predict;
import Derive = algorithm.Derive;
import Parse = algorithm.Parse;
import FREESTYLE = algorithm.FREESTYLE;
import {song as sng} from "../song/song";
import Song = sng.Song;
import SongDao = sng.SongDao;

declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;
declare function post(message?: any): void;

export {}

declare let Global: any;

let env: string = 'max';

if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}

// let accept = (user_input, ground_truth) => {
//     messenger.message([FretMapper.get_interval(user_input ,ground_truth)])
// };
let logger = new Logger(env);
let mode_texture, mode_control, depth_tree, clip_user_input, song, algorithm_train, user_input_handler, window, messenger, clip_target, segments, trainer;

let set_mode_texture = (option) => {
    switch (option) {
        case POLYPHONY: {
            mode_texture = option;
            break;
        }
        case MONOPHONY: {
            mode_texture = option;
            break;
        }
        default: {
            post('error setting texture')
        }
    }
};

let set_mode_control = (option) => {
    switch (option) {
        case VOCAL: {
            mode_control = option;
            break;
        }
        case INSTRUMENTAL: {
            mode_control = option;
            break;
        }
        default: {
            post('error setting control')
        }
    }
};

let set_algorithm_train = (option) => {

    user_input_handler = new UserInputHandler(
        mode_texture,
        mode_control
    );

    switch (option) {
        case FREESTYLE: {
            // algorithm_train = new Freestyle(
            //     user_input_handler
            // );
            break;
        }
        case DETECT: {
            algorithm_train = new Detect(
                user_input_handler
            );
            break;
        }
        case PREDICT: {
            algorithm_train = new Predict(
                user_input_handler
            );
            break;
        }
        case PARSE: {
            algorithm_train = new Parse(
                user_input_handler
            );
            break;
        }
        case DERIVE: {
            algorithm_train = new Derive(
                user_input_handler
            );
            break;
        }
        default: {
            post('error setting algorithm')
        }
    }

    window = new MatrixWindow(
        384,
        384,
        messenger,
        algorithm_train
    );
};

let set_depth_tree = (depth) => {
    algorithm_train.set_depth(
        depth
    );
};

let set_clip_user_input = () => {
    let live_api = new li.LiveApiJs(
        'live_set view highlighted_clip_slot clip'
    );

    clip_user_input = new c.Clip(
        new c.ClipDao(
            live_api,
            new m.Messenger(env, 0),
            true,
            'clip_user_input'
        )
    );

    clip_user_input.set_path_deferlow(
        'set_path_clip_user_input'
    )
};

let set_segments = () => {
    // @ts-ignore
    let list_path_device = Array.prototype.slice.call(arguments);

    let live_api: LiveApiJs;

    live_api = new li.LiveApiJs(
        path_clip_from_list_path_device(list_path_device)
    );

    let clip = new c.Clip(
        new c.ClipDao(
            live_api,
            new m.Messenger(env, 0),
            false
        )
    );

    // TODO: how do we get beat_start, beat_end?
    let notes_segments = clip.get_notes(0, 0, 17 * 4, 128);

    // let logger = new Logger(env);

    // logger.log(JSON.stringify(notes_segments));

    let segments_local: Segment[] = [];

    for (let note of notes_segments) {
        segments_local.push(
            new Segment(
                note
            )
        )
    }

    segments = segments_local;
};

// TODO: send this via bus based on options in radio
let set_clip_target = () => {
    // @ts-ignore
    let list_path_device = Array.prototype.slice.call(arguments);

    let live_api: LiveApiJs;

    live_api = new li.LiveApiJs(
        path_clip_from_list_path_device(list_path_device)
    );

    clip_target = new c.Clip(
        new c.ClipDao(
            live_api,
            new m.Messenger(env, 0),
            false
        )
    );
};

let begin = () => {
    song = new Song(
        new SongDao(
            new li.LiveApiJs(
                'live_set',
            ),
            this.messenger,
            false
        )
    );

    trainer = new Trainer(
        window,
        user_input_handler,
        algorithm_train,
        clip_user_input,
        clip_target,
        song,
        segments,
        messenger
    );

    trainer.init()
};

let pause = () => {
    trainer.pause()
};

let resume = () => {
    trainer.resume()
};

let erase = () => {

};

let reset = () => {

};

let accept = () => {

};

let accept_input = () => {
    let notes;
    if (true) {
        // midi values
    } else {
        // signal to use user input clip
    }
    trainer.accept_input(
        notes
    );
};

let load = () => {

    // TODO: logic to determine, from project folder, name of file

    let freezer = new TrainFreezer(
        env
    );

    freezer.freeze(
        trainer,
        '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_detect.json'
    );
};

let save = () => {

    // TODO: logic to determine, from project folder, name of file

    let config = {
        'window': window,
        'user_input_handler': user_input_handler,
        'algorithm': algorithm_train,
        'clip_user_input': clip_user_input,
        'clip_target_virtual': clip_target,
        'song': song,
        'segments': segments,
        'messenger': messenger,
        'env': env
    };

    let thawer = new TrainThawer(
        env
    );

    let train_thawed = thawer.thaw(
        '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_detect.json',
        config
    );

    train_thawed.render_window(

    );
};


// 1 "task" used as
// 1 alg train 2 mode texture 3 mode control 4 clip user input (figure out if we have to highlight and click)  5 clip target (won't need to highlight) 6 segments
// 1) dependencies 2) ground truth


if (typeof Global !== "undefined") {
    Global.train = {};
    Global.train.load = load;
    Global.train.save = save;
    Global.train.begin = begin;
    Global.train.pause = pause;
    Global.train.resume = resume;
    Global.train.erase = erase;
    Global.train.reset = reset;
    Global.train.accept = accept;
    Global.train.accept_input = accept_input;
    Global.train.set_segments = set_segments;
    Global.train.set_clip_user_input = set_clip_user_input;
    Global.train.set_clip_target = set_clip_target;
    Global.train.set_depth_tree = set_depth_tree;
    Global.train.set_algorithm_train = set_algorithm_train;
    Global.train.set_mode_control = set_mode_control;
    Global.train.set_mode_texture = set_mode_texture;
}
