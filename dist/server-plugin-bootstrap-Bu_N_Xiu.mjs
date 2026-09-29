import { D as withPluginCache, d as getPluginMetadataSnapshotCache, o as getPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { v as findActiveDegradedPlugin, y as formatPluginVerificationDiagnostic } from "./discovery-D_5mAUI7.mjs";
import { r as resolveDurableWorkerProviderAutoEnabledReasons } from "./worker-provider-manifest-nXb1-dX2.mjs";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-CaqgRIEy.mjs";
import { r as loadGatewayPlugins } from "./server-plugins-BgG3JQQk.mjs";
import { t as mergeActivationSectionsIntoRuntimeConfig } from "./plugin-activation-runtime-config-8zX3nnmq.mjs";
import { performance } from "node:perf_hooks";
//#region src/gateway/server-plugin-bootstrap.ts
function logGatewayPluginDiagnostics(params) {
	for (const diag of params.diagnostics) {
		const degradedPlugin = diag.pluginId ? findActiveDegradedPlugin(diag.pluginId) : void 0;
		if (diag.code === "plugin-verification" && degradedPlugin && diag.message === formatPluginVerificationDiagnostic(degradedPlugin.diagnostic)) continue;
		const details = [diag.pluginId ? `plugin=${diag.pluginId}` : null, diag.source ? `source=${diag.source}` : null].filter((entry) => Boolean(entry)).join(", ");
		const message = details ? `[plugins] ${diag.message} (${details})` : `[plugins] ${diag.message}`;
		if (diag.level === "error") params.log.error(message);
		else params.log.warn(message);
	}
}
/** Prepares gateway plugin runtime and returns the loaded plugin registry state. */
function prepareGatewayPluginLoad(params) {
	return withPluginCache(params.pluginMetadataSnapshot ? getPluginMetadataSnapshotCache(params.pluginMetadataSnapshot) : getPluginCache(), () => {
		const started = performance.now();
		const { logDiagnostics = true, ...loadParams } = params;
		const activationSourceConfig = params.activationSourceConfig ?? params.cfg;
		const autoEnabled = applyPluginAutoEnable({
			config: activationSourceConfig,
			env: params.env ?? process.env,
			...params.pluginLookUpTable?.manifestRegistry ? { manifestRegistry: params.pluginLookUpTable.manifestRegistry } : {},
			discovery: params.pluginLookUpTable?.discovery,
			ambientEnvTriggers: params.ambientEnvTriggers
		});
		const autoEnableMs = performance.now() - started;
		const resolvedConfig = activationSourceConfig === params.cfg ? autoEnabled.config : mergeActivationSectionsIntoRuntimeConfig({
			runtimeConfig: params.cfg,
			activationConfig: autoEnabled.config
		});
		const durableReasons = params.pluginLookUpTable ? resolveDurableWorkerProviderAutoEnabledReasons(params.pluginLookUpTable.manifestRegistry, params.pluginLookUpTable.workerProviderIds) : {};
		const autoEnabledReasons = {
			...autoEnabled.autoEnabledReasons,
			...durableReasons
		};
		params.startupTrace?.detail("plugins.gateway-prepare", [["autoEnableMs", autoEnableMs], ["resolvedConfigMs", performance.now() - started - autoEnableMs]]);
		const loaded = loadGatewayPlugins({
			...loadParams,
			cfg: resolvedConfig,
			activationSourceConfig,
			autoEnabledReasons,
			channelPluginLoadIntent: params.channelPluginLoadIntent ?? "full"
		});
		if (logDiagnostics && loaded.pluginRegistry.diagnostics.length > 0) logGatewayPluginDiagnostics({
			diagnostics: loaded.pluginRegistry.diagnostics,
			log: params.log
		});
		return {
			...loaded,
			resolvedConfig
		};
	});
}
//#endregion
export { prepareGatewayPluginLoad };
