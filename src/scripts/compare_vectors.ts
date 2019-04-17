import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {log} from "../log/logger";
import Logger = log.Logger;
const _ = require("underscore");

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

let logger: Logger = new Logger(env);

let vector_radio = [];

// render dependency
let overlap_at_index = (former, latter, i) => {
    return former[i] === latter[i] ? 1 : 0;
};

let are_equal = (former, latter) => {
    return _.isEqual(former, latter) ? 1 : 0;
};

let get_index_nonzero = (vector) => {
    for (let i in vector) {
        if (vector[Number(i)] === 1) {
            return Number(i)
        }
    }
    return 0;
};

function set_vector_radio() {
    vector_radio = Array.prototype.slice.call(arguments);
}

function b_stream_dependency() {
    let dependencies_broadcasted = Array.prototype.slice.call(arguments);
    messenger.message(
        [
            'b_stream_dependency',
            overlap_at_index(
                vector_radio,
                dependencies_broadcasted,
                get_index_nonzero(vector_radio)
            )
        ]
    )
}

function b_stream_ground_truth() {
    let ground_truth_broadcasted = Array.prototype.slice.call(arguments);
    messenger.message(
        [
            'b_stream_ground_truth',
            are_equal(
                vector_radio,
                ground_truth_broadcasted
            )
        ]
    )
}

// let test = () => {
//
//     // let vector_checkbox_test = [1, 1, 0, 0, 0];
//     //
//     // let vector_radio_key_center = [1, 0, 0, 0, 0];
//
//     let vector_checkbox_test = [0, 1, 0, 0, 0];
//
//     let vector_radio_key_center = [1, 0, 0, 0, 0];
//
//     // @ts-ignore
//     set_vector_radio(vector_radio_key_center);
//
//     // @ts-ignore
//     b_stream_dependency(vector_checkbox_test);
//
//     let vector_checkbox_test_2 = [1, 0, 0, 0, 0];
//
//     let vector_radio_bass = [0, 1, 0, 0, 0];
//
//     // @ts-ignore
//     set_vector_radio(vector_radio_bass);
//
//     // @ts-ignore
//     b_stream_dependency(vector_checkbox_test_2);
// };
//
// test();

if (typeof Global !== "undefined") {
    Global.compare_vectors = {};
    Global.compare_vectors.set_vector_radio = set_vector_radio;
    Global.compare_vectors.b_stream_dependency = b_stream_dependency;
    Global.compare_vectors.b_stream_ground_truth = b_stream_ground_truth;
}
