import { $t as ProviderThinkingProfile } from "../../plugin-entry-L7QTXRH5.js";

//#region extensions/xiaomi/thinking.d.ts
declare function isMiMoProviderId(providerId: unknown): boolean;
declare function isMiMoReasoningModelRef(model: {
  provider?: string;
  id?: unknown;
}): boolean;
declare function resolveMiMoThinkingProfile(modelId: string): ProviderThinkingProfile | undefined;
//#endregion
export { isMiMoProviderId, isMiMoReasoningModelRef, resolveMiMoThinkingProfile };