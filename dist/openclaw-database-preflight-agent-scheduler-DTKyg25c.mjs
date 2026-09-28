import { d as toStringifiedError } from "./error-coercion-C787aVxk.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { Et as _enum, Fn as object, Jn as string, Pn as number, Yt as discriminatedUnion, xn as literal } from "./schemas-BOYIvvln.mjs";
import { t as resolveRuntimeWorkerArgv } from "./runtime-worker-url-B4o9tqvO.mjs";
import { a as readSqliteInspectionBudget, c as resolveSqliteInspectionSignal, d as sqliteInspectionTimeoutError, f as withSqliteReadOnlyWorkerScope, i as isSqliteInspectionDeadlineOwnedByCaller } from "./sqlite-readonly-worker-CmkAsqCm.mjs";
import { n as readSqliteIntegrityFileIdentity } from "./sqlite-file-generation-bF3ZcoQs.mjs";
import { t as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-q9v1M311.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import { n as restoreAgentSchemaInspectionError, t as agentSchemaInspectionErrorSchema } from "./openclaw-agent-schema-inspection-response-q57qjoFT.mjs";
import { fork } from "node:child_process";
import { availableParallelism } from "node:os";
//#region src/state/openclaw-agent-schema-inspection-worker.ts
const inspectionResponse = discriminatedUnion("ok", [object({
	requestId: number().int().safe(),
	ok: literal(false),
	error: agentSchemaInspectionErrorSchema
}), object({
	requestId: number().int().safe(),
	ok: literal(true),
	inspection: object({
		version: number().int().safe(),
		integrityGateOutcome: _enum(["cached", "healthy"]).optional(),
		writerAppVersion: string().optional(),
		reason: string().optional(),
		failure: agentSchemaInspectionErrorSchema.optional(),
		agentSchemaMeta: object({
			agentId: string().nullable(),
			role: string().nullable(),
			schemaVersion: number().nullable()
		}).nullable().optional()
	}).nullable()
})]);
function retireReader(reader) {
	if (reader.retired) return;
	reader.retired = true;
	if (reader.child.connected) reader.child.send({ type: "close" }, (error) => {
		if (error) reader.child.kill("SIGKILL");
	});
}
/** One scheduler slot reuses imports and canonical schema contracts, never database reads. */
function createAgentSchemaInspectionWorker() {
	let reader;
	let disposed = false;
	let busy = false;
	let processCount = 0;
	let inspectionCount = 0;
	let snapshotCount = 0;
	let sequence = 0;
	const startReader = (timeoutMs) => {
		const entry = resolveRuntimeProcessEntrypointUrl("agentSchemaInspection");
		const child = fork(entry, [], {
			execArgv: resolveRuntimeWorkerArgv(entry).slice(0, -1),
			serialization: "advanced",
			stdio: [
				"ignore",
				"ignore",
				"ignore",
				"ipc"
			]
		});
		processCount += 1;
		const closed = createDeferredCore();
		const started = {
			child,
			closed: closed.promise,
			retired: false,
			closeBudgetMs: timeoutMs
		};
		child.on("error", (error) => {
			started.failure ??= error;
			retireReader(started);
		});
		child.once("close", () => {
			started.retired = true;
			closed.resolve();
		});
		return started;
	};
	return {
		get processCount() {
			return processCount;
		},
		get inspectionCount() {
			return inspectionCount;
		},
		get snapshotCount() {
			return snapshotCount;
		},
		inspect: async (input, callerSignal, snapshotPath) => {
			const signal = resolveSqliteInspectionSignal(callerSignal);
			signal?.throwIfAborted();
			if (disposed || busy) throw new Error(disposed ? "Agent schema inspection worker is closed" : "Agent schema inspection worker is busy");
			busy = true;
			try {
				if (reader?.retired) {
					await reader.closed;
					reader = void 0;
				}
				signal?.throwIfAborted();
				if (disposed) throw new Error("Agent schema inspection worker is closed");
				const { timeoutMs, size } = readSqliteInspectionBudget(input.requireStartupMigrationReadiness ? "startup readiness" : "schema inspection", input.pathname);
				const active = reader ??= startReader(timeoutMs);
				active.closeBudgetMs = timeoutMs;
				const snapshot = snapshotPath ? {
					pathname: snapshotPath,
					identity: readSqliteIntegrityFileIdentity(snapshotPath)
				} : void 0;
				const requestId = ++sequence;
				const response = createDeferredCore();
				let failure;
				const kill = () => {
					active.retired = true;
					active.child.kill("SIGKILL");
				};
				const onAbort = () => {
					failure = toStringifiedError(signal?.reason);
					kill();
				};
				const onMessage = (message) => {
					if (failure) return;
					const parsed = inspectionResponse.safeParse(message);
					if (!parsed.success || parsed.data.requestId !== requestId) {
						failure = /* @__PURE__ */ new Error("Invalid agent schema inspection response");
						kill();
					} else if (!parsed.data.ok) {
						failure = restoreAgentSchemaInspectionError(parsed.data.error);
						retireReader(active);
					} else {
						const inspection = parsed.data.inspection;
						response.resolve(inspection ? {
							...inspection,
							failure: inspection.failure ? restoreAgentSchemaInspectionError(inspection.failure) : void 0
						} : null);
					}
				};
				const onClose = (code, exitSignal) => {
					response.reject(signal?.aborted ? toStringifiedError(signal.reason) : failure ?? active.failure ?? (exitSignal === "SIGKILL" ? sqliteInspectionTimeoutError("schema inspection", input.pathname, timeoutMs, size) : /* @__PURE__ */ new Error(`Agent schema inspection exited ${code} without a completed result`)));
				};
				const timeout = isSqliteInspectionDeadlineOwnedByCaller() ? void 0 : setTimeout(() => {
					failure ??= sqliteInspectionTimeoutError("schema inspection", input.pathname, timeoutMs, size);
					kill();
				}, timeoutMs);
				timeout?.unref();
				active.child.on("message", onMessage);
				active.child.once("close", onClose);
				signal?.addEventListener("abort", onAbort, { once: true });
				try {
					active.child.send({
						type: "inspect",
						requestId,
						input,
						snapshot
					}, (error) => {
						if (error) {
							failure ??= error;
							kill();
						}
					});
					const result = await response.promise;
					if (signal?.aborted) {
						kill();
						await active.closed;
						throw toStringifiedError(signal.reason);
					}
					if (snapshot) readSqliteIntegrityFileIdentity(snapshot.pathname, snapshot.identity);
					if (result) {
						inspectionCount += 1;
						snapshotCount += snapshot ? 1 : 0;
					}
					return result;
				} finally {
					clearTimeout(timeout);
					active.child.off("message", onMessage);
					active.child.off("close", onClose);
					signal?.removeEventListener("abort", onAbort);
				}
			} finally {
				busy = false;
			}
		},
		async [Symbol.asyncDispose]() {
			disposed = true;
			if (!reader) return;
			const closing = reader;
			const timeout = setTimeout(() => closing.child.kill("SIGKILL"), closing.closeBudgetMs);
			timeout.unref();
			try {
				retireReader(closing);
				await closing.closed;
			} finally {
				clearTimeout(timeout);
			}
		}
	};
}
async function preflightAgentDatabasesBounded(targets, inspect, result, signal, startup) {
	const inspectedAgentPaths = /* @__PURE__ */ new Set();
	const inspectedAgentTargets = /* @__PURE__ */ new Set();
	const claimAgentTarget = (realPath, agentId) => {
		const inspectionKey = `${realPath}\0${agentId ?? ""}`;
		if (inspectedAgentTargets.has(inspectionKey) || agentId === void 0 && inspectedAgentPaths.has(realPath)) return false;
		inspectedAgentPaths.add(realPath);
		inspectedAgentTargets.add(inspectionKey);
		return true;
	};
	const inspections = [];
	const failures = /* @__PURE__ */ new Map();
	let nextInspectionIndex = 0;
	const readers = [];
	const foreground = createDeferredCore();
	const completions = targets.map(() => createDeferredCore());
	for (const completion of completions) completion.promise.catch(() => {});
	const deferred = /* @__PURE__ */ new Set();
	const active = /* @__PURE__ */ new Set();
	const concurrency = Math.min(2, availableParallelism(), targets.length);
	let deferredReason = "";
	let deferredRefusals = [];
	const inspectionSignal = startup ? signal ? AbortSignal.any([startup.signal, signal]) : startup.signal : resolveSqliteInspectionSignal(signal);
	const deadlineOwnedByCaller = startup !== void 0 || isSqliteInspectionDeadlineOwnedByCaller();
	const settleForeground = () => {
		if (!startup || deferred.size === 0 || deferredRefusals.length > 0 || failures.size > 0) return;
		if (active.size === concurrency && [...active].every((index) => deferred.has(index))) for (let index = nextInspectionIndex; index < targets.length; index += 1) deferred.add(index);
		if (targets.some((_, index) => inspections[index] === void 0 && !deferred.has(index))) return;
		try {
			deferredRefusals = startup.defer([...deferred].map((index) => ({
				target: targets[index],
				result: completions[index].promise
			})), deferredReason);
			foreground.resolve();
		} catch (error) {
			foreground.reject(error);
		}
	};
	const worker = async () => {
		try {
			var _usingCtx$1 = _usingCtx();
			const reader = _usingCtx$1.a(createAgentSchemaInspectionWorker());
			readers.push(reader);
			while (true) {
				if (inspectionSignal?.aborted || failures.size > 0) return;
				const index = nextInspectionIndex;
				if (index >= targets.length) return;
				nextInspectionIndex += 1;
				const target = targets[index];
				if (target === void 0) continue;
				const inspection = {
					incompatible: [],
					indeterminate: []
				};
				active.add(index);
				let timer;
				if (startup && !deferred.has(index)) {
					const pathname = startup.path(target);
					const { timeoutMs, size } = readSqliteInspectionBudget("startup readiness", pathname);
					timer = setTimeout(() => {
						if (failures.size > 0 || inspectionSignal?.aborted) return;
						deferred.add(index);
						deferredReason ||= `The ${size} database at ${pathname} exceeded its ${timeoutMs / 1e3} second startup wait; inspection continues.`;
						settleForeground();
					}, timeoutMs);
					timer.unref();
				}
				try {
					await inspect(target, inspection, claimAgentTarget, (input, requestSignal, snapshot) => reader.inspect(input, inspectionSignal ?? requestSignal, snapshot));
					inspections[index] = inspection;
					completions[index].resolve(inspection);
				} catch (error) {
					failures.set(index, error);
					completions[index].reject(error);
					return;
				} finally {
					clearTimeout(timer);
					active.delete(index);
					settleForeground();
				}
			}
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			await _usingCtx$1.d();
		}
	};
	const completed = Promise.all(Array.from({ length: concurrency }, () => withSqliteReadOnlyWorkerScope(worker, {
		signal: inspectionSignal ?? new AbortController().signal,
		deadlineOwnedByCaller
	}))).finally(() => {
		for (let index = 0; index < targets.length; index += 1) if (inspections[index] === void 0) completions[index].reject(inspectionSignal?.reason ?? failures.values().next().value ?? /* @__PURE__ */ new Error("Inspection cancelled"));
	});
	startup?.track(completed);
	await (startup ? Promise.race([completed, foreground.promise]) : completed);
	for (let index = 0; index < targets.length; index += 1) if (failures.has(index) && (!deferred.has(index) || deferredRefusals.length === 0)) throw failures.get(index);
	inspectionSignal?.throwIfAborted();
	for (const [index, inspection] of inspections.entries()) {
		if (inspection === void 0 || deferred.has(index)) continue;
		result.incompatible.push(...inspection.incompatible);
		result.indeterminate.push(...inspection.indeterminate);
		if (inspection.agentRefusals?.length) (result.agentRefusals ??= []).push(...inspection.agentRefusals);
		if (inspection.pendingMigrations?.length) (result.pendingMigrations ??= []).push(...inspection.pendingMigrations);
	}
	if (deferredRefusals.length) (result.agentRefusals ??= []).push(...deferredRefusals);
	return {
		schemaProcessCount: readers.reduce((count, reader) => count + reader.processCount, 0),
		schemaInspectionCount: readers.reduce((count, reader) => count + reader.inspectionCount, 0),
		schemaSnapshotCount: readers.reduce((count, reader) => count + reader.snapshotCount, 0)
	};
}
//#endregion
export { preflightAgentDatabasesBounded as t };
