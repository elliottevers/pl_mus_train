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

let mode_texture, mode_control, depth_tree, clip_user_input, song, algorithm_train, user_input_handler, window, messenger, clip_target, segments, trainer;

let set_mode_texture = (option) => {
    // let mode_texture = POLYPHONY;
    mode_texture = option;

};

let set_mode_control = (option) => {
    // let mode_control = INSTRUMENTAL;
    mode_control = option;
};

let set_algorithm_train = () => {
    algorithm_train = new Detect(
        user_input_handler
    );

    window = new MatrixWindow(
        384,
        384,
        messenger,
        algorithm_train
    );
};

let set_depth_tree = (depth) => {
    depth_tree = depth
};

// let set_song = () => {
//     // let song = {
//     //     set_overdub: (int) => {},
//     //     set_session_record: (int) => {}
//     // };
//     // TODO:
// };

let set_clip_user_input = () => {
    // let clip_user_input = {
    //     fire: () => {},
    //     stop: () => {},
    //     set_endpoints_loop: (former, latter) => {}
    // };
    clip_user_input = new li.LiveApiJs(
        'live_set view highlighted_clip_slot clip'
    );
};

let set_segments = (path) => {
    let live_api: LiveApiJs;

    live_api = new li.LiveApiJs(
        path
    );

    let clip = new c.Clip(
        new c.ClipDao(
            live_api,
            new m.Messenger(env, 0),
            false
        )
    );

    // TODO: how do we get beat_start, beat_end?
    let notes_segments = clip.get_notes(0, 0, 8, 128);

    let segments: Segment[] = [];

    for (let note of notes_segments) {
        segments.push(
            new Segment(
                note
            )
        )
    }
};

// TODO: send this via bus based on options in radio
let set_clip_target = (path) => {
    // let clip_dao_virtual = new LiveClipVirtual(notes_target_clip);
    //
    // let clip_target_virtual = new Clip(clip_dao_virtual);
    let live_api: LiveApiJs;

    live_api = new li.LiveApiJs(
        path
    );

    let clip_target = new c.Clip(
        new c.ClipDao(
            live_api,
            new m.Messenger(env, 0),
            false
        )
    );
};

let begin = () => {
    // let clip_highlighted = new li.LiveApiJs(
    //     'live_set view highlighted_clip_slot clip'
    // );
    //
    // exporter.set_length(
    //     clip_highlighted.get("length")
    // );

    song = new li.LiveApiJs(
        'live_set'
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
