import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { f as readDatabasePathIdentitySync, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { j as readSqliteDatabaseWriteTokenForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { n as runOpenClawAgentWorkerWrite } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { s as retainOpenClawAgentDatabaseReadCandidates } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { r as captureSessionStoreReadCandidate, t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-B6hhdgLR.mjs";
import { t as resolveSessionLifecycleTimestampsWithHeader } from "./lifecycle-timestamps-DuPaTaAj.mjs";
import { a as matchesPluginHostCleanupSession } from "./plugin-host-cleanup-DPJxrJDM.mjs";
import { n as resolveSqliteAgentId, r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { o as captureCanonicalSessionReaderContinuation } from "./session-canonical-key-B7chVWi3.mjs";
import { n as captureMemoryExactSessionReader, t as assertMemoryExactReadSource } from "./session-accessor.memory-exact-read-UNAhvKNR.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { i as retainSessionEntryReadFacts, n as readSessionEntriesWithRetainedFacts, r as readSessionEntryWithRetainedFacts, t as readRetainedSessionEntryFacts } from "./session-entry-read-facts-XUOtyCt0.mjs";
import { a as captureSessionEntryReadScope, i as withOrderedSessionEntriesInWorker, o as captureSessionEntryWorkerRequest, r as readAdmittedSessionEntry } from "./session-entry-read-ordered-ygEz3W0N.mjs";
import { r as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { g as targetDiscoveryLane, l as projectionLane } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { t as createSessionWorkerExecutionSource } from "./session-worker-execution-source-CQwDQ8va.mjs";
import { t as assertCapturedSessionEntryReadSource } from "./session-entry-read-source-CtAlEtSu.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { n as withSessionStoreTarget } from "./session-store-target-runtime-D11id0W-.mjs";
import path from "node:path";
//#region src/config/sessions/session-entry-read-writable.ts
/** Preserve logical lookup and writable open semantics on the canonical file-backed actor. */
async function readSessionEntryInWorker(input, assertCallerCurrent = () => {}, onRegistryChange, onReadTarget, reader) {
	if (reader) return readAdmittedSessionEntry(reader, input, assertCallerCurrent, onReadTarget);
	const { scope, env } = captureSessionEntryReadScope(input);
	assertCallerCurrent();
	const agentId = scope.agentId ? normalizeAgentId(scope.agentId) : parseAgentSessionKey(scope.sessionKey)?.agentId;
	let storePath = scope.storePath ? path.resolve(scope.storePath) : void 0;
	const memory = captureMemoryExactSessionReader(input, assertCallerCurrent);
	if (memory) {
		const sessionKey = resolveSqliteSessionKey(scope.sessionKey, memory.agentId);
		const entry = memory.read(sessionKey);
		onReadTarget?.({
			agentId: memory.agentId,
			env,
			storePath: memory.path,
			readSource: memory.source,
			target: {
				canonicalKey: sessionKey,
				storeKeys: [sessionKey]
			}
		});
		return entry;
	}
	if (!storePath) {
		if (!agentId) throw new Error("Cannot resolve SQLite session scope without an agent id");
		storePath = resolveOpenClawAgentSqlitePath({
			agentId,
			env
		});
	}
	const candidates = captureSessionStoreReadCandidates(storePath);
	const loadedRead = await withSessionStoreTarget({
		agentId,
		defaultAgentId: scope.defaultAgentId,
		storePath,
		env,
		candidates
	}, async (target, owner) => {
		const sessionKey = resolveSqliteSessionKey(scope.sessionKey, target.logicalAgentId);
		const options = {
			...target.database,
			env
		};
		const targetIdentity = readDatabasePathIdentitySync(options.path);
		const execution = captureOpenClawAgentDatabaseExecution(options, targetIdentity.key.startsWith("file:") ? { expectedIdentity: {
			kind: "file",
			physicalIdentity: targetIdentity.key.slice(5),
			nativeLocation: targetIdentity.canonicalPath,
			birthtime: targetIdentity.birthtime
		} } : { expectedCreationIdentity: targetIdentity });
		const assertCurrent = () => {
			execution.assertCurrent();
			owner.assertCurrent();
		};
		const source = {
			...createSessionWorkerExecutionSource(assertCurrent, "Session read authority expired"),
			onRegistryChange(change) {
				owner.onRegistryChange(change);
				onRegistryChange?.(change);
			}
		};
		let entry;
		let readTarget;
		try {
			entry = await runOpenClawAgentWorkerWrite(options, async () => {
				await owner.refreshBeforeDispatch(() => execution.assertCurrent());
				execution.assertCurrent();
				await execution.prepare(source);
				assertCurrent();
				const nativeOwner = execution.captureGenerationClaim();
				const request = { sessionKeys: [sessionKey] };
				const before = readSqliteDatabaseWriteTokenForPath(options.path);
				const cached = readRetainedSessionEntryFacts(options, request, nativeOwner);
				const selected = cached ?? await execution.runExisting(source, (worker) => worker.execute({
					type: "session.entry.read",
					input: request
				}));
				assertCurrent();
				nativeOwner.assertCurrent();
				if (!cached && selected) retainSessionEntryReadFacts(options, request, selected, before);
				return selected?.entries.find((row) => row.sessionKey === sessionKey)?.entry;
			});
			await owner.revalidateTarget();
			assertCurrent();
			if (onReadTarget) {
				const identity = execution.fileIdentity;
				if (!identity) throw new Error("Session entry read omitted its admitted database identity");
				readTarget = {
					agentId: target.logicalAgentId,
					env,
					storePath: options.path,
					readSource: {
						agentId: execution.agentId,
						path: options.path,
						databaseIdentity: identity.physicalIdentity,
						databaseBirthtime: identity.birthtime
					},
					target: {
						canonicalKey: sessionKey,
						storeKeys: [sessionKey]
					}
				};
			}
		} finally {
			await execution.release();
		}
		owner.assertCurrent();
		return {
			entry,
			readTarget,
			assertCurrent: owner.assertCurrent
		};
	}, assertCallerCurrent);
	loadedRead.assertCurrent();
	if (loadedRead.readTarget) onReadTarget?.(loadedRead.readTarget);
	return loadedRead.entry;
}
//#endregion
//#region src/config/sessions/session-entry-read-runtime.ts
/** Retain the original logical source through its asynchronous consumer and owned effects. */
async function withSessionEntryReadOnlyInWorker(input, assertCallerCurrent, consume, prepareSource, lane) {
	const memory = captureMemoryExactSessionReader(input, assertCallerCurrent);
	if (memory) {
		const entry = memory.read(input.sessionKey, input.projection);
		return consume(ok(entry), {
			kind: "incognito",
			assertCurrent: () => memory.assertCurrent(),
			source: memory.source
		});
	}
	const { scope, agentId } = captureSessionEntryReadScope(input);
	assertCallerCurrent();
	const consumeRead = async (read, owner) => {
		assertCallerCurrent();
		const value = await consume(read, owner);
		assertCallerCurrent();
		return value;
	};
	const onReadError = (error) => consumeRead(err(error), {
		kind: "unresolved",
		assertCurrent: assertCallerCurrent
	});
	const storePath = scope.storePath || agentId && resolveOpenClawAgentSqlitePath({
		agentId,
		env: scope.env
	});
	if (!storePath) return onReadError(/* @__PURE__ */ new Error("Cannot resolve SQLite session scope without an agent id"));
	return withSessionStoreReaderInWorker({
		...scope,
		agentId,
		storePath
	}, async ({ reader, database, continuation, logicalAgentId, ...owner }) => {
		const readScope = {
			agentId: logicalAgentId,
			databaseAgentId: database.agentId,
			storePath: database.path,
			env: database.env,
			sessionKey: scope.sessionKey,
			clone: scope.clone,
			defaultAgentId: scope.defaultAgentId,
			hydrateSkillPromptRefs: scope.hydrateSkillPromptRefs,
			readConsistency: scope.readConsistency,
			projection: scope.projection
		};
		const read = await readSessionEntryWithRetainedFacts(database, readScope, () => reader.readEntryResult({
			scope: readScope,
			continuation
		}));
		owner.assertCurrent();
		const value = await consumeRead(read, {
			...owner,
			kind: "file",
			scope: readScope,
			source: read.source
		});
		owner.assertCurrent();
		return value;
	}, {
		backing: true,
		lane: lane ?? projectionLane,
		dataOnly: true,
		logical: {
			assertCurrent: assertCallerCurrent,
			onReadError
		},
		prepareSource
	});
}
/** Return entry data only after the retained physical reader has finished its currentness checks. */
function readSessionEntryReadOnlyInWorker(input, assertCallerCurrent = () => {}, reader, lane) {
	if (reader) return readAdmittedSessionEntry(reader, input, assertCallerCurrent);
	return withSessionEntryReadOnlyInWorker(input, assertCallerCurrent, async (read) => {
		if (!read.ok) throw read.error;
		return read.value;
	}, void 0, lane);
}
/** Resolve a current transcript identity in the selected store without loading its siblings. */
async function readSessionEntryByIdReadOnlyInWorker(input) {
	const sessionId = input.sessionId;
	const memory = captureMemoryExactSessionReader(input);
	if (memory) return memory.readById(sessionId, input.projection, input.orderBy);
	const { scope, agentId } = captureSessionEntryReadScope({
		...input,
		sessionKey: ""
	});
	const storePath = scope.storePath || agentId && resolveOpenClawAgentSqlitePath({
		agentId,
		env: scope.env
	});
	if (!storePath) throw new Error("Cannot resolve SQLite session scope without an agent id");
	return withSessionStoreReaderInWorker({
		...scope,
		agentId,
		storePath
	}, async ({ reader, database, continuation, assertCurrent }) => {
		const read = await reader.readExactEntries({
			selection: {
				kind: "session-id",
				sessionId,
				orderBy: input.orderBy
			},
			projection: "full",
			env: database.env,
			continuation
		});
		assertCurrent();
		return read.entries[0];
	}, {
		backing: true,
		dataOnly: true
	});
}
/** Envelope timestamps are descriptive reads; missing stores remain absent. */
async function readSessionUpdatedAtInWorker(input) {
	return (await readSessionEntryReadOnlyInWorker({
		...input,
		projection: "list"
	}))?.updatedAt;
}
/** Retain one metadata inventory; the worker checks its native revision before reusing it. */
function createSessionEntryListReader(input) {
	const memory = captureMemoryExactSessionReader(input);
	if (memory) return async () => ({
		entries: memory.entries("list"),
		assertCurrent: () => memory.assertCurrent()
	});
	const scope = {
		...input,
		env: cloneEnvWithPlatformSemantics(input.env ?? process.env)
	};
	let snapshot = {
		kind: "session-entry-list",
		entries: []
	};
	let pending;
	return () => {
		if (pending) return pending;
		pending = withSessionStoreReaderInWorker(scope, async ({ reader, database, continuation, assertCurrent }) => {
			const result = await reader.readEntries({
				agentId: database.agentId,
				storePath: database.path,
				env: database.env,
				projection: "list",
				includeParticipants: false,
				hydrateSkillPromptRefs: false
			}, continuation, void 0, snapshot.revision);
			assertCurrent();
			if (!result.unchanged) snapshot = result;
			const source = result.source;
			return {
				entries: snapshot.entries,
				assertCurrent: () => {
					if (source) assertCapturedSessionEntryReadSource(source);
				}
			};
		}, {
			backing: true,
			dataOnly: true,
			capturePhysicalSource: true,
			lane: projectionLane
		}).finally(() => {
			pending = void 0;
		});
		return pending;
	};
}
/** Read descriptive summaries through the original store selection and reader lifetime. */
async function readSessionEntrySummariesInWorker(input) {
	const memory = captureMemoryExactSessionReader(input);
	if (memory) return memory.entries("list").filter(({ sessionKey, entry }) => matchesPluginHostCleanupSession(sessionKey, entry, input.cleanupSession));
	const { scope } = captureSessionEntryReadScope({
		...input,
		sessionKey: ""
	});
	return withSessionStoreReaderInWorker({
		...input,
		env: scope.env,
		storePath: scope.storePath ?? input.storePath
	}, async ({ reader, database, continuation, assertCurrent }) => {
		assertCurrent();
		const { entries } = await reader.readEntries({
			agentId: database.agentId,
			storePath: database.path,
			env: database.env,
			projection: "list",
			cleanupSession: input.cleanupSession,
			hydrateSkillPromptRefs: false,
			readConsistency: input.readConsistency
		}, continuation);
		assertCurrent();
		return entries;
	}, {
		backing: true,
		dataOnly: true
	});
}
/** Keep every discovered database and original admission alive through one synchronous consumer. */
async function withSessionEntriesFromStoresInWorker(inputs, consume, options) {
	const originalInputs = [...inputs];
	const capturedInputs = originalInputs.map((input) => {
		const captured = {
			...input,
			env: cloneEnvWithPlatformSemantics(input.env ?? process.env),
			snapshotFields: input.snapshotFields?.slice(),
			preparedSource: input.preparedSource && { ...input.preparedSource }
		};
		if (captured.selection) captured.selection = captured.selection.kind === "children" ? {
			...captured.selection,
			parentSessionKeys: [...captured.selection.parentSessionKeys]
		} : { ...captured.selection };
		else captured.sessionKeys = [...captured.sessionKeys];
		return captured;
	});
	if (options?.ordered && !capturedInputs.some((input) => captureMemoryExactSessionReader(input))) return withOrderedSessionEntriesInWorker(capturedInputs, consume, {
		readStore: (input, read) => withSessionStoreReaderInWorker(input, read, {
			lane: targetDiscoveryLane,
			prepareSource: options.prepareSource?.bind(options, originalInputs[capturedInputs.indexOf(input)])
		}),
		onReadAdmitted: options.onReadAdmitted
	});
	const reads = [];
	const enter = (index) => {
		const input = capturedInputs[index];
		if (input) return withSessionEntriesFromStoreInWorker(input, async (read) => {
			reads.push(read);
			try {
				return await enter(index + 1);
			} finally {
				reads.pop();
			}
		}, false, options?.prepareSource && ((...source) => options.prepareSource(originalInputs[index], ...source)));
		for (const read of reads) read.assertCurrent();
		const result = consume(reads);
		if (isPromiseLike(result)) {
			Promise.resolve(result).catch(() => {});
			throw new Error("Session entry read consumers must remain synchronous");
		}
		return Promise.resolve(result);
	};
	return enter(0);
}
/** The ordinary return API returns data, never a retained authority claim. */
function readSessionEntriesFromStoreInWorker(input, prepareSource) {
	return withSessionEntriesFromStoreInWorker(input, async (read) => read.result, true, prepareSource);
}
async function withSessionEntriesFromStoreInWorker(input, consume, dataOnly = false, prepareSource) {
	const memory = captureMemoryExactSessionReader(input);
	if (memory) {
		assertMemoryExactReadSource(input.preparedSource, memory.source);
		const projection = input.snapshotFields ?? (!input.projection || input.projection === "full" ? "full" : "list");
		const selection = input.selection;
		let entries;
		if (!selection) entries = input.sessionKeys.flatMap((key) => {
			const sessionKey = resolveSqliteSessionKey(key, memory.agentId);
			const entry = memory.read(sessionKey, projection);
			return entry ? [{
				sessionKey,
				entry
			}] : [];
		});
		else if (selection.kind === "session-id") {
			const selected = memory.readById(selection.sessionId, projection, selection.orderBy);
			entries = selected ? [selected] : [];
		} else if (selection.kind === "children") entries = memory.children(selection.parentSessionKeys, projection);
		else {
			entries = memory.entries(projection).filter(({ sessionKey, entry }) => !isInternalSessionEffectsKey(sessionKey) && (selection.kind === "label" ? entry.label === selection.label : sessionKey === selection.sessionIdOrKey || entry.sessionId === selection.sessionIdOrKey));
			entries.sort((left, right) => left.sessionKey < right.sessionKey ? -1 : left.sessionKey > right.sessionKey ? 1 : 0);
		}
		const facts = new Map(entries.map(({ sessionKey }) => [sessionKey, memory.facts(sessionKey)]));
		const database = {
			agentId: memory.agentId,
			path: memory.path,
			env: input.env ?? process.env
		};
		return consume({
			result: {
				kind: "session-exact-entries",
				entries,
				source: memory.source,
				lifecycleTimestamps: resolveSessionLifecycleTimestampsWithHeader({
					entry: entries.find(({ sessionKey }) => sessionKey === input.lifecycleSessionKey)?.entry,
					readHeader: () => void 0
				}),
				...input.includeMembers ? { members: Object.fromEntries([...facts].map(([key, value]) => [key, value.members])) } : {},
				...input.includeParticipantRecords ? { participantRecords: Object.fromEntries([...facts].map(([key, value]) => [key, value.participants])) } : {},
				...input.includeAuthorization && memory.source ? { databaseIdentity: {
					identity: memory.source.databaseIdentity,
					incarnation: memory.source.databaseIdentity,
					filename: memory.path
				} } : {},
				...input.projection === "sharing" && memory.source ? { sharing: {
					source: database,
					databaseIdentity: memory.source.databaseIdentity,
					placeholders: [],
					members: [...facts].map(([sessionKey, value]) => ({
						sessionKey,
						identityIds: value.members.map((member) => member.identityId)
					}))
				} } : {}
			},
			database,
			assertCurrent: () => memory.assertCurrent()
		});
	}
	const request = captureSessionEntryWorkerRequest(input);
	return withSessionStoreReaderInWorker(input, async ({ reader, database, continuation, assertCurrent }) => {
		assertCurrent();
		const result = await readSessionEntriesWithRetainedFacts(database, request, () => reader.readExactEntries({
			...request,
			env: database.env,
			continuation
		}));
		assertCurrent();
		return consume({
			result,
			database,
			assertCurrent
		});
	}, {
		backing: input.projection === "list",
		lane: projectionLane,
		dataOnly,
		prepareSource
	});
}
async function withSessionStoreReaderInWorker(input, read, { backing = false, lane, dataOnly = false, logical, prepareSource, capturePhysicalSource = false } = {}) {
	const env = cloneEnvWithPlatformSemantics(input.env ?? process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const agentId = input.agentId === void 0 ? void 0 : normalizeAgentId(input.agentId);
	const storePath = input.storePath;
	const preparedSource = input.preparedSource && { ...input.preparedSource };
	const readLane = lane ?? (input.projection === "sharing" ? projectionLane : void 0);
	preparedSource?.assertCurrent();
	logical?.assertCurrent?.();
	const onReadError = logical?.onReadError;
	const target = resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath);
	let candidates;
	let direct;
	try {
		const captured = !preparedSource && !logical && target.agentId ? captureSessionStoreReadCandidate(target.path) : void 0;
		direct = captured && captured.path === captured.physicalPath ? captured : void 0;
		candidates = direct ? [direct] : captureSessionStoreReadCandidates(storePath);
	} catch (error) {
		if (!onReadError) throw error;
		return onReadError(error);
	}
	const native = backing ? retainOpenClawAgentDatabaseReadCandidates(candidates.flatMap((candidate) => [candidate, {
		...candidate,
		path: candidate.physicalPath
	}]), env) : void 0;
	const continuations = [];
	const assertSourcesCurrent = () => {
		logical?.assertCurrent?.();
		if (logical || preparedSource) for (const { owner } of continuations) owner.assertCurrent();
	};
	let assertFinalCurrent;
	try {
		for (const database of native?.databases ?? []) {
			const owner = captureCanonicalSessionReaderContinuation(database);
			if (owner) continuations.push({
				path: captureSessionStoreReadCandidate(database.path).physicalPath,
				owner
			});
		}
		const readDatabase = async (database, logicalAgentId, sourcePath, route) => {
			const continuation = continuations.find((item) => item.path === database.path && (!logical || item.owner.receipt.agentId === database.agentId))?.owner;
			let sourceIdentity = prepareSource || capturePhysicalSource ? readDatabasePathIdentitySync(database.path) : void 0;
			const preparedDatabase = {
				...database,
				env: { ...env }
			};
			let sourcePrepared = false;
			const prepareRead = () => {
				if (sourcePrepared || !sourceIdentity) return;
				if (sourceIdentity.birthtime === void 0) sourceIdentity = readDatabasePathIdentitySync(database.path);
				prepareSource?.(preparedDatabase, sourceIdentity);
				sourcePrepared = true;
			};
			return withSessionHistoryWorkerDatabase({
				...database,
				requestedPaths: [storePath, sourcePath],
				env,
				prepareRead
			}, async (reader) => {
				const assertCapturedCurrent = () => {
					assertSourcesCurrent();
					reader.assertCurrent();
					continuation?.assertCurrent();
					route.assertCurrent();
					if (sourceIdentity?.key.startsWith("file:")) assertExistingDatabaseIdentity(database.path, sourceIdentity.key, sourceIdentity.birthtime);
				};
				if (dataOnly && (logical?.assertCurrent || preparedSource)) assertFinalCurrent = assertCapturedCurrent;
				assertCapturedCurrent();
				if (sourceIdentity?.birthtime !== void 0) prepareRead();
				return await read({
					...route,
					reader,
					database: preparedDatabase,
					logicalAgentId,
					selectedStore: Object.freeze({
						path: sourcePath,
						physicalPath: database.path
					}),
					continuation: continuation?.receipt,
					assertCurrent: assertCapturedCurrent
				});
			}, readLane);
		};
		let result;
		if (preparedSource) {
			const assertPreparedCurrent = () => {
				preparedSource.assertCurrent();
				assertSessionStoreReadCandidate(preparedSource.path, candidates);
			};
			assertPreparedCurrent();
			result = await readDatabase({
				agentId: preparedSource.agentId,
				path: assertSessionStoreReadCandidate(preparedSource.path, candidates)
			}, agentId ?? preparedSource.agentId, preparedSource.path, { assertCurrent: assertPreparedCurrent });
		} else if (direct && target.agentId) {
			resolveSqliteAgentId({
				scopedAgentId: agentId,
				storeAgentId: target.agentId
			});
			result = await readDatabase({
				agentId: target.agentId,
				path: direct.physicalPath
			}, agentId ?? target.agentId, target.path, { assertCurrent: assertSourcesCurrent });
		} else result = await withSessionStoreTarget({
			agentId,
			defaultAgentId: input.defaultAgentId,
			storePath,
			env,
			candidates
		}, async (selected, owner) => readDatabase(selected.database, selected.logicalAgentId, selected.sourcePath, owner), assertSourcesCurrent, onReadError && (async (error, assertDiscoveryCurrent) => {
			assertFinalCurrent = () => {
				assertSourcesCurrent();
				assertDiscoveryCurrent();
			};
			assertFinalCurrent();
			const value = await onReadError(error);
			assertFinalCurrent();
			return value;
		}));
		assertFinalCurrent?.();
		return result;
	} finally {
		for (const { owner } of continuations.toReversed()) owner.release();
		native?.release();
	}
}
//#endregion
export { readSessionEntrySummariesInWorker as a, withSessionEntriesFromStoresInWorker as c, readSessionEntryInWorker as d, readSessionEntryReadOnlyInWorker as i, withSessionEntryReadOnlyInWorker as l, readSessionEntriesFromStoreInWorker as n, readSessionUpdatedAtInWorker as o, readSessionEntryByIdReadOnlyInWorker as r, withSessionEntriesFromStoreInWorker as s, createSessionEntryListReader as t, withSessionStoreReaderInWorker as u };
