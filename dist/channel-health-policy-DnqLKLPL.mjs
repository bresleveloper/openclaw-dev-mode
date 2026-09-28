import { g as isFutureDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
//#region src/gateway/channel-health-policy.ts
/** Keep channel-authored terminal detail above the shared unhealthy projection. */
function resolveChannelHealthState(snapshot, policy) {
	const evaluation = evaluateChannelHealth(snapshot, policy);
	return !evaluation.healthy && !(snapshot.lifecycle === "blocked" && snapshot.healthState) ? evaluation.reason : snapshot.healthState;
}
function isManagedAccount(snapshot) {
	return snapshot.enabled !== false && snapshot.configured !== false && snapshot.linked !== false;
}
function resolveObservedChannelTimestamp(value, now) {
	return typeof value === "number" && Number.isFinite(value) && !isFutureDateTimestampMs(value, { nowMs: now }) ? value : null;
}
const BUSY_ACTIVITY_STALE_THRESHOLD_MS = 15e5;
const CHANNEL_RECONNECT_GRACE_MS = 12e4;
const DEFAULT_CHANNEL_STALE_EVENT_THRESHOLD_MS = 18e5;
const DEFAULT_CHANNEL_CONNECT_GRACE_MS = 12e4;
function evaluateChannelHealth(snapshot, policy) {
	if (!isManagedAccount(snapshot)) return {
		healthy: true,
		reason: "unmanaged"
	};
	if (!snapshot.running && snapshot.terminalDisconnect) return {
		healthy: false,
		reason: "terminal-disconnect"
	};
	if (snapshot.ingressUnavailable === true) return {
		healthy: false,
		reason: "ingress-unavailable"
	};
	if (snapshot.lifecycle === "blocked") return {
		healthy: false,
		reason: "blocked"
	};
	const lastStartAt = typeof snapshot.lastStartAt === "number" && Number.isFinite(snapshot.lastStartAt) ? snapshot.lastStartAt : null;
	const currentLifecycleStarted = lastStartAt !== null && !isFutureDateTimestampMs(lastStartAt, { nowMs: policy.now });
	if ((snapshot.lifecycle === "starting" || snapshot.lifecycle === "recovering") && currentLifecycleStarted && policy.now - lastStartAt < policy.channelConnectGraceMs) return {
		healthy: true,
		reason: "startup-connect-grace"
	};
	if (snapshot.lifecycle === "stopped") return {
		healthy: false,
		reason: "not-running"
	};
	if (!snapshot.running) return {
		healthy: false,
		reason: "not-running"
	};
	const activeRuns = typeof snapshot.activeRuns === "number" && Number.isFinite(snapshot.activeRuns) ? Math.max(0, Math.trunc(snapshot.activeRuns)) : 0;
	const isBusy = snapshot.busy === true || activeRuns > 0;
	const lastRunActivityAt = resolveObservedChannelTimestamp(snapshot.lastRunActivityAt, policy.now);
	const activeRunStartedAt = resolveObservedChannelTimestamp(snapshot.activeRunStartedAt, policy.now);
	const lastTransportActivityAt = resolveObservedChannelTimestamp(snapshot.lastTransportActivityAt, policy.now);
	const busyStateInitializedForLifecycle = lastStartAt == null || lastRunActivityAt != null && lastRunActivityAt >= lastStartAt;
	if (isBusy) {
		if (!busyStateInitializedForLifecycle) {} else {
			const runActivityAge = lastRunActivityAt == null ? Number.POSITIVE_INFINITY : Math.max(0, policy.now - lastRunActivityAt);
			const disconnectedRunStartAge = snapshot.connected === false && activeRunStartedAt != null ? Math.max(0, policy.now - activeRunStartedAt) : 0;
			if (Math.max(runActivityAge, disconnectedRunStartAge) < BUSY_ACTIVITY_STALE_THRESHOLD_MS) return {
				healthy: true,
				reason: "busy"
			};
			return {
				healthy: false,
				reason: "stuck"
			};
		}
	}
	if (snapshot.lifecycle === void 0 && currentLifecycleStarted) {
		if (policy.now - lastStartAt < policy.channelConnectGraceMs) return {
			healthy: true,
			reason: "startup-connect-grace"
		};
	}
	if (snapshot.connected === false) {
		const lastDisconnectAt = snapshot.lastDisconnect && typeof snapshot.lastDisconnect !== "string" ? resolveObservedChannelTimestamp(snapshot.lastDisconnect.at, policy.now) : null;
		if (lastDisconnectAt != null && (lastStartAt == null || lastDisconnectAt >= lastStartAt) && Math.max(0, policy.now - lastDisconnectAt) < CHANNEL_RECONNECT_GRACE_MS) return {
			healthy: true,
			reason: "reconnect-grace"
		};
		return {
			healthy: false,
			reason: "disconnected"
		};
	}
	if (snapshot.connected === true && lastTransportActivityAt != null) {
		if (lastStartAt != null && lastTransportActivityAt < lastStartAt) {
			if (currentLifecycleStarted && policy.now - lastStartAt <= policy.staleEventThresholdMs) return {
				healthy: true,
				reason: "healthy"
			};
			return {
				healthy: false,
				reason: "stale-socket"
			};
		}
		if (policy.now - lastTransportActivityAt > policy.staleEventThresholdMs) return {
			healthy: false,
			reason: "stale-socket"
		};
	}
	return {
		healthy: true,
		reason: "healthy"
	};
}
function resolveChannelRestartReason(snapshot, evaluation) {
	if (evaluation.reason === "stale-socket") return "stale-socket";
	if (evaluation.reason === "ingress-unavailable") return "ingress-unavailable";
	if (evaluation.reason === "not-running") return snapshot.reconnectAttempts && snapshot.reconnectAttempts >= 10 ? "gave-up" : "stopped";
	if (evaluation.reason === "disconnected") return "disconnected";
	return "stuck";
}
//#endregion
export { resolveChannelRestartReason as a, resolveChannelHealthState as i, DEFAULT_CHANNEL_STALE_EVENT_THRESHOLD_MS as n, evaluateChannelHealth as r, DEFAULT_CHANNEL_CONNECT_GRACE_MS as t };
