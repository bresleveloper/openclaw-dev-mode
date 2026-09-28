import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as readJsonIfExists } from "./json-files-C0HSMh2Z.mjs";
import { r as listApprovedPairedDeviceRoles } from "./device-pairing-identity-BnU9nqx2.mjs";
import { i as resolvePairingPaths, n as listLegacyPairingStoreFiles, t as coercePairingStateRecord } from "./pairing-files-BJQEMPCI.mjs";
import { p as withPairedDeviceRecords } from "./device-pairing-DbLfxuuq.mjs";
import { t as withLegacyMigrationStateLock } from "./state-migrations.lock-CC3fInLn.mjs";
import { n as preserveLegacyDesktopStreamOptOut } from "./device-pairing-node-desktop-migration-BGz89T5X.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/infra/device-pairing-migration.ts
const SQLITE_TEXT_FIELDS = [
	"displayName",
	"operatorLabel",
	"platform",
	"deviceFamily",
	"clientId",
	"clientMode",
	"browserOrigin",
	"role",
	"remoteIp",
	"approvedVia",
	"lastSeenReason"
];
function normalizeLegacyPairedDevice(record) {
	if (!isRecord(record)) return null;
	if (typeof record.publicKey !== "string" || !record.publicKey.trim() || !Number.isSafeInteger(record.createdAtMs) || !Number.isSafeInteger(record.approvedAtMs)) return null;
	const device = { ...record };
	let omittedFields = 0;
	if (device.lastSeenAtMs !== void 0 && !Number.isSafeInteger(device.lastSeenAtMs)) {
		delete device.lastSeenAtMs;
		omittedFields += 1;
	}
	for (const field of SQLITE_TEXT_FIELDS) if (device[field] !== void 0 && typeof device[field] !== "string") {
		delete device[field];
		omittedFields += 1;
	}
	return {
		device,
		omittedFields
	};
}
async function archiveLegacyFile$1(filePath) {
	try {
		await fs.rename(filePath, `${filePath}.migrated`);
	} catch {}
}
async function fileExists(filePath) {
	return await fs.access(filePath).then(() => true, () => false);
}
/**
* Import legacy devices/paired.json records into the SQLite pairing store,
* then archive the legacy files. Existing SQLite records win over legacy rows
* for the same device id. Idempotent: after the first run the files carry a
* `.migrated` suffix and the function returns null immediately. Throws on an
* unreadable paired.json so a failed import leaves the files for a retry
* instead of silently dropping approved pairings.
*/
async function migrateLegacyDevicePairingStore(params) {
	const { dir, pendingPath, pairedPath } = resolvePairingPaths(params?.baseDir, "devices");
	const bootstrapPath = path.join(dir, "bootstrap.json");
	const pairedRaw = await readJsonIfExists(pairedPath);
	const hasTransientFiles = await fileExists(pendingPath) || await fileExists(bootstrapPath);
	if (pairedRaw == null && !hasTransientFiles) return null;
	const legacyPaired = coercePairingStateRecord(pairedRaw);
	let imported = 0;
	let skippedExisting = 0;
	let skippedInvalid = 0;
	let omittedInvalidFields = 0;
	if (Object.keys(legacyPaired).length > 0) await withPairedDeviceRecords(params?.baseDir, (pairedByDeviceId) => {
		for (const [rawDeviceId, record] of Object.entries(legacyPaired)) {
			const deviceId = rawDeviceId.trim();
			if (!deviceId) {
				skippedInvalid += 1;
				continue;
			}
			if (pairedByDeviceId[deviceId]) {
				skippedExisting += 1;
				continue;
			}
			const normalized = normalizeLegacyPairedDevice(record);
			if (!normalized) {
				skippedInvalid += 1;
				continue;
			}
			omittedInvalidFields += normalized.omittedFields;
			const device = {
				...normalized.device,
				deviceId
			};
			preserveLegacyDesktopStreamOptOut(device, params?.cfg ?? {}, Date.now());
			pairedByDeviceId[deviceId] = device;
			imported += 1;
		}
		return {
			value: void 0,
			persist: imported > 0
		};
	});
	if (skippedInvalid > 0) params?.log?.warn(`device pairing store migration skipped ${skippedInvalid} invalid paired record(s)`);
	if (omittedInvalidFields > 0) params?.log?.warn(`device pairing store migration omitted ${omittedInvalidFields} invalid optional field(s)`);
	await Promise.all([
		archiveLegacyFile$1(pairedPath),
		archiveLegacyFile$1(pendingPath),
		archiveLegacyFile$1(bootstrapPath)
	]);
	const result = {
		imported,
		skippedExisting
	};
	params?.log?.info(`device pairing store migrated to SQLite: imported ${imported} paired device(s), kept ${skippedExisting} existing record(s)`);
	return result;
}
//#endregion
//#region src/infra/node-pairing-migration.ts
async function archiveLegacyFile(path) {
	try {
		await fs.rename(path, `${path}.migrated`);
	} catch {}
}
/**
* Fold legacy nodes/paired.json rows into device-record node surfaces, then
* archive the legacy files. Idempotent: after the first run the files carry a
* `.migrated` suffix and the function returns null immediately.
*/
async function migrateLegacyNodePairingStore(params) {
	const { pendingPath, pairedPath } = resolvePairingPaths(params?.baseDir, "nodes");
	const [pairedRaw, pendingRaw] = await Promise.all([readJsonIfExists(pairedPath), readJsonIfExists(pendingPath)]);
	if (pairedRaw == null && pendingRaw == null) return null;
	const legacyRows = coercePairingStateRecord(pairedRaw);
	let migrated = 0;
	let orphaned = 0;
	if (Object.keys(legacyRows).length > 0) await withPairedDeviceRecords(params?.baseDir, (pairedByDeviceId) => {
		const now = Date.now();
		for (const [rawNodeId, row] of Object.entries(legacyRows)) {
			const device = pairedByDeviceId[rawNodeId.trim()];
			if (!device || !listApprovedPairedDeviceRoles(device).includes("node")) {
				orphaned += 1;
				continue;
			}
			if (device.nodeSurface) continue;
			device.nodeSurface = {
				displayName: row.displayName,
				version: row.version,
				coreVersion: row.coreVersion,
				uiVersion: row.uiVersion,
				modelIdentifier: row.modelIdentifier,
				caps: Array.isArray(row.caps) ? row.caps : void 0,
				commands: Array.isArray(row.commands) ? row.commands : void 0,
				permissions: row.permissions,
				bins: Array.isArray(row.bins) ? row.bins : void 0,
				createdAtMs: typeof row.createdAtMs === "number" ? row.createdAtMs : now,
				approvedAtMs: typeof row.approvedAtMs === "number" ? row.approvedAtMs : now,
				lastConnectedAtMs: typeof row.lastConnectedAtMs === "number" ? row.lastConnectedAtMs : void 0
			};
			preserveLegacyDesktopStreamOptOut(device, params?.cfg ?? {}, now);
			migrated += 1;
		}
		return {
			value: void 0,
			persist: migrated > 0
		};
	});
	await Promise.all([archiveLegacyFile(pairedPath), archiveLegacyFile(pendingPath)]);
	const result = {
		migrated,
		orphaned
	};
	params?.log?.info(`node pairing store migrated: folded ${migrated} node surface(s) into device records, dropped ${orphaned} orphan row(s)`);
	return result;
}
//#endregion
//#region src/infra/state-migrations.pairing.ts
async function migrateDoctorPairingStores(params) {
	if ((await listLegacyPairingStoreFiles(params.stateDir)).length === 0) return {
		changes: [],
		warnings: []
	};
	return withLegacyMigrationStateLock({
		...params,
		label: "legacy pairing stores",
		releaseLabel: "Pairing store",
		run: async () => {
			const changes = [];
			const warnings = [];
			const log = {
				info: (message) => changes.push(message),
				warn: (message) => warnings.push(message)
			};
			await migrateLegacyDevicePairingStore({
				baseDir: params.stateDir,
				cfg: params.cfg,
				log
			});
			await migrateLegacyNodePairingStore({
				baseDir: params.stateDir,
				cfg: params.cfg,
				log
			});
			return {
				changes,
				warnings,
				warningDisposition: "recoverable"
			};
		}
	});
}
//#endregion
export { migrateDoctorPairingStores };
