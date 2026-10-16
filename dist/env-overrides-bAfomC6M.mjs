import { t as appendConfigPathSegment } from "./dot-path-CVD5Jolm.mjs";
import { d as normalizeResolvedSecretInputString } from "./types.secrets-DsPRn9Dz.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as isDangerousHostEnvOverrideVarName, r as isDangerousHostEnvVarName } from "./host-env-security-BgpkByrc.mjs";
import { r as resolveSkillKey } from "./frontmatter-CrckYGsg.mjs";
import { i as validateEnvVarValue, n as sanitizeEnvVars } from "./sanitize-env-vars-BYC-Fvaw.mjs";
import { a as isSkillSecretOwnerUnavailable, c as resolveSkillConfig } from "./config-EAfnzCK1.mjs";
import { t as resolveSkillRuntimeConfig } from "./runtime-config-O9JalVnY.mjs";
//#region src/skills/runtime/env-overrides.ts
const log = createSubsystemLogger("env-overrides");
/**
* Tracks env var keys that are currently injected by skill overrides.
* Used by ACP harness spawn to strip skill-injected keys so they don't
* leak to child processes (e.g., OPENAI_API_KEY leaking to Codex CLI).
* @see https://github.com/openclaw/openclaw/issues/36280
*/
const activeSkillEnvEntries = /* @__PURE__ */ new Map();
/** Returns a snapshot of env var keys currently injected by skill overrides. */
function getActiveSkillEnvKeysCore() {
	return new Set(activeSkillEnvEntries.keys());
}
function acquireActiveSkillEnvKey(key, value) {
	let active = activeSkillEnvEntries.get(key);
	if (active) active.count += 1;
	else {
		if (process.env[key] !== void 0) return false;
		active = {
			value,
			count: 1
		};
		activeSkillEnvEntries.set(key, active);
	}
	process.env[key] = active.value;
	return true;
}
function releaseActiveSkillEnvKey(key) {
	const active = activeSkillEnvEntries.get(key);
	if (!active) return;
	active.count -= 1;
	if (active.count > 0) {
		if (process.env[key] === void 0) process.env[key] = active.value;
		return;
	}
	activeSkillEnvEntries.delete(key);
	delete process.env[key];
}
function isAlwaysBlockedSkillEnvKey(key) {
	return isDangerousHostEnvVarName(key) || isDangerousHostEnvOverrideVarName(key) || /^OPENSSL_CONF$/i.test(key);
}
function sanitizeSkillEnvOverrides(params) {
	if (Object.keys(params.overrides).length === 0) return {
		allowed: {},
		blocked: [],
		warnings: []
	};
	const result = sanitizeEnvVars(params.overrides);
	const allowed = {};
	const blocked = /* @__PURE__ */ new Set();
	const warnings = [...result.warnings];
	for (const [key, value] of Object.entries(result.allowed)) {
		if (isAlwaysBlockedSkillEnvKey(key)) {
			blocked.add(key);
			continue;
		}
		allowed[key] = value;
	}
	for (const key of result.blocked) {
		if (isAlwaysBlockedSkillEnvKey(key) || !params.allowedSensitiveKeys.has(key)) {
			blocked.add(key);
			continue;
		}
		const value = params.overrides[key];
		if (!value) continue;
		const warning = validateEnvVarValue(value);
		if (warning) {
			if (warning === "Contains null bytes") {
				blocked.add(key);
				continue;
			}
			warnings.push(`${key}: ${warning}`);
		}
		allowed[key] = value;
	}
	return {
		allowed,
		blocked: [...blocked],
		warnings
	};
}
function applySkillConfigEnvOverrides(params) {
	const { updates, primaryEnv, requiredEnv, skillKey } = params;
	if (isSkillSecretOwnerUnavailable(skillKey)) return;
	const skillConfig = resolveSkillConfig(params.config, skillKey);
	if (!skillConfig || skillConfig.enabled === false) return;
	const allowedSensitiveKeys = /* @__PURE__ */ new Set();
	const normalizedPrimaryEnv = primaryEnv?.trim();
	if (normalizedPrimaryEnv) allowedSensitiveKeys.add(normalizedPrimaryEnv);
	for (const envName of requiredEnv ?? []) {
		const trimmedEnv = envName.trim();
		if (trimmedEnv) allowedSensitiveKeys.add(trimmedEnv);
	}
	const pendingOverrides = {};
	if (skillConfig.env) for (const [rawKey, envValue] of Object.entries(skillConfig.env)) {
		const envKey = rawKey.trim();
		const hasExternallyManagedValue = process.env[envKey] !== void 0 && !activeSkillEnvEntries.has(envKey);
		if (!envKey || !envValue || hasExternallyManagedValue) continue;
		pendingOverrides[envKey] = envValue;
	}
	if (normalizedPrimaryEnv && (process.env[normalizedPrimaryEnv] === void 0 || activeSkillEnvEntries.has(normalizedPrimaryEnv)) && !pendingOverrides[normalizedPrimaryEnv]) {
		const resolvedApiKey = normalizeResolvedSecretInputString({
			value: skillConfig.apiKey,
			path: `${appendConfigPathSegment("skills.entries", skillKey)}.apiKey`
		}) ?? "";
		if (resolvedApiKey) pendingOverrides[normalizedPrimaryEnv] = resolvedApiKey;
	}
	const sanitized = sanitizeSkillEnvOverrides({
		overrides: pendingOverrides,
		allowedSensitiveKeys
	});
	if (sanitized.blocked.length > 0) log.warn(`Blocked skill env overrides for ${skillKey}: ${sanitized.blocked.join(", ")}`);
	if (sanitized.warnings.length > 0) log.warn(`Suspicious skill env overrides for ${skillKey}: ${sanitized.warnings.join(", ")}`);
	for (const [envKey, envValue] of Object.entries(sanitized.allowed)) {
		if (!acquireActiveSkillEnvKey(envKey, envValue)) continue;
		updates.push(envKey);
	}
}
function createEnvReverter(updates) {
	return () => {
		for (const update of updates) releaseActiveSkillEnvKey(update);
	};
}
function applySkillEnvOverrides(params) {
	const { skills } = params;
	const config = resolveSkillRuntimeConfig(params.config);
	const updates = [];
	for (const entry of skills) applySkillConfigEnvOverrides({
		updates,
		config,
		primaryEnv: entry.metadata?.primaryEnv,
		requiredEnv: entry.metadata?.requires?.env,
		skillKey: resolveSkillKey(entry.skill, entry)
	});
	return createEnvReverter(updates);
}
function applySkillEnvOverridesFromSnapshot(params) {
	const { snapshot } = params;
	const config = resolveSkillRuntimeConfig(params.config);
	const updates = [];
	for (const skill of snapshot?.skills ?? []) applySkillConfigEnvOverrides({
		updates,
		config,
		primaryEnv: skill.primaryEnv,
		requiredEnv: skill.requiredEnv,
		skillKey: skill.skillKey ?? skill.name
	});
	return createEnvReverter(updates);
}
//#endregion
export { applySkillEnvOverridesFromSnapshot as n, getActiveSkillEnvKeysCore as r, applySkillEnvOverrides as t };
