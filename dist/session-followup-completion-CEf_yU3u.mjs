import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { s as raceWithTimeout } from "./src-D1BHGNTj.mjs";
import { d as getAgentRunLifecycleGeneration } from "./agent-run-registry-BaxMDLZF.mjs";
import { h as registerAgentEventLifecycleRotationHandler, l as getAgentEventLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-GvNTkbe3.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { S as isSameSubagentRunOwner, y as getSubagentRunRuntimeKey } from "./subagent-registry.store.sqlite-DIYyRjhZ.mjs";
import { a as buildAgentRunTerminalOutcomeFromWaitResult } from "./agent-run-terminal-outcome-BTCs8JFs.mjs";
import { c as captureActiveCronManagementAuthority } from "./cron-creator-authority-context-aezDQHzt.mjs";
import { g as getFollowupCohortOwner, h as bindFollowupCohortOwner } from "./subagent-registry-memory-guooOkCK.mjs";
import { c as isRequesterYieldCohortMember, d as sameRequesterSettleBatch, l as resolveCurrentRequesterSettleBatch } from "./subagent-requester-settle-identity-Blu5INx9.mjs";
import { r as prepareSessionMutationFacts } from "./session-sharing-preparation-BwpUabTn.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/subagents/requester-cron-authority.ts
const state$2 = resolveGlobalSingleton(Symbol.for("openclaw.subagents.requesterCronAuthority"), () => ({
	byEntry: /* @__PURE__ */ new WeakMap(),
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
	authority.active = false;
	if (authority.kind === "yield") {
		authority.sessionFacts.release();
		for (const entry of authority.batch) if (state$2.byEntry.get(getSubagentRunRuntimeKey(entry)) === authority) state$2.byEntry.delete(getSubagentRunRuntimeKey(entry));
	}
	const session = state$2.bySession.get(authority.requesterSessionKey);
	session?.delete(authority);
	if (session?.size === 0) state$2.bySession.delete(authority.requesterSessionKey);
	if (authority.kind === "followup") authority.releaseFollowup();
}
function isCurrent(authority) {
	if (!authority.active || authority.managementEntitlement?.source === "channel-owner" && !authority.managementEntitlement.isCurrent() || authority.lifecycleGeneration !== getAgentRunLifecycleGeneration() || !state$2.bySession.get(authority.requesterSessionKey)?.has(authority)) return false;
	if (authority.kind === "followup") return authority.isFollowupCurrent() && authority.requesterOwner?.isCurrent() === true;
	let session;
	try {
		session = authority.sessionFacts.readCurrent(getRuntimeConfig()).target;
	} catch {
		return false;
	}
	if (session?.entry.sessionId !== authority.requesterSessionId || session.entry.lifecycleRevision !== authority.sessionLifecycleRevision || session.entry.archivedAt !== void 0) return false;
	if (authority.runScopeBound) return true;
	const batch = resolveCurrentRequesterSettleBatch(authority.batch, authority.runs);
	if (!batch || batch.some((entry) => entry.killIntent?.suppressTaskDelivery === true || entry.killReconciliation?.suppressTaskDelivery === true) || batch.every((entry) => entry.suppressCompletionDelivery === true)) return false;
	const batchRunIds = authority.batch.map((entry) => entry.runId).toSorted();
	return batch.every((entry) => state$2.byEntry.get(getSubagentRunRuntimeKey(entry)) === authority && (authority.rearmGeneration === void 0 || isRequesterYieldCohortMember(entry, batchRunIds, authority.rearmGeneration)));
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
		cfg: getRuntimeConfig(),
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
			const current = readyFacts.readCurrent(getRuntimeConfig()).target;
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
			const session = sessionFacts.readCurrent(getRuntimeConfig()).target;
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
			const sessionAuthorities = state$2.bySession.get(authority.requesterSessionKey) ?? /* @__PURE__ */ new Set();
			sessionAuthorities.add(authority);
			state$2.bySession.set(authority.requesterSessionKey, sessionAuthorities);
			return {
				commit: () => {
					assertCurrent();
					const committedBatch = resolveCurrentRequesterSettleBatch(authority.batch, runs);
					if (!committedBatch) throw new Error("Requester automation authority lost its committed child owner");
					authority.batch = committedBatch;
					for (const entry of authority.batch) {
						const previous = state$2.byEntry.get(getSubagentRunRuntimeKey(entry));
						if (previous && previous !== authority) discard(previous);
						state$2.byEntry.set(getSubagentRunRuntimeKey(entry), authority);
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
	const authority = params.batch[0] && state$2.byEntry.get(getSubagentRunRuntimeKey(params.batch[0]));
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
	const authority = state$2.byEntry.get(getSubagentRunRuntimeKey(params.previous));
	if (!authority || authority.kind !== "yield") return;
	if (!params.preserve) {
		discard(authority);
		return;
	}
	authority.batch = authority.batch.map((entry) => isSameSubagentRunOwner(entry, params.previous) ? params.next : entry);
	state$2.byEntry.delete(getSubagentRunRuntimeKey(params.previous));
	state$2.byEntry.set(getSubagentRunRuntimeKey(params.next), authority);
	if (!isCurrent(authority)) discard(authority);
}
/** A new direct user turn cannot lend its identity to an older pending batch. */
function revokeRequesterCronAuthority(sessionKey) {
	for (const authority of state$2.bySession.get(sessionKey) ?? []) discard(authority);
}
/** Committed outbox cleanup releases only its exact generation, including cancelled batches. */
function revokeRequesterCronAuthorityBatch(batch, rearmGeneration) {
	if (rearmGeneration === void 0) return;
	for (const entry of batch) {
		const authority = state$2.byEntry.get(getSubagentRunRuntimeKey(entry));
		if (authority?.kind === "yield" && authority.rearmGeneration === rearmGeneration) {
			if (isSameSubagentRunOwner(authority.runs.get(entry.runId), entry) && entry.pauseReason === "sessions_yield" && entry.requesterSettleWake?.rearmGeneration === rearmGeneration && isCurrent(authority)) continue;
			discard(authority);
		}
	}
}
const activeDispatch = new AsyncLocalStorage();
async function withRequesterCronAuthority(params, run) {
	const authority = params.batch[0] && state$2.byEntry.get(getSubagentRunRuntimeKey(params.batch[0]));
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
	const session = state$2.bySession.get(params.requesterSessionKey) ?? /* @__PURE__ */ new Set();
	session.add(authority);
	state$2.bySession.set(params.requesterSessionKey, session);
	return {
		release: () => {
			if (authority.admittedRunId === void 0) discard(authority);
		},
		async run(runId, run) {
			if (!isCurrent(authority) || authority.admittedRunId !== void 0) throw new Error("Requester followup authority is no longer current");
			return await activeDispatch.run({
				authority,
				runId,
				isCurrent: () => isCurrent(authority),
				consumed: false
			}, run);
		}
	};
}
function matchesAdmissionTarget(dispatch, params) {
	const { authority } = dispatch;
	return dispatch.runId === params.runId && authority.requesterSessionKey === params.sessionKey && authority.requesterSessionId === params.sessionId && params.inputProvenance?.kind === "inter_session" && (authority.kind === "yield" ? params.inputProvenance.sourceTool === "subagent_settle" && authority.batch.some((entry) => entry.childSessionKey === params.inputProvenance?.sourceSessionKey) : params.inputProvenance.sourceTool === "subagent_announce" && params.inputProvenance.sourceSessionKey === authority.sourceSessionKey);
}
function captureRequesterCronAuthorityAdmissionAssertion(params) {
	const dispatch = activeDispatch.getStore();
	if (!dispatch || dispatch.consumed || dispatch.authority.kind !== "yield") return;
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
				for (const entry of dispatch.authority.batch) if (state$2.byEntry.get(getSubagentRunRuntimeKey(entry)) === dispatch.authority) state$2.byEntry.delete(getSubagentRunRuntimeKey(entry));
				dispatch.authority.batch = [];
			}
			scope.signal.addEventListener("abort", () => discard(dispatch.authority), { once: true });
		}
	};
}
//#endregion
//#region src/agents/subagents/requester-final-attachment.ts
const REQUESTER_FINAL_ATTACHMENT_KEY = Symbol.for("openclaw.subagents.requesterFinalAttachment");
const REQUESTER_FINAL_ATTACHMENT_MAX_TTL_MS = 72e5;
const state$1 = resolveGlobalSingleton(REQUESTER_FINAL_ATTACHMENT_KEY, () => ({ byOwner: /* @__PURE__ */ new Map() }), (value) => value.byOwner.clear());
function ownerKey(requesterAgentId, requesterSessionKey) {
	return `${requesterAgentId}\u0000${requesterSessionKey}`;
}
function sameRunIds(left, right) {
	return left.length === right.length && left.every((runId, index) => runId === right[index]);
}
function getCurrentAttachment(params) {
	const key = ownerKey(params.requesterAgentId, params.requesterSessionKey);
	const attachment = state$1.byOwner.get(key);
	if (!attachment) return;
	if (attachment.expiresAt <= Date.now() || attachment.lifecycleGeneration !== getAgentEventLifecycleGeneration()) {
		state$1.byOwner.delete(key);
		return;
	}
	if (params.requesterSessionId !== void 0 && attachment.requesterSessionId !== params.requesterSessionId || params.batchRunIds !== void 0 && (!attachment.batch || !sameRunIds(attachment.batch.batchRunIds, params.batchRunIds.toSorted())) || params.rearmGeneration !== void 0 && attachment.batch?.rearmGeneration !== params.rearmGeneration) return;
	return attachment;
}
function registerRequesterFinalAttachment(params) {
	const key = ownerKey(params.requesterAgentId, params.requesterSessionKey);
	const attachment = {
		requesterSessionId: params.requesterSessionId,
		requesterTurnRunId: params.requesterTurnRunId,
		lifecycleGeneration: params.lifecycleGeneration,
		expiresAt: Date.now() + Math.min(params.timeoutMs, REQUESTER_FINAL_ATTACHMENT_MAX_TTL_MS),
		append: params.append
	};
	state$1.byOwner.set(key, attachment);
	const deleteIfCurrent = (requireProvisional) => {
		const current = state$1.byOwner.get(key);
		if (current === attachment && (!requireProvisional || !current.batch)) state$1.byOwner.delete(key);
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
	state$1.byOwner.delete(key);
	return true;
}
function consumeRequesterFinalAttachment(params) {
	const key = ownerKey(params.requesterAgentId, params.requesterSessionKey);
	const attachment = getCurrentAttachment(params);
	if (!attachment) return "missing";
	state$1.byOwner.delete(key);
	try {
		return attachment.append(params.text) ? "appended" : "rejected";
	} catch {
		return "rejected";
	}
}
/** A settled yield batch either attaches its visible final or releases the attachment. */
function finalizeRequesterFinalAttachment(params) {
	const { requesterAgentId, rearmGeneration } = params;
	if (params.pause || !requesterAgentId || params.requesterYieldBatch !== true || rearmGeneration === void 0) return;
	const text = params.finalAssistantVisibleText?.trim();
	if (params.delivered && params.requesterSessionId && text) consumeRequesterFinalAttachment({
		requesterAgentId,
		requesterSessionKey: params.requesterSessionKey,
		requesterSessionId: params.requesterSessionId,
		batchRunIds: params.batchRunIds,
		rearmGeneration,
		text
	});
	else revokeRequesterFinalAttachment({
		requesterAgentId,
		requesterSessionKey: params.requesterSessionKey,
		batchRunIds: params.batchRunIds,
		rearmGeneration
	});
}
registerAgentEventLifecycleRotationHandler("requester-final-attachments", () => {
	state$1.byOwner.clear();
});
//#endregion
//#region src/agents/subagents/completion/session-followup-completion.ts
/** Same-process custody for a followup's result across committed yield cohorts. */
const state = resolveGlobalSingleton(Symbol.for("openclaw.sessions.followupCompletion"), () => ({
	requests: new AsyncLocalStorage(),
	successors: new AsyncLocalStorage(),
	executions: /* @__PURE__ */ new Map()
}));
function withFollowupRequest(request, run) {
	return state.requests.run(request, run);
}
function readFollowupRequest(runId, targetSessionKey) {
	const request = state.requests.getStore();
	return request?.runId === runId && request.targetSessionKey === targetSessionKey ? request : void 0;
}
function readFollowupSuccessor(runId, targetSessionKey) {
	const successor = state.successors.getStore();
	return successor?.runId === runId && successor.owner.request.targetSessionKey === targetSessionKey ? successor : void 0;
}
/** A weak cohort tombstone must survive revocation: missing authority is not System authority. */
function getFollowupForCohort(entries) {
	const owner = entries.length ? getFollowupCohortOwner(entries[0]) : void 0;
	return owner && entries.every((entry) => getFollowupCohortOwner(entry) === owner) ? owner : void 0;
}
function promoteFollowupYield(params) {
	if (params.rearmGeneration === void 0) return;
	state.executions.get(params.requesterTurnRunId)?.promoteYield(params.requesterTurnRunId, params.entries, params.rearmGeneration);
}
function withFollowupSuccessor(successor, run) {
	successor.assertCurrent();
	return successor.owner.request.custody.run(() => state.successors.run(successor, run));
}
var SessionFollowupCompletion = class SessionFollowupCompletion {
	constructor(request) {
		this.lifetime = new AbortController();
		this.signal = this.lifetime.signal;
		this.lifecycleGeneration = getAgentRunLifecycleGeneration();
		this.result = createDeferredCore();
		this.acceptedExecution = false;
		this.taking = false;
		this.consumed = false;
		this.request = request;
		this.execution = {
			runId: request.runId,
			settled: createDeferredCore(),
			yielded: false
		};
		this.revoked = () => this.close(/* @__PURE__ */ new Error("Followup completion authority was revoked."));
		this.result.promise.catch(() => {});
	}
	static bind(request, assertAdmissionCurrent) {
		request.custody.assertCurrent();
		assertAdmissionCurrent?.();
		const owner = new SessionFollowupCompletion(request);
		state.executions.set(request.runId, owner);
		request.custody.signal.addEventListener("abort", owner.revoked, { once: true });
		if (request.custody.signal.aborted) owner.revoked();
		try {
			owner.assertCurrent();
			assertAdmissionCurrent?.();
			return owner;
		} catch (error) {
			owner.close(error);
			throw error;
		}
	}
	assertCurrent() {
		this.signal.throwIfAborted();
		assertAgentRunLifecycleGenerationCurrent(this.lifecycleGeneration);
		if (state.executions.get(this.execution.runId) !== this) throw new Error("Followup completion owner was replaced.");
		this.request.custody.assertCurrent();
	}
	get accepted() {
		return this.acceptedExecution;
	}
	markAccepted(runId) {
		this.assertCurrent();
		if (!this.ownsExecution(runId)) throw new Error("Followup acceptance belongs to another execution.");
		this.acceptedExecution = true;
	}
	finishExecution(runId) {
		if (!this.ownsExecution(runId)) return;
		this.execution.settled.resolve();
		if (this.terminal) this.result.resolve(this.terminal);
	}
	ownsExecution(runId) {
		return !this.signal.aborted && this.execution.runId === runId;
	}
	assertExecutionCurrent(runId) {
		this.assertCurrent();
		if (this.execution.runId !== runId || this.execution.yielded || this.terminal || !this.acceptedExecution) throw new Error("Followup no longer owns this accepted execution.");
	}
	promoteYield(runId, entries, generation) {
		this.assertCurrent();
		if (this.execution.runId !== runId || this.terminal || entries.length === 0 || entries.some((entry) => entry.requesterSessionKey !== this.request.targetSessionKey || entry.requesterSettleWake?.rearmGeneration !== generation || entry.requesterSettleWake.requesterYieldBatch !== true)) throw new Error("Followup yield does not own the committed completion cohort.");
		this.cohort = {
			entries: [...entries],
			generation
		};
		for (const entry of entries) bindFollowupCohortOwner(entry, this);
	}
	successor(entries, runId, assertBatchCurrent) {
		const cohort = this.cohort ?? (this.execution.runId === runId ? this.execution.admittedCohort : void 0);
		if (!cohort || cohort.entries.length !== entries.length || !entries.every((entry) => cohort.entries.some((current) => isSameSubagentRunOwner(current, entry)))) throw new Error("Followup completion cohort was replaced.");
		const assertCurrent = () => {
			this.assertCurrent();
			assertBatchCurrent();
			if (this.cohort !== cohort && !(this.execution.runId === runId && this.execution.admittedCohort === cohort) || entries.some((observed) => {
				const entry = cohort.entries.find((current) => isSameSubagentRunOwner(current, observed));
				return !entry || getFollowupCohortOwner(entry) !== this || entry.requesterSettleWake?.rearmGeneration !== cohort.generation || entry.killIntent || entry.killReconciliation || entry.suppressCompletionDelivery;
			})) throw new Error("Followup successor no longer owns its completion cohort.");
		};
		assertCurrent();
		return {
			owner: this,
			cohort,
			runId,
			assertCurrent
		};
	}
	async prepareSuccessor(successor) {
		successor.assertCurrent();
		await this.execution.settled.promise;
		successor.assertCurrent();
		if (!this.execution.yielded || this.terminal) throw new Error("Followup predecessor did not yield.");
	}
	adopt(successor) {
		successor.assertCurrent();
		if (!this.execution.yielded || this.terminal) throw new Error("Followup predecessor is not paused.");
		if (this.cohort !== successor.cohort) throw new Error("Followup handoff no longer permits a new execution.");
		state.executions.delete(this.execution.runId);
		this.execution = {
			runId: successor.runId,
			settled: createDeferredCore(),
			yielded: false,
			admittedCohort: successor.cohort
		};
		this.cohort = void 0;
		this.acceptedExecution = false;
		state.executions.set(successor.runId, this);
	}
	async settle(runId, reply, assertExecutionCurrent) {
		this.assertCurrent();
		assertExecutionCurrent?.();
		if (this.execution.runId !== runId) throw new Error("Followup terminal execution was replaced.");
		if (reply.status === "ok" && reply.yielded && this.cohort) {
			this.execution.yielded = true;
			return { kind: "yielded" };
		}
		const result = reply.status === "ok" && reply.yielded ? {
			status: "error",
			error: "Followup yielded without a committed completion handoff."
		} : reply;
		if (!buildAgentRunTerminalOutcomeFromWaitResult(result)) throw new Error("Followup execution has no terminal outcome.");
		this.terminal ??= result;
		return {
			kind: "terminal",
			reply: this.terminal
		};
	}
	/** A timeout transfers observation, not result consumption. No second observer is launched. */
	async take(timeoutMs) {
		this.assertCurrent();
		if (this.consumed || this.taking) throw new Error("Followup result already has a consumer.");
		this.taking = true;
		try {
			const reply = timeoutMs === void 0 ? await this.result.promise : await raceWithTimeout(this.result.promise, timeoutMs, () => void 0);
			this.assertCurrent();
			if (reply) this.consumed = true;
			return reply;
		} finally {
			this.taking = false;
		}
	}
	replaceCohortEntry(previous, next) {
		const cohorts = [this.cohort, this.execution.admittedCohort].filter((cohort) => Boolean(cohort?.entries.some((entry) => isSameSubagentRunOwner(entry, previous))));
		if (!isSameSubagentRunOwner(previous, next) && ((previous.taskRunId ?? previous.runId) !== (next.taskRunId ?? next.runId) || previous.childSessionKey !== next.childSessionKey || previous.requesterSessionKey !== next.requesterSessionKey || previous.requesterAgentId !== next.requesterAgentId || !next.requesterSettleWake)) return;
		for (const cohort of cohorts) cohort.entries = cohort.entries.map((entry) => isSameSubagentRunOwner(entry, previous) ? next : entry);
	}
	close(error) {
		if (this.signal.aborted) return;
		this.lifetime.abort(error ?? /* @__PURE__ */ new Error("Followup completion custody ended."));
		if (state.executions.get(this.execution.runId) === this) state.executions.delete(this.execution.runId);
		this.execution.settled.resolve();
		this.result.reject(error ?? /* @__PURE__ */ new Error("Followup completion custody ended."));
		this.request.custody.signal.removeEventListener("abort", this.revoked);
		this.request.custody.release();
	}
};
registerAgentEventLifecycleRotationHandler("session-followup-completions", () => {
	const failures = [];
	const retainedOwners = [...state.executions.values()];
	for (const owner of retainedOwners) try {
		owner.assertCurrent();
	} catch (reason) {
		try {
			owner.close(reason);
		} catch (error) {
			failures.push(error);
		}
	}
	if (failures.length > 0) throw new AggregateError(failures, "Failed to release retired followup custody");
});
//#endregion
export { promoteRequesterCronAuthority as _, readFollowupSuccessor as a, revokeRequesterCronAuthorityBatch as b, finalizeRequesterFinalAttachment as c, revokeRequesterFinalAttachment as d, transferRequesterFinalAttachment as f, prepareRequesterCronAuthority as g, consumeRequesterCronAuthorityAdmission as h, readFollowupRequest as i, promoteRequesterFinalAttachment as l, captureRequesterFollowupAuthority as m, getFollowupForCohort as n, withFollowupRequest as o, captureRequesterCronAuthorityAdmissionAssertion as p, promoteFollowupYield as r, withFollowupSuccessor as s, SessionFollowupCompletion as t, registerRequesterFinalAttachment as u, replaceRequesterCronAuthorityEntry as v, withRequesterCronAuthority as x, revokeRequesterCronAuthority as y };
