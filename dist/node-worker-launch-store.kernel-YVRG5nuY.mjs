import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-5Wa9sNMr.mjs";
import { tt as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-dG8swyHC.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { i as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-CG5jL3tH.mjs";
//#region src/node-host/node-worker-launch-receipt.ts
function isNodeWorkerTerminalState(value) {
	return value === "completed" || value === "failed" || value === "interrupted" || value === "cancelled";
}
function validateNodeWorkerContainerIdentity(identity) {
	if (identity.engine !== "docker" && identity.engine !== "podman") throw new Error("node worker container engine must be docker or podman");
	if (!/^[a-f0-9]{64}$/u.test(identity.containerId)) throw new Error("node worker container id must contain exactly 64 lowercase hexadecimal digits");
	if (!/^[a-f0-9]{64}$/u.test(identity.engineTarget)) throw new Error("node worker container engine target must contain exactly 64 lowercase hexadecimal digits");
}
function containerIdentity(value) {
	if (value == null) return null;
	let parsed;
	try {
		parsed = JSON.parse(value);
	} catch {
		throw new Error("invalid node worker container identity");
	}
	if (!isRecord(parsed) || Object.keys(parsed).length !== 3 || parsed.engine !== "docker" && parsed.engine !== "podman" || typeof parsed.containerId !== "string" || typeof parsed.engineTarget !== "string") throw new Error("invalid node worker container identity");
	const identity = {
		engine: parsed.engine,
		containerId: parsed.containerId,
		engineTarget: parsed.engineTarget
	};
	validateNodeWorkerContainerIdentity(identity);
	return identity;
}
function nodeWorkerLaunchReceiptFromRow(row) {
	if (row.state !== "pending" && row.state !== "running" && !isNodeWorkerTerminalState(row.state)) throw new Error(`invalid node worker launch state ${row.state}`);
	const container = containerIdentity(row.container_json);
	const cleanupMode = row.cleanup_mode ?? null;
	if (cleanupMode !== null && cleanupMode !== "process-group" && cleanupMode !== "owned-anchor") throw new Error("invalid node worker cleanup mode");
	return {
		launchId: row.launch_id,
		planHash: row.plan_hash,
		gatewayNamespace: row.gateway_namespace,
		environmentId: row.environment_id,
		sessionId: row.session_id,
		ownerEpoch: row.owner_epoch,
		placementGeneration: row.placement_generation,
		runId: row.run_id,
		state: row.state,
		supervisor: {
			pid: row.supervisor_pid,
			startTime: row.supervisor_start_time
		},
		worker: row.worker_pid === null || row.worker_start_time === null ? null : {
			pid: row.worker_pid,
			startTime: row.worker_start_time
		},
		workerCleanupMode: cleanupMode,
		workerLineageSettled: row.lineage_settled === 1,
		...container ? { container } : {},
		resultJson: row.result_json,
		errorText: row.error_text,
		completedAtMs: row.completed_at_ms,
		createdAtMs: row.created_at_ms,
		updatedAtMs: row.updated_at_ms
	};
}
//#endregion
//#region src/node-host/node-worker-launch-store.kernel.ts
const NODE_WORKER_LAUNCH_SCHEMA_END = "\n  WHERE completed_at_ms IS NOT NULL;";
const initializedDatabases = /* @__PURE__ */ new WeakSet();
const TERMINAL_RECEIPT_RETENTION_MS = 864e5;
const TERMINAL_PRUNE_BATCH_LIMIT = 256;
function ensureNodeWorkerLaunchSchema(database, table) {
	database.exec(extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, table, { endMarker: table === "node_worker_launches" ? NODE_WORKER_LAUNCH_SCHEMA_END : void 0 }));
}
function query(database) {
	return getNodeSqliteKysely(database);
}
function selectLaunchRows(database) {
	return query(database).selectFrom("node_worker_launches").selectAll("node_worker_launches").$if(tableExists(database, "node_worker_launch_containers"), (selection) => selection.leftJoin("node_worker_launch_containers", "node_worker_launch_containers.launch_id", "node_worker_launches.launch_id").select("node_worker_launch_containers.container_json")).$if(tableExists(database, "node_worker_launch_cleanup"), (selection) => selection.leftJoin("node_worker_launch_cleanup", "node_worker_launch_cleanup.launch_id", "node_worker_launches.launch_id").select(["node_worker_launch_cleanup.cleanup_mode", "node_worker_launch_cleanup.lineage_settled"]));
}
function readRow(database, launchId) {
	return executeSqliteQueryTakeFirstSync(database, selectLaunchRows(database).where("node_worker_launches.launch_id", "=", launchId));
}
function readNonterminalCount(database) {
	return executeSqliteQueryTakeFirstSync(database, query(database).selectFrom("node_worker_launches").select((expression) => expression.fn.countAll().as("count")).where("state", "in", ["pending", "running"]))?.count ?? 0;
}
function readNonterminalRows(database) {
	return executeSqliteQuerySync(database, selectLaunchRows(database).where("node_worker_launches.state", "in", ["pending", "running"]).orderBy("node_worker_launches.launch_id", "asc")).rows;
}
function pruneTerminalRows(params) {
	let candidates = query(params.database).selectFrom("node_worker_launches").select("launch_id").where("state", "in", [
		"completed",
		"failed",
		"interrupted",
		"cancelled"
	]).where("completed_at_ms", "<=", params.cutoffMs).orderBy("completed_at_ms", "asc").orderBy("launch_id", "asc").limit(params.limit);
	if (params.excludeLaunchId) candidates = candidates.where("launch_id", "!=", params.excludeLaunchId);
	const launchIds = executeSqliteQuerySync(params.database, candidates).rows.map((row) => row.launch_id);
	if (launchIds.length === 0) return 0;
	if (tableExists(params.database, "node_worker_launch_containers")) executeSqliteQuerySync(params.database, query(params.database).deleteFrom("node_worker_launch_containers").where("launch_id", "in", launchIds));
	const result = executeSqliteQuerySync(params.database, query(params.database).deleteFrom("node_worker_launches").where("launch_id", "in", launchIds).where("state", "in", [
		"completed",
		"failed",
		"interrupted",
		"cancelled"
	]).where("completed_at_ms", "<=", params.cutoffMs));
	return Number(result.numAffectedRows ?? 0n);
}
/** Read the authoritative physical owner within an already-open journal transaction. */
function readNodeWorkerLaunchReceipt(database, launchId) {
	if (!tableExists(database, "node_worker_launches")) return;
	const row = readRow(database, launchId);
	return row ? nodeWorkerLaunchReceiptFromRow(row) : void 0;
}
/** Physical extinction closes unfinished turns, never a result already recorded by the worker. */
function settleNodeWorkerActiveTurns(database, owner) {
	if (owner.state === "pending" || owner.state === "running" || !tableExists(database, "node_worker_turns")) return;
	executeSqliteQuerySync(database, query(database).updateTable("node_worker_turns").set((expression) => {
		const completedAt = expression.fn("max", [
			"created_at_ms",
			"updated_at_ms",
			expression.val(owner.updatedAtMs)
		]);
		return {
			state: owner.state === "completed" ? "interrupted" : owner.state,
			result_json: null,
			error_text: owner.errorText ?? "node worker stopped before its turn completed",
			completed_at_ms: completedAt,
			updated_at_ms: completedAt
		};
	}).where("owner_launch_id", "=", owner.launchId).where("state", "=", "running"));
}
function validateIdentifier(value, label) {
	if (!value || value.trim() !== value || value.length > 256 || value.includes("\0")) throw new Error(`${label} must be a bounded non-empty identifier`);
}
function validatePlanHash(value) {
	if (!/^[a-f0-9]{64}$/u.test(value)) throw new Error("node worker plan hash must be 64 lowercase hexadecimal characters");
}
function validateTimestamp(value) {
	if (!Number.isSafeInteger(value) || value < 0) throw new Error("node worker launch timestamp must be a non-negative safe integer");
}
function validatePruneLimit(limit) {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 1e3) throw new Error("node worker launch prune limit must be between 1 and 1000");
}
function validateProcessIdentity(identity) {
	if (!Number.isSafeInteger(identity.pid) || identity.pid <= 0 || identity.pid > 2147483647 || !Number.isSafeInteger(identity.startTime) || identity.startTime < 0) throw new Error("node worker process identity must contain a bounded pid and start time");
}
function requireMatchingRow(database, launchId, planHash) {
	const row = readRow(database, launchId);
	if (!row) throw new Error(`node worker launch ${launchId} does not exist`);
	if (row.plan_hash !== planHash) throw new Error(`node worker launch ${launchId} was replayed with a different plan`);
	return row;
}
function rowHasSupervisor(row, identity) {
	return row.supervisor_pid === identity.pid && row.supervisor_start_time === identity.startTime;
}
function rowHasWorker(row, identity) {
	return identity === null ? row.worker_pid === null && row.worker_start_time === null : row.worker_pid === identity.pid && row.worker_start_time === identity.startTime;
}
function sameObservedOwner(current, observed) {
	return current.state === observed.state && current.supervisor_pid === observed.supervisor_pid && current.supervisor_start_time === observed.supervisor_start_time && current.worker_pid === observed.worker_pid && current.worker_start_time === observed.worker_start_time;
}
function rowMatchesImmutableIdentity(row, expected) {
	return row.launch_id === expected.launchId && row.plan_hash === expected.planHash && row.environment_id === expected.environmentId && row.session_id === expected.sessionId && row.owner_epoch === expected.ownerEpoch && row.placement_generation === expected.placementGeneration && row.run_id === expected.runId;
}
function finishOwnedRow(database, current, params, nowMs, expected) {
	if (isNodeWorkerTerminalState(current.state) || !rowHasSupervisor(current, params.supervisor) || !rowHasWorker(current, params.worker)) return;
	const completedAtMs = Math.max(nowMs, current.created_at_ms, current.updated_at_ms);
	let update = query(database).updateTable("node_worker_launches").set({
		state: params.state,
		result_json: params.state === "completed" ? params.resultJson ?? null : null,
		error_text: params.state === "completed" ? null : params.errorText ?? null,
		completed_at_ms: completedAtMs,
		updated_at_ms: completedAtMs
	}).where("launch_id", "=", current.launch_id).where("plan_hash", "=", current.plan_hash);
	if (expected) update = update.where("environment_id", "=", expected.environmentId).where("session_id", "=", expected.sessionId).where("owner_epoch", "=", expected.ownerEpoch).where("placement_generation", "=", expected.placementGeneration).where("run_id", "=", expected.runId);
	update = update.where("state", "in", ["pending", "running"]).where("supervisor_pid", "=", params.supervisor.pid).where("supervisor_start_time", "=", params.supervisor.startTime);
	update = params.worker ? update.where("worker_pid", "=", params.worker.pid).where("worker_start_time", "=", params.worker.startTime) : update.where("worker_pid", "is", null).where("worker_start_time", "is", null);
	const updated = executeSqliteQueryTakeFirstSync(database, update.returning([
		"state",
		"result_json",
		"error_text",
		"completed_at_ms",
		"updated_at_ms"
	]));
	return updated ? {
		...current,
		...updated
	} : void 0;
}
/** Connection-bound launch journal; every operation retains its original write transaction. */
var NodeWorkerLaunchKernel = class {
	constructor(options) {
		this.databaseOptions = options;
	}
	write(operationLabel, operation) {
		let initializedDatabase;
		const result = runOpenClawStateWriteTransaction(({ db, path }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: { kind: "node-worker-journal" }
			});
			if (!initializedDatabases.has(db)) {
				ensureNodeWorkerLaunchSchema(db, "node_worker_launches");
				initializedDatabase = db;
			}
			return operation(db, path);
		}, this.databaseOptions, { operationLabel });
		if (initializedDatabase) initializedDatabases.add(initializedDatabase);
		return result;
	}
	claimObservation(claim, supervisor, capacity, nowMs = Date.now()) {
		validateIdentifier(claim.launchId, "node worker launch id");
		validatePlanHash(claim.planHash);
		validateTimestamp(nowMs);
		validateProcessIdentity(supervisor);
		if (!Number.isSafeInteger(capacity) || capacity < 1) throw new Error("node worker capacity must be a positive safe integer");
		return this.write("node-worker-launch.claim-inspect", (database) => {
			const observed = readRow(database, claim.launchId);
			if (!observed) return;
			const { plan_hash, state, supervisor_pid, supervisor_start_time, worker_pid, worker_start_time } = observed;
			return {
				plan_hash,
				state,
				supervisor_pid,
				supervisor_start_time,
				worker_pid,
				worker_start_time
			};
		});
	}
	claim(claim, supervisor, capacity, nowMs, observed, observedSupervisorState) {
		return this.write("node-worker-launch.claim", (database) => {
			const finalize = (result) => {
				pruneTerminalRows({
					database,
					cutoffMs: Math.max(0, nowMs - TERMINAL_RECEIPT_RETENTION_MS),
					limit: TERMINAL_PRUNE_BATCH_LIMIT,
					excludeLaunchId: claim.launchId
				});
				return result;
			};
			let current = readRow(database, claim.launchId);
			let action = "replay";
			if (!current) {
				const nonterminalCount = readNonterminalCount(database);
				if (nonterminalCount >= capacity) return finalize({
					action: "at-capacity",
					nonterminalCount
				});
				executeSqliteQuerySync(database, query(database).insertInto("node_worker_launches").values({
					launch_id: claim.launchId,
					plan_hash: claim.planHash,
					gateway_namespace: claim.gatewayNamespace,
					environment_id: claim.environmentId,
					session_id: claim.sessionId,
					owner_epoch: claim.ownerEpoch,
					placement_generation: claim.placementGeneration,
					run_id: claim.runId,
					state: "pending",
					supervisor_pid: supervisor.pid,
					supervisor_start_time: supervisor.startTime,
					worker_pid: null,
					worker_start_time: null,
					result_json: null,
					error_text: null,
					completed_at_ms: null,
					created_at_ms: nowMs,
					updated_at_ms: nowMs
				}));
				current = requireMatchingRow(database, claim.launchId, claim.planHash);
				action = "start";
			} else if (current.plan_hash !== claim.planHash) throw new Error(`node worker launch ${claim.launchId} was replayed with a different plan`);
			else if (observed && sameObservedOwner(current, observed) && (observedSupervisorState === "dead" || observedSupervisorState === "reused")) {
				if (current.state === "pending") {
					const updatedAtMs = Math.max(nowMs, current.created_at_ms, current.updated_at_ms);
					executeSqliteQuerySync(database, query(database).updateTable("node_worker_launches").set({
						supervisor_pid: supervisor.pid,
						supervisor_start_time: supervisor.startTime,
						updated_at_ms: updatedAtMs
					}).where("launch_id", "=", claim.launchId).where("plan_hash", "=", claim.planHash).where("state", "=", "pending").where("supervisor_pid", "=", observed.supervisor_pid).where("supervisor_start_time", "=", observed.supervisor_start_time).where("worker_pid", "is", null).where("worker_start_time", "is", null));
					current = requireMatchingRow(database, claim.launchId, claim.planHash);
					action = rowHasSupervisor(current, supervisor) ? "start" : "replay";
				} else if (current.state === "running") action = "recover";
			}
			return finalize({
				action,
				receipt: nodeWorkerLaunchReceiptFromRow(current),
				nonterminalCount: readNonterminalCount(database)
			});
		});
	}
	listNonterminal() {
		return this.write("node-worker-launch.list-nonterminal", (database) => readNonterminalRows(database).map(nodeWorkerLaunchReceiptFromRow));
	}
	nonterminalCount() {
		return this.write("node-worker-launch.count-nonterminal", readNonterminalCount);
	}
	pruneExpiredTerminal(params = {}) {
		const nowMs = params.nowMs ?? Date.now();
		const limit = params.limit ?? TERMINAL_PRUNE_BATCH_LIMIT;
		validateTimestamp(nowMs);
		validatePruneLimit(limit);
		return this.write("node-worker-launch.prune-terminal", (database) => pruneTerminalRows({
			database,
			cutoffMs: Math.max(0, nowMs - TERMINAL_RECEIPT_RETENTION_MS),
			limit
		}));
	}
	get(launchId) {
		validateIdentifier(launchId, "node worker launch id");
		return this.write("node-worker-launch.get", (database) => {
			const row = readRow(database, launchId);
			return row ? nodeWorkerLaunchReceiptFromRow(row) : void 0;
		});
	}
	getMatching(expected) {
		validateIdentifier(expected.launchId, "node worker launch id");
		validatePlanHash(expected.planHash);
		return this.write("node-worker-launch.get-matching", (database) => {
			const row = readRow(database, expected.launchId);
			return row && rowMatchesImmutableIdentity(row, expected) ? nodeWorkerLaunchReceiptFromRow(row) : void 0;
		});
	}
	cleanupBinding(params) {
		return this.write("node-worker-launch.cleanup-binding", (database, databasePath) => {
			const current = requireMatchingRow(database, params.launchId, params.planHash);
			if (isNodeWorkerTerminalState(current.state) || !rowHasSupervisor(current, params.supervisor)) throw new Error("node worker cleanup binding no longer owns its launch");
			return {
				databasePath,
				externallySupervised: isGatewayExternallySupervised(this.databaseOptions.env),
				launchId: params.launchId,
				planHash: params.planHash,
				supervisor: { ...params.supervisor }
			};
		});
	}
	finishCancelled(params) {
		const nowMs = params.nowMs ?? Date.now();
		validateTimestamp(nowMs);
		validateProcessIdentity(params.supervisor);
		if (params.worker) validateProcessIdentity(params.worker);
		return this.write("node-worker-launch.finish-cancelled", (database) => {
			const current = readRow(database, params.expected.launchId);
			if (!current || !rowMatchesImmutableIdentity(current, params.expected)) return;
			const settled = finishOwnedRow(database, current, {
				supervisor: params.supervisor,
				worker: params.worker,
				state: "cancelled",
				errorText: "node worker launch cancelled"
			}, nowMs, params.expected) ?? current;
			if (!rowMatchesImmutableIdentity(settled, params.expected)) return;
			const receipt = nodeWorkerLaunchReceiptFromRow(settled);
			settleNodeWorkerActiveTurns(database, receipt);
			return receipt;
		});
	}
	markRunning(params) {
		const nowMs = params.nowMs ?? Date.now();
		validateTimestamp(nowMs);
		validateProcessIdentity(params.supervisor);
		validateProcessIdentity(params.worker);
		if (params.container) validateNodeWorkerContainerIdentity(params.container);
		return this.write("node-worker-launch.mark-running", (database) => {
			const current = requireMatchingRow(database, params.launchId, params.planHash);
			if (isNodeWorkerTerminalState(current.state)) return nodeWorkerLaunchReceiptFromRow(current);
			if (current.state === "running") return nodeWorkerLaunchReceiptFromRow(current);
			if (!rowHasSupervisor(current, params.supervisor) || !rowHasWorker(current, null)) return nodeWorkerLaunchReceiptFromRow(current);
			if (params.container) {
				ensureNodeWorkerLaunchSchema(database, "node_worker_launch_containers");
				executeSqliteQuerySync(database, query(database).insertInto("node_worker_launch_containers").values({
					launch_id: params.launchId,
					container_json: JSON.stringify({
						engine: params.container.engine,
						containerId: params.container.containerId,
						engineTarget: params.container.engineTarget
					})
				}));
			}
			if (params.cleanupMode !== null) {
				ensureNodeWorkerLaunchSchema(database, "node_worker_launch_cleanup");
				executeSqliteQuerySync(database, query(database).insertInto("node_worker_launch_cleanup").values({
					launch_id: params.launchId,
					cleanup_mode: params.cleanupMode,
					lineage_settled: null
				}));
			}
			const updatedAtMs = Math.max(nowMs, current.created_at_ms, current.updated_at_ms);
			executeSqliteQuerySync(database, query(database).updateTable("node_worker_launches").set({
				state: "running",
				worker_pid: params.worker.pid,
				worker_start_time: params.worker.startTime,
				updated_at_ms: updatedAtMs
			}).where("launch_id", "=", params.launchId).where("plan_hash", "=", params.planHash).where("state", "=", "pending").where("supervisor_pid", "=", params.supervisor.pid).where("supervisor_start_time", "=", params.supervisor.startTime).where("worker_pid", "is", null).where("worker_start_time", "is", null));
			return nodeWorkerLaunchReceiptFromRow(requireMatchingRow(database, params.launchId, params.planHash));
		});
	}
	finish(params) {
		const nowMs = params.nowMs ?? Date.now();
		validateTimestamp(nowMs);
		validateProcessIdentity(params.supervisor);
		if (params.worker) validateProcessIdentity(params.worker);
		return this.write("node-worker-launch.finish", (database) => {
			const current = requireMatchingRow(database, params.launchId, params.planHash);
			const receipt = nodeWorkerLaunchReceiptFromRow(finishOwnedRow(database, current, params, nowMs) ?? current);
			settleNodeWorkerActiveTurns(database, receipt);
			return receipt;
		});
	}
};
//#endregion
export { isNodeWorkerTerminalState as i, readNodeWorkerLaunchReceipt as n, settleNodeWorkerActiveTurns as r, NodeWorkerLaunchKernel as t };
