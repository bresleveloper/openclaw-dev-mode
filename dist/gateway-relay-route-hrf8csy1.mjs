import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { n as WebSocketServer } from "./websocket-CGHaToS5.mjs";
import { t as rejectWebSocketUpgrade } from "./websocket-upgrade-reject-D2Ac4nen.mjs";
import "./security-runtime-6domDoE8.mjs";
import "./runtime-config-snapshot-kTPhBdOK.mjs";
import "./plugin-runtime-BaFUwWWh.mjs";
import "./logging-core-CsXmxYo2.mjs";
import { h as EXTENSION_RELAY_MAX_PAYLOAD_BYTES } from "./constants-CxIE9Xhk.mjs";
import { a as resolveFirstExtensionProfileName, s as resolveProfile } from "./config-xjgIR3E-.mjs";
import { o as getProfileLifecycle } from "./server-context.lifecycle-BoKswvT1.mjs";
import { r as getBrowserControlState } from "./browser-control-state-bUudnqjR.mjs";
import { t as describeBrowserControlUnavailable } from "./plugin-enabled-BozM7gNo.mjs";
import { t as startBrowserControlServiceFromConfig } from "./control-service-PkoHhWT0.mjs";
import { n as readExtensionRelayToken } from "./relay-auth-B3T3jEbR.mjs";
import { a as getBrowserRelayAuthV2Authority, o as invalidateBrowserRelayAuthV2Authority, s as parseExtensionRelayResource } from "./auth-v2-Cc73-8JR.mjs";
import { a as requestExtensionProtocolToken, c as trackAuthenticatedRelaySocket, i as isAllowedExtensionOrigin, l as handlePreAuthWebSocketUpgrade, o as requestProtocols, s as authenticateExtensionWebSocket, t as attachExtensionWebSocket } from "./relay-server-BZJInYjI.mjs";
import { n as ensureExtensionRelayForProfile } from "./relay-lifecycle-B8AmPSkf.mjs";
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
	const profileSignal = lifecycle.controller.signal;
	return {
		relay,
		profileName,
		assertCurrent: () => {
			if (profileSignal.aborted || lifecycle.transitionReason || lifecycle.terminal || getBrowserControlState() !== state || state.extensionRelays?.get(profileName) !== relay || state.profiles.get(profileName) !== runtime || readExtensionRelayToken() !== relay.token || resolveProfile(state.resolved, profileName)?.cdpPort !== relay.port) throw new Error("Gateway relay ingress was superseded");
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
		if (readExtensionRelayToken() !== token || !isV2 && readRuntimeConfig().browser?.extensionRelay?.allowLegacyAuth === false) throw new Error("browser relay authentication changed");
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
	const allowLegacyAuth = readRuntimeConfig().browser?.extensionRelay?.allowLegacyAuth !== false;
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
		if (!trackAuthenticatedRelaySocket(authority, ws)) return;
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
