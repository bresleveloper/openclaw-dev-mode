import { S as findModelInCatalog } from "./model-selection-shared-DwnYeyqq.js";
import { c as resolveDefaultModelForAgent } from "./model-selection-CFL1kjzt.js";
import { i as modelSupportsVision, n as loadModelCatalog } from "./model-catalog-CJwDdG-7.js";
import "./agent-runtime-CjR-oxBM.js";
//#region extensions/telegram/src/sticker-vision.runtime.ts
async function resolveStickerVisionSupportRuntime(params) {
	const catalog = await loadModelCatalog({ config: params.cfg });
	const defaultModel = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId
	});
	const entry = findModelInCatalog(catalog, defaultModel.provider, defaultModel.model);
	if (!entry) return false;
	return modelSupportsVision(entry);
}
//#endregion
export { resolveStickerVisionSupportRuntime };
