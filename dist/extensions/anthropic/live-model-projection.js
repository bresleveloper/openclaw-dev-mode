import { l as normalizeOptionalString } from "../../string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "../../record-coerce-TIsquoVR.mjs";
import "../../string-coerce-runtime-BbIJhy7G.mjs";
import { g as buildOpenAICompatibleLiveModels } from "../../provider-catalog-live-runtime-BILEsjga.mjs";
//#region extensions/anthropic/live-model-projection.ts
function readSupported(capabilities, path) {
	let current = capabilities;
	for (const key of path) current = asOptionalRecord(current)?.[key];
	if (current === null) return false;
	const supported = asOptionalRecord(current)?.supported;
	return typeof supported === "boolean" ? supported : void 0;
}
function readClaudeListedCapabilities(capabilities) {
	const adaptiveThinking = readSupported(capabilities, [
		"thinking",
		"types",
		"adaptive"
	]);
	const xhighEffort = readSupported(capabilities, ["effort", "xhigh"]);
	const maxEffort = readSupported(capabilities, ["effort", "max"]);
	if (adaptiveThinking === void 0 || xhighEffort === void 0 || maxEffort === void 0) return;
	const disabledThinking = readSupported(capabilities, [
		"thinking",
		"types",
		"disabled"
	]);
	return {
		adaptiveThinking,
		xhighEffort,
		maxEffort,
		...disabledThinking === void 0 ? {} : { disabledThinking }
	};
}
const projectAnthropicLiveModels = (rows, fallback) => {
	const listedCapabilities = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const record = asOptionalRecord(row);
		const id = normalizeOptionalString(record?.id);
		const capabilities = readClaudeListedCapabilities(record?.capabilities);
		if (id && capabilities) listedCapabilities.set(id, capabilities);
	}
	const models = buildOpenAICompatibleLiveModels(rows, fallback, ({ id }) => listedCapabilities.has(id));
	for (const [index, model] of models.entries()) {
		const claudeCapabilities = listedCapabilities.get(model.id);
		if (claudeCapabilities) models[index] = {
			...model,
			thinkingLevelMap: {
				...model.thinkingLevelMap,
				xhigh: claudeCapabilities.xhighEffort ? "xhigh" : null,
				max: claudeCapabilities.maxEffort ? "max" : null
			},
			params: {
				...model.params,
				claudeCapabilities
			}
		};
	}
	return models;
};
//#endregion
export { projectAnthropicLiveModels };
