import { type ConnectPairingRequiredReason } from "../../packages/gateway-protocol/src/connect-error-details.js";
import type { TableColumn } from "../../packages/terminal-core/src/table.js";
import type { HeartbeatEventPayload } from "../infra/heartbeat-events.js";
import type { Tone } from "../memory-host-sdk/status.js";
import type { HealthSummary } from "./health.js";
import type { AgentLocalStatus } from "./status.agent-local.js";
import type { MemoryStatusSnapshot, MemoryPluginStatus } from "./status.scan.shared.js";
import type { SessionStatus, StatusSummary } from "./status.types.js";
type AgentStatusLike = {
    defaultId?: string | null;
    bootstrapPendingCount: number;
    totalSessions: number;
    agents: AgentLocalStatus[];
};
type SummaryLike = Pick<StatusSummary, "tasks" | "taskAudit" | "heartbeat" | "sessions">;
type MemoryLike = MemoryStatusSnapshot | null;
type MemoryPluginLike = MemoryPluginStatus;
type SessionsRecentLike = SessionStatus;
type EventLoopHealthLike = NonNullable<HealthSummary["eventLoop"]>;
export type StatusMemoryStateResolvers = {
    resolveMemoryVectorState: (value: NonNullable<MemoryStatusSnapshot["vector"]>) => {
        state: string;
        tone: Tone;
    };
    resolveMemoryFtsState: (value: NonNullable<MemoryStatusSnapshot["fts"]>) => {
        state: string;
        tone: Tone;
    };
    resolveMemoryCacheSummary: (value: NonNullable<MemoryStatusSnapshot["cache"]>) => {
        text: string;
        tone: Tone;
    };
};
type PluginCompatibilityNoticeLike = {
    severity?: "warn" | "info" | null;
};
type PairingRecoveryLike = {
    requestId?: string | null;
    reason?: ConnectPairingRequiredReason | null;
    remediationHint?: string | null;
};
export declare const statusHealthColumns: TableColumn[];
/** Formats the agents overview row value, including default-agent recent activity. */
export declare function buildStatusAgentsValue(params: {
    agentStatus: AgentStatusLike;
    formatTimeAgo: (ageMs: number) => string;
}): string;
/** Formats task counters and audit state for the overview table. */
export declare function buildStatusTasksValue(params: {
    summary: Pick<SummaryLike, "tasks" | "taskAudit">;
    warn: (value: string) => string;
    muted: (value: string) => string;
}): string;
/** Formats configured heartbeat intervals by agent. */
export declare function buildStatusHeartbeatValue(params: {
    summary: Pick<SummaryLike, "heartbeat">;
}): string;
/** Formats the last observed heartbeat when deep status queried the gateway. */
export declare function buildStatusLastHeartbeatValue(params: {
    deep?: boolean;
    gatewayReachable: boolean;
    lastHeartbeat: HeartbeatEventPayload | null;
    warn: (value: string) => string;
    muted: (value: string) => string;
    formatTimeAgo: (ageMs: number) => string;
}): string | null;
/** Formats memory plugin/index/cache state for the overview table. */
export declare function buildStatusMemoryValue(params: {
    memory: MemoryLike;
    memoryPlugin: MemoryPluginLike;
    ok: (value: string) => string;
    warn: (value: string) => string;
    muted: (value: string) => string;
    memoryUnavailableLabel?: string;
} & StatusMemoryStateResolvers): string;
/** Builds the security audit text section for status output. */
export declare function buildStatusSecurityAuditLines(params: {
    securityAudit: {
        summary: {
            critical: number;
            warn: number;
            info: number;
        };
        findings: Array<{
            severity: "critical" | "warn" | "info";
            title: string;
            detail: string;
            remediation?: string | null;
        }>;
    };
    theme: {
        error: (value: string) => string;
        warn: (value: string) => string;
        muted: (value: string) => string;
    };
    shortenText: (value: string, maxLen: number) => string;
    formatCliCommand: (value: string) => string;
}): string[];
/** Builds health table rows from gateway health and channel health text. */
export declare function buildStatusHealthRows(params: {
    health: HealthSummary;
    formatHealthChannelLines: (summary: HealthSummary, opts: {
        accountMode: "all";
    }) => string[];
    ok: (value: string) => string;
    warn: (value: string) => string;
    muted: (value: string) => string;
}): Record<string, string>[];
/** Formats event-loop latency/utilization health into one table detail string. */
export declare function formatEventLoopHealthDetail(eventLoop: EventLoopHealthLike): string;
/** Builds recent session table rows, optionally including prompt-cache data. */
export declare function buildStatusSessionsRows(params: {
    recent: SessionsRecentLike[];
    verbose?: boolean;
    shortenText: (value: string, maxLen: number) => string;
    formatTimeAgo: (ageMs: number) => string;
    formatTokensCompact: (value: SessionsRecentLike) => string;
    formatPromptCacheCompact: (value: SessionsRecentLike) => string | null;
    muted: (value: string) => string;
}): {
    Key: string;
    Kind: import("../sessions/classify-session-kind.ts").SessionKind;
    Age: string;
    Model: string;
    Runtime: string;
    Tokens: string;
    Cache?: string | undefined;
}[];
/** Explains sessions pinned to a selected model different from the current configured default. */
export declare function buildStatusModelSelectionLines(params: {
    recent: SessionsRecentLike[];
    limit?: number;
    shortenText: (value: string, maxLen: number) => string;
    warn: (value: string) => string;
    muted: (value: string) => string;
}): string[];
/** Builds footer links and next-step commands for the current gateway state. */
export declare function buildStatusFooterLines(params: {
    updateHint: string | null;
    warn: (value: string) => string;
    formatCliCommand: (value: string) => string;
    nodeOnlyGateway: unknown;
    gatewayReachable: boolean;
}): string[];
/** Builds plugin compatibility lines, capped to keep status output readable. */
export declare function buildStatusPluginCompatibilityLines<TNotice extends PluginCompatibilityNoticeLike>(params: {
    notices: TNotice[];
    limit?: number;
    formatNotice: (notice: TNotice) => string;
    warn: (value: string) => string;
    muted: (value: string) => string;
}): string[];
/** Builds recovery guidance when the gateway reports device pairing is required. */
export declare function buildStatusPairingRecoveryLines(params: {
    pairingRecovery: PairingRecoveryLike | null;
    warn: (value: string) => string;
    muted: (value: string) => string;
    formatCliCommand: (value: string) => string;
}): string[];
/** Builds the queued system-events table rows. */
export declare function buildStatusSystemEventsRows(params: {
    queuedSystemEvents: string[];
    limit?: number;
}): {
    Event: string;
}[] | undefined;
/** Builds the overflow trailer for queued system events. */
export declare function buildStatusSystemEventsTrailer(params: {
    queuedSystemEvents: string[];
    limit?: number;
    muted: (value: string) => string;
}): string | null;
export {};
