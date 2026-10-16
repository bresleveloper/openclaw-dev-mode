import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { randomBytes } from "node:crypto";
//#region src/infra/pairing-token.ts
/** Random byte length for base64url device/node/bootstrap bearer tokens. */
const PAIRING_TOKEN_BYTES = 32;
/** Generate a URL-safe bearer token for pairing and bootstrap flows. */
function generatePairingToken() {
	return randomBytes(PAIRING_TOKEN_BYTES).toString("base64url");
}
/** Verify nonblank pairing tokens with constant-time secret comparison. */
function verifyPairingToken(provided, expected) {
	if (provided.trim().length === 0 || expected.trim().length === 0) return false;
	return safeEqualSecret(provided, expected);
}
//#endregion
export { verifyPairingToken as n, generatePairingToken as t };
