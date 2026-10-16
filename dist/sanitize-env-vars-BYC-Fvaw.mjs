import { r as isInstalledPluginEnabled } from "./installed-plugin-index-Zl-RSskC.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DkhWcws3.mjs";
import { i as listKnownSecretEnvVarNames } from "./provider-env-vars-C_lyIdYO.mjs";
import { t as hashTextSha256 } from "./hash-DV5OH4uO.mjs";
import { t as SECRET_ENV_NAME_RE } from "./secret-env-name-gnYTrC3J.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/sandbox/config-hash.ts
/**
* Stable sandbox config hashing for container reuse decisions.
*
* Undefined values and object key order are normalized so semantically equal
* configs keep the same hash while security epoch changes force recreation.
*/
const SANDBOX_DOCKER_EXPLICIT_ENV_POLICY_EPOCH = "explicit-config-env-v1";
function normalizeForHash(value) {
	if (Array.isArray(value)) return value.map(normalizeForHash).filter((item) => item !== void 0);
	if (value && typeof value === "object") {
		const entries = Object.entries(value).toSorted(([a], [b]) => a.localeCompare(b));
		const normalized = {};
		for (const [key, entryValue] of entries) {
			const next = normalizeForHash(entryValue);
			if (next !== void 0) normalized[key] = next;
		}
		return normalized;
	}
	return value;
}
/** Computes the sandbox container config hash. */
function computeSandboxConfigHash(input) {
	return hashTextSha256(JSON.stringify(normalizeForHash(input)));
}
/** Computes the browser-enabled sandbox container config hash. */
function computeSandboxBrowserConfigHash(input) {
	return computeSandboxConfigHash(input);
}
//#endregion
//#region src/agents/sandbox/sanitize-env-vars.ts
/**
* Filters environment variables before they cross into sandbox runtimes.
*
* The default path blocks common credential names and suspicious value shapes while allowing
* ordinary process environment needed for shells and Node-based tools.
*/
const BLOCKED_ENV_VAR_PATTERNS = [
	/^AWS_(SECRET_ACCESS_KEY|SECRET_KEY|SESSION_TOKEN)$/i,
	/_ADMIN_KEY$/i,
	SECRET_ENV_NAME_RE
];
const ALLOWED_ENV_VAR_PATTERNS = [
	/^LANG$/,
	/^LC_.*$/i,
	/^PATH$/i,
	/^HOME$/i,
	/^USER$/i,
	/^SHELL$/i,
	/^TERM$/i,
	/^TZ$/i,
	/^NODE_ENV$/i
];
const MAX_ENV_VAR_VALUE_BYTES = 32768;
function resolveDockerEnvPolicyEpoch(env) {
	const explicitEnv = env ?? {};
	const previousAllowed = sanitizeEnvVars(explicitEnv).allowed;
	const currentAllowed = sanitizeExplicitSandboxEnvVars(explicitEnv).allowed;
	return isDeepStrictEqual(previousAllowed, currentAllowed) ? void 0 : SANDBOX_DOCKER_EXPLICIT_ENV_POLICY_EPOCH;
}
/** Returns a warning or block reason for environment values that look unsafe to forward. */
function validateEnvVarValue(value) {
	if (value.includes("\0")) return "Contains null bytes";
	if (Buffer.byteLength(value, "utf8") > MAX_ENV_VAR_VALUE_BYTES) return "Value exceeds maximum length";
	if (/^[A-Za-z0-9+/=]{80,}$/.test(value)) return "Value looks like base64-encoded credential data";
}
function matchesAnyPattern(value, patterns) {
	return patterns.some((pattern) => pattern.test(value));
}
/** Sanitizes inherited environment variables for automatic sandbox propagation. */
function sanitizeEnvVars(envVars, options = {}) {
	const blockedPatterns = [...BLOCKED_ENV_VAR_PATTERNS, ...options.customBlockedPatterns ?? []];
	const allowedPatterns = [...ALLOWED_ENV_VAR_PATTERNS, ...options.customAllowedPatterns ?? []];
	const metadataSnapshot = getCurrentPluginMetadataSnapshot({
		allowScopedSnapshot: true,
		allowWorkspaceScopedSnapshot: true
	});
	const activeMetadataSnapshot = metadataSnapshot ? {
		...metadataSnapshot,
		plugins: metadataSnapshot.plugins.filter((plugin) => isInstalledPluginEnabled(metadataSnapshot.index, plugin.id))
	} : void 0;
	const knownSecretNames = new Set(listKnownSecretEnvVarNames({ metadataSnapshot: activeMetadataSnapshot }).map((name) => name.trim().toUpperCase()));
	return sanitizeSandboxEnvValues(envVars, (key) => knownSecretNames.has(key.toUpperCase()) || matchesAnyPattern(key, blockedPatterns) || Boolean(options.strictMode) && !matchesAnyPattern(key, allowedPatterns));
}
/** Sanitizes env vars explicitly requested by config, preserving names but still validating values. */
function sanitizeExplicitSandboxEnvVars(envVars) {
	return sanitizeSandboxEnvValues(envVars);
}
function sanitizeSandboxEnvValues(envVars, isBlockedName) {
	const allowed = {};
	const blocked = [];
	const warnings = [];
	for (const [rawKey, value] of Object.entries(envVars)) {
		const key = rawKey.trim();
		if (!key || value === void 0) continue;
		if (isBlockedName?.(key)) {
			blocked.push(key);
			continue;
		}
		const warning = validateEnvVarValue(value);
		if (warning) {
			if (warning === "Contains null bytes") {
				blocked.push(key);
				continue;
			}
			warnings.push(`${key}: ${warning}`);
		}
		allowed[key] = value;
	}
	return {
		allowed,
		blocked,
		warnings
	};
}
//#endregion
export { computeSandboxBrowserConfigHash as a, validateEnvVarValue as i, sanitizeEnvVars as n, computeSandboxConfigHash as o, sanitizeExplicitSandboxEnvVars as r, resolveDockerEnvPolicyEpoch as t };
