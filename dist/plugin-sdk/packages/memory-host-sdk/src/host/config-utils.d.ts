export { splitShellArgs } from "./openclaw-runtime-io.js";
/** Chat shape used by memory send-policy matching. */
export type ChatType = "direct" | "group" | "channel";
/** Memory backend selected by user config. */
export type MemoryBackend = "builtin" | "qmd";
/** Citation injection behavior for memory search results. */
export type MemoryCitationsMode = "auto" | "on" | "off";
/** QMD command mode used for search calls. */
export type MemoryQmdSearchMode = "query" | "search" | "vsearch";
/** QMD startup policy for background indexing. */
export type MemoryQmdStartupMode = "off" | "idle" | "immediate";
/** Action returned by a session send-policy rule. */
export type SessionSendPolicyAction = "allow" | "deny";
/** Match criteria for one memory send-policy rule. */
export type SessionSendPolicyMatch = {
    channel?: string;
    chatType?: ChatType;
    keyPrefix?: string;
    rawKeyPrefix?: string;
};
/** One ordered rule in session send-policy config. */
export type SessionSendPolicyRule = {
    action: SessionSendPolicyAction;
    match?: SessionSendPolicyMatch;
};
/** Memory send-policy config with default action and ordered rules. */
export type SessionSendPolicyConfig = {
    default?: SessionSendPolicyAction;
    rules?: SessionSendPolicyRule[];
};
/** QMD collection path plus optional display name and glob pattern. */
export type MemoryQmdIndexPath = {
    path: string;
    name?: string;
    pattern?: string;
};
/** QMD mcporter daemon integration config. */
export type MemoryQmdMcporterConfig = {
    enabled?: boolean;
    serverName?: string;
    startDaemon?: boolean;
};
/** QMD session export config. */
export type MemoryQmdSessionConfig = {
    enabled?: boolean;
    exportDir?: string;
    retentionDays?: number;
};
/** QMD update, debounce, startup, and timeout config. */
export type MemoryQmdUpdateConfig = {
    interval?: string;
    debounceMs?: number;
    onBoot?: boolean;
    startup?: MemoryQmdStartupMode;
    startupDelayMs?: number;
    waitForBootSync?: boolean;
    embedInterval?: string;
    commandTimeoutMs?: number;
    updateTimeoutMs?: number;
    embedTimeoutMs?: number;
};
/** Search and injection limits for QMD memory results. */
export type MemoryQmdLimitsConfig = {
    maxResults?: number;
    maxSnippetChars?: number;
    maxInjectedChars?: number;
    timeoutMs?: number;
};
/** Full QMD-backed memory config. */
export type MemoryQmdConfig = {
    command?: string;
    mcporter?: MemoryQmdMcporterConfig;
    searchMode?: MemoryQmdSearchMode;
    rerank?: boolean;
    searchTool?: string;
    includeDefaultMemory?: boolean;
    paths?: MemoryQmdIndexPath[];
    sessions?: MemoryQmdSessionConfig;
    update?: MemoryQmdUpdateConfig;
    limits?: MemoryQmdLimitsConfig;
    scope?: SessionSendPolicyConfig;
};
/** Top-level memory config shared by host and runtime callers. */
export type MemoryConfig = {
    backend?: MemoryBackend;
    citations?: MemoryCitationsMode;
    qmd?: MemoryQmdConfig;
};
/** Per-agent memory search enablement and extra collection paths. */
export type MemorySearchConfig = {
    enabled?: boolean;
    extraPaths?: string[];
    qmd?: {
        extraCollections?: MemoryQmdIndexPath[];
    };
};
/** Agent context limits that bound memory file reads. */
export type AgentContextLimitsConfig = {
    memoryGetMaxChars?: number;
    memoryGetDefaultLines?: number;
};
/** Secret reference accepted by provider header config. */
export type SecretInput = string | {
    source: string;
    provider: string;
    id: string;
};
/** Agent-level config fields consumed by memory host helpers. */
type AgentConfig = {
    id?: string;
    default?: boolean;
    workspace?: string;
    memorySearch?: MemorySearchConfig;
    contextLimits?: AgentContextLimitsConfig;
};
/** Narrow OpenClaw config shape consumed by memory host utilities. */
export type OpenClawConfig = {
    agents?: {
        defaults?: {
            workspace?: string;
            memorySearch?: MemorySearchConfig;
            contextLimits?: AgentContextLimitsConfig;
        };
        list?: AgentConfig[];
    };
    memory?: MemoryConfig;
    models?: {
        providers?: Record<string, {
            api?: string;
            baseUrl?: string;
            headers?: Record<string, SecretInput>;
        }>;
    };
};
/** Root memory filename used in agent workspaces. */
export declare const CANONICAL_ROOT_MEMORY_FILENAME = "MEMORY.md";
/** Normalize user or config agent ids to the filesystem-safe canonical form. */
export declare function normalizeAgentId(value: string | undefined | null): string;
/** Resolve absolute user paths, including "~" against the effective OpenClaw home. */
export declare function resolveUserPath(input: string, env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/** Resolve the current state root while preserving shipped legacy installs when present. */
export declare function resolveStateDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/** Resolve the workspace directory for an agent id and config defaults. */
export declare function resolveAgentWorkspaceDir(cfg: OpenClawConfig, agentId: string, env?: NodeJS.ProcessEnv): string;
/** Resolve context limits for an agent with defaults fallback. */
export declare function resolveAgentContextLimits(cfg: OpenClawConfig | undefined, agentId?: string | null): AgentContextLimitsConfig | undefined;
/** Resolve enabled memory search config plus deduplicated extra paths for an agent. */
export declare function resolveMemorySearchConfig(cfg: OpenClawConfig, agentId: string): {
    enabled: boolean;
    extraPaths: string[];
} | null;
/** Parse compact duration strings such as "500ms", "5s", or "1h30m" into milliseconds. */
export declare function parseDurationMs(raw: string, opts?: {
    defaultUnit?: "ms" | "s" | "m" | "h" | "d";
}): number;
