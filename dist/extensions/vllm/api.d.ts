import { i as ProviderWrapStreamFnContext } from "../../index-CAkAR5W-.js";
import { Yr as StreamFn } from "../../types-BNSWPjt2.js";
//#region extensions/vllm/defaults.d.ts
export declare const VLLM_DEFAULT_BASE_URL = "http://127.0.0.1:8000/v1";
export declare const VLLM_PROVIDER_LABEL = "vLLM";
export declare const VLLM_DEFAULT_API_KEY_ENV_VAR = "VLLM_API_KEY";
export declare const VLLM_MODEL_PLACEHOLDER = "meta-llama/Meta-Llama-3-8B-Instruct";
//#endregion
//#region extensions/vllm/thinking-policy.d.ts
type VllmQwenThinkingFormat = "chat-template" | "top-level";
//#endregion
//#region extensions/vllm/stream.d.ts
type VllmThinkingLevel = ProviderWrapStreamFnContext["thinkingLevel"];
export declare function createVllmQwenThinkingWrapper(params: {
  baseStreamFn: StreamFn | undefined;
  format: VllmQwenThinkingFormat;
  thinkingLevel: VllmThinkingLevel;
}): StreamFn;
export declare function wrapVllmProviderStream(ctx: ProviderWrapStreamFnContext): StreamFn | undefined;
//#endregion