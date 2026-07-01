import { i as OpenClawConfig } from "../../types.openclaw-DlpCUWMr.js";
import { f as ModelProviderConfig } from "../../types.models-Nc1Z-tAz.js";
import { Cu as ProviderThinkingProfile } from "../../types-BVLQjFJF.js";
import { t as applyAnthropicConfigDefaults } from "../../config-defaults-C_C7Q2Bg.js";
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
}): ProviderThinkingProfile | {
  readonly levels: readonly [{
    readonly id: "off";
  }];
  readonly defaultLevel: "off";
} | null;
//#endregion
export { applyConfigDefaults, normalizeConfig, resolveThinkingProfile };