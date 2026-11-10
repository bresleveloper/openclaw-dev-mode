import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, m as readNonBlankString, s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { I as resolveTimestampMsToIsoString, c as asFiniteNumberInRange, d as asPositiveSafeInteger, j as resolveIntegerOption, y as parseDateStringTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { a as resolveGlobalSingleton, r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-BH2yUdBz.mjs";
import "./src-Djeo9OvP.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { o as normalizeHyphenSlug } from "./string-normalization-D6DKCpwE.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-gjJ-tD2q.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-DqJSDH8t.mjs";
import { n as sha256Hex, t as redactIdentifier } from "./node-crypto-BG4u3UnX.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { m as SessionPendingInputCustodyError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { n as SessionGoalOperationError } from "./goals-operations.types-DnxMqPtA.mjs";
import { n as SqliteSessionMutationConflictError, r as SqliteTranscriptMutationConflictError, t as SessionEntryLifecycleUpsertConflictError } from "./session-mutation-conflict-error-CvNdAcA_.mjs";
import { t as SessionTranscriptReadFenceError } from "./session-transcript-read-fence-error-DoYPfzaJ.mjs";
import { n as parseTranscriptAppendRefusal, t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { c as SqliteWorkerError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { i as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-CrMEEYuY.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { C as isDreamingNarrativeSessionStoreKey, M as parseAgentSessionKey, _ as toAgentStoreSessionKey, x as isCronRunSessionKey } from "./session-key-CSDERtm3.mjs";
import { n as normalizeSessionEntryTimestamp, t as hasValidSessionEntryIdentity } from "./session-entry-json-iiByG7LE.mjs";
import { i as decodeUsageCostRollupEnvelope } from "./session-cost-usage-rollup-codec-BkTlisOD.mjs";
import { t as attachSessionEntrySnapshots } from "./session-entry-snapshot-values-CSxUX6LQ.mjs";
import { a as isReadableSessionMessage, i as isIndexedSessionEntry, n as classifySessionFileEntry, o as parseOpaqueLeafEntry, r as findSessionTranscriptHeader, t as assertCurrentSessionTranscriptHeader } from "./session-entry-codec-DSMJ1XFN.mjs";
import { f as selectResetKeptEntries } from "./tool-result-pairing-B20tITEh.mjs";
import { n as projectModelContextMessages } from "./model-context-message-CFPsc6fp.mjs";
import { n as projectSessionTranscriptReportFacts, o as projectSessionModelContextNavigation } from "./session-transcript-report-facts-CJXa6teM.mjs";
import { l as resolveTerminalAssistantTranscriptRunId, s as readSessionTranscriptRunId } from "./transcript-events-D3brcRJS.mjs";
import { i as resolveSessionAuthProfileOverrideSource } from "./auth-profile-override-provenance-Jztnei-C.mjs";
import { t as hasSessionActiveAutoModelFallback } from "./model-override-provenance-ByJqxWxk.mjs";
import "./openclaw-runtime-paths-BEYXs6HA.mjs";
import { r as isInternalNonDeliveryChannel } from "./message-channel-constants-B3vfipkP.mjs";
import { t as extractAssistantPhaseText } from "./chat-message-content-C-d0FKNG.mjs";
import { a as resolveSessionWorkStartError } from "./session-work-start-Sz_vqYld.mjs";
import { a as runWithCliHistoryWriter, n as advanceCliHistoryBoundary, r as getCliHistoryWriter, t as CLI_HISTORY_CHANGED_BEFORE_PREPARATION } from "./cli-history-boundary-B1eSXpAQ.mjs";
import { c as normalizeDeliveryContext, l as normalizeSessionDeliveryState, n as deliveryContextKey, o as mergeDeliveryContext, t as deliveryContextFromChannelRoute } from "./delivery-context.shared-I8-iaaj1.mjs";
import { a as hasBillableUsage, i as deriveSessionTotalTokens, o as hasNonzeroUsage, r as derivePromptTokens, u as normalizeUsage } from "./usage-BqbJmOEZ.mjs";
import { u as mimeTypeFromFilePath } from "./mime-C3j3dfQb.mjs";
import { i as sessionDeliveryRoute, n as sessionDeliveryChannel, r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { r as resolveResetBoundaryHeaderCwd, t as createSessionTranscriptHeader } from "./transcript-header-DiYg502H.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as parseConversationRouteContext } from "./conversation-route-context-ulGSQNwr.mjs";
import { a as assertConversationAuthority, i as ConversationDeliveryMissingError, n as normalizeConversationDeliveryOperationId, t as assertConversationDeliveryInput } from "./conversation-delivery-policy-BttgDEjN.mjs";
import { n as conversationIdentityFromSessionEntry } from "./conversation-identity-BApT92qN.mjs";
import { n as selectUniqueConversationRows, t as normalizeStoredConversationRef } from "./conversation-record-policy-Be1VfHuC.mjs";
import "./payload-limits-ChDi8AHf.mjs";
import { i as projectPendingInputReceipts, n as normalizePendingInputReceiptRunIds, o as resolvePendingInputHistoryLimit, r as parseSessionPendingInputMessage, s as selectPendingInputHistoryPage, t as isFinalInputCompletion } from "./session-pending-input-value-CPY0B7Hg.mjs";
import { n as bindPreparedSessionEntryPublication, p as communicationEntryBinding } from "./session-accessor.sqlite-entry-cache-publication-BpzZnZxY.mjs";
import { n as participantIdentityNamespace, t as mergeParticipantAggregate } from "./session-participant-identity-Btc25HNW.mjs";
import { o as publishCommittedSessionIdentity } from "./session-accessor.sqlite-identity-2UHa91m7.mjs";
import { c as hasInterSessionUserProvenance, h as normalizeInputProvenance, o as applyInputProvenanceToUserMessage } from "./input-provenance-D1LHo5Qj.mjs";
import { a as mergeSessionTranscriptVisiblePathWithOpaqueAppendPath, f as selectSessionTranscriptLeafControlledPath, l as scanSessionTranscriptTree, m as selectSessionTranscriptTreeTipNodes, n as isSessionTranscriptLeafControl, p as selectSessionTranscriptTreePathNodes, u as selectSessionTranscriptActiveEntries } from "./transcript-tree-D61jhi_i.mjs";
import { i as applyBoardOps, r as BoardValidationError } from "./board-layout-6DyK3jbx.mjs";
import { a as createBoardWidgetPutSnapshot, i as createBoardWidgetPutResult, o as normalizeBoardWidgetPutParams, r as createBoardGrantSnapshot, s as resolveBoardWidgetPutParams } from "./board-store-BfhfCr3L.mjs";
import { t as normalizeProgressCardWrite } from "./progress-card-values-db2Uu3Dz.mjs";
import "./session-suggestion-policy-D8gImch7.mjs";
import { a as preserveSqliteSameKeySessionRolloverLineage, l as buildSessionCreationStamp, p as preserveCreationStamp, s as MAX_SESSION_PARTICIPANTS } from "./session-entry-lineage-B7Mubzwj.mjs";
import { a as SessionWorkStartInvalidatedError, i as SessionWorkStartChangedError } from "./work-start-error-BI-UhSB2.mjs";
import { A as sameRestartRecoveryTerminalRunIds, C as mergeRestartRecoveryTerminalDeliveryEvidence, _ as getRestartRecoveryTerminalDeliveryEvidence, b as hasRestartRecoveryTerminalRun, g as getRestartRecoveryPendingFinalSourceRunId, m as buildRestartRecoveryClaimCleanupPatch, r as countUnarchivedSessionEntries, w as mergeRestartRecoveryTerminalRunIds, y as hasRestartRecoverySourceClaim } from "./store-maintenance-BqMt1Twc.mjs";
import { n as iterateSessionContextEntries, o as stripCompactionReplayCheckpoint, r as iterateSessionContextMessages } from "./session-BEAHkH3E.mjs";
import { n as SessionEntryNavigation, r as normalizeSessionContextEntryBoundaries, t as projectSessionModelContext } from "./session-model-context-read-3qrBOsBk.mjs";
import { n as SessionTranscriptSourceMessageTooLargeError, t as SOURCE_PAGE_MAX_BYTES } from "./session-transcript-source-pages-DzseyJB5.mjs";
import { t as isVisibleHistoryNonMessageEvent } from "./session-history-visibility-CUkAHE4T.mjs";
import { a as transcriptEventContextEligibility, i as shouldProjectActiveEvent, n as hasTranscriptMessage, t as extractTranscriptIndexEntry } from "./session-transcript-projection-append-DGPoJ8qL.mjs";
import { i as projectSessionEntryRecord } from "./session-entry-projection-E2uWbpaJ.mjs";
import { t as resolveSessionResetRecallCutoff } from "./session-reset-recall-Be-x5cWW.mjs";
import { t as shouldPreserveSessionCleanupEntry } from "./cleanup-service-read.policy-Bh5cybQV.mjs";
import { t as parseCompactionDetails } from "./compaction-details-BL6y2Xrl.mjs";
import { i as resolveTranscriptAppendParent, r as preparedAssistantMessagesPreserveTurn } from "./transcript-append-parent-D0iXiZfS.mjs";
import { t as readMessageIdempotencyKey } from "./transcript-message-identity-0wQEn3Eb.mjs";
import { a as resolveSessionMaintenancePreserveKeys, c as collectSessionStateIdsForEntry, o as planSessionEntryMaintenance, t as canonicalizeTranscriptEventMedia } from "./transcript-event-media-C4aKs47S.mjs";
import { n as isSubagentSessionRow } from "./session-list-visibility-DANqo5ac.mjs";
import { n as forkCliSessionBindings, t as clearAllCliSessions } from "./cli-session-binding-Dx1VbkI8.mjs";
import { i as mergeSessionEntryPreserveActivity, o as resolveFreshSessionTotalTokens, r as mergeSessionEntry } from "./types-BGDhC4_W.mjs";
import { a as createSessionGoalOperationResult, i as assertSessionGoalOperationTime, l as accountSessionGoalUsage, n as OPERATION_VALIDITY_MS, o as operationFingerprint, r as applySessionGoalOperation, s as prepareSessionTurnGoalMessage } from "./goals-operation-policy-qSLTo9UN.mjs";
import { i as assertModelSelectionUnlocked, t as MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE } from "./model-overrides-CgHG3YVT.mjs";
import { t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-CkjJ0jcJ.mjs";
import { i as readMessageWorkContext } from "./work-context-Cn4SLmAO.mjs";
import { n as extractSessionBranchHeadline, t as extractEditorText } from "./session-message-cut-content-NrNoi7ep.mjs";
import { t as SqliteJsonlReadBudgetExceededError } from "./sqlite-jsonl-budget-error-CtOAIuWx.mjs";
import { n as projectAssistantDisplayContent } from "./assistant-display-content-mzartsGP.mjs";
import { f as readPersistedMediaFacts } from "./media-facts-BIPREXi-.mjs";
import { n as projectSessionDisplayMessage, t as buildSessionPreviewItems } from "./session-display-projection-DDhSj356.mjs";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-C0-PtdPX.mjs";
import { a as readNestedToolActivity } from "./nested-tool-activity-Da7SpARz.mjs";
import { c as isTranscriptOnlyOpenClawAssistantMessage, l as isTranscriptOnlyOpenClawAssistantModel, o as isOpenClawDeliveryMirrorAssistantMessage, s as isOpenClawMessageToolMirrorAssistantMessage } from "./transcript-only-openclaw-assistant-Dn9Tr_eT.mjs";
import { n as isVisibleTranscriptRecord, r as matchesTranscriptEvent } from "./transcript-visible-record-CmGktXrb.mjs";
import { a as normalizePersistedSteerTargetRunId, i as buildRunUserTurnIdempotencyKey, r as buildPersistedUserTurnMetadata } from "./user-turn-transcript.metadata-CtXLmxDa.mjs";
import { a as createVisibleMessageCursor, i as MAX_VISIBLE_MESSAGE_MAX_MESSAGES, l as parseVisibleMessageCursor, o as encodeVisibleMessageCursor, s as normalizeVisibleDeltaLimits } from "./session-accessor.sqlite-visible-cursor-CwElG0zY.mjs";
import { t as readSessionTranscriptAccountingTail } from "./session-transcript-accounting-policy-C3d--qbA.mjs";
import { n as projectAssistantTranscriptText } from "./transcript-assistant-delivery-read-Bhw3HBCv.mjs";
import { n as projectTranscriptEntryMessage, r as readTranscriptMessageIdempotencyKey } from "./session-transcript-entry-message-Q75Efb-t.mjs";
import { n as resolveHistoryAnchorPageRange, r as resolveTranscriptPageEnd, t as boundHistoryAnchorPageRange } from "./transcript-anchor-page-CKxnXLW4.mjs";
import { n as createTranscriptDisplaySource, t as createTranscriptDisplayPositionFromActivity } from "./transcript-display-position-BHW0T3ai.mjs";
import { t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { a as parseRawTranscriptCursor, i as normalizeRawDeltaLimits, n as createTranscriptRawDeltaCursor, r as encodeRawTranscriptCursor, t as bootstrapRawTranscriptCursor } from "./session-transcript-raw-cursor-fGQxJVDh.mjs";
import { t as readRecentTranscriptConversationText } from "./transcript-recent-text-g7xyo8QS.mjs";
import { t as readSessionActorBoundedHistory } from "./session-actor-bounded-history-BC9AvmFD.mjs";
import { t as createWorkerLedgerInputValidation } from "./worker-ledger-validation-CEPXLaeP.mjs";
import { n as selectVisibleTranscriptEvents } from "./transcript-visible-events-Ct6pwJvk.mjs";
import "./paths-Cc42TKDr.mjs";
import { n as assertCanonicalSessionKeyWrite } from "./session-canonical-key-B7chVWi3.mjs";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import { isDeepStrictEqual, toUSVString } from "node:util";
//#region src/config/sessions/group-display.ts
/**
* Builds a human-readable group/channel title from stored chat metadata.
* Prefers the native channel name (#general) or the chat subject verbatim;
* returns undefined when only opaque route ids are available so callers can
* fall back to the compact token form below.
*/
function buildGroupDisplayTitle(params) {
	const subject = normalizeOptionalString(params.subject);
	const groupChannel = normalizeOptionalString(params.groupChannel);
	const space = normalizeOptionalString(params.space);
	if (groupChannel) {
		const channelLabel = groupChannel.startsWith("#") ? groupChannel : `#${groupChannel}`;
		return space ? `${space} ${channelLabel}` : channelLabel;
	}
	return [subject ?? space, normalizeOptionalString(params.topicName)].filter(Boolean).join(" / ") || void 0;
}
/** Builds a compact display label for group sessions from channel metadata or ids. */
function buildGroupDisplayName(params) {
	const providerKey = normalizeOptionalLowercaseString(params.provider) ?? "group";
	const groupChannel = normalizeOptionalString(params.groupChannel);
	const space = normalizeOptionalString(params.space);
	const subject = buildGroupDisplayTitle({
		subject: params.subject,
		topicName: params.topicName
	});
	const detail = (groupChannel && space ? `${space}${groupChannel.startsWith("#") ? "" : "#"}${groupChannel}` : groupChannel || subject || space || "") || "";
	const fallbackId = normalizeOptionalString(params.id) ?? params.key;
	let token = normalizeHyphenSlug(detail || fallbackId);
	if (!params.groupChannel && token.startsWith("#")) token = token.replace(/^#+/, "");
	if (token && !/^[@#]/.test(token) && !token.startsWith("g-") && !token.includes("#")) token = `g-${token}`;
	return token ? `${providerKey}:${token}` : providerKey;
}
//#endregion
//#region src/config/sessions/session-actor-executor.ts
/** Shared admission, accepted-work drainage, and phase batching for every backend. */
function createSessionActorWithExecutor(params) {
	const target = freezeJsonSnapshot(structuredClone(params.target));
	const accepted = /* @__PURE__ */ new Set();
	let closing = false;
	let release;
	const assertAccepted = () => params.lifetime.assertCurrent();
	const assertReadable = () => {
		params.lifetime.assertAdmission?.();
		params.lifetime.assertReadable();
		if (closing) throw new Error("Session actor is released");
	};
	const assertCurrent = () => {
		assertAccepted();
		if (closing) throw new Error("Session actor is released");
	};
	const executor = params.createExecutor({
		target,
		assertAccepted,
		assertReadable
	});
	const storage = executor.storage;
	const retain = (operation, phase) => {
		if (phase) {
			assertAccepted();
			if (!phase.active) throw new Error("Session actor phase is settled");
		} else {
			params.lifetime.assertAdmission?.();
			assertCurrent();
		}
		const retained = Promise.withResolvers();
		const promise = retained.promise;
		accepted.add(promise);
		phase?.pending.add(promise);
		const settled = () => {
			accepted.delete(promise);
			phase?.pending.delete(promise);
		};
		promise.then(settled, settled);
		try {
			(executor.retain ? executor.retain(operation) : operation()).then(retained.resolve, retained.reject);
		} catch (error) {
			retained.reject(error);
		}
		return promise;
	};
	const command = (name, input, authority, observer, phase) => {
		const captured = structuredClone(input);
		if (phase && captured.phaseId !== phase.id) throw new Error("Session actor command belongs to another phase");
		return retain(async () => {
			const reducers = phase?.reducers.splice(0) ?? [];
			captured.reducers = [...reducers, ...captured.reducers ?? []];
			const outcome = await executor.command(name, captured, authority, observer);
			if (phase && outcome.kind === "unknown") phase.uncertain = true;
			else if (phase && (outcome.kind === "rolled-back" || outcome.kind === "stale-version")) phase.reducers.unshift(...reducers);
			return outcome;
		}, phase);
	};
	const releaseActor = () => {
		if (!release) {
			closing = true;
			release = (async () => {
				while (accepted.size) await Promise.allSettled(accepted);
				await executor.release();
			})();
		}
		return release;
	};
	const bind = (phase) => ({
		target,
		...storage ? { storage: {
			acquire(sessionKey, lifetime) {
				return storage.acquire(sessionKey, lifetime);
			},
			readCurrent(query, authority) {
				return storage.readCurrent(query, authority);
			},
			read(query, authority) {
				const captured = structuredClone(query);
				return retain(() => storage.read(captured, authority), phase);
			},
			mutate(mutation, authority, observer) {
				const captured = structuredClone(mutation);
				return retain(() => storage.mutate(captured, authority, observer), phase);
			}
		} } : {},
		assertCurrent,
		assertReadable,
		snapshot: (authority) => executor.snapshot(authority),
		release: releaseActor,
		read: (authority) => retain(() => executor.read(authority), phase),
		acceptInput: (input, authority, observer) => command("acceptInput", input, authority, observer, phase),
		adoptRun: (input, authority, observer) => command("adoptRun", input, authority, observer, phase),
		appendToolResult: (input, authority, observer) => command("appendToolResult", input, authority, observer, phase),
		appendTranscriptEvent: (input, authority, observer) => command("appendTranscriptEvent", input, authority, observer, phase),
		completeTurn: (input, authority, observer) => command("completeTurn", input, authority, observer, phase),
		deliveryPending: (input, authority, observer) => command("deliveryPending", input, authority, observer, phase),
		deliverySettled: (input, authority, observer) => command("deliverySettled", input, authority, observer, phase),
		patch: (input, authority, observer) => command("patch", input, authority, observer, phase),
		withPhase: (phaseId, authority, operation) => retain(async () => {
			const held = {
				id: phaseId,
				active: true,
				reducers: [],
				pending: /* @__PURE__ */ new Set(),
				uncertain: false
			};
			const actor = bind(held);
			const failures = [];
			let result;
			try {
				result = { value: await operation({
					actor,
					patch(reducers) {
						assertAccepted();
						authority.assertCurrent();
						if (!held.active) throw new Error("Session actor phase is settled");
						held.reducers.push(...structuredClone(reducers));
					}
				}) };
			} catch (error) {
				failures.push(error);
			}
			try {
				while (held.pending.size) await Promise.allSettled(held.pending);
				if (held.uncertain) throw new SqliteWorkerError("Session actor phase has an unknown outcome; reconcile without replay", "outcome-unknown");
				while (held.reducers.length) {
					const settled = await command("patch", {
						commandId: randomUUID(),
						phaseId,
						reducers: []
					}, authority, void 0, held);
					if (settled.kind !== "committed") throw new SqliteWorkerError(settled.error.message, settled.kind === "unknown" ? "outcome-unknown" : "unavailable");
				}
			} catch (error) {
				failures.push(error);
			} finally {
				held.active = false;
			}
			if (failures.length) throw failures.length === 1 ? failures[0] : new AggregateError(failures, "Session actor phase and flush failed");
			return result.value;
		}, phase)
	});
	return bind();
}
//#endregion
//#region src/config/sessions/session-actor-memory-conversation-contract.ts
function createSessionActorMemoryConversations() {
	return {
		catalog: /* @__PURE__ */ new Map(),
		deliveries: /* @__PURE__ */ new Map()
	};
}
function cloneSessionActorMemoryConversations(state) {
	return {
		catalog: new Map(state.catalog),
		deliveries: new Map(state.deliveries)
	};
}
//#endregion
//#region src/config/sessions/session-actor-memory-conversation.ts
function registerIdentities(shared, identities, now) {
	for (const identity of identities) {
		const previous = shared.catalog.get(identity.conversationRef);
		shared.catalog.set(identity.conversationRef, {
			identity: structuredClone(identity),
			firstSeenAt: previous?.firstSeenAt ?? now,
			lastSeenAt: now
		});
	}
}
/** The write records canonical addresses once; later authority reads only these stored rows. */
function syncSessionActorMemoryConversations(state, shared, previousEntry, observedContext, observeConversation = false) {
	const entry = state.hot.entry;
	if (!entry) return;
	if (!observeConversation && observedContext === void 0 && previousEntry?.sessionId === entry.sessionId && previousEntry.lifecycleRevision === entry.lifecycleRevision && isDeepStrictEqual(conversationIdentityFromSessionEntry(entry), conversationIdentityFromSessionEntry(previousEntry))) return;
	const routeContext = observedContext === null ? null : observedContext === void 0 ? void 0 : parseConversationRouteContext(observedContext);
	if (observedContext !== void 0 && observedContext !== null && !routeContext) throw new Error("Invalid conversation route context");
	let identity = conversationIdentityFromSessionEntry(entry, routeContext);
	state.primaryConversationRef = void 0;
	if (!identity) return;
	const previousWindow = previousEntry && previousEntry.sessionId !== entry.sessionId ? state.historicalWindows.get(previousEntry.sessionId) : void 0;
	const windows = [state, ...previousWindow ? [previousWindow] : []];
	if (routeContext === void 0) {
		const candidate = identity;
		const links = [];
		for (const window of windows) for (const link of window.conversationLinks) links.push(link);
		const observed = links.filter(([, link]) => link.role === "primary" || link.role === "participant").toSorted((a, b) => b[1].lastSeenAt - a[1].lastSeenAt).map(([ref]) => shared.catalog.get(ref)?.identity).find((value) => value && value.channel === candidate.channel && value.accountId === candidate.accountId && value.kind === candidate.kind && value.deliveryTarget === candidate.deliveryTarget && value.threadId === candidate.threadId);
		if (observed) identity = {
			...observed,
			label: identity.label ?? observed.label
		};
	}
	const now = entry.updatedAt;
	registerIdentities(shared, [identity], now);
	const role = "primary";
	const previous = state.conversationLinks.get(identity.conversationRef);
	const inherited = previous ?? previousWindow?.conversationLinks.get(identity.conversationRef);
	const route = routeContext === void 0 ? inherited && {
		routeContext: inherited.routeContext,
		routeContextObserved: inherited.routeContextObserved
	} : {
		routeContext: routeContext ?? void 0,
		routeContextObserved: true
	};
	for (const [ref, link] of state.conversationLinks) if (ref !== identity.conversationRef && link.role === "primary") state.conversationLinks.set(ref, {
		...link,
		role: "related",
		lastSeenAt: now
	});
	state.conversationLinks.set(identity.conversationRef, {
		role,
		firstSeenAt: previous?.role === role ? previous.firstSeenAt : now,
		lastSeenAt: now,
		...route
	});
	state.primaryConversationRef = identity.conversationRef;
}
function addressRecord(value) {
	const { identity: { deliveryTarget, metadata: _metadata, ...identity }, firstSeenAt, lastSeenAt } = value;
	return {
		...identity,
		target: deliveryTarget,
		firstSeenAt,
		lastSeenAt
	};
}
/** Match the durable catalogue's current-binding preference without parsing transcript payloads. */
function selectSessionActorMemoryConversations(context, query) {
	const channel = normalizeOptionalLowercaseString(query.channel);
	const ref = query.conversationRef === void 0 ? void 0 : normalizeStoredConversationRef(query.conversationRef);
	const refs = query.conversationRefs === void 0 ? void 0 : new Set(query.conversationRefs.map(normalizeStoredConversationRef));
	const records = [];
	for (const [conversationRef, address] of context.conversations.catalog) {
		if (channel && address.identity.channel !== channel || ref && conversationRef !== ref || refs && !refs.has(conversationRef)) continue;
		let associated = false;
		for (const [sessionKey, state] of context.entries()) {
			const entry = state.hot.entry;
			const windows = [state, ...state.historicalWindows.values()];
			for (const window of windows) {
				const link = window.conversationLinks.get(conversationRef);
				if (!link) continue;
				associated = true;
				const associationIsCurrent = Boolean(entry && window.hot.entry?.sessionId === entry.sessionId);
				if (query.currentSession && (sessionKey !== query.currentSession.sessionKey || window.hot.entry?.sessionId !== query.currentSession.sessionId)) continue;
				if (query.primarySession && (!associationIsCurrent || sessionKey !== query.primarySession.sessionKey || entry?.sessionId !== query.primarySession.sessionId || link.role !== "primary" || window.primaryConversationRef !== conversationRef)) continue;
				if (query.currentBindingOnly && (!associationIsCurrent || link.role !== "participant" && (link.role !== "primary" || window.primaryConversationRef !== conversationRef))) continue;
				records.push({
					associationIsCurrent,
					updatedAt: entry?.updatedAt ?? 0,
					record: {
						...addressRecord(address),
						firstSeenAt: link.firstSeenAt,
						lastSeenAt: link.lastSeenAt,
						...entry ? {
							sessionId: entry.sessionId,
							sessionKey,
							role: link.role
						} : {},
						observedFromSession: true,
						...link.routeContextObserved ? { routeContextObserved: true } : {},
						...link.routeContext ? { routeContext: link.routeContext } : {}
					}
				});
			}
		}
		if (!associated && !query.primarySession && !query.currentSession && !query.currentBindingOnly) records.push({
			associationIsCurrent: false,
			updatedAt: 0,
			record: addressRecord(address)
		});
	}
	records.sort((a, b) => b.record.lastSeenAt - a.record.lastSeenAt || b.updatedAt - a.updatedAt);
	const selected = selectUniqueConversationRows(records, {
		conversationRef: (row) => row.record.conversationRef,
		map: (row) => row,
		limit: query.limit
	});
	for (const record of selected) if (record.sessionKey) context.get(record.sessionKey);
	return selected;
}
function readSessionActorMemoryConversation(context, query) {
	if (query.type === "session.conversation.read") return selectSessionActorMemoryConversations(context, query.input);
	const operation = "operationId" in query.input ? context.conversations.deliveries.get(query.input.operationId.trim()) : void 0;
	const ref = "conversationRef" in query.input ? query.input.conversationRef : operation?.conversationRef;
	return {
		operation: operation && { conversationRef: operation.conversationRef },
		conversation: ref ? selectSessionActorMemoryConversations(context, {
			conversationRef: ref,
			limit: 1
		})[0] : void 0
	};
}
function writeSessionActorMemoryConversation(context, command) {
	const selected = {
		kind: "session.conversation.registration",
		identities: command.input.identities,
		eligible: command.input.identities.map(() => true)
	};
	context.admit("commit", selected);
	if (selected.eligible.length !== selected.identities.length) throw new Error("Conversation route owner returned an incomplete eligibility selection");
	const identities = selected.identities.filter((_, index) => selected.eligible[index]);
	if (!identities.length) return;
	registerIdentities(context.editConversations(), identities, command.input.discoveredAt);
	return command.input.query ? selectSessionActorMemoryConversations(context, command.input.query) : void 0;
}
//#endregion
//#region src/config/sessions/session-actor-memory-conversation-delivery.ts
function readSessionActorMemoryConversationDelivery(context, lookup) {
	if ("operationId" in lookup) {
		const record = context.conversations.deliveries.get(normalizeConversationDeliveryOperationId(lookup.operationId));
		if (record && lookup.expectedInput) assertConversationDeliveryInput(record, lookup.expectedInput);
		return record;
	}
	let latest;
	for (const record of context.conversations.deliveries.values()) if (record.conversationRef === lookup.conversationRef && record.operationKind === "turn" && (record.platformMessageId === lookup.replyToId || record.preparedMessageId === lookup.replyToId) && (record.status === "queued" || record.status === "sent" || record.status === "replied") && (!latest || record.updatedAt > latest.updatedAt)) latest = record;
	return latest;
}
function beginSessionActorMemoryConversationDelivery(context, params) {
	const conversation = selectSessionActorMemoryConversations(context, {
		conversationRef: params.conversationRef,
		limit: 1
	})[0];
	if (params.authority) assertConversationAuthority(conversation, params.authority);
	const operationId = normalizeConversationDeliveryOperationId(params.operationId);
	const existing = context.conversations.deliveries.get(operationId);
	if (existing) {
		assertConversationDeliveryInput(existing, params);
		return {
			created: false,
			record: existing
		};
	}
	if (!conversation) throw new ConversationDeliveryMissingError(`Conversation delivery destination not found: ${params.conversationRef}`);
	const sourceSessionKey = params.sourceSessionKey?.trim() || void 0;
	const now = Date.now();
	const record = {
		operationId,
		operationKind: params.operationKind,
		conversationRef: params.conversationRef,
		channel: conversation.channel,
		...sourceSessionKey ? { sourceSessionKey } : {},
		messageHash: sha256Hex(params.message),
		status: "created",
		...params.preparedMessageId ? { preparedMessageId: params.preparedMessageId } : {},
		createdAt: now,
		updatedAt: now
	};
	context.editConversations().deliveries.set(operationId, record);
	return {
		created: true,
		record
	};
}
function transitionSessionActorMemoryConversationDelivery(context, params) {
	if (params.session) {
		const { sessionKey, sessionId, lifecycleRevision } = params.session;
		const entry = context.get(sessionKey)?.hot.entry;
		if (entry?.sessionId !== sessionId || entry.lifecycleRevision !== lifecycleRevision) throw new Error(`session changed before captured reply persistence: ${sessionKey}`);
	}
	const operationId = normalizeConversationDeliveryOperationId(params.operationId);
	const current = context.conversations.deliveries.get(operationId);
	if (!current) throw new ConversationDeliveryMissingError(`Conversation delivery operation not found: ${operationId}`);
	if (!params.allowedFrom.includes(current.status)) return current;
	const record = {
		...current,
		status: params.status,
		updatedAt: Date.now()
	};
	for (const field of [
		"queueId",
		"platformMessageId",
		"rejectionError"
	]) {
		const value = params[field];
		if (value !== void 0) {
			if (value) record[field] = value;
			else delete record[field];
		}
	}
	if (params.reply) {
		if (params.reply.messageId) record.reply = {
			messageId: params.reply.messageId,
			...params.reply.replyToId ? { replyToId: params.reply.replyToId } : {},
			...params.reply.threadId ? { threadId: params.reply.threadId } : {},
			text: params.reply.text,
			timestamp: params.reply.timestamp
		};
		else delete record.reply;
	}
	context.editConversations().deliveries.set(operationId, record);
	return record;
}
//#endregion
//#region src/config/sessions/session-actor-memory-conversation-owner.ts
/** The agent actor's catalogue outlives individual sessions, so it needs no synthetic session handle. */
function createSessionActorMemoryConversationOwner(options) {
	const transaction = (authority, selectEligible) => {
		options.assertCurrent();
		let changed;
		const authorized = /* @__PURE__ */ new Set();
		return {
			context: {
				get conversations() {
					return changed ?? options.conversations();
				},
				editConversations() {
					return changed ??= cloneSessionActorMemoryConversations(options.conversations());
				},
				entries: () => options.entries(),
				get(key) {
					const state = options.get(key);
					if (state && !authorized.has(key)) {
						authority.authorize("commit", structuredClone(state.hot));
						authorized.add(key);
					}
					return state;
				},
				admit(_stage, publication) {
					if (selectEligible && isRecord(publication) && publication.kind === "session.conversation.registration") {
						const registration = publication;
						registration.eligible = selectEligible(structuredClone(registration.identities));
					}
				}
			},
			commit() {
				if (changed) options.installConversations(changed);
			}
		};
	};
	function readConversation(query, authority) {
		const { context } = transaction(authority);
		const command = query;
		const value = command.type === "session.conversation.delivery.read" ? readSessionActorMemoryConversationDelivery(context, command.input) : readSessionActorMemoryConversation(context, command);
		authority.assertCurrent();
		return structuredClone(value);
	}
	return {
		readConversation,
		readConversationAfterWrites(query, authority) {
			const captured = structuredClone(query);
			return options.enqueue(() => readConversation(captured, authority));
		},
		mutateConversation(command, authority, selectEligible) {
			const captured = structuredClone(command);
			return options.enqueue(() => {
				const pending = transaction(authority, selectEligible);
				const { context } = pending;
				const value = captured.type === "session.conversation.delivery.begin" ? beginSessionActorMemoryConversationDelivery(context, captured.input) : captured.type === "session.conversation.delivery.transition" ? transitionSessionActorMemoryConversationDelivery(context, captured.input) : writeSessionActorMemoryConversation(context, captured);
				options.assertCurrent();
				authority.assertCurrent();
				const detached = structuredClone(value);
				pending.commit();
				return detached;
			});
		}
	};
}
//#endregion
//#region src/config/sessions/session-actor-memory-pending.ts
/** The memory owner lends its working state and installs it only after the phase commits. */
function createSessionActorMemoryPending(state, options) {
	const owns = (input) => input.sessionKey === state.hot.target.sessionKey && state.hot.entry?.sessionId === input.sessionId;
	const pending = (input) => {
		const row = state.pendingInputs.get(input.idempotencyKey);
		return row?.session_key === input.sessionKey && row.session_id === input.sessionId ? row : void 0;
	};
	const completion = (input) => {
		const row = state.completions.get(input.idempotencyKey);
		return row?.session_key === input.sessionKey && row.session_id === input.sessionId ? row : void 0;
	};
	const committed = (input, checkEventBytes) => {
		const identity = state.hot.transcript.idempotency.findLast(({ key }) => key === input.idempotencyKey);
		const row = identity && state.events.find(({ rawSeq }) => rawSeq === identity.rawSeq);
		const message = asOptionalRecord(row?.event)?.message;
		if (!identity || message === void 0) return;
		const messageJson = JSON.stringify(message);
		if (messageJson === void 0) return;
		const readJson = checkEventBytes ? row?.eventJson : messageJson;
		if (readJson && Buffer.byteLength(readJson, "utf8") > 26214400) throw new Error(`${checkEventBytes ? "Submitted" : "Pending"} input exceeds the Gateway payload limit`);
		return {
			messageId: identity.eventId,
			message: parseSessionPendingInputMessage(messageJson)
		};
	};
	const readStage = (input) => {
		if (!owns(input)) return {
			kind: "stage",
			current: false
		};
		const existing = pending(input);
		const previous = input.trackCompletion ? completion(input) : void 0;
		if (existing && Buffer.byteLength(existing.message_json, "utf8") > 26214400) throw new Error("Pending input exceeds the Gateway payload limit");
		return structuredClone({
			kind: "stage",
			current: true,
			existing,
			previous,
			committed: existing?.consumed_event_id != null || previous && isFinalInputCompletion(previous.outcome) ? void 0 : committed(input, false)
		});
	};
	const authority = (agentId = options.agentId) => {
		const database = state.hot.target.database;
		return {
			agentId,
			storePath: options.path,
			sessionKey: toAgentStoreSessionKey({
				agentId,
				requestKey: state.hot.target.sessionKey
			}),
			entry: state.hot.entry ? structuredClone(attachSessionEntrySnapshots({ ...state.hot.entry }, {}, "list")) : void 0,
			readSource: {
				agentId: options.agentId,
				path: options.path,
				databaseIdentity: database.kind === "file" ? database.physicalIdentity : database.incarnation,
				...database.kind === "file" ? { databaseBirthtime: database.birthtime } : {}
			},
			members: structuredClone(state.hot.members)
		};
	};
	return {
		authority,
		read(input) {
			if (input.kind === "stage") return readStage(input);
			const snapshot = {
				kind: "source",
				current: owns(input)
			};
			if (!snapshot.current) return snapshot;
			const row = pending(input);
			if (row) {
				if (Buffer.byteLength(row.message_json, "utf8") > 26214400) throw new Error("Submitted input exceeds the Gateway payload limit");
				snapshot.pending = structuredClone(row);
			} else if (!input.pendingOnly) snapshot.committed = committed(input, true)?.message;
			return snapshot;
		},
		history(query) {
			const rows = [...state.pendingInputs.values()].filter((row) => row.session_key === query.sessionKey && row.session_id === query.sessionId && row.consumed_event_id === null);
			const total = query.id === void 0 ? rows.length : void 0;
			if (total === 0) return {
				rows: [],
				total
			};
			const limit = resolvePendingInputHistoryLimit(query.limit);
			const page = rows.filter((row) => (query.before === void 0 || row.seq < query.before) && (query.id === void 0 || row.input_id === query.id)).toSorted((left, right) => right.seq - left.seq).slice(0, limit + 1);
			const { selected, nextBefore } = selectPendingInputHistoryPage(page.map((row) => ({
				seq: row.seq,
				serialized_bytes: Buffer.byteLength(row.message_json, "utf8")
			})), limit);
			return {
				rows: structuredClone(page.slice(0, selected.length)),
				total,
				currentSessionId: page.length && query.sessionKey === state.hot.target.sessionKey ? state.hot.entry?.sessionId : void 0,
				nextBefore
			};
		},
		receipts(input) {
			const runIds = new Set(normalizePendingInputReceiptRunIds(input.runIds));
			const rows = [...state.pendingInputs.values()].filter((row) => row.session_key === input.sessionKey && row.session_id === input.sessionId && runIds.has(row.run_id)).toSorted((left, right) => left.seq - right.seq).slice(0, 51);
			return projectPendingInputReceipts(rows);
		},
		interruptHistory(input, custody) {
			if (input.ids.length > 20) throw new Error("Pending input reconciliation exceeds its page bound");
			const selected = [...state.pendingInputs.values()].filter((row) => row.session_key === input.sessionKey && row.session_id === input.sessionId && input.ids.includes(row.input_id) && row.state === "queued" && row.consumed_event_id === null);
			const candidates = selected.map((row) => ({
				input_id: row.input_id,
				session_key: row.session_key,
				session_id: row.session_id,
				lifecycle_generation: row.lifecycle_generation
			}));
			const currentSessionId = selected.length && input.sessionKey === state.hot.target.sessionKey ? state.hot.entry?.sessionId : void 0;
			custody.admit("transaction", {
				kind: "pending-input-history-custody",
				candidates,
				currentSessionId
			});
			const interrupted = candidates.filter((candidate) => !custody.isProtected(candidate, currentSessionId));
			const ids = interrupted.map((candidate) => candidate.input_id);
			for (const row of selected) if (ids.includes(row.input_id)) state.pendingInputs.set(row.idempotency_key, {
				...row,
				state: "interrupted"
			});
			state.hot.pendingInputs = [...state.pendingInputs.values()].map(({ message_json: _message, ...value }) => value);
			custody.admit("commit", {
				kind: "pending-input-history-custody",
				candidates: interrupted,
				currentSessionId
			});
			return {
				kind: "pending-input-history-interrupted",
				ids
			};
		},
		mutate(input) {
			if (input.sessionKey !== state.hot.target.sessionKey || input.kind !== "finish" && !owns(input)) throw new SessionPendingInputCustodyError("Pending input no longer owns the admitted session");
			const row = pending(input);
			if (input.kind === "stage") {
				if (row?.input_id !== input.expected.existing?.input_id) throw new SessionPendingInputCustodyError("Pending input changed before staging committed");
			} else if (row && (row.run_id !== input.runId || row.request_hash !== input.requestHash || row.lifecycle_generation !== input.lifecycleGeneration || input.kind === "finish" && row.input_id !== input.inputId)) throw new SessionPendingInputCustodyError("Pending input settlement lost its accepted owner");
			const receipt = {
				kind: "pending-input-settlement",
				operation: input.kind,
				sessionKey: input.sessionKey,
				sessionId: input.sessionId,
				idempotencyKey: input.idempotencyKey,
				runId: input.runId,
				requestHash: input.requestHash,
				lifecycleGeneration: input.lifecycleGeneration
			};
			const grant = {
				kind: "pending-input-settlement-custody",
				candidate: row && structuredClone(row),
				receipt,
				...input.kind !== "finish" && input.authorityAgentId ? { authority: authority(input.authorityAgentId) } : {}
			};
			options.admit("transaction", grant);
			if (input.kind === "stage") {
				const staged = row ? {
					...row,
					state: "queued",
					lifecycle_generation: input.lifecycleGeneration
				} : {
					seq: [...state.pendingInputs.values()].reduce((max, value) => Math.max(max, value.seq), 0) + 1,
					input_id: input.inputId,
					session_key: input.sessionKey,
					session_id: input.sessionId,
					idempotency_key: input.idempotencyKey,
					run_id: input.runId,
					request_hash: input.requestHash,
					message_json: input.messageJson,
					lifecycle_generation: input.lifecycleGeneration,
					state: "queued",
					accepted_at: Date.now(),
					consumed_event_id: null
				};
				state.pendingInputs.set(input.idempotencyKey, staged);
				receipt.stagedInput = structuredClone(staged);
			} else if (input.kind === "complete") {
				const retained = completion(input);
				if (retained && (retained.run_id !== input.runId || retained.request_hash !== input.requestHash)) throw new SessionPendingInputCustodyError("Input completion conflicts with the accepted input");
				if (retained && isFinalInputCompletion(retained.outcome)) receipt.outcome = structuredClone(retained.outcome);
				else {
					const outcome = structuredClone(input.outcome);
					const next = {
						session_key: input.sessionKey,
						session_id: input.sessionId,
						idempotency_key: input.idempotencyKey,
						run_id: input.runId,
						request_hash: input.requestHash,
						outcome_json: JSON.stringify(outcome),
						outcome,
						succeeded: classifyAgentRunTerminalOutcome(outcome) === "success" ? 1 : 0,
						completed_at: Date.now()
					};
					if (!retained || retained.succeeded === 0) state.completions.set(input.idempotencyKey, next);
					if (isFinalInputCompletion(outcome) && row) state.pendingInputs.delete(input.idempotencyKey);
					receipt.outcome = structuredClone(outcome);
				}
			} else if (row?.state === "queued" && row.consumed_event_id === null) {
				state.pendingInputs.set(input.idempotencyKey, {
					...row,
					state: input.disposition
				});
				if (input.disposition === "cancelled") receipt.withdrawnInputId = input.inputId;
			}
			state.hot.pendingInputs = [...state.pendingInputs.values()].map(({ message_json: _message, ...value }) => value);
			state.hot.completionKeys = [...state.completions.keys()];
			options.admit("commit", grant);
			return receipt;
		}
	};
}
//#endregion
//#region src/config/sessions/session-actor-memory-publication.ts
/** The owner installs all state before publishing its complete committed facts. */
function publishSessionActorMemoryChanges(owner, changes) {
	for (const { sessionKey, before, after } of changes) {
		const entry = after?.entry;
		const change = {
			agentId: owner.agentId,
			storePath: owner.path,
			sessionKey,
			facts: entry && after ? {
				kind: "replacement",
				communicationBinding: communicationEntryBinding(entry),
				membership: [
					sessionKey,
					entry.category ?? null,
					after.members.map(({ identityId }) => identityId),
					{
						participants: entry.participants,
						participantCount: entry.participantCount
					},
					entry.sessionId
				],
				lifecycleChanged: before?.entry?.sessionId !== entry.sessionId || before?.entry?.lifecycleRevision !== entry.lifecycleRevision
			} : { kind: "removed" }
		};
		bindPreparedSessionEntryPublication(change, {
			kind: "source",
			databaseIdentity: owner.incarnation,
			canonicalPath: owner.path
		});
		sessionChanges.emit(change);
	}
	publishCommittedSessionIdentity(owner.agentId, owner.incarnation, new Map(changes.flatMap(({ sessionKey, before }) => before?.entry ? [[sessionKey, before.entry]] : [])), new Map(changes.flatMap(({ sessionKey, after }) => after?.entry ? [[sessionKey, after.entry]] : [])));
}
//#endregion
//#region src/config/sessions/session-harness-completion-input.ts
/** Consume the exact source input first, then subsequent active-path user inputs in order. */
function createHarnessCompletionInputPredicate(params) {
	const priorRunIds = (params.entry.restartRecoveryRuns ?? []).filter((run) => Boolean(run.lifecycleGeneration)).map((run) => run.runId);
	const claim = params.claim;
	const allowedRunIds = new Set([params.operationalRunId, ...priorRunIds].filter(Boolean));
	let sourceChecked = false;
	return (message) => {
		const record = asOptionalRecord(message);
		const provenance = normalizeInputProvenance(record?.provenance);
		const annotatedRunId = asOptionalRecord(record?.["__openclaw"])?.runId;
		if (!sourceChecked) {
			sourceChecked = true;
			return record?.role === "user" && record.idempotencyKey === `${claim.sourceRunId}:user` && annotatedRunId === claim.sourceRunId && provenance?.kind === "inter_session" && provenance.sourceChannel === "internal" && ["agent_harness_task", "agent_harness_completion"].includes(provenance.sourceTool ?? "") && provenance.sourceSessionKey === claim.taskRunId;
		}
		if (record?.role !== "user") return true;
		const runId = typeof record.idempotencyKey === "string" ? [...allowedRunIds].find((id) => record.idempotencyKey === `${id}:user`) : annotatedRunId;
		return typeof runId === "string" && allowedRunIds.has(runId) && (annotatedRunId == null || annotatedRunId === runId) && provenance?.kind === "internal_system" && provenance.sourceTool === "main_session_restart_recovery" && provenance.sourceSessionKey === claim.requesterSessionKey;
	};
}
//#endregion
//#region src/config/sessions/session-actor-memory-recovery.ts
/** Recovery consumes active history, including inputs omitted from model context. */
function validateSessionActorMemoryRecoveryInput(state, claim) {
	const entry = state.hot.entry;
	if (!entry || entry.restartRecoveryDeliveryRunId === claim.sourceRunId) return true;
	const source = state.hot.transcript.idempotency.find(({ key }) => key === `${claim.sourceRunId}:user`);
	if (!source) return false;
	const tree = scanSessionTranscriptTree(state.events.map((row) => row.event));
	if (tree.hasInvalidLeafControl) return false;
	const active = selectSessionTranscriptTreePathNodes(tree, tree.leafId);
	const start = active.findIndex((node) => state.events[node.index]?.rawSeq === source.rawSeq);
	const reset = active.findLastIndex((node) => asOptionalRecord(node.entry)?.type === "reset");
	if (start < 0 || start <= reset) return false;
	const accepts = createHarnessCompletionInputPredicate({
		claim,
		entry,
		operationalRunId: entry.restartRecoveryDeliveryRunId
	});
	let seen = false;
	for (const node of active.slice(start)) {
		const message = asOptionalRecord(asOptionalRecord(node.entry)?.message);
		if (message?.role !== "user") continue;
		seen = true;
		if (!accepts(message)) return false;
	}
	return seen;
}
//#endregion
//#region src/config/sessions/session-actor-memory-sources.ts
function validateSessionActorMemorySources(get, incarnation, sources, readConversations) {
	const result = { conversationMatches: [] };
	for (const [index, source] of (sources ?? []).entries()) {
		const other = get(source.sessionKey);
		const entry = other?.hot.entry;
		const members = source.members && other?.hot.members.map((member) => member.identityId);
		if (source.source.databaseIdentity !== incarnation || Boolean(entry) !== Boolean(source.expected) || source.fields.some((field) => !isDeepStrictEqual(entry?.[field], source.expected?.[field])) || source.members && !isDeepStrictEqual(members, source.members) || source.transcript && (source.transcript.sessionId !== entry?.sessionId || !isDeepStrictEqual(source.transcript.version, other?.hot.transcript.version))) return {
			...result,
			refusedSource: {
				index,
				facts: {
					entry,
					members
				}
			}
		};
		if (source.conversationAlternatives?.length) {
			const rows = readConversations({
				conversationRefs: [...new Set(source.conversationAlternatives.flatMap((alternative) => alternative.map((predicate) => predicate.conversationRef)))],
				currentBindingOnly: true
			});
			const bindings = new Map(rows.map((row) => [row.conversationRef, row.sessionKey ?? null]));
			const alternatives = source.conversationAlternatives.flatMap((alternative, alternativeIndex) => alternative.every((predicate) => (bindings.get(predicate.conversationRef) ?? null) === predicate.sessionKey) ? [alternativeIndex] : []);
			if (!alternatives.length) return {
				...result,
				refusedSource: {
					index,
					facts: {
						entry,
						members
					}
				}
			};
			result.conversationMatches.push({
				index,
				alternatives
			});
		}
	}
	return result;
}
//#endregion
//#region src/config/sessions/session-actor-memory-collaboration-state.ts
function createSessionActorMemoryCollaborationState() {
	return {
		suggestions: /* @__PURE__ */ new Map(),
		reactions: []
	};
}
function cloneSessionActorMemoryCollaborationState(state) {
	return {
		suggestions: new Map(state.suggestions),
		reactions: [...state.reactions]
	};
}
//#endregion
//#region src/config/sessions/session-actor-memory-side-effects-contract.ts
function createSessionActorMemorySideEffects() {
	return {
		outbox: /* @__PURE__ */ new Map(),
		messageToolOutcomes: [],
		trajectory: /* @__PURE__ */ new Map()
	};
}
/** Rows are immutable; commands replace them instead of mutating shared preimages. */
function cloneSessionActorMemorySideEffects(state) {
	return {
		outbox: new Map(state.outbox),
		heartbeatOutcome: state.heartbeatOutcome,
		messageToolOutcomes: [...state.messageToolOutcomes],
		trajectory: new Map(state.trajectory)
	};
}
//#endregion
//#region src/config/sessions/session-actor-memory-state.ts
function advanceSessionActorMemoryState(state) {
	state.hot.version = {
		...state.hot.version,
		sequence: state.hot.version.sequence + 1
	};
	state.hot.writeToken = String(state.hot.version.sequence);
	state.hot.dependencySessionIds = [...state.hot.entry ? [state.hot.entry.sessionId] : [], ...state.historicalWindows.keys()];
	state.hot.hasBoard = Boolean(state.board?.snapshot.tabs.length);
	state.hot.pendingInputs = [...state.pendingInputs.values()].map(({ message_json: _message, ...row }) => row);
	state.hot.completionKeys = [...state.completions.keys()];
}
function emptySessionActorMemoryTranscript() {
	return {
		watermark: {
			generation: null,
			maxSeq: null
		},
		version: {
			generation: null,
			rawSeq: null,
			updatedAt: null
		},
		anchorsState: "resident",
		anchors: [],
		idempotency: [],
		modelContext: {
			kind: "resident",
			entries: []
		}
	};
}
/** Callers read this borrowed window; the actor detaches the selected result. */
function resolveSessionActorMemoryWindow(state, sessionId) {
	return sessionId === void 0 || sessionId === state.hot.entry?.sessionId ? state : state.historicalWindows.get(sessionId) ?? (state.hot.entry ? void 0 : state);
}
/** Copy current metadata and row collections, retaining immutable historical windows. */
function cloneSessionActorMemoryState(state) {
	return {
		hot: structuredClone(state.hot),
		collaboration: cloneSessionActorMemoryCollaborationState(state.collaboration),
		...cloneSessionActorMemorySideEffects(state),
		board: state.board,
		progressCard: state.progressCard,
		usageRollup: state.usageRollup,
		sourceCreatedAt: state.sourceCreatedAt,
		conversationLinks: new Map(state.conversationLinks),
		primaryConversationRef: state.primaryConversationRef,
		workerTranscriptCommits: new Map(state.workerTranscriptCommits),
		events: [...state.events],
		pendingInputs: new Map(state.pendingInputs),
		completions: new Map(state.completions),
		goalReceipts: new Map(state.goalReceipts),
		historicalWindows: new Map(state.historicalWindows)
	};
}
/** Rotate within the same logical owner, preserving old transcript and custody rows. */
function selectSessionActorMemoryWindow(state, nextEntry) {
	const previousId = state.hot.entry?.sessionId;
	if (previousId === nextEntry.sessionId) {
		state.hot.entry = structuredClone(nextEntry);
		return;
	}
	if (previousId) state.historicalWindows.set(previousId, {
		hot: state.hot,
		usageRollup: state.usageRollup,
		sourceCreatedAt: state.sourceCreatedAt,
		conversationLinks: state.conversationLinks,
		primaryConversationRef: state.primaryConversationRef,
		workerTranscriptCommits: state.workerTranscriptCommits,
		events: state.events,
		pendingInputs: state.pendingInputs,
		completions: state.completions,
		goalReceipts: state.goalReceipts
	});
	const selected = state.historicalWindows.get(nextEntry.sessionId);
	state.historicalWindows.delete(nextEntry.sessionId);
	state.hot = {
		...state.hot,
		entry: structuredClone(nextEntry),
		transcript: selected ? structuredClone(selected.hot.transcript) : emptySessionActorMemoryTranscript(),
		pendingInputs: selected ? structuredClone(selected.hot.pendingInputs) : [],
		completionKeys: selected ? [...selected.hot.completionKeys] : []
	};
	state.usageRollup = selected?.usageRollup;
	state.sourceCreatedAt = selected?.sourceCreatedAt;
	state.conversationLinks = new Map(selected?.conversationLinks);
	state.primaryConversationRef = selected?.primaryConversationRef;
	state.workerTranscriptCommits = new Map(selected?.workerTranscriptCommits);
	state.events = selected ? [...selected.events] : [];
	state.pendingInputs = new Map(selected?.pendingInputs);
	state.completions = new Map(selected?.completions);
	state.goalReceipts = new Map(selected?.goalReceipts);
}
function createSessionActorMemoryState(target) {
	return {
		collaboration: createSessionActorMemoryCollaborationState(),
		...createSessionActorMemorySideEffects(),
		hot: {
			target,
			version: {
				epoch: randomUUID(),
				sequence: 0
			},
			writeToken: "0",
			dependencySessionIds: [],
			entry: void 0,
			hasBoard: false,
			participants: [],
			members: [],
			pendingInputs: [],
			completionKeys: [],
			transcript: emptySessionActorMemoryTranscript()
		},
		events: [],
		conversationLinks: /* @__PURE__ */ new Map(),
		workerTranscriptCommits: /* @__PURE__ */ new Map(),
		pendingInputs: /* @__PURE__ */ new Map(),
		completions: /* @__PURE__ */ new Map(),
		goalReceipts: /* @__PURE__ */ new Map(),
		historicalWindows: /* @__PURE__ */ new Map()
	};
}
//#endregion
//#region src/boards/session-actor-board-memory.ts
function emptyBoard(sessionKey) {
	return {
		sessionKey,
		revision: 0,
		tabs: [],
		widgets: []
	};
}
function htmlMetadata(widget, sha256) {
	return {
		revision: widget.revision,
		sha256,
		viewGeneration: widget.instanceId,
		grantState: widget.grantState,
		...widget.declared ? { declared: widget.declared } : {}
	};
}
function document(board, name) {
	const widget = board?.snapshot.widgets.find((candidate) => candidate.name === name);
	const stored = board?.content.get(name);
	if (!widget || !stored) return;
	switch (stored.content.kind) {
		case "html": return {
			...htmlMetadata(widget, stored.sha256),
			html: stored.content.html
		};
		case "registered": return {
			...htmlMetadata(widget, stored.sha256),
			source: stored.content.source,
			pluginKind: stored.content.pluginKind,
			...widget.title !== void 0 ? { title: widget.title } : {}
		};
		case "mcp-app": return {
			descriptor: stored.content.descriptor,
			revision: widget.revision,
			instanceId: widget.instanceId,
			grantState: widget.grantState,
			declaredTools: widget.declared?.tools ?? [],
			interactive: stored.content.interactive
		};
	}
}
function readSessionActorBoardQuery(context, query) {
	const state = context.get(query.input.sessionKey);
	const board = state?.hot.entry ? state.board : void 0;
	if (query.type === "boards.document") {
		const value = document(board, query.input.name);
		return query.input.contentKind && value && !("descriptor" in value) ? void 0 : value;
	}
	const htmlViewMetadata = /* @__PURE__ */ new Map();
	for (const widget of board?.snapshot.widgets ?? []) {
		const content = board.content.get(widget.name);
		if (content?.sha256) htmlViewMetadata.set(widget.name, htmlMetadata(widget, content.sha256));
	}
	return {
		snapshot: board?.snapshot ?? emptyBoard(query.input.sessionKey),
		htmlViewMetadata
	};
}
function executeSessionActorBoardCommand(context, command) {
	const { sessionKey } = command.input;
	if (!context.get(sessionKey)?.hot.entry) throw new BoardValidationError("not_found", `board session not found: ${sessionKey}`);
	const state = context.edit(sessionKey);
	const previous = state.board;
	const snapshot = previous?.snapshot ?? emptyBoard(sessionKey);
	switch (command.type) {
		case "boards.applyOps": {
			if (!command.input.ops.length) return snapshot;
			const next = {
				sessionKey,
				revision: snapshot.revision + 1,
				...applyBoardOps(snapshot, command.input.ops)
			};
			const names = new Set(next.widgets.map((widget) => widget.name));
			state.board = next.tabs.length ? {
				snapshot: next,
				content: new Map([...previous?.content ?? []].filter(([name]) => names.has(name)))
			} : void 0;
			return next;
		}
		case "boards.putWidget": {
			const params = resolveBoardWidgetPutParams(snapshot, normalizeBoardWidgetPutParams(command.input.params, sessionKey), new Map([...previous?.content ?? []].map(([name, stored]) => [name, stored.nameIdentity])));
			const prior = previous?.content.get(params.name);
			const grantScopeMatches = !prior || prior.content.kind === params.content.kind && (prior.content.kind !== "mcp-app" || params.content.kind === "mcp-app" && prior.content.descriptor.serverName === params.content.descriptor.serverName);
			const next = createBoardWidgetPutSnapshot(snapshot, params, {
				grantScopeMatches,
				grantedSha256: prior?.sha256,
				instanceId: command.input.viewGeneration
			});
			const content = new Map(previous?.content);
			const body = params.content.kind === "html" ? params.content.html : params.content.kind === "registered" ? params.content.source : void 0;
			content.set(params.name, {
				content: structuredClone(params.content),
				nameIdentity: params.generatedIdentity ? {
					kind: "generated",
					source: params.generatedIdentity.source,
					key: params.generatedIdentity.key
				} : { kind: "explicit" },
				...body !== void 0 ? { sha256: createHash("sha256").update(body).digest("hex") } : {}
			});
			state.board = {
				snapshot: next,
				content
			};
			return createBoardWidgetPutResult(next, params.name);
		}
	}
	const { name, decision, revision, instanceId } = command.input;
	const next = createBoardGrantSnapshot(snapshot, name, decision, revision, instanceId);
	state.board = {
		snapshot: next,
		content: new Map(previous?.content)
	};
	return next;
}
//#endregion
//#region src/session-cards/session-actor-progress-card-memory.ts
function presentCard(sessionKey, card) {
	return card && (card.markdown || card.steps?.length) ? {
		sessionKey,
		...card
	} : null;
}
function readSessionActorProgressCard(context, sessionKey) {
	return presentCard(sessionKey, context.get(sessionKey)?.progressCard);
}
function clearSessionActorProgressCardForReset(state) {
	if (!state.progressCard) return false;
	state.progressCard = {
		revision: state.progressCard.revision + 1,
		updatedAt: Date.now()
	};
	return true;
}
function executeSessionActorProgressCardCommand(context, command) {
	const { sessionKey } = command.input;
	if (!context.get(sessionKey)?.hot.entry) throw new Error(`progress-card session not found: ${sessionKey}`);
	const state = context.edit(sessionKey);
	if (command.type === "progressCard.clearForReset") return clearSessionActorProgressCardForReset(state);
	const input = normalizeProgressCardWrite(command.input);
	const current = state.progressCard;
	if (!input.markdown && !input.steps) {
		if (input.expectedRevision !== void 0 && (current?.revision !== input.expectedRevision || !presentCard(sessionKey, current))) return { card: presentCard(sessionKey, current) };
		clearSessionActorProgressCardForReset(state);
		return { cleared: true };
	}
	state.progressCard = {
		revision: (current?.revision ?? 0) + 1,
		updatedAt: Date.now(),
		...input.markdown ? { markdown: input.markdown } : {},
		...input.steps ? { steps: structuredClone(input.steps) } : {}
	};
	return { card: presentCard(sessionKey, state.progressCard) };
}
//#endregion
//#region src/config/sessions/session-actor-memory-reactions.ts
function compareRows(left, right) {
	return left.createdAt - right.createdAt || Buffer.compare(Buffer.from(left.emoji), Buffer.from(right.emoji)) || Buffer.compare(Buffer.from(left.identityId), Buffer.from(right.identityId));
}
function summarize(rows) {
	const summaries = /* @__PURE__ */ new Map();
	for (const row of rows) {
		let summary = summaries.get(row.emoji);
		if (!summary) {
			summary = {
				emoji: row.emoji,
				count: 0,
				identities: []
			};
			summaries.set(row.emoji, summary);
		}
		summary.count++;
		summary.identities.push({
			id: row.identityId,
			...row.identityLabel ? { label: row.identityLabel } : {}
		});
	}
	return [...summaries.values()];
}
function hasEvent(state, sessionId, messageId) {
	return resolveSessionActorMemoryWindow(state, sessionId)?.events.some(({ event }) => isRecord(event) && typeof event.id === "string" && event.id.trim() === messageId) ?? false;
}
function pruneSessionActorMemoryReactions(state) {
	const identities = /* @__PURE__ */ new Map();
	state.collaboration.reactions = state.collaboration.reactions.filter((row) => {
		let ids = identities.get(row.sessionId);
		if (!ids) {
			ids = new Set(resolveSessionActorMemoryWindow(state, row.sessionId)?.events.flatMap(({ event }) => isRecord(event) && typeof event.id === "string" && event.id.trim() ? [event.id.trim()] : []));
			identities.set(row.sessionId, ids);
		}
		return ids.has(row.messageId);
	});
}
function readSessionActorMemoryReactions(state, sessionId) {
	const messages = /* @__PURE__ */ new Map();
	for (const row of state.collaboration.reactions.filter((reaction) => reaction.sessionId === sessionId).toSorted(compareRows)) {
		const rows = messages.get(row.messageId) ?? [];
		rows.push(row);
		messages.set(row.messageId, rows);
	}
	return Object.fromEntries([...messages].map(([id, rows]) => [id, summarize(rows)]));
}
function setSessionActorMemoryReaction(state, params) {
	const rows = state.collaboration.reactions;
	const selected = rows.filter((row) => row.sessionId === params.expectedSessionId && row.messageId === params.messageId);
	const existing = selected.find((row) => row.emoji === params.emoji && row.identityId === params.identityId);
	let changed = false;
	if (params.remove ? existing : !existing) {
		if (params.remove) {
			state.collaboration.reactions = rows.filter((row) => row !== existing);
			selected.splice(selected.indexOf(existing), 1);
		} else {
			if (rows.filter((row) => row.sessionId === params.expectedSessionId).length >= 5e3 || selected.filter((row) => row.identityId === params.identityId).length >= 20) {
				const error = /* @__PURE__ */ new Error("reaction limit reached");
				error.name = "SessionReactionLimitError";
				throw error;
			}
			if (!hasEvent(state, params.expectedSessionId, params.messageId)) {
				const error = /* @__PURE__ */ new Error("unknown message");
				error.name = "SessionReactionMessageMissingError";
				throw error;
			}
			const row = {
				sessionId: params.expectedSessionId,
				messageId: params.messageId,
				emoji: params.emoji,
				identityId: params.identityId,
				identityLabel: params.identityLabel,
				createdAt: Date.now()
			};
			rows.push(row);
			selected.push(row);
		}
		changed = true;
	}
	selected.sort(compareRows);
	return {
		reactions: summarize(selected),
		newestRemainingEmoji: selected.at(-1)?.emoji,
		changed
	};
}
//#endregion
//#region src/config/sessions/session-actor-memory-suggestions.ts
const compareText = (left, right) => Buffer.compare(Buffer.from(left), Buffer.from(right));
const compareSuggestion = (left, right) => left.createdAt - right.createdAt || compareText(left.id, right.id);
function readSessionActorMemorySuggestions(context, params = {}) {
	const authorId = params.authorId?.trim();
	return [...context.state.collaboration.suggestions.values()].map(({ suggestion }) => suggestion).filter((suggestion) => (!authorId || suggestion.authorId === authorId) && (!params.pendingOnly || suggestion.state === "pending")).toSorted(compareSuggestion);
}
function pruneResolved(context) {
	const resolved = readSessionActorMemorySuggestions(context).filter((row) => row.state !== "pending");
	for (const row of resolved.slice(0, Math.max(0, resolved.length - 200))) context.state.collaboration.suggestions.delete(row.id);
}
function mutateSessionActorMemorySuggestion(context, command) {
	const suggestions = context.state.collaboration.suggestions;
	if (command.type === "session.collaboration.suggestion.add") {
		const params = command.input.params;
		const authorId = params.authorId.trim();
		const authorLabel = params.authorLabel?.trim();
		if (!authorId || !params.text.trim()) throw new Error("suggestion author and text are required");
		pruneResolved(context);
		const pending = readSessionActorMemorySuggestions(context, { pendingOnly: true });
		if (pending.length >= 100) throw new Error("session pending suggestion limit reached");
		if (pending.filter((row) => row.authorId === authorId).length >= 20) throw new Error("author pending suggestion limit reached");
		const id = params.id ?? randomUUID();
		for (const [, state] of context.entries()) if (state.collaboration.suggestions.has(id)) throw new Error("UNIQUE constraint failed: session_suggestions.id");
		const suggestion = {
			id,
			authorId,
			...authorLabel ? { authorLabel } : {},
			text: params.text,
			createdAt: params.createdAt ?? Date.now(),
			state: "pending"
		};
		suggestions.set(id, { suggestion });
		return suggestion;
	}
	const params = command.input.params;
	const row = suggestions.get(params.id);
	if (!row || row.suggestion.state !== "pending") return command.type === "session.collaboration.suggestion.release" ? false : null;
	switch (command.type) {
		case "session.collaboration.suggestion.claim": {
			const { now = Date.now(), resolution } = command.input.params;
			if (row.dispatch && now - row.dispatch.startedAt < 3e4) return { kind: "busy" };
			if (row.dispatch && row.dispatch.resolution !== resolution) return {
				kind: "mismatch",
				resolution: row.dispatch.resolution
			};
			const token = randomUUID();
			suggestions.set(params.id, {
				suggestion: row.suggestion,
				dispatch: {
					token,
					startedAt: now,
					resolution
				}
			});
			return {
				kind: "claimed",
				suggestion: row.suggestion,
				token
			};
		}
		case "session.collaboration.suggestion.release":
			if (row.dispatch?.token !== command.input.params.token) return false;
			suggestions.set(params.id, { suggestion: row.suggestion });
			return true;
		case "session.collaboration.suggestion.finalize": {
			if (row.dispatch?.token !== command.input.params.token) return null;
			const suggestion = {
				...row.suggestion,
				state: command.input.params.state
			};
			suggestions.set(params.id, { suggestion });
			pruneResolved(context);
			return suggestion;
		}
	}
	throw new Error("Unknown memory suggestion command");
}
//#endregion
//#region src/config/sessions/session-actor-memory-collaboration.ts
function readSessionActorMemoryCollaboration(context, query) {
	switch (query.type) {
		case "session.members.read": return {
			entry: context.state.hot.entry,
			members: context.state.hot.members
		};
		case "session.participants.read": return context.state.hot.participants;
		case "session.suggestions.read": return readSessionActorMemorySuggestions(context, query.input.params);
		case "session.reactions.read": return readSessionActorMemoryReactions(context.state, query.input.sessionId);
	}
	throw new Error("Unknown memory collaboration query");
}
function mutateSessionActorMemoryCollaboration(context, command) {
	const { state } = context;
	if (command.type === "session.category.apply") {
		const changed = [];
		for (const [sessionKey, candidate] of context.entries()) {
			if (candidate.hot.entry?.category?.trim() !== command.input.from) continue;
			const current = context.edit(sessionKey).hot.entry;
			if (command.input.to === void 0) delete current.category;
			else current.category = command.input.to;
			changed.push({
				sessionKey,
				sessionId: current.sessionId
			});
		}
		return changed;
	}
	if (command.type === "session.collaboration.involvement") return {
		accepted: false,
		changed: false
	};
	const entry = state.hot.entry;
	const expectedSessionId = "params" in command.input && "expectedSessionId" in command.input.params ? command.input.params.expectedSessionId : "expectedSessionId" in command.input ? command.input.expectedSessionId : void 0;
	if (expectedSessionId !== void 0 && entry?.sessionId !== expectedSessionId) throw new SessionWorkStartInvalidatedError("session changed before collaboration mutation");
	switch (command.type) {
		case "session.collaboration.add": {
			if (!entry) throw new Error("session changed before sharing mutation");
			const { params } = command.input;
			const identityId = params.identityId.trim();
			const addedBy = params.addedBy.trim();
			if (!identityId || !addedBy) throw new Error("session member identity and actor are required");
			const member = {
				identityId,
				addedBy,
				addedAt: params.addedAt ?? Date.now()
			};
			const inserted = !state.hot.members.some((row) => row.identityId === toUSVString(identityId));
			if (inserted) {
				state.hot.members.push({
					...member,
					identityId: toUSVString(identityId),
					addedBy: toUSVString(addedBy)
				});
				state.hot.members.sort((left, right) => Buffer.compare(Buffer.from(left.identityId), Buffer.from(right.identityId)));
			}
			return {
				value: {
					member,
					inserted
				},
				...inserted ? { facts: {
					kind: "member",
					sessionId: entry.sessionId,
					identityId: toUSVString(identityId),
					present: true
				} } : {}
			};
		}
		case "session.collaboration.remove": {
			if (!entry) throw new Error("session changed before sharing mutation");
			const { identityId, expected } = command.input;
			const index = state.hot.members.findIndex((row) => row.identityId === toUSVString(identityId.trim()) && (!expected || row.addedBy === expected.addedBy && row.addedAt === expected.addedAt));
			const value = index < 0 ? null : state.hot.members.splice(index, 1)[0];
			return {
				value,
				...value ? { facts: {
					kind: "member",
					sessionId: entry.sessionId,
					identityId: value.identityId,
					present: false
				} } : {}
			};
		}
		case "session.collaboration.owner.assign": {
			if (!entry) return { value: null };
			const { owner, assignedBy, assignedAt = Date.now() } = command.input.params;
			const value = {
				actor: owner,
				assignedBy,
				assignedAt
			};
			entry.owner = structuredClone(value);
			return {
				value,
				facts: {
					kind: "owner",
					sessionId: entry.sessionId,
					lifecycleRevision: entry.lifecycleRevision ?? null,
					owner: value
				}
			};
		}
		case "session.collaboration.participant": {
			const { params, profileAliases = [] } = command.input;
			const { identity } = params;
			const projection = () => state.hot.participants.length ? {
				participants: state.hot.participants.map(({ identity: actor }) => ({ identity: actor })),
				participantCount: state.hot.participants.length
			} : {};
			if (!identity.id || identity.type === "agent" && identity.id === params.sessionAgentId) return {
				value: null,
				projectionChanged: false,
				participants: projection()
			};
			const namespace = participantIdentityNamespace(identity);
			const candidates = state.hot.participants.filter((row) => participantIdentityNamespace(row.identity) === namespace);
			const previous = candidates.find((row) => row.identity.id === identity.id) ?? (identity.type === "profile" ? candidates.toSorted((left, right) => Buffer.compare(Buffer.from(left.identity.id), Buffer.from(right.identity.id))).find((row) => profileAliases.includes(row.identity.id)) : void 0);
			if (!previous && state.hot.participants.length >= MAX_SESSION_PARTICIPANTS) return {
				value: "capped",
				projectionChanged: false,
				participants: projection()
			};
			const promptedAt = params.promptedAt ?? Date.now();
			const aggregate = mergeParticipantAggregate(previous ? {
				contribution_count: previous.contributionCount,
				first_prompted_at: previous.firstPromptedAt,
				last_prompted_at: previous.lastPromptedAt
			} : void 0, {
				contribution_count: 1,
				first_prompted_at: promptedAt,
				last_prompted_at: promptedAt
			}, "sum");
			const next = {
				identity: previous?.identity ?? structuredClone(identity),
				contributionCount: aggregate.contribution_count,
				firstPromptedAt: aggregate.first_prompted_at,
				lastPromptedAt: aggregate.last_prompted_at
			};
			if (previous) state.hot.participants.splice(state.hot.participants.indexOf(previous), 1, next);
			else state.hot.participants.push(next);
			state.hot.participants.sort((left, right) => (left.firstPromptedAt === null ? -Infinity : left.firstPromptedAt) - (right.firstPromptedAt === null ? -Infinity : right.firstPromptedAt) || Buffer.compare(Buffer.from(left.identity.id), Buffer.from(right.identity.id)) || Buffer.compare(Buffer.from(participantIdentityNamespace(left.identity)), Buffer.from(participantIdentityNamespace(right.identity))));
			const participants = projection();
			if (entry) Object.assign(entry, participants);
			return {
				value: previous ? "updated" : "inserted",
				projectionChanged: !previous || previous.identity.id !== identity.id || previous.firstPromptedAt !== next.firstPromptedAt,
				participants
			};
		}
		case "session.collaboration.suggestion.add":
		case "session.collaboration.suggestion.claim":
		case "session.collaboration.suggestion.release":
		case "session.collaboration.suggestion.finalize": return mutateSessionActorMemorySuggestion(context, command);
		case "session.reaction.set": return setSessionActorMemoryReaction(state, command.input.params);
	}
	throw new Error("Unknown memory collaboration command");
}
//#endregion
//#region src/config/sessions/session-actor-memory-history-context.ts
/** The requested prefix is a data-selection contract, not a second owner-currentness check. */
function assertSessionActorMemoryAnchor(window, scope, anchor) {
	const current = window.hot.transcript.anchors.find((candidate) => candidate.entryId === anchor.entryId);
	if (anchor.agentId !== scope.agentId || anchor.storePath !== scope.path || anchor.sessionKey !== window.hot.target.sessionKey || anchor.sessionId !== window.hot.entry?.sessionId || !current || current.generation !== anchor.generation || current.rawSeq !== anchor.rawSeq || current.effectiveParentId !== anchor.effectiveParentId || current.activeMessagePosition !== anchor.activeMessagePosition) throw new SessionTranscriptReadFenceError("Completed-turn transcript anchor changed");
}
function selectSessionActorMemoryAdmittedWindow(window, scope, admission) {
	if (!admission) return window;
	assertSessionActorMemoryAnchor(window, scope, admission);
	const admittedRow = window.events.find((row) => row.rawSeq === admission.rawSeq);
	if (!isRecord(admittedRow?.event) || !isRecord(admittedRow.event.message) || admittedRow.event.message.role !== "user") throw new SessionTranscriptReadFenceError("Transcript admission does not identify a user input");
	return {
		...window,
		events: window.events.filter((row) => row.rawSeq < admission.rawSeq)
	};
}
/** Model payloads are detached only after the shared byte/frame selection has finished. */
function readSessionActorMemoryContext(window, scope, through, limits) {
	if (limits && (!Number.isSafeInteger(limits.maxBytes) || limits.maxBytes <= 0 || !Number.isSafeInteger(limits.maxEvents) || limits.maxEvents <= 0)) throw new RangeError("Model-context byte and event limits must be positive safe integers");
	if (through) assertSessionActorMemoryAnchor(window, scope, through);
	const rows = through ? window.events.filter((row) => row.rawSeq <= through.rawSeq) : window.events;
	const tree = scanSessionTranscriptTree(rows.map((row) => row.event));
	const originalEntries = /* @__PURE__ */ new Map();
	const entries = normalizeSessionContextEntryBoundaries(selectSessionTranscriptTreePathNodes(tree, through?.entryId ?? tree.leafId).flatMap((node) => {
		if (!isIndexedSessionEntry(node.entry)) return [];
		const seq = rows[node.index].rawSeq;
		originalEntries.set(seq, node.entry);
		return [{
			...projectSessionModelContextNavigation(node.entry),
			parentId: node.parentId,
			seq
		}];
	}), tree.nodes);
	const project = (request) => {
		const { entry, omitCheckpoint, toolResultOmission } = request;
		const event = {
			...originalEntries.get(entry.seq),
			parentId: entry.parentId,
			...entry.type === "compaction" || entry.type === "reset" ? { firstKeptEntryId: entry.firstKeptEntryId } : {}
		};
		if (event.type !== "message") return event;
		const [message] = projectModelContextMessages([event.message]);
		const projected = {
			...event,
			message
		};
		if (omitCheckpoint && projected.message.role === "assistant") {
			projected.message = { ...projected.message };
			delete projected.message.providerReplay;
		}
		if (toolResultOmission !== void 0 && projected.message.role === "toolResult") projected.message = {
			...projected.message,
			content: [{
				type: "text",
				text: toolResultOmission
			}]
		};
		return projected;
	};
	return projectSessionModelContext({
		header: rows.find((row) => isRecord(row.event) && row.event.type === "session")?.event,
		entries,
		version: { ...window.hot.transcript.version },
		readModelEntrySizes: (requests) => new Map(requests.map((request) => [request.entry, Buffer.byteLength(JSON.stringify(project(request)))])),
		readModelEntries: (requests) => new Map(requests.map((request) => [request.entry, structuredClone(project(request))]))
	}, limits);
}
/** Full-fidelity context uses the same path and boundary policy as the native reader. */
function readSessionActorMemoryContextMessages(window) {
	const tree = scanSessionTranscriptTree(window.events.map((row) => row.event));
	const entries = normalizeSessionContextEntryBoundaries(selectSessionTranscriptTreePathNodes(tree, tree.leafId).flatMap((node) => isIndexedSessionEntry(node.entry) ? [{
		...node.entry,
		parentId: node.parentId
	}] : []), tree.nodes);
	return {
		messages: Array.from(iterateSessionContextMessages(entries)),
		header: window.events.find((row) => isRecord(row.event) && row.event.type === "session")?.event,
		version: window.hot.transcript.version
	};
}
//#endregion
//#region src/config/sessions/session-actor-memory-history-navigation.ts
/** Derived selections borrow immutable event payloads from the actor's current command. */
function createSessionActorMemoryHistoryNavigation(window) {
	const tree = scanSessionTranscriptTree(window.events.map((row) => row.event));
	const nodes = new Map(tree.nodes.map((node) => [window.events[node.index], node]));
	let messagePosition = 0;
	const active = selectSessionTranscriptActiveEntries({
		entries: window.events,
		recordOf: (row) => row.event,
		tree,
		failClosedOnInvalidLeafControl: true
	}).filter((row) => shouldProjectActiveEvent(row.event)).map((row, activePosition) => ({
		rawSeq: row.rawSeq,
		event: row.event,
		eventJson: row.eventJson,
		createdAt: row.createdAt,
		searchOrder: row.searchOrder,
		node: nodes.get(row),
		activePosition,
		messagePosition: hasTranscriptMessage(row.event) ? messagePosition++ : null,
		serializedBytes: Buffer.byteLength(row.eventJson) + 1
	}));
	const reset = active.findLast((row) => isRecord(row.event) && row.event.type === "reset");
	const firstKeptId = reset && isRecord(reset.event) ? reset.event.firstKeptEntryId : void 0;
	const firstKept = typeof firstKeptId === "string" ? active.find((row) => isRecord(row.event) && row.event.id === firstKeptId) : void 0;
	const candidates = reset && firstKept && firstKept.activePosition < reset.activePosition ? active.slice(firstKept.activePosition, reset.activePosition).flatMap((row) => isIndexedSessionEntry(row.event) && row.event.type === "message" ? [{
		row,
		event: row.event
	}] : []) : [];
	const retained = new Set(selectResetKeptEntries(candidates.map(({ event }) => event)));
	const keptMessages = candidates.flatMap(({ row, event }) => retained.has(event) && (event.message.role === "user" || event.message.role === "assistant") ? [row] : []);
	const afterReset = reset ? active.slice(reset.activePosition + 1) : active;
	return {
		tree,
		active,
		visibleMessages: [...keptMessages, ...afterReset.filter((row) => row.messagePosition !== null)],
		visibleHistory: [
			...keptMessages,
			...reset ? [reset] : [],
			...afterReset.filter((row) => row.messagePosition !== null || isRecord(row.event) && isVisibleHistoryNonMessageEvent(row.event))
		],
		latestResetRawSeq: reset?.rawSeq ?? null,
		keptMessages,
		boundaryActivePosition: reset?.activePosition
	};
}
/** Admit raw history sizes before projecting or detaching the selected response. */
function resolveSessionActorMemoryHistoryStart(rows, start, end, maxBytes, maxMessages, allowOversized, initialBytes = 0, requireComplete = false) {
	let selected = end;
	let bytes = initialBytes;
	while (selected > start && end - selected < maxMessages) {
		const row = rows[selected - 1];
		if (allowOversized && selected === end && row.serializedBytes > 8388608) throw new Error(`Transcript history message exceeds the ${SOURCE_PAGE_MAX_BYTES}-byte page limit`);
		if ((!allowOversized || selected < end) && bytes + row.serializedBytes > maxBytes) break;
		bytes += row.serializedBytes;
		selected--;
	}
	if (requireComplete && selected !== start) throw new Error(`Transcript history page exceeds the ${SOURCE_PAGE_MAX_BYTES}-byte limit; request a smaller limit`);
	return selected;
}
//#endregion
//#region src/config/sessions/session-actor-memory-completion.ts
/** Entry, submitted identity and active input evidence come from the same owned state. */
function readSessionActorMemoryCompletion(state, input, scope) {
	const entry = state.hot.entry;
	const inputKey = `${input.sourceRunId}:user`;
	const hasSubmittedInput = state.pendingInputs.has(inputKey) || state.hot.transcript.idempotency.some(({ key }) => key === inputKey);
	const claim = input.claim ?? (entry?.restartRecoveryHarnessCompletion?.sourceRunId === input.sourceRunId ? entry.restartRecoveryHarnessCompletion : getRestartRecoveryTerminalDeliveryEvidence(entry, input.sourceRunId)?.harnessCompletion);
	if (!entry || !claim || input.mode !== "committed" && entry.restartRecoveryDeliveryRunId === claim.sourceRunId) return {
		entry,
		hasSubmittedInput,
		validInput: true
	};
	const navigation = createSessionActorMemoryHistoryNavigation(selectSessionActorMemoryAdmittedWindow(state, scope, input.admission));
	const start = navigation.active.findIndex(({ event }) => {
		return asOptionalRecord(asOptionalRecord(event)?.message)?.idempotencyKey === inputKey;
	});
	if (start < 0 || start < (navigation.boundaryActivePosition ?? 0)) return {
		entry,
		hasSubmittedInput,
		validInput: false,
		version: state.hot.transcript.version
	};
	const accept = createHarnessCompletionInputPredicate({
		claim,
		entry,
		operationalRunId: entry.restartRecoveryDeliveryRunId
	});
	const users = navigation.active.slice(start).flatMap(({ event }) => {
		const message = asOptionalRecord(asOptionalRecord(event)?.message);
		return message?.role === "user" ? [message] : [];
	});
	return {
		entry,
		hasSubmittedInput,
		validInput: users.length > 0 && users.every(accept),
		version: state.hot.transcript.version
	};
}
//#endregion
//#region packages/memory-host-sdk/src/host/session-transcript-corpus-policy.ts
function isDreamingNarrativeSessionKeyLike(value) {
	return typeof value === "string" && isDreamingNarrativeSessionStoreKey(value);
}
function classifySessionEntry(sessionKey, entry, cronGeneratedSessionKeys) {
	const generatedByDreamingNarrative = isDreamingNarrativeSessionStoreKey(sessionKey) || isDreamingNarrativeSessionKeyLike(entry.spawnedBy);
	const generatedByCronRun = cronGeneratedSessionKeys.has(sessionKey);
	return {
		generatedByDreamingNarrative,
		generatedByCronRun,
		sessionKind: generatedByCronRun ? "cron" : typeof entry.heartbeatIsolatedBaseSessionKey === "string" && entry.heartbeatIsolatedBaseSessionKey.trim() ? "heartbeat" : generatedByDreamingNarrative || Boolean(entry.spawnedBy) ? "subagent" : sessionKey.includes(":subagent:") ? "subagent" : "interactive"
	};
}
function readParentSessionKeys(entry) {
	const keys = /* @__PURE__ */ new Set();
	for (const value of [entry?.parentSessionKey, entry?.spawnedBy]) {
		if (typeof value !== "string") continue;
		const trimmed = value.trim();
		if (trimmed) keys.add(trimmed);
	}
	return [...keys];
}
function collectCronGeneratedSessionKeys(summaries) {
	const entriesByKey = new Map(summaries.map((summary) => [summary.sessionKey, summary.entry]));
	const cronGeneratedKeys = /* @__PURE__ */ new Set();
	const visited = /* @__PURE__ */ new Set();
	const childrenByKey = /* @__PURE__ */ new Map();
	const isCronGenerated = (sessionKey, entry) => {
		if (isCronRunSessionKey(sessionKey)) {
			cronGeneratedKeys.add(sessionKey);
			return true;
		}
		if (visited.has(sessionKey)) return cronGeneratedKeys.has(sessionKey);
		visited.add(sessionKey);
		const generated = readParentSessionKeys(entry).some((parentKey) => {
			const children = childrenByKey.get(parentKey) ?? [];
			children.push(sessionKey);
			childrenByKey.set(parentKey, children);
			return isCronGenerated(parentKey, entriesByKey.get(parentKey));
		});
		if (generated) cronGeneratedKeys.add(sessionKey);
		return generated;
	};
	for (const summary of summaries) isCronGenerated(summary.sessionKey, summary.entry);
	for (const sessionKey of cronGeneratedKeys) for (const child of childrenByKey.get(sessionKey) ?? []) cronGeneratedKeys.add(child);
	return cronGeneratedKeys;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-normalize.ts
function createFallbackSessionEntry(patch) {
	const now = Date.now();
	return {
		sessionId: patch.sessionId ?? randomUUID(),
		updatedAt: patch.updatedAt ?? now,
		...patch
	};
}
function normalizeSessionRowChatType(value) {
	if (value === "direct" || value === "group" || value === "channel") return value;
	return null;
}
//#endregion
//#region src/config/sessions/session-memory-targets-policy.ts
function projectSessionMetadata(instance, participants = []) {
	return {
		agentId: instance.agentId,
		sessionId: instance.sessionId,
		sessionKey: instance.sessionKey,
		resolution: "live",
		...instance.sourceMetadata,
		participants
	};
}
function unresolvedMemorySessionTarget(agentId, sessionId) {
	return {
		agentId,
		sessionId,
		resolution: "unresolved",
		hookExternalContentSource: null,
		channel: null,
		accountId: null,
		chatType: null,
		participants: []
	};
}
function resolveMemorySessionSince(since) {
	const resolved = typeof since === "string" ? Date.parse(since) : since;
	if (resolved !== void 0 && !Number.isFinite(resolved)) throw new Error(`Invalid memory session date: ${since}`);
	return resolved;
}
function selectMemorySessionTargets(params, source) {
	const sessionIds = [...new Set(params.sessionIds ?? [])];
	const hookSources = [...new Set(params.hookSources ?? [])];
	const participants = [...new Set(params.participants ?? [])];
	if (sessionIds.length === 0 && hookSources.length === 0 && participants.length === 0) return [];
	const since = resolveMemorySessionSince(params.since);
	const resolvedSelectors = /* @__PURE__ */ new Set();
	const targets = /* @__PURE__ */ new Map();
	const instances = source.instances.filter((instance) => instance.agentId === normalizeAgentId(params.agentId)).toSorted((left, right) => left.sourceMetadata.createdAt - right.sourceMetadata.createdAt || left.sessionId.localeCompare(right.sessionId));
	for (const instance of instances) {
		const identities = [...source.participants.get(instance.sessionKey) ?? []];
		const hookSource = instance.sourceMetadata.hookExternalContentSource;
		if (!sessionIds.includes(instance.sessionId) && !sessionIds.includes(instance.sessionKey) && !(hookSource && hookSources.includes(hookSource)) && !identities.some((identity) => participants.includes(identity.id))) continue;
		resolvedSelectors.add(instance.sessionId);
		resolvedSelectors.add(instance.sessionKey);
		if (since === void 0 || instance.sourceMetadata.createdAt >= since) targets.set(instance.sessionId, projectSessionMetadata(instance, identities));
	}
	for (const archive of source.archives) {
		resolvedSelectors.add(archive.sessionId);
		resolvedSelectors.add(archive.sessionKey);
		if (targets.has(archive.sessionId) || since !== void 0 && archive.createdAt < since) continue;
		targets.set(archive.sessionId, {
			agentId: params.agentId,
			sessionId: archive.sessionId,
			sessionKey: archive.sessionKey,
			resolution: "archived",
			hookExternalContentSource: null,
			channel: null,
			accountId: null,
			chatType: null,
			createdAt: archive.createdAt,
			participants: []
		});
	}
	for (const sessionId of sessionIds) if (!resolvedSelectors.has(sessionId)) targets.set(sessionId, unresolvedMemorySessionTarget(params.agentId, sessionId));
	return [...targets.values()];
}
//#endregion
//#region src/config/sessions/session-window-created-at.ts
function resolveSessionWindowCreatedAt(entry, updatedAt) {
	for (const candidate of [
		entry.sessionStartedAt,
		entry.startedAt,
		entry.updatedAt,
		updatedAt
	]) if (typeof candidate === "number" && Number.isFinite(candidate) && candidate >= 0) return candidate;
	return updatedAt;
}
//#endregion
//#region src/config/sessions/session-actor-memory-usage.ts
function readSessionActorMemoryTranscriptStats(window) {
	const updatedAt = window.hot.transcript.version.updatedAt;
	return {
		eventCount: window.events.length,
		maxSeq: window.events.at(-1)?.rawSeq ?? 0,
		sizeBytes: window.events.reduce((bytes, row) => bytes + Buffer.byteLength(row.eventJson), 0) + Math.max(0, window.events.length - 1),
		...updatedAt === null ? {} : {
			lastMutationAtMs: updatedAt,
			lastObservedMutationAtMs: updatedAt
		}
	};
}
function windows(context) {
	const result = [];
	for (const [sessionKey, state] of context.entries()) {
		if (!state.hot.entry) continue;
		context.get(sessionKey);
		result.push({
			sessionKey,
			window: state,
			historical: false
		});
		for (const window of state.historicalWindows.values()) result.push({
			sessionKey,
			window,
			historical: true
		});
	}
	return result;
}
function readSessionActorMemoryUsage(context, query) {
	if (query.type === "session.memory.targets" && !query.input.selectors.sessionIds?.length && !query.input.selectors.hookSources?.length && !query.input.selectors.participants?.length) return [];
	const selected = windows(context);
	if (query.type === "session.memory.targets") return selectMemorySessionTargets(query.input.selectors, {
		instances: selected.flatMap(({ sessionKey, window }) => {
			const entry = window.hot.entry;
			return entry ? [{
				agentId: context.agentId,
				sessionId: entry.sessionId,
				sessionKey,
				entry,
				acpOwned: Boolean(entry.acp),
				provenanceKnown: true,
				updatedAtMs: window.hot.transcript.version.updatedAt ?? entry.updatedAt,
				sourceMetadata: {
					createdAt: window.sourceCreatedAt ?? resolveSessionWindowCreatedAt(entry, entry.updatedAt),
					channel: normalizeNullableString(sessionDeliveryChannel(entry)),
					accountId: normalizeNullableString(deliveryContextFromSession(entry)?.accountId),
					chatType: normalizeSessionRowChatType(entry.chatType),
					hookExternalContentSource: entry.hookExternalContentSource ?? null
				}
			}] : [];
		}),
		participants: new Map([...context.entries()].map(([key, state]) => [key, state.hot.participants.map(({ identity }) => identity)])),
		archives: []
	});
	if (query.type === "session.usage.snapshot") {
		const ids = query.input.sessionIds && new Set(query.input.sessionIds);
		const budget = query.input.reportBudget;
		let remainingBytes = budget?.remainingBytes ?? Number.POSITIVE_INFINITY;
		let metadataCount = 0;
		return selected.flatMap(({ sessionKey, window }) => {
			getAsyncWorkSignal()?.throwIfAborted();
			const entry = window.hot.entry;
			if (!entry || ids && !ids.has(entry.sessionId)) return [];
			let rollup;
			let rollupDeferred = false;
			let deferredRollupMetadata;
			const cached = window.usageRollup;
			if (cached) {
				const headerBytes = 2 * cached.valueJson.length;
				const bodyBytes = cached.blob.byteLength;
				const headerAllowed = !budget || Buffer.byteLength(cached.valueJson) <= 65536 && headerBytes <= remainingBytes;
				const bodyAllowed = !budget || bodyBytes <= 1048576 && headerBytes + bodyBytes <= remainingBytes;
				if (budget && (!headerAllowed || !bodyAllowed)) {
					const envelope = Buffer.byteLength(cached.valueJson) <= 65536 ? decodeUsageCostRollupEnvelope(cached.valueJson, budget.pricingFingerprint) : void 0;
					rollupDeferred = Boolean(envelope && envelope.body.storedBytes === bodyBytes);
					if (rollupDeferred && envelope && !headerAllowed && metadataCount < budget.metadataLimit) {
						const source = envelope.checkpoint;
						const checkpoint = source.kind === "jsonl" ? {
							kind: source.kind,
							observedSize: source.observedSize,
							observedMtimeMs: source.observedMtimeMs,
							device: source.device,
							inode: source.inode
						} : {
							kind: source.kind,
							maxSeq: source.maxSeq,
							eventCount: source.eventCount,
							size: source.size,
							mtimeMs: source.mtimeMs
						};
						if (Object.entries(checkpoint).every(([key, value]) => key === "kind" || typeof value === "number" && Number.isFinite(value)) && Number.isFinite(envelope.scannedAt)) {
							deferredRollupMetadata = {
								checkpoint,
								scannedAt: envelope.scannedAt
							};
							metadataCount += 1;
						}
					}
				}
				if (headerAllowed) {
					rollup = {
						valueJson: cached.valueJson,
						updatedAt: cached.updatedAt,
						...budget || query.input.includeEvents ? { bodyBytes } : {},
						...query.input.includeRollupBodies && bodyAllowed ? { blob: cached.blob } : {}
					};
					remainingBytes -= headerBytes + (query.input.includeRollupBodies && bodyAllowed ? bodyBytes : 0);
				}
			}
			return [{
				sessionKey,
				sessionId: entry.sessionId,
				updatedAtMs: window.hot.transcript.version.updatedAt ?? entry.updatedAt,
				stats: readSessionActorMemoryTranscriptStats(window),
				rollup,
				...rollupDeferred ? { rollupDeferred: true } : {},
				...deferredRollupMetadata ? { deferredRollupMetadata } : {},
				...query.input.includeEvents ? { events: window.events.map(({ rawSeq, eventJson }) => ({
					seq: rawSeq,
					eventJson
				})) } : {}
			}];
		});
	}
	const lineage = collectCronGeneratedSessionKeys([...selected.filter(({ historical }) => historical), ...selected.filter(({ historical }) => !historical)].flatMap(({ sessionKey, window }) => window.hot.entry ? [{
		sessionKey,
		entry: window.hot.entry
	}] : []));
	return selected.flatMap(({ sessionKey, window, historical }) => {
		const entry = window.hot.entry;
		if (!entry || historical && !query.input.options.includeRetainedSqlite) return [];
		const stats = readSessionActorMemoryTranscriptStats(window);
		const classification = classifySessionEntry(sessionKey, entry, lineage);
		return [{
			agentId: context.agentId,
			sessionKey,
			sessionId: entry.sessionId,
			sessionFile: sessionKey,
			storePath: context.path,
			transcriptSource: "sqlite",
			artifactKind: historical ? "retained-session" : "active-session",
			updatedAtMs: window.hot.transcript.version.updatedAt ?? entry.updatedAt,
			...query.input.options.includeContentRevision === false ? {} : { contentRevision: [
				"sqlite",
				stats.maxSeq,
				stats.sizeBytes,
				stats.eventCount,
				stats.lastMutationAtMs ?? "",
				stats.lastObservedMutationAtMs ?? ""
			].join(":") },
			...classification.generatedByDreamingNarrative ? { generatedByDreamingNarrative: true } : {},
			...classification.generatedByCronRun ? { generatedByCronRun: true } : {},
			sessionKind: classification.sessionKind
		}];
	});
}
function mutateSessionActorMemoryUsage(context, command) {
	const sessionId = command.input.sessionId;
	for (const [sessionKey, state] of context.entries()) {
		const current = state.hot.entry?.sessionId === sessionId;
		const historical = state.historicalWindows.get(sessionId);
		if (!current && !historical) continue;
		const working = context.edit(sessionKey);
		const usageRollup = structuredClone(command.input.rollup);
		if (current) working.usageRollup = usageRollup;
		else working.historicalWindows.set(sessionId, {
			...historical,
			usageRollup
		});
		return true;
	}
	return false;
}
//#endregion
//#region src/config/sessions/session-actor-memory-corpus.ts
/** Select once from owned windows, retaining only the Memory projection requested by the caller. */
function readSessionActorMemoryCorpus(context, query) {
	const selectedKey = query.input.sessionKey ?? (query.input.sessionId === void 0 ? context.state.hot.target.sessionKey : void 0);
	for (const [sessionKey, state] of context.entries()) {
		if (selectedKey !== void 0 && selectedKey !== sessionKey) continue;
		const window = query.input.sessionId === void 0 || query.input.sessionId === state.hot.entry?.sessionId ? state : state.historicalWindows.get(query.input.sessionId);
		if (!window?.hot.entry) continue;
		context.get(sessionKey);
		if (query.type === "session.memory.resetRecall") return resolveSessionResetRecallCutoff(window.events.map((row) => row.event));
		return {
			sessionId: window.hot.entry.sessionId,
			sessionKey,
			stats: readSessionActorMemoryTranscriptStats(window),
			events: window.events.map(({ event }) => query.input.includeMessages ? event : projectSessionEntryRecord(event))
		};
	}
	return query.type === "session.memory.resetRecall" ? { state: "invalid" } : void 0;
}
//#endregion
//#region src/config/sessions/session-actor-memory-entry-guards.ts
/** Prepared external effects retain their source and exact transcript predicates. */
function validateSessionActorMemoryEntryGuards(context, guards) {
	if (!guards) return true;
	if (guards.conversation) assertConversationAuthority(selectSessionActorMemoryConversations(context, {
		conversationRef: guards.conversation.conversationRef,
		limit: 1
	})[0], guards.conversation);
	if (guards.sources?.length) {
		const validation = context.validateSources(guards.sources);
		context.admit("commit", {
			kind: "session.entry.sources",
			validation
		});
		if (validation.refusedSource) throw new Error("Session source changed before entry mutation");
	}
	const cli = guards.cliHistory;
	if (cli) {
		const window = resolveSessionActorMemoryWindow(context.state, cli.sessionId);
		if (!window || !isDeepStrictEqual(window.hot.transcript.watermark, cli.watermark)) throw new Error(CLI_HISTORY_CHANGED_BEFORE_PREPARATION);
		selectSessionActorMemoryAdmittedWindow(window, context, cli.admission);
	}
	const predicate = guards.shouldCommitIf;
	if (!predicate) return true;
	const window = resolveSessionActorMemoryWindow(context.state, predicate.sessionId);
	if (!window || window.hot.transcript.version.generation !== predicate.generation) return false;
	return !predicate.leafEntryId || createSessionActorMemoryHistoryNavigation(window).active.some(({ event }) => isRecord(event) && event.id === predicate.leafEntryId);
}
//#endregion
//#region src/config/sessions/session-actor-memory-entry-install.ts
/** Apply logical-node preservation before selecting the actor's transcript window. */
function installSessionActorMemoryEntry(state, entry, options = {}) {
	const previous = state.hot.entry;
	let next = normalizeSessionEntryTimestamp({
		...entry,
		incognito: true
	});
	if (!hasValidSessionEntryIdentity(next)) throw new Error("Refusing invalid memory session entry identity");
	next = preserveCreationStamp(next, previous);
	next.createdAt ??= previous?.updatedAt ?? Date.now();
	const sameWindow = previous?.sessionId === next.sessionId;
	const sameLifecycle = sameWindow && previous?.lifecycleRevision === next.lifecycleRevision;
	if (!options.providerReviewMutation) next.providerReview = sameLifecycle ? previous?.providerReview : void 0;
	if (next.providerReview?.sessionId !== next.sessionId) delete next.providerReview;
	if (!options.consumePendingReset && sameLifecycle && previous?.updatedAt === 0) next.updatedAt = 0;
	if (sameLifecycle && previous?.compactionQualityDegraded) next.compactionQualityDegraded = true;
	const involvement = previous?.profileInvolvement ?? (entry.profileInvolvement?.key === state.hot.target.sessionKey ? entry.profileInvolvement : void 0);
	if (involvement) next.profileInvolvement = {
		...involvement,
		key: state.hot.target.sessionKey
	};
	else delete next.profileInvolvement;
	delete next.publicShare;
	if (previous && !sameWindow) delete next.visibility;
	selectSessionActorMemoryWindow(state, next);
	state.sourceCreatedAt ??= resolveSessionWindowCreatedAt(next, next.updatedAt);
	if (previous && !sameWindow) {
		state.collaboration = createSessionActorMemoryCollaborationState();
		state.hot.members = [];
		state.hot.participants = [];
		delete state.hot.entry.participants;
		delete state.hot.entry.participantCount;
	}
	return state.hot.entry;
}
//#endregion
//#region src/config/sessions/session-actor-memory-events.ts
function createSessionActorMemoryEvents(options) {
	const { state, agentId, path } = options;
	const version = () => ({ ...state.hot.transcript.version });
	const tree = () => scanSessionTranscriptTree(state.events.map(({ event }) => event));
	const requireEntry = () => {
		if (!state.hot.entry) throw new SessionTranscriptWriterClaimReboundError();
		return state.hot.entry;
	};
	const refresh = () => {
		const entry = requireEntry();
		const navigation = tree();
		const active = selectSessionTranscriptTreePathNodes(navigation, navigation.leafId);
		let messagePosition = 0;
		const generation = state.hot.transcript.version.generation;
		state.hot.transcript.anchorsState = "resident";
		state.hot.transcript.anchors = active.flatMap((node) => {
			if (!hasTranscriptMessage(node.entry) || !shouldProjectActiveEvent(node.entry) || !generation) return [];
			const record = state.events[node.index];
			const idempotencyKey = isRecord(node.entry) ? readMessageIdempotencyKey(node.entry.message) : null;
			return [{
				agentId,
				sessionId: entry.sessionId,
				sessionKey: state.hot.target.sessionKey,
				storePath: path,
				generation,
				entryId: node.id,
				rawSeq: record.rawSeq,
				effectiveParentId: isRecord(node.entry) && typeof node.entry.parentId === "string" ? node.entry.parentId : null,
				activeMessagePosition: messagePosition++,
				...idempotencyKey ? { idempotencyKey } : {}
			}];
		});
		const entries = normalizeSessionContextEntryBoundaries(active.flatMap((node) => isIndexedSessionEntry(node.entry) ? [{
			...node.entry,
			parentId: node.parentId,
			seq: state.events[node.index].rawSeq
		}] : []), navigation.nodes);
		state.hot.transcript.modelContext = navigation.hasInvalidLeafControl ? {
			kind: "unavailable",
			reason: "projection",
			generation
		} : {
			kind: "resident",
			entries: [...iterateSessionContextEntries(entries)].map(({ entry: item }) => ({
				rawSeq: item.seq,
				eventId: item.id
			}))
		};
	};
	const writeEvent = (event, eventJson = JSON.stringify(event), lookup) => {
		if (isRecord(event) && typeof event.id === "string" && state.events.some(({ event: prior }) => isRecord(prior) && prior.id === event.id)) return false;
		const rawSeq = (state.hot.transcript.version.rawSeq ?? -1) + 1;
		const generation = state.hot.transcript.version.generation ?? randomUUID();
		state.events = [...state.events, {
			rawSeq,
			event: JSON.parse(eventJson),
			eventJson
		}];
		state.hot.transcript.version = {
			generation,
			rawSeq,
			updatedAt: Math.max(Date.now(), (state.hot.transcript.version.updatedAt ?? -1) + 1)
		};
		state.hot.transcript.watermark = {
			generation,
			maxSeq: rawSeq
		};
		const writer = getCliHistoryWriter({
			agentId,
			storePath: path,
			sessionId: requireEntry().sessionId,
			sessionKey: state.hot.target.sessionKey
		});
		if (writer) {
			const next = advanceCliHistoryBoundary(state.hot.entry, requireEntry().sessionId, generation, {
				first: rawSeq,
				last: rawSeq
			}, writer);
			if (next) {
				writer.assertCurrent();
				state.hot.entry = next;
			}
		}
		if (isRecord(event) && typeof event.id === "string" && event.type === "message") {
			const key = readMessageIdempotencyKey(event.message);
			if (key && (lookup !== "scan-assistant" || !state.hot.transcript.idempotency.some((item) => item.key === key))) state.hot.transcript.idempotency = [...state.hot.transcript.idempotency.filter((item) => item.key !== key), {
				key,
				eventId: event.id,
				rawSeq
			}];
		}
		if (isRecord(event) && event.type === "compaction" && parseCompactionDetails(event.details)?.qualityDegraded && !requireEntry().compactionQualityDegraded) state.hot.entry = {
			...requireEntry(),
			compactionQualityDegraded: true
		};
		refresh();
		return true;
	};
	const isAncestor = (leafId, candidateId) => {
		const navigation = tree();
		let current = navigation.byId.get(leafId);
		for (let depth = 0; current && depth < 4096; depth++) {
			if (current.parentId === candidateId) return true;
			current = current.parentId === null ? void 0 : navigation.byId.get(current.parentId);
		}
		return false;
	};
	const parent = (input) => resolveTranscriptAppendParent({
		...input,
		tailId: tree().appendParentId,
		parentId: input.parentId,
		isAncestor
	});
	const checkMutation = (expected) => {
		if (expected !== void 0 && expected !== state.hot.transcript.version.updatedAt) throw new SqliteTranscriptMutationConflictError(requireEntry().sessionId);
	};
	const rebasePrepared = (input, parentId) => {
		const navigation = tree();
		const tail = navigation.appendParentId;
		const admittedUserId = input.view?.admission?.entryId;
		if (tail !== parentId && (tail === null || !isAncestor(tail, parentId)) || admittedUserId && tail !== admittedUserId && (tail === null || !isAncestor(tail, admittedUserId))) return false;
		const prepared = parentId === null ? void 0 : navigation.byId.get(parentId);
		const admitted = admittedUserId ? navigation.byId.get(admittedUserId) : void 0;
		if (parentId !== null && !prepared || admittedUserId && !admitted) return false;
		const newer = state.events.filter(({ event }, index) => index > (prepared?.index ?? -1) && isRecord(event) && event.type === "message");
		if (newer.length > 256 || newer.reduce((sum, row) => sum + Buffer.byteLength(row.eventJson), 0) > 1048576) return false;
		return preparedAssistantMessagesPreserveTurn(newer.flatMap(({ event }) => {
			if (!isRecord(event) || typeof event.id !== "string" || !isRecord(event.message)) return [];
			const message = event.message;
			const internal = asOptionalRecord(message["__openclaw"]);
			const provenance = isRecord(message.provenance) ? message.provenance : void 0;
			return [{
				event_id: event.id,
				message_role: message.role,
				context_free_command: message.excludeFromContext === true && internal?.contextFreeCommand === true ? 1 : 0,
				provenance_kind: provenance?.kind,
				provenance_source_channel: provenance?.sourceChannel
			}];
		}), admittedUserId, () => false);
	};
	const appendRaw = (event, input = {}, bytes) => {
		checkMutation(input.expectedMutationAt);
		const resolved = isRecord(event) && (event.parentId === null || typeof event.parentId === "string") && input.appendIntent === "active-branch" ? {
			...event,
			parentId: parent({
				...input,
				parentId: event.parentId
			})
		} : event;
		return writeEvent(resolved, resolved === event ? bytes : void 0) ? {
			appended: true,
			...isRecord(resolved) && (resolved.parentId === null || typeof resolved.parentId === "string") ? { effectiveParentId: resolved.parentId } : {}
		} : { appended: false };
	};
	const replaceRows = (rows, replacement) => {
		const generation = replacement?.preserveGeneration ? state.hot.transcript.version.generation : randomUUID();
		const updatedAt = Math.max(Date.now(), (state.hot.transcript.version.updatedAt ?? -1) + 1);
		state.events = rows;
		pruneSessionActorMemoryReactions(state);
		state.hot.transcript.version = {
			generation,
			rawSeq: rows.at(-1)?.rawSeq ?? null,
			updatedAt
		};
		state.hot.transcript.watermark = {
			generation,
			maxSeq: rows.at(-1)?.rawSeq ?? null
		};
		const identities = /* @__PURE__ */ new Map();
		for (const row of rows) {
			if (!isRecord(row.event) || row.event.type !== "message" || typeof row.event.id !== "string") continue;
			const key = readMessageIdempotencyKey(row.event.message);
			if (key) identities.set(key, {
				key,
				eventId: row.event.id,
				rawSeq: row.rawSeq
			});
		}
		state.hot.transcript.idempotency = [...identities.values()];
		refresh();
	};
	return {
		version,
		tree,
		writeEvent,
		parent,
		checkMutation,
		rebasePrepared,
		appendRaw,
		replaceRows
	};
}
//#endregion
//#region src/config/sessions/session-actor-memory-lifecycle-artifacts.ts
/** Selection stays with the memory owner; no transcript bodies cross this boundary. */
function planMemoryLifecycleArtifacts(context, input, preparedEntries) {
	const oldEnough = (window, entry) => {
		const updatedAt = window.events.reduce((latest, row) => Math.max(latest, row.createdAt ?? 0), entry?.updatedAt ?? 0);
		return input.nowMs - updatedAt >= input.orphanTranscriptMinAgeMs;
	};
	const foreign = (window) => Boolean(input.pluginOwnerId && window.hot.entry?.pluginOwnerId && window.hot.entry.pluginOwnerId !== input.pluginOwnerId);
	const plan = {
		entries: [],
		windows: []
	};
	const retained = /* @__PURE__ */ new Set();
	const removed = /* @__PURE__ */ new Set();
	for (const [sessionKey, state] of context.entries()) {
		const entry = state.hot.entry;
		if (!entry) continue;
		const segment = parseAgentSessionKey(sessionKey)?.rest ?? sessionKey;
		const references = new Set(collectSessionStateIdsForEntry(entry));
		if ((!preparedEntries || isDeepStrictEqual(entry, preparedEntries.get(sessionKey))) && segment.startsWith(input.sessionKeySegmentPrefix) && oldEnough(state, entry) && !foreign(state) && ![...state.historicalWindows].some(([id, window]) => references.has(id) && foreign(window))) {
			context.get(sessionKey);
			plan.entries.push({
				sessionKey,
				expected: entry
			});
			removed.add(sessionKey);
		} else for (const id of references) retained.add(id);
	}
	for (const [sessionKey, state] of context.entries()) {
		if (removed.has(sessionKey)) continue;
		for (const [sessionId, window] of state.historicalWindows) if (!retained.has(sessionId) && !foreign(window) && oldEnough(window) && window.events.some((row) => row.eventJson.includes(input.transcriptContentMarker))) {
			context.get(sessionKey);
			plan.windows.push({
				sessionKey,
				sessionId
			});
		}
	}
	return plan;
}
//#endregion
//#region src/config/sessions/ambient-transcript-watermark-projection.ts
function numericMessageId(value) {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : void 0;
}
function isAmbientTranscriptWatermarkAfter(next, current) {
	if (!current) return true;
	if (next.timestampMs !== void 0 && current.timestampMs !== void 0 && next.timestampMs !== current.timestampMs) return next.timestampMs > current.timestampMs;
	const nextMessageId = numericMessageId(next.messageId);
	const currentMessageId = numericMessageId(current.messageId);
	if (nextMessageId !== void 0 && currentMessageId !== void 0) return nextMessageId > currentMessageId;
	return (next.timestampMs === void 0 || current.timestampMs === void 0) && next.messageId !== current.messageId;
}
function readAmbientTranscriptWatermarkFromEntry(entry, key) {
	const watermark = entry?.ambientTranscriptWatermarks?.[key];
	return watermark?.sessionId === entry?.sessionId ? watermark : void 0;
}
function projectAmbientTranscriptWatermark(entry, input) {
	if (!entry.sessionId || input.expectedSessionId !== void 0 && entry.sessionId !== input.expectedSessionId || !isAmbientTranscriptWatermarkAfter(input, readAmbientTranscriptWatermarkFromEntry(entry, input.key))) return null;
	return { ambientTranscriptWatermarks: {
		...entry.ambientTranscriptWatermarks,
		[input.key]: {
			sessionId: entry.sessionId,
			messageId: input.messageId,
			...input.timestampMs !== void 0 ? { timestampMs: input.timestampMs } : {},
			updatedAt: input.now
		}
	} };
}
//#endregion
//#region src/config/sessions/metadata-projection.ts
function hasExternalOriginChange(existing, next) {
	const nextProvider = next?.provider;
	return nextProvider != null && nextProvider !== "webchat" && !isInternalNonDeliveryChannel(nextProvider) && (!existing || existing.provider != null && nextProvider !== existing.provider || existing.surface != null && next?.surface != null && next.surface !== existing.surface || existing.accountId != null && next?.accountId != null && next.accountId !== existing.accountId);
}
const mergeSessionOrigin = (existing, next) => {
	if (!existing && !next) return;
	const merged = existing ? { ...existing } : {};
	if (existing != null && hasExternalOriginChange(existing, next)) {
		delete merged.nativeChannelId;
		delete merged.nativeDirectUserId;
		delete merged.avatar;
		delete merged.accountId;
		delete merged.threadId;
	}
	if (existing && next && (next.from != null && existing.from != null && next.from !== existing.from || next.chatType != null && existing.chatType != null && next.chatType !== existing.chatType || next.nativeDirectUserId != null && existing.nativeDirectUserId != null && next.nativeDirectUserId !== existing.nativeDirectUserId)) delete merged.avatar;
	const mergeField = (field, value) => {
		if (value) merged[field] = value;
	};
	for (const field of [
		"label",
		"provider",
		"surface",
		"chatType",
		"from",
		"to",
		"nativeChannelId",
		"nativeDirectUserId",
		"avatar",
		"accountId"
	]) mergeField(field, next?.[field]);
	if (next?.threadId != null && next.threadId !== "") merged.threadId = next.threadId;
	return Object.keys(merged).length > 0 ? merged : void 0;
};
function projectGroupSessionPatch(group, existing, sessionKey) {
	if (!group) return null;
	const { resolution, nextSubject, nextGroupChannel, topicName, space } = group;
	const patch = {
		chatType: resolution.chatType ?? "group",
		groupId: resolution.id
	};
	if (nextSubject) {
		patch.subject = nextSubject;
		patch.groupChannel = void 0;
	}
	if (nextGroupChannel) {
		patch.groupChannel = nextGroupChannel;
		patch.subject = void 0;
	}
	if (space) patch.space = space;
	if (topicName) patch.topicName = topicName;
	const displayName = buildGroupDisplayName({
		provider: resolution.channel,
		subject: nextSubject ?? (nextGroupChannel ? void 0 : existing?.subject),
		topicName: topicName ?? existing?.topicName,
		groupChannel: nextGroupChannel ?? (nextSubject ? void 0 : existing?.groupChannel),
		space: space ?? existing?.space,
		id: resolution.id,
		key: sessionKey
	});
	if (displayName) patch.displayName = displayName;
	return patch;
}
function projectSessionMetaPatch(params) {
	const { origin, internalTurn } = params.prepared;
	const groupPatch = projectGroupSessionPatch(params.prepared.group, params.existing, params.sessionKey);
	if (!groupPatch && !origin) return null;
	const existingOrigin = sessionDeliveryOrigin(params.existing);
	const nextProvider = origin?.provider;
	const nextOwnsExternalRoute = Boolean(nextProvider && nextProvider !== "webchat" && !isInternalNonDeliveryChannel(nextProvider));
	if (existingOrigin && internalTurn) {
		const existingContext = normalizeDeliveryContext({
			channel: existingOrigin.provider,
			to: existingOrigin.to,
			accountId: existingOrigin.accountId,
			threadId: existingOrigin.threadId
		});
		const nextContext = mergeDeliveryContext({
			channel: nextProvider,
			to: origin?.to,
			accountId: origin?.accountId,
			threadId: origin?.threadId
		}, existingContext);
		if (!nextOwnsExternalRoute || existingContext && deliveryContextKey(nextContext) === deliveryContextKey(existingContext)) return null;
	}
	const patch = groupPatch ? { ...groupPatch } : {};
	const mergedOrigin = mergeSessionOrigin(existingOrigin, origin);
	if (origin && mergedOrigin && params.prepared.clearAvatar) delete mergedOrigin.avatar;
	if (mergedOrigin) {
		if (!patch.chatType && mergedOrigin.chatType) patch.chatType = mergedOrigin.chatType;
		const existingRoute = sessionDeliveryRoute(params.existing);
		const existingRouteAccountId = existingRoute?.accountId ?? deliveryContextFromSession(params.existing)?.accountId;
		const freshRouteOwnsNextProvider = params.preserveExistingDeliveryRoute === true && nextProvider != null && existingRoute?.channel === nextProvider && (origin?.accountId == null || existingRouteAccountId === origin.accountId);
		const deliveryIdentityChanged = Boolean(nextProvider) && !freshRouteOwnsNextProvider && hasExternalOriginChange(existingOrigin, origin);
		patch.delivery = normalizeSessionDeliveryState({
			route: deliveryIdentityChanged ? void 0 : sessionDeliveryRoute(params.existing),
			context: deliveryIdentityChanged ? {
				channel: mergedOrigin.provider,
				to: mergedOrigin.to,
				accountId: mergedOrigin.accountId,
				threadId: mergedOrigin.threadId
			} : deliveryContextFromSession(params.existing),
			origin: mergedOrigin
		});
	}
	return Object.keys(patch).length > 0 ? patch : null;
}
function withoutThread(identity) {
	if (!identity || identity.threadId == null) return identity;
	const next = { ...identity };
	delete next.threadId;
	return next;
}
function projectLastRoutePatch(params) {
	const { channel, to, accountId, threadId, existing } = params;
	const explicitContext = normalizeDeliveryContext(params.deliveryContext);
	const inlineContext = normalizeDeliveryContext({
		channel,
		to,
		accountId,
		threadId
	});
	const routeContext = deliveryContextFromChannelRoute(params.route);
	const mergedInput = mergeDeliveryContext(routeContext, mergeDeliveryContext(explicitContext, inlineContext));
	const explicitDeliveryContext = params.deliveryContext;
	const explicitThreadValue = (explicitDeliveryContext != null && Object.hasOwn(explicitDeliveryContext, "threadId") ? explicitDeliveryContext.threadId : void 0) ?? (threadId != null && threadId !== "" ? threadId : void 0);
	const clearThreadFromFallback = Boolean(routeContext?.channel || routeContext?.to || explicitContext?.channel || explicitContext?.to || inlineContext?.channel || inlineContext?.to) && explicitThreadValue == null;
	const fallbackContext = clearThreadFromFallback ? withoutThread(deliveryContextFromSession(existing)) : deliveryContextFromSession(existing);
	const existingOrigin = sessionDeliveryOrigin(existing);
	const fallbackOrigin = clearThreadFromFallback ? withoutThread(existingOrigin) : existingOrigin;
	const delivery = normalizeSessionDeliveryState({
		route: params.route,
		context: mergeDeliveryContext(mergedInput, fallbackContext),
		origin: fallbackOrigin
	});
	const nextEntry = {
		...existing,
		delivery
	};
	const metaPatch = params.metadata ? projectSessionMetaPatch({
		prepared: params.metadata,
		sessionKey: params.sessionKey,
		existing: nextEntry,
		preserveExistingDeliveryRoute: routeContext != null
	}) : null;
	const basePatch = { delivery };
	return metaPatch ? {
		...basePatch,
		...metaPatch
	} : basePatch;
}
//#endregion
//#region src/config/sessions/observer-digest.ts
function resolveSessionObserverDigestForLifecycle(digest, lifecycle) {
	if (!digest || !lifecycle || digest.sessionId !== void 0 && digest.sessionId !== lifecycle.sessionId || (digest.sessionId !== void 0 || digest.lifecycleRevision !== void 0) && digest.lifecycleRevision !== lifecycle.lifecycleRevision) return;
	return {
		...digest,
		...lifecycle.sessionId ? { sessionId: lifecycle.sessionId } : {},
		...lifecycle.lifecycleRevision ? { lifecycleRevision: lifecycle.lifecycleRevision } : {}
	};
}
//#endregion
//#region src/config/sessions/session-entry-projection.ts
const SESSION_ENTRY_PRIVATE_CLEAR_PATCH = {
	activeWriterRunId: void 0,
	lastRunId: void 0,
	lifecycleRunId: void 0,
	mainRestartRecovery: void 0,
	restartRecoveryOperatorSource: void 0,
	pendingProjectGitUrl: void 0,
	pendingWorktree: void 0,
	sessionDiffBaselineCapture: void 0,
	transcriptByteCompactionLatch: void 0
};
const PRIVATE_SESSION_ENTRY_KEYS = [
	"inheritedGitContributorProfileIds",
	"profileInvolvement",
	"cliHistoryBoundary",
	"publicShare",
	"activeWriterRunId",
	"lastRunId",
	"lifecycleRunId",
	"mainRestartRecovery",
	"restartRecoveryOperatorSource",
	"pendingProjectGitUrl",
	"pendingWorktree",
	"sessionDiffBaselineCapture",
	"transcriptByteCompactionLatch"
];
function stripPrivateSessionEntryFields(entry) {
	const projected = { ...entry };
	for (const key of PRIVATE_SESSION_ENTRY_KEYS) delete projected[key];
	delete projected.thinkingLevelSelection;
	delete projected.compactionCheckpoints;
	if (entry.modelFallback) {
		const { prevThinkingLevelSelection: _privateSelection, ...modelFallback } = entry.modelFallback;
		projected.modelFallback = modelFallback;
	} else delete projected.modelFallback;
	return projected;
}
function projectPublicSessionEntry(entry) {
	return stripPrivateSessionEntryFields(entry);
}
function projectPublicSessionEntryPatch(patch) {
	return stripPrivateSessionEntryFields(patch);
}
const COMPACTION_RUN_USAGE_CLEAR_PATCH = {
	usageReport: void 0,
	inputTokens: void 0,
	outputTokens: void 0,
	cacheRead: void 0,
	cacheWrite: void 0,
	estimatedCostUsd: void 0
};
function projectCompactionAccountingPatch(current, params) {
	const incrementBy = Math.max(0, params.amount ?? 1);
	const tokensAfter = typeof params.tokensAfter === "number" && Number.isFinite(params.tokensAfter) && params.tokensAfter >= 0 ? Math.floor(params.tokensAfter) : void 0;
	const patch = {
		compactionCount: (current.compactionCount ?? 0) + incrementBy,
		updatedAt: params.now ?? Date.now(),
		...params.transcriptByteCompactionLatch !== void 0 ? { transcriptByteCompactionLatch: params.transcriptByteCompactionLatch ?? void 0 } : {},
		...incrementBy > 0 || tokensAfter !== void 0 ? COMPACTION_RUN_USAGE_CLEAR_PATCH : {},
		...incrementBy > 0 ? { contextBudgetStatus: void 0 } : {}
	};
	if (params.compactionKind === "context-engine") clearAllCliSessions(patch);
	if (tokensAfter !== void 0) Object.assign(patch, {
		totalTokens: tokensAfter,
		totalTokensFresh: true,
		totalTokensVersion: 1
	});
	else if (incrementBy > 0) {
		patch.totalTokensFresh = false;
		patch.totalTokensVersion = void 0;
	}
	return patch;
}
//#endregion
//#region src/agents/main-session-recovery/main-session-recovery-clear.ts
function removeMainSessionRecoveryForegroundClaim(claims, claimId) {
	const tokens = claims.tokens.filter((token) => token !== claimId);
	if (tokens.length === 0) return;
	const runIdsByClaimId = Object.fromEntries(Object.entries(claims.runIdsByClaimId ?? {}).filter(([token]) => token !== claimId));
	return {
		lifecycleGeneration: claims.lifecycleGeneration,
		tokens,
		...Object.keys(runIdsByClaimId).length > 0 ? { runIdsByClaimId } : {}
	};
}
const MAIN_SESSION_RECOVERY_CLEAR_PATCH = {
	abortedLastRun: false,
	restartRecoveryRuns: void 0,
	mainRestartRecovery: void 0
};
function buildMainSessionRecoveryClearPatch(entry) {
	if (entry?.abortedLastRun !== true && entry?.restartRecoveryRuns === void 0 && entry?.mainRestartRecovery === void 0) return {};
	return MAIN_SESSION_RECOVERY_CLEAR_PATCH;
}
function buildMainSessionRecoverySettlementPatch(params) {
	return {
		...buildRestartRecoveryClaimCleanupPatch(params),
		...params.clearRecoveryState === false ? {} : buildMainSessionRecoveryClearPatch(params.entry)
	};
}
function buildMainSessionRecoveryAfterAgentRunPatch(entry, clearForceSafeTools) {
	if (entry.abortedLastRun === true) return {};
	return {
		...clearForceSafeTools ? { restartRecoveryForceSafeTools: void 0 } : {},
		...entry.mainRestartRecovery?.foregroundClaims ? {} : buildMainSessionRecoveryClearPatch(entry)
	};
}
//#endregion
//#region src/config/sessions/session-entry-public-patch.ts
function generationValidPrivateFieldsForSameSession(existingEntry, nextSessionId, nextLifecycleRevision) {
	if (!existingEntry || existingEntry.sessionId !== nextSessionId || existingEntry.lifecycleRevision !== nextLifecycleRevision) return;
	const state = {
		...existingEntry.cliHistoryBoundary ? { cliHistoryBoundary: existingEntry.cliHistoryBoundary } : {},
		...existingEntry.activeWriterRunId !== void 0 ? { activeWriterRunId: existingEntry.activeWriterRunId } : {},
		...existingEntry.lifecycleRunId !== void 0 ? { lifecycleRunId: existingEntry.lifecycleRunId } : {},
		...existingEntry.pendingProjectGitUrl !== void 0 ? { pendingProjectGitUrl: existingEntry.pendingProjectGitUrl } : {},
		...existingEntry.transcriptByteCompactionLatch ? { transcriptByteCompactionLatch: existingEntry.transcriptByteCompactionLatch } : {},
		...existingEntry.sessionDiffBaselineCapture ? { sessionDiffBaselineCapture: existingEntry.sessionDiffBaselineCapture } : {},
		...existingEntry.mainRestartRecovery ? {
			abortedLastRun: existingEntry.abortedLastRun,
			restartRecoveryRuns: existingEntry.restartRecoveryRuns,
			mainRestartRecovery: existingEntry.mainRestartRecovery
		} : {}
	};
	return Object.keys(state).length > 0 ? state : void 0;
}
function clearGenerationPrivateFieldsForRotatedSessionPatch(existingEntry, publicPatch) {
	return Object.hasOwn(publicPatch, "sessionId") && publicPatch.sessionId !== existingEntry.sessionId || Object.hasOwn(publicPatch, "lifecycleRevision") && publicPatch.lifecycleRevision !== existingEntry.lifecycleRevision ? {
		...publicPatch,
		...SESSION_ENTRY_PRIVATE_CLEAR_PATCH,
		...MAIN_SESSION_RECOVERY_CLEAR_PATCH
	} : publicPatch;
}
function preserveGenerationPrivateFields(persistedEntry, publicPatch) {
	const privateFields = generationValidPrivateFieldsForSameSession(persistedEntry, Object.hasOwn(publicPatch, "sessionId") ? publicPatch.sessionId : persistedEntry.sessionId, Object.hasOwn(publicPatch, "lifecycleRevision") ? publicPatch.lifecycleRevision : persistedEntry.lifecycleRevision);
	return privateFields ? {
		...publicPatch,
		...!Object.hasOwn(publicPatch, "lifecycleRevision") && persistedEntry.lifecycleRevision !== void 0 ? { lifecycleRevision: persistedEntry.lifecycleRevision } : {},
		...privateFields
	} : clearGenerationPrivateFieldsForRotatedSessionPatch(persistedEntry, publicPatch);
}
//#endregion
//#region src/config/sessions/session-entry-usage.ts
/** Both CLI and reply finalizers publish the same latest-run billing snapshot. */
function projectSessionUsageSnapshot(usage, estimatedCostUsd, lastCallUsage = usage) {
	if (usage?.usageReport?.state === "unavailable") return {
		usageReport: usage.usageReport,
		inputTokens: void 0,
		outputTokens: void 0,
		cacheRead: void 0,
		cacheWrite: void 0,
		estimatedCostUsd: void 0,
		totalTokens: void 0,
		totalTokensFresh: false,
		totalTokensVersion: void 0
	};
	if (!hasBillableUsage(usage)) return {};
	return {
		usageReport: usage.usageReport,
		...usage.usageReport?.state === "available" || hasNonzeroUsage(usage) ? {
			inputTokens: usage.input ?? 0,
			outputTokens: usage.output ?? 0,
			cacheRead: lastCallUsage?.cacheRead ?? 0,
			cacheWrite: lastCallUsage?.cacheWrite ?? 0
		} : {},
		estimatedCostUsd
	};
}
/** Apply prepared billing facts to the transaction's current context and Goal state. */
function projectSessionEntryUsageUpdate(entry, update, updatedAt = Date.now()) {
	const resolvedContextTokens = update.preserveSessionModelState ? entry.contextTokens : update.contextTokensUsed ?? entry.contextTokens;
	const totalTokens = update.hasCurrentContextSnapshot ? update.currentContextTokens : update.hasFreshContextSnapshot ? deriveSessionTotalTokens({
		lastCallUsage: update.lastCallUsage,
		contextTokens: resolvedContextTokens,
		promptTokens: update.promptTokens
	}) : void 0;
	const patch = {
		modelProvider: update.preserveSessionModelState ? entry.modelProvider : update.modelSelection.provider ?? entry.modelProvider,
		model: update.preserveSessionModelState ? entry.model : update.modelSelection.model ?? entry.model,
		...!update.preserveSessionModelState ? {
			agentHarnessId: update.agentHarnessId,
			contextTokensSource: update.contextTokensSource,
			contextBudgetStatus: update.contextBudgetStatus
		} : {},
		...resolvedContextTokens !== void 0 ? { contextTokens: resolvedContextTokens } : {},
		systemPromptReport: update.preserveUserFacingRunState ? entry.systemPromptReport : update.systemPromptReport ?? entry.systemPromptReport,
		updatedAt
	};
	if (!update.preserveUserFacingRunState) Object.assign(patch, projectSessionUsageSnapshot(update.usage, update.estimatedCostUsd, update.lastCallUsage));
	if (totalTokens !== void 0 && !update.preserveUserFacingRunState) {
		patch.totalTokens = totalTokens;
		patch.totalTokensFresh = true;
		patch.totalTokensVersion = 1;
		const accountedGoal = accountSessionGoalUsage({
			...entry,
			...patch
		}, updatedAt);
		if (accountedGoal) patch.goal = accountedGoal;
	} else if (!update.preserveUserFacingRunState && update.hasContextUpdate && (update.hasCurrentContextSnapshot || update.preserveFreshTotalTokensOnStaleUsage !== true || entry.totalTokensFresh !== true)) {
		patch.totalTokensFresh = false;
		patch.totalTokensVersion = void 0;
	}
	return patch;
}
//#endregion
//#region src/config/sessions/session-entry-patch-operation.ts
/** Each reducer observes its predecessor's postimage; callers persist only the result. */
function projectSessionEntryPatch(params) {
	const operations = params.operation.kind === "compound" ? params.operation.operations : [params.operation];
	let existing = params.existing;
	let writeBase = params.writeBase;
	let next;
	for (const operation of operations) {
		const patch = reduceSessionEntryPatch(operation, writeBase, existing);
		if (patch === null) continue;
		next = mergeSessionEntryPatch({
			...params,
			existing,
			writeBase,
			patch
		});
		if (next) existing = writeBase = next;
	}
	return next;
}
/** Shared by the actor and its retained native/SDK patch adapter. */
function reduceSessionBookkeeping(entry, reducer) {
	switch (reducer.kind) {
		case "activity": return entry.updatedAt === 0 ? null : { updatedAt: Math.max(entry.updatedAt, reducer.updatedAt) };
		case "usage": return projectSessionEntryUsageUpdate(entry, reducer.update, reducer.updatedAt);
		case "group-intro": return { groupActivationNeedsSystemIntro: reducer.needsSystemIntro };
		case "fallback-notice": return { fallbackNotice: structuredClone(reducer.notice) };
		case "live-model":
			for (const key of Object.keys(reducer.expected)) if (entry[key] !== reducer.expected[key]) return null;
			return {
				...reducer.next,
				...reducer.clearPending ? { liveModelSwitchPending: void 0 } : {}
			};
	}
	return reducer;
}
function reduceSessionEntryPatch(operation, entry, existingEntry) {
	const expected = operation.expected;
	const expectedEntry = operation.kind === "public-fields" ? existingEntry : entry;
	if (expected === null && existingEntry !== void 0 || expected && (!expectedEntry || expectedEntry.sessionId !== expected.sessionId || Object.hasOwn(expected, "lifecycleRevision") && expectedEntry.lifecycleRevision !== expected.lifecycleRevision || Object.hasOwn(expected, "activeWriterRunId") && expectedEntry.activeWriterRunId !== expected.activeWriterRunId)) {
		if (operation.kind === "public-fields") throw new Error("Session entry changed before the conditional patch committed");
		return null;
	}
	switch (operation.kind) {
		case "inbound-metadata": {
			const patch = projectSessionMetaPatch({
				prepared: operation.metadata,
				existing: existingEntry,
				sessionKey: operation.sessionKey
			});
			return existingEntry ? patch : {
				...operation.creation,
				...patch
			};
		}
		case "last-route": {
			const patch = projectLastRoutePatch({
				...operation.route,
				existing: existingEntry
			});
			return existingEntry ? patch : {
				...operation.creation,
				...patch
			};
		}
		case "ensure-identity": return existingEntry?.sessionId ? null : existingEntry ? { sessionId: operation.sessionId } : {
			...operation.creation,
			sessionId: operation.sessionId
		};
		case "fields": return operation.patch;
		case "public-fields": return preserveGenerationPrivateFields(entry, operation.patch);
		case "observer-digest": {
			const { digest, sessionId } = operation;
			const hasSessionIdentity = sessionId !== void 0 || digest.sessionId !== void 0;
			if (sessionId !== void 0 && entry.sessionId !== sessionId || digest.sessionId !== void 0 && entry.sessionId !== digest.sessionId || (hasSessionIdentity || digest.lifecycleRevision !== void 0) && entry.lifecycleRevision !== digest.lifecycleRevision || (resolveSessionObserverDigestForLifecycle(entry.observerDigest, entry)?.revision ?? 0) >= digest.revision) return null;
			return { observerDigest: digest };
		}
		case "activity-summary": {
			const { summary } = operation;
			return entry.initializationPending || isSubagentSessionRow(operation.sessionKey, entry) || entry.sessionId !== summary.sessionId || entry.lifecycleRevision !== summary.lifecycleRevision ? null : { activitySummary: summary };
		}
		case "ambient-transcript-watermark": return projectAmbientTranscriptWatermark(entry, operation.watermark);
		case "compaction-accounting": return projectCompactionAccountingPatch(entry, operation.accounting);
		case "pending-final-clear": {
			const recoveryRunId = normalizeOptionalString(entry.restartRecoveryDeliveryRunId);
			const deliveries = entry.pendingFinalDelivery?.deliveries;
			if (entry.sessionId !== operation.sessionId || entry.pendingFinalDelivery?.intentId !== operation.intentId || !deliveries?.length || !deliveries.every(({ state }) => state === "delivered" || state === "suppressed") || recoveryRunId !== void 0 && recoveryRunId !== operation.recoveryRunId) return null;
			const completesHookTurn = recoveryRunId === void 0 && (entry.restartRecoveryBeforeAgentReplyState === "handled-reply" || entry.restartRecoveryBeforeAgentReplyState === "handled-unrecoverable");
			return {
				...recoveryRunId ? buildRestartRecoveryClaimCleanupPatch({
					entry,
					recordTerminalSource: true
				}) : {
					restartRecoveryBeforeAgentReplyState: void 0,
					restartRecoverySourceIngress: void 0,
					restartRecoveryOperatorSource: void 0,
					restartRecoveryForceSafeTools: void 0
				},
				pendingFinalDelivery: void 0,
				...completesHookTurn ? {
					abortedLastRun: false,
					endedAt: operation.now,
					lifecycleRunId: void 0,
					runtimeMs: typeof entry.startedAt === "number" ? Math.max(0, operation.now - entry.startedAt) : void 0,
					status: "done"
				} : {}
			};
		}
		case "restart-safe-terminal": return entry.restartRecoveryDeliveryRunId === operation.runId ? {
			...operation.patch,
			...!operation.retryable ? buildRestartRecoveryClaimCleanupPatch({
				entry,
				recordTerminalSource: true,
				terminalSourceRunId: entry.restartRecoveryDeliverySourceRunId
			}) : {}
		} : null;
		case "restart-claim-clear": {
			const isExecutionFence = (run) => run.runId === operation.executionRunId && run.lifecycleGeneration === operation.executionGeneration;
			const ownsClaim = entry.restartRecoveryDeliveryRunId !== void 0 ? entry.restartRecoveryDeliveryRunId === operation.recoveryRunId && normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) === operation.recoverySourceRunId : entry.restartRecoveryRuns?.some(isExecutionFence) === true;
			if (entry.sessionId !== operation.sessionId || entry.abortedLastRun === true && entry.mainRestartRecovery !== void 0 || !ownsClaim) return null;
			const terminalPending = entry.restartRecoveryDeliveryReceiptState === "terminal-pending";
			const preservesPendingFinal = !terminalPending && entry.pendingFinalDelivery !== void 0;
			const completesHandledSilent = entry.restartRecoveryBeforeAgentReplyState === "handled-silent" && !preservesPendingFinal;
			const endedAt = terminalPending || completesHandledSilent ? Date.now() : void 0;
			const remainingRuns = entry.restartRecoveryRuns?.filter((run) => !isExecutionFence(run));
			return {
				...buildRestartRecoveryClaimCleanupPatch({
					entry,
					recordTerminalSource: true,
					terminalSourceRunId: operation.recoverySourceRunId,
					terminalRunId: entry.restartRecoveryDeliveryRunId ? void 0 : operation.executionRunId
				}),
				restartRecoveryRuns: remainingRuns?.length ? remainingRuns : void 0,
				...terminalPending ? { pendingFinalDelivery: void 0 } : {},
				...preservesPendingFinal ? {
					restartRecoveryBeforeAgentReplyState: entry.restartRecoveryBeforeAgentReplyState,
					restartRecoverySourceIngress: entry.restartRecoverySourceIngress,
					restartRecoveryForceSafeTools: entry.restartRecoveryForceSafeTools
				} : {},
				...endedAt !== void 0 ? {
					abortedLastRun: terminalPending,
					endedAt,
					lifecycleRunId: void 0,
					runtimeMs: typeof entry.startedAt === "number" ? Math.max(0, endedAt - entry.startedAt) : void 0,
					status: terminalPending ? "failed" : "done"
				} : {},
				updatedAt: endedAt ?? Date.now()
			};
		}
	}
	return operation;
}
function mergeSessionEntryPatch(params) {
	const { existing, writeBase, patch, sessionKey } = params;
	const creationPatch = !existing && patch ? {
		...writeBase,
		...patch
	} : patch;
	if (!creationPatch) return;
	if (params.replaceEntry) return structuredClone(patch);
	const merged = params.preserveActivity ? mergeSessionEntryPreserveActivity(existing, creationPatch) : mergeSessionEntry(existing, creationPatch);
	return preserveSqliteSameKeySessionRolloverLineage({
		next: merged,
		previous: writeBase,
		sessionKey
	});
}
//#endregion
//#region src/config/sessions/transcript-replay.ts
/** Tail kept so DM continuity survives silent session rotations. */
const DEFAULT_REPLAY_MAX_MESSAGES = 6;
function isValidReplayTimestamp(value) {
	if (typeof value === "number") return Number.isFinite(value);
	return typeof value === "string" && value.trim().length > 0;
}
function replayableTranscriptRole(record) {
	if (!record || record.type !== "message" || typeof record.id !== "string" || record.id.trim().length === 0 || !isValidReplayTimestamp(record.timestamp) || !(record.parentId === null || record.parentId === void 0 || typeof record.parentId === "string")) return;
	const role = record.message?.role;
	return role === "user" || role === "assistant" ? role : void 0;
}
function selectRecentUserAssistantReplayRecords(records) {
	const kept = [];
	for (const record of records) {
		const role = replayableTranscriptRole(record);
		if (role) kept.push({
			role,
			record
		});
	}
	let startIdx = Math.max(0, kept.length - DEFAULT_REPLAY_MAX_MESSAGES);
	while (startIdx < kept.length && kept[startIdx]?.role === "assistant") startIdx += 1;
	const tail = [];
	for (const entry of kept.slice(startIdx)) {
		const lastIdx = tail.length - 1;
		if (lastIdx >= 0 && tail[lastIdx]?.role === entry.role) {
			tail[lastIdx] = entry;
			continue;
		}
		tail.push(entry);
	}
	return tail.map((entry) => entry.record);
}
//#endregion
//#region src/config/sessions/session-reset-boundary-event.ts
function recordId(record) {
	return readNonBlankString(asOptionalRecord(record)?.id);
}
function uniqueBoundaryId(records) {
	const ids = new Set(records.flatMap((record) => recordId(record) ? [recordId(record)] : []));
	for (;;) {
		const id = randomUUID().slice(0, 8);
		if (!ids.has(id)) return id;
	}
}
function createSessionResetBoundaryId() {
	return randomUUID();
}
function projectLatestBoundaryWindow(entries) {
	const boundaryIndex = entries.findLastIndex((entry) => {
		const type = asOptionalRecord(entry)?.type;
		return type === "compaction" || type === "reset";
	});
	if (boundaryIndex < 0) return [...entries];
	const boundary = entries[boundaryIndex];
	const firstKeptIndex = typeof boundary.firstKeptEntryId === "string" ? entries.findIndex((entry, index) => index < boundaryIndex && recordId(entry) === boundary.firstKeptEntryId) : -1;
	return [...firstKeptIndex < 0 ? [] : entries.slice(firstKeptIndex, boundaryIndex).filter((entry) => {
		const role = entry?.message?.role;
		return role === "user" || role === "assistant";
	}), ...entries.slice(boundaryIndex + 1)];
}
function buildSessionResetBoundaryEvent(params) {
	const entries = params.events.filter((event) => isRecord(event) && event.type !== "session");
	const activeEntries = selectSessionTranscriptLeafControlledPath(entries) ?? entries;
	const firstKeptEntryId = recordId((params.context === "preserve-tail" ? selectRecentUserAssistantReplayRecords(projectLatestBoundaryWindow(activeEntries)) : [])[0]);
	const boundaryId = params.boundaryId?.trim() || uniqueBoundaryId(params.events);
	if (params.events.some((event) => recordId(event) === boundaryId)) throw new Error(`Reset boundary ID already exists: ${boundaryId}`);
	return {
		type: "reset",
		id: boundaryId,
		parentId: recordId(activeEntries.at(-1)) ?? null,
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		reason: params.reason,
		...firstKeptEntryId ? { firstKeptEntryId } : {}
	};
}
//#endregion
//#region src/config/sessions/session-actor-memory-entry.ts
function projectEntry(entry, projection) {
	return attachSessionEntrySnapshots({ ...entry }, {}, projection);
}
function readSessionActorMemoryEntryQuery(context, query) {
	switch (query.type) {
		case "session.lifecycle.artifacts": return planMemoryLifecycleArtifacts(context, query.input);
		case "session.entry.creation": return {
			existingEntry: context.state.hot.entry,
			targetEntry: context.state.hot.entry,
			labelInUse: Boolean(query.input.label && [...context.entries()].some(([key, state]) => key !== context.state.hot.target.sessionKey && state.hot.entry?.label === query.input.label))
		};
		case "session.entry.read": {
			const entry = query.input.sessionKey ? context.get(query.input.sessionKey)?.hot.entry : context.state.hot.entry;
			return entry && projectEntry(entry, query.input.projection);
		}
		case "session.entry.readById":
			for (const [sessionKey, state] of context.entries()) {
				const entry = state.hot.entry?.sessionId === query.input.sessionId ? state.hot.entry : query.input.currentOnly ? void 0 : state.historicalWindows.get(query.input.sessionId)?.hot.entry;
				if (entry) {
					context.get(sessionKey);
					return {
						sessionKey,
						entry: projectEntry(entry, query.input.projection)
					};
				}
			}
			return;
		case "session.entries.read": {
			const selected = query.input.sessionKeys && new Set(query.input.sessionKeys);
			return [...context.entries()].flatMap(([sessionKey, state]) => {
				if (!state.hot.entry) return [];
				if (selected && !selected.has(sessionKey) && !(query.input.includeSessionWindowOwner && (state.hot.entry.sessionId === query.input.includeSessionWindowOwner || state.historicalWindows.has(query.input.includeSessionWindowOwner))) && !(query.input.includeLabelOwners && state.hot.entry.label === query.input.includeLabelOwners)) return [];
				context.get(sessionKey);
				return [{
					sessionKey,
					entry: projectEntry(state.hot.entry, query.input.projection)
				}];
			});
		}
	}
	throw new Error("Unknown memory entry query");
}
function requireExpectedEntry(actual, expected, operation) {
	if (!isDeepStrictEqual(actual, expected)) throw new SqliteSessionMutationConflictError(operation);
}
function executeSessionActorMemoryEntryCommand(context, command) {
	const { state } = context;
	const sessionKey = state.hot.target.sessionKey;
	const install = (key, entry, options) => {
		const target = context.edit(key);
		const previous = target.hot.entry;
		const installed = installSessionActorMemoryEntry(target, entry, options);
		if (options?.observeConversation || options?.routeContext !== void 0) syncSessionActorMemoryConversations(target, context.editConversations(), previous, options.routeContext, options.observeConversation);
		return installed;
	};
	const maintain = (maintenance, activeSessionKey) => {
		if (maintenance && maintenance.config.mode !== "warn") {
			const store = {};
			for (const [key, current] of context.entries()) if (current.hot.entry) store[key] = { ...current.hot.entry };
			planSessionEntryMaintenance({
				maintenance: maintenance.config,
				initialUnarchivedCount: countUnarchivedSessionEntries(store),
				readPreserveKeys: () => resolveSessionMaintenancePreserveKeys({
					store,
					snapshot: maintenance.preservation,
					baseKeys: [activeSessionKey]
				}),
				readAgeCandidates: () => store,
				readCapCandidates: () => ({
					store,
					maxEntries: maintenance.config.maxEntries
				}),
				onArchived: ({ key, entry: archived }) => {
					install(key, archived);
				},
				onRemoved: ({ key }) => context.remove(key)
			});
		}
	};
	const replace = (replacement, consumePendingReset) => {
		requireExpectedEntry(context.get(replacement.sessionKey)?.hot.entry, replacement.expected, command.type);
		if (!replacement.entry) {
			context.remove(replacement.sessionKey);
			return;
		}
		const entry = install(replacement.sessionKey, {
			...replacement.entry,
			...replacement.label === void 0 ? {} : { label: replacement.label },
			...replacement.owner ? { owner: replacement.owner } : {}
		}, {
			routeContext: replacement.routeContext,
			consumePendingReset
		});
		if (replacement.transcriptEvents) {
			const target = context.edit(replacement.sessionKey);
			const events = createSessionActorMemoryEvents({
				...context,
				state: target
			});
			for (const event of replacement.transcriptEvents) events.writeEvent(event);
		}
		if (replacement.label && [...context.entries()].some(([key, value]) => key !== replacement.sessionKey && value.hot.entry?.label === replacement.label)) throw new Error(`Session label already exists: ${replacement.label}`);
		return entry;
	};
	switch (command.type) {
		case "session.entry.create": {
			const input = command.input;
			requireExpectedEntry(state.hot.entry, input.expected, command.type);
			const label = input.label ?? input.entry.label;
			if (label && [...context.entries()].some(([key, value]) => key !== sessionKey && value.hot.entry?.label === label)) {
				const error = /* @__PURE__ */ new Error(`label already in use: ${label}`);
				error.name = "SessionLabelConflictError";
				throw error;
			}
			install(sessionKey, {
				...input.entry,
				...label !== void 0 ? { label } : {},
				...input.owner ? { owner: input.owner } : {}
			}, { routeContext: input.routeContext });
			const events = createSessionActorMemoryEvents(context);
			for (const event of input.transcriptEvents ?? (state.events.length ? [] : [createSessionTranscriptHeader({
				sessionId: input.entry.sessionId,
				cwd: input.cwd
			})])) events.writeEvent(event);
			return state.hot.entry;
		}
		case "session.entry.patch": {
			if (command.input.prepareIf && !state.hot.entry?.liveModelSwitchPending) return;
			if (command.input.expected) requireExpectedEntry(state.hot.entry, command.input.expected.entry, command.type);
			if (!validateSessionActorMemoryEntryGuards(context, command.input.guards)) return;
			const writeBase = state.hot.entry ?? command.input.fallbackEntry;
			if (!writeBase) return;
			const next = projectSessionEntryPatch({
				existing: state.hot.entry,
				writeBase,
				sessionKey,
				operation: command.input.operation,
				preserveActivity: command.input.preserveActivity,
				replaceEntry: command.input.replaceEntry
			});
			const entry = next ? install(sessionKey, next, command.input) : state.hot.entry;
			maintain(command.input.maintenance, sessionKey);
			return entry;
		}
		case "session.entry.replace": return replace({
			...command.input,
			sessionKey
		});
		case "session.entry.replacements": {
			const removedSessionKeys = [];
			const updatedSessionKeys = [];
			for (const replacement of command.input.replacements) {
				replace(replacement, command.input.consumePendingReset);
				if (replacement.entry) updatedSessionKeys.push(replacement.sessionKey);
				else removedSessionKeys.push(replacement.sessionKey);
			}
			maintain(command.input.maintenance, command.input.maintenance?.activeSessionKey);
			return {
				removedSessionKeys,
				updatedSessionKeys
			};
		}
		case "session.lifecycle.reset": {
			const previousEntry = state.hot.entry;
			const input = command.input;
			requireExpectedEntry(previousEntry, input.expected, command.type);
			const writeBoundary = Boolean(input.resetBoundary && previousEntry && !isDeepStrictEqual(previousEntry, input.nextEntry));
			if (writeBoundary && input.resetBoundary && previousEntry) {
				const events = createSessionActorMemoryEvents(context);
				if (!state.events.length) events.writeEvent(createSessionTranscriptHeader({
					sessionId: previousEntry.sessionId,
					cwd: resolveResetBoundaryHeaderCwd(previousEntry, input.resetBoundary.cwd)
				}));
				events.writeEvent(buildSessionResetBoundaryEvent({
					...input.resetBoundary,
					events: state.events.map(({ event }) => event)
				}));
			}
			const progressCardReset = writeBoundary && input.resetBoundary?.context === "clear" && clearSessionActorProgressCardForReset(state);
			const nextEntry = install(sessionKey, input.nextEntry, {
				consumePendingReset: true,
				observeConversation: true,
				routeContext: input.routeContext
			});
			for (const replacement of input.relatedReplacements ?? []) replace(replacement);
			return {
				archivedTranscripts: [],
				previousEntry,
				previousSessionId: previousEntry?.sessionId,
				nextEntry,
				progressCardReset
			};
		}
		case "session.lifecycle.delete": {
			const entry = state.hot.entry;
			const input = command.input;
			if (input.expectedEntry !== void 0 && !isDeepStrictEqual(entry, input.expectedEntry) || input.expectedSessionId !== void 0 && (entry?.sessionId ?? null) !== input.expectedSessionId || input.expectedLifecycleRevision !== void 0 && entry?.lifecycleRevision !== input.expectedLifecycleRevision || input.expectedUpdatedAt !== void 0 && entry?.updatedAt !== input.expectedUpdatedAt) return {
				archivedTranscripts: [],
				deleted: false,
				expectedEntryMismatch: true
			};
			context.remove(sessionKey);
			return {
				archivedTranscripts: [],
				deleted: Boolean(entry),
				deletedEntry: entry,
				deletedSessionId: entry?.sessionId
			};
		}
		case "session.lifecycle.reclaim": {
			const countEntries = () => [...context.entries()].filter(([, value]) => value.hot.entry).length;
			const beforeCount = countEntries();
			const removedSessionKeys = [];
			const archivedSessionKeys = [];
			const eligible = command.input.artifacts && planMemoryLifecycleArtifacts(context, command.input.artifacts.input, new Map(command.input.entries.map((candidate) => [candidate.sessionKey, candidate.expected])));
			for (const candidate of command.input.entries) {
				const current = context.get(candidate.sessionKey);
				if (candidate.requiresMissingTranscript && current?.hot.entry && (shouldPreserveSessionCleanupEntry(candidate.sessionKey, current.hot.entry) || current.events.some(({ event }) => isRecord(event) && event.type === "message"))) continue;
				if (eligible ? eligible.entries.some((entry) => entry.sessionKey === candidate.sessionKey) : isDeepStrictEqual(current?.hot.entry, candidate.expected)) {
					context.remove(candidate.sessionKey);
					removedSessionKeys.push(candidate.sessionKey);
				}
			}
			for (const window of command.input.artifacts?.windows ?? []) if (eligible?.windows.some((candidate) => candidate.sessionKey === window.sessionKey && candidate.sessionId === window.sessionId)) context.edit(window.sessionKey).historicalWindows.delete(window.sessionId);
			for (const archive of command.input.archives ?? []) if (isDeepStrictEqual(context.get(archive.sessionKey)?.hot.entry, archive.expected)) {
				install(archive.sessionKey, archive.entry);
				archivedSessionKeys.push(archive.sessionKey);
			}
			return {
				removedSessionKeys,
				archivedSessionKeys,
				beforeCount,
				afterCount: countEntries()
			};
		}
	}
	throw new Error("Unknown memory entry command");
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-parent-fork.ts
const DEFAULT_PARENT_FORK_MAX_TOKENS = 1e5;
function planParentForkDecision(parentEntry, transcriptEstimate, options = {}) {
	const maxTokens = normalizePositiveTokenCount(options.maxTokens) ?? DEFAULT_PARENT_FORK_MAX_TOKENS;
	const parentTokens = options.preferTranscriptEstimate ? transcriptEstimate : normalizePositiveTokenCount(Math.max(resolveFreshSessionTotalTokens(parentEntry) ?? 0, transcriptEstimate ?? 0));
	if (typeof parentTokens === "number" && parentTokens > maxTokens) return {
		status: "skip",
		reason: "parent-too-large",
		maxTokens,
		parentTokens,
		message: `Parent context is too large to fork (${parentTokens}/${maxTokens} tokens); starting with isolated context instead.`
	};
	return {
		status: "fork",
		maxTokens,
		...typeof parentTokens === "number" ? { parentTokens } : {}
	};
}
function estimateParentForkPromptTokens(source) {
	if (!source) return;
	let byteEstimate = 0;
	let latestUsageEstimate;
	let trailingBytes = 0;
	for (const { event, context } of selectParentForkTokenEstimateEvents(source.branchEntries)) {
		if (context !== "reset-retained" && isRecord(event) && isRecord(event.message) && event.message.excludeFromContext === true) continue;
		let contextEvent = event;
		if (isRecord(event) && isRecord(event.message)) {
			const message = context !== "current" && isIndexedSessionEntry(event) && event.type === "message" && event.message.role === "assistant" ? stripCompactionReplayCheckpoint(event.message) : event.message;
			contextEvent = {
				...event,
				message: projectModelContextMessages([message])[0]
			};
		}
		const serializedBytes = Buffer.byteLength(JSON.stringify(contextEvent)) + 1;
		byteEstimate += serializedBytes;
		if (context !== "current" || !isRecord(event)) {
			if (latestUsageEstimate !== void 0) trailingBytes += serializedBytes;
			continue;
		}
		const message = isRecord(event.message) ? event.message : void 0;
		const usageRaw = isRecord(message?.usage) ? message.usage : isRecord(event.usage) ? event.usage : void 0;
		if (!usageRaw) {
			if (latestUsageEstimate !== void 0) trailingBytes += serializedBytes;
			continue;
		}
		const contextUsage = readTranscriptContextUsage(usageRaw);
		if (message?.api === "cli" && contextUsage === void 0 || contextUsage?.state === "unavailable") {
			latestUsageEstimate = void 0;
			trailingBytes = 0;
			continue;
		}
		if (contextUsage?.state === "available") {
			latestUsageEstimate = normalizePositiveTokenCount(contextUsage.totalTokens);
			trailingBytes = 0;
			continue;
		}
		const usage = normalizeUsage(usageRaw);
		const promptTokens = normalizePositiveTokenCount(derivePromptTokens({
			input: usage?.input,
			cacheRead: usage?.cacheRead,
			cacheWrite: usage?.cacheWrite
		}));
		const outputTokens = normalizePositiveTokenCount(usage?.output) ?? 0;
		const totalTokens = promptTokens === void 0 ? void 0 : normalizePositiveTokenCount(promptTokens + outputTokens);
		if (typeof totalTokens === "number") {
			latestUsageEstimate = totalTokens;
			trailingBytes = 0;
		}
	}
	if (latestUsageEstimate !== void 0) return normalizePositiveTokenCount(latestUsageEstimate + Math.ceil(trailingBytes / 4));
	return normalizePositiveTokenCount(Math.ceil(byteEstimate / 4));
}
function* selectParentForkTokenEstimateEvents(branch) {
	if (!branch.some((event) => isRecord(event) && (event.type === "compaction" || event.type === "reset"))) {
		for (const event of branch) yield {
			event,
			context: "current"
		};
		return;
	}
	const indexedEntries = branch.filter(isIndexedSessionEntry);
	const selected = Array.from(iterateSessionContextEntries(indexedEntries));
	const boundary = selected[0]?.entry;
	if (boundary?.type !== "compaction" && boundary?.type !== "reset") {
		for (const event of branch) yield {
			event,
			context: "current"
		};
		return;
	}
	const contexts = new Map(selected.map(({ entry, context }) => [entry.id, context]));
	const indexedIds = new Set(indexedEntries.map((entry) => entry.id));
	const boundaryIndex = branch.findIndex((entry) => isRecord(entry) && entry.id === boundary.id);
	for (const [index, event] of branch.entries()) {
		const context = isRecord(event) && typeof event.id === "string" ? contexts.get(event.id) : void 0;
		if (context) yield {
			event,
			context
		};
		else if (index > boundaryIndex && (!isRecord(event) || typeof event.id !== "string" || !indexedIds.has(event.id))) yield {
			event,
			context: "opaque"
		};
	}
}
function normalizePositiveTokenCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function readTranscriptContextUsage(usageRaw) {
	const contextUsage = usageRaw.contextUsage;
	if (!isRecord(contextUsage)) return;
	if (contextUsage.state === "unavailable") return { state: "unavailable" };
	if (contextUsage.state !== "available") return;
	const totalTokens = normalizePositiveTokenCount(contextUsage.totalTokens);
	return totalTokens === void 0 ? void 0 : {
		state: "available",
		totalTokens
	};
}
function resolveParentForkSourceTranscript(fileEntries, forkFrom) {
	if (fileEntries.length === 0) return null;
	const header = findSessionTranscriptHeader(fileEntries);
	const entries = fileEntries.filter((entry) => !(isRecord(entry) && entry.type === "session"));
	const tree = scanSessionTranscriptTree(entries);
	const visiblePath = selectSessionTranscriptTreePathNodes(tree, tree.leafId);
	const appendPath = selectSessionTranscriptTreePathNodes(tree, tree.appendParentId);
	const mergedPath = mergeSessionTranscriptVisiblePathWithOpaqueAppendPath({
		visiblePath,
		appendPath,
		appendParentId: tree.appendParentId
	});
	const visibleBranchEntries = normalizeSessionContextEntryBoundaries(mergedPath.nodes.flatMap((node) => {
		if (!isRecord(node.entry)) return [];
		const parentId = node.selectedParentId;
		return [node.entry.parentId === parentId ? node.entry : {
			...node.entry,
			parentId
		}];
	}), tree.nodes);
	let branchEntries = forkFrom === "last-completed" ? visibleBranchEntries.slice(0, findLastCompletedForkIndex(visibleBranchEntries) + 1) : visibleBranchEntries;
	if (forkFrom === "last-completed" && !hasAssistantHistory(branchEntries)) branchEntries = [];
	const pathEntryIds = new Set(branchEntries.flatMap((entry) => isRecord(entry) && typeof entry.id === "string" ? [entry.id] : []));
	const lastLeafUpdateNode = tree.nodes.findLast((node) => node.leafId !== void 0);
	const lastBranchEntry = branchEntries.at(-1);
	const lastBranchEntryId = isRecord(lastBranchEntry) && typeof lastBranchEntry.id === "string" ? lastBranchEntry.id : null;
	return {
		appendParentId: forkFrom === "last-completed" ? lastBranchEntryId : mergedPath.appendParentId,
		...forkFrom !== "last-completed" && lastLeafUpdateNode?.appendMode ? { appendMode: lastLeafUpdateNode.appendMode } : {},
		branchEntries,
		cwd: typeof header?.cwd === "string" ? header.cwd : void 0,
		version: header?.version ?? 3,
		labelsToWrite: entries.flatMap((entry) => isRecord(entry) && entry.type === "label" && typeof entry.label === "string" && typeof entry.targetId === "string" && typeof entry.id === "string" && !pathEntryIds.has(entry.id) && pathEntryIds.has(entry.targetId) && typeof entry.timestamp === "string" ? [{
			targetId: entry.targetId,
			label: entry.label,
			timestamp: entry.timestamp
		}] : []),
		leafId: forkFrom === "last-completed" ? lastBranchEntryId : tree.leafId,
		preserveLeafControl: forkFrom !== "last-completed" && isSessionTranscriptLeafControl(lastLeafUpdateNode?.entry)
	};
}
function findLastCompletedForkIndex(entries) {
	return entries.findLastIndex((entry) => {
		if (!isRecord(entry)) return false;
		if (entry.type === "reset") return true;
		const message = isRecord(entry.message) ? entry.message : void 0;
		return message?.role === "assistant" && message.stopReason !== "toolUse";
	});
}
function hasAssistantHistory(entries) {
	return entries.some((entry) => isRecord(entry) && entry.type === "message" && isRecord(entry.message) && entry.message.role === "assistant");
}
function generateEntryId(existingIds) {
	for (let attempt = 0; attempt < 100; attempt += 1) {
		const id = randomUUID().slice(0, 8);
		if (!existingIds.has(id)) {
			existingIds.add(id);
			return id;
		}
	}
	const id = randomUUID();
	existingIds.add(id);
	return id;
}
function buildForkedChildTranscriptEvents(params) {
	const keepHistory = params.source.preserveLeafControl || hasAssistantHistory(params.source.branchEntries);
	const header = {
		...createSessionTranscriptHeader({
			cwd: params.source.cwd,
			sessionId: params.targetSessionId,
			version: keepHistory ? params.source.version : void 0
		}),
		parentSession: params.parentSessionFile
	};
	if (!keepHistory) return [header];
	const pathEntryIds = new Set(params.source.branchEntries.flatMap((entry) => isRecord(entry) && typeof entry.id === "string" ? [entry.id] : []));
	const lastPathEntry = params.source.branchEntries.at(-1);
	let parentId = isRecord(lastPathEntry) && typeof lastPathEntry.id === "string" ? lastPathEntry.id : null;
	const labelEntries = params.source.labelsToWrite.map(({ targetId, label, timestamp }) => {
		const entry = {
			type: "label",
			id: generateEntryId(pathEntryIds),
			parentId,
			timestamp,
			targetId,
			label
		};
		parentId = entry.id;
		return entry;
	});
	const leafEntry = params.source.preserveLeafControl ? {
		type: "leaf",
		id: generateEntryId(pathEntryIds),
		parentId,
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		targetId: params.source.leafId,
		appendParentId: params.source.appendParentId,
		...params.source.appendMode ? { appendMode: params.source.appendMode } : {}
	} : null;
	return [
		header,
		...params.source.branchEntries,
		...labelEntries,
		...leafEntry ? [leafEntry] : []
	];
}
function resolveParentForkLimitDecision(params, source) {
	if (!params.enforceTokenLimit) return;
	const decision = planParentForkDecision(params.parentEntry, estimateParentForkPromptTokens(source), {
		maxTokens: params.maxTokens,
		preferTranscriptEstimate: params.forkFrom === "last-completed"
	});
	return decision.status === "skip" ? decision : void 0;
}
//#endregion
//#region src/config/sessions/session-entry-selection.ts
var SessionLabelOwnerIndex = class {
	#owners = /* @__PURE__ */ new Map();
	constructor(store) {
		this.store = store;
		for (const [sessionKey, entry] of Object.entries(this.store)) this.#add(sessionKey, entry.label);
	}
	isLabelInUse(label, excludedKeys) {
		for (const sessionKey of this.#owners.get(label) ?? []) if (!excludedKeys.includes(sessionKey)) return true;
		return false;
	}
	replaceEntry(candidateKeys, primaryKey, entry) {
		for (const sessionKey of /* @__PURE__ */ new Set([...candidateKeys, primaryKey])) {
			const label = this.store[sessionKey]?.label;
			if (label !== void 0) this.#owners.get(label)?.delete(sessionKey);
			delete this.store[sessionKey];
		}
		const cloned = structuredClone(entry);
		this.store[primaryKey] = cloned;
		this.#add(primaryKey, cloned.label);
		return cloned;
	}
	#add(sessionKey, label) {
		if (label === void 0) return;
		const owners = this.#owners.get(label) ?? /* @__PURE__ */ new Set();
		owners.add(sessionKey);
		this.#owners.set(label, owners);
	}
};
function selectSessionModelOverride(entry) {
	return {
		modelOverride: entry.modelOverride,
		providerOverride: entry.providerOverride,
		modelOverrideSource: entry.modelOverrideSource,
		modelOverrideRouteResolution: entry.modelOverrideRouteResolution,
		agentRuntimeOverride: entry.agentRuntimeOverride
	};
}
/** Carries only user/runtime selection into a new dashboard fork. */
function inheritSessionSelection(parentEntry) {
	if (!parentEntry) return {};
	const authProfileOverrideSource = resolveSessionAuthProfileOverrideSource(parentEntry);
	const inheritModelSelection = !hasSessionActiveAutoModelFallback(parentEntry);
	const inheritAuthProfile = inheritModelSelection || authProfileOverrideSource === "user" || authProfileOverrideSource === "user-link";
	return {
		...inheritModelSelection && parentEntry.providerOverride ? { providerOverride: parentEntry.providerOverride } : {},
		...inheritModelSelection && parentEntry.modelOverride ? { modelOverride: parentEntry.modelOverride } : {},
		...inheritModelSelection && parentEntry.modelOverrideSource ? { modelOverrideSource: parentEntry.modelOverrideSource } : {},
		...inheritModelSelection && parentEntry.modelOverrideRouteResolution ? { modelOverrideRouteResolution: parentEntry.modelOverrideRouteResolution } : {},
		...inheritModelSelection && parentEntry.agentRuntimeOverride ? { agentRuntimeOverride: parentEntry.agentRuntimeOverride } : {},
		...parentEntry.contextWindow ? { contextWindow: parentEntry.contextWindow } : {},
		...parentEntry.thinkingLevel ? { thinkingLevel: parentEntry.thinkingLevel } : {},
		...parentEntry.fastMode !== void 0 ? { fastMode: parentEntry.fastMode } : {},
		...parentEntry.toolOverrides ? { toolOverrides: parentEntry.toolOverrides } : {},
		...parentEntry.verboseLevel ? { verboseLevel: parentEntry.verboseLevel } : {},
		...parentEntry.traceLevel ? { traceLevel: parentEntry.traceLevel } : {},
		...parentEntry.reasoningLevel ? { reasoningLevel: parentEntry.reasoningLevel } : {},
		...parentEntry.elevatedLevel ? { elevatedLevel: parentEntry.elevatedLevel } : {},
		...inheritAuthProfile && authProfileOverrideSource && parentEntry.authProfileOverride ? { authProfileOverride: parentEntry.authProfileOverride } : {},
		...inheritAuthProfile && authProfileOverrideSource ? { authProfileOverrideSource } : {}
	};
}
function resolveProjectionExistingEntry(snapshot, target) {
	const candidateKeys = target.candidateKeys ?? [target.primaryKey];
	let freshest;
	for (const candidateKey of candidateKeys) {
		const entry = snapshot.store[candidateKey];
		if (entry && (!freshest || (entry.updatedAt ?? 0) > (freshest.updatedAt ?? 0))) freshest = entry;
	}
	return freshest ? structuredClone(freshest) : void 0;
}
//#endregion
//#region src/config/sessions/session-message-cut-plan.ts
/** Shared history selection and identity policy; the backend owns the atomic install. */
function planSessionMessageCut(currentEntry, events, params, sourceRepositoryWorkspaceId) {
	if (!currentEntry?.sessionId) return { status: "missing-session" };
	if (!params.expectedState || currentEntry.sessionId !== params.expectedState.sessionId || currentEntry.lifecycleRevision !== params.expectedState.lifecycleRevision) return { status: "conflict" };
	if (sourceRepositoryWorkspaceId !== void 0 && currentEntry.repositoryWorkspaceId !== sourceRepositoryWorkspaceId) throw new Error("Repository workspace changed before session fork");
	assertModelSelectionUnlocked(currentEntry, "Session history changes are unavailable while model selection is locked.");
	const cut = params.mode === "switch" ? void 0 : resolveMessageCut(events, params.entryId);
	if (cut && cut.status !== "cut") return cut;
	if (params.mode === "switch") {
		const tipStatus = validateBranchTip(events, params.entryId);
		if (tipStatus) return { status: tipStatus };
	}
	if (params.mode === "fork" && currentEntry.repositoryWorkspaceId && (!params.repositoryWorkspaceId || params.repositoryWorkspaceId === currentEntry.repositoryWorkspaceId)) throw new Error("Repository session fork requires its own prepared workspace");
	const nextSessionId = randomUUID();
	const header = createSessionTranscriptHeader({
		cwd: readTranscriptHeaderCwd(events),
		sessionId: nextSessionId,
		version: findSessionTranscriptHeader(events)?.version ?? 3
	});
	const nextEvents = params.mode === "fork" && cut ? [header, ...cut.prefix] : [
		header,
		...events.filter((event) => !isSessionHeader(event)),
		{
			type: "leaf",
			id: uniqueEntryId(events),
			parentId: readLastEventId(events),
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			targetId: params.mode === "switch" ? params.entryId : cut?.parentId ?? null
		}
	];
	const forked = params.mode === "fork";
	const nextEntry = {
		...forked ? inheritSessionSelection(currentEntry) : currentEntry,
		sessionId: nextSessionId,
		lifecycleRevision: forked ? randomUUID() : currentEntry.lifecycleRevision,
		updatedAt: Date.now(),
		systemSent: false,
		abortedLastRun: false,
		lifecycleRunId: void 0,
		lastRunId: void 0,
		startedAt: void 0,
		endedAt: void 0,
		runtimeMs: void 0,
		status: void 0,
		inputTokens: void 0,
		outputTokens: void 0,
		cacheRead: void 0,
		cacheWrite: void 0,
		estimatedCostUsd: void 0,
		totalTokens: void 0,
		totalTokensFresh: void 0,
		totalTokensVersion: void 0,
		contextTokens: void 0,
		contextTokensSource: void 0,
		contextBudgetStatus: void 0,
		compactionCount: void 0,
		transcriptByteCompactionLatch: void 0,
		memoryFlush: void 0,
		cliSessionBindings: void 0,
		cliSessionIds: void 0,
		claudeCliSessionId: void 0,
		agentHarnessId: void 0,
		modelSelectionLocked: void 0,
		skillsSnapshot: void 0,
		systemPromptReport: void 0,
		restartRecoveryRuns: void 0,
		restartRecoveryForceSafeTools: void 0,
		abortCutoffMessageSid: void 0,
		abortCutoffTimestamp: void 0,
		usageFamilyKey: forked ? void 0 : currentEntry.usageFamilyKey,
		usageFamilySessionIds: forked ? void 0 : currentEntry.usageFamilySessionIds,
		previousSessionId: forked ? void 0 : currentEntry.sessionId,
		...forked ? {
			forkSource: {
				sessionKey: params.canonicalSourceKey,
				sessionId: currentEntry.sessionId,
				entryId: params.entryId
			},
			parentSessionKey: params.canonicalSourceKey
		} : {},
		...params.mode === "fork" ? params.forkWorkspace : {},
		...params.mode === "fork" && params.creation ? buildSessionCreationStamp(params.creation) : {},
		...params.mode === "fork" && params.repositoryWorkspaceId ? { repositoryWorkspaceId: params.repositoryWorkspaceId } : {},
		...currentEntry.incognito === true || isIncognitoSessionKey(params.canonicalSourceKey) ? { incognito: true } : {}
	};
	return {
		status: "prepared",
		header,
		events: nextEvents,
		result: {
			status: "created",
			key: params.targetKey,
			entry: nextEntry,
			...cut?.editorText ? { editorText: cut.editorText } : {},
			...cut?.editorAttachments ? { editorAttachments: cut.editorAttachments } : {},
			...cut?.editorMediaRefs ? { editorMediaRefs: cut.editorMediaRefs } : {}
		}
	};
}
function validateBranchTip(events, entryId) {
	const tree = scanSessionTranscriptTree(events);
	const target = tree.byId.get(entryId);
	if (!target) return "missing-entry";
	if (isSessionTranscriptLeafControl(target.entry)) return "not-branch-tip";
	if (!selectSessionTranscriptTreeTipNodes(tree).some((node) => node.id === entryId)) return "not-branch-tip";
	return tree.leafId === entryId ? "already-active" : void 0;
}
function resolveMessageCut(events, entryId) {
	const tree = scanSessionTranscriptTree(events);
	const target = tree.byId.get(entryId);
	if (!target) return { status: "missing-entry" };
	const record = asOptionalRecord(target.entry);
	const message = asOptionalRecord(record?.message);
	if (record?.type !== "message" || message?.role !== "user") return { status: "not-user-message" };
	const activePath = selectSessionTranscriptTreePathNodes(tree, tree.leafId);
	const targetIndex = activePath.findIndex((node) => node.id === entryId);
	if (targetIndex < 0) return { status: "off-active-path" };
	const prefix = [];
	for (const node of activePath.slice(0, targetIndex)) {
		const entry = asOptionalRecord(node.entry);
		prefix.push(entry && entry.parentId !== node.parentId ? {
			...entry,
			parentId: node.parentId
		} : node.entry);
	}
	const editorAttachments = extractEditorAttachments(message.content);
	const editorMediaRefs = extractEditorMediaRefs(message);
	return {
		status: "cut",
		editorText: readMessageWorkContext(message)?.text ?? extractEditorText(message.content),
		...editorAttachments ? { editorAttachments } : {},
		...editorMediaRefs ? { editorMediaRefs } : {},
		parentId: target.parentId,
		prefix
	};
}
const EDITOR_ATTACHMENT_LIMIT = 10;
const EDITOR_ATTACHMENT_MAX_BASE64_CHARS = Math.ceil(5242880 / 3) * 4;
function extractEditorAttachments(content) {
	if (!Array.isArray(content)) return;
	const attachments = content.flatMap((block) => {
		const record = asOptionalRecord(block);
		return record?.type === "image" && typeof record.data === "string" && record.data.trim() && record.data.length <= EDITOR_ATTACHMENT_MAX_BASE64_CHARS && typeof record.mimeType === "string" && record.mimeType.startsWith("image/") ? [{
			mimeType: record.mimeType,
			data: record.data
		}] : [];
	});
	return attachments.length > 0 ? attachments.slice(0, EDITOR_ATTACHMENT_LIMIT) : void 0;
}
function extractEditorMediaRefs(message) {
	const media = asOptionalRecord(message["__openclaw"])?.media;
	if (!Array.isArray(media)) return;
	const refs = media.flatMap((entry) => {
		const record = asOptionalRecord(entry);
		const mediaUrl = typeof record?.url === "string" ? record.url.trim() : void 0;
		const mediaPath = mediaUrl === void 0 ? typeof record?.path === "string" ? record.path.trim() : "" : /^media:\/\//i.test(mediaUrl) ? mediaUrl : "";
		const contentType = record?.contentType;
		return mediaPath && typeof contentType === "string" && contentType.startsWith("image/") ? [{
			path: mediaPath,
			contentType
		}] : [];
	});
	return refs.length > 0 ? refs : void 0;
}
function isSessionHeader(event) {
	return asOptionalRecord(event)?.type === "session";
}
function readTranscriptHeaderCwd(events) {
	const cwd = asOptionalRecord(events.find(isSessionHeader))?.cwd;
	return typeof cwd === "string" && cwd.trim() ? cwd : void 0;
}
function readLastEventId(events) {
	const id = asOptionalRecord(events.findLast((event) => !isSessionHeader(event)))?.id;
	return typeof id === "string" && id.trim() ? id : null;
}
function uniqueEntryId(events) {
	const ids = new Set(events.flatMap((event) => {
		const id = asOptionalRecord(event)?.id;
		return typeof id === "string" ? [id] : [];
	}));
	for (;;) {
		const id = randomUUID().slice(0, 8);
		if (!ids.has(id)) return id;
	}
}
//#endregion
//#region src/config/sessions/session-actor-memory-fork.ts
function readSessionActorMemoryForkQuery(context, query) {
	const state = query.input.sessionKey ? context.get(normalizeStoreSessionKey(query.input.sessionKey)) : context.state;
	const window = state && resolveSessionActorMemoryWindow(state, query.input.sessionId);
	return window ? resolveParentForkSourceTranscript(window.events.map(({ event }) => event), query.input.forkFrom) : null;
}
function commitParentFork(context, input, callbacks) {
	const parentKey = normalizeStoreSessionKey(input.params.parentTarget.canonicalKey);
	const targetKey = normalizeStoreSessionKey(input.params.sessionTarget.canonicalKey);
	const parent = context.get(parentKey);
	const parentEntry = parent?.hot.entry;
	if (!parent || !parentEntry?.sessionId) return { status: "missing-parent" };
	const base = context.get(targetKey)?.hot.entry ?? input.params.fallbackEntry;
	if (!base) return { status: "missing-entry" };
	if (input.patch?.skipExisting && base.sessionId.trim()) {
		const skipped = input.patch.skipped;
		return {
			status: "skipped",
			reason: "existing-entry",
			parentEntry,
			sessionEntry: skipped ? installSessionActorMemoryEntry(context.edit(targetKey), preserveSqliteSameKeySessionRolloverLineage({
				next: mergeSessionEntry(base, skipped),
				previous: base,
				sessionKey: targetKey
			})) : base
		};
	}
	assertModelSelectionUnlocked(parentEntry, MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE);
	const source = resolveParentForkSourceTranscript(parent.events.map(({ event }) => event));
	const decision = planParentForkDecision(parentEntry, estimateParentForkPromptTokens(source));
	if (decision.status === "skip") return {
		status: "skipped",
		reason: "decision-skip",
		parentEntry,
		sessionEntry: base,
		decision
	};
	if (!source) return { status: "failed" };
	const sessionId = randomUUID();
	const patch = input.patch?.forked;
	const next = {
		...mergeSessionEntry(base, {
			...patch,
			forkSource: {
				sessionKey: parentKey,
				sessionId: parentEntry.sessionId
			},
			forkedFromParent: true,
			sessionId,
			totalTokens: void 0,
			totalTokensFresh: false,
			totalTokensVersion: void 0,
			cliSessionBindings: forkCliSessionBindings(parentEntry, (provider) => callbacks?.supportsCliFork?.(provider) ?? false),
			cliSessionIds: void 0,
			claudeCliSessionId: void 0
		}),
		lifecycleRunId: void 0,
		lastRunId: void 0
	};
	const target = context.edit(targetKey);
	const sessionEntry = installSessionActorMemoryEntry(target, next);
	const events = createSessionActorMemoryEvents({
		...context,
		state: target
	});
	const forkedEvents = buildForkedChildTranscriptEvents({
		parentSessionFile: formatSqliteSessionFileMarker({
			agentId: context.agentId,
			sessionId: parentEntry.sessionId,
			storePath: context.path
		}),
		source,
		targetSessionId: sessionId
	});
	events.replaceRows(forkedEvents.map((event, rawSeq) => {
		const eventJson = JSON.stringify(event);
		return {
			rawSeq,
			eventJson,
			event: JSON.parse(eventJson)
		};
	}));
	return {
		status: "forked",
		decision,
		fork: {
			sessionFile: targetKey,
			sessionId
		},
		parentEntry,
		sessionEntry
	};
}
function executeSessionActorMemoryForkCommand(context, command, callbacks) {
	switch (command.type) {
		case "session.parentFork.commit": return commitParentFork(context, command.input, callbacks);
		case "session.parentFork.transcript": {
			const target = context.edit(context.state.hot.target.sessionKey);
			const current = target.hot.entry?.sessionId === command.input.sessionId;
			const window = current ? target : createSessionActorMemoryState(target.hot.target);
			const previous = target.historicalWindows.get(command.input.sessionId);
			if (!current) {
				if (previous) Object.assign(window, structuredClone(previous));
				else installSessionActorMemoryEntry(window, {
					sessionId: command.input.sessionId,
					updatedAt: Date.now()
				});
			}
			const events = createSessionActorMemoryEvents({
				...context,
				state: window
			});
			for (const event of command.input.events) events.writeEvent(event);
			if (!current) target.historicalWindows.set(command.input.sessionId, {
				hot: window.hot,
				usageRollup: window.usageRollup,
				sourceCreatedAt: window.sourceCreatedAt,
				conversationLinks: window.conversationLinks,
				primaryConversationRef: window.primaryConversationRef,
				workerTranscriptCommits: window.workerTranscriptCommits,
				events: window.events,
				pendingInputs: window.pendingInputs,
				completions: window.completions,
				goalReceipts: window.goalReceipts
			});
			return {
				status: "created",
				transcript: {
					sessionId: command.input.sessionId,
					sessionFile: target.hot.target.sessionKey
				}
			};
		}
		case "session.messageCut": {
			const { intent, sourceRepositoryWorkspaceId } = command.input;
			const source = context.get(normalizeStoreSessionKey(intent.sourceKey));
			const plan = planSessionMessageCut(source?.hot.entry, source?.events.map(({ event }) => event) ?? [], {
				...intent,
				expectedState: intent.expectedState ?? (source?.hot.entry && {
					sessionId: source.hot.entry.sessionId,
					lifecycleRevision: source.hot.entry.lifecycleRevision
				})
			}, sourceRepositoryWorkspaceId);
			if (plan.status !== "prepared") return plan;
			const targetKey = normalizeStoreSessionKey(intent.targetKey);
			const target = context.edit(targetKey);
			const entry = installSessionActorMemoryEntry(target, plan.result.entry);
			createSessionActorMemoryEvents({
				...context,
				state: target
			}).replaceRows(plan.events.map((event, rawSeq) => {
				const eventJson = JSON.stringify(event);
				return {
					rawSeq,
					eventJson,
					event: JSON.parse(eventJson)
				};
			}));
			return {
				...plan.result,
				entry
			};
		}
	}
	throw new Error("Unknown memory fork command");
}
//#endregion
//#region src/config/sessions/session-actor-memory-goals.ts
/** The actor commits these receipts with the Goal and its accepted transcript turn. */
function createSessionActorMemoryGoals(options) {
	const { state, agentId, path } = options;
	const readReceipt = (sessionId, operation) => {
		assertSessionGoalOperationTime(operation, Date.now());
		const receipt = state.goalReceipts.get(operation.operationId);
		if (!receipt) return;
		if (receipt.fingerprint !== operationFingerprint(operation)) throw new SessionGoalOperationError("operation-conflict", "Goal operation ID was already used for a different request.");
		if (receipt.result.sessionId !== sessionId) throw new SessionGoalOperationError("session-rebound", "Session changed after this Goal operation; refresh before trying again.");
		return structuredClone(receipt.result);
	};
	const commitReceipt = (sessionId, operation, goal, runId) => {
		const now = Date.now();
		assertSessionGoalOperationTime(operation, now);
		for (const [id, receipt] of state.goalReceipts) if (receipt.expiresAt <= now) state.goalReceipts.delete(id);
		if (state.goalReceipts.size >= 4096) throw new SessionGoalOperationError("capacity", "Too many recent Goal operations; wait for older requests to expire before trying again.");
		const result = createSessionGoalOperationResult(sessionId, operation, goal, runId);
		state.goalReceipts.set(operation.operationId, {
			fingerprint: operationFingerprint(operation),
			expiresAt: operation.issuedAtMs + OPERATION_VALIDITY_MS,
			result: structuredClone(result)
		});
		return structuredClone(result);
	};
	return {
		readReceipt,
		commitReceipt,
		assertRouting(predicate) {
			if (predicate && (predicate.agentId !== agentId || predicate.storePath !== path || predicate.canonicalKey !== state.hot.target.sessionKey)) throw new Error("Session routing changed before Goal admission; refresh and retry.");
		},
		mutate(input) {
			if (input.sessionKey !== state.hot.target.sessionKey) throw new SessionGoalOperationError("session-rebound", "Goal operation does not target this session actor.");
			const previous = state.hot.entry;
			const replay = readReceipt(input.expectedSessionId, input.operation);
			if (!previous || previous.sessionId !== input.expectedSessionId) throw new SessionGoalOperationError("session-rebound", "Session changed; refresh before changing its Goal.");
			if (replay) return {
				result: replay,
				replayed: true
			};
			const goal = applySessionGoalOperation(previous, input.operation, Date.now());
			const sessionEntry = mergeSessionEntry(previous, { goal });
			const result = commitReceipt(input.expectedSessionId, input.operation, goal);
			state.hot.entry = sessionEntry;
			return {
				result,
				replayed: false,
				sessionEntry: structuredClone(sessionEntry),
				previous: structuredClone(previous)
			};
		}
	};
}
//#endregion
//#region src/config/sessions/session-actor-memory-history-anchors.ts
/** Current logical authority is separate from the selected, possibly historical transcript. */
function readSessionActorMemoryAnchors(window, scope, selection) {
	const current = scope.currentEntry;
	const watermark = window.hot.transcript.watermark;
	const contextAuthority = selection.contextAuthority ? {
		entry: current && {
			sessionId: current.sessionId,
			updatedAt: current.updatedAt,
			lifecycleRevision: current.lifecycleRevision,
			activeWriterRunId: current.activeWriterRunId,
			cliHistoryBoundary: current.cliHistoryBoundary,
			permissionMode: current.permissionMode
		},
		watermark
	} : void 0;
	if (selection.contextAuthority && (!current || current.sessionId !== window.hot.entry?.sessionId || selection.contextAuthority !== true && current.permissionMode !== selection.contextAuthority.permissionMode)) return {
		anchors: [],
		contextAuthority
	};
	const replay = selection.replayValidation;
	let replayValidated;
	if (replay) {
		if (!current && replay.allowInitial && window.events.length === 0) replayValidated = "initial";
		else if (!current || current.sessionId !== window.hot.entry?.sessionId || replay.expectedLifecycleRevision !== void 0 && current.lifecycleRevision !== replay.expectedLifecycleRevision || replay.expectedWriterRunId !== void 0 && current.activeWriterRunId !== replay.expectedWriterRunId) throw new SessionTranscriptWriterClaimReboundError();
		else replayValidated = "current";
	}
	const context = selection.contextValidation;
	if (context?.through) {
		const expected = context.expectedAuthority;
		if (expected && (!current || current.sessionId !== window.hot.entry?.sessionId || current.permissionMode !== expected.permissionMode || (current.lifecycleRevision ?? null) !== (expected.lifecycleRevision ?? null))) throw new SessionTranscriptReadFenceError("Session transcript source was deleted, replaced, or changed lifecycle or permissions.");
		assertSessionActorMemoryAnchor(window, scope, context.through);
	}
	if (replay && context && !context.admission && !context.through) {
		const version = window.hot.transcript.version;
		if (version.generation !== context.version?.generation || version.rawSeq !== context.version?.rawSeq || version.updatedAt !== context.version?.updatedAt) throw new SessionTranscriptReadFenceError("Session transcript changed during context read");
	}
	if (context?.admission && !replay?.admission) selectSessionActorMemoryAdmittedWindow(window, scope, context.admission);
	const admitted = selectSessionActorMemoryAdmittedWindow(window, scope, replay?.admission);
	const beforeRawSeq = replay?.admission?.rawSeq;
	const available = new Map(window.hot.transcript.anchors.filter((anchor) => beforeRawSeq === void 0 || anchor.rawSeq < beforeRawSeq).map((anchor) => [anchor.entryId, anchor]));
	const selected = selection.entryIds.flatMap((entryId) => available.get(entryId) ?? []);
	const facts = {
		anchors: selected,
		...contextAuthority ? { contextAuthority } : {},
		...context ? { contextValidated: true } : {},
		...replayValidated ? { replayValidated } : {},
		...selection.includeSession ? { session: current && {
			sessionId: current.sessionId,
			lifecycleRevision: current.lifecycleRevision
		} } : {},
		...selection.includeHeader ? { header: window.events[0]?.event } : {},
		...selection.includeWatermark ? { watermark } : {},
		...selection.includeMessagePresence ? { messagePresence: window.events.some(({ event }) => isRecord(event) && event.type === "message") } : {},
		...selection.includeMetadata ? { metadata: {
			present: window.events.length > 0,
			observedAt: window.hot.transcript.version.updatedAt,
			updatedAt: window.hot.transcript.version.updatedAt
		} } : {}
	};
	if (selection.afterSeq === void 0) return facts;
	const requested = new Map(selection.entryIds.map((entryId) => [entryId, available.get(entryId)]));
	const visible = selection.includeMessagesForRunId === void 0 ? void 0 : new Set(createSessionActorMemoryHistoryNavigation(admitted).visibleHistory.map((row) => row.rawSeq));
	const rows = window.events.filter((row) => row.rawSeq > selection.afterSeq);
	const entries = [];
	for (const { event, rawSeq } of rows) {
		const row = asOptionalRecord(event);
		const message = asOptionalRecord(row?.message);
		if (typeof row?.id !== "string" || message?.role !== "user" && message?.role !== "assistant") continue;
		const runId = readSessionTranscriptRunId(message);
		const includeMessage = selection.includeMessagesForRunId !== void 0 && message.role === "assistant" && runId === selection.includeMessagesForRunId;
		const anchor = message.role === "user" || includeMessage ? available.get(row.id) : requested.get(row.id);
		if (message.role === "user" || includeMessage) requested.set(row.id, anchor);
		entries.push({
			entryId: row.id,
			role: message.role,
			...runId ? { runId } : {},
			...anchor ? { anchor } : {},
			...includeMessage && anchor && visible?.has(rawSeq) ? { message } : {}
		});
	}
	return {
		...facts,
		anchors: selection.includeMessagesForRunId ? [...requested.values()].flatMap((anchor) => anchor ?? []) : selected,
		tail: {
			lastSeq: rows.at(-1)?.rawSeq,
			entries
		}
	};
}
//#endregion
//#region src/config/sessions/session-actor-memory-history-facts.ts
function messageEvent(row) {
	return {
		event: row.event,
		eventSeq: row.rawSeq,
		seq: row.messagePosition + 1
	};
}
function readSessionActorMemoryBoundedTail(window, navigation, options) {
	const { visibleMessages } = navigation;
	const totalMessages = visibleMessages.length;
	const offset = resolveIntegerOption(options.offset, 0, {
		min: 0,
		max: totalMessages
	});
	const maxMessages = resolveIntegerOption(options.maxMessages, 0, {
		min: 0,
		max: MAX_VISIBLE_MESSAGE_MAX_MESSAGES
	});
	const maxBytes = resolveIntegerOption(options.maxBytes, 0, { min: 0 });
	const end = Math.max(0, totalMessages - offset);
	const start = Math.max(0, end - maxMessages);
	const oversized = options.oversizedMessageCheck;
	const checked = oversized ? { hasOversizedMessages: visibleMessages.slice(oversized.includeEarlier ? 0 : start, end).some((row) => {
		const role = asOptionalRecord(asOptionalRecord(row.event)?.message)?.role;
		return typeof role === "string" && oversized.roles.includes(role) && row.serializedBytes > maxBytes;
	}) } : {};
	const selected = [];
	let newestContiguousEventCount;
	let serializedBytes = 0;
	if (maxBytes > 0) for (let index = end - 1; index >= start; index -= 1) {
		const row = visibleMessages[index];
		if (serializedBytes + row.serializedBytes > maxBytes) {
			newestContiguousEventCount ??= selected.length;
			continue;
		}
		selected.push(row);
		serializedBytes += row.serializedBytes;
	}
	return {
		...checked,
		activeLeafEntryId: navigation.tree.leafId,
		events: selected.toReversed().map(messageEvent),
		newestContiguousEventCount: newestContiguousEventCount ?? selected.length,
		scannedMessages: end - start,
		serializedBytes,
		snapshot: {
			boundarySeq: navigation.latestResetRawSeq ?? void 0,
			generation: window.hot.transcript.version.generation ?? void 0,
			indexedSeq: window.hot.transcript.version.rawSeq ?? -1
		},
		totalMessages
	};
}
function contextAccountingRows(navigation) {
	const { active } = navigation;
	const boundary = active.findLast(({ event }) => isRecord(event) && (event.type === "reset" || event.type === "compaction"));
	if (!boundary || !isRecord(boundary.event)) return active.filter((row) => transcriptEventContextEligibility(row.event) === 1);
	const boundaryEvent = boundary.event;
	const firstKeptId = boundaryEvent.firstKeptEntryId;
	const first = active.findIndex((row) => isRecord(row.event) && row.event.id === firstKeptId);
	const candidates = first >= 0 && first < boundary.activePosition ? active.slice(first, boundary.activePosition).flatMap((row) => isIndexedSessionEntry(row.event) && row.event.type === "message" && (boundaryEvent.type === "reset" || transcriptEventContextEligibility(row.event) === 1) ? [{
		row,
		event: row.event
	}] : []) : [];
	const retained = boundary.event.type === "reset" ? new Set(selectResetKeptEntries(candidates.map(({ event }) => event))) : void 0;
	return [
		...candidates.flatMap(({ row, event }) => !retained || retained.has(event) ? [row] : []),
		...boundary.event.type === "compaction" ? [boundary] : [],
		...active.slice(boundary.activePosition + 1).filter((row) => transcriptEventContextEligibility(row.event) === 1)
	];
}
function maintenance(window, navigation, request) {
	const kind = "transcript-maintenance";
	switch (request.operation) {
		case "previous": return {
			kind,
			previous: navigation.active.findLast((row) => row.rawSeq < request.beforeSeq && row.node !== void 0)?.event
		};
		case "identity": return {
			kind,
			seq: window.events.find(({ event }) => isRecord(event) && event.id === request.eventId)?.rawSeq
		};
		case "version": return {
			kind,
			version: window.hot.transcript.version,
			lifecycleRevision: window.hot.entry?.lifecycleRevision,
			appendParentId: navigation.tree.appendParentId
		};
		case "nested-activity": {
			const first = window.events.find(({ event }) => isRecord(event) && event.id === request.firstEntryId);
			const last = window.events.find(({ event }) => isRecord(event) && event.id === request.lastEntryId);
			if (!first || !last || first.rawSeq > last.rawSeq) throw new Error("Accepted nested tool activity is no longer available");
			return {
				kind,
				events: window.events.flatMap(({ event, rawSeq }) => {
					const message = asOptionalRecord(asOptionalRecord(event)?.message);
					return rawSeq >= first.rawSeq && rawSeq <= last.rawSeq && message?.customType === "openclaw.nested-tool.v1" && asOptionalRecord(message.details)?.scopeId === request.scopeId ? [event] : [];
				})
			};
		}
		case "suffix": {
			const rows = window.events.filter((row) => row.rawSeq >= request.startSeq);
			if (rows.length > request.maxEvents) throw new Error("Transcript suffix exceeds synchronous planning row limit");
			let bytes = 0;
			const retained = new Set(request.retainedCustomDataIds);
			const events = rows.map((row) => {
				const event = row.event;
				if (isRecord(event) && event.type === "custom" && typeof event.id === "string" && retained.has(event.id)) {
					const { data: _data, ...projected } = event;
					bytes += Buffer.byteLength(JSON.stringify(projected)) + 1;
					return projected;
				}
				bytes += Buffer.byteLength(row.eventJson) + 1;
				return event;
			});
			if (bytes > request.maxBytes) throw new Error("Transcript suffix exceeds synchronous planning byte limit");
			return {
				kind,
				events
			};
		}
	}
	throw new Error("Unknown memory transcript maintenance operation");
}
function branches(navigation) {
	const { tree } = navigation;
	return selectSessionTranscriptTreeTipNodes(tree).toSorted((left, right) => Number(right.id === tree.leafId) - Number(left.id === tree.leafId) || right.index - left.index).map((leaf) => {
		const path = selectSessionTranscriptTreePathNodes(tree, leaf.id);
		let headline = "";
		for (let index = path.length - 1; index >= 0 && !headline; index -= 1) headline = extractSessionBranchHeadline(path[index].entry) ?? "";
		const timestamp = asOptionalRecord(leaf.entry)?.timestamp;
		const branch = {
			leafEntryId: leaf.id,
			headline,
			messageCount: path.filter((node) => asOptionalRecord(node.entry)?.type === "message").length,
			active: leaf.id === tree.leafId
		};
		if (typeof timestamp === "string" && timestamp.trim()) branch.updatedAt = timestamp;
		return branch;
	});
}
/** Reads run synchronously in the owner's queue; its facade detaches only the selected result. */
function readSessionActorMemoryHistoryFacts(window, query) {
	switch (query.type) {
		case "session.history.stats": return readSessionActorMemoryTranscriptStats(window);
		case "session.history.watermark": return {
			kind: "transcript-watermark",
			watermark: window.hot.transcript.watermark
		};
		case "session.history.message-presence": return window.events.some(({ event }) => isRecord(event) && event.type === "message");
		case "session.history.latest-assistant":
			for (let index = window.events.length - 1; index >= 0; index -= 1) {
				const event = asOptionalRecord(window.events[index].event);
				const message = asOptionalRecord(event?.message);
				if (event?.type !== "message" || message?.role !== "assistant" || isTranscriptOnlyOpenClawAssistantModel(message.provider, message.model)) continue;
				const text = projectAssistantTranscriptText(message, event.id);
				if (text) return text;
			}
			return;
	}
	const navigation = createSessionActorMemoryHistoryNavigation(window);
	switch (query.type) {
		case "session.history.visibility-inputs": {
			const runIds = new Set(query.input.runIds);
			const inputKeys = new Set(query.input.runIds.map(buildRunUserTurnIdempotencyKey));
			return navigation.visibleHistory.flatMap(({ event }, index) => {
				const message = asOptionalRecord(asOptionalRecord(event)?.message);
				const meta = asOptionalRecord(message?.["__openclaw"]);
				const runId = readSessionTranscriptRunId(message);
				const inputKey = message?.idempotencyKey ?? meta?.idempotencyKey;
				if (message?.role !== "user" || !(typeof runId === "string" && runIds.has(runId) || typeof meta?.steerTargetRunId === "string" && runIds.has(meta.steerTargetRunId) || typeof inputKey === "string" && inputKeys.has(inputKey))) return [];
				return [{
					seq: index + 1,
					message: {
						role: "user",
						idempotencyKey: message.idempotencyKey,
						provenance: message.provenance,
						__openclaw: {
							runId,
							steerTargetRunId: meta?.steerTargetRunId,
							idempotencyKey: meta?.idempotencyKey
						}
					}
				}];
			});
		}
		case "session.history.title": {
			const first = navigation.visibleMessages.slice(0, 100).find(({ event }) => {
				const message = asOptionalRecord(asOptionalRecord(event)?.message);
				return projectSessionDisplayMessage(message)?.role === "user" && (query.input.includeInterSession === true || !hasInterSessionUserProvenance(message));
			});
			let lastMessagePreview = null;
			const tail = navigation.visibleMessages.slice(-100);
			for (let index = tail.length - 1; index >= 0 && lastMessagePreview === null; index -= 1) lastMessagePreview = projectSessionDisplayMessage(asOptionalRecord(tail[index].event)?.message, { flattenMarkdown: true })?.text ?? null;
			return {
				kind: "session-title-fields",
				fields: {
					firstUserMessage: projectSessionDisplayMessage(asOptionalRecord(first?.event)?.message)?.text ?? null,
					lastMessagePreview
				}
			};
		}
		case "session.history.preview": {
			const { maxItems, maxChars } = query.input;
			const initialMaxEvents = Math.min(256, Math.max(64, Math.ceil(maxItems) * 4));
			let items = [];
			for (const { maxEvents, maxBytes } of [{
				maxEvents: initialMaxEvents,
				maxBytes: 1048576
			}, {
				maxEvents: Math.min(2048, Math.max(1024, initialMaxEvents * 8, Math.ceil(maxItems))),
				maxBytes: 8388608
			}]) {
				const selected = [];
				let bytes = 0;
				for (let index = navigation.visibleHistory.length - 1; index >= 0 && selected.length < maxEvents; index -= 1) {
					const row = navigation.visibleHistory[index];
					if (selected.length > 0 && bytes + row.serializedBytes > maxBytes) break;
					selected.push(row);
					bytes += row.serializedBytes;
				}
				items = buildSessionPreviewItems(selected.toReversed().map((row) => asOptionalRecord(row.event)?.message), maxItems, maxChars);
				if (items.length >= maxItems || selected.length === navigation.visibleHistory.length) break;
			}
			return {
				kind: "session-preview",
				items
			};
		}
		case "session.history.branches": return window.hot.entry ? {
			status: "ok",
			...window.hot.transcript.watermark,
			branches: branches(navigation)
		} : { status: "missing-session" };
		case "session.history.current-turn-entry": {
			const row = navigation.active.find(({ event }) => isRecord(event) && event.id === query.input.entryId);
			return {
				kind: "current-turn-entry",
				version: window.hot.transcript.version,
				anchor: window.hot.transcript.anchors.find((anchor) => anchor.entryId === query.input.entryId),
				event: query.input.includeEntry && row && isIndexedSessionEntry(row.event) ? row.event : void 0
			};
		}
		case "session.history.maintenance": return maintenance(window, navigation, query.input.request);
		case "session.history.match": {
			const match = query.input.match;
			const row = window.events.findLast(({ event }) => matchesTranscriptEvent(event, match) && (match.kind !== "active-assistant" || window.hot.transcript.anchors.some((anchor) => anchor.entryId === asOptionalRecord(event)?.id)));
			return {
				kind: "transcript-match",
				result: row ? { event: row.event } : void 0
			};
		}
		case "session.history.latest-active-message": {
			const row = navigation.active.findLast((candidate) => candidate.messagePosition !== null);
			return row ? messageEvent(row) : void 0;
		}
		case "session.history.recent-active-events": {
			const limit = resolveIntegerOption(query.input.maxEvents, 0, { min: 0 });
			return limit === 0 ? [] : navigation.active.filter((row) => transcriptEventContextEligibility(row.event) === 1).slice(-limit).map((row) => row.event);
		}
		case "session.history.accounting": {
			const { options } = query.input;
			const contextRows = options.includeByteSize ? contextAccountingRows(navigation) : [];
			const tail = navigation.active.filter((row) => transcriptEventContextEligibility(row.event) === 1).slice(-512);
			return {
				...options.includeByteSize ? {
					byteSize: contextRows.reduce((bytes, row) => bytes + row.serializedBytes, 0),
					eventCount: contextRows.length
				} : {},
				...options.includeUsage || options.includeTurnTaint ? readSessionTranscriptAccountingTail((visit) => {
					for (let index = tail.length - 1; index >= 0; index -= 1) visit(tail[index].event);
				}, options) : {}
			};
		}
		case "session.history.bounded-tail": return readSessionActorMemoryBoundedTail(window, navigation, query.input.options);
		case "session.history.visitor-source": {
			const rows = navigation.visibleMessages;
			const start = resolveIntegerOption(query.input.offset, 0, {
				min: 0,
				max: rows.length
			});
			const messages = [];
			let end = start;
			let bytes = 0;
			for (const row of rows.slice(start, start + 128)) {
				if (row.serializedBytes > 8388608) throw new Error(`Transcript source message exceeds the ${SOURCE_PAGE_MAX_BYTES}-byte page limit`);
				if (bytes + row.serializedBytes > 8388608) break;
				bytes += row.serializedBytes;
				end++;
				const message = asOptionalRecord(row.event)?.message;
				if (message !== void 0) messages.push({
					message,
					seq: row.messagePosition + 1
				});
			}
			return {
				messages,
				...end < rows.length ? { nextOffset: end } : {}
			};
		}
	}
	throw new Error("Unknown memory history facts query");
}
//#endregion
//#region src/config/sessions/session-actor-memory-history-projection.ts
function readSessionActorMemoryRawDelta(window, scope, limits) {
	const { maxBytes, maxEvents } = normalizeRawDeltaLimits(limits);
	const generation = window.hot.transcript.version.generation;
	const sessionId = window.hot.entry?.sessionId;
	if (!generation || !sessionId) return { kind: "missing" };
	const initial = bootstrapRawTranscriptCursor({
		agentId: scope.agentId,
		sessionId
	}, generation);
	const reset = (reason) => ({
		kind: "reset",
		cursor: encodeRawTranscriptCursor(initial),
		reason
	});
	const cursor = limits.cursor === void 0 ? initial : parseRawTranscriptCursor(limits.cursor);
	if (!cursor) return reset("invalid_cursor");
	if (cursor.agentId !== scope.agentId || cursor.sessionId !== sessionId) return reset("scope_mismatch");
	if (cursor.generation !== generation) return reset("generation_mismatch");
	if (cursor.lastSeq > (window.events.at(-1)?.rawSeq ?? -1)) {
		if (scope.readFence) throw new SessionTranscriptReadFenceError("Transcript read cursor has crossed the current-turn admission fence");
		return reset("invalid_cursor");
	}
	const events = [];
	let serializedBytes = 0;
	let requiredBytes;
	let hasMore = false;
	let lastSeq = cursor.lastSeq;
	for (const row of window.events) {
		if (row.rawSeq <= cursor.lastSeq) continue;
		const bytes = Buffer.byteLength(row.eventJson) + 1;
		if (events.length >= maxEvents || serializedBytes + bytes > maxBytes) {
			hasMore = true;
			if (!events.length) requiredBytes = bytes;
			break;
		}
		serializedBytes += bytes;
		lastSeq = row.rawSeq;
		events.push({
			event: row.event,
			seq: row.rawSeq
		});
	}
	return {
		kind: "page",
		cursor: encodeRawTranscriptCursor({
			...cursor,
			lastSeq
		}),
		events,
		hasMore,
		serializedBytes,
		...requiredBytes === void 0 ? {} : { requiredBytes }
	};
}
function readSessionActorMemoryVisibleDelta(window, scope, limits) {
	const { maxBytes, maxMessages } = normalizeVisibleDeltaLimits(limits);
	const generation = window.hot.transcript.version.generation;
	const sessionId = window.hot.entry?.sessionId;
	if (!generation || !sessionId) return { kind: "missing" };
	const initial = createVisibleMessageCursor({
		agentId: scope.agentId,
		sessionId,
		generation
	});
	const reset = (reason) => ({
		kind: "reset",
		cursor: encodeVisibleMessageCursor(initial),
		reason
	});
	const cursor = limits.cursor === void 0 ? initial : parseVisibleMessageCursor(limits.cursor);
	if (!cursor) return reset("invalid_cursor");
	if (cursor.agentId !== scope.agentId || cursor.sessionId !== sessionId) return reset("scope_mismatch");
	if (cursor.generation !== generation) return reset("generation_mismatch");
	if (scope.readFence && cursor.lastMessagePosition >= scope.readFence.beforeActiveMessagePosition) throw new SessionTranscriptReadFenceError("Transcript read cursor has crossed the current-turn admission fence");
	const navigation = createSessionActorMemoryHistoryNavigation(window);
	const messages = navigation.active.filter((row) => row.messagePosition !== null);
	if (cursor.lastEventSeq >= 0) {
		const anchor = messages.find((row) => row.rawSeq === cursor.lastEventSeq);
		if (!anchor) return reset("anchor_missing");
		if (anchor.messagePosition !== cursor.lastMessagePosition) return reset("anchor_moved");
	}
	let serializedBytes = 0;
	let hasMore = false;
	let requiredBytes;
	let lastEventSeq = cursor.lastEventSeq;
	let lastMessagePosition = cursor.lastMessagePosition;
	const events = [];
	for (const row of messages) {
		if (row.messagePosition <= cursor.lastMessagePosition) continue;
		if (events.length >= maxMessages || serializedBytes + row.serializedBytes > maxBytes) {
			hasMore = true;
			if (!events.length) requiredBytes = row.serializedBytes;
			break;
		}
		serializedBytes += row.serializedBytes;
		lastEventSeq = row.rawSeq;
		lastMessagePosition = row.messagePosition;
		events.push({
			event: row.event,
			eventSeq: row.rawSeq,
			seq: row.messagePosition + 1,
			parentId: navigation.active[row.activePosition - 1]?.node?.id ?? null
		});
	}
	return {
		kind: "page",
		cursor: encodeVisibleMessageCursor({
			...cursor,
			lastEventSeq,
			lastMessagePosition
		}),
		events,
		hasMore,
		serializedBytes,
		...requiredBytes === void 0 ? {} : { requiredBytes }
	};
}
/** History readers borrow rows and materialize only the selected response. */
function readSessionActorMemoryProjection(window, scope, selection) {
	const navigation = createSessionActorMemoryHistoryNavigation(window);
	const { visibleHistory: history, active, tree } = navigation;
	const sessionId = window.hot.entry?.sessionId ?? "";
	const generation = window.hot.transcript.version.generation;
	const displaySource = generation ? createTranscriptDisplaySource([
		"memory",
		scope.path,
		scope.agentId,
		sessionId,
		generation
	]) : void 0;
	const position = (row) => displaySource ? createTranscriptDisplayPositionFromActivity(displaySource, row.rawSeq, readNestedToolActivity(isRecord(row.event) ? row.event.message : void 0)?.details, (id) => {
		const node = tree.byId.get(id);
		return node ? window.events[node.index]?.rawSeq : void 0;
	}) : void 0;
	const message = (row, seq) => projectTranscriptEntryMessage(row.event, seq, position(row));
	const messages = (rows, offset) => rows.map((row, index) => message(row, offset + index + 1)).filter((value) => value !== null);
	const deltaCursor = generation ? createTranscriptRawDeltaCursor({
		agentId: scope.agentId,
		sessionId,
		generation,
		lastSeq: window.events.at(-1)?.rawSeq ?? -1
	}) : void 0;
	const capture = (rows, offset) => ({
		source: displaySource,
		latestResetRawSeq: navigation.latestResetRawSeq,
		...rows.at(-1) ? { anchor: {
			rawSeq: rows.at(-1).rawSeq,
			seq: offset + rows.length
		} } : {}
	});
	const change = (expected) => {
		if (!expected) return;
		if (expected.source !== displaySource) return {};
		if (!expected.anchor) return expected.latestResetRawSeq === navigation.latestResetRawSeq ? void 0 : {};
		const index = history.findIndex((row) => row.rawSeq === expected.anchor.rawSeq);
		const seq = index < 0 ? void 0 : index + 1;
		return seq === expected.anchor.seq && expected.latestResetRawSeq === navigation.latestResetRawSeq ? void 0 : { anchorSeq: seq };
	};
	const recent = (options) => {
		const maxMessages = resolveIntegerOption(options.maxMessages, 0, {
			min: 0,
			max: 1e4
		});
		const maxLines = resolveIntegerOption(options.maxLines, maxMessages * 20 + 20, { min: 0 });
		const changed = change(options.expectedReadWindow);
		const start = !maxMessages || !maxLines ? history.length : resolveSessionActorMemoryHistoryStart(history, Math.max(0, history.length - maxLines), history.length, Math.min(resolveIntegerOption(options.maxBytes, SOURCE_PAGE_MAX_BYTES, { min: 1024 }), SOURCE_PAGE_MAX_BYTES), maxMessages, true);
		const rows = history.slice(start);
		return {
			messages: messages(rows, start),
			totalMessages: history.length,
			activeLeafEntryId: tree.leafId,
			displaySource,
			...deltaCursor ? { deltaCursor } : {},
			...options.captureReadWindow || changed ? { readWindow: capture(rows, start) } : {},
			...changed ? { windowReset: true } : {},
			transcriptPath: window.hot.target.sessionKey,
			transcriptSource: "active"
		};
	};
	const readPage = (inputOptions) => {
		let options = inputOptions;
		const changed = change(options.expectedReadWindow);
		if (changed) options = {
			...options,
			captureReadWindow: true,
			expectedReadWindow: void 0,
			...changed.anchorSeq !== void 0 && options.expectedReadWindow?.anchor ? { beforeSeq: options.beforeSeq === void 0 ? void 0 : options.beforeSeq + changed.anchorSeq - options.expectedReadWindow.anchor.seq } : {
				beforeSeq: void 0,
				offset: 0
			}
		};
		const end = resolveTranscriptPageEnd(history.length, options);
		if (options.recentAtHead && end === history.length) return {
			...recent({
				...options.recentAtHead,
				captureReadWindow: options.captureReadWindow
			}),
			...changed ? { windowReset: true } : {}
		};
		const maxMessages = resolveIntegerOption(options.maxMessages, 0, { min: 0 });
		const requestedStart = Math.max(0, end - maxMessages);
		const start = resolveSessionActorMemoryHistoryStart(history, requestedStart, end, resolveIntegerOption(options.maxBytes, SOURCE_PAGE_MAX_BYTES, { min: 1024 }), maxMessages, options.allowOversizedFirst ?? options.maxBytes === void 0, 0, options.maxBytes === void 0);
		const omittedOversized = maxMessages > 0 && end > 0 && start === end;
		const consumedStart = omittedOversized ? end - 1 : start;
		const rows = history.slice(start, end);
		return {
			messages: messages(rows, start),
			totalMessages: history.length,
			activeLeafEntryId: tree.leafId,
			displaySource,
			transcriptPath: window.hot.target.sessionKey,
			transcriptSource: "active",
			...options.maxBytes !== void 0 && maxMessages > 0 && consumedStart > 0 ? { olderOffset: resolveTranscriptPageEnd(history.length, { beforeSeq: options.beforeSeq }) - consumedStart } : {},
			...omittedOversized ? { omittedOversized: true } : {},
			...options.captureReadWindow ? { readWindow: capture(rows, start) } : {},
			...changed ? { windowReset: true } : {}
		};
	};
	const closedHistory = (row) => {
		const close = active.find((candidate) => candidate.activePosition >= row.activePosition && isRecord(candidate.event) && candidate.event.type === "reset");
		if (!close) return;
		const previous = active.findLast((candidate) => candidate.activePosition < close.activePosition && isRecord(candidate.event) && candidate.event.type === "reset");
		return active.filter((candidate) => candidate.activePosition > (previous?.activePosition ?? -1) && candidate.activePosition <= close.activePosition && isVisibleTranscriptRecord(candidate.event));
	};
	const find = (id) => active.find((row) => isRecord(row.event) && row.event.id === id && isVisibleTranscriptRecord(row.event));
	switch (selection.kind) {
		case "recent-text": return readRecentTranscriptConversationText((page) => readSessionActorMemoryBoundedTail(window, navigation, page), selection.options);
		case "count": return history.length;
		case "delta": {
			const result = readSessionActorMemoryRawDelta(window, scope, selection.options);
			if (result.kind !== "page") return result;
			const sequences = new Map(history.map((row, index) => [row.rawSeq, index + 1]));
			return {
				...result,
				activeLeafEntryId: tree.leafId,
				events: result.events.map((row) => Object.assign({}, row, {
					...sequences.has(row.seq) ? { messageSeq: sequences.get(row.seq) } : {},
					displayPosition: position({
						event: row.event,
						rawSeq: row.seq
					})
				}))
			};
		}
		case "recent": return recent(selection.options);
		case "page": return readPage(selection.options);
		case "by-id": {
			const row = find(selection.messageId);
			if (!row) return {
				found: false,
				oversized: false
			};
			const rows = history.indexOf(row) < 0 ? selection.options?.currentOnly ? void 0 : closedHistory(row) : history;
			const index = rows?.indexOf(row) ?? -1;
			if (index < 0 || !rows) return {
				found: false,
				oversized: false
			};
			if (selection.options?.maxBytes !== void 0 && row.serializedBytes - 1 > selection.options.maxBytes) return {
				found: true,
				oversized: true,
				seq: index + 1,
				serializedBytes: row.serializedBytes - 1
			};
			return {
				found: true,
				oversized: false,
				message: message(row, index + 1),
				seq: index + 1,
				...selection.options?.maxBytes !== void 0 ? { serializedBytes: row.serializedBytes - 1 } : {},
				...selection.options?.historyVisibility ? { historyContext: {
					displaySource,
					...index > 0 ? { precedingMessage: message(rows[index - 1], index) } : {}
				} } : {}
			};
		}
		case "lookup": return {
			hasDisplayMessages: history.some((row) => isVisibleTranscriptRecord(row.event)),
			messages: history.flatMap((row, index) => {
				const value = message(row, index + 1);
				return isRecord(value) && isRecord(value["__openclaw"]) && value["__openclaw"].id === selection.messageId ? [value] : [];
			})
		};
		case "around-id": {
			const options = selection.options;
			const row = find(options.messageId);
			const changed = change(options.expectedReadWindow);
			if (changed && (!row || !history.includes(row))) return {
				...readPage({
					offset: 0,
					maxMessages: options.maxMessages,
					maxBytes: Math.min(options.maxBytes ?? 8388608, SOURCE_PAGE_MAX_BYTES),
					captureReadWindow: true
				}),
				windowReset: true,
				found: true,
				hasOverreadContext: false,
				offset: 0
			};
			if (!row) return {
				found: false,
				messages: [],
				totalMessages: history.length,
				hasOverreadContext: false,
				offset: 0
			};
			const closed = options.closedResetInterval === true && options.direction === "older" && isRecord(row.event) && row.event.type === "reset";
			let rows = closed || !history.includes(row) ? closedHistory(row) : history;
			if (!rows) return {
				found: false,
				messages: [],
				totalMessages: history.length,
				hasOverreadContext: false,
				offset: 0
			};
			let anchor = rows.indexOf(row);
			if (closed) {
				rows = rows.slice(0, anchor);
				anchor = rows.length - 1;
			}
			const range = resolveHistoryAnchorPageRange(rows.length, anchor, options);
			const limit = Math.min(options.maxBytes ?? 8388608, SOURCE_PAGE_MAX_BYTES);
			const { start, endExclusive } = boundHistoryAnchorPageRange(range, anchor, Math.max(1024, Math.floor(limit)), (index, remainingBytes) => options.maxBytes === void 0 || rows[index].serializedBytes > remainingBytes ? rows[index].serializedBytes : jsonUtf8Bytes({
				event: rows[index].event,
				eventSeq: rows[index].rawSeq,
				seq: index + 1,
				displayPosition: position(rows[index])
			}) + 1, options.maxBytes === void 0);
			const selected = rows.slice(start, endExclusive);
			return {
				found: true,
				messages: messages(selected, start),
				totalMessages: rows.length,
				hasOverreadContext: range.hasOverreadContext && start === range.readStart,
				offset: rows.length - endExclusive,
				displaySource,
				transcriptPath: window.hot.target.sessionKey,
				...changed ? { windowReset: true } : {},
				...changed || options.captureReadWindow ? { readWindow: rows === history ? capture(selected, start) : capture([], 0) } : {}
			};
		}
		case "source": {
			const options = selection.options;
			if (options.cursor?.kind === "archive") throw new Error("Memory sessions have no archive source");
			const count = options.cursor?.snapshot.activeEventCount ?? active.length;
			const tail = active[count - 1]?.rawSeq;
			const snapshot = options.cursor?.snapshot ?? {
				indexedSeq: window.events.at(-1)?.rawSeq ?? -1,
				activeEventCount: count,
				totalMessages: history.length,
				generation: generation ?? void 0,
				tailEventSeq: tail,
				resetSeq: navigation.latestResetRawSeq
			};
			if (options.cursor && (snapshot.generation !== (generation ?? void 0) || snapshot.indexedSeq > (window.events.at(-1)?.rawSeq ?? -1) || snapshot.tailEventSeq !== tail || snapshot.resetSeq !== navigation.latestResetRawSeq)) throw new SessionTranscriptProjectionUnavailableError(sessionId, "window-changed");
			if (!options.cursor && snapshot.totalMessages === 0) return {
				messages: [],
				snapshot,
				...options.includeOffPathMessages ? { nextCursor: {
					kind: "off-path",
					position: -1,
					messageSeq: 0,
					snapshot
				} } : {}
			};
			let cursor = options.cursor ?? {
				kind: navigation.keptMessages.length ? "kept" : "active",
				position: navigation.keptMessages.length ? 0 : navigation.boundaryActivePosition ?? 0,
				messageSeq: 0,
				snapshot
			};
			const output = [];
			let bytes = 0;
			let consumed = 0;
			const activeSeqs = new Set(active.slice(0, count).map((row) => row.rawSeq));
			while (cursor && consumed < 128) {
				const row = cursor.kind === "kept" ? navigation.keptMessages[cursor.position] : cursor.kind === "active" ? active[cursor.position < count ? cursor.position : -1] : window.events.find((candidate) => candidate.rawSeq > cursor.position && candidate.rawSeq <= snapshot.indexedSeq && !activeSeqs.has(candidate.rawSeq));
				if (!row) {
					cursor = cursor.kind === "kept" ? {
						...cursor,
						kind: "active",
						position: navigation.boundaryActivePosition ?? 0
					} : cursor.kind === "active" && options.includeOffPathMessages ? {
						...cursor,
						kind: "off-path",
						position: -1
					} : void 0;
					continue;
				}
				const size = Buffer.byteLength(row.eventJson) + 1;
				if (size > 8388608) throw new SessionTranscriptSourceMessageTooLargeError();
				if (bytes + size > 8388608) break;
				bytes += size;
				consumed++;
				if (isVisibleTranscriptRecord(row.event)) {
					const seq = cursor.kind === "off-path" ? row.rawSeq + 1 : cursor.messageSeq + 1;
					if (cursor.kind !== "off-path") cursor = {
						...cursor,
						messageSeq: seq
					};
					const value = projectTranscriptEntryMessage(row.event, seq, cursor.kind === "off-path" ? void 0 : position(row));
					if (value !== null) output.push(value);
				}
				cursor = {
					...cursor,
					position: cursor.kind === "off-path" ? row.rawSeq : cursor.position + 1
				};
			}
			return {
				messages: output,
				snapshot,
				transcriptPath: window.hot.target.sessionKey,
				...cursor ? { nextCursor: cursor } : {}
			};
		}
	}
	throw new Error("Unknown memory history projection");
}
//#endregion
//#region src/config/sessions/session-actor-memory-history.ts
/** The actor already owns these bytes; limits select a detached view, never a second store. */
function readSessionActorMemoryHistory(state, limits) {
	if (!limits) return {
		kind: "full",
		snapshot: {
			events: structuredClone(state.events.map((row) => row.event)),
			eventJson: state.events.map((row) => row.eventJson),
			eventSeqs: state.events.map((row) => row.rawSeq),
			version: { ...state.hot.transcript.version }
		}
	};
	return readSessionActorBoundedHistory({
		hot: state.hot,
		events: state.events.map((row) => ({
			...row,
			serializedBytes: Buffer.byteLength(row.eventJson) + 1
		}))
	}, limits);
}
//#endregion
//#region src/config/sessions/session-actor-memory-history-read.ts
/** Runs synchronously in the actor's owner-wide FIFO. The facade detaches its result. */
function readSessionActorMemoryHistoryQuery(state, query, scope) {
	const selected = resolveSessionActorMemoryWindow(state, query.input.sessionId);
	if (!selected) throw new Error("Session transcript window is unavailable");
	if (query.type === "session.history.anchors") return readSessionActorMemoryAnchors(selected, {
		...scope,
		currentEntry: state.hot.entry
	}, query.input);
	const admission = "admission" in query.input ? query.input.admission : void 0;
	if (query.type === "session.history.maintenance" && query.input.request.operation === "suffix" && admission && selected.events.some((row) => row.rawSeq >= admission.rawSeq)) throw new SessionTranscriptReadFenceError("Transcript suffix crosses the current-turn admission fence");
	const window = selectSessionActorMemoryAdmittedWindow(selected, scope, admission);
	const readScope = admission ? {
		...scope,
		readFence: {
			beforeRawSeq: admission.rawSeq,
			beforeActiveMessagePosition: admission.activeMessagePosition
		}
	} : scope;
	switch (query.type) {
		case "session.history.hydrate": {
			const max = query.input.maxEventBytes;
			if (!query.input.limits && max !== void 0 && Number.isFinite(max) && max >= 0) {
				let bytes = 0;
				for (const [index, row] of window.events.entries()) {
					bytes += Buffer.byteLength(row.eventJson) + (index > 0 ? 1 : 0);
					if (bytes > Math.floor(max)) throw new SqliteJsonlReadBudgetExceededError(`Trajectory transcript store is too large to export (at least ${bytes} bytes; limit ${Math.floor(max)})`);
				}
			}
			return readSessionActorMemoryHistory(window, query.input.limits);
		}
		case "session.history.context-messages": return readSessionActorMemoryContextMessages(window);
		case "session.history.context": return readSessionActorMemoryContext(window, scope, query.input.through, query.input.limits);
		case "session.history.raw-delta": return readSessionActorMemoryRawDelta(window, readScope, query.input.limits);
		case "session.history.visible-delta": return readSessionActorMemoryVisibleDelta(window, readScope, query.input.limits);
		case "session.history.count": return readSessionActorMemoryProjection(window, readScope, { kind: "count" });
		case "session.history.delta": return readSessionActorMemoryProjection(window, readScope, {
			kind: "delta",
			...query.input
		});
		case "session.history.recent": return readSessionActorMemoryProjection(window, readScope, {
			kind: "recent",
			...query.input
		});
		case "session.history.recent-text": return readSessionActorMemoryProjection(window, readScope, {
			kind: "recent-text",
			...query.input
		});
		case "session.history.page": return readSessionActorMemoryProjection(window, readScope, {
			kind: "page",
			...query.input
		});
		case "session.history.around-id": return readSessionActorMemoryProjection(window, readScope, {
			kind: "around-id",
			...query.input
		});
		case "session.history.by-id": return readSessionActorMemoryProjection(window, readScope, {
			kind: "by-id",
			...query.input
		});
		case "session.history.source": return readSessionActorMemoryProjection(window, readScope, {
			kind: "source",
			...query.input
		});
		case "session.history.lookup": return readSessionActorMemoryProjection(window, readScope, {
			kind: "lookup",
			...query.input
		});
		default: return readSessionActorMemoryHistoryFacts(window, query);
	}
}
//#endregion
//#region src/config/sessions/session-actor-memory-initialize.ts
/** Initialize the captured actor without manufacturing a transcript message. */
function initializeSessionActorMemoryEntry({ state, agentId, path }, input) {
	if (input.entry.sessionId !== input.scope.sessionId || input.scope.agentId !== void 0 && input.scope.agentId !== agentId || input.scope.sessionKey !== void 0 && resolveSqliteSessionKey(input.scope.sessionKey, agentId) !== state.hot.target.sessionKey || input.scope.storePath !== void 0 && input.scope.storePath !== path) throw new SessionTranscriptWriterClaimReboundError();
	if (state.hot.entry) {
		if (input.initialWriterRunId !== void 0) throw new SessionTranscriptWriterClaimReboundError();
		return { owned: state.hot.entry.sessionId === input.entry.sessionId };
	}
	if (input.scope.expectedWriterRunId !== void 0 && input.initialWriterRunId === void 0) return { owned: false };
	const persisted = installSessionActorMemoryEntry(state, {
		...structuredClone(input.entry),
		...input.initialWriterRunId !== void 0 ? { activeWriterRunId: input.initialWriterRunId } : {}
	});
	return {
		owned: true,
		...input.initialWriterRunId !== void 0 ? { fence: {
			expectedLifecycleRevision: persisted.lifecycleRevision,
			expectedWriterRunId: input.initialWriterRunId
		} } : {},
		identity: {
			previous: /* @__PURE__ */ new Map(),
			current: /* @__PURE__ */ new Map([[state.hot.target.sessionKey, structuredClone(persisted)]])
		}
	};
}
//#endregion
//#region src/config/sessions/transcript-message-equality.ts
function messagesMatchForIdempotentReplay(stored, candidate) {
	const storedDelivery = isRecord(stored) ? stored.openclawDelivery : void 0;
	const legacyMediaMirror = isRecord(stored) && isOpenClawDeliveryMirrorAssistantMessage(stored) && (stored.api === "openclaw-transcript" || stored.api === "openai-responses") && (storedDelivery === void 0 || isRecord(storedDelivery) && !Object.hasOwn(storedDelivery, "mediaUrls"));
	const serializedShape = (message, projectLegacyMedia = false) => {
		if (!isRecord(message)) return message;
		const { timestamp: _timestamp, ...stable } = message;
		if (projectLegacyMedia && isRecord(stable.openclawDelivery) && Array.isArray(stable.openclawDelivery.mediaUrls) && stable.openclawDelivery.mediaUrls.every((url) => typeof url === "string")) {
			const { mediaUrls: _mediaUrls, ...delivery } = stable.openclawDelivery;
			if (storedDelivery === void 0 && Object.keys(delivery).length === 0) delete stable.openclawDelivery;
			else stable.openclawDelivery = delivery;
		}
		const serialized = JSON.stringify(stable);
		return serialized === void 0 ? void 0 : JSON.parse(serialized);
	};
	return isDeepStrictEqual(serializedShape(stored), serializedShape(candidate, legacyMediaMirror));
}
//#endregion
//#region src/config/sessions/session-actor-memory-messages.ts
function createSessionActorMemoryMessages(options, events) {
	const { state, path, admit } = options;
	const { version, writeEvent, parent, checkMutation } = events;
	const pending = createSessionActorMemoryPending(state, options);
	const requireEntry = () => {
		if (!state.hot.entry) throw new SessionTranscriptWriterClaimReboundError();
		return state.hot.entry;
	};
	const findByKey = (input) => {
		const key = readMessageIdempotencyKey(input.message);
		if (!key || input.idempotencyLookup === "caller-checked") return;
		const identity = state.hot.transcript.idempotency.find((item) => item.key === key);
		const row = state.events.findLast(({ event }) => isRecord(event) && event.type === "message" && (input.idempotencyLookup === "scan-assistant" ? isRecord(event.message) && event.message.role === "assistant" && readMessageIdempotencyKey(event.message) === key : event.id === identity?.eventId));
		return row && isRecord(row.event) && typeof row.event.id === "string" ? row.event : void 0;
	};
	const appendMessage = (input) => {
		const entry = requireEntry();
		const key = readMessageIdempotencyKey(input.message);
		const row = key ? state.pendingInputs.get(key) : void 0;
		const facts = input.custody?.facts;
		if (input.custody?.relocation !== void 0 && input.custody.relocation !== facts?.transcriptInputId) throw new SessionPendingInputCustodyError("Pending input relocation does not match its admitted transcript entry");
		const owns = facts && key === facts.idempotencyKey && facts.databasePath === path && facts.sessionKey === state.hot.target.sessionKey && facts.sessionId === entry.sessionId;
		const usesCustody = isRecord(input.message) && input.message.role === "user" && (row !== void 0 || owns);
		if (usesCustody && !owns) throw new SessionPendingInputCustodyError("Pending input cannot be appended outside its admitted turn");
		const sources = usesCustody && facts ? facts.sources ?? [facts] : [];
		const accepted = sources.map((source) => {
			const sourceRow = state.pendingInputs.get(source.idempotencyKey);
			if (source.databasePath !== path || source.sessionKey !== state.hot.target.sessionKey || source.sessionId !== entry.sessionId || sourceRow && (sourceRow.input_id !== source.inputId || sourceRow.lifecycle_generation !== source.lifecycleGeneration || sourceRow.message_json !== source.messageJson || sourceRow.state !== "queued" || sourceRow.consumed_event_id !== null && sourceRow.consumed_event_id !== facts?.transcriptInputId)) throw new SessionPendingInputCustodyError("Pending input custody changed before transcript promotion");
			if (facts?.sources && !sourceRow) throw new SessionPendingInputCustodyError("Collected input custody changed before transcript promotion");
			return sourceRow;
		});
		const promoted = usesCustody && accepted.every((value) => !value || value.consumed_event_id === facts?.transcriptInputId);
		const relocating = promoted && input.custody?.relocation !== void 0;
		const acceptedMessage = usesCustody && facts ? parseSessionPendingInputMessage(facts.messageJson) : void 0;
		const existing = findByKey(input);
		const byId = state.events.find(({ event }) => isRecord(event) && event.type === "message" && event.id === (usesCustody && facts && !relocating ? facts.transcriptInputId : input.eventId));
		const replay = existing ?? (byId && isRecord(byId.event) ? byId.event : void 0);
		const consume = (relocatedId) => {
			if (!usesCustody || !facts) return;
			const ids = [];
			if (!promoted) {
				for (const [index, source] of sources.entries()) {
					const current = accepted[index];
					if (current) {
						if (facts.sources) state.pendingInputs.set(source.idempotencyKey, {
							...current,
							consumed_event_id: facts.transcriptInputId
						});
						else state.pendingInputs.delete(source.idempotencyKey);
						ids.push(source.inputId);
					}
				}
				state.hot.pendingInputs = [...state.pendingInputs.values()].map(({ message_json: _message, ...value }) => value);
			}
			return {
				transcriptInputId: relocatedId ?? facts.transcriptInputId,
				consumedInputIds: ids
			};
		};
		if (usesCustody && facts && !promoted) admit("transaction", {
			kind: "session-message",
			check: "pending",
			authority: facts.preparedAuthority ? pending.authority(facts.agentId) : void 0
		});
		if (replay && typeof replay.id === "string") {
			if ((!input.preparedMessage || usesCustody) && !messagesMatchForIdempotentReplay(replay.message, acceptedMessage ?? input.message) || usesCustody && (relocating ? input.eventId : facts?.transcriptInputId) !== replay.id) throw new Error(`Transcript idempotency key "${key ?? input.eventId}" conflicts with the admitted message.`);
			const anchor = state.hot.transcript.anchors.find((value) => value.entryId === replay.id);
			if (usesCustody && !anchor) throw new SessionPendingInputCustodyError("Pending input is no longer active in its admitted transcript");
			return {
				result: {
					appended: false,
					message: structuredClone(replay.message),
					messageId: replay.id,
					effectiveParentId: typeof replay.parentId === "string" ? replay.parentId : null,
					...anchor ? { anchor: { ...anchor } } : {}
				},
				receipt: consume(relocating ? replay.id : void 0)
			};
		}
		if (promoted && !relocating) throw new SessionPendingInputCustodyError("Pending input custody ended before transcript promotion");
		const approvedMessage = usesCustody ? acceptedMessage : input.preparedMessage ? input.preparedMessage.message : input.message;
		if (approvedMessage === void 0) return { result: void 0 };
		checkMutation(input.expectedMutationAt);
		if (!usesCustody && input.expectedTranscript && !isDeepStrictEqual(version(), input.expectedTranscript)) throw new SqliteTranscriptMutationConflictError(entry.sessionId);
		if (!usesCustody) input.fresh?.();
		const messageJson = usesCustody && facts ? facts.messageJson : input.messageJson ?? JSON.stringify(approvedMessage);
		if (!state.events.length) writeEvent(createSessionTranscriptHeader({
			sessionId: entry.sessionId,
			cwd: input.cwd
		}));
		const messageId = usesCustody && facts && !relocating ? facts.transcriptInputId : input.eventId ?? randomUUID();
		const envelope = {
			type: "message",
			id: messageId,
			parentId: parent(input),
			timestamp: resolveTimestampMsToIsoString(input.now ?? Date.now()),
			...input.appendMode ? { appendMode: input.appendMode } : {}
		};
		const eventJson = `${JSON.stringify(envelope).slice(0, -1)},"message":${messageJson}}`;
		const event = JSON.parse(eventJson);
		if (!writeEvent(event, eventJson, input.idempotencyLookup)) throw new Error(`Transcript append did not insert message ${messageId}`);
		const anchor = state.hot.transcript.anchors.find((value) => value.entryId === messageId);
		return {
			result: {
				appended: true,
				message: JSON.parse(messageJson),
				messageId,
				effectiveParentId: envelope.parentId,
				...anchor ? { anchor: { ...anchor } } : {}
			},
			receipt: consume(relocating ? messageId : void 0)
		};
	};
	return {
		findByKey,
		appendMessage
	};
}
//#endregion
//#region src/agents/sessions/session-manager-append-codec.ts
function decodeMetadataAppendEvent(input) {
	const event = typeof input.event === "string" ? JSON.parse(input.event) : {
		...input.event,
		message: JSON.parse(input.message?.messageJson ?? "null")
	};
	if (isIndexedSessionEntry(event)) {
		if (event.type === "message" !== (typeof input.event !== "string")) throw new Error("Session message append requires prepared storage bytes");
		return event;
	}
	const header = findSessionTranscriptHeader([event]);
	if (header) return header;
	const leaf = parseOpaqueLeafEntry(event);
	if (leaf && isRecord(event) && typeof event.timestamp === "string") return {
		...leaf,
		type: "leaf",
		timestamp: event.timestamp
	};
	throw new Error("Invalid serialized session transcript entry");
}
/** Reload decisions retain the canonical adopted identity and actual append parent. */
function sessionMetadataAppendNeedsReload(input, value) {
	const event = decodeMetadataAppendEvent(input);
	if (event.type === "session" || !input.view || !value.snapshot.ok) return false;
	const committed = value.snapshot.value;
	const result = committed.result;
	if (!result) return false;
	const adoptedMessage = "messageId" in result && result.messageId !== event.id;
	if (!result.appended && !adoptedMessage) return false;
	const version = input.view.loadedVersion;
	const parent = "effectiveParentId" in result ? result.effectiveParentId : void 0;
	return adoptedMessage || Boolean(version && (committed.before.generation !== version.generation || committed.before.rawSeq !== version.rawSeq)) || parent !== void 0 && parent !== event.parentId;
}
//#endregion
//#region src/config/sessions/session-transcript-turn-state.ts
function buildRestartRecoveryExpectedState(entry, mainRestartRecovery) {
	const expectedMainRestartRecovery = mainRestartRecovery ?? entry.mainRestartRecovery;
	return {
		abortedLastRun: entry.abortedLastRun,
		mainRestartRecoveryCycleId: expectedMainRestartRecovery?.cycleId,
		mainRestartRecoveryRevision: expectedMainRestartRecovery?.revision,
		restartRecoveryBeforeAgentReplyState: entry.restartRecoveryBeforeAgentReplyState,
		restartRecoveryDeliveryReceiptState: entry.restartRecoveryDeliveryReceiptState,
		restartRecoveryDeliveryToolCallId: entry.restartRecoveryDeliveryToolCallId,
		restartRecoveryDeliveryRequestFingerprint: entry.restartRecoveryDeliveryRequestFingerprint,
		restartRecoveryDeliveryRunId: entry.restartRecoveryDeliveryRunId,
		restartRecoveryDeliverySourceRunId: entry.restartRecoveryDeliverySourceRunId,
		restartRecoveryRequesterAccountId: entry.restartRecoveryRequesterAccountId,
		restartRecoveryRequesterSenderId: entry.restartRecoveryRequesterSenderId,
		restartRecoverySameChannelThreadRequired: entry.restartRecoverySameChannelThreadRequired,
		restartRecoveryOperatorSource: entry.restartRecoveryOperatorSource,
		restartRecoverySourceIngress: entry.restartRecoverySourceIngress,
		restartRecoverySourceReplyDeliveryMode: entry.restartRecoverySourceReplyDeliveryMode,
		restartRecoveryTerminalRunIds: entry.restartRecoveryTerminalRunIds,
		status: entry.status
	};
}
function sessionMatchesExpectedTranscriptTurn(selected, expected) {
	const expectedState = expected.expectedSessionState;
	return Boolean(selected && selected.entry.sessionId === expected.expectedSessionId && (expected.expectedLifecycleRevision === void 0 || selected.entry.lifecycleRevision === (expected.expectedLifecycleRevision ?? void 0)) && (expected.expectedWriterRunId === void 0 || selected.entry.activeWriterRunId === expected.expectedWriterRunId) && (expected.expectedOwner === void 0 || selected.entry.lifecycleRevision === expected.expectedOwner.lifecycleRevision && selected.entry.activeWriterRunId === expected.expectedOwner.activeWriterRunId) && (expectedState === void 0 || selected.entry.abortedLastRun === expectedState.abortedLastRun && selected.entry.mainRestartRecovery?.cycleId === expectedState.mainRestartRecoveryCycleId && selected.entry.mainRestartRecovery?.revision === expectedState.mainRestartRecoveryRevision && selected.entry.restartRecoveryBeforeAgentReplyState === expectedState.restartRecoveryBeforeAgentReplyState && selected.entry.restartRecoveryDeliveryReceiptState === expectedState.restartRecoveryDeliveryReceiptState && selected.entry.restartRecoveryDeliveryToolCallId === expectedState.restartRecoveryDeliveryToolCallId && selected.entry.restartRecoveryDeliveryRequestFingerprint === expectedState.restartRecoveryDeliveryRequestFingerprint && selected.entry.restartRecoveryDeliveryRunId === expectedState.restartRecoveryDeliveryRunId && selected.entry.restartRecoveryDeliverySourceRunId === expectedState.restartRecoveryDeliverySourceRunId && selected.entry.restartRecoveryRequesterAccountId === expectedState.restartRecoveryRequesterAccountId && selected.entry.restartRecoveryRequesterSenderId === expectedState.restartRecoveryRequesterSenderId && selected.entry.restartRecoverySameChannelThreadRequired === expectedState.restartRecoverySameChannelThreadRequired && isDeepStrictEqual(selected.entry.restartRecoveryOperatorSource, expectedState.restartRecoveryOperatorSource) && selected.entry.restartRecoverySourceIngress === expectedState.restartRecoverySourceIngress && selected.entry.restartRecoverySourceReplyDeliveryMode === expectedState.restartRecoverySourceReplyDeliveryMode && sameRestartRecoveryTerminalRunIds(selected.entry.restartRecoveryTerminalRunIds, expectedState.restartRecoveryTerminalRunIds) && selected.entry.status === expectedState.status));
}
function buildExpectedTranscriptTurnSessionPatch(params) {
	const hasAppendedMessage = params.appendedMessages.some((message) => message.appended);
	const acceptedMessage = hasAppendedMessage || params.expectedSessionState !== void 0 && params.appendedMessages.some((message) => !message.appended);
	const touchUpdatedAt = params.touchSessionEntry === true && hasAppendedMessage ? Date.now() : 0;
	const restartRecoveryTerminalRunIds = params.sessionLifecyclePatch?.restartRecoveryTerminalRunIds ? mergeRestartRecoveryTerminalRunIds(params.currentEntry.restartRecoveryTerminalRunIds, params.sessionLifecyclePatch.restartRecoveryTerminalRunIds) : void 0;
	return {
		...acceptedMessage ? params.sessionLifecyclePatch : void 0,
		...acceptedMessage && restartRecoveryTerminalRunIds ? { restartRecoveryTerminalRunIds } : {},
		...touchUpdatedAt > 0 ? { updatedAt: Math.max(params.currentEntry.updatedAt ?? 0, params.sessionLifecyclePatch?.updatedAt ?? 0, touchUpdatedAt) } : {}
	};
}
/** Prepare the shared entry-selection policy without opening a database. */
function prepareSessionTranscriptTurnEntry(options) {
	const initialEntry = options.initialSessionEntry ? structuredClone(options.initialSessionEntry) : void 0;
	if (initialEntry && (initialEntry.sessionId !== options.expectedSessionId || options.expectedLifecycleRevision !== void 0 || options.expectedWriterRunId !== void 0 || options.expectedSessionState !== void 0)) throw new Error("Session initialization requires its new identity and no existing writer state.");
	const resolveExpectedEntry = (selected) => {
		if (options.selectedSessionId !== void 0 && ((selected?.entry.sessionId ?? null) !== options.selectedSessionId || selected?.entry.lifecycleRevision !== (options.selectedLifecycleRevision ?? void 0))) return;
		if (initialEntry) return selected ? void 0 : initialEntry;
		return sessionMatchesExpectedTranscriptTurn(selected, options) ? selected.entry : void 0;
	};
	return {
		initialEntry,
		resolveExpectedEntry
	};
}
//#endregion
//#region src/config/sessions/session-actor-memory-transcript.ts
function readableResult(result, custody) {
	if (!result) return;
	const message = result.appended && !custody ? void 0 : result.message;
	if (message !== void 0 && !isReadableSessionMessage(message)) throw new Error("Invalid serialized session transcript message");
	return {
		...result,
		message
	};
}
/** The actor's transaction owns this working copy; no operation opens a database. */
function createSessionActorMemoryTranscript(options) {
	const { state, agentId, path, admit, validateSources } = options;
	const pending = createSessionActorMemoryPending(state, options);
	const goals = createSessionActorMemoryGoals(options);
	const events = createSessionActorMemoryEvents(options);
	const { version, tree, rebasePrepared, appendRaw } = events;
	const { findByKey, appendMessage } = createSessionActorMemoryMessages(options, events);
	const requireEntry = () => {
		if (!state.hot.entry) throw new SessionTranscriptWriterClaimReboundError();
		return state.hot.entry;
	};
	const bindScope = (scope) => {
		if (scope.agentId !== void 0 && scope.agentId !== agentId || scope.sessionKey !== void 0 && resolveSqliteSessionKey(scope.sessionKey, agentId) !== state.hot.target.sessionKey || scope.storePath !== void 0 && scope.storePath !== path || !sessionMatchesExpectedTranscriptTurn(state.hot.entry ? { entry: state.hot.entry } : void 0, {
			...scope,
			expectedSessionId: scope.sessionId
		})) throw new SessionTranscriptWriterClaimReboundError();
	};
	const withCliWriter = (writer, sessionId, run) => runWithCliHistoryWriter(writer ? {
		...writer,
		target: {
			agentId,
			storePath: path,
			sessionKey: state.hot.target.sessionKey,
			sessionId
		},
		assertCurrent: () => admit("transaction"),
		assertReadable: () => admit("transaction")
	} : void 0, run);
	const metadata = (input) => {
		bindScope(input.scope);
		const event = decodeMetadataAppendEvent(input);
		const before = version();
		let result;
		let receipt;
		if (event.type === "message" && input.message) {
			if (input.message.validateTurn && !rebasePrepared(input, event.parentId)) throw new SqliteTranscriptMutationConflictError(input.scope.sessionId);
			const appended = appendMessage({
				...input.options,
				expectedMutationAt: input.message.validateTurn ? void 0 : input.options.expectedMutationAt,
				message: event.message,
				messageJson: input.message.messageJson,
				eventId: event.id,
				parentId: event.parentId,
				now: Date.parse(event.timestamp),
				cwd: input.message.cwd,
				idempotencyLookup: input.message.idempotencyLookup,
				custody: input.message.pendingInput,
				fresh: input.message.freshMessageCheck ? () => admit("transaction", {
					kind: "session-message",
					check: "fresh"
				}) : void 0
			});
			result = readableResult(appended.result, appended.receipt);
			receipt = appended.receipt;
		} else result = appendRaw(event, input.options, typeof input.event === "string" ? input.event : void 0);
		const value = {
			snapshot: {
				ok: true,
				value: {
					result,
					before,
					after: version(),
					lifecycleRevision: requireEntry().lifecycleRevision
				}
			},
			projectionNeedsReconcile: false,
			pendingInputReceipt: receipt
		};
		if (input.view && sessionMetadataAppendNeedsReload(input, value)) try {
			value.reload = {
				ok: true,
				value: readSessionActorMemoryHistory(state, input.view.limits)
			};
		} catch (error) {
			value.reload = {
				ok: false,
				error: error instanceof Error ? {
					version: 1,
					root: 0,
					nodes: [{
						type: error instanceof RangeError ? "range-error" : "error",
						name: error.name,
						message: error.message
					}]
				} : void 0
			};
		}
		return value;
	};
	return {
		append(append) {
			return withCliWriter(append.input.cliWriter, append.input.scope.sessionId, () => {
				let initialEntry;
				if (append.initialization) {
					if (append.initialization.scope.sessionId !== append.input.scope.sessionId) throw new SessionTranscriptWriterClaimReboundError();
					initialEntry = initializeSessionActorMemoryEntry(options, append.initialization);
					if (!initialEntry.owned) throw new SessionTranscriptWriterClaimReboundError();
				}
				const header = append.header ? (() => {
					if (decodeMetadataAppendEvent(append.header).type !== "session") throw new Error("Session actor header must be a session event");
					return metadata({
						...append.header,
						scope: {
							...append.header.scope,
							...initialEntry?.fence
						}
					});
				})() : void 0;
				const input = {
					...append.input,
					scope: {
						...append.input.scope,
						...initialEntry?.fence
					}
				};
				if (append.kind === "metadata") return {
					kind: "metadata",
					value: metadata({
						...append.input,
						scope: input.scope
					}),
					initialEntry,
					header
				};
				bindScope(input.scope);
				const message = JSON.parse(append.input.messageJson);
				if (!isReadableSessionMessage(message)) throw new Error("Invalid serialized session transcript message");
				const before = version();
				const appended = appendMessage({
					message,
					messageJson: append.input.messageJson,
					cwd: append.input.cwd,
					custody: append.input.pendingInput,
					fresh: append.input.freshMessageCheck ? () => admit("transaction", {
						kind: "session-message",
						check: "fresh"
					}) : void 0
				});
				return {
					kind: "message",
					initialEntry,
					header,
					value: {
						snapshot: {
							ok: true,
							value: {
								result: readableResult(appended.result, appended.receipt),
								before,
								after: version(),
								lifecycleRevision: requireEntry().lifecycleRevision,
								visibleTail: {
									entryId: tree().leafId,
									generation: version().generation
								}
							}
						},
						projectionNeedsReconcile: false,
						pendingInputReceipt: appended.receipt
					}
				};
			});
		},
		appendEvent(input) {
			const entry = requireEntry();
			if (entry.sessionId !== input.sessionId || (entry.lifecycleRevision ?? null) !== input.lifecycleRevision || input.writerRunId !== void 0 && input.writerRunId !== entry.activeWriterRunId) throw new SessionTranscriptWriterClaimReboundError();
			const event = JSON.parse(input.eventJson);
			if (isRecord(event) && event.type === "message") throw new Error("Raw event append cannot write transcript messages");
			appendRaw(event, {}, input.eventJson);
			return { projectionNeedsReconcile: false };
		},
		turn(input) {
			return withCliWriter(input.cliWriter, input.options.expectedSessionId, () => {
				const opts = input.options;
				if (opts.voiceTranscript) throw new Error("Incognito transcript commits confirm Talk metadata through the durable voice worker");
				const mutation = opts.sessionTurnMutation;
				goals.assertRouting(mutation?.routingPredicate);
				const previous = state.hot.entry;
				if (input.ownerSources?.length) {
					const sourceValidation = validateSources(input.ownerSources);
					if (sourceValidation.refusedSource) throw new SessionTranscriptWriterClaimReboundError();
					admit("transaction", {
						kind: "session-turn-owner",
						sourceValidation
					});
				}
				const replay = mutation ? goals.readReceipt(opts.expectedSessionId, mutation.operation) : void 0;
				if (replay && previous?.sessionId === opts.expectedSessionId) return {
					kind: "session-turn",
					result: {
						appendedMessages: [],
						sessionEntry: structuredClone(previous),
						sessionFile: opts.sessionFile,
						sessionTurnMutationResult: {
							result: replay,
							replayed: true
						}
					},
					sequences: [],
					projectionNeedsReconcile: false
				};
				if (opts.initialSessionEntry && (previous || opts.initialSessionEntry.sessionId !== opts.expectedSessionId || opts.expectedLifecycleRevision !== void 0 || opts.expectedWriterRunId !== void 0 || opts.expectedSessionState !== void 0)) throw new SessionTranscriptWriterClaimReboundError();
				if (opts.selectedSessionId !== void 0 && ((previous?.sessionId ?? null) !== opts.selectedSessionId || previous?.lifecycleRevision !== (opts.selectedLifecycleRevision ?? void 0))) throw new SessionTranscriptWriterClaimReboundError();
				if (!opts.initialSessionEntry && !sessionMatchesExpectedTranscriptTurn(previous ? { entry: previous } : void 0, opts)) throw new SessionTranscriptWriterClaimReboundError();
				if (opts.initialSessionEntry) state.hot.entry = structuredClone(opts.initialSessionEntry);
				const entry = requireEntry();
				if (opts.acceptedResultGuard) {
					const error = resolveSessionWorkStartError(state.hot.target.sessionKey, entry, {
						expectedSessionId: opts.expectedSessionId,
						purpose: "accepted-result-settlement"
					});
					if (entry.activeWriterRunId !== (opts.acceptedResultGuard.expectedWriterRunId ?? void 0) || error) throw new Error(error ?? opts.acceptedResultGuard.errorMessage);
				}
				const goal = mutation ? applySessionGoalOperation(entry, mutation.operation, Date.now()) : void 0;
				if (goal && opts.preparedGoalId) goal.id = opts.preparedGoalId;
				const transactionVersion = version();
				for (const append of opts.messages) {
					if (!append.preparedMessage?.prepared) continue;
					const event = findByKey(append);
					const current = event ? {
						messageId: event.id,
						message: event.message
					} : void 0;
					if (!isDeepStrictEqual(current, append.preparedMessage.expected)) throw new Error("Transcript idempotency changed while preparing the turn");
				}
				let custody;
				const appendedMessages = [];
				let predicateSkipped = false;
				for (const [index, append] of opts.messages.entries()) {
					const predicate = append.predicate;
					if (predicate?.kind === "active-entry") {
						if (!state.hot.transcript.anchors.some((anchor) => anchor.entryId === predicate.entryId)) throw new Error(predicate.errorMessage);
					} else if (predicate) {
						const latest = selectSessionTranscriptTreePathNodes(tree(), tree().leafId).findLast(({ entry: event }) => isRecord(event) && event.type === "message" && isRecord(event.message) && event.message.role === "assistant")?.entry;
						const message = isRecord(latest) ? latest.message : void 0;
						if (resolveTerminalAssistantTranscriptRunId(message, readSessionTranscriptRunId(message)) === predicate.runId && extractAssistantPhaseText(message)?.trim() === predicate.text) {
							predicateSkipped = true;
							continue;
						}
					}
					const committed = appendMessage({
						...append,
						message: prepareSessionTurnGoalMessage(append.message, mutation, goal?.id),
						cwd: append.cwd ?? opts.cwd,
						custody: input.custody ? {
							facts: input.custody,
							relocation: input.relocation
						} : void 0,
						fresh: () => {
							if (append.preparedMessage && !append.preparedMessage.prepared || append.preparationVersion && !isDeepStrictEqual(append.preparationVersion, transactionVersion)) throw new SqliteTranscriptMutationConflictError(entry.sessionId);
							if (append.freshGuard) {
								const sourceValidation = validateSources(append.sources);
								if (sourceValidation.refusedSource) throw new SessionTranscriptWriterClaimReboundError();
								admit("transaction", {
									kind: "session-turn-fresh",
									index,
									sourceValidation
								});
							}
						}
					});
					if (committed.result) appendedMessages.push(committed.result);
					if (committed.receipt) custody = {
						transcriptInputId: committed.receipt.transcriptInputId,
						consumedInputIds: [.../* @__PURE__ */ new Set([...custody?.consumedInputIds ?? [], ...committed.receipt.consumedInputIds])]
					};
				}
				if (opts.atomicGroup && (appendedMessages.length !== opts.messages.length || appendedMessages.some((message) => message.appended) !== appendedMessages.every((message) => message.appended))) throw new Error("Transcript batch was not wholly inserted or replayed");
				if ((mutation || opts.initialSessionEntry) && (!appendedMessages.length || appendedMessages.length !== opts.messages.length || appendedMessages.some((message) => !message.appended))) throw new Error(mutation ? "Goal admission requires a new transcript turn in the same transaction." : "Session initialization requires a new transcript turn in the same transaction.");
				const patch = {
					...buildExpectedTranscriptTurnSessionPatch({
						appendedMessages,
						currentEntry: requireEntry(),
						expectedSessionState: opts.expectedSessionState,
						sessionLifecyclePatch: opts.sessionLifecyclePatch,
						touchSessionEntry: opts.touchSessionEntry
					}),
					...mutation ? { goal } : {}
				};
				state.hot.entry = Object.keys(patch).length ? mergeSessionEntry(requireEntry(), patch) : requireEntry();
				return {
					kind: "session-turn",
					result: {
						appendedMessages,
						predicateSkipped,
						sessionEntry: structuredClone(state.hot.entry),
						sessionFile: opts.sessionFile,
						transcriptVersion: version(),
						...mutation ? { sessionTurnMutationResult: {
							result: goals.commitReceipt(opts.expectedSessionId, mutation.operation, goal, mutation.runId),
							replayed: false
						} } : {}
					},
					sequences: appendedMessages.map((message) => {
						const position = message.appended ? state.hot.transcript.anchors.find((anchor) => anchor.entryId === message.messageId)?.activeMessagePosition : void 0;
						return position === void 0 ? void 0 : position + 1;
					}),
					projectionNeedsReconcile: false,
					custody,
					...input.custody?.preparedAuthority ? { authority: pending.authority(input.custody.agentId) } : {}
				};
			});
		}
	};
}
//#endregion
//#region src/config/sessions/session-actor-memory-metadata.ts
/** Metadata participates in the actor's working copy and commits with its other domains. */
function createSessionActorMemoryMetadata(context) {
	const { state, agentId, path } = context;
	const events = createSessionActorMemoryEvents(context);
	const transcript = createSessionActorMemoryTranscript(context);
	const assertTarget = (scope) => {
		if (scope.agentId !== void 0 && scope.agentId !== agentId || scope.storePath !== void 0 && scope.storePath !== path || scope.sessionKey !== void 0 && resolveSqliteSessionKey(scope.sessionKey, agentId) !== state.hot.target.sessionKey) throw new SessionTranscriptWriterClaimReboundError();
	};
	const scopeIsCurrent = (scope) => sessionMatchesExpectedTranscriptTurn(state.hot.entry ? { entry: state.hot.entry } : void 0, {
		...scope,
		expectedSessionId: scope.sessionId
	});
	const assertScope = (scope) => {
		if (!scopeIsCurrent(scope)) throw new SessionTranscriptWriterClaimReboundError();
	};
	const replaceSuffix = (input) => {
		if (!scopeIsCurrent(input.scope)) {
			if (input.scope.expectedWriterRunId !== void 0) throw new SessionTranscriptWriterClaimReboundError();
			return {
				replaced: false,
				projectionNeedsReconcile: false
			};
		}
		const [expectedEvents, nextEvents, prefixLength, expectedMutationAt, startsAtPrefix, retainedIds] = input.args;
		const incremental = prefixLength > 0 || startsAtPrefix;
		const expected = (startsAtPrefix ? expectedEvents : expectedEvents.slice(prefixLength)).map(canonicalizeTranscriptEventMedia);
		const next = (startsAtPrefix ? nextEvents : nextEvents.slice(prefixLength)).map(canonicalizeTranscriptEventMedia);
		const stored = incremental ? state.events.filter((row) => row.rawSeq >= prefixLength) : state.events;
		const retained = new Set(retainedIds);
		const projectRetained = (event) => {
			if (isRecord(event) && event.type === "custom" && typeof event.id === "string" && retained.has(event.id)) {
				const { data: _data, ...rest } = event;
				return rest;
			}
			return event;
		};
		if (expectedMutationAt !== void 0 && expectedMutationAt !== events.version().updatedAt || stored.length !== expected.length || stored.some((row, index) => !isDeepStrictEqual(projectRetained(row.event), expected[index]))) throw new Error(`SQLite transcript changed while preparing suffix removal for ${input.scope.sessionId}`);
		let common = 0;
		while (common < expected.length && common < next.length && isDeepStrictEqual(expected[common], next[common])) common++;
		const unchanged = common === expected.length && common === next.length;
		if (next.length > expected.length || !incremental && !unchanged && common === 0) throw new Error(`Transcript mutation is not a bounded suffix removal for ${input.scope.sessionId}`);
		if (incremental && unchanged) return {
			replaced: true,
			version: events.version(),
			projectionNeedsReconcile: false
		};
		const originals = new Map(stored.flatMap((row) => isRecord(row.event) && typeof row.event.id === "string" ? [[row.event.id, row]] : []));
		const preserved = state.events.slice(0, state.events.length - stored.length + common);
		const startSeq = stored[common]?.rawSeq ?? (stored.at(-1)?.rawSeq ?? prefixLength - 1) + 1;
		const replacements = next.slice(common).map((event, index) => {
			const original = isRecord(event) && typeof event.id === "string" ? originals.get(event.id) : void 0;
			let nextEvent = event;
			if (isRecord(event) && event.type === "custom" && typeof event.id === "string" && retained.has(event.id)) {
				if (!original || !isRecord(original.event)) throw new Error("Retained transcript data has no original suffix row");
				const projected = projectRetained(original.event);
				if (!isRecord(projected)) throw new Error("Retained transcript data has no original suffix row");
				const { parentId: _oldParent, ...before } = projected;
				const { parentId, ...after } = event;
				if (Object.hasOwn(after, "data") || !isDeepStrictEqual(before, after) || parentId !== null && typeof parentId !== "string") throw new Error("Retained transcript data permits only parent repair");
				nextEvent = {
					...original.event,
					parentId
				};
			}
			const eventJson = original && isDeepStrictEqual(original.event, nextEvent) ? original.eventJson : JSON.stringify(nextEvent);
			return {
				rawSeq: startSeq + index,
				event: JSON.parse(eventJson),
				eventJson
			};
		});
		events.replaceRows([...preserved, ...replacements]);
		return {
			replaced: true,
			version: events.version(),
			projectionNeedsReconcile: false
		};
	};
	function execute(command) {
		const { scope } = command.input;
		assertTarget(scope);
		switch (command.type) {
			case "session.metadata.mutation": return resolveSessionActorMemoryWindow(state, scope.sessionId)?.hot.transcript.version.updatedAt ?? null;
			case "session.metadata.initialize": return initializeSessionActorMemoryEntry(context, command.input);
			case "session.metadata.append": {
				const result = transcript.append({
					kind: "metadata",
					input: command.input
				});
				if (result.kind !== "metadata") throw new Error("Metadata append returned another operation");
				return result.value;
			}
			case "session.transcript.appendMessage": {
				const result = transcript.append({
					kind: "message",
					input: command.input
				});
				if (result.kind !== "message") throw new Error("Message append returned another operation");
				return result.value;
			}
			case "session.transcript.branch": {
				assertScope(scope);
				const previous = state.hot.entry;
				if (previous.lifecycleRevision !== command.input.expectedLifecycleRevision) throw new SessionTranscriptWriterClaimReboundError();
				const next = {
					...previous,
					sessionId: command.input.branch.sessionId,
					updatedAt: Date.now()
				};
				const installed = installSessionActorMemoryEntry(state, next);
				const rows = command.input.branch.events.map((event, rawSeq) => {
					const eventJson = JSON.stringify(canonicalizeTranscriptEventMedia(event));
					return {
						rawSeq,
						event: JSON.parse(eventJson),
						eventJson
					};
				});
				events.replaceRows(rows);
				return {
					identity: {
						previous: /* @__PURE__ */ new Map([[state.hot.target.sessionKey, structuredClone(previous)]]),
						current: /* @__PURE__ */ new Map([[state.hot.target.sessionKey, structuredClone(installed)]])
					},
					version: events.version(),
					projectionNeedsReconcile: false
				};
			}
			case "session.transcript.replaceSuffix": return replaceSuffix(command.input);
			case "session.transcript.rewrite": {
				assertScope(scope);
				const { version, appendParentId, sources, pendingInput } = command.input;
				const current = events.version();
				if (current.generation !== version.generation || current.rawSeq !== version.rawSeq || events.tree().appendParentId !== appendParentId) throw new Error("Session transcript changed before rewrite publication");
				const original = new Map(sources);
				for (const source of original.values()) {
					const row = state.events.find(({ event }) => isRecord(event) && event.id === source.id);
					if (!row || !isDeepStrictEqual(row.event, source)) throw new Error("Session transcript changed before rewrite publication");
				}
				const entries = structuredClone(command.input.entries);
				const messages = createSessionActorMemoryMessages(context, events);
				let pendingInputReceipt;
				for (const entry of entries) if (entry.type === "message") {
					const source = original.get(entry.id);
					if (!source) throw new Error("Transcript rewrite message has no source entry");
					const appended = messages.appendMessage({
						eventId: entry.id,
						parentId: entry.parentId,
						now: Date.parse(entry.timestamp),
						message: entry.message,
						appendMode: entry.appendMode,
						idempotencyLookup: "caller-checked",
						custody: pendingInput ? {
							...pendingInput,
							relocation: source.id
						} : void 0
					});
					if (!appended.result?.appended || appended.result.messageId !== entry.id) throw new Error("Transcript rewrite message was not appended");
					if (!isReadableSessionMessage(appended.result.message)) throw new Error("Transcript rewrite produced an invalid message");
					entry.message = appended.result.message;
					pendingInputReceipt = appended.receipt ?? pendingInputReceipt;
				} else if (!events.appendRaw(entry).appended) throw new Error("Transcript rewrite entry was not appended");
				return {
					version: events.version(),
					entries,
					pendingInputReceipt,
					projectionNeedsReconcile: false
				};
			}
			case "session.transcript.compactionBoundary": {
				const { prepared } = command.input;
				assertTarget(prepared.scope);
				if (prepared.scope.sessionId !== scope.sessionId) throw new SessionTranscriptWriterClaimReboundError();
				let initialEntry;
				if (prepared.initializeEntry) {
					initialEntry = initializeSessionActorMemoryEntry(context, {
						scope: prepared.scope,
						entry: {
							sessionId: scope.sessionId,
							updatedAt: Date.now()
						},
						initialWriterRunId: command.input.initialWriterRunId
					});
					if (!initialEntry.owned) throw new Error("Session transcript header was not persisted");
				}
				assertScope({
					...scope,
					...initialEntry?.fence
				});
				assertScope({
					...prepared.scope,
					...initialEntry?.fence
				});
				if (prepared.event.type !== "compaction") throw new Error("Compaction boundary validation failed");
				const event = {
					...prepared.event,
					parentId: events.parent({
						parentId: prepared.event.parentId,
						appendIntent: prepared.appendIntent
					})
				};
				const before = events.version();
				if (!events.appendRaw(event, { expectedMutationAt: prepared.expectedMutationAt }).appended) throw new Error(`Session transcript entry was not persisted: ${event.id}`);
				state.hot.entry = {
					...state.hot.entry,
					...projectCompactionAccountingPatch(state.hot.entry, {
						compactionKind: "context-engine",
						transcriptByteCompactionLatch: command.input.transcriptByteCompactionLatch
					})
				};
				return {
					committed: {
						result: event,
						before,
						after: events.version()
					},
					initialEntry,
					projectionNeedsReconcile: false
				};
			}
		}
		throw new Error("Unknown memory metadata operation");
	}
	return { execute };
}
//#endregion
//#region src/sessions/user-turn-transcript.message.ts
const URL_LIKE_MEDIA_PATH_PATTERN = /^[a-z][a-z0-9+.-]*:/i;
const STRUCTURED_MEDIA_KINDS = /* @__PURE__ */ new Set([
	"image",
	"audio",
	"video",
	"document",
	"sticker",
	"unknown"
]);
const MIME_TYPE_PATTERN = /^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/iu;
function isStructuredMediaKind(kind) {
	return kind !== void 0 && STRUCTURED_MEDIA_KINDS.has(kind);
}
function resolveTranscriptMediaPath(pathValue, workspaceDir) {
	if (!workspaceDir || path.isAbsolute(pathValue) || URL_LIKE_MEDIA_PATH_PATTERN.test(pathValue)) return pathValue;
	return path.join(workspaceDir, pathValue);
}
function normalizeStructuredMediaEntryForTranscript(media) {
	const workspaceDir = normalizeOptionalString(media.workspaceDir);
	const mediaPath = normalizeOptionalString(media.path);
	const mediaUrl = normalizeOptionalString(media.url);
	const legacyKind = normalizeOptionalString(media.kind);
	const kind = isStructuredMediaKind(legacyKind) ? legacyKind : void 0;
	const messageId = normalizeOptionalString(media.messageId);
	const contentType = normalizeOptionalString(media.contentType) ?? (kind || !legacyKind || !MIME_TYPE_PATTERN.test(legacyKind) ? void 0 : legacyKind) ?? mimeTypeFromFilePath(mediaPath ?? mediaUrl);
	const durationMs = asPositiveSafeInteger(media.durationMs);
	const width = asPositiveSafeInteger(media.width);
	const height = asPositiveSafeInteger(media.height);
	const fileName = normalizeOptionalString(media.fileName);
	const sizeBytes = asFiniteNumberInRange(media.sizeBytes, { min: 0 });
	return {
		...mediaPath ? { path: resolveTranscriptMediaPath(mediaPath, workspaceDir) } : {},
		...mediaUrl ? { url: mediaUrl } : {},
		...contentType ? { contentType } : {},
		...kind ? { kind } : {},
		...fileName ? { fileName } : {},
		...media.origin === "paste" || media.origin === "file" ? { origin: media.origin } : {},
		...sizeBytes !== void 0 ? { sizeBytes } : {},
		...durationMs ? { durationMs } : {},
		...width ? { width } : {},
		...height ? { height } : {},
		...media.transcribed === true ? { transcribed: true } : {},
		...messageId ? { messageId } : {},
		...workspaceDir ? { workspaceDir } : {},
		...media.hydrationSuppressed === true ? { hydrationSuppressed: true } : {}
	};
}
function resolvePersistedUserTurnText(value) {
	return normalizeOptionalString(value);
}
function buildPersistedUserTurnMediaInputsFromFields(fields) {
	const normalizedMedia = (fields ? readPersistedMediaFacts(fields) ?? [] : []).map((fact) => {
		const mediaPath = fact.path ? resolveTranscriptMediaPath(fact.path, fact.workspaceDir) : void 0;
		const url = fact.url;
		if (!mediaPath && !url) return {};
		const media = { contentType: fact.contentType ?? mimeTypeFromFilePath(mediaPath ?? url) };
		const set = (key, value) => {
			if (value !== void 0) media[key] = value;
		};
		set("path", mediaPath);
		set("url", url);
		set("kind", fact.kind);
		set("fileName", fact.fileName);
		set("origin", fact.origin);
		set("sizeBytes", fact.sizeBytes);
		set("durationMs", fact.durationMs);
		set("width", fact.width);
		set("height", fact.height);
		return media;
	});
	return normalizedMedia.some((entry) => entry.path || entry.url) ? normalizedMedia : [];
}
function buildLateMediaAttachedProjection(message) {
	const media = readOpenClawMessageMeta(message)?.lateMedia === true ? readPersistedMediaFacts(message) ?? [] : [];
	const text = media.flatMap((fact) => {
		const mediaRef = fact.path ?? fact.url;
		return mediaRef ? [`[media attached: ${mediaRef}]`] : [];
	}).join("\n");
	return {
		...text ? { text } : {},
		media
	};
}
function readOpenClawMessageMeta(message) {
	return asOptionalRecord(Reflect.get(message, "__openclaw"));
}
function readModelPromptProjection(message) {
	if (!isUserMessage(message)) return;
	const metadata = readOpenClawMessageMeta(message);
	if (!metadata || !Object.hasOwn(metadata, "modelPromptProjection")) return;
	const projection = asOptionalRecord(metadata.modelPromptProjection);
	if (projection?.version !== 1 || typeof projection.text !== "string") throw new Error("Unsupported or invalid user-turn model prompt projection; update OpenClaw to a compatible version or start a new session.");
	return projection.text;
}
function projectRecordedModelPrompt(message, transcript) {
	if (!isUserMessage(message)) return message;
	const text = readModelPromptProjection(transcript) ?? readModelPromptProjection(message);
	if (text === void 0) return message;
	let content = message.content;
	if (Array.isArray(content)) {
		let replaced = false;
		content = content.map((block) => {
			if (block.type !== "text" || replaced) return block;
			replaced = true;
			return {
				...block,
				text
			};
		});
		if (!replaced) content = [{
			type: "text",
			text
		}, ...content];
	} else content = text;
	const metadata = { ...message["__openclaw"] };
	delete metadata.modelPromptProjection;
	const projected = {
		...message,
		content,
		timestamp: transcript?.role === "user" ? transcript.timestamp : message.timestamp
	};
	delete projected["__openclaw"];
	if (Object.keys(metadata).length > 0) projected["__openclaw"] = metadata;
	return projected;
}
function buildPersistedUserTurnMessage(params) {
	const normalizedMedia = (params.media ?? []).map(normalizeStructuredMediaEntryForTranscript);
	const text = params.text ?? "";
	const openClawMeta = buildPersistedUserTurnMetadata(params, normalizedMedia);
	const message = {
		role: "user",
		...params.display === false ? { display: false } : {},
		...params.excludeFromContext ? { excludeFromContext: true } : {},
		content: text,
		timestamp: params.timestamp ?? Date.now(),
		...params.idempotencyKey ? { idempotencyKey: params.idempotencyKey } : {},
		...Object.keys(openClawMeta).length > 0 ? { __openclaw: openClawMeta } : {}
	};
	return applyInputProvenanceToUserMessage(message, params.provenance);
}
function resolvePersistedUserTurnMessage(params) {
	return params.message ?? (params.input ? buildPersistedUserTurnMessage(params.input) : void 0);
}
function isUserMessage(message) {
	return asOptionalRecord(message)?.role === "user";
}
function buildLateResolvedMediaMessage(params) {
	const admittedMedia = buildPersistedUserTurnMediaInputsFromFields(params.admittedMessage);
	const resolvedMedia = buildPersistedUserTurnMediaInputsFromFields(params.resolvedMessage);
	if (resolvedMedia.length === 0 || JSON.stringify(resolvedMedia) === JSON.stringify(admittedMedia)) return;
	const resolvedIdempotencyKey = Reflect.get(params.resolvedMessage, "idempotencyKey");
	const resolvedTimestamp = Reflect.get(params.resolvedMessage, "timestamp");
	const admittedContent = params.admittedMessage?.content;
	const resolvedContent = params.resolvedMessage.content;
	let content = resolvedContent;
	if (resolvedContent === admittedContent) content = "";
	else if (Array.isArray(resolvedContent) && typeof admittedContent === "string") content = resolvedContent.filter((block) => {
		const textBlock = asOptionalRecord(block);
		return textBlock?.type !== "text" || textBlock.text !== admittedContent;
	});
	const idempotencyKey = typeof resolvedIdempotencyKey === "string" && resolvedIdempotencyKey.length > 0 ? `${resolvedIdempotencyKey}:late-media` : `late-media:${typeof resolvedTimestamp === "number" ? resolvedTimestamp : Date.now()}`;
	const metadata = {
		...readOpenClawMessageMeta(params.resolvedMessage),
		lateMedia: true
	};
	delete metadata.humanMentions;
	delete metadata.modelPromptProjection;
	return {
		...params.resolvedMessage,
		content,
		idempotencyKey,
		__openclaw: metadata
	};
}
function mergePreparedUserTurnMessageForRuntime(params) {
	if (!params.preparedMessage || !isUserMessage(params.runtimeMessage) || readOpenClawMessageMeta(params.runtimeMessage)?.beforeAgentRunBlocked !== void 0) return params.runtimeMessage;
	const runtimeMeta = readOpenClawMessageMeta(params.runtimeMessage);
	const preparedMeta = readOpenClawMessageMeta(params.preparedMessage);
	return {
		...params.runtimeMessage,
		...params.preparedMessage,
		...preparedMeta ? { __openclaw: {
			...runtimeMeta,
			...preparedMeta
		} } : {},
		...Array.isArray(params.runtimeMessage.content) && params.runtimeMessage.content.some((block) => asOptionalRecord(block)?.type === "image") ? { content: params.runtimeMessage.content } : {}
	};
}
//#endregion
//#region src/config/sessions/session-transcript-rewrite-effects.ts
function transcriptRewritePreservesAdmission(beforeJson, afterJson) {
	const before = JSON.parse(beforeJson);
	const after = JSON.parse(afterJson);
	const beforeMetadata = isRecord(before) && isUserMessage(before.message) ? before.message["__openclaw"] : void 0;
	const previousSteerTarget = beforeMetadata?.steerTargetRunId;
	const previousProjection = beforeMetadata?.modelPromptProjection;
	for (const event of [before, after]) {
		if (!isRecord(event) || event.type !== "message" || !isUserMessage(event.message)) return false;
		const metadata = event.message["__openclaw"];
		if (metadata !== void 0 && !isRecord(metadata)) return false;
		if (event === after && (previousSteerTarget !== void 0 || metadata?.steerTargetRunId !== void 0)) {
			const target = normalizePersistedSteerTargetRunId(metadata?.steerTargetRunId);
			if (!target || target !== metadata?.steerTargetRunId) return false;
		}
		if (metadata) {
			delete metadata.steerTargetRunId;
			if (event === after && previousProjection === void 0 && metadata.modelPromptProjection) {
				const projection = metadata.modelPromptProjection;
				if (!isRecord(projection) || projection.version !== 1 || typeof projection.text !== "string") return false;
				const projected = projectRecordedModelPrompt(event.message);
				if (!isDeepStrictEqual(projected.content, event.message.content)) return false;
				delete metadata.modelPromptProjection;
			}
			if (Object.keys(metadata).length === 0) delete event.message["__openclaw"];
		}
	}
	return isDeepStrictEqual(before, after);
}
function transcriptRewritePreservesProjection(beforeJson, afterJson) {
	const before = JSON.parse(beforeJson);
	const after = JSON.parse(afterJson);
	if (!isRecord(before) || !isRecord(after)) return false;
	const { message: _beforeMessage, ...beforeEnvelope } = before;
	const { message: _afterMessage, ...afterEnvelope } = after;
	return isDeepStrictEqual(beforeEnvelope, afterEnvelope) && hasTranscriptMessage(before) === hasTranscriptMessage(after) && transcriptEventContextEligibility(before) === transcriptEventContextEligibility(after) && isDeepStrictEqual(extractTranscriptIndexEntry(before, 0), extractTranscriptIndexEntry(after, 0));
}
//#endregion
//#region src/config/sessions/session-actor-memory-message-rewrite.ts
function prepareSessionActorMemoryMessageRewrite({ state }, input) {
	const { expectedEntry, target } = input;
	if (expectedEntry && (!sessionMatchesExpectedTranscriptTurn(state.hot.entry ? { entry: state.hot.entry } : void 0, {
		expectedSessionId: input.scope.sessionId,
		expectedLifecycleRevision: expectedEntry.lifecycleRevision,
		expectedOwner: expectedEntry.owner
	}) || expectedEntry.activeWriterRunId !== void 0 && state.hot.entry?.activeWriterRunId !== (expectedEntry.activeWriterRunId ?? void 0))) throw new SessionTranscriptWriterClaimReboundError();
	if (target.kind === "anchor" && target.active) {
		const active = state.hot.transcript.anchors.find((anchor) => anchor.entryId === target.anchor.entryId);
		if (target.active === "exact" ? !isDeepStrictEqual(active, target.anchor) : active?.rawSeq !== target.anchor.rawSeq) throw new SessionTranscriptWriterClaimReboundError();
	}
	const row = target.kind === "anchor" ? state.events.find((candidate) => candidate.rawSeq === target.anchor.rawSeq) : state.events.findLast(({ event }) => isRecord(event) && isRecord(event.message) && readSessionTranscriptRunId(event.message) === target.runId && resolveTerminalAssistantTranscriptRunId(event.message, target.runId) !== void 0);
	if (!row || !isRecord(row.event) || row.event.type !== "message" || typeof row.event.id !== "string" || target.kind === "anchor" && row.event.id !== target.anchor.entryId) return null;
	return {
		seq: row.rawSeq,
		eventJson: row.eventJson,
		event: structuredClone(row.event)
	};
}
function commitSessionActorMemoryMessageRewrite(context, input) {
	const current = prepareSessionActorMemoryMessageRewrite(context, input);
	if (!current || current.seq !== input.expected.seq || current.eventJson !== input.expected.eventJson) throw new SessionTranscriptWriterClaimReboundError();
	const changed = input.message !== void 0;
	if (changed) {
		const event = canonicalizeTranscriptEventMedia({
			...current.event,
			message: input.message
		});
		const eventJson = JSON.stringify(event);
		createSessionActorMemoryEvents(context).replaceRows(context.state.events.map((row) => row.rawSeq === current.seq ? {
			...row,
			event,
			eventJson
		} : row), { preserveGeneration: transcriptRewritePreservesAdmission(current.eventJson, eventJson) });
	}
	const generation = context.state.hot.transcript.version.generation;
	return {
		kind: "session-message-rewrite",
		result: generation && (changed || input.target.kind === "terminal-assistant") ? {
			generation,
			messageId: String(current.event.id),
			message: changed ? input.message : current.event.message
		} : null
	};
}
//#endregion
//#region src/gateway/worker-environments/transcript-commit-policy.ts
var TranscriptCommitNavigation = class extends SessionEntryNavigation {
	constructor(events) {
		super();
		this.entries = [];
		for (const event of events) {
			const { entry, recognized } = classifySessionFileEntry(event, 3);
			if (recognized && entry.type !== "session") {
				this.entries.push(entry);
				this.appendCanonicalNavigationEntry(entry);
			} else this.appendOpaqueNavigationRecord(entry);
		}
		this.finishNavigation();
	}
	snapshot() {
		return {
			branch: this.getBranch(),
			leafId: this.leafId,
			appendParentId: this.appendParentId,
			entries: this.entries.filter((entry) => this.byId.has(entry.id)).map((entry) => this.normalizeEntryParent(entry))
		};
	}
};
function isCommittedAgentMessage(message) {
	if (!isRecord(message)) return false;
	const role = message.role;
	return (role === "user" || role === "assistant" || role === "toolResult" || role === "custom" && (message.customType === "openclaw.runtime-context" || message.customType === "openclaw.system-update")) && readTranscriptMessageIdempotencyKey(message) !== void 0;
}
function resolveActiveCommitPrefix(params) {
	const { activeBranch } = params;
	if (params.activeLeafId === params.baseLeafId) return {
		ok: true,
		recoveredMessages: []
	};
	const baseIndex = params.baseLeafId === null ? -1 : activeBranch.findIndex((entry) => entry.id === params.baseLeafId);
	if (params.baseLeafId !== null && baseIndex < 0) return { ok: false };
	const activeSuffix = activeBranch.slice(baseIndex + 1);
	if (activeSuffix.length === 0) return { ok: false };
	const recoveredMessages = [];
	for (const [index, entry] of activeSuffix.slice(0, params.messages.length).entries()) {
		const expectedKey = readTranscriptMessageIdempotencyKey(params.messages[index])?.trim();
		if (entry.type !== "message" || !expectedKey || !isCommittedAgentMessage(entry.message) || readTranscriptMessageIdempotencyKey(entry.message)?.trim() !== expectedKey) return { ok: false };
		recoveredMessages.push({
			appended: false,
			message: entry.message,
			messageId: entry.id
		});
	}
	return {
		ok: true,
		recoveredMessages
	};
}
function resolvePersistedCommitAcrossDag(params) {
	const childrenByParent = /* @__PURE__ */ new Map();
	for (const entry of params.entries) {
		const children = childrenByParent.get(entry.parentId) ?? [];
		children.push(entry);
		childrenByParent.set(entry.parentId, children);
	}
	const completedPaths = [];
	const visit = (parentId, messageIndex, path) => {
		if (completedPaths.length > 1) return;
		if (messageIndex === params.messages.length) {
			completedPaths.push(path);
			return;
		}
		const expectedKey = readTranscriptMessageIdempotencyKey(params.messages[messageIndex])?.trim();
		if (!expectedKey) return;
		for (const entry of childrenByParent.get(parentId) ?? []) {
			if (entry.type !== "message" || !isCommittedAgentMessage(entry.message) || readTranscriptMessageIdempotencyKey(entry.message)?.trim() !== expectedKey) continue;
			visit(entry.id, messageIndex + 1, [...path, {
				appended: false,
				message: entry.message,
				messageId: entry.id
			}]);
		}
	};
	visit(params.baseLeafId, 0, []);
	if (completedPaths.length > 1) return { kind: "ambiguous" };
	const messages = completedPaths[0];
	return messages ? {
		kind: "found",
		messages
	} : { kind: "missing" };
}
function prepareTranscriptCommitFromSnapshot(input, entry, readSnapshot) {
	if (!entry || entry.sessionId !== input.scope.sessionId) return {
		result: {
			ok: false,
			reason: "session-not-attached"
		},
		parentId: null,
		nextMessageSeq: 0
	};
	if (input.lifecycleRevision !== void 0 && entry.lifecycleRevision !== input.lifecycleRevision) return {
		result: {
			ok: false,
			reason: "invalid-batch"
		},
		parentId: null,
		nextMessageSeq: 0
	};
	const snapshot = readSnapshot();
	if (snapshot.events.length > 0) assertCurrentSessionTranscriptHeader(findSessionTranscriptHeader(snapshot.events));
	const navigation = new TranscriptCommitNavigation(snapshot.events).snapshot();
	const activeBranch = navigation.branch;
	const activeVisibleEntries = activeBranch.filter((event) => event.type === "message" || event.type === "compaction");
	const plan = (result, nextMessageSeq = 0) => {
		let applied = result;
		if (result.ok && result.messages.length > 0) {
			const activeSequences = new Map(activeVisibleEntries.map((event, index) => [event.id, index + 1]));
			applied = {
				...result,
				messages: result.messages.map((message) => {
					const messageSeq = activeSequences.get(message.messageId);
					return messageSeq === void 0 ? message : {
						...message,
						messageSeq
					};
				})
			};
		}
		return {
			result: applied,
			version: snapshot.version,
			nextMessageSeq,
			parentId: navigation.appendParentId
		};
	};
	if (input.recoverPersistedBatch) {
		const recovered = resolvePersistedCommitAcrossDag({
			baseLeafId: input.requestedBaseLeafId,
			entries: navigation.entries,
			messages: input.messages
		});
		if (recovered.kind === "found") return plan({
			ok: true,
			messages: recovered.messages,
			lifecycleRevision: entry.lifecycleRevision
		});
		if (recovered.kind === "ambiguous") return plan({
			ok: false,
			reason: "invalid-batch"
		});
	}
	const prefix = resolveActiveCommitPrefix({
		baseLeafId: input.requestedBaseLeafId,
		activeBranch,
		activeLeafId: navigation.leafId,
		messages: input.messages
	});
	return prefix.ok ? plan({
		ok: true,
		messages: prefix.recoveredMessages,
		lifecycleRevision: entry.lifecycleRevision
	}, activeVisibleEntries.length) : plan({
		ok: false,
		reason: "stale-base-leaf"
	});
}
//#endregion
//#region src/config/sessions/session-actor-memory-worker-transcript.ts
const validation = createWorkerLedgerInputValidation("Worker transcript commit");
function commitSessionActorMemoryWorkerTranscript(context, input) {
	const { state, agentId } = context;
	const { scope, receipt } = input;
	const runEpoch = validation.integer(receipt.runEpoch, "run epoch");
	const seq = validation.integer(receipt.seq, "sequence", 1);
	const environmentId = validation.required(receipt.environmentId, "environment id");
	const requestHash = validation.requestHash(receipt.requestHash);
	if (validation.required(receipt.sessionId, "session id") !== scope.sessionId) throw new Error("Transcript receipt belongs to another session");
	const current = state.workerTranscriptCommits.get(runEpoch);
	const prior = current?.receipts.get(seq);
	const rejected = () => ({
		result: {
			ok: false,
			reason: "invalid-batch"
		},
		outcome: {
			ok: false,
			reason: "invalid-batch"
		},
		replayed: false
	});
	if (current && current.environmentId !== environmentId) return rejected();
	if (prior) {
		if (prior.requestHash !== requestHash) return rejected();
		return {
			result: {
				ok: true,
				messages: [],
				lifecycleRevision: state.hot.entry?.lifecycleRevision
			},
			outcome: prior.outcome,
			replayed: true
		};
	}
	if (seq !== (current?.nextSeq ?? 1)) return rejected();
	const apply = () => {
		const entry = state.hot.entry;
		if (!entry) return {
			ok: false,
			reason: "session-not-attached"
		};
		const events = createSessionActorMemoryEvents(context);
		const { appendMessage } = createSessionActorMemoryMessages(context, events);
		const { batch, preparedMessages } = input;
		const plan = prepareTranscriptCommitFromSnapshot({
			...batch,
			scope: {
				...scope,
				agentId,
				sessionKey: scope.sessionKey ?? state.hot.target.sessionKey,
				storePath: scope.storePath ?? context.path
			}
		}, entry, () => ({
			events: state.events.map((row) => row.event),
			version: events.version()
		}));
		if (!plan.result.ok || plan.result.messages.length === batch.messages.length) return plan.result;
		const recovered = plan.result.messages.length;
		const fresh = preparedMessages.slice(recovered);
		if (preparedMessages.length !== batch.messages.length || !fresh.every((message, index) => isCommittedAgentMessage(message) && readTranscriptMessageIdempotencyKey(message)?.trim() === readTranscriptMessageIdempotencyKey(batch.messages[recovered + index])?.trim())) return {
			ok: false,
			reason: "invalid-batch"
		};
		let parentId = plan.parentId;
		let messageSeq = plan.nextMessageSeq;
		const messages = [...plan.result.messages];
		for (const message of fresh) {
			const result = appendMessage({
				message,
				cwd: batch.cwd,
				parentId,
				appendIntent: "active-branch",
				idempotencyLookup: "caller-checked"
			}).result;
			if (!result?.appended || !isCommittedAgentMessage(result.message)) throw new Error("Worker transcript message was not persisted");
			parentId = result.messageId;
			messages.push({
				appended: true,
				message: result.message,
				messageId: result.messageId,
				messageSeq: ++messageSeq
			});
		}
		state.hot.entry = {
			...state.hot.entry,
			updatedAt: Math.max(entry.updatedAt ?? 0, Date.now())
		};
		return {
			...plan.result,
			messages
		};
	};
	const result = apply();
	const entryIds = result.ok ? result.messages.map((message) => message.messageId) : [];
	const newLeafId = entryIds.at(-1);
	const outcome = !result.ok ? result : newLeafId && entryIds.length === input.batch.messages.length ? {
		ok: true,
		result: {
			entryIds,
			newLeafId
		}
	} : {
		ok: false,
		reason: "invalid-batch"
	};
	const ledger = current ? {
		...current,
		receipts: new Map(current.receipts)
	} : {
		environmentId,
		nextSeq: 1,
		receipts: /* @__PURE__ */ new Map()
	};
	ledger.receipts.set(seq, {
		requestHash,
		outcome
	});
	ledger.nextSeq = seq + 1;
	state.workerTranscriptCommits.set(runEpoch, ledger);
	return {
		result,
		outcome,
		replayed: false
	};
}
//#endregion
//#region src/config/sessions/session-manual-compact-entry.ts
/** Manual transcript trimming clears accounting and harness state for the replaced history. */
function projectManuallyCompactedSessionEntry(previous, nowMs) {
	const next = structuredClone(previous);
	delete next.contextBudgetStatus;
	Object.assign(next, COMPACTION_RUN_USAGE_CLEAR_PATCH);
	delete next.totalTokens;
	delete next.totalTokensFresh;
	delete next.totalTokensVersion;
	clearAllCliSessions(next);
	next.updatedAt = nowMs ?? Date.now();
	return next;
}
//#endregion
//#region src/config/sessions/session-manual-compact-selection.ts
function selectManualCompactTranscriptLines(lines, requestedMaxLines) {
	if (lines.length === 0) return {
		lines,
		result: {
			compacted: false,
			reason: "no transcript"
		}
	};
	const maxLines = Math.max(1, Math.floor(requestedMaxLines));
	if (lines.length <= maxLines) return {
		lines,
		result: {
			compacted: false,
			kept: lines.length
		}
	};
	const maxTailLines = Math.max(0, maxLines - 1);
	const retained = normalizeManualCompactTranscriptLines(lines[0], maxTailLines > 0 ? lines.slice(1).slice(-maxTailLines) : []);
	return retained ? {
		lines: retained,
		result: {
			compacted: true,
			kept: retained.length
		}
	} : {
		lines,
		result: {
			compacted: false,
			kept: 0
		}
	};
}
function normalizeManualCompactTranscriptLines(headerLine, tailLines) {
	if (!headerLine) return null;
	const header = safeParseJsonRecord(headerLine);
	if (header?.type !== "session" || typeof header.id !== "string") return null;
	const records = tailLines.map(safeParseJsonRecord).filter((record) => record !== void 0);
	const retainedIds = /* @__PURE__ */ new Set();
	const transparentParents = /* @__PURE__ */ new Map();
	const normalizedRecords = [];
	for (const record of records) {
		let parentId = record.parentId;
		const seenTransparentParents = /* @__PURE__ */ new Set();
		while (typeof parentId === "string" && transparentParents.has(parentId) && !seenTransparentParents.has(parentId)) {
			seenTransparentParents.add(parentId);
			parentId = transparentParents.get(parentId) ?? null;
		}
		let next = typeof parentId === "string" && !retainedIds.has(parentId) ? {
			...record,
			parentId: null
		} : parentId !== record.parentId ? {
			...record,
			parentId
		} : record;
		if (next.type === "leaf") {
			const targetId = next.targetId;
			const validTargetId = targetId === null || typeof targetId === "string" && targetId.trim().length > 0;
			if (!validTargetId && typeof next.id === "string") transparentParents.set(next.id, next.parentId === null || typeof next.parentId === "string" ? next.parentId : null);
			if (typeof targetId === "string" && targetId.trim() && !retainedIds.has(targetId)) next = {
				...next,
				targetId: null,
				appendParentId: null
			};
			else if (validTargetId && typeof next.appendParentId === "string" && !retainedIds.has(next.appendParentId)) next = {
				...next,
				appendParentId: targetId
			};
		}
		if ((next.type === "compaction" || next.type === "reset") && typeof next.id === "string") {
			const firstKeptEntryId = next.firstKeptEntryId;
			if (typeof firstKeptEntryId === "string" && firstKeptEntryId !== next.id) {
				const tree = scanSessionTranscriptTree([...normalizedRecords, next]);
				const branchPath = selectSessionTranscriptTreePathNodes(tree, next.id);
				if (!branchPath.some((node) => node.id === firstKeptEntryId)) next = {
					...next,
					firstKeptEntryId: branchPath[0]?.id ?? next.id
				};
			}
		}
		normalizedRecords.push(next);
		if (typeof next.id === "string" && next.id.trim()) retainedIds.add(next.id);
	}
	return [JSON.stringify(header), ...normalizedRecords.map((record) => JSON.stringify(record))];
}
//#endregion
//#region src/config/sessions/session-transcript-report-policy.ts
var TranscriptReportNavigation = class extends SessionEntryNavigation {
	constructor(rows) {
		super();
		for (const { seq, facts } of rows) switch (facts.kind) {
			case "canonical":
				this.appendCanonicalNavigationEntry({
					...facts.entry,
					parentId: facts.entry.parentId ?? null,
					seq
				}, facts.hasParentId);
				break;
			case "leaf":
				this.appendOpaqueNavigationRecord({
					...facts.entry,
					type: "leaf"
				});
				break;
			case "link": this.appendOpaqueNavigationRecord(facts);
		}
		this.finishNavigation();
	}
	facts() {
		return {
			appendParentId: this.appendParentId,
			path: this.getBranch()
		};
	}
};
function latestCustomReport(branch, readEvent, customTypes) {
	for (const entry of branch.path.toReversed()) {
		if (entry.type !== "custom_message" || entry.customType === void 0 || !customTypes.includes(entry.customType)) continue;
		const record = readEvent(entry.seq);
		if (record) return {
			customType: entry.customType,
			content: record.content,
			details: record.details
		};
	}
}
function selectTranscriptReport(branch, readEvent, selection) {
	const suppressed = selection.kind === "assistant" && branch.path.some((entry) => entry.assistantResponseId === selection.responseId);
	return {
		appendParentId: branch.appendParentId,
		suppressed,
		latest: selection.kind === "custom" && !suppressed ? latestCustomReport(branch, readEvent, selection.customTypes) : void 0
	};
}
/** Only a settled visible answer owns buffered text; commentary and mirror receipts do not. */
function hasSettledTranscriptAssistant(branch, readEvent, runId) {
	return branch.path.toReversed().some((candidate) => {
		if (candidate.assistantRunId !== runId) return false;
		const message = readEvent(candidate.seq)?.message;
		if (!isRecord(message) || readSessionTranscriptRunId(message) !== runId || resolveTerminalAssistantTranscriptRunId(message, runId) === void 0 || isOpenClawMessageToolMirrorAssistantMessage(message) || isTranscriptOnlyOpenClawAssistantMessage(message)) return false;
		const metadata = asOptionalRecord(message["__openclaw"]);
		return !(metadata?.mirrorOrigin !== void 0 && metadata.runTerminal !== true) && Boolean(extractAssistantPhaseText(projectAssistantDisplayContent(message))?.trim());
	});
}
//#endregion
//#region src/config/sessions/session-actor-memory-reports.ts
function executeSessionActorMemoryReportCommand(context, command) {
	const { state, agentId, path } = context;
	const { scope } = command.input;
	if (scope.sessionKey === void 0 || resolveSqliteSessionKey(scope.sessionKey, agentId) !== state.hot.target.sessionKey || scope.agentId !== void 0 && scope.agentId !== agentId || scope.storePath !== void 0 && scope.storePath !== path) throw new SessionTranscriptWriterClaimReboundError();
	const entry = state.hot.entry;
	const refusal = sessionMatchesExpectedTranscriptTurn(entry ? { entry } : void 0, {
		...scope,
		expectedSessionId: scope.sessionId
	}) ? void 0 : {
		agentIdHash: redactIdentifier(agentId),
		expectedSessionIdHash: redactIdentifier(scope.sessionId),
		sessionKeyHash: redactIdentifier(scope.sessionKey),
		...entry ? {
			actualSessionIdHash: redactIdentifier(entry.sessionId),
			code: "session-rebound"
		} : { code: "session-entry-missing" }
	};
	if (refusal || !entry) {
		if (command.type.startsWith("session.report.")) return {
			ok: false,
			error: refusal
		};
		throw new SessionTranscriptWriterClaimReboundError(refusal);
	}
	const events = createSessionActorMemoryEvents(context);
	const { appendMessage } = createSessionActorMemoryMessages(context, events);
	const readEvent = (seq) => asOptionalRecord(state.events.find((row) => row.rawSeq === seq)?.event);
	const branch = () => new TranscriptReportNavigation(state.events.map((row) => ({
		seq: row.rawSeq,
		facts: projectSessionTranscriptReportFacts(row.event)
	}))).facts();
	const versionMatches = (expected) => {
		const current = state.hot.transcript.version;
		return current.generation === expected.generation && current.rawSeq === expected.rawSeq && current.updatedAt === expected.updatedAt;
	};
	const commit = (committed, extra = {}) => ({
		ok: true,
		value: {
			committed,
			projectionNeedsReconcile: false,
			...extra
		}
	});
	switch (command.type) {
		case "session.event.append": {
			const { eventJson } = command.input;
			const event = JSON.parse(eventJson);
			if (isRecord(event) && event.type === "message") throw new Error("Raw event append cannot write transcript messages");
			return events.appendRaw(event, {}, eventJson).appended;
		}
		case "session.transcript.messageFacts": {
			const facts = {
				anchorsByIdempotencyKey: /* @__PURE__ */ new Map(),
				existingIdempotencyKeys: /* @__PURE__ */ new Set(),
				messagesByIdempotencyKey: /* @__PURE__ */ new Map()
			};
			const keys = new Set(command.input.idempotencyKeys);
			for (const row of state.events) {
				const event = asOptionalRecord(row.event);
				const key = readMessageIdempotencyKey(event?.message);
				if (!key || !keys.has(key)) continue;
				facts.existingIdempotencyKeys.add(key);
				facts.messagesByIdempotencyKey.set(key, event?.message);
				const anchor = state.hot.transcript.anchors.find((item) => item.entryId === event?.id);
				if (anchor) facts.anchorsByIdempotencyKey.set(key, anchor);
			}
			const runId = command.input.sourceRunId;
			if (runId) facts.sourceEvents = selectVisibleTranscriptEvents(state.events.map((row) => row.event)).filter((event) => readSessionTranscriptRunId(asOptionalRecord(event)?.message) === runId);
			return {
				version: events.version(),
				facts
			};
		}
		case "session.rewrite.prepare": return prepareSessionActorMemoryMessageRewrite(context, command.input);
		case "session.rewrite.commit": return commitSessionActorMemoryMessageRewrite(context, command.input);
		case "session.report.prepare": return {
			ok: true,
			value: {
				facts: selectTranscriptReport(branch(), readEvent, command.input.selection),
				version: events.version()
			}
		};
		case "session.report.append": {
			if (!versionMatches(command.input.version)) return commit(false);
			if (!state.events.length) events.writeEvent(createSessionTranscriptHeader({ sessionId: entry.sessionId }));
			const { eventJson } = command.input.report;
			if (!events.appendRaw(JSON.parse(eventJson), {}, eventJson).appended) throw new Error("Session transcript report was not appended");
			return commit(true);
		}
		case "session.report.assistant": {
			const { report } = command.input;
			const facts = selectTranscriptReport(branch(), readEvent, {
				kind: "assistant",
				responseId: report.message.responseId
			});
			if (!facts.suppressed) appendMessage({
				message: report.preparedMessage.persistedMessage,
				messageJson: report.preparedMessage.messageJson,
				parentId: facts.appendParentId
			});
			return commit(!facts.suppressed);
		}
		case "session.report.abortedPartial": {
			const partial = command.input.report;
			if (partial.expectedLifecycleRevision !== void 0 && entry.lifecycleRevision !== (partial.expectedLifecycleRevision ?? void 0)) throw new SessionTranscriptWriterClaimReboundError();
			const navigation = branch();
			if (hasSettledTranscriptAssistant(navigation, readEvent, partial.runId)) return commit(false, { abortedPartial: { skipped: true } });
			if (entry.activeWriterRunId !== void 0 && entry.activeWriterRunId !== partial.runId) throw new SessionTranscriptWriterClaimReboundError();
			const append = appendMessage({
				message: partial.preparedMessage.persistedMessage,
				messageJson: partial.preparedMessage.messageJson,
				parentId: navigation.appendParentId,
				idempotencyLookup: "scan-assistant",
				now: partial.now,
				useRawWhenLinear: true
			}).result;
			if (!append || !isRecord(append.message)) throw new Error("Aborted assistant partial was not appended");
			if (append.appended) state.hot.entry = {
				...state.hot.entry,
				updatedAt: Math.max(entry.updatedAt ?? 0, Date.now())
			};
			const receipt = {
				skipped: false,
				append: {
					...append,
					message: append.message
				},
				lifecycleRevision: entry.lifecycleRevision,
				...append.anchor ? { messageSeq: append.anchor.activeMessagePosition + 1 } : {}
			};
			return commit(append.appended, {
				abortedPartial: receipt,
				sessionEntryChanged: append.appended
			});
		}
		case "session.correction.prepare": return {
			rows: state.events.filter((row) => command.input.afterSeq === void 0 || row.rawSeq > command.input.afterSeq).map((row) => ({
				seq: row.rawSeq,
				eventJson: row.eventJson
			})),
			version: events.version()
		};
		case "session.correction.commit": {
			const { input } = command;
			if (events.version().generation !== input.version.generation || !input.allowLaterAppends && !versionMatches(input.version)) {
				if (input.allowLaterAppends) return {
					kind: "session-transcript-correction",
					generation: null
				};
				throw new SqliteTranscriptMutationConflictError(entry.sessionId);
			}
			if (input.rows.length) {
				let preserveGeneration = true;
				const replacements = new Map(input.rows.map(({ entryId, expectedEventJson: beforeJson, event }) => {
					const existing = state.events.find((value) => isRecord(value.event) && value.event.id === entryId);
					if (!existing || existing.eventJson !== beforeJson) throw new SqliteTranscriptMutationConflictError(entry.sessionId);
					const eventJson = JSON.stringify(canonicalizeTranscriptEventMedia(event));
					preserveGeneration &&= transcriptRewritePreservesAdmission(beforeJson, eventJson);
					return [existing.rawSeq, {
						...existing,
						eventJson,
						event: JSON.parse(eventJson)
					}];
				}));
				events.replaceRows(state.events.map((row) => replacements.get(row.rawSeq) ?? row), { preserveGeneration });
			}
			return {
				kind: "session-transcript-correction",
				generation: events.version().generation
			};
		}
		case "session.transcript.manualCompact": {
			if (command.input.sources?.length) {
				const sourceValidation = context.validateSources(command.input.sources);
				context.admit("transaction", {
					kind: "session-manual-compact-validated",
					sourceValidation
				});
				if (sourceValidation.refusedSource) throw new SessionWorkStartChangedError("Session changed before compaction. Retry.");
			}
			const selected = selectManualCompactTranscriptLines(state.events.map((row) => row.eventJson), command.input.maxLines);
			if (selected.result.compacted) {
				const original = new Map(state.events.flatMap((row) => isRecord(row.event) && typeof row.event.id === "string" ? [[row.event.id, row]] : []));
				events.replaceRows(selected.lines.map((eventJson, rawSeq) => {
					const event = JSON.parse(eventJson);
					return {
						...isRecord(event) && typeof event.id === "string" ? original.get(event.id) : void 0,
						rawSeq,
						eventJson,
						event
					};
				}));
				state.hot.entry = projectManuallyCompactedSessionEntry(entry, command.input.nowMs);
			}
			return selected.result;
		}
		case "session.workerTranscript.commit": return commitSessionActorMemoryWorkerTranscript(context, command.input);
		default: throw new Error("Unsupported memory transcript operation");
	}
}
//#endregion
//#region src/config/sessions/session-transcript-search-policy.ts
const SEARCH_SNIPPET_MAX_CHARS = 500;
const SEARCH_LIMIT_MAX = 25;
const SEARCH_QUERY_MAX_CHARS = 4096;
function validateSessionTranscriptSearchQuery(input) {
	const query = input.trim();
	if (!query) throw new Error("query must not be empty");
	if (query.length > SEARCH_QUERY_MAX_CHARS) throw new Error(`query must not exceed ${SEARCH_QUERY_MAX_CHARS} characters`);
	return query;
}
/** Each whitespace term is one literal phrase; only its final token may be a prefix. */
function sessionTranscriptSearchTerms(input) {
	return validateSessionTranscriptSearchQuery(input).split(/\s+/u);
}
function sessionTranscriptSearchFtsQuery(query, match) {
	return sessionTranscriptSearchTerms(query).map((token, index, tokens) => `"${token.replaceAll("\"", "\"\"")}"${match === "prefix" && index === tokens.length - 1 ? "*" : ""}`).join(" ");
}
function sessionTranscriptSearchLimit(limit) {
	return Math.min(Math.max(1, limit ?? 10), SEARCH_LIMIT_MAX);
}
function boundSessionTranscriptSearchSnippet(snippet) {
	return snippet.length > SEARCH_SNIPPET_MAX_CHARS ? `${truncateUtf16Safe(snippet, SEARCH_SNIPPET_MAX_CHARS)}…` : snippet;
}
//#endregion
//#region src/config/sessions/session-actor-memory-search.ts
/** Uncommon Unicode and tied snippets may differ from SQLite; ephemeral search uses runtime Unicode. */
function tokenize(text) {
	return [...text.matchAll(/[\p{L}\p{N}\p{Co}][\p{L}\p{N}\p{Co}\p{M}]*/gu)].map((match) => ({
		term: match[0].normalize("NFD").replace(/(\p{Script=Latin})\p{M}+/gu, "$1"),
		start: match.index,
		end: match.index + match[0].length
	}));
}
function phraseOffsets(tokens, phrase) {
	if (!phrase.terms.length) return [];
	const offsets = [];
	for (let start = 0; start + phrase.terms.length <= tokens.length; start++) if (phrase.terms.every((term, offset) => term.test(tokens[start + offset].term))) offsets.push(start);
	return offsets;
}
/** BM25 uses the whole owner's searchable corpus, before role/window/result filtering. */
function rankRows(rows, phrases) {
	const averageLength = rows.reduce((sum, row) => sum + row.tokens.length, 0) / rows.length;
	const inverseFrequency = phrases.map((_, index) => {
		const matching = rows.reduce((sum, row) => sum + Number(row.matches[index].length > 0), 0);
		return Math.max(1e-6, Math.log((rows.length - matching + .5) / (matching + .5)));
	});
	for (const row of rows) {
		const lengthPenalty = 1.2 * (.25 + .75 * row.tokens.length / averageLength);
		row.score = row.matches.reduce((score, matches, index) => {
			const frequency = matches.length;
			return score + inverseFrequency[index] * frequency * 2.2 / (frequency + lengthPenalty);
		}, 0);
	}
}
function snippet(row, phrases) {
	const { text, tokens } = row;
	if (tokens.length <= 48) return boundSessionTranscriptSearchSnippet(text);
	const maxStart = tokens.length - 48;
	const candidates = /* @__PURE__ */ new Set([0]);
	for (const matches of row.matches) for (const offset of matches) candidates.add(Math.min(maxStart, Math.max(0, offset - 24)));
	let bestStart = 0;
	let bestScore = -1;
	for (const start of candidates) {
		const end = start + 48;
		const score = row.matches.reduce((sum, matches, index) => {
			const count = matches.filter((offset) => offset >= start && offset + phrases[index].terms.length <= end).length;
			return sum + (count > 0 ? 1e3 + count : 0);
		}, 0);
		if (score > bestScore) {
			bestScore = score;
			bestStart = start;
		}
	}
	const end = bestStart + 48;
	return boundSessionTranscriptSearchSnippet(`${bestStart > 0 ? " … " : ""}${text.slice(bestStart === 0 ? 0 : tokens[bestStart].start, end === tokens.length ? text.length : tokens[end - 1].end)}${end < tokens.length ? " … " : ""}`);
}
/** A committed actor snapshot has no stale index or asynchronous rebuild window. */
function readSessionActorMemorySearch(context, input) {
	const terms = sessionTranscriptSearchTerms(input.query);
	const phrases = terms.map((term, index) => ({ terms: tokenize(term).map((token, offset, tokens) => {
		const prefix = input.match === "prefix" && index === terms.length - 1 && offset === tokens.length - 1;
		return new RegExp(`^${token.term}${prefix ? "" : "$"}`, "iu");
	}) }));
	if (phrases.some((phrase) => phrase.terms.length === 0)) return {
		hits: [],
		indexing: false,
		truncated: false
	};
	const rows = [];
	for (const [sessionKey, state] of context.entries()) for (const window of [...state.historicalWindows.values(), state]) {
		const sessionId = window.hot.entry?.sessionId;
		if (!sessionId) continue;
		const navigation = createSessionActorMemoryHistoryNavigation(window);
		for (const row of navigation.active) {
			const indexed = extractTranscriptIndexEntry(row.event, row.createdAt ?? window.hot.entry?.updatedAt ?? 0);
			if (!indexed) continue;
			const tokens = tokenize(indexed.text);
			rows.push({
				...indexed,
				sessionKey,
				sessionId,
				tokens,
				matches: phrases.map((phrase) => phraseOffsets(tokens, phrase)),
				order: row.searchOrder ?? rows.length,
				snippet: "",
				score: 0
			});
		}
	}
	if (rows.some((row) => row.tokens.length > 0)) rankRows(rows, phrases);
	const selectedKeys = input.sessionKeys?.length ? new Set(input.sessionKeys) : void 0;
	const selected = rows.filter((row) => (!selectedKeys || selectedKeys.has(row.sessionKey)) && (input.sessionId === void 0 || row.sessionId === input.sessionId) && (input.role === void 0 || row.role === input.role) && row.matches.every((matches) => matches.length > 0));
	selected.sort((left, right) => input.order === "recent" ? right.timestamp - left.timestamp || right.order - left.order : right.score - left.score || right.timestamp - left.timestamp || (left.messageId < right.messageId ? -1 : left.messageId > right.messageId ? 1 : 0));
	const limit = sessionTranscriptSearchLimit(input.limit);
	return {
		hits: selected.slice(0, limit).map((row) => {
			context.get(row.sessionKey);
			return {
				sessionKey: row.sessionKey,
				sessionId: row.sessionId,
				messageId: row.messageId,
				role: row.role,
				timestamp: row.timestamp,
				snippet: snippet(row, phrases),
				score: row.score
			};
		}),
		indexing: false,
		truncated: selected.length > limit
	};
}
//#endregion
//#region src/config/sessions/session-actor-memory-closed-turn.ts
/** The anchors select exact committed data; no separate owner-currentness read is needed. */
function readSessionActorMemoryClosedTurn(context, input) {
	const { admission, terminal } = input.boundary;
	if (admission.agentId !== terminal.agentId || admission.storePath !== terminal.storePath || admission.sessionKey !== terminal.sessionKey || admission.sessionId !== terminal.sessionId || admission.generation !== terminal.generation || admission.sessionKey !== context.state.hot.target.sessionKey) return { kind: "session-rebound" };
	const window = resolveSessionActorMemoryWindow(context.state, admission.sessionId);
	if (!window) return { kind: "session-rebound" };
	try {
		assertSessionActorMemoryAnchor(window, context, admission);
		assertSessionActorMemoryAnchor(window, context, terminal);
	} catch (error) {
		if (error instanceof SessionTranscriptReadFenceError) return { kind: "stale" };
		throw error;
	}
	const navigation = createSessionActorMemoryHistoryNavigation(window);
	const first = navigation.active.find((row) => row.rawSeq === admission.rawSeq);
	if (!first || !isIndexedSessionEntry(first.event) || first.event.type !== "message" || first.event.message.role !== "user") return { kind: "stale" };
	const nodes = new Map(navigation.tree.nodes.map((node) => [node.id, node]));
	let cursor = terminal.entryId;
	let depth = 0;
	const visited = /* @__PURE__ */ new Set();
	while (cursor !== admission.entryId) {
		if (!cursor || visited.has(cursor)) return { kind: "non-descendant" };
		if (depth++ >= input.maxEvents) return { kind: "too-large" };
		visited.add(cursor);
		cursor = nodes.get(cursor)?.parentId ?? null;
	}
	const rows = navigation.active.filter((row) => row.messagePosition !== null && row.messagePosition >= admission.activeMessagePosition && row.messagePosition <= terminal.activeMessagePosition);
	if (rows.length > input.maxEvents || rows.reduce((bytes, row) => bytes + Buffer.byteLength(row.eventJson), 0) > input.maxBytes) return { kind: "too-large" };
	return {
		kind: "ok",
		messages: rows.flatMap(({ event }) => isIndexedSessionEntry(event) && event.type === "message" ? [event.message] : [])
	};
}
//#endregion
//#region src/config/sessions/session-actor-memory-outbox.ts
function matches(row, filter) {
	return row.engineId === filter.engineId && row.ownerPluginId === filter.ownerPluginId;
}
function pendingRows(context, filter) {
	return [...context.state.outbox].filter(([, row]) => matches(row, filter) && (!filter.sessionId || row.sessionId === filter.sessionId) && row.payload.state !== "blocked");
}
function readSessionActorMemoryOutbox(context, query) {
	const rows = pendingRows(context, query.input);
	switch (query.type) {
		case "session.outbox.listPendingSessions": return [...new Set(rows.map(([, row]) => row.sessionId))].slice(0, Math.max(0, query.input.limit));
		case "session.outbox.readNextPending": {
			const first = rows[0];
			return first && {
				advancement_key: first[0],
				payload_json: first[1].payloadJson,
				session_id: first[1].sessionId
			};
		}
		case "session.outbox.hasPending": return rows.length > 0;
	}
	throw new Error("Unsupported memory outbox query");
}
function writePayload(context, filter, payload) {
	const admission = payload.state === "admitted" ? payload.admission : payload.boundary.admission;
	if (admission.agentId !== context.agentId || admission.storePath !== context.path || admission.sessionKey !== context.state.hot.target.sessionKey || !resolveSessionActorMemoryWindow(context.state, admission.sessionId)) throw new Error("Outbox intent does not belong to this session actor");
	const key = admission.logicalTurnId;
	const existing = context.state.outbox.get(key);
	const payloadJson = JSON.stringify(payload);
	if (existing) {
		if (!matches(existing, filter)) throw new Error(`context-engine advancement key collision: ${key}`);
		const prior = existing.payload;
		if (!(payload.state === "accepted" && prior.state === "admitted" && prior.admission.entryId === admission.entryId || (payload.state === "blocked" || payload.state === "ready") && prior.state === "accepted" && prior.boundary.admission.entryId === admission.entryId && prior.boundary.terminal.entryId === payload.boundary.terminal.entryId)) {
			if (existing.payloadJson !== payloadJson) throw new Error(`context-engine advancement key collision: ${key}`);
			return;
		}
	}
	context.state.outbox.set(key, {
		engineId: filter.engineId,
		ownerPluginId: filter.ownerPluginId,
		sessionId: admission.sessionId,
		payload,
		payloadJson,
		attempts: 0
	});
}
function advance(context, filter, payload, limits) {
	const closed = readSessionActorMemoryClosedTurn(context, {
		...limits,
		boundary: payload.boundary
	});
	if (closed.kind === "ok") writePayload(context, filter, {
		...payload,
		state: "ready",
		messages: closed.messages
	});
	else if (closed.kind !== "projection-unavailable") writePayload(context, filter, {
		boundary: payload.boundary,
		isHeartbeat: payload.isHeartbeat,
		state: "blocked",
		failure: closed.kind
	});
	return closed.kind;
}
function mutateSessionActorMemoryOutbox(context, command) {
	switch (command.type) {
		case "session.outbox.complete":
			context.state.outbox.delete(command.input.advancementKey);
			return;
		case "session.outbox.recordFailure": {
			const { advancementKey, attemptedAt, message } = command.input;
			const row = context.state.outbox.get(advancementKey);
			if (row) context.state.outbox.set(advancementKey, {
				...row,
				attempts: row.attempts + 1,
				lastAttemptAt: attemptedAt,
				lastError: message
			});
			return;
		}
		case "session.outbox.enqueueIntent":
			writePayload(context, command.input, {
				admission: command.input.admission,
				isHeartbeat: command.input.isHeartbeat,
				state: "admitted"
			});
			return;
		case "session.outbox.acceptIntent":
			writePayload(context, command.input, {
				boundary: command.input.boundary,
				isHeartbeat: command.input.isHeartbeat,
				runtimeContext: command.input.runtimeContext,
				state: "accepted"
			});
			return;
		case "session.outbox.publishClosedTurn": return advance(context, command.input, {
			boundary: command.input.boundary,
			isHeartbeat: command.input.isHeartbeat,
			runtimeContext: command.input.runtimeContext
		}, command.input);
		case "session.outbox.discardIntent": {
			const row = context.state.outbox.get(command.input.admission.logicalTurnId);
			return Boolean(row && matches(row, command.input) && row.payload.state === "admitted" && context.state.outbox.delete(command.input.admission.logicalTurnId));
		}
		case "session.outbox.prepareRun": {
			const warnings = [];
			let pending = false;
			for (const [key, row] of context.state.outbox) {
				if (!matches(row, command.input) || row.sessionId !== command.input.sessionId) continue;
				const payload = row.payload;
				if (payload.state === "ready") pending = true;
				else if (payload.state === "blocked") warnings.push(`[context-engine] durable turn advancement is blocked: ${key}: transcript range is ${payload.failure}`);
				else if (payload.state === "admitted") {
					context.state.outbox.delete(key);
					warnings.push(`[context-engine] discarded unaccepted turn advancement: ${key}: recovery found no host acceptance`);
				} else {
					const result = advance(context, command.input, payload, {
						maxEvents: 2e4,
						maxBytes: 8388608
					});
					pending ||= result === "ok" || result === "projection-unavailable";
					if (result !== "ok") warnings.push(`[context-engine] blocked unrecoverable turn advancement: ${key}: transcript range is ${result}`);
				}
			}
			if (pending || !command.input.admission) return {
				warnings,
				pending,
				admitted: false
			};
			writePayload(context, command.input, {
				admission: command.input.admission,
				isHeartbeat: command.input.isHeartbeat,
				state: "admitted"
			});
			return {
				warnings,
				pending,
				admitted: true
			};
		}
	}
	throw new Error("Unsupported memory outbox command");
}
//#endregion
//#region src/config/sessions/session-actor-memory-trajectory.ts
function readSessionActorMemoryTrajectoryRows(context, input) {
	const rows = (context.state.trajectory.get(input.sessionId) ?? []).filter((row) => input.afterSeq === void 0 || !Number.isFinite(input.afterSeq) || row.seq > Math.floor(input.afterSeq));
	const tail = input.tailEvents !== void 0 && Number.isFinite(input.tailEvents) ? Math.max(0, Math.floor(input.tailEvents)) : void 0;
	if (tail === void 0 && input.maxEventCount !== void 0 && Number.isFinite(input.maxEventCount) && input.maxEventCount >= 0 && rows.length > Math.floor(input.maxEventCount)) throw new Error(`Trajectory runtime store has too many events to export (${rows.length}; limit ${Math.floor(input.maxEventCount)})`);
	const bytes = rows.reduce((total, row) => total + row.bytes, 0) - Number(rows.length > 0);
	if (tail === void 0 && input.maxEventBytes !== void 0 && Number.isFinite(input.maxEventBytes) && input.maxEventBytes >= 0 && bytes > Math.floor(input.maxEventBytes)) throw new SqliteJsonlReadBudgetExceededError(`Trajectory runtime store is too large to export (${bytes} bytes; limit ${Math.floor(input.maxEventBytes)})`);
	const maxEvents = input.maxEvents !== void 0 && Number.isFinite(input.maxEvents) ? Math.max(0, Math.floor(input.maxEvents)) : void 0;
	const limit = tail === void 0 ? maxEvents : Math.min(tail, maxEvents ?? tail);
	return (limit === void 0 ? rows : limit === 0 ? [] : tail === void 0 ? rows.slice(0, limit) : rows.slice(-limit)).map((row) => ({
		event: JSON.parse(row.eventJson),
		seq: row.seq
	}));
}
function retainSessionActorMemoryTrajectory(context, input) {
	const runs = [];
	let totalBytes = 0;
	for (const [sessionKey, state] of context.entries()) for (const [sessionId, rows] of state.trajectory) {
		const grouped = /* @__PURE__ */ new Map();
		for (const row of rows) {
			const group = grouped.get(row.runId) ?? {
				newest: -Infinity,
				bytes: 0
			};
			group.newest = Math.max(group.newest, row.createdAt);
			group.bytes += row.bytes;
			grouped.set(row.runId, group);
			totalBytes += row.bytes;
		}
		for (const [runId, group] of grouped) runs.push({
			sessionKey,
			sessionId,
			runId,
			...group,
			order: `${Buffer.from(sessionId).toString("hex")}/${runId === null ? "0" : `1${Buffer.from(runId).toString("hex")}`}`
		});
	}
	const cutoff = input.now - 12096e5;
	const maxBytes = Math.max(1, Math.floor(input.maxGlobalRuntimeBytes ?? 536870912));
	runs.sort((a, b) => a.newest - b.newest || a.sessionId.localeCompare(b.sessionId) || (a.runId ?? "").localeCompare(b.runId ?? "") || (a.order < b.order ? -1 : a.order > b.order ? 1 : 0));
	let deleted = 0;
	for (const run of runs) {
		if (run.sessionId === input.sessionId || run.newest >= cutoff && totalBytes <= maxBytes) continue;
		const state = context.edit(run.sessionKey);
		const rows = state.trajectory.get(run.sessionId);
		state.trajectory.set(run.sessionId, rows.filter((row) => row.runId !== run.runId));
		totalBytes -= run.bytes;
		deleted++;
	}
	return {
		deleted,
		totalBytes
	};
}
function appendSessionActorMemoryTrajectory(context, input) {
	if (!resolveSessionActorMemoryWindow(context.state, input.sessionId)) throw new Error("Trajectory window does not belong to this session actor");
	if (input.events.length === 0) return;
	const now = Date.now();
	const previous = context.state.trajectory.get(input.sessionId) ?? [];
	const nextSeq = (previous.at(-1)?.seq ?? -1) + 1;
	const added = input.events.map((event, index) => {
		const eventJson = event.line;
		return {
			seq: nextSeq + index,
			eventJson,
			bytes: Buffer.byteLength(eventJson) + 1,
			createdAt: parseDateStringTimestampMs(event.ts) ?? now,
			runId: event.runId ?? null
		};
	});
	const rows = [...input.discardPrevious ? [] : previous, ...added];
	const maxBytes = Math.max(1, Math.floor(input.maxRuntimeBytes ?? 10485760));
	let bytes = 0;
	let first = rows.length;
	while (first > 0 && bytes + rows[first - 1].bytes <= maxBytes) bytes += rows[--first].bytes;
	context.state.trajectory.set(input.sessionId, rows.slice(first));
	retainSessionActorMemoryTrajectory(context, {
		...input,
		now
	});
}
//#endregion
//#region src/config/sessions/session-actor-memory-side-effects.ts
function readSessionActorMemorySideEffects(context, query) {
	if (query.type === "session.trajectory.read") return readSessionActorMemoryTrajectoryRows(context, query.input).map(({ event }) => event);
	if (query.type === "session.trajectory.rows") return readSessionActorMemoryTrajectoryRows(context, query.input);
	return readSessionActorMemoryOutbox(context, query);
}
function mutateSessionActorMemorySideEffects(context, command) {
	const key = context.state.hot.target.sessionKey;
	switch (command.type) {
		case "session.heartbeat.persist":
			if (command.input.session_key !== key) throw new Error("Heartbeat outcome does not target this session actor");
			if (context.state.hot.entry) {
				const row = {
					...command.input,
					next_check: command.input.next_check ?? null,
					priority: command.input.priority ?? null,
					response_reason: command.input.response_reason ?? null,
					task_names_json: command.input.task_names_json ?? null,
					wake_reason: command.input.wake_reason ?? null,
					wake_source: command.input.wake_source ?? null,
					context_run_id: null,
					context_claimed_at: null
				};
				context.state.heartbeatOutcome = row;
			}
			return;
		case "session.heartbeat.claim": {
			if (command.input.sessionKey !== key) throw new Error("Heartbeat outcome does not target this session actor");
			const row = context.state.heartbeatOutcome;
			if (!row || row.context_run_id !== null && row.context_run_id !== command.input.runId) return;
			const claimed = {
				...row,
				context_run_id: command.input.runId,
				context_claimed_at: row.context_claimed_at ?? Date.now()
			};
			context.state.heartbeatOutcome = claimed;
			return claimed;
		}
		case "session.messageToolOutcome.record": {
			if (command.input.session_key !== key || command.input.agent_id !== context.agentId) throw new Error("Message-tool outcome does not target this session actor");
			const all = [...context.entries()].flatMap(([sessionKey, state]) => state.messageToolOutcomes.map((row) => ({
				sessionKey,
				row
			})));
			const id = all.reduce((max, { row }) => Math.max(max, row.id), 0) + 1;
			const row = {
				...command.input,
				id
			};
			context.state.messageToolOutcomes.push(row);
			all.push({
				sessionKey: key,
				row
			});
			all.sort((a, b) => b.row.occurred_at - a.row.occurred_at || b.row.id - a.row.id);
			for (const removed of all.slice(1e4)) {
				const state = context.edit(removed.sessionKey);
				state.messageToolOutcomes = state.messageToolOutcomes.filter((item) => item.id !== removed.row.id);
			}
			return;
		}
		case "session.trajectory.append": return appendSessionActorMemoryTrajectory(context, command.input);
		default: return mutateSessionActorMemoryOutbox(context, command);
	}
}
//#endregion
//#region src/config/sessions/session-actor-memory-turn-prepare.ts
/** Canonical replay bytes stay with the selected actor when the hot replica cannot prepare. */
function prepareSessionActorMemoryTurn(context, input) {
	const { state } = context;
	const scope = {
		agentId: context.agentId,
		path: context.path,
		sessionKey: input.sessionKey,
		sessionId: input.options.expectedSessionId
	};
	if (input.agentId !== context.agentId || input.sessionKey !== state.hot.target.sessionKey) throw new Error("Turn preparation does not target this session actor");
	const { resolveExpectedEntry } = prepareSessionTranscriptTurnEntry(input.options);
	const selected = state.hot.entry ? { entry: state.hot.entry } : void 0;
	const ownerSourceValidation = input.ownerSources?.length ? context.validateSources(input.ownerSources) : void 0;
	if (ownerSourceValidation?.refusedSource) return { refusedOwnerSource: ownerSourceValidation.refusedSource };
	const goals = createSessionActorMemoryGoals(context);
	const mutation = input.options.sessionTurnMutation;
	goals.assertRouting(mutation?.routingPredicate);
	const replay = mutation ? goals.readReceipt(scope.sessionId, mutation.operation) : void 0;
	const expectedEntry = resolveExpectedEntry(selected);
	const result = replay && selected?.entry.sessionId === scope.sessionId ? {
		appendedMessages: [],
		sessionEntry: selected.entry,
		sessionFile: input.options.sessionFile,
		sessionTurnMutationResult: {
			result: replay,
			replayed: true
		}
	} : !expectedEntry ? {
		appendedMessages: [],
		rejectedReason: "session-rebound",
		sessionEntry: selected?.entry,
		sessionFile: input.options.sessionFile
	} : void 0;
	const events = createSessionActorMemoryEvents(context);
	const messages = createSessionActorMemoryMessages(context, events);
	return {
		ownerSourceValidation,
		result,
		messages: result ? [] : input.options.messages.map((append) => {
			const key = readMessageIdempotencyKey(append.message);
			const existing = messages.findByKey(append);
			const messageId = existing?.id;
			return {
				pending: Boolean(isRecord(append.message) && append.message.role === "user" && key && (state.pendingInputs.has(key) || input.custody?.idempotencyKey === key)),
				existing: existing && typeof messageId === "string" ? {
					messageId,
					message: existing.message
				} : void 0
			};
		}),
		coldArchive: void 0,
		version: events.version(),
		expectedSessionState: expectedEntry && buildRestartRecoveryExpectedState(selected?.entry ?? {
			sessionId: scope.sessionId,
			updatedAt: 0
		}),
		goalId: mutation && !result && expectedEntry && input.options.messages.length ? applySessionGoalOperation(expectedEntry, mutation.operation, Date.now())?.id : void 0
	};
}
//#endregion
//#region src/config/sessions/session-actor-memory-storage-dispatch.ts
function readSessionActorMemoryStorage(context, query) {
	switch (query.type) {
		case "session.conversation.read":
		case "session.conversation.authority": return readSessionActorMemoryConversation(context, query);
		case "session.conversation.delivery.read": return readSessionActorMemoryConversationDelivery(context, query.input);
		case "session.members.read":
		case "session.participants.read":
		case "session.suggestions.read":
		case "session.reactions.read": return readSessionActorMemoryCollaboration(context, query);
		case "session.outbox.listPendingSessions":
		case "session.outbox.readNextPending":
		case "session.outbox.hasPending":
		case "session.trajectory.read":
		case "session.trajectory.rows": return readSessionActorMemorySideEffects(context, query);
		case "boards.snapshot":
		case "boards.document": return readSessionActorBoardQuery(context, query);
		case "progressCard.get": return readSessionActorProgressCard(context, query.input.sessionKey);
		case "session.rewrite.prepare":
		case "session.report.prepare":
		case "session.correction.prepare":
		case "session.transcript.messageFacts": return executeSessionActorMemoryReportCommand(context, query);
		case "session.memory.targets":
		case "session.corpus.list":
		case "session.usage.snapshot": return readSessionActorMemoryUsage(context, query);
		case "session.memory.entry":
		case "session.memory.resetRecall": return readSessionActorMemoryCorpus(context, query);
		case "session.history.search": return readSessionActorMemorySearch(context, query.input);
		case "session.completion.read": return readSessionActorMemoryCompletion(context.state, query.input, context);
		case "session.turn.prepare": return prepareSessionActorMemoryTurn(context, query.input);
		case "session.lifecycle.artifacts":
		case "session.entry.creation":
		case "session.entry.read":
		case "session.entry.readById":
		case "session.entries.read": return readSessionActorMemoryEntryQuery(context, query);
		case "session.parentFork.source": return readSessionActorMemoryForkQuery(context, query);
		case "session.metadata.mutation": return createSessionActorMemoryMetadata(context).execute(query);
		case "session.pendingInput.read": return createSessionActorMemoryPending(context.state, context).read(query.input);
		case "session.pendingInput.history": {
			const window = resolveSessionActorMemoryWindow(context.state, query.input.sessionId);
			if (!window) return {
				rows: [],
				total: 0
			};
			return {
				...createSessionActorMemoryPending(window, context).history(query.input),
				currentSessionId: context.state.hot.entry?.sessionId
			};
		}
		case "session.pendingInput.receipts": return createSessionActorMemoryPending(resolveSessionActorMemoryWindow(context.state, query.input.sessionId) ?? context.state, context).receipts(query.input);
		case "session.goal.receipt": {
			if (query.input.sessionKey !== context.state.hot.target.sessionKey) throw new Error("Goal receipt does not target this session actor");
			const window = resolveSessionActorMemoryWindow(context.state, query.input.expectedSessionId);
			const receipt = window && createSessionActorMemoryGoals({
				...context,
				state: window
			}).readReceipt(query.input.expectedSessionId, query.input.operation);
			if (receipt && query.input.expectedSessionId !== context.state.hot.entry?.sessionId) throw new SessionGoalOperationError("session-rebound", "Session changed after the Goal operation");
			return receipt;
		}
		default: return readSessionActorMemoryHistoryQuery(context.state, query, context);
	}
}
function editPendingWindow(context, sessionId) {
	if (context.state.hot.entry?.sessionId === sessionId) return context.state;
	const window = context.state.historicalWindows.get(sessionId);
	if (!window) throw new Error("Pending input window no longer belongs to this session actor");
	const working = {
		...window,
		hot: structuredClone(window.hot),
		pendingInputs: new Map(window.pendingInputs),
		completions: new Map(window.completions)
	};
	context.state.historicalWindows.set(sessionId, working);
	return working;
}
function mutateSessionActorMemoryStorage(context, command, authority) {
	switch (command.type) {
		case "session.conversation.register": return writeSessionActorMemoryConversation(context, command);
		case "session.conversation.delivery.begin": return beginSessionActorMemoryConversationDelivery(context, command.input);
		case "session.conversation.delivery.transition": return transitionSessionActorMemoryConversationDelivery(context, command.input);
		case "session.collaboration.add":
		case "session.collaboration.remove":
		case "session.collaboration.participant":
		case "session.collaboration.owner.assign":
		case "session.collaboration.suggestion.add":
		case "session.collaboration.suggestion.claim":
		case "session.collaboration.suggestion.release":
		case "session.collaboration.suggestion.finalize":
		case "session.collaboration.involvement":
		case "session.category.apply":
		case "session.reaction.set": return mutateSessionActorMemoryCollaboration(context, command);
		case "session.outbox.prepareRun":
		case "session.outbox.enqueueIntent":
		case "session.outbox.acceptIntent":
		case "session.outbox.publishClosedTurn":
		case "session.outbox.complete":
		case "session.outbox.recordFailure":
		case "session.outbox.discardIntent":
		case "session.heartbeat.persist":
		case "session.heartbeat.claim":
		case "session.messageToolOutcome.record":
		case "session.trajectory.append": return mutateSessionActorMemorySideEffects(context, command);
		case "boards.applyOps":
		case "boards.putWidget":
		case "boards.grant": return executeSessionActorBoardCommand(context, command);
		case "progressCard.put":
		case "progressCard.clearForReset": return executeSessionActorProgressCardCommand(context, command);
		case "session.rewrite.commit":
		case "session.event.append":
		case "session.report.assistant":
		case "session.report.abortedPartial":
		case "session.report.append":
		case "session.correction.commit":
		case "session.workerTranscript.commit":
		case "session.transcript.manualCompact": return executeSessionActorMemoryReportCommand(context, command);
		case "session.usage.write": return mutateSessionActorMemoryUsage(context, command);
		case "session.entry.create":
		case "session.entry.patch":
		case "session.entry.replace":
		case "session.entry.replacements":
		case "session.lifecycle.reset":
		case "session.lifecycle.delete":
		case "session.lifecycle.reclaim": return executeSessionActorMemoryEntryCommand(context, command);
		case "session.parentFork.commit":
		case "session.parentFork.transcript":
		case "session.messageCut": return executeSessionActorMemoryForkCommand(context, command, authority.parentFork);
		case "session.pendingInput.mutate": return createSessionActorMemoryPending(command.input.kind === "finish" ? editPendingWindow(context, command.input.sessionId) : context.state, context).mutate(command.input);
		case "session.pendingInput.interruptHistory":
			if (!authority.isPendingInputProtected) throw new Error("Pending input reconciliation requires its live custody owner");
			return createSessionActorMemoryPending(editPendingWindow(context, command.input.sessionId), context).interruptHistory(command.input, {
				isProtected: (candidate) => authority.isPendingInputProtected(candidate, context.state.hot.entry?.sessionId),
				admit: (stage, grant) => context.admit(stage, {
					...grant,
					currentSessionId: context.state.hot.entry?.sessionId
				})
			});
		case "session.goal.mutate": return createSessionActorMemoryGoals(context).mutate(command.input);
		default: return createSessionActorMemoryMetadata(context).execute(command);
	}
}
//#endregion
//#region src/config/sessions/session-actor-memory-storage.ts
function errorFacts$1(error) {
	if (error instanceof SqliteTranscriptMutationConflictError) return {
		name: error.name,
		message: error.message,
		sessionId: error.sessionId
	};
	if (error instanceof SqliteSessionMutationConflictError) return {
		name: error.name,
		message: error.message,
		operationLabel: error.operationLabel
	};
	if (error instanceof SessionEntryLifecycleUpsertConflictError) return {
		name: error.name,
		message: error.message,
		sessionKey: error.sessionKey
	};
	if (error instanceof SessionPendingInputCustodyError) return {
		name: "SessionPendingInputCustodyError",
		message: error.message
	};
	if (error instanceof SessionTranscriptWriterClaimReboundError) return {
		name: error.name,
		message: error.message,
		refusal: parseTranscriptAppendRefusal(error.cause)
	};
	if (error instanceof BoardValidationError || error instanceof SessionGoalOperationError) return {
		name: error.name,
		message: error.message,
		code: error.code
	};
	return error instanceof Error ? {
		name: error.name,
		message: error.message
	} : {
		name: "Error",
		message: "Session actor storage command failed"
	};
}
/** Storage and phase commands share this owner's FIFO; every operation below is synchronous. */
function createSessionActorMemoryStorage(options) {
	const { sessions, target } = options;
	const transaction = (authority, writable) => {
		const before = options.current();
		let conversations;
		const changed = /* @__PURE__ */ new Map();
		const authorized = /* @__PURE__ */ new Set();
		const authorize = (sessionKey, state) => {
			if (state && !authorized.has(sessionKey)) {
				authority.authorize("commit", structuredClone(state.hot));
				authorized.add(sessionKey);
			}
		};
		const get = (sessionKey) => {
			const state = changed.has(sessionKey) ? changed.get(sessionKey) : sessions.get(sessionKey)?.state;
			authorize(sessionKey, state);
			return state;
		};
		const assertWritableKey = (sessionKey) => {
			if (!writable) throw new Error("Session actor read cannot mutate storage");
			if (parseAgentSessionKey(sessionKey)?.agentId !== options.agentId || toAgentStoreSessionKey({
				agentId: options.agentId,
				requestKey: sessionKey
			}) !== sessionKey) throw new Error("Memory session storage requires a canonical key owned by this agent");
		};
		const edit = (sessionKey) => {
			assertWritableKey(sessionKey);
			if (changed.has(sessionKey) && changed.get(sessionKey)) return changed.get(sessionKey);
			const existing = get(sessionKey);
			const state = existing ? cloneSessionActorMemoryState(existing) : createSessionActorMemoryState({
				...target,
				sessionKey
			});
			authorize(sessionKey, state);
			changed.set(sessionKey, state);
			return state;
		};
		authorize(target.sessionKey, before);
		const state = writable ? edit(target.sessionKey) : before;
		const context = {
			...options,
			state,
			get conversations() {
				return conversations ?? options.conversations();
			},
			editConversations() {
				if (!writable) throw new Error("Session actor read cannot mutate conversations");
				return conversations ??= cloneSessionActorMemoryConversations(options.conversations());
			},
			get,
			*entries() {
				const keys = /* @__PURE__ */ new Set([...sessions.keys(), ...changed.keys()]);
				for (const key of keys) {
					const value = changed.has(key) ? changed.get(key) : sessions.get(key)?.state;
					if (value) yield [key, value];
				}
			},
			edit,
			remove(sessionKey) {
				assertWritableKey(sessionKey);
				get(sessionKey);
				changed.set(sessionKey, void 0);
			},
			admit(stage, publication) {
				authority.authorize(stage, structuredClone(state.hot), publication);
			},
			validateSources(sources) {
				if (target.database.kind !== "memory") throw new Error("Memory storage has no memory identity");
				return validateSessionActorMemorySources(get, target.database.incarnation, sources, (query) => selectSessionActorMemoryConversations(context, query));
			}
		};
		return {
			context,
			changed,
			installConversations: () => {
				if (conversations) options.installConversations(conversations);
			}
		};
	};
	const readCurrent = (query, authority) => {
		options.guards.assertReadable();
		const { context } = transaction(authority, false);
		const value = readSessionActorMemoryStorage(context, query);
		authority.assertCurrent();
		return structuredClone(value);
	};
	return {
		acquire: options.acquire,
		readCurrent,
		read(query, authority) {
			return options.enqueue(() => readCurrent(query, authority));
		},
		mutate(command, authority, observer) {
			return options.enqueue(() => {
				try {
					options.guards.assertAccepted();
					const { context, changed, installConversations } = transaction(authority, true);
					const value = mutateSessionActorMemoryStorage(context, command, authority);
					const changes = [];
					for (const [sessionKey, state] of changed) {
						const previous = sessions.get(sessionKey)?.state;
						if (state) {
							if (!isDeepStrictEqual(previous?.hot.entry, state.hot.entry)) syncSessionActorMemoryConversations(state, context.editConversations(), previous?.hot.entry);
							options.prepareInstall(state);
							advanceSessionActorMemoryState(state);
						}
						changes.push({
							sessionKey,
							before: previous?.hot,
							after: state?.hot
						});
					}
					authority.assertCurrent();
					const committed = structuredClone({
						kind: "committed",
						value,
						changes
					});
					observer?.beforeCommit?.(structuredClone(committed));
					for (const [sessionKey, state] of changed) {
						const previous = sessions.get(sessionKey);
						if (!state) {
							if (previous) previous.closed = true;
							sessions.delete(sessionKey);
						} else if (previous && previous.state.hot.entry && previous.state.hot.entry.sessionId !== state.hot.entry?.sessionId) {
							previous.closed = true;
							sessions.set(sessionKey, {
								state,
								closed: false
							});
						} else if (previous) previous.state = state;
						else sessions.set(sessionKey, {
							state,
							closed: false
						});
					}
					installConversations();
					const outcome = committed;
					try {
						if (target.database.kind !== "memory") throw new Error("Memory storage lost its owner");
						publishSessionActorMemoryChanges({
							...options,
							incarnation: target.database.incarnation
						}, committed.changes);
						observer?.committed?.(structuredClone(committed));
					} catch (error) {
						outcome.failure = errorFacts$1(error);
					}
					return outcome;
				} catch (error) {
					return {
						kind: "rolled-back",
						error: errorFacts$1(error)
					};
				}
			});
		}
	};
}
//#endregion
//#region src/config/sessions/restart-recovery-receipt-state.ts
function hasActiveRestartRecoveryDeliveryClaim(entry, scope) {
	return entry.sessionId === scope.sessionId && hasRestartRecoverySourceClaim(entry, scope.sourceTurnId);
}
function hasExactRestartRecoveryDeliveryClaim(entry, scope) {
	return hasActiveRestartRecoveryDeliveryClaim(entry, scope) && entry.restartRecoveryDeliveryToolCallId === scope.toolCallId;
}
/** Terminal sends and steering share the same source-ownership decision. */
function resolveRestartRecoveryTerminalDeliveryDisposition(entry, scope) {
	if (entry) {
		if (entry.sessionId === scope.sessionId && hasRestartRecoveryTerminalRun(entry, scope.sourceTurnId)) return "already-delivered";
		if (entry.sessionId === scope.sessionId && normalizeOptionalString(entry.restartRecoveryDeliveryRunId) === void 0 && normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) === void 0 && entry.restartRecoveryDeliveryReceiptState === void 0 && normalizeOptionalString(entry.restartRecoveryDeliveryToolCallId) === void 0) return "not-applicable";
	}
	if (!entry || !hasActiveRestartRecoveryDeliveryClaim(entry, scope)) return "stale";
	if (entry.restartRecoveryDeliveryReceiptState || entry.restartRecoveryDeliveryToolCallId) return entry.restartRecoveryDeliveryReceiptState === "delivered-terminal" ? "already-delivered" : "delivery-ambiguous";
	return "startable";
}
/** Provider confirmation and proven no-send may change only the exact pending claim. */
function projectRestartRecoveryDeliverySettlement(entry, scope, outcome, updatedAt) {
	if (!hasExactRestartRecoveryDeliveryClaim(entry, scope) || entry.restartRecoveryDeliveryReceiptState !== "terminal-pending") return null;
	return outcome === "confirmed" ? {
		restartRecoveryDeliveryReceiptState: "delivered-terminal",
		updatedAt
	} : {
		restartRecoveryDeliveryReceiptState: void 0,
		restartRecoveryDeliveryToolCallId: void 0,
		updatedAt
	};
}
//#endregion
//#region src/config/sessions/session-actor-reducers.ts
/** Reduce only bookkeeping; lifecycle and custody belong to the phase command. */
function reduceSessionActorEntry(entry, reducers) {
	const next = structuredClone(entry);
	for (const reducer of reducers) {
		const patch = reduceSessionBookkeeping(next, reducer);
		if (patch) Object.assign(next, patch);
	}
	return next;
}
//#endregion
//#region src/config/sessions/session-pending-final-settlement.ts
/** Harness claims are host-validated; ordinary sources belong to the persisted final intent. */
function projectPendingFinalDeliverySettlement(entry, input, evidence) {
	const settlement = projectPendingFinalDeliveryState(entry, input, evidence);
	if (!input.cleanup) return settlement;
	const settledEntry = settlement.patch ? {
		...entry,
		...settlement.patch
	} : entry;
	const cleaned = projectSessionEntryPatch({
		existing: settledEntry,
		writeBase: settledEntry,
		sessionKey: input.cleanup.sessionKey,
		preserveActivity: input.cleanup.preserveActivity,
		operation: {
			kind: "pending-final-clear",
			sessionId: input.sessionId,
			intentId: input.intentId,
			recoveryRunId: input.cleanup.recoveryRunId,
			now: input.cleanup.now
		}
	});
	return {
		...settlement,
		patch: cleaned ?? settlement.patch
	};
}
function projectPendingFinalDeliveryState(entry, input, evidence) {
	const pending = entry.pendingFinalDelivery;
	const deliveries = pending?.deliveries;
	const index = deliveries?.findIndex(({ id }) => id === input.deliveryId) ?? -1;
	if (entry.sessionId !== input.sessionId || pending?.intentId !== input.intentId || !deliveries || index < 0) return {
		patch: null,
		state: "stale",
		wakeRecovery: false
	};
	const current = deliveries[index].state;
	if (input.expectedStates && !input.expectedStates.some((expected) => expected === current)) return {
		patch: null,
		state: "stale",
		wakeRecovery: false
	};
	const terminal = current === "delivered" || current === "suppressed" || current === "unknown" && input.state === "unknown";
	const settled = terminal ? current : input.state;
	const existingNotice = entry.pendingDeliveryNotice;
	const owedNotice = settled === "unknown" && pending.context && pending.intentId && existingNotice?.intentId !== pending.intentId && (!existingNotice || existingNotice.createdAt <= pending.createdAt) ? { pendingDeliveryNotice: {
		createdAt: pending.createdAt,
		context: pending.context,
		intentId: pending.intentId,
		state: "owed"
	} } : void 0;
	const result = evidence?.result;
	const platformMessageId = result?.platformMessageId?.trim();
	const context = pending.context;
	const sourceRunId = pending.sourceRunId ?? evidence?.claim?.sourceRunId;
	const validResult = result && platformMessageId && (result.resultCount === void 0 || Number.isSafeInteger(result.resultCount) && result.resultCount > 0) && result.channel === context?.channel && context?.to && (!result.target || result.target.id === context.to) && (!result.verifiedContext || isDeepStrictEqual(normalizeDeliveryContext(result.verifiedContext), normalizeDeliveryContext(context)));
	const receipt = terminal ? deliveries[index].receipt : settled === "delivered" && sourceRunId && validResult ? {
		platformMessageId,
		resultCount: result.resultCount ?? 1
	} : void 0;
	const updatedDeliveries = deliveries.with(index, {
		id: input.deliveryId,
		state: settled,
		...receipt ? { receipt } : {}
	});
	const finalReceipt = updatedDeliveries[index].receipt;
	const terminalEvidence = sourceRunId && (!evidence?.claim || evidence.claim.sourceRunId === sourceRunId) && finalReceipt && context && settled === "delivered" && updatedDeliveries.every((delivery) => delivery.state === "delivered" && delivery.receipt) ? mergeRestartRecoveryTerminalDeliveryEvidence(entry.restartRecoveryTerminalDeliveryEvidence, [{
		runId: sourceRunId,
		...evidence?.claim ? { harnessCompletion: evidence.claim } : {},
		deliveryContext: context,
		captured: true,
		payloads: [{ visible: true }],
		deliveryStatus: {
			status: "sent",
			resultCount: updatedDeliveries.reduce((count, delivery) => count + (delivery.receipt?.resultCount ?? 0), 0)
		},
		durableFinalReceipt: {
			intentId: input.intentId,
			deliveryId: input.deliveryId,
			platformMessageId: finalReceipt.platformMessageId
		}
	}]) : void 0;
	const clearsNotice = existingNotice?.state !== "acknowledged" && !updatedDeliveries.some((delivery) => delivery.state === "unknown") && settled !== "queued" && settled !== "unknown" && existingNotice?.intentId === pending.intentId;
	if (settled === current && !owedNotice && !clearsNotice && !terminalEvidence) return {
		patch: null,
		state: settled,
		wakeRecovery: false
	};
	return {
		state: settled,
		wakeRecovery: settled !== "queued" && entry.abortedLastRun === true,
		patch: {
			...entry.mainRestartRecovery ? { mainRestartRecovery: {
				...entry.mainRestartRecovery,
				revision: entry.mainRestartRecovery.revision + 1
			} } : {},
			pendingFinalDelivery: {
				...pending,
				deliveries: updatedDeliveries
			},
			...clearsNotice ? { pendingDeliveryNotice: void 0 } : owedNotice,
			...terminalEvidence ? { restartRecoveryTerminalDeliveryEvidence: terminalEvidence } : {}
		}
	};
}
//#endregion
//#region src/config/sessions/session-actor-phase.ts
var SessionActorStaleStateError = class extends Error {};
/** Shared phase semantics run against the backend selected when the actor is acquired. */
function applySessionActorPhaseWithBackend(command, hot, backend) {
	const sessionKey = hot.target.sessionKey;
	let entryUpdate;
	const requireEntry = () => {
		const entry = hot.entry;
		if (!entry) throw new Error("Session actor requires an existing session");
		return entry;
	};
	const lifecycle = (sessionId, expectedState, patch, expectedLifecycleRevision, defer = false) => {
		const entry = requireEntry();
		if (!sessionMatchesExpectedTranscriptTurn({ entry }, {
			expectedSessionId: sessionId,
			expectedSessionState: expectedState,
			expectedWriterRunId: expectedState.expectedWriterRunId,
			expectedLifecycleRevision
		})) throw new SessionActorStaleStateError("Session actor lifecycle changed before its durable phase");
		const next = {
			...entry,
			...patch,
			...patch.restartRecoveryTerminalRunIds ? { restartRecoveryTerminalRunIds: mergeRestartRecoveryTerminalRunIds(entry.restartRecoveryTerminalRunIds, patch.restartRecoveryTerminalRunIds) } : {}
		};
		if (!isDeepStrictEqual(entry, next)) {
			if (defer) entryUpdate = next;
			else backend.writeEntry(next);
		}
	};
	const turn = (input) => {
		if (input.sessionKey !== sessionKey || input.options.expectedSessionId !== (hot.entry?.sessionId ?? input.options.initialSessionEntry?.sessionId)) throw new Error("Session actor turn changed its captured target");
		assertCanonicalSessionKeyWrite(sessionKey, input.agentId);
		const committed = backend.turn(input);
		if (committed.result.rejectedReason || committed.result.predicateSkipped) throw new SessionActorStaleStateError("Session actor turn was refused by its current owner");
		return committed;
	};
	let result;
	let pendingInputMutationReceipt;
	switch (command.type) {
		case "session.actor.acceptInput": {
			const { pending, expectedState, lifecycle: patch } = command.input;
			if (pending && (pending.sessionKey !== sessionKey || pending.sessionId !== requireEntry().sessionId)) throw new Error("Session actor input changed its captured target");
			if (command.input.turn && command.input.append) throw new Error("Session actor input must use one append contract");
			const recovery = command.input.recovery;
			if (recovery) {
				const entry = requireEntry();
				if ((entry.restartRecoveryDeliveryRunId ?? entry.activeWriterRunId) !== recovery.expectedRunId || backend.validateSources(recovery.sources).refusedSource) throw new Error("Session actor recovery lost its source or run");
				const claim = recovery.harnessCompletion;
				if (claim && (claim.requesterSessionKey !== sessionKey || claim.requesterAgentId !== backend.agentId || claim.sessionId !== entry.sessionId || claim.lifecycleRevision !== entry.lifecycleRevision || !backend.validateRecoveryInput(claim))) throw new Error("Session actor recovery input no longer matches its source");
				backend.admit("transaction", {
					kind: "session-actor-recovery",
					recovery
				});
			}
			if (pending) pendingInputMutationReceipt = backend.mutatePendingInput(pending);
			const input = command.input.turn;
			if (input?.options.initialSessionEntry && Object.values(expectedState).some((value) => value !== void 0)) throw new Error("Session actor initialization cannot expect an existing lifecycle");
			if (!input && pending) lifecycle(pending.sessionId, expectedState, patch);
			result = {
				inputId: pending && (pending.expected.existing?.input_id ?? pending.inputId),
				...input ? { turn: turn({
					...input,
					options: {
						...input.options,
						...!input.options.initialSessionEntry ? { expectedSessionState: expectedState } : {},
						sessionLifecyclePatch: {
							...input.options.sessionLifecyclePatch,
							...patch
						}
					}
				}) } : {},
				...command.input.append ? { append: backend.append(command.input.append) } : {},
				adoption: pending && {
					existing: pending.expected.existing,
					previous: pending.expected.previous,
					committed: pending.expected.committed
				},
				pendingInputReceipt: pendingInputMutationReceipt
			};
			break;
		}
		case "session.actor.adoptRun": {
			const patch = {
				...command.input.lifecycle,
				...command.input.runId !== void 0 ? { activeWriterRunId: command.input.runId } : {}
			};
			const input = command.input.turn;
			if (input) {
				if (input.options.expectedSessionId !== command.input.sessionId) throw new Error("Session actor adoption changed its captured session");
				result = turn({
					...input,
					options: {
						...input.options,
						expectedSessionState: command.input.expectedState,
						sessionLifecyclePatch: {
							...input.options.sessionLifecyclePatch,
							...patch
						}
					}
				});
			} else lifecycle(command.input.sessionId, command.input.expectedState, patch);
			break;
		}
		case "session.actor.deliveryPending": {
			const input = command.input;
			if (input.claim) {
				const entry = hot.entry;
				if (!entry) {
					result = { disposition: "stale" };
					break;
				}
				const disposition = resolveRestartRecoveryTerminalDeliveryDisposition(entry, input.claim);
				if (disposition === "startable") {
					entryUpdate = {
						...entry,
						restartRecoveryDeliveryReceiptState: "terminal-pending",
						restartRecoveryDeliveryToolCallId: input.claim.toolCallId,
						updatedAt: input.updatedAt
					};
					result = { disposition: "started" };
				} else result = { disposition };
			} else lifecycle(input.sessionId, input.expectedState, input.lifecycle, void 0, true);
			break;
		}
		case "session.actor.appendToolResult":
			result = command.input.append ? backend.append(command.input.append) : turn(command.input.turn);
			break;
		case "session.actor.appendTranscriptEvent": {
			const input = command.input;
			if (input.append) {
				result = backend.append(input.append);
				break;
			}
			if ((requireEntry().lifecycleRevision ?? null) !== input.lifecycleRevision) throw new Error("Session actor transcript lifecycle changed before append");
			if (backend.validateSources(input.ownerSources).refusedSource) throw new Error("Session actor transcript source changed before append");
			result = { projectionNeedsReconcile: backend.appendEvent(input).projectionNeedsReconcile };
			break;
		}
		case "session.actor.completeTurn": {
			const { turn: input, bookkeeping } = command.input;
			const pendingFinalDelivery = command.input.pendingFinalDelivery ? {
				...command.input.pendingFinalDelivery,
				sourceRunId: hot.entry ? getRestartRecoveryPendingFinalSourceRunId(hot.entry, command.input.pendingFinalDelivery.context) : void 0
			} : void 0;
			if (bookkeeping) {
				if (requireEntry().activeWriterRunId !== bookkeeping.writerRunId) throw new SessionActorStaleStateError("Session actor completion writer changed before its durable phase");
				lifecycle(bookkeeping.sessionId, bookkeeping.expectedState, {
					...bookkeeping.lifecycle,
					...pendingFinalDelivery ? { pendingFinalDelivery } : {}
				}, bookkeeping.lifecycleRevision, true);
				result = { kind: "bookkeeping" };
			} else {
				result = turn(pendingFinalDelivery ? {
					...input,
					options: {
						...input.options,
						sessionLifecyclePatch: {
							...input.options.sessionLifecyclePatch,
							pendingFinalDelivery
						}
					}
				} : input);
				const terminal = input.options.messages.length ? void 0 : input.options.sessionLifecyclePatch;
				if (terminal || pendingFinalDelivery) {
					const entry = requireEntry();
					const next = {
						...entry,
						...terminal,
						...terminal?.restartRecoveryTerminalRunIds ? { restartRecoveryTerminalRunIds: mergeRestartRecoveryTerminalRunIds(entry.restartRecoveryTerminalRunIds, terminal.restartRecoveryTerminalRunIds) } : {},
						...pendingFinalDelivery ? { pendingFinalDelivery } : {}
					};
					if (!isDeepStrictEqual(entry, next)) entryUpdate = next;
				}
			}
			const completion = command.input.completion;
			if (completion) {
				if (completion.sessionKey !== sessionKey || completion.sessionId !== requireEntry().sessionId) throw new Error("Session actor completion changed its captured target");
				pendingInputMutationReceipt = backend.mutatePendingInput(completion);
			}
			break;
		}
		case "session.actor.deliverySettled": {
			const input = command.input;
			const entry = hot.entry;
			if (!entry) {
				result = input.restart ? { disposition: "stale" } : {
					state: "stale",
					wakeRecovery: false
				};
				break;
			}
			if (input.restart) {
				const { claim, outcome, updatedAt } = input.restart;
				const patch = projectRestartRecoveryDeliverySettlement(entry, claim, outcome, updatedAt);
				if (patch) {
					entryUpdate = {
						...entry,
						...patch
					};
					result = { disposition: outcome === "confirmed" ? "recorded" : "cleared" };
				} else if (!hasActiveRestartRecoveryDeliveryClaim(entry, claim)) result = { disposition: "stale" };
				else if (hasExactRestartRecoveryDeliveryClaim(entry, claim) && entry.restartRecoveryDeliveryReceiptState === "delivered-terminal") result = { disposition: outcome === "confirmed" ? "recorded" : "stale" };
				else if (outcome === "not-sent" && !entry.restartRecoveryDeliveryReceiptState && !entry.restartRecoveryDeliveryToolCallId) result = { disposition: "cleared" };
				else throw new Error(outcome === "confirmed" ? "failed to persist terminal delivery completion" : "failed to clear terminal delivery intent");
				break;
			}
			const settlement = projectPendingFinalDeliverySettlement(entry, input.settlement, input.evidence);
			if (settlement.patch) entryUpdate = {
				...entry,
				...settlement.patch
			};
			result = {
				state: settlement.state,
				wakeRecovery: settlement.wakeRecovery
			};
			break;
		}
	}
	const reducers = [];
	if (command.input.reducers?.length) {
		let entry = entryUpdate ?? requireEntry();
		for (const [index, reducer] of command.input.reducers.entries()) {
			let next;
			try {
				next = reduceSessionActorEntry(entry, [reducer]);
			} catch (error) {
				if (reducer.kind !== "usage") throw error;
				reducers.push({
					index,
					kind: reducer.kind,
					changed: false,
					failure: error instanceof Error ? {
						name: error.name,
						message: error.message
					} : {
						name: "Error",
						message: "Session usage reduction failed"
					}
				});
				continue;
			}
			reducers.push({
				index,
				kind: reducer.kind,
				changed: !isDeepStrictEqual(entry, next)
			});
			entry = next;
		}
		if (reducers.some(({ changed }) => changed)) entryUpdate = entry;
	}
	if (command.type === "session.actor.completeTurn" && command.input.restartClaimCleanup) {
		const entry = entryUpdate ?? requireEntry();
		entryUpdate = projectSessionEntryPatch({
			existing: entry,
			writeBase: entry,
			sessionKey,
			operation: command.input.restartClaimCleanup
		}) ?? entryUpdate;
	}
	if (entryUpdate) backend.writeEntry(entryUpdate);
	const committedTurn = result && "kind" in result && result.kind === "session-turn" ? result : result && "turn" in result ? result.turn : void 0;
	if (committedTurn) committedTurn.result.sessionEntry = structuredClone(requireEntry());
	return {
		value: result,
		pendingInputMutationReceipt,
		reducers
	};
}
//#endregion
//#region src/config/sessions/session-actor-receipt.ts
function collectAppendedEvents(before, after, payloads) {
	if (!payloads || before.transcript.version.generation !== after.transcript.version.generation) return;
	const beforeSeq = before.transcript.version.rawSeq ?? -1;
	const afterSeq = after.transcript.version.rawSeq ?? -1;
	if (afterSeq < beforeSeq) return;
	const events = [];
	for (let rawSeq = beforeSeq + 1; rawSeq <= afterSeq; rawSeq += 1) {
		const payload = payloads.get(rawSeq);
		if (!payload) return;
		events.push({
			rawSeq,
			event: structuredClone(payload.event),
			serializedBytes: payload.serializedBytes
		});
	}
	return events;
}
/** Assemble a receipt; the backend owns capturing its postimage before publication. */
function createSessionActorCommittedOutcome(params) {
	const { phase, command, before, after, applied } = params;
	const value = applied.value;
	const turn = value && "kind" in value && value.kind === "session-turn" ? value : value && "turn" in value ? value.turn : void 0;
	const append = value && "kind" in value && (value.kind === "message" || value.kind === "metadata") ? value : value && "append" in value ? value.append : void 0;
	const appended = append?.value.snapshot.ok ? append.value.snapshot.value.result : void 0;
	return {
		kind: "committed",
		value: applied.value,
		receipt: {
			kind: "session-actor-committed",
			commandId: command.commandId,
			phaseId: command.phaseId,
			phase,
			beforeVersion: before.version,
			afterVersion: after.version,
			transcript: {
				before: before.transcript.version,
				after: after.transcript.version,
				appendedMessages: turn?.result.appendedMessages ?? (appended && "messageId" in appended ? [appended] : []),
				appendedEvents: collectAppendedEvents(before, after, params.payloads),
				authorityReceipts: params.transcriptAuthority,
				append,
				projectionNeedsReconcile: Boolean(turn?.projectionNeedsReconcile) || Boolean(append?.value.projectionNeedsReconcile) || Boolean(append?.header?.projectionNeedsReconcile) || Boolean(value && "projectionNeedsReconcile" in value && value.projectionNeedsReconcile)
			},
			...params.entryPublication ? { entryPublication: params.entryPublication } : {},
			pendingInputReceipt: turn?.custody ?? append?.value.pendingInputReceipt,
			pendingInputMutationReceipt: applied.pendingInputMutationReceipt,
			pendingFinalDelivery: structuredClone(after.entry?.pendingFinalDelivery),
			reducers: applied.reducers,
			postimage: after
		}
	};
}
//#endregion
//#region src/config/sessions/session-actor-memory.ts
function errorFacts(error) {
	return error instanceof Error ? {
		name: error.name,
		message: error.message
	} : {
		name: "Error",
		message: "Session actor command failed"
	};
}
const actorOwners = resolveGlobalSingleton(Symbol.for("openclaw.memorySessionActorHandles"), () => /* @__PURE__ */ new WeakMap());
/** A selected handle retains its actual owner, including directly constructed owners. */
function readMemorySessionActorOwner(actor) {
	return actorOwners.get(actor);
}
/** Memory is authoritative until session close; it is never evicted into a database. */
function createMemorySessionActorOwner(options) {
	const identity = Object.freeze({
		kind: "memory",
		handle: randomUUID(),
		incarnation: randomUUID()
	});
	let conversations = createSessionActorMemoryConversations();
	const sessions = /* @__PURE__ */ new Map();
	let nextSearchOrder = 0;
	const prepareInstall = (state) => {
		for (const window of [state, ...state.historicalWindows.values()]) for (const row of window.events) if (row.searchOrder === void 0) {
			row.createdAt ??= Date.now();
			row.searchOrder = nextSearchOrder++;
		}
	};
	let queue = Promise.resolve();
	const enqueue = (run) => {
		const result = queue.then(run);
		queue = result.then(() => {}, () => {});
		return result;
	};
	let closed = false;
	const assertOpen = () => {
		if (closed) throw new Error("Incognito session actor owner is closed");
	};
	const factory = { async acquire(requestedTarget, lifetime) {
		lifetime.assertAdmission?.();
		lifetime.assertCurrent();
		assertOpen();
		if (!isDeepStrictEqual(requestedTarget.database, identity)) throw new Error("Incognito session actor target differs from its memory owner");
		const { sessionKey } = requestedTarget;
		if (parseAgentSessionKey(sessionKey)?.agentId !== options.agentId || toAgentStoreSessionKey({
			agentId: options.agentId,
			requestKey: sessionKey
		}) !== sessionKey) throw new Error("Memory session actors require a canonical session key for their agent");
		const target = structuredClone(requestedTarget);
		let selected = sessions.get(sessionKey);
		if (!selected) {
			selected = {
				state: createSessionActorMemoryState(target),
				closed: false
			};
			sessions.set(sessionKey, selected);
		}
		const session = selected;
		const current = () => {
			assertOpen();
			if (session.closed) throw new Error("Incognito session actor is closed");
			return session.state;
		};
		const actor = createSessionActorWithExecutor({
			target,
			lifetime: {
				...lifetime,
				assertCurrent() {
					current();
					lifetime.assertCurrent();
				},
				assertReadable() {
					current();
					lifetime.assertReadable();
				}
			},
			createExecutor(guards) {
				const snapshot = (authority) => {
					const hot = structuredClone(current().hot);
					authority.authorize("commit", hot);
					guards.assertReadable();
					authority.assertCurrent();
					return hot;
				};
				return {
					storage: createSessionActorMemoryStorage({
						...options,
						target,
						sessions,
						current,
						enqueue,
						guards,
						acquire: (requestedKey, acquiredLifetime = lifetime) => factory.acquire({
							database: identity,
							sessionKey: requestedKey
						}, acquiredLifetime),
						prepareInstall,
						conversations: () => conversations,
						installConversations: (value) => {
							conversations = value;
						}
					}),
					snapshot,
					read: (authority) => enqueue(() => snapshot(authority)),
					command: (phase, input, authority, observer) => enqueue(() => {
						try {
							const before = current();
							if (input.expected && !isDeepStrictEqual(input.expected, before.hot.version)) return {
								kind: "stale-version",
								expected: input.expected,
								postimage: snapshot(authority),
								error: {
									name: "SessionActorStaleVersionError",
									message: "Session actor version changed before command admission"
								}
							};
							const working = cloneSessionActorMemoryState(before);
							const admit = (stage, publication) => {
								authority.authorize(stage, structuredClone(working.hot), publication);
							};
							const validateSources = (sources) => validateSessionActorMemorySources((key) => key === sessionKey ? working : sessions.get(key)?.state, identity.incarnation, sources, (query) => selectSessionActorMemoryConversations({
								conversations,
								entries: () => Array.from(sessions, ([key, record]) => [key, key === sessionKey ? working : record.state]).values(),
								get: (key) => key === sessionKey ? working : sessions.get(key)?.state
							}, query));
							const pending = createSessionActorMemoryPending(working, {
								...options,
								admit
							});
							const transcript = createSessionActorMemoryTranscript({
								state: working,
								...options,
								admit,
								validateSources
							});
							const command = {
								type: `session.actor.${phase}`,
								input: {
									...input,
									target
								}
							};
							authority.authorize("transaction", structuredClone(before.hot));
							const applied = applySessionActorPhaseWithBackend(command, working.hot, {
								agentId: options.agentId,
								writeEntry: (next) => {
									working.hot.entry = next;
								},
								...transcript,
								validateSources,
								validateRecoveryInput: (claim) => validateSessionActorMemoryRecoveryInput(working, claim),
								mutatePendingInput: (value) => pending.mutate(value),
								admit
							});
							let changedConversations = conversations;
							if (!isDeepStrictEqual(before.hot.entry, working.hot.entry)) {
								changedConversations = cloneSessionActorMemoryConversations(conversations);
								syncSessionActorMemoryConversations(working, changedConversations, before.hot.entry);
							}
							prepareInstall(working);
							advanceSessionActorMemoryState(working);
							authority.authorize("commit", structuredClone(working.hot));
							guards.assertAccepted();
							current();
							authority.assertCurrent();
							const committed = createSessionActorCommittedOutcome({
								phase,
								command: input,
								before: before.hot,
								after: structuredClone(working.hot),
								applied
							});
							session.state = working;
							conversations = changedConversations;
							try {
								publishSessionActorMemoryChanges({
									...options,
									incarnation: identity.incarnation
								}, [{
									sessionKey,
									before: before.hot,
									after: working.hot
								}]);
								observer?.committed(structuredClone(committed));
							} catch (error) {
								committed.failure = errorFacts(error);
							}
							return structuredClone(committed);
						} catch (error) {
							return {
								kind: "rolled-back",
								error: errorFacts(error),
								...error instanceof SessionActorStaleStateError ? { reason: "stale-state" } : {}
							};
						}
					}),
					async release() {}
				};
			}
		});
		actorOwners.set(actor, owner);
		return actor;
	} };
	const readSession = (sessionKey, authority) => {
		assertOpen();
		const record = sessions.get(sessionKey);
		if (!record || record.closed) return;
		const hot = structuredClone(record.state.hot);
		authority.authorize("commit", hot);
		authority.assertCurrent();
		return hot;
	};
	const owner = {
		...createSessionActorMemoryConversationOwner({
			conversations: () => conversations,
			installConversations: (value) => {
				conversations = value;
			},
			*entries() {
				for (const [key, record] of sessions) yield [key, record.state];
			},
			get: (key) => sessions.get(key)?.state,
			enqueue,
			assertCurrent: assertOpen
		}),
		...options,
		identity,
		assertCurrent: assertOpen,
		...factory,
		readSession,
		captureSessionReadGuard(sessionKey) {
			const record = sessions.get(sessionKey);
			return () => {
				assertOpen();
				if (record?.closed) throw new Error("Memory session owner closed");
			};
		},
		readStorage(sessionKey, query, authority) {
			assertOpen();
			const record = sessions.get(sessionKey);
			if (!record || record.closed) return;
			const target = record.state.hot.target;
			return createSessionActorMemoryStorage({
				...options,
				target,
				sessions,
				current: () => record.state,
				enqueue,
				guards: {
					target,
					assertAccepted: assertOpen,
					assertReadable: assertOpen
				},
				acquire: (key, lifetime) => factory.acquire({
					database: identity,
					sessionKey: key
				}, lifetime ?? {
					assertCurrent: assertOpen,
					assertReadable: assertOpen
				}),
				prepareInstall,
				conversations: () => conversations,
				installConversations: (value) => {
					conversations = value;
				}
			}).readCurrent(query, authority);
		},
		readConversations(query, authority) {
			assertOpen();
			const rows = selectSessionActorMemoryConversations({
				conversations,
				entries: () => Array.from(sessions, ([key, record]) => [key, record.state]).values(),
				get(key) {
					readSession(key, authority);
					return sessions.get(key)?.state;
				}
			}, query);
			authority.assertCurrent();
			return structuredClone(rows);
		},
		readSessionById(sessionId, authority, selection) {
			assertOpen();
			const requestedId = sessionId.trim();
			const candidates = [...sessions].flatMap(([sessionKey, record]) => {
				if (record.closed) return [];
				const window = record.state.hot.entry?.sessionId.trim() === requestedId ? record.state : selection?.currentOnly ? void 0 : record.state.historicalWindows.get(requestedId);
				return window?.hot.entry ? [{
					sessionKey,
					record,
					entry: window.hot.entry
				}] : [];
			});
			candidates.sort((left, right) => {
				return (selection?.orderBy === "updatedAt" ? right.entry.updatedAt - left.entry.updatedAt : Number(right.entry.sessionId === sessionId) - Number(left.entry.sessionId === sessionId)) || (left.sessionKey < right.sessionKey ? -1 : left.sessionKey > right.sessionKey ? 1 : 0);
			});
			const selected = candidates[0];
			if (!selected) return;
			authority.authorize("commit", structuredClone(selected.record.state.hot));
			authority.assertCurrent();
			return {
				sessionKey: selected.sessionKey,
				entry: structuredClone(selected.entry)
			};
		},
		listSessions(authority) {
			return [...sessions.keys()].flatMap((key) => readSession(key, authority) ?? []);
		},
		listSessionEntries(authority, projection) {
			assertOpen();
			return [...sessions].flatMap(([sessionKey, record]) => {
				if (record.closed || !record.state.hot.entry) return [];
				authority.authorize("commit", structuredClone(record.state.hot));
				authority.assertCurrent();
				return [{
					sessionKey,
					entry: structuredClone(attachSessionEntrySnapshots({ ...record.state.hot.entry }, {}, projection))
				}];
			});
		},
		acquireExisting(sessionKey, lifetime) {
			assertOpen();
			const record = sessions.get(sessionKey);
			return !record || record.closed ? Promise.resolve(void 0) : factory.acquire({
				database: identity,
				sessionKey
			}, lifetime);
		},
		closeSession(sessionKey) {
			const session = sessions.get(sessionKey);
			if (session) session.closed = true;
			sessions.delete(sessionKey);
			if (session) publishSessionActorMemoryChanges({
				...options,
				incarnation: identity.incarnation
			}, [{
				sessionKey,
				before: session.state.hot,
				after: void 0
			}]);
		},
		close() {
			closed = true;
			sessions.clear();
			conversations = createSessionActorMemoryConversations();
		}
	};
	return owner;
}
//#endregion
//#region src/config/sessions/session-actor-memory-owner.ts
const owners = resolveGlobalMap(Symbol.for("openclaw.memorySessionActorOwners"));
function ownerLocation(options) {
	return {
		agentId: normalizeAgentId(options.agentId),
		path: path.resolve(options.path)
	};
}
function ownerKey(options) {
	return JSON.stringify([options.agentId, options.path]);
}
/** The memory backend's process-held owner and lifecycle. */
const memorySessionActorOwners = {
	list() {
		return [...owners.values()];
	},
	get(options) {
		const location = ownerLocation(options);
		const key = ownerKey(location);
		let owner = owners.get(key);
		if (!owner) {
			owner = createMemorySessionActorOwner(location);
			owners.set(key, owner);
		}
		return owner;
	},
	read(options) {
		return owners.get(ownerKey(ownerLocation(options)));
	},
	closeSession(options, sessionKey) {
		owners.get(ownerKey(ownerLocation(options)))?.closeSession(sessionKey);
	},
	closeDatabase(options) {
		const key = ownerKey(ownerLocation(options));
		owners.get(key)?.close();
		owners.delete(key);
	},
	reset() {
		for (const owner of owners.values()) owner.close();
		owners.clear();
	}
};
//#endregion
export { projectSessionUsageSnapshot as $, resolvePersistedUserTurnText as A, SessionLabelOwnerIndex as B, buildPersistedUserTurnMediaInputsFromFields as C, createHarnessCompletionInputPredicate as Ct, projectRecordedModelPrompt as D, mergePreparedUserTurnMessageForRuntime as E, buildGroupDisplayTitle as Et, decodeMetadataAppendEvent as F, estimateParentForkPromptTokens as G, resolveProjectionExistingEntry as H, sessionMetadataAppendNeedsReload as I, resolveParentForkSourceTranscript as J, planParentForkDecision as K, messagesMatchForIdempotentReplay as L, buildRestartRecoveryExpectedState as M, prepareSessionTranscriptTurnEntry as N, readModelPromptProjection as O, sessionMatchesExpectedTranscriptTurn as P, projectSessionEntryPatch as Q, readSessionActorMemoryHistoryQuery as R, buildLateResolvedMediaMessage as S, createSessionActorMemoryState as St, isUserMessage as T, buildGroupDisplayName as Tt, selectSessionModelOverride as U, inheritSessionSelection as V, buildForkedChildTranscriptEvents as W, createSessionResetBoundaryId as X, buildSessionResetBoundaryEvent as Y, mergeSessionEntryPatch as Z, isCommittedAgentMessage as _, unresolvedMemorySessionTarget as _t, applySessionActorPhaseWithBackend as a, COMPACTION_RUN_USAGE_CLEAR_PATCH as at, transcriptRewritePreservesProjection as b, classifySessionEntry as bt, boundSessionTranscriptSearchSnippet as c, projectPublicSessionEntryPatch as ct, validateSessionTranscriptSearchQuery as d, projectSessionMetaPatch as dt, preserveGenerationPrivateFields as et, TranscriptReportNavigation as f, readAmbientTranscriptWatermarkFromEntry as ft, projectManuallyCompactedSessionEntry as g, selectMemorySessionTargets as gt, selectManualCompactTranscriptLines as h, resolveMemorySessionSince as ht, SessionActorStaleStateError as i, removeMainSessionRecoveryForegroundClaim as it, buildExpectedTranscriptTurnSessionPatch as j, resolvePersistedUserTurnMessage as k, sessionTranscriptSearchFtsQuery as l, resolveSessionObserverDigestForLifecycle as lt, selectTranscriptReport as m, projectSessionMetadata as mt, readMemorySessionActorOwner as n, buildMainSessionRecoveryClearPatch as nt, reduceSessionActorEntry as o, projectCompactionAccountingPatch as ot, hasSettledTranscriptAssistant as p, resolveSessionWindowCreatedAt as pt, resolveParentForkLimitDecision as q, createSessionActorCommittedOutcome as r, buildMainSessionRecoverySettlementPatch as rt, resolveRestartRecoveryTerminalDeliveryDisposition as s, projectPublicSessionEntry as st, memorySessionActorOwners as t, buildMainSessionRecoveryAfterAgentRunPatch as tt, sessionTranscriptSearchLimit as u, mergeSessionOrigin as ut, prepareTranscriptCommitFromSnapshot as v, createFallbackSessionEntry as vt, buildPersistedUserTurnMessage as w, createSessionActorWithExecutor as wt, buildLateMediaAttachedProjection as x, collectCronGeneratedSessionKeys as xt, transcriptRewritePreservesAdmission as y, normalizeSessionRowChatType as yt, planSessionMessageCut as z };
