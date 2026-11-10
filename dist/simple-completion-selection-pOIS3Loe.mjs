import { a as resolveAgentDir, b as resolveNativeModelPrimary } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./defaults-Bg930vxE.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { i as buildModelAliasIndex, y as resolveModelRefFromString } from "./model-selection-shared-CVU_V2PQ.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { a as resolveUtilityModelRefForAgent } from "./utility-model-nsnbR10X.mjs";
//#region src/agents/simple-completion-selection.ts
function resolveSimpleCompletionSelectionRequest(params) {
	const fallbackRef = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId,
		manifestPlugins: params.manifestPlugins
	});
	const modelRef = params.modelRef?.trim() || (params.useUtilityModel ? resolveUtilityModelRefForAgent({
		cfg: params.cfg,
		agentId: params.agentId,
		primaryProvider: fallbackRef.provider,
		...params.manifestPlugins ? { metadataSnapshot: "plugins" in params.manifestPlugins ? params.manifestPlugins : { plugins: params.manifestPlugins } } : {}
	}) : void 0) || (params.useUtilityModel === "required" ? void 0 : resolveNativeModelPrimary(params.cfg, params.agentId));
	const split = modelRef ? splitTrailingAuthProfile(modelRef) : null;
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		agentId: params.agentId,
		defaultProvider: fallbackRef.provider || "openai",
		manifestPlugins: params.manifestPlugins
	});
	const resolved = split ? resolveModelRefFromString({
		cfg: params.cfg,
		agentId: params.agentId,
		raw: split.model,
		defaultProvider: fallbackRef.provider || "openai",
		aliasIndex,
		manifestPlugins: params.manifestPlugins
	}) : null;
	if (params.useUtilityModel === "required" && !resolved) return null;
	const provider = resolved?.ref.provider ?? fallbackRef.provider;
	const modelId = resolved?.ref.model ?? fallbackRef.model;
	if (!provider || !modelId) return null;
	return {
		selection: {
			provider,
			modelId,
			profileId: split?.profile || void 0,
			agentDir: params.agentDir?.trim() || resolveAgentDir(params.cfg, params.agentId)
		},
		...split && !split.model.includes("/") ? { shorthandModelId: split.model } : {}
	};
}
function resolveSimpleCompletionSelectionForAgent(params) {
	return resolveSimpleCompletionSelectionRequest(params)?.selection ?? null;
}
//#endregion
export { resolveSimpleCompletionSelectionRequest as n, resolveSimpleCompletionSelectionForAgent as t };
