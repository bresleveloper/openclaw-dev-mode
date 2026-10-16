import { r as normalizeFsSafeNativeEnv } from "./fs-safe-env-CCe2lU-3.mjs";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as parseBooleanValue } from "./boolean-BEb0Fdt8.mjs";
//#region src/infra/env.ts
const loadLog = createLazyPromise(() => import("./env-log.runtime.js"), { cacheRejections: true });
const loggedEnv = /* @__PURE__ */ new Set();
const ENV_NORMALIZATION_KEY_GROUPS = [["ZAI_API_KEY", "Z_AI_API_KEY"]];
/** Logs an accepted env option once, with optional redaction for sensitive values. */
function logAcceptedEnvOption(option) {
	if (process.env.VITEST || false) return;
	if (loggedEnv.has(option.key)) return;
	const rawValue = process.env[option.key];
	if (!rawValue || !rawValue.trim()) return;
	loggedEnv.add(option.key);
	loadLog().then(({ logAcceptedEnvValue }) => {
		logAcceptedEnvValue(option.key, rawValue, option.description, option.redact);
	}).catch(() => {});
}
/** Normalizes the legacy Z_AI_API_KEY spelling into the canonical ZAI_API_KEY env var. */
function normalizeZaiEnv(env = process.env) {
	if (!env.ZAI_API_KEY?.trim() && env.Z_AI_API_KEY?.trim()) env.ZAI_API_KEY = env.Z_AI_API_KEY;
}
/** Expands env keys to include aliases that process-wide normalization treats as equivalent. */
function expandEnvNormalizationKeys(keys) {
	const expanded = /* @__PURE__ */ new Set();
	for (const key of keys) for (const normalizedKey of resolveEnvNormalizationKeys(key)) expanded.add(normalizedKey);
	return expanded;
}
/** Resolves one env key to its canonical-first runtime normalization group. */
function resolveEnvNormalizationKeys(key) {
	const normalizedKey = process.platform === "win32" ? key.toUpperCase() : key;
	return ENV_NORMALIZATION_KEY_GROUPS.find((group) => group.some((candidate) => candidate === normalizedKey)) ?? [normalizedKey];
}
/** Interprets common human/operator truthy env strings. */
function isTruthyEnvValue(value) {
	return parseBooleanValue(value) === true;
}
/** Applies process-wide env normalization before runtime configuration is read. */
function normalizeEnv() {
	normalizeZaiEnv(process.env);
	normalizeFsSafeNativeEnv(process.env);
}
//#endregion
export { normalizeZaiEnv as a, normalizeEnv as i, isTruthyEnvValue as n, resolveEnvNormalizationKeys as o, logAcceptedEnvOption as r, expandEnvNormalizationKeys as t };
