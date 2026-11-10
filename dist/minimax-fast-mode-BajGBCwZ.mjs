//#region src/llm/providers/minimax-fast-mode.ts
function resolveMinimaxFastModelId(model) {
	return model.api === "anthropic-messages" && (model.provider === "minimax" || model.provider === "minimax-portal") && model.id.trim() === "MiniMax-M2.7" ? "MiniMax-M2.7-highspeed" : void 0;
}
//#endregion
export { resolveMinimaxFastModelId as t };
