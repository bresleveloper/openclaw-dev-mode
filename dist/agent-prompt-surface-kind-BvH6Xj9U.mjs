//#region src/plugins/agent-prompt-surface-kind.ts
/** Normalizes legacy prompt surface names to current OpenClaw surface names. */
function normalizeAgentPromptSurfaceKind(surface) {
	return surface === "pi_main" ? "openclaw_main" : surface;
}
/** True when a prompt surface targets the main OpenClaw prompt. */
function isOpenClawMainPromptSurface(surface) {
	return normalizeAgentPromptSurfaceKind(surface) === "openclaw_main";
}
//#endregion
export { normalizeAgentPromptSurfaceKind as n, isOpenClawMainPromptSurface as t };
