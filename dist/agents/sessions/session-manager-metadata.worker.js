import { c as isRecord } from "../../record-coerce-TIsquoVR.mjs";
import { u as readDatabasePathIdentitySync } from "../../sqlite-worker-identity-KSR14F6C.mjs";
import { t as assertTransactionUsable } from "../../sqlite-transaction-DsZ3X6nD.mjs";
import { t as encodeOpenClawStateWorkerError } from "../../openclaw-state-worker-error-Cmtk9G4_.mjs";
import { i as requestSqliteWorkerOperationAdmission } from "../../sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { i as getSqliteWorkerStateContext } from "../../sqlite-worker-state-context-BeVaUlhr.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "../../openclaw-agent-db.paths-DVbbFaej.mjs";
import { u as runOpenClawAgentWriteTransaction } from "../../openclaw-agent-db-DBug3LUA.mjs";
import { C as parseOpaqueLeafEntry, S as isReadableSessionMessage, a as prepareTranscriptPayloadForReuse, b as findSessionTranscriptHeader, x as isIndexedSessionEntry } from "../../transcript-payload-Yc_w8Yx5.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "../../transcript-write-context-m7NE2aEm.mjs";
import { i as toDatabaseOptions } from "../../session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { d as resolveSqliteTranscriptScope } from "../../session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { n as assertCanonicalSessionKeyWrite } from "../../session-canonical-key-D1TSJMmX.mjs";
import { a as runWithSessionTranscriptReadFence } from "../../session-transcript-read-fence-DfxRHzep.mjs";
import { v as runWithSessionPendingInputWorkerCustody } from "../../session-accessor.sqlite-pending-inputs-DtDOOibA.mjs";
import { T as validatePreparedAssistantAppendSync, a as inspectTranscriptEventsSync, d as loadTranscriptReadSnapshotSync } from "../../session-accessor.sqlite-read-8qBtzC-z.mjs";
import { t as ensureSessionEntryInTransaction } from "../../session-accessor.sqlite-initial-entry--t0jv1JX.mjs";
import { t as readSessionTranscriptBoundedActiveContextCore } from "../../session-accessor.sqlite-active-context-B0o-SgQq.mjs";
import { a as appendTranscriptMessageSnapshotSync, c as replaceSessionWithBranchedTranscriptInTransaction, h as replaceTranscriptSuffixEventsSync, n as appendTranscriptEventSnapshotSync } from "../../session-accessor.sqlite-transcript-write-CPk6xFA-.mjs";
import { i as persistCompactionBoundaryWithSessionEntryInWorker, n as readTranscriptMutationAtSync } from "../../session-accessor.sqlite-metadata-read-Dij1AT2k.mjs";
import { t as prepareTranscriptRewriteSync } from "../../session-accessor.sqlite-branch-rewrite-B_v7eZj9.mjs";
import { serialize } from "node:v8";
//#region src/agents/sessions/session-manager-maintenance.worker.ts
function executeSessionMaintenance(command, scope, context) {
	let projectionNeedsReconcile = false;
	const projection = {
		scheduleProjectionReconcile: false,
		onProjectionReconcileNeeded: () => {
			projectionNeedsReconcile = true;
		}
	};
	if (command.type === "session.transcript.branch") return runOpenClawAgentWriteTransaction((database) => {
		if (database.db !== context.database) throw new Error("Session branch lost its borrowed canonical connection");
		context.admit("transaction");
		const result = replaceSessionWithBranchedTranscriptInTransaction(database, scope, command.input.branch, command.input.expectedLifecycleRevision, void 0, projection);
		context.admit("commit");
		return {
			...result,
			projectionNeedsReconcile
		};
	}, toDatabaseOptions(resolveSqliteTranscriptScope(scope)), { operationLabel: command.type });
	if (command.type === "session.transcript.replaceSuffix") {
		const [expected, next, prefix, mutationAt, startsAtPrefix, retained] = command.input.args;
		let version;
		return {
			replaced: replaceTranscriptSuffixEventsSync(scope, expected, next, prefix, mutationAt, (committed) => {
				version = committed;
			}, startsAtPrefix, retained, (stage) => context.admit(stage), projection),
			version,
			projectionNeedsReconcile
		};
	}
	let version;
	prepareTranscriptRewriteSync(scope, command.input.appendParentId, () => {}, command.input.version, (stage) => context.admit(stage), {
		messagesAlreadyRedacted: true,
		...projection
	})(command.input.entries, new Map(command.input.sources), (committed) => {
		version = committed;
	});
	if (!version) throw new Error("Session rewrite did not return its committed version");
	return {
		version,
		entries: command.input.entries,
		projectionNeedsReconcile
	};
}
//#endregion
//#region src/agents/sessions/session-manager-metadata.worker.ts
function runWithMetadataMessageAdmission(context, controls, run) {
	let transactionFacts;
	let pendingAuthorityChecked = false;
	const requestMessageCheck = (check) => {
		requestSqliteWorkerOperationAdmission({
			stage: "prepare",
			facts: {
				kind: "session-message",
				domainFacts: transactionFacts,
				check
			}
		});
		if (check === "pending") pendingAuthorityChecked = true;
	};
	const admit = (stage) => context.admit(stage, (request, dispatch) => {
		transactionFacts = request.facts;
		dispatch({
			...request,
			facts: {
				kind: "session-message",
				domainFacts: request.facts,
				...stage === "commit" && pendingAuthorityChecked ? { check: "pending" } : {}
			}
		});
	});
	const write = () => run(admit, () => requestMessageCheck("fresh"));
	const pending = controls?.pendingInput;
	if (!pending) return { value: write() };
	const result = runWithSessionPendingInputWorkerCustody(pending.facts, pending.relocation, () => requestMessageCheck("pending"), write);
	return {
		value: result.value,
		pendingInputReceipt: result.receipt
	};
}
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
function copyTranscriptRefusal(value) {
	if (value === void 0) return;
	if (!isRecord(value) || typeof value.agentIdHash !== "string" || typeof value.expectedSessionIdHash !== "string" || typeof value.sessionKeyHash !== "string") throw new Error("Session metadata refusal has an invalid identity");
	const identity = {
		agentIdHash: value.agentIdHash,
		expectedSessionIdHash: value.expectedSessionIdHash,
		sessionKeyHash: value.sessionKeyHash
	};
	if (value.code === "session-entry-missing") return {
		...identity,
		code: value.code
	};
	if (value.code === "session-rebound" && typeof value.actualSessionIdHash === "string") return {
		...identity,
		code: value.code,
		actualSessionIdHash: value.actualSessionIdHash
	};
	throw new Error("Session metadata refusal has an invalid kind");
}
function readCommittedMetadataView(scope, limits, admission) {
	return runWithSessionTranscriptReadFence(admission, () => {
		if (limits) return {
			kind: "bounded",
			snapshot: readSessionTranscriptBoundedActiveContextCore(scope, {
				...limits,
				...admission !== void 0 ? { ignoreReadFence: true } : {}
			})
		};
		if (admission !== void 0) {
			const inspected = inspectTranscriptEventsSync(scope);
			return {
				kind: "full",
				snapshot: {
					events: inspected.events,
					version: {
						generation: inspected.snapshot.generation,
						rawSeq: inspected.snapshot.lastSeq,
						updatedAt: inspected.snapshot.transcriptUpdatedAt
					}
				}
			};
		}
		return {
			kind: "full",
			snapshot: loadTranscriptReadSnapshotSync(scope)
		};
	});
}
/** Borrow the canonical actor's connection; this domain never opens or closes a database. */
function bindSqliteWorkerBackend(_input, context) {
	let closed = false;
	const assertOpen = () => {
		if (closed || !context.database.isOpen) throw new Error("Session metadata domain is closed");
		assertTransactionUsable(context.database);
	};
	const execute = (command) => {
		assertOpen();
		const scope = {
			...command.input.scope,
			env: getSqliteWorkerStateContext().environment
		};
		const resolved = resolveSqliteTranscriptScope(scope);
		const options = toDatabaseOptions(resolved);
		if (readDatabasePathIdentitySync(resolveOpenClawAgentSqlitePath(options)).canonicalPath !== context.databasePath) throw new Error("Session metadata target changed its database owner");
		scope.storePath = context.databasePath;
		resolved.path = context.databasePath;
		options.path = context.databasePath;
		if (command.type === "session.metadata.mutation") return {
			ok: true,
			value: readTranscriptMutationAtSync(scope)
		};
		assertCanonicalSessionKeyWrite(resolved.sessionKey, resolved.agentId);
		if (command.type === "session.transcript.compactionBoundary") return {
			ok: true,
			value: persistCompactionBoundaryWithSessionEntryInWorker(scope, {
				...command.input,
				prepared: {
					...command.input.prepared,
					scope: {
						...command.input.prepared.scope,
						env: scope.env
					}
				}
			}, context)
		};
		if (command.type === "session.transcript.branch") return {
			ok: true,
			value: executeSessionMaintenance(command, scope, context)
		};
		if (command.type === "session.transcript.replaceSuffix") return {
			ok: true,
			value: executeSessionMaintenance(command, scope, context)
		};
		if (command.type === "session.transcript.rewrite") {
			const result = runWithMetadataMessageAdmission(context, command.input, (admit) => executeSessionMaintenance(command, scope, {
				...context,
				admit
			}));
			return {
				ok: true,
				value: {
					...result.value,
					pendingInputReceipt: result.pendingInputReceipt
				}
			};
		}
		if (command.type === "session.transcript.appendMessage") {
			const message = JSON.parse(command.input.messageJson);
			if (!isReadableSessionMessage(message)) throw new Error("Invalid serialized session transcript message");
			const prepared = {
				messageJson: command.input.messageJson,
				persistedMessage: message
			};
			const result = runWithMetadataMessageAdmission(context, command.input, (admit) => runOpenClawAgentWriteTransaction((database) => {
				if (database.db !== context.database) throw new Error("Session message lost its borrowed canonical connection");
				admit("transaction");
				let projectionNeedsReconcile = false;
				const snapshot = appendTranscriptMessageSnapshotSync(scope, {
					message,
					cwd: command.input.cwd
				}, prepared, {
					messageAlreadyRedacted: true,
					scheduleProjectionReconcile: false,
					onProjectionReconcileNeeded: () => {
						projectionNeedsReconcile = true;
					}
				});
				admit("commit");
				return {
					ok: true,
					value: {
						snapshot,
						projectionNeedsReconcile
					}
				};
			}, options, { operationLabel: command.type }));
			if (result.value.ok) {
				result.value.value.pendingInputReceipt = result.pendingInputReceipt;
				const { snapshot } = result.value.value;
				if (snapshot.ok && snapshot.value.result?.message === message) snapshot.value.result.message = void 0;
			}
			return result.value;
		}
		const event = command.type === "session.metadata.append" ? decodeMetadataAppendEvent(command.input) : void 0;
		let prepared;
		if (command.type === "session.metadata.append" && event?.type === "message") {
			const { message } = command.input;
			if (!message) throw new Error("Session message append requires prepared storage bytes");
			const { message: _message, ...envelope } = event;
			const eventJson = `${JSON.stringify(envelope).slice(0, -1)},"message":${message.messageJson}}`;
			prepared = {
				messageJson: message.messageJson,
				persistedMessage: event.message,
				physicalPayload: prepareTranscriptPayloadForReuse(context.database, eventJson, event)
			};
			if (message.validateTurn) {
				const mutationAt = validatePreparedAssistantAppendSync(scope, event.parentId, command.input.view?.admission?.entryId);
				if (mutationAt === void 0) {
					const error = /* @__PURE__ */ new Error(`SQLite transcript changed while preparing rewrite for ${scope.sessionId}`);
					error.name = "SqliteTranscriptMutationConflictError";
					throw error;
				}
				command.input.options.expectedMutationAt = mutationAt;
			}
		}
		const result = runWithMetadataMessageAdmission(context, command.type === "session.metadata.append" ? command.input.message : void 0, (admit, beforeFreshMessageCommit) => runOpenClawAgentWriteTransaction((database) => {
			if (database.db !== context.database) throw new Error("Session metadata lost its borrowed canonical connection");
			admit("transaction");
			if (command.type === "session.metadata.initialize") {
				const initialized = ensureSessionEntryInTransaction(database, resolved, scope, command.input.entry, command.input.initialWriterRunId);
				admit("commit");
				return {
					ok: true,
					value: initialized
				};
			}
			let projectionNeedsReconcile = false;
			const projection = {
				scheduleProjectionReconcile: false,
				onProjectionReconcileNeeded: () => {
					projectionNeedsReconcile = true;
				}
			};
			if (!event) throw new Error("Session metadata append requires a serialized event");
			const { message } = command.input;
			const snapshot = event.type === "message" && message ? appendTranscriptMessageSnapshotSync(scope, {
				...command.input.options,
				message: event.message,
				eventId: event.id,
				parentId: event.parentId,
				now: Date.parse(event.timestamp),
				cwd: message.cwd,
				idempotencyLookup: message.idempotencyLookup,
				...message.freshMessageCheck ? { beforeFreshMessageCommit } : {}
			}, prepared, projection) : appendTranscriptEventSnapshotSync(scope, event, command.input.options, {
				...projection,
				eventJson: typeof command.input.event === "string" ? command.input.event : void 0
			});
			admit("commit");
			return {
				ok: true,
				value: {
					snapshot,
					projectionNeedsReconcile
				}
			};
		}, options, {
			operationLabel: command.type,
			diagnosticContext: {
				sessionId: scope.sessionId,
				eventType: event?.type,
				messageRole: event?.type === "message" ? event.message.role : void 0
			}
		}));
		const outcome = result.value;
		if (outcome.ok && "snapshot" in outcome.value && outcome.value.snapshot.ok) {
			const receipt = outcome.value.snapshot.value.result;
			if (receipt && "message" in receipt && receipt.message === prepared?.persistedMessage) receipt.message = void 0;
		}
		if (result.pendingInputReceipt && outcome.ok && "snapshot" in outcome.value) outcome.value.pendingInputReceipt = result.pendingInputReceipt;
		if (command.type === "session.metadata.append" && event && event.type !== "session" && command.input.view && outcome.ok && "snapshot" in outcome.value && outcome.value.snapshot.ok) {
			const { view } = command.input;
			const committed = outcome.value.snapshot.value;
			if (!committed.result) return outcome;
			const adoptedMessage = "messageId" in committed.result && committed.result.messageId !== event.id;
			if (!committed.result.appended && !adoptedMessage) return outcome;
			const version = view.loadedVersion;
			const effectiveParentId = "effectiveParentId" in committed.result ? committed.result.effectiveParentId : void 0;
			if (adoptedMessage || version && (committed.before.generation !== version.generation || committed.before.rawSeq !== version.rawSeq) || effectiveParentId !== void 0 && effectiveParentId !== event.parentId) try {
				outcome.value.reload = {
					ok: true,
					value: readCommittedMetadataView(scope, view.limits, view.admission)
				};
				serialize(outcome);
			} catch (error) {
				outcome.value.reload = {
					ok: false,
					error: encodeOpenClawStateWorkerError(error, { includeOrdinary: true })
				};
			}
		}
		return outcome;
	};
	return {
		execute(command) {
			try {
				return execute(command);
			} catch (error) {
				if (error instanceof SessionTranscriptWriterClaimReboundError) return {
					ok: false,
					refusal: copyTranscriptRefusal(error.cause)
				};
				throw error;
			}
		},
		assertSettled() {
			assertOpen();
			if (context.database.isTransaction) throw new Error("Session metadata command left a transaction open");
		},
		close() {
			closed = true;
		}
	};
}
//#endregion
export { bindSqliteWorkerBackend };
