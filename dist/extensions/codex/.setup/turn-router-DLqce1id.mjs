import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { n as waitForPromiseOrAbort, t as abortReason } from "./timeout-CXOfNoaX.mjs";
import { x as readCodexTurnCompletedNotification } from "./client-BM1XpAkE.mjs";
import { normalizeOptionalString, readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
import { AsyncResource } from "node:async_hooks";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { sanitizeTerminalText } from "openclaw/plugin-sdk/text-chunking";
import { embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-runtime";
import { redactSensitiveText } from "openclaw/plugin-sdk/logging-core";
//#region extensions/codex/src/app-server/event-projector-items.ts
const itemStatuses = /* @__PURE__ */ new Map([
	["completed", "completed"],
	["failed", "failed"],
	["error", "failed"],
	["interrupted", "failed"],
	["declined", "blocked"],
	["inProgress", "running"],
	["in_progress", "running"],
	["running", "running"]
]);
const itemPresentations = /* @__PURE__ */ new Map([
	["dynamicToolCall", {
		kind: "tool",
		title: "Tool"
	}],
	["mcpToolCall", {
		kind: "tool",
		title: "MCP tool",
		projectedTool: true
	}],
	["commandExecution", {
		kind: "command",
		title: "Command",
		toolName: "bash",
		projectedTool: true
	}],
	["fileChange", {
		kind: "patch",
		title: "File change",
		toolName: "apply_patch",
		projectedTool: true
	}],
	["webSearch", {
		kind: "search",
		title: "Web search",
		toolName: "web_search",
		projectedTool: true
	}],
	["contextCompaction", {
		kind: "analysis",
		title: "Context compaction"
	}],
	["reasoning", {
		kind: "analysis",
		title: "Reasoning"
	}]
]);
function matchesCodexSnapshotTurn(item, turnId) {
	const itemTurnId = readStringField(item, "turnId");
	return itemTurnId === void 0 || itemTurnId === turnId;
}
function itemKind(item) {
	return itemPresentations.get(item.type)?.kind;
}
function itemTitle(item) {
	return itemPresentations.get(item.type)?.title ?? item.type;
}
function itemStatus(item) {
	return itemStatuses.get(readStringField(item, "status") ?? "") ?? "completed";
}
function unknownItemStatus(item) {
	const status = readStringField(item, "status");
	return status === void 0 || itemStatuses.has(status) ? void 0 : status;
}
function auditNativeToolTerminalStatus(item) {
	if (item.type === "imageView" || item.type === "sleep") return "completed";
	const status = itemStatuses.get(readStringField(item, "status") ?? "");
	return status === void 0 || status === "running" ? "unknown" : status;
}
function auditNativeToolUnfinishedStatus(item) {
	return item.type === "webSearch" || item.type === "imageGeneration" ? "unknown" : "failed";
}
function isNonSuccessItemStatus(status) {
	return status === "failed" || status === "blocked";
}
function itemName(item) {
	if (item.type === "dynamicToolCall" && typeof item.tool === "string") return item.tool;
	if (item.type === "mcpToolCall" && typeof item.tool === "string") {
		const server = typeof item.server === "string" ? item.server : void 0;
		return server ? `${server}.${item.tool}` : item.tool;
	}
	return itemPresentations.get(item.type)?.toolName;
}
function auditNativeToolName(item) {
	if (item.type === "dynamicToolCall") return;
	const progressName = itemName(item);
	if (progressName) return progressName;
	if (item.type === "collabAgentToolCall") return typeof item.tool === "string" && item.tool.trim() ? `collab.${item.tool.trim()}` : "collab_agent";
	if (item.type === "imageGeneration") return "image_generation";
	if (item.type === "imageView") return "image_view";
	if (item.type === "sleep") return "sleep";
}
function isSideEffectingNativeToolItem(item) {
	return itemStatus(item) !== "blocked" && (isMutatingNativeToolItem(item) || item.type === "mcpToolCall");
}
function isProjectedNativeToolItem(item) {
	return itemPresentations.get(item.type)?.projectedTool === true;
}
function isMutatingNativeToolItem(item) {
	if (item.type === "commandExecution") return true;
	return item.type === "fileChange" || item.type === "collabAgentToolCall" || item.type === "imageGeneration";
}
function shouldClearTerminalPresentationForNativeItem(item) {
	switch (item.type) {
		case "collabAgentToolCall":
		case "commandExecution":
		case "fileChange":
		case "imageGeneration":
		case "imageView":
		case "mcpToolCall":
		case "webSearch": return true;
		default: return false;
	}
}
//#endregion
//#region extensions/codex/src/app-server/notification-correlation.ts
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
function readCodexNotificationTurnId(record) {
	return (isJsonObject(record.turn) ? normalizeOptionalString(record.turn.id) : void 0) ?? normalizeOptionalString(record.turnId);
}
function readCodexNotificationScope(value) {
	if (!isJsonObject(value)) return {};
	const threadId = readCodexNotificationThreadId(value);
	const turnId = readCodexNotificationTurnId(value);
	return {
		...threadId ? { threadId } : {},
		...turnId ? { turnId } : {}
	};
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
//#region extensions/codex/src/app-server/mcp-request-route.ts
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
//#endregion
//#region extensions/codex/src/app-server/turn-router.ts
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
	routeNotification(notification) {
		if (this.closeError) return;
		const scope = readCodexNotificationScope(notification.params);
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
//#endregion
export { itemStatus as _, isCodexNotificationForTurn as a, shouldClearTerminalPresentationForNativeItem as b, auditNativeToolName as c, isMutatingNativeToolItem as d, isNonSuccessItemStatus as f, itemName as g, itemKind as h, CodexProjectionDiagnostics as i, auditNativeToolTerminalStatus as l, isSideEffectingNativeToolItem as m, getCodexAppServerTurnRouter as n, readCodexNotificationThreadId as o, isProjectedNativeToolItem as p, hasCodexAppServerSiblingRouteWork as r, readCodexNotificationTurnId as s, CODEX_APP_SERVER_NATIVE_TURN_WAIT_TIMEOUT_MS as t, auditNativeToolUnfinishedStatus as u, itemTitle as v, unknownItemStatus as x, matchesCodexSnapshotTurn as y };
