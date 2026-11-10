import { t as normalizeChatType } from "./chat-type-qwvaeaJu.mjs";
import { t as deriveSessionChatTypeFromKey } from "./session-chat-type-shared-B18DLTwm.mjs";
import { r as sessionDeliveryOrigin } from "./delivery-context.read-CR06zOJ4.mjs";
import { a as RUNTIME_EVENT_USER_PROMPT } from "./internal-runtime-context-DLJtDQoI.mjs";
import { h as loadPendingFinalDeliveryPayload, k as isSameSubagentRunOwner, u as ensureDeliveryState } from "./subagent-session-read-scope-7jPlY84h.mjs";
import { h as subagentRuns } from "./subagent-registry-memory-DE7WJHOr.mjs";
import { S as readFullSubagentRuns, x as assertSubagentReadContext } from "./subagent-registry-state-DBdy-FdI.mjs";
import { i as resolveSourceReplyDeliveryMode } from "./source-reply-delivery-mode-CrUQzco9.mjs";
import { a as SessionDeliveryDeferredError, c as prepareClaimedSessionDelivery, i as SessionDeliveryDeadLetteredError } from "./session-delivery-queue.records-mSSKRg96.mjs";
import { m as withSessionDeliveryEnqueueAdmission } from "./session-delivery-queue-storage-BfVLAorZ.mjs";
import { a as assertSubagentRegistryWriteSourceCurrent } from "./subagent-registry-persistence-DE7WA4wN.mjs";
import { g as blockSubagentCompletionDelivery, h as admitSubagentCompletionDelivery, m as SubagentCompletionSourceChangedError, y as settleSubagentCompletionDelivery } from "./subagent-registry-helpers-VSGp2TQD.mjs";
import { t as resolveSubagentCompletionResultText } from "./subagent-completion-result-0vYVKpy4.mjs";
import { t as SUBAGENT_COMPLETION_OUTCOME_INSTRUCTION } from "./subagent-completion-instructions-B70YK2BV.mjs";
//#region src/auto-reply/reply/completion-delivery-policy.ts
const COMPLETION_TARGET_CHAT_TYPES = /* @__PURE__ */ new Map([
	["group:", "group"],
	["channel:", "channel"],
	["thread:", "channel"],
	["dm:", "direct"],
	["direct:", "direct"],
	["user:", "direct"]
]);
function resolveCompletionChatType(params) {
	const explicit = normalizeChatType(params.requesterEntry?.chatType ?? sessionDeliveryOrigin(params.requesterEntry)?.chatType);
	if (explicit) return explicit;
	for (const key of [params.targetRequesterSessionKey, params.requesterSessionKey]) {
		const derived = deriveSessionChatTypeFromKey(key);
		if (derived !== "unknown") return derived;
	}
	const target = (params.directOrigin?.to ?? params.requesterSessionOrigin?.to)?.trim().toLowerCase() ?? "";
	const prefix = target.slice(0, target.indexOf(":") + 1);
	return COMPLETION_TARGET_CHAT_TYPES.get(prefix) ?? "unknown";
}
function completionRequiresMessageToolDelivery(params) {
	return resolveSourceReplyDeliveryMode({
		cfg: params.cfg,
		ctx: { ChatType: resolveCompletionChatType(params) },
		messageToolAvailable: params.messageToolAvailable
	}) === "message_tool_only";
}
/** Resolve transport authority for a durable, fixed-route agent completion. */
function resolveDurableCompletionDeliveryMode(sourceReplyDeliveryMode) {
	return sourceReplyDeliveryMode === "message_tool_only" ? "host_owned" : "automatic";
}
//#endregion
//#region src/agents/subagents/completion/subagent-completion-delivery.ts
const CLAIM_LEASE_MS = 125e3;
const CANONICAL_RESULT_PROMPT = `A completed subagent task is ready for parent review. ${SUBAGENT_COMPLETION_OUTCOME_INSTRUCTION} The result follows.`;
/** Atomically admits a queue generation and publishes process mirrors only after commit. */
async function admitCorrelatedSubagentSessionDelivery(params) {
	const payload = structuredClone(params.payload);
	const runId = params.runId;
	const context = params.queueContext;
	const expected = subagentRuns.get(runId);
	return withSessionDeliveryEnqueueAdmission(payload, context, async (assertCurrent) => {
		return admitSubagentCompletionDelivery({
			runId,
			context,
			assertCurrent() {
				assertCurrent();
				if (!isSameSubagentRunOwner(subagentRuns.get(runId), expected)) throw new SubagentCompletionSourceChangedError("Subagent completion owner changed during enqueue admission");
			},
			plan(current) {
				const now = Date.now();
				const subagent = structuredClone(current);
				const delivery = ensureDeliveryState(subagent);
				const generation = delivery.generation ?? 1;
				const windowStartedAt = delivery.windowStartedAt ?? subagent.execution.endedAt ?? now;
				const deadlineAt = delivery.deadlineAt ?? windowStartedAt + 18e5;
				const generationSuffix = generation > 1 ? `:generation:${generation}` : "";
				const queueEntry = prepareClaimedSessionDelivery({
					...payload,
					idempotencyKey: `${payload.idempotencyKey ?? payload.messageId}${generationSuffix}`,
					messageId: `${payload.messageId}${generationSuffix}`,
					message: CANONICAL_RESULT_PROMPT,
					maxRetries: Number.MAX_SAFE_INTEGER,
					owner: {
						kind: "subagent_completion",
						runId: subagent.runId,
						taskId: subagent.taskRunId ?? subagent.runId,
						generation,
						deadlineAt
					}
				}, CLAIM_LEASE_MS, now);
				Object.assign(delivery, {
					status: "in_progress",
					disposition: "session_queued",
					generation,
					queueId: queueEntry.id,
					windowStartedAt,
					deadlineAt,
					nextAttemptAt: queueEntry.availableAt,
					enqueuedAt: now
				});
				delivery.payload ??= loadPendingFinalDeliveryPayload(subagent);
				return {
					queueEntry,
					subagent
				};
			}
		});
	});
}
function resolveCorrelatedSubagentDelivery(queued) {
	if (queued.kind !== "agentTurn" || queued.owner?.kind !== "subagent_completion") return queued;
	if (Date.now() >= queued.owner.deadlineAt) throw new SessionDeliveryDeadLetteredError("correlated subagent completion delivery deadline expired");
	const entry = subagentRuns.get(queued.owner.runId);
	if (!entry || entry.delivery?.queueId !== queued.id || entry.delivery.generation !== queued.owner.generation || entry.delivery.deadlineAt !== queued.owner.deadlineAt) throw new SessionDeliveryDeferredError("correlated subagent delivery owner mismatch");
	const result = resolveSubagentCompletionResultText(entry) ?? "(no output)";
	return {
		...queued,
		message: RUNTIME_EVENT_USER_PROMPT,
		runtimeContextFragments: [{
			kind: "runtime-instruction",
			text: CANONICAL_RESULT_PROMPT
		}, {
			kind: "conversation-data",
			text: result
		}]
	};
}
async function settleCorrelatedSubagentDelivery(queued, outcome, queueContext) {
	if (queued.kind !== "agentTurn" || queued.owner?.kind !== "subagent_completion") return;
	const queueOwner = queued.owner;
	assertSubagentReadContext(queueContext);
	if (!subagentRuns.has(queued.owner.runId)) {
		const persisted = await readFullSubagentRuns(queueContext, {
			kind: "ids",
			runIds: [queued.owner.runId]
		}, { current: true });
		assertSubagentReadContext(queueContext);
		if (persisted.has(queued.owner.runId) && !subagentRuns.has(queued.owner.runId)) throw new Error("Subagent completion recovery is waiting for registry restoration");
	}
	const current = subagentRuns.get(queued.owner.runId);
	const alreadyDelivered = outcome === "recovered" && current?.delivery?.status === "delivered" && current.delivery.queueId === void 0;
	if (!current || current.delivery?.generation !== queued.owner.generation || !alreadyDelivered && current.delivery.queueId !== queued.id) return;
	const readMatchingDeliveryOwner = () => {
		const latest = subagentRuns.get(current.runId);
		if (!latest) throw new Error("Subagent completion recovery is waiting for registry restoration");
		if (!isSameSubagentRunOwner(latest, current) || latest.delivery?.generation !== queueOwner.generation) return;
		return latest;
	};
	if (outcome !== "recovered") {
		await blockSubagentCompletionDelivery({
			context: queueContext,
			subagent: current,
			reason: queued.lastError ?? "completion delivery failed",
			suspendedReason: "permanent_failure"
		});
		return;
	}
	await settleSubagentCompletionDelivery({
		subagent: current,
		queueId: queued.id,
		context: queueContext
	});
	assertSubagentRegistryWriteSourceCurrent(queueContext);
	const published = readMatchingDeliveryOwner();
	if (!published) return;
	if (published.delivery?.status !== "delivered" || published.delivery.queueId !== void 0) throw new Error("Subagent completion recovery is waiting for committed publication");
	const { resumeSubagentRun } = await import("./subagent-registry-BSZR34Tv.mjs");
	assertSubagentRegistryWriteSourceCurrent(queueContext);
	const latest = readMatchingDeliveryOwner();
	if (!latest) return;
	if (latest.delivery?.status !== "delivered" || latest.delivery.queueId !== void 0) throw new Error("Subagent completion recovery owner changed before cleanup resumed");
	resumeSubagentRun(current.runId);
}
//#endregion
export { resolveDurableCompletionDeliveryMode as a, completionRequiresMessageToolDelivery as i, resolveCorrelatedSubagentDelivery as n, settleCorrelatedSubagentDelivery as r, admitCorrelatedSubagentSessionDelivery as t };
