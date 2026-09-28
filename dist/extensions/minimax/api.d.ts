import { B as ModelDefinitionConfig, V as ModelProviderDeclarationConfig, z as OpenClawConfig } from "../../cli-backend.types-kTOThe9I.js";
import "../../provider-model-shared-CP6E2ez3.js";
import "../../provider-onboard-B6IQ5BVZ.js";
//#region extensions/minimax/provider-catalog.d.ts
export declare function buildMinimaxProvider(env?: NodeJS.ProcessEnv): ModelProviderDeclarationConfig;
export declare function buildMinimaxPortalProvider(env?: NodeJS.ProcessEnv): ModelProviderDeclarationConfig;
//#endregion
//#region extensions/minimax/model-definitions.d.ts
export declare const DEFAULT_MINIMAX_BASE_URL = "https://api.minimax.io/v1";
export declare const MINIMAX_API_BASE_URL = "https://api.minimax.io/anthropic";
export declare const MINIMAX_CN_API_BASE_URL = "https://api.minimaxi.com/anthropic";
export declare const MINIMAX_HOSTED_MODEL_ID = "MiniMax-M3";
export declare const MINIMAX_HOSTED_MODEL_REF = "minimax/MiniMax-M3";
export declare const MINIMAX_API_COST: {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};
export declare const MINIMAX_HOSTED_COST: {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};
export declare const MINIMAX_LM_STUDIO_COST: {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};
type MinimaxTextModelDefinition = Omit<ModelDefinitionConfig, "input"> & {
  input: Array<"text" | "image">;
};
export declare function buildMinimaxModelDefinition(params: {
  id: string;
  name?: string;
  reasoning?: boolean;
  cost: ModelDefinitionConfig["cost"];
  contextWindow: number;
  maxTokens: number;
}): MinimaxTextModelDefinition;
export declare function buildMinimaxApiModelDefinition(modelId: string): MinimaxTextModelDefinition;
//#endregion
//#region extensions/minimax/provider-models.d.ts
export declare const MINIMAX_DEFAULT_MODEL_ID = "MiniMax-M3";
export declare const MINIMAX_DEFAULT_MODEL_REF = "minimax/MiniMax-M3";
export declare const MINIMAX_TEXT_MODEL_ORDER: readonly ["MiniMax-M3", "MiniMax-M2.7", "MiniMax-M2.7-highspeed"];
export declare const MINIMAX_TEXT_MODEL_CATALOG: {
  readonly "MiniMax-M3": {
    readonly name: "MiniMax M3";
    readonly reasoning: true;
    readonly input: readonly ["text", "image"];
    readonly contextWindow: 1000000;
    readonly compat: {
      readonly codeMode: "preferred";
    };
  };
  readonly "MiniMax-M2.7": {
    readonly name: "MiniMax M2.7";
    readonly reasoning: true;
    readonly input: readonly ["text"];
    readonly contextWindow: 204800;
  };
  readonly "MiniMax-M2.7-highspeed": {
    readonly name: "MiniMax M2.7 Highspeed";
    readonly reasoning: true;
    readonly input: readonly ["text"];
    readonly contextWindow: 204800;
  };
};
export declare const MINIMAX_TEXT_MODEL_REFS: string[];
export declare function isMiniMaxModernModelId(modelId: string): boolean;
//#endregion
//#region extensions/minimax/onboard.d.ts
export declare function applyMinimaxApiProviderConfig(cfg: OpenClawConfig, modelId?: string): OpenClawConfig;
export declare function applyMinimaxApiConfig(cfg: OpenClawConfig, modelId?: string): OpenClawConfig;
export declare function applyMinimaxApiProviderConfigCn(cfg: OpenClawConfig, modelId?: string): OpenClawConfig;
export declare function applyMinimaxApiConfigCn(cfg: OpenClawConfig, modelId?: string): OpenClawConfig;
//#endregion