/** Creates a WeakMap-backed runtime registry keyed by SessionManager object identity. */
export declare function createSessionManagerRuntimeRegistry<TValue>(): {
    set: (sessionManager: unknown, value: TValue | null) => void;
    get: (sessionManager: unknown) => TValue | null;
};
