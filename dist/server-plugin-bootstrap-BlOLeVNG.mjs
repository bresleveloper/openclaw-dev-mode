import { c as getPluginCache, k as withPluginCache, p as getPluginMetadataSnapshotCache } from "./plugin-cache-BbahpD-b.mjs";
import { h as formatPluginVerificationDiagnostic, m as findActiveDegradedPlugin } from "./discovery-availability-CEoTdFoo.mjs";
import { r as resolveDurableWorkerProviderAutoEnabledReasons } from "./worker-provider-manifest-muUGU3iQ.mjs";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-DYmyl_xH.mjs";
import { t as mergeActivationSectionsIntoRuntimeConfig } from "./plugin-activation-runtime-config-DNccnd-0.mjs";
import { r as loadGatewayPlugins } from "./server-plugins-DAV5qcWd.mjs";
import { performance } from "node:perf_hooks";
//#region src/gateway/server-plugin-bootstrap.ts
const loggedInfoByMetadata = /* @__PURE__ */ new WeakMap();
async function prepareGatewayPluginLoad(params) {
	return withPluginCache(params.pluginMetadataSnapshot ? getPluginMetadataSnapshotCache(params.pluginMetadataSnapshot) : getPluginCache(), async () => {
		const started = performance.now();
		const { log, ...loadParams } = params;
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
		const loaded = await loadGatewayPlugins({
			...loadParams,
			cfg: resolvedConfig,
			activationSourceConfig,
			autoEnabledReasons,
			channelPluginLoadIntent: params.channelPluginLoadIntent ?? "full"
		});
		if (loaded.pluginRegistry.diagnostics.length > 0) {
			const metadata = getPluginCache().metadata;
			const loggedInfo = loggedInfoByMetadata.get(metadata) ?? /* @__PURE__ */ new Set();
			loggedInfoByMetadata.set(metadata, loggedInfo);
			for (const diag of loaded.pluginRegistry.diagnostics) {
				if (diag.level === "info") {
					const key = JSON.stringify([diag.pluginId, diag.message]);
					if (loggedInfo.has(key)) continue;
					loggedInfo.add(key);
				}
				const degradedPlugin = diag.pluginId ? findActiveDegradedPlugin(diag.pluginId) : void 0;
				if (diag.code === "plugin-verification" && degradedPlugin && diag.message === formatPluginVerificationDiagnostic(degradedPlugin.diagnostic)) continue;
				const details = [diag.pluginId ? `plugin=${diag.pluginId}` : null, diag.source ? `source=${diag.source}` : null].filter((entry) => Boolean(entry)).join(", ");
				const message = details ? `[plugins] ${diag.message} (${details})` : `[plugins] ${diag.message}`;
				log[diag.level](message);
			}
		}
		return {
			...loaded,
			resolvedConfig
		};
	});
}
//#endregion
export { prepareGatewayPluginLoad };
