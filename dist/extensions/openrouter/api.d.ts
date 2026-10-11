import { Gt as ImageGenerationProvider, Jt as OpenClawConfig, Ut as SpeechProviderPlugin, Wt as MusicGenerationProvider, Zt as ModelProviderDeclarationConfig } from "../../runtime-api-DpOeiZhR.js";
import "../../provider-http-OGQ1X-4k.js";
import "../../provider-model-shared-Bq2qfQMS.js";
import "../../provider-catalog-live-runtime-BtYklyhY.js";
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
export declare function applyOpenrouterProviderConfig(cfg: OpenClawConfig): OpenClawConfig;
export declare function applyOpenrouterConfig(cfg: OpenClawConfig): OpenClawConfig;
//#endregion