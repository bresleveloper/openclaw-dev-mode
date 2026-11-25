import { Kj as ProviderModelRef, XO as replaceConfigFile, YO as mutateConfigFile, nk as ConfigWriteOptions, rk as ConfigWriteAfterWrite, tk as readConfigFileSnapshotForWrite } from "../config-contracts-hzlacViZ.js";
import { cr as AgentModelEntryConfig, r as OpenClawConfig } from "../types.openclaw-D8uW-XQA.js";
import { n as RuntimeEnv } from "../runtime-C7vMCRi6.js";
import "../model-input-Cl5jEhsO.js";
type LogConfigUpdatedOptions = {
  path?: string;
  backupPath?: string | false;
  suffix?: string;
};
/** Emits the standard config-updated message through the active runtime logger. */
export declare function logConfigUpdated(runtime: RuntimeEnv, opts?: LogConfigUpdatedOptions): void;
type UpdateConfigContext = {
  runtimeConfig: OpenClawConfig;
  providerRegistryAvailable?: boolean;
  canonicalModelKeys?: ReadonlyMap<string, string | undefined>;
  restoreSourceEntry: (from: string, to: string, entry: AgentModelEntryConfig) => AgentModelEntryConfig;
};
/** Reads source config, applies a mutator, and writes only the source-form config. */
export declare function updateConfig(mutator: (cfg: OpenClawConfig, context: UpdateConfigContext) => OpenClawConfig | Promise<OpenClawConfig>, selectModelRefs?: (cfg: OpenClawConfig, context: UpdateConfigContext) => readonly (ProviderModelRef | undefined)[], beforeCommit?: () => void, writeOptions?: ConfigWriteOptions): Promise<OpenClawConfig>;
export { type ConfigWriteAfterWrite, mutateConfigFile, readConfigFileSnapshotForWrite, replaceConfigFile };