import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import fs from "node:fs";
import { safeStatSync } from "@openclaw/fs-safe/path";
//#region src/plugins/installed-plugin-index-hash.ts
/** Hashes JSON-serializable data with SHA-256. */
function hashJson(value) {
	return sha256Hex(JSON.stringify(value));
}
/** Hashes JSON-like data independently of object property insertion order. */
function hashStableJson(value) {
	return sha256Hex(stableStringify(value));
}
/** Safely hashes a file, optionally recording required-file diagnostics. */
function safeHashFile(params) {
	try {
		return sha256Hex(fs.readFileSync(params.filePath));
	} catch (err) {
		if (params.required) params.diagnostics.push({
			level: "warn",
			...params.pluginId ? { pluginId: params.pluginId } : {},
			source: params.filePath,
			message: `installed plugin index could not hash ${params.filePath}: ${err instanceof Error ? err.message : String(err)}`
		});
		return;
	}
}
/** Reads a safe file signature for installed plugin index freshness checks. */
function safeFileSignature(filePath) {
	const stat = safeStatSync(filePath);
	return stat?.isFile() ? {
		size: stat.size,
		mtimeMs: stat.mtimeMs,
		ctimeMs: stat.ctimeMs
	} : void 0;
}
//#endregion
export { safeHashFile as i, hashStableJson as n, safeFileSignature as r, hashJson as t };
