import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { s as trackAsyncWork } from "./async-work-scope-BH2yUdBz.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { o as registerOpenClawAgentDatabaseAsyncResource, s as registerOpenClawAgentDatabaseReadCandidateResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { r as captureOpenClawStateDatabaseReadAdmission, y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { i as runQueuedStoreWrite } from "./store-writer-queue-AKR6NnXM.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { t as captureRuntimeConfig } from "./runtime-source-projection-DAkjzBhe.mjs";
import { i as sameSessionTranscriptTargetBinding, n as captureSessionTranscriptTargetBinding, t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { r as captureSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as resolveSqliteReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { r as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { h as withOwnedSessionTranscriptWriterFence, i as captureOwnedTranscriptWriteAssertion, s as getOwnedSessionTranscriptActor } from "./transcript-write-context-C02sC3zd.mjs";
import { t as isTranscriptMessageAppendCurrentTail } from "./session-accessor.sqlite-transcript-append-result-BjgvnUCa.mjs";
import { r as prepareTranscriptMessageAppendForWorker } from "./session-accessor.sqlite-transcript-message-append-DFcvBgrv.mjs";
import { a as withSessionManagerMemoryBinding, i as withSessionManagerMemoryActor, n as installSessionManagerIncognitoBinding, t as captureSessionManagerIncognitoBinding } from "./session-manager-incognito-scope-DBz3K1lk.mjs";
import { i as receiveSessionManagerCommit } from "./session-manager-persistence-error-uXrnbG-q.mjs";
import { t as createSessionManagerMemoryDatabase } from "./session-manager-memory-BF9nTnKe.mjs";
import { t as SessionTranscriptMessageCommittedError } from "./session-manager-message-error-CdpV1a6G.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/sessions/session-manager-write-admission.ts
const managerWriterQueues = resolveGlobalSingleton(Symbol.for("openclaw.sessionManagerDetachedWriterQueues"), () => /* @__PURE__ */ new WeakMap());
const managerWriteAssertions = resolveGlobalSingleton(Symbol.for("openclaw.sessionManagerWriteAssertions"), () => new AsyncLocalStorage());
/** Carry caller authority through input preparation and nested manager write admissions. */
function withSessionManagerWriteAssertion(manager, assertCurrent, run) {
	const assertions = new Map(managerWriteAssertions.getStore());
	const parent = assertions.get(manager);
	const assertBound = () => {
		parent?.();
		assertCurrent();
	};
	assertBound();
	assertions.set(manager, assertBound);
	return managerWriteAssertions.run(assertions, run);
}
function captureSessionManagerWriteAssertion(manager) {
	return managerWriteAssertions.getStore()?.get(manager);
}
/** Retain same-manager ordering while preparation and view adoption release the database FIFO. */
function runSessionManagerWrite(manager, run) {
	const target = manager.getSessionTarget();
	const identity = target && { ...target };
	const sessionId = manager.getSessionId();
	const assertOwner = captureSessionManagerWriteAssertion(manager);
	assertOwner?.();
	const queues = managerWriterQueues.get(manager) ?? /* @__PURE__ */ new Map();
	managerWriterQueues.set(manager, queues);
	return trackAsyncWork(() => runQueuedStoreWrite({
		queues,
		storePath: "session",
		label: "session manager write admission",
		reentrant: true,
		fn: () => {
			if (manager.getSessionId() !== sessionId || !sameSessionTranscriptTargetBinding(identity, manager.getSessionTarget())) throw new Error("Session manager identity changed before transcript write admission");
			assertOwner?.();
			return run();
		}
	}));
}
/** Awaited maintenance and unbound SDK writes retain the worker's storage admission. */
function withSessionManagerWrite(manager, write) {
	return trackAsyncWork(() => withSessionManagerDatabaseWrite(manager, write));
}
async function withSessionManagerDatabaseWrite(manager, write) {
	const assertOwner = captureSessionManagerWriteAssertion(manager);
	assertOwner?.();
	const target = manager.getSessionTarget();
	if (!target) return runSessionManagerWrite(manager, async () => write());
	const identity = { ...target };
	const assertTranscript = captureOwnedTranscriptWriteAssertion(identity);
	const assertCurrent = () => {
		assertOwner?.();
		assertTranscript();
	};
	const incognitoBinding = captureSessionManagerIncognitoBinding(identity, manager);
	const assertManager = () => {
		if (!sameSessionTranscriptTargetBinding(identity, manager.getSessionTarget())) throw new Error("Session manager identity changed before transcript write admission");
		assertCurrent();
	};
	if (incognitoBinding) return trackAsyncWork(() => withSessionManagerMemoryActor(incognitoBinding, true, async (selected) => {
		if (!selected) throw new Error("Session manager lost its memory owner");
		return selected.actor.withPhase("session-manager.write", {
			assertCurrent,
			authorize() {}
		}, async ({ actor }) => {
			const active = {
				...selected,
				actor,
				storage: actor.storage
			};
			const database = createSessionManagerMemoryDatabase(active);
			return runSessionManagerWrite(manager, () => withSessionManagerMemoryBinding(manager, active, async () => {
				assertManager();
				try {
					return await write({
						database,
						options: active.database,
						assertCurrent
					});
				} finally {
					const next = manager.getSessionTarget();
					if (next?.sessionKey === identity.sessionKey) installSessionManagerIncognitoBinding(manager, {
						...incognitoBinding,
						target: next
					});
				}
			}));
		});
	}));
	const options = toDatabaseOptions(resolveSqliteReadScope(identity));
	options.env = captureSessionTranscriptStorageEnvironment(options.env ?? process.env);
	options.path = resolveOpenClawAgentSqlitePath(options);
	const database = captureOpenClawAgentDatabaseExecution(options);
	try {
		return await runSessionManagerWrite(manager, () => runOpenClawAgentWriteAdmission(options, () => {
			assertManager();
			return write({
				database,
				options,
				assertCurrent
			});
		}, true, void 0, void 0, "session-manager.write"));
	} finally {
		await database.release();
	}
}
/** Append directly to the transcript without changing any manager's loaded view. */
async function appendSessionTranscriptNote(target, message, options) {
	const captured = withOwnedSessionTranscriptWriterFence(captureSessionTranscriptTargetBinding(target));
	const append = {
		cwd: process.cwd(),
		message: structuredClone(message),
		...options?.config ? { config: captureRuntimeConfig(options.config) } : {}
	};
	const actorBinding = getOwnedSessionTranscriptActor(captured);
	if (actorBinding && actorBinding.actor.target.database.kind !== "memory") {
		const { actor: sessionActor } = actorBinding;
		const assertOwned = captureOwnedTranscriptWriteAssertion(captured);
		const assertCurrent = () => {
			assertOwned();
			sessionActor.assertCurrent();
		};
		return trackAsyncWork(() => sessionActor.withPhase("session-manager.append", {
			assertCurrent,
			authorize: assertCurrent
		}, async () => {
			assertCurrent();
			const { appendSessionTranscriptMessage } = await runInDetachedAsyncContext(() => import("./session-manager-message-runtime-Yaay-84X.mjs"));
			return appendSessionTranscriptMessage({
				target: captured,
				...append,
				assertCurrent
			});
		}));
	}
	if (captureSessionManagerIncognitoBinding(captured)) return await withSessionManagerWrite({
		getSessionTarget: () => captured,
		getSessionId: () => captured.sessionId
	}, async (admission) => {
		const actor = admission && "withMetadata" in admission.database ? admission.database : void 0;
		if (!actor || !admission) throw new Error("Missing memory session write admission");
		const prepared = prepareTranscriptMessageAppendForWorker(append);
		Object.freeze(prepared.persistedMessage);
		const { env: _env, ...scope } = captured;
		const receipt = await receiveSessionManagerCommit("session.transcript.appendMessage", async () => (await import("./session-manager-metadata-runtime-BVaK_rGu.mjs")).withSessionMetadataWorker(admission.options, actor, () => admission.assertCurrent(), (worker) => worker.execute({
			type: "session.transcript.appendMessage",
			input: {
				scope: {
					...scope,
					storePath: actor.path
				},
				messageJson: prepared.messageJson,
				cwd: append.cwd
			}
		})));
		const snapshot = receipt.value.snapshot;
		if (!snapshot.ok) throw new Error("Session transcript message was not persisted", { cause: snapshot.error });
		const result = snapshot.value.result;
		if (!result) throw new Error("Session transcript message was not persisted");
		try {
			if (receipt.failure) throw receipt.failure;
			admission.assertCurrent();
		} catch (cause) {
			throw new SessionTranscriptMessageCommittedError(result.messageId, cause, captured, snapshot.value.after, snapshot.value.lifecycleRevision);
		}
		return {
			messageId: result.messageId,
			message: result.message ?? prepared.persistedMessage,
			appended: result.appended,
			currentTail: isTranscriptMessageAppendCurrentTail(snapshot.value)
		};
	});
	const unresolved = resolveUnsuffixedSqliteTargetFromSessionStorePath(captured.storePath);
	const candidate = captureSessionStoreReadCandidate(unresolved.path, unresolved.agentId || captured.storePath.endsWith(".sqlite") ? void 0 : "sibling-family");
	const state = captureOpenClawStateDatabaseReadAdmission(resolveOpenClawStateSqlitePath(captured.env));
	const assertOwned = captureOwnedTranscriptWriteAssertion(captured);
	const completion = createDeferredCore();
	let revoked = false;
	const revoke = () => {
		revoked = true;
	};
	const assertCurrent = () => {
		if (revoked) throw new Error("Session transcript append was revoked before completion");
		state.assertCurrent();
		assertOwned();
		if (captureSessionStoreReadCandidate(candidate.path, candidate.scope).physicalPath !== candidate.physicalPath) throw new Error("Session store alias changed before transcript append completion");
	};
	const input = {
		target: captured,
		candidate,
		...append,
		assertCurrent
	};
	const releases = [];
	try {
		for (const pathname of /* @__PURE__ */ new Set([candidate.path, candidate.physicalPath])) {
			const resource = {
				path: pathname,
				revoke,
				close: () => completion.promise
			};
			releases.push(unresolved.agentId ? registerOpenClawAgentDatabaseAsyncResource({
				...resource,
				agentId: unresolved.agentId
			}) : registerOpenClawAgentDatabaseReadCandidateResource({
				...resource,
				scope: candidate.scope
			}));
		}
		releases.push(registerOpenClawStateDatabaseAsyncResource({ close: async (identity) => {
			if (!identity || identity.key === state.identity.key) {
				revoke();
				await completion.promise;
			}
		} }));
		assertCurrent();
		return await trackAsyncWork(() => runOpenClawAgentWriteAdmission({
			agentId: captured.agentId,
			path: unresolved.path,
			env: captured.env
		}, async () => {
			assertCurrent();
			const { appendSessionTranscriptMessage } = await runInDetachedAsyncContext(() => import("./session-manager-message-runtime-Yaay-84X.mjs"));
			const committed = await appendSessionTranscriptMessage(input);
			try {
				assertCurrent();
			} catch (error) {
				throw new SessionTranscriptMessageCommittedError(committed.messageId, error, captured);
			}
			return committed;
		}, true, void 0, void 0, "session-manager.note"));
	} finally {
		completion.resolve();
		for (const unregister of releases.toReversed()) unregister();
	}
}
//#endregion
export { withSessionManagerWriteAssertion as a, withSessionManagerWrite as i, captureSessionManagerWriteAssertion as n, runSessionManagerWrite as r, appendSessionTranscriptNote as t };
