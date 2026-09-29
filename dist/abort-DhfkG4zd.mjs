import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { a as stripMentions, o as stripStructuralPrefixes } from "./mentions-BKW6zinj.mjs";
import { n as isAbortRequestText } from "./abort-primitives-BbtQkqTs.mjs";
//#region src/auto-reply/reply/abort.ts
function formatAbortReplyText(stoppedSubagents, rejectionReason, failedSubagents) {
	const failureSuffix = typeof failedSubagents === "number" && failedSubagents > 0 ? ` Cancellation was incomplete for ${failedSubagents} sub-agent${failedSubagents === 1 ? "" : "s"}. Retry /stop.` : "";
	if (rejectionReason === "finalizing") {
		const base = "Agent reply is already finalizing and can no longer be aborted.";
		if (typeof stoppedSubagents !== "number" || stoppedSubagents <= 0) return `${base}${failureSuffix}`;
		return `${base} Stopped ${stoppedSubagents} ${stoppedSubagents === 1 ? "sub-agent" : "sub-agents"}.${failureSuffix}`;
	}
	if (typeof stoppedSubagents !== "number" || stoppedSubagents <= 0) return `⚙️ Agent was aborted.${failureSuffix}`;
	return `⚙️ Agent was aborted. Stopped ${stoppedSubagents} ${stoppedSubagents === 1 ? "sub-agent" : "sub-agents"}.${failureSuffix}`;
}
/** Normalize ingress once; current authorization belongs to the loaded operation. */
function resolveFastAbortRequest(params) {
	const { ctx, cfg } = params;
	const commandSessionKey = normalizeOptionalString(ctx.SessionKey) ?? normalizeOptionalString(ctx.ParentSessionKey);
	const targetKey = normalizeOptionalString(ctx.CommandTargetSessionKey) ?? commandSessionKey;
	const resolveTargetAgentId = () => resolveSessionAgentId({
		sessionKey: targetKey ?? ctx.SessionKey ?? "",
		config: cfg,
		fallbackAgentId: ctx.AgentId
	});
	const raw = stripStructuralPrefixes(ctx.commandText);
	const stripped = normalizeOptionalLowercaseString(ctx.ChatType) === "group" ? stripMentions(raw, ctx, cfg, resolveTargetAgentId()) : raw;
	if (!isAbortRequestText(stripped)) return;
	return {
		commandSessionKey,
		targetKey,
		resolveTargetAgentId
	};
}
async function tryFastAbortFromMessage(params) {
	const request = resolveFastAbortRequest(params);
	if (!request) return {
		handled: false,
		aborted: false
	};
	const { executeFastAbortRequest } = await import("./abort-operation-BImtCorc.mjs");
	return executeFastAbortRequest(params, request);
}
//#endregion
export { tryFastAbortFromMessage as n, formatAbortReplyText as t };
