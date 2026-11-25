import { a as AssistantMessage, at as StreamOptions, gt as Usage, nt as StopReason } from "./types-B1ZIh9Ch.mjs";
import "./types-CeCl7cJZ.mjs";
import OpenAI from "openai";
/** A known output ceiling can resume sampling after admitted tools have settled. */
declare function isResponsesOutputLimitToolCallError(message: Pick<AssistantMessage, "stopReason" | "errorCode" | "diagnostics">): boolean;
/** Terminal usage payload, modeled structurally so untyped callers can pass raw records. */
type ResponsesTerminalUsagePayload = {
  input_tokens?: number | null;
  output_tokens?: number | null;
  total_tokens?: number | null;
  input_tokens_details?: {
    cached_tokens?: number | null;
    cache_write_tokens?: number | null;
    cache_write_tokens_details?: {
      ttl_30m_tokens?: number | null;
      ttl_12h_tokens?: number | null;
    } | null;
  } | null;
  output_tokens_details?: {
    reasoning_tokens?: number | null;
  } | null;
};
/**
 * Split a terminal usage payload into the priced buckets.
 *
 * OpenAI includes cache reads and writes in `input_tokens`, so both are subtracted out of the
 * billable input bucket. `total_tokens` comes from the payload, but never below the sum of the
 * split buckets: proxies routinely omit it (reporting 0 would understate the turn), and a payload
 * whose `cached_tokens` exceeds `input_tokens` clamps the input bucket, leaving the reported total
 * short of what the buckets actually price.
 */
declare function mapResponsesTerminalUsage(usage: ResponsesTerminalUsagePayload | undefined | null): Pick<Usage, "input" | "output" | "cacheRead" | "cacheWrite" | "contextUsage" | "totalTokens"> | undefined;
/** Apply lifetime pricing after base model pricing, before service-tier adjustments. */
declare function applyResponsesCacheWritePricing(usage: Usage, reported: ResponsesTerminalUsagePayload | undefined | null, promptCacheTtl?: StreamOptions["promptCacheTtl"]): void;
/** Reasoning tokens are reported by the agent path only; the package path does not track them. */
declare function readResponsesReasoningTokens(usage: ResponsesTerminalUsagePayload | undefined | null): number | undefined;
/**
 * Resolve the terminal stop reason, including the two overrides every Responses path shares: a
 * content-filtered turn is a provider error rather than a truncated answer, and a turn that
 * produced tool calls reports `toolUse` instead of a plain stop.
 */
declare function resolveResponsesTerminalStopReason(params: {
  status: OpenAI.Responses.ResponseStatus | undefined;
  terminalEventType?: "response.completed" | "response.incomplete";
  incompleteReason?: string;
  hasToolCall: boolean;
}): {
  stopReason: StopReason;
  errorMessage?: string;
};
export { readResponsesReasoningTokens as a, mapResponsesTerminalUsage as i, applyResponsesCacheWritePricing as n, resolveResponsesTerminalStopReason as o, isResponsesOutputLimitToolCallError as r, ResponsesTerminalUsagePayload as t };