import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-Cur9Uhkp.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries, y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { _ as resolveConfigDir } from "./utils-aKqR_F_U.mjs";
import { p as readPluginCacheJsonFile } from "./package-manifest-C8sTeZKW.mjs";
import { n as MANIFEST_KEY } from "./legacy-names-NIXaj2oi.mjs";
import { a as isPrereleaseSemverVersion, o as parseRegistryNpmSpec } from "./npm-registry-spec-CjcsDXUg.mjs";
import { s as listOfficialExternalChannelCatalogEntries } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { t as describePluginInstallSource } from "./install-source-info-DMwlOhrv.mjs";
import { t as listChannelCatalogEntries } from "./channel-catalog-registry-DT_h3Okz.mjs";
import { t as buildManifestChannelMeta } from "./channel-meta-BgTks57p.mjs";
import path from "node:path";
//#region src/channels/plugins/catalog.ts
/**
* Channel plugin catalog builder.
*
* Combines bundled, installed, and official external channel metadata for UI/setup surfaces.
*/
const ORIGIN_PRIORITY = {
	config: 0,
	workspace: 1,
	global: 2,
	bundled: 3
};
function shouldExcludeCatalogEntry(options, pluginId, origin) {
	const normalizedPluginId = normalizeOptionalString(pluginId);
	return options.excludeWorkspace === true && origin === "workspace" || origin !== void 0 && (options.excludeOrigins?.includes(origin) ?? false) || Boolean(normalizedPluginId && options.excludePluginRefs?.some((entry) => entry.pluginId === normalizedPluginId && (entry.origin === void 0 || entry.origin === origin)));
}
const EXTERNAL_CATALOG_PRIORITY = ORIGIN_PRIORITY.bundled + 1;
const FALLBACK_CATALOG_PRIORITY = EXTERNAL_CATALOG_PRIORITY + 1;
const ENV_CATALOG_PATHS = ["OPENCLAW_PLUGIN_CATALOG_PATHS", "OPENCLAW_MPM_CATALOG_PATHS"];
const OFFICIAL_CHANNEL_CATALOG_RELATIVE_PATH = path.join("dist", "channel-catalog.json");
function parseCatalogEntries(raw) {
	const list = Array.isArray(raw) ? raw : isRecord(raw) ? raw.entries ?? raw.packages ?? raw.plugins : void 0;
	return Array.isArray(list) ? list.filter((entry) => isRecord(entry)) : [];
}
function resolveExternalCatalogPaths(options) {
	if (options.catalogPaths && options.catalogPaths.length > 0) return normalizeStringEntries(options.catalogPaths);
	const env = options.env ?? process.env;
	for (const key of ENV_CATALOG_PATHS) {
		const raw = env[key];
		if (raw?.trim()) return normalizeStringEntries(raw.split(/[;,]/g).flatMap((chunk) => chunk.split(path.delimiter)));
	}
	const configDir = resolveConfigDir(env);
	return [
		"mpm/plugins.json",
		"mpm/catalog.json",
		"plugins/catalog.json"
	].map((relativePath) => path.join(configDir, relativePath));
}
function loadCatalogEntriesFromPaths(paths) {
	const entries = [];
	for (const resolvedPath of paths) {
		const payload = readPluginCacheJsonFile(resolvedPath);
		if (payload.ok) entries.push(...parseCatalogEntries(payload.value));
	}
	return entries;
}
function resolveOfficialCatalogPaths(options) {
	if (options.officialCatalogPaths && options.officialCatalogPaths.length > 0) return normalizeStringEntries(options.officialCatalogPaths);
	const candidates = uniqueStrings([resolveOpenClawPackageRootSync({ cwd: process.cwd() }), resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url })].filter((entry) => Boolean(entry))).map((packageRoot) => path.join(packageRoot, OFFICIAL_CHANNEL_CATALOG_RELATIVE_PATH));
	if (process.execPath) {
		const execDir = path.dirname(process.execPath);
		candidates.push(path.join(execDir, OFFICIAL_CHANNEL_CATALOG_RELATIVE_PATH));
		candidates.push(path.join(execDir, "channel-catalog.json"));
	}
	return uniqueStrings(candidates);
}
function resolveInstallInfo(params) {
	const clawhubSpec = normalizeOptionalString(params.install?.clawhubSpec);
	let npmSpec = normalizeOptionalString(params.install?.npmSpec) ?? (clawhubSpec ? void 0 : normalizeOptionalString(params.packageName));
	const packageVersion = normalizeOptionalString(params.packageVersion);
	const parsedNpmSpec = npmSpec ? parseRegistryNpmSpec(npmSpec) : null;
	const expectedPackageName = normalizeOptionalString(params.packageName);
	const parsedPackageName = expectedPackageName ? parseRegistryNpmSpec(expectedPackageName) : null;
	if (npmSpec && packageVersion && isPrereleaseSemverVersion(packageVersion) && parsedNpmSpec?.selectorKind === "none" && (!parsedPackageName || parsedNpmSpec.name === parsedPackageName.name)) npmSpec = `${parsedNpmSpec.name}@${packageVersion}`;
	if (!clawhubSpec && !npmSpec) return null;
	let localPath = normalizeOptionalString(params.install?.localPath);
	if (!localPath && params.workspaceDir && params.packageDir) localPath = path.relative(params.workspaceDir, params.packageDir) || void 0;
	const defaultChoice = params.install?.defaultChoice === "local" && localPath ? "local" : npmSpec ? "npm" : "clawhub";
	const install = {
		...localPath ? { localPath } : {},
		defaultChoice,
		...params.install?.minHostVersion ? { minHostVersion: params.install.minHostVersion } : {},
		...params.install?.expectedIntegrity ? { expectedIntegrity: params.install.expectedIntegrity } : {},
		...params.install?.allowInvalidConfigRecovery === true ? { allowInvalidConfigRecovery: true } : {}
	};
	if (clawhubSpec) return {
		clawhubSpec,
		...npmSpec ? { npmSpec } : {},
		...install
	};
	if (!npmSpec) return null;
	return {
		npmSpec,
		...install
	};
}
function buildCatalogEntryFromManifest(params) {
	const channel = params.channel;
	const id = channel?.id?.trim();
	const label = channel?.label?.trim();
	if (!channel || !id || !label) return null;
	const install = resolveInstallInfo(params);
	if (!install) return null;
	const pluginId = normalizeOptionalString(params.pluginId);
	const systemImage = channel.systemImage?.trim();
	return {
		id,
		...pluginId ? { pluginId } : {},
		...params.origin ? { origin: params.origin } : {},
		...params.trustedSourceLinkedOfficialInstall ? { trustedSourceLinkedOfficialInstall: true } : {},
		channel,
		meta: buildManifestChannelMeta({
			id,
			channel,
			label,
			selectionLabel: channel.selectionLabel?.trim() || label,
			docsPath: channel.docsPath?.trim() || `/channels/${id}`,
			docsLabel: normalizeOptionalString(channel.docsLabel),
			blurb: channel.blurb?.trim() || "",
			detailLabel: channel.detailLabel?.trim(),
			...systemImage ? { systemImage } : {},
			arrayFieldMode: "defined"
		}),
		install,
		installSource: describePluginInstallSource(install, { expectedPackageName: params.packageName })
	};
}
function buildExternalCatalogEntry(entry, trustedSourceLinkedOfficialInstall = false) {
	const manifest = entry[MANIFEST_KEY];
	return buildCatalogEntryFromManifest({
		pluginId: manifest?.plugin?.id,
		packageName: entry.name,
		packageVersion: entry.version,
		trustedSourceLinkedOfficialInstall,
		channel: manifest?.channel,
		install: manifest?.install
	});
}
function resolveOfficialCatalogDocsPath(entry, officialEntries, trustedOfficialPackageName) {
	let official;
	if (entry.origin === "bundled" || entry.origin === void 0 && entry.trustedSourceLinkedOfficialInstall) official = entry;
	else if ((entry.origin === "global" || entry.origin === "config") && trustedOfficialPackageName) {
		const packageName = trustedOfficialPackageName;
		official = packageName ? officialEntries.find((candidate) => candidate.id === entry.id && (candidate.pluginId ?? candidate.id) === entry.pluginId && [
			candidate.installSource?.npm?.expectedPackageName,
			candidate.installSource?.npm?.packageName,
			candidate.installSource?.clawhub?.packageName
		].includes(packageName)) : void 0;
	}
	const value = official?.meta.docsPath.trim();
	if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return;
	const origin = "https://docs.openclaw.ai";
	const url = new URL(value, origin);
	return url.origin === origin && !url.pathname.startsWith("//") ? `${url.pathname}${url.search}${url.hash}` : void 0;
}
function buildChannelUiCatalog(plugins) {
	const entries = plugins.map((plugin) => {
		const detailLabel = plugin.meta.detailLabel ?? plugin.meta.selectionLabel ?? plugin.meta.label;
		return {
			id: plugin.id,
			label: plugin.meta.label,
			detailLabel,
			...plugin.meta.systemImage ? { systemImage: plugin.meta.systemImage } : {}
		};
	});
	const order = entries.map((entry) => entry.id);
	const labels = {};
	const detailLabels = {};
	const systemImages = {};
	const byId = {};
	for (const entry of entries) {
		labels[entry.id] = entry.label;
		detailLabels[entry.id] = entry.detailLabel;
		if (entry.systemImage) systemImages[entry.id] = entry.systemImage;
		byId[entry.id] = entry;
	}
	return {
		entries,
		order,
		labels,
		detailLabels,
		systemImages,
		byId
	};
}
/**
* Raw catalog primitive. This may include untrusted workspace entries and
* workspace shadows. Security-sensitive or execution-facing callers should
* prefer `listTrustedChannelPluginCatalogEntries`; use this primitive only when
* the caller immediately applies trust filtering or explicitly excludes
* workspace entries.
*
* @internal
*/
function listRawChannelPluginCatalogEntries(options = {}) {
	const manifestEntries = listChannelCatalogEntries({
		workspaceDir: options.workspaceDir,
		env: options.env,
		extraPaths: options.extraPaths,
		installRecords: options.installRecords,
		discovery: options.discovery
	});
	const officialFileEntries = loadCatalogEntriesFromPaths(resolveOfficialCatalogPaths(options));
	const officialEntries = [...listOfficialExternalChannelCatalogEntries(), ...officialFileEntries].map((entry) => buildExternalCatalogEntry(entry, true)).filter((entry) => entry !== null);
	const resolved = /* @__PURE__ */ new Map();
	const rememberCatalogEntry = (entry, priority, trustedOfficialPackageName) => {
		const existing = resolved.get(entry.id);
		if (!existing || priority < existing.priority) {
			const officialDocsPath = resolveOfficialCatalogDocsPath(entry, officialEntries, trustedOfficialPackageName);
			resolved.set(entry.id, {
				entry: officialDocsPath ? {
					...entry,
					officialDocsPath
				} : entry,
				priority
			});
		}
	};
	for (const candidate of manifestEntries) {
		if (shouldExcludeCatalogEntry(options, candidate.pluginId, candidate.origin)) continue;
		const entry = buildCatalogEntryFromManifest({
			pluginId: candidate.pluginId,
			packageName: candidate.packageName,
			packageDir: candidate.rootDir,
			origin: candidate.origin,
			workspaceDir: candidate.workspaceDir ?? options.workspaceDir,
			channel: candidate.channel,
			install: candidate.install
		});
		if (!entry) continue;
		rememberCatalogEntry(entry, ORIGIN_PRIORITY[candidate.origin] ?? 99, candidate.trustedOfficialInstall ? candidate.packageName : void 0);
	}
	const rememberExternalCatalogEntries = (entries, priority, trustedSourceLinkedOfficialInstall = false) => {
		for (const candidate of entries) {
			const entry = buildExternalCatalogEntry(candidate, trustedSourceLinkedOfficialInstall);
			if (entry) rememberCatalogEntry(entry, priority);
		}
	};
	for (const entry of officialEntries) rememberCatalogEntry(entry, FALLBACK_CATALOG_PRIORITY);
	rememberExternalCatalogEntries(loadCatalogEntriesFromPaths(resolveExternalCatalogPaths(options).map((rawPath) => resolveUserPath(rawPath, options.env ?? process.env))), EXTERNAL_CATALOG_PRIORITY);
	return Array.from(resolved.values()).map(({ entry }) => entry).toSorted((a, b) => {
		const orderA = a.meta.order ?? 999;
		const orderB = b.meta.order ?? 999;
		if (orderA !== orderB) return orderA - orderB;
		return a.meta.label.localeCompare(b.meta.label);
	});
}
function getChannelPluginCatalogEntry(id, options = {}) {
	const trimmed = id.trim();
	if (!trimmed) return;
	return listRawChannelPluginCatalogEntries(options).find((entry) => entry.id === trimmed);
}
//#endregion
export { getChannelPluginCatalogEntry as n, listRawChannelPluginCatalogEntries as r, buildChannelUiCatalog as t };
