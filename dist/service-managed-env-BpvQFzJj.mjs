import { v as sortUniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { a as normalizeEnvVarKey } from "./host-env-security-D7wdDMke.mjs";
import { i as detectRespawnSupervisor } from "./supervisor-markers-DL2AtFkv.mjs";
//#region src/daemon/service-managed-env.ts
/** Tracks managed service environment keys across reinstall and repair flows. */
const MANAGED_SERVICE_ENV_KEYS_VAR = "OPENCLAW_SERVICE_MANAGED_ENV_KEYS";
function normalizeServiceEnvKey(key) {
	return normalizeEnvVarKey(key, { portable: true })?.toUpperCase() ?? null;
}
function normalizeServiceEnvKeys(keys) {
	return new Set([...keys].flatMap((key) => {
		const normalized = normalizeServiceEnvKey(key);
		return normalized ? [normalized] : [];
	}));
}
function hasInlineEnvironmentSource(source) {
	return source === void 0 || source === "inline" || source === "inline-and-file";
}
function isEnvironmentFileOnlySource(source) {
	return source === "file";
}
function hasEnvironmentFileSource(source) {
	return source === "file" || source === "inline-and-file";
}
function parseManagedServiceEnvKeys(value) {
	return normalizeServiceEnvKeys(value?.split(",") ?? []);
}
function formatManagedServiceEnvKeys(managedEnvironment, options) {
	const omitKeys = normalizeServiceEnvKeys(options?.omitKeys ?? []);
	const keys = Object.keys(managedEnvironment).map(normalizeServiceEnvKey).filter((key) => Boolean(key && !omitKeys.has(key))).toSorted();
	return keys.length > 0 ? keys.join(",") : void 0;
}
function readManagedServiceEnvKeysFromEnvironment(environment) {
	if (!environment) return /* @__PURE__ */ new Set();
	for (const [rawKey, rawValue] of Object.entries(environment)) if (normalizeServiceEnvKey(rawKey) === MANAGED_SERVICE_ENV_KEYS_VAR) return parseManagedServiceEnvKeys(rawValue);
	return /* @__PURE__ */ new Set();
}
function readManagedSystemdServiceEnvKeysFromEnvironment(environment, platform = process.platform) {
	return environment && detectRespawnSupervisor(environment, platform) === "systemd" ? readManagedServiceEnvKeysFromEnvironment(environment) : /* @__PURE__ */ new Set();
}
function clearMissingManagedServiceEnvKeys(params) {
	const presentKeys = new Set([...params.presentKeys, ...params.preserveKeys ?? []].flatMap((key) => {
		const normalized = normalizeServiceEnvKey(key);
		return normalized ? [normalized] : [];
	}));
	const missingKeys = [...params.managedKeys].filter((key) => {
		const normalized = normalizeServiceEnvKey(key);
		return normalized !== null && !presentKeys.has(normalized);
	});
	deleteManagedServiceEnvKeys(params.environment, missingKeys);
}
function deleteManagedServiceEnvKeys(environment, keys) {
	const normalizedKeys = normalizeServiceEnvKeys(keys);
	if (normalizedKeys.size === 0) return;
	for (const rawKey of Object.keys(environment)) {
		const key = normalizeServiceEnvKey(rawKey);
		if (key && normalizedKeys.has(key)) delete environment[rawKey];
	}
}
function writeManagedServiceEnvKeysToEnvironment(environment, value) {
	if (!value) return;
	deleteManagedServiceEnvKeys(environment, parseManagedServiceEnvKeys(value));
	environment[MANAGED_SERVICE_ENV_KEYS_VAR] = value;
}
function readEnvironmentValueSource(environmentValueSources, key) {
	const normalizedKey = normalizeServiceEnvKey(key);
	if (!normalizedKey) return;
	for (const [rawKey, source] of Object.entries(environmentValueSources ?? {})) if (normalizeServiceEnvKey(rawKey) === normalizedKey) return source;
}
function collectInlineManagedServiceEnvKeys(command, expectedManagedKeys) {
	if (!command?.environment) return [];
	const managedKeys = parseManagedServiceEnvKeys(command.environment[MANAGED_SERVICE_ENV_KEYS_VAR]);
	for (const key of normalizeServiceEnvKeys(expectedManagedKeys ?? [])) managedKeys.add(key);
	return collectInlineServiceEnvKeys(command, managedKeys);
}
function collectInlineServiceEnvKeys(command, expectedKeys) {
	if (!command?.environment) return [];
	const normalizedKeys = normalizeServiceEnvKeys(expectedKeys);
	if (normalizedKeys.size === 0) return [];
	const inlineKeys = [];
	for (const [rawKey, value] of Object.entries(command.environment)) {
		if (typeof value !== "string" || !value.trim()) continue;
		const normalized = normalizeServiceEnvKey(rawKey);
		if (!normalized || !normalizedKeys.has(normalized)) continue;
		if (normalized === MANAGED_SERVICE_ENV_KEYS_VAR) continue;
		if (!hasInlineEnvironmentSource(readEnvironmentValueSource(command.environmentValueSources, normalized))) continue;
		inlineKeys.push(normalized);
	}
	return sortUniqueStrings(inlineKeys);
}
//#endregion
export { hasEnvironmentFileSource as a, normalizeServiceEnvKey as c, readManagedServiceEnvKeysFromEnvironment as d, readManagedSystemdServiceEnvKeysFromEnvironment as f, formatManagedServiceEnvKeys as i, normalizeServiceEnvKeys as l, collectInlineManagedServiceEnvKeys as n, hasInlineEnvironmentSource as o, writeManagedServiceEnvKeysToEnvironment as p, collectInlineServiceEnvKeys as r, isEnvironmentFileOnlySource as s, clearMissingManagedServiceEnvKeys as t, readEnvironmentValueSource as u };
