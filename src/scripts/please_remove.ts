import {message} from "../message/messenger";
import Messenger = message.Messenger;

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

let messenger: Messenger = new Messenger(env, 0);


let filter = () => {
    // @ts-ignore
    let duple_midi = Array.prototype.slice.call(arguments);
    if (duple_midi[duple_midi.length - 1] > 0) {
        messenger.message(duple_midi)
    }
};

// test();

if (typeof Global !== "undefined") {
    Global.please_remove = {};
    Global.please_remove.filter = filter;
}
