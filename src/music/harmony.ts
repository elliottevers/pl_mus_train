import {note as n} from "../note/note";
import TreeModel = require("tree-model");
import {target} from "../target/target";
import {history} from "../history/history";
const _ = require('underscore');

export namespace harmony {
    import TypeTarget = history.TypeTarget;

    export class Harmony {
        public static group(notes: TreeModel.Node<n.Note>[]): TreeModel.Node<n.Note>[][] {
            // TODO: should probably factor in beat end as well, but this works for now
            let grouped = _.groupBy(notes, (note) => {
                return note.model.note.beat_start
            });

            let notes_grouped: TreeModel.Node<n.Note>[][] = [];

            for (let beat_start in grouped) {
                notes_grouped.push(
                    grouped[beat_start]
                )
            }

            return notes_grouped
        }

        public static monophonify(notes: TreeModel.Node<n.Note>[]): TypeTarget {
            function compare(note_former,note_latter) {
                if (note_former.model.note.beat_start < note_latter.model.note.beat_start)
                    return -1;
                if (note_former.model.note.beat_start > note_latter.model.note.beat_start)
                    return 1;
                return 0;
            }

            notes.sort(compare);

            let length_beats = notes[notes.length - 1].model.note.get_beat_end() - notes[0].model.note.beat_start;

            let duration_monophonic = length_beats/notes.length;

            let beat_current = notes[0].model.note.beat_start;

            let notes_monophonic: TreeModel.Node<n.Note>[] = [];

            let tree: TreeModel = new TreeModel();

            for (let note of notes) {
                notes_monophonic.push(
                    tree.parse(
                        {
                            id: -1, // TODO: hashing scheme for clip id and beat start
                            note: new n.Note(
                                note.model.note.pitch,
                                beat_current,
                                duration_monophonic,
                                note.model.note.velocity,
                                note.model.note.muted
                            ),
                            children: [

                            ]
                        }
                    )
                );
                beat_current = beat_current + duration_monophonic
            }

            return notes_monophonic;
        }

        public static arpeggiate(notes) {
            let chords_grouped: TypeTarget[] = Harmony.group(
                notes
            );

            let chords_monophonified: TypeTarget[] = [];

            for (let chord of chords_grouped) {
                let notes_monophonified: TypeTarget = Harmony.monophonify(
                    chord
                );

                chords_monophonified.push(notes_monophonified)
            }

            return chords_monophonified;
        }
    }
}
