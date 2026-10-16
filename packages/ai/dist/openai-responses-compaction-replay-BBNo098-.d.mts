import "./index-D27wAoOr.mjs";
import { a as AssistantMessage, k as Model } from "./types-DvzmWW8J.mjs";
import "./provider-options-CkieKvNJ.mjs";
import { i as ReplayableResponseCompactionItem, l as OpenAIResponsesCompactionOutput, r as OpenAIResponsesReasoningReplayMetadata } from "./openai-responses-contracts-D5yVZBp-.mjs";
import "openai/resources/responses/responses.js";
//#region packages/ai/src/transports/openai-responses-compaction-replay.d.ts
declare function captureOpenAIResponsesCompaction(output: Pick<AssistantMessage, "providerReplay">, item: ReplayableResponseCompactionItem, boundary: number | "retained-users", model: Model, captureMetadata?: OpenAIResponsesReasoningReplayMetadata, compactedOutput?: OpenAIResponsesCompactionOutput): void;
declare class CompactionReplayRefreshRequiredError extends Error {
  constructor();
}
//#endregion
export { captureOpenAIResponsesCompaction as n, CompactionReplayRefreshRequiredError as t };