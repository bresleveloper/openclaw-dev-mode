import type { ModelProviderConfig, OpenClawConfig } from "../config/types.js";
type FacadeModule = {
    applyOpenrouterConfig: (cfg: OpenClawConfig) => OpenClawConfig;
    applyOpenrouterProviderConfig: (cfg: OpenClawConfig) => OpenClawConfig;
    buildOpenrouterProvider: () => ModelProviderConfig;
    OPENROUTER_DEFAULT_MODEL_REF: string;
};
/** Apply OpenRouter defaults to the full OpenClaw config. */
export declare const applyOpenrouterConfig: FacadeModule["applyOpenrouterConfig"];
/** Apply only OpenRouter provider config defaults. */
export declare const applyOpenrouterProviderConfig: FacadeModule["applyOpenrouterProviderConfig"];
/** Build the OpenRouter model provider entry used by setup/config helpers. */
export declare const buildOpenrouterProvider: FacadeModule["buildOpenrouterProvider"];
/** Default OpenRouter provider/model reference written by setup flows. */
export declare const OPENROUTER_DEFAULT_MODEL_REF: FacadeModule["OPENROUTER_DEFAULT_MODEL_REF"];
export {};
