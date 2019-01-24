"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var window;
(function (window) {
    var Pwindow = /** @class */ (function () {
        function Pwindow(height, width, messenger) {
            this.beat_to_pixel = function (beat) {
                var num_pixels_in_clip = this.width;
                var num_beats_in_clip = this.get_num_measures_clip() * this.beats_per_measure;
                return beat * (num_pixels_in_clip / num_beats_in_clip);
            };
            this.height = height;
            this.width = width;
            this.messenger = messenger;
            this.clips = [];
            // this.grans_per_measure = 24; // sixteenth and sixteenth triplets quantization
            this.beats_per_measure = 4;
            this.root_parse_tree = null;
            this.list_leaves_current = null;
            // need to count number of measures in clip
            // then multiply that by 24 = granule/measure
            // this is the min size of window in pixels
            // make the width be an integer multiple of this, for convenience
        }
        // NB: this makes the assumption that the end marker is at the end of the clip
        Pwindow.prototype.get_num_measures_clip = function () {
            return this.clips[0].get_num_measures();
        };
        // TODO: make node have indices to both clip and note
        Pwindow.prototype.get_centroid = function (node) {
            var dist_from_left_beat_start, dist_from_left_beat_end, dist_from_top_note_top, dist_from_top_note_bottom;
            // var index_clip = node.get_index_clip();
            // var index_note = node.get_index_note();
            // var clip = this.clips[index_clip];
            // clip.load_notes();
            // var note = clip.get_notes()[index_note];
            var index_clip = node.depth;
            // TODO: determine how to get the index of the clip from just depth of the node
            dist_from_left_beat_start = this.get_dist_from_left(node.model.note.beat_start);
            dist_from_left_beat_end = this.get_dist_from_left(node.model.note.beat_start + node.model.note.beats_duration);
            dist_from_top_note_top = this.get_dist_from_top(node.model.note.pitch, index_clip);
            dist_from_top_note_bottom = this.get_dist_from_top(node.model.note.pitch - 1, index_clip);
            return [
                dist_from_left_beat_end - ((dist_from_left_beat_end - dist_from_left_beat_start) / 2),
                dist_from_top_note_bottom - ((dist_from_top_note_bottom - dist_from_top_note_top) / 2)
            ];
        };
        ;
        // TODO: add capability to automatically determine parent/children relationships between adjacent tracks
        Pwindow.prototype.add_clip = function (clip) {
            this.clips.push(clip);
            // if (this.clips.length === 1) {
            //     // TODO: fix this, we're assuming the first clip has only the root note for now
            //     // let tree: TreeModel = new TreeModel();
            //     // this.root_parse_tree = tree.parse(
            //     //     {
            //     //         id: -1, // TODO: hashing scheme for clip id and beat start
            //     //         note: clip.get_notes()[0],
            //     //         children: []
            //     //     }
            //     // );
            //     this.root_parse_tree = clip.get_notes()[0];
            //     this.list_leaves_current = [
            //         this.root_parse_tree
            //     ];
            //     return
            // }
            // var notes_parent: TreeModel.Node<n.Note>[] = this.list_leaves_current;
            // var notes_child: TreeModel.Node<n.Note>[] = clip.get_notes();
            // var notes_diff = this.get_diff_notes(notes_parent, notes_child);
            // var notes_parent_diff = notes_diff['parent'];
            // var notes_child_diff = notes_diff['child'];
            // this.list_leaves_current = this.add_layer(notes_parent_diff, notes_child_diff);
        };
        ;
        // TODO: complete return signature
        Pwindow.prototype.get_diff_notes = function (notes_parent, notes_child) {
            var same_start, same_duration, notes_parent_diff, notes_child_diff, index_start_diff, index_end_diff;
            for (var i = 0; i < notes_child.length; i++) {
                same_start = (notes_child[i].model.note.beat_start === notes_parent[i].model.note.beat_start);
                same_duration = (notes_child[i].model.note.beats_duration === notes_parent[i].model.note.beats_duration);
                if (!(same_start && same_duration)) {
                    index_start_diff = i;
                    break;
                }
            }
            for (var i = -1; i > -1 * (notes_child.length + 1); i--) {
                same_start = (notes_child.slice(i)[0].model.note.beat_start === notes_parent.slice(i)[0].model.note.beat_start);
                same_duration = (notes_child.slice(i)[0].model.note.beats_duration === notes_parent.slice(i)[0].model.note.beats_duration);
                if (!(same_start && same_duration)) {
                    index_end_diff = i;
                    break;
                }
            }
            notes_parent_diff = notes_parent.slice(index_start_diff, notes_parent.length + 1 - index_end_diff);
            notes_child_diff = notes_child.slice(index_start_diff, notes_child.length + 1 - index_end_diff);
            // TODO: write signature
            return {
                'parent': notes_parent_diff,
                'child': notes_child_diff
            };
        };
        ;
        Pwindow.prototype.render_tree = function () {
            var messages = this.get_messages_render_tree();
            for (var i = 0; i < messages.length; i++) {
                this.messenger.message(messages[i]);
            }
        };
        ;
        // TODO: how do we render when there is no singular root (i.e. parsing, not sampling, sentence)?
        Pwindow.prototype.get_messages_render_tree = function () {
            var _this = this;
            var messages = [];
            this.root_parse_tree.walk(function (node) {
                if (node.hasChildren()) {
                    for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                        var child = _a[_i];
                        messages.push([
                            "linesegment",
                            _this.get_centroid(child)[0],
                            _this.get_centroid(child)[1],
                            _this.get_centroid(node)[0],
                            _this.get_centroid(node)[1]
                        ]);
                    }
                }
                return true;
            });
            // isRoot(): boolean;
            // hasChildren(): boolean;
            // addChild(child: Node<T>): Node<T>;
            // addChildAtIndex(child: Node<T>, index: number): Node<T>;
            // setIndex(index: number): Node<T>;
            // getPath(): Array<Node<T>>;
            // getIndex(): number;
            //
            // walk(options: Options, fn: NodeVisitorFunction<T>, ctx?: object): void;
            // walk(fn: NodeVisitorFunction<T>, ctx?: object): void;
            //
            // all(options: Options, fn: NodeVisitorFunction<T>, ctx?: object): Array<Node<T>>;
            // all(fn: NodeVisitorFunction<T>, ctx?: object): Array<Node<T>>;
            //
            // first(options: Options, fn: NodeVisitorFunction<T>, ctx?: object): Node<T> | undefined;
            // first(fn: NodeVisitorFunction<T>, ctx?: object): Node<T> | undefined;
            //
            // drop(): Node<T>;
            // this.parse_tree.traverseDown(iterator.bind(this));
            return messages;
        };
        ;
        // NB: only works top down currently
        Pwindow.prototype.add_layer = function (notes_parent, notes_child) {
            // // TODO: fix this, we're assuming the first clip has only the root note for now
            // if (notes_parents === null) {
            //     this.parse_tree = new tr.Tree(null, notes_parents[0]);
            //     return notes_parents;
            // }
            var note_parent_best, b_successful;
            var num_successes = 0;
            for (var _i = 0, notes_child_1 = notes_child; _i < notes_child_1.length; _i++) {
                var node = notes_child_1[_i];
                note_parent_best = node.model.note.get_best_candidate(notes_parent);
                b_successful = node.model.note.choose();
                if (b_successful) {
                    note_parent_best.addChild(node);
                    num_successes += 1;
                }
            }
            var b_layer_successful = (num_successes === notes_child.length);
            if (b_layer_successful) {
                return notes_child; // new leaves
            }
            else {
                throw 'adding layer unsuccessful';
            }
        };
        ;
        Pwindow.prototype.render_clips = function () {
            var messages = this.get_messages_render_clips();
            for (var i = 0; i < messages.length; i++) {
                this.messenger.message(messages[i]);
            }
        };
        ;
        // TODO: return signature
        Pwindow.prototype.get_messages_render_clips = function () {
            var messages = [];
            for (var index_clip in this.clips) {
                messages = messages.concat(this.get_messages_render_notes(Number(index_clip)));
            }
            return messages;
        };
        ;
        Pwindow.prototype.get_messages_render_notes = function (index_clip) {
            var clip = this.clips[index_clip];
            var quadruplets = [];
            for (var _i = 0, _a = clip.get_notes(); _i < _a.length; _i++) {
                var node = _a[_i];
                quadruplets.push(this.get_position_quadruplet(node, index_clip));
            }
            return quadruplets.map(function (tuplet) {
                return ["paintrect"].concat(tuplet);
            });
        };
        ;
        Pwindow.prototype.get_position_quadruplet = function (node, index_clip) {
            var dist_from_left_beat_start, dist_from_top_note_top, dist_from_left_beat_end, dist_from_top_note_bottom;
            dist_from_left_beat_start = this.get_dist_from_left(node.model.note.beat_start);
            dist_from_left_beat_end = this.get_dist_from_left(node.model.note.beat_start + node.model.note.beats_duration);
            dist_from_top_note_top = this.get_dist_from_top(node.model.note.pitch, index_clip);
            dist_from_top_note_bottom = this.get_dist_from_top(node.model.note.pitch - 1, index_clip);
            return [dist_from_left_beat_start, dist_from_top_note_top, dist_from_left_beat_end, dist_from_top_note_bottom];
        };
        ;
        Pwindow.prototype.get_dist_from_top = function (pitch, index_clip) {
            var clip = this.clips[index_clip];
            var offset = index_clip;
            // TODO: make this configurable
            if (false) {
                offset = this.clips.length - 1 - index_clip;
            }
            var dist = (clip.get_pitch_max() - pitch) * this.get_height_note(index_clip);
            return dist + (this.get_height_clip() * offset);
        };
        ;
        Pwindow.prototype.get_dist_from_left = function (beat) {
            return this.beat_to_pixel(beat);
        };
        ;
        Pwindow.prototype.get_height_clip = function () {
            return this.height / this.clips.length;
        };
        ;
        Pwindow.prototype.get_height_note = function (index_clip) {
            var ambitus = this.get_ambitus(index_clip);
            var dist_pitch = ambitus[1] - ambitus[0] + 1;
            return this.get_height_clip() / dist_pitch;
        };
        ;
        Pwindow.prototype.get_ambitus = function (index_clip) {
            return this.clips[index_clip].get_ambitus();
        };
        ;
        return Pwindow;
    }());
    window.Pwindow = Pwindow;
})(window = exports.window || (exports.window = {}));
//# sourceMappingURL=window.js.map