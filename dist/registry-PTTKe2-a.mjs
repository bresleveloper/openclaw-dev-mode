import { a as asOptionalRecord, u as readStringField } from "./record-coerce-TIsquoVR.mjs";
import { s as isLoopbackHost } from "./net-C6WEu3pd.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./ssrf-runtime-BzkFo_VJ.mjs";
import { f as DEFAULT_OPENCLAW_BROWSER_COLOR } from "./constants-C-i9f6FL.mjs";
//#region extensions/browser/src/browser/engines/chromium.ts
const chromiumEngine = {
	descriptor: {
		id: "chromium",
		label: "Chromium",
		launchMode: "managed-or-attach",
		sessionScope: "browser",
		screenshotFidelity: "rendered"
	},
	requiresDedicatedEndpoint: false,
	canReconnectForSafeReads: true,
	supportsRequest: () => true,
	capabilities(profile) {
		const usesChromeMcp = profile.driver === "existing-session";
		const usesExtension = profile.driver === "extension";
		const isRemote = !usesChromeMcp && !usesExtension && !profile.cdpIsLoopback;
		const localManaged = !usesChromeMcp && !usesExtension && !isRemote;
		return {
			supportsBatchActions: profile.driver !== "existing-session",
			supportsDownloads: profile.driver !== "existing-session",
			supportsPdf: profile.driver !== "existing-session",
			supportsRequests: profile.driver !== "existing-session",
			supportsErrors: profile.driver !== "existing-session",
			supportsPageText: profile.driver !== "existing-session",
			supportsEmulation: profile.driver !== "existing-session",
			supportsScreenshots: true,
			supportsVisualActions: true,
			supportsUploads: true,
			supportsDialogs: true,
			supportsStorage: true,
			supportsScreencast: profile.driver !== "existing-session",
			supportsConsole: true,
			supportsMultipleTabs: true,
			supportsNativeSnapshots: true,
			requiresCompleteTargetEnumeration: profile.driver === "extension",
			mode: usesChromeMcp ? "local-existing-session" : usesExtension ? "local-extension" : isRemote ? "remote-cdp" : "local-managed",
			isRemote,
			browserFilesystemLocal: usesExtension || localManaged && !profile.attachOnly,
			usesChromeMcp,
			usesPersistentPlaywright: usesExtension || isRemote,
			supportsPerTabWs: localManaged,
			supportsJsonTabEndpoints: localManaged,
			supportsReset: localManaged,
			supportsManagedTabLimit: localManaged
		};
	}
};
//#endregion
//#region extensions/browser/src/browser/engines/lightpanda-cdp.ts
const MAX_PENDING_TARGET_COMMANDS = 4096;
const MAX_ATTACHED_PAGE_SESSIONS = 4096;
const ROOT_REPLIES = /* @__PURE__ */ new Set([
	"Target.getTargetInfo",
	"Target.getTargets",
	"Target.getBrowserContexts"
]);
/** Normalize the session-routing omissions observed in Lightpanda 0.4.1. */
function createLightpandaCdpNormalizer() {
	const pendingSessions = /* @__PURE__ */ new Map();
	const targetBySession = /* @__PURE__ */ new Map();
	return {
		send(message) {
			const command = asOptionalRecord(message);
			const method = readStringField(command, "method");
			const sessionId = readStringField(command, "sessionId");
			if (!command || !sessionId || !ROOT_REPLIES.has(method ?? "")) return message;
			if (typeof command.id === "number") {
				if (pendingSessions.size >= MAX_PENDING_TARGET_COMMANDS) throw new Error("Lightpanda has too many unanswered target commands; reconnect.");
				pendingSessions.set(command.id, sessionId);
			}
			const params = asOptionalRecord(command.params);
			const targetId = targetBySession.get(sessionId);
			if (method === "Target.getTargetInfo" && !readStringField(params, "targetId") && targetId) return {
				...command,
				params: {
					...params,
					targetId
				}
			};
			return message;
		},
		receive(message) {
			const params = asOptionalRecord(message.params);
			const sessionId = readStringField(params, "sessionId");
			if (message.method === "Target.attachedToTarget" && sessionId) {
				const target = asOptionalRecord(params?.targetInfo);
				const targetId = readStringField(target, "targetId");
				if (sessionId === "STARTUP" && targetId === "TID-STARTUP" && readStringField(target, "browserContextId") === "BID-STARTUP") return;
				if (readStringField(target, "type") === "page" && targetId) {
					if (targetBySession.size >= MAX_ATTACHED_PAGE_SESSIONS) throw new Error("Lightpanda has too many attached page sessions; reconnect.");
					targetBySession.set(sessionId, targetId);
				}
			} else if (message.method === "Target.detachedFromTarget" && sessionId) targetBySession.delete(sessionId);
			if (typeof message.id === "number") {
				const expectedSessionId = pendingSessions.get(message.id);
				pendingSessions.delete(message.id);
				if (expectedSessionId && !readStringField(message, "sessionId")) return {
					...message,
					sessionId: expectedSessionId
				};
			}
			return message;
		},
		clear() {
			pendingSessions.clear();
			targetBySession.clear();
		}
	};
}
//#endregion
//#region extensions/browser/src/browser/engines/lightpanda.ts
const SEMANTIC_ROUTES = /* @__PURE__ */ new Set([
	"/",
	"/doctor",
	"/start",
	"/stop",
	"/tabs",
	"/tabs/open",
	"/tabs/focus",
	"/tabs/:targetId",
	"/tabs/action",
	"/navigate",
	"/text",
	"/snapshot",
	"/act"
]);
const SEMANTIC_ACT_KINDS = /* @__PURE__ */ new Set([
	"click",
	"type",
	"press",
	"select",
	"fill",
	"wait",
	"evaluate",
	"close"
]);
//#endregion
//#region extensions/browser/src/browser/engines/registry.ts
const engines = {
	chromium: chromiumEngine,
	lightpanda: {
		descriptor: {
			id: "lightpanda",
			label: "Lightpanda",
			launchMode: "attach-only",
			sessionScope: "connection",
			screenshotFidelity: "none"
		},
		requiresDedicatedEndpoint: true,
		canReconnectForSafeReads: false,
		maxPagesPerConnection: 1,
		defaultSnapshotRefs: "aria",
		createCdpNormalizer: createLightpandaCdpNormalizer,
		supportsRequest({ path, actionKind, actionSelector, snapshot }) {
			if (!SEMANTIC_ROUTES.has(path)) return false;
			if (path === "/act") return !actionSelector && (actionKind === void 0 || SEMANTIC_ACT_KINDS.has(actionKind));
			return !snapshot || !(snapshot.labels || snapshot.format === "aria" || snapshot.refs === "role" || snapshot.selector || snapshot.frame);
		},
		capabilities(profile) {
			return {
				mode: "lightweight-cdp",
				isRemote: !profile.cdpIsLoopback,
				browserFilesystemLocal: false,
				usesChromeMcp: false,
				usesPersistentPlaywright: true,
				supportsPerTabWs: false,
				supportsJsonTabEndpoints: false,
				supportsReset: false,
				supportsManagedTabLimit: false,
				supportsBatchActions: false,
				supportsDownloads: false,
				supportsPdf: false,
				supportsRequests: false,
				supportsErrors: false,
				supportsPageText: true,
				supportsEmulation: false,
				supportsScreenshots: false,
				supportsVisualActions: false,
				supportsUploads: false,
				supportsDialogs: false,
				supportsStorage: false,
				supportsScreencast: false,
				supportsConsole: false,
				supportsMultipleTabs: false,
				supportsNativeSnapshots: false,
				requiresCompleteTargetEnumeration: false
			};
		},
		resolveExternalProfile(profileName, profile) {
			const endpoint = profile.cdpUrl ? URL.parse(profile.cdpUrl) : null;
			if (!endpoint || !["ws:", "wss:"].includes(endpoint.protocol)) throw new Error(`browser.profiles.${profileName}.cdpUrl must be an explicit ws:// or wss:// Lightpanda endpoint.`);
			if (profile.attachOnly !== true) throw new Error(`browser.profiles.${profileName} requires attachOnly: true for Lightpanda.`);
			if (profile.driver !== void 0 && profile.driver !== "openclaw") throw new Error(`browser.profiles.${profileName} requires the default CDP driver for Lightpanda.`);
			for (const key of [
				"cdpPort",
				"userDataDir",
				"mcpCommand",
				"mcpArgs",
				"headless",
				"executablePath"
			]) if (profile[key] !== void 0) throw new Error(`browser.profiles.${profileName}.${key} is not supported by Lightpanda.`);
			return {
				name: profileName,
				engine: "lightpanda",
				cdpUrl: endpoint.toString(),
				cdpHost: endpoint.hostname,
				cdpPort: Number(endpoint.port || (endpoint.protocol === "wss:" ? 443 : 80)),
				cdpIsLoopback: isLoopbackHost(endpoint.hostname),
				color: DEFAULT_OPENCLAW_BROWSER_COLOR,
				driver: "openclaw",
				headless: true,
				headlessSource: "default",
				attachOnly: true
			};
		}
	}
};
function resolveBrowserEngine(id = "chromium") {
	if (!Object.hasOwn(engines, id)) throw new Error(`Unknown browser engine "${id}". Select chromium or lightpanda.`);
	return engines[id];
}
/** The same registered implementations drive status discovery and execution. */
function listBrowserEngines() {
	return Object.values(engines).map(({ descriptor }) => Object.assign({}, descriptor));
}
//#endregion
export { resolveBrowserEngine as n, listBrowserEngines as t };
