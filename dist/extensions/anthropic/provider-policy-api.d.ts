import { i as OpenClawConfig } from "../../types.openclaw-B5gtuEn_.js";
import { f as ModelProviderConfig } from "../../types.models-BvJnk7Su.js";
import { Vf as ProviderThinkingProfile } from "../../types-BpDhk2ev.js";
import { t as applyAnthropicConfigDefaults } from "../../config-defaults-DCdc9X3r.js";
//#region extensions/anthropic/provider-policy-api.d.ts
/** Normalize Anthropic provider config without importing runtime registration. */
declare function normalizeConfig(params: {
  provider: string;
  providerConfig: ModelProviderConfig;
}): ModelProviderConfig;
/** Apply Anthropic config defaults through the provider-policy seam. */
declare function applyConfigDefaults(params: Parameters<typeof applyAnthropicConfigDefaults>[0]): OpenClawConfig;
/** Resolve Claude thinking profile for Anthropic or Claude CLI providers. */
declare function resolveThinkingProfile(params: {
  provider: string;
  modelId: string;
  params?: Record<string, unknown>;
}): {
  readonly levels: readonly [{
    readonly id: "off";
  }];
  readonly defaultLevel: "off";
} | ProviderThinkingProfile | null;
//#endregion
export { applyConfigDefaults, normalizeConfig, resolveThinkingProfile };