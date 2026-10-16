import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
//#region src/state/backup-run-records.contract.ts
const BACKUP_RUN_ERROR_MAX_LENGTH = 1200;
function resolveBackupRunTarget(run) {
	return run.kind === "git" ? run.archivePath : run.target;
}
function resolveBackupRunNamespace(run) {
	return run.kind === "archive" ? run.location?.namespace ?? run.namespace : void 0;
}
function boundedText(value, maxLength) {
	const trimmed = value?.trim();
	return trimmed ? truncateUtf16Safe(trimmed, maxLength) : void 0;
}
function isBytes(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function parseLocation(value) {
	const location = asOptionalRecord(value);
	if (!location) return;
	if (typeof location.name !== "string" || typeof location.provider !== "string" || typeof location.locationId !== "string" || typeof location.key !== "string" || typeof location.namespace !== "string" || !isBytes(location.plaintextBytes) || !isBytes(location.storedBytes)) return;
	return {
		name: location.name,
		provider: location.provider,
		locationId: location.locationId,
		key: location.key,
		namespace: location.namespace,
		plaintextBytes: location.plaintextBytes,
		storedBytes: location.storedBytes
	};
}
function parseRetention(value) {
	const retention = asOptionalRecord(value);
	if (!retention) return;
	return isBytes(retention.kept) && isBytes(retention.deleted) ? {
		kept: retention.kept,
		deleted: retention.deleted
	} : void 0;
}
/** One codec for the additive manifest fields; legacy rows need no migration. */
function parseBackupRun(row) {
	if (row.status !== "ok" && row.status !== "failed") return;
	const manifest = safeParseJsonRecord(row.manifest_json);
	if (!manifest || manifest.kind !== "archive" && manifest.kind !== "sqlite-snapshot" && manifest.kind !== "git" && manifest.kind !== "external") return;
	const location = parseLocation(manifest.location);
	const retention = parseRetention(manifest.retention);
	const namespace = location?.namespace ?? (typeof manifest.namespace === "string" ? manifest.namespace : void 0);
	return {
		id: row.id,
		createdAt: row.created_at,
		archivePath: row.archive_path,
		status: row.status,
		kind: manifest.kind,
		...typeof manifest.target === "string" ? { target: manifest.target } : {},
		...namespace === void 0 ? {} : { namespace },
		...typeof manifest.error === "string" ? { error: manifest.error } : {},
		...manifest.pushFailed === true ? { pushFailed: true } : {},
		...isBytes(manifest.bytes) ? { bytes: manifest.bytes } : {},
		...location ? { location } : {},
		...retention ? { retention } : {}
	};
}
function serializeBackupRunManifest(manifest) {
	return JSON.stringify({
		kind: manifest.kind,
		target: boundedText(manifest.target, 512),
		namespace: boundedText(resolveBackupRunNamespace(manifest), 128),
		error: boundedText(manifest.error, BACKUP_RUN_ERROR_MAX_LENGTH),
		...manifest.pushFailed ? { pushFailed: true } : {},
		...isBytes(manifest.bytes) ? { bytes: manifest.bytes } : {},
		...manifest.location ? { location: manifest.location } : {},
		...manifest.retention ? { retention: manifest.retention } : {}
	});
}
//#endregion
export { serializeBackupRunManifest as a, resolveBackupRunTarget as i, parseBackupRun as n, resolveBackupRunNamespace as r, BACKUP_RUN_ERROR_MAX_LENGTH as t };
