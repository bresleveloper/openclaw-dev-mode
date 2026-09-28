import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-CKxLTepq.mjs";
import { n as sha256Base64Url } from "./crypto-digest-D9Nqq3c7.mjs";
import "./worker-admission-BB3C4gz4.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { i as generateSecureToken } from "./secure-random-BJtJxP9Y.mjs";
import { y as serializeWorkerSessionTurnClaim } from "./placement-record-CB6gcJKw.mjs";
import { n as sameWorkerProtocolFeatures, t as sameWorkerBuild } from "./worker-build-identity-D_c48Wx_.mjs";
//#region src/gateway/worker-environments/credential.ts
const WORKER_CREDENTIAL_TTL_MS = 6e5;
const WORKER_CREDENTIAL_HASH_DOMAIN = "openclaw-worker-credential-v1\0";
const WORKER_TURN_CREDENTIAL_HASH_DOMAIN = "openclaw-worker-turn-credential-v1\0";
const WORKER_CREDENTIAL_BYTES = 32;
/** Hash opaque worker credentials with their exact durable authority before persistence. */
function hashWorkerCredential(credential, claim) {
	if (!claim) return sha256Base64Url(`${WORKER_CREDENTIAL_HASH_DOMAIN}${credential}`);
	const binding = serializeWorkerSessionTurnClaim(claim);
	return sha256Base64Url(`${WORKER_TURN_CREDENTIAL_HASH_DOMAIN}${binding}\0${credential}`);
}
/** Generate one high-entropy credential. Plaintext is returned only to its delivery owner. */
function createWorkerCredentialMaterial(generateToken = generateSecureToken, claim) {
	const credential = generateToken(WORKER_CREDENTIAL_BYTES);
	registerSecretValueForRedaction(credential);
	return {
		credential,
		credentialHash: hashWorkerCredential(credential, claim)
	};
}
//#endregion
//#region src/gateway/worker-environments/admission.ts
const STALE_WORKER_BUILD_REASON = "Worker build does not match the current Gateway build; redispatch the session so its worker can bootstrap the current build before retrying.";
var StaleWorkerBuildError = class extends Error {
	constructor() {
		super(STALE_WORKER_BUILD_REASON);
		this.code = "invalid_state";
	}
};
/** Fence persisted builds that cannot parse the exact current launch descriptor. */
function supportsCurrentWorkerLaunch(handshake) {
	return handshake?.protocolFeatures.includes("worker-execution-context-v2") === true && handshake.protocolFeatures.includes("worker-execution-authority-v1");
}
/** Admits only the exact build selected for this worker environment. */
function verifyWorkerAdmissionHandshake(handshake, expected) {
	return sameWorkerBuild(handshake, expected);
}
/** Validate an opaque credential and every server-owned worker admission binding. */
function admitWorkerConnection(params) {
	const { admission, store } = params;
	const turnClaim = params.turnClaim;
	const credentialHash = hashWorkerCredential(admission.credential, turnClaim);
	const credential = store.getCredential(admission.environmentId);
	if (!credential || !safeEqualSecret(credentialHash, credential.credentialHash)) return {
		ok: false,
		reason: store.findCredentialByHash(credentialHash) ? "environment-mismatch" : "invalid-credential"
	};
	if (credential.environmentId !== admission.environmentId) return {
		ok: false,
		reason: "environment-mismatch"
	};
	if (admission.sessionId !== null) {
		if (!turnClaim || turnClaim.owner.kind !== "worker" || turnClaim.sessionId !== admission.sessionId || turnClaim.runId !== admission.runId || turnClaim.owner.environmentId !== admission.environmentId || turnClaim.owner.ownerEpoch !== admission.ownerEpoch) return {
			ok: false,
			reason: "placement-mismatch"
		};
	} else if (turnClaim || admission.runId !== null) return {
		ok: false,
		reason: "session-mismatch"
	};
	if (params.nowMs >= credential.expiresAtMs && params.allowExpiredCredential !== true) return {
		ok: false,
		reason: "credential-expired"
	};
	const environment = store.get(admission.environmentId);
	if (!environment || environment.state !== "ready" && environment.state !== "idle" && environment.state !== "attached" || environment.destroyRequestedAtMs !== null || !environment.bootstrapReceipt) return {
		ok: false,
		reason: "environment-unavailable"
	};
	if (admission.handshake.bundleHash !== credential.bundleHash || admission.handshake.bundleHash !== environment.bootstrapReceipt.bundleHash || admission.handshake.bundleHash !== params.expectedBuild.bundleHash) return {
		ok: false,
		reason: "bundle-mismatch"
	};
	if (admission.handshake.openclawVersion !== environment.bootstrapReceipt.openclawVersion || admission.handshake.openclawVersion !== params.expectedBuild.openclawVersion) return {
		ok: false,
		reason: "version-mismatch"
	};
	if (admission.sessionId !== credential.sessionId) return {
		ok: false,
		reason: "session-mismatch"
	};
	if (admission.sessionId === null !== (admission.runId === null)) return {
		ok: false,
		reason: "session-mismatch"
	};
	if (admission.ownerEpoch !== credential.ownerEpoch || admission.ownerEpoch !== environment.ownerEpoch) return {
		ok: false,
		reason: "owner-epoch-mismatch"
	};
	if (admission.rpcSetVersion !== credential.rpcSetVersion || credential.rpcSetVersion !== 1) return {
		ok: false,
		reason: "rpc-set-mismatch"
	};
	if (!sameWorkerProtocolFeatures(admission.handshake.protocolFeatures, environment.bootstrapReceipt.protocolFeatures) || !sameWorkerProtocolFeatures(admission.handshake.protocolFeatures, params.expectedBuild.protocolFeatures)) return {
		ok: false,
		reason: "protocol-features-mismatch"
	};
	return {
		ok: true,
		identity: {
			environmentId: environment.environmentId,
			credentialHash: credential.credentialHash,
			bundleHash: credential.bundleHash,
			sessionId: credential.sessionId,
			runId: admission.runId,
			turnClaim: turnClaim ?? null,
			ownerEpoch: credential.ownerEpoch,
			rpcSetVersion: credential.rpcSetVersion,
			protocolFeatures: [...environment.bootstrapReceipt.protocolFeatures],
			credentialExpiresAtMs: credential.expiresAtMs
		}
	};
}
/** Revalidate live ownership on every worker RPC so rotation and expiry fence stale sockets. */
function validateWorkerConnectionIdentity(params) {
	const credential = params.store.getCredential(params.identity.environmentId);
	if (!credential || !safeEqualSecret(credential.credentialHash, params.identity.credentialHash)) return "credential-replaced";
	if (params.nowMs >= credential.expiresAtMs) return "credential-expired";
	const environment = params.store.get(params.identity.environmentId);
	if (!environment || environment.state !== "ready" && environment.state !== "idle" && environment.state !== "attached" || environment.destroyRequestedAtMs !== null) return "environment-unavailable";
	if (environment.ownerEpoch !== params.identity.ownerEpoch || credential.ownerEpoch !== params.identity.ownerEpoch) return "owner-epoch-mismatch";
	return null;
}
//#endregion
export { validateWorkerConnectionIdentity as a, createWorkerCredentialMaterial as c, supportsCurrentWorkerLaunch as i, hashWorkerCredential as l, StaleWorkerBuildError as n, verifyWorkerAdmissionHandshake as o, admitWorkerConnection as r, WORKER_CREDENTIAL_TTL_MS as s, STALE_WORKER_BUILD_REASON as t };
