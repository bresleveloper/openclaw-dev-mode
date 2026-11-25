import { l as ModelDefinitionConfig, p as ModelProviderDeclarationConfig, r as OpenClawConfig } from "../../types.openclaw-D8uW-XQA.js";
import "../../provider-model-shared-OQQj5XdR.js";
import "../../provider-onboard-BitR1dNE.js";
import "../../provider-catalog-live-runtime-DnKGuU0_.js";
export declare function buildMinimaxProvider(env?: NodeJS.ProcessEnv): ModelProviderDeclarationConfig;
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
export declare const MINIMAX_DEFAULT_MODEL_ID = "MiniMax-M3";
export declare const MINIMAX_DEFAULT_MODEL_REF = "minimax/MiniMax-M3";
export declare const MINIMAX_TEXT_MODEL_ORDER: readonly ["MiniMax-M3", "MiniMax-M3.1-Flash", "MiniMax-M3.1-Flash-Preview"];
export declare const MINIMAX_TEXT_MODEL_CATALOG: {
  readonly "MiniMax-M3.1-Flash": {
    readonly reasoning: true;
    readonly input: readonly ["text", "image"];
    readonly contextWindow: 1000000;
    readonly compat: {
      readonly codeMode: "preferred";
      readonly supportsTemperature: false;
    };
    readonly name: "MiniMax M3.1 Flash";
  };
  readonly "MiniMax-M3.1-Flash-Preview": {
    readonly reasoning: true;
    readonly input: readonly ["text", "image"];
    readonly contextWindow: 1000000;
    readonly compat: {
      readonly codeMode: "preferred";
      readonly supportsTemperature: false;
    };
    readonly name: "MiniMax M3.1 Flash Preview";
  };
  readonly "MiniMax-M3": {
    readonly reasoning: true;
    readonly input: readonly ["text", "image"];
    readonly contextWindow: 1000000;
    readonly compat: {
      readonly codeMode: "preferred";
      readonly supportsTemperature: false;
    };
    readonly name: "MiniMax M3";
  };
};
export declare const MINIMAX_TEXT_MODEL_REFS: string[];
export declare function isMiniMaxModernModelId(modelId: string): boolean;
export declare const applyMinimaxApiProviderConfig: (cfg: OpenClawConfig, modelId?: string) => OpenClawConfig;
export declare const applyMinimaxApiConfig: (cfg: OpenClawConfig, modelId?: string) => OpenClawConfig;
export declare const applyMinimaxApiProviderConfigCn: (cfg: OpenClawConfig, modelId?: string) => OpenClawConfig;
export declare const applyMinimaxApiConfigCn: (cfg: OpenClawConfig, modelId?: string) => OpenClawConfig;
export {};