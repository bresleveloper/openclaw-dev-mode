import "./src-CyA0zJnt.mjs";
import { _ as runtimeContextContentToText, f as hasRuntimeContextMarker, p as isRuntimeContextMessage } from "./types-BXd0kI8-.mjs";
import { o as readProviderRefusalReview, t as appendAssistantMessageDiagnostic } from "./diagnostics-DzrF1h4J.mjs";
import { r as appendAssistantThinking } from "./event-stream-X2gmsUWv.mjs";
import { o as isRecord, r as asOptionalObjectRecord } from "./record-coerce-CNDovvft.mjs";
import { l as readStringValue, o as normalizeOptionalString, r as normalizeLowercaseStringOrEmpty, s as normalizeStringifiedOptionalString } from "./string-coerce-Cj8sqWHx.mjs";
import { t as asFiniteNumber } from "./number-coercion-37gmNkuA.mjs";
import { D as applyProviderReportedUsageCost, E as headersToRecord, N as isImageWithMediaPayload, O as calculateCost, a as resolveAiTransportHeaderSentinels, k as clampThinkingLevel, r as getAiTransportHost } from "./host-CWt55nnF.mjs";
import { A as supportsOpenAIReasoningEffort, D as resolveOpenAIReasoningEffortForModel, E as resolveOpenAIModelReasoningEfforts, L as resolveOpenAIThinkingApi, O as resolveOpenAIReasoningEffortMapping, P as MODEL_CATALOG_THINKING_LEVELS, T as normalizeOpenAIReasoningEffort, _ as responsesServiceTierObserver, a as OPENAI_RESPONSES_COMPACTION_REPLAY_TYPE, c as OPENAI_RESPONSES_RETAINED_COMPACTION_REPLAY_TYPE, f as RESPONSES_RETAINED_USER, i as OPENAI_RESPONSES_APIS, j as supportsOpenAITemperature, m as isPreviousResponseRejection, o as OPENAI_RESPONSES_REASONING_REPLAY_BLOCK_META_KEY, p as RESPONSE_FAILED_NO_DETAILS_MESSAGE, s as OPENAI_RESPONSES_REASONING_REPLAY_META_KEY, v as isResponsesServiceTierRejection, y as nextResponsesServiceTier } from "./openai-responses-contracts-B5mGAbR6.mjs";
import { n as getSessionResourceOwnerId, r as registerSessionResourceCleanup } from "./session-resources-vKvGIE3J.mjs";
import { c as stableStringify, s as truncateUtf16Safe } from "./provider-error-qtZD2inE.mjs";
import { n as clampOpenAIPromptCacheKey } from "./openai-prompt-cache-B9AvdoEo.mjs";
import { _ as mapResponsesTerminalUsage, a as resolveModelPayloadDebugMode, d as ResponsesOutputIdentityError, f as countToolCallTrailingWhitespace, m as isResponsesProviderTool, p as hasOnlyResponsesFunctionTools, r as emitModelTransportDebug, v as readResponsesReasoningTokens, y as resolveResponsesTerminalStopReason } from "./diagnostics-v7oVEW59.mjs";
import { a as redactSensitiveText, r as isCodeModeModelVisibleToolName } from "./transport-utils-DwOpuTjL.mjs";
import { c as resolveOpenAIResponsesTextFormat, i as resolveOpenAICompletionsCompat, o as usesNativeOpenAICodexResponsesBackend } from "./openai-completions-compat-bNQXF1y9.mjs";
import { r as resolveModelRequestTimeoutMs } from "./host-policy-Dm7PM6AD.mjs";
import { r as sortPromptCacheToolsByName } from "./prompt-cache-stability-D_MeCQFI.mjs";
import { d as extractToolResultBlockText, f as extractToolResultText, h as preparedRequestSuffix, l as describeToolResultMediaPlaceholder, r as clampMaxTokensToModel, s as prepareModelRequestBody, w as stripSystemPromptCacheBoundary } from "./simple-options-xJkqrG_E.mjs";
import { A as shortHash, C as parseJsonObjectPreservingUnsafeIntegers, E as createToolArgumentPreviewSchedule, O as parseStreamingJson, S as withProviderResponseHook, b as transportAbortError, c as failTransportStream, d as iterateModelStream, g as parseTerminalToolCallArguments, m as notifyProviderHttpResponse, t as IncompleteToolCallError, u as finalizeTransportStream, v as sanitizeTransportPayloadText } from "./transport-stream-shared-lhgkTOz3.mjs";
import { C as redactIdentifier, n as prepareRuntimeToolInputSchema, r as projectRuntimeToolInputSchema, w as sha256Hex } from "./tool-schema-json-projection-B1sTYwfH.mjs";
import { n as isProviderReplayContext, r as providerReplayContextMatches, t as buildProviderReplayContext } from "./provider-replay-context-4vxI7p4V.mjs";
import { n as transformProviderMessages } from "./assistant-output-BnQm3fov.mjs";
import { t as notifyLlmRequestActivity } from "./llm-request-activity-CfMuh5cC.mjs";
import { n as resolveOpencodeSessionHeaders } from "./session-affinity-DA4WHv1h.mjs";
import { a as withFirstStreamEventTimeout, i as getFirstStreamEventTimeoutMs, r as getFirstStreamEventTimeoutHandler, t as createFirstStreamEventAbortController } from "./stream-first-event-timeout-D_TfJHRJ.mjs";
import { a as resolveOpenAIProjectedToolsStrictToolFlag, b as prepareOpenAIFunctionTool, p as withPreparedToolSchemaNormalization, r as normalizeOpenAIStrictToolParameters, t as findOpenAIStrictToolProjectionDiagnostics } from "./openai-tool-schema-BTEU2xmN.mjs";
import { a as isOpenAIResponsesCompactionOutput, n as supportsNativeOpenAIResponsesEndpoint, o as readOpenAIResponsesCompactionWindow } from "./openai-responses-endpoint-CfKR6N5f.mjs";
import { randomUUID } from "node:crypto";
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/tslib.mjs
function __classPrivateFieldSet(receiver, state, value, kind, f) {
	if (kind === "m") throw new TypeError("Private method is not writable");
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
	return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function __classPrivateFieldGet(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/errors.mjs
function isAbortError(err) {
	return typeof err === "object" && err !== null && ("name" in err && err.name === "AbortError" || "message" in err && String(err.message).includes("FetchRequestCanceledException"));
}
const castToError = (err) => {
	if (err instanceof Error) return err;
	if (typeof err === "object" && err !== null) {
		try {
			if (Object.prototype.toString.call(err) === "[object Error]") {
				const hasCause = "cause" in err;
				const error = new Error(err.message, hasCause ? { cause: err.cause } : {});
				if (err.stack) error.stack = err.stack;
				if (hasCause && !Object.prototype.hasOwnProperty.call(error, "cause")) error.cause = err.cause;
				if (err.name) error.name = err.name;
				return error;
			}
		} catch {}
		try {
			return new Error(JSON.stringify(err));
		} catch {}
	}
	return new Error(err);
};
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/core/error.mjs
var OpenAIError = class extends Error {};
var APIError = class APIError extends OpenAIError {
	constructor(status, error, message, headers) {
		super(`${APIError.makeMessage(status, error, message)}`);
		this.status = status;
		this.headers = headers;
		this.requestID = headers?.get("x-request-id");
		this.error = error;
		const data = error;
		this.code = data?.["code"];
		this.param = data?.["param"];
		this.type = data?.["type"];
	}
	static makeMessage(status, error, message) {
		const msg = error?.message ? typeof error.message === "string" ? error.message : JSON.stringify(error.message) : error ? JSON.stringify(error) : message;
		if (status && msg) return `${status} ${msg}`;
		if (status) return `${status} status code (no body)`;
		if (msg) return msg;
		return "(no status code or body)";
	}
	static generate(status, errorResponse, message, headers) {
		if (!status || !headers) return new APIConnectionError({
			message,
			cause: castToError(errorResponse)
		});
		const error = errorResponse?.["error"];
		if (status === 400) return new BadRequestError(status, error, message, headers);
		if (status === 401) return new AuthenticationError(status, error, message, headers);
		if (status === 403) return new PermissionDeniedError(status, error, message, headers);
		if (status === 404) return new NotFoundError(status, error, message, headers);
		if (status === 409) return new ConflictError(status, error, message, headers);
		if (status === 422) return new UnprocessableEntityError(status, error, message, headers);
		if (status === 429) return new RateLimitError(status, error, message, headers);
		if (status >= 500) return new InternalServerError(status, error, message, headers);
		return new APIError(status, error, message, headers);
	}
};
var APIUserAbortError = class extends APIError {
	constructor({ message } = {}) {
		super(void 0, void 0, message || "Request was aborted.", void 0);
	}
};
var APIConnectionError = class extends APIError {
	constructor({ message, cause }) {
		super(void 0, void 0, message || "Connection error.", void 0);
		if (cause) this.cause = cause;
	}
};
var APIConnectionTimeoutError = class extends APIConnectionError {
	constructor({ message } = {}) {
		super({ message: message ?? "Request timed out." });
	}
};
var BadRequestError = class extends APIError {};
var AuthenticationError = class extends APIError {};
var PermissionDeniedError = class extends APIError {};
var NotFoundError = class extends APIError {};
var ConflictError = class extends APIError {};
var UnprocessableEntityError = class extends APIError {};
var RateLimitError = class extends APIError {};
var InternalServerError = class extends APIError {};
var LengthFinishReasonError = class extends OpenAIError {
	constructor() {
		super(`Could not parse response content as the length limit was reached`);
	}
};
var ContentFilterFinishReasonError = class extends OpenAIError {
	constructor() {
		super(`Could not parse response content as the request was rejected by the content filter`);
	}
};
var InvalidWebhookSignatureError = class extends Error {
	constructor(message) {
		super(message);
	}
};
/**
* Error thrown by the API server during OAuth token exchange.
* Can have status codes 400, 401, or 403.
* Other status codes from OAuth endpoints are raised as normal APIError types.
*/
var OAuthError = class extends APIError {
	constructor(status, error, headers) {
		let finalMessage = "OAuth2 authentication error";
		let error_code = void 0;
		if (error && typeof error === "object") {
			const errorData = error;
			error_code = errorData["error"];
			const description = errorData["error_description"];
			if (description && typeof description === "string") finalMessage = description;
			else if (error_code) finalMessage = error_code;
		}
		super(status, error, finalMessage, headers);
		this.error_code = error_code;
	}
};
var SubjectTokenProviderError = class extends OpenAIError {
	constructor(message, provider, cause) {
		super(message);
		this.provider = provider;
		this.cause = cause;
	}
};
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/utils/values.mjs
const startsWithSchemeRegexp = /^[a-z][a-z0-9+.-]*:/i;
const isAbsoluteURL = (url) => {
	return startsWithSchemeRegexp.test(url);
};
let isArray = (val) => (isArray = Array.isArray, isArray(val));
let isReadonlyArray = isArray;
/** Returns an object if the given value isn't an object, otherwise returns as-is */
function maybeObj(x) {
	if (typeof x !== "object") return {};
	return x ?? {};
}
function isEmptyObj(obj) {
	if (!obj) return true;
	for (const _k in obj) return false;
	return true;
}
function hasOwn(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
}
function isObj(obj) {
	return obj != null && typeof obj === "object" && !Array.isArray(obj);
}
const validatePositiveInteger = (name, n) => {
	if (typeof n !== "number" || !Number.isInteger(n)) throw new OpenAIError(`${name} must be an integer`);
	if (n < 0) throw new OpenAIError(`${name} must be a positive integer`);
	return n;
};
const safeJSON = (text) => {
	try {
		return JSON.parse(text);
	} catch (err) {
		return;
	}
};
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/shims.mjs
/**
* This module provides internal shims and utility functions for environments where certain Node.js or global types may not be available.
*
* These are used to ensure we can provide a consistent behaviour between different JavaScript environments and good error
* messages in cases where an environment isn't fully supported.
*/
function getDefaultFetch() {
	if (typeof fetch !== "undefined") return fetch;
	throw new Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new OpenAI({ fetch })` or polyfill the global, `globalThis.fetch = fetch`");
}
function makeReadableStream(...args) {
	const ReadableStream = globalThis.ReadableStream;
	if (typeof ReadableStream === "undefined") throw new Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
	return new ReadableStream(...args);
}
function ReadableStreamFrom(iterable) {
	let iter = Symbol.asyncIterator in iterable ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();
	return makeReadableStream({
		start() {},
		async pull(controller) {
			const { done, value } = await iter.next();
			if (done) controller.close();
			else controller.enqueue(value);
		},
		async cancel() {
			await iter.return?.();
		}
	});
}
/**
* Most browsers don't yet have async iterable support for ReadableStream,
* and Node has a very different way of reading bytes from its "ReadableStream".
*
* This polyfill was pulled from https://github.com/MattiasBuelens/web-streams-polyfill/pull/122#issuecomment-1627354490
*/
function ReadableStreamToAsyncIterable(stream) {
	if (stream[Symbol.asyncIterator]) return stream;
	const reader = stream.getReader();
	return {
		async next() {
			try {
				const result = await reader.read();
				if (result?.done) reader.releaseLock();
				return result;
			} catch (e) {
				reader.releaseLock();
				throw e;
			}
		},
		async return() {
			const cancelPromise = reader.cancel();
			reader.releaseLock();
			await cancelPromise;
			return {
				done: true,
				value: void 0
			};
		},
		[Symbol.asyncIterator]() {
			return this;
		}
	};
}
/**
* Cancels a ReadableStream we don't need to consume.
* See https://undici.nodejs.org/#/?id=garbage-collection
*/
async function CancelReadableStream(stream) {
	if (stream === null || typeof stream !== "object") return;
	if (stream[Symbol.asyncIterator]) {
		await stream[Symbol.asyncIterator]().return?.();
		return;
	}
	const reader = stream.getReader();
	const cancelPromise = reader.cancel();
	reader.releaseLock();
	await cancelPromise;
}
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/utils/bytes.mjs
let encodeUTF8_;
/** Encodes text as UTF-8 bytes, reusing the platform encoder after its first call. */
function encodeUTF8(str) {
	let encoder;
	return (encodeUTF8_ ?? (encoder = new globalThis.TextEncoder(), encodeUTF8_ = encoder.encode.bind(encoder)))(str);
}
let decodeUTF8_;
/** Decodes UTF-8 bytes as text, reusing the platform decoder after its first call. */
function decodeUTF8(bytes) {
	let decoder;
	return (decodeUTF8_ ?? (decoder = new globalThis.TextDecoder(), decodeUTF8_ = decoder.decode.bind(decoder)))(bytes);
}
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/decoders/line.mjs
var _LineDecoder_instances;
var _LineDecoder_buffer;
var _LineDecoder_start;
var _LineDecoder_end;
var _LineDecoder_searchIndex;
var _LineDecoder_skipLeadingLF;
var _LineDecoder_append;
/** Maximum backing-buffer capacity retained when completed lines leave little active data. */
const MAX_RETAINED_BUFFER_BYTES = 65536;
/**
* Incrementally decodes UTF-8 text into lines without losing partial characters
* or newline sequences that span multiple chunks.
*
* Supports `\n`, `\r`, and `\r\n` line endings. Call {@link flush} after the
* final chunk to emit a trailing line that does not end with a newline.
*
* Based on the line decoder used by the Python `httpx` project:
* https://github.com/encode/httpx/blob/920333ea98118e9cf617f246905d7b202510941c/httpx/_decoders.py#L258
*/
var LineDecoder = class {
	/** Creates a decoder with no buffered bytes or pending newline continuation. */
	constructor() {
		_LineDecoder_instances.add(this);
		_LineDecoder_buffer.set(this, void 0);
		_LineDecoder_start.set(this, void 0);
		_LineDecoder_end.set(this, void 0);
		_LineDecoder_searchIndex.set(this, void 0);
		_LineDecoder_skipLeadingLF.set(this, void 0);
		__classPrivateFieldSet(this, _LineDecoder_buffer, /* @__PURE__ */ new Uint8Array(), "f");
		__classPrivateFieldSet(this, _LineDecoder_start, 0, "f");
		__classPrivateFieldSet(this, _LineDecoder_end, 0, "f");
		__classPrivateFieldSet(this, _LineDecoder_searchIndex, 0, "f");
		__classPrivateFieldSet(this, _LineDecoder_skipLeadingLF, false, "f");
	}
	/**
	* Appends a text or UTF-8 byte chunk and returns every newly completed line.
	*
	* Incomplete lines remain buffered for the next call. A trailing `\r`
	* completes its line immediately, and a following `\n` is consumed as its
	* continuation. `null` and `undefined` are ignored and do not flush buffered
	* content.
	*/
	decode(chunk) {
		if (chunk == null) return [];
		let binaryChunk;
		if (chunk instanceof ArrayBuffer) binaryChunk = new Uint8Array(chunk);
		else if (typeof chunk === "string") binaryChunk = encodeUTF8(chunk);
		else binaryChunk = chunk;
		if (binaryChunk.length === 0) return [];
		if (__classPrivateFieldGet(this, _LineDecoder_skipLeadingLF, "f")) {
			__classPrivateFieldSet(this, _LineDecoder_skipLeadingLF, false, "f");
			if (binaryChunk[0] === 10) binaryChunk = binaryChunk.subarray(1);
			if (binaryChunk.length === 0) return [];
		}
		__classPrivateFieldGet(this, _LineDecoder_instances, "m", _LineDecoder_append).call(this, binaryChunk);
		const lines = [];
		let patternIndex;
		while ((patternIndex = findNewlineIndex(__classPrivateFieldGet(this, _LineDecoder_buffer, "f"), __classPrivateFieldGet(this, _LineDecoder_searchIndex, "f"), __classPrivateFieldGet(this, _LineDecoder_end, "f"))) != null) {
			const line = decodeUTF8(__classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(__classPrivateFieldGet(this, _LineDecoder_start, "f"), patternIndex.preceding));
			lines.push(line);
			__classPrivateFieldSet(this, _LineDecoder_start, patternIndex.index, "f");
			if (patternIndex.carriage) {
				if (__classPrivateFieldGet(this, _LineDecoder_start, "f") < __classPrivateFieldGet(this, _LineDecoder_end, "f") && __classPrivateFieldGet(this, _LineDecoder_buffer, "f")[__classPrivateFieldGet(this, _LineDecoder_start, "f")] === 10) __classPrivateFieldSet(this, _LineDecoder_start, __classPrivateFieldGet(this, _LineDecoder_start, "f") + 1, "f");
				else if (__classPrivateFieldGet(this, _LineDecoder_start, "f") === __classPrivateFieldGet(this, _LineDecoder_end, "f")) __classPrivateFieldSet(this, _LineDecoder_skipLeadingLF, true, "f");
			}
			__classPrivateFieldSet(this, _LineDecoder_searchIndex, __classPrivateFieldGet(this, _LineDecoder_start, "f"), "f");
		}
		__classPrivateFieldSet(this, _LineDecoder_searchIndex, __classPrivateFieldGet(this, _LineDecoder_end, "f"), "f");
		if (__classPrivateFieldGet(this, _LineDecoder_start, "f") === __classPrivateFieldGet(this, _LineDecoder_end, "f")) {
			__classPrivateFieldSet(this, _LineDecoder_start, 0, "f");
			__classPrivateFieldSet(this, _LineDecoder_end, 0, "f");
			__classPrivateFieldSet(this, _LineDecoder_searchIndex, 0, "f");
			if (__classPrivateFieldGet(this, _LineDecoder_buffer, "f").length > MAX_RETAINED_BUFFER_BYTES) __classPrivateFieldSet(this, _LineDecoder_buffer, /* @__PURE__ */ new Uint8Array(), "f");
		} else if (lines.length > 0 && __classPrivateFieldGet(this, _LineDecoder_buffer, "f").length > MAX_RETAINED_BUFFER_BYTES) {
			const length = __classPrivateFieldGet(this, _LineDecoder_end, "f") - __classPrivateFieldGet(this, _LineDecoder_start, "f");
			if (length <= MAX_RETAINED_BUFFER_BYTES || __classPrivateFieldGet(this, _LineDecoder_buffer, "f").length > length * 4) {
				const capacity = length <= MAX_RETAINED_BUFFER_BYTES ? Math.min(Math.max(length * 2, 256), MAX_RETAINED_BUFFER_BYTES) : length * 2;
				const buffer = new Uint8Array(capacity);
				buffer.set(__classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(__classPrivateFieldGet(this, _LineDecoder_start, "f"), __classPrivateFieldGet(this, _LineDecoder_end, "f")));
				__classPrivateFieldSet(this, _LineDecoder_buffer, buffer, "f");
				__classPrivateFieldSet(this, _LineDecoder_start, 0, "f");
				__classPrivateFieldSet(this, _LineDecoder_end, length, "f");
				__classPrivateFieldSet(this, _LineDecoder_searchIndex, length, "f");
			}
		}
		return lines;
	}
	/** Emits the remaining unterminated line, or returns an empty array when idle. */
	flush() {
		__classPrivateFieldSet(this, _LineDecoder_skipLeadingLF, false, "f");
		if (__classPrivateFieldGet(this, _LineDecoder_start, "f") === __classPrivateFieldGet(this, _LineDecoder_end, "f")) return [];
		return this.decode("\n");
	}
};
_LineDecoder_buffer = /* @__PURE__ */ new WeakMap(), _LineDecoder_start = /* @__PURE__ */ new WeakMap(), _LineDecoder_end = /* @__PURE__ */ new WeakMap(), _LineDecoder_searchIndex = /* @__PURE__ */ new WeakMap(), _LineDecoder_skipLeadingLF = /* @__PURE__ */ new WeakMap(), _LineDecoder_instances = /* @__PURE__ */ new WeakSet(), _LineDecoder_append = function _LineDecoder_append(chunk) {
	if (__classPrivateFieldGet(this, _LineDecoder_end, "f") + chunk.length > __classPrivateFieldGet(this, _LineDecoder_buffer, "f").length) {
		const length = __classPrivateFieldGet(this, _LineDecoder_end, "f") - __classPrivateFieldGet(this, _LineDecoder_start, "f");
		if (__classPrivateFieldGet(this, _LineDecoder_start, "f") >= __classPrivateFieldGet(this, _LineDecoder_buffer, "f").length / 2 && length + chunk.length <= __classPrivateFieldGet(this, _LineDecoder_buffer, "f").length) __classPrivateFieldGet(this, _LineDecoder_buffer, "f").copyWithin(0, __classPrivateFieldGet(this, _LineDecoder_start, "f"), __classPrivateFieldGet(this, _LineDecoder_end, "f"));
		else {
			const capacity = Math.max(__classPrivateFieldGet(this, _LineDecoder_buffer, "f").length * 2, length + chunk.length, 256);
			const buffer = new Uint8Array(capacity);
			buffer.set(__classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(__classPrivateFieldGet(this, _LineDecoder_start, "f"), __classPrivateFieldGet(this, _LineDecoder_end, "f")));
			__classPrivateFieldSet(this, _LineDecoder_buffer, buffer, "f");
		}
		__classPrivateFieldSet(this, _LineDecoder_searchIndex, __classPrivateFieldGet(this, _LineDecoder_searchIndex, "f") - __classPrivateFieldGet(this, _LineDecoder_start, "f"), "f");
		__classPrivateFieldSet(this, _LineDecoder_end, length, "f");
		__classPrivateFieldSet(this, _LineDecoder_start, 0, "f");
	}
	__classPrivateFieldGet(this, _LineDecoder_buffer, "f").set(chunk, __classPrivateFieldGet(this, _LineDecoder_end, "f"));
	__classPrivateFieldSet(this, _LineDecoder_end, __classPrivateFieldGet(this, _LineDecoder_end, "f") + chunk.length, "f");
};
/** Individual characters recognized as possible line terminators. */
LineDecoder.NEWLINE_CHARS = /* @__PURE__ */ new Set(["\n", "\r"]);
/** Matches complete CRLF terminators as well as standalone CR and LF characters. */
LineDecoder.NEWLINE_REGEXP = /\r\n|[\n\r]/g;
/**
* Searches the active buffer range for the next CR or LF byte and returns its
* zero-based position, the position immediately after it, and whether the byte
* was a carriage return. Returns `null` when the range contains no newline byte.
*
* ```ts
* findNewlineIndex(new TextEncoder().encode('abc\ndef'), 0, 7)
* // => { preceding: 3, index: 4, carriage: false }
* ```
*/
function findNewlineIndex(buffer, start, end) {
	const newline = 10;
	const carriage = 13;
	for (let i = start; i < end; i++) {
		if (buffer[i] === newline) return {
			preceding: i,
			index: i + 1,
			carriage: false
		};
		if (buffer[i] === carriage) return {
			preceding: i,
			index: i + 1,
			carriage: true
		};
	}
	return null;
}
/**
* Finds the first blank-line separator used to delimit streamed event records.
*
* @returns The byte offset immediately after the first pair of consecutive
* line endings, or `-1` when the buffer contains no complete separator.
*/
function findDoubleNewlineIndex(buffer) {
	for (let i = 0; i < buffer.length - 1; i++) {
		const firstEndingLength = lineEndingLength(buffer, i);
		if (firstEndingLength > 0) {
			const secondEndingIndex = i + firstEndingLength;
			const secondEndingLength = lineEndingLength(buffer, secondEndingIndex);
			if (secondEndingLength > 0) return secondEndingIndex + secondEndingLength;
		}
	}
	return -1;
}
function lineEndingLength(buffer, index) {
	const newline = 10;
	const carriage = 13;
	if (buffer[index] === newline) return 1;
	if (buffer[index] === carriage) return buffer[index + 1] === newline ? 2 : 1;
	return 0;
}
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/internal/utils/log.mjs
const levelNumbers = {
	off: 0,
	error: 200,
	warn: 300,
	info: 400,
	debug: 500
};
const parseLogLevel = (maybeLevel, sourceName, client) => {
	if (!maybeLevel) return;
	if (hasOwn(levelNumbers, maybeLevel)) return maybeLevel;
	loggerFor(client).warn(`${sourceName} was set to ${JSON.stringify(maybeLevel)}, expected one of ${JSON.stringify(Object.keys(levelNumbers))}`);
};
function noop() {}
function makeLogFn(fnLevel, logger, logLevel) {
	if (!logger || levelNumbers[fnLevel] > levelNumbers[logLevel]) return noop;
	else return logger[fnLevel].bind(logger);
}
const noopLogger = {
	error: noop,
	warn: noop,
	info: noop,
	debug: noop
};
let cachedLoggers = /* @__PURE__ */ new WeakMap();
function loggerFor(client) {
	const logger = client.logger;
	const logLevel = client.logLevel ?? "off";
	if (!logger) return noopLogger;
	const cachedLogger = cachedLoggers.get(logger);
	if (cachedLogger && cachedLogger[0] === logLevel) return cachedLogger[1];
	const levelLogger = {
		error: makeLogFn("error", logger, logLevel),
		warn: makeLogFn("warn", logger, logLevel),
		info: makeLogFn("info", logger, logLevel),
		debug: makeLogFn("debug", logger, logLevel)
	};
	cachedLoggers.set(logger, [logLevel, levelLogger]);
	return levelLogger;
}
const sensitiveQueryNames = /* @__PURE__ */ new Set([
	"apikey",
	"accesstoken",
	"refreshtoken",
	"sessiontoken",
	"sessionid",
	"idtoken",
	"authtoken",
	"authorization",
	"token",
	"password",
	"clientsecret",
	"signingsecret",
	"xamzsecuritytoken",
	"xamzsignature",
	"xamzcredential"
]);
/** Recognizes credential-bearing query names across ordinary and provider authentication. */
function isSensitiveQueryParameter(name) {
	const normalized = name.toLowerCase().replace(/[-_]/gu, "");
	return sensitiveQueryNames.has(normalized) || sensitiveQueryNames.has(normalized.replace(/^x/u, ""));
}
const sensitiveHeaderNames = /* @__PURE__ */ new Set([
	"authorization",
	"proxy-authorization",
	"api-key",
	"x-api-key",
	"x-amz-security-token",
	"cookie",
	"set-cookie",
	"x-session-token",
	"x-session-id",
	"x-auth-token",
	"x-id-token"
]);
/** Recognizes credential-bearing request headers across provider and workload authentication. */
function isSensitiveHeader(name) {
	return sensitiveHeaderNames.has(name.toLowerCase().replace(/_/gu, "-")) || isSensitiveQueryParameter(name);
}
/** Removes credential-valued query parameters before a request URL reaches any logger. */
function redactURL(value) {
	const url = new URL(value);
	url.username = "";
	url.password = "";
	url.hash = "";
	for (const name of url.searchParams.keys()) if (isSensitiveQueryParameter(name)) url.searchParams.set(name, "***");
	return url.href;
}
const formatRequestDetails = (details) => {
	if (details.options) {
		details.options = { ...details.options };
		delete details.options["headers"];
		if (details.options.path) {
			const path = details.options.path;
			const redacted = new URL(redactURL(new URL(path, "https://redacted.invalid").href));
			details.options.path = redacted.origin === "https://redacted.invalid" ? `${path.startsWith("/") ? "/" : ""}${redacted.pathname.slice(1)}${redacted.search}` : redacted.href;
		}
		if (details.options.query) details.options.query = Object.fromEntries(Object.entries(details.options.query).map(([name, value]) => [name, isSensitiveQueryParameter(name) ? "***" : value]));
	}
	if (details.url) details.url = redactURL(details.url);
	if (details.headers) details.headers = Object.fromEntries((details.headers instanceof Headers ? [...details.headers] : Object.entries(details.headers)).map(([name, value]) => [name, isSensitiveHeader(name) ? "***" : value]));
	if ("retryOfRequestLogID" in details) {
		if (details.retryOfRequestLogID) details.retryOf = details.retryOfRequestLogID;
		delete details.retryOfRequestLogID;
	}
	return details;
};
//#endregion
//#region node_modules/.pnpm/openai@7.28.0_@aws-sdk+cred_228c78b5ff380a7908ad856e85d64d8d/node_modules/openai/core/streaming.mjs
var _Stream_instances;
var _Stream_client;
var _Stream_isTeeBranch;
var _Stream_cancelIterator;
function isTransportAbortError(error) {
	return !(error instanceof APIError) && isAbortError(error);
}
function createStreamTeeQueue() {
	let entries = [];
	let head = 0;
	let canceled = false;
	return {
		get length() {
			return entries.length - head;
		},
		get canceled() {
			return canceled;
		},
		enqueue(value) {
			if (!canceled) entries.push(value);
		},
		dequeue() {
			if (head === entries.length) return;
			const value = entries[head];
			entries[head] = void 0;
			head += 1;
			if (head === entries.length) {
				entries = [];
				head = 0;
			} else if (head >= 1024 && head * 2 >= entries.length) {
				entries = entries.slice(head);
				head = 0;
			}
			return value;
		},
		cancel() {
			canceled = true;
			entries.length = 0;
			head = 0;
		}
	};
}
/**
* A single-consumption asynchronous API response stream.
*
* Use {@link Stream.tee} when two consumers need the same events. Breaking out of
* a response-backed stream early aborts its request; branches created by `tee()`
* instead share {@link Stream.controller} for explicit cancellation.
*/
var Stream = class Stream {
	/** Wraps an asynchronous event iterator and the controller that owns its request. */
	constructor(iterator, controller, client) {
		_Stream_instances.add(this);
		_Stream_client.set(this, void 0);
		_Stream_isTeeBranch.set(this, false);
		this.iterator = iterator;
		this.controller = controller;
		__classPrivateFieldSet(this, _Stream_client, client, "f");
	}
	/**
	* Decodes an SSE response into parsed JSON events.
	*
	* The resulting stream can be consumed only once, ignores events after `[DONE]`, and
	* surfaces API error payloads as `APIError` instances. When
	* `synthesizeEventData` is enabled, each item also includes its SSE event name.
	*/
	static fromSSEResponse(response, controller, client, synthesizeEventData) {
		let consumed = false;
		const logger = client ? loggerFor(client) : console;
		async function* iterator() {
			if (consumed) throw new OpenAIError("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
			consumed = true;
			let done = false;
			let receivedCompletionSentinel = false;
			const messages = _iterSSEMessages(response, controller);
			const closeMessages = messages.return.bind(messages);
			messages.return = (value) => {
				if (!receivedCompletionSentinel) controller.abort();
				return closeMessages(value);
			};
			try {
				for await (const sse of messages) {
					if (sse.data === "[DONE]") {
						receivedCompletionSentinel = true;
						break;
					}
					if (sse.event === null || !sse.event.startsWith("thread.")) {
						let data;
						try {
							data = JSON.parse(sse.data);
						} catch {
							logger.error(`Could not parse message into JSON:`);
							logger.error(`From chunk:`);
							throw new SyntaxError("Error reading response: malformed server-sent event JSON.");
						}
						if (sse.event === "error") throw new APIError(void 0, data?.error ?? data, void 0, response.headers);
						if (data && data.error) throw new APIError(void 0, data.error, void 0, response.headers);
						yield synthesizeEventData ? {
							event: sse.event,
							data
						} : data;
					} else {
						let data;
						try {
							data = JSON.parse(sse.data);
						} catch {
							logger.error(`Could not parse message into JSON:`);
							logger.error(`From chunk:`);
							throw new SyntaxError("Error reading response: malformed server-sent event JSON.");
						}
						yield {
							event: sse.event,
							data
						};
					}
				}
				done = true;
			} catch (e) {
				if (receivedCompletionSentinel || isTransportAbortError(e) || controller.signal.aborted && e === controller.signal.reason) return;
				throw e;
			} finally {
				if (!done) controller.abort();
			}
		}
		return new Stream(iterator, controller, client);
	}
	/**
	* Generates a Stream from a newline-separated ReadableStream
	* where each item is a JSON value.
	*/
	static fromReadableStream(readableStream, controller, client) {
		let consumed = false;
		async function* iterLines() {
			const lineDecoder = new LineDecoder();
			const reader = readableStream.getReader();
			let closed = false;
			let cancelPromise;
			const cancel = () => {
				cancelPromise ?? (cancelPromise = reader.cancel());
				cancelPromise.catch(() => void 0);
			};
			controller.signal.addEventListener("abort", cancel, { once: true });
			try {
				if (controller.signal.aborted) {
					cancel();
					return;
				}
				while (true) {
					const { value: chunk, done } = await reader.read();
					if (done) {
						closed = true;
						break;
					}
					if (controller.signal.aborted) return;
					for (const line of lineDecoder.decode(chunk)) {
						if (controller.signal.aborted) return;
						yield line;
					}
				}
				if (controller.signal.aborted) return;
				for (const line of lineDecoder.flush()) {
					if (controller.signal.aborted) return;
					yield line;
				}
			} finally {
				controller.signal.removeEventListener("abort", cancel);
				if (!closed) cancel();
				reader.releaseLock();
			}
		}
		async function* iterator() {
			if (consumed) throw new OpenAIError("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
			consumed = true;
			let done = false;
			try {
				for await (const line of iterLines()) if (line) {
					let data;
					try {
						data = JSON.parse(line);
					} catch (error) {
						if (error instanceof SyntaxError) throw new SyntaxError("Error reading response: malformed newline-delimited JSON.");
						throw error;
					}
					yield data;
				}
				done = true;
			} catch (e) {
				if (controller.signal.aborted || isAbortError(e)) return;
				throw e;
			} finally {
				if (!done) controller.abort();
			}
		}
		return new Stream(iterator, controller, client);
	}
	/** Starts consuming this stream; attempting to consume it again throws. */
	[(_Stream_client = /* @__PURE__ */ new WeakMap(), _Stream_isTeeBranch = /* @__PURE__ */ new WeakMap(), _Stream_instances = /* @__PURE__ */ new WeakSet(), Symbol.asyncIterator)]() {
		return this.iterator();
	}
	/** Beta-only iterator decoration for Agents helpers, preserving custom stream identity.
	* @internal
	*/
	__betaTransformIterator(transform) {
		this.iterator = transform(this.iterator.bind(this));
	}
	/**
	* Splits the stream into two streams which can be
	* independently read from at different speeds.
	* Closing a branch discards its buffered events without stopping its sibling.
	* Future reads on that branch finish immediately; previously issued `next()`
	* promises remain shared with its sibling and may still resolve with events.
	* Closing both branches invokes the source iterator's `return()` when available.
	* For {@link Stream.fromReadableStream}, closing both branches before iteration
	* starts does not cancel the supplied readable; cancel that readable directly.
	*/
	tee() {
		const { controller } = this;
		const left = createStreamTeeQueue();
		const right = createStreamTeeQueue();
		const iterator = this.iterator();
		const teeIterator = (queue) => ({
			next: () => {
				if (queue.canceled) return Promise.resolve({
					value: void 0,
					done: true
				});
				if (queue.length === 0) {
					const result = iterator.next();
					left.enqueue(result);
					right.enqueue(result);
				}
				return queue.dequeue();
			},
			return: async () => {
				if (!queue.canceled) {
					queue.cancel();
					if (left.canceled && right.canceled) await __classPrivateFieldGet(this, _Stream_instances, "m", _Stream_cancelIterator).call(this, iterator, controller);
				}
				return {
					value: void 0,
					done: true
				};
			}
		});
		const branch = (queue) => {
			const stream = new Stream(() => teeIterator(queue), controller, __classPrivateFieldGet(this, _Stream_client, "f"));
			__classPrivateFieldSet(stream, _Stream_isTeeBranch, true, "f");
			return stream;
		};
		return [branch(left), branch(right)];
	}
	/**
	* Converts this stream to a newline-separated ReadableStream of
	* JSON stringified values in the stream
	* which can be turned back into a Stream with `Stream.fromReadableStream()`.
	* Canceling a response-backed readable aborts its request. Canceling a tee
	* branch discards its buffered events and leaves sibling consumers running.
	* Read or serialization failures also release the iterator without replacing the original error.
	*/
	toReadableStream() {
		const { controller } = this;
		let iter;
		let cancellation;
		const cancel = () => cancellation ?? (cancellation = __classPrivateFieldGet(this, _Stream_instances, "m", _Stream_cancelIterator).call(this, iter, controller));
		return makeReadableStream({
			start: async () => {
				iter = this[Symbol.asyncIterator]();
			},
			async pull(ctrl) {
				try {
					const { value, done } = await iter.next();
					if (done) return ctrl.close();
					const bytes = encodeUTF8(JSON.stringify(value) + "\n");
					ctrl.enqueue(bytes);
				} catch (err) {
					ctrl.error(err);
					cancel().catch(() => void 0);
				}
			},
			cancel
		});
	}
};
_Stream_cancelIterator = async function _Stream_cancelIterator(iterator, controller) {
	const returnMethod = iterator.return;
	if (returnMethod) {
		if (!__classPrivateFieldGet(this, _Stream_isTeeBranch, "f")) controller.abort();
		await Reflect.apply(returnMethod, iterator, []);
	}
};
function createAbortableSSESource(body, signal) {
	const reader = typeof body.getReader === "function" ? body.getReader() : void 0;
	const source = reader ? {
		next: () => reader.read(),
		return: () => reader.cancel()
	} : ReadableStreamToAsyncIterable(body)[Symbol.asyncIterator]();
	const ended = {
		value: void 0,
		done: true
	};
	let closed = false;
	let canceled = false;
	let cancellation;
	let interrupt;
	const waitForAbort = () => new Promise((resolve) => {
		interrupt = resolve;
	});
	const cancel = () => {
		if (canceled || closed) return cancellation;
		canceled = true;
		try {
			cancellation = Promise.resolve(source.return?.());
		} catch (error) {
			cancellation = Promise.reject(error);
		}
		cancellation.catch(() => void 0);
		return cancellation;
	};
	const abort = () => {
		queueMicrotask(() => {
			interrupt?.();
			cancel();
		});
	};
	return {
		iterator: {
			async next() {
				if (signal.aborted) return ended;
				const aborted = waitForAbort().then(() => ended);
				try {
					const result = await Promise.race([source.next(), aborted]);
					if (signal.aborted) return ended;
					if (result.done) {
						closed = true;
						return ended;
					}
					return {
						value: result.value,
						done: false
					};
				} catch (error) {
					if (signal.aborted && (isAbortError(error) || error === signal.reason)) return ended;
					throw error;
				} finally {
					interrupt = void 0;
				}
			},
			async return() {
				const pending = cancel();
				if (pending && !signal.aborted) {
					const aborted = waitForAbort();
					try {
						if (!signal.aborted) await Promise.race([pending, aborted]);
					} finally {
						interrupt = void 0;
					}
				}
				return ended;
			},
			[Symbol.asyncIterator]() {
				return this;
			}
		},
		start() {
			signal.addEventListener("abort", abort, { once: true });
			if (signal.aborted) abort();
		},
		async cleanup(failed) {
			let cleanupError;
			try {
				signal.removeEventListener("abort", abort);
			} catch (error) {
				cleanupError = error;
			}
			if (!closed) {
				const pending = cancel();
				if (pending && !failed && !signal.aborted) try {
					await pending;
				} catch (error) {
					cleanupError ?? (cleanupError = error);
				}
			}
			if (reader) try {
				reader.releaseLock();
			} catch (error) {
				cleanupError ?? (cleanupError = error);
			}
			if (cleanupError !== void 0 && !failed && !signal.aborted) throw cleanupError;
		}
	};
}
/**
* Decodes complete SSE records from a response and aborts when its body is absent.
* Complete events are decoded on demand without imposing a line or event size limit.
*
* @yields {ServerSentEvent} Each decoded server-sent event in wire order.
*/
async function* _iterSSEMessages(response, controller) {
	if (!response.body) {
		controller.abort();
		if (globalThis.navigator !== void 0 && globalThis.navigator.product === "ReactNative") throw new OpenAIError(`The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api`);
		throw new OpenAIError(`Attempted to iterate over a response with no body`);
	}
	const sseDecoder = new SSEDecoder();
	const lineDecoder = new LineDecoder();
	const { signal } = controller;
	const source = createAbortableSSESource(response.body, signal);
	let failed = false;
	try {
		source.start();
		for await (const sseChunk of iterSSEChunks(source.iterator)) {
			if (signal.aborted) return;
			for (const line of lineDecoder.decode(sseChunk)) {
				if (signal.aborted) return;
				const sse = sseDecoder.decode(line);
				if (sse) yield sse;
			}
		}
		if (signal.aborted) return;
		for (const line of lineDecoder.flush()) {
			if (signal.aborted) return;
			const sse = sseDecoder.decode(line);
			if (sse) yield sse;
		}
		if (signal.aborted) return;
		const pending = sseDecoder.flush();
		if (pending) yield pending;
	} catch (error) {
		failed = true;
		if (!signal.aborted || !isAbortError(error) && error !== signal.reason) throw error;
	} finally {
		await source.cleanup(failed);
	}
}
const DOUBLE_NEWLINE_DELIMITER_MAX_OVERLAP_BYTES = 3;
/**
* Given an async iterable iterator, iterates over it and yields full
* SSE chunks, i.e. yields when a double new-line is encountered.
*
* @yields {Uint8Array} A complete SSE chunk.
*/
async function* iterSSEChunks(iterator) {
	let data = /* @__PURE__ */ new Uint8Array();
	let dataStart = 0;
	let dataEnd = 0;
	let searchStartIndex = 0;
	for await (const chunk of iterator) {
		if (chunk == null) continue;
		let binaryChunk;
		if (chunk instanceof ArrayBuffer) binaryChunk = new Uint8Array(chunk);
		else if (typeof chunk === "string") binaryChunk = encodeUTF8(chunk);
		else binaryChunk = chunk;
		if (dataEnd + binaryChunk.length > data.length) {
			const bufferedLength = dataEnd - dataStart;
			if (dataStart >= data.length / 2 && bufferedLength + binaryChunk.length <= data.length) data.copyWithin(0, dataStart, dataEnd);
			else {
				const newData = new Uint8Array(Math.max(data.length * 2, bufferedLength + binaryChunk.length));
				newData.set(data.subarray(dataStart, dataEnd));
				data = newData;
			}
			searchStartIndex -= dataStart;
			dataStart = 0;
			dataEnd = bufferedLength;
		}
		data.set(binaryChunk, dataEnd);
		dataEnd += binaryChunk.length;
		let patternIndex;
		while ((patternIndex = findDoubleNewlineIndex(data.subarray(searchStartIndex, dataEnd))) !== -1) {
			patternIndex += searchStartIndex;
			yield data.slice(dataStart, patternIndex);
			dataStart = patternIndex;
			searchStartIndex = dataStart;
		}
		searchStartIndex = Math.max(dataStart, dataEnd - DOUBLE_NEWLINE_DELIMITER_MAX_OVERLAP_BYTES);
	}
	if (dataEnd > dataStart) yield data.slice(dataStart, dataEnd);
}
var SSEDecoder = class {
	constructor() {
		this.event = null;
		this.data = [];
		this.chunks = [];
	}
	decode(line) {
		if (line.endsWith("\r")) line = line.slice(0, -1);
		if (!line) {
			if (!this.event && !this.data.length) return null;
			const sse = {
				event: this.event,
				data: this.data.join("\n"),
				raw: this.chunks
			};
			this.event = null;
			this.data = [];
			this.chunks = [];
			return sse;
		}
		this.chunks.push(line);
		if (line.startsWith(":")) return null;
		const [fieldname, , initialValue] = partition(line, ":");
		let value = initialValue;
		if (value.startsWith(" ")) value = value.slice(1);
		if (fieldname === "event") this.event = value;
		else if (fieldname === "data") this.data.push(value);
		return null;
	}
	/**
	* Emits a pending event at EOF when the stream omitted the trailing blank
	* line. Returns `null` when no event is in progress so a record that already
	* ended with a blank line is not delivered twice.
	*/
	flush() {
		return this.decode("");
	}
};
function partition(str, delimiter) {
	const index = str.indexOf(delimiter);
	if (index !== -1) return [
		str.slice(0, index),
		delimiter,
		str.slice(index + delimiter.length)
	];
	return [
		str,
		"",
		""
	];
}
//#endregion
//#region packages/ai/src/transports/openai-transport-shared.ts
const OPENAI_RESPONSE_MODEL_HEADER_NAMES = /* @__PURE__ */ new Set(["openai-model", "x-openai-model"]);
const OPENAI_RESPONSE_MODEL_EVENT_TYPES = /* @__PURE__ */ new Set([
	"response.created",
	"response.in_progress",
	"response.completed",
	"response.done",
	"response.incomplete",
	"response.failed"
]);
const OPENAI_DATED_MODEL_SUFFIX = /-(?:\d{8}|\d{4}-\d{2}-\d{2})$/;
const GEMINI_THOUGHT_SIGNATURE_VALIDATOR_SKIP = "skip_thought_signature_validator";
const log = {
	debug(message, data) {
		getAiTransportHost().logDebug("openai-transport", () => ({
			message,
			data
		}));
	},
	info(message, data) {
		getAiTransportHost().logInfo("openai-transport", message, data);
	},
	warn(message, data) {
		getAiTransportHost().logWarn("openai-transport", message, data);
	}
};
function splitOpenAIResponseModelHeader(value) {
	return value ? value.split(",").map((part) => part.trim()).filter(Boolean) : [];
}
function readOpenAIResponseModelHeaders(headers) {
	return [...OPENAI_RESPONSE_MODEL_HEADER_NAMES].flatMap((name) => splitOpenAIResponseModelHeader(headers.get(name)));
}
function readOpenAIResponseModelHeaderRecord(headers) {
	if (!isRecord(headers)) return [];
	return Object.entries(headers).filter(([name]) => OPENAI_RESPONSE_MODEL_HEADER_NAMES.has(name.toLowerCase())).flatMap(([, value]) => typeof value === "string" ? splitOpenAIResponseModelHeader(value) : []);
}
function readOpenAIResponseModelEvent(event) {
	if (!isRecord(event)) return [];
	const response = isRecord(event.response) ? event.response : void 0;
	return [
		...OPENAI_RESPONSE_MODEL_EVENT_TYPES.has(String(event.type)) && typeof response?.model === "string" && response.model.trim() ? [response.model.trim()] : [],
		...readOpenAIResponseModelHeaderRecord(response?.headers),
		...readOpenAIResponseModelHeaderRecord(event.headers)
	];
}
function reconcileOpenAIResponseModels(current, observed) {
	if (!current || current === observed) return observed;
	const currentBase = current.replace(OPENAI_DATED_MODEL_SUFFIX, "");
	const observedBase = observed.replace(OPENAI_DATED_MODEL_SUFFIX, "");
	if (currentBase !== observedBase) return;
	if (currentBase === current && observedBase !== observed) return observed;
	if (observedBase === observed && currentBase !== current) return current;
}
function createResponseModelTracker(enabled = true) {
	let responseModel;
	const observe = (models) => {
		for (const model of models) {
			const reconciled = reconcileOpenAIResponseModels(responseModel, model);
			if (!reconciled) throw new Error("Conflicting OpenAI response model attestations");
			responseModel = reconciled;
		}
	};
	const begin = (headers) => {
		responseModel = void 0;
		if (enabled && headers) observe(readOpenAIResponseModelHeaders(headers));
	};
	const observeEvent = (event) => {
		if (enabled) observe(readOpenAIResponseModelEvent(event));
		return responseModel;
	};
	const resolve = () => responseModel;
	return {
		begin,
		observeEvent,
		resolve,
		track(response, stream) {
			if (!enabled) return stream;
			return (async function* () {
				begin(response?.headers);
				for await (const event of stream) {
					observeEvent(event);
					yield event;
				}
			})();
		},
		terminalOptions: enabled ? { resolveResponseModel: resolve } : {}
	};
}
function resolveOpenAIClientBaseUrl(model, baseUrl = model.baseUrl) {
	if (baseUrl?.trim()) return baseUrl;
	if (model.provider.trim().toLowerCase() === "openai") return;
	throw new Error(`Provider "${model.provider}" requires an explicit base URL before using an OpenAI-compatible API. Reload provider metadata or configure an endpoint.`);
}
const EMPTY_OPENAI_COMPLETIONS_REASONING_BATCH = {
	deltas: [],
	mirroredThinking: [],
	hasThinking: false,
	hasVisibleText: false
};
const OPENAI_COMPLETIONS_REASONING_FIELDS = [
	"reasoning_content",
	"reasoning",
	"reasoning_text"
];
function appendOpenAICompletionsReasoningDelta(deltas, mirroredThinking, next) {
	const previous = deltas[deltas.length - 1];
	if (!previous || previous.kind !== next.kind || next.kind === "thinking" && previous.kind === "thinking" && previous.signature !== next.signature) {
		deltas.push(next);
		if (next.kind === "thinking") mirroredThinking.push(next.text);
		return;
	}
	previous.text += next.text;
	if (next.kind === "thinking") mirroredThinking[mirroredThinking.length - 1] += next.text;
}
function readOpenAICompletionsReasoningBatch(delta, visibleReasoningDetailTypes) {
	let deltas;
	const mirroredThinking = [];
	const reasoningDetails = delta.reasoning_details;
	if (Array.isArray(reasoningDetails)) for (const detail of reasoningDetails) {
		if (!isRecord(detail)) continue;
		if (typeof detail.text !== "string" || !detail.text) continue;
		if (detail.type === "reasoning.text") {
			deltas ??= [];
			appendOpenAICompletionsReasoningDelta(deltas, mirroredThinking, {
				kind: "thinking",
				signature: "reasoning_details",
				text: detail.text
			});
			continue;
		}
		if (typeof detail.type === "string" && visibleReasoningDetailTypes.has(detail.type)) {
			deltas ??= [];
			appendOpenAICompletionsReasoningDelta(deltas, mirroredThinking, {
				kind: "text",
				text: detail.text,
				source: "reasoning_detail"
			});
		}
	}
	if (mirroredThinking.length === 0) for (const field of OPENAI_COMPLETIONS_REASONING_FIELDS) {
		const value = delta[field];
		if (typeof value === "string" && value.length > 0) {
			deltas ??= [];
			appendOpenAICompletionsReasoningDelta(deltas, mirroredThinking, {
				kind: "thinking",
				signature: field,
				text: value
			});
			break;
		}
	}
	if (!deltas) return EMPTY_OPENAI_COMPLETIONS_REASONING_BATCH;
	return {
		deltas,
		mirroredThinking,
		hasThinking: mirroredThinking.length > 0,
		hasVisibleText: mirroredThinking.length < deltas.length
	};
}
function detachPartialSnapshot(event) {
	const source = event;
	if (!source.partial) return event;
	const partial = source.partial;
	return {
		...event,
		partial: {
			...partial,
			content: partial.content.map((block) => block.type === "text" ? Object.assign({}, block) : block)
		}
	};
}
function parseOpenAICompletionsUsage(rawUsage, model, options) {
	const reportedCacheRead = rawUsage.prompt_tokens_details?.cached_tokens ?? rawUsage.prompt_cache_hit_tokens ?? rawUsage.cached_tokens;
	const reportedCacheWrite = rawUsage.prompt_tokens_details?.cache_write_tokens ?? rawUsage.prompt_tokens_details?.cache_creation_input_tokens ?? rawUsage.cache_creation_input_tokens;
	const cacheRead = reportedCacheRead ?? 0;
	const cacheWrite = reportedCacheWrite ?? 0;
	const input = Math.max(0, (rawUsage.prompt_tokens || 0) - cacheRead - cacheWrite);
	const output = rawUsage.completion_tokens || 0;
	const reasoningTokens = asFiniteNumber(rawUsage.completion_tokens_details?.reasoning_tokens);
	const hasCoherentContext = [
		rawUsage.prompt_tokens,
		rawUsage.completion_tokens,
		rawUsage.total_tokens,
		cacheRead,
		cacheWrite
	].every((value) => typeof value === "number" && Number.isFinite(value) && value >= 0) && rawUsage.prompt_tokens >= cacheRead + cacheWrite && rawUsage.total_tokens >= rawUsage.prompt_tokens + rawUsage.completion_tokens;
	const usage = {
		input,
		output,
		cacheRead,
		cacheWrite,
		cacheTelemetry: { state: reportedCacheRead !== void 0 || reportedCacheWrite !== void 0 ? "available" : "unavailable" },
		...options?.includeReasoningTokens !== false && reasoningTokens !== void 0 ? { reasoningTokens } : {},
		contextUsage: hasCoherentContext ? {
			state: "available",
			promptTokens: rawUsage.prompt_tokens,
			totalTokens: Math.max(input + output + cacheRead + cacheWrite, rawUsage.total_tokens)
		} : { state: "unavailable" },
		totalTokens: input + output + cacheRead + cacheWrite,
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			total: 0
		}
	};
	calculateCost(model, usage);
	applyProviderReportedUsageCost(usage, rawUsage.cost);
	return usage;
}
function createOpenAIResponseHook(onResponse, response, model) {
	return onResponse ? () => onResponse({
		status: response.status,
		headers: headersToRecord(response.headers)
	}, model) : void 0;
}
function createOpenAIProviderAcceptanceHook(options, response, model) {
	return () => notifyProviderHttpResponse({
		options,
		response,
		model
	});
}
function withOpenAIErrorResponseHook(fetch, onResponse, model) {
	return async (input, init) => {
		const response = await fetch(input, init);
		if (!response.ok) await notifyProviderHttpResponse({
			options: { onResponse },
			response,
			model,
			signal: init?.signal ?? (input instanceof Request ? input.signal : void 0)
		});
		return response;
	};
}
/** Measure one UTF-8 append without double-counting a surrogate pair split across chunks. */
function measureUtf8AppendBytes(bufferEndsWithHighSurrogate, chunk) {
	let bytes = Buffer.byteLength(chunk, "utf8");
	if (!chunk) return {
		bytes,
		endsWithHighSurrogate: bufferEndsWithHighSurrogate
	};
	const nextCodeUnit = chunk.charCodeAt(0);
	if (bufferEndsWithHighSurrogate && nextCodeUnit >= 56320 && nextCodeUnit <= 57343) bytes -= 2;
	const finalCodeUnit = chunk.charCodeAt(chunk.length - 1);
	return {
		bytes,
		endsWithHighSurrogate: finalCodeUnit >= 55296 && finalCodeUnit <= 56319
	};
}
function resolvePromptCacheKey(options, cacheRetention) {
	if (cacheRetention === "none") return;
	return clampOpenAIPromptCacheKey(options?.promptCacheKey ?? options?.sessionId);
}
function isOpenAICompletionsThinkingEnabled(effort) {
	const normalized = effort.trim().toLowerCase();
	return normalized !== "off" && normalized !== "none";
}
function readOpenAICompletionsContentDeltas(content, topLevelRefusal, mirroredThinking = []) {
	let deltas = readOpenAICompletionsContentPartDeltas(content);
	if (mirroredThinking.length > 0) {
		const structuredThinking = deltas.filter((delta) => delta.kind === "thinking").map((delta) => delta.text);
		const mirrorsCombinedThinking = structuredThinking.length > 1 && mirroredThinking.includes(structuredThinking.join(""));
		deltas = deltas.filter((delta) => delta.kind !== "thinking" || !mirrorsCombinedThinking && !mirroredThinking.includes(delta.text));
	}
	if (typeof topLevelRefusal !== "string" || !topLevelRefusal) return deltas;
	const structuredRefusals = deltas.filter((delta) => delta.kind === "text" && delta.source === "refusal").map((delta) => delta.text);
	if (structuredRefusals.some((refusal) => refusal === topLevelRefusal) || structuredRefusals.length > 1 && structuredRefusals.join("") === topLevelRefusal) return deltas;
	return [...deltas, {
		kind: "text",
		text: topLevelRefusal,
		source: "refusal"
	}];
}
function readOpenAICompletionsContentPartDeltas(content) {
	if (typeof content === "string") return content ? [{
		kind: "text",
		text: content
	}] : [];
	if (Array.isArray(content)) return content.flatMap(readOpenAICompletionsContentPartDeltas);
	if (!content || typeof content !== "object") return [];
	const record = content;
	const type = typeof record.type === "string" ? record.type.toLowerCase() : "";
	const extractText = (value) => {
		if (typeof value === "string") return value;
		if (Array.isArray(value)) return value.map(extractText).join("");
		if (value && typeof value === "object") {
			const nested = value;
			return extractText(nested.text ?? nested.content ?? nested.thinking ?? nested.refusal);
		}
		return "";
	};
	const text = extractText(record.text ?? record.content ?? record.thinking ?? record.refusal);
	if (!text) return [];
	if (type.includes("thinking") || type.includes("reasoning")) return [{
		kind: "thinking",
		text
	}];
	if (type === "refusal") return [{
		kind: "text",
		text,
		source: "refusal"
	}];
	if (["text", "output_text"].includes(type) || type.endsWith(".output_text")) return [{
		kind: "text",
		text
	}];
	return [];
}
//#endregion
//#region packages/ai/src/providers/openai-tool-projection.ts
function unreadableToolDiagnostic(toolIndex) {
	return {
		toolIndex,
		violations: [`tool[${toolIndex}] is unreadable`]
	};
}
/** Snapshots direct/custom tool descriptors before OpenAI payload construction. */
function projectOpenAITools(tools) {
	return projectOpenAIToolDescriptors(tools);
}
/** Package-private facts are consumed before the projection or payload can escape. */
function prepareOpenAITools(tools) {
	const schemas = /* @__PURE__ */ new Map();
	return {
		projection: projectOpenAIToolDescriptors(tools, schemas),
		schemas
	};
}
function projectOpenAIToolDescriptors(tools, schemas) {
	let inputToolCount;
	try {
		inputToolCount = tools.length;
	} catch {
		return {
			inputToolCount: 0,
			tools: [],
			diagnostics: [unreadableToolDiagnostic(0)]
		};
	}
	const projectedTools = [];
	const diagnostics = [];
	for (let toolIndex = 0; toolIndex < inputToolCount; toolIndex += 1) {
		let tool;
		let name;
		let parameters;
		let readPath = `tool[${toolIndex}]`;
		try {
			const candidate = tools[toolIndex];
			if (!candidate) {
				diagnostics.push(unreadableToolDiagnostic(toolIndex));
				continue;
			}
			tool = candidate;
			readPath += ".name";
			const nameValue = tool.name;
			if (typeof nameValue !== "string" || !nameValue) {
				diagnostics.push({
					toolIndex,
					violations: [`${readPath} is empty`]
				});
				continue;
			}
			name = nameValue;
			readPath = `${name}.parameters`;
			parameters = tool.parameters;
		} catch {
			diagnostics.push({
				toolIndex,
				...name ? { toolName: name } : {},
				violations: [`${readPath} is unreadable`]
			});
			continue;
		}
		const prepared = schemas ? prepareRuntimeToolInputSchema(parameters ?? {}, `${name}.parameters`, name) : void 0;
		const schemaProjection = prepared?.projection ?? projectRuntimeToolInputSchema(parameters ?? {}, `${name}.parameters`, name);
		if (!isRecord(schemaProjection.schema) || schemaProjection.violations.length > 0) {
			diagnostics.push({
				toolIndex,
				toolName: name,
				violations: schemaProjection.violations.length > 0 ? schemaProjection.violations : [`${name}.parameters must be a JSON object schema`]
			});
			continue;
		}
		if (prepared?.normalization) schemas?.set(schemaProjection.schema, prepared.normalization);
		let descriptionValue;
		try {
			descriptionValue = tool.description;
		} catch {}
		const description = typeof descriptionValue === "string" ? descriptionValue : void 0;
		projectedTools.push({
			toolIndex,
			name,
			...description !== void 0 ? { description } : {},
			parameters: schemaProjection.schema
		});
	}
	return {
		inputToolCount,
		tools: projectedTools,
		diagnostics
	};
}
function reconcileToolChoice(choice, projection, responses) {
	const label = responses ? "OpenAI Responses" : "OpenAI Chat Completions";
	if (choice === "auto") return projection.tools.length > 0 ? choice : void 0;
	if (choice === "required") {
		if (projection.tools.length === 0) throw new Error(`${label} tool_choice requires a tool, but no tools survived schema conversion`);
		return choice;
	}
	if (choice === "none" || !isRecord(choice)) return choice;
	const choiceType = choice.type;
	if (!responses && choiceType === "custom") throw new Error("OpenAI Chat Completions custom tool_choice is unsupported because this adapter emits function tools only");
	if (choiceType === "function") {
		const functionChoice = responses ? choice : choice.function;
		const functionName = isRecord(functionChoice) ? functionChoice.name : void 0;
		if (typeof functionName !== "string") return choice;
		if (!projection.tools.some((tool) => tool.name === functionName)) throw new Error(`${label} tool_choice requested unavailable tool "${functionName}" after schema conversion`);
		return responses ? {
			type: "function",
			name: functionName
		} : {
			type: "function",
			function: { name: functionName }
		};
	}
	if (choiceType !== "allowed_tools") return choice;
	const allowedConfig = responses ? choice : choice.allowed_tools;
	if (!isRecord(allowedConfig)) return choice;
	const { mode, tools } = allowedConfig;
	if (mode !== "auto" && mode !== "required" || !Array.isArray(tools)) return choice;
	const responseTools = [];
	const completionTools = [];
	for (const tool of tools) {
		if (!isRecord(tool) || tool.type !== "function") {
			if (responses) responseTools.push(tool);
			continue;
		}
		const functionChoice = responses ? tool : tool.function;
		const functionName = isRecord(functionChoice) ? functionChoice.name : void 0;
		if (typeof functionName === "string" && projection.tools.some((projectedTool) => projectedTool.name === functionName)) {
			if (responses) responseTools.push({
				type: "function",
				name: functionName
			});
			else completionTools.push({
				type: "function",
				function: { name: functionName }
			});
		}
	}
	if (responseTools.length === 0 && completionTools.length === 0) {
		if (mode === "auto") return "none";
		throw new Error(`${label} tool_choice requires a tool, but no allowed tools survived schema conversion`);
	}
	return responses ? {
		type: "allowed_tools",
		mode,
		tools: responseTools
	} : {
		type: "allowed_tools",
		allowed_tools: {
			mode,
			tools: completionTools
		}
	};
}
/** Keeps Responses tool choices aligned with surviving function schemas. */
function reconcileOpenAIResponsesToolChoice(choice, projection) {
	return reconcileToolChoice(choice, projection, true);
}
/** Keeps Chat Completions tool choices aligned with surviving function schemas. */
function reconcileOpenAICompletionsToolChoice(choice, projection) {
	return reconcileToolChoice(choice, projection, false);
}
/** Re-expresses an object Chat Completions tool choice in the Responses wire shape. */
function toOpenAIResponsesToolChoice(choice) {
	if (choice.type === "function") return {
		type: "function",
		name: choice.function.name
	};
	return {
		type: "allowed_tools",
		mode: choice.allowed_tools.mode,
		tools: choice.allowed_tools.tools.map((tool) => tool.type === "function" && isRecord(tool.function) && typeof tool.function.name === "string" ? {
			type: "function",
			name: tool.function.name
		} : tool)
	};
}
//#endregion
//#region packages/ai/src/transports/openai-reasoning-compat.ts
/** Explicit model reasoning-effort compatibility metadata. */
function readCompatReasoningEffortMap(compat) {
	const rawMap = asOptionalObjectRecord(asOptionalObjectRecord(compat)?.reasoningEffortMap);
	if (!rawMap) return {};
	return Object.fromEntries(Object.entries(rawMap).filter((entry) => typeof entry[1] === "string"));
}
/** Resolves the reasoning effort remap for an OpenAI-compatible model. */
function resolveOpenAIReasoningEffortMap(model, fallbackMap = {}) {
	return {
		...fallbackMap,
		...readCompatReasoningEffortMap(model.compat)
	};
}
//#endregion
//#region packages/ai/src/providers/openai-request-reasoning.ts
/** Preserve explicit off until the selected route maps it to its native value. */
function resolveOpenAISimpleReasoningEffort(model, reasoning) {
	return reasoning === void 0 ? void 0 : clampThinkingLevel(model, reasoning);
}
function resolveOpenAIRequestReasoning(model, reasoning, offDefault = "none") {
	const requested = normalizeOpenAIReasoningEffort(reasoning ?? "off");
	const modelLevel = MODEL_CATALOG_THINKING_LEVELS.find((candidate) => candidate === requested);
	const modelMapped = modelLevel ? model.thinkingLevelMap?.[modelLevel] : void 0;
	const mapped = modelMapped === null ? null : resolveOpenAIReasoningEffortMapping(requested, resolveOpenAIReasoningEffortMap(model)) ?? modelMapped;
	const intent = mapped !== void 0 ? mapped?.trim() : reasoning === void 0 || requested === "off" && offDefault === null ? void 0 : requested;
	const normalizedIntent = normalizeOpenAIReasoningEffort(intent ?? "off");
	const supported = resolveOpenAIModelReasoningEfforts(model);
	const effort = !model.reasoning || supported?.length === 0 || intent === void 0 ? void 0 : supported === void 0 ? mapped !== void 0 ? intent : requested === "off" ? "none" : requested : resolveOpenAIReasoningEffortForModel({
		model,
		effort: requested,
		fallbackMap: { [requested]: intent }
	});
	return {
		effort: effort === "none" && resolveOpenAIThinkingApi(model.api) === "openai-chatgpt-responses" && !supportsOpenAIReasoningEffort(model.id === "gpt-6-sol" || model.id === "gpt-6-luna" ? model : { compat: model.compat }, "none") ? void 0 : effort,
		thinkingEnabled: intent === void 0 ? void 0 : model.reasoning && normalizedIntent !== "off" && normalizedIntent !== "none"
	};
}
//#endregion
//#region packages/ai/src/transports/openai-transport-params.ts
const MAX_OPENAI_STRICT_TOOL_DOWNGRADE_DIAGNOSTIC_KEYS = 256;
const loggedOpenAIStrictToolDowngradeDiagnosticKeys = /* @__PURE__ */ new Set();
const OPENAI_COMPLETIONS_APIS = /* @__PURE__ */ new Set(["openai-completions", "openclaw-openai-completions-transport"]);
function readToolPayloadField(record, field) {
	try {
		return Object.hasOwn(record, field) ? record[field] : void 0;
	} catch {
		return;
	}
}
function readCodeModePayloadToolName(tool) {
	if (!isRecord(tool)) return;
	const name = readToolPayloadField(tool, "name");
	if (typeof name === "string") return name;
	const fn = readToolPayloadField(tool, "function");
	if (!isRecord(fn)) return;
	const fnName = readToolPayloadField(fn, "name");
	return typeof fnName === "string" ? fnName : void 0;
}
function readCodeModePayloadToolIdentity(tool, visibleToolNames, allowedHostedToolTypes) {
	if (!isRecord(tool)) return;
	const type = readToolPayloadField(tool, "type");
	if (typeof type === "string" && allowedHostedToolTypes?.has(type)) {
		try {
			if (Object.hasOwn(tool, "name") || Object.hasOwn(tool, "function") || Object.hasOwn(tool, "functionDeclarations") || Object.hasOwn(tool, "function_declarations")) return false;
		} catch {
			return false;
		}
		return `hosted:${type}`;
	}
	const name = readCodeModePayloadToolName(tool);
	return typeof name === "string" && isCodeModeModelVisibleToolName(name, visibleToolNames) ? `client:${name}` : void 0;
}
function readCodeModePayloadToolIdentities(payload) {
	if (!isRecord(payload)) return [];
	const tools = readToolPayloadField(payload, "tools");
	if (!Array.isArray(tools)) return [];
	return tools.flatMap((tool) => {
		if (!isRecord(tool)) return [];
		const identities = [];
		const name = readCodeModePayloadToolName(tool);
		if (name) identities.push(`client:${name}`);
		for (const key of ["functionDeclarations", "function_declarations"]) {
			const declarations = readToolPayloadField(tool, key);
			if (!Array.isArray(declarations)) continue;
			for (const declaration of declarations) {
				const declarationName = readCodeModePayloadToolName(declaration);
				if (declarationName) identities.push(`client:${declarationName}`);
			}
		}
		const type = readToolPayloadField(tool, "type");
		if (typeof type === "string" && type !== "function") identities.push(`hosted:${type}`);
		return identities;
	});
}
function filterCodeModePayloadTools(payload, visibleToolNames, allowedHostedToolTypes, observer) {
	if (!isRecord(payload)) return;
	const tools = readToolPayloadField(payload, "tools");
	if (!Array.isArray(tools)) return;
	const beforeToolIdentities = observer ? readCodeModePayloadToolIdentities(payload) : void 0;
	payload.tools = tools.flatMap((tool) => {
		const identity = readCodeModePayloadToolIdentity(tool, visibleToolNames, allowedHostedToolTypes);
		if (identity) return [tool];
		if (identity === false) return [];
		if (!isRecord(tool)) return [];
		const filteredGroups = {};
		for (const key of ["functionDeclarations", "function_declarations"]) {
			const declarations = readToolPayloadField(tool, key);
			if (!Array.isArray(declarations)) continue;
			const filtered = declarations.filter((declaration) => {
				const declarationName = readCodeModePayloadToolName(declaration);
				return typeof declarationName === "string" && isCodeModeModelVisibleToolName(declarationName, visibleToolNames);
			});
			if (filtered.length > 0) filteredGroups[key] = filtered;
		}
		return Object.keys(filteredGroups).length > 0 ? [filteredGroups] : [];
	});
	if (beforeToolIdentities) observer?.({
		beforeToolIdentities,
		afterToolIdentities: readCodeModePayloadToolIdentities(payload)
	});
}
function resolveCodeModeResponsesVisibleToolNames(context) {
	return new Set((context.tools ?? []).map(readCodeModePayloadToolName).filter((name) => typeof name === "string"));
}
function enforceCodeModeResponsesToolSurface(payload, visibleToolNames, allowedHostedToolTypes, observer) {
	if (!isRecord(payload)) return;
	const tools = readToolPayloadField(payload, "tools");
	if (!Array.isArray(tools)) return;
	const beforeToolIdentities = observer ? readCodeModePayloadToolIdentities(payload) : void 0;
	payload.tools = tools.filter((tool) => Boolean(readCodeModePayloadToolIdentity(tool, visibleToolNames, allowedHostedToolTypes)));
	if (beforeToolIdentities) observer?.({
		beforeToolIdentities,
		afterToolIdentities: readCodeModePayloadToolIdentities(payload)
	});
}
function assertCodeModeResponsesToolSurface(payload, visibleToolNames, allowedHostedToolTypes) {
	const tools = isRecord(payload) ? readToolPayloadField(payload, "tools") : void 0;
	if (!Array.isArray(tools)) throw new Error("Code mode payload tool surface violation: expected exec,wait; got no tools");
	const identities = tools.map((tool) => readCodeModePayloadToolIdentity(tool, visibleToolNames, allowedHostedToolTypes));
	const names = identities.flatMap((identity) => typeof identity === "string" && identity.startsWith("client:") ? [identity.slice(7)] : []).toSorted((left, right) => left.localeCompare(right));
	if (names.length >= 2 && identities.every((identity) => typeof identity === "string") && new Set(identities).size === identities.length && names.includes("exec") && names.includes("wait")) return;
	throw new Error(`Code mode payload tool surface violation: expected exec,wait plus direct-only tools; got ${names.length > 0 ? names.join(",") : "none"}`);
}
function resolveOpenAIStrictToolFlagWithDiagnostics(projection, strictSetting, context) {
	const strict = resolveOpenAIProjectedToolsStrictToolFlag(projection, strictSetting);
	if (strictSetting === true && strict === false) getAiTransportHost().logDebug("openai-transport", () => {
		const diagnostics = findOpenAIStrictToolProjectionDiagnostics(projection);
		const key = sha256Hex(JSON.stringify({
			transport: context.transport,
			provider: context.model.provider ?? null,
			model: context.model.id ?? null,
			diagnostics: diagnostics.map((entry) => ({
				toolIndex: entry.toolIndex,
				toolName: entry.toolName ?? null,
				violations: entry.violations
			}))
		}));
		if (loggedOpenAIStrictToolDowngradeDiagnosticKeys.has(key)) return null;
		if (loggedOpenAIStrictToolDowngradeDiagnosticKeys.size >= MAX_OPENAI_STRICT_TOOL_DOWNGRADE_DIAGNOSTIC_KEYS) loggedOpenAIStrictToolDowngradeDiagnosticKeys.clear();
		loggedOpenAIStrictToolDowngradeDiagnosticKeys.add(key);
		const sample = diagnostics.slice(0, 5).map((entry) => ({
			tool: entry.toolName ?? `tool[${entry.toolIndex}]`,
			violations: entry.violations.slice(0, 8)
		}));
		return {
			message: `OpenAI ${context.transport} tool schema strict mode downgraded to strict=false for ${context.model.provider ?? "unknown"}/${context.model.id ?? "unknown"} because ${diagnostics.length} tool schema(s) are not strict-compatible`,
			data: {
				transport: context.transport,
				provider: context.model.provider,
				model: context.model.id,
				incompatibleToolCount: diagnostics.length,
				sample
			}
		};
	});
	return strict;
}
function buildOpenAIClientHeaders(model, context, optionHeaders, turnHeaders, sessionId, cacheRetention) {
	const providerHeaders = { ...model.headers };
	if (model.provider === "github-copilot") Object.assign(providerHeaders, getAiTransportHost().buildCopilotDynamicHeaders(context.messages));
	if (OPENAI_COMPLETIONS_APIS.has(model.api) && sessionId && cacheRetention !== "none") {
		const { sessionAffinity } = resolveOpenAICompletionsCompat(model);
		if (sessionAffinity !== "none") {
			const affinityValue = clampOpenAIPromptCacheKey(sessionId) ?? sessionId;
			const affinityHeaders = sessionAffinity === "openrouter" ? ["x-session-id"] : [
				"session_id",
				"x-client-request-id",
				"x-session-affinity"
			];
			const configuredHeaders = new Set(Object.keys(providerHeaders).map((key) => key.toLowerCase()));
			for (const name of affinityHeaders) if (!configuredHeaders.has(name)) providerHeaders[name] = affinityValue;
		}
	}
	const callerHeaders = {
		...optionHeaders,
		...turnHeaders
	};
	const resolvedHeaders = getAiTransportHost().resolveProviderRequestHeaders({
		provider: model.provider,
		api: model.api,
		baseUrl: model.baseUrl,
		providerHeaders,
		callerHeaders: Object.keys(callerHeaders).length > 0 ? callerHeaders : void 0,
		precedence: "caller-wins",
		model
	}) ?? {};
	const sendSessionIdHeader = (OPENAI_RESPONSES_APIS.has(model.api) && model.compat && "sendSessionIdHeader" in model.compat ? model.compat?.sendSessionIdHeader : void 0) ?? usesNativeOpenAICodexResponsesBackend(model);
	if (sessionId && cacheRetention !== "none" && sendSessionIdHeader && !Object.keys(resolvedHeaders).some((key) => normalizeLowercaseStringOrEmpty(key) === "session_id")) resolvedHeaders.session_id = clampOpenAIPromptCacheKey(sessionId) ?? sessionId;
	return resolveOpencodeSessionHeaders(model, {
		sessionId,
		headers: resolvedHeaders
	}) ?? resolvedHeaders;
}
function buildOpenAISdkClientOptions(model) {
	const timeout = resolveModelRequestTimeoutMs(model);
	return {
		...timeout === void 0 ? {} : { timeout },
		maxRetries: 0
	};
}
function buildOpenAISdkRequestOptions(model, signal, options) {
	const timeout = resolveModelRequestTimeoutMs(model, options?.timeoutMs);
	const headers = options?.stream === true && usesNativeOpenAICodexResponsesBackend(model) ? { Accept: "text/event-stream" } : void 0;
	if (timeout === void 0 && !signal && !headers) return;
	return {
		...headers ? { headers } : {},
		...signal ? { signal } : {},
		...timeout !== void 0 ? { timeout } : {},
		maxRetries: 0
	};
}
function getCompat(model) {
	const resolved = resolveOpenAICompletionsCompat(model);
	const compat = model.compat ?? {};
	return {
		...resolved,
		reasoningEffortMap: resolveOpenAIReasoningEffortMap(model, {}),
		openRouterRouting: resolved.openRouterRouting ?? {},
		requiresStringContent: compat.requiresStringContent ?? false,
		strictMessageKeys: compat.strictMessageKeys === true
	};
}
//#endregion
//#region packages/ai/src/transports/openai-responses-compaction-replay.ts
const OPENAI_RESPONSES_COMPACTION_SUPPRESSION_TYPE = "openai-responses-compaction-suppression";
const OPENAI_RESPONSES_COMPACTION_SUPPRESSION_DATA = "rejected";
function isOpenAIResponsesCompactionState(state) {
	if (typeof state.baseUrlHash !== "string" || state.v !== 1) return false;
	if (state.type === OPENAI_RESPONSES_COMPACTION_SUPPRESSION_TYPE) return state.data === OPENAI_RESPONSES_COMPACTION_SUPPRESSION_DATA;
	const retained = state.type === OPENAI_RESPONSES_RETAINED_COMPACTION_REPLAY_TYPE;
	return (retained || state.type === "openai-responses-compaction") && typeof state.data === "string" && state.data.length > 0 && (state.id === void 0 || typeof state.id === "string") && (state.replayIndex === void 0 || !retained && typeof state.replayIndex === "number" && Number.isSafeInteger(state.replayIndex) && state.replayIndex >= 0);
}
function readOpenAIResponsesCompactionReplayState(value) {
	return isRecord(value) && isProviderReplayContext(value) && isOpenAIResponsesCompactionState(value) ? value : void 0;
}
function captureOpenAIResponsesCompaction(output, item, boundary, model, captureMetadata, compactedOutput, outputTokens) {
	const metadata = captureMetadata ?? buildOpenAIResponsesReasoningReplayMetadata(model);
	if (!item.encrypted_content) return;
	if (!metadata?.baseUrlHash) {
		log.debug("[responses] skipping compaction capture: missing base URL hash");
		return;
	}
	const currentReplay = readOpenAIResponsesCompactionReplayState(output.providerReplay);
	if (typeof boundary === "number" && currentReplay?.type === "openai-responses-compaction" && (currentReplay.replayIndex ?? -1) > boundary) return;
	if (compactedOutput && !isOpenAIResponsesCompactionOutput(compactedOutput, model)) throw new Error("Responses compact endpoint checkpoint is invalid");
	const replay = {
		v: 1,
		...boundary === "retained-users" ? { type: OPENAI_RESPONSES_RETAINED_COMPACTION_REPLAY_TYPE } : {
			type: OPENAI_RESPONSES_COMPACTION_REPLAY_TYPE,
			replayIndex: boundary
		},
		...item.id ? { id: item.id } : {},
		data: item.encrypted_content,
		provider: metadata.provider,
		api: metadata.api,
		model: metadata.model,
		baseUrlHash: metadata.baseUrlHash,
		...metadata.sessionHash ? { sessionHash: metadata.sessionHash } : {},
		...metadata.authProfileHash ? { authProfileHash: metadata.authProfileHash } : {},
		...compactedOutput ? { compactedWindow: {
			state: "ready",
			output: JSON.stringify(compactedOutput),
			...outputTokens !== void 0 ? { outputTokens } : {}
		} } : {}
	};
	if (compactedOutput && !readOpenAIResponsesCompactionWindow(replay, model)) throw new Error("Responses compact endpoint checkpoint is invalid or exceeds 16 MiB");
	output.providerReplay = replay;
}
function suppressOpenAIResponsesCompaction(output, model, options, rejectedCheckpoint) {
	const context = buildProviderReplayContext(model, options);
	if (!context.baseUrlHash) return;
	output.providerReplay = {
		v: 1,
		type: OPENAI_RESPONSES_COMPACTION_SUPPRESSION_TYPE,
		data: OPENAI_RESPONSES_COMPACTION_SUPPRESSION_DATA,
		...context,
		baseUrlHash: context.baseUrlHash
	};
	if (rejectedCheckpoint) options?.onCompactionRejected?.(rejectedCheckpoint);
}
function createCompactionTracker(output, model, options) {
	const replayIndexes = /* @__PURE__ */ new Map();
	return {
		added(item, replayIndex) {
			if (item.type === "compaction" && item.id) replayIndexes.set(item.id, replayIndex);
		},
		completed(item, fallbackReplayIndex) {
			if (item.type !== "compaction" || !item.encrypted_content) return;
			captureOpenAIResponsesCompaction(output, {
				type: "compaction",
				...item.id ? { id: item.id } : {},
				encrypted_content: item.encrypted_content
			}, (item.id ? replayIndexes.get(item.id) : void 0) ?? fallbackReplayIndex, model, options?.reasoningReplayMetadata);
			if (item.id) replayIndexes.delete(item.id);
		}
	};
}
function isSafeResponsesReplayItemId(id) {
	return typeof id === "string" && id.length > 0 && id.length <= 64;
}
function resolveNewestOpenAIResponsesCompactionReplay(messages, model, options) {
	const context = buildProviderReplayContext(model, options);
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index];
		if (message?.role !== "assistant") continue;
		const replay = readOpenAIResponsesCompactionReplayState(message.providerReplay);
		if (replay?.type === OPENAI_RESPONSES_COMPACTION_SUPPRESSION_TYPE) {
			if (providerReplayContextMatches(replay, context)) return;
			continue;
		}
		if (replay?.type !== "openai-responses-compaction" && replay?.type !== "openai-responses-retained-compaction") {
			if (message.providerReplay?.type === "openai-responses-compaction" || message.providerReplay?.type === "openai-responses-retained-compaction") return;
			continue;
		}
		if (!providerReplayContextMatches(replay, context)) return;
		if (replay.compactedWindow !== void 0 || replay.type === "openai-responses-retained-compaction") {
			const output = readOpenAIResponsesCompactionWindow(replay, model);
			const item = output?.at(-1);
			if (!output || item?.type !== "compaction") return {
				owner: message,
				mode: "refresh-required"
			};
			return {
				owner: message,
				mode: "complete-window",
				output,
				...replay.compactedWindow?.state === "ready" && replay.compactedWindow.outputTokens !== void 0 ? { outputTokens: replay.compactedWindow.outputTokens } : {},
				item,
				replayIndex: replay.type === "openai-responses-retained-compaction" ? message.content.length : replay.replayIndex ?? 0
			};
		}
		return {
			owner: message,
			item: {
				type: "compaction",
				...isSafeResponsesReplayItemId(replay.id) ? { id: replay.id } : {},
				encrypted_content: replay.data
			},
			mode: "compacted-prefix",
			replayIndex: replay.replayIndex ?? 0
		};
	}
}
var CompactionReplayRefreshRequiredError = class extends Error {
	constructor() {
		super("Provider compaction checkpoint needs rebuilding. Run /compact to rebuild from saved conversation history.");
		this.name = "CompactionReplayRefreshRequiredError";
	}
};
function buildOpenAIResponsesCompactionReplayPlan(messages, model, options) {
	if (options?.mode === "full-history") return {
		messages,
		preserveUnframedToolResults: false
	};
	const compaction = resolveNewestOpenAIResponsesCompactionReplay(messages, model, options);
	if (!compaction) return {
		messages,
		preserveUnframedToolResults: false
	};
	if (compaction.mode === "refresh-required") throw new CompactionReplayRefreshRequiredError();
	const ownerIndex = messages.indexOf(compaction.owner);
	return {
		messages: [{
			...compaction.owner,
			content: compaction.owner.content.slice(compaction.replayIndex)
		}, ...messages.slice(ownerIndex + 1)],
		...compaction.mode === "complete-window" ? { compactedWindow: compaction.output } : { compaction: compaction.item },
		preserveUnframedToolResults: true
	};
}
function buildOpenAIResponsesReasoningReplayMetadata(model, options) {
	return {
		v: 1,
		source: "openai-responses",
		...buildProviderReplayContext(model, options)
	};
}
//#endregion
//#region packages/ai/src/transports/openai-responses-reasoning-update.ts
function isConfigurationUpdate(value) {
	return isRecord(value) && value.type === "configuration_update" && isRecord(value.reasoning) && typeof value.reasoning.effort === "string";
}
function isResponsesReasoningUpdateCompatible(request) {
	const mode = isRecord(request.reasoning) ? request.reasoning.mode : void 0;
	return request.model === "gpt-6-astra" && (mode === void 0 || mode === "standard") && (!isRecord(request.multi_agent) || request.multi_agent.enabled !== true) && request.truncation !== "auto" && (!Array.isArray(request.context_management) || !request.context_management.some((item) => isRecord(item) && item.type === "compaction"));
}
function supportsResponsesReasoningUpdate(request) {
	return isResponsesReasoningUpdateCompatible(request) && isRecord(request.reasoning) && typeof request.reasoning.effort === "string";
}
function canReferenceResponsesReasoningHistory(previous, request) {
	return !previous.input?.some(isConfigurationUpdate) || isResponsesReasoningUpdateCompatible(request);
}
/** Rehydrate input controls only provisionally; continuation must validate the full prefix. */
function replayResponsesReasoningUpdates(previous, request, previousOutputLength, steering) {
	if (steering !== "required-input" && (!supportsResponsesReasoningUpdate(previous) || !supportsResponsesReasoningUpdate(request)) || !Array.isArray(previous.input) || !Array.isArray(request.input) || request.input.some(isConfigurationUpdate)) return request;
	const input = [...request.input];
	let activeEffort = isRecord(previous.reasoning) ? previous.reasoning.effort : void 0;
	for (const [index, item] of previous.input.entries()) if (isConfigurationUpdate(item)) {
		input.splice(index, 0, item);
		activeEffort = item.reasoning.effort;
	}
	if (steering === "required-input") return input.length === request.input.length ? request : {
		...request,
		input
	};
	if (!isRecord(previous.reasoning) || !isRecord(request.reasoning) || typeof request.reasoning.effort !== "string") return request;
	if (activeEffort !== request.reasoning.effort && steering !== "automatic") {
		const baselineLength = previous.input.length + previousOutputLength;
		const nextUser = input.findIndex((item, index) => index >= baselineLength && "role" in item && item.role === "user");
		if (nextUser === -1) return request;
		input.splice(nextUser, 0, {
			type: "configuration_update",
			reasoning: { effort: request.reasoning.effort }
		});
	}
	if (input.length === request.input.length && activeEffort === request.reasoning.effort) return request;
	return {
		...request,
		reasoning: {
			...request.reasoning,
			effort: previous.reasoning.effort
		},
		input
	};
}
//#endregion
//#region packages/ai/src/transports/openai-responses-tool-call-id-shape.ts
/**
* Pure OpenAI Responses `call_*`/`fc_*` tool-call-id shape helpers.
*
* Moved out of embedded-agent-helpers/openai.ts (the AgentMessage[]-walking
* caller lives in src/agents and imports from packages/ai, so the reverse
* import direction is not available) so the continuation transport can
* recognize its own cached raw ids after this same reshaping and restore
* them on a replayed wire request -- see openai-responses-continuation.ts.
*/
const OPENAI_RESPONSES_ID_MAX_LENGTH = 64;
const OPENAI_RESPONSES_CALL_ID_RE = /^call_[A-Za-z0-9_-]{1,59}$/;
const OPENAI_RESPONSES_FUNCTION_CALL_ITEM_ID_RE = /^fc_[A-Za-z0-9_-]{1,61}$/;
function splitOpenAIFunctionCallPairing(id) {
	const separator = id.indexOf("|");
	if (separator <= 0 || separator >= id.length - 1) return { callId: id };
	return {
		callId: id.slice(0, separator),
		itemId: id.slice(separator + 1)
	};
}
function normalizeOpenAIResponsesIdPart(value, prefix) {
	const trimmed = value.trim();
	if ((prefix === "call_" ? OPENAI_RESPONSES_CALL_ID_RE : OPENAI_RESPONSES_FUNCTION_CALL_ITEM_ID_RE).test(trimmed)) return trimmed;
	const rawTail = trimmed.startsWith(prefix) ? trimmed.slice(prefix.length) : trimmed;
	const hash = sha256Hex(trimmed || prefix).slice(0, 10);
	const maxTailLength = 64 - prefix.length;
	const hashSuffix = `_${hash}`;
	return `${prefix}${`${rawTail.replace(/[^A-Za-z0-9_-]/g, "_").replace(/^_+|_+$/g, "").slice(0, Math.max(1, maxTailLength - hashSuffix.length)) || "id"}${hashSuffix}`.slice(0, maxTailLength)}`;
}
/** Same shaping `normalizeOpenAIResponsesToolCallIds` applies to a replayed `call_id`/`call_id|fc_id` pair. */
function normalizeOpenAIResponsesFunctionCallId(id) {
	const { callId, itemId } = splitOpenAIFunctionCallPairing(id);
	const normalizedCallId = normalizeOpenAIResponsesIdPart(itemId ? `${callId}|${itemId}` : callId, "call_");
	if (!itemId) return normalizedCallId;
	return `${normalizedCallId}|${normalizeOpenAIResponsesIdPart(itemId, "fc_")}`;
}
function shouldNormalizeOpenAIResponsesToolCallId(id) {
	const pairing = splitOpenAIFunctionCallPairing(id);
	if (!OPENAI_RESPONSES_CALL_ID_RE.test(pairing.callId)) return true;
	if (pairing.itemId === void 0) return false;
	return !OPENAI_RESPONSES_FUNCTION_CALL_ITEM_ID_RE.test(pairing.itemId);
}
//#endregion
//#region packages/ai/src/transports/openai-responses-continuation.ts
const HTTP_CONTINUATION_IDLE_TTL_MS = 54e5;
const MAX_HTTP_CONTINUATION_READY_ENTRIES = 1e3;
const MAX_HTTP_CONTINUATION_RETAINED_BYTES = 67108864;
const TURN_HEADERS = /* @__PURE__ */ new Set([
	"traceparent",
	"x-openclaw-turn-id",
	"x-openclaw-turn-attempt"
]);
function jsonValuesEqual(left, right) {
	const leftJson = JSON.stringify(left);
	const normalizedLeft = stableStringify(JSON.parse(leftJson));
	const rightJson = JSON.stringify(right);
	return leftJson === rightJson || normalizedLeft === stableStringify(JSON.parse(rightJson));
}
function requestWithoutInput(request) {
	const { input: _input, previous_response_id: _previousResponseId, instructions: _instructions, tools: _tools, ...rest } = request;
	if (!isRecord(rest.metadata)) return rest;
	const metadata = Object.fromEntries(Object.entries(rest.metadata).filter(([key]) => key !== "openclaw_turn_id" && key !== "openclaw_turn_attempt"));
	return {
		...rest,
		metadata
	};
}
function canonicalizeToolCallId(callId, itemId) {
	if (typeof callId !== "string") return callId;
	const paired = typeof itemId === "string" && itemId ? `${callId}|${itemId}` : callId;
	if (!shouldNormalizeOpenAIResponsesToolCallId(paired)) return callId;
	return splitOpenAIFunctionCallPairing(normalizeOpenAIResponsesFunctionCallId(paired)).callId;
}
function responseToolCalls(items) {
	return items.flatMap((item) => {
		if (!isRecord(item) || item.type !== "function_call" || typeof item.call_id !== "string") return [];
		return [{
			callId: item.call_id,
			...typeof item.id === "string" ? { itemId: item.id } : {}
		}];
	});
}
function toolCallReplayShapes(call) {
	return new Set([
		call.callId,
		canonicalizeToolCallId(call.callId, call.itemId),
		canonicalizeToolCallId(call.callId, void 0)
	].filter((shape) => typeof shape === "string"));
}
function toolCallOwnerByReplayShape(calls) {
	const ownerByReplayShape = /* @__PURE__ */ new Map();
	for (const [index, call] of calls.entries()) for (const replayShape of toolCallReplayShapes(call)) {
		const owner = ownerByReplayShape.get(replayShape);
		ownerByReplayShape.set(replayShape, owner === void 0 || owner === index ? index : null);
	}
	return ownerByReplayShape;
}
function pendingResponsesToolCalls(calls, input) {
	const ownerByReplayShape = toolCallOwnerByReplayShape(calls);
	const replayedCallIds = /* @__PURE__ */ new Set();
	const lastCallPosition = /* @__PURE__ */ new Map();
	const lastOutputPosition = /* @__PURE__ */ new Map();
	for (const [inputIndex, item] of input.entries()) {
		if (!isRecord(item) || typeof item.call_id !== "string") continue;
		const owner = ownerByReplayShape.get(item.call_id);
		if (item.type === "function_call") replayedCallIds.add(item.call_id);
		const positions = item.type === "function_call" ? lastCallPosition : item.type === "function_call_output" ? lastOutputPosition : void 0;
		if (positions && owner !== void 0 && owner !== null) positions.set(owner, inputIndex);
	}
	return calls.filter((_call, index) => {
		const callPosition = lastCallPosition.get(index);
		return [...toolCallReplayShapes(_call)].some((shape) => replayedCallIds.has(shape)) && (callPosition === void 0 || (lastOutputPosition.get(index) ?? -1) < callPosition);
	});
}
function recordResponsesContinuationState(previous, lastRequest, response, continued = false) {
	const calls = previous && continued ? [...previous.pendingToolCalls ?? [], ...responseToolCalls(previous.lastResponseItems)] : responseToolCalls(lastRequest.input ?? []);
	const seenCalls = /* @__PURE__ */ new Set();
	const pendingToolCalls = pendingResponsesToolCalls(calls.filter((call) => {
		const key = JSON.stringify([call.callId, call.itemId]);
		if (seenCalls.has(key)) return false;
		seenCalls.add(key);
		return true;
	}), lastRequest.input ?? []);
	return {
		lastRequest,
		lastResponseId: response.id,
		lastResponseItems: response.output,
		pendingToolCalls
	};
}
function normalizeAssistantReplayInput(input, fromResponse = false, ignoreCachedItemIds = false) {
	return input.map((item) => {
		if (!isRecord(item)) return item;
		if (item.type === "reasoning") return { type: "reasoning" };
		if (item.type !== "function_call" && item.type !== "function_call_output" && !(item.type === "message" && item.role === "assistant")) return item;
		const { id: rawId, status: _status, ...stableItem } = item;
		if (item.type === "function_call_output") {
			if ("id" in item) stableItem.id = item.id;
			if ("status" in item) stableItem.status = item.status;
		}
		if ("call_id" in stableItem) {
			const itemId = item.type === "function_call" && !(fromResponse && ignoreCachedItemIds) ? rawId : void 0;
			stableItem.call_id = canonicalizeToolCallId(stableItem.call_id, itemId);
		}
		if (fromResponse && item.type === "function_call") {
			const args = parseJsonObjectPreservingUnsafeIntegers(stableItem.arguments);
			stableItem.arguments = args ? JSON.stringify(args) : stableItem.arguments;
		}
		if (item.type === "message" && Array.isArray(stableItem.content)) stableItem.content = stableItem.content.map((part) => {
			if (!isRecord(part) || part.type !== "output_text") return part;
			const { annotations: _annotations, logprobs: _logprobs, ...stablePart } = part;
			return stablePart;
		});
		return stableItem;
	});
}
function normalizeContinuationHistory(input) {
	const normalized = normalizeAssistantReplayInput(input);
	const ownerByReplayShape = toolCallOwnerByReplayShape(responseToolCalls(input));
	let callIndex = 0;
	for (const [index, item] of input.entries()) {
		const normalizedItem = normalized[index];
		if (!isRecord(item) || !isRecord(normalizedItem)) continue;
		if (item.type === "function_call") {
			if (typeof normalizedItem.call_id !== "string") return;
			const callOwner = ownerByReplayShape.get(normalizedItem.call_id);
			if (callOwner !== callIndex) return;
			normalizedItem.call_id = { callOwner };
			callIndex += 1;
			continue;
		}
		if (item.type !== "function_call_output" || typeof item.call_id !== "string") continue;
		const owner = ownerByReplayShape.get(item.call_id);
		if (owner === null) return;
		normalizedItem.call_id = owner === void 0 ? { unknownCallId: canonicalizeToolCallId(item.call_id, void 0) } : { callOwner: owner };
	}
	return normalized;
}
function continuationHistoryMatches(previousInput, currentInput) {
	for (const [index, previousItem] of previousInput.entries()) {
		const currentItem = currentInput[index];
		if (!isRecord(previousItem) || !isRecord(currentItem)) continue;
		if (previousItem.type === "function_call" && currentItem.type === "function_call") {
			if (typeof previousItem.call_id === "string" && typeof currentItem.call_id === "string" && !toolCallReplayShapes({
				callId: previousItem.call_id,
				...typeof previousItem.id === "string" ? { itemId: previousItem.id } : {}
			}).has(currentItem.call_id)) return false;
		}
		if (previousItem.type === "function_call_output" && currentItem.type === "function_call_output" && typeof previousItem.call_id === "string" && typeof currentItem.call_id === "string" && currentItem.call_id !== previousItem.call_id && currentItem.call_id !== canonicalizeToolCallId(previousItem.call_id, void 0)) return false;
	}
	const normalizedPrevious = normalizeContinuationHistory(previousInput);
	const normalizedCurrent = normalizeContinuationHistory(currentInput);
	return normalizedPrevious !== void 0 && normalizedCurrent !== void 0 && jsonValuesEqual(normalizedCurrent, normalizedPrevious);
}
function responsesContinuationRequestFingerprint(request) {
	const serialized = JSON.stringify(requestWithoutInput(request));
	return sha256Hex(stableStringify(JSON.parse(serialized)));
}
function responsesContinuationPrefixFingerprint(input, output = []) {
	const serialized = JSON.stringify([...normalizeAssistantReplayInput(input), ...normalizeAssistantReplayInput(output, true)]);
	return sha256Hex(stableStringify(JSON.parse(serialized)));
}
function restoreRawCallIdsInDelta(delta, cachedResponseItems, replayedToolRound, pendingToolCalls) {
	const currentResponseCalls = responseToolCalls(cachedResponseItems);
	const replayedCalls = replayedToolRound.filter((item) => isRecord(item) && item.type === "function_call");
	if (currentResponseCalls.length !== replayedCalls.length) return;
	const cachedCalls = [...pendingToolCalls, ...currentResponseCalls];
	const currentCallOffset = pendingToolCalls.length;
	const ownerByReplayShape = toolCallOwnerByReplayShape(cachedCalls);
	for (const index of currentResponseCalls.keys()) {
		const replayedCallId = replayedCalls[index]?.call_id;
		if (typeof replayedCallId !== "string" || ownerByReplayShape.get(replayedCallId) !== currentCallOffset + index) return;
	}
	const restoredDelta = [];
	for (const item of delta) {
		if (!isRecord(item) || item.type !== "function_call_output" || typeof item.call_id !== "string") {
			restoredDelta.push(item);
			continue;
		}
		const owner = ownerByReplayShape.get(item.call_id);
		if (owner === void 0 || owner === null) return;
		const rawCallId = cachedCalls[owner]?.callId;
		if (!rawCallId) return;
		restoredDelta.push(rawCallId === item.call_id ? item : {
			...item,
			call_id: rawCallId
		});
	}
	return restoredDelta;
}
function resolveResponsesContinuationRequest(continuation, request, steering) {
	if (!continuation) return {
		request,
		continuationStatus: "no_previous_response"
	};
	if (request.previous_response_id) return {
		request,
		continuationStatus: "explicit_previous_response_id"
	};
	if (!canReferenceResponsesReasoningHistory(continuation.lastRequest, request)) return {
		request,
		continuationStatus: "request_changed"
	};
	const prepared = replayResponsesReasoningUpdates(continuation.lastRequest, request, continuation.lastResponseItems.length, steering);
	if (steering !== "required-input" && !jsonValuesEqual(requestWithoutInput(prepared), requestWithoutInput(continuation.lastRequest))) return {
		request,
		continuationStatus: "request_changed"
	};
	const currentInput = prepared.input ?? [];
	const previousInput = continuation.lastRequest.input ?? [];
	const baselineLength = previousInput.length + continuation.lastResponseItems.length;
	if (currentInput.length < baselineLength) return {
		request,
		continuationStatus: "history_shorter"
	};
	const replayedToolRoundInput = currentInput.slice(previousInput.length, baselineLength);
	const replayedToolRound = normalizeAssistantReplayInput(replayedToolRoundInput);
	const historyToolRoundUnchanged = [false, true].some((ignoreCachedItemIds) => jsonValuesEqual(replayedToolRound, normalizeAssistantReplayInput(continuation.lastResponseItems, true, ignoreCachedItemIds)));
	if (!continuationHistoryMatches(previousInput, currentInput.slice(0, previousInput.length)) || !historyToolRoundUnchanged) return {
		request,
		continuationStatus: "history_changed"
	};
	const restoredInput = restoreRawCallIdsInDelta(currentInput.slice(baselineLength), continuation.lastResponseItems, replayedToolRoundInput, continuation.pendingToolCalls ?? []);
	if (!restoredInput) return {
		request,
		continuationStatus: "history_changed"
	};
	const restoredResponseInput = restoredInput;
	return {
		request: {
			...prepared,
			previous_response_id: continuation.lastResponseId,
			input: restoredResponseInput
		},
		...prepared !== request ? { fullRequest: prepared } : {},
		continuationStatus: "continued"
	};
}
const httpContinuationEntries = /* @__PURE__ */ new Map();
const readyHttpContinuationEntries = /* @__PURE__ */ new Map();
let httpContinuationRetainedBytes = 0;
function createHttpContinuationTimer(key) {
	const timer = setTimeout(() => {
		const entry = httpContinuationEntries.get(key);
		if (entry?.kind === "ready" && entry.idleTimer === timer) deleteHttpContinuationIfOwned(key, entry);
	}, HTTP_CONTINUATION_IDLE_TTL_MS);
	timer.unref?.();
	return timer;
}
function deleteHttpContinuationIfOwned(key, entry) {
	if (httpContinuationEntries.get(key) !== entry) return;
	if (entry.kind === "ready") {
		clearTimeout(entry.idleTimer);
		httpContinuationRetainedBytes -= entry.retainedBytes;
		readyHttpContinuationEntries.delete(key);
	}
	httpContinuationEntries.delete(key);
}
function evictReadyEntriesForCapacity(pendingBytes) {
	for (;;) {
		const overCapacity = readyHttpContinuationEntries.size >= MAX_HTTP_CONTINUATION_READY_ENTRIES;
		const overBudget = httpContinuationRetainedBytes + pendingBytes > MAX_HTTP_CONTINUATION_RETAINED_BYTES;
		if (!overCapacity && !overBudget) return;
		const oldest = readyHttpContinuationEntries.entries().next();
		if (oldest.done) return;
		const [oldestKey, oldestEntry] = oldest.value;
		deleteHttpContinuationIfOwned(oldestKey, oldestEntry);
	}
}
function connectionIdentity(params) {
	const headers = Object.entries(resolveAiTransportHeaderSentinels(params.headers) ?? {}).map(([name, value]) => [name.toLowerCase(), value]).filter(([name]) => !TURN_HEADERS.has(name)).toSorted(([a], [b]) => a.localeCompare(b));
	return sha256Hex(JSON.stringify([
		getAiTransportHost().resolveSecretSentinel(params.apiKey),
		params.baseUrl,
		headers
	]));
}
function claimOpenAIResponsesHttpContinuation(params) {
	const owner = getAiTransportHost();
	const key = `${getSessionResourceOwnerId(owner)}\0${params.sessionId}\0${connectionIdentity(params)}`;
	const previous = httpContinuationEntries.get(key);
	if (previous?.kind === "claimed") return;
	if (previous) deleteHttpContinuationIfOwned(key, previous);
	const claimed = {
		kind: "claimed",
		sessionId: params.sessionId,
		owner
	};
	httpContinuationEntries.set(key, claimed);
	try {
		const request = previous ? params.request : params.restoreRequest?.() ?? params.request;
		const resolved = resolveResponsesContinuationRequest(previous?.state, request);
		const fullRequest = resolved.fullRequest ?? request;
		return {
			request: params.request.store === false ? fullRequest : resolved.request,
			fullRequest,
			commit: (effectiveRequest, response, dispatchedPreviousResponseId) => {
				if (httpContinuationEntries.get(key) !== claimed) return;
				const state = recordResponsesContinuationState(previous?.state, effectiveRequest, response, previous !== void 0 && dispatchedPreviousResponseId === previous.state.lastResponseId);
				const retainedBytes = Buffer.byteLength(JSON.stringify(state), "utf8");
				if (retainedBytes > MAX_HTTP_CONTINUATION_RETAINED_BYTES) {
					deleteHttpContinuationIfOwned(key, claimed);
					return;
				}
				evictReadyEntriesForCapacity(retainedBytes);
				const ready = {
					...claimed,
					kind: "ready",
					state,
					idleTimer: owner.runInDetachedAsyncContext(() => createHttpContinuationTimer(key)),
					retainedBytes
				};
				httpContinuationRetainedBytes += retainedBytes;
				httpContinuationEntries.set(key, ready);
				readyHttpContinuationEntries.set(key, ready);
			},
			release: () => deleteHttpContinuationIfOwned(key, claimed)
		};
	} catch (error) {
		deleteHttpContinuationIfOwned(key, claimed);
		throw error;
	}
}
registerSessionResourceCleanup((sessionId, owner) => {
	for (const [key, entry] of httpContinuationEntries) if ((!owner || entry.owner === owner) && (!sessionId || entry.sessionId === sessionId)) deleteHttpContinuationIfOwned(key, entry);
});
//#endregion
//#region packages/ai/src/transports/openai-responses-input-replay.ts
function recordResponsesInputReplay(message, replay) {
	if (replay) Object.assign(message, { openclawResponsesInputReplay: replay });
}
function readResponsesInputReplayState(message) {
	const replay = "openclawResponsesInputReplay" in message ? message.openclawResponsesInputReplay : void 0;
	return isRecord(replay) ? replay : void 0;
}
function readResponsesInputReplay(message) {
	const replay = readResponsesInputReplayState(message);
	if (replay && typeof replay.afterResponseId === "string" && Array.isArray(replay.before) && replay.before.every((item) => typeof item === "string") && Array.isArray(replay.after) && replay.after.every((item) => typeof item === "string")) return {
		afterResponseId: replay.afterResponseId,
		before: replay.before,
		after: replay.after
	};
}
function responsesInputFingerprint(item) {
	if (isRecord(item) && (item.type === "function_call_output" || item.type === "custom_tool_call_output") && typeof item.call_id === "string") return sha256Hex(stableStringify({
		type: item.type,
		call_id: item.call_id
	}));
	return sha256Hex(stableStringify(item));
}
/** Reconstruct delivery order without rewriting durable local completion events. */
function createResponsesInputReplay(model) {
	const starts = /* @__PURE__ */ new Map();
	const ends = /* @__PURE__ */ new Map();
	const fingerprints = /* @__PURE__ */ new Map();
	const fingerprint = (item) => {
		const value = fingerprints.get(item) ?? responsesInputFingerprint(item);
		fingerprints.set(item, value);
		return value;
	};
	return (input, output, message) => {
		const key = message.turnId || message.responseId;
		const start = (key ? starts.get(key) : void 0) ?? output[0];
		if (key && start) starts.set(key, start);
		input.push(...output);
		let end = input.at(-1);
		const replay = readResponsesInputReplay(message);
		const parent = replay ? ends.get(replay.afterResponseId) : void 0;
		if (replay && parent && message.provider === model.provider && message.api === model.api && message.model === model.id) {
			const take = (keys) => {
				const moved = [];
				for (const inputKey of keys.toReversed()) {
					const boundary = input.indexOf(parent);
					const index = input.findLastIndex((item, position) => position > boundary && fingerprint(item) === inputKey);
					if (index > boundary) moved.unshift(...input.splice(index, 1));
				}
				return moved;
			};
			const before = take(replay.before);
			const after = take(replay.after);
			input.splice(start ? input.indexOf(start) : input.length, 0, ...before);
			end = input.at(-1);
			input.push(...after);
		}
		if (message.responseId && end) ends.set(message.responseId, end);
	};
}
//#endregion
//#region packages/ai/src/transports/openai-responses-replay.ts
/** Resolves the assistant message id that can be replayed to OpenAI Responses. */
function resolveReplayableResponsesMessageId(params) {
	if (!params.replayResponsesItemIds) return;
	if (!params.textSignatureId) return params.fallbackOrdinal === 0 ? params.fallbackId : `${params.fallbackId}_${params.fallbackOrdinal}`;
	return params.previousReplayItemWasReasoning ? params.textSignatureId : void 0;
}
function normalizeOpenAIResponsesReasoningReplayItem(item, api) {
	if (api === "openai-chatgpt-responses") return Array.isArray(item.summary) ? item : {
		...item,
		summary: []
	};
	return {
		id: item.id,
		type: "reasoning",
		summary: [],
		...Array.isArray(item.content) && item.content.length === 0 ? { content: [] } : {},
		status: item.status,
		encrypted_content: item.encrypted_content
	};
}
//#endregion
//#region packages/ai/src/utils/text-signature.ts
function encodeTextSignatureV1(id, phase) {
	return JSON.stringify({
		v: 1,
		id,
		...phase ? { phase } : {}
	});
}
//#endregion
//#region packages/ai/src/transports/openai-responses-replay-messages-internal.ts
function resolveResponsesInstructionRole(model) {
	const supportsDeveloperRole = !isRecord(model.compat) || model.compat.supportsDeveloperRole !== false;
	return model.reasoning && supportsDeveloperRole ? "developer" : "system";
}
function stripEncryptedReasoningContentFields(value) {
	if (!value || typeof value !== "object") return value;
	if (Array.isArray(value)) {
		let changed = false;
		const next = value.map((item) => {
			const stripped = stripEncryptedReasoningContentFields(item);
			changed ||= !Object.is(stripped, item);
			return stripped;
		});
		return changed ? next : value;
	}
	const source = value;
	if (source.type === "compaction") return value;
	let changed = false;
	const next = {};
	for (const [key, child] of Object.entries(source)) {
		if (key === "encrypted_content") {
			changed = true;
			continue;
		}
		const stripped = stripEncryptedReasoningContentFields(child);
		changed ||= !Object.is(stripped, child);
		next[key] = stripped;
	}
	return changed ? next : value;
}
function isOpenAIResponsesReasoningReplayMetadata(value) {
	return isProviderReplayContext(value) && value.v === 1 && value.source === "openai-responses";
}
function readOpenAIResponsesReasoningReplayBlockMetadata(block) {
	if (!Object.hasOwn(block, "openclawReasoningReplay")) return;
	const value = block[OPENAI_RESPONSES_REASONING_REPLAY_BLOCK_META_KEY];
	return isOpenAIResponsesReasoningReplayMetadata(value) ? value : null;
}
function prepareOpenAIResponsesReasoningItemForReplay(item, context, blockMetadata, options) {
	const hasRawMetadata = Object.hasOwn(item, OPENAI_RESPONSES_REASONING_REPLAY_META_KEY);
	const { [OPENAI_RESPONSES_REASONING_REPLAY_META_KEY]: rawMetadata, ...rest } = item;
	if (!("encrypted_content" in rest)) return normalizeOpenAIResponsesReasoningReplayItem(rest, context.api);
	const metadata = blockMetadata !== void 0 ? blockMetadata ?? void 0 : isOpenAIResponsesReasoningReplayMetadata(rawMetadata) ? rawMetadata : void 0;
	if (blockMetadata === void 0 && !hasRawMetadata && options?.preserveUnattributedEncryptedContent === true || metadata && providerReplayContextMatches(metadata, context)) return normalizeOpenAIResponsesReasoningReplayItem(rest, context.api);
	return normalizeOpenAIResponsesReasoningReplayItem(stripEncryptedReasoningContentFields(rest), context.api);
}
function normalizeResponsesReplayItemId(id) {
	if (!id) return;
	if (id.length <= 64) return id;
	return `msg_${shortHash(id)}`;
}
function responsesAssistantTurnKey(message) {
	const id = message.turnId || message.responseId;
	return id ? `${message.provider}:${message.api}:${message.model}:${id}` : void 0;
}
function orderResponsesAsyncToolResults(source) {
	const lastAssistant = /* @__PURE__ */ new Map();
	for (const [index, message] of source.entries()) if (message.role === "assistant") {
		const key = responsesAssistantTurnKey(message);
		if (key) lastAssistant.set(key, index);
	}
	const owners = /* @__PURE__ */ new Map();
	const pending = /* @__PURE__ */ new Map();
	const ordered = [];
	for (const [index, message] of source.entries()) {
		if (message.role === "assistant") {
			const key = responsesAssistantTurnKey(message);
			if (key) {
				for (const block of message.content) if (block.type === "toolCall" && block.async) owners.set(block.id, key);
			}
		}
		const owner = message.role === "toolResult" ? owners.get(message.toolCallId) : void 0;
		const lastIndex = owner ? lastAssistant.get(owner) : void 0;
		if (lastIndex !== void 0 && lastIndex > index) {
			const results = pending.get(lastIndex) ?? [];
			results.push(message);
			pending.set(lastIndex, results);
		} else ordered.push(message);
		const results = pending.get(index);
		if (results) {
			ordered.push(...results);
			pending.delete(index);
		}
	}
	return ordered;
}
function parseOpenAIResponsesTextSignature(signature) {
	if (!signature) return;
	if (signature.startsWith("{")) try {
		const parsed = JSON.parse(signature);
		if (parsed.v === 1) {
			const id = typeof parsed.id === "string" ? parsed.id : void 0;
			const phase = parsed.phase === "commentary" || parsed.phase === "final_answer" ? parsed.phase : void 0;
			if (id !== void 0 || phase !== void 0) return {
				id,
				phase
			};
			return;
		}
	} catch {}
	return { id: signature };
}
const responsesInputSource = Symbol("openclaw.responsesInputSource");
/** Source identity survives payload spreads but never enters serialized provider input. */
function bindResponsesInputMessage(source) {
	const identity = {};
	Object.defineProperty(source, responsesInputSource, {
		value: identity,
		enumerable: true
	});
	return (input) => typeof input === "object" && input !== null && Reflect.get(input, responsesInputSource) === identity;
}
function buildResponsesInputMessage(role, content, source) {
	const identity = source && Reflect.get(source, responsesInputSource);
	return {
		type: "message",
		role,
		content,
		...identity ? { [responsesInputSource]: identity } : {}
	};
}
function convertResponsesMessagesWithStyle(model, context, allowedToolCallProviders, options, conversionStyle) {
	const messages = [];
	const providerStyle = conversionStyle === "provider";
	const shouldReplayReasoningItems = options?.replayReasoningItems ?? true;
	const shouldReplayResponsesItemIds = options?.replayResponsesItemIds ?? true;
	const replayContext = buildProviderReplayContext(model, {
		sessionId: options?.sessionId,
		authProfileId: options?.authProfileId
	});
	const shouldNormalizeSameModelToolCallIds = model.provider === "github-copilot";
	const sanitizeIdPart = (part) => {
		const sanitized = part.replace(/[^a-zA-Z0-9_-]/g, "_");
		return providerStyle ? sanitized : sanitized.replace(/_+$/, "");
	};
	const normalizeIdPart = (part) => {
		const sanitized = sanitizeIdPart(part);
		return (sanitized.length > 64 ? sanitized.slice(0, 64) : sanitized).replace(/_+$/, "");
	};
	const buildForeignResponsesItemId = (itemId) => `fc_${shortHash(itemId)}`;
	const buildSameProviderCopilotResponsesItemId = (itemId) => {
		const sanitized = sanitizeIdPart(itemId);
		const candidate = sanitized.startsWith("fc_") ? sanitized : `fc_${sanitized}`;
		return candidate.length > 64 ? buildForeignResponsesItemId(itemId) : candidate;
	};
	const normalizeToolCallId = (id, _targetModel, source) => {
		if (!allowedToolCallProviders.has(model.provider) || !id.includes("|")) return normalizeIdPart(id);
		const separatorIndex = id.indexOf("|");
		const callId = id.slice(0, separatorIndex);
		const itemId = id.slice(separatorIndex + 1);
		const normalizedCallId = normalizeIdPart(callId);
		let normalizedItemId = source.provider !== model.provider || source.api !== model.api ? buildForeignResponsesItemId(itemId) : model.provider === "github-copilot" ? providerStyle ? normalizeIdPart(itemId) : buildSameProviderCopilotResponsesItemId(itemId) : normalizeIdPart(itemId);
		if (!normalizedItemId.startsWith("fc_")) normalizedItemId = normalizeIdPart(`fc_${normalizedItemId}`);
		return `${normalizedCallId}|${normalizedItemId}`;
	};
	const replayPlan = buildOpenAIResponsesCompactionReplayPlan(context.messages, model, {
		sessionId: options?.sessionId,
		authProfileId: options?.authProfileId,
		mode: options?.replayMode
	});
	const transformMessages = (source) => providerStyle ? transformProviderMessages(source, model, normalizeToolCallId) : getAiTransportHost().transformTransportMessages(source, model, normalizeToolCallId, {
		normalizeSameModelToolCallIds: shouldNormalizeSameModelToolCallIds,
		preserveUnframedToolResults: replayPlan.preserveUnframedToolResults || preparedRequestSuffix.has(context)
	});
	const transformedMessages = orderResponsesAsyncToolResults(transformMessages(replayPlan.messages));
	if ((options?.includeSystemPrompt ?? true) && context.systemPrompt) messages.push(buildResponsesInputMessage(resolveResponsesInstructionRole(model), [{
		type: "input_text",
		text: sanitizeTransportPayloadText(stripSystemPromptCacheBoundary(context.systemPrompt))
	}]));
	if (replayPlan.compactedWindow) messages.push(...replayPlan.compactedWindow.map((item) => {
		if (options?.retainUserProvenance && item.type === "message" && item.role === "user") return Object.assign({}, item, { [RESPONSES_RETAINED_USER]: true });
		return item;
	}));
	let replayMessages = replayPlan.compaction ? [replayPlan.compaction, ...transformedMessages] : transformedMessages;
	const isCarrier = (message) => "role" in message && hasRuntimeContextMarker(message);
	if (replayMessages.some(isCarrier)) {
		const anchored = [];
		let insertionIndex = replayPlan.compactedWindow ? 0 : void 0;
		for (const message of replayMessages) {
			if (isCarrier(message) && insertionIndex !== void 0) {
				anchored.splice(insertionIndex++, 0, message);
				continue;
			}
			anchored.push(message);
			if (!isCarrier(message) && ("role" in message ? message.role === "user" : message.type === "compaction")) insertionIndex = anchored.length;
		}
		replayMessages = anchored;
	}
	let msgIndex = 0;
	const appendAssistant = createResponsesInputReplay(model);
	const inHistorySystemUpdates = supportsNativeOpenAIResponsesEndpoint(model);
	for (const msg of replayMessages) {
		if (!("role" in msg)) {
			messages.push(msg);
			continue;
		}
		if (inHistorySystemUpdates && isRuntimeContextMessage(msg)) messages.push(buildResponsesInputMessage(resolveResponsesInstructionRole(model), [{
			type: "input_text",
			text: sanitizeTransportPayloadText(runtimeContextContentToText(msg.content))
		}]));
		else if (msg.role === "user") {
			const role = msg.operatorMessage && inHistorySystemUpdates && (typeof msg.content === "string" || msg.content.every((block) => block.type === "text")) ? resolveResponsesInstructionRole(model) : "user";
			const content = typeof msg.content === "string" ? [{
				type: "input_text",
				text: sanitizeTransportPayloadText(msg.content)
			}] : msg.content.map((item) => item.type === "text" ? {
				type: "input_text",
				text: sanitizeTransportPayloadText(item.text)
			} : {
				type: "input_image",
				detail: "auto",
				image_url: `data:${item.mimeType};base64,${item.data}`
			}).filter((item) => providerStyle || model.input.includes("image") || item.type !== "input_image");
			if (content.length > 0) {
				const input = buildResponsesInputMessage(role, content, msg);
				if (options?.retainUserProvenance && role === "user" && !msg.synthetic && !msg.operatorMessage && !hasRuntimeContextMarker(msg)) Object.assign(input, { [RESPONSES_RETAINED_USER]: true });
				messages.push(input);
			} else if (providerStyle) continue;
		} else if (msg.role === "assistant") {
			const output = [];
			const sourceTurnKey = responsesAssistantTurnKey(msg);
			const sourceFragmentId = msg.content.find((block) => block.type === "toolCall")?.id;
			let textFallbackOrdinal = 0;
			let previousReplayItemWasReasoning = false;
			let seenReplayableReasoning = false;
			const isDifferentModel = msg.model !== model.id && msg.provider === model.provider && msg.api === model.api;
			for (const block of msg.content) if (block.type === "thinking") {
				if (shouldReplayReasoningItems && block.thinkingSignature && (providerStyle || block.thinkingSignature.startsWith("{"))) {
					let reasoningItem;
					try {
						reasoningItem = JSON.parse(block.thinkingSignature);
					} catch {
						continue;
					}
					if (!isRecord(reasoningItem) || reasoningItem.type !== "reasoning") continue;
					const replayableReasoningItem = prepareOpenAIResponsesReasoningItemForReplay(reasoningItem, replayContext, readOpenAIResponsesReasoningReplayBlockMetadata(isRecord(block) ? block : {}), providerStyle ? { preserveUnattributedEncryptedContent: true } : void 0);
					if (!shouldReplayResponsesItemIds) {
						delete replayableReasoningItem.id;
						if (!replayableReasoningItem.encrypted_content) continue;
					}
					if (shouldReplayResponsesItemIds && !providerStyle && model.provider === "github-copilot" && !isSafeResponsesReplayItemId(replayableReasoningItem.id)) continue;
					output.push(replayableReasoningItem);
					previousReplayItemWasReasoning = true;
					seenReplayableReasoning ||= typeof replayableReasoningItem.id === "string" && replayableReasoningItem.id.startsWith("rs_");
				}
			} else if (block.type === "text") {
				const textSignature = parseOpenAIResponsesTextSignature(block.textSignature);
				let msgId = resolveReplayableResponsesMessageId({
					replayResponsesItemIds: shouldReplayResponsesItemIds,
					textSignatureId: textSignature?.id,
					fallbackId: sourceTurnKey ? `msg_${shortHash(JSON.stringify([sourceTurnKey, sourceFragmentId]))}` : `msg_${msgIndex}`,
					fallbackOrdinal: textFallbackOrdinal,
					previousReplayItemWasReasoning
				});
				if (!textSignature?.id) textFallbackOrdinal += 1;
				msgId = normalizeResponsesReplayItemId(msgId);
				const messageItem = {
					type: "message",
					role: "assistant",
					content: [{
						type: "output_text",
						text: sanitizeTransportPayloadText(block.text),
						annotations: []
					}],
					status: "completed",
					...msgId ? { id: msgId } : {},
					phase: textSignature?.phase
				};
				output.push(messageItem);
				previousReplayItemWasReasoning = false;
			} else if (block.type === "toolCall") {
				const separatorIndex = block.id.indexOf("|");
				const callId = separatorIndex === -1 ? block.id : block.id.slice(0, separatorIndex);
				const itemIdRaw = separatorIndex === -1 ? void 0 : block.id.slice(separatorIndex + 1);
				const itemId = shouldReplayResponsesItemIds && (!itemIdRaw?.startsWith("fc_") || seenReplayableReasoning && !isDifferentModel) ? itemIdRaw : void 0;
				output.push({
					type: "function_call",
					...itemId ? { id: itemId } : {},
					call_id: callId,
					name: block.name,
					...block.async ? { async: true } : {},
					arguments: providerStyle ? JSON.stringify(block.arguments) : typeof block.arguments === "string" ? block.arguments : JSON.stringify(block.arguments ?? {})
				});
				previousReplayItemWasReasoning = false;
			}
			while (true) {
				const last = output.at(-1);
				if (last?.type !== "reasoning" || !last.id?.startsWith("rs_") || typeof last.encrypted_content === "string" && last.encrypted_content.length > 0) break;
				output.pop();
			}
			appendAssistant(messages, output, msg);
			if (output.length === 0 && providerStyle) continue;
		} else if (msg.role === "toolResult") {
			const textResult = extractToolResultText(msg.content);
			const hasText = textResult.trim().length > 0;
			const mediaPlaceholder = describeToolResultMediaPlaceholder(msg.content);
			const hasImages = msg.content.some(isImageWithMediaPayload);
			const separatorIndex = msg.toolCallId.indexOf("|");
			const rawCallId = separatorIndex === -1 ? msg.toolCallId : msg.toolCallId.slice(0, separatorIndex);
			const callId = preparedRequestSuffix.has(context) ? preparedRequestSuffix.toolCallId(context, rawCallId, normalizeToolCallId(rawCallId, model, model)) : rawCallId;
			let output = hasText ? textResult : mediaPlaceholder ?? "(no output)";
			if (hasImages && model.input.includes("image")) {
				const parts = [];
				let hasExplicitText = false;
				for (const item of msg.content) if (isImageWithMediaPayload(item)) parts.push({
					type: "input_image",
					detail: "auto",
					image_url: `data:${item.mimeType};base64,${item.data}`
				});
				else if (hasText && item.type === "text") {
					const text = extractToolResultBlockText(item);
					if (text) {
						const joinedText = `${hasExplicitText ? "\n" : ""}${text}`;
						hasExplicitText = true;
						const previous = parts.at(-1);
						if (previous?.type === "input_text") previous.text += joinedText;
						else parts.push({
							type: "input_text",
							text: joinedText
						});
					}
				}
				if (hasText && !hasExplicitText) parts.unshift({
					type: "input_text",
					text: textResult
				});
				else if (!hasText && mediaPlaceholder === "(see attached media)") parts.unshift({
					type: "input_text",
					text: mediaPlaceholder
				});
				output = parts;
			}
			messages.push({
				type: "function_call_output",
				call_id: callId,
				output
			});
		}
		msgIndex += 1;
	}
	return messages;
}
function convertResponsesMessages(model, context, allowedToolCallProviders, options) {
	return convertResponsesMessagesWithStyle(model, context, allowedToolCallProviders, options, "transport");
}
function convertProviderResponsesMessages(model, context, allowedToolCallProviders, options) {
	return convertResponsesMessagesWithStyle(model, context, allowedToolCallProviders, options, "provider");
}
//#endregion
//#region packages/ai/src/transports/openai-responses-context-usage.ts
const TOOL_CALL_PROVIDERS = /* @__PURE__ */ new Set([
	"openai",
	"opencode",
	"azure-openai-responses",
	"github-copilot"
]);
function contextFingerprint(input, output = []) {
	const reasoning = [...input, ...output].flatMap((item) => {
		if (!isRecord(item) || item.type !== "reasoning") return [];
		const { id: _id, status: _status, ...content } = item;
		return [content];
	});
	return sha256Hex(stableStringify({
		prefix: responsesContinuationPrefixFingerprint(input, output),
		reasoning
	}));
}
/** Bind measured usage to the admitted replay prefix, without copying its content. */
function recordResponsesContextUsage(message, model, identity, request, output, projection) {
	const usage = message.usage.contextUsage;
	if (usage?.state !== "available" || !Number.isSafeInteger(usage.totalTokens) || usage.totalTokens <= 0 || message.stopReason === "error" || message.stopReason === "aborted" || message.providerReplay || request.previous_response_id || !Array.isArray(request.input) || !request.input.some((item) => isRecord(item) && item.type === "compaction") || !Array.isArray(output) || output.some((item) => isRecord(item) && item.type === "compaction")) return;
	const replayOutput = (projection === "transport" ? convertResponsesMessages : convertProviderResponsesMessages)(model, { messages: [message] }, TOOL_CALL_PROVIDERS, {
		...identity,
		includeSystemPrompt: false
	}).filter((item) => item.type !== "function_call_output");
	const firstInput = request.input[0];
	const contextUsage = {
		...buildProviderReplayContext(model, identity),
		projection,
		includeSystemPrompt: request.instructions === void 0 && firstInput?.type === "message" && (firstInput.role === "developer" || firstInput.role === "system"),
		prefixHash: contextFingerprint(request.input, replayOutput),
		prefixLength: request.input.length + replayOutput.length,
		promptTokens: usage.promptTokens,
		totalTokens: usage.totalTokens
	};
	Object.assign(message, { openclawResponsesInputReplay: {
		...readResponsesInputReplayState(message),
		contextUsage
	} });
}
/** Only matching provider input may replace the conservative local pressure estimate. */
function resolveResponsesContextUsageBoundary(messages, model, identity, systemPrompt) {
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index];
		if (!message || !isAssistant(message)) continue;
		const state = readResponsesInputReplayState(message)?.contextUsage;
		const usage = message.usage.contextUsage;
		if (!isRecord(state) || usage?.state !== "available") continue;
		const { projection, prefixHash, prefixLength, promptTokens, totalTokens, includeSystemPrompt } = state;
		if (!isProviderReplayContext(state) || !providerReplayContextMatches(state, buildProviderReplayContext(model, identity)) || message.provider !== model.provider || message.api !== model.api || message.model !== model.id || projection !== "transport" && projection !== "provider" || typeof prefixHash !== "string" || typeof prefixLength !== "number" || !Number.isSafeInteger(prefixLength) || prefixLength <= 0 || promptTokens !== usage.promptTokens || totalTokens !== usage.totalTokens || !Number.isSafeInteger(usage.totalTokens) || usage.totalTokens <= 0) return;
		const input = (projection === "transport" ? convertResponsesMessages : convertProviderResponsesMessages)(model, {
			messages: messages.filter(isProviderMessage),
			systemPrompt
		}, TOOL_CALL_PROVIDERS, {
			...identity,
			includeSystemPrompt: includeSystemPrompt === true
		});
		if (input.length < prefixLength || contextFingerprint(input.slice(0, prefixLength)) !== prefixHash) return;
		return {
			index,
			totalTokens: usage.totalTokens,
			suffix: input.slice(prefixLength)
		};
	}
}
function isAssistant(message) {
	return message.role === "assistant";
}
function isProviderMessage(message) {
	return message.role === "user" || message.role === "assistant" || message.role === "toolResult";
}
//#endregion
//#region packages/ai/src/transports/openai-responses-debug.ts
function stringifyUnknown(value) {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean") return String(value);
	return "";
}
function safeDebugValue(value) {
	if (value == null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
	return Array.isArray(value) ? "array" : typeof value;
}
function responseInputTextChars(input) {
	if (typeof input === "string") return input.length;
	if (Array.isArray(input)) return input.reduce((total, item) => total + responseInputTextChars(item), 0);
	if (!input || typeof input !== "object") return 0;
	const record = input;
	let total = 0;
	if (typeof record.text === "string") total += record.text.length;
	if (typeof record.content === "string") total += record.content.length;
	else if (Array.isArray(record.content)) total += responseInputTextChars(record.content);
	return total;
}
function responseInputRoles(input) {
	if (!Array.isArray(input)) return "";
	const roles = /* @__PURE__ */ new Set();
	for (const item of input) if (item && typeof item === "object") {
		const role = item.role;
		if (typeof role === "string" && role.trim()) roles.add(role.trim());
	}
	return [...roles].toSorted().join(",");
}
function responseInputItemShape(input) {
	if (!Array.isArray(input)) return "none";
	return input.map((item) => {
		if (!isRecord(item) || typeof item.type !== "string") return "unknown";
		if (item.type === "message" && typeof item.role === "string") return `message:${item.role}`;
		return item.type;
	}).join(",") || "none";
}
function summarizeResponsesCompactionItems(input) {
	const compactions = (Array.isArray(input) ? input : []).flatMap((item, inputIndex) => {
		if (!isRecord(item) || item.type !== "compaction") return [];
		return [{
			idHash: typeof item.id === "string" ? sha256Hex(item.id) : void 0,
			inputIndex,
			payloadHash: typeof item.encrypted_content === "string" ? sha256Hex(item.encrypted_content) : void 0
		}];
	});
	return [
		`compactionItems=${compactions.length}`,
		`compactionIdHashes=${compactions.flatMap((item) => item.idHash ?? []).join(",") || "none"}`,
		`compactionPayloadHashes=${compactions.flatMap((item) => item.payloadHash ?? []).join(",") || "none"}`,
		`compactionInputIndexes=${compactions.map((item) => item.inputIndex).join(",") || "none"}`
	];
}
function readResponsesToolDisplayName(tool) {
	if (!tool || typeof tool !== "object") return "";
	const record = tool;
	const name = record.name;
	if (typeof name === "string") return name;
	const fn = record.function;
	if (fn && typeof fn === "object") {
		const fnName = fn.name;
		if (typeof fnName === "string") return fnName;
	}
	const type = record.type;
	return typeof type === "string" && type !== "function" ? type : "";
}
function summarizeResponsesTools(tools) {
	if (!Array.isArray(tools)) return "count=0";
	const names = tools.map(readResponsesToolDisplayName).filter(Boolean);
	const mode = resolveModelPayloadDebugMode();
	const maxNames = mode === "tools" || mode === "full-redacted" ? names.length : 12;
	const label = maxNames >= names.length ? "names" : "sample";
	const shown = names.slice(0, maxNames).join(",");
	return `count=${tools.length}${shown ? ` ${label}=${shown}` : ""}`;
}
function stringifyRedactedPayload(value) {
	try {
		const encoded = JSON.stringify(value, (key, child) => key === "encrypted_content" ? "<opaque data omitted>" : child);
		if (!encoded) return "<empty>";
		const redacted = redactSensitiveText(encoded);
		return redacted.length > 8e3 ? `${truncateUtf16Safe(redacted, 8e3)}…<truncated>` : redacted;
	} catch {
		return "<unserializable>";
	}
}
function stringifyRedactedEvent(value) {
	const redacted = stringifyRedactedPayload(value);
	return redacted.length > 2e3 ? `${truncateUtf16Safe(redacted, 2e3)}…<truncated>` : redacted;
}
const RESPONSE_FAILED_FAILURE_FIELD_KEYS = [
	"error",
	"incomplete_details",
	"status_details",
	"failure_reason",
	"last_error",
	"provider_error",
	"error_details"
];
function buildResponsesFailedEventSummary(message, responseId, code, observation) {
	return {
		message,
		...responseId ? { responseId } : {},
		...code ? { code } : {},
		...observation ? { observation } : {}
	};
}
function isResponseFailedIdentifierKey(key) {
	const normalized = key.replace(/[-_\s]/g, "").toLowerCase();
	return normalized.includes("request") && normalized.endsWith("id") || normalized.includes("provider") && normalized.endsWith("id");
}
function collectResponseFailedIdentifierHashes(input) {
	const out = [];
	const seen = /* @__PURE__ */ new WeakSet();
	const visit = (value, path, depth, identifierKey) => {
		if (out.length >= 12 || depth > 4 || !value || typeof value !== "object" || seen.has(value)) return;
		seen.add(value);
		const entries = Array.isArray(value) ? value.entries() : Object.entries(value);
		for (const [key, child] of entries) {
			if (out.length >= 12 || typeof key === "number" && key >= 8) break;
			const childPath = typeof key === "number" ? `${path}[${key}]` : path ? `${path}.${key}` : key;
			const childIdentifierKey = typeof key === "number" ? identifierKey : key;
			const isIdentifier = isResponseFailedIdentifierKey(childIdentifierKey);
			const childString = typeof child === "string" || typeof child === "number" ? String(child).trim() : "";
			if (isIdentifier && childString) out.push(`${childPath}=${redactIdentifier(childString, { len: 12 })}`);
			else visit(child, childPath, depth + 1, isIdentifier ? childIdentifierKey : "");
		}
	};
	visit(input, "", 0, "");
	return out;
}
function redactResponseFailedDiagnosticValue(input) {
	const seen = /* @__PURE__ */ new WeakSet();
	const redact = (value, key, depth) => {
		if (typeof value === "string" || typeof value === "number") return key && isResponseFailedIdentifierKey(key) ? redactIdentifier(String(value), { len: 12 }) : value;
		if (depth > 6 || !value || typeof value !== "object") return value;
		if (seen.has(value)) return "<circular>";
		seen.add(value);
		if (Array.isArray(value)) return value.slice(0, 16).map((item) => redact(item, key, depth + 1));
		const out = {};
		for (const [childKey, child] of Object.entries(value)) out[childKey] = redact(child, childKey, depth + 1);
		return out;
	};
	return redact(input, "", 0);
}
function buildResponsesFailedFailureFields(response) {
	if (!response) return {};
	const fields = {};
	for (const key of RESPONSE_FAILED_FAILURE_FIELD_KEYS) if (response[key] !== void 0 && response[key] !== null) fields[key] = response[key];
	return fields;
}
function buildResponsesFailedNoDetailsObservation(event, model, response = isRecord(event.response) ? event.response : void 0) {
	const failureFields = redactResponseFailedDiagnosticValue(buildResponsesFailedFailureFields(response));
	const metadataKeys = isRecord(response?.metadata) ? Object.keys(response.metadata).toSorted() : [];
	const responsePreview = {
		id: stringifyUnknown(response?.id),
		status: stringifyUnknown(response?.status),
		model: stringifyUnknown(response?.model),
		object: stringifyUnknown(response?.object),
		failureFields,
		metadataKeys
	};
	return {
		event: "openai_responses_response_failed_without_details",
		provider: model.provider,
		api: model.api,
		transportModel: model.id,
		providerRuntimeFailureKind: "no_error_details",
		responseId: responsePreview.id,
		responseStatus: responsePreview.status,
		responseModel: responsePreview.model,
		responseObject: responsePreview.object,
		metadataKeys,
		requestIdHashes: collectResponseFailedIdentifierHashes(event),
		failureFieldsPreview: stringifyRedactedEvent(failureFields),
		responsePreview: stringifyRedactedEvent(responsePreview)
	};
}
function summarizeResponsesFailedNoDetailsObservation(observation) {
	const requestIds = observation.requestIdHashes.join(",");
	const metadataKeys = observation.metadataKeys.join(",");
	return `responseId=${safeDebugValue(observation.responseId || void 0)} responseStatus=${safeDebugValue(observation.responseStatus || void 0)} responseModel=${safeDebugValue(observation.responseModel || void 0)} requestIds=${requestIds || "none"} metadataKeys=${metadataKeys || "none"} failureFields=${observation.failureFieldsPreview}`;
}
function normalizeResponsesFailedEvent(event, model) {
	const response = isRecord(event.response) ? event.response : void 0;
	const responseId = stringifyUnknown(response?.id) || void 0;
	const error = isRecord(response?.error) ? response.error : void 0;
	if (error) {
		const code = stringifyUnknown(error.code).trim();
		const message = stringifyUnknown(error.message).trim();
		if (code || message) return buildResponsesFailedEventSummary(`${code || "unknown"}: ${message || "no message"}`, responseId, code || void 0);
	}
	const incompleteReason = stringifyUnknown((isRecord(response?.incomplete_details) ? response.incomplete_details : void 0)?.reason);
	if (incompleteReason) return buildResponsesFailedEventSummary(`incomplete: ${incompleteReason}`, responseId);
	return buildResponsesFailedEventSummary(RESPONSE_FAILED_NO_DETAILS_MESSAGE, responseId, void 0, buildResponsesFailedNoDetailsObservation(event, model, response));
}
var ResponsesStreamFailure = class extends Error {
	constructor(failure, response) {
		super(failure.message);
		this.name = "ResponsesStreamFailure";
		this.responseId = failure.responseId;
		this.response = response;
		this.code = failure.code;
		this.observation = failure.observation;
	}
};
function logResponsesFailedNoDetails(observation) {
	log.warn(`[responses] response.failed missing error details provider=${observation.provider} api=${observation.api} model=${observation.transportModel} ` + summarizeResponsesFailedNoDetailsObservation(observation), observation);
}
function summarizeResponsesPayload(params) {
	if (!params || typeof params !== "object") return "payload=non-object";
	const record = params;
	const input = record.input;
	const reasoning = record.reasoning && typeof record.reasoning === "object" ? record.reasoning : void 0;
	const text = record.text && typeof record.text === "object" ? record.text : void 0;
	const parts = [
		`fields=${Object.keys(record).toSorted().join(",")}`,
		`model=${safeDebugValue(record.model)}`,
		`stream=${safeDebugValue(record.stream)}`,
		`inputItems=${Array.isArray(input) ? input.length : typeof input}`,
		`inputItemShape=${responseInputItemShape(input)}`,
		`inputRoles=${responseInputRoles(input) || "none"}`,
		`inputTextChars=${responseInputTextChars(input)}`,
		`tools=${summarizeResponsesTools(record.tools)}`,
		`reasoningEffort=${safeDebugValue(reasoning?.effort)}`,
		`reasoningSummary=${safeDebugValue(reasoning?.summary)}`,
		`textVerbosity=${safeDebugValue(text?.verbosity)}`,
		`serviceTier=${safeDebugValue(record.service_tier)}`,
		...summarizeResponsesCompactionItems(input),
		`store=${safeDebugValue(record.store)}`,
		`promptCacheKey=${record.prompt_cache_key === void 0 ? "absent" : "present"}`,
		`metadataKeys=${record.metadata && typeof record.metadata === "object" ? Object.keys(record.metadata).toSorted().join(",") : "none"}`
	];
	if (resolveModelPayloadDebugMode() === "full-redacted") parts.push(`payload=${stringifyRedactedPayload(record)}`);
	return parts.join(" ");
}
function summarizeOpenAITransportError(error, signal) {
	if (!error || typeof error !== "object") return `type=${typeof error} message=${safeDebugValue(error)}`;
	const record = error;
	const cause = record.cause && typeof record.cause === "object" ? record.cause : void 0;
	const parts = [
		`name=${safeDebugValue(record.name)}`,
		`status=${safeDebugValue(record.status)}`,
		`code=${safeDebugValue(record.code)}`,
		`type=${safeDebugValue(record.type)}`,
		`causeName=${safeDebugValue(cause?.name)}`,
		`causeCode=${safeDebugValue(cause?.code)}`,
		`message=${error instanceof Error ? error.message : safeDebugValue(error)}`
	];
	if (signal?.aborted) {
		const reason = isRecord(signal.reason) ? signal.reason : void 0;
		let abortReason = reason?.name === "TimeoutError" ? "request_deadline" : "caller_abort";
		switch (reason?.code ?? reason?.name) {
			case "LlmIdleTimeoutError":
				abortReason = "idle_timeout";
				break;
			case "LlmNoProgressError":
				abortReason = "no_progress";
				break;
			case "FirstStreamEventTimeoutError":
				abortReason = "first_event_timeout";
				break;
			case "OPENCLAW_SESSION_WATCHDOG":
				abortReason = "session_watchdog";
				break;
			case "degenerate_output":
				abortReason = "degenerate_output";
				break;
			case "OPENCLAW_RESTART_ABORT":
			case "ERR_STALE_GATEWAY_LIFECYCLE":
				abortReason = "restart";
				break;
			case "AGENT_RUN_SUPERSEDED_ABORT": abortReason = "superseded";
		}
		parts.push(`abortReason=${abortReason}`);
	}
	return parts.join(" ");
}
//#endregion
//#region packages/ai/src/transports/openai-responses-replay-internal.ts
function isAsyncIterable(value) {
	return (typeof value === "object" && value !== null || typeof value === "function") && Symbol.asyncIterator in value;
}
function readResponsesRecoveryEvent(event) {
	const record = isRecord(event) ? event : void 0;
	const response = isRecord(record?.response) ? record.response : void 0;
	return {
		failure: record?.type === "response.failed" ? response?.error : record?.type === "error" ? record.error ?? record : void 0,
		hasResponseOutput: Array.isArray(response?.output) && response.output.length > 0,
		isPrelude: record !== void 0 && [
			"response.created",
			"response.in_progress",
			"response.queued"
		].includes(String(record.type))
	};
}
function isInvalidEncryptedContentError(error) {
	if (!error || typeof error !== "object") return false;
	const record = error;
	if (record.code === "invalid_encrypted_content" || record.code === "thinking_signature_invalid") return true;
	const message = typeof record.message === "string" ? record.message.toLowerCase() : "";
	return message.includes("invalid_encrypted_content") || message.includes("thinking_signature_invalid") || (record.status === 400 || record.status == null && /(?:^|[\s(])400(?:[\s):]|$)/.test(message)) && (message.includes("could not decrypt the provided encrypted_content") || message.includes("encrypted content") && (message.includes("could not be verified") || message.includes("could not be decrypted or parsed")));
}
function isOrphanedFunctionCallOutputError(error) {
	if (!error || typeof error !== "object") return false;
	const record = error;
	const message = typeof record.message === "string" ? record.message : "";
	return /No tool call found for function call output with call_id [A-Za-z0-9_-]+/.test(message);
}
function commitResponsesEncryptedContentAttempt(attempt, commit) {
	if (attempt.kind === "compaction-stripped") commit(attempt.rejectedCompaction);
}
function stripResponsesRequestEncryptedReasoning(request) {
	const stripped = stripEncryptedReasoningContentFields(request.input);
	return stripped === request.input ? request : {
		...request,
		input: stripped
	};
}
function stripResponsesRequestCompaction(request) {
	if (!Array.isArray(request.input)) return request;
	const input = request.input.filter((item) => !(item !== null && typeof item === "object" && item.type === "compaction"));
	return input.length === request.input.length ? request : {
		...request,
		input
	};
}
function readOpenAIResponsesCompactionRejection(request) {
	if (!Array.isArray(request.input)) return;
	const item = request.input.find((candidate) => candidate !== null && typeof candidate === "object" && candidate.type === "compaction" && typeof candidate.encrypted_content === "string");
	return item ? {
		data: item.encrypted_content,
		...typeof item.id === "string" ? { id: item.id } : {}
	} : void 0;
}
async function resolveNextResponsesEncryptedContentAttempt(attempt, error, options) {
	const orphanedFunctionOutput = isOrphanedFunctionCallOutputError(error);
	if (!isInvalidEncryptedContentError(error) && !orphanedFunctionOutput || attempt.kind === "compaction-stripped") return;
	if (!orphanedFunctionOutput && (attempt.kind === "initial" || attempt.kind === "continuation-rejected")) {
		const reasoningStripped = stripResponsesRequestEncryptedReasoning(attempt.request);
		if (reasoningStripped !== attempt.request) return {
			kind: "reasoning-stripped",
			request: reasoningStripped
		};
	}
	const locallyStripped = stripResponsesRequestCompaction(attempt.request);
	if (locallyStripped === attempt.request) return;
	let compactionStripped = options?.buildFullHistoryRequest ? await options.buildFullHistoryRequest() : locallyStripped;
	compactionStripped = stripResponsesRequestCompaction(compactionStripped);
	if (attempt.kind === "reasoning-stripped") compactionStripped = stripResponsesRequestEncryptedReasoning(compactionStripped);
	return {
		kind: "compaction-stripped",
		request: compactionStripped,
		rejectedCompaction: readOpenAIResponsesCompactionRejection(attempt.request)
	};
}
async function createResponsesStreamWithRecovery(params) {
	async function* streamWithTerminalDrain(response, body) {
		const reader = body.getReader();
		let terminal = false;
		try {
			const forwarded = new ReadableStream({
				async pull(controller) {
					const { done, value } = await reader.read();
					if (done) controller.close();
					else controller.enqueue(value);
				},
				cancel() {}
			}, { highWaterMark: 0 });
			const stream = Stream.fromSSEResponse(new Response(forwarded, response), new AbortController(), params.client);
			for await (const event of stream) {
				terminal ||= event?.type === "response.completed" || event?.type === "response.incomplete";
				yield event;
			}
		} finally {
			if (!terminal) {
				await reader.cancel().catch(() => void 0);
				reader.releaseLock();
			} else {
				const controller = new AbortController();
				const unregister = registerSessionResourceCleanup((sessionId) => {
					if (!sessionId) controller.abort();
				});
				const signal = AbortSignal.any([
					controller.signal,
					AbortSignal.timeout(250),
					...params.requestOptions?.signal ? [params.requestOptions.signal] : []
				]);
				const cancel = () => {
					reader.cancel().catch(() => void 0);
				};
				signal.addEventListener("abort", cancel, { once: true });
				(async () => {
					try {
						let bytes = 0;
						while (!signal.aborted && bytes < 65536) {
							const { done, value } = await reader.read();
							if (done) break;
							bytes += value.byteLength;
						}
					} catch {} finally {
						cancel();
						reader.releaseLock();
						signal.removeEventListener("abort", cancel);
						unregister();
					}
				})();
			}
		}
	}
	const encodeBody = params.encodeBody ?? prepareModelRequestBody(void 0);
	let tierCeiling;
	const limitTier = (request) => tierCeiling && (request.service_tier === "ultrafast" || tierCeiling === "default" && request.service_tier === "priority") ? {
		...request,
		service_tier: tierCeiling
	} : request;
	const recoverServiceTier = (attempt, error) => {
		if (params.requestOptions?.signal?.aborted || !supportsNativeOpenAIResponsesEndpoint(params.model)) return;
		const tier = attempt.request.service_tier;
		const next = nextResponsesServiceTier(tier, error);
		if (!next || tier !== "ultrafast" && tier !== "priority") return;
		tierCeiling = next;
		params.onServiceTierRejected?.(tier);
		log.info(`[responses] rejected ${tier} tier; retrying with ${next}`);
		return {
			...attempt,
			request: {
				...attempt.request,
				service_tier: next
			}
		};
	};
	const send = async (initialAttempt) => {
		let attempt = initialAttempt;
		for (;;) {
			const cappedRequest = limitTier(attempt.request);
			if (cappedRequest !== attempt.request) attempt = {
				kind: attempt.kind,
				request: cappedRequest,
				rejectedCompaction: attempt.rejectedCompaction
			};
			params.observePrompt?.(attempt.request, {
				egress: "responses-sdk",
				payloadVariant: attempt.kind
			});
			const bodyOptions = await encodeBody(attempt.request);
			let responseAccepted = false;
			try {
				const { data, response } = await params.client.responses.create(attempt.request, {
					...params.requestOptions,
					...bodyOptions,
					headers: {
						...bodyOptions.headers,
						...params.requestOptions?.headers
					}
				}).withResponse();
				responseAccepted = true;
				commitResponsesEncryptedContentAttempt(attempt, (checkpoint) => {
					if (checkpoint) params.onCompactionRejected?.(checkpoint);
				});
				if (!isAsyncIterable(data)) throw new Error("OpenAI Responses streaming request returned a non-stream response");
				return {
					stream: data instanceof Stream && response.body ? streamWithTerminalDrain(response, response.body) : data,
					response,
					attempt
				};
			} catch (error) {
				let nextAttempt = (!responseAccepted ? recoverServiceTier(attempt, error) : void 0) ?? await resolveNextResponsesEncryptedContentAttempt(attempt, error, { buildFullHistoryRequest: params.buildFullHistoryRequest });
				if (!nextAttempt && attempt.request.previous_response_id && error && typeof error === "object" && typeof error.status === "number" && isPreviousResponseRejection(error)) {
					const request = { ...params.buildFullHistoryRequest ? await params.buildFullHistoryRequest() : attempt.request };
					delete request.previous_response_id;
					nextAttempt = {
						kind: "continuation-rejected",
						request
					};
				}
				if (!nextAttempt) throw error;
				const retryDescription = nextAttempt.request.service_tier !== attempt.request.service_tier ? "with a slower service tier" : nextAttempt.kind === "reasoning-stripped" ? "without encrypted reasoning content" : nextAttempt.kind === "compaction-stripped" ? "without encrypted compaction content" : "full history after rejected previous_response_id";
				log.warn(`[responses] retrying ${retryDescription} provider=${params.model.provider} api=${params.model.api} model=${params.model.id}`);
				attempt = nextAttempt;
			}
		}
	};
	const result = await send({
		kind: params.initialAttemptKind ?? "initial",
		request: params.request,
		...params.initialRejectedCompaction ? { rejectedCompaction: params.initialRejectedCompaction } : {}
	});
	return { stream: { async *[Symbol.asyncIterator]() {
		let current = result;
		let outputObserved = false;
		for (;;) {
			let rejectedEvent;
			let sourceError;
			const source = current.stream;
			const providerStream = { async *[Symbol.asyncIterator]() {
				try {
					yield* source;
				} catch (error) {
					sourceError = error;
					throw error;
				}
			} };
			try {
				for await (const event of params.wrapStream?.({
					...current,
					stream: providerStream
				}) ?? providerStream) {
					const { failure, hasResponseOutput, isPrelude } = readResponsesRecoveryEvent(event);
					outputObserved ||= hasResponseOutput;
					if (isRecord(failure) && params.canRetryStream?.() === true && (isInvalidEncryptedContentError(failure) || !outputObserved && isResponsesServiceTierRejection(failure))) {
						rejectedEvent = event;
						const message = typeof failure.message === "string" ? failure.message : "";
						throw Object.assign(new Error(message), {
							code: failure.code,
							status: failure.status,
							type: failure.type,
							param: failure.param
						});
					}
					outputObserved ||= !isPrelude;
					yield event;
				}
				return;
			} catch (error) {
				const nextAttempt = params.canRetryStream?.() === true && !params.requestOptions?.signal?.aborted ? (!outputObserved && (rejectedEvent !== void 0 || sourceError === error) ? recoverServiceTier(current.attempt, error) : void 0) ?? await resolveNextResponsesEncryptedContentAttempt(current.attempt, error, { buildFullHistoryRequest: params.buildFullHistoryRequest }) : void 0;
				if (!nextAttempt) {
					if (rejectedEvent !== void 0) {
						yield rejectedEvent;
						return;
					}
					throw error;
				}
				log.warn(`[responses] retrying explicitly rejected stream provider=${params.model.provider} api=${params.model.api} model=${params.model.id}`);
				current = await send(nextAttempt);
			}
		}
	} } };
}
function resolveAzureOpenAIApiVersion(env = process.env) {
	return env.AZURE_OPENAI_API_VERSION?.trim() || "preview";
}
//#endregion
//#region packages/ai/src/providers/openai-responses-stream-compat.ts
const OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE = "output_text";
const AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE = "text";
const OPENAI_RESPONSES_OUTPUT_TEXT_DELTA_EVENT_TYPE = "response.output_text.delta";
const AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE = "response.text.delta";
function isResponsesTextContentPartType(type) {
	return type === "output_text" || type === "text";
}
function isResponsesTextDeltaEventType(type) {
	return type === "response.output_text.delta" || type === "response.text.delta";
}
function isAzureResponsesTextDeltaEventType(type) {
	return type === AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE;
}
function isAzureResponsesTextDeltaEvent(event) {
	return isAzureResponsesTextDeltaEventType(event.type) && typeof event.delta === "string";
}
function resolveResponsesMessageSnapshotCollapse(params) {
	const { prior, nextText } = params;
	if (!prior?.text || !nextText || prior.phase !== params.nextPhase) return { kind: "keep" };
	if (nextText.length > prior.text.length && nextText.startsWith(prior.text)) return {
		kind: "extend",
		text: nextText
	};
	return { kind: "keep" };
}
//#endregion
//#region packages/ai/src/transports/openai-responses-stream-slots-internal.ts
function createResponsesOutputTracker(params) {
	const outputs = /* @__PURE__ */ new Map();
	let currentEventType = "unknown";
	let providerToolObserved = false;
	let visibleTextEmitted = false;
	let terminalAllowsRetry = false;
	const identity = (item) => {
		if ((item.type === "reasoning" || item.type === "message") && item.id) return `${item.type}:${item.id}`;
		const callId = item.call_id ?? item.id;
		return item.type === "function_call" && callId ? `function_call:${callId}` : void 0;
	};
	const get = (item, outputIndex) => {
		const key = identity(item);
		const output = (outputIndex === void 0 ? void 0 : outputs.get(outputIndex)) ?? (key === void 0 ? void 0 : outputs.get(key));
		if (!output || outputIndex !== void 0 && output.outputIndex !== void 0 && output.outputIndex !== outputIndex) return;
		if (output.type !== item.type || output.callId && item.call_id && output.callId !== item.call_id) throw new ResponsesOutputIdentityError({
			outputIndex,
			expectedType: output.type,
			actualType: item.type,
			completed: output.completed,
			completedToolCall: [...outputs.values()].some((candidate) => candidate.type === "function_call" && candidate.completed),
			eventType: currentEventType,
			retrySafe: params.canRetryIdentityConflict?.() === true && !providerToolObserved && !visibleTextEmitted && terminalAllowsRetry && !params.output.content.some((block) => block.type === "text" && block.text.length > 0)
		});
		return output;
	};
	return {
		trackStream(sink) {
			return { push(event) {
				visibleTextEmitted ||= event.type === "text_delta" && event.delta.length > 0 || event.type === "text_end" && event.content.length > 0;
				sink.push(detachPartialSnapshot(event));
			} };
		},
		observeEvent(event) {
			currentEventType = event.type;
			terminalAllowsRetry = false;
			if (event.type === "response.output_item.added" || event.type === "response.output_item.done") providerToolObserved ||= isResponsesProviderTool(event.item);
			else if (event.type === "response.completed" || event.type === "response.incomplete") {
				let terminalHasRefusal = false;
				for (const item of event.response.output ?? []) {
					providerToolObserved ||= isResponsesProviderTool(item);
					terminalHasRefusal ||= item.type === "message" && (item.content ?? []).some((part) => part.type === "refusal");
				}
				terminalAllowsRetry = event.type === "response.completed" && event.response.status === "completed" && event.response.error == null && event.response.incomplete_details == null && !terminalHasRefusal;
			}
		},
		get,
		set(item, contentIndex, outputIndex, completed = false) {
			const output = get(item, outputIndex) ?? {
				type: item.type,
				contentIndex,
				completed
			};
			Object.assign(output, {
				contentIndex,
				completed
			});
			if (item.call_id) output.callId = item.call_id;
			if (outputIndex !== void 0) {
				output.outputIndex = outputIndex;
				outputs.set(outputIndex, output);
			}
			const key = identity(item);
			if (key !== void 0) outputs.set(key, output);
		}
	};
}
function appendResponsesPendingTextDelta(slot, delta, materialize) {
	const offset = slot.pendingText?.length ?? 0;
	slot.pendingText = `${slot.pendingText ?? ""}${delta}`;
	const priorText = slot.collapseCandidate?.block.text ?? "";
	if (offset >= priorText.length || priorText.startsWith(delta.slice(0, priorText.length - offset), offset)) return;
	materialize(slot);
}
function readResponsesOutputIndex(event) {
	const outputIndex = event.output_index;
	return typeof outputIndex === "number" && Number.isInteger(outputIndex) && outputIndex >= 0 ? outputIndex : void 0;
}
function createResponsesOutputSlotTracker() {
	const slots = /* @__PURE__ */ new Map();
	return {
		register(event, slot) {
			const outputIndex = readResponsesOutputIndex(event);
			if (slots.has(outputIndex)) throw new Error(outputIndex === void 0 ? "Responses stream added overlapping unindexed output items" : `Responses stream reused active output index ${outputIndex}`);
			slots.set(outputIndex, slot);
		},
		resolve(event, type) {
			const outputIndex = readResponsesOutputIndex(event);
			let slot = slots.get(outputIndex);
			if (outputIndex === void 0 && !slot) {
				const matches = [...slots.values()].filter((candidate) => candidate.type === type);
				slot = matches.length === 1 ? matches[0] : void 0;
			}
			return slot?.type === type ? slot : void 0;
		},
		get(event) {
			return slots.get(readResponsesOutputIndex(event));
		},
		resolveOutputItem(event, item) {
			if (item.type === "reasoning") return this.resolve(event, "thinking");
			if (item.type === "message") return this.resolve(event, "text");
			return readResponsesOutputIndex(event) === void 0 ? void 0 : this.get(event);
		},
		values() {
			const indexed = [...slots].filter(([index]) => index !== void 0).map(([, slot]) => slot);
			const unindexed = slots.get(void 0);
			return [.../* @__PURE__ */ new Set([...indexed, ...unindexed ? [unindexed] : []])];
		},
		forget(slot) {
			for (const [outputIndex, candidate] of slots) if (candidate === slot) slots.delete(outputIndex);
		}
	};
}
//#endregion
//#region packages/ai/src/providers/openai-responses-tool-call-tracker.ts
function readEventIdentity(event) {
	return { itemId: normalizeOptionalString(event.item_id) };
}
function readResponsesToolCallItemIdentity(item) {
	return {
		itemId: normalizeOptionalString(item.id),
		callId: normalizeOptionalString(item.call_id)
	};
}
function createResponsesToolCallTracker() {
	const indexedCalls = /* @__PURE__ */ new Map();
	const unindexedCalls = /* @__PURE__ */ new Set();
	const identitiesConflict = (state, identity) => Boolean(state.itemId && identity.itemId && state.itemId !== identity.itemId || state.callId && identity.callId && state.callId !== identity.callId);
	const sharesIdentity = (state, identity) => Boolean(state.itemId && identity.itemId && state.itemId === identity.itemId || state.callId && identity.callId && state.callId === identity.callId);
	const adoptIdentity = (state, identity) => {
		state.itemId ??= identity.itemId;
		state.callId ??= identity.callId;
		return state;
	};
	const resolveCompatible = (candidates, identity, allowUnmatchedIdentity) => {
		const uniqueCandidates = [...new Set(candidates)];
		if (!identity.itemId && !identity.callId) return allowUnmatchedIdentity && uniqueCandidates.length === 1 ? uniqueCandidates.at(0) : void 0;
		const compatible = uniqueCandidates.filter((state) => !identitiesConflict(state, identity));
		const matches = compatible.filter((state) => sharesIdentity(state, identity));
		const matched = matches.length === 1 ? matches.at(0) : allowUnmatchedIdentity && uniqueCandidates.length === 1 ? compatible.at(0) : void 0;
		return matched ? adoptIdentity(matched, identity) : void 0;
	};
	return {
		register(event, state) {
			const outputIndex = readResponsesOutputIndex(event);
			if (outputIndex === void 0) {
				unindexedCalls.add(state);
				return;
			}
			if (indexedCalls.has(outputIndex)) throw new Error(`Responses stream reused active tool-call output index ${outputIndex}`);
			state.outputIndex = outputIndex;
			indexedCalls.set(outputIndex, state);
		},
		resolve(event, identity = readEventIdentity(event), allowUnmatchedIdentity = true) {
			const outputIndex = readResponsesOutputIndex(event);
			if (outputIndex !== void 0) {
				const indexed = indexedCalls.get(outputIndex);
				if (indexed) {
					if (indexed.callId && identity.callId && indexed.callId !== identity.callId) return;
					return adoptIdentity(indexed, identity);
				}
				const unindexed = resolveCompatible(unindexedCalls, identity, allowUnmatchedIdentity);
				if (unindexed) {
					unindexedCalls.delete(unindexed);
					unindexed.outputIndex = outputIndex;
					indexedCalls.set(outputIndex, unindexed);
				}
				return unindexed;
			}
			return resolveCompatible([...indexedCalls.values(), ...unindexedCalls], identity, allowUnmatchedIdentity);
		},
		forget(toolCall) {
			for (const [outputIndex, tracked] of indexedCalls) if (tracked === toolCall) indexedCalls.delete(outputIndex);
			unindexedCalls.delete(toolCall);
		},
		markArgumentsUnreliable() {
			for (const toolCall of /* @__PURE__ */ new Set([...indexedCalls.values(), ...unindexedCalls])) toolCall.argumentStreamReliable = false;
		},
		hasActive() {
			return indexedCalls.size > 0 || unindexedCalls.size > 0;
		},
		values() {
			return [.../* @__PURE__ */ new Set([...indexedCalls.values(), ...unindexedCalls])];
		},
		hasExactlyActive(expected) {
			const active = /* @__PURE__ */ new Set([...indexedCalls.values(), ...unindexedCalls]);
			return active.size === expected.length && expected.every((state) => active.has(state));
		}
	};
}
//#endregion
//#region packages/ai/src/transports/openai-responses-stream-observer-internal.ts
const STRING_DELTA_EVENTS = /* @__PURE__ */ new Set([
	"response.function_call_arguments.delta",
	"response.output_text.delta",
	"response.reasoning_summary_text.delta",
	"response.reasoning_text.delta",
	"response.refusal.delta",
	"response.text.delta"
]);
async function* adaptResponsesStream(stream, signal) {
	for await (const event of iterateModelStream(stream, signal)) {
		if (!isRecord(event) || typeof event.type !== "string") throw new Error("Responses stream delivered a malformed event without a string type");
		if (STRING_DELTA_EVENTS.has(event.type) && typeof event.delta !== "string") throw new Error(`Responses stream delivered malformed ${event.type} delta`);
		if ((event.type === "response.output_item.added" || event.type === "response.output_item.done") && !isRecord(event.item)) throw new Error(`Responses stream delivered malformed ${event.type} item`);
		if ((event.type === "response.created" || event.type === "response.completed" || event.type === "response.incomplete" || event.type === "response.failed") && !isRecord(event.response)) throw new Error(`Responses stream delivered malformed ${event.type} response`);
		yield event;
	}
}
async function* observeResponsesStream(stream, model, requestStartedAt, request, transport = "sse") {
	const startedAt = Date.now();
	const eventTypes = /* @__PURE__ */ new Map();
	let eventCount = 0;
	let responseId;
	let servedTier;
	let outputTokens;
	let reasoningTokens;
	let terminalType;
	let incompleteReason;
	const requestDetails = `transport=${transport} requestedTier=${request?.service_tier ?? "unspecified"} max_output_tokens=${request?.max_output_tokens ?? "provider-default"}`;
	emitModelTransportDebug(log, `[responses] stream_start provider=${model.provider} api=${model.api} model=${model.id} ${requestDetails}`);
	try {
		for await (const event of stream) {
			const record = isRecord(event) ? event : void 0;
			const type = typeof record?.type === "string" ? record.type : "unknown";
			const response = isRecord(record?.response) ? record.response : void 0;
			if (typeof response?.id === "string") responseId = response.id;
			if (typeof response?.service_tier === "string") servedTier = response.service_tier;
			if (isRecord(response?.usage)) {
				if (typeof response.usage.output_tokens === "number") outputTokens = response.usage.output_tokens;
				const details = response.usage.output_tokens_details;
				if (isRecord(details) && typeof details.reasoning_tokens === "number") reasoningTokens = details.reasoning_tokens;
			}
			if (type === "response.completed" || type === "response.incomplete" || type === "response.failed") {
				terminalType = type;
				const details = response?.incomplete_details;
				if (isRecord(details) && typeof details.reason === "string") incompleteReason = details.reason;
			}
			eventCount += 1;
			eventTypes.set(type, (eventTypes.get(type) ?? 0) + 1);
			if (eventCount === 1) emitModelTransportDebug(log, `[responses] first_event provider=${model.provider} api=${model.api} model=${model.id} elapsedMs=${Date.now() - (requestStartedAt ?? startedAt)} headersToEventMs=${Date.now() - startedAt} type=${type} responseId=${responseId ?? "unknown"}`);
			yield event;
		}
	} finally {
		const types = [...eventTypes].map(([type, count]) => `${type}:${count}`).join(",");
		emitModelTransportDebug(log, `[responses] stream_done provider=${model.provider} api=${model.api} model=${model.id} ${requestDetails} responseId=${responseId ?? "unknown"} servedTier=${servedTier ?? "unknown"} outputTokens=${outputTokens ?? "unknown"} reasoningTokens=${reasoningTokens ?? "unknown"} streamDurationMs=${Date.now() - startedAt} elapsedMs=${Date.now() - (requestStartedAt ?? startedAt)} terminal=${terminalType ?? "none"} incompleteReason=${incompleteReason ?? "none"} events=${eventCount} types=${types}`);
	}
}
//#endregion
//#region packages/ai/src/transports/openai-responses-stream-terminal-internal.ts
function splitToolCallId(id) {
	const separator = id.indexOf("|");
	return separator === -1 ? [id, void 0] : [id.slice(0, separator), id.slice(separator + 1)];
}
function resolveResponsesToolCallId(item, fallbackId) {
	const callId = typeof item.call_id === "string" ? item.call_id.trim() : "";
	const itemId = typeof item.id === "string" ? item.id.trim() : "";
	const [fallbackCallId, fallbackItemId = ""] = splitToolCallId(fallbackId ?? "");
	const resolvedCallId = callId || fallbackCallId || `call_${randomUUID().replaceAll("-", "").slice(0, 24)}`;
	const resolvedItemId = itemId || fallbackItemId;
	return resolvedItemId ? `${resolvedCallId}|${resolvedItemId}` : resolvedCallId;
}
function resolveCompletedResponsesToolCall(item, streamed) {
	if (item.status && item.status !== "completed") throw new IncompleteToolCallError("Responses stream completed with an incomplete terminal tool call");
	const streamedName = streamed?.name?.trim() || void 0;
	const completedName = typeof item.name === "string" ? item.name.trim() || void 0 : void 0;
	if (streamedName && completedName && streamedName !== completedName) throw new Error(`Responses stream changed tool-call function name from ${streamedName} to ${completedName}`);
	const name = completedName ?? streamedName;
	if (!name) throw new Error("Responses stream completed tool call without a function name");
	return {
		name,
		arguments: parseTerminalToolCallArguments(streamed?.arguments ?? item.arguments, "Responses stream completed tool call with invalid JSON arguments")
	};
}
function createResponsesTerminalController(params) {
	const { output, stream, model, options } = params;
	const blocks = output.content;
	const pendingReasoning = /* @__PURE__ */ new Set();
	const deferredToolCompletions = [];
	const recordPendingReasoning = (contentIndex) => {
		pendingReasoning.add(contentIndex);
	};
	const releaseDeferredToolCompletions = () => {
		for (const event of deferredToolCompletions) stream.push(event);
		deferredToolCompletions.length = 0;
		pendingReasoning.clear();
	};
	let rejectedToolCallId;
	const recordIncompleteToolCall = (event, item) => {
		rejectedToolCallId = params.toolCalls.resolve(event, readResponsesToolCallItemIdentity(item))?.block.id ?? (item.call_id ? resolveResponsesToolCallId(item) : void 0);
	};
	const settleReasoning = (items) => {
		for (const [outputIndex, item] of items.entries()) {
			if (item.type !== "reasoning") continue;
			const tracked = params.outputs.get(item, outputIndex);
			const block = tracked && blocks[tracked.contentIndex];
			if (block?.type !== "thinking") continue;
			block.thinkingSignature = JSON.stringify(normalizeOpenAIResponsesReasoningReplayItem(item, model.api));
			if (item.encrypted_content && options?.reasoningReplayMetadata) Object.assign(block, { [OPENAI_RESPONSES_REASONING_REPLAY_BLOCK_META_KEY]: options.reasoningReplayMetadata });
		}
	};
	const appendText = (item, initialIndex) => {
		let contentIndex = initialIndex;
		const text = (Array.isArray(item.content) ? item.content : []).map((part) => {
			const content = part;
			return content.type === "output_text" || content.type === "text" ? content.text ?? "" : content.refusal ?? "";
		}).join("");
		const block = contentIndex === void 0 ? void 0 : blocks[contentIndex];
		const started = block?.type === "text" ? block : void 0;
		if (!text && !started) return;
		const phase = item.phase ?? void 0;
		if (started && contentIndex !== void 0) {
			const previousText = started.text;
			started.text = text;
			started.textSignature = encodeTextSignatureV1(item.id, phase);
			params.setLastTextBlock({
				block: started,
				index: contentIndex,
				phase
			});
			if (text.startsWith(previousText)) {
				const delta = text.slice(previousText.length);
				if (delta) stream.push({
					type: "text_delta",
					contentIndex,
					delta
				});
			}
		} else {
			const previous = params.getLastTextBlock();
			const collapse = resolveResponsesMessageSnapshotCollapse({
				prior: previous && {
					text: previous.block.text,
					phase: previous.phase
				},
				nextText: text,
				nextPhase: phase
			});
			if (collapse.kind === "extend" && previous) {
				previous.block.text = collapse.text;
				previous.block.textSignature = encodeTextSignatureV1(item.id, phase);
				contentIndex = previous.index;
			} else {
				const newBlock = {
					type: "text",
					text,
					textSignature: encodeTextSignatureV1(item.id, phase)
				};
				blocks.push(newBlock);
				contentIndex = blocks.length - 1;
				params.setLastTextBlock({
					block: newBlock,
					index: contentIndex,
					phase
				});
				stream.push({
					type: "text_start",
					contentIndex,
					partial: output
				});
			}
		}
		stream.push({
			type: "text_end",
			contentIndex,
			content: text,
			partial: output
		});
		return contentIndex;
	};
	const emitToolCallCompletion = (item, outputIndex, started, validated) => {
		const completed = {
			id: resolveResponsesToolCallId(item, started?.block.id),
			...validated
		};
		const toolCall = started ? Object.assign(started.block, completed) : {
			type: "toolCall",
			...completed
		};
		delete toolCall.partialJson;
		const contentIndex = started?.contentIndex ?? blocks.length;
		if (!started) {
			blocks.push(toolCall);
			stream.push({
				type: "toolcall_start",
				contentIndex,
				partial: output
			});
		}
		params.outputs.set(item, contentIndex, outputIndex, true);
		const completion = {
			type: "toolcall_end",
			contentIndex,
			toolCall,
			partial: output
		};
		if (toolCall.async) {
			for (const index of pendingReasoning) if (index < contentIndex) {
				deferredToolCompletions.push(completion);
				return;
			}
		}
		stream.push(completion);
	};
	const recoverTerminalOutput = (items, completeToolCall) => {
		let hasCompletedLaterOutput = false;
		for (const [outputIndex, item] of [...items.entries()].toReversed()) {
			const tracked = params.outputs.get(item, outputIndex);
			if (item.type === "reasoning") {
				hasCompletedLaterOutput ||= tracked !== void 0;
				continue;
			}
			if (item.type !== "message" && item.type !== "function_call") continue;
			if (tracked) {
				hasCompletedLaterOutput = true;
				continue;
			}
			if (item.type === "function_call" && !completeToolCall) continue;
			if (hasCompletedLaterOutput) throw new Error("Responses stream omitted an output item before completed output");
		}
		for (const [terminalIndex, item] of items.entries()) if (item.type === "message") {
			const tracked = params.outputs.get(item, terminalIndex);
			if (tracked?.completed) continue;
			const appendedIndex = appendText(item, tracked?.contentIndex);
			if (appendedIndex !== void 0) params.outputs.set(item, appendedIndex, terminalIndex, true);
		} else {
			params.setLastTextBlock(null);
			const alreadyCapturedCompaction = item.type === "compaction" && output.providerReplay?.type === "openai-responses-compaction" && output.providerReplay.id === item.id && output.providerReplay.data === item.encrypted_content;
			if (item.type === "compaction" && !alreadyCapturedCompaction) {
				let replayIndex = blocks.length;
				for (const [laterIndex, laterItem] of items.entries()) {
					if (laterIndex <= terminalIndex) continue;
					const laterContentIndex = params.outputs.get(laterItem, laterIndex)?.contentIndex;
					if (laterContentIndex !== void 0) {
						replayIndex = laterContentIndex;
						break;
					}
				}
				captureOpenAIResponsesCompaction(output, item, replayIndex, model, options?.reasoningReplayMetadata);
			} else if (completeToolCall && item.type === "function_call") {
				if (params.outputs.get(item, terminalIndex)?.completed) continue;
				completeToolCall(terminalIndex);
			}
		}
	};
	const finalizeTerminalFacts = (response, responseId = response.id) => {
		options?.onServiceTier?.(response.service_tier, response);
		output.responseId = responseId || output.responseId;
		output.responseModel = options?.resolveResponseModel ? options.resolveResponseModel()?.trim() || void 0 : response.model?.trim() || void 0;
		const usage = mapResponsesTerminalUsage(response.usage);
		const reasoningTokens = readResponsesReasoningTokens(response.usage);
		if (usage) output.usage = {
			...usage,
			...reasoningTokens === void 0 ? {} : { reasoningTokens },
			usageReport: { state: "available" },
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				total: 0
			}
		};
		else output.usage.usageReport = { state: "unavailable" };
		calculateCost(model, output.usage);
		if (options?.applyServiceTierPricing) {
			const tier = options.resolveServiceTier ? options.resolveServiceTier(response.service_tier, options.serviceTier) : response.service_tier ?? options.serviceTier;
			options.applyServiceTierPricing(output.usage, tier);
		}
	};
	const finalizeResponse = (response, terminalEventType, rejectedToolCall) => {
		settleReasoning(response.output ?? []);
		finalizeTerminalFacts(response);
		const terminal = resolveResponsesTerminalStopReason({
			status: response.status,
			terminalEventType,
			incompleteReason: response.incomplete_details?.reason,
			hasToolCall: blocks.some((block) => block.type === "toolCall")
		});
		output.stopReason = terminal.stopReason;
		if (terminal.errorMessage !== void 0) output.errorMessage = terminal.errorMessage;
		if (terminalEventType === "response.completed" && typeof response.end_turn === "boolean") output.endTurn = response.end_turn;
		const incompleteReason = response.incomplete_details?.reason;
		const incompleteCall = response.output?.find((item) => item.type === "function_call" && item.status && item.status !== "completed");
		const incompleteToolCallId = rejectedToolCallId ?? (terminalEventType === "response.incomplete" && !rejectedToolCall ? params.toolCalls.values()[0]?.block.id : void 0) ?? (incompleteCall?.type === "function_call" && incompleteCall.call_id ? resolveResponsesToolCallId(incompleteCall) : void 0);
		appendAssistantMessageDiagnostic(output, {
			type: "openai_responses_terminal",
			timestamp: Date.now(),
			details: {
				eventType: terminalEventType,
				stopReason: terminal.stopReason,
				...incompleteToolCallId ? { incompleteToolCallId } : {},
				...terminalEventType === "response.incomplete" ? { incompleteReason: incompleteReason === "max_output_tokens" || incompleteReason === "max_messages" || incompleteReason === "content_filter" || incompleteReason === "steered" ? incompleteReason : "unknown" } : {},
				endTurn: typeof response.end_turn === "boolean" ? response.end_turn : response.end_turn === void 0 ? "absent" : "invalid"
			}
		});
		const failure = rejectedToolCall ?? (terminalEventType === "response.incomplete" && params.toolCalls.hasActive() ? { error: new IncompleteToolCallError("Responses stream completed with unresolved tool calls") } : void 0);
		if (failure) throw output.errorMessage ? new Error(output.errorMessage) : failure.error;
	};
	return {
		finalizeResponse,
		finalizeFailedResponse: finalizeTerminalFacts,
		recordIncompleteToolCall,
		recoverTerminalOutput,
		emitToolCallCompletion,
		recordPendingReasoning,
		releaseDeferredToolCompletions
	};
}
//#endregion
//#region packages/ai/src/transports/openai-responses-stream-internal.ts
async function processResponsesStream(openaiStream, output, sink, model, options) {
	const streamingToolCalls = createResponsesToolCallTracker();
	const outputSlots = createResponsesOutputSlotTracker();
	const outputs = createResponsesOutputTracker({
		output,
		canRetryIdentityConflict: options?.canRetryIdentityConflict
	});
	const stream = outputs.trackStream(sink);
	let terminalResponse;
	let rejectedToolCall;
	let lastTextBlock = null;
	const blocks = output.content;
	const compactionTracker = createCompactionTracker(output, model, options);
	const createTextBlock = (item, text) => ({
		type: "text",
		text,
		...item.phase ? { textSignature: encodeTextSignatureV1(item.id, item.phase) } : {}
	});
	const createOutputSlot = (event, item) => {
		let slot;
		if (item.type === "reasoning") {
			slot = {
				type: "thinking",
				item,
				block: {
					type: "thinking",
					thinking: ""
				},
				contentIndex: blocks.length,
				outputIndex: readResponsesOutputIndex(event)
			};
			terminal.recordPendingReasoning(slot.contentIndex);
		} else if (item.type === "message") {
			const collapseCandidate = lastTextBlock;
			const block = collapseCandidate ? null : createTextBlock(item, "");
			slot = {
				type: "text",
				item,
				block,
				contentIndex: block ? blocks.length : void 0,
				outputIndex: readResponsesOutputIndex(event),
				pendingText: collapseCandidate ? "" : null,
				collapseCandidate
			};
		} else return;
		if (slot.block) {
			blocks.push(slot.block);
			outputs.set(slot.item, slot.contentIndex ?? blocks.length - 1, slot.outputIndex);
		}
		outputSlots.register(event, slot);
		if (slot.contentIndex !== void 0) stream.push({
			type: slot.type === "thinking" ? "thinking_start" : "text_start",
			contentIndex: slot.contentIndex,
			partial: output
		});
		return slot;
	};
	const materializeDeferredTextSlot = (slot) => {
		if (slot.block || slot.pendingText === null) return;
		const text = slot.pendingText;
		slot.block = createTextBlock(slot.item, text);
		blocks.push(slot.block);
		slot.contentIndex = blocks.length - 1;
		outputs.set(slot.item, slot.contentIndex, slot.outputIndex);
		stream.push({
			type: "text_start",
			contentIndex: slot.contentIndex,
			partial: output
		});
		if (text) stream.push({
			type: "text_delta",
			contentIndex: slot.contentIndex,
			delta: text
		});
		if (lastTextBlock === slot.collapseCandidate) lastTextBlock = null;
		slot.pendingText = null;
		slot.collapseCandidate = null;
	};
	const materializeDeferredTextSlots = (except) => {
		for (const slot of outputSlots.values()) if (slot !== except && slot.type === "text") materializeDeferredTextSlot(slot);
	};
	const appendThinkingDelta = (slot, delta) => {
		appendAssistantThinking(slot.block, delta);
		stream.push({
			type: "thinking_delta",
			contentIndex: slot.contentIndex,
			delta,
			partial: output
		});
	};
	const projectTextDelta = (slot, delta) => {
		if (slot.pendingText !== null) appendResponsesPendingTextDelta(slot, delta, materializeDeferredTextSlot);
		else if (slot.block && slot.contentIndex !== void 0) {
			slot.block.text += delta;
			stream.push({
				type: "text_delta",
				contentIndex: slot.contentIndex,
				delta
			});
		}
	};
	const terminal = createResponsesTerminalController({
		output,
		stream,
		model,
		options,
		outputs,
		toolCalls: streamingToolCalls,
		getLastTextBlock: () => lastTextBlock,
		setLastTextBlock: (block) => {
			lastTextBlock = block;
		}
	});
	const finalizeToolCall = (item, outputIndex, streamingToolCall, validated) => {
		const identity = {
			type: item.type,
			id: item.id || streamingToolCall?.itemId,
			call_id: item.call_id || streamingToolCall?.callId
		};
		const finalOutputIndex = outputIndex ?? streamingToolCall?.outputIndex;
		if (finalOutputIndex === void 0 && !identity.id && !identity.call_id) {
			if (!streamingToolCall) throw new Error("Responses stream completed tool call without an output identity");
			return;
		}
		if (streamingToolCall) {
			streamingToolCalls.forget(streamingToolCall);
			for (const slot of outputSlots.values()) if (slot.type === "toolCall" && slot.toolCall === streamingToolCall) outputSlots.forget(slot);
		}
		terminal.emitToolCallCompletion(identity, finalOutputIndex, streamingToolCall, {
			...validated,
			...options?.asyncToolExecution && isRecord(item) && item.async === true ? { async: true } : {}
		});
	};
	const prepareTerminalToolCalls = (items) => {
		const prepared = /* @__PURE__ */ new Map();
		const recovered = [];
		const callIds = /* @__PURE__ */ new Set();
		const allowUnmatchedIdentity = items.filter((item, index) => item.type === "function_call" && !outputs.get(item, index)?.completed).length === 1;
		for (const [outputIndex, item] of items.entries()) {
			const tracked = outputs.get(item, outputIndex);
			if (item.type !== "function_call") continue;
			if (item.call_id && callIds.has(item.call_id)) throw new Error("Responses stream repeated a terminal tool-call identity");
			if (item.call_id) callIds.add(item.call_id);
			if (tracked?.completed) continue;
			const state = streamingToolCalls.resolve({ output_index: outputIndex }, readResponsesToolCallItemIdentity(item), allowUnmatchedIdentity);
			if (tracked && !state) throw new Error("Responses stream completed with unresolved tool calls");
			const validated = resolveCompletedResponsesToolCall(item, { name: state?.providerName });
			if (state) recovered.push(state);
			prepared.set(outputIndex, () => finalizeToolCall(item, outputIndex, state, validated));
		}
		if (!streamingToolCalls.hasExactlyActive(recovered)) throw new Error("Responses stream completed with unresolved tool calls");
		return (outputIndex) => {
			const complete = prepared.get(outputIndex);
			if (!complete) throw new Error("Responses stream completed with unresolved tool calls");
			complete();
		};
	};
	const guardedStream = adaptResponsesStream(withFirstStreamEventTimeout(openaiStream, {
		provider: model.provider,
		api: model.api,
		model: model.id,
		timeoutMs: options?.firstEventTimeoutMs ?? 0,
		stage: "responses",
		abort: options?.abortFirstEventStream,
		onTimeout: options?.onFirstEventTimeout,
		hint: "The provider may be stalled while parsing the tool payload; retry with a smaller tool surface or enable OPENCLAW_DEBUG_MODEL_PAYLOAD=tools to inspect exposed tools."
	}), options?.signal);
	try {
		for await (const event of guardedStream) {
			outputs.observeEvent(event);
			notifyLlmRequestActivity(options?.signal);
			if (event.type === "response.output_item.done" && event.item.type === "function_call" && event.item.status && event.item.status !== "completed" && !rejectedToolCall) try {
				resolveCompletedResponsesToolCall(event.item);
			} catch (error) {
				terminal.recordIncompleteToolCall(event, event.item);
				rejectedToolCall = { error };
			}
			if (rejectedToolCall && event.type !== "response.completed" && event.type !== "response.incomplete" && event.type !== "response.failed" && event.type !== "error") continue;
			if (event.type === "response.created") output.responseId = event.response.id;
			else if (event.type === "response.output_item.added") {
				materializeDeferredTextSlots();
				const item = event.item;
				compactionTracker.added(item, blocks.length);
				if (item.type !== "message") lastTextBlock = null;
				if (item.type === "reasoning" || item.type === "message") createOutputSlot(event, item);
				else if (item.type === "function_call") {
					const toolCallBlock = {
						type: "toolCall",
						id: resolveResponsesToolCallId(item),
						name: typeof item.name === "string" ? item.name.trim() : "",
						arguments: {},
						partialJson: item.arguments || ""
					};
					const contentIndex = output.content.length;
					const toolCallState = {
						block: toolCallBlock,
						providerName: toolCallBlock.name,
						contentIndex,
						argumentStreamReliable: true,
						argumentsStreamed: false,
						previewSchedule: createToolArgumentPreviewSchedule(),
						trailingWhitespaceChars: countToolCallTrailingWhitespace(toolCallBlock.partialJson),
						...readResponsesToolCallItemIdentity(item)
					};
					streamingToolCalls.register(event, toolCallState);
					if (readResponsesOutputIndex(event) !== void 0) outputSlots.register(event, {
						type: "toolCall",
						toolCall: toolCallState
					});
					output.content.push(toolCallBlock);
					outputs.set(item, contentIndex, readResponsesOutputIndex(event));
					stream.push({
						type: "toolcall_start",
						contentIndex,
						partial: output
					});
				}
			} else if (event.type === "response.reasoning_summary_part.added") {
				const slot = outputSlots.resolve(event, "thinking");
				if (!slot) continue;
				slot.item.summary = slot.item.summary || [];
				slot.item.summary.push(event.part);
			} else if (event.type === "response.reasoning_summary_text.delta" || event.type === "response.reasoning_summary_part.done" || event.type === "response.reasoning_text.delta") {
				const slot = outputSlots.resolve(event, "thinking");
				if (!slot) continue;
				const delta = event.type === "response.reasoning_summary_part.done" ? "\n\n" : event.delta;
				if (event.type !== "response.reasoning_text.delta") {
					slot.item.summary = slot.item.summary || [];
					const lastPart = slot.item.summary[slot.item.summary.length - 1];
					if (!lastPart) continue;
					lastPart.text += delta;
				}
				appendThinkingDelta(slot, delta);
			} else if (event.type === "response.content_part.added") {
				const slot = outputSlots.resolve(event, "text");
				if (!slot) continue;
				slot.item.content = slot.item.content || [];
				if (event.part.type === "output_text" || event.part.type === "text" || event.part.type === "refusal") slot.item.content.push(event.part);
			} else if (event.type === "response.output_text.delta" || isAzureResponsesTextDeltaEvent(event) || event.type === "response.refusal.delta") {
				const slot = outputSlots.resolve(event, "text");
				if (!slot) continue;
				slot.item.content ||= [];
				let lastPart = slot.item.content[slot.item.content.length - 1];
				if (event.type === "response.refusal.delta") {
					if (lastPart?.type !== "refusal") {
						lastPart = {
							type: "refusal",
							refusal: ""
						};
						slot.item.content.push(lastPart);
					}
					lastPart.refusal += event.delta;
				} else {
					const azure = isAzureResponsesTextDeltaEvent(event);
					if (!isResponsesTextContentPartType(lastPart?.type) || azure && lastPart.type !== "text") {
						lastPart = azure ? {
							type: "text",
							text: ""
						} : {
							type: "output_text",
							text: "",
							annotations: []
						};
						slot.item.content.push(lastPart);
					}
					lastPart.text += event.delta;
				}
				projectTextDelta(slot, event.delta);
			} else if (event.type === "response.function_call_arguments.delta" || event.type === "response.function_call_arguments.done") {
				const toolCall = streamingToolCalls.resolve(event);
				if (!toolCall) {
					if (streamingToolCalls.hasActive()) streamingToolCalls.markArgumentsUnreliable();
					continue;
				}
				let delta;
				if (event.type === "response.function_call_arguments.delta") {
					toolCall.trailingWhitespaceChars = countToolCallTrailingWhitespace(event.delta, toolCall.trailingWhitespaceChars);
					toolCall.block.partialJson += event.delta;
					toolCall.argumentsStreamed = true;
					if (toolCall.previewSchedule(toolCall.block.partialJson.length)) toolCall.block.arguments = parseStreamingJson(toolCall.block.partialJson);
					delta = event.delta;
				} else {
					const previousPartialJson = toolCall.block.partialJson;
					const doneArguments = typeof event.arguments === "string" ? event.arguments : void 0;
					if (doneArguments !== void 0 && (doneArguments.length > 0 || previousPartialJson === "")) {
						toolCall.trailingWhitespaceChars = countToolCallTrailingWhitespace(doneArguments);
						toolCall.block.partialJson = doneArguments;
						toolCall.block.arguments = parseStreamingJson(toolCall.block.partialJson);
						toolCall.argumentStreamReliable = true;
						toolCall.argumentsStreamed = true;
					}
					if (doneArguments?.startsWith(previousPartialJson)) delta = doneArguments.slice(previousPartialJson.length) || void 0;
				}
				if (delta !== void 0) stream.push({
					type: "toolcall_delta",
					contentIndex: toolCall.contentIndex,
					delta,
					partial: output
				});
			} else if (event.type === "response.output_item.done") {
				const item = event.item;
				if (item.type !== "message") lastTextBlock = null;
				const existingOutputSlot = outputSlots.resolveOutputItem(event, item);
				materializeDeferredTextSlots(existingOutputSlot);
				const outputSlot = existingOutputSlot ?? createOutputSlot(event, item);
				compactionTracker.completed(item, blocks.length);
				if (item.type === "reasoning" && outputSlot?.type === "thinking") {
					const summaryText = item.summary?.map((s) => s.text).join("\n\n") || "";
					const contentText = item.content?.map((c) => c.text).join("\n\n") || "";
					outputSlot.block.thinking = summaryText || contentText || outputSlot.block.thinking;
					outputSlot.block.thinkingSignature = JSON.stringify(normalizeOpenAIResponsesReasoningReplayItem(item, model.api));
					outputs.set(item, outputSlot.contentIndex, readResponsesOutputIndex(event) ?? outputSlot.outputIndex, true);
					if (item.encrypted_content && options?.reasoningReplayMetadata) outputSlot.block[OPENAI_RESPONSES_REASONING_REPLAY_BLOCK_META_KEY] = options.reasoningReplayMetadata;
					stream.push({
						type: "thinking_end",
						contentIndex: outputSlot.contentIndex,
						content: outputSlot.block.thinking,
						partial: output
					});
					outputSlots.forget(outputSlot);
				} else if (item.type === "message" && outputSlot?.type === "text" && (outputSlot.block || outputSlot.pendingText !== null)) {
					const streamedText = outputSlot.pendingText ?? outputSlot.block?.text ?? "";
					const finalText = item.content == null ? streamedText : item.content.map((c) => c.type === "output_text" || c.type === "text" ? c.text : c.refusal).join("");
					const phase = item.phase ?? void 0;
					const collapse = outputSlot.pendingText !== null ? resolveResponsesMessageSnapshotCollapse({
						prior: outputSlot.collapseCandidate && {
							text: outputSlot.collapseCandidate.block.text,
							phase: outputSlot.collapseCandidate.phase
						},
						nextText: finalText,
						nextPhase: phase
					}) : { kind: "keep" };
					outputSlot.pendingText = null;
					if (collapse.kind === "extend" && outputSlot.collapseCandidate) {
						outputSlot.collapseCandidate.block.text = collapse.text;
						outputSlot.collapseCandidate.block.textSignature = encodeTextSignatureV1(item.id, phase);
						stream.push({
							type: "text_end",
							contentIndex: outputSlot.collapseCandidate.index,
							content: collapse.text,
							partial: output
						});
						lastTextBlock = outputSlot.collapseCandidate;
						outputs.set(item, outputSlot.collapseCandidate.index, readResponsesOutputIndex(event) ?? outputSlot.outputIndex, true);
					} else {
						if (!outputSlot.block) {
							outputSlot.block = createTextBlock(item, "");
							blocks.push(outputSlot.block);
							outputSlot.contentIndex = blocks.length - 1;
							stream.push({
								type: "text_start",
								contentIndex: outputSlot.contentIndex,
								partial: output
							});
						}
						outputSlot.block.text = finalText;
						outputSlot.block.textSignature = encodeTextSignatureV1(item.id, phase);
						const contentIndex = outputSlot.contentIndex;
						if (contentIndex === void 0) throw new Error("Responses stream finalized text without a content index");
						lastTextBlock = {
							block: outputSlot.block,
							index: contentIndex,
							phase
						};
						outputs.set(item, contentIndex, readResponsesOutputIndex(event) ?? outputSlot.outputIndex, true);
						stream.push({
							type: "text_end",
							contentIndex,
							content: outputSlot.block.text,
							partial: output
						});
					}
					outputSlots.forget(outputSlot);
				} else if (item.type === "function_call") {
					if (outputs.get(item, readResponsesOutputIndex(event))?.completed) continue;
					const streamingToolCall = streamingToolCalls.resolve(event, readResponsesToolCallItemIdentity(item));
					if (!streamingToolCall && streamingToolCalls.hasActive()) continue;
					const completedArguments = typeof item.arguments === "string" ? item.arguments : void 0;
					if (streamingToolCall && !streamingToolCall.argumentStreamReliable && !completedArguments) continue;
					const streamedArguments = streamingToolCall?.block.partialJson || "";
					const parsedStreamedArguments = streamingToolCall?.argumentStreamReliable && streamingToolCall?.argumentsStreamed && streamedArguments.length > 0 && completedArguments !== void 0 && streamedArguments !== completedArguments ? parseJsonObjectPreservingUnsafeIntegers(streamedArguments) : null;
					let validated;
					try {
						validated = resolveCompletedResponsesToolCall(item, {
							name: streamingToolCall?.providerName,
							arguments: parsedStreamedArguments ?? (completedArguments || streamedArguments)
						});
					} catch (error) {
						rejectedToolCall = { error };
						continue;
					}
					finalizeToolCall(item, readResponsesOutputIndex(event), streamingToolCall, validated);
				}
			} else if (event.type === "response.completed" || event.type === "response.incomplete") {
				terminal.finalizeResponse(event.response, event.type, rejectedToolCall);
				if (event.type === "response.completed" || output.stopReason === "length") {
					const items = event.response.output ?? [];
					const completeToolCall = event.type === "response.completed" ? prepareTerminalToolCalls(items) : void 0;
					terminal.recoverTerminalOutput(items, completeToolCall);
				}
				terminalResponse = event.type === "response.completed" ? event.response : null;
				if (output.stopReason === "stop" && output.content.some((block) => block.type === "toolCall")) output.stopReason = "toolUse";
				break;
			} else if (event.type === "error") {
				const details = isRecord(event) && isRecord(event.error) ? event.error : event;
				const message = readStringValue(details.message);
				const code = normalizeStringifiedOptionalString(details.code);
				throw Object.assign(new Error(message ? code ? `Error Code ${code}: ${message}` : message : "Unknown error"), {
					code: details.code,
					error: details
				});
			} else if (event.type === "response.failed") {
				const failure = normalizeResponsesFailedEvent(isRecord(event) ? event : {}, model);
				terminal.finalizeFailedResponse(event.response, failure.responseId);
				throw new ResponsesStreamFailure(failure, event.response);
			}
		}
		if (options?.signal?.aborted) throw transportAbortError(options.signal);
		if (rejectedToolCall) throw rejectedToolCall.error;
		if (streamingToolCalls.hasActive()) throw new Error("Responses stream ended with unresolved tool calls");
		if (terminalResponse === void 0) throw new Error("OpenAI Responses stream ended before a terminal response event");
		return terminalResponse ?? void 0;
	} finally {
		for (const block of output.content) if (block.type === "toolCall") delete block.partialJson;
		terminal.releaseDeferredToolCompletions();
	}
}
//#endregion
//#region packages/ai/src/providers/openai-provider-refusal.ts
/** Responses uses snake_case; the ChatGPT app-server error envelope uses camelCase. */
function readOpenAIMisalignmentReview(value, continuationSupported) {
	if (!isRecord(value)) return;
	return readProviderRefusalReview({
		explanation: value.detailed_explanation ?? value.detailedExplanation,
		errorType: value.error_type ?? value.errorType,
		...continuationSupported ? { continuation: value.steer } : {}
	});
}
//#endregion
//#region packages/ai/src/providers/openai-responses-tools.ts
/** Projects direct provider descriptors before resolving their strict policy. */
function convertResponsesToolPayload(tools, options) {
	return convertPreparedResponsesTools(prepareOpenAITools(tools), resolveResponsesStrictToolSetting(options), options?.model);
}
/** The transport has already resolved policy before descriptor projection. */
function prepareResponsesTools(tools, strictSetting, model) {
	const prepared = prepareOpenAITools(tools);
	return {
		projection: prepared.projection,
		tools: convertPreparedResponsesTools(prepared, strictSetting, model)
	};
}
function convertPreparedResponsesTools(prepared, strictSetting, model) {
	const { projection, schemas } = prepared;
	return withPreparedToolSchemaNormalization(schemas, () => {
		const strict = model ? resolveOpenAIStrictToolFlagWithDiagnostics(projection, strictSetting, {
			transport: "responses",
			model
		}) : resolveOpenAIProjectedToolsStrictToolFlag(projection, strictSetting);
		return sortPromptCacheToolsByName(projection.tools).map((tool) => {
			return prepareOpenAIFunctionTool(tool.name, tool.description, normalizeOpenAIStrictToolParameters(tool.parameters, strict === true, model?.compat), strict).responses;
		});
	});
}
function resolveResponsesStrictToolSetting(options) {
	if (options?.strict !== void 0) return options.strict;
	if (options?.model) return getAiTransportHost().resolveOpenAIStrictToolSetting(options.model, {
		transport: "stream",
		supportsStrictMode: options.supportsStrictMode ?? resolveOpenAICompletionsCompat(options.model).supportsStrictMode
	});
	return false;
}
//#endregion
//#region packages/ai/src/providers/openai-responses-shared.ts
function applyResponsesServiceTierPricing(usage, serviceTier, model) {
	let multiplier = 1;
	if (serviceTier === "flex") multiplier = .5;
	else if (serviceTier === "priority") multiplier = model.id === "gpt-5.5" ? 2.5 : 2;
	if (multiplier === 1) return;
	usage.cost.input *= multiplier;
	usage.cost.output *= multiplier;
	usage.cost.cacheRead *= multiplier;
	usage.cost.cacheWrite *= multiplier;
	usage.cost.total = usage.cost.input + usage.cost.output + usage.cost.cacheRead + usage.cost.cacheWrite;
}
function applyCommonResponsesParams(params, model, context, options, config) {
	if (options?.maxTokens) params.max_output_tokens = clampMaxTokensToModel(model, Math.max(options.maxTokens, 16));
	if (options?.temperature !== void 0 && supportsOpenAITemperature(model)) params.temperature = options.temperature;
	if (options?.responseFormat !== void 0) params.text = {
		...params.text,
		format: resolveOpenAIResponsesTextFormat(options.responseFormat)
	};
	if (context.tools) {
		const tools = convertResponsesToolPayload(context.tools, { model });
		if (tools.length > 0) params.tools = tools;
	}
	if (!model.reasoning) return;
	const requestedEffort = options?.reasoningEffort ?? (options?.reasoningSummary ? "medium" : config?.setDefaultReasoningOff ?? true ? "off" : void 0);
	const effort = requestedEffort === void 0 ? void 0 : resolveOpenAIRequestReasoning(model, requestedEffort).effort;
	if (effort === void 0) return;
	params.reasoning = { effort };
	if (effort !== "none" && (options?.reasoningEffort || options?.reasoningSummary)) {
		params.reasoning.summary = options?.reasoningSummary || "auto";
		params.include = ["reasoning.encrypted_content"];
	}
}
function cleanStreamingScratchBuffers(output) {
	for (const block of output.content) {
		delete block.index;
		if (block.type === "toolCall") delete block.partialJson;
	}
}
async function runResponsesStreamLifecycle(params) {
	const { stream, output, options } = params;
	let firstEventAbort;
	try {
		const model = params.resolveRequestModel?.(params.model) ?? params.model;
		const client = params.createClient(model);
		const encodeBody = prepareModelRequestBody(options);
		const buildRequest = async (replayMode) => {
			let request = params.buildParams(model, replayMode);
			const nextRequest = await options?.onPayload?.(request, model);
			if (nextRequest !== void 0) request = nextRequest;
			return request;
		};
		const requestParams = await buildRequest("checkpoint");
		const firstEvent = createFirstStreamEventAbortController(options?.signal);
		firstEventAbort = firstEvent;
		let started = false;
		let admittedRequest;
		let requestedTier;
		const { stream: hookedOpenAIStream } = await createResponsesStreamWithRecovery({
			client,
			request: requestParams,
			requestOptions: {
				signal: firstEvent.signal,
				...options?.timeoutMs !== void 0 ? { timeout: options.timeoutMs } : {},
				maxRetries: 0
			},
			model,
			encodeBody,
			buildFullHistoryRequest: () => buildRequest("full-history"),
			onCompactionRejected: (checkpoint) => suppressOpenAIResponsesCompaction(output, model, options, checkpoint),
			canRetryStream: () => output.content.length === 0,
			onServiceTierRejected: (tier) => responsesServiceTierObserver.reject(options, tier),
			wrapStream: ({ stream: openaiStream, response, attempt }) => {
				requestedTier = attempt.request.service_tier;
				admittedRequest = attempt.kind === "initial" ? attempt.request : void 0;
				return withProviderResponseHook({
					stream: openaiStream,
					signal: firstEvent.signal,
					abort: firstEvent.abort,
					hook: createOpenAIProviderAcceptanceHook(options, response, model),
					onReady: () => {
						if (!started) {
							started = true;
							stream.push({
								type: "start",
								partial: output
							});
						}
					}
				});
			}
		});
		const firstEventTimeoutMs = getFirstStreamEventTimeoutMs(options);
		const onFirstEventTimeout = getFirstStreamEventTimeoutHandler(options);
		const processStreamOptions = params.processStreamOptions || firstEventTimeoutMs !== void 0 || onFirstEventTimeout !== void 0 ? {
			...params.processStreamOptions,
			firstEventTimeoutMs: params.processStreamOptions?.firstEventTimeoutMs ?? firstEventTimeoutMs,
			abortFirstEventStream: params.processStreamOptions?.abortFirstEventStream ?? firstEventAbort.abort,
			onFirstEventTimeout: params.processStreamOptions?.onFirstEventTimeout ?? onFirstEventTimeout,
			signal: params.processStreamOptions?.signal ?? options?.signal
		} : void 0;
		const terminal = await processResponsesStream(hookedOpenAIStream, output, stream, model, {
			...processStreamOptions,
			resolveServiceTier: (responseTier, originalTier) => {
				const tier = requestedTier === "priority" || requestedTier === "default" ? requestedTier : originalTier;
				return processStreamOptions?.resolveServiceTier ? processStreamOptions.resolveServiceTier(responseTier, tier) : responseTier ?? tier;
			},
			onServiceTier: (responseTier, response) => responsesServiceTierObserver.observe(options, requestedTier, responseTier, response),
			canRetryIdentityConflict: () => hasOnlyResponsesFunctionTools(admittedRequest),
			reasoningReplayMetadata: buildOpenAIResponsesReasoningReplayMetadata(model, {
				sessionId: options?.sessionId,
				authProfileId: options?.authProfileId
			})
		});
		if (terminal && admittedRequest && !options?.signal?.aborted) recordResponsesContextUsage(output, model, options, admittedRequest, terminal.output, "provider");
		finalizeTransportStream({
			stream,
			output,
			signal: options?.signal
		});
	} catch (error) {
		const response = error instanceof ResponsesStreamFailure ? error.response : error;
		const rawError = isRecord(response) && isRecord(response.error) ? response.error : response;
		if (params.model.provider === "openai" && params.model.api === "openai-responses" && isRecord(rawError) && rawError.code === "misalignment_policy_violation") {
			const review = readOpenAIMisalignmentReview(rawError.misalignment, false);
			appendAssistantMessageDiagnostic(output, {
				type: "provider_refusal",
				timestamp: Date.now(),
				details: {
					provider: "openai",
					category: "misalignment",
					...review ? { review } : {}
				}
			});
		}
		failTransportStream({
			stream,
			output,
			signal: options?.signal,
			error,
			cleanup: () => cleanStreamingScratchBuffers(output)
		});
	} finally {
		firstEventAbort?.dispose();
	}
}
//#endregion
export { isConfigurationUpdate as $, isArray as $t, summarizeResponsesPayload as A, isOpenAICompletionsThinkingEnabled as At, recordResponsesInputReplay as B, formatRequestDetails as Bt, readResponsesRecoveryEvent as C, UnprocessableEntityError as Cn, reconcileOpenAIResponsesToolChoice as Ct, logResponsesFailedNoDetails as D, __classPrivateFieldSet as Dn, createOpenAIResponseHook as Dt, ResponsesStreamFailure as E, __classPrivateFieldGet as En, createOpenAIProviderAcceptanceHook as Et, convertProviderResponsesMessages as F, readOpenAICompletionsReasoningBatch as Ft, responsesContinuationPrefixFingerprint as G, redactURL as Gt, claimOpenAIResponsesHttpContinuation as H, isSensitiveQueryParameter as Ht, convertResponsesMessages as I, resolveOpenAIClientBaseUrl as It, OPENAI_RESPONSES_FUNCTION_CALL_ITEM_ID_RE as J, ReadableStreamFrom as Jt, responsesContinuationRequestFingerprint as K, encodeUTF8 as Kt, normalizeOpenAIResponsesReasoningReplayItem as L, resolvePromptCacheKey as Lt, resolveResponsesContextUsageBoundary as M, measureUtf8AppendBytes as Mt, bindResponsesInputMessage as N, parseOpenAICompletionsUsage as Nt, safeDebugValue as O, createResponseModelTracker as Ot, buildResponsesInputMessage as P, readOpenAICompletionsContentDeltas as Pt, splitOpenAIFunctionCallPairing as Q, isAbsoluteURL as Qt, resolveReplayableResponsesMessageId as R, withOpenAIErrorResponseHook as Rt, isInvalidEncryptedContentError as S, SubjectTokenProviderError as Sn, reconcileOpenAICompletionsToolChoice as St, resolveNextResponsesEncryptedContentAttempt as T, isAbortError as Tn, GEMINI_THOUGHT_SIGNATURE_VALIDATOR_SKIP as Tt, recordResponsesContinuationState as U, loggerFor as Ut, responsesInputFingerprint as V, isSensitiveHeader as Vt, resolveResponsesContinuationRequest as W, parseLogLevel as Wt, normalizeOpenAIResponsesFunctionCallId as X, getDefaultFetch as Xt, OPENAI_RESPONSES_ID_MAX_LENGTH as Y, ReadableStreamToAsyncIterable as Yt, shouldNormalizeOpenAIResponsesToolCallId as Z, hasOwn as Zt, isResponsesTextContentPartType as _, NotFoundError as _n, resolveOpenAIRequestReasoning as _t, prepareResponsesTools as a, validatePositiveInteger as an, resolveNewestOpenAIResponsesCompactionReplay as at, commitResponsesEncryptedContentAttempt as b, PermissionDeniedError as bn, prepareOpenAITools as bt, observeResponsesStream as c, APIError as cn, buildOpenAIClientHeaders as ct, AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE as d, BadRequestError as dn, enforceCodeModeResponsesToolSurface as dt, isEmptyObj as en, replayResponsesReasoningUpdates as et, AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE as f, ConflictError as fn, filterCodeModePayloadTools as ft, isAzureResponsesTextDeltaEventType as g, LengthFinishReasonError as gn, resolveOpenAIStrictToolFlagWithDiagnostics as gt, isAzureResponsesTextDeltaEvent as h, InvalidWebhookSignatureError as hn, resolveCodeModeResponsesVisibleToolNames as ht, convertResponsesToolPayload as i, safeJSON as in, captureOpenAIResponsesCompaction as it, recordResponsesContextUsage as j, log as jt, summarizeOpenAITransportError as k, detachPartialSnapshot as kt, createResponsesToolCallTracker as l, APIUserAbortError as ln, buildOpenAISdkClientOptions as lt, OPENAI_RESPONSES_OUTPUT_TEXT_DELTA_EVENT_TYPE as m, InternalServerError as mn, readCodeModePayloadToolName as mt, applyResponsesServiceTierPricing as n, isReadonlyArray as nn, CompactionReplayRefreshRequiredError as nt, readOpenAIMisalignmentReview as o, APIConnectionError as on, suppressOpenAIResponsesCompaction as ot, OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE as p, ContentFilterFinishReasonError as pn, getCompat as pt, OPENAI_RESPONSES_CALL_ID_RE as q, CancelReadableStream as qt, runResponsesStreamLifecycle as r, maybeObj as rn, buildOpenAIResponsesReasoningReplayMetadata as rt, processResponsesStream as s, APIConnectionTimeoutError as sn, assertCodeModeResponsesToolSurface as st, applyCommonResponsesParams as t, isObj as tn, supportsResponsesReasoningUpdate as tt, readResponsesToolCallItemIdentity as u, AuthenticationError as un, buildOpenAISdkRequestOptions as ut, isResponsesTextDeltaEventType as v, OAuthError as vn, resolveOpenAISimpleReasoningEffort as vt, resolveAzureOpenAIApiVersion as w, castToError as wn, toOpenAIResponsesToolChoice as wt, createResponsesStreamWithRecovery as x, RateLimitError as xn, projectOpenAITools as xt, resolveResponsesMessageSnapshotCollapse as y, OpenAIError as yn, resolveOpenAIReasoningEffortMap as yt, readResponsesInputReplayState as z, Stream as zt };
