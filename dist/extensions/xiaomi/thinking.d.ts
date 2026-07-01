import { $t as ProviderThinkingProfile } from "../../plugin-entry-DpILbQ7M.js";

//#region extensions/xiaomi/thinking.d.ts
declare function isMiMoReasoningModelId(modelId: string): boolean;
declare function isMiMoProviderId(providerId: unknown): boolean;
declare function isMiMoReasoningModelRef(model: {
  provider?: string;
  id?: unknown;
}): boolean;
declare function resolveMiMoThinkingProfile(modelId: string): ProviderThinkingProfile | undefined;
//#endregion
export { isMiMoProviderId, isMiMoReasoningModelId, isMiMoReasoningModelRef, resolveMiMoThinkingProfile };