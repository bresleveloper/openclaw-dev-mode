import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { c as normalizeEpoch, d as normalizeWorkerPlacementExecutionMode, f as nullableRequired, g as required, o as nextGeneration, r as assertRecordShape, s as normalizeCursor, u as normalizeTimestamp } from "./placement-record-CB6gcJKw.mjs";
//#region src/gateway/worker-environments/placement-state.ts
const WORKER_SESSION_PLACEMENT_STATES = [
	"local",
	"requested",
	"provisioning",
	"syncing",
	"starting",
	"active",
	"draining",
	"reconciling",
	"reclaimed",
	"failed"
];
const WORKER_SESSION_PLACEMENT_TRANSITIONS = {
	local: ["requested", "failed"],
	requested: ["provisioning", "failed"],
	provisioning: ["syncing", "failed"],
	syncing: ["starting", "failed"],
	starting: ["active", "failed"],
	active: ["draining"],
	draining: ["reconciling"],
	reconciling: [
		"local",
		"reclaimed",
		"failed"
	],
	reclaimed: ["requested"],
	failed: ["local", "requested"]
};
function parseWorkerSessionPlacementState(value) {
	if (WORKER_SESSION_PLACEMENT_STATES.includes(value)) return value;
	throw new Error(`Invalid worker session placement state: ${value}`);
}
function canTransitionWorkerSessionPlacement(from, to) {
	return WORKER_SESSION_PLACEMENT_TRANSITIONS[from].includes(to);
}
//#endregion
//#region src/gateway/worker-environments/placement-row-codec.ts
const query = (db) => getNodeSqliteKysely(db);
function parseTurnClaim(row) {
	if (row.turn_claim_owner === null) return null;
	const claimId = required(row.turn_claim_id ?? "", "turn claim id");
	const runId = required(row.turn_claim_run_id ?? "", "turn claim run id");
	const generation = row.turn_claim_generation;
	if (generation === null || !Number.isSafeInteger(generation) || generation < 0) throw new Error("Worker session placement turn claim generation is invalid");
	if (row.turn_claim_owner === "local") {
		if (row.turn_claim_owner_epoch !== null) throw new Error("Local turn claim cannot retain a worker owner epoch");
		return {
			owner: "local",
			claimId,
			runId,
			generation,
			ownerEpoch: null
		};
	}
	if (row.turn_claim_owner === "worker") return {
		owner: "worker",
		claimId,
		runId,
		generation,
		ownerEpoch: normalizeEpoch(row.turn_claim_owner_epoch ?? 0, "turn claim owner epoch")
	};
	throw new Error(`Invalid worker session turn claim owner: ${row.turn_claim_owner}`);
}
function fromRow(row) {
	const state = parseWorkerSessionPlacementState(row.state);
	const executionMode = normalizeWorkerPlacementExecutionMode(row.execution_mode);
	const parsed = {
		environmentId: row.environment_id === null ? null : required(row.environment_id, "environment id"),
		activeOwnerEpoch: row.active_owner_epoch === null ? null : normalizeEpoch(row.active_owner_epoch, "active owner epoch"),
		workspaceBaseManifestRef: nullableRequired(row.workspace_base_manifest_ref, "workspace base manifest ref"),
		remoteWorkspaceDir: nullableRequired(row.remote_workspace_dir, "remote workspace directory"),
		workerBundleHash: nullableRequired(row.worker_bundle_hash, "worker bundle hash"),
		lastTranscriptAckCursor: normalizeCursor(row.last_transcript_ack_cursor, "transcript ACK cursor"),
		lastLiveEventAckCursor: normalizeCursor(row.last_live_event_ack_cursor, "live ACK cursor"),
		terminalReason: nullableRequired(row.terminal_reason, "terminal reason"),
		terminalAtMs: normalizeTimestamp(row.terminal_at_ms, "terminal timestamp")
	};
	const recoveryError = nullableRequired(row.recovery_error, "recovery error");
	const turnClaim = parseTurnClaim(row);
	const record = {
		sessionId: row.session_id,
		agentId: row.agent_id,
		sessionKey: row.session_key,
		executionMode,
		generation: row.transition_generation,
		createdAtMs: row.created_at_ms,
		updatedAtMs: row.updated_at_ms,
		stateChangedAtMs: row.state_changed_at_ms,
		state,
		turnClaim,
		...parsed,
		recoveryError
	};
	assertRecordShape(record);
	return record;
}
function find(db, sessionId) {
	const row = executeSqliteQueryTakeFirstSync(db, query(db).selectFrom("worker_session_placements").selectAll().where("session_id", "=", sessionId));
	return row ? fromRow(row) : void 0;
}
function getRequired(db, sessionId) {
	const record = find(db, sessionId);
	if (!record) throw new Error(`Unknown worker session placement: ${sessionId}`);
	return record;
}
function assertIdentity(record, identity) {
	if (record.agentId !== identity.agentId || record.sessionKey !== identity.sessionKey) throw new Error(`Worker session placement identity changed for ${identity.sessionId}`);
}
function insertLocal(db, identity, nowMs) {
	executeSqliteQuerySync(db, query(db).insertInto("worker_session_placements").values({
		session_id: identity.sessionId,
		agent_id: identity.agentId,
		session_key: identity.sessionKey,
		execution_mode: null,
		state: "local",
		environment_id: null,
		transition_generation: 0,
		active_owner_epoch: null,
		workspace_base_manifest_ref: null,
		remote_workspace_dir: null,
		worker_bundle_hash: null,
		last_transcript_ack_cursor: null,
		last_live_event_ack_cursor: null,
		recovery_error: null,
		terminal_reason: null,
		terminal_at_ms: null,
		turn_claim_owner: null,
		turn_claim_id: null,
		turn_claim_run_id: null,
		turn_claim_generation: null,
		turn_claim_owner_epoch: null,
		created_at_ms: nowMs,
		updated_at_ms: nowMs,
		state_changed_at_ms: nowMs
	}));
	return getRequired(db, identity.sessionId);
}
function ensureLocal(db, identity, nowMs) {
	const current = find(db, identity.sessionId);
	if (current) {
		assertIdentity(current, identity);
		return current;
	}
	return insertLocal(db, identity, nowMs);
}
function transitionValues(current, to, patch, nowMs) {
	const environmentId = to === "local" || to === "requested" ? null : patch.environmentId === void 0 ? current.environmentId : patch.environmentId === null ? null : required(patch.environmentId, "environment id");
	const activeOwnerEpoch = to === "local" || to === "requested" || to === "provisioning" || to === "syncing" || to === "starting" ? null : patch.activeOwnerEpoch === void 0 ? current.activeOwnerEpoch : patch.activeOwnerEpoch === null ? null : normalizeEpoch(patch.activeOwnerEpoch, "active owner epoch");
	const generation = nextGeneration(current.generation);
	const clearsWorkerMetadata = to === "local" || to === "requested";
	const values = {
		session_id: current.sessionId,
		agent_id: current.agentId,
		session_key: current.sessionKey,
		execution_mode: current.executionMode,
		state: to,
		environment_id: environmentId,
		transition_generation: generation,
		active_owner_epoch: activeOwnerEpoch,
		workspace_base_manifest_ref: clearsWorkerMetadata ? null : patch.workspaceBaseManifestRef === void 0 ? current.workspaceBaseManifestRef : patch.workspaceBaseManifestRef === null ? null : required(patch.workspaceBaseManifestRef, "workspace base manifest ref"),
		remote_workspace_dir: clearsWorkerMetadata ? null : patch.remoteWorkspaceDir === void 0 ? current.remoteWorkspaceDir : patch.remoteWorkspaceDir === null ? null : required(patch.remoteWorkspaceDir, "remote workspace directory"),
		worker_bundle_hash: clearsWorkerMetadata ? null : patch.workerBundleHash === void 0 ? current.workerBundleHash : patch.workerBundleHash === null ? null : required(patch.workerBundleHash, "worker bundle hash"),
		last_transcript_ack_cursor: clearsWorkerMetadata ? null : patch.lastTranscriptAckCursor === void 0 ? current.lastTranscriptAckCursor : normalizeCursor(patch.lastTranscriptAckCursor, "transcript ACK cursor"),
		last_live_event_ack_cursor: clearsWorkerMetadata ? null : patch.lastLiveEventAckCursor === void 0 ? current.lastLiveEventAckCursor : normalizeCursor(patch.lastLiveEventAckCursor, "live ACK cursor"),
		recovery_error: clearsWorkerMetadata ? null : patch.recoveryError === void 0 ? current.recoveryError : patch.recoveryError === null ? null : required(patch.recoveryError, "recovery error"),
		terminal_reason: to === "failed" ? patch.terminalReason === void 0 ? current.terminalReason : patch.terminalReason === null ? null : required(patch.terminalReason, "terminal reason") : null,
		terminal_at_ms: to === "reclaimed" || to === "failed" ? current.terminalAtMs ?? nowMs : null,
		turn_claim_owner: null,
		turn_claim_id: null,
		turn_claim_run_id: null,
		turn_claim_generation: null,
		turn_claim_owner_epoch: null,
		created_at_ms: current.createdAtMs,
		updated_at_ms: nowMs,
		state_changed_at_ms: nowMs
	};
	assertRecordShape({
		state: to,
		executionMode: current.executionMode,
		environmentId,
		activeOwnerEpoch,
		workspaceBaseManifestRef: values.workspace_base_manifest_ref,
		remoteWorkspaceDir: values.remote_workspace_dir,
		workerBundleHash: values.worker_bundle_hash,
		lastTranscriptAckCursor: values.last_transcript_ack_cursor,
		lastLiveEventAckCursor: values.last_live_event_ack_cursor,
		recoveryError: values.recovery_error,
		terminalReason: values.terminal_reason,
		terminalAtMs: values.terminal_at_ms,
		turnClaim: null
	});
	return values;
}
//#endregion
export { query as a, getRequired as i, find as n, transitionValues as o, fromRow as r, canTransitionWorkerSessionPlacement as s, ensureLocal as t };
