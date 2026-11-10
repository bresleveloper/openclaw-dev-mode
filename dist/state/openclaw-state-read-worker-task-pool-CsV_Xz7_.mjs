import { p as toErrorObject, s as resolveGlobalSingleton } from "./openclaw-state-read-listeners-C6ALBiqg.mjs";
import { U as captureSqliteWorkerEnvironmentData, a as trackNativeWorkerForCpu, c as workerMessagePayloadBytes, d as resolveRuntimeProcessEntrypointUrl, i as receiveWorkerMemoryPort, l as runWithMainThreadTask, n as createCpuTrackedWorker, o as observeWorkerMessage, q as parseDiagnosticEnvFlags, r as markWorkerRetirement, s as recordWorkerMessage, t as attributeWorkerToPool, u as captureRuntimeWorkerSource } from "./openclaw-state-read-worker-cpu-DxXDPrAN.mjs";
import { M as trackSqliteDatabaseAdmissionWorker } from "./openclaw-state-read-sqlite-database-admission-BXby_hL9.mjs";
import { a as isRecord } from "./openclaw-state-read-record-coerce-DWp7lFsP.mjs";
import { l as emitTrustedDiagnosticEvent, p as hasInternalDiagnosticEventInterest } from "./openclaw-state-read-subsystem-S9LTuPwa.mjs";
import { E as normalizeLowercaseStringOrEmpty, k as normalizeOptionalString, w as resolveTimerTimeoutMs } from "./openclaw-state-read-types.secrets-Wz8lmfvB.mjs";
import { t as isPromiseLike } from "./openclaw-state-read-promise-like-D7-l5Fsp.mjs";
import { t as runInDetachedAsyncContext } from "./openclaw-state-read-detached-async-context-BrFwufJ7.mjs";
import { t as createDeferredCore } from "./openclaw-state-read-deferred-D0La5CRk.mjs";
import { n as createSqliteDatabaseAdmissionRelay } from "./openclaw-state-read-sqlite-worker-operation-admission-we1rdJYO.mjs";
import { a as runtimeProcessEntrypoints } from "./openclaw-state-read-runtime-binary-LcE5xcaN.mjs";
import { n as resolveRuntimeWorkerThreadExecArgv } from "./openclaw-state-read-runtime-worker-url-slDwpD7p.mjs";
import { d as decodeNativeWorkerFailure, l as createSpawnBrokerHost, u as BrokerNativeResourceCloseError } from "./openclaw-state-read-errors-D64c1s5e.mjs";
import { n as createLazyPromiseLoader } from "./openclaw-state-read-lazy-promise-DLFIcwoO.mjs";
import path, { basename } from "node:path";
import { MessageChannel, SHARE_ENV, receiveMessageOnPort } from "node:worker_threads";
import { AsyncLocalStorage, AsyncResource } from "node:async_hooks";
import { availableParallelism } from "node:os";
import { setImmediate as setImmediate$1 } from "node:timers/promises";
import { channel } from "node:diagnostics_channel";
import { performance as performance$1 } from "node:perf_hooks";
import { EventEmitter } from "node:events";
//#region packages/normalization-core/src/string-normalization.ts
/** Coerces entries to strings, trims them, and drops empty results. */
function normalizeStringEntries(list) {
	return (list ?? []).map((entry) => String(entry).trim()).filter(Boolean);
}
/** Normalizes string entries and lowercases each retained value. */
function normalizeStringEntriesLower(list) {
	return normalizeStringEntries(list).map((entry) => entry.toLowerCase());
}
/** Returns first-seen unique values while preserving insertion order. */
function uniqueValues(values) {
	return [...new Set(values)];
}
/** Returns first-seen unique strings while preserving insertion order. */
function uniqueStrings(values) {
	return uniqueValues(values);
}
/** Returns a fresh array of unique strings in UTF-16 code-unit order. */
function sortUniqueStrings(values) {
	return uniqueStrings(values).sort();
}
/** Lowercases normalized entries, removes empties/duplicates, and preserves first-seen order. */
function normalizeUniqueStringEntriesLower(values) {
	return uniqueStrings(normalizeStringEntriesLower(values ? [...values] : void 0));
}
/** Normalizes array-backed string lists and rejects non-array input as empty. */
function normalizeTrimmedStringList(value) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((entry) => {
		const normalized = normalizeOptionalString(entry);
		return normalized ? [normalized] : [];
	});
}
/** Normalizes an array-backed string list and removes duplicates. */
function normalizeUniqueTrimmedStringList(value) {
	return uniqueStrings(normalizeTrimmedStringList(value));
}
/** Normalizes an array-backed string list, removes duplicates, and sorts it. */
function normalizeSortedUniqueTrimmedStringList(value) {
	return sortUniqueStrings(normalizeTrimmedStringList(value));
}
/** Normalizes either a single string-like value or an array-backed string list. */
function normalizeSingleOrTrimmedStringList(value) {
	if (Array.isArray(value)) return normalizeTrimmedStringList(value);
	const normalized = normalizeOptionalString(value);
	return normalized ? [normalized] : [];
}
/** Normalizes single-or-array string input and removes duplicates. */
function normalizeUniqueSingleOrTrimmedStringList(value) {
	return uniqueStrings(normalizeSingleOrTrimmedStringList(value));
}
//#endregion
//#region packages/worker-runtime/src/worker-task-native-sections.ts
const CANCELLED = 1;
const SECTION = 2;
const nativeSectionKey = Symbol.for("openclaw.workerTaskNativeSection");
const nativeSectionStore = globalThis;
const currentNativeSection = nativeSectionStore[nativeSectionKey] ??= new AsyncLocalStorage();
function assertWorkerTaskActive(observed, isActive) {
	if (!isActive() || (observed & CANCELLED) !== 0) throw new Error("worker task cancelled");
}
function acquireWorkerNativeSection(state, isActive) {
	for (;;) {
		const observed = Atomics.load(state, 0);
		assertWorkerTaskActive(observed, isActive);
		if (Atomics.compareExchange(state, 0, observed, observed + SECTION) === observed) break;
	}
	let released = false;
	return () => {
		if (released) return;
		released = true;
		Atomics.sub(state, 0, SECTION);
		Atomics.notify(state, 0);
	};
}
/** Make this task's native custody available without retaining ordinary task work. */
function withWorkerTaskNativeSectionScope(state, isActive, run) {
	return currentNativeSection.run(() => acquireWorkerNativeSection(state, isActive), run);
}
function createWorkerNativeSectionState() {
	return new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
}
function cancelWorkerNativeSections(state) {
	Atomics.or(state, 0, CANCELLED);
	Atomics.notify(state, 0);
}
function observeWorkerTaskCancellation(state, isActive, onCancelled) {
	let observing = true;
	const settled = (async () => {
		for (;;) {
			if (!observing || !isActive()) return;
			const observed = Atomics.load(state, 0);
			if ((observed & CANCELLED) !== 0) {
				onCancelled();
				return;
			}
			await Atomics.waitAsync(state, 0, observed).value;
		}
	})();
	return () => {
		observing = false;
		Atomics.notify(state, 0);
		return settled;
	};
}
function waitForWorkerNativeSections(state) {
	if (areWorkerNativeSectionsSettled(state)) return;
	return (async () => {
		for (;;) {
			const observed = Atomics.load(state, 0);
			if (observed < SECTION) return;
			await Atomics.waitAsync(state, 0, observed).value;
		}
	})();
}
/** Cancellation must close admission before this fact permits native termination. */
function areWorkerNativeSectionsSettled(state) {
	return Atomics.load(state, 0) < SECTION;
}
function releaseWorkerNativeSectionsOnExit(state) {
	Atomics.store(state, 0, CANCELLED);
	Atomics.notify(state, 0);
}
function createWorkerTaskControl(state, isActive) {
	const throwIfCancelled = () => assertWorkerTaskActive(Atomics.load(state, 0), isActive);
	return {
		throwIfCancelled,
		runNativeSection: async (operation) => {
			const release = acquireWorkerNativeSection(state, isActive);
			let result;
			try {
				result = await operation();
			} finally {
				release();
			}
			throwIfCancelled();
			return result;
		}
	};
}
//#endregion
//#region src/infra/agent-database-readers.ts
const readers = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseReaders"), () => ({
	closers: /* @__PURE__ */ new Set(),
	deleted: /* @__PURE__ */ new Map()
}));
/** Match captured read custody without inspecting files or inferring their owners. */
function matchesAgentDatabaseReadCandidatePath(candidate, pathname) {
	const capturedPath = path.resolve(candidate.path);
	const resolvedPath = path.resolve(pathname);
	if (capturedPath === resolvedPath) return true;
	if (candidate.scope !== "sibling-family") return false;
	const captured = path.parse(capturedPath);
	const selected = path.parse(resolvedPath);
	return selected.dir === captured.dir && selected.base.startsWith(`${captured.name}.`) && selected.base.endsWith(captured.ext);
}
/** Every cache that retains agent database connections registers once per isolate. */
function registerAgentDatabaseReaderCloser(closer) {
	readers.closers.add(closer);
	return () => {
		readers.closers.delete(closer);
	};
}
/** A deleted agent's database stays closed in this isolate until the roster admits the agent again. */
function isDeletedAgentDatabasePath(pathname) {
	return readers.deleted.has(path.resolve(pathname));
}
/** Task admission carries the parent owner's current fences into every worker generation. */
function captureDeletedAgentDatabaseFences() {
	return [...readers.deleted];
}
function installDeletedAgentDatabaseFences(fences) {
	readers.deleted.clear();
	for (const [pathname, agentId] of fences) readers.deleted.set(pathname, agentId);
}
async function applyAgentDatabaseReaderRequest(request) {
	if (request.kind === "revive") {
		for (const [deleted, agentId] of readers.deleted) if (request.agentIds.includes(agentId)) readers.deleted.delete(deleted);
		return;
	}
	if (request.deleted) for (const candidate of request.candidates) readers.deleted.set(path.resolve(candidate.path), request.agentId);
	const retainedPaths = request.deleted ? void 0 : new Set(request.retainedPaths?.map((entry) => path.resolve(entry)));
	const errors = (await Promise.allSettled([...readers.closers].map(async (closer) => closer(request.candidates, retainedPaths)))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (errors.length === 1) throw errors[0];
	if (errors.length > 1) throw new AggregateError(errors, "Agent database reader cleanup failed");
}
function normalizeCandidates(candidates) {
	if (!Array.isArray(candidates) || !candidates.every((candidate) => isRecord(candidate) && typeof candidate.path === "string" && (candidate.scope === void 0 || candidate.scope === "sibling-family"))) return;
	return candidates.map((candidate) => candidate.scope ? {
		path: candidate.path,
		scope: candidate.scope
	} : { path: candidate.path });
}
/** Worker resource keys that name agent databases; other keys belong to their worker's own closer. */
function decodeAgentDatabaseReaderRequest(key) {
	if (key === void 0) return;
	let parsed;
	try {
		parsed = JSON.parse(key);
	} catch {
		return;
	}
	if (Array.isArray(parsed)) {
		const candidates = normalizeCandidates(parsed);
		return candidates ? {
			kind: "close",
			candidates,
			deleted: false
		} : void 0;
	}
	if (!isRecord(parsed)) return;
	if ("candidates" in parsed && !("deleted" in parsed)) {
		const candidates = normalizeCandidates(parsed.candidates);
		const retainedPaths = parsed.retainedPaths;
		return candidates && Array.isArray(retainedPaths) && retainedPaths.every((entry) => typeof entry === "string") ? {
			kind: "close",
			candidates,
			retainedPaths,
			deleted: false
		} : void 0;
	}
	if ("deleted" in parsed) {
		const candidates = normalizeCandidates(parsed.deleted);
		return candidates && typeof parsed.agentId === "string" && parsed.agentId.length > 0 ? {
			kind: "close",
			candidates,
			deleted: true,
			agentId: parsed.agentId
		} : void 0;
	}
	if ("revive" in parsed && Array.isArray(parsed.revive) && parsed.revive.every((agentId) => typeof agentId === "string")) return {
		kind: "revive",
		agentIds: parsed.revive
	};
}
//#endregion
//#region packages/worker-runtime/src/retained-operation.ts
/** One producer settlement serves awaited callers and its named synchronous consumer. */
function createRetainedOperation(service, options = {}) {
	const completion = Promise.withResolvers();
	let outcome = Object.freeze({ status: "pending" });
	if (options.observeRejection !== false) completion.promise.catch(() => void 0);
	return {
		operation: {
			result: completion.promise,
			read: () => outcome,
			service
		},
		resolve(value) {
			if (outcome.status !== "pending") return;
			outcome = Object.freeze({
				status: "fulfilled",
				value
			});
			completion.resolve(value);
		},
		reject(error) {
			if (outcome.status !== "pending") return;
			outcome = Object.freeze({
				status: "rejected",
				error
			});
			completion.reject(error);
		}
	};
}
function driveRetainedOperation(source, advance, onError) {
	const inContext = AsyncLocalStorage.snapshot();
	let servicing = false;
	const serviceInContext = () => inContext(service);
	const completion = createRetainedOperation(serviceInContext);
	function service() {
		if (servicing || completion.operation.read().status !== "pending") return;
		servicing = true;
		try {
			advance(completion, serviceInContext);
		} catch (error) {
			try {
				completion.reject(onError ? onError(error) : error);
			} catch (combined) {
				completion.reject(combined);
			}
		} finally {
			servicing = false;
		}
	}
	source.result.then(serviceInContext, serviceInContext);
	completion.operation.service();
	return completion.operation;
}
/** Transform settled facts without making Promise reactions part of their progress. */
function mapRetainedOperation(source, receive) {
	return driveRetainedOperation(source, (completion) => {
		source.service();
		const outcome = source.read();
		if (outcome.status === "fulfilled") completion.resolve(receive(outcome.value));
		else if (outcome.status === "rejected") completion.reject(outcome.error);
	});
}
/** Sequence operations while retaining the continuation's captured caller context. */
function flatMapRetainedOperation(source, next) {
	let child;
	return driveRetainedOperation(source, (completion, service) => {
		if (!child) {
			source.service();
			const outcome = source.read();
			if (outcome.status === "pending") return;
			if (outcome.status === "rejected") throw outcome.error;
			child = next(outcome.value);
			child.result.then(service, service);
		}
		child.service();
		const outcome = child.read();
		if (outcome.status === "fulfilled") completion.resolve(outcome.value);
		else if (outcome.status === "rejected") completion.reject(outcome.error);
	});
}
/** Join the owner's real cleanup; that owner chooses how simultaneous failures combine. */
function finallyRetainedOperation(source, cleanup, combineErrors = (_source, cleanupError) => cleanupError) {
	let original;
	let child;
	return driveRetainedOperation(source, (completion, service) => {
		if (!original) {
			try {
				source.service();
				const outcome = source.read();
				if (outcome.status === "pending") return;
				original = outcome;
			} catch (error) {
				original = {
					status: "rejected",
					error
				};
			}
			child = cleanup(original);
			child.result.then(service, service);
		}
		if (!child) return;
		child.service();
		const outcome = child.read();
		if (outcome.status === "pending") return;
		if (outcome.status === "rejected") throw outcome.error;
		if (original.status === "rejected") completion.reject(original.error);
		else completion.resolve(original.value);
	}, (error) => original?.status === "rejected" ? combineErrors(original.error, error) : error);
}
//#endregion
//#region src/infra/diagnostic-flags.ts
const DIAGNOSTICS_ENV = "OPENCLAW_DIAGNOSTICS";
/** Resolves enabled diagnostic flags from config plus `OPENCLAW_DIAGNOSTICS` overrides. */
function resolveDiagnosticFlags(cfg, env = process.env) {
	const configFlags = Array.isArray(cfg?.diagnostics?.flags) ? cfg?.diagnostics?.flags : [];
	const envFlags = parseDiagnosticEnvFlags(env[DIAGNOSTICS_ENV]);
	if (envFlags.disablesAll) return [];
	return normalizeUniqueStringEntriesLower([...configFlags, ...envFlags.flags]);
}
/** Returns whether a diagnostic flag is enabled after config/env resolution. */
function isDiagnosticFlagEnabled(flag, cfg, env = process.env) {
	const enabledFlags = resolveDiagnosticFlags(cfg, env);
	const target = normalizeLowercaseStringOrEmpty(flag);
	if (!target) return false;
	for (const enabled of enabledFlags) {
		if (enabled === "*" || enabled === "all" || enabled === target) return true;
		if (enabled.endsWith(".*") && target === enabled.slice(0, -2)) return true;
		if (enabled.endsWith("*") && target.startsWith(enabled.slice(0, -1))) return true;
	}
	return false;
}
//#endregion
//#region src/infra/sqlite-worker-request-class.ts
const operations = [
	"admit",
	"audit.events.list",
	"audit.writer.process",
	"audit.writer.prune",
	"database.domain.bind",
	"database.domain.close",
	"database.domain.publish",
	"database.inspectIdle",
	"database.prepareWrite",
	"database.walMaintenance",
	"stateLease.acquire",
	"stateLease.release",
	"stateLease.renew",
	"stateLease.verify"
];
const families = [
	"acp",
	"acpSessions",
	"agentDatabaseDeletion",
	"agentDatabaseRegistry",
	"agentDatabases",
	"agentDeletionJournal",
	"agentProvenance",
	"apns",
	"audit",
	"authProfiles",
	"backup",
	"bootstrap",
	"capture",
	"channelIngress",
	"clawProvenance",
	"claws",
	"config",
	"conversation",
	"conversationBindings",
	"database",
	"deliveryQueue",
	"deviceAuth",
	"deviceIdentity",
	"devicePairing",
	"diagnostic",
	"doctor",
	"exec-approvals",
	"execApprovals",
	"generatedHtmlProvenance",
	"githubPublication",
	"githubRepository",
	"legacyMcpOAuth",
	"localWorkspace",
	"managedImages",
	"mcpOAuth",
	"mentions",
	"modelCatalog",
	"nativeHookRelay",
	"node",
	"nodeHost",
	"nodeWorker",
	"onboardingRecommendations",
	"operator",
	"operatorApprovals",
	"pairing",
	"placementJournals",
	"placementTools",
	"placementTranscript",
	"placementTurns",
	"pluginBlob",
	"pluginModelCatalogCredentials",
	"plugins",
	"preparedPoolPresence",
	"projects",
	"promotions",
	"repositoryWorkspaces",
	"restartSentinel",
	"sandboxRegistry",
	"secrets",
	"sessionDelivery",
	"sessionGroups",
	"sessionRepositoryWorkspaces",
	"sessionState",
	"sessionUpstream",
	"skillLibrary",
	"skillUploads",
	"skills",
	"stateLease",
	"subagents",
	"telemetry",
	"tts",
	"tui",
	"updateRuns",
	"usageCache",
	"userModelAccounts",
	"userPreferences",
	"userProfiles",
	"webPush",
	"workerEnvironments",
	"workerInference",
	"workerPlacements",
	"workers",
	"workspace",
	"workshop",
	"worktrees"
];
const sqliteWorkerRequestClasses = /* @__PURE__ */ new Set([...operations, ...families]);
function classifySqliteWorkerExecute(commandType) {
	if (sqliteWorkerRequestClasses.has(commandType)) return commandType;
	const separator = commandType.indexOf(".");
	const family = separator === -1 ? commandType : commandType.slice(0, separator);
	return sqliteWorkerRequestClasses.has(family) ? family : "execute";
}
//#endregion
//#region src/infra/worker-request-diagnostics.ts
const reservations = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerReservationObservation"), () => new AsyncLocalStorage());
function withSqliteWorkerReservationObservation(observation, run) {
	return reservations.run(observation, run);
}
const detailedTiming = isDiagnosticFlagEnabled("sqlite.worker-timing");
const coreCommands = /* @__PURE__ */ new Set([
	"session.actor.read",
	"session.actor.acceptInput",
	"session.actor.adoptRun",
	"session.actor.appendToolResult",
	"session.actor.appendTranscriptEvent",
	"session.actor.completeTurn",
	"session.actor.deliveryPending",
	"session.actor.deliverySettled",
	"session.actor.patch",
	"session.entry.read",
	"session.entry.patch.prepare",
	"session.entry.patch.commit",
	"session.entry.replacements.prepare",
	"session.entry.replacements.commit",
	"session.lifecycle.project",
	"session.maintenance.metadata",
	"session.maintenance.prepare",
	"session.maintenance.release",
	"session.maintenance.finalize",
	"session.maintenance.size",
	"session.rowTranscript.backfill",
	"usageCache.writeRollup",
	"usageCache.prune",
	"trajectory.events.append",
	"trajectory.retention.begin",
	"trajectory.retention.delete",
	"session.pendingInputs.read",
	"session.pendingInputs.mutate",
	"session.turn.prepare",
	"session.turn.commit",
	"transcript.prepare",
	"transcript.commit"
]);
const projectionCommands = /* @__PURE__ */ new Map([
	["preflight", "transcript-projection.preflight"],
	["sweep", "transcript-projection.sweep"],
	["claim", "transcript-projection.claim"],
	["deleteChunk", "transcript-projection.deleteChunk"],
	["appendChunk", "transcript-projection.appendChunk"],
	["finalize", "transcript-projection.finalize"]
]);
const projectionModuleSuffixes = ["/config/sessions/session-transcript-projection-publication.worker.js", "/config/sessions/session-transcript-projection-publication.worker.ts"];
const requestPrefixes = [
	["pluginState.", "plugin_state"],
	["session.history.", "transcript_read"],
	["trajectory.", "transcripts"],
	["session.transcript.", "transcripts"],
	["transcripts.", "transcripts"],
	["session.", "sessions"],
	["cron.", "cron"]
];
function classifyWorkerRequest(commandType, commandInput) {
	if (typeof commandType !== "string") return "execute";
	if (coreCommands.has(commandType)) return commandType;
	if (commandType === "auth-profile-rows") return "auth_profiles";
	if (commandType === "database.domain.execute" || commandType === "database.domain.publish") {
		const publication = isRecord(commandInput) ? commandInput : void 0;
		const inner = publication && isRecord(publication.command) ? publication.command : void 0;
		const moduleUrl = publication?.moduleUrl;
		if (commandType === "database.domain.publish" && typeof moduleUrl === "string" && typeof inner?.type === "string" && projectionModuleSuffixes.some((suffix) => moduleUrl.endsWith(suffix))) {
			const projection = projectionCommands.get(inner.type);
			if (projection) return projection;
		}
		const label = inner ? classifyWorkerRequest(inner.type) : "execute";
		return label === "execute" ? "domain_execute" : label;
	}
	for (const [prefix, requestClass] of requestPrefixes) if (commandType.startsWith(prefix)) return requestClass;
	return classifySqliteWorkerExecute(commandType);
}
const queued = resolveGlobalSingleton(Symbol.for("openclaw.workerRequestQueueDepth"), () => /* @__PURE__ */ new Map());
const requestClasses = /* @__PURE__ */ new Set([
	...coreCommands,
	...projectionCommands.values(),
	...sqliteWorkerRequestClasses,
	...requestPrefixes.map(([, requestClass]) => requestClass),
	"task",
	"open",
	"close",
	"execute",
	"domain_execute",
	"auth_profiles"
]);
/** One observation follows a request across admission retries and cancellation. */
function trackWorkerRequest(kind, requestClass, queuedSignal) {
	const label = requestClasses.has(requestClass) ? requestClass : "other";
	const reservation = kind === "sqlite_writer" ? reservations.getStore() : void 0;
	const enqueuedAt = performance.now();
	const timing = kind === "sqlite_writer" && (detailedTiming || hasInternalDiagnosticEventInterest("worker.request")) ? { enqueued: enqueuedAt } : void 0;
	let startedAt;
	let completed = false;
	const emit = (phase, durations = {}) => {
		if (!hasInternalDiagnosticEventInterest("worker.request")) return;
		emitTrustedDiagnosticEvent({
			type: "worker.request",
			kind,
			requestClass: label,
			phase,
			queueDepth: queued.get(kind) ?? 0,
			...durations,
			...phase === "completed" && timing ? { timing } : {}
		});
	};
	const dequeue = () => queued.set(kind, (queued.get(kind) ?? 0) - 1);
	queued.set(kind, (queued.get(kind) ?? 0) + 1);
	emit("queued");
	const observation = {
		timing,
		...reservation ? { recordTransactions: (count) => {
			reservation.transactionCount = (reservation.transactionCount ?? 0) + count;
		} } : {},
		started: () => {
			if (completed || startedAt !== void 0) return;
			startedAt = performance.now();
			if (reservation) reservation.operations.add(reservation.operations.has(label) || reservation.operations.size < 8 ? label : "other");
			if (timing) timing.dispatched = startedAt;
			queuedSignal?.removeEventListener("abort", observation.completed);
			dequeue();
			emit("started", { queueWaitMs: startedAt - enqueuedAt });
		},
		completed: () => {
			if (completed) return;
			completed = true;
			queuedSignal?.removeEventListener("abort", observation.completed);
			if (startedAt === void 0) dequeue();
			emit("completed", startedAt === void 0 ? {} : { durationMs: performance.now() - startedAt });
		}
	};
	queuedSignal?.addEventListener("abort", observation.completed, { once: true });
	if (queuedSignal?.aborted) observation.completed();
	return observation;
}
//#endregion
//#region src/infra/worker-native-resource.ts
/** Binds the host's original cleanup port to the same surviving spawn-owner claim. */
function bindNativeWorkerResource(options) {
	const { broker, descriptor, connection } = options;
	let disposed = false;
	const lease = broker.captureNativeResource({
		moduleUrl: descriptor.moduleUrl,
		input: descriptor.input,
		ownerPort: Boolean(connection)
	}, {
		message(response) {
			if (response.type === "resource-owner") connection?.port.postMessage(response.value, []);
			else if (response.type === "resource-closed") options.closed();
		},
		failed: (error) => options.failed(error)
	});
	const forward = (value) => {
		if (disposed) return;
		try {
			const delivery = lease.ownerMessage(value);
			if (options.supervisorAvailable()) options.postOwnerMessage(value, delivery.sequence);
		} catch (error) {
			options.failed(toErrorObject(error, "Native resource owner delivery failed"));
		}
	};
	connection?.port.on("message", forward);
	const dispose = () => {
		if (disposed) return;
		disposed = true;
		connection?.port.off("message", forward);
		connection?.port.close();
		connection?.dispose();
	};
	return {
		attachment: lease.attachment,
		receive(response) {
			lease.receive(response);
		},
		service() {
			if (disposed || !connection) return;
			connection.service();
			for (;;) {
				const next = receiveMessageOnPort(connection.port);
				if (!next) break;
				forward(next.message);
			}
		},
		async closeAfterSupervisor() {
			try {
				await broker.sealNativeResources();
				await lease.close();
			} catch (error) {
				if (error instanceof BrokerNativeResourceCloseError && connection?.decodeCloseError) throw connection.decodeCloseError(error.payload);
				throw error;
			}
		},
		release() {
			lease.release();
			dispose();
		},
		abandonUnattached() {
			lease.abandonUnattached();
			dispose();
		}
	};
}
//#endregion
//#region src/infra/worker-native-port.ts
const livePort = /* @__PURE__ */ new Error("Native worker port validation reached the live sentinel");
livePort.stack = void 0;
const portValidation = { get value() {
	throw livePort;
} };
function nativePortIsOpen(port) {
	if (process.versions.bun) {
		const referenced = port.hasRef();
		port.unref();
		port.ref();
		const open = port.hasRef();
		if (!referenced) port.unref();
		return open;
	}
	try {
		structuredClone(portValidation, { transfer: [port] });
	} catch (error) {
		if (error === livePort) return true;
		if (error instanceof DOMException && error.name === "DataCloneError") return false;
		throw error;
	}
	throw new Error("Native port validation did not abort serialization");
}
//#endregion
//#region src/infra/worker-native-task-port.ts
/** The task endpoint owns delivery only; its close never proves native execution stopped. */
var NativeWorkerTaskPort = class {
	constructor(port, callbacks) {
		this.port = port;
		this.callbacks = callbacks;
		this.pending = [];
		this.started = false;
		this.disposed = false;
		this.portClosed = false;
		this.receive = (value) => {
			observeWorkerMessage(value, "from_worker");
			this.pending.push({
				type: "message",
				value
			});
			this.drain();
		};
		this.receiveError = (error) => {
			this.pending.push({
				type: "messageerror",
				error
			});
			this.drain();
		};
		this.closed = () => {
			this.portClosed = true;
			this.drain();
			this.fail(/* @__PURE__ */ new Error("Native worker task channel closed"));
		};
		port.on("message", this.receive);
		port.on("messageerror", this.receiveError);
		port.on("close", this.closed);
		port.unref();
	}
	fail(error) {
		if (this.disposed || this.failure) return;
		this.failure = error;
		this.callbacks.unavailable();
	}
	start() {
		this.started = true;
	}
	/** Startup admission gates data even when the control owner has already failed. */
	drain() {
		if (this.disposed || !this.started) return;
		for (;;) {
			const buffered = this.pending.shift();
			if (buffered) {
				if (buffered.type === "message") this.callbacks.message(buffered.value);
				else this.callbacks.messageerror(buffered.error);
			} else {
				if (this.portClosed || this.failure) return;
				let next;
				try {
					next = runWithMainThreadTask("worker:message-decode", () => receiveMessageOnPort(this.port));
				} catch (error) {
					this.fail(toErrorObject(error, "Native worker task channel observation failed"));
					return;
				}
				if (!next) return;
				observeWorkerMessage(next.message, "from_worker");
				this.callbacks.message(next.message);
			}
			if (this.disposed) return;
		}
	}
	service() {
		this.drain();
		if (this.disposed || this.failure) return;
		if (this.portClosed) {
			this.fail(/* @__PURE__ */ new Error("Native worker task channel closed"));
			return;
		}
		let open;
		try {
			open = nativePortIsOpen(this.port);
		} catch (error) {
			this.fail(toErrorObject(error, "Native worker task channel observation failed"));
			return;
		}
		if (!open) {
			this.portClosed = true;
			this.fail(/* @__PURE__ */ new Error("Native worker task channel closed"));
		}
	}
	assertAvailable() {
		if (this.failure) throw this.failure;
		if (this.disposed || this.portClosed) throw new Error("Native worker task channel is closed");
	}
	postMessage(value, transferList) {
		this.assertAvailable();
		const bytes = workerMessagePayloadBytes(value);
		this.port.postMessage(value, [...transferList]);
		observeWorkerMessage(value, "to_worker", "other", bytes ?? null);
	}
	close() {
		if (this.disposed) return;
		this.disposed = true;
		this.pending.length = 0;
		this.port.off("message", this.receive);
		this.port.off("messageerror", this.receiveError);
		this.port.off("close", this.closed);
		this.port.close();
	}
};
//#endregion
//#region src/infra/worker-request-kind.ts
const standaloneKinds = {
	"catalog-page.worker.js": "catalog",
	"code-mode.worker.js": "codeMode",
	"disk-budget.worker.js": "diskBudget",
	"document-extractor.worker.js": "document",
	"manager-index.worker.js": "memoryIndex",
	"manager-search.worker.js": "memorySearch",
	"memory-index.worker.js": "memoryIndex",
	"memory-search.worker.js": "memorySearch",
	"run.worker.js": "teamReports",
	"session-history.worker.js": "sessionHistory"
};
const kinds = new Map([...Object.entries(runtimeProcessEntrypoints).map(([kind, entry]) => [basename(entry.distWorkerPath), kind]), ...Object.entries(standaloneKinds)]);
/** SDK callers may supply their own workers; never publish arbitrary paths as labels. */
function workerRequestKind(url) {
	return kinds.get(basename(url.pathname).replace(/\.(?:ts|mjs)$/, ".js")) ?? "extension";
}
//#endregion
//#region src/infra/worker-native-handle.ts
var NativeWorker = class extends EventEmitter {
	constructor(runtime, id, filename, evalSource, ownsNativeResource, resourceConnection, taskPort) {
		super();
		this.runtime = runtime;
		this.id = id;
		this.filename = filename;
		this.evalSource = evalSource;
		this.ownsNativeResource = ownsNativeResource;
		this.resourceConnection = resourceConnection;
		this.runInContext = AsyncLocalStorage.snapshot();
		this.threadId = 0;
		this.started = false;
		this.executionStopped = false;
		this.referenced = true;
		this.stopping = false;
		this.joined = false;
		this.servicingResource = false;
		this.resourceClosed = false;
		this.supervisorJoined = false;
		this.terminalObserved = false;
		this.taskPortLossReported = false;
		this.requestId = 0;
		this.stopCompletion = createRetainedOperation(() => this.service());
		this.cpuRequests = /* @__PURE__ */ new Map();
		this.heapRequests = /* @__PURE__ */ new Map();
		this.diagnosticName = `worker:${!evalSource && filename instanceof URL ? workerRequestKind(filename) : "other"}`;
		if (taskPort) this.taskPort = new NativeWorkerTaskPort(taskPort, {
			message: (value) => this.runInContext(() => runWithMainThreadTask(this.diagnosticName, () => this.emit("message", value))),
			messageerror: (error) => this.runInContext(() => this.emit("messageerror", error)),
			unavailable: () => this.observeTaskPortLoss()
		});
	}
	get needsReference() {
		return this.referenced || this.stopping || this.executionStopped && this.ownsNativeResource && !this.joined || this.cpuRequests.size > 0 || this.heapRequests.size > 0;
	}
	service() {
		this.runtime.service();
	}
	serviceTaskPort() {
		const taskPort = this.taskPort;
		if (!taskPort) return;
		runWithMainThreadTask(this.diagnosticName, () => taskPort.service());
		this.observeTaskPortLoss();
	}
	observeTaskPortLoss() {
		const failure = this.taskPort?.failure;
		if (!failure || !this.started || !this.referenced || this.taskPortLossReported || this.terminalObserved || this.stopping || this.joined || this.executionStopped || this.runtime.failure) return;
		this.taskPortLossReported = true;
		this.runInContext(() => this.emit("error", failure));
	}
	serviceResource() {
		if (!this.resourceBinding || this.servicingResource || this.joined) return;
		this.servicingResource = true;
		try {
			this.resourceBinding.service();
		} catch (error) {
			this.resourceFailed(error);
		} finally {
			this.servicingResource = false;
		}
	}
	attachResource(descriptor) {
		this.resourceBinding = bindNativeWorkerResource({
			broker: this.runtime.resourceBroker(),
			descriptor,
			connection: this.resourceConnection,
			supervisorAvailable: () => !this.runtime.failure,
			postOwnerMessage: (value, sequence) => this.runtime.post({
				type: "resource-owner",
				id: this.id,
				sequence,
				value
			}),
			closed: () => this.runInContext(() => {
				this.resourceClosed = true;
				if (this.supervisorJoined) this.finishJoined(void 0);
			}),
			failed: (error) => this.resourceFailed(error)
		});
		return {
			workerDataKey: descriptor.workerDataKey,
			attachment: this.resourceBinding.attachment
		};
	}
	abandonResource() {
		this.taskPort?.close();
		if (this.resourceBinding) this.resourceBinding.abandonUnattached();
		else this.resourceConnection?.dispose();
	}
	resourceFailed(error) {
		this.runInContext(() => {
			this.stopCompletion.reject(error);
			this.emit("error", toErrorObject(error, "Native resource observation failed"));
		});
	}
	recoverResource() {
		if (!this.resourceBinding || this.joined || this.resourceRecovery) return;
		const recovery = this.resourceBinding.closeAfterSupervisor();
		this.resourceRecovery = recovery;
		recovery.then(() => this.runInContext(() => {
			this.finishJoined(void 0);
		}), (error) => this.runInContext(() => {
			this.stopping = false;
			this.stopCompletion.reject(error);
		}));
	}
	postMessage(value, transferList = []) {
		if (this.joined || this.stopping || this.executionStopped) throw new Error("Native worker is closing");
		if (this.runtime.failure) throw this.runtime.failure;
		if (this.taskPort) {
			this.taskPort.postMessage(value, transferList);
			return;
		}
		this.runtime.post({
			type: "post",
			id: this.id,
			value,
			transferList: [...transferList]
		}, transferList);
	}
	ref() {
		if (this.runtime.failure) throw this.runtime.failure;
		this.taskPort?.assertAvailable();
		if (!this.referenced) {
			this.runtime.post({
				type: "ref",
				id: this.id,
				referenced: true
			});
			this.referenced = true;
		}
		this.runtime.refreshReference();
		return this;
	}
	unref() {
		const wasReferenced = this.referenced;
		this.referenced = false;
		if (!this.joined) {
			if (this.runtime.failure) throw this.runtime.failure;
			if (wasReferenced) this.runtime.post({
				type: "ref",
				id: this.id,
				referenced: false
			});
		}
		this.runtime.refreshReference();
		return this;
	}
	stop() {
		if (this.joined) {
			if (this.stopCompletion.operation.read().status !== "fulfilled") {
				this.stopCompletion = createRetainedOperation(() => this.service());
				this.stopCompletion.resolve();
			}
			return this.stopCompletion.operation;
		}
		if (this.stopCompletion.operation.read().status === "rejected") this.stopCompletion = createRetainedOperation(() => this.service());
		if (this.supervisorJoined && this.resourceBinding) {
			this.stopCompletion.reject(new Error("Native resource cleanup is still retained after supervisor loss", { cause: this.runtime.failure }));
			this.recoverResource();
			return this.stopCompletion.operation;
		}
		if (!this.stopping) {
			this.stopping = true;
			try {
				this.runtime.post({
					type: "stop",
					id: this.id
				});
			} catch (error) {
				this.stopping = false;
				this.stopCompletion.reject(error);
			}
			this.runtime.refreshReference();
		}
		return this.stopCompletion.operation;
	}
	terminate() {
		return this.stop().result;
	}
	cpuUsage(previous) {
		return this.requestSample(this.cpuRequests, {
			type: "cpu",
			previous
		});
	}
	getHeapStatistics() {
		return this.requestSample(this.heapRequests, { type: "heap" });
	}
	requestSample(requests, request) {
		if (this.joined) return Promise.reject(/* @__PURE__ */ new Error("Native worker exited"));
		const pending = createRetainedOperation(() => this.service());
		const requestId = ++this.requestId;
		requests.set(requestId, pending);
		try {
			this.runtime.post({
				...request,
				id: this.id,
				requestId
			});
		} catch (error) {
			requests.delete(requestId);
			pending.reject(error);
		}
		this.runtime.refreshReference();
		return pending.operation.result;
	}
	rejectSamples(error) {
		for (const pending of [...this.cpuRequests.values(), ...this.heapRequests.values()]) pending.reject(error);
		this.cpuRequests.clear();
		this.heapRequests.clear();
	}
	ownerFailed(error) {
		this.runInContext(() => {
			this.taskPort?.close();
			this.stopping = false;
			this.rejectSamples(error);
			this.stopCompletion.reject(error);
			this.emit("error", error);
		});
	}
	ownerJoined(error) {
		this.runInContext(() => {
			this.stopping = false;
			this.supervisorJoined = true;
			this.rejectSamples(error);
			this.finishExecution(void 0);
			if (this.ownsNativeResource) {
				if (this.resourceClosed) {
					this.finishJoined(void 0);
					return;
				}
				this.stopCompletion.reject(new Error("Native resource cleanup outcome is unavailable after owner loss", { cause: error }));
				this.recoverResource();
				return;
			}
			this.finishJoined(void 0);
		});
	}
	finishJoined(code) {
		if (this.joined) return;
		this.joined = true;
		this.taskPort?.close();
		this.threadId = -1;
		this.stopping = false;
		this.referenced = false;
		this.rejectSamples(/* @__PURE__ */ new Error("Native worker exited"));
		this.stopCompletion.resolve();
		this.runtime.handles.delete(this.id);
		if (!this.runtime.failure) this.runtime.post({
			type: "release",
			id: this.id
		});
		this.runtime.refreshReference();
		if (this.resourceBinding) this.resourceBinding.release();
		else this.resourceConnection?.dispose();
		this.finishExecution(code);
		this.emit("exit", code);
	}
	finishExecution(code) {
		if (!this.executionStopped) {
			this.taskPort?.close();
			this.executionStopped = true;
			this.emit("execution-exit", code);
		}
	}
	receive(reply) {
		this.runInContext(() => runWithMainThreadTask(this.diagnosticName, () => {
			if (reply.type === "error" || reply.type === "messageerror" || reply.type === "create-error" || reply.type === "execution-exit" || reply.type === "stopped" || reply.type === "stop-error") {
				this.terminalObserved = true;
				this.taskPort?.drain();
			}
			this.receiveOwned(reply);
		}));
	}
	receiveOwned(reply) {
		if (reply.type === "created") {
			this.started = true;
			this.threadId = reply.threadId;
			trackNativeWorkerForCpu(this, this.filename, this.evalSource);
			this.taskPort?.start();
			this.emit("started");
			this.taskPort?.drain();
			this.observeTaskPortLoss();
		} else if (reply.type === "message") this.emit("message", reply.value);
		else if (reply.type === "resource-message") this.resourceBinding?.receive(reply.response);
		else if (reply.type === "error" || reply.type === "messageerror") this.emit(reply.type, toErrorObject(decodeNativeWorkerFailure(reply.error), "Native worker failed"));
		else if (reply.type === "create-error") {
			this.joined = true;
			this.threadId = -1;
			this.referenced = false;
			const error = toErrorObject(decodeNativeWorkerFailure(reply.error), "Native worker creation failed");
			this.rejectSamples(error);
			this.stopCompletion.resolve();
			this.runtime.handles.delete(this.id);
			this.runtime.refreshReference();
			this.abandonResource();
			this.emit("error", error);
		} else if (reply.type === "stopped") this.finishJoined(reply.code);
		else if (reply.type === "execution-exit") this.finishExecution(reply.code);
		else if (reply.type === "stop-error") {
			const requestedStop = this.stopping;
			this.stopping = false;
			let error;
			try {
				if (reply.resourceError) {
					if (!this.resourceConnection?.decodeCloseError) throw new Error("Native resource cleanup error decoder is unavailable", { cause: reply.error });
					error = this.resourceConnection.decodeCloseError(reply.error);
				} else error = toErrorObject(decodeNativeWorkerFailure(reply.error), "Native worker stop failed");
			} catch (decodeError) {
				error = toErrorObject(decodeError, "Native resource cleanup error decoding failed");
			}
			this.stopCompletion.reject(error);
			if (!requestedStop) this.emit("error", error);
		} else if (reply.type === "cpu") {
			this.cpuRequests.get(reply.requestId)?.resolve(reply.value);
			this.cpuRequests.delete(reply.requestId);
		} else if (reply.type === "heap") {
			this.heapRequests.get(reply.requestId)?.resolve(reply.value);
			this.heapRequests.delete(reply.requestId);
		} else if (reply.type === "request-error") {
			const error = toErrorObject(decodeNativeWorkerFailure(reply.error), "Native worker observation failed");
			this.cpuRequests.get(reply.requestId)?.reject(error);
			this.heapRequests.get(reply.requestId)?.reject(error);
			this.cpuRequests.delete(reply.requestId);
			this.heapRequests.delete(reply.requestId);
		}
		this.runtime.refreshReference();
	}
};
//#endregion
//#region src/infra/worker-native-lifecycle.ts
const lifetime = resolveGlobalSingleton(Symbol.for("openclaw.nativeWorkerLifetimes"), () => ({
	nextId: 0,
	sources: /* @__PURE__ */ new WeakMap()
}), closeDefaultRetainedNativeWorkerSource);
/** Terminal process cleanup joins the existing unbound owner without starting another. */
async function closeDefaultRetainedNativeWorkerSource() {
	await lifetime.defaultSource?.close();
}
function forgetNativeSource(source) {
	if (source.runtimeGeneration) {
		if (lifetime.sources.get(source.runtimeGeneration) === source) lifetime.sources.delete(source.runtimeGeneration);
	} else if (lifetime.defaultSource === source) lifetime.defaultSource = void 0;
}
function nativeCleanupFailures(results) {
	return results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
}
function nativeRuntime(source) {
	if (source.closing) throw new Error("Native worker source is closing");
	const existing = source.runtime;
	if (existing) {
		if (existing.failure) throw existing.failure;
		return existing;
	}
	return runInDetachedAsyncContext(() => {
		const { port1, port2 } = new MessageChannel();
		const url = source.moduleUrl;
		let worker;
		try {
			worker = createCpuTrackedWorker(url, {
				execArgv: resolveRuntimeWorkerThreadExecArgv(url),
				env: SHARE_ENV,
				workerData: { port: port2 },
				transferList: [port2]
			});
		} catch (error) {
			port1.close();
			port2.close();
			throw error;
		}
		const handles = /* @__PURE__ */ new Map();
		const ownerJoined = createDeferredCore();
		ownerJoined.promise.catch(() => void 0);
		let terminating = false;
		const terminateOwner = () => {
			if (terminating) return;
			terminating = true;
			worker.ref();
			port1.ref();
			try {
				worker.terminate().catch(ownerJoined.reject);
			} catch (error) {
				ownerJoined.reject(error);
			}
		};
		const receive = (reply) => {
			observeWorkerMessage(reply, "from_worker", "lifecycle");
			handles.get(reply.id)?.receive(reply);
		};
		const runtime = {
			handles,
			service() {
				for (;;) {
					const next = runWithMainThreadTask("worker:control-decode", () => receiveMessageOnPort(port1));
					if (!next) break;
					receive(next.message);
				}
				const resourceHandles = [...handles.values()];
				for (const handle of resourceHandles) {
					handle.serviceTaskPort();
					handle.serviceResource();
				}
				if (runtime.failure) return;
				let channelOpen;
				try {
					channelOpen = nativePortIsOpen(port1);
				} catch (error) {
					fail(new Error("Native worker lifetime channel observation failed", { cause: error }));
					terminateOwner();
					return;
				}
				if (!channelOpen) {
					fail(/* @__PURE__ */ new Error("Native worker lifetime channel closed"));
					terminateOwner();
					return;
				}
				source.broker?.serviceNativeResources();
			},
			post(message, transfers = []) {
				if (runtime.failure) throw runtime.failure;
				const bytes = workerMessagePayloadBytes(message);
				port1.postMessage(message, [...transfers]);
				observeWorkerMessage(message, "to_worker", "lifecycle", bytes ?? null);
			},
			resourceBroker() {
				return source.broker ??= runInDetachedAsyncContext(() => createSpawnBrokerHost({
					nativeResources: true,
					workerUrl: source.brokerModuleUrl
				}));
			},
			refreshReference() {
				if ([...handles.values()].some((handle) => handle.needsReference)) {
					worker.ref();
					port1.ref();
				} else {
					worker.unref();
					port1.unref();
				}
			},
			close() {
				if (handles.size) return Promise.reject(/* @__PURE__ */ new Error("Native worker execution owners have not joined"));
				runtime.failure ??= /* @__PURE__ */ new Error("Native worker lifetime owner is closing");
				terminateOwner();
				return ownerJoined.promise;
			}
		};
		const fail = (error) => {
			if (runtime.failure) return;
			runtime.failure = toErrorObject(error, "Native worker lifetime owner failed");
			for (const handle of handles.values()) handle.ownerFailed(runtime.failure);
		};
		port1.on("message", receive);
		port1.on("messageerror", (error) => {
			try {
				fail(error);
			} finally {
				terminateOwner();
			}
		});
		worker.on("message", (message) => receiveWorkerMemoryPort(worker, message));
		worker.on("error", fail);
		worker.once("exit", () => {
			setImmediate(() => {
				const error = runtime.failure ?? /* @__PURE__ */ new Error("Native worker lifetime owner exited");
				runtime.failure = error;
				source.closing = true;
				for (const handle of handles.values()) handle.ownerJoined(error);
				port1.close();
				ownerJoined.resolve();
			});
		});
		source.runtime = runtime;
		runtime.refreshReference();
		return runtime;
	});
}
/** Capture before queues; explicit undefined preserves an intentionally unbound lifetime. */
function captureRetainedNativeWorkerSource(options) {
	const supervisor = resolveRuntimeProcessEntrypointUrl("workerNativeLifecycle");
	const captured = options === void 0 ? captureRuntimeWorkerSource(supervisor) : {
		moduleUrl: options.runtimeGeneration ? options.runtimeGeneration.resolve(supervisor) : supervisor,
		runtimeGeneration: options.runtimeGeneration
	};
	const existing = captured.runtimeGeneration ? lifetime.sources.get(captured.runtimeGeneration) : lifetime.defaultSource;
	if (existing) return existing;
	const source = {
		...captured,
		brokerModuleUrl: captured.runtimeGeneration ? captured.runtimeGeneration.resolve(resolveRuntimeProcessEntrypointUrl("spawnBroker")) : resolveRuntimeProcessEntrypointUrl("spawnBroker"),
		closing: false,
		get hasActiveWorkers() {
			return Boolean(source.runtime?.handles.size);
		},
		async retireIdleBroker() {
			await source.brokerClose;
			if (source.hasActiveWorkers) return false;
			const broker = source.broker;
			source.broker = void 0;
			await (source.brokerClose = broker?.close());
			source.brokerClose = void 0;
			return true;
		},
		close() {
			return closingOwners ??= Promise.resolve().then(async () => {
				const errors = nativeCleanupFailures(await Promise.allSettled([...owners.values()].map((close) => close())));
				if (errors.length) throw new AggregateError(errors, "Native worker execution owner cleanup failed");
				source.closing = true;
				await source.runtime?.close();
				await source.brokerClose;
				await source.broker?.close();
				forgetNativeSource(source);
				owners.clear();
			});
		},
		create(filename, workerOptions, resource, taskPorts) {
			try {
				return startNativeWorker(nativeRuntime(source), filename, workerOptions ?? {}, resource, taskPorts);
			} catch (error) {
				taskPorts?.host.close();
				taskPorts?.worker.close();
				throw error;
			}
		},
		captureResource(moduleUrl, workerDataKey, input, connect) {
			const inContext = AsyncLocalStorage.snapshot();
			return Object.freeze({
				moduleUrl: String(captured.runtimeGeneration?.resolve(moduleUrl) ?? moduleUrl),
				workerDataKey,
				input: input === void 0 ? void 0 : structuredClone(input),
				connect: connect ? () => inContext(() => {
					const connection = connect();
					const decode = connection.decodeCloseError?.bind(connection);
					return {
						port: connection.port,
						service: () => inContext(() => connection.service()),
						dispose: () => inContext(() => connection.dispose()),
						decodeCloseError: decode ? (payload) => inContext(() => decode(payload)) : void 0
					};
				}) : void 0
			});
		},
		retain(owner, closeOwner) {
			owners.set(owner, closeOwner);
			captured.runtimeGeneration?.retain(source, () => source.close());
		}
	};
	const owners = /* @__PURE__ */ new Map();
	let closingOwners;
	if (captured.runtimeGeneration) lifetime.sources.set(captured.runtimeGeneration, source);
	else lifetime.defaultSource = source;
	return source;
}
/** Existing execution owners retain their queues; this capability owns only physical Worker lifetime. */
function createRetainedNativeWorker(filename, options = {}, source, resource, taskPorts) {
	try {
		return (source ?? captureRetainedNativeWorkerSource({ runtimeGeneration: void 0 })).create(filename, options, resource, taskPorts);
	} catch (error) {
		taskPorts?.host.close();
		taskPorts?.worker.close();
		throw error;
	}
}
function startNativeWorker(runtime, filename, options, resource, taskPorts) {
	const id = ++lifetime.nextId;
	let resourceConnection;
	let handle;
	try {
		resourceConnection = resource?.connect?.();
		handle = new NativeWorker(runtime, id, filename, options.eval === true, resource !== void 0, resourceConnection, taskPorts?.host);
		const { env, transferList = [], ...captured } = options;
		runtime.handles.set(id, handle);
		const retainedResource = resource ? handle.attachResource(resource) : void 0;
		runtime.post({
			type: "create",
			id,
			filename: {
				kind: filename instanceof URL ? "url" : "path",
				value: String(filename)
			},
			environmentData: captureSqliteWorkerEnvironmentData(),
			options: {
				...captured,
				environment: { ...env === SHARE_ENV ? process.env : env ?? process.env },
				shareEnvironment: env === SHARE_ENV
			},
			transferList: [...transferList],
			resource: retainedResource,
			taskPort: taskPorts?.worker
		}, taskPorts ? [...transferList, taskPorts.worker] : transferList);
	} catch (error) {
		runtime.handles.delete(id);
		runtime.refreshReference();
		if (handle) handle.abandonResource();
		else {
			taskPorts?.host.close();
			resourceConnection?.dispose();
		}
		taskPorts?.worker.close();
		throw error;
	}
	runtime.refreshReference();
	return handle;
}
const DEFAULT_WORKER_PENDING_BYTES = 268435456;
/** Shared compute admission; database and generation workers keep their own ordering. */
function createWorkerComputeCapacity(limit) {
	if (!Number.isSafeInteger(limit) || limit < 1) throw new RangeError("compute capacity must be a positive safe integer");
	const active = /* @__PURE__ */ new Set();
	const waiting = /* @__PURE__ */ new Set();
	let pendingTasks = 0;
	let pendingBytes = 0;
	let draining = false;
	const requestCheckpoints = () => {
		let demand = waiting.size;
		if (demand) {
			for (const permit of active) if (permit.requestCheckpoint() && --demand === 0) break;
		}
	};
	const drain = () => {
		if (draining) return;
		draining = true;
		try {
			while (active.size < limit && waiting.size) {
				const next = waiting.values().next().value;
				waiting.delete(next);
				next();
			}
		} finally {
			draining = false;
		}
		requestCheckpoints();
	};
	return {
		getSnapshot: () => ({
			limit,
			active: active.size,
			waitingPools: waiting.size,
			pendingTasks,
			pendingBytes
		}),
		admit(bytes) {
			if (pendingTasks >= 128 || pendingBytes + bytes > 268435456) return false;
			pendingTasks++;
			pendingBytes += bytes;
			return true;
		},
		finish(bytes) {
			pendingTasks--;
			pendingBytes -= bytes;
		},
		acquire(resume, requestCheckpoint) {
			if (active.size >= limit || !draining && waiting.size) {
				waiting.add(resume);
				requestCheckpoints();
				return;
			}
			const permit = { requestCheckpoint };
			active.add(permit);
			return permit;
		},
		release(permit) {
			active.delete(permit);
			drain();
		},
		remove(resume) {
			waiting.delete(resume);
		},
		requestCheckpoints
	};
}
//#endregion
//#region packages/worker-runtime/src/worker-task-context.ts
function captureWorkerTaskContext() {
	const context = new AsyncResource("OpenClaw.WorkerTask");
	return (operation) => context.runInAsyncScope(operation);
}
//#endregion
//#region packages/worker-runtime/src/worker-task-error.ts
var WorkerTaskError = class extends Error {
	constructor(message, code, options) {
		super(message, options);
		this.code = code;
		this.name = "WorkerTaskError";
	}
};
function workerTaskTimeoutError(exchange, workerUrl) {
	let callback = exchange?.sent === false ? exchange.name : void 0;
	if (callback === "unknown") callback = workerUrl.protocol === "file:" ? workerUrl.pathname.split("/").at(-1)?.slice(0, 96) || "worker" : `${workerUrl.protocol} worker`;
	const error = new WorkerTaskError(callback ? `worker task timed out waiting for host callback ${callback}` : "worker task timed out", "timeout");
	if (callback) process.emitWarning(error.message, { code: "WORKER_HOST_CALLBACK_TIMEOUT" });
	return error;
}
function workerTaskUnavailableError(slot, message, cause) {
	const task = slot.task;
	const stage = slot.ready === false ? "startup" : task?.exchange ? "exchange" : "running";
	return new WorkerTaskError(message + (task?.diagnosticLabel ? ` [task=${task.diagnosticLabel} admittedInputBytes=${task.inputBytes} exchanges=${task.exchangeSequence} stage=${stage}]` : ""), "unavailable", { cause });
}
//#endregion
//#region packages/worker-runtime/src/worker-task-host.ts
/** Capture before callbacks so nested servicing advances a fresh set of owners. */
function serviceNativeWorkerPass(host, slots) {
	const workers = [];
	for (const slot of slots) if (slot.native) workers.push(slot.native);
	host.serviceNativeWorkers(workers);
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-bootstrap.ts
/** A failed bootstrap stops new construction until its generation is rotated. */
function createWorkerTaskPoolBootstrap(slots, queue, reject) {
	let failure;
	const admissionError = () => failure && ![...slots].some((slot) => slot.ready === true && !slot.retiring && !slot.retirementFailed) ? failure : void 0;
	const rejectQueued = () => {
		const error = admissionError();
		if (!error) return;
		const queued = queue.splice(0);
		for (const task of queued) reject(task, error);
	};
	return {
		error: () => failure,
		get admissionError() {
			return admissionError();
		},
		fail(error) {
			failure ??= error;
			rejectQueued();
		},
		rejectQueued,
		reset: () => {
			failure = void 0;
		}
	};
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-owned.ts
function createWorkerHostExchange(task, request) {
	const name = isRecord(request) ? request.kind ?? request.type : request;
	return task.exchange = {
		id: ++task.exchangeSequence,
		name: typeof name === "string" && /^[a-zA-Z][a-zA-Z0-9._:-]{0,95}$/.test(name) ? name : "unknown",
		pressure: new AbortController(),
		sent: false,
		onConsumed: void 0
	};
}
function dispatchOwnedWorkerRequest(task, slot, value, exchange, owner) {
	const context = {
		signal: (task.controller ??= new AbortController()).signal,
		yieldSignal: exchange.pressure.signal
	};
	const assertCurrent = () => {
		if (task.done || slot.task !== task) throw owner.closedError();
	};
	if (task.options.onRequestSync) {
		try {
			assertCurrent();
			owner.accept(task.options.onRequestSync(value, context));
		} catch (error) {
			owner.reject(error);
		}
		return;
	}
	Promise.resolve().then(() => {
		assertCurrent();
		return task.options.onRequest(value, context);
	}).then(owner.accept).catch(owner.reject);
}
async function joinOwnedWorkerTasks(closures) {
	const errors = (await Promise.allSettled(closures)).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (errors.length === 1) throw errors[0];
	if (errors.length > 1) throw new AggregateError(errors, "Worker task cleanup failed");
}
function joinOwnedWorkerTask(task, settlement, retire = false) {
	return startJoinOwnedWorkerTask(task, settlement, retire).result;
}
function startJoinOwnedWorkerTask(task, settlement, retire = false) {
	const closing = startCloseOwnedWorkerTask(task, settlement, retire);
	const observe = () => {
		const outcome = closing.read();
		if (outcome.status === "pending") return outcome;
		if (outcome.status === "rejected" && task.owner?.closing === closing) task.owner.closing = void 0;
		if (task.owner?.closed) {
			const slot = task.slot;
			task.slot = void 0;
			settlement.release(task, slot);
		}
		return outcome;
	};
	const result = closing.result.then(() => {
		observe();
	}, (error) => {
		observe();
		throw error;
	});
	result.catch(() => void 0);
	return {
		result,
		read: observe,
		service() {
			closing.service();
			observe();
		}
	};
}
function closeOwnedWorkerTask(task, settlement, retire = false) {
	return startCloseOwnedWorkerTask(task, settlement, retire).result;
}
function startCloseOwnedWorkerTask(task, settlement, retire = false) {
	const owner = task.owner;
	if (!owner || owner.closed) {
		if (owner?.closing) return owner.closing;
		const complete = createRetainedOperation(() => {});
		complete.resolve();
		return complete.operation;
	}
	owner.retire ||= retire;
	if (owner.closing) return owner.closing;
	let retirement;
	let observedPreparation;
	let advancing = false;
	const closing = createRetainedOperation(() => {
		retirement?.service();
		advance();
	});
	const advance = () => {
		if (advancing || closing.operation.read().status !== "pending") return;
		advancing = true;
		try {
			if (task.preparation) {
				if (observedPreparation !== task.preparation.promise) {
					observedPreparation = task.preparation.promise;
					observedPreparation.then(advance, closing.reject);
				}
				return;
			}
			const slot = task.slot;
			if (slot && owner.retire) {
				if (!retirement) {
					retirement = settlement.retire(slot);
					retirement.result.then(advance, advance);
				}
				const outcome = retirement.read();
				if (outcome.status === "pending") return;
				if (outcome.status === "rejected") throw outcome.error;
			}
			settlement.detach(task);
			try {
				owner.complete?.();
			} finally {
				owner.closed = true;
				owner.complete = void 0;
				task.input = void 0;
				task.options = {};
				task.abort = () => {};
			}
			closing.resolve();
		} catch (error) {
			closing.reject(error);
		} finally {
			advancing = false;
		}
	};
	owner.closing = closing.operation;
	if (!task.done) settlement.cancel(task);
	advance();
	return closing.operation;
}
function retainWorkerTask(task, settlement, service) {
	return {
		result: task.promise,
		read: () => task.read(),
		service,
		release: (closeOptions) => {
			const closing = startJoinOwnedWorkerTask(task, settlement, closeOptions?.retire === true);
			return {
				result: closing.result,
				read: () => closing.read(),
				service: () => {
					service();
					closing.service();
				}
			};
		}
	};
}
function prepareWorkerTaskInput(task, receive, reject, prepareResources) {
	const taskInput = task.input;
	delete task.input;
	const preparation = Promise.withResolvers();
	task.preparation = preparation;
	const finishPreparation = () => {
		preparation.resolve();
		if (task.preparation === preparation) task.preparation = void 0;
	};
	const failed = (error) => {
		finishPreparation();
		reject(error);
	};
	let prepared;
	try {
		prepared = typeof taskInput === "function" ? taskInput() : taskInput;
	} catch (error) {
		failed(error);
		return;
	}
	if (prepareResources) prepared = Promise.resolve(prepared).then(async (input) => {
		await prepareResources();
		return input;
	});
	const ready = (input) => {
		finishPreparation();
		receive(input);
	};
	if (isPromiseLike(prepared)) Promise.resolve(prepared).then(ready, failed);
	else ready(prepared);
}
function armWorkerTaskTimeout(task, timeoutMs, onTimeout) {
	clearTimeout(task.timer);
	const now = performance.now();
	task.deadline = Math.min(task.options.hostTimeout !== "owner" && task.options.timeoutMs !== void 0 ? task.deadline ?? task.enqueuedAt + resolveTimerTimeoutMs(task.options.timeoutMs, 6e4) : Infinity, now + resolveTimerTimeoutMs(timeoutMs, 6e4));
	task.timer = setTimeout(onTimeout, Math.max(0, task.deadline - now));
}
function expireWorkerTasks(queue, slots, expire) {
	const now = performance.now();
	const pending = [...queue, ...[...slots].flatMap((slot) => slot.task ? [slot.task] : [])];
	for (const task of pending) if (!task.done && task.deadline !== void 0 && now >= task.deadline) expire(task);
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-completion.ts
const taskDiagnostics = channel("openclaw.worker.task");
function joinWorkerTaskPreparationCleanups(completion, artifactCleanup) {
	return joinOwnedWorkerTasks([...[...completion.preparationCleanups].map(([task, cleanup]) => cleanup.finally(() => {
		if (completion.preparationCleanups.delete(task)) completion.releaseAdmission(task);
	})), artifactCleanup.then(() => void 0)]);
}
function notifyExecutionSettled(task) {
	try {
		if (!task.executionNotified) {
			task.executionNotified = true;
			task.options.onExecutionSettled?.({ retired: task.slot?.retired === true });
		}
	} catch (error) {
		return toErrorObject(error, "worker settlement receipt failed");
	}
}
function createWorkerTaskCompletion(task, completion, error, value) {
	const preparation = task.owner ? void 0 : task.preparation;
	let settlementError;
	const complete = () => {
		if (!task.owner && !preparation) completion.releaseAdmission(task);
		return completeWorkerTask(task, completion, error, value, settlementError);
	};
	if (!preparation) return complete;
	const cleanup = Promise.withResolvers();
	completion.preparationCleanups.set(task, cleanup.promise);
	cleanup.promise.catch(() => void 0);
	return () => {
		settlementError = task.runInContext(() => notifyExecutionSettled(task));
		if (error) task.reject(error);
		preparation.promise.then(() => {
			const failure = complete();
			if (failure) throw failure;
			completion.preparationCleanups.delete(task);
			completion.releaseAdmission(task);
			cleanup.resolve();
		}).catch(cleanup.reject);
	};
}
function completeWorkerTask(task, completion, error, value, settlementError) {
	return task.runInContext(() => {
		let completionError = error ?? settlementError;
		const cleanupErrors = settlementError ? [settlementError] : [];
		try {
			if (!task.inputConsumed) {
				task.inputConsumed = true;
				task.options.onInputConsumed?.();
			}
			const release = task.exchange?.onConsumed;
			task.exchange = void 0;
			release?.();
		} catch (releaseError) {
			const cleanupError = toErrorObject(releaseError, "worker input release failed");
			cleanupErrors.push(cleanupError);
			completionError ??= cleanupError;
		}
		const receiptError = notifyExecutionSettled(task);
		if (receiptError) {
			cleanupErrors.push(receiptError);
			completionError ??= receiptError;
		}
		const permit = task.computePermit;
		task.computePermit = void 0;
		if (permit) completion.releaseCompute(permit);
		if (taskDiagnostics.hasSubscribers) {
			const now = performance.now();
			taskDiagnostics.publish({
				...completion.diagnostics(),
				outcome: completionError ? "failed" : "ok",
				queueMs: (task.startedAt ?? now) - task.enqueuedAt,
				preparationMs: task.startedAt === void 0 ? 0 : (task.preparedAt ?? now) - task.startedAt,
				runMs: task.preparedAt === void 0 ? 0 : now - task.preparedAt,
				transferMs: task.transferMs,
				hostWaitMs: task.hostWaitMs
			});
		}
		const firstCleanupError = cleanupErrors[0];
		const cleanupError = cleanupErrors.length > 1 ? new AggregateError(cleanupErrors, "Worker task cleanup failed", { cause: firstCleanupError }) : firstCleanupError;
		if (task.owner) {
			if (cleanupError) throw cleanupError;
		} else if (completionError) task.reject(completionError);
		else task.resolve(value);
		return cleanupError;
	});
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-resources.ts
/** Each existing slot retains its cleanup receipt; no result Promise controls custody. */
function startCloseWorkerPoolResources(slots, resourceClosures, retire, key, options, observeReply) {
	const operations = [...slots].map((slot) => {
		if (slot.retiring) return slot.retiring;
		if (slot.native?.executionStopped) return retire(slot);
		const worker = slot.worker;
		if (!worker) {
			const complete = createRetainedOperation(() => {});
			complete.resolve();
			return complete.operation;
		}
		const closure = resourceClosures.get(worker) ?? { pending: 0 };
		closure.pending++;
		resourceClosures.set(worker, closure);
		worker.ref();
		return startCloseWorkerTaskResources(slot, worker, closure, key, options, retire, observeReply);
	});
	const completion = createRetainedOperation(() => {
		for (const operation of operations) operation.service();
		advance();
	});
	const advance = () => {
		const outcomes = operations.map((operation) => operation.read());
		if (outcomes.some((outcome) => outcome.status === "pending")) return;
		const errors = outcomes.flatMap((outcome) => outcome.status === "rejected" ? [outcome.error] : []);
		if (errors.length) completion.reject(new AggregateError(errors, "Worker resource cleanup failed"));
		else completion.resolve();
	};
	for (const operation of operations) operation.result.then(advance, advance);
	advance();
	return completion.operation;
}
/** Concurrent resource closes share one listener until their last real receipt. */
function observeResourceWorkerExit(worker, closures, finish) {
	let exit = closures.exit;
	if (!exit) {
		const waiters = /* @__PURE__ */ new Set();
		exit = {
			waiters,
			receive: () => {
				for (const waiter of waiters) waiter();
			}
		};
		closures.exit = exit;
		worker.once("exit", exit.receive);
	}
	exit.waiters.add(finish);
	return () => {
		exit.waiters.delete(finish);
		if (!exit.waiters.size) {
			worker.removeListener("exit", exit.receive);
			if (closures.exit === exit) closures.exit = void 0;
		}
	};
}
function startCloseWorkerTaskResources(slot, worker, closures, key, options, retire, observeReply) {
	const { port1, port2 } = new MessageChannel();
	const runInContext = AsyncLocalStorage.snapshot();
	let settled = false;
	let awaitingRetirement = false;
	let selectedRetirement;
	const completion = createRetainedOperation(() => {
		if (settled) return;
		slot.native?.service();
		if (slot.native?.executionStopped) {
			awaitingRetirement = true;
			selectedRetirement ??= slot.retiring ?? retire(slot);
		}
		for (;;) {
			const next = receiveMessageOnPort(port1);
			if (!next || settled) break;
			receive(next.message);
		}
		const retirement = selectedRetirement ?? slot.retiring;
		if (awaitingRetirement && retirement) {
			retirement.service();
			const stopped = retirement.read();
			if (stopped.status === "fulfilled") finish();
			else if (stopped.status === "rejected") finish(toErrorObject(stopped.error, "Worker resource cleanup retirement failed"));
		}
	});
	const finish = (error) => runInContext(() => {
		if (settled) return;
		settled = true;
		stopObservingExit();
		port1.close();
		port2.close();
		closures.pending--;
		if (!closures.pending && !slot.task && !slot.retiring) worker.unref();
		if (error) completion.reject(error);
		else completion.resolve();
	});
	const receive = (reply) => {
		observeReply?.();
		try {
			if (isRecord(reply) && reply.ok === true) {
				finish();
				return;
			}
			const error = isRecord(reply) && reply.detail !== void 0 && options?.decodeResourceError ? options.decodeResourceError(reply.detail) : new Error(isRecord(reply) && typeof reply.error === "string" ? reply.error : "Invalid worker resource cleanup receipt");
			finish(error);
		} catch (error) {
			finish(toErrorObject(error, "Worker resource cleanup receipt could not be decoded"));
		}
	};
	const stopObservingExit = observeResourceWorkerExit(worker, closures, () => finish());
	port1.once("message", receive);
	port1.once("messageerror", (error) => finish(toErrorObject(error, "Worker resource cleanup receipt could not be decoded")));
	port1.once("close", () => {
		if (settled) return;
		const retirement = slot.retiring;
		if (!retirement) {
			finish(/* @__PURE__ */ new Error("Worker resource cleanup closed without a receipt"));
			return;
		}
		awaitingRetirement = true;
		selectedRetirement = retirement;
		retirement.result.then(() => finish(), (error) => finish(toErrorObject(error, "Worker resource cleanup retirement failed")));
	});
	try {
		worker.postMessage({
			closeResource: true,
			key,
			resourcePort: port2
		}, [port2]);
	} catch (error) {
		finish(toErrorObject(error, "Worker resource cleanup could not be sent"));
	}
	return completion.operation;
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-retirement.ts
const WORKER_WARM_WINDOW_MS = 3e5;
function createWorkerTaskPoolRetirement({ slots, options, runInContext, dispatch, onRotationComplete, serviceDeadlines, markWorkerRetirement, serviceHost }) {
	const artifactCleanups = /* @__PURE__ */ new Map();
	let lastIdleRetirementAt = -Infinity;
	let warmSlot;
	let rotation;
	let rotationFailed = false;
	const setTimeoutFn = setTimeout;
	const clearTimeoutFn = clearTimeout;
	const now = performance.now.bind(performance);
	const clearIdle = (slot) => clearTimeoutFn(slot.idleTimer);
	const isBurstSlot = (slot) => {
		if (options.burstIdleTimeoutMs !== void 0) {
			for (const available of slots) if (!available.retiring && !available.retirementFailed) return available !== slot;
		}
		return false;
	};
	function startRotate() {
		if (rotation) return rotation;
		const runRotation = AsyncLocalStorage.snapshot();
		let retirements;
		let artifacts;
		let advancing = false;
		const completion = createRetainedOperation(() => {
			serviceNativeWorkerPass(serviceHost, rotationSlots);
			serviceDeadlines();
			for (const retiring of retirements ?? []) retiring.service();
			artifacts?.service();
			advance();
		});
		rotation = completion.operation;
		rotationFailed = false;
		const rotationSlots = [...slots];
		const tasks = rotationSlots.flatMap((slot) => slot.task ? [slot.task] : []);
		const advance = () => runRotation(() => {
			if (advancing || completion.operation.read().status !== "pending") return;
			advancing = true;
			try {
				if (tasks.some((task) => task.read().status === "pending")) return;
				if (!retirements) {
					retirements = rotationSlots.map((slot) => startRetire(slot, "rotation"));
					for (const retiring of retirements) retiring.result.then(advance, advance);
				}
				for (const retiring of retirements) {
					const stopped = retiring.read();
					if (stopped.status === "rejected") throw stopped.error;
					if (stopped.status === "pending") return;
				}
				if (!artifacts) {
					artifacts = startJoinArtifacts();
					artifacts.result.then(advance, advance);
				}
				const cleaned = artifacts.read();
				if (cleaned.status === "pending") return;
				if (cleaned.status === "rejected") throw cleaned.error;
				rotation = void 0;
				onRotationComplete();
				completion.resolve();
				dispatch();
			} catch (error) {
				rotation = void 0;
				rotationFailed = true;
				completion.reject(error);
			} finally {
				advancing = false;
			}
		});
		for (const task of tasks) task.promise.then(advance, advance);
		advance();
		return completion.operation;
	}
	function startRetire(slot, reason = "closed") {
		if (reason === "idle_timeout" && !isBurstSlot(slot)) lastIdleRetirementAt = now();
		else if (reason === "rotation") lastIdleRetirementAt = -Infinity;
		if (warmSlot === slot) warmSlot = void 0;
		if (slot.worker) markWorkerRetirement(slot.worker, reason);
		clearIdle(slot);
		cancelWorkerNativeSections(slot.nativeSections);
		if (slot.retiring) return slot.retiring;
		const runRetirement = AsyncLocalStorage.snapshot();
		let nativeStop;
		let observingSection = false;
		let advancing = false;
		const completion = createRetainedOperation(() => {
			nativeStop?.service();
			advance();
		});
		const advance = () => runRetirement(() => {
			if (advancing || completion.operation.read().status !== "pending") return;
			advancing = true;
			try {
				if (slot.creating) return;
				if (!areWorkerNativeSectionsSettled(slot.nativeSections)) {
					if (!observingSection) {
						observingSection = true;
						Promise.resolve(waitForWorkerNativeSections(slot.nativeSections)).then(advance, completion.reject);
					}
					return;
				}
				if (slot.worker && !nativeStop) {
					markWorkerRetirement(slot.worker, reason);
					if (slot.native) nativeStop = slot.native.stop();
					else {
						const stopped = createRetainedOperation(() => {});
						nativeStop = stopped.operation;
						Promise.resolve().then(() => slot.worker.terminate()).then(() => stopped.resolve(), stopped.reject);
					}
					nativeStop.result.then(advance, advance);
				}
				const stopped = nativeStop?.read();
				if (stopped?.status === "pending") return;
				if (stopped?.status === "rejected") throw stopped.error;
				slot.retired = true;
				const releaseResources = slot.releaseResources;
				if (releaseResources) runInContext(() => {
					const cleanup = (async () => {
						try {
							await releaseResources();
						} catch (error) {
							try {
								process.emitWarning(`Worker task resource release failed: ${String(error)}`);
							} catch {}
						}
					})();
					const settled = createRetainedOperation(() => {});
					artifactCleanups.set(cleanup, settled.operation);
					cleanup.then(() => {
						artifactCleanups.delete(cleanup);
						settled.resolve();
					}, settled.reject);
				});
				slot.worker?.removeAllListeners();
				slots.delete(slot);
				for (const complete of slot.completions ?? []) complete();
				slot.completions = void 0;
				dispatch();
				completion.resolve();
			} catch (error) {
				try {
					Promise.resolve(options.onRetirementFailure?.(error)).catch(() => void 0);
				} catch {}
				slot.retirementFailed = true;
				slot.retiring = void 0;
				completion.reject(error);
			} finally {
				advancing = false;
			}
		});
		slot.retiring = completion.operation;
		Promise.resolve().then(advance);
		return completion.operation;
	}
	function retire(slot, reason) {
		return startRetire(slot, reason).result;
	}
	function startJoinArtifacts() {
		const pending = [...artifactCleanups.values()];
		const joined = createRetainedOperation(() => {
			for (const operation of pending) operation.service();
			advance();
		});
		const advance = () => {
			const outcomes = pending.map((operation) => operation.read());
			const failure = outcomes.find((outcome) => outcome.status === "rejected");
			if (failure?.status === "rejected") joined.reject(failure.error);
			else if (outcomes.every((outcome) => outcome.status === "fulfilled")) joined.resolve();
		};
		for (const operation of pending) operation.result.then(advance, advance);
		advance();
		return joined.operation;
	}
	/** Join failed native retirements without interrupting healthy tasks. */
	async function retryFailedRetirements() {
		const outcomes = await Promise.allSettled([...slots].filter((slot) => slot.retirementFailed).map((slot) => retire(slot)));
		outcomes.push(...await Promise.allSettled(artifactCleanups.keys()));
		const errors = outcomes.flatMap((outcome) => outcome.status === "rejected" ? [toErrorObject(outcome.reason, "worker retirement retry failed")] : []);
		const firstError = errors[0];
		if (firstError) throw errors.length === 1 ? firstError : new AggregateError(errors, "Worker retirement retries failed", { cause: firstError });
	}
	function idle(slot, elapsedIdleMs = 0) {
		const burst = isBurstSlot(slot);
		const idleMs = (burst ? options.burstIdleTimeoutMs : options.idleTimeoutMs) ?? 6e4;
		if (idleMs <= 0) return;
		if (!burst && !warmSlot && now() - lastIdleRetirementAt < WORKER_WARM_WINDOW_MS) warmSlot = slot;
		const startedAt = burst ? now() : 0;
		const timeoutMs = warmSlot === slot ? Math.max(idleMs, WORKER_WARM_WINDOW_MS) : idleMs;
		slot.idleTimer = runInContext(() => setTimeoutFn(() => {
			if (burst && !isBurstSlot(slot)) {
				idle(slot, now() - startedAt);
				return;
			}
			retire(slot, "idle_timeout").catch(() => void 0);
		}, Math.max(0, timeoutMs - elapsedIdleMs)));
		slot.idleTimer.unref();
	}
	return {
		get dispatchAllowed() {
			return rotation === void 0 && !rotationFailed;
		},
		startRotate,
		retire,
		startRetire,
		service() {
			const current = [...slots];
			for (const slot of current) slot.retiring?.service();
			rotation?.service();
		},
		clearIdle,
		idle,
		retireIdle(resourceClosures) {
			for (const slot of slots) if (!slot.task && !slot.retiring && !slot.retirementFailed && slot.worker && !resourceClosures.get(slot.worker)?.pending) retire(slot, "memory_pressure").catch(() => void 0);
		},
		retryFailedRetirements,
		joinArtifacts: () => startJoinArtifacts().result
	};
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-worker.ts
function postWorkerTaskInput(worker, slot, task, input, transferList, taskContext) {
	const transferStartedAt = performance.now();
	worker.postMessage({
		input,
		taskId: task.id,
		interactive: Boolean(task.options.onRequest || task.options.onRequestSync || task.options.onNotification),
		nativeSections: slot.nativeSections.buffer,
		taskContext,
		sampleMemory: true
	}, transferList);
	task.transferMs += performance.now() - transferStartedAt;
}
function sendWorkerTaskInput(params) {
	const { slot, task, input } = params;
	if (task.done) return;
	task.diagnosticLabel = params.host.describeTask?.(params.workerUrl, input);
	task.preparedAt = performance.now();
	const bootstrapError = params.bootstrapError();
	if (bootstrapError && !slot.worker) {
		params.refuse(bootstrapError);
		return;
	}
	try {
		let worker = slot.worker;
		if (!worker) {
			slot.creating = true;
			try {
				worker = params.createWorker();
			} catch (error) {
				params.fail(error, true);
				return;
			} finally {
				slot.creating = false;
			}
		}
		const transferList = task.options.transferList?.(input);
		if (!task.done) {
			const context = params.host.captureTaskContext(worker);
			postWorkerTaskInput(worker, slot, task, input, [...transferList ?? [], ...params.host.taskContextTransferList?.(context) ?? []], context);
		}
	} catch (error) {
		params.fail(error);
	}
}
/** Physical construction and listeners share the pool's detached creation scope. */
function createWorkerTaskPoolWorker(params) {
	const { slot, options } = params;
	const worker = params.runInContext(() => {
		const prepared = options.prepareWorker?.();
		slot.releaseResources = prepared?.releaseResources;
		const temporaryDirectory = prepared?.temporaryDirectory;
		if (temporaryDirectory) {
			const cleanup = params.host.prepareResources();
			const releaseResources = slot.releaseResources;
			slot.releaseResources = async () => {
				try {
					await cleanup;
					await params.host.releaseTemporaryDirectory(temporaryDirectory);
				} finally {
					await releaseResources?.();
				}
			};
		}
		const workerUrl = options.workerUrl;
		const workerOptions = {
			...options.workerOptions,
			...prepared?.options
		};
		if (slot.retiring) throw params.unavailableError("worker creation closed during preparation");
		const bootstrapError = params.bootstrapError();
		if (bootstrapError) throw bootstrapError;
		if (params.host.requiresReady) slot.ready = false;
		const created = params.host.createWorker(workerUrl, workerOptions);
		slot.native = created.native;
		return created.worker;
	});
	let counted = false;
	const started = () => {
		if (counted) return;
		counted = true;
		params.onStarted(worker);
	};
	if (slot.native) {
		slot.native.on("started", started);
		slot.native.on("execution-exit", (code) => {
			releaseWorkerNativeSectionsOnExit(slot.nativeSections);
			if (!slot.retiring) params.onFailure(params.unavailableError(`worker exited with code ${code}`), true);
		});
	} else started();
	slot.worker = worker;
	worker.on("message", (message) => {
		if (params.host.receiveMessage(worker, message)) return;
		if (slot.ready === false) {
			if (isRecord(message) && message.status === "ready") slot.ready = true;
			else params.onFailure(params.unavailableError("worker task server did not become ready"), true);
			return;
		}
		const task = slot.task;
		if (task) task.runInContext(() => params.onMessage(message));
		else params.onMessage(message);
	});
	worker.on("error", (error) => params.onFailure(params.unavailableError(String(error), error), true));
	worker.on("messageerror", (error) => params.onFailure(params.unavailableError(String(error), error)));
	worker.once("exit", (code) => {
		releaseWorkerNativeSectionsOnExit(slot.nativeSections);
		const wasCounted = counted;
		counted = false;
		params.onExit(code, wasCounted);
	});
	return worker;
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-core.ts
const runInWorkerPoolContext = AsyncLocalStorage.snapshot();
/** Bounded execution workers; each worker accepts one task at a time. */
var WorkerTaskPoolCore = class {
	constructor(options, host, publicDispatch, ownerOptions = {}) {
		this.options = options;
		this.host = host;
		this.publicDispatch = publicDispatch;
		this.ownerOptions = ownerOptions;
		this.slots = /* @__PURE__ */ new Set();
		this.ownedTasks = /* @__PURE__ */ new Set();
		this.resourceClosures = /* @__PURE__ */ new WeakMap();
		this.ownedSettlement = {
			cancel: (task) => this.cancel(task, new WorkerTaskError("worker task closed", "unavailable")),
			detach: (task) => {
				if (task.slot?.task === task) {
					task.slot.task = void 0;
					this.activeTasks--;
				}
			},
			retire: (slot) => this.retirement.startRetire(slot),
			release: (task, slot) => {
				if (!this.ownedTasks.delete(task)) return;
				this.releaseAdmission(task);
				task.runInContext = runInWorkerPoolContext;
				this.dispatch();
				if (slot && !task.owner?.retire && !slot.task && !slot.retiring) this.idle(slot);
			}
		};
		this.completion = {
			preparationCleanups: /* @__PURE__ */ new Map(),
			releaseAdmission: (task) => this.releaseAdmission(task),
			releaseCompute: (permit) => this.computeCapacity.release(permit),
			diagnostics: () => ({
				worker: this.options.workerUrl.pathname.split("/").at(-1),
				...this.publicDispatch?.getSnapshot() ?? this.getSnapshot(),
				pendingBytes: this.pendingBytes
			})
		};
		this.queue = [];
		this.bootstrap = createWorkerTaskPoolBootstrap(this.slots, this.queue, (task, error) => this.finish(task, error));
		this.pendingTasks = 0;
		this.pendingBytes = 0;
		this.workers = 0;
		this.workersCreated = 0;
		this.activeTasks = 0;
		this.resumeCompute = () => this.dispatch();
		this.nextTaskId = 0;
		this.retireIdleOnPressure = () => this.retirement.retireIdle(this.resourceClosures);
		this.expireTasks = () => expireWorkerTasks(this.queue, this.slots, (task) => this.timeout(task));
		this.retryFailedRetirements = () => this.retirement.retryFailedRetirements();
		this.observeTask = host.createTaskObserver?.(options.workerUrl);
		this.maxWorkers = host.maxWorkers ?? options.maxWorkers ?? availableParallelism();
		this.maxPendingTasks = options.maxPendingTasks ?? 128;
		this.maxPendingBytes = options.maxPendingBytes ?? 268435456;
		for (const [name, value] of Object.entries({
			maxWorkers: this.maxWorkers,
			maxPendingTasks: this.maxPendingTasks,
			maxPendingBytes: this.maxPendingBytes
		})) if (!Number.isSafeInteger(value) || value < 1) throw new RangeError(`${name} must be a positive safe integer`);
		this.computeCapacity = options.sharedCompute ? host.computeCapacity : void 0;
		this.retirement = createWorkerTaskPoolRetirement({
			slots: this.slots,
			options,
			runInContext: runInWorkerPoolContext,
			dispatch: () => this.dispatch(),
			onRotationComplete: this.bootstrap.reset,
			serviceDeadlines: this.expireTasks,
			markWorkerRetirement: (worker, reason) => host.workerRetiring(worker, reason),
			serviceHost: host
		});
		host.pools.register(this);
	}
	run(input, options) {
		if (this.closedError) return Promise.reject(this.closedError);
		const inputBytes = options.inputBytes ?? 0;
		if (!Number.isSafeInteger(inputBytes) || inputBytes < 0) return Promise.reject(/* @__PURE__ */ new RangeError("inputBytes must be a nonnegative safe integer"));
		return this.enqueue(input, options, false, inputBytes).promise;
	}
	runTask(input, options) {
		const task = this.enqueue(input, options, true);
		return {
			result: task.promise,
			close: (closeOptions) => joinOwnedWorkerTask(task, this.ownedSettlement, closeOptions?.retire === true)
		};
	}
	startTask(input, options) {
		if (!this.ownerOptions.retainedTransport) throw new WorkerTaskError("Retained tasks require their native lifetime transport", "unavailable");
		return retainWorkerTask(this.enqueue(input, options, true), this.ownedSettlement, () => this.service());
	}
	service() {
		serviceNativeWorkerPass(this.host, this.slots);
		this.expireTasks();
		this.retirement.service();
		const tasks = [...this.ownedTasks];
		for (const task of tasks) task.owner?.closing?.service();
		this.dispatch();
	}
	enqueue(input, options, owned = false, inputBytes = options.inputBytes ?? 0) {
		const completion = createRetainedOperation(() => this.service(), { observeRejection: this.ownerOptions.retainedTransport === true });
		const task = {
			promise: completion.operation.result,
			resolve: completion.resolve,
			reject: completion.reject,
			read: () => completion.operation.read(),
			id: ++this.nextTaskId,
			runInContext: captureWorkerTaskContext(),
			controller: void 0,
			inputConsumed: false,
			executionNotified: false,
			exchangeSequence: 0,
			input,
			options: { ...options },
			abort: () => this.cancel(task, toErrorObject(options.signal?.reason, "worker task aborted")),
			done: false,
			admitted: false,
			...owned ? { owner: {
				closed: false,
				retire: false
			} } : {},
			inputBytes,
			enqueuedAt: performance.now(),
			transferMs: 0,
			hostWaitMs: 0
		};
		if (owned) this.ownedTasks.add(task);
		const unavailable = this.closedError ?? this.bootstrap.admissionError;
		if (unavailable || !Number.isSafeInteger(inputBytes) || inputBytes < 0) {
			this.finish(task, unavailable ?? /* @__PURE__ */ new RangeError("inputBytes must be a nonnegative safe integer"));
			return task;
		}
		if (this.pendingTasks >= this.maxPendingTasks || this.pendingBytes + inputBytes > this.maxPendingBytes || this.computeCapacity && !this.computeCapacity.admit(inputBytes)) {
			this.finish(task, new WorkerTaskError("worker task capacity reached", "overloaded"));
			return task;
		}
		task.admitted = true;
		this.pendingTasks++;
		this.pendingBytes += inputBytes;
		task.observation = this.observeTask?.(task.options.diagnosticOperation);
		if (options.timeoutMs !== void 0) armWorkerTaskTimeout(task, options.timeoutMs, () => this.timeout(task));
		options.signal?.addEventListener("abort", task.abort, { once: true });
		this.queue.push(task);
		if (options.signal?.aborted) task.abort();
		else this.dispatch();
		return task;
	}
	get isClosed() {
		return this.closedError !== void 0;
	}
	getSnapshot() {
		return {
			maxWorkers: this.maxWorkers,
			workers: this.workers,
			workersCreated: this.workersCreated,
			activeTasks: this.activeTasks,
			pendingTasks: this.pendingTasks
		};
	}
	startCloseResources(key) {
		return startCloseWorkerPoolResources(this.slots, this.resourceClosures, (slot) => this.ownedSettlement.retire(slot), key, this.ownerOptions, this.host.observeResourceReply);
	}
	/** Pause dispatch, settle current work and join native exit before restarting the queue. */
	rotate() {
		return this.startRotate().result;
	}
	startRotate() {
		this.computeCapacity?.remove(this.resumeCompute);
		return this.retirement.startRotate();
	}
	close(error = new WorkerTaskError("worker task pool closed", "unavailable")) {
		this.closedError ??= error;
		channel("openclaw.memory.critical").unsubscribe(this.retireIdleOnPressure);
		this.computeCapacity?.remove(this.resumeCompute);
		for (const task of this.queue.splice(0)) this.finish(task, this.closedError);
		for (const slot of this.slots) {
			if (slot.worker) this.host.workerRetiring(slot.worker, "closed");
			if (slot.task && !slot.task.owner) this.finish(slot.task, this.closedError, void 0, true);
		}
		const tasks = [...this.ownedTasks];
		const ownedSlots = new Set(tasks.flatMap((task) => task.slot?.task === task ? [task.slot] : []));
		const owned = tasks.map((task) => joinOwnedWorkerTask(task, this.ownedSettlement, true));
		const unowned = [...this.slots].filter((slot) => !ownedSlots.has(slot));
		const closures = [...owned, ...unowned.map((slot) => this.retirement.retire(slot))];
		return this.host.pools.close(this, closures, () => joinWorkerTaskPreparationCleanups(this.completion, this.retirement.joinArtifacts()));
	}
	dispatch() {
		if (!this.slots.size) channel("openclaw.memory.critical").unsubscribe(this.retireIdleOnPressure);
		if (!this.queue.length || this.closedError || !this.retirement.dispatchAllowed) this.computeCapacity?.remove(this.resumeCompute);
		while (!this.closedError && this.retirement.dispatchAllowed && this.queue.length) {
			let slot = [...this.slots].find((entry) => !entry.task && !entry.retiring && !entry.retirementFailed && (!this.bootstrap.error() || entry.worker));
			if (!slot) {
				const constructionBlocked = this.bootstrap.error();
				if (constructionBlocked) this.bootstrap.rejectQueued();
				if (constructionBlocked || this.slots.size >= this.maxWorkers) {
					let contenders = this.queue.length;
					for (const occupied of this.slots) if (occupied.task?.exchange && !occupied.task.exchange.sent && !occupied.task.exchange.pressure.signal.aborted && contenders-- > 0) occupied.task.exchange.pressure.abort();
					return;
				}
			}
			const nextTask = this.queue[0];
			if (this.computeCapacity) {
				const permit = this.computeCapacity.acquire(this.resumeCompute, () => {
					if (nextTask.exchange && !nextTask.exchange.sent && !nextTask.exchange.pressure.signal.aborted) {
						nextTask.runInContext(() => nextTask.exchange?.pressure.abort());
						return true;
					}
					return false;
				});
				if (!permit) return;
				nextTask.computePermit = permit;
			}
			if (!slot) {
				slot = { nativeSections: createWorkerNativeSectionState() };
				this.slots.add(slot);
			}
			this.retirement.clearIdle(slot);
			const task = this.queue.shift();
			slot.task = task;
			this.activeTasks++;
			task.slot = slot;
			task.startedAt = performance.now();
			task.observation?.started();
			task.runInContext(() => {
				try {
					slot.worker?.ref();
				} catch (error) {
					this.fail(slot, toErrorObject(error, "worker reference failed"));
					return;
				}
				prepareWorkerTaskInput(task, (input) => sendWorkerTaskInput({
					workerUrl: this.options.workerUrl,
					slot,
					task,
					input,
					host: this.host,
					bootstrapError: this.bootstrap.error,
					createWorker: () => this.createWorker(slot),
					fail: (error, nativeFailure) => this.fail(slot, workerTaskUnavailableError(slot, String(error), error), nativeFailure),
					refuse: (error) => this.finish(task, error, void 0, true)
				}), (error) => this.finish(task, toErrorObject(error, "worker task preparation failed")), !slot.worker && this.options.prepareWorker ? () => runInWorkerPoolContext(() => this.host.prepareResources()) : void 0);
			});
		}
	}
	createWorker(slot) {
		if ((this.options.idleTimeoutMs ?? 6e4) > 0) {
			const pressure = channel("openclaw.memory.critical");
			pressure.unsubscribe(this.retireIdleOnPressure);
			pressure.subscribe(this.retireIdleOnPressure);
		}
		return createWorkerTaskPoolWorker({
			slot,
			options: this.options,
			host: this.host,
			bootstrapError: this.bootstrap.error,
			runInContext: runInWorkerPoolContext,
			unavailableError: (message, cause) => workerTaskUnavailableError(slot, message, cause),
			onStarted: (worker) => {
				this.workers++;
				this.workersCreated++;
				this.host.workerStarted(worker, this);
			},
			onMessage: (message) => this.receive(slot, message),
			onFailure: (error, nativeFailure) => this.fail(slot, error, nativeFailure),
			onExit: (code, counted) => {
				if (counted) this.workers--;
				this.fail(slot, workerTaskUnavailableError(slot, `worker exited with code ${code}`), true);
			}
		});
	}
	receive(slot, message) {
		if (slot.retiring) return;
		const task = slot.task;
		if (task && isRecord(message) && (message.status === "request" || message.status === "consumed" || message.status === "notification")) {
			try {
				this.receiveExchange(slot, task, message);
			} catch (error) {
				this.fail(slot, toErrorObject(error, "worker consumption callback failed"));
			}
			return;
		}
		if (!task || !isRecord(message) || (task.options.onRequest || task.options.onRequestSync || message.taskId !== void 0) && message.taskId !== task.id || message.status !== "ok" && message.status !== "failed") {
			this.fail(slot, new WorkerTaskError("invalid worker task response", "unavailable"));
			return;
		}
		const reply = message;
		const retainInput = Boolean(task.exchange || task.options.onInputConsumed && !task.inputConsumed);
		if (reply.status === "failed") {
			this.finish(task, new WorkerTaskError(reply.error, "failed"), void 0, retainInput);
			return;
		}
		try {
			this.options.validateResult?.(reply.value);
		} catch (error) {
			this.fail(slot, toErrorObject(error, "worker result validation failed"));
			return;
		}
		this.finish(task, void 0, reply.value, retainInput);
	}
	receiveExchange(slot, task, message) {
		if (message.taskId !== task.id) {
			this.fail(slot, new WorkerTaskError("stale worker exchange", "unavailable"));
			return;
		}
		if (message.status === "notification") {
			task.options.onNotification?.(message.value);
			return;
		}
		if (message.status === "consumed") {
			if (message.id === 0 && !task.inputConsumed) {
				task.inputConsumed = true;
				const release = task.options.onInputConsumed;
				task.options.onInputConsumed = void 0;
				release?.();
			} else if (task.exchange?.sent && message.id === task.exchange.id) {
				const release = task.exchange.onConsumed;
				task.exchange = void 0;
				release?.();
			} else this.fail(slot, new WorkerTaskError("invalid worker consumption receipt", "unavailable"));
			return;
		}
		if (!task.options.onRequest && !task.options.onRequestSync || task.exchange || !Number.isSafeInteger(message.id) || message.id !== task.exchangeSequence + 1) {
			this.fail(slot, new WorkerTaskError("invalid worker exchange", "unavailable"));
			return;
		}
		if (task.options.hostTimeout === "owner") {
			clearTimeout(task.timer);
			task.deadline = void 0;
		}
		const exchange = createWorkerHostExchange(task, message.value);
		task.hostWaitStartedAt = performance.now();
		this.dispatch();
		this.computeCapacity?.requestCheckpoints();
		const accept = (response) => {
			if (!task.done && task.deadline !== void 0 && performance.now() >= task.deadline) this.timeout(task);
			if (task.done || slot.task !== task || slot.retiring) {
				const release = () => {
					try {
						task.runInContext(() => response.onConsumed?.());
					} catch {}
				};
				if (this.slots.has(slot)) (slot.completions ??= []).push(release);
				else release();
				return;
			}
			this.finishHostWait(task);
			exchange.onConsumed = response.onConsumed;
			exchange.sent = true;
			armWorkerTaskTimeout(task, response.timeoutMs, () => this.timeout(task));
			try {
				slot.worker.postMessage({
					taskId: task.id,
					responseId: exchange.id,
					input: response.input
				}, response.transferList);
			} catch (error) {
				this.fail(slot, toErrorObject(error, "worker response delivery failed"));
			}
		};
		const reject = (error) => {
			if (!task.done && slot.task === task) this.fail(slot, toErrorObject(error, "worker host exchange failed"));
		};
		dispatchOwnedWorkerRequest(task, slot, message.value, exchange, {
			accept,
			reject,
			closedError: () => new WorkerTaskError("worker task closed before host dispatch", "unavailable")
		});
	}
	timeout(task) {
		if (task.done) return;
		this.cancel(task, workerTaskTimeoutError(task.exchange, this.options.workerUrl));
	}
	cancel(task, error) {
		if (task.done) return;
		if (task.slot) {
			if (task.slot.worker) this.host.workerRetiring(task.slot.worker, "cancelled");
			if (task.owner) this.finish(task, error, void 0, true);
			else this.fail(task.slot, error);
		} else {
			this.queue.splice(this.queue.indexOf(task), 1);
			this.finish(task, error);
		}
	}
	fail(slot, error, nativeFailure) {
		if (slot.retiring) return;
		if (nativeFailure && slot.ready === false) this.bootstrap.fail(error);
		if (slot.worker) this.host.workerRetiring(slot.worker, "failure");
		if (slot.task?.owner) {
			if (slot.task.done) {
				if (!slot.task.owner.retire) closeOwnedWorkerTask(slot.task, this.ownedSettlement, true).catch(() => void 0);
			} else this.finish(slot.task, error, void 0, true);
		} else if (this.options.restartOnError === false) (this.publicDispatch?.close(error) ?? this.close(error)).catch(() => void 0);
		else if (slot.task) this.finish(slot.task, error, void 0, true);
		else this.retirement.retire(slot).catch(() => void 0);
	}
	finishHostWait(task) {
		const startedAt = task.hostWaitStartedAt;
		if (startedAt !== void 0) {
			task.hostWaitStartedAt = void 0;
			task.hostWaitMs += performance.now() - startedAt;
		}
	}
	finish(task, error, value, retire = false) {
		if (task.done) return;
		this.finishHostWait(task);
		task.done = true;
		task.observation?.completed();
		task.observation = void 0;
		task.runInContext(() => task.controller?.abort(error));
		clearTimeout(task.timer);
		task.deadline = void 0;
		task.options.signal?.removeEventListener("abort", task.abort);
		const complete = createWorkerTaskCompletion(task, this.completion, error, value);
		if (task.owner) {
			task.owner.complete = complete;
			task.owner.retire ||= retire || Boolean(error && task.slot && task.preparedAt !== void 0);
			if (error) task.reject(error);
			else task.resolve(value);
			if (error || retire) closeOwnedWorkerTask(task, this.ownedSettlement).catch(() => void 0);
			return;
		}
		const slot = task.slot;
		if (slot) {
			slot.task = void 0;
			this.activeTasks--;
			if (retire) {
				(slot.completions ??= []).push(complete);
				this.retirement.retire(slot, "failure").catch((failure) => {
					task.reject(error ? new AggregateError([error, failure], `Worker retirement failed: ${toErrorObject(failure, "worker retirement failed").message}; task failed: ${error.message}`, { cause: failure }) : failure);
				});
				return;
			}
		}
		complete();
		this.dispatch();
		if (slot && !slot.task && !slot.retiring) this.idle(slot);
	}
	releaseAdmission(task) {
		if (task.admitted) {
			task.admitted = false;
			this.pendingTasks--;
			this.pendingBytes -= task.inputBytes;
			this.computeCapacity?.finish(task.inputBytes);
		}
	}
	idle(slot) {
		if (slot.worker && !this.resourceClosures.get(slot.worker)?.pending) slot.worker.unref();
		this.retirement.idle(slot);
	}
};
//#endregion
//#region src/infra/worker-pool-sizing.ts
function resolveWorkerComputeLimit() {
	return Math.max(1, availableParallelism() - 1);
}
/** Size once at pool creation; serial owners must never inherit host CPU fanout. */
function resolveWorkerPoolSize(kind) {
	return Math.min(kind === "reader" || kind === "file-reader" ? 2 : kind === "compute" ? 4 : 1, resolveWorkerComputeLimit());
}
function resolveStateReadWorkerCount() {
	return Math.max(2, resolveWorkerPoolSize("reader"));
}
function resolveSqliteBrokerWorkerCount() {
	return 2;
}
resolveWorkerPoolSize("reader");
//#endregion
//#region src/infra/worker-task-capacity.ts
/** All runtime chunks share the same host-owned computation budget. */
function getWorkerComputeCapacity() {
	return resolveGlobalSingleton(Symbol.for("openclaw.workerComputeCapacity"), () => createWorkerComputeCapacity(resolveWorkerComputeLimit()));
}
//#endregion
//#region src/shared/lazy-runtime.ts
function createLazyRuntimeSurface(importer, select) {
	const loader = createLazyPromiseLoader(() => importer().then(select), { cacheRejections: true });
	return Object.assign(loader.load, {
		peek: loader.peek,
		clear: loader.clear
	});
}
/** Cache the raw dynamically imported runtime module behind a stable loader. */
function createLazyRuntimeModule(importer) {
	return createLazyRuntimeSurface(importer, (module) => module);
}
//#endregion
//#region src/shared/store-writer-queue.ts
const MAX_WRITERS_PER_TURN = 4;
const WRITER_TURN_BUDGET_MS = 4;
const activeStoreWriters = resolveGlobalSingleton(Symbol.for("openclaw.activeStoreWriters"), () => new AsyncLocalStorage());
const writerTurn = resolveGlobalSingleton(Symbol.for("openclaw.storeWriterTurn"), () => ({
	started: 0,
	startedAt: 0,
	reset: void 0,
	wait: void 0
}));
function claimStoreWriterTurn(immediate) {
	const now = performance$1.now();
	if (!writerTurn.reset) {
		writerTurn.started = 0;
		writerTurn.startedAt = now;
		writerTurn.reset = setImmediate$1().then(() => {
			writerTurn.reset = void 0;
		});
	}
	if (!immediate && (writerTurn.wait || writerTurn.started >= MAX_WRITERS_PER_TURN || now - writerTurn.startedAt >= WRITER_TURN_BUDGET_MS)) return writerTurn.wait ??= setImmediate$1().then(() => {
		writerTurn.wait = void 0;
	});
	writerTurn.started++;
}
function isActiveStoreWriter(queues, storePath, keys) {
	if (!queues.has(storePath)) return false;
	let active = activeStoreWriters.getStore();
	while (active) {
		if (active.active && active.queues === queues && active.storePath === storePath) {
			const heldKeys = active.keys;
			if (heldKeys && (!keys || [...keys].some((key) => !heldKeys.has(key)))) throw new Error("Cannot expand an active store writer's keys");
			return true;
		}
		active = active.parent;
	}
	return false;
}
async function runActiveStoreWriter(queues, storePath, fn, timing, keys) {
	const writer = {
		active: true,
		parent: activeStoreWriters.getStore(),
		queues,
		storePath,
		keys
	};
	if (timing) {
		timing.reentrant = false;
		timing.startedAt = performance$1.now();
	}
	try {
		return await activeStoreWriters.run(writer, fn);
	} finally {
		if (timing) timing.finishedAt = performance$1.now();
		writer.active = false;
	}
}
async function drainStoreWriterQueue(queues, storePath) {
	const queue = queues.get(storePath);
	if (!queue || queue.drainPromise) return;
	const drain = createDeferredCore();
	queue.drainPromise = drain.promise;
	const heldKeys = /* @__PURE__ */ new Set();
	let active = 0;
	let changed = createDeferredCore();
	queue.wake = () => changed.resolve();
	let first = true;
	try {
		while (queue.pending.length > 0 || active > 0) {
			const blocked = /* @__PURE__ */ new Set();
			let task;
			for (const pending of queue.pending) {
				const keys = pending.keys;
				if (!keys) {
					if (active === 0 && blocked.size === 0) task = pending;
					break;
				}
				if (![...keys].some((key) => heldKeys.has(key) || blocked.has(key))) {
					task = pending;
					break;
				}
				for (const key of keys) blocked.add(key);
			}
			if (!task) {
				await changed.promise;
				changed = createDeferredCore();
				continue;
			}
			let wait;
			while (wait = claimStoreWriterTurn(first)) await wait;
			first = false;
			const index = queue.pending.indexOf(task);
			if (index < 0) continue;
			queue.pending.splice(index, 1);
			if (!task.keys) {
				await task.fn().then(task.resolve, task.reject);
				continue;
			}
			const keys = task.keys;
			for (const key of keys) heldKeys.add(key);
			active++;
			const finish = () => {
				for (const key of keys) heldKeys.delete(key);
				active--;
				queue.wake?.();
			};
			task.fn().then((value) => {
				finish();
				task.resolve(value);
			}, (error) => {
				finish();
				task.reject(error);
			});
		}
	} finally {
		queue.drainPromise = null;
		queue.wake = void 0;
		queues.delete(storePath);
		drain.resolve();
	}
}
async function runQueuedStoreWrite(params) {
	if (!params.storePath || typeof params.storePath !== "string") throw new Error(`${params.label}: storePath must be a non-empty string, got ${JSON.stringify(params.storePath)}`);
	params.signal?.throwIfAborted();
	const keys = params.keys?.length ? new Set(params.keys) : void 0;
	if (params.reentrant === true && isActiveStoreWriter(params.queues, params.storePath, keys)) {
		if (params.timing) {
			params.timing.reentrant = true;
			params.timing.startedAt = performance$1.now();
		}
		try {
			return await params.fn();
		} finally {
			if (params.timing) params.timing.finishedAt = performance$1.now();
		}
	}
	const runInAsyncContext = AsyncLocalStorage.snapshot();
	let existingQueue = params.queues.get(params.storePath);
	if (!existingQueue) {
		existingQueue = {
			pending: [],
			drainPromise: null
		};
		params.queues.set(params.storePath, existingQueue);
	}
	const queue = existingQueue;
	let detach = () => {};
	const completion = new Promise((resolve, reject) => {
		detach = () => params.signal?.removeEventListener("abort", abort);
		const abort = () => {
			const index = queue.pending.indexOf(task);
			if (index !== -1) {
				queue.pending.splice(index, 1);
				task.reject(params.signal?.reason);
				queue.wake?.();
			}
		};
		const task = {
			keys,
			fn: async () => {
				detach();
				return await runInAsyncContext(runActiveStoreWriter, params.queues, params.storePath, params.fn, params.timing, keys);
			},
			resolve: (value) => resolve(value),
			reject
		};
		queue.pending.push(task);
		queue.wake?.();
		params.signal?.addEventListener("abort", abort, { once: true });
		runInDetachedAsyncContext(() => void drainStoreWriterQueue(params.queues, params.storePath));
	});
	if (params.signal) completion.then(detach, detach);
	return await completion;
}
//#endregion
//#region src/state/openclaw-agent-write-admission-state.ts
const agentDatabaseWriteAdmissionState = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseWriteAdmission"), () => ({ queues: /* @__PURE__ */ new Map() }));
agentDatabaseWriteAdmissionState.queues;
//#endregion
//#region src/infra/worker-task-pool-registry.ts
const livePools = resolveGlobalSingleton(Symbol.for("openclaw.workerTaskPools"), () => /* @__PURE__ */ new Set());
const liveWorkerTaskPools = {
	register(pool) {
		livePools.add(pool);
		return pool;
	},
	async close(pool, closures, finish) {
		await joinOwnedWorkerTasks(closures);
		await finish();
		livePools.delete(pool);
	}
};
//#endregion
//#region src/infra/worker-task-host.ts
const diagnosticTaskKinds = /* @__PURE__ */ new Set([
	"prepare",
	"prepare-session",
	"transcript-stats",
	"session-entry",
	"session-entries",
	"session-cleanup",
	"session-memory-capture",
	"history-page",
	"historical-eviction-candidates",
	"usage-cost",
	"model-context",
	"context-messages",
	"transcript-search"
]);
const prepareResources = createLazyRuntimeModule(() => import("./openclaw-state-read-temp-artifact-cleanup-Bx8Zl4sX.mjs"));
const admissions = resolveGlobalSingleton(Symbol.for("openclaw.workerTaskDatabaseAdmissionChannels"), () => /* @__PURE__ */ new Map());
function createWorkerTaskHost(owner = {}, workerClass) {
	const boundedHeap = workerClass && workerClass !== "writer" && workerClass !== "singleton";
	const source = owner.retainedTransport ? owner.nativeSource ?? captureRetainedNativeWorkerSource({ runtimeGeneration: void 0 }) : void 0;
	return {
		maxWorkers: workerClass ? resolveWorkerPoolSize(workerClass) : void 0,
		requiresReady: owner.retainedTransport,
		createWorker(url, options) {
			const workerOptions = {
				execArgv: resolveRuntimeWorkerThreadExecArgv(url),
				...options
			};
			if (boundedHeap) {
				const limits = workerOptions.resourceLimits;
				workerOptions.resourceLimits = {
					maxOldGenerationSizeMb: limits?.maxOldGenerationSizeMb ?? 512,
					maxYoungGenerationSizeMb: limits?.maxYoungGenerationSizeMb,
					codeRangeSizeMb: limits?.codeRangeSizeMb,
					stackSizeMb: limits?.stackSizeMb
				};
			}
			if (owner.retainedTransport) {
				const { port1, port2 } = new MessageChannel();
				const native = createRetainedNativeWorker(url, workerOptions, source, owner.nativeResource, {
					host: port1,
					worker: port2
				});
				return {
					worker: native,
					native
				};
			}
			return { worker: createCpuTrackedWorker(url, workerOptions) };
		},
		serviceNativeWorkers(workers) {
			for (const { owner: admission } of admissions.values()) admission.service();
			workers[0]?.service();
		},
		prepareResources,
		async releaseTemporaryDirectory(directory) {
			const { removeTemporaryArtifacts } = await prepareResources();
			await removeTemporaryArtifacts(directory, "Worker task");
		},
		captureTaskContext(worker) {
			let admission = admissions.get(worker);
			if (!admission) {
				admission = {
					owner: runInDetachedAsyncContext(() => createSqliteDatabaseAdmissionRelay(() => {
						if (admissions.get(worker)?.retiring !== false) throw new Error("SQLite creation relay's task worker is retiring");
					})),
					sent: false,
					retiring: false
				};
				admissions.set(worker, admission);
				const retained = admission;
				worker.once("exit", () => {
					retained.owner.finish();
					admissions.delete(worker);
				});
			}
			const context = {
				deletedAgentDatabaseFences: captureDeletedAgentDatabaseFences(),
				...!admission.sent ? { databaseAdmissionPort: admission.owner.port } : {}
			};
			admission.sent = true;
			return context;
		},
		taskContextTransferList(context) {
			const captured = context;
			return captured.databaseAdmissionPort ? [captured.databaseAdmissionPort] : [];
		},
		createTaskObserver(url) {
			const kind = workerRequestKind(url);
			return (operation) => trackWorkerRequest(kind, operation === void 0 ? "task" : classifyWorkerRequest(operation));
		},
		describeTask(url, input) {
			const kind = input !== null && typeof input === "object" ? Object.getOwnPropertyDescriptor(input, "kind")?.value : void 0;
			const operation = typeof kind === "string" && diagnosticTaskKinds.has(kind) ? kind : "task";
			return `${workerRequestKind(url)}.${operation}`;
		},
		receiveMessage: receiveWorkerMemoryPort,
		observeResourceReply: () => recordWorkerMessage("resource", "from_worker"),
		workerStarted(worker, pool) {
			if (owner.databaseAccess !== "read-only") trackSqliteDatabaseAdmissionWorker(worker);
			attributeWorkerToPool(worker, pool);
		},
		workerRetiring(worker, reason) {
			const admission = admissions.get(worker);
			if (admission) admission.retiring = true;
			markWorkerRetirement(worker, reason);
		},
		computeCapacity: getWorkerComputeCapacity(),
		pools: liveWorkerTaskPools
	};
}
//#endregion
//#region src/infra/worker-task-pool.ts
/** Existing SDK surface; task custody remains an internal capability. */
var WorkerTaskPool = class {
	constructor(options) {
		this.core = new WorkerTaskPoolCore(options, createWorkerTaskHost(void 0, options.workerClass), {
			close: (error) => this.close(error),
			getSnapshot: () => this.getSnapshot()
		});
	}
	run(input, options) {
		return this.core.run(input, options);
	}
	get isClosed() {
		return this.core.isClosed;
	}
	getSnapshot() {
		return this.core.getSnapshot();
	}
	retryFailedRetirements() {
		return this.core.retryFailedRetirements();
	}
	rotate() {
		return this.core.rotate();
	}
	close(error) {
		return this.core.close(error);
	}
};
/** Internal resource owners can retain task custody or use settled ordinary reads. */
function createOwnedWorkerTaskPool(options, ownerOptions) {
	const core = new WorkerTaskPoolCore(options, createWorkerTaskHost(ownerOptions, options.workerClass), void 0, ownerOptions);
	return {
		run: (input, taskOptions) => core.run(input, taskOptions),
		rotate: () => core.rotate(),
		runTask: (input, taskOptions) => core.runTask(input, taskOptions),
		startTask: (input, taskOptions) => core.startTask(input, taskOptions),
		closeResources: (key) => core.startCloseResources(key).result,
		startCloseResources: (key) => core.startCloseResources(key),
		startRotate: () => core.startRotate(),
		getSnapshot: () => core.getSnapshot(),
		close: (error) => core.close(error)
	};
}
//#endregion
export { normalizeUniqueTrimmedStringList as A, registerAgentDatabaseReaderCloser as C, normalizeSortedUniqueTrimmedStringList as D, withWorkerTaskNativeSectionScope as E, normalizeTrimmedStringList as O, matchesAgentDatabaseReadCandidatePath as S, observeWorkerTaskCancellation as T, mapRetainedOperation as _, createLazyRuntimeModule as a, installDeletedAgentDatabaseFences as b, WorkerTaskError as c, classifyWorkerRequest as d, trackWorkerRequest as f, flatMapRetainedOperation as g, finallyRetainedOperation as h, runQueuedStoreWrite as i, uniqueStrings as j, normalizeUniqueSingleOrTrimmedStringList as k, DEFAULT_WORKER_PENDING_BYTES as l, createRetainedOperation as m, createOwnedWorkerTaskPool as n, resolveSqliteBrokerWorkerCount as o, withSqliteWorkerReservationObservation as p, agentDatabaseWriteAdmissionState as r, resolveStateReadWorkerCount as s, WorkerTaskPool as t, captureRetainedNativeWorkerSource as u, applyAgentDatabaseReaderRequest as v, createWorkerTaskControl as w, isDeletedAgentDatabasePath as x, decodeAgentDatabaseReaderRequest as y };
