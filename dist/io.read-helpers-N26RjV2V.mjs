import { i as extractErrorCode, n as collectErrorGraphCandidates } from "./error-coercion-C787aVxk.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.mjs";
import { i as resolveRequiredHomeDir } from "./home-dir-BKwhAL2c.mjs";
import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import { a as hashConfigIncludeRaw, c as resolveConfigIncludeWritePath, l as resolveConfigIncludes, s as readConfigIncludeFileWithGuards } from "./includes-CaaCq-XN.mjs";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-BBtWoq5_.mjs";
import { E as resolveStateDir, p as resolveConfigPath, y as resolveIncludeRoots } from "./paths-DehQwyE0.mjs";
import { o as createConfigResolutionFacts } from "./resolution-facts-CSuKIPux.mjs";
import { X as resolveConfigEnvVars } from "./redact-B5EGyLvV.mjs";
import "./errors-DnjwnOju.mjs";
import { c as getPublishedConfigRuntimeEnvState, i as collectConfigRuntimeEnvVars, n as cloneEnvWithPlatformSemantics, s as createConfigRuntimeEnvBase, t as applyConfigEnvVars } from "./config-env-vars-BHI12YH5.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { u as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import { t as loadDotEnv } from "./dotenv-DvPPvduE.mjs";
import "./env-vars-jrzBxc1h.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import JSON5 from "json5";
//#region src/config/gateway-env-selection.ts
const GATEWAY_CONFIG_SELECTION_ENV_KEYS = /* @__PURE__ */ new Set([
	"ANDROID_DATA",
	"HOME",
	"HOMEDRIVE",
	"HOMEPATH",
	"OPENCLAW_AGENT_DIR",
	"OPENCLAW_CONFIG_PATH",
	"OPENCLAW_HOME",
	"OPENCLAW_INCLUDE_ROOTS",
	"OPENCLAW_CONFIG_READONLY",
	"OPENCLAW_NIX_MODE",
	"OPENCLAW_OAUTH_DIR",
	"OPENCLAW_PACKAGE_DIR",
	"OPENCLAW_PROFILE",
	"OPENCLAW_STATE_DIR",
	"OPENCLAW_WORKSPACE_DIR",
	"PI_CODING_AGENT_DIR",
	"PREFIX",
	"USERPROFILE"
]);
/** Rejects config.env changes that would retarget a running Gateway process. */
function assertGatewayConfigEnvSelectionUnchanged(previousConfig, nextConfig) {
	const normalize = (config) => new Map(Object.entries(collectConfigRuntimeEnvVars(config)).map(([key, value]) => [key.toUpperCase(), value]));
	const previous = normalize(previousConfig);
	const next = normalize(nextConfig);
	for (const key of GATEWAY_CONFIG_SELECTION_ENV_KEYS) if (previous.get(key) !== next.get(key)) throw new Error(`Config env cannot change process-stable Gateway selector ${key} during reload. Restart with the target environment instead.`);
}
//#endregion
//#region src/config/io.read-helpers.ts
function hashConfigRaw(raw) {
	return raw === null ? hashConfigIncludeRaw(null) : sha256Hex(raw);
}
function resolveConfigSnapshotHash(snapshot) {
	return normalizeNullableString(snapshot.hash) ?? (typeof snapshot.raw === "string" ? hashConfigRaw(snapshot.raw) : null);
}
function coerceConfig(value) {
	return asOptionalRecord(value) ?? {};
}
function hasConfigMeta(value) {
	return isRecord(asOptionalRecord(value)?.meta);
}
function resolveGatewayMode(value) {
	const gateway = asOptionalRecord(asOptionalRecord(value)?.gateway);
	return normalizeNullableString(gateway?.mode);
}
function containsConfigIncludeDirective(value) {
	if (Array.isArray(value)) return value.some((item) => containsConfigIncludeDirective(item));
	if (!isRecord(value)) return false;
	if ("$include" in value) return true;
	return Object.values(value).some((item) => containsConfigIncludeDirective(item));
}
function resolveConfigPathForDeps(deps) {
	if (deps.configPath) return deps.configPath;
	return resolveConfigPath(deps.env, resolveStateDir(deps.env, deps.homedir));
}
function normalizeConfigIoDeps(overrides = {}) {
	const env = overrides.env ?? process.env;
	return {
		fs: overrides.fs ?? fs,
		json5: overrides.json5 ?? JSON5,
		env,
		lowerPrecedenceEnv: overrides.lowerPrecedenceEnv ?? {},
		homedir: overrides.homedir ?? (() => resolveRequiredHomeDir(env, os.homedir)),
		configPath: overrides.configPath ?? "",
		logger: overrides.logger ?? console,
		measure: overrides.measure ?? (async (_name, run) => await run()),
		suppressFutureVersionWarning: overrides.suppressFutureVersionWarning ?? (isTruthyEnvValue(env.OPENCLAW_UPDATE_IN_PROGRESS) || isTruthyEnvValue(env.OPENCLAW_UPDATE_POST_CORE)),
		observe: overrides.observe ?? true
	};
}
function maybeLoadDotEnvForConfig(env) {
	if (env === process.env) loadDotEnv({ quiet: true });
}
function parseConfigJson5(raw, json5 = JSON5) {
	try {
		return {
			ok: true,
			parsed: parseJsonWithJson5Fallback(raw, json5)
		};
	} catch (err) {
		return {
			ok: false,
			error: String(err)
		};
	}
}
const TILDE_PATH_VALUE_RE = /^~(?=$|[\\/])/;
const PATH_LIKE_CONFIG_KEY_RE = /(dir|path|paths|file|root|workspace)$/i;
const PATH_LIKE_CONFIG_LIST_KEYS = /* @__PURE__ */ new Set(["paths", "pathPrepend"]);
function isPathLikeConfigKey(key) {
	return Boolean(key && (PATH_LIKE_CONFIG_KEY_RE.test(key) || PATH_LIKE_CONFIG_LIST_KEYS.has(key)));
}
function expandAuthoredTildePath(value, home) {
	const suffix = value.slice(1);
	if (!suffix) return home;
	if (suffix.startsWith("/") || suffix.startsWith("\\")) return path.join(home, suffix.slice(1));
	return value;
}
function restoreAuthoredTildePathsForWrite(next, authored, key, home) {
	if (typeof next === "string" && typeof authored === "string" && isPathLikeConfigKey(key) && TILDE_PATH_VALUE_RE.test(authored.trim()) && path.normalize(next) === path.normalize(expandAuthoredTildePath(authored.trim(), home))) return authored;
	if (Array.isArray(next) && Array.isArray(authored)) {
		const normalizeChildren = isPathLikeConfigKey(key);
		return next.map((entry, index) => restoreAuthoredTildePathsForWrite(entry, authored[index], normalizeChildren ? key : void 0, home));
	}
	if (!isRecord(next) || !isRecord(authored)) return next;
	const out = { ...next };
	for (const [childKey, childValue] of Object.entries(out)) if (Object.hasOwn(authored, childKey)) out[childKey] = restoreAuthoredTildePathsForWrite(childValue, authored[childKey], childKey, home);
	return out;
}
function resolveConfigIncludesForRead(parsed, configPath, deps, includeFileHashesForWrite, includeFileTargetsForWrite, includeFilePathsForWatch, onIncludeResolved) {
	const allowedRoots = resolveIncludeRoots(deps.env, deps.homedir);
	const recordIncludeWatchPath = (resolvedPath) => {
		includeFilePathsForWatch?.add(path.normalize(resolvedPath));
	};
	const recordIncludeTarget = (resolvedPath, canonicalPath) => {
		if (!includeFileTargetsForWrite) return;
		const normalizedPath = path.normalize(resolvedPath);
		try {
			includeFileTargetsForWrite[normalizedPath] = path.normalize(canonicalPath ?? resolveConfigIncludeWritePath({
				configPath,
				includePath: resolvedPath,
				allowedRoots
			}));
		} catch {}
	};
	return resolveConfigIncludes(parsed, configPath, {
		readFile: (candidate) => deps.fs.readFileSync(candidate, "utf-8"),
		onLexicalPath: recordIncludeWatchPath,
		onIncludeResolved,
		readFileWithGuards: ({ includePath, resolvedPath, rootRealDir }) => {
			try {
				const raw = readConfigIncludeFileWithGuards({
					includePath,
					resolvedPath,
					rootRealDir,
					ioFs: deps.fs,
					onResolvedPath: (canonicalPath) => {
						recordIncludeWatchPath(canonicalPath);
						recordIncludeTarget(resolvedPath, canonicalPath);
					}
				});
				if (includeFileHashesForWrite) includeFileHashesForWrite[path.normalize(resolvedPath)] = hashConfigIncludeRaw(raw);
				return raw;
			} catch (error) {
				const missing = collectErrorGraphCandidates(error, (current) => [current.cause]).some((candidate) => extractErrorCode(candidate) === "ENOENT");
				if (includeFileHashesForWrite && missing) includeFileHashesForWrite[path.normalize(resolvedPath)] = hashConfigIncludeRaw(null);
				if (missing) recordIncludeTarget(resolvedPath);
				throw error;
			}
		},
		parseJson: (raw) => deps.json5.parse(raw)
	}, { allowedRoots });
}
function resolveConfigForRead(resolvedIncludes, env, lowerPrecedenceEnv = {}) {
	if (resolvedIncludes && typeof resolvedIncludes === "object" && "env" in resolvedIncludes) applyConfigEnvVars(resolvedIncludes, env, { lowerPrecedenceEnv });
	const envWarnings = [];
	const pendingEnvSecretRefs = /* @__PURE__ */ new Map();
	const resolvedEnvSecretRefs = /* @__PURE__ */ new Map();
	const resolvedConfigRaw = resolveConfigEnvVars(resolvedIncludes, env, {
		onMissing: (warning) => envWarnings.push(warning),
		onPendingEnvSecretRef: (id, configPath) => pendingEnvSecretRefs.set(configPath, id),
		onResolvedEnvSecretRef: (id, configPath) => resolvedEnvSecretRefs.set(configPath, id)
	});
	return {
		resolvedConfigRaw,
		envSnapshotForRestore: cloneEnvWithPlatformSemantics(env),
		envWarnings,
		resolutionFacts: createConfigResolutionFacts(envWarnings, pendingEnvSecretRefs, coerceConfig(resolvedConfigRaw).secrets?.defaults?.env, resolvedEnvSecretRefs)
	};
}
function replaceEnvSnapshot(env, next) {
	for (const key of Object.keys(env)) delete env[key];
	Object.assign(env, next);
}
function resolveManagedRuntimeEnvBaseline() {
	const published = getPublishedConfigRuntimeEnvState();
	return {
		generation: published.generation,
		sourceConfig: published.sourceConfig ?? getRuntimeConfigSourceSnapshot() ?? {}
	};
}
function createManagedRuntimeEnvBase(env = process.env) {
	return createConfigRuntimeEnvBase(resolveManagedRuntimeEnvBaseline().sourceConfig, env, {
		ownedEnv: getPublishedConfigRuntimeEnvState().ownedEnv,
		preservedKeys: GATEWAY_CONFIG_SELECTION_ENV_KEYS
	});
}
//#endregion
export { GATEWAY_CONFIG_SELECTION_ENV_KEYS as _, hashConfigRaw as a, parseConfigJson5 as c, resolveConfigIncludesForRead as d, resolveConfigPathForDeps as f, restoreAuthoredTildePathsForWrite as g, resolveManagedRuntimeEnvBaseline as h, hasConfigMeta as i, replaceEnvSnapshot as l, resolveGatewayMode as m, containsConfigIncludeDirective as n, maybeLoadDotEnvForConfig as o, resolveConfigSnapshotHash as p, createManagedRuntimeEnvBase as r, normalizeConfigIoDeps as s, coerceConfig as t, resolveConfigForRead as u, assertGatewayConfigEnvSelectionUnchanged as v };
