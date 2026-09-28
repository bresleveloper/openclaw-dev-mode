import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as resolveLoadedCommitHash } from "./git-commit-BowlM7El.mjs";
import { createRequire } from "node:module";
//#region src/version.ts
const CORE_PACKAGE_NAME = "openclaw";
const PACKAGE_JSON_CANDIDATES = [
	"../package.json",
	"../../package.json",
	"../../../package.json",
	"./package.json"
];
const BUILD_INFO_CANDIDATES = [
	"../build-info.json",
	"../../build-info.json",
	"./build-info.json"
];
function readVersionFromJsonCandidates(moduleUrl, candidates, opts = {}) {
	try {
		const require = createRequire(moduleUrl);
		for (const candidate of candidates) try {
			const parsed = require(candidate);
			const version = normalizeOptionalString(parsed.version);
			if (!version) continue;
			if (opts.requirePackageName && parsed.name !== CORE_PACKAGE_NAME) continue;
			return version;
		} catch {}
		return null;
	} catch {
		return null;
	}
}
function readBuildIdFromJsonCandidates(moduleUrl) {
	try {
		const require = createRequire(moduleUrl);
		for (const candidate of BUILD_INFO_CANDIDATES) try {
			const parsed = require(candidate);
			const buildId = normalizeOptionalString(parsed.buildId);
			if (buildId && buildId.length <= 96) return buildId;
		} catch {}
		return null;
	} catch {
		return null;
	}
}
function firstNonEmpty(...values) {
	for (const value of values) {
		const trimmed = normalizeOptionalString(value);
		if (trimmed && trimmed.toLowerCase() !== "undefined" && trimmed.toLowerCase() !== "null") return trimmed;
	}
}
function readVersionFromPackageJsonForModuleUrl(moduleUrl) {
	return readVersionFromJsonCandidates(moduleUrl, PACKAGE_JSON_CANDIDATES, { requirePackageName: true });
}
function readVersionFromBuildInfoForModuleUrl(moduleUrl) {
	return readVersionFromJsonCandidates(moduleUrl, BUILD_INFO_CANDIDATES);
}
function readBuildIdFromBuildInfoForModuleUrl(moduleUrl) {
	return readBuildIdFromJsonCandidates(moduleUrl);
}
function resolveVersionFromModuleUrl(moduleUrl) {
	return readVersionFromBuildInfoForModuleUrl(moduleUrl) || readVersionFromPackageJsonForModuleUrl(moduleUrl);
}
function resolveBinaryVersion(params) {
	return resolveVersionFromModuleUrl(params.moduleUrl) || firstNonEmpty(params.bundledVersion) || params.fallback || "0.0.0";
}
const RUNTIME_SERVICE_VERSION_FALLBACK = "unknown";
function resolveUsableRuntimeVersion(version) {
	const trimmed = normalizeOptionalString(version);
	if (!trimmed || trimmed === "0.0.0") return;
	return trimmed;
}
function resolveVersionFromRuntimeSources(params) {
	return firstNonEmpty(...params.preference === "env-first" ? [params.env["OPENCLAW_VERSION"], params.runtimeVersion] : [params.runtimeVersion, params.env["OPENCLAW_VERSION"]], params.env["npm_package_version"]) ?? params.fallback;
}
function resolveRuntimeServiceVersion(env = process.env, fallback = RUNTIME_SERVICE_VERSION_FALLBACK) {
	return resolveVersionFromRuntimeSources({
		env,
		runtimeVersion: resolveUsableRuntimeVersion(VERSION),
		fallback,
		preference: "env-first"
	});
}
const RUNTIME_SERVICE_BUILD_ID = readBuildIdFromBuildInfoForModuleUrl(import.meta.url);
const RUNTIME_SERVICE_COMMIT = resolveLoadedCommitHash({ moduleUrl: import.meta.url });
function resolveRuntimeServiceBuildId() {
	return RUNTIME_SERVICE_BUILD_ID;
}
function resolveRuntimeServiceCommit() {
	return RUNTIME_SERVICE_COMMIT;
}
function resolveCompatibilityHostVersion(env = process.env, fallback = RUNTIME_SERVICE_VERSION_FALLBACK) {
	const explicitCompatibilityVersion = firstNonEmpty(env.OPENCLAW_COMPATIBILITY_HOST_VERSION);
	if (explicitCompatibilityVersion) return explicitCompatibilityVersion;
	return resolveVersionFromRuntimeSources({
		env,
		runtimeVersion: resolveUsableRuntimeVersion(VERSION),
		fallback,
		preference: env === process.env ? "runtime-first" : "env-first"
	});
}
const VERSION = resolveBinaryVersion({
	moduleUrl: import.meta.url,
	bundledVersion: process.env.OPENCLAW_BUNDLED_VERSION
});
//#endregion
export { resolveBinaryVersion as a, resolveRuntimeServiceCommit as c, resolveVersionFromModuleUrl as d, readVersionFromPackageJsonForModuleUrl as i, resolveRuntimeServiceVersion as l, readBuildIdFromBuildInfoForModuleUrl as n, resolveCompatibilityHostVersion as o, readVersionFromBuildInfoForModuleUrl as r, resolveRuntimeServiceBuildId as s, VERSION as t, resolveUsableRuntimeVersion as u };
