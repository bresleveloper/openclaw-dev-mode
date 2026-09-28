import "node:fs";
import path from "node:path";
import os from "node:os";
import "@openclaw/fs-safe/config";
import "node:fs/promises";
import { sameFileContentsSync, sameFileIdentity } from "@openclaw/fs-safe/advanced";
import { FsSafeError as FsSafeError$1 } from "@openclaw/fs-safe/errors";
import "@openclaw/fs-safe/output";
import "@openclaw/fs-safe/root";
import { isNotFoundPathError, isPathInside, normalizeWindowsPathForComparison as normalizeWindowsPathForComparison$1 } from "@openclaw/fs-safe/path";
import "@openclaw/fs-safe/secret";
import { readSecureFile } from "@openclaw/fs-safe/secure-file";
import "@openclaw/fs-safe/walk";
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
//#region packages/normalization-core/src/number-coercion.ts
/** Returns a number only when the input is already finite. */
function asFiniteNumber(value) {
	return Number.isFinite(value) ? value : void 0;
}
/** Returns a finite number only when it is greater than zero. */
function asPositiveFiniteNumber(value) {
	const number = asFiniteNumber(value);
	return number && number > 0 ? number : void 0;
}
/** Returns a finite number only when it is zero or greater. */
function asNonNegativeFiniteNumber(value) {
	const number = asFiniteNumber(value);
	return number && number < 0 ? void 0 : number;
}
/** Returns a safe integer only when it satisfies the supplied inclusive bounds. */
function asSafeIntegerInRange(value, range) {
	if (typeof value !== "number" || !Number.isSafeInteger(value)) return;
	if (range.min !== void 0 && value < range.min) return;
	if (range.max !== void 0 && value > range.max) return;
	return value;
}
function normalizeNumericString(value) {
	const trimmed = value.trim();
	return trimmed ? trimmed : void 0;
}
/** Parses only safe integer numbers or base-10 integer strings. */
function parseStrictInteger(value) {
	if (typeof value === "number") return Number.isSafeInteger(value) ? value : void 0;
	if (typeof value !== "string") return;
	const normalized = normalizeNumericString(value);
	if (!normalized || !/^[+-]?\d+$/.test(normalized)) return;
	const parsed = Number(normalized);
	return Number.isSafeInteger(parsed) ? parsed : void 0;
}
/** Returns positive safe integers without string coercion. */
function asPositiveSafeInteger(value) {
	return Number.isSafeInteger(value) && value > 0 ? value : void 0;
}
/** Conservative upper bound for Node timer delays. */
const MAX_TIMER_TIMEOUT_MS$1 = 2147e6;
/** Largest timestamp accepted by JavaScript Date. */
const MAX_DATE_TIMESTAMP_MS = 864e13;
/** Clamps finite millisecond values into the Node-safe timer range. */
function clampTimerTimeoutMs(valueMs, minMs = 1) {
	const value = asFiniteNumber(valueMs);
	if (value === void 0) return;
	return Math.min(Math.max(Math.floor(value), Math.max(1, Math.floor(minMs))), MAX_TIMER_TIMEOUT_MS$1);
}
/** Clamps positive finite millisecond values into the Node-safe timer range. */
function clampPositiveTimerTimeoutMs(valueMs) {
	const value = asFiniteNumber(valueMs);
	if (value === void 0 || value <= 0) return;
	return clampTimerTimeoutMs(value);
}
/** Resolves a positive timer timeout or falls back through safe timer clamping. */
function resolvePositiveTimerTimeoutMs(valueMs, fallbackMs) {
	return clampPositiveTimerTimeoutMs(valueMs) ?? resolveTimerTimeoutMs(fallbackMs, 1);
}
/** Resolves arbitrary timeout input with fallback and minimum timer bounds. */
function resolveTimerTimeoutMs(valueMs, fallbackMs, minMs = 1) {
	const value = asFiniteNumber(valueMs) ?? asFiniteNumber(fallbackMs);
	const min = Math.max(0, Math.floor(minMs));
	if (value === void 0) return min;
	return Math.min(Math.max(Math.floor(value), min), MAX_TIMER_TIMEOUT_MS$1);
}
/** Resolves an integer option from finite numeric input or fallback, then clamps bounds. */
function resolveIntegerOption(value, fallback, range = {}) {
	const floored = Math.floor(typeof value === "number" && Number.isFinite(value) ? value : fallback);
	const minBounded = range.min === void 0 ? floored : Math.max(range.min, floored);
	return range.max === void 0 ? minBounded : Math.min(range.max, minBounded);
}
/** Resolves an integer option with a non-negative lower bound. */
function resolveNonNegativeIntegerOption(value, fallback) {
	return resolveIntegerOption(value, fallback, { min: 0 });
}
/** Parses strict positive integer values from numbers or strings. */
function parseStrictPositiveInteger(value) {
	const parsed = parseStrictInteger(value);
	return parsed !== void 0 && parsed > 0 ? parsed : void 0;
}
/** Parses strict non-negative integer values from numbers or strings. */
function parseStrictNonNegativeInteger(value) {
	const parsed = parseStrictInteger(value);
	return parsed !== void 0 && parsed >= 0 ? parsed : void 0;
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
/** Resolves a user-supplied path after trimming and expanding against the effective home. */
function resolveHomeRelativePath(input, opts) {
	const trimmed = input.trim();
	if (!trimmed) return trimmed;
	if (trimmed.startsWith("~")) {
		const expanded = expandHomePrefix(trimmed, {
			home: resolveRequiredHomeDir(opts?.env ?? process.env, opts?.homedir ?? os.homedir),
			env: opts?.env,
			homedir: opts?.homedir
		});
		return path.resolve(expanded);
	}
	return path.resolve(trimmed);
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
//#region packages/retry/src/index.ts
const MAX_TIMER_TIMEOUT_MS = 2147e6;
function computeBackoff(policy, attempt) {
	const base = Math.min(policy.maxMs, policy.initialMs * policy.factor ** Math.max(attempt - 1, 0));
	const jitter = base * policy.jitter * Math.random();
	return Math.min(policy.maxMs, Math.round(base + jitter));
}
async function sleepWithAbort(ms, abortSignal, options = {}) {
	if (!Number.isFinite(ms) || ms <= 0) return;
	const delayMs = Math.min(Math.max(Math.floor(ms), 1), MAX_TIMER_TIMEOUT_MS);
	await new Promise((resolve, reject) => {
		let settled = false;
		let timer = null;
		const cleanup = () => abortSignal?.removeEventListener("abort", onAbort);
		const onAbort = () => {
			if (settled) return;
			settled = true;
			if (timer) clearTimeout(timer);
			timer = null;
			cleanup();
			const error = new Error("aborted", { cause: abortSignal?.reason ?? /* @__PURE__ */ new Error("aborted") });
			error.name = "AbortError";
			reject(error);
		};
		abortSignal?.addEventListener("abort", onAbort, { once: true });
		if (abortSignal?.aborted) {
			onAbort();
			return;
		}
		timer = setTimeout(() => {
			settled = true;
			cleanup();
			timer = null;
			resolve();
		}, delayMs);
		if (options.ref === false) timer.unref?.();
		if (abortSignal?.aborted) onAbort();
	});
}
var RetrySupervisor = class {
	constructor(policy, maxAttempts = Number.POSITIVE_INFINITY) {
		this.policy = policy;
		this.maxAttempts = maxAttempts;
		this.attempts = 0;
		this.initialMs = policy.initialMs;
	}
	reset(initialMs = this.policy.initialMs) {
		this.cancel();
		this.attempts = 0;
		this.initialMs = initialMs;
		this.nextDelayOverrideMs = void 0;
	}
	cancel(reason = /* @__PURE__ */ new Error("retry cancelled")) {
		this.pendingAbort?.abort(reason);
		this.pendingAbort = void 0;
	}
	next(abortSignal) {
		const override = this.nextDelayOverrideMs;
		this.nextDelayOverrideMs = void 0;
		if (override === void 0 && ++this.attempts > Math.ceil(this.maxAttempts)) return;
		const attempt = Math.max(this.attempts, 1);
		const delayMs = override ?? computeBackoff({
			...this.policy,
			initialMs: this.initialMs
		}, attempt);
		this.cancel();
		const pendingAbort = new AbortController();
		this.pendingAbort = pendingAbort;
		return {
			attempt,
			delayMs,
			signal: abortSignal ? AbortSignal.any([pendingAbort.signal, abortSignal]) : pendingAbort.signal
		};
	}
};
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
	const next = Number.isFinite(value) ? value : void 0;
	if (next === void 0) return fallback;
	return Math.min(Math.max(next, min ?? Number.NEGATIVE_INFINITY), max ?? Number.POSITIVE_INFINITY);
}
function resolveAttemptCount(value, fallback) {
	return Math.max(1, Math.round(Number.isFinite(value) ? value : fallback));
}
function resolveRetryDelayMs(value) {
	const finite = value === Number.POSITIVE_INFINITY ? MAX_TIMER_TIMEOUT_MS : Number.isFinite(value) ? value : 0;
	return Math.min(Math.max(Math.round(finite), 0), MAX_TIMER_TIMEOUT_MS);
}
function resolveJitterConfig(value, fallback) {
	if (value === "full") return "full";
	const fraction = Number.isFinite(value) ? value : void 0;
	return fraction === void 0 ? fallback : Math.min(Math.max(fraction, 0), 1);
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
		if (typeof attemptsOrOptions === "number") {
			const attempts = resolveAttemptCount(attemptsOrOptions, DEFAULT_RETRY_CONFIG.attempts);
			for (let index = 0; index < attempts; index += 1) try {
				return await fn();
			} catch (err) {
				attemptErrors.push(err);
				if (index === attempts - 1) break;
				await runtimeSleep(resolveRetryDelayMs(initialDelayMs * 2 ** index));
			}
			throw createFailure(attemptErrors);
		}
		const options = attemptsOrOptions;
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
//#region src/utils.ts
let CONFIG_DIR = resolveConfigDir();
//#endregion
export { resolveTimerTimeoutMs as A, asPositiveFiniteNumber as C, parseStrictPositiveInteger as D, parseStrictNonNegativeInteger as E, normalizeLowercaseStringOrEmpty as F, normalizeNullableString as I, normalizeOptionalLowercaseString as L, asOptionalObjectRecord as M, asOptionalRecord as N, resolveNonNegativeIntegerOption as O, isRecord as P, normalizeOptionalString as R, asNonNegativeFiniteNumber as S, asSafeIntegerInRange as T, resolveUserPath as _, isPathInside as a, MAX_TIMER_TIMEOUT_MS$1 as b, FsSafeError$1 as c, sameFileIdentity as d, resolveConfigDir as f, resolveRequiredOsHomeDir as g, resolveRequiredHomeDir as h, isNotFoundPathError as i, asNullableRecord as j, resolvePositiveTimerTimeoutMs as k, readSecureFile as l, resolveHomeRelativePath as m, RetrySupervisor as n, normalizeWindowsPathForComparison$1 as o, expandHomePrefix as p, sleepWithAbort as r, normalizeWindowsPathPreservingCase as s, CONFIG_DIR as t, sameFileContentsSync as u, tryProcessCwd as v, asPositiveSafeInteger as w, asFiniteNumber as x, MAX_DATE_TIMESTAMP_MS as y, readStringValue as z };
