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

let setLength = (a) => {
    length = Number(a);
};

let setMax = (a) => {
    max = Number(a);
};

let setMin = (a) => {
    min = Number(a);
};

let initialize = () => {

    patcher.getnamed('modeSetter').message(Mode.Query);

    patcher.getnamed('coll').message('length');

    patcher.getnamed('coll').message('min');

    patcher.getnamed('coll').message('max');

    patcher.getnamed('modeSetter').message(Mode.BulkWrite);

    patcher.getnamed('scaleFactorSetter').message(max);

    patcher.getnamed('counter').message('set', 0);

    patcher.getnamed('buffer').message('clear');

    patcher.getnamed('buffer').message('sizeinsamps', length);

    patcher.getnamed('coll').message('dump');

    patcher.getnamed('outletSecond').message(length);

    patcher.getnamed('modeSetter').message(Mode.Stream);
};

if (typeof Global !== "undefined") {
    Global.timeseries_manager = {};
    Global.timeseries_manager.initialize = initialize;
    Global.timeseries_manager.setLength = setLength;
    Global.timeseries_manager.setMax = setMax;
    Global.timeseries_manager.setMin = setMin;
}
