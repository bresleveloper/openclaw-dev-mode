import type { SessionsListParams } from "../../packages/gateway-protocol/src/index.js";
import { type ModelCatalogEntry } from "../agents/model-catalog.js";
import { buildSubagentRunReadIndex } from "../agents/subagent-registry-read.js";
import { listThinkingLevelOptions } from "../auto-reply/thinking.js";
import { type SessionEntry, type SessionScope } from "../config/sessions.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ModelCostConfig } from "../utils/usage-format.js";
import type { GatewayAgentRow, GatewaySessionRow, GatewaySessionsDefaults, SessionsListResult } from "./session-utils.types.js";
export { archiveFileOnDisk, archiveSessionTranscripts, resolveSessionHistoryTranscriptPathAsync, resolveSessionTranscriptCandidates, } from "./session-utils.fs.js";
export { attachOpenClawTranscriptMeta, capArrayByJsonBytes, readFirstUserMessageFromTranscript, readLatestSessionUsageFromTranscriptAsync, readLatestRecentSessionUsageFromTranscriptAsync, readRecentSessionUsageFromTranscriptAsync, readRecentSessionMessagesAsync, readRecentSessionMessagesWithStatsAsync, readRecentSessionTranscriptLines, readRecentSessionUsageFromTranscript, readSessionMessageByIdAsync, readSessionMessageCountAsync, readSessionTitleFieldsFromTranscript, readSessionTitleFieldsFromTranscriptAsync, readSessionPreviewItemsFromTranscript, readSessionMessagesAsync, readSessionMessagesWithSourceAsync, visitSessionMessagesAsync, } from "./session-transcript-readers.js";
export type { ReadSessionMessagesAsyncOptions, SessionTranscriptReadScope, } from "./session-transcript-readers.js";
export { canonicalizeSpawnedByForAgent, resolveSessionStoreKey } from "./session-store-key.js";
export type { GatewayAgentRow, GatewaySessionRow, GatewaySessionsDefaults, SessionsListResult, SessionsPatchResult, SessionsPreviewEntry, SessionsPreviewResult, } from "./session-utils.types.js";
export declare function deriveSessionTitle(entry: SessionEntry | undefined, firstUserMessage?: string | null): string | undefined;
type SessionListRowContext = {
    subagentRuns: ReturnType<typeof buildSubagentRunReadIndex>;
    storeChildSessionsByKey: Map<string, string[]>;
    selectedModelByOverrideRef: Map<string, ReturnType<typeof resolveSessionModelRef>>;
    thinkingMetadataByModelRef: Map<string, {
        levels: ReturnType<typeof listThinkingLevelOptions>;
        defaultLevel: ReturnType<typeof resolveGatewaySessionThinkingDefault>;
    }>;
    displayModelIdentityByKey: Map<string, {
        provider?: string;
        model?: string;
    }>;
    modelCostConfigByModelRef: Map<string, ModelCostConfig | undefined>;
};
type SessionListRowContextProvider = () => SessionListRowContext;
export type GatewaySessionStoreTarget = {
    agentId: string;
    storePath: string;
    canonicalKey: string;
    storeKeys: string[];
};
export type GatewaySessionStoreTargetWithStore = GatewaySessionStoreTarget & {
    store: Record<string, SessionEntry>;
};
/**
 * Returns the owning agent id if the session key belongs to an agent that is no
 * longer present in config (deleted). Returns null for non-agent legacy/global
 * keys, confirmed ACP runtime session keys, or when the owning agent still
 * exists (#65524).
 */
export declare function resolveDeletedAgentIdFromSessionKey(cfg: OpenClawConfig, sessionKey: string, entry?: SessionEntry | null, options?: {
    acpMetadataSessionKey?: string | null;
}): string | null;
export declare function loadSessionEntry(sessionKey: string, opts?: {
    agentId?: string;
    clone?: boolean;
}): {
    cfg: OpenClawConfig;
    storePath: string;
    store: Record<string, SessionEntry>;
    entry: SessionEntry | undefined;
    canonicalKey: string;
    storeKeys: string[];
    legacyKey: string | undefined;
};
export declare function resolveFreshestSessionStoreMatchFromStoreKeys(store: Record<string, SessionEntry>, storeKeys: string[]): {
    key: string;
    entry: SessionEntry;
} | undefined;
export declare function resolveFreshestSessionEntryFromStoreKeys(store: Record<string, SessionEntry>, storeKeys: string[]): SessionEntry | undefined;
/**
 * Remove legacy key variants for one canonical session key.
 * Candidates can include aliases (for example, "agent:ops:main" when canonical is "agent:ops:work").
 */
