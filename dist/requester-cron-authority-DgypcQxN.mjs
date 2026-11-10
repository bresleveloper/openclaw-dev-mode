import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { f as getAgentRunLifecycleGeneration } from "./agent-run-registry-gmaPgO-n.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { E as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-iJNKNMuJ.mjs";
import "./legacy.default-agent-owner-Blrs2q29.mjs";
import "./config-B3oiWDlr.mjs";
import { E as getSubagentRunRuntimeKey, k as isSameSubagentRunOwner } from "./subagent-session-read-scope-7jPlY84h.mjs";
import { t as prepareSessionMutationFacts } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { c as captureActiveCronManagementAuthority } from "./cron-creator-authority-context-B7AqRmnW.mjs";
import { c as isRequesterYieldCohortMember, d as sameRequesterSettleBatch, l as resolveCurrentRequesterSettleBatch } from "./subagent-requester-settle-identity-BXTgIS3Y.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/subagent-requester-owner.ts
/** Resolves the durable requester owner for legacy rows that predate requesterAgentId. */
function resolveSubagentRequesterAgentId(cfg, entry) {
	if (entry.requesterAgentId) return entry.requesterAgentId;
	const parsedAgentId = parseAgentSessionKey(entry.requesterSessionKey)?.agentId;
	if (parsedAgentId) return parsedAgentId;
	const persisted = resolvePersistedSessionStoreOwnerForKey(cfg, entry.requesterSessionKey);
	return persisted.kind === "configured" ? persisted.agentId : persisted.kind === "none" ? tryResolveLegacyCompatibilityAgentId(cfg) : void 0;
}
//#endregion
//#region src/agents/subagents/requester-cron-authority.ts
const state = resolveGlobalSingleton(Symbol.for("openclaw.subagents.requesterCronAuthority"), () => ({
	byEntry: /* @__PURE__ */ new WeakMap(),
	followupEntries: /* @__PURE__ */ new WeakSet(),
	bySession: /* @__PURE__ */ new Map()
}), (value) => {
	for (const entries of value.bySession.values()) for (const entry of entries) {
		entry.active = false;
		if (entry.kind === "followup") entry.releaseFollowup();
		else entry.sessionFacts.release();
	}
	value.byEntry = /* @__PURE__ */ new WeakMap();
	value.bySession.clear();
});
function discard(authority) {
	if (!authority.active) return;
	authority.active = false;
	if (authority.kind === "yield") authority.sessionFacts.release();
	const entries = authority.kind === "yield" ? authority.batch : authority.binding ? [authority.binding.entry] : [];
	for (const entry of entries) if (state.byEntry.get(getSubagentRunRuntimeKey(entry)) === authority) state.byEntry.delete(getSubagentRunRuntimeKey(entry));
	const session = state.bySession.get(authority.requesterSessionKey);
	session?.delete(authority);
	if (session?.size === 0) state.bySession.delete(authority.requesterSessionKey);
	if (authority.kind === "followup") authority.releaseFollowup();
}
function isCurrent(authority) {
	if (!authority.active || authority.managementEntitlement?.source === "channel-owner" && !authority.managementEntitlement.isCurrent() || authority.lifecycleGeneration !== getAgentRunLifecycleGeneration() || !state.bySession.get(authority.requesterSessionKey)?.has(authority)) return false;
	if (authority.kind === "followup") {
		if (!authority.isFollowupCurrent() || authority.requesterOwner?.isCurrent() !== true) return false;
		const binding = authority.binding;
		if (!binding || authority.admittedRunId !== void 0) return true;
		const entry = binding.runs.get(binding.entry.runId);
		return Boolean(entry && isSameSubagentRunOwner(entry, binding.entry) && state.byEntry.get(getSubagentRunRuntimeKey(entry)) === authority && !entry.suppressCompletionDelivery && !entry.killIntent?.suppressTaskDelivery && !entry.killReconciliation?.suppressTaskDelivery);
	}
	let session;
	try {
		session = authority.sessionFacts.readCurrent(readRuntimeConfig()).target;
	} catch {
		return false;
	}
	if (session?.entry.sessionId !== authority.requesterSessionId || session.entry.lifecycleRevision !== authority.sessionLifecycleRevision || session.entry.archivedAt !== void 0) return false;
	if (authority.runScopeBound) return true;
	const batch = resolveCurrentRequesterSettleBatch(authority.batch, authority.runs);
	if (!batch || batch.some((entry) => entry.killIntent?.suppressTaskDelivery === true || entry.killReconciliation?.suppressTaskDelivery === true) || batch.every((entry) => entry.suppressCompletionDelivery === true)) return false;
	const batchRunIds = authority.batch.map((entry) => entry.runId).toSorted();
	return batch.every((entry) => state.byEntry.get(getSubagentRunRuntimeKey(entry)) === authority && (authority.rearmGeneration === void 0 || isRequesterYieldCohortMember(entry, batchRunIds, authority.rearmGeneration)));
}
/** Capture automation management before registry hydration can yield. */
function prepareRequesterCronAuthority(params) {
	const requesterAgentId = params.requesterAgentId;
	if (!requesterAgentId) return;
	const capture = captureActiveCronManagementAuthority({
		runId: params.requesterTurnRunId,
		sessionKey: params.requesterSessionKey,
		agentId: requesterAgentId
	});
	if (!capture) return;
	const preparedFacts = prepareSessionMutationFacts({
		cfg: readRuntimeConfig(),
		sessionKey: params.requesterSessionKey,
		agentId: requesterAgentId,
		allowMissing: true
	});
	let readyFacts;
	preparedFacts.then((facts) => {
		readyFacts = facts;
	}, () => {});
	let consumed = false;
	let released = false;
	let boundAuthority;
	const assertCurrent = () => {
		if (!capture.isActive()) throw new Error("Requester authority retired during session preparation");
		if (released && !boundAuthority || boundAuthority?.active === false) throw new Error("Requester authority retired before yield handoff");
		if (readyFacts) {
			const current = readyFacts.readCurrent(readRuntimeConfig()).target;
			if (current?.entry.sessionId !== capture.sessionId || current.entry.archivedAt !== void 0 || boundAuthority && current.entry.lifecycleRevision !== boundAuthority.sessionLifecycleRevision) throw new Error("Requester session authority changed before yield handoff");
		}
	};
	const releaseFacts = (sessionFacts) => {
		if (!boundAuthority) sessionFacts?.release();
	};
	return {
		assertCurrent,
		async validate() {
			await preparedFacts;
			assertCurrent();
		},
		async bind({ batch, runs }) {
			if (consumed || released) throw new Error("Requester authority preparation was already consumed");
			consumed = true;
			const sessionFacts = await preparedFacts;
			assertCurrent();
			const session = sessionFacts.readCurrent(readRuntimeConfig()).target;
			if (batch.length === 0 || session?.entry.sessionId !== capture.sessionId || session.entry.archivedAt !== void 0) return;
			const authority = {
				...params,
				kind: "yield",
				requesterAgentId,
				requesterSessionId: capture.sessionId,
				managementEntitlement: capture.managementEntitlement,
				requesterOwner: capture.requesterOwner,
				lifecycleGeneration: capture.lifecycleGeneration,
				sessionLifecycleRevision: session.entry.lifecycleRevision,
				sessionFacts,
				runs,
				batch: [...batch],
				active: true
			};
			boundAuthority = authority;
			const sessionAuthorities = state.bySession.get(authority.requesterSessionKey) ?? /* @__PURE__ */ new Set();
			sessionAuthorities.add(authority);
			state.bySession.set(authority.requesterSessionKey, sessionAuthorities);
			return {
				commit: () => {
					assertCurrent();
					const committedBatch = resolveCurrentRequesterSettleBatch(authority.batch, runs);
					if (!committedBatch) throw new Error("Requester automation authority lost its committed child owner");
					authority.batch = committedBatch;
					for (const entry of authority.batch) {
						const previous = state.byEntry.get(getSubagentRunRuntimeKey(entry));
						if (previous && previous !== authority) discard(previous);
						state.byEntry.set(getSubagentRunRuntimeKey(entry), authority);
					}
				},
				revoke: () => discard(authority)
			};
		},
		release() {
			if (released) return;
			released = true;
			if (readyFacts) {
				releaseFacts(readyFacts);
				return;
			}
			return preparedFacts.then(releaseFacts, () => releaseFacts());
		}
	};
}
/** The committed complete cohort, rather than a child result, owns continuation authority. */
function promoteRequesterCronAuthority(params) {
	const authority = params.batch[0] && state.byEntry.get(getSubagentRunRuntimeKey(params.batch[0]));
	if (!authority || authority.kind !== "yield") return;
	if (params.rearmGeneration === void 0 || authority.requesterTurnRunId !== params.requesterTurnRunId || !sameRequesterSettleBatch(authority.batch, params.batch) || !isCurrent(authority)) {
		discard(authority);
		return;
	}
	authority.rearmGeneration = params.rearmGeneration;
	if (!isCurrent(authority)) discard(authority);
}
/** Preserve only the registry's committed same-task replacement and its remapped cohort. */
function replaceRequesterCronAuthorityEntry(params) {
	const authority = state.byEntry.get(getSubagentRunRuntimeKey(params.previous));
	if (!authority) return;
	if (!params.preserve) {
		discard(authority);
		return;
	}
	if (authority.kind === "yield") authority.batch = authority.batch.map((entry) => isSameSubagentRunOwner(entry, params.previous) ? params.next : entry);
	else if (authority.binding) {
		authority.binding.entry = params.next;
		state.followupEntries.add(getSubagentRunRuntimeKey(params.next));
	}
	state.byEntry.delete(getSubagentRunRuntimeKey(params.previous));
	state.byEntry.set(getSubagentRunRuntimeKey(params.next), authority);
	if (!isCurrent(authority)) discard(authority);
}
/** Child retirement releases its pending capture; an admitted requester owns its own lifetime. */
function retireRequesterFollowupAuthority(entry) {
	const key = getSubagentRunRuntimeKey(entry);
	const authority = state.byEntry.get(key);
	if (authority?.kind !== "followup") return;
	state.byEntry.delete(key);
	authority.binding = void 0;
	if (authority.admittedRunId === void 0) discard(authority);
}
/** A new direct user turn cannot lend its identity to an older pending batch. */
function revokeRequesterCronAuthority(sessionKey) {
	for (const authority of state.bySession.get(sessionKey) ?? []) discard(authority);
}
/** Committed outbox cleanup releases only its exact generation, including cancelled batches. */
function revokeRequesterCronAuthorityBatch(batch, rearmGeneration) {
	if (rearmGeneration === void 0) return;
	for (const entry of batch) {
		const authority = state.byEntry.get(getSubagentRunRuntimeKey(entry));
		if (authority?.kind === "yield" && authority.rearmGeneration === rearmGeneration) {
			if (isSameSubagentRunOwner(authority.runs.get(entry.runId), entry) && entry.pauseReason === "sessions_yield" && entry.requesterSettleWake?.rearmGeneration === rearmGeneration && isCurrent(authority)) continue;
			discard(authority);
		}
	}
}
const activeDispatch = new AsyncLocalStorage();
async function withRequesterCronAuthority(params, run) {
	const authority = params.batch[0] && state.byEntry.get(getSubagentRunRuntimeKey(params.batch[0]));
	const child = params.batch.length === 1 ? params.batch[0] : void 0;
	const pause = child?.pauseReason === "sessions_yield" && child.requesterSettleWake?.pauseNotice ? { entry: child } : void 0;
	if (!authority || authority.kind !== "yield" || authority.requesterSessionKey !== params.requesterSessionKey || authority.requesterSessionId !== params.requesterSessionId || authority.requesterAgentId !== params.requesterAgentId || authority.rearmGeneration === void 0 || authority.rearmGeneration !== params.rearmGeneration || !(pause ? authority.batch.some((entry) => isSameSubagentRunOwner(entry, pause.entry)) : sameRequesterSettleBatch(authority.batch, params.batch))) return await run();
	const current = () => {
		const pausedEntry = pause && authority.runs.get(pause.entry.runId);
		return isCurrent(authority) && (pause ? !pause.released && (pause.scope ? pause.scope.active && !pause.scope.signal.aborted : isSameSubagentRunOwner(pausedEntry, pause.entry) && pausedEntry?.pauseReason === "sessions_yield" && Boolean(pausedEntry.requesterSettleWake?.pauseNotice) && params.isCurrent()) : authority.runScopeBound === true || params.isCurrent());
	};
	if (!current()) {
		discard(authority);
		return await run();
	}
	const dispatch = {
		authority,
		runId: params.runId,
		isCurrent: current,
		consumed: false,
		pause
	};
	try {
		return await activeDispatch.run(dispatch, run);
	} finally {
		if (!isCurrent(authority)) discard(authority);
	}
}
async function runRequesterFollowupAuthority(authority, runId, run) {
	if (!isCurrent(authority) || authority.admittedRunId !== void 0) throw new Error("Requester followup authority is no longer current");
	return await activeDispatch.run({
		authority,
		runId,
		isCurrent: () => isCurrent(authority),
		consumed: false
	}, run);
}
/** Run a registry completion under its exact retained requester, never ambient identity. */
async function withRequesterFollowupAuthority(entry, runId, run) {
	const key = getSubagentRunRuntimeKey(entry);
	const authority = state.byEntry.get(key);
	if (!authority && state.followupEntries.has(key)) throw new Error("Requester followup authority is no longer current");
	return authority?.kind === "followup" ? await runRequesterFollowupAuthority(authority, runId, run) : await run();
}
/** Child followup results return the captured owner only to their exact requester. */
function captureRequesterFollowupAuthority(params) {
	const capture = captureActiveCronManagementAuthority({
		runId: params.requesterTurnRunId,
		sessionKey: params.requesterSessionKey,
		agentId: params.requesterAgentId
	});
	if (!capture?.requesterOwner || capture.sessionId !== params.requesterSessionId) return;
	const authority = {
		kind: "followup",
		...params,
		requesterOwner: capture.requesterOwner,
		managementEntitlement: capture.managementEntitlement,
		lifecycleGeneration: capture.lifecycleGeneration,
		isFollowupCurrent: params.isCurrent,
		releaseFollowup: params.release,
		active: true
	};
	const session = state.bySession.get(params.requesterSessionKey) ?? /* @__PURE__ */ new Set();
	session.add(authority);
	state.bySession.set(params.requesterSessionKey, session);
	return {
		bind({ entry, runs }) {
			if (authority.binding || authority.admittedRunId !== void 0 || !isCurrent(authority) || !isSameSubagentRunOwner(runs.get(entry.runId), entry) || entry.requesterSessionKey !== authority.requesterSessionKey || entry.requesterAgentId !== authority.requesterAgentId || entry.requesterTurnRunId !== authority.requesterTurnRunId || entry.completionRequesterSessionId !== authority.requesterSessionId || entry.childSessionKey !== authority.sourceSessionKey) throw new Error("Requester followup authority does not own this child completion");
			const key = getSubagentRunRuntimeKey(entry);
			const previous = state.byEntry.get(key);
			if (previous && previous !== authority) discard(previous);
			authority.binding = {
				entry,
				runs
			};
			state.followupEntries.add(key);
			state.byEntry.set(key, authority);
		},
		release: () => {
			if (authority.admittedRunId === void 0 && !authority.binding) discard(authority);
		},
		async run(runId, run) {
			return await runRequesterFollowupAuthority(authority, runId, run);
		}
	};
}
function matchesAdmissionTarget(dispatch, params) {
	const { authority } = dispatch;
	return dispatch.runId === params.runId && authority.requesterSessionKey === params.sessionKey && authority.requesterSessionId === params.sessionId && params.inputProvenance?.kind === "inter_session" && (authority.kind === "yield" ? params.inputProvenance.sourceTool === "subagent_settle" && authority.batch.some((entry) => entry.childSessionKey === params.inputProvenance?.sourceSessionKey) : params.inputProvenance.sourceTool === "subagent_announce" && params.inputProvenance.sourceSessionKey === authority.sourceSessionKey);
}
function captureRequesterCronAuthorityAdmissionAssertion(params) {
	const dispatch = activeDispatch.getStore();
	if (!dispatch || dispatch.consumed) return;
	if (!matchesAdmissionTarget(dispatch, params)) throw new Error("Requester authority does not own this continuation");
	return () => {
		if (!dispatch.consumed && !dispatch.isCurrent()) throw new Error("Requester authority is no longer current");
	};
}
function consumeRequesterCronAuthorityAdmission(params) {
	const dispatch = activeDispatch.getStore();
	if (!dispatch || dispatch.consumed || dispatch.authority.admittedRunId !== void 0 || !matchesAdmissionTarget(dispatch, params) || !dispatch.isCurrent()) return;
	dispatch.consumed = true;
	if (!dispatch.authority.managementEntitlement) return;
	if (!dispatch.pause) dispatch.authority.admittedRunId = params.runId;
	return {
		runId: params.runId,
		callerOrigin: { kind: "unknown" },
		managementEntitlement: dispatch.authority.managementEntitlement,
		requesterOwner: dispatch.authority.requesterOwner,
		isCurrent: dispatch.isCurrent,
		...dispatch.pause ? { release: () => {
			if (dispatch.pause) dispatch.pause.released = true;
		} } : dispatch.authority.kind === "followup" ? { release: () => discard(dispatch.authority) } : {},
		bindRunScope: (scope) => {
			if (dispatch.authority.runScopeBound || dispatch.pause?.scope || !dispatch.isCurrent() || scope.runId !== params.runId || scope.isCurrent !== dispatch.isCurrent || scope.managementEntitlement !== dispatch.authority.managementEntitlement || scope.requesterOwner !== dispatch.authority.requesterOwner || scope.callerOrigin.kind !== "unknown" || !scope.active || scope.signal.aborted) throw new Error("Requester automation authority no longer owns this run scope");
			if (dispatch.pause) {
				dispatch.pause.scope = scope;
				return;
			}
			dispatch.authority.runScopeBound = true;
			if (dispatch.authority.kind === "yield") {
				for (const entry of dispatch.authority.batch) if (state.byEntry.get(getSubagentRunRuntimeKey(entry)) === dispatch.authority) state.byEntry.delete(getSubagentRunRuntimeKey(entry));
				dispatch.authority.batch = [];
			} else if (dispatch.authority.binding) {
				const key = getSubagentRunRuntimeKey(dispatch.authority.binding.entry);
				if (state.byEntry.get(key) === dispatch.authority) state.byEntry.delete(key);
				dispatch.authority.binding = void 0;
			}
			scope.signal.addEventListener("abort", () => discard(dispatch.authority), { once: true });
		}
	};
}
//#endregion
export { promoteRequesterCronAuthority as a, revokeRequesterCronAuthority as c, withRequesterFollowupAuthority as d, resolveSubagentRequesterAgentId as f, prepareRequesterCronAuthority as i, revokeRequesterCronAuthorityBatch as l, captureRequesterFollowupAuthority as n, replaceRequesterCronAuthorityEntry as o, consumeRequesterCronAuthorityAdmission as r, retireRequesterFollowupAuthority as s, captureRequesterCronAuthorityAdmissionAssertion as t, withRequesterCronAuthority as u };
