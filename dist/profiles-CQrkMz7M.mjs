import { t as parseBrowserHttpUrl } from "./browser-cdp-nPpqdqz_.mjs";
//#region extensions/browser/src/browser/profiles.ts
/**
* Browser profile allocation helpers.
*
* Validates profile names and allocates CDP ports/colors for newly persisted
* browser profiles.
*/
/**
* CDP port allocation for browser profiles.
*
* Default port range: 18800-18899 (100 profiles max)
* Ports are allocated once at profile creation and persisted in config.
* Multi-instance: callers may pass an explicit range to avoid collisions.
*
* Reserved ports (do not use for CDP):
*   18789 - Gateway WebSocket
*   18790 - Bridge
*   18791 - Browser control server
*   18792-18799 - Reserved for future one-off services (canvas at 18793)
*/
/** Default first CDP port for browser profiles. */
const CDP_PORT_RANGE_START = 18800;
/** Default last CDP port for browser profiles. */
const CDP_PORT_RANGE_END = 18899;
const MAX_TCP_PORT = 65535;
const PROFILE_NAME_REGEX = /^[a-z0-9][a-z0-9-]*$/;
/** Return true when a profile name matches the supported config key format. */
function isValidProfileName(name) {
	if (!name || name.length > 64) return false;
	return PROFILE_NAME_REGEX.test(name);
}
/** Allocate the first unused CDP port in the configured range. */
function allocateCdpPort(usedPorts, range) {
	const start = range?.start ?? CDP_PORT_RANGE_START;
	const end = range?.end ?? CDP_PORT_RANGE_END;
	if (!isValidTcpPort(start) || !isValidTcpPort(end)) return null;
	if (start > end) return null;
	for (let port = start; port <= end; port++) if (!usedPorts.has(port)) return port;
	return null;
}
function isValidTcpPort(port) {
	return Number.isSafeInteger(port) && port > 0 && port <= MAX_TCP_PORT;
}
/** Extract currently used CDP ports from profile config. */
function getUsedPorts(profiles) {
	if (!profiles) return /* @__PURE__ */ new Set();
	const used = /* @__PURE__ */ new Set();
	for (const profile of Object.values(profiles)) {
		if (typeof profile.cdpPort === "number" && isValidTcpPort(profile.cdpPort)) {
			used.add(profile.cdpPort);
			continue;
		}
		const rawUrl = profile.cdpUrl?.trim();
		if (!rawUrl) continue;
		try {
			used.add(parseBrowserHttpUrl(rawUrl, "browser.profiles.*.cdpUrl").port);
		} catch {}
	}
	return used;
}
//#endregion
export { getUsedPorts as n, isValidProfileName as r, allocateCdpPort as t };
