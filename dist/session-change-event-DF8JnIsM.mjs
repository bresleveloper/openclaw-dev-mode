import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { _ as bumpGatewayAccessRevision } from "./operator-role-policy-BNrKHiJ3.mjs";
import { i as resolveSessionEventAgentScope, t as resolvePrivateSessionEventBroadcastScope } from "./session-request-agent-DN7PUqhR.mjs";
import { i as resolveSessionStoreKey } from "./session-store-key-BoleEY7N.mjs";
import { k as invalidateSessionSharingSnapshot } from "./session-sharing-C4w_but1.mjs";
import { i as resolveVisibleActiveSessionRunState } from "./session-active-runs-KvOWXexj.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-Bb2a_cNt.mjs";
import { t as hasSessionChangeReceivers } from "./session-change-receivers-D02Dxvte.mjs";
import { t as buildGatewaySessionSnapshot } from "./session-event-payload-ErYjRK47.mjs";
//#region src/gateway/server-methods/session-change-event.ts
const SESSIONS_CHANGED_DEBOUNCE_MS = 100;
const SESSIONS_CHANGED_MAX_WAIT_MS = 500;
const log = createSubsystemLogger("gateway/session-events");
const sessionChangeOwners = /* @__PURE__ */ new WeakMap();
const pendingSessionChanges = /* @__PURE__ */ new Set();
function ownerFor(context) {
	let owner = sessionChangeOwners.get(context);
	if (!owner) {
		owner = { pending: /* @__PURE__ */ new Map() };
		sessionChangeOwners.set(context, owner);
	}
	return owner;
}
function registerPendingLifetime(owner) {
	owner.unregister ??= owner.registerStop?.();
}
/** The Gateway sidecar owner admits late work until its existing shutdown seal. */
function attachSessionChangeEventLifetime(context, registerStop) {
	const owner = ownerFor(context);
	if (owner.registerStop && owner.registerStop !== registerStop) throw new Error("Session changes already belong to a Gateway lifetime");
	owner.registerStop = registerStop;
	if (owner.pending.size > 0) registerPendingLifetime(owner);
}
function sessionChangeKey(cfg, payload, scope) {
	const routingAgentId = scope?.[1];
	const key = payload.sessionKey && routingAgentId ? resolveSessionStoreKey({
		cfg,
		sessionKey: payload.sessionKey,
		storeAgentId: routingAgentId
	}) : payload.sessionKey ?? "";
	return `${routingAgentId ?? payload.agentId ?? ""}\0${key}`;
}
function snapshotTarget(payload, scope) {
	return payload.reason !== "delete" && payload.sessionKey && scope?.[1] && (scope[0] || scope[2] || parseAgentSessionKey(payload.sessionKey)) ? {
		key: payload.sessionKey,
		agentId: scope[1]
	} : void 0;
}
function broadcastSessionsChanged(context, payload, scope, includeSnapshot = true) {
	const connIds = context.getSessionEventSubscriberConnIds();
	if (!hasSessionChangeReceivers(connIds)) return;
	if (scope === null) return;
	const [eventAgentId, routingAgentId, compatibilityOwnerAgentId] = scope;
	const routingOptions = {
		...routingAgentId ? { agentId: routingAgentId } : {},
		dropIfSlow: true
	};
	const eventPayload = {
		...payload,
		...eventAgentId ? { agentId: eventAgentId } : {},
		ts: Date.now()
	};
	if (!includeSnapshot) {
		if (payload.sessionKey) context.broadcastToConnIds("sessions.changed", {
			...eventPayload,
			...routingAgentId ? {
				sessionKey: resolveSessionStoreKey({
					cfg: context.getRuntimeConfig(),
					sessionKey: payload.sessionKey,
					storeAgentId: routingAgentId
				}),
				agentId: routingAgentId
			} : {}
		}, /* @__PURE__ */ new Set(), routingOptions);
		context.broadcastToConnIds("sessions.changed", {
			reason: "update",
			...routingAgentId ? { agentId: routingAgentId } : {},
			...payload.catalogChanged ? { catalogChanged: true } : {},
			ts: eventPayload.ts
		}, connIds, routingOptions);
		return;
	}
	const broadcastOptions = {
		...routingOptions,
		...resolvePrivateSessionEventBroadcastScope(payload.sessionKey, scope)
	};
	const query = snapshotTarget(payload, scope);
	if (!query) {
		context.broadcastToConnIds("sessions.changed", eventPayload, connIds, broadcastOptions);
		return;
	}
	const projection = getSessionRowProjection(context);
	const currentRow = projection?.snapshot(query).row;
	const sessionRow = payload.sessionId && payload.sessionId !== currentRow?.sessionId ? null : currentRow;
	const activeRunState = sessionRow && (sessionRow.key !== "global" || routingAgentId !== void 0) ? resolveVisibleActiveSessionRunState({
		context,
		requestedKey: payload.sessionKey ?? sessionRow.key,
		canonicalKey: sessionRow.key,
		sessionId: sessionRow.sessionId,
		agentId: routingAgentId,
		defaultAgentId: compatibilityOwnerAgentId,
		projectedAgentRunIndex: projection?.state.rowContext.projectedAgentRuns
	}) : null;
	context.broadcastToConnIds("sessions.changed", {
		...eventPayload,
		...sessionRow ? {
			...buildGatewaySessionSnapshot({
				sessionRow,
				includeSession: true,
				agentId: eventAgentId,
				activeRunState
			}),
			...context.workerSessionPlacementService ? {
				placement: sessionRow.placement ?? null,
				placementMove: sessionRow.placementMove ?? null
			} : {}
		} : {}
	}, connIds, {
		...broadcastOptions,
		...sessionRow?.key ? { sessionKeys: [sessionRow.key] } : {}
	});
}
function releasePendingSessionChange(pending) {
	pendingSessionChanges.delete(pending);
	pending.owner.pending.delete(pending.key);
	if (pending.owner.pending.size === 0) {
		pending.owner.unregister?.();
		pending.owner.unregister = void 0;
	}
}
function captureSessionChange(context, payload, scope, key) {
	const change = {
		key,
		payload,
		scope
	};
	const query = snapshotTarget(payload, scope);
	try {
		change.captured = query ? getSessionRowProjection(context)?.capture(query) : void 0;
	} catch (error) {
		change.captureFailed = true;
		log.warn("Session change capture failed", { error });
	}
	return change;
}
async function publishSessionChange(context, change) {
	const { payload, scope, captured } = change;
	const projection = getSessionRowProjection(context);
	const query = snapshotTarget(payload, scope);
	let publicationStarted = false;
	const broadcast = (includeSnapshot = true) => {
		publicationStarted = true;
		broadcastSessionsChanged(context, payload, scope, includeSnapshot);
	};
	try {
		if (change.captureFailed) broadcast(false);
		else if (query && projection) {
			if ((await projection.withPreparedExactRows(() => [query], () => {
				broadcast(!captured || projection.isCurrent(captured));
			}, { includeAncestors: true })).kind !== "complete") broadcast(false);
		} else broadcast();
	} catch (error) {
		if (publicationStarted) throw error;
		log.warn("Session change preparation failed", { error });
		broadcast(false);
	}
}
function startPendingSessionChange(pending, leading) {
	if (pending.work) return;
	pending.work = Promise.resolve().then(async () => {
		if (leading) await publishSessionChange(pending.context, leading);
		while (pending.due) {
			const next = pending.oldestTombstone ?? pending.latest;
			if (next) {
				if (pending.oldestTombstone === next) pending.oldestTombstone = void 0;
				if (pending.latest === next) pending.latest = void 0;
				await publishSessionChange(pending.context, next);
			} else if (pending.refresh) {
				pending.refresh = false;
				broadcastSessionsChanged(pending.context, {
					reason: "update",
					...pending.catalogChanged ? { catalogChanged: true } : {}
				}, pending.scope, false);
			} else break;
		}
	}).catch((error) => {
		log.warn("Session change publication failed", { error });
	}).then(() => {
		pending.work = void 0;
		if (pending.due && (pending.oldestTombstone || pending.latest || pending.refresh)) startPendingSessionChange(pending);
		else if (!pending.timer) releasePendingSessionChange(pending);
	});
}
function finishPendingSessionChange(pending) {
	if (pending.timer) {
		clearTimeout(pending.timer);
		pending.timer = null;
	}
	pending.due = true;
	if (pending.oldestTombstone || pending.latest || pending.refresh) startPendingSessionChange(pending);
	else if (!pending.work) releasePendingSessionChange(pending);
}
/** Flush timers and join publications, including work admitted during the drain. */
async function flushPendingSessionsChangedEvents(context) {
	for (;;) {
		const pending = [...pendingSessionChanges].filter((entry) => !context || entry.context === context);
		if (!pending.length) return;
		pending.forEach(finishPendingSessionChange);
		await Promise.all(pending.flatMap((entry) => entry.work ? [entry.work] : []));
	}
}
function emitSessionsChanged(context, payload, options = {}) {
	const catalogOnly = options.catalogOnly && payload.reason === "groups" && !payload.sessionKey;
	if (!options.preparedPublication && !catalogOnly) sessionChanges.emit(payload.sessionKey ? {
		sessionKey: payload.sessionKey,
		...payload.agentId ? { agentId: payload.agentId } : {}
	} : {
		all: true,
		scope: "sessions"
	});
	if (!catalogOnly && options.accessChanged !== false) bumpGatewayAccessRevision();
	if (!catalogOnly) {
		invalidateSessionSharingSnapshot(payload.sessionKey);
		context.mentionInbox?.invalidate(payload.sessionKey);
	}
	const connIds = context.getSessionEventSubscriberConnIds();
	if (!hasSessionChangeReceivers(connIds)) return;
	const cfg = context.getRuntimeConfig();
	const scope = payload.sessionKey ? resolveSessionEventAgentScope(cfg, payload.sessionKey, payload.agentId) : [
		payload.agentId,
		payload.agentId,
		void 0
	];
	if (options.preparedPublication) return broadcastSessionsChanged(context, payload, scope);
	const publicationKey = sessionChangeKey(cfg, payload, scope);
	const key = JSON.stringify([
		scope,
		payload.reason === "delete",
		payload.sessionId,
		payload.compacted
	]);
	const owner = ownerFor(context);
	const pending = owner.pending.get(publicationKey);
	if (pending) {
		pending.scope = scope;
		pending.catalogChanged ||= payload.catalogChanged === true;
		const latestPayload = {
			...payload,
			...pending.catalogChanged ? { catalogChanged: true } : {}
		};
		if (pending.latest?.key === key) {
			const next = captureSessionChange(context, latestPayload, scope, key);
			pending.latest.payload = latestPayload;
			pending.latest.scope = scope;
			pending.latest.captured = next.captured;
			pending.latest.captureFailed = next.captureFailed;
		} else {
			const next = captureSessionChange(context, latestPayload, scope, key);
			if (pending.latest && pending.latest !== pending.oldestTombstone) pending.refresh = true;
			if (payload.reason === "delete") pending.oldestTombstone ??= next;
			pending.latest = next;
		}
		if (pending.due) {
			startPendingSessionChange(pending);
			return;
		}
		pending.firstDeferredAt ??= Date.now();
		if (pending.timer) clearTimeout(pending.timer);
		const maxWaitRemaining = pending.firstDeferredAt + SESSIONS_CHANGED_MAX_WAIT_MS - Date.now();
		pending.timer = setTimeout(() => finishPendingSessionChange(pending), Math.max(0, Math.min(SESSIONS_CHANGED_DEBOUNCE_MS, maxWaitRemaining)));
		pending.timer.unref?.();
		return;
	}
	try {
		registerPendingLifetime(owner);
	} catch (error) {
		log.warn("Session change was not admitted", { error });
		return;
	}
	const next = {
		context,
		owner,
		key: publicationKey,
		scope,
		refresh: false,
		catalogChanged: payload.catalogChanged === true,
		due: false,
		timer: null
	};
	owner.pending.set(publicationKey, next);
	pendingSessionChanges.add(next);
	next.timer = setTimeout(() => finishPendingSessionChange(next), SESSIONS_CHANGED_DEBOUNCE_MS);
	next.timer.unref?.();
	startPendingSessionChange(next, captureSessionChange(context, payload, scope, key));
}
function emitSessionArchived(context, sessionKey, agentId) {
	if (!sessionKey) return;
	emitSessionsChanged(context, {
		sessionKey,
		...agentId ? { agentId } : {},
		reason: "archive"
	});
}
//#endregion
export { flushPendingSessionsChangedEvents as i, emitSessionArchived as n, emitSessionsChanged as r, attachSessionChangeEventLifetime as t };
