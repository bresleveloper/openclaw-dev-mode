import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { i as withConsoleLogsRoutedToStderr } from "./json-output-mode-CjwEBwVY.mjs";
import { t as measureCliCommandStartup } from "./command-startup-timing-D_8pGzNy.mjs";
//#region src/cli/plugin-registry-loader.ts
const pluginRegistryModuleLoader = createLazyImportLoader(() => import("./plugin-registry-Dex3gHdd.mjs"));
const sandboxRegistryModuleLoader = createLazyImportLoader(() => import("./registry-2YB0ANA2.mjs"));
async function readPersistedSandboxBackendIds() {
	const { readRegistry } = await sandboxRegistryModuleLoader.load();
	const registry = await readRegistry();
	return [...new Set(registry.entries.map((entry) => entry.backendId ?? "docker"))].toSorted();
}
/** Load the CLI plugin registry and optionally route activation logs to stderr. */
async function ensureCliPluginRegistryLoaded(params) {
	const persistedSandboxBackendIds = params.scope === "sandbox-management" ? await measureCliCommandStartup("sandbox-registry-read", readPersistedSandboxBackendIds) : void 0;
	const { ensurePluginRegistryLoaded } = await measureCliCommandStartup("plugin-registry-module-import", pluginRegistryModuleLoader.load);
	const load = () => ensurePluginRegistryLoaded({
		scope: params.scope === "sandbox-management" ? "sandbox-backends" : params.scope,
		...params.config ? { config: params.config } : {},
		...params.activationSourceConfig ? { activationSourceConfig: params.activationSourceConfig } : {},
		...persistedSandboxBackendIds ? { persistedSandboxBackendIds } : {}
	});
	await measureCliCommandStartup("plugin-registry-runtime-load", () => params.routeLogsToStderr ? withConsoleLogsRoutedToStderr(load) : load());
}
//#endregion
export { ensureCliPluginRegistryLoaded as t };
