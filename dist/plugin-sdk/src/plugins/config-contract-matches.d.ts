export type PluginConfigContractMatch = {
    /** Concrete config path matched by the contract pattern. */
    path: string;
    /** Config value stored at the matched path. */
    value: unknown;
};
/** Collect concrete config values that match a plugin contract path pattern. */
export declare function collectPluginConfigContractMatches(params: {
    root: unknown;
    pathPattern: string;
}): PluginConfigContractMatch[];
