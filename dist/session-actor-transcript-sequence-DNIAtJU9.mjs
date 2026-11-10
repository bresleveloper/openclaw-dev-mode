import { r as SqliteTranscriptMutationConflictError } from "./session-mutation-conflict-error-CvNdAcA_.mjs";
import { o as runWithSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { i as withTranscriptLockSettlement } from "./session-transcript-execution-read-Cv-mpCgi.mjs";
import { t as appendExpectedSessionTranscriptTurn } from "./session-accessor.sqlite-transcript-turn-CoODj9qI.mjs";
import { t as readSessionActorStorageResult } from "./session-actor-storage-result-BfP7PrnB.mjs";
import { h as withOwnedSessionTranscriptWriterFence, i as captureOwnedTranscriptWriteAssertion } from "./transcript-write-context-C02sC3zd.mjs";
import { n as publishTranscriptUpdate } from "./session-accessor.sqlite-events-B20eyHIG.mjs";
import { t as assertLegacyTranscriptPreparation } from "./session-transcript-preparation-HBORI9r1.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-actor-transcript-sequence.ts
/** Detached callbacks share the existing turn owner; only a rewrite retains a read snapshot. */
function withActorTranscriptWriteSequence(requestedScope, binding, run) {
	const fenced = withOwnedSessionTranscriptWriterFence(requestedScope);
	const sessionId = fenced.sessionId ?? binding.actor.snapshot(binding.authority)?.entry?.sessionId;
	if (!sessionId) throw new Error("Transcript write requires its selected session window");
	const scope = {
		...fenced,
		sessionKey: fenced.sessionKey ?? binding.actor.target.sessionKey,
		sessionId,
		agentId: binding.agentId,
		storePath: binding.path
	};
	const assertOwned = captureOwnedTranscriptWriteAssertion(scope);
	const authority = {
		...binding.authority,
		assertCurrent() {
			binding.authority.assertCurrent();
			binding.actor.assertReadable();
			assertOwned();
		}
	};
	let expected;
	let snapshot;
	let stale = false;
	const observe = (version) => {
		if (stale || expected && !isDeepStrictEqual(expected, version)) throw new SqliteTranscriptMutationConflictError(sessionId);
		expected = version;
	};
	const read = async () => {
		const value = await binding.actor.storage.read({
			type: "session.history.hydrate",
			input: { sessionId }
		}, authority);
		if (value.kind !== "full") throw new Error("Transcript write requires complete owned history");
		observe(value.snapshot.version);
		snapshot = value.snapshot;
		return value.snapshot.events;
	};
	const append = async (requested) => {
		assertLegacyTranscriptPreparation(scope, requested);
		if (stale || expected && requested.expectedTranscript && !isDeepStrictEqual(expected, requested.expectedTranscript)) throw new SqliteTranscriptMutationConflictError(sessionId);
		const { prepareMessageAfterIdempotencyCheckAsync, prepareMessageAfterIdempotencyCheck: _legacy, beforeFreshMessageCommit: _legacyGuard, preparation, ...options } = requested;
		const prepare = preparation?.prepareMessage ?? prepareMessageAfterIdempotencyCheckAsync;
		const result = await appendExpectedSessionTranscriptTurn(scope, {
			expectedSessionId: sessionId,
			keyFormat: "agent-qualified",
			sessionFile: sessionId,
			expectedLifecycleRevision: scope.expectedLifecycleRevision,
			expectedWriterRunId: scope.expectedWriterRunId,
			expectedOwner: scope.expectedOwner,
			assertCurrent: () => authority.assertCurrent(),
			messages: [{
				...options,
				expectedTranscript: expected ?? requested.expectedTranscript,
				preparation: {
					...prepare ? { prepareMessage: (message) => prepare(message) } : {},
					source: preparation?.source
				}
			}]
		});
		if (result.rejectedReason || !result.transcriptVersion) throw new Error("Transcript session changed before append");
		const message = result.appendedMessages[0];
		if (message?.appended || !expected) expected = result.transcriptVersion;
		else stale = !isDeepStrictEqual(expected, result.transcriptVersion);
		snapshot = void 0;
		return {
			result: message,
			lifecycleRevision: result.sessionEntry?.lifecycleRevision,
			...message?.anchor ? { messageSeq: message.anchor.activeMessagePosition + 1 } : {}
		};
	};
	return runWithSessionActorStorage(binding, () => withTranscriptLockSettlement((enqueue) => {
		const queue = AsyncLocalStorage.bind(enqueue);
		return run({
			readEvents: () => queue(read),
			readMessageFacts: (input) => queue(async () => {
				const result = await binding.actor.storage.read({
					type: "session.transcript.messageFacts",
					input: {
						...input,
						scope
					}
				}, authority);
				observe(result.version);
				return result.facts;
			}),
			replaceEvents: (events) => queue(async () => {
				if (stale) throw new SqliteTranscriptMutationConflictError(sessionId);
				if (!snapshot) await read();
				const result = readSessionActorStorageResult(await binding.actor.storage.mutate({
					type: "session.transcript.replaceSuffix",
					input: {
						scope,
						args: [
							snapshot.events,
							events,
							0,
							expected?.updatedAt,
							false,
							[]
						]
					}
				}, authority));
				if (!result.replaced || !result.version) throw new SqliteTranscriptMutationConflictError(sessionId);
				expected = result.version;
				snapshot = {
					events: [...events],
					version: result.version
				};
			}),
			appendMessage: (options) => queue(async () => (await append(options)).result),
			appendMessageWithMessageSequence: (options) => queue(() => append(options)),
			publishUpdate: (update) => queue(async () => {
				authority.assertCurrent();
				await publishTranscriptUpdate(scope, update);
			})
		});
	}));
}
//#endregion
export { withActorTranscriptWriteSequence };
