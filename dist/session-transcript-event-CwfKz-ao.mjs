import { o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as captureSessionActorStorageOwner, r as getSessionActorStorageBinding, s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { n as captureLifecycleDatabaseScope, s as resolveSqliteTranscriptScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { i as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import { n as IncognitoSessionMissingError } from "./incognito-session-error-Dsi9IsoJ.mjs";
import { t as readSessionActorStorageResult } from "./session-actor-storage-result-BfP7PrnB.mjs";
import { h as withOwnedSessionTranscriptWriterFence, i as captureOwnedTranscriptWriteAssertion } from "./transcript-write-context-C02sC3zd.mjs";
import { n as runSessionEntryWorkerOperation } from "./session-entry-patch-CSunl6ZV.mjs";
import { n as assertNonMessageTranscriptEvent, t as assertLockedTranscriptWriteAllowed } from "./session-accessor.sqlite-transcript-write-guard-C3zmfbiJ.mjs";
import { t as appendTranscriptEvent } from "./session-accessor.sqlite-transcript-write-B1_nzUQQ.mjs";
import { t as executeSessionMessageRewriteOperation } from "./session-message-rewrite-domain-D1FyYmve.mjs";
import { isMainThread } from "node:worker_threads";
//#region src/config/sessions/session-transcript-event.ts
/** Retain the selected reader through the canonical writer's acknowledged event append. */
async function appendPreparedTranscriptEvent(requested, event, assertCurrent) {
	assertNonMessageTranscriptEvent(event);
	const fenced = withOwnedSessionTranscriptWriterFence(requested);
	const eventJson = JSON.stringify(event);
	const assertOwned = captureOwnedTranscriptWriteAssertion(fenced);
	const assertWriteCurrent = () => {
		assertOwned();
		assertCurrent();
	};
	const authority = {
		assertCurrent: assertWriteCurrent,
		authorize: assertWriteCurrent
	};
	const memory = captureSessionActorStorageOwner(fenced, authority);
	if (memory) {
		const append = async (binding) => readSessionActorStorageResult(await binding.actor.storage.mutate({
			type: "session.event.append",
			input: {
				scope: {
					...fenced,
					agentId: binding.agentId,
					sessionKey: binding.actor.target.sessionKey,
					storePath: binding.path
				},
				eventJson
			}
		}, memory.authority));
		const binding = getSessionActorStorageBinding(fenced);
		if (binding) return append(binding);
		const appended = await withSessionActorStorage(fenced, {
			authority,
			lifetime: {
				assertCurrent: assertWriteCurrent,
				assertReadable: assertWriteCurrent
			}
		}, append);
		if (appended === void 0) throw new IncognitoSessionMissingError();
		return appended;
	}
	const scope = captureLifecycleDatabaseScope(resolveSqliteTranscriptScope(fenced));
	const database = {
		...toDatabaseOptions(scope),
		path: scope.path
	};
	assertCurrent();
	if (!isMainThread) return appendTranscriptEvent(fenced, JSON.parse(eventJson), { beforeCommitInTransaction() {
		assertCurrent();
		assertLockedTranscriptWriteAllowed(openOpenClawAgentDatabase(database), scope, fenced);
	} });
	return appendTranscriptEventInWorker({
		scope,
		event,
		fence: fenced,
		assertCurrent
	});
}
/** Raw and guarded event appends share the canonical transcript writer operation. */
async function appendTranscriptEventInWorker(params) {
	const { scope, event, appendIntent, fence } = params;
	const assertCurrent = params.assertCurrent ?? (() => void 0);
	const database = {
		...toDatabaseOptions(scope),
		path: scope.path
	};
	const eventJson = JSON.stringify(event);
	return runSessionEntryWorkerOperation({
		database,
		agentId: scope.agentId,
		assertCurrent,
		candidateKind: "session-transcript-event",
		prepareWorker: () => ({
			async prepare() {
				const { restoreSessionColdTranscript } = await import("./session-cold-storage-Doo7Aerf.mjs");
				await restoreSessionColdTranscript({
					...scope,
					storePath: scope.path
				}, assertCurrent);
			},
			beforeWrite: assertCurrent,
			async release() {}
		}),
		run: (worker, commit) => commit(() => executeSessionMessageRewriteOperation(worker, database.agentId, {
			type: "session.transcript.event.append",
			input: {
				scope,
				eventJson,
				appendIntent,
				fence
			}
		})),
		onCommitted: ({ appended, projectionNeedsReconcile }) => {
			if (projectionNeedsReconcile) startSessionTranscriptIndexReconcile({
				...database,
				preferredSessionId: scope.sessionId
			});
			return appended;
		}
	});
}
//#endregion
export { appendTranscriptEventInWorker as n, appendPreparedTranscriptEvent as t };
