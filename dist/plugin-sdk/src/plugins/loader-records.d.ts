import type { PluginCompatCode } from "./compat/registry.js";
import type { PluginActivationState } from "./config-state.js";
import type { PluginBundleFormat, PluginDiagnosticCode, PluginFormat } from "./manifest-types.js";
import type { PluginManifestContracts } from "./manifest.js";
import type { PluginRecord, PluginRegistry } from "./registry.js";
import type { PluginLogger } from "./types.js";
/** Builds the registry record shape shared by plugin loading, status, and diagnostics. */
export declare function createPluginRecord(params: {
    id: string;
    name?: string;
    description?: string;
    version?: string;
    packageName?: string;
    format?: PluginFormat;
    bundleFormat?: PluginBundleFormat;
    bundleCapabilities?: string[];
    source: string;
    rootDir?: string;
    origin: PluginRecord["origin"];
    workspaceDir?: string;
    trustedOfficialInstall?: boolean;
    enabled: boolean;
    compat?: readonly PluginCompatCode[];
    activationState?: PluginActivationState;
    syntheticAuthRefs?: string[];
    channelIds?: readonly string[];
    providerIds?: readonly string[];
    configSchema: boolean;
    contracts?: PluginManifestContracts;
}): PluginRecord;
/** Marks a discovered plugin inactive without discarding its metadata record. */
export declare function markPluginActivationDisabled(record: PluginRecord, reason?: string): void;
/** Joins auto-enable reasons into the single registry field shown by status surfaces. */
export declare function formatAutoEnabledActivationReason(reasons: readonly string[] | undefined): string | undefined;
/** Records a loader failure in the registry, diagnostics list, and operator log consistently. */
export declare function recordPluginError(params: {
    logger: PluginLogger;
    registry: PluginRegistry;
    record: PluginRecord;
    seenIds: Map<string, PluginRecord["origin"]>;
    pluginId: string;
    origin: PluginRecord["origin"];
    phase: PluginRecord["failurePhase"];
    error: unknown;
    logPrefix: string;
    diagnosticMessagePrefix: string;
    diagnosticCode?: PluginDiagnosticCode;
}): void;
/** Groups failed plugin ids by loader phase for compact startup summaries. */
export declare function formatPluginFailureSummary(failedPlugins: PluginRecord[]): string;
export declare function formatMissingPluginRegisterError(moduleExport: unknown, env: NodeJS.ProcessEnv): string;
