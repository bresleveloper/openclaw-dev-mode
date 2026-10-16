import { r as OpenClawConfig } from "./types.openclaw-DWWUw8hA.js";
//#region src/plugins/config-normalization-shared.d.ts
/** Canonical plugin config shape consumed by runtime policy and loaders. */
type NormalizedPluginsConfig = {
  enabled: boolean;
  allow: string[];
  deny: string[];
  loadPaths: string[];
  slots: {
    memory?: string | null;
    contextEngine?: string | null;
  };
  entries: Record<string, {
    enabled?: boolean;
    hooks?: {
      allowPromptInjection?: boolean;
      allowConversationAccess?: boolean;
      timeoutMs?: number;
      timeouts?: Record<string, number>;
    };
    subagent?: {
      allowModelOverride?: boolean;
      allowedModels?: string[];
      hasAllowedModelsConfig?: boolean;
    };
    llm?: {
      allowModelOverride?: boolean;
      allowedModels?: string[];
      hasAllowedModelsConfig?: boolean;
      allowedCompletionModels?: string[];
      hasAllowedCompletionModelsConfig?: boolean;
      allowAuthProfileOverride?: boolean;
      allowAgentIdOverride?: boolean;
    };
    config?: unknown;
  }>;
};
//#endregion
//#region src/plugins/config-activation-shared.d.ts
type PluginActivationSource = "disabled" | "explicit" | "auto" | "default";
type PluginActivationStateLike = {
  enabled: boolean;
  activated: boolean;
  explicitlyEnabled: boolean;
  source: PluginActivationSource;
  reason?: string;
};
type PluginActivationConfigSourceLike = {
  plugins: NormalizedPluginsConfig;
  rootConfig?: OpenClawConfig;
};
//#endregion
export { NormalizedPluginsConfig as i, PluginActivationSource as n, PluginActivationStateLike as r, PluginActivationConfigSourceLike as t };