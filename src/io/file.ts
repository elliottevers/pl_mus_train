
export namespace file {

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
        let matrix_deserialized;

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
                let f = new File(filepath, "read","JSON");
                let a;

                if (f.isopen) {
                    post("reading json");
                    //@ts-ignore
                    while ((a = f.readline()) != null) {
                        post('reading line');
                        matrix_deserialized = JSON.parse(a) as any;

                    }
                    f.close();
                } else {
                    post("could not open file");
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