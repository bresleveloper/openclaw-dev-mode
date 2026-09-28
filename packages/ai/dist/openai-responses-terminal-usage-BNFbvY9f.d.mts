import { K as StopReason, a as AssistantMessage, ot as Usage } from "./types-qZFbaDbK.mjs";
import "./types-DTvddOfm.mjs";
import OpenAI from "openai";
//#region packages/ai/src/providers/openai-responses-terminal-usage.d.ts
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
//#endregion
export { resolveResponsesTerminalStopReason as a, readResponsesReasoningTokens as i, isResponsesOutputLimitToolCallError as n, mapResponsesTerminalUsage as r, ResponsesTerminalUsagePayload as t };