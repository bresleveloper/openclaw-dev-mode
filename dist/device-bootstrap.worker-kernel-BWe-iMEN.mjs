import { o as asDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { c as normalizeEd25519PublicKeyBase64Url } from "./ed25519-signature-D_xiObSW.mjs";
import "./device-identity-KmxGQO-v.mjs";
import { c as deviceBootstrapProfilesEqual, f as normalizeDeviceBootstrapHandoffProfile, m as resolveBootstrapProfileScopesForRole, p as normalizeDeviceBootstrapProfile, r as CONTROL_UI_OWNER_BOOTSTRAP_PROFILE } from "./device-bootstrap-profile-DPDpvU9k.mjs";
import { A as hasCloudWorkerSetupDeviceBinding, E as withDevicePairingStoreDatabase, N as DEVICE_BOOTSTRAP_TOKEN_TTL_MS, P as resolveDeviceBootstrapTokenExpiresAtMs, S as pruneExpiredDevicePairSetupCompletionRecords, _ as loadDeviceBootstrapTokenRecords, b as persistDeviceBootstrapTokenRecords, g as consumeDeviceBootstrapTokenWithSetupCompletionInTransaction, h as confirmDevicePairSetupCompletionDeliveryInTransaction, j as requestDevicePairingMutationAdmission, v as loadDevicePairSetupCompletionRecord } from "./device-pairing-identity-f0QUXRJo.mjs";
import { n as verifyPairingToken, t as generatePairingToken } from "./pairing-token-CzXJ-1-p.mjs";
import { t as devicePairingMutation } from "./device-pairing-dispatch.worker-NIcSJbfk.mjs";
//#region src/infra/device-bootstrap.worker-kernel.ts
const DEVICE_PAIR_SETUP_COMPLETION_RETENTION_MS = 2 * DEVICE_BOOTSTRAP_TOKEN_TTL_MS;
function resolvePersistedPendingProfile(record) {
	return record.pendingProfile ? normalizeDeviceBootstrapProfile(record.pendingProfile) : null;
}
function resolveRequestedBootstrapProfile(params) {
	return normalizeDeviceBootstrapProfile({
		roles: [params.role],
		scopes: resolveBootstrapProfileScopesForRole(params.role, params.scopes, params.purpose),
		purpose: params.purpose
	});
}
function bootstrapProfileAllowsRequest(params) {
	return params.allowedProfile.roles.includes(params.requestedRole) && roleScopesAllow({
		role: params.requestedRole,
		requestedScopes: params.requestedScopes,
		allowedScopes: params.allowedProfile.scopes
	});
}
function bootstrapProfileSatisfiesProfile(params) {
	for (const requiredRole of params.requiredProfile.roles) {
		if (!params.actualProfile.roles.includes(requiredRole)) return false;
		const requiredScopes = resolveBootstrapProfileScopesForRole(requiredRole, params.requiredProfile.scopes, params.requiredProfile.purpose);
		if (requiredScopes.length > 0 && !bootstrapProfileAllowsRequest({
			allowedProfile: params.actualProfile,
			requestedRole: requiredRole,
			requestedScopes: requiredScopes
		})) return false;
	}
	return true;
}
function normalizeBootstrapPublicKey(publicKey) {
	const trimmed = publicKey.trim();
	if (!trimmed) return "";
	if (trimmed.includes("BEGIN") || /[+/=]/.test(trimmed)) return normalizeEd25519PublicKeyBase64Url(trimmed) ?? trimmed;
	return trimmed;
}
function loadState(nowMs) {
	const state = loadDeviceBootstrapTokenRecords();
	const now = asDateTimestampMs(nowMs) ?? 0;
	for (const [token, record] of Object.entries(state)) if (now > resolveDeviceBootstrapTokenExpiresAtMs(record)) delete state[token];
	return state;
}
function issueDeviceBootstrapTokenRecord(params, state = loadState(params.nowMs)) {
	const token = generatePairingToken();
	const issuedAtMs = asDateTimestampMs(params.nowMs);
	const expiresAtMs = issuedAtMs === void 0 ? void 0 : asDateTimestampMs(resolveDeviceBootstrapTokenExpiresAtMs({
		...params,
		issuedAtMs
	}));
	if (issuedAtMs === void 0 || expiresAtMs === void 0) throw new Error("Device bootstrap token expiry could not be resolved.");
	state[token] = {
		token,
		...params.setupId ? { setupId: params.setupId } : {},
		ts: issuedAtMs,
		profile: params.profile,
		redeemedProfile: normalizeDeviceBootstrapProfile(void 0),
		issuedAtMs
	};
	persistDeviceBootstrapTokenRecords(state);
	return {
		token,
		expiresAtMs
	};
}
/** Reuse one environment-owned setup credential across provider replay. */
function ensureDevicePairSetupBootstrapToken(params) {
	const setupId = params.setupId.trim();
	if (!setupId) throw new Error("Device setup id must be non-empty.");
	const completion = loadDevicePairSetupCompletionRecord(setupId, params.nowMs);
	if (completion) return {
		status: "completed",
		setupId,
		deviceId: completion.deviceId
	};
	const state = loadState(params.nowMs);
	const existing = Object.values(state).find((record) => record.setupId === setupId);
	const profile = normalizeDeviceBootstrapHandoffProfile(params.profile);
	if (existing) {
		if (!deviceBootstrapProfilesEqual(existing.profile, profile)) throw new Error("Device setup profile changed during replay.");
		return {
			status: "pending",
			token: existing.token,
			expiresAtMs: resolveDeviceBootstrapTokenExpiresAtMs(existing),
			setupId
		};
	}
	return {
		status: "pending",
		...issueDeviceBootstrapTokenRecord({
			profile,
			setupId,
			nowMs: params.nowMs
		}, state),
		setupId
	};
}
/**
* Record that credential delivery is not yet known. Only cloud-worker setup
* keeps its device-bound bearer until delivery is confirmed, allowing the same
* worker to retry when its credential-bearing response never arrives.
*/
function consumeDeviceBootstrapTokenWithSetupCompletion(params, recordWorkerEnvironment) {
	const nowMs = params.nowMs;
	return consumeDeviceBootstrapTokenWithSetupCompletionInTransaction({
		token: params.token,
		deviceId: params.deviceId,
		completedAtMs: params.completedAtMs,
		recordWorkerEnvironment,
		nowMs,
		retentionNowMs: nowMs,
		retainUntilMs: nowMs + DEVICE_PAIR_SETUP_COMPLETION_RETENTION_MS,
		pairedDeviceMatches: (pairedDevice, record) => {
			requestDevicePairingMutationAdmission({
				kind: "bootstrap.consume",
				pairedDevice,
				expiresAtMs: resolveDeviceBootstrapTokenExpiresAtMs(record)
			});
			return true;
		}
	});
}
/** Remove every outstanding bootstrap token from the pairing state file. */
function clearDeviceBootstrapTokens(params) {
	const state = loadState(params.nowMs);
	const removed = Object.keys(state).length;
	persistDeviceBootstrapTokenRecords({});
	return { removed };
}
/** Preserve already-bound cloud-worker credentials for delivery retry. */
function revokeDeviceBootstrapToken(params, database) {
	const providedToken = params.token.trim();
	if (!providedToken) return { removed: false };
	const state = loadState(params.nowMs);
	const found = Object.entries(state).find(([, candidate]) => verifyPairingToken(providedToken, candidate.token));
	if (!found) return { removed: false };
	const [tokenKey, record] = found;
	if (record.setupId && record.profile?.purpose === "cloud-worker" && record.deviceId && hasCloudWorkerSetupDeviceBinding({
		db: database.db,
		setupId: record.setupId,
		deviceId: record.deviceId
	})) return { removed: false };
	delete state[tokenKey];
	persistDeviceBootstrapTokenRecords(state);
	return {
		removed: true,
		record
	};
}
/** Revoke bootstrap credentials inside the rejected request's pairing transaction. */
function revokeDeviceBootstrapTokensForDeviceInDatabase(database, params) {
	withDevicePairingStoreDatabase(database, () => {
		const deviceId = params.deviceId.trim();
		const publicKey = normalizeBootstrapPublicKey(params.publicKey);
		if (!deviceId || !publicKey) return;
		const state = loadState(params.nowMs);
		let removed = false;
		for (const [tokenKey, record] of Object.entries(state)) {
			const recordPublicKey = typeof record.publicKey === "string" ? normalizeBootstrapPublicKey(record.publicKey) : void 0;
			if (record.deviceId?.trim() === deviceId && recordPublicKey === publicKey) {
				delete state[tokenKey];
				removed = true;
			}
		}
		if (removed) persistDeviceBootstrapTokenRecords(state);
	});
}
/** Restore an uncorrelated bootstrap bearer when its credential response was not delivered. */
function restoreGenericDeviceBootstrapToken(params) {
	if (params.record.setupId) return false;
	const state = loadState(params.nowMs);
	state[params.record.token] = params.record;
	persistDeviceBootstrapTokenRecords(state);
	return true;
}
/** Record that one role/scope leg of a multi-role bootstrap handoff was redeemed. */
function redeemDeviceBootstrapTokenProfile(params) {
	const providedToken = params.token.trim();
	if (!providedToken) return {
		recorded: false,
		fullyRedeemed: false
	};
	const state = loadState(params.nowMs);
	const found = Object.entries(state).find(([, candidate]) => verifyPairingToken(providedToken, candidate.token));
	if (!found) return {
		recorded: false,
		fullyRedeemed: false
	};
	const [tokenKey, record] = found;
	const issuedProfile = normalizeDeviceBootstrapProfile(record.profile);
	requestDevicePairingMutationAdmission({
		kind: "bootstrap.token",
		expiresAtMs: resolveDeviceBootstrapTokenExpiresAtMs(record)
	});
	const pendingProfile = resolvePersistedPendingProfile(record);
	const previousRedeemedProfile = normalizeDeviceBootstrapProfile(record.redeemedProfile);
	const redeemedProfile = normalizeDeviceBootstrapProfile({
		roles: [...previousRedeemedProfile.roles, params.role],
		scopes: [...previousRedeemedProfile.scopes, ...resolveBootstrapProfileScopesForRole(params.role, params.scopes, issuedProfile.purpose)],
		purpose: issuedProfile.purpose
	});
	const nextPendingProfile = pendingProfile && !bootstrapProfileSatisfiesProfile({
		actualProfile: redeemedProfile,
		requiredProfile: pendingProfile
	}) ? pendingProfile : void 0;
	const nextRecord = {
		...record,
		profile: issuedProfile,
		redeemedProfile
	};
	if (nextPendingProfile) nextRecord.pendingProfile = nextPendingProfile;
	else delete nextRecord.pendingProfile;
	state[tokenKey] = nextRecord;
	persistDeviceBootstrapTokenRecords(state);
	return {
		recorded: true,
		fullyRedeemed: bootstrapProfileSatisfiesProfile({
			actualProfile: redeemedProfile,
			requiredProfile: issuedProfile
		})
	};
}
/** Verify a bootstrap token, bind it to the first device identity, and stage requested scopes. */
function verifyDeviceBootstrapToken(params) {
	const state = loadState(params.nowMs);
	const providedToken = params.token.trim();
	if (!providedToken) return {
		ok: false,
		reason: "bootstrap_token_invalid"
	};
	const found = Object.entries(state).find(([, candidate]) => verifyPairingToken(providedToken, candidate.token));
	if (!found) return {
		ok: false,
		reason: "bootstrap_token_invalid"
	};
	const [tokenKey, record] = found;
	const deviceId = params.deviceId.trim();
	const publicKey = normalizeBootstrapPublicKey(params.publicKey);
	const role = params.role.trim();
	if (!deviceId || !publicKey || !role) return {
		ok: false,
		reason: "bootstrap_token_invalid"
	};
	const allowedProfile = normalizeDeviceBootstrapProfile(record.profile);
	const requestedProfile = resolveRequestedBootstrapProfile({
		role,
		scopes: params.scopes,
		purpose: allowedProfile.purpose
	});
	if (allowedProfile.roles.length === 0 || deviceBootstrapProfilesEqual(allowedProfile, CONTROL_UI_OWNER_BOOTSTRAP_PROFILE) && !deviceBootstrapProfilesEqual(requestedProfile, CONTROL_UI_OWNER_BOOTSTRAP_PROFILE) || !bootstrapProfileAllowsRequest({
		allowedProfile,
		requestedRole: role,
		requestedScopes: params.scopes
	})) return {
		ok: false,
		reason: "bootstrap_token_invalid"
	};
	requestDevicePairingMutationAdmission({
		kind: "bootstrap.token",
		expiresAtMs: resolveDeviceBootstrapTokenExpiresAtMs(record)
	});
	const boundDeviceId = record.deviceId?.trim();
	const boundPublicKey = typeof record.publicKey === "string" ? normalizeBootstrapPublicKey(record.publicKey) : void 0;
	let pendingProfile = requestedProfile;
	if (boundDeviceId || boundPublicKey) {
		if (boundDeviceId !== deviceId || boundPublicKey !== publicKey) return {
			ok: false,
			reason: "bootstrap_token_invalid"
		};
		const existingPendingProfile = resolvePersistedPendingProfile(record);
		if (existingPendingProfile && !deviceBootstrapProfilesEqual(existingPendingProfile, requestedProfile)) return {
			ok: false,
			reason: "bootstrap_token_invalid"
		};
		pendingProfile = existingPendingProfile ?? requestedProfile;
	}
	state[tokenKey] = {
		...record,
		profile: allowedProfile,
		pendingProfile,
		deviceId,
		publicKey,
		lastUsedAtMs: params.nowMs
	};
	persistDeviceBootstrapTokenRecords(state);
	return { ok: true };
}
const deviceBootstrapOperations = {
	"bootstrap.issue": devicePairingMutation((input) => issueDeviceBootstrapTokenRecord(input)),
	"bootstrap.ensure": devicePairingMutation(ensureDevicePairSetupBootstrapToken),
	"bootstrap.consume": devicePairingMutation((input, { recordWorkerEnvironment }) => consumeDeviceBootstrapTokenWithSetupCompletion(input, recordWorkerEnvironment)),
	"bootstrap.confirm": devicePairingMutation((input) => confirmDevicePairSetupCompletionDeliveryInTransaction(input)),
	"bootstrap.readCompletion": devicePairingMutation((input) => loadDevicePairSetupCompletionRecord(input.setupId, input.nowMs)),
	"bootstrap.prune": devicePairingMutation((input) => pruneExpiredDevicePairSetupCompletionRecords(input.nowMs)),
	"bootstrap.clear": devicePairingMutation(clearDeviceBootstrapTokens),
	"bootstrap.revoke": devicePairingMutation((input, { database }) => revokeDeviceBootstrapToken(input, database)),
	"bootstrap.restore": devicePairingMutation(restoreGenericDeviceBootstrapToken),
	"bootstrap.redeem": devicePairingMutation(redeemDeviceBootstrapTokenProfile),
	"bootstrap.verify": devicePairingMutation(verifyDeviceBootstrapToken)
};
//#endregion
export { revokeDeviceBootstrapTokensForDeviceInDatabase as n, deviceBootstrapOperations as t };
