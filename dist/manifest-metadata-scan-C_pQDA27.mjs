import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-CBoxhfke.mjs";
import { n as resolveHomeRelativePath } from "./home-dir-Dc6nN6HB.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { i as getGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-CfLPTM0e.mjs";
import { d as readPluginCacheDirectory, f as readPluginCacheFile, l as pluginCacheRealpathSync, o as parsePluginCacheJson, s as pluginCacheExistsSync, u as pluginCacheStatSync } from "./package-manifest-CEbdS_C4.mjs";
import { a as isSourceCheckoutRoot, s as resolveBundledPluginsDir } from "./bundled-dir-DkyLPnyV.mjs";
import { a as resolveDefaultPluginExtensionsDir } from "./install-paths-R7__5hE9.mjs";
import { r as readPersistedInstalledPluginIndexSync } from "./installed-plugin-index-store-Dcdr8x8f.mjs";
import path from "node:path";
//#region src/plugins/manifest-metadata-scan.ts
const PLUGIN_MANIFEST_METADATA_MAX_BYTES = 262144;
const log = createSubsystemLogger("plugins/manifest-metadata-scan");
const PLUGIN_MANIFEST_FILENAME = "openclaw.plugin.json";
function listChildPluginDirs(root, rank, startOrder, origin) {
	if (!root || !pluginCacheExistsSync(root)) return [];
	const dirs = [];
	let order = startOrder;
	try {
		const entries = readPluginCacheDirectory(root).toSorted((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0);
		for (const entry of entries) if (entry.isDirectory()) dirs.push({
			pluginDir: path.join(root, entry.name),
			rank,
			order: order++,
			origin
		});
	} catch {
		return [];
	}
	return dirs;
}
function readManifestObject(pluginDir) {
	const filePath = path.join(pluginDir, PLUGIN_MANIFEST_FILENAME);
	const file = readPluginCacheFile({
		rootDir: path.dirname(filePath),
		relativePath: path.basename(filePath),
		rejectHardlinks: false,
		maxBytes: PLUGIN_MANIFEST_METADATA_MAX_BYTES
	});
	const warn = (message) => {
		if (!file.metadataScanWarningEmitted) {
			file.metadataScanWarningEmitted = true;
			log.warn(message);
		}
	};
	if (!file.ok) {
		if (file.failure.reason === "path") return;
		if ((pluginCacheStatSync(filePath)?.size ?? 0) > PLUGIN_MANIFEST_METADATA_MAX_BYTES) warn(`Ignoring oversized plugin manifest at ${filePath}: file exceeds the ${PLUGIN_MANIFEST_METADATA_MAX_BYTES}-byte limit`);
		else warn(`Ignoring unreadable plugin manifest at ${filePath}: ${formatErrorMessage(file.failure.error ?? file.failure.reason)}`);
		return;
	}
	const result = parsePluginCacheJson(file, { json5: true });
	if (!result.ok) {
		warn(`Ignoring invalid plugin manifest at ${filePath}: failed to parse plugin manifest: ${formatErrorMessage(result.error)}`);
		return;
	}
	const parsed = result.value;
	if (!isRecord(parsed)) {
		warn(`Ignoring invalid plugin manifest at ${filePath}: plugin manifest must be an object`);
		return;
	}
	return parsed;
}
function listPersistedIndexPluginDirs(env, startOrder) {
	const index = readPersistedInstalledPluginIndexSync({ env });
	if (!index) return [];
	const dirs = [];
	let order = startOrder;
	for (const plugin of index.plugins) {
		const rootDir = normalizeOptionalString(plugin.rootDir);
		if (!rootDir) continue;
		dirs.push({
			pluginDir: resolveHomeRelativePath(rootDir, { env }),
			rank: plugin.origin === "bundled" ? 3 : 1,
			order: order++,
			origin: normalizeOptionalString(plugin.origin)
		});
	}
	return dirs;
}
function resolvePackageRootsForSourceManifestMetadata() {
	const roots = [];
	for (const params of [{ argv1: process.argv[1] }, { moduleUrl: import.meta.url }]) {
		const root = resolveOpenClawPackageRootSync(params);
		if (root && !roots.includes(root)) roots.push(root);
	}
	return roots;
}
function listSourceCheckoutPluginDirs(startOrder) {
	const dirs = [];
	let order = startOrder;
	for (const packageRoot of resolvePackageRootsForSourceManifestMetadata()) {
		if (!isSourceCheckoutRoot(packageRoot)) continue;
		dirs.push(...listChildPluginDirs(path.join(packageRoot, "extensions"), 3, order, "source"));
		order = startOrder + dirs.length;
	}
	return dirs;
}
function uniqueCandidateDirs(candidates) {
	const byPath = /* @__PURE__ */ new Map();
	for (const candidate of candidates) {
		const key = pluginCacheRealpathSync(candidate.pluginDir) ?? path.resolve(candidate.pluginDir);
		const existing = byPath.get(key);
		if (!existing || candidate.rank < existing.rank || candidate.order < existing.order) byPath.set(key, candidate);
	}
	return [...byPath.values()].toSorted((left, right) => left.rank - right.rank || left.order - right.order);
}
/** Lists plugin manifest metadata from installed, bundled, and global plugin roots. */
function listOpenClawPluginManifestMetadata(env = process.env) {
	const snapshot = getGatewayPluginMetadataSnapshot();
	if (snapshot) return [...snapshot.plugins, ...(snapshot.bundledManifestRegistry?.plugins ?? []).filter((plugin) => !snapshot.byPluginId.has(plugin.id))].flatMap((plugin) => {
		const manifest = readManifestObject(plugin.rootDir);
		return manifest ? [{
			pluginDir: plugin.rootDir,
			manifest,
			origin: plugin.origin
		}] : [];
	});
	const candidates = [];
	let order = 0;
	candidates.push(...listPersistedIndexPluginDirs(env, order));
	order = candidates.length;
	candidates.push(...listChildPluginDirs(resolveBundledPluginsDir(env), 2, order, "bundled"));
	order = candidates.length;
	candidates.push(...listSourceCheckoutPluginDirs(order));
	order = candidates.length;
	candidates.push(...listChildPluginDirs(resolveDefaultPluginExtensionsDir(env), 4, order, "global"));
	const uniqueCandidates = uniqueCandidateDirs(candidates);
	const seenManifestIds = /* @__PURE__ */ new Set();
	const records = [];
	for (const candidate of uniqueCandidates) {
		const manifest = readManifestObject(candidate.pluginDir);
		if (!manifest) continue;
		const manifestId = normalizeOptionalString(manifest.id);
		if (manifestId) {
			if (seenManifestIds.has(manifestId)) continue;
			seenManifestIds.add(manifestId);
		}
		records.push({
			pluginDir: candidate.pluginDir,
			manifest,
			origin: candidate.origin
		});
	}
	return records;
}
//#endregion
export { listOpenClawPluginManifestMetadata as t };
