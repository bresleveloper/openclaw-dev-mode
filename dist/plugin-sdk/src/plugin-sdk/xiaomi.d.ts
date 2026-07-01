import type { ModelProviderConfig, OpenClawConfig } from "../config/types.js";
type FacadeModule = {
    applyXiaomiConfig: (cfg: OpenClawConfig) => OpenClawConfig;
    applyXiaomiProviderConfig: (cfg: OpenClawConfig) => OpenClawConfig;
    buildXiaomiProvider: () => ModelProviderConfig;
    XIAOMI_DEFAULT_MODEL_ID: string;
    XIAOMI_DEFAULT_MODEL_REF: string;
};
/** Apply Xiaomi provider defaults to the full OpenClaw config. */
export declare const applyXiaomiConfig: FacadeModule["applyXiaomiConfig"];
/** Apply only Xiaomi provider config defaults. */
export declare const applyXiaomiProviderConfig: FacadeModule["applyXiaomiProviderConfig"];
/** Build the Xiaomi model provider entry used by setup/config helpers. */
export declare const buildXiaomiProvider: FacadeModule["buildXiaomiProvider"];
/** Default Xiaomi model id advertised by the bundled provider facade. */
export declare const XIAOMI_DEFAULT_MODEL_ID: FacadeModule["XIAOMI_DEFAULT_MODEL_ID"];
/** Default Xiaomi provider/model reference written by setup flows. */
export declare const XIAOMI_DEFAULT_MODEL_REF: FacadeModule["XIAOMI_DEFAULT_MODEL_REF"];
export {};
