import { modelKey } from "../../agents/model-ref-shared.js";
export { modelKey };
/** Alias lookup tables used by `/model` directive resolution. */
export type ModelAliasIndex = {
    byAlias: Map<string, {
        alias: string;
        ref: {
            provider: string;
            model: string;
        };
    }>;
    byKey: Map<string, string[]>;
};
/** Resolved model choice from a `/model` directive. */
export type ModelDirectiveSelection = {
    provider: string;
    model: string;
    isDefault: boolean;
    alias?: string;
};
/** Resolves an explicit model directive string into a provider/model ref. */
export declare function resolveModelRefFromDirectiveString(params: {
    raw: string;
    defaultProvider: string;
    aliasIndex: ModelAliasIndex;
}): {
    ref: {
        provider: string;
        model: string;
    };
    alias?: string;
} | null;
/** Resolves a `/model` directive into an allowlisted model selection or error. */
export declare function resolveModelDirectiveSelection(params: {
    raw: string;
    defaultProvider: string;
    defaultModel: string;
    aliasIndex: ModelAliasIndex;
    allowedModelKeys: Set<string>;
    rawRuntime?: string | undefined;
}): {
    selection?: ModelDirectiveSelection;
    error?: string;
};
