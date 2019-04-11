"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var parsed_1 = require("./parsed");
var iterate_1 = require("../train/iterate");
var trainable_1 = require("./trainable");
var parse_1 = require("../parse/parse");
var ParseTree = parse_1.parse.ParseTree;
var StructParse = parse_1.parse.StructParse;
var parse;
(function (parse) {
    var Parsed = parsed_1.parsed.Parsed;
    var MatrixIterator = iterate_1.iterate.MatrixIterator;
    var PARSE = trainable_1.trainable.PARSE;
    var Parse = /** @class */ (function (_super) {
        __extends(Parse, _super);
        function Parse() {
            return _super.call(this) || this;
        }
        Parse.prototype.get_name = function () {
            return PARSE;
        };
        Parse.prototype.grow_layer = function (notes_user_input_renderable, notes_to_grow) {
            ParseTree.add_layer(notes_user_input_renderable, notes_to_grow, -1);
        };
        // TODO: we don't need the target track - we should 1) transfer all notes over to user input track and 2) mute the track
        Parse.prototype.initialize_tracks = function (segments, track_target, track_user_input, struct_train) {
            // transfer notes from target track to user input track
            for (var i_segment in segments) {
                var clip_target = track_target.get_clip_at_index(Number(i_segment));
                var clip_user_input = track_user_input.get_clip_at_index(Number(i_segment));
                var notes = clip_target.get_notes(clip_target.get_loop_bracket_lower(), 0, clip_target.get_loop_bracket_upper(), 128);
                clip_user_input.remove_notes(clip_target.get_loop_bracket_lower(), 0, clip_target.get_loop_bracket_upper(), 128);
                clip_user_input.set_notes(notes);
            }
            // mute target track
            track_target.mute();
        };
        // add the root up to which we're going to parse
        // add the segments as the layer below
        // add the leaf notes
        Parse.prototype.initialize_render = function (window, segments, notes_target_track, struct_train) {
            // first layer
            window.add_note_to_clip_root(StructParse.create_root_from_segments(segments));
            // @ts-ignore
            var struct_parse = struct_train;
            struct_parse.regions_renderable.push([-1]);
            var _loop_1 = function (i_segment) {
                var segment_1 = segments[Number(i_segment)];
                var note_segment = segment_1.get_note();
                var coord_current_virtual_second_layer = [0, Number(i_segment)];
                var notes_leaves = notes_target_track.filter(function (node) { return node.model.note.beat_start >= segment_1.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment_1.get_endpoints_loop()[1]; });
                var coord_current_virtual_leaves = [this_1.depth - 1, Number(i_segment)];
                // second layer
                window.add_notes_to_clip([note_segment], this_1.coord_to_index_clip_render(coord_current_virtual_second_layer));
                struct_parse.regions_renderable.push(this_1.coord_to_index_struct_train(coord_current_virtual_second_layer));
                // leaves
                window.add_notes_to_clip(notes_leaves, this_1.coord_to_index_clip_render(coord_current_virtual_leaves));
            };
            var this_1 = this;
            for (var i_segment in segments) {
                _loop_1(i_segment);
            }
            return window;
        };
        Parse.prototype.update_roots = function (coords_roots_previous, coords_notes_previous, coord_notes_current) {
            var coords_roots_new = [];
            var _loop_2 = function (coord_notes_previous) {
                coords_roots_new = coords_roots_new.concat(coords_roots_previous.filter(function (x) {
                    return !(x[0] === coord_notes_previous[0] && x[1] === coord_notes_previous[1]);
                }));
            };
            // remove references to old leaves
            for (var _i = 0, coords_notes_previous_1 = coords_notes_previous; _i < coords_notes_previous_1.length; _i++) {
                var coord_notes_previous = coords_notes_previous_1[_i];
                _loop_2(coord_notes_previous);
            }
            // add references to new leaves
            coords_roots_new.push(coord_notes_current);
            return coords_roots_new;
        };
        Parse.prototype.get_coords_notes_to_grow = function (coord_notes_input_current) {
            return MatrixIterator.get_coords_below([coord_notes_input_current[0], coord_notes_input_current[1]]);
        };
        // adding the leaf notes to the actual parse tree
        // DO NOT set the root or the segments as nodes immediately below that - do that at the end
        // set the leaf notes as the notes in the target track
        Parse.prototype.preprocess_struct_parse = function (struct_parse, segments, notes_target_track) {
            // this is to set the leaves as the notes of the target clip
            var _loop_3 = function (i_segment) {
                var segment_2 = segments[Number(i_segment)];
                var notes = notes_target_track.filter(function (node) { return node.model.note.beat_start >= segment_2.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment_2.get_endpoints_loop()[1]; });
                var coord_parse_current_virtual_leaf = [this_2.depth - 1, Number(i_segment)];
                struct_parse.add(notes, coord_parse_current_virtual_leaf, this_2, true);
            };
            var this_2 = this;
            for (var i_segment in segments) {
                _loop_3(i_segment);
            }
            return struct_parse;
        };
        Parse.prototype.finish_parse = function (struct_parse, segments) {
            var coords_to_grow = [];
            // make connections with segments
            for (var i_segment in segments) {
                coords_to_grow.push([0, Number(i_segment)]);
                var segment_3 = segments[Number(i_segment)];
                struct_parse.add([segment_3.get_note()], [0, Number(i_segment)], this);
            }
            struct_parse.set_root(StructParse.create_root_from_segments(segments));
            for (var _i = 0, coords_to_grow_1 = coords_to_grow; _i < coords_to_grow_1.length; _i++) {
                var coord_to_grow = coords_to_grow_1[_i];
                var notes_to_grow = struct_parse.get_notes_at_coord(coord_to_grow);
                this.grow_layer([struct_parse.get_root()], notes_to_grow);
            }
            struct_parse.coords_roots = this.update_roots(struct_parse.coords_roots, coords_to_grow, [-1]);
        };
        // segments layer and leaves layer don't count
        Parse.prototype.get_num_layers_input = function () {
            return this.depth - 2;
        };
        Parse.prototype.get_num_layers_clips_to_render = function () {
            return this.depth + 1;
        };
        return Parse;
    }(Parsed));
    parse.Parse = Parse;
})(parse = exports.parse || (exports.parse = {}));
//# sourceMappingURL=parse.js.map