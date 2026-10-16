import crypto from "node:crypto";
//#region src/commands/random-token.ts
/** Generates a new 192-bit gateway token encoded as hex. */
function randomToken() {
	return crypto.randomBytes(24).toString("hex");
}
//#endregion
export { randomToken as t };
