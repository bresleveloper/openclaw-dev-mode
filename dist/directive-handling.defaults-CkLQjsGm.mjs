import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { i as buildModelAliasIndex } from "./model-selection-shared-CVU_V2PQ.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import "./model-selection-DdQ-ffuG.mjs";
//#region src/auto-reply/reply/directive-handling.defaults.ts
/** Resolve default provider/model plus alias index for directive parsing. */
function resolveDefaultModel(params) {
	const manifestPlugins = getCurrentPluginMetadataSnapshot({
		config: params.cfg,
		allowWorkspaceScopedSnapshot: true
	});
	const modelContext = {
		cfg: params.cfg,
		agentId: params.agentId,
		manifestPlugins
	};
	const { provider: defaultProvider, model: defaultModel } = resolveDefaultModelForAgent(modelContext);
	return {
		defaultProvider,
		defaultModel,
		aliasIndex: buildModelAliasIndex({
			...modelContext,
			defaultProvider
		})
	};
}
//#endregion
export { resolveDefaultModel as t };
