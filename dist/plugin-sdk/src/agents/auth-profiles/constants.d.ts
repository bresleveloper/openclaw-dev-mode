export { AUTH_PROFILE_FILENAME, } from "./path-constants.js";
/** Current persisted auth profile store schema version. */
export declare const AUTH_STORE_VERSION = 1;
/** @deprecated Anthropic provider-owned CLI profile id; do not use from third-party plugins. */
export declare const CLAUDE_CLI_PROFILE_ID = "anthropic:claude-cli";
/** @deprecated OpenAI provider-owned CLI profile id; do not use from third-party plugins. */
export declare const CODEX_CLI_PROFILE_ID = "openai:codex-cli";
/** Default OpenAI/Codex OAuth profile id used for migrated stores. */
export declare const OPENAI_CODEX_DEFAULT_PROFILE_ID = "openai:default";
/** @deprecated MiniMax provider-owned CLI profile id; do not use from third-party plugins. */
export declare const MINIMAX_CLI_PROFILE_ID = "minimax-portal:minimax-cli";
/** Cross-agent lock policy for shared OAuth refresh operations. */
export declare const OAUTH_REFRESH_LOCK_OPTIONS: {
    readonly retries: {
        readonly retries: 20;
        readonly factor: 2;
        readonly minTimeout: 100;
        readonly maxTimeout: 10000;
        readonly randomize: true;
    };
    readonly stale: 180000;
};
/** Maximum duration for one OAuth refresh call inside the refresh lock. */
export declare const OAUTH_REFRESH_CALL_TIMEOUT_MS = 120000;
/** Freshness window for syncing external CLI auth into auth profiles. */
export declare const EXTERNAL_CLI_SYNC_TTL_MS: number;
/** Auth profile subsystem logger. */
export declare const log: import("../../logging/subsystem.js").SubsystemLogger;
