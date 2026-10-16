import { i as extractErrorCode } from "./error-coercion-CvJK4lmH.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { r as isPluginTrustRefusalError } from "./plugin-trust-DPp6imOi.mjs";
import { n as isChannelIngressUnavailableError } from "./ingress-unavailable-Cbpzcexa.mjs";
//#region src/gateway/channel-status-patches.ts
/** Creates a connected-channel status patch with matching connection/event timestamps. */
function createConnectedChannelStatusPatch(at = Date.now()) {
	return {
		connected: true,
		lastConnectedAt: at,
		lastEventAt: at
	};
}
/** Creates a transport-activity patch for health/activity monitors. */
function createTransportActivityStatusPatch(at = Date.now()) {
	return { lastTransportActivityAt: at };
}
function channelReadyPatch(extras = {}) {
	return {
		running: true,
		connected: true,
		lifecycle: "ready",
		lastConnectedAt: Date.now(),
		lastError: null,
		terminalDisconnect: void 0,
		...extras
	};
}
function channelBlockedPatch(lastError, extras = {}) {
	return {
		lifecycle: "blocked",
		terminalDisconnect: true,
		lastError,
		...extras
	};
}
/** Classifies startup failures before transport cleanup or retry policy can hide their cause. */
function channelStartFailurePatch(error) {
	const lastError = formatErrorMessage(error);
	const trustRefused = isPluginTrustRefusalError(error);
	return {
		lastError,
		...extractErrorCode(error) === "AGENT_SELECTION_REQUIRED" || trustRefused ? channelBlockedPatch(lastError, trustRefused ? { healthState: "plugin-trust-refused" } : {}) : {},
		...isChannelIngressUnavailableError(error) ? { ingressUnavailable: true } : {}
	};
}
function channelStoppedPatch(extras = {}) {
	return {
		running: false,
		connected: false,
		lifecycle: "stopped",
		...extras
	};
}
function sanitizeAbortedTaskStatusPatch(patch, current) {
	const next = { ...patch };
	delete next.running;
	delete next.restartPending;
	delete next.reconnectAttempts;
	delete next.lastStartAt;
	delete next.lastStopAt;
	delete next.lifecycle;
	if (next.connected === true) {
		delete next.connected;
		delete next.lastConnectedAt;
		delete next.lastEventAt;
		delete next.lastTransportActivityAt;
	}
	if (next.lastError === null && current.lastError) delete next.lastError;
	return next;
}
//#endregion
export { createConnectedChannelStatusPatch as a, channelStoppedPatch as i, channelReadyPatch as n, createTransportActivityStatusPatch as o, channelStartFailurePatch as r, sanitizeAbortedTaskStatusPatch as s, channelBlockedPatch as t };
