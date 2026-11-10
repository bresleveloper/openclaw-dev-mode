import { tt as parseSqliteTableDefinition } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync, d as sqliteStringSet, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { a as deferSqliteWorkerCommitReceipt, f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { t as jsonArrayFrom } from "./sqlite-DAhWTcvk.mjs";
import { i as isFailedWorkerPlacementEnvironmentGone, o as matchesWorkerPlacementTarget } from "./placement-target-BGdJpPtJ.mjs";
import { t as workerInferenceMetadata } from "./inference-placement-C1SOuYae.mjs";
import { c as normalizeIdentity, g as required, o as nextGeneration, u as normalizeWorkerPlacementExecutionMode } from "./placement-record-CBaaHws5.mjs";
import { C as publishPlacementTurnClaimCleared, R as isWorkerWorkspaceResultReconciling, a as query, c as revivePlacementProjectionInteger, d as turnClaimValues, f as updateTransition, i as getRequired, l as selectWorkerPlacementRows, n as find, o as readWorkerPlacementsForReconcileInDatabase, r as fromRow, s as readWorkerPlacementsInDatabase, t as ensureLocal, z as matchesWorkspaceResultClaim } from "./placement-row-codec-DhdW6tSs.mjs";
import { r as assertSessionWorkspaceUnreserved } from "./placement-workspace-reservation.kernel-Bjfj6oO6.mjs";
import { r as isCurrentJournalOwner } from "./placement-workspace-journal-LUopYVRV.mjs";
import { l as pendingResultFromRow, o as hasWorkerWorkspacePendingResult } from "./placement-workspace-result--lykq2r1.mjs";
import { n as clearLocalTurnClaimsInDatabase } from "./placement-turn-claims-DLDd9nfQ.mjs";
import { n as readWorkerPlacementMovesReadOnly, r as workerPlacementMoveFromRow, t as createPlacementMoveOps } from "./placement-move-intent-r4UJEgky.mjs";
import { n as consumePreparedEnvironment } from "./prepared-environment-store-BAIUv_7G.mjs";
import { r as findWorkerEnvironment, t as decodeWorkerEnvironmentRow } from "./store-row-codec-B2xBAqsK.mjs";
//#region src/gateway/worker-environments/placement-read-projection.ts
const projectionSchemas = /* @__PURE__ */ new WeakMap();
const PROJECTION_BATCH_SIZE = 250;
function readProjectionSchema(db) {
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (!schema) throw new Error("Worker placement projection requires admitted schema facts");
	let projectionSchema = projectionSchemas.get(schema);
	if (!projectionSchema) {
		const pendingColumns = parseSqliteTableDefinition(schema.tableSql.get("worker_workspace_pending_results") ?? null, "worker_workspace_pending_results").columns;
		const moveSql = schema.tableSql.get("worker_session_placement_moves");
		const moveColumns = moveSql ? parseSqliteTableDefinition(moveSql, "worker_session_placement_moves").columns : void 0;
		projectionSchema = {
			repositoryWorkspace: pendingColumns.has("repository_workspace_id"),
			...moveColumns ? { moves: {
				machineClass: moveColumns.has("target_machine_class"),
				os: moveColumns.has("target_os"),
				abandonSource: moveColumns.has("abandon_source")
			} } : {}
		};
		projectionSchemas.set(schema, projectionSchema);
	}
	return projectionSchema;
}
function moveRows(db, sessionIds, schema) {
	return getNodeSqliteKysely(db).selectFrom("worker_session_placement_moves").select([
		"operation_id",
		"session_id",
		"source_generation",
		"source_environment_id",
		"source_owner_epoch",
		"target_kind",
		"target_id",
		"last_error",
		"created_at_ms",
		"updated_at_ms"
	]).select((eb) => [
		(schema.moves?.machineClass ? eb.ref("target_machine_class") : eb.val(null)).as("target_machine_class"),
		(schema.moves?.os ? eb.ref("target_os") : eb.val(null)).as("target_os"),
		(schema.moves?.abandonSource ? eb.ref("abandon_source") : eb.val(null)).as("abandon_source")
	]).where("session_id", "in", sqliteStringSet(sessionIds)).$assertType();
}
function readProjectionRows(db, sessionIds, schema) {
	const query = getNodeSqliteKysely(db);
	const ids = sqliteStringSet(sessionIds);
	const placements = selectWorkerPlacementRows(db, sessionIds);
	const pendingResults = query.selectFrom("worker_workspace_pending_results").select([
		"session_id",
		"environment_id",
		"owner_epoch",
		"placement_generation",
		"claim_id",
		"run_id",
		"gateway_instance_id",
		"recovery_requested_at_ms",
		"workspace_accepted_at_ms",
		"staged_result_ref",
		"created_at_ms"
	]).select((eb) => (schema.repositoryWorkspace ? eb.ref("repository_workspace_id") : eb.val(null)).as("repository_workspace_id")).where("session_id", "in", ids).$assertType();
	const journals = query.selectFrom("worker_workspace_reconciliations").select([
		"session_id",
		"environment_id",
		"owner_epoch",
		"placement_generation"
	]).where("session_id", "in", ids);
	const moves = moveRows(db, sessionIds, schema);
	const environments = query.selectFrom("worker_environments").select([
		"environment_id",
		"provider_id",
		"profile_id",
		"profile_snapshot_json",
		"preparation_consumed_at_ms",
		"preparation_demand_at_ms",
		"preparation_expires_at_ms",
		"preparation_key",
		"preparation_purpose",
		"provision_operation_id",
		"node_setup_id",
		"node_device_id",
		"shared_host",
		"lease_id",
		"ssh_host",
		"ssh_port",
		"ssh_user",
		"ssh_host_key",
		"ssh_key_ref_json",
		"desktop_json",
		"bootstrap_bundle_hash",
		"bootstrap_openclaw_version",
		"bootstrap_protocol_features_json",
		"bootstrap_install_kind",
		"owner_epoch",
		"teardown_terminal_state",
		"state",
		"attached_session_ids_json",
		"created_at_ms",
		"updated_at_ms",
		"state_changed_at_ms",
		"last_activated_at_ms",
		"idle_since_at_ms",
		"destroy_requested_at_ms",
		"last_error"
	]).where("environment_id", "in", query.selectFrom("worker_session_placements").select("environment_id").where("session_id", "in", ids).where("environment_id", "is not", null));
	return executeSqliteQuerySync(db, query.selectNoFrom((eb) => [
		jsonArrayFrom(placements).$castTo().as("placements"),
		jsonArrayFrom(pendingResults).$castTo().as("pendingResults"),
		jsonArrayFrom(journals).$castTo().as("journals"),
		schema.moves ? jsonArrayFrom(moves).$castTo().as("moves") : eb.val("[]").as("moves"),
		jsonArrayFrom(environments).$castTo().as("environments")
	])).rows[0];
}
function readWorkerSessionPlacementProjectionInDatabase(db, sessionIds, conflictBindings) {
	const read = () => {
		const schema = readProjectionSchema(db);
		const placements = /* @__PURE__ */ new Map();
		const moves = /* @__PURE__ */ new Map();
		const pendingResults = /* @__PURE__ */ new Map();
		const reconcilingSessionIds = /* @__PURE__ */ new Set();
		const workspaceRecoveryPendingSessionIds = /* @__PURE__ */ new Set();
		const workspaceJournalOwnerSessionIds = /* @__PURE__ */ new Set();
		const environments = /* @__PURE__ */ new Map();
		for (let offset = 0; offset < sessionIds.length; offset += PROJECTION_BATCH_SIZE) {
			const rows = readProjectionRows(db, sessionIds.slice(offset, offset + PROJECTION_BATCH_SIZE), schema);
			for (const row of JSON.parse(rows.placements, revivePlacementProjectionInteger)) {
				const placement = fromRow(row);
				placements.set(placement.sessionId, placement);
			}
			for (const row of JSON.parse(rows.pendingResults, revivePlacementProjectionInteger)) {
				const pending = pendingResultFromRow(row);
				pendingResults.set(pending.sessionId, pending);
				workspaceRecoveryPendingSessionIds.add(pending.sessionId);
				if (isWorkerWorkspaceResultReconciling(placements.get(pending.sessionId), pending)) reconcilingSessionIds.add(pending.sessionId);
			}
			for (const row of JSON.parse(rows.journals, revivePlacementProjectionInteger)) {
				workspaceRecoveryPendingSessionIds.add(row.session_id);
				if (isCurrentJournalOwner(db, placements.get(row.session_id), {
					sessionId: row.session_id,
					environmentId: row.environment_id,
					ownerEpoch: row.owner_epoch,
					placementGeneration: row.placement_generation
				}, pendingResults)) workspaceJournalOwnerSessionIds.add(row.session_id);
			}
			for (const row of JSON.parse(rows.moves, revivePlacementProjectionInteger)) {
				const move = workerPlacementMoveFromRow(row);
				moves.set(move.sessionId, move);
			}
			for (const row of JSON.parse(rows.environments, revivePlacementProjectionInteger)) {
				const record = decodeWorkerEnvironmentRow(row, []);
				environments.set(record.environmentId, {
					environmentId: record.environmentId,
					providerId: record.providerId,
					profileId: record.profileId,
					profileSnapshot: record.profileSnapshot,
					...workerInferenceMetadata(record),
					state: record.state,
					leaseId: record.leaseId,
					ownerEpoch: record.ownerEpoch,
					nodeDeviceId: record.nodeDeviceId,
					attachedSessionIds: record.attachedSessionIds
				});
			}
		}
		const projection = {
			placements,
			moves,
			pendingResults,
			workspaceJournalOwnerSessionIds,
			workspaceResultReconcilingSessionIds: reconcilingSessionIds,
			workspaceRecoveryPendingSessionIds,
			environments
		};
		const conflictSessionIds = /* @__PURE__ */ new Set();
		for (const binding of conflictBindings) {
			const record = placements.get(binding.placement.sessionId);
			const pending = pendingResults.get(binding.placement.sessionId);
			if (record && record.environmentId === binding.placement.environmentId && record.activeOwnerEpoch === binding.placement.activeOwnerEpoch && (record.generation === binding.placement.generation || pending && matchesWorkspaceResultClaim(record, pending, binding.claim))) conflictSessionIds.add(record.sessionId);
		}
		return {
			projection,
			conflictSessionIds
		};
	};
	return sessionIds.length <= PROJECTION_BATCH_SIZE ? read() : runSqliteDeferredTransactionSync(db, read);
}
//#endregion
//#region src/gateway/worker-environments/placement-retirement.ts
const RETIRABLE_PLACEMENT_STATES = [
	"local",
	"requested",
	"reclaimed",
	"failed"
];
function retireWorkerSessionPlacement(db, input, options = {}) {
	const sessionId = required(input.sessionId, "session id");
	if (!RETIRABLE_PLACEMENT_STATES.some((state) => state === input.expectedState)) throw new Error(`Cannot retire worker session placement from ${input.expectedState}`);
	const result = executeSqliteQueryTakeFirstSync(db, query(db).deleteFrom("worker_session_placements").where("session_id", "=", sessionId).where("state", "=", input.expectedState).where("transition_generation", "=", input.expectedGeneration).where((eb) => eb.and(turnClaimValues(null))).returning([
		"session_id as sessionId",
		"agent_id as agentId",
		"session_key as sessionKey"
	]));
	if (!result) {
		if (options.onlyIfCurrent) return;
		throw new Error(`Worker session placement ${sessionId} changed before retirement`);
	}
	publishPlacementTurnClaimCleared(db, sessionId, input.expectedState, true);
	return result;
}
//#endregion
//#region src/gateway/worker-environments/placement-lifecycle.worker.ts
function operation(type, execute, deferredAdmission = false) {
	return (input, { write }) => {
		return write(({ db, path }) => {
			const admit = (facts) => requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts
			});
			if (!deferredAdmission) admit();
			const receipt = execute({
				path,
				instanceId: "",
				now: () => input.nowMs ?? Date.now(),
				read: () => db,
				write: (mutate) => mutate(db)
			}, input, admit);
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: receipt
			});
			deferSqliteWorkerCommitReceipt(db, receipt);
			return receipt;
		}, { operationLabel: type });
	};
}
const placementReadOperations = {
	"workerPlacements.read": (input, { open }) => readWorkerPlacementsInDatabase(open().db, input.sessionIds),
	"workerPlacements.readWithMove": (input, { open }) => {
		const { projection } = readWorkerSessionPlacementProjectionInDatabase(open().db, [input.sessionId], []);
		return {
			placement: projection.placements.get(input.sessionId),
			move: projection.moves.get(input.sessionId)
		};
	},
	"workerPlacements.readMove": (input, { open }) => readWorkerPlacementMovesReadOnly(open().db, [input.sessionId]).get(input.sessionId),
	"workerPlacements.readReconcile": (input, { open }) => readWorkerPlacementsForReconcileInDatabase(open().db, input.sessionKey)
};
function startWorkerPlacementDispatch(runtime, input) {
	const identity = normalizeIdentity(input);
	const executionMode = normalizeWorkerPlacementExecutionMode(input.executionMode);
	const db = runtime.read();
	const nowMs = runtime.now();
	const current = ensureLocal(db, identity, nowMs);
	assertSessionWorkspaceUnreserved(db, identity.sessionId);
	if (current.state !== "local" && current.state !== "reclaimed" && current.state !== "failed") throw new Error(`Cannot dispatch session ${identity.sessionId} from placement ${current.state}`);
	const expected = input.expectedPlacement;
	if (expected) {
		if (!matchesWorkerPlacementTarget(current, expected) || current.executionMode !== executionMode || current.state !== "reclaimed" && current.state !== "failed" || current.turnClaim) throw new Error(`Worker placement ${identity.sessionId} changed before redispatch`);
		const journal = executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("worker_workspace_reconciliations").select("session_id").where("session_id", "=", identity.sessionId)).rows[0];
		if (hasWorkerWorkspacePendingResult(db, identity.sessionId) || journal || readWorkerPlacementMovesReadOnly(db, [identity.sessionId]).has(identity.sessionId)) throw new Error(`Worker placement ${identity.sessionId} still has pending workspace recovery`);
		if (current.state === "failed") {
			const environment = current.environmentId ? findWorkerEnvironment(db, current.environmentId) : void 0;
			if (current.activeOwnerEpoch === null || !environment || !isFailedWorkerPlacementEnvironmentGone({
				environmentService: { get: () => environment },
				placement: current
			})) throw new Error(`Failed worker placement ${identity.sessionId} still requires recovery`);
		}
	}
	if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set({
		state: "requested",
		execution_mode: executionMode,
		environment_id: null,
		transition_generation: nextGeneration(current.generation),
		active_owner_epoch: null,
		workspace_base_manifest_ref: null,
		remote_workspace_dir: null,
		worker_bundle_hash: null,
		last_transcript_ack_cursor: null,
		last_live_event_ack_cursor: null,
		recovery_error: null,
		terminal_reason: null,
		terminal_at_ms: null,
		updated_at_ms: nowMs,
		state_changed_at_ms: nowMs
	}).where("session_id", "=", current.sessionId).where("state", "=", current.state).where("transition_generation", "=", current.generation)).numAffectedRows !== 1n) throw new Error(`Session ${identity.sessionId} placement changed during dispatch barrier`);
	return getRequired(db, identity.sessionId);
}
const placementLifecycleOperations = {
	"workerPlacements.clearLocalTurnClaims": (input, { write }) => write(({ db, path }) => clearLocalTurnClaimsInDatabase(db, path, input.nowMs ?? Date.now()), { operationLabel: "workerPlacements.clearLocalTurnClaims" }),
	"workerPlacements.startDispatch": operation("workerPlacements.startDispatch", (runtime, input) => ({
		sessionId: input.sessionId,
		placement: startWorkerPlacementDispatch(runtime, input)
	})),
	"workerPlacements.beginMove": operation("workerPlacements.beginMove", (runtime, input, admit) => ({
		sessionId: input.sessionId,
		...createPlacementMoveOps(runtime).beginPlacementMove(input, (placement, joined) => admit({
			sessionId: input.sessionId,
			placement,
			joined
		}))
	}), true),
	"workerPlacements.moveError": operation("workerPlacements.moveError", (runtime, input) => ({
		sessionId: input.sessionId,
		changed: createPlacementMoveOps(runtime).recordPlacementMoveError(input)
	})),
	"workerPlacements.cancelMove": operation("workerPlacements.cancelMove", (runtime, input) => ({
		sessionId: input.sessionId,
		changed: createPlacementMoveOps(runtime).cancelPlacementMove(input)
	})),
	"workerPlacements.completeMoveSource": operation("workerPlacements.completeMoveSource", (runtime, input) => ({
		sessionId: input.sessionId,
		...createPlacementMoveOps(runtime).completePlacementMoveSourceToLocal(input)
	})),
	"workerPlacements.completeAbandonedMoveSource": operation("workerPlacements.completeAbandonedMoveSource", (runtime, input) => ({
		sessionId: input.sessionId,
		...createPlacementMoveOps(runtime).completeAbandonedPlacementMoveSourceToLocal(input)
	})),
	"workerPlacements.completeMove": operation("workerPlacements.completeMove", (runtime, input) => ({
		sessionId: input.sessionId,
		placement: createPlacementMoveOps(runtime).completePlacementMoveToWorker(input)
	})),
	"workerPlacements.retire": operation("workerPlacements.retire", (runtime, input) => {
		const db = runtime.read();
		const retired = retireWorkerSessionPlacement(db, input, { onlyIfCurrent: true });
		if (!retired && find(db, input.sessionId)) throw new Error(`Worker session placement ${input.sessionId} changed before retirement`);
		return retired ? {
			sessionId: input.sessionId,
			retired: input.expectedState,
			retiredIdentity: retired
		} : {
			sessionId: input.sessionId,
			changed: false
		};
	}),
	"workerPlacements.bindPrepared": operation("workerPlacements.bindPrepared", (runtime, input) => {
		const nowMs = runtime.now();
		const consumed = consumePreparedEnvironment(runtime.read(), input, nowMs);
		if (!consumed) return { sessionId: input.sessionId };
		return {
			sessionId: input.sessionId,
			placement: updateTransition(runtime.read(), consumed.placement, "provisioning", { environmentId: input.environmentId }, nowMs),
			environment: {
				environmentId: input.environmentId,
				patch: consumed.environmentPatch
			}
		};
	})
};
//#endregion
export { placementLifecycleOperations, placementReadOperations };
