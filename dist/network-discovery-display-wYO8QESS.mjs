import { n as pickPrimaryTailnetIPv4 } from "./tailnet-CpQajnSe.mjs";
import { g as resolveGatewayBindHost, m as pickPrimaryLanIPv4 } from "./net-CjQwRK-V.mjs";
//#region src/infra/network-discovery-display.ts
function displayNetworkWarning(error, warningPrefix) {
	const prefix = warningPrefix?.trim();
	if (!prefix) return {};
	return { warning: `${prefix}: ${(error instanceof Error ? error.message.trim() : "") || "network interface discovery failed"}.` };
}
function fallbackBindHostForDisplay(bindMode, customBindHost) {
	if (bindMode === "lan") return "0.0.0.0";
	if (bindMode === "custom") return customBindHost?.trim() || "0.0.0.0";
	return "127.0.0.1";
}
/** Return a LAN IPv4 for display, or undefined when interface discovery fails. */
function pickBestEffortPrimaryLanIPv4() {
	try {
		return pickPrimaryLanIPv4();
	} catch {
		return;
	}
}
/** Return a tailnet IPv4 plus an optional warning suitable for user output. */
function inspectBestEffortPrimaryTailnetIPv4(params) {
	try {
		return { tailnetIPv4: pickPrimaryTailnetIPv4() };
	} catch (error) {
		return {
			tailnetIPv4: void 0,
			...displayNetworkWarning(error, params?.warningPrefix)
		};
	}
}
/** Resolve the gateway bind host for display, falling back to a safe placeholder. */
async function resolveBestEffortGatewayBindHostForDisplay(params) {
	try {
		return { bindHost: await resolveGatewayBindHost(params.bindMode, params.customBindHost) };
	} catch (error) {
		const warning = displayNetworkWarning(error, params.warningPrefix);
		return {
			bindHost: fallbackBindHostForDisplay(params.bindMode, params.customBindHost),
			...warning
		};
	}
}
//#endregion
export { pickBestEffortPrimaryLanIPv4 as n, resolveBestEffortGatewayBindHostForDisplay as r, inspectBestEffortPrimaryTailnetIPv4 as t };
