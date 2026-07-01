import { loadPersistedAuthProfileStore } from "../agents/auth-profiles/persisted.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { DoctorPrompter } from "./doctor-prompter.js";
type LegacyFlatAuthProfileRepairResult = {
    detected: string[];
    changes: string[];
    configChanged?: boolean;
    warnings: string[];
};
/**
 * Imports legacy auth profile JSON and state files into the per-agent SQLite store.
 *
 * JSON files are backed up and removed only after import. OAuth profiles that still depend on
 * unresolved sidecar secrets are kept in JSON so the sidecar migration can run first.
 */
export declare function maybeMigrateAuthProfileJsonStoresToSqlite(params: {
    cfg: OpenClawConfig;
    prompter: Pick<DoctorPrompter, "confirmAutoFix">;
    now?: () => number;
    env?: NodeJS.ProcessEnv;
    deps?: {
        loadPersistedAuthProfileStore?: typeof loadPersistedAuthProfileStore;
    };
}): Promise<LegacyFlatAuthProfileRepairResult>;
/**
 * Rewrites pre-versioned flat auth profile JSON into canonical profile stores.
 *
 * Also lifts aws-sdk profile markers into config because those entries are routing metadata, not
 * credentials, and the runtime no longer treats them as stored secrets.
 */
export declare function maybeRepairLegacyFlatAuthProfileStores(params: {
    cfg: OpenClawConfig;
    prompter: DoctorPrompter;
    now?: () => number;
    env?: NodeJS.ProcessEnv;
}): Promise<LegacyFlatAuthProfileRepairResult>;
/**
 * Repairs auth profile JSON that used the historical "api_key" credential field.
 *
 * Runtime parsing reads "key" or "keyRef"; doctor preserves the original file as a backup before
 * moving the alias into the canonical key slot.
 */
export declare function maybeRepairCanonicalApiKeyFieldAlias(params: {
    cfg: OpenClawConfig;
    prompter: DoctorPrompter;
    now?: () => number;
    env?: NodeJS.ProcessEnv;
}): Promise<LegacyFlatAuthProfileRepairResult>;
/**
 * Canonicalizes config references from the legacy OpenAI Codex provider id to OpenAI.
 *
 * The optional map lets config and store repairs share deterministic profile ids when both surfaces
 * contain the same legacy profile.
 */
export declare function maybeRepairOpenAICodexAuthConfig(cfg: OpenClawConfig, options?: {
    profileIdMap?: ReadonlyMap<string, string>;
}): {
    config: OpenClawConfig;
    changes: string[];
    warnings: string[];
};
/** Collects deterministic legacy-to-canonical OpenAI profile ids across all agent stores. */
export declare function collectOpenAICodexAuthProfileStoreIdMap(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
}): Map<string, string>;
/**
 * Rewrites legacy OpenAI Codex auth profiles in JSON stores to the canonical OpenAI provider id.
 */
export declare function maybeRepairOpenAICodexAuthProfileStores(params: {
    cfg: OpenClawConfig;
    now?: () => number;
    env?: NodeJS.ProcessEnv;
}): Promise<LegacyFlatAuthProfileRepairResult>;
export {};
