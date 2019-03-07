import {note as n} from "../note/note";
import TreeModel = require("tree-model");
import {parse_matrix, pwindow} from "../scripts/parse_tree";
import {train} from "./algorithm";

export namespace train {

    import Targetable = train.algorithm.Targetable;

    export class Trainer {

        constructor(window, mode) {
            this.window = window;
            if (mode === modes.HARMONY) {

            }
        }

        advance_segment() {
            this.segment_current = this.segment_iterator.next()
        }

        advance_target() {
            this.target_current = this.target_iterator.next()
        }

        advance_subtarget() {
            let val = this.subtarget_iterator.next()
            if (val.done) {
                this.advance_target()
            } else {
                this.subtarget_current = val.value
            }
        }

        accept_input (input_user) {

            if (this.limit_input_reached) {
                // completely ignore
            }

            let targetable = this.algorithm instanceof Targetable;

            if (!targetable) {
                this.advance_segment();
                // return this.segment_iterator.next()
            }

            if (input_user === this.subtarget_current) {
                this.advance_subtarget();
            }
        }

        public accept(notes: TreeModel.Node<n.Note>[]) {
            // elaborate, summarize, detect, predict

            this.window.insert(
                notes
            );

            parse_matrix.set_notes(
                tree_depth_iterator.get_index_current(),
                segment_iterator.get_index_current(),
                notes
            );

            this.window.render();

            if (segment_next.done) {

                this.stop();

                return
            }

            this.segment_current = val_segment_next;

            let interval = this.segment_current.get_endpoints_loop();

            this.clip_user_input.set_endpoints_loop(
                interval[0],
                interval[1]
            );
        }

        public render() {
            // this.window
            // get messages regions
            // get messages
        }

        public clear_render() {
            // this.window.clear()
        }

        public init() {
            // this.iterator.next()
            // this.clip_user_input.fire()
        }

        private stop() {

        }
    }
}





notes_segments = [note1, note2];

trainer.set_segments(notes_segments);

trainer.init(

); // calls next() under the hood, emits intervals to the UserInputHandler, renders the region of interest to cue user

trainer.accept(
    note_1
);

trainer.accept(
    note_2
);

trainer.accept(
    note_3
);

trainer.clear_render(

);

let freezer = new TrainFreezer(
    'node'
);

freezer.freeze(
    trainer,
    '/path/to/file'
);

let thawer = new TrainThawer(
    'node'
);

let train_thawed = thawer.thaw(
    '/path/to/file'
);

train_thawed.render(

);