type LegacyInternalHookHandler = {
    event: string;
    module: string;
    export?: string;
};
/** Read legacy hooks.internal.handlers entries for backward-compatible config detection. */
export declare function getLegacyInternalHookHandlers(config: unknown): LegacyInternalHookHandler[];
export {};
