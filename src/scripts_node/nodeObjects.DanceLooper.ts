export {}
const max_api = require('max-api');


// let receive_message_saga = (name_saga, val_saga) => {
//     // post(Global);
//     // this["test"]()
//     // eval(name_saga + ".next();")
//     // saga_dance.next()
// };
//
// // TODO: do we ever need to use yield to set value of variable?
// // TODO: what about using libraries in between async calls?
let saga_dance = function* () {
    max_api.post("loading video...");
    // messenger.message(["load_video"]);
    yield;
    max_api.post("setting frame length...");
    // messenger.message(["set_frame_length"]);
    yield;
    max_api.post("getting beat estimates...");
    // messenger.message(["get_beat_estimates"]);
    // max_api.post()
}();
//
// let start_saga_dance = () => {
//     saga_dance.next();
//     // saga_dance.next();
//     // saga_dance.next();
// };

max_api.addHandler("start_saga_dance", () => {
    saga_dance.next();
});