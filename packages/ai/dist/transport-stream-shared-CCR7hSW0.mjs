import { n as createAssistantMessageDiagnostic, t as appendAssistantMessageDiagnostic } from "./diagnostics-DzrF1h4J.mjs";
import { a as createAssistantMessageEventStream } from "./event-stream-C5AbCAaZ.mjs";
import { i as asOptionalRecord, n as asNullableRecord, t as asNonArrayRecord } from "./record-coerce-CNDovvft.mjs";
import { E as headersToRecord, r as getAiTransportHost } from "./host-u3o8XiAp.mjs";
import { i as projectDiagnosticValue, n as projectProviderError } from "./provider-error-DQBE1bUQ.mjs";
import { c as isTransientNetworkError } from "./diagnostics-Caj-4RBA.mjs";
import { t as createZeroUsage } from "./usage-CJH5D6Ea.mjs";
import { parse } from "partial-json";
//#region packages/ai/src/utils/sanitize-unicode.ts
/** Remove unpaired surrogates rejected by providers; preserve valid Unicode pairs. */
function sanitizeSurrogates(text) {
	if (text.isWellFormed()) return text;
	return text.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "");
}
//#endregion
//#region packages/retry/src/index.ts
const MAX_TIMER_TIMEOUT_MS = 2147e6;
function createAbortError(message, options) {
	const error = new Error(message, options);
	error.name = "AbortError";
	return error;
}
function racePromiseWithAbortSignal(operation, signal, createError = (abortedSignal) => createAbortError("Operation aborted", { cause: abortedSignal.reason })) {
	const run = () => {
		try {
			return typeof operation === "function" ? operation() : operation;
		} catch (error) {
			return Promise.reject(error);
		}
	};
	if (!signal) return run();
	const abortError = () => createError(signal);
	if (signal.aborted) {
		const aborted = Promise.reject(abortError());
		return typeof operation === "function" ? aborted : Promise.race([aborted, operation]);
	}
	let onAbort;
	const aborted = new Promise((_, reject) => {
		onAbort = () => reject(abortError());
		signal.addEventListener("abort", onAbort, { once: true });
		if (signal.aborted) onAbort();
	});
	return Promise.race([run(), aborted]).finally(() => {
		signal.removeEventListener("abort", onAbort);
	});
}
/** Bounds observation without cancelling work; a factory starts only after the timer is armed. */
async function raceWithTimeout(operation, timeoutMs, onTimeout, options = {}) {
	let timer;
	let onAbort;
	try {
		const deadline = new Promise((resolve, reject) => {
			const settle = (result) => {
				try {
					resolve(result());
				} catch (error) {
					reject(error);
				}
			};
			timer = setTimeout(() => settle(onTimeout), timeoutMs);
			if (options.ref === false) timer.unref?.();
			const signal = options.signal;
			if (signal) {
				onAbort = () => settle(() => {
					if (options.onAbort) return options.onAbort(signal);
					throw createAbortError("Operation aborted", { cause: signal.reason });
				});
				signal.addEventListener("abort", onAbort, { once: true });
				if (signal.aborted) onAbort();
			}
		});
		let source;
		try {
			source = typeof operation === "function" ? operation() : operation;
		} catch (error) {
			deadline.catch(() => {});
			throw error;
		}
		return await Promise.race([source, deadline]);
	} finally {
		clearTimeout(timer);
		if (onAbort) options.signal?.removeEventListener("abort", onAbort);
	}
}
const DEFAULT_RETRY_CONFIG = {
	attempts: 3,
	minDelayMs: 300,
	maxDelayMs: 3e4,
	jitter: 0
};
const defaultSleep = async (ms) => {
	let remainingMs = ms;
	do {
		const delayMs = Math.min(remainingMs, MAX_TIMER_TIMEOUT_MS);
		await new Promise((resolve) => {
			setTimeout(resolve, delayMs);
		});
		remainingMs -= delayMs;
	} while (remainingMs > 0);
};
function clampNumber(value, fallback, min, max) {
	if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
	return Math.min(Math.max(value, min ?? Number.NEGATIVE_INFINITY), max ?? Number.POSITIVE_INFINITY);
}
function resolveAttemptCount(value, fallback) {
	return Math.max(1, Math.round(clampNumber(value, fallback)));
}
function resolveRetryDelayMs(value) {
	return Math.min(Math.max(Math.round(value === Number.POSITIVE_INFINITY ? MAX_TIMER_TIMEOUT_MS : Number.isFinite(value) ? value : 0), 0), MAX_TIMER_TIMEOUT_MS);
}
function resolveJitterConfig(value, fallback) {
	if (value === "full") return "full";
	return typeof value === "number" && Number.isFinite(value) ? Math.min(Math.max(value, 0), 1) : fallback;
}
function resolveRetryConfig(defaults = DEFAULT_RETRY_CONFIG, overrides) {
	const attempts = resolveAttemptCount(overrides?.attempts, defaults.attempts);
	const minDelayMs = resolveRetryDelayMs(clampNumber(overrides?.minDelayMs, defaults.minDelayMs, 0));
	return {
		attempts,
		minDelayMs,
		maxDelayMs: Math.max(minDelayMs, resolveRetryDelayMs(clampNumber(overrides?.maxDelayMs, defaults.maxDelayMs, 0))),
		jitter: resolveJitterConfig(overrides?.jitter, defaults.jitter)
	};
}
function applyJitter(delayMs, jitter, mode, random) {
	if (jitter === "full") {
		if (mode === "symmetric") return Math.max(0, Math.round(delayMs * (.5 + random() * .5)));
		return Math.max(0, Math.ceil(delayMs * (1 + random())));
	}
	if (jitter <= 0) return mode === "positive" ? Math.ceil(delayMs) : delayMs;
	const fraction = random();
	const raw = delayMs * (1 + (mode === "positive" ? fraction * jitter : (fraction * 2 - 1) * jitter));
	return Math.max(0, mode === "positive" ? Math.ceil(raw) : Math.round(raw));
}
function toRetryError(value, fallbackMessage = "Non-Error thrown") {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value);
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
function createRetryRunner(runtime = {}) {
	const runtimeSleep = runtime.sleep ?? defaultSleep;
	const runtimeRandom = runtime.random ?? Math.random;
	const createFailure = runtime.createFailure ?? ((errors) => toRetryError(errors.at(-1) ?? /* @__PURE__ */ new Error("Retry failed")));
	return async function retryAsync(fn, attemptsOrOptions = 3, initialDelayMs = 300) {
		const attemptErrors = [];
		const numeric = typeof attemptsOrOptions === "number";
		const options = typeof attemptsOrOptions === "number" ? { attempts: attemptsOrOptions } : attemptsOrOptions;
		const resolved = resolveRetryConfig(DEFAULT_RETRY_CONFIG, options);
		const maxAttempts = resolved.attempts;
		const minDelayMs = resolved.minDelayMs;
		const maxDelayMs = resolved.maxDelayMs > 0 ? resolved.maxDelayMs : Number.POSITIVE_INFINITY;
		const retryAfterMaxDelayMs = options.retryAfterMaxDelayMs === void 0 ? maxDelayMs : Math.max(minDelayMs, resolveRetryDelayMs(clampNumber(options.retryAfterMaxDelayMs, maxDelayMs, 0)));
		const random = options.random ?? runtimeRandom;
		const sleep = options.sleep ?? runtimeSleep;
		const shouldRetry = options.shouldRetry ?? (() => true);
		for (let attempt = 1; attempt <= maxAttempts; attempt += 1) try {
			return await fn();
		} catch (err) {
			attemptErrors.push(err);
			if (attempt >= maxAttempts || !shouldRetry(err, attempt)) break;
			if (numeric) {
				await runtimeSleep(resolveRetryDelayMs(initialDelayMs * 2 ** (attempt - 1)));
				continue;
			}
			const context = {
				attempt,
				maxAttempts,
				err,
				label: options.label
			};
			const retryAfterMs = options.retryAfterMs?.(err);
			const hasRetryAfter = typeof retryAfterMs === "number" && Number.isFinite(retryAfterMs);
			const configuredDelay = typeof options.delayMs === "function" ? options.delayMs(context) : options.delayMs;
			const resolvedConfiguredDelay = configuredDelay === void 0 ? void 0 : resolveRetryDelayMs(configuredDelay);
			const baseDelay = hasRetryAfter ? Math.max(retryAfterMs, minDelayMs) : resolvedConfiguredDelay === void 0 ? minDelayMs * 2 ** (attempt - 1) : Math.max(resolvedConfiguredDelay, minDelayMs);
			const delayCap = hasRetryAfter ? retryAfterMaxDelayMs : maxDelayMs;
			let delay = Math.min(baseDelay, delayCap);
			const canHonorRetryAfter = hasRetryAfter && (retryAfterMs ?? 0) <= delayCap;
			const wantsPositiveDraw = resolved.jitter === "full" ? !hasRetryAfter || canHonorRetryAfter : canHonorRetryAfter;
			delay = applyJitter(delay, resolved.jitter, wantsPositiveDraw ? "positive" : "symmetric", random);
			delay = Math.min(Math.max(delay, minDelayMs), delayCap);
			await options.onRetry?.({
				...context,
				delayMs: delay
			});
			if (delay > 0) await sleep(delay);
		}
		throw createFailure(attemptErrors);
	};
}
createRetryRunner();
//#endregion
//#region packages/ai/src/utils/hash.ts
/** Fast deterministic hash to shorten long strings */
function shortHash(str) {
	let h1 = 3735928559;
	let h2 = 1103547991;
	for (let i = 0; i < str.length; i++) {
		const ch = str.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761);
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}
	h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909);
	h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);
	return (h2 >>> 0).toString(36) + (h1 >>> 0).toString(36);
}
//#endregion
//#region packages/ai/src/utils/json-parse.ts
const VALID_JSON_ESCAPES = /* @__PURE__ */ new Set([
	"\"",
	"\\",
	"/",
	"b",
	"f",
	"n",
	"r",
	"t",
	"u"
]);
const JSON_CONTROL_ESCAPES = /* @__PURE__ */ new Set([
	"b",
	"f",
	"n",
	"r",
	"t"
]);
function isControlCharacter(char) {
	const codePoint = char.codePointAt(0);
	return codePoint !== void 0 && codePoint >= 0 && codePoint <= 31;
}
/**
* Repairs malformed JSON string literals by:
* - escaping raw control characters inside strings
* - doubling backslashes before invalid escape characters
*
* By default a valid control escape (`\n`, `\t`, ...) that follows a Windows-path-looking
* prefix is treated as an unescaped path separator and doubled. Pass
* `preserveValidControlEscapes` when the text is authoritative (for example a completed
* tool-call argument buffer) and every valid escape must survive as written.
*/
function repairJson(json, options) {
	if (!/[\\\x00-\x1f]/.test(json)) return json;
	const preserveValidControlEscapes = options?.preserveValidControlEscapes === true;
	let repaired = "";
	let inString = false;
	let stringValuePrefix = "";
	for (let index = 0; index < json.length; index++) {
		const char = json.charAt(index);
		if (!inString) {
			repaired += char;
			if (char === "\"") {
				inString = true;
				stringValuePrefix = "";
			}
			continue;
		}
		if (char === "\"") {
			repaired += char;
			inString = false;
			stringValuePrefix = "";
			continue;
		}
		if (char === "\\") {
			const nextChar = json.charAt(index + 1);
			if (!nextChar) {
				repaired += "\\\\";
				continue;
			}
			if (nextChar === "u") {
				const unicodeDigits = json.slice(index + 2, index + 6);
				if (/^[0-9a-fA-F]{4}$/.test(unicodeDigits)) {
					repaired += `\\u${unicodeDigits}`;
					stringValuePrefix += `\\u${unicodeDigits}`;
					index += 5;
					continue;
				}
				repaired += "\\\\";
				stringValuePrefix += "\\";
				continue;
			}
			if (!preserveValidControlEscapes && JSON_CONTROL_ESCAPES.has(nextChar)) {
				stringValuePrefix = stringValuePrefix.slice(-160);
				if (looksLikeWindowsPathPrefix(stringValuePrefix)) {
					repaired += "\\\\";
					stringValuePrefix += "\\";
					continue;
				}
			}
			if (VALID_JSON_ESCAPES.has(nextChar)) {
				repaired += `\\${nextChar}`;
				stringValuePrefix += nextChar === "\\" ? "\\" : `\\${nextChar}`;
				index += 1;
				continue;
			}
			repaired += "\\\\";
			stringValuePrefix += "\\";
			continue;
		}
		repaired += isControlCharacter(char) ? JSON.stringify(char).slice(1, -1) : char;
		stringValuePrefix += char;
	}
	return repaired;
}
function parseJsonWithRepair(json) {
	return JSON.parse(repairJson(json));
}
function looksLikeWindowsPathPrefix(prefix) {
	return /(?:^|[^A-Za-z0-9])[A-Za-z]:(?:[\\/][^"\\/:*?<>|\r\n]*)*$/.test(prefix);
}
/**
* Attempts to parse potentially incomplete JSON during streaming.
* Always returns a valid object, even if the JSON is incomplete.
*
* @param partialJson The partial JSON string from streaming
* @returns Parsed object or empty object if parsing fails
*/
function parseStreamingJson(partialJson) {
	if (!partialJson || partialJson.trim() === "") return {};
	try {
		return asNonArrayRecord(parseJsonWithRepair(partialJson));
	} catch {
		try {
			return asNonArrayRecord(parse(partialJson));
		} catch {
			return {};
		}
	}
}
const TOOL_ARGUMENT_PREVIEW_FIRST_CHECKPOINT_CHARS = 512;
/**
* Streamed tool-call arguments are preview-only; the terminal parse re-reads
* the full buffer authoritatively at content_block_stop. Reparsing every delta
* scans an ever-growing buffer and makes assembly quadratic in the argument
* size, so refresh previews on a geometric length schedule instead — bounded
* staleness, linear total parse work.
*/
function createToolArgumentPreviewSchedule() {
	let nextCheckpointChars = TOOL_ARGUMENT_PREVIEW_FIRST_CHECKPOINT_CHARS;
	return (accumulatedChars) => {
		if (accumulatedChars < nextCheckpointChars) return false;
		nextCheckpointChars = accumulatedChars * 2;
		return true;
	};
}
//#endregion
//#region packages/ai/src/transports/json-unsafe-integers.ts
/**
* JSON parsing helpers that preserve integer literals larger than
* Number.MAX_SAFE_INTEGER as strings before JSON.parse can round them.
*/
const MAX_SAFE_INTEGER_ABS_STR = String(Number.MAX_SAFE_INTEGER);
function isAsciiDigit(ch) {
	return ch !== void 0 && ch >= "0" && ch <= "9";
}
function parseJsonNumberToken(input, start) {
	let idx = start;
	if (input[idx] === "-") idx += 1;
	if (idx >= input.length) return null;
	if (input[idx] === "0") idx += 1;
	else if (isAsciiDigit(input[idx]) && input[idx] !== "0") while (isAsciiDigit(input[idx])) idx += 1;
	else return null;
	let isInteger = true;
	if (input[idx] === ".") {
		isInteger = false;
		idx += 1;
		if (!isAsciiDigit(input[idx])) return null;
		while (isAsciiDigit(input[idx])) idx += 1;
	}
	if (input[idx] === "e" || input[idx] === "E") {
		isInteger = false;
		idx += 1;
		if (input[idx] === "+" || input[idx] === "-") idx += 1;
		if (!isAsciiDigit(input[idx])) return null;
		while (isAsciiDigit(input[idx])) idx += 1;
	}
	return {
		token: input.slice(start, idx),
		end: idx,
		isInteger
	};
}
function isUnsafeIntegerLiteral(token) {
	const digits = token[0] === "-" ? token.slice(1) : token;
	return digits.length > MAX_SAFE_INTEGER_ABS_STR.length || digits.length === MAX_SAFE_INTEGER_ABS_STR.length && digits > MAX_SAFE_INTEGER_ABS_STR;
}
/** Quotes integer literals above Number.MAX_SAFE_INTEGER before JSON.parse. */
function quoteUnsafeIntegerLiterals(input) {
	if (!/(?:^|\D)\d{16}/.test(input)) return input;
	let out = "";
	let inString = false;
	let escaped = false;
	let idx = 0;
	while (idx < input.length) {
		const ch = input[idx] ?? "";
		if (inString) {
			out += ch;
			if (escaped) escaped = false;
			else if (ch === "\\") escaped = true;
			else if (ch === "\"") inString = false;
			idx += 1;
			continue;
		}
		if (ch === "\"") {
			inString = true;
			out += ch;
			idx += 1;
			continue;
		}
		if (ch === "-" || isAsciiDigit(ch)) {
			const parsed = parseJsonNumberToken(input, idx);
			if (parsed) {
				if (parsed.isInteger && isUnsafeIntegerLiteral(parsed.token)) out += `"${parsed.token}"`;
				else out += parsed.token;
				idx = parsed.end;
				continue;
			}
		}
		out += ch;
		idx += 1;
	}
	return out;
}
/** Parses JSON while preserving unsafe integer literals as strings. */
function parseJsonPreservingUnsafeIntegers(input) {
	return JSON.parse(quoteUnsafeIntegerLiterals(input));
}
/** Parses or accepts an object while preserving unsafe integer literals in string input. */
function parseJsonObjectPreservingUnsafeIntegers(value) {
	if (typeof value === "string") try {
		return asNullableRecord(parseJsonPreservingUnsafeIntegers(value));
	} catch {
		return null;
	}
	return asNullableRecord(value);
}
//#endregion
//#region packages/ai/src/transports/transport-stream-shared.ts
const EMPTY_TOOL_RESULT_TEXT = "(no output)";
const MALFORMED_TOOL_CALL_TERMINAL_ERROR_MESSAGE = "Provider completed tool call with malformed JSON arguments";
function sanitizeTransportPayloadText(text) {
	if (typeof text !== "string") return "";
	return sanitizeSurrogates(text);
}
function sanitizeNonEmptyTransportPayloadText(text, fallback = EMPTY_TOOL_RESULT_TEXT) {
	const sanitized = sanitizeTransportPayloadText(text);
	return sanitized.trim().length > 0 ? sanitized : fallback;
}
function coerceTransportToolCallArguments(argumentsValue) {
	const argumentsRecord = asOptionalRecord(argumentsValue);
	if (argumentsRecord) return argumentsRecord;
	if (typeof argumentsValue === "string") try {
		return asNonArrayRecord(JSON.parse(argumentsValue));
	} catch {}
	return {};
}
/** Stable terminal fact: presentation must not infer unfinished calls from provider prose. */
var IncompleteToolCallError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = "incomplete_tool_call";
	}
};
const MALFORMED_TOOL_CALL_TERMINAL_ERROR_CODE = "malformed_tool_call_arguments";
function createMalformedToolCallArgumentsError(value, errorMessage, repairAttempted) {
	const text = typeof value === "string" ? value : void 0;
	const diagnostics = {
		code: MALFORMED_TOOL_CALL_TERMINAL_ERROR_CODE,
		argumentChars: text?.length ?? 0,
		argumentHash: text === void 0 ? "" : shortHash(text),
		repairAttempted
	};
	const error = new Error(errorMessage, { cause: diagnostics });
	Object.assign(error, {
		errorCode: MALFORMED_TOOL_CALL_TERMINAL_ERROR_CODE,
		errorBody: JSON.stringify(diagnostics)
	});
	return error;
}
/**
* Repair a complete-but-invalid terminal argument buffer. Anthropic fine-grained tool
* streaming skips server-side JSON validation, so a finished tool_use block can carry raw
* control characters or invalid escapes inside string values. Only string-literal repairs
* are applied and every valid escape is preserved as written; truncated or non-object
* buffers stay rejected so a cut-off write never executes with partial arguments.
*/
function repairTerminalToolCallArguments(value) {
	const repaired = repairJson(value, { preserveValidControlEscapes: true });
	if (repaired === value) return null;
	return parseJsonObjectPreservingUnsafeIntegers(repaired);
}
/**
* Admit only complete object-shaped terminal tool arguments; partial parsing is preview-only.
* `repairStringLiterals` opts a stream whose provider may deliver unvalidated tool input into
* string-literal repair before rejection.
*/
function parseTerminalToolCallArguments(value, errorMessage = MALFORMED_TOOL_CALL_TERMINAL_ERROR_MESSAGE, options) {
	const parsed = parseJsonObjectPreservingUnsafeIntegers(value);
	if (parsed) return parsed;
	const repairStringLiterals = options?.repairStringLiterals === true && typeof value === "string";
	if (repairStringLiterals) {
		const repaired = repairTerminalToolCallArguments(value);
		if (repaired) return repaired;
	}
	throw createMalformedToolCallArgumentsError(value, errorMessage, repairStringLiterals);
}
/** Validate a complete sibling set before mutating any call into executable state. */
function finalizeTerminalToolCallArguments(calls, readArguments, errorMessage, options) {
	const validated = calls.map((call) => [call, parseTerminalToolCallArguments(readArguments(call), errorMessage, options)]);
	for (const [call, argumentsValue] of validated) call.arguments = argumentsValue;
}
function mergeTransportHeaders(...headerSources) {
	const merged = {};
	const namesByLowercase = /* @__PURE__ */ new Map();
	for (const headers of headerSources) for (const [name, value] of Object.entries(headers ?? {})) {
		const lowercaseName = name.toLowerCase();
		const previousName = namesByLowercase.get(lowercaseName);
		if (previousName && previousName !== name) delete merged[previousName];
		merged[name] = value;
		namesByLowercase.set(lowercaseName, name);
	}
	return Object.keys(merged).length > 0 ? merged : void 0;
}
function createEmptyTransportUsage() {
	return createZeroUsage();
}
function createWritableTransportEventStream() {
	const eventStream = createAssistantMessageEventStream();
	return {
		eventStream,
		stream: eventStream
	};
}
/**
* Abort error to surface for an aborted `signal`.
*
* Rethrows the caller's abort reason only when it carries a `code`, so that code
* survives into `errorCode` on the persisted assistant message and consumers can
* recognize an abort's origin without matching error text. A default
* `abort()` reason is an uncoded DOMException that carries nothing the synthetic
* error does not, so it keeps the "Request was aborted" text every transport
* already emits rather than churning it.
*/
function transportAbortError(signal) {
	const reason = signal?.reason;
	return reason instanceof Error && typeof reason.code === "string" ? reason : /* @__PURE__ */ new Error("Request was aborted");
}
const MODEL_STREAM_COOPERATIVE_YIELD_INTERVAL_MS = 12;
const MODEL_STREAM_COOPERATIVE_YIELD_MAX_EVENTS = 64;
function throwIfModelStreamAborted(signal) {
	if (signal?.aborted) throw transportAbortError(signal);
}
function createModelStreamCooperativeScheduler(signal) {
	let lastYieldedAt = Date.now();
	let eventsSinceYield = 0;
	return { async afterEvent() {
		throwIfModelStreamAborted(signal);
		eventsSinceYield += 1;
		if (eventsSinceYield < MODEL_STREAM_COOPERATIVE_YIELD_MAX_EVENTS && Date.now() - lastYieldedAt < MODEL_STREAM_COOPERATIVE_YIELD_INTERVAL_MS) return;
		eventsSinceYield = 0;
		await new Promise((resolve) => {
			setTimeout(resolve, 0);
		});
		throwIfModelStreamAborted(signal);
		lastYieldedAt = Date.now();
	} };
}
/** Keep ready provider events from monopolizing the main loop, including ignored events. */
async function* iterateModelStream(events, signal) {
	const scheduler = createModelStreamCooperativeScheduler(signal);
	for await (const event of events) {
		throwIfModelStreamAborted(signal);
		yield event;
		await scheduler.afterEvent();
	}
}
const providerAcceptanceObserver = Symbol("openclaw.providerAcceptanceObserver");
function readProviderAcceptanceObserver(options) {
	if (options === null || typeof options !== "object") return;
	const descriptor = Object.getOwnPropertyDescriptor(options, providerAcceptanceObserver);
	const value = descriptor && "value" in descriptor ? descriptor.value : void 0;
	return isProviderAcceptanceObserver(value) ? value : void 0;
}
function isProviderAcceptanceObserver(value) {
	return typeof value === "function";
}
function writeProviderAcceptanceObserver(options, observer) {
	Object.defineProperty(options, providerAcceptanceObserver, {
		configurable: true,
		enumerable: true,
		value: observer
	});
	return options;
}
/** Attach an OpenClaw-internal provider acceptance observer to one model call. */
function withProviderAcceptanceObserver(options, observer) {
	const existing = readProviderAcceptanceObserver(options);
	return writeProviderAcceptanceObserver(options, existing ? (acceptance) => {
		observer(acceptance);
		existing(acceptance);
	} : observer);
}
/** Preserve the private provider acceptance observer when a built-in wrapper rebuilds options. */
function copyProviderAcceptanceObserver(source, target) {
	const observer = readProviderAcceptanceObserver(source);
	return observer ? writeProviderAcceptanceObserver(target, observer) : target;
}
async function awaitProviderLifecycleCallback(callback, signal) {
	if (signal?.aborted) throw transportAbortError(signal);
	if (!callback) return;
	const callbackPromise = Promise.resolve().then(callback);
	getAiTransportHost().observePendingProviderWork?.(callbackPromise);
	await racePromiseWithAbortSignal(callbackPromise, signal, transportAbortError);
	if (signal?.aborted) throw transportAbortError(signal);
}
function startProviderStreamCancellation(cancelStream, error) {
	const reason = error instanceof Error ? error : new Error(String(error));
	try {
		const pending = Promise.resolve(cancelStream(reason));
		pending.catch(() => void 0);
		getAiTransportHost().observePendingProviderWork?.(pending);
	} catch {}
}
async function awaitProviderLifecycleWithCleanup(params) {
	try {
		await params.run();
	} catch (error) {
		startProviderStreamCancellation(params.cancelStream, error);
		throw error;
	}
}
/** Report observed HTTP metadata; rejected responses use only onResponse. */
async function notifyProviderHttpMetadata(params) {
	const observer = readProviderAcceptanceObserver(params.options);
	if (!observer && !params.options?.onResponse) return;
	const { status, headers } = params.response;
	const signal = params.signal ?? params.options?.signal;
	const accepted = status >= 200 && status < 300;
	await awaitProviderLifecycleWithCleanup({
		cancelStream: params.cancelStream,
		run: async () => {
			await awaitProviderLifecycleCallback(accepted && observer ? () => observer({
				kind: "http_response",
				status,
				headers
			}) : void 0, signal);
			await awaitProviderLifecycleCallback(params.options?.onResponse ? () => params.options?.onResponse?.({
				status,
				headers
			}, params.model) : void 0, signal);
		}
	});
}
/** Report a real HTTP response before body consumption. */
async function notifyProviderHttpResponse(params) {
	await notifyProviderHttpMetadata({
		options: params.options,
		response: {
			status: params.response.status,
			headers: headersToRecord(params.response.headers)
		},
		model: params.model,
		signal: params.signal,
		cancelStream: (reason) => {
			if (params.cancelStream) startProviderStreamCancellation(params.cancelStream, reason);
			return params.response.body?.cancel(reason);
		}
	});
}
/** Report an accepted SDK stream when the SDK does not expose HTTP metadata. */
async function notifyProviderStreamOpened(params) {
	const observer = readProviderAcceptanceObserver(params.options);
	if (!observer) return;
	await awaitProviderLifecycleWithCleanup({
		cancelStream: params.cancelStream,
		run: () => awaitProviderLifecycleCallback(() => observer({ kind: "provider_stream_opened" }), params.signal ?? params.options?.signal)
	});
}
/** Run a provider-response hook before start/body consumption inside the first-event deadline. */
function withProviderResponseHook(params) {
	return { async *[Symbol.asyncIterator]() {
		try {
			await awaitProviderLifecycleCallback(params.hook, params.signal);
		} catch (error) {
			params.abort(error instanceof Error ? error : new Error(String(error)));
			throw error;
		}
		if (params.signal.aborted) throw transportAbortError(params.signal);
		params.onReady?.();
		if (params.stream) yield* params.stream;
	} };
}
function finalizeTransportStream(params) {
	const { stream, output, signal } = params;
	if (signal?.aborted) throw transportAbortError(signal);
	if (output.stopReason === "aborted" || output.stopReason === "error") throw new Error(output.errorMessage ?? "An unknown error occurred");
	stream.push({
		type: "done",
		reason: output.stopReason,
		message: output
	});
	stream.end();
}
/** Assign terminal fields and record silent transport failures before partial-call cleanup. */
function assignTransportErrorDetails(output, error, signal) {
	const projection = projectProviderError(error, signal);
	Object.assign(output, projection);
	if (projection.stopReason === "error" && output.content.length === 0 && isTransientNetworkError(projectDiagnosticValue(error)) && !output.diagnostics?.some((diagnostic) => diagnostic.type === "provider_transport_failure")) appendAssistantMessageDiagnostic(output, createAssistantMessageDiagnostic("provider_transport_failure", projection.errorMessage, {
		eventsEmitted: false,
		phase: "before_message_stream_start"
	}));
	return projection;
}
function failTransportStream(params) {
	const { stream, output, signal, error, cleanup } = params;
	const projection = assignTransportErrorDetails(output, error, signal);
	cleanup?.();
	stream.push({
		type: "error",
		reason: projection.stopReason,
		error: output
	});
	stream.end();
}
//#endregion
export { shortHash as A, parseJsonObjectPreservingUnsafeIntegers as C, parseJsonWithRepair as D, createToolArgumentPreviewSchedule as E, racePromiseWithAbortSignal as M, raceWithTimeout as N, parseStreamingJson as O, sanitizeSurrogates as P, withProviderResponseHook as S, quoteUnsafeIntegerLiterals as T, sanitizeNonEmptyTransportPayloadText as _, createEmptyTransportUsage as a, transportAbortError as b, failTransportStream as c, iterateModelStream as d, mergeTransportHeaders as f, parseTerminalToolCallArguments as g, notifyProviderStreamOpened as h, copyProviderAcceptanceObserver as i, createAbortError as j, repairJson as k, finalizeTerminalToolCallArguments as l, notifyProviderHttpResponse as m, assignTransportErrorDetails as n, createModelStreamCooperativeScheduler as o, notifyProviderHttpMetadata as p, coerceTransportToolCallArguments as r, createWritableTransportEventStream as s, IncompleteToolCallError as t, finalizeTransportStream as u, sanitizeTransportPayloadText as v, parseJsonPreservingUnsafeIntegers as w, withProviderAcceptanceObserver as x, throwIfModelStreamAborted as y };
