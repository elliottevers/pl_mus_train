"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file;
(function (file) {
    file.to_json = function (string_json, filename, env) {
        switch (env) {
            case 'node_for_max': {
                console.log('writing json');
                var fs = require("fs");
                fs.writeFileSync(filename, JSON.stringify(string_json), 'utf8', function (err, data) {
                    if (err) {
                        console.log('error writing json');
                    }
                });
                break;
            }
            case 'node': {
                console.log('writing json');
                var fs = require("fs");
                fs.writeFileSync(filename, JSON.stringify(string_json), 'utf8', function (err, data) {
                    if (err) {
                        console.log('error writing json');
                    }
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
            case 'node_for_max': {
                console.log('reading json');
                var fs = require("fs");
                // TODO: fix in node_for_max
                matrix_deserialized = JSON.parse(fs.readFileSync(filepath, 'utf8', function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                }));
                break;
            }
            case 'node': {
                console.log('reading json');
                var fs = require("fs");
                // TODO: fix in node_for_max
                matrix_deserialized = JSON.parse(fs.readFileSync(filepath, 'utf8', function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                }));
                break;
            }
            case 'max': {
                var f = new File(filepath, "read", "JSON");
                var a = void 0;
                if (f.isopen) {
                    post("reading json");
                    //@ts-ignore
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