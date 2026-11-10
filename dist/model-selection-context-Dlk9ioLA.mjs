import "./defaults-Bg930vxE.mjs";
import { a as resolveContextTokensForModel } from "./context-XynHJtne.mjs";
//#region src/auto-reply/reply/model-selection-context.ts
function resolveContextTokens(params) {
	return resolveContextTokensForModel({
		...params,
		allowAsyncLoad: false
	}) ?? 2e5;
}
//#endregion
export { resolveContextTokens as t };
