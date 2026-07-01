import { y as resolveStateDir } from "./paths-DyelItkH.js";
import "./json-files-2umMHm0W.js";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import path from "node:path";
import { randomBytes } from "node:crypto";
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
/** Coerce persisted pairing maps, treating malformed arrays/scalars as empty state. */
function coercePairingStateRecord(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return {};
	return value;
}
/** Remove pending requests older than the caller's pairing TTL. */
function pruneExpiredPending(pendingById, nowMs, ttlMs) {
	for (const [id, req] of Object.entries(pendingById)) if (nowMs - req.ts > ttlMs) delete pendingById[id];
}
/** Refresh one compatible pending request or replace a superseded request set atomically. */
async function reconcilePendingPairingRequests(params) {
	if (params.existing.length === 1 && params.canRefreshSingle(params.existing[0], params.incoming)) {
		const refreshed = params.refreshSingle(params.existing[0], params.incoming);
		params.pendingById[refreshed.requestId] = refreshed;
		await params.persist();
		return {
			status: "pending",
			request: refreshed,
			created: false
		};
	}
	for (const existing of params.existing) delete params.pendingById[existing.requestId];
	const request = params.buildReplacement({
		existing: params.existing,
		incoming: params.incoming
	});
	params.pendingById[request.requestId] = request;
	await params.persist();
	return {
		status: "pending",
		request,
		created: true
	};
}
/** Generate a URL-safe bearer token for pairing and bootstrap flows. */
function generatePairingToken() {
	return randomBytes(32).toString("base64url");
}
/** Verify nonblank pairing tokens with constant-time secret comparison. */
function verifyPairingToken(provided, expected) {
	if (provided.trim().length === 0 || expected.trim().length === 0) return false;
	return safeEqualSecret(provided, expected);
}
//#endregion
export { reconcilePendingPairingRequests as a, pruneExpiredPending as i, verifyPairingToken as n, resolvePairingPaths as o, coercePairingStateRecord as r, generatePairingToken as t };
