import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { d as getAgentRunLifecycleGeneration } from "./agent-run-registry-DO6Dg2r0.mjs";
import { h as registerAgentEventLifecycleRotationHandler, l as getAgentEventLifecycleGeneration } from "./agent-events-BOSJcayE.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { c as captureActiveCronManagementAuthority } from "./cron-creator-authority-context-DhhZn7kB.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/subagents/requester-cron-authority.ts
const state$1 = resolveGlobalSingleton(Symbol.for("openclaw.subagents.requesterCronAuthority"), () => ({
	byEntry: /* @__PURE__ */ new WeakMap(),
	bySession: /* @__PURE__ */ new Map()
}), (value) => {
	for (const entries of value.bySession.values()) for (const entry of entries) entry.active = false;
	value.byEntry = /* @__PURE__ */ new WeakMap();
	value.bySession.clear();
});
function discard(authority) {
	authority.active = false;
	for (const entry of authority.batch) if (state$1.byEntry.get(entry) === authority) state$1.byEntry.delete(entry);
	const session = state$1.bySession.get(authority.requesterSessionKey);
	session?.delete(authority);
	if (session?.size === 0) state$1.bySession.delete(authority.requesterSessionKey);
}
function sameBatch(left, right) {
	return left.length === right.length && left.every((entry) => right.includes(entry));
}
function isCurrent(authority) {
	if (!authority.active || authority.managementEntitlement.source === "channel-owner" && !authority.managementEntitlement.isCurrent() || authority.lifecycleGeneration !== getAgentRunLifecycleGeneration() || !state$1.bySession.get(authority.requesterSessionKey)?.has(authority)) return false;
	const session = loadSessionEntryReadOnly({
		storePath: authority.storePath,
		sessionKey: authority.requesterSessionKey
	});
	if (session?.sessionId !== authority.requesterSessionId || session.lifecycleRevision !== authority.sessionLifecycleRevision || session.archivedAt !== void 0) return false;
	if (authority.runScopeBound) return true;
	if (authority.batch.some((entry) => entry.killIntent?.suppressTaskDelivery === true || entry.killReconciliation?.suppressTaskDelivery === true) || authority.batch.every((entry) => entry.suppressCompletionDelivery === true)) return false;
	const batchRunIds = authority.batch.map((entry) => entry.runId).toSorted();
	return authority.batch.every((entry) => {
		const wake = entry.requesterSettleWake;
		return authority.runs.get(entry.runId) === entry && state$1.byEntry.get(entry) === authority && (authority.rearmGeneration === void 0 || wake?.requesterYieldBatch === true && wake.rearmGeneration === authority.rearmGeneration && wake.batchRunIds?.length === batchRunIds.length && wake.batchRunIds.every((runId, index) => runId === batchRunIds[index]));
	});
}
/** Prepare while the exact original run is live; commit only after yield intent persists. */
function captureRequesterCronAuthority(params) {
	const requesterAgentId = params.requesterAgentId;
	if (!requesterAgentId || params.batch.length === 0) return;
	const capture = captureActiveCronManagementAuthority({
		runId: params.requesterTurnRunId,
		sessionKey: params.requesterSessionKey,
		agentId: requesterAgentId
	});
	if (!capture) return;
	const storePath = resolveSessionStorePathCore(getRuntimeConfig().session?.store, { agentId: requesterAgentId });
	const session = loadSessionEntryReadOnly({
		storePath,
		sessionKey: params.requesterSessionKey
	});
	if (session?.sessionId !== capture.sessionId || session.archivedAt !== void 0) return;
	const authority = {
		...params,
		requesterAgentId,
		requesterSessionId: capture.sessionId,
		managementEntitlement: capture.managementEntitlement,
		requesterOwner: capture.requesterOwner,
		lifecycleGeneration: capture.lifecycleGeneration,
		sessionLifecycleRevision: session.lifecycleRevision,
		storePath,
		batch: [...params.batch],
		active: true
	};
	const sessionAuthorities = state$1.bySession.get(authority.requesterSessionKey) ?? /* @__PURE__ */ new Set();
	sessionAuthorities.add(authority);
	state$1.bySession.set(authority.requesterSessionKey, sessionAuthorities);
	return {
		commit: () => {
			if (!authority.active || !capture.isActive()) {
				discard(authority);
				return;
			}
			for (const entry of authority.batch) {
				const previous = state$1.byEntry.get(entry);
				if (previous) discard(previous);
				state$1.byEntry.set(entry, authority);
			}
		},
		revoke: () => discard(authority)
	};
}
/** The committed complete cohort, rather than a child result, owns continuation authority. */
function promoteRequesterCronAuthority(params) {
	const authority = params.batch[0] && state$1.byEntry.get(params.batch[0]);
	if (!authority) return;
	if (params.rearmGeneration === void 0 || authority.requesterTurnRunId !== params.requesterTurnRunId || !sameBatch(authority.batch, params.batch) || !isCurrent(authority)) {
		discard(authority);
		return;
	}
	authority.rearmGeneration = params.rearmGeneration;
	if (!isCurrent(authority)) discard(authority);
}
/** Preserve only the registry's committed same-task replacement and its remapped cohort. */
function replaceRequesterCronAuthorityEntry(params) {
	const authority = state$1.byEntry.get(params.previous);
	if (!authority) return;
	if (!params.preserve) {
		discard(authority);
		return;
	}
	authority.batch = authority.batch.map((entry) => entry === params.previous ? params.next : entry);
	state$1.byEntry.delete(params.previous);
	state$1.byEntry.set(params.next, authority);
	if (!isCurrent(authority)) discard(authority);
}
/** A new direct user turn cannot lend its identity to an older pending batch. */
function revokeRequesterCronAuthority(sessionKey) {
	for (const authority of state$1.bySession.get(sessionKey) ?? []) discard(authority);
}
/** Committed outbox cleanup releases only its exact generation, including cancelled batches. */
function revokeRequesterCronAuthorityBatch(batch, rearmGeneration) {
	if (rearmGeneration === void 0) return;
	for (const entry of batch) {
		const authority = state$1.byEntry.get(entry);
		if (authority && authority.rearmGeneration === rearmGeneration) discard(authority);
	}
}
const activeDispatch = new AsyncLocalStorage();
async function withRequesterCronAuthority(params, run) {
	const authority = params.batch[0] && state$1.byEntry.get(params.batch[0]);
	if (!authority || authority.requesterSessionKey !== params.requesterSessionKey || authority.requesterSessionId !== params.requesterSessionId || authority.requesterAgentId !== params.requesterAgentId || authority.rearmGeneration === void 0 || authority.rearmGeneration !== params.rearmGeneration || !sameBatch(authority.batch, params.batch)) return await run();
	const current = () => isCurrent(authority) && (authority.runScopeBound === true || params.isCurrent());
	if (!current()) {
		discard(authority);
		return await run();
	}
	const dispatch = {
		authority,
		runId: params.runId,
		isCurrent: current,
		consumed: false
	};
	try {
		return await activeDispatch.run(dispatch, run);
	} finally {
		if (!isCurrent(authority)) discard(authority);
	}
}
function consumeRequesterCronAuthorityAdmission(params) {
	const dispatch = activeDispatch.getStore();
	if (!dispatch || dispatch.consumed || dispatch.authority.admittedRunId !== void 0 || dispatch.runId !== params.runId || dispatch.authority.requesterSessionKey !== params.sessionKey || dispatch.authority.requesterSessionId !== params.sessionId || params.inputProvenance?.kind !== "inter_session" || params.inputProvenance.sourceTool !== "subagent_settle" || !dispatch.authority.batch.some((entry) => entry.childSessionKey === params.inputProvenance?.sourceSessionKey) || !dispatch.isCurrent()) return;
	dispatch.consumed = true;
	dispatch.authority.admittedRunId = params.runId;
	return {
		runId: params.runId,
		callerOrigin: { kind: "unknown" },
		managementEntitlement: dispatch.authority.managementEntitlement,
		requesterOwner: dispatch.authority.requesterOwner,
		isCurrent: dispatch.isCurrent,
		bindRunScope: (scope) => {
			if (dispatch.authority.runScopeBound || !dispatch.isCurrent() || scope.runId !== params.runId || scope.isCurrent !== dispatch.isCurrent || scope.managementEntitlement !== dispatch.authority.managementEntitlement || scope.requesterOwner !== dispatch.authority.requesterOwner || scope.callerOrigin.kind !== "unknown" || !scope.active || scope.signal.aborted) throw new Error("Requester automation authority no longer owns this run scope");
			dispatch.authority.runScopeBound = true;
			for (const entry of dispatch.authority.batch) if (state$1.byEntry.get(entry) === dispatch.authority) state$1.byEntry.delete(entry);
			dispatch.authority.batch = [];
			scope.signal.addEventListener("abort", () => discard(dispatch.authority), { once: true });
		}
	};
}
//#endregion
//#region src/agents/subagents/requester-final-attachment.ts
const REQUESTER_FINAL_ATTACHMENT_KEY = Symbol.for("openclaw.subagents.requesterFinalAttachment");
const REQUESTER_FINAL_ATTACHMENT_MAX_TTL_MS = 72e5;
const state = resolveGlobalSingleton(REQUESTER_FINAL_ATTACHMENT_KEY, () => ({ byOwner: /* @__PURE__ */ new Map() }), (value) => value.byOwner.clear());
function ownerKey(requesterAgentId, requesterSessionKey) {
	return `${requesterAgentId}\u0000${requesterSessionKey}`;
}
function sameRunIds(left, right) {
	return left.length === right.length && left.every((runId, index) => runId === right[index]);
}
function getCurrentAttachment(params) {
	const key = ownerKey(params.requesterAgentId, params.requesterSessionKey);
	const attachment = state.byOwner.get(key);
	if (!attachment) return;
	if (attachment.expiresAt <= Date.now() || attachment.lifecycleGeneration !== getAgentEventLifecycleGeneration()) {
		state.byOwner.delete(key);
		return;
	}
	if (params.requesterSessionId !== void 0 && attachment.requesterSessionId !== params.requesterSessionId || params.batchRunIds !== void 0 && (!attachment.batch || !sameRunIds(attachment.batch.batchRunIds, params.batchRunIds.toSorted())) || params.rearmGeneration !== void 0 && attachment.batch?.rearmGeneration !== params.rearmGeneration) return;
	return attachment;
}
function registerRequesterFinalAttachment(params) {
	const key = ownerKey(params.requesterAgentId, params.requesterSessionKey);
	const attachment = {
		requesterAgentId: params.requesterAgentId,
		requesterSessionKey: params.requesterSessionKey,
		requesterSessionId: params.requesterSessionId,
		requesterTurnRunId: params.requesterTurnRunId,
		lifecycleGeneration: params.lifecycleGeneration,
		expiresAt: Date.now() + Math.min(params.timeoutMs, REQUESTER_FINAL_ATTACHMENT_MAX_TTL_MS),
		append: params.append
	};
	state.byOwner.set(key, attachment);
	const deleteIfCurrent = (requireProvisional) => {
		const current = state.byOwner.get(key);
		if (current === attachment && (!requireProvisional || !current.batch)) state.byOwner.delete(key);
	};
	return {
		releaseProvisional: () => deleteIfCurrent(true),
		revoke: () => deleteIfCurrent(false)
	};
}
function promoteRequesterFinalAttachment(params) {
	const attachment = getCurrentAttachment({
		requesterAgentId: params.requesterAgentId,
		requesterSessionKey: params.requesterSessionKey
	});
	if (!attachment || attachment.requesterTurnRunId !== params.requesterTurnRunId) return false;
	attachment.batch = {
		batchRunIds: params.batchRunIds.toSorted(),
		rearmGeneration: params.rearmGeneration
	};
	return true;
}
function transferRequesterFinalAttachment(params) {
	const attachment = getCurrentAttachment(params);
	if (!attachment) return false;
	attachment.requesterTurnRunId = params.requesterTurnRunId;
	return true;
}
function revokeRequesterFinalAttachment(params) {
	const key = ownerKey(params.requesterAgentId, params.requesterSessionKey);
	if (!getCurrentAttachment(params)) return false;
	state.byOwner.delete(key);
	return true;
}
function consumeRequesterFinalAttachment(params) {
	const key = ownerKey(params.requesterAgentId, params.requesterSessionKey);
	const attachment = getCurrentAttachment(params);
	if (!attachment) return "missing";
	state.byOwner.delete(key);
	try {
		return attachment.append(params.text) ? "appended" : "rejected";
	} catch {
		return "rejected";
	}
}
registerAgentEventLifecycleRotationHandler("requester-final-attachments", () => {
	state.byOwner.clear();
});
//#endregion
export { transferRequesterFinalAttachment as a, promoteRequesterCronAuthority as c, revokeRequesterCronAuthorityBatch as d, withRequesterCronAuthority as f, revokeRequesterFinalAttachment as i, replaceRequesterCronAuthorityEntry as l, promoteRequesterFinalAttachment as n, captureRequesterCronAuthority as o, registerRequesterFinalAttachment as r, consumeRequesterCronAuthorityAdmission as s, consumeRequesterFinalAttachment as t, revokeRequesterCronAuthority as u };
