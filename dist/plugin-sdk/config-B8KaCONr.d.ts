import { i as OpenClawConfig, t as ConfigFileSnapshot } from "./types.openclaw-R57aE8ho.js";
import { n as ConfigWriteFollowUp, t as ConfigWriteAfterWrite } from "./runtime-snapshot-BEf9DzmM.js";
import { n as ConfigWriteResult, s as readConfigFileSnapshotForWrite, t as ConfigWriteOptions } from "./io-De2i7kBd.js";
//#region src/config/mutate.d.ts
/** Selects whether a mutation starts from runtime or source config shape. */
type ConfigMutationBase = "runtime" | "source";
type ConfigReplaceResult = {
  path: string;
  previousHash: string | null;
  snapshot: ConfigFileSnapshot;
  nextConfig: OpenClawConfig;
  persistedHash: string | null;
  afterWrite: ConfigWriteAfterWrite;
  followUp: ConfigWriteFollowUp;
};
type ConfigMutationIO = {
  env?: NodeJS.ProcessEnv;
  readConfigFileSnapshotForWrite: typeof readConfigFileSnapshotForWrite;
  writeConfigFile: (cfg: OpenClawConfig, options?: ConfigWriteOptions) => Promise<ConfigWriteResult | void>;
};
type ConfigMutationContext = {
  snapshot: ConfigFileSnapshot;
  previousHash: string | null;
  attempt: number;
};
type ConfigMutationResult<T> = ConfigReplaceResult & {
  result: T | undefined;
  attempts: number;
};
declare function replaceConfigFile(params: {
  nextConfig: OpenClawConfig;
  baseHash?: string;
  snapshot?: ConfigFileSnapshot;
  afterWrite?: ConfigWriteOptions["afterWrite"];
  writeOptions?: ConfigWriteOptions;
  io?: ConfigMutationIO;
}): Promise<ConfigReplaceResult>;
declare function mutateConfigFile<T = void>(params: {
  base?: ConfigMutationBase;
  baseHash?: string;
  afterWrite?: ConfigWriteOptions["afterWrite"];
  writeOptions?: ConfigWriteOptions;
  io?: ConfigMutationIO;
  mutate: (draft: OpenClawConfig, context: ConfigMutationContext) => Promise<T | void> | T | void;
}): Promise<ConfigMutationResult<T>>;
//#endregion
export { replaceConfigFile as i, ConfigReplaceResult as n, mutateConfigFile as r, ConfigMutationBase as t };