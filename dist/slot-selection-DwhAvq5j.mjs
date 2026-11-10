import { S as applyExclusiveSlotSelection } from "./config-state-DkDfCu7E.mjs";
import { o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { r as isBundledManifestOwner } from "./manifest-owner-policy-Dq1F0Dcx.mjs";
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
		const { withPluginDiagnosticsReport } = await import("./status-fs_MANiX.mjs");
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
