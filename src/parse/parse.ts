export namespace parse {
    export interface Parsable {
        choose(): boolean;
        // TODO: figure out how to annotate
        get_best_candidate(list_candidate_note);
    }
}