import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { s as redactSensitiveText } from "./redact-BcXJu5HP.mjs";
//#region src/agents/agent-run-terminal-receipt.ts
const AGENT_RUN_ROUTE_CHANGE_MAX_CHARS = 320;
function normalizeAgentRunTerminalReceipt(value) {
	const receipt = value;
	return receipt && typeof receipt.runId === "string" && typeof receipt.sessionId === "string" && typeof receipt.turnId === "string" && receipt.requested && receipt.effective && Array.isArray(receipt.successfulToolNames) ? receipt : void 0;
}
function formatAgentRunModelRef(value) {
	const route = redactSensitiveText(`${value.provider}/${value.model}`, { mode: "tools" }).replace(/\s+/gu, " ").trim();
	return route ? truncateUtf16Safe(route, 128) : void 0;
}
/** Normalizes the producer-owned route fact before lifecycle or prompt use. */
function normalizeAgentRunRouteChange(value) {
	const normalized = typeof value === "string" ? redactSensitiveText(value, { mode: "tools" }).replace(/\s+/gu, " ").trim() : "";
	return normalized ? truncateUtf16Safe(normalized, AGENT_RUN_ROUTE_CHANGE_MAX_CHARS) : void 0;
}
/** Formats the bounded, secret-free route fact owned by a terminal receipt. */
function formatAgentRunRouteChange(receipt, expectedRunId) {
	if (receipt?.runId !== expectedRunId || !receipt.rerouted || receipt.terminalDisposition !== "visible") return;
	const requested = formatAgentRunModelRef(receipt.requested);
	const effective = formatAgentRunModelRef({
		...receipt.effective,
		model: receipt.effective.responseModel || receipt.effective.model
	});
	return requested && effective ? `Model route changed: ${requested} → ${effective}.` : void 0;
}
//#endregion
export { normalizeAgentRunRouteChange as n, normalizeAgentRunTerminalReceipt as r, formatAgentRunRouteChange as t };
