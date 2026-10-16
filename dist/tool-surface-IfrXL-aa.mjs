//#region src/agents/harness/tool-surface.ts
/** Whether a plugin harness constructs OpenClaw tools inside its runtime. */
function agentHarnessBuildsOpenClawTools(harnessId) {
	return harnessId === "codex" || harnessId === "copilot";
}
/** Whether the selected harness exposes OpenClaw's agent-tool surface. */
function agentHarnessExposesOpenClawTools(harnessId) {
	return harnessId === "openclaw" || agentHarnessBuildsOpenClawTools(harnessId);
}
//#endregion
export { agentHarnessExposesOpenClawTools as n, agentHarnessBuildsOpenClawTools as t };
