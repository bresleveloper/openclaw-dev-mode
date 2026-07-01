type AgentStatusLike = {
    bootstrapPendingCount: number;
    totalSessions: number;
    agents: Array<{
        id: string;
        lastActiveAgeMs?: number | null;
    }>;
};
type PluginCompatibilityNoticeLike = {
    pluginId?: string | null;
    plugin?: string | null;
};
type SummarySessionsLike = {
    count: number;
    paths: string[];
    defaults: {
        model?: string | null;
        contextTokens?: number | null;
    };
};
/** Formats the status-all agents overview cell. */
export declare function buildStatusAllAgentsValue(params: {
    agentStatus: AgentStatusLike;
    activeThresholdMs?: number;
}): string;
/** Formats the secrets diagnostics count for overview output. */
export declare function buildStatusSecretsValue(count: number): string;
/** Formats queued system-event count for overview output. */
export declare function buildStatusEventsValue(params: {
    queuedSystemEvents: string[];
}): string;
/** Formats whether deep probe data was collected. */
export declare function buildStatusProbesValue(params: {
    health?: unknown;
    ok: (value: string) => string;
    muted: (value: string) => string;
}): string;
/** Formats plugin compatibility notices as a compact count by notice and plugin. */
export declare function buildStatusPluginCompatibilityValue(params: {
    notices: PluginCompatibilityNoticeLike[];
    ok: (value: string) => string;
    warn: (value: string) => string;
}): string;
/** Formats active session count, default model/context, and backing store summary. */
export declare function buildStatusSessionsOverviewValue(params: {
    sessions: SummarySessionsLike;
    formatKTokens: (value: number) => string;
}): string;
export {};
