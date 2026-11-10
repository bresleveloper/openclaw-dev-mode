import { U as ModelProviderDeclarationConfig } from "../../types-D7I_F5Ux.js";
import { Dw as SpeechProviderPlugin } from "../../config-contracts-CY87ANNp.js";
import { _ as ImageGenerationProvider, m as MusicGenerationProvider } from "../../runtime-types-BaNsKfbh.js";
import "../../provider-model-shared-uYxY__EE.js";
import { t as ProviderOnboardPresetAppliers } from "../../provider-onboard-BNuhTHon.js";
import "../../provider-http-DfcF9DFr.js";
import "../../ssrf-runtime-Rr41XJH2.js";
import "../../provider-catalog-live-runtime-B4afebj8.js";
import "../../image-generation-aivnygx5.js";
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