import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as parseBooleanValue } from "./boolean-BEb0Fdt8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { p as redactSecrets } from "./redact-DJ8j6ADa.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { r as getSecretRedactionRegistryRevision } from "./secret-redaction-registry-DorVHn0l.mjs";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { c as SqliteWorkerError } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { a as getOpenClawAgentDatabaseIfOpen, f as withOpenClawAgentDatabaseAsync } from "./openclaw-agent-db-DBug3LUA.mjs";
import { n as runOpenClawAgentWorkerWrite, r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-CKOCIcah.mjs";
import { n as supportsOpenClawAgentDatabaseExecution, t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { o as resolveSqliteReadScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { a as loadSessionEntry } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import { r as TRAJECTORY_RUNTIME_EVENT_MAX_BYTES } from "./paths-9AeKxTu3.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { t as sanitizeDiagnosticPayload } from "./payload-redaction-N9xicL2K.mjs";
import { t as safeJsonStringify } from "./safe-json-CY5cd4H1.mjs";
import { t as appendSqliteTrajectoryRuntimeEvents } from "./runtime-store.sqlite-Chl9fskF.mjs";
import path from "node:path";
import { hash } from "node:crypto";
import { isMainThread } from "node:worker_threads";
import { isProxy } from "node:util/types";
import { createDiagnosticRecord } from "@openclaw/ai/internal/shared";
//#region src/trajectory/runtime-store-writer.ts
function createSqliteTrajectoryRuntimeSink(params) {
	const target = params.sessionTarget ? {
		agentId: normalizeOptionalString(params.sessionTarget.agentId),
		sessionId: normalizeOptionalString(params.sessionTarget.sessionId),
		sessionKey: normalizeOptionalString(params.sessionTarget.sessionKey),
		storePath: normalizeOptionalString(params.sessionTarget.storePath)
	} : void 0;
	const legacyMarker = parseSqliteSessionFileMarker(params.sessionFile);
	const completeTarget = Boolean(target?.agentId && target.sessionId && target.sessionKey && target.storePath);
	const targetKeyAgentId = parseAgentSessionKey(target?.sessionKey)?.agentId;
	const requestedSessionKey = normalizeOptionalString(params.sessionKey);
	const completeTargetKeyEntry = completeTarget && target?.agentId && target.sessionKey && target.storePath ? loadSessionEntry({
		agentId: target.agentId,
		sessionKey: target.sessionKey,
		storePath: target.storePath
	}) : void 0;
	if (completeTarget && (requestedSessionKey && target?.sessionKey !== requestedSessionKey || targetKeyAgentId && target?.agentId !== targetKeyAgentId || completeTargetKeyEntry && completeTargetKeyEntry.sessionId !== target?.sessionId)) return null;
	const targetKeyEntry = target?.sessionKey && legacyMarker && !completeTarget ? loadSessionEntry({
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
	const databaseOptions = toDatabaseOptions(resolveSqliteReadScope({
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
			await withOpenClawAgentDatabaseAsync(databaseOptions, async (database) => {
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
					if (isMainThread && supportsOpenClawAgentDatabaseExecution(databaseOptions)) await appendSqliteTrajectoryRuntimeEventsInWorker(databaseOptions, database, {
						events,
						discardPrevious: batch.discardPrevious,
						maxRuntimeBytes: params.maxRuntimeFileBytes,
						sessionId: marker.sessionId
					}, params.assertCommitAllowed, (outcome) => {
						if (outcome === "committed") inFlight = void 0;
						else unsettledAppend = new SqliteWorkerError("Trajectory append outcome is unknown; pending events cannot be replayed", "outcome-unknown");
					});
					else {
						appendSqliteTrajectoryRuntimeEvents({
							agentId: marker.agentId,
							discardPrevious: batch.discardPrevious,
							env: databaseOptions.env,
							maxRuntimeBytes: params.maxRuntimeFileBytes,
							sessionId: marker.sessionId,
							storePath: database.path,
							assertCommitAllowed: params.assertCommitAllowed
						}, events);
						inFlight = void 0;
					}
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
			});
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
			pendingEvents.set(event, bytes);
			queuedBytes += bytes;
			trimPending();
			scheduleFlush();
		}
	};
}
async function appendSqliteTrajectoryRuntimeEventsInWorker(options, database, input, assertCommitAllowed, settle) {
	const identity = readOpenClawAgentDatabaseIdentity(database);
	if (typeof identity.identity !== "string") throw new Error("Trajectory worker requires a durable database owner");
	const execution = captureOpenClawAgentDatabaseExecution(options, { expectedIdentity: {
		kind: "file",
		physicalIdentity: identity.identity,
		nativeLocation: identity.filename
	} });
	const assertCurrent = () => {
		execution.assertCurrent();
		if (!database.db.isOpen || getOpenClawAgentDatabaseIfOpen(options)?.db !== database.db) throw new Error("Trajectory append lost its borrowed database owner");
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
let toolParameterSecretRevision = 0;
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
	const redactedFinalPromptText = typeof finalPromptText === "string" ? redactSecrets(finalPromptText) : void 0;
	const boundedData = typeof finalPromptText === "string" && typeof redactedFinalPromptText === "string" && (Buffer.byteLength(finalPromptText, "utf8") > TRAJECTORY_RUNTIME_FINAL_PROMPT_MAX_BYTES || Buffer.byteLength(redactedFinalPromptText, "utf8") > TRAJECTORY_RUNTIME_FINAL_PROMPT_MAX_BYTES) ? {
		...data,
		finalPromptText: truncateUtf8Prefix(redactedFinalPromptText, TRAJECTORY_RUNTIME_FINAL_PROMPT_MAX_BYTES),
		finalPromptTextOriginalLength: finalPromptText.length
	} : typeof redactedFinalPromptText === "string" ? {
		...data,
		finalPromptText: redactedFinalPromptText
	} : data;
	return redactSecrets(sanitizeDiagnosticPayload(limitTrajectoryPayloadValue(boundedData)));
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
	if (!isTrajectoryJsonData(bounded)) return sanitizeDiagnosticPayload(bounded);
	const revision = getSecretRedactionRegistryRevision();
	if (revision !== toolParameterSecretRevision) {
		toolParameterProjections.clear();
		toolParameterSecretRevision = revision;
	}
	const content = JSON.stringify(bounded);
	if (content.length > TRAJECTORY_TOOL_CACHE_MAX_CHARS) return sanitizeDiagnosticPayload(bounded);
	const key = hash("sha256", content);
	const cached = toolParameterProjections.get(key);
	if (cached !== void 0) return JSON.parse(cached);
	const projected = sanitizeDiagnosticPayload(bounded);
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
function createTrajectoryRuntimeRecorder(params) {
	const env = params.env ?? process.env;
	if (!(parseBooleanValue(env.OPENCLAW_TRAJECTORY) ?? true)) return null;
	const sink = createSqliteTrajectoryRuntimeSink({
		env,
		maxRuntimeFileBytes: Math.max(1, Math.floor(params.maxRuntimeFileBytes ?? 10485760)),
		sessionFile: params.sessionFile,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sessionTarget: params.sessionTarget,
		assertCommitAllowed: params.assertCommitAllowed
	});
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
			const boundedEvent = JSON.parse(boundedLine);
			seq = nextSeq;
			sink.write(boundedEvent, boundedLine);
		},
		flush: async () => {
			await sink.flush();
		},
		describeFlushState: () => sink.describeFlushState()
	};
}
//#endregion
export { toTrajectoryToolDefinitions as n, createTrajectoryRuntimeRecorder as t };
