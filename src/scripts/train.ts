import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {map} from "../control/map";
import FretMapper = map.FretMapper;
import {trainer} from "../train/trainer";
import Trainer = trainer.Trainer;
import {freeze, thaw} from "../serialize/serialize";
import TrainThawer = thaw.TrainThawer;
import {algorithm} from "../train/algorithm";
import Detect = algorithm.Detect;
import {live} from "../live/live";
import LiveClipVirtual = live.LiveClipVirtual;
import {segment} from "../segment/segment";
import Segment = segment.Segment;
import {modes_control, modes_texture} from "../constants/constants";
import INSTRUMENTAL = modes_control.INSTRUMENTAL;
import {clip} from "../clip/clip";
import Clip = clip.Clip;
import {user_input} from "../control/user_input";
import UserInputHandler = user_input.UserInputHandler;
import POLYPHONY = modes_texture.POLYPHONY;
import TrainFreezer = freeze.TrainFreezer;
import {window} from "../render/window";
import MatrixWindow = window.MatrixWindow;

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


let test = () => {

};

let accept = (user_input, ground_truth) => {
    messenger.message([FretMapper.get_interval(user_input ,ground_truth)])
};

// test();

if (typeof Global !== "undefined") {
    Global.compute_feedback = {};
    Global.compute_feedback.accept = accept;
}



let set_mode_texture = () => {
    let mode_texture = POLYPHONY;
};

let set_mode_control = () => {
    let mode_control = INSTRUMENTAL;
};

let set_algorithm_train = () => {
    let algorithm_train = new Detect(
        user_input_handler
    );

    let window_local = new MatrixWindow(
        384,
        384,
        messenger,
        algorithm_train
    );
};

let set_song = () => {
    let song = {
        set_overdub: (int) => {},
        set_session_record: (int) => {}
    };
}

let set_clip_user_input = () => {
    let clip_user_input = {
        fire: () => {},
        stop: () => {},
        set_endpoints_loop: (former, latter) => {}
    };
};

let set_segments = () => {
    let segments: Segment[] = [];

    for (let note of notes_segments) {
        segments.push(
            new Segment(
                note
            )
        )
    }
};

let set_clip_target = () => {
    let clip_dao_virtual = new LiveClipVirtual(notes_target_clip);

    let clip_target_virtual = new Clip(clip_dao_virtual);
};

let begin = () => {
    trainer = new Trainer(
        window_local,
        user_input_handler,
        algorithm_train,
        clip_user_input,
        clip_target_virtual,
        song,
        segments,
        messenger
    );

    trainer.init()
};

let accept_input = () => {
    trainer_local.accept_input(
        [note_target_1_subtarget_1]
    );
};

// 1 "task" used as
// 1 alg train 2 mode texture 3 mode control 4 clip user input (figure out if we have to highlight and click)  5 clip target (won't need to highlight) 6 segments
// 1) dependencies 2) ground truth

let load_session = () => {

    let config = {
        'window': window,
        'user_input_handler': user_input_handler,
        'algorithm': algorithm_train,
        'clip_user_input': clip_user_input,
        'clip_target_virtual': clip_target_virtual,
        'song': song,
        'segments': segments,
        'messenger': messenger,
        'env': env
    };

    let freezer = new TrainFreezer(
        env
    );

    freezer.freeze(
        trainer_local,
        '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_detect.json'
    );
};

let save_session = () => {

    let config = {
        'window': window_local,
        'user_input_handler': user_input_handler,
        'algorithm': algorithm_train,
        'clip_user_input': clip_user_input,
        'clip_target_virtual': clip_target_virtual,
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






// let messenger: Messenger = new Messenger(env, 0);
//
// let mode_texture = POLYPHONY;
// let mode_control = INSTRUMENTAL;
//
// let user_input_handler = new UserInputHandler(
//     mode_texture,
//     mode_control
// );

// let env: string = 'node_for_max';
// env = 'node';


// let messenger = new Messenger(env, 0, 'render_detect');

// let algorithm_train = new Detect(
//     user_input_handler
// );

// let window_local = new MatrixWindow(
//     384,
//     384,
//     messenger,
//     algorithm_train
// );

// stubs
// let song = {
//     set_overdub: (int) => {},
//     set_session_record: (int) => {}
// };

// let clip_user_input = {
//     fire: () => {},
//     stop: () => {},
//     set_endpoints_loop: (former, latter) => {}
// };

// let notes_segments = [
//     segment_note_1,
//     segment_note_2
// ];
//
// let notes_target_clip = [
//     note_target_1_subtarget_1,
//     note_target_1_subtarget_2,
//     note_target_2_subtarget_1,
//     note_target_2_subtarget_2,
//     note_target_3_subtarget_1,
//     note_target_3_subtarget_2,
//     note_target_4_subtarget_1,
//     note_target_4_subtarget_2
// ];

// let segments: Segment[] = [];
//
// for (let note of notes_segments) {
//     segments.push(
//         new Segment(
//             note
//         )
//     )
// }

// let clip_dao_virtual = new LiveClipVirtual(notes_target_clip);
//
// let clip_target_virtual = new Clip(clip_dao_virtual);

// let trainer_local = new Trainer(
//     window_local,
//     user_input_handler,
//     algorithm_train,
//     clip_user_input,
//     clip_target_virtual,
//     song,
//     segments,
//     messenger
// );

// test case - 2 segments, 2 notes a piece

// trainer_local.init(
//
// );
//
// trainer_local.accept_input(
//     [note_target_1_subtarget_1]
// );
//
// trainer_local.accept_input(
//     [note_target_1_subtarget_2]
// );
//
// trainer_local.accept_input(
//     [note_target_2_subtarget_1]
// );
//
// trainer_local.accept_input(
//     [note_target_2_subtarget_2]
// );
//
// trainer_local.accept_input(
//     [note_target_3_subtarget_1]
// );

// trainer_local.render_window(
//
// );

// trainer_local.clear_window(
//
// );

// let freezer = new TrainFreezer(
//     env
// );
//
// freezer.freeze(
//     trainer_local,
//     '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_detect.json'
// );
//
// let thawer = new TrainThawer(
//     env
// );

// let config = {
//     'window': window_local,
//     'user_input_handler': user_input_handler,
//     'algorithm': algorithm_train,
//     'clip_user_input': clip_user_input,
//     'clip_target_virtual': clip_target_virtual,
//     'song': song,
//     'segments': segments,
//     'messenger': messenger,
//     'env': env
// };

// let train_thawed = thawer.thaw(
//     '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_ts/cache/train_detect.json',
//     config
// );
//
// train_thawed.render_window(
//
// );