import { m as ModelProviderDeclarationConfig } from "../../types.models-Nc1Z-tAz.js";
import { cn as ProviderPlugin } from "../../types-BVLQjFJF.js";
import { a as CodexAppServerRequestParams, i as CodexAppServerRequestMethod, o as CodexAppServerRequestResult, r as CodexAppServerStartOptions, s as JsonValue, t as resolveCodexAppServerAuthProfileIdForAgent } from "../../auth-bridge-CMdTZ1UV.js";
import { r as CodexAppServerModelListResult } from "../../models-CgmKSmcG.js";

//#region extensions/codex/src/app-server/request.d.ts
/** Sends a typed Codex app-server request and returns the method-specific response shape. */
declare function requestCodexAppServerJson<M extends CodexAppServerRequestMethod>(params: {
  method: M;
  requestParams: CodexAppServerRequestParams<M>;
  timeoutMs?: number;
  startOptions?: CodexAppServerStartOptions;
  authProfileId?: string | null;
  agentDir?: string;
  config?: Parameters<typeof resolveCodexAppServerAuthProfileIdForAgent>[0]["config"];
  sessionKey?: string;
  sessionId?: string;
  isolated?: boolean;
}): Promise<CodexAppServerRequestResult<M>>;
declare function requestCodexAppServerJson<T = JsonValue | undefined>(params: {
  method: string;
  requestParams?: unknown;
  timeoutMs?: number;
  startOptions?: CodexAppServerStartOptions;
  authProfileId?: string | null;
  agentDir?: string;
  config?: Parameters<typeof resolveCodexAppServerAuthProfileIdForAgent>[0]["config"];
  sessionKey?: string;
  sessionId?: string;
  isolated?: boolean;
}): Promise<T>;
//#endregion
//#region extensions/codex/provider.d.ts
type CodexModelLister = (options: {
  timeoutMs: number;
  limit?: number;
  cursor?: string;
  startOptions?: CodexAppServerStartOptions;
  sharedClient?: boolean;
}) => Promise<CodexAppServerModelListResult>;
type CodexRateLimitReader = (options: {
  timeoutMs: number;
  agentDir?: string;
  authProfileId?: string;
  config?: Parameters<typeof requestCodexAppServerRateLimitsLazy>[0]["config"];
  startOptions?: CodexAppServerStartOptions;
}) => Promise<unknown>;
type BuildCodexProviderOptions = {
  pluginConfig?: unknown;
  listModels?: CodexModelLister;
  readRateLimits?: CodexRateLimitReader;
};
type BuildCatalogOptions = {
  env?: NodeJS.ProcessEnv;
  pluginConfig?: unknown;
  listModels?: CodexModelLister;
  onDiscoveryFailure?: (error: unknown) => void;
};
/**
 * Builds the Codex provider plugin, including setup metadata, catalog discovery,
 * dynamic model resolution, and prompt/thinking hooks.
 */
declare function buildCodexProvider(options?: BuildCodexProviderOptions): ProviderPlugin;
/**
 * Builds the Codex model catalog from live app-server discovery, falling back
 * to built-in model records when discovery is disabled or unavailable.
 */
declare function buildCodexProviderCatalog(options?: BuildCatalogOptions): Promise<{
  provider: ModelProviderDeclarationConfig;
}>;
declare function requestCodexAppServerRateLimitsLazy(options: {
  timeoutMs: number;
  agentDir?: string;
  authProfileId?: string;
  config?: Parameters<typeof requestCodexAppServerJson>[0]["config"];
  startOptions?: CodexAppServerStartOptions;
}): Promise<unknown>;
/**
 * Returns true for Codex models that use the modern reasoning effort enum and
 * reject the legacy CLI `minimal` default.
 */
declare function isModernCodexModel(modelId: string): boolean;
//#endregion
export { buildCodexProvider, buildCodexProviderCatalog, isModernCodexModel };