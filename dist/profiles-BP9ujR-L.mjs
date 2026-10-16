import { t as parseBrowserHttpUrl } from "./browser-cdp-DgJ98Oxl.mjs";
//#region extensions/browser/src/browser/profiles.ts
const CDP_PORT_RANGE_START = 18800;
const CDP_PORT_RANGE_END = 18899;
const MAX_TCP_PORT = 65535;
const PROFILE_NAME_REGEX = /^[a-z0-9][a-z0-9-]*$/;
function isValidProfileName(name) {
	return Boolean(name) && name.length <= 64 && PROFILE_NAME_REGEX.test(name);
}
function allocateCdpPort(usedPorts, range) {
	const start = range?.start ?? CDP_PORT_RANGE_START;
	const end = range?.end ?? CDP_PORT_RANGE_END;
	if (!isValidTcpPort(start) || !isValidTcpPort(end) || start > end) return null;
	for (let port = start; port <= end; port++) if (!usedPorts.has(port)) return port;
	return null;
}
function isValidTcpPort(port) {
	return Number.isSafeInteger(port) && port > 0 && port <= MAX_TCP_PORT;
}
function getUsedPorts(profiles) {
	const used = /* @__PURE__ */ new Set();
	for (const profile of Object.values(profiles ?? {})) {
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
