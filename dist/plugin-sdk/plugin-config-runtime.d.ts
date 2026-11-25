import { r as OpenClawConfig } from "../types.openclaw-D8uW-XQA.js";
import "../types-ACDCRjU-.js";
import { t as PluginOrigin } from "../plugin-origin.types-DXhBLlII.js";
import { a as NormalizedPluginsConfig$1, r as PluginActivationStateLike, t as PluginActivationConfigSourceLike } from "../config-activation-shared-DnlSzxwJ.js";
type PluginActivationState = PluginActivationStateLike;
type PluginActivationConfigSource = PluginActivationConfigSourceLike;
type NormalizedPluginsConfig = NormalizedPluginsConfig$1;
/** Builds caller-owned policy without exposing the host's prepared objects. */
declare const createNormalizedPluginsConfig: (config?: OpenClawConfig["plugins"]) => NormalizedPluginsConfig;
declare function resolveEffectivePluginActivationState(params: {
  id: string;
  origin: PluginOrigin;
  /** Omit when the runtime config already owns prepared plugin policy. */
  config?: NormalizedPluginsConfig;
  rootConfig?: OpenClawConfig;
  enabledByDefault?: boolean;
  activationSource?: PluginActivationConfigSource;
  autoEnabledReason?: string;
  channelIds?: readonly string[];
}): PluginActivationState;
export declare const resolveEffectiveEnableState: (params: Omit<Parameters<typeof resolveEffectivePluginActivationState>[0], "autoEnabledReason">) => {
  enabled: boolean;
  reason?: string;
};
type DeepMergeOptions = {
  arrays?: "replace" | "concat";
  undefinedValues?: "skip" | "replace";
};
/** Merge plain objects while preserving OpenClaw's null, undefined, and array policies. */
export declare function mergeDeep(base: unknown, override: unknown, options?: DeepMergeOptions): unknown;
/** Reuse a pure parser's owned JSON result for one published or immutable config revision. */
export declare function createPluginConfigParser<T>(pluginId: string, parse: (value: unknown) => T): (value: unknown) => T;
/** Requires an already-resolved runtime config at plugin runtime boundaries. */
export declare function requireRuntimeConfig(config: OpenClawConfig, context: string): OpenClawConfig;
/** Reads a plugin's object-shaped `plugins.entries[id].config` block from resolved config. */
export declare function resolvePluginConfigObject(config: OpenClawConfig | undefined, pluginId: string): Record<string, unknown> | undefined;
/** Resolves live plugin config through a loader, falling back to startup config when unavailable. */
export declare function resolveLivePluginConfigObject(runtimeConfigLoader: (() => OpenClawConfig | undefined) | undefined, pluginId: string, startupPluginConfig?: Record<string, unknown>): Record<string, unknown> | undefined;
export { createNormalizedPluginsConfig as normalizePluginsConfig };