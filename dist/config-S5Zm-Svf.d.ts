import { A as ConfigFileSnapshot, M as OpenClawConfig } from "./types-D7I_F5Ux.js";
import "./types.secrets-BcsEzH0R.js";
import "./manifest-registry-DcAsDGQ5.js";
import { r as PluginMetadataSnapshot } from "./plugin-metadata-snapshot-C_ou8VB5.js";
import "./config-state-DeFJNtp3.js";
import { z } from "zod";
import "json5";
//#region src/infra/deferred-plugin-migrations.contract.d.ts
declare const deferredPluginMigrationSchema: z.ZodObject<{
  pluginId: z.ZodString;
  reason: z.ZodString;
  command: z.ZodString;
  requiresStateMigration: z.ZodOptional<z.ZodLiteral<true>>;
  requiresDoctorInspection: z.ZodOptional<z.ZodLiteral<true>>;
  configPaths: z.ZodOptional<z.ZodArray<z.ZodArray<z.ZodString>>>;
  validationExcludedPaths: z.ZodOptional<z.ZodArray<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>;
type DeferredPluginMigration = z.infer<typeof deferredPluginMigrationSchema>;
//#endregion
//#region src/config/io.read.types.d.ts
type ConfigSnapshotReadMeasure = <T>(name: string, run: () => T | Promise<T>) => Promise<T>;
//#endregion
//#region src/config/mutation-types.d.ts
/** Selects whether a mutation starts from runtime or source config shape. */
type ConfigMutationBase = "runtime" | "source";
//#endregion
//#region src/config/runtime-config-capture-state.d.ts
type CapturedRuntimeConfigRead = {
  config: OpenClawConfig;
  env: NodeJS.ProcessEnv;
};
//#endregion
//#region src/config/runtime-snapshot.d.ts
type RuntimeConfigSnapshotRefreshOptions = {
  includeAuthStoreRefs?: boolean;
  requireImmediateApplication?: boolean;
};
type ConfigWriteAfterWrite = {
  mode: "auto";
} | {
  mode: "restart";
  reason: string;
} | {
  mode: "none";
  reason: string;
};
type ConfigWriteFollowUp = (Exclude<ConfigWriteAfterWrite, {
  mode: "restart";
}> & {
  requiresRestart: false;
}) | (Extract<ConfigWriteAfterWrite, {
  mode: "restart";
}> & {
  requiresRestart: true;
});
declare function setRuntimeConfigSnapshot(config: OpenClawConfig, sourceConfig?: OpenClawConfig): void;
declare function clearRuntimeConfigSnapshot(): void;
declare function getRuntimeConfigSnapshot(options?: {
  capture?: boolean;
}): OpenClawConfig | null;
/** Read the config published by runtime preparation without cold-loading storage. */
declare function readRuntimeConfig(): OpenClawConfig;
declare function getRuntimeConfigSourceSnapshot(): OpenClawConfig | null;
declare function selectApplicableRuntimeConfig(params: {
  inputConfig?: OpenClawConfig;
  runtimeConfig?: OpenClawConfig | null;
  runtimeSourceConfig?: OpenClawConfig | null;
}): OpenClawConfig | undefined;
/** Bind a retained consumer to its current runtime owner while preserving scoped configs. */
declare function createRuntimeConfigReader(inputConfig: OpenClawConfig): () => OpenClawConfig;
//#endregion
//#region src/config/io.types.d.ts
declare const configWriteCommittedSnapshot: unique symbol;
type ConfigWriteResult = {
  persistedHash: string;
  persistedConfig: OpenClawConfig;
  /** Exact resolved source accepted before commit; absent for legacy custom writers. */
  persistedSourceConfig?: OpenClawConfig;
  /** Internal receipt from the committed inputs, independent of later filesystem reads. */
  [configWriteCommittedSnapshot]?: {
    hash: string;
    sourceConfig: OpenClawConfig;
  };
};
type ConfigWriteAuditOrigin = "doctor" | "system-agent" | "config-rpc" | "plugin-install" | "cli";
type ConfigWriteOptions = {
  /** Doctor/update supplies inspected facts; ordinary writes do not query migration state. */
  deferredPluginMigrations?: readonly DeferredPluginMigration[];
  /** Candidate's source/runtime basis within its write snapshot; omitted inputs use active globals. */
  inputBase?: ConfigMutationBase;
  /** Semantic writer label recorded in the config audit journal. */
  auditOrigin?: ConfigWriteAuditOrigin;
  /** Read-time env snapshot used to validate `${VAR}` restoration decisions. */
  envSnapshotForRestore?: Record<string, string | undefined>;
  /** Only use envSnapshotForRestore for the config path that produced it. */
  expectedConfigPath?: string;
  /** Internal write destination captured by readConfigFileSnapshotForWrite(). */
  ownedConfigPathForWrite?: string;
  /** Rechecks that the config path captured at mutation start is still active. */
  assertConfigPathForWrite?: () => void;
  /** Internal synchronous live-owner assertion checked at guarded publication effects. */
  assertCurrent?: () => void;
  /** Synchronous requester admission immediately before publication; not post-commit ownership. */
  assertBeforePublish?: () => void;
  /** Paths that must be removed from the persisted payload. */
  unsetPaths?: string[][];
  /** Caller-authored paths that stay persisted even when equal to defaults. */
  explicitSetPaths?: readonly (readonly string[])[];
  /** Source-shaped values paired with explicitSetPaths. */
  explicitSetValueSource?: OpenClawConfig;
  /** Persist roster format without treating every leaf as an explicit value edit. */
  persistCanonicalAgentRoster?: boolean;
  /** Agent ids that this write intentionally removes from the canonical roster. */
  allowedAgentRosterRemovals?: readonly string[];
  /** Permit explicit local overrides below an ancestor $include without flattening it. */
  allowIncludeAncestorExplicitSetPaths?: boolean;
  /** Fresh snapshot fast path for an immediate write. */
  baseSnapshot?: ConfigFileSnapshot;
  /** Plugin metadata paired with baseSnapshot. */
  basePluginMetadataSnapshot?: PluginMetadataSnapshot;
  /** Skip the runtime refresh tail when no runtime snapshot is active. */
  skipRuntimeSnapshotRefresh?: boolean;
  /** Controls for the active runtime snapshot refresh. */
  runtimeRefresh?: RuntimeConfigSnapshotRefreshOptions;
  /** Allow intentionally destructive full-config writes. */
  allowDestructiveWrite?: boolean;
  /** Allow an intentional size drop while retaining other destructive guards. */
  allowConfigSizeDrop?: boolean;
  /** Suppress human-readable overwrite and anomaly logs. */
  skipOutputLogs?: boolean;
  /** Runtime reload intent for committed-write observers. */
  afterWrite?: ConfigWriteAfterWrite;
  /** Doctor-only legacy root keys retained on disk but excluded from validation. */
  preservedLegacyRootKeys?: readonly string[];
  /** Skip plugin-aware validation for bounded repair migrations only. */
  skipPluginValidation?: boolean;
  /** Disable observation during mutation snapshots and canonical rereads, not write auditing. */
  observe?: boolean;
  /** Preserve an older writer version during update handoff writes. */
  lastTouchedVersionOverride?: string;
  /** Optional runtime candidate preflight; the runtime writer composes its own preflight. */
  preCommitRuntimePreflight?: (sourceConfig: OpenClawConfig) => Promise<unknown>;
  /** Prepare authority before the synchronous root-file publication phase. */
  beforeCommit?: () => void | Promise<void>;
  /** Snapshot-time hashes for include files that mutation writers may update. */
  includeFileHashesForWrite?: Record<string, string>;
  /** Snapshot-time canonical include targets that writers may update. */
  includeFileTargetsForWrite?: Record<string, string>;
};
type ReadConfigFileSnapshotForWriteResult = {
  snapshot: ConfigFileSnapshot;
  writeOptions: ConfigWriteOptions;
};
type ConfigSnapshotReadOptions = {
  deferredPluginMigrations?: readonly DeferredPluginMigration[];
  measure?: ConfigSnapshotReadMeasure;
  observe?: boolean;
  isolateEnv?: boolean;
  lowerPrecedenceEnv?: Readonly<Record<string, string>>;
  allowCurrentPluginMetadata?: boolean;
  recoverSuspicious?: boolean;
  allowSuspiciousRecovery?: (candidate: OpenClawConfig, current: OpenClawConfig) => boolean | Promise<boolean>;
  /** Controls whether snapshot validation resolves plugin metadata and defaults. */
  pluginValidation?: "full" | "skip" | "core-only";
  skipPluginValidation?: boolean;
  preservedLegacyRootKeys?: readonly string[];
  suppressFutureVersionWarning?: boolean;
};
//#endregion
//#region src/config/io.runtime.d.ts
declare function clearConfigCache(): void;
/** @deprecated Use the prepared runtime snapshot or await captureRuntimeConfigAsyncReader()(). */
declare function loadConfig(options?: {
  skipPluginValidation?: boolean;
  pin?: boolean;
  skipShellEnvFallback?: boolean;
}): OpenClawConfig;
type RuntimeConfigAsyncReader<T> = (() => Promise<T>) & {
  assertCurrent: () => void;
};
/** Capture the config source before a task read, and load only if its owner needs config facts. */
declare function captureRuntimeConfigAsyncReader(options: {
  assertCurrent?: () => void;
  capture: true;
  skipPluginValidation?: boolean;
}): RuntimeConfigAsyncReader<CapturedRuntimeConfigRead>;
declare function captureRuntimeConfigAsyncReader(options?: {
  assertCurrent?: () => void;
  capture?: false;
  skipPluginValidation?: boolean;
}): RuntimeConfigAsyncReader<OpenClawConfig>;
declare function readConfigFileSnapshot(options?: ConfigSnapshotReadOptions): Promise<ConfigFileSnapshot>;
declare function readConfigFileSnapshotForWrite(options?: {
  skipPluginValidation?: boolean;
  observe?: boolean;
  deferredPluginMigrations?: ConfigWriteOptions["deferredPluginMigrations"];
  preservedLegacyRootKeys?: readonly string[];
}): Promise<ReadConfigFileSnapshotForWriteResult>;
declare function writeConfigFile(cfg: OpenClawConfig, options?: ConfigWriteOptions): Promise<ConfigWriteResult>;
//#endregion
//#region src/config/mutate.io.types.d.ts
type ConfigMutationIO = {
  env?: NodeJS.ProcessEnv;
  readConfigFileSnapshotForWrite: typeof readConfigFileSnapshotForWrite;
  writeConfigFile: (...args: Parameters<typeof writeConfigFile>) => Promise<ConfigWriteResult | void>;
};
//#endregion
//#region src/config/mutate.d.ts
type ConfigReplaceResult = {
  path: string;
  previousHash: string | null;
  snapshot: ConfigFileSnapshot;
  nextConfig: OpenClawConfig;
  persistedHash: string | null;
  persistedSourceConfig?: OpenClawConfig;
  afterWrite: ConfigWriteAfterWrite;
  followUp: ConfigWriteFollowUp;
};
type ConfigMutationContext = {
  snapshot: ConfigFileSnapshot;
  previousHash: string | null;
  attempt: number;
};
type ConfigTransformResult<T> = {
  nextConfig: OpenClawConfig;
  result?: T;
};
type ConfigMutationCommitParams = {
  nextConfig: OpenClawConfig;
  snapshot: ConfigFileSnapshot;
  baseHash?: string;
  writeOptions?: ConfigWriteOptions;
  afterWrite: ConfigWriteAfterWrite;
  io?: ConfigMutationIO;
};
type ConfigMutationCommitResult = {
  config: OpenClawConfig;
  persistedHash: string | null;
  persistedSourceConfig?: OpenClawConfig;
  afterWrite?: ConfigWriteAfterWrite;
};
type ConfigMutationCommit = (params: ConfigMutationCommitParams) => Promise<ConfigMutationCommitResult>;
type TransformConfigFileParams<T> = {
  base?: ConfigMutationBase;
  baseHash?: string;
  afterWrite?: ConfigWriteOptions["afterWrite"];
  writeOptions?: ConfigWriteOptions;
  io?: ConfigMutationIO;
  commit?: ConfigMutationCommit;
  transform: (currentConfig: OpenClawConfig, context: ConfigMutationContext, preservation: Pick<ConfigWriteOptions, "envSnapshotForRestore">) => Promise<ConfigTransformResult<T>> | ConfigTransformResult<T>;
};
type ConfigMutationResult<T> = ConfigReplaceResult & {
  result: T | undefined;
  attempts: number;
};
type ConfigReplaceInput = {
  sourceConfig: OpenClawConfig;
  nextConfig?: never;
} | {
  nextConfig: OpenClawConfig;
  sourceConfig?: never;
};
type ConfigReplaceParams = ConfigReplaceInput & {
  baseHash?: string;
  snapshot?: ConfigFileSnapshot;
  afterWrite?: ConfigWriteOptions["afterWrite"];
  writeOptions?: ConfigWriteOptions;
  io?: ConfigMutationIO;
};
declare function replaceConfigFile(params: ConfigReplaceParams): Promise<ConfigReplaceResult>;
type MutateConfigFileParams<T> = Omit<TransformConfigFileParams<T>, "transform" | "commit"> & {
  mutate: (draft: OpenClawConfig, context: ConfigMutationContext) => Promise<T | void> | T | void;
};
declare function mutateConfigFile<T = void>(params: MutateConfigFileParams<T>): Promise<ConfigMutationResult<T>>;
//#endregion
export { setRuntimeConfigSnapshot as _, clearConfigCache as a, readConfigFileSnapshotForWrite as c, clearRuntimeConfigSnapshot as d, createRuntimeConfigReader as f, selectApplicableRuntimeConfig as g, readRuntimeConfig as h, captureRuntimeConfigAsyncReader as i, ConfigWriteOptions as l, getRuntimeConfigSourceSnapshot as m, mutateConfigFile as n, loadConfig as o, getRuntimeConfigSnapshot as p, replaceConfigFile as r, readConfigFileSnapshot as s, ConfigReplaceResult as t, ConfigWriteAfterWrite as u, ConfigMutationBase as v };