import { n as loggingState } from "./state-UxwJeH7V.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as measureCliCommandStartup } from "./command-startup-timing-CoumbNZT.mjs";
//#region src/cli/plugin-registry-loader.ts
const pluginRegistryModuleLoader = createLazyImportLoader(() => import("./plugin-registry-Cd6w8B9x.mjs"));
const sandboxRegistryModuleLoader = createLazyImportLoader(() => import("./registry-ueNyI9j_.mjs"));
function loadPluginRegistryModule() {
	return pluginRegistryModuleLoader.load();
}
async function readPersistedSandboxBackendIds() {
	const { readRegistry } = await sandboxRegistryModuleLoader.load();
	const registry = await readRegistry();
	return [...new Set(registry.entries.map((entry) => entry.backendId ?? "docker"))].toSorted();
}
/** Load the CLI plugin registry and optionally route activation logs to stderr. */
async function ensureCliPluginRegistryLoaded(params) {
	const persistedSandboxBackendIds = params.scope === "sandbox-management" ? await measureCliCommandStartup("sandbox-registry-read", readPersistedSandboxBackendIds) : void 0;
	const { ensurePluginRegistryLoaded } = await measureCliCommandStartup("plugin-registry-module-import", loadPluginRegistryModule);
	await measureCliCommandStartup("plugin-registry-runtime-load", () => {
		const previousForceStderr = loggingState.forceConsoleToStderr;
		if (params.routeLogsToStderr) loggingState.forceConsoleToStderr = true;
		try {
			ensurePluginRegistryLoaded({
				scope: params.scope === "sandbox-management" ? "sandbox-backends" : params.scope,
				...params.config ? { config: params.config } : {},
				...params.activationSourceConfig ? { activationSourceConfig: params.activationSourceConfig } : {},
				...persistedSandboxBackendIds ? { persistedSandboxBackendIds } : {}
			});
		} finally {
			loggingState.forceConsoleToStderr = previousForceStderr;
		}
	});
}
//#endregion
export { ensureCliPluginRegistryLoaded as t };
