import type { PluginDiagnosticCode } from "../plugins/manifest-types.js";
type StatusPluginDependencyStatus = {
    hasDependencies?: boolean;
    requiredInstalled?: boolean;
    missing?: string[];
};
export type PluginHealthRecord = {
    id: string;
    status?: "loaded" | "disabled" | "error";
    enabled?: boolean;
    error?: string;
    dependencyStatus?: StatusPluginDependencyStatus;
    failurePhase?: string;
};
export type PluginDiagnosticRecord = {
    level: "warn" | "error";
    message: string;
    pluginId?: string;
    code?: PluginDiagnosticCode;
};
type ContextEngineQuarantineRecord = {
    engineId: string;
    owner?: string;
    operation: string;
    reason: string;
    failedAt: Date | number;
};
export type RuntimeToolQuarantineRecord = {
    toolName: string;
    owner?: string;
    reason: string;
    failedAt: Date | number;
};
export type PluginCompatibilityHealthNotice = {
    pluginId: string;
    severity: "warn" | "info";
    message: string;
    code?: string;
};
export type ChannelPluginFailureRecord = {
    channelId: string;
    pluginId?: string;
    message: string;
    source?: string;
};
export type StatusPluginHealthSnapshot = {
    plugins: PluginHealthRecord[];
    diagnostics: PluginDiagnosticRecord[];
    contextEngineQuarantines: ContextEngineQuarantineRecord[];
    runtimeToolQuarantines?: RuntimeToolQuarantineRecord[];
    compatibilityNotices?: PluginCompatibilityHealthNotice[];
    channelPluginFailures?: ChannelPluginFailureRecord[];
};
export declare function dedupePluginDiagnostics(diagnostics: readonly PluginDiagnosticRecord[]): PluginDiagnosticRecord[];
export declare function dedupeChannelPluginFailures(failures: readonly ChannelPluginFailureRecord[]): ChannelPluginFailureRecord[];
export declare function mergeStatusPluginHealthSnapshots(installed: StatusPluginHealthSnapshot, runtime: StatusPluginHealthSnapshot): StatusPluginHealthSnapshot;
export declare function isChannelPluginFailureDiagnostic(diagnostic: PluginDiagnosticRecord): boolean;
export declare function formatCompactPluginHealthLine(snapshot: StatusPluginHealthSnapshot): string;
export declare function formatDetailedPluginHealth(snapshot: StatusPluginHealthSnapshot): string;
export {};
