import TreeModel = require("tree-model");

declare let Global: any;
// TODO: make dedicated library object for the following
declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;

import {clip as c} from "./clip/clip";
import {message as m} from "./message/messenger";
import {log} from "./log/logger";
import {live, live as li} from "./live/live"
import {note as n} from "./note/note"
import LiveApiJs = live.LiveApiJs;
import {window as w} from "./render/window"
import {song as s} from "./song/song";
// import Song = song.Song;
// const sinon = require("sinon");

let bound_lower, bound_upper;


// let env: string = process.argv[2];
// TODO: handle better - if set to max, can't run in node, but can compile TypeScript to max object
// if we switch from node execution to max execution, will max have stopped watching?
let env: string = 'max';

if (env === 'max') {
    autowatch = 1;
}

let live_api_user_input: LiveApiJs;
let live_api_to_elaborate: LiveApiJs;
let live_api_elaboration: LiveApiJs;
let clip_user_input: c.Clip;
let clip_to_elaborate: c.Clip;
let clip_elaboration: c.Clip;
let pwindow: w.Pwindow;
let elaboration: TreeModel.Node<n.Note>[];

// let index_track = 18;
// let index_clip_slot = 0;
//
// let path = "live_set tracks " + index_track + " clip_slots " + index_clip_slot + " clip";
//
// live_api_user_input = new li.LiveApiJs(index_track_user_input, index_clip_slot_user_input);

let song_dao = new s.SongDao(
    new li.LiveApiJs("live_set"),
    new m.Messenger(env, 0),
    false
);

let song: s.Song = new s.Song(song_dao);

let boundary_change_record_interval = (int) => {
    song.set_session_record(int);
};

let test = () => {
    post('test');
    post('\n');
};

let set_bound_upper = (beat) => {
    bound_upper = Number(beat);
};

let set_bound_lower = (beat) => {
    bound_lower = Number(beat);
};

let confirm = () => {
    elaboration = clip_user_input.get_notes(bound_lower, 0, bound_upper, 128);

    pwindow.elaborate(
        elaboration,
        bound_lower,
        bound_upper
    );

    let messages_notes = pwindow.get_messages_render_clips();

    let messages_tree = pwindow.get_messages_render_tree();

    // most recent summarization
    let notes_leaves = pwindow.get_notes_leaves();

    let logger = new log.Logger(env);

    let messenger = new m.Messenger(env, 0);

    messenger.message("clear");

    for (let message of messages_notes) {
        messenger.message(message);
        logger.log(message);
    }

    for (let message of messages_tree) {
        messenger.message(message);
        logger.log(message);
    }

    clip_elaboration.set_notes(
        notes_leaves
    )

    // TODO: replace notes in summarization clip with leaf notes
};

let reset = () => {
    clip_user_input.remove_notes(bound_lower, 0, bound_upper, 128);
};

