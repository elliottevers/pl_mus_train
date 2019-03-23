import {log} from "../log/logger";
import Logger = log.Logger;


declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;
declare function post(message?: any): void;
declare let Dict: any;

const jsEnv = require('browser-or-node');

export {}

declare let Global: any;

let env: string = 'max';

if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}


let test = () => {
    // let track = new Track(
    //     new TrackDao(
    //         new LiveApiJs(
    //             'live_set tracks 2'
    //         )
    //     )
    // );
    //
    // let logger = new Logger(env);
    //
    // logger.log(track.get_num_clip_slots());

    let logger = new Logger(env);

    if (jsEnv.isBrowser) {
        // do browser only stuff
        logger.log('this is a browser')
    }

    if (jsEnv.isNode) {
        // do node.js only stuff
        logger.log('this is node')
    }
};

if (typeof Global !== "undefined") {
    Global.track_test = {};
    Global.track_test.test = test;
}
