import {live} from "../live/live";
import {message} from "../message/messenger";
import {track} from "../track/track";
import LiveApiFactory = live.LiveApiFactory;
import Env = live.Env;
import TypeIdentifier = live.TypeIdentifier;
import Track = track.Track;
import TrackDao = track.TrackDao;
import Messenger = message.Messenger;

export {}
const max_api = require('max-api');

// @ts-ignore
global.liveApi = {
    responsesProcessed: 0,
    responsesExpected: 0,
    responses: [],
    dynamicResponse: false,
    locked: false
};

max_api.addHandler('liveApiMaxSynchronousResult', (...res) => {
    // @ts-ignore
    global.liveApi.responses = global.liveApi.responses.concat(res.slice(1));

    // @ts-ignore
    global.liveApi.responsesProcessed += 1;

    // @ts-ignore
    if (global.liveApi.dynamicResponse) {
        // @ts-ignore
        global.liveApi.responsesExpected = Number(res[2]) + 2;
        // @ts-ignore
        global.liveApi.dynamicResponse = false;
    }

    // @ts-ignore
    if (global.liveApi.responsesProcessed == global.liveApi.responsesExpected) {
        // @ts-ignore
        global.liveApi.locked = false;
    }
});

max_api.addHandler('expand_track', (path_track: string, name_part?: string) => {

    path_track = 'live_set tracks 2';

    // let path_clip_slot = "path live_set tracks 2 clip_slots 0";
    //
    // let clip_slot = LiveApiFactory.create(
    //     Env.NODE_FOR_MAX,
    //     path_clip_slot,
    //     TypeIdentifier.PATH
    // );
    //
    // let children = clip_slot.get_id();
    //
    // let testing = 1;

    let track = new Track(
        new TrackDao(
            LiveApiFactory.create(
                Env.NODE_FOR_MAX,
                path_track,
                TypeIdentifier.PATH
            ),
            new Messenger(
                Env.NODE_FOR_MAX,
                0
            )
        )
    );

    track.load_clips();

    let clip_slot = track.get_clip_slot_at_index(0);

    let clip = clip_slot.get_clip();

    let notes = clip.get_notes(0, 0, 8, 128);

    let testing = 1;

    // track.create_clip_at_index(1, 8)

    // let song = new Song(
    //     new SongDao(
    //         new li.LiveApiJs(
    //             'live_set',
    //             'node'
    //         ),
    //         // new Messenger('node_for_max', 0),
    //         null,
    //         false
    //     )
    // );
    //
    // // song.start()
    // max_api.post(song.get_tempo());
    // max_api.post('finished');
});
