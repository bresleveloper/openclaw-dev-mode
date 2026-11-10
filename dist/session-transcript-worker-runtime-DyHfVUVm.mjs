import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { p as hasSqliteDatabaseSchemaAdmissionForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { r as WorkerTaskError } from "./src-NEpyeLp1.mjs";
import "./worker-task-pool-D6ogd941.mjs";
import { n as runWithSqliteDatabaseAdmissionTurn } from "./sqlite-database-admission-turn-BwijprYk.mjs";
import { a as captureOpenClawAgentDatabaseReadValidation } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { o as readSessionActorProjectionReceipt } from "./session-actor-replica-D_j2y4I5.mjs";
import { n as decodeSessionTranscriptWorkerReadError, o as unwrapSessionTranscriptWorkerReply } from "./session-history-worker-errors-D75quOgT.mjs";
import { c as maintenanceLane, d as refreshDatabaseWorkerPressureSubscription, g as targetDiscoveryLane, h as settleSessionHistoryWorkerEviction, m as rotateDatabaseWorkers, n as armDatabaseWorkerIdleRetirement, o as historyClearTimeout, s as historyLane, t as acquireHistoryDatabaseResource, u as pruneHistoryDatabases } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { types } from "node:util";
//#region src/config/sessions/session-transcript-worker-read-admission.ts
/** Retain schema admission through reply processing without locking the consumer. */
async function withSessionHistoryReadAdmission({ lane: requestedLane, ...options }, request, run) {
	const deadline = performance.now() + request.timeoutMs;
	const remainingTime = () => {
		const remaining = deadline - performance.now();
		if (remaining <= 0) throw new WorkerTaskError("worker task timed out", "timeout");
		return remaining;
	};
	let additionalLane;
	try {
		const cold = !request.knownSource && !hasSqliteDatabaseSchemaAdmissionForPath(options.path);
		const lane = cold ? targetDiscoveryLane : requestedLane;
		if (lane !== requestedLane) {
			historyClearTimeout(lane.idleTimer);
			lane.pending++;
			additionalLane = lane;
			refreshDatabaseWorkerPressureSubscription();
		}
		const admit = async (dispatch) => {
			const start = (signal) => {
				return dispatch(signal, remainingTime());
			};
			const dispatchCold = async () => {
				const controller = new AbortController();
				const signal = request.signal ? AbortSignal.any([request.signal, controller.signal]) : controller.signal;
				const abort = () => controller.abort(new WorkerTaskError("Session history database read was revoked", "unavailable"));
				request.aborters.add(abort);
				const timer = setTimeout(() => controller.abort(new WorkerTaskError("worker task timed out", "timeout")), Math.max(1, deadline - performance.now()));
				timer.unref?.();
				try {
					return await runOpenClawAgentWriteAdmission(options, () => {
						clearTimeout(timer);
						return start(signal);
					}, true, void 0, signal, "history.cold-read");
				} finally {
					clearTimeout(timer);
					request.aborters.delete(abort);
				}
			};
			return cold ? dispatchCold() : start(request.signal);
		};
		return await run(admit, lane);
	} finally {
		if (additionalLane) {
			additionalLane.pending--;
			armDatabaseWorkerIdleRetirement(additionalLane);
		}
	}
}
//#endregion
//#region src/config/sessions/session-transcript-worker-readers.ts
/** Decode domain results; database custody remains with the enclosing history owner. */
function createSessionHistoryWorkerReaders(runRequest) {
	function reader(kind, project, prepare) {
		return async (input, signal) => runRequest(() => {
			if (prepare) return prepare(input);
			return {
				kind,
				...input
			};
		}, JSON.stringify(input).length * 2, project, signal);
	}
	return {
		readTrajectoryEvents: reader("trajectory-events", (value) => value.events),
		readTrajectoryRetention: (input, options) => {
			const captured = {
				...input,
				input: { ...input.input },
				expectedIdentity: { ...input.expectedIdentity },
				env: captureSessionTranscriptStorageEnvironment(input.env)
			};
			return runRequest(() => ({
				kind: "trajectory-retention",
				...captured
			}), JSON.stringify(captured).length * 2, (value) => value.plan, options.signal, void 0, options.timeoutMs);
		},
		readCleanup: reader("session-cleanup", (value) => value),
		readRawDelta: reader("transcript-raw-delta", (value) => value.result),
		readLatestAssistant: reader("transcript-latest-assistant", (value) => value.result),
		readVisibleDelta: reader("transcript-visible-delta", (value) => value.result),
		readSessionMemoryCapture: reader("session-memory-capture", (value) => value.result),
		readBoardSnapshot: reader("board-snapshot", (result) => result.value),
		readBoardWidgetDocument: reader("board-widget-document", (result) => result.value),
		readBranchSummaries: reader("branch-summaries", (value) => value.result),
		readMessagePresence: reader("transcript-message-presence", (value) => value.present),
		readAnchors: reader("transcript-anchors", (value) => value.facts),
		readRuntimeTarget: reader("session-runtime-target", (value) => value.target),
		readConversations: reader("conversation-rows", (value) => value.rows),
		prewarm: reader("prewarm", () => void 0),
		readRetirement: reader("session-retirement-read", (value) => value.result),
		readPendingArchives: reader("session-pending-archives", (value) => value.pending),
		readLifecycleArtifactPlan: reader("lifecycle-artifact-plan", (value) => value),
		readTranscriptStatsBatch: reader("transcript-stats-batch", (value) => value.stats),
		readTranscriptInstances: reader("session-transcript-instances", (value) => value.instances, (input) => ({
			kind: "session-transcript-instances",
			...input,
			scope: {
				...input.scope,
				env: captureSessionTranscriptStorageEnvironment(input.scope.env ?? process.env)
			}
		})),
		readMemorySessionTargets: reader("memory-session-targets", (value) => value.targets, (input) => ({
			kind: "memory-session-targets",
			...input,
			params: {
				...input.params,
				env: captureSessionTranscriptStorageEnvironment(input.params.env)
			}
		})),
		readArchiveInventory: reader("session-archive-inventory", (value) => value.archives, (input) => ({
			kind: "session-archive-inventory",
			...input,
			env: captureSessionTranscriptStorageEnvironment(input.env ?? process.env)
		})),
		readCorpusInventory: reader("session-corpus-inventory", (value) => value.entries, (input) => ({
			kind: "session-corpus-inventory",
			...input,
			scope: {
				...input.scope,
				env: captureSessionTranscriptStorageEnvironment(input.scope.env)
			}
		})),
		readArchivePresence: reader("session-archive-presence", (value) => value.registered),
		findTranscriptEvent: reader("transcript-match", (value) => value.result, (request) => ({
			kind: "transcript-match",
			request
		})),
		readHistoricalEvictionCandidates: reader("historical-eviction-candidates", (value) => {
			if (!("sessionIds" in value)) throw new Error("Session history worker returned archived instead of historical candidates");
			return value.sessionIds;
		}, (input) => ({
			kind: "historical-eviction-candidates",
			...input
		})),
		readArchivedEvictionCandidates: reader("historical-eviction-candidates", (value) => {
			if (!("batch" in value)) throw new Error("Session history worker returned historical instead of archived candidates");
			return value.batch;
		}, (input) => ({
			kind: "historical-eviction-candidates",
			...input
		})),
		readArchivePruning: reader("session-archive-pruning", (value) => value.result),
		readColdMetadata: reader("cold-metadata", (value) => value),
		readColdStorageInventory: reader("cold-storage-inventory", (value) => value),
		searchTranscripts: (params, readIndexStatus) => runRequest(() => ({
			kind: "transcript-search",
			params
		}), JSON.stringify(params).length * 2, (value) => value.result, void 0, async (request, signal) => {
			if (request !== "transcript-index-status") throw new Error("Unexpected transcript search status request");
			return {
				input: await readIndexStatus(signal),
				timeoutMs: 6e4
			};
		}),
		readPreview: reader("session-preview", (value) => value.items),
		readTitleFields: reader("session-title-fields", (value) => value.fields),
		readWatermark: reader("transcript-watermark", (value) => value.watermark),
		readStats: reader("transcript-stats", (value) => value.stats),
		readActivitySummarySource: reader("session-activity-summary-source", (value) => value.source),
		run: async (prepare, inputBytes) => await runRequest(prepare, inputBytes, (value) => value),
		readTranscript: async (input, signal) => {
			const events = [];
			const eventJson = input.includeEventJson ? [] : void 0;
			const eventSeqs = input.includeEventJson ? [] : void 0;
			const parts = [];
			let decoder;
			const receiveChunk = (value) => {
				if (!isRecord(value) || value.kind !== "transcript-hydration-chunk" || typeof value.encoding !== "string" || !Array.isArray(value.frames)) throw new Error("Session history worker returned an invalid transcript chunk");
				decoder ??= new TextDecoder(value.encoding, { ignoreBOM: true });
				for (const frame of value.frames) {
					if (!isRecord(frame) || !types.isUint8Array(frame.data) || typeof frame.endOfEvent !== "boolean") throw new Error("Session history worker returned an invalid transcript frame");
					parts.push(frame.data);
					if (frame.endOfEvent) {
						const json = decoder.decode(parts.length === 1 ? parts[0] : Buffer.concat(parts));
						events.push(JSON.parse(json));
						eventJson?.push(json);
						if (eventSeqs) {
							if (typeof frame.seq !== "number" || !Number.isSafeInteger(frame.seq)) throw new Error("Transcript snapshot omitted its row sequence");
							eventSeqs.push(frame.seq);
						}
						parts.length = 0;
					}
				}
			};
			return await runRequest(() => ({
				kind: "transcript-hydration",
				...input
			}), JSON.stringify(input).length * 2, (value) => {
				if (value.kind === "bounded") return value;
				if (parts.length !== 0 || events.length !== value.eventCount) throw new Error("Session history worker returned an incomplete transcript");
				return {
					kind: "full",
					snapshot: {
						events,
						version: value.version,
						...eventJson ? {
							eventJson,
							eventSeqs
						} : {}
					}
				};
			}, signal, input.limits ? void 0 : receiveChunk);
		},
		readMaintenance: reader("transcript-maintenance", (value) => value),
		readCurrentTurnEntry: reader("current-turn-entry", (value) => value),
		readRecentActiveEvents: reader("recent-active-events", (value) => value.events),
		readLatestActiveMessage: reader("latest-active-message", (value) => value.message),
		readVoiceSessions: reader("voice-sessions", (value) => value),
		readMembershipFacts: reader("session-membership-facts", (value) => value),
		readMembers: reader("session-members", (value) => value),
		readSuggestions: reader("session-suggestions", (value) => value.suggestions),
		readReactions: reader("session-reactions", (value) => value.reactions),
		readExactEntries: async (input, signal) => {
			const captured = {
				...input,
				env: captureSessionTranscriptStorageEnvironment(input.env)
			};
			return runRequest(() => ({
				kind: "session-exact-entries",
				...captured
			}), JSON.stringify(captured).length * 2, (value) => value, signal);
		},
		readRowFacts: async (input) => {
			if (input.sessionKeys.length > 64) throw new Error(`Session row facts support at most 64 keys`);
			const captured = {
				env: { ...input.env },
				sessionKeys: [...input.sessionKeys],
				continuation: input.continuation ? { ...input.continuation } : void 0
			};
			return await runRequest(() => ({
				kind: "session-row-facts",
				...captured
			}), JSON.stringify(captured).length * 2, (value) => value);
		},
		readProgressCard: reader("session-progress-card", (value) => value.card),
		readPendingInputHistory: reader("session-pending-input-history", (value) => value.snapshot),
		readPendingInputReceipts: reader("session-pending-input-receipts", (value) => value.receipts),
		readHarnessCompletionSource: reader("session-harness-completion-source", (value) => value.snapshot),
		readPendingInputSource: reader("session-pending-input-source", (value) => value.snapshot),
		readConversationDelivery: reader("conversation-delivery", (value) => value.record),
		readGoalOperationReceipt: reader("goal-operation-receipt", (value) => value.result),
		readEntryResult: reader("session-entry-read", (value) => ({
			...value.readError ? err(decodeSessionTranscriptWorkerReadError(value.readError)) : ok(value.entry),
			source: value.source,
			facts: value.facts
		})),
		readEntryCurrent: reader("session-entry-current", (value) => value.entry),
		readEntries: async (scope, continuation, expectedIdentity, ifRevision) => {
			const captured = expectedIdentity && { ...expectedIdentity };
			return runRequest(() => ({
				kind: "session-entry-list",
				scope,
				continuation,
				expectedIdentity: captured,
				ifRevision
			}), JSON.stringify({
				scope,
				continuation,
				expectedIdentity: captured,
				ifRevision
			}).length * 2, (value) => value);
		},
		readStoreProjection: reader("session-store-projection", (value) => value),
		readStoreSummary: reader("session-store-summary", (value) => value.summary),
		readIdentityEvidence: reader("session-identity-evidence", (value) => value.evidence),
		readProjectionStatus: async (input, signal) => await runRequest(() => ({
			kind: "projection-status",
			...input
		}), JSON.stringify(input).length * 2, (value) => value, signal),
		readEntryPresence: async (scope) => await runRequest(() => ({
			kind: "session-row-presence",
			scope
		}), JSON.stringify(scope).length * 2, (value) => value)
	};
}
//#endregion
//#region src/config/sessions/session-transcript-worker-runtime.ts
const log = createSubsystemLogger("sessions/history-worker");
const historyPrewarms = /* @__PURE__ */ new WeakMap();
function projectionTarget(input) {
	switch (input.kind) {
		case "history-page": return input.request.kind === "active-accounting" ? input.target.transcript : void 0;
		case "transcript-hydration":
		case "current-turn-entry":
		case "recent-active-events":
		case "latest-active-message": return input.resolvedScope;
		case "transcript-anchors": return input.resolved;
		case "session-activity-summary-source": return input.scope;
		default: return;
	}
}
function runSessionBranchSummaryWorkerRequest(request, signal) {
	const { database, ...read } = request;
	return withSessionHistoryWorkerDatabase(database, (owner) => owner.readBranchSummaries({ request: read }, signal), maintenanceLane);
}
function isSessionHistoryWorkerCold(lane = historyLane) {
	return lane.pending === 0 && lane.nativeSequence <= lane.retiredSequence;
}
/** Reuse normal reader custody; repeated warmups never refresh the idle deadline. */
async function prewarmSessionHistoryWorker(options, lane = historyLane) {
	try {
		const resource = acquireHistoryDatabaseResource(options);
		let prewarms = historyPrewarms.get(resource);
		if (!prewarms) {
			prewarms = /* @__PURE__ */ new Map();
			historyPrewarms.set(resource, prewarms);
		}
		const existing = prewarms.get(lane);
		if (existing && (existing.pending || resource.nativeSequences.has(lane))) return await existing.promise;
		const prewarm = {
			promise: withSessionHistoryWorkerDatabase(options, (owner) => owner.prewarm({
				env: captureSessionTranscriptStorageEnvironment(options.env ?? process.env),
				history: lane === historyLane
			}), lane).then(() => {
				prewarm.pending = false;
			}, (error) => {
				prewarms.delete(lane);
				log.debug(`Session history worker prewarm failed: ${String(error)}`);
			}),
			pending: true
		};
		prewarms.set(lane, prewarm);
		await prewarm.promise;
	} catch (error) {
		log.debug(`Session history worker prewarm failed: ${String(error)}`);
	}
}
/** Single and batch reads synchronously retain the same lane-aware database owner. */
function retainSessionHistoryWorkerDatabase(options, lane = historyLane) {
	const owned = acquireHistoryDatabaseResource(options);
	const { database } = owned;
	let knownSource = false;
	const assertCurrent = () => {
		if (owned.revoked) throw new WorkerTaskError("Session history database read was revoked", "unavailable");
	};
	historyClearTimeout(lane.idleTimer);
	lane.pending++;
	owned.pending++;
	refreshDatabaseWorkerPressureSubscription();
	let released = false;
	const release = () => {
		if (released) return;
		released = true;
		owned.pending--;
		lane.pending--;
		armDatabaseWorkerIdleRetirement(lane);
		pruneHistoryDatabases();
	};
	try {
		const runRequest = async (prepare, inputBytes, receive, signal, onRequest, timeoutMs = 6e4) => {
			let retirement;
			const hostEffects = /* @__PURE__ */ new Set();
			return withSessionHistoryReadAdmission({
				...options,
				...database,
				lane
			}, {
				knownSource,
				timeoutMs,
				signal,
				aborters: owned.aborters
			}, async (admit, requestLane) => {
				try {
					const reply = await admit((requestSignal, remaining) => {
						return runWithSqliteDatabaseAdmissionTurn([database.path], () => {
							const validation = captureOpenClawAgentDatabaseReadValidation(database, owned.nativeSequences.has(requestLane) ? "retained" : "admission");
							return requestLane.pool.run(() => {
								assertCurrent();
								options.prepareRead?.();
								const input = prepare();
								const projection = projectionTarget(input);
								const projectionReceipt = projection?.sessionId ? readSessionActorProjectionReceipt({
									path: database.path,
									sessionKey: projection.sessionKey,
									sessionId: projection.sessionId
								}) : void 0;
								owned.nativeSequences.set(requestLane, ++requestLane.nativeSequence);
								return {
									...input,
									database,
									validation: validation?.validation,
									projectionReceipt: projectionReceipt && (input.kind === "history-page" ? {
										...projectionReceipt,
										entrySessionKey: void 0,
										facts: void 0,
										contextOnly: true
									} : projectionReceipt)
								};
							}, {
								inputBytes: inputBytes + (validation?.inputBytes ?? 0),
								timeoutMs: remaining,
								signal: requestSignal,
								onRequest: onRequest ? (value, context) => {
									const effect = (async () => {
										context.signal.throwIfAborted();
										const response = await onRequest(value, context.signal);
										context.signal.throwIfAborted();
										return response ?? {
											input: null,
											timeoutMs
										};
									})();
									hostEffects.add(effect);
									owned.hostEffects.add(effect);
									const releaseEffect = () => {
										hostEffects.delete(effect);
										owned.hostEffects.delete(effect);
									};
									effect.then(releaseEffect, releaseEffect);
									return effect;
								} : void 0,
								onExecutionSettled: ({ retired }) => {
									if (retired) retirement = rotateDatabaseWorkers(requestLane);
								}
							});
						});
					});
					await retirement;
					const received = unwrapSessionTranscriptWorkerReply(reply);
					if (typeof received !== "boolean" && !Array.isArray(received) && (received.kind === "session-entry-read" || received.kind === "session-entry-list" || received.kind === "session-cleanup" || received.kind === "session-exact-entries" || received.kind === "session-entry-current" || received.kind === "session-runtime-target") && received.source) knownSource = true;
					const value = receive(received);
					if (reply.ok && reply.closedHistoryDatabase) await settleSessionHistoryWorkerEviction(requestLane, reply.closedHistoryDatabase);
					return value;
				} finally {
					await Promise.allSettled(hostEffects);
				}
			});
		};
		return {
			owner: {
				assertCurrent,
				...createSessionHistoryWorkerReaders(runRequest)
			},
			release
		};
	} catch (error) {
		release();
		throw error;
	}
}
/** Retain each selected reader for the operation. */
async function withSessionHistoryWorkerDatabases(options, operation, lane = historyLane) {
	const retained = [];
	try {
		for (const target of options) retained.push(retainSessionHistoryWorkerDatabase(target, lane));
		return await operation(retained.map(({ owner }) => owner));
	} finally {
		for (const retainedRead of retained.toReversed()) retainedRead.release();
	}
}
/** Single-target callers retain the same batch admission and revocation boundary. */
function withSessionHistoryWorkerDatabase(options, operation, lane = historyLane) {
	return withSessionHistoryWorkerDatabases([options], (owners) => operation(expectDefined(owners[0], "retained session history reader")), lane);
}
/** Process-held sources exchange bounded pages without reopening their memory database. */
async function runProcessHeldHistoryTask(request, onRequest, signal) {
	historyLane.pending++;
	historyClearTimeout(historyLane.idleTimer);
	historyLane.idleTimer = void 0;
	refreshDatabaseWorkerPressureSubscription();
	let retirement;
	try {
		await historyLane.rotation;
		const value = unwrapSessionTranscriptWorkerReply(await historyLane.pool.run(() => {
			historyLane.nativeSequence++;
			return {
				kind: "cli-process-history",
				request
			};
		}, {
			timeoutMs: 6e4,
			onRequest,
			signal,
			onExecutionSettled: ({ retired }) => {
				if (retired) retirement = rotateDatabaseWorkers(historyLane);
			}
		}));
		await retirement;
		if (typeof value === "boolean" || Array.isArray(value) || value.kind !== "rpc" && value.kind !== "rpc-message") throw new Error("Unexpected process-held history reply");
		return value;
	} finally {
		historyLane.pending--;
		armDatabaseWorkerIdleRetirement(historyLane);
	}
}
//#endregion
export { runSessionBranchSummaryWorkerRequest as a, runProcessHeldHistoryTask as i, prewarmSessionHistoryWorker as n, withSessionHistoryWorkerDatabase as o, retainSessionHistoryWorkerDatabase as r, withSessionHistoryWorkerDatabases as s, isSessionHistoryWorkerCold as t };
