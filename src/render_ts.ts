// declare let Global: any;
// TODO: make dedicated library object for the following
declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;

export {}

declare let Global: any;

let env: string = 'node';

if (env === 'max') {
    autowatch = 1;
}

let makeArr = (startValue, stopValue, cardinality) => {
    var arr = [];
    var currValue = startValue;
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
        arr.push(currValue + (step * i));
    }
    return arr;
};

let main = () => {
    let arr_lin = makeArr(0, 1000, 75752);
    // let testing = 1;
    let num_samples = arr_lin.length;
    let len_song_ms = Math.round(2.2 * 10 ** 5);
    let len_window_pixels = Math.round(1.0 * 10 ** 4);

    let len_sample_pixels = len_window_pixels/num_samples;
    let testing = 1;
    // for (let message in messages) {
    //     outlet(0, message)
    // }
};


if (typeof Global !== "undefined") {
    Global.render_ts = {};
    Global.render_ts.main = main;
}

main();