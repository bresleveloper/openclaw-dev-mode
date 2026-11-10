import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { t as SessionTranscriptReadFenceError } from "./session-transcript-read-fence-error-DoYPfzaJ.mjs";
import { r as findSessionTranscriptHeader } from "./session-entry-codec-DSMJ1XFN.mjs";
import { n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-uO0pz59U.mjs";
import { R as readSessionActorMemoryHistoryQuery, St as createSessionActorMemoryState } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { a as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { a as withSessionContextAdmission, n as resolveSessionTranscriptReadFence, r as resolveSqliteSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { c as readTranscriptContextVersionInTransaction } from "./session-accessor.sqlite-transcript-state-DCHgVh5P.mjs";
import { a as inspectTranscriptEventsSync, f as loadTranscriptReadSnapshotSync, l as loadTranscriptEventsFromDatabase } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { i as captureOwnedTranscriptWriteAssertion, s as getOwnedSessionTranscriptActor, u as getOwnedSessionTranscriptWriterFence } from "./transcript-write-context-C02sC3zd.mjs";
import { t as withSessionTranscriptReadSource } from "./session-transcript-read-source-Bmo2UYck.mjs";
import { t as prepareSessionTranscriptHydration } from "./session-transcript-hydration-OIv_abWd.mjs";
import { i as withSessionManagerMemoryActor, t as captureSessionManagerIncognitoBinding } from "./session-manager-incognito-scope-DBz3K1lk.mjs";
import { t as readSessionTranscriptBoundedActiveContextCore } from "./session-accessor.sqlite-active-context-DOoM5SxW.mjs";
import { a as readSessionTranscriptContextMessagesInWorker } from "./session-transcript-read-worker-runtime--hfRfymd.mjs";
import { n as readSessionTranscriptModelContextAsync } from "./session-transcript-context-read-B-x2YFto.mjs";
//#region src/agents/sessions/session-manager-memory-read.ts
/** Each read borrows admitted work or releases its own handle after taking a snapshot. */
function prepareSessionManagerMemoryRead(binding, signal) {
	const assertOwned = captureOwnedTranscriptWriteAssertion(binding.target);
	const assertCurrent = () => {
		signal?.throwIfAborted();
		assertOwned();
		binding.authority.assertCurrent();
	};
	return {
		assertCurrent,
		read(type, input) {
			assertCurrent();
			return withSessionManagerMemoryActor(binding, false, async (selected) => {
				if (selected) return selected.storage.read({
					type,
					input
				}, {
					...binding.authority,
					assertCurrent
				});
				const state = createSessionActorMemoryState({
					sessionKey: binding.target.sessionKey,
					database: {
						kind: "memory",
						handle: "absent",
						incarnation: "absent"
					}
				});
				return readSessionActorMemoryHistoryQuery(state, {
					type,
					input
				}, binding.database);
			});
		}
	};
}
function prepareSessionManagerMemoryHydration(binding, limits, signal) {
	const target = captureSessionTranscriptTargetBinding(binding.target);
	const reader = prepareSessionManagerMemoryRead(binding, signal);
	const captured = {
		sessionId: target.sessionId,
		admission: resolveSessionTranscriptReadFence(target)
	};
	return {
		target,
		assertCurrent: reader.assertCurrent,
		read: () => reader.read("session.history.hydrate", {
			...captured,
			limits
		}),
		readCurrentTurnEntry: (request) => reader.read("session.history.current-turn-entry", {
			...captured,
			...request
		}),
		readMaintenance: (request) => reader.read("session.history.maintenance", {
			...captured,
			request
		}),
		readRecentActiveEvents: (maxEvents) => reader.read("session.history.recent-active-events", {
			...captured,
			maxEvents
		}),
		readLatestActiveMessage: () => reader.read("session.history.latest-active-message", captured)
	};
}
//#endregion
//#region src/agents/sessions/session-manager-incognito.ts
/** Exact owner postimages can validate metadata, never replace bounded payload reads. */
function readSessionManagerActorTranscript(target, version) {
	if (!version || resolveSessionTranscriptReadFence(target)) return;
	const binding = getOwnedSessionTranscriptActor(target);
	if (!binding) return;
	const assertCurrent = captureOwnedTranscriptWriteAssertion(target);
	const state = binding.actor.snapshot({
		assertCurrent,
		authorize: assertCurrent
	});
	const fence = getOwnedSessionTranscriptWriterFence({ sessionTarget: target });
	if (!state || state.target.sessionKey !== target.sessionKey || state.entry?.sessionId !== target.sessionId || fence && (state.entry.lifecycleRevision !== fence.expectedLifecycleRevision || state.entry.activeWriterRunId !== fence.expectedWriterRunId) || state.transcript.anchorsState !== "resident" || state.transcript.version.generation !== version.generation || state.transcript.version.rawSeq !== version.rawSeq || state.transcript.version.updatedAt !== version.updatedAt) return;
	return state.transcript;
}
/** SessionManager planning uses the same actor as its subsequent metadata command. */
function prepareSessionManagerHydration(source, options = {}) {
	const { limits, signal, manager, retarget = false, lane } = options;
	const target = captureSessionTranscriptTargetBinding(source);
	const incognitoBinding = captureSessionManagerIncognitoBinding(target, manager, retarget);
	if (!incognitoBinding) return {
		...prepareSessionTranscriptHydration(target, limits, signal, lane),
		incognitoBinding
	};
	return {
		...prepareSessionManagerMemoryHydration(incognitoBinding, limits, signal),
		incognitoBinding
	};
}
async function readSessionManagerModelContextAsync(target, options, consume, manager) {
	const readTarget = captureSessionTranscriptTargetBinding(target);
	const receipt = options.admission ?? resolveSessionTranscriptReadFence(readTarget);
	const admission = receipt ? { ...receipt } : void 0;
	const through = options.through ? { ...options.through } : void 0;
	const limits = options.limits ? { ...options.limits } : void 0;
	options.signal?.throwIfAborted();
	const selected = captureSessionManagerIncognitoBinding(readTarget, manager);
	if (selected) {
		const reader = prepareSessionManagerMemoryRead(selected, options.signal);
		const context = await reader.read("session.history.context", {
			sessionId: readTarget.sessionId,
			admission,
			through,
			limits
		});
		reader.assertCurrent();
		const value = await consume(context);
		reader.assertCurrent();
		return value;
	}
	const result = await withSessionContextAdmission(readTarget, admission, () => readSessionTranscriptModelContextAsync(readTarget, consume, admission, options.signal, through, limits, true));
	options.signal?.throwIfAborted();
	return result;
}
async function readSessionManagerContextAsync(target, read, options) {
	const captured = captureSessionTranscriptTargetBinding(target);
	const receipt = options.admission ?? resolveSessionTranscriptReadFence(captured);
	const admission = receipt ? { ...receipt } : void 0;
	const assertOwned = captureOwnedTranscriptWriteAssertion(captured);
	const signal = options.signal;
	signal?.throwIfAborted();
	assertOwned();
	const selected = captureSessionManagerIncognitoBinding(captured);
	if (selected) {
		const reader = prepareSessionManagerMemoryRead(selected, signal);
		const snapshot = await reader.read("session.history.context-messages", {
			sessionId: captured.sessionId,
			admission
		});
		const messages = (function* () {
			for (const message of snapshot.messages) {
				reader.assertCurrent();
				yield message;
			}
		})();
		try {
			reader.assertCurrent();
			const value = await read(messages, snapshot.header);
			reader.assertCurrent();
			return value;
		} finally {
			messages.return(void 0);
		}
	}
	return withSessionContextAdmission(captured, admission, async () => {
		const assertCurrent = () => {
			signal?.throwIfAborted();
			assertOwned();
		};
		const consumeSnapshot = async (snapshot, assertReaderCurrent) => {
			const messages = (function* () {
				for (const message of snapshot.messages) {
					assertCurrent();
					assertReaderCurrent?.();
					yield message;
				}
			})();
			try {
				return await read(messages, snapshot.header);
			} finally {
				messages.return(void 0);
			}
		};
		return withSessionTranscriptReadSource(captured, async (source) => {
			const { scope, expectedIdentity, owner, assertCurrent: assertReadOwner } = source;
			const readTarget = {
				...scope,
				sessionId: captured.sessionId,
				sessionKey: captured.sessionKey
			};
			const assertDurable = () => {
				assertCurrent();
				assertReadOwner();
			};
			assertDurable();
			if (admission && !expectedIdentity) throw new SessionTranscriptReadFenceError("Session transcript changed during context read");
			const snapshot = await readSessionTranscriptContextMessagesInWorker(readTarget, admission, signal, expectedIdentity);
			assertDurable();
			const result = await consumeSnapshot(snapshot, () => owner.assertCurrent());
			assertDurable();
			return result;
		}, signal);
	});
}
//#endregion
//#region src/agents/sessions/session-manager-reload.ts
/** Both open paths capture, hydrate, and construct under the same source and truncation rules. */
async function openSessionManagerBoundedView(target, options, create, cohort) {
	const { cwd, onTruncated, signal, ...limits } = options;
	const fallbackCwd = cwd ?? process.cwd();
	const hydration = prepareSessionManagerHydration(target, {
		limits,
		signal
	});
	const assertOwned = captureOwnedTranscriptWriteAssertion(hydration.target);
	const assertCurrent = () => {
		signal?.throwIfAborted();
		assertOwned();
		hydration.assertCurrent();
	};
	const publish = (prepared) => {
		assertCurrent();
		if (prepared.kind !== "bounded") throw new Error("Expected a bounded transcript snapshot");
		const context = prepared.snapshot;
		if (context.truncated) onTruncated?.();
		assertCurrent();
		const header = findSessionTranscriptHeader(context.events);
		const manager = create(cwd ?? header?.cwd ?? fallbackCwd, hydration.target, context, limits);
		if (cohort) consumeSessionManagerReload(prepared, (snapshot, assertView) => cohort.consume(manager, snapshot, assertView), () => cohort.captureView(manager), assertCurrent);
		return manager;
	};
	assertCurrent();
	if (cohort) {
		if (!hydration.readCohort) throw new Error("Initial transcript cohorts require their durable history owner");
		let manager;
		await hydration.readCohort(cohort.selection, (prepared) => {
			manager = publish(prepared);
		});
		if (!manager) throw new Error("Initial transcript cohort did not publish its manager");
		return manager;
	}
	return publish(await hydration.read().catch((error) => {
		assertOwned();
		throw error;
	}));
}
function consumeSessionManagerReload(prepared, consume, captureView, assertCurrent) {
	const adopted = captureView();
	const consumed = consume?.(prepared, () => {
		assertCurrent();
		const current = captureView();
		if (Object.keys(adopted).some((key) => Reflect.get(adopted, key) !== Reflect.get(current, key))) throw new Error("Session manager changed after transcript cohort adoption");
	});
	if (isPromiseLike(consumed)) {
		Promise.resolve(consumed).catch(() => {});
		throw new Error("Transcript cohort consumers must remain synchronous");
	}
}
function readSessionManagerReload(target, limits, ignoreReadFence, transaction) {
	if (transaction && !transaction.db.isTransaction) throw new Error("Session reload lost its borrowed transaction");
	if (limits) return {
		kind: "bounded",
		snapshot: readSessionTranscriptBoundedActiveContextCore(target, {
			...limits,
			...ignoreReadFence ? { ignoreReadFence: true } : {},
			transaction
		})
	};
	if (transaction) {
		const resolved = resolveSqliteTranscriptReadScope(target);
		const fence = ignoreReadFence ? void 0 : resolveSqliteSessionTranscriptReadFence({
			database: transaction,
			...resolved
		});
		return {
			kind: "full",
			snapshot: {
				events: loadTranscriptEventsFromDatabase(transaction, resolved.sessionId, { beforeEventSeq: fence?.beforeRawSeq }),
				version: readTranscriptContextVersionInTransaction(transaction, resolved.sessionId)
			}
		};
	}
	if (!ignoreReadFence) return {
		kind: "full",
		snapshot: loadTranscriptReadSnapshotSync(target)
	};
	const { events, snapshot } = inspectTranscriptEventsSync(target);
	return {
		kind: "full",
		snapshot: {
			events,
			version: {
				generation: snapshot.generation,
				rawSeq: snapshot.lastSeq,
				updatedAt: snapshot.transcriptUpdatedAt
			}
		}
	};
}
/** A committed append may need rows after the current model-context admission. */
function readCommittedSessionManagerReload(target, limits) {
	const memory = captureSessionManagerIncognitoBinding(target);
	if (memory) return prepareSessionManagerMemoryRead(memory).read("session.history.hydrate", {
		sessionId: target.sessionId,
		limits
	});
	return withSessionTranscriptReadSource(target, ({ scope, resolved, owner, expectedIdentity }) => owner.readTranscript({
		target: {
			...scope,
			sessionId: target.sessionId,
			sessionKey: target.sessionKey
		},
		resolvedScope: resolved,
		limits,
		expectedIdentity
	}));
}
//#endregion
export { prepareSessionManagerHydration as a, readSessionManagerModelContextAsync as c, readSessionManagerReload as i, openSessionManagerBoundedView as n, readSessionManagerActorTranscript as o, readCommittedSessionManagerReload as r, readSessionManagerContextAsync as s, consumeSessionManagerReload as t };
