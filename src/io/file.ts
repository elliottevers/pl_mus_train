import {log} from "../log/logger";

declare let Dict: any;

export namespace file {

    import Logger = log.Logger;
    export let to_json = (string_json, filename: string, env: string) => {
        switch (env) {
            case 'node_for_max': {
                console.log('writing json');
                let fs = require("fs");

                fs.writeFileSync(filename, JSON.stringify(string_json), 'utf8', (err, data) => {
                    if (err) {
                        console.log('error writing json')
                    }
                });

                break;
            }
            case 'node': {
                console.log('writing json');
                let fs = require("fs");

                fs.writeFileSync(filename, JSON.stringify(string_json), 'utf8', (err, data) => {
                    if (err) {
                        console.log('error writing json')
                    }
                });

                break;
            }
            case 'max': {
                let f = new File(filename,"write","JSON");

                if (f.isopen) {
                    post("writing json");
                    f.writestring(JSON.stringify(string_json));
                    f.close();
                } else {
                    post("could not save session");
                }
                break;
            }
            default: {
                throw ['environment', env, 'not supported'].join(' ')
            }
        }
    };

    export let from_json = (filepath: string, env: string) => {
        let matrix_deserialized = [];

        switch (env) {
            case 'node_for_max': {
                console.log('reading json');
                let fs = require("fs");
                // TODO: fix in node_for_max
                matrix_deserialized = JSON.parse(fs.readFileSync(filepath, 'utf8', (err, data) => {
                    if (err) {
                        console.log(err)
                    }
                }));
                break;
            }
            case 'node': {
                console.log('reading json');
                let fs = require("fs");
                // TODO: fix in node_for_max
                matrix_deserialized = JSON.parse(fs.readFileSync(filepath, 'utf8', (err, data) => {
                    if (err) {
                        console.log(err)
                    }
                }));
                break;
            }
            case 'max': {
                let dict = new Dict();

                dict.import_json(filepath);

                // NB: using "of" looks wrong but it isn't
                for (let i_row of dict.get("history_user_input").getkeys()) {
                    matrix_deserialized.push([]);
                    let col = dict.get(["history_user_input", i_row].join('::'));
                    for (let i_col of col.getkeys()) {
                        matrix_deserialized[Number(i_row)].push([]);
                        matrix_deserialized[Number(i_row)][Number(i_col)] = dict.get(
                            ["history_user_input", i_row, i_col].join('::')
                        )
                    }
                }

                break;
            }
            default: {
                throw 'error in from_json'
            }

        }

        return matrix_deserialized
    }
}