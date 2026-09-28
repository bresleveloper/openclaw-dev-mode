import "./openclaw-state-db.paths-D1f0LUdT.mjs";
import { I as containsEnvVarReference } from "./redact-0yyk4gHy.mjs";
import { l as normalizeZaiEnv, n as isDangerousHostEnvVarName, r as normalizeEnvVarKey, s as expandEnvNormalizationKeys, t as isDangerousHostEnvOverrideVarName, u as resolveEnvNormalizationKeys } from "./host-env-security-DFM0cQIV.mjs";
import { i as normalizeLegacyDotBetaVersion, t as compareOpenClawSemver } from "./semver-aYpwYdrQ.mjs";
import { parse } from "semver";
//#region src/config/version.ts
/** Parses stable, prerelease, and legacy dot-beta OpenClaw versions. */
function parseOpenClawVersion(raw) {
	if (!raw) return null;
	const normalized = normalizeLegacyDotBetaVersion(raw.trim());
	return parse(normalized);
}
function compareOpenClawVersions(a, b) {
	const parsedA = parseOpenClawVersion(a);
	const parsedB = parseOpenClawVersion(b);
	if (!parsedA || !parsedB) return null;
	return compareOpenClawSemver(parsedA, parsedB);
}
//#endregion
//#region src/config/config-env-vars.ts
function isBlockedConfigEnvVar(key) {
	return key.toUpperCase() === "OPENCLAW_ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS" || key.toUpperCase() === "OPENCLAW_INCLUDE_ROOTS" || key.toUpperCase() === "OPENCLAW_CONFIG_READONLY" || isDangerousHostEnvVarName(key) || isDangerousHostEnvOverrideVarName(key);
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
function envSnapshotKey(key) {
	return process.platform === "win32" ? key.toUpperCase() : key;
}
const appliedConfigEnvOwnership = /* @__PURE__ */ new WeakMap();
function resolveAppliedConfigEnvOwnership(env) {
	return {
		...appliedConfigEnvOwnership.get(env),
		...env === process.env ? publishedConfigRuntimeEnvState.ownedEnv : {}
	};
}
function cloneEnvWithPlatformSemantics(env) {
	const cloned = { ...env };
	const ownedEnv = resolveAppliedConfigEnvOwnership(env);
	if (process.platform !== "win32") {
		appliedConfigEnvOwnership.set(cloned, ownedEnv);
		return cloned;
	}
	const proxy = new Proxy(cloned, {
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
	appliedConfigEnvOwnership.set(proxy, ownedEnv);
	return proxy;
}
/** Collects config env vars safe to inject into runtime process environments. */
function collectConfigRuntimeEnvVars(cfg) {
	return collectConfigEnvVarsByTarget(cfg);
}
let publishedConfigRuntimeEnvState = {
	generation: 0,
	ownedEnv: {},
	sourceConfig: null
};
function collectConfigRuntimeEnvOwnership(sourceConfig, before, after, options = {}) {
	const ownedEnv = {};
	const replacedLowerPrecedenceKeys = new Set((options.replacedLowerPrecedenceKeys ?? []).map(envSnapshotKey));
	for (const [key, value] of Object.entries(collectConfigRuntimeEnvVars(sourceConfig))) for (const normalizedKey of resolveEnvNormalizationKeys(key)) {
		const afterKey = findCaseInsensitiveEnvKey(after, normalizedKey);
		if (!afterKey || after[afterKey] !== value) continue;
		const beforeKey = findCaseInsensitiveEnvKey(before, normalizedKey);
		if (beforeKey && before[beforeKey] === value && !replacedLowerPrecedenceKeys.has(envSnapshotKey(afterKey))) continue;
		ownedEnv[afterKey] = value;
	}
	return ownedEnv;
}
function filterConfigRuntimeEnvOwnership(sourceConfig, env, ownedEnv) {
	const allowedValues = /* @__PURE__ */ new Map();
	for (const [key, value] of Object.entries(collectConfigRuntimeEnvVars(sourceConfig))) for (const normalizedKey of resolveEnvNormalizationKeys(key)) {
		const values = allowedValues.get(normalizedKey) ?? /* @__PURE__ */ new Set();
		values.add(value);
		allowedValues.set(normalizedKey, values);
	}
	const filtered = {};
	for (const [key, value] of Object.entries(ownedEnv)) {
		const normalizedKey = resolveEnvNormalizationKeys(key)[0] ?? key;
		const actualKey = findCaseInsensitiveEnvKey(env, key);
		if (actualKey && env[actualKey] === value && allowedValues.get(normalizedKey)?.has(value)) filtered[actualKey] = value;
	}
	return filtered;
}
/** Applies config env vars to an environment without overwriting existing non-empty values. */
function applyConfigEnvVars(cfg, env = process.env, options = {}) {
	const before = { ...env };
	const previousOwnedEnv = resolveAppliedConfigEnvOwnership(env);
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
	appliedConfigEnvOwnership.set(env, {
		...filterConfigRuntimeEnvOwnership(cfg, env, previousOwnedEnv),
		...collectConfigRuntimeEnvOwnership(cfg, before, env, { replacedLowerPrecedenceKeys })
	});
}
//#endregion
export { cloneEnvWithPlatformSemantics as n, compareOpenClawVersions as r, applyConfigEnvVars as t };
