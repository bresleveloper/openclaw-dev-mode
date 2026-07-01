import type { ChannelLegacyStateMigrationPlan } from "../channels/plugins/types.core.js";
import type { SessionScope } from "../config/sessions/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type PluginDoctorStateMigration } from "../plugins/doctor-contract-registry.js";
export type LegacyStateDetection = {
    targetAgentId: string;
    targetMainKey: string;
    targetScope?: SessionScope;
    stateDir: string;
    oauthDir: string;
    sessions: {
        legacyDir: string;
        legacyStorePath: string;
        targetDir: string;
        targetStorePath: string;
        hasLegacy: boolean;
        legacyKeys: string[];
    };
    agentDir: {
        legacyDir: string;
        targetDir: string;
        hasLegacy: boolean;
    };
    channelPlans: {
        hasLegacy: boolean;
        plans: ChannelLegacyStateMigrationPlan[];
    };
    pluginPlans?: {
        hasLegacy: boolean;
        plans: DetectedPluginDoctorStateMigrationPlan[];
    };
    pluginStateSidecar: {
        sourcePath: string;
        hasLegacy: boolean;
    };
    pluginInstallIndex: {
        sourcePath: string;
        hasLegacy: boolean;
    };
    debugProxyCaptureSidecar: {
        sourcePath: string;
        blobDir: string;
        hasLegacy: boolean;
    };
    stateSchema: {
        hasLegacy: boolean;
        preview: string[];
    };
    taskStateSidecars: {
        taskRunsPath: string;
        flowRunsPath: string;
        hasLegacy: boolean;
    };
    deliveryQueues: {
        outboundPath: string;
        sessionPath: string;
        hasLegacy: boolean;
    };
    voiceWake: {
        triggersPath: string;
        routingPath: string;
        hasLegacy: boolean;
    };
    updateCheck: {
        sourcePath: string;
        hasLegacy: boolean;
    };
    configHealth: {
        sourcePath: string;
        hasLegacy: boolean;
    };
    pluginBindingApprovals: {
        sourcePath: string;
        hasLegacy: boolean;
    };
    currentConversationBindings: {
        sourcePath: string;
        hasLegacy: boolean;
    };
    execApprovals: {
        sourcePath: string;
        targetPath: string;
        hasLegacy: boolean;
    };
    preview: string[];
};
type MigrationLogger = {
    info: (message: string) => void;
    warn: (message: string) => void;
};
type DetectedPluginDoctorStateMigrationPlan = {
    pluginId: string;
    migration: PluginDoctorStateMigration;
    preview: string[];
};
export declare function sessionStoreTextMayNeedCanonicalization(params: {
    raw: string;
    storeAgentIds: Iterable<string>;
    mainKey: string;
    scope?: SessionScope;
}): boolean;
export declare function resetAutoMigrateLegacyStateForTest(): void;
export declare function resetAutoMigrateLegacyStateDirForTest(): void;
export declare function resetAutoMigrateLegacyTaskStateSidecarsForTest(): void;
type StateDirMigrationResult = {
    migrated: boolean;
    skipped: boolean;
    changes: string[];
    warnings: string[];
};
export declare function autoMigrateLegacyStateDir(params: {
    env?: NodeJS.ProcessEnv;
    homedir?: () => string;
    log?: MigrationLogger;
}): Promise<StateDirMigrationResult>;
export declare function autoMigrateLegacyTaskStateSidecars(params: {
    env?: NodeJS.ProcessEnv;
    homedir?: () => string;
    log?: MigrationLogger;
}): Promise<{
    migrated: boolean;
    skipped: boolean;
    changes: string[];
    warnings: string[];
}>;
export declare function detectLegacyStateMigrations(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    homedir?: () => string;
}): Promise<LegacyStateDetection>;
export declare function migrateLegacyAgentDir(detected: LegacyStateDetection, now: () => number): Promise<{
    changes: string[];
    warnings: string[];
}>;
export declare function runLegacyStateMigrations(params: {
    detected: LegacyStateDetection;
    config?: OpenClawConfig;
    now?: () => number;
    recoverCorruptTargetStore?: boolean;
}): Promise<{
    changes: string[];
    warnings: string[];
}>;
/**
 * Canonicalize orphaned raw session keys in all known agent session stores.
 *
 * Keys written by resolveSessionKey() used DEFAULT_AGENT_ID="main" regardless
 * of the configured default agent; reads always use resolveSessionStoreKey()
 * which canonicalizes via canonicalizeMainSessionAlias. This migration renames
 * any orphaned raw keys to their canonical form in-place, merging with any
 * existing canonical entry by preferring the most recently updated.
 *
 * Safe to run multiple times (idempotent). See #29683.
 */
export declare function migrateOrphanedSessionKeys(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
}): Promise<{
    changes: string[];
    warnings: string[];
}>;
export declare function autoMigrateLegacyState(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    homedir?: () => string;
    log?: MigrationLogger;
    now?: () => number;
    recoverCorruptTargetStore?: boolean;
}): Promise<{
    migrated: boolean;
    skipped: boolean;
    changes: string[];
    warnings: string[];
}>;
export {};
