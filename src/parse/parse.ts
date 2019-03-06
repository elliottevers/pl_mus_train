import {segment} from "../segment/segment";
import {note} from "../note/note";
import TreeModel = require("tree-model");
import {log} from "../log/logger";

const _ = require("underscore");


export namespace parse {
    import SegmentIterator = segment.SegmentIterator;
    import Logger = log.Logger;

    export interface Parsable {
        choose(): boolean;

        // TODO: annotation
        get_best_candidate(list_candidate_note);
    }

    export class ParseMatrix {

        data: TreeModel.Node<note.Note>[][][];
        logger: Logger;

        constructor(height: number, width: number) {
            this.data = [];
            for(let i=0; i<height; i++) {
                this.data[i] = new Array(width);
            }
            this.logger = new Logger('max')
        }

        set_notes(i_height, i_width, notes): void {
            // this.logger.log(i_height);
            // this.logger.log(i_width);
            // this.logger.log(JSON.stringify(notes));
            this.data[i_height][i_width] = notes
        }

        get_notes(i_height, i_width): TreeModel.Node<note.Note>[] {
            // this.logger.log(JSON.stringify(this.data));
            // for (let datum of this.data) {
            //     this.logger.log(datum.toString())
            // }
            // this.logger.log(i_height);
            // this.logger.log(i_width);
            return this.data[i_height][i_width]
        }
    }

    export class TreeDepthIterator {
        public direction_forward: boolean;
        private i: number;
        private layers: number[];

        constructor(depth: number, direction_forward: boolean) {
            this.layers = _.range(depth);
            this.direction_forward = direction_forward;
            this.i = 0;
        }

        // TODO: type declarations
        public next() {
            let value_increment = (this.direction_forward) ? 1 : -1;

            this.i += value_increment;

            if (this.i < 0) {
                throw 'segment iterator < 0'
            }

            if (this.i < this.layers.length) {
                return {
                    value: this.layers[this.i],
                    done: false
                }
            } else {
                return {
                    value: null,
                    done: true
                }
            }
        }

        public current() {
            if (this.i > -1) {
                return this.layers[this.i];
            } else {
                return null;
            }
        }

        public get_index_current() {
            return this.i // TODO: the root is the first index
        }
    }

    export class ParseTreeIterator {
        private iterator_segment;
        private iterator_tree;
        public segment_current;
        public layer_current;

        constructor(iterator_segment: SegmentIterator, iterator_tree: TreeDepthIterator) {
            this.iterator_segment = iterator_segment;
            this.iterator_tree = iterator_tree
        }

        // TODO: type declarations
        public next(type_node?:string) {

            if (type_node === 'root') {
                // initialize
                this.iterator_tree.next();
                return
            }

            // initialize
            if (this.iterator_tree.get_index_current() == -1) {
                this.iterator_tree.next()
            }

            // let layer_current = this.iterator_tree.current();

            let segment_result_next = this.iterator_segment.next();

            let segment_next = segment_result_next.value;

            if (!segment_result_next.done) {
                this.segment_current = segment_next;
                return {
                    value: this.segment_current,
                    done: false
                }
            }

            //
            // this.iterator_segment.reset();

            let layer_result_next = this.iterator_tree.next();

            // segment_next.done is true by now
            if (!layer_result_next.done) {

                this.iterator_segment.reset();

                this.layer_current = this.iterator_tree.current();

                segment_result_next = this.iterator_segment.next();

                segment_next = segment_result_next.value;

                this.segment_current = segment_next;

                return {
                    value: this.segment_current,
                    done: false
                }
            }

            return {
                value: null,
                done: true
            }
        }
    }
}