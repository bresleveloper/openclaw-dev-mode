import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { D as resolveProjectedAgentRunProgressState } from "./agent-run-registry-gmaPgO-n.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { Et as buildGroupDisplayTitle, Tt as buildGroupDisplayName } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { t as classifySessionKind } from "./classify-session-kind-BBHw4D98.mjs";
import { n as sessionDeliveryChannel, r as sessionDeliveryOrigin } from "./delivery-context.read-CR06zOJ4.mjs";
import { n as isTerminalSessionStatus } from "./types-BGDhC4_W.mjs";
import { l as resolveSessionGoalDisplayState } from "./sessions-CnzPI1yx.mjs";
import { a as isSubagentRunLive, f as resolveSubagentSessionStatus, l as getSubagentSessionRuntimeMs, o as isSubagentRunQueued, u as getSubagentSessionStartedAt } from "./subagent-run-liveness-DPrFEcUI.mjs";
import { n as buildSubagentSessionListReadIndex } from "./subagent-registry-read-DY0g8fGW.mjs";
import { a as parseGroupKey, t as isGroupOrChannelDisplaySession } from "./session-utils-store-lW7Wu3P0.mjs";
//#region src/gateway/session-utils-display.ts
function resolveGatewaySessionDisplayName(key, entry) {
	const explicitLabel = normalizeOptionalString(entry?.label);
	if (explicitLabel !== void 0) return explicitLabel;
	const parsed = parseGroupKey(key);
	const isGroupSession = isGroupOrChannelDisplaySession(entry, parsed);
	const groupTitle = isGroupSession ? buildGroupDisplayTitle(entry ?? {}) : void 0;
	if (groupTitle !== void 0) return groupTitle;
	const channel = sessionDeliveryChannel(entry) ?? parsed?.channel;
	const id = parsed?.id;
	const compactGroupFallback = isGroupSession && channel ? buildGroupDisplayName({
		provider: channel,
		subject: entry?.subject,
		topicName: entry?.topicName,
		groupChannel: entry?.groupChannel,
		space: entry?.space,
		id,
		key
	}) : void 0;
	const displayName = (channel === "imessage" && isGroupSession && entry?.displayName === compactGroupFallback ? void 0 : entry?.displayName) ?? entry?.autoLabel ?? (channel === "imessage" ? void 0 : compactGroupFallback);
	if (displayName !== void 0) return displayName;
	if (parseAgentSessionKey(key)?.rest.startsWith("dashboard:")) return;
	const origin = sessionDeliveryOrigin(entry);
	const originLabel = origin?.label;
	const normalizedOriginFrom = normalizeOptionalString(origin?.from);
	const routeIdentityTail = normalizedOriginFrom?.split(":").at(-1);
	const routeIdentityTailIsOpaque = routeIdentityTail != null && (routeIdentityTail.includes("@") || /^[+]?[\d\s().-]+$/.test(routeIdentityTail));
	const originIsRouteIdentity = originLabel != null && (originLabel === normalizedOriginFrom || routeIdentityTailIsOpaque && originLabel === routeIdentityTail);
	const originIsGenericGroupFallback = channel === "imessage" && isGroupSession && id != null && originLabel?.toLowerCase() === `group id:${id.toLowerCase()}`;
	return originIsRouteIdentity || originIsGenericGroupFallback ? void 0 : originLabel;
}
function resolveGatewaySessionKind(key, entry) {
	const sessionKind = classifySessionKind(key, entry);
	return sessionKind === "cron" || sessionKind === "spawn-child" ? "direct" : sessionKind;
}
function projectGatewaySessionRunState(params) {
	const { key, entry, now, rowContext } = params;
	const subagentRuns = rowContext?.subagentRuns ?? buildSubagentSessionListReadIndex(now);
	const subagentRun = subagentRuns.getDisplaySubagentRun(key);
	const subagentOwner = normalizeOptionalString(subagentRun?.controllerSessionKey) || normalizeOptionalString(subagentRun?.requesterSessionKey);
	const liveSubagentRunActive = isSubagentRunLive(subagentRun) || isSubagentRunQueued(subagentRun);
	const hasActiveSubagentRun = liveSubagentRunActive || subagentRuns.countActiveDescendantRuns(key) > 0 || (subagentRun !== null || entry?.spawnedBy !== void 0) && rowContext?.projectedAgentRuns !== void 0 && resolveProjectedAgentRunProgressState({
		sessionKeys: [key],
		sessionId: entry?.sessionId,
		agentId: (params.parsedKey === void 0 ? parseAgentSessionKey(key) : params.parsedKey)?.agentId ?? "",
		index: rowContext.projectedAgentRuns
	}) !== void 0 || rowContext?.projectedSubagentActivity?.has(key) === true;
	const fields = {
		status: entry?.status,
		lastRunError: entry?.lastRunError,
		subagentRunState: void 0,
		hasActiveSubagentRun: subagentRun || hasActiveSubagentRun ? hasActiveSubagentRun : void 0,
		startedAt: entry?.startedAt,
		endedAt: entry?.endedAt,
		runtimeMs: entry?.runtimeMs
	};
	if (subagentRun) {
		const endedAt = subagentRun.execution.endedAt;
		const subagentStatus = resolveSubagentSessionStatus(subagentRun);
		fields.subagentRunState = liveSubagentRunActive ? "active" : typeof endedAt === "number" || isTerminalSessionStatus(fields.status) || typeof fields.endedAt === "number" ? "historical" : "interrupted";
		fields.status = liveSubagentRunActive ? subagentStatus : fields.status ?? (typeof endedAt === "number" ? subagentStatus : void 0);
		const ownsInterruptedSession = entry?.lifecycleRunId === subagentRun.runId || entry?.lifecycleRunId === void 0 && entry?.lastRunId === subagentRun.runId || subagentRun.taskRunId !== void 0 && entry?.subagentRecovery?.lastRunId === subagentRun.runId && entry.lifecycleRunId === (entry.subagentRecovery.sessionLifecycleRunId ?? subagentRun.taskRunId);
		if (fields.status === "interrupted" && subagentStatus === "failed" && subagentRun.execution.interruptionReason === "gateway-restart" && ownsInterruptedSession) {
			fields.status = "failed";
			fields.lastRunError ??= "Restart recovery could not reach the parent. Inspect the child session before continuing.";
		}
		const fallbackEndedAt = typeof fields.startedAt === "number" && typeof endedAt === "number" && fields.startedAt > endedAt ? void 0 : endedAt;
		fields.startedAt = (liveSubagentRunActive ? void 0 : fields.startedAt) ?? getSubagentSessionStartedAt(subagentRun);
		fields.endedAt = liveSubagentRunActive ? endedAt : fields.endedAt ?? fallbackEndedAt;
		fields.runtimeMs = liveSubagentRunActive ? getSubagentSessionRuntimeMs(subagentRun, now) : fields.runtimeMs ?? (typeof fallbackEndedAt === "number" ? getSubagentSessionRuntimeMs(subagentRun, now) : void 0);
	}
	return {
		subagentRun,
		subagentOwner,
		fields
	};
}
function resolveGatewaySessionGoal(entry, now, usage = entry) {
	return entry?.goal ? resolveSessionGoalDisplayState({
		...usage,
		goal: entry.goal
	}, now, { adoptFreshBaseline: false }) : void 0;
}
function projectGatewaySessionActiveRun(active, status) {
	return {
		hasActiveRun: active?.active,
		status: active?.active ? active.status ?? "running" : status
	};
}
//#endregion
export { resolveGatewaySessionKind as a, resolveGatewaySessionGoal as i, projectGatewaySessionRunState as n, resolveGatewaySessionDisplayName as r, projectGatewaySessionActiveRun as t };
