import "./defaults-BbU4k6fu.mjs";
import { a as resolveContextTokensForModel } from "./context-BNGdirIS.mjs";
//#region src/auto-reply/reply/model-selection-context.ts
/** Resolves the context window token count for the selected provider/model. */
function resolveContextTokens(params) {
	return resolveContextTokensForModel({
		cfg: params.cfg,
		provider: params.provider,
		model: params.model,
		modelContextWindow: params.modelContextWindow,
		modelContextTokens: params.modelContextTokens,
		allowAsyncLoad: false
	}) ?? 2e5;
}
//#endregion
export { resolveContextTokens as t };
