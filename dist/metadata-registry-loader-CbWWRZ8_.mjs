import { d as hasExplicitPluginIdScope } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { t as buildPluginRuntimeLoadOptions } from "./load-context-D-CZ4KSw.mjs";
import { r as loadPluginRegistryHandle } from "./loader-CidXT38G.mjs";
import { t as resolvePluginRuntimeLoadContext } from "./load-context.resolve-XdYxCzko.mjs";
//#region src/plugins/runtime/metadata-registry-loader.ts
/** Loads a non-activated plugin metadata registry snapshot for validation/status callers. */
function loadPluginMetadataRegistrySnapshot(options) {
	const context = options?.runtimeContext ?? resolvePluginRuntimeLoadContext(options);
	return loadPluginRegistryHandle(buildPluginRuntimeLoadOptions(context, {
		...options?.config !== void 0 ? { config: options.config } : {},
		...options?.activationSourceConfig !== void 0 ? { activationSourceConfig: options.activationSourceConfig } : {},
		...options?.workspaceDir !== void 0 ? { workspaceDir: options.workspaceDir } : {},
		...options?.env !== void 0 ? { env: options.env } : {},
		...options?.logger !== void 0 ? { logger: options.logger } : {},
		throwOnLoadError: true,
		cache: false,
		mode: "validate",
		loadModules: options?.loadModules,
		...hasExplicitPluginIdScope(options?.onlyPluginIds) ? { onlyPluginIds: options?.onlyPluginIds } : {},
		...options?.manifestRegistry ? { manifestRegistry: options.manifestRegistry } : {}
	}));
}
//#endregion
export { loadPluginMetadataRegistrySnapshot as t };
