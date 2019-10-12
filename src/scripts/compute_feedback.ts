import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {map} from "../control/map";
import FretMapper = map.FretMapper;
import {live} from "../live/live";
import Env = live.Env;

declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;
declare function post(message?: any): void;

export {}

declare let Global: any;

let env: Env = Env.MAX;

if (env === Env.MAX) {
    post('recompile successful');
    autowatch = 1;
}

let messenger: Messenger = new Messenger(Env.MAX, 0);

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
