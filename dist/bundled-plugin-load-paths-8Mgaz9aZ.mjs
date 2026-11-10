import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-gjJ-tD2q.mjs";
import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { o as tryResolveDefaultAgentId } from "./agent-roster-gkYP38su.mjs";
import { d as buildBundledPluginLoadPathAliases, h as parsePackagedBundledPluginPath, m as parseLegacyBundledPluginPath, p as normalizeBundledLookupPath, t as discoverConfiguredPluginLoadPaths } from "./discovery-B5pUUvVG.mjs";
import { n as findUninspectedPluginDiagnostic } from "./discovery-availability-CEoTdFoo.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { a as resolveBundledPluginSources } from "./bundled-sources-CSOJ6Jwe.mjs";
import path from "node:path";
//#region src/commands/doctor/shared/bundled-plugin-load-paths.ts
function isOpenClawNodeModulesPackageRoot(packageRoot) {
	const normalized = normalizeBundledLookupPath(packageRoot);
	const packageDir = path.basename(normalized);
	const parentDir = path.basename(path.dirname(normalized));
	return packageDir === "openclaw" && parentDir === "node_modules";
}
/** Find configured plugin load paths that alias bundled plugins already shipped by OpenClaw. */
function scanBundledPluginLoadPathMigrations(cfg, env = process.env) {
	const plugins = asNullableRecord(cfg.plugins);
	const load = asNullableRecord(plugins?.load);
	const rawPaths = Array.isArray(load?.paths) ? load.paths : [];
	if (rawPaths.length === 0) return [];
	const defaultAgentId = tryResolveDefaultAgentId(cfg);
	const bundled = resolveBundledPluginSources({
		workspaceDir: defaultAgentId ? resolveAgentWorkspaceDir(cfg, defaultAgentId) : void 0,
		env
	});
	if (bundled.size === 0) return [];
	const bundledPathMap = /* @__PURE__ */ new Map();
	const packagedBundledLeafMap = /* @__PURE__ */ new Map();
	for (const source of bundled.values()) {
		const target = {
			pluginId: source.pluginId,
			toPath: source.localPath
		};
		for (const alias of buildBundledPluginLoadPathAliases(source.localPath)) bundledPathMap.set(normalizeBundledLookupPath(alias.path), target);
		const packaged = parsePackagedBundledPluginPath(source.localPath);
		if (packaged) packagedBundledLeafMap.set(normalizeBundledLookupPath(packaged.bundledLeaf), target);
	}
	const { diagnostics } = discoverConfiguredPluginLoadPaths({
		loadPaths: rawPaths.filter((rawPath) => typeof rawPath === "string"),
		env
	});
	const hits = [];
	for (const rawPath of rawPaths) {
		if (typeof rawPath !== "string") continue;
		const normalized = normalizeBundledLookupPath(resolveUserPath(rawPath, env));
		if (findUninspectedPluginDiagnostic(diagnostics.filter((diagnostic) => diagnostic.source !== void 0 && normalizeBundledLookupPath(diagnostic.source) === normalized))) continue;
		let match = bundledPathMap.get(normalized);
		if (!match) {
			const old = parsePackagedBundledPluginPath(normalized) ?? parseLegacyBundledPluginPath(normalized);
			match = old?.packageRoot && old.bundledLeaf && isOpenClawNodeModulesPackageRoot(old.packageRoot) ? packagedBundledLeafMap.get(normalizeBundledLookupPath(old.bundledLeaf)) : void 0;
		}
		if (!match) continue;
		hits.push({
			pluginId: match.pluginId,
			fromPath: rawPath,
			toPath: match.toPath,
			pathLabel: "plugins.load.paths"
		});
	}
	return hits;
}
/** Format user-facing warnings for redundant bundled plugin load path aliases. */
function collectBundledPluginLoadPathWarnings(params) {
	if (params.hits.length === 0) return [];
	const lines = params.hits.map((hit) => `- ${hit.pathLabel}: bundled plugin path "${hit.fromPath}" still aliases ${hit.pluginId}; OpenClaw loads the packaged bundled plugin from "${hit.toPath}".`);
	lines.push(`- Run "${params.doctorFixCommand}" to remove these redundant bundled plugin paths.`);
	return lines.map((line) => sanitizeForLog(line));
}
/** Remove redundant bundled plugin load path aliases while preserving unrelated custom paths. */
function maybeRepairBundledPluginLoadPaths(cfg, env = process.env) {
	const hits = scanBundledPluginLoadPathMigrations(cfg, env);
	if (hits.length === 0) return {
		config: cfg,
		changes: []
	};
	const next = structuredClone(cfg);
	const load = next.plugins?.load;
	if (!Array.isArray(load?.paths)) return {
		config: cfg,
		changes: []
	};
	const removable = new Set(hits.map((hit) => normalizeBundledLookupPath(resolveUserPath(hit.fromPath, env))));
	load.paths = Array.from(load.paths).filter((entry) => typeof entry !== "string" || !removable.has(normalizeBundledLookupPath(resolveUserPath(entry, env))));
	return {
		config: next,
		changes: hits.map((hit) => `- plugins.load.paths: removed bundled ${hit.pluginId} path alias ${hit.fromPath}`)
	};
}
//#endregion
export { maybeRepairBundledPluginLoadPaths as n, scanBundledPluginLoadPathMigrations as r, collectBundledPluginLoadPathWarnings as t };
