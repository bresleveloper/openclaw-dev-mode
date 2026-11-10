import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as isSameOpenClawAgentDatabasePath, c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { c as SqliteWorkerError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-CO5zyEkR.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import "./session-key-CSDERtm3.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { i as ConversationDeliveryMissingError } from "./conversation-delivery-policy-BttgDEjN.mjs";
import { n as resolveSqliteReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { i as withSessionActor, r as runSessionActorCommand } from "./session-accessor.sqlite-transcript-turn-CoODj9qI.mjs";
import { a as countPhysicalOutboundSends } from "./deliver-types-ChQJdCfP.mjs";
import { i as normalizeTargetForProvider } from "./target-normalization-Cz6f81yX.mjs";
import { r as getOwedHarnessCompletionTask } from "./agent-harness-completion-recovery-C73KNckX.mjs";
import { i as resolveMessageReceiptPrimaryId, r as listMessageReceiptSourceTargets } from "./receipt-C1maBxgO.mjs";
import { a as markConversationDeliveryRejected, c as markConversationDeliverySuppressed, i as markConversationDeliveryQueued, l as markConversationDeliveryUnknown, s as markConversationDeliverySent } from "./conversation-delivery-store-O6xnH1gE.mjs";
import { n as resolveDeliveryQueueStateEnv } from "./delivery-queue-state-context-jMYRv0Lv.mjs";
import "./delivery-queue-sqlite-BYjmoa0a.mjs";
import { randomUUID } from "node:crypto";
//#region src/infra/outbound/delivery-placement-evidence.ts
/** One logical payload retains every observation before adapter/user callbacks can mutate it. */
function createDeliveryPlacementEvidenceRecorder() {
	const channels = /* @__PURE__ */ new Set();
	const targets = /* @__PURE__ */ new Set();
	const threads = /* @__PURE__ */ new Set();
	let invalid = false;
	return {
		observe(result) {
			for (const target of listMessageReceiptSourceTargets(result)) targets.add(target);
			const seen = /* @__PURE__ */ new Set();
			const pending = [result];
			for (const item of pending) {
				if (!item || typeof item !== "object" || seen.has(item)) continue;
				seen.add(item);
				if (Array.isArray(item)) {
					pending.push(...item);
					continue;
				}
				const record = item;
				invalid ||= record.outcome === "not_sent";
				if (record.channel !== void 0) {
					if (typeof record.channel === "string") {
						if (record.channel.trim()) channels.add(record.channel.trim());
					} else invalid = true;
				}
				if (Array.isArray(record.sourceResults)) {
					for (const source of record.sourceResults) invalid ||= !source || source.outcome === "not_sent" || typeof source.messageId !== "string" || !source.messageId.trim();
					pending.push(...record.sourceResults);
				}
				if (record.threadId !== void 0 && record.threadId !== null) {
					if (typeof record.threadId === "string" || typeof record.threadId === "number") threads.add(String(record.threadId).trim());
					else invalid = true;
				}
				if (Array.isArray(record.parts)) invalid ||= record.parts.some((part) => !part || typeof part.platformMessageId !== "string" || !part.platformMessageId.trim());
				pending.push(record.receipt, record.raw, record.parts);
			}
		},
		snapshot() {
			return Object.freeze({
				channels: Object.freeze([...channels]),
				targets: Object.freeze([...targets]),
				threads: Object.freeze([...threads]),
				invalid
			});
		}
	};
}
function captureDeliveryPlacementEvidence(result) {
	const recorder = createDeliveryPlacementEvidenceRecorder();
	recorder.observe(result);
	return recorder.snapshot();
}
//#endregion
//#region src/infra/outbound/delivery-completion.ts
function captureConversationDeliveryTarget(scope) {
	return {
		workerContext: captureOpenClawStateWorkerContext({ env: scope.env }),
		agentId: scope.agentId,
		databaseAgentId: scope.databaseAgentId,
		storePath: scope.storePath,
		stateDir: resolveStateDir(scope.env),
		...isGatewayExternallySupervised(scope.env) ? { supervisorMode: "external" } : {}
	};
}
function resolveConversationDeliveryScope(completion, stateDir, stateContext, target) {
	const scope = {
		agentId: completion.agentId,
		...completion.storePath ? { storePath: completion.storePath } : {},
		env: resolveDeliveryQueueStateEnv(stateDir, target ?? stateContext)
	};
	if (!target) return scope;
	const options = toDatabaseOptions(resolveSqliteReadScope(scope));
	if (normalizeAgentId(scope.agentId) !== normalizeAgentId(target.agentId) || options.agentId !== target.databaseAgentId || !isSameOpenClawAgentDatabasePath(resolveOpenClawAgentSqlitePath(options), target.storePath)) throw new Error("Conversation delivery target does not match durable custody");
	return {
		...scope,
		storePath: target.storePath,
		databaseAgentId: target.databaseAgentId
	};
}
async function conversationResult(completion, update, stateDir, stateContext, target) {
	let record;
	try {
		record = await update(resolveConversationDeliveryScope(completion, stateDir, stateContext, target));
	} catch (error) {
		if (error instanceof ConversationDeliveryMissingError) return { state: "stale" };
		throw error;
	}
	const delivered = record.status === "sent" || record.status === "replied";
	return {
		state: delivered ? "delivered" : record.status === "suppressed" || record.status === "rejected" || record.status === "unknown" ? record.status : "queued",
		...delivered && (record.platformMessageId || record.preparedMessageId) ? { platformMessageId: record.platformMessageId ?? record.preparedMessageId } : {},
		...record.status === "rejected" && record.rejectionError ? { rejectionError: record.rejectionError } : {}
	};
}
async function settlePendingFinalDelivery(completion, state, expectedStates, options = {}) {
	let settled = "stale";
	let wakeRecovery = false;
	const scope = {
		agentId: completion.agentId,
		sessionKey: completion.sessionKey,
		storePath: completion.storePath,
		env: resolveDeliveryQueueStateEnv(options.stateDir, options.stateContext)
	};
	const settlement = {
		sessionId: completion.sessionId,
		intentId: completion.intentId,
		deliveryId: completion.deliveryId,
		state,
		expectedStates: expectedStates?.slice(),
		...options.clearAfterSettled ? { cleanup: {
			sessionKey: completion.sessionKey,
			recoveryRunId: options.clearAfterSettled.recoveryRunId,
			now: Date.now(),
			preserveActivity: options.preserveActivity
		} } : {}
	};
	const authority = completion.sessionWriterDeliveryAuthority;
	const claim = authority?.harnessCompletion;
	if (completion.agentId !== void 0 && authority?.agentId !== void 0 && normalizeAgentId(authority.agentId) !== normalizeAgentId(completion.agentId)) return { state: "stale" };
	let refused = false;
	let preimage;
	const hasCurrentClaim = (entry, previous = entry) => !claim || Boolean(entry && previous && entry.sessionId === completion.sessionId && entry.pendingFinalDelivery?.intentId === completion.intentId && entry.pendingFinalDelivery.deliveries?.some(({ id }) => id === completion.deliveryId) && authority && authority.sessionKey === completion.sessionKey && (authority.storePath === void 0 || authority.storePath === completion.storePath) && claim.requesterSessionKey === completion.sessionKey && claim.sessionId === completion.sessionId && authority.expectedSessionId === completion.sessionId && (authority.agentId === void 0 || authority.agentId === claim.requesterAgentId) && (completion.agentId === void 0 || normalizeAgentId(claim.requesterAgentId) === normalizeAgentId(completion.agentId)) && (authority.expectedLifecycleRevision === void 0 || authority.expectedLifecycleRevision === entry.lifecycleRevision) && (authority.expectedWriterRunId === void 0 || authority.expectedWriterRunId === entry.activeWriterRunId) && getOwedHarnessCompletionTask(claim, previous));
	const evidence = (entry) => ({
		...claim ? { claim } : {},
		result: resolvePendingFinalResultEvidence(options, entry?.pendingFinalDelivery?.context)
	});
	const live = {
		assertCurrent() {},
		authorize(stage, facts) {
			if (stage === "transaction" || !preimage) preimage = facts.entry;
			if (!hasCurrentClaim(facts.entry, preimage)) {
				refused = true;
				throw new Error("Pending final delivery authority was revoked");
			}
		}
	};
	await withSessionActor(scope, {
		assertCurrent() {},
		assertReadable() {}
	}, async (actor) => {
		let outcome;
		try {
			outcome = await runSessionActorCommand(actor, live, async (snapshot) => {
				const current = snapshot ?? (options.identifiedResult ? await actor.read(live) : void 0);
				return actor.deliverySettled({
					commandId: randomUUID(),
					phaseId: randomUUID(),
					expected: current?.version,
					settlement,
					evidence: evidence(current?.entry)
				}, live);
			});
		} catch (error) {
			if (refused) return;
			throw error;
		}
		if (outcome.kind !== "committed") {
			if (outcome.kind === "rolled-back" && (refused || outcome.reason === "stale-state")) return;
			throw new SqliteWorkerError(outcome.error.message, outcome.kind === "unknown" ? "outcome-unknown" : "unavailable");
		}
		if (!("state" in outcome.value)) throw new Error("Pending final delivery returned another settlement");
		settled = outcome.value.state;
		wakeRecovery = outcome.value.wakeRecovery;
		if (outcome.failure) throw new Error(outcome.failure.message);
	});
	if (wakeRecovery) {
		const { scheduleMainSessionRecoveryPendingTarget } = await import("./main-session-recovery-owner-release-CTieRI3Z.mjs");
		scheduleMainSessionRecoveryPendingTarget({
			...completion.agentId !== void 0 ? { agentId: completion.agentId } : {},
			sessionId: completion.sessionId,
			sessionKey: completion.sessionKey,
			...options.stateDir !== void 0 ? { stateDir: options.stateDir } : {},
			storePath: completion.storePath
		});
	}
	return { state: settled };
}
/** Keep contradictions until every physical send has been checked against captured routing. */
function resolvePendingFinalResultEvidence(options, context) {
	if (!context?.channel || !context.to || !options.identifiedResult) return;
	const expectedTarget = normalizeTargetForProvider(context.channel, context.to);
	const matchesPlacement = (placement) => !placement || !placement.invalid && placement.channels.every((channel) => channel === context.channel) && placement.targets.every((target) => normalizeTargetForProvider(context.channel, target) === expectedTarget) && placement.threads.every((thread) => thread === String(context.threadId ?? "").trim());
	const matches = (result) => result.channel === context.channel && result.outcome !== "not_sent" && Boolean(readPlatformMessageId(result)) && matchesPlacement(captureDeliveryPlacementEvidence(result));
	const batch = options.batch;
	const results = batch?.results ?? [options.identifiedResult];
	if (batch) {
		const indices = new Set(batch.payloadOutcomes.map((outcome) => outcome.index));
		if (batch.payloadCount < 1 || batch.payloadOutcomes.length !== batch.payloadCount || indices.size !== batch.payloadCount || batch.payloadOutcomes.some((outcome) => outcome.index < 0 || outcome.index >= batch.payloadCount || outcome.status !== "sent" || outcome.incompleteReason !== void 0 || !matchesPlacement(outcome.reportedPlacement) || !outcome.results.length || !outcome.results.every(matches))) return;
	}
	if (!results.length || !results.every(matches) || !matches(options.identifiedResult)) return;
	return {
		channel: context.channel,
		platformMessageId: readPlatformMessageId(options.identifiedResult),
		resultCount: countPhysicalOutboundSends(results),
		verifiedContext: structuredClone(context)
	};
}
function readPlatformMessageId(result) {
	return (result.receipt ? resolveMessageReceiptPrimaryId(result.receipt) : void 0) ?? (result.messageId.trim() || void 0);
}
/** Records queue ownership before either the live sender or recovery crosses platform I/O. */
async function markDurableDeliveryQueued(completion, queueId, expectedPendingFinalState, stateDir, stateContext, target) {
	return completion.kind === "pending-final" ? await settlePendingFinalDelivery(completion, "queued", expectedPendingFinalState ? ["prepared", "queued"] : void 0, {
		stateDir,
		stateContext
	}) : conversationResult(completion, (scope) => markConversationDeliveryQueued(scope, completion.operationId, queueId), stateDir, stateContext, target);
}
/** Finalizes owner state from identified platform evidence before queue acknowledgement. */
async function completeDurableDelivery(completion, result, stateDir, stateContext, target, batch) {
	return settleDurableDelivery(completion, {
		result,
		batch
	}, stateDir, stateContext, target);
}
/** Settles the completion owner from the final evidence held by its lifecycle owner. */
async function settleDurableDelivery(completion, evidence, stateDir, stateContext, target) {
	const state = "result" in evidence ? "delivered" : "platformSendStarted" in evidence && evidence.platformSendStarted ? "unknown" : "suppressed";
	return completion.kind === "pending-final" ? await settlePendingFinalDelivery(completion, state, void 0, {
		stateDir,
		stateContext,
		..."result" in evidence ? {
			identifiedResult: evidence.result,
			batch: evidence.batch
		} : {}
	}) : conversationResult(completion, (scope) => {
		if ("result" in evidence) return markConversationDeliverySent(scope, completion.operationId, readPlatformMessageId(evidence.result));
		if ("rejectionError" in evidence) return markConversationDeliveryRejected(scope, completion.operationId, evidence.rejectionError);
		return evidence.platformSendStarted ? markConversationDeliveryUnknown(scope, completion.operationId) : markConversationDeliverySuppressed(scope, completion.operationId);
	}, stateDir, stateContext, target);
}
//#endregion
export { settleDurableDelivery as a, resolveConversationDeliveryScope as i, completeDurableDelivery as n, settlePendingFinalDelivery as o, markDurableDeliveryQueued as r, createDeliveryPlacementEvidenceRecorder as s, captureConversationDeliveryTarget as t };
