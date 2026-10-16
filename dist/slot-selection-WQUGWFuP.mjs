import { t as applyExclusiveSlotSelection } from "./slots-DarSawuQ.mjs";
import { o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-6weqkLDz.mjs";
import { r as isBundledManifestOwner } from "./manifest-owner-policy-B2H7kBCF.mjs";
//#region src/plugins/slot-selection.ts
async function applySlotSelectionForPlugin(config, pluginId, preparedMetadata, beforeRuntimeInspection) {
	const metadataSnapshot = preparedMetadata ?? loadPluginMetadataSnapshot({
		allowCurrent: false,
		config,
		env: process.env
	});
	const plugin = metadataSnapshot.plugins.find((entry) => entry.id === pluginId);
	if (!plugin) return config;
	if (!plugin.kind && !isBundledManifestOwner(plugin)) {
		const { withPluginDiagnosticsReport } = await import("./status-Cu30gdYD.mjs");
		beforeRuntimeInspection?.();
		return await withPluginDiagnosticsReport({
			config,
			onlyPluginIds: [plugin.id],
			metadataSnapshot,
			loadMode: "validate"
		}, (runtimeReport) => {
			const runtimePlugin = runtimeReport.plugins.find((entry) => entry.id === plugin.id);
			return applyExclusiveSlotSelection({
				config,
				selectedId: plugin.id,
				selectedKind: runtimePlugin?.kind ?? plugin.kind
			});
		});
	}
	return applyExclusiveSlotSelection({
		config,
		selectedId: plugin.id,
		selectedKind: plugin.kind
	});
}
//#endregion
export { applySlotSelectionForPlugin as t };
