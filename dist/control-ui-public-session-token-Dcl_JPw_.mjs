import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as containsAsciiControlCharacter } from "./string-normalization-D6DKCpwE.mjs";
import { a as registerSecretValueForRedaction } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import { n as deriveCanonicalEd25519PrivateKeyRaw } from "./ed25519-signature-DxLj6ug0.mjs";
import { i as loadOrCreateProcessDeviceIdentityAsync, n as loadDeviceIdentityIfPresentAsync } from "./device-identity-async-BBs_AIYT.mjs";
import { c as resolveDeviceIdentityStore } from "./device-identity-store-gsje3D5H.mjs";
import "./public-share-aG2ajaph.mjs";
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
function isValidLocator(value) {
	if (!isRecord(value)) return false;
	return typeof value.agentId === "string" && /^[a-z0-9][a-z0-9_-]{0,63}$/u.test(value.agentId) && typeof value.sessionKey === "string" && value.sessionKey.length > 0 && value.sessionKey.length <= 4096 && !containsAsciiControlCharacter(value.sessionKey) && typeof value.sessionId === "string" && value.sessionId.length > 0 && value.sessionId.length <= 512 && !/[/\\\s\p{Cc}]/u.test(value.sessionId) && typeof value.shareId === "string" && /^[a-f0-9]{48}$/u.test(value.shareId);
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
/** Validate the exact encoded claims before a publication grant becomes durable. */
function encodePublicSessionShareLocator(locator) {
	if (!isValidLocator(locator) || !hasExactKeys(locator, PUBLIC_SESSION_LOCATOR_KEYS)) throw new Error("invalid public session locator");
	const plaintext = Buffer.from(JSON.stringify({
		v: 1,
		...locator
	}), "utf8");
	if (plaintext.byteLength > PUBLIC_SESSION_TOKEN_MAX_PLAINTEXT_BYTES) throw new Error("public session locator exceeds the maximum length");
	return plaintext;
}
/** Creates a domain-separated opaque-locator codec from one durable Gateway identity. */
function createPublicSessionShareTokenCodec(identity) {
	const key = derivePublicSessionTokenKey(identity);
	return {
		mint(locator) {
			const plaintext = encodePublicSessionShareLocator(locator);
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
const previewTokens = /* @__PURE__ */ new WeakMap();
function cacheCodec(databasePath, identity) {
	const cached = codecsByDatabasePath.get(databasePath);
	if (cached) return cached;
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
	return (params.create ? loadOrCreateProcessDeviceIdentityAsync({
		...options,
		path: databasePath
	}) : loadDeviceIdentityIfPresentAsync({
		...options,
		path: databasePath
	})).then((loaded) => {
		if (!loaded) {
			const created = codecsByDatabasePath.get(databasePath);
			if (created) return created;
			pruneMapToMaxSize(missingIdentityDatabasePaths, 31);
			missingIdentityDatabasePaths.set(databasePath, true);
			return null;
		}
		return cacheCodec(databasePath, loaded);
	});
}
function requirePublicSessionShareTokenCodec(codec) {
	if (!codec) throw new Error("public session token identity is unavailable");
	return codec;
}
/** Warm codecs remain synchronous so a prepared session row needs no new read phase. */
function loadPublicSessionShareTokenCodec(options = {}) {
	const codec = resolveProcessCodec({
		create: true,
		...options.env ? { env: options.env } : {}
	});
	return codec instanceof Promise ? codec.then(requirePublicSessionShareTokenCodec) : requirePublicSessionShareTokenCodec(codec);
}
/** Resolves an opaque locator without letting anonymous traffic create durable identity state. */
async function resolvePublicSessionShareToken(token, options = {}) {
	return (await resolveProcessCodec({
		create: false,
		...options.env ? { env: options.env } : {}
	}))?.resolve(token) ?? null;
}
/** Public readers may reuse the installation identity but must never create it. */
async function mintExistingPublicSessionShareToken(locator) {
	const codec = await resolveProcessCodec({ create: false });
	if (!codec) return;
	let tokens = previewTokens.get(codec);
	if (!tokens) {
		tokens = /* @__PURE__ */ new Map();
		previewTokens.set(codec, tokens);
	}
	const key = JSON.stringify(locator);
	let token = tokens.get(key);
	if (!token) {
		token = codec.mint(locator);
		pruneMapToMaxSize(tokens, 127);
		tokens.set(key, token);
	}
	return token;
}
//#endregion
export { resolvePublicSessionShareToken as i, loadPublicSessionShareTokenCodec as n, mintExistingPublicSessionShareToken as r, encodePublicSessionShareLocator as t };
