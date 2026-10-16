import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
import { f as isValidIPv4 } from "./net-C6WEu3pd.mjs";
import { n as pickBestEffortPrimaryLanIPv4, t as inspectBestEffortPrimaryTailnetIPv4 } from "./network-discovery-display-N9b25Tou.mjs";
import { t as resolveAdvertisedLanHostCore } from "./advertised-lan-host-V7bMngZk.mjs";
//#region src/gateway/control-ui-links.ts
/** Resolve the advertised HTTP and websocket URLs for the Control UI. */
function resolveControlUiLinks(params) {
	const port = params.port;
	const bind = params.bind ?? "loopback";
	const customBindHost = params.customBindHost?.trim();
	const advertisedLanHost = normalizeOptionalString(params.advertisedLanHost);
	const { tailnetIPv4 } = inspectBestEffortPrimaryTailnetIPv4();
	const host = (() => {
		if (bind === "custom" && customBindHost && isValidIPv4(customBindHost)) return customBindHost;
		if (bind === "tailnet" && tailnetIPv4) return tailnetIPv4;
		if (bind === "lan") return advertisedLanHost ?? pickBestEffortPrimaryLanIPv4() ?? "127.0.0.1";
		return "127.0.0.1";
	})();
	const basePath = normalizeControlUiBasePath(params.basePath);
	const httpScheme = params.tlsEnabled === true ? "https" : "http";
	const wsScheme = params.tlsEnabled === true ? "wss" : "ws";
	return {
		httpUrl: `${httpScheme}://${host}:${port}${basePath}/`,
		wsUrl: `${wsScheme}://${host}:${port}${basePath}`
	};
}
/** Resolve Control UI URLs meant for display to nearby devices. */
async function resolveAdvertisedControlUiLinks(params) {
	const advertisedLanHost = params.bind === "lan" ? await resolveAdvertisedLanHostCore().catch(() => null) : null;
	return resolveControlUiLinks({
		...params,
		advertisedLanHost
	});
}
/** Resolve Control UI URLs for co-located readiness probes and health checks. */
function resolveLocalControlUiProbeLinks(params) {
	return resolveControlUiLinks({
		...params,
		bind: "loopback"
	});
}
//#endregion
export { resolveControlUiLinks as n, resolveLocalControlUiProbeLinks as r, resolveAdvertisedControlUiLinks as t };
