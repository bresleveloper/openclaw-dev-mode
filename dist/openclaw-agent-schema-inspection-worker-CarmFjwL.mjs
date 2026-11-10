import { f as toStringifiedError } from "./error-coercion-BwMr25F8.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as resolveRuntimeWorkerArgv } from "./runtime-worker-url-CvMrvFI1.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-BCfqgqXF.mjs";
import { S as readSqliteDatabaseCleanClose, s as getOrLoadSqliteDatabaseAdmissionForPath, v as prepareSqliteDatabaseAdmission } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { t as OPENCLAW_AGENT_SCHEMA_SQL } from "./openclaw-agent-schema-BKBD8edk.mjs";
import { r as readSqliteIntegrityFileIdentity } from "./sqlite-file-generation-Cmk6kG35.mjs";
import { a as readSqliteInspectionBudget, c as resolveSqliteInspectionSignal, g as sqliteInspectionTimeoutError, i as isSqliteInspectionDeadlineOwnedByCaller } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { t as agentSchemaMetadataKey } from "./openclaw-agent-db-metadata-90thy9YD.mjs";
import { l as getCanonicalSqliteTableNames } from "./sqlite-schema-contract-C7_zBR7q.mjs";
import { t as agentDatabaseValidationKey } from "./openclaw-agent-db-validation-facts-BQcDbrLo.mjs";
import { t as restoreAgentSchemaInspectionError } from "./openclaw-agent-schema-inspection-response-DlRM0OA1.mjs";
import { fork } from "node:child_process";
//#region src/state/openclaw-agent-schema-inspection-worker.ts
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
	const operations = { inspect: async (request, callerSignal, snapshotPath) => {
		const { input, kind } = request;
		const signal = resolveSqliteInspectionSignal(callerSignal);
		signal?.throwIfAborted();
		if (disposed || busy) throw new Error(disposed ? "Agent schema inspection worker is closed" : "Agent schema inspection worker is busy");
		busy = true;
		try {
			if (kind !== "state" && !snapshotPath && input.requireStartupMigrationReadiness && readSqliteDatabaseCleanClose(input.pathname)) {
				const validation = getOrLoadSqliteDatabaseAdmissionForPath(input.pathname, agentDatabaseValidationKey, () => void 0);
				const metadata = getOrLoadSqliteDatabaseAdmissionForPath(input.pathname, agentSchemaMetadataKey, () => void 0);
				if (validation?.schema?.facts.userVersion === input.supportedVersion && Atomics.load(new Int32Array(validation.valid), 0) === 1 && Atomics.load(new Int32Array(validation.schema.valid), 0) === 1 && prepareSqliteDatabaseAdmission(input.pathname) === `${validation.identity}:${validation.birthtime}` && metadata?.agentId === validation.agentId && (input.agentId === void 0 || input.agentId === validation.agentId) && metadata.role === "agent" && metadata.schemaVersion === input.supportedVersion) return {
					version: input.supportedVersion,
					integrityGateOutcome: "cached",
					agentSchemaMeta: metadata
				};
			}
			if (kind === "agent" && input.requireStartupMigrationReadiness) getCanonicalSqliteTableNames(OPENCLAW_AGENT_SCHEMA_SQL);
			const snapshot = snapshotPath ? {
				pathname: snapshotPath,
				identity: readSqliteIntegrityFileIdentity(snapshotPath)
			} : void 0;
			if (reader?.retired) {
				await reader.closed;
				reader = void 0;
			}
			signal?.throwIfAborted();
			if (disposed) throw new Error("Agent schema inspection worker is closed");
			const { timeoutMs, size } = readSqliteInspectionBudget(input.requireStartupMigrationReadiness ? "startup readiness" : "schema inspection", input.pathname);
			const active = reader ??= startReader(timeoutMs);
			active.closeBudgetMs = timeoutMs;
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
				if (message.requestId !== requestId) {
					failure = /* @__PURE__ */ new Error("Invalid agent schema inspection response");
					kill();
				} else if (!message.ok) {
					failure = restoreAgentSchemaInspectionError(message.error);
					retireReader(active);
				} else {
					if (kind === "state") {
						const stateInspection = message.stateInspection;
						if (stateInspection === null) {
							response.resolve(null);
							return;
						}
						if (stateInspection === void 0) {
							failure = /* @__PURE__ */ new Error("Invalid state schema inspection response");
							kill();
							return;
						}
						response.resolve({
							...stateInspection,
							schemaContracts: message.schemaContracts,
							inspectionErrors: stateInspection.inspectionErrors.map(restoreAgentSchemaInspectionError)
						});
						return;
					}
					const inspection = message.inspection;
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
					type: kind === "state" ? "inspect-state" : "inspect",
					requestId,
					input: {
						...input,
						..."env" in input && input.env ? { env: { ...input.env } } : {}
					},
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
	} };
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
			const result = await operations.inspect({
				kind: "agent",
				input
			}, callerSignal, snapshotPath);
			if (result && "schemas" in result) throw new Error("Unexpected state schema inspection result");
			return result;
		},
		inspectState: async (input, callerSignal, snapshotPath) => {
			const result = await operations.inspect({
				kind: "state",
				input
			}, callerSignal, snapshotPath);
			if (result && !("schemas" in result)) throw new Error("Unexpected agent schema inspection result");
			return result;
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
//#endregion
export { createAgentSchemaInspectionWorker as t };
