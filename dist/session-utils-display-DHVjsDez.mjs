import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { w as resolveProjectedAgentRunProgressState } from "./agent-run-registry-DO6Dg2r0.mjs";
import { n as sessionDeliveryChannel, r as sessionDeliveryOrigin } from "./delivery-context.read-CR06zOJ4.mjs";
import { n as buildGroupDisplayTitle, t as buildGroupDisplayName } from "./group-B8HN3m8j.mjs";
import { n as isTerminalSessionStatus } from "./types-ByCc34Vn.mjs";
import { t as classifySessionKind } from "./classify-session-kind-BOSciWMV.mjs";
import { a as isSubagentRunLive, c as getSubagentSessionRuntimeMs, d as resolveSubagentSessionStatus, l as getSubagentSessionStartedAt, o as isSubagentRunQueued } from "./subagent-run-liveness-9vTRtoqd.mjs";
import { n as buildSubagentSessionListReadIndex } from "./subagent-registry-read-C2SIiLpb.mjs";
import { g as resolveSessionGoalDisplayState } from "./sessions-DE4llkPV.mjs";
import { a as parseGroupKey, t as isGroupOrChannelDisplaySession } from "./session-utils-store-DDuAGjCc.mjs";
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
	const hasProjectedRun = (sessionKey, sessionId) => {
		if (!rowContext?.projectedAgentRuns) return false;
		return resolveProjectedAgentRunProgressState({
			sessionKeys: [sessionKey],
			sessionId,
			index: rowContext.projectedAgentRuns
		}) !== void 0;
	};
	const hasActiveSubagentRun = liveSubagentRunActive || subagentRuns.countActiveDescendantRuns(key) > 0 || (subagentRun !== null || entry?.spawnedBy !== void 0) && hasProjectedRun(key, entry?.sessionId) || rowContext?.projectedSubagentActivity?.has(key) === true;
	const fields = {
		status: entry?.status === "interrupted" ? "failed" : entry?.status,
		subagentRunState: void 0,
		hasActiveSubagentRun: subagentRun || hasActiveSubagentRun ? hasActiveSubagentRun : void 0,
		startedAt: entry?.startedAt,
		endedAt: entry?.endedAt,
		runtimeMs: entry?.runtimeMs
	};
	if (subagentRun) {
		const endedAt = subagentRun.execution.endedAt;
		fields.subagentRunState = liveSubagentRunActive ? "active" : typeof endedAt === "number" || isTerminalSessionStatus(fields.status) || typeof fields.endedAt === "number" ? "historical" : "interrupted";
		fields.status = liveSubagentRunActive ? resolveSubagentSessionStatus(subagentRun) : fields.status === "running" ? void 0 : fields.status ?? (typeof endedAt === "number" ? resolveSubagentSessionStatus(subagentRun) : void 0);
		fields.startedAt = (liveSubagentRunActive ? void 0 : fields.startedAt) ?? getSubagentSessionStartedAt(subagentRun);
		fields.endedAt = liveSubagentRunActive ? endedAt : fields.endedAt ?? endedAt;
		fields.runtimeMs = liveSubagentRunActive ? getSubagentSessionRuntimeMs(subagentRun, now) : fields.runtimeMs ?? (typeof endedAt === "number" ? getSubagentSessionRuntimeMs(subagentRun, now) : void 0);
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
