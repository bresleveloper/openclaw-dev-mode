import { a as AssistantMessage, k as Model } from "./types-B1ZIh9Ch.mjs";
import "./index-94l3uJ39.mjs";
import "./provider-options-BOGPCBFr.mjs";
import { d as OpenAIResponsesCompactionOutput, i as ReplayableResponseCompactionItem, r as OpenAIResponsesReasoningReplayMetadata } from "./openai-responses-contracts-DQVUvWOW.mjs";
import "openai/resources/responses/responses.js";
declare function captureOpenAIResponsesCompaction(output: Pick<AssistantMessage, "providerReplay">, item: ReplayableResponseCompactionItem, boundary: number | "retained-users", model: Model, captureMetadata?: OpenAIResponsesReasoningReplayMetadata, compactedOutput?: OpenAIResponsesCompactionOutput, outputTokens?: number): void;
export { captureOpenAIResponsesCompaction as t };