export declare function pruneLegacyStoreKeys(params: {
    store: Record<string, unknown>;
    canonicalKey: string;
    candidates: Iterable<string>;
}): void;
export declare function migrateAndPruneGatewaySessionStoreKey(params: {
    cfg: OpenClawConfig;
    key: string;
    store: Record<string, SessionEntry>;
    agentId?: string;
}): {
    target: GatewaySessionStoreTarget;
    primaryKey: string;
    entry: SessionEntry;
};
export declare function classifySessionKey(key: string, entry?: SessionEntry): GatewaySessionRow["kind"];
export declare function parseGroupKey(key: string): {
    channel?: string;
    kind?: "group" | "channel";
    id?: string;
} | null;
export declare function listAgentsForGateway(cfg: OpenClawConfig, modelCatalog?: ModelCatalogEntry[]): {
    defaultId: string;
    mainKey: string;
    scope: SessionScope;
    agents: GatewayAgentRow[];
};
export declare function resolveGatewaySessionStoreTargetWithStore(params: {
    cfg: OpenClawConfig;
    key: string;
    agentId?: string;
    clone?: boolean;
    store?: Record<string, SessionEntry>;
}): GatewaySessionStoreTargetWithStore;
export declare function resolveGatewaySessionStoreTarget(params: {
    cfg: OpenClawConfig;
    key: string;
    agentId?: string;
    clone?: boolean;
    store?: Record<string, SessionEntry>;
}): GatewaySessionStoreTarget;
export { loadCombinedSessionStoreForGateway } from "../config/sessions/combined-store-gateway.js";
export declare function resolveGatewaySessionThinkingDefault(params: {
    cfg: OpenClawConfig;
    provider: string;
    model: string;
    agentId?: string;
    modelCatalog?: ModelCatalogEntry[];
}): "adaptive" | "high" | "low" | "max" | "medium" | "minimal" | "off" | "xhigh";
export declare function getSessionDefaults(cfg: OpenClawConfig, modelCatalog?: ModelCatalogEntry[], options?: {
    allowPluginNormalization?: boolean;
}): GatewaySessionsDefaults;
export declare function resolveSessionModelRef(cfg: OpenClawConfig, entry?: SessionEntry | Pick<SessionEntry, "model" | "modelProvider" | "modelOverride" | "providerOverride">, agentId?: string, options?: {
    allowPluginNormalization?: boolean;
}): {
    provider: string;
    model: string;
};
export declare function resolveGatewayModelSupportsImages(params: {
    loadGatewayModelCatalog: (params?: {
        readOnly?: boolean;
    }) => Promise<ModelCatalogEntry[]>;
    provider?: string;
    model?: string;
}): Promise<boolean>;
export declare function resolveSessionModelIdentityRef(cfg: OpenClawConfig, entry?: SessionEntry | Pick<SessionEntry, "model" | "modelProvider" | "modelOverride" | "providerOverride">, agentId?: string, fallbackModelRef?: string, options?: {
    allowPluginNormalization?: boolean;
}): {
    provider?: string;
    model: string;
};
export declare function resolveSessionDisplayModelIdentityRef(params: {
    cfg: OpenClawConfig;
    agentId: string;
    provider?: string;
    model?: string;
}): {
    provider?: string;
    model?: string;
};
export declare function buildGatewaySessionRow(params: {
    cfg: OpenClawConfig;
    storePath: string;
    store: Record<string, SessionEntry>;
    key: string;
    entry?: SessionEntry;
    modelCatalog?: ModelCatalogEntry[];
    now?: number;
    includeDerivedTitles?: boolean;
    includeLastMessage?: boolean;
    transcriptUsageMaxBytes?: number;
    storeChildSessionsByKey?: Map<string, string[]>;
    rowContext?: SessionListRowContext;
    agentId?: string;
    skipTranscriptUsageFallback?: boolean;
    lightweightListRow?: boolean;
}): GatewaySessionRow;
export declare function loadGatewaySessionRow(sessionKey: string, options?: {
    agentId?: string;
    includeDerivedTitles?: boolean;
    includeLastMessage?: boolean;
    now?: number;
    transcriptUsageMaxBytes?: number;
}): GatewaySessionRow | null;
export declare function buildGatewaySessionInfo(params: {
    cfg: OpenClawConfig;
    storePath: string;
    store: Record<string, SessionEntry>;
    key: string;
    entry?: SessionEntry;
    agentId?: string;
    now?: number;
    modelCatalog?: ModelCatalogEntry[];
}): GatewaySessionRow;
export declare function filterAndSortSessionEntries(params: {
    cfg: OpenClawConfig;
    store: Record<string, SessionEntry>;
    opts: SessionsListParams;
    now: number;
    rowContext?: SessionListRowContext;
    getRowContext?: SessionListRowContextProvider;
}): [string, SessionEntry][];
export declare function listSessionsFromStore(params: {
    cfg: OpenClawConfig;
    storePath: string;
    store: Record<string, SessionEntry>;
    modelCatalog?: ModelCatalogEntry[];
    opts: SessionsListParams;
}): SessionsListResult;
/**
 * Async version of listSessionsFromStore that yields to the event loop between
 * batches of session row builds. This prevents large session stores from
 * blocking the event loop during sessions.list requests.
 *
 * The synchronous file I/O in readSessionTitleFieldsFromTranscript (head/tail
 * reads for derived titles and last-message previews) is the dominant blocker.
 * By yielding every SESSIONS_LIST_YIELD_BATCH_SIZE rows, we keep the event
 * loop responsive for WebSocket heartbeats, channel I/O, and concurrent RPC.
 */
export declare function listSessionsFromStoreAsync(params: {
    cfg: OpenClawConfig;
    storePath: string;
    store: Record<string, SessionEntry>;
    modelCatalog?: ModelCatalogEntry[];
    opts: SessionsListParams;
}): Promise<SessionsListResult>;
