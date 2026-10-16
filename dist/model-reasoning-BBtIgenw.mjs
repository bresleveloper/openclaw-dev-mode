//#region extensions/lmstudio/src/model-reasoning.ts
const LMSTUDIO_OPENAI_COMPAT_ENABLED_REASONING_EFFORTS = [
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh"
];
const LMSTUDIO_OPENAI_COMPAT_REASONING_EFFORTS = ["none", ...LMSTUDIO_OPENAI_COMPAT_ENABLED_REASONING_EFFORTS];
function buildLmstudioReasoningEffortMap(supportedReasoningEfforts) {
	const disabled = supportedReasoningEfforts.includes("none") ? "none" : void 0;
	const max = supportedReasoningEfforts.find((option) => option === "xhigh") ?? supportedReasoningEfforts.find((option) => option === "high") ?? supportedReasoningEfforts.find((option) => option !== "none");
	const map = {
		...disabled ? {
			off: disabled,
			none: disabled
		} : {},
		...max ? {
			adaptive: max,
			max
		} : {}
	};
	return Object.keys(map).length > 0 ? map : void 0;
}
function normalizeLmstudioTransportReasoningCompat(compat) {
	const supportedReasoningEfforts = compat.supportedReasoningEfforts;
	const map = compat.reasoningEffortMap;
	const hasBinarySupported = Array.isArray(supportedReasoningEfforts) && supportedReasoningEfforts.some((option) => option === "on");
	const hasBinaryMapValue = map !== void 0 && Object.values(map).some((value) => value === "on" || value === "off");
	if (!hasBinarySupported && !hasBinaryMapValue) return compat;
	const normalizedSupportedReasoningEfforts = supportedReasoningEfforts?.includes("off") === true || supportedReasoningEfforts?.includes("none") === true || Object.values(map ?? {}).some((value) => value === "off" || value === "none") ? [...LMSTUDIO_OPENAI_COMPAT_REASONING_EFFORTS] : [...LMSTUDIO_OPENAI_COMPAT_ENABLED_REASONING_EFFORTS];
	return {
		...compat,
		supportedReasoningEfforts: normalizedSupportedReasoningEfforts,
		reasoningEffortMap: buildLmstudioReasoningEffortMap(normalizedSupportedReasoningEfforts)
	};
}
//#endregion
export { normalizeLmstudioTransportReasoningCompat as i, LMSTUDIO_OPENAI_COMPAT_REASONING_EFFORTS as n, buildLmstudioReasoningEffortMap as r, LMSTUDIO_OPENAI_COMPAT_ENABLED_REASONING_EFFORTS as t };
