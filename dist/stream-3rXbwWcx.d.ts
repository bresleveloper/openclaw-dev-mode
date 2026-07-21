import { c as Context } from "./types-CFIUY_La.js";
import { T as StreamFn } from "./types-D0CdrmU4.js";
import { an as ProviderWrapStreamFnContext } from "./plugin-entry-L7QTXRH5.js";
//#region extensions/github-copilot/stream.d.ts
declare function buildCopilotDynamicHeaders(params: {
  messages: Context["messages"];
  hasImages: boolean;
}): Record<string, string>;
declare function wrapCopilotAnthropicStream(baseStreamFn: StreamFn | undefined): StreamFn | undefined;
declare function wrapCopilotOpenAIResponsesStream(baseStreamFn: StreamFn | undefined): StreamFn | undefined;
declare function wrapCopilotOpenAICompletionsStream(baseStreamFn: StreamFn | undefined): StreamFn | undefined;
declare function wrapCopilotProviderStream(ctx: ProviderWrapStreamFnContext): StreamFn | undefined;
//#endregion
export { wrapCopilotProviderStream as a, wrapCopilotOpenAIResponsesStream as i, wrapCopilotAnthropicStream as n, wrapCopilotOpenAICompletionsStream as r, buildCopilotDynamicHeaders as t };