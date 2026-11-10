import "./index-DSprYWaz.mjs";
import { M as ModelThinkingLevel, k as Model, n as Api } from "./types-CVYzKrMl.mjs";
import { a as BaseOpenAIStreamOptions, y as OpenAIReasoningEffort } from "./provider-options-DAzsyi49.mjs";
import "./types-CBJthzJX.mjs";
import { Response, ResponseCompactionItem, ResponseCreateParamsStreaming, ResponseInputItem, ResponseOutputMessage, ResponseReasoningItem } from "openai/resources/responses/responses.js";
//#region packages/ai/src/providers/openai-request-reasoning.d.ts
type OpenAIRequestReasoningEffort = ModelThinkingLevel | "none";
//#endregion
//#region packages/ai/src/transports/openai-responses-compaction-window.d.ts
type OpenAIResponsesCompactionOutput = Array<ResponseInputItem.Message | ReplayableResponseOutputMessage | ReplayableResponseCompactionItem>;
/** Read the saved canonical window only when it still matches its opaque checkpoint. */
declare function readOpenAIResponsesCompactionWindow(replay: {
  data: string;
  id?: string;
  compactedWindow?: unknown;
}, model?: Model): OpenAIResponsesCompactionOutput | undefined;
//#endregion
//#region packages/ai/src/transports/openai-responses-contracts.d.ts
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
  payloadVariant: "initial" | "reasoning-stripped" | "compaction-stripped" | "continuation-rejected";
  promptSource: "instructions" | "input.developer" | "input.system" | "missing";
  expectedChars: number;
  observedChars: number;
  matchesAssembledPrompt: boolean;
  model?: string;
  reasoningEffort?: string;
  sessionsSpawn?: {
    strict?: boolean;
    categoryRequired: boolean;
  };
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
//#endregion
export { ReplayableResponseReasoningItem as a, responsesPromptObserver as c, readOpenAIResponsesCompactionWindow as d, OpenAIRequestReasoningEffort as f, ReplayableResponseCompactionItem as i, responsesServiceTierObserver as l, OpenAIResponsesOptions as n, ResponsesPromptObservation as o, OpenAIResponsesReasoningReplayMetadata as r, ResponsesServiceTierObservation as s, OPENAI_RESPONSES_APIS as t, OpenAIResponsesCompactionOutput as u };