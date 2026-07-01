import { f as ModelProviderConfig } from "../../types.models-Nc1Z-tAz.js";
import { $t as ProviderThinkingProfile } from "../../plugin-entry-DpILbQ7M.js";
//#region extensions/ollama/provider-policy-api.d.ts
type OllamaProviderConfigDraft = Partial<ModelProviderConfig>;
/**
 * Provider policy surface for Ollama: normalize provider configs used by
 * core defaults/normalizers. This runs during config defaults application and
 * normalization paths (not Zod validation).
 */
declare function normalizeConfig({
  provider,
  providerConfig
}: {
  provider: string;
  providerConfig: OllamaProviderConfigDraft;
}): OllamaProviderConfigDraft;
declare function resolveThinkingProfile({
  reasoning
}: {
  reasoning?: boolean;
}): ProviderThinkingProfile;
//#endregion
export { normalizeConfig, resolveThinkingProfile };