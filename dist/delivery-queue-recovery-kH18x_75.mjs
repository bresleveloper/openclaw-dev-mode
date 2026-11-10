import { t as sleep } from "./sleep-BJ5slSa3.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { h as resolveDeliveryQueueAttemptCount } from "./openclaw-state-db-legacy-backfills-DGJSWaXR.mjs";
import { D as parseSessionDeliveryRoute, j as normalizeSessionPeerId } from "./session-key-CSDERtm3.mjs";
import { D as setReplyPayloadMetadata, c as getReplyPayloadMetadata } from "./reply-payload-BLX_BF2U.mjs";
import { n as stripOutboundTargetKindPrefix, r as stripTargetProviderPrefix, t as resolveTargetPrefixedChannel } from "./channel-target-prefix-D9KEia-0.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { o as parseCommandOwnerReference } from "./user-channel-identities-B1CU1eh6.mjs";
import { t as captureSessionEntryMetadataRead } from "./session-entry-source-authority-CY_NaTk4.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import { n as getGlobalHookRunner } from "./hook-runner-global-yjqy4fXI.mjs";
import { p as fireAndForgetHook } from "./hooks-CU2qx9-T.mjs";
import { n as GatewayOperatorAccessDeniedError } from "./operator-access-policy-D9L4Y9uO.mjs";
import { r as prepareCommandOwnerAuthority } from "./command-auth-D8Y1MxJm.mjs";
import { a as countPhysicalOutboundSends, i as areOutboundPayloadsIntentionallySuppressed, n as OutboundDeliveryError, o as isOutboundDeliveryAdmissionClosedError, r as PlatformMessageNotDispatchedError, s as isOutboundDeliveryError, t as OutboundDeliveryAdmissionClosedError } from "./deliver-types-ChQJdCfP.mjs";
import { a as getErrnoCode, c as isDeliveryRecoveryRetryEligible, d as resolveDeliveryNotSentRetryability, f as resolveDeliveryRecoveryDeadlineMs, i as findPlatformMessageRejectedError, l as isProvenDeliveryNotSentError, n as createDeliveryRecoveryCoordinator, o as isAmbiguousDeliveryTransportError, r as createEmptyDeliveryRecoverySummary } from "./delivery-recovery.shared-BD9P01Ce.mjs";
import { u as summarizeOutboundPayloadForTransport } from "./payloads-CZkv8Yff.mjs";
import { r as getOwedHarnessCompletionTask } from "./agent-harness-completion-recovery-C73KNckX.mjs";
import { n as resolveDeliveryQueueStateEnv, t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-jMYRv0Lv.mjs";
import "./delivery-queue-sqlite-BYjmoa0a.mjs";
import { a as settleDurableDelivery, n as completeDurableDelivery, r as markDurableDeliveryQueued } from "./delivery-completion-4GBUPDR3.mjs";
import { d as toPluginMessageSentEvent, l as toPluginMessageContext, o as toInternalMessageSentContext, t as buildCanonicalSentMessageHookContext } from "./message-hook-mappers-CqRCIn9-.mjs";
import { n as collectEntrySpoolPaths } from "./delivery-queue-media-paths-BG8SwZ0-.mjs";
import { a as canReplayAmbiguousFinalText, c as resolveMaxRetries, d as isOutboundDeliveryResultArray, f as runOutboundDeliveryCommitHooks, i as reconcileUnknownQueuedDelivery, l as shouldInspectQueuedDelivery, n as buildUnknownSendContext, p as OutboundHandoffRejectedError, r as needsUnknownSendReconciliation, s as isPermanentDeliveryError, t as buildReconciledSentResult } from "./delivery-queue-reconciliation-D87_379L.mjs";
import { n as hasTrustedMessageAuditListeners, t as emitTrustedMessageAuditEvent } from "./message-audit-events-BM6w9s4w.mjs";
import { n as resolveOutboundChannelMessageAdapter } from "./channel-resolution-JZ360Soo.mjs";
import { a as acceptedPreparedOutboundEntries, i as projectQueuedDeliveryOptions, l as preparedOutboundPayloads } from "./delivery-queue-projection-Bc9Dusno.mjs";
import { a as createDeliveryQueueMediaRetention, i as cancelDeliveryQueueMediaRetention, n as releaseSpoolArtifacts } from "./delivery-queue-media-spool-BWU_UFQL.mjs";
import { A as retireUnsentDelivery, C as claimDeliveryPlatformSendAttempt, O as ackDelivery, S as stageDeliveryFailureSettlement, _ as markDeliveryPlatformSendAttemptStarted, a as failDeliveryAfterPlatformSend, b as reserveDeliveryAttempt, d as loadPendingDelivery, g as markDeliveryPlatformOutcomeUnknown, h as loadUnfinishedDelivery, i as failDelivery, m as loadUnfinishedDeliveries, o as failDeliveryBeforePlatformSend, s as finalizeDeliveryFailureSettlement, x as restoreDeliveryAttemptBeforeDispatch, y as moveToFailed } from "./delivery-queue-storage-B0ORUZO-.mjs";
import { i as isSessionDeliveryGenerationRevokedError, n as prepareSessionDeliveryGeneration } from "./session-delivery-generation-NkiiEowi.mjs";
import { n as createInternalHookEvent, u as triggerInternalHook } from "./internal-hooks-DNLQqCT3.mjs";
//#region src/auto-reply/reply/session-writer-delivery-authority.ts
/** Capture before preparation yields; ended actors never enter durable discovery. */
function captureSessionWriterDeliveryRead(target) {
	const memory = captureSessionEntryMetadataRead(target, () => {});
	return memory ? () => memory.readCurrent() : void 0;
}
var SessionWriterDeliveryRevokedError = class extends PlatformMessageNotDispatchedError {
	constructor() {
		super("Session writer changed before final reply delivery", {
			cause: void 0,
			retryable: false
		});
		this.name = "SessionWriterDeliveryRevokedError";
	}
};
function isEntryAuthorized(authority, current) {
	if (!current || current.sessionId !== authority.expectedSessionId || authority.expectedLifecycleRevision !== void 0 && current.lifecycleRevision !== authority.expectedLifecycleRevision || authority.expectedWriterRunId !== void 0 && current.activeWriterRunId !== authority.expectedWriterRunId) return false;
	const claim = authority.harnessCompletion;
	if (claim && (claim.requesterSessionKey !== authority.sessionKey || authority.agentId !== void 0 && claim.requesterAgentId !== authority.agentId)) return false;
	try {
		return !claim || Boolean(getOwedHarnessCompletionTask(claim, current));
	} catch {
		return false;
	}
}
/** One worker preparation per delivery custody; write receipts keep its final check current. */
async function prepareSessionWriterDeliveryAuthority(authority, fallbackStorePath, env) {
	if (!authority || authority.readCurrentSession) return {
		authority,
		release() {}
	};
	const target = {
		agentId: authority.agentId,
		sessionKey: authority.sessionKey,
		storePath: authority.storePath ?? fallbackStorePath,
		projection: "list",
		env
	};
	const readMemory = captureSessionWriterDeliveryRead(target);
	if (readMemory) return {
		authority: {
			...authority,
			readCurrentSession: readMemory
		},
		release() {}
	};
	let release = () => {};
	try {
		return await withSessionEntryReadOnlyInWorker(target, () => {}, async (read, owner) => {
			if (!read.ok) throw read.error;
			const entry = read.value;
			const source = owner.source;
			if (!source) return {
				authority: {
					...authority,
					readCurrentSession: () => void 0
				},
				release() {}
			};
			const retained = retainPreparedSessionEntryPredicate({
				databaseIdentity: `file:${source.databaseIdentity}`,
				sessionKey: resolveSqliteSessionKey(authority.sessionKey, source.agentId),
				entry,
				matches: (_before, after) => isEntryAuthorized(authority, after)
			});
			release = retained.release;
			return {
				authority: {
					...authority,
					readCurrentSession: () => retained.isCurrent() ? entry : void 0
				},
				release: retained.release
			};
		});
	} catch (error) {
		release();
		throw error;
	}
}
function isAuthorityCurrent(authority) {
	return isEntryAuthorized(authority, authority.readCurrentSession?.());
}
/** A dispatcher's payload copies share one retained read until that dispatcher settles. */
function createSessionWriterDeliveryPreparation(params) {
	const prepared = /* @__PURE__ */ new WeakMap();
	return async (payload) => {
		const authority = getReplyPayloadMetadata(payload)?.sessionWriterDeliveryAuthority;
		if (!authority) return;
		if (!authority.readCurrentSession) {
			let current = prepared.get(authority);
			if (!current) {
				current = prepareSessionWriterDeliveryAuthority(authority, params.storePath).then((value) => {
					params.retain(value.release);
					return value;
				});
				prepared.set(authority, current);
			}
			const value = await current;
			setReplyPayloadMetadata(payload, { sessionWriterDeliveryAuthority: value.authority });
		}
	};
}
/** Revalidates a settled final payload against the latest committed session writer. */
function isDispatchFinalReplySessionWriterAuthorized(payload, fallbackSessionKey) {
	const authority = getReplyPayloadMetadata(payload)?.sessionWriterDeliveryAuthority;
	if (!authority) return true;
	const authorized = isAuthorityCurrent(authority);
	if (!authorized) logVerbose(`final reply skipped after session writer replacement (session=${fallbackSessionKey ?? authority.sessionKey})`);
	return authorized;
}
/** Fails closed at the provider's last pre-I/O boundary when writer ownership changed. */
function assertSessionWriterDeliveryAuthorized(authority) {
	if (authority && !isAuthorityCurrent(authority)) throw new SessionWriterDeliveryRevokedError();
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
		async retireUnsent(terminalOutcome) {
			owner.signal?.throwIfAborted();
			if (!owner.claimId) return;
			const release = await retireUnsentDelivery({
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
		async finalizeFailure(entry) {
			if (entry.id !== owner.queueId || !await finalizeDeliveryFailureSettlement(entry, owner.stateDir, context)) return false;
			custody = "released";
			return true;
		},
		fail(record, error, ambiguousTransportError) {
			owner.signal?.throwIfAborted();
			const recordInState = [
				failDelivery,
				failDeliveryAfterPlatformSend,
				failDeliveryBeforePlatformSend
			].find((candidate) => candidate === record);
			return recordInState ? recordInState(owner.queueId, error, owner.stateDir, owner.claimId, context, ambiguousTransportError) : record(owner.queueId, error, owner.stateDir, owner.claimId);
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
			const release = await owner.retireUnsent("failed");
			if (!release) throw error;
			await release();
			return true;
		}
		if (!entry) return false;
		if (entry.deliveryCompletion) await settleDurableDelivery(entry.deliveryCompletion, { rejectionError: rejection.message }, owner.stateDir, params.deliveryQueueStateContext, params.conversationDeliveryTarget);
		const spoolPaths = collectEntrySpoolPaths(preparedOutboundPayloads(entry.preparedBatch), owner.stateDir);
		if (!await owner.finalizeFailure(entry)) return false;
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
		await markDeliveryPlatformSendAttemptStarted(owner.queueId, owner.stateDir, { replyToId: params.route.replyToId ?? null }, owner.claimId || void 0, context);
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
//#region src/infra/outbound/delivery-generation.ts
/** Translate session-owner decisions into the existing queue retry/terminal contract. */
async function prepareOutboundDeliveryGeneration(generation) {
	const notDispatched = (error) => {
		throw new PlatformMessageNotDispatchedError(error instanceof Error ? error.message : "Session delivery generation is unavailable", {
			cause: error,
			retryable: !isSessionDeliveryGenerationRevokedError(error)
		});
	};
	const prepared = await prepareSessionDeliveryGeneration(generation).catch(notDispatched);
	return {
		assertCurrent() {
			try {
				prepared.assertCurrent();
			} catch (error) {
				notDispatched(error);
			}
		},
		release: prepared.release
	};
}
//#endregion
//#region src/infra/outbound/message-sent-hook.ts
const log = createSubsystemLogger("outbound/message-sent-hook");
/** Creates a best-effort emitter shared by direct and inbound-turn delivery owners. */
function createMessageSentEmitter(params) {
	const hasMessageSentHooks = params.hookRunner?.hasHooks("message_sent") ?? false;
	const canEmitInternalHook = Boolean(params.sessionKeyForInternalHooks);
	const warn = (message) => log.warn(message);
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
		if (hasMessageSentHooks) fireAndForgetHook(params.hookRunner.runMessageSent(toPluginMessageSentEvent(canonical), toPluginMessageContext(canonical)), `${params.logPrefix}: message_sent plugin hook failed`, warn);
		if (!canEmitInternalHook) return;
		fireAndForgetHook(triggerInternalHook(createInternalHookEvent("message", "sent", params.sessionKeyForInternalHooks, toInternalMessageSentContext(canonical))), `${params.logPrefix}: message:sent internal hook failed`, warn);
	};
	return {
		emitMessageSent,
		hasMessageSentHooks
	};
}
/** Bind outbound hook correlation to the accepted delivery's runtime session. */
function createOutboundMessageSentEmitter(params, logPrefix) {
	const sessionKeyForInternalHooks = params.mirror?.sessionKey ?? params.session?.key;
	return {
		...createMessageSentEmitter({
			hookRunner: getGlobalHookRunner(),
			channel: params.channel,
			to: params.to,
			accountId: params.accountId,
			sessionKeyForInternalHooks,
			isGroup: params.mirror?.isGroup,
			groupId: params.mirror?.groupId,
			runId: params.preparedBatch?.runId,
			logPrefix
		}),
		sessionKeyForInternalHooks
	};
}
//#endregion
//#region src/infra/outbound/outbound-audit.ts
function outboundQueueAuditSourceId(queueId, payloadIndex, lifecycle) {
	const terminalId = `message:outbound:queue:${queueId}:payload:${payloadIndex}`;
	return lifecycle ? `${terminalId}:${lifecycle}` : terminalId;
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
	if (latest?.status === "suppressed" && latest.reason !== "adapter_returned_no_identity") return {
		outcome: "suppressed",
		reasonCode: latest.reason === "adapter_returned_no_send" ? "no_visible_payload" : latest.reason
	};
}
function projectOutboundAuditTerminals(params, fallback) {
	const indexed = /* @__PURE__ */ new Map();
	for (const outcome of params.payloadOutcomes) {
		const history = indexed.get(outcome.index) ?? [];
		history.push(outcome);
		indexed.set(outcome.index, history);
	}
	return Array.from({ length: params.payloadCount }, (_, payloadIndex) => {
		const history = indexed.get(payloadIndex) ?? [];
		return {
			payloadIndex,
			terminal: projectRecordedOutboundAuditTerminal(history) ?? fallback(history)
		};
	});
}
function completedOutboundAuditTerminals(params) {
	return projectOutboundAuditTerminals(params, () => {
		if (params.payloadCount === 1 && params.results.length > 0) return {
			outcome: "sent",
			results: params.results
		};
		return {
			outcome: "suppressed",
			reasonCode: "no_visible_payload"
		};
	});
}
function failedOutboundAuditTerminals(params) {
	return projectOutboundAuditTerminals(params, (history) => {
		const latest = history.at(-1);
		const failed = latest?.status === "failed" ? latest : void 0;
		const failedResults = failed?.results ?? [];
		const payloadResults = failedResults.length > 0 ? failedResults : history.findLast((outcome) => outcome.status === "sent")?.results ?? [];
		const fallbackResults = params.payloadCount === 1 ? params.results : [];
		const results = payloadResults.length > 0 ? payloadResults : fallbackResults;
		return {
			outcome: "failed",
			failureStage: failed ? failed.stage : params.failureStage,
			results,
			sentBeforeError: results.length > 0 || failed !== void 0 && failed.sentBeforeError,
			...failed?.deliveryKind ? { deliveryKind: failed.deliveryKind } : {}
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
	const allowedRouteKinds = kindPrefix && Object.hasOwn(TARGET_KIND_TO_ROUTE_KINDS, kindPrefix) ? TARGET_KIND_TO_ROUTE_KINDS[kindPrefix] : void 0;
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
function outboundAuditContext(context, includeReplyHook = false) {
	const agentId = context.session?.agentId ?? context.mirror?.agentId;
	const runId = context.runId ?? context.preparedBatch?.runId ?? (includeReplyHook ? context.replyPayloadSendingHook?.runId : void 0);
	return {
		actorType: agentId ? "agent" : "system",
		actorId: agentId ?? "gateway",
		...agentId ? { agentId } : {},
		...context.preparedBatch?.executionIdentityToken ? { executionIdentityToken: context.preparedBatch.executionIdentityToken } : {},
		direction: "outbound",
		channel: context.channel,
		conversationKind: resolveConversationKind(context),
		...context.accountId ? { accountId: context.accountId } : {},
		targetId: context.to,
		...runId ? { runId } : {}
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
			...outboundAuditContext(context, true),
			durationMs: Math.max(0, Date.now() - params.startedAt),
			resultCount: countPhysicalOutboundSends(results),
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
			emitTrustedMessageAuditEvent({
				sourceId: outboundQueueAuditSourceId(params.queueId, payloadIndex, params.outcome),
				occurredAt: Date.now(),
				status: "started",
				...outboundAuditContext(params.context),
				durationMs: Math.max(0, Date.now() - params.startedAt),
				resultCount: 0,
				kind: "message",
				...params.outcome === "queued" ? {
					action: "message.outbound.queued",
					outcome: "queued"
				} : {
					action: "message.outbound.platform-started",
					outcome: "platform_started"
				}
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
		...params.queueId ? { sourceId: outboundQueueAuditSourceId(params.queueId, indexed.payloadIndex) } : {}
	});
}
//#endregion
//#region src/infra/outbound/delivery-queue-recovery-params.ts
async function buildRecoveryDeliverParams(entry, cfg, stateDir, producerClaimId, stateContext) {
	const conversationCompletion = entry.deliveryCompletion?.kind === "conversation" ? entry.deliveryCompletion : void 0;
	const pendingFinal = entry.deliveryCompletion?.kind === "pending-final" ? entry.deliveryCompletion : void 0;
	let owner;
	const rejection = (error) => new PlatformMessageNotDispatchedError("Original channel owner authorization could not be checked", {
		cause: error,
		retryable: !(error instanceof GatewayOperatorAccessDeniedError)
	});
	if (pendingFinal?.commandOwnerReference !== void 0) {
		const reference = parseCommandOwnerReference(pendingFinal.commandOwnerReference);
		if (!reference) throw rejection(new GatewayOperatorAccessDeniedError());
		try {
			owner = await prepareCommandOwnerAuthority(cfg, reference, { env: resolveDeliveryQueueStateEnv(stateDir, stateContext) });
		} catch (error) {
			throw new PlatformMessageNotDispatchedError("Original channel owner preparation interrupted", { cause: error });
		}
		if (!owner.source) throw rejection(new GatewayOperatorAccessDeniedError());
	}
	const writer = await prepareSessionWriterDeliveryAuthority(pendingFinal?.sessionWriterDeliveryAuthority, pendingFinal?.storePath, resolveDeliveryQueueStateEnv(stateDir, stateContext));
	const assertCurrent = () => {
		try {
			if (pendingFinal?.commandOwnerReference !== void 0 && !owner?.isCurrent(cfg)) throw new Error("Original channel owner capture changed during delivery");
		} catch (error) {
			throw rejection(error);
		}
		assertSessionWriterDeliveryAuthorized(writer.authority);
	};
	return {
		release: writer.release,
		cfg,
		...projectQueuedDeliveryOptions(entry),
		...entry.queuePolicy !== void 0 ? { queuePolicy: entry.queuePolicy } : {},
		...entry.requireUnknownSendReconciliation === true ? { requireUnknownSendReconciliation: true } : {},
		payloads: preparedOutboundPayloads(entry.preparedBatch),
		preparedBatch: entry.preparedBatch,
		reply: entry.reply,
		...conversationCompletion ? { conversationDeliveryAttemptAuthority: {
			agentId: conversationCompletion.agentId,
			operationId: conversationCompletion.operationId,
			...conversationCompletion.storePath ? { storePath: conversationCompletion.storePath } : {},
			...conversationCompletion.routeFingerprint ? { routeFingerprint: conversationCompletion.routeFingerprint } : {}
		} } : {},
		...pendingFinal ? {
			onDirectAdapterHandoff: async () => assertCurrent(),
			assertDirectAdapterHandoff: assertCurrent,
			onPlatformSendDispatch: async () => assertCurrent()
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
//#endregion
//#region src/infra/outbound/delivery-queue-recovery.ts
const recoveryCoordinator = createDeliveryRecoveryCoordinator();
function emitRecoveredMessageSentEvents(entry, events) {
	const { emitMessageSent } = createOutboundMessageSentEmitter(entry, OUTBOUND_DELIVERY_LOG_SCOPE);
	for (const event of events) emitMessageSent(event);
}
function emitRecoveredTerminalEvents(entry, outcome) {
	if (entry.legacyPreparedContentUnavailable) return;
	const collectedBySourceIndex = "error" in outcome ? new Map((outcome.collected ?? []).map(({ sourceIndex, event }) => [sourceIndex, event])) : void 0;
	const preparedEntries = acceptedPreparedOutboundEntries(entry.preparedBatch);
	let messageIds = [];
	if ("result" in outcome) {
		if (preparedEntries.length === 0) return;
		const { result } = outcome;
		const receiptMessageIds = result.receipt?.parts.length ? result.receipt.parts.toSorted((left, right) => left.index - right.index).map((part) => part.platformMessageId) : result.receipt?.platformMessageIds;
		messageIds = preparedEntries.length === 1 ? [result.messageId || receiptMessageIds?.[0]] : receiptMessageIds?.length === preparedEntries.length ? receiptMessageIds : [];
	}
	emitRecoveredMessageSentEvents(entry, preparedEntries.map((prepared, index) => {
		const summary = summarizeOutboundPayloadForTransport(prepared.payload);
		const content = summary.hookContent ?? summary.text;
		if ("error" in outcome) return collectedBySourceIndex?.get(prepared.sourceIndex) ?? {
			success: false,
			content,
			error: outcome.error
		};
		const messageId = messageIds[index];
		const event = {
			success: true,
			content
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
function emitQueuedDeliveryResults(entry, results, payloadOutcomes = [], failureStage) {
	emitQueuedAuditTerminals(entry, () => {
		const batch = {
			payloadCount: entry.preparedBatch.sourcePayloadCount,
			results,
			payloadOutcomes
		};
		return failureStage === void 0 ? completedOutboundAuditTerminals(batch) : failedOutboundAuditTerminals({
			...batch,
			failureStage: failureStage()
		});
	});
}
async function withActiveDeliveryClaim(entryId, fn) {
	return recoveryCoordinator.withClaim(entryId, fn);
}
async function recordRecoveryFailure(owner, error, record = failDelivery) {
	try {
		await owner.fail(record, error);
	} catch (failure) {
		if (getErrnoCode(failure) === "ENOENT") return "already-gone";
	}
	return "failed";
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
		if (entry.deliveryCompletion) await settleDurableDelivery(entry.deliveryCompletion, settlement.outcome === "failed" && settlement.rejectionError !== void 0 ? { rejectionError: settlement.rejectionError } : { platformSendStarted: true }, params.stateDir, stateContext);
		const spoolPaths = collectEntrySpoolPaths(preparedOutboundPayloads(entry.preparedBatch), params.stateDir);
		const leaseId = spoolPaths.length > 0 ? await createDeliveryQueueMediaRetention(spoolPaths, "outbound-media-recovery-lease", params.stateDir, stateContext) : void 0;
		try {
			if (!await finalizeDeliveryFailureSettlement(entry, params.stateDir, stateContext)) return "already-gone";
			terminalized = true;
			emitRecoveredTerminalEvents(entry, {
				error: settlement.error,
				collected: params.events
			});
			emitQueuedAuditTerminals(entry, settlement.terminals ?? (() => uniformOutboundAuditTerminals(entry.preparedBatch.sourcePayloadCount, {
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
						payloads: preparedOutboundPayloads(entry.preparedBatch),
						cfg: params.cfg
					}));
				} catch (error) {
					params.log.warn(`Delivery entry ${entry.id} unknown-send terminal cleanup failed: ${formatErrorMessage(error)}`);
				}
			}
			await releaseSpoolArtifacts(spoolPaths, params.stateDir);
		} finally {
			await cancelDeliveryQueueMediaRetention(leaseId, params.stateDir, stateContext);
		}
	} catch (error) {
		params.log.warn(`Delivery entry ${params.entry.id} ${terminalized ? "terminal cleanup failed" : "settlement pending"}: ${formatErrorMessage(error)}`);
	}
	return terminalized ? "moved-to-failed" : "failed";
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
		const { entry } = params;
		const payload = preparedOutboundPayloads(entry.preparedBatch)[0] ?? {};
		const base = {
			cfg: params.cfg,
			to: entry.to,
			deliveryQueueId: entry.id,
			accountId: entry.accountId,
			replyToId: entry.effectiveReplyToId !== void 0 ? entry.effectiveReplyToId : entry.reply?.replyToId,
			replyToMode: entry.reply?.source === "implicit" ? entry.reply.mode : void 0,
			threadId: entry.threadId,
			silent: entry.silent,
			text: payload.text ?? "",
			result: {
				messageId: result.messageId,
				receipt: result.receipt
			}
		};
		let context;
		if (payload.presentation !== void 0 || payload.delivery !== void 0 || payload.interactive !== void 0 || payload.channelData !== void 0 && Object.keys(payload.channelData).length > 0) context = {
			...base,
			kind: "payload",
			mediaUrl: payload.mediaUrl,
			payload
		};
		else {
			const mediaUrl = payload.mediaUrl ?? payload.mediaUrls?.find((url) => url);
			context = mediaUrl ? {
				...base,
				kind: "media",
				mediaUrl,
				audioAsVoice: payload.audioAsVoice,
				gifPlayback: entry.gifPlayback,
				forceDocument: entry.forceDocument
			} : {
				...base,
				kind: "text"
			};
		}
		await afterCommit(context);
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
			emitRecoveredTerminalEvents(opts.entry, { result });
			await runOutboundDeliveryCommitHooks([result]);
			emitQueuedDeliveryResults(opts.entry, [result]);
			opts.onDelivered?.([result], []);
		}
	} else if (operation.state === "rejected") {
		emitQueuedDeliveryResults(opts.entry, [], [], () => "platform_send");
		const error = operation.rejectionError ?? "delivery permanently rejected before platform dispatch";
		emitRecoveredTerminalEvents(opts.entry, { error });
		opts.onFailed?.(opts.entry, error);
		return "failed";
	} else if (operation.state === "suppressed") {
		emitQueuedAuditTerminals(opts.entry, () => uniformOutboundAuditTerminals(opts.entry.preparedBatch.sourcePayloadCount, {
			outcome: "suppressed",
			reasonCode: "no_visible_payload"
		}));
		opts.onDelivered?.([], []);
	}
	opts.onRecovered?.(opts.entry);
	return "recovered";
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
	const attemptBudgetExhausted = resolveDeliveryQueueAttemptCount(entry) >= maxRetries;
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
			payloads: preparedOutboundPayloads(entry.preparedBatch),
			cfg: opts.cfg,
			warn: (message) => opts.log.warn(message),
			assertCurrent: () => stateContext.workerContext.admission.assertCurrent()
		});
		if (reconciliation?.status === "sent") try {
			const result = buildReconciledSentResult(entry, reconciliation);
			if (entry.deliveryCompletion) await completeDurableDelivery(entry.deliveryCompletion, result, opts.stateDir, stateContext, void 0, {
				results: [result],
				payloadCount: entry.preparedBatch.sourcePayloadCount,
				payloadOutcomes: [{
					index: 0,
					status: "sent",
					results: [result]
				}]
			});
			await owner.ack();
			emitRecoveredTerminalEvents(entry, { result });
			await runReconciledSentCommitHooks({
				entry,
				cfg: opts.cfg,
				reconciliation,
				log: opts.log,
				assertCurrent: () => stateContext.workerContext.admission.assertCurrent()
			});
			emitQueuedDeliveryResults(entry, [result]);
			opts.onRecovered?.(entry);
			opts.onDelivered?.([result], []);
			opts.log.info(`Delivery entry ${entry.id} reconciled unknown_after_send as already sent`);
			return "recovered";
		} catch (ackErr) {
			if (getErrnoCode(ackErr) === "ENOENT") return "already-gone";
			const errMsg = `failed to ack reconciled sent delivery: ${formatErrorMessage(ackErr)}`;
			opts.log.warn(`Delivery entry ${entry.id} ${errMsg}`);
			opts.onFailed?.(entry, errMsg);
			return await recordRecoveryFailure(owner, errMsg);
		}
		const reconciliationProvedPreSendFailure = reconciliation?.status === "not_sent" && entry.recoveryState === "send_attempt_started";
		const replayFinalText = !attemptBudgetExhausted && canReplayAmbiguousFinalText(entry);
		if (reconciliationProvedPreSendFailure || replayFinalText) {
			reconciledPlatformSendAttemptId = entry.platformSendAttemptId;
			reconciledPlatformSendStartedAt = entry.platformSendStartedAt;
			opts.log.info(replayFinalText ? `Delivery entry ${entry.id} retrying an unconfirmed final text reply` : `Delivery entry ${entry.id} reconciled ${entry.recoveryState} as not sent; replaying`);
		} else {
			let errMsg = `delivery state is ${entry.recoveryState}; refusing blind replay without adapter reconciliation`;
			if (reconciliation?.status === "not_sent") errMsg = `delivery state is ${entry.recoveryState}; refusing full replay after post-send evidence`;
			else if (reconciliation?.status === "unresolved" && reconciliation.error) errMsg = `delivery state is ${entry.recoveryState} and reconciliation is unresolved: ${reconciliation.error}`;
			opts.log.warn(`Delivery entry ${entry.id} ${errMsg}`);
			opts.onFailed?.(entry, errMsg);
			if (reconciliation?.status === "unresolved" && reconciliation.retryable === true && !attemptBudgetExhausted) return await recordRecoveryFailure(owner, errMsg);
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
	let attemptError;
	let deliveredResults = [];
	let commitHooksRun = false;
	const collectPayloadOutcome = (outcome) => {
		if (!payloadOutcomes.includes(outcome)) payloadOutcomes.push(outcome);
	};
	const recordAttemptError = (error) => {
		attemptError = owner.project(error, {
			results: deliveredResults,
			payloadOutcomes
		});
	};
	const runCommitHooksAfterAck = async () => {
		if (postSendState !== "acked" || commitHooksRun) return;
		commitHooksRun = true;
		emitRecoveredMessageSentEvents(entry, messageSentEvents.map(({ event }) => event));
		if (deliveredResults.length > 0) await runOutboundDeliveryCommitHooks(deliveredResults);
	};
	const requiresProducerClaim = typeof entry.completionRetention === "object" || entry.requiresProducerClaim === true || typeof entry.producerClaimId === "string" || typeof entry.platformSendAttemptId === "string";
	const producerClaimId = requiresProducerClaim ? await claimDeliveryPlatformSendAttempt(entry.id, opts.stateDir, reconciledPlatformSendStartedAt, reconciledPlatformSendAttemptId, stateContext, canReplayAmbiguousFinalText(entry) ? true : void 0) : void 0;
	if (requiresProducerClaim && !producerClaimId) {
		opts.log.info(`Recovery skipped for delivery ${entry.id}: producer ownership already claimed`);
		return "already-gone";
	}
	owner.claimId = recoveryPlatformAttemptId(entry, producerClaimId);
	const persistPostSendState = () => persistQueuedPostSendState({
		owner,
		queuePolicy: entry.queuePolicy ?? "best_effort",
		preserveBatch: Boolean(producerClaimId),
		retainSpoolArtifacts: true,
		onPostSendMarkerError: (error) => {
			opts.log.warn(`Delivery entry ${entry.id} failed to persist post-send state; falling back to direct ack: ${formatErrorMessage(error)}`);
		}
	}, stateContext);
	const reservation = await reserveDeliveryAttempt(entry.id, maxRetries, opts.stateDir, producerClaimId || void 0, stateContext);
	if (reservation.status === "exhausted") {
		const errMsg = `delivery retry budget exhausted (${reservation.attemptCount}/${maxRetries})`;
		opts.onFailed?.(entry, errMsg);
		return settleQueuedFailure({
			...opts,
			error: errMsg,
			claimedAttemptId: producerClaimId
		}, stateContext);
	}
	const recoverySpoolPaths = collectEntrySpoolPaths(preparedOutboundPayloads(entry.preparedBatch), opts.stateDir);
	let mediaRecoveryLeaseId;
	let generation;
	let releaseWriterAuthority;
	try {
		if (entry.sessionGeneration !== void 0) generation = await prepareOutboundDeliveryGeneration(entry.sessionGeneration);
		mediaRecoveryLeaseId = recoverySpoolPaths.length > 0 ? await createDeliveryQueueMediaRetention(recoverySpoolPaths, "outbound-media-recovery-lease", opts.stateDir, stateContext) : void 0;
		const { release, ...deliveryParams } = await buildRecoveryDeliverParams(entry, opts.cfg, opts.stateDir, producerClaimId, stateContext);
		releaseWriterAuthority = release;
		let dispatchAdmitted = false;
		const result = await deliver({
			...deliveryParams,
			deliveryQueueOwner: owner,
			assertDirectAdapterHandoff: () => {
				deliveryParams.assertDirectAdapterHandoff?.();
				generation?.assertCurrent();
			},
			onPayloadDeliveryOutcome: collectPayloadOutcome,
			onMessageSentEvent: (event, sourceIndex) => messageSentEvents.push({
				sourceIndex,
				event
			}),
			onPlatformSendStart: async () => {
				platformSendStarted = true;
			},
			onDeliveryResult: async (deliveryResult) => {
				if (!deliveredResults.includes(deliveryResult)) deliveredResults.push(deliveryResult);
				postSendState ??= await persistPostSendState();
			},
			onPlatformSendDispatch: async () => {
				await deliveryParams.onPlatformSendDispatch?.();
				generation?.assertCurrent();
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
			recordAttemptError(/* @__PURE__ */ new Error(error));
			return "failed";
		}
		if (results.length > 0) deliveredResults = [...results];
		const failedOutcome = failedOutcomes[0];
		if (failedOutcome) throw new OutboundDeliveryError(formatErrorMessage(failedOutcome.error), {
			cause: new AggregateError(failedOutcomes.map((outcome) => outcome.error)),
			results,
			payloadOutcomes,
			stage: failedOutcome.stage
		});
		if (entry.deliveryCompletion) {
			const terminalResult = results.at(-1);
			await settleDurableDelivery(entry.deliveryCompletion, terminalResult ? {
				result: terminalResult,
				batch: {
					results,
					payloadCount: entry.preparedBatch.sourcePayloadCount,
					payloadOutcomes
				}
			} : { platformSendStarted: false }, opts.stateDir, stateContext);
		}
		postSendState ??= results.length > 0 ? await persistPostSendState() : void 0;
		if (postSendState === "failed") {
			const errMsg = "recovered send completed but queue finalization failed";
			opts.onFailed?.(entry, errMsg);
			opts.log.warn(`Delivery entry ${entry.id} ${errMsg}; preserving unknown_after_send`);
			recordAttemptError(/* @__PURE__ */ new Error(errMsg));
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
			recordAttemptError(new Error(ackError));
			return "failed";
		}
		await runCommitHooksAfterAck();
		emitQueuedDeliveryResults(entry, results, payloadOutcomes);
		opts.onRecovered?.(entry);
		opts.onDelivered?.(results, payloadOutcomes);
		return "recovered";
	} catch (err) {
		if (isOutboundDeliveryAdmissionClosedError(err)) {
			await restoreDeliveryAttemptBeforeDispatch(entry, reservation.attemptCount, opts.stateDir, producerClaimId, stateContext);
			return "stopped";
		}
		const errMsg = formatErrorMessage(err);
		opts.onFailed?.(entry, errMsg);
		if (isOutboundDeliveryError(err)) {
			if (err.results.length > 0) deliveredResults = [...err.results];
			for (const outcome of err.payloadOutcomes) collectPayloadOutcome(outcome);
		}
		recordAttemptError(err);
		if (deliveredResults.length > 0 || postSendState !== void 0 || isOutboundDeliveryError(err) && err.sentBeforeError) {
			try {
				postSendState ??= await persistPostSendState();
				if (postSendState === "marked" && entry.retryAmbiguousFinalText === true) await owner.fail(failDeliveryAfterPlatformSend, errMsg, deliveredResults.length === 0 && isAmbiguousDeliveryTransportError(err) ? true : void 0);
			} catch (persistErr) {
				opts.log.error(`Delivery entry ${entry.id} could not persist post-send evidence: ${formatErrorMessage(persistErr)}`);
			}
			if (postSendState === "acked") {
				await runCommitHooksAfterAck();
				emitQueuedDeliveryResults(entry, deliveredResults, payloadOutcomes, () => isOutboundDeliveryError(err) ? err.stage : "platform_send");
			}
			opts.log.warn(`Delivery entry ${entry.id} partially sent before recovery failed; preserving unknown_after_send`);
			return "failed";
		}
		if (owner.custody === "released") {
			emitQueuedDeliveryResults(entry, deliveredResults, payloadOutcomes, () => isOutboundDeliveryError(err) ? err.stage : "platform_send");
			return "failed";
		}
		const failureErrors = [err, ...payloadOutcomes.flatMap((outcome) => outcome.status === "failed" ? [outcome.error] : [])];
		const permanentPlatformRejection = findTerminalBatchRejection(failureErrors);
		if (permanentPlatformRejection || failureErrors.every((error) => isPermanentDeliveryError(formatErrorMessage(error)))) return settleQueuedFailure({
			...opts,
			error: errMsg,
			claimedAttemptId: producerClaimId,
			...permanentPlatformRejection ? { rejectionError: permanentPlatformRejection.message } : {},
			events: messageSentEvents,
			terminals: failedOutboundAuditTerminals({
				payloadCount: entry.preparedBatch.sourcePayloadCount,
				results: deliveredResults,
				payloadOutcomes,
				failureStage: "queue"
			})
		}, stateContext);
		return await recordRecoveryFailure(owner, errMsg, isProvenDeliveryNotSentError(err) ? failDeliveryBeforePlatformSend : failDelivery);
	} finally {
		releaseWriterAuthority?.();
		generation?.release();
		await cancelDeliveryQueueMediaRetention(mediaRecoveryLeaseId, opts.stateDir, stateContext);
		const pending = await loadUnfinishedDelivery(entry.id, opts.stateDir, stateContext).catch(() => entry);
		if (!pending) await releaseSpoolArtifacts(recoverySpoolPaths, opts.stateDir);
		if (attemptError) {
			if (!pending) attemptError.queueCustody = "released";
			opts.onAttemptFailed?.(attemptError);
		}
	}
}
/** Startup and reconnect share custody, admission, retry, and settlement ordering. */
async function processQueuedRecovery(opts, context, stateContext, internalDeliver) {
	const { entry, log } = opts;
	if (opts.shouldContinue?.() === false) return "stop";
	const label = context.kind === "startup" ? `Delivery ${entry.id}` : `${context.logLabel}: entry ${entry.id}`;
	if (entry.settlement) {
		await settleQueuedFailure({
			...opts,
			error: entry.settlement.error
		}, stateContext);
		return "continue";
	}
	if (!shouldInspectQueuedDelivery(entry, Date.now())) {
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
	if (opts.shouldContinue?.() === false) return "stop";
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
	const attemptCount = resolveDeliveryQueueAttemptCount(entry);
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
	if (opts.shouldContinue?.() === false) return "stop";
	return await drainQueuedEntry({
		...opts,
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
/** The live producer keeps its claim and waits for the same recovery owner as restart. */
async function recoverLiveFinalDelivery(params, stateContext) {
	const entry = await loadUnfinishedDelivery(params.entryId, params.stateDir, stateContext);
	if (!entry || !canReplayAmbiguousFinalText(entry) || entry.settlement) return { status: "not-attempted" };
	const eligibility = isDeliveryRecoveryRetryEligible(entry, Date.now());
	if (!eligibility.eligible) await sleep(eligibility.remainingBackoffMs);
	const outcome = { value: { status: "not-attempted" } };
	const current = await loadUnfinishedDelivery(entry.id, params.stateDir, stateContext);
	if (!current) return outcome.value;
	await processQueuedRecovery({
		...params,
		entry: current,
		onDelivered: (delivered, outcomes) => {
			outcome.value = {
				status: "recovered",
				results: delivered,
				payloadOutcomes: outcomes
			};
		},
		onAttemptFailed: (error) => {
			outcome.value = {
				status: "failed",
				error,
				results: error.results,
				payloadOutcomes: error.payloadOutcomes
			};
		}
	}, {
		kind: "drain",
		logLabel: "Final delivery recovery",
		selectEntry: () => ({
			match: true,
			bypassBackoff: true
		})
	}, stateContext);
	if (outcome.value.status === "recovered") return outcome.value;
	const pending = await loadUnfinishedDelivery(entry.id, params.stateDir, stateContext);
	if (pending && resolveDeliveryQueueAttemptCount(pending) >= resolveMaxRetries(pending)) {
		if (await settleQueuedFailure({
			...params,
			entry: pending,
			error: pending.lastError ?? "delivery retry budget exhausted"
		}, stateContext) === "moved-to-failed" && outcome.value.status === "failed") outcome.value.error.queueCustody = "released";
	}
	return outcome.value;
}
async function drainPendingDeliveriesCore(params, internalDeliver, stateContext = captureDeliveryQueueStateContext(params.stateDir)) {
	const opts = {
		...params,
		stateDir: stateContext.stateDir
	};
	if (!await recoveryCoordinator.withDrain(opts.drainKey, async () => {
		const now = Date.now();
		const matchingEntries = (await loadUnfinishedDeliveries(opts.stateDir, stateContext)).filter((entry) => shouldInspectQueuedDelivery(entry, now, opts.selectEntry));
		if (matchingEntries.length > 0) opts.onPending?.();
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
				selectEntry: opts.selectEntry
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
	opts.onPending?.();
	opts.log.info(`Found ${pending.length} pending delivery entries — starting recovery`);
	const deadline = resolveDeliveryRecoveryDeadlineMs(opts.maxRecoveryMs);
	const summary = createEmptyDeliveryRecoverySummary();
	const onDeadlineExceeded = () => {
		opts.log.warn(`Recovery time budget exceeded — remaining entries deferred to next startup`);
	};
	await recoveryCoordinator.scan({
		entries: pending.filter((entry) => shouldInspectQueuedDelivery(entry, Date.now())),
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
			onDeadlineExceeded
		}, stateContext, internalDeliver)
	});
	opts.log.info(`Delivery recovery complete: ${summary.recovered} recovered, ${summary.failed} failed, ${summary.skippedMaxRetries} skipped (max retries), ${summary.deferredBackoff} deferred (backoff)`);
	return summary;
}
//#endregion
export { isDispatchFinalReplySessionWriterAuthorized as C, createSessionWriterDeliveryPreparation as S, persistQueuedPreSendState as _, completedOutboundAuditTerminals as a, prepareDeferredDeliveryAdmission as b, failedOutboundAuditTerminals as c, createOutboundMessageSentEmitter as d, prepareOutboundDeliveryGeneration as f, persistQueuedPostSendState as g, isProvenBatchNotSent as h, withActiveDeliveryClaim as i, uniformOutboundAuditTerminals as l, findTerminalBatchRejection as m, recoverLiveFinalDelivery as n, emitOutboundAuditLifecycle as o, createQueuedDeliveryOwner as p, recoverPendingDeliveries as r, emitOutboundAuditTerminals as s, drainPendingDeliveriesCore as t, createMessageSentEmitter as u, rejectQueuedDelivery as v, prepareSessionWriterDeliveryAuthority as w, assertSessionWriterDeliveryAuthorized as x, OUTBOUND_DELIVERY_LOG_SCOPE as y };
