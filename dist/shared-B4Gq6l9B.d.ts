import { K as AgentModelEntryConfig, r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
import { s as ConfigWriteOptions } from "./io-VMpaZk90.js";
import { n as RuntimeEnv } from "./runtime-DlqUc5_p.js";
import "./config-CTir7RIz.js";
import { S as ProviderModelRef } from "./model-selection-BjQV-P1s.js";
//#region src/config/logging.d.ts
type LogConfigUpdatedOptions = {
  path?: string;
  backupPath?: string | false;
  suffix?: string;
};
/** Emits the standard config-updated message through the active runtime logger. */
declare function logConfigUpdated(runtime: RuntimeEnv, opts?: LogConfigUpdatedOptions): void;
//#endregion
//#region src/commands/models/shared.d.ts
/** Runtime config snapshot supplied to model config mutators. */
type UpdateConfigContext = {
  runtimeConfig: OpenClawConfig;
  canonicalModelKeys?: ReadonlyMap<string, string | undefined>;
  restoreSourceEntry: (from: string, to: string, entry: AgentModelEntryConfig) => AgentModelEntryConfig;
};
/** Reads source config, applies a mutator, and writes only the source-form config. */
declare function updateConfig(mutator: (cfg: OpenClawConfig, context: UpdateConfigContext) => OpenClawConfig | Promise<OpenClawConfig>, selectModelRefs?: (cfg: OpenClawConfig, context: UpdateConfigContext) => readonly (ProviderModelRef | undefined)[], beforeCommit?: () => void, writeOptions?: ConfigWriteOptions): Promise<OpenClawConfig>;
//#endregion
export { logConfigUpdated as n, updateConfig as t };