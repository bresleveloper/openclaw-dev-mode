import { A as asOptionalRecord, c as resolveChannelAccountKey, d as normalizeAccountId, f as normalizeOptionalAccountId, h as resolveGlobalSingleton, s as resolveAccountKey, u as DEFAULT_ACCOUNT_ID, w as normalizeUniqueStringEntries } from "./runtime-doctor-migrations-BhouWAUC.js";
import "./number-coercion-CWp8Ho-Y.js";
import "@openclaw/fs-safe/path";
import path from "node:path";
import "node:fs";
import "@openclaw/fs-safe/advanced";
import os from "node:os";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/config/channel-account-config.ts
/** Merge authored account overrides over channel defaults, with owner-selected collection rules. */
function mergeAccountConfig(params) {
	const omitKeys = /* @__PURE__ */ new Set(["accounts", ...params.omitKeys ?? []]);
	const base = Object.fromEntries(Object.entries(params.channelConfig ?? {}).filter(([key]) => !omitKeys.has(key)));
	const account = params.accountConfig;
	const merged = {
		...base,
		...account
	};
	const mergedFields = merged;
	for (const [key, kind] of Object.entries(params.inheritEmptyKeys ?? {})) {
		const value = account?.[key];
		const collection = kind === "array" ? Array.isArray(value) ? value : void 0 : asOptionalRecord(value);
		if (collection && Object.keys(collection).length === 0) mergedFields[key] = base[key];
	}
	for (const key of params.nestedObjectKeys ?? []) {
		const baseValue = asOptionalRecord(base[key]);
		const accountValue = asOptionalRecord(account?.[key]);
		if (baseValue && accountValue) mergedFields[key] = {
			...baseValue,
			...accountValue
		};
	}
	if (params.preserveRootAllowFrom && Array.isArray(base.allowFrom) && Array.isArray(account?.allowFrom)) {
		if (base.allowFrom.some((entry) => {
			const value = String(entry).trim();
			return value.length > 0 && value !== "*";
		}) && account.allowFrom.some((entry) => String(entry).trim() === "*")) {
			const entries = account.allowFrom.filter((entry) => String(entry).trim() !== "*");
			mergedFields.allowFrom = entries.length > 0 ? entries : base.allowFrom;
		}
	}
	return merged;
}
/** Resolve a named account before applying the shared channel inheritance rules. */
function resolveMergedAccountConfig(params) {
	const accountKey = params.channelId ? resolveChannelAccountKey(params.accounts, params.accountId, params.channelId, params.normalizeAccountId, params.accountKeyPolicy) : resolveAccountKey(params.accounts, params.accountId, params.normalizeAccountId, params.accountKeyPolicy);
	const accountConfig = accountKey === void 0 ? void 0 : params.accounts?.[accountKey];
	return mergeAccountConfig({
		...params,
		accountConfig
	});
}
Object.freeze([
	"activity",
	"agents",
	"ai-agents",
	"appearance",
	"approve",
	"apps",
	"ask",
	"automation",
	"automations",
	"channels",
	"chat",
	"communications",
	"config",
	"cron",
	"custodian",
	"dashboard",
	"dashboards",
	"debug",
	"focus",
	"infrastructure",
	"lobsterdex",
	"logs",
	"mcp",
	"meetings",
	"memory-import",
	"model-providers",
	"model-setup",
	"new",
	"nodes",
	"plugin",
	"plugins",
	"portals",
	"profile",
	"sessions",
	"settings",
	"share",
	"skills",
	"systems",
	"terminal",
	"usage",
	"workboard",
	"worktrees"
]);
//#endregion
//#region src/channels/plugins/account-helpers.ts
function createAccountListHelpers(channelKey, options) {
	function hasImplicitDefaultAccount(cfg) {
		const channel = cfg.channels?.[channelKey];
		return Boolean(options?.hasImplicitDefaultAccount?.(cfg) || options?.implicitDefaultAccount?.channelKeys?.some((key) => hasConfiguredAccountValue(channel?.[key])) || options?.implicitDefaultAccount?.envVars?.some((key) => hasConfiguredAccountValue(process.env[key])));
	}
	function resolveConfiguredDefaultAccountId(cfg) {
		const channel = cfg.channels?.[channelKey];
		return normalizeOptionalAccountId(typeof channel?.defaultAccount === "string" ? channel.defaultAccount : void 0);
	}
	function listConfiguredAccountIds(cfg) {
		const accounts = (cfg.channels?.[channelKey])?.accounts;
		if (!accounts || typeof accounts !== "object") return [];
		const ids = Object.keys(accounts).filter(Boolean);
		const normalizeConfiguredAccountId = options?.normalizeAccountId;
		if (!normalizeConfiguredAccountId) return ids;
		return normalizeUniqueStringEntries(ids.map((id) => normalizeConfiguredAccountId(id)));
	}
	function listAccountIds(cfg) {
		return listCombinedAccountIds({
			configuredAccountIds: listConfiguredAccountIds(cfg),
			additionalAccountIds: options?.additionalAccountIds?.(cfg),
			implicitAccountId: options?.resolveImplicitAccountId ? options.resolveImplicitAccountId(cfg) : hasImplicitDefaultAccount(cfg) ? DEFAULT_ACCOUNT_ID : void 0,
			fallbackAccountIdWhenEmpty: options?.fallbackAccountIdWhenEmpty === false ? void 0 : options?.fallbackAccountIdWhenEmpty ?? "default"
		});
	}
	function resolveDefaultAccountId(cfg) {
		return resolveListedDefaultAccountId({
			accountIds: listAccountIds(cfg),
			configuredDefaultAccountId: resolveConfiguredDefaultAccountId(cfg),
			allowUnlistedDefaultAccount: options?.allowUnlistedDefaultAccount
		});
	}
	return {
		listConfiguredAccountIds,
		listAccountIds,
		resolveDefaultAccountId,
		resolveAccountConfig: (cfg, accountId) => {
			const channelConfig = cfg.channels?.[channelKey];
			const accounts = channelConfig?.accounts;
			return resolveMergedAccountConfig({
				channelConfig,
				channelId: channelKey,
				accounts,
				accountId,
				omitKeys: options?.omitKeys,
				normalizeAccountId: options?.normalizeAccountId,
				nestedObjectKeys: options?.nestedObjectKeys
			});
		}
	};
}
function hasConfiguredAccountValue(value) {
	if (typeof value === "string") return value.trim().length > 0;
	return value !== void 0 && value !== null;
}
function listCombinedAccountIds(params) {
	const ids = new Set([
		...params.configuredAccountIds,
		...params.additionalAccountIds ?? [],
		...params.implicitAccountId ? [params.implicitAccountId] : []
	].filter(Boolean));
	if (ids.size === 0 && params.fallbackAccountIdWhenEmpty) return [params.fallbackAccountIdWhenEmpty];
	return [...ids].toSorted((a, b) => a.localeCompare(b));
}
function resolveListedDefaultAccountId(params) {
	const preferred = params.configuredDefaultAccountId;
	const normalizeListedAccountId = params.normalizeListedAccountId ?? normalizeAccountId;
	if (preferred && (params.allowUnlistedDefaultAccount || params.accountIds.some((accountId) => normalizeListedAccountId(accountId) === preferred))) return preferred;
	if (params.accountIds.includes("default")) return DEFAULT_ACCOUNT_ID;
	if (params.ambiguousFallbackAccountId && params.accountIds.length > 1) return params.ambiguousFallbackAccountId;
	return params.accountIds[0] ?? "default";
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
String.raw`(?<=^|[\s"'\x60(\[{<=:;]|file://)`;
String.raw`[\s"'\x60)\]}>]`;
String.raw`[:;](?=[/\\~$]|[A-Za-z]:)`;
resolveConfigDir();
//#endregion
export { tryProcessCwd as a, mergeAccountConfig as c, resolveUserPath as i, resolveHomeRelativePath as n, createAccountListHelpers as o, resolveRequiredHomeDir as r, hasConfiguredAccountValue as s, expandHomePrefix as t };
