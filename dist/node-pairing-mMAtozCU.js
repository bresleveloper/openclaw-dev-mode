import { t as normalizeArrayBackedTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import { t as createAsyncLock } from "./async-lock-CaiUOILd.js";
import { a as readJsonIfExists, m as writeJson } from "./json-files-2umMHm0W.js";
import { t as resolveMissingRequestedScope } from "./operator-scope-compat-BVrjvlGm.js";
import { t as resolveNodePairApprovalScopes } from "./node-pairing-authz-BV3lN8MO.js";
import { a as reconcilePendingPairingRequests, i as pruneExpiredPending, n as verifyPairingToken, o as resolvePairingPaths, r as coercePairingStateRecord, t as generatePairingToken } from "./pairing-token-CcP5IwNE.js";
import { randomUUID } from "node:crypto";
//#region src/infra/node-pairing-surface.ts
/** Normalize capability/command lists for node approval-surface comparison. */
function normalizeNodeApprovalSurfaceList(value) {
	return normalizeArrayBackedTrimmedStringList(value) ?? [];
}
/** Compare capability/command surfaces as normalized sets, ignoring order and duplicates. */
function sameNodeApprovalSurfaceSet(left, right) {
	const normalizedLeft = new Set(normalizeNodeApprovalSurfaceList(left));
	const normalizedRight = new Set(normalizeNodeApprovalSurfaceList(right));
	if (normalizedLeft.size !== normalizedRight.size) return false;
	for (const entry of normalizedLeft) if (!normalizedRight.has(entry)) return false;
	return true;
}
/** Compare node permission maps deterministically so key order cannot trigger repairs. */
function sameNodePermissionSurface(left, right) {
	const leftEntries = Object.entries(left ?? {}).toSorted(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey));
	const rightEntries = Object.entries(right ?? {}).toSorted(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey));
	if (leftEntries.length !== rightEntries.length) return false;
	return leftEntries.every(([key, value], index) => {
		const rightEntry = rightEntries[index];
		return rightEntry !== void 0 && rightEntry[0] === key && rightEntry[1] === value;
	});
}
//#endregion
//#region src/infra/pairing-pending.ts
/** Reject one pending pairing request and return the caller-selected id field. */
async function rejectPendingPairingRequest(params) {
	const state = await params.loadState();
	const pending = state.pendingById[params.requestId];
	if (!pending) return null;
	delete state.pendingById[params.requestId];
	await params.persistState(state);
	return {
		requestId: params.requestId,
		[params.idKey]: params.getId(pending)
	};
}
//#endregion
//#region src/infra/node-pairing.ts
const PENDING_TTL_MS = 300 * 1e3;
const OPERATOR_ROLE = "operator";
const withLock = createAsyncLock();
const activeCleanupRevisionClaims = /* @__PURE__ */ new Map();
let nextCleanupClaimGeneration = 0;
function buildPendingNodePairingRequest(params) {
	return {
		requestId: params.requestId ?? randomUUID(),
		revision: randomUUID(),
		nodeId: params.req.nodeId,
		clientId: params.req.clientId,
		clientMode: params.req.clientMode,
		displayName: params.req.displayName,
		platform: params.req.platform,
		version: params.req.version,
		coreVersion: params.req.coreVersion,
		uiVersion: params.req.uiVersion,
		deviceFamily: params.req.deviceFamily,
		modelIdentifier: params.req.modelIdentifier,
		caps: normalizeArrayBackedTrimmedStringList(params.req.caps),
		commands: normalizeArrayBackedTrimmedStringList(params.req.commands),
		permissions: params.req.permissions,
		remoteIp: params.req.remoteIp,
		silent: params.req.silent,
		ts: Date.now()
	};
}
function refreshPendingNodePairingRequest(existing, incoming) {
	return {
		...existing,
		revision: randomUUID(),
		clientId: incoming.clientId ?? existing.clientId,
		clientMode: incoming.clientMode ?? existing.clientMode,
		displayName: incoming.displayName ?? existing.displayName,
		platform: incoming.platform ?? existing.platform,
		version: incoming.version ?? existing.version,
		coreVersion: incoming.coreVersion ?? existing.coreVersion,
		uiVersion: incoming.uiVersion ?? existing.uiVersion,
		deviceFamily: incoming.deviceFamily ?? existing.deviceFamily,
		modelIdentifier: incoming.modelIdentifier ?? existing.modelIdentifier,
		caps: normalizeArrayBackedTrimmedStringList(incoming.caps) ?? existing.caps,
		commands: normalizeArrayBackedTrimmedStringList(incoming.commands) ?? existing.commands,
		permissions: incoming.permissions ?? existing.permissions,
		remoteIp: incoming.remoteIp ?? existing.remoteIp,
		silent: Boolean(existing.silent && incoming.silent),
		ts: Date.now()
	};
}
function samePendingApprovalSurface(existing, incoming) {
	const incomingCaps = normalizeArrayBackedTrimmedStringList(incoming.caps) ?? existing.caps;
	const incomingCommands = normalizeArrayBackedTrimmedStringList(incoming.commands) ?? existing.commands;
	const incomingPermissions = incoming.permissions ?? existing.permissions;
	return sameNodeApprovalSurfaceSet(existing.caps, incomingCaps) && sameNodeApprovalSurfaceSet(existing.commands, incomingCommands) && sameNodePermissionSurface(existing.permissions, incomingPermissions);
}
function samePendingReconnectMetadata(existing, incoming) {
	return (incoming.clientId ?? existing.clientId) === existing.clientId && (incoming.clientMode ?? existing.clientMode) === existing.clientMode && (incoming.displayName ?? existing.displayName) === existing.displayName && (incoming.platform ?? existing.platform) === existing.platform && (incoming.version ?? existing.version) === existing.version && (incoming.coreVersion ?? existing.coreVersion) === existing.coreVersion && (incoming.uiVersion ?? existing.uiVersion) === existing.uiVersion && (incoming.deviceFamily ?? existing.deviceFamily) === existing.deviceFamily && (incoming.modelIdentifier ?? existing.modelIdentifier) === existing.modelIdentifier && (incoming.remoteIp ?? existing.remoteIp) === existing.remoteIp && Boolean(existing.silent && incoming.silent) === Boolean(existing.silent);
}
function mergeNodePairingReplacementInput(params) {
	const latest = params.existing[0];
	return {
		nodeId: params.incoming.nodeId,
		clientId: params.incoming.clientId ?? latest?.clientId,
		clientMode: params.incoming.clientMode ?? latest?.clientMode,
		displayName: params.incoming.displayName ?? latest?.displayName,
		platform: params.incoming.platform ?? latest?.platform,
		version: params.incoming.version ?? latest?.version,
		coreVersion: params.incoming.coreVersion ?? latest?.coreVersion,
		uiVersion: params.incoming.uiVersion ?? latest?.uiVersion,
		deviceFamily: params.incoming.deviceFamily ?? latest?.deviceFamily,
		modelIdentifier: params.incoming.modelIdentifier ?? latest?.modelIdentifier,
		caps: params.incoming.caps ?? latest?.caps,
		commands: params.incoming.commands ?? latest?.commands,
		permissions: params.incoming.permissions ?? latest?.permissions,
		remoteIp: params.incoming.remoteIp ?? latest?.remoteIp,
		silent: Boolean(params.incoming.silent && params.existing.every((pending) => pending.silent === true))
	};
}
function resolveNodeApprovalRequiredScopes(pending) {
	return resolveNodePairApprovalScopes(Array.isArray(pending.commands) ? pending.commands : []);
}
function toPublicPendingNodePairingRequest(pending) {
	const { revision: _revision, ...request } = pending;
	return request;
}
function toPendingNodePairingSnapshot(pending) {
	const snapshot = {
		requestId: pending.requestId,
		nodeId: pending.nodeId
	};
	if (pending.revision) snapshot.revision = pending.revision;
	return snapshot;
}
function toPendingNodePairingEntry(pending) {
	return {
		...toPublicPendingNodePairingRequest(pending),
		requiredApproveScopes: resolveNodeApprovalRequiredScopes(pending)
	};
}
async function loadState(baseDir) {
	const { pendingPath, pairedPath } = resolvePairingPaths(baseDir, "nodes");
	const [pending, paired] = await Promise.all([readJsonIfExists(pendingPath), readJsonIfExists(pairedPath)]);
	const state = {
		pendingById: coercePairingStateRecord(pending),
		pairedByNodeId: coercePairingStateRecord(paired)
	};
	pruneExpiredPending(state.pendingById, Date.now(), PENDING_TTL_MS);
	return state;
}
async function persistState(state, baseDir) {
	const { pendingPath, pairedPath } = resolvePairingPaths(baseDir, "nodes");
	await Promise.all([writeJson(pendingPath, state.pendingById), writeJson(pairedPath, state.pairedByNodeId)]);
}
function normalizeNodeId(nodeId) {
	return nodeId.trim();
}
function buildCleanupRevisionClaimKey(pendingPath, observed) {
	return `${pendingPath}\0${observed.requestId}\0${observed.revision ?? ""}`;
}
function addCleanupClaim(claim) {
	for (const observed of claim.observed) {
		const key = buildCleanupRevisionClaimKey(claim.pendingPath, observed);
		const generations = activeCleanupRevisionClaims.get(key) ?? /* @__PURE__ */ new Set();
		generations.add(claim.generation);
		activeCleanupRevisionClaims.set(key, generations);
	}
}
function cleanupClaimIsActive(claim) {
	return claim.observed.some((observed) => {
		const key = buildCleanupRevisionClaimKey(claim.pendingPath, observed);
		return activeCleanupRevisionClaims.get(key)?.has(claim.generation) === true;
	});
}
function removeCleanupClaim(claim) {
	for (const observed of claim.observed) {
		const key = buildCleanupRevisionClaimKey(claim.pendingPath, observed);
		const generations = activeCleanupRevisionClaims.get(key);
		generations?.delete(claim.generation);
		if (!generations || generations.size === 0) activeCleanupRevisionClaims.delete(key);
	}
}
function invalidateCleanupClaimsThrough(claim, pending, baseDir) {
	const pendingPath = resolvePairingPaths(baseDir, "nodes").pendingPath;
	const key = buildCleanupRevisionClaimKey(pendingPath, toPendingNodePairingSnapshot(pending));
	const generations = activeCleanupRevisionClaims.get(key);
	if (!generations) return;
	for (const generation of generations) if (generation <= claim.generation) generations.delete(generation);
	if (generations.size === 0) activeCleanupRevisionClaims.delete(key);
}
function newToken() {
	return generatePairingToken();
}
async function listNodePairing(baseDir) {
	const state = await loadState(baseDir);
	return {
		pending: Object.values(state.pendingById).toSorted((a, b) => b.ts - a.ts).map(toPendingNodePairingEntry),
		paired: Object.values(state.pairedByNodeId).toSorted((a, b) => b.approvedAtMs - a.approvedAtMs)
	};
}
/** Snapshot pairing state and claim current pending revisions for one paired reconnect. */
async function beginNodePairingConnect(nodeId, baseDir) {
	return await withLock(async () => {
		const state = await loadState(baseDir);
		const normalized = normalizeNodeId(nodeId);
		const pairedNode = state.pairedByNodeId[normalized] ?? null;
		const observed = Object.values(state.pendingById).filter((entry) => entry.nodeId === normalized).map(toPendingNodePairingSnapshot);
		if (!pairedNode || observed.length === 0) return { pairedNode };
		const pendingPath = resolvePairingPaths(baseDir, "nodes").pendingPath;
		const claim = {
			baseDir,
			generation: ++nextCleanupClaimGeneration,
			nodeId: normalized,
			pendingPath,
			observed
		};
		addCleanupClaim(claim);
		return {
			pairedNode,
			cleanupClaim: claim
		};
	});
}
function pendingHasActiveCleanupClaim(pending, baseDir) {
	const pendingPath = resolvePairingPaths(baseDir, "nodes").pendingPath;
	const key = buildCleanupRevisionClaimKey(pendingPath, toPendingNodePairingSnapshot(pending));
	return (activeCleanupRevisionClaims.get(key)?.size ?? 0) > 0;
}
/** Release a reconnect cleanup claim without changing pending pairing state. */
async function releaseNodePairingCleanupClaim(claim) {
	await withLock(async () => {
		removeCleanupClaim(claim);
	});
}
/** Delete pending revisions claimed by a reconnect after hello succeeds. */
async function finalizeNodePairingCleanupClaim(claim) {
	return await withLock(async () => {
		if (!cleanupClaimIsActive(claim)) return [];
		try {
			const state = await loadState(claim.baseDir);
			const observedById = new Map(claim.observed.filter((entry) => entry.nodeId === claim.nodeId).map((entry) => [entry.requestId, entry]));
			const rejected = Object.values(state.pendingById).filter((pending) => {
				const observed = observedById.get(pending.requestId);
				return observed !== void 0 && observed.revision === pending.revision;
			}).toSorted((left, right) => right.ts - left.ts);
			if (rejected.length === 0) return [];
			for (const pending of rejected) delete state.pendingById[pending.requestId];
			await persistState(state, claim.baseDir);
			return rejected.map((pending) => ({
				requestId: pending.requestId,
				nodeId: pending.nodeId
			}));
		} finally {
			removeCleanupClaim(claim);
		}
	});
}
/** Create or refresh a pending node pairing request for operator approval. */
async function requestNodePairing(req, baseDir) {
	return await withLock(async () => {
		const state = await loadState(baseDir);
		const nodeId = normalizeNodeId(req.nodeId);
		if (!nodeId) throw new Error("nodeId required");
		const pendingForNode = Object.values(state.pendingById).filter((pending) => pending.nodeId === nodeId).toSorted((left, right) => right.ts - left.ts);
		const result = await reconcilePendingPairingRequests({
			pendingById: state.pendingById,
			existing: pendingForNode,
			incoming: {
				...req,
				nodeId
			},
			canRefreshSingle: (existing, incoming) => samePendingApprovalSurface(existing, incoming),
			refreshSingle: (existing, incoming) => refreshPendingNodePairingRequest(existing, incoming),
			buildReplacement: ({ existing, incoming }) => buildPendingNodePairingRequest({ req: mergeNodePairingReplacementInput({
				existing,
				incoming
			}) }),
			persist: async () => await persistState(state, baseDir)
		});
		const superseded = result.created ? pendingForNode.filter((pending) => pending.requestId !== result.request.requestId).map((pending) => ({
			requestId: pending.requestId,
			nodeId: pending.nodeId
		})) : [];
		const publicResult = {
			...result,
			request: toPublicPendingNodePairingRequest(result.request)
		};
		return superseded.length > 0 ? {
			...publicResult,
			superseded
		} : publicResult;
	});
}
/** Reuse an unchanged reconnect request without refreshing or writing pairing state. */
async function reusePendingNodePairingForReconnect(req, cleanupClaim, baseDir) {
	return await withLock(async () => {
		const state = await loadState(baseDir);
		const nodeId = normalizeNodeId(req.nodeId);
		const pendingForNode = Object.values(state.pendingById).filter((pending) => pending.nodeId === nodeId).toSorted((left, right) => right.ts - left.ts);
		if (pendingForNode.length === 1 && samePendingApprovalSurface(pendingForNode[0], {
			...req,
			nodeId
		}) && samePendingReconnectMetadata(pendingForNode[0], req)) {
			const pending = pendingForNode[0];
			if (cleanupClaim) invalidateCleanupClaimsThrough(cleanupClaim, pending, baseDir);
			return {
				status: "pending",
				request: toPublicPendingNodePairingRequest(pending),
				created: false
			};
		}
		return null;
	});
}
/** Approve a pending node request when caller scopes cover the requested command surface. */
async function approveNodePairing(requestId, options, baseDir) {
	return await withLock(async () => {
		const state = await loadState(baseDir);
		const pending = state.pendingById[requestId];
		if (!pending) return null;
		if (pendingHasActiveCleanupClaim(pending, baseDir)) return null;
		const missingScope = resolveMissingRequestedScope({
			role: OPERATOR_ROLE,
			requestedScopes: resolveNodeApprovalRequiredScopes(pending),
			allowedScopes: options.callerScopes ?? []
		});
		if (missingScope) return {
			status: "forbidden",
			missingScope
		};
		const now = Date.now();
		const existing = state.pairedByNodeId[pending.nodeId];
		const node = {
			nodeId: pending.nodeId,
			token: newToken(),
			clientId: pending.clientId,
			clientMode: pending.clientMode,
			displayName: pending.displayName,
			platform: pending.platform,
			version: pending.version,
			coreVersion: pending.coreVersion,
			uiVersion: pending.uiVersion,
			deviceFamily: pending.deviceFamily,
			modelIdentifier: pending.modelIdentifier,
			caps: pending.caps,
			commands: pending.commands,
			permissions: pending.permissions,
			remoteIp: pending.remoteIp,
			createdAtMs: existing?.createdAtMs ?? now,
			approvedAtMs: now
		};
		delete state.pendingById[requestId];
		state.pairedByNodeId[pending.nodeId] = node;
		await persistState(state, baseDir);
		return {
			requestId,
			node
		};
	});
}
/** Reject a pending node pairing request. */
async function rejectNodePairing(requestId, baseDir) {
	return await withLock(async () => {
		return await rejectPendingPairingRequest({
			requestId,
			idKey: "nodeId",
			loadState: () => loadState(baseDir),
			persistState: (state) => persistState(state, baseDir),
			getId: (pending) => pending.nodeId
		});
	});
}
/** Remove a paired node without disturbing unrelated pending requests. */
async function removePairedNode(nodeId, baseDir) {
	return await withLock(async () => {
		const state = await loadState(baseDir);
		const normalized = normalizeNodeId(nodeId);
		if (!normalized || !state.pairedByNodeId[normalized]) return null;
		delete state.pairedByNodeId[normalized];
		await persistState(state, baseDir);
		return { nodeId: normalized };
	});
}
/** Verify a paired node token and return the approved node record on success. */
async function verifyNodeToken(nodeId, token, baseDir) {
	const state = await loadState(baseDir);
	const normalized = normalizeNodeId(nodeId);
	const node = state.pairedByNodeId[normalized];
	if (!node) return { ok: false };
	return verifyPairingToken(token, node.token) ? {
		ok: true,
		node
	} : { ok: false };
}
/** Update non-auth metadata for a paired node heartbeat/status refresh. */
async function updatePairedNodeMetadata(nodeId, patch, baseDir) {
	return await withLock(async () => {
		const state = await loadState(baseDir);
		const normalized = normalizeNodeId(nodeId);
		const existing = state.pairedByNodeId[normalized];
		if (!existing) return false;
		const next = {
			...existing,
			clientId: patch.clientId ?? existing.clientId,
			clientMode: patch.clientMode ?? existing.clientMode,
			displayName: patch.displayName ?? existing.displayName,
			platform: patch.platform ?? existing.platform,
			version: patch.version ?? existing.version,
			coreVersion: patch.coreVersion ?? existing.coreVersion,
			uiVersion: patch.uiVersion ?? existing.uiVersion,
			deviceFamily: patch.deviceFamily ?? existing.deviceFamily,
			modelIdentifier: patch.modelIdentifier ?? existing.modelIdentifier,
			remoteIp: patch.remoteIp ?? existing.remoteIp,
			caps: patch.caps ?? existing.caps,
			commands: patch.commands ?? existing.commands,
			bins: patch.bins ?? existing.bins,
			permissions: patch.permissions ?? existing.permissions,
			lastConnectedAtMs: patch.lastConnectedAtMs ?? existing.lastConnectedAtMs,
			lastSeenAtMs: patch.lastSeenAtMs ?? existing.lastSeenAtMs,
			lastSeenReason: patch.lastSeenReason ?? existing.lastSeenReason
		};
		state.pairedByNodeId[normalized] = next;
		await persistState(state, baseDir);
		return true;
	});
}
/** Rename a paired node display name while preserving token and approval metadata. */
async function renamePairedNode(nodeId, displayName, baseDir) {
	return await withLock(async () => {
		const state = await loadState(baseDir);
		const normalized = normalizeNodeId(nodeId);
		const existing = state.pairedByNodeId[normalized];
		if (!existing) return null;
		const trimmed = displayName.trim();
		if (!trimmed) throw new Error("displayName required");
		const next = {
			...existing,
			displayName: trimmed
		};
		state.pairedByNodeId[normalized] = next;
		await persistState(state, baseDir);
		return next;
	});
}
//#endregion
export { rejectNodePairing as a, renamePairedNode as c, updatePairedNodeMetadata as d, verifyNodeToken as f, sameNodePermissionSurface as h, listNodePairing as i, requestNodePairing as l, sameNodeApprovalSurfaceSet as m, beginNodePairingConnect as n, releaseNodePairingCleanupClaim as o, normalizeNodeApprovalSurfaceList as p, finalizeNodePairingCleanupClaim as r, removePairedNode as s, approveNodePairing as t, reusePendingNodePairingForReconnect as u };
