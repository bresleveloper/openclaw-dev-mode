import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { i as extractErrorCode, n as collectErrorGraphCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { i as resolveRequiredHomeDir } from "./home-dir-Dc6nN6HB.mjs";
import { n as isTruthyEnvValue } from "./env-BBJTTIuE.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as resolveConfigEnvVars } from "./env-substitution-mBnQ8cYd.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { c as readConfigIncludeFileWithGuards, l as resolveConfigIncludeWritePath, o as hashConfigIncludeRaw, u as resolveConfigIncludes } from "./includes-BkzfmxST.mjs";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-BBtWoq5_.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { m as resolveConfigPath, x as resolveIncludeRoots } from "./paths-DGIwWbpu.mjs";
import "./errors-O33D01XW.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { r as cloneEnvWithPlatformSemantics, t as applyConfigEnvVars } from "./config-env-vars-DjPHKieF.mjs";
import { o as createConfigResolutionFacts } from "./resolution-facts-HH1cnmIY.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { createHash } from "node:crypto";
import JSON5 from "json5";
//#region src/config/io.read-helpers.ts
function hashConfigRaw(raw) {
	return raw === null ? hashConfigIncludeRaw(null) : sha256Hex(raw);
}
function hashConfigRevision(raw, includeFileHashes, includeFileTargets) {
	const revision = createHash("sha256").update(raw);
	for (const [includePath, includeHash] of Object.entries(includeFileHashes)) revision.update(JSON.stringify([
		includePath,
		includeFileTargets[includePath],
		includeHash
	]));
	return revision.digest("hex");
}
function readConfigFileIfPresent(deps, configPath) {
	try {
		return deps.fs.readFileSync(configPath, "utf-8");
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
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
	const stack = [value];
	while (stack.length > 0) {
		const current = stack.pop();
		if (Array.isArray(current)) {
			for (const item of current) stack.push(item);
			continue;
		}
		if (!isRecord(current)) continue;
		if ("$include" in current) return true;
		for (const child of Object.values(current)) stack.push(child);
	}
	return false;
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
//#endregion
export { hashConfigRevision as a, readConfigFileIfPresent as c, resolveConfigIncludesForRead as d, resolveConfigPathForDeps as f, restoreAuthoredTildePathsForWrite as h, hashConfigRaw as i, replaceEnvSnapshot as l, resolveGatewayMode as m, containsConfigIncludeDirective as n, normalizeConfigIoDeps as o, resolveConfigSnapshotHash as p, hasConfigMeta as r, parseConfigJson5 as s, coerceConfig as t, resolveConfigForRead as u };
