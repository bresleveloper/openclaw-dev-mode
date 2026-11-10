import { f as readDatabasePathIdentitySync, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { a as createSqliteLifecycleAggregateError, s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { p as runSqliteReadOperationSync } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { t as assertOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { n as openOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-open-DcexysGa.mjs";
import { p as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { n as readSessionSourceValidation } from "./session-source-predicate.worker-CY9FAsb_.mjs";
//#region src/config/sessions/session-cold-storage-source-guard.worker.ts
var SessionColdSourceRefusedError = class extends Error {
	constructor(refusal) {
		super("Session source changed before cold transcript restoration");
		this.refusal = refusal;
	}
};
/** Admit foreign readers before taking the restoration writer, never across a read snapshot. */
function prepareSessionColdSourceGuard(target, sources = [], acceptedMatches) {
	const targetIdentity = sources.some(({ source }) => source.path !== target.path) ? readDatabasePathIdentitySync(target.path).key : void 0;
	const isForeign = ({ source }) => source.path !== target.path && `file:${source.databaseIdentity}` !== targetIdentity;
	const readers = /* @__PURE__ */ new Map();
	const close = () => {
		const errors = [];
		for (const reader of readers.values()) try {
			reader?.close();
		} catch (error) {
			errors.push(error);
		}
		throwSqliteLifecycleErrors(errors, "Cold transcript source readers failed to close");
	};
	try {
		for (const predicate of sources.filter(isForeign)) {
			const { source } = predicate;
			const key = source.databaseIdentity;
			if (!readers.has(key)) {
				const opened = openOpenClawAgentDatabaseReadOnly({
					agentId: source.agentId,
					path: source.path,
					env: target.env
				});
				readers.set(key, opened.found ? opened.database : void 0);
			}
		}
	} catch (error) {
		try {
			close();
		} catch (cleanupError) {
			throw createSqliteLifecycleAggregateError([error, cleanupError], "Cold source preparation failed", error);
		}
		throw error;
	}
	const read = (database, entries) => {
		const validation = { conversationMatches: [] };
		for (const [index, predicate] of sources.entries()) {
			const foreign = isForeign(predicate);
			const foreignReader = readers.get(predicate.source.databaseIdentity);
			const expected = {
				key: `file:${predicate.source.databaseIdentity}`,
				birthtime: predicate.source.databaseBirthtime
			};
			try {
				assertExistingDatabaseIdentity(predicate.source.path, expected.key, expected.birthtime);
				if (foreign && foreignReader) assertOpenClawAgentDatabaseIdentity(foreignReader, expected);
			} catch {
				return {
					...validation,
					refusedSource: {
						index,
						facts: { entry: void 0 }
					}
				};
			}
			if (!foreign && !database) continue;
			const reader = foreign ? foreignReader : database;
			if (!reader || reader.agentId !== predicate.source.agentId) return {
				...validation,
				refusedSource: {
					index,
					facts: { entry: void 0 }
				}
			};
			const readPredicate = () => readSessionSourceValidation(reader, [predicate], void 0, foreign ? void 0 : entries);
			const current = foreign ? runSqliteDeferredTransactionSync(reader.db, () => runSqliteReadOperationSync(reader.db, readPredicate)) : readPredicate();
			if (current.refusedSource) return {
				...validation,
				refusedSource: {
					...current.refusedSource,
					index
				}
			};
			for (const { alternatives } of current.conversationMatches) validation.conversationMatches.push({
				index,
				alternatives
			});
		}
		return validation;
	};
	return {
		read,
		assertForeign() {
			const current = read();
			if (current.refusedSource) throw new SessionColdSourceRefusedError(current.refusedSource);
			for (const match of current.conversationMatches) {
				const accepted = acceptedMatches?.find(({ index }) => index === match.index)?.matches;
				if (!accepted || !match.alternatives.some((index) => Atomics.load(accepted, index + 1) === 1)) throw new SessionColdSourceRefusedError({
					index: match.index,
					facts: { entry: void 0 }
				});
			}
		},
		[Symbol.dispose]: close
	};
}
/** Keep the write-owner predicate out of the shared read worker's import closure. */
function readSessionColdLockedValidation(params, resolveWriterRefusal) {
	const { database, sessionId, guard, sourceGuard } = params;
	const { agentId, sessionKey, fence, sources } = guard;
	const fenced = fence.expectedOwner !== void 0 || fence.expectedLifecycleRevision !== void 0 || fence.expectedWriterRunId !== void 0;
	const entry = fenced ? readSessionEntryRow(database, sessionKey)?.entry : void 0;
	const entries = fenced ? /* @__PURE__ */ new Map([[sessionKey, entry]]) : void 0;
	const sourceValidation = sourceGuard ? sourceGuard.read(database, entries) : readSessionSourceValidation(database, sources, void 0, entries);
	if (sourceValidation.refusedSource) return { sourceValidation };
	if (fenced) {
		const target = {
			agentId,
			sessionKey,
			sessionId
		};
		const refusal = resolveWriterRefusal(entry, target, {
			...target,
			...fence
		});
		if (refusal) return {
			sourceValidation,
			writerRefusal: refusal
		};
	}
	return { sourceValidation };
}
//#endregion
export { prepareSessionColdSourceGuard as n, readSessionColdLockedValidation as r, SessionColdSourceRefusedError as t };
