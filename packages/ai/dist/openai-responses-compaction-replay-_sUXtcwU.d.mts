import "./index-DSprYWaz.mjs";
import { a as AssistantMessage, k as Model } from "./types-CVYzKrMl.mjs";
import "./provider-options-DAzsyi49.mjs";
import { i as ReplayableResponseCompactionItem, r as OpenAIResponsesReasoningReplayMetadata, u as OpenAIResponsesCompactionOutput } from "./openai-responses-contracts-B1nkeLL6.mjs";
import "openai/resources/responses/responses.js";
//#region packages/ai/src/transports/openai-responses-compaction-replay.d.ts
declare function captureOpenAIResponsesCompaction(output: Pick<AssistantMessage, "providerReplay">, item: ReplayableResponseCompactionItem, boundary: number | "retained-users", model: Model, captureMetadata?: OpenAIResponsesReasoningReplayMetadata, compactedOutput?: OpenAIResponsesCompactionOutput, outputTokens?: number): void;
declare class CompactionReplayRefreshRequiredError extends Error {
  constructor();
}
//#endregion
export { captureOpenAIResponsesCompaction as n, CompactionReplayRefreshRequiredError as t };