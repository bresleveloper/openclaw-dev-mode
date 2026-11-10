import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { o as publishCommittedSessionIdentity } from "./session-accessor.sqlite-identity-2UHa91m7.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { i as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import { C as withSqliteSessionContextReset, x as hasPreparedNativeSessionDeletion, y as captureNativeSessionWorkerDeletion } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { n as runSessionNativeBindingWorkerOperation } from "./session-native-binding-CM20NNGU.mjs";
import { n as runSessionEntryWorkerOperation } from "./session-entry-patch-CSunl6ZV.mjs";
import { r as restoreSessionColdTranscript } from "./session-cold-storage-BJd_oJjB.mjs";
import { t as executeSessionForkOperation } from "./session-fork-domain-DDfFNSmm.mjs";
import { r as invalidateSessionBranchCache } from "./session-accessor.sqlite-branches-BnZyeeO5.mjs";
//#region src/config/sessions/session-message-cut.ts
async function mutateSessionHistoryInWorker(params, resolved, intent, source, native, selection, preconditions) {
	params.commitGuard?.();
	if (!source.key.startsWith("file:")) return { status: "missing-session" };
	const database = {
		...toDatabaseOptions(resolved),
		path: source.canonicalPath
	};
	const assertCurrent = () => {
		assertExistingDatabaseIdentity(resolved.path ?? database.path, source.key, source.birthtime);
		params.commitGuard?.();
	};
	const preparedEntry = await withSessionEntryReadOnlyInWorker({
		agentId: resolved.agentId,
		env: database.env,
		sessionKey: intent.sourceKey,
		storePath: database.path
	}, assertCurrent, async (read) => {
		if (!read.ok) throw read.error;
		return read.value;
	});
	if (!preparedEntry?.sessionId) return { status: "missing-session" };
	if (selection) {
		for (;;) {
			const pending = selection.prepareRead();
			if (!pending) break;
			await pending;
		}
		assertCurrent();
		try {
			selection.initialize({
				entry: preparedEntry,
				membership: /* @__PURE__ */ new Set()
			});
		} catch {
			return { status: "conflict" };
		} finally {
			selection.release();
		}
	}
	const preparedIntent = {
		...intent,
		expectedState: intent.expectedState ?? {
			sessionId: preparedEntry.sessionId,
			lifecycleRevision: preparedEntry.lifecycleRevision
		}
	};
	await restoreSessionColdTranscript({
		agentId: resolved.agentId,
		env: database.env,
		sessionKey: intent.sourceKey,
		storePath: database.path,
		sessionId: preparedEntry.sessionId
	}, assertCurrent);
	assertCurrent();
	const prepareContext = (run) => intent.mode === "fork" ? run(() => {}) : withSqliteSessionContextReset(resolved, {
		sessionKey: intent.sourceKey,
		entry: preparedEntry
	}, run, preconditions?.assertUpstreamCurrent);
	return prepareContext(async (assertPreparedCurrent) => {
		const assertHeld = () => {
			assertCurrent();
			assertPreparedCurrent();
		};
		const entries = [{
			sessionKey: intent.sourceKey,
			entry: preparedEntry
		}];
		const captured = intent.mode === "fork" ? void 0 : captureNativeSessionWorkerDeletion(entries);
		if (intent.mode !== "fork" && hasPreparedNativeSessionDeletion() && !captured) return native(preparedIntent, assertHeld);
		const operation = {
			database,
			databaseIdentity: source.key.slice(5),
			agentId: resolved.agentId,
			assertCurrent: assertHeld,
			onTransactionFacts(facts) {
				if (facts === void 0 || isRecord(facts) && (facts.kind === "native-binding-ready" || facts.kind === "native-binding-storage" && facts.phase === "delete")) preconditions?.assertUpstreamCurrent?.();
				return false;
			},
			assertCandidate: () => preconditions?.assertUpstreamCurrent?.(),
			candidateKind: "session-message-cut",
			onAcknowledged(candidate) {
				if (candidate.result.status === "created") {
					if (candidate.projectionNeedsReconcile) startSessionTranscriptIndexReconcile({
						...database,
						preferredSessionId: candidate.result.entry.sessionId
					});
					invalidateSessionBranchCache(database.path, [...candidate.previousSessionIds, candidate.result.entry.sessionId]);
				}
			},
			onCommitted(candidate, published, identity) {
				if (published) publishCommittedSessionIdentity(resolved.agentId, identity, published.previous, published.current, published.prepared);
				return candidate.result;
			}
		};
		if (intent.mode === "fork") return runSessionEntryWorkerOperation({
			...operation,
			run: (worker, commit) => commit(() => executeSessionForkOperation(worker, database.agentId, {
				type: "session.messageCut.fork",
				input: {
					agentId: resolved.agentId,
					intent: {
						...preparedIntent,
						mode: "fork"
					},
					sourceRepositoryWorkspaceId: preconditions?.sourceRepositoryWorkspaceId
				}
			}))
		});
		const input = {
			agentId: resolved.agentId,
			intent: {
				...preparedIntent,
				mode: intent.mode
			}
		};
		if (captured) return runSessionNativeBindingWorkerOperation({
			...operation,
			entries,
			captured,
			execute: (worker, nativeBindings) => worker.execute({
				type: "session.messageCut.commit",
				input: {
					...input,
					nativeBindings
				}
			})
		});
		return runSessionEntryWorkerOperation({
			...operation,
			run: (worker, commit) => commit(() => worker.execute({
				type: "session.messageCut.commit",
				input
			}))
		});
	});
}
//#endregion
export { mutateSessionHistoryInWorker };
