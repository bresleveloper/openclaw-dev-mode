import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
//#region packages/model-catalog-core/src/model-catalog-reasoning.ts
const OPENROUTER_REASONING_EFFORTS = [
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
];
/** Preserve OpenRouter's declared effort choices and mandatory-thinking wire contract. */
function normalizeOpenRouterModelReasoning(value) {
	const reasoning = asOptionalRecord(value);
	const rawEfforts = reasoning?.supported_efforts;
	if (!reasoning || typeof reasoning.mandatory !== "boolean" || rawEfforts !== void 0 && rawEfforts !== null && !Array.isArray(rawEfforts)) return;
	const efforts = rawEfforts === void 0 ? void 0 : rawEfforts === null ? OPENROUTER_REASONING_EFFORTS : normalizeTrimmedStringList(rawEfforts);
	const mandatory = reasoning.mandatory;
	const supportedReasoningEfforts = efforts?.length ? [...new Set(mandatory ? efforts.filter((effort) => effort !== "none") : ["none", ...efforts])] : efforts;
	return {
		reasoning: true,
		compat: {
			supportsReasoningEffort: (supportedReasoningEfforts?.length ?? 0) > 0,
			...supportedReasoningEfforts !== void 0 ? { supportedReasoningEfforts } : {}
		},
		...mandatory ? { thinkingLevelMap: { off: null } } : {}
	};
}
//#endregion
export { normalizeOpenRouterModelReasoning as t };
