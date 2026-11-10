import { n as isDeeplyFrozenPlainData } from "./immutable-data-DqJSDH8t.mjs";
import { a as resolveInstalledManifestRegistryIndexFingerprint } from "./plugin-control-plane-context-Cn4izUMk.mjs";
import { o as fingerprintPreparedRuntimeFacts } from "./prepared-model-runtime.synthetic-auth-DP743ZrF.mjs";
//#region src/agents/prepared-model-catalog-fingerprints.ts
function fingerprintPreparedModelWorkerRequest(input, request) {
	return fingerprintPreparedRuntimeFacts([input.generationFingerprint, request]);
}
function fingerprintPreparedModelCatalogPlugins(snapshot) {
	return fingerprintPreparedRuntimeFacts({
		config: snapshot.configFingerprint ?? null,
		index: resolveInstalledManifestRegistryIndexFingerprint(snapshot.index),
		pluginIds: snapshot.pluginIds ?? null,
		policy: snapshot.policyHash,
		workspaceDir: snapshot.workspaceDir ?? null
	});
}
const immutableGenerationConfigFingerprints = /* @__PURE__ */ new WeakMap();
function fingerprintPreparedModelCatalogConfig(config) {
	const immutable = isDeeplyFrozenPlainData(config);
	const cached = immutable ? immutableGenerationConfigFingerprints.get(config) : void 0;
	if (cached !== void 0) return cached;
	const fingerprint = fingerprintPreparedRuntimeFacts(config);
	if (immutable) immutableGenerationConfigFingerprints.set(config, fingerprint);
	return fingerprint;
}
function fingerprintPreparedModelCatalogGeneration(params) {
	return fingerprintPreparedRuntimeFacts({
		remoteCatalogSource: params.remoteCatalog?.sourceUrl,
		remoteCatalogRevision: params.remoteCatalog?.revision,
		input: {
			...params.input,
			config: fingerprintPreparedModelCatalogConfig(params.input.config)
		},
		sourceConfigForSecrets: fingerprintPreparedModelCatalogConfig(params.sourceConfigForSecrets),
		configResolutionFacts: params.configResolutionFacts,
		sourceConfigResolutionFacts: params.sourceConfigResolutionFacts,
		authStore: params.authStore,
		sharedAuthStoreOwnership: params.sharedAuthStoreOwnership,
		providerIds: params.providerIds,
		catalogFacts: params.catalogFacts,
		preferBuiltPluginArtifacts: params.preferBuiltPluginArtifacts,
		pluginFingerprint: fingerprintPreparedModelCatalogPlugins(params.pluginMetadataSnapshot)
	});
}
/** Registrations follow their loader context; agent credentials remain request-local. */
function fingerprintPreparedModelCatalogPluginContext(value) {
	return fingerprintPreparedRuntimeFacts({
		remoteCatalogSource: value.remoteCatalog?.sourceUrl,
		remoteCatalogRevision: value.remoteCatalog?.revision,
		config: fingerprintPreparedModelCatalogConfig(value.input.config),
		sourceConfigForSecrets: fingerprintPreparedModelCatalogConfig(value.sourceConfigForSecrets),
		configResolutionFacts: value.configResolutionFacts,
		sourceConfigResolutionFacts: value.sourceConfigResolutionFacts,
		env: value.input.env,
		workspaceDir: value.pluginMetadataSnapshot.workspaceDir ?? value.input.workspaceDir,
		allowGatewaySubagentBinding: value.input.allowGatewaySubagentBinding === true,
		preferBuiltPluginArtifacts: value.preferBuiltPluginArtifacts,
		pluginFingerprint: fingerprintPreparedModelCatalogPlugins(value.pluginMetadataSnapshot)
	});
}
//#endregion
export { fingerprintPreparedModelCatalogPluginContext as n, fingerprintPreparedModelWorkerRequest as r, fingerprintPreparedModelCatalogGeneration as t };
