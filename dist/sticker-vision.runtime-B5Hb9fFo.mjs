import { a as resolveAgentDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { n as findModelInCatalog } from "./model-catalog-lookup-BWpJFHtW.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CsO-mXVD.mjs";
import { r as modelSupportsVision } from "./model-catalog-CwZMTjpw.mjs";
import { n as loadPreparedModelCatalog } from "./agent-runtime-CozKBj9N.mjs";
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
	if (!entry) return false;
	return modelSupportsVision(entry);
}
//#endregion
export { resolveStickerVisionSupportRuntime };
