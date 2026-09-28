import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as isBundledPluginInsideDevSourceRoot, r as resolveBundledPluginSourceRoot } from "./dev-source-root-b-YTkLfc.mjs";
import { i as getGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-CVuZDJ9_.mjs";
import { n as discoverOpenClawPlugins } from "./discovery-D_5mAUI7.mjs";
import { r as loadPluginManifest } from "./manifest-DHkEL08H.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-CEG7WMVu.mjs";
import path from "node:path";
//#region src/plugins/bundled-sources.ts
/** Use loader precedence, including explicit paths, when deciding which registry installs are dormant. */
function resolveSourceCheckoutBundledPluginIds(params) {
	const env = params.env ?? process.env;
	if (!resolveBundledPluginSourceRoot(env)) return /* @__PURE__ */ new Set();
	const bundled = params.bundledSources ?? resolveBundledPluginSources({ env });
	const sourceIds = new Set([...bundled].filter(([, source]) => isBundledPluginInsideDevSourceRoot({
		rootDir: source.localPath,
		env
	})).map(([pluginId]) => pluginId));
	if (sourceIds.size === 0) return sourceIds;
	return new Set(loadPluginManifestRegistryCore({
		...params,
		env
	}).plugins.filter((plugin) => sourceIds.has(plugin.id) && plugin.origin === "bundled" && isBundledPluginInsideDevSourceRoot({
		rootDir: plugin.rootDir,
		env
	})).map((plugin) => plugin.id));
}
function findBundledPluginSourceInMap(params) {
	const targetValue = params.lookup.value.trim();
	if (!targetValue) return;
	if (params.lookup.kind === "pluginId") return params.bundled.get(targetValue);
	for (const source of params.bundled.values()) if (params.lookup.kind === "npmSpec" && source.npmSpec === targetValue || params.lookup.kind === "localPath" && path.resolve(source.localPath) === path.resolve(targetValue)) return source;
}
function resolveBundledPluginSources(params) {
	const snapshot = params.discovery ? void 0 : getGatewayPluginMetadataSnapshot();
	const sources = snapshot ? (snapshot.bundledManifestRegistry?.plugins ?? []).map((manifest) => ({
		candidate: manifest,
		manifest
	})) : (params.discovery ?? discoverOpenClawPlugins({
		workspaceDir: params.workspaceDir,
		env: params.env
	})).candidates.flatMap((candidate) => {
		if (candidate.origin !== "bundled") return [];
		const loaded = loadPluginManifest(candidate.rootDir, false);
		return loaded.ok ? [{
			candidate,
			manifest: loaded.manifest
		}] : [];
	});
	const bundled = /* @__PURE__ */ new Map();
	for (const { candidate, manifest } of sources) {
		const pluginId = manifest.id;
		if (bundled.has(pluginId)) continue;
		const npmSpec = normalizeOptionalString(candidate.packageManifest?.install?.npmSpec) || normalizeOptionalString(candidate.packageName) || void 0;
		const version = normalizeOptionalString(candidate.packageVersion) || normalizeOptionalString(manifest.version) || void 0;
		bundled.set(pluginId, {
			pluginId,
			localPath: candidate.rootDir,
			npmSpec,
			version,
			...isRecord(manifest.configSchema) ? { configSchema: manifest.configSchema } : {},
			requiresConfig: pluginConfigSchemaHasRequiredFields(manifest.configSchema)
		});
	}
	return bundled;
}
/** Projects bundled sources from the current generation's shared discovery facts. */
function getProcessBundledPluginSources() {
	return resolveBundledPluginSources({});
}
function pluginConfigSchemaHasRequiredFields(schema) {
	if (!isRecord(schema)) return false;
	const required = schema.required;
	return Array.isArray(required) && required.some((entry) => typeof entry === "string");
}
function findBundledPluginSource(params) {
	return findBundledPluginSourceInMap({
		bundled: resolveBundledPluginSources({
			workspaceDir: params.workspaceDir,
			env: params.env
		}),
		lookup: params.lookup
	});
}
function resolveBundledPluginInstallCommandHint(params) {
	const bundledSource = findBundledPluginSource({
		lookup: {
			kind: "pluginId",
			value: params.pluginId
		},
		workspaceDir: params.workspaceDir,
		env: params.env
	});
	if (!bundledSource?.localPath) return null;
	return `openclaw plugins install ${bundledSource.localPath}`;
}
//#endregion
export { resolveBundledPluginSources as a, resolveBundledPluginInstallCommandHint as i, findBundledPluginSourceInMap as n, resolveSourceCheckoutBundledPluginIds as o, getProcessBundledPluginSources as r, findBundledPluginSource as t };
