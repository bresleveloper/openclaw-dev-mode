import { i as getPluginRegistryForContext } from "./gateway-request-scope-1BXD1G3l.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { n as getPluginInstance } from "./plugin-instance-scope-BoTOTPL4.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DiVSy6jb.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { r as resolvePluginRootPublicSurfacePath } from "./public-surface-runtime-Bz94WyMt.mjs";
import { a as loadFacadeModuleAtLocationSync } from "./facade-loader-CcsJkVh8.mjs";
import "./config-B3oiWDlr.mjs";
//#region src/plugins/runtime/runtime-web-channel-plugin.ts
function readColdPluginRecords() {
	let config;
	try {
		config = readRuntimeConfig();
	} catch {
		config = {};
	}
	return resolvePluginMetadataSnapshot({ config }).plugins;
}
/** Package-root embedding API; runtime instances and cold callers share the public-surface loader. */
async function monitorWebChannel(...args) {
	const registry = getPluginRegistryForContext();
	const matches = (registry ? registry.plugins.filter((record) => record.status === "loaded") : readColdPluginRecords()).flatMap((record) => {
		const pluginRoot = record.rootDir;
		if (!pluginRoot) return [];
		const resolve = (artifactBasename) => resolvePluginRootPublicSurfacePath({
			pluginRoot,
			pluginId: record.id,
			entrySource: record.source,
			artifactBasename
		});
		const modulePath = resolve("runtime-api.js");
		return modulePath && resolve("light-runtime-api.js") ? [{
			record,
			modulePath,
			pluginRoot
		}] : [];
	});
	if (matches.length !== 1) throw new Error(matches.length ? `plugin runtime boundary is ambiguous for entries [light-runtime-api, runtime-api]: ${matches.map(({ record }) => record.id).join(", ")}` : "web channel plugin runtime is unavailable: missing plugin that provides light-runtime-api and runtime-api");
	const { record, modulePath, pluginRoot } = matches[0];
	const owner = registry?.plugins.find((entry) => entry === record);
	const instance = owner ? getPluginInstance(owner) : void 0;
	if (owner && !instance) throw new Error(`Plugin ${owner.id} has no runtime module owner`);
	const loaded = loadFacadeModuleAtLocationSync({
		location: {
			modulePath,
			boundaryRoot: pluginRoot,
			pluginId: record.id
		},
		boundary: {
			boundaryLabel: "plugin root",
			rejectHardlinks: shouldRejectHardlinkedPluginFiles({
				origin: record.origin,
				rootDir: pluginRoot
			})
		}
	});
	return (instance?.wrap(loaded) ?? loaded).monitorWebChannel(...args);
}
//#endregion
export { monitorWebChannel };
