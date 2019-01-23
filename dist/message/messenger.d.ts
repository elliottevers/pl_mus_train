export declare namespace message {
    class Messenger {
        private env;
        private outlet;
        constructor(env: string, outlet: number);
        message(message: string): void;
        message_max(message: string): void;
        message_node(message: string): void;
    }
}
