import type { ModelDefinitionConfig, ModelProviderConfig } from "../config/types.js";
type ModelCost = ModelDefinitionConfig["cost"];
type FacadeModule = {
    buildVercelAiGatewayProvider: () => Promise<ModelProviderConfig>;
    discoverVercelAiGatewayModels: () => Promise<ModelDefinitionConfig[]>;
    getStaticVercelAiGatewayModelCatalog: () => ModelDefinitionConfig[];
    VERCEL_AI_GATEWAY_BASE_URL: string;
    VERCEL_AI_GATEWAY_DEFAULT_CONTEXT_WINDOW: number;
    VERCEL_AI_GATEWAY_DEFAULT_COST: ModelCost;
    VERCEL_AI_GATEWAY_DEFAULT_MAX_TOKENS: number;
    VERCEL_AI_GATEWAY_DEFAULT_MODEL_ID: string;
    VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF: string;
    VERCEL_AI_GATEWAY_PROVIDER_ID: string;
};
/** Build the Vercel AI Gateway provider config through the bundled provider facade. */
export declare const buildVercelAiGatewayProvider: FacadeModule["buildVercelAiGatewayProvider"];
/** Discover Vercel AI Gateway models through the bundled provider facade. */
export declare const discoverVercelAiGatewayModels: FacadeModule["discoverVercelAiGatewayModels"];
/** Return the static Vercel AI Gateway model catalog used before live discovery. */
export declare const getStaticVercelAiGatewayModelCatalog: FacadeModule["getStaticVercelAiGatewayModelCatalog"];
/** Default Vercel AI Gateway base URL. */
export declare const VERCEL_AI_GATEWAY_BASE_URL: FacadeModule["VERCEL_AI_GATEWAY_BASE_URL"];
/** Default context window assigned to Vercel AI Gateway models without catalog metadata. */
export declare const VERCEL_AI_GATEWAY_DEFAULT_CONTEXT_WINDOW: FacadeModule["VERCEL_AI_GATEWAY_DEFAULT_CONTEXT_WINDOW"];
/** Default cost metadata assigned to Vercel AI Gateway models without catalog metadata. */
export declare const VERCEL_AI_GATEWAY_DEFAULT_COST: FacadeModule["VERCEL_AI_GATEWAY_DEFAULT_COST"];
/** Default max-token value assigned to Vercel AI Gateway models without catalog metadata. */
export declare const VERCEL_AI_GATEWAY_DEFAULT_MAX_TOKENS: FacadeModule["VERCEL_AI_GATEWAY_DEFAULT_MAX_TOKENS"];
/** Default Vercel AI Gateway model id used by setup flows. */
export declare const VERCEL_AI_GATEWAY_DEFAULT_MODEL_ID: FacadeModule["VERCEL_AI_GATEWAY_DEFAULT_MODEL_ID"];
/** Default Vercel AI Gateway provider/model reference written by setup flows. */
export declare const VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF: FacadeModule["VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF"];
/** Provider id used for Vercel AI Gateway config and model refs. */
export declare const VERCEL_AI_GATEWAY_PROVIDER_ID: FacadeModule["VERCEL_AI_GATEWAY_PROVIDER_ID"];
export {};
