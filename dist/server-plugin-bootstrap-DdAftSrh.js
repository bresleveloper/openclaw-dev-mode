import { t as applyPluginAutoEnable } from "./plugin-auto-enable-BC_okI1q.js";
import { g as pinActivePluginSessionExtensionRegistry, m as pinActivePluginChannelRegistry } from "./runtime-wIYJz8NY.js";
import { c as setPluginSubagentOverridePolicies, n as createGatewaySubagentRuntime, o as loadGatewayPlugins, t as createGatewayNodesRuntime } from "./server-plugins-C69qrB_N.js";
import { t as primeConfiguredBindingRegistry } from "./binding-registry-BwSK0N_x.js";
import { i as setGatewaySubagentRuntime, r as setGatewayNodesRuntime } from "./gateway-bindings-6VdB9O0r.js";
import { t as mergeActivationSectionsIntoRuntimeConfig } from "./plugin-activation-runtime-config-BIODP9ox.js";
//#region src/gateway/server-plugin-bootstrap.ts
function installGatewayPluginRuntimeEnvironment(cfg) {
	setPluginSubagentOverridePolicies(cfg);
	setGatewaySubagentRuntime(createGatewaySubagentRuntime());
	setGatewayNodesRuntime(createGatewayNodesRuntime());
}
function pinGatewayPluginRuntimeRegistries(pluginRegistry) {
	pinActivePluginChannelRegistry(pluginRegistry);
	pinActivePluginSessionExtensionRegistry(pluginRegistry);
}
function logGatewayPluginDiagnostics(params) {
	for (const diag of params.diagnostics) {
		const details = [diag.pluginId ? `plugin=${diag.pluginId}` : null, diag.source ? `source=${diag.source}` : null].filter((entry) => Boolean(entry)).join(", ");
		const message = details ? `[plugins] ${diag.message} (${details})` : `[plugins] ${diag.message}`;
		if (diag.level === "error") params.log.error(message);
		else params.log.info(message);
	}
}
/** Prepares gateway plugin runtime and returns the loaded plugin registry state. */
function prepareGatewayPluginLoad(params) {
	const activationSourceConfig = params.activationSourceConfig ?? params.cfg;
	const autoEnabled = applyPluginAutoEnable({
		config: activationSourceConfig,
		env: process.env,
		...params.pluginLookUpTable?.manifestRegistry ? { manifestRegistry: params.pluginLookUpTable.manifestRegistry } : {},
		discovery: params.pluginLookUpTable?.discovery
	});
	const resolvedConfig = activationSourceConfig === params.cfg ? autoEnabled.config : mergeActivationSectionsIntoRuntimeConfig({
		runtimeConfig: params.cfg,
		activationConfig: autoEnabled.config
	});
	installGatewayPluginRuntimeEnvironment(resolvedConfig);
	const loaded = loadGatewayPlugins({
		cfg: resolvedConfig,
		activationSourceConfig,
		autoEnabledReasons: autoEnabled.autoEnabledReasons,
		workspaceDir: params.workspaceDir,
		log: params.log,
		...params.coreGatewayHandlers !== void 0 && { coreGatewayHandlers: params.coreGatewayHandlers },
		...params.coreGatewayMethodNames !== void 0 && { coreGatewayMethodNames: params.coreGatewayMethodNames },
		...params.hostServices !== void 0 && { hostServices: params.hostServices },
		baseMethods: params.baseMethods,
		pluginIds: params.pluginIds,
		pluginLookUpTable: params.pluginLookUpTable,
		preferSetupRuntimeForChannelPlugins: params.preferSetupRuntimeForChannelPlugins,
		suppressPluginInfoLogs: params.suppressPluginInfoLogs,
		startupTrace: params.startupTrace
	});
	params.beforePrimeRegistry?.(loaded.pluginRegistry);
	primeConfiguredBindingRegistry({ cfg: resolvedConfig });
	if ((params.logDiagnostics ?? true) && loaded.pluginRegistry.diagnostics.length > 0) logGatewayPluginDiagnostics({
		diagnostics: loaded.pluginRegistry.diagnostics,
		log: params.log
	});
	return loaded;
}
/** Loads and pins gateway plugins during normal gateway startup. */
function loadGatewayStartupPlugins(params) {
	return prepareGatewayPluginLoad({
		...params,
		beforePrimeRegistry: pinGatewayPluginRuntimeRegistries
	});
}
/** Reloads deferred gateway plugins while preserving startup bootstrap behavior. */
function reloadDeferredGatewayPlugins(params) {
	return prepareGatewayPluginLoad({
		...params,
		beforePrimeRegistry: pinGatewayPluginRuntimeRegistries
	});
}
//#endregion
export { loadGatewayStartupPlugins, prepareGatewayPluginLoad, reloadDeferredGatewayPlugins };
