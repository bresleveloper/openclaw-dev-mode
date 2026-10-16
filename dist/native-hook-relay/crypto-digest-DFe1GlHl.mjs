import { closeSync, openSync } from "node:fs";
import { hash } from "node:crypto";
import { sha256FileSync } from "@openclaw/fs-safe/durability";
import "node:buffer";
//#region packages/normalization-core/src/node-crypto.ts
function sha256Hex(input) {
	return hash("sha256", input, "hex");
}
function sha256HexPrefixCore(input, length) {
	return sha256Hex(input).slice(0, length);
}
//#endregion
//#region src/infra/crypto-digest.ts
function sha256Base64Url(input) {
	return hash("sha256", input, "base64url");
}
/** Matches the streaming helper's symlink-following path contract. */
function sha256FileSync$1(filePath) {
	const descriptor = openSync(filePath, "r");
	try {
		return sha256FileSync(descriptor).digest;
	} finally {
		closeSync(descriptor);
	}
}
//#endregion
export { sha256HexPrefixCore as i, sha256FileSync$1 as n, sha256Hex as r, sha256Base64Url as t };
