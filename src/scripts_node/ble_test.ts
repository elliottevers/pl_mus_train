export {};

// const max_api = require('max-api');

const noble = require('noble');

noble.on('stateChange', function(state) {
    if (state === 'poweredOn')
        noble.startScanning();
    else
        noble.stopScanning();
});

// noble.startScanning(); // any service UUID, no duplicates
//
//
// noble.startScanning([], true); // any service UUID, allow duplicates


// var serviceUUIDs = ["<service UUID 1>", ...] // default: [] => all
// var allowDuplicates = <false|true>; // default: false

// noble.startScanning(serviceUUIDs, allowDuplicates[, callback(error)]); // particular UUID's


// const fs = require('fs');

// let file_log_max = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_projects/.log_max.txt';

// const handlers = {
//     ['all']: (handled, ...args) => {
//         fs.appendFileSync(file_log_max, '\n', (err) => {
//             if (err) throw err;
//             max_api.post('error writing to log file')
//         });
//
//         fs.appendFileSync(file_log_max, JSON.stringify(args), (err) => {
//             if (err) throw err;
//             max_api.post('error writing to log file')
//         });
//
//         fs.appendFileSync(file_log_max, '\n', (err) => {
//             if (err) throw err;
//             max_api.post('error writing to log file')
//         });
//     }
// };

// max_api.addHandlers(handlers);