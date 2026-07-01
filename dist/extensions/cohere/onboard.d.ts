import { i as OpenClawConfig } from "../../types.openclaw-DlpCUWMr.js";
//#region extensions/cohere/onboard.d.ts
declare const COHERE_DEFAULT_MODEL_ID = "command-a-03-2025";
declare const COHERE_DEFAULT_MODEL_REF = "cohere/command-a-03-2025";
declare function applyCohereConfig(cfg: OpenClawConfig): OpenClawConfig;
//#endregion
export { COHERE_DEFAULT_MODEL_ID, COHERE_DEFAULT_MODEL_REF, applyCohereConfig };