import { n as normalizePluginsConfigWithResolverCore } from "./config-normalization-shared-B7M6gfm-.mjs";
import { r as hasKind } from "./slots-D4OMSTbt.mjs";
import { p as resolveMemorySlotDecision } from "./config-state-BEAL5gWH.mjs";
import { a as resolvePolicyPluginActivationState } from "./manifest-registry-build-BbQTPsvD.mjs";
//#region src/plugins/plugin-root-contributions.ts
/** Select active root contributions while leaving path validation and publication to consumers. */
function* iteratePluginRootContributions(params) {
	const normalizedPlugins = normalizePluginsConfigWithResolverCore(params.config?.plugins, params.metadataSnapshot.normalizePluginId);
	const memorySlot = normalizedPlugins.slots.memory;
	let selectedMemoryPluginId = null;
	for (const record of params.metadataSnapshot.manifestRegistry.plugins) {
		const roots = record[params.contribution];
		if (!roots || roots.length === 0) continue;
		if (!resolvePolicyPluginActivationState({
			id: record.id,
			origin: record.origin,
			channelIds: record.channels,
			config: normalizedPlugins,
			rootConfig: params.config,
			...params.contribution === "skills" ? { enabledByDefault: record.enabledByDefault } : {}
		}).activated || params.isAvailable && !params.isAvailable(record)) continue;
		const memoryDecision = resolveMemorySlotDecision({
			id: record.id,
			kind: record.kind,
			slot: memorySlot,
			selectedId: selectedMemoryPluginId
		});
		if (!memoryDecision.enabled) continue;
		if (memoryDecision.selected && hasKind(record.kind, "memory")) selectedMemoryPluginId = record.id;
		yield {
			record,
			roots
		};
	}
}
//#endregion
export { iteratePluginRootContributions as t };