// maybe init?
let main = (
    index_track_to_elaborate,
    index_clip_slot_to_elaborate,
    index_track_user_input,
    index_clip_slot_user_input,
    index_track_elaboration,
    index_clip_slot_elaboration
)=>{

    // var clip_1 = new c.Clip(new cd.ClipDao(index_track_1, index_clip_slot_universal, messenger, deferlow));

    // let b_stub_live_api: boolean = false;

    let live_api_1, live_api_2, live_api_3, live_api_4;

    // get(property: string): any;
    // set(property: string, value: any): void;
    // call(func: string): void;

    if (env === 'node') {
        live_api_1 = {
            get: (property: string): any => {return 0},
            set: (property: string, value: any): void => {},
            call: (func: string,  ...args: any[]): any => {return 0}
        };
        live_api_2 = {
            get: (property: string) => {return 0},
            set: (property: string, value: any): void => {},
            call: (func: string,  ...args: any[]): any => {return 0}
        };
        live_api_3 = {
            get: (property: string) => {return 0},
            set: (property: string, value: any): void => {},
            call: (func: string,  ...args: any[]): any => {return 0}
        };
        live_api_4 = {
            get: (property: string) => {return 0},
            set: (property: string, value: any): void => {},
            call: (func: string,  ...args: any[]): any => {return 0}
        };
    } else {
        // live_api_1 = new li.LiveApiJs(15, 0);
        // live_api_2 = new li.LiveApiJs(14, 0);
        // live_api_3 = new li.LiveApiJs(13, 0);
        // live_api_4 = new li.LiveApiJs(12, 0);
        // "live_set tracks " + index_track + " clip_slots " + index_clip_slot + " clip";
        live_api_user_input = new li.LiveApiJs(
            "live_set tracks " + index_track_user_input + " clip_slots " + index_clip_slot_user_input + " clip"
        );
        live_api_to_elaborate = new li.LiveApiJs(
            "live_set tracks " + index_track_to_elaborate + " clip_slots " + index_clip_slot_to_elaborate + " clip"
        );
        live_api_elaboration = new li.LiveApiJs(
            "live_set tracks " + index_track_elaboration + " clip_slots " + index_clip_slot_elaboration + " clip"
        );
    }

    // clip 1
    // let clip_dao_1 = new c.ClipDao(
    //     live_api_1,
    //     new m.Messenger(env, 0),
    //     false
    // );
    // sinon.stub(clip_dao_1, "get_start_marker").callsFake(() => {
    //     return 0;
    // });
    // sinon.stub(clip_dao_1, "get_end_marker").callsFake(() => {
    //     return 4;
    // });
    // sinon.stub(clip_dao_1, "get_notes_within_markers").callsFake(() => {
    //     return ["notes",1,"note",50,0,4,127,0,"done"]
    // });


    // clip 2
    // let clip_dao_2 = new c.ClipDao(
    //     live_api_2,
    //     new m.Messenger(env, 0),
    //     false
    // );
    // sinon.stub(clip_dao_2, "get_start_marker").callsFake(() => {
    //     return 0;
    // });
    // sinon.stub(clip_dao_2, "get_end_marker").callsFake(() => {
    //     return 4;
    // });
    // sinon.stub(clip_dao_2, "get_notes_within_markers").callsFake(() => {
    //     return ["notes",2,"note",50,0,2,127,0,"note",54,2,2,127,0,"done"]
    // });


    // clip 3
    // let clip_dao_3 = new c.ClipDao(
    //     live_api_3,
    //     new m.Messenger(env, 0),
    //     false
    // );
    // sinon.stub(clip_dao_3, "get_start_marker").callsFake(() => {
    //     return 0;
    // });
    // sinon.stub(clip_dao_3, "get_end_marker").callsFake(() => {
    //     return 4;
    // });
    // sinon.stub(clip_dao_3, "get_notes_within_markers").callsFake(() => {
    //     return ["notes",3,"note",50,0,1,127,0,"note",52,1,1,127,0,"note",54,2,2,127,0,"done"]
    // });


    // clip 4
    // let clip_dao_4 = new c.ClipDao(
    //     live_api_4,
    //     new m.Messenger(env, 0),
    //     false
    // );
    // sinon.stub(clip_dao_4, "get_start_marker").callsFake(() => {
    //     return 0;
    // });
    // sinon.stub(clip_dao_4, "get_end_marker").callsFake(() => {
    //     return 4;
    // });
    // sinon.stub(clip_dao_4, "get_notes_within_markers").callsFake(() => {
    //     return ["notes",4,"note",50,0,1,127,0,"note",52,1,1,127,0,"note",54,2,1,127,0,"note",55,3,1,127,0,"done"]
    // });

    // let clip_1 = new c.Clip(clip_dao_1);
    // let clip_2 = new c.Clip(clip_dao_2);
    // let clip_3 = new c.Clip(clip_dao_3);
    // let clip_4 = new c.Clip(clip_dao_4);
    //
    // clip_1.load_notes_within_markers();
    // clip_2.load_notes_within_markers();
    // clip_3.load_notes_within_markers();
    // clip_4.load_notes_within_markers();

    // TODO: make configurable
    let dim = 16 * 6 * 4;

    pwindow = new w.Pwindow(
        dim,
        dim,
        new m.Messenger(env, 0)
    );

    // TODO: sample workflow

    clip_user_input = new c.Clip(
        new c.ClipDao(
            live_api_user_input,
            new m.Messenger(env, 0),
            false
        )
    );

    clip_to_elaborate = new c.Clip(
        new c.ClipDao(
            live_api_to_elaborate,
            new m.Messenger(env, 0),
            false
        )
    );

    // collect index of clip to sumarize from user
    pwindow.set_clip(clip_to_elaborate);

    // these will be notes collected within the bound specified by the user
    // pwindow.elaborate(
    //     clip_2.get_notes_within_markers(),
    //     clip_2.get_notes_within_markers()[0].model.note.beat_start,
    //     clip_2.get_notes_within_markers()[1].model.note.get_beat_end()
    // );
    //
    // pwindow.elaborate(
    //     clip_3.get_notes_within_markers().slice(0, 2),
    //     clip_3.get_notes_within_markers().slice(0, 2)[0].model.note.beat_start,
    //     clip_3.get_notes_within_markers().slice(0, 2)[1].model.note.get_beat_end()
    // );
    //
    // pwindow.elaborate(
    //     clip_4.get_notes_within_markers().slice(2, 4),
    //     clip_4.get_notes_within_markers().slice(2, 4)[0].model.note.beat_start,
    //     clip_4.get_notes_within_markers().slice(2, 4)[1].model.note.get_beat_end()
    // );

    // let messages_notes = pwindow.get_messages_render_clips();
    //
    // let messages_tree = pwindow.get_messages_render_tree();
    //
    // let logger = new log.Logger(env);
    // let messenger = new m.Messenger(env, 0);
    //
    // // messenger.message(messages_notes.length.toString());
    // // messenger.message(messages_tree.length.toString());
    //
    // for (let message of messages_notes) {
    //     messenger.message(message);
    //     logger.log(message);
    //     // outlet(0, message);
    // }
    //
    // for (let message of messages_tree) {
    //     messenger.message(message);
    //     logger.log(message);
    //     // outlet(0, message);
    // }
};

if (typeof Global !== "undefined") {
    Global.renderer = {};
    Global.renderer.main = main;
    Global.renderer.confirm = confirm;
    Global.renderer.reset = reset;
    Global.renderer.set_bound_lower = set_bound_lower;
    Global.renderer.set_bound_upper = set_bound_upper;
    Global.renderer.test = test;
    Global.renderer.boundary_change_record_interval = boundary_change_record_interval;
}