import { r as normalizeArrayBackedTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { t as resolveNodePairApprovalScopes } from "./node-pairing-authz-KyMm4tmF.mjs";
import { a as resolveNodePairingGeneration } from "./device-pairing-identity-BnU9nqx2.mjs";
import { i as sameNodePermissionSurface, r as sameNodeApprovalSurfaceSet } from "./node-pairing-surface-B68Et9XU.mjs";
import { randomUUID } from "node:crypto";
//#region src/infra/device-pairing-node.records.ts
function toPublicPendingRequest(device, pending) {
	return {
		requestId: pending.requestId,
		nodeId: device.deviceId,
		clientId: pending.clientId ?? device.clientId,
		clientMode: pending.clientMode ?? device.clientMode,
		displayName: pending.displayName ?? device.displayName,
		platform: pending.platform ?? device.platform,
		version: pending.version,
		coreVersion: pending.coreVersion,
		uiVersion: pending.uiVersion,
		deviceFamily: pending.deviceFamily ?? device.deviceFamily,
		modelIdentifier: pending.modelIdentifier,
		caps: pending.caps,
		commands: pending.commands,
		requiredApproveScopes: resolveNodePairApprovalScopes(pending.commands ?? []),
		permissions: pending.permissions,
		remoteIp: pending.remoteIp ?? device.remoteIp,
		silent: pending.silent,
		ts: pending.ts
	};
}
function toPendingSnapshot(device, pending) {
	return {
		requestId: pending.requestId,
		nodeId: device.deviceId,
		...pending.revision ? { revision: pending.revision } : {}
	};
}
function toPairedNode(device, options) {
	const surface = device.nodeSurface;
	if (!surface) return null;
	const pairingGeneration = options?.includePairingGeneration ? resolveNodePairingGeneration(device)?.key : void 0;
	return {
		nodeId: device.deviceId,
		clientId: device.clientId,
		clientMode: device.clientMode,
		displayName: surface.displayName ?? device.displayName,
		platform: device.platform,
		version: surface.version,
		coreVersion: surface.coreVersion,
		uiVersion: surface.uiVersion,
		deviceFamily: device.deviceFamily,
		modelIdentifier: surface.modelIdentifier,
		caps: surface.caps,
		commands: surface.commands,
		permissions: surface.permissions,
		remoteIp: device.remoteIp,
		bins: surface.bins,
		...surface.sessionHost === true ? { sessionHost: true } : {},
		...pairingGeneration ? { pairingGeneration } : {},
		createdAtMs: surface.createdAtMs,
		approvedAtMs: surface.approvedAtMs,
		lastConnectedAtMs: surface.lastConnectedAtMs,
		lastDisconnectedAtMs: surface.lastDisconnectedAtMs,
		lastHostStats: surface.lastHostStats,
		lastSeenAtMs: device.lastSeenAtMs,
		lastSeenReason: device.lastSeenReason
	};
}
function buildPendingNodeSurface(params) {
	return {
		requestId: randomUUID(),
		revision: randomUUID(),
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
		ts: params.nowMs
	};
}
function refreshPendingNodeSurface(existing, incoming, nowMs) {
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
		ts: nowMs
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
/** Project node pairing state from an already-loaded device pairing snapshot. */
function projectNodePairing(pairedDevices, options) {
	const pending = [];
	const paired = [];
	for (const device of pairedDevices) {
		if (device.pendingNodeSurface) pending.push(toPublicPendingRequest(device, device.pendingNodeSurface));
		const node = toPairedNode(device, options);
		if (node) paired.push(node);
	}
	pending.sort((a, b) => b.ts - a.ts);
	paired.sort((a, b) => b.approvedAtMs - a.approvedAtMs);
	return {
		pending,
		paired
	};
}
//#endregion
export { samePendingReconnectMetadata as a, toPublicPendingRequest as c, samePendingApprovalSurface as i, projectNodePairing as n, toPairedNode as o, refreshPendingNodeSurface as r, toPendingSnapshot as s, buildPendingNodeSurface as t };
