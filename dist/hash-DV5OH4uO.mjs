import crypto from "node:crypto";
//#region src/agents/sandbox/hash.ts
function hashTextSha256(value) {
	return crypto.createHash("sha256").update(value).digest("hex");
}
//#endregion
export { hashTextSha256 as t };
