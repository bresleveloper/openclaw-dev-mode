import { Lt as inspectFileIdentitySync, T as resolvePathViaExistingAncestorSync$1, Vt as FsSafeError, c as openRootFileSync, dt as isPathInside, ft as isPathRelativeEscape, lt as hasNodeErrorCode, s as canUseRootFileOpen, t as createRuntimeProcessEntrypoints, ut as isNotFoundPathError, wt as resolvePathPreservingWindowsRoot, xt as assertNoWindowsPathAlias } from "./sqlite-readonly-runtime-process-manifest-B1faCUt1.mjs";
import { createRequire } from "node:module";
import path, { basename } from "node:path";
import crypto, { createHash } from "node:crypto";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import os from "node:os";
import { isMainThread, threadId } from "node:worker_threads";
import { formatWithOptions } from "node:util";
import { AsyncLocalStorage } from "node:async_hooks";
import { channel } from "node:diagnostics_channel";
import { performance } from "node:perf_hooks";
import { Chalk } from "chalk";
//#region packages/normalization-core/src/record-coerce.ts
/** Type guard for non-array object records at browser-safe boundaries. */
function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
/** Returns a non-array record or undefined. */
function asOptionalRecord(value) {
	return isRecord(value) ? value : void 0;
}
/** Returns a non-array record or null. */
function asNullableRecord(value) {
	return isRecord(value) ? value : null;
}
/** Returns any object-backed record, including arrays, or undefined. */
function asOptionalObjectRecord(value) {
	return value && typeof value === "object" ? value : void 0;
}
//#endregion
//#region packages/normalization-core/src/string-coerce.ts
/** Reads a value only when it is already a string, preserving whitespace. */
function readStringValue(value) {
	return typeof value === "string" ? value : void 0;
}
/** Trims string input and returns null for non-strings or empty strings. */
function normalizeNullableString(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed ? trimmed : null;
}
/** Trims string input and returns undefined for non-strings or empty strings. */
function normalizeOptionalString(value) {
	return normalizeNullableString(value) ?? void 0;
}
/** Lowercases a normalized optional string. */
function normalizeOptionalLowercaseString(value) {
	return normalizeOptionalString(value)?.toLowerCase();
}
/** Lowercases a normalized string or returns an empty string when absent. */
function normalizeLowercaseStringOrEmpty(value) {
	return normalizeOptionalLowercaseString(value) ?? "";
}
//#endregion
//#region packages/terminal-core/src/ansi-sequences.ts
const ANSI_OSC_INTRODUCER_PATTERN = "(?:\\x1b\\]|\\x9d)";
const ANSI_STRING_TERMINATOR_PATTERN = "(?:\\x1b\\\\|\\x07|\\x9c)";
const ANSI_OSC_PATTERN = `${ANSI_OSC_INTRODUCER_PATTERN}[^\\x07\\x1b\\x9c]*${ANSI_STRING_TERMINATOR_PATTERN}`;
const ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN = "[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]";
const ansiOscAtIndexRegex = new RegExp(ANSI_OSC_PATTERN, "y");
function matchAnsiOscAt(input, index) {
	ansiOscAtIndexRegex.lastIndex = index;
	return ansiOscAtIndexRegex.exec(input)?.[0];
}
function csiIntroducerLength(input, index) {
	const code = input.charCodeAt(index);
	if (code === 155) return 1;
	return code === 27 && input.charCodeAt(index + 1) === 91 ? 2 : 0;
}
/** Scan one CSI parser pass, retaining independently executed C0 controls. */
function scanAnsiCsiAt(input, index) {
	const introducerLength = csiIntroducerLength(input, index);
	if (introducerLength === 0) return;
	let cursor = index + introducerLength;
	const controls = [];
	let ended = false;
	while (cursor < input.length) {
		const code = input.charCodeAt(cursor);
		if (code === 24 || code === 26) {
			cursor += 1;
			ended = true;
			break;
		}
		if (code === 27 || code === 155) {
			ended = true;
			break;
		}
		if (code <= 31 || code === 127) {
			controls.push(input.charAt(cursor));
			cursor += 1;
			continue;
		}
		if (code >= 32 && code <= 63) {
			cursor += 1;
			continue;
		}
		if (code >= 64 && code <= 126) cursor += 1;
		ended = true;
		break;
	}
	return {
		controls,
		ended,
		value: input.slice(index, cursor)
	};
}
const ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX = new RegExp(`${`${ANSI_OSC_INTRODUCER_PATTERN}[\\s\\S]*?${ANSI_STRING_TERMINATOR_PATTERN}`}|${ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN}`, "y");
new Intl.Segmenter(void 0, { granularity: "grapheme" });
function hasAnsiIntroducer(input) {
	return input.includes("\x1B") || input.includes("") || input.includes("");
}
/**
* Strip ANSI against original input positions so one removal cannot synthesize
* a second sequence. C0 controls execute without ending CSI, CAN/SUB cancel it,
* and ESC restarts escape parsing.
*/
function stripAnsiInternal(input, options) {
	if (!hasAnsiIntroducer(input)) return input;
	const output = [];
	let copyStart = 0;
	let index = 0;
	while (index < input.length) {
		const introducerCode = input.charCodeAt(index);
		if (introducerCode !== 27 && introducerCode !== 155 && introducerCode !== 157) {
			index += 1;
			continue;
		}
		const osc = matchAnsiOscAt(input, index);
		const csi = osc ? void 0 : scanAnsiCsiAt(input, index);
		ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX.lastIndex = index;
		const compatibilityMatch = !osc && options.compatibilityGrammar ? ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX.exec(input)?.[0] : void 0;
		let length = osc?.length ?? csi?.value.length ?? compatibilityMatch?.length;
		if (length === void 0) {
			index += 1;
			continue;
		}
		if (csi && !csi.ended && options.preserveIncompleteCsi) break;
		if (csi?.controls.length === 0 && compatibilityMatch) length = Math.max(length, compatibilityMatch.length);
		output.push(input.slice(copyStart, index), ...csi?.controls ?? []);
		index += length;
		copyStart = index;
	}
	output.push(input.slice(copyStart));
	return output.join("");
}
function stripAnsi$1(input) {
	return stripAnsiInternal(input, { compatibilityGrammar: false });
}
const LOG_CONTROL_CHARS_REGEX = new RegExp(`[${String.fromCharCode(0)}-${String.fromCharCode(31)}${String.fromCharCode(127)}-${String.fromCharCode(159)}]`, "g");
/**
* Sanitize a value for safe interpolation into log messages.
* Strips ANSI escape sequences, C0/C1 control characters, and DEL to
* prevent log forging / terminal escape injection (CWE-117).
*/
function sanitizeForLog(v) {
	return stripAnsi$1(v).replace(LOG_CONTROL_CHARS_REGEX, "");
}
//#endregion
//#region src/shared/global-singleton.ts
/**
* Process-local singleton helpers for registries, caches, and SDK-visible shared state.
* Keys must be symbols so unrelated modules cannot collide on `globalThis` property names.
*/
const GLOBAL_SINGLETON_RESETS_KEY = Symbol.for("openclaw.globalSingletonLifecycleResets");
function resolveGlobalSingletonResetRegistry() {
	const globalStore = globalThis;
	const existing = globalStore[GLOBAL_SINGLETON_RESETS_KEY];
	if (existing instanceof Map) return existing;
	const created = /* @__PURE__ */ new Map();
	globalStore[GLOBAL_SINGLETON_RESETS_KEY] = created;
	return created;
}
/** Observe an existing owner's state without initializing it or registering cleanup. */
function readGlobalSingleton(key) {
	const globalStore = globalThis;
	return Object.hasOwn(globalStore, key) ? globalStore[key] : void 0;
}
/** Resolves a process-local singleton for caches and registries that tolerate helper lookup. */
function resolveGlobalSingleton(key, create, reset, lifecycle = "close-and-restart") {
	const globalStore = globalThis;
	let value;
	if (Object.hasOwn(globalStore, key)) value = globalStore[key];
	else {
		value = create();
		globalStore[key] = value;
	}
	if (reset) resolveGlobalSingletonResetRegistry().set(key, {
		lifecycle,
		reset: () => reset(value)
	});
	return value;
}
/** Resolves a process-local Map singleton for keyed caches backed by globalThis. */
function resolveGlobalMap(key, reset, lifecycle) {
	return resolveGlobalSingleton(key, () => /* @__PURE__ */ new Map(), typeof reset === "string" ? (value) => value.clear() : reset, typeof reset === "string" ? reset : lifecycle);
}
/** Resolves a lifecycle-owned process-local Set singleton. */
function resolveGlobalSet(key, lifecycle) {
	return resolveGlobalSingleton(key, () => /* @__PURE__ */ new Set(), (value) => value.clear(), lifecycle);
}
resolveGlobalSingleton(Symbol.for("openclaw.signalExitOwner"), () => ({}));
resolveGlobalSet(Symbol.for("openclaw.signalExitBarriers"), "close-and-restart");
resolveGlobalSet(Symbol.for("openclaw.signalExitGates"), "close-and-restart");
const activeFinalizers = resolveGlobalSet(Symbol.for("openclaw.signalExitFinalizers"), "close-and-restart");
/** Temporary artifacts remain available until other shutdown owners have drained. */
function registerSignalExitFinalizer(finalizer) {
	activeFinalizers.add(finalizer);
	return () => activeFinalizers.delete(finalizer);
}
//#endregion
//#region src/global-state.ts
let globalVerbose = false;
function isVerbose() {
	return globalVerbose;
}
//#endregion
//#region src/infra/plain-object.ts
/**
* Config merge/patch uses the object tag, not prototype identity: class instances
* and custom prototypes remain accepted, while Date/Map/Set values are excluded.
*/
function isPlainObject$1(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) && Object.prototype.toString.call(value) === "[object Object]";
}
//#endregion
//#region src/infra/prototype-keys.ts
const BLOCKED_OBJECT_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"prototype",
	"constructor"
]);
/** Return true when assigning `key` could mutate an object prototype. */
function isBlockedObjectKey(key) {
	return BLOCKED_OBJECT_KEYS.has(key);
}
//#endregion
//#region src/shared/dot-path.ts
/** Appends one config path segment without confusing literal record keys with traversal. */
function appendConfigPathSegment(path, segment) {
	if (typeof segment === "number") return `${path}[${segment}]`;
	if (!/^[A-Za-z_$][A-Za-z0-9_$:-]*$/.test(segment)) return `${path}[${JSON.stringify(segment)}]`;
	return path ? `${path}.${segment}` : segment;
}
//#endregion
//#region packages/normalization-core/src/cjk-chars.ts
const WEIGHTED_CJK_RANGES = [
	[
		[183, 183],
		[12288, 12703],
		[19968, 40869],
		[44032, 55215],
		[65281, 65376]
	],
	[
		[4352, 4607],
		[11904, 12287],
		[12704, 19967],
		[40870, 40959],
		[40960, 42239],
		[42752, 42759],
		[43360, 43391],
		[55216, 55295],
		[63744, 64255]
	],
	[
		[711, 711],
		[713, 715],
		[729, 729],
		[746, 747],
		[773, 773],
		[803, 803],
		[65040, 65103],
		[65377, 65500],
		[65504, 65510]
	],
	[[119648, 119665]],
	[
		[94176, 94207],
		[110576, 110591],
		[110592, 110959],
		[127488, 127743],
		[131072, 195103],
		[196608, 210047]
	]
];
new RegExp(`[${WEIGHTED_CJK_RANGES.flatMap((ranges) => ranges.map(([start, end]) => `\\u{${start.toString(16)}}-\\u{${end.toString(16)}}`)).join("")}]`, "u");
(() => {
	const maxCodePoint = Math.max(...WEIGHTED_CJK_RANGES.flatMap((ranges) => ranges.map(([, end]) => end)));
	const categories = new Uint8Array(maxCodePoint + 1);
	for (const [bucket, ranges] of WEIGHTED_CJK_RANGES.entries()) for (const [start, end] of ranges) categories.fill(bucket + 1, start, end + 1);
	return categories;
})();
//#endregion
//#region packages/normalization-core/src/error-coercion.ts
const STRUCTURED_ERROR_OWNED_FIELDS = /* @__PURE__ */ new Set([
	"cause",
	"message",
	"name",
	"stack"
]);
const STRUCTURED_ERROR_PROTOTYPE_FIELDS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
const PROVIDER_AUTH_PERSISTENCE_ERROR_BRAND = Symbol.for("openclaw.provider-auth-persistence-error");
function isProviderAuthPersistenceError(value) {
	try {
		return PROVIDER_AUTH_PERSISTENCE_ERROR_BRAND in value && value[PROVIDER_AUTH_PERSISTENCE_ERROR_BRAND] === true;
	} catch {
		return false;
	}
}
function isErrorObject$1(value) {
	try {
		if (value instanceof Error) return true;
		return Object.prototype.toString.call(value) === "[object Error]";
	} catch {
		return false;
	}
}
function isAggregateErrorObject(error) {
	try {
		if (error instanceof AggregateError) return true;
		for (let proto = Object.getPrototypeOf(error); proto; proto = Object.getPrototypeOf(proto)) {
			const constructor = Object.getOwnPropertyDescriptor(proto, "constructor")?.value;
			if (typeof constructor === "function" && constructor.name === "AggregateError") return true;
		}
	} catch {}
	return false;
}
function readProperty(value, key) {
	try {
		return value[key];
	} catch {
		return;
	}
}
function readErrorText(value, key) {
	const field = readProperty(value, key);
	return typeof field === "string" ? field : void 0;
}
function formatStatusAndCode(value) {
	if ((typeof value !== "object" || value === null) && typeof value !== "function") return;
	try {
		if (Object.keys(value).some((key) => key !== "status" && key !== "code")) return;
	} catch {}
	const statusValue = readProperty(value, "status");
	const codeValue = readProperty(value, "code");
	if (statusValue === void 0 && codeValue === void 0) return;
	return `status=${typeof statusValue === "string" || typeof statusValue === "number" ? String(statusValue) : "unknown"} code=${typeof codeValue === "string" || typeof codeValue === "number" ? String(codeValue) : "unknown"}`;
}
function stringifyUnknown(value) {
	if (value === null || typeof value !== "object" && typeof value !== "function") return String(value);
	try {
		const json = JSON.stringify(value);
		if (json !== void 0) return json;
	} catch {}
	try {
		return Object.prototype.toString.call(value);
	} catch {
		return "Unknown error";
	}
}
function readErrorCauses(current) {
	if (!isErrorObject$1(current)) return [];
	const cause = readProperty(current, "cause");
	const errors = isAggregateErrorObject(current) ? readProperty(current, "errors") : void 0;
	const persistenceFailures = isProviderAuthPersistenceError(current) ? [readProperty(current, "persistenceError"), readProperty(current, "cleanupError")] : [];
	const suppressed = readErrorText(current, "name") === "SuppressedError" ? [readProperty(current, "error"), readProperty(current, "suppressed")].map((failure) => failure == null ? String(failure) : failure) : [];
	return [
		...persistenceFailures,
		cause || void 0,
		...Array.isArray(errors) ? errors : [],
		...suppressed
	];
}
/** Formats unknown errors with cause/aggregate details and optional diagnostic redaction. */
function formatErrorMessage$1(value, options = {}) {
	let formatted;
	if (isErrorObject$1(value)) {
		formatted = readErrorText(value, "message") || readErrorText(value, "name") || "Error";
		const seenMessages = /* @__PURE__ */ new Set([formatted]);
		const appendCauseMessage = (message) => {
			if (!message || seenMessages.has(message)) return;
			formatted += ` | ${message}`;
			seenMessages.add(message);
		};
		if (options.includeCode) {
			const code = readProperty(value, "code");
			if (typeof code === "string" || typeof code === "number") appendCauseMessage(String(code));
		}
		const causes = collectErrorGraphCandidates(value, readErrorCauses);
		for (const cause of causes.slice(1)) if (isErrorObject$1(cause)) {
			const message = readErrorText(cause, "message");
			if (message && formatted.includes(message)) seenMessages.add(message);
			else appendCauseMessage(message);
			const code = readProperty(cause, "code");
			if (typeof code === "string" || typeof code === "number") appendCauseMessage(String(code));
		} else if (typeof cause === "string") appendCauseMessage(cause);
		else appendCauseMessage(formatStatusAndCode(cause) ?? stringifyUnknown(cause));
	} else formatted = formatStatusAndCode(value) ?? stringifyUnknown(value);
	return options.redact ? options.redact(formatted) : formatted;
}
/**
* Normalizes an unknown thrown value into an Error. Non-Error objects become
* the `cause` and have their enumerable fields copied so structured details
* (codes, statuses) survive the coercion.
*/
function toErrorObject$1(value, fallbackMessage) {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value);
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
/** Preserves structured details while isolating hostile object field access. */
function toStructuredErrorObject(value) {
	if (value instanceof Error) return value;
	const message = String(value);
	if ((typeof value !== "object" || value === null) && typeof value !== "function") return toErrorObject$1(value, message);
	const error = new Error(message, { cause: value });
	try {
		const detailKeys = Reflect.ownKeys(value).filter((key) => (typeof key !== "string" || !STRUCTURED_ERROR_OWNED_FIELDS.has(key) && !STRUCTURED_ERROR_PROTOTYPE_FIELDS.has(key)) && Reflect.getOwnPropertyDescriptor(value, key)?.enumerable);
		for (const key of detailKeys) try {
			Object.defineProperty(error, key, {
				value: Reflect.get(value, key),
				writable: true,
				enumerable: true,
				configurable: true
			});
		} catch {}
	} catch {}
	return error;
}
/** Preserves Error values and stringifies every other value into a new Error. */
function toStringifiedError(value) {
	return value instanceof Error ? value : new Error(String(value));
}
/** Reads Error messages unchanged and stringifies every other value. */
function coerceErrorMessage(value) {
	return value instanceof Error ? value.message : String(value);
}
function extractErrorCode(err) {
	if (!err || typeof err !== "object") return;
	const code = readProperty(err, "code");
	return typeof code === "string" || typeof code === "number" ? String(code) : void 0;
}
function collectErrorGraphCandidates(err, resolveNested) {
	if (err == null) return [];
	const candidates = [err];
	const seen = (/* @__PURE__ */ new Set()).add(err);
	for (const current of candidates) {
		if (!current || typeof current !== "object" || !resolveNested) continue;
		for (const nested of resolveNested(current)) if (nested != null && !seen.has(nested)) {
			seen.add(nested);
			candidates.push(nested);
		}
	}
	return candidates;
}
function collectNestedErrorCandidates(err) {
	return collectErrorGraphCandidates(err, (current) => {
		const nested = [
			readProperty(current, "cause"),
			readProperty(current, "reason"),
			readProperty(current, "original"),
			readProperty(current, "error"),
			readProperty(current, "suppressed"),
			readProperty(current, "data")
		];
		const errors = readProperty(current, "errors");
		if (Array.isArray(errors)) nested.push(...errors);
		return nested;
	});
}
//#endregion
//#region packages/normalization-core/src/expect.ts
/** Returns the value or throws with the named context; use for genuine invariants only. */
function expectDefined(value, context) {
	if (value === null || value === void 0) throw new Error("expected " + context + " to be defined");
	return value;
}
//#endregion
//#region packages/normalization-core/src/number-coercion.ts
function asFiniteNumber(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
/** Returns a safe integer only when it satisfies the supplied inclusive bounds. */
function asSafeIntegerInRange(value, range) {
	if (typeof value !== "number" || !Number.isSafeInteger(value)) return;
	if (range.min !== void 0 && value < range.min) return;
	if (range.max !== void 0 && value > range.max) return;
	return value;
}
function asPositiveSafeInteger(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value > 0 ? value : void 0;
}
/** Conservative upper bound for Node timer delays. */
const MAX_TIMER_TIMEOUT_MS = 2147e6;
/** Largest timestamp accepted by JavaScript Date. */
const MAX_DATE_TIMESTAMP_MS = 864e13;
/** Resolves arbitrary timeout input with fallback and minimum timer bounds. */
function resolveTimerTimeoutMs(valueMs, fallbackMs, minMs = 1) {
	const value = asFiniteNumber(valueMs) ?? asFiniteNumber(fallbackMs);
	const min = Math.max(0, Math.floor(minMs));
	if (value === void 0) return min;
	return Math.min(Math.max(Math.floor(value), min), MAX_TIMER_TIMEOUT_MS);
}
/** Resolves an integer option from finite numeric input or fallback, then clamps bounds. */
function resolveIntegerOption(value, fallback, range = {}) {
	const candidate = asFiniteNumber(value) ?? fallback;
	const floored = Math.floor(candidate);
	const minBounded = range.min === void 0 ? floored : Math.max(range.min, floored);
	return range.max === void 0 ? minBounded : Math.min(range.max, minBounded);
}
function resolveNonNegativeIntegerOption(value, fallback) {
	return resolveIntegerOption(value, fallback, { min: 0 });
}
//#endregion
//#region packages/normalization-core/src/utf16-slice.ts
function isHighSurrogate(codeUnit) {
	return codeUnit >= 55296 && codeUnit <= 56319;
}
function isLowSurrogate(codeUnit) {
	return codeUnit >= 56320 && codeUnit <= 57343;
}
/** Slices a UTF-16 string without returning dangling surrogate halves at either edge. */
function sliceUtf16Safe(input, start, end) {
	const len = input.length;
	let from = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
	let to = end === void 0 ? len : end < 0 ? Math.max(len + end, 0) : Math.min(end, len);
	if (to <= from) return "";
	if (from > 0 && from < len) {
		if (isLowSurrogate(input.charCodeAt(from)) && isHighSurrogate(input.charCodeAt(from - 1))) from += 1;
	}
	if (to > 0 && to < len) {
		if (isHighSurrogate(input.charCodeAt(to - 1)) && isLowSurrogate(input.charCodeAt(to))) to -= 1;
	}
	return input.slice(from, to);
}
/** Truncates a UTF-16 string without cutting a surrogate pair in half. */
function truncateUtf16Safe(input, maxLen) {
	const limit = Math.max(0, Math.floor(maxLen));
	if (input.length <= limit) return input;
	return sliceUtf16Safe(input, 0, limit);
}
//#endregion
//#region src/secrets/ref-contract.ts
/** Provider alias used when a SecretRef omits a source-specific provider. */
const DEFAULT_SECRET_PROVIDER_ALIAS = "default";
//#endregion
//#region src/config/types.secrets.ts
const ENV_SECRET_TEMPLATE_RE = /^\$\{([A-Z][A-Z0-9_]{0,127})\}$/;
const ENV_SECRET_SHORTHAND_RE = /^\$([A-Z][A-Z0-9_]{0,127})$/;
/** Parse `$NAME` and `${NAME}` env-secret shorthand strings into env SecretRefs. */
function parseEnvTemplateSecretRef(value, provider = DEFAULT_SECRET_PROVIDER_ALIAS) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	const match = ENV_SECRET_TEMPLATE_RE.exec(trimmed) ?? ENV_SECRET_SHORTHAND_RE.exec(trimmed);
	if (!match) return null;
	return {
		source: "env",
		provider: provider.trim() || "default",
		id: expectDefined(match[1], "types.secrets regex capture 1")
	};
}
//#endregion
//#region src/config/env-substitution.ts
const ENV_VAR_NAME_PATTERN = /^[A-Z_][A-Z0-9_]*$/;
const DEFAULT_VALUE_OPERATOR = ":-";
/** Error thrown when a config value references a missing or empty environment variable. */
var MissingEnvVarError = class extends Error {
	constructor(varName, configPath) {
		super(`Missing env var "${varName}" referenced at config path: ${configPath}`);
		this.varName = varName;
		this.configPath = configPath;
		this.name = "MissingEnvVarError";
	}
};
/** Rebuilds the authored placeholder text for a parsed token. */
function renderEnvTemplateToken(token) {
	return token.defaultValue === void 0 ? `\${${token.name}}` : `\${${token.name}${DEFAULT_VALUE_OPERATOR}${token.defaultValue}}`;
}
function* iterateEnvTemplateTokens(value) {
	for (let index = value.indexOf("$"); index !== -1; index = value.indexOf("$", index + 1)) {
		const escaped = value[index + 1] === "$" && value[index + 2] === "{";
		if (!escaped && value[index + 1] !== "{") continue;
		const start = index + (escaped ? 3 : 2);
		const end = value.indexOf("}", start);
		if (end === -1) continue;
		const body = value.slice(start, end);
		const operatorIndex = body.indexOf(DEFAULT_VALUE_OPERATOR);
		const name = operatorIndex === -1 ? body : body.slice(0, operatorIndex);
		const defaultValue = operatorIndex === -1 ? void 0 : body.slice(operatorIndex + 2);
		if (!ENV_VAR_NAME_PATTERN.test(name) || defaultValue?.includes("$") || defaultValue?.includes("{")) continue;
		yield {
			kind: escaped ? "escaped" : "substitution",
			name,
			defaultValue,
			start: index,
			end
		};
		index = end;
	}
}
function substituteString(value, env, configPath, opts) {
	if (!value.includes("$")) return value;
	const authoredRef = parseEnvTemplateSecretRef(value);
	if (authoredRef && !containsEnvVarReference(value)) opts?.onPendingEnvSecretRef?.(authoredRef.id, configPath);
	const chunks = [];
	let end = 0;
	for (const token of iterateEnvTemplateTokens(value)) {
		chunks.push(value.slice(end, token.start));
		end = token.end + 1;
		if (token.kind === "escaped") {
			chunks.push(renderEnvTemplateToken(token));
			continue;
		}
		const envValue = env[token.name];
		if (envValue === void 0 || envValue === "") {
			if (token.defaultValue !== void 0) {
				chunks.push(token.defaultValue);
				continue;
			}
			if (opts?.onMissing) {
				opts.onMissing({
					varName: token.name,
					configPath
				});
				if (authoredRef?.id === token.name) opts.onPendingEnvSecretRef?.(token.name, configPath);
				chunks.push(renderEnvTemplateToken(token));
				continue;
			}
			throw new MissingEnvVarError(token.name, configPath);
		}
		if (authoredRef?.id === token.name) opts?.onResolvedEnvSecretRef?.(token.name, configPath);
		chunks.push(envValue);
	}
	chunks.push(value.slice(end));
	return chunks.join("");
}
/** Detects unescaped `${VAR}` references without treating escaped `$${VAR}` as references. */
function containsEnvVarReference(value) {
	for (const token of iterateEnvTemplateTokens(value)) if (token.kind === "substitution") return true;
	return false;
}
/** Resolve config string templates, preserving unresolved text when onMissing is supplied. */
function resolveConfigEnvVars(value, env = process.env, opts) {
	const pending = [];
	const visit = (current, currentPath) => {
		if (typeof current === "string") return substituteString(current, env, currentPath, opts);
		if (Array.isArray(current)) {
			const length = current.length;
			const result = [];
			result.length = length;
			let index = 0;
			pending.push(() => {
				while (index < length) {
					const key = index++;
					if (key in current) {
						result[key] = visit(current[key], `${currentPath}[${key}]`);
						return true;
					}
				}
				return false;
			});
			return result;
		}
		if (isPlainObject$1(current)) {
			const result = {};
			const entries = Object.entries(current)[Symbol.iterator]();
			pending.push(() => {
				const entry = entries.next();
				if (entry.done) return false;
				const [key, child] = entry.value;
				result[key] = visit(child, appendConfigPathSegment(currentPath, key));
				return true;
			});
			return result;
		}
		return current;
	};
	const result = visit(value, "");
	for (let next = pending.at(-1); next; next = pending.at(-1)) if (!next()) pending.pop();
	return result;
}
function getFsSafeTestHooks() {}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/write-open-flags.js
function resolveNonblockingWriteFlag(constants = fs.constants) {
	return process.platform !== "win32" && typeof constants.O_NONBLOCK === "number" ? constants.O_NONBLOCK : 0;
}
function isNonblockingWriteEnxio(error, flags) {
	return hasNodeErrorCode(error, "ENXIO") && (flags & (fs.constants.O_WRONLY | fs.constants.O_RDWR)) === fs.constants.O_WRONLY && (flags & resolveNonblockingWriteFlag()) !== 0;
}
async function isNonRegularWriteOpenError(error, filePath, flags) {
	return isNonRegularWriteOpenErrorSync(error, filePath, flags);
}
function isNonRegularWriteOpenErrorSync(error, filePath, flags) {
	if (!isNonblockingWriteEnxio(error, flags)) return false;
	try {
		return !fs.lstatSync(filePath).isFile();
	} catch {
		return false;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/symlink-parents.js
function outsideRootError(params, root) {
	return /* @__PURE__ */ new Error(`${params.messagePrefix ?? "Path"} must stay under ${root}.`);
}
function pathSegments(value) {
	return value.split(process.platform === "win32" ? /[/\\]+/ : /\/+/).filter((segment) => segment.length > 0 && segment !== ".");
}
function rawTargetSegments(root, targetPath) {
	const targetRoot = path.parse(targetPath).root;
	const absoluteTarget = `${resolvePathPreservingWindowsRoot(targetRoot || ".")}${path.sep}${targetPath.slice(targetRoot.length)}`;
	const rootSegments = pathSegments(root);
	const targetSegments = pathSegments(absoluteTarget);
	const fold = (segment) => process.platform === "win32" ? segment.toLowerCase() : segment;
	if (rootSegments.some((segment, index) => fold(segment) !== fold(targetSegments[index] ?? ""))) return;
	return targetSegments.slice(rootSegments.length);
}
function resolvePathWalk(params) {
	const rawRootDir = params.rootDir;
	assertNoWindowsPathAlias(rawRootDir, "filesystem", "root dir uses a Windows filesystem namespace alias");
	const rawTargetPath = params.targetPath;
	assertNoWindowsPathAlias(rawTargetPath, "filesystem", "target path uses a Windows filesystem namespace alias");
	const root = resolvePathPreservingWindowsRoot(rawRootDir);
	const lexicalTarget = resolvePathPreservingWindowsRoot(rawTargetPath);
	const relative = path.relative(root, lexicalTarget);
	if (isPathRelativeEscape(relative)) {
		if (params.allowOutsideRoot) return null;
		throw outsideRootError(params, root);
	}
	const segments = rawTargetSegments(root, rawTargetPath);
	if (!segments) throw outsideRootError(params, root);
	return {
		root,
		segments
	};
}
function formatUnsafePath(params, current) {
	return `${params.messagePrefix ?? "Path"} must not traverse symlinked directory: ${current}`;
}
function isFilesystemRoot(root) {
	return root === path.parse(root).root;
}
function assertNoSymlinkParentsSync(params) {
	const walk = resolvePathWalk(params);
	if (!walk) return;
	let current = walk.root;
	const walked = [];
	for (const [index, segment] of walk.segments.entries()) {
		if (segment === "..") {
			const top = walked[walked.length - 1];
			if (top?.kind === "dir") {
				walked.pop();
				current = walked[walked.length - 1]?.path ?? walk.root;
				continue;
			}
			if (top?.kind === "symlink") throw new Error(formatUnsafePath(params, top.path));
			if (!isFilesystemRoot(walk.root)) throw outsideRootError(params, walk.root);
			continue;
		}
		current = path.join(current, segment);
		try {
			const stat = fs.lstatSync(current);
			if (stat.isSymbolicLink()) {
				if (params.allowRootChildSymlink && path.dirname(current) === walk.root) {
					walked.push({
						path: current,
						kind: "symlink"
					});
					continue;
				}
				throw new Error(formatUnsafePath(params, current));
			}
			if ((params.requireDirectories || index < walk.segments.length - 1) && !stat.isDirectory()) throw new FsSafeError("not-file", `${params.messagePrefix ?? "Path"} must traverse directories: ${current}`);
			if (stat.isDirectory()) walked.push({
				path: current,
				kind: "dir"
			});
		} catch (err) {
			if (hasNodeErrorCode(err, "ENOENT") && params.allowMissing !== false) {
				if (process.platform === "win32" && walk.segments.slice(index + 1).includes("..")) throw new FsSafeError("invalid-path", `${params.messagePrefix ?? "Path"} must not cancel a missing directory: ${current}`);
				return;
			}
			throw err;
		}
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/regular-file.js
function resolveRegularFileAppendFlags(constants = fs.constants) {
	const noFollow = constants.O_NOFOLLOW;
	return constants.O_CREAT | constants.O_APPEND | constants.O_WRONLY | (typeof noFollow === "number" ? noFollow : 0) | resolveNonblockingWriteFlag(constants);
}
function assertRegularAppendStat(stat, filePath) {
	if (!stat.isFile()) throw new Error(`Refusing to append to non-file: ${filePath}`);
	if (stat.nlink > 1n) throw new Error(`Refusing to append to hardlinked file: ${filePath}`);
}
function throwAppendIdentityError(error, filePath) {
	if (isNotFoundPathError(error) || error instanceof FsSafeError && error.code === "path-mismatch") throw new Error(`Refusing to append after file changed: ${filePath}`, { cause: error });
	throw error;
}
function captureAppendOptions(options) {
	const filePath = options.filePath;
	assertNoWindowsPathAlias(filePath, "filesystem", "file path uses a Windows filesystem namespace alias");
	return {
		filePath,
		content: options.content,
		encoding: options.encoding ?? "utf8",
		mode: options.mode ?? 384,
		maxFileBytes: options.maxFileBytes,
		rejectSymlinkParents: options.rejectSymlinkParents
	};
}
function inspectAppendPath(filePath) {
	const stat = fs.lstatSync(filePath, { bigint: true });
	if (stat.isSymbolicLink()) throw new Error(`Refusing to append through symlink: ${filePath}`);
	if (!stat.isFile()) throw new Error(`Refusing to append to non-file: ${filePath}`);
	return stat;
}
function prepareRegularAppend(filePath, rejectSymlinkParents) {
	if (rejectSymlinkParents === true) {
		const unresolvedDir = path.dirname(filePath);
		assertNoSymlinkParentsSync({
			rootDir: path.parse(resolvePathPreservingWindowsRoot(unresolvedDir)).root,
			targetPath: unresolvedDir,
			allowMissing: false,
			allowRootChildSymlink: true,
			requireDirectories: true,
			messagePrefix: "Refusing to append under"
		});
	}
	try {
		return inspectFileIdentitySync(() => inspectAppendPath(filePath));
	} catch (error) {
		if (!isNotFoundPathError(error)) throw error;
	}
}
function inspectOpenedRegularAppend(fd, filePath, preOpenStat) {
	try {
		const identity = inspectFileIdentitySync(() => {
			const stat = fs.fstatSync(fd, { bigint: true });
			assertRegularAppendStat(stat, filePath);
			return stat;
		}, preOpenStat);
		inspectFileIdentitySync(() => {
			const current = fs.lstatSync(filePath, { bigint: true });
			assertRegularAppendStat(current, filePath);
			return current;
		}, identity);
		return identity;
	} catch (error) {
		throwAppendIdentityError(error, filePath);
	}
}
async function appendRegularFile(options) {
	const { filePath, content, encoding, mode, maxFileBytes, rejectSymlinkParents } = captureAppendOptions(options);
	const preOpenStat = prepareRegularAppend(filePath, rejectSymlinkParents);
	const contentBytes = Buffer.isBuffer(content) ? content.byteLength : Buffer.byteLength(content, encoding);
	if (maxFileBytes !== void 0 && Number(preOpenStat?.size ?? 0n) + contentBytes > maxFileBytes) return;
	await void 0;
	const flags = resolveRegularFileAppendFlags();
	let handle;
	try {
		handle = await fs$1.open(filePath, flags, mode);
	} catch (error) {
		if (await isNonRegularWriteOpenError(error, filePath, flags)) throw new Error(`Refusing to append to non-file: ${filePath}`);
		throw error;
	}
	try {
		const identity = inspectOpenedRegularAppend(handle.fd, filePath, preOpenStat);
		if (maxFileBytes !== void 0 && Number(identity.size) + contentBytes > maxFileBytes) return;
		await handle.chmod(mode);
		await handle.appendFile(content, encoding);
		if (mode & 3584) await handle.chmod(mode);
	} finally {
		await handle.close();
	}
}
function appendRegularFileSync(options) {
	const { filePath, content, encoding, mode, maxFileBytes, rejectSymlinkParents } = captureAppendOptions(options);
	const preOpenStat = prepareRegularAppend(filePath, rejectSymlinkParents);
	const contentBuffer = typeof content === "string" ? Buffer.from(content, encoding) : Buffer.from(content);
	if (maxFileBytes !== void 0 && Number(preOpenStat?.size ?? 0n) + contentBuffer.byteLength > maxFileBytes) return;
	const flags = resolveRegularFileAppendFlags();
	let fd;
	try {
		fd = fs.openSync(filePath, flags, mode);
	} catch (error) {
		if (isNonRegularWriteOpenErrorSync(error, filePath, flags)) throw new Error(`Refusing to append to non-file: ${filePath}`);
		throw error;
	}
	try {
		const identity = inspectOpenedRegularAppend(fd, filePath, preOpenStat);
		if (maxFileBytes !== void 0 && Number(identity.size) + contentBuffer.byteLength > maxFileBytes) return;
		fs.fchmodSync(fd, mode);
		fs.appendFileSync(fd, contentBuffer);
		if (mode & 3584) fs.fchmodSync(fd, mode);
	} finally {
		fs.closeSync(fd);
	}
}
//#endregion
//#region src/infra/boundary-path.ts
const runInBoundaryPathContext = AsyncLocalStorage.snapshot();
function resolvePathViaExistingAncestorSync(targetPath) {
	return runInBoundaryPathContext(resolvePathViaExistingAncestorSync$1, targetPath);
}
function resolveIdentityPathViaExistingAncestorSync(targetPath) {
	const fallback = path.resolve(targetPath);
	const missingSegments = [];
	let cursor = fallback;
	while (true) try {
		return path.join(fs.realpathSync.native(cursor), ...missingSegments.toReversed());
	} catch {
		const parent = path.dirname(cursor);
		if (parent === cursor) return fallback;
		missingSegments.push(path.basename(cursor));
		cursor = parent;
	}
}
//#endregion
//#region src/infra/deep-merge.ts
function sanitizePlainObject(value) {
	const sanitized = {};
	for (const [key, entry] of Object.entries(value)) {
		if (isBlockedObjectKey(key)) continue;
		sanitized[key] = isPlainObject$1(entry) ? sanitizePlainObject(entry) : entry;
	}
	return sanitized;
}
/** Merge plain objects while preserving OpenClaw's null, undefined, and array policies. */
function mergeDeep(base, override, options = {}) {
	const arrays = options.arrays ?? "replace";
	const undefinedValues = options.undefinedValues ?? "skip";
	if (Array.isArray(base) && Array.isArray(override)) return arrays === "concat" ? [...base, ...override] : override;
	if (!isPlainObject$1(base) || !isPlainObject$1(override)) return override === void 0 && undefinedValues === "skip" ? base : override;
	const merged = sanitizePlainObject(base);
	for (const [key, value] of Object.entries(override)) {
		if (isBlockedObjectKey(key) || value === void 0 && undefinedValues === "skip") continue;
		const current = merged[key];
		if (isPlainObject$1(value)) merged[key] = isPlainObject$1(current) ? mergeDeep(current, value, options) : sanitizePlainObject(value);
		else if (arrays === "concat" && Array.isArray(current) && Array.isArray(value)) merged[key] = [...current, ...value];
		else merged[key] = value;
	}
	return merged;
}
//#endregion
//#region src/infra/errno.ts
/** Classifies missing filesystem paths across Node and fs-safe boundaries. */
function isMissingPathError(err) {
	return hasNodeErrorCode(err, "ENOENT") || hasNodeErrorCode(err, "ENOTDIR") || hasNodeErrorCode(err, "not-found");
}
//#endregion
//#region packages/normalization-core/src/home-dir.ts
function normalizeHomeDirValue(value) {
	const trimmed = value?.trim();
	return trimmed && trimmed !== "undefined" && trimmed !== "null" ? trimmed : void 0;
}
function normalizeSafe(homedir) {
	try {
		return normalizeHomeDirValue(homedir());
	} catch {
		return;
	}
}
function resolveTermuxHome(env) {
	const prefix = normalizeHomeDirValue(env.PREFIX);
	if (!prefix || !normalizeHomeDirValue(env.ANDROID_DATA)) return;
	if (!/(?:^|\/)com\.termux\/files\/usr\/?$/u.test(prefix.replace(/\\/gu, "/"))) return;
	return path.resolve(prefix, "..", "home");
}
function resolveRawOsHomeDir(env, homedir) {
	return normalizeHomeDirValue(env.HOME) ?? normalizeHomeDirValue(env.USERPROFILE) ?? resolveTermuxHome(env) ?? normalizeSafe(homedir);
}
function resolveOsHomeDir(env = process.env, homedir = os.homedir) {
	const raw = resolveRawOsHomeDir(env, homedir);
	return raw ? path.resolve(raw) : void 0;
}
function resolveEffectiveHomeDir(env = process.env, homedir = os.homedir, options) {
	const explicitHome = normalizeHomeDirValue(env.OPENCLAW_HOME);
	if (!explicitHome) return resolveOsHomeDir(env, homedir);
	if (explicitHome === "~" || explicitHome.startsWith("~/") || explicitHome.startsWith("~\\")) {
		const osHome = resolveRawOsHomeDir(env, homedir);
		if (!osHome) return options?.preserveUnresolvedTilde ? path.resolve(explicitHome) : void 0;
		return path.resolve(explicitHome.replace(/^~(?=$|[\\/])/, () => osHome));
	}
	return path.resolve(explicitHome);
}
//#endregion
//#region src/infra/safe-cwd.ts
function tryProcessCwd() {
	try {
		return process.cwd();
	} catch {
		return;
	}
}
//#endregion
//#region src/infra/home-dir.ts
const userPathBaseDirectory = resolveGlobalSingleton(Symbol.for("openclaw.userPathBaseDirectory"), () => new AsyncLocalStorage());
/** Resolves the effective home or falls back to cwd when no home source exists. */
function resolveRequiredHomeDir(env = process.env, homedir = os.homedir) {
	const resolved = resolveEffectiveHomeDir(env, homedir) ?? tryProcessCwd();
	if (resolved) return path.resolve(resolved);
	throw new Error("Unable to resolve an OpenClaw home: set OPENCLAW_HOME, HOME, or USERPROFILE, or run from an existing directory.");
}
/** Resolves the OS home or falls back to cwd when no OS home source exists. */
function resolveRequiredOsHomeDir(env = process.env, homedir = os.homedir) {
	const resolved = resolveOsHomeDir(env, homedir) ?? tryProcessCwd();
	if (resolved) return path.resolve(resolved);
	throw new Error("Unable to resolve an OS home: set HOME or USERPROFILE, or run from an existing directory.");
}
/** Expands leading `~`, `~/`, or `~\` with the effective home when one is known. */
function expandHomePrefix(input, opts) {
	if (!input.startsWith("~")) return input;
	const home = normalizeHomeDirValue(opts?.home) ?? resolveEffectiveHomeDir(opts?.env ?? process.env, opts?.homedir ?? os.homedir);
	if (!home) return input;
	return input.replace(/^~(?=$|[\\/])/, () => home);
}
function resolvePathWithHome(input, opts, resolveHome) {
	const trimmed = input.trim();
	if (!trimmed) return trimmed;
	const expanded = trimmed.startsWith("~") ? expandHomePrefix(trimmed, {
		home: resolveHome(opts?.env ?? process.env, opts?.homedir ?? os.homedir),
		env: opts?.env,
		homedir: opts?.homedir
	}) : trimmed;
	const base = userPathBaseDirectory.getStore();
	return base ? path.resolve(base, expanded) : path.resolve(expanded);
}
/** Resolves a user-supplied path after trimming and expanding against the effective home. */
function resolveHomeRelativePath(input, opts) {
	return resolvePathWithHome(input, opts, resolveRequiredHomeDir);
}
/** Resolves a user path against the effective home, preserving an empty input. */
function resolveUserPath(input, env = process.env, homedir = os.homedir) {
	if (!input) return "";
	return resolveHomeRelativePath(input, {
		env,
		homedir
	});
}
//#endregion
//#region src/infra/config-dir.ts
/** Resolves the OpenClaw config directory from state/config env overrides or home. */
function resolveConfigDir(env = process.env, homedir = os.homedir) {
	const override = env.OPENCLAW_STATE_DIR?.trim();
	if (override) return resolveUserPath(override, env, homedir);
	const configPath = env.OPENCLAW_CONFIG_PATH?.trim();
	if (configPath) return path.dirname(resolveUserPath(configPath, env, homedir));
	return path.join(resolveRequiredHomeDir(env, homedir), ".openclaw");
}
//#endregion
//#region src/infra/path-guards.ts
/**
* Normalize a Windows path for boundary math whose result is handed back to callers.
*
* Unlike `normalizeWindowsPathForComparison`, this preserves case: `path.win32.relative`
* already matches roots case-insensitively, so lowercasing only corrupts the returned
* relative path — and callers create files from it on a case-preserving filesystem.
* Extended-length prefix stripping stays, or `\\?\`-prefixed inputs read as boundary escapes.
*/
function normalizeWindowsPathPreservingCase(input) {
	const normalized = path.win32.normalize(input);
	if (!normalized.startsWith("\\\\?\\")) return normalized;
	const withoutPrefix = normalized.slice(4);
	return withoutPrefix.toUpperCase().startsWith("UNC\\") ? `\\\\${withoutPrefix.slice(4)}` : withoutPrefix;
}
//#endregion
//#region src/infra/home-display.ts
/** Replace an absolute home path with its display prefix without clipping sibling paths. */
function shortenPathWithHome(input, { home, prefix }) {
	if (input === home) return prefix;
	if (input.startsWith(`${home}/`) || process.platform === "win32" && input.startsWith(`${home}\\`)) return `${prefix}${input.slice(home.length)}`;
	if (process.platform === "win32" && path.win32.isAbsolute(input) && isPathInside(home, input)) {
		const relative = path.win32.relative(normalizeWindowsPathPreservingCase(home), normalizeWindowsPathPreservingCase(input));
		return path.win32.join(prefix, relative);
	}
	return input;
}
//#endregion
//#region src/shared/regexp.ts
/** Escape text so it can be embedded literally inside a RegExp pattern. */
function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
//#endregion
//#region src/infra/abort-signal.ts
function isAbortError(error) {
	if (!error || typeof error !== "object") return false;
	try {
		if (("name" in error ? String(error.name) : "") === "AbortError") return true;
		return ("message" in error && typeof error.message === "string" ? error.message : "") === "This operation was aborted";
	} catch {
		return false;
	}
}
//#endregion
//#region src/utils.ts
/** Resolves the effective OpenClaw home directory, if one can be determined. */
function resolveHomeDir() {
	return resolveEffectiveHomeDir(process.env, os.homedir);
}
String.raw`(?<=^|[\s"'\x60(\[{<=:;]|file://)`;
String.raw`[\s"'\x60)\]}>]`;
String.raw`[:;](?=[/\\~$]|[A-Za-z]:)`;
function resolveHomeDisplayPrefix() {
	const home = resolveHomeDir();
	if (!home) return;
	if (normalizeHomeDirValue(process.env.OPENCLAW_HOME)) return {
		home,
		prefix: "$OPENCLAW_HOME"
	};
	return {
		home,
		prefix: "~"
	};
}
/** Replaces the leading home directory in a path with `~` or `$OPENCLAW_HOME`. */
function shortenHomePath(input) {
	const display = resolveHomeDisplayPrefix();
	if (!display) return input;
	return shortenPathWithHome(input, display);
}
resolveConfigDir();
//#endregion
//#region src/utils/parse-json-compat.ts
/**
* JSON parser compatibility helper for persisted config, manifests, and legacy stores.
* Strict JSON stays the fast path; JSON5 is only the authored/legacy fallback.
*/
let json5Runtime;
function isJson5Parser(value) {
	return typeof value === "object" && value !== null && "parse" in value && typeof value.parse === "function";
}
function setJson5Runtime(runtime) {
	const parser = isJson5Parser(runtime) ? runtime : typeof runtime === "object" && runtime !== null && "default" in runtime ? runtime.default : void 0;
	if (!isJson5Parser(parser)) throw new Error("json5 parser unavailable");
	json5Runtime = parser;
	return parser;
}
function loadJson5Parser() {
	if (json5Runtime) return json5Runtime;
	if (typeof SEALED_RUNTIME_BUILD === "boolean" && SEALED_RUNTIME_BUILD) throw new Error("sealed JSON5 runtime was not registered before use");
	return setJson5Runtime(createRequire(import.meta.url)("json5"));
}
/** Parses strict JSON first, then accepts JSON5 syntax such as comments and trailing commas. */
function parseJsonWithJson5Fallback(raw, json5) {
	try {
		return JSON.parse(raw);
	} catch {
		return (json5 ?? loadJson5Parser()).parse(raw);
	}
}
//#endregion
//#region src/config/includes.ts
/**
* Config includes: $include directive for modular configs
*
* @example
* ```json5
* {
*   "$include": "./base.json5",           // single file
*   "$include": ["./a.json5", "./b.json5"] // merge multiple
* }
* ```
*/
const INCLUDE_KEY = "$include";
const MAX_INCLUDE_FILE_BYTES = 2097152;
/** Maximum length for $include path and resolved path (CWE-22 hardening). */
const MAX_INCLUDE_PATH_LENGTH = 4096;
function hashConfigIncludeRaw(raw) {
	const hash = crypto.createHash("sha256");
	if (raw === null) hash.update("missing");
	else {
		hash.update("present\0");
		hash.update(raw, "utf-8");
	}
	return hash.digest("hex");
}
/** Resolve an include write target through its current ancestors and allowed roots. */
function resolveConfigIncludeWritePath(params) {
	const resolvedPath = path.normalize(path.resolve(params.includePath));
	const roots = [path.dirname(params.configPath), ...params.allowedRoots ?? []].filter((root) => path.isAbsolute(root)).map((root) => path.normalize(root));
	if (!roots.some((root) => isPathInside(root, resolvedPath))) throw new ConfigIncludeError(`Include write path escapes config directory: ${params.includePath}`, params.includePath);
	const canonicalPath = path.normalize(resolvePathViaExistingAncestorSync(resolvedPath));
	if (!roots.map((root) => path.normalize(safeRealpath(root))).some((root) => isPathInside(root, canonicalPath))) throw new ConfigIncludeError(`Include write path resolves outside config directory (symlink): ${params.includePath}`, params.includePath);
	return canonicalPath;
}
function isConfigContainer(value) {
	return Array.isArray(value) || isPlainObject$1(value);
}
function includeLogicalPath(link) {
	const parts = [];
	for (let current = link; current; current = current.parent) parts.push(current.key);
	return parts.toReversed();
}
var ConfigIncludeError = class extends Error {
	constructor(message, includePath, cause) {
		super(message);
		this.includePath = includePath;
		this.cause = cause;
		this.name = "ConfigIncludeError";
	}
};
/** File access failed; the included configuration has not been validated. */
var ConfigIncludeReadError = class extends ConfigIncludeError {
	constructor(..._args) {
		super(..._args);
		this.name = "ConfigIncludeReadError";
	}
};
var CircularIncludeError = class extends ConfigIncludeError {
	constructor(chain) {
		super(`Circular include detected: ${chain.join(" -> ")}`, expectDefined(chain[chain.length - 1], "chain entry at chain.length 1"));
		this.chain = chain;
		this.name = "CircularIncludeError";
	}
};
/** Deep merge: arrays concatenate, objects merge recursively, primitives: source wins */
function deepMerge(target, source) {
	return mergeDeep(target, source, {
		arrays: "concat",
		undefinedValues: "replace"
	});
}
var IncludeProcessor = class {
	constructor(basePath, resolver, boundary, rootProjectionKeys) {
		this.basePath = basePath;
		this.resolver = resolver;
		this.boundary = boundary;
		this.rootProjectionKeys = rootProjectionKeys;
	}
	get rootDir() {
		return this.boundary.configRoot.rootDir;
	}
	process(obj) {
		const stack = [];
		let current = this.traverseValue(obj, null, false, {
			basePath: this.basePath,
			visited: /* @__PURE__ */ new Set([path.normalize(this.basePath)]),
			depth: 0
		});
		let delivered = void 0;
		for (;;) {
			const step = current.next(delivered);
			if (step.done) {
				const parent = stack.pop();
				if (!parent) return step.value;
				delivered = step.value;
				current = parent;
				continue;
			}
			stack.push(current);
			current = this.traverseValue(step.value.value, step.value.pathLink, step.value.hasArrayAncestor, step.value.context);
		}
	}
	*traverseValue(value, pathLink, hasArrayAncestor, context) {
		if (Array.isArray(value)) {
			const result = [];
			for (const [index, item] of value.entries()) result.push(isConfigContainer(item) ? yield {
				value: item,
				pathLink: {
					parent: pathLink,
					key: String(index)
				},
				hasArrayAncestor: true,
				context
			} : item);
			return result;
		}
		if (!isPlainObject$1(value)) return value;
		if (!("$include" in value)) {
			const isRoot = pathLink === null;
			const result = {};
			for (const [key, entry] of Object.entries(value)) {
				if (isRoot && this.rootProjectionKeys && !this.rootProjectionKeys.has(key)) continue;
				result[key] = isConfigContainer(entry) ? yield {
					value: entry,
					pathLink: {
						parent: pathLink,
						key
					},
					hasArrayAncestor,
					context
				} : entry;
			}
			return result;
		}
		return yield* this.traverseInclude(value, pathLink, hasArrayAncestor, context);
	}
	*traverseInclude(obj, pathLink, hasArrayAncestor, context) {
		const includeValue = obj[INCLUDE_KEY];
		const isRoot = pathLink === null;
		const siblingKeys = Object.keys(obj).filter((key) => key !== "$include" && (!isRoot || !this.rootProjectionKeys || this.rootProjectionKeys.has(key)));
		const multiple = Array.isArray(includeValue);
		if (!multiple && typeof includeValue !== "string") throw new ConfigIncludeError(`Invalid $include value: expected string or array of strings, got ${typeof includeValue}`, String(includeValue));
		const entries = [];
		for (const item of multiple ? includeValue : [includeValue]) {
			if (typeof item !== "string") throw new ConfigIncludeError(`Invalid $include array item: expected string, got ${typeof item}`, String(item));
			const loaded = this.loadFileSync(item, context);
			entries.push({
				value: yield {
					value: loaded.parsed,
					pathLink,
					hasArrayAncestor,
					context: loaded.nestedContext
				},
				targetPath: loaded.resolvedPath
			});
		}
		const included = multiple ? entries.reduce((current, entry) => deepMerge(current, entry.value), {}) : entries[0].value;
		this.resolver.onIncludeResolved?.({
			path: includeLogicalPath(pathLink),
			value: included,
			kind: multiple ? "multiple" : "single",
			hasSiblingOverrides: siblingKeys.length > 0,
			hasArrayAncestor,
			...multiple ? { targetPaths: entries.map((entry) => entry.targetPath) } : { targetPath: entries[0].targetPath }
		});
		if (siblingKeys.length === 0) return included;
		if (!isPlainObject$1(included)) throw new ConfigIncludeError("Sibling keys require included content to be an object", typeof includeValue === "string" ? includeValue : INCLUDE_KEY);
		const rest = {};
		for (const key of siblingKeys) {
			const sibling = obj[key];
			rest[key] = isConfigContainer(sibling) ? yield {
				value: sibling,
				pathLink: {
					parent: pathLink,
					key
				},
				hasArrayAncestor,
				context
			} : sibling;
		}
		return deepMerge(included, rest);
	}
	loadFileSync(includePath, context) {
		const { resolvedPath, root } = this.resolvePath(includePath, context);
		if (context.visited.has(resolvedPath)) throw new CircularIncludeError([...context.visited, resolvedPath]);
		if (context.depth >= 10) throw new ConfigIncludeError(`Maximum include depth (10) exceeded at: ${includePath}`, includePath);
		const raw = this.readFile(includePath, resolvedPath, root);
		return {
			parsed: this.parseFile(includePath, resolvedPath, raw),
			resolvedPath,
			nestedContext: {
				basePath: resolvedPath,
				visited: /* @__PURE__ */ new Set([...context.visited, resolvedPath]),
				depth: context.depth + 1
			}
		};
	}
	resolvePath(includePath, context) {
		if (includePath.includes("\0")) throw new ConfigIncludeError("Include path must not contain null bytes", includePath);
		if (includePath.length >= MAX_INCLUDE_PATH_LENGTH) throw new ConfigIncludeError(`Include path exceeds maximum length (${MAX_INCLUDE_PATH_LENGTH} characters)`, includePath);
		const configDir = path.dirname(context.basePath);
		const resolved = path.isAbsolute(includePath) ? includePath : path.resolve(configDir, includePath);
		const normalized = path.normalize(resolved);
		if (normalized.length >= MAX_INCLUDE_PATH_LENGTH) throw new ConfigIncludeError(`Resolved include path exceeds maximum length (${MAX_INCLUDE_PATH_LENGTH} characters)`, includePath);
		const lexicalMatch = this.findContainingRoot(normalized, "rootDir");
		if (!lexicalMatch) throw new ConfigIncludeError(`Include path escapes config directory: ${includePath} (root: ${this.rootDir})`, includePath);
		this.resolver.onLexicalPath?.(normalized);
		try {
			const real = fs.realpathSync(normalized);
			const realMatch = this.findContainingRoot(real, "rootRealDir");
			if (!realMatch) throw new ConfigIncludeError(`Include path resolves outside config directory (symlink): ${includePath} (root: ${this.rootDir})`, includePath);
			return {
				resolvedPath: normalized,
				root: realMatch
			};
		} catch (err) {
			if (err instanceof ConfigIncludeError) throw err;
			if (isMissingPathError(err)) return {
				resolvedPath: normalized,
				root: lexicalMatch
			};
			throw new ConfigIncludeReadError(`Failed to resolve include file realpath: ${includePath} (resolved: ${normalized})`, includePath, err instanceof Error ? err : void 0);
		}
	}
	findContainingRoot(candidate, field) {
		if (isPathInside(this.boundary.configRoot[field], candidate)) return this.boundary.configRoot;
		for (const root of this.boundary.allowedRoots) if (isPathInside(root[field], candidate)) return root;
		return null;
	}
	readFile(includePath, resolvedPath, root) {
		try {
			if (this.resolver.readFileWithGuards) return this.resolver.readFileWithGuards({
				includePath,
				resolvedPath,
				rootRealDir: root.rootRealDir
			});
			return this.resolver.readFile(resolvedPath);
		} catch (err) {
			if (err instanceof ConfigIncludeError) throw err;
			throw new ConfigIncludeReadError(`Failed to read include file: ${includePath} (resolved: ${resolvedPath})`, includePath, err instanceof Error ? err : void 0);
		}
	}
	parseFile(includePath, resolvedPath, raw) {
		try {
			return this.resolver.parseJson(raw);
		} catch (err) {
			throw new ConfigIncludeError(`Failed to parse include file: ${includePath} (resolved: ${resolvedPath})`, includePath, err instanceof Error ? err : void 0);
		}
	}
};
function safeRealpath(target) {
	try {
		return fs.realpathSync(target);
	} catch {
		return target;
	}
}
/** Capture the lexical and canonical include roots once for a resolver traversal. */
function createConfigIncludeBoundary(configPath, allowedRoots = []) {
	const configRootDir = path.normalize(path.dirname(configPath));
	return {
		configRoot: {
			rootDir: configRootDir,
			rootRealDir: path.normalize(safeRealpath(configRootDir))
		},
		allowedRoots: allowedRoots.filter((entry) => typeof entry === "string" && entry.length > 0 && path.isAbsolute(entry)).map((entry) => {
			const rootDir = path.normalize(entry);
			return {
				rootDir,
				rootRealDir: path.normalize(safeRealpath(rootDir))
			};
		})
	};
}
function readConfigIncludeFileWithGuards(params) {
	const ioFs = params.ioFs ?? fs;
	const maxBytes = params.maxBytes ?? MAX_INCLUDE_FILE_BYTES;
	if (!canUseRootFileOpen(ioFs)) {
		const raw = ioFs.readFileSync(params.resolvedPath, "utf-8");
		try {
			params.onResolvedPath?.(path.normalize(ioFs.realpathSync(params.resolvedPath)));
		} catch {}
		return raw;
	}
	const opened = openRootFileSync({
		absolutePath: params.resolvedPath,
		rootPath: params.rootRealDir,
		rootRealPath: params.rootRealDir,
		boundaryLabel: "config directory",
		skipLexicalRootCheck: true,
		rejectSymlinks: false,
		maxBytes,
		ioFs
	});
	if (!opened.ok) {
		if (opened.reason === "validation") throw new ConfigIncludeError(`Include file failed security checks (regular file, max ${maxBytes} bytes, no hardlinks): ${params.includePath}`, params.includePath);
		throw new ConfigIncludeReadError(`Failed to read include file: ${params.includePath} (resolved: ${params.resolvedPath})`, params.includePath, opened.error instanceof Error ? opened.error : void 0);
	}
	try {
		const raw = ioFs.readFileSync(opened.fd, "utf-8");
		params.onResolvedPath?.(path.normalize(opened.path));
		return raw;
	} finally {
		ioFs.closeSync(opened.fd);
	}
}
const defaultResolver = {
	readFile: (p) => fs.readFileSync(p, "utf-8"),
	readFileWithGuards: readConfigIncludeFileWithGuards,
	parseJson: parseJsonWithJson5Fallback
};
/**
* Resolves all $include directives in a parsed config object.
*/
function resolveConfigIncludes(obj, configPath, resolver = defaultResolver, options = {}) {
	return new IncludeProcessor(configPath, resolver, createConfigIncludeBoundary(configPath, options.allowedRoots ?? [])).process(obj);
}
/**
* Resolves one top-level config field through the canonical include graph while
* leaving unrelated top-level branches untouched. Early bootstrap readers use
* this when a malformed sibling must not hide an independently valid setting.
*/
function resolveConfigIncludesForTopLevelKey(obj, configPath, key, resolver = defaultResolver, options = {}) {
	return new IncludeProcessor(configPath, resolver, createConfigIncludeBoundary(configPath, options.allowedRoots ?? []), /* @__PURE__ */ new Set([key])).process(obj);
}
//#endregion
//#region src/cli/profile-utils.ts
const PROFILE_NAME_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/i;
function isValidProfileName(value) {
	return PROFILE_NAME_RE.test(value);
}
function normalizeProfileName(raw) {
	const profile = raw?.trim();
	if (!profile) return null;
	if (normalizeLowercaseStringOrEmpty(profile) === "default") return null;
	if (!isValidProfileName(profile)) return null;
	return profile;
}
/** Resolve the canonical home-scoped state root for a validated CLI profile. */
function resolveProfileStateDir(profile, env, homedir) {
	const trimmed = profile.trim();
	if (!isValidProfileName(trimmed)) throw new Error(`Invalid profile name: ${JSON.stringify(profile)}`);
	const suffix = normalizeLowercaseStringOrEmpty(trimmed) === "default" ? "" : `-${trimmed}`;
	return path.join(resolveRequiredHomeDir(env, homedir), `.openclaw${suffix}`);
}
//#endregion
//#region src/config/state-dir.ts
function resolveNewStateDir(homedir = resolveRequiredHomeDir) {
	return path.join(homedir(), ".openclaw");
}
/**
* State directory for mutable data (sessions, logs, caches).
* Can be overridden via OPENCLAW_STATE_DIR.
* Default: ~/.openclaw
*/
function resolveStateDir(env = process.env, homedir = () => resolveRequiredHomeDir(env, os.homedir)) {
	const effectiveHomedir = () => resolveRequiredHomeDir(env, homedir);
	const override = env.OPENCLAW_STATE_DIR?.trim();
	if (override) return resolveHomeRelativePath(override, {
		env,
		homedir: effectiveHomedir
	});
	return resolveStateDirFromHome(env, effectiveHomedir);
}
/** Select a default state directory from the caller's already resolved home. */
function resolveStateDirFromHome(_env, effectiveHomedir) {
	return resolveNewStateDir(effectiveHomedir);
}
//#endregion
//#region src/config/paths.ts
/**
* Nix mode detection: When OPENCLAW_NIX_MODE=1, the gateway is running under Nix.
* In this mode:
* - No auto-install flows should be attempted
* - Missing dependencies should produce actionable Nix-specific error messages
* - Config is managed externally (read-only from Nix perspective)
*/
function resolveIsNixMode(env = process.env) {
	return env.OPENCLAW_NIX_MODE === "1";
}
resolveIsNixMode();
const CONFIG_FILENAME = "openclaw.json";
/** Build a homedir thunk that respects OPENCLAW_HOME for the given env. */
function envHomedir(env) {
	return () => resolveRequiredHomeDir(env, os.homedir);
}
function normalizePathForComparison(candidate) {
	const resolved = path.resolve(candidate);
	try {
		return fs.realpathSync.native(resolved);
	} catch {
		return resolved;
	}
}
/**
* Optional allowlist of directories that `$include` directives may resolve
* outside the config directory. Set via `OPENCLAW_INCLUDE_ROOTS` as a
* platform-delimited path list (`:` on POSIX, `;` on Windows).
*
* Each entry is tilde-expanded and resolved to an absolute path. Entries that
* cannot be resolved or that are not absolute after expansion are dropped.
*
* Returns an empty array when the var is unset or contains no usable entries,
* preserving the historical behavior where `$include` is confined to the
* directory containing `openclaw.json`.
*/
function resolveIncludeRoots(env = process.env, homedir = envHomedir(env)) {
	const raw = env.OPENCLAW_INCLUDE_ROOTS?.trim();
	if (!raw) return [];
	const effectiveHomedir = () => resolveRequiredHomeDir(env, homedir);
	const seen = /* @__PURE__ */ new Set();
	const roots = [];
	for (const entry of raw.split(path.delimiter)) {
		const trimmed = entry.trim();
		if (!trimmed) continue;
		const resolved = path.resolve(resolveHomeRelativePath(trimmed, {
			env,
			homedir: effectiveHomedir
		}));
		if (seen.has(resolved)) continue;
		seen.add(resolved);
		roots.push(resolved);
	}
	return roots;
}
resolveStateDir();
/**
* Resolve the explicitly selected or canonical config path.
*/
function resolveConfigPathCandidate(env = process.env, homedir = envHomedir(env)) {
	return resolveConfigPath(env, void 0, homedir);
}
/**
* Active config path.
*/
function resolveConfigPath(env = process.env, stateDir, homedir = envHomedir(env)) {
	const override = env.OPENCLAW_CONFIG_PATH?.trim();
	if (override) return resolveUserPath(override, env, homedir);
	return path.join(stateDir ?? resolveStateDir(env, homedir), CONFIG_FILENAME);
}
resolveConfigPathCandidate();
/**
* Gateway lock directory inside the selected state tree.
* Default: $OPENCLAW_STATE_DIR/tmp/openclaw-<uid> (uid suffix when available).
*/
function resolveGatewayLockDir(stateDir = resolveStateDir(), uid = typeof process.getuid === "function" ? process.getuid() : void 0) {
	return resolveGatewayLockDirForCanonicalStateDir(normalizePathForComparison(stateDir), uid);
}
/** Append the lock layout when the caller has already resolved the state directory. */
function resolveGatewayLockDirForCanonicalStateDir(stateDir, uid = typeof process.getuid === "function" ? process.getuid() : void 0) {
	const suffix = uid != null ? `openclaw-${uid}` : "openclaw";
	return path.join(stateDir, "tmp", suffix);
}
//#endregion
//#region src/logging/state.ts
const LOGGING_STATE_KEY = Symbol.for("openclaw.loggingState");
const APPLIED_LOGGING_CONFIG_UNOWNED = "unowned";
function createUnownedAppliedLoggingConfig() {
	return APPLIED_LOGGING_CONFIG_UNOWNED;
}
function createLoggingState() {
	return {
		appliedConfig: createUnownedAppliedLoggingConfig(),
		cachedLogger: null,
		cachedSettings: null,
		cachedConsoleSettings: null,
		overrideSettings: null,
		invalidEnvLogLevelValue: null,
		consolePatched: false,
		forceConsoleToStderr: false,
		earlyConsoleRoutingRestore: null,
		consoleTimestampPrefix: false,
		consoleSubsystemFilter: null,
		streamErrorHandlersInstalled: false,
		rawConsole: null
	};
}
const globalStore = globalThis;
const loggingState = globalStore[LOGGING_STATE_KEY] ?? createLoggingState();
if (!Object.hasOwn(loggingState, "appliedConfig")) loggingState.appliedConfig = APPLIED_LOGGING_CONFIG_UNOWNED;
globalStore[LOGGING_STATE_KEY] = loggingState;
//#endregion
//#region src/logging/config.ts
let cachedLoggingConfig;
function resolveLoggingConfigSelector() {
	const env = process.env;
	return [
		env.OPENCLAW_CONFIG_PATH,
		env.OPENCLAW_STATE_DIR,
		env.OPENCLAW_HOME,
		env.OPENCLAW_PROFILE,
		env.HOME,
		env.USERPROFILE,
		env.HOMEDRIVE,
		env.HOMEPATH,
		env.PREFIX,
		env.ANDROID_DATA,
		env.OPENCLAW_TEST_FAST,
		tryProcessCwd() ?? ""
	].map((value) => value ?? "").join("\0");
}
function resolvePartialDiagnosticLoggingConfig(logging) {
	if (!isRecord(logging)) return;
	const partial = {};
	if (typeof logging.consoleStyle === "string") try {
		const resolved = resolveConfigEnvVars({ consoleStyle: logging.consoleStyle });
		if (isRecord(resolved) && (resolved.consoleStyle === "pretty" || resolved.consoleStyle === "compact" || resolved.consoleStyle === "json")) partial.consoleStyle = resolved.consoleStyle;
	} catch {}
	if (Array.isArray(logging.redactPatterns)) try {
		const resolved = resolveConfigEnvVars({ redactPatterns: logging.redactPatterns });
		if (isRecord(resolved) && Array.isArray(resolved.redactPatterns) && resolved.redactPatterns.every((entry) => typeof entry === "string")) partial.redactPatterns = resolved.redactPatterns;
	} catch {}
	return Object.keys(partial).length > 0 ? partial : void 0;
}
/** Reads the logging block from config, caching by resolved config path. */
function readLoggingConfig() {
	try {
		if (loggingState.appliedConfig !== "unowned") return loggingState.appliedConfig;
		const selector = resolveLoggingConfigSelector();
		if (cachedLoggingConfig?.selector === selector) return cachedLoggingConfig.logging;
		const configPath = resolveConfigPath();
		if (!fs.existsSync(configPath)) {
			cachedLoggingConfig = {
				selector,
				logging: void 0
			};
			return;
		}
		const parsed = parseJsonWithJson5Fallback(fs.readFileSync(configPath, "utf8"));
		const allowedRoots = resolveIncludeRoots();
		let includedConfig;
		try {
			includedConfig = resolveConfigIncludesForTopLevelKey(parsed, configPath, "logging", void 0, { allowedRoots });
		} catch {
			const directLogging = isRecord(parsed) ? parsed.logging : void 0;
			if (directLogging === void 0) return;
			try {
				includedConfig = resolveConfigIncludes({ logging: directLogging }, configPath, void 0, { allowedRoots });
			} catch {
				return resolvePartialDiagnosticLoggingConfig(directLogging);
			}
		}
		let resolvedConfig;
		try {
			resolvedConfig = resolveConfigEnvVars(includedConfig);
		} catch {
			return resolvePartialDiagnosticLoggingConfig(isRecord(includedConfig) ? includedConfig.logging : void 0);
		}
		const logging = isRecord(resolvedConfig) ? resolvedConfig.logging : void 0;
		const resolvedLogging = isRecord(logging) ? logging : void 0;
		cachedLoggingConfig = {
			selector,
			logging: resolvedLogging
		};
		return resolvedLogging;
	} catch {
		return;
	}
}
//#endregion
//#region packages/acp-core/src/structured-auth-redaction.ts
const HTTP_AUTH_SCHEME_PATTERN = "[A-Za-z0-9!#$%&'*+.^_`|~-]+";
const HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN = String.raw`(?:\[REDACTED\]|[^\s\\"',;&#?<>)}\]]+)`;
const HTTP_AUTH_SERIALIZED_TAB_PATTERN = String.raw`\\{1,64}t`;
const HTTP_AUTH_SERIALIZED_INDENT_PATTERN = String.raw`(?:[ \t]+|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})`;
const HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t]*\r?\n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}r\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*|[ \t]*)`;
const HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t]*\r?\n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}r\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*|[ \t]+)`;
const HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t\r\n]*|[ \t]*\\{1,64}r\\{1,64}n(?:[ \t]*|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})|[ \t]*\\{1,64}n(?:[ \t]*|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*)`;
const HTTP_AUTH_HEADER_BOUNDARY_PATTERN = String.raw`(^|[^A-Za-z0-9_-]|\\{1,64}[rn])`;
const HTTP_AUTH_SERIALIZED_QUOTE_PATTERN = String.raw`(?:\\{1,64}["']|["']|)`;
String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}(?:x-goog-api-key|api-key|apikey|x-api-token|x-access-token)${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}([^\s\\"',;]+)`;
const STRUCTURED_AUTH_HEADER_RE = new RegExp(String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}(?:Proxy-)?Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(${HTTP_AUTH_SCHEME_PATTERN})${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}`, "giu");
const AUTH_PARAM_TOKEN_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~-]+/u;
const AWS_SCOPE_VALUE_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~:/-]+/u;
function skipHorizontalWhitespace(value, start) {
	let cursor = start;
	while (value[cursor] === " " || value[cursor] === "	") cursor += 1;
	return cursor;
}
function skipSerializedBackslashes(value, start) {
	let cursor = start;
	while (cursor - start < 64 && value[cursor] === "\\") cursor += 1;
	return cursor;
}
function readSerializedLineEnd(value, start) {
	const cursor = skipSerializedBackslashes(value, start);
	if (cursor === start) return null;
	if (value[cursor] === "n") return cursor + 1;
	if (value[cursor] !== "r") return null;
	const lineEnd = skipSerializedBackslashes(value, cursor + 1);
	return lineEnd > cursor + 1 && value[lineEnd] === "n" ? lineEnd + 1 : null;
}
function readSerializedTabEnd(value, start) {
	const cursor = skipSerializedBackslashes(value, start);
	return cursor > start && value[cursor] === "t" ? cursor + 1 : null;
}
function skipAuthWhitespace(value, start) {
	let cursor = start;
	for (;;) {
		cursor = skipHorizontalWhitespace(value, cursor);
		const tabEnd = readSerializedTabEnd(value, cursor);
		if (tabEnd !== null) {
			cursor = tabEnd;
			continue;
		}
		const lineEnd = value[cursor] === "\r" && value[cursor + 1] === "\n" ? cursor + 2 : value[cursor] === "\n" ? cursor + 1 : readSerializedLineEnd(value, cursor);
		if (lineEnd === null || value[lineEnd] !== " " && value[lineEnd] !== "	" && readSerializedTabEnd(value, lineEnd) === null) return cursor;
		cursor = lineEnd;
	}
}
function readAuthParamName(value, start) {
	const match = AUTH_PARAM_TOKEN_RE.exec(value.slice(start));
	return match ? {
		name: match[0].toLowerCase(),
		end: start + match[0].length
	} : null;
}
function isAuthHeaderStart(value, index) {
	const previous = value[index - 1];
	if (!((previous === "n" || previous === "r") && value[index - 2] === "\\") && previous !== void 0 && /[A-Za-z0-9_-]/u.test(previous)) return false;
	const proxyName = "proxy-authorization";
	const directName = "authorization";
	const candidate = value.slice(index, index + 19).toLowerCase();
	const name = candidate === proxyName ? proxyName : candidate.startsWith(directName) ? directName : null;
	if (!name) return false;
	const quoteStart = index + name.length;
	let cursor = skipSerializedBackslashes(value, quoteStart);
	if (value[cursor] === "\"" || value[cursor] === "'") cursor += 1;
	else if (cursor > quoteStart) return false;
	cursor = skipHorizontalWhitespace(value, cursor);
	return value[cursor] === ":" || value[cursor] === "=";
}
function findNextAuthParamStart(value, start) {
	let cursor = start;
	for (;;) {
		cursor = skipAuthWhitespace(value, cursor);
		if (cursor > start && isAuthHeaderStart(value, cursor)) return null;
		if (cursor >= value.length || value[cursor] === "\r" || value[cursor] === "\n" || value[cursor] === ";") return null;
		if (value[cursor] === ",") {
			cursor += 1;
			continue;
		}
		const param = readAuthParamName(value, cursor);
		if (param) {
			const equals = skipAuthWhitespace(value, param.end);
			if (value[equals] === "=" && value[equals + 1] !== "=") return cursor;
		}
		while (cursor < value.length) {
			const whitespaceEnd = skipAuthWhitespace(value, cursor);
			if (whitespaceEnd > cursor) {
				cursor = whitespaceEnd;
				continue;
			}
			if (cursor > start && isAuthHeaderStart(value, cursor)) return null;
			const char = value[cursor];
			if (char === "\r" || char === "\n" || char === ";") return null;
			cursor += 1;
			if (char === ",") break;
		}
	}
}
function usesAuthParams(scheme) {
	return scheme === "digest" || scheme === "hawk" || scheme.startsWith("aws4-");
}
function isAuthFieldEnd(char) {
	return char === void 0 || char === "\r" || char === "\n" || char === ";" || char === "\\" || char === "\"" || char === "'" || char === "}" || char === "]";
}
function findAuthFieldEnd(value, start) {
	let cursor = start;
	while (cursor < value.length) {
		const whitespaceEnd = skipAuthWhitespace(value, cursor);
		if (whitespaceEnd > cursor) {
			cursor = whitespaceEnd;
			continue;
		}
		if (cursor > start && isAuthHeaderStart(value, cursor)) break;
		if (isAuthFieldEnd(value[cursor])) break;
		cursor += 1;
	}
	return cursor;
}
function readParamValue(value, start, options) {
	let escapedQuoteSlashCount = 0;
	while (value[start + escapedQuoteSlashCount] === "\\") escapedQuoteSlashCount += 1;
	const escapedQuotes = escapedQuoteSlashCount > 0 && value[start + escapedQuoteSlashCount] === "\"";
	const quote = value[start] === "\"" || value[start] === "'" ? value[start] : void 0;
	if (quote || escapedQuotes) {
		let cursor = start + (escapedQuotes ? escapedQuoteSlashCount + 1 : 1);
		while (cursor < value.length) {
			if (value[cursor] === "\r" || value[cursor] === "\n") {
				const whitespaceEnd = skipAuthWhitespace(value, cursor);
				if (whitespaceEnd === cursor) break;
				cursor = whitespaceEnd;
				continue;
			}
			if (escapedQuotes && value[cursor] === "\\") {
				let slashEnd = cursor + 1;
				while (value[slashEnd] === "\\") slashEnd += 1;
				if (value[slashEnd] === "\"") {
					if ((slashEnd - cursor) % (2 * (escapedQuoteSlashCount + 1)) === escapedQuoteSlashCount) return slashEnd + 1;
					cursor = slashEnd + 1;
					continue;
				}
				cursor = slashEnd;
				continue;
			}
			if (!escapedQuotes && value[cursor] === "\\" && cursor + 1 < value.length) {
				cursor += 2;
				continue;
			}
			if (!escapedQuotes && value[cursor] === quote) return cursor + 1;
			cursor += 1;
		}
		return cursor > start + 1 ? cursor : null;
	}
	if (options.signedHeaders) {
		const match = /^:?[A-Za-z0-9!#$%&'*+.^_`|~-]+(?:;:?[A-Za-z0-9!#$%&'*+.^_`|~-]+)*/u.exec(value.slice(start));
		if (!match) return null;
		const end = start + match[0].length;
		const next = value[end];
		return next === void 0 || next === "," || next === " " || next === "	" || next === "\r" || next === "\n" ? end : null;
	}
	const match = (options.awsScope ? AWS_SCOPE_VALUE_RE : AUTH_PARAM_TOKEN_RE).exec(value.slice(start));
	return match ? start + match[0].length : null;
}
function findStructuredAuthParamRanges(value) {
	const ranges = [];
	for (const header of value.matchAll(STRUCTURED_AUTH_HEADER_RE)) {
		const scheme = (header[2] ?? "").toLowerCase();
		let cursor = (header.index ?? 0) + header[0].length;
		const rangeStart = cursor;
		let rangeEnd = cursor;
		const directParam = readAuthParamName(value, cursor);
		const directEquals = directParam ? skipAuthWhitespace(value, directParam.end) : void 0;
		if (!directParam || directEquals === void 0 || value[directEquals] !== "=" || value[directEquals + 1] === "=") {
			if (value[skipAuthWhitespace(value, cursor)] !== "," && !usesAuthParams(scheme)) continue;
			const firstParamStart = findNextAuthParamStart(value, cursor);
			if (firstParamStart === null) continue;
			cursor = firstParamStart;
		}
		for (;;) {
			const param = readAuthParamName(value, cursor);
			if (!param) break;
			cursor = skipAuthWhitespace(value, param.end);
			if (value[cursor] !== "=") break;
			cursor = skipAuthWhitespace(value, cursor + 1);
			const valueEnd = readParamValue(value, cursor, {
				awsScope: scheme.startsWith("aws4-") && param.name === "credential",
				signedHeaders: param.name === "signedheaders"
			});
			if (valueEnd === null) {
				const nextParamStart = findNextAuthParamStart(value, cursor);
				if (nextParamStart !== null) {
					cursor = nextParamStart;
					continue;
				}
				rangeEnd = Math.max(rangeEnd, findAuthFieldEnd(value, cursor));
				break;
			}
			rangeEnd = valueEnd;
			const separator = skipAuthWhitespace(value, valueEnd);
			if (value[separator] !== ",") {
				if (!isAuthFieldEnd(value[separator])) {
					const nextParamStart = findNextAuthParamStart(value, separator);
					if (nextParamStart !== null) {
						cursor = nextParamStart;
						continue;
					}
					rangeEnd = Math.max(rangeEnd, findAuthFieldEnd(value, separator));
				}
				break;
			}
			const nextParamStart = findNextAuthParamStart(value, separator + 1);
			if (nextParamStart === null) break;
			cursor = nextParamStart;
		}
		if (rangeEnd > rangeStart) ranges.push({
			start: rangeStart,
			end: rangeEnd
		});
	}
	return ranges;
}
function redactStructuredAuthHeaders(value, replacement) {
	const parts = [];
	let cursor = 0;
	for (const range of findStructuredAuthParamRanges(value)) {
		if (parts.length === 0 || range.start > cursor) parts.push(value.slice(cursor, range.start), replacement);
		cursor = Math.max(cursor, range.end);
	}
	parts.push(value.slice(cursor));
	return parts.join("");
}
//#endregion
//#region src/infra/map-size.ts
/** Prunes a Map in insertion order until it fits the requested maximum size. */
function pruneMapToMaxSize(map, maxSize) {
	if (Number.isNaN(maxSize) || maxSize === Number.POSITIVE_INFINITY) return;
	const limit = Math.max(0, Math.floor(maxSize));
	if (limit <= 0) {
		map.clear();
		return;
	}
	for (const key of map.keys()) {
		if (map.size <= limit) break;
		map.delete(key);
	}
}
//#endregion
//#region src/security/safe-regex.ts
const SAFE_REGEX_CACHE_MAX = 256;
const safeRegexCache = /* @__PURE__ */ new Map();
function createParseFrame() {
	return {
		lastToken: null,
		containsRepetition: false,
		hasAlternation: false,
		branchMinLength: 0,
		branchMaxLength: 0,
		altMinLength: null,
		altMaxLength: null
	};
}
function addLength(left, right) {
	if (!Number.isFinite(left) || !Number.isFinite(right)) return Number.POSITIVE_INFINITY;
	return left + right;
}
function multiplyLength(length, factor) {
	if (!Number.isFinite(length)) return factor === 0 ? 0 : Number.POSITIVE_INFINITY;
	return length * factor;
}
function recordAlternative(frame) {
	if (frame.altMinLength === null || frame.altMaxLength === null) {
		frame.altMinLength = frame.branchMinLength;
		frame.altMaxLength = frame.branchMaxLength;
		return;
	}
	frame.altMinLength = Math.min(frame.altMinLength, frame.branchMinLength);
	frame.altMaxLength = Math.max(frame.altMaxLength, frame.branchMaxLength);
}
function readQuantifier(source, index) {
	const ch = source[index];
	const consumed = source[index + 1] === "?" ? 2 : 1;
	if (ch === "*") return {
		consumed,
		minRepeat: 0,
		maxRepeat: null
	};
	if (ch === "+") return {
		consumed,
		minRepeat: 1,
		maxRepeat: null
	};
	if (ch === "?") return {
		consumed,
		minRepeat: 0,
		maxRepeat: 1
	};
	if (ch !== "{") return null;
	let i = index + 1;
	while (i < source.length && /\d/.test(source.charAt(i))) i += 1;
	if (i === index + 1) return null;
	const minRepeat = Number.parseInt(source.slice(index + 1, i), 10);
	let maxRepeat = minRepeat;
	if (source[i] === ",") {
		i += 1;
		const maxStart = i;
		while (i < source.length && /\d/.test(source.charAt(i))) i += 1;
		maxRepeat = i === maxStart ? null : Number.parseInt(source.slice(maxStart, i), 10);
	}
	if (source[i] !== "}") return null;
	i += 1;
	if (source[i] === "?") i += 1;
	if (maxRepeat !== null && maxRepeat < minRepeat) return null;
	return {
		consumed: i - index,
		minRepeat,
		maxRepeat
	};
}
function hasNestedRepetition(source) {
	const frames = [createParseFrame()];
	let inCharClass = false;
	const emitToken = (token) => {
		const frame = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
		frame.lastToken = token;
		if (token.containsRepetition) frame.containsRepetition = true;
		frame.branchMinLength = addLength(frame.branchMinLength, token.minLength);
		frame.branchMaxLength = addLength(frame.branchMaxLength, token.maxLength);
	};
	const emitSimpleToken = () => {
		emitToken({
			containsRepetition: false,
			hasAmbiguousAlternation: false,
			minLength: 1,
			maxLength: 1
		});
	};
	for (let i = 0; i < source.length; i += 1) {
		const ch = source[i];
		if (inCharClass) {
			if (ch === "\\") i += 1;
			else if (ch === "]") inCharClass = false;
			continue;
		}
		if (ch === "\\") {
			i += 1;
			emitSimpleToken();
			continue;
		}
		if (ch === "[") {
			inCharClass = true;
			emitSimpleToken();
			continue;
		}
		if (ch === "(") {
			frames.push(createParseFrame());
			continue;
		}
		if (ch === ")") {
			if (frames.length > 1) {
				const frame = frames.pop();
				if (frame.hasAlternation) recordAlternative(frame);
				const groupMinLength = frame.hasAlternation ? frame.altMinLength ?? 0 : frame.branchMinLength;
				const groupMaxLength = frame.hasAlternation ? frame.altMaxLength ?? 0 : frame.branchMaxLength;
				emitToken({
					containsRepetition: frame.containsRepetition,
					hasAmbiguousAlternation: frame.hasAlternation && frame.altMinLength !== null && frame.altMaxLength !== null && frame.altMinLength !== frame.altMaxLength,
					minLength: groupMinLength,
					maxLength: groupMaxLength
				});
			}
			continue;
		}
		if (ch === "|") {
			const frame = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
			frame.hasAlternation = true;
			recordAlternative(frame);
			frame.branchMinLength = 0;
			frame.branchMaxLength = 0;
			frame.lastToken = null;
			continue;
		}
		const quantifier = readQuantifier(source, i);
		if (!quantifier) {
			emitSimpleToken();
			continue;
		}
		i += quantifier.consumed - 1;
		const frame = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
		const previousToken = frame.lastToken;
		if (!previousToken) continue;
		if (previousToken.containsRepetition) return true;
		if (previousToken.hasAmbiguousAlternation && quantifier.maxRepeat === null) return true;
		const previousMinLength = previousToken.minLength;
		const previousMaxLength = previousToken.maxLength;
		previousToken.minLength = multiplyLength(previousToken.minLength, quantifier.minRepeat);
		previousToken.maxLength = quantifier.maxRepeat === null ? Number.POSITIVE_INFINITY : multiplyLength(previousToken.maxLength, quantifier.maxRepeat);
		previousToken.containsRepetition = true;
		frame.containsRepetition = true;
		frame.branchMinLength = frame.branchMinLength - previousMinLength + previousToken.minLength;
		frame.branchMaxLength = addLength(Number.isFinite(frame.branchMaxLength) && Number.isFinite(previousMaxLength) ? frame.branchMaxLength - previousMaxLength : Number.POSITIVE_INFINITY, previousToken.maxLength);
	}
	return false;
}
function compileSafeRegexDetailed(source, flags = "") {
	const trimmed = source.trim();
	if (!trimmed) return {
		regex: null,
		source: trimmed,
		flags,
		reason: "empty"
	};
	const cacheKey = `${flags}::${trimmed}`;
	const cached = safeRegexCache.get(cacheKey);
	if (cached) return cached;
	let result;
	if (hasNestedRepetition(trimmed)) result = {
		regex: null,
		source: trimmed,
		flags,
		reason: "unsafe-nested-repetition"
	};
	else try {
		result = {
			regex: new RegExp(trimmed, flags),
			source: trimmed,
			flags,
			reason: null
		};
	} catch {
		result = {
			regex: null,
			source: trimmed,
			flags,
			reason: "invalid-regex"
		};
	}
	safeRegexCache.set(cacheKey, result);
	pruneMapToMaxSize(safeRegexCache, SAFE_REGEX_CACHE_MAX);
	return result;
}
//#endregion
//#region src/security/config-regex.ts
function normalizeRejectReason(result) {
	if (result.reason === null || result.reason === "empty") return null;
	return result.reason;
}
/**
* Compile a single user-configured regex with the shared safe-regex guardrails.
* Returns null for blank patterns so optional config entries can be skipped silently.
*/
function compileConfigRegex(pattern, flags = "") {
	const result = compileSafeRegexDetailed(pattern, flags);
	if (result.reason === "empty") return null;
	return {
		regex: result.regex,
		pattern: result.source,
		flags: result.flags,
		reason: normalizeRejectReason(result)
	};
}
//#endregion
//#region src/logging/logger-file-message.ts
const MAX_FILE_LOG_MESSAGE_CHARS = 4096;
function clampMessage(text) {
	return text.length > MAX_FILE_LOG_MESSAGE_CHARS ? `${truncateUtf16Safe(text, MAX_FILE_LOG_MESSAGE_CHARS)}...(truncated)` : text;
}
function stringifyFileLogMessagePart(value, json) {
	if (json) return JSON.stringify(value);
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
	if (isRecord(value) && typeof value.message === "string") return value.message;
}
function serializeFileLogRecord(record, parts = []) {
	const ancestors = [];
	const materialized = JSON.parse(JSON.stringify(record, function(_key, value) {
		while (ancestors.length > 0 && ancestors.at(-1) !== this) ancestors.pop();
		if (typeof value === "bigint") return String(value);
		if (value !== null && typeof value === "object") {
			if (ancestors.includes(value)) return "[Circular]";
			ancestors.push(value);
		}
		return value;
	}));
	if (!isRecord(materialized)) throw new TypeError("File log records must serialize to objects");
	const text = [];
	for (const { key, json, primitiveText } of parts) {
		const part = primitiveText ?? stringifyFileLogMessagePart(materialized[key], json);
		if (part?.trim()) text.push(part);
	}
	if (text.length > 0) {
		const message = clampMessage(text.join(" "));
		if (Object.hasOwn(materialized, "message")) materialized.message = message;
		else {
			const entries = Object.entries(materialized);
			entries.splice(entries.findIndex(([key]) => key === "hostname") + 1, 0, ["message", message]);
			return JSON.stringify(Object.fromEntries(entries));
		}
	}
	return JSON.stringify(materialized);
}
//#endregion
//#region src/logging/redact-bounded.ts
const REDACT_REGEX_CHUNK_THRESHOLD = 32768;
const REDACT_REGEX_CHUNK_SIZE = 16384;
/** Applies a regex replacement in chunks once input crosses the redaction size threshold. */
function replacePatternBounded(text, pattern, replacer) {
	if (text.length <= REDACT_REGEX_CHUNK_THRESHOLD) return text.replace(pattern, replacer);
	let output;
	for (let index = 0; index < text.length; index += REDACT_REGEX_CHUNK_SIZE) {
		const chunk = text.slice(index, index + REDACT_REGEX_CHUNK_SIZE);
		const replaced = chunk.replace(pattern, replacer);
		if (output !== void 0) output += replaced;
		else if (replaced !== chunk) output = text.slice(0, index) + replaced;
	}
	return output ?? text;
}
//#endregion
//#region src/logging/redact-edit-composition.ts
/** Compose sorted, disjoint current-value edits while retaining original source spans. */
function composeRedactionEdits(length, previous, edits) {
	if (previous.length === 0) return edits;
	const pieces = [];
	let source = 0;
	for (const edit of previous) {
		if (source < edit.start) pieces.push({
			start: source,
			end: edit.start
		});
		pieces.push(edit);
		source = edit.end;
	}
	if (source < length) pieces.push({
		start: source,
		end: length
	});
	const output = [];
	let index = 0;
	let offset = 0;
	let position = 0;
	const consume = (end, keep) => {
		if (end === position) {
			const piece = pieces[index];
			if (!piece) return {
				start: length,
				end: length
			};
			const start = piece.replacement === void 0 ? piece.start + offset : piece.start;
			return {
				start,
				end: piece.replacement !== void 0 && offset > 0 ? piece.end : start
			};
		}
		let sourceStart;
		let sourceEnd = 0;
		while (position < end) {
			const piece = expectDefined(pieces[index], "current redaction piece");
			const size = piece.replacement?.length ?? piece.end - piece.start;
			const count = Math.min(size - offset, end - position);
			const start = piece.replacement === void 0 ? piece.start + offset : piece.start;
			const finish = piece.replacement === void 0 ? start + count : piece.end;
			sourceStart ??= start;
			sourceEnd = finish;
			if (keep && count > 0) output.push({
				start,
				end: finish,
				replacement: piece.replacement?.slice(offset, offset + count)
			});
			position += count;
			offset += count;
			if (offset === size) {
				index += 1;
				offset = 0;
			}
		}
		return {
			start: sourceStart ?? sourceEnd,
			end: sourceEnd
		};
	};
	for (const edit of edits) {
		consume(edit.start, true);
		output.push({
			...consume(edit.end, false),
			replacement: edit.replacement
		});
	}
	while (index < pieces.length) {
		const piece = expectDefined(pieces[index], "remaining redaction piece");
		consume(position + (piece.replacement?.length ?? piece.end - piece.start) - offset, true);
	}
	const composed = [];
	let fragments = [];
	let pending;
	const flush = () => {
		if (pending) {
			pending.replacement = fragments.join("");
			composed.push(pending);
			pending = void 0;
			fragments = [];
		}
	};
	for (const piece of output) {
		if (piece.replacement === void 0) {
			flush();
			continue;
		}
		const sameEmptySpan = pending && pending.start === piece.start && pending.end === piece.end && piece.start === piece.end;
		if (!pending || piece.start >= pending.end && !sameEmptySpan) {
			flush();
			pending = {
				start: piece.start,
				end: piece.end,
				replacement: ""
			};
		} else pending.end = Math.max(pending.end, piece.end);
		fragments.push(piece.replacement);
	}
	flush();
	return composed;
}
/** Project source-span replacements onto a value that already contains replacements. */
function rebaseRedactionEdits(previous, edits) {
	let shift = 0;
	const spans = previous.map((edit) => {
		const start = edit.start + shift;
		shift += edit.replacement.length - (edit.end - edit.start);
		return {
			...edit,
			currentStart: start,
			currentEnd: edit.end + shift
		};
	});
	const boundary = (position, end) => {
		let low = 0;
		let high = spans.length;
		while (low < high) {
			const middle = low + high >>> 1;
			const span = expectDefined(spans[middle], "source redaction span");
			if (span.end < position || span.end === position && span.start !== span.end) low = middle + 1;
			else high = middle;
		}
		const span = spans[low];
		if (span && (position > span.start || position === span.start && span.start === span.end)) return end ? span.currentEnd : span.currentStart;
		const before = spans[low - 1];
		return position + (before ? before.currentEnd - before.end : 0);
	};
	return edits.map((edit) => ({
		start: boundary(edit.start, false),
		end: boundary(edit.end, true),
		replacement: edit.replacement
	}));
}
function mergeRedactionEdits(edits) {
	edits.sort((left, right) => left.start - right.start || left.end - right.end);
	const merged = [];
	for (const edit of edits) {
		const previous = merged.at(-1);
		if (!previous || edit.start >= previous.end) merged.push({ ...edit });
		else if (edit.start !== previous.start || edit.end !== previous.end || edit.replacement !== previous.replacement) {
			previous.end = Math.max(previous.end, edit.end);
			previous.replacement = "***";
		}
	}
	return merged;
}
function applyRedactionEdits(value, edits) {
	const parts = [];
	let cursor = 0;
	for (const edit of mergeRedactionEdits(edits)) {
		parts.push(value.slice(cursor, edit.start), edit.replacement);
		cursor = edit.end;
	}
	return parts.join("") + value.slice(cursor);
}
//#endregion
//#region packages/net-policy/src/redact-sensitive-url.ts
const SENSITIVE_URL_QUERY_PARAM_NAMES = /* @__PURE__ */ new Set([
	"token",
	"key",
	"api_key",
	"apikey",
	"secret",
	"access_token",
	"auth_token",
	"password",
	"pass",
	"passwd",
	"auth",
	"jwt",
	"session",
	"id_token",
	"code",
	"client_secret",
	"app_secret",
	"hook_token",
	"refresh_token",
	"signature",
	"x_amz_signature",
	"x_amz_security_token",
	"private_key",
	"credential",
	"authorization",
	"sig",
	"x_api_key",
	"x_access_token",
	"x_auth_token"
]);
const URL_QUERY_NAME_SEPARATOR_RE = /[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu;
const SUFFIXED_OR_SCOPED_TOKEN_QUERY_PARAM_RE = /(?:^|_)token(?:_[a-f0-9]{16,})?$/u;
const MAX_NESTED_URL_REDACTION_DEPTH = 8;
function normalizeUrlQueryParamName(name) {
	let current = name.replace(URL_QUERY_NAME_SEPARATOR_RE, "");
	for (let depth = 0; depth <= MAX_NESTED_URL_REDACTION_DEPTH; depth += 1) {
		let decoded;
		try {
			decoded = decodeURIComponent(current).replace(URL_QUERY_NAME_SEPARATOR_RE, "");
		} catch {
			break;
		}
		if (decoded === current) return {
			value: normalizeLowercaseStringOrEmpty(current).replaceAll("-", "_"),
			unresolvedEncoding: false
		};
		current = decoded;
	}
	return {
		value: normalizeLowercaseStringOrEmpty(current).replaceAll("-", "_"),
		unresolvedEncoding: current.includes("%")
	};
}
/** True for auth-like URL query parameter names that should be redacted. */
function isSensitiveUrlQueryParamName(name) {
	const normalized = normalizeUrlQueryParamName(name);
	return normalized.unresolvedEncoding || SENSITIVE_URL_QUERY_PARAM_NAMES.has(normalized.value) || SUFFIXED_OR_SCOPED_TOKEN_QUERY_PARAM_RE.test(normalized.value);
}
//#endregion
//#region src/logging/redact-mask.ts
const DEFAULT_REDACT_MIN_LENGTH = 18;
const DEFAULT_REDACT_KEEP_START = 6;
const SECRET_VALUE_TRAILING_DELIMITER_RE = /(["'`,;)}\]]+)$/u;
const SECRET_VALUE_SUFFIX_RE = /^["'`,;)}\]]*$/u;
const SECRET_VALUE_QUOTE_CHARS = /* @__PURE__ */ new Set([
	"\"",
	"'",
	"`"
]);
function maskToken(token) {
	if (token.length < DEFAULT_REDACT_MIN_LENGTH) return "***";
	return `${sliceUtf16Safe(token, 0, DEFAULT_REDACT_KEEP_START)}…${sliceUtf16Safe(token, -4)}`;
}
function splitSecretValueForMask(token) {
	const openingQuote = token[0] ?? "";
	const contentStart = SECRET_VALUE_QUOTE_CHARS.has(openingQuote) ? 1 : 0;
	if (contentStart) {
		const closingQuoteIndex = token.lastIndexOf(openingQuote);
		if (closingQuoteIndex > 0) {
			const suffix = token.slice(closingQuoteIndex + 1);
			if (SECRET_VALUE_SUFFIX_RE.test(suffix)) return {
				maskable: token.slice(1, closingQuoteIndex),
				suffix,
				maskStart: 0,
				maskEnd: closingQuoteIndex + 1
			};
		}
	}
	const content = token.slice(contentStart);
	const trailingDelimiter = content.match(SECRET_VALUE_TRAILING_DELIMITER_RE)?.[1] ?? "";
	const maskable = trailingDelimiter && trailingDelimiter.length < content.length ? content.slice(0, -trailingDelimiter.length) : content;
	return {
		maskable,
		suffix: maskable === content ? "" : trailingDelimiter,
		maskStart: 0,
		maskEnd: contentStart + maskable.length
	};
}
function splitFormAwareCredentialValue(token) {
	const pairBoundary = token.search(/&[A-Za-z_][A-Za-z0-9_.-]*=/u);
	return pairBoundary < 0 ? {
		secret: token,
		suffix: ""
	} : {
		secret: token.slice(0, pairBoundary),
		suffix: token.slice(pairBoundary)
	};
}
function maskSecretValue(token, options) {
	const { maskable, suffix } = splitSecretValueForMask(token);
	return `${options?.hinted ? maskToken(maskable) : "***"}${suffix}`;
}
//#endregion
//#region src/logging/redact-pem.ts
const PEM_REDACT_PATTERN_SOURCE = String.raw`-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z ]*PRIVATE KEY-----`;
function createState() {
	return {
		scanner: {
			offset: 0,
			phase: "search",
			dashes: 0,
			keyword: "BEGIN ",
			keywordOffset: 0,
			start: 0,
			suffix: ""
		},
		matchEnd: 0
	};
}
function resetScanner(scanner, char) {
	scanner.phase = "search";
	scanner.dashes = char === "-" ? 1 : 0;
	scanner.suffix = "";
}
function* readDelimiters(text, scanner) {
	for (let index = 0; index < text.length; index += 1) {
		if (scanner.phase === "search" && scanner.dashes === 0) {
			const nextDash = text.indexOf("-", index);
			if (nextDash === -1) {
				scanner.offset += text.length - index;
				return;
			}
			scanner.offset += nextDash - index;
			index = nextDash;
		}
		const code = text.charCodeAt(index);
		const char = code >= 97 && code <= 122 ? String.fromCharCode(code - 32) : text.charAt(index);
		const offset = scanner.offset++;
		switch (scanner.phase) {
			case "search":
				if (char === "-") scanner.dashes = Math.min(5, scanner.dashes + 1);
				else if (scanner.dashes === 5 && (char === "B" || char === "E")) {
					scanner.phase = "keyword";
					scanner.keyword = char === "B" ? "BEGIN " : "END ";
					scanner.keywordOffset = 1;
					scanner.start = offset - 5;
				} else scanner.dashes = 0;
				break;
			case "keyword":
				if (char !== scanner.keyword.charAt(scanner.keywordOffset)) resetScanner(scanner, char);
				else if (++scanner.keywordOffset === scanner.keyword.length) {
					scanner.phase = "label";
					scanner.suffix = "";
				}
				break;
			case "label":
				if (char >= "A" && char <= "Z" || char === " ") scanner.suffix = (scanner.suffix + char).slice(-11);
				else if (char === "-" && scanner.suffix === "PRIVATE KEY") {
					scanner.phase = "close";
					scanner.dashes = 1;
				} else resetScanner(scanner, char);
				break;
			case "close": if (char !== "-") resetScanner(scanner, char);
			else if (++scanner.dashes === 5) {
				scanner.phase = "search";
				scanner.suffix = "";
				yield {
					kind: scanner.keyword === "BEGIN " ? "begin" : "end",
					start: scanner.start,
					end: offset + 1
				};
			}
		}
	}
}
function consumeDelimiter(state, delimiter) {
	if (!state.open) {
		if (delimiter.kind === "begin" && delimiter.start >= state.matchEnd) state.open = {
			start: delimiter.start,
			end: delimiter.end
		};
		return;
	}
	if (delimiter.kind !== "end" || delimiter.start <= state.open.end) return;
	const block = {
		start: state.open.start,
		end: delimiter.end,
		bodyStart: state.open.end,
		bodyEnd: delimiter.start
	};
	state.open = void 0;
	state.matchEnd = delimiter.end;
	return block;
}
function* matchPem(text, context, incomplete) {
	const state = {
		...context,
		scanner: { ...context.scanner },
		open: context.open && { ...context.open }
	};
	const origin = state.scanner.offset;
	for (const delimiter of readDelimiters(text, state.scanner)) {
		const block = consumeDelimiter(state, delimiter);
		if (!block) continue;
		const start = Math.max(0, (incomplete ? block.bodyStart : block.start) - origin);
		const end = (incomplete ? block.bodyEnd : block.end) - origin;
		if (end <= start) continue;
		yield {
			match: text.slice(start, end),
			groups: [],
			input: text,
			offset: start,
			...incomplete ? { replacement: "…redacted…" } : {}
		};
	}
	if (incomplete && state.open) {
		const start = Math.max(0, state.open.end - origin);
		if (start < text.length) yield {
			match: text.slice(start),
			groups: [],
			input: text,
			offset: start,
			replacement: "…redacted…"
		};
	}
}
const PEM_REDACT_MATCHER = {
	source: PEM_REDACT_PATTERN_SOURCE,
	exec(text) {
		return matchPem(text, createState(), false);
	},
	createContext() {
		let whenClosed = false;
		let whenOpen = true;
		return {
			resolve(active) {
				whenClosed = active ? whenOpen : whenClosed;
				whenOpen = whenClosed;
			},
			advance(text) {
				const state = createState();
				if (whenClosed) state.open = {
					start: -1,
					end: -1
				};
				for (const delimiter of readDelimiters(text, state.scanner)) consumeDelimiter(state, delimiter);
				return state.open !== void 0;
			},
			prepend() {
				const closed = createState();
				const open = createState();
				open.open = {
					start: -1,
					end: -1
				};
				return {
					consume(text) {
						for (const delimiter of readDelimiters(text, closed.scanner)) {
							consumeDelimiter(closed, delimiter);
							consumeDelimiter(open, delimiter);
						}
					},
					finish() {
						const nextClosed = closed.open ? whenOpen : whenClosed;
						const nextOpen = open.open ? whenOpen : whenClosed;
						whenClosed = nextClosed;
						whenOpen = nextOpen;
						return whenClosed === whenOpen;
					}
				};
			},
			pattern: {
				source: PEM_REDACT_PATTERN_SOURCE,
				exec(text) {
					const state = createState();
					if (whenClosed) state.open = {
						start: -1,
						end: -1
					};
					return matchPem(text, state, true);
				}
			}
		};
	}
};
//#endregion
//#region src/logging/redact-patterns.ts
const PAYMENT_CREDENTIAL_ENV_KEYS = String.raw`CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN`;
const PAYMENT_CREDENTIAL_QUERY_KEYS = String.raw`card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token`;
const PAYMENT_CREDENTIAL_JSON_KEYS = String.raw`cardNumber|card_number|cardCvc|card_cvc|cardCvv|card_cvv|cvc|cvv|securityCode|security_code|paymentCredential|payment_credential|sharedPaymentToken|shared_payment_token`;
const AWS_SECRET_ACCESS_KEY_FIELD_KEYS = String.raw`aws[-_]?secret[-_]?access[-_]?key|awsSecretAccessKey|SecretAccessKey`;
const AUTH_QUERY_KEYS = String.raw`access[-_]?token|auth[-_]?token|hook[-_]?token|refresh[-_]?token|id[-_]?token|api[-_]?key|apikey|client[-_]?secret|app[-_]?secret|private[-_]?key|${AWS_SECRET_ACCESS_KEY_FIELD_KEYS}|credential|authorization|token|key|secret|password|pass|passwd|auth|jwt|session|code|signature|x[-_]?amz[-_]?(?:signature|security[-_]?token)`;
const FORM_BODY_FIRST_PAIR_KEYS = String.raw`${AUTH_QUERY_KEYS}|app[-_]?secret|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
const STANDALONE_ASSIGNMENT_SECRET_KEYS = String.raw`access_token|refresh_token|id_token|auth[-_]?token|hook[-_]?token|api[-_]?key|client[-_]?secret|app[-_]?secret|private[-_]?key|authorization|jwt|token|secret|password|pass|passwd|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
const CONFIG_ASSIGNMENT_SECRET_KEYS = String.raw`access[-_]?token|refresh[-_]?token|id[-_]?token|auth[-_]?token|hook[-_]?token|api[-_]?(?:key|secret)|client[-_]?secret|app[-_]?secret|private[-_]?key|secret[-_]?key|key[-_]?material|authorization|jwt|token|secret|password|passphrase|pass|passwd|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
const CONFIG_COLON_ASSIGNMENT_SECRET_KEYS = String.raw`access[-_]?token|refresh[-_]?token|id[-_]?token|auth[-_]?token|hook[-_]?token|api[-_]?(?:key|secret)|client[-_]?secret|app[-_]?secret|private[-_]?key|secret[-_]?key|key[-_]?material|authorization|jwt|token|secret|password|passphrase|passwd|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
const CONFIG_DIRECT_ASSIGNMENT_SECRET_KEYS = String.raw`access-token|refresh-token|id-token|auth-token|hook-token|api[-_]?(?:key|secret)|secret[-_]?key|key[-_]?material|passphrase`;
const CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_SECRET_KEYS = String.raw`password|passphrase|pass|passwd`;
const CLI_SECRET_FLAG_KEYS = String.raw`${AWS_SECRET_ACCESS_KEY_FIELD_KEYS}|api[-_]?key|hook[-_]?token|access[-_]?token|refresh[-_]?token|id[-_]?token|token|secret|password|passwd|credential|private[-_]?key|client[-_]?secret|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
const FORM_BODY_KEY_INVISIBLE_CHARS = String.raw`\p{C}\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000\u115F\u1160\u3164\uFFA0`;
const ENV_ASSIGNMENT_REDACT_PATTERN = String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})\b\s*[=:]\s*(["']?)([^\s"'\\]+)\1/g`;
const ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN = String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})\b\s*[=:]\s*\\+(["'])([^\s"'\\]+)\\+\1/g`;
const STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN = String.raw`(^|[\s,;({\["])(?:${STANDALONE_ASSIGNMENT_SECRET_KEYS})=(["'\x60])((?:(?!\2)[^\r\n])+)\2`;
const STANDALONE_ASSIGNMENT_REDACT_PATTERN = String.raw`(^|[\s,;({\["])(?:${STANDALONE_ASSIGNMENT_SECRET_KEYS})=(["'\x60]?[^\s&#"'\x60<>]+)`;
const CONFIG_QUOTED_ASSIGNMENT_SECRET_KEYS = String.raw`access[-_]?token|refresh[-_]?token|id[-_]?token|auth[-_]?token|hook[-_]?token|api[-_]?(?:key|secret)|secret[-_]?key|key[-_]?material|authorization|jwt|token|secret|password|passphrase|pass|passwd|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
const CONFIG_QUOTED_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])(?:(?:${CONFIG_QUOTED_ASSIGNMENT_SECRET_KEYS})(?:\s*:\s*|\s+=\s*|=\s*)|[a-z0-9][a-z0-9._-]{0,79}[-_](?:${CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_SECRET_KEYS})\s*[:=]\s*|[a-z0-9_.-]{1,80}\.(?:${CONFIG_ASSIGNMENT_SECRET_KEYS})\s*[:=]\s*)(["'\x60])((?:(?!\2)[^\r\n])+)\2/g`;
const CONFIG_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])(?:(?:${CONFIG_COLON_ASSIGNMENT_SECRET_KEYS})\s*:\s*|(?:${CONFIG_ASSIGNMENT_SECRET_KEYS})(?:\s+=\s*|=\s+))([^\s#"'\x60<>]+)/g`;
const CONFIG_DIRECT_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])(?:${CONFIG_DIRECT_ASSIGNMENT_SECRET_KEYS})=([^\s#"'\x60<>]+)/g`;
const CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])[a-z0-9][a-z0-9._-]{0,79}[-_](?:${CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_SECRET_KEYS})\s*[:=]\s*([^\s#"'\x60<>]+)/g`;
const CONFIG_NAMESPACED_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])[a-z0-9_.-]{1,80}\.(?:${CONFIG_ASSIGNMENT_SECRET_KEYS})\s*[:=]\s*([^\s#"'\x60<>]+)/g`;
const STRUCTURED_JSON_SECRET_REDACT_PATTERN = String.raw`"(?:apiKey|api_key|apiToken|api_token|bearerToken|bearer_token|token|secret|password|passwd|${AWS_SECRET_ACCESS_KEY_FIELD_KEYS}|credential|authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token|accessToken|access_token|refreshToken|refresh_token|idToken|id_token|authToken|auth_token|clientSecret|client_secret|privateKey|private_key|secret_value|raw_secret|secret_input|key_material)"\s*:\s*"([^"]+)"`;
const STRUCTURED_JSON_PAYMENT_REDACT_PATTERN = String.raw`"(?:${PAYMENT_CREDENTIAL_JSON_KEYS})"\s*:\s*"([^"]+)"`;
const AMBIGUOUS_QUOTED_SECRET_FIELD_REDACT_PATTERN = String.raw`(^|[\s,{])["']?(?:api[-_]key|access[-_]token|refresh[-_]token|id[-_]token|authToken|auth[-_]token|clientSecret|client[-_]secret|appSecret|app[-_]secret|private[-_]key|credential|authorization|secret[-_]value|raw[-_]secret|secret[-_]input|key[-_]material)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`;
const AMBIGUOUS_QUOTED_AUTH_FIELD_REDACT_PATTERN = String.raw`(^|[\s,{])["']?(?:authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`;
const BASE64_SAFE_TOKEN_BOUNDARY = String.raw`(^|[^A-Za-z0-9])`;
const base64SafeToken = (token) => String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(?=${token})(?<!;base64,[A-Za-z0-9+/=]*)(${token})`;
const IDENTIFIER_SAFE_TOKEN_BOUNDARY = String.raw`(^|[^A-Za-z0-9_])`;
function isAwsValueCharacter(char) {
	const code = char.charCodeAt(0);
	return code >= 65 && code <= 90 || code >= 97 && code <= 122 || code >= 48 && code <= 57 || char === "/" || char === "+" || char === "=";
}
const AWS_SECRET_ACCESS_KEY_VALUE_RE = /(?=[A-Za-z0-9/+=]{0,39}[A-Z])(?=[A-Za-z0-9/+=]{0,39}[a-z])(?=[A-Za-z0-9/+=]{0,39}[0-9/+=])(?=[A-Za-z0-9/+=]{0,39}[G-Zg-z/+=])[A-Za-z0-9/+=]{40}/u;
function couldMatchAwsSecretAccessKey(text) {
	for (let end = 39; end < text.length;) {
		let cursor = end;
		while (cursor > end - 40 && isAwsValueCharacter(text[cursor])) cursor--;
		if (cursor === end - 40) return AWS_SECRET_ACCESS_KEY_VALUE_RE.test(text);
		end = cursor + 40;
	}
	return false;
}
const AWS_VALUE_WHITESPACE_RE = /\s/;
const AWS_URL_SCHEME_CHARACTER_RE = /[A-Za-z0-9+.-]/;
const AWS_URL_SCHEME_START_RE = /[A-Za-z]/;
function* matchAwsSecretAccessKeys(text) {
	if (!couldMatchAwsSecretAccessKey(text)) return;
	const closingDelimiters = {
		"\"": "\"",
		"'": "'",
		"`": "`",
		"<": ">",
		"(": ")",
		"[": "]",
		"{": "}"
	};
	let runStart = -1;
	let schemeStart = -1;
	let url;
	let backslashes = 0;
	const runs = [];
	for (let index = 0; index <= text.length; index++) {
		const char = text[index] ?? "";
		const whitespace = index === text.length || AWS_VALUE_WHITESPACE_RE.test(char);
		const escapeDepth = backslashes;
		backslashes = char === "\\" ? backslashes + 1 : 0;
		if (char && isAwsValueCharacter(char)) {
			if (runStart === -1) runStart = index;
		} else if (runStart !== -1) {
			if (index - runStart === 40) runs.push({
				start: runStart,
				end: index,
				origin: runStart,
				url
			});
			else if (index - runStart > 40 && char === "@" && text[index - 41] === "/") runs.push({
				start: index - 40,
				end: index,
				origin: runStart,
				url
			});
			runStart = -1;
		}
		if (whitespace) {
			if (url) url.end = Math.min(url.end, index);
			for (const run of runs) {
				const context = run.url;
				const publicUrl = context && !context.hasAt && context.portValid && (context.portStart === -1 || (context.authorityEnd === -1 ? context.end : context.authorityEnd) > context.portStart + 1);
				const before = text[run.start - 1] ?? "";
				const after = text[run.end] ?? "";
				const slashCredential = run.start !== run.origin;
				const portCredential = context && context.portStart !== -1 && run.origin === context.portStart + 1 && context.authorityEnd > run.origin && run.end > context.authorityEnd && after === "@";
				if (!slashCredential && (before === "_" || isAwsValueCharacter(before)) || after === "_" || text.slice(run.origin - 8, run.origin) === ";base64," || publicUrl && !portCredential && run.start >= context.start && run.end <= context.end) continue;
				const match = text.slice(run.start, run.end);
				if (AWS_SECRET_ACCESS_KEY_VALUE_RE.test(match)) yield {
					match,
					groups: [match],
					input: text,
					offset: run.start
				};
			}
			runs.length = 0;
			schemeStart = -1;
			url = void 0;
			continue;
		}
		if (url && index >= url.start) {
			if (char === url.closing && escapeDepth === url.closingEscapeDepth) {
				url.end = Math.min(url.end, index);
				url = void 0;
			} else {
				if ("?#\"'<>`|()[]{}".includes(char)) url.end = Math.min(url.end, index);
				url.queryOrFragment ||= char === "?" || char === "#";
				if (url.authorityEnd === -1) {
					url.hasAt ||= char === "@";
					if ("/?#".includes(char)) url.authorityEnd = index;
					else if (index < url.end) {
						if (char === ":") {
							url.portValid &&= url.portStart === -1;
							url.portStart = index;
						} else if (url.portStart !== -1 && (char < "0" || char > "9")) url.portValid = false;
					}
				}
			}
		}
		if (AWS_URL_SCHEME_CHARACTER_RE.test(char)) {
			if (schemeStart === -1) schemeStart = index;
		} else {
			if ((!url || index >= url.end && !url.queryOrFragment) && char === ":" && text.startsWith("//", index + 1) && schemeStart !== -1 && AWS_URL_SCHEME_START_RE.test(text[schemeStart])) {
				const opening = text[schemeStart - 1];
				let closingEscapeDepth = 0;
				for (let offset = schemeStart - 2; offset >= 0 && text[offset] === "\\"; offset--) closingEscapeDepth++;
				url = {
					start: index + 3,
					end: text.length,
					authorityEnd: -1,
					portStart: -1,
					portValid: true,
					hasAt: false,
					queryOrFragment: false,
					closing: opening ? closingDelimiters[opening] : void 0,
					closingEscapeDepth
				};
			}
			schemeStart = -1;
		}
	}
}
const AWS_SECRET_ACCESS_KEY_MATCHER = Object.freeze({
	source: "aws-secret-access-key",
	exec: matchAwsSecretAccessKeys,
	couldMatch: couldMatchAwsSecretAccessKey
});
const BARE_PASS_KEY_RE = new RegExp(String.raw`(?<![A-Za-z0-9])(pass|${CONFIG_COLON_ASSIGNMENT_SECRET_KEYS})\s*:\s*`, "gi");
const BARE_PASS_VALUE_RE = /[^\s#"'\x60<>]+/y;
const ASCII_WORD_CHAR_RE = /[A-Za-z0-9]/;
const INLINE_WHITESPACE_RE = /[ \t\r\n]/;
function* matchBarePassAssignments(text) {
	if (!/pass\s*:/.test(text)) return;
	const keys = [...text.matchAll(BARE_PASS_KEY_RE)];
	if (keys.length === 0) return;
	let next = 0;
	let assignmentSeen = false;
	for (let index = 0; index < text.length; index++) {
		const key = keys[next];
		if (!key) return;
		if (index === key.index) {
			next++;
			const before = text[index - 1] ?? "";
			const owned = key[1] !== "pass" || before === "." || before === "-" || before === "_";
			if (!(!owned && !assignmentSeen && before === " " && ASCII_WORD_CHAR_RE.test(text[index - 2] ?? ""))) {
				assignmentSeen = true;
				let end = index + key[0].length;
				if (!owned) {
					BARE_PASS_VALUE_RE.lastIndex = end;
					const value = BARE_PASS_VALUE_RE.exec(text)?.[0];
					if (value) {
						end += value.length;
						yield {
							match: text.slice(index, end),
							groups: [value],
							input: text,
							offset: index
						};
					}
				}
				let following = keys[next];
				while (following && following.index < end) {
					next++;
					following = keys[next];
				}
				index = end - 1;
				continue;
			}
		}
		const char = text[index];
		if (char === "\n" || char === "\r") assignmentSeen = false;
		else if (char === "=") assignmentSeen = true;
		else if (char === ":" && !INLINE_WHITESPACE_RE.test(text[index + 1] ?? " ")) assignmentSeen = true;
	}
}
const BARE_PASS_ASSIGNMENT_MATCHER = Object.freeze({
	source: "bare-pass-assignment",
	exec: matchBarePassAssignments
});
const TELEGRAM_BOT_TOKEN_REDACT_PATTERN = String.raw`\bbot(\d{6,}:[A-Za-z0-9_-]{20,})\b`;
const TELEGRAM_TOKEN_REDACT_PATTERN = String.raw`\b(\d{6,}:[A-Za-z0-9_-]{20,})\b`;
const CREDENTIAL_STYLE_HEADER_KEYS = "x-goog-api-key|api-key|apikey|x-api-token|x-access-token";
const GATEWAY_SECURITY_HEADER_KEYS = "X-OpenClaw-Token|x-pomerium-jwt-assertion|X-Api-Key|X-Auth-Token";
const LOG_HEADER_BOUNDARY_PATTERN = String.raw`(^|[^A-Za-z0-9_?&-]|\\{1,64}[rn])`;
const CREDENTIAL_STYLE_COLON_HEADER_REDACT_PATTERN = String.raw`${LOG_HEADER_BOUNDARY_PATTERN}(?:${CREDENTIAL_STYLE_HEADER_KEYS})${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*:${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}([^\s\\"',;]+)`;
const CREDENTIAL_STYLE_EQUALS_ASSIGNMENT_REDACT_PATTERN = String.raw`${LOG_HEADER_BOUNDARY_PATTERN}(?:${CREDENTIAL_STYLE_HEADER_KEYS})${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*=${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}([^\s\\"',;]+)`;
const GATEWAY_SECURITY_COLON_HEADER_REDACT_PATTERN = String.raw`${LOG_HEADER_BOUNDARY_PATTERN}(?:${GATEWAY_SECURITY_HEADER_KEYS})\s*:\s*([^\s"',;]+)`;
const GATEWAY_SECURITY_EQUALS_ASSIGNMENT_REDACT_PATTERN = String.raw`${LOG_HEADER_BOUNDARY_PATTERN}(?:${GATEWAY_SECURITY_HEADER_KEYS})\s*=\s*([^\s"',;]+)`;
const HTTP_AUTH_HEADER_REDACT_PATTERNS = [
	String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
	String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,
	String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic|Bot)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
	String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic|Bot)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,
	CREDENTIAL_STYLE_COLON_HEADER_REDACT_PATTERN,
	CREDENTIAL_STYLE_EQUALS_ASSIGNMENT_REDACT_PATTERN
];
const AUTHORIZATION_BEARER_REDACT_PATTERN = String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Bearer${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`;
const AUTHORIZATION_BASIC_REDACT_PATTERN = String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Basic${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`;
const AUTHORIZATION_BOT_REDACT_PATTERN = String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Bot${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`;
const STANDALONE_BEARER_REDACT_PATTERN = String.raw`\bBearer\s+([-A-Za-z0-9._~+/=]{18,})(?![-A-Za-z0-9._~+/=])`;
const DEFAULT_REDACT_FIELD_PATTERNS = [
	ENV_ASSIGNMENT_REDACT_PATTERN,
	ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN,
	STRUCTURED_JSON_SECRET_REDACT_PATTERN,
	STRUCTURED_JSON_PAYMENT_REDACT_PATTERN,
	AMBIGUOUS_QUOTED_SECRET_FIELD_REDACT_PATTERN,
	AMBIGUOUS_QUOTED_AUTH_FIELD_REDACT_PATTERN,
	String.raw`--(?:${CLI_SECRET_FLAG_KEYS})=([^\s"']+)`,
	String.raw`--(?:${CLI_SECRET_FLAG_KEYS})\s+(?!(?:or|and)\b(?=\s+--))(["']?)([^\s"']+)\1`,
	AUTHORIZATION_BEARER_REDACT_PATTERN,
	AUTHORIZATION_BASIC_REDACT_PATTERN,
	AUTHORIZATION_BOT_REDACT_PATTERN,
	...HTTP_AUTH_HEADER_REDACT_PATTERNS,
	GATEWAY_SECURITY_COLON_HEADER_REDACT_PATTERN,
	GATEWAY_SECURITY_EQUALS_ASSIGNMENT_REDACT_PATTERN,
	STANDALONE_BEARER_REDACT_PATTERN,
	String.raw`\b(?:https?|wss?|ftp):\/\/[^\/\s:@]*:([^\/\s@]+)@`,
	String.raw`\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|rediss?|amqps?):\/\/[^:\s/@]*:([^@\s]+)@`,
	String.raw`(^|[\s,;])(?:${FORM_BODY_FIRST_PAIR_KEYS})=([^&\s]+)(?=&[A-Za-z_][A-Za-z0-9_.-]*=)`,
	STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN,
	STANDALONE_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_QUOTED_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_ASSIGNMENT_REDACT_PATTERN,
	BARE_PASS_ASSIGNMENT_MATCHER,
	CONFIG_DIRECT_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_NAMESPACED_ASSIGNMENT_REDACT_PATTERN,
	PEM_REDACT_PATTERN_SOURCE,
	String.raw`(^|[\s,{])["']?(?:${AWS_SECRET_ACCESS_KEY_FIELD_KEYS})["']?\s*[:=]\s*(["']?)([A-Za-z0-9/+=]{40})(?![A-Za-z0-9/+=])\2`
];
const VENDOR_TOKEN_REDACT_PATTERNS = [
	String.raw`\b(sk-[A-Za-z0-9_-]{8,})\b`,
	String.raw`(ghp_[A-Za-z0-9]{10,})`,
	String.raw`(github_pat_[A-Za-z0-9_]{10,})`,
	String.raw`(gho_[A-Za-z0-9]{10,})`,
	String.raw`(ghu_[A-Za-z0-9]{10,})`,
	String.raw`(ghs_[A-Za-z0-9]{10,})`,
	String.raw`(ghr_[A-Za-z0-9]{10,})`,
	String.raw`(glpat-[A-Za-z0-9._=\-]{20,})`,
	String.raw`(gloas-(?:[A-Fa-f0-9]{65,}|[A-Za-z0-9_-]{64}|[A-Fa-f0-9]{32,}))`,
	String.raw`(gldt-[A-Za-z0-9_-]{20,})`,
	String.raw`(glcbt-[A-Za-z0-9]{1,5}_[A-Za-z0-9_-]{20,})`,
	String.raw`(glptt-[A-Za-z0-9_-]{40,})`,
	String.raw`(glft-(?:[A-Za-z0-9_-]{20,}|[a-h0-9]+-[0-9]+_))`,
	String.raw`(glimt-[A-Za-z0-9_-]{25,})`,
	String.raw`(glagent-[A-Za-z0-9_-]{50,})`,
	String.raw`(glwt-[A-Za-z0-9_-]{20,})`,
	String.raw`(glsoat-[A-Za-z0-9_-]{20,})`,
	String.raw`(glffct-[A-Za-z0-9_-]{20,})`,
	String.raw`(glrt-[A-Za-z0-9._-]{20,})`,
	String.raw`(glrtr?-[A-Za-z0-9_-]{27,300}\.[0-9a-z]{2}\.[0-9a-z]{9})`,
	String.raw`(GR1348941[A-Za-z0-9_-]{20,})`,
	String.raw`(_gitlab_session=[A-Za-z0-9%._-]{20,})`,
	String.raw`(xox[baprs]-[A-Za-z0-9-]{10,})`,
	String.raw`(xapp-[A-Za-z0-9-]{10,})`,
	String.raw`(https:\/\/hooks\.slack\.com\/(?:services\/T[A-Z0-9]+\/B[A-Z0-9]+|workflows\/T[A-Z0-9]+\/A[A-Z0-9]+\/[0-9]{17,19})\/[A-Za-z0-9]{20,})`,
	String.raw`(https:\/\/discord(?:app)?\.com\/api\/webhooks\/[0-9]{17,20}\/[A-Za-z0-9_-]{60,})`,
	String.raw`discord(?:.|\n|\r){0,40}?\b([A-Za-z0-9_-]{24}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27})\b`,
	String.raw`(gsk_[A-Za-z0-9_-]{10,})`,
	String.raw`(AIza[0-9A-Za-z\-_]{20,})`,
	String.raw`(ya29\.[0-9A-Za-z_\-./+=]{10,})`,
	String.raw`(1//0[0-9A-Za-z_\-./+=]{10,})`,
	String.raw`(GOCSPX-[A-Za-z0-9_-]{20,})`,
	String.raw`(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,
	String.raw`(pplx-[A-Za-z0-9_-]{10,})`,
	String.raw`(fal_[A-Za-z0-9_-]{10,})`,
	String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fc-[A-Za-z0-9]{10,})`,
	String.raw`(bb_live_[A-Za-z0-9_-]{10,})`,
	base64SafeToken(String.raw`gAAAA[A-Za-z0-9_=-]{20,}`),
	String.raw`(sk_live_[A-Za-z0-9]{10,})`,
	String.raw`(sk_test_[A-Za-z0-9]{10,})`,
	String.raw`(rk_live_[A-Za-z0-9]{10,})`,
	String.raw`(SG\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,
	String.raw`(npm_[A-Za-z0-9]{10,})`,
	String.raw`(pypi-[A-Za-z0-9_-]{10,})`,
	String.raw`(dop_v1_[A-Za-z0-9]{10,})`,
	String.raw`(doo_v1_[A-Za-z0-9]{10,})`,
	String.raw`(dor_v1_[A-Za-z0-9]{10,})`,
	String.raw`(dp\.(?:ct|pt|sa|scim|audit)\.[A-Za-z0-9]{40,44})`,
	String.raw`(dp\.st\.[A-Za-z0-9]{40,44})`,
	String.raw`(dp\.st\.[a-z0-9_-]{2,35}\.[A-Za-z0-9]{40,44})`,
	String.raw`(dckr_(?:pat|oat)_[A-Za-z0-9_-]{27,32})`,
	String.raw`(bkua_[a-z0-9]{40})`,
	String.raw`(CCIPAT_[A-Za-z0-9]{22}_[A-Fa-f0-9]{40})`,
	String.raw`(sbp_[a-z0-9]{40})`,
	base64SafeToken(String.raw`dapi[0-9a-f]{32}(?:-\d)?`),
	String.raw`(dd[pw]_[A-Za-z0-9]{36})`,
	String.raw`(glsa_[A-Za-z0-9_]{41})`,
	String.raw`(glc_eyJ[A-Za-z0-9+/=]{60,160})`,
	String.raw`(nfp_[A-Za-z0-9_]{36})`,
	String.raw`(CFPAT-[A-Za-z0-9_\-]{40,})`,
	base64SafeToken(String.raw`ATCTT3xFfG[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8}`),
	base64SafeToken(String.raw`ATATT[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8}`),
	base64SafeToken(String.raw`ATBB[A-Za-z0-9_=.-]{16,}`),
	String.raw`(BBDC-[A-Za-z0-9+/@_-]{40,50})`,
	String.raw`(HRKU-AA[A-Za-z0-9_-]{20,})`,
	String.raw`(pat-(?:eu|na)1-[A-Za-z0-9]{8}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{12})`,
	String.raw`(apify_api_[A-Za-z0-9\-]{20,})`,
	String.raw`(FlyV1 fm\d+_[A-Za-z0-9+/=,_-]{100,})`,
	String.raw`(fio-u-[A-Za-z0-9_-]{40,})`,
	String.raw`(^|[^A-Za-z0-9_])(am_[A-Za-z0-9_-]{10,})`,
	String.raw`(^|[^A-Za-z0-9_])(sk_[A-Za-z0-9_]{10,})`,
	String.raw`(tvly-[A-Za-z0-9]{10,})`,
	String.raw`(exa_[A-Za-z0-9]{10,})`,
	String.raw`(syt_[A-Za-z0-9]{10,})`,
	String.raw`(retaindb_[A-Za-z0-9]{10,})`,
	String.raw`(hsk-[A-Za-z0-9]{10,})`,
	String.raw`(mem0_[A-Za-z0-9]{10,})`,
	String.raw`(brv_[A-Za-z0-9]{10,})`,
	String.raw`(xai-[A-Za-z0-9]{30,})`,
	String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fw-[A-Za-z0-9]{30,})`,
	String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fw_[A-Za-z0-9]{30,})`,
	String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fpk_[A-Za-z0-9]{30,})`,
	base64SafeToken(String.raw`AKIA[A-Z0-9]{16}`),
	base64SafeToken(String.raw`ASIA[A-Z0-9]{16}`),
	String.raw`(AKID[A-Za-z0-9]{10,})`,
	String.raw`(LTAI[A-Za-z0-9]{10,})`,
	String.raw`(hf_[A-Za-z0-9]{10,})`,
	String.raw`(api_org_[A-Za-z0-9]{20,})`,
	String.raw`(r8_[A-Za-z0-9]{10,})`,
	TELEGRAM_BOT_TOKEN_REDACT_PATTERN,
	TELEGRAM_TOKEN_REDACT_PATTERN
];
const DEFAULT_REDACT_PATTERNS = [
	...DEFAULT_REDACT_FIELD_PATTERNS,
	...VENDOR_TOKEN_REDACT_PATTERNS,
	AWS_SECRET_ACCESS_KEY_MATCHER
];
function createBackendRedactPatterns() {
	const bodySecretKeys = /* @__PURE__ */ new Set([
		"access_token",
		"auth_token",
		"awssecretaccesskey",
		"aws_secret_access_key",
		"hook_token",
		"refresh_token",
		"id_token",
		"token",
		"api_key",
		"apikey",
		"client_secret",
		"app_secret",
		"password",
		"pass",
		"passwd",
		"auth",
		"jwt",
		"session",
		"code",
		"signature",
		"x_amz_signature",
		"x_amz_security_token",
		"secret",
		"secretaccesskey",
		"credential",
		"private_key",
		"authorization",
		"key",
		"card_number",
		"card_cvc",
		"card_cvv",
		"cvc",
		"cvv",
		"security_code",
		"payment_credential",
		"shared_payment_token"
	]);
	const credentialHeaderField = new RegExp(`^(?:${CREDENTIAL_STYLE_HEADER_KEYS}|${GATEWAY_SECURITY_HEADER_KEYS})$`, "i");
	const formAware = /* @__PURE__ */ new Set([CREDENTIAL_STYLE_EQUALS_ASSIGNMENT_REDACT_PATTERN, GATEWAY_SECURITY_EQUALS_ASSIGNMENT_REDACT_PATTERN]);
	const shellReferencePreserving = /* @__PURE__ */ new Set([
		ENV_ASSIGNMENT_REDACT_PATTERN,
		ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN,
		STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN,
		STANDALONE_ASSIGNMENT_REDACT_PATTERN
	]);
	const CONFIG_KEY_PROBE = new RegExp(String.raw`[:=](?<=(?:${CONFIG_ASSIGNMENT_SECRET_KEYS})\s*[:=])`);
	const CONFIG_QUOTED_PROBE = new RegExp(String.raw`[:=](?<=(?:${CONFIG_ASSIGNMENT_SECRET_KEYS})\s*[:=])\s*["'\x60]`);
	const CONFIG_NAMESPACED_PROBE = new RegExp(String.raw`[:=](?<=\.(?:${CONFIG_ASSIGNMENT_SECRET_KEYS})\s*[:=])`);
	const STANDALONE_ASSIGNMENT_PROBE = new RegExp(String.raw`=(?<=(?:^|[\s,;({\["])(?:${STANDALONE_ASSIGNMENT_SECRET_KEYS})=)`, "i");
	return {
		bodySecretKeys,
		credentialHeaderField,
		formAware,
		shellReferencePreserving,
		prefilters: new Map([
			[ENV_ASSIGNMENT_REDACT_PATTERN, (text) => /KEY|TOKEN|SECRET|PASSWORD|PASSWD|CARD|CVC|CVV|SECURITY|PAYMENT/.test(text)],
			[ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN, (text) => text.includes("\\")],
			[STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN, (text) => /[=]["'`]/.test(text)],
			[STANDALONE_ASSIGNMENT_REDACT_PATTERN, (text) => STANDALONE_ASSIGNMENT_PROBE.test(text)],
			[CONFIG_QUOTED_ASSIGNMENT_REDACT_PATTERN, (text) => /["'`]/.test(text) && CONFIG_QUOTED_PROBE.test(text)],
			[CONFIG_ASSIGNMENT_REDACT_PATTERN, (text) => (text.includes(":") || text.includes("=")) && CONFIG_KEY_PROBE.test(text)],
			[CONFIG_DIRECT_ASSIGNMENT_REDACT_PATTERN, (text) => text.includes("=")],
			[CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_REDACT_PATTERN, (text) => /[-_](?:password|passphrase|pass|passwd)\s*[:=]/.test(text)],
			[CONFIG_NAMESPACED_ASSIGNMENT_REDACT_PATTERN, (text) => CONFIG_NAMESPACED_PROBE.test(text)],
			[AMBIGUOUS_QUOTED_SECRET_FIELD_REDACT_PATTERN, (text) => /["']/.test(text)],
			[AMBIGUOUS_QUOTED_AUTH_FIELD_REDACT_PATTERN, (text) => /["']/.test(text)],
			...HTTP_AUTH_HEADER_REDACT_PATTERNS.slice(0, 4).map((raw) => [raw, (text) => /authorization/i.test(text)]),
			[CREDENTIAL_STYLE_COLON_HEADER_REDACT_PATTERN, (text) => /api-key|apikey|api-token|access-token/i.test(text)],
			[CREDENTIAL_STYLE_EQUALS_ASSIGNMENT_REDACT_PATTERN, (text) => /api-key|apikey|api-token|access-token/i.test(text)],
			[STRUCTURED_JSON_SECRET_REDACT_PATTERN, (text) => text.includes("\"")],
			[STRUCTURED_JSON_PAYMENT_REDACT_PATTERN, (text) => text.includes("\"")],
			[GATEWAY_SECURITY_COLON_HEADER_REDACT_PATTERN, (text) => /x-openclaw-token|x-pomerium-jwt-assertion|x-api-key|x-auth-token/i.test(text)],
			[GATEWAY_SECURITY_EQUALS_ASSIGNMENT_REDACT_PATTERN, (text) => /x-openclaw-token|x-pomerium-jwt-assertion|x-api-key|x-auth-token/i.test(text)]
		]),
		chunkUnsafe: /* @__PURE__ */ new Set([
			TELEGRAM_BOT_TOKEN_REDACT_PATTERN,
			TELEGRAM_TOKEN_REDACT_PATTERN,
			AUTHORIZATION_BEARER_REDACT_PATTERN,
			AUTHORIZATION_BASIC_REDACT_PATTERN,
			AUTHORIZATION_BOT_REDACT_PATTERN,
			STANDALONE_BEARER_REDACT_PATTERN,
			...HTTP_AUTH_HEADER_REDACT_PATTERNS,
			...VENDOR_TOKEN_REDACT_PATTERNS.filter((source) => source.startsWith(BASE64_SAFE_TOKEN_BOUNDARY))
		])
	};
}
//#endregion
//#region src/logging/redact-form-body.ts
const FORM_BODY_KEY_OBFUSCATION_RE = new RegExp(String.raw`[${FORM_BODY_KEY_INVISIBLE_CHARS}+]`, "gu");
const FORM_BODY_KEY_SEPARATOR_RE = /[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu;
const FORM_BODY_PERCENT_ESCAPE_RE = /%[0-9A-Fa-f]{2}/u;
const FORM_BODY_KEY = String.raw`[${FORM_BODY_KEY_INVISIBLE_CHARS}+]*(?:[A-Za-z_]|%[0-9A-Fa-f]{2})(?:[A-Za-z0-9_.-]|%[0-9A-Fa-f]{2}|[${FORM_BODY_KEY_INVISIBLE_CHARS}+])*`;
const FORM_BODY_VALUE = "[^&\\s<>]*";
const URL_QUERY_VALUE = "[^&#\\s<>]*";
const FORM_BODY_PAIR = String.raw`${FORM_BODY_KEY}=${FORM_BODY_VALUE}`;
const FORM_BODY_RE = new RegExp(String.raw`^${FORM_BODY_PAIR}(?:&${FORM_BODY_PAIR})+$`, "u");
const FORM_BODY_SUBSTRING_RE = new RegExp(String.raw`(^|[\s:({\[,="'` + "`" + String.raw`])(${FORM_BODY_PAIR}(?:&${FORM_BODY_PAIR})+)`, "gu");
const ENCODED_FORM_PAIR_RE = new RegExp(String.raw`(^|[\s:({\[,="'` + "`" + String.raw`&])(${FORM_BODY_KEY})=(${FORM_BODY_VALUE})`, "gu");
const FORM_BODY_CONTEXT_SINGLE_PAIR_RE = new RegExp(String.raw`(\b(?:body|form(?:[-_\s]?body)?)\s*[:=]\s*(["'\x60]?))(${FORM_BODY_KEY})=(${FORM_BODY_VALUE})(["'\x60]?)`, "giu");
const URL_QUERY_PAIR_RE = new RegExp(String.raw`([?&])(${FORM_BODY_KEY})=(${URL_QUERY_VALUE})`, "gu");
const FORM_BODY_LINE_BREAK_SPLIT_RE = /(\r\n|\r|\n)/u;
const FORM_BODY_LINE_BREAK_SEGMENT_RE = /^(?:\r\n|\r|\n)$/u;
function createFormBodyRedactor(bodySecretKeys) {
	function normalizeSensitiveKeyName(value) {
		const stripped = value.replace(FORM_BODY_KEY_SEPARATOR_RE, "");
		try {
			return decodeURIComponent(stripped).replace(FORM_BODY_KEY_SEPARATOR_RE, "").toLowerCase().replaceAll("-", "_");
		} catch {
			return stripped.toLowerCase().replaceAll("-", "_");
		}
	}
	function isSensitiveBodyKey(key) {
		return isSensitiveUrlQueryParamName(key) || bodySecretKeys.has(normalizeSensitiveKeyName(key));
	}
	function hasEncodedOrInvisibleFormKey(key) {
		return FORM_BODY_PERCENT_ESCAPE_RE.test(key) || key.replace(FORM_BODY_KEY_OBFUSCATION_RE, "") !== key;
	}
	function visitSensitiveAssignments(text, kind, visit) {
		if (!text || kind === "url" && !text.includes("?")) return;
		if (kind === "encoded" && !text.includes("%") && text.replace(FORM_BODY_KEY_OBFUSCATION_RE, "") === text) return;
		if (kind === "context" && !/[=:]/u.test(text)) return;
		const visitPair = (key, token, valueOffset) => {
			if (kind === "encoded" && !hasEncodedOrInvisibleFormKey(key)) return;
			if (!isSensitiveBodyKey(key)) return;
			const { maskable, maskStart, maskEnd } = splitSecretValueForMask(token);
			visit(valueOffset + maskStart, valueOffset + maskEnd, maskable);
		};
		if (kind === "form") {
			let cursor = 0;
			for (const pair of text.split("&")) {
				const equalsIndex = pair.indexOf("=");
				if (equalsIndex >= 0) visitPair(pair.slice(0, equalsIndex), pair.slice(equalsIndex + 1), cursor + equalsIndex + 1);
				cursor += pair.length + 1;
			}
			return;
		}
		const pattern = kind === "url" ? URL_QUERY_PAIR_RE : kind === "encoded" ? ENCODED_FORM_PAIR_RE : FORM_BODY_CONTEXT_SINGLE_PAIR_RE;
		const keyIndex = kind === "context" ? 3 : 2;
		pattern.lastIndex = 0;
		try {
			for (let match = pattern.exec(text); match; match = pattern.exec(text)) {
				const prefix = match[1] ?? "";
				const key = match[keyIndex] ?? "";
				visitPair(key, match[keyIndex + 1] ?? "", match.index + prefix.length + key.length + 1);
			}
		} finally {
			pattern.lastIndex = 0;
		}
	}
	function redactAssignmentValues(text, kind, onEdits) {
		const parts = [];
		const edits = [];
		let cursor = 0;
		visitSensitiveAssignments(text, kind, (start, end, maskable) => {
			const replacement = kind === "url" ? maskToken(maskable) : "***";
			parts.push(text.slice(cursor, start), replacement);
			if (onEdits) edits.push({
				start,
				end,
				replacement
			});
			cursor = end;
		});
		if (edits.length > 0) onEdits?.(edits);
		return parts.length > 0 ? parts.join("") + text.slice(cursor) : text;
	}
	function redactFormBodyLine(text, onEdits) {
		if (!text.includes("=")) return text;
		const contextRedacted = redactAssignmentValues(redactAssignmentValues(text, "encoded", onEdits), "context", onEdits);
		if (!contextRedacted.includes("&")) return contextRedacted;
		if (FORM_BODY_RE.test(contextRedacted)) return redactAssignmentValues(contextRedacted, "form", onEdits);
		const substringEdits = [];
		const redacted = contextRedacted.replace(FORM_BODY_SUBSTRING_RE, (match, prefix, body, offset) => {
			const redactedBody = redactAssignmentValues(body, "form", onEdits ? (edits) => {
				for (const edit of edits) substringEdits.push({
					...edit,
					start: offset + prefix.length + edit.start,
					end: offset + prefix.length + edit.end
				});
			} : void 0);
			return redactedBody === body ? match : `${prefix}${redactedBody}`;
		});
		if (substringEdits.length > 0) onEdits?.(substringEdits);
		return redactAssignmentValues(redactAssignmentValues(redacted, "encoded", onEdits), "context", onEdits);
	}
	function redactFormBody(text, onEdits) {
		if (!text.includes("=")) return text;
		if (FORM_BODY_LINE_BREAK_SPLIT_RE.test(text)) {
			let offset = 0;
			return text.split(FORM_BODY_LINE_BREAK_SPLIT_RE).map((segment) => {
				const result = FORM_BODY_LINE_BREAK_SEGMENT_RE.test(segment) ? segment : redactFormBodyLine(segment, onEdits ? (edits) => onEdits(edits.map((edit) => ({
					...edit,
					start: offset + edit.start,
					end: offset + edit.end
				}))) : void 0);
				offset += result.length;
				return result;
			}).join("");
		}
		return redactFormBodyLine(text, onEdits);
	}
	return {
		redactAssignmentValues,
		redactFormBody
	};
}
//#endregion
//#region src/logging/redact-json-tokens.ts
const JSON_TOKEN_RE = /"(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|[{}[\]]/g;
function skipWhitespace(text, start) {
	let offset = start;
	while (text[offset] === " " || text[offset] === "	" || text[offset] === "\r" || text[offset] === "\n") offset += 1;
	return offset;
}
function readScalarTokens(text, origins) {
	const tokens = [];
	const containers = [];
	const root = {
		key: "",
		path: [],
		origins,
		origin: origins.value,
		objectPath: true
	};
	const valueContext = (parent) => !parent ? root : parent.array ? {
		...parent.context,
		origin: parent.context.origins?.value ?? parent.context.origin,
		origins: parent.context.origins?.children.get(String(parent.nextIndex++))
	} : expectDefined(parent.field, "JSON object field context");
	for (const match of text.matchAll(JSON_TOKEN_RE)) {
		const raw = match[0];
		const parent = containers.at(-1);
		if (raw === "{" || raw === "[") {
			const context = valueContext(parent);
			const array = raw === "[";
			containers.push({
				array,
				nextIndex: 0,
				context: array ? {
					...context,
					objectPath: false
				} : context,
				start: match.index,
				tokenStart: tokens.length
			});
			continue;
		}
		if (raw === "}" || raw === "]") {
			const container = expectDefined(containers.pop(), "JSON container");
			if (container.tokenStart === tokens.length) {
				const end = match.index + 1;
				const value = text.slice(container.start, end);
				tokens.push({
					...container.context,
					isKey: false,
					string: false,
					value,
					start: container.start,
					end,
					escaped: false,
					edits: [],
					projectedEdits: [],
					currentValue: value,
					currentStart: container.start,
					currentEnd: end
				});
			}
			continue;
		}
		const start = match.index;
		const end = start + raw.length;
		const string = raw.startsWith("\"");
		const value = string ? JSON.parse(raw) : raw;
		const next = skipWhitespace(text, end);
		const isKey = string && text[next] === ":";
		let context;
		if (isKey) {
			const container = expectDefined(parent, "JSON property container");
			const inherited = container.context;
			context = {
				key: "",
				path: [],
				origin: inherited.origin,
				objectPath: false,
				rootKey: inherited.rootKey,
				rootValueStart: inherited.rootValueStart
			};
			const valueStart = skipWhitespace(text, next + 1);
			container.field = {
				key: value,
				path: [...inherited.path, value],
				origins: inherited.origins?.children.get(value),
				origin: inherited.origins?.value ?? inherited.origin,
				objectPath: inherited.objectPath,
				rootKey: containers.length === 1 ? value : inherited.rootKey,
				rootValueStart: containers.length === 1 ? valueStart : inherited.rootValueStart
			};
		} else context = valueContext(parent);
		const origin = isKey ? {
			structured: false,
			primitiveMask: false
		} : context.origins?.value ?? context.origin;
		tokens.push({
			...context,
			origin,
			start,
			end,
			isKey,
			string,
			value,
			escaped: string && raw.includes("\\"),
			edits: [],
			projectedEdits: [],
			currentValue: value,
			currentStart: start,
			currentEnd: end
		});
	}
	return tokens;
}
function readBatchTokens(input, origins, preserveLines = false) {
	const tokens = [];
	let offset = 0;
	for (const line of input.split("\n")) {
		let json = false;
		try {
			JSON.parse(line);
			json = true;
		} catch {}
		if (json) for (const token of readScalarTokens(line, origins)) {
			token.deferEncoding = !token.string;
			token.start += offset;
			token.end += offset;
			token.currentStart += offset;
			token.currentEnd += offset;
			tokens.push(token);
		}
		else {
			const previous = tokens.at(-1);
			if (!preserveLines && previous?.raw && previous.end + 1 === offset) {
				previous.value += `\n${line}`;
				previous.currentValue = previous.value;
				previous.end = previous.currentEnd = offset + line.length;
			} else tokens.push({
				raw: true,
				origin: origins.value,
				key: "",
				path: [],
				objectPath: false,
				isKey: false,
				string: false,
				value: line,
				escaped: false,
				start: offset,
				end: offset + line.length,
				currentStart: offset,
				currentEnd: offset + line.length,
				currentValue: line,
				edits: [],
				projectedEdits: []
			});
		}
		offset += line.length + 1;
	}
	return tokens;
}
//#endregion
//#region src/logging/redact-pattern-runtime.ts
function parseRedactPatternSource(raw) {
	const literal = raw.match(/^\/(.+)\/([gimsuy]*)$/);
	if (!literal) return [raw, "gi"];
	const source = literal[1] ?? "";
	const flags = literal[2] ?? "";
	return [source, flags.includes("g") ? flags : `${flags}g`];
}
const OPEN_REPEAT_RE = /^\{(\d+),\}/;
const BOUNDED_REPEAT_RE = /^\{(?:\d+(?:,\d*)?|,\d+)\}/;
const HEX_DIGIT_RE = /[0-9A-Fa-f]/;
const ASSERTION_ESCAPE_CHARS = /* @__PURE__ */ new Set(["b", "B"]);
const escapeHexValue = (source, at) => {
	let value = 0;
	for (let index = 0; index < 4; index += 1) {
		const digit = source[at + index];
		if (digit === void 0 || !HEX_DIGIT_RE.test(digit)) return null;
		value = value * 16 + Number.parseInt(digit, 16);
	}
	return value;
};
/** True when the escape at `i` is a `\uXXXX` high-surrogate escape. */
const isHighSurrogateEscape = (source, i) => {
	const value = escapeHexValue(source, i + 2);
	return value !== null && value >= 55296 && value <= 56319;
};
/** True when the escape at `i` is a `\uXXXX` low-surrogate escape. */
const isLowSurrogateEscape = (source, i) => {
	const value = escapeHexValue(source, i + 2);
	return value !== null && value >= 56320 && value <= 57343;
};
/** End index (exclusive) of the single atom introduced by the escape at `i` (a backslash), or -1. */
function escapeAtomEnd(source, i) {
	const kind = source[i + 1];
	if (kind === void 0) return -1;
	if (ASSERTION_ESCAPE_CHARS.has(kind)) return i + 2;
	if (kind === "x") return HEX_DIGIT_RE.test(source[i + 2] ?? "") && HEX_DIGIT_RE.test(source[i + 3] ?? "") ? i + 4 : i + 2;
	if ((kind === "u" || kind === "p" || kind === "P") && source[i + 2] === "{") {
		const close = source.indexOf("}", i + 3);
		return close === -1 ? i + 2 : close + 1;
	}
	if (kind === "u") {
		let end = i + 2;
		while (end < i + 6 && HEX_DIGIT_RE.test(source[end] ?? "")) end += 1;
		return end;
	}
	if (kind === "c") return i + 3;
	if (kind === "k" && source[i + 2] === "<") {
		const close = source.indexOf(">", i + 3);
		return close === -1 ? i + 2 : close + 1;
	}
	if (kind >= "0" && kind <= "9") {
		let end = i + 2;
		for (let cursor = end; cursor < source.length; cursor += 1) {
			const digit = source[cursor];
			if (digit === void 0 || digit < "0" || digit > "9") break;
			end = cursor + 1;
		}
		return end;
	}
	return i + 2;
}
/** End index (exclusive) of the character class starting at `i` (an unescaped bracket). */
function classAtomEnd(source, i) {
	let cursor = i + 1;
	if (source[cursor] === "^") cursor += 1;
	if (source[cursor] === "]") return -1;
	while (cursor < source.length) {
		const char = source[cursor];
		if (char === "\\") {
			cursor += 2;
			continue;
		}
		if (char === "]") return cursor + 1;
		cursor += 1;
	}
	return source.length;
}
/**
* Rewrites open-ended repeats `X{n,}` into `X{n}X*` for flat single-character atoms `X`
* (one literal, one escaped atom, or one bracket class). Greedy `X{n,}` and `X{n}X*`
* accept the same strings in the same backtracking order, but the latter never grows one
* backtrack stack entry per repetition, so multi-megabyte runs no longer overflow.
* Bounded repeats, quantifiers after groups, and quantified atoms are left untouched.
* `flags` decides atom boundaries for literal astral characters: under `u` a surrogate pair
* is one atom; without `u` JavaScript quantifies only the trailing code unit, so the pair
* must keep its per-unit handling and the original language.
*/
function rewriteOpenEndedRepeats(source, flags = "") {
	if (!source.includes("{")) return source;
	let out = "";
	let atomStart = -1;
	let atomEnd = -1;
	let i = 0;
	while (i < source.length) {
		const char = source[i];
		let end = i + 1;
		let isAtom = true;
		if (char === "\\") {
			end = escapeAtomEnd(source, i);
			if (end < 0) {
				end = i + 1;
				isAtom = false;
			} else if (flags.includes("u") && isHighSurrogateEscape(source, i) && source[end] === "\\" && isLowSurrogateEscape(source, end)) end = escapeAtomEnd(source, end);
			else isAtom = !ASSERTION_ESCAPE_CHARS.has(source[i + 1]);
		} else if (char === "[") {
			end = classAtomEnd(source, i);
			if (end < 0) return source;
		} else if (char === "{") {
			const open = OPEN_REPEAT_RE.exec(source.slice(i));
			const repeat = open && atomStart >= 0 ? open : BOUNDED_REPEAT_RE.exec(source.slice(i));
			if (repeat) {
				out += repeat === open ? `{${open[1]}}${source.slice(atomStart, atomEnd)}*` : repeat[0];
				i += repeat[0].length;
				if (source[i] === "?") {
					out += "?";
					i += 1;
				}
				atomStart = -1;
				continue;
			}
		} else if (flags.includes("u") && char >= "\ud800" && char <= "\udbff" && i + 1 < source.length && source[i + 1] >= "\udc00" && source[i + 1] <= "\udfff") end = i + 2;
		else isAtom = !"*+?()|^$".includes(char);
		out += source.slice(i, end);
		atomStart = isAtom ? i : -1;
		atomEnd = end;
		i = end;
	}
	return out;
}
function readRedactMatch(args) {
	const inputIndex = args.length > 0 && typeof args[args.length - 1] === "object" && args[args.length - 1] !== null ? args.length - 2 : args.length - 1;
	const offsetIndex = inputIndex - 1;
	const match = typeof args[0] === "string" ? args[0] : "";
	const groups = args.slice(1, offsetIndex).map((value) => typeof value === "string" ? value : "");
	const offset = typeof args[offsetIndex] === "number" ? args[offsetIndex] : -1;
	return {
		match,
		groups,
		input: typeof args[inputIndex] === "string" ? args[inputIndex] : "",
		offset
	};
}
const patternPrefilters = /* @__PURE__ */ new WeakMap();
function setRedactPatternPrefilter(pattern, probe) {
	if (patternPrefilters.has(pattern)) return;
	const source = pattern.source;
	const exec = pattern.exec;
	const flags = pattern instanceof RegExp ? pattern.flags : void 0;
	const replace = pattern instanceof RegExp ? pattern[Symbol.replace] : void 0;
	patternPrefilters.set(pattern, (text) => pattern.source !== source || pattern.exec !== exec || pattern instanceof RegExp && (pattern.flags !== flags || pattern[Symbol.replace] !== replace) || probe(text));
}
const indexedPatterns = /* @__PURE__ */ new WeakMap();
function getIndexedCaptureStart(pattern, input, match, matchOffset, captureIndex) {
	if (!(pattern instanceof RegExp) || matchOffset < 0 || !input) return null;
	let indexedPattern = indexedPatterns.get(pattern);
	if (!indexedPattern) {
		indexedPattern = new RegExp(pattern.source, `${pattern.flags.replace("d", "").replace("g", "")}dg`);
		indexedPatterns.set(pattern, indexedPattern);
	}
	indexedPattern.lastIndex = matchOffset;
	const indexedMatch = indexedPattern.exec(input);
	const captureIndices = indexedMatch?.indices?.[captureIndex + 1];
	return indexedMatch?.index === matchOffset && indexedMatch[0] === match && captureIndices ? captureIndices[0] - matchOffset : null;
}
function selectSecretCapture(match, groups) {
	const selected = {
		index: -1,
		value: match
	};
	for (let index = 0; index < groups.length; index++) {
		const value = groups[index];
		if (typeof value === "string" && value.length > 0) {
			selected.index = index;
			selected.value = value;
		}
	}
	return selected;
}
function getSecretCaptureStart(pattern, input, match, matchOffset, selected) {
	return getIndexedCaptureStart(pattern, input, match, matchOffset, selected.index) ?? match.lastIndexOf(selected.value);
}
const globalPatterns = /* @__PURE__ */ new WeakMap();
function visitRedactMatches(text, pattern, visit) {
	if (patternPrefilters.get(pattern)?.(text) === false) return;
	if (!(pattern instanceof RegExp)) {
		for (const match of pattern.exec(text)) visit(match, pattern);
		return;
	}
	let regex = pattern.global ? pattern : globalPatterns.get(pattern);
	if (!regex) {
		regex = new RegExp(pattern.source, `${pattern.flags}g`);
		globalPatterns.set(pattern, regex);
	}
	const unicode = regex.unicode || regex.flags.includes("v");
	let cursor = 0;
	while (cursor <= text.length) {
		const previousIndex = regex.lastIndex;
		let match;
		try {
			regex.lastIndex = cursor;
			match = regex.exec(text);
		} finally {
			regex.lastIndex = previousIndex;
		}
		if (!match) return;
		cursor = match.index + match[0].length;
		if (!match[0]) {
			const codePoint = text.codePointAt(cursor);
			cursor += unicode && codePoint !== void 0 && codePoint > 65535 ? 2 : 1;
		}
		visit({
			match: match[0],
			groups: match.slice(1).map((group) => group ?? ""),
			input: text,
			offset: match.index
		}, pattern);
	}
}
function replaceRedactPattern(text, pattern, replace, replaceRegex) {
	if (pattern instanceof RegExp) {
		if (patternPrefilters.get(pattern)?.(text) === false) {
			pattern.lastIndex = 0;
			return text;
		}
		return text.replace(pattern, replaceRegex ?? ((...args) => replace(readRedactMatch(args))));
	}
	const parts = [];
	let end = 0;
	visitRedactMatches(text, pattern, (match) => {
		parts.push(text.slice(end, match.offset), replace(match));
		end = match.offset + match.match.length;
	});
	return parts.length ? parts.join("") + text.slice(end) : text;
}
function redactPemBlock(block, marker) {
	const lines = block.split(/\r?\n/).filter(Boolean);
	if (lines.length < 2) return "***";
	return `${lines[0]}\n${marker}\n${lines[lines.length - 1]}`;
}
//#endregion
//#region src/logging/redact-json.ts
function stringBoundaries(text, start, end) {
	const boundaries = /* @__PURE__ */ new Map();
	let decoded = 0;
	for (let offset = start; offset < end; decoded += 1) {
		boundaries.set(offset, decoded);
		offset += text[offset] === "\\" ? text[offset + 1] === "u" ? 6 : 2 : 1;
	}
	boundaries.set(end, decoded);
	return boundaries;
}
function decodedBoundary(text, token, offset) {
	if (!token.escaped) return offset - token.start - 1;
	token.boundaries ??= stringBoundaries(text, token.start + 1, token.end - 1);
	return token.boundaries.get(offset);
}
function encodedBoundary(text, token, offset) {
	if (!token.escaped) return token.start + 1 + offset;
	if (!token.encodedBoundaries) {
		token.boundaries ??= stringBoundaries(text, token.start + 1, token.end - 1);
		token.encodedBoundaries = [];
		for (const [encoded, decoded] of token.boundaries) token.encodedBoundaries[decoded] = encoded;
	}
	return expectDefined(token.encodedBoundaries[offset], "decoded JSON edit boundary");
}
function projectMessageEdits(input, tokens, message, getEdits) {
	const parts = new Map(message.parts.map((part) => [part.key, part]));
	const projected = [];
	for (const token of tokens) {
		if (!token.isKey && token.path.length === 1 && token.key === "message") continue;
		const part = token.rootKey === void 0 ? void 0 : parts.get(token.rootKey);
		if (!part) continue;
		if (!part.json && (token.isKey || (part.messageField ? token.path.length !== 2 || token.key !== "message" : token.path.length !== 1))) continue;
		const edits = getEdits(token);
		for (const edit of edits) {
			let start;
			let end;
			let replacement = edit.replacement;
			if (part.json) {
				const base = part.start - expectDefined(token.rootValueStart, "displayed JSON argument");
				if (token.string) {
					start = base + encodedBoundary(input, token, edit.start);
					end = base + encodedBoundary(input, token, edit.end);
					replacement = JSON.stringify(replacement).slice(1, -1);
				} else {
					start = base + token.start;
					end = base + token.end;
					replacement = JSON.stringify(replacement);
				}
			} else {
				start = part.start + edit.start;
				end = part.start + (part.primitiveLength ?? edit.end);
			}
			if (start < message.contentLength) projected.push({
				start,
				end: Math.min(end, message.contentLength),
				replacement,
				scalar: part.json && !token.string
			});
		}
	}
	return projected.toSorted((left, right) => left.start - right.start || left.end - right.end);
}
function firstIntersectingToken(tokens, start) {
	let low = 0;
	let high = tokens.length;
	while (low < high) {
		const middle = low + high >>> 1;
		if (expectDefined(tokens[middle], "bounded JSON token search").currentEnd <= start) low = middle + 1;
		else high = middle;
	}
	return low;
}
function updateCurrentToken(input, token) {
	if (token.raw || token.deferEncoding) {
		token.currentRaw = token.currentValue;
		return;
	}
	const parts = [];
	const encodedEdits = [];
	let cursor = token.start + (token.string ? 1 : 0);
	let encodedLength = 0;
	let decodedShift = 0;
	for (const edit of token.edits) {
		const start = token.string ? encodedBoundary(input, token, edit.start) : token.start + edit.start;
		const end = token.string ? encodedBoundary(input, token, edit.end) : token.start + edit.end;
		const replacement = JSON.stringify(edit.replacement).slice(1, -1);
		const encodedStart = encodedLength + start - cursor;
		const encodedEnd = encodedStart + replacement.length;
		encodedEdits.push({
			start: encodedStart,
			end: encodedEnd,
			decodedStart: edit.start + decodedShift,
			decodedEnd: edit.start + decodedShift + edit.replacement.length,
			sourceEnd: end,
			sourceDecodedEnd: edit.end,
			replacement
		});
		parts.push(input.slice(cursor, start), replacement);
		encodedLength = encodedEnd;
		decodedShift += edit.replacement.length - (edit.end - edit.start);
		cursor = end;
	}
	parts.push(input.slice(cursor, token.end - (token.string ? 1 : 0)));
	token.currentRaw = `"${parts.join("")}"`;
	token.encodedEdits = encodedEdits;
}
function currentDecodedBoundary(input, token, position, replacements) {
	const offset = position - token.currentStart - 1;
	const edits = token.encodedEdits;
	if (!edits) return decodedBoundary(input, token, token.start + 1 + offset);
	let low = 0;
	let high = edits.length;
	while (low < high) {
		const middle = low + high >>> 1;
		if (expectDefined(edits[middle], "current encoded edit").end < offset) low = middle + 1;
		else high = middle;
	}
	const edit = edits[low];
	if (edit && offset >= edit.start) {
		const within = offset - edit.start;
		if (!edit.replacement.includes("\\")) return edit.decodedStart + within;
		let boundaries = replacements.get(edit.replacement);
		if (!boundaries) {
			boundaries = stringBoundaries(edit.replacement, 0, edit.replacement.length);
			replacements.set(edit.replacement, boundaries);
		}
		const decoded = boundaries.get(within);
		return decoded === void 0 ? void 0 : edit.decodedStart + decoded;
	}
	const previous = edits[low - 1];
	const decoded = decodedBoundary(input, token, offset + (previous ? previous.sourceEnd - previous.end : token.start + 1));
	return decoded === void 0 ? void 0 : decoded + (previous ? previous.decodedEnd - previous.sourceDecodedEnd : 0);
}
function commitPatternEdits(token) {
	const pending = token.pending;
	token.pending = void 0;
	if (!pending) return false;
	const edits = mergeRedactionEdits(pending);
	const value = applyRedactionEdits(token.currentValue, edits);
	if (value === token.currentValue) return false;
	token.edits = composeRedactionEdits(token.value.length, token.edits, edits);
	token.currentValue = value;
	return true;
}
function changedRedactionEdits(previous, current) {
	let index = 0;
	return current.filter((edit) => {
		while (previous[index] && expectDefined(previous[index], "previous configured edit").start < edit.start) index += 1;
		const before = previous[index];
		return !before || before.start !== edit.start || before.end !== edit.end || before.replacement !== edit.replacement;
	});
}
function commitOriginalEdits(token, edits) {
	if (edits.length === 0) return false;
	const combined = mergeRedactionEdits([...token.edits, ...edits]);
	const value = applyRedactionEdits(token.value, combined);
	if (value === token.currentValue) return false;
	token.edits = combined;
	token.currentValue = value;
	return true;
}
function updateCurrentRecord(input, current, tokens, changed) {
	const parts = [];
	let cursor = 0;
	let shift = 0;
	for (const token of tokens) {
		const start = token.currentStart;
		const end = token.currentEnd;
		if (changed.has(token)) {
			updateCurrentToken(input, token);
			const raw = expectDefined(token.currentRaw, "changed JSON token");
			parts.push(current.slice(cursor, start), raw);
			cursor = end;
			token.currentStart = start + shift;
			shift += raw.length - (end - start);
		} else token.currentStart = start + shift;
		token.currentEnd = end + shift;
	}
	parts.push(current.slice(cursor));
	return parts.join("");
}
function projectedStringEnd(input, tokens, message, token, start, end) {
	const jsonParts = new Set(message.parts.filter((part) => part.json).map((part) => part.key));
	const spans = projectMessageEdits(input, tokens, message, (source) => source.string && !source.isKey && source.rootKey !== void 0 && jsonParts.has(source.rootKey) ? [{
		start: 0,
		end: source.value.length,
		replacement: ""
	}] : []).filter((span) => span.end < message.contentLength);
	const containing = rebaseRedactionEdits(token.edits, spans).filter((span) => span.start <= start && start < span.end && end <= span.end);
	return containing.length === 1 ? expectDefined(containing[0], "displayed source string").end : token.currentValue.length;
}
function redactJsonRecord(input, origins, patternPhases, getCapture, legacyFieldEdits, fieldEdits, prepEdits, skipDecodedPatterns, message, batch) {
	let tokens = batch ? [] : readScalarTokens(input, origins);
	const messageToken = message ? tokens.find((token) => !token.isKey && token.path.length === 1 && token.key === "message") : void 0;
	const replacementBoundaries = /* @__PURE__ */ new Map();
	let projectedMessageEdits = [];
	let projectedMessageValue = messageToken?.value ?? "";
	let current = input;
	const prepared = /* @__PURE__ */ new Set();
	for (const token of tokens) if (commitOriginalEdits(token, prepEdits(token))) prepared.add(token);
	if (prepared.size > 0) current = updateCurrentRecord(input, current, tokens, prepared);
	const decodedTokens = tokens.filter((token) => !token.isKey && token.string && !skipDecodedPatterns(token, token.currentValue));
	const projectMessage = () => {
		if (!messageToken || !message) return false;
		const projected = projectMessageEdits(input, tokens, message, (token) => {
			const edits = changedRedactionEdits(token.projectedEdits, token.edits);
			token.projectedEdits = token.edits;
			return edits;
		});
		if (projected.length === 0) return false;
		const sourceEdits = rebaseRedactionEdits(projectedMessageEdits, projected);
		const messageEdits = rebaseRedactionEdits(messageToken.edits, projected);
		let generatedIndex = 0;
		for (let index = 0; index < messageEdits.length; index += 1) {
			const edit = expectDefined(messageEdits[index], "projected message edit");
			const sourceEdit = expectDefined(sourceEdits[index], "projected source edit");
			const projection = expectDefined(projected[index], "source projection");
			while (messageToken.edits[generatedIndex] && expectDefined(messageToken.edits[generatedIndex], "generated message span").start < projection.start) generatedIndex += 1;
			const generated = messageToken.edits[generatedIndex];
			const scalarPromotion = projection.scalar && generated?.start === projection.start && generated.end === projection.end && edit.replacement === JSON.stringify(generated.replacement);
			const before = messageToken.currentValue.slice(edit.start, edit.end);
			if (!scalarPromotion && before !== edit.replacement && before !== projectedMessageValue.slice(sourceEdit.start, sourceEdit.end)) edit.replacement = projection.scalar ? JSON.stringify("***") : "***";
		}
		messageToken.pending = messageEdits;
		projectedMessageValue = applyRedactionEdits(projectedMessageValue, sourceEdits);
		projectedMessageEdits = composeRedactionEdits(messageToken.value.length, projectedMessageEdits, sourceEdits);
		return commitPatternEdits(messageToken);
	};
	for (const [phase, groups] of patternPhases.entries()) {
		const changed = /* @__PURE__ */ new Set();
		const pending = /* @__PURE__ */ new Set();
		const add = (token, edit) => {
			(token.pending ??= []).push(edit);
			pending.add(token);
		};
		let decodedToken;
		const visitDecodedMatch = (match, pattern) => {
			const capture = getCapture(match, pattern);
			const edit = capture?.redact(capture);
			if (edit && edit.end >= edit.start) add(decodedToken, edit);
		};
		for (const group of groups) {
			if (group.couldMatch && !group.couldMatch(current)) continue;
			for (const pattern of group.patterns) {
				if (phase === 0) for (decodedToken of decodedTokens) visitRedactMatches(decodedToken.currentValue, pattern, visitDecodedMatch);
				else visitRedactMatches(current, pattern, (match) => {
					const capture = getCapture(match, pattern);
					if (!capture || capture.end < capture.start) return;
					if (batch && tokens.length === 0) tokens = readBatchTokens(input, origins, batch.preserveLines);
					for (let index = firstIntersectingToken(tokens, capture.start); index < tokens.length; index += 1) {
						const token = expectDefined(tokens[index], "serialized capture token");
						if (token.currentStart >= capture.end) break;
						const unquoted = token.raw || token.deferEncoding;
						const padding = unquoted ? 0 : 1;
						const captureInsideToken = capture.start >= token.currentStart + padding && capture.end <= token.currentEnd - padding;
						if (batch && token.isKey && !captureInsideToken) continue;
						const value = token.currentValue;
						if (!token.raw && !token.string && token.edits.length === 0) {
							add(token, {
								start: 0,
								end: value.length,
								replacement: "***"
							});
							continue;
						}
						let startPosition = Math.max(capture.start, token.currentStart + padding);
						let start = unquoted ? startPosition - token.currentStart : currentDecodedBoundary(input, token, startPosition, replacementBoundaries);
						let endPosition = Math.min(capture.end, token.currentEnd - padding);
						let end = unquoted ? endPosition - token.currentStart : currentDecodedBoundary(input, token, endPosition, replacementBoundaries);
						if (start === void 0 || end === void 0) {
							while (start === void 0) start = currentDecodedBoundary(input, token, --startPosition, replacementBoundaries);
							while (end === void 0) end = currentDecodedBoundary(input, token, ++endPosition, replacementBoundaries);
							const maskEnd = token === messageToken && message ? projectedStringEnd(input, tokens, message, token, start, end) : value.length;
							add(token, {
								start,
								end: maskEnd,
								replacement: "***"
							});
							continue;
						}
						if (end < start || batch && end === start) continue;
						const { start: captureStart, end: captureEnd } = capture;
						const edit = capture.redact({
							start,
							end,
							value: current.slice(Math.max(captureStart, token.currentStart + padding), Math.min(captureEnd, token.currentEnd - padding))
						});
						if (!edit) continue;
						let replacement = "***";
						if (captureInsideToken) try {
							replacement = unquoted ? edit.replacement : JSON.parse(`"${edit.replacement}"`);
						} catch {}
						add(token, {
							...edit,
							replacement
						});
					}
				});
				if (pending.size === 0) continue;
				for (const token of pending) if (!commitPatternEdits(token)) pending.delete(token);
				else if (phase === 0) changed.add(token);
				if (phase !== 0 && pending.size > 0) current = updateCurrentRecord(input, current, tokens, pending);
				pending.clear();
			}
		}
		for (const token of tokens) if (phase === 0) {
			token.pending = legacyFieldEdits(token, token.currentValue);
			if (commitPatternEdits(token)) changed.add(token);
		} else if (commitOriginalEdits(token, fieldEdits(token))) changed.add(token);
		if ((phase !== 0 || prepared.size > 0 || changed.size > 0) && projectMessage() && messageToken) changed.add(messageToken);
		if (changed.size > 0) current = updateCurrentRecord(input, current, tokens, changed);
	}
	if (messageToken && message) {
		const finished = message.finish(messageToken.currentValue);
		if (finished !== messageToken.currentValue) return applyRedactionEdits(current, [{
			start: messageToken.currentStart,
			end: messageToken.currentEnd,
			replacement: JSON.stringify(finished)
		}]);
	}
	return applyRedactionEdits(current, tokens.flatMap((token) => token.deferEncoding && token.edits.length > 0 ? [{
		start: token.currentStart,
		end: token.currentEnd,
		replacement: JSON.stringify(token.currentValue)
	}] : []));
}
//#endregion
//#region src/logging/redact-linear-matchers.ts
const JS_WHITESPACE_CODES = /* @__PURE__ */ new Set([
	9,
	10,
	11,
	12,
	13,
	32,
	160,
	5760,
	8232,
	8233,
	8239,
	8287,
	12288,
	65279
]);
function isJsWhitespaceAt(text, index) {
	if (index >= text.length) return false;
	const code = text.charCodeAt(index);
	return JS_WHITESPACE_CODES.has(code) || code >= 8192 && code <= 8202;
}
function isJsWhitespaceChar(char) {
	return char !== void 0 && isJsWhitespaceAt(char, 0);
}
function isAlnumChar(char) {
	if (char === void 0) return false;
	const code = char.charCodeAt(0);
	return code >= 48 && code <= 57 || code >= 65 && code <= 90 || code >= 97 && code <= 122;
}
function isLetterChar(char) {
	if (char === void 0) return false;
	const code = char.charCodeAt(0);
	return code >= 65 && code <= 90 || code >= 97 && code <= 122;
}
function isWordChar(char) {
	return char === "_" || isAlnumChar(char);
}
function isHexChar(char) {
	if (char === void 0) return false;
	const code = char.charCodeAt(0);
	return code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102;
}
function isDigitChar(char) {
	return char !== void 0 && char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57;
}
function isBase64UrlChar(char) {
	return isAlnumChar(char) || char === "+" || char === "/" || char === "=";
}
const prefixRegexPools = /* @__PURE__ */ new Map();
/** Reuse compiled prefixes without sharing mutable lastIndex with a reentrant scan. */
function* scanPrefixOccurrences(text, prefix) {
	let pool = prefixRegexPools.get(prefix);
	if (!pool) {
		pool = [];
		prefixRegexPools.set(prefix, pool);
	}
	const re = pool.pop() ?? new RegExp(prefix, "gi");
	try {
		re.lastIndex = 0;
		for (let match = re.exec(text); match; match = re.exec(text)) yield match.index;
	} finally {
		re.lastIndex = 0;
		pool.push(re);
	}
}
/** The `;base64,` exemption under the shared case-insensitive compilation of these rules. */
function isDataUrlPrefix(text, runStart) {
	return runStart >= 8 && text.slice(runStart - 8, runStart).toLowerCase() === ";base64,";
}
function runEndOf(text, start, isMember) {
	let end = start;
	while (end < text.length && isMember(text[end])) end += 1;
	return end;
}
function makeCachedRunEnd(text, isMember) {
	let start = -1;
	let end = -1;
	return (position) => {
		if (position < start || position >= end) {
			start = position;
			end = runEndOf(text, position, isMember);
		}
		return end;
	};
}
/**
* Shared matcher for the `BASE64_SAFE_TOKEN_BOUNDARY` vendor rules. The boundary group is
* checked per candidate in O(1); the `(?<!;base64,[A-Za-z0-9+/=]*)` exemption walks each
* base64 run once because candidates advance left to right and share runs, replacing the
* unbounded lookbehind that rescanned the whole run from every candidate. The token-end
* function is created per exec() call so concurrent redactions never share scanner state.
*/
function makeBase64SafeTokenMatcher(source, prefix, makeTokenEnd) {
	function* exec(text) {
		const tokenEnd = makeTokenEnd();
		let runStart = -1;
		let runEnd = -1;
		let searchFloor = 0;
		for (const candidate of scanPrefixOccurrences(text, prefix)) {
			if (candidate < searchFloor) continue;
			if (candidate > 0 && isAlnumChar(text[candidate - 1])) continue;
			if (candidate > 0) {
				let runAtCandidate;
				if (isBase64UrlChar(text[candidate - 1])) {
					if (candidate - 1 >= runStart && candidate - 1 < runEnd) runAtCandidate = runStart;
					else {
						let walk = candidate - 1;
						while (walk > 0 && isBase64UrlChar(text[walk - 1])) walk -= 1;
						runStart = walk;
						runEnd = runEndOf(text, candidate, isBase64UrlChar);
						runAtCandidate = walk;
					}
				} else runAtCandidate = candidate;
				if (isDataUrlPrefix(text, runAtCandidate)) continue;
			}
			const end = tokenEnd(text, candidate);
			if (end === null) continue;
			const matchStart = candidate > 0 ? candidate - 1 : 0;
			yield {
				match: text.slice(matchStart, end),
				groups: [candidate > 0 ? text[candidate - 1] : "", text.slice(candidate, end)],
				input: text,
				offset: matchStart
			};
			searchFloor = end + 1;
		}
	}
	return Object.freeze({
		source,
		exec
	});
}
const GAAAA_VALUE_CHAR = (char) => isAlnumChar(char) || char === "_" || char === "=" || char === "-";
const ATBB_VALUE_CHAR = (char) => isAlnumChar(char) || char === "_" || char === "=" || char === "." || char === "-";
const AT_VALUE_CHAR = (char) => isAlnumChar(char) || char === "+" || char === "/" || char === "=" || char === "-" || char === "_";
function fixedTailTokenEnd(tailStart, tailLength, isMember) {
	return (text, start) => {
		const end = start + tailStart + tailLength;
		for (let index = start + tailStart; index < end; index++) if (!isMember(text[index])) return null;
		return end;
	};
}
/** `dapi` + 32 hex digits + an optional `-<digit>`; the optional tail is greedy like the regex. */
const dapiBodyEnd = fixedTailTokenEnd(4, 32, isHexChar);
function dapiTokenEnd(text, start) {
	const bodyEnd = dapiBodyEnd(text, start);
	if (bodyEnd === null) return null;
	if (text[bodyEnd] === "-" && isDigitChar(text[bodyEnd + 1])) return bodyEnd + 2;
	return bodyEnd;
}
/**
* `ATCTT3xFfG`/`ATATT` value: one or more class characters, then `=`, then exactly eight
* alphanumerics. Greedy backtracking lands on the rightmost `=` in the run whose next
* eight characters are alphanumerics; each run is scanned once and candidates share it.
*/
function makeAtEqualsTokenMatcher(source, prefix) {
	const prefixLength = prefix.length;
	const equalsTailEnd = fixedTailTokenEnd(1, 8, isAlnumChar);
	return makeBase64SafeTokenMatcher(source, prefix, () => {
		let runStart = -1;
		let runEnd = -1;
		let lastEquals;
		return (text, start) => {
			const valueStart = start + prefixLength;
			if (valueStart < runStart || valueStart >= runEnd) {
				runEnd = runEndOf(text, valueStart, AT_VALUE_CHAR);
				runStart = valueStart;
				lastEquals = void 0;
				for (let index = valueStart; index < runEnd; index++) if (text[index] === "=" && equalsTailEnd(text, index) !== null) lastEquals = index;
			}
			const minimum = valueStart + 1;
			return lastEquals !== void 0 && lastEquals >= minimum ? lastEquals + 9 : null;
		};
	});
}
const GAAAA_TOKEN_MATCHER = makeBase64SafeTokenMatcher("vendor-token gAAAA (linear)", "gAAAA", () => (text, start) => {
	const end = runEndOf(text, start + 5, GAAAA_VALUE_CHAR);
	return end - (start + 5) >= 20 ? end : null;
});
const ATBB_TOKEN_MATCHER = makeBase64SafeTokenMatcher("vendor-token ATBB (linear)", "ATBB", () => (text, start) => {
	const end = runEndOf(text, start + 4, ATBB_VALUE_CHAR);
	return end - (start + 4) >= 16 ? end : null;
});
const AKIA_TOKEN_MATCHER = makeBase64SafeTokenMatcher("vendor-token AKIA (linear)", "AKIA", () => fixedTailTokenEnd(4, 16, isAlnumChar));
const ASIA_TOKEN_MATCHER = makeBase64SafeTokenMatcher("vendor-token ASIA (linear)", "ASIA", () => fixedTailTokenEnd(4, 16, isAlnumChar));
const DAPI_TOKEN_MATCHER = makeBase64SafeTokenMatcher("vendor-token dapi (linear)", "dapi", () => dapiTokenEnd);
const ATCTT_TOKEN_MATCHER = makeAtEqualsTokenMatcher("vendor-token ATCTT3xFfG (linear)", "ATCTT3xFfG");
const ATATT_TOKEN_MATCHER = makeAtEqualsTokenMatcher("vendor-token ATATT (linear)", "ATATT");
const JWT_REDACT_PATTERN = String.raw`(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`;
const JWT_SEGMENT_CHAR = (char) => isAlnumChar(char) || char === "_" || char === "-";
/** JWT rule: each `eyJ` candidate parses its three segments forward; class runs are shared. */
const JWT_MATCHER = Object.freeze({
	source: "jwt (linear)",
	*exec(text) {
		const firstSegmentEnd = makeCachedRunEnd(text, JWT_SEGMENT_CHAR);
		const secondSegmentEnd = makeCachedRunEnd(text, JWT_SEGMENT_CHAR);
		const thirdSegmentEnd = makeCachedRunEnd(text, JWT_SEGMENT_CHAR);
		let searchFloor = 0;
		for (const candidate of scanPrefixOccurrences(text, "eyj")) {
			if (candidate < searchFloor) continue;
			const firstEnd = firstSegmentEnd(candidate + 3);
			if (firstEnd - (candidate + 3) < 10 || text[firstEnd] !== ".") continue;
			const secondEnd = secondSegmentEnd(firstEnd + 1);
			if (secondEnd - (firstEnd + 1) < 10 || text[secondEnd] !== ".") continue;
			const thirdEnd = thirdSegmentEnd(secondEnd + 1);
			if (thirdEnd - (secondEnd + 1) < 10) continue;
			const token = text.slice(candidate, thirdEnd);
			yield {
				match: token,
				groups: [token],
				input: text,
				offset: candidate
			};
			searchFloor = thirdEnd;
		}
	}
});
const URL_USERINFO_REDACT_PATTERN = String.raw`\b(?:https?|wss?|ftp):\/\/[^\/\s:@]*:([^\/\s@]+)@`;
const CONNECTION_STRING_REDACT_PATTERN = String.raw`\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|rediss?|amqps?):\/\/[^:\s/@]*:([^@\s]+)@`;
const URL_USERINFO_SCHEMES = /* @__PURE__ */ new Set([
	"http",
	"https",
	"ws",
	"wss",
	"ftp"
]);
const CONNECTION_STRING_SCHEMES = /* @__PURE__ */ new Set([
	"postgres",
	"postgresql",
	"mysql",
	"mongodb",
	"mongodb+srv",
	"redis",
	"rediss",
	"amqp",
	"amqps"
]);
/**
* Shared matcher for the URL-userinfo and connection-string password rules. Both regexes are
* deterministic parses (each character class excludes its own terminators), so every `://`
* candidate parses forward once; failed password scans are memoized because later candidates
* share their tail regions.
*/
function makeUserInfoMatcher(source, schemes, isPassTerminator) {
	function* exec(text) {
		let searchFloor = 0;
		let failedPassScanEnd = -1;
		let separator = text.indexOf("://");
		while (separator !== -1) {
			let schemeStart = separator;
			while (schemeStart > 0 && isWordChar(text[schemeStart - 1])) schemeStart -= 1;
			let scheme = text.slice(schemeStart, separator).toLowerCase();
			let matchStart = schemeStart;
			if (!schemes.has(scheme) && schemeStart >= 8 && scheme === "srv" && text.slice(schemeStart - 8, schemeStart).toLowerCase() === "mongodb+") {
				scheme = "mongodb+srv";
				matchStart = schemeStart - 8;
			}
			if (separator >= searchFloor && schemes.has(scheme) && (matchStart === 0 || !isWordChar(text[matchStart - 1]))) {
				let cursor = separator + 3;
				while (cursor < text.length && text[cursor] !== ":" && text[cursor] !== "/" && text[cursor] !== "@" && !isJsWhitespaceAt(text, cursor)) cursor += 1;
				if (text[cursor] === ":") {
					const passStart = cursor + 1;
					if (passStart >= failedPassScanEnd) {
						const passEnd = runEndOf(text, passStart, (char) => !isPassTerminator(char));
						if (text[passEnd] === "@" && passEnd > passStart) {
							yield {
								match: text.slice(matchStart, passEnd + 1),
								groups: [text.slice(passStart, passEnd)],
								input: text,
								offset: matchStart
							};
							searchFloor = passEnd + 1;
							separator = text.indexOf("://", passEnd + 1);
							continue;
						}
						failedPassScanEnd = passEnd;
					}
				}
			}
			separator = text.indexOf("://", separator + 1);
		}
	}
	return Object.freeze({
		source,
		exec
	});
}
const URL_USERINFO_MATCHER = makeUserInfoMatcher("url-userinfo (linear)", URL_USERINFO_SCHEMES, (char) => char === "/" || char === "@" || isJsWhitespaceChar(char));
const CONNECTION_STRING_MATCHER = makeUserInfoMatcher("connection-string (linear)", CONNECTION_STRING_SCHEMES, (char) => char === "@" || isJsWhitespaceChar(char));
const FORM_BODY_FIRST_PAIR_REDACT_PATTERN = String.raw`(^|[\s,;])(?:${FORM_BODY_FIRST_PAIR_KEYS})=([^&\s]+)(?=&[A-Za-z_][A-Za-z0-9_.-]*=)`;
const FORM_FIRST_PAIR_KEYS_RE = new RegExp(`^(?:${FORM_BODY_FIRST_PAIR_KEYS})$`, "i");
const FORM_FIRST_PAIR_KEY_CHAR = (char) => isAlnumChar(char) || char === "-" || char === "_";
const FORM_FIRST_PAIR_TAIL_CHAR = (char) => isAlnumChar(char) || char === "_" || char === "." || char === "-";
/** The lookahead `&[A-Za-z_][A-Za-z0-9_.-]*=` is a deterministic forward check. */
function isFormPairBoundary(text, ampersand) {
	const first = text[ampersand + 1];
	if (!(first !== void 0 && (isLetterChar(first) || first === "_"))) return false;
	return text[runEndOf(text, ampersand + 2, FORM_FIRST_PAIR_TAIL_CHAR)] === "=";
}
/**
* Form first-pair rule: the value class excludes `&` and whitespace, so the greedy value
* always ends at the first `&` or whitespace and the lookahead is checked there alone;
* per-candidate value runs are shared so long runs are read once.
*/
const FORM_BODY_FIRST_PAIR_MATCHER = Object.freeze({
	source: "form-body-first-pair (linear)",
	*exec(text) {
		const valueEnd = makeCachedRunEnd(text, (char) => char !== "&" && !isJsWhitespaceChar(char));
		let searchFloor = 0;
		let separator = text.indexOf("=");
		while (separator !== -1) {
			let keyStart = separator;
			while (keyStart > 0 && FORM_FIRST_PAIR_KEY_CHAR(text[keyStart - 1])) keyStart -= 1;
			const key = text.slice(keyStart, separator);
			if (separator >= searchFloor && key.length > 0 && FORM_FIRST_PAIR_KEYS_RE.test(key) && (keyStart === 0 || text[keyStart - 1] === "," || text[keyStart - 1] === ";" || isJsWhitespaceAt(text, keyStart - 1))) {
				const start = separator + 1;
				const end = valueEnd(start);
				if (end > start && end < text.length && text[end] === "&" && isFormPairBoundary(text, end)) {
					const matchStart = keyStart > 0 ? keyStart - 1 : 0;
					yield {
						match: text.slice(matchStart, end),
						groups: [keyStart > 0 ? text[keyStart - 1] : "", text.slice(start, end)],
						input: text,
						offset: matchStart
					};
					searchFloor = end;
					separator = text.indexOf("=", end);
					continue;
				}
			}
			separator = text.indexOf("=", separator + 1);
		}
	}
});
const STANDALONE_QUOTED_PREFIX_SOURCE = String.raw`(^|[\s,;({\["])(?:${STANDALONE_ASSIGNMENT_SECRET_KEYS})=(["'\x60])`;
const CONFIG_QUOTED_PREFIX_SOURCE = String.raw`(^|[\s,{])(?:(?:${CONFIG_QUOTED_ASSIGNMENT_SECRET_KEYS})(?:\s*:\s*|\s+=\s*|=\s*)|[a-z0-9][a-z0-9._-]{0,79}[-_](?:${CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_SECRET_KEYS})\s*[:=]\s*|[a-z0-9_.-]{1,80}\.(?:${CONFIG_ASSIGNMENT_SECRET_KEYS})\s*[:=]\s*)(["'\x60])`;
/**
* Shared matcher for the two quoted-value rules. The tempered dot `((?:(?!\2)[^\r\n])+)`
* forced a per-character lookahead and one backtrack stack entry per value character; the
* value here is a linear scan to the first closing quote or line end, and failed scans are
* memoized per quote character because later candidates share their tail regions.
*/
function makeQuotedAssignmentMatcher(source, prefixSource, flags) {
	const prefixRegexPool = [];
	function* exec(text) {
		const prefixRe = prefixRegexPool.pop() ?? new RegExp(prefixSource, flags);
		const failedScans = /* @__PURE__ */ new Map();
		let searchFrom = 0;
		try {
			for (;;) {
				prefixRe.lastIndex = searchFrom;
				const prefix = prefixRe.exec(text);
				if (!prefix) return;
				const start = prefix.index;
				const quote = prefix[2];
				const valueStart = start + prefix[0].length;
				const memo = failedScans.get(quote);
				let closing = -1;
				if (!(memo !== void 0 && valueStart >= memo.start && valueStart < memo.end)) {
					closing = valueStart;
					while (closing < text.length) {
						const char = text[closing];
						if (char === quote || char === "\r" || char === "\n") break;
						closing += 1;
					}
				}
				if (closing > valueStart && text[closing] === quote) {
					const end = closing + 1;
					yield {
						match: text.slice(start, end),
						groups: [
							prefix[1] ?? "",
							quote,
							text.slice(valueStart, closing)
						],
						input: text,
						offset: start
					};
					searchFrom = end;
				} else {
					if (closing !== -1) failedScans.set(quote, {
						start: valueStart,
						end: closing
					});
					searchFrom = start + 1;
				}
			}
		} finally {
			prefixRe.lastIndex = 0;
			prefixRegexPool.push(prefixRe);
		}
	}
	return Object.freeze({
		source,
		exec
	});
}
const STANDALONE_QUOTED_MATCHER = makeQuotedAssignmentMatcher("standalone-quoted-assignment (linear)", STANDALONE_QUOTED_PREFIX_SOURCE, "gi");
const CONFIG_QUOTED_MATCHER = makeQuotedAssignmentMatcher("config-quoted-assignment (linear)", CONFIG_QUOTED_PREFIX_SOURCE, "g");
/** Default rule sources whose compilation routes to the linear matchers above. */
const LINEAR_MATCHER_SOURCES = /* @__PURE__ */ new Map([
	[base64SafeToken(String.raw`gAAAA[A-Za-z0-9_=-]{20,}`), GAAAA_TOKEN_MATCHER],
	[base64SafeToken(String.raw`ATCTT3xFfG[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8}`), ATCTT_TOKEN_MATCHER],
	[base64SafeToken(String.raw`ATATT[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8}`), ATATT_TOKEN_MATCHER],
	[base64SafeToken(String.raw`ATBB[A-Za-z0-9_=.-]{16,}`), ATBB_TOKEN_MATCHER],
	[base64SafeToken(String.raw`dapi[0-9a-f]{32}(?:-\d)?`), DAPI_TOKEN_MATCHER],
	[base64SafeToken(String.raw`AKIA[A-Z0-9]{16}`), AKIA_TOKEN_MATCHER],
	[base64SafeToken(String.raw`ASIA[A-Z0-9]{16}`), ASIA_TOKEN_MATCHER],
	[JWT_REDACT_PATTERN, JWT_MATCHER],
	[URL_USERINFO_REDACT_PATTERN, URL_USERINFO_MATCHER],
	[CONNECTION_STRING_REDACT_PATTERN, CONNECTION_STRING_MATCHER],
	[FORM_BODY_FIRST_PAIR_REDACT_PATTERN, FORM_BODY_FIRST_PAIR_MATCHER],
	[STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN, STANDALONE_QUOTED_MATCHER],
	[CONFIG_QUOTED_ASSIGNMENT_REDACT_PATTERN, CONFIG_QUOTED_MATCHER]
]);
//#endregion
//#region src/logging/redact-performance.ts
const redactionPerformance = channel("openclaw.redaction");
/** The capture subscriber receives counts and synchronous CPU time, never text or patterns. */
function startRedactionMeasurement(operation) {
	if (!redactionPerformance.hasSubscribers) return;
	const startedAt = performance.now();
	const cpu = process.threadCpuUsage();
	return (outcome, inputChars, patternCount) => {
		const elapsedMs = performance.now() - startedAt;
		const used = process.threadCpuUsage(cpu);
		redactionPerformance.publish({
			operation,
			outcome,
			pid: process.pid,
			threadId,
			isMainThread,
			elapsedMs,
			threadCpuMs: (used.user + used.system) / 1e3,
			...inputChars === void 0 ? {} : { inputChars },
			...patternCount === void 0 ? {} : { patternCount }
		});
	};
}
//#endregion
//#region src/logging/redact-prefilter.ts
const FIELD_KEY_PREFILTER_RE = /KEY|TOKEN|SECRET|PASSWORD|PASSWD|AUTH|COOKIE|SIGNATURE|CREDENTIAL|CARD|CVC|CVV|PAYMENT|security[-_]?code|\bpass\s*[=:]|\bpassphrase\s*[=:]|_(?:password|pass|passphrase|passwd)\s*[=:]|jwt\s*[=:]|session=|code=|\bsig\s*=/iu;
const SEPARATED_VENDOR_PREFILTER_RE = /sk-|GOCSPX-|gh[opsur]_|github_pat_|glpat-|gloas-|gldt-|glcbt-|glptt-|glft-|glimt-|glagent-|glwt-|glsoat-|glffct-|glrt-|glrtr-|_gitlab_session=|xox[baprs]-|xapp-|gsk_|pplx-|fal_|fc-|bb_live_|[sr]k_(?:live|test)_|npm_|pypi-|do[opr]_v1_|dckr_|bkua_|CCIPAT_|sbp_|dd[pw]_|glsa_|nfp_|CFPAT-|BBDC-|HRKU-|pat-(?:eu|na)1-|apify_api_|fio-u-|tvly-|exa_|syt_|retaindb_|mem0_|brv_|xai-|fw-|fw_|fpk_|(?:^|[^A-Za-z0-9_])(?:am_|sk_)|hf_|api_org_|r8_/iu;
const DEFAULT_REDACT_PREFILTER_RE = /PRIVATE KEY|\bBearer\s+|GR1348941|hooks\.slack\.com|discord|AIza|ya29\.|1\/\/0|eyJ|gAAAA|SG\.|dp\.(?:ct|pt|sa|st|scim|audit)\.|dapi[0-9a-f]|ATCTT3|ATATT|ATBB|FlyV1|A[KS]IA[A-Z0-9]|AKID|LTAI|\bbot\d{6,}:|\b\d{6,}:[A-Za-z0-9_-]{20,}/iu;
const OBFUSCATED_KEY_CHAR_RE = new RegExp(`[${FORM_BODY_KEY_INVISIBLE_CHARS}+%]`, "u");
const FULL_CONTEXT_REDACT_EXTRA_TRIGGERS_RE = /JWT|Bearer\s+|am_|sk_|(?<!\d)\d{6,}:[A-Za-z0-9_-]{20,}/i;
function couldMatchDefaultRedactPatterns(text) {
	return FIELD_KEY_PREFILTER_RE.test(text) || (text.includes("-") || text.includes("_")) && SEPARATED_VENDOR_PREFILTER_RE.test(text) || DEFAULT_REDACT_PREFILTER_RE.test(text) || text.includes("://") && text.includes("@") || text.includes("=") && OBFUSCATED_KEY_CHAR_RE.test(text) || AWS_SECRET_ACCESS_KEY_MATCHER.couldMatch(text);
}
function couldMatchDefaultFullContextPatterns(text) {
	return couldMatchDefaultRedactPatterns(text) || FULL_CONTEXT_REDACT_EXTRA_TRIGGERS_RE.test(text);
}
function couldMatchVendorRedactPatterns(text) {
	return (text.includes("-") || text.includes("_")) && SEPARATED_VENDOR_PREFILTER_RE.test(text) || DEFAULT_REDACT_PREFILTER_RE.test(text) || FULL_CONTEXT_REDACT_EXTRA_TRIGGERS_RE.test(text);
}
function createRedactPrefilter(probe) {
	const matches = /* @__PURE__ */ new Map();
	return (text) => {
		const cached = matches.get(text);
		if (cached !== void 0) return cached;
		const result = probe(text);
		matches.set(text, result);
		return result;
	};
}
//#endregion
//#region src/logging/secret-redaction-registry.ts
const MIN_SECRET_VALUE_LENGTH = 6;
const state$1 = resolveGlobalSingleton(Symbol.for("openclaw.secretRedactionRegistry"), () => ({
	registeredValues: /* @__PURE__ */ new Map(),
	registeredValueRedactor: void 0
}));
function invalidateMatcher() {
	state$1.registeredValueRedactor = void 0;
}
/** Replaces registered exact values while preserving the caller's mask convention. */
function redactRegisteredSecretValues(text, mask) {
	if (!text || state$1.registeredValues.size === 0) return text;
	state$1.registeredValueRedactor ??= createSecretValueRedactor([...state$1.registeredValues.keys()]);
	return state$1.registeredValueRedactor(text, mask);
}
function createSecretValueRedactor(values) {
	let compiledMatcher;
	let firstChars;
	return (text, mask) => {
		if (!text || values.length === 0) return text;
		let couldMatch = false;
		firstChars ??= new Set(values.map((value) => value.charAt(0)));
		for (const firstChar of firstChars) if (text.includes(firstChar)) {
			couldMatch = true;
			break;
		}
		if (!couldMatch) return text;
		if (!compiledMatcher) {
			const buckets = /* @__PURE__ */ new Map();
			for (const value of values.toSorted((left, right) => right.length - left.length)) {
				const prefix = value.slice(0, MIN_SECRET_VALUE_LENGTH);
				const bucket = buckets.get(prefix);
				if (bucket) bucket.push(value);
				else buckets.set(prefix, [value]);
			}
			compiledMatcher = {
				prefixes: new RegExp([...buckets.keys()].map(escapeRegExp).join("|"), "g"),
				buckets
			};
		}
		const { prefixes, buckets } = compiledMatcher;
		const matches = [];
		prefixes.lastIndex = 0;
		for (let match = prefixes.exec(text); match; match = prefixes.exec(text)) {
			const index = match.index;
			const value = buckets.get(match[0])?.find((candidate) => text.startsWith(candidate, index));
			if (value !== void 0) matches.push({
				index,
				value
			});
			prefixes.lastIndex = index + (value?.length ?? 1);
		}
		let result = "";
		let cursor = 0;
		for (const match of matches) {
			result += `${text.slice(cursor, match.index)}${mask(match.value, match.index)}`;
			cursor = match.index + match.value.length;
		}
		return result + text.slice(cursor);
	};
}
function resetSecretRedactionRegistryForTest() {
	state$1.registeredValues.clear();
	invalidateMatcher();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.secretRedactionRegistryTestApi")] = { resetSecretRedactionRegistryForTest };
//#endregion
//#region src/shared/assistant-error-format.ts
const HTTP_STATUS_DELIMITER_RE = /(?:\s*:\s*|\s+)/;
new RegExp(`^(?:http\\s*)?(\\d{3})${HTTP_STATUS_DELIMITER_RE.source}(.+)$`, "i");
new RegExp(`^(?:http\\s*)?(\\d{3})(?:${HTTP_STATUS_DELIMITER_RE.source}([\\s\\S]+))?$`, "i");
const CONNECTION_FAILED_MESSAGE = "Couldn't connect to the AI service. Check your connection, then try again. For details, open Settings → Logs in the Control UI or run `openclaw logs --follow`.";
const TRANSPORT_ERRORS = [
	{
		code: /\beconnrefused\b/i,
		phrases: /connection refused|actively refused/i,
		message: CONNECTION_FAILED_MESSAGE
	},
	{
		code: /\beconnreset\b|\beconnaborted\b|\benetreset\b|\bepipe\b/i,
		phrases: /socket hang up|connection reset|connection aborted/i,
		message: "Lost the connection to the AI service. Check the conversation before trying again. For details, open Settings → Logs in the Control UI or run `openclaw logs --follow`."
	},
	{
		code: /\benotfound\b|\beai_again\b|\benetunreach\b|\behostunreach\b|\behostdown\b/i,
		phrases: /getaddrinfo|no such host|\bdns\b|network is unreachable|host is unreachable|fetch failed|connection error|network request failed/i,
		message: CONNECTION_FAILED_MESSAGE
	}
];
function isKnownTransportErrorCode(value) {
	return TRANSPORT_ERRORS.some(({ code }) => code.exec(value)?.[0] === value);
}
//#endregion
//#region src/logging/structured-authorization-code.ts
function shouldRedactStructuredAuthorizationCode(normalizedKey, path, transportCode) {
	if (normalizedKey !== "code") return false;
	const normalizedPath = path.map((part) => part.toLowerCase());
	if (normalizedPath.length === 1 || normalizedPath.at(-1) === "code" && [
		"error",
		"nodeerror",
		"status",
		"details",
		"warnings"
	].includes(normalizedPath.at(-2) ?? "")) return false;
	return !(transportCode !== void 0 && normalizedPath.length > 1 && normalizedPath.slice(0, -1).every((part) => part === "cause") && isKnownTransportErrorCode(transportCode));
}
//#endregion
//#region src/logging/redact.ts
const DEFAULT_REDACT_MODE = "tools";
const backendPatterns = createBackendRedactPatterns();
const { redactAssignmentValues, redactFormBody } = createFormBodyRedactor(backendPatterns.bodySecretKeys);
const shellReferencePreservingPatterns = /* @__PURE__ */ new WeakSet();
const builtInResolvedPatterns = /* @__PURE__ */ new WeakSet();
const vendorResolvedPatterns = /* @__PURE__ */ new WeakMap();
const vendorSources = new Set(VENDOR_TOKEN_REDACT_PATTERNS);
const chunkUnsafePatterns = /* @__PURE__ */ new WeakSet();
const canonicalBuiltInSources = new Set(DEFAULT_REDACT_PATTERNS.filter((entry) => typeof entry === "string"));
const formAwareEqualsAssignmentPatterns = /* @__PURE__ */ new WeakSet();
let defaultResolvedPatterns;
let warnedInvalidPatterns = false;
const STRUCTURED_SECRET_FIELD_RE = new RegExp(String.raw`^(?:api[-_]?key|apiKey|api[-_]?token|apiToken|bearer[-_]?token|bearerToken|token|secret|password|passwd|${AWS_SECRET_ACCESS_KEY_FIELD_KEYS}|credential|authorization|private[-_]?key|privateKey|access[-_]?token|accessToken|refresh[-_]?token|refreshToken|id[-_]?token|idToken|auth[-_]?token|authToken|client[-_]?secret|clientSecret|app[-_]?secret|appSecret|secret[-_]?value|secretValue|raw[-_]?secret|rawSecret|secret[-_]?input|secretInput|key|key[-_]?material|keyMaterial|jwt|session|signature|cookie|set[-_]?cookie|${PAYMENT_CREDENTIAL_QUERY_KEYS}|${PAYMENT_CREDENTIAL_JSON_KEYS})$`, "i");
const STRUCTURED_INTERNAL_SOURCE_PATH_VALUE_RE = /^\$WORKSPACE_DIR\/[A-Za-z0-9._/-]+\.jsonl$/u;
const STRUCTURED_APP_PASSWORD_FIELD_RE = /^(?:apple|icloud|app[-_]?specific[-_]?password|appSpecificPassword|application[-_]?password|text|content|message|error|errorMessage|detail|details|reason)$/i;
const APP_SPECIFIC_PASSWORD_RE = /\b([a-z]{4}-[a-z]{4}-[a-z]{4}-[a-z]{4})\b/g;
const BENIGN_APP_PASSWORD_WORDS = /* @__PURE__ */ new Set([
	"case",
	"claw",
	"demo",
	"file",
	"main",
	"name",
	"open",
	"path",
	"slug",
	"test"
]);
const STRUCTURED_SECRET_ENV_FIELD_RE = new RegExp(String.raw`^(?:(?:[A-Z0-9]+[_-])+(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD)|API[_-]?KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})$`, "i");
function parsePattern(raw) {
	if (raw === PEM_REDACT_PATTERN_SOURCE) return PEM_REDACT_MATCHER;
	if (typeof raw !== "string" && !(raw instanceof RegExp)) return raw !== null && typeof raw === "object" && typeof raw.exec === "function" ? raw : null;
	let pattern = typeof raw === "string" ? LINEAR_MATCHER_SOURCES.get(raw) ?? null : null;
	let canPrefilter = true;
	if (raw instanceof RegExp) {
		if (raw.flags.includes("g")) pattern = raw;
		else pattern = new RegExp(raw.source, `${raw.flags}g`);
	} else if (!pattern && raw.trim()) {
		const [source, flags] = parseRedactPatternSource(raw);
		const optimized = canonicalBuiltInSources.has(raw) ? rewriteOpenEndedRepeats(source, flags) : source;
		pattern = compileConfigRegex(optimized, flags)?.regex ?? null;
		canPrefilter = pattern !== null && pattern.source === optimized && pattern.flags === flags && pattern.exec === RegExp.prototype.exec && pattern[Symbol.replace] === RegExp.prototype[Symbol.replace];
	}
	if (pattern && typeof raw === "string" && backendPatterns.shellReferencePreserving.has(raw)) shellReferencePreservingPatterns.add(pattern);
	if (pattern && typeof raw === "string" && backendPatterns.formAware.has(raw)) formAwareEqualsAssignmentPatterns.add(pattern);
	if (pattern && typeof raw === "string" && (raw.startsWith(IDENTIFIER_SAFE_TOKEN_BOUNDARY) || backendPatterns.chunkUnsafe.has(raw))) chunkUnsafePatterns.add(pattern);
	if (pattern && typeof raw === "string") {
		if (canonicalBuiltInSources.has(raw)) builtInResolvedPatterns.add(pattern);
		if (canPrefilter && vendorSources.has(raw) && !vendorResolvedPatterns.has(pattern)) {
			const source = pattern.source;
			const exec = pattern.exec;
			const flags = pattern instanceof RegExp ? pattern.flags : void 0;
			const replace = pattern instanceof RegExp ? pattern[Symbol.replace] : void 0;
			vendorResolvedPatterns.set(pattern, () => pattern.source === source && pattern.exec === exec && (!(pattern instanceof RegExp) || pattern.flags === flags && pattern[Symbol.replace] === replace));
		}
		const probe = backendPatterns.prefilters.get(raw);
		if (canPrefilter && probe) setRedactPatternPrefilter(pattern, probe);
	}
	return pattern;
}
function resolvePatterns(value) {
	if (usesBuiltInRedactPatterns(value)) {
		defaultResolvedPatterns ??= DEFAULT_REDACT_PATTERNS.map(parsePattern).filter((re) => Boolean(re));
		return defaultResolvedPatterns;
	}
	const combined = /* @__PURE__ */ new Set();
	let invalid = !Array.isArray(value);
	for (const raw of Array.isArray(value) ? value : []) {
		const resolved = parsePattern(raw);
		if (resolved) combined.add(resolved);
		else invalid = true;
	}
	if (invalid) {
		for (const pattern of resolvePatterns()) combined.add(pattern);
		if (!warnedInvalidPatterns) {
			warnedInvalidPatterns = true;
			try {
				console.warn("[openclaw] Ignoring invalid logging.redactPatterns entries; keeping valid patterns and built-in redaction. Fix logging.redactPatterns in your config.");
			} catch {}
		}
	}
	combined.add(AWS_SECRET_ACCESS_KEY_MATCHER);
	return [...combined];
}
function usesBuiltInRedactPatterns(value) {
	return value === void 0 || value === DEFAULT_REDACT_PATTERNS || Array.isArray(value) && value.length === 0;
}
function isShellReferenceToKey(key, value) {
	if (!/^[A-Z_][A-Z0-9_]*$/.test(key)) return false;
	const bare = value.match(/^\$([A-Z_][A-Z0-9_]*)$/);
	if (bare) return bare[1] === key;
	return value.match(/^\$\{([A-Z_][A-Z0-9_]*)(?::[-=?+])?\}$/)?.[1] === key;
}
function maskSecretFieldValue(key, value) {
	const expansion = value.match(/^\$\{([A-Z_][A-Z0-9_]*):[-=?+][^{}]+\}(?![\s\S])/);
	if (expansion && expansion[1] === key) return `${value.slice(0, value.indexOf(":") + 2)}***}`;
	return "***";
}
function shouldPreserveShellReferenceMatch(match, token) {
	const key = match.match(/\b([A-Z_][A-Z0-9_]*)\b\s*[=:]/)?.[1];
	return key ? isShellReferenceToKey(key, token) : false;
}
function isEmptyShellParameterExpansionTail(token) {
	return /^[-=?+]\}$/.test(token);
}
function prepareRedactionCapture({ match, groups, input, offset, replacement: policyReplacement }, pattern) {
	if (match.includes("PRIVATE KEY-----")) return {
		start: offset,
		end: offset + match.length,
		value: match,
		redact: (target) => ({
			start: target.start,
			end: target.end,
			value: target.value,
			replacement: policyReplacement ?? redactPemBlock(target.value, "…redacted…")
		})
	};
	const selected = selectSecretCapture(match, groups);
	if (selected.value === "***") return;
	const tokenIndex = selected.value === match ? 0 : getSecretCaptureStart(pattern, input, match, offset, selected);
	if (tokenIndex < 0) return;
	const start = offset + tokenIndex;
	return {
		start,
		end: start + selected.value.length,
		value: selected.value,
		redact: (target) => {
			const token = target.value;
			const formAwareValue = formAwareEqualsAssignmentPatterns.has(pattern) ? splitFormAwareCredentialValue(token) : {
				secret: token,
				suffix: ""
			};
			if (splitSecretValueForMask(formAwareValue.secret).maskable === "***") return;
			const isShellReferencePattern = shellReferencePreservingPatterns.has(pattern);
			if (isShellReferencePattern && (shouldPreserveShellReferenceMatch(match, token) || isEmptyShellParameterExpansionTail(token))) return;
			const masked = policyReplacement ?? (isShellReferencePattern ? maskToken(token) : `${maskSecretValue(formAwareValue.secret, { hinted: true })}${formAwareValue.suffix}`);
			return {
				start: target.start,
				end: target.end,
				replacement: masked
			};
		}
	};
}
function redactMatch(match, pattern) {
	const capture = prepareRedactionCapture(match, pattern);
	const edit = capture?.redact(capture);
	return edit ? match.match.slice(0, edit.start - match.offset) + edit.replacement + match.match.slice(edit.end - match.offset) : match.match;
}
function redactText(text, patterns, options) {
	const finishMeasurement = startRedactionMeasurement("text");
	let outcome = "error";
	try {
		let next = redactFormBody(redactAssignmentValues(redactStructuredAuthHeaders(text, "***"), "url"));
		let pattern;
		const replace = (match) => redactMatch(match, pattern);
		const replaceRegex = (...args) => replace(readRedactMatch(args));
		let vendorInput;
		let vendorMatch = false;
		for (pattern of patterns) {
			if (vendorResolvedPatterns.get(pattern)?.()) {
				if (vendorInput !== next) {
					vendorInput = next;
					vendorMatch = couldMatchVendorRedactPatterns(next);
				}
				if (!vendorMatch) {
					if (pattern instanceof RegExp) pattern.lastIndex = 0;
					continue;
				}
			}
			next = pattern instanceof RegExp && !options?.fullContext && !builtInResolvedPatterns.has(pattern) && !chunkUnsafePatterns.has(pattern) ? replacePatternBounded(next, pattern, replaceRegex) : replaceRedactPattern(next, pattern, replace, replaceRegex);
		}
		outcome = "ok";
		return next;
	} finally {
		finishMeasurement?.(outcome, text.length, patterns.length);
	}
}
function looksLikeAppSpecificPassword(candidate) {
	return candidate.split("-").every((part) => !BENIGN_APP_PASSWORD_WORDS.has(part.toLowerCase()));
}
function redactAppSpecificPasswords(text) {
	if (!text.includes("-")) return text;
	return text.replace(APP_SPECIFIC_PASSWORD_RE, (match, token) => looksLikeAppSpecificPassword(token) ? maskToken(token) : match);
}
function resolveConfigRedaction() {
	const cfg = readLoggingConfig();
	return {
		mode: DEFAULT_REDACT_MODE,
		patterns: cfg?.redactPatterns
	};
}
function resolveRedactOptions(options) {
	const resolved = options ?? resolveConfigRedaction();
	const mode = resolved.mode === "off" ? "off" : DEFAULT_REDACT_MODE;
	return {
		mode,
		patterns: mode === "off" ? [] : resolvePatterns(resolved.patterns)
	};
}
function redactSensitiveText(text, options) {
	if (!text) return text;
	return redactSensitiveTextWithOptions(redactRegisteredSecretValues(text, maskToken), options ?? resolveConfigRedaction());
}
function redactSensitiveTextWithOptions(exactRedacted, resolvedOptions) {
	if (resolvedOptions.mode === "off") return exactRedacted;
	if (usesBuiltInRedactPatterns(resolvedOptions.patterns) && !couldMatchDefaultRedactPatterns(exactRedacted)) return exactRedacted;
	return redactText(exactRedacted, resolveRedactOptions(resolvedOptions).patterns);
}
function resolveToolPayloadRedaction(loggingConfig = readLoggingConfig()) {
	const userPatterns = loggingConfig?.redactPatterns;
	return {
		mode: "tools",
		patterns: Array.isArray(userPatterns) && userPatterns.length > 0 ? [...userPatterns, ...DEFAULT_REDACT_PATTERNS] : userPatterns
	};
}
function redactToolPayloadText(text) {
	return redactToolPayloadTextWithConfig(text, readLoggingConfig());
}
function redactToolPayloadTextWithConfig(text, loggingConfig) {
	return redactSensitiveText(text, resolveToolPayloadRedaction(loggingConfig));
}
function isSensitiveFieldKey(key) {
	return STRUCTURED_SECRET_FIELD_RE.test(key) || STRUCTURED_SECRET_ENV_FIELD_RE.test(key);
}
function isPublicShareIdPath(path) {
	if (path.at(-1)?.toLowerCase() !== "id") return false;
	return path.at(-2)?.toLowerCase().replaceAll("-", "").replaceAll("_", "") === "publicshare";
}
function redactSensitiveFieldValueWithOptions(key, value, options, path = [key], objectPath = true, couldMatch = couldMatchDefaultRedactPatterns) {
	const exactRedacted = redactRegisteredSecretValues(value, maskToken);
	if (isPublicShareIdPath(path)) return maskToken(exactRedacted);
	const resolved = resolveRedactOptions(options);
	if (resolved.mode === "off") return exactRedacted;
	const redacted = !usesBuiltInRedactPatterns(options.patterns) || couldMatch(exactRedacted) ? redactText(exactRedacted, resolved.patterns) : exactRedacted;
	if (redacted !== value || STRUCTURED_APP_PASSWORD_FIELD_RE.test(key)) {
		const appRedacted = redactAppSpecificPasswords(redacted);
		if (appRedacted !== value) return appRedacted;
	}
	if (redacted !== value) return redacted;
	return shouldRedactStructuredStringField(key, exactRedacted, path, objectPath) ? maskToken(exactRedacted) : exactRedacted;
}
function shouldRedactStructuredPrimitiveField(key, path) {
	const normalizedKey = key.toLowerCase();
	return isPublicShareIdPath(path) || shouldRedactStructuredAuthorizationCode(normalizedKey, path) || isSensitiveFieldKey(key);
}
function isPlainRedactableObject(value) {
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}
function redactStructuredSecretValue(key, value, seen, options, couldMatch, path = key ? [key] : [], objectPath = true) {
	if (typeof value === "string") return redactSensitiveFieldValueWithOptions(key, value, options, path, objectPath, couldMatch);
	if (value === null || value === void 0) return value;
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return shouldRedactStructuredPrimitiveField(key, path) ? "***" : value;
	if (Array.isArray(value)) {
		if (seen.has(value)) return "[Circular]";
		seen.add(value);
		const out = value.map((entry) => redactStructuredSecretValue(key, entry, seen, options, couldMatch, path, false));
		seen.delete(value);
		return out;
	}
	if (typeof value === "object") {
		if (seen.has(value)) return "[Circular]";
		if (!isPlainRedactableObject(value)) return value;
		seen.add(value);
		const entries = Object.entries(value);
		for (const entry of entries) {
			const [name, child] = entry;
			entry[1] = redactStructuredSecretValue(name, child, seen, options, couldMatch, [...path, name], objectPath);
		}
		seen.delete(value);
		return Object.fromEntries(entries);
	}
	return value;
}
function redactSecretsWithOptions(value, options) {
	if (typeof value === "string") return redactSensitiveText(value, options);
	if (value === null || typeof value !== "object") return value;
	return redactStructuredSecretValue("", value, /* @__PURE__ */ new WeakSet(), options, createRedactPrefilter(couldMatchDefaultRedactPatterns));
}
function redactSecrets(value) {
	return redactSecretsWithOptions(value, resolveToolPayloadRedaction());
}
function preservesStructuredReference(key, value) {
	return key.toLowerCase() === "session" && STRUCTURED_INTERNAL_SOURCE_PATH_VALUE_RE.test(value) || isShellReferenceToKey(key, value);
}
function shouldRedactStructuredStringField(key, value, path, objectPath) {
	return shouldRedactStructuredAuthorizationCode(key.toLowerCase(), path, objectPath ? value : void 0) || isSensitiveFieldKey(key) && !preservesStructuredReference(key, value);
}
function classifyLogFieldProtection(key, path, objectPath, value) {
	return (value === void 0 ? shouldRedactStructuredPrimitiveField(key, path) : isPublicShareIdPath(path) || shouldRedactStructuredStringField(key, value, path, objectPath)) ? "legacy" : backendPatterns.credentialHeaderField.test(key) ? "header" : void 0;
}
function getFieldRecordEdits(field, mode) {
	const { key, value, path, objectPath } = field;
	if (mode === "off" || !field.string && value === "null" || !classifyLogFieldProtection(key, path, objectPath, field.string ? value : void 0)) return [];
	return [{
		start: 0,
		end: value.length,
		replacement: maskSecretFieldValue(key, value)
	}];
}
function getTextRecordEdits(field, mode, fileFields) {
	const { value } = field;
	if (field.isKey || fileFields && !field.origin.structured) return [];
	if (fileFields && field.origin.primitiveMask) return [{
		start: 0,
		end: value.length,
		replacement: "***"
	}];
	if (!field.string) return [];
	const edits = [];
	const registered = redactRegisteredSecretValues(value, (secret, start) => {
		const replacement = maskToken(secret);
		edits.push({
			start,
			end: start + secret.length,
			replacement
		});
		return replacement;
	});
	if (fileFields && isPublicShareIdPath(field.path)) return [{
		start: 0,
		end: value.length,
		replacement: maskToken(registered)
	}];
	if (mode === "off") return edits;
	let combined = edits;
	const receive = (added) => {
		combined = composeRedactionEdits(value.length, combined, added);
	};
	const headers = findStructuredAuthParamRanges(registered).map(({ start, end }) => ({
		start,
		end,
		replacement: "***"
	}));
	receive(headers);
	const url = redactAssignmentValues(applyRedactionEdits(registered, headers), "url", receive);
	redactFormBody(url, receive);
	return combined;
}
function getLegacyFieldRecordEdits(field, value) {
	const { key, value: original, path, objectPath } = field;
	if (field.isKey || !field.origin.structured || !field.string) return [];
	if (isPublicShareIdPath(path)) return [];
	const edits = [];
	if (value !== original || STRUCTURED_APP_PASSWORD_FIELD_RE.test(key)) {
		for (const match of value.matchAll(APP_SPECIFIC_PASSWORD_RE)) if (looksLikeAppSpecificPassword(match[0])) edits.push({
			start: match.index,
			end: match.index + match[0].length,
			replacement: maskToken(match[0])
		});
	}
	if (edits.length > 0 || value !== original) return edits;
	return classifyLogFieldProtection(key, path, objectPath, value) === "legacy" ? [{
		start: 0,
		end: value.length,
		replacement: maskToken(value)
	}] : [];
}
function* redactionEditMatches(input, edits) {
	for (const edit of edits) yield {
		match: input.slice(edit.start, edit.end),
		groups: [],
		input,
		offset: edit.start,
		replacement: edit.replacement
	};
}
const preparationPatterns = [
	{
		source: "registered secret values",
		*exec(input) {
			const matches = [];
			redactRegisteredSecretValues(input, (secret, offset) => {
				matches.push({
					match: secret,
					groups: [],
					input,
					offset,
					replacement: maskToken(secret)
				});
				return secret;
			});
			yield* matches;
		}
	},
	{
		source: "structured authorization parameters",
		*exec(input) {
			for (const { start, end } of findStructuredAuthParamRanges(input)) yield {
				match: input.slice(start, end),
				groups: [],
				input,
				offset: start,
				replacement: "***"
			};
		}
	},
	{
		source: "URL query assignments",
		*exec(input) {
			const edits = [];
			redactAssignmentValues(input, "url", (added) => edits.push(...added));
			yield* redactionEditMatches(input, edits);
		}
	},
	{
		source: "form bodies",
		*exec(input) {
			let edits = [];
			redactFormBody(input, (added) => {
				edits = composeRedactionEdits(input.length, edits, added);
			});
			yield* redactionEditMatches(input, edits);
		}
	}
];
const CONSOLE_STRUCTURAL_FIELDS = /* @__PURE__ */ new Set(["time", "level"]);
/** Converts native values once and applies configured and structural protection before output. */
function redactLogRecordForTransport(record, tail) {
	const finishMeasurement = startRedactionMeasurement("log-record");
	let outcome = "error";
	let inputChars;
	try {
		const resolved = tail?.redaction ?? resolveRedactOptions();
		const origins = {
			value: {
				structured: true,
				primitiveMask: false
			},
			children: /* @__PURE__ */ new Map()
		};
		const ancestors = [];
		const json = JSON.stringify(record, function(key, value) {
			while (ancestors.length > 0 && ancestors.at(-1)?.value !== this) ancestors.pop();
			const parent = ancestors.at(-1);
			const array = Array.isArray(this);
			const fieldKey = array && parent ? parent.key : key;
			const path = array && parent ? parent.path : parent ? [...parent.path, key] : [];
			const source = value;
			const structured = (parent?.structured ?? true) && (source === null || typeof source !== "object" || Array.isArray(source) || isPlainRedactableObject(source));
			const primitiveMask = structured && [
				"number",
				"boolean",
				"bigint"
			].includes(typeof source) && classifyLogFieldProtection(fieldKey, path, !array, void 0) === "legacy";
			const circular = value !== null && typeof value === "object" && ancestors.some((frame) => frame.value === value);
			const emitted = circular ? "[Circular]" : typeof value === "bigint" ? String(value) : value;
			const container = emitted !== null && typeof emitted === "object";
			let node = origins;
			if (parent && parent.structured && (container || !structured || primitiveMask || circular)) {
				node = {
					value: {
						structured: structured && !circular,
						primitiveMask
					},
					children: /* @__PURE__ */ new Map()
				};
				parent.origins.children.set(key, node);
			} else if (parent) node = parent.origins;
			else origins.value = {
				structured,
				primitiveMask
			};
			if (container) ancestors.push({
				value: emitted,
				path,
				key: fieldKey,
				origins: node,
				structured
			});
			return emitted;
		});
		inputChars = json.length;
		const couldMatch = createRedactPrefilter(couldMatchDefaultFullContextPatterns);
		const result = JSON.parse(redactJsonRecord(json, origins, [[{ patterns: resolved.patterns }], [{ patterns: preparationPatterns }, {
			patterns: resolved.patterns,
			...resolved.patterns === defaultResolvedPatterns ? { couldMatch } : {}
		}]], prepareRedactionCapture, tail ? getLegacyFieldRecordEdits : () => [], (field) => getFieldRecordEdits(field, resolved.mode), (field) => getTextRecordEdits(field, resolved.mode, tail !== void 0), (field, currentValue) => field.path.length === 1 && CONSOLE_STRUCTURAL_FIELDS.has(field.key) || resolved.patterns === defaultResolvedPatterns && !couldMatch(currentValue), tail?.message));
		outcome = "ok";
		return result;
	} finally {
		finishMeasurement?.(outcome, inputChars);
	}
}
//#endregion
//#region src/logging/timestamps.ts
const validTimeZoneCache = /* @__PURE__ */ new Map();
const timestampFormatterCache = /* @__PURE__ */ new Map();
let hostTimeZone;
let lastTimestampParts;
function isValidTimeZone(tz) {
	const cached = validTimeZoneCache.get(tz);
	if (cached !== void 0) return cached;
	let valid;
	try {
		new Intl.DateTimeFormat("en", { timeZone: tz }).format();
		valid = true;
	} catch {
		valid = false;
	}
	validTimeZoneCache.set(tz, valid);
	return valid;
}
function resolveEffectiveTimeZone(timeZone) {
	const explicit = timeZone ?? process.env.TZ;
	return explicit && isValidTimeZone(explicit) ? explicit : hostTimeZone ??= Intl.DateTimeFormat().resolvedOptions().timeZone;
}
function formatOffset(offsetRaw) {
	return offsetRaw === "GMT" ? "+00:00" : offsetRaw.slice(3);
}
function getTimestampParts(date, timeZone) {
	const effectiveTimeZone = resolveEffectiveTimeZone(timeZone);
	const second = Math.floor(date.getTime() / 1e3);
	if (lastTimestampParts?.second === second && lastTimestampParts.timeZone === effectiveTimeZone) return lastTimestampParts.parts;
	let fmt = timestampFormatterCache.get(effectiveTimeZone);
	if (!fmt) {
		fmt = new Intl.DateTimeFormat("en", {
			timeZone: effectiveTimeZone,
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
			fractionalSecondDigits: 3,
			timeZoneName: "longOffset"
		});
		timestampFormatterCache.set(effectiveTimeZone, fmt);
	}
	const parts = {};
	for (const part of fmt.formatToParts(date)) parts[part.type] = part.value;
	lastTimestampParts = {
		second,
		timeZone: effectiveTimeZone,
		parts
	};
	return parts;
}
function formatTimestamp(date, options) {
	const style = options?.style ?? "medium";
	const parts = getTimestampParts(date, options?.timeZone);
	const offset = formatOffset(parts.timeZoneName ?? "GMT");
	const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0");
	switch (style) {
		case "short": return `${parts.hour}:${parts.minute}:${parts.second}${offset}`;
		case "medium": return `${parts.hour}:${parts.minute}:${parts.second}.${milliseconds}${offset}`;
		case "long": return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}.${milliseconds}${offset}`;
	}
	throw new Error("Unsupported timestamp style");
}
//#endregion
//#region src/logging/json-console-line.ts
function formatJsonConsoleLine(params) {
	const envelope = {
		...params.meta,
		time: formatTimestamp(/* @__PURE__ */ new Date(), { style: "long" }),
		level: params.level,
		...params.subsystem ? { subsystem: params.subsystem } : {},
		message: params.message
	};
	return JSON.stringify(redactLogRecordForTransport(envelope));
}
/** Formats diagnostics that must bypass console capture without bypassing JSON console style. */
function formatConsoleDiagnosticLine(params) {
	return (loggingState.overrideSettings?.consoleStyle ?? readLoggingConfig()?.consoleStyle) === "json" ? formatJsonConsoleLine(params) : params.message;
}
//#endregion
//#region src/logging/levels.ts
const ALLOWED_LOG_LEVELS = [
	"silent",
	"fatal",
	"error",
	"warn",
	"info",
	"debug",
	"trace"
];
const MIN_LEVEL_BY_LOG_LEVEL = {
	trace: 1,
	debug: 2,
	info: 3,
	warn: 4,
	error: 5,
	fatal: 6,
	silent: Number.POSITIVE_INFINITY
};
function tryParseLogLevel(level) {
	if (typeof level !== "string") return;
	const candidate = level.trim();
	return ALLOWED_LOG_LEVELS.includes(candidate) ? candidate : void 0;
}
function normalizeLogLevel(level, fallback = "info") {
	return tryParseLogLevel(level) ?? fallback;
}
function levelToMinLevel(level) {
	return MIN_LEVEL_BY_LOG_LEVEL[level];
}
function isLogLevelEnabled(level, minimum) {
	return level !== "silent" && minimum !== "silent" && levelToMinLevel(level) >= levelToMinLevel(minimum);
}
//#endregion
//#region src/logging/env-log-level.ts
/** Resolves OPENCLAW_LOG_LEVEL once per value, warning only when the invalid value changes. */
function resolveEnvLogLevelOverride() {
	const trimmed = normalizeOptionalString(process.env.OPENCLAW_LOG_LEVEL) ?? "";
	if (!trimmed) {
		loggingState.invalidEnvLogLevelValue = null;
		return;
	}
	const parsed = tryParseLogLevel(trimmed);
	if (parsed) {
		loggingState.invalidEnvLogLevelValue = null;
		return parsed;
	}
	if (loggingState.invalidEnvLogLevelValue !== trimmed) {
		loggingState.invalidEnvLogLevelValue = trimmed;
		const message = `[openclaw] Ignoring invalid OPENCLAW_LOG_LEVEL="${redactToolPayloadText(trimmed)}" (allowed: ${ALLOWED_LOG_LEVELS.join("|")}).`;
		process.stderr.write(`${formatConsoleDiagnosticLine({
			level: "warn",
			message
		})}\n`);
	}
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/core/asyncContext.js
/**
* Async context store (M2.13) — the runtime-agnostic seam behind `logger.runInContext(ctx, fn)` and the
* automatic attach of the active context onto every log's `_logMeta`.
*
* On Node, Deno, and Bun this is backed by `node:async_hooks`' `AsyncLocalStorage`, so a context set with
* `runInContext` propagates across `await`, `setTimeout`, promise chains, and nested calls. On runtimes
* without `AsyncLocalStorage` (browsers, most edge runtimes) the store degrades to a graceful NO-OP: `run`
* still invokes the function, but no context is propagated (`getStore()` returns `undefined`).
*
* IMPORTANT (sideEffects:false / tree-shaking): this module must NEVER statically import `node:async_hooks`
* at the top level. The constructor — itself only invoked lazily, on first `runInContext` — resolves the
* `AsyncLocalStorage` class through guarded global/builtin probes that work without an ESM `import`. Merely
* importing this module pulls in no Node built-in.
*/
/**
* Best-effort, side-effect-free resolution of the `AsyncLocalStorage` constructor across server runtimes,
* without a top-level `node:async_hooks` import (which would break `sideEffects:false`).
*
* Probe order:
* 1. `globalThis.AsyncLocalStorage` — exposed directly by some runtimes/polyfills.
* 2. `process.getBuiltinModule("node:async_hooks")` — the synchronous, import-free builtin accessor
*    (Node 22+, Bun, Deno) added precisely for cases like this.
*
* Returns `undefined` when no implementation is reachable, so the caller can fall back to the no-op store.
*/
function resolveAsyncLocalStorage() {
	const fromGlobal = globalThis.AsyncLocalStorage;
	if (typeof fromGlobal === "function") return fromGlobal;
	try {
		const getBuiltinModule = globalThis.process?.getBuiltinModule;
		if (typeof getBuiltinModule === "function") {
			const mod = getBuiltinModule("node:async_hooks");
			if (typeof mod?.AsyncLocalStorage === "function") return mod.AsyncLocalStorage;
		}
	} catch {}
}
/** The shared, allocation-free no-op store: runs the function but never propagates context. */
const NOOP_STORE = {
	run: (_ctx, fn) => fn(),
	getStore: () => void 0,
	enabled: false
};
/**
* Build an {@link AsyncContextStore} for the current runtime.
*
* If `ctor` (an `AsyncLocalStorage` constructor, typically from {@link resolveAsyncLocalStorage} or a
* provider that resolved it through `createRequire`) is supplied/resolvable, returns an ALS-backed store
* that nests correctly (the parent's fields are inherited and shallow-merged under a child `run`). Otherwise
* returns the singleton no-op store. Never throws.
*/
function createAsyncContextStore(ctor = resolveAsyncLocalStorage()) {
	if (ctor == null) return NOOP_STORE;
	let als;
	try {
		als = new ctor();
	} catch {
		return NOOP_STORE;
	}
	return wrapStorageInstance(als);
}
/**
* Build an {@link AsyncContextStore} around a USER-SUPPLIED `AsyncLocalStorage`(-shaped) instance —
* the `contextStorage` setting. The injection seam exists for runtimes where automatic resolution
* cannot work, e.g. Cloudflare Workers under the `nodejs_als` compatibility flag: `node:async_hooks`
* is importable there, but there is no `process.getBuiltinModule` and no global to probe. The same
* nested-merge semantics as the auto-resolved store apply. A malformed instance (missing `run` or
* `getStore`) degrades to the no-op store rather than throwing mid-request.
*/
function createAsyncContextStoreFromInstance(instance) {
	try {
		if (typeof instance?.run !== "function" || typeof instance?.getStore !== "function") return NOOP_STORE;
	} catch {
		return NOOP_STORE;
	}
	return wrapStorageInstance(instance);
}
/** Shared ALS-instance wrapper: nested `run`s inherit the parent's fields, new fields win. */
function wrapStorageInstance(als) {
	return {
		enabled: true,
		run(ctx, fn) {
			const parent = als.getStore();
			const merged = parent != null ? {
				...parent,
				...ctx
			} : { ...ctx };
			return als.run(merged, fn);
		},
		getStore() {
			return als.getStore();
		}
	};
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/core/config.js
/**
* A typed configuration error (E6). Thrown by {@link import("./settings.js").validateSettingsParam} for a
* hard misconfiguration when the opt-in `strictConfig: true` setting is set (default `false` keeps the
* warn-only behavior). Carries a stable {@link code}, the offending {@link setting} path, and a
* human-readable {@link suggestion} so editors/agents and `catch` blocks can act on it programmatically.
*
* @example
* try {
*   new Logger({ strictConfig: true, minLevel: "LOUD" as never });
* } catch (e) {
*   if (e instanceof TslogConfigError) console.error(e.code, e.setting, e.suggestion);
* }
*/
var TslogConfigError = class TslogConfigError extends Error {
	/** Stable machine-readable error code (e.g. `"UNKNOWN_MIN_LEVEL"`). */
	code;
	/** The dotted settings path that triggered the error (e.g. `"minLevel"` or `"pretty.template"`). */
	setting;
	/** A short, actionable hint describing how to fix the configuration. */
	suggestion;
	constructor(args) {
		super(`tslog: ${args.message}`);
		this.name = "TslogConfigError";
		this.code = args.code;
		this.setting = args.setting;
		this.suggestion = args.suggestion;
		Object.setPrototypeOf(this, TslogConfigError.prototype);
	}
};
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/core/levelPersistence.js
/**
* Opt-in browser log-level persistence (M4.6).
*
* Reads/writes a logger's `minLevel` from `localStorage` so verbosity can be flipped live from the devtools
* console and survive a page reload. Everything here is:
*  - GUARDED: every `localStorage` access is wrapped in `try/catch` (Safari private mode and disabled storage
*    throw on access), so a hostile environment never crashes logging.
*  - NO-OP off-browser: when there is no usable `localStorage` (Node/Bun/Deno/workers), reads return
*    `undefined` and writes do nothing — keeping Node behavior byte-for-byte unchanged.
*  - SIDE-EFFECT FREE at import time: nothing runs until a function is called, so `sideEffects: false` holds.
*/
/** Default `localStorage` key used to persist the active log level. */
const DEFAULT_PERSIST_LEVEL_KEY = "tslog:level";
/**
* Resolve a usable `localStorage` object, or `undefined` when none is available (off-browser) or access throws
* (private mode / blocked storage). Never throws.
*/
function getLocalStorage() {
	try {
		const storage = globalThis.localStorage;
		return storage != null && typeof storage.getItem === "function" ? storage : void 0;
	} catch {
		return;
	}
}
/**
* Read the persisted level token (a numeric id like `"2"` or a name like `"WARN"`) from `localStorage`, or
* `undefined` when persistence is unavailable / the key is unset. Caller resolves the token to a numeric id.
*/
function readPersistedLevel(key = DEFAULT_PERSIST_LEVEL_KEY) {
	const storage = getLocalStorage();
	if (storage == null) return;
	try {
		const value = storage.getItem(key);
		return value == null || value === "" ? void 0 : value;
	} catch {
		return;
	}
}
/**
* Persist the given numeric level id to `localStorage`. NO-OP (and never throws) when persistence is
* unavailable. Stored as the numeric id so it round-trips deterministically regardless of custom-level names.
*/
function writePersistedLevel(levelId, key = DEFAULT_PERSIST_LEVEL_KEY) {
	const storage = getLocalStorage();
	if (storage == null) return;
	try {
		storage.setItem(key, String(levelId));
	} catch {}
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/core/levels.js
/**
* Canonical default level table: id -> name. The seven names are stable across v5; additive custom
* levels (M2.14) extend this map per-logger rather than mutating it.
*/
const DEFAULT_LOG_LEVEL_NAMES = Object.freeze({
	0: "SILLY",
	1: "TRACE",
	2: "DEBUG",
	3: "INFO",
	4: "WARN",
	5: "ERROR",
	6: "FATAL"
});
/** Reverse lookup name -> id, used to resolve a string `minLevel` like "WARN". */
const NAME_TO_ID = Object.freeze(Object.fromEntries(Object.entries(DEFAULT_LOG_LEVEL_NAMES).map(([id, name]) => [name, Number(id)])));
/**
* Resolve a {@link TLogLevel} (number, {@link LogLevel} enum, or a level name like "WARN")
* to its numeric id. Returns `undefined` for unknown names so the caller can apply its own default.
*
* @param customLevels - optional additive name→id map (M2.14) consulted, case-insensitively, before the
*   default table so a string `minLevel` referring to a custom level resolves correctly.
*/
function resolveLogLevelId(level, customLevels) {
	if (level == null) return;
	if (typeof level === "number") return level;
	if (customLevels != null) {
		const fromCustom = customLevels[level] ?? customLevels[level.toUpperCase()];
		if (typeof fromCustom === "number") return fromCustom;
		const lowered = level.toLowerCase();
		for (const key of Object.keys(customLevels)) if (key.toLowerCase() === lowered && typeof customLevels[key] === "number") return customLevels[key];
	}
	return NAME_TO_ID[level] ?? NAME_TO_ID[level.toUpperCase()];
}
/**
* Validate an additive custom level (M2.14): the name must be a non-empty string that does not collide
* (case-insensitively) with one of the canonical seven, and the id must be a finite number (fractional ids
* such as `3.5` are allowed so a level can slot between two defaults). Throws a `RangeError`/`TypeError` on
* violation so misconfiguration fails fast at `addLevel`/normalize time.
*/
/**
* Lower-cased logger members a custom level method could otherwise clobber. Mixed-case members
* (`getSubLogger`, `attachTransport`, …) cannot collide because installed method names are always
* lower-cased; this list covers the members that ARE all-lowercase.
*/
const RESERVED_MEMBER_NAMES = /* @__PURE__ */ new Set([
	"log",
	"child",
	"settings",
	"runtime",
	"flush",
	"use"
]);
function validateCustomLevel(name, id, existing) {
	if (typeof name !== "string" || name.length === 0) throw new TypeError(`tslog: custom level name must be a non-empty string (got ${JSON.stringify(name)}).`);
	if (typeof id !== "number" || !Number.isFinite(id)) throw new TypeError(`tslog: custom level id for "${name}" must be a finite number (got ${JSON.stringify(id)}).`);
	if (NAME_TO_ID[name.toUpperCase()] != null) throw new RangeError(`tslog: custom level "${name}" collides with a canonical level name; the seven default names are reserved.`);
	const lowered = name.toLowerCase();
	if (RESERVED_MEMBER_NAMES.has(lowered)) throw new RangeError(`tslog: custom level "${name}" collides with the logger member "${lowered}"; pick a different name.`);
	if (existing != null) {
		for (const key of Object.keys(existing)) if (key !== name && key.toLowerCase() === lowered) throw new RangeError(`tslog: custom level "${name}" differs only by case from the already-registered "${key}"; level names are case-insensitive.`);
	}
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/env/stackTrace.js
/**
* Frames that originate from tslog's own code (or its bundled copies under node_modules/deps)
* are skipped during caller detection so the reported log position lands on user code.
*
* M1.12: do NOT match tslog's own frames by a directory *name* like `tslog/src/` — that misclassifies
* a user's own code as internal whenever their project happens to live under a directory named `tslog`
* (e.g. `/home/me/tslog/src/app.ts`). Instead we anchor on tslog's *actual* installed location, derived
* from this module's own URL at runtime ({@link OWN_DIR_MARKER}), plus the published bundle layout and the
* node_modules/deps copies. A user project under a `tslog` directory does not share tslog's real module
* directory, so its frames are correctly treated as external.
*/
/** tslog's own directory, derived from this module's URL — used to recognize internal frames by location, not by name. */
const OWN_DIR_MARKER = (() => {
	try {
		const url = import.meta.url;
		/* v8 ignore next 3 -- unreachable under the Node ESM runner where coverage runs; live in the browser IIFE, where esbuild lowers import.meta to {} */
		if (typeof url !== "string" || url.length === 0) return;
		const path = url.replace(/^file:\/\//, "").replace(/[\\/]env[\\/]stackTrace\.[a-z]+(?:\?.*)?$/i, "");
		/* v8 ignore next -- unreachable under the Node ESM runner (our URL ends with env/stackTrace.<ext>); live in user bundles whose URL keeps path === url */
		return path === url ? void 0 : path;
	} catch {
		/* v8 ignore next -- defensive: reading import.meta.url and the string replaces cannot throw in a real runtime */
		return;
	}
})();
const DEFAULT_IGNORE_PATTERNS = [
	/(?:^|[\\/])node_modules[\\/].*tslog/i,
	/node_modules_tslog/i,
	/(?:^|[\\/])deps[\\/].*tslog/i,
	/(?:^|[\\/])tslog[\\/]dist[\\/](?:esm|cjs)[\\/]/i,
	...OWN_DIR_MARKER != null ? [new RegExp(`^(?:file://)?${OWN_DIR_MARKER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\\\/]`, "i")] : [],
	/\[root[ -]of[ -]the[ -]/i,
	/\[turbopack\]/i
];
/**
* Split an error stack into individual lines while guaranteeing an array result. The `stack` read is
* guarded: a hostile getter (e.g. own properties copied from a user-supplied `cause` object) must
* never crash the logging pipeline — it yields an empty stack instead.
*/
function splitStackLines(error) {
	let stack;
	try {
		const value = error?.stack;
		stack = typeof value === "string" ? value : void 0;
	} catch {
		return [];
	}
	if (stack == null || stack.length === 0) return [];
	return stack.split("\n").map((line) => line.trimEnd());
}
/**
* Remove empty and error header lines which vary between runtimes.
*/
function sanitizeStackLines(lines) {
	return lines.filter((line) => line.length > 0 && !/^\s*Error\b/.test(line));
}
/**
* Convert stack trace lines into stack frames using the provided parser.
*/
function toStackFrames(lines, parseLine) {
	const frames = [];
	for (const line of lines) {
		const frame = parseLine(line);
		if (frame != null) frames.push(frame);
	}
	return frames;
}
/**
* Determine the first stack frame that does not match known internal patterns.
*/
function findFirstExternalFrameIndex(frames, ignorePatterns = DEFAULT_IGNORE_PATTERNS) {
	for (let index = 0; index < frames.length; index += 1) {
		const frame = frames[index];
		const filePathCandidate = frame.filePath ?? "";
		const fullPathCandidate = frame.fullFilePath ?? "";
		if (!ignorePatterns.some((pattern) => pattern.test(filePathCandidate) || pattern.test(fullPathCandidate))) return index;
	}
	return 0;
}
/**
* Utility that splits and sanitizes stack lines in a single call.
*/
function getCleanStackLines(error) {
	return sanitizeStackLines(splitStackLines(error));
}
/**
* Build a normalized stack trace for the provided error using the parser.
*/
function buildStackTrace(error, parseLine) {
	return toStackFrames(getCleanStackLines(error), parseLine);
}
/**
* Clamp an index into the valid range `[0, maxExclusive)`.
*/
function clampIndex(index, maxExclusive) {
	if (index < 0) return 0;
	if (index >= maxExclusive) return Math.max(0, maxExclusive - 1);
	return index;
}
/**
* Return a fresh copy of the default ignore patterns so callers can extend them without mutating the shared list.
*/
function getDefaultIgnorePatterns() {
	return [...DEFAULT_IGNORE_PATTERNS];
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/internal/errorUtils.js
const DEFAULT_CAUSE_DEPTH = 5;
function collectErrorCauses(error, options = {}) {
	const maxDepth = options.maxDepth ?? DEFAULT_CAUSE_DEPTH;
	const causes = [];
	const visited = /* @__PURE__ */ new Set();
	let current = error;
	let depth = 0;
	while (current != null && depth < maxDepth) {
		const cause = safeGetCause(current);
		if (cause == null || visited.has(cause)) break;
		visited.add(cause);
		causes.push(toError(cause));
		current = cause;
		depth += 1;
	}
	return causes;
}
/**
* Read a value's `cause` property without EVER throwing: `cause` is user-controlled and may be a
* hostile getter/Proxy trap. Returns `undefined` on any failure so the pipeline degrades to
* "no cause" instead of crashing the caller's `logger.error(...)`.
*/
function safeGetCause(value) {
	try {
		return value?.cause;
	} catch {
		return;
	}
}
/**
* Read a string-valued own/inherited property (`name`/`message`) off an Error without throwing —
* hostile getters may have been copied onto it from a user-supplied cause object. Non-string values
* and throwing reads yield `fallback`.
*/
function safeErrorString(error, key, fallback) {
	try {
		const value = error[key];
		return typeof value === "string" ? value : fallback;
	} catch {
		return fallback;
	}
}
function toError(value) {
	if (value instanceof Error) return value;
	const error = new Error(typeof value === "string" ? value : stringifyCause(value));
	if (typeof value === "object" && value != null) copyOwnProperties(value, error);
	return error;
}
/**
* Stringify a non-Error `cause` value into an Error message without EVER throwing: a bare
* `JSON.stringify` throws on circular references and BigInts, which would propagate out of
* `logger.error(...)` into the application. Circular refs become `"[Circular]"`, BigInts are
* stringified, and any remaining failure falls back to `String(value)`.
*/
function stringifyCause(value) {
	try {
		const ancestors = [];
		return JSON.stringify(value, function(_key, val) {
			if (typeof val === "bigint") return String(val);
			if (val !== null && typeof val === "object") {
				while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) ancestors.pop();
				if (ancestors.includes(val)) return "[Circular]";
				ancestors.push(val);
			}
			return val;
		}) ?? String(value);
	} catch {
		try {
			return String(value);
		} catch {
			return "[unserializable cause]";
		}
	}
}
/**
* Copy `value`'s own enumerable properties onto the normalized error, tolerating hostile inputs:
* a throwing getter/Proxy trap skips that property, and `__proto__` is ignored so a poisoned cause
* object cannot swap the error's prototype (a plain `Object.assign` would trigger the setter).
*/
function copyOwnProperties(value, target) {
	let keys;
	try {
		keys = Object.keys(value);
	} catch {
		return;
	}
	for (const key of keys) {
		if (key === "__proto__") continue;
		try {
			target[key] = value[key];
		} catch {}
	}
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/core/logObj.js
/** True for any non-null object or array. */
function isObjectOrArray(value) {
	return typeof value === "object" && value !== null;
}
/** True for plain (non-array) non-null objects. */
function isObject(value) {
	return typeof value === "object" && !Array.isArray(value) && value !== null;
}
/** Returns a one-level copy of an array or object, preserving its container kind. */
function shallowCopy(source) {
	if (Array.isArray(source)) return [...source];
	else return { ...source };
}
/**
* Deeply clones a value while executing any zero-purpose field that is a function (e.g. a `requestId`
* generator on the default LogObj), so every log gets a freshly evaluated value. Arrays and Dates are
* cloned; objects are rebuilt with the source's prototype and per-property enumerability as plain writable
* data properties (frozen sources stay loggable, accessors are read once); primitives pass through.
* Circular references are short-circuited with a shallow copy via a `seen` list.
*/
function recursiveCloneAndExecuteFunctions(source, seen = []) {
	if (isObjectOrArray(source) && seen.includes(source)) return shallowCopy(source);
	if (isObjectOrArray(source)) seen.push(source);
	if (Array.isArray(source)) return source.map((item) => recursiveCloneAndExecuteFunctions(item, seen));
	else if (source instanceof Date) return new Date(source.getTime());
	else if (isObject(source)) return Object.getOwnPropertyNames(source).reduce((o, prop) => {
		const descriptor = Object.getOwnPropertyDescriptor(source, prop);
		/* v8 ignore else -- typing-only: getOwnPropertyDescriptor is typed `| undefined`, but for a key getOwnPropertyNames just reported on the same object it is only undefined when a Proxy ownKeys trap invents a ghost key — no supported default LogObj shape does that */
		if (descriptor) {
			const value = source[prop];
			const cloned = typeof value === "function" ? value() : recursiveCloneAndExecuteFunctions(value, seen);
			Object.defineProperty(o, prop, {
				value: cloned,
				writable: true,
				enumerable: descriptor.enumerable,
				configurable: true
			});
		}
		return o;
	}, Object.create(Object.getPrototypeOf(source)));
	else return source;
}
/**
* Converts a native error into a serializable {@link IErrorObject}, following the `error.cause` chain
* up to `deps.maxErrorCauseDepth` levels. Non-Error causes are normalized via {@link toError}, and a
* `seen` set prevents infinite loops on self-referential cause chains.
*/
function toErrorObject(error, deps, depth = 0, seen = /* @__PURE__ */ new Set()) {
	seen.add(error);
	const errorObject = {
		nativeError: error,
		name: safeErrorString(error, "name", "Error"),
		message: safeErrorString(error, "message", ""),
		stack: deps.getErrorTrace(error)
	};
	if (depth >= deps.maxErrorCauseDepth) return errorObject;
	const causeValue = safeGetCause(error);
	if (causeValue != null) {
		const normalizedCause = toError(causeValue);
		if (!seen.has(normalizedCause)) errorObject.cause = toErrorObject(normalizedCause, deps, depth + 1, seen);
	}
	return errorObject;
}
/**
* Symbol-keyed marker set on a record whose CALL SHAPE was exactly one of the two field-spreading
* forms: pino object-first (`log.info({fields}, "msg")`) or message-first (`log.info("msg", {fields})`),
* with a genuinely PLAIN object. The JSON renderer spreads the object's fields at the top level only
* when this hint is present — shape-sniffing the record alone cannot distinguish those calls from a
* single logged object that happens to have numeric keys (`log.info({0: "a", 1: {…}})`).
*/
const SPREAD_SHAPE_HINT = Symbol("tslog.logObj.spreadShape");
/**
* Symbol-keyed carrier for bound fields on a record whose root IS a lone serialized Error
* (`log.error(err)` spreads the IErrorObject as the record itself). Merging bindings into that root
* would bury them inside the rendered error payload; the JSON renderer reads this hint instead and
* emits the bound fields at the top level, exactly where they land for every other call shape.
*/
const BOUND_FIELDS_HINT = Symbol("tslog.logObj.boundFields");
/** Read the bound-fields hint off a record, when the lone-Error shape had to carry bindings aside. */
function getBoundFieldsHint(record) {
	return record[BOUND_FIELDS_HINT];
}
/** Read the spread-shape hint off a record, if the call shape set one. */
function getSpreadShapeHint(record) {
	return record[SPREAD_SHAPE_HINT];
}
/** True for a plain object literal (prototype is `Object.prototype` or `null`) — the only spreadable shape. */
function isPlainSpreadObject(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
	const proto = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null;
}
/**
* Builds the final log object from the (already masked) call arguments.
*
* - Every Error argument is replaced by its serializable {@link IErrorObject} form.
* - When `argumentsArrayName` is set, all args are stored under that single key.
* - Otherwise, a lone object/array/primitive argument is merged into the cloned default LogObj
*   (objects spread directly; a non-mergeable single value is keyed under `"0"`), while multiple
*   args are spread index-keyed (`0`, `1`, …). The cloned default LogObj always wins on key
*   collisions, matching the monolith's `{ ...args[0], ...clonedLogObj }` ordering.
* - A two-argument call pairing a string message with a single PLAIN object (either order) tags the
*   record with {@link SPREAD_SHAPE_HINT} so the JSON renderer can spread the object's fields at the
*   top level; Buffers, Maps, Sets, class instances and arrays keep their positional bucket so their
*   own serialization semantics (`toJSON`, inspect) stay intact.
* - `bindings` (static bound fields, already masked at logger construction) are spread FIRST, so
*   per-call fields and the default LogObj always win on a key collision.
*/
function toLogObj(args, argumentsArrayName, deps, clonedLogObj = {}, bindings) {
	const loneError = args.length === 1 && deps.isError(args[0]);
	let spreadShape;
	if (argumentsArrayName == null && args.length === 2 && !deps.isError(args[0]) && !deps.isError(args[1])) {
		if (typeof args[0] === "string" && isPlainSpreadObject(args[1]) && deps.isBuffer(args[1]) !== true) spreadShape = "message-first";
		else if (isPlainSpreadObject(args[0]) && deps.isBuffer(args[0]) !== true && typeof args[1] === "string") spreadShape = "object-first";
	}
	args = args?.map((arg) => deps.isError(arg) ? toErrorObject(arg, deps) : arg);
	let effectiveBindings = bindings;
	if (spreadShape !== void 0 && bindings != null) {
		const spreadSource = spreadShape === "message-first" ? args[1] : args[0];
		for (const key of Object.keys(bindings)) if (Object.hasOwn(spreadSource, key)) {
			if (effectiveBindings === bindings) effectiveBindings = { ...bindings };
			delete effectiveBindings[key];
		}
	}
	if (argumentsArrayName == null) {
		if (args.length === 1 && !Array.isArray(args[0]) && deps.isBuffer(args[0]) !== true && !(args[0] instanceof Date)) {
			if (loneError && effectiveBindings != null) {
				clonedLogObj = {
					...args[0],
					...clonedLogObj
				};
				clonedLogObj[BOUND_FIELDS_HINT] = effectiveBindings;
			} else clonedLogObj = typeof args[0] === "object" && args[0] != null ? {
				...effectiveBindings,
				...args[0],
				...clonedLogObj
			} : {
				...effectiveBindings,
				0: args[0],
				...clonedLogObj
			};
		} else clonedLogObj = {
			...effectiveBindings,
			...clonedLogObj,
			...args
		};
	} else clonedLogObj = {
		...effectiveBindings,
		...clonedLogObj,
		[argumentsArrayName]: args
	};
	if (spreadShape !== void 0) clonedLogObj[SPREAD_SHAPE_HINT] = spreadShape;
	return clonedLogObj;
}
/** Internal marker key used by errors carried inside an {@link IErrorObject}; never emitted verbatim. */
const ERROR_NATIVE_KEY = "nativeError";
/** Left-pad a 0..99 integer to two digits ("7" → "07"); used by {@link toIsoString}. */
function pad2(n) {
	return n < 10 ? `0${n}` : `${n}`;
}
/**
* Format a `Date` as an ISO-8601 UTC string, byte-identical to `Date#toISOString()` but ~3-4x faster
* for the four-digit-year dates every real log carries.
*
* `toISOString` goes through a comparatively slow V8 path; on the JSON hot path (one timestamp per log, used
* for both the top-level `time` key and `_logMeta.date`) that single call was the largest remaining cost. This
* assembles the same `YYYY-MM-DDTHH:mm:ss.sssZ` string from the date's UTC components directly. Years
* outside 1000-9999 are NOT byte-identical under this template (`toISOString` zero-pads below 1000 and
* uses the expanded `±YYYYYY` form outside 0-9999), so those — plus an Invalid Date, which a user
* `clock`/middleware can produce and on which `toISOString` throws — take the guard branch instead.
*/
function toIsoString(date) {
	const year = date.getUTCFullYear();
	if (!(year >= 1e3 && year <= 9999)) return Number.isNaN(year) ? "Invalid Date" : date.toISOString();
	const ms = date.getUTCMilliseconds();
	const msStr = ms < 10 ? `00${ms}` : ms < 100 ? `0${ms}` : `${ms}`;
	return `${year}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}T${pad2(date.getUTCHours())}:${pad2(date.getUTCMinutes())}:${pad2(date.getUTCSeconds())}.${msStr}Z`;
}
/**
* Shared core for {@link toFlatJsonObject} and {@link renderJson}: build the flat object and, in stable mode,
* report whether anything awkward was seen so the caller can pick the fast vs. safe serializer. In non-stable
* mode (opt-in, not the hot path) we skip the inline scan (`scanned: false`) and let the caller fall back to
* {@link containsAwkwardValue} on the finished object.
*/
function buildFlat(record, settings) {
	const metaProperty = settings.meta.property;
	const json = settings.json;
	const meta = record[metaProperty];
	const stable = json.stableKeyOrder;
	const recordObj = record;
	const recordKeys = Object.keys(recordObj);
	const awk = { hit: false };
	const dateIso = meta?.date instanceof Date ? toIsoString(meta.date) : void 0;
	const recordIsSpreadError = recordObj[ERROR_NATIVE_KEY] instanceof Error && typeof recordObj.name === "string" && Array.isArray(recordObj.stack);
	const hasMessageKey = !recordIsSpreadError && Object.hasOwn(recordObj, json.messageKey);
	const hasZeroKey = !recordIsSpreadError && Object.hasOwn(recordObj, "0");
	let sawEmbeddedError = false;
	let pinoLeading = false;
	let messageFirst = false;
	if (!recordIsSpreadError) {
		const spreadShape = hasMessageKey ? void 0 : getSpreadShapeHint(recordObj);
		pinoLeading = spreadShape === "object-first" && typeof recordObj["0"] === "object" && recordObj["0"] !== null && !isErrorObject(recordObj["0"]);
		messageFirst = spreadShape === "message-first" && typeof recordObj["1"] === "object" && recordObj["1"] !== null && !isErrorObject(recordObj["1"]);
		if (!pinoLeading && !messageFirst) for (let i = 0; i < recordKeys.length; i++) {
			const key = recordKeys[i];
			if (key === metaProperty || key === json.messageKey || key === "0") continue;
			if (isErrorObject(recordObj[key])) {
				sawEmbeddedError = true;
				break;
			}
		}
	}
	if (!recordIsSpreadError && !sawEmbeddedError && !pinoLeading && !messageFirst) {
		const messageSourceKey = hasMessageKey ? json.messageKey : hasZeroKey ? "0" : void 0;
		const flat = {};
		if (messageSourceKey !== void 0) {
			const message = recordObj[messageSourceKey];
			flat[json.messageKey] = stable ? deepSortKeys(message, awk) : message;
		}
		writeHead(flat, meta, json, dateIso);
		let fieldKeys;
		for (let i = 0; i < recordKeys.length; i++) {
			const key = recordKeys[i];
			if (key === metaProperty || key === messageSourceKey || key === "__proto__" || isReservedHeadKey(key, json)) continue;
			if (fieldKeys === void 0) fieldKeys = [];
			fieldKeys.push(key);
		}
		if (fieldKeys !== void 0) {
			if (stable) {
				fieldKeys.sort();
				for (let i = 0; i < fieldKeys.length; i++) flat[fieldKeys[i]] = deepSortKeys(recordObj[fieldKeys[i]], awk);
			} else for (let i = 0; i < fieldKeys.length; i++) flat[fieldKeys[i]] = recordObj[fieldKeys[i]];
		}
		writeMeta(flat, meta, metaProperty, stable, dateIso, awk);
		return {
			flat,
			awkward: awk.hit,
			scanned: stable
		};
	}
	const userFields = {};
	const errors = [];
	if (!recordIsSpreadError) for (let i = 0; i < recordKeys.length; i++) {
		const key = recordKeys[i];
		if (key === metaProperty) continue;
		const value = recordObj[key];
		if (isErrorObject(value)) errors.push(value);
		else userFields[key] = value;
	}
	else {
		errors.push(stripMeta(record, metaProperty));
		const boundFields = getBoundFieldsHint(recordObj);
		if (boundFields != null) for (const key of Object.keys(boundFields)) {
			if (key === "__proto__" || key === metaProperty || Object.hasOwn(userFields, key)) continue;
			userFields[key] = boundFields[key];
		}
	}
	if (pinoLeading) {
		const leadingObject = userFields["0"];
		delete userFields["0"];
		const promotedMessage = userFields["1"];
		delete userFields["1"];
		for (const [k, v] of Object.entries(leadingObject)) if (k !== "__proto__" && k !== metaProperty && !Object.hasOwn(userFields, k)) userFields[k] = v;
		userFields[json.messageKey] = promotedMessage;
	}
	if (messageFirst) {
		const promotedMessage = userFields["0"];
		delete userFields["0"];
		const trailingObject = userFields["1"];
		delete userFields["1"];
		for (const [k, v] of Object.entries(trailingObject)) if (k !== "__proto__" && k !== metaProperty && !Object.hasOwn(userFields, k)) userFields[k] = v;
		userFields[json.messageKey] = promotedMessage;
	}
	let hasMessage = false;
	let message;
	if (Object.hasOwn(userFields, json.messageKey)) {
		hasMessage = true;
		message = userFields[json.messageKey];
		delete userFields[json.messageKey];
	} else if (Object.hasOwn(userFields, "0")) {
		hasMessage = true;
		message = userFields["0"];
		delete userFields["0"];
	}
	const flat = {};
	if (hasMessage) flat[json.messageKey] = message;
	writeHead(flat, meta, json, dateIso);
	const fieldKeys = stable ? Object.keys(userFields).sort() : Object.keys(userFields);
	for (const key of fieldKeys) {
		if (key === "__proto__" || isReservedHeadKey(key, json)) continue;
		flat[key] = stable ? deepSortKeys(userFields[key]) : userFields[key];
	}
	if (errors.length > 0) {
		const serializedErrors = stable ? errors.map((error) => deepSortKeys(error)) : errors;
		flat[json.errorKey] = serializedErrors.length === 1 ? serializedErrors[0] : serializedErrors;
	}
	writeMeta(flat, meta, metaProperty, stable, dateIso);
	return {
		flat,
		awkward: true,
		scanned: false
	};
}
/**
* Whether `key` is one of the reserved head keys written by {@link writeHead}. User fields with these
* names are dropped from the flat line (one uniform policy: canonical head values always win; the raw
* record still carries the field for transports). `levelIdKey` is only reserved while `numericLevel`
* actually emits it.
*/
function isReservedHeadKey(key, json) {
	return key === json.levelKey || json.time !== false && key === json.timeKey || json.numericLevel && key === json.levelIdKey;
}
/**
* Write the head-first level/levelId/time keys onto `flat` from `meta` (shared by both paths). `dateIso` is
* the pre-computed `meta.date.toISOString()` (computed once per log and reused for `_logMeta.date`), so we never
* call the relatively expensive `toISOString` twice for the same timestamp. The top-level time honors
* `json.time` ("iso" | "epoch" | false | fn); `_logMeta.date` always stays the ISO string.
*/
function writeHead(flat, meta, json, dateIso) {
	if (meta == null) return;
	flat[json.levelKey] = meta.logLevelName;
	if (json.numericLevel) flat[json.levelIdKey] = meta.logLevelId;
	const time = json.time;
	if (time === false) return;
	if (time === "iso" || dateIso === void 0) {
		flat[json.timeKey] = dateIso !== void 0 ? dateIso : meta.date;
		return;
	}
	if (time === "epoch") {
		flat[json.timeKey] = meta.date.getTime();
		return;
	}
	try {
		const value = time(meta.date);
		flat[json.timeKey] = typeof value === "string" || typeof value === "number" ? value : dateIso;
	} catch {
		flat[json.timeKey] = dateIso;
	}
}
/**
* Re-nest the runtime meta under `metaProperty` with the schema version first, building the `_logMeta` body in
* a single pass (no intermediate plain-object copy). In stable mode the non-`v` keys are emitted in sorted
* order; `v` stays first regardless. Resolving each value reads through the lazy `path` getter only if
* `path` is an own key — capture-off records never have it, so it is never forced.
*/
function writeMeta(flat, meta, metaProperty, stable, dateIso, awk) {
	if (meta == null) return;
	const metaObj = meta;
	const body = { v: 5 };
	const keys = stable ? Object.keys(metaObj).sort() : Object.keys(metaObj);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		if (key === "date" && dateIso !== void 0) {
			body.date = dateIso;
			continue;
		}
		body[key] = stable ? deepSortKeys(metaObj[key], awk) : metaObj[key];
	}
	flat[metaProperty] = body;
}
/**
* Render a finished log `record` to a single JSON line (M2.2): `toFlatJsonObject` followed by a
* circular-/bigint-safe stringify that honors `json.stableKeyOrder`.
*
* @param record - the finished log object (user fields + the `_logMeta` block).
* @param settings - the live, resolved settings.
* @returns the JSON string a transport writes (no trailing newline).
*
* @example
* const line = renderJson(record, logger.settings);
* // '{"message":"hi","level":"INFO","levelId":3,"time":"…","_logMeta":{"v":5,…}}'
*/
function renderJson(record, settings) {
	if (!settings.json.stableKeyOrder && settings.json.time === "iso") {
		const fastLine = renderPlannedLine(record, settings);
		if (fastLine !== void 0) return fastLine;
	}
	return renderJsonUnplanned(record, settings);
}
/**
* The plan-free JSON rendering path: identical output to {@link renderJson}, without the precompiled
* line-plan machinery. This is the renderer size-sensitive entries (`tslog/slim`) inject — importing it
* lets a bundler tree-shake the whole plan compiler — and the fallback {@link renderJson} itself uses
* for shapes the plan does not cover. Byte-identity between the two paths is pinned by the differential
* suite (tests/56).
*/
function renderJsonUnplanned(record, settings) {
	const { flat, awkward, scanned } = buildFlat(record, settings);
	if (scanned) return awkward ? jsonStringifySafe(flat) : JSON.stringify(flat);
	return jsonStringifyValue(flat);
}
/** Plans per resolved-settings object; `false` marks a logger whose meta shape can never be planned. */
const linePlanCache = /* @__PURE__ */ new WeakMap();
/** Meta keys that are static per logger instance and JSON-serializable once at plan-build time. */
const STATIC_META_KEYS = /* @__PURE__ */ new Set([
	"runtime",
	"runtimeVersion",
	"hostname",
	"browser",
	"name",
	"parentNames"
]);
/** Array-index-like keys are hoisted first by JS object enumeration — the plan bails on them. */
const INTEGER_KEY = /^(?:0|[1-9]\d*)$/;
/** Cheap integer-like-key test: one charCode compare for the common non-digit-leading key. */
function isIntegerLikeKey(key) {
	const first = key.charCodeAt(0);
	if (first < 48 || first > 57) return false;
	return INTEGER_KEY.test(key);
}
/** Whether a static meta value can be serialized once at plan-build time (JSON-stable primitives). */
function isPlanStaticValue(value) {
	const type = typeof value;
	if (type === "string" || type === "number" || type === "boolean" || value === null) return true;
	return Array.isArray(value) && value.every((item) => typeof item === "string");
}
/** Build a plan from an eligible record's meta, or return `null`/`false` (false = never plannable). */
function buildLinePlan(meta, settings) {
	const json = settings.json;
	/* v8 ignore next 3 -- unreachable defensive guard: buildLinePlan's sole caller (renderPlannedLine) is only reached from renderJson when json.time === "iso"; buildLinePlan is not exported, so no test path can enter with a non-"iso" mode */
	if (json.time !== "iso") return false;
	const headKeys = [
		json.messageKey,
		json.levelKey,
		json.timeKey,
		settings.meta.property
	];
	if (json.numericLevel) headKeys.push(json.levelIdKey);
	if (new Set(headKeys).size !== headKeys.length) return false;
	const staticEntries = [];
	const metaSegments = [];
	let literal = `,${JSON.stringify(settings.meta.property)}:{"v":5`;
	let sawDate = 0;
	let sawLevelId = 0;
	let sawLevelName = 0;
	let keyCount = 0;
	for (const key of Object.keys(meta)) {
		keyCount++;
		if (key === "date") {
			literal += `,"date":"`;
			metaSegments.push(literal, { dyn: "date" });
			literal = `"`;
			sawDate++;
			continue;
		}
		if (key === "logLevelId") {
			literal += `,"logLevelId":`;
			metaSegments.push(literal, { dyn: "levelId" });
			literal = "";
			sawLevelId++;
			continue;
		}
		if (key === "logLevelName") {
			literal += `,"logLevelName":`;
			metaSegments.push(literal, { dyn: "levelName" });
			literal = "";
			sawLevelName++;
			continue;
		}
		if (!STATIC_META_KEYS.has(key)) return key === "path" ? false : null;
		const value = meta[key];
		if (!isPlanStaticValue(value)) return false;
		staticEntries.push({
			key,
			value
		});
		literal += `,${JSON.stringify(key)}:${JSON.stringify(value)}`;
	}
	if (sawDate !== 1 || sawLevelId !== 1 || sawLevelName !== 1) return false;
	metaSegments.push(`${literal}}`);
	return {
		messageKey: json.messageKey,
		levelKey: json.levelKey,
		levelIdKey: json.levelIdKey,
		timeKey: json.timeKey,
		numericLevel: json.numericLevel,
		metaProperty: settings.meta.property,
		messagePrefix: `${JSON.stringify(json.messageKey)}:`,
		staticEntries,
		metaKeyCount: keyCount,
		metaSegments,
		levelChunks: /* @__PURE__ */ new Map()
	};
}
/** Whether the cached plan still matches the live settings (key renames rebuild the plan). */
function planMatchesSettings(plan, settings) {
	const json = settings.json;
	return plan.messageKey === json.messageKey && plan.levelKey === json.levelKey && plan.levelIdKey === json.levelIdKey && plan.timeKey === json.timeKey && json.time === "iso" && plan.numericLevel === json.numericLevel && plan.metaProperty === settings.meta.property;
}
/** Serialize one user field value; `undefined` means "skip this key" (functions/symbols, like native stringify). */
function stringifyFieldValue(value) {
	if (value === void 0) return "\"[undefined]\"";
	return jsonStringifyValue(value);
}
/**
* Render the flat line directly from the precompiled plan. Returns `undefined` for any record shape
* the plan does not cover (embedded/spread errors, integer-like field keys, extra meta keys,
* missing/invalid meta) — the caller then takes the object-building path, which handles everything.
*/
function renderPlannedLine(record, settings) {
	const metaProperty = settings.meta.property;
	const meta = record[metaProperty];
	if (meta == null || !(meta.date instanceof Date)) return;
	let plan = linePlanCache.get(settings);
	if (plan === false) return;
	if (plan === void 0 || !planMatchesSettings(plan, settings)) {
		const built = buildLinePlan(meta, settings);
		if (built === null) return;
		linePlanCache.set(settings, built);
		if (built === false) return;
		plan = built;
	}
	let metaKeyCount = 0;
	for (const _key in meta) metaKeyCount++;
	if (metaKeyCount !== plan.metaKeyCount) return;
	for (let i = 0; i < plan.staticEntries.length; i++) {
		const entry = plan.staticEntries[i];
		if (meta[entry.key] !== entry.value) return;
	}
	const recordObj = record;
	if (recordObj[ERROR_NATIVE_KEY] instanceof Error) return;
	const json = settings.json;
	const hasMessageKey = Object.hasOwn(recordObj, json.messageKey);
	let messageSourceKey = hasMessageKey ? json.messageKey : Object.hasOwn(recordObj, "0") ? "0" : void 0;
	let messageValue = messageSourceKey !== void 0 ? recordObj[messageSourceKey] : void 0;
	let spreadSource;
	const spreadShape = hasMessageKey ? void 0 : getSpreadShapeHint(recordObj);
	if (spreadShape !== void 0) {
		const fieldsKey = spreadShape === "object-first" ? "0" : "1";
		const fields = recordObj[fieldsKey];
		/* v8 ignore else -- unreachable: toLogObj sets the hint only when that slot held a plain object, in the same pass that stores it there, and nothing between toLogObj and rendering rewrites positional values (middleware and masking run on the args BEFORE toLogObj); the typeof guard only protects the cast on a hand-built record */
		if (typeof fields === "object" && fields !== null) {
			messageValue = recordObj[fieldsKey === "0" ? "1" : "0"];
			spreadSource = fields;
		}
	}
	const spreading = spreadSource !== void 0;
	if (spreading) messageSourceKey = json.messageKey;
	const levelId = meta.logLevelId;
	const levelName = meta.logLevelName;
	const chunkKey = `${levelId}|${levelName}`;
	let chunk = plan.levelChunks.get(chunkKey);
	if (chunk === void 0) {
		const head = `${JSON.stringify(plan.levelKey)}:${JSON.stringify(levelName)}${plan.numericLevel ? `,${JSON.stringify(plan.levelIdKey)}:${JSON.stringify(levelId)}` : ""},${JSON.stringify(plan.timeKey)}:"`;
		let metaBefore = "";
		let metaAfter = "";
		let pastDate = false;
		for (const segment of plan.metaSegments) {
			const piece = typeof segment === "string" ? segment : segment.dyn === "levelId" ? JSON.stringify(levelId) : segment.dyn === "levelName" ? JSON.stringify(levelName) : void 0;
			if (piece === void 0) {
				pastDate = true;
				continue;
			}
			if (pastDate) metaAfter += piece;
			else metaBefore += piece;
		}
		chunk = {
			head,
			metaBefore,
			metaAfter
		};
		plan.levelChunks.set(chunkKey, chunk);
	}
	const iso = toIsoString(meta.date);
	let line = "{";
	if (messageSourceKey !== void 0) {
		const messageJson = stringifyFieldValue(messageValue);
		if (messageJson !== void 0) line += `${plan.messagePrefix}${messageJson},`;
	}
	line += `${chunk.head}${iso}"`;
	const recordKeys = Object.keys(recordObj);
	for (let i = 0; i < recordKeys.length; i++) {
		const key = recordKeys[i];
		if (key === metaProperty || key === messageSourceKey || key === "__proto__" || isReservedHeadKey(key, json)) continue;
		if (spreading && (key === "0" || key === "1")) continue;
		if (isIntegerLikeKey(key)) return;
		const value = recordObj[key];
		if (isErrorObject(value)) return;
		const valueJson = stringifyFieldValue(value);
		if (valueJson === void 0) continue;
		line += `,${JSON.stringify(key)}:${valueJson}`;
	}
	if (spreadSource !== void 0) for (const key of Object.keys(spreadSource)) {
		if (key === json.messageKey || key === "__proto__" || key === metaProperty || isReservedHeadKey(key, json)) continue;
		if (Object.hasOwn(recordObj, key) && key !== "0" && key !== "1") continue;
		if (isIntegerLikeKey(key)) return;
		const valueJson = stringifyFieldValue(spreadSource[key]);
		if (valueJson === void 0) continue;
		line += `,${JSON.stringify(key)}:${valueJson}`;
	}
	return `${line + chunk.metaBefore + iso + chunk.metaAfter}}`;
}
/**
* Circular-safe, `bigint`/`undefined`-aware JSON serializer (extends `internal/jsonStringifyRecursive`).
*
* Key ordering is *not* this function's concern — {@link toFlatJsonObject} already emits the well-known
* keys head-first and (when `json.stableKeyOrder` is on) sorts the user's fields and the `_logMeta` body.
* This function only guarantees JSON-safety of the values:
*
* - Circular references are replaced with `"[Circular]"`.
* - `bigint` is stringified (JSON has no bigint).
* - `undefined` becomes `"[undefined]"` (matches the v4 replacer so explicit `undefined` fields survive).
* - `Error` instances (e.g. an {@link IErrorObject}'s `nativeError`) are stripped to `undefined` so they
*   do not serialize as an empty `{}`; the error's serializable `stack`/`name`/`message` are kept.
*
* @param value - the value to serialize (typically the flat object from {@link toFlatJsonObject}).
* @returns the JSON string.
*
* @example
* jsonStringifyValue({ a: 10n, b: undefined }); // '{"a":"10","b":"[undefined]"}'
*/
function jsonStringifyValue(value) {
	if (!containsAwkwardValue(value)) return JSON.stringify(value);
	return jsonStringifySafe(value);
}
/**
* Cheaply decide whether `value` holds anything native `JSON.stringify` would mishandle for our contract:
* a `bigint` (throws), an explicit `undefined` own-value (silently dropped, but v5 emits `"[undefined]"`),
* a native `Error` (would serialize as `{}`), or a circular reference (throws). Walks own-enumerable keys
* with a `WeakSet` cycle guard and bails out (returns true) the instant it finds one.
*/
function containsAwkwardValue(value, ancestors = /* @__PURE__ */ new WeakSet()) {
	if (typeof value === "bigint" || value === void 0) return true;
	if (value === null || typeof value !== "object") return false;
	if (value instanceof Error) return true;
	if (ancestors.has(value)) return true;
	if (value instanceof Date) return false;
	ancestors.add(value);
	if (Array.isArray(value)) {
		for (let i = 0; i < value.length; i++) if (containsAwkwardValue(value[i], ancestors)) return true;
		ancestors.delete(value);
		return false;
	}
	for (const key of Object.keys(value)) if (containsAwkwardValue(value[key], ancestors)) return true;
	ancestors.delete(value);
	return false;
}
/** The robust serializer: handles bigint, circular refs, undefined, and native Error. Used only as a fallback. */
function jsonStringifySafe(value) {
	const ancestors = [];
	const replacer = function(_key, val) {
		if (typeof val === "bigint") return `${val}`;
		if (typeof val === "undefined") return "[undefined]";
		if (typeof val === "object" && val !== null) {
			if (val instanceof Error) return;
			while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) ancestors.pop();
			if (ancestors.includes(val)) return "[Circular]";
			ancestors.push(val);
		}
		return val;
	};
	return JSON.stringify(value, replacer);
}
/**
* Return a deep, key-sorted copy of a value so a `stableKeyOrder` line is byte-reproducible. Plain
* objects get their keys sorted recursively; arrays keep order but their elements are sorted; everything
* else (primitives, Date, Error, class instances) passes through by reference. A `seen` set short-circuits
* circular structures (replacing them with `"[Circular]"`) so this never recurses forever.
*
* When an {@link AwkFlag} `awk` is supplied, the walk also records — at no extra traversal cost — whether it
* encountered a `bigint`, an explicit `undefined`, or a native `Error`, letting {@link renderJson} skip the
* separate {@link containsAwkwardValue} scan and pick native vs. safe stringify directly.
*/
function deepSortKeys(value, awk, seen = /* @__PURE__ */ new WeakSet()) {
	if (typeof value !== "object" || value === null) {
		if (awk !== void 0 && (typeof value === "bigint" || value === void 0)) awk.hit = true;
		return value;
	}
	if (seen.has(value)) return "[Circular]";
	if (!isPlainObject(value) && !Array.isArray(value)) {
		if (awk !== void 0 && value instanceof Error) awk.hit = true;
		return value;
	}
	seen.add(value);
	if (Array.isArray(value)) {
		const mapped = value.map((item) => deepSortKeys(item, awk, seen));
		seen.delete(value);
		return mapped;
	}
	const sorted = {};
	for (const key of Object.keys(value).sort()) sorted[key] = deepSortKeys(value[key], awk, seen);
	seen.delete(value);
	return sorted;
}
/** True for a plain object literal (not an array, Date, Error, or other class instance). */
function isPlainObject(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
	if (value instanceof Date || value instanceof Error) return false;
	const proto = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null;
}
/**
* Heuristically recognize a serialized {@link IErrorObject} produced by `core/logObj.ts#toErrorObject`
* (it carries a `nativeError` Error plus `name`/`message`/`stack`). Plain user objects never match.
*/
function isErrorObject(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
	const candidate = value;
	return candidate[ERROR_NATIVE_KEY] instanceof Error && typeof candidate.name === "string" && Array.isArray(candidate.stack);
}
/** Return a shallow copy of `record` without its meta property — used to test the record's own shape. */
function stripMeta(record, metaProperty) {
	const out = {};
	for (const key of Object.keys(record)) if (key !== metaProperty) out[key] = record[key];
	return out;
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/core/pipeline.js
/**
* `core/pipeline.ts` — the single formatting + middleware path (M2.6).
*
* v4 carried eight `overwrite.*` hooks and an arity-sniffing `transportFormatted`, branching through a
* tangle of if/else in `BaseLogger.log()`. v5 deletes all of that. The replacement is two small,
* composable pieces that live here:
*
*  1. **Middleware** — `logger.use(mw)` appends a {@link LogMiddleware}. {@link runMiddleware} runs the
*     chain in order; any middleware may enrich/rewrite the {@link LogContext} or drop the log (return
*     `null`/`false`). Returning nothing keeps the passed-in context.
*  2. **Format stages** — tree-shakeable factories ({@link timestamp}, {@link errors}, {@link json},
*     {@link pretty}) that each turn a finished, meta-decorated record into the string a transport
*     writes. The default console output is expressed as a built-in pipeline ({@link defaultFormatter})
*     so the core has ONE formatting path, not the old overwrite branches.
*
* This module performs NO top-level work and imports NO environment at module scope (preserving
* `sideEffects: false`). The pretty stage needs the runtime's inspect/styling, so it is a factory that
* receives the {@link EnvironmentProvider} as an argument; the JSON stage is environment-agnostic and
* delegates to {@link renderJson} in `render/json.ts`.
*
* Because a {@link FormatStage} only receives `(record, settings)`, the pretty stage needs the original
* masked argument array (tslog inspects the ARGS for pretty output, not the reshaped record). The core
* attaches that array to the record under the non-enumerable {@link PIPELINE_MASKED_ARGS} symbol before
* formatting, and the pretty stage reads it back via {@link getMaskedArgs}. The symbol is non-enumerable
* so it never leaks into JSON output or object spreads.
*/
/**
* Non-enumerable symbol under which the core stashes the masked argument array on the record so the
* {@link pretty} stage can recover it. Set it via {@link attachMaskedArgs}; read it via
* {@link getMaskedArgs}. Never enumerable, so JSON serialization and spreads never observe it.
*/
const PIPELINE_MASKED_ARGS = Symbol("tslog.pipeline.maskedArgs");
/**
* Attach the masked argument array to `record` (non-enumerably) so a later {@link pretty} stage can read
* it back with {@link getMaskedArgs}. Returns the same record for convenient chaining.
*
* @example
* const record = attachMaskedArgs(logObjWithMeta, maskedArgs);
* const line = pretty(provider)(record, settings);
*/
function attachMaskedArgs(record, maskedArgs) {
	Object.defineProperty(record, PIPELINE_MASKED_ARGS, {
		value: maskedArgs,
		enumerable: false,
		configurable: true,
		writable: true
	});
	return record;
}
/**
* Read the masked argument array previously attached by {@link attachMaskedArgs}. Falls back to the
* record's own enumerable values when no array was attached (e.g. a transport formats a record it built
* itself), so the pretty stage never throws on a hand-rolled record.
*/
function getMaskedArgs(record, metaProperty) {
	const attached = record[PIPELINE_MASKED_ARGS];
	if (Array.isArray(attached)) return attached;
	const source = record;
	return Object.keys(source).filter((key) => key !== metaProperty).map((key) => source[key]);
}
/**
* Run the middleware chain over `context` in registration order.
*
* Each middleware receives the {@link LogContext} produced by the previous one. A middleware drops the
* log by returning `null`/`false` — {@link runMiddleware} then returns `null` and the caller must skip
* formatting and all transports. Returning the context (or nothing) continues the chain.
*
* @param context - the initial context (built by the core for this `log()` call).
* @param middleware - the resolved middleware chain (`settings.middleware`).
* @returns the final context, or `null` when any middleware dropped the log.
*
* @example
* const ctx = runMiddleware(initialContext, settings.middleware);
* if (ctx == null) return; // dropped
*/
function runMiddleware(context, middleware) {
	let current = context;
	for (const mw of middleware) {
		const result = mw(current);
		if (result === null || result === false) return null;
		if (result !== void 0) current = result;
	}
	return current;
}
/**
* Format stage that renders the record as a pretty, human-readable line, delegating to the injected
* {@link EnvironmentProvider}'s pretty-format path (`prettyFormatLine`). The provider owns inspect,
* meta markup, error rendering, and ANSI handling, so all runtimes share one implementation.
*
* This stage produces the plain-text pretty line used by attached transports and per-transport
* `format: "pretty"`. The line is always rendered WITHOUT ANSI styling, whatever `pretty.style` says:
* `style` follows the console (an interactive TTY), while transports write to files, HTTP endpoints and
* buffers where escape codes are noise. The live console (ANSI, or browser CSS `%c` styling) is still
* driven by the provider's `transportFormatted` from the core.
*
* @param provider - the runtime environment provider (Node, browser, or universal).
* @example
* const line = pretty<MyLog>(this.runtime)(record, settings);
*/
function pretty(provider) {
	return (record, settings) => {
		const meta = record[settings.meta.property];
		const maskedArgs = getMaskedArgs(record, settings.meta.property);
		return provider.prettyFormatLine(maskedArgs, meta, unstyled(settings));
	};
}
/**
* A view of `settings` with pretty styling off, for the {@link pretty} stage. Built per call (not cached)
* so later `logger.settings.pretty` changes are always honored; `inspectOptions` is copied because
* `prettyFormatLine` writes `colors` into it, and the console path must keep its own value.
*/
function unstyled(settings) {
	if (settings.pretty.style === false) return settings;
	return {
		...settings,
		pretty: {
			...settings.pretty,
			style: false,
			inspectOptions: { ...settings.pretty.inspectOptions }
		}
	};
}
/**
* Resolve a {@link TLogFormat} (`"pretty"`, `"json"`, or a custom {@link LogFormatter}) to a concrete
* {@link LogFormatter}. This is how the core turns the logger-wide `type` and each transport's `format`
* into a single function that produces the line for that sink — the one place the old `type`/overwrite
* branching is replaced.
*
* `"pretty"` resolves to the {@link pretty} stage (bound to `provider`), `"json"` to the {@link json}
* stage, and a function is returned as-is.
*
* @param format - the format selector.
* @param provider - the runtime provider, needed to build the pretty formatter.
* @returns a {@link LogFormatter} that turns a record + settings into the output line.
*
* @example
* const fmt = resolveFormatter(transport.format ?? settings.type, this.runtime, this.features.renderJson);
* transport.write(record, fmt(record, settings));
*/
function resolveFormatter(format, provider, jsonLine) {
	if (format === "json") return jsonLine;
	if (format === "pretty") return pretty(provider);
	return format;
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/internal/environment.js
function safeGetCwd() {
	try {
		const nodeProcess = globalThis?.process;
		if (typeof nodeProcess?.cwd === "function") return nodeProcess.cwd();
	} catch {}
	try {
		const deno = globalThis?.Deno;
		if (typeof deno?.cwd === "function") return deno.cwd();
	} catch {}
}
function isBrowserEnvironment$1() {
	return typeof window !== "undefined" && typeof document !== "undefined";
}
function isWorkerEnvironment() {
	return typeof globalThis.importScripts === "function";
}
/**
* True on React Native (Hermes or JSC). `navigator.product === "ReactNative"` is the documented,
* stable check; real browsers report the frozen legacy value "Gecko" so it cannot false-positive.
*/
function isReactNativeEnvironment() {
	try {
		return globalThis.navigator?.product === "ReactNative";
	} catch {
		return false;
	}
}
/** Read the process-style env bag (Node/Bun/Deno-with-permissions) at call time; never throws. */
function readEnvBag() {
	try {
		const proc = globalThis?.process;
		if (proc?.env != null) return proc.env;
	} catch {}
}
/**
* Read ONE env var via a guarded property GET; never throws. On Deno, `process.env` is a permission-
* checked proxy: obtaining the bag succeeds, but each individual property read throws `NotCapable`
* without `--allow-env` — so every read (not just the bag lookup) must sit inside a try/catch, or
* merely importing/constructing a logger crashes a permissionless Deno process.
*/
function safeEnvGet(key) {
	try {
		return readEnvBag()?.[key];
	} catch {
		return;
	}
}
/**
* Whether `NO_COLOR` is set to a non-empty value (https://no-color.org). When true, colorized/styled
* output should be suppressed even in a pretty/TTY context.
*/
function noColorRequested() {
	const value = safeEnvGet("NO_COLOR");
	return value != null && value !== "";
}
/** Whether `FORCE_COLOR` is set to a non-empty, non-"0" value, explicitly opting back into styled output. */
function forceColorRequested() {
	const value = safeEnvGet("FORCE_COLOR");
	return value != null && value !== "" && value !== "0";
}
/** Whether the runtime's stdout is an interactive TTY (Node/Bun expose `process.stdout.isTTY`). */
function stdoutIsTTY() {
	try {
		return (globalThis?.process)?.stdout?.isTTY === true;
	} catch {
		return false;
	}
}
/**
* Resolve the default output `type` when the user did not set one (M3.2).
*
* The default is ALWAYS `"pretty"` — on every runtime, TTY or not, CI or not. Pretty output is what a
* human reads, and non-TTY output (a pipe, a redirect, `docker logs`, a CI build log) is still read by a
* human the overwhelming majority of the time. TTY-ness is too weak a signal for "this wants machine-
* readable JSON", so it never switches the format here — it only controls whether pretty output is
* COLORIZED (resolved separately in `pretty.style`: colored on a TTY, uncolored when piped).
*
* Structured JSON is a deliberate production decision, so it is opt-in: set `type: "json"`, use
* `Logger.fromEnv()` / `TSLOG_TYPE=json`, or attach a JSON transport/sink. That keeps the consequential
* choice explicit and where it belongs, instead of guessing it from an ambiguous environment probe.
*/
function resolveDefaultType() {
	return "pretty";
}
function consoleSupportsCssStyling() {
	if (!isBrowserEnvironment$1() && !isWorkerEnvironment()) return false;
	const userAgent = (globalThis?.navigator)?.userAgent ?? "";
	if (/firefox/i.test(userAgent)) return true;
	if (globalThis?.CSS?.supports?.("color", "#000")) return true;
	return /safari/i.test(userAgent) && !/chrome/i.test(userAgent);
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/internal/nativeConsole.js
/**
* Native-console resolution shared between the core and the `tslog/console` subpath.
*
* `wrapConsole(logger)` replaces the global `console.*` methods with forwarders into a logger. The
* logger's OWN output sinks (the json/pretty console writes, transport-error reports, dev warnings)
* resolve `console.log`/`console.error`/`console.warn` at call time — which, once wrapped, would be
* the forwarder itself: the logger's output gets re-ingested as a brand-new log (double transport
* delivery, nested records) and asynchronous reports (a rejected transport promise handled in a
* microtask) can even livelock in a forward→log→report→forward loop that no synchronous latch covers.
*
* The seam: `wrapConsole` publishes the saved native methods on the `console` object under the
* well-known registry symbol {@link NATIVE_CONSOLE_KEY}. Every internal sink resolves its console
* method through {@link nativeConsoleMethod}, which prefers the published originals and falls back to
* the live `console` method when the console is not wrapped. `Symbol.for` keeps the two sides
* decoupled — the core never imports the subpath, and the subpath never imports the core.
*/
/** Well-known registry key under which `tslog/console` publishes the saved native console methods. */
const NATIVE_CONSOLE_KEY = Symbol.for("tslog.console.originals");
/**
* Resolve the native `console[method]`, bypassing a `tslog/console` wrapper when one is installed.
* Falls back to the live console method (the normal, unwrapped case). Never throws.
*/
function nativeConsoleMethod(method) {
	try {
		const original = console[NATIVE_CONSOLE_KEY]?.[method];
		if (typeof original === "function") return original;
	} catch {}
	return console[method];
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/core/transports.js
/**
* Runtime that owns the attached-transport list: it normalizes the two accepted input shapes
* (a full {@link Transport} or a bare {@link TransportFn}) into a uniform internal `Transport` list,
* gates each transport by its own {@link Transport.minLevel}, selects each transport's
* {@link Transport.format} (computing the formatted line lazily and sharing it across transports that
* ask for the same format), runs every transport in `try/catch` isolation so one sink can never break
* logging or its siblings, and flushes/disposes transports asynchronously.
*
* The {@link BaseLogger}/`Logger` use {@link attachTransport} (which returns a detach function),
* {@link dispatchToTransports} (per `log()` call), and {@link flushAll} (for `logger.flush()` and the
* logger's `[Symbol.asyncDispose]`).
*
* @module core/transports
*/
/**
* Narrow an `attachTransport` input to a full {@link Transport}: a function input is a
* {@link TransportFn}, anything else is assumed to be a `Transport` object.
*/
function isTransportFn(input) {
	return typeof input === "function";
}
/**
* Normalize an `attachTransport` input into a uniform internal {@link Transport}.
*
* A bare {@link TransportFn} is wrapped into a `Transport` whose {@link Transport.write} forwards the
* `record` to the function (the formatted `line` is ignored) and which has no `flush`/disposer. A
* `Transport` object is returned unchanged so its `name`, `minLevel`, `format`, `flush`, and
* `[Symbol.asyncDispose]` are preserved.
*
* @example
* normalizeTransport((record) => queue.push(record)); // -> { write(record) { queue.push(record); } }
*/
function normalizeTransport(input) {
	if (isTransportFn(input)) {
		const fn = input;
		return { write(record) {
			return fn(record);
		} };
	}
	return input;
}
/**
* Resolve a transport's {@link Transport.minLevel} (a number or a level name) to a numeric id.
* Returns `Number.NEGATIVE_INFINITY` when no `minLevel` is set so the transport receives everything.
*/
function resolveTransportMinLevel(transport, customLevels) {
	if (transport.minLevel == null) return Number.NEGATIVE_INFINITY;
	return resolveLogLevelId(transport.minLevel, customLevels) ?? Number.NEGATIVE_INFINITY;
}
/**
* In-flight async `write(...)` promises per TRANSPORT object. `flushAll` awaits the sets of every
* transport in the list it is given, so `logger.flush()` covers plain async transport functions — and
* because a shared transport carries ONE set regardless of which logger dispatched to it, a parent's
* flush also awaits writes a sub-logger dispatched to the shared sink (and vice versa).
*/
const pendingWritesByTransport = /* @__PURE__ */ new WeakMap();
/**
* Run a single transport in isolation: report-but-swallow any thrown error or rejected promise so a
* failing sink never breaks logging or its siblings. An async write's promise is tracked on the
* transport list so `flushAll` can await it; synchronous throws and async rejections are both handled.
*/
function runTransportIsolated(transport, record, line) {
	try {
		const result = transport.write(record, line);
		if (result != null && typeof result.then === "function") {
			let pending = pendingWritesByTransport.get(transport);
			if (pending === void 0) {
				pending = /* @__PURE__ */ new Set();
				pendingWritesByTransport.set(transport, pending);
			}
			const tracked = result.then(() => {
				pending.delete(tracked);
			}, (error) => {
				pending.delete(tracked);
				reportTransportError(transport, error);
			});
			pending.add(tracked);
		}
	} catch (error) {
		reportTransportError(transport, error);
	}
}
/** Report a transport failure without ever throwing (a console that itself throws is tolerated). */
function reportTransportError(transport, error) {
	try {
		const label = transport.name != null ? ` "${transport.name}"` : "";
		nativeConsoleMethod("error")(`tslog: attached transport${label} threw an error`, error);
	} catch {}
}
/**
* Dispatch one finished log record to every attached transport.
*
* For each transport: skip it when `logLevelId` is below its resolved {@link Transport.minLevel};
* otherwise resolve the line for its {@link Transport.format} (defaulting to the logger's `type`),
* computing each distinct format **at most once per call** and sharing it across transports that ask
* for the same format, then hand `(record, line)` to {@link runTransportIsolated}.
*
* The `defaultFormat` is the logger-wide format used when a transport sets no `format` of its own; for
* `type: "hidden"` pass `"json"` (the structured record is still delivered to transports). Formatting
* is fully lazy: when no transport passes its `minLevel`, `formatResolver` is never invoked.
*
* @param transports     The resolved internal transport list (already normalized via {@link normalizeTransport}).
* @param record         The finished, meta-decorated log object.
* @param logLevelId     The numeric level of this log, used for per-transport `minLevel` gating.
* @param defaultFormat  The format used for transports that declare no `format`.
* @param formatResolver Produces the formatted line for a given format (decouples this module from `render/*`).
*/
function dispatchToTransports(transports, record, logLevelId, defaultFormat, formatResolver, customLevels) {
	if (transports.length === 0) return;
	let prettyLine;
	let jsonLine;
	let lineByFormatterFn;
	const lineFor = (format) => {
		if (typeof format === "function") {
			lineByFormatterFn ??= /* @__PURE__ */ new Map();
			const cached = lineByFormatterFn.get(format);
			if (cached !== void 0) return cached;
			const line = formatResolver(record, format);
			lineByFormatterFn.set(format, line);
			return line;
		}
		if (format === "json") {
			jsonLine ??= formatResolver(record, "json");
			return jsonLine;
		}
		prettyLine ??= formatResolver(record, "pretty");
		return prettyLine;
	};
	for (const transport of transports) {
		if (logLevelId < resolveTransportMinLevel(transport, customLevels)) continue;
		const format = transport.format ?? defaultFormat;
		let line;
		try {
			line = lineFor(format);
		} catch (error) {
			reportTransportError(transport, error);
			line = "";
		}
		runTransportIsolated(transport, record, line);
	}
}
/**
* Attach a transport to a logger's resolved transport list and return a detach function.
*
* The input is normalized via {@link normalizeTransport} (a bare {@link TransportFn} is wrapped) and
* pushed onto `transports`. The returned `() => void` removes **that** transport instance (by
* identity) on first call and is idempotent thereafter, so detaching twice is safe even if the list
* was mutated in between.
*
* @example
* const detach = attachTransport(logger.settings.attachedTransports, { name: "file", write });
* // later:
* detach(); // removes the transport; calling again is a no-op
*/
function attachTransport(transports, input) {
	const normalized = normalizeTransport(input);
	transports.push(normalized);
	let detached = false;
	return () => {
		if (detached) return;
		detached = true;
		const index = transports.indexOf(normalized);
		if (index !== -1) transports.splice(index, 1);
	};
}
/**
* Flush every transport that supports it, then run any async disposers, awaiting all of them.
*
* For each transport with a {@link Transport.flush}, its `flush()` is invoked; for each with a
* {@link Transport.[Symbol.asyncDispose]}, its disposer is invoked. All resulting promises are awaited
* together via `Promise.allSettled`, so one transport failing to flush/dispose never prevents the
* others from completing and the overall promise never rejects. Transports without `flush`/disposer
* (e.g. wrapped plain functions) are skipped.
*
* Used by `logger.flush()` (flush only) and the logger's own disposal (flush + dispose); pass
* `dispose: true` to additionally invoke `[Symbol.asyncDispose]`.
*
* @example
* await flushAll(logger.settings.attachedTransports);             // flush before exit
* await flushAll(logger.settings.attachedTransports, true);       // flush + dispose
*/
async function flushAll(transports, dispose = false) {
	if (transports.length === 0) return;
	const inFlightWrites = [];
	for (const transport of transports) {
		const pending = pendingWritesByTransport.get(transport);
		if (pending !== void 0 && pending.size > 0) inFlightWrites.push(...pending);
	}
	if (inFlightWrites.length > 0) await Promise.allSettled(inFlightWrites);
	const pending = [];
	for (const transport of transports) {
		if (typeof transport.flush === "function") pending.push(invokeIsolated(() => transport.flush?.(), transport));
		if (dispose) {
			const disposer = transport[Symbol.asyncDispose];
			if (typeof disposer === "function") pending.push(invokeIsolated(() => disposer.call(transport), transport));
		}
	}
	if (pending.length > 0) await Promise.allSettled(pending);
}
/**
* Invoke `[Symbol.asyncDispose]` on each transport in isolation, awaiting all of them. Used by the
* logger's disposers for the transports it OWNS (inherited transports are only flushed — disposing a
* shared parent sink from a request-scoped child would kill the parent's logging).
*/
async function disposeAll(transports) {
	if (transports.length === 0) return;
	const pending = [];
	for (const transport of transports) {
		const disposer = transport[Symbol.asyncDispose];
		if (typeof disposer === "function") pending.push(invokeIsolated(() => disposer.call(transport), transport));
	}
	if (pending.length > 0) await Promise.allSettled(pending);
}
/**
* Invoke a flush/dispose callback, isolating synchronous throws into a rejected promise and reporting
* any failure so {@link flushAll} can `allSettled` over the results without a single sink aborting it.
*/
function invokeIsolated(fn, transport) {
	try {
		return Promise.resolve(fn()).catch((error) => reportTransportError(transport, error));
	} catch (error) {
		reportTransportError(transport, error);
		return Promise.resolve();
	}
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/core/settings.js
/**
* Pretty-log template placeholders recognized by tslog. Used to warn (in development only) about
* likely typos such as `{{loglevelname}}` instead of `{{logLevelName}}`.
*/
const KNOWN_PRETTY_PLACEHOLDERS = /* @__PURE__ */ new Set([
	"yyyy",
	"mm",
	"dd",
	"hh",
	"MM",
	"ss",
	"ms",
	"dateIsoStr",
	"rawIsoStr",
	"logLevelName",
	"name",
	"nameWithDelimiterPrefix",
	"nameWithDelimiterSuffix",
	"fullFilePath",
	"filePathWithLine",
	"fileNameWithLine",
	"fileName",
	"filePath",
	"fileLine",
	"fileColumn"
]);
/** Every key accepted at the top level of {@link ISettingsParam}. Drives the unknown-key check. */
const KNOWN_TOP_LEVEL_KEYS = /* @__PURE__ */ new Set([
	"type",
	"name",
	"parentNames",
	"minLevel",
	"argumentsArrayName",
	"persistLevel",
	"persistLevelKey",
	"pretty",
	"json",
	"mask",
	"stack",
	"meta",
	"prefix",
	"attachedTransports",
	"middleware",
	"customLevels",
	"bindings",
	"strictConfig",
	"contextStorage",
	"clock"
]);
/** The keys accepted inside each settings group. Drives the unknown-key check for nested typos. */
const KNOWN_GROUP_KEYS = {
	pretty: /* @__PURE__ */ new Set([
		"enabled",
		"template",
		"errorTemplate",
		"errorStackTemplate",
		"errorParentNamesSeparator",
		"errorLoggerNameDelimiter",
		"style",
		"timeZone",
		"styles",
		"levelMethod",
		"passObjectsNatively",
		"inspectOptions"
	]),
	json: /* @__PURE__ */ new Set([
		"messageKey",
		"levelKey",
		"levelIdKey",
		"timeKey",
		"time",
		"errorKey",
		"numericLevel",
		"stableKeyOrder"
	]),
	mask: /* @__PURE__ */ new Set([
		"keys",
		"caseInsensitive",
		"regex",
		"placeholder",
		"paths",
		"censor",
		"hashLabel"
	]),
	stack: /* @__PURE__ */ new Set(["capture", "internalFramePatterns"]),
	meta: /* @__PURE__ */ new Set(["property", "attachContext"])
};
/**
* v4 flat settings keys mapped to their v5 home, so a config carried over from v4 gets a precise
* migration hint instead of being silently ignored (which for `maskValuesOfKeys` would mean logging
* secrets in plaintext). Mirrors the mapping table in MIGRATION_v4_to_v5.md.
*/
const V4_KEY_MIGRATIONS = {
	prettyLogTemplate: "pretty.template",
	prettyErrorTemplate: "pretty.errorTemplate",
	prettyErrorStackTemplate: "pretty.errorStackTemplate",
	prettyErrorParentNamesSeparator: "pretty.errorParentNamesSeparator",
	prettyErrorLoggerNameDelimiter: "pretty.errorLoggerNameDelimiter",
	stylePrettyLogs: "pretty.style",
	prettyLogTimeZone: "pretty.timeZone",
	prettyLogStyles: "pretty.styles",
	prettyInspectOptions: "pretty.inspectOptions",
	maskValuesOfKeys: "mask.keys",
	maskValuesOfKeysCaseInsensitive: "mask.caseInsensitive",
	maskValuesRegEx: "mask.regex",
	maskPlaceholder: "mask.placeholder",
	metaProperty: "meta.property",
	internalFramePatterns: "stack.internalFramePatterns",
	prettyLogLevelMethod: "pretty.levelMethod",
	hideLogPositionForProduction: "stack.capture (\"off\" hides positions)",
	overwrite: "middleware / logger.use()",
	stackDepthLevel: "the callerFrame constructor argument"
};
/**
* Bounded Levenshtein distance for did-you-mean suggestions. Bails out early once the distance
* exceeds `max`, so comparing a typo against every known key stays cheap.
*/
function editDistance(a, b, max) {
	if (Math.abs(a.length - b.length) > max) return max + 1;
	let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
	for (let i = 1; i <= a.length; i++) {
		const current = [i];
		let rowMin = i;
		for (let j = 1; j <= b.length; j++) {
			const cost = a[i - 1] === b[j - 1] ? 0 : 1;
			current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost);
			if (current[j] < rowMin) rowMin = current[j];
		}
		if (rowMin > max) return max + 1;
		previous = current;
	}
	return previous[b.length];
}
/** The closest known key within a small edit distance, or `undefined` when nothing is plausibly meant. */
function nearestKey(key, known) {
	const lowered = key.toLowerCase();
	const max = key.length <= 4 ? 1 : 2;
	let best;
	let bestDistance = max + 1;
	for (const candidate of known) {
		if (candidate.toLowerCase() === lowered) return candidate;
		const distance = editDistance(key, candidate, max);
		if (distance < bestDistance) {
			bestDistance = distance;
			best = candidate;
		}
	}
	return best;
}
/** Whether to emit developer diagnostics. Off in production and when explicitly disabled via TSLOG_DISABLE_WARNINGS. */
function devWarningsEnabled() {
	if (safeEnvGet("TSLOG_DISABLE_WARNINGS") != null) return false;
	return safeEnvGet("NODE_ENV") !== "production";
}
const reportedContextStorages = /* @__PURE__ */ new WeakSet();
function emitConfigWarning(message) {
	try {
		nativeConsoleMethod("warn")(`tslog: ${message}`);
	} catch {}
}
/**
* Validate user-provided settings (E6). By default this is a best-effort developer aid: it warns (in
* development only) about likely mistakes, never throws, and never changes behavior. When the opt-in
* `strictConfig: true` setting is set, the same hard misconfigurations instead throw a typed
* {@link TslogConfigError} (with a `code`, `setting`, and `suggestion`) — regardless of `NODE_ENV`, so a
* strict config fails fast in production too. The out-of-range placeholder/minLevel checks are unchanged.
*/
function validateSettingsParam(settings) {
	if (settings == null) return;
	const strict = settings.strictConfig === true;
	if (!strict && !devWarningsEnabled()) return;
	const report = (issue) => {
		if (strict) throw new TslogConfigError(issue);
		emitConfigWarning(issue.message);
	};
	if (settings.minLevel != null) {
		const resolved = resolveLogLevelId(settings.minLevel, settings.customLevels);
		if (resolved == null) report({
			code: "UNKNOWN_MIN_LEVEL",
			setting: "minLevel",
			message: `unknown minLevel ${JSON.stringify(settings.minLevel)}; expected a number 0-6 or a level name like "WARN".`,
			suggestion: "Use a number 0-6, a LogLevel enum value, or a level name like \"WARN\" — or register it via customLevels."
		});
		else if (typeof settings.minLevel === "number" && (resolved < 0 || resolved > 6)) report({
			code: "MIN_LEVEL_OUT_OF_RANGE",
			setting: "minLevel",
			message: `minLevel ${resolved} is outside the default range 0-6; no default log method will be filtered as you might expect.`,
			suggestion: "Set minLevel to a number between 0 (SILLY) and 6 (FATAL), or register a customLevel for the out-of-range id."
		});
	}
	try {
		const storage = settings.contextStorage;
		if (storage != null) {
			let malformed = false;
			try {
				malformed = typeof storage.run !== "function" || typeof storage.getStore !== "function";
			} catch {
				malformed = true;
			}
			if (malformed && (strict || !reportedContextStorages.has(storage))) {
				try {
					reportedContextStorages.add(storage);
				} catch {}
				report({
					code: "INVALID_CONTEXT_STORAGE",
					setting: "contextStorage",
					message: "contextStorage does not look like an AsyncLocalStorage instance (needs run() and getStore()); runInContext will not propagate context.",
					suggestion: "Pass an INSTANCE, e.g. `contextStorage: new AsyncLocalStorage()` from \"node:async_hooks\" — not the class itself."
				});
			}
		}
	} catch (error) {
		if (error instanceof TslogConfigError) throw error;
	}
	try {
		if (settings.clock != null && typeof settings.clock !== "function") report({
			code: "INVALID_CLOCK",
			setting: "clock",
			message: "clock must be a function returning a Date (e.g. `clock: () => new Date()`); it will be ignored.",
			suggestion: "Pass a zero-argument function returning a valid Date."
		});
		const time = settings.json?.time;
		if (time != null && time !== false && time !== "iso" && time !== "epoch" && typeof time !== "function") report({
			code: "INVALID_JSON_TIME",
			setting: "json.time",
			message: `unknown json.time value ${JSON.stringify(time)}; expected "iso", "epoch", false, or a (date) => string | number function.`,
			suggestion: "Use json.time: \"iso\" | \"epoch\" | false | ((date) => string | number)."
		});
	} catch (error) {
		if (error instanceof TslogConfigError) throw error;
	}
	let topLevelKeys = [];
	try {
		topLevelKeys = Object.keys(settings);
	} catch {}
	for (const key of topLevelKeys) {
		if (KNOWN_TOP_LEVEL_KEYS.has(key)) continue;
		const migrated = Object.hasOwn(V4_KEY_MIGRATIONS, key) ? V4_KEY_MIGRATIONS[key] : void 0;
		if (migrated != null) {
			report({
				code: "V4_FLAT_KEY",
				setting: key,
				message: `"${key}" was removed in v5 — use ${migrated} instead (see MIGRATION_v4_to_v5.md).`,
				suggestion: `Move "${key}" to ${migrated}.`
			});
			continue;
		}
		const closest = nearestKey(key, KNOWN_TOP_LEVEL_KEYS);
		report({
			code: "UNKNOWN_SETTING",
			setting: key,
			message: `unknown setting "${key}"${closest != null ? ` — did you mean "${closest}"?` : ""}`,
			suggestion: closest != null ? `Rename "${key}" to "${closest}".` : `Remove "${key}" — it is not a tslog setting.`
		});
	}
	for (const [group, knownKeys] of Object.entries(KNOWN_GROUP_KEYS)) {
		let groupValue;
		try {
			groupValue = settings[group];
		} catch {
			continue;
		}
		if (groupValue == null || typeof groupValue !== "object" || Array.isArray(groupValue)) continue;
		let groupKeys = [];
		try {
			groupKeys = Object.keys(groupValue);
		} catch {
			continue;
		}
		for (const key of groupKeys) {
			if (knownKeys.has(key)) continue;
			const closest = nearestKey(key, knownKeys);
			report({
				code: "UNKNOWN_SETTING",
				setting: `${group}.${key}`,
				message: `unknown setting "${group}.${key}"${closest != null ? ` — did you mean "${group}.${closest}"?` : ""}`,
				suggestion: closest != null ? `Rename "${group}.${key}" to "${group}.${closest}".` : `Remove "${group}.${key}" — it is not a tslog setting.`
			});
		}
	}
	const template = settings.pretty?.template;
	if (typeof template === "string") {
		const placeholderRegex = /{{\s*(.+?)\s*}}/g;
		let match;
		while ((match = placeholderRegex.exec(template)) != null) {
			const key = match[1];
			if (!KNOWN_PRETTY_PLACEHOLDERS.has(key)) report({
				code: "UNKNOWN_PRETTY_PLACEHOLDER",
				setting: "pretty.template",
				message: `pretty.template references unknown placeholder "{{${key}}}"; check the spelling (e.g. "{{logLevelName}}").`,
				suggestion: `Remove or fix "{{${key}}}" — see the recognized placeholders (e.g. "{{logLevelName}}", "{{filePathWithLine}}").`
			});
		}
	}
}
/**
* Resolve the effective {@link TStackCapture} mode from the (possibly partial) user settings.
*
* Precedence:
* 1. An explicit `stack.capture` value wins.
* 2. Otherwise default by output type: `"json"` -> `"off"`, everything else (pretty/hidden) -> `"auto"`.
*/
function resolveStackCapture(settings, type) {
	if (settings?.stack?.capture != null) return settings.stack.capture;
	return type === "json" ? "off" : "auto";
}
/**
* Resolve the effective output `type` (M3.2). An explicit `type` always wins. Otherwise, when
* `pretty.enabled` is set it decides (`true` -> "pretty", `false` -> "json"); when it is unset the
* default is always "pretty" (see `resolveDefaultType` — only colorization is env-aware; switching
* to JSON is an explicit choice via `type`, `Logger.fromEnv()`/`TSLOG_TYPE`, or a JSON transport).
*/
function resolveType(settings) {
	if (settings?.type != null) return settings.type;
	if (settings?.pretty?.enabled != null) return settings.pretty.enabled ? "pretty" : "json";
	return resolveDefaultType();
}
/**
* Resolve pretty styling. Precedence: an EXPLICIT `pretty.style` wins (per no-color.org, a user's
* deliberate configuration outranks the env hints — this is also what lets the CLI's --color/--no-color
* flags work under a conflicting NO_COLOR/FORCE_COLOR), then `FORCE_COLOR` forces styling on, then
* `NO_COLOR` forces it off, then the environment default.
*
* The default follows the destination: browser/worker/React-Native consoles get styled (CSS `%c`)
* output; server runtimes color only when stdout is an interactive TTY, so pretty output piped to a
* file or a log collector stays plain text instead of leaking ANSI escape codes.
*/
function resolveStyle(settings) {
	if (settings?.pretty?.style != null) return settings.pretty.style;
	if (forceColorRequested()) return true;
	if (noColorRequested()) return false;
	if (isBrowserEnvironment$1() || isWorkerEnvironment() || isReactNativeEnvironment()) return true;
	return stdoutIsTTY();
}
/**
* Normalize a partial {@link ISettingsParam} into a fully populated {@link ISettings} with every default applied.
*
* This owns the defaults block previously inlined in the `BaseLogger` constructor: it resolves the
* environment-aware `type` (M3.2), `minLevel`, derives `stack.capture`, clones array/object inputs so
* callers cannot mutate the logger's settings by reference, and fills in every pretty/json/mask/stack/meta
* default under the grouped resolved shape.
*/
function normalizeSettings(settings) {
	const type = resolveType(settings);
	const stackCapture = resolveStackCapture(settings, type);
	const customLevels = {};
	if (settings?.customLevels != null) for (const [name, id] of Object.entries(settings.customLevels)) {
		validateCustomLevel(name, id, customLevels);
		customLevels[name] = id;
	}
	return {
		type,
		name: settings?.name,
		parentNames: settings?.parentNames,
		minLevel: resolveLogLevelId(settings?.minLevel, customLevels) ?? 0,
		argumentsArrayName: settings?.argumentsArrayName,
		persistLevel: settings?.persistLevel,
		persistLevelKey: settings?.persistLevelKey,
		pretty: {
			template: settings?.pretty?.template ?? "{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}	{{logLevelName}}	{{filePathWithLine}}{{nameWithDelimiterPrefix}}	",
			errorTemplate: settings?.pretty?.errorTemplate ?? "\n{{errorName}} {{errorMessage}}\nerror stack:\n{{errorStack}}",
			errorStackTemplate: settings?.pretty?.errorStackTemplate ?? "  • {{fileName}}	{{method}}\n	{{filePathWithLine}}",
			errorParentNamesSeparator: settings?.pretty?.errorParentNamesSeparator ?? ":",
			errorLoggerNameDelimiter: settings?.pretty?.errorLoggerNameDelimiter ?? "	",
			style: resolveStyle(settings),
			timeZone: settings?.pretty?.timeZone ?? "UTC",
			styles: settings?.pretty?.styles ?? {
				logLevelName: {
					"*": [
						"bold",
						"black",
						"bgWhiteBright",
						"dim"
					],
					SILLY: ["bold", "white"],
					TRACE: ["bold", "whiteBright"],
					DEBUG: ["bold", "green"],
					INFO: ["bold", "blue"],
					WARN: ["bold", "yellow"],
					ERROR: ["bold", "red"],
					FATAL: ["bold", "redBright"]
				},
				dateIsoStr: "white",
				filePathWithLine: "white",
				name: ["white", "bold"],
				nameWithDelimiterPrefix: ["white", "bold"],
				nameWithDelimiterSuffix: ["white", "bold"],
				errorName: [
					"bold",
					"bgRedBright",
					"whiteBright"
				],
				fileName: ["yellow"],
				fileNameWithLine: "white"
			},
			levelMethod: settings?.pretty?.levelMethod ?? {},
			passObjectsNatively: settings?.pretty?.passObjectsNatively ?? isBrowserEnvironment$1(),
			inspectOptions: settings?.pretty?.inspectOptions ?? {
				colors: true,
				compact: false,
				depth: Infinity
			}
		},
		json: {
			messageKey: settings?.json?.messageKey ?? "message",
			levelKey: settings?.json?.levelKey ?? "level",
			levelIdKey: settings?.json?.levelIdKey ?? "levelId",
			timeKey: settings?.json?.timeKey ?? "time",
			errorKey: settings?.json?.errorKey ?? "error",
			numericLevel: settings?.json?.numericLevel ?? true,
			time: settings?.json?.time ?? "iso",
			stableKeyOrder: settings?.json?.stableKeyOrder ?? false
		},
		mask: {
			keys: [...settings?.mask?.keys ?? []],
			caseInsensitive: settings?.mask?.caseInsensitive ?? false,
			regex: [...settings?.mask?.regex ?? []],
			placeholder: settings?.mask?.placeholder ?? "[***]",
			paths: [...settings?.mask?.paths ?? []],
			censor: settings?.mask?.censor,
			hashLabel: settings?.mask?.hashLabel
		},
		stack: {
			capture: stackCapture,
			internalFramePatterns: [...settings?.stack?.internalFramePatterns ?? []]
		},
		meta: {
			property: settings?.meta?.property ?? "_logMeta",
			attachContext: settings?.meta?.attachContext ?? true
		},
		prefix: [...settings?.prefix ?? []],
		attachedTransports: (settings?.attachedTransports ?? []).map((transport) => normalizeTransport(transport)),
		middleware: [...settings?.middleware ?? []],
		customLevels,
		bindings: settings?.bindings != null ? { ...settings.bindings } : void 0,
		strictConfig: settings?.strictConfig ?? false,
		contextStorage: settings?.contextStorage,
		clock: settings?.clock
	};
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/urlToObj.js
function urlToObject(url) {
	return {
		href: url.href,
		protocol: url.protocol,
		username: url.username,
		password: url.password,
		host: url.host,
		hostname: url.hostname,
		port: url.port,
		pathname: url.pathname,
		search: url.search,
		searchParams: [...url.searchParams].map(([key, value]) => ({
			key,
			value
		})),
		hash: url.hash,
		origin: url.origin
	};
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/interfaces.js
/** The log level ids used by the default logging methods (silly … fatal). */
var LogLevel;
(function(LogLevel) {
	LogLevel[LogLevel["SILLY"] = 0] = "SILLY";
	LogLevel[LogLevel["TRACE"] = 1] = "TRACE";
	LogLevel[LogLevel["DEBUG"] = 2] = "DEBUG";
	LogLevel[LogLevel["INFO"] = 3] = "INFO";
	LogLevel[LogLevel["WARN"] = 4] = "WARN";
	LogLevel[LogLevel["ERROR"] = 5] = "ERROR";
	LogLevel[LogLevel["FATAL"] = 6] = "FATAL";
})(LogLevel || (LogLevel = {}));
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/BaseLogger.js
const FALLBACK_FEATURES = {
	renderJson: renderJsonUnplanned,
	validateSettings(settings) {
		if (settings == null) return;
		const mask = settings.mask;
		if (mask != null && ((mask.keys?.length ?? 0) > 0 || (mask.regex?.length ?? 0) > 0 || (mask.paths?.length ?? 0) > 0 || mask.censor != null)) throw new TslogConfigError({
			code: "FEATURES_NO_MASKING",
			setting: "mask",
			message: "this BaseLogger was constructed without a feature set, so these mask settings would be silently ignored and secrets logged in plaintext.",
			suggestion: "Pass the full feature set as the fifth constructor argument: `new BaseLogger(settings, logObj, env, NaN, fullCoreFeatures)` (exported from \"tslog\")."
		});
		if (settings.type === "pretty" || settings.pretty?.enabled === true) throw new TslogConfigError({
			code: "FEATURES_NO_PRETTY",
			setting: "type",
			message: "this BaseLogger was constructed without a feature set, so pretty output would lose its meta line.",
			suggestion: "Pass the full feature set as the fifth constructor argument (`fullCoreFeatures`), or use the entry Logger classes."
		});
		if (settings.strictConfig === true) throw new TslogConfigError({
			code: "FEATURES_NO_VALIDATION",
			setting: "strictConfig",
			message: "this BaseLogger was constructed without a feature set, so the strict settings validation you opted into cannot run.",
			suggestion: "Pass the full feature set as the fifth constructor argument (`fullCoreFeatures`), which includes the validator."
		});
	}
};
const IDENTITY_MASKING = { mask(args) {
	for (let i = 0; i < args.length; i++) if (args[i] instanceof URL) return args.map((arg) => arg instanceof URL ? urlToObject(arg) : arg);
	return args;
} };
/**
* The core logging pipeline (BC11 — no module-level environment singleton).
*
* `BaseLogger` owns the runtime-agnostic pipeline: settings normalization, the `log()` method,
* `attachTransport`, and `getSubLogger`. Everything that depends on the runtime (stack parsing, meta
* assembly, inspect, console transports, CSS styling) is supplied through the injected
* {@link EnvironmentProvider}, and the masking / log-object / meta engines live in `core/*`.
*
* Each entry point injects its own provider:
*  - `index.node.ts`      -> `createNodeEnvironment()`
*  - `index.browser.ts`   -> `createBrowserEnvironment()`
*  - `index.universal.ts` -> `selectEnvironment()` (universal provider)
*
* The constructor takes `(settings?, logObj?, environment, callerFrame=NaN, features?)`; `features` is
* the runtime-agnostic subsystem composition (masking/JSON renderer/validation — see `core/features.ts`),
* injected by every entry (`fullCoreFeatures` from the standard ones). `callerFrame` (M1.14,
* renamed from `stackDepthLevel`) is the manual stack-frame index; `NaN` means auto-detect.
*/
var BaseLogger = class {
	logObj;
	callerFrame;
	runtime;
	settings;
	maxErrorCauseDepth = 5;
	captureStackForMeta;
	maskingEngine;
	features;
	logObjDeps;
	asyncContextBox = {};
	warnedContextNoop = false;
	inheritedTransports;
	hasCustomLevels = false;
	rawBindings;
	_conditionalNoop;
	constructor(settings, logObj, environment, callerFrame = NaN, features) {
		this.logObj = logObj;
		this.callerFrame = callerFrame;
		this.features = features ?? FALLBACK_FEATURES;
		this.features.validateSettings?.(settings);
		this.runtime = environment;
		this.settings = normalizeSettings(settings);
		this.maskingEngine = this.features.createMaskingEngine?.(this.settings, {
			isError: (value) => this.runtime.isError(value),
			isBuffer: (value) => this.runtime.isBuffer(value)
		}) ?? IDENTITY_MASKING;
		this.logObjDeps = {
			isError: (value) => this.runtime.isError(value),
			isBuffer: (value) => this.runtime.isBuffer(value),
			getErrorTrace: (error) => this.runtime.getErrorTrace(error),
			maxErrorCauseDepth: this.maxErrorCauseDepth
		};
		if (this.settings.persistLevel === true) {
			const persisted = readPersistedLevel(this.settings.persistLevelKey ?? "tslog:level");
			if (persisted != null) {
				const asNumber = Number(persisted);
				const resolved = resolveLogLevelId(persisted.trim() !== "" && Number.isFinite(asNumber) ? asNumber : persisted, this.settings.customLevels);
				if (resolved != null) this.settings.minLevel = resolved;
			}
		}
		this.captureStackForMeta = this._shouldCaptureStack();
		if (this.settings.bindings != null) {
			this.rawBindings = { ...this.settings.bindings };
			this._sanitizeBindings(this.settings.bindings);
			this.settings.bindings = this.maskingEngine.mask([this.settings.bindings])[0];
		}
		for (const [name, id] of Object.entries(this.settings.customLevels)) {
			this.hasCustomLevels = true;
			this._installCustomLevelMethod(name, id);
		}
		if (this.settings.contextStorage != null) this.asyncContextBox.store = createAsyncContextStoreFromInstance(this.settings.contextStorage);
	}
	/**
	* Define `this[name.toLowerCase()](...)` for a registered custom level so call sites stop repeating
	* the (id, name) pair. A name whose lower-cased form collides with an existing logger member (e.g.
	* "flush", "info") is NOT installed — the level still works via `log(id, name, ...)` — and a dev
	* warning explains why.
	*/
	_installCustomLevelMethod(name, id) {
		const methodName = name.toLowerCase();
		const existing = this[methodName];
		if (existing !== void 0 && existing?.__tslogCustomLevel === void 0) {
			if (devWarningsEnabled()) emitConfigWarning(`custom level "${name}" collides with the existing logger member "${methodName}"; no method was installed — use log(${id}, ${JSON.stringify(name)}, ...) instead.`);
			return;
		}
		const method = (...args) => this.log(id, name, ...args);
		method.__tslogCustomLevel = name;
		Object.defineProperty(this, methodName, {
			value: method,
			enumerable: false,
			configurable: true,
			writable: true
		});
	}
	/**
	* Drop binding keys that would corrupt the record shape: a key equal to the configured message key
	* or meta property hijacks message promotion, and an integer-like key gets hoisted by JS object
	* enumeration (and permanently bails the precompiled JSON line plan). Warns in development.
	*/
	_sanitizeBindings(bindings) {
		for (const key of Object.keys(bindings)) {
			const integerLike = /^(?:0|[1-9]\d*)$/.test(key);
			if (key === this.settings.json.messageKey || key === this.settings.meta.property || key === "__proto__" || integerLike) {
				delete bindings[key];
				if (devWarningsEnabled()) emitConfigWarning(`binding "${key}" was dropped: ${integerLike ? "integer-like keys are hoisted by JS object semantics" : "it collides with a reserved record key"} — rename the binding.`);
			}
		}
	}
	/**
	* Set this logger's minimum level at runtime (M4.6). Accepts a numeric id, the
	* {@link import("./interfaces.js").LogLevel} enum, or a level name (a default like `"WARN"` or a
	* registered custom level like `"NOTICE"`), resolved the same way `minLevel` is. An unknown level name is
	* ignored (the level is left unchanged). Works on every runtime.
	*
	* When {@link import("./interfaces.js").ISettingsParam.persistLevel} is enabled and running in a browser,
	* the new level is also written to `localStorage` (guarded; a no-op off-browser) so it survives a reload.
	*
	* @returns this logger, for chaining.
	* @example logger.setMinLevel("WARN");   // or logger.setMinLevel(4)
	*/
	setMinLevel(level) {
		const resolved = resolveLogLevelId(level, this.settings.customLevels);
		if (resolved == null) return this;
		this.settings.minLevel = resolved;
		if (this.settings.persistLevel === true) writePersistedLevel(resolved, this.settings.persistLevelKey ?? "tslog:level");
		return this;
	}
	/**
	* Logs a message with a custom log level.
	* @param logLevelId    - Log level ID e.g. 0
	* @param logLevelName  - Log level name e.g. silly
	* @param args          - Multiple log attributes that should be logged out.
	* @return LogObject with meta property, when log level is >= minLevel
	*/
	log(logLevelId, logLevelName, ...args) {
		if (logLevelId < this.settings.minLevel) return;
		if (this.hasCustomLevels) {
			const registered = this.settings.customLevels[logLevelName];
			if (registered !== void 0 && registered !== logLevelId && devWarningsEnabled()) emitConfigWarning(`log(${logLevelId}, ${JSON.stringify(logLevelName)}) does not match the registered id ${registered} for that custom level.`);
		}
		const resolvedArgs = this._resolveLogArguments(args);
		let logArgs = this.settings.prefix.length > 0 ? [...this.settings.prefix, ...resolvedArgs] : resolvedArgs;
		let effectiveLevelId = logLevelId;
		let effectiveLevelName = logLevelName;
		let middlewareMeta;
		if (this.settings.middleware.length > 0) {
			const context = runMiddleware({
				logLevelId,
				logLevelName,
				args: logArgs,
				settings: this.settings,
				meta: {}
			}, this.settings.middleware);
			if (context == null) return;
			effectiveLevelId = context.logLevelId;
			effectiveLevelName = context.logLevelName;
			logArgs = context.args;
			middlewareMeta = context.meta;
		}
		const maskedArgs = this.maskingEngine.mask(logArgs);
		const thisLogObj = this.logObj != null ? recursiveCloneAndExecuteFunctions(this.logObj) : void 0;
		const logObj = toLogObj(maskedArgs, this.settings.argumentsArrayName, this.logObjDeps, thisLogObj, this.settings.bindings);
		const record = this._addMetaToLogObj(logObj, effectiveLevelId, effectiveLevelName);
		const recordMeta = record[this.settings.meta.property];
		if (recordMeta != null) {
			if (this.settings.meta.attachContext) {
				const activeContext = this.asyncContextBox.store?.getStore();
				if (activeContext != null) for (const key of Object.keys(activeContext)) recordMeta[key] = activeContext[key];
			}
			if (middlewareMeta != null) for (const key of Object.keys(middlewareMeta)) recordMeta[key] = middlewareMeta[key];
		}
		attachMaskedArgs(record, maskedArgs);
		if (this.settings.type === "pretty") {
			const { args: prettyArgs, errors: prettyErrors } = this.runtime.prettyFormatLogObj(maskedArgs, this.settings);
			/* v8 ignore next -- FALLBACK_FEATURES rejects pretty without a full feature set (FEATURES_NO_PRETTY), so no live logger reaches this "" fallback */
			const metaMarkup = this.features.buildPrettyMetaText?.(this.settings, recordMeta) ?? "";
			this.runtime.transportFormatted(metaMarkup, prettyArgs, prettyErrors, recordMeta, this.settings);
		} else if (this.settings.type === "json") try {
			const line = this.features.renderJson(record, this.settings);
			if (this.runtime.writeJsonLine != null) this.runtime.writeJsonLine(line);
			else nativeConsoleMethod("log")(line);
		} catch {}
		if (this.settings.attachedTransports.length > 0) {
			const defaultFormat = this.settings.type === "pretty" ? "pretty" : "json";
			dispatchToTransports(this.settings.attachedTransports, record, effectiveLevelId, defaultFormat, (rec, format) => resolveFormatter(format, this.runtime, this.features.renderJson)(rec, this.settings), this.settings.customLevels);
		}
		return record;
	}
	/**
	* Whether a log at `level` would be emitted by this logger (E4) — i.e. its resolved id is `>=`
	* `this.settings.minLevel`. Accepts a numeric id, the {@link import("./interfaces.js").LogLevel}
	* enum, or a level name (a default like `"WARN"` or a registered custom level like `"NOTICE"`), resolved
	* the same way `minLevel` is. An unknown level name returns `false`. Use this to guard expensive payload
	* construction before logging.
	*
	* @example
	* if (logger.isLevelEnabled("DEBUG")) logger.debug({ snapshot: serializeExpensiveState() });
	*/
	isLevelEnabled(level) {
		const resolved = resolveLogLevelId(level, this.settings.customLevels);
		if (resolved == null) return false;
		return resolved >= this.settings.minLevel;
	}
	/**
	* Conditional-logging gate (issue #299). Returns this logger when `condition` is truthy, or a no-op
	* stand-in when it is falsy, so a per-call condition reads as a fluent chain without an `if` statement
	* or a throwaway helper:
	*
	* @example
	* logger.if(!ok).info("action failed", { id });
	* logger.if(retries > maxRetries).warn("giving up", { retries });
	*
	* The no-op stand-in accepts every level method (defaults and custom) and returns `undefined` from
	* each — matching a real log call's `undefined` return when it is below `minLevel` — but its arguments
	* are still evaluated, so guard *expensive* payload construction with {@link isLevelEnabled} instead,
	* which short-circuits before the arguments are built. `if()` gates a single log call; it is not meant
	* to be chained ahead of `getSubLogger`/`child`.
	*/
	if(condition) {
		return condition ? this : this._getConditionalNoop();
	}
	/**
	* Lazily build (and cache) the no-op stand-in returned by {@link if} for a falsy condition. A Proxy so
	* it covers every current and future method — default levels, `addLevel()` levels — uniformly: any
	* property resolves to a function that ignores its arguments and returns `undefined`, exactly like a
	* suppressed log call.
	*/
	_getConditionalNoop() {
		if (this._conditionalNoop == null) {
			const noopMethod = () => void 0;
			this._conditionalNoop = new Proxy(this, { get(target, prop, receiver) {
				if (prop === "then") return;
				const actual = Reflect.get(target, prop, receiver);
				return typeof actual === "function" ? noopMethod : actual;
			} });
		}
		return this._conditionalNoop;
	}
	/**
	* Append a {@link LogMiddleware} to this logger's chain. Middleware run in registration order on every
	* log before the record is built, and may enrich/rewrite the {@link LogContext} or drop the log (return
	* `null`/`false`). The replacement for the removed `overwrite.*` hooks.
	*
	* @returns this logger, for chaining.
	* @example
	* logger.use((ctx) => { ctx.meta.traceId = getTraceId(); return ctx; });
	*/
	use(middleware) {
		this.settings.middleware.push(middleware);
		return this;
	}
	/**
	* Lazily resolve this logger's {@link AsyncContextStore} (M2.13), creating it on first use so merely
	* constructing a logger never touches `AsyncLocalStorage`. Sub-loggers share their parent's store.
	*/
	_getAsyncContextStore() {
		if (this.asyncContextBox.store == null) {
			if (this.settings.contextStorage != null) this.asyncContextBox.store = createAsyncContextStoreFromInstance(this.settings.contextStorage);
			else this.asyncContextBox.store = this.runtime.createAsyncContextStore != null ? this.runtime.createAsyncContextStore() : createAsyncContextStore();
		}
		return this.asyncContextBox.store;
	}
	/**
	* Run `fn` with `ctx` as the active async context (M2.13). For the (possibly async) duration of `fn`, the
	* fields in `ctx` are attached onto every log's `_logMeta` (unless `meta.attachContext` is `false`) and are
	* readable via {@link getContext} — across `await`, timers, promise chains, and nested `runInContext`
	* calls (nested contexts inherit and shallow-merge over the parent). Returns whatever `fn` returns.
	*
	* On runtimes without `AsyncLocalStorage` (browsers/edge) this gracefully degrades: `fn` still runs, but
	* no context is propagated. Never throws on account of an unavailable store.
	*
	* @example
	* await logger.runInContext({ requestId: req.id }, async () => {
	*   logger.info("handling");           // _logMeta.requestId === req.id
	*   await doWork();                    // still in context after the await
	* });
	*/
	runInContext(ctx, fn) {
		const store = this._getAsyncContextStore();
		if (!store.enabled && !this.warnedContextNoop && devWarningsEnabled()) {
			this.warnedContextNoop = true;
			nativeConsoleMethod("warn")("tslog: runInContext() found no AsyncLocalStorage on this runtime — the function runs, but the context will NOT be attached to logs. On Cloudflare Workers enable the \"nodejs_als\" (or \"nodejs_compat\") compatibility flag and pass `contextStorage: new AsyncLocalStorage()` from \"node:async_hooks\".");
		}
		return store.run(ctx, fn);
	}
	/**
	* Return the fields of the currently active async context (set by an enclosing {@link runInContext}), or
	* `undefined` when there is none / the runtime has no `AsyncLocalStorage`. The otel preset can consume
	* this as its trace-context getter, e.g. `otelFormat({ getSpanContext: () => logger.getContext() })`.
	*/
	getContext() {
		return this._getAsyncContextStore().getStore();
	}
	/**
	* Register an additive custom log level (M2.14) at runtime: maps `name → id` for this logger so a
	* subsequent `log(id, name, ...)` emits the right `logLevelId`/`logLevelName` and a string `minLevel`
	* (e.g. `"NOTICE"`) resolves against it. The canonical seven names keep working; a name colliding with a
	* default level throws. Mutates this logger's resolved settings and returns `this` for chaining.
	*
	* Also installs a real level method named after the lower-cased level, so call sites stop
	* repeating the (id, name) pair — and returns `this` typed with that method.
	*
	* @example logger.addLevel("NOTICE", 3.5).notice("heads up");
	*/
	addLevel(name, id) {
		validateCustomLevel(name, id, this.settings.customLevels);
		this.settings.customLevels[name] = id;
		this.hasCustomLevels = true;
		this._installCustomLevelMethod(name, id);
		return this;
	}
	/**
	*  Attaches an external output sink (e.g. a log service, file system, database). Accepts a full
	*  {@link Transport} or a bare {@link TransportFn} (which is wrapped into a `Transport` with no flush).
	*
	* @param transport - the transport (or plain function) to attach.
	* @returns a detach function that removes this transport on first call (idempotent thereafter).
	*/
	attachTransport(transport) {
		return attachTransport(this.settings.attachedTransports, transport);
	}
	/**
	* Await every attached transport's `flush()` — and the runtime's default JSON sink (the Node entry
	* batches stdout writes) — so buffered output is written before the process exits. Transports
	* without a `flush` are skipped; a failing flush is isolated and never rejects this promise.
	*/
	async flush() {
		await Promise.all([flushAll(this.settings.attachedTransports), this._flushDefaultSink()]);
	}
	/** Flush the runtime's default JSON sink, isolating any failure (mirrors `flushAll`'s contract). */
	async _flushDefaultSink() {
		try {
			await this.runtime.flushJsonSink?.();
		} catch {}
	}
	/** The transports this logger owns (constructor-supplied or attached here; not inherited from a parent). */
	_ownedTransports() {
		const inherited = this.inheritedTransports;
		if (inherited == null) return this.settings.attachedTransports;
		return this.settings.attachedTransports.filter((transport) => !inherited.has(transport));
	}
	/**
	* Async disposer (`await using`): flushes every attached transport, then disposes the ones this logger
	* OWNS. Transports inherited from a parent are flushed but left alive — disposing a request-scoped
	* child must not terminate the root logger's sinks.
	*/
	async [Symbol.asyncDispose]() {
		await Promise.all([flushAll(this.settings.attachedTransports), this._flushDefaultSink()]);
		await disposeAll(this._ownedTransports());
	}
	/**
	* Sync disposer (`using`) — best-effort (E1). Triggers each attached transport's flush+dispose but, being
	* synchronous, cannot await them: a transport whose `flush`/`[Symbol.asyncDispose]` is async is kicked off
	* and left to settle on its own (the rejection is isolated and swallowed by `flushAll`). For guaranteed
	* draining of buffered/async transports prefer `await using` (the {@link Symbol.asyncDispose} path) or an
	* explicit `await logger.flush()`. Provided so a logger also works under synchronous `using` scopes.
	*/
	[Symbol.dispose]() {
		this._flushDefaultSink();
		flushAll(this.settings.attachedTransports).then(() => disposeAll(this._ownedTransports()));
	}
	/**
	*  Returns a child logger based on the current instance with inherited settings
	*
	* @param settings - Overwrite settings inherited from parent logger
	* @param logObj - Overwrite logObj for sub-logger
	*/
	/**
	* Alias for {@link getSubLogger} (E2) — matches the pino/bunyan/winston `child(...)` convention that
	* AI models and many ecosystems reach for by reflex. Same inheritance semantics (settings/levels/context
	* are inherited and merged); both methods are kept.
	*
	* @param settings - Overwrite settings inherited from parent logger
	* @param logObj - Overwrite logObj for sub-logger
	*/
	child(settings, logObj) {
		return this.getSubLogger(settings, logObj);
	}
	getSubLogger(settings, logObj) {
		const mergedCustomLevels = {
			...this.settings.customLevels,
			...settings?.customLevels
		};
		const subLoggerSettings = {
			...this.settings,
			...settings,
			minLevel: resolveLogLevelId(settings?.minLevel, mergedCustomLevels) ?? this.settings.minLevel,
			customLevels: mergedCustomLevels,
			pretty: {
				...this.settings.pretty,
				...settings?.pretty
			},
			json: {
				...this.settings.json,
				...settings?.json
			},
			mask: {
				...this.settings.mask,
				...settings?.mask
			},
			stack: {
				...this.settings.stack,
				...settings?.stack
			},
			meta: {
				...this.settings.meta,
				...settings?.meta
			},
			attachedTransports: [...this.settings.attachedTransports, ...settings?.attachedTransports ?? []],
			middleware: [...this.settings.middleware, ...settings?.middleware ?? []],
			parentNames: this.settings?.parentNames != null && this.settings?.name != null ? [...this.settings.parentNames, this.settings.name] : this.settings?.name != null ? [this.settings.name] : void 0,
			prefix: [...this.settings.prefix, ...settings?.prefix ?? []],
			bindings: this.rawBindings != null || settings?.bindings != null ? {
				...this.rawBindings,
				...settings?.bindings
			} : void 0,
			contextStorage: settings?.contextStorage ?? this.settings.contextStorage
		};
		const subLogger = new this.constructor(subLoggerSettings, logObj ?? this.logObj, this.runtime, this.callerFrame, this.features);
		if (settings?.contextStorage == null || settings.contextStorage === this.settings.contextStorage) subLogger.asyncContextBox = this.asyncContextBox;
		subLogger.inheritedTransports = new WeakSet(this.settings.attachedTransports);
		return subLogger;
	}
	_resolveLogArguments(args) {
		if (args.length === 1 && typeof args[0] === "function") {
			const candidate = args[0];
			if (candidate.length === 0) {
				const result = candidate();
				return Array.isArray(result) ? [...result] : [result];
			}
		}
		return args;
	}
	_addMetaToLogObj(logObj, logLevelId, logLevelName) {
		const meta = this.runtime.getMeta(logLevelId, logLevelName, this.callerFrame, !this.captureStackForMeta, this.settings.name, this.settings.parentNames, this.settings.stack.internalFramePatterns);
		const clock = this.settings.clock;
		if (clock != null) try {
			const stamped = clock();
			if (stamped instanceof Date && !Number.isNaN(stamped.getTime())) meta.date = stamped;
		} catch {}
		return {
			...logObj,
			[this.settings.meta.property]: meta
		};
	}
	_shouldCaptureStack() {
		const capture = this.settings.stack.capture;
		if (capture === "off") return false;
		if (capture === "full" || capture === "lazy") return true;
		if (this.settings.type === "json") return true;
		const template = this.settings.pretty.template ?? "";
		return /{{\s*(file(Name|Path|Line|PathWithLine|NameWithLine)|fullFilePath)\s*}}/.test(template);
	}
};
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/formatNumberAddZeros.js
function formatNumberAddZeros(value, digits = 2, addNumber = 0) {
	if (value != null && isNaN(value)) return "";
	value = value != null ? value + addNumber : value;
	return digits === 2 ? value == null ? "--" : value < 10 ? `0${value}` : value.toString() : value == null ? "---" : value < 10 ? `00${value}` : value < 100 ? `0${value}` : value.toString();
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/render/styles.js
/**
* The single style palette for tslog.
*
* This is the ONE place that knows how a named style token (e.g. "red", "bold", "bgWhiteBright")
* maps to both an ANSI escape pair (for terminals / colorized text output) and a CSS declaration
* (for the browser `%c` console-styling path).
*
* Historically this knowledge was split across two files:
*  - `src/prettyLogStyles.ts` held the ANSI `[open, close]` pairs.
*  - `src/BaseLogger.ts` embedded the CSS hex maps (`COLOR_TOKENS`/`BACKGROUND_TOKENS`) plus a
*    `styleTokenToCss` switch for the text modifiers.
*
* Both are merged here into a single token table. ANSI behavior is byte-for-byte identical to the
* old `prettyLogStyles` map (tests 9_pretty_Styles), and CSS output is identical to the old
* `styleTokenToCss` (tests 32_browser_css_styling).
*/
const COLOR_HEX = {
	black: "#000000",
	red: "#ef5350",
	green: "#66bb6a",
	yellow: "#fdd835",
	blue: "#42a5f5",
	magenta: "#ab47bc",
	cyan: "#26c6da",
	white: "#fafafa",
	blackBright: "#424242",
	redBright: "#ff7043",
	greenBright: "#81c784",
	yellowBright: "#ffe082",
	blueBright: "#64b5f6",
	magentaBright: "#ce93d8",
	cyanBright: "#4dd0e1",
	whiteBright: "#ffffff"
};
/**
* The authoritative token -> { ansi, css } table.
*
* Ordering and values mirror the legacy sources exactly:
*  - modifiers and (background) colors keep the same ANSI codes as `prettyLogStyles`.
*  - color/background CSS values reuse the same hex palette as the old `COLOR_TOKENS`/`BACKGROUND_TOKENS`.
*  - text-modifier CSS strings match the old `styleTokenToCss` switch verbatim.
*/
const STYLE_PALETTE = {
	reset: { ansi: [0, 0] },
	bold: {
		ansi: [1, 22],
		css: "font-weight: bold"
	},
	dim: {
		ansi: [2, 22],
		css: "opacity: 0.75"
	},
	italic: {
		ansi: [3, 23],
		css: "font-style: italic"
	},
	underline: {
		ansi: [4, 24],
		css: "text-decoration: underline"
	},
	overline: {
		ansi: [53, 55],
		css: "text-decoration: overline"
	},
	inverse: {
		ansi: [7, 27],
		css: "filter: invert(1)"
	},
	hidden: {
		ansi: [8, 28],
		css: "visibility: hidden"
	},
	strikethrough: {
		ansi: [9, 29],
		css: "text-decoration: line-through"
	},
	black: {
		ansi: [30, 39],
		css: `color: ${COLOR_HEX.black}`
	},
	red: {
		ansi: [31, 39],
		css: `color: ${COLOR_HEX.red}`
	},
	green: {
		ansi: [32, 39],
		css: `color: ${COLOR_HEX.green}`
	},
	yellow: {
		ansi: [33, 39],
		css: `color: ${COLOR_HEX.yellow}`
	},
	blue: {
		ansi: [34, 39],
		css: `color: ${COLOR_HEX.blue}`
	},
	magenta: {
		ansi: [35, 39],
		css: `color: ${COLOR_HEX.magenta}`
	},
	cyan: {
		ansi: [36, 39],
		css: `color: ${COLOR_HEX.cyan}`
	},
	white: { ansi: [37, 39] },
	blackBright: {
		ansi: [90, 39],
		css: `color: ${COLOR_HEX.blackBright}`
	},
	redBright: {
		ansi: [91, 39],
		css: `color: ${COLOR_HEX.redBright}`
	},
	greenBright: {
		ansi: [92, 39],
		css: `color: ${COLOR_HEX.greenBright}`
	},
	yellowBright: {
		ansi: [93, 39],
		css: `color: ${COLOR_HEX.yellowBright}`
	},
	blueBright: {
		ansi: [94, 39],
		css: `color: ${COLOR_HEX.blueBright}`
	},
	magentaBright: {
		ansi: [95, 39],
		css: `color: ${COLOR_HEX.magentaBright}`
	},
	cyanBright: {
		ansi: [96, 39],
		css: `color: ${COLOR_HEX.cyanBright}`
	},
	whiteBright: { ansi: [97, 39] },
	bgBlack: {
		ansi: [40, 49],
		css: `background-color: ${COLOR_HEX.black}`
	},
	bgRed: {
		ansi: [41, 49],
		css: `background-color: ${COLOR_HEX.red}`
	},
	bgGreen: {
		ansi: [42, 49],
		css: `background-color: ${COLOR_HEX.green}`
	},
	bgYellow: {
		ansi: [43, 49],
		css: `background-color: ${COLOR_HEX.yellow}`
	},
	bgBlue: {
		ansi: [44, 49],
		css: `background-color: ${COLOR_HEX.blue}`
	},
	bgMagenta: {
		ansi: [45, 49],
		css: `background-color: ${COLOR_HEX.magenta}`
	},
	bgCyan: {
		ansi: [46, 49],
		css: `background-color: ${COLOR_HEX.cyan}`
	},
	bgWhite: {
		ansi: [47, 49],
		css: `background-color: ${COLOR_HEX.white}`
	},
	bgBlackBright: {
		ansi: [100, 49],
		css: `background-color: ${COLOR_HEX.blackBright}`
	},
	bgRedBright: {
		ansi: [101, 49],
		css: `background-color: ${COLOR_HEX.redBright}`
	},
	bgGreenBright: {
		ansi: [102, 49],
		css: `background-color: ${COLOR_HEX.greenBright}`
	},
	bgYellowBright: {
		ansi: [103, 49],
		css: `background-color: ${COLOR_HEX.yellowBright}`
	},
	bgBlueBright: {
		ansi: [104, 49],
		css: `background-color: ${COLOR_HEX.blueBright}`
	},
	bgMagentaBright: {
		ansi: [105, 49],
		css: `background-color: ${COLOR_HEX.magentaBright}`
	},
	bgCyanBright: {
		ansi: [106, 49],
		css: `background-color: ${COLOR_HEX.cyanBright}`
	},
	bgWhiteBright: {
		ansi: [107, 49],
		css: `background-color: ${COLOR_HEX.whiteBright}`
	}
};
/**
* Returns the CSS declaration for a style token (e.g. `"color: #ef5350"`, `"font-weight: bold"`),
* or `undefined` if the token has no CSS mapping. Identical to the old `BaseLogger.styleTokenToCss`.
*/
function styleTokenToCss(token) {
	return STYLE_PALETTE[token]?.css;
}
/**
* Backwards-compatible ANSI palette consumed by `formatTemplate.ts` and the inspect polyfill.
*
* Shape: `{ [token: string]: [open, close] }`. This is a drop-in replacement for the previous
* `src/prettyLogStyles.ts` export — including the `reset` entry (`[0, 0]`) those modules rely on.
*/
const prettyLogStyles = Object.fromEntries(Object.entries(STYLE_PALETTE).map(([token, definition]) => [token, definition.ansi]));
/** Reverse lookup for {@link ansiToCssConsoleFormat}: SGR open code -> its CSS declaration + close code. */
const ANSI_OPEN_TO_CSS = new Map(Object.values(STYLE_PALETTE).filter((definition) => definition.css != null && definition.ansi[0] !== definition.ansi[1]).map((definition) => [definition.ansi[0], {
	css: definition.css,
	close: definition.ansi[1]
}]));
/**
* Convert an ANSI-styled string (as produced by `formatTemplate` from this palette) into a browser
* console format string with `%c` CSS segments.
*
* The browser `%c` path renders meta from its template directly, but pre-rendered blocks (the error
* template output) arrive already carrying ANSI escapes — which only Chromium's console interprets;
* Firefox and WebKit print them literally. This re-expresses those escapes as `%c` CSS, which all
* engines support. Only single-parameter SGR sequences are handled — the only form this palette emits.
*
* Literal `%` in the text is escaped as `%%` so user content can never consume a `%c` style argument.
*/
function ansiToCssConsoleFormat(input) {
	const parts = [];
	const styles = [];
	const active = /* @__PURE__ */ new Map();
	let currentCss = "";
	let pendingText = "";
	const flush = () => {
		if (pendingText.length === 0) return;
		const escaped = pendingText.replace(/%/g, "%%");
		if (currentCss.length > 0) {
			parts.push(`%c${escaped}%c`);
			styles.push(currentCss, "");
		} else parts.push(escaped);
		pendingText = "";
	};
	const sgrRegex = /\u001b\[(\d+)m/g;
	let lastIndex = 0;
	let match;
	while ((match = sgrRegex.exec(input)) != null) {
		pendingText += input.slice(lastIndex, match.index);
		lastIndex = sgrRegex.lastIndex;
		const code = Number(match[1]);
		const open = ANSI_OPEN_TO_CSS.get(code);
		if (open != null) active.set(code, open);
		else if (code === 0) active.clear();
		else for (const [openCode, entry] of active) if (entry.close === code) active.delete(openCode);
		const nextCss = [...new Set([...active.values()].map((entry) => entry.css))].join("; ");
		if (nextCss !== currentCss) {
			flush();
			currentCss = nextCss;
		}
	}
	pendingText += input.slice(lastIndex);
	flush();
	return {
		text: parts.join(""),
		styles
	};
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/formatTemplate.js
function formatTemplate(settings, template, values, hideUnsetPlaceholder = false) {
	const templateString = String(template);
	const ansiColorWrap = (placeholderValue, code) => `\u001b[${code[0]}m${placeholderValue}\u001b[${code[1]}m`;
	const styleWrap = (value, style) => {
		if (style != null && typeof style === "string") return ansiColorWrap(value, prettyLogStyles[style]);
		else if (style != null && Array.isArray(style)) return style.reduce((prevValue, thisStyle) => styleWrap(prevValue, thisStyle), value);
		else if (style != null && style[value.trim()] != null) return styleWrap(value, style[value.trim()]);
		else if (style != null && style["*"] != null) return styleWrap(value, style["*"]);
		else return value;
	};
	const defaultStyle = null;
	return templateString.replace(/{{(.+?)}}/g, (_, placeholder) => {
		const value = values[placeholder] != null ? String(values[placeholder]) : hideUnsetPlaceholder ? "" : _;
		return settings.pretty.style ? styleWrap(value, settings.pretty.styles?.[placeholder] ?? defaultStyle) + ansiColorWrap("", prettyLogStyles.reset) : value;
	});
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/internal/metaFormatting.js
function buildPrettyMeta(settings, meta) {
	if (meta == null) return {
		text: "",
		template: settings.pretty.template,
		placeholders: {}
	};
	let template = settings.pretty.template;
	const placeholderValues = {};
	const rawDate = meta.date;
	const date = rawDate instanceof Date && !Number.isNaN(rawDate.getTime()) ? rawDate : void 0;
	let dateFallback;
	if (rawDate != null && date === void 0) {
		if (rawDate instanceof Date) dateFallback = "Invalid Date";
		else try {
			dateFallback = String(rawDate);
		} catch {
			dateFallback = "Invalid Date";
		}
	}
	if (template.includes("{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}")) template = template.replace("{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}", "{{dateIsoStr}}");
	else if (date == null) {
		placeholderValues.yyyy = "----";
		placeholderValues.mm = "--";
		placeholderValues.dd = "--";
		placeholderValues.hh = "--";
		placeholderValues.MM = "--";
		placeholderValues.ss = "--";
		placeholderValues.ms = "---";
	} else if (settings.pretty.timeZone === "UTC") {
		placeholderValues.yyyy = date.getUTCFullYear();
		placeholderValues.mm = formatNumberAddZeros(date.getUTCMonth(), 2, 1);
		placeholderValues.dd = formatNumberAddZeros(date.getUTCDate(), 2);
		placeholderValues.hh = formatNumberAddZeros(date.getUTCHours(), 2);
		placeholderValues.MM = formatNumberAddZeros(date.getUTCMinutes(), 2);
		placeholderValues.ss = formatNumberAddZeros(date.getUTCSeconds(), 2);
		placeholderValues.ms = formatNumberAddZeros(date.getUTCMilliseconds(), 3);
	} else {
		placeholderValues.yyyy = date.getFullYear();
		placeholderValues.mm = formatNumberAddZeros(date.getMonth(), 2, 1);
		placeholderValues.dd = formatNumberAddZeros(date.getDate(), 2);
		placeholderValues.hh = formatNumberAddZeros(date.getHours(), 2);
		placeholderValues.MM = formatNumberAddZeros(date.getMinutes(), 2);
		placeholderValues.ss = formatNumberAddZeros(date.getSeconds(), 2);
		placeholderValues.ms = formatNumberAddZeros(date.getMilliseconds(), 3);
	}
	const isUtc = settings.pretty.timeZone === "UTC";
	const dateInSettingsTimeZone = isUtc ? date : date != null ? /* @__PURE__ */ new Date(date.getTime() - date.getTimezoneOffset() * 6e4) : void 0;
	placeholderValues.rawIsoStr = dateInSettingsTimeZone == null ? dateFallback ?? "" : isUtc ? dateInSettingsTimeZone.toISOString() : localIsoString(dateInSettingsTimeZone, date);
	placeholderValues.dateIsoStr = dateInSettingsTimeZone?.toISOString().replace("T", " ").replace("Z", "") ?? dateFallback ?? "";
	placeholderValues.logLevelName = meta.logLevelName;
	placeholderValues.fileNameWithLine = meta.path?.fileNameWithLine ?? "";
	placeholderValues.filePathWithLine = meta.path?.filePathWithLine ?? "";
	placeholderValues.fullFilePath = meta.path?.fullFilePath ?? "";
	let parentNamesString = settings.parentNames?.join(settings.pretty.errorParentNamesSeparator);
	parentNamesString = parentNamesString != null && meta.name != null ? parentNamesString + settings.pretty.errorParentNamesSeparator : void 0;
	/* v8 ignore next -- defensive: parentNamesString is only set when meta.name is also set (see line above), so the meta.name ?? "" fallback is unreachable */
	const combinedName = meta.name != null || parentNamesString != null ? `${parentNamesString ?? ""}${meta.name ?? ""}` : "";
	placeholderValues.name = combinedName;
	placeholderValues.nameWithDelimiterPrefix = combinedName.length > 0 ? settings.pretty.errorLoggerNameDelimiter + combinedName : "";
	placeholderValues.nameWithDelimiterSuffix = combinedName.length > 0 ? combinedName + settings.pretty.errorLoggerNameDelimiter : "";
	return {
		text: formatTemplate(settings, template, placeholderValues),
		template,
		placeholders: placeholderValues
	};
}
/**
* Build an ISO 8601 string for a local timestamp with the real timezone offset suffix (e.g. 2023-01-19T13:05:37.263+02:00).
* `shifted` carries the local wall-clock digits as if they were UTC; `original` provides the actual offset.
*/
function localIsoString(shifted, original) {
	const base = shifted.toISOString().replace("Z", "");
	const offsetMinutes = -original.getTimezoneOffset();
	const sign = offsetMinutes >= 0 ? "+" : "-";
	const abs = Math.abs(offsetMinutes);
	return `${base}${sign}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/core/masking.js
/**
* The masking engine (M1.5–M1.7, M2.3). Owns the recursive clone-and-mask pass that redacts the values of
* configured keys (`mask.keys`), substrings matching `mask.regex`, and leaves whose dotted path
* matches `mask.paths` (`*` = any one segment), plus the normalized mask-keys and compiled-paths caches.
*
* It is constructed with the *live* {@link ISettings} object (read on every call, never snapshotted, so
* post-construction mutations of `mask.keys` / `mask.placeholder` take effect) and the runtime's
* {@link MaskingPredicates}, keeping the core free of runtime imports.
*
* Behavior preserved from the v4 monolith: Buffer pass-through, Date/URL cloning, the `$`-escape fix
* for the placeholder, numeric mask-key normalization, and getter-only robustness (a throwing getter
* yields `null` rather than aborting the mask). v5 improvements per contract: a zero-clone fast path,
* a memoizing `WeakMap` cycle/shared-reference guard (a repeat visit returns the same MASKED clone,
* never an unmasked copy), masking inside `Map`/`Set` contents and inside Errors (see {@link maskError}),
* mask regexes always applied globally, `Set.has` key matching, and a single placeholder `$`-escape
* per invocation.
*/
var MaskingEngine = class {
	settings;
	predicates;
	maskKeysCache;
	maskPathsCache;
	/** Per-source-RegExp cache of the global-flagged variant used for string masking. */
	globalRegexCache = /* @__PURE__ */ new WeakMap();
	constructor(settings, predicates) {
		this.settings = settings;
		this.predicates = predicates;
	}
	/**
	* Normalize and mask every argument in `args`.
	*
	* Fast path (M1.5): when there are no mask keys AND no mask regexes AND no `mask.paths`, nothing can be
	* *masked*, so we skip the deep masking clone entirely. Only a shallow, per-argument check expands a
	* TOP-LEVEL `URL` argument into a plain object (`logger.info(url)` is the common case and a bare `URL`'s
	* own properties are non-enumerable) — the old deep normalization walk cost every log a full traversal
	* for a feature almost no log used. Nested URLs render fine without it: `JSON.stringify` emits the href
	* via `URL#toJSON`, and Node's `util.inspect` prints URLs natively in pretty mode.
	*/
	mask(args) {
		const hasKeys = this.settings.mask.keys != null && this.settings.mask.keys.length > 0;
		const hasRegex = this.settings.mask.regex != null && this.settings.mask.regex.length > 0;
		const compiledPaths = this.getMaskPaths();
		const hasPaths = compiledPaths.length > 0;
		if (!hasKeys && !hasRegex && !hasPaths) {
			for (let i = 0; i < args.length; i++) if (args[i] instanceof URL) return args.map((arg) => arg instanceof URL ? urlToObject(arg) : arg);
			return args;
		}
		const ctx = this.createContext(compiledPaths);
		return args?.map((arg) => this.recurse(arg instanceof URL ? urlToObject(arg) : arg, ctx));
	}
	/**
	* Return the normalized (stringified, lower-cased when case-insensitive) mask keys, cached by identity
	* and signature of `settings.mask.keys`. The same array reference is returned across calls while
	* the source is unchanged, so callers may rely on a stable result.
	*/
	getMaskKeys() {
		const maskKeys = this.settings.mask.keys ?? [];
		const signature = maskKeys.map(String).join("|");
		const caseInsensitive = this.settings.mask.caseInsensitive === true;
		if (this.maskKeysCache?.source === maskKeys && this.maskKeysCache.caseInsensitive === caseInsensitive && this.maskKeysCache.signature === signature) return this.maskKeysCache.normalized;
		const normalized = caseInsensitive ? maskKeys.map((key) => typeof key === "string" ? key.toLowerCase() : String(key).toLowerCase()) : maskKeys.map((key) => typeof key === "string" ? key : String(key));
		this.maskKeysCache = {
			source: maskKeys,
			caseInsensitive,
			normalized,
			signature
		};
		return normalized;
	}
	/**
	* Recursively clone `source`, masking the values of any property whose (optionally lower-cased) name is
	* in `keys`, applying `mask.regex` to string values, and censoring any leaf whose dotted path matches
	* `settings.mask.paths`.
	*
	* Mirrors the v4 monolith signature so existing tests can call it directly; `keys` may be the raw,
	* already-normalized array from {@link getMaskKeys}. The cycle guard is a `WeakSet` (callers that pass a
	* legacy `seen` array are honored for source compatibility — its current members seed the guard).
	*/
	recursiveCloneAndMaskValuesOfKeys(source, keys, seen) {
		const paths = this.getMaskPaths();
		const ctx = {
			keySet: this.buildKeySet(keys),
			escapedPlaceholder: this.escapePlaceholder(),
			seen: /* @__PURE__ */ new WeakMap(),
			inProgress: paths.length > 0 ? /* @__PURE__ */ new WeakSet() : void 0,
			inertClones: paths.length > 0 ? /* @__PURE__ */ new WeakSet() : void 0,
			legacySeen: this.toLegacySeen(seen),
			paths,
			maxPathDepth: maxSegments(paths),
			regexes: this.normalizedRegexes(),
			segmentStack: [],
			pathsSuspended: 0
		};
		return this.recurse(source, ctx);
	}
	/** Build the lookup `Set` for O(1) `has` checks. Keys are already stringified/lower-cased by {@link getMaskKeys}. */
	buildKeySet(keys) {
		const set = /* @__PURE__ */ new Set();
		for (const key of keys) set.add(typeof key === "string" ? key : String(key));
		return set;
	}
	/**
	* Normalize the legacy v4-compat `seen` parameter into a `WeakSet` of pre-visited objects. Members
	* short-circuit to a shallow copy on encounter (the historical contract for caller-seeded guards);
	* the engine's own cycle/shared-reference handling uses the memoizing `MaskContext.seen` map instead.
	*/
	toLegacySeen(seen) {
		if (seen instanceof WeakSet) return seen;
		if (!Array.isArray(seen) || seen.length === 0) return;
		const guard = /* @__PURE__ */ new WeakSet();
		for (const entry of seen) if (entry !== null && typeof entry === "object") guard.add(entry);
		return guard;
	}
	/**
	* Escape every `$` in the placeholder so a placeholder like `"$1"`, `"$&"`, etc. is inserted literally by
	* `String.replace` instead of being interpreted as a substitution pattern (which could leak the secret).
	* A nullish placeholder is treated as an empty replacement. Computed once per mask invocation.
	*/
	escapePlaceholder() {
		return (this.settings.mask.placeholder || "").replace(/\$/g, "$$$$");
	}
	/** Assemble a fresh {@link MaskContext} for a top-level {@link mask} pass. */
	createContext(compiledPaths) {
		const maskKeys = this.getMaskKeys();
		return {
			keySet: this.buildKeySet(maskKeys),
			escapedPlaceholder: this.escapePlaceholder(),
			seen: /* @__PURE__ */ new WeakMap(),
			inProgress: compiledPaths.length > 0 ? /* @__PURE__ */ new WeakSet() : void 0,
			inertClones: compiledPaths.length > 0 ? /* @__PURE__ */ new WeakSet() : void 0,
			paths: compiledPaths,
			maxPathDepth: maxSegments(compiledPaths),
			regexes: this.normalizedRegexes(),
			segmentStack: [],
			pathsSuspended: 0
		};
	}
	/** The mask regexes normalized to global matching, computed once per mask invocation. */
	normalizedRegexes() {
		const regexes = this.settings.mask.regex ?? [];
		if (regexes.length === 0) return regexes;
		return regexes.map((regEx) => this.toGlobalRegex(regEx));
	}
	/**
	* Whether the current position is "path-inert": no `mask.paths` pattern can match anywhere at or below
	* it. Matching requires the segment stack length to EQUAL a compiled path's length, so once the stack
	* is at least as deep as the longest path — or while inside Map/Set contents (pathsSuspended) — path
	* censoring can no longer occur and clones become position-independent (safe to memo-reuse).
	*/
	isPathInert(ctx) {
		return ctx.pathsSuspended > 0 || ctx.segmentStack.length >= ctx.maxPathDepth;
	}
	/**
	* Return the compiled {@link CompiledPath} matchers for `settings.mask.paths`, cached by identity and
	* signature of the source array (mirrors the mask-keys cache so an in-place mutation still invalidates).
	* Empty/omitted paths yield an empty array, preserving the normalize-only fast path.
	*/
	getMaskPaths() {
		/* v8 ignore next -- normalized settings always provide the mask group with a paths array; the fallbacks guard direct engine construction */
		const paths = this.settings.mask?.paths ?? [];
		if (paths.length === 0) return [];
		const signature = paths.join("|");
		if (this.maskPathsCache?.source === paths && this.maskPathsCache.signature === signature) return this.maskPathsCache.compiled;
		const compiled = [];
		for (const path of paths) {
			if (typeof path !== "string" || path.length === 0) continue;
			compiled.push({ segments: path.split(".") });
		}
		this.maskPathsCache = {
			source: paths,
			signature,
			compiled
		};
		return compiled;
	}
	/**
	* True when the current {@link MaskContext.segmentStack} (the dotted path to the node being visited)
	* matches at least one compiled path. A `"*"` segment matches any single segment; matching requires
	* the same number of segments (each compiled path targets a leaf at a fixed depth).
	*/
	matchesPath(ctx) {
		if (ctx.pathsSuspended > 0) return false;
		const stack = ctx.segmentStack;
		for (const compiled of ctx.paths) {
			const segments = compiled.segments;
			if (segments.length !== stack.length) continue;
			let matched = true;
			for (let i = 0; i < segments.length; i++) {
				const pattern = segments[i];
				if (pattern !== "*" && pattern !== stack[i]) {
					matched = false;
					break;
				}
			}
			if (matched) return true;
		}
		return false;
	}
	/**
	* Resolve the replacement for a path-matched value per `settings.mask.censor`:
	* a function result, the `"hash"` correlation token, a literal string, or the mask placeholder when
	* censor is omitted. `"remove"` is handled by the caller (the property is dropped) and never reaches here.
	*/
	censorValue(value, ctx) {
		const censor = this.settings.mask?.censor;
		if (typeof censor === "function") return censor(value, ctx.segmentStack.join("."));
		if (censor === "hash") return this.hashToken(value);
		if (typeof censor === "string") return censor;
		return this.settings.mask.placeholder;
	}
	/**
	* Build the SHORT, stable, **non-cryptographic** correlation token for a matched value (M4.3):
	* `"[<label>:xxxxxxxx]"` where `xxxxxxxx` is the FNV-1a hash of the stringified value, hex-encoded and
	* zero-padded to 8 chars. Same input → same token (correlate occurrences without exposing the secret);
	* different inputs almost always differ. Fully synchronous and zero-dep — no Web Crypto on the hot path.
	* The label is `settings.mask.hashLabel` (default `"hash"`). For correlation only; never rely on it for security.
	*/
	hashToken(value) {
		return `[${this.settings.mask.hashLabel || "hash"}:${fnv1aHex(stringifyForHash(value))}]`;
	}
	recurse(source, ctx) {
		if (source !== null && typeof source === "object") {
			if (ctx.legacySeen?.has(source)) return { ...source };
			const memoized = ctx.seen.get(source);
			if (memoized !== void 0) {
				if (ctx.inProgress == null || ctx.inProgress.has(source)) return memoized;
				if (typeof memoized === "object" && memoized !== null && ctx.inertClones?.has(memoized) && this.isPathInert(ctx)) return memoized;
			}
		}
		if (this.predicates.isBuffer(source)) return source;
		else if (this.predicates.isError(source)) return this.maskError(source, ctx);
		else if (source instanceof Map) {
			const maskedMap = /* @__PURE__ */ new Map();
			ctx.seen.set(source, maskedMap);
			ctx.inertClones?.add(maskedMap);
			ctx.inProgress?.add(source);
			ctx.pathsSuspended++;
			try {
				const caseInsensitive = this.settings.mask.caseInsensitive === true;
				for (const [key, value] of source) {
					const lookupKey = typeof key === "string" ? caseInsensitive ? key.toLowerCase() : key : typeof key === "number" || typeof key === "bigint" ? String(key) : void 0;
					if (lookupKey != null && ctx.keySet.has(lookupKey)) maskedMap.set(key, this.settings.mask.censor === "hash" ? this.hashToken(value) : this.settings.mask.placeholder);
					else maskedMap.set(this.recurse(key, ctx), this.recurse(value, ctx));
				}
			} finally {
				ctx.pathsSuspended--;
				ctx.inProgress?.delete(source);
			}
			return maskedMap;
		} else if (source instanceof Set) {
			const maskedSet = /* @__PURE__ */ new Set();
			ctx.seen.set(source, maskedSet);
			ctx.inertClones?.add(maskedSet);
			ctx.inProgress?.add(source);
			ctx.pathsSuspended++;
			try {
				for (const item of source) maskedSet.add(this.recurse(item, ctx));
			} finally {
				ctx.pathsSuspended--;
				ctx.inProgress?.delete(source);
			}
			return maskedSet;
		} else if (Array.isArray(source)) {
			const maskedArray = new Array(source.length);
			ctx.seen.set(source, maskedArray);
			if (ctx.inertClones != null && this.isPathInert(ctx)) ctx.inertClones.add(maskedArray);
			ctx.inProgress?.add(source);
			const hasPaths = ctx.paths.length > 0;
			try {
				for (let index = 0; index < source.length; index++) {
					if (!(index in source)) continue;
					const item = source[index];
					if (!hasPaths) {
						maskedArray[index] = this.recurse(item, ctx);
						continue;
					}
					ctx.segmentStack.push(String(index));
					try {
						maskedArray[index] = this.matchesPath(ctx) ? this.censorValue(item, ctx) : this.recurse(item, ctx);
					} finally {
						ctx.segmentStack.pop();
					}
				}
			} finally {
				ctx.inProgress?.delete(source);
			}
			return maskedArray;
		} else if (source instanceof Date) return new Date(source.getTime());
		else if (source instanceof URL) return source;
		else if (source !== null && typeof source === "object") {
			const caseInsensitive = this.settings.mask.caseInsensitive === true;
			const hasPaths = ctx.paths.length > 0;
			const removeOnPath = this.settings.mask.censor === "remove";
			const baseObject = Object.create(Object.getPrototypeOf(source));
			ctx.seen.set(source, baseObject);
			if (ctx.inertClones != null && this.isPathInert(ctx)) ctx.inertClones.add(baseObject);
			ctx.inProgress?.add(source);
			try {
				return Object.getOwnPropertyNames(source).reduce((o, prop) => {
					const lookupKey = !caseInsensitive ? prop : typeof prop === "string" ? prop.toLowerCase() : String(prop).toLowerCase();
					if (ctx.keySet.has(lookupKey)) {
						if (this.settings.mask.censor === "hash") {
							let matchedValue;
							try {
								matchedValue = source[prop];
							} catch {
								matchedValue = void 0;
							}
							o[prop] = this.hashToken(matchedValue);
						} else o[prop] = this.settings.mask.placeholder;
						return o;
					}
					if (hasPaths) {
						ctx.segmentStack.push(prop);
						try {
							if (this.matchesPath(ctx)) {
								if (!removeOnPath) {
									let matchedValue;
									try {
										matchedValue = source[prop];
									} catch {
										matchedValue = void 0;
									}
									o[prop] = this.censorValue(matchedValue, ctx);
								}
								return o;
							}
							o[prop] = this.recurseProperty(source, prop, ctx);
						} finally {
							ctx.segmentStack.pop();
						}
						return o;
					}
					o[prop] = this.recurseProperty(source, prop, ctx);
					return o;
				}, baseObject);
			} finally {
				ctx.inProgress?.delete(source);
			}
		} else {
			if (typeof source === "string") return this.maskString(source, ctx);
			return source;
		}
	}
	/** Replace every match of every mask regex in a string. The regexes are already global, see toGlobalRegex. */
	maskString(value, ctx) {
		let masked = value;
		for (const regEx of ctx.regexes) masked = masked.replace(regEx, ctx.escapedPlaceholder);
		return masked;
	}
	/**
	* Return a variant of `regEx` guaranteed to match globally. `String.replace` with a non-global regex
	* replaces only the FIRST occurrence — silently leaking every later secret in the same string — and a
	* sticky (`y`) regex masks nothing unless it matches at index 0. Normalized variants are cached per
	* source RegExp, so live mutations of `mask.regex` still take effect and the hot path stays a lookup.
	*/
	toGlobalRegex(regEx) {
		if (regEx.global && !regEx.sticky) return regEx;
		let normalized = this.globalRegexCache.get(regEx);
		if (normalized == null) {
			normalized = new RegExp(regEx.source, `${regEx.flags.replace(/[gy]/g, "")}g`);
			this.globalRegexCache.set(regEx, normalized);
		}
		return normalized;
	}
	/** Read and recurse into a single own property, treating a throwing getter/trap as `null` (v4 behavior). */
	recurseProperty(source, prop, ctx) {
		try {
			return this.recurse(source[prop], ctx);
		} catch {
			return null;
		}
	}
	/**
	* Clone an Error and mask the clone, so a secret in the message, in a property assigned to the error or in
	* the `cause` chain is redacted like in any other argument: in the JSON line, in the pretty error block and
	* in the `nativeError` that transports receive.
	*
	* A real Error is cloned as `new Error()` with its prototype swapped for the source's. That keeps
	* `instanceof`, the `[object Error]` tag and `isNativeError` working downstream without running the
	* subclass constructor, which may need arguments. An error-like object (anything else the runtime
	* predicate accepts) is cloned as a plain object with the same prototype, so it still prints and
	* serializes as an object. Every property is read once, guarded, and defined fresh on the clone, so
	* read-only or getter-only properties cannot throw and the caller's error is never written to.
	*
	* `mask.keys` does not apply to `name`, `message` and `stack`: `keys: ["name"]` is a normal PII setting
	* and must not blank every error. `mask.regex` still masks their text and `mask.paths` can target them.
	* All other own properties (`code`, `cause`, the `errors` of an AggregateError, ...) are masked like the
	* properties of a plain object, which covers the whole `cause` chain.
	*/
	maskError(source, ctx) {
		const prototype = Object.getPrototypeOf(source);
		const clone = source instanceof Error || Object.prototype.toString.call(source) === "[object Error]" ? Object.setPrototypeOf(Object.defineProperty(/* @__PURE__ */ new Error(), "stack", {
			value: void 0,
			writable: true,
			configurable: true
		}), prototype) : Object.create(prototype);
		ctx.seen.set(source, clone);
		if (ctx.inertClones != null && this.isPathInert(ctx)) ctx.inertClones.add(clone);
		ctx.inProgress?.add(source);
		try {
			const caseInsensitive = this.settings.mask.caseInsensitive === true;
			const hasPaths = ctx.paths.length > 0;
			const props = /* @__PURE__ */ new Set([...Object.getOwnPropertyNames(source), "stack"]);
			for (const prop of ["name", "message"]) if (!props.has(prop) && throwsOnRead(clone, prop)) props.add(prop);
			for (const prop of props) {
				const builtIn = prop === "name" || prop === "message" || prop === "stack";
				const descriptor = Object.getOwnPropertyDescriptor(source, prop);
				let masked;
				let removed = false;
				if (!builtIn && ctx.keySet.has(caseInsensitive ? prop.toLowerCase() : prop)) masked = this.settings.mask.censor === "hash" ? this.hashToken(safeRead(source, prop)) : this.settings.mask.placeholder;
				else {
					if (hasPaths) ctx.segmentStack.push(prop);
					try {
						if (hasPaths && this.matchesPath(ctx)) {
							removed = this.settings.mask.censor === "remove";
							masked = removed ? void 0 : this.censorValue(safeRead(source, prop), ctx);
						} else if (prop === "stack") {
							const stack = safeRead(source, "stack");
							masked = typeof stack === "string" ? this.maskStackHeader(stack, safeRead(source, "message"), ctx) : stack;
						} else masked = this.recurseProperty(source, prop, ctx);
					} finally {
						if (hasPaths) ctx.segmentStack.pop();
					}
				}
				if (removed && prop !== "stack") continue;
				Object.defineProperty(clone, prop, {
					value: masked,
					enumerable: descriptor?.enumerable === true,
					writable: true,
					configurable: true
				});
			}
		} finally {
			ctx.inProgress?.delete(source);
		}
		return clone;
	}
	/**
	* Mask the header of a V8-style stack with `mask.regex` and leave the frames alone. Node, Bun, Deno,
	* Chromium and Hermes start the stack with "<name>: <message>" and follow with "    at ..." frame lines,
	* so the header repeats whatever secret the message had. The frames are skipped because a token or digit
	* pattern would also hit chunk hashes and `line:col` positions. Firefox and Safari stacks have no header,
	* only frames, so they come back unchanged.
	*/
	maskStackHeader(stack, message, ctx) {
		let headerEnd = stack.indexOf("\n    at ");
		if (typeof message === "string" && message.length > 0) {
			const messageStart = stack.indexOf(message);
			const firstLineEnd = stack.indexOf("\n");
			if (messageStart !== -1 && (firstLineEnd === -1 || messageStart < firstLineEnd)) {
				const framesStart = stack.indexOf("\n    at ", messageStart + message.length);
				headerEnd = framesStart === -1 ? stack.length : framesStart;
			}
		}
		if (headerEnd === -1) return stack;
		return this.maskString(stack.slice(0, headerEnd), ctx) + stack.slice(headerEnd);
	}
};
/** Read `source[prop]` without throwing. A getter or Proxy trap that throws yields `undefined`. */
function safeRead(source, prop) {
	try {
		return source[prop];
	} catch {
		return;
	}
}
/** Whether reading `target[prop]` throws, as a getter does when it needs internal state the target lacks. */
function throwsOnRead(target, prop) {
	try {
		Reflect.get(target, prop);
		return false;
	} catch {
		return true;
	}
}
/** The longest compiled path's segment count — the depth horizon below which paths can no longer match. */
function maxSegments(paths) {
	let max = 0;
	for (const compiled of paths) if (compiled.segments.length > max) max = compiled.segments.length;
	return max;
}
/** FNV-1a 32-bit offset basis. */
const FNV_OFFSET_BASIS = 2166136261;
/** FNV-1a 32-bit prime. */
const FNV_PRIME = 16777619;
/**
* Stringify an arbitrary matched value into the stable input for {@link fnv1aHex}. Primitives map to their
* `String(...)` form (with `null`/`undefined` distinguished); objects use a circular-safe `JSON.stringify`
* and fall back to `String(...)` if that throws. Deterministic so the same logical value always hashes the
* same way (correlation), without depending on object identity.
*/
function stringifyForHash(value) {
	if (value === null) return "null";
	if (value === void 0) return "undefined";
	const type = typeof value;
	if (type === "string") return value;
	if (type === "number" || type === "boolean" || type === "bigint") return String(value);
	try {
		const seen = /* @__PURE__ */ new WeakSet();
		return JSON.stringify(value, (_key, val) => {
			if (val !== null && typeof val === "object") {
				if (seen.has(val)) return "[Circular]";
				seen.add(val);
			}
			return typeof val === "bigint" ? String(val) : val;
		}) ?? String(value);
	} catch {
		return String(value);
	}
}
/**
* Compute the FNV-1a 32-bit hash of `input` and return it as a zero-padded 8-char lowercase hex string.
* Synchronous, allocation-light, and non-cryptographic — used only to build a stable correlation token.
*/
function fnv1aHex(input) {
	let hash = FNV_OFFSET_BASIS;
	for (let i = 0; i < input.length; i++) {
		hash ^= input.charCodeAt(i);
		hash = Math.imul(hash, FNV_PRIME);
	}
	return (hash >>> 0).toString(16).padStart(8, "0");
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/core/features.full.js
/**
* The FULL {@link CoreFeatures} composition — masking, the precompiled JSON line renderer, settings
* validation, and the pretty meta builder. Injected by every standard entry (node/browser/universal),
* so `import { Logger } from "tslog"` behaves exactly as before the seam existed. Size-sensitive
* entries (`tslog/slim`) compose their own reduced set instead of importing this module.
*/
const fullCoreFeatures = {
	createMaskingEngine(settings, deps) {
		return new MaskingEngine(settings, deps);
	},
	renderJson(record, settings) {
		return renderJson(record, settings);
	},
	validateSettings(settings) {
		validateSettingsParam(settings);
	},
	buildPrettyMetaText(settings, meta) {
		return buildPrettyMeta(settings, meta).text;
	}
};
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/core/fromEnv.js
/**
* Build an {@link ISettingsParam} from the environment (E3): reads `TSLOG_LEVEL` → `minLevel`,
* `TSLOG_TYPE` → `type` (only the three valid values are accepted; anything else is ignored), and
* `TSLOG_NAME` → `name`. `NO_COLOR`/`FORCE_COLOR` are already honored downstream by `normalizeSettings`.
* The returned object is then shallow-merged under caller `overrides` by {@link Logger.fromEnv}.
*
* Exported so the per-entry `Logger.fromEnv` statics share one env-reading implementation.
*/
function settingsFromEnv(overrides) {
	const fromEnv = {};
	const level = safeEnvGet("TSLOG_LEVEL");
	if (level != null && level !== "") {
		const numeric = Number(level);
		fromEnv.minLevel = Number.isNaN(numeric) ? level : numeric;
	}
	const type = safeEnvGet("TSLOG_TYPE");
	if (type === "json" || type === "pretty" || type === "hidden") fromEnv.type = type;
	const name = safeEnvGet("TSLOG_NAME");
	if (name != null && name !== "") fromEnv.name = name;
	return {
		...fromEnv,
		...overrides
	};
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/core/meta.js
/**
* Install a lazy, self-caching `path` getter on `meta` (M1.2).
*
* The getter parses `error`'s frames on first read (via `resolveCallerStackFrame`) and then replaces
* itself with the resolved value so subsequent reads are free (memoized). The property stays
* `enumerable` and `configurable` so `JSON.stringify` and object spreads still observe `path`, exactly
* like the eager value the monolith produced.
*
* This is the single implementation the providers call so all runtimes share lazy semantics.
*/
function defineLazyPath(meta, error, callerFrame, internalFramePatterns, deps) {
	Object.defineProperty(meta, "path", {
		configurable: true,
		enumerable: true,
		get() {
			const resolved = deps.resolveCallerStackFrame(error, callerFrame, internalFramePatterns);
			Object.defineProperty(meta, "path", {
				configurable: true,
				enumerable: true,
				writable: true,
				value: resolved
			});
			return resolved;
		}
	});
}
/**
* Build the per-log {@link IMeta} block: the logger's static runtime fields (runtime, version,
* hostname/browser) plus the per-log dynamic fields (name, parentNames, date, level), and — when stack
* capture is on — a lazy `path` getter.
*
* Field order matches the monolith's `Object.assign({}, staticMeta, { name, parentNames, date,
* logLevelId, logLevelName })` with `path` appended last, so spreads and `JSON.stringify` produce the
* same key ordering. When `hideLogPosition` is true, capture is off and `path` is left undefined (no
* getter, no own key) — identical to the monolith leaving `path: undefined`.
*
* @param staticMeta - the logger's static runtime meta (built once per provider via `createRuntimeMeta`).
* @param callerFrame - manual stack-frame index, or `NaN` to auto-detect the first external frame.
* @param hideLogPosition - when true, skip stack capture entirely so `path` stays undefined.
* @param internalFramePatterns - extra RegExp patterns (e.g. from a wrapper logger) to treat as
*   internal during auto-detection so the reported position lands on the wrapper's caller.
*/
function buildMeta(staticMeta, logLevelId, logLevelName, callerFrame, hideLogPosition, name, parentNames, internalFramePatterns, deps) {
	const meta = Object.assign({}, staticMeta, {
		date: /* @__PURE__ */ new Date(),
		logLevelId,
		logLevelName
	});
	if (name !== void 0) meta.name = name;
	if (parentNames !== void 0) meta.parentNames = parentNames;
	if (hideLogPosition) return meta;
	defineLazyPath(meta, /* @__PURE__ */ new Error(), callerFrame, internalFramePatterns, deps);
	return meta;
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/internal/jsonStringifyRecursive.js
function jsonStringifyRecursive(obj) {
	const cache = /* @__PURE__ */ new Set();
	return JSON.stringify(obj, (_key, value) => {
		if (typeof value === "object" && value !== null) {
			if (cache.has(value)) return "[Circular]";
			cache.add(value);
		}
		if (typeof value === "bigint") return `${value}`;
		if (typeof value === "undefined") return "[undefined]";
		return value;
	});
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/env/shared.js
/** Whether the detected runtime should expose a host name (server-side runtimes only). */
function shouldCaptureHostname(name) {
	return name === "node" || name === "deno" || name === "bun";
}
/** Whether the detected runtime should expose a runtime version string (server-side runtimes only). */
function shouldCaptureRuntimeVersion(name) {
	return name === "node" || name === "deno" || name === "bun";
}
/**
* Probe the global scope and classify the current runtime. Order matters: browser first, then React
* Native (`navigator.product === "ReactNative"` — RN has no `document`, so the browser check never
* claims it; real browsers report the frozen legacy product "Gecko", so RN never claims them), then web
* worker (`importScripts`), then Bun, Deno and finally Node (with a last-resort "node" branch when a
* bare `process` global is present). Anything else is "unknown" (e.g. Cloudflare Workers).
*/
function detectRuntimeInfo() {
	if (isBrowserEnvironment()) return {
		name: "browser",
		userAgent: globalThis.navigator?.userAgent
	};
	const globalScope = globalThis;
	if (globalScope.navigator?.product === "ReactNative") return {
		name: "react-native",
		version: resolveHermesVersion()
	};
	if (typeof globalScope.importScripts === "function") return {
		name: "worker",
		userAgent: globalScope.navigator?.userAgent
	};
	const globalAny = globalThis;
	if (globalAny.Bun != null) {
		const bunVersion = globalAny.Bun.version;
		return {
			name: "bun",
			version: bunVersion != null ? `bun/${bunVersion}` : void 0,
			hostname: getEnvironmentHostname(globalAny.process, globalAny.Deno, globalAny.Bun, globalAny.location)
		};
	}
	if (globalAny.Deno != null) {
		const denoVersion = globalAny.Deno?.version?.deno;
		return {
			name: "deno",
			version: denoVersion != null ? `deno/${denoVersion}` : void 0,
			hostname: getEnvironmentHostname(globalAny.process, globalAny.Deno, globalAny.Bun, globalAny.location)
		};
	}
	if (globalAny.process?.versions?.node != null || globalAny.process?.version != null) return {
		name: "node",
		version: globalAny.process?.versions?.node ?? globalAny.process?.version,
		hostname: getEnvironmentHostname(globalAny.process, globalAny.Deno, globalAny.Bun, globalAny.location)
	};
	if (globalAny.process != null) return {
		name: "node",
		version: "unknown",
		hostname: getEnvironmentHostname(globalAny.process, globalAny.Deno, globalAny.Bun, globalAny.location)
	};
	return { name: "unknown" };
}
/**
* Resolve the Hermes engine version on React Native (`hermes/<version>`), or `undefined` off Hermes
* (JSC-based RN apps have no comparable engine-version API). Never throws.
*/
function resolveHermesVersion() {
	try {
		const version = globalThis.HermesInternal?.getRuntimeProperties?.()?.["OSS Release Version"];
		return typeof version === "string" && version.length > 0 ? `hermes/${version}` : void 0;
	} catch {
		return;
	}
}
/** Build the static (per-logger-instance) meta block for the detected runtime. */
function createRuntimeMeta(info) {
	if (info.name === "browser" || info.name === "worker") return {
		runtime: info.name,
		browser: info.userAgent
	};
	if (info.name === "react-native") {
		const reactNativeMeta = { runtime: info.name };
		if (info.version !== void 0) reactNativeMeta.runtimeVersion = info.version;
		return reactNativeMeta;
	}
	const metaStatic = { runtime: info.name };
	if (shouldCaptureRuntimeVersion(info.name)) metaStatic.runtimeVersion = info.version ?? "unknown";
	if (shouldCaptureHostname(info.name)) metaStatic.hostname = info.hostname ?? "unknown";
	return metaStatic;
}
/**
* Resolve a host name for server runtimes. The environment variables (HOSTNAME/HOST/COMPUTERNAME)
* are consulted first — they are the explicit override and what containers set — then the OS hostname
* (`Deno.hostname()` on Deno, else `process.getBuiltinModule("node:os")` — Node 22.3+, Bun, Deno 2;
* the synchronous, import-free builtin accessor, so this module never imports `node:os`), then
* `location.hostname`. Returns
* `undefined` when nothing resolves. Every probe is guarded: Deno throws `NotCapable` on env reads
* without `--allow-env` and on `os.hostname()` without `--allow-sys`.
*/
function getEnvironmentHostname(nodeProcess, deno, bun, location) {
	try {
		const processHostname = nodeProcess?.env?.HOSTNAME ?? nodeProcess?.env?.HOST ?? nodeProcess?.env?.COMPUTERNAME;
		if (processHostname != null && processHostname.length > 0) return processHostname;
	} catch {}
	try {
		const bunHostname = bun?.env?.HOSTNAME ?? bun?.env?.HOST ?? bun?.env?.COMPUTERNAME;
		if (bunHostname != null && bunHostname.length > 0) return bunHostname;
	} catch {}
	try {
		const denoEnvGet = deno?.env?.get;
		if (typeof denoEnvGet === "function") {
			const value = denoEnvGet("HOSTNAME");
			if (value != null && value.length > 0) return value;
		}
	} catch {}
	try {
		if (typeof deno?.hostname === "function") {
			const value = deno.hostname();
			if (value != null && value.length > 0) return value;
		}
	} catch {}
	try {
		if (typeof nodeProcess?.getBuiltinModule === "function") {
			const os = nodeProcess.getBuiltinModule("node:os");
			if (typeof os?.hostname === "function") {
				const value = os.hostname();
				if (value != null && value.length > 0) return value;
			}
		}
	} catch {}
	if (location?.hostname != null && location.hostname.length > 0) return location.hostname;
}
/** True for DOM environments (both `window` and `document` present). */
function isBrowserEnvironment() {
	return typeof window !== "undefined" && typeof document !== "undefined";
}
/**
* Best-effort `Error` detection that also recognizes cross-realm errors and error-like plain objects.
* Matches native `instanceof Error`, the `[object ...Error]` toString tag, and `name` ending in "Error".
*/
function isNativeError(value) {
	if (value instanceof Error) return true;
	if (value != null && typeof value === "object") {
		const objectTag = Object.prototype.toString.call(value);
		if (/\[object .*Error\]/.test(objectTag)) return true;
		const name = value.name;
		if (typeof name === "string" && name.endsWith("Error")) return true;
	}
	return false;
}
/**
* Matches a browser/Hermes/Safari stack frame, capturing the file path (group 1), line (group 2) and
* column (group 3). The scheme + authority (`https://host:port`) is stripped by
* {@link BROWSER_ORIGIN_REGEX} before this regex runs, so the capture is the origin-relative path and
* a single root-level segment (`/app.js`) is a valid frame. (Previously the host doubled as the
* leading path segment, which silently failed for hosts with a port — i.e. every dev server.)
*
* Each path segment is `[^:/]+`, but a single Windows drive-letter colon is allowed inside the run via
* `(?::(?=\/))?` — a `:` is absorbed into the path only when it is immediately followed by `/`, i.e. the
* `C:/` drive separator in a Vite `/@fs/C:/…` URL (issue #323). The trailing `:line[:col]` colons are
* always followed by digits, never a slash, so they never match this branch and still bind to groups 2/3.
*/
const BROWSER_PATH_REGEX = /(?:(?:file|https?|global code|[^@]+)@)?(?:file:)?((?:\/[^:/]+(?::(?=\/))?)+)(?::(\d+))?(?::(\d+))?/;
/**
* A URL's scheme + authority (`https://host:port`, `chrome://juggler`, `file://`) inside a stack line.
* Stripped before {@link BROWSER_PATH_REGEX} so the host never leaks into `filePath` — the full URL
* (kept for `fullFilePath`) is matched separately from the unmodified line.
*/
const BROWSER_ORIGIN_REGEX = /[a-z][a-z0-9+.-]*:\/\/[^/\s)]*/i;
/**
* Parse a V8/server-style stack line (`at method (path:line:col)` or `at path:line:col`).
*
* `getCwd` is supplied by the provider so callers control cwd caching (the v4 monolith memoized cwd
* inside the singleton; v5 lifts that responsibility to the provider to keep this function pure).
* `resolveSourceMap`, when supplied, remaps the parsed position through a source map before the cwd
* relativization below — so a bundled `dist/app.js:42:9` frame reports `src/app.ts:12:3` when a map
* resolves it, falling back silently to the transpiled position otherwise.
* Returns `undefined` for lines that are not stack frames.
*/
function parseServerStackLine(rawLine, getCwd, resolveSourceMap) {
	if (typeof rawLine !== "string" || rawLine.length === 0) return;
	const trimmedLine = rawLine.trim();
	if (!trimmedLine.includes(" at ") && !trimmedLine.startsWith("at ")) return;
	const line = trimmedLine.replace(/^at\s+/, "");
	let method;
	let location = line;
	const methodMatch = line.match(/^(.*?)\s+\((.*)\)$/);
	if (methodMatch) {
		method = methodMatch[1];
		location = methodMatch[2];
	}
	const sanitizedLocation = location.replace(/^\(/, "").replace(/\)$/, "");
	const withoutAddressPrefix = sanitizedLocation.replace(/^address at /, "");
	let fileLine;
	let fileColumn;
	let filePathCandidate = withoutAddressPrefix;
	const segments = withoutAddressPrefix.split(":");
	if (segments.length >= 3 && /^\d+$/.test(segments[segments.length - 1])) {
		fileColumn = segments.pop();
		fileLine = segments.pop();
		filePathCandidate = segments.join(":");
	} else if (segments.length >= 2 && /^\d+$/.test(segments[segments.length - 1])) {
		fileLine = segments.pop();
		filePathCandidate = segments.join(":");
	}
	filePathCandidate = filePathCandidate.replace(/\?.*$/, "");
	let normalizedPath = filePathCandidate.replace(/^file:\/\//, "");
	let remappedSource;
	if (resolveSourceMap != null && fileLine != null) {
		const original = resolveSourceMap(normalizedPath, Number(fileLine), fileColumn != null ? Number(fileColumn) : 1);
		if (original != null) {
			normalizedPath = original.source;
			remappedSource = original.source;
			fileLine = String(original.line);
			fileColumn = String(original.column);
		}
	}
	const cwd = getCwd();
	if (cwd != null && normalizedPath.startsWith(cwd)) {
		normalizedPath = normalizedPath.slice(cwd.length);
		normalizedPath = normalizedPath.replace(/^[\\/]/, "");
	}
	if (normalizedPath.length === 0) normalizedPath = filePathCandidate;
	const normalizedPathWithoutLine = normalizeFilePath(normalizedPath);
	const effectivePath = normalizedPathWithoutLine.length > 0 ? normalizedPathWithoutLine : normalizedPath;
	const pathSegments = effectivePath.split(/\\|\//);
	const fileName = pathSegments[pathSegments.length - 1];
	const fileNameWithLine = fileName && fileLine ? `${fileName}:${fileLine}` : void 0;
	const filePathWithLine = effectivePath && fileLine ? `${effectivePath}:${fileLine}` : void 0;
	return {
		fullFilePath: remappedSource != null ? `${remappedSource}:${fileLine}:${fileColumn}` : sanitizedLocation,
		fileName,
		fileNameWithLine,
		fileColumn,
		fileLine,
		filePath: effectivePath,
		filePathWithLine,
		method
	};
}
/**
* Parse a browser/Hermes/Safari stack line via {@link BROWSER_PATH_REGEX}. `method` is always
* undefined for browser frames. Returns `undefined` for lines without a parseable file path.
*/
function parseBrowserStackLine(line) {
	const href = globalThis.location?.origin;
	if (line == null) return;
	const match = line.replace(BROWSER_ORIGIN_REGEX, "").match(BROWSER_PATH_REGEX);
	if (!match) return;
	const filePath = match[1]?.replace(/\?.*$/, "");
	/* v8 ignore next 3 -- defensive: the regex requires capture group 1 to match, so filePath is never null here */
	if (filePath == null) return;
	const pathParts = filePath.split("/");
	const fileLine = match[2];
	const fileColumn = match[3];
	const fileName = pathParts[pathParts.length - 1];
	const urlMatch = line.match(/(?:https?|file):\/\/[^\s)]+/);
	let fullFilePath;
	if (urlMatch != null) fullFilePath = urlMatch[0].replace(/(?::\d+){1,2}$/, "").replace(/\?.*$/, "");
	else fullFilePath = href ? `${href}${filePath}` : filePath;
	return {
		fullFilePath,
		fileName,
		fileNameWithLine: fileName && fileLine ? `${fileName}:${fileLine}` : void 0,
		fileColumn,
		fileLine,
		filePath,
		filePathWithLine: fileLine ? `${filePath}:${fileLine}` : void 0,
		method: void 0
	};
}
/**
* Matches a JSC-style `func@path:line:col` frame with NO path-shape requirement — React Native bundle
* locations are often bare bundle names (`main.jsbundle`) without any slash at all, which
* {@link BROWSER_PATH_REGEX} (whose path capture starts at a `/`) rejects.
*/
const REACT_NATIVE_JSC_REGEX = /^\s*(?:([^@\s]*)@)?(.+?):(\d+):(\d+)\s*$/;
/**
* Detect the file tslog itself is served from, as an exact-match ignore pattern for caller detection.
*
* The Node/ESM builds recognize their own frames via `import.meta.url` (`OWN_DIR_PATTERN` in
* `stackTrace.ts`), but the browser IIFE has no `import.meta` — so a `<script src>`/CDN tslog had no
* way to skip its own frames and every log's position pointed inside the bundle. The error captured
* HERE lives in tslog code, so its topmost parseable frame IS tslog's own file. When tslog is inlined
* into the app's bundle the pattern matches app frames too; caller detection then falls back to the
* first frame — exactly the pre-pattern behavior, so it never regresses.
*
* Returns `undefined` when no frame parses (e.g. eval contexts without file URLs).
*/
function detectOwnBrowserFilePattern(positionError = /* @__PURE__ */ new Error()) {
	for (const line of getCleanStackLines(positionError)) {
		const ownFile = parseBrowserStackLine(line)?.fullFilePath;
		if (ownFile) return new RegExp(`^${ownFile.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
	}
}
/**
* Parse a React Native stack line. RN needs a hybrid strategy:
*  - Hermes (the default engine) emits V8-style frames — `at fn (http://host:8081/index.bundle?...:117:42)`
*    in dev, `at fn (address at index.android.bundle:1:1234)` in release — handled by
*    {@link parseServerStackLine} (which strips the `address at` prefix and pops line/col before the query).
*  - JSC emits `fn@location:line:col`, where the location may be a bare bundle name (`main.jsbundle`) —
*    handled by a lenient dedicated regex, with {@link parseBrowserStackLine} as the final fallback.
*/
function parseReactNativeStackLine(rawLine, getCwd) {
	if (typeof rawLine !== "string" || rawLine.length === 0) return;
	const serverFrame = parseServerStackLine(rawLine, getCwd);
	if (serverFrame !== void 0) return serverFrame;
	const jscMatch = rawLine.match(REACT_NATIVE_JSC_REGEX);
	if (jscMatch) {
		const method = jscMatch[1] != null && jscMatch[1].length > 0 ? jscMatch[1] : void 0;
		const filePath = jscMatch[2].replace(/\?.*$/, "");
		const fileLine = jscMatch[3];
		const fileColumn = jscMatch[4];
		if (filePath.length > 0 && !filePath.includes("[native")) {
			const pathParts = filePath.split("/");
			const fileName = pathParts[pathParts.length - 1];
			return {
				fullFilePath: jscMatch[2],
				fileName,
				fileNameWithLine: fileName ? `${fileName}:${fileLine}` : void 0,
				fileColumn,
				fileLine,
				filePath,
				filePathWithLine: `${filePath}:${fileLine}`,
				method
			};
		}
	}
	return parseBrowserStackLine(rawLine);
}
/**
* Normalize a file path: collapse repeated/backslash separators to single forward slashes, resolve
* `.` / `..` segments, and preserve a Windows drive prefix, a UNC leading `//`, or a leading `/`.
* Falls back to the original value when normalization collapses to an empty string.
*/
function normalizeFilePath(value) {
	if (typeof value !== "string" || value.length === 0) return value;
	const replaced = value.replace(/\\+/g, "\\").replace(/\\/g, "/");
	const hasRootDoubleSlash = replaced.startsWith("//");
	const hasLeadingSlash = replaced.startsWith("/") && !hasRootDoubleSlash;
	const driveMatch = replaced.match(/^[A-Za-z]:/);
	const drivePrefix = driveMatch ? driveMatch[0] : "";
	const segments = (drivePrefix ? replaced.slice(drivePrefix.length) : replaced).split("/");
	const normalizedSegments = [];
	for (const segment of segments) {
		if (segment === "" || segment === ".") continue;
		if (segment === "..") {
			if (normalizedSegments.length > 0) normalizedSegments.pop();
			continue;
		}
		normalizedSegments.push(segment);
	}
	let normalized = normalizedSegments.join("/");
	if (hasRootDoubleSlash) normalized = `//${normalized}`;
	else if (hasLeadingSlash) normalized = `/${normalized}`;
	else if (drivePrefix !== "") normalized = `${drivePrefix}${normalized.length > 0 ? `/${normalized}` : ""}`;
	if (normalized.length === 0) return value;
	return normalized;
}
/** Render each stack frame through the configured `pretty.errorStackTemplate`. */
function formatStackFrames(frames, settings) {
	return frames.map((stackFrame) => formatTemplate(settings, settings.pretty.errorStackTemplate, { ...stackFrame }, true));
}
/**
* Own properties every engine stamps onto errors as positional metadata (Firefox: fileName/lineNumber/
* columnNumber; WebKit: line/column/sourceURL). They duplicate what the stack trace already shows, so
* they are excluded from the message line — without this, `new Error("test")` prints as
* `http://host/app.js, 3, 14, test` on Firefox and `test, 3, 23, http://host/app.js` on Safari.
*/
const ENGINE_POSITION_PROPS = /* @__PURE__ */ new Set([
	"fileName",
	"lineNumber",
	"columnNumber",
	"line",
	"column",
	"sourceURL"
]);
/**
* Build the human-readable message line for an error by joining its own enumerable, non-function
* properties (excluding `stack`, `cause`, and engine-stamped position properties). `name` is also
* excluded: subclasses assign it as an own property (`this.name = "HttpError"`), and it is always
* rendered separately via the `{{errorName}}` badge — joining it here printed "Not Found, HttpError, 404".
*/
function formatErrorMessage(error) {
	return Object.getOwnPropertyNames(error).filter((key) => key !== "stack" && key !== "cause" && key !== "name" && !ENGINE_POSITION_PROPS.has(key)).reduce((result, key) => {
		try {
			const value = error[key];
			if (typeof value === "function") return result;
			result.push(stringifyFallback(value));
		} catch {}
		return result;
	}, []).join(", ");
}
/** Last-resort value stringifier: pass strings through, JSON-stringify, else `String(value)`. */
function stringifyFallback(value) {
	if (typeof value === "string") return value;
	try {
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
}
const ANSI_REGEX = /\u001b\[[0-9;]*m/g;
/** Remove ANSI SGR escape sequences from a string. */
function stripAnsi(value) {
	return value.replace(ANSI_REGEX, "");
}
/**
* Pick the console method used to print a pretty log: the per-level override, then the `"*"` override,
* then the default `console.log`.
*/
function getPrettyLogMethod(logLevelName, levelMethod) {
	if (logLevelName && levelMethod?.[logLevelName]) return levelMethod[logLevelName];
	if (levelMethod?.["*"]) return levelMethod["*"];
	return nativeConsoleMethod("log");
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/env/providerBase.js
/** Build the shared provider methods and the getMeta seams for one runtime configuration. */
function createProviderBase(config) {
	const { runtimeInfo } = config;
	const staticMeta = createRuntimeMeta(runtimeInfo);
	const adaptive = config.flavor === "adaptive";
	const usesBrowserStack = adaptive && (runtimeInfo.name === "browser" || runtimeInfo.name === "worker");
	const isReactNative = adaptive && runtimeInfo.name === "react-native";
	const callerIgnorePatterns = usesBrowserStack || isReactNative ? [...getDefaultIgnorePatterns(), /node_modules[\\/].*tslog/i] : [
		...getDefaultIgnorePatterns(),
		/node:(?:internal|vm)/i,
		/\binternal[\\/]/i
	];
	if (usesBrowserStack) {
		const ownFilePattern = detectOwnBrowserFilePattern();
		if (ownFilePattern != null) callerIgnorePatterns.push(ownFilePattern);
	}
	let cachedCwd;
	function getWorkingDirectory() {
		if (cachedCwd === void 0) cachedCwd = safeGetCwd() ?? null;
		return cachedCwd ?? void 0;
	}
	function parseStackLine(line) {
		if (isReactNative) return parseReactNativeStackLine(line, getWorkingDirectory);
		return usesBrowserStack ? parseBrowserStackLine(line) : parseServerStackLine(line, getWorkingDirectory, config.resolveSourceMap);
	}
	/** Run the configured formatWithOptions, falling back to a best-effort stringify if it throws. */
	function formatWithOptionsSafe(options, args) {
		try {
			return config.getFormatWithOptions()(options, ...args);
		} catch {
			return args.map(stringifyFallback).join(" ");
		}
	}
	/** Resolve the caller's stack frame from a captured error, honoring manual index / auto-detection. */
	function resolveCallerStackFrame(error, callerFrame, internalFramePatterns) {
		const frames = buildStackTrace(error, parseStackLine);
		if (frames.length === 0) return {};
		const autoIndex = findFirstExternalFrameIndex(frames, internalFramePatterns != null && internalFramePatterns.length > 0 ? [...callerIgnorePatterns, ...internalFramePatterns] : callerIgnorePatterns);
		/* v8 ignore next -- defensive: clampIndex always yields a valid index for a non-empty frames array */
		return frames[Number.isFinite(callerFrame) && callerFrame >= 0 ? clampIndex(callerFrame, frames.length) : clampIndex(autoIndex, frames.length)] ?? {};
	}
	const methods = {
		getCallerStackFrame(callerFrame, error = /* @__PURE__ */ new Error(), internalFramePatterns) {
			return resolveCallerStackFrame(error, callerFrame, internalFramePatterns);
		},
		getErrorTrace(error) {
			return buildStackTrace(error, parseStackLine);
		},
		isError(value) {
			return isNativeError(value);
		},
		isBuffer(value) {
			return typeof Buffer !== "undefined" && typeof Buffer.isBuffer === "function" ? Buffer.isBuffer(value) : false;
		},
		prettyFormatLogObj(maskedArgs, settings) {
			return maskedArgs.reduce((result, arg) => {
				if (methods.isError(arg)) result.errors.push(methods.prettyFormatErrorObj(arg, settings));
				else result.args.push(arg);
				return result;
			}, {
				args: [],
				errors: []
			});
		},
		prettyFormatErrorObj(error, settings) {
			const stackLines = formatStackFrames(methods.getErrorTrace(error), settings);
			const causeSections = collectErrorCauses(error).map((cause, index) => {
				const causeMessage = safeErrorString(cause, "message", "");
				return [`Caused by (${index + 1}): ${safeErrorString(cause, "name", "Error")}${causeMessage ? `: ${causeMessage}` : ""}`, ...formatStackFrames(buildStackTrace(cause, parseStackLine), settings)].join("\n");
			});
			const placeholderValuesError = {
				errorName: ` ${safeErrorString(error, "name", "Error")} `,
				errorMessage: formatErrorMessage(error),
				errorStack: [...stackLines, ...causeSections].join("\n")
			};
			return formatTemplate(settings, settings.pretty.errorTemplate, placeholderValuesError);
		},
		prettyFormatLine(maskedArgs, meta, settings) {
			const prettyLogs = settings.pretty.style !== false;
			const { args: logArgs, errors: logErrors } = methods.prettyFormatLogObj(maskedArgs, settings);
			const logMetaMarkup = buildPrettyMeta(settings, meta).text;
			const logErrorsStr = (logErrors.length > 0 && logArgs.length > 0 ? "\n" : "") + logErrors.join("\n");
			const metaMarkupForText = prettyLogs ? logMetaMarkup : stripAnsi(logMetaMarkup);
			settings.pretty.inspectOptions.colors = prettyLogs;
			return metaMarkupForText + formatWithOptionsSafe(settings.pretty.inspectOptions, logArgs) + logErrorsStr;
		},
		transportFormatted(logMetaMarkup, logArgs, logErrors, logMeta, settings) {
			const prettyLogs = settings.pretty.style !== false;
			const nativeArgs = settings.pretty.passObjectsNatively;
			const logErrorsStr = (logErrors.length > 0 && logArgs.length > 0 ? "\n" : "") + logErrors.join("\n");
			const log = getPrettyLogMethod(logMeta?.logLevelName, settings.pretty.levelMethod);
			if (prettyLogs && usesBrowserStack && consoleSupportsCssStyling()) {
				const sanitizedMetaMarkup = stripAnsi(logMetaMarkup);
				settings.pretty.inspectOptions.colors = false;
				const formattedArgs = nativeArgs ? "" : formatWithOptionsSafe(settings.pretty.inspectOptions, logArgs);
				const cssMeta = logMeta != null ? buildCssMetaOutput(settings, logMeta) : {
					text: sanitizedMetaMarkup,
					styles: []
				};
				const hasCssMeta = cssMeta.text.length > 0 && cssMeta.styles.length > 0;
				const metaOutput = hasCssMeta ? cssMeta.text : sanitizedMetaMarkup;
				const embedErrors = !nativeArgs || logArgs.length === 0;
				const cssErrors = embedErrors && logErrorsStr.length > 0 ? ansiToCssConsoleFormat(logErrorsStr) : {
					text: "",
					styles: []
				};
				const output = metaOutput + formattedArgs + cssErrors.text;
				const styleArgs = [...hasCssMeta ? cssMeta.styles : [], ...cssErrors.styles];
				const trailing = nativeArgs ? [...logArgs, ...!embedErrors && logErrorsStr.length > 0 ? [stripAnsi(logErrorsStr)] : []] : [];
				if (styleArgs.length > 0) log(output, ...styleArgs, ...trailing);
				else log(output, ...trailing);
				return;
			}
			settings.pretty.inspectOptions.colors = prettyLogs;
			const metaPrefix = prettyLogs ? logMetaMarkup : stripAnsi(logMetaMarkup);
			if (nativeArgs) {
				log(metaPrefix, ...logArgs, ...logErrorsStr ? [logErrorsStr] : []);
				return;
			}
			log(metaPrefix + formatWithOptionsSafe(settings.pretty.inspectOptions, logArgs) + logErrorsStr);
		},
		transportJSON(json) {
			nativeConsoleMethod("log")(jsonStringifyRecursive(json));
		}
	};
	function buildEagerMeta(logLevelId, logLevelName, callerFrame, positionError, name, parentNames, internalFramePatterns) {
		const built = Object.assign({}, staticMeta, {
			date: /* @__PURE__ */ new Date(),
			logLevelId,
			logLevelName
		});
		if (positionError != null) built.path = methods.getCallerStackFrame(callerFrame, positionError, internalFramePatterns);
		if (name !== void 0) built.name = name;
		if (parentNames !== void 0) built.parentNames = parentNames;
		return built;
	}
	return {
		methods,
		staticMeta,
		resolveCallerStackFrame,
		buildEagerMeta
	};
}
/**
* Render the pretty meta template with CSS `%c` markers: each placeholder whose style resolves to CSS
* is wrapped in a `%c...%c` pair with the matching entries pushed onto `styles` (console.log consumes
* them positionally). Placeholders without a resolvable style are emitted as plain text.
*/
function buildCssMetaOutput(settings, metaValue) {
	/* v8 ignore next 3 -- defensive: the sole caller only invokes this when logMeta is non-null */
	if (metaValue == null) return {
		text: "",
		styles: []
	};
	const { template, placeholders } = buildPrettyMeta(settings, metaValue);
	const parts = [];
	const styles = [];
	let lastIndex = 0;
	const placeholderRegex = /{{(.+?)}}/g;
	let match;
	while ((match = placeholderRegex.exec(template)) != null) {
		if (match.index > lastIndex) parts.push(template.slice(lastIndex, match.index));
		const key = match[1];
		const rawValue = placeholders[key] != null ? String(placeholders[key]) : "";
		const css = tokensToCss(collectStyleTokens(settings.pretty.styles?.[key], rawValue));
		if (css.length > 0) {
			parts.push(`%c${rawValue}%c`);
			styles.push(css, "");
		} else parts.push(rawValue);
		lastIndex = placeholderRegex.lastIndex;
	}
	if (lastIndex < template.length) parts.push(template.slice(lastIndex));
	return {
		text: parts.join(""),
		styles
	};
}
/** Flatten a pretty style setting (string, array, or per-value map with a `"*"` wildcard) into tokens. */
function collectStyleTokens(style, value) {
	if (style == null) return [];
	if (typeof style === "string") return [style];
	if (Array.isArray(style)) return style.flatMap((token) => collectStyleTokens(token, value));
	if (typeof style === "object") {
		const nextStyle = style[value.trim()] ?? style["*"];
		if (nextStyle == null) return [];
		return collectStyleTokens(nextStyle, value);
	}
	return [];
}
/** Convert style tokens to a deduplicated `;`-joined CSS declaration string. */
function tokensToCss(tokens) {
	const seen = /* @__PURE__ */ new Set();
	const cssParts = [];
	for (const token of tokens) {
		const css = styleTokenToCss(token);
		if (css != null && css.length > 0 && !seen.has(css)) {
			seen.add(css);
			cssParts.push(css);
		}
	}
	return cssParts.join("; ");
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/env/sourceMap.node.js
const BASE64_VLQ_INDEX = Object.fromEntries([..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"].map((char, index) => [char, index]));
/** Decode one Base64-VLQ run into signed integers (source-map spec: 5 mantissa bits/char, MSB = continuation, LSB = sign). */
function decodeVlq(segment) {
	const values = [];
	let shift = 0;
	let result = 0;
	for (let i = 0; i < segment.length; i += 1) {
		const char = segment[i];
		const digit = BASE64_VLQ_INDEX[char];
		if (digit == null) continue;
		const continuation = digit & 32;
		const bits = digit & 31;
		result += bits << shift;
		if (continuation) {
			shift += 5;
			continue;
		}
		const negate = result & 1;
		result >>= 1;
		values.push(negate ? -result : result);
		result = 0;
		shift = 0;
	}
	return values;
}
/** Parse a source-map v3 `mappings` string into per-generated-line segment lists, sorted by column. */
function parseMappings(mappings) {
	const segmentsByLine = /* @__PURE__ */ new Map();
	const lines = mappings.split(";");
	let sourceIndex = 0;
	let origLine = 0;
	let origColumn = 0;
	for (let genLine = 0; genLine < lines.length; genLine += 1) {
		let genColumn = 0;
		const line = lines[genLine];
		if (line.length === 0) continue;
		const lineSegments = [];
		for (const rawSegment of line.split(",")) {
			if (rawSegment.length === 0) continue;
			const fields = decodeVlq(rawSegment);
			if (fields.length < 4) continue;
			genColumn += fields[0];
			sourceIndex += fields[1];
			origLine += fields[2];
			origColumn += fields[3];
			lineSegments.push({
				genLine,
				genColumn,
				sourceIndex,
				origLine,
				origColumn
			});
		}
		if (lineSegments.length > 0) {
			lineSegments.sort((a, b) => a.genColumn - b.genColumn);
			segmentsByLine.set(genLine, lineSegments);
		}
	}
	return segmentsByLine;
}
function requireNodeModule(name) {
	const getBuiltin = typeof process !== "undefined" ? process.getBuiltinModule : void 0;
	if (typeof getBuiltin === "function") try {
		const resolved = getBuiltin(name);
		/* v8 ignore else -- defensive: the sole caller asks for "node:fs", which every runtime implementing getBuiltinModule resolves; the fall-through only guards the generic signature */
		if (resolved != null) return resolved;
	} catch {}
	/* v8 ignore next 6 -- reachable only on runtimes without getBuiltinModule (Node 22.0-22.2); the test runners are newer */
	try {
		return createRequire(import.meta.url)(name);
	} catch {
		return;
	}
}
let cachedFs;
let fsProbed = false;
function getFs() {
	if (!fsProbed) {
		fsProbed = true;
		cachedFs = requireNodeModule("node:fs");
	}
	return cachedFs;
}
function dirnameOf(filePath) {
	const index = Math.max(filePath.lastIndexOf("/"), filePath.lastIndexOf("\\"));
	return index === -1 ? "." : filePath.slice(0, index);
}
function joinPath(dir, relative) {
	if (/^([A-Za-z]:)?[/\\]/.test(relative)) return relative;
	return `${dir.replace(/[/\\]+$/, "")}/${relative}`;
}
/** Read the trailing `//# sourceMappingURL=...` comment (last one wins, per spec) from a source file. */
function extractSourceMappingUrl(source) {
	const matches = source.match(/\/[*/]#\s*sourceMappingURL=([^\s*]+)\s*(?:\*\/)?\s*$/gm);
	if (matches == null || matches.length === 0) return;
	return matches[matches.length - 1].match(/sourceMappingURL=([^\s*]+)/)?.[1];
}
function loadRawSourceMap(filePath, fs) {
	let fileContents;
	try {
		fileContents = fs.readFileSync(filePath, "utf8");
	} catch {
		return;
	}
	const mappingUrl = extractSourceMappingUrl(fileContents);
	if (mappingUrl == null) return;
	try {
		if (mappingUrl.startsWith("data:")) {
			const base64Index = mappingUrl.indexOf("base64,");
			if (base64Index === -1) return;
			const decoded = Buffer.from(mappingUrl.slice(base64Index + 7), "base64").toString("utf8");
			return {
				raw: JSON.parse(decoded),
				mapDir: dirnameOf(filePath)
			};
		}
		let decodedUrl = mappingUrl;
		try {
			decodedUrl = decodeURIComponent(mappingUrl);
		} catch {}
		let mapPath = joinPath(dirnameOf(filePath), decodedUrl);
		if (!fs.existsSync(mapPath) && decodedUrl !== mappingUrl) mapPath = joinPath(dirnameOf(filePath), mappingUrl);
		if (!fs.existsSync(mapPath)) return;
		return {
			raw: JSON.parse(fs.readFileSync(mapPath, "utf8")),
			mapDir: dirnameOf(mapPath)
		};
	} catch {
		return;
	}
}
/** Parsed-map cache, keyed by the generated file's path — a process only ever has finitely many loaded modules. */
const PARSED_MAP_CACHE_LIMIT = 256;
const parsedMapCache = /* @__PURE__ */ new Map();
function getParsedSourceMap(filePath) {
	const cached = parsedMapCache.get(filePath);
	if (cached !== void 0) return cached ?? void 0;
	if (parsedMapCache.size >= PARSED_MAP_CACHE_LIMIT) {
		const [firstKey] = parsedMapCache.keys();
		parsedMapCache.delete(firstKey);
	}
	const fs = getFs();
	/* v8 ignore next 4 -- defensive: node:fs is always resolvable on Node/Bun/Deno, the only runtimes this resolver is wired into */
	if (fs == null) {
		parsedMapCache.set(filePath, null);
		return;
	}
	let parsed;
	try {
		const loaded = loadRawSourceMap(filePath, fs);
		parsed = loaded != null ? parseRawMap(loaded.raw, loaded.mapDir, fs) : void 0;
	} catch {
		parsed = void 0;
	}
	parsedMapCache.set(filePath, parsed ?? null);
	return parsed;
}
/** Index maps must not nest further index maps (spec), but cap the parse recursion defensively anyway. */
const MAX_SECTION_DEPTH = 2;
/**
* Parse a raw map — flat or indexed (`sections`, emitted by Turbopack/Next.js dev and other
* concatenating bundlers) — into its cached representation. Section sub-maps, whether inline (`map`)
* or external (`url`, resolved relative to the outer map), are parsed eagerly right here, so the
* whole structure is built exactly once per generated file and resolution never touches the disk
* again — logging through a sectioned map stays as cheap as through a flat one.
*/
function parseRawMap(raw, mapDir, fs, depth = 0) {
	if (raw.sections && raw.sections.length > 0) {
		/* v8 ignore next -- defensive: the spec forbids nested index maps, so real-world depth never exceeds 1 */
		if (depth >= MAX_SECTION_DEPTH) return void 0;
		const sections = [];
		for (const section of raw.sections) {
			const offsetLine = section.offset?.line ?? 0;
			const offsetColumn = section.offset?.column ?? 0;
			let subRaw = section.map;
			let subMapDir = mapDir;
			if (subRaw == null && section.url != null) try {
				const subPath = joinPath(mapDir, section.url);
				if (fs.existsSync(subPath)) {
					subRaw = JSON.parse(fs.readFileSync(subPath, "utf8"));
					subMapDir = dirnameOf(subPath);
				}
			} catch {}
			sections.push({
				offsetLine,
				offsetColumn,
				map: subRaw != null ? parseRawMap(subRaw, subMapDir, fs, depth + 1) : void 0
			});
		}
		return {
			kind: "sectioned",
			sections
		};
	}
	if (raw.mappings && raw.sources && raw.sources.length > 0) return {
		kind: "flat",
		sources: raw.sources,
		sourceRoot: raw.sourceRoot ?? "",
		mapDir,
		segmentsByLine: parseMappings(raw.mappings)
	};
}
/**
* Resolve a 0-based generated position inside a parsed map. Flat maps do the classic per-line
* segment binary search; sectioned (index) maps select the last section starting at or before the
* position, shift the position into the section's coordinate space, and recurse into its sub-map.
*/
function resolveInParsedMap(map, line0, column0) {
	if (map.kind === "flat") {
		const segments = map.segmentsByLine.get(line0);
		if (segments == null || segments.length === 0) return;
		const segment = findSegment(segments, column0) ?? segments[0];
		const source = map.sources[segment.sourceIndex];
		if (source == null) return;
		return {
			source: resolveSourcePath(source, map.sourceRoot, map.mapDir),
			line: segment.origLine + 1,
			column: segment.origColumn + 1
		};
	}
	let selected;
	for (const section of map.sections) if (line0 > section.offsetLine || line0 === section.offsetLine && column0 >= section.offsetColumn) selected = section;
	else break;
	if (selected?.map == null) return;
	const relLine0 = line0 - selected.offsetLine;
	const relColumn0 = line0 === selected.offsetLine ? Math.max(0, column0 - selected.offsetColumn) : column0;
	return resolveInParsedMap(selected.map, relLine0, relColumn0);
}
/** Matches a URL-scheme prefix (`webpack://`, `webpack-internal://`, `file://`, ...) on a `sources` entry. */
const SOURCE_SCHEME_REGEX = /^[a-z][a-z0-9+.-]*:\/\//i;
/**
* Turn a raw `sources` entry into a usable path. Per the source-map spec, `sources` are relative to
* `sourceRoot` and then to the map's own location — reporting them verbatim would show `../src/app.ts`
* for a map in `dist/`, which neither cwd-relativizes nor opens in an editor. So: apply `sourceRoot`,
* strip a `file://` prefix, reduce bundler-virtual schemes (`webpack://_N_E/./src/x.ts` and friends) to
* their project-relative tail (the virtual path has no on-disk anchor, so the readable tail is the best
* available), and anchor plain relative paths to `mapDir` so `dist/app.js.map` + `../src/app.ts` yields
* the real on-disk `src/app.ts`.
*
* Bracket-prefixed virtual sources from modern bundlers (Turbopack's `[project]/src/app.ts`) get the
* same tail treatment as scheme-prefixed ones, so they come out as the clean `src/app.ts` users
* expect in logs.
*/
function resolveSourcePath(source, sourceRoot, mapDir) {
	const combined = sourceRoot.length > 0 ? joinPath(sourceRoot, source) : source;
	if (combined.startsWith("file://")) {
		const stripped = normalizeFilePath(combined.replace(/^file:\/\//, ""));
		return stripped.length > 0 ? stripped : combined;
	}
	const bracketMatch = combined.match(/^\[[^\]]+\]\/(.+)$/);
	if (bracketMatch?.[1]) {
		const cleaned = normalizeFilePath(bracketMatch[1]);
		/* v8 ignore next -- defensive: `(.+)` guarantees a non-empty tail; normalizeFilePath collapses to empty only for degenerate inputs like "./" */
		return cleaned.length > 0 ? cleaned : combined;
	}
	const scheme = combined.match(SOURCE_SCHEME_REGEX);
	if (scheme != null) {
		const rest = combined.slice(scheme[0].length);
		const slash = rest.indexOf("/");
		const cleaned = normalizeFilePath(slash === -1 ? rest : rest.slice(slash + 1));
		if (cleaned.length > 0) return cleaned;
		return combined;
	}
	if (/^([A-Za-z]:)?[/\\]/.test(combined)) return combined;
	return normalizeFilePath(joinPath(mapDir, combined));
}
/** Find the mapping segment on `genLine` at or immediately before `genColumn` (source maps snap to segment start). */
function findSegment(segments, genColumn) {
	let lo = 0;
	let hi = segments.length - 1;
	let candidate;
	while (lo <= hi) {
		const mid = lo + hi >> 1;
		const segment = segments[mid];
		if (segment.genColumn <= genColumn) {
			candidate = segment;
			lo = mid + 1;
		} else hi = mid - 1;
	}
	return candidate;
}
/**
* Resolve a transpiled/bundled `(filePath, line, column)` (1-based line, as produced by V8 stack
* frames) to its original source position via that file's source map, if one is discoverable.
* Returns `undefined` on any failure — no source map, unparsable map, or no covering segment — so
* callers can fall back to the transpiled position unconditionally.
*/
function resolveOriginalPosition(filePath, line, column) {
	if (!Number.isFinite(line) || line < 1) return;
	const map = getParsedSourceMap(filePath);
	if (map == null) return;
	const zeroBasedColumn = Number.isFinite(column) && column >= 1 ? column - 1 : 0;
	return resolveInParsedMap(map, line - 1, zeroBasedColumn);
}
/**
* Whether source-map resolution should be attempted: on by default outside production (matching
* {@link devWarningsEnabled}'s `NODE_ENV` check — this is a dev-ergonomics feature, and the sync file
* reads it costs are not something a production deployment should pay for), with a dedicated
* `TSLOG_SOURCE_MAPS` override so it can be forced on/off independent of dev-warning noise.
*/
function sourceMapResolutionEnabled() {
	const override = safeEnvGet("TSLOG_SOURCE_MAPS");
	if (override != null) return override !== "off" && override !== "false" && override !== "0";
	return devWarningsEnabled();
}
/**
* Build the {@link SourceMapResolver} the node/universal providers inject into `providerBase`. The
* resolver itself decides per call whether resolution is enabled (production default off, or
* `TSLOG_SOURCE_MAPS=off`) and returns `undefined` when it is not, so the caller keeps the transpiled
* position.
*
* The enablement check (`sourceMapResolutionEnabled`) is evaluated **per call**, not frozen at logger
* construction. This means flipping `TSLOG_SOURCE_MAPS` or `NODE_ENV` at runtime takes effect
* immediately — important for tests that toggle the flag between cases without recreating the logger.
* The cost is a single env-var read per stack frame, negligible behind the parsed-map cache.
*/
function createSourceMapResolver() {
	return (filePath, line, column) => {
		if (!sourceMapResolutionEnabled()) return;
		return resolveOriginalPosition(filePath, line, column);
	};
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/internal/exitHooks.js
/**
* Shared process/page exit hooks for buffering transports.
*
* A buffering sink (file stream, HTTP batch, worker queue) silently loses its tail when the process
* exits before a flush. This module gives transports one guarded place to register for the runtime's
* end-of-life signals:
*
*  - Node `process.on("beforeExit")` — the event loop is still alive, so an ASYNC flush can run
*    (scheduling I/O keeps the process alive until it settles, then a later `beforeExit` finds nothing
*    left to do and the process exits).
*  - Node `process.on("exit")` — synchronous-only territory: each hook's `drainSync` runs (e.g. the
*    file transport's `flushSync`). This also covers `process.exit(...)` and uncaught exceptions.
*  - Browser `pagehide` — best-effort: `drainSync` runs and `flushAsync` is kicked off (a
*    `fetch(..., { keepalive: true })` can outlive the page).
*
* Deliberately NOT covered: signal handlers (`SIGTERM`/`SIGINT`). Installing those from a library
* changes process semantics (a listener suppresses the default termination); graceful signal shutdown
* belongs to the application — see the shutdown recipe in RECIPES.md.
*
* No import-time side effects: listeners are installed lazily on the first registration (once per
* process, shared by all hooks) and the registry is a plain module-level Set.
*/
const hooks = /* @__PURE__ */ new Set();
let installed = false;
let flushCascadeRan = false;
function runSyncDrains() {
	for (const hook of hooks) try {
		hook.drainSync?.();
	} catch {}
}
function runAsyncFlushes() {
	if (flushCascadeRan) return;
	flushCascadeRan = true;
	for (const hook of hooks) try {
		const result = hook.flushAsync?.();
		if (result != null && typeof result.catch === "function") result.catch(() => void 0);
	} catch {}
}
function installOnce() {
	if (installed) return;
	installed = true;
	try {
		const proc = globalThis.process;
		if (typeof proc?.on === "function") {
			proc.on("beforeExit", runAsyncFlushes);
			proc.on("exit", runSyncDrains);
			return;
		}
	} catch {}
	try {
		const win = globalThis;
		if (typeof win.addEventListener === "function" && win.document != null) win.addEventListener("pagehide", () => {
			runSyncDrains();
			runAsyncFlushes();
		});
	} catch {}
}
/**
* Register an end-of-life hook. Returns an unregister function (idempotent); transports call it from
* their disposer so a disposed transport never runs at exit.
*/
function registerExitHook(hook) {
	installOnce();
	hooks.add(hook);
	return () => {
		hooks.delete(hook);
	};
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/env/stdoutSink.node.js
/**
* Flush inline once this many buffered UTF-16 units accumulate mid-turn, bounding memory (and the
* loss window) under a synchronous logging burst that never yields to the microtask queue. ~8KB of
* ASCII, the same order of magnitude as pino's recommended `minLength: 4096`.
*/
const FLUSH_THRESHOLD_CHARS = 8192;
function createStdoutJsonSink() {
	const buffer = [];
	let bufferedChars = 0;
	let flushScheduled = false;
	let pendingWrites = 0;
	let waiters = [];
	const errorGuardedStreams = /* @__PURE__ */ new WeakSet();
	let fsWriteSync;
	function settleWaiters() {
		if (pendingWrites === 0 && waiters.length > 0) {
			const settled = waiters;
			waiters = [];
			for (const resolve of settled) resolve();
		}
	}
	/** The live stdout stream, re-read on every flush so test spies and late replacements are honored. */
	function currentStdout() {
		return globalThis.process?.stdout;
	}
	function writeChunk(chunk) {
		const stdout = currentStdout();
		if (stdout != null && typeof stdout.write === "function") {
			if (typeof stdout.on === "function" && !errorGuardedStreams.has(stdout)) {
				errorGuardedStreams.add(stdout);
				try {
					stdout.on("error", () => void 0);
				} catch {}
			}
			let settled = false;
			const settle = () => {
				if (settled) return;
				settled = true;
				pendingWrites--;
				settleWaiters();
			};
			pendingWrites++;
			try {
				if (stdout.write(chunk, settle) !== false) settle();
				return;
			} catch {
				settle();
			}
		}
		try {
			/* v8 ignore next -- the `: chunk` arm is unreachable: every writeChunk caller passes a newline-terminated chunk; the branch defends future callers */
			nativeConsoleMethod("log")(chunk.endsWith("\n") ? chunk.slice(0, -1) : chunk);
		} catch {}
	}
	function flushNow() {
		if (buffer.length === 0) return;
		const chunk = `${buffer.join("\n")}\n`;
		buffer.length = 0;
		bufferedChars = 0;
		writeChunk(chunk);
	}
	/** Synchronous last-chance drain for `process.on("exit")`, where microtasks never run. */
	function drainSync() {
		if (buffer.length === 0) return;
		if (fsWriteSync === void 0) try {
			const fs = createRequire(import.meta.url)("node:fs");
			fsWriteSync = typeof fs.writeSync === "function" ? fs.writeSync : null;
		} catch {
			/* v8 ignore next -- defensive: node:fs is always resolvable on Node; covers exotic loaders */
			fsWriteSync = null;
		}
		const chunk = `${buffer.join("\n")}\n`;
		buffer.length = 0;
		bufferedChars = 0;
		if (fsWriteSync != null && typeof Buffer !== "undefined") {
			const bytes = Buffer.from(chunk, "utf8");
			const fd = currentStdout()?.fd ?? 1;
			let offset = 0;
			try {
				while (offset < bytes.length) {
					const written = fsWriteSync(fd, bytes.subarray(offset));
					if (!(written > 0)) break;
					offset += written;
				}
			} catch {}
			if (offset >= bytes.length) return;
			writeChunk(bytes.subarray(offset).toString("utf8"));
			return;
		}
		writeChunk(chunk);
	}
	registerExitHook({
		drainSync,
		flushAsync: () => sink.flush()
	});
	const sink = {
		write(line) {
			buffer.push(line);
			bufferedChars += line.length + 1;
			if (bufferedChars >= FLUSH_THRESHOLD_CHARS) {
				flushNow();
				return;
			}
			if (!flushScheduled) {
				flushScheduled = true;
				queueMicrotask(() => {
					flushScheduled = false;
					flushNow();
				});
			}
		},
		flush() {
			flushNow();
			if (pendingWrites === 0) return Promise.resolve();
			return new Promise((resolve) => {
				waiters.push(resolve);
			});
		},
		flushSync() {
			flushNow();
		}
	};
	return sink;
}
let sharedSink;
/**
* The process-wide stdout JSON sink, created (and its exit hooks registered) on first use. Shared by
* every Node-entry logger so batched chunks from different loggers never interleave mid-line.
*/
function getStdoutJsonSink() {
	if (sharedSink === void 0) sharedSink = createStdoutJsonSink();
	return sharedSink;
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/env/environment.node.js
/**
* Node.js {@link EnvironmentProvider}.
*
* Mirrors the server-side half of the v4 `createLoggerEnvironment()` singleton, but as a per-entry
* factory (BC11 — no module-level singleton). The node entry (`index.node.ts`) injects the provider
* returned here into `BaseLogger` via the constructor.
*
* The shared method set comes from `./providerBase.js` with the `"server"` flavor: Node frames are
* always parsed server-style and the CSS `%c` console path never applies.
*
* Inspect strategy (M0.5/2.2): this provider passes `formatWithOptions` imported DIRECTLY from
* `node:util` (native, higher fidelity than the bundled polyfill). The universal/browser providers use
* the polyfill/`resolveInspect()` instead; core never statically imports `node:util`.
*
* Source-map resolution (issue #307): `resolveSourceMap` (from `./sourceMap.node.js`) is wired in so
* server-style frames remap through a source map when one is discoverable. The resolver checks
* enablement per call (production default off, `TSLOG_SOURCE_MAPS` override — see
* {@link createSourceMapResolver}) and falls back to the transpiled position when disabled.
*
* Lazy stack capture (M1.2): when stack capture is on, `getMeta` does NOT eagerly parse frames. It
* captures the `Error` cheaply and installs an enumerable, self-caching getter on `_logMeta.path` that
* parses the frames on first read. The lazy semantics (and the `hideLogPosition` / name / parentNames
* assembly) live in the shared `../core/meta.js` `buildMeta`/`defineLazyPath`; this provider just
* supplies the runtime-specific `resolveCallerStackFrame` via {@link MetaDeps} so the getter and the
* key ordering are identical across every runtime that opts into lazy paths.
*/
function createNodeEnvironment() {
	const base = createProviderBase({
		runtimeInfo: detectRuntimeInfo(),
		flavor: "server",
		getFormatWithOptions: () => formatWithOptions,
		resolveSourceMap: createSourceMapResolver()
	});
	const metaDeps = { resolveCallerStackFrame: base.resolveCallerStackFrame };
	return {
		...base.methods,
		getMeta(logLevelId, logLevelName, callerFrame, hideLogPosition, name, parentNames, internalFramePatterns) {
			return buildMeta(base.staticMeta, logLevelId, logLevelName, callerFrame, hideLogPosition, name, parentNames, internalFramePatterns, metaDeps);
		},
		writeJsonLine(line) {
			getStdoutJsonSink().write(line);
		},
		flushJsonSink() {
			return getStdoutJsonSink().flush();
		},
		createAsyncContextStore() {
			try {
				const { AsyncLocalStorage } = createRequire(import.meta.url)("node:async_hooks");
				return createAsyncContextStore(AsyncLocalStorage);
			} catch {
				/* v8 ignore next -- defensive: node:async_hooks is always resolvable on Node; the probe fallback covers exotic loaders */
				return createAsyncContextStore();
			}
		}
	};
}
//#endregion
//#region node_modules/.pnpm/tslog@5.2.0/node_modules/tslog/esm/index.node.js
let nodeEnvironment;
function getNodeEnvironment() {
	if (nodeEnvironment == null) nodeEnvironment = createNodeEnvironment();
	return nodeEnvironment;
}
/**
* Universal TypeScript logger for Node.js, browsers, Deno, Bun, React Native, and workers. Zero runtime dependencies,
* pretty or JSON output, sub-loggers, secret masking, and structured error/cause formatting.
*
* @example
* // Pretty, colorized output — best for local development:
* import { Logger } from "tslog";
* const log = new Logger();
* log.info("server started", { port: 3000 });
*
* @example
* // Structured JSON for production / observability / LLM ingestion:
* const log = new Logger({ type: "json", minLevel: "INFO" });
* log.info({ event: "tool_call", tool: "search", durationMs: 142, tokens: 318 });
*
* @example
* // A child logger per request/agent — settings and fields are inherited automatically:
* const requestLog = log.getSubLogger({ name: "agent:planner" });
* requestLog.debug("planning step", { step: 2 });
*
* @example
* // Keep secrets and prompts out of your logs:
* const log = new Logger({ type: "json", mask: { keys: ["password", "apiKey", "prompt"] } });
*
* @typeParam LogObj - Shape of your structured log object (e.g. `{ traceId?: string }`); defaults are fine for most apps.
*/
var Logger = class Logger extends BaseLogger {
	constructor(settings, logObj) {
		super(settings, logObj, getNodeEnvironment(), NaN, fullCoreFeatures);
	}
	/**
	* Logs a message with a custom log level.
	* @param logLevelId    - Log level ID e.g. 0
	* @param logLevelName  - Log level name e.g. silly
	* @param args          - Multiple log attributes that should be logged out.
	*/
	log(logLevelId, logLevelName, ...args) {
		return super.log(logLevelId, logLevelName, ...args);
	}
	silly(...args) {
		return super.log(LogLevel.SILLY, "SILLY", ...args);
	}
	trace(...args) {
		return super.log(LogLevel.TRACE, "TRACE", ...args);
	}
	debug(...args) {
		return super.log(LogLevel.DEBUG, "DEBUG", ...args);
	}
	info(...args) {
		return super.log(LogLevel.INFO, "INFO", ...args);
	}
	warn(...args) {
		return super.log(LogLevel.WARN, "WARN", ...args);
	}
	error(...args) {
		return super.log(LogLevel.ERROR, "ERROR", ...args);
	}
	fatal(...args) {
		return super.log(LogLevel.FATAL, "FATAL", ...args);
	}
	/**
	*  Returns a child logger based on the current instance with inherited settings
	*
	* @param settings - Overwrite settings inherited from parent logger
	* @param logObj - Overwrite logObj for sub-logger
	*/
	getSubLogger(settings, logObj) {
		return super.getSubLogger(settings, logObj);
	}
	/**
	* Alias for {@link getSubLogger} (E2) — the pino/bunyan/winston `child(...)` convention. Returns a typed
	* `Logger<LogObj>` sub-logger with inherited, merged settings.
	*
	* @param settings - Overwrite settings inherited from parent logger
	* @param logObj - Overwrite logObj for sub-logger
	*/
	child(settings, logObj) {
		return super.getSubLogger(settings, logObj);
	}
	/**
	* Build a {@link Logger} from environment variables (E3): `TSLOG_LEVEL` → `minLevel`, `TSLOG_TYPE` →
	* `type`, `TSLOG_NAME` → `name` (plus `NO_COLOR`/`FORCE_COLOR`, already honored at normalize time). The
	* `overrides` are shallow-merged on top of the env-derived settings and win on any collision.
	*
	* @example TSLOG_LEVEL=WARN TSLOG_TYPE=json node app.js  →  Logger.fromEnv() // { minLevel: "WARN", type: "json" }
	*/
	static fromEnv(overrides) {
		return new Logger(settingsFromEnv(overrides));
	}
};
//#endregion
//#region src/infra/diagnostic-event-listener-presence.ts
/** Process-wide listener counts used to avoid telemetry work without consumers. */
const DIAGNOSTIC_EVENT_LISTENER_PRESENCE_KEY = Symbol.for("openclaw.diagnosticEventListenerPresence.v1");
function getDiagnosticEventListenerPresence() {
	const state = resolveGlobalSingleton(DIAGNOSTIC_EVENT_LISTENER_PRESENCE_KEY, () => ({
		broadInterestCount: 0,
		eventInterestDeltas: /* @__PURE__ */ new Map(),
		marker: DIAGNOSTIC_EVENT_LISTENER_PRESENCE_KEY,
		internalCount: 0,
		trustedCount: 0
	}));
	state.broadInterestCount ??= 0;
	state.eventInterestDeltas ??= /* @__PURE__ */ new Map();
	return state;
}
function isInternalDiagnosticEventInterested(interest, type, trusted) {
	return (!interest?.include || interest.include.includes(type)) && !interest?.exclude?.includes(type) && (!trusted || !interest?.includeTrusted || interest.includeTrusted.includes(type));
}
function hasInternalDiagnosticEventInterest(type) {
	const state = getDiagnosticEventListenerPresence();
	return state.broadInterestCount + (state.eventInterestDeltas.get(type) ?? 0) > 0;
}
//#endregion
//#region src/plugins/plugin-instance-invocation.ts
var InvocationFrame = class InvocationFrame {
	constructor(scopes, invocation = scopes.invocation) {
		this.invocation = invocation;
		this.metadataScope = scopes.metadataScope;
		this.cacheScope = scopes.cacheScope;
		this.sourceCaptureStorage = scopes.sourceCaptureStorage;
	}
	get runtimePluginId() {}
	withScopes(scopes) {
		return new InvocationFrame(scopes);
	}
};
/** Copy core scopes through the current owner so runtime-only fields survive. */
function createPluginExecutionFrame(scopes, current) {
	return current ? current.withScopes(scopes) : new InvocationFrame(scopes);
}
const pluginExecutionContext = resolveGlobalSingleton(Symbol.for("openclaw.pluginInstanceInvocation"), () => {
	const frames = new AsyncLocalStorage();
	return {
		invocation: {
			getStore() {
				return frames.getStore()?.invocation;
			},
			run(invocation, run) {
				const current = frames.getStore();
				return frames.run(current?.invocation === invocation ? current : createPluginExecutionFrame({
					...current,
					invocation
				}, current), run);
			},
			exit(run) {
				const current = frames.getStore();
				return current?.invocation ? frames.run(current.withScopes({
					...current,
					invocation: void 0
				}), run) : run();
			}
		},
		getFrame() {
			return frames.getStore();
		},
		runFrame(frame, run) {
			return frames.run(frame, run);
		}
	};
});
pluginExecutionContext.invocation;
const getPluginExecutionFrame = pluginExecutionContext.getFrame;
pluginExecutionContext.runFrame;
//#endregion
//#region src/shared/listeners.ts
/** Notifies every registered listener while isolating individual listener failures. */
function notifyListeners(listeners, event, onError) {
	for (const listener of listeners) try {
		listener(event);
	} catch (error) {
		onError?.(error);
	}
}
/** Registers a listener in a Set and returns an idempotent unsubscribe handle. */
function registerListener(listeners, listener) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}
//#endregion
//#region src/infra/diagnostic-event-snapshot.ts
function createDiagnosticMetadataForListener(metadata) {
	return Object.freeze({ ...metadata });
}
function cloneDiagnosticValueForListener(value) {
	return deepFreezeDiagnosticValue(structuredClone(value));
}
function deepFreezeDiagnosticValue(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (!value || typeof value !== "object") return value;
	if (seen.has(value)) return value;
	seen.add(value);
	for (const nested of Array.isArray(value) ? value : Object.values(value)) deepFreezeDiagnosticValue(nested, seen);
	return Object.freeze(value);
}
//#endregion
//#region src/infra/diagnostic-model-request-provenance.ts
const CORE_MODEL_REQUEST_LIFECYCLE_METADATA_KEY = "coreModelRequestLifecycle";
//#endregion
//#region src/infra/diagnostic-otel-listener-provenance.ts
const trustedOtelDiagnosticListeners = /* @__PURE__ */ new WeakSet();
function isTrustedOtelDiagnosticListener(listener) {
	return trustedOtelDiagnosticListeners.has(listener);
}
//#endregion
//#region src/infra/diagnostic-plugin-usage-provenance.ts
const hostPluginUsageIds = /* @__PURE__ */ new WeakMap();
function consumeHostPluginUsageDiagnosticEvent(event) {
	const hostPluginId = hostPluginUsageIds.get(event);
	hostPluginUsageIds.delete(event);
	return hostPluginId;
}
//#endregion
//#region src/infra/diagnostic-semantic-run-progress-provenance.ts
const CORE_SEMANTIC_RUN_PROGRESS_METADATA_KEY = "coreSemanticRunProgress";
const coreSemanticRunProgressEvents = /* @__PURE__ */ new WeakMap();
function consumeCoreSemanticRunProgressDiagnosticEvent(event) {
	const provenance = coreSemanticRunProgressEvents.get(event);
	coreSemanticRunProgressEvents.delete(event);
	return provenance;
}
//#endregion
//#region src/infra/diagnostic-tool-execution-liveness.ts
const TOOL_EXECUTION_LIVENESS_METADATA_KEY = "toolExecutionLiveness";
const state = resolveGlobalSingleton(Symbol.for("openclaw.diagnosticToolExecutionLiveness"), () => ({
	context: new AsyncLocalStorage(),
	events: /* @__PURE__ */ new WeakMap()
}));
function consumeToolExecutionLivenessDiagnosticEvent(event) {
	const liveness = state.events.get(event);
	state.events.delete(event);
	return liveness;
}
//#endregion
//#region src/infra/diagnostic-trace-context.ts
const TRACE_ID_RE = /^[0-9a-f]{32}$/;
const SPAN_ID_RE = /^[0-9a-f]{16}$/;
const TRACE_FLAGS_RE = /^[0-9a-f]{2}$/;
const DIAGNOSTIC_TRACE_SCOPE_STATE_KEY = Symbol.for("openclaw.diagnosticTraceScope.state.v1");
function isNonZeroHex(value) {
	return !/^0+$/.test(value);
}
function getDiagnosticTraceScopeState() {
	return resolveGlobalSingleton(DIAGNOSTIC_TRACE_SCOPE_STATE_KEY, () => ({
		marker: DIAGNOSTIC_TRACE_SCOPE_STATE_KEY,
		storage: new AsyncLocalStorage()
	}));
}
/** Returns whether a value is a non-zero W3C trace id. */
function isValidDiagnosticTraceId(value) {
	return typeof value === "string" && TRACE_ID_RE.test(value) && isNonZeroHex(value);
}
/** Returns whether a value is a non-zero W3C span id. */
function isValidDiagnosticSpanId(value) {
	return typeof value === "string" && SPAN_ID_RE.test(value) && isNonZeroHex(value);
}
/** Returns whether a value is a valid W3C trace-flags byte. */
function isValidDiagnosticTraceFlags(value) {
	return typeof value === "string" && TRACE_FLAGS_RE.test(value);
}
/** Returns the trace context bound to the current async scope. */
function getActiveDiagnosticTraceContext() {
	return getDiagnosticTraceScopeState().storage.getStore();
}
//#endregion
//#region src/infra/diagnostic-trace-propagation.ts
const DIAGNOSTIC_TRACE_PROPAGATION_STATE_KEY = Symbol.for("openclaw.diagnosticTracePropagation.state.v1");
function getDiagnosticTracePropagationState() {
	return resolveGlobalSingleton(DIAGNOSTIC_TRACE_PROPAGATION_STATE_KEY, () => ({
		marker: DIAGNOSTIC_TRACE_PROPAGATION_STATE_KEY,
		bridges: /* @__PURE__ */ new Set()
	}));
}
function activeDiagnosticTracePropagationBridge() {
	let active;
	for (const bridge of getDiagnosticTracePropagationState().bridges) active = bridge;
	return active;
}
function shouldPrepareDiagnosticTracePropagation(event) {
	const bridge = activeDiagnosticTracePropagationBridge();
	if (!bridge?.prepareEvent) return false;
	if (!bridge.shouldPrepareEvent) return true;
	try {
		return bridge.shouldPrepareEvent(event);
	} catch (error) {
		console.error(`[diagnostic-trace-propagation] prepare filter error: ${String(error)}`);
		return false;
	}
}
function prepareDiagnosticTracePropagation(event, metadata) {
	const bridge = activeDiagnosticTracePropagationBridge();
	if (!bridge?.prepareEvent) return;
	try {
		bridge.prepareEvent(event, metadata);
	} catch (error) {
		console.error(`[diagnostic-trace-propagation] prepare error type=${event.type} seq=${event.seq}: ${String(error)}`);
	}
}
//#endregion
//#region src/infra/worker-diagnostic-script.ts
const workerScriptNames = /* @__PURE__ */ new Set([
	...Object.values(createRuntimeProcessEntrypoints(import.meta.url)).map((entry) => basename(entry.distWorkerPath)),
	"catalog-page.worker.js",
	"code-mode.worker.js",
	"disk-budget.worker.js",
	"document-extractor.worker.js",
	"manager-index.worker.js",
	"manager-search.worker.js",
	"memory-index.worker.js",
	"memory-search.worker.js",
	"session-history.worker.js",
	"audio-worker.runtime.js",
	"realtime-quicksilver-audio.worker.js",
	"realtime-quicksilver-socket.worker.js",
	"telegram-ingress-worker.runtime.js"
]);
/** Imported diagnostics may contain arbitrary paths or names. Preserve only known scripts. */
function normalizeDiagnosticWorkerScript(value) {
	return typeof value === "string" && workerScriptNames.has(value) ? value : "other";
}
//#endregion
//#region src/infra/diagnostic-events.ts
const EMPTY_DIAGNOSTIC_PRIVATE_DATA = Object.freeze({});
const MAX_ASYNC_DIAGNOSTIC_EVENTS = 1e4;
const MAX_ASYNC_DIAGNOSTIC_EVENTS_PER_TURN = 100;
const DIAGNOSTIC_EVENTS_STATE_KEY = Symbol.for("openclaw.diagnosticEvents.state.v1");
const ASYNC_DIAGNOSTIC_EVENT_TYPES = /* @__PURE__ */ new Set([
	"worker.request",
	"diagnostic.gc",
	"gateway.event_loop.sample",
	"gateway.http.cancelled",
	"gateway.rpc",
	"tool.execution.started",
	"tool.execution.completed",
	"tool.execution.error",
	"tool.execution.blocked",
	"skill.used",
	"exec.process.completed",
	"exec.approval.followup_suppressed",
	"message.delivery.started",
	"message.delivery.completed",
	"message.delivery.error",
	"talk.event",
	"model.call.started",
	"model.call.completed",
	"model.call.error",
	"run.progress",
	"run.execution_phase",
	"agent.commentary",
	"harness.run.completed",
	"harness.run.error",
	"context.assembled",
	"log.record"
]);
const PRIORITY_ASYNC_DIAGNOSTIC_EVENT_TYPES = /* @__PURE__ */ new Set([
	"tool.execution.completed",
	"tool.execution.error",
	"tool.execution.blocked",
	"model.call.completed",
	"model.call.error",
	"harness.run.completed",
	"harness.run.error"
]);
function getDiagnosticEventsState() {
	const state = resolveGlobalSingleton(DIAGNOSTIC_EVENTS_STATE_KEY, () => ({
		marker: DIAGNOSTIC_EVENTS_STATE_KEY,
		enabled: true,
		seq: 0,
		listeners: /* @__PURE__ */ new Map(),
		trustedListeners: /* @__PURE__ */ new Map(),
		toolExecutionListeners: /* @__PURE__ */ new Set(),
		toolExecutionSeq: 0,
		dispatchDepth: 0,
		asyncQueue: [],
		asyncDrainScheduled: false,
		asyncDroppedEvents: 0,
		asyncDroppedTrustedEvents: 0,
		asyncDroppedUntrustedEvents: 0,
		asyncDroppedPriorityEvents: 0
	}));
	state.asyncDroppedEvents ??= 0;
	state.asyncDroppedTrustedEvents ??= 0;
	state.asyncDroppedUntrustedEvents ??= 0;
	state.asyncDroppedPriorityEvents ??= 0;
	state.toolExecutionListeners ??= /* @__PURE__ */ new Set();
	state.toolExecutionSeq ??= 0;
	return state;
}
/** Returns the current process-wide diagnostic dispatcher enable flag. */
function areDiagnosticsEnabledForProcess() {
	return getDiagnosticEventsState().enabled;
}
function dispatchDiagnosticEvent(state, enriched, metadata, privateData, options = {}) {
	if (state.dispatchDepth > 100) {
		console.error(`[diagnostic-events] recursion guard tripped at depth=${state.dispatchDepth}, dropping type=${enriched.type}`);
		return;
	}
	state.dispatchDepth += 1;
	try {
		if (!options.trustedListenersOnly) for (const [listener, interest] of state.listeners) {
			if (!isInternalDiagnosticEventInterested(interest, enriched.type, metadata.trusted)) continue;
			try {
				listener(cloneDiagnosticValueForListener(enriched), createDiagnosticMetadataForListener(metadata));
			} catch (err) {
				const errorMessage = err instanceof Error ? err.stack ?? err.message : String(err);
				console.error(`[diagnostic-events] listener error type=${enriched.type} seq=${enriched.seq}: ${errorMessage}`);
			}
		}
		for (const [listener, interest] of state.trustedListeners) {
			if (!isInternalDiagnosticEventInterested(interest, enriched.type, metadata.trusted)) continue;
			try {
				const eventForListener = cloneDiagnosticValueForListener(enriched);
				const metadataForListener = createDiagnosticMetadataForListener(metadata);
				if (interest?.includePrivateData === false) listener(eventForListener, metadataForListener, EMPTY_DIAGNOSTIC_PRIVATE_DATA);
				else if (isTrustedOtelDiagnosticListener(listener)) {
					const cloned = structuredClone(privateData ?? {});
					Reflect.deleteProperty(cloned, "hostPluginId");
					listener(eventForListener, metadataForListener, deepFreezeDiagnosticValue(options.hostPluginId ? Object.assign(cloned, { hostPluginId: options.hostPluginId }) : cloned));
				} else listener(eventForListener, metadataForListener, privateData ? cloneDiagnosticValueForListener(privateData) : Object.freeze({}));
			} catch (err) {
				const errorMessage = err instanceof Error ? err.stack ?? err.message : String(err);
				console.error(`[diagnostic-events] trusted listener error type=${enriched.type} seq=${enriched.seq}: ${errorMessage}`);
			}
		}
	} finally {
		state.dispatchDepth -= 1;
	}
}
function isPriorityAsyncDiagnosticEvent(entry) {
	return entry.metadata.trusted && PRIORITY_ASYNC_DIAGNOSTIC_EVENT_TYPES.has(entry.event.type);
}
function noteAsyncDiagnosticDrop(state, entry) {
	state.asyncDroppedEvents += 1;
	if (entry.metadata.trusted) state.asyncDroppedTrustedEvents += 1;
	else state.asyncDroppedUntrustedEvents += 1;
	if (isPriorityAsyncDiagnosticEvent(entry)) state.asyncDroppedPriorityEvents += 1;
}
function makeRoomForPriorityAsyncDiagnosticEvent(state) {
	const nonPriorityIndex = state.asyncQueue.findIndex((entry) => !isPriorityAsyncDiagnosticEvent(entry));
	if (nonPriorityIndex >= 0) return state.asyncQueue.splice(nonPriorityIndex, 1)[0];
	return state.asyncQueue.shift();
}
function scheduleAsyncDiagnosticDrain(state) {
	if (state.asyncDrainScheduled) return;
	state.asyncDrainScheduled = true;
	setImmediate(() => {
		state.asyncDrainScheduled = false;
		const batch = state.asyncQueue.splice(0, MAX_ASYNC_DIAGNOSTIC_EVENTS_PER_TURN);
		for (const entry of batch) dispatchDiagnosticEvent(state, entry.event, entry.metadata, entry.privateData, entry);
		if (state.asyncQueue.length > 0) {
			scheduleAsyncDiagnosticDrain(state);
			return;
		}
		dispatchAsyncDiagnosticDropSummary(state);
	});
}
function dispatchAsyncDiagnosticDropSummary(state) {
	if (state.asyncDroppedEvents <= 0) return;
	const droppedEvents = state.asyncDroppedEvents;
	const droppedTrustedEvents = state.asyncDroppedTrustedEvents;
	const droppedUntrustedEvents = state.asyncDroppedUntrustedEvents;
	const droppedPriorityEvents = state.asyncDroppedPriorityEvents;
	state.asyncDroppedEvents = 0;
	state.asyncDroppedTrustedEvents = 0;
	state.asyncDroppedUntrustedEvents = 0;
	state.asyncDroppedPriorityEvents = 0;
	dispatchDiagnosticEvent(state, enrichDiagnosticEvent(state, {
		type: "diagnostic.async_queue.dropped",
		droppedEvents,
		...droppedTrustedEvents > 0 ? { droppedTrustedEvents } : {},
		...droppedUntrustedEvents > 0 ? { droppedUntrustedEvents } : {},
		...droppedPriorityEvents > 0 ? { droppedPriorityEvents } : {},
		queueLength: state.asyncQueue.length,
		maxQueueLength: MAX_ASYNC_DIAGNOSTIC_EVENTS,
		drainBatchSize: MAX_ASYNC_DIAGNOSTIC_EVENTS_PER_TURN
	}), createInternalDiagnosticMetadata(false));
}
function enrichDiagnosticEvent(state, event) {
	const enriched = {};
	for (const [key, value] of Object.entries(event)) {
		if (isBlockedObjectKey(key)) continue;
		enriched[key] = value;
	}
	enriched.trace ??= getActiveDiagnosticTraceContext();
	state.seq += 1;
	enriched.seq = state.seq;
	enriched.ts = Date.now();
	return enriched;
}
function createInternalDiagnosticMetadata(trusted) {
	return {
		internal: true,
		trusted
	};
}
function emitDiagnosticEventWithTrust(event, trusted, options = {}) {
	const state = getDiagnosticEventsState();
	if (trusted && isToolExecutionEventInput(event)) dispatchTrustedToolExecutionEvent(state, event);
	if (!state.enabled) return;
	if (event.type === "security.event" && options.allowSecurityEvent !== true) return;
	const enriched = enrichDiagnosticEvent(state, event);
	if (trusted && enriched.type === "diagnostic.gc") {
		switch (enriched.kind) {
			case "scavenge":
			case "mark_sweep_compact":
			case "incremental":
			case "weak_processing": break;
			default: enriched.kind = void 0;
		}
		enriched.thread = enriched.thread === void 0 || enriched.thread === "main" ? "main" : normalizeDiagnosticWorkerScript(enriched.thread);
		if (enriched.thread !== "code-mode-node.worker.js" || typeof enriched.workerSlot !== "number" || !Number.isInteger(enriched.workerSlot) || enriched.workerSlot < 1 || enriched.workerSlot > 64) enriched.workerSlot = void 0;
	}
	const { hostPluginId, internal = false, privateData } = options;
	const trustedTraceContext = options.trustedTraceContext === true;
	const metadata = {
		...internal ? createInternalDiagnosticMetadata(trusted) : { trusted },
		...options.toolExecutionLiveness ? { [TOOL_EXECUTION_LIVENESS_METADATA_KEY]: options.toolExecutionLiveness } : {},
		...options.coreModelRequestLifecycle ? { [CORE_MODEL_REQUEST_LIFECYCLE_METADATA_KEY]: options.coreModelRequestLifecycle } : {},
		...options.coreSemanticRunProgress ? { [CORE_SEMANTIC_RUN_PROGRESS_METADATA_KEY]: options.coreSemanticRunProgress } : {},
		...trustedTraceContext ? { trustedTraceContext } : {}
	};
	const prepareTracePropagation = trusted && !options.queuedPhase && shouldPrepareDiagnosticTracePropagation(enriched);
	const queued = options.queuedPhase || ASYNC_DIAGNOSTIC_EVENT_TYPES.has(enriched.type);
	if (queued) {
		if (state.asyncQueue.length >= MAX_ASYNC_DIAGNOSTIC_EVENTS) {
			if (!trusted || !PRIORITY_ASYNC_DIAGNOSTIC_EVENT_TYPES.has(enriched.type)) {
				noteAsyncDiagnosticDrop(state, {
					event: enriched,
					metadata,
					privateData,
					hostPluginId
				});
				return;
			}
			const droppedEntry = makeRoomForPriorityAsyncDiagnosticEvent(state);
			if (droppedEntry) noteAsyncDiagnosticDrop(state, droppedEntry);
		}
		state.asyncQueue.push({
			event: enriched,
			metadata,
			privateData,
			hostPluginId
		});
	}
	if (prepareTracePropagation) prepareDiagnosticTracePropagation(cloneDiagnosticValueForListener(enriched), createDiagnosticMetadataForListener(metadata));
	if (queued) scheduleAsyncDiagnosticDrain(state);
	else dispatchDiagnosticEvent(state, enriched, metadata, privateData, { hostPluginId });
}
function isToolExecutionEventInput(event) {
	return event.type === "tool.execution.started" || event.type === "tool.execution.completed" || event.type === "tool.execution.error" || event.type === "tool.execution.blocked";
}
function dispatchTrustedToolExecutionEvent(state, event) {
	state.toolExecutionSeq += 1;
	let enriched;
	try {
		enriched = cloneDiagnosticValueForListener({
			...event,
			seq: state.toolExecutionSeq,
			ts: Date.now()
		});
	} catch (error) {
		console.error(`[diagnostic-events] tool execution clone error type=${event.type}: ${String(error)}`);
		return;
	}
	notifyListeners(state.toolExecutionListeners, enriched, (error) => {
		console.error(`[diagnostic-events] tool execution listener error type=${enriched.type} seq=${enriched.seq}: ${String(error)}`);
	});
}
/** Emits an untrusted diagnostic event from external/plugin-facing code. */
function emitDiagnosticEvent(event) {
	emitDiagnosticEventWithTrust(event, false);
}
/** Emits an untrusted event whose trace context came from OpenClaw-owned scope. */
function emitDiagnosticEventWithTrustedTraceContext(event) {
	emitDiagnosticEventWithTrust(event, false, { trustedTraceContext: true });
}
/** Emits a trusted diagnostic event from core/runtime-owned instrumentation. */
function emitTrustedDiagnosticEvent(event) {
	const toolExecutionLiveness = consumeToolExecutionLivenessDiagnosticEvent(event);
	const hostPluginId = consumeHostPluginUsageDiagnosticEvent(event);
	const coreSemanticRunProgress = consumeCoreSemanticRunProgressDiagnosticEvent(event);
	emitDiagnosticEventWithTrust(event, true, {
		...toolExecutionLiveness ? { toolExecutionLiveness } : {},
		...hostPluginId ? {
			hostPluginId,
			internal: true
		} : {},
		...coreSemanticRunProgress ? { coreSemanticRunProgress } : {}
	});
}
//#endregion
//#region src/infra/tmp-openclaw-dir.ts
/** Preferred shared OpenClaw temp root on POSIX systems when ownership and permissions are safe. */
const DEFAULT_POSIX_TMP_ROOT = "/tmp/openclaw";
let resolveSecureTempRootRuntime;
function loadResolveSecureTempRoot() {
	if (resolveSecureTempRootRuntime) return resolveSecureTempRootRuntime;
	if (typeof SEALED_RUNTIME_BUILD === "boolean" && SEALED_RUNTIME_BUILD) throw new Error("sealed temp-root runtime was not registered before use");
	if (typeof process.getBuiltinModule !== "function") throw new Error("Node module loading is unavailable for secure temp-root resolution");
	resolveSecureTempRootRuntime = process.getBuiltinModule("module").createRequire(import.meta.url)("@openclaw/fs-safe/secure-temp-root").resolveSecureTempRoot;
	return resolveSecureTempRootRuntime;
}
/** Resolves a safe OpenClaw temp root, falling back to user-scoped os.tmpdir paths when needed. */
function resolvePreferredOpenClawTmpDir(options = {}) {
	return loadResolveSecureTempRoot()({
		...options,
		preferredDir: options.preferredDir ?? "/tmp/openclaw",
		fallbackPrefix: "openclaw",
		warningPrefix: "[openclaw]",
		unsafeFallbackLabel: "OpenClaw temp dir",
		skipPreferredOnWindows: true
	});
}
//#endregion
//#region src/logging/log-file-shared.ts
const LOG_PREFIX = "openclaw";
const LOG_SUFFIX = ".log";
function canUseNodeFs() {
	try {
		return process.getBuiltinModule?.("fs") !== void 0;
	} catch {
		return false;
	}
}
function formatLocalDate(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
//#endregion
//#region src/logging/log-file-path.ts
const ROLLING_LOG_FILE_RE = /^(openclaw(?:-[a-z0-9-]+)?)-(\d{4}-\d{2}-\d{2})\.log$/u;
const MAX_LOG_PROFILE_SEGMENT_LENGTH = 220;
function encodeLogProfileSegment(profile) {
	let encoded = "";
	for (const char of profile) if (/^[a-z0-9]$/u.test(char)) encoded += char;
	else if (char === "-") encoded += "--";
	else if (char === "_") encoded += "-0";
	else if (/^[A-Z]$/u.test(char)) encoded += `-1${char.toLowerCase()}`;
	else encoded += `-2${char.codePointAt(0)?.toString(16) ?? "0"}-`;
	return encoded;
}
function resolveLogProfileSegment(env) {
	const profile = env.OPENCLAW_PROFILE?.trim();
	if (!profile || profile.toLowerCase() === "default") return null;
	const encoded = encodeLogProfileSegment(profile);
	if (encoded.length <= MAX_LOG_PROFILE_SEGMENT_LENGTH) return encoded;
	return `-3${createHash("sha256").update(profile).digest("hex")}`;
}
/** Resolves today's default rolling log path for the active CLI profile. */
function resolveDefaultRollingLogFile(options) {
	const date = options?.date ?? /* @__PURE__ */ new Date();
	const env = options?.env ?? process.env;
	const logDir = options?.logDir ?? (canUseNodeFs() ? resolvePreferredOpenClawTmpDir() : "/tmp/openclaw");
	const profileSegment = resolveLogProfileSegment(env);
	const profileSuffix = profileSegment ? `-${profileSegment}` : "";
	return path.join(logDir, `${LOG_PREFIX}${profileSuffix}-${formatLocalDate(date)}${LOG_SUFFIX}`);
}
/** Returns whether a configured path had the legacy default rolling filename shape. */
function isLegacyRollingLogFilePath(file) {
	const base = path.basename(file);
	return base === `openclaw-YYYY-MM-DD.log` || ROLLING_LOG_FILE_RE.exec(base)?.[1] === "openclaw";
}
/** Advances a rolling log path to the requested date while preserving its profile family. */
function resolveRollingLogFilePathForDate(file, date) {
	const match = ROLLING_LOG_FILE_RE.exec(path.basename(file));
	if (!match) return isLegacyRollingLogFilePath(file) ? path.join(path.dirname(file), `${LOG_PREFIX}-${formatLocalDate(date)}${LOG_SUFFIX}`) : file;
	return path.join(path.dirname(file), `${match[1]}-${formatLocalDate(date)}${LOG_SUFFIX}`);
}
//#endregion
//#region src/logging/logger-file-transport.ts
const DEFAULT_MAX_QUEUED_RECORDS = 4096;
const MAX_APPEND_BATCH_BYTES = 65536;
const MAX_ROTATED_LOG_FILES = 5;
const MAX_TRACKED_APPEND_FAILURE_FILES = 64;
let queue = [];
let queueStart = 0;
let activeBatch = null;
let activeIndex = 0;
let droppedCount = 0;
let droppedTarget = null;
let maxQueuedRecords = DEFAULT_MAX_QUEUED_RECORDS;
let scheduledFlush = null;
let flushPromise = null;
let drainGeneration = 0;
let processExiting = false;
let processHooksInstalled = false;
let appendFile = appendRegularFile;
const warnedRotationFiles = /* @__PURE__ */ new Map();
const warnedAppendFiles = /* @__PURE__ */ new Set();
let appendFailureTrackingSaturated = false;
function rotatedLogPath(file, index) {
	const ext = path.extname(file);
	return `${file.slice(0, file.length - ext.length)}.${index}${ext}`;
}
/**
* Creates a log directory and its missing parents with a bounded number of mkdir calls.
* Node's recursive mkdirSync retries forever when a parent exists but refuses new
* children (a deleted directory that is still mounted, such as a stale systemd
* PrivateTmp), which would block the event loop inside the logger.
*/
function ensureLogDirectorySync(dir, createParents = true) {
	try {
		fs.mkdirSync(dir);
	} catch (error) {
		const code = extractErrorCode(error);
		if (code === "EEXIST" && fs.statSync(dir).isDirectory()) return;
		const parent = path.dirname(dir);
		if (!createParents || code !== "ENOENT" || parent === dir) throw error;
		ensureLogDirectorySync(parent);
		ensureLogDirectorySync(dir, false);
	}
}
function rotateLogFile(file) {
	try {
		ensureLogDirectorySync(path.dirname(file));
		fs.rmSync(rotatedLogPath(file, MAX_ROTATED_LOG_FILES), { force: true });
		for (let index = 4; index >= 1; index -= 1) {
			const from = rotatedLogPath(file, index);
			if (fs.existsSync(from)) fs.renameSync(from, rotatedLogPath(file, index + 1));
		}
		if (fs.existsSync(file)) fs.renameSync(file, rotatedLogPath(file, 1));
		return true;
	} catch {
		return false;
	}
}
async function getCurrentLogFileBytes(file) {
	try {
		return (await fs$1.stat(file)).size;
	} catch {
		return 0;
	}
}
function getCurrentLogFileBytesSync(file) {
	try {
		return fs.statSync(file).size;
	} catch {
		return 0;
	}
}
function buildDroppedMarker(target, count) {
	const date = /* @__PURE__ */ new Date();
	const message = `[openclaw] file log queue overflow; dropped ${count} oldest record${count === 1 ? "" : "s"}`;
	const record = {
		0: message,
		_meta: {
			date,
			hostname: target.hostname,
			logLevelName: "WARN",
			name: "openclaw"
		},
		time: formatTimestamp(date, { style: "long" }),
		hostname: target.hostname,
		message,
		dropped: count
	};
	return {
		...target,
		payload: `${JSON.stringify(record)}\n`
	};
}
function writeFileTransportWarning(message, synchronous) {
	try {
		const line = `${formatConsoleDiagnosticLine({
			level: "warn",
			message: redactSensitiveText(message)
		})}\n`;
		if (synchronous) fs.writeSync(process.stderr.fd, line);
		else process.stderr.write(line);
		return true;
	} catch {
		return false;
	}
}
function warnAboutRotationFailure(entry, synchronous) {
	if (warnedRotationFiles.get(entry.file) === entry.maxFileBytes) return;
	warnedRotationFiles.set(entry.file, entry.maxFileBytes);
	writeFileTransportWarning(`[openclaw] log file rotation failed; continuing writes file=${entry.file} maxFileBytes=${entry.maxFileBytes}`, synchronous);
}
function warnAboutAppendFailure(entry, synchronous) {
	if (warnedAppendFiles.has(entry.file)) return;
	const saturated = warnedAppendFiles.size >= MAX_TRACKED_APPEND_FAILURE_FILES;
	if (saturated && appendFailureTrackingSaturated) return;
	if (!writeFileTransportWarning(saturated ? "[openclaw] log file append failure diagnostics saturated; suppressing new file targets" : `[openclaw] log file append failed; records dropped; check that the path is a writable regular file; file=${entry.file}`, synchronous)) return;
	if (saturated) appendFailureTrackingSaturated = true;
	else warnedAppendFiles.add(entry.file);
}
function clearAppendFailure(entry) {
	if (warnedAppendFiles.delete(entry.file)) appendFailureTrackingSaturated = false;
}
function claimQueuedEntries() {
	const entries = queueStart === 0 ? queue : [...queue.slice(queueStart), ...queue.slice(0, queueStart)];
	queue = [];
	queueStart = 0;
	if (droppedCount > 0 && droppedTarget) entries.unshift(buildDroppedMarker(droppedTarget, droppedCount));
	droppedCount = 0;
	droppedTarget = null;
	return entries;
}
function prepareWrite(entry, cursor, synchronous, entries, index) {
	let payloadBytes = Buffer.byteLength(entry.payload, "utf8");
	if (cursor.bytes > 0 && cursor.bytes + payloadBytes > entry.maxFileBytes) {
		if (rotateLogFile(entry.file)) {
			cursor.bytes = 0;
			warnedRotationFiles.delete(entry.file);
		} else warnAboutRotationFailure(entry, synchronous);
	}
	let nextIndex = index + 1;
	if (synchronous) return {
		payload: entry.payload,
		payloadBytes,
		nextIndex
	};
	const payloads = [entry.payload];
	for (; nextIndex < entries.length; nextIndex += 1) {
		const next = entries[nextIndex];
		if (!next || next.file !== entry.file || next.maxFileBytes !== entry.maxFileBytes) break;
		const nextBytes = Buffer.byteLength(next.payload, "utf8");
		if (payloadBytes + nextBytes > MAX_APPEND_BATCH_BYTES || cursor.bytes + payloadBytes + nextBytes > entry.maxFileBytes) break;
		payloads.push(next.payload);
		payloadBytes += nextBytes;
	}
	return {
		payload: payloads.join(""),
		payloadBytes,
		nextIndex
	};
}
async function writeEntries(entries, generation) {
	const cursors = /* @__PURE__ */ new Map();
	for (let index = 0; index < entries.length;) {
		if (generation !== drainGeneration || processExiting) return;
		const entry = entries[index];
		if (!entry) return;
		let cursor = cursors.get(entry.file);
		if (!cursor) {
			cursor = { bytes: await getCurrentLogFileBytes(entry.file) };
			if (generation !== drainGeneration || processExiting) return;
			cursors.set(entry.file, cursor);
		}
		const batch = prepareWrite(entry, cursor, false, entries, index);
		activeIndex = batch.nextIndex;
		try {
			await appendFile({
				filePath: entry.file,
				content: batch.payload
			});
			cursor.bytes += batch.payloadBytes;
			clearAppendFailure(entry);
		} catch {
			warnAboutAppendFailure(entry, false);
		} finally {
			for (const written of entries.slice(index, batch.nextIndex)) written.payload = "";
			index = batch.nextIndex;
		}
	}
}
function writeEntriesSync(entries) {
	const cursors = /* @__PURE__ */ new Map();
	for (let index = 0; index < entries.length;) {
		const entry = entries[index];
		if (!entry) return;
		let cursor = cursors.get(entry.file);
		if (!cursor) {
			cursor = { bytes: getCurrentLogFileBytesSync(entry.file) };
			cursors.set(entry.file, cursor);
		}
		const batch = prepareWrite(entry, cursor, true, entries, index);
		try {
			appendRegularFileSync({
				filePath: entry.file,
				content: batch.payload
			});
			cursor.bytes += batch.payloadBytes;
			clearAppendFailure(entry);
		} catch {
			warnAboutAppendFailure(entry, true);
		}
		entry.payload = "";
		index = batch.nextIndex;
	}
}
async function runFlushLoop() {
	const generation = drainGeneration;
	for (;;) {
		if (generation !== drainGeneration || processExiting) return;
		const entries = claimQueuedEntries();
		if (entries.length === 0) return;
		activeBatch = entries;
		activeIndex = 0;
		await writeEntries(entries, generation);
		if (generation !== drainGeneration) return;
		activeBatch = null;
		activeIndex = 0;
	}
}
function startFlush() {
	if (flushPromise || processExiting) return;
	const running = runFlushLoop().catch(() => void 0);
	flushPromise = running;
	running.then(() => {
		if (flushPromise === running) flushPromise = null;
		if (queue.length > 0 || droppedCount > 0) scheduleFlush();
	});
}
function scheduleFlush() {
	if (scheduledFlush || flushPromise || processExiting) return;
	scheduledFlush = setImmediate(() => {
		scheduledFlush = null;
		startFlush();
	});
}
function handleProcessBeforeExit() {
	flushFileLogQueue();
}
function handleProcessExit() {
	processExiting = true;
	drainFileLogQueueSync();
}
function installProcessHooks() {
	if (processHooksInstalled) return;
	processHooksInstalled = true;
	process.on("beforeExit", handleProcessBeforeExit);
	process.on("exit", handleProcessExit);
}
function removeProcessHooks() {
	if (!processHooksInstalled) return;
	process.removeListener("beforeExit", handleProcessBeforeExit);
	process.removeListener("exit", handleProcessExit);
	processHooksInstalled = false;
}
/** Enqueues one serialized record without waiting for filesystem I/O. */
function enqueueFileLog(entry) {
	if (processExiting) {
		writeEntriesSync([entry]);
		return;
	}
	installProcessHooks();
	if (queue.length >= maxQueuedRecords) {
		const dropped = queue[queueStart];
		if (dropped) {
			dropped.payload = "";
			droppedTarget ??= dropped;
			droppedCount += 1;
		}
		queue[queueStart] = entry;
		queueStart = (queueStart + 1) % queue.length;
	} else queue.push(entry);
	scheduleFlush();
}
/** Waits until every record currently queued for the async transport has settled. */
async function flushFileLogQueue() {
	for (;;) {
		if (scheduledFlush) {
			clearImmediate(scheduledFlush);
			scheduledFlush = null;
		}
		if (!flushPromise && (queue.length > 0 || droppedCount > 0)) startFlush();
		const running = flushPromise;
		if (!running) return;
		await running;
	}
}
/** Synchronously rescues pending records for process.exit() and crash-adjacent paths. */
function drainFileLogQueueSync() {
	if (scheduledFlush) {
		clearImmediate(scheduledFlush);
		scheduledFlush = null;
	}
	drainGeneration += 1;
	const entries = activeBatch ? activeBatch.slice(activeIndex) : [];
	activeBatch = null;
	activeIndex = 0;
	entries.push(...claimQueuedEntries());
	writeEntriesSync(entries);
}
function setFileLogQueueMaxRecordsForTests(value) {
	maxQueuedRecords = Math.max(1, value ?? DEFAULT_MAX_QUEUED_RECORDS);
}
function setFileLogAppenderForTests(value) {
	appendFile = value ?? appendRegularFile;
}
function resetFileLogTransportForTests() {
	drainFileLogQueueSync();
	removeProcessHooks();
	processExiting = false;
	appendFile = appendRegularFile;
	maxQueuedRecords = DEFAULT_MAX_QUEUED_RECORDS;
	warnedRotationFiles.clear();
	warnedAppendFiles.clear();
	appendFailureTrackingSaturated = false;
}
const fileLogTransport = resolveGlobalSingleton(Symbol.for("openclaw.fileLogTransport"), () => {
	if (process.env.VITEST !== "true") installProcessHooks();
	return {
		drainSync: drainFileLogQueueSync,
		enqueue: enqueueFileLog,
		flush: flushFileLogQueue,
		resetForTests: resetFileLogTransportForTests,
		setAppenderForTests: setFileLogAppenderForTests,
		setMaxQueuedRecordsForTests: setFileLogQueueMaxRecordsForTests
	};
});
//#endregion
//#region src/logging/logger.ts
const DEFAULT_LOG_FILE = `${DEFAULT_POSIX_TMP_ROOT}/openclaw.log`;
const MAX_LOG_AGE_MS = 864e5;
const DEFAULT_MAX_LOG_FILE_BYTES = 104857600;
let cachedHostname = null;
const MAX_DIAGNOSTIC_LOG_BINDINGS_JSON_CHARS = 8192;
const MAX_DIAGNOSTIC_LOG_MESSAGE_CHARS = 4096;
const MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT = 32;
const MAX_DIAGNOSTIC_LOG_ATTRIBUTE_VALUE_CHARS = 2048;
const MAX_DIAGNOSTIC_LOG_NAME_CHARS = 120;
const MAX_FILE_LOG_CONTEXT_VALUE_CHARS = 512;
const DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE = /^[A-Za-z0-9_.:-]{1,64}$/u;
function clampLogText(value, maxChars) {
	return value.length > maxChars ? `${truncateUtf16Safe(value, maxChars)}...(truncated)` : value;
}
function sanitizeDiagnosticLogText(value, maxChars) {
	return clampLogText(redactSensitiveText(clampLogText(value, maxChars)), maxChars);
}
function normalizeDiagnosticLogName(value) {
	if (!value || value.trim().startsWith("{")) return;
	const sanitized = sanitizeDiagnosticLogText(value.trim(), MAX_DIAGNOSTIC_LOG_NAME_CHARS);
	return DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE.test(sanitized) ? sanitized : void 0;
}
function assignDiagnosticLogAttribute(attributes, state, key, value) {
	if (state.count >= MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT) return;
	const normalizedKey = key.trim();
	if (isBlockedObjectKey(normalizedKey)) return;
	if (redactSensitiveText(normalizedKey) !== normalizedKey) return;
	if (!DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE.test(normalizedKey)) return;
	let attribute;
	if (typeof value === "string") attribute = sanitizeDiagnosticLogText(value, MAX_DIAGNOSTIC_LOG_ATTRIBUTE_VALUE_CHARS);
	else if (typeof value === "boolean" || typeof value === "number" && Number.isFinite(value)) attribute = value;
	else return;
	attributes[normalizedKey] = attribute;
	state.count += 1;
}
function addDiagnosticLogAttributesFrom(attributes, state, source) {
	if (!source) return;
	for (const key in source) {
		if (state.count >= MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT) break;
		if (!Object.hasOwn(source, key) || key === "trace") continue;
		assignDiagnosticLogAttribute(attributes, state, key, source[key]);
	}
}
function isPlainLogRecordObject(value) {
	if (!isRecord(value)) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}
function normalizeTraceContext(value) {
	const candidate = asOptionalRecord(value);
	if (!candidate || !isValidDiagnosticTraceId(candidate.traceId)) return;
	if (candidate.spanId !== void 0 && !isValidDiagnosticSpanId(candidate.spanId)) return;
	if (candidate.parentSpanId !== void 0 && !isValidDiagnosticSpanId(candidate.parentSpanId)) return;
	if (candidate.traceFlags !== void 0 && !isValidDiagnosticTraceFlags(candidate.traceFlags)) return;
	return {
		traceId: candidate.traceId,
		...candidate.spanId ? { spanId: candidate.spanId } : {},
		...candidate.parentSpanId ? { parentSpanId: candidate.parentSpanId } : {},
		...candidate.traceFlags ? { traceFlags: candidate.traceFlags } : {}
	};
}
function extractTraceContext(value) {
	return normalizeTraceContext(value) ?? normalizeTraceContext(asOptionalRecord(value)?.trace);
}
function getSortedNumericLogEntries(logObj) {
	return Object.entries(logObj).filter(([key]) => /^\d+$/.test(key)).toSorted((a, b) => Number(a[0]) - Number(b[0]));
}
function normalizeFileLogContextValue(value) {
	if (typeof value === "string") {
		const normalized = value.trim();
		return normalized ? clampLogText(normalized, MAX_FILE_LOG_CONTEXT_VALUE_CHARS) : void 0;
	}
	if (typeof value === "boolean" || typeof value === "number" && Number.isFinite(value)) return String(value);
}
function readFirstContextString(sources, keys) {
	for (const source of sources) {
		if (!source) continue;
		for (const key of keys) {
			const value = normalizeFileLogContextValue(source[key]);
			if (value) return value;
		}
	}
}
function resolveLogHostname() {
	if (cachedHostname) return cachedHostname;
	const hostname = os.hostname().trim();
	if (!hostname) return "unknown";
	cachedHostname = hostname;
	return hostname;
}
function withResolvedLogMetaHostname(meta, hostname) {
	return isRecord(meta) ? {
		...meta,
		hostname
	} : meta;
}
function extractLogBindingPrefix(numericArgs) {
	if (typeof numericArgs[0] === "string" && numericArgs[0].length <= MAX_DIAGNOSTIC_LOG_BINDINGS_JSON_CHARS && numericArgs[0].trim().startsWith("{")) try {
		const parsed = JSON.parse(numericArgs[0]);
		if (isRecord(parsed)) return {
			bindings: parsed,
			args: numericArgs.slice(1)
		};
	} catch {}
	return { args: numericArgs };
}
function resolveLogTraceContext(bindings, numericArgs) {
	for (const value of [bindings, ...numericArgs]) {
		const trace = extractTraceContext(value);
		if (trace) return {
			trace,
			trustedTraceContext: false
		};
	}
	const activeTrace = getActiveDiagnosticTraceContext();
	return activeTrace ? {
		trace: activeTrace,
		trustedTraceContext: true
	} : { trustedTraceContext: false };
}
function prepareFileLogRecord(logObj) {
	const entries = getSortedNumericLogEntries(logObj);
	const { bindings, args } = extractLogBindingPrefix(entries.map(([, value]) => value));
	const { trace } = resolveLogTraceContext(bindings, args);
	const structuredArg = isPlainLogRecordObject(args[0]) ? args[0] : void 0;
	const sources = [
		structuredArg,
		bindings,
		logObj
	];
	const metadataCount = structuredArg && typeof structuredArg.message !== "string" ? 1 : 0;
	const messageParts = entries.slice(entries.length - args.length + metadataCount).map(([key, value]) => {
		const part = {
			key,
			json: value != null && ![
				"string",
				"number",
				"boolean",
				"bigint"
			].includes(typeof value) && !(value instanceof Error) && !(isPlainLogRecordObject(value) && typeof value.message === "string")
		};
		if (typeof value === "number" && !Number.isFinite(value)) part.primitiveText = String(value);
		return part;
	});
	const agentId = readFirstContextString(sources, ["agent_id", "agentId"]);
	const sessionId = readFirstContextString(sources, [
		"session_id",
		"sessionId",
		"sessionKey"
	]);
	const channel = readFirstContextString(sources, ["channel", "messageProvider"]);
	return {
		fields: {
			hostname: resolveLogHostname(),
			...agentId ? { agent_id: agentId } : {},
			...sessionId ? { session_id: sessionId } : {},
			...channel ? { channel } : {},
			...trace
		},
		messageParts
	};
}
function buildDiagnosticLogRecord(logObj) {
	const meta = logObj["_meta"];
	const { bindings, args: numericArgs } = extractLogBindingPrefix(getSortedNumericLogEntries(logObj).map(([, value]) => value));
	const { trace, trustedTraceContext } = resolveLogTraceContext(bindings, numericArgs);
	const structuredArg = numericArgs[0];
	const structuredBindings = isPlainLogRecordObject(structuredArg) ? structuredArg : void 0;
	if (structuredBindings) numericArgs.shift();
	let message = "";
	if (numericArgs.length > 0 && typeof numericArgs[numericArgs.length - 1] === "string") message = sanitizeDiagnosticLogText(String(numericArgs.pop()), MAX_DIAGNOSTIC_LOG_MESSAGE_CHARS);
	else if (numericArgs.length === 1 && (typeof numericArgs[0] === "number" || typeof numericArgs[0] === "boolean")) {
		message = String(numericArgs[0]);
		numericArgs.length = 0;
	}
	if (!message) message = "log";
	const attributes = Object.create(null);
	const attributeState = { count: 0 };
	addDiagnosticLogAttributesFrom(attributes, attributeState, bindings);
	addDiagnosticLogAttributesFrom(attributes, attributeState, structuredBindings);
	const code = {};
	if (meta?.path?.fileLine) {
		const line = Number(meta.path.fileLine);
		if (Number.isFinite(line)) code.line = line;
	}
	if (meta?.path?.method) code.functionName = sanitizeDiagnosticLogText(meta.path.method, MAX_DIAGNOSTIC_LOG_NAME_CHARS);
	const loggerName = normalizeDiagnosticLogName(meta?.name);
	const loggerParents = meta?.parentNames?.map(normalizeDiagnosticLogName).filter((name) => Boolean(name));
	return {
		event: {
			type: "log.record",
			level: meta?.logLevelName ?? "INFO",
			message,
			...loggerName ? { loggerName } : {},
			...loggerParents?.length ? { loggerParents } : {},
			...Object.keys(attributes).length > 0 ? { attributes } : {},
			...Object.keys(code).length > 0 ? { code } : {},
			...trace ? { trace } : {}
		},
		trustedTraceContext
	};
}
function attachDiagnosticEventTransport(logger) {
	logger.attachTransport({
		format: () => "",
		write: (logObj) => {
			if (!areDiagnosticsEnabledForProcess() || !hasInternalDiagnosticEventInterest("log.record")) return;
			try {
				const record = buildDiagnosticLogRecord(redactSecrets(logObj));
				(record.trustedTraceContext ? emitDiagnosticEventWithTrustedTraceContext : emitDiagnosticEvent)(record.event);
			} catch {}
		}
	});
}
function canUseSilentVitestFileLogFastPath(envLevel) {
	return process.env.VITEST === "true" && process.env.OPENCLAW_TEST_FILE_LOG !== "1" && !envLevel && !loggingState.overrideSettings;
}
function resolveDefaultActiveLogFile() {
	if (process.env.VITEST === "true" && process.env.OPENCLAW_TEST_FILE_LOG === "1") return path.join(process.cwd(), ".artifacts", "test-logs", `${LOG_PREFIX}-vitest-${process.pid}-${formatLocalDate(/* @__PURE__ */ new Date())}${LOG_SUFFIX}`);
	return resolveDefaultRollingLogFile();
}
function resolveSettings() {
	if (!canUseNodeFs()) return {
		level: "silent",
		file: DEFAULT_LOG_FILE,
		maxFileBytes: DEFAULT_MAX_LOG_FILE_BYTES,
		rolling: false
	};
	const envLevel = resolveEnvLogLevelOverride();
	if (canUseSilentVitestFileLogFastPath(envLevel)) return {
		level: "silent",
		file: resolveDefaultRollingLogFile(),
		maxFileBytes: DEFAULT_MAX_LOG_FILE_BYTES,
		rolling: true
	};
	const cfg = loggingState.overrideSettings ?? readLoggingConfig();
	const defaultLevel = process.env.VITEST === "true" && process.env.OPENCLAW_TEST_FILE_LOG !== "1" ? "silent" : "info";
	const fromConfig = normalizeLogLevel(cfg?.level, defaultLevel);
	const level = envLevel ?? fromConfig;
	const rolling = cfg?.file ? isLegacyRollingLogFilePath(cfg.file) : true;
	return {
		level,
		file: resolveActiveLogFileWithMode(cfg?.file ?? resolveDefaultActiveLogFile(), rolling),
		maxFileBytes: resolveMaxLogFileBytes(cfg?.maxFileBytes),
		rolling
	};
}
function getRuntimeSettings() {
	const settings = loggingState.cachedSettings ?? resolveSettings();
	loggingState.cachedSettings = settings;
	return settings;
}
function isFileLogLevelEnabled(level) {
	return isLogLevelEnabled(level, getRuntimeSettings().level);
}
function inheritLogLevel(logger, getLevel) {
	let resolveLevel = getLevel;
	Object.defineProperty(logger.settings, "minLevel", {
		configurable: true,
		enumerable: true,
		get: () => resolveLevel(),
		set: (level) => {
			resolveLevel = () => level;
		}
	});
}
var RuntimeLogger = class extends Logger {
	getSubLogger(settings, logObj) {
		const minLevel = settings?.minLevel ?? this.settings.minLevel;
		const child = super.getSubLogger({
			...settings,
			minLevel: minLevel === Infinity ? levelToMinLevel("fatal") : minLevel
		}, logObj);
		if (settings?.minLevel == null) inheritLogLevel(child, () => this.settings.minLevel);
		else if (minLevel === Infinity) child.settings.minLevel = minLevel;
		return child;
	}
};
function buildLogger() {
	const logger = new RuntimeLogger({
		name: "openclaw",
		mask: { keys: [] },
		meta: { property: "_meta" },
		minLevel: levelToMinLevel("fatal"),
		type: "hidden"
	});
	inheritLogLevel(logger, () => levelToMinLevel(getRuntimeSettings().level));
	let activeFile;
	logger.attachTransport({
		format: () => "",
		write: (logObj) => {
			try {
				const settings = getRuntimeSettings();
				if (settings.level === "silent") return;
				const nextActiveFile = resolveActiveLogFileWithMode(settings.file, settings.rolling);
				if (nextActiveFile !== activeFile) {
					activeFile = nextActiveFile;
					try {
						ensureLogDirectorySync(path.dirname(activeFile));
						if (settings.rolling) pruneOldRollingLogs(path.dirname(activeFile));
					} catch {}
				}
				const time = formatTimestamp(logObj.date ?? /* @__PURE__ */ new Date(), { style: "long" });
				const { fields, messageParts } = prepareFileLogRecord(logObj);
				const line = serializeFileLogRecord({
					...logObj,
					_meta: withResolvedLogMetaHostname(logObj["_meta"], fields.hostname),
					time,
					...fields
				}, messageParts);
				fileLogTransport.enqueue({
					file: activeFile,
					hostname: fields.hostname,
					maxFileBytes: settings.maxFileBytes,
					payload: `${line}\n`
				});
			} catch {}
		}
	});
	attachDiagnosticEventTransport(logger);
	return logger;
}
function resolveMaxLogFileBytes(raw) {
	if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) return Math.floor(raw);
	return DEFAULT_MAX_LOG_FILE_BYTES;
}
function getLogger() {
	const cachedLogger = loggingState.cachedLogger;
	if (cachedLogger) return cachedLogger;
	getRuntimeSettings();
	const logger = buildLogger();
	loggingState.cachedLogger = logger;
	return logger;
}
function getChildLogger(bindings, opts) {
	const base = getLogger();
	const name = bindings ? JSON.stringify(bindings) : void 0;
	return base.getSubLogger({
		name,
		prefix: bindings ? [name ?? ""] : [],
		...opts?.level ? { minLevel: levelToMinLevel(opts.level) } : {}
	});
}
function resolveActiveLogFileWithMode(file, rolling) {
	const expandedFile = expandHomePrefix(file);
	return rolling ? resolveRollingLogFilePathForDate(expandedFile, /* @__PURE__ */ new Date()) : expandedFile;
}
function pruneOldRollingLogs(dir) {
	try {
		const entries = fs.readdirSync(dir, { withFileTypes: true });
		const cutoff = Date.now() - MAX_LOG_AGE_MS;
		for (const entry of entries) {
			if (!entry.isFile()) continue;
			if (!entry.name.startsWith(`openclaw-`) || !entry.name.endsWith(".log")) continue;
			const fullPath = path.join(dir, entry.name);
			try {
				if (fs.statSync(fullPath).mtimeMs < cutoff) fs.rmSync(fullPath, { force: true });
			} catch {}
		}
	} catch {}
}
//#endregion
//#region src/logging/console.ts
function normalizeConsoleLevel(level) {
	if (isVerbose()) return "debug";
	if (!level && process.env.VITEST === "true" && process.env.OPENCLAW_TEST_CONSOLE !== "1") return "silent";
	return normalizeLogLevel(level, "info");
}
function normalizeConsoleStyle(style) {
	if (style === "compact" || style === "json" || style === "pretty") return style;
	if (!process.stdout.isTTY) return "compact";
	return "pretty";
}
function resolveConsoleSettings() {
	const envLevel = resolveEnvLogLevelOverride();
	if (process.env.VITEST === "true" && process.env.OPENCLAW_TEST_CONSOLE !== "1" && !isVerbose() && !envLevel && !loggingState.overrideSettings) return {
		level: "silent",
		style: normalizeConsoleStyle(void 0)
	};
	const cfg = loggingState.overrideSettings ?? readLoggingConfig();
	return {
		level: envLevel ?? normalizeConsoleLevel(cfg?.consoleLevel),
		style: normalizeConsoleStyle(cfg?.consoleStyle)
	};
}
function getConsoleSettings() {
	const cached = loggingState.cachedConsoleSettings;
	if (cached) return cached;
	const settings = resolveConsoleSettings();
	loggingState.cachedConsoleSettings = settings;
	return settings;
}
function routeLogsToStderr() {
	loggingState.forceConsoleToStderr = true;
}
function shouldLogSubsystemToConsole(subsystem) {
	const filter = loggingState.consoleSubsystemFilter;
	if (!filter || filter.length === 0) return true;
	const normalizedSubsystem = normalizeOptionalString(subsystem);
	if (!normalizedSubsystem) return false;
	return filter.some((prefix) => normalizedSubsystem === prefix || normalizedSubsystem.startsWith(`${prefix}/`));
}
`${process.release.name}${process.pid}`;
function formatConsoleTimestamp(style) {
	const now = /* @__PURE__ */ new Date();
	if (style === "pretty") return formatTimestamp(now, { style: "short" }).replace(/[+-]\d{2}:\d{2}$/, "");
	return formatTimestamp(now, { style: "long" });
}
//#endregion
//#region src/runtime.ts
function shouldEmitRuntimeLog(env = process.env) {
	if (env.VITEST !== "true") return true;
	if (env.OPENCLAW_TEST_RUNTIME_LOG === "1") return true;
	return typeof console.log.mock === "object";
}
function shouldEmitRuntimeStdout(env = process.env) {
	if (env.VITEST !== "true") return true;
	if (env.OPENCLAW_TEST_RUNTIME_LOG === "1") return true;
	return typeof process.stdout.write.mock === "object";
}
function isPipeClosedError(err) {
	const code = err?.code;
	return code === "EPIPE" || code === "EIO";
}
function writeStdout(value) {
	if (!shouldEmitRuntimeStdout()) return;
	const line = value.endsWith("\n") ? value : `${value}\n`;
	try {
		process.stdout.write(line);
	} catch (err) {
		if (isPipeClosedError(err)) return;
		throw err;
	}
}
function createRuntimeIo() {
	return {
		log: (...args) => {
			if (!shouldEmitRuntimeLog()) return;
			console.log(...args);
		},
		error: (...args) => {
			console.error(...args);
		},
		writeStdout,
		writeJson: (value, space = 2) => {
			writeStdout(JSON.stringify(value, void 0, space > 0 ? space : void 0));
		}
	};
}
({ ...createRuntimeIo() });
(() => {
	try {
		const inspect = process.getBuiltinModule?.("util").inspect;
		return typeof inspect === "function" ? inspect : null;
	} catch {
		return null;
	}
})();
function isRichConsoleEnv() {
	const term = normalizeLowercaseStringOrEmpty(process.env.TERM);
	if (process.env.COLORTERM || process.env.TERM_PROGRAM) return true;
	return term.length > 0 && term !== "dumb";
}
const consoleColors = [];
function getColorForConsole() {
	const level = typeof process.env.FORCE_COLOR === "string" && process.env.FORCE_COLOR.trim().length > 0 && process.env.FORCE_COLOR.trim() !== "0" || !process.env.NO_COLOR && (process.stdout.isTTY || process.stderr.isTTY || isRichConsoleEnv()) ? 1 : 0;
	return consoleColors[level] ??= new Chalk({ level });
}
const SUBSYSTEM_COLORS = [
	"cyan",
	"green",
	"yellow",
	"blue",
	"magenta",
	"red"
];
const SUBSYSTEM_COLOR_OVERRIDES = /* @__PURE__ */ new Map([["gmail-watcher", "blue"]]);
const SUBSYSTEM_PREFIXES_TO_DROP = /* @__PURE__ */ new Set([
	"gateway",
	"channels",
	"providers"
]);
const CHANNEL_SUBSYSTEM_PREFIXES = /* @__PURE__ */ new Set([
	"clickclack",
	"discord",
	"feishu",
	"googlechat",
	"imessage",
	"irc",
	"line",
	"matrix",
	"mattermost",
	"msteams",
	"nextcloud-talk",
	"nostr",
	"openclaw-weixin",
	"qqbot",
	"signal",
	"slack",
	"synology-chat",
	"telegram",
	"tlon",
	"twitch",
	"webchat",
	"wecom",
	"whatsapp",
	"yuanbao",
	"zalo",
	"zalouser"
]);
function pickSubsystemColor(subsystem) {
	const override = SUBSYSTEM_COLOR_OVERRIDES.get(subsystem);
	if (override) return override;
	let hash = 0;
	for (let i = 0; i < subsystem.length; i += 1) hash = hash * 31 + subsystem.charCodeAt(i) | 0;
	const idx = Math.abs(hash) % SUBSYSTEM_COLORS.length;
	return expectDefined(SUBSYSTEM_COLORS[idx], "subsystem colors entry at idx");
}
function formatSubsystemForConsole(subsystem) {
	const parts = subsystem.split("/").filter(Boolean);
	const original = parts.join("/") || subsystem;
	while (parts[0] !== void 0 && SUBSYSTEM_PREFIXES_TO_DROP.has(parts[0])) parts.shift();
	const first = parts.at(0);
	if (first === void 0) return original;
	if (CHANNEL_SUBSYSTEM_PREFIXES.has(normalizeLowercaseStringOrEmpty(first))) return first;
	return parts.slice(-2).join("/");
}
function stripRedundantSubsystemPrefixForConsole(message, displaySubsystem) {
	if (!displaySubsystem) return message;
	if (message.startsWith("[")) {
		const closeIdx = message.indexOf("]");
		if (closeIdx > 1) {
			if (normalizeLowercaseStringOrEmpty(message.slice(1, closeIdx)) === normalizeLowercaseStringOrEmpty(displaySubsystem)) return message.slice(closeIdx + 1).replace(/^ */, "");
		}
	}
	if (normalizeLowercaseStringOrEmpty(message.slice(0, displaySubsystem.length)) !== normalizeLowercaseStringOrEmpty(displaySubsystem)) return message;
	const next = message.slice(displaySubsystem.length, displaySubsystem.length + 1);
	if (next !== ":" && next !== " ") return message;
	return message.slice(displaySubsystem.length).replace(/^ *:? */, "");
}
function createConsoleLineFormatter(subsystem) {
	const displaySubsystem = formatSubsystemForConsole(subsystem);
	const prefix = `[${displaySubsystem}]`;
	const prefixColor = pickSubsystemColor(displaySubsystem);
	return (level, message, style) => {
		const color = getColorForConsole();
		const levelColor = level === "error" || level === "fatal" ? color.red : level === "warn" ? color.yellow : level === "debug" || level === "trace" ? color.gray : color.cyan;
		const displayMessage = stripRedundantSubsystemPrefixForConsole(redactSensitiveText(message), displaySubsystem);
		const time = style === "pretty" || loggingState.consoleTimestampPrefix ? color.gray(formatConsoleTimestamp(style)) : "";
		const prefixToken = color[prefixColor](prefix);
		return `${time ? `${time} ${prefixToken}` : prefixToken} ${levelColor(displayMessage)}`;
	};
}
function writeConsoleLine(level, line, opts = {}) {
	const sanitized = process.platform === "win32" && process.env.GITHUB_ACTIONS === "true" ? line.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "?").replace(/[\uD800-\uDFFF]/g, "?") : line;
	const redacted = opts.redacted ? sanitized : redactSensitiveText(sanitized);
	const sink = loggingState.rawConsole ?? console;
	if (loggingState.forceConsoleToStderr || level === "error" || level === "fatal") (sink.error ?? console.error)(redacted);
	else if (level === "warn") (sink.warn ?? console.warn)(redacted);
	else (sink.log ?? console.log)(redacted);
}
function shouldSuppressProbeConsoleLine(params) {
	if (isVerbose()) return false;
	if (params.level === "error" || params.level === "fatal") return false;
	const message = typeof params.message === "string" ? params.message : "";
	if (!params.suppressProbeMessages) return false;
	if ((typeof params.meta?.runId === "string" ? params.meta.runId : typeof params.meta?.sessionId === "string" ? params.meta.sessionId : void 0)?.startsWith("probe-")) return true;
	return /(sessionId|runId)=probe-/.test(message);
}
const CONSOLE_META_LEVELS = /* @__PURE__ */ new Set([
	"warn",
	"error",
	"fatal"
]);
const CONSOLE_META_MAX_CHARS = 2048;
function formatConsoleMetaValue(value) {
	if (value === void 0) return;
	if (typeof value === "string") return /\s|=/.test(value) || value.length === 0 ? JSON.stringify(value) : value;
	if (value === null || typeof value === "number" || typeof value === "boolean") return String(value);
	return JSON.stringify(value);
}
/** Preserve native error diagnostics before any sink reduces non-enumerable fields to `{}`. */
function prepareLogMetaRecord(meta, stackHeadOnly = false) {
	let prepared;
	for (const [key, value] of Object.entries(meta)) if (value instanceof Error) {
		prepared ??= { ...meta };
		prepared[key] = {
			name: value.name,
			message: value.message,
			errorCode: extractErrorCode(value),
			stack: stackHeadOnly ? value.stack?.split("\n").slice(0, 6).join("\n") : value.stack
		};
	}
	return prepared ?? meta;
}
/**
* Renders structured fields as one compact `key=value` tail so warn/error/fatal
* records keep their diagnostics in plain-text sinks such as journald, which only
* see the console line. The JSON console style and the file sink carry the same
* fields natively, so only plain styles call this.
*
* Fields pass through the shared console transport redactor before flattening, so
* key-aware protection such as `apiToken` survives the loss of structure and the
* length cap can only clip text that is already masked. That redactor also owns
* circular references, bigints, and values with no JSON form, and returns parsed
* data, so rendering a value here cannot re-enter a stateful `toJSON`.
*/
function formatConsoleMeta(meta) {
	let redacted;
	try {
		redacted = redactLogRecordForTransport(meta);
	} catch {
		return "";
	}
	const parts = [];
	for (const [key, value] of Object.entries(redacted)) {
		const rendered = formatConsoleMetaValue(value);
		if (rendered !== void 0) parts.push(`${key}=${rendered}`);
	}
	const joined = parts.join(" ");
	return joined.length > CONSOLE_META_MAX_CHARS ? `${joined.slice(0, CONSOLE_META_MAX_CHARS)}...(truncated)` : joined;
}
function logToFile(fileLogger, level, message, meta) {
	if (level === "silent") return;
	if (meta && Object.keys(meta).length > 0) fileLogger[level](meta, message);
	else fileLogger[level](message);
}
function createSubsystemLogger(subsystem) {
	const resolvedSubsystem = normalizeOptionalString(subsystem) ?? "unknown";
	const suppressProbeMessages = resolvedSubsystem === "agent/embedded" || resolvedSubsystem.startsWith("agent/embedded/") || resolvedSubsystem === "model-fallback" || resolvedSubsystem.startsWith("model-fallback/");
	let fileChild;
	let fileChildWithoutStack;
	let formatConsoleLine;
	const getFileLogger = (level) => {
		fileChild ??= getChildLogger({ subsystem: resolvedSubsystem });
		if (level === "error" || level === "fatal" || areDiagnosticsEnabledForProcess() && hasInternalDiagnosticEventInterest("log.record")) return fileChild;
		if (!fileChildWithoutStack) {
			fileChildWithoutStack = fileChild.getSubLogger({ stack: { capture: "off" } });
			fileChildWithoutStack.settings.parentNames = fileChild.settings.parentNames;
		}
		return fileChildWithoutStack;
	};
	const emitLog = (level, message, meta) => {
		const consoleSettings = getConsoleSettings();
		const consoleEnabled = isLogLevelEnabled(level, consoleSettings.level) && shouldLogSubsystemToConsole(resolvedSubsystem);
		const fileEnabled = isFileLogLevelEnabled(level);
		if (!consoleEnabled && !fileEnabled) return;
		let consoleMessageOverride;
		let fileMeta = meta;
		let consoleFields = meta;
		if (meta && Object.keys(meta).length > 0) {
			const { consoleMessage, ...rest } = meta;
			if (typeof consoleMessage === "string") consoleMessageOverride = consoleMessage;
			fileMeta = Object.keys(rest).length > 0 ? prepareLogMetaRecord(rest) : void 0;
			consoleFields = fileMeta && consoleEnabled ? prepareLogMetaRecord(rest, true) : void 0;
		}
		if (fileEnabled) logToFile(getFileLogger(level), level, message, fileMeta);
		if (!consoleEnabled) return;
		const consoleMeta = consoleSettings.style !== "json" && consoleMessageOverride === void 0 && consoleFields && CONSOLE_META_LEVELS.has(level) ? formatConsoleMeta(consoleFields) : "";
		const consoleMessage = consoleMessageOverride ?? (consoleMeta ? `${message} ${consoleMeta}` : message);
		if (shouldSuppressProbeConsoleLine({
			level,
			suppressProbeMessages,
			message: consoleMessage,
			meta: consoleFields
		})) return;
		writeConsoleLine(level, consoleSettings.style === "json" ? formatJsonConsoleLine({
			level,
			subsystem: resolvedSubsystem,
			message,
			meta: consoleFields
		}) : (formatConsoleLine ??= createConsoleLineFormatter(resolvedSubsystem))(level, consoleMessage, consoleSettings.style), { redacted: true });
	};
	return {
		subsystem: resolvedSubsystem,
		isEnabled(level, target = "any") {
			const isConsoleEnabled = isLogLevelEnabled(level, getConsoleSettings().level) && shouldLogSubsystemToConsole(resolvedSubsystem);
			const isFileEnabled = isFileLogLevelEnabled(level);
			if (target === "console") return isConsoleEnabled;
			if (target === "file") return isFileEnabled;
			return isConsoleEnabled || isFileEnabled;
		},
		trace(message, meta) {
			emitLog("trace", message, meta);
		},
		debug(message, meta) {
			emitLog("debug", message, meta);
		},
		info(message, meta) {
			emitLog("info", message, meta);
		},
		warn(message, meta) {
			emitLog("warn", message, meta);
		},
		error(message, meta) {
			emitLog("error", message, meta);
		},
		fatal(message, meta) {
			emitLog("fatal", message, meta);
		},
		raw(message) {
			if (isFileLogLevelEnabled("info")) logToFile(getFileLogger("info"), "info", message, { raw: true });
			const consoleSettings = getConsoleSettings();
			if (isLogLevelEnabled("info", consoleSettings.level) && shouldLogSubsystemToConsole(resolvedSubsystem)) {
				if (shouldSuppressProbeConsoleLine({
					level: "info",
					suppressProbeMessages,
					message
				})) return;
				writeConsoleLine("info", consoleSettings.style === "json" ? formatJsonConsoleLine({
					level: "info",
					subsystem: resolvedSubsystem,
					message
				}) : message, { redacted: consoleSettings.style === "json" });
			}
		},
		child(name) {
			return createSubsystemLogger(`${resolvedSubsystem}/${name}`);
		}
	};
}
//#endregion
export { expectDefined as $, normalizeWindowsPathPreservingCase as A, getFsSafeTestHooks as B, readConfigIncludeFileWithGuards as C, asOptionalRecord as Ct, shortenHomePath as D, parseJsonWithJson5Fallback as E, tryProcessCwd as F, truncateUtf16Safe as G, resolveConfigEnvVars as H, isMissingPathError as I, asFiniteNumber as J, MAX_DATE_TIMESTAMP_MS as K, resolveIdentityPathViaExistingAncestorSync as L, resolveRequiredHomeDir as M, resolveRequiredOsHomeDir as N, isAbortError as O, resolveUserPath as P, resolveTimerTimeoutMs as Q, isNonRegularWriteOpenError as R, hashConfigIncludeRaw as S, asOptionalObjectRecord as St, resolveConfigIncludes as T, DEFAULT_SECRET_PROVIDER_ALIAS as U, containsEnvVarReference as V, sliceUtf16Safe as W, asSafeIntegerInRange as X, asPositiveSafeInteger as Y, resolveNonNegativeIntegerOption as Z, resolveGatewayLockDirForCanonicalStateDir as _, normalizeNullableString as _t, areDiagnosticsEnabledForProcess as a, toErrorObject$1 as at, normalizeProfileName as b, readStringValue as bt, notifyListeners as c, isBlockedObjectKey as ct, hasInternalDiagnosticEventInterest as d, resolveGlobalMap as dt, coerceErrorMessage as et, redactSensitiveText as f, resolveGlobalSet as ft, resolveGatewayLockDir as g, normalizeLowercaseStringOrEmpty as gt, resolveConfigPath as h, stripAnsi$1 as ht, resolvePreferredOpenClawTmpDir as i, formatErrorMessage$1 as it, expandHomePrefix as j, escapeRegExp as k, registerListener as l, registerSignalExitFinalizer as lt, pruneMapToMaxSize as m, sanitizeForLog as mt, routeLogsToStderr as n, collectNestedErrorCandidates as nt, emitTrustedDiagnosticEvent as o, toStringifiedError as ot, redactToolPayloadText as p, resolveGlobalSingleton as pt, MAX_TIMER_TIMEOUT_MS as q, getChildLogger as r, extractErrorCode as rt, normalizeDiagnosticWorkerScript as s, toStructuredErrorObject as st, createSubsystemLogger as t, collectErrorGraphCandidates as tt, getPluginExecutionFrame as u, readGlobalSingleton as ut, resolveIncludeRoots as v, normalizeOptionalLowercaseString as vt, resolveConfigIncludeWritePath as w, isRecord as wt, resolveProfileStateDir as x, asNullableRecord as xt, resolveStateDir as y, normalizeOptionalString as yt, resolveNonblockingWriteFlag as z };
