import "./index-C25RT6bP.mjs";
import { O as Model, j as ModelThinkingLevel, n as Api } from "./types-qZFbaDbK.mjs";
import { a as BaseOpenAIStreamOptions, f as OpenAIReasoningEffort } from "./provider-options-DZYq53lj.mjs";
import "./types-DTvddOfm.mjs";
import { ResponseCompactionItem, ResponseCreateParamsStreaming, ResponseInputItem } from "openai/resources/responses/responses.js";
//#region packages/ai/src/providers/openai-request-reasoning.d.ts
type OpenAIRequestReasoningEffort = ModelThinkingLevel | "none";
//#endregion
//#region packages/ai/src/transports/openai-responses-compaction-window.d.ts
type OpenAIResponsesCompactionOutput = Array<ResponseInputItem.Message | ReplayableResponseCompactionItem>;
/** Read the saved canonical window only when it still matches its opaque checkpoint. */
declare function readOpenAIResponsesCompactionWindow(replay: {
  data: string;
  id?: string;
  compactedWindow?: unknown;
}, model?: Model): OpenAIResponsesCompactionOutput | undefined;
//#endregion
//#region packages/ai/src/transports/openai-responses-contracts.d.ts
declare const OPENAI_RESPONSES_APIS: ReadonlySet<Api>;
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
};
type ResponsesPromptObserver = (observation: ResponsesPromptObservation) => void;
declare const responsesPromptObserver: {
  set(options: object, observer: ResponsesPromptObserver): void;
  get(options: object): ResponsesPromptObserver | undefined;
  copy(source: object | undefined, target: object): void;
};
//#endregion
export { ResponsesPromptObservation as a, readOpenAIResponsesCompactionWindow as c, ReplayableResponseCompactionItem as i, OpenAIRequestReasoningEffort as l, OpenAIResponsesOptions as n, responsesPromptObserver as o, OpenAIResponsesReasoningReplayMetadata as r, OpenAIResponsesCompactionOutput as s, OPENAI_RESPONSES_APIS as t };