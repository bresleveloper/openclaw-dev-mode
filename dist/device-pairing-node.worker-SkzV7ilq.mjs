import { r as resolveMissingRequestedScope } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { D as readDevicePairingStoreStateFromDatabase, F as requestDevicePairingMutationAdmission, c as resolveNodePairingGeneration, k as updatePairedDeviceInTransaction, l as resolveNodePairingState, t as clearNodePairingGenerationState, w as persistDevicePairingStoreState } from "./device-pairing-identity-BRtdqCdi.mjs";
import { t as resolveNodePairApprovalScopes } from "./node-pairing-authz-_-5BGyuw.mjs";
import { c as toPublicPendingRequest, i as samePendingApprovalSurface, o as toPairedNode, r as refreshPendingNodeSurface, s as toPendingSnapshot, t as buildPendingNodeSurface } from "./device-pairing-node.records-TSjeSKgU.mjs";
import { t as devicePairingMutation } from "./device-pairing-dispatch.worker-C51PgU-k.mjs";
//#region src/infra/device-pairing-node.worker.ts
function mutatePairedDevices(database, operate) {
	const state = readDevicePairingStoreStateFromDatabase(database.db);
	const result = operate(state.pairedByDeviceId);
	if (result.persist) persistDevicePairingStoreState(state, void 0, "paired");
	return result.value;
}
function updateNodeSurface(input, update, matches = () => true) {
	const { nodeId, expectedPairingGeneration } = input;
	return updatePairedDeviceInTransaction(nodeId, (device) => {
		const surface = device?.nodeSurface;
		if (!device || !surface || expectedPairingGeneration.nodeId !== device.deviceId || resolveNodePairingGeneration(device)?.key !== expectedPairingGeneration.key || !matches(surface)) return { value: false };
		requestDevicePairingMutationAdmission({
			kind: "node-surface",
			nodeId: device.deviceId,
			pairingGeneration: expectedPairingGeneration.key
		});
		return {
			value: true,
			patch: { nodeSurface: update(surface) }
		};
	});
}
const nodePairingOperations = {
	"node.request": devicePairingMutation((input, { database }) => {
		const { req, nowMs } = input;
		const nodeId = req.nodeId.trim();
		if (!nodeId) throw new Error("nodeId required");
		return mutatePairedDevices(database, (paired) => {
			const device = paired[nodeId];
			if (!device) throw new Error("node pairing requires a paired device");
			requestDevicePairingMutationAdmission({
				kind: "node-surface",
				nodeId
			});
			const request = {
				...req,
				nodeId,
				silent: req.silent && !device.nodeSurface
			};
			const existing = device.pendingNodeSurface;
			const created = !existing || !samePendingApprovalSurface(existing, request);
			const pending = created ? buildPendingNodeSurface({
				req: request,
				nowMs
			}) : refreshPendingNodeSurface(existing, request, nowMs);
			device.pendingNodeSurface = pending;
			return {
				value: {
					status: "pending",
					request: toPublicPendingRequest(device, pending),
					created,
					...created && existing ? { superseded: [{
						requestId: existing.requestId,
						nodeId
					}] } : {}
				},
				persist: true
			};
		});
	}),
	"node.finalizeCleanup": devicePairingMutation((input, { database }) => {
		const { observed } = input;
		return mutatePairedDevices(database, (paired) => {
			const device = paired[observed.nodeId.trim()];
			const pending = device?.pendingNodeSurface;
			if (!device || !pending || observed.requestId !== pending.requestId || observed.revision !== pending.revision) return {
				value: [],
				persist: false
			};
			requestDevicePairingMutationAdmission({
				kind: "node-pending",
				...toPendingSnapshot(device, pending)
			});
			delete device.pendingNodeSurface;
			return {
				value: [{
					requestId: pending.requestId,
					nodeId: device.deviceId
				}],
				persist: true
			};
		});
	}),
	"node.approve": devicePairingMutation((input, { database, recordNodeApproval }) => {
		const { requestId, callerScopes, nowMs } = input;
		return mutatePairedDevices(database, (paired) => {
			const device = Object.values(paired).find((entry) => entry.pendingNodeSurface?.requestId === requestId);
			const pending = device?.pendingNodeSurface;
			if (!device || !pending || input.initialOnly && device.nodeSurface) return {
				value: null,
				persist: false
			};
			requestDevicePairingMutationAdmission({
				kind: "node-pending",
				...toPendingSnapshot(device, pending)
			});
			const missingScope = resolveMissingRequestedScope({
				role: "operator",
				requestedScopes: resolveNodePairApprovalScopes(pending.commands ?? []),
				allowedScopes: callerScopes ?? []
			});
			if (missingScope) return {
				value: {
					status: "forbidden",
					missingScope
				},
				persist: false
			};
			const previousPairingGeneration = resolveNodePairingGeneration(device);
			const now = Math.max(nowMs, (device.nodeSurface?.approvedAtMs ?? -1) + 1);
			device.nodeSurface = {
				displayName: device.nodeSurface?.displayName ?? pending.displayName,
				version: pending.version,
				coreVersion: pending.coreVersion,
				uiVersion: pending.uiVersion,
				modelIdentifier: pending.modelIdentifier,
				caps: pending.caps,
				commands: pending.commands,
				permissions: pending.permissions,
				bins: device.nodeSurface?.bins,
				createdAtMs: device.nodeSurface?.createdAtMs ?? now,
				approvedAtMs: now,
				lastConnectedAtMs: device.nodeSurface?.lastConnectedAtMs,
				lastHostStats: device.nodeSurface?.lastHostStats
			};
			delete device.pendingNodeSurface;
			const nextPairingState = resolveNodePairingState(device);
			const nextPairingGeneration = nextPairingState?.generation?.key;
			if (!nextPairingState || !nextPairingGeneration) return {
				value: null,
				persist: false
			};
			clearNodePairingGenerationState(device, previousPairingGeneration);
			const node = toPairedNode(device);
			if (node) recordNodeApproval({
				nodeId: node.nodeId,
				pairingIdentity: nextPairingState.identity.key,
				previousPairingGeneration: previousPairingGeneration?.key,
				nextPairingGeneration,
				surface: {
					caps: node.caps ?? [],
					commands: node.commands ?? [],
					permissions: node.permissions
				}
			});
			return node ? {
				value: {
					requestId,
					node,
					pairingIdentity: nextPairingState.identity.key,
					nextPairingGeneration,
					...previousPairingGeneration ? { previousPairingGeneration: previousPairingGeneration.key } : {}
				},
				persist: true
			} : {
				value: null,
				persist: false
			};
		});
	}),
	"node.reject": devicePairingMutation((input, { database }) => {
		const { requestId } = input;
		return mutatePairedDevices(database, (paired) => {
			const device = Object.values(paired).find((entry) => entry.pendingNodeSurface?.requestId === requestId);
			const pending = device?.pendingNodeSurface;
			if (!device || !pending) return {
				value: null,
				persist: false
			};
			requestDevicePairingMutationAdmission({
				kind: "node-pending",
				...toPendingSnapshot(device, pending)
			});
			delete device.pendingNodeSurface;
			return {
				value: {
					requestId,
					nodeId: device.deviceId
				},
				persist: true
			};
		});
	}),
	"node.rename": devicePairingMutation((input, { database }) => {
		const displayName = input.displayName.trim();
		if (!displayName) throw new Error("displayName required");
		return mutatePairedDevices(database, (paired) => {
			const device = paired[input.nodeId.trim()];
			if (!device?.nodeSurface) return {
				value: null,
				persist: false
			};
			requestDevicePairingMutationAdmission({
				kind: "node-surface",
				nodeId: device.deviceId,
				pairingGeneration: resolveNodePairingGeneration(device)?.key
			});
			device.nodeSurface = {
				...device.nodeSurface,
				displayName
			};
			return {
				value: toPairedNode(device),
				persist: true
			};
		});
	}),
	"node.recordConnection": devicePairingMutation((input) => {
		const { nodeId, connectedAtMs, expectedPairingGeneration } = input;
		return updatePairedDeviceInTransaction(nodeId, (device) => {
			if (!device?.nodeSurface || expectedPairingGeneration && (expectedPairingGeneration.nodeId !== device.deviceId || resolveNodePairingGeneration(device)?.key !== expectedPairingGeneration.key)) return { value: { recorded: false } };
			requestDevicePairingMutationAdmission({
				kind: "node-surface",
				nodeId: device.deviceId,
				pairingGeneration: resolveNodePairingGeneration(device)?.key
			});
			const firstConnection = device.nodeSurface.lastConnectedAtMs === void 0;
			const lastConnectedAtMs = Math.max(device.nodeSurface.lastConnectedAtMs ?? connectedAtMs, connectedAtMs);
			const clearsDisconnect = device.nodeSurface.lastDisconnectedAtMs !== void 0 && connectedAtMs > device.nodeSurface.lastDisconnectedAtMs;
			return {
				value: {
					recorded: true,
					firstConnection
				},
				patch: { nodeSurface: {
					...device.nodeSurface,
					lastConnectedAtMs,
					...clearsDisconnect ? { lastDisconnectedAtMs: void 0 } : {}
				} }
			};
		});
	}),
	"node.recordDisconnection": devicePairingMutation((input) => updateNodeSurface(input, (surface) => ({
		...surface,
		lastDisconnectedAtMs: Math.max(surface.lastDisconnectedAtMs ?? input.disconnectedAtMs, input.disconnectedAtMs)
	}), (surface) => surface.lastConnectedAtMs === input.connectedAtMs && !(input.disconnectedAtMs < input.connectedAtMs))),
	"node.recordHostStats": devicePairingMutation((input) => updateNodeSurface(input, (surface) => ({
		...surface,
		lastHostStats: input.hostStats
	}))),
	"node.updateBins": devicePairingMutation((input) => updateNodeSurface(input, (surface) => ({
		...surface,
		bins: input.bins
	}))),
	"node.updateSessionHost": devicePairingMutation((input) => updateNodeSurface(input, (surface) => ({
		...surface,
		sessionHost: input.sessionHost
	})))
};
//#endregion
export { nodePairingOperations };
