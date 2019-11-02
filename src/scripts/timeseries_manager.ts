import {live} from "../live/live";
import Env = live.Env;

declare let autowatch: any;
declare function post(message?: any): void;
declare let Global: any;

let env: Env = Env.MAX;

declare let patcher: any;

if (env === Env.MAX) {
    post('recompile successful');
    autowatch = 1;
}

enum Mode {
    Stream = 'stream',
    BulkWrite = 'bulk_write',
    Query = 'query'
}

let length: number;
let max: number;
let min: number;

let stateHandle: 'length' | 'max' | 'min';

let handleQuery = (result) => {
    switch (stateHandle) {
        case 'length': {
            length = Number(result);
            break;
        }
        case 'max': {
            max = Number(result);
            break;
        }
        case 'min': {
            min = Number(result);
            break;
        }
    }
};

let initialize = () => {

    patcher.getnamed('modeSetter').message(Mode.Query);

    stateHandle = 'length';

    patcher.getnamed('coll').message('length');

    stateHandle = 'min';

    patcher.getnamed('coll').message('min');

    stateHandle = 'max';

    patcher.getnamed('coll').message('max');

    patcher.getnamed('modeSetter').message(Mode.BulkWrite);

    patcher.getnamed('scaleFactorSetter').message(max);

    patcher.getnamed('counter').message('set', 0);

    patcher.getnamed('buffer').message('clear');

    patcher.getnamed('buffer').message('sizeinsamps', length);

    patcher.getnamed('coll').message('dump');

    patcher.getnamed('outletRelayer').message(length);

    patcher.getnamed('modeSetter').message(Mode.Stream);
};

if (typeof Global !== "undefined") {
    Global.timeseries_manager = {};
    Global.timeseries_manager.initialize = initialize;
    Global.timeseries_manager.handleQuery = handleQuery;
}
