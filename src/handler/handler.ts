export namespace handler {
    export let add_handler = (Max, name, callback) => {
        Max.addHandler(name, callback);
    }
}