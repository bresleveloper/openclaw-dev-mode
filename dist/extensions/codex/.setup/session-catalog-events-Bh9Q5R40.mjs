import { c as MAX_CWD_LENGTH, d as boundedCatalogString } from "./session-catalog-parsing-B-qWJh2x.mjs";
import { n as defineCodexBuildState } from "./build-state-BgEYwu09.mjs";
import { r as inferCodexAppServerConnectionClass } from "./config-security-KAPScztc.mjs";
import { n as resolveCodexAppServerLocalHomeDir } from "./auth-start-options-BPIPeEX8.mjs";
import { n as codexCatalogHomeIdFromCanonicalPath } from "./session-catalog-home-id-vlih0B_g.mjs";
import { t as buildCodexAppServerConnectionFingerprint } from "./plugin-app-cache-key-BW8rd98k.mjs";
import { d as observeCodexCatalogEphemeralThreads, r as projectCodexCatalogNativeThread, s as codexCatalogSourceForClient } from "./session-catalog-native-projection-Dqb6Se_0.mjs";
import { createHash } from "node:crypto";
import { embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-registration";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/codex/src/session-catalog-events.ts
const getCatalogEvents = defineCodexBuildState("openclaw.codexCatalogEvents", () => ({
	listeners: /* @__PURE__ */ new Map(),
	clients: /* @__PURE__ */ new WeakMap()
}));
const CATALOG_NOTIFICATION_METHODS = /* @__PURE__ */ new Set([
	"thread/started",
	"turn/started",
	"turn/completed",
	"thread/archived",
	"thread/deleted",
	"thread/unarchived",
	"thread/reverted",
	"thread/name/updated",
	"thread/status/changed",
	"thread/settings/updated"
]);
function notifyEphemeralThread(homeKey, rawId) {
	const id = boundedCatalogString(rawId, 256);
	if (!id) return;
	for (const listener of getCatalogEvents().listeners.get(homeKey) ?? []) try {
		listener.onEphemeralThread?.(id);
	} catch (error) {
		embeddedAgentLog.warn("Codex catalog ephemeral observer failed", { error });
	}
}
/** Uses prepared local identity or resolves it once during client/index startup. */
async function codexCatalogResidentHomeKey(params) {
	if (inferCodexAppServerConnectionClass(params.startOptions) === "remote") {
		const fingerprint = buildCodexAppServerConnectionFingerprint({
			start: params.startOptions,
			connectionClass: "remote"
		}, params.agentDir);
		return `remote:${createHash("sha256").update(fingerprint).digest("hex")}`;
	}
	if (params.sourceHomeId) return params.sourceHomeId;
	const home = path.resolve(params.runtimeIdentity?.codexHome ?? resolveCodexAppServerLocalHomeDir(params.startOptions, params.agentDir));
	return codexCatalogHomeIdFromCanonicalPath(await fs.realpath(home).catch(() => home));
}
function subscribeCodexCatalogEvents(homeKey, listener, callbacks = {}) {
	const { listeners } = getCatalogEvents();
	let homeListeners = listeners.get(homeKey);
	if (!homeListeners) {
		homeListeners = /* @__PURE__ */ new Set();
		listeners.set(homeKey, homeListeners);
	}
	const subscription = {
		notify: listener,
		...callbacks
	};
	homeListeners.add(subscription);
	return () => {
		homeListeners.delete(subscription);
		if (homeListeners.size === 0 && listeners.get(homeKey) === homeListeners) listeners.delete(homeKey);
	};
}
/** Observes physical clients without extending their lease or native thread lifetime. */
function observeCodexCatalogClient(client, params) {
	const state = getCatalogEvents();
	const existing = state.clients.get(client);
	if (existing) return existing.then(() => void 0);
	const observing = (async () => {
		const homeKey = await codexCatalogResidentHomeKey({
			...params,
			runtimeIdentity: client.getRuntimeIdentity()
		});
		if (client.getCloseError()) return;
		const source = codexCatalogSourceForClient(client);
		observeCodexCatalogEphemeralThreads(source, notifyEphemeralThread.bind(void 0, homeKey));
		const notifyLifecycle = (callback) => {
			for (const listener of state.listeners.get(homeKey) ?? []) try {
				listener[callback]?.(source);
			} catch (error) {
				embeddedAgentLog.warn("Codex catalog lifecycle observer failed", {
					callback,
					error
				});
			}
		};
		const readThread = async (threadId) => (await client.request("thread/read", {
			threadId,
			includeTurns: false
		}, {
			timeoutMs: 6e4,
			catalogPreview: true
		})).thread;
		const stopNotifications = client.addNotificationHandler((event) => {
			if (!CATALOG_NOTIFICATION_METHODS.has(event.method)) return;
			for (const listener of state.listeners.get(homeKey) ?? []) listener.notify(event, readThread, source);
		});
		const stopClose = client.addCloseHandler(() => {
			stopNotifications();
			stopClose();
			notifyLifecycle("onClose");
		});
		if (inferCodexAppServerConnectionClass(params.startOptions) === "remote") notifyLifecycle("onRemoteReady");
		return {
			homeKey,
			source
		};
	})();
	state.clients.set(client, observing);
	return observing.then(() => void 0);
}
/** Acknowledged resume settings may differ from the response thread's persisted metadata. */
async function publishCodexCatalogResume(client, response, sanitize) {
	try {
		const prepared = {
			thread: projectCodexCatalogNativeThread(response.thread, sanitize),
			cwd: boundedCatalogString(response.cwd, MAX_CWD_LENGTH),
			modelProvider: boundedCatalogString(response.modelProvider, 500, "truncate")
		};
		const state = getCatalogEvents();
		const binding = await state.clients.get(client);
		if (!binding || binding.source.closed) return;
		await Promise.all(Array.from(state.listeners.get(binding.homeKey) ?? [], async (listener) => {
			try {
				await listener.onResume?.(prepared, binding.source);
			} catch (error) {
				embeddedAgentLog.warn("Codex catalog resume observer failed", { error });
			}
		}));
	} catch (error) {
		embeddedAgentLog.warn("Codex catalog resume publication failed", { error });
	}
}
//#endregion
export { subscribeCodexCatalogEvents as i, observeCodexCatalogClient as n, publishCodexCatalogResume as r, codexCatalogResidentHomeKey as t };
