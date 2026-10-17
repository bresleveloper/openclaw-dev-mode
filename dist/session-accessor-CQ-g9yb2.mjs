import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as extractErrorCode, r as collectNestedErrorCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as runInDetachedAsyncContext, c as trackAsyncWork } from "./async-work-scope-BYeX3gh6.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import "./src-CdRlGRnW.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DoBSDhBS.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { i as executeSqliteQueryTakeFirstSync, o as iterateSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as assertExistingDatabaseIdentity, u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { t as SessionPendingInputCustodyError } from "./session-pending-input-custody-error-fcZzzQWk.mjs";
import { L as ensureSessionGoalOperationsSchema, v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-x2MmUEok.mjs";
import { c as SqliteWorkerError, d as retainSqliteWorkerErrorCode, l as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { T as tryResolveLegacyCompatibilityAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-CDYpzA0r.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey, l as resolveAgentIdFromSessionKey, o as classifySessionKeyShape } from "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { c as resolveOpenClawAgentSqlitePath, i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { r as resolvePersistedSessionStoreOwnerForTarget } from "./session-store-owner-CnfJSmam.mjs";
import "./legacy.default-agent-owner-CiZjlN5C.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { l as getAgentEventLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-GvNTkbe3.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./io-B0OAIqw3.mjs";
import { o as normalizeGatewayClientId, s as normalizeGatewayClientMode } from "./client-info-C8RatpKO.mjs";
import { c as deferOpenClawAgentPostCommitPublication } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { a as getOpenClawAgentDatabaseIfOpen, f as withOpenClawAgentDatabaseAsync, s as openOpenClawAgentDatabase, u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { n as sessionEntrySnapshotColumns, t as attachSessionEntrySnapshots } from "./session-entry-snapshots-DO3oGsuC.mjs";
import { b as findSessionTranscriptHeader, s as transcriptEventJsonSql } from "./transcript-payload-Yc_w8Yx5.mjs";
import { c as resolveTerminalAssistantTranscriptRunId, n as emitSessionTranscriptUpdate, o as readSessionTranscriptRunId, t as attachSessionTranscriptRunId } from "./transcript-events-DUHAZLVw.mjs";
import { n as runOpenClawAgentWorkerWrite, r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-CKOCIcah.mjs";
import { n as assertSessionEntryCurrentAdmission } from "./session-entry-current-admission-Cvdu1qxp.mjs";
import { c as normalizeSessionDeliveryState } from "./delivery-context.shared-PF5njaoI.mjs";
import { t as getCliHistoryWriter } from "./cli-history-boundary-CwwMqsE-.mjs";
import { n as captureSessionTranscriptTargetBinding, r as sameSessionTranscriptStorageEnvironment, t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-WjVavOYj.mjs";
import { c as runWithOwnedSessionTranscriptWrite, i as captureOwnedTranscriptWriteAssertion, n as assertOwnedTranscriptWriteCommit, o as getOwnedSessionTranscriptInitialWriter, s as getOwnedSessionTranscriptWriterFence, t as SessionTranscriptWriterClaimReboundError, u as withOwnedSessionTranscriptWriterFence } from "./transcript-write-context-m7NE2aEm.mjs";
import { u as readUserProfileAliases } from "./user-profile-list-CtETKur7.mjs";
import "./user-profiles-DYQbtiqy.mjs";
import { n as supportsOpenClawAgentDatabaseExecution, t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { t as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-DpPONdtx.mjs";
import { n as withOpenClawAgentDatabaseReadOnly, t as retainOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { s as assertSessionStoreReadCandidate } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { a as normalizeStoreSessionKey, c as resolveSessionStoreEntryCore, t as collectSessionEntryLookupKeys } from "./store-entry-Bb_svqyv.mjs";
import { i as toDatabaseOptions, r as resolveSqliteSessionKey, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { a as prepareSqliteTranscriptReadScope, d as resolveSqliteTranscriptScope, f as resolveSqliteWriteAdmissionScope, i as prepareSqliteScope, m as transcriptWriteScopeIsCurrent, n as captureLifecycleDatabaseScope, p as runExclusiveSqliteSessionWrite, s as resolveSqliteScope, t as assertSqliteTranscriptWriteIdentity, u as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { r as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-DP2BCaGd.mjs";
import { l as markSessionTranscriptIndexDirtyInTransaction, u as reconcileSessionTranscriptIndexInTransaction } from "./session-transcript-index-FbEuN6S5.mjs";
import { l as scanSessionTranscriptTree, m as selectSessionTranscriptTreeTipNodes, n as isSessionTranscriptLeafControl, p as selectSessionTranscriptTreePathNodes } from "./transcript-tree-CaYJo8Xs.mjs";
import { d as withSessionHistoryWorkerReadCandidates, s as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-CTwaPfeT.mjs";
import { n as projectSqliteSessionOwner } from "./session-accessor.sqlite-owner-projection-EwCluh1i.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-CPayZwJR.mjs";
import { i as projectCanonicalSessionEntryShape } from "./store-entry-shape-BzuAi3ao.mjs";
import { r as parseSessionEntryJson } from "./session-accessor.sqlite-status-zTXzk4Sy.mjs";
import { h as publishSessionSharingMemberChange, m as publishSessionEntryWorkerMetadataInvalidation, t as discardCommittedSessionEntryCache, y as retainSessionEntryWorkerPublication } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { f as scanCanonicalSqliteSessionEntries, u as readWithCanonicalSessionAdmission } from "./session-canonical-key-D1TSJMmX.mjs";
import { a as readExactSessionEntryRow, l as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { n as assertSessionTranscriptHot, t as SessionTranscriptColdError } from "./session-cold-storage-state-CzcE3h3O.mjs";
import { i as resolveSqliteSessionTranscriptReadFence, r as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-DfxRHzep.mjs";
import "./session-accessor.sqlite-owner-ylhcUaWK.mjs";
import { n as emitSessionLifecycleEvent } from "./session-lifecycle-events-qdejgRzS.mjs";
import { n as buildSessionCreationStamp } from "./session-entry-provenance-Bfs2J1E7.mjs";
import { n as removeSessionMember, r as recordSessionParticipant, t as addSessionMember } from "./session-sharing-store.native-Z8tyX-6b.mjs";
import { T as withSqliteSessionContextReset, d as writeSessionEntry, s as readSessionIdentitySnapshot, w as runSqliteSessionDeletionTransaction, x as commitSqliteSessionDeletion } from "./session-accessor.sqlite-entry-store-Ca60AZ39.mjs";
import { _ as runWithSessionPendingInputPersistence, a as hasRegisteredSessionPendingInputOwner, c as prepareCurrentSessionPendingInputDedupeRecovery, g as runWithSessionPendingInput, l as projectSessionPendingInput, m as releaseSessionPendingInputOwner, n as captureSessionPendingInputWorkerCustody, o as isFinalInputCompletion, p as registerSessionPendingInputOwner, s as parseSessionPendingInputMessage, t as assertRegisteredSessionPendingInputOwner } from "./session-accessor.sqlite-pending-inputs-DtDOOibA.mjs";
import "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import { t as createSessionTranscriptHeader } from "./transcript-header-CyuYZIZn.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-Dj6Sq0En.mjs";
import "./session-accessor.sqlite-history-De4L8VNW.mjs";
import { a as publishCommittedSessionIdentity, r as prepareSessionIdentityPublication } from "./session-accessor.sqlite-identity-DY_MUUYo.mjs";
import { p as publishTranscriptUpdate } from "./session-history-eviction-D6jaTF6N.mjs";
import { d as rewriteSqliteTranscriptEventRowsInTransaction, l as redactTranscriptMessageForStorage, n as appendTranscriptEventsInTransaction } from "./session-accessor.sqlite-transcript-store-Bqsq62BI.mjs";
import { c as readTranscriptGenerationInTransaction, i as ensureTranscriptSessionRoot } from "./session-accessor.sqlite-transcript-state-xJ1TJ9j2.mjs";
import { n as readRestoredSessionTranscript } from "./session-cold-storage-read-CfuaO6_K.mjs";
import { C as readTranscriptStatsSync, b as readTranscriptIdentityByEventId, c as loadTranscriptEventsFromDatabase, l as loadTranscriptEventsSync, r as findTranscriptEventInDatabase } from "./session-accessor.sqlite-read-8qBtzC-z.mjs";
import { t as readMessageIdempotencyKey } from "./transcript-message-identity-0wQEn3Eb.mjs";
import { a as withSessionEntryWorker, r as prepareSessionEntryReplacementDatabase } from "./session-accessor.sqlite-replacement-worker-9fiwLkM3.mjs";
import "./session-accessor.sqlite-active-events-urwlgpH5.mjs";
import { t as readSessionTranscriptHotWatermark } from "./session-accessor.sqlite-transcript-watermark-read-CRApP3Oa.mjs";
import "./session-accessor.sqlite-transcript-watermark-D3Is2Kik.mjs";
import { n as runSessionEntryWorkerOperation } from "./session-entry-patch-geetJjjX.mjs";
import "./session-entry-read-runtime-B3Aup1sL.mjs";
import "./session-accessor.entry-8r2jOQkD.mjs";
import "./session-accessor.sqlite-pending-input-receipts-Dg_2HSQ9.mjs";
import "./server-constants-BH_EolwD.mjs";
import "./session-accessor.sqlite-entry-availability-e5MoUhsa.mjs";
import { b as inheritSessionSelection, c as updateSessionEntry } from "./session-accessor.reset-Bn2-AwEV.mjs";
import { o as assertModelSelectionUnlocked } from "./model-overrides-uZFvcSRc.mjs";
import "./session-accessor.sqlite-transcript-anchor-eRtZH9vP.mjs";
import "./session-transcript-maintenance-read-CU6EhS7B.mjs";
import { a as readSessionBranchSnapshot, i as readCachedSessionBranchSummaries, n as cloneSessionBranchSummaries, r as invalidateSessionBranchCache, s as extractEditorText, t as cacheSessionBranchSummaries } from "./session-accessor.sqlite-branches-D5RjwRvh.mjs";
import { i as readMessageWorkContext } from "./work-context-Cn4SLmAO.mjs";
import { n as prepareTranscriptMessageAppend } from "./session-accessor.sqlite-transcript-message-append-J9plH1Sq.mjs";
import { f as trimTranscriptForManualCompact, i as appendTranscriptMessage } from "./session-accessor.sqlite-transcript-write-CPk6xFA-.mjs";
import { n as readCommittedTranscriptMessageSequence, r as rememberCommittedTranscriptMessageSequences, t as installCommittedTranscriptMessageSequences } from "./session-accessor.sqlite-transcript-sequences-BVG-PGVB.mjs";
import { i as resolveTranscriptAppendRefusal } from "./session-accessor.sqlite-transcript-write-guard-Dit9k70E.mjs";
import { a as persistCompactionBoundaryWithSessionEntrySync } from "./session-accessor.sqlite-metadata-read-Dij1AT2k.mjs";
import { n as normalizeRawDeltaLimits, r as readRawDeltaInTransaction } from "./session-accessor.sqlite-raw-delta-read-DBQnPz7-.mjs";
import "./session-transcript-match-BWyx9fu4.mjs";
import { a as readSessionGoalOperationReceipt, i as readSessionGoalOperationInDatabase, n as assertSessionGoalOperationTime } from "./goals-operations-BofIFvAE.mjs";
import { n as prepareSessionTurnPredicates, r as prepareSessionTurnRouting } from "./session-turn-predicate-C3pbz2vZ.mjs";
import { n as prepareSessionTurnGoalMessage, r as sqliteSessionTranscriptTurnRebound, t as createSessionTranscriptTurnKernel } from "./session-turn.kernel-DMv2fk8b.mjs";
import { a as resolveSessionTranscriptRuntimeTarget } from "./session-accessor.transcript-target-CAOPCw68.mjs";
import "./session-accessor.sqlite-model-context-BsF77Klz.mjs";
import { t as applyAssistantDeliveryDirectives } from "./transcript-assistant-delivery-Dcmz1NrH.mjs";
import { i as prepareTranscriptReportSelection, n as appendSelectedTranscriptReportInTransaction, r as prepareCustomTranscriptReport, t as appendAbortedSessionTranscriptPartialInTransaction } from "./session-accessor.sqlite-transcript-reports.kernel-CoNAoLug.mjs";
import "./session-accessor.sqlite-participant-read-08BSu6BD.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { createHash, randomUUID } from "node:crypto";
import { isMainThread } from "node:worker_threads";
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
//#region src/config/sessions/session-pending-input-source.ts
async function readPendingInputSource(scope, idempotencyKey, pendingOnly) {
	const captured = {
		...scope,
		env: captureSessionTranscriptStorageEnvironment(scope.env ?? process.env)
	};
	const logical = resolveSqliteScope({
		...captured,
		storePath: void 0
	});
	const input = {
		kind: "source",
		sessionKey: logical.sessionKey,
		sessionId: captured.sessionId,
		idempotencyKey,
		pendingOnly
	};
	if (isIncognitoSessionKey(captured.sessionKey)) {
		const options = toDatabaseOptions(resolveSqliteScope(captured));
		const database = getOpenClawAgentDatabaseIfOpen(options);
		if (!database) return;
		const assertCurrent = () => {
			if (getOpenClawAgentDatabaseIfOpen(options) !== database || !database.db.isOpen) throw new Error("Submitted input lost its incognito database owner");
		};
		const { readPendingInputSourceInDatabase } = await import("./session-pending-input-source.kernel-CbeeYGiV.mjs");
		assertCurrent();
		return {
			path: database.path,
			snapshot: readPendingInputSourceInDatabase(database, input),
			assertCurrent
		};
	}
	const storePath = logical.path ?? captured.storePath ?? resolveOpenClawAgentSqlitePath(toDatabaseOptions(logical));
	const candidates = captureSessionStoreReadCandidates(storePath);
	const identities = new Map(candidates.filter((candidate) => !candidate.scope).map((candidate) => {
		const identity = readDatabasePathIdentitySync(candidate.path);
		return [identity.canonicalPath, identity];
	}));
	const resolved = await prepareSqliteScope(captured);
	const options = toDatabaseOptions(resolved);
	const path = resolveOpenClawAgentSqlitePath(options);
	const identity = identities.get(assertSessionStoreReadCandidate(path, candidates));
	if (!identity) throw new Error("Submitted input changed its captured database owner");
	if (!identity.key.startsWith("file:")) return;
	const assertCurrent = () => {
		assertSessionStoreReadCandidate(path, candidates);
		assertExistingDatabaseIdentity(path, identity.key, identity.birthtime);
	};
	assertCurrent();
	const snapshot = await withSessionHistoryWorkerDatabase({
		...options,
		path
	}, (owner) => owner.readPendingInputSource({
		input: {
			...input,
			sessionKey: resolved.sessionKey
		},
		env: captured.env,
		source: {
			agentId: options.agentId,
			path,
			databaseIdentity: identity.key.slice(5),
			databaseBirthtime: identity.birthtime
		}
	}));
	assertCurrent();
	return {
		path: identity.canonicalPath,
		snapshot,
		assertCurrent
	};
}
//#endregion
//#region src/config/sessions/session-pending-input-store.ts
async function preparePendingInputStore(scope, assertCurrent) {
	const captured = {
		...scope,
		env: captureSessionTranscriptStorageEnvironment(scope.env ?? process.env)
	};
	const incognito = isIncognitoSessionKey(captured.sessionKey);
	const logical = resolveSqliteScope({
		...captured,
		storePath: void 0
	});
	const storePath = logical.path ?? captured.storePath ?? resolveOpenClawAgentSqlitePath(toDatabaseOptions(logical));
	const candidates = incognito ? [] : captureSessionStoreReadCandidates(storePath);
	const identities = new Map(candidates.filter((candidate) => !candidate.scope).map((candidate) => {
		const identity = readDatabasePathIdentitySync(candidate.path);
		return [identity.canonicalPath, identity];
	}));
	const resolved = await prepareSqliteScope(captured);
	assertCurrent();
	const options = {
		...toDatabaseOptions(resolved),
		path: resolveOpenClawAgentSqlitePath(toDatabaseOptions(resolved))
	};
	const identity = incognito ? void 0 : identities.get(assertSessionStoreReadCandidate(options.path, candidates));
	if (!incognito && (!identity || !identity.key.startsWith("file:"))) throw new Error("Pending input changed its captured database owner");
	const assertSource = () => {
		if (identity) {
			assertSessionStoreReadCandidate(options.path, candidates);
			assertExistingDatabaseIdentity(options.path, identity.key, identity.birthtime);
		}
	};
	const { readPendingInput, mutatePendingInput } = await import("./session-pending-input-operations.kernel-0IFDMFgF.mjs");
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
		assertCurrent: assertOpen,
		withAdmission(operation, reentrant) {
			let entered = false;
			return runOpenClawAgentWriteAdmission(options, () => {
				entered = true;
				return operation();
			}, reentrant).catch((error) => {
				if (!entered) unregister();
				throw error;
			});
		},
		sessionKey: resolved.sessionKey,
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
				if (incognito) return readPendingInput(openOpenClawAgentDatabase(options), input);
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
				if (incognito) {
					const result = nativeMutation(input, guard);
					publish?.();
					return result;
				}
				let admitted;
				const readReceipt = (facts) => {
					if (!isRecord(facts) || facts.kind !== "pending-input-settlement" || facts.operation !== input.kind || facts.sessionKey !== input.sessionKey || facts.sessionId !== input.sessionId || facts.idempotencyKey !== input.idempotencyKey || facts.runId !== input.runId || facts.requestHash !== input.requestHash || facts.lifecycleGeneration !== input.lifecycleGeneration) return;
					return facts;
				};
				const checkGrant = (stage, facts) => {
					if (!isRecord(facts) || !isRecord(facts.publication) || facts.publication.kind !== "pending-input-settlement-custody") return;
					guard(stage, facts.publication);
				};
				return withSessionEntryWorker(options, identity?.key.slice(5), assertOpen, async (execution, source) => {
					const result = await execution.runExisting(source, async (worker) => {
						const outcome = await worker.execute({
							type: "session.pendingInputs.mutate",
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
							const receipt = readReceipt(admitted.admission.committed?.facts);
							if (admitted.admission.settlement?.kind === "completed" && receipt) {
								if (publish) assertOpen();
								publish?.();
								return receipt;
							}
							if (admitted.admission.settlement?.kind !== "completed") throw new SqliteWorkerError("Pending input native commitment is unknown; do not replay", "outcome-unknown");
						}
						if (!outcome.ok) throw outcome.error;
						throw new SqliteWorkerError("Pending input has no confirmed native completion and commit receipt", "outcome-unknown");
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
//#region src/config/sessions/session-pending-input-history.ts
function owns(path, row, currentSessionId) {
	return row.session_id === currentSessionId && hasRegisteredSessionPendingInputOwner(path, row);
}
function admitCustody(path, stage, facts) {
	const protectedRows = facts.protected ? new Int32Array(facts.protected) : void 0;
	if (stage === "transaction" && protectedRows?.length !== facts.candidates.length) throw new Error("Pending input history omitted its live custody response");
	facts.candidates.forEach((row, index) => {
		const protectedInput = owns(path, row, facts.currentSessionId);
		if (protectedRows) Atomics.store(protectedRows, index, protectedInput ? 1 : 0);
		else if (protectedInput) throw new Error("Pending input acquired live custody before interruption committed");
	});
}
function applyReceipt(snapshot, receipt) {
	const interrupted = new Set(receipt.ids);
	for (const row of snapshot.rows) if (interrupted.has(row.input_id)) row.state = "interrupted";
	return snapshot;
}
/** Incognito retains its process-held owner until the separate actor cutover (worker-access P7). */
async function readIncognito(scope, query) {
	const resolved = resolveSqliteScope(scope);
	const options = toDatabaseOptions(resolved);
	const captured = getOpenClawAgentDatabaseIfOpen(options);
	if (!captured) return {
		rows: [],
		total: 0
	};
	const { readPendingInputHistoryInDatabase } = await import("./session-pending-input-history.kernel-D5imf4R8.mjs");
	const { interruptPendingInputHistoryInDatabase } = await import("./session-pending-input-history-reconcile-C-HBiSxK.mjs");
	if (getOpenClawAgentDatabaseIfOpen(options) !== captured || !captured.db.isOpen) throw new Error("Pending input history lost its incognito database owner");
	const capturedQuery = {
		...query,
		sessionKey: resolved.sessionKey
	};
	const read = withOpenClawAgentDatabaseReadOnly((database) => readPendingInputHistoryInDatabase(database, capturedQuery), options);
	if (!read.found) return {
		rows: [],
		total: 0
	};
	const snapshot = read.value;
	const path = resolveOpenClawAgentSqlitePath(options);
	const ids = snapshot.rows.filter((row) => row.state === "queued" && !owns(path, row, snapshot.currentSessionId)).map((row) => row.input_id);
	if (!ids.length) return snapshot;
	return applyReceipt(snapshot, interruptPendingInputHistoryInDatabase(openOpenClawAgentDatabase(options), options, {
		...capturedQuery,
		ids
	}, (stage, facts) => admitCustody(path, stage, facts), () => {}));
}
async function readPendingInputRows(scope, options) {
	const captured = {
		...scope,
		env: captureSessionTranscriptStorageEnvironment(scope.env ?? process.env)
	};
	const query = {
		...options,
		sessionKey: scope.sessionKey,
		sessionId: scope.sessionId
	};
	if (isIncognitoSessionKey(captured.sessionKey)) return readIncognito(captured, query);
	const logical = resolveSqliteScope({
		...captured,
		storePath: void 0
	});
	const storePath = logical.path ?? captured.storePath ?? resolveOpenClawAgentSqlitePath(toDatabaseOptions(logical));
	const candidates = captureSessionStoreReadCandidates(storePath);
	const identities = new Map(candidates.filter((candidate) => !candidate.scope).map((candidate) => {
		const identity = readDatabasePathIdentitySync(candidate.path);
		return [identity.canonicalPath, identity];
	}));
	const resolved = await prepareSqliteScope(captured);
	const databaseOptions = toDatabaseOptions(resolved);
	const path = resolveOpenClawAgentSqlitePath(databaseOptions);
	const identity = identities.get(assertSessionStoreReadCandidate(path, candidates));
	if (!identity) throw new Error("Pending input history changed its captured database owner");
	if (!identity.key.startsWith("file:")) return {
		rows: [],
		total: 0
	};
	const assertCurrent = () => {
		assertSessionStoreReadCandidate(path, candidates);
		assertExistingDatabaseIdentity(path, identity.key, identity.birthtime);
	};
	assertCurrent();
	const source = {
		agentId: databaseOptions.agentId,
		path,
		databaseIdentity: identity.key.slice(5),
		databaseBirthtime: identity.birthtime
	};
	return withSessionHistoryWorkerDatabase({
		...databaseOptions,
		path
	}, async (owner) => {
		const snapshot = await owner.readPendingInputHistory({
			query: {
				...query,
				sessionKey: resolved.sessionKey
			},
			env: captured.env,
			source
		});
		assertCurrent();
		const ids = snapshot.rows.filter((row) => row.state === "queued" && !owns(identity.canonicalPath, row, snapshot.currentSessionId)).map((row) => row.input_id);
		if (!ids.length) return snapshot;
		return runOpenClawAgentWorkerWrite({
			...databaseOptions,
			path
		}, async () => {
			assertCurrent();
			owner.assertCurrent();
			const execution = captureOpenClawAgentDatabaseExecution({
				...databaseOptions,
				path
			}, { expectedIdentity: {
				kind: "file",
				physicalIdentity: source.databaseIdentity,
				birthtime: identity.birthtime,
				nativeLocation: path
			} });
			let admitted;
			try {
				const result = await execution.runExisting({
					assertCurrent,
					createAdmission(binding) {
						return (retained) => {
							const admission = createSqliteWorkerOperationAdmission((request, grant) => {
								binding.authorize(request);
								assertCurrent();
								owner.assertCurrent();
								if (request.stage === "transaction" || request.stage === "commit") {
									const facts = isRecord(request.facts) ? request.facts.publication : void 0;
									if (!isRecord(facts) || facts.kind !== "pending-input-history-custody") throw new Error("Pending input history omitted custody facts");
									admitCustody(identity.canonicalPath, request.stage, facts);
									if (request.stage === "commit") admitted = {
										admission,
										retained
									};
								}
								if (!grant()) throw new Error("Pending input history authority expired");
							}, binding.attachment);
							return {
								nativeLocations: binding.nativeLocations,
								admission
							};
						};
					}
				}, async (worker) => {
					const outcome = await worker.execute({
						type: "session.pendingInputs.interruptHistory",
						input: {
							sessionKey: resolved.sessionKey,
							sessionId: captured.sessionId,
							ids
						}
					}).then(() => ({ ok: true }), (error) => ({
						ok: false,
						error
					}));
					if (admitted) {
						await admitted.retained.settled;
						const receipt = admitted.admission.committed?.facts;
						if (admitted.admission.settlement?.kind === "completed" && isRecord(receipt) && receipt.kind === "pending-input-history-interrupted") return applyReceipt(snapshot, receipt);
					}
					if (!outcome.ok) throw outcome.error;
					throw new SqliteWorkerError("Pending input history has no confirmed native completion and receipt", "outcome-unknown");
				});
				assertCurrent();
				if (!result) throw new Error("Pending input history lost its existing database");
				return result;
			} finally {
				await execution.release();
			}
		});
	});
}
async function listSessionPendingInputs(scope, options = {}) {
	const { rows, total, nextBefore } = await readPendingInputRows(scope, options);
	return {
		items: rows.toReversed().map(projectSessionPendingInput),
		total: total ?? 0,
		...nextBefore !== void 0 ? { nextBefore } : {}
	};
}
async function readSessionPendingInput(scope, id) {
	const row = (await readPendingInputRows(scope, {
		id,
		limit: 1
	})).rows[0];
	return row ? projectSessionPendingInput(row) : void 0;
}
//#endregion
//#region src/config/sessions/session-accessor.pending-inputs.ts
const receiptOwners = /* @__PURE__ */ new WeakMap();
function ownerReceipt(owner) {
	const receipt = {
		get state() {
			return owner.consumed || owner.sources?.every((source) => source.consumed) ? "consumed" : "queued";
		},
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
	const messageJson = JSON.stringify(redactTranscriptMessageForStorage(collectedMessage, { config: sources.at(-1)?.config }));
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
	const admission = resolveSqliteWriteAdmissionScope(captured);
	const stage = async () => {
		const store = await preparePendingInputStore(captured, options.assertCurrent);
		return store.withAdmission(() => stagePreparedPendingInput(captured, options, preparedRequest, lifecycleGeneration, store), admission !== void 0);
	};
	return admission ? runOpenClawAgentWriteAdmission(toDatabaseOptions(admission), stage) : stage();
}
async function stagePreparedPendingInput(scope, options, preparedRequest, lifecycleGeneration, store) {
	let retained = false;
	let finished = false;
	let owner;
	let completion;
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
		options.assertCurrent();
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
			lifecycleGeneration
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
			assertCompletion();
			completion = store.mutate(completionInput(outcome), assertCompletion).then((receipt) => {
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
				if (owner && !owner.consumed) await store.mutate({
					...settlementIdentity(),
					kind: "finish",
					inputId: owner.inputId,
					disposition
				}, () => assertRegisteredSessionPendingInputOwner(owner));
			};
			const ending = completion ? completion.catch((error) => {
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
				options.assertCurrent();
			}
			retained = true;
			return {
				state: "queued",
				inputId: committed.messageId,
				message: committed.message,
				run: (run) => {
					store.assertCurrent();
					if (finished) throw new SessionPendingInputCustodyError("Pending input ownership ended");
					options.assertCurrent();
					return run();
				},
				finish,
				...completionMethods
			};
		}
		const prepared = existing ? parseSessionPendingInputMessage(existing.message_json) : options.prepareMessageAfterIdempotencyCheck ? options.prepareMessageAfterIdempotencyCheck(message) : message;
		if (!prepared) return;
		const messageJson = existing?.message_json ?? JSON.stringify(redactTranscriptMessageForStorage(prepared, { config: options.config }));
		if (Buffer.byteLength(messageJson, "utf8") > 26214400) throw new Error("Approved pending input exceeds the Gateway payload limit");
		const inputId = existing?.input_id ?? randomUUID();
		owner = {
			inputId,
			transcriptInputId: inputId,
			sessionId: scope.sessionId,
			sessionKey: store.sessionKey,
			databasePath: store.path,
			workerDatabasePath: store.workerDatabasePath,
			idempotencyKey: identity.idempotencyKey,
			lifecycleGeneration,
			messageJson,
			config: options.config,
			assertCurrent: options.assertAdmittedCurrent ?? options.assertCurrent,
			...existing ? { restartRecovered: true } : {},
			finish
		};
		await store.mutate({
			...settlementIdentity(),
			kind: "stage",
			expected: snapshot,
			trackCompletion: options.trackCompletion === true,
			inputId,
			messageJson
		}, (_stage, facts) => {
			options.assertCurrent();
			assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
			assertUnowned(facts?.candidate);
		}, () => {
			options.assertCurrent();
			assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
			registerSessionPendingInputOwner(owner);
		});
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
		publication.begin(receipt.changedKeys, []);
	});
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
async function runSessionCollaborationWrite(scope, command, native, publish, assertCurrent = () => void 0, prepare, uncertainCategoryKeys) {
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
				if (mutationDispatched && !capturedCommand.type.startsWith("suggestion.") && !published && (resultReceived || collectNestedErrorCandidates(error).some((candidate) => extractErrorCode(candidate) === "outcome-unknown"))) {
					if (capturedCommand.type === "category.apply") discardCommittedSessionEntryCache(database.db);
					const categoryKeys = capturedCommand.type === "category.apply" ? uncertainCategoryKeys?.() : void 0;
					sessionChanges.emitBatch(categoryKeys ? categoryKeys.map((sessionKey) => ({
						storePath: location.storePath,
						sessionKey,
						factsInvalidated: "category"
					})) : [capturedCommand.type === "category.apply" ? {
						all: true,
						scope: { storePath: location.storePath },
						factsInvalidated: true
					} : {
						...location,
						factsInvalidated: true
					}]);
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
				scope: "session-entry",
				facts: {
					kind: "participants",
					projection: result.participants
				}
			});
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
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		...params.env ? { env: params.env } : {},
		sessionKey: sourceKey,
		...params.storePath ? { storePath: params.storePath } : {}
	});
	try {
		const retained = retainOpenClawAgentDatabaseReadOnly(toDatabaseOptions(resolved));
		if (!retained.found) return { status: "missing-session" };
		const { database, claim } = retained;
		const completion = createDeferredCore();
		const controller = new AbortController();
		let unregister = () => {};
		try {
			const selected = readSessionEntryRow(database, sourceKey)?.entry;
			if (!selected?.sessionId) return { status: "missing-session" };
			const expected = {
				sessionKey: sourceKey,
				sessionId: selected.sessionId,
				lifecycleRevision: selected.lifecycleRevision
			};
			const assertCurrent = () => {
				controller.signal.throwIfAborted();
				claim.assertCurrent();
			};
			unregister = registerOpenClawAgentDatabaseAsyncResource({
				agentId: database.agentId,
				path: database.path,
				revoke: () => controller.abort(/* @__PURE__ */ new Error("Session branch read was revoked")),
				close: () => completion.promise
			});
			const watermark = readSessionTranscriptHotWatermark(database, selected.sessionId);
			const cached = readCachedSessionBranchSummaries(database, selected.sessionId, watermark);
			let snapshot;
			if (cached) snapshot = {
				status: "ok",
				...watermark,
				branches: cached.branches
			};
			else if (typeof claim.identity === "symbol") snapshot = readSessionBranchSnapshot(database, expected);
			else {
				const request = {
					database: {
						agentId: database.agentId,
						path: database.path
					},
					databaseIdentity: claim.identity,
					...expected
				};
				const key = JSON.stringify([
					request,
					claim.incarnation,
					watermark
				]);
				snapshot = await getOrCreatePromise(pendingBranchReads, key, async () => {
					const { runSessionBranchSummaryWorkerRequest } = await import("./session-transcript-read-worker-runtime-BZjHXMae.mjs");
					const read = () => {
						assertCurrent();
						return runSessionBranchSummaryWorkerRequest(request, controller.signal);
					};
					try {
						return await read();
					} catch (error) {
						if (!(error instanceof SessionTranscriptColdError)) throw error;
						return readRestoredSessionTranscript({
							...params,
							agentId: resolved.agentId,
							sessionId: selected.sessionId
						}, read, { assertCurrent });
					}
				}, { evictOnSettled: true });
			}
			assertCurrent();
			const current = readSessionEntryRow(database, sourceKey)?.entry;
			if (current?.sessionId !== expected.sessionId || current.lifecycleRevision !== expected.lifecycleRevision) return { status: "failed" };
			if (snapshot.status !== "ok") return snapshot;
			cacheSessionBranchSummaries(database, selected.sessionId, snapshot);
			return {
				status: "ok",
				branches: cloneSessionBranchSummaries(snapshot.branches)
			};
		} finally {
			try {
				claim.release();
			} finally {
				completion.resolve();
				unregister();
			}
		}
	} catch {
		return { status: "failed" };
	}
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
	const canonicalSourceKey = normalizeStoreSessionKey(params.sessionKey);
	const sourceKey = normalizeStoreSessionKey(params.sessionStoreKey ?? params.sessionKey);
	const targetKey = mode === "fork" ? normalizeStoreSessionKey(params.targetKey ?? params.sessionKey) : sourceKey;
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
		const { restoreSessionColdTranscript } = await import("./session-cold-storage-C7VKIe8P.mjs");
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
			const identityKeys = uniqueStrings([...collectSessionEntryLookupKeys(sourceKey), ...collectSessionEntryLookupKeys(targetKey)]);
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
		}, toDatabaseOptions(resolved), { operationLabel: "session.transcript.message-cut" });
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
		...cut?.editorText ? { editorText: cut.editorText } : {},
		...cut?.editorAttachments ? { editorAttachments: cut.editorAttachments } : {},
		...cut?.editorMediaRefs ? { editorMediaRefs: cut.editorMediaRefs } : {}
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
	const options = toDatabaseOptions(resolveSqliteTranscriptScope(captured));
	const transcriptByteCompactionLatch = { ...params.transcriptByteCompactionLatch };
	return await trackAsyncWork(() => runOpenClawAgentWriteAdmission(options, async () => {
		assertCurrent();
		if (isIncognitoSessionKey(captured.sessionKey)) return persistCompactionBoundaryWithSessionEntrySync(captured, {
			prepared,
			transcriptByteCompactionLatch
		});
		const { withSessionMetadataWorker } = await runInDetachedAsyncContext(() => import("./session-manager-metadata-runtime-D4Yb0-JI.mjs"));
		assertCurrent();
		return await withOpenClawAgentDatabaseAsync(options, (database) => withSessionMetadataWorker(options, database, assertCurrent, async (worker) => {
			const { env: _env, ...target } = captured;
			const { env: _preparedEnv, ...preparedTarget } = prepared.scope;
			const receipt = await worker.execute({
				type: "session.transcript.compactionBoundary",
				input: {
					scope: target,
					prepared: {
						...prepared,
						scope: preparedTarget
					},
					transcriptByteCompactionLatch,
					...initialWriter && !initialWriter.committedFence ? { initialWriterRunId: initialWriter.writerRunId } : {}
				}
			});
			try {
				if (receipt.initialEntry?.fence) initialWriter?.recordCommitted(receipt.initialEntry.fence);
			} finally {
				if (receipt.initialEntry?.identity) publishCommittedSessionIdentity(captured.agentId, readOpenClawAgentDatabaseIdentity(database).identity, receipt.initialEntry.identity.previous, receipt.initialEntry.identity.current);
			}
			if (receipt.projectionNeedsReconcile) startSessionTranscriptIndexReconcile({
				...options,
				preferredSessionId: captured.sessionId
			});
			return receipt.committed;
		}), assertCurrent);
	}, true));
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
//#region src/config/sessions/session-transcript-events.ts
/** Load durable raw events through the existing full-transcript hydration owner. */
async function loadTranscriptEvents(scope) {
	const captured = {
		agentId: scope.agentId,
		clone: scope.clone,
		defaultAgentId: scope.defaultAgentId,
		hydrateSkillPromptRefs: scope.hydrateSkillPromptRefs,
		readConsistency: scope.readConsistency,
		sessionId: scope.sessionId,
		sessionKey: scope.sessionKey,
		sessionFile: scope.sessionFile,
		threadId: scope.threadId,
		maxEventBytes: scope.maxEventBytes,
		sessionEntry: scope.sessionEntry ? { sessionId: scope.sessionEntry.sessionId } : void 0,
		...scope.storePath ? { storePath: path.resolve(scope.storePath) } : {},
		env: captureSessionTranscriptStorageEnvironment(scope.env ?? process.env)
	};
	if (isIncognitoSessionKey(captured.sessionKey) || captured.storePath && isIncognitoOpenClawAgentSqlitePath(captured.storePath, {
		agentId: normalizeAgentId(captured.agentId ?? parseAgentSessionKey(captured.sessionKey)?.agentId ?? captured.defaultAgentId),
		env: captured.env
	})) return readRestoredSessionTranscript(captured, () => loadTranscriptEventsSync(captured));
	const storePath = captured.storePath ?? resolveOpenClawAgentSqlitePath(toDatabaseOptions(resolveSqliteTranscriptReadScope(captured)));
	const candidates = captureSessionStoreReadCandidates(storePath);
	const identities = new Map(candidates.filter((candidate) => !candidate.scope).map((candidate) => {
		const identity = readDatabasePathIdentitySync(candidate.path);
		return [identity.canonicalPath, identity];
	}));
	const context = captureOpenClawStateReadWorkerContext({ env: captured.env });
	const assertStateCurrent = () => {
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
	};
	return withSessionHistoryWorkerReadCandidates(candidates, async (discovery) => {
		const target = await prepareSqliteTranscriptReadScope(captured);
		assertStateCurrent();
		discovery.assertCurrent();
		const options = toDatabaseOptions(target);
		const databasePath = resolveOpenClawAgentSqlitePath(options);
		const identity = identities.get(assertSessionStoreReadCandidate(databasePath, candidates));
		if (!identity) {
			if (!readDatabasePathIdentitySync(databasePath).key.startsWith("file:")) return [];
			throw new Error("Transcript events changed their captured database owner");
		}
		const assertSourceCurrent = () => {
			assertStateCurrent();
			discovery.assertCurrent();
			assertSessionStoreReadCandidate(databasePath, candidates);
			const current = readDatabasePathIdentitySync(databasePath);
			if (current.key !== identity.key || current.birthtime !== identity.birthtime) throw new Error("Transcript events changed their captured database owner");
		};
		assertSourceCurrent();
		if (!identity.key.startsWith("file:")) return [];
		target.path = databasePath;
		const receipt = resolveSessionTranscriptReadFence(target);
		const admission = receipt ? { ...receipt } : void 0;
		return withSessionHistoryWorkerDatabase(options, async (owner) => {
			const assertCurrent = () => {
				assertSourceCurrent();
				owner.assertCurrent();
			};
			try {
				return await readRestoredSessionTranscript(captured, async () => {
					const result = await owner.readTranscript({
						target: captured,
						resolvedScope: target,
						admission,
						expectedIdentity: identity
					});
					assertCurrent();
					if (result.kind !== "full") throw new Error("Transcript events received a bounded hydration result");
					return result.snapshot.events;
				}, {
					assertCurrent,
					coldRead: {
						target,
						readMetadata: async () => {
							const metadata = await owner.readColdMetadata({
								sessionId: target.sessionId,
								env: captured.env
							});
							assertCurrent();
							return metadata.archive;
						}
					}
				});
			} finally {
				assertCurrent();
			}
		});
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-message-rewrite.ts
/** Rewrites one exact anchored message without rejecting unrelated later appends. */
async function rewriteTranscriptMessageAtAnchor(anchor, rewriteMessage) {
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
/** Updates the terminal assistant owned by one run, preserving unrelated later turns. */
async function rewriteAssistantTranscriptMessageForRun(params) {
	const scope = withOwnedSessionTranscriptWriterFence({
		...params.scope,
		expectedLifecycleRevision: params.expectedLifecycleRevision ?? void 0
	});
	const resolved = resolveSqliteTranscriptScope(scope);
	const { restoreSessionColdTranscript } = await import("./session-cold-storage-C7VKIe8P.mjs");
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
	}, toDatabaseOptions(resolved), { operationLabel: "session.transcript.assistant-rewrite" }), "session.transcript.message-rewrite");
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
//#region src/config/sessions/session-transcript-commit-completion.ts
/** Accept every synchronous callback before yielding, then join its explicit committed work. */
function completeSessionTranscriptCommit(messages, onMessageCommitted) {
	if (!onMessageCommitted) return;
	const pending = [];
	let accepting = true;
	let failed = false;
	let failure;
	const accept = (complete) => {
		if (!accepting) throw new Error("Transcript committed completion admission is closed");
		const completion = complete();
		completion.catch(() => void 0);
		pending.push(completion);
	};
	try {
		for (const message of messages) onMessageCommitted(message, accept);
	} catch (error) {
		failed = true;
		failure = error;
	} finally {
		accepting = false;
	}
	if (pending.length === 0) {
		if (failed) throw failure;
		return;
	}
	return Promise.allSettled(pending).then((results) => {
		if (failed) throw failure;
		for (const result of results) if (result.status === "rejected") throw result.reason;
	});
}
//#endregion
//#region src/config/sessions/session-turn.ts
async function appendSessionTurnInWorker(requested, options, context) {
	const scope = captureLifecycleDatabaseScope(requested);
	const database = {
		...toDatabaseOptions(scope),
		path: scope.path
	};
	const execution = captureOpenClawAgentDatabaseExecution(database);
	const custody = captureSessionPendingInputWorkerCustody();
	const cliWriter = getCliHistoryWriter({
		...scope,
		storePath: scope.path
	});
	let custodyRequired = false;
	const freshCommitGuards = /* @__PURE__ */ new Set();
	const assertCurrent = () => {
		execution.assertCurrent();
		options.assertCurrent?.();
		options.sessionTurnMutation?.assertCurrent?.();
		if (options.sessionTurnMutation) assertSessionGoalOperationTime(options.sessionTurnMutation.operation, Date.now());
		cliWriter?.assertCurrent();
		for (const guard of freshCommitGuards) guard();
	};
	const { onMessageCommitted: _onMessageCommitted, assertCurrent: _assertCurrent, sessionTurnMutation, messages, config: _config, ...serializable } = options;
	const plan = {
		agentId: scope.agentId,
		sessionKey: scope.sessionKey,
		options: {
			...serializable,
			initialSessionEntry: options.initialSessionEntry ? structuredClone(options.initialSessionEntry) : void 0,
			messages: [],
			sessionTurnMutation: sessionTurnMutation ? {
				kind: sessionTurnMutation.kind,
				operation: sessionTurnMutation.operation,
				runId: sessionTurnMutation.runId,
				routingPredicate: sessionTurnMutation.routingPredicate
			} : void 0
		},
		cliWriter: cliWriter ? {
			runId: cliWriter.runId,
			authFingerprint: cliWriter.authFingerprint,
			lifecycleRevision: cliWriter.lifecycleRevision
		} : void 0,
		custody: custody?.facts,
		relocation: custody?.relocation
	};
	const outcome = await (async () => {
		const { restoreSessionColdTranscript, SessionColdTurnReboundError } = await import("./session-cold-storage-C7VKIe8P.mjs");
		assertCurrent();
		try {
			await restoreSessionColdTranscript({
				...scope,
				storePath: scope.path
			}, assertCurrent, void 0, options.keyFormat === "agent-qualified" ? {
				agentId: scope.agentId,
				sessionKey: scope.sessionKey,
				options: {
					keyFormat: options.keyFormat,
					expectedSessionId: options.expectedSessionId,
					selectedSessionId: options.selectedSessionId,
					selectedLifecycleRevision: options.selectedLifecycleRevision,
					expectedLifecycleRevision: options.expectedLifecycleRevision,
					expectedWriterRunId: options.expectedWriterRunId,
					expectedSessionState: options.expectedSessionState,
					initialSessionEntry: plan.options.initialSessionEntry
				},
				goalOperation: options.sessionTurnMutation?.operation
			} : void 0);
		} catch (error) {
			if (error instanceof SessionColdTurnReboundError) return {
				...error.result,
				sessionFile: options.sessionFile
			};
			throw error;
		}
		return await runSessionEntryWorkerOperation({
			database,
			retainedExecution: execution,
			agentId: scope.agentId,
			assertCurrent,
			candidateKind: "session-turn",
			onTransactionFacts(facts) {
				if (!isRecord(facts) || facts.kind !== "session-turn-custody") return false;
				if (!custody) throw new Error("Session turn has no pending-input owner");
				custody.assertCurrent();
				custodyRequired = true;
				return true;
			},
			assertCandidate() {
				if (custodyRequired) custody?.assertCurrent();
			},
			async run(worker, commit) {
				const selected = await worker.execute({
					type: "session.turn.prepare",
					input: plan
				});
				assertCurrent();
				if (selected.result) return selected.result;
				const accepted = [];
				for (const append of messages) {
					if (!append.shouldAppend || await append.shouldAppend(context)) accepted.push(append);
					assertCurrent();
				}
				plan.options.messages = accepted.map(({ config: _messageConfig, workerPreparation: _preparation, shouldAppend: _shouldAppend, shouldAppendInTransaction: _predicate, prepareMessageAfterIdempotencyCheck: _prepare, beforeFreshMessageCommit: _guard, ...append }) => append);
				const preparation = await worker.execute({
					type: "session.turn.prepare",
					input: plan
				});
				assertCurrent();
				if (preparation.result) return preparation.result;
				plan.options.preparedGoalId = preparation.goalId;
				plan.options.messages = plan.options.messages.map((append, index) => {
					const hooks = accepted[index].workerPreparation;
					const facts = preparation.messages[index];
					const config = accepted[index].config ?? options.config;
					const prepare = hooks?.prepareMessageAfterIdempotencyCheck;
					let message = prepareSessionTurnGoalMessage(append.message, sessionTurnMutation, preparation.goalId);
					if (!facts.pending && !facts.existing && prepare) message = prepare(message);
					if (!facts.pending && !facts.existing && message !== void 0 && hooks?.beforeFreshMessageCommit) freshCommitGuards.add(hooks.beforeFreshMessageCommit);
					if (!facts.pending && message !== void 0 && options.atomicGroup !== true) message = redactTranscriptMessageForStorage(message, { config });
					return {
						...append,
						message: prepare ? append.message : message,
						...prepare && !facts.pending ? { preparation: {
							expected: facts.existing,
							message
						} } : {}
					};
				});
				assertCurrent();
				return commit(() => worker.execute({
					type: "session.turn.commit",
					input: plan
				}));
			},
			onAcknowledged(candidate) {
				if (candidate.custody) custody?.publish(candidate.custody);
				installCommittedTranscriptMessageSequences(candidate.result.appendedMessages, candidate.sequences);
				if (candidate.projectionNeedsReconcile) startSessionTranscriptIndexReconcile({
					...database,
					preferredSessionId: scope.sessionId
				});
			},
			async onCommitted(candidate, published, identity) {
				if (published) publishCommittedSessionIdentity(scope.agentId, identity, published.previous, published.current, published.prepared);
				await completeSessionTranscriptCommit(candidate.result.appendedMessages, options.onMessageCommitted);
				return candidate.result;
			}
		});
	})().then((value) => ({
		ok: true,
		value
	}), (error) => ({
		ok: false,
		error
	}));
	try {
		await execution.release();
	} catch (error) {
		if (outcome.ok) throw error;
		throw retainSqliteWorkerErrorCode(createSqliteLifecycleAggregateError([outcome.error, error], "Session turn and executor cleanup failed", outcome.error), outcome.error);
	}
	if (!outcome.ok) throw outcome.error;
	return outcome.value;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-turn.ts
/** Appends a guarded transcript turn and touches its session row in one queued write. */
async function appendExpectedSessionTranscriptTurn(scope, options) {
	const resolved = resolveSqliteTranscriptScope({
		...scope,
		sessionId: options.expectedSessionId
	});
	const context = {
		agentId: resolved.agentId,
		sessionId: options.expectedSessionId,
		sessionKey: resolved.sessionKey,
		...scope.storePath ? { storePath: scope.storePath } : {}
	};
	const keys = /* @__PURE__ */ new Set();
	if ((!options.messages.some((message) => message.workerPreparation) || options.messages.every((append) => {
		const key = readMessageIdempotencyKey(append.message);
		const repeated = key !== null && keys.has(key);
		if (key) keys.add(key);
		return !append.workerPreparation || !append.predicate && !repeated;
	})) && isMainThread && supportsOpenClawAgentDatabaseExecution(toDatabaseOptions(resolved)) && options.messages.every((message) => !message.shouldAppendInTransaction && !message.prepareMessageAfterIdempotencyCheck && !message.beforeFreshMessageCommit)) return appendSessionTurnInWorker(resolved, options, context);
	if (options.acceptedResultGuard || options.sessionTurnMutation?.routingPredicate) await prepareSessionTurnPredicates();
	const { readEntry, resolveExpectedEntry } = createSessionTranscriptTurnKernel(resolved, options);
	const { restoreSessionColdTranscript } = await import("./session-cold-storage-C7VKIe8P.mjs");
	const rebound = /* @__PURE__ */ new Error("Session changed before cold transcript restoration");
	let restoreEntry;
	try {
		await restoreSessionColdTranscript({
			...scope,
			sessionId: options.expectedSessionId
		}, options.keyFormat === "agent-qualified" ? () => {
			options.sessionTurnMutation?.assertCurrent?.();
			const current = withOpenClawAgentDatabaseReadOnly((database) => readWithCanonicalSessionAdmission(database, () => {
				restoreEntry = readEntry(database);
				return resolveExpectedEntry(restoreEntry) || restoreEntry?.entry.sessionId === options.expectedSessionId && options.sessionTurnMutation && readSessionGoalOperationInDatabase(database, {
					sessionKey: resolved.sessionKey,
					expectedSessionId: options.expectedSessionId,
					operation: options.sessionTurnMutation.operation
				});
			}), toDatabaseOptions(resolved));
			if (current.found ? current.value : resolveExpectedEntry(void 0)) return;
			throw rebound;
		} : void 0);
	} catch (error) {
		if (error !== rebound) throw error;
		return sqliteSessionTranscriptTurnRebound(restoreEntry, options.sessionFile);
	}
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		const mutation = options.sessionTurnMutation;
		mutation?.assertCurrent?.();
		const preparedDatabase = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		prepareSessionTurnRouting(mutation?.routingPredicate, resolved.env)?.(preparedDatabase);
		if (mutation) ensureSessionGoalOperationsSchema(preparedDatabase.db);
		const preparedEntry = readEntry(preparedDatabase);
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
		const messages = await selectAppendableSqliteTranscriptTurnMessages(context, options.messages);
		let result = sqliteSessionTranscriptTurnRebound(preparedEntry, options.sessionFile);
		const { commit } = createSessionTranscriptTurnKernel(resolved, options, prepareSessionTurnRouting(mutation?.routingPredicate, resolved.env));
		runSqliteSessionDeletionTransaction((transactionDb) => {
			const committed = commit(transactionDb, messages);
			result = committed.result;
			return committed.identity ? prepareSessionIdentityPublication(transactionDb, resolved.agentId, committed.identity.previous, committed.identity.current) : void 0;
		}, toDatabaseOptions(resolved), { operationLabel: "session.transcript.append-turn" })?.();
		const completion = completeSessionTranscriptCommit(result.appendedMessages, options.onMessageCommitted);
		if (completion) await completion;
		return result;
	}, "session.transcript.turn");
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
	if (target.entryFromPersistedStore && target.storePath && target.sessionKey && target.sessionId) return await persistExpectedSessionTranscriptTurn({
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
	let sessionEntry = target.sessionEntry;
	if (options.touchSessionEntry === true && appendedCount > 0 && target.storePath && target.sessionKey && target.sessionId) {
		const updatedAt = Date.now();
		const updated = await updateSessionEntry({
			sessionKey: target.sessionKey,
			storePath: target.storePath,
			...target.agentId ? { agentId: target.agentId } : {},
			...target.env ? { env: target.env } : {}
		}, (current) => current.sessionId === target.sessionId ? { updatedAt: Math.max(current.updatedAt ?? 0, updatedAt) } : null, { skipMaintenance: true });
		if (updated && scope.sessionStore) scope.sessionStore[target.sessionKey] = updated;
		sessionEntry = updated ?? target.sessionEntry;
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
		const { shouldAppend: _shouldAppend, ...appendOptions } = append;
		const result = await appendTranscriptMessage({
			...target.agentId ? { agentId: target.agentId } : {},
			...target.env ? { env: target.env } : {},
			...target.sessionId ? { sessionId: target.sessionId } : {},
			...target.sessionKey ? { sessionKey: target.sessionKey } : {},
			...target.storePath ? { storePath: target.storePath } : {}
		}, {
			...appendOptions,
			...appendOptions.workerPreparation,
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
	rememberCommittedTranscriptMessageSequences(target, appendedMessages);
	return appendedMessages;
}
async function persistExpectedSessionTranscriptTurn(scope, options, preparedTarget) {
	const requestedSessionKey = scope.sessionKey?.trim();
	const expectedSessionId = options.expectedSessionId;
	const { selectedSessionId, selectedLifecycleRevision, ...target } = preparedTarget ?? await prepareTranscriptTurnTarget({
		...scope,
		sessionId: expectedSessionId
	}, options.config);
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
		...await resolveSessionTranscriptRuntimeTarget(binding, config, { keyFormat: "agent-qualified" }),
		storePath: binding.storePath,
		env: binding.env
	};
}
async function resolveTranscriptTurnTarget(scope, config) {
	const target = await prepareTranscriptTurnTarget(scope, config);
	const sessionEntry = (scope.sessionStore ? resolveSessionStoreEntryCore({
		store: scope.sessionStore,
		sessionKey: target.sessionKey
	}) : void 0)?.existing ?? scope.sessionEntry;
	return {
		...target,
		sessionEntry,
		entryFromPersistedStore: target.selectedSessionId != null
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
async function withNativeCurrentTranscript(scope, run) {
	const fenced = withOwnedSessionTranscriptWriterFence(scope);
	const resolved = resolveSqliteTranscriptScope(fenced);
	return runExclusiveSqliteSessionWrite(resolved, async () => runOpenClawAgentWriteTransaction((database) => {
		assertOwnedTranscriptWriteCommit(fenced);
		const refusal = resolveTranscriptAppendRefusal(readSessionEntryRow(database, resolved.sessionKey, "list")?.entry, resolved, fenced);
		if (refusal) {
			if (fenced.expectedWriterRunId !== void 0) throw new SessionTranscriptWriterClaimReboundError(refusal);
			return err(refusal);
		}
		const result = run(database, resolved);
		assertOwnedTranscriptWriteCommit(fenced);
		const rebound = resolveTranscriptAppendRefusal(readSessionEntryRow(database, resolved.sessionKey, "list")?.entry, resolved, fenced);
		if (rebound) throw new SessionTranscriptWriterClaimReboundError(rebound);
		return ok(result);
	}, toDatabaseOptions(resolved), { operationLabel: "session.transcript.report" }), "session.transcript.report");
}
async function withReportWorker(scope, kind, run, sessionEntryCurrent) {
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
	const identities = new Map(candidates.filter((candidate) => !candidate.scope).map((candidate) => {
		const identity = readDatabasePathIdentitySync(candidate.path);
		return [identity.canonicalPath, identity];
	}));
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
							sessionKey: resolved.sessionKey
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
function isProcessHeldTranscript(scope) {
	return isIncognitoSessionKey(scope.sessionKey) || Boolean(scope.storePath && isIncognitoOpenClawAgentSqlitePath(scope.storePath, {
		agentId: scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey),
		env: scope.env
	}));
}
/** Fills a hot transcript only when its settled registered producer left no authoritative answer. */
async function appendAbortedSessionTranscriptPartial(scope, partial) {
	const publicationScope = { ...scope };
	const { config, ...input } = partial;
	const preparedMessage = prepareTranscriptMessageAppend({
		message: attachSessionTranscriptRunId(partial.message, partial.runId),
		config
	});
	if (!preparedMessage || preparedMessage.persistedMessage.role !== "assistant") throw new Error("Aborted partial requires prepared assistant storage bytes");
	const settlement = isProcessHeldTranscript(publicationScope) ? await withNativeCurrentTranscript(publicationScope, (database, resolved) => appendAbortedSessionTranscriptPartialInTransaction(database, resolved, input, preparedMessage)) : await withReportWorker(publicationScope, "append", async (operation, _assertCurrent, publish) => {
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
	if (isProcessHeldTranscript(scope)) return withNativeCurrentTranscript(scope, (database, resolved) => prepareTranscriptReportSelection(database, resolved, {
		kind: "custom",
		customTypes
	}).latest);
	return withReportWorker(scope, "read", async (operation, assertCurrent) => {
		const prepared = await operation.execute({
			type: "prepare",
			input: {
				kind: "custom",
				customTypes
			}
		});
		assertCurrent();
		return prepared.ok ? ok(prepared.value.latest) : prepared;
	});
}
/** Boot repair and process-held incognito databases retain their native transaction owner. */
async function appendSessionTranscriptReportNative(scope, report) {
	return withNativeCurrentTranscript(scope, (database, resolved) => {
		const facts = prepareTranscriptReportSelection(database, resolved, report.kind === "assistant" ? {
			kind: "assistant",
			responseId: report.message.responseId
		} : report);
		if (facts.suppressed) return;
		if (report.kind === "assistant") {
			appendSelectedTranscriptReportInTransaction(database, resolved, facts.appendParentId, report);
			return;
		}
		const selected = report.selectReport(facts.latest);
		if (selected) appendSelectedTranscriptReportInTransaction(database, resolved, facts.appendParentId, prepareCustomTranscriptReport(selected, facts.appendParentId));
	});
}
/** Selects and appends one report against the same authoritative branch revision. */
async function appendSessionTranscriptReport(scope, report, options) {
	if (isProcessHeldTranscript(scope)) {
		if (options?.sessionEntryCurrent) throw new Error("A file session source cannot authorize a process-held transcript report");
		return appendSessionTranscriptReportNative(scope, report);
	}
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
		customTypes: [...report.customTypes],
		suppressWhenAssistantRun: report.suppressWhenAssistantRun
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
export { prepareSessionPendingInputDedupeRecovery as A, recordSessionParticipantInWorker as C, mergeSessionProfileInvolvement as D, updateSessionProfileInvolvement as E, readSessionPendingInput as F, normalizeMessageClientSources as I, stageSessionPendingInput as M, withSessionPendingInputPersistence as N, recoverSessionEntryFromRestartTombstone as O, listSessionPendingInputs as P, addSessionMemberInWorker as S, runSessionCollaborationWrite as T, listSessionBranches as _, appendTranscriptMessages as a, scanDoctorSessionEntriesStrict as b, trimSessionTranscriptForManualCompact as c, loadTranscriptEvents as d, readTranscriptRawDelta as f, switchSessionBranch as g, rewindSessionToMessage as h, readLatestSessionTranscriptReport as i, readSessionSubmittedInput as j, bindSessionPendingInputSources as k, rewriteAssistantTranscriptMessageForRun as l, forkSessionAtMessage as m, appendSessionTranscriptReport as n, persistSessionTranscriptTurn as o, persistCompactionBoundaryWithSessionEntryAsync as p, appendSessionTranscriptReportNative as r, preflightSessionTranscriptForManualCompact as s, appendAbortedSessionTranscriptPartial as t, rewriteTranscriptMessageAtAnchor as u, listCanonicalSessionRepairFacts as v, removeSessionMemberInWorker as w, scanDoctorSessionEntriesTolerant as x, loadCanonicalSessionRepairEntries as y };
