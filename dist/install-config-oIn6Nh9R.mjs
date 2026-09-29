import { c as isRecord, o as asRecord } from "./record-coerce-DItp3I4t.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { s as tracePluginLifecyclePhaseAsync } from "./discovery-D_5mAUI7.mjs";
import { r as loadPluginManifest } from "./manifest-DHkEL08H.mjs";
import { m as tryReadJsonSync } from "./json-files-C0HSMh2Z.mjs";
import { o as parseRegistryNpmSpec } from "./npm-registry-spec-CjcsDXUg.mjs";
import { l as listOfficialExternalPluginCatalogEntries, p as resolveOfficialExternalPluginInstall } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { h as resolveOfficialExternalPluginId } from "./official-external-plugin-catalog-source-CkmJlLAW.mjs";
import { u as readConfigFileSnapshotForWrite } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import "./installed-plugin-index-records-Clh203og.mjs";
import { t as findBundledPluginSource } from "./bundled-sources-Bi9l5Ik4.mjs";
import { n as listPersistedBundledPluginRecoveryLocations } from "./location-bridges-CupxxkaU.mjs";
import { i as supportsInstallConfigSingleTopLevelIncludeShape, n as resolveInstallConfigMutationPreflights, r as selectInstallMutationWriteOptions } from "./install-config-mutation-COmtsyZD.mjs";
import { a as resolveBundledInstallPlanBeforeNpm, i as parseNpmPrefixSpec, o as resolveFileNpmSpecToLocalPath } from "./install-source-spec-CwVOmH1V.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/install-config.ts
function resolveFullyBlockedConfigMutationReason(snapshot) {
	if (snapshot.pluginMutation.mode !== "blocked" || snapshot.hookMutation.mode !== "blocked") return null;
	if (snapshot.pluginMutation.reason === snapshot.hookMutation.reason) return snapshot.pluginMutation.reason;
	return `Config plugin and hook mutations are both blocked. ${snapshot.pluginMutation.reason} ${snapshot.hookMutation.reason}`;
}
var PluginInstallConfigError = class extends Error {
	constructor(message, blockedSnapshot) {
		super(message);
		this.blockedSnapshot = blockedSnapshot;
		this.code = "INVALID_CONFIG";
		this.name = "PluginInstallConfigError";
	}
};
function extractMissingPluginLoadPath(issue) {
	if (issue.path !== "plugins.load.paths") return null;
	const markerIndex = issue.message.indexOf("plugin path not found:");
	if (markerIndex < 0) return null;
	return issue.message.slice(markerIndex + 22).trim() || null;
}
function isOwnedMissingPluginLoadPathIssue(issue, ownedLoadPaths, env = process.env) {
	const missingPath = extractMissingPluginLoadPath(issue);
	return missingPath !== null && ownedLoadPaths.has(resolveUserPath(missingPath, env));
}
function isAllowedPluginRecoveryIssue(issue, request, ownedLoadPaths) {
	const pluginId = request.bundledPluginId?.trim();
	if (!pluginId) return false;
	return issue.path === `channels.${pluginId}` && issue.message === `unknown channel id: ${pluginId}` || issue.path.startsWith("channels.") && issue.message.startsWith(`invalid config for plugin ${pluginId}:`) || isOwnedMissingPluginLoadPathIssue(issue, ownedLoadPaths) || issue.path === `plugins.entries.${pluginId}` && issue.message.includes("requires compiled runtime output") || issue.path === "tools.web.search.provider" && issue.message.includes(`plugin "${pluginId}"`);
}
function removeOwnedMissingPluginLoadPaths(cfg, issues, ownedLoadPaths, env) {
	const missingPaths = /* @__PURE__ */ new Set();
	for (const issue of issues) {
		const missingPath = extractMissingPluginLoadPath(issue);
		if (!missingPath) continue;
		const resolved = resolveUserPath(missingPath, env);
		if (ownedLoadPaths.has(resolved)) missingPaths.add(resolved);
	}
	const paths = cfg.plugins?.load?.paths;
	if (missingPaths.size === 0 || !Array.isArray(paths)) return cfg;
	const nextPaths = paths.filter((entry) => typeof entry !== "string" || !missingPaths.has(resolveUserPath(entry, env)));
	if (nextPaths.length === paths.length) return cfg;
	return {
		...cfg,
		plugins: {
			...cfg.plugins,
			load: {
				...cfg.plugins?.load,
				paths: nextPaths
			}
		}
	};
}
async function resolveRequestedPluginInstallPaths(cfg, issues, request, env) {
	if (!issues.some((issue) => extractMissingPluginLoadPath(issue) !== null)) return /* @__PURE__ */ new Set();
	const installRecords = await loadInstalledPluginIndexInstallRecords();
	const ownedLoadPaths = /* @__PURE__ */ new Set();
	const pluginId = request.bundledPluginId?.trim();
	if (!pluginId) return ownedLoadPaths;
	const record = installRecords[pluginId] ?? cfg.plugins?.installs?.[pluginId];
	for (const value of [record?.sourcePath, record?.installPath]) if (typeof value === "string" && value.trim()) ownedLoadPaths.add(resolveUserPath(value, env));
	if (issues.some((issue) => extractMissingPluginLoadPath(issue) !== null && !isOwnedMissingPluginLoadPathIssue(issue, ownedLoadPaths, env))) {
		const loadPaths = (await listPersistedBundledPluginRecoveryLocations({ env })).filter((location) => location.pluginId === pluginId).flatMap((location) => location.loadPaths);
		for (const loadPath of loadPaths) ownedLoadPaths.add(resolveUserPath(loadPath, env));
	}
	return ownedLoadPaths;
}
async function recoverPluginInstallConfig(request, snapshot) {
	if (resolvePluginInstallInvalidConfigPolicy(request) !== "allow-plugin-recovery") throw new PluginInstallConfigError("Config invalid; run `openclaw doctor --fix` before installing plugins.");
	const parsed = snapshot.parsed ?? {};
	if (!snapshot.exists || Object.keys(parsed).length === 0) throw new PluginInstallConfigError("Config file could not be parsed; run `openclaw doctor` to repair it.");
	const ownedLoadPaths = await resolveRequestedPluginInstallPaths(snapshot.config, snapshot.issues, request, process.env);
	if (snapshot.legacyIssues.length > 0 || snapshot.issues.length === 0 || snapshot.issues.some((issue) => !isAllowedPluginRecoveryIssue(issue, request, ownedLoadPaths))) throw new PluginInstallConfigError(`Config invalid outside the plugin recovery path for ${request.bundledPluginId ?? "the requested plugin"}; run \`openclaw doctor --fix\` before reinstalling it.`);
	if (Object.hasOwn(parsed, "$include") || !supportsInstallConfigSingleTopLevelIncludeShape(isRecord(parsed) ? parsed.plugins : void 0)) throw new PluginInstallConfigError("Config plugin recovery uses an unsupported $include shape; use a single-file top-level plugins include or run `openclaw doctor --fix` before reinstalling it.");
	return removeOwnedMissingPluginLoadPaths(snapshot.config, snapshot.issues, ownedLoadPaths, process.env);
}
/** Read and authorize install configuration only after mutation-free request preflight. */
async function loadConfigForInstall(request) {
	const { snapshot, writeOptions } = await tracePluginLifecyclePhaseAsync("config read", () => readConfigFileSnapshotForWrite(), { command: "install" });
	const mutationWriteOptions = selectInstallMutationWriteOptions(writeOptions);
	const config = snapshot.valid ? snapshot.sourceConfig : await recoverPluginInstallConfig(request, snapshot);
	const parsed = asRecord(snapshot.parsed);
	const { hookMutation, pluginMutation } = resolveInstallConfigMutationPreflights({
		parsed,
		snapshotPath: snapshot.path,
		writeOptions: mutationWriteOptions
	});
	const resolved = {
		config,
		baseHash: snapshot.hash,
		writeOptions: mutationWriteOptions,
		hookMutation,
		pluginMutation
	};
	if (!snapshot.valid || request.installKind === "plugin") {
		if (pluginMutation.mode === "blocked") throw new PluginInstallConfigError(pluginMutation.reason, resolved);
	}
	return resolved;
}
function readPluginInstallRecoveryMetadata(rootDir) {
	const packageJsonPath = path.join(rootDir, "package.json");
	if (!fs.existsSync(packageJsonPath)) return { allowInvalidConfigRecovery: false };
	const manifest = loadPluginManifest(rootDir, false);
	const pluginId = manifest.ok ? manifest.manifest.id : void 0;
	const parsed = tryReadJsonSync(packageJsonPath);
	return {
		...pluginId ? { pluginId } : {},
		allowInvalidConfigRecovery: parsed?.openclaw?.install?.allowInvalidConfigRecovery === true
	};
}
function resolvePluginInstallRecoveryMetadata(rawSpec, localPath) {
	if (localPath !== void 0) {
		const direct = readPluginInstallRecoveryMetadata(localPath);
		return direct.pluginId || direct.allowInvalidConfigRecovery ? direct : {};
	}
	const npmPrefixSpec = parseNpmPrefixSpec(rawSpec);
	const values = new Set(normalizeStringEntries([
		rawSpec,
		npmPrefixSpec ?? "",
		parseRegistryNpmSpec(rawSpec)?.name ?? "",
		npmPrefixSpec ? parseRegistryNpmSpec(npmPrefixSpec)?.name : ""
	]));
	if (values.size === 0) return {};
	for (const entry of listOfficialExternalPluginCatalogEntries()) {
		const install = resolveOfficialExternalPluginInstall(entry);
		const npmSpec = install?.npmSpec?.trim() || entry.name?.trim();
		if (!npmSpec || !values.has(npmSpec)) continue;
		const pluginId = resolveOfficialExternalPluginId(entry);
		return {
			...pluginId ? { pluginId } : {},
			allowInvalidConfigRecovery: install?.allowInvalidConfigRecovery === true
		};
	}
	return {};
}
/** Resolve install metadata from the raw spec before Commander action handlers mutate config. */
function resolvePluginInstallRequestContext(params) {
	if (params.marketplace) return {
		ok: true,
		request: {
			rawSpec: params.rawSpec,
			installKind: "plugin",
			marketplace: params.marketplace
		}
	};
	const fileSpec = resolveFileNpmSpecToLocalPath(params.rawSpec);
	if (fileSpec && !fileSpec.ok) return {
		ok: false,
		error: fileSpec.error
	};
	const normalizedSpec = fileSpec && fileSpec.ok ? fileSpec.path : params.rawSpec;
	const resolvedPath = resolveUserPath(params.localPath ?? normalizedSpec);
	const localPath = params.source ? params.source === "local" || params.source === "bundled" ? resolvedPath : void 0 : fileSpec || fs.existsSync(resolvedPath) ? resolvedPath : resolveBundledInstallPlanBeforeNpm({
		rawSpec: params.rawSpec,
		findBundledSource: (lookup) => findBundledPluginSource({ lookup })
	})?.bundledSource.localPath;
	const recovered = resolvePluginInstallRecoveryMetadata(params.rawSpec, localPath);
	return {
		ok: true,
		request: {
			rawSpec: params.rawSpec,
			...params.installKind === "plugin" || recovered.pluginId ? { installKind: "plugin" } : {},
			...recovered.pluginId ? { bundledPluginId: recovered.pluginId } : {},
			...recovered.allowInvalidConfigRecovery !== void 0 ? { allowInvalidConfigRecovery: recovered.allowInvalidConfigRecovery } : {}
		}
	};
}
/** Decide whether invalid config should block a command before plugin recovery can run. */
function resolvePluginInstallInvalidConfigPolicy(request) {
	if (!request) return "deny";
	return request.allowInvalidConfigRecovery === true ? "allow-plugin-recovery" : "deny";
}
//#endregion
export { resolvePluginInstallRequestContext as a, resolvePluginInstallInvalidConfigPolicy as i, loadConfigForInstall as n, resolveFullyBlockedConfigMutationReason as r, PluginInstallConfigError as t };
