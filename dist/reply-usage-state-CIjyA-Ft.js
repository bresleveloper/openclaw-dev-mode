import { y as loadSessionEntry } from "./session-accessor-CwhXEUId.js";
import { _ as replyRunRegistry, b as retainReplyOperationUntilComplete, n as ReplyRunAlreadyActiveError, r as ReplyRunFollowupAdmissionBlockedError, s as createReplyOperation, w as waitForReplyRunFollowupAdmission, x as runAfterReplyOperationClear } from "./reply-run-registry-CioKebTS.js";
import { c as resolveSessionWorkStartError } from "./lifecycle-BS_t5emX.js";
import { t as deriveContextPromptTokens } from "./usage-BJjt0RVM.js";
import { i as resolveModelCostConfig, t as estimateUsageCost } from "./usage-format-CyE-btXR.js";
import { n as resolveAgentIdentity } from "./identity-BfKoTsep.js";
import { n as beginSessionWorkAdmission } from "./session-lifecycle-admission-DfdITEs1.js";
//#region src/auto-reply/reply/reply-turn-admission.ts
var QueuedFollowupLifecycleInvalidatedError = class extends Error {};
const lifecycleAdmissionByOperation = /* @__PURE__ */ new WeakMap();
/** Runs owner work with its admission marked as the initiating lifecycle context. */
async function runWithReplyOperationLifecycleAdmission(operation, run) {
	const admission = operation ? lifecycleAdmissionByOperation.get(operation) : void 0;
	return admission ? await admission.run(run) : await run();
}
function rejectLifecycleInvalidatedWork(params) {
	if (params.kind === "queued_followup") throw new QueuedFollowupLifecycleInvalidatedError(params.message);
	throw new Error(params.message);
}
function isAbortSignalAborted(signal) {
	return signal?.aborted === true;
}
/** Waits for or claims the per-session reply run slot. */
async function admitReplyTurn(params) {
	let sessionId = params.sessionId;
	let expectedSessionId = params.expectedSessionId;
	const waitTimeoutMs = params.waitTimeoutMs ?? (params.kind === "queued_followup" ? 15e3 : void 0);
	const waitForFollowupAdmission = async (wait) => {
		params.onFollowupAdmissionWaitChange?.(true);
		try {
			return await wait();
		} finally {
			params.onFollowupAdmissionWaitChange?.(false);
		}
	};
	while (true) {
		if (isAbortSignalAborted(params.upstreamAbortSignal)) return {
			status: "skipped",
			reason: "aborted"
		};
		try {
			const storePath = params.storePath;
			let operation;
			let admittedSessionEntry;
			let interruptedBeforeOperation = false;
			const admission = storePath ? await beginSessionWorkAdmission({
				scope: storePath,
				identities: [params.sessionKey],
				signal: params.upstreamAbortSignal,
				onInterrupt: () => {
					interruptedBeforeOperation = true;
					operation?.abortForRestart();
					params.onLifecycleInterrupt?.();
				},
				assertAllowed: () => {
					const currentEntry = loadSessionEntry({
						storePath,
						sessionKey: params.sessionKey,
						readConsistency: "latest"
					});
					admittedSessionEntry = currentEntry;
					if (expectedSessionId && !currentEntry) rejectLifecycleInvalidatedWork({
						kind: params.kind,
						message: `Session "${params.sessionKey}" was deleted while starting work. Retry.`
					});
					const registeredOperation = replyRunRegistry.get(params.sessionKey);
					const rotationOperation = [registeredOperation, params.expectedActiveOperation].find((candidate) => {
						if (!candidate || !expectedSessionId || currentEntry?.sessionId !== candidate.sessionId || !candidate.hasOwnedSessionId(expectedSessionId)) return false;
						if (candidate.result?.kind === "aborted" && candidate.result.code === "aborted_for_restart") return false;
						return candidate === registeredOperation || candidate.result !== null;
					});
					const activeOperationRotatedExpectedSession = Boolean(rotationOperation && currentEntry?.sessionId === rotationOperation.sessionId);
					if (expectedSessionId && currentEntry?.sessionId !== expectedSessionId && !activeOperationRotatedExpectedSession) rejectLifecycleInvalidatedWork({
						kind: params.kind,
						message: `Session "${params.sessionKey}" changed while starting work. Retry.`
					});
					if (activeOperationRotatedExpectedSession) expectedSessionId = currentEntry?.sessionId;
					const archivedSessionError = resolveSessionWorkStartError(params.sessionKey || sessionId, currentEntry);
					if (archivedSessionError) rejectLifecycleInvalidatedWork({
						kind: params.kind,
						message: archivedSessionError
					});
					sessionId = currentEntry?.sessionId ?? sessionId;
				}
			}) : void 0;
			if (interruptedBeforeOperation) {
				admission?.release();
				rejectLifecycleInvalidatedWork({
					kind: params.kind,
					message: `Session "${params.sessionKey}" changed while starting work. Retry.`
				});
			}
			try {
				operation = createReplyOperation({
					sessionKey: params.sessionKey,
					sessionId,
					resetTriggered: params.resetTriggered,
					routeThreadId: params.routeThreadId,
					upstreamAbortSignal: params.upstreamAbortSignal,
					respectFollowupAdmissionBarrier: params.kind === "queued_followup" || params.kind === "heartbeat"
				});
			} catch (error) {
				if (error instanceof ReplyRunAlreadyActiveError && admission && params.retainLifecycleAdmissionOnActive) return {
					status: "skipped",
					reason: "active-run",
					activeOperation: replyRunRegistry.get(params.sessionKey),
					lifecycleAdmission: admission
				};
				admission?.release();
				throw error;
			}
			if (admission) {
				retainReplyOperationUntilComplete(operation);
				lifecycleAdmissionByOperation.set(operation, admission);
				runAfterReplyOperationClear(operation, () => {
					lifecycleAdmissionByOperation.delete(operation);
					admission.release();
				});
			}
			return {
				status: "owned",
				operation,
				...admittedSessionEntry ? { sessionEntry: admittedSessionEntry } : {}
			};
		} catch (error) {
			if (isAbortSignalAborted(params.upstreamAbortSignal)) return {
				status: "skipped",
				reason: "aborted"
			};
			if (error instanceof QueuedFollowupLifecycleInvalidatedError) return {
				status: "skipped",
				reason: "lifecycle-invalidated"
			};
			if (error instanceof ReplyRunFollowupAdmissionBlockedError) {
				if (params.kind === "heartbeat") return {
					status: "skipped",
					reason: "active-run"
				};
				const followupAdmission = await waitForFollowupAdmission(() => waitForReplyRunFollowupAdmission(params.sessionKey, waitTimeoutMs ?? 15e3, { signal: params.upstreamAbortSignal }));
				if (!followupAdmission.settled) return {
					status: "skipped",
					reason: isAbortSignalAborted(params.upstreamAbortSignal) ? "aborted" : "active-run"
				};
				sessionId = followupAdmission.sessionId ?? sessionId;
				if (expectedSessionId && followupAdmission.sessionId) expectedSessionId = followupAdmission.sessionId;
				continue;
			}
			if (!(error instanceof ReplyRunAlreadyActiveError)) throw error;
			const activeOperation = replyRunRegistry.get(params.sessionKey);
			if (params.kind === "heartbeat" || params.kind === "control_abort") return {
				status: "skipped",
				reason: "active-run",
				activeOperation
			};
			if (params.waitForActive === false) return {
				status: "skipped",
				reason: "active-run",
				activeOperation
			};
			if (!await replyRunRegistry.waitForIdle(params.sessionKey, waitTimeoutMs, { signal: params.upstreamAbortSignal })) return {
				status: "skipped",
				reason: isAbortSignalAborted(params.upstreamAbortSignal) ? "aborted" : "active-run",
				activeOperation
			};
			if (activeOperation) {
				sessionId = activeOperation.sessionId;
				if (expectedSessionId && !(activeOperation.result?.kind === "aborted" && activeOperation.result.code === "aborted_for_restart")) expectedSessionId = activeOperation.sessionId;
			}
		}
	}
}
/** Resolves the default turn kind from reply options. */
function resolveReplyTurnKind(opts) {
	return opts?.isHeartbeat === true ? "heartbeat" : "visible";
}
//#endregion
//#region src/auto-reply/reply/reply-usage-state.ts
const TTL_MS = 5 * 6e4;
const store = /* @__PURE__ */ new Map();
function buildReplyUsageState(params) {
	const resolvedProvider = params.fallbackExhausted ? void 0 : params.winnerProvider;
	const resolvedModel = params.fallbackExhausted ? void 0 : params.winnerModel;
	const hasBillableUsageBuckets = params.usage && (params.usage.input !== void 0 || params.usage.output !== void 0 || params.usage.cacheRead !== void 0 || params.usage.cacheWrite !== void 0);
	return {
		provider: params.provider,
		model: params.model,
		resolvedRef: resolvedProvider && resolvedModel ? `${resolvedProvider}/${resolvedModel}` : void 0,
		reasoningEffort: params.reasoningEffort,
		fastMode: params.fastMode,
		fallbackUsed: params.fallbackUsed,
		agentId: params.agentId,
		sessionId: params.sessionId,
		chatType: params.chatType,
		authMode: params.authMode,
		overrideSource: params.overrideSource,
		requested: params.requestedProvider && params.requestedModel ? `${params.requestedProvider}/${params.requestedModel}` : void 0,
		turnUsd: hasBillableUsageBuckets ? estimateUsageCost({
			usage: params.usage,
			cost: resolveModelCostConfig({
				provider: params.provider,
				model: params.model,
				config: params.config
			})
		}) : void 0,
		durationMs: params.durationMs,
		identity: resolveAgentIdentity(params.config, params.agentId),
		compactionCount: params.compactionCount,
		contextTokenBudget: typeof params.contextTokenBudget === "number" && Number.isFinite(params.contextTokenBudget) ? params.contextTokenBudget : void 0,
		contextUsedTokens: typeof params.contextUsedTokens === "number" && Number.isFinite(params.contextUsedTokens) ? params.contextUsedTokens : deriveContextPromptTokens({
			lastCallUsage: params.lastCallUsage,
			promptTokens: params.promptTokens,
			usage: params.usage
		}),
		usage: params.usage ? {
			input: params.usage.input,
			output: params.usage.output,
			cacheRead: params.usage.cacheRead,
			cacheWrite: params.usage.cacheWrite,
			total: params.usage.total
		} : void 0,
		lastUsage: params.lastCallUsage ? {
			input: params.lastCallUsage.input,
			output: params.lastCallUsage.output,
			cacheRead: params.lastCallUsage.cacheRead,
			cacheWrite: params.lastCallUsage.cacheWrite,
			total: params.lastCallUsage.total
		} : void 0
	};
}
function prune(now) {
	for (const [key, value] of store) if (value.expiresAt < now) store.delete(key);
}
function recordReplyUsageState(runId, snapshot) {
	if (!runId) return;
	const now = Date.now();
	store.set(runId, {
		snapshot,
		expiresAt: now + TTL_MS
	});
	prune(now);
}
function consumeReplyUsageState(runId) {
	if (!runId) return;
	const value = store.get(runId);
	return value && value.expiresAt >= Date.now() ? value.snapshot : void 0;
}
//#endregion
export { resolveReplyTurnKind as a, admitReplyTurn as i, consumeReplyUsageState as n, runWithReplyOperationLifecycleAdmission as o, recordReplyUsageState as r, buildReplyUsageState as t };
