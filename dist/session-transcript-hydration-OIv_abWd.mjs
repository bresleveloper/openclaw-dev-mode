import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { c as revalidateAgentDatabaseTerminalOpenAsync, o as assertAgentDatabaseTerminalOpenAllowed } from "./openclaw-agent-db-readonly-open-DcexysGa.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-uO0pz59U.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { a as prepareSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { d as retainSessionActorTranscriptReplica, f as readSessionActorTranscriptContext, l as readSessionActorTranscriptReplica, m as readSessionActorTranscriptAnchors, p as seedSessionActorTranscriptContext } from "./session-actor-replica-D_j2y4I5.mjs";
import { i as runWithSessionTranscriptReadFence, n as resolveSessionTranscriptReadFence, r as resolveSqliteSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { g as targetDiscoveryLane } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { n as readRestoredSessionTranscriptInWorker } from "./session-cold-storage-read-DxurMT4l.mjs";
import { d as readOwnedSessionTranscriptEntry, f as readOwnedSessionTranscriptState } from "./transcript-write-context-C02sC3zd.mjs";
import { t as captureSessionActorTranscriptRead } from "./session-actor-transcript-read-Wje_m4fK.mjs";
import { t as withSessionTranscriptReadSource } from "./session-transcript-read-source-Bmo2UYck.mjs";
//#region src/config/sessions/session-transcript-hydration.ts
/** Capture identity before queueing; a missing file remains the creation owner's responsibility. */
function prepareSessionTranscriptHydration(source, limits, signal, lane) {
	const memory = captureSessionActorTranscriptRead(source, signal);
	if (memory) {
		const version = () => ({
			generation: null,
			rawSeq: null,
			updatedAt: null
		});
		return {
			target: memory.target,
			assertCurrent: memory.assertCurrent,
			read: async () => {
				if (!memory.missing) return memory.read("session.history.hydrate", { limits });
				memory.assertCurrent();
				return limits ? {
					kind: "bounded",
					snapshot: {
						activeLeafEntryId: null,
						version: version(),
						events: [],
						opaqueParents: /* @__PURE__ */ new Map(),
						parents: /* @__PURE__ */ new Map(),
						firstKeptRanges: /* @__PURE__ */ new Map(),
						persistedSuffixStartSeq: 0,
						boundaryCount: 0,
						serializedBytes: 0,
						totalEvents: 0,
						transcriptMutationAt: null,
						truncated: false,
						completeActivePath: true
					}
				} : {
					kind: "full",
					snapshot: {
						events: [],
						eventJson: [],
						eventSeqs: [],
						version: version()
					}
				};
			},
			readCurrentTurnEntry: async (request) => {
				if (!memory.missing) return memory.read("session.history.current-turn-entry", request);
				memory.assertCurrent();
				return {
					kind: "current-turn-entry",
					version: version()
				};
			},
			readMaintenance: async (request) => {
				if (!memory.missing) return memory.read("session.history.maintenance", { request });
				memory.assertCurrent();
				return { kind: "transcript-maintenance" };
			},
			readRecentActiveEvents: async (maxEvents) => {
				if (!memory.missing) return memory.read("session.history.recent-active-events", { maxEvents });
				memory.assertCurrent();
				return [];
			},
			readLatestActiveMessage: async () => {
				if (!memory.missing) return memory.read("session.history.latest-active-message", {});
				memory.assertCurrent();
			}
		};
	}
	const target = captureSessionTranscriptTargetBinding(source);
	const contextLimits = limits ? {
		maxBytes: limits.maxBytes,
		maxEvents: limits.maxEvents
	} : void 0;
	const receipt = resolveSessionTranscriptReadFence(target);
	const admission = receipt ? { ...receipt } : void 0;
	signal?.throwIfAborted();
	const readInOwner = async (readInWorker) => {
		signal?.throwIfAborted();
		const resolvedScope = await prepareSqliteTranscriptReadScope(target, signal);
		signal?.throwIfAborted();
		const options = toDatabaseOptions(resolvedScope);
		const databasePath = resolveOpenClawAgentSqlitePath(options);
		await revalidateAgentDatabaseTerminalOpenAsync(databasePath, () => signal?.throwIfAborted(), signal);
		try {
			const result = await withSessionHistoryWorkerDatabase(options, async (owner) => {
				const assertReadCurrent = () => {
					signal?.throwIfAborted();
					owner.assertCurrent();
				};
				try {
					return await readRestoredSessionTranscriptInWorker({
						scope: target,
						resolved: resolvedScope,
						owner,
						assertCurrent: assertReadCurrent
					}, () => readInWorker(owner, resolvedScope));
				} finally {
					owner.assertCurrent();
				}
			}, lane);
			signal?.throwIfAborted();
			return result;
		} finally {
			assertAgentDatabaseTerminalOpenAllowed(databasePath);
		}
	};
	const retainedRead = (selection) => {
		if (!contextLimits) return;
		const hot = readOwnedSessionTranscriptState(target);
		if (!hot) return;
		const retained = readSessionActorTranscriptReplica(hot);
		const prepared = readSessionActorTranscriptContext(retained, hot, contextLimits, admission);
		if (!prepared) return;
		runWithSessionTranscriptReadFence(admission, () => resolveSqliteSessionTranscriptReadFence({
			database: { path: target.storePath },
			...target
		}));
		if (selection) {
			const transcript = readSessionActorTranscriptAnchors(hot, {
				agentId: target.agentId,
				path: target.storePath,
				sessionId: target.sessionId
			}, selection, retained?.tail);
			if (!transcript) return;
			prepared.transcript = transcript;
		} else delete prepared.transcript;
		return prepared;
	};
	const retainRead = (prepared) => {
		if (prepared.kind !== "bounded" || !contextLimits) return;
		const hot = readOwnedSessionTranscriptState(target);
		if (!hot) return;
		const retained = seedSessionActorTranscriptContext(readSessionActorTranscriptReplica(hot), hot, prepared, contextLimits, admission);
		if (retained) retainSessionActorTranscriptReplica(hot, retained);
	};
	const read = async () => {
		signal?.throwIfAborted();
		const retained = retainedRead();
		if (retained) return retained;
		const prepared = await readInOwner((owner, resolvedScope) => owner.readTranscript({
			target,
			resolvedScope,
			limits: contextLimits,
			admission
		}, signal));
		retainRead(prepared);
		return prepared;
	};
	const readCohort = contextLimits ? (selection, consume) => {
		const capturedSelection = structuredClone(selection);
		return withSessionTranscriptReadSource(target, async ({ scope, resolved, owner, expectedIdentity, assertCurrent: assertSource }) => {
			const { captureSessionEntryNativeMutationWitness } = await import("./session-entry-read-ordered-BDuUakEp.mjs");
			assertSource();
			const database = {
				agentId: resolved.databaseAgentId ?? resolved.agentId,
				path: scope.storePath,
				env: scope.env
			};
			await readRestoredSessionTranscriptInWorker({
				scope,
				resolved,
				owner,
				assertCurrent: assertSource
			}, () => runOpenClawAgentWriteAdmission(database, async (_identity, assertOwner) => {
				assertSource();
				const assertNative = captureSessionEntryNativeMutationWitness([database]);
				const prepared = retainedRead(capturedSelection) ?? await owner.readTranscript({
					target: scope,
					resolvedScope: resolved,
					expectedIdentity,
					limits: contextLimits,
					admission,
					transcript: capturedSelection,
					preparedEntry: readOwnedSessionTranscriptEntry(target)
				}, signal);
				signal?.throwIfAborted();
				assertOwner();
				assertSource();
				assertNative();
				retainRead(prepared);
				const consumed = consume(prepared);
				if (isPromiseLike(consumed)) {
					Promise.resolve(consumed).catch(() => {});
					throw new Error("Transcript cohort consumers must remain synchronous");
				}
			}, true, void 0, signal, "history.hydration"));
		}, signal, targetDiscoveryLane);
	} : void 0;
	const readCurrentTurnEntry = (input) => {
		const request = {
			entryId: input.entryId,
			version: { ...input.version },
			includeEntry: input.includeEntry
		};
		return readInOwner((owner, resolvedScope) => owner.readCurrentTurnEntry({
			...request,
			target,
			resolvedScope,
			admission
		}, signal));
	};
	const readMaintenance = (request) => readInOwner((owner, resolvedScope) => owner.readMaintenance({
		target,
		resolvedScope,
		admission,
		request
	}, signal));
	const readRecentActiveEvents = (maxEvents) => readInOwner((owner, resolvedScope) => owner.readRecentActiveEvents({
		target,
		resolvedScope,
		maxEvents,
		admission
	}, signal));
	const readLatestActiveMessage = () => readInOwner((owner, resolvedScope) => owner.readLatestActiveMessage({
		target,
		resolvedScope,
		admission
	}, signal));
	return {
		target,
		read,
		readCohort,
		readCurrentTurnEntry,
		readMaintenance,
		readRecentActiveEvents,
		readLatestActiveMessage,
		assertCurrent: () => signal?.throwIfAborted()
	};
}
//#endregion
export { prepareSessionTranscriptHydration as t };
