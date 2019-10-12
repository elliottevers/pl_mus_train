import {live} from "../live/live";

declare let Dict: any;

export namespace file {

    import Env = live.Env;
    export let to_json = (string_json, filename: string, env: Env) => {
        switch (env) {
            case Env.NODE_FOR_MAX: {
                console.log('writing json');
                let fs = require("fs");

                fs.writeFileSync(filename, JSON.stringify(string_json), 'utf8', (err, data) => {
                    if (err) {
                        console.log('error writing json')
                    }
                });

                break;
            }
            case Env.NODE: {
                console.log('writing json');
                let fs = require("fs");

                fs.writeFileSync(filename, JSON.stringify(string_json), 'utf8', (err, data) => {
                    if (err) {
                        console.log('error writing json')
                    }
                });

                break;
            }
            case Env.MAX: {
                // @ts-ignore
                let f = new File(filename,"write","JSON");

                if (f.isopen) {
                    // @ts-ignore
                    post("writing json");
                    f.writestring(JSON.stringify(string_json));
                    f.close();
                } else {
                    // @ts-ignore
                    post("could not save session");
                }
                break;
            }
            default: {
                throw ['environment', env, 'not supported'].join(' ')
            }
        }
    };

    export let from_json = (filepath: string, env: Env) => {
        let matrix_deserialized = [];

        switch (env) {
            case Env.NODE_FOR_MAX: {
                console.log('reading json');
                let fs = require("fs");
                // TODO: fix in node_for_max
                matrix_deserialized = JSON.parse(fs.readFileSync(filepath, 'utf8', (err, data) => {
                    if (err) {
                        console.log(err)
                    }
                }))['history_user_input'];
                break;
            }
            case Env.NODE: {
                console.log('reading json');
                let fs = require("fs");
                // TODO: fix in node_for_max
                matrix_deserialized = JSON.parse(fs.readFileSync(filepath, 'utf8', (err, data) => {
                    if (err) {
                        console.log(err)
                    }
                }))['history_user_input'];
                break;
            }
            case Env.MAX: {
                let dict = new Dict();

                dict.import_json(filepath);

                // NB: using "of" looks wrong but it isn't...
                for (let i_row of dict.get("history_user_input").getkeys()) {
                    matrix_deserialized.push([]);
                    let col = dict.get(["history_user_input", i_row].join('::'));
                    for (let i_col of col.getkeys()) {
                        matrix_deserialized[Number(i_row)].push([]);
                        let notes = dict.get(
                            ["history_user_input", i_row, i_col].join('::')
                        );

                        let val;

                        if (notes === null) {
                            val = null
                        } else if (notes.length === 1) {
                            val = [notes]
                        } else {
                            val = notes
                        }

                        matrix_deserialized[Number(i_row)][Number(i_col)] = val

                    }
                }

                break;
            }
            default: {
                throw 'error reading json'
            }

        }

        return matrix_deserialized
    }
}