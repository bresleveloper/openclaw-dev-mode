import { T as parseSessionDeliveryRoute, k as normalizeSessionPeerId } from "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { h as fireAndForgetHook } from "./hooks-DuXrq03h.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-DlvY8FQy.mjs";
import { s as getReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import { a as countPhysicalOutboundSends, i as areOutboundPayloadsIntentionallySuppressed, n as OutboundDeliveryError, o as isOutboundDeliveryAdmissionClosedError, r as PlatformMessageNotDispatchedError, s as isOutboundDeliveryError, t as OutboundDeliveryAdmissionClosedError } from "./deliver-types-Diy-VQKA.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { n as stripOutboundTargetKindPrefix, r as stripTargetProviderPrefix, t as resolveTargetPrefixedChannel } from "./channel-target-prefix-BJKXiLk4.mjs";
import { a as getErrnoCode, c as isProvenDeliveryNotSentError, d as resolveDeliveryRecoveryDeadlineMs, i as findPlatformMessageRejectedError, n as createDeliveryRecoveryCoordinator, r as createEmptyDeliveryRecoverySummary, s as isDeliveryRecoveryRetryEligible, u as resolveDeliveryNotSentRetryability } from "./delivery-recovery.shared-f5deCrTJ.mjs";
import { a as rejectDurableDelivery, i as markDurableDeliveryQueued, n as completeDurableDelivery, r as failDurableDelivery, s as settleDurableDelivery } from "./delivery-completion-DxLFTv-D.mjs";
import { r as getOwedHarnessCompletionTask } from "./agent-harness-completion-recovery-Dh-XCinc.mjs";
import { t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-5XnUHpKM.mjs";
import "./delivery-queue-sqlite-BghoE75G.mjs";
import { d as toPluginMessageSentEvent, l as toPluginMessageContext, o as toInternalMessageSentContext, t as buildCanonicalSentMessageHookContext } from "./message-hook-mappers-OANlfuGW.mjs";
import { a as runOutboundDeliveryCommitHooks, i as isOutboundDeliveryResultArray, l as buildPayloadSummary, n as reconcileUnknownQueuedDelivery, o as OutboundHandoffRejectedError, t as buildUnknownSendContext } from "./delivery-queue-reconciliation-CRIys7F4.mjs";
import { n as createInternalHookEvent, u as triggerInternalHook } from "./internal-hooks-B-eMkNRp.mjs";
import { n as hasTrustedMessageAuditListeners, t as emitTrustedMessageAuditEvent } from "./message-audit-events-1aZ8RQoU.mjs";
import { n as resolveOutboundChannelMessageAdapter } from "./channel-resolution-CsLQpkZM.mjs";
import { g as acceptedPreparedOutboundEntries } from "./delivery-queue-sqlite-namespace.kernel-CbSzRfE6.mjs";
import { C as stageDeliveryFailureSettlement, N as retireUnsentDelivery, O as claimDeliveryPlatformSendAttempt, S as restoreDeliveryAttemptBeforeDispatch, _ as markDeliveryPlatformOutcomeUnknown, a as failDeliveryAfterPlatformSend, b as moveToFailed, f as loadPendingDelivery, g as loadUnfinishedDelivery, h as loadUnfinishedDeliveries, i as failDelivery, j as ackDelivery, o as failDeliveryBeforePlatformSend, s as finalizeDeliveryFailureSettlement, u as hasActiveDeliveryOwner, v as markDeliveryPlatformSendAttemptStarted, x as reserveDeliveryAttempt } from "./delivery-queue-storage-Cpr0qrGT.mjs";
import { n as collectEntrySpoolPaths } from "./delivery-queue-media-paths-BxTKmyok.mjs";
import { n as createDeliveryQueueMediaRetention, t as cancelDeliveryQueueMediaRetention } from "./delivery-queue-media-staging-CNnanQB_.mjs";
import { n as releaseSpoolArtifacts } from "./delivery-queue-media-spool-Ybjx6uOd.mjs";
//#region src/auto-reply/reply/session-writer-delivery-authority.ts
var SessionWriterDeliveryRevokedError = class extends PlatformMessageNotDispatchedError {
	constructor() {
		super("Session writer changed before final reply delivery", {
			cause: void 0,
			retryable: false
		});
		this.name = "SessionWriterDeliveryRevokedError";
	}
};
function isAuthorityCurrent(authority, fallbackStorePath) {
	const storePath = authority.storePath ?? fallbackStorePath;
	const current = storePath ? loadSessionEntryReadOnly({
		...authority.agentId ? { agentId: authority.agentId } : {},
		readConsistency: "latest",
		sessionKey: authority.sessionKey,
		storePath
	}) : void 0;
	const writerIsCurrent = Boolean(current && current.sessionId === authority.expectedSessionId && (authority.expectedLifecycleRevision === void 0 || current.lifecycleRevision === authority.expectedLifecycleRevision) && (authority.expectedWriterRunId === void 0 || current.activeWriterRunId === authority.expectedWriterRunId));
	if (!writerIsCurrent || !authority.harnessCompletion) return writerIsCurrent;
	const claim = authority.harnessCompletion;
	if (!current || claim.requesterSessionKey !== authority.sessionKey || authority.agentId !== void 0 && claim.requesterAgentId !== authority.agentId) return false;
	try {
		return Boolean(getOwedHarnessCompletionTask(claim, current));
	} catch {
		return false;
	}
}
/** Revalidates a settled final payload against the latest committed session writer. */
function isDispatchFinalReplySessionWriterAuthorized(payload, fallbackStorePath, fallbackSessionKey) {
	const authority = getReplyPayloadMetadata(payload)?.sessionWriterDeliveryAuthority;
	if (!authority) return true;
	const authorized = isAuthorityCurrent(authority, fallbackStorePath);
	if (!authorized) logVerbose(`final reply skipped after session writer replacement (session=${fallbackSessionKey ?? authority.sessionKey})`);
	return authorized;
}
/** Fails closed at the provider's last pre-I/O boundary when writer ownership changed. */
function assertSessionWriterDeliveryAuthorized(authority, fallbackStorePath) {
	if (authority && !isAuthorityCurrent(authority, fallbackStorePath)) throw new SessionWriterDeliveryRevokedError();
}
/** Fails closed at the provider's last pre-I/O boundary for an authority-bearing payload. */
function assertReplyPayloadSessionWriterDeliveryAuthorized(payload, fallbackStorePath) {
	const authority = getReplyPayloadMetadata(payload)?.sessionWriterDeliveryAuthority;
	assertSessionWriterDeliveryAuthorized(authority, fallbackStorePath);
}
//#endregion
//#region src/infra/outbound/deferred-delivery-admission.ts
async function prepareDeferredDeliveryAdmission(params, owner) {
	const adapter = await resolveOutboundChannelMessageAdapter({
		channel: params.channel,
		cfg: params.cfg,
		agentId: owner?.agentId,
		allowBootstrap: true,
		assertCurrent: owner?.assertCurrent
	});
	return () => {
		owner?.assertCurrent?.();
		return adapter?.durableFinal?.admitDeferredDelivery?.(params) ?? { status: "allowed" };
	};
}
//#endregion
//#region src/infra/outbound/deliver-log.ts
const OUTBOUND_DELIVERY_LOG_SCOPE = ["deliver", "OutboundPayloads"].join("");
//#endregion
//#region src/infra/outbound/deliver-queue-state.ts
const log$1 = createSubsystemLogger("outbound/deliver");
/** Keeps live and recovered queue transitions on the same producer claim. */
function createQueuedDeliveryOwner(params, context) {
	let custody = "held";
	const owner = {
		queueId: params.queueId,
		stateDir: context?.stateDir ?? params.stateDir,
		claimId: params.expectedPlatformSendAttemptId,
		signal: params.signal,
		get custody() {
			return custody;
		},
		project(error, evidence) {
			const failure = error instanceof OutboundDeliveryError ? error : new OutboundDeliveryError(formatErrorMessage(error), {
				cause: error,
				...evidence
			});
			failure.queueCustody = custody;
			return failure;
		},
		retireUnsent(terminalOutcome) {
			owner.signal?.throwIfAborted();
			if (!owner.claimId) return;
			const release = retireUnsentDelivery({
				id: owner.queueId,
				producerClaimId: owner.claimId,
				stateDir: owner.stateDir
			}, context, terminalOutcome);
			if (release) custody = "released";
			return release;
		},
		async ack(options) {
			owner.signal?.throwIfAborted();
			await ackDelivery(owner.queueId, owner.stateDir, {
				...options,
				...owner.claimId !== void 0 ? { expectedPlatformSendAttemptId: owner.claimId } : {}
			}, context);
			custody = "released";
		},
		finalizeFailure(entry) {
			if (entry.id !== owner.queueId || !finalizeDeliveryFailureSettlement(entry, owner.stateDir, context)) return false;
			custody = "released";
			return true;
		},
		fail(record, error) {
			owner.signal?.throwIfAborted();
			const recordInState = record === failDelivery ? failDelivery : record === failDeliveryAfterPlatformSend ? failDeliveryAfterPlatformSend : record === failDeliveryBeforePlatformSend ? failDeliveryBeforePlatformSend : void 0;
			return recordInState ? recordInState(owner.queueId, error, owner.stateDir, owner.claimId, context) : record(owner.queueId, error, owner.stateDir, owner.claimId);
		},
		async retire() {
			owner.signal?.throwIfAborted();
			const spooled = await moveToFailed(owner.queueId, owner.stateDir, owner.claimId ?? null, context);
			custody = "released";
			await releaseSpoolArtifacts(spooled, owner.stateDir);
		}
	};
	return owner;
}
function findTerminalBatchRejection(errors) {
	if (errors.length === 0 || !errors.every(isProvenDeliveryNotSentError)) return;
	return errors.find((error) => error instanceof OutboundHandoffRejectedError) ?? (errors.every((error) => resolveDeliveryNotSentRetryability(error) === false) ? findPlatformMessageRejectedError(errors[0]) : void 0);
}
function isProvenBatchNotSent(error, outcomes) {
	return isProvenDeliveryNotSentError(error) && outcomes.every((outcome) => outcome.status === "failed" ? !outcome.sentBeforeError && isProvenDeliveryNotSentError(outcome.error) : outcome.status === "suppressed" && outcome.reason !== "adapter_returned_no_identity");
}
async function rejectQueuedDelivery(owner, rejection, params, terminals) {
	try {
		owner.signal?.throwIfAborted();
		const pending = await loadPendingDelivery(owner.queueId, owner.stateDir, params.deliveryQueueStateContext);
		if (!pending || !owner.claimId) return false;
		let entry;
		try {
			entry = await stageDeliveryFailureSettlement(pending, {
				outcome: "failed",
				error: rejection.message,
				rejectionError: rejection.message,
				terminals
			}, owner.stateDir, owner.claimId, params.deliveryQueueStateContext);
		} catch (error) {
			const release = owner.retireUnsent("failed");
			if (!release) throw error;
			await release();
			return true;
		}
		if (!entry) return false;
		if (entry.deliveryCompletion) await rejectDurableDelivery(entry.deliveryCompletion, rejection.message, owner.stateDir, params.deliveryQueueStateContext, params.conversationDeliveryTarget);
		const spoolPaths = collectEntrySpoolPaths(acceptedPreparedOutboundEntries(entry.preparedBatch).map((prepared) => prepared.payload), owner.stateDir);
		if (!owner.finalizeFailure(entry)) return false;
		await releaseSpoolArtifacts(spoolPaths, owner.stateDir);
	} catch (error) {
		log$1.warn(`failed to finalize permanently rejected delivery ${owner.queueId}: ${formatErrorMessage(error)}`);
	}
	return owner.custody === "released";
}
async function persistQueuedPreSendState(params, context) {
	const { owner } = params;
	owner.signal?.throwIfAborted();
	try {
		const route = { replyToId: params.route.replyToId ?? null };
		if (owner.claimId) await markDeliveryPlatformSendAttemptStarted(owner.queueId, owner.stateDir, route, owner.claimId, context);
		else await markDeliveryPlatformSendAttemptStarted(owner.queueId, owner.stateDir, route, void 0, context);
		return "marked";
	} catch (markErr) {
		if (params.queuePolicy === "required") throw markErr;
		log$1.warn(`failed to mark queued delivery ${owner.queueId} as platform-send-attempt-started; removing replay intent before best-effort send: ${formatErrorMessage(markErr)}`);
		await owner.ack(params.retainSpoolArtifacts ? { retainSpoolArtifacts: true } : void 0);
		return "acked";
	}
}
async function persistQueuedPostSendState(params, context) {
	const { owner } = params;
	owner.signal?.throwIfAborted();
	try {
		await markDeliveryPlatformOutcomeUnknown(owner.queueId, owner.stateDir, owner.claimId, context);
		return "marked";
	} catch (markErr) {
		if (params.preserveBatch) {
			await owner.fail(failDeliveryAfterPlatformSend, `post-send state persistence failed: ${formatErrorMessage(markErr)}`);
			return "failed";
		}
		params.onPostSendMarkerError?.(markErr);
		log$1.warn(`failed to mark queued delivery ${owner.queueId} as platform-outcome-unknown; falling back to direct ack (${params.queuePolicy}): ${formatErrorMessage(markErr)}`);
		try {
			await owner.ack(params.retainSpoolArtifacts ? { retainSpoolArtifacts: true } : void 0);
			return "acked";
		} catch (ackErr) {
			const error = `post-send state persistence failed: marker=${formatErrorMessage(markErr)}; ack=${formatErrorMessage(ackErr)}`;
			await owner.fail(failDeliveryAfterPlatformSend, error);
			return "failed";
		}
	}
}
//#endregion
//#region src/infra/outbound/message-sent-hook.ts
const log = createSubsystemLogger("outbound/message-sent-hook");
/** Creates a best-effort emitter shared by direct and inbound-turn delivery owners. */
function createMessageSentEmitter(params) {
	const hasMessageSentHooks = params.hookRunner?.hasHooks("message_sent") ?? false;
	const canEmitInternalHook = Boolean(params.sessionKeyForInternalHooks);
	const emitMessageSent = (event) => {
		if (!hasMessageSentHooks && !canEmitInternalHook) return;
		const canonical = buildCanonicalSentMessageHookContext({
			to: params.to,
			content: event.content,
			success: event.success,
			error: event.error,
			channelId: params.channel,
			accountId: params.accountId,
			conversationId: params.to,
			sessionKey: params.sessionKeyForInternalHooks,
			runId: params.runId,
			messageId: event.messageId,
			isGroup: params.isGroup,
			groupId: params.groupId
		});
		if (hasMessageSentHooks) fireAndForgetHook(params.hookRunner.runMessageSent(toPluginMessageSentEvent(canonical), toPluginMessageContext(canonical)), `${params.logPrefix}: message_sent plugin hook failed`, (message) => {
			log.warn(message);
		});
		if (!canEmitInternalHook) return;
		fireAndForgetHook(triggerInternalHook(createInternalHookEvent("message", "sent", params.sessionKeyForInternalHooks, toInternalMessageSentContext(canonical))), `${params.logPrefix}: message:sent internal hook failed`, (message) => {
			log.warn(message);
		});
	};
	return {
		emitMessageSent,
		hasMessageSentHooks
	};
}
//#endregion
//#region src/infra/outbound/outbound-audit.ts
function outboundQueueAuditSourceId(queueId, payloadIndex, lifecycle) {
	const terminalId = `message:outbound:queue:${queueId}:payload:${payloadIndex}`;
	return lifecycle ? `${terminalId}:${lifecycle}` : terminalId;
}
function outcomesByPayload(outcomes) {
	const indexed = /* @__PURE__ */ new Map();
	for (const outcome of outcomes) {
		const history = indexed.get(outcome.index) ?? [];
		history.push(outcome);
		indexed.set(outcome.index, history);
	}
	return indexed;
}
function sentResults(history) {
	return history.findLast((outcome) => outcome.status === "sent")?.results ?? [];
}
function projectRecordedOutboundAuditTerminal(history) {
	if (history.some((outcome) => outcome.status === "suppressed" && outcome.reason === "adapter_returned_no_identity")) return {
		outcome: "unknown",
		failureStage: "platform_send"
	};
	const latest = history.at(-1);
	if (latest?.status === "sent") return {
		outcome: "sent",
		results: latest.results,
		...latest.deliveryKind ? { deliveryKind: latest.deliveryKind } : {}
	};
	if (latest?.status === "suppressed") {
		if (latest.reason === "adapter_returned_no_identity") return {
			outcome: "unknown",
			failureStage: "platform_send"
		};
		return {
			outcome: "suppressed",
			reasonCode: latest.reason === "adapter_returned_no_send" ? "no_visible_payload" : latest.reason
		};
	}
}
function completedOutboundAuditTerminals(params) {
	const indexed = outcomesByPayload(params.payloadOutcomes);
	return Array.from({ length: params.payloadCount }, (_, payloadIndex) => {
		const recordedTerminal = projectRecordedOutboundAuditTerminal(indexed.get(payloadIndex) ?? []);
		if (recordedTerminal) return {
			payloadIndex,
			terminal: recordedTerminal
		};
		if (params.payloadCount === 1 && params.results.length > 0) return {
			payloadIndex,
			terminal: {
				outcome: "sent",
				results: params.results
			}
		};
		return {
			payloadIndex,
			terminal: {
				outcome: "suppressed",
				reasonCode: "no_visible_payload"
			}
		};
	});
}
function failedOutboundAuditTerminals(params) {
	const indexed = outcomesByPayload(params.payloadOutcomes);
	return Array.from({ length: params.payloadCount }, (_, payloadIndex) => {
		const history = indexed.get(payloadIndex) ?? [];
		const recordedTerminal = projectRecordedOutboundAuditTerminal(history);
		if (recordedTerminal) return {
			payloadIndex,
			terminal: recordedTerminal
		};
		const latest = history.at(-1);
		const failedResults = latest?.status === "failed" ? latest.results ?? [] : [];
		const payloadResults = failedResults.length > 0 ? failedResults : sentResults(history);
		const fallbackResults = params.payloadCount === 1 ? params.results : [];
		const results = payloadResults.length > 0 ? payloadResults : fallbackResults;
		return {
			payloadIndex,
			terminal: {
				outcome: "failed",
				failureStage: latest?.status === "failed" ? latest.stage : params.failureStage,
				results,
				sentBeforeError: results.length > 0 || latest?.status === "failed" && latest.sentBeforeError,
				...latest?.status === "failed" && latest.deliveryKind ? { deliveryKind: latest.deliveryKind } : {}
			}
		};
	});
}
function uniformOutboundAuditTerminals(payloadCount, terminal) {
	return Array.from({ length: payloadCount }, (_, payloadIndex) => ({
		payloadIndex,
		terminal
	}));
}
const TARGET_KIND_TO_ROUTE_KINDS = {
	channel: ["channel"],
	conversation: ["channel"],
	thread: ["channel"],
	group: ["group"],
	room: ["group"],
	direct: ["direct", "dm"],
	dm: ["direct", "dm"],
	user: ["direct", "dm"]
};
const TARGET_PREFIX_RE = /^\s*([a-z][a-z0-9_-]*):/i;
function resolveOutboundTargetFacts(context) {
	const channel = context.channel.toLowerCase();
	const aliasChannel = resolveTargetPrefixedChannel(context.to);
	const targetPrefix = TARGET_PREFIX_RE.exec(context.to)?.[1];
	const providerPrefixes = aliasChannel === channel ? [context.channel, targetPrefix ?? context.channel] : [context.channel];
	const withoutProvider = stripTargetProviderPrefix(context.to, ...providerPrefixes);
	const kindPrefix = TARGET_PREFIX_RE.exec(withoutProvider)?.[1]?.toLowerCase();
	const allowedRouteKinds = kindPrefix ? TARGET_KIND_TO_ROUTE_KINDS[kindPrefix] : void 0;
	return {
		conversationId: stripOutboundTargetKindPrefix(withoutProvider, Object.keys(TARGET_KIND_TO_ROUTE_KINDS)),
		withoutProvider,
		allowedRouteKinds
	};
}
/** True when a parsed session route provably names this delivery's destination. */
function routeNamesDestination(route, context) {
	if (!route || route.channel !== context.channel.toLowerCase()) return false;
	const { conversationId, withoutProvider, allowedRouteKinds } = resolveOutboundTargetFacts(context);
	if (allowedRouteKinds && !allowedRouteKinds.includes(route.peerKind)) return false;
	return [
		context.to,
		withoutProvider,
		conversationId
	].some((candidate) => {
		const normalized = normalizeSessionPeerId({
			channel: route.channel,
			peerKind: route.peerKind,
			peerId: candidate
		});
		return normalized !== "" && normalized.toLowerCase() === route.peerId.toLowerCase();
	});
}
function resolveConversationKind(context) {
	if (context.session?.conversationKind) return context.session.conversationKind;
	const routeCandidates = [
		context.session?.policyKey,
		context.session?.key,
		context.mirror?.sessionKey
	];
	for (const candidate of routeCandidates) {
		const route = parseSessionDeliveryRoute(candidate);
		if (routeNamesDestination(route, context)) return route.peerKind === "dm" || route.peerKind === "direct" ? "direct" : route.peerKind;
	}
	if (context.session?.conversationType === "group" || context.mirror?.isGroup === true) return "group";
	return "unknown";
}
function firstIdentifier(...values) {
	for (const value of values) {
		const normalized = value?.trim();
		if (normalized && normalized !== "unknown" && normalized !== "suppressed") return normalized;
	}
}
function resolveResultIdentifiers(context, results) {
	const last = results.at(-1);
	const conversationId = firstIdentifier(last?.target?.id, last?.toJid) ?? resolveOutboundTargetFacts(context).conversationId;
	const messageId = firstIdentifier(last?.messageId, last?.receipt?.primaryPlatformMessageId, last?.receipt?.platformMessageIds.at(-1));
	return {
		...conversationId ? { conversationId } : {},
		...messageId ? { messageId } : {}
	};
}
/**
* Emits only after the owning lifecycle has made the delivery terminal.
* Queue retries share one source id, so recovery cannot duplicate the final row.
*/
function emitOutboundAuditTerminal(params) {
	try {
		const { context, terminal } = params;
		const results = terminal.results ?? [];
		const agentId = context.session?.agentId ?? context.mirror?.agentId;
		const identifiers = resolveResultIdentifiers(context, results);
		const sentBeforeError = (terminal.outcome === "failed" || terminal.outcome === "unknown") && terminal.sentBeforeError === true;
		const terminalFields = terminal.outcome === "sent" ? {
			status: "succeeded",
			outcome: "sent",
			...terminal.deliveryKind ? { deliveryKind: terminal.deliveryKind } : {}
		} : terminal.outcome === "suppressed" ? {
			status: "blocked",
			outcome: "suppressed",
			reasonCode: terminal.reasonCode
		} : terminal.outcome === "unknown" ? {
			status: "unknown",
			outcome: "unknown",
			failureStage: terminal.failureStage
		} : {
			status: "failed",
			outcome: "failed",
			errorCode: results.length > 0 || sentBeforeError ? "message_delivery_partial_failure" : "message_delivery_failed",
			failureStage: terminal.failureStage,
			...terminal.deliveryKind ? { deliveryKind: terminal.deliveryKind } : {}
		};
		emitTrustedMessageAuditEvent({
			...params.sourceId ? { sourceId: params.sourceId } : {},
			kind: "message",
			action: "message.outbound.finished",
			occurredAt: Date.now(),
			...terminalFields,
			actorType: agentId ? "agent" : "system",
			actorId: agentId ?? "gateway",
			...agentId ? { agentId } : {},
			...context.runId ?? context.preparedBatch?.runId ?? context.replyPayloadSendingHook?.runId ? { runId: context.runId ?? context.preparedBatch?.runId ?? context.replyPayloadSendingHook?.runId } : {},
			...context.preparedBatch?.executionIdentityToken ? { executionIdentityToken: context.preparedBatch.executionIdentityToken } : {},
			direction: "outbound",
			channel: context.channel,
			conversationKind: resolveConversationKind(context),
			durationMs: Math.max(0, Date.now() - params.startedAt),
			resultCount: countPhysicalOutboundSends(results),
			...context.accountId ? { accountId: context.accountId } : {},
			targetId: context.to,
			...identifiers
		});
	} catch {}
}
/** Emits a replay-safe owner-native receipt after the queue transition commits. */
function emitOutboundAuditLifecycle(params) {
	if (!hasTrustedMessageAuditListeners()) return;
	const payloadCount = params.context.preparedBatch?.sourcePayloadCount ?? 1;
	const payloadIndexes = params.payloadIndexes ?? Array.from({ length: payloadCount }, (_, i) => i);
	try {
		for (const payloadIndex of payloadIndexes) {
			if (!Number.isSafeInteger(payloadIndex) || payloadIndex < 0 || payloadIndex >= payloadCount) continue;
			const agentId = params.context.session?.agentId ?? params.context.mirror?.agentId;
			const common = {
				sourceId: outboundQueueAuditSourceId(params.queueId, payloadIndex, params.outcome),
				occurredAt: Date.now(),
				status: "started",
				actorType: agentId ? "agent" : "system",
				actorId: agentId ?? "gateway",
				...agentId ? { agentId } : {},
				...params.context.runId ?? params.context.preparedBatch?.runId ? { runId: params.context.runId ?? params.context.preparedBatch?.runId } : {},
				...params.context.preparedBatch?.executionIdentityToken ? { executionIdentityToken: params.context.preparedBatch.executionIdentityToken } : {},
				direction: "outbound",
				channel: params.context.channel,
				conversationKind: resolveConversationKind(params.context),
				durationMs: Math.max(0, Date.now() - params.startedAt),
				resultCount: 0,
				...params.context.accountId ? { accountId: params.context.accountId } : {},
				targetId: params.context.to
			};
			if (params.outcome === "queued") emitTrustedMessageAuditEvent({
				...common,
				kind: "message",
				action: "message.outbound.queued",
				outcome: "queued"
			});
			else emitTrustedMessageAuditEvent({
				...common,
				kind: "message",
				action: "message.outbound.platform-started",
				outcome: "platform_started"
			});
		}
	} catch {}
}
/** Emits only after the owning lifecycle has made each logical payload terminal. */
function emitOutboundAuditTerminals(params) {
	if (!hasTrustedMessageAuditListeners()) return;
	let terminals;
	try {
		terminals = typeof params.terminals === "function" ? params.terminals() : params.terminals;
	} catch {
		return;
	}
	for (const indexed of terminals) emitOutboundAuditTerminal({
		context: params.context,
		terminal: indexed.terminal,
		startedAt: params.startedAt,
		payloadIndex: indexed.payloadIndex,
		...params.queueId ? { sourceId: outboundQueueAuditSourceId(params.queueId, indexed.payloadIndex) } : {}
	});
}
//#endregion
//#region src/infra/outbound/delivery-queue-recovery-policy.ts
const DEFAULT_MAX_RETRIES = 5;
const PERMANENT_ERROR_PATTERNS = [
	/no conversation reference found/i,
	/chat not found/i,
	/user not found/i,
	/bot.*not.*member/i,
	/bot was blocked by the user/i,
	/forbidden: bot was kicked/i,
	/chat_id is empty/i,
	/recipient is not a valid/i,
	/ambiguous .* recipient/i,
	/User .* not in room/i
];
function resolveMaxRetries(entry) {
	const configured = entry.maxRetries;
	return typeof configured === "number" && Number.isInteger(configured) && configured > 0 ? configured : DEFAULT_MAX_RETRIES;
}
function resolveAttemptCount(entry) {
	const persisted = entry.attemptCount;
	return Math.max(typeof persisted === "number" && Number.isInteger(persisted) && persisted >= 0 ? persisted : 0, entry.retryCount);
}
function isPermanentDeliveryError(error) {
	return PERMANENT_ERROR_PATTERNS.some((re) => re.test(error));
}
//#endregion
//#region src/infra/outbound/delivery-queue-recovery.ts
const recoveryCoordinator = createDeliveryRecoveryCoordinator();
const queuedDeliveryPayloads = (entry) => acceptedPreparedOutboundEntries(entry.preparedBatch).map((prepared) => prepared.payload);
function queuedPayloadCount(entry) {
	return entry.preparedBatch.sourcePayloadCount;
}
function emitRecoveredMessageSentEvents(entry, events) {
	const { emitMessageSent } = createMessageSentEmitter({
		hookRunner: getGlobalHookRunner(),
		channel: entry.channel,
		to: entry.to,
		accountId: entry.accountId,
		sessionKeyForInternalHooks: entry.mirror?.sessionKey ?? entry.session?.key,
		isGroup: entry.mirror?.isGroup,
		groupId: entry.mirror?.groupId,
		runId: entry.preparedBatch.runId,
		logPrefix: OUTBOUND_DELIVERY_LOG_SCOPE
	});
	for (const event of events) emitMessageSent(event);
}
function queuedTerminalFailureEvents(entry, error) {
	return acceptedPreparedOutboundEntries(entry.preparedBatch).map((prepared) => {
		const summary = buildPayloadSummary(prepared.payload);
		return {
			sourceIndex: prepared.sourceIndex,
			event: {
				success: false,
				content: summary.hookContent ?? summary.text,
				error
			}
		};
	});
}
function emitRecoveredTerminalFailure(entry, error, collected = []) {
	if (entry.legacyPreparedContentUnavailable) return;
	const fallbackEvents = queuedTerminalFailureEvents(entry, error);
	const collectedBySourceIndex = new Map(collected.map(({ sourceIndex, event }) => [sourceIndex, event]));
	emitRecoveredMessageSentEvents(entry, fallbackEvents.map(({ sourceIndex, event }) => collectedBySourceIndex.get(sourceIndex) ?? event));
}
function emitRecoveredTerminalSuccess(entry, result) {
	if (entry.legacyPreparedContentUnavailable) return;
	const preparedEntries = acceptedPreparedOutboundEntries(entry.preparedBatch);
	if (preparedEntries.length === 0) return;
	const receiptMessageIds = result.receipt?.parts.length ? result.receipt.parts.toSorted((left, right) => left.index - right.index).map((part) => part.platformMessageId) : result.receipt?.platformMessageIds;
	const messageIds = preparedEntries.length === 1 ? [result.messageId || receiptMessageIds?.[0]] : receiptMessageIds?.length === preparedEntries.length ? receiptMessageIds : [];
	emitRecoveredMessageSentEvents(entry, preparedEntries.map((prepared, index) => {
		const summary = buildPayloadSummary(prepared.payload);
		const messageId = messageIds[index];
		const event = {
			success: true,
			content: summary.hookContent ?? summary.text
		};
		if (messageId) event.messageId = messageId;
		return event;
	}));
}
function emitQueuedAuditTerminals(entry, terminals) {
	emitOutboundAuditTerminals({
		context: entry,
		terminals,
		startedAt: entry.enqueuedAt,
		queueId: entry.id
	});
}
function needsUnknownSendReconciliation(entry) {
	return entry.recoveryState === "send_attempt_started" || entry.recoveryState === "unknown_after_send";
}
async function withActiveDeliveryClaim(entryId, fn) {
	return recoveryCoordinator.withClaim(entryId, fn);
}
function buildRecoveryDeliverParams(entry, cfg, stateDir, producerClaimId) {
	const conversationCompletion = entry.deliveryCompletion?.kind === "conversation" ? entry.deliveryCompletion : void 0;
	const pendingFinalWriterAuthority = entry.deliveryCompletion?.kind === "pending-final" ? entry.deliveryCompletion.sessionWriterDeliveryAuthority : void 0;
	return {
		cfg,
		channel: entry.channel,
		to: entry.to,
		accountId: entry.accountId,
		...entry.queuePolicy !== void 0 ? { queuePolicy: entry.queuePolicy } : {},
		...entry.requireUnknownSendReconciliation === true ? { requireUnknownSendReconciliation: true } : {},
		payloads: queuedDeliveryPayloads(entry),
		preparedBatch: entry.preparedBatch,
		renderedBatchPlan: entry.renderedBatchPlan,
		threadId: entry.threadId,
		reply: entry.reply,
		formatting: entry.formatting,
		identity: entry.identity,
		bestEffort: entry.bestEffort,
		gifPlayback: entry.gifPlayback,
		forceDocument: entry.forceDocument,
		silent: entry.silent,
		mirror: entry.mirror,
		session: entry.session,
		gatewayClientScopes: entry.gatewayClientScopes,
		preparedMessageId: entry.preparedMessageId,
		...conversationCompletion ? { conversationDeliveryAttemptAuthority: {
			agentId: conversationCompletion.agentId,
			operationId: conversationCompletion.operationId,
			...conversationCompletion.storePath ? { storePath: conversationCompletion.storePath } : {},
			...conversationCompletion.routeFingerprint ? { routeFingerprint: conversationCompletion.routeFingerprint } : {}
		} } : {},
		...pendingFinalWriterAuthority ? {
			onDirectAdapterHandoff: async () => {
				assertSessionWriterDeliveryAuthorized(pendingFinalWriterAuthority);
			},
			assertDirectAdapterHandoff: () => {
				assertSessionWriterDeliveryAuthorized(pendingFinalWriterAuthority);
			},
			onPlatformSendDispatch: async () => {
				assertSessionWriterDeliveryAuthorized(pendingFinalWriterAuthority);
			}
		} : {},
		deliveryQueueId: entry.id,
		deliveryQueueStateDir: stateDir,
		...producerClaimId ? { deliveryProducerClaimId: producerClaimId } : {},
		...entry.requiresProducerClaim === true ? { deliveryProducerLeaseRequired: true } : {},
		skipQueue: true,
		deferredDeliveryAdmissionPassed: true,
		deferCommitHooks: true
	};
}
async function settleQueuedFailure(params, stateContext) {
	let terminalized = false;
	try {
		const unknownSend = needsUnknownSendReconciliation(params.entry);
		const settlement = params.entry.settlement ?? {
			error: params.error,
			...params.terminals ? { terminals: params.terminals } : {},
			...unknownSend ? { unknownSendCleanup: true } : {},
			...params.rejectionError !== void 0 ? {
				outcome: "failed",
				rejectionError: params.rejectionError
			} : { outcome: unknownSend ? "unknown" : "failed" }
		};
		const entry = await stageDeliveryFailureSettlement(params.entry, settlement, params.stateDir, params.claimedAttemptId, stateContext);
		if (!entry) return "already-gone";
		if (entry.deliveryCompletion) await (settlement.outcome === "failed" && settlement.rejectionError !== void 0 ? rejectDurableDelivery(entry.deliveryCompletion, settlement.rejectionError, params.stateDir, stateContext) : failDurableDelivery(entry.deliveryCompletion, params.stateDir, stateContext));
		const spoolPaths = collectEntrySpoolPaths(queuedDeliveryPayloads(entry), params.stateDir);
		const leaseId = spoolPaths.length > 0 ? createDeliveryQueueMediaRetention(spoolPaths, "outbound-media-recovery-lease", params.stateDir, void 0, stateContext) : void 0;
		try {
			if (!finalizeDeliveryFailureSettlement(entry, params.stateDir, stateContext)) return "already-gone";
			terminalized = true;
			emitRecoveredTerminalFailure(entry, settlement.error, params.events);
			emitQueuedAuditTerminals(entry, settlement.terminals ?? (() => uniformOutboundAuditTerminals(queuedPayloadCount(entry), {
				outcome: settlement.outcome,
				failureStage: "queue"
			})));
			if (settlement.unknownSendCleanup) {
				const cleanup = (await resolveOutboundChannelMessageAdapter({
					channel: entry.channel,
					cfg: params.cfg,
					agentId: entry.session?.agentId,
					allowBootstrap: true,
					assertCurrent: () => stateContext.workerContext.admission.assertCurrent()
				}))?.durableFinal?.afterUnknownSendTerminal;
				try {
					await cleanup?.(buildUnknownSendContext({
						entry,
						payloads: queuedDeliveryPayloads(entry),
						cfg: params.cfg
					}));
				} catch (error) {
					params.log.warn(`Delivery entry ${entry.id} unknown-send terminal cleanup failed: ${formatErrorMessage(error)}`);
				}
			}
			await releaseSpoolArtifacts(spoolPaths, params.stateDir);
		} finally {
			cancelDeliveryQueueMediaRetention(leaseId, params.stateDir, stateContext);
		}
	} catch (error) {
		params.log.warn(`Delivery entry ${params.entry.id} ${terminalized ? "terminal cleanup failed" : "settlement pending"}: ${formatErrorMessage(error)}`);
	}
	return terminalized ? "moved-to-failed" : "failed";
}
function buildReconciledSentResult(entry, reconciliation) {
	return {
		channel: entry.channel,
		messageId: reconciliation.messageId ?? reconciliation.receipt.primaryPlatformMessageId ?? reconciliation.receipt.platformMessageIds[0] ?? "",
		receipt: reconciliation.receipt
	};
}
function buildReconciledCommitContext(params) {
	const payload = queuedDeliveryPayloads(params.entry)[0] ?? {};
	const result = {
		messageId: params.result.messageId,
		receipt: params.result.receipt ?? {
			platformMessageIds: [params.result.messageId].filter(Boolean),
			parts: [],
			sentAt: Date.now()
		}
	};
	const base = {
		cfg: params.cfg,
		to: params.entry.to,
		deliveryQueueId: params.entry.id,
		accountId: params.entry.accountId,
		replyToId: params.entry.effectiveReplyToId !== void 0 ? params.entry.effectiveReplyToId : params.entry.reply?.replyToId,
		replyToMode: params.entry.reply?.source === "implicit" ? params.entry.reply.mode : void 0,
		threadId: params.entry.threadId,
		silent: params.entry.silent,
		result
	};
	if (payload.presentation !== void 0 || payload.delivery !== void 0 || payload.interactive !== void 0 || payload.channelData !== void 0 && Object.keys(payload.channelData).length > 0) return {
		...base,
		kind: "payload",
		text: payload.text ?? "",
		mediaUrl: payload.mediaUrl,
		payload
	};
	const mediaUrl = payload.mediaUrl ?? payload.mediaUrls?.find((url) => url);
	if (mediaUrl) return {
		...base,
		kind: "media",
		text: payload.text ?? "",
		mediaUrl,
		audioAsVoice: payload.audioAsVoice,
		gifPlayback: params.entry.gifPlayback,
		forceDocument: params.entry.forceDocument
	};
	return {
		...base,
		kind: "text",
		text: payload.text ?? ""
	};
}
async function runReconciledSentCommitHooks(params) {
	if (params.entry.legacyPreparedContentUnavailable) return;
	const adapter = await resolveOutboundChannelMessageAdapter({
		channel: params.entry.channel,
		cfg: params.cfg,
		agentId: params.entry.session?.agentId,
		allowBootstrap: true,
		assertCurrent: params.assertCurrent
	});
	params.assertCurrent();
	const afterCommit = adapter?.send?.lifecycle?.afterCommit;
	if (!afterCommit) return;
	const result = buildReconciledSentResult(params.entry, params.reconciliation);
	try {
		await afterCommit(buildReconciledCommitContext({
			entry: params.entry,
			cfg: params.cfg,
			result
		}));
	} catch (err) {
		params.log.warn(`Delivery entry ${params.entry.id} reconciled sent afterCommit hook failed: ${formatErrorMessage(err)}`);
	}
}
function recoveryPlatformAttemptId(entry, claimedAttemptId) {
	return claimedAttemptId !== void 0 ? claimedAttemptId : typeof entry.platformSendAttemptId === "string" ? entry.platformSendAttemptId : entry.recoveryState === "producer_claimed" && typeof entry.producerClaimId === "string" ? entry.producerClaimId : typeof entry.completionRetention === "object" || entry.requiresProducerClaim === true ? null : void 0;
}
async function resolveCompletedOwnerBeforeRecovery(opts, stateContext) {
	const completion = opts.entry.deliveryCompletion;
	if (!completion) return "continue";
	let operation;
	try {
		operation = await markDurableDeliveryQueued(completion, opts.entry.id, void 0, opts.stateDir, stateContext);
	} catch (error) {
		const errMsg = `delivery owner state unavailable: ${formatErrorMessage(error)}`;
		await opts.owner.fail(failDelivery, errMsg).catch(() => void 0);
		opts.onFailed?.(opts.entry, errMsg);
		opts.log.warn(`Delivery entry ${opts.entry.id} ${errMsg}`);
		return "failed";
	}
	if (operation.state === "prepared" || operation.state === "queued") return "continue";
	if (operation.state === "unknown") {
		const settled = await settleQueuedFailure({
			...opts,
			error: "delivery owner state is unknown"
		}, stateContext);
		return settled === "already-gone" ? "failed" : settled;
	}
	try {
		const suppressReceipt = operation.state !== "delivered" && typeof opts.entry.completionRetention === "object";
		await opts.owner.ack(suppressReceipt ? { suppressCompletionReceipt: true } : void 0);
	} catch (error) {
		const errMsg = `failed to ack owner-${operation.state} delivery: ${formatErrorMessage(error)}`;
		opts.onFailed?.(opts.entry, errMsg);
		opts.log.warn(`Delivery entry ${opts.entry.id} ${errMsg}`);
		return "failed";
	}
	if (operation.state === "delivered") {
		const messageId = operation.platformMessageId;
		if (messageId) {
			const result = {
				channel: opts.entry.channel,
				messageId
			};
			emitRecoveredTerminalSuccess(opts.entry, result);
			await runOutboundDeliveryCommitHooks([result]);
			emitQueuedAuditTerminals(opts.entry, () => completedOutboundAuditTerminals({
				payloadCount: queuedPayloadCount(opts.entry),
				results: [result],
				payloadOutcomes: []
			}));
		}
	} else if (operation.state === "rejected") {
		emitQueuedAuditTerminals(opts.entry, () => failedOutboundAuditTerminals({
			payloadCount: queuedPayloadCount(opts.entry),
			results: [],
			payloadOutcomes: [],
			failureStage: "platform_send"
		}));
		const error = operation.rejectionError ?? "delivery permanently rejected before platform dispatch";
		emitRecoveredTerminalFailure(opts.entry, error);
		opts.onFailed?.(opts.entry, error);
		return "failed";
	} else if (operation.state === "suppressed") emitQueuedAuditTerminals(opts.entry, () => uniformOutboundAuditTerminals(queuedPayloadCount(opts.entry), {
		outcome: "suppressed",
		reasonCode: "no_visible_payload"
	}));
	opts.onRecovered?.(opts.entry);
	return "recovered";
}
async function persistRecoveredPostSendState(opts, stateContext) {
	return persistQueuedPostSendState({
		owner: opts.owner,
		queuePolicy: opts.entry.queuePolicy ?? "best_effort",
		preserveBatch: Boolean(opts.producerClaimId),
		retainSpoolArtifacts: true,
		onPostSendMarkerError: (error) => {
			opts.log.warn(`Delivery entry ${opts.entry.id} failed to persist post-send state; falling back to direct ack: ${formatErrorMessage(error)}`);
		}
	}, stateContext);
}
async function drainQueuedEntry(opts, stateContext, internalDeliver) {
	const { entry } = opts;
	const deliver = internalDeliver ? (params) => internalDeliver(params, stateContext) : opts.deliver;
	const owner = createQueuedDeliveryOwner({
		queueId: entry.id,
		stateDir: opts.stateDir,
		expectedPlatformSendAttemptId: recoveryPlatformAttemptId(entry)
	}, stateContext);
	const maxRetries = resolveMaxRetries(entry);
	const attemptBudgetExhausted = resolveAttemptCount(entry) >= maxRetries;
	let reconciledPlatformSendAttemptId;
	let reconciledPlatformSendStartedAt;
	const ownerState = await resolveCompletedOwnerBeforeRecovery({
		...opts,
		owner
	}, stateContext);
	if (ownerState !== "continue") return ownerState;
	if (needsUnknownSendReconciliation(entry)) {
		const reconciliation = entry.legacyUnknownSendReconciliation ?? await reconcileUnknownQueuedDelivery({
			entry,
			payloads: queuedDeliveryPayloads(entry),
			cfg: opts.cfg,
			warn: (message) => opts.log.warn(message),
			assertCurrent: () => stateContext.workerContext.admission.assertCurrent()
		});
		if (reconciliation?.status === "sent") try {
			const result = buildReconciledSentResult(entry, reconciliation);
			if (entry.deliveryCompletion) await completeDurableDelivery(entry.deliveryCompletion, result, opts.stateDir, stateContext);
			await owner.ack();
			emitRecoveredTerminalSuccess(entry, result);
			await runReconciledSentCommitHooks({
				entry,
				cfg: opts.cfg,
				reconciliation,
				log: opts.log,
				assertCurrent: () => stateContext.workerContext.admission.assertCurrent()
			});
			emitQueuedAuditTerminals(entry, () => completedOutboundAuditTerminals({
				payloadCount: queuedPayloadCount(entry),
				results: [result],
				payloadOutcomes: []
			}));
			opts.onRecovered?.(entry);
			opts.log.info(`Delivery entry ${entry.id} reconciled unknown_after_send as already sent`);
			return "recovered";
		} catch (ackErr) {
			if (getErrnoCode(ackErr) === "ENOENT") return "already-gone";
			const errMsg = `failed to ack reconciled sent delivery: ${formatErrorMessage(ackErr)}`;
			opts.log.warn(`Delivery entry ${entry.id} ${errMsg}`);
			opts.onFailed?.(entry, errMsg);
			try {
				await owner.fail(failDelivery, errMsg);
				return "failed";
			} catch (failErr) {
				if (getErrnoCode(failErr) === "ENOENT") return "already-gone";
			}
			return "failed";
		}
		if (reconciliation?.status === "not_sent" && entry.recoveryState === "send_attempt_started") {
			reconciledPlatformSendAttemptId = entry.platformSendAttemptId;
			reconciledPlatformSendStartedAt = entry.platformSendStartedAt;
			opts.log.info(`Delivery entry ${entry.id} reconciled ${entry.recoveryState} as not sent; replaying`);
		} else {
			let errMsg = `delivery state is ${entry.recoveryState}; refusing blind replay without adapter reconciliation`;
			if (reconciliation?.status === "not_sent") errMsg = `delivery state is ${entry.recoveryState}; refusing full replay after post-send evidence`;
			else if (reconciliation?.status === "unresolved" && reconciliation.error) errMsg = `delivery state is ${entry.recoveryState} and reconciliation is unresolved: ${reconciliation.error}`;
			opts.log.warn(`Delivery entry ${entry.id} ${errMsg}`);
			opts.onFailed?.(entry, errMsg);
			if (reconciliation?.status === "unresolved" && reconciliation.retryable === true && !attemptBudgetExhausted) {
				try {
					await owner.fail(failDelivery, errMsg);
					return "failed";
				} catch (failErr) {
					if (getErrnoCode(failErr) === "ENOENT") return "already-gone";
				}
				return "failed";
			}
			return settleQueuedFailure({
				...opts,
				error: errMsg
			}, stateContext);
		}
	}
	const payloadOutcomes = [];
	const messageSentEvents = [];
	let postSendState;
	let platformSendStarted = false;
	let deliveredResults = [];
	let commitHooksRun = false;
	const collectResults = (results) => {
		for (const result of results) if (!deliveredResults.includes(result)) deliveredResults.push(result);
	};
	const collectPayloadOutcome = (outcome) => {
		if (!payloadOutcomes.includes(outcome)) payloadOutcomes.push(outcome);
	};
	const runCommitHooksAfterAck = async () => {
		if (postSendState !== "acked" || commitHooksRun) return;
		commitHooksRun = true;
		emitRecoveredMessageSentEvents(entry, messageSentEvents.map(({ event }) => event));
		if (deliveredResults.length > 0) await runOutboundDeliveryCommitHooks(deliveredResults);
	};
	const requiresProducerClaim = typeof entry.completionRetention === "object" || entry.requiresProducerClaim === true || typeof entry.producerClaimId === "string" || typeof entry.platformSendAttemptId === "string";
	const producerClaimId = requiresProducerClaim ? await claimDeliveryPlatformSendAttempt(entry.id, opts.stateDir, reconciledPlatformSendStartedAt, reconciledPlatformSendAttemptId, stateContext) : void 0;
	if (requiresProducerClaim && !producerClaimId) {
		opts.log.info(`Recovery skipped for delivery ${entry.id}: producer ownership already claimed`);
		return "already-gone";
	}
	owner.claimId = recoveryPlatformAttemptId(entry, producerClaimId);
	const reservation = producerClaimId ? await reserveDeliveryAttempt(entry.id, maxRetries, opts.stateDir, producerClaimId, stateContext) : await reserveDeliveryAttempt(entry.id, maxRetries, opts.stateDir, void 0, stateContext);
	if (reservation.status === "exhausted") {
		const errMsg = `delivery retry budget exhausted (${reservation.attemptCount}/${maxRetries})`;
		opts.onFailed?.(entry, errMsg);
		return settleQueuedFailure({
			...opts,
			error: errMsg,
			claimedAttemptId: producerClaimId
		}, stateContext);
	}
	const recoverySpoolPaths = collectEntrySpoolPaths(queuedDeliveryPayloads(entry), opts.stateDir);
	let mediaRecoveryLeaseId;
	try {
		mediaRecoveryLeaseId = recoverySpoolPaths.length > 0 ? createDeliveryQueueMediaRetention(recoverySpoolPaths, "outbound-media-recovery-lease", opts.stateDir, void 0, stateContext) : void 0;
		const deliveryParams = buildRecoveryDeliverParams(entry, opts.cfg, opts.stateDir, producerClaimId);
		let dispatchAdmitted = false;
		const result = await deliver({
			...deliveryParams,
			deliveryQueueOwner: owner,
			onPayloadDeliveryOutcome: collectPayloadOutcome,
			onMessageSentEvent: (event, sourceIndex) => messageSentEvents.push({
				sourceIndex,
				event
			}),
			onPlatformSendStart: async () => {
				platformSendStarted = true;
			},
			onDeliveryResult: async (deliveryResult) => {
				collectResults([deliveryResult]);
				postSendState ??= await persistRecoveredPostSendState({
					owner,
					entry,
					log: opts.log,
					...producerClaimId ? { producerClaimId } : {}
				}, stateContext);
			},
			onPlatformSendDispatch: async () => {
				await deliveryParams.onPlatformSendDispatch?.();
				if (dispatchAdmitted) return;
				if (opts.shouldContinue?.() === false) throw new OutboundDeliveryAdmissionClosedError();
				dispatchAdmitted = true;
			}
		});
		const results = isOutboundDeliveryResultArray(result) ? result : [];
		const failedOutcomes = payloadOutcomes.filter((outcome) => outcome.status === "failed");
		if (payloadOutcomes.some((outcome) => outcome.status === "suppressed" && outcome.reason === "adapter_returned_no_identity") || results.length === 0 && failedOutcomes.length === 0 && platformSendStarted && !areOutboundPayloadsIntentionallySuppressed(payloadOutcomes)) {
			const error = "recovered platform send returned no delivery identity";
			await owner.fail(failDeliveryAfterPlatformSend, error);
			if (entry.deliveryCompletion) await settleDurableDelivery(entry.deliveryCompletion, { platformSendStarted: true }, opts.stateDir, stateContext);
			opts.onFailed?.(entry, error);
			opts.log.warn(`Delivery entry ${entry.id} ${error}; preserving unknown_after_send`);
			return "failed";
		}
		if (results.length > 0) deliveredResults = [...results];
		const failedOutcome = failedOutcomes[0];
		if (failedOutcome) {
			const errMsg = formatErrorMessage(failedOutcome.error);
			opts.onFailed?.(entry, errMsg);
			if (results.length > 0 || failedOutcomes.some((outcome) => outcome.sentBeforeError)) {
				postSendState ??= await persistRecoveredPostSendState({
					owner,
					entry,
					log: opts.log,
					...producerClaimId ? { producerClaimId } : {}
				}, stateContext);
				opts.log.warn(`Delivery entry ${entry.id} partially sent before best-effort recovery failed; preserving unknown_after_send`);
				if (postSendState === "acked") {
					await runCommitHooksAfterAck();
					emitQueuedAuditTerminals(entry, () => failedOutboundAuditTerminals({
						payloadCount: queuedPayloadCount(entry),
						results: deliveredResults,
						payloadOutcomes,
						failureStage: "platform_send"
					}));
				}
			} else {
				const recordFailure = failedOutcomes.every((outcome) => isProvenDeliveryNotSentError(outcome.error)) ? failDeliveryBeforePlatformSend : failDelivery;
				await owner.fail(recordFailure, errMsg);
			}
			return "failed";
		}
		if (entry.deliveryCompletion) {
			const terminalResult = results.at(-1);
			await settleDurableDelivery(entry.deliveryCompletion, terminalResult ? { result: terminalResult } : { platformSendStarted: false }, opts.stateDir, stateContext);
		}
		postSendState ??= results.length > 0 ? await persistRecoveredPostSendState({
			owner,
			entry,
			log: opts.log,
			...producerClaimId ? { producerClaimId } : {}
		}, stateContext) : void 0;
		if (postSendState === "failed") {
			const errMsg = "recovered send completed but queue finalization failed";
			opts.onFailed?.(entry, errMsg);
			opts.log.warn(`Delivery entry ${entry.id} ${errMsg}; preserving unknown_after_send`);
			return "failed";
		}
		if (postSendState !== "acked") try {
			await (results.length === 0 && typeof entry.completionRetention === "object" ? owner.ack({ suppressCompletionReceipt: true }) : owner.ack());
			postSendState = "acked";
		} catch (ackErr) {
			const ackError = `failed to ack recovered delivery: ${formatErrorMessage(ackErr)}`;
			if (results.length > 0) {
				await owner.fail(failDeliveryAfterPlatformSend, ackError);
				postSendState = "failed";
			} else await owner.fail(areOutboundPayloadsIntentionallySuppressed(payloadOutcomes) ? failDeliveryBeforePlatformSend : failDelivery, ackError);
			opts.onFailed?.(entry, ackError);
			opts.log.warn(`Delivery entry ${entry.id} ${ackError}`);
			return "failed";
		}
		await runCommitHooksAfterAck();
		emitQueuedAuditTerminals(entry, () => completedOutboundAuditTerminals({
			payloadCount: queuedPayloadCount(entry),
			results,
			payloadOutcomes
		}));
		opts.onRecovered?.(entry);
		return "recovered";
	} catch (err) {
		if (isOutboundDeliveryAdmissionClosedError(err)) {
			restoreDeliveryAttemptBeforeDispatch(entry, reservation.attemptCount, opts.stateDir, producerClaimId, stateContext);
			return "stopped";
		}
		const errMsg = formatErrorMessage(err);
		opts.onFailed?.(entry, errMsg);
		if (isOutboundDeliveryError(err) && err.results.length > 0) deliveredResults = [...err.results];
		if (deliveredResults.length > 0 || postSendState !== void 0 || isOutboundDeliveryError(err) && err.sentBeforeError) {
			try {
				postSendState ??= await persistRecoveredPostSendState({
					owner,
					entry,
					log: opts.log,
					...producerClaimId ? { producerClaimId } : {}
				}, stateContext);
			} catch (persistErr) {
				opts.log.error(`Delivery entry ${entry.id} could not persist post-send evidence: ${formatErrorMessage(persistErr)}`);
			}
			if (postSendState === "acked") {
				await runCommitHooksAfterAck();
				emitQueuedAuditTerminals(entry, () => failedOutboundAuditTerminals({
					payloadCount: queuedPayloadCount(entry),
					results: deliveredResults,
					payloadOutcomes,
					failureStage: isOutboundDeliveryError(err) ? err.stage : "platform_send"
				}));
			}
			opts.log.warn(`Delivery entry ${entry.id} partially sent before recovery failed; preserving unknown_after_send`);
			return "failed";
		}
		if (owner.custody === "released") {
			emitQueuedAuditTerminals(entry, () => failedOutboundAuditTerminals({
				payloadCount: queuedPayloadCount(entry),
				results: deliveredResults,
				payloadOutcomes,
				failureStage: isOutboundDeliveryError(err) ? err.stage : "platform_send"
			}));
			return "failed";
		}
		const permanentPlatformRejection = findPlatformMessageRejectedError(err);
		if (permanentPlatformRejection || isPermanentDeliveryError(errMsg)) return settleQueuedFailure({
			...opts,
			error: errMsg,
			claimedAttemptId: producerClaimId,
			...permanentPlatformRejection ? { rejectionError: permanentPlatformRejection.message } : {},
			events: messageSentEvents,
			terminals: failedOutboundAuditTerminals({
				payloadCount: queuedPayloadCount(entry),
				results: deliveredResults,
				payloadOutcomes,
				failureStage: "queue"
			})
		}, stateContext);
		try {
			const recordFailure = isProvenDeliveryNotSentError(err) ? failDeliveryBeforePlatformSend : failDelivery;
			await owner.fail(recordFailure, errMsg);
			return "failed";
		} catch (failErr) {
			if (getErrnoCode(failErr) === "ENOENT") return "already-gone";
		}
		return "failed";
	} finally {
		cancelDeliveryQueueMediaRetention(mediaRecoveryLeaseId, opts.stateDir, stateContext);
		if (!await loadUnfinishedDelivery(entry.id, opts.stateDir, stateContext).catch(() => entry)) await releaseSpoolArtifacts(recoverySpoolPaths, opts.stateDir);
	}
}
/** Startup and reconnect share custody, admission, retry, and settlement ordering. */
async function processQueuedRecovery(opts, context, stateContext, internalDeliver) {
	const { entry, log } = opts;
	if (context.shouldContinue?.() === false) return "stop";
	const label = context.kind === "startup" ? `Delivery ${entry.id}` : `${context.logLabel}: entry ${entry.id}`;
	if (entry.settlement) {
		await settleQueuedFailure({
			...opts,
			error: entry.settlement.error
		}, stateContext);
		return "continue";
	}
	if (hasActiveDeliveryOwner(entry, Date.now())) {
		if (context.kind === "startup") log.info(`Recovery skipped for delivery ${entry.id}: active platform owner`);
		return "continue";
	}
	const resolveAdmission = await prepareDeferredDeliveryAdmission({
		cfg: opts.cfg,
		channel: entry.channel,
		to: entry.to,
		accountId: entry.accountId,
		phase: "recovery"
	}, {
		agentId: entry.session?.agentId,
		assertCurrent: () => stateContext.workerContext.admission.assertCurrent()
	});
	if (context.shouldContinue?.() === false) return "stop";
	const admission = resolveAdmission();
	if (admission.status !== "allowed") {
		const settled = await settleQueuedFailure({
			...opts,
			error: admission.reason
		}, stateContext);
		const logLabel = context.kind === "startup" ? "Recovery" : context.logLabel;
		if (settled === "already-gone") log.info(`${logLabel}: entry ${entry.id} changed ownership before admission failure was persisted`);
		else {
			if (context.kind === "startup") context.summary.failed += 1;
			log.warn(`${logLabel}: entry ${entry.id} permanently rejected before recovery: ${admission.reason}`);
		}
		return "continue";
	}
	const decision = context.kind === "drain" ? context.selectEntry(entry, Date.now()) : { match: true };
	if (!decision.match) {
		log.info(`${label} no longer matches, skipping`);
		return "continue";
	}
	const maxRetries = resolveMaxRetries(entry);
	const attemptCount = resolveAttemptCount(entry);
	if (attemptCount >= maxRetries && !needsUnknownSendReconciliation(entry)) {
		if (context.kind === "startup") {
			log.warn(`${label} exceeded max retries (${attemptCount}/${maxRetries}) — moving to failed/`);
			context.summary.skippedMaxRetries += 1;
		}
		const settled = await settleQueuedFailure({
			...opts,
			error: "delivery retry budget exhausted"
		}, stateContext);
		if (context.kind === "drain" && settled === "moved-to-failed") log.warn(`${label} exceeded max retries and was moved to failed/`);
		return "continue";
	}
	const eligibility = isDeliveryRecoveryRetryEligible(entry, Date.now());
	if (!decision.bypassBackoff && !eligibility.eligible) {
		if (context.kind === "startup") context.summary.deferredBackoff += 1;
		log.info(`${label} not ready for retry yet — backoff ${eligibility.remainingBackoffMs}ms remaining`);
		return "continue";
	}
	if (await recoveryCoordinator.waitForReplay(context.kind === "startup" ? context.deadline : void 0) === "deadline-exceeded") {
		if (context.kind === "startup") context.onDeadlineExceeded();
		return "stop";
	}
	if (context.shouldContinue?.() === false) return "stop";
	return await drainQueuedEntry({
		...opts,
		...context.shouldContinue ? { shouldContinue: context.shouldContinue } : {},
		onRecovered: (recovered) => {
			if (context.kind === "startup") {
				context.summary.recovered += 1;
				log.info(`Recovered delivery ${recovered.id} on ${recovered.channel}`);
			} else log.info(`${context.logLabel}: drained delivery ${recovered.id} on ${recovered.channel}`);
		},
		onFailed: (failed, error) => {
			if (context.kind === "startup") context.summary.failed += 1;
			if (isPermanentDeliveryError(error)) log.warn(`${label} hit permanent error — moving to failed/: ${error}`);
			else log.warn(context.kind === "startup" ? `Retry failed for delivery ${failed.id}: ${error}` : `${context.logLabel}: retry failed for entry ${failed.id}: ${error}`);
		}
	}, stateContext, internalDeliver) === "stopped" ? "stop" : "continue";
}
async function drainPendingDeliveriesCore(params, internalDeliver, stateContext = captureDeliveryQueueStateContext(params.stateDir)) {
	const opts = {
		...params,
		stateDir: stateContext.stateDir
	};
	if (!await recoveryCoordinator.withDrain(opts.drainKey, async () => {
		const now = Date.now();
		const matchingEntries = (await loadUnfinishedDeliveries(opts.stateDir, stateContext)).filter((entry) => entry.settlement || opts.selectEntry(entry, now).match);
		await recoveryCoordinator.scan({
			entries: matchingEntries,
			loadEntry: (id) => loadUnfinishedDelivery(id, opts.stateDir, stateContext),
			onMissingEntry: (entry) => {
				opts.log.info(`${opts.logLabel}: entry ${entry.id} already gone, skipping`);
			},
			onEntry: (entry) => processQueuedRecovery({
				...opts,
				entry
			}, {
				kind: "drain",
				logLabel: opts.logLabel,
				selectEntry: opts.selectEntry,
				...opts.shouldContinue ? { shouldContinue: opts.shouldContinue } : {}
			}, stateContext, internalDeliver)
		});
	})) opts.log.info(`${opts.logLabel}: already in progress for ${opts.drainKey}, skipping`);
}
/**
* Scan the canonical delivery queue and retry any pending entries.
* Doctor imports and prepares legacy entries before this runtime recovery pass.
* Uses exponential backoff and moves entries that exhaust their retry budget to failed/.
*/
async function recoverPendingDeliveries(params, internalDeliver, stateContext = captureDeliveryQueueStateContext(params.stateDir)) {
	const opts = {
		...params,
		stateDir: stateContext.stateDir
	};
	const pending = await loadUnfinishedDeliveries(opts.stateDir, stateContext);
	if (pending.length === 0) return createEmptyDeliveryRecoverySummary();
	opts.log.info(`Found ${pending.length} pending delivery entries — starting recovery`);
	const deadline = resolveDeliveryRecoveryDeadlineMs(opts.maxRecoveryMs);
	const summary = createEmptyDeliveryRecoverySummary();
	const onDeadlineExceeded = () => {
		opts.log.warn(`Recovery time budget exceeded — remaining entries deferred to next startup`);
	};
	await recoveryCoordinator.scan({
		entries: pending,
		loadEntry: (id) => loadUnfinishedDelivery(id, opts.stateDir, stateContext),
		deadlineMs: deadline,
		onDeadlineExceeded,
		onClaimConflict: (entry) => {
			opts.log.info(`Recovery skipped for delivery ${entry.id}: already being processed`);
		},
		onMissingEntry: (entry) => {
			opts.log.info(`Recovery skipped for delivery ${entry.id}: already gone`);
		},
		onEntry: (entry) => processQueuedRecovery({
			...opts,
			entry
		}, {
			kind: "startup",
			summary,
			deadline,
			onDeadlineExceeded,
			...opts.shouldContinue ? { shouldContinue: opts.shouldContinue } : {}
		}, stateContext, internalDeliver)
	});
	opts.log.info(`Delivery recovery complete: ${summary.recovered} recovered, ${summary.failed} failed, ${summary.skippedMaxRetries} skipped (max retries), ${summary.deferredBackoff} deferred (backoff)`);
	return summary;
}
//#endregion
export { prepareDeferredDeliveryAdmission as _, emitOutboundAuditLifecycle as a, isDispatchFinalReplySessionWriterAuthorized as b, uniformOutboundAuditTerminals as c, findTerminalBatchRejection as d, isProvenBatchNotSent as f, OUTBOUND_DELIVERY_LOG_SCOPE as g, rejectQueuedDelivery as h, completedOutboundAuditTerminals as i, createMessageSentEmitter as l, persistQueuedPreSendState as m, recoverPendingDeliveries as n, emitOutboundAuditTerminals as o, persistQueuedPostSendState as p, withActiveDeliveryClaim as r, failedOutboundAuditTerminals as s, drainPendingDeliveriesCore as t, createQueuedDeliveryOwner as u, assertReplyPayloadSessionWriterDeliveryAuthorized as v, assertSessionWriterDeliveryAuthorized as y };
