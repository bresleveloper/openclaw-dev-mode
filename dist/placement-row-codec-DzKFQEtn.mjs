import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as registerListener } from "./listeners-BogSNJ-R.mjs";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { t as assertTransactionUsable } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { v as registerOpenClawStateDatabaseLifecycleListener, y as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-MyNs7ITg.mjs";
import { t as SESSION_PLACEMENT_STATES } from "./session-placement-state-BsPYZ8PU.mjs";
import { _ as sameWorkerSessionTurnClaim, d as nullableRequired, f as placementTurnOwner, h as required, i as isCurrentPlacementTurnClaim, l as normalizeNonNegativeInteger, o as nextGeneration, r as assertRecordShape, s as normalizeEpoch, u as normalizeWorkerPlacementExecutionMode } from "./placement-record-BfcBeilz.mjs";
import { t as publishWorkerEnvironmentNativeMutation } from "./store-native-publication-BFCYOamu.mjs";
//#region src/gateway/worker-environments/placement-workspace-result-owner.ts
function matchesWorkspaceResultGeneration(placement, generation) {
	return (placement.state === "active" || placement.state === "draining") && (placement.generation === generation || placement.state === "draining" && placement.generation === generation + 1);
}
function isCurrentWorkerWorkspacePendingResultOwner(placement, pending) {
	if (placement?.state !== "active" && placement?.state !== "draining" || placement.sessionId !== pending.sessionId || placement.environmentId !== pending.environmentId || placement.activeOwnerEpoch !== pending.ownerEpoch) return false;
	if (placement.turnClaim) return isCurrentPlacementTurnClaim(placement, {
		sessionId: pending.sessionId,
		claimId: pending.claimId,
		runId: pending.runId,
		placementGeneration: pending.placementGeneration,
		owner: placementTurnOwner(placement)
	});
	return matchesWorkspaceResultGeneration(placement, pending.placementGeneration);
}
function matchesWorkspaceResultClaim(placement, pending, claim) {
	const recoveryOwner = placement.state === "active" || placement.state === "draining" ? placementTurnOwner(placement) : void 0;
	return pending.sessionId === claim.sessionId && pending.environmentId === placement.environmentId && pending.ownerEpoch === placement.activeOwnerEpoch && pending.placementGeneration === claim.placementGeneration && pending.claimId === claim.claimId && pending.runId === claim.runId && (isCurrentPlacementTurnClaim(placement, claim) || matchesWorkspaceResultGeneration(placement, claim.placementGeneration) && placement.turnClaim === null && recoveryOwner?.kind === "local" && claim.owner.kind === "local" && claim.owner.environmentId === recoveryOwner.environmentId && claim.owner.ownerEpoch === recoveryOwner.ownerEpoch);
}
//#endregion
//#region src/gateway/worker-environments/placement-turn-authority.ts
function notifyRevoked(claim) {
	if (!claim.revoked) return;
	const listeners = [...claim.listeners];
	claim.listeners.clear();
	for (const listener of listeners) try {
		listener();
	} catch {}
}
function closeOwner(owner) {
	owner.active = false;
	owner.pending.clear();
	owner.published.clear();
	owner.tools.clear();
	owner.workspaceResults.clear();
	const claims = Array.from(owner.claims.values()).flatMap((retained) => Array.from(retained));
	for (const claim of claims) claim.revoked = true;
	for (const claim of claims) notifyRevoked(claim);
	owner.claims.clear();
	owner.observations.clear();
}
const owners = resolveGlobalSingleton(Symbol.for("openclaw.placementTurnAuthorities"), () => /* @__PURE__ */ new Map(), (registered) => {
	for (const owner of registered.values()) closeOwner(owner);
	registered.clear();
});
function ownerFor(identity) {
	const existing = owners.get(identity.key);
	if (existing?.active) return existing;
	const owner = {
		identity,
		active: true,
		claims: /* @__PURE__ */ new Map(),
		observations: /* @__PURE__ */ new Map(),
		pending: /* @__PURE__ */ new Set(),
		sequence: 0,
		published: /* @__PURE__ */ new Map(),
		tools: /* @__PURE__ */ new Map(),
		workspaceResults: /* @__PURE__ */ new Map()
	};
	owners.set(identity.key, owner);
	return owner;
}
registerOpenClawStateDatabaseLifecycleListener((event) => {
	if (event.kind === "opened") return;
	for (const [key, owner] of owners) if (key === event.identity?.key || owner.identity.canonicalPath === (event.identity?.canonicalPath ?? event.path)) {
		closeOwner(owner);
		owners.delete(key);
	}
});
function allows(change, claim) {
	return change.kind !== "claim" || change.sessionId !== claim.sessionId || Boolean(change.facts && isCurrentPlacementTurnClaim(change.facts, claim));
}
function prunePublication(owner, sessionId) {
	if (!owner.claims.has(sessionId) && !owner.workspaceResults.has(sessionId) && !owner.observations.has(sessionId) && ![...owner.pending].some((change) => change.sessionId === sessionId)) {
		owner.published.delete(sessionId);
		if (!owner.tools.get(sessionId)?.authority) owner.tools.delete(sessionId);
	}
}
function commitChange(owner, change, sequence) {
	owner.pending.delete(change);
	if (!owner.active) return;
	const tools = owner.tools.get(change.sessionId);
	if (change.kind === "tools") {
		if (sequence > (tools?.sequence ?? -1)) {
			const authority = change.authority;
			if (!tools?.authority || authority || tools.authority.claim.claimId === change.claimId) owner.tools.set(change.sessionId, {
				sequence,
				authority
			});
		}
		prunePublication(owner, change.sessionId);
		return;
	}
	for (const observation of owner.observations.get(change.sessionId) ?? []) observation.revoked = true;
	if (sequence > (owner.published.get(change.sessionId) ?? -1)) {
		const result = change.kind === "workspace-result" ? change.facts : change.kind === "claim" ? change.workspaceResult : void 0;
		const placement = change.kind === "claim" ? change.workspacePlacement : void 0;
		const retained = owner.workspaceResults.get(change.sessionId);
		if (change.kind === "journal" && !change.uncertain) {} else if (result?.pendingResult) owner.workspaceResults.set(change.sessionId, Object.freeze({
			placement: result.placement,
			pendingResult: result.pendingResult
		}));
		else if (!result && placement && retained && isCurrentWorkerWorkspacePendingResultOwner(placement, retained.pendingResult)) owner.workspaceResults.set(change.sessionId, Object.freeze({
			placement,
			pendingResult: retained.pendingResult
		}));
		else owner.workspaceResults.delete(change.sessionId);
		owner.published.set(change.sessionId, sequence);
	}
	if (change.kind !== "claim") {
		prunePublication(owner, change.sessionId);
		return;
	}
	const facts = change.facts;
	if (sequence > (tools?.sequence ?? -1) && (!facts?.turnClaim || tools?.authority && !isCurrentPlacementTurnClaim(facts, tools.authority.claim) || [...owner.pending].some((pending) => pending.sessionId === change.sessionId && pending.kind === "tools" && pending.authority && !isCurrentPlacementTurnClaim(facts, pending.authority.claim)))) owner.tools.set(change.sessionId, { sequence });
	owner.published.set(change.sessionId, Math.max(owner.published.get(change.sessionId) ?? 0, sequence));
	for (const retained of owner.claims.get(change.sessionId) ?? []) {
		if (sequence <= retained.createdSequence) continue;
		if (sequence > retained.publicationSequence) {
			retained.facts = change.facts;
			retained.publicationSequence = sequence;
		}
		retained.revoked ||= !allows(change, retained.claim);
	}
	prunePublication(owner, change.sessionId);
}
/** Retain placement custody across a read-worker wait and pending claim commits. */
function observePlacementAuthority(pathname, sessionId) {
	const context = captureOpenClawStateWorkerContext({ path: pathname });
	const owner = ownerFor(context.admission.identity);
	const observation = { revoked: false };
	const observations = owner.observations.get(sessionId) ?? /* @__PURE__ */ new Set();
	observations.add(observation);
	owner.observations.set(sessionId, observations);
	let released = false;
	return {
		assertCurrent() {
			context.admission.assertCurrent();
			if (released || observation.revoked || !owner.active || owners.get(owner.identity.key) !== owner || [...owner.pending].some((change) => change.kind !== "tools" && change.sessionId === sessionId)) throw new Error(`Session ${sessionId} placement authority changed`);
		},
		release() {
			released = true;
			observations.delete(observation);
			if (observations.size === 0 && owner.observations.get(sessionId) === observations) owner.observations.delete(sessionId);
			prunePublication(owner, sessionId);
		}
	};
}
function stageChange(db, change) {
	const owner = ownerFor(requireOpenClawStateDatabaseIdentity({ db }));
	if (!stageSqliteTransactionState(db, {
		stage() {
			owner.pending.add(change);
		},
		commit() {
			commitChange(owner, change, ++owner.sequence);
		},
		prepareObservers() {
			for (const retained of Array.from(owner.claims.get(change.sessionId) ?? [])) notifyRevoked(retained);
		},
		rollback() {
			owner.pending.delete(change);
			prunePublication(owner, change.sessionId);
			try {
				assertTransactionUsable(db);
			} catch {
				closeOwner(owner);
			}
		}
	})) throw new Error("Placement authority publication requires its owning transaction");
}
/** Fence host authority before granting the worker's commit; settle only its exact receipt. */
function stagePlacementTurnClaimWorkerPublication(identity, facts, workspaceResult) {
	return stageWorkerChange(identity, {
		kind: "claim",
		sessionId: facts.sessionId,
		facts: freezeJsonSnapshot(facts),
		workspaceResult: captureWorkspaceResultPostimage(facts.sessionId, workspaceResult)
	});
}
function captureWorkspaceResultPostimage(sessionId, facts) {
	if (facts && (facts.placement.sessionId !== sessionId || facts.pendingResult && facts.pendingResult.sessionId !== sessionId)) throw new Error("Workspace result publication has a different session owner");
	return freezeJsonSnapshot(facts);
}
/** Pending-result changes invalidate read observations without revoking turn authority. */
function stagePlacementWorkspaceResultWorkerPublication(identity, sessionId, facts) {
	return stageWorkerChange(identity, {
		kind: "workspace-result",
		sessionId,
		facts: captureWorkspaceResultPostimage(sessionId, facts)
	});
}
function stagePlacementWorkspaceJournalWorkerPublication(identity, sessionId) {
	return stageWorkerChange(identity, {
		kind: "journal",
		sessionId
	});
}
/** Current result custody is published by its writer; discovery snapshots grant no authority. */
function readPlacementWorkspaceResultAuthority(identity, claim) {
	const owner = owners.get(identity.key);
	const facts = owner?.workspaceResults.get(claim.sessionId);
	if (!owner?.active || !facts || [...owner.pending].some((change) => change.kind !== "tools" && change.sessionId === claim.sessionId) || !matchesWorkspaceResultClaim(facts.placement, facts.pendingResult, claim)) return;
	return facts;
}
/** Bind the worker read to the original store before yielding and reject obsolete snapshots. */
async function preparePlacementWorkspaceResultAuthority(pathname, requestedClaim, read) {
	const context = captureOpenClawStateWorkerContext({ path: pathname });
	const identity = context.admission.identity;
	const owner = ownerFor(identity);
	const claim = structuredClone(requestedClaim);
	claim.sessionId = required(claim.sessionId, "session id");
	const publicationSequence = owner.published.get(claim.sessionId) ?? 0;
	const observation = observePlacementAuthority(pathname, claim.sessionId);
	try {
		const projection = await read([claim.sessionId]);
		context.admission.assertCurrent();
		if ((owner.published.get(claim.sessionId) ?? 0) > publicationSequence && readPlacementWorkspaceResultAuthority(identity, claim)) return;
		observation.assertCurrent();
		const placement = projection.placements.get(claim.sessionId);
		const pendingResult = projection.pendingResults.get(claim.sessionId);
		if (placement && pendingResult && isCurrentWorkerWorkspacePendingResultOwner(placement, pendingResult)) owner.workspaceResults.set(claim.sessionId, freezeJsonSnapshot({
			placement,
			pendingResult
		}));
		else owner.workspaceResults.delete(claim.sessionId);
		if (!placement || !pendingResult || !matchesWorkspaceResultClaim(placement, pendingResult, claim)) throw new Error(`Session ${claim.sessionId} workspace result authority changed`);
	} finally {
		observation.release();
	}
}
function stagePlacementTurnToolWorkerPublication(identity, input) {
	return stageWorkerChange(identity, {
		kind: "tools",
		sessionId: input.claim.sessionId,
		claimId: input.claim.claimId,
		...input.toolNames === null ? {} : { authority: structuredClone({
			claim: input.claim,
			toolNames: input.toolNames
		}) }
	});
}
function publishPlacementTurnToolState(db, identity) {
	stageChange(db, {
		kind: "tools",
		sessionId: identity.sessionId,
		claimId: identity.claimId
	});
}
function isPlacementTurnToolAuthorized(identity, claim, toolName) {
	const owner = owners.get(identity.key);
	const tools = owner?.tools.get(claim.sessionId)?.authority;
	return Boolean(claim.owner.kind === "worker" && owner?.active && tools && sameWorkerSessionTurnClaim(tools.claim, claim) && tools.toolNames.includes(toolName) && [...owner.pending].every((change) => allows(change, claim) && (change.sessionId !== claim.sessionId || change.kind !== "tools" || change.authority && sameWorkerSessionTurnClaim(change.authority.claim, claim) && change.authority.toolNames.includes(toolName))));
}
function stageWorkerChange(identity, input) {
	const owner = ownerFor(identity);
	const sequence = ++owner.sequence;
	const change = {
		...input,
		sequence
	};
	owner.pending.add(change);
	let settled = false;
	const settle = (apply) => {
		if (!settled) {
			settled = true;
			apply();
		}
	};
	const publish = () => {
		commitChange(owner, change, sequence);
		for (const retained of Array.from(owner.claims.get(change.sessionId) ?? [])) notifyRevoked(retained);
	};
	return {
		commit: () => settle(publish),
		rollback: () => settle(() => {
			owner.pending.delete(change);
			prunePublication(owner, change.sessionId);
		}),
		invalidate: () => settle(() => {
			if (change.kind === "tools") change.authority = void 0;
			else if (change.kind === "journal") change.uncertain = true;
			else if (change.kind === "claim" || change.kind === "workspace-result") {
				change.facts = void 0;
				if (change.kind === "claim") {
					change.workspaceResult = void 0;
					change.workspacePlacement = void 0;
				}
			}
			publish();
		})
	};
}
/** Publish only an existing successful writer postimage; this performs no database read. */
function publishPlacementTurnClaimState(db, record) {
	const snapshot = freezeJsonSnapshot(structuredClone(record));
	stageChange(db, {
		kind: "claim",
		sessionId: snapshot.sessionId,
		workspacePlacement: snapshot,
		facts: snapshot
	});
}
function publishPlacementTurnClaimCleared(db, sessionId) {
	stageChange(db, {
		kind: "claim",
		sessionId
	});
}
function publishPlacementWorkspaceResultState(db, sessionId) {
	stageChange(db, {
		kind: "workspace-result",
		sessionId
	});
}
/** Prepare once through the placement reader; subsequent checks use this retained incarnation. */
async function preparePlacementTurnClaimAuthority(pathname, requestedClaim, read) {
	const context = captureOpenClawStateWorkerContext({ path: pathname });
	const owner = ownerFor(context.admission.identity);
	const claim = structuredClone(requestedClaim);
	claim.sessionId = required(claim.sessionId, "session id");
	Object.freeze(claim.owner);
	Object.freeze(claim);
	const retained = {
		claim,
		createdSequence: owner.published.get(claim.sessionId) ?? 0,
		publicationSequence: owner.published.get(claim.sessionId) ?? 0,
		revoked: false,
		released: false,
		listeners: /* @__PURE__ */ new Set()
	};
	const claims = owner.claims.get(claim.sessionId) ?? /* @__PURE__ */ new Set();
	claims.add(retained);
	owner.claims.set(claim.sessionId, claims);
	const release = () => {
		retained.released = true;
		retained.listeners.clear();
		claims.delete(retained);
		if (claims.size === 0 && owner.claims.get(claim.sessionId) === claims) owner.claims.delete(claim.sessionId);
		prunePublication(owner, claim.sessionId);
	};
	const isCurrent = () => {
		if (retained.released || retained.revoked || !owner.active || owners.get(owner.identity.key) !== owner || !retained.facts || !isCurrentPlacementTurnClaim(retained.facts, claim)) return false;
		for (const change of owner.pending) if ((change.sequence === void 0 || change.sequence > retained.createdSequence) && !allows(change, claim)) return false;
		try {
			context.admission.assertCurrent();
			return true;
		} catch {
			return false;
		}
	};
	const assertCurrent = () => {
		if (!isCurrent()) throw new Error(`Session ${claim.sessionId} turn claim authority changed`);
	};
	try {
		const projection = await read([claim.sessionId]);
		context.admission.assertCurrent();
		retained.facts ??= projection.placements.get(claim.sessionId);
		assertCurrent();
		const facts = retained.facts;
		if (!facts) throw new Error(`Session ${claim.sessionId} turn claim is unavailable`);
		return {
			claim,
			identity: Object.freeze({
				agentId: facts.agentId,
				sessionKey: facts.sessionKey
			}),
			isCurrent,
			onRevoked(listener) {
				if (retained.revoked || !owner.active) {
					listener();
					return () => {};
				}
				return registerListener(retained.listeners, listener);
			},
			release
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
//#region src/gateway/worker-environments/placement-state.ts
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
	if (SESSION_PLACEMENT_STATES.includes(value)) return value;
	throw new Error(`Invalid worker session placement state: ${value}`);
}
function canTransitionWorkerSessionPlacement(from, to) {
	return WORKER_SESSION_PLACEMENT_TRANSITIONS[from].some((candidate) => candidate === to);
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
		environmentId: nullableRequired(row.environment_id, "environment id"),
		activeOwnerEpoch: row.active_owner_epoch === null ? null : normalizeEpoch(row.active_owner_epoch, "active owner epoch"),
		workspaceBaseManifestRef: nullableRequired(row.workspace_base_manifest_ref, "workspace base manifest ref"),
		remoteWorkspaceDir: nullableRequired(row.remote_workspace_dir, "remote workspace directory"),
		workerBundleHash: nullableRequired(row.worker_bundle_hash, "worker bundle hash"),
		lastTranscriptAckCursor: normalizeNonNegativeInteger(row.last_transcript_ack_cursor, "transcript ACK cursor"),
		lastLiveEventAckCursor: normalizeNonNegativeInteger(row.last_live_event_ack_cursor, "live ACK cursor"),
		terminalReason: nullableRequired(row.terminal_reason, "terminal reason"),
		terminalAtMs: normalizeNonNegativeInteger(row.terminal_at_ms, "terminal timestamp")
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
function ensureLocal(db, identity, nowMs) {
	const current = find(db, identity.sessionId);
	if (current) {
		if (current.agentId !== identity.agentId || current.sessionKey !== identity.sessionKey) throw new Error(`Worker session placement identity changed for ${identity.sessionId}`);
		return current;
	}
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
	const record = getRequired(db, identity.sessionId);
	publishPlacementTurnClaimState(db, record);
	return record;
}
function transitionValues(current, to, patch, nowMs) {
	const clearsWorkerMetadata = to === "local" || to === "requested";
	const text = (value, previous, field) => clearsWorkerMetadata ? null : value === void 0 ? previous : nullableRequired(value, field);
	const cursor = (value, previous, field) => clearsWorkerMetadata ? null : value === void 0 ? previous : normalizeNonNegativeInteger(value, field);
	const environmentId = text(patch.environmentId, current.environmentId, "environment id");
	const activeOwnerEpoch = clearsWorkerMetadata || to === "provisioning" || to === "syncing" || to === "starting" ? null : patch.activeOwnerEpoch === void 0 ? current.activeOwnerEpoch : patch.activeOwnerEpoch === null ? null : normalizeEpoch(patch.activeOwnerEpoch, "active owner epoch");
	const generation = nextGeneration(current.generation);
	const values = {
		session_id: current.sessionId,
		agent_id: current.agentId,
		session_key: current.sessionKey,
		execution_mode: current.executionMode,
		state: to,
		environment_id: environmentId,
		transition_generation: generation,
		active_owner_epoch: activeOwnerEpoch,
		workspace_base_manifest_ref: text(patch.workspaceBaseManifestRef, current.workspaceBaseManifestRef, "workspace base manifest ref"),
		remote_workspace_dir: text(patch.remoteWorkspaceDir, current.remoteWorkspaceDir, "remote workspace directory"),
		worker_bundle_hash: text(patch.workerBundleHash, current.workerBundleHash, "worker bundle hash"),
		last_transcript_ack_cursor: cursor(patch.lastTranscriptAckCursor, current.lastTranscriptAckCursor, "transcript ACK cursor"),
		last_live_event_ack_cursor: cursor(patch.lastLiveEventAckCursor, current.lastLiveEventAckCursor, "live ACK cursor"),
		recovery_error: text(patch.recoveryError, current.recoveryError, "recovery error"),
		terminal_reason: to === "failed" ? patch.terminalReason === void 0 ? current.terminalReason : nullableRequired(patch.terminalReason, "terminal reason") : null,
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
function updateTransition(db, current, to, patch, nowMs, onEnvironmentActivated) {
	const values = transitionValues(current, to, patch, nowMs);
	if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set(values).where("session_id", "=", current.sessionId).where("state", "=", current.state).where("transition_generation", "=", current.generation).where("turn_claim_owner", "is", null)).numAffectedRows !== 1n) throw new Error(`Worker session placement ${current.sessionId} changed during transition`);
	const updated = getRequired(db, current.sessionId);
	if (updated.state === "active") {
		const activated = executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("worker_environments").set((eb) => ({ last_activated_at_ms: eb.case().when("last_activated_at_ms", ">", nowMs).then(eb.ref("last_activated_at_ms")).else(nowMs).end() })).where("environment_id", "=", updated.environmentId).where("state", "=", "attached").where("destroy_requested_at_ms", "is", null).where("owner_epoch", "=", updated.activeOwnerEpoch).where("attached_session_ids_json", "=", JSON.stringify([updated.sessionId])).returning("last_activated_at_ms"));
		const lastActivatedAtMs = activated.rows[0]?.last_activated_at_ms;
		if (activated.rows.length !== 1 || lastActivatedAtMs == null) throw new Error(`Worker session placement ${current.sessionId} lost its attached environment`);
		publishWorkerEnvironmentNativeMutation(db, updated.environmentId, { lastActivatedAtMs });
		onEnvironmentActivated?.(updated.environmentId, lastActivatedAtMs);
	}
	publishPlacementTurnClaimState(db, updated);
	return updated;
}
//#endregion
export { matchesWorkspaceResultClaim as C, isCurrentWorkerWorkspacePendingResultOwner as S, readPlacementWorkspaceResultAuthority as _, query as a, stagePlacementWorkspaceJournalWorkerPublication as b, canTransitionWorkerSessionPlacement as c, preparePlacementTurnClaimAuthority as d, preparePlacementWorkspaceResultAuthority as f, publishPlacementWorkspaceResultState as g, publishPlacementTurnToolState as h, getRequired as i, isPlacementTurnToolAuthorized as l, publishPlacementTurnClaimState as m, find as n, transitionValues as o, publishPlacementTurnClaimCleared as p, fromRow as r, updateTransition as s, ensureLocal as t, observePlacementAuthority as u, stagePlacementTurnClaimWorkerPublication as v, stagePlacementWorkspaceResultWorkerPublication as x, stagePlacementTurnToolWorkerPublication as y };
