import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {live as li} from "../live/live";
import {log} from "../log/logger";
import Logger = log.Logger;
import {utils} from "../utils/utils";

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

let get_selected_track = () => {
    let track_highlighted = new li.LiveApiJs(
        'live_set view selected_track clip_slots 0 clip'
    );

    let path_live = track_highlighted.get_path();

    let messenger = new Messenger(env, 0);

    messenger.message(utils.PathLive.to_message(path_live))

};

if (typeof Global !== "undefined") {
    Global.path_getter = {};
    Global.path_getter.get_selected_track = get_selected_track;
}
