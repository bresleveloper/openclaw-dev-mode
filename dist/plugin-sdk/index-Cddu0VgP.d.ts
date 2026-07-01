import { O as Tool, a as AssistantMessageEventStreamContract, i as AssistantMessageEvent, k as ToolCall, r as AssistantMessage } from "./types-Boa_mcGH.js";

//#region packages/llm-core/src/model-contracts/anthropic.d.ts
type ClaudeModelRef = {
  id?: string;
  params?: Record<string, unknown>;
};
type ClaudeEffortModelRef = ClaudeModelRef & {
  thinkingLevelMap?: Record<string, string | null | undefined>;
};
/** Resolve the canonical normalized Claude model id for one runtime model ref. */
declare function resolveClaudeModelIdentity(ref: ClaudeModelRef): string;
/** Resolve Claude Fable 5 through direct ids, cloud ids, or deployment metadata. */
declare function resolveClaudeFable5ModelIdentity(ref: ClaudeModelRef): string | undefined;
/** Return whether a Claude model supports adaptive thinking. */
declare function supportsClaudeAdaptiveThinking(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model supports native max effort. */
declare function supportsClaudeNativeMaxEffort(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model supports native xhigh effort. */
declare function supportsClaudeNativeXhighEffort(ref: ClaudeModelRef): boolean;
/**
 * Fill native Claude effort mappings only when the provider did not publish a
 * narrower route-specific contract.
 */
declare function resolveClaudeNativeThinkingLevelMap(ref: ClaudeEffortModelRef): Record<string, string | null | undefined> | undefined;
//#endregion
//#region packages/llm-core/src/utils/event-stream.d.ts
/** Generic async-iterable event stream with a separately awaited final result. */
declare class EventStream<T, R = T> implements AsyncIterable<T> {
  private queue;
  private waiting;
  private done;
  private finalResultPromise;
  private resolveFinalResult;
  private isComplete;
  private extractResult;
  constructor(isComplete: (event: T) => boolean, extractResult: (event: T) => R);
  push(event: T): void;
  end(result?: R): void;
  [Symbol.asyncIterator](): AsyncIterator<T>;
  result(): Promise<R>;
}
/** Assistant-message event stream that resolves on done/error terminal events. */
declare class AssistantMessageEventStream extends EventStream<AssistantMessageEvent, AssistantMessage> implements AssistantMessageEventStreamContract {
  constructor();
}
/** Creates an assistant-message stream for provider and plugin adapters. */
declare function createAssistantMessageEventStream(): AssistantMessageEventStream;
//#endregion
//#region packages/llm-core/src/validation.d.ts
/** Finds the target tool and validates/coerces a model-emitted tool call. */
declare function validateToolCall(tools: Tool[], toolCall: ToolCall): unknown;
/** Validates tool arguments against TypeBox or plain JSON-schema parameters. */
declare function validateToolArguments(tool: Tool, toolCall: ToolCall): unknown;
//#endregion
export { createAssistantMessageEventStream as a, resolveClaudeNativeThinkingLevelMap as c, supportsClaudeNativeXhighEffort as d, EventStream as i, supportsClaudeAdaptiveThinking as l, validateToolCall as n, resolveClaudeFable5ModelIdentity as o, AssistantMessageEventStream as r, resolveClaudeModelIdentity as s, validateToolArguments as t, supportsClaudeNativeMaxEffort as u };