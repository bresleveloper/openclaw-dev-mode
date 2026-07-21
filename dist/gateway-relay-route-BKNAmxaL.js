import { t as createSubsystemLogger } from "./subsystem-C3fiUGN1.js";
import { i as resolveProfile } from "./config-C25IwRz4.js";
import { n as extensionRelayTokenMatches, r as readExtensionRelayToken } from "./relay-auth-Bs2MEHFt.js";
import "./subsystem-DN018rQU.js";
import { i as getBrowserControlState } from "./plugin-enabled-C7puELLN.js";
import { t as startBrowserControlServiceFromConfig } from "./control-service-BN7COBlj.js";
import { c as isAllowedExtensionOrigin, l as requestExtensionProtocolToken, n as ensureExtensionRelayForProfile, o as EXTENSION_RELAY_MAX_PAYLOAD_BYTES, s as attachExtensionWebSocket } from "./relay-lifecycle-SVyOXOYP.js";
import { WebSocketServer } from "ws";
//#region extensions/browser/src/browser/extension-relay/gateway-relay-route.ts
const log = createSubsystemLogger("browser").child("extension-relay-gateway");
let wss = null;
function getWss() {
	wss ??= new WebSocketServer({
		noServer: true,
		maxPayload: EXTENSION_RELAY_MAX_PAYLOAD_BYTES
	});
	return wss;
}
function destroy(socket, statusLine) {
	try {
		socket.write(`HTTP/1.1 ${statusLine}\r\nConnection: close\r\n\r\n`);
		socket.destroy();
	} catch {}
}
function requestedProfileName(req, fallback) {
	try {
		return new URL(req.url ?? "/", "http://127.0.0.1").searchParams.get("profile")?.trim() || fallback;
	} catch {
		return fallback;
	}
}
/** First extension-driver profile name, defaulting to the built-in `chrome`. */
function defaultExtensionProfileName(profiles) {
	for (const [name, profile] of Object.entries(profiles)) if (profile.driver === "extension") return name;
	return "chrome";
}
/**
* Handle a gateway upgrade for the extension relay path. Returns true when the
* request was claimed (handled or rejected), false to let the gateway continue.
*/
async function handleGatewayExtensionUpgrade(req, socket, head) {
	if ((req.url ?? "/").split("?")[0] !== "/browser/extension") return false;
	if (!isAllowedExtensionOrigin(req)) {
		destroy(socket, "403 Forbidden");
		return true;
	}
	let state = getBrowserControlState();
	const expectedToken = readExtensionRelayToken();
	const candidate = requestExtensionProtocolToken(req);
	if (!expectedToken || candidate.length === 0 || !extensionRelayTokenMatches(expectedToken, candidate)) {
		destroy(socket, "401 Unauthorized");
		return true;
	}
	if (!state) {
		try {
			state = await startBrowserControlServiceFromConfig();
		} catch (err) {
			log.warn(`failed to start Browser control for extension relay: ${String(err)}`);
		}
		if (!state) {
			destroy(socket, "503 Service Unavailable");
			return true;
		}
	}
	const profileName = requestedProfileName(req, defaultExtensionProfileName(state.resolved.profiles));
	const resolved = resolveProfile(state.resolved, profileName);
	if (!resolved || resolved.driver !== "extension") {
		destroy(socket, "404 Not Found");
		return true;
	}
	let bridge;
	try {
		bridge = (await ensureExtensionRelayForProfile(state, resolved)).bridge;
	} catch (err) {
		log.warn(`failed to start relay for profile "${profileName}": ${String(err)}`);
		destroy(socket, "503 Service Unavailable");
		return true;
	}
	getWss().handleUpgrade(req, socket, head, (ws) => {
		attachExtensionWebSocket(bridge, ws);
		log.info(`extension connected over gateway for profile "${profileName}"`);
	});
	return true;
}
/** Release the shared WebSocketServer (runtime shutdown / tests). */
function disposeGatewayExtensionRelay() {
	wss?.close();
	wss = null;
}
//#endregion
export { disposeGatewayExtensionRelay, handleGatewayExtensionUpgrade };
