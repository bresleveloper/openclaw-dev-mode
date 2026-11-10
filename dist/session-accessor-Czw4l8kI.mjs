import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as extractErrorCode, i as collectNestedErrorCandidates } from "./error-coercion-BwMr25F8.mjs";
import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { s as trackAsyncWork } from "./async-work-scope-BH2yUdBz.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { f as readDatabasePathIdentitySync, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { j as readSqliteDatabaseWriteTokenForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { a as executeSqliteQueryTakeFirstSync, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { o as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { m as SessionPendingInputCustodyError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { c as SqliteWorkerError, u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { o as observeSqliteWorkerCommittedFacts } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { o as getRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { d as getAgentEventLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-Bf3Js0D3.mjs";
import { c as prepareSessionSourceAuthority, t as acceptSessionSourceValidation, u as releaseSessionSourceAuthorities } from "./session-source-authority-fdILH-PW.mjs";
import { M as parseAgentSessionKey, o as classifySessionKeyShape } from "./session-key-CSDERtm3.mjs";
import { E as tryResolveLegacyCompatibilityAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { c as normalizeGatewayClientMode, s as normalizeGatewayClientId } from "./client-info-BgcoFakQ.mjs";
import { i as SessionParticipantSchema } from "./session-participant-rDryrWG-.mjs";
import { n as hasSqliteCommitReceiptCoverage } from "./sqlite-commit-receipt-DafgyYOc.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { c as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { t as attachSessionEntrySnapshots } from "./session-entry-snapshot-values-CSxUX6LQ.mjs";
import { t as sessionEntrySnapshotColumns } from "./session-entry-snapshots-CwvH1YlE.mjs";
import { c as transcriptEventJsonSql } from "./transcript-payload-Cu49oQKq.mjs";
import { l as resolveTerminalAssistantTranscriptRunId, n as attachSessionTranscriptRunId, r as emitSessionTranscriptUpdate, s as readSessionTranscriptRunId } from "./transcript-events-D3brcRJS.mjs";
import { r as resolvePersistedSessionStoreOwnerForTarget } from "./session-store-owner-iJNKNMuJ.mjs";
import "./legacy.default-agent-owner-Blrs2q29.mjs";
import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-Ds5uC0Bf.mjs";
import "./io-DIF-KW3P.mjs";
import { n as captureSessionTranscriptTargetBinding, r as sameSessionTranscriptStorageEnvironment, t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { t as lazyCompile } from "./protocol-validator-BeXu4Ype.mjs";
import { M as buildRestartRecoveryExpectedState, h as selectManualCompactTranscriptLines } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { n as assertSessionEntryCurrentAdmission } from "./session-entry-current-admission-DvCCyjlG.mjs";
import { n as captureSessionStoreCandidateIdentities, t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { a as resolveSessionWorkStartError } from "./session-work-start-Sz_vqYld.mjs";
import { r as getCliHistoryWriter } from "./cli-history-boundary-B1eSXpAQ.mjs";
import { l as normalizeSessionDeliveryState } from "./delivery-context.shared-I8-iaaj1.mjs";
import { c as prepareUserProfileCatalog, f as readResidentUserProfileAliases } from "./user-profile-list-BdNJnrJe.mjs";
import { r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-B6hhdgLR.mjs";
import { a as normalizeStoreSessionKey, c as resolveSessionStoreEntryCore } from "./store-entry-CUxN9KZj.mjs";
import { i as toDatabaseOptions, r as resolveSqliteSessionKey, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import "./payload-limits-ChDi8AHf.mjs";
import { r as parseSessionPendingInputMessage, t as isFinalInputCompletion } from "./session-pending-input-value-CPY0B7Hg.mjs";
import { a as invalidateSessionEntryCaches, n as bindPreparedSessionEntryPublication, r as commitSessionSharingFieldChange, s as publishSessionEntryWorkerMetadataInvalidation } from "./session-accessor.sqlite-entry-cache-publication-BpzZnZxY.mjs";
import { h as recordCommittedSessionMetadataPublication } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { n as emitSessionLifecycleEvent } from "./session-lifecycle-events-76OxWRqj.mjs";
import { o as publishCommittedSessionIdentity } from "./session-accessor.sqlite-identity-2UHa91m7.mjs";
import { i as SessionWorkStartChangedError } from "./work-start-error-BI-UhSB2.mjs";
import { t as readMessageIdempotencyKey } from "./transcript-message-identity-0wQEn3Eb.mjs";
import { n as projectSqliteSessionOwner } from "./session-accessor.sqlite-owner-projection-BFkJufPp.mjs";
import { i as projectCanonicalSessionEntryShape } from "./store-entry-shape-sjH_uIYB.mjs";
import { n as parseSessionEntryJson } from "./session-accessor.sqlite-status-B58ALiNV.mjs";
import { p as scanCanonicalSqliteSessionEntries } from "./session-canonical-key-B7chVWi3.mjs";
import { n as captureSessionActorStorageOwner, o as runWithSessionActorStorage, r as getSessionActorStorageBinding, s as withSessionActorStorage, t as acquireSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import { a as prepareSqliteTranscriptReadScope, c as resolveSqliteWriteAdmissionScope, i as prepareSqliteScope, l as runExclusiveSqliteSessionWrite, n as captureLifecycleDatabaseScope, s as resolveSqliteTranscriptScope, t as assertSqliteTranscriptWriteIdentity, u as transcriptWriteScopeIsCurrent } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as assertSessionTranscriptHot, t as SessionTranscriptColdError } from "./session-cold-storage-state-CWFSrppd.mjs";
import { r as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-BkD5HoDI.mjs";
import "./session-entry-read-runtime-CgqUrGct.mjs";
import { a as waitForPreparedSessionTranscriptProjection, i as startSessionTranscriptIndexReconcile, u as prepareReconcileParams } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import { n as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-CcajP8TM.mjs";
import "./session-accessor.sqlite-entry-cache-BGcjBaH_.mjs";
import { p as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { n as retainSessionEntryWorkerPublication } from "./session-accessor.sqlite-entry-worker-publication-myyyu_fk.mjs";
import "./session-history-BKt1cI8X.mjs";
import { i as rethrowIncognitoSessionError, n as IncognitoSessionMissingError, r as IncognitoSessionSyncAccessError } from "./incognito-session-error-Dsi9IsoJ.mjs";
import { a as rewriteSqliteTranscriptEventRowsInTransaction, o as sanitizeTranscriptMessageForStorage } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { d as registerSessionPendingInputOwner, f as releaseSessionPendingInputOwner, h as runWithSessionPendingInputPersistence, m as runWithSessionPendingInput, n as assertSessionPendingInputLifetimeCurrent, o as hasRegisteredSessionPendingInputOwner, s as prepareCurrentSessionPendingInputDedupeRecovery, t as assertRegisteredSessionPendingInputOwner } from "./session-accessor.sqlite-pending-inputs-dFWJwbQM.mjs";
import "./session-accessor.sqlite-transcript-watermark-CfdOKFaq.mjs";
import { l as readTranscriptGenerationInTransaction } from "./session-accessor.sqlite-transcript-state-DCHgVh5P.mjs";
import { n as readRestoredSessionTranscriptInWorker, t as readRestoredSessionTranscript } from "./session-cold-storage-read-DxurMT4l.mjs";
import { C as readTranscriptIdentityByEventId, i as findTranscriptEventInDatabase } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { a as withSessionEntryWorker, o as settleSessionWorkerReceipt, r as prepareSessionEntryReplacementDatabase } from "./session-accessor.sqlite-replacement-worker-BpIicMPG.mjs";
import { l as throwSessionInputActorFailure, n as completeSessionTranscriptCommit, r as runSessionActorCommand, s as getSessionInputActor, t as appendExpectedSessionTranscriptTurn } from "./session-accessor.sqlite-transcript-turn-CoODj9qI.mjs";
import { t as withCurrentPendingInputAuthority } from "./session-pending-input-authority-CoXHTQsM.mjs";
import { r as captureSessionStoreReadTarget } from "./session-pending-input-history-DRfEA-VZ.mjs";
import { t as readSessionActorStorageResult } from "./session-actor-storage-result-BfP7PrnB.mjs";
import "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { i as readActiveTranscriptEntryAnchor } from "./session-accessor.sqlite-transcript-anchor-Dc-2VOHU.mjs";
import "./session-accessor.sqlite-model-context-BymThP-K.mjs";
import "./session-accessor.sqlite-owner-DmFmcL8Z.mjs";
import { c as getOwnedSessionTranscriptInitialWriter, h as withOwnedSessionTranscriptWriterFence, i as captureOwnedTranscriptWriteAssertion, o as captureSessionTranscriptSourcePublication, p as runWithOwnedSessionTranscriptWrite, t as assertOwnedTranscriptWriteCommit, u as getOwnedSessionTranscriptWriterFence } from "./transcript-write-context-C02sC3zd.mjs";
import { n as publishTranscriptUpdate } from "./session-accessor.sqlite-events-B20eyHIG.mjs";
import { n as runSessionEntryWorkerOperation } from "./session-entry-patch-CSunl6ZV.mjs";
import "./session-accessor.entry-BLpjjUTc.mjs";
import "./session-accessor.sqlite-entry-availability-U0xmd5-G.mjs";
import { l as updateSessionEntry } from "./session-accessor.entry-mutation-DgCGNicZ.mjs";
import { t as captureSessionActorTranscriptRead } from "./session-actor-transcript-read-Wje_m4fK.mjs";
import { t as withSessionTranscriptReadSource } from "./session-transcript-read-source-Bmo2UYck.mjs";
import "./session-transcript-events-BFcYGLfY.mjs";
import { i as readCachedSessionBranchSummaries, n as cloneSessionBranchSummaries, t as cacheSessionBranchSummaries } from "./session-accessor.sqlite-branches-BnZyeeO5.mjs";
import "./session-accessor.sqlite-message-cut-CcapwxKq.mjs";
import "./session-accessor.reset-D4vtFriK.mjs";
import { r as resolveTranscriptAppendRefusal } from "./session-accessor.sqlite-transcript-write-guard-C3zmfbiJ.mjs";
import { n as prepareTranscriptMessageAppend } from "./session-accessor.sqlite-transcript-message-append-DFcvBgrv.mjs";
import { n as readCommittedTranscriptMessageSequence, r as rememberCommittedTranscriptMessageSequences } from "./session-accessor.sqlite-transcript-sequences-B5FCjqGn.mjs";
import { r as appendTranscriptMessage } from "./session-accessor.sqlite-transcript-write-B1_nzUQQ.mjs";
import { r as trimTranscriptForManualCompact } from "./session-accessor.sqlite-compaction-CBe1uF_o.mjs";
import { t as executeSessionMessageRewriteOperation } from "./session-message-rewrite-domain-D1FyYmve.mjs";
import { i as withSessionManagerMemoryActor, t as captureSessionManagerIncognitoBinding } from "./session-manager-incognito-scope-DBz3K1lk.mjs";
import { i as receiveSessionManagerCommit, t as SessionEntryCommittedError } from "./session-manager-persistence-error-uXrnbG-q.mjs";
import { t as createSessionManagerMemoryDatabase } from "./session-manager-memory-BF9nTnKe.mjs";
import "./session-accessor.sqlite-delta-BKEQDw-z.mjs";
import { o as resolveSessionTranscriptRuntimeTarget } from "./session-accessor.transcript-target-DDngfM5X.mjs";
import "./session-accessor.sqlite-metadata-read-DgoOP6m6.mjs";
import "./session-accessor.sqlite-transcript-stats-read-VFRrZZmv.mjs";
import "./session-transcript-match-CM2tniQA.mjs";
import "./session-accessor.sqlite-active-events-CqOkO0QM.mjs";
import { t as applyAssistantDeliveryDirectives } from "./transcript-assistant-delivery-CHjQRvEC.mjs";
import { r as prepareCustomTranscriptReport } from "./session-accessor.sqlite-transcript-reports.kernel-CQPjJU2G.mjs";
import "./session-accessor.sqlite-participant-read-BB88Lmot.mjs";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import { isMainThread } from "node:worker_threads";
import { isDeepStrictEqual, toUSVString } from "node:util";
//#region src/config/sessions/session-transcript-projection-recovery.ts
/** Rebuilds a newly admitted session on its prepared physical store, then waits there. */
async function recoverSessionTranscriptProjection(scope, abortSignal, assertCurrent) {
	abortSignal.throwIfAborted();
	if (captureSessionActorStorageOwner(scope, {
		assertCurrent,
		authorize() {}
	})) return;
	const resolved = await prepareSqliteTranscriptReadScope(scope, abortSignal);
	assertCurrent();
	abortSignal.throwIfAborted();
	const prepared = prepareReconcileParams({
		...toDatabaseOptions(resolved),
		preferredSessionId: resolved.sessionId
	});
	startSessionTranscriptIndexReconcile(prepared);
	await waitForPreparedSessionTranscriptProjection(resolved.sessionId, prepared, abortSignal);
}
//#endregion
//#region src/config/sessions/session-pending-input-receipts.ts
/** Reconcile exact run receipts without reading pending input payloads on the Gateway. */
async function readSessionPendingInputReceiptsInWorker(scope, options) {
	if (options.runIds.length === 0) return [];
	const memory = captureSessionActorStorageOwner(scope, {
		assertCurrent() {},
		authorize() {}
	});
	if (memory) return await withSessionActorStorage(scope, {
		lifetime: {
			assertCurrent() {},
			assertReadable() {}
		},
		authority: memory.authority
	}, (binding) => binding.actor.storage.read({
		type: "session.pendingInput.receipts",
		input: {
			sessionKey: scope.sessionKey,
			sessionId: scope.sessionId,
			runIds: options.runIds
		}
	}, binding.authority)) ?? [];
	const captured = {
		...scope,
		...scope.storePath ? { storePath: path.resolve(scope.storePath) } : {},
		env: captureSessionTranscriptStorageEnvironment(scope.env ?? process.env)
	};
	const runIds = [...options.runIds];
	const context = captureOpenClawStateReadWorkerContext({ env: captured.env });
	const assertStateCurrent = () => {
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
	};
	const resolved = await prepareSqliteScope(captured);
	assertStateCurrent();
	const databaseOptions = toDatabaseOptions(resolved);
	return await withSessionHistoryWorkerDatabase({
		...databaseOptions,
		path: resolveOpenClawAgentSqlitePath(databaseOptions)
	}, async (owner) => {
		const receipts = await owner.readPendingInputReceipts({
			agentId: resolved.agentId,
			sessionKey: resolved.sessionKey,
			sessionId: captured.sessionId,
			runIds,
			env: captured.env
		});
		assertStateCurrent();
		return receipts;
	});
}
//#endregion
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
	return requestFingerprint ? `request:${requestFingerprint}` : sha256Hex(stableStringify(message));
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
	const { timestamp: _preparedTimestamp, ...stablePrepared } = sanitizeTranscriptMessageForStorage(prepared);
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
//#region src/config/sessions/session-pending-input-source.ts
async function readPendingInputSource(scope, idempotencyKey, pendingOnly) {
	const memory = captureSessionActorStorageOwner(scope, {
		assertCurrent() {},
		authorize() {}
	});
	if (memory) return withSessionActorStorage(scope, {
		lifetime: {
			assertCurrent() {},
			assertReadable() {}
		},
		authority: memory.authority
	}, async (binding) => {
		const snapshot = await binding.actor.storage.read({
			type: "session.pendingInput.read",
			input: {
				kind: "source",
				sessionKey: binding.actor.target.sessionKey,
				sessionId: scope.sessionId,
				idempotencyKey,
				pendingOnly
			}
		}, binding.authority);
		if (snapshot.kind !== "source") throw new Error("Submitted input returned a different operation");
		const entry = binding.actor.snapshot(binding.authority)?.entry;
		return {
			path: binding.path,
			snapshot,
			assertCurrent() {
				const current = memory.binding?.actor.target.sessionKey === binding.actor.target.sessionKey ? memory.binding.actor.snapshot(memory.authority) : memory.owner?.readSession(binding.actor.target.sessionKey, memory.authority);
				if (!current?.entry || current.entry.sessionId !== entry?.sessionId || current.entry.lifecycleRevision !== entry?.lifecycleRevision) throw new Error("Submitted input session was closed or replaced");
			}
		};
	});
	const captured = {
		...scope,
		env: captureSessionTranscriptStorageEnvironment(scope.env ?? process.env)
	};
	const input = {
		kind: "source",
		sessionKey: resolveSqliteScope({
			...captured,
			storePath: void 0
		}).sessionKey,
		sessionId: captured.sessionId,
		idempotencyKey,
		pendingOnly
	};
	const target = captureSessionStoreReadTarget(captured, "Submitted input changed its captured database owner");
	const resolved = await prepareSqliteScope(captured);
	const { options, identity, source, assertCurrent } = target.resolve(resolved);
	if (!identity.key.startsWith("file:")) return;
	assertCurrent();
	const snapshot = await withSessionHistoryWorkerDatabase(options, (owner) => owner.readPendingInputSource({
		input: {
			...input,
			sessionKey: resolved.sessionKey
		},
		env: captured.env,
		source
	}));
	assertCurrent();
	return {
		path: identity.canonicalPath,
		snapshot,
		assertCurrent
	};
}
//#endregion
//#region src/config/sessions/session-pending-input-memory-store.ts
/** Handle-local drainage; pending input and completion state stay in the actor. */
function prepareMemoryPendingInputStore(binding, assertCurrent, releaseActor) {
	const storage = binding.actor.storage;
	const pending = /* @__PURE__ */ new Set();
	const failures = [];
	let active = true;
	let actorRelease;
	const releaseOwner = () => actorRelease ??= releaseActor?.() ?? Promise.resolve();
	let revokeCustody = () => {};
	const assertOpen = () => {
		if (!active) throw new Error("Pending input actor handle has closed");
		try {
			binding.actor.assertCurrent();
		} catch (error) {
			active = false;
			revokeCustody();
			throw error;
		}
	};
	const track = (operation) => {
		pending.add(operation);
		operation.then(() => pending.delete(operation), (error) => {
			failures.push(error);
			pending.delete(operation);
		});
		return operation;
	};
	const settled = async () => {
		while (pending.size) await Promise.allSettled(pending);
		if (failures.length) throw failures[0];
	};
	const authority = {
		...binding.authority,
		assertCurrent() {
			assertOpen();
			binding.authority.assertCurrent();
			assertCurrent();
		}
	};
	return {
		sessionActor: binding,
		assertCurrent: assertOpen,
		withAdmission(operation, _reentrant) {
			assertOpen();
			return operation();
		},
		sessionKey: binding.actor.target.sessionKey,
		databaseAgentId: binding.agentId,
		path: binding.path,
		workerDatabasePath: binding.path,
		bindCustody(revoke) {
			revokeCustody = revoke;
		},
		settled,
		retire(operation) {
			track((async () => {
				try {
					await operation;
				} finally {
					await releaseOwner();
				}
			})());
		},
		async release() {
			try {
				await settled();
			} finally {
				active = false;
				await releaseOwner();
			}
		},
		read(input) {
			return track(storage.read({
				type: "session.pendingInput.read",
				input
			}, authority));
		},
		nativeMutation() {
			throw new IncognitoSessionSyncAccessError("complete", "completeAsync");
		},
		mutate(input, guard, publish) {
			return track((async () => {
				let committedFacts;
				const outcome = await storage.mutate({
					type: "session.pendingInput.mutate",
					input
				}, {
					...authority,
					authorize(stage, hot, publication) {
						binding.authority.authorize(stage, hot, publication);
						if (isRecord(publication) && publication.kind === "pending-input-settlement-custody") {
							committedFacts = publication;
							guard(stage, committedFacts);
						}
					}
				}, { committed: () => publish?.(committedFacts, assertOpen) });
				return readSessionActorStorageResult(outcome);
			})());
		}
	};
}
//#endregion
//#region src/config/sessions/session-pending-input-operations.types.ts
/** Only the paired kernel's receipt for this exact accepted input may settle its custody. */
function readPendingInputMutationReceipt(facts, input) {
	if (!isRecord(facts) || facts.kind !== "pending-input-settlement" || facts.operation !== input.kind || facts.sessionKey !== input.sessionKey || facts.sessionId !== input.sessionId || facts.idempotencyKey !== input.idempotencyKey || facts.runId !== input.runId || facts.requestHash !== input.requestHash || facts.lifecycleGeneration !== input.lifecycleGeneration) return;
	return facts;
}
//#endregion
//#region src/config/sessions/session-pending-input-store.ts
async function preparePendingInputStore(scope, assertCurrent) {
	if (captureSessionActorStorageOwner(scope, {
		assertCurrent,
		authorize: assertCurrent
	})) {
		const acquired = await acquireSessionActorStorage(scope, {
			lifetime: {
				assertCurrent,
				assertReadable: assertCurrent
			},
			authority: {
				assertCurrent,
				authorize: assertCurrent
			}
		});
		if (!acquired) throw new Error("Pending input session was closed or removed");
		return prepareMemoryPendingInputStore(acquired, assertCurrent, () => acquired.actor.release());
	}
	const captured = {
		...scope,
		env: captureSessionTranscriptStorageEnvironment(scope.env ?? process.env)
	};
	const inputActor = await getSessionInputActor(scope);
	const logical = resolveSqliteScope({
		...captured,
		storePath: void 0
	});
	const target = captureSessionStoreReadTarget(captured, "Pending input changed its captured database owner");
	const inputSource = inputActor?.target.readSource;
	const resolved = inputSource ? resolveSqliteScope(captured, void 0, {
		agentId: inputSource.agentId,
		path: inputSource.path,
		shared: inputSource.agentId !== logical.agentId
	}) : await prepareSqliteScope(captured);
	assertCurrent();
	const options = {
		...toDatabaseOptions(resolved),
		path: resolveOpenClawAgentSqlitePath(toDatabaseOptions(resolved))
	};
	if (inputActor && (inputActor.target.readSource?.path !== options.path || inputActor.target.readSource.agentId !== options.agentId)) throw new Error("Input actor changed the pending input's physical target");
	const readTarget = target.resolve(resolved);
	const identity = readTarget.identity;
	if (!identity.key.startsWith("file:")) throw new Error("Pending input changed its captured database owner");
	const assertSource = readTarget.assertCurrent;
	const { mutatePendingInput } = await import("./session-pending-input-operations.kernel-DHG2vGAD.mjs");
	assertSource();
	let revoked = false;
	let revokeCustody = () => {};
	const pending = /* @__PURE__ */ new Set();
	const failures = [];
	const drain = async () => {
		while (pending.size) await Promise.allSettled(pending);
	};
	const settled = async () => {
		await drain();
		if (failures.length) throw failures[0];
	};
	const unregister = registerOpenClawAgentDatabaseAsyncResource({
		agentId: options.agentId ?? resolved.agentId,
		path: options.path,
		revoke() {
			revoked = true;
			revokeCustody();
		},
		close: drain
	});
	const assertOpen = () => {
		if (revoked) throw new Error("Pending input database owner has closed");
		assertSource();
	};
	const track = (operation) => {
		pending.add(operation);
		operation.then(() => pending.delete(operation), (error) => {
			failures.push(error);
			pending.delete(operation);
		});
		return operation;
	};
	const nativeMutation = (input, guard) => {
		assertOpen();
		return mutatePendingInput(input, {
			admit: (stage, facts) => {
				assertOpen();
				guard(stage, facts);
			},
			writeTransaction: (operationLabel, _owner, run) => runOpenClawAgentWriteTransaction(run, options, { operationLabel })
		}, () => {});
	};
	return {
		sessionActor: void 0,
		assertCurrent: assertOpen,
		async withAdmission(operation, reentrant) {
			let entered = false;
			const run = () => runOpenClawAgentWriteAdmission(options, () => {
				entered = true;
				return operation();
			}, reentrant);
			try {
				return await run();
			} catch (error) {
				if (!entered) unregister();
				throw error;
			}
		},
		sessionKey: resolved.sessionKey,
		databaseAgentId: options.agentId ?? resolved.agentId,
		path: options.path,
		workerDatabasePath: identity?.canonicalPath ?? options.path,
		bindCustody(revoke) {
			revokeCustody = revoke;
		},
		settled,
		retire(operation) {
			track(operation);
			operation.then(unregister, (error) => {
				if (!hasSqliteWorkerOutcomeUnknown(error)) unregister();
			});
		},
		async release() {
			try {
				await settled();
			} finally {
				unregister();
			}
		},
		read(input) {
			return track((async () => {
				assertOpen();
				assertCurrent();
				return withSessionEntryWorker(options, identity?.key.slice(5), () => {
					assertOpen();
					assertCurrent();
				}, async (execution, source) => {
					const result = await execution.runExisting(source, (worker) => worker.execute({
						type: "session.pendingInputs.read",
						input
					}));
					if (!result) throw new Error("Pending input lost its existing database");
					return result;
				});
			})());
		},
		nativeMutation,
		mutate(input, guard, publish) {
			return track((async () => {
				assertOpen();
				if (inputActor && input.kind === "stage") {
					let committedFacts;
					let authorityFailure;
					const authority = {
						assertCurrent: assertOpen,
						authorize(stage, _hot, publication) {
							try {
								if (isRecord(publication) && publication.kind === "pending-input-settlement-custody") {
									committedFacts = publication;
									guard(stage, committedFacts);
								}
								assertOpen();
							} catch (error) {
								authorityFailure = error;
								throw error;
							}
						}
					};
					let expectedState;
					let receipt;
					const outcome = await runSessionActorCommand(inputActor.actor, authority, async (snapshot) => {
						const hot = snapshot ?? await inputActor.actor.read(authority);
						if (!hot.entry) throw new Error("Input actor lost its staged session");
						expectedState ??= buildRestartRecoveryExpectedState(hot.entry);
						return inputActor.actor.acceptInput({
							commandId: randomUUID(),
							phaseId: `accept:${input.runId}`,
							expected: hot.version,
							pending: input,
							lifecycle: {},
							expectedState
						}, authority, { committed(commit) {
							receipt = readPendingInputMutationReceipt(commit.value.pendingInputReceipt, input);
							if (!receipt) throw new Error("Input actor omitted its committed custody receipt");
							publish?.(committedFacts, assertOpen);
						} });
					});
					if (outcome.kind !== "committed") throwSessionInputActorFailure(outcome, authorityFailure);
					if (outcome.failure && outcome.failure.origin !== "response") throw Object.assign(new Error(outcome.failure.message), { name: outcome.failure.name });
					if (!receipt) throw new Error("Input actor omitted its native completion receipt");
					return receipt;
				}
				let admitted;
				const readReceipt = (facts) => readPendingInputMutationReceipt(facts, input);
				let committedFacts;
				const checkGrant = (stage, facts) => {
					if (!isRecord(facts) || !isRecord(facts.publication) || facts.publication.kind !== "pending-input-settlement-custody") return;
					committedFacts = facts.publication;
					guard(stage, committedFacts);
				};
				return withSessionEntryWorker(options, identity?.key.slice(5), assertOpen, async (execution, source) => {
					const result = await execution.runExisting(source, async (worker) => {
						const receipt = await settleSessionWorkerReceipt(() => worker.execute({
							type: "session.pendingInputs.mutate",
							input
						}), () => admitted, readReceipt, "Pending input has no confirmed native completion and commit receipt", "Pending input native commitment is unknown; do not replay");
						if (publish) {
							assertOpen();
							publish(committedFacts, assertOpen);
						}
						return receipt;
					});
					if (!result) throw new Error("Pending input lost its existing database");
					return result;
				}, (admission, retained, facts) => {
					checkGrant("commit", facts);
					if (!isRecord(facts) || !isRecord(facts.publication) || !readReceipt(facts.publication.receipt)) throw new Error("Pending input commit omitted its exact receipt");
					admitted = {
						admission,
						retained
					};
				}, void 0, void 0, void 0, (facts) => checkGrant("transaction", facts));
			})());
		}
	};
}
//#endregion
//#region src/config/sessions/session-accessor.pending-inputs.ts
const receiptOwners = /* @__PURE__ */ new WeakMap();
const withdrawnOwners = /* @__PURE__ */ new WeakSet();
function readWithdrawnSessionPendingInputId(receipt) {
	const owner = receipt && receiptOwners.get(receipt);
	return owner && withdrawnOwners.has(owner) ? owner.inputId : void 0;
}
function ownerReceipt(owner) {
	const receipt = {
		get state() {
			return owner.consumed || owner.sources?.every((source) => source.consumed) ? "consumed" : "queued";
		},
		inputId: owner.inputId,
		message: parseSessionPendingInputMessage(owner.messageJson),
		run: (operation) => runWithSessionPendingInput(owner, operation),
		runAsync: (operation) => runWithSessionPendingInputPersistence(owner, () => withCurrentPendingInputAuthority((owner.sources ?? [owner]).flatMap((source) => source.authority ? [source.authority] : []), () => assertSessionPendingInputLifetimeCurrent(owner), () => runWithSessionPendingInput(owner, operation))),
		assertLifetimeCurrent: () => assertSessionPendingInputLifetimeCurrent(owner),
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
	if (!idempotencyKey || sources.some((source) => source.workerDatabasePath !== first.workerDatabasePath || source.sessionId !== first.sessionId || source.sessionKey !== first.sessionKey || source.idempotencyKey === idempotencyKey)) throw new Error("Collected input requires one exact session and a distinct aggregate identity");
	const clients = normalizeMessageClientSources(receipts.flatMap((receipt) => readMessageClientSources(receipt.message)));
	const collectedMessage = { ...message };
	if (clients.length) collectedMessage["__openclaw"] = {
		...message["__openclaw"],
		transport: {
			...asOptionalRecord(message["__openclaw"]?.transport),
			clients
		}
	};
	const messageJson = JSON.stringify(sanitizeTranscriptMessageForStorage(collectedMessage));
	if (Buffer.byteLength(messageJson, "utf8") > 26214400) throw new Error("Collected input exceeds the Gateway payload limit");
	const aggregateInputId = randomUUID();
	const aggregate = ownerReceipt({
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
	aggregate.settled = async () => {
		const failures = (await Promise.allSettled(receipts.map(async (receipt) => receipt.settled?.()))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (failures.length === 1) throw failures[0];
		if (failures.length) throw new AggregateError(failures, "Failed to settle collected input custody");
	};
	return aggregate;
}
/** Accept durable input without changing the active transcript or scheduling execution. */
function stageSessionPendingInput(scope, options) {
	const captured = {
		...scope,
		env: captureSessionTranscriptStorageEnvironment(scope.env ?? process.env)
	};
	const preparedRequest = preparePendingInputRequest(options);
	const lifecycleGeneration = getAgentEventLifecycleGeneration();
	if (captureSessionActorStorageOwner(scope, {
		assertCurrent: options.assertCurrent,
		authorize: options.assertCurrent
	})) return preparePendingInputStore(captured, options.authority?.assertLifetimeCurrent ?? options.assertCurrent).then((store) => {
		const binding = store.sessionActor;
		if (!binding) throw new Error("Incognito pending input omitted its actor");
		return runWithSessionActorStorage(binding, () => stagePreparedPendingInput({
			...captured,
			sessionActor: binding
		}, options, preparedRequest, lifecycleGeneration, store));
	});
	return getSessionInputActor(captured).then((inputActor) => {
		const admission = inputActor ? void 0 : resolveSqliteWriteAdmissionScope(captured);
		const stage = async () => {
			const store = await preparePendingInputStore(captured, options.authority?.assertLifetimeCurrent ?? options.assertCurrent);
			const accept = () => stagePreparedPendingInput(captured, options, preparedRequest, lifecycleGeneration, store);
			return inputActor ? accept() : store.withAdmission(accept, admission !== void 0);
		};
		return admission ? runOpenClawAgentWriteAdmission(toDatabaseOptions(admission), stage) : stage();
	});
}
async function stagePreparedPendingInput(scope, options, preparedRequest, lifecycleGeneration, store) {
	let retained = false;
	let finished = false;
	let owner;
	let completion;
	const assertPrepared = (facts, guard, assertSourceCurrent = store.assertCurrent) => {
		if (options.authority) {
			if (!facts?.authority) throw new Error("Pending input grant omitted its current session authority");
			return options.authority.withPreparedCurrent(facts.authority, guard, assertSourceCurrent);
		}
		return guard();
	};
	const assertCurrent = () => options.authority ? options.authority.withCurrent(() => options.assertCurrent()) : options.assertCurrent();
	try {
		const identity = {
			sessionKey: store.sessionKey,
			sessionId: scope.sessionId,
			idempotencyKey: preparedRequest.idempotencyKey
		};
		const snapshot = await store.read({
			...identity,
			kind: "stage",
			trackCompletion: options.trackCompletion === true
		});
		if (snapshot.kind !== "stage") throw new Error("Pending input read returned a different operation");
		await assertCurrent();
		assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
		if (!snapshot.current) return;
		const { existing, previous, committed } = snapshot;
		const replayRequest = resolvePendingInputReplayRequest(preparedRequest, previous ?? existing);
		const { message, stableMessage } = replayRequest;
		let requestHash = replayRequest.requestHash;
		if (previous && (previous.request_hash !== requestHash || previous.run_id !== options.runId)) throw new Error("Input completion idempotency key conflicts with the accepted input");
		if (previous && isFinalInputCompletion(previous.outcome)) return {
			state: "consumed",
			inputId: identity.idempotencyKey,
			message,
			completion: previous.outcome,
			run: () => {
				throw new Error("Input processing has already completed");
			},
			finish: () => {}
		};
		const assertUnowned = (row = existing) => {
			if (row && hasRegisteredSessionPendingInputOwner(store.workerDatabasePath, row)) throw new SessionPendingInputCustodyError("Pending input is already admitted; wait for its current turn");
		};
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
			assertUnowned();
			if (!options.requestFingerprint && !options.trackCompletion || existing.state !== "queued" && existing.state !== "interrupted" || existing.lifecycle_generation === lifecycleGeneration && !options.trackCompletion) throw new Error("Pending input ownership ended; submit a new turn to continue");
		}
		const settlementIdentity = () => ({
			...identity,
			runId: options.runId,
			requestHash,
			lifecycleGeneration,
			...options.authority ? { authorityAgentId: scope.agentId } : {}
		});
		const assertCompletion = () => {
			(options.assertCompletionCurrent ?? options.assertCurrent)();
			assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
			if (owner) assertRegisteredSessionPendingInputOwner(owner);
		};
		const completionInput = (outcome) => ({
			...settlementIdentity(),
			kind: "complete",
			outcome
		});
		const complete = options.trackCompletion ? (outcome) => {
			if (finished || completion) throw new Error("Input completion owner has already been released or is settling");
			assertCompletion();
			return store.nativeMutation(completionInput(outcome), assertCompletion).outcome;
		} : void 0;
		const completeAsync = options.trackCompletion ? (outcome) => {
			if (completion) return completion;
			if (finished) return Promise.reject(/* @__PURE__ */ new Error("Input completion owner has already been released"));
			(options.authority?.assertLifetimeCurrent ?? assertCompletion)();
			completion = store.mutate(completionInput(outcome), (_stage, facts) => assertPrepared(facts, assertCompletion)).then((receipt) => {
				if (!receipt.outcome) throw new Error("Input completion omitted its committed outcome");
				return receipt.outcome;
			});
			return completion;
		} : void 0;
		const finish = (disposition) => {
			if (finished) return;
			finished = true;
			if (owner) owner.settling = true;
			const settleDisposition = async () => {
				if (owner && !owner.consumed) {
					if ((await store.mutate({
						...settlementIdentity(),
						kind: "finish",
						inputId: owner.inputId,
						disposition
					}, () => assertRegisteredSessionPendingInputOwner(owner))).withdrawnInputId === owner.inputId) withdrawnOwners.add(owner);
				}
			};
			const ending = completion ? completion.catch((error) => {
				rethrowIncognitoSessionError(error);
				if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
			}).then(settleDisposition) : settleDisposition();
			store.retire(ending.then(() => {
				if (owner) releaseSessionPendingInputOwner(owner);
			}, (error) => {
				if (owner && !hasSqliteWorkerOutcomeUnknown(error)) releaseSessionPendingInputOwner(owner);
				throw error;
			}));
		};
		store.bindCustody(() => {
			finished = true;
			if (owner) releaseSessionPendingInputOwner(owner);
		});
		const completionMethods = {
			...complete ? {
				complete,
				completeAsync
			} : {},
			settled: store.settled
		};
		if (committed) {
			if (options.trackCompletion) {
				const committedHash = resolveCommittedPendingInputRequestHash({
					...options,
					message,
					replaySourceSessionKeys: previous || existing ? void 0 : options.replaySourceSessionKeys
				}, committed.message);
				if (!committedHash) return;
				requestHash = committedHash;
				await assertCurrent();
			}
			retained = true;
			const run = (operation) => {
				store.assertCurrent();
				if (finished) throw new SessionPendingInputCustodyError("Pending input ownership ended");
				options.assertCurrent();
				return scope.sessionActor ? runWithSessionActorStorage(scope.sessionActor, operation) : operation();
			};
			return {
				state: "queued",
				inputId: committed.messageId,
				message: committed.message,
				run,
				assertLifetimeCurrent: () => {
					store.assertCurrent();
					(options.authority?.assertLifetimeCurrent ?? options.assertCurrent)();
				},
				runAsync: (operation) => withCurrentPendingInputAuthority(options.authority ? [options.authority] : [], () => {
					store.assertCurrent();
					options.authority?.assertLifetimeCurrent();
				}, () => run(operation)),
				finish,
				...completionMethods
			};
		}
		const prepareMessage = () => {
			options.assertCurrent();
			return options.prepareMessageAfterIdempotencyCheck(message);
		};
		const prepared = existing ? parseSessionPendingInputMessage(existing.message_json) : options.prepareMessageAfterIdempotencyCheck ? options.authority ? await options.authority.withCurrent(prepareMessage) : prepareMessage() : message;
		if (!prepared) return;
		const messageJson = existing?.message_json ?? JSON.stringify(sanitizeTranscriptMessageForStorage(prepared));
		if (Buffer.byteLength(messageJson, "utf8") > 26214400) throw new Error("Approved pending input exceeds the Gateway payload limit");
		const inputId = existing?.input_id ?? randomUUID();
		const assertAdmittedCurrent = options.assertAdmittedCurrent ?? options.assertCurrent;
		await store.mutate({
			...settlementIdentity(),
			kind: "stage",
			expected: snapshot,
			trackCompletion: options.trackCompletion === true,
			inputId,
			messageJson
		}, (_stage, facts) => {
			assertPrepared(facts, () => {
				options.assertCurrent();
				assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
				assertUnowned(facts?.candidate);
			});
		}, (facts, assertSourceCurrent) => {
			const staged = facts?.receipt.stagedInput;
			if (!staged) throw new SessionPendingInputCustodyError("Pending input omitted its committed postimage");
			owner = {
				sessionActor: scope.sessionActor,
				agentId: scope.agentId,
				databaseAgentId: store.databaseAgentId,
				inputId: staged.input_id,
				transcriptInputId: staged.input_id,
				sessionId: scope.sessionId,
				sessionKey: store.sessionKey,
				databasePath: store.path,
				workerDatabasePath: store.workerDatabasePath,
				idempotencyKey: identity.idempotencyKey,
				lifecycleGeneration,
				messageJson: staged.message_json,
				config: options.config,
				assertCurrent: () => {
					store.assertCurrent();
					assertAdmittedCurrent();
				},
				authority: options.authority,
				...existing ? { restartRecovered: true } : {},
				finish
			};
			registerSessionPendingInputOwner(owner);
			retained = true;
			options.onCommitted?.(Object.assign(ownerReceipt(owner), completionMethods));
			assertPrepared(facts, () => {
				options.assertCurrent();
				assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
			}, assertSourceCurrent);
		});
		if (!owner) throw new SessionPendingInputCustodyError("Pending input did not publish its committed owner");
		retained = true;
		return Object.assign(ownerReceipt(owner), completionMethods);
	} finally {
		if (!retained) await store.release();
	}
}
/** Prepare evidence; only the later synchronous claim may spend recovered host custody. */
async function prepareSessionPendingInputDedupeRecovery(scope, runId) {
	const claim = prepareCurrentSessionPendingInputDedupeRecovery({
		...scope,
		sessionKey: resolveSqliteSessionKey(scope.sessionKey, scope.agentId)
	}, runId);
	if (!claim) return;
	const source = await readPendingInputSource(scope, `${runId}:user`, true);
	return source ? () => {
		source.assertCurrent();
		return claim(source.path, source.snapshot);
	} : void 0;
}
/** Read one admitted source for explicit retry comparison; this never authorizes replay. */
async function readSessionSubmittedInput(scope, idempotencyKey) {
	const source = await readPendingInputSource(scope, idempotencyKey, false);
	if (!source?.snapshot.current) return;
	source.assertCurrent();
	const { pending, committed } = source.snapshot;
	const message = pending ? parseSessionPendingInputMessage(pending.message_json) : committed;
	return message && readMessageIdempotencyKey(message) === idempotencyKey ? message : void 0;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-recovery.ts
const log$1 = createSubsystemLogger("sessions/recovery");
/** Clone and publish through the canonical worker while retaining the caller's live authority. */
async function recoverSessionEntryFromRestartTombstone(params) {
	const { commitGuard, storePath, ...values } = params;
	const input = structuredClone(values);
	const scope = captureLifecycleDatabaseScope(await prepareSqliteScope({
		agentId: input.agentId,
		sessionKey: "",
		storePath,
		env: { ...process.env }
	}));
	const assertCurrent = () => commitGuard?.();
	assertCurrent();
	const options = {
		...toDatabaseOptions(scope),
		path: scope.path
	};
	let publication;
	let databaseIdentity;
	let admitted;
	return await withSessionEntryWorker(options, void 0, assertCurrent, async (execution, source) => {
		return await execution.runExisting(source, async (worker) => {
			databaseIdentity = execution.fileIdentity?.physicalIdentity;
			if (!databaseIdentity) throw new Error("Session recovery lost its admitted database identity");
			publication = retainSessionEntryWorkerPublication({
				agentId: scope.agentId,
				storePath: scope.path,
				databaseIdentity
			});
			const outcome = await worker.execute({
				type: "session.restart.recover",
				input
			}).then((value) => ({
				ok: true,
				value
			}), (error) => ({
				ok: false,
				error
			}));
			if (admitted) {
				await admitted.retained.settled;
				const facts = admitted.admission.committed?.facts;
				let receipt = outcome.ok ? outcome.value.publication : void 0;
				if (isRecord(facts) && facts.kind === "session-entry-replacements") receipt = facts;
				const unchanged = outcome.ok && outcome.value.result.status !== "created" || isRecord(facts) && facts.kind === "session-restart-recovery-unchanged";
				const unknown = admitted.admission.settlement?.kind !== "completed" || !receipt && !unchanged;
				const published = publication.settle(receipt, unknown);
				if (published) publishCommittedSessionIdentity(scope.agentId, databaseIdentity, published.previous, published.current, published.prepared);
				if (unknown) {
					const error = new SqliteWorkerError("Session recovery has no confirmed native completion and commit receipt", "outcome-unknown");
					error.cause = outcome.ok ? void 0 : outcome.error;
					throw error;
				}
				if (receipt) try {
					execution.assertCurrent();
					startSessionTranscriptIndexReconcile({
						...options,
						preferredSessionId: input.successorEntry.sessionId
					});
				} catch (error) {
					log$1.warn(`Recovery committed; transcript repair remains pending: ${formatErrorMessage(error)}`);
				}
			}
			if (!outcome.ok) throw outcome.error;
			return outcome.value.result;
		}) ?? {
			status: "conflict",
			reason: "not-tombstoned"
		};
	}, (admission, retained, facts) => {
		admitted = {
			admission,
			retained
		};
		if (!isRecord(facts) || facts.publication === void 0) return;
		const receipt = facts.publication;
		if (!isRecord(receipt) || receipt.kind !== "session-entry-replacements" || !Array.isArray(receipt.changedKeys) || !receipt.changedKeys.every((key) => typeof key === "string") || !publication) throw new Error("Session recovery commit omitted its publication keys");
		const planned = receipt;
		publication.begin(planned.changedKeys, [], void 0, void 0, void 0, new Map([...planned.current].filter(([key]) => !planned.unavailableParticipantKeys?.includes(key))));
	});
}
//#endregion
//#region src/config/sessions/session-sharing-store.receipt.ts
const participant = /* @__PURE__ */ lazyCompile(SessionParticipantSchema);
function requireReceipt(condition) {
	if (!condition) throw new SqliteWorkerError("Session collaboration receipt is incomplete or conflicting", "outcome-unknown");
}
function storedSuggestion(value) {
	return isRecord(value) && typeof value.id === "string" && typeof value.authorId === "string" && (value.authorLabel === void 0 || typeof value.authorLabel === "string") && typeof value.text === "string" && typeof value.createdAt === "number" && Number.isFinite(value.createdAt) && typeof value.state === "string" && [
		"pending",
		"accepted",
		"dismissed"
	].includes(value.state);
}
/** The native commit grant pins this candidate, including its committing connection incarnation. */
function readSessionCollaborationCandidate(value, command, keys, databaseIdentity) {
	requireReceipt(isRecord(value) && value.kind === "session-collaboration-committed" && value.type === command.type && Object.hasOwn(value, "result") && isRecord(value.publication) && isRecord(value.publication.source) && value.publication.source.identity === databaseIdentity && typeof value.publication.source.incarnation === "string" && value.publication.source.incarnation.length > 0);
	requireReceipt(hasSqliteCommitReceiptCoverage(value.publication, {
		source: {
			identity: databaseIdentity,
			incarnation: value.publication.source.incarnation
		},
		domain: "session-collaboration",
		keys
	}));
	const expected = new Map(keys.map((key) => [key, { kind: "unchanged" }]));
	const setFact = (key, fact) => {
		requireReceipt(expected.has(key));
		expected.set(key, {
			kind: "postimage",
			value: [fact]
		});
	};
	const result = value.result;
	const key = command.input.scope.sessionKey;
	if (command.type !== "category.apply") requireReceipt(keys.length === 1 && keys[0] === key);
	switch (command.type) {
		case "add":
		case "remove": {
			requireReceipt(isRecord(result));
			const adding = command.type === "add";
			if (adding) requireReceipt(isRecord(result.value) && typeof result.value.inserted === "boolean");
			const member = adding && isRecord(result.value) ? result.value.member : result.value;
			const changed = adding && isRecord(result.value) ? result.value.inserted : member !== null;
			const identityId = adding ? command.input.params.identityId.trim() : command.input.identityId.trim();
			if (member !== null) {
				requireReceipt(isRecord(member) && member.identityId === (adding ? identityId : toUSVString(identityId)) && typeof member.addedBy === "string" && typeof member.addedAt === "number" && Number.isFinite(member.addedAt));
				if (command.type === "add") requireReceipt(member.addedBy === command.input.params.addedBy.trim() && (command.input.params.addedAt === void 0 || member.addedAt === command.input.params.addedAt));
				else if (command.input.expected) requireReceipt(member.addedBy === command.input.expected.addedBy && member.addedAt === command.input.expected.addedAt);
			} else requireReceipt(!adding);
			if (changed) {
				const facts = result.facts;
				const sessionId = command.type === "add" ? command.input.params.expectedSessionId : command.input.expectedSessionId;
				requireReceipt(isRecord(facts) && typeof facts.sessionId === "string" && (sessionId === void 0 || sessionId === facts.sessionId));
				const fact = {
					kind: "member",
					sessionId: facts.sessionId,
					identityId: toUSVString(identityId),
					present: adding
				};
				requireReceipt(isDeepStrictEqual(facts, fact));
				setFact(key, fact);
			} else requireReceipt(result.facts === void 0);
			break;
		}
		case "owner.assign":
			requireReceipt(isRecord(result));
			if (result.value === null) requireReceipt(result.facts === void 0);
			else {
				const { params } = command.input;
				requireReceipt(isRecord(result.value) && typeof result.value.assignedAt === "number" && Number.isFinite(result.value.assignedAt));
				const owner = {
					actor: params.owner,
					assignedBy: params.assignedBy,
					assignedAt: params.assignedAt ?? result.value.assignedAt
				};
				requireReceipt(isDeepStrictEqual(result.value, owner));
				const facts = result.facts;
				requireReceipt(isRecord(facts) && typeof facts.sessionId === "string" && (params.expectedSessionId === void 0 || facts.sessionId === params.expectedSessionId) && (facts.lifecycleRevision === null || typeof facts.lifecycleRevision === "string"));
				const fact = {
					kind: "owner",
					sessionId: facts.sessionId,
					lifecycleRevision: facts.lifecycleRevision,
					owner
				};
				requireReceipt(isDeepStrictEqual(facts, fact));
				setFact(key, fact);
			}
			break;
		case "participant": {
			requireReceipt(isRecord(result) && (result.value === null || result.value === "inserted" || result.value === "updated" || result.value === "capped") && typeof result.projectionChanged === "boolean" && isRecord(result.participants));
			const projection = result.participants;
			let projected = {};
			if (projection.participants !== void 0) {
				requireReceipt(Array.isArray(projection.participants) && projection.participants.every(participant) && projection.participantCount === projection.participants.length);
				projected = {
					participants: projection.participants,
					participantCount: projection.participants.length
				};
			} else requireReceipt(projection.participantCount === void 0);
			requireReceipt(isDeepStrictEqual(projection, projected));
			if (result.records !== void 0) {
				requireReceipt(result.value === "updated" && !result.projectionChanged && Array.isArray(result.records) && result.records.every((record) => isRecord(record) && participant({ identity: record.identity }) && typeof record.contributionCount === "number" && Number.isSafeInteger(record.contributionCount) && record.contributionCount >= 0 && [record.firstPromptedAt, record.lastPromptedAt].every((timestamp) => timestamp === null || typeof timestamp === "number" && Number.isFinite(timestamp))));
				requireReceipt(isRecord(result.actorVersion) && typeof result.actorVersion.epoch === "string" && typeof result.actorVersion.sequence === "number" && Number.isSafeInteger(result.actorVersion.sequence));
			}
			if (result.projectionChanged) {
				requireReceipt(result.value === "inserted" || result.value === "updated");
				setFact(key, {
					kind: "participants",
					projection: projected
				});
			}
			break;
		}
		case "category.apply": {
			requireReceipt(Array.isArray(result));
			const seen = /* @__PURE__ */ new Set();
			for (const row of result) {
				requireReceipt(isRecord(row) && typeof row.sessionKey === "string" && typeof row.sessionId === "string" && !seen.has(row.sessionKey));
				seen.add(row.sessionKey);
				setFact(row.sessionKey, {
					kind: "category",
					sessionId: row.sessionId,
					category: command.input.to?.trim() || null
				});
			}
			break;
		}
		case "involvement":
			requireReceipt(isRecord(result) && typeof result.accepted === "boolean" && typeof result.changed === "boolean" && (!result.changed || result.accepted));
			if (result.changed) setFact(key, { kind: "unchanged" });
			break;
		case "suggestion.add":
			requireReceipt(storedSuggestion(result) && isRecord(result) && result.id === command.input.params.id && result.authorId === command.input.params.authorId.trim() && result.text === command.input.params.text && result.createdAt === command.input.params.createdAt && result.state === "pending");
			break;
		case "suggestion.finalize":
			requireReceipt(result === null || storedSuggestion(result) && isRecord(result) && result.id === toUSVString(command.input.params.id) && result.state === command.input.params.state);
			break;
		case "suggestion.release":
			requireReceipt(typeof result === "boolean");
			break;
		case "suggestion.claim":
			requireReceipt(result === null || isRecord(result) && (result.kind === "busy" || result.kind === "mismatch" && typeof result.resolution === "string" && [
				"send",
				"queue",
				"edit",
				"dismiss"
			].includes(result.resolution) || result.kind === "claimed" && typeof result.token === "string" && result.token.length > 0 && storedSuggestion(result.suggestion) && isRecord(result.suggestion) && result.suggestion.id === toUSVString(command.input.params.id)));
			break;
		case "category.prepare": requireReceipt(false);
	}
	requireReceipt(isDeepStrictEqual(value.publication.facts, expected));
	return value;
}
//#endregion
//#region src/config/sessions/session-sharing-store.async.ts
function toMemoryCollaborationCommand(command, scope) {
	if (command.type === "category.prepare" || command.type === "category.apply") throw new Error("Memory categories require the category owner composition");
	const { scope: _scope, ...input } = command.input;
	const profileAliases = command.type === "participant" && command.input.params.identity.type === "profile" ? [...readResidentUserProfileAliases(command.input.params.identity.id, { env: scope.env })] : void 0;
	return {
		type: `session.collaboration.${command.type}`,
		input: {
			...input,
			...profileAliases ? { profileAliases } : {}
		}
	};
}
async function runSessionCollaborationWrite(scope, command, publish, assertCurrent = () => void 0, prepare) {
	const owner = captureSessionActorStorageOwner(scope, {
		assertCurrent,
		authorize() {}
	});
	if (owner) {
		const actorCommand = toMemoryCollaborationCommand(command, scope);
		const result = await withSessionActorStorage(scope, {
			authority: owner.authority,
			lifetime: {
				assertCurrent: () => owner.authority.assertCurrent(),
				assertReadable: () => owner.authority.assertCurrent()
			}
		}, async (memory) => {
			let value;
			const outcome = await memory.actor.storage.mutate(actorCommand, memory.authority, { committed(committedOutcome) {
				value = publish(committedOutcome.value, {
					agentId: memory.agentId,
					storePath: memory.path,
					sessionKey: memory.actor.target.sessionKey
				}, void 0);
			} });
			if (outcome.kind === "rolled-back" || outcome.failure) {
				const failure = outcome.kind === "rolled-back" ? outcome.error : outcome.failure;
				const error = new Error(failure.message);
				error.name = failure.name;
				throw error;
			}
			return { value };
		});
		if (!result) throw new IncognitoSessionMissingError();
		return result.value;
	}
	const env = cloneEnvWithPlatformSemantics(scope.env ?? process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const capturedScope = {
		...scope,
		env
	};
	const reservationScope = resolveSqliteWriteAdmissionScope(capturedScope);
	const run = async () => {
		const resolved = await prepareSqliteScope(capturedScope);
		const resolvedOptions = toDatabaseOptions(resolved);
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
			type: command.type,
			input: structuredClone({
				...command.input,
				scope: commandScope
			})
		};
		try {
			return await runOpenClawAgentWriteAdmission(options, async () => {
				assertQueuedCurrent();
				if (!execution.fileIdentity) await prepareSessionEntryReplacementDatabase(options, assertQueuedCurrent, execution);
				const identity = execution.fileIdentity?.physicalIdentity;
				if (!identity) throw new Error("Session collaboration worker requires a file-backed owner");
				const publication = retainSessionEntryWorkerPublication({
					...location,
					databaseIdentity: identity
				});
				const sharingAuthorityChanged = capturedCommand.type === "add" || capturedCommand.type === "remove" || capturedCommand.type === "owner.assign";
				let publicationKeys = [location.sessionKey];
				let mutationDispatched = false;
				let resultReceived = false;
				let receiptFailed = false;
				const publicationState = {};
				let activeAdmission;
				let mutationAdmission;
				let candidate;
				const worker = await openOpenClawAgentSqliteWorkerStore(options, { execution }, {
					moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionSharingStore),
					input: void 0,
					assertAdmission(request) {
						if (mutationDispatched && request.stage === "commit") {
							if (!isRecord(request.facts)) throw new SqliteWorkerError("Session collaboration commit omitted its candidate", "outcome-unknown");
							candidate = structuredClone(readSessionCollaborationCandidate(request.facts.publication, capturedCommand, publicationKeys, identity));
						}
						return request;
					},
					onAdmitted(request) {
						if (mutationDispatched && request.stage === "commit") {
							mutationAdmission = activeAdmission;
							if (!capturedCommand.type.startsWith("suggestion.")) {
								const memberships = /* @__PURE__ */ new Map();
								const participantProjections = /* @__PURE__ */ new Map();
								for (const [key, fact] of candidate?.publication.facts ?? []) {
									if (fact.kind === "postimage" && fact.value[0]?.kind === "member") memberships.set(key, fact.value[0].sessionId);
									if (capturedCommand.type === "participant" && fact.kind === "postimage" && fact.value[0]?.kind === "participants" && fact.value[0].projection) participantProjections.set(key, fact.value[0].projection);
									else if (capturedCommand.type === "participant" && fact.kind === "unchanged") participantProjections.set(key, void 0);
								}
								publication.beginChanges(publicationKeys, memberships, publicationKeys, participantProjections, void 0, sharingAuthorityChanged);
							}
						}
					},
					observeAdmission(admission, retained) {
						activeAdmission = retained;
						observeSqliteWorkerCommittedFacts(admission, ({ facts }) => {
							if (!mutationDispatched || publicationState.result) return;
							try {
								if (!candidate || !isDeepStrictEqual(facts, candidate)) throw new SqliteWorkerError("Session collaboration receipt differs from its admitted candidate", "outcome-unknown");
								const receipt = candidate;
								const changes = [...receipt.publication.facts].flatMap(([sessionKey, fact]) => fact.kind === "postimage" ? fact.value.map((changeFacts) => ({
									...location,
									sessionKey,
									scope: "session-entry",
									facts: changeFacts
								})) : [{
									...location,
									sessionKey,
									facts: { kind: "unchanged" }
								}]);
								const result = receipt.result;
								publicationState.result = { value: publication.settleChanges(changes, (currentKeys, invalidations, release) => {
									for (const [sessionKey, fact] of receipt.publication.facts) {
										if (!currentKeys.has(sessionKey) || fact.kind !== "postimage") continue;
										for (const change of fact.value) {
											if (change.kind === "member" || change.kind === "owner" || change.kind === "category") commitSessionSharingFieldChange(identity, sessionKey, change);
											else recordCommittedSessionMetadataPublication(identity, sessionKey, change);
											if (change.kind === "owner" || change.kind === "category" || change.kind === "unchanged") invalidateSessionEntryCaches(identity);
										}
									}
									release();
									const selected = publish(result, location, identity, currentKeys);
									sessionChanges.emitBatch(invalidations);
									return selected;
								}) };
							} catch (error) {
								receiptFailed = true;
								throw error;
							}
						});
					}
				});
				try {
					if (prepare) await worker.run(async (operation) => {
						const prepared = await prepare({ async execute(prepareCommand, executeOptions) {
							const result = await operation.execute(prepareCommand, executeOptions);
							if (prepareCommand.type === "category.prepare" && Array.isArray(result) && result.every((key) => typeof key === "string")) publicationKeys = result;
							return result;
						} }, commandScope);
						if (prepared) capturedCommand.input = structuredClone({
							...prepared,
							scope: commandScope
						});
						assertQueuedCurrent();
						mutationDispatched = capturedCommand.type !== "category.prepare";
						await operation.execute(capturedCommand);
						resultReceived = true;
					}, assertQueuedCurrent);
					else {
						assertQueuedCurrent();
						mutationDispatched = capturedCommand.type !== "category.prepare";
						await worker.execute(capturedCommand, assertQueuedCurrent);
						resultReceived = true;
					}
					if (!publicationState.result) throw new SqliteWorkerError("Session collaboration omitted its native commit receipt", "outcome-unknown");
					return publicationState.result.value;
				} catch (error) {
					await mutationAdmission?.settled;
					if (publicationState.result) return publicationState.result.value;
					const unknown = mutationDispatched && (receiptFailed || resultReceived || collectNestedErrorCandidates(error).some((errorCandidate) => extractErrorCode(errorCandidate) === "outcome-unknown"));
					if (unknown && !capturedCommand.type.startsWith("suggestion.")) publication.beginChanges(publicationKeys, void 0, void 0, void 0, void 0, sharingAuthorityChanged);
					publication.settle(void 0, unknown);
					throw error;
				} finally {
					publication.settle(void 0, false);
					await worker.close();
				}
			}, true);
		} finally {
			await execution.release();
		}
	};
	return reservationScope ? runOpenClawAgentWriteAdmission(toDatabaseOptions(reservationScope), run, true) : run();
}
/** The receipt owner installs retained facts before releasing pending publication. */
function publishSessionCollaborationChanges(changes, databaseIdentity) {
	if (databaseIdentity) for (const change of changes) {
		const facts = "facts" in change ? change.facts : void 0;
		bindPreparedSessionEntryPublication(change, {
			kind: "marker",
			sharingChange: facts?.kind === "participants" || facts?.kind === "unchanged" ? "unchanged" : "changed",
			databaseIdentity
		});
	}
	sessionChanges.emitBatch(changes);
}
function publishSessionMembership({ facts }, location, databaseIdentity) {
	publishSessionCollaborationChanges([facts ? {
		...location,
		facts
	} : {
		...location,
		factsInvalidated: true
	}], databaseIdentity);
}
function addSessionMemberInWorker(scope, params, assertCurrent) {
	return runSessionCollaborationWrite(scope, {
		type: "add",
		input: {
			scope,
			params: structuredClone({
				...params,
				addedAt: params.addedAt ?? Date.now()
			})
		}
	}, (result, location, database, currentKeys) => {
		if (result.value.inserted && (!currentKeys || currentKeys.has(location.sessionKey))) publishSessionMembership(result, location, database);
		return result.value;
	}, assertCurrent);
}
function removeSessionMemberInWorker(scope, identityId, expected, expectedSessionId, assertCurrent, expectedEntry) {
	if (!identityId.trim()) return Promise.resolve(null);
	return runSessionCollaborationWrite(scope, {
		type: "remove",
		input: {
			scope,
			identityId,
			expected: expected && structuredClone(expected),
			expectedSessionId,
			expectedEntry: expectedEntry && structuredClone(expectedEntry)
		}
	}, (result, location, database, currentKeys) => {
		if (result.value && (!currentKeys || currentKeys.has(location.sessionKey))) publishSessionMembership(result, location, database);
		return result.value;
	}, assertCurrent);
}
function recordSessionParticipantInWorker(scope, params) {
	if (!params.identity.id || params.identity.type === "agent" && params.identity.id === params.sessionAgentId) return Promise.resolve(null);
	return runSessionCollaborationWrite(scope, {
		type: "participant",
		input: {
			scope,
			params: structuredClone({
				...params,
				promptedAt: params.promptedAt ?? Date.now()
			})
		}
	}, (result, location, database, currentKeys) => {
		if ((result.value === "inserted" || result.value === "updated") && (!currentKeys || currentKeys.has(location.sessionKey))) {
			publishSessionCollaborationChanges([{
				...location,
				scope: "session-entry",
				facts: result.projectionChanged ? {
					kind: "participants",
					projection: result.participants
				} : {
					kind: "participants",
					projectionChanged: false,
					records: result.records,
					actorVersion: result.actorVersion
				}
			}], database);
			emitSessionLifecycleEvent({
				agentId: location.agentId,
				sessionKey: location.sessionKey,
				reason: "participants",
				scope: "session-entry"
			});
		}
		return result.value;
	});
}
//#endregion
//#region src/config/sessions/session-involvement-store.ts
async function updateSessionProfileInvolvementAsync(scope, { assertCurrent, ...params }) {
	const captured = structuredClone(params);
	let catalog;
	let profiles;
	const selectProfiles = (prepared) => [...new Set(captured.profileIds)].map((profileId) => {
		const identity = prepared.readCurrentIdentity(profileId);
		return {
			profileId: identity?.profileId ?? profileId,
			aliases: [.../* @__PURE__ */ new Set([profileId, ...identity?.aliases ?? []])]
		};
	});
	try {
		return await runSessionCollaborationWrite(scope, {
			type: "involvement",
			input: {
				scope,
				params: captured,
				profiles: []
			}
		}, (result, location, database, currentKeys) => {
			if (result.changed && database && (!currentKeys || currentKeys.has(location.sessionKey))) {
				publishSessionCollaborationChanges([{
					...location,
					facts: { kind: "unchanged" }
				}], database);
				emitSessionLifecycleEvent({
					agentId: location.agentId,
					sessionKey: location.sessionKey,
					reason: "involvement"
				});
			}
			return result.accepted;
		}, () => {
			assertCurrent?.();
			if (catalog && profiles && !isDeepStrictEqual(selectProfiles(catalog), profiles)) throw new Error("Session involvement profile aliases changed before commit");
		}, async (_operation, capturedScope) => {
			catalog = await prepareUserProfileCatalog({ env: capturedScope.env });
			profiles = selectProfiles(catalog);
			return {
				scope: capturedScope,
				params: captured,
				profiles
			};
		});
	} finally {
		catalog?.release();
	}
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
	attachSessionEntrySnapshots(record, row);
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
	return getSessionKysely(database.db).selectFrom("session_nodes").leftJoin("session_windows as current_window", (join) => join.onRef("current_window.session_id", "=", "session_nodes.current_session_id").onRef("current_window.session_key", "=", "session_nodes.session_key")).leftJoin("session_windows as current_window_owner", "current_window_owner.session_id", "session_nodes.current_session_id").leftJoin("conversations as current_conversation", "current_conversation.conversation_id", "current_window.primary_conversation_id").selectAll("session_nodes").select(sessionEntrySnapshotColumns).select([
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
			rawEntryJson: row.entry_json,
			rawSnapshotRevision: row.snapshot_revision
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
				row.snapshot_revision,
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
		const summary = {
			entry: loaded.entry,
			sessionKey: fact.sessionKey
		};
		return fact.rawCompareRequired ? {
			...summary,
			rawEntryJson: loaded.rawEntryJson,
			rawSnapshotRevision: loaded.rawSnapshotRevision
		} : summary;
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
//#region src/config/sessions/session-accessor.sqlite-branch-list.ts
const pendingBranchReads = /* @__PURE__ */ new Map();
async function listSessionBranches(params) {
	const sourceKey = normalizeStoreSessionKey(params.sessionStoreKey ?? params.sessionKey);
	const memory = captureSessionActorStorageOwner({
		...params,
		sessionKey: sourceKey
	}, {
		assertCurrent() {},
		authorize() {}
	});
	if (memory) {
		const assertCurrent = () => {
			memory.binding?.actor.assertReadable();
			memory.authority.assertCurrent();
		};
		const actor = await memory.owner?.acquireExisting(resolveSqliteSessionKey(sourceKey, memory.agentId), {
			assertCurrent,
			assertReadable: assertCurrent
		});
		if (!actor) return { status: "missing-session" };
		try {
			const result = await actor.storage.read({
				type: "session.history.branches",
				input: {}
			}, {
				...memory.authority,
				assertCurrent
			});
			return result.status === "ok" ? {
				status: "ok",
				branches: result.branches
			} : result;
		} finally {
			await actor.release();
		}
	}
	try {
		const resolved = await prepareSqliteScope({
			...params.agentId ? { agentId: params.agentId } : {},
			...params.env ? { env: params.env } : {},
			sessionKey: sourceKey,
			...params.storePath ? { storePath: params.storePath } : {}
		});
		const options = toDatabaseOptions(resolved);
		const database = {
			agentId: options.agentId,
			path: resolveOpenClawAgentSqlitePath(options)
		};
		const writeToken = readSqliteDatabaseWriteTokenForPath(database.path);
		const cached = readCachedSessionBranchSummaries(database.path, sourceKey);
		if (writeToken !== void 0 && cached?.writeToken === writeToken) return {
			status: "ok",
			branches: cloneSessionBranchSummaries(cached.branches)
		};
		const key = JSON.stringify([
			database.path,
			sourceKey,
			writeToken
		]);
		const snapshot = await getOrCreatePromise(pendingBranchReads, key, async () => {
			const { runSessionBranchSummaryWorkerRequest } = await import("./session-transcript-worker-runtime-D7sVp2qp.mjs");
			const read = () => runSessionBranchSummaryWorkerRequest({
				database,
				sessionKey: sourceKey,
				previous: cached
			});
			try {
				return await read();
			} catch (error) {
				if (!(error instanceof SessionTranscriptColdError)) throw error;
				return readRestoredSessionTranscript({
					...params,
					agentId: resolved.agentId,
					sessionId: error.sessionId
				}, read);
			}
		}, { evictOnSettled: true });
		if (snapshot.status !== "ok") return snapshot;
		cacheSessionBranchSummaries(database.path, sourceKey, writeToken, snapshot);
		return {
			status: "ok",
			branches: cloneSessionBranchSummaries(snapshot.branches)
		};
	} catch {
		return { status: "failed" };
	}
}
//#endregion
//#region src/config/sessions/session-manual-compact.ts
/** Keep the admitted physical owner and host authority until the combined write settles. */
function trimSessionTranscriptInWorker(scope, input, authority) {
	const database = {
		...toDatabaseOptions(scope),
		path: scope.path
	};
	const sources = authority.source?.checks.map(({ predicate }) => predicate) ?? [];
	let sourceMatches = [];
	let sourceValidation;
	const assertCurrent = () => {
		authority.assertCurrent();
		if (!sourceValidation) return;
		authority.source?.assertCurrent();
		for (const match of sourceValidation.conversationMatches) {
			const matches = sourceMatches.find(({ index }) => index === match.index).matches;
			const accepted = match.acceptedAlternatives ?? match.alternatives;
			for (let alternative = 0; alternative < matches.length - 1; alternative++) Atomics.store(matches, alternative + 1, accepted.includes(alternative) ? 1 : 0);
		}
	};
	return runSessionEntryWorkerOperation({
		database,
		databaseIdentity: authority.databaseIdentity,
		agentId: scope.agentId,
		candidateKind: "session-manual-compact",
		assertCurrent,
		onTransactionFacts(facts) {
			if (!isRecord(facts) || facts.kind !== "session-manual-compact-validated") return false;
			const validated = facts;
			sourceValidation = validated.sourceValidation;
			sourceMatches = validated.sourceMatches;
			if (authority.source) acceptSessionSourceValidation(authority.source, sourceValidation);
			assertCurrent();
			return true;
		},
		run: (worker, commit) => commit(() => executeSessionMessageRewriteOperation(worker, database.agentId, {
			type: "session.transcript.manualCompact",
			input: {
				...input,
				scope,
				sources
			}
		})),
		onCommitted(candidate, published, identity) {
			if (published) publishCommittedSessionIdentity(scope.agentId, identity, published.previous, published.current, published.prepared);
			return candidate.result;
		}
	});
}
//#endregion
//#region src/config/sessions/session-transcript-stats.ts
/** Read statistics through the selected actor or durable history owner. */
function readTranscriptStatsAsync(scope) {
	const memory = captureSessionActorTranscriptRead(scope);
	if (memory) {
		if (memory.missing) {
			memory.assertCurrent();
			return Promise.resolve({
				eventCount: 0,
				maxSeq: 0,
				sizeBytes: 0
			});
		}
		return memory.read("session.history.stats", {});
	}
	return withSessionTranscriptReadSource(scope, ({ scope: captured, resolved, owner, expectedIdentity }) => owner.readStats({
		scope: {
			...captured,
			sessionId: resolved.sessionId
		},
		expectedIdentity
	}));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-compaction-runtime.ts
/** Commit transcript and accounting together through the existing SessionManager writer. */
async function persistCompactionBoundaryWithSessionEntryAsync(scope, params, assertActive) {
	assertActive?.();
	const captured = withOwnedSessionTranscriptWriterFence({
		...captureSessionTranscriptTargetBinding(scope),
		expectedLifecycleRevision: scope.expectedLifecycleRevision,
		expectedWriterRunId: scope.expectedWriterRunId,
		...scope.expectedOwner ? { expectedOwner: { ...scope.expectedOwner } } : {}
	});
	const { scope: preparedScope, ...append } = params.prepared;
	const prepared = {
		...structuredClone(append),
		scope: withOwnedSessionTranscriptWriterFence({
			...captureSessionTranscriptTargetBinding(preparedScope),
			expectedLifecycleRevision: preparedScope.expectedLifecycleRevision,
			expectedWriterRunId: preparedScope.expectedWriterRunId,
			...preparedScope.expectedOwner ? { expectedOwner: { ...preparedScope.expectedOwner } } : {}
		})
	};
	if (!sameSessionTranscriptStorageEnvironment(captured.env, prepared.scope.env)) throw new SessionTranscriptWriterClaimReboundError();
	const assertOwned = captureOwnedTranscriptWriteAssertion(captured);
	const assertPreparedOwned = captureOwnedTranscriptWriteAssertion(prepared.scope);
	const initialWriter = getOwnedSessionTranscriptInitialWriter({ sessionTarget: prepared.scope });
	const assertCurrent = () => {
		assertActive?.();
		assertOwned();
		assertPreparedOwned();
		initialWriter?.assertActive();
	};
	const memory = captureSessionManagerIncognitoBinding(captured);
	const options = memory?.database ?? toDatabaseOptions(resolveSqliteTranscriptScope(captured));
	const transcriptByteCompactionLatch = { ...params.transcriptByteCompactionLatch };
	const persist = async (database) => {
		const { withSessionMetadataWorker } = await runInDetachedAsyncContext(() => import("./session-manager-metadata-runtime-BVaK_rGu.mjs"));
		assertCurrent();
		return withSessionMetadataWorker(options, database, assertCurrent, async (worker) => {
			const { env: _env, ...target } = captured;
			const { env: _preparedEnv, ...preparedTarget } = prepared.scope;
			const acknowledged = await receiveSessionManagerCommit("session.transcript.compactionBoundary", () => worker.execute({
				type: "session.transcript.compactionBoundary",
				input: {
					scope: memory ? {
						...target,
						storePath: database.path
					} : target,
					prepared: {
						...prepared,
						scope: memory ? {
							...preparedTarget,
							storePath: database.path
						} : preparedTarget
					},
					transcriptByteCompactionLatch,
					...initialWriter && !initialWriter.committedFence ? { initialWriterRunId: initialWriter.writerRunId } : {}
				}
			}));
			const receipt = acknowledged.value;
			if (acknowledged.failure) throw new SessionEntryCommittedError(receipt.committed.result.id, captured, receipt.committed.after, acknowledged.failure);
			if (receipt.projectionNeedsReconcile) startSessionTranscriptIndexReconcile({
				...options,
				preferredSessionId: captured.sessionId
			});
			return receipt.committed;
		}, { initialWriter });
	};
	if (memory) return trackAsyncWork(() => withSessionManagerMemoryActor(memory, params.prepared.initializeEntry === true, async (selected) => {
		if (!selected) throw new IncognitoSessionMissingError();
		return persist(createSessionManagerMemoryDatabase(selected));
	}));
	const database = captureOpenClawAgentDatabaseExecution(options);
	return trackAsyncWork(async () => {
		try {
			return await runOpenClawAgentWriteAdmission(options, () => persist(database), true);
		} finally {
			await database.release();
		}
	});
}
//#endregion
//#region src/config/sessions/session-transcript-message-presence.ts
/** Read the cold marker and both message probes in the history worker's one snapshot. */
function hasSessionTranscriptMessage(scope) {
	const memory = captureSessionActorTranscriptRead(scope);
	if (memory) {
		if (memory.missing) {
			memory.assertCurrent();
			return Promise.resolve(false);
		}
		return memory.read("session.history.message-presence", {});
	}
	return withSessionTranscriptReadSource(scope, (source) => readRestoredSessionTranscriptInWorker(source, () => source.owner.readMessagePresence({
		scope: source.scope,
		expectedIdentity: source.expectedIdentity
	})));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-message-rewrite.ts
/** Worker and offline-maintenance adapter; runtime callers use the prepared worker operation. */
async function rewriteNativeTranscriptMessageAtAnchor(anchor, rewriteMessage) {
	const resolved = resolveSqliteTranscriptScope(anchor);
	return await runExclusiveSqliteSessionWrite(resolved, async () => runOpenClawAgentWriteTransaction((database) => {
		assertSessionTranscriptHot(database.db, resolved.sessionId);
		const row = executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select(transcriptEventJsonSql(database.db).as("event_json")).where("session_id", "=", resolved.sessionId).where("seq", "=", anchor.rawSeq));
		if (!row) return null;
		const event = JSON.parse(row.event_json);
		if (!isRecord(event) || event.type !== "message" || event.id !== anchor.entryId) return null;
		const message = rewriteMessage(event.message);
		if (message === void 0) return null;
		rewriteSqliteTranscriptEventRowsInTransaction(database, resolved, [{
			event: {
				...event,
				message
			},
			expectedEventJson: row.event_json,
			seq: anchor.rawSeq
		}]);
		const generation = readTranscriptGenerationInTransaction(database, resolved.sessionId);
		return generation ? {
			generation,
			message
		} : null;
	}, toDatabaseOptions(resolved), { operationLabel: "session.transcript.message-rewrite" }), "session.transcript.message-rewrite");
}
/** Worker and offline-maintenance adapter; process-held incognito retains its native owner. */
async function rewriteNativeAssistantTranscriptMessageForRun(params, preparedScope) {
	const scope = withOwnedSessionTranscriptWriterFence({
		...params.scope,
		expectedLifecycleRevision: params.expectedLifecycleRevision ?? void 0
	});
	const resolved = preparedScope ?? resolveSqliteTranscriptScope(scope);
	const { restoreSessionColdTranscript } = await import("./session-cold-storage-Doo7Aerf.mjs");
	await restoreSessionColdTranscript({
		...scope,
		sessionId: resolved.sessionId,
		...preparedScope ? { storePath: resolved.path } : {}
	}, preparedScope ? () => assertOwnedTranscriptWriteCommit(scope) : void 0);
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
	}, toDatabaseOptions(resolved), { operationLabel: "session.transcript.assistant-rewrite" }), "session.transcript.message-rewrite");
}
//#endregion
//#region src/config/sessions/session-message-rewrite.ts
/** Prepare callback output outside SQLite; the existing worker owns selection and commit. */
async function rewritePreparedTranscriptMessage(params) {
	const requested = params.readSource ? {
		...params.scope,
		agentId: params.readSource.agentId,
		storePath: params.readSource.path
	} : params.scope;
	const assertCurrent = () => params.assertCurrent?.();
	const authority = {
		assertCurrent,
		authorize: assertCurrent
	};
	if (captureSessionActorStorageOwner(requested, authority)) {
		const captured = await withSessionActorStorage(requested, {
			authority,
			lifetime: {
				assertCurrent,
				assertReadable: assertCurrent
			}
		}, async (memory) => {
			const scope = {
				...requested,
				agentId: memory.agentId,
				storePath: memory.path,
				sessionId: requested.sessionId ?? memory.actor.snapshot(memory.authority)?.entry?.sessionId
			};
			if (!scope.sessionId) return { result: null };
			const input = {
				scope: {
					...scope,
					sessionId: scope.sessionId
				},
				target: params.target,
				expectedEntry: params.expectedEntry
			};
			const expected = await memory.actor.storage.read({
				type: "session.rewrite.prepare",
				input
			}, memory.authority);
			assertCurrent();
			if (!expected) return { result: null };
			const message = params.prepare(expected.event.message);
			return { result: readSessionActorStorageResult(await memory.actor.storage.mutate({
				type: "session.rewrite.commit",
				input: {
					...input,
					expected,
					message
				}
			}, memory.authority)).result };
		});
		if (!captured) throw new SessionTranscriptWriterClaimReboundError();
		return captured.result;
	}
	const scope = captureLifecycleDatabaseScope(resolveSqliteTranscriptScope(requested, params.readSource));
	const database = {
		...toDatabaseOptions(scope),
		path: scope.path
	};
	const selection = structuredClone({
		scope,
		target: params.target,
		expectedEntry: params.expectedEntry
	});
	return await runSessionEntryWorkerOperation({
		database,
		agentId: scope.agentId,
		candidateKind: "session-message-rewrite",
		assertCurrent: () => params.assertCurrent?.(),
		prepareWorker: selection.target.kind === "terminal-assistant" ? () => ({
			async prepare() {
				const { restoreSessionColdTranscript } = await import("./session-cold-storage-Doo7Aerf.mjs");
				await restoreSessionColdTranscript({
					...scope,
					storePath: scope.path
				});
			},
			beforeWrite() {},
			async release() {}
		}) : void 0,
		async run(worker, commit) {
			const expected = await executeSessionMessageRewriteOperation(worker, database.agentId, {
				type: "session.messageRewrite.prepare",
				input: selection
			});
			params.assertCurrent?.();
			if (!expected) return null;
			const message = params.prepare(expected.event.message);
			params.assertCurrent?.();
			return commit(() => executeSessionMessageRewriteOperation(worker, database.agentId, {
				type: "session.messageRewrite.commit",
				input: {
					...selection,
					expected,
					message
				}
			}));
		},
		onCommitted: ({ result }) => {
			return result;
		}
	});
}
async function rewritePreparedTranscriptMessageAtAnchor(anchor, prepare, options = {}) {
	if (!isMainThread) return rewriteNativeTranscriptMessageAtAnchor(anchor, (message) => {
		options.assertCurrent?.();
		options.assertNativeCurrent?.();
		if (options.active) {
			const active = readActiveTranscriptEntryAnchor(anchor);
			if (options.active === "exact" ? !isDeepStrictEqual(active, anchor) : active?.rawSeq !== anchor.rawSeq) throw new SessionTranscriptWriterClaimReboundError();
		}
		return prepare(message);
	});
	return rewritePreparedTranscriptMessage({
		...options,
		scope: anchor,
		target: {
			kind: "anchor",
			anchor,
			active: options.active
		},
		prepare
	});
}
async function rewritePreparedAssistantTranscriptMessageForRun(params) {
	if (!isMainThread) {
		const resolved = resolveSqliteTranscriptScope(params.scope, params.readSource);
		return rewriteNativeAssistantTranscriptMessageForRun(params, params.readSource ? resolved : void 0);
	}
	const scope = withOwnedSessionTranscriptWriterFence({
		...params.scope,
		expectedLifecycleRevision: params.expectedLifecycleRevision ?? void 0
	});
	if (scope.expectedLifecycleRevision !== void 0 && scope.expectedLifecycleRevision !== (params.expectedLifecycleRevision ?? void 0)) throw new SessionTranscriptWriterClaimReboundError();
	const result = await rewritePreparedTranscriptMessage({
		scope: params.scope,
		readSource: params.readSource,
		target: {
			kind: "terminal-assistant",
			runId: params.runId
		},
		expectedEntry: {
			lifecycleRevision: params.expectedLifecycleRevision ?? null,
			activeWriterRunId: scope.expectedWriterRunId,
			owner: scope.expectedOwner
		},
		assertCurrent: () => assertOwnedTranscriptWriteCommit(scope),
		prepare: (message) => {
			const rewritten = params.rewriteMessage(message);
			return isDeepStrictEqual(message, rewritten) ? void 0 : rewritten;
		}
	});
	return result ? { messageId: result.messageId } : null;
}
//#endregion
//#region src/config/sessions/session-accessor.transcript.ts
/**
* Trims a transcript for manual sessions.compact and clears stale token metadata.
* This is one storage-sized mutation: future stores can trim transcript rows and
* update entry metadata inside the same backend transaction.
*/
async function preflightSessionTranscriptForManualCompact(scope, params) {
	const { eventCount } = await readTranscriptStatsAsync(scope);
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
	const authority = params.authority;
	const memory = captureSessionActorStorageOwner(scope, {
		assertCurrent: () => authority?.assertHostCurrent(),
		authorize: () => authority?.assertHostCurrent()
	});
	if (memory) {
		if (!memory.owner && !memory.binding) return {
			compacted: false,
			reason: "no transcript"
		};
		const source = authority ? await prepareSessionSourceAuthority(authority.source) : void 0;
		const assertCurrent = () => {
			memory.owner?.assertCurrent();
			memory.binding?.actor.assertReadable();
			memory.authority.assertCurrent();
		};
		try {
			return await withSessionActorStorage(scope, {
				lifetime: {
					assertCurrent,
					assertReadable: assertCurrent
				},
				authority: memory.authority
			}, async (binding) => {
				const expected = authority?.expectedSource;
				if (expected && (expected.path !== binding.path || expected.agentId !== binding.agentId || expected.databaseIdentity !== binding.actor.target.database.incarnation)) throw new Error("Session compaction changed its memory owner");
				return readSessionActorStorageResult(await binding.actor.storage.mutate({
					type: "session.transcript.manualCompact",
					input: {
						scope: {
							...scope,
							storePath: binding.path
						},
						maxLines: params.maxLines,
						nowMs: params.nowMs,
						sources: source?.checks.map(({ predicate }) => predicate)
					}
				}, {
					assertCurrent,
					authorize(stage, facts, publication) {
						binding.authority.authorize(stage, facts, publication);
						if (authority && stage === "commit" && facts.target.sessionKey === scope.sessionKey && (!facts.entry || facts.entry.sessionId !== scope.sessionId || facts.entry.lifecycleRevision !== authority.expectedLifecycleRevision || resolveSessionWorkStartError(scope.sessionKey, facts.entry))) throw new SessionWorkStartChangedError("Session changed before compaction. Retry.");
						if (source && isRecord(publication) && publication.kind === "session-manual-compact-validated") acceptSessionSourceValidation(source, publication.sourceValidation);
					}
				}, { beforeCommit: () => source?.assertCurrent() }));
			}) ?? {
				compacted: false,
				reason: "no transcript"
			};
		} finally {
			if (source) await releaseSessionSourceAuthorities([source]);
		}
	}
	if (!authority) return withSessionTranscriptReadSource(scope, async ({ scope: captured, resolved, expectedIdentity, assertCurrent }) => {
		const { restoreSessionColdTranscript } = await import("./session-cold-storage-Doo7Aerf.mjs");
		assertCurrent();
		await restoreSessionColdTranscript(captured, assertCurrent);
		assertCurrent();
		return trimSessionTranscriptInWorker({
			...resolved,
			sessionKey: resolved.sessionKey ?? scope.sessionKey,
			path: captured.storePath
		}, params, {
			assertCurrent,
			databaseIdentity: expectedIdentity?.key.slice(5)
		});
	});
	const assertEntryCurrent = (entry) => {
		if (!entry || entry.sessionId !== scope.sessionId || entry.lifecycleRevision !== authority.expectedLifecycleRevision || resolveSessionWorkStartError(scope.sessionKey, entry)) throw new SessionWorkStartChangedError("Session changed before compaction. Retry.");
	};
	return withSessionTranscriptReadSource(scope, async ({ scope: captured, resolved, owner, expectedIdentity, assertCurrent: assertReader }) => {
		const expectedSource = authority.expectedSource;
		const assertPhysicalSource = () => {
			if (expectedSource && typeof expectedSource.databaseIdentity === "string") {
				if (captured.storePath !== expectedSource.path) throw new Error("Session compaction changed its physical store");
				assertExistingDatabaseIdentity(captured.storePath, `file:${expectedSource.databaseIdentity}`, expectedSource.databaseBirthtime);
			}
		};
		assertPhysicalSource();
		const source = await prepareSessionSourceAuthority(authority.source);
		const nativeCommit = source.nativeSource || source.hasOpaqueCheck;
		try {
			const assertOwnerCurrent = () => {
				assertReader();
				assertPhysicalSource();
				authority.assertHostCurrent();
			};
			const assertCurrent = () => {
				assertOwnerCurrent();
				if (source.assertPreparedCurrent) source.assertPreparedCurrent();
				else if (!nativeCommit) source.assertCurrent();
			};
			assertCurrent();
			const sources = source.checks.map(({ predicate }) => predicate);
			const read = await owner.readExactEntries({
				sessionKeys: [scope.sessionKey],
				projection: "exact",
				expectedIdentity: expectedIdentity && {
					...expectedIdentity,
					canonicalPath: captured.storePath
				},
				env: captured.env,
				manualCompact: {
					sessionId: resolved.sessionId,
					sources
				}
			});
			assertCurrent();
			const refused = read.manualCompact?.refusedSource;
			if (refused) source.checks[refused.index].refuse(refused.facts);
			assertEntryCurrent(read.entries[0]?.entry);
			if (nativeCommit) authority.source();
			const preparation = {
				snapshot: read.entries,
				assertEntryCurrent,
				assertCurrent,
				assertCommitCurrent: () => {
					assertCurrent();
					authority.source();
				},
				restore: async () => {
					const { restoreSessionColdTranscript, SessionColdSourceReboundError, SessionColdTurnReboundError } = await import("./session-cold-storage-Doo7Aerf.mjs");
					assertCurrent();
					try {
						await restoreSessionColdTranscript(captured, assertCurrent, {
							target: resolved,
							acceptSourceValidation: (validation) => acceptSessionSourceValidation(source, validation),
							readMetadata: async (phase) => phase === "initial" ? read.manualCompact?.archive : (await owner.readColdMetadata({
								sessionId: resolved.sessionId,
								env: captured.env
							})).archive
						}, {
							kind: "turn",
							agentId: resolved.agentId,
							sessionKey: scope.sessionKey,
							options: {
								keyFormat: "agent-qualified",
								expectedSessionId: resolved.sessionId,
								selectedSessionId: resolved.sessionId,
								selectedLifecycleRevision: authority.expectedLifecycleRevision ?? null
							},
							sources,
							requireActive: true
						});
					} catch (error) {
						if (error instanceof SessionColdTurnReboundError) throw new SessionWorkStartChangedError(error.message);
						if (error instanceof SessionColdSourceReboundError) source.checks[error.refusal.index].refuse(error.refusal.facts);
						throw error;
					}
					assertCurrent();
				}
			};
			if (nativeCommit) return await trimPreparedSessionTranscriptForManualCompact({
				...captured,
				sessionKey: scope.sessionKey
			}, params, preparation);
			await preparation.restore();
			assertCurrent();
			return await trimSessionTranscriptInWorker({
				...resolved,
				sessionKey: resolved.sessionKey ?? scope.sessionKey,
				path: captured.storePath
			}, {
				maxLines: params.maxLines,
				nowMs: params.nowMs,
				entries: read.entries
			}, {
				assertCurrent: assertOwnerCurrent,
				source,
				databaseIdentity: expectedIdentity?.key.slice(5)
			});
		} finally {
			await releaseSessionSourceAuthorities([source]);
		}
	});
}
async function trimPreparedSessionTranscriptForManualCompact(scope, params, preparation) {
	let declined = {
		compacted: false,
		reason: "no transcript"
	};
	const trimmed = await trimTranscriptForManualCompact(scope, (lines) => {
		const selected = selectManualCompactTranscriptLines(lines, params.maxLines);
		declined = selected.result;
		return selected.result.compacted ? selected.lines : null;
	}, {
		nowMs: params.nowMs,
		preparation
	});
	if (!trimmed.trimmed) return declined;
	return {
		compacted: true,
		kept: trimmed.kept
	};
}
//#endregion
//#region src/config/sessions/session-accessor.transcript-turn.ts
function resolveTranscriptTurnAgentId(params) {
	if (classifySessionKeyShape(params.sessionKey) === "malformed_agent") throw new Error("Malformed agent session key; refusing transcript turn persistence.");
	const scopedAgentId = params.scopeAgentId?.trim() ? normalizeAgentId(params.scopeAgentId) : void 0;
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
			message: sanitizeTranscriptMessageForStorage(append.message),
			now: append.now ?? Date.now()
		})),
		updateMode: "none"
	});
	if (turn.rejectedReason) throw new Error("Transcript session changed before batch append");
	return turn.messages;
}
/**
* Persists one logical transcript turn through its selected session owner.
* Transcript row append(s) and the requested
* updatedAt touch happen before transcript update delivery is published.
*/
async function persistSessionTranscriptTurn(scope, options) {
	const memory = captureSessionActorStorageOwner(scope, {
		assertCurrent: () => options.assertCurrent?.(),
		authorize: () => options.assertCurrent?.()
	});
	const expectedSessionId = options.expectedSessionId ?? (memory ? scope.sessionId : void 0);
	if (expectedSessionId) return await persistExpectedSessionTranscriptTurn(scope, {
		...options,
		expectedSessionId
	});
	if (options.messages.some((append) => append.workerPreparation?.prepareMessageAfterIdempotencyCheckAsync)) throw new Error("Awaited transcript preparation requires an expected session id");
	if (options.sessionLifecyclePatch || options.sessionTurnMutation || options.initialSessionEntry) throw new Error("Cannot mutate a session turn without an expected session id");
	const target = await prepareTranscriptTurnTarget(scope, options.config);
	const previousSessionEntry = (scope.sessionStore ? resolveSessionStoreEntryCore({
		store: scope.sessionStore,
		sessionKey: target.sessionKey
	}) : void 0)?.existing ?? scope.sessionEntry;
	if (target.selectedSessionId != null && target.storePath && target.sessionKey && target.sessionId) return await persistExpectedSessionTranscriptTurn({
		...scope,
		...target
	}, {
		...options,
		expectedSessionId: target.sessionId
	}, target);
	const appendedMessages = await runWithOwnedSessionTranscriptWrite({
		sessionFile: target.sessionKey,
		sessionKey: target.sessionKey,
		sessionTarget: target
	}, () => appendTranscriptTurnMessages(target, options));
	const appendedCount = appendedMessages.filter((message) => message.appended).length;
	let sessionEntry = previousSessionEntry;
	if (options.touchSessionEntry === true && appendedCount > 0 && target.storePath && target.sessionKey && target.sessionId) {
		const updatedAt = Date.now();
		const updated = await updateSessionEntry({
			sessionKey: target.sessionKey,
			storePath: target.storePath,
			...target.agentId ? { agentId: target.agentId } : {},
			...target.env ? { env: target.env } : {}
		}, (current) => current.sessionId === target.sessionId ? { updatedAt: Math.max(current.updatedAt ?? 0, updatedAt) } : null, { skipMaintenance: true });
		if (updated && scope.sessionStore) scope.sessionStore[target.sessionKey] = updated;
		sessionEntry = updated ?? previousSessionEntry;
	}
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
	const selectedMessages = [];
	for (const append of options.messages) if (!append.shouldAppend || await append.shouldAppend({
		...target.agentId ? { agentId: target.agentId } : {},
		...target.sessionId ? { sessionId: target.sessionId } : {},
		...target.sessionKey ? { sessionKey: target.sessionKey } : {},
		...target.storePath ? { storePath: target.storePath } : {}
	})) selectedMessages.push(append);
	const appendedMessages = [];
	for (const append of selectedMessages) {
		const { shouldAppend: _shouldAppend, workerPreparation, ...appendOptions } = append;
		const result = await appendTranscriptMessage({
			...target.agentId ? { agentId: target.agentId } : {},
			...target.env ? { env: target.env } : {},
			...target.sessionId ? { sessionId: target.sessionId } : {},
			...target.sessionKey ? { sessionKey: target.sessionKey } : {},
			...target.storePath ? { storePath: target.storePath } : {}
		}, {
			...appendOptions,
			...workerPreparation,
			message: attachSessionTranscriptRunId(appendOptions.message, options.runId),
			...append.cwd ?? options.cwd ? { cwd: append.cwd ?? options.cwd } : {},
			...append.config ?? options.config ? { config: append.config ?? options.config } : {}
		});
		if (result) {
			const completion = completeSessionTranscriptCommit([result], options.onMessageCommitted);
			if (completion) await completion;
			appendedMessages.push(result);
		}
	}
	await rememberCommittedTranscriptMessageSequences(target, appendedMessages);
	return appendedMessages;
}
async function persistExpectedSessionTranscriptTurn(scope, options, preparedTarget) {
	const requestedSessionKey = scope.sessionKey?.trim();
	const expectedSessionId = options.expectedSessionId;
	const selectedScope = {
		...scope,
		sessionId: expectedSessionId
	};
	if (!getSessionActorStorageBinding(selectedScope)) {
		const assertOwned = captureOwnedTranscriptWriteAssertion(selectedScope);
		const assertCurrent = () => {
			assertOwned();
			options.assertCurrent?.();
		};
		const authority = {
			assertCurrent,
			authorize: assertCurrent
		};
		if (captureSessionActorStorageOwner(selectedScope, authority)) {
			const result = await withSessionActorStorage(selectedScope, {
				authority,
				lifetime: {
					assertCurrent,
					assertReadable: assertCurrent
				},
				create: Boolean(options.initialSessionEntry)
			}, () => persistExpectedSessionTranscriptTurn(scope, options, preparedTarget));
			if (!result) throw new IncognitoSessionMissingError();
			return result;
		}
	}
	const onCommittedSource = captureSessionTranscriptSourcePublication({
		...scope,
		sessionId: expectedSessionId
	});
	const { selectedSessionId, selectedLifecycleRevision, ...target } = preparedTarget ?? await prepareTranscriptTurnTarget({
		...scope,
		sessionId: expectedSessionId
	}, options.config);
	const ownerScope = {
		...target,
		sessionKey: requestedSessionKey ?? target.sessionKey
	};
	const inheritedWriterFence = getOwnedSessionTranscriptWriterFence({
		sessionFile: target.sessionKey,
		sessionKey: ownerScope.sessionKey,
		sessionTarget: ownerScope
	});
	const turn = await runWithOwnedSessionTranscriptWrite({
		sessionFile: target.sessionKey,
		sessionKey: ownerScope.sessionKey,
		sessionTarget: ownerScope
	}, () => appendExpectedSessionTranscriptTurn(target, {
		config: options.config,
		cwd: options.cwd,
		keyFormat: "agent-qualified",
		selectedSessionId,
		selectedLifecycleRevision,
		expectedLifecycleRevision: options.expectedLifecycleRevision !== void 0 ? options.expectedLifecycleRevision : inheritedWriterFence?.expectedLifecycleRevision,
		expectedWriterRunId: options.expectedWriterRunId ?? inheritedWriterFence?.expectedWriterRunId,
		expectedSessionState: options.expectedSessionState,
		assertCurrent: options.assertCurrent,
		acceptedResultGuard: options.acceptedResultGuard,
		expectedSessionId,
		initialSessionEntry: options.initialSessionEntry,
		atomicGroup: options.atomicGroup,
		messages: options.messages.map((append) => ({
			...append,
			message: attachSessionTranscriptRunId(append.message, options.runId)
		})),
		onMessageCommitted: options.onMessageCommitted,
		onCommittedSource,
		sessionLifecyclePatch: options.sessionLifecyclePatch,
		sessionTurnMutation: options.sessionTurnMutation,
		sessionFile: target.sessionKey,
		touchSessionEntry: options.touchSessionEntry
	}, ownerScope));
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
	if (turn.sessionEntry && scope.sessionStore) scope.sessionStore[target.sessionKey] = turn.sessionEntry;
	return {
		sessionTurnMutationResult: turn.sessionTurnMutationResult,
		predicateSkipped: turn.predicateSkipped,
		appendedCount: turn.appendedMessages.filter((message) => message.appended).length,
		messages: turn.appendedMessages,
		sessionEntry: turn.sessionEntry ?? scope.sessionEntry
	};
}
async function prepareTranscriptTurnTarget(scope, config) {
	const sessionKey = scope.sessionKey?.trim();
	if (!sessionKey || !scope.sessionId) throw new Error("Cannot persist a transcript turn without a session key and session id");
	const memory = getSessionActorStorageBinding(scope);
	if (memory) return {
		...await resolveSessionTranscriptRuntimeTarget({
			...scope,
			agentId: memory.agentId,
			sessionKey: memory.actor.target.sessionKey,
			sessionId: scope.sessionId,
			storePath: memory.path
		}, config, { keyFormat: "agent-qualified" }),
		storePath: memory.path,
		env: scope.env
	};
	const effectiveConfig = config ?? getRuntimeConfigSnapshot() ?? await captureRuntimeConfigAsyncReader()();
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
		...await resolveSessionTranscriptRuntimeTarget(binding, effectiveConfig, { keyFormat: "agent-qualified" }),
		storePath: binding.storePath,
		env: binding.env
	};
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
//#region src/config/sessions/session-actor-transcript-reports.ts
async function withMemoryReportWorker(scope, binding, run) {
	const target = withOwnedSessionTranscriptWriterFence(scope);
	const targetScope = {
		...target,
		agentId: binding.agentId,
		storePath: binding.path,
		sessionId: target.sessionId ?? binding.actor.snapshot(binding.authority)?.entry?.sessionId
	};
	if (!targetScope.sessionId) throw new Error("Transcript report requires its selected session window");
	const fenced = {
		...targetScope,
		sessionId: targetScope.sessionId
	};
	const assertOwned = captureOwnedTranscriptWriteAssertion(fenced);
	const authority = {
		...binding.authority,
		assertCurrent() {
			binding.authority.assertCurrent();
			binding.actor.assertReadable();
			assertOwned();
		}
	};
	let version;
	const commit = async (type, input) => {
		const outcome = await binding.actor.storage.mutate({
			type,
			input
		}, authority);
		return readSessionActorStorageResult(outcome);
	};
	const commands = {
		prepare: async (selection) => {
			const selected = await binding.actor.storage.read({
				type: "session.report.prepare",
				input: {
					scope: fenced,
					selection
				}
			}, authority);
			if (!selected.ok) return selected;
			version = selected.value.version;
			return ok(selected.value.facts);
		},
		append: (report) => {
			if (!version) throw new Error("Transcript report requires its prepared selection");
			return commit("session.report.append", {
				scope: fenced,
				report,
				version
			});
		},
		assistant: (report) => commit("session.report.assistant", {
			scope: fenced,
			report
		}),
		abortedPartial: (report) => commit("session.report.abortedPartial", {
			scope: fenced,
			report
		})
	};
	const result = await run({ execute: ({ type, input }) => commands[type](input) }, () => authority.assertCurrent(), () => {});
	if (!result.ok && fenced.expectedWriterRunId !== void 0) throw new SessionTranscriptWriterClaimReboundError(result.error);
	return result;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-reports.ts
const log = createSubsystemLogger("sessions/transcript-reports");
async function settleReportOperation(operation, cleanup) {
	let result;
	try {
		result = ok(await operation());
	} catch (error) {
		result = err(error);
	}
	try {
		await cleanup();
	} catch (error) {
		if (!result.ok) throw createSqliteLifecycleAggregateError([result.error, error], "Transcript report and cleanup failed", result.error);
		try {
			log.warn(`Transcript report completed before cleanup failed: ${formatErrorMessage(error)}`);
		} catch {}
	}
	if (!result.ok) throw result.error;
	return result.value;
}
async function withReportWorker(scope, kind, run, sessionEntryCurrent) {
	const assertCaller = captureOwnedTranscriptWriteAssertion(scope);
	const authority = {
		assertCurrent: assertCaller,
		authorize: assertCaller
	};
	const namespace = captureSessionActorStorageOwner(scope, authority);
	if (namespace) {
		if (sessionEntryCurrent) throw new Error("A file session source cannot authorize a memory transcript report");
		const result = await withSessionActorStorage(scope, {
			authority,
			lifetime: {
				assertCurrent: assertCaller,
				assertReadable: assertCaller
			}
		}, (memory) => withMemoryReportWorker(scope, memory, run));
		if (result) return result;
		const refusal = resolveTranscriptAppendRefusal(void 0, {
			agentId: namespace.agentId,
			path: namespace.path,
			sessionKey: scope.sessionKey ?? "",
			sessionId: scope.sessionId ?? ""
		}, scope);
		if (scope.expectedWriterRunId !== void 0) throw new SessionTranscriptWriterClaimReboundError(refusal);
		return err(refusal);
	}
	const fenced = withOwnedSessionTranscriptWriterFence({
		...scope,
		...scope.storePath ? { storePath: path.resolve(scope.storePath) } : {},
		env: captureSessionTranscriptStorageEnvironment(scope.env ?? process.env)
	});
	const assertOwned = captureOwnedTranscriptWriteAssertion(fenced);
	assertSqliteTranscriptWriteIdentity(fenced);
	assertOwned();
	const source = sessionEntryCurrent?.source;
	const storePath = fenced.storePath ?? resolveOpenClawAgentSqlitePath(toDatabaseOptions(resolveSqliteScope(fenced)));
	const candidates = captureSessionStoreReadCandidates(storePath);
	const identities = captureSessionStoreCandidateIdentities(candidates);
	const sourceIdentity = source ? readDatabasePathIdentitySync(source.path) : void 0;
	const assertSourceCurrent = () => {
		if (!source) return;
		assertExistingDatabaseIdentity(source.path, `file:${source.databaseIdentity}`, source.databaseBirthtime);
	};
	assertSourceCurrent();
	const targetScope = {
		...fenced,
		storePath
	};
	const admission = resolveSqliteWriteAdmissionScope(targetScope);
	const prepare = async () => {
		const resolved = captureLifecycleDatabaseScope({
			...await prepareSqliteScope(targetScope),
			sessionId: fenced.sessionId
		});
		if (admission && resolved.path !== admission.path) throw new Error("Transcript report preparation changed its reserved database path");
		const databaseOptions = toDatabaseOptions(resolved);
		const options = {
			...databaseOptions,
			path: resolveOpenClawAgentSqlitePath(databaseOptions)
		};
		const physicalPath = assertSessionStoreReadCandidate(options.path, candidates);
		if (source && (resolved.sessionKey !== source.sessionKey || databaseOptions.agentId !== source.agentId || physicalPath !== sourceIdentity?.canonicalPath)) throw new Error("Transcript report target differs from its session source restriction");
		const identity = identities.get(physicalPath) ?? readDatabasePathIdentitySync(options.path);
		if (!identities.has(physicalPath) && identity.key.startsWith("file:")) throw new Error("Transcript report target appeared after source capture");
		const assertTargetCurrent = () => {
			assertSourceCurrent();
			assertSessionStoreReadCandidate(options.path, candidates);
			if (identity.key.startsWith("file:")) assertExistingDatabaseIdentity(options.path, identity.key, identity.birthtime);
			assertOwned();
		};
		assertTargetCurrent();
		const operate = async () => {
			assertTargetCurrent();
			const execution = captureOpenClawAgentDatabaseExecution(options, identity.key.startsWith("file:") ? { expectedIdentity: {
				kind: "file",
				physicalIdentity: identity.key.slice(5),
				nativeLocation: identity.canonicalPath,
				birthtime: identity.birthtime
			} } : { expectedCreationIdentity: identity });
			const cliWriter = kind === "append" ? getCliHistoryWriter({
				...resolved,
				storePath: resolveOpenClawAgentSqlitePath(options)
			}) : void 0;
			const assertCurrent = () => {
				execution.assertCurrent();
				assertTargetCurrent();
				cliWriter?.assertCurrent();
			};
			const { env: _env, ...workerResolved } = resolved;
			const target = {
				resolved: workerResolved,
				sessionEntryCurrentSource: sessionEntryCurrent?.source,
				...cliWriter ? { cliWriter: {
					runId: cliWriter.runId,
					authFingerprint: cliWriter.authFingerprint,
					lifecycleRevision: cliWriter.lifecycleRevision
				} } : {},
				fence: {
					expectedLifecycleRevision: fenced.expectedLifecycleRevision,
					expectedWriterRunId: fenced.expectedWriterRunId
				}
			};
			try {
				const result = await settleReportOperation(async () => {
					await prepareSessionEntryReplacementDatabase(options, assertCurrent, execution);
					assertCurrent();
					const databaseIdentity = execution.fileIdentity?.physicalIdentity;
					if (!databaseIdentity) throw new Error("Transcript report has no prepared native database identity");
					const worker = await openOpenClawAgentSqliteWorkerStore(options, { execution }, {
						moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionTranscriptReports),
						input: target,
						assertAdmission: (request) => request.stage === "transaction" || request.stage === "commit" ? assertSessionEntryCurrentAdmission(request, sessionEntryCurrent) : request
					});
					return settleReportOperation(() => worker.run((operation) => run(operation, assertCurrent, (publication) => {
						if (publication.cliHistoryChanged || publication.sessionEntryChanged) publishSessionEntryWorkerMetadataInvalidation({
							agentId: resolved.agentId,
							storePath: execution.path,
							databaseIdentity,
							sessionKey: resolved.sessionKey,
							entry: publication.entry
						});
						if (publication.projectionNeedsReconcile) startSessionTranscriptIndexReconcile({
							...options,
							preferredSessionId: resolved.sessionId
						});
					}), assertCurrent), () => worker.close());
				}, () => execution.release());
				if (!result.ok && fenced.expectedWriterRunId !== void 0) throw new SessionTranscriptWriterClaimReboundError(result.error);
				return result;
			} catch (error) {
				if (error instanceof Error && error.name === "SyntaxError") throw new SyntaxError(error.message, { cause: error });
				throw error;
			}
		};
		return admission ? operate() : runExclusiveSqliteSessionWrite(resolved, operate, "session.transcript.report");
	};
	return admission ? runExclusiveSqliteSessionWrite(admission, prepare, "session.transcript.report") : prepare();
}
/** Fills a hot transcript only when its settled registered producer left no authoritative answer. */
async function appendAbortedSessionTranscriptPartial(scope, partial) {
	const publicationScope = {
		...scope,
		env: captureSessionTranscriptStorageEnvironment(scope.env ?? process.env)
	};
	const { config, ...input } = partial;
	const preparedMessage = prepareTranscriptMessageAppend({
		message: attachSessionTranscriptRunId(partial.message, partial.runId),
		config
	});
	if (!preparedMessage || preparedMessage.persistedMessage.role !== "assistant") throw new Error("Aborted partial requires prepared assistant storage bytes");
	const settlement = await withReportWorker(publicationScope, "append", async (operation, _assertCurrent, publish) => {
		const result = await operation.execute({
			type: "abortedPartial",
			input: {
				...input,
				message: preparedMessage.persistedMessage,
				preparedMessage
			}
		});
		if (!result.ok) return result;
		const receipt = result.value.abortedPartial;
		if (!receipt) throw new Error("Aborted partial worker returned no settlement receipt");
		publish(result.value);
		return ok(receipt);
	});
	if (settlement.ok && !settlement.value.skipped && settlement.value.append.appended) {
		const { append, lifecycleRevision, messageSeq } = settlement.value;
		await publishTranscriptUpdate(publicationScope, {
			lifecycleRevision,
			messageSeq,
			message: append.message,
			messageId: append.messageId,
			runId: input.runId
		});
	}
	return settlement;
}
/** Reads the latest matching custom report from the active branch in one snapshot. */
async function readLatestSessionTranscriptReport(scope, customTypes) {
	const selectedTypes = [...customTypes];
	return withReportWorker(scope, "read", async (operation, assertCurrent) => {
		const prepared = await operation.execute({
			type: "prepare",
			input: {
				kind: "custom",
				customTypes: selectedTypes
			}
		});
		assertCurrent();
		return prepared.ok ? ok(prepared.value.latest) : prepared;
	});
}
/** Selects and appends one report against the same authoritative branch revision. */
async function appendSessionTranscriptReport(scope, report, options) {
	if (report.kind === "assistant") {
		const preparedMessage = prepareTranscriptMessageAppend({ message: applyAssistantDeliveryDirectives(report.message) });
		if (!preparedMessage) throw new Error("Assistant report requires prepared transcript storage bytes");
		const input = {
			...report,
			message: preparedMessage.persistedMessage,
			preparedMessage
		};
		return withReportWorker(scope, "append", async (operation, _assertCurrent, publish) => {
			const result = await operation.execute({
				type: "assistant",
				input
			});
			if (!result.ok) return result;
			publish(result.value);
			return ok(void 0);
		}, options?.sessionEntryCurrent);
	}
	const selection = {
		kind: report.kind,
		customTypes: [...report.customTypes]
	};
	const selectReport = report.selectReport;
	return withReportWorker(scope, "append", async (operation, assertCurrent, publish) => {
		for (let attempt = 0; attempt < 3; attempt++) {
			const prepared = await operation.execute({
				type: "prepare",
				input: selection
			});
			assertCurrent();
			if (!prepared.ok) return prepared;
			if (prepared.value.suppressed) return ok(void 0);
			const selected = selectReport(prepared.value.latest);
			assertCurrent();
			if (!selected) return ok(void 0);
			const input = prepareCustomTranscriptReport(selected, prepared.value.appendParentId);
			assertCurrent();
			const result = await operation.execute({
				type: "append",
				input
			});
			if (!result.ok) return result;
			if (result.value.committed) {
				publish(result.value);
				return ok(void 0);
			}
		}
		throw new Error("Session transcript kept changing while selecting its report");
	}, options?.sessionEntryCurrent);
}
//#endregion
export { withSessionPendingInputPersistence as A, runSessionCollaborationWrite as C, readSessionSubmittedInput as D, prepareSessionPendingInputDedupeRecovery as E, recoverSessionTranscriptProjection as F, readPendingInputSource as M, normalizeMessageClientSources as N, readWithdrawnSessionPendingInputId as O, readSessionPendingInputReceiptsInWorker as P, removeSessionMemberInWorker as S, bindSessionPendingInputSources as T, scanDoctorSessionEntriesTolerant as _, persistSessionTranscriptTurn as a, publishSessionCollaborationChanges as b, rewritePreparedAssistantTranscriptMessageForRun as c, persistCompactionBoundaryWithSessionEntryAsync as d, readTranscriptStatsAsync as f, scanDoctorSessionEntriesStrict as g, loadCanonicalSessionRepairEntries as h, appendTranscriptMessages as i, preparePendingInputStore as j, stageSessionPendingInput as k, rewritePreparedTranscriptMessageAtAnchor as l, listCanonicalSessionRepairFacts as m, appendSessionTranscriptReport as n, preflightSessionTranscriptForManualCompact as o, listSessionBranches as p, readLatestSessionTranscriptReport as r, trimSessionTranscriptForManualCompact as s, appendAbortedSessionTranscriptPartial as t, hasSessionTranscriptMessage as u, updateSessionProfileInvolvementAsync as v, recoverSessionEntryFromRestartTombstone as w, recordSessionParticipantInWorker as x, addSessionMemberInWorker as y };
