export type TempHomeEnv = {
    home: string;
    restore: () => Promise<void>;
};
/** Creates a temporary OpenClaw home and process env override for stateful tests. */
export declare function createTempHomeEnv(prefix: string): Promise<TempHomeEnv>;
