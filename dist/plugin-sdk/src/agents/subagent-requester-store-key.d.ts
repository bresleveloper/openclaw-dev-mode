type RequesterStoreKeyConfig = {
    session?: {
        mainKey?: string;
    };
    agents?: {
        list?: Array<{
            id?: string;
            default?: boolean;
        }>;
    };
};
/** Resolve the canonical store key for a subagent requester session. */
export declare function resolveRequesterStoreKey(cfg: RequesterStoreKeyConfig | undefined, requesterSessionKey: string): string;
export {};
