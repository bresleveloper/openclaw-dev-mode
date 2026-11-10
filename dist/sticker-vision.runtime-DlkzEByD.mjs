import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as findModelInCatalog } from "./model-catalog-lookup-BJKolYfz.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { r as modelSupportsVision } from "./model-catalog-vYmFg90_.mjs";
import { n as loadPreparedModelCatalog } from "./agent-runtime-DkCKSFV_.mjs";
//#region extensions/telegram/src/sticker-vision.runtime.ts
async function resolveStickerVisionSupportRuntime(params) {
	const catalog = await loadPreparedModelCatalog({
		config: params.cfg,
		...params.agentId ? {
			agentId: params.agentId,
			agentDir: resolveAgentDir(params.cfg, params.agentId)
		} : {},
		readOnly: true
	});
	const defaultModel = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId
	});
	const entry = findModelInCatalog(catalog, defaultModel.provider, defaultModel.model);
	return entry ? modelSupportsVision(entry) : false;
}
//#endregion
export { resolveStickerVisionSupportRuntime };
