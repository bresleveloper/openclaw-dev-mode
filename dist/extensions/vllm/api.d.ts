import { xx as ProviderWrapStreamFnContext } from "../../config-contracts-hzlacViZ.js";
import { h as StreamFn } from "../../types-Bjy6vVru.js";
type VllmQwenThinkingFormat = "chat-template" | "top-level";
type VllmThinkingLevel = ProviderWrapStreamFnContext["thinkingLevel"];
export declare function createVllmQwenThinkingWrapper(params: {
  baseStreamFn: StreamFn | undefined;
  format: VllmQwenThinkingFormat;
  thinkingLevel: VllmThinkingLevel;
}): StreamFn;
export declare function wrapVllmProviderStream(ctx: ProviderWrapStreamFnContext): StreamFn | undefined;
export declare const VLLM_DEFAULT_BASE_URL = "http://127.0.0.1:8000/v1";
export declare const VLLM_PROVIDER_LABEL = "vLLM";
export declare const VLLM_DEFAULT_API_KEY_ENV_VAR = "VLLM_API_KEY";
export declare const VLLM_MODEL_PLACEHOLDER = "meta-llama/Meta-Llama-3-8B-Instruct";
export {};