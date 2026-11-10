import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as parseTcpPort } from "./tcp-port-B-4SirsX.mjs";
import { l as isIpv6Address, v as parseCanonicalIpAddress } from "./ip-Df-yvQzE.mjs";
import { a as resolveControlUiAllowedOrigins } from "./gateway-control-ui-origins-Di731Cdm.mjs";
import { i as getTailnetHostname } from "./tailscale-DIe8yR1S.mjs";
import { o as formatPortRangeHint } from "./error-format-Cd0oOG4L.mjs";
//#region src/gateway/gateway-config-prompts.shared.ts
function validateGatewayPortInput(value) {
	return parseTcpPort(value) === null ? formatPortRangeHint() : void 0;
}
const TAILSCALE_EXPOSURE_OPTIONS = [
	{
		value: "off",
		label: "Off",
		hint: "No Tailscale exposure"
	},
	{
		value: "serve",
		label: "Serve",
		hint: "Private HTTPS for your tailnet (devices on Tailscale)"
	},
	{
		value: "funnel",
		label: "Funnel",
		hint: "Public HTTPS via Tailscale Funnel (internet)"
	}
];
const TAILSCALE_MISSING_BIN_NOTE_LINES = [
	"Tailscale binary not found in PATH or /Applications.",
	"Install Tailscale from:",
	"  https://tailscale.com/download/mac",
	"",
	"You can continue setup, but serve/funnel will fail at runtime."
];
const TAILSCALE_DOCS_LINES = [
	"Docs:",
	"https://docs.openclaw.ai/gateway/tailscale",
	"https://docs.openclaw.ai/web"
];
function buildTailnetHttpsOrigin(rawHost) {
	const trimmed = rawHost.trim().replace(/\.$/, "");
	if (!trimmed) return null;
	const parsed = parseCanonicalIpAddress(trimmed);
	const normalizedHost = parsed && isIpv6Address(parsed) ? `[${normalizeLowercaseStringOrEmpty(parsed.toString())}]` : trimmed;
	return URL.parse(`https://${normalizedHost}`)?.origin ?? null;
}
async function maybeAddTailnetOriginToControlUiAllowedOrigins(params) {
	if (params.tailscaleMode !== "serve" && params.tailscaleMode !== "funnel") return params.config;
	const tsOrigin = await getTailnetHostname(void 0, params.tailscaleBin ?? void 0).then((host) => buildTailnetHttpsOrigin(expectDefined(host, "gateway config prompts.shared host"))).catch(() => null);
	if (!tsOrigin) return params.config;
	const existing = resolveControlUiAllowedOrigins(params.config) ?? [];
	const normalized = normalizeLowercaseStringOrEmpty(tsOrigin);
	if (existing.some((entry) => normalizeLowercaseStringOrEmpty(entry) === normalized)) return params.config;
	return {
		...params.config,
		gateway: {
			...params.config.gateway,
			controlUi: {
				...params.config.gateway?.controlUi,
				allowedOrigins: [...existing, tsOrigin]
			}
		}
	};
}
//#endregion
export { validateGatewayPortInput as a, maybeAddTailnetOriginToControlUiAllowedOrigins as i, TAILSCALE_EXPOSURE_OPTIONS as n, TAILSCALE_MISSING_BIN_NOTE_LINES as r, TAILSCALE_DOCS_LINES as t };
