"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file;
(function (file) {
    file.to_json = function (string_json, filename, env) {
        switch (env) {
            case 'node' || 'node_for_max': {
                var fs = require("fs");
                // let data = "New File Contents";
                fs.writeFile("temp.txt", JSON.stringify(string_json), function (err, data) {
                    if (err)
                        console.log(err);
                    console.log("saving session");
                });
                break;
            }
            case 'max': {
                var f = new File(filename, "write", "JSON");
                if (f.isopen) {
                    post("saving session");
                    f.writestring(JSON.stringify(string_json));
                    f.close();
                }
                else {
                    post("could not save session");
                }
                break;
            }
            default: {
                throw ['environment', env, 'not supported'].join(' ');
            }
        }
    };
    file.from_json = function (filepath, env) {
        var matrix_deserialized;
        switch (env) {
            case 'node' || 'node_for_max': {
                var lineReader = require('readline').createInterface({
                    input: require('fs').createReadStream(filepath)
                });
                lineReader.on('line', function (line) {
                    matrix_deserialized = JSON.parse(line);
                });
                // lineReader.on('close', callback);
                break;
            }
            case 'max': {
                var f = new File(filepath, "read", "JSON");
                var a = void 0;
                if (f.isopen) {
                    post("reading file");
                    // @ts-ignore
                    while ((a = f.readline()) != null) {
                        matrix_deserialized = JSON.parse(a);
                    }
                    f.close();
                }
                else {
                    post("could not open file");
                }
                break;
            }
            default: {
                throw 'error in from_json';
            }
        }
        return matrix_deserialized;
    };
})(file = exports.file || (exports.file = {}));
//# sourceMappingURL=file.js.map