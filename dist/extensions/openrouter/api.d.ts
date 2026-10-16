import { S as ModelProviderDeclarationConfig } from "../../group-policy-Dw25VUD2.js";
import { d as ImageGenerationProvider, l as SpeechProviderPlugin, u as MusicGenerationProvider } from "../../plugin-entry-QAozMft-.js";
import "../../config-contracts-BCJ3MTRY.js";
import "../../provider-model-shared-DyxwAg5_.js";
import "../../ssrf-runtime-DmEx94Wz.js";
import { t as ProviderOnboardPresetAppliers } from "../../provider-onboard-BRaUQflr.js";
import "@openclaw/ai/internal/shared";
//#region extensions/openrouter/image-generation-provider.d.ts
export declare function buildOpenRouterImageGenerationProvider(): ImageGenerationProvider;
//#endregion
//#region extensions/openrouter/music-generation-provider.d.ts
export declare function buildOpenRouterMusicGenerationProvider(): MusicGenerationProvider;
//#endregion
//#region extensions/openrouter/provider-catalog.d.ts
export declare function isOpenRouterProxyReasoningUnsupportedModel(modelId: string | undefined): boolean;
export declare function buildOpenrouterProvider(): ModelProviderDeclarationConfig;
//#endregion
//#region extensions/openrouter/speech-provider.d.ts
export declare function buildOpenRouterSpeechProvider(): SpeechProviderPlugin;
//#endregion
//#region extensions/openrouter/onboard.d.ts
export declare const OPENROUTER_DEFAULT_MODEL_REF = "openrouter/auto";
declare const { applyProviderConfig: applyOpenrouterProviderConfig, applyConfig: applyOpenrouterConfig }: ProviderOnboardPresetAppliers<[]>;
//#endregion
export { applyOpenrouterConfig, applyOpenrouterProviderConfig };