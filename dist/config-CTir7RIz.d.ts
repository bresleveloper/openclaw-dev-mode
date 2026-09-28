import { r as OpenClawConfig, t as ConfigFileSnapshot } from "./types.openclaw-LzSbb55e.js";
import "./zod-schema.implicit-mentions-Du1YLL_X.js";
import { _ as ConfigMutationBase, a as readConfigFileSnapshotForWrite, c as ConfigWriteResult, l as ConfigWriteAfterWrite, s as ConfigWriteOptions, u as ConfigWriteFollowUp } from "./io-VMpaZk90.js";
import "./types-BnfxNjkF.js";
import "./manifest-registry-CMnhqUB6.js";
import "./paths-DU1ocwxX.js";
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
export { mutateConfigFile as n, replaceConfigFile as r, ConfigReplaceResult as t };