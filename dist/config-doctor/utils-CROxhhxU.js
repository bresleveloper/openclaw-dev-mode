import "./number-coercion-fuMteyiI.js";
import "./fs-safe-defaults-2jt53BPm.js";
import "node:fs/promises";
import path from "node:path";
import "node:fs";
import { sameFileContentsSync, sameFileIdentity } from "@openclaw/fs-safe/advanced";
import { isPathInside } from "@openclaw/fs-safe/path";
import os from "node:os";
import "@openclaw/fs-safe/errors";
import "@openclaw/fs-safe/output";
import "@openclaw/fs-safe/root";
import "@openclaw/fs-safe/secret";
import "@openclaw/fs-safe/secure-file";
import "@openclaw/fs-safe/walk";
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
resolveConfigDir();
//#endregion
export { expandHomePrefix as a, resolveRequiredOsHomeDir as c, sameFileIdentity as i, tryProcessCwd as l, normalizeWindowsPathPreservingCase as n, resolveHomeRelativePath as o, sameFileContentsSync as r, resolveRequiredHomeDir as s, isPathInside as t };
