import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import "./agent-scope-DXrnO3F4.mjs";
//#region src/infra/heartbeat-wake-policy.ts
function inferHeartbeatWakeSourceFromReason(reason) {
	const trimmed = (reason ?? "").trim();
	if (trimmed === "exec-event") return "exec-event";
	if (trimmed.startsWith("cron:")) return "cron";
	if (trimmed === "wake" || trimmed.startsWith("hook:")) return "hook";
	if (trimmed.startsWith("acp:spawn:")) return "acp-spawn";
	if (trimmed.startsWith("session-state:")) return "session-state";
}
function resolveHeartbeatWakePayloadFlags(params) {
	const source = params.source ?? inferHeartbeatWakeSourceFromReason(params.reason);
	const reason = (params.reason ?? "").trim();
	return {
		isExecEventWake: source === "exec-event",
		isCronWake: source === "cron",
		isWakePayload: source === "hook" || source === "acp-spawn" || source === "session-state" || source === "background-task" || source === "background-task-blocked" || reason === "wake"
	};
}
function isTargetedUnscheduledWake(params) {
	const hasSessionTarget = normalizeOptionalString(params.sessionKey) !== void 0;
	if (!hasSessionTarget && normalizeOptionalString(params.agentId) === void 0) return false;
	const reason = params.reason?.trim();
	switch (params.source) {
		case "cron": return params.intent === "immediate" && (reason?.startsWith("cron:") ?? false);
		case "notifications-event": return hasSessionTarget && (params.intent === "immediate" && reason === "wake" || params.intent === "event" && reason === "notifications-event");
		case "manual":
		case "restart-sentinel": return params.intent === "immediate" && hasSessionTarget && reason === "wake";
		case "hook": return params.intent === "immediate" && (reason?.startsWith("hook:") ?? false);
		case "exec-event": return params.intent === "event" && reason === "exec-event";
		case "background-task":
		case "background-task-blocked": return params.intent === "immediate";
		default: return false;
	}
}
function isConfiguredHeartbeatAgent(cfg, agentId) {
	const normalized = normalizeAgentId(agentId);
	return listAgentIds(cfg).some((candidate) => normalizeAgentId(candidate) === normalized);
}
//#endregion
export { resolveHeartbeatWakePayloadFlags as i, isConfiguredHeartbeatAgent as n, isTargetedUnscheduledWake as r, inferHeartbeatWakeSourceFromReason as t };
