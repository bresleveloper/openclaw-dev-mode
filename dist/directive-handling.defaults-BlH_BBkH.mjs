import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DkhWcws3.mjs";
import { i as buildModelAliasIndex } from "./model-selection-shared-DKlQ1p0S.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CsO-mXVD.mjs";
import "./model-selection-D3_rVb38.mjs";
//#region src/auto-reply/reply/directive-handling.defaults.ts
/** Resolve default provider/model plus alias index for directive parsing. */
function resolveDefaultModel(params) {
	const manifestPlugins = getCurrentPluginMetadataSnapshot({
		config: params.cfg,
		allowWorkspaceScopedSnapshot: true
	});
	const mainModel = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId,
		manifestPlugins
	});
	const defaultProvider = mainModel.provider;
	return {
		defaultProvider,
		defaultModel: mainModel.model,
		aliasIndex: buildModelAliasIndex({
			cfg: params.cfg,
			defaultProvider,
			agentId: params.agentId,
			manifestPlugins
		})
	};
}
//#endregion
export { resolveDefaultModel as t };
