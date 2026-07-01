import { i as OpenClawConfig, t as ConfigFileSnapshot } from "./types.openclaw-R57aE8ho.js";
import { n as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-DJKUP8I2.js";
import { r as RuntimeConfigSnapshotRefreshOptions, t as ConfigWriteAfterWrite } from "./runtime-snapshot-BEf9DzmM.js";
import fs from "node:fs";
import JSON5 from "json5";

//#region src/config/io.d.ts
type ConfigWriteResult = {
  persistedHash: string;
  persistedConfig: OpenClawConfig;
};
type ConfigWriteOptions = {
  /**
   * Read-time env snapshot used to validate `${VAR}` restoration decisions.
   * If omitted, write falls back to current process env.
   */
  envSnapshotForRestore?: Record<string, string | undefined>;
  /**
   * Optional safety check: only use envSnapshotForRestore when writing the
   * same config file path that produced the snapshot.
   */
  expectedConfigPath?: string; /** Internal write destination captured by readConfigFileSnapshotForWrite(). */
  ownedConfigPathForWrite?: string;
  /**
   * Internal mutation-start ownership guard. Rechecks that the config path
   * captured by readConfigFileSnapshotForWrite() is still active at commit.
   */
  assertConfigPathForWrite?: () => void;
  /**
   * Paths that must be explicitly removed from the persisted file payload,
   * even if schema/default normalization reintroduces them.
   */
  unsetPaths?: string[][];
  /**
   * Paths that were explicitly set by the caller. Values at these paths are
   * persisted even when they equal runtime-injected defaults.
   */
  explicitSetPaths?: readonly (readonly string[])[];
  /**
   * Internal companion for explicitSetPaths after a wrapper has projected a
   * runtime-shaped config back onto the authored source shape.
   */
  explicitSetValueSource?: OpenClawConfig;
  /**
   * Internal fast path for callers that already hold a fresh config snapshot.
   * Avoids rereading the full config just to prepare an immediate write.
   */
  baseSnapshot?: ConfigFileSnapshot;
  /**
   * Plugin metadata paired with baseSnapshot when the caller already read it.
   */
  basePluginMetadataSnapshot?: PluginMetadataSnapshot;
  /**
   * Internal one-shot CLI fast path. When no runtime snapshot is active, skip
   * the post-write runtime snapshot refresh/reload tail entirely.
   */
  skipRuntimeSnapshotRefresh?: boolean;
  /**
   * Optional controls for the active runtime snapshot refresh after this write.
   */
  runtimeRefresh?: RuntimeConfigSnapshotRefreshOptions;
  /**
   * Allow intentionally destructive config writes, such as explicit reset flows.
   * Normal writers must keep this false so clobbers are rejected before disk commit.
   */
  allowDestructiveWrite?: boolean;
  /**
   * Allow an intentional large config size drop while keeping other destructive
   * guards active. Used by repair flows that remove stale or legacy config.
   */
  allowConfigSizeDrop?: boolean;
  /**
   * Suppress human-readable output logs (overwrite/anomaly messages).
   * Useful when the caller wants machine-readable output only (--json mode).
   */
  skipOutputLogs?: boolean;
  /**
   * Runtime reload intent for observers that react to committed config writes.
   * Omitted means the observer should use its normal reload plan.
   */
  afterWrite?: ConfigWriteAfterWrite;
  /**
   * Legacy root keys to preserve on disk while excluding them from write validation.
   * This is for doctor repair of historical config metadata that should not become
   * part of the public schema contract again.
   */
  preservedLegacyRootKeys?: readonly string[];
  /**
   * Skip plugin-aware validation before writing. Use only for safe partial
   * migrations (e.g. legacy key removal) where the base schema is valid but
   * an unrelated plugin rule prevents the full write from succeeding.
   */
  skipPluginValidation?: boolean;
  /**
   * Preserve an older writer version for update handoff writes that must be
   * readable by the parent process after a candidate doctor repair.
   */
  lastTouchedVersionOverride?: string;
  /**
   * Internal hook used by the exported runtime-aware writer after validation
   * has produced the exact source config that will be committed.
   */
  preCommitRuntimePreflight?: (sourceConfig: OpenClawConfig) => Promise<unknown>; /** Internal snapshot-time hashes for include files that mutation writers may update directly. */
  includeFileHashesForWrite?: Record<string, string>; /** Internal snapshot-time canonical targets for include files that mutation writers may update. */
  includeFileTargetsForWrite?: Record<string, string>;
};
type ReadConfigFileSnapshotForWriteResult = {
  snapshot: ConfigFileSnapshot;
  writeOptions: ConfigWriteOptions;
};
type ConfigSnapshotReadMeasure = <T>(name: string, run: () => T | Promise<T>) => Promise<T>;
type ConfigSnapshotReadOptions = {
  measure?: ConfigSnapshotReadMeasure;
  observe?: boolean;
  isolateEnv?: boolean;
  lowerPrecedenceEnv?: Readonly<Record<string, string>>;
  recoverSuspicious?: boolean;
  allowSuspiciousRecovery?: (candidate: OpenClawConfig, current: OpenClawConfig) => boolean | Promise<boolean>;
  skipPluginValidation?: boolean;
  preservedLegacyRootKeys?: readonly string[];
  suppressFutureVersionWarning?: boolean;
};
declare function clearConfigCache(): void;
declare function loadConfig(options?: {
  skipPluginValidation?: boolean;
  pin?: boolean;
  skipShellEnvFallback?: boolean;
}): OpenClawConfig;
declare function getRuntimeConfig(options?: {
  skipPluginValidation?: boolean;
  pin?: boolean;
  skipShellEnvFallback?: boolean;
}): OpenClawConfig;
declare function readConfigFileSnapshot(options?: ConfigSnapshotReadOptions): Promise<ConfigFileSnapshot>;
declare function readConfigFileSnapshotForWrite(options?: {
  skipPluginValidation?: boolean;
}): Promise<ReadConfigFileSnapshotForWriteResult>;
declare function writeConfigFile(cfg: OpenClawConfig, options?: ConfigWriteOptions): Promise<ConfigWriteResult>;
//#endregion
export { loadConfig as a, writeConfigFile as c, getRuntimeConfig as i, ConfigWriteResult as n, readConfigFileSnapshot as o, clearConfigCache as r, readConfigFileSnapshotForWrite as s, ConfigWriteOptions as t };