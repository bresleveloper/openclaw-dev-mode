import { i as classifyOpenAIBaseUrl } from "./base-url-Baro1bPi.mjs";
import { r as OPENAI_DAYBREAK_MODEL_IDS } from "./model-route-contract-Fecaqw2C.mjs";
//#region extensions/openai/service-tier-policy.ts
/** Alias capabilities are independent of the snapshot behind each Daybreak name. */
function resolveOpenAIModelServiceTiers(params) {
	if (params.api !== "openai-responses" || classifyOpenAIBaseUrl(params.baseUrl) !== "platform") return;
	const [blue, red] = OPENAI_DAYBREAK_MODEL_IDS;
	return params.modelId === blue ? ["default", "priority"] : params.modelId === red ? ["default"] : void 0;
}
//#endregion
export { resolveOpenAIModelServiceTiers as t };
