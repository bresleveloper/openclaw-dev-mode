//#region src/llm/providers/minimax-fast-mode.ts
const MINIMAX_FAST_MODEL_IDS = /* @__PURE__ */ new Map([["MiniMax-M2.7", "MiniMax-M2.7-highspeed"]]);
function resolveMinimaxFastModelId(model) {
	return model.api === "anthropic-messages" && (model.provider === "minimax" || model.provider === "minimax-portal") ? MINIMAX_FAST_MODEL_IDS.get(model.id.trim()) : void 0;
}
//#endregion
export { resolveMinimaxFastModelId as t };
