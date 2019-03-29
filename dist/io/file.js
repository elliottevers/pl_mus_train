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
                    post("writing json");
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
        var matrix_deserialized = [];
        switch (env) {
            case 'node_for_max': {
                console.log('reading json');
                var fs = require("fs");
                // TODO: fix in node_for_max
                matrix_deserialized = JSON.parse(fs.readFileSync(filepath, 'utf8', function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                }))['history_user_input'];
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
                }))['history_user_input'];
                break;
            }
            case 'max': {
                var dict = new Dict();
                dict.import_json(filepath);
                // NB: using "of" looks wrong but it isn't
                for (var _i = 0, _a = dict.get("history_user_input").getkeys(); _i < _a.length; _i++) {
                    var i_row = _a[_i];
                    matrix_deserialized.push([]);
                    var col = dict.get(["history_user_input", i_row].join('::'));
                    for (var _b = 0, _c = col.getkeys(); _b < _c.length; _b++) {
                        var i_col = _c[_b];
                        matrix_deserialized[Number(i_row)].push([]);
                        matrix_deserialized[Number(i_row)][Number(i_col)] = dict.get(["history_user_input", i_row, i_col].join('::'));
                    }
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