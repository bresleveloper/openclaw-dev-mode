import { f as normalizeUniqueSingleOrTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import { t as createAsyncLock } from "./async-lock-CaiUOILd.js";
import { a as readJsonIfExists, m as writeJson } from "./json-files-2umMHm0W.js";
import { n as normalizeDeviceAuthScopes } from "./device-auth-C-STNejO.js";
import { n as resolveScopeOutsideRequestedRoles, r as roleScopesAllow, t as resolveMissingRequestedScope } from "./operator-scope-compat-BVrjvlGm.js";
import { a as reconcilePendingPairingRequests, i as pruneExpiredPending, n as verifyPairingToken, o as resolvePairingPaths, r as coercePairingStateRecord, t as generatePairingToken } from "./pairing-token-CcP5IwNE.js";
import { c as revokeDeviceBootstrapTokensForDevice, m as resolveBootstrapProfileScopesForRoles, p as resolveBootstrapProfileScopesForRole } from "./device-bootstrap-SmUBpT8H.js";
import { randomUUID } from "node:crypto";
//#region src/infra/device-pairing.ts
const PENDING_TTL_MS = 300 * 1e3;
const OPERATOR_ROLE = "operator";
const OPERATOR_SCOPE_PREFIX = "operator.";
const SHARED_GATEWAY_AUTH_ISSUER_KIND = "shared-gateway-auth";
const BROWSER_DEVICE_CLIENT_IDS = new Set(["openclaw-control-ui", "webchat-ui"]);
const BROWSER_DEVICE_CLIENT_MODE = "webchat";
const withLock = createAsyncLock();
/** Format a device-pairing authorization failure for CLI/API callers. */
function formatDevicePairingForbiddenMessage(result) {
	switch (result.reason) {
		case "caller-scopes-required": return `missing scope: ${result.scope ?? "callerScopes-required"}`;
		case "caller-missing-scope": return `missing scope: ${result.scope ?? "unknown"}`;
		case "scope-outside-requested-roles": return `invalid scope for requested roles: ${result.scope ?? "unknown"}`;
		case "bootstrap-role-not-allowed": return `bootstrap profile does not allow role: ${result.role ?? "unknown"}`;
		case "bootstrap-scope-not-allowed": return `bootstrap profile does not allow scope: ${result.scope ?? "unknown"}`;
	}
	throw new Error("Unsupported device pairing forbidden reason");
}
async function loadState(baseDir) {
	const { pendingPath, pairedPath } = resolvePairingPaths(baseDir, "devices");
	const [pending, paired] = await Promise.all([readJsonIfExists(pendingPath), readJsonIfExists(pairedPath)]);
	const state = {
		pendingById: coercePairingStateRecord(pending),
		pairedByDeviceId: coercePairingStateRecord(paired)
	};
	pruneExpiredPending(state.pendingById, Date.now(), PENDING_TTL_MS);
	return state;
}
async function persistState(state, baseDir, target) {
	const { pendingPath, pairedPath } = resolvePairingPaths(baseDir, "devices");
	if (target === "pending") {
		await writeJson(pendingPath, state.pendingById);
		return;
	}
	if (target === "paired") {
		await writeJson(pairedPath, state.pairedByDeviceId);
		return;
	}
	await Promise.all([writeJson(pendingPath, state.pendingById), writeJson(pairedPath, state.pairedByDeviceId)]);
}
function normalizeDeviceId(deviceId) {
	return deviceId.trim();
}
function normalizeRole(role) {
	const trimmed = role?.trim();
	return trimmed ? trimmed : null;
}
function mergeRoles(...items) {
	const roles = /* @__PURE__ */ new Set();
	for (const item of items) for (const role of normalizeUniqueSingleOrTrimmedStringList(item)) roles.add(role);
	if (roles.size === 0) return;
	return [...roles];
}
function listActiveTokenRoles(tokens) {
	if (!tokens) return;
	return mergeRoles(Object.values(tokens).filter((entry) => !entry.revokedAtMs).map((entry) => entry.role));
}
/** List the durable roles an owner approved for a paired device record. */
function listApprovedPairedDeviceRoles(device) {
	return mergeRoles(device.roles, device.role) ?? [];
}
/** List active-token roles, bounded by the durable approved pairing roles. */
function listEffectivePairedDeviceRoles(device) {
	const activeTokenRoles = listActiveTokenRoles(device.tokens);
	if (activeTokenRoles && activeTokenRoles.length > 0) {
		const approvedRoles = new Set(listApprovedPairedDeviceRoles(device));
		return activeTokenRoles.filter((role) => approvedRoles.has(role));
	}
	return [];
}
/** Return whether a paired device currently has an active token for one role. */
function hasEffectivePairedDeviceRole(device, role) {
	const normalized = normalizeRole(role);
	if (!normalized) return false;
	return listEffectivePairedDeviceRoles(device).includes(normalized);
}
function mergeScopes(...items) {
	const scopes = /* @__PURE__ */ new Set();
	let sawExplicitScopeList = false;
	for (const item of items) {
		if (!Array.isArray(item)) continue;
		sawExplicitScopeList = true;
		for (const scope of normalizeUniqueSingleOrTrimmedStringList(item)) scopes.add(scope);
	}
	if (scopes.size === 0) return sawExplicitScopeList ? [] : void 0;
	return [...scopes];
}
function sameStringSet(left, right) {
	if (left.length !== right.length) return false;
	const rightSet = new Set(right);
	for (const value of left) if (!rightSet.has(value)) return false;
	return true;
}
function resolveRequestedRoles(input) {
	return mergeRoles(input.roles, input.role) ?? [];
}
function resolveRequestedScopes(input) {
	return normalizeDeviceAuthScopes(input.scopes);
}
function samePendingApprovalSnapshot(existing, incoming) {
	if (existing.publicKey !== incoming.publicKey) return false;
	if (normalizeRole(existing.role) !== normalizeRole(incoming.role)) return false;
	if (!sameStringSet(resolveRequestedRoles(existing), resolveRequestedRoles(incoming)) || !sameStringSet(resolveRequestedScopes(existing), resolveRequestedScopes(incoming))) return false;
	return true;
}
function refreshPendingDevicePairingRequest(existing, incoming, isRepair) {
	return {
		...existing,
		publicKey: incoming.publicKey,
		displayName: incoming.displayName ?? existing.displayName,
		platform: incoming.platform ?? existing.platform,
		deviceFamily: incoming.deviceFamily ?? existing.deviceFamily,
		clientId: incoming.clientId ?? existing.clientId,
		clientMode: incoming.clientMode ?? existing.clientMode,
		remoteIp: incoming.remoteIp ?? existing.remoteIp,
		silent: Boolean(existing.silent && incoming.silent),
		isRepair: existing.isRepair || isRepair,
		ts: existing.ts
	};
}
function resolveSupersededPendingSilent(params) {
	return Boolean(params.incomingSilent && params.existing.every((pending) => pending.silent === true));
}
function buildPendingDevicePairingRequest(params) {
	const role = normalizeRole(params.req.role) ?? void 0;
	return {
		requestId: params.requestId ?? randomUUID(),
		deviceId: params.deviceId,
		publicKey: params.req.publicKey,
		displayName: params.req.displayName,
		platform: params.req.platform,
		deviceFamily: params.req.deviceFamily,
		clientId: params.req.clientId,
		clientMode: params.req.clientMode,
		role,
		roles: mergeRoles(params.req.roles, role),
		scopes: mergeScopes(params.req.scopes),
		remoteIp: params.req.remoteIp,
		silent: params.req.silent,
		isRepair: params.isRepair,
		ts: Date.now()
	};
}
function newToken() {
	return generatePairingToken();
}
function getPairedDeviceFromState(state, deviceId) {
	return state.pairedByDeviceId[normalizeDeviceId(deviceId)] ?? null;
}
function cloneDeviceTokens(device) {
	return device.tokens ? { ...device.tokens } : {};
}
function isBrowserRelatedPairedDevice(device) {
	if (device.clientMode?.trim().toLowerCase() === BROWSER_DEVICE_CLIENT_MODE) return true;
	const clientId = device.clientId?.trim().toLowerCase();
	return clientId ? BROWSER_DEVICE_CLIENT_IDS.has(clientId) : false;
}
function deviceTokenIssuerMatches(entry, issuer) {
	if (!issuer) return !entry.issuer;
	return entry.issuer?.kind === issuer.kind && entry.issuer.generation === issuer.generation;
}
function buildDeviceAuthToken(params) {
	return {
		token: newToken(),
		role: params.role,
		scopes: params.scopes,
		issuer: params.issuer ?? (params.preserveExistingIssuer ? params.existing?.issuer : void 0),
		createdAtMs: params.existing?.createdAtMs ?? params.now,
		rotatedAtMs: params.rotatedAtMs,
		revokedAtMs: void 0,
		lastUsedAtMs: params.existing?.lastUsedAtMs
	};
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
		role: params.pending.role,
		roles: params.roles,
		scopes: params.approvedScopes,
		approvedScopes: params.approvedScopes,
		remoteIp: params.accessMetadata?.remoteIp ?? params.pending.remoteIp,
		tokens: params.tokens,
		createdAtMs: params.existing?.createdAtMs ?? params.now,
		approvedAtMs: params.now,
		lastSeenAtMs: params.accessMetadata?.lastSeenAtMs ?? params.existing?.lastSeenAtMs,
		lastSeenReason: params.accessMetadata?.lastSeenReason ?? params.existing?.lastSeenReason
	};
}
function resolveRoleScopedDeviceTokenScopes(role, scopes) {
	const normalized = normalizeDeviceAuthScopes(scopes);
	if (role === "operator") return normalized.filter((scope) => scope.startsWith(OPERATOR_SCOPE_PREFIX));
	return normalized.filter((scope) => !scope.startsWith(OPERATOR_SCOPE_PREFIX));
}
function preserveRoleScopedApprovalScopes(role, scopes) {
	return normalizeUniqueSingleOrTrimmedStringList(scopes).filter((scope) => role === OPERATOR_ROLE ? scope.startsWith(OPERATOR_SCOPE_PREFIX) : !scope.startsWith(OPERATOR_SCOPE_PREFIX));
}
function resolveApprovedTokenScopes(params) {
	const pendingScopes = resolveRoleScopedDeviceTokenScopes(params.role, params.pending.scopes);
	if (pendingScopes.length > 0) {
		const approvedBaseline = resolveRoleScopedDeviceTokenScopes(params.role, params.existing?.approvedScopes ?? params.existing?.scopes);
		const requestedScopeDelta = params.existingToken && approvedBaseline.length > 0 ? pendingScopes.filter((scope) => !approvedBaseline.includes(scope)) : pendingScopes;
		if (requestedScopeDelta.length === 0 && params.existingToken) return resolveRoleScopedDeviceTokenScopes(params.role, params.existingToken.scopes);
		return resolveRoleScopedDeviceTokenScopes(params.role, mergeScopes(params.existingToken?.scopes, requestedScopeDelta));
	}
	return resolveRoleScopedDeviceTokenScopes(params.role, params.existingToken?.scopes ?? params.approvedScopes ?? params.existing?.approvedScopes ?? params.existing?.scopes);
}
function resolveApprovedDeviceScopeBaseline(device) {
	const baseline = device.approvedScopes ?? device.scopes;
	if (!Array.isArray(baseline)) return null;
	return normalizeDeviceAuthScopes(baseline);
}
function scopesWithinApprovedDeviceBaseline(params) {
	if (!params.approvedScopes) return false;
	return roleScopesAllow({
		role: params.role,
		requestedScopes: params.scopes,
		allowedScopes: params.approvedScopes
	});
}
async function listDevicePairing(baseDir) {
	const state = await loadState(baseDir);
	return {
		pending: Object.values(state.pendingById).toSorted((a, b) => b.ts - a.ts),
		paired: Object.values(state.pairedByDeviceId).toSorted((a, b) => b.approvedAtMs - a.approvedAtMs)
	};
}
/** Return one paired device by normalized device id. */
async function getPairedDevice(deviceId, baseDir) {
	return (await loadState(baseDir)).pairedByDeviceId[normalizeDeviceId(deviceId)] ?? null;
}
/** Return one pending pairing request by request id. */
async function getPendingDevicePairing(requestId, baseDir) {
	return (await loadState(baseDir)).pendingById[requestId] ?? null;
}
/** Create or refresh a pending device pairing request for owner approval. */
async function requestDevicePairing(req, baseDir) {
	return await withLock(async () => {
		const state = await loadState(baseDir);
		const deviceId = normalizeDeviceId(req.deviceId);
		if (!deviceId) throw new Error("deviceId required");
		const isRepair = Boolean(state.pairedByDeviceId[deviceId]);
		const pendingForDevice = Object.values(state.pendingById).filter((pending) => pending.deviceId === deviceId).toSorted((left, right) => right.ts - left.ts);
		return await reconcilePendingPairingRequests({
			pendingById: state.pendingById,
			existing: pendingForDevice,
			incoming: req,
			canRefreshSingle: (existing, incoming) => samePendingApprovalSnapshot(existing, incoming),
			refreshSingle: (existing, incoming) => refreshPendingDevicePairingRequest(existing, incoming, isRepair),
			buildReplacement: ({ existing, incoming }) => {
				const latestPending = existing[0];
				const mergedRoles = mergeRoles(...existing.flatMap((pending) => [pending.roles, pending.role]), incoming.roles, incoming.role);
				const mergedScopes = mergeScopes(...existing.map((pending) => pending.scopes), incoming.scopes);
				return buildPendingDevicePairingRequest({
					deviceId,
					isRepair,
					req: {
						...incoming,
						role: normalizeRole(incoming.role) ?? latestPending?.role,
						roles: mergedRoles,
						scopes: mergedScopes,
						silent: resolveSupersededPendingSilent({
							existing,
							incomingSilent: incoming.silent
						})
					}
				});
			},
			persist: async () => await persistState(state, baseDir, "pending")
		});
	});
}
async function approveDevicePairing(requestId, optionsOrBaseDir, maybeBaseDir) {
	const options = typeof optionsOrBaseDir === "string" || optionsOrBaseDir === void 0 ? void 0 : optionsOrBaseDir;
	const baseDir = typeof optionsOrBaseDir === "string" ? optionsOrBaseDir : maybeBaseDir;
	return await withLock(async () => {
		const state = await loadState(baseDir);
		const pending = state.pendingById[requestId];
		if (!pending) return null;
		const requestedRoles = mergeRoles(pending.roles, pending.role) ?? [];
		const roleMismatchScope = resolveScopeOutsideRequestedRoles({
			requestedRoles,
			requestedScopes: normalizeDeviceAuthScopes(pending.scopes)
		});
		if (roleMismatchScope) return {
			status: "forbidden",
			reason: "scope-outside-requested-roles",
			scope: roleMismatchScope
		};
		const now = Date.now();
		const existing = state.pairedByDeviceId[pending.deviceId];
		const roles = mergeRoles(existing?.roles, existing?.role, pending.roles, pending.role);
		const approvedScopes = mergeScopes(existing?.approvedScopes ?? existing?.scopes, pending.scopes);
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
				const callerRequiredScopes = mergeScopes(resolveRoleScopedDeviceTokenScopes(roleForToken, pending.scopes), nextScopes) ?? nextScopes;
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
			const tokenNow = Date.now();
			tokens[roleForToken] = {
				token: newToken(),
				role: roleForToken,
				scopes: nextScopes,
				createdAtMs: existingToken?.createdAtMs ?? tokenNow,
				rotatedAtMs: existingToken ? tokenNow : void 0,
				revokedAtMs: void 0,
				lastUsedAtMs: existingToken?.lastUsedAtMs
			};
		}
		const device = buildApprovedPairedDevice({
			pending,
			existing,
			roles,
			approvedScopes,
			tokens,
			now,
			accessMetadata: options?.accessMetadata
		});
		delete state.pendingById[requestId];
		state.pairedByDeviceId[device.deviceId] = device;
		await persistState(state, baseDir, "both");
		return {
			status: "approved",
			requestId,
			device
		};
	});
}
async function approveBootstrapDevicePairing(requestId, bootstrapProfile, optionsOrBaseDir, maybeBaseDir) {
	const options = typeof optionsOrBaseDir === "string" || optionsOrBaseDir === void 0 ? void 0 : optionsOrBaseDir;
	const baseDir = typeof optionsOrBaseDir === "string" ? optionsOrBaseDir : maybeBaseDir;
	const approvedRoles = mergeRoles(bootstrapProfile.roles) ?? [];
	const approvedScopes = resolveBootstrapProfileScopesForRoles(approvedRoles, bootstrapProfile.scopes);
	return await withLock(async () => {
		const state = await loadState(baseDir);
		const pending = state.pendingById[requestId];
		if (!pending) return null;
		const requestedRoles = resolveRequestedRoles(pending);
		const missingRole = requestedRoles.find((role) => !approvedRoles.includes(role));
		if (missingRole) return {
			status: "forbidden",
			reason: "bootstrap-role-not-allowed",
			role: missingRole
		};
		const missingScope = resolveMissingRequestedScope({
			role: OPERATOR_ROLE,
			requestedScopes: normalizeDeviceAuthScopes(pending.scopes).filter((scope) => scope.startsWith(OPERATOR_SCOPE_PREFIX)),
			allowedScopes: approvedScopes
		});
		if (missingScope) return {
			status: "forbidden",
			reason: "bootstrap-scope-not-allowed",
			scope: missingScope
		};
		const now = Date.now();
		const existing = state.pairedByDeviceId[pending.deviceId];
		const grantedRoles = requestedRoles;
		const grantedScopes = resolveBootstrapProfileScopesForRoles(grantedRoles, pending.scopes ?? []);
		const grantedRoleSet = new Set(grantedRoles);
		const preservedExistingScopes = (mergeRoles(existing?.roles, existing?.role) ?? []).flatMap((existingRole) => grantedRoleSet.has(existingRole) ? [] : preserveRoleScopedApprovalScopes(existingRole, existing?.approvedScopes ?? existing?.scopes));
		const roles = mergeRoles(existing?.roles, existing?.role, pending.roles, pending.role);
		const nextApprovedScopes = mergeScopes(preservedExistingScopes, grantedScopes);
		const tokens = existing?.tokens ? { ...existing.tokens } : {};
		for (const roleForToken of grantedRoles) {
			const existingToken = tokens[roleForToken];
			tokens[roleForToken] = buildDeviceAuthToken({
				role: roleForToken,
				scopes: roleForToken === OPERATOR_ROLE ? resolveBootstrapProfileScopesForRole(roleForToken, grantedScopes) : [],
				existing: existingToken,
				now,
				...existingToken ? { rotatedAtMs: now } : {}
			});
		}
		const device = buildApprovedPairedDevice({
			pending,
			existing,
			roles,
			approvedScopes: nextApprovedScopes,
			tokens,
			now,
			accessMetadata: options?.accessMetadata
		});
		delete state.pendingById[requestId];
		state.pairedByDeviceId[device.deviceId] = device;
		await persistState(state, baseDir, "both");
		return {
			status: "approved",
			requestId,
			device
		};
	});
}
/** Reject a pending request and revoke matching bootstrap tokens for that device. */
async function rejectDevicePairing(requestId, baseDir) {
	return await withLock(async () => {
		const state = await loadState(baseDir);
		const pending = state.pendingById[requestId];
		if (!pending) return null;
		delete state.pendingById[requestId];
		await persistState(state, baseDir, "pending");
		await revokeDeviceBootstrapTokensForDevice({
			deviceId: pending.deviceId,
			publicKey: pending.publicKey,
			baseDir
		});
		return {
			requestId,
			deviceId: pending.deviceId
		};
	});
}
/** Remove a paired device and any pending repair requests for the same device id. */
async function removePairedDevice(deviceId, baseDir) {
	return await withLock(async () => {
		const state = await loadState(baseDir);
		const normalized = normalizeDeviceId(deviceId);
		if (!normalized || !state.pairedByDeviceId[normalized]) return null;
		delete state.pairedByDeviceId[normalized];
		for (const [requestId, pending] of Object.entries(state.pendingById)) if (pending.deviceId === normalized) delete state.pendingById[requestId];
		await persistState(state, baseDir, "both");
		return { deviceId: normalized };
	});
}
/** Remove one approved paired-device role while preserving unrelated role tokens. */
async function removePairedDeviceRole(params) {
	return await withLock(async () => {
		const state = await loadState(params.baseDir);
		const normalizedDeviceId = normalizeDeviceId(params.deviceId);
		const role = normalizeRole(params.role);
		const device = state.pairedByDeviceId[normalizedDeviceId];
		if (!device || !role || !listApprovedPairedDeviceRoles(device).includes(role)) return null;
		const tokens = cloneDeviceTokens(device);
		delete tokens[role];
		const remainingRoles = listApprovedPairedDeviceRoles(device).filter((entry) => entry !== role);
		if (remainingRoles.length === 0) {
			for (const [requestId, pending] of Object.entries(state.pendingById)) if (pending.deviceId === normalizedDeviceId) delete state.pendingById[requestId];
			delete state.pairedByDeviceId[normalizedDeviceId];
			await persistState(state, params.baseDir, "both");
			return {
				deviceId: normalizedDeviceId,
				role,
				removedDevice: true
			};
		}
		for (const [requestId, pending] of Object.entries(state.pendingById)) {
			if (pending.deviceId !== normalizedDeviceId) continue;
			const pendingRoles = resolveRequestedRoles(pending);
			if (!pendingRoles.includes(role)) continue;
			const nextPendingRoles = pendingRoles.filter((entry) => entry !== role);
			if (nextPendingRoles.length === 0) {
				delete state.pendingById[requestId];
				continue;
			}
			const pendingScopes = Array.isArray(pending.scopes) ? mergeScopes(...nextPendingRoles.map((entry) => preserveRoleScopedApprovalScopes(entry, pending.scopes))) : void 0;
			state.pendingById[requestId] = {
				...pending,
				role: nextPendingRoles[0],
				roles: nextPendingRoles,
				scopes: pendingScopes
			};
		}
		const scopeBaseline = device.approvedScopes ?? device.scopes;
		const preservedScopes = Array.isArray(scopeBaseline) ? mergeScopes(...remainingRoles.map((entry) => preserveRoleScopedApprovalScopes(entry, scopeBaseline))) : void 0;
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
		state.pairedByDeviceId[normalizedDeviceId] = next;
		await persistState(state, params.baseDir, "both");
		return {
			deviceId: normalizedDeviceId,
			role,
			removedDevice: false
		};
	});
}
/** Update non-auth metadata for a paired device presence/status refresh. */
async function updatePairedDeviceMetadata(deviceId, patch, baseDir) {
	return await withLock(async () => {
		const state = await loadState(baseDir);
		const normalizedDeviceId = normalizeDeviceId(deviceId);
		const existing = state.pairedByDeviceId[normalizedDeviceId];
		if (!existing) return false;
		const next = { ...existing };
		if ("displayName" in patch) next.displayName = patch.displayName;
		if ("platform" in patch) next.platform = patch.platform;
		if ("clientId" in patch) next.clientId = patch.clientId;
		if ("clientMode" in patch) next.clientMode = patch.clientMode;
		if ("remoteIp" in patch) next.remoteIp = patch.remoteIp;
		if ("lastSeenAtMs" in patch) next.lastSeenAtMs = patch.lastSeenAtMs;
		if ("lastSeenReason" in patch) next.lastSeenReason = patch.lastSeenReason;
		state.pairedByDeviceId[normalizedDeviceId] = next;
		await persistState(state, baseDir, "paired");
		return true;
	});
}
/** Summarize token metadata without exposing bearer token strings. */
function summarizeDeviceTokens(tokens) {
	if (!tokens) return;
	const summaries = Object.values(tokens).map((token) => ({
		role: token.role,
		scopes: token.scopes,
		createdAtMs: token.createdAtMs,
		rotatedAtMs: token.rotatedAtMs,
		revokedAtMs: token.revokedAtMs,
		lastUsedAtMs: token.lastUsedAtMs
	})).toSorted((a, b) => a.role.localeCompare(b.role));
	return summaries.length > 0 ? summaries : void 0;
}
/** Verify a device role token, scope it to the approval baseline, and mark last use. */
async function verifyDeviceToken(params) {
	return await withLock(async () => {
		const state = await loadState(params.baseDir);
		const device = getPairedDeviceFromState(state, params.deviceId);
		if (!device) return {
			ok: false,
			reason: "device-not-paired"
		};
		const role = normalizeRole(params.role);
		if (!role) return {
			ok: false,
			reason: "role-missing"
		};
		const entry = device.tokens?.[role];
		if (!entry) return {
			ok: false,
			reason: "token-missing"
		};
		if (entry.revokedAtMs) return {
			ok: false,
			reason: "token-revoked"
		};
		if (!verifyPairingToken(params.token, entry.token)) return {
			ok: false,
			reason: "token-mismatch"
		};
		if (entry.issuer?.kind === SHARED_GATEWAY_AUTH_ISSUER_KIND && entry.issuer.generation !== params.requiredSharedGatewaySessionGeneration) return {
			ok: false,
			reason: "issuer-generation-stale"
		};
		if (!entry.issuer && params.requiredSharedGatewaySessionGeneration !== void 0 && isBrowserRelatedPairedDevice(device)) return {
			ok: false,
			reason: "legacy-browser-token"
		};
		const approvedScopes = resolveApprovedDeviceScopeBaseline(device);
		if (!scopesWithinApprovedDeviceBaseline({
			role,
			scopes: entry.scopes,
			approvedScopes
		})) return {
			ok: false,
			reason: "scope-mismatch"
		};
		if (!roleScopesAllow({
			role,
			requestedScopes: normalizeDeviceAuthScopes(params.scopes),
			allowedScopes: entry.scopes
		})) return {
			ok: false,
			reason: "scope-mismatch"
		};
		const now = Date.now();
		entry.lastUsedAtMs = now;
		device.tokens ??= {};
		device.tokens[role] = entry;
		device.lastSeenAtMs = now;
		device.lastSeenReason = "device-token-auth";
		state.pairedByDeviceId[device.deviceId] = device;
		await persistState(state, params.baseDir, "paired");
		return entry.issuer ? {
			ok: true,
			issuer: entry.issuer
		} : { ok: true };
	});
}
/** Return a reusable token for a role or issue one within the approved scope baseline. */
async function ensureDeviceToken(params) {
	return await withLock(async () => {
		const state = await loadState(params.baseDir);
		const requestedScopes = normalizeDeviceAuthScopes(params.scopes);
		const context = resolveDeviceTokenUpdateContext({
			state,
			deviceId: params.deviceId,
			role: params.role
		});
		if (!context) return null;
		const { device, role, tokens, existing } = context;
		const approvedScopes = resolveApprovedDeviceScopeBaseline(device);
		if (!scopesWithinApprovedDeviceBaseline({
			role,
			scopes: requestedScopes,
			approvedScopes
		})) return null;
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
			})) return existing;
		}
		const now = Date.now();
		const next = buildDeviceAuthToken({
			role,
			scopes: requestedScopes,
			issuer: params.issuer,
			existing,
			now,
			rotatedAtMs: existing ? now : void 0
		});
		tokens[role] = next;
		device.tokens = tokens;
		state.pairedByDeviceId[device.deviceId] = device;
		await persistState(state, params.baseDir, "paired");
		return next;
	});
}
function resolveDeviceTokenUpdateContext(params) {
	const device = getPairedDeviceFromState(params.state, params.deviceId);
	if (!device) return null;
	const role = normalizeRole(params.role);
	if (!role) return null;
	if (!listApprovedPairedDeviceRoles(device).includes(role)) return null;
	const tokens = cloneDeviceTokens(device);
	return {
		device,
		role,
		tokens,
		existing: tokens[role]
	};
}
/** Rotate a role token inside the device's approved scope baseline. */
async function rotateDeviceToken(params) {
	return await withLock(async () => {
		const state = await loadState(params.baseDir);
		const context = resolveDeviceTokenUpdateContext({
			state,
			deviceId: params.deviceId,
			role: params.role
		});
		if (!context) return {
			ok: false,
			reason: "unknown-device-or-role"
		};
		const { device, role, tokens, existing } = context;
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
		const now = Date.now();
		const next = buildDeviceAuthToken({
			role,
			scopes: requestedScopes,
			existing,
			preserveExistingIssuer: true,
			now,
			rotatedAtMs: now
		});
		tokens[role] = next;
		device.tokens = tokens;
		state.pairedByDeviceId[device.deviceId] = device;
		await persistState(state, params.baseDir, "paired");
		return {
			ok: true,
			entry: next
		};
	});
}
/** Revoke one active role token after optional caller-scope authorization. */
async function revokeDeviceToken(params) {
	return await withLock(async () => {
		const state = await loadState(params.baseDir);
		const context = resolveDeviceTokenUpdateContext({
			state,
			deviceId: params.deviceId,
			role: params.role
		});
		if (!context || !context.existing) return {
			ok: false,
			reason: "unknown-device-or-role"
		};
		const { device, role, tokens, existing } = context;
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
			revokedAtMs: Date.now()
		};
		tokens[role] = entry;
		device.tokens = tokens;
		state.pairedByDeviceId[device.deviceId] = device;
		await persistState(state, params.baseDir, "paired");
		return {
			ok: true,
			entry
		};
	});
}
//#endregion
export { summarizeDeviceTokens as _, getPairedDevice as a, listApprovedPairedDeviceRoles as c, rejectDevicePairing as d, removePairedDevice as f, rotateDeviceToken as g, revokeDeviceToken as h, formatDevicePairingForbiddenMessage as i, listDevicePairing as l, requestDevicePairing as m, approveDevicePairing as n, getPendingDevicePairing as o, removePairedDeviceRole as p, ensureDeviceToken as r, hasEffectivePairedDeviceRole as s, approveBootstrapDevicePairing as t, listEffectivePairedDeviceRoles as u, updatePairedDeviceMetadata as v, verifyDeviceToken as y };
