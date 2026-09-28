import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
//#region src/agents/sandbox/network-mode.ts
/**
* Docker network mode safety helpers.
*
* Flags host networking and container namespace joins because they bypass normal sandbox network isolation.
*/
/** Normalizes optional Docker network mode strings for policy checks. */
function normalizeNetworkMode(network) {
	return normalizeOptionalLowercaseString(network) || void 0;
}
/** Returns the concrete block reason for dangerous network modes, if blocked. */
function getBlockedNetworkModeReason(params) {
	const normalized = normalizeNetworkMode(params.network);
	if (!normalized) return null;
	if (normalized === "host") return "host";
	if (normalized.startsWith("container:") && params.allowContainerNamespaceJoin !== true) return "container_namespace_join";
	return null;
}
/** Returns whether a network mode weakens sandbox network isolation. */
function isDangerousNetworkMode(network) {
	const normalized = normalizeNetworkMode(network);
	return normalized === "host" || normalized?.startsWith("container:") === true;
}
//#endregion
export { isDangerousNetworkMode as n, normalizeNetworkMode as r, getBlockedNetworkModeReason as t };
