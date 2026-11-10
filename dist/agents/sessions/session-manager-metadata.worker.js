import { f as readDatabasePathIdentitySync } from "../../sqlite-worker-identity-DLqVBf5J.mjs";
import { G as sqliteSessionIdWriteScope, U as withSqliteDatabaseWriteScope, W as withoutSqliteDatabaseWriteScope } from "../../sqlite-database-admission-CqdNF9iE.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "../../openclaw-agent-db.paths-BGqL4GOe.mjs";
import { t as assertTransactionUsable } from "../../sqlite-transaction-CpDyZPQ0.mjs";
import { t as encodeOpenClawStateWorkerError } from "../../openclaw-state-worker-error-B93Lf_P2.mjs";
import { n as parseTranscriptAppendRefusal, t as SessionTranscriptWriterClaimReboundError } from "../../session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { a as deferSqliteWorkerCommitReceipt, f as requestSqliteWorkerOperationAdmission } from "../../sqlite-worker-operation-admission-puNZKEvP.mjs";
import { i as getSqliteWorkerStateContext } from "../../sqlite-worker-state-context-QuvwmAax.mjs";
import { t as captureSessionRowChanges } from "../../session-row-changes-vFaNnKNM.mjs";
import { c as runOpenClawAgentWriteTransaction } from "../../openclaw-agent-db-_fC-kf1x.mjs";
import { I as sessionMetadataAppendNeedsReload } from "../../session-actor-memory-owner-BSARM2d5.mjs";
import { a as runWithCliHistoryWriter } from "../../cli-history-boundary-B1eSXpAQ.mjs";
import { i as toDatabaseOptions } from "../../session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as assertCanonicalSessionKeyWrite } from "../../session-canonical-key-B7chVWi3.mjs";
import { s as resolveSqliteTranscriptScope } from "../../session-accessor.sqlite-scope-9ysL95gx.mjs";
import { i as runWithSessionTranscriptReadFence } from "../../session-transcript-read-fence-CgUG4J4j.mjs";
import { s as readStagedSessionTranscriptAuthority } from "../../session-transcript-authority-Bd3kv5VJ.mjs";
import { n as captureSessionEntryMetadataReceipts, t as boundSessionEntryMetadataReceipts } from "../../session-entry-metadata-receipt-Cz-lTw0a.mjs";
import { t as ensureSessionEntryInTransaction } from "../../session-accessor.sqlite-initial-entry-B00nO36i.mjs";
import { o as replaceSessionWithBranchedTranscriptInTransaction, u as replaceTranscriptSuffixEventsSync } from "../../session-accessor.sqlite-transcript-write-B1_nzUQQ.mjs";
import { t as persistCompactionBoundaryWithSessionEntryInWorker } from "../../session-accessor.sqlite-compaction-CBe1uF_o.mjs";
import { r as readTranscriptMutationAtSync } from "../../session-accessor.sqlite-metadata-read-DgoOP6m6.mjs";
import { i as prepareSessionMetadataAppend, n as applySessionDirectMessageInTransaction, r as applySessionMetadataAppendInTransaction, t as runWithMetadataMessageAdmission } from "../../session-manager-message-admission.worker-FEWPbaM4.mjs";
import { t as prepareTranscriptRewriteSync } from "../../session-accessor.sqlite-branch-rewrite-CaUDlpr3.mjs";
import { i as readSessionManagerReload } from "../../session-manager-reload-BdL-HEet.mjs";
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
	prepareTranscriptRewriteSync(scope, () => {}, command.input.version, (stage) => context.admit(stage), {
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
/** Borrow the canonical actor's connection; this domain never opens or closes a database. */
function bindSqliteWorkerBackend(_input, nativeContext) {
	let entryChanges = [];
	const context = {
		...nativeContext,
		checkMessage: (facts) => withoutSqliteDatabaseWriteScope(nativeContext.database, () => requestSqliteWorkerOperationAdmission({
			stage: "prepare",
			facts
		})),
		admit(stage, restriction) {
			const transcriptPublication = stage === "commit" ? readStagedSessionTranscriptAuthority({ db: context.database }) ?? [] : [];
			const entryPublication = stage === "commit" ? captureSessionEntryMetadataReceipts(entryChanges) : [];
			if (!transcriptPublication.length && !entryPublication.length) {
				withoutSqliteDatabaseWriteScope(context.database, () => nativeContext.admit(stage, restriction));
				return;
			}
			const publication = {
				kind: "session-manager-authority",
				transcriptPublication,
				entryPublication
			};
			boundSessionEntryMetadataReceipts(entryPublication, publication);
			deferSqliteWorkerCommitReceipt(context.database, publication);
			withoutSqliteDatabaseWriteScope(context.database, () => nativeContext.admit(stage, (request, dispatch) => {
				const publish = (restricted) => dispatch({
					...restricted,
					facts: {
						...publication,
						domainFacts: restricted.facts
					}
				});
				if (restriction) restriction(request, publish);
				else publish(request);
			}));
		}
	};
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
			const result = runWithMetadataMessageAdmission(context, command.input, (admit) => runOpenClawAgentWriteTransaction((database) => {
				if (database.db !== context.database) throw new Error("Session message lost its borrowed canonical connection");
				admit("transaction");
				const value = applySessionDirectMessageInTransaction(database, {
					...command.input,
					scope
				});
				admit("commit");
				return {
					ok: true,
					value
				};
			}, options, { operationLabel: command.type }));
			if (result.value.ok) result.value.value.pendingInputReceipt = result.pendingInputReceipt;
			return result.value;
		}
		const prepared = command.type === "session.metadata.append" ? prepareSessionMetadataAppend(context.database, command.input) : void 0;
		const event = prepared?.event;
		const messageControl = command.type === "session.metadata.append" ? command.input.message : void 0;
		const result = runWithMetadataMessageAdmission(context, messageControl, (admit, beforeFreshMessageCommit) => runOpenClawAgentWriteTransaction((database) => {
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
			const value = applySessionMetadataAppendInTransaction(database, {
				...command.input,
				scope
			}, beforeFreshMessageCommit, prepared);
			admit("commit");
			return {
				ok: true,
				value
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
		if (result.pendingInputReceipt && outcome.ok && "snapshot" in outcome.value) outcome.value.pendingInputReceipt = result.pendingInputReceipt;
		if (command.type === "session.metadata.append" && command.input.view && outcome.ok && "snapshot" in outcome.value && sessionMetadataAppendNeedsReload(command.input, outcome.value)) {
			const { view } = command.input;
			try {
				outcome.value.reload = {
					ok: true,
					value: runWithSessionTranscriptReadFence(view.admission, () => readSessionManagerReload(scope, view.limits, view.admission !== void 0))
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
				const cliWriter = command.type === "session.transcript.appendMessage" || command.type === "session.metadata.append" ? command.input.cliWriter : void 0;
				return runWithCliHistoryWriter(cliWriter ? {
					...cliWriter,
					target: {
						...command.input.scope,
						storePath: context.databasePath
					},
					assertCurrent: assertOpen,
					assertReadable: assertOpen
				} : void 0, () => captureSessionRowChanges(context.database, (changes) => {
					entryChanges = changes;
					try {
						return withSqliteDatabaseWriteScope(context.database, [command.input.scope.sessionKey, sqliteSessionIdWriteScope(command.input.scope.sessionId)], () => execute(command));
					} finally {
						entryChanges = [];
					}
				}).result);
			} catch (error) {
				if (error instanceof SessionTranscriptWriterClaimReboundError) {
					const refusal = parseTranscriptAppendRefusal(error.cause);
					if (error.cause !== void 0 && !refusal) throw new Error("Session metadata refusal has an invalid identity", { cause: error });
					return {
						ok: false,
						refusal
					};
				}
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
