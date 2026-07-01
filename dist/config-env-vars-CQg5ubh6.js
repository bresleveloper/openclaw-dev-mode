import { o as normalizeZaiEnv, s as resolveEnvNormalizationKeys, t as expandEnvNormalizationKeys } from "./env-CKmI-C4z.js";
import { a as normalizeEnvVarKey, n as isDangerousHostEnvOverrideVarName, r as isDangerousHostEnvVarName } from "./host-env-security-CmrI0DLD.js";
import { n as containsEnvVarReference } from "./env-substitution-C5mGH-0o.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
import { r as shouldWarnOnTouchedVersion } from "./version-NKzkBmMs.js";
//#region src/config/future-version-guard.ts
/** Override env var for intentional older-binary destructive config actions. */
const ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV = "OPENCLAW_ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS";
function allowOlderBinaryDestructiveActions(env) {
	const raw = env[ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV]?.trim().toLowerCase();
	return raw === "1" || raw === "true" || raw === "yes";
}
function resolveTouchedVersion(params) {
	return params.snapshot?.sourceConfig?.meta?.lastTouchedVersion?.trim() || params.snapshot?.config?.meta?.lastTouchedVersion?.trim() || params.config?.meta?.lastTouchedVersion?.trim() || null;
}
/** Resolves whether a destructive action should be blocked by future config metadata. */
function resolveFutureConfigActionBlock(params) {
	if (allowOlderBinaryDestructiveActions(params.env ?? process.env)) return null;
	const currentVersion = params.currentVersion ?? VERSION;
	const touchedVersion = resolveTouchedVersion(params);
	if (!touchedVersion || !shouldWarnOnTouchedVersion(currentVersion, touchedVersion)) return null;
	return {
		action: params.action,
		currentVersion,
		touchedVersion,
		message: `Refusing to ${params.action} because this OpenClaw binary (${currentVersion}) is older than the config last written by OpenClaw ${touchedVersion}.`,
		hints: ["Run the newer openclaw binary on PATH, or reinstall the intended gateway service from the newer install.", `Set ${ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV}=1 only for an intentional downgrade or recovery action.`]
	};
}
/** Formats a future-config action block for CLI/service error output. */
function formatFutureConfigActionBlock(block) {
	return [block.message, ...block.hints].join("\n");
}
//#endregion
//#region src/config/config-env-vars.ts
function isBlockedConfigEnvVar(key) {
	return key.toUpperCase() === "OPENCLAW_ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS" || key.toUpperCase() === "OPENCLAW_INCLUDE_ROOTS" || isDangerousHostEnvVarName(key) || isDangerousHostEnvOverrideVarName(key);
}
/** Returns whether a config-controlled environment entry is safe to apply at runtime. */
function isConfigRuntimeEnvVarAllowed(key, value) {
	return Boolean(value.trim()) && !isBlockedConfigEnvVar(key) && !containsEnvVarReference(value);
}
function collectConfigEnvVarsByTarget(cfg) {
	const envConfig = cfg?.env;
	if (!envConfig) return {};
	const entries = {};
	if (envConfig.vars) for (const [rawKey, value] of Object.entries(envConfig.vars)) {
		if (typeof value !== "string" || !value.trim()) continue;
		const key = normalizeEnvVarKey(rawKey, { portable: true });
		if (!key) continue;
		if (!isConfigRuntimeEnvVarAllowed(key, value)) continue;
		entries[key] = value;
	}
	for (const [rawKey, value] of Object.entries(envConfig)) {
		if (rawKey === "shellEnv" || rawKey === "vars") continue;
		if (typeof value !== "string" || !value.trim()) continue;
		const key = normalizeEnvVarKey(rawKey, { portable: true });
		if (!key) continue;
		if (!isConfigRuntimeEnvVarAllowed(key, value)) continue;
		entries[key] = value;
	}
	return entries;
}
function findCaseInsensitiveEnvKey(env, key) {
	if (Object.hasOwn(env, key)) return key;
	const upperKey = key.toUpperCase();
	return Object.keys(env).find((candidate) => candidate.toUpperCase() === upperKey);
}
function cloneEnvWithPlatformSemantics(env) {
	const cloned = { ...env };
	if (process.platform !== "win32") return cloned;
	return new Proxy(cloned, {
		deleteProperty(target, property) {
			if (typeof property !== "string") return Reflect.deleteProperty(target, property);
			const key = findCaseInsensitiveEnvKey(target, property);
			return key ? Reflect.deleteProperty(target, key) : true;
		},
		get(target, property, receiver) {
			if (typeof property !== "string") return Reflect.get(target, property, receiver);
			const key = findCaseInsensitiveEnvKey(target, property);
			return key ? target[key] : Reflect.get(target, property, receiver);
		},
		getOwnPropertyDescriptor(target, property) {
			if (typeof property !== "string") return Reflect.getOwnPropertyDescriptor(target, property);
			const key = findCaseInsensitiveEnvKey(target, property);
			if (!key) return;
			return {
				configurable: true,
				enumerable: true,
				value: target[key],
				writable: true
			};
		},
		has(target, property) {
			return typeof property === "string" ? findCaseInsensitiveEnvKey(target, property) !== void 0 : Reflect.has(target, property);
		},
		set(target, property, value) {
			if (typeof property !== "string") return Reflect.set(target, property, value);
			target[findCaseInsensitiveEnvKey(target, property) ?? property] = value;
			return true;
		}
	});
}
/** Collects config env vars safe to inject into runtime process environments. */
function collectConfigRuntimeEnvVars(cfg) {
	return collectConfigEnvVarsByTarget(cfg);
}
/** Collects config env vars safe to persist into managed service environments. */
function collectConfigServiceEnvVars(cfg) {
	return collectConfigEnvVarsByTarget(cfg);
}
/** Builds a cloned environment with config env vars applied without mutating the base env. */
function createConfigRuntimeEnv(cfg, baseEnv = process.env) {
	const env = cloneEnvWithPlatformSemantics(baseEnv);
	applyConfigEnvVars(cfg, env);
	return env;
}
/** Applies config env vars to an environment without overwriting existing non-empty values. */
function applyConfigEnvVars(cfg, env = process.env, options = {}) {
	const entries = collectConfigRuntimeEnvVars(cfg);
	const lowerPrecedenceEntries = Object.entries(options.lowerPrecedenceEnv ?? {});
	const normalizeKey = (key) => process.platform === "win32" ? key.toUpperCase() : key;
	const lowerPrecedenceEnv = new Map(lowerPrecedenceEntries.map(([key, value]) => [normalizeKey(key), value]));
	const configEnvKeys = expandEnvNormalizationKeys(Object.keys(entries));
	const configValuesByKey = /* @__PURE__ */ new Map();
	for (const [key, value] of Object.entries(entries)) for (const normalizedKey of resolveEnvNormalizationKeys(key)) {
		const values = configValuesByKey.get(normalizedKey) ?? /* @__PURE__ */ new Set();
		values.add(value);
		configValuesByKey.set(normalizedKey, values);
	}
	const higherPrecedenceValues = /* @__PURE__ */ new Map();
	for (const key of Object.keys(entries)) {
		const normalizedKeys = resolveEnvNormalizationKeys(key);
		const winningValue = normalizedKeys.map((normalizedKey) => [normalizedKey, env[normalizedKey]]).find(([normalizedKey, currentValue]) => currentValue?.trim() && lowerPrecedenceEnv.get(normalizedKey) !== currentValue && !configValuesByKey.get(normalizedKey)?.has(currentValue))?.[1];
		if (winningValue !== void 0) for (const normalizedKey of normalizedKeys) higherPrecedenceValues.set(normalizedKey, winningValue);
	}
	const replacedLowerPrecedenceKeys = [];
	for (const [key, value] of lowerPrecedenceEntries) if (configEnvKeys.has(normalizeKey(key)) && env[key] === value) {
		delete env[key];
		replacedLowerPrecedenceKeys.push(key);
	}
	if (replacedLowerPrecedenceKeys.length > 0) options.onLowerPrecedenceKeysReplaced?.(replacedLowerPrecedenceKeys);
	for (const [key, value] of Object.entries(entries)) {
		const higherPrecedenceValue = higherPrecedenceValues.get(normalizeKey(key));
		if (higherPrecedenceValue !== void 0) {
			env[key] = higherPrecedenceValue;
			continue;
		}
		const currentValue = env[key];
		if (currentValue?.trim() && lowerPrecedenceEnv.get(normalizeKey(key)) !== currentValue) continue;
		if (containsEnvVarReference(value)) continue;
		env[key] = value;
	}
	normalizeZaiEnv(env);
}
//#endregion
export { createConfigRuntimeEnv as a, formatFutureConfigActionBlock as c, collectConfigServiceEnvVars as i, resolveFutureConfigActionBlock as l, cloneEnvWithPlatformSemantics as n, isConfigRuntimeEnvVarAllowed as o, collectConfigRuntimeEnvVars as r, ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV as s, applyConfigEnvVars as t };
