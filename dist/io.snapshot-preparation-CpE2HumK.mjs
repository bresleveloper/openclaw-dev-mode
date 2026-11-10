import { f as materializeRuntimeConfig, m as hasAnthropicDefaultSignal } from "./validation-core-ezn1vWYO.mjs";
import { r as resolveDirectBundledProviderPolicySurface } from "./provider-policy-surface-C3sokUgf.mjs";
import { a as validateConfigObjectWithPluginsAsync, o as validateConfigObjectWithStrictFactsAsync } from "./validation-gzn6Bd6i.mjs";
//#region src/config/io.snapshot-preparation.ts
/** Preserve the ordinary reader's lazy defaults, including an unused manifest loader. */
function materializeConfigSnapshotDefaults(context, config, metadata) {
	return materializeRuntimeConfig(config, {
		...context.pathResolution,
		...context.options.pluginValidation === "core-only" ? { manifestRegistry: { plugins: [] } } : { loadManifestRegistry: () => metadata.load(config).manifestRegistry }
	});
}
async function materializeConfigSnapshotDefaultsAsync(context, config, metadata) {
	if (context.options.pluginValidation !== "core-only" && (config.models?.providers || hasAnthropicDefaultSignal(config, context.deps.env) && !resolveDirectBundledProviderPolicySurface("anthropic"))) await metadata.loadAsync(config);
	return materializeConfigSnapshotDefaults(context, config, metadata);
}
async function prepareHostConfigSnapshot(request) {
	if (request.kind === "metadata") return await request.metadata.loadAsync(request.config);
	const { context, metadata } = request;
	if (request.kind === "materialize") return materializeConfigSnapshotDefaultsAsync(context, request.config, metadata);
	return prepareConfigSnapshotValidation(request);
}
/** Runtime validation consumes canonical config; Doctor supplies its own pending facts. */
async function prepareConfigSnapshotValidation(request) {
	const { context, metadata } = request;
	const pending = context.options.deferredPluginMigrations;
	return {
		deferredPluginMigrations: pending,
		validated: await (request.prepareValidation === "strict" ? validateConfigObjectWithStrictFactsAsync : validateConfigObjectWithPluginsAsync)(request.raw, {
			...context.pathResolution,
			pluginValidation: context.options.pluginValidation,
			loadPluginMetadataSnapshotAsync: metadata.loadAsync,
			sourceRaw: request.sourceRaw,
			preservedLegacyRootKeys: context.options.preservedLegacyRootKeys,
			deferredPluginMigrations: pending
		})
	};
}
//#endregion
export { prepareHostConfigSnapshot as i, materializeConfigSnapshotDefaultsAsync as n, prepareConfigSnapshotValidation as r, materializeConfigSnapshotDefaults as t };
