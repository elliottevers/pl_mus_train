import {message as m, message} from "../message/messenger";
import Messenger = message.Messenger;
import {live, live as li} from "../live/live";
import {clip, clip as c} from "../clip/clip";
import LiveApiJs = live.LiveApiJs;
import {log} from "../log/logger";
import Logger = log.Logger;
import {io} from "../io/io";
import Exporter = io.Exporter;
import {utils} from "../utils/utils";
import {harmony} from "../music/harmony";
import Harmony = harmony.Harmony;
import ClipDao = clip.ClipDao;
import Clip = clip.Clip;
import {track} from "../track/track";
import TrackDao = track.TrackDao;
import Track = track.Track;

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


let test = () => {
    let track = new Track(
        new TrackDao(
            new LiveApiJs(
                'live_set tracks 2'
            )
        )
    );

    let logger = new Logger(env);

    logger.log(track.get_num_clip_slots());
};

if (typeof Global !== "undefined") {
    Global.track_test = {};
    Global.track_test.test = test;
}
