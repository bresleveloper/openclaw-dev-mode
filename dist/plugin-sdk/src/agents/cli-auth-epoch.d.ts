import { loadAuthProfileStoreForRuntime } from "./auth-profiles/store.js";
import { readClaudeCliCredentialsCached, readCodexCliCredentialsCached, readGeminiCliCredentialsCached } from "./cli-credentials.js";
type CliAuthEpochDeps = {
    readClaudeCliCredentialsCached: typeof readClaudeCliCredentialsCached;
    readCodexCliCredentialsCached: typeof readCodexCliCredentialsCached;
    readGeminiCliCredentialsCached: typeof readGeminiCliCredentialsCached;
    loadAuthProfileStoreForRuntime: typeof loadAuthProfileStoreForRuntime;
};
/** Version salt for CLI auth epoch encoding semantics. */
export declare const CLI_AUTH_EPOCH_VERSION = 6;
/** Overrides credential readers for auth-epoch unit tests. */
export declare function setCliAuthEpochTestDeps(overrides: Partial<CliAuthEpochDeps>): void;
/** Restores default credential readers after auth-epoch unit tests. */
export declare function resetCliAuthEpochTestDeps(): void;
/** Resolves the stable auth epoch hash for a CLI runtime/provider session. */
export declare function resolveCliAuthEpoch(params: {
    provider: string;
    agentDir?: string;
    authProfileId?: string;
    skipLocalCredential?: boolean;
}): Promise<string | undefined>;
export {};
