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
var derive;
(function (derive) {
    var Parsed = parsed_1.parsed.Parsed;
    var MatrixIterator = iterate_1.iterate.MatrixIterator;
    var DERIVE = trainable_1.trainable.DERIVE;
    var ParseTree = parse_1.parse.ParseTree;
    var StructParse = parse_1.parse.StructParse;
    var Derive = /** @class */ (function (_super) {
        __extends(Derive, _super);
        function Derive() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Derive.prototype.get_name = function () {
            return DERIVE;
        };
        Derive.prototype.get_coords_notes_to_grow = function (coords_note_input_current) {
            return MatrixIterator.get_coords_above([coords_note_input_current[0], coords_note_input_current[1]]);
        };
        Derive.prototype.grow_layer = function (notes_user_input_renderable, notes_to_grow) {
            ParseTree.add_layer(notes_to_grow, notes_user_input_renderable, -1);
        };
        Derive.prototype.initialize_tracks = function (segments, track_target, track_user_input, struct_train) {
            track_target.mute();
        };
        Derive.prototype.preprocess_struct_parse = function (struct_parse, segments) {
            // add the root to the tree immediately
            struct_parse.set_root(ParseTree.create_root_from_segments(segments));
            for (var i_segment in segments) {
                var segment_1 = segments[Number(i_segment)];
                var note_1 = segment_1.get_note();
                var coord_current_virtual = [0, Number(i_segment)];
                struct_parse.add([note_1], coord_current_virtual, this);
            }
            return struct_parse;
        };
        Derive.prototype.initialize_render = function (window, segments, notes_target_track, struct_train) {
            // first layer (root)
            window.add_note_to_clip_root(StructParse.create_root_from_segments(segments));
            for (var i_segment in segments) {
                var segment_2 = segments[Number(i_segment)];
                var note_segment = segment_2.get_note();
                var coord_current_virtual_second_layer = [0, Number(i_segment)];
                // second layer
                window.add_notes_to_clip([note_segment], this.coord_to_index_clip_render(coord_current_virtual_second_layer));
            }
            return window;
        };
        Derive.prototype.finish_parse = function (struct_parse, segments) {
            return;
        };
        Derive.prototype.update_roots = function (coords_roots_previous, coords_notes_previous, coord_notes_current) {
            return coords_roots_previous;
        };
        // the layer of segments don't count
        Derive.prototype.get_num_layers_input = function () {
            return this.depth - 1;
        };
        Derive.prototype.get_num_layers_clips_to_render = function () {
            return this.depth + 1;
        };
        return Derive;
    }(Parsed));
    derive.Derive = Derive;
})(derive = exports.derive || (exports.derive = {}));
//# sourceMappingURL=derive.js.map