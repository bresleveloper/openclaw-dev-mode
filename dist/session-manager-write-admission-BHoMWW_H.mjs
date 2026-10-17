import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { a as runInDetachedAsyncContext, c as trackAsyncWork } from "./async-work-scope-BYeX3gh6.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource, n as captureOpenClawStateDatabaseReadAdmission } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { a as registerOpenClawAgentDatabaseAsyncResource, o as registerOpenClawAgentDatabaseReadCandidateResource } from "./openclaw-agent-db-resources-x2MmUEok.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { w as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./openclaw-state-db-D1jWDzK3.mjs";
import { r as runQueuedStoreWrite } from "./store-writer-queue-Cq6rziq_.mjs";
import { t as captureRuntimeConfig } from "./runtime-source-projection-rvQFgz1Z.mjs";
import { f as withOpenClawAgentDatabaseAsync } from "./openclaw-agent-db-DBug3LUA.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-CKOCIcah.mjs";
import { i as sameSessionTranscriptTargetBinding, n as captureSessionTranscriptTargetBinding, t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-WjVavOYj.mjs";
import { i as captureOwnedTranscriptWriteAssertion, u as withOwnedSessionTranscriptWriterFence } from "./transcript-write-context-m7NE2aEm.mjs";
import { c as captureSessionStoreReadCandidate } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { o as resolveSqliteReadScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { a as appendTranscriptMessageSnapshotSync } from "./session-accessor.sqlite-transcript-write-CPk6xFA-.mjs";
import { t as isTranscriptMessageAppendCurrentTail } from "./session-accessor.sqlite-transcript-append-result-BjgvnUCa.mjs";
import { t as SessionTranscriptMessageCommittedError } from "./session-manager-message-error-C6BAQhGS.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/sessions/session-manager-write-admission.ts
const detachedWriterQueues = resolveGlobalSingleton(Symbol.for("openclaw.sessionManagerDetachedWriterQueues"), () => /* @__PURE__ */ new WeakMap());
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
/** Keep the manager operation, committed view adoption, and cleanup in one storage admission. */
async function withSessionManagerWrite(manager, write) {
	const assertOwner = managerWriteAssertions.getStore()?.get(manager);
	assertOwner?.();
	const target = manager.getSessionTarget();
	if (!target) {
		const sessionId = manager.getSessionId();
		const queues = detachedWriterQueues.get(manager) ?? /* @__PURE__ */ new Map();
		detachedWriterQueues.set(manager, queues);
		return await trackAsyncWork(() => runQueuedStoreWrite({
			queues,
			storePath: "session",
			label: "detached session write admission",
			reentrant: true,
			fn: async () => {
				if (manager.getSessionTarget() || manager.getSessionId() !== sessionId) throw new Error("Session manager identity changed before transcript write admission");
				assertOwner?.();
				return await write();
			}
		}));
	}
	const identity = { ...target };
	const assertTranscript = captureOwnedTranscriptWriteAssertion(identity);
	const assertCurrent = () => {
		assertOwner?.();
		assertTranscript();
	};
	const options = toDatabaseOptions(resolveSqliteReadScope(identity));
	options.env = captureSessionTranscriptStorageEnvironment(options.env ?? process.env);
	options.path = resolveOpenClawAgentSqlitePath(options);
	return await trackAsyncWork(() => runOpenClawAgentWriteAdmission(options, () => withOpenClawAgentDatabaseAsync(options, (database) => {
		const current = manager.getSessionTarget();
		if (!sameSessionTranscriptTargetBinding(identity, current)) throw new Error("Session manager identity changed before transcript write admission");
		assertCurrent();
		return write({
			database,
			options
		});
	}, assertCurrent), true));
}
/** Append directly to the transcript without changing any manager's loaded view. */
async function appendSessionTranscriptNote(target, message, options) {
	const captured = withOwnedSessionTranscriptWriterFence(captureSessionTranscriptTargetBinding(target));
	const append = {
		cwd: process.cwd(),
		message: structuredClone(message),
		...options?.config ? { config: captureRuntimeConfig(options.config) } : {}
	};
	if (isIncognitoSessionKey(captured.sessionKey)) return await withSessionManagerWrite({
		getSessionTarget: () => captured,
		getSessionId: () => captured.sessionId
	}, () => {
		const snapshot = appendTranscriptMessageSnapshotSync(captured, append);
		if (!snapshot.ok) throw new Error("Session transcript message was not persisted", { cause: snapshot.error });
		const result = snapshot.value.result;
		if (!result) throw new Error("Session transcript message was not persisted");
		return {
			messageId: result.messageId,
			message: result.message,
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
			const { appendSessionTranscriptMessage } = await runInDetachedAsyncContext(() => import("./session-manager-message-runtime-Bm2WQDIi.mjs"));
			const committed = await appendSessionTranscriptMessage(input);
			try {
				assertCurrent();
			} catch (error) {
				throw new SessionTranscriptMessageCommittedError(committed.messageId, error, captured);
			}
			return committed;
		}, true));
	} finally {
		completion.resolve();
		for (const unregister of releases.toReversed()) unregister();
	}
}
//#endregion
export { withSessionManagerWrite as n, withSessionManagerWriteAssertion as r, appendSessionTranscriptNote as t };
