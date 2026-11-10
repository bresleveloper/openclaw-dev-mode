import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { n as parseBooleanValue } from "./boolean-CFfzB3ix.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { a as readSqliteInspectionBudget } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { o as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { c as SqliteWorkerError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { t as captureOpenClawStateReadContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { n as runOpenClawAgentWorkerWrite, r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { i as toDatabaseOptions, r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as parseSqliteSessionFileMarker, t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-CkjJ0jcJ.mjs";
import { n as TRAJECTORY_RUNTIME_EVENT_MAX_BYTES } from "./paths-Cc42TKDr.mjs";
import { n as captureSessionActorStorageOwner, r as getSessionActorStorageBinding } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { n as resolveSqliteReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { s as isNativeSessionEntryRead } from "./session-entry-read-ordered-ygEz3W0N.mjs";
import { r as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { c as maintenanceLane } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { r as retainSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { c as withSessionEntriesFromStoresInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { n as IncognitoSessionMissingError } from "./incognito-session-error-Dsi9IsoJ.mjs";
import { t as readSessionActorStorageResult } from "./session-actor-storage-result-BfP7PrnB.mjs";
import { i as loadSessionEntry } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { c as trajectoryRuntimeRetentionState, s as trajectoryRuntimeRetentionDue } from "./runtime-retention.sqlite-DfZeO9Sv.mjs";
import { t as safeJsonStringify } from "./safe-json-q5hA23KQ.mjs";
import { hash } from "node:crypto";
import path from "node:path";
import { setImmediate } from "node:timers/promises";
import { isProxy } from "node:util/types";
import { projectDiagnosticValue } from "@openclaw/ai/diagnostics";
import { createDiagnosticRecord } from "@openclaw/ai/internal/shared";
//#region src/trajectory/runtime-retention.ts
const log = createSubsystemLogger("trajectory");
/** One lifecycle-owned sweep; reads never hold the canonical writer reservation. */
function scheduleSqliteTrajectoryRuntimeRetention(params) {
	const { identity, options, assertCurrent: assertSourceCurrent } = params;
	const input = {
		sessionId: params.input.sessionId,
		maxGlobalRuntimeBytes: params.input.maxGlobalRuntimeBytes
	};
	const state = trajectoryRuntimeRetentionState(identity);
	if (state.pending) return state.pending;
	const now = Date.now();
	if (!trajectoryRuntimeRetentionDue(state, now)) return;
	const { physicalIdentity } = identity;
	state.sweptAt = now;
	const controller = new AbortController();
	const lease = new Int32Array(new SharedArrayBuffer(4));
	Atomics.store(lease, 0, 1);
	controller.signal.addEventListener("abort", () => Atomics.store(lease, 0, 0), { once: true });
	let unregister;
	let unregisterRoot;
	const close = async () => {
		controller.abort();
		await state.pending;
	};
	let execution;
	let reader;
	const cleanup = async () => {
		Atomics.store(lease, 0, 0);
		const failures = (await Promise.allSettled([Promise.resolve().then(() => reader?.release()), Promise.resolve().then(() => execution?.release())])).flatMap((outcome) => outcome.status === "rejected" ? [outcome.reason] : []);
		if (failures.length) throw new AggregateError(failures, "Trajectory retention cleanup failed");
		unregisterRoot?.();
		unregister?.();
		state.pending = void 0;
	};
	const observeFailure = (error) => {
		log.warn(`Trajectory retention cleanup failed: ${String(error)}`);
	};
	try {
		execution = captureOpenClawAgentDatabaseExecution(options, { expectedIdentity: identity });
		unregister = registerOpenClawAgentDatabaseAsyncResource({
			agentId: execution.agentId,
			path: execution.path,
			revoke: () => controller.abort(),
			close
		});
		const root = captureOpenClawStateReadContext(resolveOpenClawStateSqlitePath(options.env));
		unregisterRoot = registerOpenClawStateDatabaseAsyncResource({ close: async (closed) => {
			if (!closed || closed.key === root.admission.identity.key) await close();
		} });
		reader = retainSessionHistoryWorkerDatabase(options, maintenanceLane);
	} catch (error) {
		log.warn(`Trajectory retention deferred until the next sweep: ${String(error)}`);
		state.pending = cleanup();
		state.pending.catch(observeFailure);
		return state.pending;
	}
	const retained = execution;
	const assertCurrent = () => {
		controller.signal.throwIfAborted();
		retained.assertCurrent();
		assertSourceCurrent?.();
	};
	const retainedReader = reader;
	const execute = async (operation) => {
		assertCurrent();
		const result = await runOpenClawAgentWorkerWrite(options, () => retained.runExisting({
			assertCurrent,
			createAdmission: (binding) => () => ({
				nativeLocations: binding.nativeLocations,
				admission: createSqliteWorkerOperationAdmission((request, grant) => {
					binding.authorize(request);
					assertCurrent();
					if (!grant()) throw new Error("Trajectory retention authority expired");
				}, {
					...binding.attachment,
					trajectoryRetentionLease: lease.buffer
				})
			})
		}, operation), void 0, controller.signal);
		if (result === void 0) throw new Error("Trajectory retention database disappeared before deletion");
		return result;
	};
	state.pending = runInDetachedAsyncContext(async () => {
		try {
			await setImmediate(void 0, { signal: controller.signal });
			const sweepId = await execute((worker) => worker.execute({
				type: "trajectory.retention.begin",
				input: void 0
			}));
			let snapshot = await retainedReader.owner.readTrajectoryRetention({
				input,
				now,
				expectedIdentity: {
					key: `file:${physicalIdentity}`,
					birthtime: identity.birthtime
				},
				env: options.env ?? process.env
			}, {
				signal: controller.signal,
				timeoutMs: readSqliteInspectionBudget("read-only snapshot", retained.path).timeoutMs
			});
			for (;;) {
				assertCurrent();
				const result = await execute((worker) => worker.execute({
					type: "trajectory.retention.delete",
					input: {
						sweepId,
						snapshot
					}
				}));
				snapshot = void 0;
				if (result.complete || result.refresh) break;
			}
		} catch (error) {
			if (!controller.signal.aborted) log.warn(`Trajectory retention deferred until the next sweep: ${String(error)}`);
		} finally {
			await cleanup();
		}
	});
	state.pending.catch(observeFailure);
	return state.pending;
}
//#endregion
//#region src/trajectory/runtime-store-memory.ts
/** The runtime owns opt-in; this sink only queues its already-approved bounded events. */
function createMemoryTrajectoryRuntimeSink(source, params) {
	const { authority } = source;
	const sessionKey = params.sessionKey ?? source.owner?.readSessionById(params.sessionId, authority)?.sessionKey ?? source.binding?.actor.target.sessionKey;
	const selected = () => {
		const binding = getSessionActorStorageBinding({}) ?? source.binding;
		return binding?.agentId === source.agentId && binding.path === source.path && binding.actor.target.sessionKey === sessionKey ? binding : void 0;
	};
	const bound = selected();
	if ((bound ? bound.actor.snapshot(authority) : sessionKey ? source.owner?.readSession(sessionKey, authority) : void 0)?.entry?.sessionId !== params.sessionId) return null;
	const append = async (input) => {
		const binding = selected();
		const actor = binding?.actor ?? (sessionKey ? await source.owner?.acquireExisting(sessionKey, {
			assertCurrent: () => authority.assertCurrent(),
			assertReadable: () => authority.assertCurrent()
		}) : void 0);
		if (!actor) throw new IncognitoSessionMissingError();
		try {
			return await actor.storage.mutate({
				type: "session.trajectory.append",
				input
			}, authority);
		} finally {
			if (!binding) await actor.release();
		}
	};
	let pending = /* @__PURE__ */ new Map();
	let queuedBytes = 0;
	let discardPrevious = false;
	let flushing;
	let backgroundFailed = false;
	const trim = () => {
		while (queuedBytes > params.maxRuntimeFileBytes && pending.size > 1) {
			const [event, bytes] = pending.entries().next().value;
			pending.delete(event);
			queuedBytes -= bytes;
			discardPrevious = true;
		}
	};
	const flush = () => {
		if (flushing) return flushing.then(flush);
		if (pending.size === 0) return Promise.resolve();
		const batch = pending;
		const batchBytes = queuedBytes;
		const batchDiscard = discardPrevious;
		pending = /* @__PURE__ */ new Map();
		queuedBytes = 0;
		discardPrevious = false;
		let committed = false;
		flushing = append({
			sessionId: params.sessionId,
			events: [...batch.keys()],
			discardPrevious: batchDiscard,
			maxRuntimeBytes: params.maxRuntimeFileBytes
		}).then((result) => {
			committed = result.kind === "committed";
			readSessionActorStorageResult(result);
		}).catch((error) => {
			if (!committed && !discardPrevious) {
				pending = new Map([...batch, ...pending]);
				queuedBytes += batchBytes;
				discardPrevious = batchDiscard;
				trim();
			}
			throw error;
		}).finally(() => {
			flushing = void 0;
		});
		return flushing;
	};
	return {
		describeFlushState: () => pending.size || flushing ? `pendingRows=${pending.size} queuedBytes=${queuedBytes} activeOperation=memory-append` : void 0,
		flush: async () => {
			backgroundFailed = false;
			await flush();
		},
		write(event, line) {
			const bytes = Buffer.byteLength(line) + 1;
			pending.set({
				runId: event.runId,
				ts: event.ts,
				line
			}, bytes);
			queuedBytes += bytes;
			trim();
			if (!flushing && !backgroundFailed && (pending.size >= 32 || queuedBytes >= 262144)) flush().catch(() => {
				backgroundFailed = true;
			});
		}
	};
}
//#endregion
//#region src/trajectory/runtime-store-writer.ts
function captureTrajectoryTarget(params) {
	return params.sessionTarget ? {
		agentId: normalizeOptionalString(params.sessionTarget.agentId),
		sessionId: normalizeOptionalString(params.sessionTarget.sessionId),
		sessionKey: normalizeOptionalString(params.sessionTarget.sessionKey),
		storePath: normalizeOptionalString(params.sessionTarget.storePath)
	} : void 0;
}
async function createSqliteTrajectoryRuntimeSink(input) {
	const params = {
		...input,
		env: {
			...input.env,
			OPENCLAW_STATE_DIR: resolveStateDir(input.env)
		},
		sessionTarget: input.sessionTarget && { ...input.sessionTarget }
	};
	const target = captureTrajectoryTarget(params);
	const marker = parseSqliteSessionFileMarker(params.sessionFile);
	if (target?.storePath && params.sessionTarget) {
		target.storePath = path.resolve(target.storePath);
		params.sessionTarget = {
			...params.sessionTarget,
			storePath: target.storePath
		};
	}
	params.sessionFile = marker ? formatSqliteSessionFileMarker(marker) : params.sessionFile;
	const scope = target?.agentId && target.sessionId && target.sessionKey && target.storePath ? {
		agentId: target.agentId,
		sessionKey: target.sessionKey,
		storePath: target.storePath
	} : target?.sessionKey && marker ? {
		...marker,
		sessionKey: target.sessionKey
	} : void 0;
	params.assertCommitAllowed?.();
	const memory = captureSessionActorStorageOwner({
		...scope ?? marker,
		env: params.env,
		sessionId: params.sessionId,
		sessionKey: scope?.sessionKey ?? params.sessionKey,
		sessionActor: params.sessionActor
	}, {
		assertCurrent: () => params.assertCommitAllowed?.(),
		authorize() {}
	});
	if (memory) return createMemoryTrajectoryRuntimeSink(memory, {
		...params,
		sessionKey: scope?.sessionKey ?? params.sessionKey
	});
	if (!scope || isNativeSessionEntryRead({
		...scope,
		env: params.env
	}, scope.agentId)) return buildSqliteTrajectoryRuntimeSink(params, loadSessionEntry);
	return withSessionEntriesFromStoresInWorker([{
		...scope,
		env: params.env,
		sessionKeys: [resolveSqliteSessionKey(scope.sessionKey, scope.agentId)],
		projection: "exact",
		snapshotFields: []
	}], ([read]) => {
		params.assertCommitAllowed?.();
		read.assertCurrent();
		return buildSqliteTrajectoryRuntimeSink(params, () => read.result.entries[0]?.entry, {
			agentId: read.database.agentId,
			path: read.database.path,
			env: read.database.env
		});
	}, { ordered: true });
}
function buildSqliteTrajectoryRuntimeSink(params, readEntry, preparedDatabase) {
	const target = captureTrajectoryTarget(params);
	const legacyMarker = parseSqliteSessionFileMarker(params.sessionFile);
	const completeTarget = Boolean(target?.agentId && target.sessionId && target.sessionKey && target.storePath);
	const targetKeyAgentId = parseAgentSessionKey(target?.sessionKey)?.agentId;
	const requestedSessionKey = normalizeOptionalString(params.sessionKey);
	const completeTargetKeyEntry = completeTarget && target?.agentId && target.sessionKey && target.storePath ? readEntry({
		agentId: target.agentId,
		sessionKey: target.sessionKey,
		storePath: target.storePath
	}) : void 0;
	if (completeTarget && (requestedSessionKey && target?.sessionKey !== requestedSessionKey || targetKeyAgentId && target?.agentId !== targetKeyAgentId || completeTargetKeyEntry && completeTargetKeyEntry.sessionId !== target?.sessionId)) return null;
	const targetKeyEntry = target?.sessionKey && legacyMarker && !completeTarget ? readEntry({
		agentId: legacyMarker.agentId,
		sessionKey: target.sessionKey,
		storePath: legacyMarker.storePath
	}) : void 0;
	if (target && !completeTarget && legacyMarker && (target.agentId && target.agentId !== legacyMarker.agentId || target.sessionId && target.sessionId !== legacyMarker.sessionId || targetKeyAgentId && targetKeyAgentId !== legacyMarker.agentId || target.sessionKey && targetKeyEntry?.sessionId !== legacyMarker.sessionId || target.storePath && path.resolve(target.storePath) !== path.resolve(legacyMarker.storePath))) return null;
	const marker = target?.agentId && target.sessionId && target.sessionKey && target.storePath ? {
		agentId: target.agentId,
		sessionId: target.sessionId,
		sessionKey: target.sessionKey,
		storePath: target.storePath
	} : legacyMarker;
	if (!marker || marker.sessionId !== params.sessionId) return null;
	const env = { ...params.env };
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const databaseOptions = preparedDatabase ?? toDatabaseOptions(resolveSqliteReadScope({
		...marker,
		env
	}));
	let pendingEvents = /* @__PURE__ */ new Map();
	let queuedBytes = 0;
	let discardPrevious = false;
	let inFlight;
	let unsettledAppend;
	const trimPending = () => {
		while (queuedBytes > params.maxRuntimeFileBytes && pendingEvents.size > 1) {
			const [oldest, oldestBytes] = pendingEvents.entries().next().value;
			pendingEvents.delete(oldest);
			queuedBytes -= oldestBytes;
			discardPrevious = true;
		}
	};
	const flushPending = async () => {
		if (unsettledAppend) throw unsettledAppend;
		if (pendingEvents.size === 0 && !inFlight) return;
		await runOpenClawAgentWriteAdmission(databaseOptions, async () => {
			if (unsettledAppend) throw unsettledAppend;
			if (pendingEvents.size === 0) return;
			const batch = {
				events: pendingEvents,
				bytes: queuedBytes,
				discardPrevious
			};
			inFlight = batch;
			pendingEvents = /* @__PURE__ */ new Map();
			queuedBytes = 0;
			discardPrevious = false;
			const events = [...batch.events.keys()];
			try {
				await appendSqliteTrajectoryRuntimeEventsInWorker(databaseOptions, {
					events,
					discardPrevious: batch.discardPrevious,
					maxRuntimeBytes: params.maxRuntimeFileBytes,
					sessionId: marker.sessionId
				}, params.assertCommitAllowed, (outcome) => {
					if (outcome === "committed") inFlight = void 0;
					else unsettledAppend = new SqliteWorkerError("Trajectory append outcome is unknown; pending events cannot be replayed", "outcome-unknown");
				});
			} finally {
				if (inFlight === batch && !unsettledAppend) {
					inFlight = void 0;
					if (!discardPrevious) {
						for (const [event, bytes] of pendingEvents) batch.events.set(event, bytes);
						pendingEvents = batch.events;
						queuedBytes += batch.bytes;
						discardPrevious = batch.discardPrevious;
						trimPending();
					}
				}
			}
		}, true);
	};
	let backgroundFlush;
	let backgroundFailed = false;
	const scheduleFlush = () => {
		if (backgroundFlush || backgroundFailed || unsettledAppend || pendingEvents.size < 32 && queuedBytes < 262144) return;
		backgroundFlush = flushPending().catch(() => {
			backgroundFailed = true;
		}).finally(() => {
			backgroundFlush = void 0;
			scheduleFlush();
		});
	};
	return {
		describeFlushState: () => pendingEvents.size > 0 || inFlight ? `pendingRows=${pendingEvents.size + (inFlight?.events.size ?? 0)} queuedBytes=${queuedBytes + (inFlight?.bytes ?? 0)} activeOperation=sqlite-append` : void 0,
		flush: async () => {
			await backgroundFlush;
			backgroundFailed = false;
			await flushPending();
		},
		write: (event, line) => {
			const bytes = Buffer.byteLength(line, "utf8") + 1;
			pendingEvents.set({
				runId: event.runId,
				ts: event.ts,
				line
			}, bytes);
			queuedBytes += bytes;
			trimPending();
			scheduleFlush();
		}
	};
}
async function appendSqliteTrajectoryRuntimeEventsInWorker(options, input, assertCommitAllowed, settle) {
	const execution = captureOpenClawAgentDatabaseExecution(options);
	const assertCurrent = () => {
		execution.assertCurrent();
		assertCommitAllowed?.();
	};
	let transaction;
	const source = {
		assertCurrent,
		createAdmission(binding) {
			return (retained) => {
				const admission = createSqliteWorkerOperationAdmission((request, grant) => {
					binding.authorize(request);
					if (request.stage === "transaction") transaction = {
						admission,
						retained
					};
					assertCurrent();
					if (!grant()) throw new Error("Trajectory append authority expired");
				}, binding.attachment);
				return {
					nativeLocations: binding.nativeLocations,
					admission
				};
			};
		}
	};
	try {
		await runOpenClawAgentWorkerWrite(options, async () => {
			if (!await execution.runExisting(source, async (worker) => {
				let completed = false;
				try {
					await worker.execute({
						type: "trajectory.events.append",
						input
					});
					completed = true;
				} finally {
					if (transaction) {
						const outcome = await transaction.retained.settled;
						const receipt = transaction.admission.committed?.facts;
						if (completed || isRecord(receipt) && receipt.kind === "trajectory-runtime-append") settle("committed");
						else if (outcome.kind === "unknown") settle("unknown");
					}
				}
				return true;
			})) throw new Error("Trajectory database disappeared before append");
		});
		const identity = execution.fileIdentity;
		if (identity) scheduleSqliteTrajectoryRuntimeRetention({
			identity,
			options,
			input,
			assertCurrent: assertCommitAllowed
		});
	} finally {
		await execution.release();
	}
}
//#endregion
//#region src/trajectory/runtime.ts
const TRAJECTORY_RUNTIME_DATA_STRING_MAX_CHARS = 32768;
const TRAJECTORY_RUNTIME_DATA_ARRAY_MAX_ITEMS = 64;
const TRAJECTORY_RUNTIME_DATA_OBJECT_MAX_KEYS = 64;
const TRAJECTORY_RUNTIME_DATA_MAX_DEPTH = 6;
const TRAJECTORY_RUNTIME_FINAL_PROMPT_MAX_BYTES = 4096;
const TRAJECTORY_TOOL_CACHE_MAX_CHARS = 16384;
const TRAJECTORY_TOOL_CACHE_MAX_ENTRIES = 256;
const toolParameterProjections = /* @__PURE__ */ new Map();
const TRAJECTORY_PAYLOAD_PROJECTION = {
	redactCredentials: false,
	omitField: (key) => key === "providerReplay",
	propertyScope: "enumerable",
	projectBinary: (binary) => ({
		redacted: "<redacted>",
		bytes: binary.byteLength,
		sha256: sha256Hex(binary)
	}),
	projectMedia: (key, media) => ({
		[key]: "<redacted>",
		...media.source === void 0 ? {} : {
			bytes: media.bytes,
			sha256: sha256Hex(media.source)
		}
	})
};
const TRAJECTORY_RUNTIME_OVERSIZE_DROP_FIRST_DATA_KEYS = [
	"messagesSnapshot",
	"messages",
	"systemPrompt"
];
const OVERSIZE_PRESERVED_DATA_KEYS = [
	"threadId",
	"turnId",
	"timedOut",
	"yieldDetected",
	"aborted",
	"promptError",
	"stopReason",
	"usage",
	"promptCache",
	"prompt"
];
function truncateOversizedTrajectoryEvent(event, line) {
	const bytes = Buffer.byteLength(line, "utf8");
	if (bytes <= 262144) return line;
	const originalData = event.data ?? {};
	const originalDataKeys = Object.keys(originalData);
	const preservedDataKeys = /* @__PURE__ */ new Set();
	const baseData = {
		truncated: true,
		originalBytes: bytes,
		limitBytes: TRAJECTORY_RUNTIME_EVENT_MAX_BYTES,
		reason: "trajectory-event-size-limit"
	};
	const reducedData = { ...originalData };
	const reducedDroppedFields = [];
	for (const key of TRAJECTORY_RUNTIME_OVERSIZE_DROP_FIRST_DATA_KEYS) {
		if (!Object.hasOwn(reducedData, key)) continue;
		delete reducedData[key];
		reducedDroppedFields.push(key);
		const reduced = safeJsonStringify({
			...event,
			data: {
				...reducedData,
				...baseData,
				droppedFields: reducedDroppedFields
			}
		});
		if (reduced && Buffer.byteLength(reduced, "utf8") <= 262144) return reduced;
	}
	const buildTruncatedEventLine = (includeDroppedFields) => {
		const data = { ...baseData };
		for (const key of OVERSIZE_PRESERVED_DATA_KEYS) if (preservedDataKeys.has(key)) data[key] = originalData[key];
		if (includeDroppedFields) {
			const droppedFields = originalDataKeys.filter((key) => !preservedDataKeys.has(key));
			if (droppedFields.length > 0) data.droppedFields = droppedFields;
		}
		const truncated = safeJsonStringify({
			...event,
			data
		});
		if (truncated && Buffer.byteLength(truncated, "utf8") <= 262144) return truncated;
	};
	let best = buildTruncatedEventLine(true) ?? buildTruncatedEventLine(false);
	if (!best) return;
	for (const key of OVERSIZE_PRESERVED_DATA_KEYS) {
		if (!Object.hasOwn(originalData, key)) continue;
		preservedDataKeys.add(key);
		const next = buildTruncatedEventLine(true) ?? buildTruncatedEventLine(false);
		if (next) {
			best = next;
			continue;
		}
		preservedDataKeys.delete(key);
	}
	return best;
}
function truncatedTrajectoryValue(reason, details = {}) {
	const record = createDiagnosticRecord();
	record.truncated = true;
	record.reason = reason;
	Object.assign(record, details);
	return record;
}
function limitTrajectoryPayloadValue(value, depth = 0, seen = /* @__PURE__ */ new WeakSet()) {
	if (typeof value === "string") {
		if (value.length > TRAJECTORY_RUNTIME_DATA_STRING_MAX_CHARS) return truncatedTrajectoryValue("trajectory-field-size-limit", {
			originalChars: value.length,
			limitChars: TRAJECTORY_RUNTIME_DATA_STRING_MAX_CHARS
		});
		return value;
	}
	if (typeof value !== "object" || value === null) return value;
	if (seen.has(value)) return truncatedTrajectoryValue("trajectory-circular-reference");
	if (depth >= TRAJECTORY_RUNTIME_DATA_MAX_DEPTH) return truncatedTrajectoryValue("trajectory-depth-limit", { limitDepth: TRAJECTORY_RUNTIME_DATA_MAX_DEPTH });
	seen.add(value);
	if (Array.isArray(value)) {
		const limited = value.slice(0, TRAJECTORY_RUNTIME_DATA_ARRAY_MAX_ITEMS).map((item) => limitTrajectoryPayloadValue(item, depth + 1, seen));
		if (value.length > TRAJECTORY_RUNTIME_DATA_ARRAY_MAX_ITEMS) limited.push(truncatedTrajectoryValue("trajectory-array-size-limit", {
			originalLength: value.length,
			limitItems: TRAJECTORY_RUNTIME_DATA_ARRAY_MAX_ITEMS
		}));
		seen.delete(value);
		return limited;
	}
	const record = value;
	const keys = Object.keys(record);
	const limited = createDiagnosticRecord();
	for (const key of keys.slice(0, TRAJECTORY_RUNTIME_DATA_OBJECT_MAX_KEYS)) limited[key] = limitTrajectoryPayloadValue(record[key], depth + 1, seen);
	if (keys.length > TRAJECTORY_RUNTIME_DATA_OBJECT_MAX_KEYS) limited["_truncated"] = truncatedTrajectoryValue("trajectory-object-size-limit", {
		originalKeys: keys.length,
		limitKeys: TRAJECTORY_RUNTIME_DATA_OBJECT_MAX_KEYS
	});
	seen.delete(value);
	return limited;
}
function sanitizeTrajectoryPayload(data) {
	const finalPromptText = data.finalPromptText;
	let boundedData = data;
	if (typeof finalPromptText === "string") {
		boundedData = { ...data };
		if (Buffer.byteLength(finalPromptText, "utf8") > TRAJECTORY_RUNTIME_FINAL_PROMPT_MAX_BYTES) {
			boundedData.finalPromptText = truncateUtf8Prefix(finalPromptText, TRAJECTORY_RUNTIME_FINAL_PROMPT_MAX_BYTES);
			boundedData.finalPromptTextOriginalLength = finalPromptText.length;
		}
	}
	return projectDiagnosticValue(limitTrajectoryPayloadValue(boundedData), TRAJECTORY_PAYLOAD_PROJECTION);
}
function isTrajectoryJsonData(value, depth = 0) {
	if (value === null || typeof value === "string" || typeof value === "boolean") return true;
	if (typeof value === "number") return Number.isFinite(value) && !Object.is(value, -0);
	if (typeof value !== "object" || depth > 7 || isProxy(value)) return false;
	const array = Array.isArray(value);
	if (Object.getPrototypeOf(value) !== (array ? Array.prototype : Object.prototype)) return false;
	const keys = Reflect.ownKeys(value).filter((key) => !array || key !== "length");
	if (array && keys.length !== value.length) return false;
	return keys.every((key, index) => {
		const descriptor = Object.getOwnPropertyDescriptor(value, key);
		return typeof key === "string" && (!array || key === String(index)) && "value" in descriptor && descriptor.enumerable && isTrajectoryJsonData(descriptor.value, depth + 1);
	});
}
function projectTrajectoryToolParameters(parameters) {
	const bounded = limitTrajectoryPayloadValue(parameters);
	if (!isTrajectoryJsonData(bounded)) return projectDiagnosticValue(bounded, TRAJECTORY_PAYLOAD_PROJECTION);
	const content = JSON.stringify(bounded);
	if (content.length > TRAJECTORY_TOOL_CACHE_MAX_CHARS) return projectDiagnosticValue(bounded, TRAJECTORY_PAYLOAD_PROJECTION);
	const key = hash("sha256", content);
	const cached = toolParameterProjections.get(key);
	if (cached !== void 0) return JSON.parse(cached);
	const projected = projectDiagnosticValue(bounded, TRAJECTORY_PAYLOAD_PROJECTION);
	const serialized = JSON.stringify(projected);
	if (serialized.length <= TRAJECTORY_TOOL_CACHE_MAX_CHARS) {
		if (toolParameterProjections.size >= TRAJECTORY_TOOL_CACHE_MAX_ENTRIES) toolParameterProjections.delete(toolParameterProjections.keys().next().value);
		toolParameterProjections.set(key, serialized);
	}
	return projected;
}
function toTrajectoryToolDefinitions(tools) {
	return tools.flatMap((tool) => {
		const name = tool.name?.trim();
		if (!name) return [];
		return [{
			name,
			description: tool.description,
			parameters: projectTrajectoryToolParameters(tool.parameters)
		}];
	}).toSorted((left, right) => left.name.localeCompare(right.name));
}
async function createTrajectoryRuntimeRecorder(input) {
	const params = {
		...input,
		env: { ...input.env ?? process.env },
		sessionTarget: input.sessionTarget && { ...input.sessionTarget }
	};
	const env = params.env;
	if (!(parseBooleanValue(env.OPENCLAW_TRAJECTORY) ?? true)) return null;
	const sink = await createSqliteTrajectoryRuntimeSink({
		env,
		maxRuntimeFileBytes: Math.max(1, Math.floor(params.maxRuntimeFileBytes ?? 10485760)),
		sessionFile: params.sessionFile,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sessionTarget: params.sessionTarget,
		assertCommitAllowed: params.assertCommitAllowed
	});
	params.assertCommitAllowed?.();
	if (!sink) return null;
	let seq = 0;
	return {
		enabled: true,
		recordEvent: (type, data) => {
			const nextSeq = seq + 1;
			const event = {
				traceSchema: "openclaw-trajectory",
				schemaVersion: 1,
				traceId: params.sessionId,
				source: "runtime",
				type,
				ts: (/* @__PURE__ */ new Date()).toISOString(),
				seq: nextSeq,
				sourceSeq: nextSeq,
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				runId: params.runId,
				workspaceDir: params.workspaceDir,
				provider: params.provider,
				modelId: params.modelId,
				modelApi: params.modelApi,
				data: data ? sanitizeTrajectoryPayload(data) : void 0
			};
			const line = safeJsonStringify(event);
			if (!line) return;
			const boundedLine = truncateOversizedTrajectoryEvent(event, line);
			if (!boundedLine) return;
			seq = nextSeq;
			sink.write(event, boundedLine);
		},
		flush: sink.flush,
		describeFlushState: sink.describeFlushState
	};
}
//#endregion
export { toTrajectoryToolDefinitions as n, createTrajectoryRuntimeRecorder as t };
