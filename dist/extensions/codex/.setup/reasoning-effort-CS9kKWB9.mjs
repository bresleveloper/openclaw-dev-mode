import { selectSupportedReasoningEffort } from "openclaw/plugin-sdk/agent-harness-attempt-runtime";
//#region extensions/codex/src/app-server/reasoning-effort.ts
const CODEX_REASONING_EFFORTS = [
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
];
const LEGACY_PRO_REASONING_EFFORTS = [
	"medium",
	"high",
	"xhigh"
];
const LEGACY_PRO_MODEL_ID_RE = /^gpt-5\.[45]-pro$/u;
const MODERN_GPT_5_MODEL_ID_RE = /^gpt-5\.(?:[3-9]|[1-9]\d)(?:$|-)/u;
/** Read reasoning metadata after the Codex app-server route has been selected. */
function readCodexSupportedReasoningEfforts(compat) {
	return compat && "supportedReasoningEfforts" in compat ? compat.supportedReasoningEfforts : void 0;
}
function resolveCodexAppServerReasoningEffort(params) {
	if (params.thinkLevel === "ultra") return "ultra";
	if (params.thinkLevel === "off") return params.supportedReasoningEfforts?.includes("none") ? "none" : null;
	if (params.thinkLevel === "adaptive") return null;
	const modelId = params.modelId.trim().toLowerCase();
	const supportedReasoningEfforts = params.supportedReasoningEfforts ?? (LEGACY_PRO_MODEL_ID_RE.test(modelId) ? LEGACY_PRO_REASONING_EFFORTS : void 0);
	if (supportedReasoningEfforts) return selectSupportedReasoningEffort({
		requested: params.thinkLevel,
		supportedEfforts: supportedReasoningEfforts.map((effort) => effort.trim().toLowerCase()),
		effortOrder: CODEX_REASONING_EFFORTS
	}) ?? null;
	if (params.thinkLevel === "minimal" && MODERN_GPT_5_MODEL_ID_RE.test(modelId)) return "low";
	return params.thinkLevel === "max" ? null : params.thinkLevel;
}
//#endregion
export { resolveCodexAppServerReasoningEffort as n, readCodexSupportedReasoningEfforts as t };
