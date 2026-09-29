import { i as extractErrorCode, r as collectNestedErrorCandidates } from "./error-coercion-C787aVxk.mjs";
import "./src-CZ2wJvNB.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as safeParseJsonRecord, t as safeParseJson } from "./json-coercion-C7YSvZ9t.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { O as listAgentIds, S as tryResolveLegacyCompatibilityAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { A as parseAgentSessionKey, o as classifySessionKeyShape } from "./session-key-CBvmC8zz.mjs";
import "./legacy.default-agent-owner-B5Sofm47.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHI12YH5.mjs";
import { a as iterateSqliteQuerySync, i as getNodeSqliteKysely, l as sqliteStringSet, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, u as sql } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { r as resolveRuntimeWorkerUrl } from "./runtime-worker-url-B4o9tqvO.mjs";
import { t as SessionMetadataUnavailableError } from "./session-metadata-unavailable-error-DwD7IuoE.mjs";
import { a as resolveOpenClawAgentSqlitePath, r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { r as resolvePersistedSessionStoreOwnerForTarget } from "./session-store-owner-DBafeUlR.mjs";
import { o as normalizeGatewayClientId, s as normalizeGatewayClientMode } from "./client-info-B_ICKCYw.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./io-DuIKUcsW.mjs";
import { c as normalizeSessionDeliveryState } from "./delivery-context.shared-CW8dxG7X.mjs";
import { rp as SessionsGoalMutationResultSchema } from "./src-BRUl7oDv.mjs";
import { t as lazyCompile } from "./protocol-validator-BeXfMhak.mjs";
import { l as getAgentEventLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-BOSJcayE.mjs";
import { b as SESSION_GOAL_OPERATIONS_TABLE, g as hasPendingInputConsumptionColumn, h as ensureSessionPendingInputsSchema, m as ensureSessionInputCompletionsSchema, v as hasSessionPendingInputsSchema, x as ensureSessionGoalOperationsSchema } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { i as parseSqliteSessionEntryRecord } from "./conversation-ref-8kIjGCCc.mjs";
import { a as deferOpenClawAgentPostCommitPublication, d as retainOpenClawAgentDatabaseReadCandidates, f as runOpenClawAgentWriteTransaction, l as openOpenClawAgentDatabase, m as withOpenClawAgentDatabaseAsync } from "./openclaw-agent-db-CaQAStOA.mjs";
import { a as prepareOpenClawAgentDatabaseRegistrySnapshotRead } from "./openclaw-agent-db-registry-listing-CHFiKgU_.mjs";
import { b as findSessionTranscriptHeader, h as projectSessionTranscriptReportFacts, m as decodeSessionTranscriptReportFacts, s as transcriptEventJsonSql, u as transcriptEventNavigationSql, v as assertCurrentSessionTranscriptHeader } from "./transcript-payload-qsg5dB6v.mjs";
import { a as readSessionTranscriptRunId, n as emitSessionTranscriptUpdate, s as resolveTerminalAssistantTranscriptRunId, t as attachSessionTranscriptRunId } from "./transcript-events-DukKauix.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-b9fAKekK.mjs";
import { n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-CqmhHNa_.mjs";
import { c as runWithOwnedSessionTranscriptWrite, n as assertOwnedTranscriptWriteCommit, o as getOwnedSessionTranscriptInitialWriter, s as getOwnedSessionTranscriptWriterFence, t as SessionTranscriptWriterClaimReboundError, u as withOwnedSessionTranscriptWriterFence } from "./transcript-write-context-MlBhwaKa.mjs";
import { o as readUserProfileAliases } from "./user-profile-list-B5pNqyXa.mjs";
import "./user-profiles-BA6bh7Le.mjs";
import { t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CHHOdVvc.mjs";
import { t as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-DpwCZ9_q.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { c as resolveUnsuffixedSqliteTargetFromSessionStorePath, l as assertSessionStoreReadCandidate, u as captureSessionStoreReadCandidate } from "./session-sqlite-target-Dcog4O-M.mjs";
import { n as sessionDeliveryChannel, r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { c as resolveSessionStoreEntryCore, t as collectSessionEntryLookupKeys } from "./store-entry-DuM7NmYY.mjs";
import { _ as transcriptWriteScopeIsCurrent, a as getSessionKysely, c as resolveSqliteAgentId, d as resolveSqliteStoreScope, g as toDatabaseOptions, h as runExclusiveSqliteSessionWrite, l as resolveSqliteReadScope, m as resolveSqliteTranscriptScope, n as cloneSessionEntry, o as normalizeSqliteSessionKey, p as resolveSqliteTranscriptReadScope, r as formatLegacySqliteSessionMarkerForScope, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { f as selectSessionTranscriptTreePathNodes, l as scanSessionTranscriptTree, n as isSessionTranscriptLeafControl, p as selectSessionTranscriptTreeTipNodes } from "./transcript-tree-3xvvNd9-.mjs";
import { f as sessionTranscriptIndexNeedsReconcile, l as markSessionTranscriptIndexDirtyInTransaction, u as reconcileSessionTranscriptIndexInTransaction } from "./session-transcript-index-UaRlRUAw.mjs";
import { t as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-jHOoqdX_.mjs";
import { c as readSessionEntryRow, d as participantRecordsBySessionKey, o as readExactSessionEntryRow, u as validateDeliveryCanonicalSessionEntry } from "./session-accessor.sqlite-entry-read-yAa3_SVY.mjs";
import { n as emitSessionLifecycleEvent } from "./session-lifecycle-events-DiXxneBV.mjs";
import { a as selectSessionEntryRows, l as projectSqliteSessionOwner, r as parseSessionEntryJson } from "./session-accessor.sqlite-status-DxkjEBwE.mjs";
import { n as projectCanonicalSessionEntryShape, r as stripRuntimeOnlySessionSkillsFields } from "./store-entry-shape-CWorLqwJ.mjs";
import { c as hasCanonicalSessionValidationProjection, d as readWithCanonicalSessionReaderContinuation, f as scanCanonicalSqliteSessionEntries, i as assertCanonicalSqliteSessionKeysCurrent, s as captureCanonicalSessionReaderContinuation } from "./session-canonical-key-BBylVEaq.mjs";
import { a as publishSessionEntryCacheInvalidation, p as trackSessionEntryCacheWrite, s as publishSessionSharingMemberChange, t as discardCommittedSessionEntryCache } from "./session-accessor.sqlite-entry-cache-CtMz7hDz.mjs";
import { n as buildSessionCreationStamp } from "./session-entry-provenance-C-JyMH54.mjs";
import { i as recordSessionParticipant, n as removeSessionMember, t as addSessionMember } from "./session-sharing-store.native-CfGI05Li.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-Xwd1VHk2.mjs";
import { A as releaseSessionPendingInputOwner, C as isFinalInputCompletion, D as readSessionPendingInputByKey, E as readSessionInputCompletion, F as writeSessionInputCompletion, G as commitSqliteSessionDeletion, J as runSqliteSessionDeletionTransaction, M as runWithSessionPendingInput, N as runWithSessionPendingInputPersistence, O as readSessionPendingInputOwnerIds, T as projectSessionPendingInput, Y as withSqliteSessionContextReset, a as normalizeLifecycleTarget, c as readSessionIdentitySnapshot, d as resolveLifecyclePrimaryEntry, f as writeSessionEntry, k as registerSessionPendingInputOwner, w as parseSessionPendingInputMessage, x as claimCurrentSessionPendingInputDedupeRecovery, z as invalidateSessionEntryMaintenanceAgeFact } from "./session-accessor.sqlite-entry-store-BU493wVJ.mjs";
import { n as assertSessionTranscriptHot, r as readSessionColdTranscript } from "./session-cold-storage-state-BcO2Rrog.mjs";
import { a as readNextTranscriptSeq, i as ensureTranscriptSessionRoot, o as readTranscriptContextVersionInTransaction, s as readTranscriptGenerationInTransaction } from "./session-accessor.sqlite-transcript-state-BGrlGphn.mjs";
import { i as resolveSqliteSessionTranscriptReadFence, t as SessionTranscriptReadFenceError } from "./session-transcript-read-fence-Crjo4FKU.mjs";
import { t as getActiveTranscriptKysely } from "./session-accessor.sqlite-projection-read-CEJGTMGy.mjs";
import { t as withCurrentProjectionSnapshot } from "./session-accessor.sqlite-active-projection-D-WNA1Ka.mjs";
import { r as prepareSessionIdentityPublication } from "./session-accessor.sqlite-identity-Can_jxkB.mjs";
import { n as ensureSessionEntrySync } from "./session-accessor.sqlite-initial-entry-DTpzTl-3.mjs";
import { C as rememberCommittedTranscriptMessageSequences, S as readCommittedTranscriptMessageSequence, T as appendTranscriptMessageInTransaction, _ as projectCompactionAccountingPatch, b as assertLockedTranscriptWriteAllowed, d as trimTranscriptForManualCompact, i as appendTranscriptMessage, n as appendTranscriptEventSnapshotSync, w as rememberCommittedTranscriptMessageSequencesInTransaction, x as resolveTranscriptAppendRefusal } from "./session-accessor.sqlite-transcript-write-Bk_2EeDT.mjs";
import { C as readTranscriptIdentityByEventId, E as readTranscriptStatsSync, F as resolveTranscriptMessageAppendParent, R as SqliteJsonlReadBudgetExceededError, b as readTranscriptEventRows, k as applyAssistantDeliveryDirectives, l as loadTranscriptEventsFromDatabase, r as findTranscriptEventInDatabase, y as readTranscriptEventMessage, z as assertSqliteJsonlReadBudget } from "./session-accessor.sqlite-read-BzN7WYll.mjs";
import { t as readMessageIdempotencyKey } from "./transcript-message-identity-Cvvo_Q35.mjs";
import "./session-accessor.sqlite-transcript-anchor-B0dOIy5w.mjs";
import { a as ensureTranscriptHeader, c as readTranscriptMessageByScopedIdempotencyKey, d as rewriteSqliteTranscriptEventRowsInTransaction, g as projectTranscriptRetainedDataSql, l as redactTranscriptMessageForStorage, m as createSessionTranscriptHeader, n as appendTranscriptEventsInTransaction, t as appendTranscriptEventInTransaction, v as transcriptRetainedDataBytesSql } from "./session-accessor.sqlite-transcript-store-C7lVBkzn.mjs";
import { o as resolveFreshSessionTotalTokens, r as mergeSessionEntry } from "./types-ByCc34Vn.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor.sqlite-lifecycle-state-DdmXgBkg.mjs";
import "./server-constants-Dx_kHnY5.mjs";
import { s as resolveSessionEntrySelection } from "./session-accessor.entry-CwzWysXO.mjs";
import "./session-accessor.sqlite-entry-availability-B64pRX3U.mjs";
import { g as inheritSessionSelection, l as updateSessionEntry } from "./session-accessor.reset-0gTJAhVB.mjs";
import "./session-accessor.sqlite-owner-BHSlwrCn.mjs";
import { o as assertModelSelectionUnlocked } from "./model-overrides-FXSJttoI.mjs";
import { t as SessionEntryNavigation } from "./session-entry-navigation-neBcvf-5.mjs";
import { t as chunkItems } from "./chunk-items-2QWieLm-.mjs";
import { i as extractEditorText, t as invalidateSessionBranchCache } from "./session-accessor.sqlite-branches-9fvXQ_is.mjs";
import { t as readSessionTranscriptHotWatermark } from "./session-accessor.sqlite-transcript-watermark-read-CUQyYPNl.mjs";
import { i as readMessageWorkContext } from "./work-context-CdqkpY8G.mjs";
import { n as normalizeRawDeltaLimits, r as readRawDeltaInTransaction } from "./session-accessor.sqlite-raw-delta-read-CGwS7Vo7.mjs";
import { d as sameRestartRecoveryTerminalRunIds, s as mergeRestartRecoveryTerminalRunIds } from "./restart-recovery-state-CVOwSXMV.mjs";
import { i as resolveSessionTranscriptRuntimeTarget } from "./session-accessor.transcript-target-w5-iuMeM.mjs";
import "./session-accessor.sqlite-model-context-Dxi3aFzy.mjs";
import "./session-accessor.sqlite-active-events-Cnt-hBim.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-BnUpfTCG.mjs";
import { i as withSessionHistoryWorkerDatabase, o as withSessionHistoryWorkerReadCandidates } from "./session-transcript-worker-runtime-BF6L8Gm-.mjs";
import { isDeepStrictEqual, toUSVString } from "node:util";
import crypto, { createHash, randomUUID } from "node:crypto";
//#region src/chat/message-client-source.ts
function messageClientSourcesKey(sources) {
	return JSON.stringify(sources.map(({ id, mode, displayName }) => [
		id,
		mode,
		displayName ?? null
	]));
}
function normalizeMessageClientSources(value) {
	if (!Array.isArray(value)) return [];
	const sources = /* @__PURE__ */ new Map();
	for (const item of value) {
		const record = asOptionalRecord(item);
		const id = normalizeGatewayClientId(typeof record?.id === "string" ? record.id : void 0);
		const mode = normalizeGatewayClientMode(typeof record?.mode === "string" ? record.mode : void 0);
		if (!id || !mode) continue;
		const name = normalizeOptionalString(record?.displayName);
		const source = {
			id,
			mode,
			...name ? { displayName: truncateUtf16Safe(name, 200) } : {}
		};
		sources.set(messageClientSourcesKey([source]), source);
	}
	return [...sources.values()];
}
function readMessageClientSources(message) {
	const metadata = asOptionalRecord(asOptionalRecord(message)?.["__openclaw"]);
	return normalizeMessageClientSources(asOptionalRecord(metadata?.transport)?.clients);
}
//#endregion
//#region src/config/sessions/session-accessor.pending-input-request.ts
function resolvePendingInputRequestHash(message, requestFingerprint) {
	return requestFingerprint ? `request:${requestFingerprint}` : createHash("sha256").update(stableStringify(message)).digest("hex");
}
function preparePendingInputMessage(message, requestFingerprint) {
	const { timestamp: _timestamp, ...stableMessage } = message;
	if (Buffer.byteLength(JSON.stringify(stableMessage), "utf8") > 26214400) throw new Error("Pending input exceeds the Gateway payload limit");
	return {
		stableMessage,
		requestHash: resolvePendingInputRequestHash(stableMessage, requestFingerprint)
	};
}
function preparePendingInputRequest(params) {
	const idempotencyKey = readMessageIdempotencyKey(params.message);
	if (!idempotencyKey || !params.runId) throw new Error("Pending input requires an exact run and message idempotency key");
	return {
		message: params.message,
		runId: params.runId,
		idempotencyKey,
		replaySourceSessionKeys: params.replaySourceSessionKeys,
		...preparePendingInputMessage(params.message, params.requestFingerprint)
	};
}
/** Reconcile only a shipped scheduling-source variation against its complete accepted hash. */
function resolvePendingInputReplayRequest(prepared, accepted) {
	const { message, replaySourceSessionKeys } = prepared;
	const original = {
		message,
		stableMessage: prepared.stableMessage,
		requestHash: prepared.requestHash
	};
	if (!replaySourceSessionKeys) return original;
	if (prepared.requestHash.startsWith("request:") || message.provenance?.kind !== "inter_session" || message.provenance.sourceTool !== "subagent_settle") throw new Error("Pending input source replay requires an internal settle request");
	if (accepted?.run_id !== prepared.runId || accepted.request_hash === prepared.requestHash) return original;
	for (const sourceSessionKey of new Set(replaySourceSessionKeys)) {
		const candidate = {
			...message,
			provenance: {
				...message.provenance,
				sourceSessionKey
			}
		};
		const request = preparePendingInputMessage(candidate);
		if (request.requestHash === accepted.request_hash) return {
			message: candidate,
			...request
		};
	}
	return original;
}
/** Prove committed private input by its approved bytes, while hashing the raw retry. */
function resolveCommittedPendingInputRequestHash(options, committedMessage) {
	let candidate = preparePendingInputRequest(options);
	if (options.replaySourceSessionKeys) {
		if (candidate.idempotencyKey !== `${options.runId}:user`) throw new Error("Input completion retry conflicts with the accepted run");
		const committedProvenance = committedMessage.provenance;
		const sourceSessionKey = committedProvenance?.sourceSessionKey;
		if (!options.message.provenance || committedProvenance?.kind !== "inter_session" || committedProvenance.sourceTool !== "subagent_settle" || !sourceSessionKey || !options.replaySourceSessionKeys.includes(sourceSessionKey)) throw new Error("Input completion committed source is outside the frozen settle cohort");
		candidate = preparePendingInputRequest({
			...options,
			message: {
				...options.message,
				provenance: {
					...options.message.provenance,
					sourceSessionKey
				}
			}
		});
	}
	const prepared = options.prepareMessageAfterIdempotencyCheck ? options.prepareMessageAfterIdempotencyCheck(candidate.message) : candidate.message;
	if (!prepared) return;
	const { timestamp: _preparedTimestamp, ...stablePrepared } = redactTranscriptMessageForStorage(prepared, { config: options.config });
	const { timestamp: _committedTimestamp, ...stableCommitted } = committedMessage;
	if (stableStringify(stablePrepared) !== stableStringify(stableCommitted)) throw new Error("Input completion retry conflicts with the committed input");
	return candidate.requestHash;
}
function matchesSessionPendingInputRequest(receipt, message, requestHash) {
	if (receipt.request_hash === requestHash) return true;
	if (receipt.consumed_event_id == null) return false;
	if (receipt.request_hash === resolvePendingInputRequestHash(message)) return true;
	const metadata = asOptionalRecord(message["__openclaw"]);
	const transport = asOptionalRecord(metadata?.transport);
	if (!metadata || !transport || !Object.hasOwn(transport, "clients")) return false;
	const legacyTransport = { ...transport };
	delete legacyTransport.clients;
	const legacyMetadata = { ...metadata };
	if (Object.keys(legacyTransport).length) legacyMetadata.transport = legacyTransport;
	else delete legacyMetadata.transport;
	const legacyMessage = { ...message };
	if (Object.keys(legacyMetadata).length) legacyMessage["__openclaw"] = legacyMetadata;
	else delete legacyMessage["__openclaw"];
	return receipt.request_hash === resolvePendingInputRequestHash(legacyMessage);
}
//#endregion
//#region src/config/sessions/session-accessor.pending-inputs.ts
const receiptOwners = /* @__PURE__ */ new WeakMap();
function ownerReceipt(owner) {
	const receipt = {
		state: "queued",
		inputId: owner.inputId,
		message: parseSessionPendingInputMessage(owner.messageJson),
		run: (operation) => runWithSessionPendingInput(owner, operation),
		finish: owner.finish
	};
	receiptOwners.set(receipt, owner);
	return receipt;
}
/** Install only a private receipt's persistence context; this does not reopen execution authority. */
function withSessionPendingInputPersistence(receipt, persist) {
	const owner = receiptOwners.get(receipt);
	return owner ? runWithSessionPendingInputPersistence(owner, persist) : receipt.run(persist);
}
/** Bind one collected message to its private admitted sources without creating another durable queue. */
function bindSessionPendingInputSources(receipts, message) {
	const sources = [...new Set(receipts.flatMap((receipt) => {
		if (receipt.state === "consumed") throw new Error("Collected input has already been consumed");
		const owner = receiptOwners.get(receipt);
		return owner ? owner.sources ?? [owner] : [];
	}))];
	const first = sources[0];
	if (!first) return;
	const idempotencyKey = readMessageIdempotencyKey(message);
	if (!idempotencyKey || sources.some((source) => source.databasePath !== first.databasePath || source.sessionId !== first.sessionId || source.sessionKey !== first.sessionKey || source.idempotencyKey === idempotencyKey)) throw new Error("Collected input requires one exact session and a distinct aggregate identity");
	const clients = normalizeMessageClientSources(receipts.flatMap((receipt) => readMessageClientSources(receipt.message)));
	const collectedMessage = { ...message };
	if (clients.length) collectedMessage["__openclaw"] = {
		...message["__openclaw"],
		transport: {
			...asOptionalRecord(message["__openclaw"]?.transport),
			clients
		}
	};
	const messageJson = JSON.stringify(redactTranscriptMessageForStorage(collectedMessage, { config: sources.at(-1)?.config }));
	if (Buffer.byteLength(messageJson, "utf8") > 26214400) throw new Error("Collected input exceeds the Gateway payload limit");
	const aggregateInputId = randomUUID();
	return ownerReceipt({
		...first,
		inputId: aggregateInputId,
		transcriptInputId: aggregateInputId,
		idempotencyKey,
		messageJson,
		sources,
		finish: (disposition) => {
			const failures = [];
			for (const source of sources) try {
				source.finish(disposition);
			} catch (error) {
				failures.push(error);
			}
			if (failures.length) throw new AggregateError(failures, "Failed to finish collected input custody");
		}
	});
}
/** Accept durable input without changing the active transcript or scheduling execution. */
async function stageSessionPendingInput(scope, options) {
	const resolved = resolveSqliteTranscriptScope(scope);
	const databaseOptions = toDatabaseOptions(resolved);
	const preparedRequest = preparePendingInputRequest(options);
	const { idempotencyKey } = preparedRequest;
	return runExclusiveSqliteSessionWrite(resolved, async () => {
		options.assertCurrent();
		const database = openOpenClawAgentDatabase(databaseOptions);
		if (readSessionEntryRow(database, resolved.sessionKey)?.entry.sessionId !== scope.sessionId) return;
		const existing = readSessionPendingInputByKey(database, resolved, idempotencyKey);
		if (options.trackCompletion) ensureSessionInputCompletionsSchema(database.db);
		const completionIdentity = {
			...resolved,
			idempotencyKey
		};
		const previous = options.trackCompletion ? readSessionInputCompletion(database, completionIdentity) : void 0;
		const replayRequest = resolvePendingInputReplayRequest(preparedRequest, previous ?? existing);
		const { message, stableMessage } = replayRequest;
		let requestHash = replayRequest.requestHash;
		const lifecycleGeneration = getAgentEventLifecycleGeneration();
		let finished = false;
		let complete;
		if (options.trackCompletion) {
			const completionScope = {
				...completionIdentity,
				runId: options.runId,
				lifecycleGeneration
			};
			if (previous && (previous.request_hash !== requestHash || previous.run_id !== options.runId)) throw new Error("Input completion idempotency key conflicts with the accepted input");
			if (previous && isFinalInputCompletion(previous.outcome)) return {
				state: "consumed",
				inputId: idempotencyKey,
				message,
				completion: previous.outcome,
				run: () => {
					throw new Error("Input processing has already completed");
				},
				finish: () => {}
			};
			complete = (outcome) => runOpenClawAgentWriteTransaction((current) => {
				if (finished) throw new Error("Input completion owner has already been released");
				(options.assertCompletionCurrent ?? options.assertCurrent)();
				assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
				if (readSessionEntryRow(current, resolved.sessionKey)?.entry.sessionId !== scope.sessionId) throw new Error("Input completion no longer owns the admitted session");
				return writeSessionInputCompletion(current, {
					...completionScope,
					requestHash
				}, outcome);
			}, databaseOptions);
		}
		if (existing) {
			if (!matchesSessionPendingInputRequest(existing, stableMessage, requestHash) || existing.run_id !== options.runId) throw new Error("Pending input idempotency key conflicts with the accepted input");
			if (existing.consumed_event_id != null) return {
				state: "consumed",
				inputId: existing.input_id,
				message: parseSessionPendingInputMessage(existing.message_json),
				run: () => {
					throw new Error("Pending input has already been consumed");
				},
				finish: () => {}
			};
			if (readSessionPendingInputOwnerIds(database, [existing]).has(existing.input_id)) throw new Error("Pending input is already admitted; wait for its current turn");
			if (!options.requestFingerprint && !options.trackCompletion || existing.state !== "queued" && existing.state !== "interrupted" || existing.lifecycle_generation === lifecycleGeneration && !options.trackCompletion) throw new Error("Pending input ownership ended; submit a new turn to continue");
		}
		const committed = readTranscriptMessageByScopedIdempotencyKey(database, resolved, idempotencyKey, "scan");
		if (committed) {
			const committedMessage = parseSessionPendingInputMessage(JSON.stringify(committed.message));
			if (options.trackCompletion) {
				const committedRequestHash = resolveCommittedPendingInputRequestHash({
					...options,
					message,
					replaySourceSessionKeys: previous || existing ? void 0 : options.replaySourceSessionKeys
				}, committedMessage);
				if (!committedRequestHash) return;
				requestHash = committedRequestHash;
				options.assertCurrent();
			}
			return {
				state: "queued",
				inputId: committed.messageId,
				message: committedMessage,
				run: (operation) => {
					options.assertCurrent();
					return operation();
				},
				finish: () => {
					finished = true;
				},
				...complete ? { complete } : {}
			};
		}
		const prepared = existing ? parseSessionPendingInputMessage(existing.message_json) : options.prepareMessageAfterIdempotencyCheck ? options.prepareMessageAfterIdempotencyCheck(message) : message;
		if (!prepared) return;
		const messageJson = existing?.message_json ?? JSON.stringify(redactTranscriptMessageForStorage(prepared, { config: options.config }));
		if (Buffer.byteLength(messageJson, "utf8") > 26214400) throw new Error("Approved pending input exceeds the Gateway payload limit");
		const inputId = existing?.input_id ?? randomUUID();
		ensureSessionPendingInputsSchema(database.db);
		if (!runOpenClawAgentWriteTransaction((current) => {
			options.assertCurrent();
			if (readSessionEntryRow(current, resolved.sessionKey)?.entry.sessionId !== scope.sessionId) return false;
			if (existing) return executeSqliteQuerySync(current.db, getSessionKysely(current.db).updateTable("session_pending_inputs").set({
				state: "queued",
				lifecycle_generation: lifecycleGeneration
			}).where("input_id", "=", inputId).where("session_key", "=", resolved.sessionKey).where("session_id", "=", scope.sessionId).where("run_id", "=", options.runId).where("lifecycle_generation", "=", existing.lifecycle_generation).where("request_hash", "=", requestHash).where("message_json", "=", existing.message_json).where("state", "=", existing.state).where("consumed_event_id", "is", null)).numAffectedRows === 1n;
			executeSqliteQuerySync(current.db, getSessionKysely(current.db).insertInto("session_pending_inputs").values({
				input_id: inputId,
				session_key: resolved.sessionKey,
				session_id: scope.sessionId,
				idempotency_key: idempotencyKey,
				run_id: options.runId,
				request_hash: requestHash,
				message_json: messageJson,
				lifecycle_generation: lifecycleGeneration,
				state: "queued",
				accepted_at: Date.now()
			}));
			return true;
		}, databaseOptions)) return;
		const owner = {
			inputId,
			transcriptInputId: inputId,
			sessionId: scope.sessionId,
			sessionKey: resolved.sessionKey,
			databasePath: database.path,
			idempotencyKey,
			lifecycleGeneration,
			messageJson,
			config: options.config,
			assertCurrent: options.assertAdmittedCurrent ?? options.assertCurrent,
			...existing ? { restartRecovered: true } : {},
			finish: (disposition) => {
				if (finished) return;
				finished = true;
				releaseSessionPendingInputOwner(owner);
				if (owner.consumed) return;
				runOpenClawAgentWriteTransaction((current) => {
					executeSqliteQuerySync(current.db, getSessionKysely(current.db).updateTable("session_pending_inputs").set({ state: disposition }).where("input_id", "=", inputId).where("lifecycle_generation", "=", lifecycleGeneration).where("state", "=", "queued").where("consumed_event_id", "is", null));
				}, databaseOptions);
			}
		};
		registerSessionPendingInputOwner(owner);
		const receipt = ownerReceipt(owner);
		if (complete) receipt.complete = complete;
		return receipt;
	}, "session.pending-input.stage");
}
/** Record lost custody at its read boundary without resuming a pre-restart execution. */
function readPendingInputRows(scope, options) {
	const resolved = resolveSqliteTranscriptScope(scope);
	const databaseOptions = toDatabaseOptions(resolved);
	const limit = Math.max(1, Math.min(20, Math.trunc(options.limit ?? 20)));
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		if (!hasSessionPendingInputsSchema(database.db)) return {
			rows: [],
			total: 0,
			staleIds: [],
			nextBefore: void 0
		};
		const db = getSessionKysely(database.db);
		let base = db.selectFrom("session_pending_inputs").where("session_key", "=", resolved.sessionKey).where("session_id", "=", scope.sessionId);
		if (hasPendingInputConsumptionColumn(database.db)) base = base.where("consumed_event_id", "is", null);
		const total = options.id === void 0 ? executeSqliteQueryTakeFirstSync(database.db, base.select(db.fn.count("input_id").as("total")))?.total ?? 0 : void 0;
		let query = base.orderBy("seq", "desc").limit(limit + 1);
		if (options.before !== void 0) query = query.where("seq", "<", options.before);
		if (options.id !== void 0) query = query.where("input_id", "=", options.id);
		const metadata = executeSqliteQuerySync(database.db, query.select(["seq", sql`OCTET_LENGTH(message_json)`.as("serialized_bytes")])).rows;
		const selected = [];
		let bytes = 0;
		for (const row of metadata) {
			if (selected.length === limit || bytes + row.serialized_bytes > 26214400) break;
			selected.push(row.seq);
			bytes += row.serialized_bytes;
		}
		if (metadata.length && !selected.length) throw new Error("Stored pending input exceeds the Gateway payload limit");
		const rows = selected.length ? executeSqliteQuerySync(database.db, base.selectAll().where("seq", "in", selected).orderBy("seq", "desc")).rows : [];
		const ownedIds = readSessionPendingInputOwnerIds(database, rows);
		return {
			rows,
			total,
			staleIds: rows.filter((row) => row.state === "queued" && !ownedIds.has(row.input_id)).map((row) => row.input_id),
			nextBefore: selected.length < metadata.length ? selected.at(-1) : void 0
		};
	}, databaseOptions);
	if (!result.found) return {
		rows: [],
		total: 0
	};
	const snapshot = result.value;
	if (snapshot.staleIds.length) {
		const interrupted = runOpenClawAgentWriteTransaction((database) => {
			const db = getSessionKysely(database.db);
			const candidates = executeSqliteQuerySync(database.db, db.selectFrom("session_pending_inputs").select([
				"input_id",
				"session_key",
				"session_id",
				"lifecycle_generation"
			]).where("input_id", "in", snapshot.staleIds).where("state", "=", "queued").where("consumed_event_id", "is", null)).rows;
			const ownedIds = readSessionPendingInputOwnerIds(database, candidates);
			const ids = candidates.flatMap((row) => ownedIds.has(row.input_id) ? [] : [row.input_id]);
			if (ids.length) executeSqliteQuerySync(database.db, db.updateTable("session_pending_inputs").set({ state: "interrupted" }).where("input_id", "in", ids).where("consumed_event_id", "is", null));
			return new Set(ids);
		}, databaseOptions);
		for (const row of snapshot.rows) if (interrupted.has(row.input_id)) row.state = "interrupted";
	}
	return {
		rows: snapshot.rows,
		total: snapshot.total,
		nextBefore: snapshot.nextBefore
	};
}
function listSessionPendingInputs(scope, options = {}) {
	const { rows, total, nextBefore } = readPendingInputRows(scope, options);
	return {
		items: rows.toReversed().map(projectSessionPendingInput),
		total: total ?? 0,
		...nextBefore !== void 0 ? { nextBefore } : {}
	};
}
function readSessionPendingInput(scope, id) {
	const row = readPendingInputRows(scope, {
		id,
		limit: 1
	}).rows[0];
	return row ? projectSessionPendingInput(row) : void 0;
}
/** Verify source custody before replacing a stale process-local completed receipt. */
function claimSessionPendingInputDedupeRecovery(scope, runId) {
	const resolved = resolveSqliteTranscriptScope(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => claimCurrentSessionPendingInputDedupeRecovery(database, resolved, runId), toDatabaseOptions(resolved));
	return result.found && result.value;
}
/** Read one admitted source for explicit retry comparison; this never authorizes replay. */
function readSessionSubmittedInput(scope, idempotencyKey) {
	try {
		const resolved = resolveSqliteTranscriptScope(scope);
		const result = withOpenClawAgentDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => {
			const db = getSessionKysely(database.db);
			if (executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_nodes").innerJoin("session_windows", "session_windows.session_id", "session_nodes.current_session_id").select("current_session_id").where("session_nodes.session_key", "=", resolved.sessionKey).where("session_windows.session_key", "=", resolved.sessionKey))?.current_session_id !== resolved.sessionId) return;
			const pending = hasSessionPendingInputsSchema(database.db) ? executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_pending_inputs").select((eb) => eb.fn("octet_length", ["message_json"]).as("bytes")).where("session_key", "=", resolved.sessionKey).where("session_id", "=", resolved.sessionId).where("idempotency_key", "=", idempotencyKey)) : void 0;
			let messageJson;
			if (pending) {
				if (pending.bytes > 26214400) return;
				messageJson = readSessionPendingInputByKey(database, resolved, idempotencyKey)?.message_json;
			} else {
				if (sessionTranscriptIndexNeedsReconcile(database.db, resolved.sessionId)) return;
				const transcript = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "identity.session_id").onRef("event.seq", "=", "identity.seq")).select(transcriptEventReadBytesSql("event").as("bytes")).where("identity.session_id", "=", resolved.sessionId).where("identity.message_idempotency_key", "=", idempotencyKey).orderBy("identity.seq", "desc").limit(1));
				if (!transcript || transcript.bytes > 26214400) return;
				const committed = readTranscriptMessageByScopedIdempotencyKey(database, resolved, idempotencyKey, "scan");
				messageJson = committed ? JSON.stringify(committed.message) : void 0;
			}
			if (!messageJson) return;
			const message = parseSessionPendingInputMessage(messageJson);
			return readMessageIdempotencyKey(message) === idempotencyKey ? message : void 0;
		}), toDatabaseOptions(resolved));
		return result.found ? result.value : void 0;
	} catch {
		return;
	}
}
/** Bounded display reconciliation; these durable correlations never authorize replay. */
function listSessionPendingInputReceipts(scope, options) {
	if (options.runIds.length > 50) throw new Error("Pending input receipt lookup accepts at most 50 run IDs");
	const runIds = [...new Set(options.runIds)];
	if (!runIds.length) return [];
	const resolved = resolveSqliteTranscriptScope(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		if (!hasSessionPendingInputsSchema(database.db) || !hasPendingInputConsumptionColumn(database.db)) return [];
		const rows = executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_pending_inputs").select(["run_id", "consumed_event_id"]).where("session_key", "=", resolved.sessionKey).where("session_id", "=", scope.sessionId).where("run_id", "in", runIds).orderBy("seq", "asc").limit(51)).rows;
		if (rows.length > 50 || new Set(rows.map((row) => row.run_id)).size !== rows.length) throw new Error("Pending input receipt lookup has ambiguous source run IDs");
		return rows.map((row) => row.consumed_event_id == null ? {
			runId: row.run_id,
			state: "pending"
		} : {
			runId: row.run_id,
			state: "consumed",
			consumedByEventId: row.consumed_event_id
		});
	}, toDatabaseOptions(resolved));
	return result.found ? result.value : [];
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-recovery.ts
/**
* Atomically clones a tombstoned transcript, creates its successor, and records
* the revisioned source archive/link transition in the same agent database.
*/
async function recoverSessionEntryFromRestartTombstone(params) {
	const resolved = resolveSqliteStoreScope(params.storePath, { agentId: params.agentId });
	const sourceTarget = normalizeLifecycleTarget({
		...params.sourceTarget,
		storeKeys: [...params.sourceTarget.storeKeys]
	});
	const successorTarget = normalizeLifecycleTarget({
		...params.successorTarget,
		storeKeys: [...params.successorTarget.storeKeys]
	});
	let result = {
		status: "conflict",
		reason: "source-changed"
	};
	(await runExclusiveSqliteSessionWrite(resolved, async () => {
		return runOpenClawAgentWriteTransaction((database) => {
			const source = resolveLifecyclePrimaryEntry(database, sourceTarget)?.entry;
			const recovery = source?.mainRestartRecovery;
			const tombstone = recovery?.tombstone;
			if (!source?.sessionId || !recovery || !tombstone) {
				result = {
					status: "conflict",
					reason: "not-tombstoned"
				};
				return;
			}
			const recoveredSessionKey = tombstone.recoveredSessionKey;
			const recoveredSessionId = tombstone.recoveredSessionId;
			if (recoveredSessionKey || recoveredSessionId) {
				if (!recoveredSessionKey || !recoveredSessionId) {
					result = {
						status: "conflict",
						reason: "successor-missing"
					};
					return;
				}
				const linked = resolveLifecyclePrimaryEntry(database, normalizeLifecycleTarget({
					canonicalKey: recoveredSessionKey,
					storeKeys: [recoveredSessionKey]
				}))?.entry;
				if (!linked || linked.sessionId !== recoveredSessionId) {
					result = {
						status: "conflict",
						reason: "successor-missing"
					};
					return;
				}
				result = {
					status: "existing",
					sourceEntry: cloneSessionEntry(source),
					successorEntry: cloneSessionEntry(linked),
					successorKey: recoveredSessionKey
				};
				return;
			}
			if (source.sessionId !== params.expected.sessionId || source.lifecycleRevision !== params.expected.lifecycleRevision || recovery.cycleId !== params.expected.cycleId || recovery.revision !== params.expected.revision || source.pluginOwnerId !== params.expected.pluginOwnerId) {
				result = {
					status: "conflict",
					reason: "source-changed"
				};
				return;
			}
			if (resolveLifecyclePrimaryEntry(database, successorTarget)?.entry) {
				result = {
					status: "conflict",
					reason: "target-exists"
				};
				return;
			}
			const sourceEvents = loadTranscriptEventsFromDatabase(database, source.sessionId);
			const header = findSessionTranscriptHeader(sourceEvents);
			if (!header) {
				result = {
					status: "conflict",
					reason: "transcript-missing"
				};
				return;
			}
			const successorSessionId = params.successorEntry.sessionId;
			const parentSession = formatLegacySqliteSessionMarkerForScope({
				...resolved,
				sessionId: source.sessionId,
				sessionKey: normalizeSqliteSessionKey(sourceTarget.canonicalKey)
			});
			appendTranscriptEventsInTransaction(database, {
				...resolved,
				sessionId: successorSessionId,
				sessionKey: normalizeSqliteSessionKey(successorTarget.canonicalKey)
			}, [{
				...createSessionTranscriptHeader({
					cwd: typeof header.cwd === "string" ? header.cwd : void 0,
					sessionId: successorSessionId,
					version: header.version ?? 3
				}),
				parentSession
			}, ...sourceEvents.filter((event) => !(isRecord(event) && event.type === "session"))]);
			const now = Date.now();
			const nextSource = {
				...source,
				mainRestartRecovery: {
					...recovery,
					revision: recovery.revision + 1,
					tombstone: {
						...tombstone,
						recoveredSessionId: successorSessionId,
						recoveredSessionKey: successorTarget.canonicalKey
					}
				},
				archivedAt: source.archivedAt ?? now,
				...source.archiveReason ? { archiveReason: source.archiveReason } : source.archivedAt === void 0 ? { archiveReason: "restart-recovery" } : {},
				...source.archivedBy === void 0 && params.archivedBy ? { archivedBy: params.archivedBy } : {},
				updatedAt: Math.max(now, (source.updatedAt ?? 0) + 1)
			};
			delete nextSource.pinnedAt;
			params.commitGuard?.();
			const identityKeys = [sourceTarget.canonicalKey, successorTarget.canonicalKey];
			const previousIdentity = readSessionIdentitySnapshot(database, identityKeys);
			writeSessionEntry(database, successorTarget.canonicalKey, params.successorEntry);
			writeSessionEntry(database, sourceTarget.canonicalKey, nextSource, { previousEntry: source });
			const currentIdentity = readSessionIdentitySnapshot(database, identityKeys);
			result = {
				status: "created",
				sourceEntry: cloneSessionEntry(nextSource),
				successorEntry: cloneSessionEntry(params.successorEntry),
				successorKey: successorTarget.canonicalKey
			};
			return prepareSessionIdentityPublication(database, resolved.agentId, previousIdentity, currentIdentity);
		}, toDatabaseOptions(resolved));
	}, "session.restart.recover"))?.();
	return result;
}
//#endregion
//#region src/config/sessions/session-involvement.ts
function isNewerSessionMention(source, previous) {
	return source.generation === previous.generation ? source.sequence > previous.sequence : source.timestamp > previous.timestamp;
}
/** Profile merges combine mention evidence independently of the latest personal choice. */
function mergeSessionProfileInvolvement(states) {
	let latest;
	let lastMention;
	for (const state of states) {
		if (!state) continue;
		if (!latest || state.updatedAt > latest.updatedAt || state.updatedAt === latest.updatedAt && state.hidden) latest = state;
		if (state.lastMention && (!lastMention || isNewerSessionMention(state.lastMention, lastMention))) lastMention = state.lastMention;
	}
	return latest ? {
		...latest,
		...lastMention ? { lastMention } : {}
	} : void 0;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-involvement.ts
/** One logical-node owner for explicit personal choices and committed mentions. */
function updateSessionProfileInvolvement(scope, params) {
	const resolved = resolveSqliteScope(scope);
	return runOpenClawAgentWriteTransaction((database) => {
		params.assertCurrent?.();
		const current = readExactSessionEntryRow(database, resolved.sessionKey)?.entry;
		if (!current || current.sessionId !== params.expectedSessionId || current.incognito) return false;
		const involvement = { ...current.profileInvolvement?.profiles };
		let changed = false;
		for (const profileId of new Set(params.profileIds)) {
			const aliases = readUserProfileAliases(profileId, { env: scope.env });
			const previous = mergeSessionProfileInvolvement([...aliases].map((alias) => involvement[alias]));
			const lastMention = previous?.lastMention;
			const change = params.change;
			if (change.kind === "mention" && lastMention && !isNewerSessionMention(change.source, lastMention)) continue;
			const hidden = change.kind === "visibility" && change.hidden;
			if (change.kind === "visibility" && previous?.hidden === hidden) continue;
			for (const alias of aliases) delete involvement[alias];
			involvement[profileId] = {
				hidden,
				updatedAt: Math.max(Date.now(), (previous?.updatedAt ?? 0) + 1),
				...change.kind === "mention" ? { lastMention: change.source } : lastMention ? { lastMention } : {}
			};
			changed = true;
		}
		if (changed) {
			writeSessionEntry(database, resolved.sessionKey, current, {
				canonicalPreviousEntry: current,
				profileInvolvement: {
					key: resolved.sessionKey,
					profiles: involvement
				}
			});
			deferOpenClawAgentPostCommitPublication(database, () => emitSessionLifecycleEvent({
				agentId: resolved.agentId,
				sessionKey: resolved.sessionKey,
				reason: "involvement"
			}));
		}
		return true;
	}, toDatabaseOptions(resolved), { operationLabel: "sessions.involvement" });
}
//#endregion
//#region src/config/sessions/session-sharing-store.async.ts
async function runSessionCollaborationWrite(scope, command, native, publish, assertCurrent = () => void 0, prepare) {
	const resolved = resolveSqliteScope(scope);
	const resolvedOptions = toDatabaseOptions(resolved);
	const env = cloneEnvWithPlatformSemantics(resolved.env ?? process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const options = {
		...resolvedOptions,
		env,
		path: resolveOpenClawAgentSqlitePath({
			...resolvedOptions,
			env
		})
	};
	const location = {
		agentId: resolved.agentId,
		storePath: options.path,
		sessionKey: resolved.sessionKey
	};
	const capturedScope = {
		...location,
		env
	};
	if (isIncognitoOpenClawAgentSqlitePath(options.path, options)) return runOpenClawAgentWriteAdmission(options, () => {
		assertCurrent();
		return native(capturedScope);
	}, true);
	const execution = captureOpenClawAgentDatabaseExecution(options);
	const assertQueuedCurrent = () => {
		execution.assertCurrent();
		assertCurrent();
	};
	const commandScope = {
		agentId: resolved.agentId,
		sessionKey: resolved.sessionKey,
		storePath: options.path,
		env: { OPENCLAW_STATE_DIR: env.OPENCLAW_STATE_DIR }
	};
	const capturedCommand = {
		...command,
		input: structuredClone({
			...command.input,
			scope: commandScope
		})
	};
	try {
		return await runOpenClawAgentWriteAdmission(options, () => withOpenClawAgentDatabaseAsync(options, async (database) => {
			const { db } = database;
			assertQueuedCurrent();
			const worker = await openOpenClawAgentSqliteWorkerStore(options, db, {
				moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionSharingStore),
				input: void 0
			});
			let mutationDispatched = false;
			let resultReceived = false;
			let published = false;
			try {
				return await worker.run(async (operation) => {
					if (prepare) await prepare(operation, commandScope);
					assertQueuedCurrent();
					mutationDispatched = capturedCommand.type !== "category.prepare";
					const result = await operation.execute(capturedCommand);
					resultReceived = true;
					const value = publish(result, location, database);
					published = true;
					return value;
				}, assertQueuedCurrent);
			} catch (error) {
				if (mutationDispatched && !published && (resultReceived || collectNestedErrorCandidates(error).some((candidate) => extractErrorCode(candidate) === "outcome-unknown"))) {
					if (capturedCommand.type === "category.apply") discardCommittedSessionEntryCache(database.db);
					sessionChanges.emit(capturedCommand.type === "category.apply" ? {
						all: true,
						scope: { storePath: location.storePath },
						factsInvalidated: true
					} : {
						...location,
						factsInvalidated: true
					});
				}
				throw error;
			} finally {
				await worker.close();
			}
		}, assertQueuedCurrent), true);
	} finally {
		await execution.release();
	}
}
function addSessionMemberInWorker(scope, params, assertCurrent) {
	const capturedParams = structuredClone({
		...params,
		addedAt: params.addedAt ?? Date.now()
	});
	return runSessionCollaborationWrite(scope, {
		type: "add",
		input: {
			scope,
			params: capturedParams
		}
	}, (capturedScope) => addSessionMember(capturedScope, capturedParams), (result, location, database) => {
		if (result.value.inserted) {
			if (result.facts) publishSessionSharingMemberChange(database, location.sessionKey, result.facts, location.agentId);
			else sessionChanges.emit({
				...location,
				factsInvalidated: true
			});
		}
		return result.value;
	}, assertCurrent);
}
function removeSessionMemberInWorker(scope, identityId, expected, expectedSessionId, assertCurrent, expectedEntry) {
	if (!identityId.trim()) return Promise.resolve(null);
	const capturedExpected = expected && structuredClone(expected);
	const capturedExpectedEntry = expectedEntry && structuredClone(expectedEntry);
	return runSessionCollaborationWrite(scope, {
		type: "remove",
		input: {
			scope,
			identityId,
			expected: capturedExpected,
			expectedSessionId,
			expectedEntry: capturedExpectedEntry
		}
	}, (capturedScope) => removeSessionMember(capturedScope, identityId, capturedExpected, expectedSessionId, capturedExpectedEntry), (result, location, database) => {
		if (result.value) {
			if (result.facts) publishSessionSharingMemberChange(database, location.sessionKey, result.facts, location.agentId);
			else sessionChanges.emit({
				...location,
				factsInvalidated: true
			});
		}
		return result.value;
	}, assertCurrent);
}
function recordSessionParticipantInWorker(scope, params) {
	if (!params.identity.id || params.identity.type === "agent" && params.identity.id === params.sessionAgentId) return Promise.resolve(null);
	const capturedParams = structuredClone({
		...params,
		promptedAt: params.promptedAt ?? Date.now()
	});
	return runSessionCollaborationWrite(scope, {
		type: "participant",
		input: {
			scope,
			params: capturedParams
		}
	}, (capturedScope) => recordSessionParticipant(capturedScope, capturedParams), (result, location) => {
		if (result.value === "inserted" || result.value === "updated") {
			if (result.projectionChanged) sessionChanges.emit({
				...location,
				facts: {
					kind: "participants",
					projection: result.participants
				}
			});
			emitSessionLifecycleEvent({
				agentId: location.agentId,
				sessionKey: location.sessionKey,
				reason: "participants"
			});
		}
		return result.value;
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-canonical-inventory.ts
/** Doctor inventory hydrates rejected legacy blobs from promoted node/window columns. */
function hydrateCanonicalRepairEntry(row) {
	let record = {};
	try {
		const parsed = JSON.parse(row.entry_json);
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) record = parsed;
	} catch {}
	const createdActor = row.created_actor_type ? {
		type: row.created_actor_type,
		...row.created_actor_type === "human" ? { source: "unknown" } : {},
		...row.created_actor_id ? { id: row.created_actor_id } : {}
	} : void 0;
	const forkSource = row.fork_source_session_key && row.fork_source_session_id ? {
		sessionKey: row.fork_source_session_key,
		sessionId: row.fork_source_session_id,
		...row.fork_source_entry_id ? { entryId: row.fork_source_entry_id } : {}
	} : void 0;
	const delivery = row.delivery_channel && row.delivery_target ? normalizeSessionDeliveryState({ context: {
		channel: row.delivery_channel,
		to: row.delivery_target,
		...row.delivery_account_id ? { accountId: row.delivery_account_id } : {},
		...row.delivery_thread_id ? { threadId: row.delivery_thread_id } : {}
	} }) : void 0;
	const entry = projectCanonicalSessionEntryShape({
		...record,
		...row.status ? { status: row.status } : {},
		...row.current_started_at !== null ? { startedAt: row.current_started_at } : {},
		...row.current_ended_at !== null ? { endedAt: row.current_ended_at } : {},
		...row.current_chat_type ? { chatType: row.current_chat_type } : {},
		...row.current_model_provider ? { modelProvider: row.current_model_provider } : {},
		...row.current_model ? { model: row.current_model } : {},
		...row.current_previous_session_id ? { previousSessionId: row.current_previous_session_id } : {},
		...row.current_agent_harness_id ? { agentHarnessId: row.current_agent_harness_id } : {},
		...delivery ? { delivery } : {},
		...row.created_at !== null ? { createdAt: row.created_at } : {},
		...row.created_via ? { createdVia: row.created_via } : {},
		...createdActor ? { createdActor } : {},
		...row.spawned_by ? { spawnedBy: row.spawned_by } : {},
		...row.parent_session_key && row.parent_session_key !== row.spawned_by ? { parentSessionKey: row.parent_session_key } : {},
		...forkSource ? { forkSource } : {},
		...row.label ? { label: row.label } : {},
		...row.display_name ? { displayName: row.display_name } : {},
		...row.category ? { category: row.category } : {},
		...row.icon ? { icon: row.icon } : {},
		...row.pinned_at !== null ? { pinnedAt: row.pinned_at } : {},
		...row.archived_at !== null ? { archivedAt: row.archived_at } : {},
		...row.last_read_at !== null ? { lastReadAt: row.last_read_at } : {},
		...row.last_interaction_at !== null ? { lastInteractionAt: row.last_interaction_at } : {},
		...row.last_activity_at !== null ? { lastActivityAt: row.last_activity_at } : {},
		sessionId: row.current_session_id,
		updatedAt: row.updated_at
	});
	return projectSqliteSessionOwner(entry, row);
}
function canonicalRepairQuery(database) {
	return getSessionKysely(database.db).selectFrom("session_nodes").leftJoin("session_windows as current_window", (join) => join.onRef("current_window.session_id", "=", "session_nodes.current_session_id").onRef("current_window.session_key", "=", "session_nodes.session_key")).leftJoin("session_windows as current_window_owner", "current_window_owner.session_id", "session_nodes.current_session_id").leftJoin("conversations as current_conversation", "current_conversation.conversation_id", "current_window.primary_conversation_id").selectAll("session_nodes").select([
		"current_window_owner.session_key as current_window_owner_session_key",
		"current_window.started_at as current_started_at",
		"current_window.ended_at as current_ended_at",
		"current_window.chat_type as current_chat_type",
		"current_window.model_provider as current_model_provider",
		"current_window.model as current_model",
		"current_window.previous_session_id as current_previous_session_id",
		"current_window.agent_harness_id as current_agent_harness_id",
		"current_conversation.channel as delivery_channel",
		"current_conversation.account_id as delivery_account_id",
		"current_conversation.delivery_target",
		"current_conversation.thread_id as delivery_thread_id"
	]).orderBy("session_nodes.session_key");
}
function scanCanonicalSessionFactsFromDatabase(database, selectedKeys) {
	const scanned = [];
	const loaded = /* @__PURE__ */ new Map();
	const validSessionKeysById = /* @__PURE__ */ new Map();
	const inventoriedSessionKeys = /* @__PURE__ */ new Set();
	for (const row of iterateSqliteQuerySync(database.db, canonicalRepairQuery(database))) {
		inventoriedSessionKeys.add(row.session_key);
		const persistedEntry = parseSessionEntryJson(row);
		if (row.entry_valid === 1 && persistedEntry) {
			const keys = validSessionKeysById.get(row.current_session_id) ?? [];
			keys.push(row.session_key);
			validSessionKeysById.set(row.current_session_id, keys);
		}
		const entry = persistedEntry ?? hydrateCanonicalRepairEntry(row);
		if (selectedKeys?.has(row.session_key)) loaded.set(row.session_key, {
			entry,
			rawEntryJson: row.entry_json
		});
		const lineageProjectionMismatch = Boolean(persistedEntry && ((row.parent_session_key ?? void 0) !== (persistedEntry.parentSessionKey ?? persistedEntry.spawnedBy ?? void 0) || (row.spawned_by ?? void 0) !== (persistedEntry.spawnedBy ?? void 0) || (row.fork_source_session_key ?? void 0) !== (persistedEntry.forkSource?.sessionKey ?? void 0)));
		const decision = {
			delivery: entry.delivery,
			forkSourceSessionKey: entry.forkSource?.sessionKey,
			groupId: entry.groupId,
			parentSessionKey: entry.parentSessionKey,
			rawCompareRequired: row.entry_valid !== 1 || !persistedEntry || lineageProjectionMismatch,
			sessionKey: row.session_key,
			spawnedBy: entry.spawnedBy
		};
		const context = deliveryContextFromSession(decision);
		const origin = sessionDeliveryOrigin(decision);
		scanned.push({
			currentSessionId: row.current_session_id,
			currentWindowOwnerSessionKey: row.current_window_owner_session_key,
			decision,
			entryJsonIsEmpty: row.entry_json === "{}",
			rowToken: JSON.stringify([
				row.session_key,
				row.current_session_id,
				row.entry_valid,
				persistedEntry !== null,
				row.entry_json === "{}",
				row.current_window_owner_session_key,
				context?.channel ?? null,
				context?.to ?? null,
				context?.threadId == null ? null : String(context.threadId),
				origin?.nativeChannelId ?? null,
				origin?.to ?? null,
				decision.groupId ?? null,
				decision.parentSessionKey ?? null,
				decision.spawnedBy ?? null,
				decision.forkSourceSessionKey ?? null,
				row.parent_session_key,
				row.spawned_by,
				row.fork_source_session_key,
				decision.rawCompareRequired
			])
		});
	}
	const inventoryHash = createHash("sha256");
	const facts = [];
	for (const fact of scanned) {
		const isEmptyWindowOwner = fact.entryJsonIsEmpty && fact.currentWindowOwnerSessionKey === fact.decision.sessionKey;
		const competingValidKeys = (validSessionKeysById.get(fact.currentSessionId) ?? []).filter((sessionKey) => sessionKey !== fact.decision.sessionKey).toSorted();
		const canonicalOwnerSessionKey = isEmptyWindowOwner ? competingValidKeys.length === 1 ? competingValidKeys[0] : void 0 : fact.entryJsonIsEmpty && fact.currentWindowOwnerSessionKey && inventoriedSessionKeys.has(fact.currentWindowOwnerSessionKey) ? fact.currentWindowOwnerSessionKey : void 0;
		const decisionToken = JSON.stringify([fact.rowToken, canonicalOwnerSessionKey ?? null]);
		inventoryHash.update(decisionToken).update("\0");
		if (!isEmptyWindowOwner || canonicalOwnerSessionKey) facts.push({
			...fact.decision,
			...canonicalOwnerSessionKey ? { canonicalOwnerSessionKey } : {},
			decisionToken
		});
	}
	const inventoryToken = inventoryHash.digest("base64url");
	return {
		facts: facts.map((fact) => Object.assign(fact, { inventoryToken })),
		inventoryToken,
		loaded
	};
}
function loadCanonicalRepairEntriesFromDatabase(database, facts) {
	const current = scanCanonicalSessionFactsFromDatabase(database, new Set(facts.map((fact) => fact.sessionKey)));
	const currentByKey = new Map(current.facts.map((fact) => [fact.sessionKey, fact]));
	const expectedInventoryTokens = new Set(facts.map((fact) => fact.inventoryToken));
	if (expectedInventoryTokens.size !== 1 || !expectedInventoryTokens.has(current.inventoryToken)) throw new Error("Canonical session repair inputs changed during scan; retry Doctor");
	return facts.map((fact) => {
		if (currentByKey.get(fact.sessionKey)?.decisionToken !== fact.decisionToken) throw new Error(`Canonical session repair inputs changed during scan for ${fact.sessionKey}; retry Doctor`);
		const loaded = current.loaded.get(fact.sessionKey);
		if (!loaded) throw new Error(`Canonical session repair row disappeared during scan: ${fact.sessionKey}`);
		return {
			entry: loaded.entry,
			sessionKey: fact.sessionKey,
			...fact.rawCompareRequired ? { rawEntryJson: loaded.rawEntryJson } : {}
		};
	});
}
function listCanonicalSessionRepairFacts(scope) {
	const resolved = resolveSqliteScope({
		...scope,
		sessionKey: ""
	});
	const result = withOpenClawAgentDatabaseReadOnly((database) => scanCanonicalSessionFactsFromDatabase(database).facts, toDatabaseOptions(resolved));
	return result.found ? result.value : [];
}
function loadCanonicalSessionRepairEntries(scope, facts) {
	if (facts.length === 0) return [];
	const resolved = resolveSqliteScope({
		...scope,
		sessionKey: ""
	});
	const result = withOpenClawAgentDatabaseReadOnly((database) => loadCanonicalRepairEntriesFromDatabase(database, facts), toDatabaseOptions(resolved));
	if (!result.found) throw new Error("Canonical session repair database disappeared during scan; retry Doctor");
	return result.value;
}
/** Strict Doctor scan of canonical rows, ordered by durable session key. */
function scanDoctorSessionEntriesStrict(scope, visit) {
	const resolved = resolveSqliteScope({
		...scope,
		sessionKey: ""
	});
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		let count = 0;
		scanCanonicalSqliteSessionEntries(database, ({ entry, sessionKey }) => {
			if (isInternalSessionEffectsKey(sessionKey)) return;
			visit({
				entry,
				recoveredFromProjections: false,
				sessionKey
			});
			count += 1;
		});
		return count;
	}, toDatabaseOptions(resolved));
	return result.found ? result.value : 0;
}
/** Tolerant Doctor preview scan with canonical-repair tombstone eligibility. */
function scanDoctorSessionEntriesTolerant(scope, visit) {
	const resolved = resolveSqliteScope({
		...scope,
		sessionKey: ""
	});
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const eligible = new Set(scanCanonicalSessionFactsFromDatabase(database).facts.map((fact) => fact.sessionKey));
		let count = 0;
		for (const row of iterateSqliteQuerySync(database.db, canonicalRepairQuery(database))) {
			if (!eligible.has(row.session_key) || isInternalSessionEffectsKey(row.session_key)) continue;
			const entry = parseSessionEntryJson(row);
			visit({
				entry: entry ?? hydrateCanonicalRepairEntry(row),
				recoveredFromProjections: entry === null,
				sessionKey: row.session_key
			});
			count += 1;
		}
		return count;
	}, toDatabaseOptions(resolved));
	return result.found ? result.value : 0;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-doctor-rewrite.ts
const DOCTOR_SESSION_REWRITE_BATCH_SIZE = 64;
function iterateDoctorSessionKeyBatches(sessionKeys) {
	return chunkItems(uniqueStrings(sessionKeys).toSorted(), DOCTOR_SESSION_REWRITE_BATCH_SIZE);
}
/** Rewrites bounded entry batches after rereading each authoritative row inside its commit. */
function rewriteDoctorSessionEntries(params) {
	const resolved = resolveSqliteScope({
		...params.scope,
		sessionKey: ""
	});
	let rewritten = 0;
	for (const batch of iterateDoctorSessionKeyBatches(params.sessionKeys)) rewritten += runOpenClawAgentWriteTransaction((database) => {
		const db = getSessionKysely(database.db);
		let batchRewritten = 0;
		for (const sessionKey of batch) {
			const row = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
				"session_key",
				"current_session_id",
				"entry_json",
				"updated_at"
			]).where("session_key", "=", sessionKey)).rows[0];
			if (!row) continue;
			const entry = parseSqliteSessionEntryRecord(row);
			if (!entry) continue;
			const transformedEntry = params.transform(entry, sessionKey);
			const transformedJson = JSON.stringify(transformedEntry);
			if (transformedJson === row.entry_json) continue;
			const nextEntry = stripRuntimeOnlySessionSkillsFields(transformedEntry);
			const entryJson = nextEntry === transformedEntry ? transformedJson : JSON.stringify(nextEntry);
			if (!parseSqliteSessionEntryRecord({
				...row,
				entry_json: entryJson
			})) continue;
			invalidateSessionEntryMaintenanceAgeFact(database.db);
			const writeGeneration = trackSessionEntryCacheWrite(database, () => {
				executeSqliteQuerySync(database.db, db.updateTable("session_nodes").set({ entry_json: entryJson }).where("session_key", "=", sessionKey));
				executeSqliteQuerySync(database.db, db.updateTable("session_nodes").set({ entry_valid: 1 }).where("session_key", "=", sessionKey));
				if (params.updateDeliveryProjection) executeSqliteQuerySync(database.db, db.updateTable("session_windows").set({
					account_id: deliveryContextFromSession(nextEntry)?.accountId ?? null,
					channel: sessionDeliveryChannel(nextEntry) ?? null
				}).where("session_id", "=", row.current_session_id));
			});
			publishSessionEntryCacheInvalidation(database, {
				sessionKey,
				entry: nextEntry
			}, writeGeneration);
			batchRewritten += 1;
		}
		return batchRewritten;
	}, toDatabaseOptions(resolved), { operationLabel: "doctor.rewrite-session-entries" });
	return rewritten;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-message-cut.ts
async function rewindSessionToMessage(params, expectedState) {
	return await mutateSqliteSessionAtMessage(params, "rewind", expectedState);
}
async function forkSessionAtMessage(params, expectedState) {
	return await mutateSqliteSessionAtMessage(params, "fork", expectedState);
}
async function switchSessionBranch(params, expectedState) {
	return await mutateSqliteSessionAtMessage({
		...params,
		entryId: params.leafEntryId
	}, "switch", expectedState);
}
async function mutateSqliteSessionAtMessage(params, mode, expectedState) {
	const canonicalSourceKey = normalizeSqliteSessionKey(params.sessionKey);
	const sourceKey = normalizeSqliteSessionKey(params.sessionStoreKey ?? params.sessionKey);
	const targetKey = mode === "fork" ? normalizeSqliteSessionKey(params.targetKey ?? params.sessionKey) : sourceKey;
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		...params.env ? { env: params.env } : {},
		sessionKey: sourceKey,
		...params.storePath ? { storePath: params.storePath } : {}
	});
	const preparedEntry = readSessionEntryRow(openOpenClawAgentDatabase(toDatabaseOptions(resolved)), sourceKey)?.entry;
	const preparedExpectedState = expectedState ?? (preparedEntry?.sessionId ? {
		sessionId: preparedEntry.sessionId,
		lifecycleRevision: preparedEntry.lifecycleRevision
	} : void 0);
	if (preparedEntry?.sessionId) {
		params.commitGuard?.();
		const { restoreSessionColdTranscript } = await import("./session-cold-storage-CqarxOH9.mjs");
		await restoreSessionColdTranscript({
			...params,
			agentId: resolved.agentId,
			sessionId: preparedEntry.sessionId
		});
	}
	const mutate = async (assertPreparedCurrent) => await runExclusiveSqliteSessionWrite(resolved, async () => {
		let previousIdentity = /* @__PURE__ */ new Map();
		const { databasePath, result, publish } = runSqliteSessionDeletionTransaction((database) => {
			assertPreparedCurrent?.();
			params.commitGuard?.();
			const identityKeys = uniqueStrings([...collectSessionEntryLookupKeys(database, sourceKey), ...collectSessionEntryLookupKeys(database, targetKey)]);
			previousIdentity = readSessionIdentitySnapshot(database, identityKeys);
			const mutationResult = mutateSqliteSessionAtMessageInTransaction(database, resolved, {
				entryId: params.entryId,
				canonicalSourceKey,
				creation: params.creation,
				forkWorkspace: params.forkWorkspace,
				mode,
				expectedState: preparedExpectedState,
				repositoryWorkspaceId: params.repositoryWorkspaceId,
				sourceKey,
				targetKey
			});
			const currentIdentity = readSessionIdentitySnapshot(database, identityKeys);
			return {
				databasePath: database.path,
				result: mutationResult,
				publish: prepareSessionIdentityPublication(database, resolved.agentId, previousIdentity, currentIdentity)
			};
		}, toDatabaseOptions(resolved));
		if (result.status === "created") invalidateSessionBranchCache(databasePath, [...[...previousIdentity.values()].flatMap((entry) => entry.sessionId ? [entry.sessionId] : []), ...result.entry.sessionId ? [result.entry.sessionId] : []]);
		publish();
		return result;
	}, "session.message-cut.mutate");
	return mode !== "fork" && preparedEntry ? await withSqliteSessionContextReset(resolved, {
		sessionKey: sourceKey,
		entry: preparedEntry
	}, mutate) : await mutate();
}
function mutateSqliteSessionAtMessageInTransaction(database, resolved, params) {
	const currentEntry = readSessionEntryRow(database, params.sourceKey)?.entry;
	if (!currentEntry?.sessionId) return { status: "missing-session" };
	if (!params.expectedState || currentEntry.sessionId !== params.expectedState.sessionId || currentEntry.lifecycleRevision !== params.expectedState.lifecycleRevision) return { status: "conflict" };
	assertModelSelectionUnlocked(currentEntry, "Session history changes are unavailable while model selection is locked.");
	const events = loadTranscriptEventsFromDatabase(database, currentEntry.sessionId);
	const cut = params.mode === "switch" ? void 0 : resolveMessageCut(events, params.entryId);
	if (cut && cut.status !== "cut") return cut;
	if (params.mode === "switch") {
		const tipStatus = validateBranchTip(events, params.entryId);
		if (tipStatus) return { status: tipStatus };
	}
	if (params.mode === "fork" && currentEntry.repositoryWorkspaceId && (!params.repositoryWorkspaceId || params.repositoryWorkspaceId === currentEntry.repositoryWorkspaceId)) throw new Error("Repository session fork requires its own prepared workspace");
	if (params.mode !== "fork") commitSqliteSessionDeletion(params.sourceKey, currentEntry);
	const nextSessionId = randomUUID();
	const targetScope = {
		...resolved,
		sessionId: nextSessionId,
		sessionKey: params.targetKey
	};
	const header = createSessionTranscriptHeader({
		cwd: readTranscriptHeaderCwd(events),
		sessionId: nextSessionId,
		version: findSessionTranscriptHeader(events)?.version ?? 3
	});
	const nextEvents = params.mode === "fork" && cut?.status === "cut" ? [header, ...cut.prefix] : [
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
	let copiedBytes = 0;
	const rebuildSynchronously = params.mode !== "fork" && nextEvents.length <= 4e3 && nextEvents.every((event) => {
		copiedBytes += JSON.stringify(event).length;
		return copiedBytes <= 4194304;
	});
	if (params.mode !== "fork" && !rebuildSynchronously) {
		ensureTranscriptSessionRoot(database, targetScope, Date.parse(header.timestamp));
		markSessionTranscriptIndexDirtyInTransaction(database.db, nextSessionId);
	}
	appendTranscriptEventsInTransaction(database, targetScope, nextEvents);
	if (rebuildSynchronously) reconcileSessionTranscriptIndexInTransaction(database.db, nextSessionId);
	const nextEntry = {
		...cloneMessageCutSessionEntry({
			currentEntry,
			forked: params.mode === "fork",
			forkSource: params.mode === "fork" ? {
				sessionKey: params.canonicalSourceKey,
				sessionId: currentEntry.sessionId,
				entryId: params.entryId
			} : void 0,
			nextSessionId
		}),
		...params.mode === "fork" ? params.forkWorkspace : {},
		...params.mode === "fork" && params.creation ? buildSessionCreationStamp(params.creation) : {},
		...params.mode === "fork" && params.repositoryWorkspaceId ? { repositoryWorkspaceId: params.repositoryWorkspaceId } : {},
		...currentEntry.incognito === true || isIncognitoSessionKey(params.canonicalSourceKey) ? { incognito: true } : {}
	};
	writeSessionEntry(database, params.targetKey, nextEntry);
	return {
		status: "created",
		key: params.targetKey,
		entry: nextEntry,
		...cut?.status === "cut" && cut.editorText ? { editorText: cut.editorText } : {},
		...cut?.status === "cut" && cut.editorAttachments ? { editorAttachments: cut.editorAttachments } : {},
		...cut?.status === "cut" && cut.editorMediaRefs ? { editorMediaRefs: cut.editorMediaRefs } : {}
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
function cloneMessageCutSessionEntry(params) {
	return {
		...params.forked ? inheritSessionSelection(params.currentEntry) : params.currentEntry,
		sessionId: params.nextSessionId,
		lifecycleRevision: params.forked ? randomUUID() : params.currentEntry.lifecycleRevision,
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
		usageFamilyKey: params.forked ? void 0 : params.currentEntry.usageFamilyKey,
		usageFamilySessionIds: params.forked ? void 0 : params.currentEntry.usageFamilySessionIds,
		previousSessionId: params.forked ? void 0 : params.currentEntry.sessionId,
		...params.forkSource ? {
			forkSource: params.forkSource,
			parentSessionKey: params.forkSource.sessionKey
		} : {}
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
//#region src/config/sessions/session-accessor.sqlite-transcript-append-result.ts
function requireTranscriptEventAppendSnapshot(result, message) {
	if (result.ok && result.value.result.appended) return {
		...result.value,
		result: result.value.result
	};
	const cause = result.ok ? { code: "transcript-event-not-appended" } : result.error;
	throw new Error(`${message}: ${cause.code}`, { cause });
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-compaction.ts
/** Commits one compaction boundary and its session accounting as one SQLite write. */
function persistCompactionBoundaryWithSessionEntrySync(scope, params) {
	const fencedScope = withOwnedSessionTranscriptWriterFence(scope);
	const resolved = resolveSqliteTranscriptScope(fencedScope);
	const preparedScope = withOwnedSessionTranscriptWriterFence(params.prepared.scope);
	const preparedTarget = resolveSqliteTranscriptScope(preparedScope);
	if (preparedTarget.agentId !== resolved.agentId || preparedTarget.sessionId !== resolved.sessionId || preparedTarget.sessionKey !== resolved.sessionKey || resolveOpenClawAgentSqlitePath(toDatabaseOptions(preparedTarget)) !== resolveOpenClawAgentSqlitePath(toDatabaseOptions(resolved))) throw new SessionTranscriptWriterClaimReboundError();
	return runOpenClawAgentWriteTransaction((database) => {
		assertOwnedTranscriptWriteCommit(fencedScope);
		assertOwnedTranscriptWriteCommit(preparedScope);
		if (params.prepared.initializeEntry) {
			if (!ensureSessionEntrySync(preparedScope, {
				sessionId: resolved.sessionId,
				updatedAt: Date.now()
			})) throw new Error("Session transcript header was not persisted");
			getOwnedSessionTranscriptInitialWriter({ sessionTarget: preparedScope })?.assertActive();
		}
		assertLockedTranscriptWriteAllowed(database, resolved, fencedScope);
		assertLockedTranscriptWriteAllowed(database, resolved, preparedScope);
		const event = {
			...params.prepared.event,
			parentId: resolveTranscriptMessageAppendParent(database, resolved.sessionId, {
				parentId: params.prepared.event.parentId,
				appendIntent: params.prepared.appendIntent
			})
		};
		const firstAppendedSeq = readNextTranscriptSeq(database, resolved.sessionId);
		const committed = requireTranscriptEventAppendSnapshot(appendTranscriptEventSnapshotSync(preparedScope, event, { expectedMutationAt: params.prepared.expectedMutationAt }), `Session transcript entry was not persisted: ${event.id}`);
		const appendedRows = readTranscriptEventRows(database, resolved.sessionId, { afterSeq: firstAppendedSeq - 1 });
		if (event.type !== "compaction" || appendedRows.length !== 1 || appendedRows[0]?.eventJson !== JSON.stringify(event)) throw new Error("Compaction boundary validation failed");
		assertOwnedTranscriptWriteCommit(fencedScope);
		assertOwnedTranscriptWriteCommit(preparedScope);
		const fresh = readSessionEntryRow(database, resolved.sessionKey)?.entry;
		const refusal = resolveTranscriptAppendRefusal(fresh, resolved, fencedScope);
		if (refusal) throw new SessionTranscriptWriterClaimReboundError(refusal);
		const entry = projectCanonicalSessionEntryShape({
			...fresh,
			...projectCompactionAccountingPatch(fresh, {
				compactionKind: "context-engine",
				transcriptByteCompactionLatch: params.transcriptByteCompactionLatch
			})
		});
		writeSessionEntry(database, resolved.sessionKey, entry, {
			previousEntry: fresh,
			canonicalPreviousEntry: fresh
		});
		return {
			result: event,
			before: committed.before,
			after: readTranscriptContextVersionInTransaction(database, resolved.sessionId)
		};
	}, toDatabaseOptions(resolved), { operationLabel: "session.compaction-boundary" });
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-delta.ts
/** Read one generation-consistent raw transcript page without parsing excluded payload rows. */
function readTranscriptRawDelta(scope, limits = {}) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const { maxEvents, maxBytes } = normalizeRawDeltaLimits(limits);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return runSqliteDeferredTransactionSync(database.db, () => {
		assertSessionTranscriptHot(database.db, resolved.sessionId);
		const beforeEventSeq = resolveSqliteSessionTranscriptReadFence({
			database,
			...resolved
		})?.beforeRawSeq;
		return readRawDeltaInTransaction(database.db, resolved, limits.cursor, maxEvents, maxBytes, beforeEventSeq);
	}, {
		databaseLabel: database.path,
		operationLabel: "session transcript raw delta"
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-suffix-read.ts
/** Loads one raw suffix only after SQL-side row and byte bounds are proven. */
function loadTranscriptSuffixEventsBoundedSync(scope, startSeq, limits) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return runSqliteDeferredTransactionSync(database.db, () => {
		assertSessionTranscriptHot(database.db, resolved.sessionId);
		const db = getSessionKysely(database.db);
		const fence = resolveSqliteSessionTranscriptReadFence({
			database,
			...resolved
		});
		if (fence) {
			if (executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select("seq").where("session_id", "=", resolved.sessionId).where("seq", ">=", fence.beforeRawSeq).limit(1))) throw new SessionTranscriptReadFenceError(`Current-turn transcript admission hides rows needed for suffix mutation: ${fence.admission.entryId}`);
		}
		const metadata = executeSqliteQuerySync(database.db, db.selectFrom("transcript_events").select(["seq", sql`${transcriptRetainedDataBytesSql(limits.retainedCustomDataIds ?? [])} + 1`.as("serialized_bytes")]).where("session_id", "=", resolved.sessionId).where("seq", ">=", startSeq).orderBy("seq", "asc").limit(limits.maxEvents + 1)).rows;
		if (metadata.length > limits.maxEvents) throw new Error(`Transcript suffix exceeds synchronous planning row limit for ${resolved.sessionId}`);
		let bytes = 0;
		for (const row of metadata) {
			bytes += row.serialized_bytes;
			if (bytes > limits.maxBytes) throw new Error(`Transcript suffix exceeds synchronous planning byte limit for ${resolved.sessionId}`);
		}
		if (metadata.length === 0) return [];
		const rows = executeSqliteQuerySync(database.db, db.selectFrom("transcript_events").select([projectTranscriptRetainedDataSql(transcriptEventJsonSql(database.db), limits.retainedCustomDataIds ?? []).as("event_json"), "seq"]).where("session_id", "=", resolved.sessionId).where("seq", "in", metadata.map((row) => row.seq)).orderBy("seq", "asc")).rows;
		if (rows.length !== metadata.length || rows.some((row, index) => row.seq !== metadata[index]?.seq)) throw new Error(`SQLite transcript changed while reading suffix for ${resolved.sessionId}`);
		return rows.map((row) => JSON.parse(row.event_json));
	}, {
		databaseLabel: database.path,
		operationLabel: "bounded transcript suffix read"
	});
}
/** Reads the nearest active indexed event before a raw transcript sequence. */
function readPreviousIndexedTranscriptEventSync(scope, beforeSeq) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const db = getActiveTranscriptKysely(projection.database);
		const row = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "identity.session_id").onRef("event.seq", "=", "identity.seq")).select([transcriptEventJsonSql(projection.database.db, "event").as("event_json"), "identity.seq"]).where("identity.session_id", "=", projection.resolved.sessionId).where("identity.seq", "<", beforeSeq).orderBy("active.active_position", "desc").limit(1));
		return row ? {
			event: JSON.parse(row.event_json),
			seq: coerceRequiredSqliteNumber(row.seq)
		} : void 0;
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-message-rewrite.ts
/** Rewrites one exact anchored message without rejecting unrelated later appends. */
async function rewriteTranscriptMessageAtAnchor(anchor, rewriteMessage) {
	const resolved = resolveSqliteTranscriptScope(anchor);
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		let result = null;
		runOpenClawAgentWriteTransaction((database) => {
			assertSessionTranscriptHot(database.db, resolved.sessionId);
			const row = executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select(transcriptEventJsonSql(database.db).as("event_json")).where("session_id", "=", resolved.sessionId).where("seq", "=", anchor.rawSeq));
			if (!row) return;
			const event = JSON.parse(row.event_json);
			if (!isRecord(event) || event.type !== "message" || event.id !== anchor.entryId) return;
			const message = rewriteMessage(event.message);
			if (message === void 0) return;
			rewriteSqliteTranscriptEventRowsInTransaction(database, resolved, [{
				event: {
					...event,
					message
				},
				expectedEventJson: row.event_json,
				seq: anchor.rawSeq
			}]);
			const generation = readTranscriptGenerationInTransaction(database, resolved.sessionId);
			if (generation) result = {
				generation,
				message
			};
		}, toDatabaseOptions(resolved), { operationLabel: "session.transcript.message-rewrite" });
		return result;
	}, "session.transcript.message-rewrite");
}
/** Updates the terminal assistant owned by one run, preserving unrelated later turns. */
async function rewriteAssistantTranscriptMessageForRun(params) {
	const scope = withOwnedSessionTranscriptWriterFence({
		...params.scope,
		expectedLifecycleRevision: params.expectedLifecycleRevision ?? void 0
	});
	const resolved = resolveSqliteTranscriptScope(scope);
	const { restoreSessionColdTranscript } = await import("./session-cold-storage-CqarxOH9.mjs");
	await restoreSessionColdTranscript({
		...scope,
		sessionId: resolved.sessionId
	});
	return await runExclusiveSqliteSessionWrite(resolved, async () => runOpenClawAgentWriteTransaction((database) => {
		assertSessionTranscriptHot(database.db, resolved.sessionId);
		assertOwnedTranscriptWriteCommit(scope);
		const current = readSessionEntryRow(database, resolved.sessionKey)?.entry;
		if (!transcriptWriteScopeIsCurrent(current, resolved.sessionId, scope) || current?.lifecycleRevision !== (params.expectedLifecycleRevision ?? void 0)) throw new SessionTranscriptWriterClaimReboundError();
		const event = findTranscriptEventInDatabase(database, resolved.sessionId, (event) => {
			if (!isRecord(event) || !isRecord(event.message)) return false;
			return readSessionTranscriptRunId(event.message) === params.runId && resolveTerminalAssistantTranscriptRunId(event.message, params.runId) !== void 0;
		})?.event;
		if (!isRecord(event) || typeof event.id !== "string" || !isRecord(event.message)) return null;
		const identity = readTranscriptIdentityByEventId(database, resolved.sessionId, event.id);
		if (!identity) return null;
		const message = params.rewriteMessage(event.message);
		if (!isDeepStrictEqual(message, event.message)) rewriteSqliteTranscriptEventRowsInTransaction(database, resolved, [{
			event: {
				...event,
				message
			},
			expectedEventJson: JSON.stringify(event),
			seq: identity.seq
		}]);
		return { messageId: event.id };
	}, toDatabaseOptions(resolved)), "session.transcript.message-rewrite");
}
//#endregion
//#region src/config/sessions/session-accessor.transcript.ts
/**
* Trims a transcript for manual sessions.compact and clears stale token metadata.
* This is one storage-sized mutation: future stores can trim transcript rows and
* update entry metadata inside the same backend transaction.
*/
async function preflightSessionTranscriptForManualCompact(scope, params) {
	const eventCount = readTranscriptStatsSync(scope).eventCount;
	if (eventCount === 0) return {
		compacted: false,
		reason: "no transcript"
	};
	return eventCount > Math.max(1, Math.floor(params.maxLines)) ? { compacted: true } : {
		compacted: false,
		kept: eventCount
	};
}
async function trimSessionTranscriptForManualCompact(scope, params) {
	const maxLines = Math.max(1, Math.floor(params.maxLines));
	const maxTailLines = Math.max(0, maxLines - 1);
	let declined = {
		compacted: false,
		reason: "no transcript"
	};
	const trimmed = await trimTranscriptForManualCompact(scope, (lines) => {
		if (lines.length === 0) {
			declined = {
				compacted: false,
				reason: "no transcript"
			};
			return null;
		}
		if (lines.length <= maxLines) {
			declined = {
				compacted: false,
				kept: lines.length
			};
			return null;
		}
		const tailLines = lines.slice(1);
		const retainedLines = normalizeManualCompactTranscriptLines(lines[0], maxTailLines > 0 ? tailLines.slice(-maxTailLines) : []);
		if (!retainedLines) {
			declined = {
				compacted: false,
				kept: 0
			};
			return null;
		}
		return retainedLines;
	}, params.nowMs === void 0 ? {} : { nowMs: params.nowMs });
	if (!trimmed.trimmed) return declined;
	return {
		compacted: true,
		kept: trimmed.kept
	};
}
function parseManualCompactTranscriptRecord(line) {
	return safeParseJsonRecord(line) ?? null;
}
function normalizeManualCompactTranscriptLines(headerLine, tailLines) {
	if (!headerLine) return null;
	const header = parseManualCompactTranscriptRecord(headerLine);
	if (header?.type !== "session" || typeof header.id !== "string") return null;
	const records = tailLines.map(parseManualCompactTranscriptRecord).filter((record) => record !== null);
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
//#region src/config/sessions/goals-transitions.ts
var SessionGoalTransitionError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "SessionGoalTransitionError";
	}
};
function normalizeTokenCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : void 0;
}
function resolveEntryFreshTotalTokens(entry) {
	return normalizeTokenCount(resolveFreshSessionTotalTokens(entry));
}
function normalizeTokenBudget(value) {
	const normalized = normalizeTokenCount(value);
	return normalized && normalized > 0 ? normalized : void 0;
}
function accountSessionGoalUsage(entry, now, options) {
	const goal = entry.goal;
	if (!goal) return;
	const totalTokens = resolveEntryFreshTotalTokens(entry);
	const hasFreshStart = goal.tokenStartFresh !== false;
	const shouldHoldStaleStart = !hasFreshStart && options?.adoptFreshBaseline === false;
	const shouldAdoptFreshStart = !shouldHoldStaleStart && totalTokens !== void 0 && !hasFreshStart;
	const tokenStart = shouldAdoptFreshStart ? totalTokens : normalizeTokenCount(goal.tokenStart) ?? totalTokens ?? 0;
	const tokensUsed = totalTokens === void 0 || shouldAdoptFreshStart || shouldHoldStaleStart ? goal.tokensUsed : Math.max(goal.tokensUsed, Math.max(0, totalTokens - tokenStart));
	const next = {
		...goal,
		tokenStart,
		tokenStartFresh: hasFreshStart || shouldAdoptFreshStart,
		tokensUsed
	};
	if (next.status === "active" && next.tokenBudget !== void 0 && tokensUsed >= next.tokenBudget) {
		next.status = "budget_limited";
		next.budgetLimitedAt = now;
		next.updatedAt = now;
	}
	return next;
}
function buildCreatedSessionGoal(entry, options, now) {
	const objective = options.objective;
	if (!objective.trim()) throw new SessionGoalTransitionError("objective required");
	if (entry.goal) throw new SessionGoalTransitionError("goal already exists");
	const tokenBudget = normalizeTokenBudget(options.tokenBudget);
	const tokenStart = resolveEntryFreshTotalTokens(entry);
	return {
		schemaVersion: 1,
		id: crypto.randomUUID(),
		objective,
		status: "active",
		createdAt: now,
		updatedAt: now,
		tokenStart: tokenStart ?? 0,
		tokenStartFresh: tokenStart !== void 0,
		tokensUsed: 0,
		...tokenBudget ? { tokenBudget } : {},
		continuationTurns: 0
	};
}
function buildUpdatedSessionGoalStatus(entry, options, now) {
	const accounted = accountSessionGoalUsage(entry, now);
	if (!accounted) throw new SessionGoalTransitionError("goal not found");
	if (accounted.status === "complete" && accounted.status !== options.status) throw new SessionGoalTransitionError(`goal is already ${accounted.status}`);
	const resetsBudgetWindow = options.status === "active" && (accounted.status === "budget_limited" || accounted.status === "usage_limited" || accounted.tokenBudget !== void 0 && accounted.tokensUsed >= accounted.tokenBudget);
	const freshTokenStart = resetsBudgetWindow ? resolveEntryFreshTotalTokens(entry) : void 0;
	const next = {
		...accounted,
		status: options.status,
		updatedAt: now,
		...options.note ? { lastStatusNote: options.note } : {},
		...options.status === "paused" ? { pausedAt: now } : {},
		...options.status === "blocked" ? { blockedAt: now } : {},
		...options.status === "complete" ? { completedAt: accounted.completedAt ?? now } : {}
	};
	if (resetsBudgetWindow) {
		next.tokenStart = freshTokenStart ?? 0;
		next.tokenStartFresh = freshTokenStart !== void 0;
		next.tokensUsed = 0;
		delete next.budgetLimitedAt;
		delete next.usageLimitedAt;
	}
	if (next.status === "active" && next.tokenBudget !== void 0 && next.tokensUsed >= next.tokenBudget) {
		next.status = "budget_limited";
		next.budgetLimitedAt = now;
	}
	return next;
}
function buildUpdatedSessionGoalObjective(entry, objective, now) {
	if (!objective.trim()) throw new SessionGoalTransitionError("objective required");
	const accounted = accountSessionGoalUsage(entry, now);
	if (!accounted) throw new SessionGoalTransitionError("goal not found");
	if (accounted.status === "complete") throw new SessionGoalTransitionError(`goal is already ${accounted.status}`);
	return {
		...accounted,
		objective,
		updatedAt: now
	};
}
//#endregion
//#region src/config/sessions/goals-operations.ts
const validateReceipt = /* @__PURE__ */ lazyCompile(SessionsGoalMutationResultSchema);
const OPERATION_VALIDITY_MS = 864e5;
const OPERATION_FUTURE_SKEW_MS = 3e5;
const MAX_SESSION_RECEIPTS = 4096;
var SessionGoalOperationError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "SessionGoalOperationError";
	}
};
function assertOperationTime(operation, now) {
	if (!Number.isSafeInteger(operation.issuedAtMs) || operation.issuedAtMs > now + OPERATION_FUTURE_SKEW_MS) throw new SessionGoalOperationError("invalid", "Goal operation time is invalid; refresh and try again.");
	if (operation.issuedAtMs + OPERATION_VALIDITY_MS <= now) throw new SessionGoalOperationError("expired", "Goal operation expired; review the current Goal before trying again.");
}
function operationFingerprint(operation) {
	return createHash("sha256").update(JSON.stringify([
		operation.issuedAtMs,
		operation.requestFingerprint,
		operation.action,
		"goalId" in operation ? operation.goalId : null,
		"objective" in operation ? operation.objective : null,
		"tokenBudget" in operation ? operation.tokenBudget : null,
		"note" in operation ? operation.note : null
	])).digest("hex");
}
/** Read a durable receipt before transient chat dedupe or busy checks, without creating tables. */
function lookupSessionGoalOperation(options) {
	assertOperationTime(options.operation, Date.now());
	const resolved = resolveSqliteScope(options);
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const { db } = database;
		if (!executeSqliteQueryTakeFirstSync(db, getSessionKysely(db).selectFrom("sqlite_schema").select("name").where("type", "=", "table").where("name", "=", "session_goal_operations"))) return;
		const receipt = readSessionGoalOperationReceipt(db, resolved.sessionKey, options.expectedSessionId, options.operation);
		if (receipt && readSessionEntryRow(database, resolved.sessionKey)?.entry.sessionId !== options.expectedSessionId) throw new SessionGoalOperationError("session-rebound", "Session changed after this Goal operation; refresh before trying again.");
		return receipt;
	}, toDatabaseOptions(resolved));
	return result.found ? result.value : void 0;
}
/** The caller has installed the schema before BEGIN; this read participates in its transaction. */
function readSessionGoalOperationReceipt(db, sessionKey, sessionId, operation) {
	assertOperationTime(operation, Date.now());
	const row = executeSqliteQueryTakeFirstSync(db, getSessionKysely(db).selectFrom(SESSION_GOAL_OPERATIONS_TABLE).selectAll().where("session_key", "=", sessionKey).where("operation_id", "=", operation.operationId));
	if (!row) return;
	if (row.request_fingerprint !== operationFingerprint(operation)) throw new SessionGoalOperationError("operation-conflict", "Goal operation ID was already used for a different request.");
	if (row.session_id !== sessionId) throw new SessionGoalOperationError("session-rebound", "Session changed after this Goal operation; refresh before trying again.");
	const result = safeParseJson(row.result_json);
	if (!validateReceipt(result) || result.operationId !== operation.operationId || result.action !== operation.action || result.sessionId !== sessionId || "goalId" in operation && result.goalId !== operation.goalId || result.goal !== void 0 && result.goal.id !== result.goalId) throw new SessionGoalOperationError("receipt-invalid", "Stored Goal operation receipt is invalid; inspect the session before retrying.");
	return result;
}
/** Apply the same policy used by text commands to the fresh row inside the commit section. */
function applySessionGoalOperation(entry, operation, now) {
	try {
		if (operation.action === "start") return buildCreatedSessionGoal(entry, operation, now);
		if (!entry.goal || entry.goal.id !== operation.goalId) throw new SessionGoalOperationError("goal-rebound", "Goal changed or was cleared; refresh before trying again.");
		if (operation.action === "clear") return;
		if (operation.action === "edit") return buildUpdatedSessionGoalObjective(entry, operation.objective, now);
		return buildUpdatedSessionGoalStatus(entry, {
			status: operation.action === "resume" ? "active" : operation.action === "pause" ? "paused" : operation.action === "block" ? "blocked" : "complete",
			note: operation.note
		}, now);
	} catch (error) {
		if (error instanceof SessionGoalTransitionError) throw new SessionGoalOperationError("invalid", error.message);
		throw error;
	}
}
/** Called only after every Goal/turn/lifecycle write succeeds, in that same transaction. */
function writeSessionGoalOperationReceipt(db, sessionKey, sessionId, operation, goal, runId) {
	const now = Date.now();
	assertOperationTime(operation, now);
	const kysely = getSessionKysely(db);
	executeSqliteQuerySync(db, kysely.deleteFrom(SESSION_GOAL_OPERATIONS_TABLE).where("expires_at", "<=", now));
	if ((executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_goal_operations").select(({ fn }) => fn.countAll().as("count")).where("session_key", "=", sessionKey))?.count ?? 0) >= MAX_SESSION_RECEIPTS) throw new SessionGoalOperationError("capacity", "Too many recent Goal operations; wait for older requests to expire before trying again.");
	const goalId = goal?.id ?? ("goalId" in operation ? operation.goalId : void 0);
	if (!goalId) throw new Error("Goal creation did not produce a Goal identity.");
	const result = {
		operationId: operation.operationId,
		action: operation.action,
		sessionId,
		goalId,
		status: runId ? "started" : operation.action === "clear" ? "cleared" : "updated",
		...goal ? { goal } : {},
		...runId ? { runId } : {}
	};
	executeSqliteQuerySync(db, kysely.insertInto(SESSION_GOAL_OPERATIONS_TABLE).values({
		session_key: sessionKey,
		operation_id: operation.operationId,
		session_id: sessionId,
		request_fingerprint: operationFingerprint(operation),
		result_json: JSON.stringify(result),
		expires_at: operation.issuedAtMs + OPERATION_VALIDITY_MS
	}));
	return result;
}
/** Management-only Goal actions do not enter chat or fabricate user turns. */
async function mutateSessionGoal(options) {
	const resolved = resolveSqliteScope(options);
	const databaseOptions = toDatabaseOptions(resolved);
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		ensureSessionGoalOperationsSchema(openOpenClawAgentDatabase(databaseOptions).db);
		const committed = runOpenClawAgentWriteTransaction((database) => {
			options.assertCurrent?.();
			const fresh = readSessionEntryRow(database, resolved.sessionKey);
			const replay = readSessionGoalOperationReceipt(database.db, resolved.sessionKey, options.expectedSessionId, options.operation);
			if (replay && fresh?.entry.sessionId === options.expectedSessionId) return {
				result: replay,
				replayed: true
			};
			if (!fresh || fresh.entry.sessionId !== options.expectedSessionId) throw new SessionGoalOperationError("session-rebound", "Session changed; refresh before changing its Goal.");
			const goal = applySessionGoalOperation(fresh.entry, options.operation, Date.now());
			const next = mergeSessionEntry(fresh.entry, { goal });
			writeSessionEntry(database, resolved.sessionKey, next, { canonicalPreviousEntry: fresh.entry });
			return {
				result: writeSessionGoalOperationReceipt(database.db, resolved.sessionKey, options.expectedSessionId, options.operation, goal),
				replayed: false,
				next
			};
		}, databaseOptions);
		return {
			result: committed.result,
			replayed: committed.replayed,
			sessionEntry: committed.next
		};
	}, "session.goal.mutate");
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
		restartRecoverySourceIngress: entry.restartRecoverySourceIngress,
		restartRecoverySourceReplyDeliveryMode: entry.restartRecoverySourceReplyDeliveryMode,
		restartRecoveryTerminalRunIds: entry.restartRecoveryTerminalRunIds,
		status: entry.status
	};
}
function sessionMatchesExpectedTranscriptTurn(selected, expected) {
	const expectedState = expected.expectedSessionState;
	return Boolean(selected && selected.entry.sessionId === expected.expectedSessionId && (expected.expectedLifecycleRevision === void 0 || selected.entry.lifecycleRevision === (expected.expectedLifecycleRevision ?? void 0)) && (expected.expectedWriterRunId === void 0 || selected.entry.activeWriterRunId === expected.expectedWriterRunId) && (expectedState === void 0 || selected.entry.abortedLastRun === expectedState.abortedLastRun && selected.entry.mainRestartRecovery?.cycleId === expectedState.mainRestartRecoveryCycleId && selected.entry.mainRestartRecovery?.revision === expectedState.mainRestartRecoveryRevision && selected.entry.restartRecoveryBeforeAgentReplyState === expectedState.restartRecoveryBeforeAgentReplyState && selected.entry.restartRecoveryDeliveryReceiptState === expectedState.restartRecoveryDeliveryReceiptState && selected.entry.restartRecoveryDeliveryToolCallId === expectedState.restartRecoveryDeliveryToolCallId && selected.entry.restartRecoveryDeliveryRequestFingerprint === expectedState.restartRecoveryDeliveryRequestFingerprint && selected.entry.restartRecoveryDeliveryRunId === expectedState.restartRecoveryDeliveryRunId && selected.entry.restartRecoveryDeliverySourceRunId === expectedState.restartRecoveryDeliverySourceRunId && selected.entry.restartRecoveryRequesterAccountId === expectedState.restartRecoveryRequesterAccountId && selected.entry.restartRecoveryRequesterSenderId === expectedState.restartRecoveryRequesterSenderId && selected.entry.restartRecoverySameChannelThreadRequired === expectedState.restartRecoverySameChannelThreadRequired && selected.entry.restartRecoverySourceIngress === expectedState.restartRecoverySourceIngress && selected.entry.restartRecoverySourceReplyDeliveryMode === expectedState.restartRecoverySourceReplyDeliveryMode && sameRestartRecoveryTerminalRunIds(selected.entry.restartRecoveryTerminalRunIds, expectedState.restartRecoveryTerminalRunIds) && selected.entry.status === expectedState.status));
}
function buildExpectedTranscriptTurnSessionPatch(params) {
	const appendedCount = params.appendedMessages.filter((message) => message.appended).length;
	const acceptedMessage = appendedCount > 0 || params.expectedSessionState !== void 0 && params.appendedMessages.some((message) => !message.appended);
	const touchUpdatedAt = params.touchSessionEntry === true && appendedCount > 0 ? Date.now() : 0;
	const restartRecoveryTerminalRunIds = params.sessionLifecyclePatch?.restartRecoveryTerminalRunIds ? mergeRestartRecoveryTerminalRunIds(params.currentEntry.restartRecoveryTerminalRunIds, params.sessionLifecyclePatch.restartRecoveryTerminalRunIds) : void 0;
	return {
		...acceptedMessage ? params.sessionLifecyclePatch : void 0,
		...acceptedMessage && restartRecoveryTerminalRunIds ? { restartRecoveryTerminalRunIds } : {},
		...touchUpdatedAt > 0 ? { updatedAt: Math.max(params.currentEntry.updatedAt ?? 0, params.sessionLifecyclePatch?.updatedAt ?? 0, touchUpdatedAt) } : {}
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-turn.ts
/** Appends a guarded transcript turn and touches its session row in one queued write. */
async function appendExpectedSessionTranscriptTurn(scope, options) {
	const initialEntry = options.initialSessionEntry ? cloneSessionEntry(options.initialSessionEntry) : void 0;
	if (initialEntry && (initialEntry.sessionId !== options.expectedSessionId || options.expectedLifecycleRevision !== void 0 || options.expectedWriterRunId !== void 0 || options.expectedSessionState !== void 0)) throw new Error("Session initialization requires its new identity and no existing writer state.");
	const resolveExpectedEntry = (selected) => {
		if (initialEntry) return selected ? void 0 : initialEntry;
		return sessionMatchesExpectedTranscriptTurn(selected, options) ? selected.entry : void 0;
	};
	const resolved = resolveSqliteTranscriptScope({
		...scope,
		sessionId: options.expectedSessionId
	});
	const { restoreSessionColdTranscript } = await import("./session-cold-storage-CqarxOH9.mjs");
	await restoreSessionColdTranscript({
		...scope,
		sessionId: options.expectedSessionId
	});
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		const mutation = options.sessionTurnMutation;
		mutation?.assertCurrent?.();
		const preparedDatabase = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		if (mutation) ensureSessionGoalOperationsSchema(preparedDatabase.db);
		const preparedEntry = readSessionEntryRow(preparedDatabase, resolved.sessionKey);
		const preparedReplay = mutation ? readSessionGoalOperationReceipt(preparedDatabase.db, resolved.sessionKey, options.expectedSessionId, mutation.operation) : void 0;
		if (preparedReplay) {
			if (preparedEntry?.entry.sessionId !== options.expectedSessionId) return sqliteSessionTranscriptTurnRebound(preparedEntry, options.sessionFile);
			return {
				appendedMessages: [],
				sessionEntry: preparedEntry.entry,
				sessionFile: options.sessionFile,
				sessionTurnMutationResult: {
					result: preparedReplay,
					replayed: true
				}
			};
		}
		if (!resolveExpectedEntry(preparedEntry)) return sqliteSessionTranscriptTurnRebound(preparedEntry, options.sessionFile);
		const messages = await selectAppendableSqliteTranscriptTurnMessages({
			agentId: resolved.agentId,
			sessionId: options.expectedSessionId,
			sessionKey: resolved.sessionKey,
			...scope.storePath ? { storePath: scope.storePath } : {}
		}, options.messages);
		let result = sqliteSessionTranscriptTurnRebound(preparedEntry, options.sessionFile);
		runSqliteSessionDeletionTransaction((transactionDb) => {
			mutation?.assertCurrent?.();
			const fresh = readSessionEntryRow(transactionDb, resolved.sessionKey);
			const replay = mutation ? readSessionGoalOperationReceipt(transactionDb.db, resolved.sessionKey, options.expectedSessionId, mutation.operation) : void 0;
			if (replay) {
				if (fresh?.entry.sessionId !== options.expectedSessionId) {
					result = sqliteSessionTranscriptTurnRebound(fresh, options.sessionFile);
					return;
				}
				result = {
					appendedMessages: [],
					sessionEntry: fresh.entry,
					sessionFile: options.sessionFile,
					sessionTurnMutationResult: {
						result: replay,
						replayed: true
					}
				};
				return;
			}
			const currentEntry = resolveExpectedEntry(fresh);
			if (!currentEntry) {
				result = sqliteSessionTranscriptTurnRebound(fresh, options.sessionFile);
				return;
			}
			const goal = mutation ? applySessionGoalOperation(currentEntry, mutation.operation, Date.now()) : void 0;
			const appendedMessages = [];
			for (const append of messages) {
				const { shouldAppend: _shouldAppend, shouldAppendInTransaction, ...appendOptions } = append;
				if (shouldAppendInTransaction) {
					const latestAssistant = findTranscriptEventInDatabase(transactionDb, resolved.sessionId, (event) => readTranscriptEventMessage(event)?.role === "assistant");
					if (!shouldAppendInTransaction(latestAssistant ? readTranscriptEventMessage(latestAssistant.event) : void 0)) continue;
				}
				let message = appendOptions.message;
				if (mutation && goal && isRecord(message) && message.role === "user") message = {
					...message,
					__openclaw: {
						...isRecord(message["__openclaw"]) ? message["__openclaw"] : {},
						intent: {
							kind: mutation.operation.action === "start" ? "session-goal-start" : "session-goal-resume",
							version: 1,
							goalId: goal.id,
							operationId: mutation.operation.operationId
						}
					}
				};
				const appended = appendTranscriptMessageInTransaction(transactionDb, resolved, {
					...appendOptions,
					message,
					messageAlreadyRedacted: options.atomicGroup === true,
					...append.cwd ?? options.cwd ? { cwd: append.cwd ?? options.cwd } : {},
					...append.config ?? options.config ? { config: append.config ?? options.config } : {}
				});
				if (appended) appendedMessages.push(appended);
			}
			if (options.atomicGroup && (appendedMessages.length !== messages.length || appendedMessages.some((message) => message.appended) !== appendedMessages.every((message) => message.appended))) throw new Error("SQLite transcript batch was not wholly inserted or replayed");
			if ((mutation || initialEntry) && (appendedMessages.length === 0 || appendedMessages.length !== messages.length || appendedMessages.some((message) => !message.appended))) throw new Error(mutation ? "Goal admission requires a new transcript turn in the same transaction." : "Session initialization requires a new transcript turn in the same transaction.");
			rememberCommittedTranscriptMessageSequencesInTransaction(transactionDb, resolved.sessionId, appendedMessages);
			const appended = readSessionEntryRow(transactionDb, resolved.sessionKey);
			const appendedEntry = appended?.entry ?? currentEntry;
			const sessionPatch = buildExpectedTranscriptTurnSessionPatch({
				appendedMessages,
				currentEntry: appendedEntry,
				expectedSessionState: options.expectedSessionState,
				sessionFile: options.sessionFile,
				sessionLifecyclePatch: options.sessionLifecyclePatch,
				touchSessionEntry: options.touchSessionEntry
			});
			if (mutation) sessionPatch.goal = goal;
			const next = Object.keys(sessionPatch).length > 0 ? mergeSessionEntry(appendedEntry, sessionPatch) : appendedEntry;
			let publishIdentity;
			if (initialEntry || next !== appendedEntry) {
				const identityKeys = collectSessionEntryLookupKeys(transactionDb, resolved.sessionKey);
				const previousIdentity = readSessionIdentitySnapshot(transactionDb, identityKeys.filter((key) => key !== resolved.sessionKey));
				if (appended) previousIdentity.set(resolved.sessionKey, appended.entry);
				writeSessionEntry(transactionDb, resolved.sessionKey, next, { canonicalPreviousEntry: previousIdentity.get(resolved.sessionKey) ?? null });
				const currentIdentity = readSessionIdentitySnapshot(transactionDb, identityKeys);
				publishIdentity = prepareSessionIdentityPublication(transactionDb, resolved.agentId, previousIdentity, currentIdentity);
			}
			result = {
				sessionTurnMutationResult: mutation ? {
					result: writeSessionGoalOperationReceipt(transactionDb.db, resolved.sessionKey, options.expectedSessionId, mutation.operation, goal, mutation.runId),
					replayed: false
				} : void 0,
				appendedMessages,
				sessionEntry: cloneSessionEntry(next),
				sessionFile: options.sessionFile
			};
			return publishIdentity;
		}, toDatabaseOptions(resolved))?.();
		for (const message of result.appendedMessages) options.onMessageCommitted?.(message);
		return result;
	}, "session.transcript.turn");
}
function sqliteSessionTranscriptTurnRebound(selected, sessionFile) {
	return {
		appendedMessages: [],
		rejectedReason: "session-rebound",
		sessionEntry: selected?.entry,
		sessionFile
	};
}
async function selectAppendableSqliteTranscriptTurnMessages(context, messages) {
	const selected = [];
	for (const append of messages) if (append.shouldAppend ? await append.shouldAppend(context) : true) selected.push(append);
	return selected;
}
//#endregion
//#region src/config/sessions/session-accessor.transcript-turn.ts
function resolveTranscriptTurnAgentId(params) {
	if (classifySessionKeyShape(params.sessionKey) === "malformed_agent") throw new Error("Malformed agent session key; refusing transcript turn persistence.");
	const scopedAgentId = params.scopeAgentId?.trim() ? normalizeAgentId(params.scopeAgentId.trim()) : void 0;
	const parsedAgentId = parseAgentSessionKey(params.sessionKey)?.agentId;
	const keyAgentId = parsedAgentId ? normalizeAgentId(parsedAgentId) : void 0;
	if (scopedAgentId && keyAgentId && scopedAgentId !== keyAgentId) throw new Error(`Session key owner "${keyAgentId}" does not match requested agent "${scopedAgentId}".`);
	const persistedStoreOwner = params.sessionStore && !params.storePath ? { kind: "none" } : resolvePersistedSessionStoreOwnerForTarget({
		config: params.config,
		sessionKey: params.sessionKey,
		storePath: params.storePath,
		env: params.env
	});
	if (scopedAgentId && persistedStoreOwner.kind === "configured" && scopedAgentId !== persistedStoreOwner.agentId) throw new AgentSelectionRequiredError(listAgentIds(params.config), {
		surface: "transcript turn persistence",
		hint: `The shared fixed-store row belongs to agent "${persistedStoreOwner.agentId}", not agent "${scopedAgentId}".`
	});
	if (persistedStoreOwner.kind === "retired") throw new AgentSelectionRequiredError(listAgentIds(params.config), {
		surface: "transcript turn persistence",
		hint: `The shared fixed-store row belongs to retired agent "${persistedStoreOwner.agentId}".`
	});
	const agentId = keyAgentId ?? (persistedStoreOwner.kind === "configured" ? persistedStoreOwner.agentId : void 0) ?? scopedAgentId ?? tryResolveLegacyCompatibilityAgentId(params.config);
	if (agentId) return normalizeAgentId(agentId);
	throw new AgentSelectionRequiredError(listAgentIds(params.config), {
		surface: "transcript turn persistence",
		hint: "Pass an agentId or use an agent-qualified session key."
	});
}
/** Appends one prepared ordered group in the existing transcript turn transaction. */
async function appendTranscriptMessages(scope, options) {
	if (options.messages.length === 0) return [];
	const expectedSessionId = scope.sessionId?.trim();
	if (!expectedSessionId) throw new Error("Cannot append a transcript batch without an exact session id");
	const turn = await persistExpectedSessionTranscriptTurn(scope, {
		atomicGroup: true,
		config: options.config,
		cwd: options.cwd,
		expectedSessionId,
		messages: options.messages.map((append) => ({
			...append,
			eventId: append.eventId ?? randomUUID(),
			message: redactTranscriptMessageForStorage(append.message, options),
			now: append.now ?? Date.now()
		})),
		updateMode: "none"
	});
	if (turn.rejectedReason) throw new Error("Transcript session changed before batch append");
	return turn.messages;
}
/**
* Persists one logical transcript turn through the SQLite-backed session target.
* Transcript row append(s) and the requested
* updatedAt touch happen before transcript update delivery is published.
*/
async function persistSessionTranscriptTurn(scope, options) {
	const expectedSessionId = options.expectedSessionId;
	if (expectedSessionId) return await persistExpectedSessionTranscriptTurn(scope, {
		...options,
		expectedSessionId
	});
	if (options.sessionLifecyclePatch || options.sessionTurnMutation || options.initialSessionEntry) throw new Error("Cannot mutate a session turn without an expected session id");
	const target = await resolveTranscriptTurnTarget(scope, options.config);
	if (target.entryFromPersistedStore && target.storePath && target.sessionKey && target.sessionEntry && target.sessionId) return await persistExpectedSessionTranscriptTurn({
		...scope,
		...target
	}, {
		...options,
		expectedSessionId: target.sessionId
	});
	const appendedMessages = await runWithOwnedSessionTranscriptWrite({
		sessionFile: target.sessionKey,
		sessionKey: target.sessionKey,
		sessionTarget: target
	}, () => appendTranscriptTurnMessages(target, options));
	const appendedCount = countAppendedTranscriptMessages(appendedMessages);
	const sessionEntry = await touchTranscriptTurnSessionEntry({
		scope,
		target,
		shouldTouch: options.touchSessionEntry === true && appendedCount > 0
	});
	await publishTranscriptTurnUpdate({
		target,
		sessionEntry,
		updateMode: options.updateMode ?? "inline",
		publishWhen: options.publishWhen ?? "when-appended",
		appendedMessages,
		runId: options.runId
	});
	return {
		appendedCount,
		messages: appendedMessages,
		sessionEntry
	};
}
async function appendTranscriptTurnMessages(target, options) {
	const selectedMessages = await selectAppendableTranscriptTurnMessages(target, options);
	const appendedMessages = [];
	for (const append of selectedMessages) {
		const { shouldAppend: _shouldAppend, ...appendOptions } = append;
		const result = await appendTranscriptMessage({
			...target.agentId ? { agentId: target.agentId } : {},
			...target.env ? { env: target.env } : {},
			...target.sessionId ? { sessionId: target.sessionId } : {},
			...target.sessionKey ? { sessionKey: target.sessionKey } : {},
			...target.storePath ? { storePath: target.storePath } : {}
		}, {
			...appendOptions,
			message: attachSessionTranscriptRunId(appendOptions.message, options.runId),
			...append.cwd ?? options.cwd ? { cwd: append.cwd ?? options.cwd } : {},
			...append.config ?? options.config ? { config: append.config ?? options.config } : {}
		});
		if (result) {
			options.onMessageCommitted?.(result);
			appendedMessages.push(result);
		}
	}
	rememberCommittedTranscriptMessageSequences(target, appendedMessages);
	return appendedMessages;
}
async function selectAppendableTranscriptTurnMessages(target, options) {
	const selectedMessages = [];
	for (const append of options.messages) {
		if (!(append.shouldAppend ? await append.shouldAppend({
			...target.agentId ? { agentId: target.agentId } : {},
			...target.sessionId ? { sessionId: target.sessionId } : {},
			...target.sessionKey ? { sessionKey: target.sessionKey } : {},
			...target.storePath ? { storePath: target.storePath } : {}
		}) : true)) continue;
		selectedMessages.push(append);
	}
	return selectedMessages;
}
function countAppendedTranscriptMessages(messages) {
	return messages.filter((message) => message.appended).length;
}
async function persistExpectedSessionTranscriptTurn(scope, options) {
	const requestedSessionKey = scope.sessionKey?.trim();
	const expectedSessionId = options.expectedSessionId;
	const preparedTarget = await prepareTranscriptTurnTarget({
		...scope,
		sessionId: expectedSessionId
	}, options.config);
	const resolved = scope.sessionStore ? resolveSessionStoreEntryCore({
		store: scope.sessionStore,
		sessionKey: preparedTarget.sessionKey
	}) : resolveSessionEntrySelection(preparedTarget);
	const target = {
		...preparedTarget,
		sessionKey: resolved.normalizedKey
	};
	const inheritedWriterFence = getOwnedSessionTranscriptWriterFence({
		sessionFile: target.sessionKey,
		sessionKey: target.sessionKey,
		sessionTarget: target
	});
	const turn = await runWithOwnedSessionTranscriptWrite({
		sessionFile: target.sessionKey,
		sessionKey: target.sessionKey,
		sessionTarget: target
	}, () => appendExpectedSessionTranscriptTurn(target, {
		config: options.config,
		cwd: options.cwd,
		expectedLifecycleRevision: options.expectedLifecycleRevision !== void 0 ? options.expectedLifecycleRevision : inheritedWriterFence?.expectedLifecycleRevision,
		expectedWriterRunId: options.expectedWriterRunId ?? inheritedWriterFence?.expectedWriterRunId,
		expectedSessionState: options.expectedSessionState,
		expectedSessionId,
		initialSessionEntry: options.initialSessionEntry,
		atomicGroup: options.atomicGroup,
		messages: options.messages.map((append) => ({
			...append,
			message: attachSessionTranscriptRunId(append.message, options.runId)
		})),
		onMessageCommitted: options.onMessageCommitted,
		sessionLifecyclePatch: options.sessionLifecyclePatch,
		sessionTurnMutation: options.sessionTurnMutation,
		sessionFile: target.sessionKey,
		touchSessionEntry: options.touchSessionEntry
	}));
	if (turn.rejectedReason === "session-rebound") return {
		appendedCount: 0,
		messages: [],
		rejectedReason: "session-rebound",
		sessionEntry: turn.sessionEntry
	};
	await publishTranscriptTurnUpdate({
		target: requestedSessionKey === target.sessionKey ? target : {
			...target,
			sessionKey: requestedSessionKey
		},
		sessionEntry: turn.sessionEntry,
		updateMode: options.updateMode ?? "inline",
		publishWhen: options.publishWhen ?? "when-appended",
		appendedMessages: turn.appendedMessages,
		runId: options.runId
	});
	if (turn.sessionEntry && scope.sessionStore) scope.sessionStore[resolved.normalizedKey] = turn.sessionEntry;
	return {
		sessionTurnMutationResult: turn.sessionTurnMutationResult,
		appendedCount: countAppendedTranscriptMessages(turn.appendedMessages),
		messages: turn.appendedMessages,
		sessionEntry: turn.sessionEntry ?? scope.sessionEntry
	};
}
async function prepareTranscriptTurnTarget(scope, config) {
	const sessionKey = scope.sessionKey?.trim();
	if (!sessionKey || !scope.sessionId) throw new Error("Cannot persist a transcript turn without a session key and session id");
	const effectiveConfig = config ?? getRuntimeConfig();
	const agentId = resolveTranscriptTurnAgentId({
		config: effectiveConfig,
		scopeAgentId: scope.agentId,
		sessionKey,
		storePath: scope.storePath,
		sessionStore: scope.sessionStore,
		env: scope.env
	});
	const storePath = scope.storePath ?? resolveSessionStorePathCore(effectiveConfig.session?.store, {
		agentId,
		env: scope.env
	});
	const binding = captureSessionTranscriptTargetBinding({
		agentId,
		...scope.env ? { env: scope.env } : {},
		sessionId: scope.sessionId,
		sessionKey,
		storePath
	});
	return {
		...await resolveSessionTranscriptRuntimeTarget(binding),
		storePath: binding.storePath,
		env: binding.env
	};
}
async function resolveTranscriptTurnTarget(scope, config) {
	const target = await prepareTranscriptTurnTarget(scope, config);
	const resolved = scope.sessionStore ? resolveSessionStoreEntryCore({
		store: scope.sessionStore,
		sessionKey: target.sessionKey
	}) : void 0;
	const persistedEntry = loadSessionEntryReadOnly({
		...scope,
		...target
	});
	const sessionEntry = persistedEntry ?? resolved?.existing ?? scope.sessionEntry;
	return {
		...target,
		sessionEntry,
		entryFromPersistedStore: persistedEntry != null
	};
}
async function touchTranscriptTurnSessionEntry(params) {
	if (!params.shouldTouch || !params.target.storePath || !params.target.sessionKey || !params.target.sessionId) return params.target.sessionEntry;
	const updatedAt = Date.now();
	const updated = await updateSessionEntry({
		sessionKey: params.target.sessionKey,
		storePath: params.target.storePath,
		...params.target.agentId ? { agentId: params.target.agentId } : {},
		...params.target.env ? { env: params.target.env } : {}
	}, (current) => current.sessionId === params.target.sessionId ? { updatedAt: Math.max(current.updatedAt ?? 0, updatedAt) } : null, { skipMaintenance: true });
	if (updated && params.scope.sessionStore) params.scope.sessionStore[params.target.sessionKey] = updated;
	return updated ?? params.target.sessionEntry;
}
async function publishTranscriptTurnUpdate(params) {
	if (params.updateMode === "none") return;
	const appendedMessages = params.appendedMessages.filter((message) => message.appended);
	if (params.publishWhen === "when-appended" && appendedMessages.length === 0) return;
	const target = params.target.agentId && params.target.sessionId && params.target.sessionKey ? {
		agentId: params.target.agentId,
		sessionId: params.target.sessionId,
		sessionKey: params.target.sessionKey,
		...params.target.storePath ? { storePath: params.target.storePath } : {}
	} : void 0;
	const update = {
		...params.target.sessionKey ? { sessionKey: params.target.sessionKey } : {},
		...params.target.agentId ? { agentId: params.target.agentId } : {},
		...target ? { target } : {},
		...params.sessionEntry?.lifecycleRevision ? { lifecycleRevision: params.sessionEntry.lifecycleRevision } : {}
	};
	if (params.updateMode !== "inline" || appendedMessages.length === 0) {
		emitSessionTranscriptUpdate(update);
		return;
	}
	const sequencedMessages = appendedMessages.map((message) => ({
		message,
		messageSeq: readCommittedTranscriptMessageSequence(message)
	}));
	if (sequencedMessages.length > 1 && sequencedMessages.some(({ messageSeq }) => messageSeq === void 0)) {
		emitSessionTranscriptUpdate(update);
		return;
	}
	for (const { message, messageSeq } of sequencedMessages) {
		const runId = resolveTerminalAssistantTranscriptRunId(message.message, params.runId);
		emitSessionTranscriptUpdate({
			...update,
			message: message.message,
			messageId: message.messageId,
			...messageSeq !== void 0 ? { messageSeq } : {},
			...runId ? { runId } : {}
		});
	}
}
//#endregion
//#region src/config/sessions/session-accessor.transcript-range.ts
function anchorsShareTarget(boundary) {
	const { admission, terminal } = boundary;
	return admission.agentId === terminal.agentId && admission.sessionId === terminal.sessionId && admission.sessionKey === terminal.sessionKey && admission.storePath === terminal.storePath && admission.generation === terminal.generation;
}
function validateAnchorRow(anchor, row) {
	return Boolean(row && row.generation === anchor.generation && row.seq === anchor.rawSeq && row.parent_id === anchor.effectiveParentId && row.message_position === anchor.activeMessagePosition);
}
function validateTerminalAncestry(params) {
	if (params.terminalEntryId === params.admissionEntryId) return "descendant";
	if (!(params.maxDepth > 0)) return "too-large";
	if (params.terminalParentId === params.admissionEntryId) return "descendant";
	if (params.terminalParentId === null || params.terminalParentId === params.terminalEntryId) return "non-descendant";
	const db = getSessionKysely(params.database);
	const depthLimit = Math.ceil(params.maxDepth);
	const admissionIsSqlText = toUSVString(params.admissionEntryId) === params.admissionEntryId;
	const terminalIsSqlText = toUSVString(params.terminalEntryId) === params.terminalEntryId;
	const ancestry = executeSqliteQueryTakeFirstSync(params.database, db.withRecursive("turn_ancestors", (query) => query.selectFrom("transcript_event_identities").select(["event_id", "parent_id"]).where("session_id", "=", params.sessionId).where("event_id", "=", params.terminalParentId).union(query.selectFrom("transcript_event_identities as identity").innerJoin("turn_ancestors as previous", "identity.event_id", "previous.parent_id").select(["identity.event_id", "identity.parent_id"]).where("identity.session_id", "=", params.sessionId).$if(admissionIsSqlText, (ancestors) => ancestors.where("previous.parent_id", "!=", params.admissionEntryId)).$if(terminalIsSqlText, (ancestors) => ancestors.where("identity.event_id", "!=", params.terminalEntryId))).limit(Number.isSafeInteger(depthLimit) ? depthLimit : -1)).selectFrom("turn_ancestors").select((eb) => [eb.fn.countAll().as("depth"), eb.fn.max(eb.case().when(eb.and([eb.val(admissionIsSqlText ? 1 : 0), eb("parent_id", "=", params.admissionEntryId)])).then(1).else(0).end()).as("found")]));
	if (ancestry.depth >= depthLimit) return "too-large";
	return ancestry.found === 1 ? "descendant" : "non-descendant";
}
/** Reads one bounded accepted transcript range from a single SQLite snapshot. */
function readClosedTranscriptTurn(params) {
	if (!anchorsShareTarget(params.boundary)) return { kind: "session-rebound" };
	const target = params.boundary.admission;
	const resolved = resolveSqliteTranscriptScope({
		agentId: target.agentId,
		sessionId: target.sessionId,
		sessionKey: target.sessionKey,
		storePath: target.storePath
	});
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return runSqliteDeferredTransactionSync(database.db, () => {
		const db = getSessionKysely(database.db);
		if (!executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select(["session_id"]).where("session_id", "=", target.sessionId).where("session_key", "=", target.sessionKey).limit(1))) return { kind: "session-rebound" };
		const frontier = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select("seq").where("session_id", "=", target.sessionId).orderBy("seq", "desc").limit(1))?.seq;
		const projection = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_transcript_index_state").select(["indexed_seq", "needs_rebuild"]).where("session_id", "=", target.sessionId));
		if (frontier === void 0 || !projection || projection.needs_rebuild !== 0 || projection.indexed_seq !== frontier) return { kind: "projection-unavailable" };
		const readAnchor = (anchor) => executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).innerJoin("transcript_rewrite_watermarks as rewrite", (join) => join.onRef("rewrite.session_id", "=", "identity.session_id")).innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "identity.session_id").onRef("event.seq", "=", "identity.seq")).select([
			"identity.seq",
			"identity.parent_id",
			"active.message_position",
			"rewrite.generation",
			transcriptEventNavigationSql("event").as("event_json")
		]).where("identity.session_id", "=", target.sessionId).where("identity.event_id", "=", anchor.entryId).limit(1));
		const admissionRow = readAnchor(params.boundary.admission);
		const terminalRow = readAnchor(params.boundary.terminal);
		if (!validateAnchorRow(params.boundary.admission, admissionRow) || !validateAnchorRow(params.boundary.terminal, terminalRow)) return { kind: "stale" };
		const admissionEvent = JSON.parse(admissionRow.event_json);
		if (admissionEvent.type !== "message" || admissionEvent.message?.role !== "user") return { kind: "stale" };
		const ancestry = validateTerminalAncestry({
			database: database.db,
			sessionId: target.sessionId,
			admissionEntryId: params.boundary.admission.entryId,
			terminalEntryId: params.boundary.terminal.entryId,
			terminalParentId: terminalRow.parent_id,
			maxDepth: params.maxEvents
		});
		if (ancestry !== "descendant") return { kind: ancestry };
		const selected = db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).where("active.session_id", "=", target.sessionId).where("active.message_position", "is not", null).where("active.message_position", ">=", params.boundary.admission.activeMessagePosition).where("active.message_position", "<=", params.boundary.terminal.activeMessagePosition).orderBy("active.message_position", "asc");
		try {
			assertSqliteJsonlReadBudget(database.db, selected.clearOrderBy().select(["event.event_json", "event.event_utf8_bytes"]).as("events"), params.maxBytes, "Closed transcript turn", {
				hasExactUtf8Bytes: true,
				separatorBytes: 0,
				maxRows: params.maxEvents
			});
		} catch (error) {
			if (error instanceof SqliteJsonlReadBudgetExceededError) return { kind: "too-large" };
			throw error;
		}
		return {
			kind: "ok",
			messages: executeSqliteQuerySync(database.db, selected.select(transcriptEventJsonSql(database.db, "event").as("event_json"))).rows.flatMap((row) => {
				const event = JSON.parse(row.event_json);
				return event.type === "message" && event.message ? [event.message] : [];
			})
		};
	}, {
		databaseLabel: database.path,
		operationLabel: "session transcript accepted turn read"
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-watermark.ts
/** Read hot generation and retained cold position on the caller's admitted snapshot. */
function readSessionTranscriptWatermarkInDatabase(database, sessionId) {
	const watermark = readSessionTranscriptHotWatermark(database, sessionId);
	const cold = readSessionColdTranscript(database.db, sessionId);
	return {
		...watermark,
		maxSeq: cold?.last_seq ?? watermark.maxSeq
	};
}
/** Reads the append and rewrite tokens that validate transcript-derived caches. */
function readSessionTranscriptWatermark(scope) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => readSessionTranscriptWatermarkInDatabase(database, resolved.sessionId), {
		databaseLabel: database.path,
		operationLabel: "session transcript watermark read"
	}), toDatabaseOptions(resolved));
	return result.found ? result.value : {
		generation: null,
		maxSeq: null
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-reports.ts
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
function readReportBranch(database, sessionId) {
	function rows() {
		return iterateSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select((eb) => [
			"seq",
			"event_json",
			eb.fn("json_extract", [eb.ref("navigation_json"), eb.val("$.report")]).as("report_json")
		]).where("session_id", "=", sessionId).orderBy("seq", "asc"));
	}
	function compressedFacts(reportJson) {
		const facts = reportJson === null ? void 0 : decodeSessionTranscriptReportFacts(JSON.parse(reportJson));
		if (!facts) throw new Error("Invalid compressed transcript report facts");
		return facts;
	}
	let hasRows = false;
	const header = findSessionTranscriptHeader((function* () {
		for (const row of rows()) {
			hasRows = true;
			if (row.event_json !== null) yield JSON.parse(row.event_json);
			else compressedFacts(row.report_json);
		}
	})());
	if (hasRows) assertCurrentSessionTranscriptHeader(header);
	return new TranscriptReportNavigation((function* () {
		for (const row of rows()) yield {
			seq: row.seq,
			facts: row.event_json === null ? compressedFacts(row.report_json) : projectSessionTranscriptReportFacts(JSON.parse(row.event_json))
		};
	})()).facts();
}
function latestCustomReport(database, sessionId, branch, customTypes) {
	for (const entry of branch.path.toReversed()) {
		if (entry.type !== "custom_message" || entry.customType === void 0 || !customTypes.includes(entry.customType)) continue;
		const row = executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select(transcriptEventJsonSql(database.db).as("event_json")).where("session_id", "=", sessionId).where("seq", "=", entry.seq));
		const record = row ? JSON.parse(row.event_json) : void 0;
		if (isRecord(record)) return {
			customType: entry.customType,
			content: record.content,
			details: record.details
		};
	}
}
async function withCurrentTranscript(scope, run) {
	const fenced = withOwnedSessionTranscriptWriterFence(scope);
	const resolved = resolveSqliteTranscriptScope(fenced);
	return runExclusiveSqliteSessionWrite(resolved, async () => runOpenClawAgentWriteTransaction((database) => {
		assertOwnedTranscriptWriteCommit(fenced);
		const refusal = resolveTranscriptAppendRefusal(readSessionEntryRow(database, resolved.sessionKey)?.entry, resolved, fenced);
		if (refusal) {
			if (fenced.expectedWriterRunId !== void 0) throw new SessionTranscriptWriterClaimReboundError(refusal);
			return err(refusal);
		}
		const result = run(database, resolved);
		assertOwnedTranscriptWriteCommit(fenced);
		const rebound = resolveTranscriptAppendRefusal(readSessionEntryRow(database, resolved.sessionKey)?.entry, resolved, fenced);
		if (rebound) throw new SessionTranscriptWriterClaimReboundError(rebound);
		return ok(result);
	}, toDatabaseOptions(resolved), { operationLabel: "session.transcript.report" }), "session.transcript.report");
}
/** Reads the latest matching custom report from the active branch in one snapshot. */
async function readLatestSessionTranscriptReport(scope, customTypes) {
	return withCurrentTranscript(scope, (database, resolved) => latestCustomReport(database, resolved.sessionId, readReportBranch(database, resolved.sessionId), customTypes));
}
/** Selects and appends one report atomically; Gateway policy only sees report facts. */
async function appendSessionTranscriptReport(scope, report) {
	return withCurrentTranscript(scope, (database, resolved) => {
		const branch = readReportBranch(database, resolved.sessionId);
		if (report.kind === "assistant") {
			if (branch.path.some((entry) => entry.assistantResponseId === report.message.responseId)) return;
			appendTranscriptMessageInTransaction(database, resolved, {
				message: applyAssistantDeliveryDirectives(report.message),
				parentId: branch.appendParentId
			});
			return;
		}
		if (report.suppressWhenAssistantRun !== void 0 && branch.path.some((entry) => entry.assistantRunId === report.suppressWhenAssistantRun)) return;
		const selected = report.selectReport(latestCustomReport(database, resolved.sessionId, branch, report.customTypes));
		if (!selected) return;
		ensureTranscriptHeader(database, resolved, void 0);
		if (!appendTranscriptEventInTransaction(database, resolved, {
			type: "custom_message",
			...selected,
			id: randomUUID(),
			parentId: branch.appendParentId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		})) throw new Error("Session transcript report was not appended");
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-participant-read.ts
function listSessionParticipantsReadOnly(scope) {
	const resolved = resolveSqliteReadScope(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => participantRecordsBySessionKey(database.db, scope.sessionKey ? [scope.sessionKey] : void 0), toDatabaseOptions(resolved));
	return result.found ? result.value : /* @__PURE__ */ new Map();
}
//#endregion
//#region src/config/sessions/session-entry-read-runtime.ts
/** Keep every discovered database and original admission alive through one synchronous consumer. */
async function withSessionEntriesFromStoresInWorker(inputs, consume) {
	const reads = [];
	const enter = (index) => {
		const input = inputs[index];
		if (input) return withSessionEntriesFromStoreInWorker(input, async (read) => {
			reads.push(read);
			try {
				return await enter(index + 1);
			} finally {
				reads.pop();
			}
		});
		for (const read of reads) read.assertCurrent();
		let active = true;
		try {
			const result = consume(reads.map((read) => ({
				result: read.result,
				database: read.database,
				assertCurrent: () => {
					if (!active) throw new Error("Session entry read consumer is no longer active");
					read.assertCurrent();
				}
			})));
			if (isPromiseLike(result)) {
				Promise.resolve(result).catch(() => {});
				throw new Error("Session entry read consumers must remain synchronous");
			}
			return Promise.resolve(result);
		} finally {
			active = false;
		}
	};
	return enter(0);
}
/** The ordinary return API returns data, never a retained authority claim. */
function readSessionEntriesFromStoreInWorker(input) {
	return withSessionEntriesFromStoresInWorker([input], ([read]) => read.result);
}
async function withSessionEntriesFromStoreInWorker(input, consume) {
	const env = cloneEnvWithPlatformSemantics(input.env ?? process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const agentId = normalizeAgentId(input.agentId);
	const storePath = input.storePath;
	const read = {
		env,
		sessionKeys: [...new Set(input.sessionKeys)],
		lifecycleSessionKey: input.lifecycleSessionKey,
		projection: input.projection,
		includeMembers: input.includeMembers,
		includeAuthorization: input.includeAuthorization
	};
	const target = resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath);
	const captured = captureSessionStoreReadCandidate(target.path);
	const direct = target.agentId && captured.path === captured.physicalPath;
	const candidates = direct ? [captured] : captureSessionStoreReadCandidates(storePath);
	const native = input.projection === "backing" ? retainOpenClawAgentDatabaseReadCandidates(candidates.flatMap((candidate) => [candidate, {
		...candidate,
		path: candidate.physicalPath
	}]), env) : void 0;
	const continuations = [];
	try {
		for (const database of native?.databases ?? []) {
			const owner = captureCanonicalSessionReaderContinuation(database);
			if (owner) continuations.push({
				path: captureSessionStoreReadCandidate(database.path).physicalPath,
				owner
			});
		}
		const readDatabase = async (database, assertRoute) => {
			const continuation = continuations.find((item) => item.path === database.path)?.owner;
			return withSessionHistoryWorkerDatabase({
				...database,
				env
			}, async (owner) => {
				const result = await owner.readExactEntries({
					...read,
					continuation: continuation?.receipt
				});
				let active = true;
				const assertCurrent = () => {
					if (!active) throw new Error("Session entry read consumer is no longer active");
					owner.assertCurrent();
					continuation?.assertCurrent();
					assertRoute();
				};
				try {
					assertCurrent();
					return await consume({
						result,
						database: {
							...database,
							env
						},
						assertCurrent
					});
				} finally {
					active = false;
				}
			});
		};
		if (direct && target.agentId) {
			resolveSqliteAgentId({
				scopedAgentId: agentId,
				storeAgentId: target.agentId
			});
			return await readDatabase({
				agentId: target.agentId,
				path: captured.physicalPath
			}, () => assertSessionStoreReadCandidate(target.path, [captured]));
		}
		const registryRead = prepareOpenClawAgentDatabaseRegistrySnapshotRead({ env });
		return await withSessionHistoryWorkerReadCandidates(candidates, async (discovery) => {
			const request = {
				agentId,
				storePath,
				env,
				candidates
			};
			let resolved = await discovery.readStoreTarget({
				...request,
				registeredDatabases: { status: "deferred" }
			});
			let assertRegistryCurrent;
			if (resolved.kind === "session-target-registry-required") {
				const registry = await registryRead.read();
				assertRegistryCurrent = registry.assertCurrent;
				registry.assertCurrent();
				discovery.assertCurrent();
				resolved = await discovery.readStoreTarget({
					...request,
					registeredDatabases: registry.result.status === "available" ? registry.result.entries : { status: "unavailable" }
				});
				if (resolved.kind === "session-target-registry-required") throw new Error("Session store target requested registry rows twice");
			}
			assertRegistryCurrent?.();
			discovery.assertCurrent();
			const selected = resolved;
			return await readDatabase(selected.database, () => {
				assertRegistryCurrent?.();
				discovery.assertCurrent();
				assertSessionStoreReadCandidate(selected.sourcePath, candidates);
			});
		});
	} finally {
		for (const { owner } of continuations.toReversed()) owner.release();
		native?.release();
	}
}
//#endregion
//#region src/config/sessions/session-backing-facts.ts
/** Preserve listing admission and malformed-row handling while selecting only requested keys. */
function readSessionBackingFacts(scope) {
	if (scope.sessionKeys.length === 0) return [];
	const options = toDatabaseOptions(resolveSqliteScope({
		...scope,
		sessionKey: ""
	}));
	const result = withOpenClawAgentDatabaseReadOnly((database) => readSessionBackingFactsInDatabase(database, scope.sessionKeys), options);
	if (result.found) return result.value;
	if (result.reason !== "database-missing") throw new SessionMetadataUnavailableError(result.reason);
	return [];
}
function readSessionBackingFactsInDatabase(database, sessionKeys, continuation) {
	return readWithCanonicalSessionReaderContinuation(database, continuation, () => {
		assertCanonicalSqliteSessionKeysCurrent(database);
		const keys = new Set(sessionKeys);
		const query = selectSessionEntryRows(database, "list").select("updated_at");
		const pending = getNodeSqliteKysely(database.db).selectFrom("session_canonical_validation_pending").select("session_key");
		const rows = executeSqliteQuerySync(database.db, hasCanonicalSessionValidationProjection(database) ? query.where("session_key", "in", pending.union(getNodeSqliteKysely(database.db).selectFrom("session_nodes").select("session_key").where("session_key", "in", sqliteStringSet(sessionKeys)))) : query).rows;
		const facts = [];
		for (const row of rows) {
			if (isInternalSessionEffectsKey(row.session_key)) continue;
			const entry = parseSessionEntryJson(row, "list");
			if (!entry) continue;
			validateDeliveryCanonicalSessionEntry(row.session_key, entry);
			if (!keys.has(row.session_key)) continue;
			facts.push({
				sessionKey: row.session_key,
				entry: {
					sessionId: entry.sessionId,
					updatedAt: entry.updatedAt,
					...entry.subagentRecovery ? { subagentRecovery: entry.subagentRecovery } : {}
				}
			});
		}
		return facts;
	});
}
//#endregion
//#region src/config/sessions/session-backing-facts-runtime.ts
/** A publication during a batch makes its prepared backing evidence unknown. */
async function readSessionBackingFactsInWorker(scopes) {
	const changedKeys = /* @__PURE__ */ new Set();
	let allChanged = false;
	const stop = sessionChanges.subscribe((change) => {
		if ("all" in change) allChanged = true;
		else changedKeys.add(change.sessionKey);
	});
	try {
		return (await Promise.all(scopes.map(async (scope) => {
			const agentId = resolveUnsuffixedSqliteTargetFromSessionStorePath(scope.storePath).agentId ?? parseAgentSessionKey(scope.sessionKeys[0] ?? "")?.agentId;
			if (!agentId) throw new Error("Cannot resolve backing session facts without an agent id");
			return (await readSessionEntriesFromStoreInWorker({
				...scope,
				agentId,
				projection: "backing"
			})).entries;
		}))).map((result, index) => allChanged || scopes[index].sessionKeys.some((key) => changedKeys.has(key)) ? void 0 : result);
	} finally {
		stop();
	}
}
//#endregion
export { readSessionPendingInput as $, readTranscriptRawDelta as A, scanDoctorSessionEntriesStrict as B, buildUpdatedSessionGoalStatus as C, rewriteTranscriptMessageAtAnchor as D, rewriteAssistantTranscriptMessageForRun as E, switchSessionBranch as F, runSessionCollaborationWrite as G, addSessionMemberInWorker as H, iterateDoctorSessionKeyBatches as I, recoverSessionEntryFromRestartTombstone as J, updateSessionProfileInvolvement as K, rewriteDoctorSessionEntries as L, requireTranscriptEventAppendSnapshot as M, forkSessionAtMessage as N, loadTranscriptSuffixEventsBoundedSync as O, rewindSessionToMessage as P, listSessionPendingInputs as Q, listCanonicalSessionRepairFacts as R, buildUpdatedSessionGoalObjective as S, trimSessionTranscriptForManualCompact as T, recordSessionParticipantInWorker as U, scanDoctorSessionEntriesTolerant as V, removeSessionMemberInWorker as W, claimSessionPendingInputDedupeRecovery as X, bindSessionPendingInputSources as Y, listSessionPendingInputReceipts as Z, lookupSessionGoalOperation as _, withSessionEntriesFromStoresInWorker as a, accountSessionGoalUsage as b, readLatestSessionTranscriptReport as c, readClosedTranscriptTurn as d, readSessionSubmittedInput as et, appendTranscriptMessages as f, SessionGoalOperationError as g, sessionMatchesExpectedTranscriptTurn as h, readSessionEntriesFromStoreInWorker as i, persistCompactionBoundaryWithSessionEntrySync as j, readPreviousIndexedTranscriptEventSync as k, readSessionTranscriptWatermark as l, buildRestartRecoveryExpectedState as m, readSessionBackingFacts as n, withSessionPendingInputPersistence as nt, listSessionParticipantsReadOnly as o, persistSessionTranscriptTurn as p, mergeSessionProfileInvolvement as q, readSessionBackingFactsInDatabase as r, normalizeMessageClientSources as rt, appendSessionTranscriptReport as s, readSessionBackingFactsInWorker as t, stageSessionPendingInput as tt, readSessionTranscriptWatermarkInDatabase as u, mutateSessionGoal as v, preflightSessionTranscriptForManualCompact as w, buildCreatedSessionGoal as x, SessionGoalTransitionError as y, loadCanonicalSessionRepairEntries as z };
