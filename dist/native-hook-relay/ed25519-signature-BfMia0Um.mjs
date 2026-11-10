import crypto from "node:crypto";
//#region src/infra/ed25519-signature.ts
const ED25519_RAW_KEY_LENGTH = 32;
const ED25519_SPKI_PREFIX = Buffer.from("302a300506032b6570032100", "hex");
Buffer.from("302e020100300506032b657004220420", "hex");
const MAX_BASE64URL_DECODE_INPUT_LENGTH = 4096;
/** Decode the existing permissive base64url wire shape. */
function base64UrlDecode(input) {
	if (input.length > MAX_BASE64URL_DECODE_INPUT_LENGTH) throw new Error("base64url input exceeds the maximum allowed length");
	const normalized = input.replaceAll("-", "+").replaceAll("_", "/");
	const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
	return Buffer.from(padded, "base64");
}
function assertEd25519KeyType(key, label) {
	if (key.asymmetricKeyType !== "ed25519") throw new Error(`${label} must be an Ed25519 key`);
}
function deriveRawKeyFromDer(der, label, prefix) {
	const expectedLength = prefix.length + ED25519_RAW_KEY_LENGTH;
	if (der.length !== expectedLength || !der.subarray(0, prefix.length).equals(prefix)) throw new Error(`${label} has a noncanonical Ed25519 encoding`);
	return der.subarray(prefix.length);
}
/** Parse any Node-compatible Ed25519 PEM and return its canonical raw public key. */
function deriveEd25519PublicKeyRaw(publicKeyPem) {
	const key = crypto.createPublicKey(publicKeyPem);
	assertEd25519KeyType(key, "public key");
	return deriveRawKeyFromDer(key.export({
		type: "spki",
		format: "der"
	}), "public key", ED25519_SPKI_PREFIX);
}
function publicKeyRawBase64UrlFromEd25519Pem(publicKeyPem) {
	return deriveEd25519PublicKeyRaw(publicKeyPem).toString("base64url");
}
function normalizeEd25519PublicKeyBase64Url(publicKey) {
	try {
		const raw = publicKey.includes("BEGIN") ? deriveEd25519PublicKeyRaw(publicKey) : base64UrlDecode(publicKey);
		if (raw.length === 0) return null;
		return raw.toString("base64url");
	} catch {
		return null;
	}
}
function signEd25519Payload(privateKeyPem, payload) {
	const key = crypto.createPrivateKey(privateKeyPem);
	return crypto.sign(null, Buffer.from(payload, "utf8"), key).toString("base64url");
}
function createEd25519PublicKey(publicKey) {
	if (publicKey.includes("BEGIN")) return crypto.createPublicKey(publicKey);
	return crypto.createPublicKey({
		key: Buffer.concat([ED25519_SPKI_PREFIX, base64UrlDecode(publicKey)]),
		type: "spki",
		format: "der"
	});
}
function verifyEd25519SignatureBytes(params) {
	try {
		const key = createEd25519PublicKey(params.publicKey);
		const signature = base64UrlDecode(params.signatureBase64Url);
		return crypto.verify(null, params.payload, key, signature);
	} catch {
		return false;
	}
}
//#endregion
export { verifyEd25519SignatureBytes as i, publicKeyRawBase64UrlFromEd25519Pem as n, signEd25519Payload as r, normalizeEd25519PublicKeyBase64Url as t };
