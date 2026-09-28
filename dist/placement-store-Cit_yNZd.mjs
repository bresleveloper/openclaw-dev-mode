import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists, t as ensureColumn } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { tt as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import "./worker-protocol-primitives-vA8IesMt.mjs";
import { i as generateSecureToken } from "./secure-random-BJtJxP9Y.mjs";
import { _ as resolvePlacementTurnEnvironment, a as isForceAbandonedWorkerPlacement, c as normalizeEpoch, d as normalizeWorkerPlacementExecutionMode, g as required, i as isCurrentPlacementTurnClaim, l as normalizeIdentity, m as projectWorkerSessionTurnClaim, o as nextGeneration, p as placementTurnOwner, r as assertRecordShape } from "./placement-record-CB6gcJKw.mjs";
import { a as query, i as getRequired, n as find, o as transitionValues, r as fromRow$1, s as canTransitionWorkerSessionPlacement, t as ensureLocal } from "./placement-row-codec-qMLLgrft.mjs";
import { a as hasWorkerWorkspacePendingResult, c as clearWorkerWorkspaceReconciliation, i as hasCurrentWorkspaceResultClaim, l as createPlacementWorkspaceJournalOps, n as createPlacementTurnClaimOps, o as isCurrentWorkerWorkspacePendingResultOwner, r as createPlacementWorkspaceResultOps, s as readWorkerWorkspaceReconciliationFacts } from "./placement-turn-claims-lHILSuHT.mjs";
import { t as boundedWorkerError } from "./worker-error-Bd42UcqN.mjs";
import { n as clearWorkerTurnToolState, t as assertNoRunningWorkerSessionToolOperations } from "./placement-session-tool-operations-Cxr8WLRd.mjs";
import { d as signalWorkerTurnClaimClosed, n as attachWorkerTurnExecutionIdentityStore, s as registerWorkerTurnClaimClosedHandler } from "./placement-turn-claim-events-D2oaSWT4.mjs";
import { n as assertSessionWorkspaceUnreserved, r as createPlacementWorkspaceReservationOps } from "./placement-workspace-reservation-bdeiq4od.mjs";
import { t as publishWorkerEnvironmentNativeMutation } from "./store-native-publication-DNMm5oc5.mjs";
import { n as consumePreparedEnvironment } from "./prepared-environment-store-OTAww-4q.mjs";
import { a as projectWorkspaceResultConflict } from "./workspace-conflicts-CQVfTI04.mjs";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
//#region src/gateway/worker-environments/placement-drain.ts
function drainWorkerSessionPlacement(db, input, nowMs) {
	const sessionId = required(input.sessionId, "session id");
	const environmentId = required(input.environmentId, "environment id");
	const ownerEpoch = normalizeEpoch(input.ownerEpoch, "active owner epoch");
	const current = getRequired(db, sessionId);
	if (current.state !== "active" || current.generation !== input.expectedGeneration || current.environmentId !== environmentId || current.activeOwnerEpoch !== ownerEpoch) throw new Error(`Cannot drain stale worker placement for session ${sessionId}`);
	if (!input.allowPendingWorkspaceResult && hasWorkerWorkspacePendingResult(db, sessionId)) throw new Error(`Cannot drain session ${sessionId} with a pending cloud workspace result`);
	const values = transitionValues(current, "draining", input.workspaceBaseManifestRef === void 0 ? {} : { workspaceBaseManifestRef: input.workspaceBaseManifestRef }, nowMs);
	const turnClaim = current.turnClaim;
	if (turnClaim) {
		values.turn_claim_owner = turnClaim.owner;
		values.turn_claim_id = turnClaim.claimId;
		values.turn_claim_run_id = turnClaim.runId;
		values.turn_claim_generation = turnClaim.generation;
		values.turn_claim_owner_epoch = turnClaim.ownerEpoch;
	}
	assertRecordShape({
		state: "draining",
		executionMode: current.executionMode,
		environmentId,
		activeOwnerEpoch: ownerEpoch,
		workspaceBaseManifestRef: values.workspace_base_manifest_ref,
		remoteWorkspaceDir: values.remote_workspace_dir,
		workerBundleHash: values.worker_bundle_hash,
		lastTranscriptAckCursor: values.last_transcript_ack_cursor,
		lastLiveEventAckCursor: values.last_live_event_ack_cursor,
		recoveryError: values.recovery_error,
		terminalReason: values.terminal_reason,
		terminalAtMs: values.terminal_at_ms,
		turnClaim
	});
	if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set(values).where("session_id", "=", sessionId).where("state", "=", "active").where("transition_generation", "=", current.generation).where("environment_id", "=", environmentId).where("active_owner_epoch", "=", ownerEpoch)).numAffectedRows !== 1n) throw new Error(`Worker session placement ${sessionId} changed during drain`);
	if (input.workspaceBaseManifestRef !== void 0) clearWorkerWorkspaceReconciliation(db, sessionId, input.workspaceBaseManifestRef);
	return getRequired(db, sessionId);
}
//#endregion
//#region src/gateway/worker-environments/placement-move-intent.ts
const MOVE_SCHEMA_START = "CREATE TABLE IF NOT EXISTS worker_session_placement_moves (";
const MOVE_SCHEMA_END = "\n) STRICT;";
const MOVE_OPERATION_PREFIX = "move:v1:";
const MOVE_MACHINE_CLASS_MAX_LENGTH = 128;
const MOVE_OS_MAX_LENGTH = 64;
const moveQuery = (db) => getNodeSqliteKysely(db);
function moveSchemaSql() {
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf(MOVE_SCHEMA_START);
	const endMarkerStart = OPENCLAW_STATE_SCHEMA_SQL.indexOf(MOVE_SCHEMA_END, start);
	if (start < 0 || endMarkerStart < start) throw new Error("Worker placement move schema marker is missing");
	return OPENCLAW_STATE_SCHEMA_SQL.slice(start, endMarkerStart + 10);
}
const ensuredMoveSchemaHandles = /* @__PURE__ */ new WeakSet();
function ensureWorkerPlacementMoveSchema(db) {
	if (ensuredMoveSchemaHandles.has(db)) return;
	db.exec(moveSchemaSql());
	ensureColumn(db, "worker_session_placement_moves", "target_machine_class TEXT");
	ensureColumn(db, "worker_session_placement_moves", "target_os TEXT");
	ensureColumn(db, "worker_session_placement_moves", "abandon_source INTEGER");
	ensuredMoveSchemaHandles.add(db);
}
function ensureExistingWorkerPlacementMoveSchema(db) {
	if (ensuredMoveSchemaHandles.has(db)) return true;
	if (!tableExists(db, "worker_session_placement_moves")) return false;
	ensureWorkerPlacementMoveSchema(db);
	return true;
}
function normalizeGeneration(value) {
	if (!Number.isSafeInteger(value) || value < 0) throw new Error("Worker placement move source generation must be a non-negative integer");
	return value;
}
function boundedIdentifier(value, field, maximumLength = 256) {
	const normalized = required(value, field);
	if (normalized.length > maximumLength) throw new Error(`Worker session placement ${field} exceeds ${maximumLength} characters`);
	return normalized;
}
function normalizeOperationId(value) {
	const operationId = required(value, "move operation id");
	if (!operationId.startsWith(MOVE_OPERATION_PREFIX) || operationId.length > 128) throw new Error("Worker session placement move operation id is invalid");
	return operationId;
}
function normalizeWorkerPlacementMoveTarget(target) {
	if (target.kind !== "profile" && Object.hasOwn(target, "os")) throw new Error("Worker placement move operating system requires a profile target");
	switch (target.kind) {
		case "gateway": return { kind: "gateway" };
		case "profile": {
			const machineClass = target.machineClass;
			return {
				kind: "profile",
				profileId: boundedIdentifier(target.profileId, "move profile id"),
				...target.os === void 0 ? {} : { os: boundedIdentifier(target.os, "move operating system", MOVE_OS_MAX_LENGTH) },
				...machineClass === void 0 ? {} : { machineClass: boundedIdentifier(machineClass, "move machine class", MOVE_MACHINE_CLASS_MAX_LENGTH) }
			};
		}
		case "device": return {
			kind: "device",
			deviceId: boundedIdentifier(target.deviceId, "move device id")
		};
	}
	throw new Error("Worker placement move target is invalid");
}
function normalizeWorkerPlacementMoveSource(source) {
	return {
		generation: normalizeGeneration(source.generation),
		environmentId: boundedIdentifier(source.environmentId, "move source environment id"),
		ownerEpoch: normalizeEpoch(source.ownerEpoch, "move source owner epoch")
	};
}
function targetValues(target) {
	switch (target.kind) {
		case "gateway": return {
			target_kind: target.kind,
			target_id: null,
			target_machine_class: null,
			target_os: null
		};
		case "profile": return {
			target_kind: target.kind,
			target_id: target.profileId,
			target_machine_class: target.machineClass ?? null,
			target_os: target.os ?? null
		};
		case "device": return {
			target_kind: target.kind,
			target_id: target.deviceId,
			target_machine_class: null,
			target_os: null
		};
	}
	throw new Error("Worker placement move target is invalid");
}
function normalizeAbandonSource(value) {
	if (value === null) return false;
	if (value === 1) return true;
	throw new Error("Invalid worker placement move source abandonment value");
}
function abandonSourceValue(abandonSource) {
	return abandonSource ? 1 : null;
}
function fromRow(row) {
	const source = normalizeWorkerPlacementMoveSource({
		generation: row.source_generation,
		environmentId: row.source_environment_id,
		ownerEpoch: row.source_owner_epoch
	});
	let target;
	if (row.target_kind !== "profile" && (row.target_machine_class !== null || row.target_os !== null)) throw new Error(`Invalid worker placement move target: ${row.target_kind}`);
	if (row.target_kind === "gateway" && row.target_id === null) target = { kind: "gateway" };
	else if (row.target_kind === "profile" && row.target_id !== null) target = {
		kind: "profile",
		profileId: boundedIdentifier(row.target_id, "move profile id"),
		...row.target_os === null ? {} : { os: boundedIdentifier(row.target_os, "move operating system", MOVE_OS_MAX_LENGTH) },
		...row.target_machine_class === null ? {} : { machineClass: boundedIdentifier(row.target_machine_class, "move machine class", MOVE_MACHINE_CLASS_MAX_LENGTH) }
	};
	else if (row.target_kind === "device" && row.target_id !== null) target = {
		kind: "device",
		deviceId: boundedIdentifier(row.target_id, "move device id")
	};
	else throw new Error(`Invalid worker placement move target: ${row.target_kind}`);
	const abandonSource = normalizeAbandonSource(row.abandon_source);
	if (abandonSource && target.kind !== "gateway") throw new Error("Worker placement move source abandonment requires a Gateway target");
	return {
		operationId: normalizeOperationId(row.operation_id),
		sessionId: required(row.session_id, "move session id"),
		source,
		target,
		abandonSource,
		lastError: row.last_error,
		createdAtMs: row.created_at_ms,
		updatedAtMs: row.updated_at_ms
	};
}
function findMoveRowBySession(db, sessionId) {
	if (!ensureExistingWorkerPlacementMoveSchema(db)) return;
	return executeSqliteQueryTakeFirstSync(db, moveQuery(db).selectFrom("worker_session_placement_moves").selectAll().where("session_id", "=", sessionId));
}
function readWorkerPlacementMove(db, sessionId) {
	const row = findMoveRowBySession(db, sessionId);
	return row ? fromRow(row) : void 0;
}
function findMoveRowByOperation(db, operationId) {
	if (!ensureExistingWorkerPlacementMoveSchema(db)) return;
	return executeSqliteQueryTakeFirstSync(db, moveQuery(db).selectFrom("worker_session_placement_moves").selectAll().where("operation_id", "=", operationId));
}
function requireExactMove(db, input) {
	const operationId = normalizeOperationId(input.operationId);
	const sessionId = required(input.sessionId, "move session id");
	const row = findMoveRowByOperation(db, operationId);
	if (!row || row.session_id !== sessionId) throw new Error(`Session ${sessionId} placement move changed before completion`);
	return fromRow(row);
}
function exactMoveValues(intent) {
	const values = targetValues(intent.target);
	return {
		operation_id: intent.operationId,
		session_id: intent.sessionId,
		source_generation: intent.source.generation,
		source_environment_id: intent.source.environmentId,
		source_owner_epoch: intent.source.ownerEpoch,
		target_kind: values.target_kind,
		abandon_source: abandonSourceValue(intent.abandonSource),
		target_id: values.target_id,
		target_machine_class: values.target_machine_class,
		target_os: values.target_os
	};
}
function deleteExactMove(db, intent) {
	const statement = moveQuery(db).deleteFrom("worker_session_placement_moves").where((eb) => eb.and(exactMoveValues(intent)));
	if (executeSqliteQuerySync(db, statement).numAffectedRows !== 1n) throw new Error(`Session ${intent.sessionId} placement move changed before completion`);
	sessionChanges.emit({
		all: true,
		scope: "worker-placements"
	}, db);
}
function requireExactAttachedEnvironment(db, input) {
	const row = executeSqliteQueryTakeFirstSync(db, moveQuery(db).selectFrom("worker_environments").select([
		"state",
		"owner_epoch",
		"profile_id",
		"attached_session_ids_json"
	]).where("environment_id", "=", input.environmentId));
	let attachedSessionIds;
	try {
		attachedSessionIds = row ? JSON.parse(row.attached_session_ids_json) : void 0;
	} catch {
		attachedSessionIds = void 0;
	}
	if (!row || row.state !== "attached" || row.owner_epoch !== input.ownerEpoch || input.profileId !== void 0 && row.profile_id !== input.profileId || !Array.isArray(attachedSessionIds) || attachedSessionIds.length !== 1 || attachedSessionIds[0] !== input.sessionId) throw new Error(`Cannot move stale worker environment for session ${input.sessionId}`);
}
function createPlacementMoveOps(runtime) {
	const { read, write, now } = runtime;
	return {
		getPlacementMove(sessionId) {
			return readWorkerPlacementMove(read(), required(sessionId, "move session id"));
		},
		getPlacementMoves(sessionIds) {
			const normalizedIds = [...new Set(sessionIds.map((sessionId) => required(sessionId, "move session id")))];
			const results = /* @__PURE__ */ new Map();
			const db = read();
			if (!ensureExistingWorkerPlacementMoveSchema(db)) return results;
			for (let offset = 0; offset < normalizedIds.length; offset += 250) {
				const chunk = normalizedIds.slice(offset, offset + 250);
				for (const row of executeSqliteQuerySync(db, moveQuery(db).selectFrom("worker_session_placement_moves").selectAll().where("session_id", "in", chunk)).rows) {
					const intent = fromRow(row);
					results.set(intent.sessionId, intent);
				}
			}
			return results;
		},
		listPlacementMoves() {
			const db = read();
			if (!ensureExistingWorkerPlacementMoveSchema(db)) return [];
			return executeSqliteQuerySync(db, moveQuery(db).selectFrom("worker_session_placement_moves").selectAll().orderBy("created_at_ms").orderBy("session_id")).rows.map(fromRow);
		},
		beginPlacementMove(input) {
			const sessionId = required(input.sessionId, "move session id");
			const source = normalizeWorkerPlacementMoveSource(input.source);
			const target = normalizeWorkerPlacementMoveTarget(input.target);
			const abandonSource = input.abandonSource === true;
			if (abandonSource && target.kind !== "gateway") throw new Error("Worker placement move source abandonment requires a Gateway target");
			const operationId = `${MOVE_OPERATION_PREFIX}${generateSecureToken(32)}`;
			return write((db) => {
				const existingRow = findMoveRowBySession(db, sessionId);
				if (existingRow) {
					const existing = fromRow(existingRow);
					if (!isDeepStrictEqual(existing.source, source) || !isDeepStrictEqual(existing.target, target) || existing.abandonSource !== abandonSource) throw new Error(`Session ${sessionId} already has a conflicting placement move`);
					return {
						intent: existing,
						placement: getRequired(db, sessionId),
						joined: true
					};
				}
				const current = getRequired(db, sessionId);
				if (current.state !== "active" && !(abandonSource && isForceAbandonedWorkerPlacement(current)) || current.generation !== source.generation || current.environmentId !== source.environmentId || current.activeOwnerEpoch !== source.ownerEpoch) throw new Error(`Cannot move stale worker placement for session ${sessionId}`);
				if (current.state === "active") requireExactAttachedEnvironment(db, {
					sessionId,
					...source
				});
				ensureWorkerPlacementMoveSchema(db);
				const timestamp = now();
				const row = {
					operation_id: operationId,
					session_id: sessionId,
					source_generation: source.generation,
					source_environment_id: source.environmentId,
					source_owner_epoch: source.ownerEpoch,
					...targetValues(target),
					abandon_source: abandonSourceValue(abandonSource),
					last_error: null,
					created_at_ms: timestamp,
					updated_at_ms: timestamp
				};
				executeSqliteQuerySync(db, moveQuery(db).insertInto("worker_session_placement_moves").values(row));
				const placement = current.state === "failed" ? current : drainWorkerSessionPlacement(db, {
					sessionId,
					...source,
					expectedGeneration: source.generation,
					...abandonSource ? { allowPendingWorkspaceResult: true } : {}
				}, timestamp);
				return {
					intent: fromRow(row),
					placement,
					joined: false
				};
			});
		},
		recordPlacementMoveError(input) {
			return write((db) => {
				const row = findMoveRowByOperation(db, normalizeOperationId(input.operationId));
				if (!row || row.session_id !== required(input.sessionId, "move session id")) return false;
				const intent = fromRow(row);
				const statement = moveQuery(db).updateTable("worker_session_placement_moves").set({
					last_error: boundedWorkerError(input.error),
					updated_at_ms: now()
				}).where((eb) => eb.and(exactMoveValues(intent)));
				sessionChanges.emit({
					all: true,
					scope: "worker-placements"
				}, db);
				return executeSqliteQuerySync(db, statement).numAffectedRows === 1n;
			});
		},
		cancelPlacementMove(input) {
			write((db) => {
				deleteExactMove(db, requireExactMove(db, input));
			});
		},
		completePlacementMoveSourceToLocal(input) {
			return write((db) => {
				const intent = requireExactMove(db, input);
				const current = getRequired(db, intent.sessionId);
				if (current.state !== "reconciling" || current.generation !== input.expectedGeneration || current.environmentId !== intent.source.environmentId || current.activeOwnerEpoch !== intent.source.ownerEpoch) throw new Error(`Cannot complete stale Gateway placement move for session ${intent.sessionId}`);
				const values = transitionValues(current, "local", {}, now());
				if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set(values).where("session_id", "=", intent.sessionId).where("state", "=", "reconciling").where("transition_generation", "=", current.generation).where("environment_id", "=", intent.source.environmentId).where("active_owner_epoch", "=", intent.source.ownerEpoch).where("turn_claim_owner", "is", null)).numAffectedRows !== 1n) throw new Error(`Session ${intent.sessionId} changed during Gateway placement move`);
				if (intent.target.kind === "gateway") deleteExactMove(db, intent);
				return getRequired(db, intent.sessionId);
			});
		},
		completeAbandonedPlacementMoveSourceToLocal(input) {
			return write((db) => {
				const intent = requireExactMove(db, input);
				if (!intent.abandonSource || intent.target.kind !== "gateway") throw new Error(`Session ${intent.sessionId} placement move is not an abandonment`);
				const current = getRequired(db, intent.sessionId);
				if (current.state !== "failed" || current.generation !== input.expectedGeneration || current.environmentId !== intent.source.environmentId || current.activeOwnerEpoch !== intent.source.ownerEpoch || current.recoveryError !== input.expectedRecoveryError || current.turnClaim !== null) throw new Error(`Cannot complete stale abandoned placement move for session ${intent.sessionId}`);
				const values = transitionValues(current, "local", {}, now());
				if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set(values).where("session_id", "=", intent.sessionId).where("state", "=", "failed").where("transition_generation", "=", current.generation).where("environment_id", "=", intent.source.environmentId).where("active_owner_epoch", "=", intent.source.ownerEpoch).where("recovery_error", "=", input.expectedRecoveryError).where("turn_claim_owner", "is", null)).numAffectedRows !== 1n) throw new Error(`Session ${intent.sessionId} changed during abandoned placement move`);
				deleteExactMove(db, intent);
				return getRequired(db, intent.sessionId);
			});
		},
		completePlacementMoveToWorker(input) {
			const environmentId = boundedIdentifier(input.environmentId, "move destination environment id");
			const ownerEpoch = normalizeEpoch(input.ownerEpoch, "move destination owner epoch");
			return write((db) => {
				const intent = requireExactMove(db, input);
				if (intent.target.kind === "gateway") throw new Error(`Session ${intent.sessionId} placement move target is not a worker`);
				const current = getRequired(db, intent.sessionId);
				if (current.state !== "active" || current.generation !== input.expectedGeneration || current.environmentId !== environmentId || current.activeOwnerEpoch !== ownerEpoch) throw new Error(`Cannot complete stale worker placement move for session ${intent.sessionId}`);
				const profileId = intent.target.kind === "profile" ? intent.target.profileId : `device:${intent.target.deviceId}`;
				requireExactAttachedEnvironment(db, {
					sessionId: intent.sessionId,
					environmentId,
					ownerEpoch,
					profileId
				});
				deleteExactMove(db, intent);
				return current;
			});
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-pending-failure.ts
function createPlacementPendingFailureOps(runtime) {
	const { now, path, write } = runtime;
	return { failWorkspaceResultAndReleaseTurn(pending, error) {
		const sessionId = required(pending.sessionId, "session id");
		const recoveryError = boundedWorkerError(error);
		const outcome = write((db) => {
			const current = getRequired(db, sessionId);
			if (!isCurrentWorkerWorkspacePendingResultOwner(current, pending)) throw new Error(`Session ${sessionId} workspace result owner changed before failure`);
			const persisted = current.turnClaim;
			const releasedClaim = persisted ? {
				sessionId,
				claimId: persisted.claimId,
				runId: persisted.runId,
				placementGeneration: persisted.generation,
				owner: placementTurnOwner(current)
			} : null;
			const pendingQuery = getNodeSqliteKysely(db);
			if (!executeSqliteQuerySync(db, pendingQuery.selectFrom("worker_workspace_pending_results").select("session_id").where("session_id", "=", sessionId).where("environment_id", "=", pending.environmentId).where("owner_epoch", "=", pending.ownerEpoch).where("placement_generation", "=", pending.placementGeneration).where("claim_id", "=", pending.claimId).where("run_id", "=", pending.runId)).rows[0]) throw new Error(`Session ${sessionId} workspace result changed before failure`);
			const terminalAtMs = now();
			let transitioning = current;
			if (transitioning.state === "active") {
				const values = transitionValues(transitioning, "draining", {}, terminalAtMs);
				if (persisted) {
					values.turn_claim_owner = persisted.owner;
					values.turn_claim_id = persisted.claimId;
					values.turn_claim_run_id = persisted.runId;
					values.turn_claim_generation = persisted.generation;
					values.turn_claim_owner_epoch = persisted.ownerEpoch;
				}
				if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set(values).where("session_id", "=", sessionId).where("state", "=", "active").where("transition_generation", "=", transitioning.generation)).numAffectedRows !== 1n) throw new Error(`Session ${sessionId} workspace result changed during drain`);
				transitioning = getRequired(db, sessionId);
			}
			if (transitioning.state !== "draining") throw new Error(`Session ${sessionId} workspace result did not reach draining`);
			if (persisted) {
				assertNoRunningWorkerSessionToolOperations(db, {
					sessionId,
					claimId: persisted.claimId
				});
				clearWorkerTurnToolState(db, {
					sessionId,
					claimId: persisted.claimId
				});
			}
			const reconcilingValues = transitionValues(transitioning, "reconciling", {}, terminalAtMs);
			if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set(reconcilingValues).where("session_id", "=", sessionId).where("state", "=", "draining").where("transition_generation", "=", transitioning.generation)).numAffectedRows !== 1n) throw new Error(`Session ${sessionId} workspace result changed during reconcile`);
			transitioning = getRequired(db, sessionId);
			const failedValues = transitionValues(transitioning, "failed", {
				recoveryError,
				terminalReason: recoveryError
			}, terminalAtMs);
			if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set(failedValues).where("session_id", "=", sessionId).where("state", "=", "reconciling").where("transition_generation", "=", transitioning.generation).where("turn_claim_owner", "is", null)).numAffectedRows !== 1n) throw new Error(`Session ${sessionId} workspace result changed during failure`);
			if (executeSqliteQuerySync(db, pendingQuery.deleteFrom("worker_workspace_pending_results").where("session_id", "=", sessionId).where("environment_id", "=", pending.environmentId).where("owner_epoch", "=", pending.ownerEpoch).where("placement_generation", "=", pending.placementGeneration).where("claim_id", "=", pending.claimId).where("run_id", "=", pending.runId)).numAffectedRows !== 1n) throw new Error(`Session ${sessionId} workspace result changed during failure`);
			sessionChanges.emit({
				agentId: current.agentId,
				sessionKey: current.sessionKey
			}, db);
			return {
				record: getRequired(db, sessionId),
				releasedClaim
			};
		});
		if (outcome.releasedClaim) signalWorkerTurnClaimClosed(path, outcome.releasedClaim);
		return outcome.record;
	} };
}
//#endregion
//#region src/gateway/worker-environments/placement-store.ts
const RETIRABLE_PLACEMENT_STATES = [
	"local",
	"requested",
	"reclaimed",
	"failed"
];
function exactConflictPath(value) {
	if (typeof value !== "string" || value.length === 0) throw new Error("Worker placement conflict path is required");
	return value;
}
function updateTransition(db, current, to, patch, nowMs) {
	const values = transitionValues(current, to, patch, nowMs);
	if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set(values).where("session_id", "=", current.sessionId).where("state", "=", current.state).where("transition_generation", "=", current.generation).where("turn_claim_owner", "is", null)).numAffectedRows !== 1n) throw new Error(`Worker session placement ${current.sessionId} changed during transition`);
	const updated = getRequired(db, current.sessionId);
	if (updated.state === "active") {
		const activated = executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("worker_environments").set((eb) => ({ last_activated_at_ms: eb.case().when("last_activated_at_ms", ">", nowMs).then(eb.ref("last_activated_at_ms")).else(nowMs).end() })).where("environment_id", "=", updated.environmentId).where("state", "=", "attached").where("destroy_requested_at_ms", "is", null).where("owner_epoch", "=", updated.activeOwnerEpoch).where("attached_session_ids_json", "=", JSON.stringify([updated.sessionId])).returning("last_activated_at_ms"));
		if (activated.rows.length !== 1) throw new Error(`Worker session placement ${current.sessionId} lost its attached environment`);
		publishWorkerEnvironmentNativeMutation(db, updated.environmentId, { lastActivatedAtMs: activated.rows[0].last_activated_at_ms });
	}
	return updated;
}
function createWorkerSessionPlacementStore(options = {}) {
	const path = (options.database ?? openOpenClawStateDatabase()).path;
	const now = options.now ?? Date.now;
	const runtime = {
		path,
		instanceId: randomUUID(),
		now,
		read: () => openOpenClawStateDatabase({ path }).db,
		write: (operation) => runOpenClawStateWriteTransaction(({ db }) => operation(db), { path })
	};
	const { read, write } = runtime;
	const workspaceResultConflicts = /* @__PURE__ */ new Map();
	const withWorkspaceResultConflict = (record) => {
		if (!record) return;
		const conflict = workspaceResultConflicts.get(record.sessionId)?.conflict;
		return conflict ? {
			...record,
			workspaceResultConflict: conflict
		} : record;
	};
	const store = {
		...createPlacementWorkspaceReservationOps(runtime),
		...createPlacementTurnClaimOps(runtime),
		...createPlacementPendingFailureOps(runtime),
		...createPlacementMoveOps(runtime),
		...createPlacementWorkspaceJournalOps(runtime),
		...createPlacementWorkspaceResultOps(runtime),
		registerTurnClaimClosedHandler(handler) {
			return registerWorkerTurnClaimClosedHandler(path, handler);
		},
		get(sessionId) {
			return withWorkspaceResultConflict(find(read(), required(sessionId, "session id")));
		},
		async readProjection(sessionIds) {
			const requestedIds = new Map(sessionIds.map((id) => [id, required(id, "session id")]));
			const ids = [...new Set(requestedIds.values())];
			const conflicts = new Map(ids.flatMap((id) => {
				const conflict = workspaceResultConflicts.get(id);
				return conflict ? [[id, conflict]] : [];
			}));
			const result = await executeExistingOpenClawStateRead({ path }, {
				type: "workers.placementProjection",
				sessionIds: ids,
				conflictBindings: [...conflicts.values()].map(({ placement, claim }) => ({
					placement: {
						sessionId: placement.sessionId,
						generation: placement.generation,
						environmentId: placement.environmentId,
						activeOwnerEpoch: placement.activeOwnerEpoch
					},
					claim: { ...claim }
				}))
			});
			if (!result || !result.ok || result.type !== "workers.placementProjection") throw new Error("Worker placement projection source is unavailable");
			const { projection, conflictSessionIds } = result.result;
			const placements = new Map(projection.placements);
			for (const [id, captured] of conflicts) {
				const record = placements.get(id);
				if (record && conflictSessionIds.has(id) && workspaceResultConflicts.get(id) === captured) placements.set(id, {
					...record,
					workspaceResultConflict: captured.conflict
				});
			}
			const byRequestedId = (records) => {
				const requested = /* @__PURE__ */ new Map();
				for (const [original, normalized] of requestedIds) {
					const value = records.get(normalized);
					if (value !== void 0) requested.set(original, value);
				}
				return requested;
			};
			return {
				...projection,
				placements: byRequestedId(placements),
				moves: byRequestedId(projection.moves),
				workspaceResultReconcilingSessionIds: new Set([...requestedIds].flatMap(([original, normalized]) => projection.workspaceResultReconcilingSessionIds.has(normalized) ? [original] : []))
			};
		},
		getMany(sessionIds) {
			const normalizedIds = [...new Set(sessionIds.map((sessionId) => required(sessionId, "session id")))];
			const records = /* @__PURE__ */ new Map();
			const db = read();
			for (let offset = 0; offset < normalizedIds.length; offset += 250) {
				const chunk = normalizedIds.slice(offset, offset + 250);
				for (const row of executeSqliteQuerySync(db, query(db).selectFrom("worker_session_placements").selectAll().where("session_id", "in", chunk)).rows) {
					const record = fromRow$1(row);
					records.set(record.sessionId, withWorkspaceResultConflict(record));
				}
			}
			return records;
		},
		getWorkspaceResultReconcilingSessionIds(sessionIds) {
			const normalizedIds = [...new Set(sessionIds.map((sessionId) => required(sessionId, "session id")))];
			return readWorkerWorkspaceReconciliationFacts(read(), normalizedIds).reconcilingSessionIds;
		},
		retireSessionPlacement(input) {
			const sessionId = required(input.sessionId, "session id");
			if (!RETIRABLE_PLACEMENT_STATES.includes(input.expectedState)) throw new Error(`Cannot retire worker session placement from ${input.expectedState}`);
			write((db) => {
				if (executeSqliteQuerySync(db, query(db).deleteFrom("worker_session_placements").where("session_id", "=", sessionId).where("state", "=", input.expectedState).where("transition_generation", "=", input.expectedGeneration).where("turn_claim_owner", "is", null).where("turn_claim_id", "is", null).where("turn_claim_run_id", "is", null).where("turn_claim_generation", "is", null).where("turn_claim_owner_epoch", "is", null)).numAffectedRows !== 1n) throw new Error(`Worker session placement ${sessionId} changed before retirement`);
			});
			workspaceResultConflicts.delete(sessionId);
		},
		recordWorkspaceResultConflict(claim, conflict) {
			const db = read();
			const current = find(db, required(claim.sessionId, "session id"));
			if (!current || !isCurrentPlacementTurnClaim(current, claim) && !hasCurrentWorkspaceResultClaim(db, claim)) throw new Error(`Session ${claim.sessionId} workspace result conflict owner changed`);
			if (!conflict) {
				workspaceResultConflicts.delete(claim.sessionId);
				sessionChanges.emit({
					agentId: current.agentId,
					sessionKey: current.sessionKey
				});
				return;
			}
			const paths = conflict.paths.map(exactConflictPath);
			const stagedResultRef = required(conflict.stagedResultRef, "staged result ref");
			if (paths.length === 0 || !/^refs\/openclaw\/worker-results\/[A-Za-z0-9-]+$/u.test(stagedResultRef)) throw new Error("Cloud workspace result conflict projection is invalid");
			workspaceResultConflicts.set(claim.sessionId, {
				conflict: projectWorkspaceResultConflict(paths, stagedResultRef, conflict.totalCount),
				placement: current,
				claim: { ...claim }
			});
			sessionChanges.emit({
				agentId: current.agentId,
				sessionKey: current.sessionKey
			});
		},
		bindPreparedEnvironment(input) {
			return write((db) => {
				const nowMs = now();
				const current = consumePreparedEnvironment(db, input, nowMs);
				return current ? updateTransition(db, current, "provisioning", { environmentId: input.environmentId }, nowMs) : void 0;
			});
		},
		startDispatch(input) {
			const identity = normalizeIdentity(input);
			const executionMode = normalizeWorkerPlacementExecutionMode(input.executionMode);
			return write((db) => {
				const current = ensureLocal(db, identity, now());
				assertSessionWorkspaceUnreserved(db, identity.sessionId);
				if (current.state !== "local" && current.state !== "reclaimed" && current.state !== "failed") throw new Error(`Cannot dispatch session ${identity.sessionId} from placement ${current.state}`);
				const updatedAtMs = now();
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
					updated_at_ms: updatedAtMs,
					state_changed_at_ms: updatedAtMs
				}).where("session_id", "=", current.sessionId).where("state", "=", current.state).where("transition_generation", "=", current.generation)).numAffectedRows !== 1n) throw new Error(`Session ${identity.sessionId} placement changed during dispatch barrier`);
				return getRequired(db, identity.sessionId);
			});
		},
		transition(input) {
			if (!canTransitionWorkerSessionPlacement(input.from, input.to)) throw new Error(`Illegal worker session placement transition: ${input.from} -> ${input.to}`);
			if (input.from === "draining" && input.to === "reconciling") throw new Error("Use startReconcile after fencing the drained worker environment");
			if (input.to === "failed") throw new Error("Use fail to record terminal worker placement diagnostics");
			const sessionId = required(input.sessionId, "session id");
			return write((db) => {
				const current = getRequired(db, sessionId);
				if (current.state !== input.from || current.generation !== input.expectedGeneration) throw new Error(`Worker session placement ${sessionId} changed: expected ${input.from}@${input.expectedGeneration}, found ${current.state}@${current.generation}`);
				if (current.turnClaim) throw new Error(`Cannot transition session ${sessionId} during an active turn`);
				return updateTransition(db, current, input.to, input.patch ?? {}, now());
			});
		},
		startDrain(input) {
			return write((db) => drainWorkerSessionPlacement(db, input, now()));
		},
		startWorkspaceResultDrain(claim) {
			return write((db) => {
				const current = getRequired(db, required(claim.sessionId, "session id"));
				const ownsWorkspaceResult = hasCurrentWorkspaceResultClaim(db, claim);
				const owner = resolvePlacementTurnEnvironment(current, claim) ?? (ownsWorkspaceResult && current.state === "active" && current.environmentId && current.activeOwnerEpoch !== null ? {
					environmentId: current.environmentId,
					ownerEpoch: current.activeOwnerEpoch
				} : void 0);
				if (current.state !== "active" || !owner || !ownsWorkspaceResult) throw new Error(`Cannot drain stale workspace result for session ${claim.sessionId}`);
				return drainWorkerSessionPlacement(db, {
					sessionId: current.sessionId,
					environmentId: owner.environmentId,
					ownerEpoch: owner.ownerEpoch,
					expectedGeneration: current.generation,
					allowPendingWorkspaceResult: true
				}, now());
			});
		},
		startReconcile(input) {
			const sessionId = required(input.sessionId, "session id");
			const environmentId = required(input.environmentId, "environment id");
			const ownerEpoch = normalizeEpoch(input.ownerEpoch, "active owner epoch");
			const outcome = write((db) => {
				const current = getRequired(db, sessionId);
				if (current.state !== "draining" || current.generation !== input.expectedGeneration || current.environmentId !== environmentId || current.activeOwnerEpoch !== ownerEpoch) throw new Error(`Cannot reconcile stale worker placement for session ${sessionId}`);
				if (hasWorkerWorkspacePendingResult(db, sessionId)) throw new Error(`Cannot reconcile session ${sessionId} with a pending cloud workspace result`);
				const claim = current.turnClaim;
				if (claim?.owner === "local" && input.forceLocalClaim !== true) throw new Error(`Cannot reconcile session ${sessionId} while its local turn is active`);
				if (claim) {
					assertNoRunningWorkerSessionToolOperations(db, {
						sessionId,
						claimId: claim.claimId
					});
					clearWorkerTurnToolState(db, {
						sessionId,
						claimId: claim.claimId
					});
				}
				const values = transitionValues(current, "reconciling", {}, now());
				const update = query(db).updateTable("worker_session_placements").set(values).where("session_id", "=", sessionId).where("state", "=", "draining").where("transition_generation", "=", current.generation).where("environment_id", "=", environmentId).where("active_owner_epoch", "=", ownerEpoch);
				const guardedUpdate = claim ? update.where("turn_claim_owner", "=", claim.owner).where("turn_claim_id", "=", claim.claimId).where("turn_claim_run_id", "=", claim.runId).where("turn_claim_generation", "=", claim.generation).where("turn_claim_owner_epoch", claim.owner === "worker" ? "=" : "is", claim.ownerEpoch) : update.where("turn_claim_owner", "is", null);
				if (executeSqliteQuerySync(db, guardedUpdate).numAffectedRows !== 1n) throw new Error(`Worker session placement ${sessionId} changed during reconcile`);
				return {
					record: getRequired(db, sessionId),
					releasedClaim: claim ? {
						sessionId,
						claimId: claim.claimId,
						runId: claim.runId,
						placementGeneration: claim.generation,
						owner: placementTurnOwner(current)
					} : void 0
				};
			});
			if (outcome.releasedClaim) signalWorkerTurnClaimClosed(path, outcome.releasedClaim);
			return outcome.record;
		},
		validateWorkerOwner(input) {
			const current = find(read(), required(input.sessionId, "session id"));
			return current?.state === "active" && current.environmentId === required(input.environmentId, "environment id") && current.activeOwnerEpoch === normalizeEpoch(input.ownerEpoch, "active owner epoch");
		},
		fail(input) {
			const sessionId = required(input.sessionId, "session id");
			const recoveryError = boundedWorkerError(input.recoveryError);
			const outcome = write((db) => {
				const current = getRequired(db, sessionId);
				if (input.expectedGeneration !== void 0 && current.generation !== input.expectedGeneration) throw new Error(`Worker session placement ${sessionId} changed before failure`);
				if (current.state === "failed") {
					if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set({
						recovery_error: recoveryError,
						updated_at_ms: now()
					}).where("session_id", "=", sessionId).where("state", "=", "failed").where("transition_generation", "=", current.generation)).numAffectedRows !== 1n) throw new Error(`Worker session placement ${sessionId} changed during failure update`);
					return {
						record: getRequired(db, sessionId),
						releasedClaim: void 0
					};
				}
				if (!canTransitionWorkerSessionPlacement(current.state, "failed")) throw new Error(`Cannot fail worker session placement from ${current.state}`);
				const localClaim = current.turnClaim?.owner === "local" ? current.turnClaim : null;
				const updatedAtMs = now();
				if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set({
					state: "failed",
					transition_generation: nextGeneration(current.generation),
					recovery_error: recoveryError,
					terminal_reason: recoveryError,
					terminal_at_ms: updatedAtMs,
					turn_claim_owner: localClaim ? "local" : null,
					turn_claim_id: localClaim?.claimId ?? null,
					turn_claim_run_id: localClaim?.runId ?? null,
					turn_claim_generation: localClaim?.generation ?? null,
					turn_claim_owner_epoch: null,
					updated_at_ms: updatedAtMs,
					state_changed_at_ms: updatedAtMs
				}).where("session_id", "=", sessionId).where("state", "=", current.state).where("transition_generation", "=", current.generation)).numAffectedRows !== 1n) throw new Error(`Worker session placement ${sessionId} changed during failure`);
				return {
					record: getRequired(db, sessionId),
					releasedClaim: projectWorkerSessionTurnClaim(current)
				};
			});
			if (outcome.releasedClaim) signalWorkerTurnClaimClosed(path, outcome.releasedClaim);
			return outcome.record;
		},
		adoptActive(input) {
			const sessionId = required(input.sessionId, "session id");
			const environmentId = required(input.environmentId, "environment id");
			const ownerEpoch = normalizeEpoch(input.ownerEpoch, "active owner epoch");
			const current = getRequired(read(), sessionId);
			if (current.state !== "active" || current.environmentId !== environmentId || current.activeOwnerEpoch !== ownerEpoch || input.expectedGeneration !== void 0 && current.generation !== input.expectedGeneration) throw new Error(`Cannot adopt stale worker placement for session ${sessionId}`);
			return current;
		},
		listForReconcile(sessionKey) {
			const db = read();
			let select = query(db).selectFrom("worker_session_placements").selectAll().where("state", "not in", ["local", "reclaimed"]);
			if (sessionKey !== void 0) select = select.where("session_key", "=", sessionKey);
			return executeSqliteQuerySync(db, select.orderBy("updated_at_ms").orderBy("session_id")).rows.map((row) => withWorkspaceResultConflict(fromRow$1(row)));
		},
		list() {
			const db = read();
			return executeSqliteQuerySync(db, query(db).selectFrom("worker_session_placements").selectAll().orderBy("session_id")).rows.map((row) => withWorkspaceResultConflict(fromRow$1(row)));
		},
		async readChangeSnapshot() {
			const reply = await executeExistingOpenClawStateRead({ path }, { type: "workerPlacements.changeSnapshot" }, { current: true });
			if (!reply || !reply.ok || reply.type !== "workerPlacements.changeSnapshot") throw new Error("Worker placement change snapshot is unavailable");
			return reply.placements;
		}
	};
	attachWorkerTurnExecutionIdentityStore(store, path);
	return store;
}
//#endregion
export { createWorkerSessionPlacementStore as t };
