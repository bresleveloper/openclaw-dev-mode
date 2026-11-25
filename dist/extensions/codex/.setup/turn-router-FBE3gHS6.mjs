import { E as readCodexNotificationTurnId, T as readCodexNotificationThreadId, v as prepareCodexServerNotification, w as readCodexNotificationScope } from "./client-C7W0Bk1P.mjs";
import { r as isJsonObject } from "./protocol-NX-eGZn-.mjs";
import { n as waitForPromiseOrAbort, t as abortReason } from "./timeout-5P9AqqoE.mjs";
import { g as unknownItemStatus } from "./event-projector-items-BCAkXl87.mjs";
import { materializeErrorStack } from "openclaw/plugin-sdk/error-runtime";
import { AsyncResource } from "node:async_hooks";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-runtime";
import { redactSensitiveText } from "openclaw/plugin-sdk/logging-core";
import { sanitizeTerminalText } from "openclaw/plugin-sdk/text-chunking";
// extensions/codex/src/app-server/event-projector-diagnostics.ts
function redactCodexEventKind(method) {
	return redactSensitiveText(sanitizeTerminalText(method));
}
var CodexProjectionDiagnostics = class {
	constructor(threadId, turnId, emitLiveDiagnostic) {
		this.threadId = threadId;
		this.turnId = turnId;
		this.emitLiveDiagnostic = emitLiveDiagnostic;
		this.warningKeys = /* @__PURE__ */ new Set();
		this.liveCapture = process.env.OPENCLAW_LIVE_TEST === "1";
		this.notificationCount = 0;
	}
	recordNotification(notification, params) {
		if (!this.liveCapture) return;
		const sequence = ++this.notificationCount;
		const item = isJsonObject(params.item) ? params.item : void 0;
		const turn = isJsonObject(params.turn) ? params.turn : void 0;
		const items = item ? [item] : Array.isArray(turn?.items) ? turn.items.slice(-32).filter(isJsonObject) : [];
		const data = {
			phase: "notification",
			sequence,
			method: notification.method.slice(0, 160),
			...Array.isArray(turn?.items) ? {
				nativeItemCount: turn.items.length,
				droppedNativeItems: Math.max(0, turn.items.length - 32)
			} : {},
			...typeof params.itemId === "string" ? { itemId: params.itemId.slice(0, 160) } : {},
			...typeof params.delta === "string" ? { deltaLength: params.delta.length } : {}
		};
		this.emitLiveDiagnostic({
			...data,
			threadId: this.threadId,
			turnId: this.turnId
		});
		for (const entry of items) this.emitLiveDiagnostic({
			...data,
			threadId: this.threadId,
			turnId: this.turnId,
			phase: "native_item",
			itemId: typeof entry.id === "string" ? entry.id.slice(0, 160) : void 0,
			itemType: typeof entry.type === "string" ? entry.type.slice(0, 160) : void 0,
			itemPhase: typeof entry.phase === "string" ? entry.phase.slice(0, 160) : void 0,
			status: typeof entry.status === "string" ? entry.status.slice(0, 160) : void 0,
			delivery: typeof entry.delivery === "string" ? entry.delivery.slice(0, 160) : void 0,
			textLength: typeof entry.text === "string" ? entry.text.length : void 0
		});
	}
	recordNoAnswer(runId, result, turn, finalSourceReplyDelivered) {
		if (!this.liveCapture || result.assistantTexts.some((text) => text.trim())) return;
		const error = result.lastToolError;
		this.emitLiveDiagnostic({
			phase: "no_answer",
			runId,
			threadId: this.threadId,
			turnId: this.turnId,
			nativeStatus: turn?.status,
			classification: result.agentHarnessResultClassification,
			terminalKind: result.terminal.kind,
			terminalSource: result.terminal.kind === "failed" ? result.terminal.source : void 0,
			lastToolName: error?.toolName,
			lastToolErrorCode: error?.errorCode,
			executionStarted: error?.executionStarted,
			mutatingAction: error?.mutatingAction,
			timedOut: error?.timedOut,
			middlewareError: error?.middlewareError,
			toolCount: result.toolMetas.length,
			finalSourceReplyDelivered,
			startedCount: result.itemLifecycle?.startedCount,
			completedCount: result.itemLifecycle?.completedCount,
			activeCount: result.itemLifecycle?.activeCount
		});
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
// extensions/codex/src/app-server/mcp-request-route.ts
/** Subscope of the physical client router; there is no independent connection or registry. */
var CodexMcpRequestRoutes = class {
	constructor() {
		this.routes = /* @__PURE__ */ new Map();
	}
	hasSiblingWork(threadId) {
		return [...this.routes.values()].some((route) => route.threadId !== threadId);
	}
	async run(options, operation) {
		options.signal?.throwIfAborted();
		const key = JSON.stringify([options.threadId, options.serverName]);
		if (this.routes.has(key)) throw new Error("An MCP App call is already pending for this server in the conversation");
		const route = {
			threadId: options.threadId,
			controller: new AbortController(),
			onRequest: AsyncResource.bind(options.onRequest)
		};
		const abort = () => route.controller.abort(options.signal?.reason);
		options.signal?.addEventListener("abort", abort, { once: true });
		this.routes.set(key, route);
		try {
			return await operation();
		} finally {
			options.signal?.removeEventListener("abort", abort);
			this.routes.delete(key);
			route.controller.abort(/* @__PURE__ */ new Error("MCP App call ended"));
		}
	}
	route(request, scope, signal, setExecutionTimeoutMs) {
		if (scope.turnId || request.method !== "mcpServer/elicitation/request" || !isJsonObject(request.params) || typeof request.params.serverName !== "string") return;
		const route = this.routes.get(JSON.stringify([scope.threadId, request.params.serverName]));
		if (!route) return;
		return (async () => {
			const requestSignal = AbortSignal.any([signal, route.controller.signal]);
			requestSignal.throwIfAborted();
			const result = await route.onRequest(request, scope, requestSignal, setExecutionTimeoutMs);
			return requestSignal.aborted ? void 0 : result;
		})();
	}
	close(error) {
		for (const route of this.routes.values()) route.controller.abort(error);
		this.routes.clear();
	}
};
// extensions/codex/src/app-server/turn-router.ts
const DEFAULT_PREBIND_NOTIFICATION_LIMIT = 256;
const DEFAULT_GLOBAL_WARNING_LIMIT = 32;
const CODEX_APP_SERVER_NATIVE_TURN_WAIT_TIMEOUT_MS = 3e4;
const routers = /* @__PURE__ */ new WeakMap();
function hasCodexAppServerSiblingRouteWork(client, threadId) {
	return routers.get(client)?.hasSiblingWork(threadId) ?? false;
}
function getCodexAppServerTurnRouter(client) {
	const existing = routers.get(client);
	if (existing) return existing;
	const router = new ClientTurnRouter(client);
	routers.set(client, router);
	return router;
}
var ClientTurnRouter = class {
	hasSiblingWork(threadId) {
		if (this.mcpRequests.hasSiblingWork(threadId)) return true;
		for (const threads of [this.routes, this.nativeTurnCompletionWatchers]) for (const siblingThreadId of threads.keys()) if (siblingThreadId !== threadId) return true;
		return false;
	}
	constructor(client) {
		this.routes = /* @__PURE__ */ new Map();
		this.mcpRequests = new CodexMcpRequestRoutes();
		this.globalWarnings = [];
		this.nativeTurnCompletionWatchers = /* @__PURE__ */ new Map();
		client.addNotificationHandler((notification) => this.routeNotification(notification));
		client.addRequestHandler((request, signal, setExecutionTimeoutMs) => this.routeRequest(request, signal, setExecutionTimeoutMs));
		client.addCloseHandler((closedClient) => this.dispose(closedClient.getCloseError()));
	}
	async withMcpToolCall(options, run) {
		this.assertActive();
		return await this.mcpRequests.run(options, run);
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
		const confirmed = !options.signal?.aborted && this.routes.get(threadId)?.completedNativeTurnIds.has(turnId) === true;
		if (options.signal?.aborted || confirmed) return {
			completion: Promise.resolve(confirmed),
			state: confirmed ? "confirmed" : "unconfirmed",
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
		materializeErrorStack(closeError);
		this.closeError = closeError;
		this.mcpRequests.close(closeError);
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
	routeNotification(rawNotification) {
		if (this.closeError) return;
		const scope = readCodexNotificationScope(rawNotification.params);
		if (!scope.threadId && (rawNotification.method === "configWarning" || rawNotification.method === "warning")) {
			const notification = prepareCodexServerNotification(rawNotification, scope);
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
		const notification = prepareCodexServerNotification(rawNotification, scope);
		const completedTurn = notification.completedTurn !== void 0;
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
		const scope = readCodexNotificationScope(request.params);
		if (!scope.threadId) return;
		const manual = this.mcpRequests.route(request, {
			threadId: scope.threadId,
			...scope.turnId ? { turnId: scope.turnId } : {}
		}, signal, setExecutionTimeoutMs);
		if (manual) return await manual;
		const route = this.routes.get(scope.threadId);
		if (!route) return;
		const requestSignal = AbortSignal.any([signal, route.controller.signal]);
		if (!route.handlers && !await waitForPromiseOrAbort(route.activated.promise, requestSignal)) return;
		const handler = !requestSignal.aborted && route.handlers?.onRequest;
		if (!handler) return;
		while (route.gate === "armed") {
			const binding = route.binding?.promise;
			if (!binding || !await waitForPromiseOrAbort(binding, requestSignal) || requestSignal.aborted) return;
		}
		if (route.gate === "bound" && scope.turnId && scope.turnId !== route.turnId) return;
		if (!await waitForPromiseOrAbort(this.waitForNotifications(route), requestSignal) || requestSignal.aborted) return;
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
			if (route.gate !== "bound" && (pending.notification.method === "configWarning" || pending.notification.method === "warning" && !readCodexNotificationScope(pending.notification.params).threadId)) {
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
function requireId(value, label) {
	const normalized = value.trim();
	if (!normalized) throw new Error(`codex app-server ${label} must not be empty`);
	return normalized;
}
export { CodexProjectionDiagnostics as i, getCodexAppServerTurnRouter as n, hasCodexAppServerSiblingRouteWork as r, CODEX_APP_SERVER_NATIVE_TURN_WAIT_TIMEOUT_MS as t };
