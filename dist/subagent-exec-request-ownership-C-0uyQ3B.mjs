import { g as getGatewayContextResolver, p as clearGatewayContextResolver } from "./gateway-request-scope-1BXD1G3l.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { i as resolveSubagentChildAuthority, r as resolveSubagentChildAgentId } from "./subagent-child-owner-match-Dwr-9sla.mjs";
import { E as getSubagentRunRuntimeKey, i as resolveControllerSessionKey } from "./subagent-session-read-scope-7jPlY84h.mjs";
import { h as subagentRuns, i as getCurrentSubagentRunOwner } from "./subagent-registry-memory-DE7WJHOr.mjs";
import { T as resolveActiveEmbeddedRunOwnerByRunId } from "./runs-Czr-I6_B.mjs";
import { a as isCurrentChatAbortExecution, n as captureChatAbortExecution } from "./chat-abort-lifecycle-internal-EU815r6Q.mjs";
import { s as retireRequesterFollowupAuthority } from "./requester-cron-authority-DgypcQxN.mjs";
import { n as captureExecRequestCancellation } from "./bash-process-control-D15pjJye.mjs";
//#region src/agents/subagents/registry/subagent-registry-execution-cleanup.ts
const executionCleanups = /* @__PURE__ */ new WeakMap();
function captureSubagentEmbeddedExecution(entry) {
	if (resolveSubagentChildAuthority(entry).status === "mismatch") return;
	const owner = resolveActiveEmbeddedRunOwnerByRunId(entry.runId);
	return owner?.sessionKey === entry.childSessionKey && (!entry.childSessionIdentity?.sessionId || owner.sessionId === entry.childSessionIdentity.sessionId) ? owner : void 0;
}
async function captureSubagentReplyExecution(entry) {
	const authority = resolveSubagentChildAuthority(entry);
	if (authority.status === "mismatch") return;
	const [{ resolveReplyOperationsForSession }, { getAttachedBackend }] = await Promise.all([import("./reply-run-registry.registry-BuYY7PcF.mjs"), import("./reply-run-registry.state-DBUjozJK.mjs")]);
	const current = () => resolveReplyOperationsForSession({
		agentId: authority.childAgentId,
		sessionKeys: [entry.childSessionKey],
		sessionId: entry.childSessionIdentity?.sessionId
	}).find((operation) => operation.key === entry.childSessionKey && getAttachedBackend(operation)?.runId === entry.runId);
	const operation = current();
	if (!operation) return;
	const backend = getAttachedBackend(operation);
	const isCurrent = () => current() === operation && getAttachedBackend(operation) === backend;
	return {
		sessionId: operation.sessionId,
		settlement: operation.ownerSettlement,
		isCurrent,
		abort: () => isCurrent() && operation.abortByUser()
	};
}
function captureSubagentExecution(params) {
	const entry = getCurrentSubagentRunOwner(subagentRuns, params.entry) ?? params.entry;
	const resolver = getGatewayContextResolver(entry);
	const context = resolver?.();
	const execution = context && captureChatAbortExecution({
		entries: context.chatAbortControllers,
		runId: entry.runId,
		sessionKey: entry.childSessionKey,
		sessionId: resolveSubagentChildAuthority(entry).status === "legacy-unverified" ? entry.childSessionIdentity?.sessionId ?? context.chatAbortControllers.get(entry.runId)?.sessionId : params.session.entry?.sessionId,
		lifecycleGeneration: entry.execution.lifecycleGeneration
	});
	return context && execution ? {
		entry,
		resolver,
		context,
		runId: entry.runId,
		execution
	} : void 0;
}
/** Retire execution authority while its raw owner still supplies cleanup observation. */
function retireSubagentGatewayBinding(observed) {
	const entry = getCurrentSubagentRunOwner(subagentRuns, observed) ?? observed;
	retireRequesterFollowupAuthority(entry);
	const key = getSubagentRunRuntimeKey(entry);
	const resolver = getGatewayContextResolver(entry);
	try {
		const context = resolver?.();
		const execution = context?.chatAbortControllers.get(entry.runId);
		const settlement = execution?.executionSettlement;
		const { runId, childSessionKey, generation, createdAt } = entry;
		const lifecycleGeneration = entry.execution.lifecycleGeneration;
		if (!resolver || !context || !execution || !settlement || settlement.cleanupSettled || execution.kind !== "agent" || execution.sessionKey !== childSessionKey || entry.childSessionIdentity !== void 0 && execution.sessionId !== entry.childSessionIdentity.sessionId || lifecycleGeneration !== void 0 && execution.lifecycleGeneration !== lifecycleGeneration) return;
		const { sessionId, lifecycleGeneration: executionGeneration } = execution;
		const recordSessionId = entry.childSessionIdentity?.sessionId;
		const sessionLifecycleRevision = entry.childSessionIdentity?.lifecycleRevision;
		const currentEntry = () => getCurrentSubagentRunOwner(subagentRuns, entry) ?? entry;
		const matchesRecord = () => {
			const current = currentEntry();
			return current.runId === runId && current.childSessionKey === childSessionKey && current.generation === generation && current.createdAt === createdAt && current.execution.lifecycleGeneration === lifecycleGeneration && current.childSessionIdentity?.sessionId === recordSessionId && current.childSessionIdentity?.lifecycleRevision === sessionLifecycleRevision;
		};
		const observation = {
			sessionId,
			sessionLifecycleRevision,
			settlement,
			matchesRecord,
			isSelf: () => isCurrentChatAbortExecution(execution),
			isCurrent: () => {
				const current = context.chatAbortControllers.get(runId);
				return matchesRecord() && getGatewayContextResolver(currentEntry()) === void 0 && resolver() === context && execution.sessionKey === childSessionKey && execution.sessionId === sessionId && execution.lifecycleGeneration === executionGeneration && execution.executionSettlement === settlement && (current === execution || current === void 0 && settlement.cleanupSettled);
			}
		};
		executionCleanups.set(key, observation);
		const release = () => {
			if (settlement.cleanupSettled && executionCleanups.get(key) === observation) executionCleanups.delete(key);
		};
		settlement.completion.then(release, release);
	} finally {
		clearGatewayContextResolver(entry);
	}
}
function getSubagentExecutionCleanup(observed, session) {
	const entry = getCurrentSubagentRunOwner(subagentRuns, observed) ?? observed;
	const observation = executionCleanups.get(getSubagentRunRuntimeKey(entry));
	return observation?.sessionId === session?.sessionId && observation?.matchesRecord() && observation.sessionLifecycleRevision === session?.lifecycleRevision ? observation : void 0;
}
function hasRetainedControllerExecution(entry) {
	const retained = executionCleanups.get(getSubagentRunRuntimeKey(entry));
	const cleanup = getSubagentExecutionCleanup(entry, entry.childSessionIdentity ?? (retained && {
		sessionId: retained.sessionId,
		lifecycleRevision: retained.sessionLifecycleRevision
	}));
	if (cleanup && !cleanup.settlement.cleanupSettled) return true;
	const execution = (getGatewayContextResolver(entry)?.())?.chatAbortControllers.get(entry.runId);
	return Boolean(execution && execution.kind === "agent" && execution.sessionKey === entry.childSessionKey && (!entry.childSessionIdentity || execution.sessionId === entry.childSessionIdentity.sessionId) && (entry.execution.lifecycleGeneration === void 0 || execution.lifecycleGeneration === entry.execution.lifecycleGeneration) && execution.executionSettlement && !execution.executionSettlement.cleanupSettled);
}
/** Snapshot topology before cancellation awaits; terminal timestamps never prove cleanup. */
function captureSubagentRetainedWork() {
	const children = /* @__PURE__ */ new Map();
	for (const entry of subagentRuns.values()) {
		const key = resolveControllerSessionKey(entry);
		const group = children.get(key) ?? [];
		group.push(entry);
		children.set(key, group);
	}
	const hasRetainedWork = (entry, visited = /* @__PURE__ */ new Set()) => {
		if (visited.has(entry.runId)) return false;
		visited.add(entry.runId);
		const childAgentId = resolveSubagentChildAgentId(entry);
		return entry.execution.status !== "terminal" || typeof entry.execution.endedAt !== "number" || entry.pauseReason === "sessions_yield" || Boolean(entry.requesterSettleWake) || Boolean(entry.killIntent || entry.killReconciliation || entry.collectorLaunchCleanupPending) || captureSubagentEmbeddedExecution(entry) !== void 0 || hasRetainedControllerExecution(entry) || captureExecRequestCancellation({
			runId: entry.runId,
			sessionKey: entry.childSessionKey,
			sessionId: entry.childSessionIdentity?.sessionId,
			agentId: childAgentId
		}).owners.length > 0 || (children.get(entry.childSessionKey) ?? []).some((child) => (!childAgentId || (parseAgentSessionKey(resolveControllerSessionKey(child))?.agentId ?? child.requesterAgentId) === childAgentId) && hasRetainedWork(child, visited));
	};
	return (entry) => hasRetainedWork(entry);
}
//#endregion
//#region src/agents/subagents/registry/subagent-exec-request-ownership.ts
const requestBindings = /* @__PURE__ */ new WeakMap();
/** Registration publishes this relationship; IDs alone cannot reconstruct it later. */
function bindSubagentExecRequestOwners(entry, owners, controller) {
	const requesterTurnRunId = entry.requesterTurnRunId;
	const selected = requesterTurnRunId ? owners?.filter((owner) => owner.turnRunIds.has(requesterTurnRunId)) : void 0;
	if (!selected?.length) return;
	requestBindings.set(getSubagentRunRuntimeKey(entry), {
		owners: selected,
		controller: { ...controller }
	});
}
/** Selection supplies current request custody or a freshly authorized session origin. */
function readSubagentExecRequestController(entry, acceptsOwner) {
	const binding = requestBindings.get(getSubagentRunRuntimeKey(entry));
	return binding?.owners.some(acceptsOwner) ? binding.controller : void 0;
}
//#endregion
export { captureSubagentReplyExecution as a, retireSubagentGatewayBinding as c, captureSubagentExecution as i, readSubagentExecRequestController as n, captureSubagentRetainedWork as o, captureSubagentEmbeddedExecution as r, getSubagentExecutionCleanup as s, bindSubagentExecRequestOwners as t };
