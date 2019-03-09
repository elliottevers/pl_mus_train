"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var python_shell_1 = require("python-shell");
var pyshell = new python_shell_1.PythonShell('/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/music/sandbox/test.py');
// sends a message to the Python script via stdin
pyshell.send('hello');
pyshell.on('message', function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    console.log(message);
});
// end the input stream and allow the process to exit
pyshell.end(function (err, code, signal) {
    if (err)
        throw err;
    console.log('The exit code was: ' + code);
    console.log('The exit signal was: ' + signal);
    console.log('finished');
    console.log('finished');
});
//# sourceMappingURL=train_test.js.map