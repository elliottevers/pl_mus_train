export namespace utils {

    export let cleanse_id = (string_id): string => {
        return String(string_id).split(',').join(' ')
    };

    // accepts a path directly from the DAO object
    export let cleanse_path = (path): string => {
        return String(path).split(' ').map((text) => {
            return text.replace('\"', '')
        }).join(' ')
    };

    export let get_path_track_from_path_device = (path) => {
        return path.split(' ').slice(0, 3).join(' ');
    };

    export let remainder = (top, bottom) => {
        return ((top % bottom) + bottom) % bottom
    };

    export let division_int = (top, bottom) => {
        return Math.floor(top/bottom)
    };
}
