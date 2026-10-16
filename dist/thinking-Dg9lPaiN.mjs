//#region extensions/minimax/thinking.ts
const MINIMAX_M31_MODEL_ID = "MiniMax-M3.1-Flash-Preview";
const BUDGET_THINKING_LEVELS = [
	"off",
	"minimal",
	"low",
	"medium",
	"high"
];
const ADAPTIVE_THINKING_LEVELS = ["off", "adaptive"];
const MINIMAX_M31_THINKING_LEVELS = [
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
];
function isMinimaxM31ModelId(modelId) {
	return modelId.trim().toLowerCase() === MINIMAX_M31_MODEL_ID.toLowerCase();
}
function resolveMinimaxThinkingProfile(modelId) {
	if (isMinimaxM31ModelId(modelId)) return {
		levels: MINIMAX_M31_THINKING_LEVELS.map((id) => ({ id })),
		defaultLevel: "max"
	};
	if (/^MiniMax-M3(\b|[-.])/i.test(modelId)) return {
		levels: ADAPTIVE_THINKING_LEVELS.map((id) => ({ id })),
		defaultLevel: "adaptive"
	};
	if (/^MiniMax-M2(?:\b|[-.])/i.test(modelId)) return {
		levels: BUDGET_THINKING_LEVELS.map((id) => ({ id })),
		defaultLevel: "off"
	};
}
//#endregion
export { resolveMinimaxThinkingProfile as i, MINIMAX_M31_THINKING_LEVELS as n, isMinimaxM31ModelId as r, MINIMAX_M31_MODEL_ID as t };
