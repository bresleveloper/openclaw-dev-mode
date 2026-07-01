import { S as findModelInCatalog } from "./model-selection-shared-CKMggJal.js";
import { c as resolveDefaultModelForAgent } from "./model-selection-i8V2iTdL.js";
import { i as modelSupportsVision, n as loadModelCatalog } from "./model-catalog-DD_dq4PJ.js";
import "./agent-runtime-Dcp8a_4-.js";
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
