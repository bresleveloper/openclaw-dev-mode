import { F as PluginEntryConfig, M as OpenClawConfig } from "./types-D7I_F5Ux.js";
import { t as SchemaContract } from "./schema-contract-v05QRSzC.js";
import { t as PluginOrigin } from "./plugin-origin.types-DOQEvsWL.js";
//#region src/plugins/config-normalization-shared.d.ts
/** Canonical plugin config shape consumed by runtime policy and loaders. */
type NormalizedPluginsConfig$1 = {
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
  plugins: NormalizedPluginsConfig$1;
  rootConfig?: OpenClawConfig;
};
//#endregion
//#region src/plugins/config-state.d.ts
type PluginActivationState = PluginActivationStateLike;
type PluginActivationConfigSource = PluginActivationConfigSourceLike;
type NormalizedPluginsConfig = NormalizedPluginsConfig$1;
/** Builds caller-owned policy without exposing the host's prepared objects. */
declare const createNormalizedPluginsConfig: (config?: OpenClawConfig["plugins"]) => NormalizedPluginsConfig;
declare function resolveEffectivePluginActivationState(params: {
  id: string;
  origin: PluginOrigin;
  config: NormalizedPluginsConfig;
  rootConfig?: OpenClawConfig;
  enabledByDefault?: boolean;
  activationSource?: PluginActivationConfigSource;
  autoEnabledReason?: string;
  channelIds?: readonly string[];
}): PluginActivationState;
declare const resolveEffectiveEnableState: (params: Omit<Parameters<typeof resolveEffectivePluginActivationState>[0], "autoEnabledReason">) => {
  enabled: boolean;
  reason?: string;
};
//#endregion
export { NormalizePluginId as i, resolveEffectiveEnableState as n, PluginActivationSource as r, createNormalizedPluginsConfig as t };