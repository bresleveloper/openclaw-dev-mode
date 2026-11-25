import { o as PluginEntryConfig, r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import { t as SchemaContract } from "./schema-contract-c2sTcmgZ.js";
/** Canonical plugin config shape consumed by runtime policy and loaders. */
type NormalizedPluginsConfig = {
  /** Prepared metadata owner; null means the engine has no unambiguous permitted owner. */
  contextEngineOwnerId?: string | null;
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
    hooks?: SchemaContract<NonNullable<PluginEntryConfig["hooks"]>>;
    subagent?: SchemaContract<NonNullable<PluginEntryConfig["subagent"]>> & {
      hasAllowedModelsConfig?: boolean;
    };
    llm?: SchemaContract<NonNullable<PluginEntryConfig["llm"]>> & {
      hasAllowedModelsConfig?: boolean;
      hasAllowedCompletionModelsConfig?: boolean;
    };
    config?: unknown;
  }>;
};
/** Plugin id normalizer used while loading aliases or raw config. */
type NormalizePluginId = (id: string) => string;
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
export { NormalizedPluginsConfig as a, NormalizePluginId as i, PluginActivationSource as n, PluginActivationStateLike as r, PluginActivationConfigSourceLike as t };