import { t as asNonArrayRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as isMissingPathError } from "./errno-CkbDOfLk.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import "./json-files-C0HSMh2Z.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/infra/pairing-files.ts
/** Resolve pending/paired JSON file locations for one pairing namespace. */
function resolvePairingPaths(baseDir, subdir) {
	const root = baseDir ?? resolveStateDir();
	const dir = path.join(root, subdir);
	return {
		dir,
		pendingPath: path.join(dir, "pending.json"),
		pairedPath: path.join(dir, "paired.json")
	};
}
/** Inventory only; Doctor owns importing and archiving these retired stores. */
async function listLegacyPairingStoreFiles(baseDir) {
	const devices = resolvePairingPaths(baseDir, "devices");
	const nodes = resolvePairingPaths(baseDir, "nodes");
	const candidates = [
		devices.pairedPath,
		devices.pendingPath,
		path.join(devices.dir, "bootstrap.json"),
		nodes.pairedPath,
		nodes.pendingPath
	];
	const present = await Promise.all(candidates.map((filePath) => fs.access(filePath).then(() => true, (error) => {
		if (isMissingPathError(error)) return false;
		throw error;
	})));
	return candidates.filter((_, index) => present[index]);
}
/** Coerce persisted pairing maps, treating malformed arrays/scalars as empty state. */
function coercePairingStateRecord(value) {
	return asNonArrayRecord(value);
}
/** Remove pending requests older than the caller's pairing TTL. */
function pruneExpiredPending(pendingById, nowMs, ttlMs) {
	for (const [id, req] of Object.entries(pendingById)) if (nowMs - (req.refreshedAtMs ?? req.ts) > ttlMs) delete pendingById[id];
}
//#endregion
export { resolvePairingPaths as i, listLegacyPairingStoreFiles as n, pruneExpiredPending as r, coercePairingStateRecord as t };
