import type { SessionEntry } from "../config/sessions.js";
/** User or automatic model/provider override selection for a session entry. */
export type ModelOverrideSelection = {
    provider: string;
    model: string;
    isDefault?: boolean;
};
/** Applies a model/auth-profile override to a session entry and clears stale runtime fields. */
export declare function applyModelOverrideToSessionEntry(params: {
    entry: SessionEntry;
    selection: ModelOverrideSelection;
    profileOverride?: string;
    profileOverrideSource?: "auto" | "user";
    preserveAuthProfileOverride?: boolean;
    selectionSource?: "auto" | "user";
    markLiveSwitchPending?: boolean;
}): {
    updated: boolean;
};
/** Repairs overrides where legacy provider/model fields were stored as provider/model strings. */
export declare function repairProviderWrappedModelOverride(params: {
    entry: SessionEntry;
    defaultProvider: string;
    defaultModel?: string;
}): {
    updated: boolean;
};
