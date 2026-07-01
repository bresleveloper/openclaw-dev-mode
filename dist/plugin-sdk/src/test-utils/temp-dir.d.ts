/** Runs a test body in a temporary directory and removes it afterward. */
export declare function withTempDir<T>(prefix: string, run: (dir: string) => Promise<T>): Promise<T>;
