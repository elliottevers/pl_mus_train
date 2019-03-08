export namespace utils {

    export class PathLive  {

        // pre-sending message
        public static to_vector(path_live: string) {
            let message = [];

            for (let word of path_live.split(' ')) {
                let cleansed = word.replace(/"/g, "");

                if (isNaN(Number(cleansed))) {
                    message.push(cleansed)
                } else {
                    message.push(Number(cleansed))
                }
            }

            return message
        }

        public static to_message(path_live: string) {
            return PathLive.to_vector(path_live)
        }

        // parsing sent message
        public static to_string(vector_path_live: string[]) {
            return PathLive.to_message(vector_path_live.join(' ')).join(' ');
        }
    }

    export let remainder = (top, bottom) => {
        return ((top % bottom) + bottom) % bottom
    };

    export let division_int = (top, bottom) => {
        return Math.floor(top/bottom)
    };

}
