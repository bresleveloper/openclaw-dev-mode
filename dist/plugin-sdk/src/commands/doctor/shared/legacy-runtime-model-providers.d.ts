type LegacyRuntimeModelProviderAlias = {
    /** Legacy provider id that encoded the runtime in the model ref. */
    legacyProvider: string;
    /** Canonical provider id that should own model selection. */
    provider: string;
    /** Runtime/backend id selected for the migrated ref. */
    runtime: string;
    /** True when the runtime is a CLI backend rather than an embedded harness. */
    cli: boolean;
    /** True when doctor must write a runtime policy even if the target runtime is the default. */
    requiresRuntimePolicy: boolean;
};
/** List legacy model-provider aliases that doctor can migrate to provider/runtime policy. */
export declare function listLegacyRuntimeModelProviderAliases(): readonly LegacyRuntimeModelProviderAlias[];
/** Return true when a legacy provider alias requires writing explicit runtime policy. */
export declare function legacyRuntimeModelAliasRequiresRuntimePolicy(provider: string): boolean;
/** Rewrite a legacy runtime-encoded model ref to canonical provider/model plus runtime intent. */
export declare function migrateLegacyRuntimeModelRef(raw: string): {
    ref: string;
    legacyProvider: string;
    provider: string;
    model: string;
    runtime: string;
    cli: boolean;
} | null;
export {};
