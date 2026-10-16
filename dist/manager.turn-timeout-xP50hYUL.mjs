import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { m as clampTimerTimeoutMs, w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import { t as settlesWithin } from "./settle-within-CTpJLoBG.mjs";
import { i as logVerbose } from "./globals-BXbZ1A_g.mjs";
import { n as AcpRuntimeError } from "./errors-m4L_1YUz.mjs";
import "./errors-DDGkdHjR.mjs";
import { n as resolveAgentTimeoutMs } from "./timeout-Q2p-0uCf.mjs";
import { isAbsolute } from "node:path";
//#region src/acp/control-plane/runtime-options.ts
const MAX_RUNTIME_MODE_LENGTH = 64;
const MAX_MODEL_LENGTH = 200;
const MAX_THINKING_LENGTH = 32;
const MAX_PERMISSION_PROFILE_LENGTH = 80;
const MAX_CWD_LENGTH = 4096;
const MIN_TIMEOUT_SECONDS = 1;
const MAX_TIMEOUT_SECONDS = 86400;
const MAX_BACKEND_OPTION_KEY_LENGTH = 64;
const MAX_BACKEND_OPTION_VALUE_LENGTH = 512;
const MAX_BACKEND_EXTRAS = 32;
const SAFE_OPTION_KEY_RE = /^[a-z0-9][a-z0-9._:-]*$/i;
const RUNTIME_CONFIG_OPTION_ALIASES = {
	model: ["model"],
	thinking: [
		"thinking",
		"effort",
		"reasoning_effort",
		"thought_level"
	],
	permissionProfile: [
		"approval_policy",
		"permission_profile",
		"permissions",
		"permission_mode"
	],
	timeoutSeconds: ["timeout", "timeout_seconds"]
};
function failInvalidOption(message) {
	throw new AcpRuntimeError("ACP_INVALID_RUNTIME_OPTION", message);
}
function validateBoundedText(value, field, maxLength) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) failInvalidOption(`${field} must not be empty.`);
	if (normalized.length > maxLength) failInvalidOption(`${field} must be at most ${maxLength} characters.`);
	for (let i = 0; i < normalized.length; i += 1) {
		const code = normalized.charCodeAt(i);
		if (code < 32 || code === 127) failInvalidOption(`${field} must not include control characters.`);
	}
	return normalized;
}
function validateRuntimeModeInput(rawMode) {
	return validateBoundedText(rawMode, "Runtime mode", MAX_RUNTIME_MODE_LENGTH);
}
function validateRuntimeModelInput(rawModel) {
	return validateBoundedText(rawModel, "Model id", MAX_MODEL_LENGTH);
}
function validateRuntimeThinkingInput(rawThinking) {
	return validateBoundedText(rawThinking, "Thinking level", MAX_THINKING_LENGTH);
}
function validateRuntimePermissionProfileInput(rawProfile) {
	return validateBoundedText(rawProfile, "Permission profile", MAX_PERMISSION_PROFILE_LENGTH);
}
function validateRuntimeCwdInput(rawCwd) {
	const cwd = validateBoundedText(rawCwd, "Working directory", MAX_CWD_LENGTH);
	if (!isAbsolute(cwd)) failInvalidOption(`Working directory must be an absolute path. Received "${cwd}".`);
	return cwd;
}
function validateRuntimeTimeoutSecondsInput(rawTimeout) {
	if (typeof rawTimeout !== "number" || !Number.isFinite(rawTimeout)) failInvalidOption("Timeout must be a positive integer in seconds.");
	const timeout = Math.round(rawTimeout);
	if (timeout < MIN_TIMEOUT_SECONDS || timeout > MAX_TIMEOUT_SECONDS) failInvalidOption(`Timeout must be between ${MIN_TIMEOUT_SECONDS} and ${MAX_TIMEOUT_SECONDS} seconds.`);
	return timeout;
}
function parseRuntimeTimeoutSecondsInput(rawTimeout) {
	const normalized = normalizeOptionalString(rawTimeout);
	if (!normalized || !/^\d+$/.test(normalized)) failInvalidOption("Timeout must be a positive integer in seconds.");
	return validateRuntimeTimeoutSecondsInput(parseStrictPositiveInteger(normalized) ?? 0);
}
function validateRuntimeConfigOptionInput(rawKey, rawValue) {
	const key = validateBoundedText(rawKey, "ACP config key", MAX_BACKEND_OPTION_KEY_LENGTH);
	if (!SAFE_OPTION_KEY_RE.test(key)) failInvalidOption("ACP config key must use letters, numbers, dots, colons, underscores, or dashes.");
	return {
		key,
		value: validateBoundedText(rawValue, "ACP config value", MAX_BACKEND_OPTION_VALUE_LENGTH)
	};
}
function validateRuntimeOptionPatch(patch) {
	if (!patch) return {};
	const rawPatch = patch;
	const allowedKeys = /* @__PURE__ */ new Set([
		"runtimeMode",
		"model",
		"thinking",
		"cwd",
		"permissionProfile",
		"timeoutSeconds",
		"backendExtras"
	]);
	for (const key of Object.keys(rawPatch)) if (!allowedKeys.has(key)) failInvalidOption(`Unknown runtime option "${key}".`);
	const next = {};
	function setOption(key, validate) {
		if (Object.hasOwn(rawPatch, key)) next[key] = rawPatch[key] === void 0 ? void 0 : validate(rawPatch[key]);
	}
	setOption("runtimeMode", validateRuntimeModeInput);
	setOption("model", validateRuntimeModelInput);
	setOption("thinking", validateRuntimeThinkingInput);
	setOption("cwd", validateRuntimeCwdInput);
	setOption("permissionProfile", validateRuntimePermissionProfileInput);
	setOption("timeoutSeconds", validateRuntimeTimeoutSecondsInput);
	if (Object.hasOwn(rawPatch, "backendExtras")) {
		const rawExtras = rawPatch.backendExtras;
		if (rawExtras === void 0) next.backendExtras = void 0;
		else if (!rawExtras || typeof rawExtras !== "object" || Array.isArray(rawExtras)) failInvalidOption("Backend extras must be a key/value object.");
		else {
			const entries = Object.entries(rawExtras);
			if (entries.length > MAX_BACKEND_EXTRAS) failInvalidOption(`Backend extras must include at most ${MAX_BACKEND_EXTRAS} entries.`);
			const extras = {};
			for (const [entryKey, entryValue] of entries) {
				const { key, value } = validateRuntimeConfigOptionInput(entryKey, entryValue);
				extras[key] = value;
			}
			next.backendExtras = Object.keys(extras).length > 0 ? extras : void 0;
		}
	}
	return next;
}
function normalizeRuntimeOptions(options) {
	const normalized = {};
	for (const key of [
		"runtimeMode",
		"model",
		"thinking",
		"cwd",
		"permissionProfile"
	]) {
		const value = normalizeOptionalString(options?.[key]);
		if (value) normalized[key] = value;
	}
	if (typeof options?.timeoutSeconds === "number" && Number.isFinite(options.timeoutSeconds)) {
		const rounded = Math.round(options.timeoutSeconds);
		if (rounded > 0) normalized.timeoutSeconds = rounded;
	}
	const backendExtrasEntries = Object.entries(options?.backendExtras ?? {}).map(([key, value]) => [normalizeOptionalString(key), normalizeOptionalString(value)]).filter(([key, value]) => Boolean(key && value));
	if (backendExtrasEntries.length > 0) normalized.backendExtras = Object.fromEntries(backendExtrasEntries);
	return normalized;
}
function mergeRuntimeOptions(params) {
	const current = normalizeRuntimeOptions(params.current);
	const patch = validateRuntimeOptionPatch(params.patch);
	return normalizeRuntimeOptions({
		...current,
		...patch,
		...patch.backendExtras ? { backendExtras: {
			...current.backendExtras,
			...patch.backendExtras
		} } : {}
	});
}
function isThinkingConfigKey(key) {
	return RUNTIME_CONFIG_OPTION_ALIASES.thinking.some((alias) => alias === normalizeLowercaseStringOrEmpty(key));
}
/** Reconcile only selected thinking; backend defaults must not become new session overrides. */
function reconcileAcceptedRuntimeOptions(options, result, pendingThinking) {
	if (!result || !options.thinking) return options;
	const thinking = result.configOptions.find((option) => option.category === "thought_level" || isThinkingConfigKey(option.id));
	if (pendingThinking && (thinking?.currentValue === pendingThinking || thinking?.options?.some((choice) => "options" in choice ? choice.options.some((option) => option.value === pendingThinking) : choice.value === pendingThinking))) return options;
	return normalizeRuntimeOptions({
		...options,
		thinking: typeof thinking?.currentValue === "string" ? thinking.currentValue : void 0
	});
}
function resolveRuntimeOptionsFromMeta(meta) {
	const normalized = normalizeRuntimeOptions(meta.runtimeOptions);
	if (normalized.cwd || !meta.cwd) return normalized;
	return normalizeRuntimeOptions({
		...normalized,
		cwd: meta.cwd
	});
}
function runtimeOptionsEqual(a, b) {
	return JSON.stringify(normalizeRuntimeOptions(a)) === JSON.stringify(normalizeRuntimeOptions(b));
}
function buildRuntimeControlSignature(options) {
	const normalized = normalizeRuntimeOptions(options);
	const extras = Object.entries(normalized.backendExtras ?? {}).toSorted(([a], [b]) => a.localeCompare(b));
	return JSON.stringify({
		runtimeMode: normalized.runtimeMode ?? null,
		model: normalized.model ?? null,
		thinking: normalized.thinking ?? null,
		permissionProfile: normalized.permissionProfile ?? null,
		timeoutSeconds: normalized.timeoutSeconds ?? null,
		backendExtras: extras
	});
}
function buildRuntimeConfigOptionPairs(options, advertisedConfigOptionKeys) {
	const normalized = normalizeRuntimeOptions(options);
	const pairs = /* @__PURE__ */ new Map();
	const advertisedKeys = buildAdvertisedConfigOptionKeyMap(advertisedConfigOptionKeys);
	const resolveKey = (key) => resolveRuntimeConfigOptionKeyFromMap(key, advertisedKeys);
	const shouldEmit = (aliases) => advertisedKeys.size === 0 || aliases.some((alias) => advertisedKeys.has(alias));
	if (normalized.model) pairs.set(resolveKey("model"), normalized.model);
	if (normalized.thinking && shouldEmit(RUNTIME_CONFIG_OPTION_ALIASES.thinking)) pairs.set(resolveKey("thinking"), normalized.thinking);
	if (normalized.permissionProfile) pairs.set(resolveKey("approval_policy"), normalized.permissionProfile);
	if (typeof normalized.timeoutSeconds === "number" && shouldEmit(RUNTIME_CONFIG_OPTION_ALIASES.timeoutSeconds)) pairs.set(resolveKey("timeout"), String(normalized.timeoutSeconds));
	for (const [key, value] of Object.entries(normalized.backendExtras ?? {})) {
		const wireKey = resolveKey(key);
		if (!pairs.has(wireKey)) pairs.set(wireKey, value);
	}
	return [...pairs.entries()];
}
function buildAdvertisedConfigOptionKeyMap(advertisedConfigOptionKeys) {
	const advertisedKeys = /* @__PURE__ */ new Map();
	for (const rawKey of advertisedConfigOptionKeys ?? []) {
		const key = normalizeOptionalString(rawKey);
		const normalizedKey = normalizeLowercaseStringOrEmpty(key);
		if (key && normalizedKey && !advertisedKeys.has(normalizedKey)) advertisedKeys.set(normalizedKey, key);
	}
	return advertisedKeys;
}
function resolveRuntimeConfigOptionAliases(key) {
	const normalizedKey = normalizeLowercaseStringOrEmpty(key);
	for (const aliases of Object.values(RUNTIME_CONFIG_OPTION_ALIASES)) if (aliases.some((alias) => alias === normalizedKey)) return aliases;
	return [key];
}
function resolveRuntimeConfigOptionKey(key, advertisedConfigOptionKeys) {
	return resolveRuntimeConfigOptionKeyFromMap(key, buildAdvertisedConfigOptionKeyMap(advertisedConfigOptionKeys));
}
function resolveRuntimeConfigOptionKeyFromMap(key, advertisedKeys) {
	const normalizedKey = normalizeOptionalString(key) ?? "";
	const normalizedLookupKey = normalizeLowercaseStringOrEmpty(normalizedKey);
	if (!normalizedKey || advertisedKeys.size === 0) return normalizedKey;
	const exactAdvertisedKey = advertisedKeys.get(normalizedLookupKey);
	if (exactAdvertisedKey) return exactAdvertisedKey;
	for (const alias of resolveRuntimeConfigOptionAliases(normalizedKey)) {
		const advertisedAlias = advertisedKeys.get(normalizeLowercaseStringOrEmpty(alias));
		if (advertisedAlias) return advertisedAlias;
	}
	return normalizedKey;
}
function inferRuntimeOptionPatchFromConfigOption(key, value) {
	const validated = validateRuntimeConfigOptionInput(key, value);
	const normalizedKey = normalizeLowercaseStringOrEmpty(validated.key);
	if (normalizedKey === "model") return { model: validateRuntimeModelInput(validated.value) };
	if (isThinkingConfigKey(normalizedKey)) return { thinking: validateRuntimeThinkingInput(validated.value) };
	if (RUNTIME_CONFIG_OPTION_ALIASES.permissionProfile.some((alias) => alias === normalizedKey)) return { permissionProfile: validateRuntimePermissionProfileInput(validated.value) };
	if (RUNTIME_CONFIG_OPTION_ALIASES.timeoutSeconds.some((alias) => alias === normalizedKey)) return { timeoutSeconds: parseRuntimeTimeoutSecondsInput(validated.value) };
	if (normalizedKey === "cwd") return { cwd: validateRuntimeCwdInput(validated.value) };
	return { backendExtras: { [validated.key]: validated.value } };
}
//#endregion
//#region src/acp/control-plane/manager.turn-timeout.ts
const ACP_TURN_TIMEOUT_CLEANUP_GRACE_MS = 2e3;
const ACP_TURN_TIMEOUT_REASON = "turn-timeout";
const ACP_TURN_TIMEOUT_DETAIL_CODE = "TURN_TIMEOUT";
function resolveTurnTimeoutMs(params) {
	const runtimeTimeoutSeconds = resolveRuntimeOptionsFromMeta(params.meta).timeoutSeconds;
	if (typeof runtimeTimeoutSeconds === "number" && Number.isFinite(runtimeTimeoutSeconds) && runtimeTimeoutSeconds > 0) return clampTimerTimeoutMs(Math.round(runtimeTimeoutSeconds * 1e3), 1e3) ?? 1e3;
	return resolveAgentTimeoutMs({
		cfg: params.cfg,
		minMs: 1e3
	});
}
async function awaitTurnWithTimeout(params) {
	const timeoutMs = params.timeoutMs <= 0 ? void 0 : clampTimerTimeoutMs(params.timeoutMs, 1);
	if (timeoutMs !== void 0 && !await settlesWithin(params.turnPromise, timeoutMs)) {
		params.turnPromise.catch((error) => {
			logVerbose(`acp-manager: detached late turn error after timeout for ${params.sessionKey}: ${String(error)}`);
		});
		await params.onTimeout();
		throw new AcpRuntimeError("ACP_TURN_FAILED", `ACP turn timed out after ${Math.max(1, Math.round(params.timeoutLabelMs / 1e3))}s.`, { detailCode: ACP_TURN_TIMEOUT_DETAIL_CODE });
	}
	return await params.turnPromise;
}
async function cleanupTimedOutTurn(params) {
	params.activeTurn.abortController.abort();
	if (!params.activeTurn.cancelPromise) params.activeTurn.cancelPromise = params.activeTurn.runtime.cancel({
		handle: params.activeTurn.handle,
		reason: ACP_TURN_TIMEOUT_REASON
	});
	const cancelFinished = await awaitCleanupWithGrace({
		sessionKey: params.sessionKey,
		label: "cancel",
		promise: params.activeTurn.cancelPromise
	});
	if (params.mode !== "oneshot") return;
	const closePromise = params.activeTurn.runtime.close({
		handle: params.activeTurn.handle,
		reason: ACP_TURN_TIMEOUT_REASON
	});
	const closeFinished = await awaitCleanupWithGrace({
		sessionKey: params.sessionKey,
		label: "close",
		promise: closePromise
	});
	if (cancelFinished && closeFinished) {
		params.clearCachedRuntimeStateIfHandleMatches(params.activeTurn);
		return;
	}
	Promise.allSettled([params.activeTurn.cancelPromise, closePromise]).then(() => {
		params.clearCachedRuntimeStateIfHandleMatches(params.activeTurn);
	});
}
async function awaitCleanupWithGrace(params) {
	const observedCleanupPromise = params.promise.then(() => ({ kind: "done" }), (error) => ({
		kind: "error",
		error
	}));
	if (!await settlesWithin(observedCleanupPromise, ACP_TURN_TIMEOUT_CLEANUP_GRACE_MS)) {
		observedCleanupPromise.then((lateOutcome) => {
			if (lateOutcome.kind === "error") logVerbose(`acp-manager: detached timed-out turn ${params.label} cleanup failed for ${params.sessionKey}: ${String(lateOutcome.error)}`);
		});
		logVerbose(`acp-manager: timed-out turn ${params.label} cleanup exceeded ${ACP_TURN_TIMEOUT_CLEANUP_GRACE_MS}ms for ${params.sessionKey}`);
		return false;
	}
	const outcome = await observedCleanupPromise;
	if (outcome.kind === "error") logVerbose(`acp-manager: timed-out turn ${params.label} cleanup failed for ${params.sessionKey}: ${String(outcome.error)}`);
	return true;
}
//#endregion
export { validateRuntimeCwdInput as _, buildRuntimeConfigOptionPairs as a, validateRuntimeOptionPatch as b, isThinkingConfigKey as c, parseRuntimeTimeoutSecondsInput as d, reconcileAcceptedRuntimeOptions as f, validateRuntimeConfigOptionInput as g, runtimeOptionsEqual as h, resolveTurnTimeoutMs as i, mergeRuntimeOptions as l, resolveRuntimeOptionsFromMeta as m, awaitTurnWithTimeout as n, buildRuntimeControlSignature as o, resolveRuntimeConfigOptionKey as p, cleanupTimedOutTurn as r, inferRuntimeOptionPatchFromConfigOption as s, ACP_TURN_TIMEOUT_DETAIL_CODE as t, normalizeRuntimeOptions as u, validateRuntimeModeInput as v, validateRuntimePermissionProfileInput as x, validateRuntimeModelInput as y };
