export declare namespace Log {
    class Logger {
        env: string;
        constructor(env: string);
        log(message: string): void;
        log_max(...args: any[]): void;
        log_node(...args: any[]): void;
    }
}
