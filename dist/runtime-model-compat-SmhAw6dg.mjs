import { c as resolveXaiIdReasoningEfforts, s as normalizeXaiReasoningEfforts, t as XAI_REASONING_EFFORTS } from "./model-id-BJIzSd6n.mjs";
import { r as applyXaiModelCompat } from "./model-compat-DevhBa4m.mjs";
import { n as supportsXaiPromptCacheKey } from "./provider-routing-fMOUs-vi.mjs";
//#region extensions/xai/runtime-model-compat.ts
const XAI_UNSUPPORTED_REASONING_EFFORTS = {
	off: void 0,
	minimal: null,
	low: null,
	medium: null,
	high: null,
	xhigh: null
};
function readListedReasoningEfforts(compat) {
	const listed = compat && typeof compat === "object" && "supportedReasoningEfforts" in compat ? compat.supportedReasoningEfforts : void 0;
	const efforts = Array.isArray(listed) ? normalizeXaiReasoningEfforts(listed) : [];
	return efforts.length > 0 ? efforts : void 0;
}
function buildReasoningEffortMap(efforts) {
	const active = efforts.filter((effort) => effort !== "none");
	const nearest = (level) => {
		const distance = (effort) => Math.abs(XAI_REASONING_EFFORTS.indexOf(effort) - XAI_REASONING_EFFORTS.indexOf(level));
		return active.reduce((best, effort) => distance(effort) < distance(best) ? effort : best);
	};
	return {
		off: efforts.includes("none") ? "none" : null,
		minimal: nearest("minimal"),
		low: nearest("low"),
		medium: nearest("medium"),
		high: nearest("high"),
		xhigh: nearest("xhigh")
	};
}
function applyXaiRuntimeModelCompat(model) {
	const withCompat = applyXaiModelCompat(model);
	const id = typeof withCompat.id === "string" ? withCompat.id.trim().toLowerCase() : "";
	const efforts = withCompat.reasoning === true ? readListedReasoningEfforts(withCompat.compat) ?? resolveXaiIdReasoningEfforts(id) : [];
	const supportsReasoningEffort = efforts.some((effort) => effort !== "none");
	const existingCompat = withCompat.compat && typeof withCompat.compat === "object" ? { ...withCompat.compat } : {};
	if (supportsXaiPromptCacheKey(withCompat)) {
		existingCompat.supportsPromptCacheKey ??= true;
		existingCompat.supportsLongCacheRetention ??= false;
	}
	return {
		...withCompat,
		compat: {
			...existingCompat,
			supportsReasoningEffort,
			...supportsReasoningEffort ? { supportedReasoningEfforts: efforts } : {}
		},
		thinkingLevelMap: {
			...withCompat.thinkingLevelMap,
			...supportsReasoningEffort ? buildReasoningEffortMap(efforts) : XAI_UNSUPPORTED_REASONING_EFFORTS
		}
	};
}
//#endregion
export { applyXaiRuntimeModelCompat as t };
