import { T as StreamFn } from "./types-BoFHdU9q.js";
import { an as ProviderWrapStreamFnContext } from "./plugin-entry-DpILbQ7M.js";
import { t as VllmQwenThinkingFormat } from "./thinking-policy-s2hl7EPO.js";

//#region extensions/vllm/stream.d.ts
type VllmThinkingLevel = ProviderWrapStreamFnContext["thinkingLevel"];
declare function createVllmQwenThinkingWrapper(params: {
  baseStreamFn: StreamFn | undefined;
  format: VllmQwenThinkingFormat;
  thinkingLevel: VllmThinkingLevel;
}): StreamFn;
declare function createVllmProviderThinkingWrapper(params: {
  baseStreamFn: StreamFn | undefined;
  qwenFormat?: VllmQwenThinkingFormat;
  thinkingLevel: VllmThinkingLevel;
}): StreamFn;
declare function wrapVllmProviderStream(ctx: ProviderWrapStreamFnContext): StreamFn | undefined;
//#endregion
export { createVllmQwenThinkingWrapper as n, wrapVllmProviderStream as r, createVllmProviderThinkingWrapper as t };