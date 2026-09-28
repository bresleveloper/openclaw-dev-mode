import { closeSync, createReadStream, openSync } from "node:fs";
import { createHash, hash } from "node:crypto";
import { sha256FileSync } from "@openclaw/fs-safe/durability";
//#region src/infra/crypto-digest.ts
function sha256Base64(input) {
	return hash("sha256", input, "base64");
}
function sha256Base64Url(input) {
	return hash("sha256", input, "base64url");
}
function sha256Base64UrlPrefix(input, length) {
	return sha256Base64Url(input).slice(0, length);
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
/** Streams a file, optionally stopping at an inclusive byte offset. */
async function sha256File$1(filePath, end) {
	const digest = createHash("sha256");
	try {
		for await (const chunk of createReadStream(filePath, {
			end,
			highWaterMark: 262144
		})) digest.update(chunk);
	} catch (err) {
		throw new Error(`Failed to hash file ${filePath}: ${err instanceof Error ? err.message : String(err)}`, { cause: err });
	}
	return digest.digest("hex");
}
//#endregion
export { sha256FileSync$1 as a, sha256File$1 as i, sha256Base64Url as n, sha256Base64UrlPrefix as r, sha256Base64 as t };
