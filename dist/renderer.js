"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var env = 'node';
var logger_1 = require("./log/logger");
var main = function () {
    // clip 1
    // let clip_dao_1 = new c.ClipDao(0, 0, new m.Messenger('node', 0), false);
    // sinon.stub(clip_dao_1, "get_start_marker").callsFake(() => {
    //     return 0;
    // });
    // sinon.stub(clip_dao_1, "get_end_marker").callsFake(() => {
    //     return 4;
    // });
    // sinon.stub(clip_dao_1, "get_notes").callsFake(() => {
    //     return ["notes",1,"note",50,0,4,127,0,"done"]
    // });
    //
    //
    // // clip 2
    // let clip_dao_2 = new c.ClipDao(0, 0, new m.Messenger('node', 0), false);
    // sinon.stub(clip_dao_2, "get_start_marker").callsFake(() => {
    //     return 0;
    // });
    // sinon.stub(clip_dao_2, "get_end_marker").callsFake(() => {
    //     return 4;
    // });
    // sinon.stub(clip_dao_2, "get_notes").callsFake(() => {
    //     return ["notes",2,"note",50,0,2,127,0,"note",54,2,2,127,0,"done"]
    // });
    //
    //
    // // clip 3
    // let clip_dao_3 = new c.ClipDao(0, 0, new m.Messenger('node', 0), false);
    // sinon.stub(clip_dao_3, "get_start_marker").callsFake(() => {
    //     return 0;
    // });
    // sinon.stub(clip_dao_3, "get_end_marker").callsFake(() => {
    //     return 4;
    // });
    // sinon.stub(clip_dao_3, "get_notes").callsFake(() => {
    //     return ["notes",3,"note",50,0,1,127,0,"note",52,1,1,127,0,"note",54,2,2,127,0,"done"]
    // });
    //
    //
    // // clip 4
    // let clip_dao_4 = new c.ClipDao(0, 0, new m.Messenger('node', 0), false);
    // sinon.stub(clip_dao_4, "get_start_marker").callsFake(() => {
    //     return 0;
    // });
    // sinon.stub(clip_dao_4, "get_end_marker").callsFake(() => {
    //     return 4;
    // });
    // sinon.stub(clip_dao_4, "get_notes").callsFake(() => {
    //     return ["notes",4,"note",50,0,1,127,0,"note",52,1,1,127,0,"note",54,2,1,127,0,"note",55,3,1,127,0,"done"]
    // });
    //
    // let clip_1 = new c.Clip(clip_dao_1);
    // let clip_2 = new c.Clip(clip_dao_2);
    // let clip_3 = new c.Clip(clip_dao_3);
    // let clip_4 = new c.Clip(clip_dao_4);
    //
    // clip_1.load_notes();
    // clip_2.load_notes();
    // clip_3.load_notes();
    // clip_4.load_notes();
    //
    // var dim = 16 * 6 * 4;
    //
    // var pwindow = new w.Pwindow(
    //     dim,
    //     dim,
    //     new m.Messenger('node', 0)
    // );
    //
    // pwindow.add_clip(clip_4);
    // pwindow.add_clip(clip_3);
    // pwindow.add_clip(clip_2);
    // pwindow.add_clip(clip_1);
    //
    // let messages = pwindow.get_messages_render_clips();
    //
    var logger = new logger_1.log.Logger('max');
    // for (let message of messages) {
    //     logger.log(message);
    // }
    post('posting');
    post('\n');
    outlet(0, 'posting');
    // outlet(0,'\n');
};
if (env !== 'node') {
    Global.main = main;
}
//# sourceMappingURL=renderer.js.map