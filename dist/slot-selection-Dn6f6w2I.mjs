import { t as applyExclusiveSlotSelection } from "./slots-D4OMSTbt.mjs";
import { o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { r as isBundledManifestOwner } from "./manifest-owner-policy-D9DuiaNx.mjs";
//#region src/plugins/slot-selection.ts
function mergeRuntimeKinds(report, runtimeReport) {
	const runtimeKinds = new Map(runtimeReport.plugins.filter((plugin) => plugin.kind).map((plugin) => [plugin.id, plugin.kind]));
	return { plugins: report.plugins.map((plugin) => {
		if (plugin.kind) return plugin;
		const runtimeKind = runtimeKinds.get(plugin.id);
		return runtimeKind ? {
			...plugin,
			kind: runtimeKind
		} : plugin;
	}) };
}
async function applySlotSelectionForPlugin(config, pluginId, preparedMetadata, beforeRuntimeInspection) {
	const metadataSnapshot = preparedMetadata ?? loadPluginMetadataSnapshot({
		allowCurrent: false,
		config,
		env: process.env
	});
	const plugin = metadataSnapshot.plugins.find((entry) => entry.id === pluginId);
	if (!plugin) return {
		config,
		warnings: []
	};
	const report = { plugins: [plugin] };
	if (!plugin.kind && !isBundledManifestOwner(plugin)) {
		const { withPluginDiagnosticsReport } = await import("./status-DhiigEUV.mjs");
		beforeRuntimeInspection?.();
		return await withPluginDiagnosticsReport({
			config,
			onlyPluginIds: [plugin.id],
			metadataSnapshot,
			loadMode: "validate"
		}, (runtimeReport) => {
			const runtimePlugin = runtimeReport.plugins.find((entry) => entry.id === plugin.id);
			const result = applyExclusiveSlotSelection({
				config,
				selectedId: runtimePlugin?.kind ? runtimePlugin.id : plugin.id,
				selectedKind: runtimePlugin?.kind ?? plugin.kind,
				registry: runtimePlugin?.kind ? mergeRuntimeKinds(report, runtimeReport) : report
			});
			return {
				config: result.config,
				warnings: result.warnings
			};
		});
	}
	const result = applyExclusiveSlotSelection({
		config,
		selectedId: plugin.id,
		selectedKind: plugin.kind,
		registry: report
	});
	return {
		config: result.config,
		warnings: result.warnings
	};
}
//#endregion
export { applySlotSelectionForPlugin as t };
