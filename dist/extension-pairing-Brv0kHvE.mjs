import { v as resolveGatewayPort } from "./paths-DehQwyE0.mjs";
import { s as isLoopbackHost } from "./net-DU4aWKLv.mjs";
import "./ssrf-runtime-Darh53Ay.mjs";
import "./gateway-config-runtime-Bk2vDLZh.mjs";
import { a as resolveFirstExtensionProfileName, i as resolveBrowserConfig, s as resolveProfile } from "./config-fMVye_Fl.mjs";
import { t as ensureExtensionRelayToken } from "./relay-auth-BkA-pgXS.mjs";
//#region extensions/browser/src/browser/extension-pairing.ts
/** Gateway route for extension pairing that must wake Browser control. */
const GATEWAY_EXTENSION_RELAY_PATH = "/browser/extension";
/** Resolve a safe Gateway relay URL with the v2-bound route path. */
function buildGatewayExtensionRelayUrl(raw) {
	let url;
	try {
		url = new URL(raw.trim());
	} catch {
		throw new Error("--gateway-url must be a valid ws:// or wss:// URL");
	}
	const secure = url.protocol === "wss:";
	const localPlaintext = url.protocol === "ws:" && isLoopbackHost(url.hostname);
	if (!secure && !localPlaintext) throw new Error("--gateway-url must use wss:// (ws:// is allowed only for loopback)");
	if (url.username || url.password || url.search || url.hash) throw new Error("--gateway-url must not include credentials, a query, or a fragment");
	if (url.pathname !== "/") throw new Error("--gateway-url must not include a path prefix; Browser Relay Authentication v2 binds the exact /browser/extension path");
	url.pathname = GATEWAY_EXTENSION_RELAY_PATH;
	return url.toString();
}
/**
* Build the canonical host-owned extension pairing used by both the CLI and
* native bootstrap. A direct remote pairing is opt-in because its key belongs
* to the remote Gateway rather than the browser host.
*/
async function buildBrowserExtensionPairing(params) {
	const resolved = resolveBrowserConfig(params.cfg.browser, params.cfg);
	const profileName = params.profile || resolveFirstExtensionProfileName(resolved);
	const profile = profileName ? resolveProfile(resolved, profileName) : null;
	if (params.profile && profile?.driver !== "extension") throw new Error("Native bootstrap requires an existing extension profile");
	const relayPort = profile?.cdpPort ?? resolved.extensionRelayDefaultPort;
	const token = await (params.ensureToken ?? ensureExtensionRelayToken)();
	const gateway = params.gatewayUrl?.trim();
	if (gateway) {
		const relayUrl = new URL(buildGatewayExtensionRelayUrl(gateway));
		relayUrl.searchParams.set("gateway", gateway);
		return {
			pairingString: `${relayUrl.toString()}#${token}`,
			relayPort,
			topology: "direct-remote"
		};
	}
	const configuredRemote = params.cfg.gateway?.mode === "remote" ? params.cfg.gateway.remote?.url?.trim() : "";
	if (!configuredRemote && params.cfg.gateway?.tls?.enabled === true) throw new Error("Gateway TLS pairing requires --gateway-url wss://<certificate-host>[:port]");
	const gatewayHint = configuredRemote || `ws://127.0.0.1:${resolveGatewayPort(params.cfg)}`;
	const relayUrl = !configuredRemote && params.localTransport === "gateway" ? new URL(buildGatewayExtensionRelayUrl(gatewayHint)) : new URL(`ws://127.0.0.1:${relayPort}/extension`);
	if (params.profile && relayUrl.pathname === GATEWAY_EXTENSION_RELAY_PATH) relayUrl.searchParams.set("profile", params.profile);
	relayUrl.searchParams.set("gateway", gatewayHint);
	return {
		pairingString: `${relayUrl.toString()}#${token}`,
		relayPort,
		topology: configuredRemote ? "browser-node" : "local"
	};
}
//#endregion
export { buildBrowserExtensionPairing as t };
