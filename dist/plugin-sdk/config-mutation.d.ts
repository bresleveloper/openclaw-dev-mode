import { Li as AgentModelEntryConfig, M as OpenClawConfig } from "../types-D7I_F5Ux.js";
import { C as ProviderModelRef } from "../model-selection-DoE_lu2k.js";
import { n as RuntimeEnv } from "../runtime-M_jncu14.js";
import "../plugin-metadata-snapshot-C_ou8VB5.js";
import { c as readConfigFileSnapshotForWrite, l as ConfigWriteOptions, n as mutateConfigFile, r as replaceConfigFile, u as ConfigWriteAfterWrite } from "../config-S5Zm-Svf.js";
import "../model-input-Dw6jSbg2.js";
//#region src/config/logging.d.ts
type LogConfigUpdatedOptions = {
  path?: string;
  backupPath?: string | false;
  suffix?: string;
};
/** Emits the standard config-updated message through the active runtime logger. */
export declare function logConfigUpdated(runtime: RuntimeEnv, opts?: LogConfigUpdatedOptions): void;
//#endregion
//#region src/commands/models/shared.d.ts
type UpdateConfigContext = {
  runtimeConfig: OpenClawConfig;
  providerRegistryAvailable?: boolean;
  canonicalModelKeys?: ReadonlyMap<string, string | undefined>;
  restoreSourceEntry: (from: string, to: string, entry: AgentModelEntryConfig) => AgentModelEntryConfig;
};
/** Reads source config, applies a mutator, and writes only the source-form config. */
export declare function updateConfig(mutator: (cfg: OpenClawConfig, context: UpdateConfigContext) => OpenClawConfig | Promise<OpenClawConfig>, selectModelRefs?: (cfg: OpenClawConfig, context: UpdateConfigContext) => readonly (ProviderModelRef | undefined)[], beforeCommit?: () => void, writeOptions?: ConfigWriteOptions): Promise<OpenClawConfig>;
//#endregion
export { type ConfigWriteAfterWrite, mutateConfigFile, readConfigFileSnapshotForWrite, replaceConfigFile };