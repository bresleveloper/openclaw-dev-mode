import type { AuthProfileStore } from "./types.js";
/** Deduplicates profile ids while preserving first-seen order. */
export declare function dedupeProfileIds(profileIds: string[]): string[];
/** Lists auth profile ids whose credential provider matches the requested provider. */
export declare function listProfilesForProvider(store: AuthProfileStore, provider: string): string[];
export declare function resolveSubscriptionAuthModeForProfiles(params: {
    store: AuthProfileStore;
    profileIds: ReadonlyArray<string | undefined>;
}): "oauth" | "token" | undefined;
