This is the real-time training component of an ambitious ear training project - it's main function is to, given raw audio and its corresponding musical properties, iterate over the song, accept user input, evaluate how well a user completes a set of tasks, and deliver feedback in real-time. Video demos of the project can be seen [here](https://elliottevers.github.io/).

To debug:
 - add `@options --inspect-brk=9229` after `node.script` object in Max
 - Run `Attach to Node.js/Chrome` run/debug configuration in Webstorm on same port
 
To build:
- Node objects don't require compiling
- Run `to_max` script in `package.json` to compile JS objects TODO: don't do this

NB:
currently, to compile JS objects we have to comment out
```
let node = require("deasync");
// @ts-ignore
node.loop = node.runLoopOnce;
```

and

```
this.maxApi = require('max-api');
```

in `live` module, and

```
const Max = require('max-api');
Max.outlet(message);
```

in `messenger` module.  TODO: figure out a way to do this better