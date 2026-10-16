import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath, i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { w as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { n as assertAgentDatabaseAdmitted } from "./agent-database-admission-dWNS6Rcs.mjs";
import { m as listOpenIncognitoAgentDatabases } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { l as retainOpenClawAgentDatabaseReadCandidates } from "./openclaw-agent-db-DBug3LUA.mjs";
import { i as runOpenClawAgentWriteAdmissions, n as runOpenClawAgentWorkerWrite } from "./openclaw-agent-write-admission-CKOCIcah.mjs";
import { t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { c as captureSessionStoreReadCandidate, s as assertSessionStoreReadCandidate } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { n as resolveSqliteAgentId, r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { l as maintenanceLane, s as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-EUbUbAQu.mjs";
import { s as captureCanonicalSessionReaderContinuation } from "./session-canonical-key-D1TSJMmX.mjs";
import { l as loadSessionEntryReadOnlyResultInScope } from "./session-accessor.sqlite-exact-read-JW6IveXD.mjs";
import { r as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-DfxRHzep.mjs";
import { t as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-jgvuh1fV.mjs";
import { a as loadSessionEntry, b as withSessionStoreTarget } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-Dj6Sq0En.mjs";
import { a as matchesPluginHostCleanupSession } from "./plugin-host-cleanup-tR73X5Oy.mjs";
import path from "node:path";
//#region src/config/sessions/session-entry-read-ordered.ts
/** Native effects retain existing writer FIFO order through their synchronous consumer. */
async function withOrderedSessionEntriesInWorker(inputs, consume, readStore) {
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
			let changed = false;
			const unsubscribe = sessionChanges.subscribeFacts((change) => {
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
				if (changed) throw new Error("Session entry changed during read");
			};
			try {
				const reads = [];
				for (const { input: selectedInput, owner, database, continuation } of selected) {
					assertCurrent();
					const selection = selectedInput.selection ? {
						selection: selectedInput.selection,
						projection: selectedInput.projection
					} : {
						sessionKeys: [...new Set(selectedInput.sessionKeys)],
						projection: selectedInput.projection
					};
					const result = await owner.readExactEntries({
						...selection,
						lifecycleSessionKey: selectedInput.lifecycleSessionKey,
						includeMembers: selectedInput.includeMembers,
						includeParticipantRecords: selectedInput.includeParticipantRecords,
						includeAuthorization: selectedInput.includeAuthorization,
						env: database.env,
						continuation
					});
					assertCurrent();
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
		});
	};
	return enter(0);
}
//#endregion
//#region src/config/sessions/session-entry-read-runtime.ts
function captureSessionEntryReadScope(input) {
	const env = cloneEnvWithPlatformSemantics(input.env ?? process.env);
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
	return Boolean(isIncognitoSessionKey(scope.sessionKey) || storePath && (isIncognitoOpenClawAgentSqlitePath(storePath, {
		agentId: agentId ?? scope.defaultAgentId ?? "main",
		env: scope.env
	}) || listOpenIncognitoAgentDatabases().some((owner) => owner.storePath === storePath)));
}
/** Retain the original logical source through its asynchronous consumer and owned effects. */
async function withSessionEntryReadOnlyInWorker(input, assertCallerCurrent, consume) {
	const { scope, agentId } = captureSessionEntryReadScope(input);
	assertCallerCurrent();
	if (isNativeSessionEntryRead(scope, agentId)) {
		const read = loadSessionEntryReadOnlyResultInScope(scope);
		assertCallerCurrent();
		const result = await consume(read, {
			kind: "native",
			assertCurrent: assertCallerCurrent
		});
		assertCallerCurrent();
		return result;
	}
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
			...scope,
			agentId: logicalAgentId,
			databaseAgentId: database.agentId,
			storePath: database.path,
			env: database.env
		};
		const read = await reader.readEntryResult({
			scope: readScope,
			continuation
		});
		owner.assertCurrent();
		const value = await consumeRead(read, {
			...owner,
			kind: "file",
			scope: readScope
		});
		owner.assertCurrent();
		return value;
	}, {
		backing: true,
		dataOnly: true,
		logical: {
			assertCurrent: assertCallerCurrent,
			onReadError
		}
	});
}
/** Diagnostic identities name the default agent store, not a logical store locator. */
async function withSessionDiagnosticTextInWorker(input, assertCurrent, consume) {
	const { scope, env } = captureSessionEntryReadScope(input);
	const agentId = normalizeAgentId(input.agentId);
	assertCurrent();
	if (isIncognitoSessionKey(scope.sessionKey)) {
		consume(void 0);
		return;
	}
	const storePath = resolveOpenClawAgentSqlitePath({
		agentId,
		env
	});
	const admission = resolveSessionTranscriptReadFence(input);
	await withSessionHistoryWorkerDatabase({
		agentId,
		path: storePath,
		env
	}, async (owner) => {
		assertCurrent();
		const text = await owner.readDiagnosticText({
			scope: {
				...scope,
				agentId,
				databaseAgentId: agentId,
				storePath,
				sessionId: input.sessionId
			},
			admission
		});
		owner.assertCurrent();
		assertCurrent();
		consume(text);
	}, maintenanceLane);
}
/** Preserve logical lookup and writable open semantics on the canonical file-backed actor. */
async function readSessionEntryInWorker(input, assertCallerCurrent, onRegistryChange) {
	const env = cloneEnvWithPlatformSemantics(input.env ?? process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const scope = {
		...input,
		env
	};
	assertCallerCurrent();
	const agentId = scope.agentId ? normalizeAgentId(scope.agentId) : parseAgentSessionKey(scope.sessionKey)?.agentId;
	let storePath = scope.storePath ? path.resolve(scope.storePath) : void 0;
	if (isNativeSessionEntryRead(scope, agentId)) return loadSessionEntry(scope);
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
			assertCurrent,
			onRegistryChange(change) {
				owner.onRegistryChange(change);
				onRegistryChange?.(change);
			},
			createAdmission(binding) {
				return () => ({
					nativeLocations: binding.nativeLocations,
					admission: createSqliteWorkerOperationAdmission((request, grant) => {
						binding.authorize(request);
						assertCurrent();
						if (!grant()) throw new Error("Session read authority expired");
					}, binding.attachment)
				});
			}
		};
		let entry;
		try {
			entry = await runOpenClawAgentWorkerWrite(options, async () => {
				await owner.refreshBeforeDispatch(() => execution.assertCurrent());
				execution.assertCurrent();
				await execution.prepare(source);
				return execution.runExisting(source, (worker) => worker.execute({
					type: "session.entry.read",
					input: { sessionKey }
				}));
			});
			await owner.revalidateTarget();
			assertCurrent();
		} finally {
			await execution.release();
		}
		owner.assertCurrent();
		return {
			entry,
			assertCurrent: owner.assertCurrent
		};
	}, assertCallerCurrent);
	loadedRead.assertCurrent();
	return loadedRead.entry;
}
/** Read descriptive summaries through the original store selection and reader lifetime. */
async function readSessionEntrySummariesInWorker(input) {
	const { scope, agentId } = captureSessionEntryReadScope({
		...input,
		sessionKey: ""
	});
	if (isNativeSessionEntryRead(scope, agentId)) return listSessionEntriesReadOnly({
		...scope,
		clone: false,
		projection: "list",
		hydrateSkillPromptRefs: false
	}).filter(({ sessionKey, entry }) => matchesPluginHostCleanupSession(sessionKey, entry, input.cleanupSession)).map(({ sessionKey, entry }) => ({
		sessionKey,
		entry: structuredClone(entry)
	}));
	return withSessionStoreReaderInWorker({
		...input,
		env: scope.env,
		storePath: scope.storePath ?? input.storePath
	}, async ({ reader, database, continuation, assertCurrent }) => {
		assertCurrent();
		const entries = await reader.readEntries({
			agentId: database.agentId,
			storePath: database.path,
			env: database.env,
			projection: "list",
			cleanupSession: input.cleanupSession,
			hydrateSkillPromptRefs: false
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
	if (options?.ordered) return withOrderedSessionEntriesInWorker(inputs, consume, withSessionStoreReaderInWorker);
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
function readSessionEntriesFromStoreInWorker(input, prepareSource) {
	return withSessionEntriesFromStoreInWorker(input, async (read) => read.result, true, prepareSource);
}
async function withSessionEntriesFromStoreInWorker(input, consume, dataOnly = false, prepareSource) {
	const request = {
		...input.selection ? {
			selection: input.selection,
			projection: input.projection
		} : {
			sessionKeys: [...new Set(input.sessionKeys)],
			projection: input.projection
		},
		lifecycleSessionKey: input.lifecycleSessionKey,
		includeMembers: input.includeMembers,
		includeParticipantRecords: input.includeParticipantRecords,
		includeAuthorization: input.includeAuthorization
	};
	return withSessionStoreReaderInWorker(input, async ({ reader, database, continuation, assertCurrent }) => {
		prepareSource?.(database);
		assertCurrent();
		const result = await reader.readExactEntries({
			...request,
			env: database.env,
			continuation
		});
		assertCurrent();
		return consume({
			result,
			database,
			assertCurrent
		});
	}, {
		backing: input.projection === "list",
		dataOnly
	});
}
/** Keep the physical reader owner through a registry maintenance consumer and its commit guard. */
function withSessionRegistryEntriesInWorker(input, consume) {
	assertAgentDatabaseAdmitted(input.agentId, { env: input.env });
	return withSessionStoreReaderInWorker(input, async ({ reader, database, assertCurrent: assertReaderCurrent }) => {
		const assertCurrent = () => {
			assertAgentDatabaseAdmitted(input.agentId, { env: database.env });
			assertAgentDatabaseAdmitted(database.agentId, { env: database.env });
			assertReaderCurrent();
		};
		assertCurrent();
		const entries = await reader.readEntries({
			agentId: database.agentId,
			storePath: database.path,
			env: database.env,
			cronRetention: true
		});
		assertCurrent();
		return await consume(entries, assertCurrent);
	}, { lane: maintenanceLane });
}
/** Return owned full entries only for expired cron runs; live deletion guards stay on the host. */
async function readExpiredCronRunEntriesInWorker(input) {
	const expiredCronRuns = {
		agentId: normalizeAgentId(input.agentId),
		updatedBefore: input.updatedBefore
	};
	assertAgentDatabaseAdmitted(expiredCronRuns.agentId, { env: input.env });
	return withSessionStoreReaderInWorker(input, async ({ reader, database, assertCurrent }) => {
		const assertAdmitted = () => {
			assertAgentDatabaseAdmitted(expiredCronRuns.agentId, { env: database.env });
			assertAgentDatabaseAdmitted(database.agentId, { env: database.env });
		};
		assertAdmitted();
		const entries = await reader.readEntries({
			agentId: database.agentId,
			storePath: database.path,
			env: database.env,
			expiredCronRuns
		});
		assertAdmitted();
		assertCurrent();
		return entries;
	}, {
		lane: maintenanceLane,
		dataOnly: true
	});
}
async function withSessionStoreReaderInWorker(input, read, { backing = false, lane, dataOnly = false, logical } = {}) {
	const env = cloneEnvWithPlatformSemantics(input.env ?? process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const agentId = input.agentId === void 0 ? void 0 : normalizeAgentId(input.agentId);
	const storePath = input.storePath;
	logical?.assertCurrent?.();
	const onReadError = logical?.onReadError;
	const target = resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath);
	let candidates;
	let direct;
	try {
		const captured = !logical && target.agentId ? captureSessionStoreReadCandidate(target.path) : void 0;
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
	let sourceActive = true;
	const assertSourcesCurrent = () => {
		if (!sourceActive) throw new Error("Session entry read source is no longer active");
		logical?.assertCurrent?.();
		if (logical) {
			for (const candidate of candidates) if (captureSessionStoreReadCandidate(candidate.path, candidate.scope).physicalPath !== candidate.physicalPath) throw new Error("Session store alias changed during discovery; retry the read.");
			for (const { owner } of continuations) owner.assertCurrent();
		}
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
			return withSessionHistoryWorkerDatabase({
				...database,
				env
			}, async (reader) => {
				let active = true;
				const assertCapturedCurrent = () => {
					assertSourcesCurrent();
					reader.assertCurrent();
					continuation?.assertCurrent();
					route.assertCurrent();
				};
				if (dataOnly) assertFinalCurrent = assertCapturedCurrent;
				const assertCurrent = () => {
					if (!active) throw new Error("Session entry read consumer is no longer active");
					assertCapturedCurrent();
				};
				try {
					assertCurrent();
					return await read({
						...route,
						reader,
						database: {
							...database,
							env: { ...env }
						},
						logicalAgentId,
						selectedStore: Object.freeze({
							path: sourcePath,
							physicalPath: database.path
						}),
						continuation: continuation?.receipt,
						assertCurrent
					});
				} finally {
					active = false;
				}
			}, lane);
		};
		let result;
		if (direct && target.agentId) {
			resolveSqliteAgentId({
				scopedAgentId: agentId,
				storeAgentId: target.agentId
			});
			result = await readDatabase({
				agentId: target.agentId,
				path: direct.physicalPath
			}, agentId ?? target.agentId, target.path, { assertCurrent: () => {
				assertSessionStoreReadCandidate(target.path, candidates);
			} });
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
		}), { lane });
		assertFinalCurrent?.();
		return result;
	} finally {
		sourceActive = false;
		for (const { owner } of continuations.toReversed()) owner.release();
		native?.release();
	}
}
//#endregion
export { readSessionEntryInWorker as a, withSessionEntriesFromStoreInWorker as c, withSessionRegistryEntriesInWorker as d, withSessionStoreReaderInWorker as f, readSessionEntriesFromStoreInWorker as i, withSessionEntriesFromStoresInWorker as l, isNativeSessionEntryRead as n, readSessionEntrySummariesInWorker as o, readExpiredCronRunEntriesInWorker as r, withSessionDiagnosticTextInWorker as s, captureSessionEntryReadScope as t, withSessionEntryReadOnlyInWorker as u };
