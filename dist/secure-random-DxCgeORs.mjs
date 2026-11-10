import { a as registerSecretValueForRedaction } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import { randomBytes, randomInt, randomUUID } from "node:crypto";
//#region src/infra/secure-random.ts
/** Generates a cryptographically secure UUID for runtime ids and cache keys. */
function generateSecureUuid() {
	return randomUUID();
}
function generateSecureToken(input = 16) {
	const bytes = typeof input === "number" ? input : input.bytes ?? 16;
	if (typeof input !== "number" && bytes < 16) throw new RangeError("Redacted tokens require at least 16 bytes");
	const encoded = randomBytes(bytes).toString(typeof input === "number" ? "base64url" : input.encoding ?? "base64url");
	const token = (typeof input === "number" ? "" : input.prefix ?? "") + encoded;
	if (typeof input !== "number") {
		registerSecretValueForRedaction(token);
		registerSecretValueForRedaction(encoded);
	}
	return token;
}
/** Generates a hex-encoded cryptographic token from the requested byte count. */
function generateSecureHex(bytes = 16) {
	return randomBytes(bytes).toString("hex");
}
/** Returns a cryptographically secure fraction in the range [0, 1). */
function generateSecureFraction() {
	return randomBytes(4).readUInt32BE(0) / 4294967296;
}
function generateSecureInt(a, b) {
	return typeof b === "number" ? randomInt(a, b) : randomInt(a);
}
//#endregion
export { generateSecureUuid as a, generateSecureToken as i, generateSecureHex as n, generateSecureInt as r, generateSecureFraction as t };
