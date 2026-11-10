import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-CO5zyEkR.mjs";
import { t as createSqliteSchemaEnsurer } from "./sqlite-schema-ensure-CwIgvH1h.mjs";
import { t as getOpenClawStateFeatureSchemaSql } from "./openclaw-state-feature-schema-CYc16G0w.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { i as updateConfigMachineStateInDatabase } from "./config-machine-state-write-CmW-lLFq.mjs";
import { i as normalizeStoredNodeHostConfig } from "./node-worker-prepared-workspace-publication-BVABEP6T.mjs";
import { i as nodeWorkerTurnMatchesIdentity } from "./node-supervisor-protocol-CqoR9BQ5.mjs";
import { t as NodeWorkerPreparedWorkspaceKernel } from "./node-worker-prepared-workspace-store.kernel-wGiNKrmr.mjs";
//#region src/node-host/config.worker.ts
function configureNodeHostInWorker([input], { write }) {
	return write(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: { kind: "node-worker-journal" }
		});
		let clearedCommands = false;
		return {
			config: updateConfigMachineStateInDatabase(db, "nodeHost.config", (stored) => {
				const existing = stored === void 0 ? void 0 : normalizeStoredNodeHostConfig(stored);
				clearedCommands = input.allCommands === true && existing?.commands !== void 0;
				const commands = input.allCommands ? void 0 : input.commands ?? existing?.commands;
				return {
					version: 1,
					nodeId: input.explicitNodeId ?? existing?.nodeId ?? input.candidateNodeId,
					displayName: input.explicitDisplayName ?? existing?.displayName ?? input.fallbackDisplayName,
					gateway: input.gateway,
					installedAppsSharing: input.installedAppsSharing ?? existing?.installedAppsSharing ?? false,
					...commands !== void 0 ? { commands } : {}
				};
			}, input.updatedAtMs),
			clearedCommands
		};
	}, { operationLabel: "node-host.configure" });
}
//#endregion
//#region src/node-host/node-worker-launch-receipt.ts
function isNodeWorkerTerminalState(value) {
	return value === "completed" || value === "failed" || value === "interrupted" || value === "cancelled";
}
function validateNodeWorkerPlanHash(value) {
	if (!/^[a-f0-9]{64}$/u.test(value)) throw new Error("node worker plan hash must be 64 lowercase hexadecimal characters");
}
function validateNodeWorkerProcessIdentity(identity) {
	if (!Number.isSafeInteger(identity.pid) || identity.pid <= 0 || identity.pid > 2147483647 || !Number.isSafeInteger(identity.startTime) || identity.startTime < 0) throw new Error("node worker process identity must contain a bounded pid and start time");
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
	if (row.scope_kind != null && (row.scope_kind !== "linux-subreaper" || cleanupMode !== "owned-anchor")) throw new Error("invalid node worker process scope");
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
		...row.boot_id ? { bootId: row.boot_id } : {},
		worker: row.worker_pid === null || row.worker_start_time === null ? null : {
			pid: row.worker_pid,
			startTime: row.worker_start_time
		},
		workerCleanupMode: row.scope_kind === "linux-subreaper" ? "linux-subreaper" : cleanupMode,
		...row.scope_kind === "linux-subreaper" ? { workerDescendantsReaped: row.descendants_reaped === 1 } : {},
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
//#region src/node-host/node-worker-turn-settlement.worker.ts
/** Physical extinction closes unfinished turns, never a result already recorded by the worker. */
function settleNodeWorkerActiveTurns(database, owner, schema = getAdmittedSqliteSchemaFacts(database)) {
	if (owner.state === "pending" || owner.state === "running" || !(schema ? schema.tables.has("node_worker_turns") : tableExists(database, "node_worker_turns"))) return;
	executeSqliteQuerySync(database, getNodeSqliteKysely(database).updateTable("node_worker_turns").set((expression) => {
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
//#endregion
//#region src/node-host/node-worker-launch-store.kernel.ts
const NODE_WORKER_LAUNCH_SCHEMA_END = "\n  WHERE completed_at_ms IS NOT NULL;";
const TERMINAL_RECEIPT_RETENTION_MS$1 = 864e5;
const TERMINAL_PRUNE_BATCH_LIMIT$1 = 256;
const launchSchemaEnsurers = new Map([
	"node_worker_launches",
	"node_worker_launch_boots",
	"node_worker_launch_containers",
	"node_worker_launch_cleanup",
	"node_worker_launch_process_scopes"
].map((table) => [table, createSqliteSchemaEnsurer(() => getOpenClawStateFeatureSchemaSql(table, { endMarker: table === "node_worker_launches" ? NODE_WORKER_LAUNCH_SCHEMA_END : void 0 }), {
	tables: [table],
	indexes: table === "node_worker_launches" ? ["idx_node_worker_launches_terminal_completed"] : []
})]));
const ensureNodeWorkerLaunchSchema = (database, table) => launchSchemaEnsurers.get(table)(database);
function query$1(database) {
	return getNodeSqliteKysely(database);
}
function hasLaunchTable(db, schema, table) {
	return schema ? schema.tables.has(table) : tableExists(db, table);
}
function selectLaunchRows(database, schema) {
	return query$1(database).selectFrom("node_worker_launches").selectAll("node_worker_launches").$if(hasLaunchTable(database, schema, "node_worker_launch_boots"), (selection) => selection.leftJoin("node_worker_launch_boots", "node_worker_launch_boots.launch_id", "node_worker_launches.launch_id").select("node_worker_launch_boots.boot_id")).$if(hasLaunchTable(database, schema, "node_worker_launch_containers"), (selection) => selection.leftJoin("node_worker_launch_containers", "node_worker_launch_containers.launch_id", "node_worker_launches.launch_id").select("node_worker_launch_containers.container_json")).$if(hasLaunchTable(database, schema, "node_worker_launch_cleanup"), (selection) => selection.leftJoin("node_worker_launch_cleanup", "node_worker_launch_cleanup.launch_id", "node_worker_launches.launch_id").select(["node_worker_launch_cleanup.cleanup_mode", "node_worker_launch_cleanup.lineage_settled"])).$if(hasLaunchTable(database, schema, "node_worker_launch_process_scopes"), (selection) => selection.leftJoin("node_worker_launch_process_scopes", "node_worker_launch_process_scopes.launch_id", "node_worker_launches.launch_id").select(["node_worker_launch_process_scopes.scope_kind", "node_worker_launch_process_scopes.descendants_reaped"]));
}
function readRow$1(database, launchId, schema) {
	return executeSqliteQueryTakeFirstSync(database, selectLaunchRows(database, schema).where("node_worker_launches.launch_id", "=", launchId));
}
function readNonterminalCount(database) {
	return executeSqliteQueryTakeFirstSync(database, query$1(database).selectFrom("node_worker_launches").select((expression) => expression.fn.countAll().as("count")).where("state", "in", ["pending", "running"]))?.count ?? 0;
}
function readNonterminalRows(database, schema) {
	return executeSqliteQuerySync(database, selectLaunchRows(database, schema).where("node_worker_launches.state", "in", ["pending", "running"]).orderBy("node_worker_launches.launch_id", "asc")).rows;
}
function pruneTerminalRows(params) {
	let candidates = query$1(params.database).selectFrom("node_worker_launches").select("launch_id").where("state", "in", [
		"completed",
		"failed",
		"interrupted",
		"cancelled"
	]).where("completed_at_ms", "<=", params.cutoffMs).orderBy("completed_at_ms", "asc").orderBy("launch_id", "asc").limit(params.limit);
	if (params.excludeLaunchId) candidates = candidates.where("launch_id", "!=", params.excludeLaunchId);
	const launchIds = executeSqliteQuerySync(params.database, candidates).rows.map((row) => row.launch_id);
	if (launchIds.length === 0) return 0;
	if (hasLaunchTable(params.database, params.schema, "node_worker_launch_containers")) executeSqliteQuerySync(params.database, query$1(params.database).deleteFrom("node_worker_launch_containers").where("launch_id", "in", launchIds));
	const result = executeSqliteQuerySync(params.database, query$1(params.database).deleteFrom("node_worker_launches").where("launch_id", "in", launchIds).where("state", "in", [
		"completed",
		"failed",
		"interrupted",
		"cancelled"
	]).where("completed_at_ms", "<=", params.cutoffMs));
	return Number(result.numAffectedRows ?? 0n);
}
/** Read the authoritative physical owner within an already-open journal transaction. */
function readNodeWorkerLaunchReceipt(database, launchId) {
	const schema = getAdmittedSqliteSchemaFacts(database);
	if (!hasLaunchTable(database, schema, "node_worker_launches")) return;
	const row = readRow$1(database, launchId, schema);
	return row ? nodeWorkerLaunchReceiptFromRow(row) : void 0;
}
function validateIdentifier(value, label) {
	if (!value || value.trim() !== value || value.length > 256 || value.includes("\0")) throw new Error(`${label} must be a bounded non-empty identifier`);
}
function validateTimestamp(value) {
	if (!Number.isSafeInteger(value) || value < 0) throw new Error("node worker launch timestamp must be a non-negative safe integer");
}
function validatePruneLimit(limit) {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 1e3) throw new Error("node worker launch prune limit must be between 1 and 1000");
}
function requireMatchingRow(database, identity, schema) {
	const { launchId, planHash } = identity;
	const row = readRow$1(database, launchId, schema);
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
	let update = query$1(database).updateTable("node_worker_launches").set({
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
	constructor(databaseOptions) {
		this.databaseOptions = databaseOptions;
	}
	write(operationLabel, operation) {
		return runOpenClawStateWriteTransaction(({ db, path }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: { kind: "node-worker-journal" }
			});
			ensureNodeWorkerLaunchSchema(db, "node_worker_launches");
			return operation(db, getAdmittedSqliteSchemaFacts(db), path);
		}, this.databaseOptions, { operationLabel });
	}
	claimObservation(claim, supervisor, capacity, nowMs = Date.now()) {
		validateIdentifier(claim.launchId, "node worker launch id");
		validateNodeWorkerPlanHash(claim.planHash);
		validateTimestamp(nowMs);
		validateNodeWorkerProcessIdentity(supervisor);
		if (!Number.isSafeInteger(capacity) || capacity < 1) throw new Error("node worker capacity must be a positive safe integer");
		return this.write("node-worker-launch.claim-inspect", (database, schema) => {
			const observed = readRow$1(database, claim.launchId, schema);
			if (!observed) return;
			return {
				plan_hash: observed.plan_hash,
				state: observed.state,
				supervisor_pid: observed.supervisor_pid,
				supervisor_start_time: observed.supervisor_start_time,
				worker_pid: observed.worker_pid,
				worker_start_time: observed.worker_start_time
			};
		});
	}
	claim(claim, supervisor, capacity, nowMs, observed, observedSupervisorState, bootId) {
		return this.write("node-worker-launch.claim", (database, schema) => {
			const finalize = (result) => {
				pruneTerminalRows({
					database,
					schema,
					cutoffMs: Math.max(0, nowMs - TERMINAL_RECEIPT_RETENTION_MS$1),
					limit: TERMINAL_PRUNE_BATCH_LIMIT$1,
					excludeLaunchId: claim.launchId
				});
				return result;
			};
			let current = readRow$1(database, claim.launchId, schema);
			let action = "replay";
			if (!current) {
				const nonterminalCount = readNonterminalCount(database);
				if (nonterminalCount >= capacity) return finalize({
					action: "at-capacity",
					nonterminalCount
				});
				executeSqliteQuerySync(database, query$1(database).insertInto("node_worker_launches").values({
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
				if (bootId) {
					ensureNodeWorkerLaunchSchema(database, "node_worker_launch_boots");
					executeSqliteQuerySync(database, query$1(database).insertInto("node_worker_launch_boots").values({
						launch_id: claim.launchId,
						boot_id: bootId
					}));
				}
				current = requireMatchingRow(database, claim, getAdmittedSqliteSchemaFacts(database));
				action = "start";
			} else if (current.plan_hash !== claim.planHash) throw new Error(`node worker launch ${claim.launchId} was replayed with a different plan`);
			else if (observed && sameObservedOwner(current, observed) && (observedSupervisorState === "dead" || observedSupervisorState === "reused")) {
				if (current.state === "pending") {
					const updatedAtMs = Math.max(nowMs, current.created_at_ms, current.updated_at_ms);
					executeSqliteQuerySync(database, query$1(database).updateTable("node_worker_launches").set({
						supervisor_pid: supervisor.pid,
						supervisor_start_time: supervisor.startTime,
						updated_at_ms: updatedAtMs
					}).where("launch_id", "=", claim.launchId).where("plan_hash", "=", claim.planHash).where("state", "=", "pending").where("supervisor_pid", "=", observed.supervisor_pid).where("supervisor_start_time", "=", observed.supervisor_start_time).where("worker_pid", "is", null).where("worker_start_time", "is", null));
					if (current.boot_id) executeSqliteQuerySync(database, query$1(database).updateTable("node_worker_launch_boots").set({ boot_id: bootId ?? null }).where("launch_id", "=", claim.launchId));
					current = requireMatchingRow(database, claim, schema);
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
		return this.write("node-worker-launch.list-nonterminal", (database, schema) => readNonterminalRows(database, schema).map(nodeWorkerLaunchReceiptFromRow));
	}
	nonterminalCount() {
		return this.write("node-worker-launch.count-nonterminal", readNonterminalCount);
	}
	pruneExpiredTerminal(params = {}) {
		const nowMs = params.nowMs ?? Date.now();
		const limit = params.limit ?? TERMINAL_PRUNE_BATCH_LIMIT$1;
		validateTimestamp(nowMs);
		validatePruneLimit(limit);
		return this.write("node-worker-launch.prune-terminal", (database, schema) => pruneTerminalRows({
			database,
			schema,
			cutoffMs: Math.max(0, nowMs - TERMINAL_RECEIPT_RETENTION_MS$1),
			limit
		}));
	}
	get(launchId) {
		validateIdentifier(launchId, "node worker launch id");
		return this.write("node-worker-launch.get", (database, schema) => {
			const row = readRow$1(database, launchId, schema);
			return row ? nodeWorkerLaunchReceiptFromRow(row) : void 0;
		});
	}
	getMatching(expected) {
		validateIdentifier(expected.launchId, "node worker launch id");
		validateNodeWorkerPlanHash(expected.planHash);
		return this.write("node-worker-launch.get-matching", (database, schema) => {
			const row = readRow$1(database, expected.launchId, schema);
			return row && rowMatchesImmutableIdentity(row, expected) ? nodeWorkerLaunchReceiptFromRow(row) : void 0;
		});
	}
	cleanupBinding(params) {
		return this.write("node-worker-launch.cleanup-binding", (database, schema, databasePath) => {
			const current = requireMatchingRow(database, params, schema);
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
		validateNodeWorkerProcessIdentity(params.supervisor);
		if (params.worker) validateNodeWorkerProcessIdentity(params.worker);
		return this.write("node-worker-launch.finish-cancelled", (database, schema) => {
			const current = readRow$1(database, params.expected.launchId, schema);
			if (!current || !rowMatchesImmutableIdentity(current, params.expected)) return;
			const settled = finishOwnedRow(database, current, {
				supervisor: params.supervisor,
				worker: params.worker,
				state: "cancelled",
				errorText: "node worker launch cancelled"
			}, nowMs, params.expected) ?? current;
			if (!rowMatchesImmutableIdentity(settled, params.expected)) return;
			const receipt = nodeWorkerLaunchReceiptFromRow(settled);
			settleNodeWorkerActiveTurns(database, receipt, schema);
			return receipt;
		});
	}
	markRunning(params) {
		const nowMs = params.nowMs ?? Date.now();
		validateTimestamp(nowMs);
		validateNodeWorkerProcessIdentity(params.supervisor);
		validateNodeWorkerProcessIdentity(params.worker);
		if (params.container) validateNodeWorkerContainerIdentity(params.container);
		return this.write("node-worker-launch.mark-running", (database, schema) => {
			const current = requireMatchingRow(database, params, schema);
			if (isNodeWorkerTerminalState(current.state) || current.state === "running") return nodeWorkerLaunchReceiptFromRow(current);
			if (!rowHasSupervisor(current, params.supervisor) || !rowHasWorker(current, null)) return nodeWorkerLaunchReceiptFromRow(current);
			if (params.container) {
				ensureNodeWorkerLaunchSchema(database, "node_worker_launch_containers");
				executeSqliteQuerySync(database, query$1(database).insertInto("node_worker_launch_containers").values({
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
				executeSqliteQuerySync(database, query$1(database).insertInto("node_worker_launch_cleanup").values({
					launch_id: params.launchId,
					cleanup_mode: params.cleanupMode === "linux-subreaper" ? "owned-anchor" : params.cleanupMode,
					lineage_settled: null
				}));
			}
			if (params.cleanupMode === "linux-subreaper") {
				ensureNodeWorkerLaunchSchema(database, "node_worker_launch_process_scopes");
				executeSqliteQuerySync(database, query$1(database).insertInto("node_worker_launch_process_scopes").values({
					launch_id: params.launchId,
					scope_kind: "linux-subreaper",
					descendants_reaped: null
				}));
			}
			const updatedAtMs = Math.max(nowMs, current.created_at_ms, current.updated_at_ms);
			executeSqliteQuerySync(database, query$1(database).updateTable("node_worker_launches").set({
				state: "running",
				worker_pid: params.worker.pid,
				worker_start_time: params.worker.startTime,
				updated_at_ms: updatedAtMs
			}).where("launch_id", "=", params.launchId).where("plan_hash", "=", params.planHash).where("state", "=", "pending").where("supervisor_pid", "=", params.supervisor.pid).where("supervisor_start_time", "=", params.supervisor.startTime).where("worker_pid", "is", null).where("worker_start_time", "is", null));
			return nodeWorkerLaunchReceiptFromRow(requireMatchingRow(database, params, getAdmittedSqliteSchemaFacts(database)));
		});
	}
	finish(params) {
		const nowMs = params.nowMs ?? Date.now();
		validateTimestamp(nowMs);
		validateNodeWorkerProcessIdentity(params.supervisor);
		if (params.worker) validateNodeWorkerProcessIdentity(params.worker);
		return this.write("node-worker-launch.finish", (database, schema) => {
			const current = requireMatchingRow(database, params, schema);
			const receipt = nodeWorkerLaunchReceiptFromRow(finishOwnedRow(database, current, params, nowMs) ?? current);
			settleNodeWorkerActiveTurns(database, receipt, schema);
			return receipt;
		});
	}
};
//#endregion
//#region src/node-host/node-worker-turn-store.kernel.ts
const TERMINAL_RECEIPT_RETENTION_MS = 864e5;
const TERMINAL_PRUNE_BATCH_LIMIT = 256;
function query(database) {
	return getNodeSqliteKysely(database);
}
const turnSchema = createSqliteSchemaEnsurer(() => getOpenClawStateFeatureSchemaSql("node_worker_turns", {
	endMarker: "\n  WHERE state = 'running';",
	errorMessage: "OpenClaw node worker turn schema marker is missing."
}), {
	tables: ["node_worker_turns"],
	indexes: ["idx_node_worker_turns_terminal_completed", "idx_node_worker_turns_active_owner"]
});
function readRow(database, turnId) {
	return executeSqliteQueryTakeFirstSync(database, query(database).selectFrom("node_worker_turns").selectAll().where("turn_id", "=", turnId));
}
function readReceipt(database, turnId) {
	let turn = readRow(database, turnId);
	if (!turn) return;
	const owner = readNodeWorkerLaunchReceipt(database, turn.owner_launch_id);
	if (!owner) throw new Error(`node worker turn ${turnId} has no physical owner`);
	if (turn.state === "running" && owner.state !== "pending" && owner.state !== "running") {
		settleNodeWorkerActiveTurns(database, owner);
		turn = readRow(database, turnId);
	}
	return turnReceiptFromRow(turn, owner);
}
function turnReceiptFromRow(turn, owner) {
	const state = turn.state === "running" && owner.state === "pending" ? "pending" : turn.state;
	if (state !== "pending" && state !== "running" && !isNodeWorkerTerminalState(state)) throw new Error(`invalid node worker turn state ${state}`);
	return {
		...owner,
		ownerLaunchId: turn.owner_launch_id,
		launchId: turn.turn_id,
		planHash: turn.plan_hash,
		runId: turn.run_id,
		state,
		resultJson: turn.result_json,
		errorText: turn.error_text,
		completedAtMs: turn.completed_at_ms,
		createdAtMs: turn.created_at_ms,
		updatedAtMs: turn.updated_at_ms
	};
}
function matchesProcess(receipt, supervisor, worker) {
	return receipt.supervisor.pid === supervisor.pid && receipt.supervisor.startTime === supervisor.startTime && receipt.worker?.pid === worker?.pid && receipt.worker?.startTime === worker?.startTime;
}
function pruneTerminal(database, nowMs, excludeTurnId) {
	executeSqliteQuerySync(database, query(database).deleteFrom("node_worker_turns").where("turn_id", "in", query(database).selectFrom("node_worker_turns").select("turn_id").where("completed_at_ms", "<=", Math.max(0, nowMs - TERMINAL_RECEIPT_RETENTION_MS)).where("turn_id", "!=", excludeTurnId).orderBy("completed_at_ms", "asc").orderBy("turn_id", "asc").limit(TERMINAL_PRUNE_BATCH_LIMIT)));
}
/** Immutable turn outcomes attached to a separately supervised physical worker. */
var NodeWorkerTurnKernel = class {
	constructor(databaseOptions) {
		this.databaseOptions = databaseOptions;
	}
	write(operationLabel, operation) {
		return runOpenClawStateWriteTransaction(({ db }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: { kind: "node-worker-journal" }
			});
			turnSchema(db);
			return operation(db);
		}, this.databaseOptions, { operationLabel });
	}
	claim(params) {
		const { claim, ownerLaunchId, supervisor } = params;
		const nowMs = params.nowMs ?? Date.now();
		return this.write("node-worker-turn.claim", (database) => {
			const existing = readReceipt(database, claim.launchId);
			if (existing) {
				if (!nodeWorkerTurnMatchesIdentity(existing, claim) || existing.gatewayNamespace !== claim.gatewayNamespace || existing.ownerLaunchId !== ownerLaunchId) throw new Error(`node worker turn ${claim.launchId} was replayed with a different plan or owner`);
				pruneTerminal(database, nowMs, claim.launchId);
				return {
					action: "replay",
					receipt: existing
				};
			}
			const owner = readNodeWorkerLaunchReceipt(database, ownerLaunchId);
			if (!owner || owner.state !== "pending" && owner.state !== "running" || !matchesProcess(owner, supervisor, params.worker ?? null) || owner.gatewayNamespace !== claim.gatewayNamespace || owner.environmentId !== claim.environmentId || owner.sessionId !== claim.sessionId || owner.ownerEpoch !== claim.ownerEpoch || owner.placementGeneration !== claim.placementGeneration || owner.state === "pending" && owner.launchId !== claim.launchId || owner.launchId === claim.launchId && (owner.state !== "pending" || owner.planHash !== claim.planHash || owner.runId !== claim.runId)) throw new Error(`node worker turn ${claim.launchId} does not match its live physical owner`);
			const turn = executeSqliteQueryTakeFirstSync(database, query(database).insertInto("node_worker_turns").values({
				turn_id: claim.launchId,
				owner_launch_id: ownerLaunchId,
				plan_hash: claim.planHash,
				run_id: claim.runId,
				state: "running",
				result_json: null,
				error_text: null,
				completed_at_ms: null,
				created_at_ms: nowMs,
				updated_at_ms: nowMs
			}).returningAll());
			pruneTerminal(database, nowMs, claim.launchId);
			return {
				action: "start",
				receipt: turnReceiptFromRow(turn, owner)
			};
		});
	}
	get(turnId) {
		return this.write("node-worker-turn.get", (database) => readReceipt(database, turnId));
	}
	finish(params) {
		return this.write("node-worker-turn.finish", (database) => {
			const receipt = readReceipt(database, params.expected.launchId);
			if (!receipt || !nodeWorkerTurnMatchesIdentity(receipt, params.expected) || receipt.ownerLaunchId !== params.ownerLaunchId) return;
			if (receipt.state !== "pending" && receipt.state !== "running" || !matchesProcess(receipt, params.supervisor, params.worker)) return receipt;
			const nowMs = params.nowMs ?? Date.now();
			const completedAtMs = Math.max(nowMs, receipt.createdAtMs, receipt.updatedAtMs);
			const turn = executeSqliteQueryTakeFirstSync(database, query(database).updateTable("node_worker_turns").set({
				state: params.state,
				result_json: params.state === "completed" ? params.resultJson ?? null : null,
				error_text: params.state === "completed" ? null : params.errorText ?? null,
				completed_at_ms: completedAtMs,
				updated_at_ms: completedAtMs
			}).where("turn_id", "=", receipt.launchId).where("state", "=", "running").returningAll());
			pruneTerminal(database, nowMs, receipt.launchId);
			return turnReceiptFromRow(turn, receipt);
		});
	}
};
//#endregion
//#region src/node-host/node-worker-journal.worker.ts
function journalKernel(create) {
	return (select) => (input, context) => select(create(context))(...input);
}
const preparedRead = journalKernel(({ stateOptions }) => new NodeWorkerPreparedWorkspaceKernel(stateOptions()));
const preparedWrite = journalKernel(({ stateOptions, open }) => new NodeWorkerPreparedWorkspaceKernel({
	...stateOptions(),
	database: open()
}));
const launch = journalKernel(({ stateOptions, open }) => new NodeWorkerLaunchKernel({
	...stateOptions(),
	database: open()
}));
const turn = journalKernel(({ stateOptions, open }) => new NodeWorkerTurnKernel({
	...stateOptions(),
	database: open()
}));
const nodeWorkerJournalOperations = {
	"nodeWorker.configure": configureNodeHostInWorker,
	"nodeWorker.prepared.find": preparedRead((kernel) => kernel.find.bind(kernel)),
	"nodeWorker.prepared.list": preparedRead((kernel) => kernel.list.bind(kernel)),
	"nodeWorker.prepared.register": preparedWrite((kernel) => kernel.register.bind(kernel)),
	"nodeWorker.prepared.bind": preparedWrite((kernel) => kernel.bind.bind(kernel)),
	"nodeWorker.prepared.retire": preparedWrite((kernel) => kernel.retire.bind(kernel)),
	"nodeWorker.prepared.completeMutation": preparedWrite((kernel) => kernel.completeMutation.bind(kernel)),
	"nodeWorker.launch.claimObservation": launch((kernel) => kernel.claimObservation.bind(kernel)),
	"nodeWorker.launch.claim": launch((kernel) => kernel.claim.bind(kernel)),
	"nodeWorker.launch.listNonterminal": launch((kernel) => kernel.listNonterminal.bind(kernel)),
	"nodeWorker.launch.nonterminalCount": launch((kernel) => kernel.nonterminalCount.bind(kernel)),
	"nodeWorker.launch.pruneExpiredTerminal": launch((kernel) => kernel.pruneExpiredTerminal.bind(kernel)),
	"nodeWorker.launch.get": launch((kernel) => kernel.get.bind(kernel)),
	"nodeWorker.launch.getMatching": launch((kernel) => kernel.getMatching.bind(kernel)),
	"nodeWorker.launch.cleanupBinding": launch((kernel) => kernel.cleanupBinding.bind(kernel)),
	"nodeWorker.launch.finishCancelled": launch((kernel) => kernel.finishCancelled.bind(kernel)),
	"nodeWorker.launch.markRunning": launch((kernel) => kernel.markRunning.bind(kernel)),
	"nodeWorker.launch.finish": launch((kernel) => kernel.finish.bind(kernel)),
	"nodeWorker.turn.claim": turn((kernel) => kernel.claim.bind(kernel)),
	"nodeWorker.turn.get": turn((kernel) => kernel.get.bind(kernel)),
	"nodeWorker.turn.finish": turn((kernel) => kernel.finish.bind(kernel))
};
//#endregion
export { nodeWorkerJournalOperations };
