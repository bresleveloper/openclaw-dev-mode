import { i as ModelDefinitionConfig, n as OpenClawConfig } from "../../types.openclaw-mR7pAsVG.js";
import "../../provider-onboard-Bdt0UN1E.js";
//#region extensions/litellm/onboard.d.ts
export declare const LITELLM_BASE_URL = "http://localhost:4000";
export declare const LITELLM_DEFAULT_MODEL_ID = "claude-opus-4-6";
export declare const LITELLM_DEFAULT_MODEL_REF = "litellm/claude-opus-4-6";
export declare function buildLitellmModelDefinition(): ModelDefinitionConfig;
export declare const applyLitellmConfig: (cfg: OpenClawConfig) => OpenClawConfig, applyLitellmProviderConfig: (cfg: OpenClawConfig) => OpenClawConfig;
//#endregion