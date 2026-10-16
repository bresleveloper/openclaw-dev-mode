import { f as materializeRuntimeConfig, m as hasAnthropicDefaultSignal } from "./validation-core-DxMw-ato.mjs";
import { a as validateConfigObjectWithStrictFactsAsync, i as validateConfigObjectWithPluginsAsync } from "./validation-R7HXbC_L.mjs";
//#region src/config/io.snapshot-preparation.ts
/** Preserve the ordinary reader's lazy defaults, including an unused manifest loader. */
function materializeConfigSnapshotDefaults(context, config, metadata) {
	return materializeRuntimeConfig(config, {
		...context.pathResolution,
		...context.options.pluginValidation === "core-only" ? { manifestRegistry: { plugins: [] } } : { loadManifestRegistry: () => metadata.load(config).manifestRegistry }
	});
}
async function prepareHostConfigSnapshot(request) {
	if (request.kind === "metadata") return await request.metadata.loadAsync(request.config);
	const { context, metadata } = request;
	if (request.kind === "materialize") {
		if (context.options.pluginValidation !== "core-only" && (request.config.models?.providers || hasAnthropicDefaultSignal(request.config, context.deps.env))) await metadata.loadAsync(request.config);
		return materializeConfigSnapshotDefaults(context, request.config, metadata);
	}
	return prepareConfigSnapshotValidation(request);
}
/** Both explicit CLI validation and an admitted host read prepare database facts before validation. */
async function prepareConfigSnapshotValidation(request) {
	const { context, metadata } = request;
	const pending = await context.resolveDeferredPluginMigrationsAsync();
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
export { prepareConfigSnapshotValidation as n, prepareHostConfigSnapshot as r, materializeConfigSnapshotDefaults as t };
