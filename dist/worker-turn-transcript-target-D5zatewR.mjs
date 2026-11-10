import { o as composeSessionSourceAssertion, u as releaseSessionSourceAuthorities } from "./session-source-authority-fdILH-PW.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { d as withOpenClawAgentDatabaseRuntime } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { A as projectSessionSharingEntry, g as retainPreparedSessionEntryPredicate, v as retainPreparedSessionSharingFacts } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { a as readCapturedSessionActorEntry, n as captureSessionActorStorageOwner, o as runWithSessionActorStorage, t as acquireSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { r as retainSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/gateway/worker-environments/worker-turn-transcript-target.ts
const preparedWorkerTranscript = new AsyncLocalStorage();
/** Keep receipt-published facts alive from the worker read through the final effect. */
async function prepareWorkerTranscript(target, assertPreparing) {
	let facts;
	let predicate;
	let settlementPredicate;
	let source;
	let prepared;
	try {
		return await withSessionEntryReadOnlyInWorker(target, assertPreparing, async (read, owner) => {
			if (!read.ok) throw read.error;
			if (!source || !facts || !owner.scope) throw new Error("Cloud worker transcript has no durable source");
			const snapshot = facts.initialize({
				entry: read.value && projectSessionSharingEntry(read.value),
				membership: /* @__PURE__ */ new Set()
			});
			const databaseIdentity = `file:${source.databaseIdentity}`;
			const retainPredicate = (writerBound) => retainPreparedSessionEntryPredicate({
				databaseIdentity,
				sessionKey: target.sessionKey,
				entry: snapshot.entry,
				matches: (before, after) => before?.sessionId === after?.sessionId && before?.lifecycleRevision === after?.lifecycleRevision && (!writerBound || before?.activeWriterRunId === after?.activeWriterRunId) && before?.archivedAt === after?.archivedAt
			});
			predicate = retainPredicate(target.expectedWriterRunId !== void 0);
			settlementPredicate = target.expectedWriterRunId === void 0 ? predicate : retainPredicate(false);
			facts.release();
			const currentFacts = predicate;
			const settlementFacts = settlementPredicate;
			const env = owner.scope.env ?? process.env;
			const retained = retainSessionHistoryWorkerDatabase({
				agentId: source.agentId,
				path: source.path,
				env
			});
			let active = true;
			prepared = {
				target: {
					...target,
					storePath: source.path
				},
				source,
				env,
				readCurrent: (requested) => (requested.expectedWriterRunId === void 0 ? settlementFacts : currentFacts).readCurrent()?.entry,
				assertCurrent: () => {
					if (!active) throw new Error("Cloud worker transcript authority has been released");
					retained.owner.assertCurrent();
				},
				release: () => {
					active = false;
					currentFacts.release();
					settlementFacts.release();
					return retained.release();
				}
			};
			return prepared;
		}, (database, identity) => {
			if (!identity.key.startsWith("file:")) throw new Error("Cloud worker transcript has no durable source");
			source = {
				agentId: database.agentId,
				path: database.path,
				databaseIdentity: identity.key.slice(5),
				databaseBirthtime: identity.birthtime
			};
			facts = retainPreparedSessionSharingFacts({
				databaseIdentity: identity.key,
				sessionKey: target.sessionKey,
				acquiring: true
			});
		});
	} catch (error) {
		if (prepared) await releaseSessionSourceAuthorities([prepared], [error]);
		else {
			facts?.release();
			predicate?.release();
			settlementPredicate?.release();
		}
		throw error;
	}
}
function findPreparedTranscript(target) {
	const prepared = preparedWorkerTranscript.getStore();
	if (!prepared || prepared.target.agentId !== target.agentId || prepared.target.sessionKey !== target.sessionKey || path.resolve(prepared.target.storePath) !== path.resolve(target.storePath)) return;
	return prepared;
}
function currentPreparedTranscript(target, prepared = findPreparedTranscript(target)) {
	if (!prepared) throw new Error("Cloud worker transcript requires prepared authority");
	prepared.assertCurrent();
	return prepared;
}
function captureWorkerTurnTranscriptTarget(turn) {
	if (!turn.sessionTarget?.agentId || !turn.sessionTarget.sessionId || !turn.sessionTarget.sessionKey || !turn.sessionTarget.storePath) throw new Error("Cloud worker turn is missing its transcript identity");
	if (turn.sessionTarget.sessionId !== turn.sessionId) throw new Error("Cloud worker transcript identity does not match the active turn");
	const targetKeyAgentId = parseAgentSessionKey(turn.sessionTarget.sessionKey)?.agentId;
	if (turn.agentId && turn.sessionTarget.agentId !== turn.agentId || turn.sessionKey && turn.sessionTarget.sessionKey !== turn.sessionKey || targetKeyAgentId && targetKeyAgentId !== turn.sessionTarget.agentId) throw new Error("Cloud worker transcript identity does not match the active turn");
	return {
		agentId: turn.sessionTarget.agentId,
		sessionId: turn.sessionId,
		sessionKey: turn.sessionTarget.sessionKey,
		storePath: turn.sessionTarget.storePath,
		expectedLifecycleRevision: turn.sessionTarget.expectedLifecycleRevision,
		expectedWriterRunId: turn.sessionTarget.expectedWriterRunId
	};
}
function resolveWorkerTurnTranscriptTarget(turn) {
	const target = captureWorkerTurnTranscriptTarget(turn);
	const memory = captureSessionActorStorageOwner(target, {
		assertCurrent() {},
		authorize() {}
	});
	const currentEntry = memory ? readCapturedSessionActorEntry(memory, target.sessionKey) : currentPreparedTranscript(target).readCurrent(target);
	const mismatchedFields = [
		currentEntry?.sessionId !== target.sessionId ? "sessionId" : void 0,
		target.expectedLifecycleRevision !== void 0 && currentEntry?.lifecycleRevision !== target.expectedLifecycleRevision ? "lifecycleRevision" : void 0,
		target.expectedWriterRunId !== void 0 && currentEntry?.activeWriterRunId !== target.expectedWriterRunId ? "activeWriterRunId" : void 0
	].filter((field) => field !== void 0);
	if (!currentEntry || mismatchedFields.length > 0) throw new Error(`Cloud worker transcript identity is no longer current (target resolution: ${currentEntry ? `mismatched ${mismatchedFields.join(", ")}` : "missing projection"})`);
	return target;
}
/** Keep the chosen session backend through worker turn settlement. */
async function withWorkerTurnTranscriptDatabase(turn, controls, run) {
	const captured = captureWorkerTurnTranscriptTarget(turn);
	const target = {
		...captured,
		storePath: path.resolve(captured.storePath)
	};
	let executing = false;
	let authority;
	const assertPreparing = () => {
		if (executing) return;
		controls.signal?.throwIfAborted();
		if (authority && !authority.isCurrent()) throw new Error("Cloud worker placement authority changed during preparation");
	};
	const memory = captureSessionActorStorageOwner(target, {
		assertCurrent: assertPreparing,
		authorize: assertPreparing
	});
	const runAdmitted = async (pinned) => {
		controls.assertCurrent();
		const current = resolveWorkerTurnTranscriptTarget({
			...pinned,
			sessionTarget: pinned
		});
		executing = true;
		const originalSessionTarget = turn.sessionTarget;
		turn.sessionTarget = current;
		try {
			return await run(current);
		} finally {
			turn.sessionTarget = originalSessionTarget;
		}
	};
	controls.assertCurrent();
	if (memory) {
		const acquired = await acquireSessionActorStorage(target, {
			authority: memory.authority,
			lifetime: {
				assertCurrent: assertPreparing,
				assertReadable: assertPreparing
			}
		});
		if (!acquired) throw new Error("Cloud worker transcript identity is no longer current");
		try {
			authority = await controls.prepareAuthority();
			assertPreparing();
			return await runWithSessionActorStorage(acquired, () => runAdmitted(target));
		} finally {
			authority?.release();
			authority = void 0;
			await acquired.actor.release();
		}
	}
	const prepared = await prepareWorkerTranscript(target, assertPreparing);
	try {
		authority = await controls.prepareAuthority();
		try {
			controls.assertCurrent();
			const assertAdmission = () => {
				prepared.assertCurrent();
				assertPreparing();
			};
			return await withOpenClawAgentDatabaseRuntime({
				agentId: prepared.source.agentId,
				path: prepared.source.path,
				env: prepared.env
			}, () => {
				assertAdmission();
				return preparedWorkerTranscript.run(prepared, () => runAdmitted(prepared.target));
			}, assertAdmission, controls.signal);
		} finally {
			authority.release();
			authority = void 0;
		}
	} finally {
		await prepared.release();
	}
}
/** Reuse the accepted turn identity as a transaction-local source predicate. */
function captureWorkerTurnTranscriptSource(target, predicate) {
	const memory = captureSessionActorStorageOwner(target, {
		assertCurrent() {},
		authorize() {}
	});
	const expected = predicate ? { ...predicate.expected } : {
		sessionId: target.sessionId,
		...target.expectedLifecycleRevision !== void 0 ? { lifecycleRevision: target.expectedLifecycleRevision } : {},
		...target.expectedWriterRunId !== void 0 ? { activeWriterRunId: target.expectedWriterRunId } : {}
	};
	const fields = predicate ? [...predicate.fields] : [
		"sessionId",
		"lifecycleRevision",
		"activeWriterRunId"
	].filter((field) => Object.hasOwn(expected, field));
	const refuse = predicate?.refuse ?? ((facts) => {
		throw new Error(`Cloud worker transcript identity is no longer current (source callback: ${facts === void 0 ? "worker predicate rejected" : facts.entry ? `mismatched ${fields.filter((field) => facts.entry?.[field] !== expected[field]).join(", ")}` : "missing projection"})`);
	});
	const assertEntry = (entry) => {
		if (!entry || fields.some((field) => entry[field] !== expected[field])) refuse({ entry });
	};
	if (memory) return () => assertEntry(readCapturedSessionActorEntry(memory, target.sessionKey));
	const captured = findPreparedTranscript(target);
	const assertCurrent = () => assertEntry(currentPreparedTranscript(target, captured).readCurrent(target));
	return Object.assign(assertCurrent, { async prepareSessionSource() {
		const current = captured ?? findPreparedTranscript(target);
		const prepared = current ?? await prepareWorkerTranscript(target, () => {});
		try {
			prepared.assertCurrent();
			return {
				assertCurrent: prepared.assertCurrent,
				checks: [{
					predicate: {
						source: prepared.source,
						sessionKey: target.sessionKey,
						fields,
						expected
					},
					refuse
				}],
				release: current ? void 0 : prepared.release
			};
		} catch (error) {
			if (!current) await releaseSessionSourceAuthorities([prepared], [error]);
			throw error;
		}
	} });
}
/** Callers retaining a source outside a turn must own its prepared lifetime. */
async function prepareWorkerTurnTranscriptSource(...args) {
	const source = captureWorkerTurnTranscriptSource(...args);
	const prepared = source.prepareSessionSource && !findPreparedTranscript(args[0]) ? await prepareWorkerTranscript(args[0], () => {}) : void 0;
	try {
		const captured = prepared ? preparedWorkerTranscript.run(prepared, () => captureWorkerTurnTranscriptSource(prepared.target, args[1])) : source;
		if (source.prepareSessionSource) captured();
		let active = true;
		const retained = composeSessionSourceAssertion([captured], (assertSource) => {
			if (!active) throw new Error("Cloud worker transcript authority has been released");
			assertSource();
		});
		const release = async () => {
			if (active) {
				active = false;
				await prepared?.release();
			}
		};
		return Object.assign(retained, {
			release,
			[Symbol.asyncDispose]: release
		});
	} catch (error) {
		await releaseSessionSourceAuthorities(prepared ? [prepared] : [], [error]);
		throw error;
	}
}
//#endregion
export { withWorkerTurnTranscriptDatabase as i, prepareWorkerTurnTranscriptSource as n, resolveWorkerTurnTranscriptTarget as r, captureWorkerTurnTranscriptSource as t };
