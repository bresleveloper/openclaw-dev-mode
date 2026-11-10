import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-22SfWsLt.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { c as ensureDevicePairingJoinCodeSchema } from "./openclaw-state-db-schema-additive-Dk7csa7u.mjs";
import { a as roleScopesAllow, i as resolveScopeOutsideRequestedRoles, r as resolveMissingRequestedScope } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { n as normalizeDeviceAuthScopes } from "./device-auth-CLsH-il7.mjs";
import { _ as resolveDeviceProfileScopes, g as resolveDeviceProfileRoleScopes } from "./device-bootstrap-profile-DQKf7Vz1.mjs";
import { F as requestDevicePairingMutationAdmission, _ as sameDevicePairingStringSet, c as resolveNodePairingGeneration, d as mergeDevicePairingRoles, f as mergeDevicePairingScopes, g as resolveRequestedDeviceRoles, h as resolvePairingRequestExpiry, i as listApprovedPairedDeviceRoles, k as updatePairedDeviceInTransaction, m as preserveDeviceRoleScopes, o as resolveApprovedDeviceScopeBaseline, p as normalizeDevicePairingRole, t as clearNodePairingGenerationState, u as loadDevicePairingStateForMutation, w as persistDevicePairingStoreState } from "./device-pairing-identity-BRtdqCdi.mjs";
import { n as verifyPairingToken } from "./pairing-token-CzXJ-1-p.mjs";
import { n as resolveRoleTokenScopes, t as createDeviceAuthToken } from "./device-pairing-token-utils-CV7FLXhz.mjs";
import { t as devicePairingMutation } from "./device-pairing-dispatch.worker-C51PgU-k.mjs";
import { n as revokeDeviceBootstrapTokensForDeviceInDatabase } from "./device-bootstrap.worker-kernel-bklGYOR3.mjs";
import { randomUUID } from "node:crypto";
//#region src/infra/device-pairing-approval.kernel.ts
const OPERATOR_ROLE = "operator";
const OPERATOR_SCOPE_PREFIX = "operator.";
function mergeApprovalKind(existing, incoming) {
	if (incoming === "owner" || !existing) return incoming;
	if (existing.approvedVia === void 0) return incoming === "bootstrap" ? "bootstrap" : void 0;
	if (existing.approvedVia === "owner" || existing.approvedVia === "bootstrap") return existing.approvedVia;
	return incoming;
}
function mergeApprovalRoles(existing, pending) {
	return mergeDevicePairingRoles(existing?.roles, existing?.role, pending.roles, pending.role);
}
function buildApprovedPairedDevice(params) {
	return {
		deviceId: params.pending.deviceId,
		publicKey: params.pending.publicKey,
		displayName: params.accessMetadata?.displayName ?? params.pending.displayName,
		platform: params.pending.platform,
		deviceFamily: params.pending.deviceFamily,
		clientId: params.pending.clientId,
		clientMode: params.pending.clientMode,
		browserOrigin: params.pending.browserOrigin,
		role: params.pending.role,
		roles: params.roles,
		scopes: params.approvedScopes,
		approvedScopes: params.approvedScopes,
		remoteIp: params.accessMetadata?.remoteIp ?? params.pending.remoteIp,
		tokens: params.tokens,
		approvedVia: mergeApprovalKind(params.existing, params.approvedVia),
		...params.existing?.nodeSurface ? { nodeSurface: params.existing.nodeSurface } : {},
		...params.existing?.pendingNodeSurface ? { pendingNodeSurface: params.existing.pendingNodeSurface } : {},
		...params.existing?.operatorLabel ? { operatorLabel: params.existing.operatorLabel } : {},
		createdAtMs: params.existing?.createdAtMs ?? params.now,
		approvedAtMs: params.now,
		lastSeenAtMs: params.accessMetadata?.lastSeenAtMs ?? params.existing?.lastSeenAtMs,
		lastSeenReason: params.accessMetadata?.lastSeenReason ?? params.existing?.lastSeenReason
	};
}
function commitApprovedDevicePairing(params) {
	const { state, requestId, device } = params;
	const existing = state.pairedByDeviceId[device.deviceId];
	const previousNodeGeneration = resolveNodePairingGeneration(existing ?? null);
	const nextNodeGeneration = resolveNodePairingGeneration(device);
	const nodePairingGenerationChanged = Boolean(previousNodeGeneration && previousNodeGeneration.key !== nextNodeGeneration?.key);
	clearNodePairingGenerationState(device, previousNodeGeneration);
	const installationIdentityChanged = Boolean(existing && existing.publicKey !== device.publicKey);
	delete state.pendingById[requestId];
	state.pairedByDeviceId[device.deviceId] = device;
	persistDevicePairingStoreState(state, void 0, "both", installationIdentityChanged ? { clearApnsNodeIds: [device.deviceId] } : void 0);
	return {
		status: "approved",
		requestId,
		device,
		...nodePairingGenerationChanged ? { nodePairingGenerationChanged: true } : {}
	};
}
function resolveApprovedTokenScopes(params) {
	const pendingScopes = resolveRoleTokenScopes(params.role, params.pending.scopes);
	if (pendingScopes.length > 0) {
		const approvedBaseline = resolveRoleTokenScopes(params.role, params.existing?.approvedScopes ?? params.existing?.scopes);
		const requestedScopeDelta = params.existingToken && approvedBaseline.length > 0 ? pendingScopes.filter((scope) => !approvedBaseline.includes(scope)) : pendingScopes;
		if (requestedScopeDelta.length === 0 && params.existingToken) return resolveRoleTokenScopes(params.role, params.existingToken.scopes);
		return resolveRoleTokenScopes(params.role, mergeDevicePairingScopes(params.existingToken?.scopes, requestedScopeDelta));
	}
	return resolveRoleTokenScopes(params.role, params.existingToken?.scopes ?? params.approvedScopes ?? params.existing?.approvedScopes ?? params.existing?.scopes);
}
function withPendingDevicePairingApproval(requestId, nowMs, approve) {
	const state = loadDevicePairingStateForMutation(nowMs);
	const pending = state.pendingById[requestId];
	if (!pending) return null;
	const existing = state.pairedByDeviceId[pending.deviceId];
	requestDevicePairingMutationAdmission({
		kind: "pairing-approval",
		pending,
		existing
	});
	return approve(state, pending, existing);
}
/** Approve an authoritative pending row inside the admitted pairing transaction. */
function approveDevicePairingInWorker(requestId, options, nowMs) {
	return withPendingDevicePairingApproval(requestId, nowMs, (state, pendingRecord, existing) => {
		const autoApproveScopes = options?.autoApproveNewDeviceScopes;
		const requestedRoles = resolveRequestedDeviceRoles(pendingRecord);
		const trustedIngressSameKeyDevice = (options?.approvedVia === "trusted-proxy" || options?.approvedVia === "remote-ingress") && existing !== void 0 && existing.publicKey === pendingRecord.publicKey;
		if (autoApproveScopes && ((pendingRecord.isRepair || existing) && !trustedIngressSameKeyDevice || !sameDevicePairingStringSet(requestedRoles, [OPERATOR_ROLE]))) return null;
		const pending = autoApproveScopes ? {
			...pendingRecord,
			scopes: [...autoApproveScopes]
		} : pendingRecord;
		const requestedScopes = normalizeDeviceAuthScopes(pending.scopes);
		const roleMismatchScope = resolveScopeOutsideRequestedRoles({
			requestedRoles,
			requestedScopes
		});
		if (roleMismatchScope) return {
			status: "forbidden",
			reason: "scope-outside-requested-roles",
			scope: roleMismatchScope
		};
		const now = nowMs;
		const roles = mergeApprovalRoles(existing, pending);
		const approvedScopes = mergeDevicePairingScopes(existing?.approvedScopes ?? existing?.scopes, pending.scopes);
		const tokens = existing?.tokens ? { ...existing.tokens } : {};
		const nextTokenScopesByRole = /* @__PURE__ */ new Map();
		for (const roleForToken of requestedRoles) {
			const existingToken = tokens[roleForToken];
			const nextScopes = resolveApprovedTokenScopes({
				role: roleForToken,
				pending,
				existingToken,
				approvedScopes,
				existing
			});
			nextTokenScopesByRole.set(roleForToken, nextScopes);
			if (roleForToken === OPERATOR_ROLE && nextScopes.length > 0) {
				const callerRequiredScopes = mergeDevicePairingScopes(resolveRoleTokenScopes(roleForToken, pending.scopes), nextScopes) ?? nextScopes;
				if (!options?.callerScopes) return {
					status: "forbidden",
					reason: "caller-scopes-required",
					scope: callerRequiredScopes[0]
				};
				const missingScope = resolveMissingRequestedScope({
					role: OPERATOR_ROLE,
					requestedScopes: callerRequiredScopes,
					allowedScopes: options.callerScopes
				});
				if (missingScope) return {
					status: "forbidden",
					reason: "caller-missing-scope",
					scope: missingScope
				};
			}
		}
		for (const [roleForToken, nextScopes] of nextTokenScopesByRole) {
			const existingToken = tokens[roleForToken];
			const tokenNow = nowMs;
			tokens[roleForToken] = createDeviceAuthToken({
				role: roleForToken,
				scopes: nextScopes,
				existing: existingToken,
				preserveExistingIssuer: true,
				now: tokenNow,
				rotatedAtMs: existingToken ? tokenNow : void 0
			});
		}
		return commitApprovedDevicePairing({
			state,
			requestId,
			device: buildApprovedPairedDevice({
				pending,
				existing,
				roles,
				approvedScopes,
				tokens,
				now,
				approvedVia: options?.approvedVia ?? "owner",
				accessMetadata: options?.accessMetadata
			})
		});
	});
}
/** Approve one bounded bootstrap grant inside the admitted pairing transaction. */
function approveBootstrapDevicePairingInWorker(requestId, bootstrapProfile, options, nowMs) {
	let replacedRoles = [];
	const approvedRoles = mergeDevicePairingRoles(bootstrapProfile.roles) ?? [];
	const approvedScopes = resolveDeviceProfileScopes(bootstrapProfile, approvedRoles);
	return {
		result: withPendingDevicePairingApproval(requestId, nowMs, (state, pending, existing) => {
			const requestedRoles = resolveRequestedDeviceRoles(pending);
			const missingRole = requestedRoles.find((role) => !approvedRoles.includes(role));
			if (missingRole) return {
				status: "forbidden",
				reason: "bootstrap-role-not-allowed",
				role: missingRole
			};
			const requestedOperatorScopes = normalizeDeviceAuthScopes(pending.scopes).filter((scope) => scope.startsWith(OPERATOR_SCOPE_PREFIX));
			const missingScope = resolveMissingRequestedScope({
				role: OPERATOR_ROLE,
				requestedScopes: requestedOperatorScopes,
				allowedScopes: approvedScopes
			});
			if (missingScope) return {
				status: "forbidden",
				reason: "bootstrap-scope-not-allowed",
				scope: missingScope
			};
			const now = nowMs;
			const grantedRoles = requestedRoles;
			const grantedScopes = resolveDeviceProfileScopes(bootstrapProfile, grantedRoles, pending.scopes ?? []);
			const grantedRoleSet = new Set(grantedRoles);
			const preservedExistingScopes = (mergeDevicePairingRoles(existing?.roles, existing?.role) ?? []).flatMap((existingRole) => grantedRoleSet.has(existingRole) ? [] : preserveDeviceRoleScopes(existingRole, existing?.approvedScopes ?? existing?.scopes));
			const roles = mergeApprovalRoles(existing, pending);
			const nextApprovedScopes = mergeDevicePairingScopes(preservedExistingScopes, grantedScopes);
			const tokens = existing?.tokens ? { ...existing.tokens } : {};
			for (const roleForToken of grantedRoles) {
				const existingToken = tokens[roleForToken];
				const tokenScopes = roleForToken === OPERATOR_ROLE ? resolveDeviceProfileRoleScopes(bootstrapProfile, roleForToken, grantedScopes) : [];
				tokens[roleForToken] = createDeviceAuthToken({
					role: roleForToken,
					scopes: tokenScopes,
					existing: existingToken,
					now,
					...existingToken ? { rotatedAtMs: now } : {}
				});
			}
			const approved = commitApprovedDevicePairing({
				state,
				requestId,
				device: buildApprovedPairedDevice({
					pending,
					existing,
					roles,
					approvedScopes: nextApprovedScopes,
					tokens,
					now,
					approvedVia: "bootstrap",
					accessMetadata: options?.accessMetadata
				})
			});
			replacedRoles = grantedRoles.filter((role) => existing?.tokens?.[role]);
			return approved;
		}),
		replacedRoles
	};
}
//#endregion
//#region src/infra/device-pairing-core.kernel.ts
function canRefreshPendingDevicePairingRequest(existing, incoming) {
	if (existing.publicKey !== incoming.publicKey) return false;
	if (existing.browserOrigin !== incoming.browserOrigin) return false;
	if (normalizeDevicePairingRole(existing.role) !== normalizeDevicePairingRole(incoming.role)) return false;
	const incomingRoles = resolveRequestedDeviceRoles(incoming);
	const existingRoles = resolveRequestedDeviceRoles(existing);
	const incomingScopes = normalizeDeviceAuthScopes(incoming.scopes);
	const existingScopes = normalizeDeviceAuthScopes(existing.scopes);
	if (sameDevicePairingStringSet(existingRoles, incomingRoles) && sameDevicePairingStringSet(existingScopes, incomingScopes)) return true;
	const existingRoleSet = new Set(existingRoles);
	if (!incomingRoles.every((role) => existingRoleSet.has(role))) return false;
	return incomingScopes.every((scope) => incomingRoles.some((role) => roleScopesAllow({
		role,
		requestedScopes: [scope],
		allowedScopes: existingScopes
	})));
}
function refreshPendingDevicePairingRequest(existing, incoming, isRepair, nowMs) {
	return {
		...existing,
		publicKey: incoming.publicKey,
		displayName: incoming.displayName ?? existing.displayName,
		platform: incoming.platform ?? existing.platform,
		deviceFamily: incoming.deviceFamily ?? existing.deviceFamily,
		clientId: incoming.clientId ?? existing.clientId,
		clientMode: incoming.clientMode ?? existing.clientMode,
		browserOrigin: existing.browserOrigin,
		remoteIp: incoming.remoteIp ?? existing.remoteIp,
		silent: Boolean(existing.silent && incoming.silent),
		isRepair: existing.isRepair || isRepair,
		ts: existing.ts,
		refreshedAtMs: nowMs
	};
}
function toPublicPendingDevicePairingRequest(pending) {
	const { refreshedAtMs: _refreshedAtMs, ...request } = pending;
	return request;
}
/** Create or refresh a pending device pairing request for owner approval. */
function requestDevicePairingInWorker(req, nowMs) {
	const state = loadDevicePairingStateForMutation(nowMs);
	const deviceId = req.deviceId.trim();
	if (!deviceId) throw new Error("deviceId required");
	const isRepair = Boolean(state.pairedByDeviceId[deviceId]);
	const pendingForDevice = Object.values(state.pendingById).filter((pending) => pending.deviceId === deviceId).toSorted((left, right) => right.ts - left.ts);
	const latestPending = pendingForDevice[0];
	let request;
	let created = false;
	if (pendingForDevice.length === 1 && latestPending && canRefreshPendingDevicePairingRequest(latestPending, req)) request = refreshPendingDevicePairingRequest(latestPending, req, isRepair, nowMs);
	else {
		for (const pending of pendingForDevice) delete state.pendingById[pending.requestId];
		const role = normalizeDevicePairingRole(req.role) ?? normalizeDevicePairingRole(latestPending?.role) ?? void 0;
		request = {
			requestId: randomUUID(),
			deviceId,
			publicKey: req.publicKey,
			displayName: req.displayName,
			platform: req.platform,
			deviceFamily: req.deviceFamily,
			clientId: req.clientId,
			clientMode: req.clientMode,
			browserOrigin: req.browserOrigin,
			role,
			roles: mergeDevicePairingRoles(...pendingForDevice.flatMap((pending) => [pending.roles, pending.role]), req.roles, req.role, role),
			scopes: mergeDevicePairingScopes(...pendingForDevice.map((pending) => pending.scopes), req.scopes),
			remoteIp: req.remoteIp,
			silent: Boolean(req.silent && pendingForDevice.every((pending) => pending.silent === true)),
			isRepair,
			ts: nowMs
		};
		created = true;
	}
	state.pendingById[request.requestId] = request;
	persistDevicePairingStoreState(state, void 0, "pending");
	const superseded = created ? pendingForDevice.filter((pending) => pending.requestId !== request.requestId).map((pending) => ({
		requestId: pending.requestId,
		deviceId: pending.deviceId
	})) : [];
	return {
		status: "pending",
		request: toPublicPendingDevicePairingRequest(request),
		created,
		expiresAtMs: resolvePairingRequestExpiry(request.refreshedAtMs ?? request.ts),
		...superseded.length > 0 ? { superseded } : {}
	};
}
/** Reject a pending request and revoke matching bootstrap tokens for that device. */
function rejectDevicePairingInWorker(database, requestId, nowMs) {
	const state = loadDevicePairingStateForMutation(nowMs);
	const pending = state.pendingById[requestId];
	if (!pending) return null;
	delete state.pendingById[requestId];
	persistDevicePairingStoreState(state, void 0, "pending");
	revokeDeviceBootstrapTokensForDeviceInDatabase(database, {
		deviceId: pending.deviceId,
		publicKey: pending.publicKey,
		nowMs
	});
	return {
		requestId,
		deviceId: pending.deviceId
	};
}
/** Remove a paired device and any pending repair requests for the same device id. */
function removePairedDeviceRecord(state, deviceId) {
	delete state.pairedByDeviceId[deviceId];
	for (const [requestId, pending] of Object.entries(state.pendingById)) if (pending.deviceId === deviceId) delete state.pendingById[requestId];
}
function removePairedDeviceInWorker(deviceId, nowMs) {
	const state = loadDevicePairingStateForMutation(nowMs);
	const normalized = deviceId.trim();
	if (!normalized || !state.pairedByDeviceId[normalized]) return null;
	removePairedDeviceRecord(state, normalized);
	persistDevicePairingStoreState(state, void 0, "both", { clearApnsNodeIds: [normalized] });
	return { deviceId: normalized };
}
function silentPairingClusterKey(device) {
	const clientId = device.clientId?.trim().toLowerCase() ?? "";
	const clientMode = device.clientMode?.trim().toLowerCase() ?? "";
	const displayName = device.displayName?.trim().toLowerCase() ?? "";
	if (!clientId && !clientMode && !displayName) return null;
	return `${clientId}\0${clientMode}\0${displayName}`;
}
const PRUNE_RECENT_APPROVAL_GRACE_MS = 6e4;
/**
* Remove silent-approved sibling records superseded by a newly approved silent
* pairing of the same client cluster. Only records whose latest approval was
* same-host local ("silent") are eligible, as anchor and as victim: local
* clients re-pair silently by construction and share the gateway host, so the
* metadata cluster key cannot match a different machine. Currently connected
* devices are skipped so concurrent sessions with distinct state dirs keep
* their tokens while live.
*/
function pruneSupersededSilentPairedDevicesInWorker(params) {
	const state = loadDevicePairingStateForMutation(params.nowMs);
	const anchor = state.pairedByDeviceId[params.deviceId.trim()];
	if (!anchor || anchor.approvedVia !== "silent") return [];
	const anchorKey = silentPairingClusterKey(anchor);
	if (!anchorKey) return [];
	const nowMs = params.nowMs;
	const protectedDeviceIds = new Set(params.protectedDeviceIds);
	const removed = [];
	for (const device of Object.values(state.pairedByDeviceId)) {
		if (device.deviceId === anchor.deviceId) continue;
		if (device.approvedVia !== "silent") continue;
		if (silentPairingClusterKey(device) !== anchorKey) continue;
		if (nowMs - device.approvedAtMs < PRUNE_RECENT_APPROVAL_GRACE_MS) continue;
		if (protectedDeviceIds.has(device.deviceId)) continue;
		removePairedDeviceRecord(state, device.deviceId);
		removed.push({
			deviceId: device.deviceId,
			roles: listApprovedPairedDeviceRoles(device)
		});
	}
	if (removed.length === 0) return [];
	requestDevicePairingMutationAdmission({
		kind: "pairing-prune",
		deviceIds: removed.map((entry) => entry.deviceId)
	});
	persistDevicePairingStoreState(state, void 0, "both", { clearApnsNodeIds: removed.map((entry) => entry.deviceId) });
	return removed;
}
/** Remove one approved paired-device role while preserving unrelated role tokens. */
function removePairedDeviceRoleInWorker(params) {
	const state = loadDevicePairingStateForMutation(params.nowMs);
	const normalizedDeviceId = params.deviceId.trim();
	const role = normalizeDevicePairingRole(params.role);
	const device = state.pairedByDeviceId[normalizedDeviceId];
	if (!device || !role || !listApprovedPairedDeviceRoles(device).includes(role)) return null;
	const tokens = { ...device.tokens };
	delete tokens[role];
	const remainingRoles = listApprovedPairedDeviceRoles(device).filter((entry) => entry !== role);
	if (remainingRoles.length === 0) {
		removePairedDeviceRecord(state, normalizedDeviceId);
		persistDevicePairingStoreState(state, void 0, "both", { clearApnsNodeIds: [normalizedDeviceId] });
		return {
			deviceId: normalizedDeviceId,
			role,
			removedDevice: true
		};
	}
	for (const [requestId, pending] of Object.entries(state.pendingById)) {
		if (pending.deviceId !== normalizedDeviceId) continue;
		const pendingRoles = resolveRequestedDeviceRoles(pending);
		if (!pendingRoles.includes(role)) continue;
		const nextPendingRoles = pendingRoles.filter((entry) => entry !== role);
		if (nextPendingRoles.length === 0) {
			delete state.pendingById[requestId];
			continue;
		}
		const pendingScopes = Array.isArray(pending.scopes) ? mergeDevicePairingScopes(...nextPendingRoles.map((entry) => preserveDeviceRoleScopes(entry, pending.scopes))) : void 0;
		state.pendingById[requestId] = {
			...pending,
			role: nextPendingRoles[0],
			roles: nextPendingRoles,
			scopes: pendingScopes
		};
	}
	const scopeBaseline = device.approvedScopes ?? device.scopes;
	const preservedScopes = Array.isArray(scopeBaseline) ? mergeDevicePairingScopes(...remainingRoles.map((entry) => preserveDeviceRoleScopes(entry, scopeBaseline))) : void 0;
	const next = {
		...device,
		role: remainingRoles[0],
		roles: remainingRoles,
		...preservedScopes !== void 0 ? {
			scopes: preservedScopes,
			approvedScopes: preservedScopes
		} : {},
		tokens: Object.keys(tokens).length > 0 ? tokens : void 0
	};
	if (role === "node") {
		delete next.nodeSurface;
		delete next.pendingNodeSurface;
	}
	state.pairedByDeviceId[normalizedDeviceId] = next;
	persistDevicePairingStoreState(state, void 0, "both");
	return {
		deviceId: normalizedDeviceId,
		role,
		removedDevice: false
	};
}
/** Update non-auth metadata for a paired device presence/status refresh. */
function updatePairedDeviceMetadataInWorker(deviceId, patch) {
	return updatePairedDeviceInTransaction(deviceId, (device) => {
		if (!device) return { value: false };
		const next = {};
		for (const key of [
			"displayName",
			"operatorLabel",
			"platform",
			"clientId",
			"clientMode",
			"remoteIp",
			"lastSeenAtMs",
			"lastSeenReason"
		]) if (key in patch) Object.assign(next, { [key]: patch[key] });
		return {
			value: true,
			patch: next
		};
	});
}
/** Update paired-device presence only while the authenticated node generation still owns it. */
function updatePairedDevicePresenceInWorker(deviceId, patch, expectedPairingGeneration) {
	return updatePairedDeviceInTransaction(deviceId, (device) => {
		const currentPairingGeneration = resolveNodePairingGeneration(device);
		if (!device || expectedPairingGeneration.nodeId !== device.deviceId || currentPairingGeneration?.key !== expectedPairingGeneration.key) return { value: false };
		return {
			value: true,
			patch: {
				lastSeenAtMs: patch.lastSeenAtMs,
				lastSeenReason: patch.lastSeenReason
			}
		};
	});
}
//#endregion
//#region src/infra/device-pairing-join-code.worker.ts
const initializedDatabases = /* @__PURE__ */ new WeakSet();
function joinCodeDatabase(db) {
	if (!initializedDatabases.has(db)) {
		ensureDevicePairingJoinCodeSchema(db);
		deferSqlitePostCommitPublication(db, () => initializedDatabases.add(db));
	}
	return getNodeSqliteKysely(db);
}
function registerDevicePairingJoinCodeInWorker(db, input) {
	const kysely = joinCodeDatabase(db);
	executeSqliteQuerySync(db, kysely.deleteFrom("device_pairing_join_codes").where("expires_at_ms", "<=", input.createdAtMs));
	executeSqliteQuerySync(db, kysely.insertInto("device_pairing_join_codes").values({
		shortcode: input.shortcode,
		payload_json: input.payloadJson,
		created_at_ms: input.createdAtMs,
		expires_at_ms: input.expiresAtMs
	}));
}
function redeemDevicePairingJoinCodeInWorker(db, input) {
	const nowMs = Date.now();
	const kysely = joinCodeDatabase(db);
	executeSqliteQuerySync(db, kysely.deleteFrom("device_pairing_join_codes").where("expires_at_ms", "<=", nowMs));
	const row = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("device_pairing_join_codes").select(["payload_json", "expires_at_ms"]).where("shortcode", "=", input.shortcode));
	executeSqliteQuerySync(db, kysely.deleteFrom("device_pairing_join_codes").where("shortcode", "=", input.shortcode));
	if (!row || typeof row.payload_json !== "string" || typeof row.expires_at_ms !== "number") return;
	return {
		payload_json: row.payload_json,
		expires_at_ms: row.expires_at_ms
	};
}
//#endregion
//#region src/infra/device-pairing-tokens.kernel.ts
const SHARED_GATEWAY_AUTH_ISSUER_KIND = "shared-gateway-auth";
const BROWSER_DEVICE_CLIENT_IDS = /* @__PURE__ */ new Set(["openclaw-control-ui", "webchat-ui"]);
const BROWSER_DEVICE_CLIENT_MODE = "webchat";
function isBrowserRelatedPairedDevice(device) {
	if (device.clientMode?.trim().toLowerCase() === BROWSER_DEVICE_CLIENT_MODE) return true;
	const clientId = device.clientId?.trim().toLowerCase();
	return clientId ? BROWSER_DEVICE_CLIENT_IDS.has(clientId) : false;
}
function deviceTokenIssuerMatches(entry, issuer) {
	if (!issuer) return !entry.issuer;
	return entry.issuer?.kind === issuer.kind && entry.issuer.generation === issuer.generation;
}
function scopesWithinApprovedDeviceBaseline(params) {
	if (!params.approvedScopes) return false;
	return roleScopesAllow({
		role: params.role,
		requestedScopes: params.scopes,
		allowedScopes: params.approvedScopes
	});
}
/** Verify a device role token, scope it to the approval baseline, and mark last use. */
function verifyDeviceTokenInWorker(params) {
	return updatePairedDeviceInTransaction(params.deviceId, (device) => {
		if (!device) return { value: {
			ok: false,
			reason: "device-not-paired"
		} };
		const role = normalizeDevicePairingRole(params.role);
		if (!role) return { value: {
			ok: false,
			reason: "role-missing"
		} };
		const entry = device.tokens?.[role];
		if (!entry) return { value: {
			ok: false,
			reason: "token-missing"
		} };
		if (entry.revokedAtMs) return { value: {
			ok: false,
			reason: "token-revoked"
		} };
		if (!verifyPairingToken(params.token, entry.token)) return { value: {
			ok: false,
			reason: "token-mismatch"
		} };
		if (entry.issuer?.kind === SHARED_GATEWAY_AUTH_ISSUER_KIND && entry.issuer.generation !== params.requiredSharedGatewaySessionGeneration) return { value: {
			ok: false,
			reason: "issuer-generation-stale"
		} };
		if (!entry.issuer && params.requiredSharedGatewaySessionGeneration !== void 0 && isBrowserRelatedPairedDevice(device)) return { value: {
			ok: false,
			reason: "legacy-browser-token"
		} };
		const approvedScopes = resolveApprovedDeviceScopeBaseline(device);
		if (!scopesWithinApprovedDeviceBaseline({
			role,
			scopes: entry.scopes,
			approvedScopes
		})) return { value: {
			ok: false,
			reason: "scope-mismatch"
		} };
		const requestedScopes = normalizeDeviceAuthScopes(params.scopes);
		if (!roleScopesAllow({
			role,
			requestedScopes,
			allowedScopes: entry.scopes
		})) return { value: {
			ok: false,
			reason: "scope-mismatch"
		} };
		return {
			value: entry.issuer ? {
				ok: true,
				issuer: entry.issuer
			} : { ok: true },
			patch: {
				tokens: {
					...device.tokens,
					[role]: {
						...entry,
						lastUsedAtMs: params.nowMs
					}
				},
				lastSeenAtMs: params.nowMs,
				lastSeenReason: "device-token-auth"
			}
		};
	});
}
/** Return a reusable token for a role or issue one within the approved scope baseline. */
function ensureDeviceTokenInWorker(params) {
	return updatePairedDeviceInTransaction(params.deviceId, (paired) => {
		requestDevicePairingMutationAdmission({ kind: "pairing-token-issuance" });
		const requestedScopes = normalizeDeviceAuthScopes(params.scopes);
		const context = resolveDeviceTokenUpdateContext({
			device: paired,
			role: params.role
		});
		if (!context) return { value: null };
		const { device, role, tokens, existing } = context;
		const previousNodeGeneration = resolveNodePairingGeneration(device);
		const approvedScopes = resolveApprovedDeviceScopeBaseline(device);
		if (!scopesWithinApprovedDeviceBaseline({
			role,
			scopes: requestedScopes,
			approvedScopes
		})) return { value: null };
		if (existing && !existing.revokedAtMs) {
			const existingWithinApproved = scopesWithinApprovedDeviceBaseline({
				role,
				scopes: existing.scopes,
				approvedScopes
			});
			const issuerAllowsReuse = deviceTokenIssuerMatches(existing, params.issuer);
			if (existingWithinApproved && issuerAllowsReuse && roleScopesAllow({
				role,
				requestedScopes,
				allowedScopes: existing.scopes
			})) return { value: existing };
		}
		const now = params.nowMs;
		const next = createDeviceAuthToken({
			role,
			scopes: requestedScopes,
			issuer: params.issuer,
			existing,
			now,
			rotatedAtMs: existing ? now : void 0
		});
		tokens[role] = next;
		device.tokens = tokens;
		clearNodePairingGenerationState(device, previousNodeGeneration);
		return {
			value: next,
			patch: {
				tokens,
				nodeSurface: device.nodeSurface
			}
		};
	});
}
function resolveDeviceTokenUpdateContext(params) {
	const device = params.device;
	if (!device) return null;
	const role = normalizeDevicePairingRole(params.role);
	if (!role) return null;
	if (!listApprovedPairedDeviceRoles(device).includes(role)) return null;
	const tokens = { ...device.tokens };
	return {
		device,
		role,
		tokens,
		existing: tokens[role]
	};
}
/** Rotate a role token inside the device's approved scope baseline. */
function rotateDeviceTokenInWorker(params) {
	const state = loadDevicePairingStateForMutation(params.nowMs);
	const context = resolveDeviceTokenUpdateContext({
		device: state.pairedByDeviceId[params.deviceId.trim()] ?? null,
		role: params.role
	});
	if (!context) return {
		ok: false,
		reason: "unknown-device-or-role"
	};
	const { device, role, tokens, existing } = context;
	const previousNodeGeneration = resolveNodePairingGeneration(device);
	const requestedScopes = normalizeDeviceAuthScopes(params.scopes ?? existing?.scopes ?? device.scopes);
	const approvedScopes = resolveApprovedDeviceScopeBaseline(device);
	if (!approvedScopes) return {
		ok: false,
		reason: "missing-approved-scope-baseline"
	};
	if (!scopesWithinApprovedDeviceBaseline({
		role,
		scopes: requestedScopes,
		approvedScopes
	})) return {
		ok: false,
		reason: "scope-outside-approved-baseline"
	};
	if (params.callerScopes) {
		const missingScope = resolveMissingRequestedScope({
			role,
			requestedScopes,
			allowedScopes: params.callerScopes
		});
		if (missingScope) return {
			ok: false,
			reason: "caller-missing-scope",
			scope: missingScope
		};
	}
	const now = params.nowMs;
	const next = createDeviceAuthToken({
		role,
		scopes: requestedScopes,
		existing,
		preserveExistingIssuer: true,
		now,
		rotatedAtMs: now
	});
	tokens[role] = next;
	device.tokens = tokens;
	clearNodePairingGenerationState(device, previousNodeGeneration);
	state.pairedByDeviceId[device.deviceId] = device;
	const retiredNodeToken = role === "node" && params.scopes !== void 0 && requestedScopes.length === 0 && existing && !scopesWithinApprovedDeviceBaseline({
		role,
		scopes: existing.scopes,
		approvedScopes
	}) ? {
		deviceId: device.deviceId,
		expectedToken: existing.token
	} : void 0;
	persistDevicePairingStoreState(state, void 0, "paired", { retiredNodeToken });
	return {
		ok: true,
		entry: next
	};
}
/** Revoke one active role token after optional caller-scope authorization. */
function revokeDeviceTokenInWorker(params) {
	const state = loadDevicePairingStateForMutation(params.nowMs);
	const context = resolveDeviceTokenUpdateContext({
		device: state.pairedByDeviceId[params.deviceId.trim()] ?? null,
		role: params.role
	});
	if (!context || !context.existing) return {
		ok: false,
		reason: "unknown-device-or-role"
	};
	const { device, role, tokens, existing } = context;
	const previousNodeGeneration = resolveNodePairingGeneration(device);
	const targetScopes = normalizeDeviceAuthScopes(Array.isArray(existing.scopes) ? existing.scopes : device.scopes);
	if (params.callerScopes) {
		const missingScope = resolveMissingRequestedScope({
			role,
			requestedScopes: targetScopes,
			allowedScopes: params.callerScopes
		});
		if (missingScope) return {
			ok: false,
			reason: "caller-missing-scope",
			scope: missingScope
		};
	}
	const entry = {
		...existing,
		revokedAtMs: params.nowMs
	};
	tokens[role] = entry;
	device.tokens = tokens;
	clearNodePairingGenerationState(device, previousNodeGeneration);
	state.pairedByDeviceId[device.deviceId] = device;
	persistDevicePairingStoreState(state, void 0, "paired");
	return {
		ok: true,
		entry
	};
}
//#endregion
//#region src/infra/device-pairing-core.worker.ts
const devicePairingOperations = {
	"devicePairing.registerJoinCode": devicePairingMutation((input, { database }) => registerDevicePairingJoinCodeInWorker(database.db, input), { publishPairing: false }),
	"devicePairing.redeemJoinCode": devicePairingMutation((input, { database }) => redeemDevicePairingJoinCodeInWorker(database.db, input), { publishPairing: false }),
	"devicePairing.request": devicePairingMutation((input) => requestDevicePairingInWorker(input.request, input.nowMs)),
	"devicePairing.reject": devicePairingMutation((input, { database }) => rejectDevicePairingInWorker(database, input.requestId, input.nowMs)),
	"devicePairing.remove": devicePairingMutation((input) => removePairedDeviceInWorker(input.deviceId, input.nowMs)),
	"devicePairing.pruneSilent": devicePairingMutation(pruneSupersededSilentPairedDevicesInWorker),
	"devicePairing.removeRole": devicePairingMutation(removePairedDeviceRoleInWorker),
	"devicePairing.updateMetadata": devicePairingMutation((input) => updatePairedDeviceMetadataInWorker(input.deviceId, input.patch)),
	"devicePairing.updatePresence": devicePairingMutation((input) => updatePairedDevicePresenceInWorker(input.deviceId, input.patch, input.expectedPairingGeneration)),
	"devicePairing.approve": devicePairingMutation((input) => approveDevicePairingInWorker(input.requestId, input.options, input.nowMs)),
	"devicePairing.approveBootstrap": devicePairingMutation((input, { recordTokenReplacement }) => {
		const result = approveBootstrapDevicePairingInWorker(input.requestId, input.bootstrapProfile, { accessMetadata: input.accessMetadata }, input.nowMs);
		if (result.result?.status === "approved" && result.replacedRoles.length > 0) recordTokenReplacement({
			deviceId: result.result.device.deviceId,
			roles: result.replacedRoles
		});
		return result;
	}),
	"devicePairing.verifyToken": devicePairingMutation(verifyDeviceTokenInWorker),
	"devicePairing.ensureToken": devicePairingMutation(ensureDeviceTokenInWorker),
	"devicePairing.rotateToken": devicePairingMutation(rotateDeviceTokenInWorker),
	"devicePairing.revokeToken": devicePairingMutation(revokeDeviceTokenInWorker)
};
//#endregion
export { devicePairingOperations };
