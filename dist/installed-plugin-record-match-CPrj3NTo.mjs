import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, or as union, xn as literal } from "./schemas-BOYIvvln.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as isPathInside } from "./path-safety-Cc0rrc_m.mjs";
import { l as pluginCacheRealpathSync } from "./package-manifest-C8sTeZKW.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { r as resolveActivePluginInstallRoots, t as hasActivePluginInstallRoots } from "./install-root-context-DEOzYnOP.mjs";
import { E as resolvePluginCandidateInstallOwner, w as isPluginCandidateInstallOwnerAmbiguous } from "./discovery-D_5mAUI7.mjs";
import { i as isTrustedOfficialPluginInstallRecord } from "./official-external-install-records-CwKXyAFm.mjs";
import path from "node:path";
//#region src/config/zod-schema.installs.ts
const InstallSourceSchema = union([
	literal("npm"),
	literal("archive"),
	literal("path"),
	literal("clawhub"),
	literal("git")
]);
const PluginInstallSourceSchema = union([InstallSourceSchema, literal("marketplace")]);
/** Zod object shape for persisted generic install records. */
const InstallRecordShape = {
	source: InstallSourceSchema,
	spec: string().optional(),
	sourcePath: string().optional(),
	installPath: string().optional(),
	version: string().optional(),
	resolvedName: string().optional(),
	resolvedVersion: string().optional(),
	resolvedSpec: string().optional(),
	integrity: string().optional(),
	shasum: string().optional(),
	resolvedAt: string().optional(),
	installedAt: string().optional(),
	clawhubUrl: string().optional(),
	clawhubPackage: string().optional(),
	clawhubFamily: union([literal("code-plugin"), literal("bundle-plugin")]).optional(),
	clawhubChannel: union([
		literal("official"),
		literal("community"),
		literal("private")
	]).optional(),
	clawhubTrustDisposition: union([
		literal("clean"),
		literal("review-recommended"),
		literal("review-required"),
		literal("blocked")
	]).optional(),
	clawhubTrustScanStatus: string().optional(),
	clawhubTrustModerationState: string().optional(),
	clawhubTrustReasons: array(string()).optional(),
	clawhubTrustPending: boolean().optional(),
	clawhubTrustStale: boolean().optional(),
	clawhubTrustCheckedAt: string().optional(),
	clawhubTrustAcknowledgedAt: string().optional(),
	artifactKind: union([literal("legacy-zip"), literal("npm-pack")]).optional(),
	artifactFormat: union([literal("zip"), literal("tgz")]).optional(),
	npmIntegrity: string().optional(),
	npmShasum: string().optional(),
	npmTarballName: string().optional(),
	clawpackSha256: string().optional(),
	clawpackSpecVersion: number().int().nonnegative().optional(),
	clawpackManifestSha256: string().optional(),
	clawpackSize: number().int().nonnegative().optional(),
	gitUrl: string().optional(),
	gitRef: string().optional(),
	gitCommit: string().optional()
};
object(InstallRecordShape);
const PluginInstallRecordShape = {
	...InstallRecordShape,
	source: PluginInstallSourceSchema,
	marketplaceName: string().optional(),
	marketplaceSource: string().optional(),
	marketplacePlugin: string().optional(),
	acceptedSurface: object({
		channels: array(string().min(1)),
		providers: array(string().min(1)),
		tools: array(string().min(1)),
		contracts: array(string().min(1)),
		hooks: array(string().min(1)),
		mcpServers: array(string().min(1)),
		cliCommands: array(string().min(1)),
		cliBackends: array(string().min(1)),
		skills: array(string().min(1)),
		dangerousConfigFlags: array(string().min(1))
	}).strict().optional(),
	acceptedSurfaceHash: string().optional(),
	acceptedSurfaceAt: string().optional(),
	acceptedSurfaceIntegrity: string().optional()
};
//#endregion
//#region src/config/plugin-install-record-map.ts
const PluginInstallRecordSchema = object(PluginInstallRecordShape).passthrough();
const NORMALIZED_STRING_FIELDS = [
	"spec",
	"sourcePath",
	"installPath",
	"version",
	"resolvedName",
	"resolvedVersion",
	"resolvedSpec",
	"integrity",
	"shasum",
	"resolvedAt",
	"installedAt",
	"clawhubUrl",
	"clawhubPackage",
	"clawhubFamily",
	"clawhubChannel",
	"clawhubTrustDisposition",
	"clawhubTrustScanStatus",
	"clawhubTrustModerationState",
	"clawhubTrustCheckedAt",
	"clawhubTrustAcknowledgedAt",
	"artifactKind",
	"artifactFormat",
	"npmIntegrity",
	"npmShasum",
	"npmTarballName",
	"clawpackSha256",
	"clawpackManifestSha256",
	"gitUrl",
	"gitRef",
	"gitCommit",
	"marketplaceName",
	"marketplaceSource",
	"marketplacePlugin",
	"acceptedSurfaceHash",
	"acceptedSurfaceAt",
	"acceptedSurfaceIntegrity"
];
const utf8Encoder = new TextEncoder();
function comparePluginIds(left, right) {
	const leftBytes = utf8Encoder.encode(left);
	const rightBytes = utf8Encoder.encode(right);
	const sharedLength = Math.min(leftBytes.length, rightBytes.length);
	for (let index = 0; index < sharedLength; index += 1) {
		const difference = (leftBytes[index] ?? 0) - (rightBytes[index] ?? 0);
		if (difference !== 0) return difference;
	}
	return leftBytes.length - rightBytes.length;
}
function createPluginInstallRecordMap() {
	return Object.create(null);
}
function setPluginInstallRecordMapEntry(records, pluginId, record) {
	Object.defineProperty(records, pluginId, {
		configurable: true,
		enumerable: true,
		value: record,
		writable: true
	});
}
function getPluginInstallRecordMapEntry(records, pluginId) {
	return records && Object.hasOwn(records, pluginId) ? records[pluginId] : void 0;
}
function copyPluginInstallRecordMap(records) {
	const copied = createPluginInstallRecordMap();
	for (const [pluginId, record] of Object.entries(records ?? {})) setPluginInstallRecordMapEntry(copied, pluginId, record);
	return copied;
}
function parsePluginInstallRecord(value) {
	const parsed = PluginInstallRecordSchema.safeParse(value);
	if (!parsed.success) return null;
	const record = parsed.data;
	for (const field of NORMALIZED_STRING_FIELDS) {
		const fieldValue = record[field];
		if (typeof fieldValue !== "string") continue;
		const normalized = fieldValue.trim();
		if (normalized) record[field] = normalized;
		else delete record[field];
	}
	if (record.clawhubTrustReasons) {
		const reasons = record.clawhubTrustReasons.map((entry) => entry.trim()).filter(Boolean);
		if (reasons.length > 0) record.clawhubTrustReasons = reasons;
		else delete record.clawhubTrustReasons;
	}
	return record;
}
function parsePluginInstallRecordMap(value) {
	if (!isRecord(value)) return null;
	const records = createPluginInstallRecordMap();
	for (const [pluginId, rawRecord] of Object.entries(value)) {
		const record = parsePluginInstallRecord(rawRecord);
		if (!record) return null;
		setPluginInstallRecordMapEntry(records, pluginId, record);
	}
	return records;
}
function inspectPluginInstallRecordMap(value) {
	if (value === void 0) return { status: "missing" };
	const records = parsePluginInstallRecordMap(value);
	return records ? {
		status: "valid",
		records
	} : { status: "invalid" };
}
/**
* Object enumeration reorders integer-index keys, so persisted bytes must be
* assembled from sorted entries instead of relying on object insertion order.
*/
function serializePluginInstallRecordMap(records) {
	return `{${Object.entries(records).toSorted(([left], [right]) => comparePluginIds(left, right)).map(([pluginId, record]) => `${JSON.stringify(pluginId)}:${JSON.stringify(record)}`).join(",")}}`;
}
//#endregion
//#region src/plugins/installed-plugin-index-store-path.ts
const LEGACY_INSTALLED_PLUGIN_INDEX_STORE_PATH = path.join("plugins", "installs.json");
function resolveStoreEnv(options) {
	const env = options.env ?? process.env;
	if (options.stateDir) return {
		...env,
		OPENCLAW_STATE_DIR: options.stateDir
	};
	if (hasActivePluginInstallRoots()) return {
		...env,
		OPENCLAW_STATE_DIR: resolveActivePluginInstallRoots(env).stateDir
	};
	return env;
}
/** Resolves the canonical SQLite-backed installed plugin index path. */
function resolveInstalledPluginIndexStorePath(options = {}) {
	if (options.filePath) return options.filePath;
	return resolveOpenClawStateSqlitePath(resolveStoreEnv(options));
}
/** Resolves state database options for the installed plugin index store. */
function resolveInstalledPluginIndexStateDatabaseOptions(options = {}) {
	if (options.filePath) return {
		...options.env ? { env: options.env } : {},
		path: options.filePath
	};
	return { env: resolveStoreEnv(options) };
}
/** Resolves the legacy JSON installed plugin index path for migration/doctor use. */
function resolveLegacyInstalledPluginIndexStorePath(options = {}) {
	if (options.filePath) return options.filePath;
	const env = options.env ?? process.env;
	const stateDir = options.stateDir ?? resolveActivePluginInstallRoots(env).stateDir;
	return path.join(stateDir, LEGACY_INSTALLED_PLUGIN_INDEX_STORE_PATH);
}
//#endregion
//#region src/plugins/installed-plugin-record-match.ts
function resolveCandidateInstallOwner(params) {
	if (isPluginCandidateInstallOwnerAmbiguous(params.candidate)) return;
	const installOwner = resolvePluginCandidateInstallOwner(params.candidate);
	if (installOwner) return Object.hasOwn(params.installRecords, installOwner) ? installOwner : void 0;
}
function matchesInstalledPluginRecord(params) {
	if (params.candidate.origin !== "global" && params.candidate.origin !== "config") return false;
	const installOwner = resolveCandidateInstallOwner(params);
	const record = installOwner ? params.installRecords[installOwner] : void 0;
	if (!record) return false;
	const candidatePaths = [
		params.candidate.rootDir,
		params.candidate.packageDir,
		params.candidate.source,
		params.candidate.setupSource
	].filter((entry) => typeof entry === "string" && entry.trim().length > 0).map((entry) => {
		const resolved = resolveUserPath(entry, params.env);
		return pluginCacheRealpathSync(resolved) ?? resolved;
	});
	const trackedPaths = (params.installPathOnly ? [record.installPath] : [record.installPath, record.sourcePath]).filter((entry) => typeof entry === "string" && entry.trim().length > 0).map((entry) => {
		const resolved = resolveUserPath(entry, params.env);
		return pluginCacheRealpathSync(resolved) ?? resolved;
	});
	if (candidatePaths.length === 0 || trackedPaths.length === 0) return false;
	return trackedPaths.some((trackedPath) => candidatePaths.some((candidatePath) => candidatePath === trackedPath || isPathInside(trackedPath, candidatePath) || isPathInside(candidatePath, trackedPath)));
}
function resolvePluginTrust(params) {
	const installOwner = resolveCandidateInstallOwner(params);
	const record = installOwner ? params.installRecords[installOwner] : void 0;
	const origin = params.candidate.origin;
	let reason;
	if (origin === "bundled") reason = "bundled";
	else if (isPluginCandidateInstallOwnerAmbiguous(params.candidate)) reason = "owner-ambiguous";
	else if (origin === "workspace" || record?.source === "path" || record?.source === "npm" && (record.artifactKind !== void 0 || record.sourcePath !== void 0)) reason = "origin-path";
	else if (!record || !installOwner) reason = "record-missing";
	else if (!matchesInstalledPluginRecord({
		pluginId: params.pluginId,
		candidate: params.candidate,
		env: params.env,
		installRecords: params.installRecords,
		installPathOnly: true
	})) reason = "install-path-mismatch";
	else if (isTrustedOfficialPluginInstallRecord({
		pluginId: installOwner,
		packageName: params.candidate.packageName,
		record
	})) reason = "trusted-official";
	else if (record.source === "npm" && record.spec === void 0 && record.resolvedName === void 0 && record.resolvedSpec === void 0 || record.source === "clawhub" && record.clawhubUrl === void 0 && record.clawhubChannel === void 0) reason = "provenance-missing";
	else reason = "provenance-invalid";
	return {
		reason,
		registryPath: params.registryPath,
		origin,
		installSource: record?.source,
		installSpec: record?.spec === void 0 ? void 0 : redactSensitiveText(record.spec, { mode: "tools" })
	};
}
//#endregion
export { resolveLegacyInstalledPluginIndexStorePath as a, createPluginInstallRecordMap as c, parsePluginInstallRecord as d, parsePluginInstallRecordMap as f, resolveInstalledPluginIndexStorePath as i, getPluginInstallRecordMapEntry as l, setPluginInstallRecordMapEntry as m, resolvePluginTrust as n, PluginInstallRecordSchema as o, serializePluginInstallRecordMap as p, resolveInstalledPluginIndexStateDatabaseOptions as r, copyPluginInstallRecordMap as s, matchesInstalledPluginRecord as t, inspectPluginInstallRecordMap as u };
