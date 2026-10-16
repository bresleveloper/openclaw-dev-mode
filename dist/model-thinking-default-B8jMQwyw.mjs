import { o as resolveAgentEntry } from "./agent-scope-config-CDYpzA0r.mjs";
import { r as buildConfiguredModelCatalog } from "./model-selection-shared-BZeDVoch.mjs";
import { c as normalizeThinkLevel } from "./thinking.shared-Jy32Vp-O.mjs";
import { i as resolveModelExtraParamSources } from "./model-extra-params-C1g6s41K.mjs";
import { f as resolveThinkingSelectionForModel, u as resolveThinkingDefaultForModel } from "./thinking-DK1cFezU.mjs";
//#region src/agents/model-thinking-default-core.ts
function resolveConfiguredThinkingDefaultCore(params) {
	const agentThinking = params.agentId ? resolveAgentEntry(params.cfg, params.agentId)?.thinkingDefault : void 0;
	if (agentThinking) return agentThinking;
	const { modelParams, agentModelParams } = resolveModelExtraParamSources({
		config: params.cfg,
		provider: params.provider,
		modelId: params.model,
		agentId: params.agentId
	});
	const perModelThinking = agentModelParams?.thinking ?? modelParams?.thinking;
	if (perModelThinking === false || perModelThinking === "disabled") return "off";
	return (typeof perModelThinking === "string" ? normalizeThinkLevel(perModelThinking) : void 0) ?? params.cfg.agents?.defaults?.thinkingDefault;
}
function resolveThinkingDefaultCore(params) {
	const configured = resolveConfiguredThinkingDefaultCore(params);
	if (configured) return configured;
	return resolveThinkingDefaultForModel({
		...params,
		catalog: params.catalog ?? buildConfiguredModelCatalog({ cfg: params.cfg })
	});
}
/** Resolves configured intent and its execution level for the caller-selected runtime. */
function resolveThinkingSelectionCore(params) {
	return resolveThinkingSelectionForModel({
		...params,
		level: params.level ?? resolveConfiguredThinkingDefaultCore(params),
		catalog: params.catalog ?? buildConfiguredModelCatalog({ cfg: params.cfg })
	});
}
//#endregion
//#region src/agents/model-thinking-default.ts
/** Resolves thinking default after loading runtime catalog only when needed. */
async function resolveThinkingDefaultWithRuntimeCatalogCore(params) {
	const configuredCatalog = buildConfiguredModelCatalog({ cfg: params.cfg });
	const runtimeCatalog = configuredCatalog.find((entry) => entry.provider === params.provider && entry.id === params.model)?.reasoning === void 0 ? await params.loadRuntimeCatalog() : void 0;
	const catalog = runtimeCatalog?.find((entry) => entry.provider === params.provider && entry.id === params.model) || configuredCatalog.length === 0 ? runtimeCatalog ?? configuredCatalog : configuredCatalog;
	return resolveThinkingDefaultCore({
		cfg: params.cfg,
		agentId: params.agentId,
		provider: params.provider,
		model: params.model,
		catalog,
		agentRuntime: params.agentRuntime
	});
}
//#endregion
export { resolveThinkingSelectionCore as i, resolveConfiguredThinkingDefaultCore as n, resolveThinkingDefaultCore as r, resolveThinkingDefaultWithRuntimeCatalogCore as t };
