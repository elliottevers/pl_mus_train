"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var logger_1 = require("../log/logger");
var Logger = logger_1.log.Logger;
var _ = require("underscore");
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var messenger = new Messenger(env, 0);
var logger = new Logger(env);
var vector_radio = [];
// render dependency
var overlap_at_index = function (former, latter, i) {
    logger.log(former.toString());
    logger.log(latter.toString());
    return former[i] === latter[i] ? 1 : 0;
};
var are_equal = function (former, latter) {
    return _.isEqual(former, latter) ? 1 : 0;
};
var get_index_nonzero = function (vector) {
    for (var i in vector) {
        if (vector[Number(i)] === 1) {
            return Number(i);
        }
    }
    return 0;
};
function set_vector_radio() {
    vector_radio = Array.prototype.slice.call(arguments);
}
function b_stream_dependency() {
    var dependencies_broadcasted = Array.prototype.slice.call(arguments);
    messenger.message([
        'b_stream_dependency',
        overlap_at_index(vector_radio, dependencies_broadcasted, get_index_nonzero(vector_radio))
    ]);
}
function b_stream_ground_truth() {
    var ground_truth_broadcasted = Array.prototype.slice.call(arguments);
    messenger.message([
        'b_stream_ground_truth',
        are_equal(vector_radio, ground_truth_broadcasted)
    ]);
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
//# sourceMappingURL=compare_vectors.js.map