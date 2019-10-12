import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {live} from "../live/live";
import Env = live.Env;

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

let messenger = new Messenger(Env.MAX, 0);

let messages = [];

let anything = () => {
    //@ts-ignore
    let list_args = Array.prototype.slice.call(arguments);

    messages.push(list_args)
};

let log = () => {

    for (let message of messages) {
        messenger.message(message)
    }

    messages = [];
};

if (typeof Global !== "undefined") {
    Global.log_proxy = {};
    Global.log_proxy.log = log;
    Global.log_proxy.anything = anything;
}
