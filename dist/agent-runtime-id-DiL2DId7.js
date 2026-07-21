//#region src/agents/agent-runtime-id.ts
const OPENCLAW_AGENT_RUNTIME_ID = "openclaw";
const AUTO_AGENT_RUNTIME_ID = "auto";
/** Normalizes configured runtime aliases to the current embedded-agent runtime id vocabulary. */
function normalizeEmbeddedAgentRuntime(raw) {
	const value = raw?.trim();
	if (!value) return OPENCLAW_AGENT_RUNTIME_ID;
	if (value === "openclaw" || value === "pi") return OPENCLAW_AGENT_RUNTIME_ID;
	if (value === "auto") return AUTO_AGENT_RUNTIME_ID;
	if (value === "codex-app-server") return "codex";
	return value;
}
/** Normalizes an optional unknown runtime id value, returning undefined when absent/invalid. */
function normalizeOptionalAgentRuntimeId(raw) {
	if (typeof raw !== "string") return;
	const value = raw.trim().toLowerCase();
	return value ? normalizeEmbeddedAgentRuntime(value) : void 0;
}
/**
* @deprecated Whole-agent runtime environment selection is retired. Use
* provider/model runtime policy or a registered agent harness instead.
*/
function resolveEmbeddedAgentRuntime(_env = process.env) {
	return OPENCLAW_AGENT_RUNTIME_ID;
}
/** Returns whether a runtime id should be treated as the default runtime selection. */
function isDefaultAgentRuntimeId(runtime) {
	return runtime === void 0 || runtime === "auto" || runtime === "default";
}
//#endregion
export { normalizeOptionalAgentRuntimeId as a, normalizeEmbeddedAgentRuntime as i, OPENCLAW_AGENT_RUNTIME_ID as n, resolveEmbeddedAgentRuntime as o, isDefaultAgentRuntimeId as r, AUTO_AGENT_RUNTIME_ID as t };
