import { D as withPluginCache, d as getPluginMetadataSnapshotCache, o as getPluginCache } from "./plugin-cache-BABafcXD.mjs";
import { b as formatPluginVerificationDiagnostic, y as findActiveDegradedPlugin } from "./discovery-Dma3bVNk.mjs";
import { r as resolveDurableWorkerProviderAutoEnabledReasons } from "./worker-provider-manifest-muUGU3iQ.mjs";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-A8cOwPsR.mjs";
import { r as loadGatewayPlugins } from "./server-plugins-CjFDRs0p.mjs";
import { t as mergeActivationSectionsIntoRuntimeConfig } from "./plugin-activation-runtime-config-DfnbwqoS.mjs";
import { performance } from "node:perf_hooks";
//#region src/gateway/server-plugin-bootstrap.ts
const loggedInfoByMetadata = /* @__PURE__ */ new WeakMap();
function logGatewayPluginDiagnostics(params) {
	const metadata = getPluginCache().metadata;
	const loggedInfo = loggedInfoByMetadata.get(metadata) ?? /* @__PURE__ */ new Set();
	loggedInfoByMetadata.set(metadata, loggedInfo);
	for (const diag of params.diagnostics) {
		if (diag.level === "info") {
			const key = JSON.stringify([diag.pluginId, diag.message]);
			if (loggedInfo.has(key)) continue;
			loggedInfo.add(key);
		}
		const degradedPlugin = diag.pluginId ? findActiveDegradedPlugin(diag.pluginId) : void 0;
		if (diag.code === "plugin-verification" && degradedPlugin && diag.message === formatPluginVerificationDiagnostic(degradedPlugin.diagnostic)) continue;
		const details = [diag.pluginId ? `plugin=${diag.pluginId}` : null, diag.source ? `source=${diag.source}` : null].filter((entry) => Boolean(entry)).join(", ");
		const message = details ? `[plugins] ${diag.message} (${details})` : `[plugins] ${diag.message}`;
		params.log[diag.level](message);
	}
}
/** Prepares gateway plugin runtime and returns the loaded plugin registry state. */
function prepareGatewayPluginLoad(params) {
	return withPluginCache(params.pluginMetadataSnapshot ? getPluginMetadataSnapshotCache(params.pluginMetadataSnapshot) : getPluginCache(), () => {
		const started = performance.now();
		const { log, logDiagnostics = true, ...loadParams } = params;
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
			log
		});
		return {
			...loaded,
			resolvedConfig
		};
	});
}
//#endregion
export { prepareGatewayPluginLoad };
