import { n as MODEL_DATA_THINKING_FORMATS, t as MODEL_DATA_APIS } from "./model-data-C50f9nhB.mjs";
import { t as isStringOption } from "./string-readers-Dkx3Z36w.mjs";
//#region src/config/model-config-vocabulary.ts
/** Provider API adapter ids accepted by model/provider config and schema generation. */
const MODEL_APIS = [...MODEL_DATA_APIS];
/** Thinking/reasoning payload dialects emitted by OpenAI-compatible providers. */
const MODEL_THINKING_FORMATS = [...MODEL_DATA_THINKING_FORMATS];
/** Runtime guard for config-provided thinking format strings. */
function isModelThinkingFormat(value) {
	return isStringOption(value, MODEL_THINKING_FORMATS);
}
//#endregion
export { MODEL_THINKING_FORMATS as n, isModelThinkingFormat as r, MODEL_APIS as t };
