import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { h as retireSharedCodexAppServerClientIfCurrent } from "./session-catalog-events-Bj6j94E_.mjs";
import { n as waitForPromiseOrAbort, o as CodexAppServerRpcError, t as abortReason } from "./timeout-C910MdAB.mjs";
import { h as unknownItemStatus } from "./event-projector-items-C6L_5ZiT.mjs";
import { G as unsubscribeCodexAppServerLiveThread, rt as isCodexAppServerStartupError, u as isCodexAppServerStartSelectionChangedError } from "./shared-client-DA4VR4Eb.mjs";
import { T as readCodexTurnCompletedNotification, a as isCodexAppServerBrokenPipeError, d as isCodexAppServerRequestTimeoutError, l as isCodexAppServerOverloadError } from "./client-Cs08OXVQ.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { AsyncResource } from "node:async_hooks";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { sanitizeTerminalText } from "openclaw/plugin-sdk/text-chunking";
import { AgentHarnessPreflightError, embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-runtime";
import { redactSensitiveText } from "openclaw/plugin-sdk/logging-core";
//#region extensions/codex/src/app-server/notification-correlation.ts
/**
* Correlates Codex app-server notifications with the active thread/turn so
* projectors can ignore global or stale events without losing diagnostics.
*/
/** Returns true when a notification payload belongs to the exact active thread and turn. */
function isCodexNotificationForTurn(value, threadId, turnId) {
	if (!isJsonObject(value)) return false;
	return readCodexNotificationThreadId(value) === threadId && readCodexNotificationTurnId(value) === turnId;
}
/**
* Reads a thread id from canonical top-level or nested thread payloads.
* The generated v2 schemas require top-level `threadId` on turn/item-scoped
* notifications and define `Turn` without one, so `turn.threadId` is not a
* wire shape and is deliberately not read here.
*/
function readCodexNotificationThreadId(record) {
	const thread = isJsonObject(record.thread) ? record.thread : void 0;
	return normalizeOptionalString(record.threadId) ?? (thread ? normalizeOptionalString(thread.id) : void 0);
}
/** Reads a turn id from either top-level notification params or nested turn payloads. */
function readCodexNotificationTurnId(record) {
	return readNestedTurnId(record) ?? normalizeOptionalString(record.turnId);
}
function readNestedTurnId(record) {
	const turn = record.turn;
	return isJsonObject(turn) ? normalizeOptionalString(turn.id) : void 0;
}
//#endregion
//#region extensions/codex/src/app-server/event-projector-diagnostics.ts
function redactCodexEventKind(method) {
	return redactSensitiveText(sanitizeTerminalText(method));
}
var CodexProjectionDiagnostics = class {
	constructor(threadId, turnId) {
		this.threadId = threadId;
		this.turnId = turnId;
		this.warningKeys = /* @__PURE__ */ new Set();
	}
	warnUnknownItemStatus(item) {
		if (!item) return;
		const status = unknownItemStatus(item);
		if (!status) return;
		const safeStatus = redactCodexEventKind(status);
		const safeItemType = redactCodexEventKind(item.type);
		this.warnOnce(JSON.stringify([
			"status",
			item.type,
			status
		]), "codex app-server item reported unknown status; continuing projection", {
			itemId: item.id,
			itemType: safeItemType,
			status: safeStatus
		});
	}
	warnUnknownEvent(notification, params) {
		const notificationThreadId = readCodexNotificationThreadId(params);
		const notificationTurnId = readCodexNotificationTurnId(params);
		const eventKind = redactCodexEventKind(notification.method);
		this.warnOnce(JSON.stringify(["method", notification.method]), `codex app-server projector received unknown event kind; continuing: ${eventKind}`, {
			eventKind,
			activeThreadId: this.threadId,
			activeTurnId: this.turnId,
			threadId: notificationThreadId,
			turnId: notificationTurnId,
			matchesActiveThread: notificationThreadId === this.threadId,
			matchesActiveTurn: notificationTurnId === this.turnId
		});
	}
	warnOnce(key, message, context) {
		if (this.warningKeys.has(key)) return;
		this.warningKeys.add(key);
		embeddedAgentLog.warn(message, context);
	}
};
//#endregion
//#region extensions/codex/src/app-server/turn-router.ts
/** Keyed routing for all turn traffic on one shared Codex app-server client. */
const DEFAULT_PREBIND_NOTIFICATION_LIMIT = 256;
const DEFAULT_GLOBAL_WARNING_LIMIT = 32;
const CODEX_APP_SERVER_NATIVE_TURN_WAIT_TIMEOUT_MS = 3e4;
const routers = /* @__PURE__ */ new WeakMap();
function hasCodexAppServerSiblingRouteWork(client, threadId) {
	return routers.get(client)?.hasSiblingWork(threadId) ?? false;
}
/** Returns the sole router installed on a physical app-server client. */
function getCodexAppServerTurnRouter(client) {
	const existing = routers.get(client);
	if (existing) return existing;
	const router = new ClientTurnRouter(client);
	routers.set(client, router);
	return router;
}
var ClientTurnRouter = class {
	hasSiblingWork(threadId) {
		for (const routedThreadId of this.routes.keys()) if (routedThreadId !== threadId) return true;
		for (const watchedThreadId of this.nativeTurnCompletionWatchers.keys()) if (watchedThreadId !== threadId) return true;
		return false;
	}
	constructor(client) {
		this.routes = /* @__PURE__ */ new Map();
		this.globalWarnings = [];
		this.nativeTurnCompletionWatchers = /* @__PURE__ */ new Map();
		client.addNotificationHandler((notification) => this.routeNotification(notification));
		client.addRequestHandler((request, signal, setExecutionTimeoutMs) => this.routeRequest(request, signal, setExecutionTimeoutMs));
		client.addCloseHandler((closedClient) => this.dispose(closedClient.getCloseError()));
	}
	reserveThread(options) {
		this.assertActive();
		const threadId = requireId(options.threadId, "thread id");
		if (this.routes.has(threadId)) throw new Error(`codex app-server thread route already reserved: ${threadId}`);
		const route = {
			threadId,
			controller: new AbortController(),
			ended: createDeferred(),
			activated: createDeferred(),
			gate: "open",
			pending: this.globalWarnings.map((notification) => ({
				notification,
				receivedAtMs: Date.now(),
				scope: { threadId }
			})),
			notificationTail: Promise.resolve(),
			completedNativeTurnIds: /* @__PURE__ */ new Set(),
			ignoredTurnNotificationKeys: /* @__PURE__ */ new Set()
		};
		this.routes.set(threadId, route);
		if (options.onNotification || options.onRequest) this.activateNow(route, options);
		const releaseOn = options.releaseOn;
		if (releaseOn) {
			const release = () => this.release(route, abortReason(releaseOn));
			releaseOn.addEventListener("abort", release, { once: true });
			route.detachReleaseOn = () => releaseOn.removeEventListener("abort", release);
			if (releaseOn.aborted) release();
		}
		return {
			threadId,
			signal: route.controller.signal,
			get observedNativeTurnId() {
				return route.observedNativeTurn?.id;
			},
			get completed() {
				return Boolean(route.turnId && route.completedNativeTurnIds.has(route.turnId));
			},
			activate: (handlers) => this.activate(route, handlers),
			armTurn: () => this.armTurn(route),
			bindTurn: (turnId, bindingOptions) => this.bindTurn(route, turnId, bindingOptions),
			cancelTurn: () => this.cancelTurn(route),
			drain: () => this.waitForNotifications(route),
			release: () => this.release(route)
		};
	}
	watchNativeTurnCompletion(options) {
		this.assertActive();
		const threadId = requireId(options.threadId, "thread id");
		const turnId = requireId(options.turnId, "turn id");
		if (options.signal?.aborted) return {
			completion: Promise.resolve(false),
			state: "unconfirmed",
			settledSignal: AbortSignal.abort(),
			cancel: () => {}
		};
		if (this.routes.get(threadId)?.completedNativeTurnIds.has(turnId)) return {
			completion: Promise.resolve(true),
			state: "confirmed",
			settledSignal: AbortSignal.abort(),
			cancel: () => {}
		};
		const { promise: completion, resolve: settle } = createDeferred();
		const settlement = new AbortController();
		const watchers = this.nativeTurnCompletionWatchers.get(threadId) ?? /* @__PURE__ */ new Set();
		this.nativeTurnCompletionWatchers.set(threadId, watchers);
		let state = "pending";
		const finish = (completed) => {
			if (state !== "pending") return;
			state = completed ? "confirmed" : "unconfirmed";
			watchers.delete(watcher);
			if (watchers.size === 0) this.nativeTurnCompletionWatchers.delete(threadId);
			clearTimeout(timeout);
			options.signal?.removeEventListener("abort", abort);
			settlement.abort();
			settle(completed);
		};
		const watcher = {
			turnId,
			finish,
			onStarted: options.onStarted
		};
		watchers.add(watcher);
		const timeout = setTimeout(() => finish(false), Math.max(1, options.timeoutMs));
		timeout.unref?.();
		const abort = () => finish(false);
		options.signal?.addEventListener("abort", abort, { once: true });
		return {
			completion,
			settledSignal: settlement.signal,
			get state() {
				return state;
			},
			cancel: () => finish(false)
		};
	}
	dispose(cause) {
		if (this.closeError) return;
		const closeError = cause ? new Error("codex app-server turn router closed", { cause }) : /* @__PURE__ */ new Error("codex app-server turn router closed");
		this.closeError = closeError;
		for (const route of this.routes.values()) this.release(route, closeError);
		for (const watchers of this.nativeTurnCompletionWatchers.values()) for (const watcher of watchers) watcher.finish(false);
	}
	async activate(route, handlers) {
		this.assertRoute(route);
		this.activateNow(route, handlers);
		await this.waitForNotifications(route);
		this.assertRoute(route);
	}
	activateNow(route, handlers) {
		if (route.handlers) throw new Error(`codex app-server thread route already activated: ${route.threadId}`);
		this.assertRoute(route);
		if (!handlers.onNotification && !handlers.onRequest) throw new Error("codex app-server thread route requires a notification or request handler");
		route.handlers = {
			onRequest: handlers.onRequest && AsyncResource.bind(handlers.onRequest),
			onNotification: handlers.onNotification && AsyncResource.bind(handlers.onNotification),
			onNotificationReceived: handlers.onNotificationReceived && AsyncResource.bind(handlers.onNotificationReceived, void 0, handlers)
		};
		if (!handlers.onNotification) route.pending.length = 0;
		else if (route.gate !== "armed") this.flushNotifications(route);
		route.activated.resolve();
	}
	armTurn(route) {
		this.assertRoute(route);
		if (route.gate !== "open") throw new Error(`codex app-server thread route cannot arm from ${route.gate}`);
		route.gate = "armed";
		route.ignoredTurnNotificationKeys.clear();
		route.completedNativeTurnIds.clear();
		if (route.observedNativeTurn?.completed) route.observedNativeTurn = void 0;
		route.binding = createDeferred();
	}
	async cancelTurn(route) {
		if (route.released || route.gate !== "armed") return;
		route.gate = "open";
		route.binding?.resolve();
		route.binding = void 0;
		this.flushNotifications(route);
		await this.waitForNotifications(route);
		this.assertRoute(route);
	}
	async bindTurn(route, turnIdInput, options) {
		const turnId = requireId(turnIdInput, "turn id");
		if (options?.completed && route.gate === "armed" && (!route.released || route.released === this.closeError)) route.completedNativeTurnIds.add(turnId);
		this.assertRoute(route, route.gate === "armed" ? turnId : void 0);
		if (!route.handlers) throw new Error("codex app-server thread route must be activated before binding a turn");
		if (route.gate !== "armed") throw new Error(`codex app-server thread route cannot bind from ${route.gate}`);
		route.gate = "bound";
		route.turnId = turnId;
		if (options?.beforeNotifications) {
			route.notificationPause = options.beforeNotifications.then(() => {
				route.notificationPause = void 0;
				this.flushNotifications(route);
			}, (cause) => {
				const error = new Error("codex app-server notification barrier failed", { cause });
				this.release(route, error);
				throw error;
			});
			route.notificationPause.catch(() => {});
		}
		this.flushNotifications(route);
		route.binding?.resolve();
		await this.waitForNotifications(route);
		this.assertRoute(route, turnId);
		await route.notificationPause;
		await route.notificationTail;
	}
	routeNotification(notification) {
		if (this.closeError) return;
		const scope = readScope(notification.params);
		if (!scope.threadId && (notification.method === "configWarning" || notification.method === "warning")) {
			if (this.globalWarnings.length === DEFAULT_GLOBAL_WARNING_LIMIT) this.globalWarnings.shift();
			this.globalWarnings.push(notification);
			for (const route of this.routes.values()) {
				this.bufferNotification(route, notification, { threadId: route.threadId }, Date.now());
				if (route.gate === "bound") this.flushNotifications(route);
			}
			return Promise.all([...this.routes.values()].map((route) => this.waitForNotifications(route))).then(() => void 0);
		}
		const watchers = scope.threadId ? this.nativeTurnCompletionWatchers.get(scope.threadId) : void 0;
		const route = scope.threadId ? this.routes.get(scope.threadId) : void 0;
		if (!watchers && !route) return;
		const completedTurn = notification.method === "turn/completed" && readCodexTurnCompletedNotification(notification.params) !== void 0;
		if (scope.turnId && watchers) {
			for (const watcher of watchers) if (watcher.turnId === scope.turnId && completedTurn) watcher.finish(true);
			else if (watcher.turnId === scope.turnId && notification.method === "turn/started") watcher.onStarted?.();
		}
		if (!route) return;
		const routeScope = {
			threadId: route.threadId,
			...scope.turnId ? { turnId: scope.turnId } : {}
		};
		const receivedAtMs = Date.now();
		if (scope.turnId && (route.gate !== "bound" || scope.turnId === route.turnId)) {
			if (notification.method === "turn/started") {
				route.completedNativeTurnIds.delete(scope.turnId);
				route.observedNativeTurn = {
					id: scope.turnId,
					completed: false
				};
			} else if (completedTurn) {
				if (route.gate === "bound") route.completedNativeTurnIds.clear();
				route.completedNativeTurnIds.add(scope.turnId);
				if (!route.observedNativeTurn || route.observedNativeTurn.completed || route.observedNativeTurn.id === scope.turnId) route.observedNativeTurn = {
					id: scope.turnId,
					completed: true
				};
			}
		}
		if (!route.handlers) {
			this.bufferNotification(route, notification, routeScope, receivedAtMs);
			return;
		}
		const handler = route.handlers.onNotification;
		if (!handler) return;
		if (route.gate === "bound" && scope.turnId && scope.turnId !== route.turnId) {
			this.warnDroppedStaleTurnNotification(route, notification, routeScope);
			return;
		}
		if (route.gate === "armed" || route.notificationPause) {
			this.bufferNotification(route, notification, routeScope, receivedAtMs);
			return;
		}
		route.handlers.onNotificationReceived?.(notification, routeScope, receivedAtMs);
		this.enqueueNotification(route, handler, notification, routeScope);
		return route.notificationTail;
	}
	async routeRequest(request, signal = new AbortController().signal, setExecutionTimeoutMs) {
		if (this.closeError || signal.aborted) return;
		const scope = readScope(request.params);
		if (!scope.threadId) return;
		const route = this.routes.get(scope.threadId);
		if (!route) return;
		const requestSignal = AbortSignal.any([signal, route.controller.signal]);
		if (!route.handlers && !await waitForPromiseOrAbort(route.activated.promise, requestSignal)) return;
		if (requestSignal.aborted || !route.handlers) return;
		const handler = route.handlers.onRequest;
		if (!handler) return;
		while (route.gate === "armed") {
			const binding = route.binding?.promise;
			if (!binding || !await waitForPromiseOrAbort(binding, requestSignal)) return;
			if (requestSignal.aborted) return;
		}
		if (route.gate === "bound" && scope.turnId && scope.turnId !== route.turnId) return;
		if (!await waitForPromiseOrAbort(this.waitForNotifications(route), requestSignal)) return;
		if (requestSignal.aborted) return;
		try {
			const result = await handler(request, {
				threadId: scope.threadId,
				...scope.turnId ? { turnId: scope.turnId } : {}
			}, requestSignal, setExecutionTimeoutMs && ((timeoutMs) => {
				if (!requestSignal.aborted) setExecutionTimeoutMs(timeoutMs);
			}));
			return requestSignal.aborted ? void 0 : result;
		} catch (error) {
			if (requestSignal.aborted) return;
			throw error;
		}
	}
	flushNotifications(route) {
		const handler = route.handlers?.onNotification;
		if (!handler) return;
		for (const pending of route.pending.splice(0)) {
			if (route.gate !== "bound" && (pending.notification.method === "configWarning" || pending.notification.method === "warning" && !readScope(pending.notification.params).threadId)) {
				route.pending.push(pending);
				continue;
			}
			if (route.gate === "bound" && pending.scope.turnId && pending.scope.turnId !== route.turnId) {
				this.warnDroppedStaleTurnNotification(route, pending.notification, pending.scope);
				continue;
			}
			this.observeNotificationReceipt(route, pending);
			if (route.notificationPause) route.pending.push(pending);
			else this.enqueueNotification(route, handler, pending.notification, pending.scope);
		}
	}
	observeNotificationReceipt(route, pending) {
		if (pending.receiptObserved) return;
		pending.receiptObserved = true;
		route.handlers?.onNotificationReceived?.(pending.notification, pending.scope, pending.receivedAtMs);
	}
	warnDroppedStaleTurnNotification(route, notification, scope) {
		if (notification.method === "turn/completed" || !scope.turnId || !route.turnId) return;
		const eventKind = redactCodexEventKind(notification.method);
		const key = JSON.stringify([notification.method, scope.turnId]);
		if (route.ignoredTurnNotificationKeys.has(key)) return;
		route.ignoredTurnNotificationKeys.add(key);
		embeddedAgentLog.warn("codex app-server notification ignored for inactive turn", {
			eventKind,
			activeThreadId: route.threadId,
			activeTurnId: route.turnId,
			threadId: scope.threadId,
			turnId: scope.turnId,
			matchesActiveThread: true,
			matchesActiveTurn: false
		});
	}
	bufferNotification(route, notification, scope, receivedAtMs) {
		const pending = {
			notification,
			receivedAtMs,
			scope
		};
		if (route.gate === "bound") this.observeNotificationReceipt(route, pending);
		if (route.pending.length < DEFAULT_PREBIND_NOTIFICATION_LIMIT) {
			route.pending.push(pending);
			return;
		}
		const error = /* @__PURE__ */ new Error(`codex app-server pre-bind notification buffer exceeded ${DEFAULT_PREBIND_NOTIFICATION_LIMIT} entries for thread ${route.threadId}`);
		embeddedAgentLog.warn(error.message);
		this.release(route, error);
	}
	enqueueNotification(route, handler, notification, scope) {
		if (route.released && !this.canDrainClosedTurn(route, route.turnId)) return;
		route.notificationTail = route.notificationTail.then(() => handler(notification, scope)).catch((error) => {
			if (!route.released) embeddedAgentLog.warn("codex app-server keyed notification handler failed", {
				method: notification.method,
				threadId: route.threadId,
				turnId: route.turnId,
				error
			});
		});
	}
	async waitForNotifications(route) {
		if (route.notificationPause) await Promise.race([route.notificationPause, route.ended.promise]);
		await Promise.race([route.notificationTail, route.ended.promise]);
	}
	release(route, error = /* @__PURE__ */ new Error("codex app-server thread route is released")) {
		if (route.released) return;
		route.released = error;
		if (error !== this.closeError) route.pending.length = 0;
		route.ended.resolve();
		route.activated.resolve();
		route.binding?.resolve();
		route.detachReleaseOn?.();
		route.controller.abort(error);
		if (this.routes.get(route.threadId) === route) this.routes.delete(route.threadId);
	}
	assertActive() {
		if (this.closeError) throw new Error("codex app-server turn router is closed");
	}
	canDrainClosedTurn(route, turnId) {
		return Boolean(this.closeError && route.released === this.closeError && turnId && route.completedNativeTurnIds.has(turnId));
	}
	assertRoute(route, completedTurnId) {
		if (route.released && !this.canDrainClosedTurn(route, completedTurnId)) throw route.released;
	}
};
function readScope(value) {
	if (!isJsonObject(value)) return {};
	const threadId = readCodexNotificationThreadId(value);
	const turnId = readCodexNotificationTurnId(value);
	return {
		...threadId ? { threadId } : {},
		...turnId ? { turnId } : {}
	};
}
function requireId(value, label) {
	const normalized = value.trim();
	if (!normalized) throw new Error(`codex app-server ${label} must not be empty`);
	return normalized;
}
//#endregion
//#region extensions/codex/src/app-server/attempt-client-cleanup.ts
/**
* Best-effort cleanup helpers for Codex app-server startup attempts and turns.
*/
var attempt_client_cleanup_exports = /* @__PURE__ */ __exportAll({
	CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS: () => CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS,
	CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS: () => CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS,
	CodexAppServerUnsafeSubscriptionError: () => CodexAppServerUnsafeSubscriptionError,
	assertCodexThreadResumeSubscription: () => assertCodexThreadResumeSubscription,
	closeCodexStartupClientBestEffort: () => closeCodexStartupClientBestEffort,
	interruptCodexTurnAndWaitBestEffort: () => interruptCodexTurnAndWaitBestEffort,
	isCodexAppServerUnsafeSubscriptionError: () => isCodexAppServerUnsafeSubscriptionError,
	isCodexNoActiveTurnInterruptError: () => isCodexNoActiveTurnInterruptError,
	retireUnsafeCodexTurnClientBestEffort: () => retireUnsafeCodexTurnClientBestEffort,
	shouldRetireCodexStartupClient: () => shouldRetireCodexStartupClient,
	terminateCodexBackgroundTerminals: () => terminateCodexBackgroundTerminals,
	unsubscribeCodexThreadBestEffort: () => unsubscribeCodexThreadBestEffort
});
/** Timeout for best-effort app-server turn interruption during cleanup. */
const CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS = 5e3;
/** Timeout for best-effort thread unsubscribe during cleanup. */
const CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS = 5e3;
const CODEX_NO_ACTIVE_TURN_ERROR_CODE = -32600;
const CODEX_NO_ACTIVE_TURN_ERROR_MESSAGE = "no active turn to interrupt";
/** Codex also reports this before an accepted turn publishes its start event. */
function isCodexNoActiveTurnInterruptError(error) {
	return error instanceof CodexAppServerRpcError && error.code === CODEX_NO_ACTIVE_TURN_ERROR_CODE && error.message === CODEX_NO_ACTIVE_TURN_ERROR_MESSAGE;
}
/** Raised when a thread subscription may be live on a client OpenClaw no longer controls. */
var CodexAppServerUnsafeSubscriptionError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "CodexAppServerUnsafeSubscriptionError";
	}
};
function isCodexAppServerUnsafeSubscriptionError(error) {
	return error instanceof CodexAppServerUnsafeSubscriptionError;
}
/** Asserts Codex resumed the exact thread this attempt subscribed to. */
function assertCodexThreadResumeSubscription(requestedThreadId, returnedThreadId) {
	if (returnedThreadId !== requestedThreadId) throw new CodexAppServerUnsafeSubscriptionError(`Codex thread/resume returned ${returnedThreadId} for ${requestedThreadId}`);
}
async function closeCodexStartupClientBestEffort(client) {
	if (!client) return;
	const retiredSharedClient = retireSharedCodexAppServerClientIfCurrent(client);
	if (!retiredSharedClient || retiredSharedClient.closed) await client.closeAndWait();
}
/** Retires an unsafe turn client without replacing an already-authoritative failure. */
async function retireUnsafeCodexTurnClientBestEffort(client, operation) {
	try {
		await closeCodexStartupClientBestEffort(client);
	} catch (error) {
		embeddedAgentLog.debug("codex app-server unsafe turn client retirement failed", {
			operation,
			error
		});
		try {
			client.close();
		} catch (closeError) {
			embeddedAgentLog.debug("codex app-server unsafe turn client close failed", {
				operation,
				error: closeError
			});
		}
	}
}
/** Sends a bounded turn interrupt and waits for Codex to confirm terminal abort handling. */
async function interruptCodexTurnAndWaitBestEffort(client, params) {
	const timeoutMs = params.timeoutMs && Number.isFinite(params.timeoutMs) && params.timeoutMs > 0 ? params.timeoutMs : CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS;
	const requestParams = {
		threadId: params.threadId,
		turnId: params.turnId
	};
	let cancelWatch;
	try {
		if (!params.turnId) {
			await client.request("turn/interrupt", requestParams, { timeoutMs });
			return true;
		}
		const deadline = Date.now() + timeoutMs;
		const started = createDeferred();
		const completion = getCodexAppServerTurnRouter(client).watchNativeTurnCompletion({
			threadId: params.threadId,
			turnId: params.turnId,
			timeoutMs,
			onStarted: () => started.resolve(true)
		});
		cancelWatch = completion.cancel;
		if (completion.state !== "pending") return await completion.completion;
		const requestInterrupt = async () => {
			try {
				await client.request("turn/interrupt", requestParams, {
					timeoutMs: Math.max(1, deadline - Date.now()),
					signal: completion.settledSignal
				});
				return true;
			} catch (error) {
				if (completion.state === "confirmed") return true;
				if (isCodexNoActiveTurnInterruptError(error)) return false;
				throw error;
			}
		};
		if (!await requestInterrupt()) {
			if (await Promise.race([completion.completion.then(() => false), started.promise]) && completion.state === "pending" && Date.now() < deadline) await requestInterrupt();
		}
		return await completion.completion;
	} catch (error) {
		embeddedAgentLog.debug("codex app-server turn interrupt failed during abort", { error });
		return false;
	} finally {
		cancelWatch?.();
	}
}
/** Stops native terminals on the cancelled thread without retiring peer threads. */
async function terminateCodexBackgroundTerminals(client, threadId, oneShotCliRun = false, waitForNativeItems) {
	const options = {
		timeoutMs: CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS,
		signal: AbortSignal.timeout(CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS)
	};
	try {
		const { data } = await client.request("thread/backgroundTerminals/list", { threadId }, options);
		for (const { processId } of data) await client.request("thread/backgroundTerminals/terminate", {
			threadId,
			processId
		}, options);
		if (data.length > 0) {
			if ((await client.request("thread/backgroundTerminals/list", {
				threadId,
				limit: 1
			}, options)).data.length > 0) throw new Error("native background terminals remain running");
			if (oneShotCliRun) throw new Error("native terminal termination did not confirm process cleanup");
		}
		await waitForNativeItems?.(options.signal);
	} catch (cause) {
		throw new Error("Codex background-terminal cleanup failed; inspect the thread's running terminals before starting more work.", { cause });
	}
}
/** Unsubscribes from a thread while swallowing cleanup-only failures. */
async function unsubscribeCodexThreadBestEffort(client, params) {
	try {
		await unsubscribeCodexAppServerLiveThread(client, params.threadId, params.timeoutMs, params.assertCurrent);
		return true;
	} catch (error) {
		params.assertCurrent?.();
		embeddedAgentLog.debug("codex app-server thread unsubscribe cleanup failed", {
			threadId: params.threadId,
			error
		});
		return false;
	}
}
function shouldRetireCodexStartupClient(error, spawnedBy, signal) {
	if (signal.aborted || isCodexAppServerStartupError(error) || isCodexAppServerRequestTimeoutError(error)) return true;
	return !isCodexAppServerStartSelectionChangedError(error) && !isCodexAppServerOverloadError(error) && !(error instanceof AgentHarnessPreflightError && error.scope === void 0) && (isCodexAppServerBrokenPipeError(error) || !spawnedBy);
}
//#endregion
export { CodexProjectionDiagnostics as _, attempt_client_cleanup_exports as a, readCodexNotificationTurnId as b, isCodexAppServerUnsafeSubscriptionError as c, shouldRetireCodexStartupClient as d, terminateCodexBackgroundTerminals as f, hasCodexAppServerSiblingRouteWork as g, getCodexAppServerTurnRouter as h, assertCodexThreadResumeSubscription as i, isCodexNoActiveTurnInterruptError as l, CODEX_APP_SERVER_NATIVE_TURN_WAIT_TIMEOUT_MS as m, CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS as n, closeCodexStartupClientBestEffort as o, unsubscribeCodexThreadBestEffort as p, CodexAppServerUnsafeSubscriptionError as r, interruptCodexTurnAndWaitBestEffort as s, CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS as t, retireUnsafeCodexTurnClientBestEffort as u, isCodexNotificationForTurn as v, readCodexNotificationThreadId as y };
