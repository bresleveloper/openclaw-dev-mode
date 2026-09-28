import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-CKxLTepq.mjs";
import { a as loadOrCreateProcessDeviceIdentity, m as resolveDeviceIdentityStore, r as loadDeviceIdentityIfPresent } from "./device-identity-B_zMrBd6.mjs";
import { n as deriveCanonicalEd25519PrivateKeyRaw } from "./ed25519-signature-De1Kepnz.mjs";
import "./public-share-D2nZ1_dA.mjs";
import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from "node:crypto";
//#region src/gateway/control-ui-public-session-token.ts
const PUBLIC_SESSION_TOKEN_PREFIX = "v1.";
const PUBLIC_SESSION_TOKEN_CIPHER = "aes-256-gcm";
const PUBLIC_SESSION_TOKEN_NONCE_BYTES = 12;
const PUBLIC_SESSION_TOKEN_AAD = Buffer.from("openclaw.public-session-share-locator.aad.v1", "utf8");
const PUBLIC_SESSION_TOKEN_KEY_SALT = Buffer.from("openclaw.public-session-share-locator.salt.v1", "utf8");
const PUBLIC_SESSION_TOKEN_KEY_INFO = Buffer.from("openclaw.public-session-share-locator.key.v1", "utf8");
const PUBLIC_SESSION_TOKEN_MAX_PLAINTEXT_BYTES = 5e3;
const PUBLIC_SESSION_LOCATOR_KEYS = [
	"agentId",
	"sessionId",
	"sessionKey",
	"shareId"
].toSorted();
const PUBLIC_SESSION_CLAIM_KEYS = [...PUBLIC_SESSION_LOCATOR_KEYS, "v"].toSorted();
function hasExactKeys(value, keys) {
	return Object.keys(value).toSorted().join("\0") === keys.join("\0");
}
function hasInvalidSessionKeyCharacter(value) {
	for (const character of value) {
		const codePoint = character.codePointAt(0) ?? 0;
		if (codePoint <= 31 || codePoint === 127) return true;
	}
	return false;
}
function hasInvalidSessionIdCharacter(value) {
	for (const character of value) {
		const codePoint = character.codePointAt(0) ?? 0;
		if (character === "/" || character === "\\" || character.trim() === "" || codePoint <= 31 || codePoint >= 127 && codePoint <= 159) return true;
	}
	return false;
}
function isValidLocator(value) {
	if (!isRecord(value)) return false;
	return typeof value.agentId === "string" && /^[a-z0-9][a-z0-9_-]{0,63}$/u.test(value.agentId) && typeof value.sessionKey === "string" && value.sessionKey.length > 0 && value.sessionKey.length <= 4096 && !hasInvalidSessionKeyCharacter(value.sessionKey) && typeof value.sessionId === "string" && value.sessionId.length > 0 && value.sessionId.length <= 512 && !hasInvalidSessionIdCharacter(value.sessionId) && typeof value.shareId === "string" && /^[a-f0-9]{48}$/u.test(value.shareId);
}
function parseClaims(value) {
	if (!isRecord(value)) return null;
	if (value.v !== 1 || !hasExactKeys(value, PUBLIC_SESSION_CLAIM_KEYS) || !isValidLocator(value)) return null;
	return {
		agentId: value.agentId,
		sessionKey: value.sessionKey,
		sessionId: value.sessionId,
		shareId: value.shareId
	};
}
function derivePublicSessionTokenKey(identity) {
	const privateSeed = deriveCanonicalEd25519PrivateKeyRaw(identity.privateKeyPem);
	try {
		return Buffer.from(hkdfSync("sha256", privateSeed, PUBLIC_SESSION_TOKEN_KEY_SALT, PUBLIC_SESSION_TOKEN_KEY_INFO, 32));
	} finally {
		privateSeed.fill(0);
	}
}
/** Creates a domain-separated opaque-locator codec from one durable Gateway identity. */
function createPublicSessionShareTokenCodec(identity) {
	const key = derivePublicSessionTokenKey(identity);
	return {
		mint(locator) {
			if (!isValidLocator(locator) || !hasExactKeys(locator, PUBLIC_SESSION_LOCATOR_KEYS)) throw new Error("invalid public session locator");
			const plaintext = Buffer.from(JSON.stringify({
				v: 1,
				...locator
			}), "utf8");
			if (plaintext.byteLength > PUBLIC_SESSION_TOKEN_MAX_PLAINTEXT_BYTES) throw new Error("public session locator exceeds the maximum length");
			const nonce = randomBytes(PUBLIC_SESSION_TOKEN_NONCE_BYTES);
			const cipher = createCipheriv(PUBLIC_SESSION_TOKEN_CIPHER, key, nonce);
			cipher.setAAD(PUBLIC_SESSION_TOKEN_AAD);
			const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
			const token = `${PUBLIC_SESSION_TOKEN_PREFIX}${Buffer.concat([
				nonce,
				cipher.getAuthTag(),
				ciphertext
			]).toString("base64url")}`;
			if (token.length > 7e3) throw new Error("public session token exceeds the maximum length");
			registerSecretValueForRedaction(locator.shareId);
			registerSecretValueForRedaction(token);
			return token;
		},
		resolve(token) {
			if (token.length > 7e3 || !token.startsWith(PUBLIC_SESSION_TOKEN_PREFIX)) return null;
			const encoded = token.slice(3);
			if (!encoded || !/^[A-Za-z0-9_-]+$/u.test(encoded)) return null;
			const sealed = Buffer.from(encoded, "base64url");
			if (sealed.toString("base64url") !== encoded || sealed.byteLength <= 28) return null;
			const nonce = sealed.subarray(0, PUBLIC_SESSION_TOKEN_NONCE_BYTES);
			const tag = sealed.subarray(PUBLIC_SESSION_TOKEN_NONCE_BYTES, 28);
			const ciphertext = sealed.subarray(28);
			if (ciphertext.byteLength > PUBLIC_SESSION_TOKEN_MAX_PLAINTEXT_BYTES) return null;
			try {
				const decipher = createDecipheriv(PUBLIC_SESSION_TOKEN_CIPHER, key, nonce);
				decipher.setAAD(PUBLIC_SESSION_TOKEN_AAD);
				decipher.setAuthTag(tag);
				const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
				if (plaintext.byteLength > PUBLIC_SESSION_TOKEN_MAX_PLAINTEXT_BYTES) return null;
				const locator = parseClaims(JSON.parse(plaintext.toString("utf8")));
				if (!locator) return null;
				registerSecretValueForRedaction(token);
				registerSecretValueForRedaction(locator.shareId);
				return locator;
			} catch {
				return null;
			}
		}
	};
}
const codecsByDatabasePath = /* @__PURE__ */ new Map();
const missingIdentityDatabasePaths = /* @__PURE__ */ new Map();
function cacheCodec(databasePath, identity) {
	const codec = createPublicSessionShareTokenCodec(identity);
	pruneMapToMaxSize(codecsByDatabasePath, 31);
	codecsByDatabasePath.set(databasePath, codec);
	missingIdentityDatabasePaths.delete(databasePath);
	return codec;
}
function resolveProcessCodec(params) {
	const options = params.env ? { env: params.env } : {};
	const { databasePath } = resolveDeviceIdentityStore(options);
	const cached = codecsByDatabasePath.get(databasePath);
	if (cached) return cached;
	if (!params.create && missingIdentityDatabasePaths.has(databasePath)) return null;
	const identity = params.create ? loadOrCreateProcessDeviceIdentity(options) : loadDeviceIdentityIfPresent(options);
	if (!identity) {
		pruneMapToMaxSize(missingIdentityDatabasePaths, 31);
		missingIdentityDatabasePaths.set(databasePath, true);
		return null;
	}
	return cacheCodec(databasePath, identity);
}
/** Loads the process codec before a session-store commit that will publish a grant. */
function loadPublicSessionShareTokenCodec(options = {}) {
	const codec = resolveProcessCodec({
		create: true,
		...options.env ? { env: options.env } : {}
	});
	if (!codec) throw new Error("public session token identity is unavailable");
	return codec;
}
/** Resolves an opaque locator without letting anonymous traffic create durable identity state. */
function resolvePublicSessionShareToken(token, options = {}) {
	return resolveProcessCodec({
		create: false,
		...options.env ? { env: options.env } : {}
	})?.resolve(token) ?? null;
}
//#endregion
export { resolvePublicSessionShareToken as n, loadPublicSessionShareTokenCodec as t };
