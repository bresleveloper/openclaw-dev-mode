import type { ModelDefinitionConfig, OpenClawConfig } from "../config/types.js";
type FacadeModule = {
    applyLitellmConfig: (cfg: OpenClawConfig) => OpenClawConfig;
    applyLitellmProviderConfig: (cfg: OpenClawConfig) => OpenClawConfig;
    buildLitellmModelDefinition: () => ModelDefinitionConfig;
    LITELLM_BASE_URL: string;
    LITELLM_DEFAULT_MODEL_ID: string;
    LITELLM_DEFAULT_MODEL_REF: string;
};
/** Apply LiteLLM defaults to the full OpenClaw config. */
export declare const applyLitellmConfig: FacadeModule["applyLitellmConfig"];
/** Apply only LiteLLM provider config defaults. */
export declare const applyLitellmProviderConfig: FacadeModule["applyLitellmProviderConfig"];
/** Build the LiteLLM model definition written by setup/config helpers. */
export declare const buildLitellmModelDefinition: FacadeModule["buildLitellmModelDefinition"];
/** Default LiteLLM gateway base URL. */
export declare const LITELLM_BASE_URL: FacadeModule["LITELLM_BASE_URL"];
/** Default LiteLLM model id advertised by the bundled provider facade. */
export declare const LITELLM_DEFAULT_MODEL_ID: FacadeModule["LITELLM_DEFAULT_MODEL_ID"];
/** Default LiteLLM provider/model reference written by setup flows. */
export declare const LITELLM_DEFAULT_MODEL_REF: FacadeModule["LITELLM_DEFAULT_MODEL_REF"];
export {};
