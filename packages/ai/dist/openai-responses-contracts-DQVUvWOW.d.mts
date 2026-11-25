import { N as ModelThinkingLevel, U as ProviderReplayState, k as Model, n as Api } from "./types-B1ZIh9Ch.mjs";
import "./index-94l3uJ39.mjs";
import { c as AiTransportHost } from "./host-CNOUExXM.mjs";
import "./types-CeCl7cJZ.mjs";
import { a as BaseOpenAIStreamOptions, b as OpenAIReasoningEffort } from "./provider-options-BOGPCBFr.mjs";
import { Response, ResponseCompactionItem, ResponseCreateParamsStreaming, ResponseInputItem, ResponseOutputMessage, ResponseReasoningItem } from "openai/resources/responses/responses.js";
type OpenAIRequestReasoningEffort = ModelThinkingLevel | "none";
type OpenAIResponsesCompactionOutput = Array<ResponseInputItem.Message | ReplayableResponseOutputMessage | ReplayableResponseCompactionItem>;
/** Read the saved canonical window only when it still matches its opaque checkpoint. */
declare function readOpenAIResponsesCompactionWindow(replay: {
  data: string;
  id?: string;
  compactedWindow?: unknown;
}, model?: Model, immutable?: AiTransportHost["immutableData"]): OpenAIResponsesCompactionOutput | undefined;
declare function readOpenAIResponsesItemRecoveryAnchor(replay: ProviderReplayState | undefined): string | undefined;
declare class CompactionReplayRefreshRequiredError extends Error {
  constructor();
}
declare const OPENAI_RESPONSES_REASONING_REPLAY_META_KEY = "__openclaw_replay";
declare const OPENAI_RESPONSES_APIS: ReadonlySet<Api>;
type ReplayableResponseOutputMessage = Omit<ResponseOutputMessage, "id"> & {
  id?: string;
};
type ReplayableResponseCompactionItem = Omit<ResponseCompactionItem, "id"> & {
  id?: string;
};
type OpenAIResponsesReasoningReplayMetadata = {
  v: 1;
  source: "openai-responses";
  provider: string;
  api: Api;
  model: string;
  baseUrlHash?: string;
  sessionHash?: string;
  authProfileHash?: string;
};
type ReplayableResponseReasoningItem = Omit<ResponseReasoningItem, "id"> & {
  id?: string;
  [OPENAI_RESPONSES_REASONING_REPLAY_META_KEY]?: OpenAIResponsesReasoningReplayMetadata;
};
type OpenAIResponsesOptions = BaseOpenAIStreamOptions & {
  reasoning?: OpenAIRequestReasoningEffort;
  reasoningEffort?: OpenAIReasoningEffort;
  reasoningSummary?: "auto" | "detailed" | "concise" | null;
  replayResponsesItemIds?: boolean;
  serviceTier?: ResponseCreateParamsStreaming["service_tier"];
  toolChoice?: ResponseCreateParamsStreaming["tool_choice"];
};
type ResponsesPromptObservation = {
  egress: "responses-sdk" | "responses-websocket" | "native-codex-websocket" | "native-codex-sse";
  payloadVariant: "initial" | "reasoning-stripped" | "compaction-stripped" | "items-reanchored" | "continuation-rejected";
  promptSource: "instructions" | "input.developer" | "input.system" | "missing";
  expectedChars: number;
  observedChars: number;
  matchesAssembledPrompt: boolean;
};
type ResponsesPromptObserver = (observation: ResponsesPromptObservation) => void;
declare const responsesPromptObserver: {
  set(options: object, observer: ResponsesPromptObserver): void;
  get(options: object): ResponsesPromptObserver | undefined;
  copy(source: object | undefined, target: object): void;
};
type ResponsesServiceTierObservation = {
  requestedTier: string;
  responseTier: string;
  rejected?: false;
  responseId?: string;
  responseModel?: string;
  inputTokens?: number;
  cachedTokens?: number;
} | {
  requestedTier: string;
  rejected: true;
};
type ResponsesServiceTierObserver = (observation: ResponsesServiceTierObservation) => void;
declare const responsesServiceTierObserver: {
  set(options: object, observer: ResponsesServiceTierObserver): void;
  get(options: object): ResponsesServiceTierObserver | undefined;
  copy(source: object | undefined, target: object): void;
  reject(options: object | undefined, requestedTier: string): void;
  observe(options: object | undefined, requestedTier: unknown, responseTier: unknown, response?: Pick<Response, "id" | "model" | "usage">): void;
};
export { ReplayableResponseReasoningItem as a, responsesPromptObserver as c, OpenAIResponsesCompactionOutput as d, readOpenAIResponsesCompactionWindow as f, ReplayableResponseCompactionItem as i, responsesServiceTierObserver as l, OpenAIRequestReasoningEffort as m, OpenAIResponsesOptions as n, ResponsesPromptObservation as o, readOpenAIResponsesItemRecoveryAnchor as p, OpenAIResponsesReasoningReplayMetadata as r, ResponsesServiceTierObservation as s, OPENAI_RESPONSES_APIS as t, CompactionReplayRefreshRequiredError as u };