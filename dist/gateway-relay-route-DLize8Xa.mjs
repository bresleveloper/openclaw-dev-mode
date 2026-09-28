import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { n as WebSocketServer } from "./websocket-CGHaToS5.mjs";
import "./plugin-runtime-BUxbDDeH.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import { t as rejectWebSocketUpgrade } from "./websocket-upgrade-reject-D2Ac4nen.mjs";
import { a as resolveFirstExtensionProfileName, s as resolveProfile } from "./config-fMVye_Fl.mjs";
import { o as getProfileLifecycle } from "./server-context.lifecycle-NJR9GfQj.mjs";
import "./subsystem-DDeJ2N6_.mjs";
import "./config-Cs3fQhZS.mjs";
import { r as getBrowserControlState } from "./browser-control-state-CUAhFG1B.mjs";
import { t as describeBrowserControlUnavailable } from "./plugin-enabled-0m53a7Un.mjs";
import { t as startBrowserControlServiceFromConfig } from "./control-service-BY6XWalP.mjs";
import { n as readExtensionRelayToken } from "./relay-auth-BkA-pgXS.mjs";
import { a as getBrowserRelayAuthV2Authority, o as invalidateBrowserRelayAuthV2Authority, s as parseExtensionRelayResource } from "./auth-v2-B-IXoFi_.mjs";
import { a as isAllowedExtensionOrigin, c as authenticateExtensionWebSocket, l as handlePreAuthWebSocketUpgrade, n as attachExtensionWebSocket, o as requestExtensionProtocolToken, s as requestProtocols, t as EXTENSION_RELAY_MAX_PAYLOAD_BYTES } from "./relay-server-C2e-qQtW.mjs";
import { n as ensureExtensionRelayForProfile } from "./relay-lifecycle-DwaQsGa7.mjs";
//#region extensions/browser/src/browser/extension-relay/gateway-relay-route.ts
const log = createSubsystemLogger("browser").child("extension-relay-gateway");
const GATEWAY_EXTENSION_RELAY_PATH = "/browser/extension";
let wss = null;
function getWss() {
	wss ??= new WebSocketServer({
		noServer: true,
		maxPayload: EXTENSION_RELAY_MAX_PAYLOAD_BYTES
	});
	return wss;
}
function requestedProfileName(resource, fallback) {
	return new URL(resource, "http://127.0.0.1").searchParams.get("profile") ?? fallback;
}
async function resolveGatewayRelay(resource) {
	let state = getBrowserControlState();
	if (!state) {
		state = await startBrowserControlServiceFromConfig();
		if (!state) throw new Error(await describeBrowserControlUnavailable());
	}
	const profileName = requestedProfileName(resource, resolveFirstExtensionProfileName(state.resolved) ?? "chrome");
	const resolved = resolveProfile(state.resolved, profileName);
	if (!resolved || resolved.driver !== "extension") throw new Error(`Extension browser profile "${profileName}" was not found`);
	const relay = await ensureExtensionRelayForProfile(state, resolved);
	const runtime = state.profiles.get(profileName);
	if (!runtime) throw new Error("Gateway relay profile is unavailable");
	const lifecycle = getProfileLifecycle(runtime);
	const generation = lifecycle.generation;
	return {
		relay,
		profileName,
		assertCurrent: () => {
			if (lifecycle.generation !== generation || lifecycle.transitionReason || lifecycle.terminal || getBrowserControlState() !== state || state.extensionRelays?.get(profileName) !== relay || state.profiles.get(profileName) !== runtime || readExtensionRelayToken() !== relay.token || resolveProfile(state.resolved, profileName)?.cdpPort !== relay.port) throw new Error("Gateway relay ingress was superseded");
		}
	};
}
async function prepareGatewayIngress(access, ws, assertAuthenticated) {
	assertAuthenticated();
	access.assertCurrent();
	const relay = access.relay;
	const attach = relay.ownership === "borrowed" ? await relay.client.prepareIngress(ws) : () => attachExtensionWebSocket(relay.bridge, ws);
	return () => {
		assertAuthenticated();
		access.assertCurrent();
		attach();
		log.info(`extension connected over gateway for profile "${access.profileName}"`);
	};
}
/** Handle the plugin-owned Gateway upgrade path. */
async function handleGatewayExtensionUpgrade(req, socket, head) {
	const resource = parseExtensionRelayResource(req.url ?? "/", GATEWAY_EXTENSION_RELAY_PATH);
	if (!resource) return (req.url ?? "/").split("?")[0] === GATEWAY_EXTENSION_RELAY_PATH ? (rejectWebSocketUpgrade(socket, { status: 400 }), true) : false;
	if (!isAllowedExtensionOrigin(req)) {
		rejectWebSocketUpgrade(socket, { status: 403 });
		return true;
	}
	const protocols = requestProtocols(req);
	const source = getPluginRuntimeGatewayRequestScope()?.client?.clientIp ?? req.socket?.remoteAddress ?? "unknown";
	const token = readExtensionRelayToken();
	if (!token) {
		invalidateBrowserRelayAuthV2Authority();
		rejectWebSocketUpgrade(socket, { status: 401 });
		return true;
	}
	const isV2 = protocols.length === 1 && protocols[0] === "openclaw-extension-relay.v2";
	const assertAuthenticated = () => {
		if (readExtensionRelayToken() !== token || !isV2 && getRuntimeConfig().browser?.extensionRelay?.allowLegacyAuth === false) throw new Error("browser relay authentication changed");
	};
	if (isV2) {
		const authority = getBrowserRelayAuthV2Authority(token);
		if (!handlePreAuthWebSocketUpgrade({
			wss: getWss(),
			req,
			socket,
			head,
			onUpgrade: (ws, removePreAuthGuard) => {
				authenticateExtensionWebSocket({
					ws,
					authority,
					source,
					resource,
					removePreAuthGuard,
					prepareAuthenticated: async () => {
						assertAuthenticated();
						return await prepareGatewayIngress(await resolveGatewayRelay(resource), ws, assertAuthenticated);
					}
				});
			}
		})) rejectWebSocketUpgrade(socket, { status: 400 });
		return true;
	}
	if (protocols.includes("openclaw-extension-relay.v2")) {
		rejectWebSocketUpgrade(socket, { status: 400 });
		return true;
	}
	const allowLegacyAuth = getRuntimeConfig().browser?.extensionRelay?.allowLegacyAuth !== false;
	const legacyToken = requestExtensionProtocolToken(req);
	if (!allowLegacyAuth || !protocols.includes("openclaw-extension-relay") || legacyToken.length === 0 || !safeEqualSecret(token, legacyToken)) {
		rejectWebSocketUpgrade(socket, { status: 401 });
		return true;
	}
	let resolved;
	try {
		resolved = await resolveGatewayRelay(resource);
		assertAuthenticated();
	} catch (err) {
		log.warn(`failed to start Browser control for legacy extension relay: ${String(err)}`);
		rejectWebSocketUpgrade(socket, { status: 503 });
		return true;
	}
	const authority = getBrowserRelayAuthV2Authority(token);
	getWss().handleUpgrade(req, socket, head, (ws) => {
		ws.pause();
		ws.on("error", (err) => log.warn(`relay socket error: ${String(err)}`));
		if (!authority.registerAuthenticatedConnection(ws, () => ws.close(4003, "browser relay key rotated"))) {
			ws.terminate();
			return;
		}
		ws.once("close", () => authority.releaseConnection(ws));
		prepareGatewayIngress(resolved, ws, assertAuthenticated).then((attach) => {
			if (ws.readyState === 1) attach();
		}).catch(() => ws.close(1011, "Relay ingress unavailable")).finally(() => ws.resume());
		log.warn(`legacy extension authentication accepted for profile "${resolved.profileName}"`);
	});
	return true;
}
function disposeGatewayExtensionRelay() {
	if (!wss) return;
	for (const client of wss.clients) client.terminate();
	wss.close();
	wss = null;
}
//#endregion
export { disposeGatewayExtensionRelay, handleGatewayExtensionUpgrade };
