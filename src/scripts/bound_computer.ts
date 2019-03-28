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

let messenger = new Messenger(env, 0);

let compute_bound = (int) => {
    if (int - Math.floor(int) === 0) {
        messenger.message([int])
    } else {
        messenger.message([int - Math.floor(int)])
    }
};

if (typeof Global !== "undefined") {
    Global.bound_computer = {};
    Global.bound_computer.compute_bound = compute_bound;
}
