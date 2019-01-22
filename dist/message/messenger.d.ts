export declare namespace message {
    type Env = 'max' | 'node';
    class Messenger {
        private env;
        private outlet;
        constructor(env: Env, outlet: number);
        message(message: string): void;
        message_max(message: string): void;
        message_node(message: string): void;
    }
}
