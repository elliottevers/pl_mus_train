import TreeModel = require("tree-model");
import { message as m } from "../message/messenger";
import { clip as c } from "../clip/clip";
import { note as n } from "../note/note";
export declare namespace window {
    class Pwindow {
        height: number;
        width: number;
        messenger: m.Messenger;
        clips: c.Clip[];
        beats_per_measure: number;
        root_parse_tree: TreeModel.Node<n.Note>;
        list_leaves_current: TreeModel.Node<n.Note>[];
        constructor(height: number, width: number, messenger: m.Messenger);
        get_num_measures_clip(): number;
        get_centroid(node: TreeModel.Node<n.Note>): number[];
        add_clip(clip: c.Clip): void;
        get_diff_notes(notes_parent: TreeModel.Node<n.Note>[], notes_child: TreeModel.Node<n.Note>[]): {
            'parent': any;
            'child': any;
        };
        render_tree(): void;
        get_messages_render_tree(): any[];
        private add_layer;
        render_clips(): void;
        get_messages_render_clips(): any[];
        get_messages_render_notes(index_clip: number): string[][];
        get_position_quadruplet(node: TreeModel.Node<n.Note>, index_clip: number): any[];
        get_dist_from_top(pitch: number, index_clip: number): number;
        beat_to_pixel: (beat: number) => number;
        get_dist_from_left(beat: number): number;
        get_height_clip(): number;
        get_height_note(index_clip: number): number;
        get_ambitus(index_clip: number): number[];
    }
}
