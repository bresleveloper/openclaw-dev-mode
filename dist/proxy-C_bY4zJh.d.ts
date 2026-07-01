import { c as Context, f as Model, i as AssistantMessageEvent, r as AssistantMessage, v as SimpleStreamOptions, y as StopReason } from "./types-Boa_mcGH.js";
import { i as EventStream } from "./index-Cddu0VgP.js";

//#region src/agents/runtime/proxy.d.ts
declare class ProxyMessageEventStream extends EventStream<AssistantMessageEvent, AssistantMessage> {
  constructor();
}
/**
 * Proxy event types - server sends these with partial field stripped to reduce bandwidth.
 */
type ProxyAssistantMessageEvent = {
  type: "start";
} | {
  type: "text_start";
  contentIndex: number;
} | {
  type: "text_delta";
  contentIndex: number;
  delta: string;
} | {
  type: "text_end";
  contentIndex: number;
  contentSignature?: string;
} | {
  type: "thinking_start";
  contentIndex: number;
} | {
  type: "thinking_delta";
  contentIndex: number;
  delta: string;
} | {
  type: "thinking_end";
  contentIndex: number;
  contentSignature?: string;
} | {
  type: "toolcall_start";
  contentIndex: number;
  id: string;
  toolName: string;
} | {
  type: "toolcall_delta";
  contentIndex: number;
  delta: string;
} | {
  type: "toolcall_end";
  contentIndex: number;
} | {
  type: "done";
  reason: Extract<StopReason, "stop" | "length" | "toolUse">;
  usage: AssistantMessage["usage"];
} | {
  type: "error";
  reason: Extract<StopReason, "aborted" | "error">;
  errorMessage?: string;
  usage: AssistantMessage["usage"];
};
type ProxySerializableStreamOptions = Pick<SimpleStreamOptions, "temperature" | "maxTokens" | "reasoning" | "cacheRetention" | "sessionId" | "promptCacheKey" | "metadata" | "transport" | "thinkingBudgets" | "maxRetryDelayMs">;
interface ProxyStreamOptions extends ProxySerializableStreamOptions {
  /** Local abort signal for the proxy request */
  signal?: AbortSignal;
  /** Auth token for the proxy server */
  authToken: string;
  /** Proxy server URL (e.g., "https://genai.example.com") */
  proxyUrl: string;
}
declare function streamProxy(model: Model, context: Context, options: ProxyStreamOptions): ProxyMessageEventStream;
//#endregion
export { ProxyStreamOptions as n, streamProxy as r, ProxyAssistantMessageEvent as t };