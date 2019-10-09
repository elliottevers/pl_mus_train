export {}
const max_api = require('max-api');


let blocked = true;

max_api.addHandler('liveApiMaxSynchronousResult', () => {
    blocked = false
});

max_api.addHandler('run', () => {
    blocked = true;
    

    max_api.post('done')
});
