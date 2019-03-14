import {cli} from "../cli/cli";

let shell = require('shelljs');

let arg_url = new cli.Arg('url');
let option_outfile = new cli.Option('o', false, false, true);
let flag_audio_only = new cli.Flag('x');
let option_format = new cli.Option('audio-format');

let executable_youtube_dl = new cli.Executable(
    '/usr/local/bin/youtube-dl',
    [flag_audio_only],
    [option_outfile, option_format],
    [arg_url]
);

let run = () => {
    executable_youtube_dl.run()
};

let set_arg = (name_arg, val_arg) => {
    executable_youtube_dl.get_arg(name_arg).set(val_arg);
};

let set_flag = (name_flag, val_flag) => {
    executable_youtube_dl.get_flag(name_flag).set(val_flag);
};

let set_option = (name_opt, val_opt) => {
    executable_youtube_dl.get_opt(name_opt).set(val_opt);
};


let git_repo = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync';

set_arg('url', 'https://www.youtube.com/watch?v=Uybtn6ebG0I');
set_option('o', git_repo + '/tk_music_projects/downloads/project_name.%(ext)s');
set_flag('x', 1);
set_option('audio-format', 'wav');

// console.log(executable_youtube_dl.get_command_full());

    // messenger.message(log_cmd('/usr/local/bin/youtube-dl'));


    // set_arg('file_out', git_repo + '/audio/youtube/tswift_teardrops.mp3');
    // set_option('i', git_repo + '/audio/youtube/tswift_teardrops.*');

    // messenger.message(log_cmd('/usr/local/bin/ffmpeg'));
// };

// let script: cli.Script;

// let messenger = new Messenger(env, 0);

// let args: cli.Arg[] = [];
// let options: cli.Option[] = [];
// let flags: cli.Flag[] = [];
//
// let path_interpreter;
// let path_script;

// let run = () => {
//     script = new cli.Script(
//         path_interpreter,
//         path_script,
//         flags,
//         options,
//         args,
//         messenger,
//         true
//     );
//     script.run()
// };

// let set_arg = (name_arg, val_arg) => {
//     if (_.contains(args.map((arg) => {return arg.name}), name_arg)) {
//         let arg_existing = args.filter(arg => arg.name === name_arg)[0];
//         arg_existing.set(val_arg);
//     } else {
//         let arg = new cli.Arg(name_arg);
//         arg.set(val_arg);
//         args.push(arg);
//     }
// };
//
// let set_flag = (name_flag, val_flag) => {
//     if (_.contains(flags.map((flag) => {return flag.name}), name_flag)) {
//         let flag_existing = flags.filter(flag => flag.name === name_flag)[0];
//         flag_existing.set(val_flag);
//     } else {
//         let flag = new cli.Flag(name_flag);
//         flag.set(val_flag);
//         flags.push(flag);
//     }
// };
//
// let set_option = (name_opt, val_opt) => {
//     if (_.contains(options.map((opt) => {return opt.name}), name_opt)) {
//         let opt_existing = options.filter(opt => opt.name === name_opt)[0];
//         opt_existing.set(val_opt);
//     } else {
//         let opt = new cli.Option(name_opt);
//         opt.set(val_opt);
//         options.push(opt);
//     }
// };
//
// let set_interpreter = (path) => {
//     // path_interpreter = path;
// };
//
// let set_script = (path) => {
//     // path_script = path;
// };









shell.exec(
    executable_youtube_dl.get_command_full().join(' '),
{silent:true}
);








// console.log(version);

// let child = shell.exec('some_long_running_process', {async:true});
// child.stdout.on('data', function(data) {
//     /* ... do something with data ... */
// });
//
// shell.exec('some_long_running_process', function(code, stdout, stderr) {
//     console.log('Exit code:', code);
//     console.log('Program output:', stdout);
//     console.log('Program stderr:', stderr);
// });