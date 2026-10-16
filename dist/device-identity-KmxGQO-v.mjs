import { t as pathMayExistSync } from "./path-existence-O1bMV6vh.mjs";
import { a as readStoredDeviceIdentity, c as resolveDeviceIdentityStore, d as readProcessDeviceIdentity, i as insertStoredDeviceIdentityIfAbsent, n as assertNoPendingLegacyIdentity, o as readStoredDeviceIdentityReadOnly, r as generateStoredDeviceIdentity, u as cacheProcessDeviceIdentity } from "./device-identity-store-id-VtwS0.mjs";
import { c as normalizeEd25519PublicKeyBase64Url, d as verifyEd25519Signature } from "./ed25519-signature-D_xiObSW.mjs";
import crypto from "node:crypto";
//#region src/infra/device-identity.ts
function toDeviceIdentity(stored) {
	return {
		deviceId: stored.deviceId,
		publicKeyPem: stored.publicKeyPem,
		privateKeyPem: stored.privateKeyPem
	};
}
/** Load a valid canonical identity or atomically create its SQLite row. */
function loadOrCreateDeviceIdentity(options = {}) {
	const resolved = resolveDeviceIdentityStore(options);
	const resolvedOptions = {
		...options,
		path: resolved.databasePath,
		identityKey: resolved.identityKey
	};
	const existing = pathMayExistSync(resolved.databasePath) ? readStoredDeviceIdentity(resolvedOptions) : null;
	if (existing) return toDeviceIdentity(existing);
	assertNoPendingLegacyIdentity(resolvedOptions);
	const candidate = generateStoredDeviceIdentity();
	return toDeviceIdentity(insertStoredDeviceIdentityIfAbsent(candidate, resolvedOptions));
}
/** Keep one authoritative identity stable for the lifetime of a state-dir process. */
function loadOrCreateProcessDeviceIdentity(options = {}) {
	const { databasePath, identityKey } = resolveDeviceIdentityStore(options);
	const cacheKey = `${databasePath}\0${identityKey}`;
	const cached = readProcessDeviceIdentity(cacheKey);
	if (cached) return cached;
	const identity = loadOrCreateDeviceIdentity({
		...options,
		path: databasePath,
		identityKey
	});
	return cacheProcessDeviceIdentity(cacheKey, identity);
}
/** Load a valid persisted identity without creating or mutating SQLite state. */
function loadDeviceIdentityIfPresent(options = {}) {
	const stored = readStoredDeviceIdentityReadOnly(options);
	if (stored) return toDeviceIdentity(stored);
	assertNoPendingLegacyIdentity(options);
	return null;
}
/** Derive the stable device id from PEM or raw base64/base64url public key material. */
function deriveDeviceIdFromPublicKey(publicKey) {
	try {
		const normalized = normalizeEd25519PublicKeyBase64Url(publicKey);
		if (!normalized) return null;
		const raw = Buffer.from(normalized, "base64url");
		return crypto.createHash("sha256").update(raw).digest("hex");
	} catch {
		return null;
	}
}
/** Verify a UTF-8 payload signature against PEM or raw base64/base64url public key material. */
function verifyDeviceSignature(publicKey, payload, signatureBase64Url) {
	return verifyEd25519Signature({
		publicKey,
		payload,
		signatureBase64Url
	});
}
//#endregion
export { verifyDeviceSignature as a, loadOrCreateProcessDeviceIdentity as i, loadDeviceIdentityIfPresent as n, loadOrCreateDeviceIdentity as r, deriveDeviceIdFromPublicKey as t };
