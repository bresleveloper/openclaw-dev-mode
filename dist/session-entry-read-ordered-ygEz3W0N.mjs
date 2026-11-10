import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { j as readSqliteDatabaseWriteTokenForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { d as readSqliteNativeMutationRevision } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { o as resolveExplicitIncognitoAgentSqliteTarget, r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { i as runOpenClawAgentWriteAdmissions } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { i as getOpenClawAgentDatabaseIfOpen } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { r as captureSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { r as getSessionActorStorageBinding } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { i as retainSessionEntryReadFacts, n as readSessionEntriesWithRetainedFacts, t as readRetainedSessionEntryFacts } from "./session-entry-read-facts-XUOtyCt0.mjs";
import { t as assertSessionEntryCohortScope } from "./session-entry-cohort-scope-BWJvT1Qn.mjs";
import { t as SessionEntryChangedDuringReadError } from "./session-entry-read-errors-Cn4uY9H4.mjs";
import { g as targetDiscoveryLane } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { t as createSessionWorkerExecutionSource } from "./session-worker-execution-source-CQwDQ8va.mjs";
import path from "node:path";
//#region src/config/sessions/session-entry-read-request.ts
/** Ordinary and ordered readers capture the same selection and ancillary facts. */
function captureSessionEntryWorkerRequest(input) {
	return {
		...input.selection ? hasSessionEntrySelection(input, "session-id") ? {
			selection: { ...input.selection },
			projection: input.projection
		} : hasSessionEntrySelection(input, "children") ? {
			selection: {
				...input.selection,
				parentSessionKeys: [...input.selection.parentSessionKeys]
			},
			projection: input.projection
		} : {
			selection: { ...input.selection },
			projection: input.projection
		} : {
			sessionKeys: [...new Set(input.sessionKeys)],
			projection: input.projection
		},
		expectedIdentity: input.preparedSource ? {
			key: `file:${input.preparedSource.databaseIdentity}`,
			canonicalPath: input.preparedSource.path,
			birthtime: input.preparedSource.databaseBirthtime
		} : void 0,
		snapshotFields: input.snapshotFields,
		lifecycleSessionKey: input.lifecycleSessionKey,
		includeMembers: input.includeMembers,
		includeParticipantRecords: input.includeParticipantRecords,
		includeAuthorization: input.includeAuthorization,
		transcript: input.transcript && structuredClone(input.transcript)
	};
}
function hasSessionEntrySelection(input, kind) {
	return input.selection?.kind === kind;
}
function captureSessionEntryReadScope(input) {
	const binding = getSessionActorStorageBinding({});
	const memoryPath = resolveExplicitIncognitoAgentSqliteTarget(input.storePath, input)?.path ?? binding?.path;
	const env = cloneEnvWithPlatformSemantics(input.env ?? (memoryPath ? {
		...process.env,
		OPENCLAW_STATE_DIR: path.resolve(memoryPath, "../../../..")
	} : process.env));
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const scope = {
		...input,
		env,
		...input.storePath ? { storePath: path.resolve(input.storePath) } : {}
	};
	return {
		scope,
		env,
		agentId: scope.agentId ? normalizeAgentId(scope.agentId) : parseAgentSessionKey(scope.sessionKey)?.agentId
	};
}
function isNativeSessionEntryRead(scope, agentId) {
	const storePath = scope.storePath;
	return Boolean(isIncognitoSessionKey(scope.sessionKey) || storePath && isIncognitoOpenClawAgentSqlitePath(storePath, {
		agentId: agentId ?? scope.defaultAgentId ?? "main",
		env: scope.env
	}));
}
//#endregion
//#region src/config/sessions/session-entry-read-ordered.ts
/** Data-only return; decisions/effects consume withRead's synchronous callback directly. */
async function readAdmittedSessionEntry(reader, input, assertCurrent, onReadTarget) {
	assertCurrent();
	const key = assertSessionEntryCohortScope(reader, input);
	const read = await reader.readEntry(assertCurrent);
	assertCurrent();
	reader.assertCurrent();
	onReadTarget?.({
		agentId: reader.logicalAgentId,
		env: reader.database.env,
		storePath: read.source.path,
		readSource: { ...read.source },
		target: {
			canonicalKey: key,
			storeKeys: [key]
		}
	});
	return read.entry;
}
/** Admission already owns this execution; the reader neither opens nor promotes storage. */
function createAdmittedSessionEntryCohortReader(params) {
	const database = Object.freeze({
		...params.database,
		env: Object.freeze({ ...params.database.env })
	});
	const expected = structuredClone(params.expected);
	const assertOwnerCurrent = () => {
		params.execution.assertCurrent();
		params.generation.assertCurrent();
	};
	return {
		database,
		sessionKey: params.sessionKey,
		logicalAgentId: params.logicalAgentId,
		storePaths: Object.freeze([...new Set([...params.storePaths, database.path].map((p) => path.resolve(p)))]),
		assertCurrent: assertOwnerCurrent,
		async readEntry(assertCallerCurrent) {
			const assertCurrent = () => {
				assertOwnerCurrent();
				assertCallerCurrent();
			};
			assertCurrent();
			const request = { sessionKeys: [params.sessionKey] };
			const read = await readSessionEntriesWithRetainedFacts(database, request, () => withSessionHistoryWorkerDatabase(database, (reader) => reader.readExactEntries({
				...request,
				env: database.env
			}), targetDiscoveryLane));
			assertCurrent();
			const entry = read.entries.find((row) => row.sessionKey === params.sessionKey)?.entry;
			const admitted = expected.sessions.find((session) => session.sessionKey === params.sessionKey);
			if (!entry || !admitted || !read.source || read.source.databaseIdentity !== params.generation.identity || entry.sessionId !== admitted.sessionId || entry.lifecycleRevision !== admitted.lifecycleRevision) throw new SessionEntryChangedDuringReadError();
			return {
				entry,
				source: read.source
			};
		},
		async withRead(request, assertCallerCurrent, consume) {
			assertOwnerCurrent();
			assertCallerCurrent();
			const captured = structuredClone({
				...request,
				expected,
				transcript: request.transcript && {
					...request.transcript,
					agentId: params.logicalAgentId
				}
			});
			let assertNativeCurrent;
			const assertCurrent = () => {
				if (!assertNativeCurrent) throw new Error("Session cohort consumption has ended");
				assertOwnerCurrent();
				assertCallerCurrent();
				assertNativeCurrent();
			};
			const source = createSessionWorkerExecutionSource(assertCurrent, "Session cohort authority expired");
			const result = await params.execution.runExisting(source, async (worker) => {
				const before = readSqliteDatabaseWriteTokenForPath(database.path);
				const cached = readRetainedSessionEntryFacts(database, captured, params.generation);
				const read = cached ?? await worker.execute({
					type: "session.entry.read",
					input: captured
				});
				assertCurrent();
				if (!cached) retainSessionEntryReadFacts(database, captured, read, before);
				const value = consume(read, assertCurrent);
				if (isPromiseLike(value)) {
					Promise.resolve(value).catch(() => {});
					throw new Error("Session cohort consumers must remain synchronous");
				}
				assertCurrent();
				return { value };
			}, { withAdmission: (run, signal) => runOpenClawAgentWriteAdmissions([database], async () => {
				assertNativeCurrent = captureSessionEntryNativeMutationWitness([database]);
				try {
					assertCurrent();
					return await run();
				} finally {
					assertNativeCurrent = void 0;
				}
			}, true, signal) });
			if (!result) throw new SessionEntryChangedDuringReadError();
			return result.value;
		}
	};
}
/** Capture under writer FIFO custody; validation grants no access to a released reader. */
function captureSessionEntryNativeMutationWitness(databases) {
	const sources = databases.map((database) => {
		const native = getOpenClawAgentDatabaseIfOpen(database);
		return {
			database,
			native,
			revision: native && readSqliteNativeMutationRevision(native.db)
		};
	});
	return () => {
		for (const { database, native, revision } of sources) if (getOpenClawAgentDatabaseIfOpen(database) !== native || native && (native.db.isTransaction || revision === void 0 || readSqliteNativeMutationRevision(native.db) !== revision)) throw new SessionEntryChangedDuringReadError();
	};
}
/** Native effects retain existing writer FIFO order through their synchronous consumer. */
async function withOrderedSessionEntriesInWorker(inputs, consume, { readStore, onReadAdmitted }) {
	const selected = [];
	const enter = (index) => {
		const input = inputs[index];
		if (input) return readStore(input, async ({ reader, database, continuation, assertCurrent }) => {
			selected.push({
				input,
				owner: reader,
				database,
				continuation,
				assertCurrent
			});
			try {
				return await enter(index + 1);
			} finally {
				selected.pop();
			}
		});
		return runOpenClawAgentWriteAdmissions(selected.map(({ database }) => database), async () => {
			const assertNativeCurrent = captureSessionEntryNativeMutationWitness(selected.map(({ database }) => database));
			let changed = false;
			const unsubscribe = sessionChanges.subscribeFacts((change) => {
				if (!("all" in change) && change.scope === "acp") return;
				const scope = "all" in change ? change.scope : change;
				if (typeof scope === "string") {
					changed ||= scope === "stores";
					return;
				}
				if (!("all" in change) && !change.factsInvalidated && (!change.facts || change.facts.kind === "unchanged")) return;
				const matching = selected.filter(({ input: selectedInput }) => (!scope.agentId || scope.agentId === selectedInput.agentId) && ("all" in change || !selectedInput.sessionKeys || selectedInput.sessionKeys.includes(change.sessionKey)));
				if (matching.length === 0) return;
				try {
					const physicalPath = scope.storePath ? captureSessionStoreReadCandidate(resolveUnsuffixedSqliteTargetFromSessionStorePath(scope.storePath).path).physicalPath : void 0;
					changed ||= matching.some(({ database }) => !physicalPath || physicalPath === database.path);
				} catch {
					changed = true;
				}
			});
			let active = true;
			const assertCurrent = () => {
				if (!active) throw new Error("Session entry read consumer is no longer active");
				for (const read of selected) read.assertCurrent();
				assertNativeCurrent();
				if (changed) throw new SessionEntryChangedDuringReadError();
			};
			try {
				assertCurrent();
				onReadAdmitted?.();
				const reads = [];
				for (const { input: selectedInput, owner, database, continuation } of selected) {
					assertCurrent();
					const request = captureSessionEntryWorkerRequest(selectedInput);
					const before = readSqliteDatabaseWriteTokenForPath(database.path);
					const cached = readRetainedSessionEntryFacts(database, request);
					const result = cached ?? await owner.readExactEntries({
						...request,
						env: database.env,
						continuation
					});
					assertCurrent();
					if (!cached) retainSessionEntryReadFacts(database, request, result, before);
					reads.push({
						result,
						database,
						assertCurrent
					});
				}
				const result = consume(reads);
				if (isPromiseLike(result)) {
					Promise.resolve(result).catch(() => {});
					throw new Error("Session entry read consumers must remain synchronous");
				}
				return result;
			} finally {
				active = false;
				unsubscribe();
			}
		}, true);
	};
	return enter(0);
}
//#endregion
export { captureSessionEntryReadScope as a, withOrderedSessionEntriesInWorker as i, createAdmittedSessionEntryCohortReader as n, captureSessionEntryWorkerRequest as o, readAdmittedSessionEntry as r, isNativeSessionEntryRead as s, captureSessionEntryNativeMutationWitness as t };
