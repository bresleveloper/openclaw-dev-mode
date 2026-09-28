import { i as extractErrorCode } from "./error-coercion-C787aVxk.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as isPluginTrustRefusalError } from "./plugin-trust-Czz4RpQ5.mjs";
import { n as isChannelIngressUnavailableError } from "./ingress-unavailable-C-cec0bH.mjs";
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
	return Object.assign({
		running: true,
		connected: true,
		lifecycle: "ready",
		lastConnectedAt: Date.now(),
		lastError: null,
		terminalDisconnect: void 0
	}, extras);
}
function channelBlockedPatch(lastError, extras = {}) {
	return Object.assign({
		lifecycle: "blocked",
		terminalDisconnect: true,
		lastError
	}, extras);
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
	return Object.assign({
		running: false,
		connected: false,
		lifecycle: "stopped"
	}, extras);
}
//#endregion
export { createConnectedChannelStatusPatch as a, channelStoppedPatch as i, channelReadyPatch as n, createTransportActivityStatusPatch as o, channelStartFailurePatch as r, channelBlockedPatch as t };
