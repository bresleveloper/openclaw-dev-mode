import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./llm--QylqK5V.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { i as streamSimple } from "./stream-4ZQq1Iyd.mjs";
import { t as streamWithPayloadPatch } from "./stream-payload-utils-BoUixBWV.mjs";
import "./provider-stream-shared-D8q3R1a-.mjs";
import { n as buildProviderStreamFamilyHooks } from "./provider-stream-CPGCn_Ra.mjs";
import "./provider-stream-family-B6dW08sH.mjs";
import { n as MINIMAX_M31_THINKING_LEVELS, r as isMinimaxM31ModelId, t as MINIMAX_M31_MODEL_ID } from "./thinking-Dg9lPaiN.mjs";
import { l as buildMinimaxApiModelDefinition } from "./model-definitions-W8p7t5_2.mjs";
//#region extensions/minimax/stream.ts
const FAST_MODE_HOOKS = buildProviderStreamFamilyHooks("minimax-fast-mode");
const M31_MAX_TOKENS = buildMinimaxApiModelDefinition(MINIMAX_M31_MODEL_ID).maxTokens;
function wrapMinimaxProviderStream(ctx) {
	const underlying = FAST_MODE_HOOKS.wrapStreamFn?.(ctx) ?? ctx.streamFn ?? streamSimple;
	return (model, context, options) => {
		if ((ctx.sourceApi ?? model.api) !== "anthropic-messages" || !isMinimaxM31ModelId(model.id)) return underlying(model, context, options);
		const thinkingLevel = options?.reasoning ?? ctx.thinkingLevel;
		const effort = MINIMAX_M31_THINKING_LEVELS.find((level) => level === thinkingLevel) ?? "max";
		const modelMaxTokens = model.maxTokens ?? M31_MAX_TOKENS;
		const resolvedModel = model.maxTokens === void 0 || modelMaxTokens < M31_MAX_TOKENS ? {
			...model,
			maxTokens: M31_MAX_TOKENS
		} : model;
		return streamWithPayloadPatch(underlying, resolvedModel, context, {
			...options,
			reasoning: effort,
			thinkingBudgets: void 0
		}, (payload) => {
			payload.thinking = { type: "adaptive" };
			payload.output_config = {
				...isRecord(payload.output_config) ? payload.output_config : {},
				effort
			};
			const maxTokens = options?.maxTokens ?? payload.max_tokens;
			if (typeof maxTokens === "number" && Number.isFinite(maxTokens) && maxTokens > 0) payload.max_tokens = Math.min(Math.floor(maxTokens), modelMaxTokens);
		});
	};
}
//#endregion
export { wrapMinimaxProviderStream as t };
