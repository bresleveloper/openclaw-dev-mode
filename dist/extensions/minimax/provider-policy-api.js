import { t as resolveMinimaxFastModelId } from "../../minimax-fast-mode-ChePImzI.mjs";
import "../../provider-model-metadata-fSBArSt7.mjs";
import { i as resolveMinimaxThinkingProfile } from "../../thinking-Dg9lPaiN.mjs";
//#region extensions/minimax/provider-policy-api.ts
function resolveFastModeSupport(ctx) {
	if (!ctx.api || ctx.runtimeId !== "openclaw") return;
	return resolveMinimaxFastModelId({
		id: ctx.modelId,
		provider: ctx.provider,
		api: ctx.api
	}) !== void 0;
}
function resolveThinkingProfile(context) {
	return resolveMinimaxThinkingProfile(context.modelId);
}
//#endregion
export { resolveFastModeSupport, resolveThinkingProfile };
