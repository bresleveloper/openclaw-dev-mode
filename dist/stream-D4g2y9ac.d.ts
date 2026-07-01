import { c as Context } from "./types-Boa_mcGH.js";
import { T as StreamFn } from "./types-BoFHdU9q.js";
import { an as ProviderWrapStreamFnContext } from "./plugin-entry-DpILbQ7M.js";
//#region extensions/github-copilot/stream.d.ts
declare function hasCopilotVisionInput(messages: Context["messages"]): boolean;
declare function buildCopilotDynamicHeaders(params: {
  messages: Context["messages"];
  hasImages: boolean;
}): Record<string, string>;
declare function wrapCopilotAnthropicStream(baseStreamFn: StreamFn | undefined): StreamFn | undefined;
declare function wrapCopilotOpenAIResponsesStream(baseStreamFn: StreamFn | undefined): StreamFn | undefined;
declare function wrapCopilotOpenAICompletionsStream(baseStreamFn: StreamFn | undefined): StreamFn | undefined;
declare function wrapCopilotProviderStream(ctx: ProviderWrapStreamFnContext): StreamFn | undefined;
//#endregion
export { wrapCopilotOpenAIResponsesStream as a, wrapCopilotOpenAICompletionsStream as i, hasCopilotVisionInput as n, wrapCopilotProviderStream as o, wrapCopilotAnthropicStream as r, buildCopilotDynamicHeaders as t };