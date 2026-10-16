import { Y as AgentModelEntryConfig, r as OpenClawConfig } from "../types.openclaw-DWWUw8hA.js";
import { a as ConfigWriteOptions, i as readConfigFileSnapshotForWrite, s as ConfigWriteAfterWrite } from "../io-CwO8iq4h.js";
import { n as RuntimeEnv } from "../runtime-DlqUc5_p.js";
import { n as mutateConfigFile, r as replaceConfigFile } from "../config-Dpca5-xX.js";
import "../defaults-D0SAbcb2.js";
import { t as ProviderModelRef } from "../model-catalog-refs-Phyl1k6H.js";
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
  canonicalModelKeys?: ReadonlyMap<string, string | undefined>;
  restoreSourceEntry: (from: string, to: string, entry: AgentModelEntryConfig) => AgentModelEntryConfig;
};
/** Reads source config, applies a mutator, and writes only the source-form config. */
export declare function updateConfig(mutator: (cfg: OpenClawConfig, context: UpdateConfigContext) => OpenClawConfig | Promise<OpenClawConfig>, selectModelRefs?: (cfg: OpenClawConfig, context: UpdateConfigContext) => readonly (ProviderModelRef | undefined)[], beforeCommit?: () => void, writeOptions?: ConfigWriteOptions): Promise<OpenClawConfig>;
//#endregion
export { type ConfigWriteAfterWrite, mutateConfigFile, readConfigFileSnapshotForWrite, replaceConfigFile };