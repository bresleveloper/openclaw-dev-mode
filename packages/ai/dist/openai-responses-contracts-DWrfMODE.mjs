import { r as PROVIDER_POST_DISPATCH_AMBIGUITY_ERROR_CODE } from "./types-LFWwv0cF.mjs";
import { o as isRecord } from "./record-coerce-DwRYMj3t.mjs";
//#region packages/ai/src/transports/openai-responses-contracts.ts
const DEFAULT_AZURE_OPENAI_API_VERSION = "preview";
const OPENAI_CODEX_RESPONSES_DEFAULT_INSTRUCTIONS = "Follow the user request.";
const AZURE_RESPONSES_FIRST_EVENT_TIMEOUT_MS = 3e4;
const RESPONSE_FAILED_NO_DETAILS_MESSAGE = "Unknown error (no error details in response)";
const OPENAI_RESPONSES_REASONING_REPLAY_META_KEY = "__openclaw_replay";
const OPENAI_RESPONSES_REASONING_REPLAY_BLOCK_META_KEY = "openclawReasoningReplay";
const OPENAI_RESPONSES_COMPACTION_REPLAY_TYPE = "openai-responses-compaction";
const OPENAI_RESPONSES_RETAINED_COMPACTION_REPLAY_TYPE = "openai-responses-retained-compaction";
const OPENAI_RESPONSES_APIS = /* @__PURE__ */ new Set([
	"openai-responses",
	"azure-openai-responses",
	"openai-chatgpt-responses",
	"openclaw-openai-responses-transport",
	"openclaw-openai-chatgpt-responses-transport",
	"openclaw-azure-openai-responses-transport"
]);
var OpenAIResponsesWebSocketPreDispatchError = class extends Error {
	constructor(cause) {
		super("OpenAI Responses WebSocket failed before request dispatch", { cause });
		this.name = "OpenAIResponsesWebSocketPreDispatchError";
	}
};
var OpenAIResponsesWebSocketPostDispatchError = class extends Error {
	constructor(cause) {
		super("OpenAI Responses WebSocket failed after request dispatch; outcome is unknown", { cause });
		this.code = PROVIDER_POST_DISPATCH_AMBIGUITY_ERROR_CODE;
		this.name = "OpenAIResponsesWebSocketPostDispatchError";
	}
};
var OpenAIResponsesWebSocketServerError = class extends Error {
	constructor(code, status, param, message, cause) {
		super(message, { cause });
		this.code = code;
		this.status = status;
		this.param = param;
		this.name = "OpenAIResponsesWebSocketServerError";
	}
};
var OpenAIResponsesWebSocketSafeRetryError = class extends OpenAIResponsesWebSocketServerError {};
function readWebSocketServerError(value) {
	if (!isRecord(value) || value.type !== "error") return;
	const details = isRecord(value.error) ? value.error : value;
	if (typeof details.code !== "string" || typeof details.message !== "string") return;
	const rawStatus = value.status ?? value.status_code;
	return {
		code: details.code,
		message: details.message,
		param: typeof details.param === "string" ? details.param : null,
		status: typeof rawStatus === "number" ? rawStatus : void 0
	};
}
function isPreviousResponseRejection(error) {
	return error.code === "previous_response_not_found" || error.code === "unsupported_parameter" && error.param === "previous_response_id";
}
function parseOpenAIResponsesWebSocketServerError(cause) {
	if (!isRecord(cause)) return;
	let details = readWebSocketServerError(cause.error) ?? readWebSocketServerError(cause);
	if (!details && typeof cause.message === "string") try {
		details = readWebSocketServerError(JSON.parse(cause.message));
	} catch {}
	if (!details) return;
	return new (isPreviousResponseRejection(details) || details.code === "websocket_connection_limit_reached" || details.code === "invalid_encrypted_content" || details.code === "thinking_signature_invalid" ? OpenAIResponsesWebSocketSafeRetryError : OpenAIResponsesWebSocketServerError)(details.code, details.status, details.param, details.message, cause);
}
const PROMPT_OBSERVER = Symbol("openaiResponsesPromptObserver");
const responsesPromptObserver = {
	set(options, observer) {
		Reflect.set(options, PROMPT_OBSERVER, observer);
	},
	get(options) {
		return Reflect.get(options, PROMPT_OBSERVER);
	},
	copy(source, target) {
		const observer = source && responsesPromptObserver.get(source);
		if (observer) responsesPromptObserver.set(target, observer);
	}
};
//#endregion
export { OPENAI_RESPONSES_COMPACTION_REPLAY_TYPE as a, OPENAI_RESPONSES_RETAINED_COMPACTION_REPLAY_TYPE as c, OpenAIResponsesWebSocketSafeRetryError as d, RESPONSE_FAILED_NO_DETAILS_MESSAGE as f, responsesPromptObserver as h, OPENAI_RESPONSES_APIS as i, OpenAIResponsesWebSocketPostDispatchError as l, parseOpenAIResponsesWebSocketServerError as m, DEFAULT_AZURE_OPENAI_API_VERSION as n, OPENAI_RESPONSES_REASONING_REPLAY_BLOCK_META_KEY as o, isPreviousResponseRejection as p, OPENAI_CODEX_RESPONSES_DEFAULT_INSTRUCTIONS as r, OPENAI_RESPONSES_REASONING_REPLAY_META_KEY as s, AZURE_RESPONSES_FIRST_EVENT_TIMEOUT_MS as t, OpenAIResponsesWebSocketPreDispatchError as u };
