import crypto from "node:crypto";
//#region src/agents/sandbox/hash.ts
/**
* Sandbox hashing helper.
*
* Produces stable SHA-256 digests for config hashes, labels, and cache keys.
*/
/** Returns a stable SHA-256 hex digest for sandbox config/cache keys. */
function hashTextSha256(value) {
	return crypto.createHash("sha256").update(value).digest("hex");
}
//#endregion
export { hashTextSha256 as t };
