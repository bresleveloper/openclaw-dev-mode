import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-BH2yUdBz.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-DqJSDH8t.mjs";
import { s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { a as executeSqliteQueryTakeFirstSync, d as sqliteStringSet, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { b as registerOpenClawStateDatabaseLifecycleListener, x as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { t as assertTransactionUsable } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as SESSION_PLACEMENT_STATES } from "./session-placement-state-BsPYZ8PU.mjs";
import { t as WorkerPlacementInventoryChangedError } from "./placement-inventory-changed-error-CvjNg-kM.mjs";
import { t as attachErrorDiagnostic } from "./error-diagnostics-Cgksm9ND.mjs";
import { t as publishWorkerEnvironmentNativeMutation } from "./store-native-publication-BmUHu_Dk.mjs";
import { d as nullableRequired, f as placementTurnOwner, g as required, i as isCurrentPlacementTurnClaim, l as normalizeNonNegativeInteger, o as nextGeneration, r as assertRecordShape, s as normalizeEpoch, u as normalizeWorkerPlacementExecutionMode, v as sameWorkerSessionTurnClaim } from "./placement-record-CBaaHws5.mjs";
//#region src/gateway/worker-environments/placement-authority-owner.ts
function placementChangeAllowsClaim(change, claim) {
	return change.kind !== "claim" || change.sessionId !== claim.sessionId || Boolean(change.facts && isCurrentPlacementTurnClaim(change.facts, claim));
}
function notifyPlacementClaimRevoked(claim) {
	if (!claim.revoked) return;
	const listeners = [...claim.listeners];
	claim.listeners.clear();
	notifyListeners(listeners, void 0);
}
function closePlacementAuthorityOwner(owner) {
	owner.active = false;
	owner.changeListeners.clear();
	owner.pending.clear();
	owner.published.clear();
	owner.tools.clear();
	owner.workspaceResults.clear();
	const claims = Array.from(owner.claims.values()).flatMap((retained) => Array.from(retained));
	for (const claim of claims) claim.revoked = true;
	for (const claim of claims) notifyPlacementClaimRevoked(claim);
	owner.claims.clear();
	owner.placements.clear();
	owner.observations.clear();
	owner.placementReaders.clear();
	owner.projections.clear();
	owner.preservation = void 0;
	owner.recoveryCandidatesEmpty = void 0;
}
const placementAuthorityOwners = resolveGlobalSingleton(Symbol.for("openclaw.placementTurnAuthorities"), () => /* @__PURE__ */ new Map(), (registered) => {
	for (const owner of registered.values()) closePlacementAuthorityOwner(owner);
	registered.clear();
});
function placementAuthorityOwnerFor(identity) {
	const existing = placementAuthorityOwners.get(identity.key);
	if (existing?.active) return existing;
	const owner = {
		identity,
		active: true,
		changeListeners: /* @__PURE__ */ new Set(),
		claims: /* @__PURE__ */ new Map(),
		placements: /* @__PURE__ */ new Map(),
		observations: /* @__PURE__ */ new Map(),
		placementReaders: /* @__PURE__ */ new Map(),
		pending: /* @__PURE__ */ new Set(),
		sequence: 0,
		published: /* @__PURE__ */ new Map(),
		tools: /* @__PURE__ */ new Map(),
		workspaceResults: /* @__PURE__ */ new Map(),
		projections: /* @__PURE__ */ new Map()
	};
	placementAuthorityOwners.set(identity.key, owner);
	return owner;
}
function subscribePlacementChanges(identity, listener) {
	return registerListener(placementAuthorityOwnerFor(identity).changeListeners, listener);
}
function changedPlacementIdentity(owner, change) {
	if (change.indeterminate) return;
	if (change.kind === "claim" && change.retired) return change.retiredIdentity;
	const previous = owner.placements.get(change.sessionId)?.placement;
	const current = change.kind === "claim" ? change.workspacePlacement : change.kind === "workspace-result" ? change.facts?.placement : void 0;
	if (current && (!previous || current.state !== previous.state || current.generation !== previous.generation || current.updatedAtMs !== previous.updatedAtMs || current.sessionKey !== previous.sessionKey || current.agentId !== previous.agentId)) return {
		sessionId: current.sessionId,
		sessionKey: current.sessionKey,
		agentId: current.agentId
	};
}
function preparePlacementChangeNotification(owner, change) {
	const changed = changedPlacementIdentity(owner, change);
	return () => {
		if (changed) notifyListeners(owner.changeListeners, changed);
	};
}
registerOpenClawStateDatabaseLifecycleListener((event) => {
	if (event.kind === "opened") return;
	for (const [key, owner] of placementAuthorityOwners) if (key === event.identity?.key || owner.identity.canonicalPath === (event.identity?.canonicalPath ?? event.path)) {
		closePlacementAuthorityOwner(owner);
		placementAuthorityOwners.delete(key);
	}
});
//#endregion
//#region src/gateway/worker-environments/placement-read-authority.ts
function hasPendingPublication(owner, sessionId) {
	return [...owner.pending].some((change) => affectsPlacementObservation(change, sessionId));
}
function affectsPlacementObservation(change, sessionId) {
	if (change.kind === "tools") return false;
	if (sessionId !== void 0) return change.sessionId === sessionId;
	return change.kind === "claim" ? !change.localOnly && (!change.inventoryUnchanged || change.indeterminate === true) : change.indeterminate === true;
}
function prunePublication(owner, sessionId) {
	if (!owner.claims.has(sessionId) && !owner.workspaceResults.has(sessionId) && !owner.observations.has(sessionId) && !owner.placementReaders.has(sessionId) && ![...owner.pending].some((change) => change.sessionId === sessionId)) {
		owner.published.delete(sessionId);
		if (!owner.tools.get(sessionId)?.authority) owner.tools.delete(sessionId);
	}
}
/** Install committed postimages without revoking a destination on ordinary turn claims. */
function applyPlacementReadPublication(owner, change, sequence) {
	for (const reader of owner.placementReaders.get(change.sessionId) ?? []) {
		if (change.kind === "tools") continue;
		reader.revoked ||= change.indeterminate === true;
		if (sequence <= reader.sequence) continue;
		if (change.kind === "claim") {
			reader.sequence = sequence;
			if (change.retired) reader.placement = void 0;
			else if (change.workspacePlacement) reader.placement = change.workspacePlacement;
			else reader.revoked = true;
		} else if (change.kind === "workspace-result" && change.facts) {
			reader.sequence = sequence;
			reader.placement = change.facts.placement;
		} else if (change.kind === "journal" && change.uncertain) reader.revoked = true;
	}
}
function retainSessionPlacementRead(sessionId, placement, captured) {
	const { owner, authority, assertUsable } = captured;
	const published = owner.placements.get(sessionId);
	const reader = {
		placement: freezeJsonSnapshot(published ? published.placement : placement),
		sequence: owner.sequence,
		revoked: false
	};
	const readers = owner.placementReaders.get(sessionId) ?? /* @__PURE__ */ new Set();
	readers.add(reader);
	owner.placementReaders.set(sessionId, readers);
	return {
		prepareRead() {
			assertUsable();
			const pending = [...owner.pending].filter((change) => change.kind === "claim" && change.sessionId === sessionId);
			const settlements = pending.flatMap((change) => change.nativeSettlement ? [change.nativeSettlement] : []);
			if (reader.revoked || pending.some((change) => change.indeterminate) || settlements.length !== pending.length) throw new Error(`Session ${sessionId} placement authority changed`);
			if (settlements.length === 0) return;
			return Promise.all(settlements).then((outcomes) => {
				assertUsable();
				if (reader.revoked) throw new Error(`Session ${sessionId} placement authority changed`);
				for (const outcome of outcomes) if (outcome.kind !== "completed") throw outcome.error;
			});
		},
		current() {
			assertUsable();
			if (reader.revoked || [...owner.pending].some((change) => change.kind === "claim" && change.sessionId === sessionId)) throw new Error(`Session ${sessionId} placement authority changed`);
			return reader.placement;
		},
		release() {
			readers.delete(reader);
			if (readers.size === 0 && owner.placementReaders.get(sessionId) === readers) owner.placementReaders.delete(sessionId);
			authority.release();
		}
	};
}
function retainProjection(owner, sessionId, projection) {
	const retained = owner.projections.get(sessionId);
	owner.projections.delete(sessionId);
	const placement = projection.projection.placements.get(sessionId);
	if (placement && placement.state !== "local" || projection.projection.environments.size || projection.projection.moves.size || projection.projection.pendingResults.size || projection.projection.workspaceRecoveryPendingSessionIds.size) return;
	owner.projections.set(sessionId, retained === projection ? projection : structuredClone(projection));
	if (owner.projections.size > 256) owner.projections.delete(owner.projections.keys().next().value);
}
/** Local claim writes change only placement; the owner retains the other projection facts. */
function projectCachedLocalPlacementTurnClaim(owner, placement) {
	if (!owner?.active || placement.state !== "local" || hasPendingPublication(owner, placement.sessionId)) return;
	const retained = owner.projections.get(placement.sessionId);
	if (!retained) return;
	return structuredClone({
		...retained.projection,
		placements: new Map(retained.projection.placements).set(placement.sessionId, placement)
	});
}
/** The authority owner retains exact reads until one of its writers publishes a change. */
async function readCachedPlacementProjection(captured, sessionId, read) {
	const { owner, observation, authority, assertUsable } = captured;
	try {
		const signal = getAsyncWorkSignal();
		signal?.throwIfAborted();
		assertUsable();
		const value = hasPendingPublication(owner, sessionId) ? await read() : owner.projections.get(sessionId) ?? await read();
		signal?.throwIfAborted();
		assertUsable();
		if (observation.revokedBy.size === 0 && !hasPendingPublication(owner, sessionId)) retainProjection(owner, sessionId, value);
		return structuredClone(value);
	} finally {
		authority.release();
	}
}
async function prepareCachedPlacementPreservationRead(captured, read) {
	const { owner, observation, authority, assertUsable } = captured;
	const sequence = Math.min(owner.sequence + 1, ...Array.from(owner.pending, (change) => change.sequence ?? owner.sequence + 1));
	const signal = getAsyncWorkSignal();
	try {
		signal?.throwIfAborted();
		assertUsable();
		const baseline = owner.preservation ?? await read();
		signal?.throwIfAborted();
		assertUsable();
		if (observation.revokedBy.size === 0 && !hasPendingPublication(owner)) owner.preservation = freezeJsonSnapshot(baseline);
		return {
			get placements() {
				assertUsable();
				const placements = new Map(baseline.map((placement) => [placement.sessionId, placement]));
				for (const [sessionId, published] of owner.placements) {
					if (published.sequence < sequence) continue;
					const placement = published.placement;
					if (placement && placement.state !== "local" && placement.state !== "reclaimed") placements.set(sessionId, placement);
					else placements.delete(sessionId);
				}
				const pending = Array.from(owner.pending).flatMap((change) => {
					const placement = change.kind === "claim" ? change.workspacePlacement : change.kind === "workspace-result" ? change.facts?.placement : void 0;
					return placement && placement.state !== "local" && placement.state !== "reclaimed" ? [placement] : [];
				});
				return structuredClone([...placements.values(), ...pending]);
			},
			assertCurrent: assertUsable,
			release: authority.release
		};
	} catch (error) {
		authority.release();
		throw error;
	}
}
/** Recovery work stays live; empty inventories sleep until a placement writer commits. */
async function readCachedPlacementRecoveryCandidates(captured, read) {
	const { owner, observation, authority, assertUsable } = captured;
	try {
		const signal = getAsyncWorkSignal();
		signal?.throwIfAborted();
		assertUsable();
		const candidates = owner.recoveryCandidatesEmpty && !hasPendingPublication(owner) ? [] : await read();
		signal?.throwIfAborted();
		assertUsable();
		if (candidates.length === 0 && observation.revokedBy.size === 0 && !hasPendingPublication(owner)) owner.recoveryCandidatesEmpty = true;
		return candidates;
	} finally {
		authority.release();
	}
}
async function preparePlacementRead(captured, read, consume) {
	const { authority, owner } = captured;
	const signal = getAsyncWorkSignal();
	try {
		signal?.throwIfAborted();
		const value = await read(owner);
		signal?.throwIfAborted();
		authority.assertCurrent();
		return consume(value, captured);
	} catch (error) {
		authority.release();
		throw error;
	}
}
//#endregion
//#region src/gateway/worker-environments/placement-turn-authority.receipt.ts
function captureWorkspaceResultPostimage(sessionId, facts) {
	if (facts && (facts.placement.sessionId !== sessionId || facts.pendingResult && facts.pendingResult.sessionId !== sessionId)) throw new Error("Workspace result publication has a different session owner");
	return freezeJsonSnapshot(facts);
}
function captureWorkspaceResultChange(sessionId, facts) {
	return {
		kind: "workspace-result",
		sessionId,
		...facts === null ? { cleared: true } : { facts: captureWorkspaceResultPostimage(sessionId, facts) }
	};
}
//#endregion
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
function isWorkerWorkspaceResultReconciling(placement, pending) {
	return (placement?.turnClaim?.owner === "worker" || pending.stagedResultRef !== null) && isCurrentWorkerWorkspacePendingResultOwner(placement, pending);
}
function matchesWorkspaceResultClaim(placement, pending, claim) {
	const recoveryOwner = placement.state === "active" || placement.state === "draining" ? placementTurnOwner(placement) : void 0;
	return pending.sessionId === claim.sessionId && pending.environmentId === placement.environmentId && pending.ownerEpoch === placement.activeOwnerEpoch && pending.placementGeneration === claim.placementGeneration && pending.claimId === claim.claimId && pending.runId === claim.runId && (isCurrentPlacementTurnClaim(placement, claim) || matchesWorkspaceResultGeneration(placement, claim.placementGeneration) && placement.turnClaim === null && recoveryOwner?.kind === "local" && claim.owner.kind === "local" && claim.owner.environmentId === recoveryOwner.environmentId && claim.owner.ownerEpoch === recoveryOwner.ownerEpoch);
}
//#endregion
//#region src/gateway/worker-environments/placement-turn-authority.ts
function commitChange(owner, change, sequence) {
	owner.pending.delete(change);
	if (!owner.active) return;
	const newerPlacement = (owner.placements.get(change.sessionId)?.sequence ?? -1) > sequence;
	if (!newerPlacement && change.indeterminate && (change.kind === "claim" || change.kind === "workspace-result")) owner.placements.delete(change.sessionId);
	else if (!newerPlacement && change.kind === "claim") {
		if (change.retired) owner.placements.set(change.sessionId, {
			placement: void 0,
			sequence
		});
		else if (change.workspacePlacement) owner.placements.set(change.sessionId, {
			placement: change.workspacePlacement,
			sequence
		});
	} else if (!newerPlacement && change.kind === "workspace-result" && change.facts) owner.placements.set(change.sessionId, {
		placement: change.facts.placement,
		sequence
	});
	applyPlacementReadPublication(owner, change, sequence);
	if (change.kind !== "tools" && (change.kind !== "claim" || !change.localOnly)) owner.preservation = void 0;
	if (change.kind !== "tools") {
		owner.recoveryCandidatesEmpty = void 0;
		owner.projections.delete(change.sessionId);
		if (change.kind === "claim" && change.projection && !change.indeterminate) retainProjection(owner, change.sessionId, change.projection);
	}
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
	for (const sessionId of [change.sessionId, void 0]) if (affectsPlacementObservation(change, sessionId)) for (const observation of owner.observations.get(sessionId) ?? []) {
		observation.revokedBy.add(change.sessionId);
		observation.indeterminate ||= change.indeterminate === true;
	}
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
	for (const retained of owner.claims.get(change.sessionId) ?? []) {
		if (sequence <= retained.createdSequence) continue;
		if (sequence > retained.publicationSequence) {
			retained.facts = change.facts;
			retained.publicationSequence = sequence;
		}
		retained.revoked ||= !placementChangeAllowsClaim(change, retained.claim);
	}
	prunePublication(owner, change.sessionId);
}
function capturePlacementObservation(pathname, sessionId) {
	const context = captureOpenClawStateWorkerContext({ path: pathname });
	const owner = placementAuthorityOwnerFor(context.admission.identity);
	const observation = {
		revokedBy: /* @__PURE__ */ new Set(),
		indeterminate: false
	};
	const observations = owner.observations.get(sessionId) ?? /* @__PURE__ */ new Set();
	observations.add(observation);
	owner.observations.set(sessionId, observations);
	let released = false;
	const changedMessage = sessionId === void 0 ? "Worker placement inventory changed" : `Session ${sessionId} placement authority changed`;
	const changed = () => {
		const error = new Error(changedMessage);
		return attachErrorDiagnostic(error, error.stack ?? changedMessage);
	};
	const assertUsable = () => {
		context.admission.assertCurrent();
		if (released || observation.indeterminate || !owner.active || placementAuthorityOwners.get(owner.identity.key) !== owner) throw changed();
	};
	return {
		authority: {
			assertCurrent() {
				assertUsable();
				if (observation.revokedBy.size > 0 || hasPendingPublication(owner, sessionId)) {
					if (sessionId === void 0) throw new WorkerPlacementInventoryChangedError(/* @__PURE__ */ new Set([...observation.revokedBy, ...[...owner.pending].filter((change) => affectsPlacementObservation(change)).map((change) => change.sessionId)]));
					throw changed();
				}
			},
			release() {
				released = true;
				observations.delete(observation);
				if (observations.size === 0 && owner.observations.get(sessionId) === observations) owner.observations.delete(sessionId);
				if (sessionId !== void 0) prunePublication(owner, sessionId);
			}
		},
		observation,
		owner,
		assertUsable
	};
}
async function preparePlacementAuthorityRead(pathname, sessionId, read) {
	return await preparePlacementRead(capturePlacementObservation(pathname, sessionId), read, (value, { authority }) => ({
		value,
		...authority
	}));
}
async function readPlacementProjection(pathname, sessionId, read) {
	return readCachedPlacementProjection(capturePlacementObservation(pathname, sessionId), sessionId, read);
}
function projectLocalPlacementTurnClaim(identity, placement) {
	return projectCachedLocalPlacementTurnClaim(placementAuthorityOwners.get(identity.key), placement);
}
async function preparePlacementPreservationRead(pathname, read) {
	return await prepareCachedPlacementPreservationRead(capturePlacementObservation(pathname), read);
}
function readPlacementRecoveryCandidates(pathname, read) {
	return readCachedPlacementRecoveryCandidates(capturePlacementObservation(pathname), read);
}
/** Retain writer postimages, rather than invalidating a destination on ordinary turn claims. */
async function prepareSessionPlacementRead(pathname, sessionId, read) {
	const captured = capturePlacementObservation(pathname, sessionId);
	try {
		const placement = await read();
		captured.assertUsable();
		return retainSessionPlacementRead(sessionId, placement, captured);
	} catch (error) {
		captured.authority.release();
		throw error;
	}
}
function stageChange(db, change) {
	const owner = placementAuthorityOwnerFor(requireOpenClawStateDatabaseIdentity({ db }));
	if (!stageSqliteTransactionState(db, {
		stage() {
			owner.pending.add(change);
		},
		commit() {
			const notify = preparePlacementChangeNotification(owner, change);
			commitChange(owner, change, ++owner.sequence);
			notify();
		},
		invalidate: () => closePlacementAuthorityOwner(owner),
		prepareObservers() {
			for (const retained of Array.from(owner.claims.get(change.sessionId) ?? [])) notifyPlacementClaimRevoked(retained);
		},
		rollback() {
			owner.pending.delete(change);
			prunePublication(owner, change.sessionId);
			try {
				assertTransactionUsable(db);
			} catch {
				closePlacementAuthorityOwner(owner);
			}
		}
	})) throw new Error("Placement authority publication requires its owning transaction");
}
/** Fence before granting commit; null prior state proves absence, undefined stays fenced. */
function stagePlacementTurnClaimWorkerPublication(identity, facts, workspaceResult, previousState, workspacePlacement, projection, nativeSettlement, inventoryUnchanged = false) {
	return stageWorkerChange(identity, {
		kind: "claim",
		localOnly: facts.state === "local" && (previousState === null || previousState === "local"),
		...inventoryUnchanged ? { inventoryUnchanged: true } : {},
		sessionId: facts.sessionId,
		facts: freezeJsonSnapshot(facts),
		workspacePlacement: freezeJsonSnapshot(workspacePlacement),
		projection,
		nativeSettlement,
		workspaceResult: captureWorkspaceResultPostimage(facts.sessionId, workspaceResult)
	});
}
/** Pending-result changes invalidate read observations without revoking turn authority. */
function stagePlacementWorkspaceResultWorkerPublication(identity, sessionId, facts) {
	return stageWorkerChange(identity, captureWorkspaceResultChange(sessionId, facts));
}
function stagePlacementWorkspaceJournalWorkerPublication(identity, sessionId, present) {
	return stageWorkerChange(identity, {
		kind: "journal",
		sessionId,
		present
	});
}
function stagePlacementRetirementWorkerPublication(identity, sessionId, previousState, nativeSettlement, retiredIdentity) {
	return stageWorkerChange(identity, {
		kind: "claim",
		sessionId,
		retiredIdentity,
		localOnly: previousState === "local",
		retired: true,
		nativeSettlement
	});
}
/** A read can fill a cold replica but never overwrite a newer committed postimage. */
function capturePlacementReplicaRead(identity) {
	const owner = placementAuthorityOwnerFor(identity);
	const sequence = owner.sequence;
	return (records, requestedIds) => {
		if (!owner.active) return;
		const byId = new Map(Array.from(records, (record) => [record.sessionId, record]));
		for (const sessionId of requestedIds ?? byId.keys()) if ((owner.placements.get(sessionId)?.sequence ?? -1) <= sequence) owner.placements.set(sessionId, {
			placement: byId.get(sessionId),
			sequence
		});
	};
}
/** Synchronous SDK reads consume committed writer receipts; cold reads use the async API. */
function readPlacementReplica(identity, sessionId) {
	const owner = placementAuthorityOwners.get(identity.key);
	const published = owner?.placements.get(sessionId);
	if (!owner?.active || !published || hasPendingPublication(owner, sessionId)) return;
	return { placement: published.placement };
}
/** Claim effects consult the single writer's postimage without reopening SQLite. */
function isPublishedPlacementTurnClaimCurrent(identity, claim) {
	const owner = placementAuthorityOwners.get(identity.key);
	const placement = owner?.placements.get(claim.sessionId)?.placement;
	return Boolean(owner?.active && placement && isCurrentPlacementTurnClaim(placement, claim) && [...owner.pending].every((change) => placementChangeAllowsClaim(change, claim)));
}
/** Current result custody is published by its writer; discovery snapshots grant no authority. */
function readPlacementWorkspaceResultAuthority(identity, claim) {
	const owner = placementAuthorityOwners.get(identity.key);
	const facts = owner?.workspaceResults.get(claim.sessionId);
	if (!owner?.active || !facts || [...owner.pending].some((change) => change.kind !== "tools" && change.sessionId === claim.sessionId) || !matchesWorkspaceResultClaim(facts.placement, facts.pendingResult, claim)) return;
	return facts;
}
/** Bind the worker read to the original store before yielding and reject obsolete snapshots. */
async function preparePlacementWorkspaceResultAuthority(pathname, requestedClaim, read) {
	const context = captureOpenClawStateWorkerContext({ path: pathname });
	const identity = context.admission.identity;
	const owner = placementAuthorityOwnerFor(identity);
	const claim = structuredClone(requestedClaim);
	claim.sessionId = required(claim.sessionId, "session id");
	const publicationSequence = owner.published.get(claim.sessionId) ?? 0;
	const observation = capturePlacementObservation(pathname, claim.sessionId).authority;
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
	const owner = placementAuthorityOwners.get(identity.key);
	const tools = owner?.tools.get(claim.sessionId)?.authority;
	return Boolean(claim.owner.kind === "worker" && owner?.active && tools && sameWorkerSessionTurnClaim(tools.claim, claim) && tools.toolNames.includes(toolName) && [...owner.pending].every((change) => placementChangeAllowsClaim(change, claim) && (change.sessionId !== claim.sessionId || change.kind !== "tools" || change.authority && sameWorkerSessionTurnClaim(change.authority.claim, claim) && change.authority.toolNames.includes(toolName))));
}
function stageWorkerChange(identity, input) {
	const owner = placementAuthorityOwnerFor(identity);
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
	const publish = (notify = preparePlacementChangeNotification(owner, change)) => {
		commitChange(owner, change, sequence);
		notify();
		for (const retained of Array.from(owner.claims.get(change.sessionId) ?? [])) notifyPlacementClaimRevoked(retained);
	};
	return {
		commit: () => settle(publish),
		rollback: () => settle(() => {
			owner.pending.delete(change);
			prunePublication(owner, change.sessionId);
		}),
		invalidate: () => settle(() => {
			const notify = preparePlacementChangeNotification(owner, change);
			change.indeterminate = true;
			if (change.kind === "tools") change.authority = void 0;
			else if (change.kind === "journal") {
				change.uncertain = true;
				change.present = void 0;
			} else if (change.kind === "claim" || change.kind === "workspace-result") {
				change.facts = void 0;
				if (change.kind === "claim") {
					change.workspaceResult = void 0;
					change.workspacePlacement = void 0;
				}
			}
			publish(notify);
		})
	};
}
/** Publish only an existing successful writer postimage; this performs no database read. */
function publishPlacementTurnClaimState(db, record, previousState) {
	const snapshot = freezeJsonSnapshot(structuredClone(record));
	stageChange(db, {
		kind: "claim",
		localOnly: snapshot.state === "local" && (previousState === null || previousState === "local"),
		sessionId: snapshot.sessionId,
		workspacePlacement: snapshot,
		facts: snapshot
	});
}
function publishPlacementTurnClaimCleared(db, sessionId, previousState, retired) {
	stageChange(db, {
		kind: "claim",
		sessionId,
		localOnly: previousState === null || previousState === "local",
		retired
	});
}
function publishPlacementWorkspaceResultState(db, sessionId, facts) {
	stageChange(db, captureWorkspaceResultChange(sessionId, facts));
}
function publishPlacementWorkspaceJournalState(db, sessionId, present) {
	stageChange(db, {
		kind: "journal",
		sessionId,
		present
	});
}
/** Prepare once through the placement reader; subsequent checks use this retained incarnation. */
async function preparePlacementTurnClaimAuthority(pathname, requestedClaim, read) {
	const context = captureOpenClawStateWorkerContext({ path: pathname });
	const owner = placementAuthorityOwnerFor(context.admission.identity);
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
		if (retained.released || retained.revoked || !owner.active || placementAuthorityOwners.get(owner.identity.key) !== owner || !retained.facts || !isCurrentPlacementTurnClaim(retained.facts, claim)) return false;
		for (const change of owner.pending) if ((change.sequence === void 0 || change.sequence > retained.createdSequence) && !placementChangeAllowsClaim(change, claim)) return false;
		try {
			context.admission.assertCurrent();
			return true;
		} catch {
			return false;
		}
	};
	try {
		const projection = await read([claim.sessionId]);
		context.admission.assertCurrent();
		retained.facts ??= projection.placements.get(claim.sessionId);
		const facts = retained.facts;
		if (!facts || !isCurrent()) throw new Error(`Session ${claim.sessionId} turn claim authority changed`);
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
function selectWorkerPlacementRows(db, sessionIds) {
	return query(db).selectFrom("worker_session_placements").select([
		"session_id",
		"agent_id",
		"session_key",
		"execution_mode",
		"state",
		"environment_id",
		"transition_generation",
		"active_owner_epoch",
		"workspace_base_manifest_ref",
		"remote_workspace_dir",
		"worker_bundle_hash",
		"last_transcript_ack_cursor",
		"last_live_event_ack_cursor",
		"recovery_error",
		"terminal_reason",
		"terminal_at_ms",
		"turn_claim_owner",
		"turn_claim_id",
		"turn_claim_run_id",
		"turn_claim_generation",
		"turn_claim_owner_epoch",
		"created_at_ms",
		"updated_at_ms",
		"state_changed_at_ms"
	]).where("session_id", "in", sqliteStringSet(sessionIds)).$assertType();
}
function revivePlacementProjectionInteger(column, value) {
	if (typeof value === "number" && !Number.isSafeInteger(value)) throw new RangeError(`Worker placement projection column ${column} is outside JavaScript's safe integer range`);
	return value;
}
function turnClaimValues(claim) {
	return {
		turn_claim_owner: claim?.owner ?? null,
		turn_claim_id: claim?.claimId ?? null,
		turn_claim_run_id: claim?.runId ?? null,
		turn_claim_generation: claim?.generation ?? null,
		turn_claim_owner_epoch: claim?.ownerEpoch ?? null
	};
}
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
	normalizeNonNegativeInteger(row.transition_generation, "generation");
	normalizeNonNegativeInteger(row.created_at_ms, "creation timestamp");
	normalizeNonNegativeInteger(row.updated_at_ms, "update timestamp");
	normalizeNonNegativeInteger(row.state_changed_at_ms, "state change timestamp");
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
function readWorkerPlacementsForReconcileInDatabase(db, sessionKey) {
	let select = query(db).selectFrom("worker_session_placements").selectAll().where("state", "not in", ["local", "reclaimed"]);
	if (sessionKey !== void 0) select = select.where("session_key", "=", sessionKey);
	return executeSqliteQuerySync(db, select.orderBy("updated_at_ms").orderBy("session_id")).rows.map(fromRow);
}
function readWorkerPlacementsInDatabase(db, sessionIds) {
	let select = query(db).selectFrom("worker_session_placements").selectAll();
	if (sessionIds) select = select.where("session_id", "in", sqliteStringSet(sessionIds));
	return executeSqliteQuerySync(db, select.orderBy("session_id")).rows.map(fromRow);
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
	const record = fromRow(executeSqliteQuerySync(db, query(db).insertInto("worker_session_placements").values({
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
		...turnClaimValues(null),
		created_at_ms: nowMs,
		updated_at_ms: nowMs,
		state_changed_at_ms: nowMs
	}).returningAll()).rows[0]);
	publishPlacementTurnClaimState(db, record, null);
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
		...turnClaimValues(null),
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
	const row = executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set(values).where("session_id", "=", current.sessionId).where("state", "=", current.state).where("transition_generation", "=", current.generation).where("turn_claim_owner", "is", null).returningAll()).rows[0];
	if (!row) throw new Error(`Worker session placement ${current.sessionId} changed during transition`);
	const updated = fromRow(row);
	if (updated.state === "active") {
		const activated = executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("worker_environments").set((eb) => ({ last_activated_at_ms: eb.case().when("last_activated_at_ms", ">", nowMs).then(eb.ref("last_activated_at_ms")).else(nowMs).end() })).where("environment_id", "=", updated.environmentId).where("state", "=", "attached").where("destroy_requested_at_ms", "is", null).where("owner_epoch", "=", updated.activeOwnerEpoch).where("attached_session_ids_json", "=", JSON.stringify([updated.sessionId])).returning("last_activated_at_ms"));
		const lastActivatedAtMs = activated.rows[0]?.last_activated_at_ms;
		if (activated.rows.length !== 1 || lastActivatedAtMs == null) throw new Error(`Worker session placement ${current.sessionId} lost its attached environment`);
		publishWorkerEnvironmentNativeMutation(db, updated.environmentId, { lastActivatedAtMs });
		onEnvironmentActivated?.(updated.environmentId, lastActivatedAtMs);
	}
	publishPlacementTurnClaimState(db, updated, current.state);
	return updated;
}
//#endregion
export { readPlacementReplica as A, subscribePlacementChanges as B, publishPlacementTurnClaimCleared as C, publishPlacementWorkspaceResultState as D, publishPlacementWorkspaceJournalState as E, stagePlacementWorkspaceJournalWorkerPublication as F, stagePlacementWorkspaceResultWorkerPublication as I, isCurrentWorkerWorkspacePendingResultOwner as L, stagePlacementRetirementWorkerPublication as M, stagePlacementTurnClaimWorkerPublication as N, readPlacementProjection as O, stagePlacementTurnToolWorkerPublication as P, isWorkerWorkspaceResultReconciling as R, projectLocalPlacementTurnClaim as S, publishPlacementTurnToolState as T, preparePlacementAuthorityRead as _, query as a, preparePlacementWorkspaceResultAuthority as b, revivePlacementProjectionInteger as c, turnClaimValues as d, updateTransition as f, isPublishedPlacementTurnClaimCurrent as g, isPlacementTurnToolAuthorized as h, getRequired as i, readPlacementWorkspaceResultAuthority as j, readPlacementRecoveryCandidates as k, selectWorkerPlacementRows as l, capturePlacementReplicaRead as m, find as n, readWorkerPlacementsForReconcileInDatabase as o, canTransitionWorkerSessionPlacement as p, fromRow as r, readWorkerPlacementsInDatabase as s, ensureLocal as t, transitionValues as u, preparePlacementPreservationRead as v, publishPlacementTurnClaimState as w, prepareSessionPlacementRead as x, preparePlacementTurnClaimAuthority as y, matchesWorkspaceResultClaim as z };
