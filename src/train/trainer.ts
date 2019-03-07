import {note as n} from "../note/note";
import TreeModel = require("tree-model");
import {parse_matrix, pwindow} from "../scripts/parse_tree";
import {algorithm, train} from "./algorithm";
import {history} from "../history/history";

export namespace trainer {

    import Targetable = train.algorithm.Targetable;
    import HistoryUserInput = history.HistoryUserInput;

    export class Trainer {

        private history_user_input;
        private algorithm; // TODO: annotation

        // window is either tree or list
        // mode is either harmonic or melodic
        // algorithm is either detect, predict, parse, or derive
        // history
        constructor(window, mode, algorithm, clip_user_input) {
            this.window = window;
            if (mode === modes.HARMONY) {

            }
            this.algorithm = algorithm;
            this.history_user_input = new HistoryUserInput(mode);
            this.clip_user_input = clip_user_input
            this.struct = new StructFactory.get_struct(mode)
        }

        public reset_user_input() {
            if ([algorithms.DETECT, algorithms.PREDICT].includes(this.algorithm.name)) {
                clip_user_input.set_notes(
                    this.struct.get_notes(
                        // TODO: pass requisite information
                    )
                );
            } else {

            }
        }

        private set_loop() {
            let interval = this.segment_current.get_endpoints_loop();

            this.clip_user_input.set_endpoints_loop(
                interval[0],
                interval[1]
            )
        }

        public resume() {
            // set segment current
            // set target current
            // set subtarget current
            this.algorithm.post_init()
        }

        public pause() {
            this.algorithm.pre_terminate()
        }

        public init() {
            this.advance_segment();
            this.algorithm.post_init()
        }

        advance_segment() {
            this.segment_current = this.segment_iterator.next();
            this.target_current = this.target_iterator.next();
            this.subtarget_current = this.subtarget_current.next();

            if (done) {
                this.algorithm.pre_terminate()
            }
        }

        advance_target() {
            this.target_current = this.target_iterator.next()
        }

        advance_subtarget() {
            let val = this.subtarget_iterator.next();
            if (val.done) {
                this.advance_target()
            } else {
                this.subtarget_current = val.value
            }
        }

        accept_input(input_user) {

            this.counter_user_input++;

            if (this.counter_user_input >= this.limit_user_input) {
                this.limit_input_reached = true
            }

            if (this.limit_input_reached) {
                // completely ignore
            }

            let targetable = this.algorithm instanceof Targetable;

            if (!targetable) {
                this.advance_segment();
                // return this.segment_iterator.next()
            }

            if (input_user === this.subtarget_current) {
                this.history_user_input.add(input_user);
                this.advance_subtarget();
                // TODO: make sure for detection/prediction we're making "input_user" exactly the same as the "target note", if we're restoring sessions from user input
                this.window.add(input_user);
                this.window.render()
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
    }
}