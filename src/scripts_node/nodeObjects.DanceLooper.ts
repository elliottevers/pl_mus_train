export {}
const max_api = require('max-api');
var serialize = require('node-serialize');


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

max_api.addHandler("serialize", () => {
    // saga_dance.next();
    // var obj = {
    //     name: 'Bob',
    //     say: function() {
    //         return 'hi ' + this.name;
    //     }
    // };


    // typeof objS === 'string';
    // serialize.unserialize(objS).say() === 'hi Bob';
    // max_api.post(serialize.unserialize(objS).say());

    var TreeModel = require('tree-model');
    var tree = new TreeModel();
    var root = tree.parse({name: 'a', children: [{name: 'b'}]});

    // root.getPath();

    // JSON.stringify(root);

    var objS = serialize.serialize(root.model);

    // max_api.post(tree.parse(serialize.unserialize(objS)));

    max_api.post(tree.parse(serialize.unserialize(objS)).getIndex());

    // serialize.unserialize(objS).get_path()

    // max_api.post(root.model);

    // root.getPath()
    // serialize.unserialize(objS);
});