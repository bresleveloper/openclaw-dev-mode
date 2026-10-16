import { r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { D as parseManagedHandoffLeasePayload } from "./gateway-state-owner-DmHycK5o.mjs";
import { n as assertManagedUpdateLeaseDatabaseIdentity, o as leaseQueries, r as assertSameManagedHandoffPath, t as assertManagedHandoffPath } from "./update-managed-service-handoff-database-BzJlW6Xp.mjs";
import { r as managedHandoffLeaseText, t as createManagedHandoffProcessIdentityReader } from "./update-managed-service-handoff-process-D9s51XJP.mjs";
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/update-managed-service-handoff-database-recovery.ts
/** Explicit cold repair of one installation's executor journal; normal readers never replay it. */
async function recoverManagedUpdateLeaseJournal(params) {
	const { existingIdentity, installKey } = params;
	if (path.resolve(installKey) !== installKey || installKey.includes("/.openclaw-update-child-")) throw new Error("Managed update journal recovery requires its original installation key.");
	assertManagedUpdateLeaseDatabaseIdentity(existingIdentity);
	const [{ acquireFileLock }, { prepareSqliteRollbackRecovery }] = await Promise.all([import("./file-lock-B0pM7dzJ.mjs"), import("./sqlite-rollback-recovery-kZYkei42.mjs")]);
	assertManagedUpdateLeaseDatabaseIdentity(existingIdentity);
	const lock = await acquireFileLock(existingIdentity.databasePath, {
		retries: {
			retries: 0,
			factor: 1,
			minTimeout: 0,
			maxTimeout: 0
		},
		stale: 3e4,
		staleRecovery: "remove-if-definitely-stale"
	});
	let active = true;
	try {
		const lockIdentity = fs.lstatSync(lock.lockPath, { bigint: true });
		assertManagedHandoffPath(lockIdentity, "file");
		const lockBytes = fs.readFileSync(lock.lockPath);
		const assertBootstrap = () => {
			if (!active) throw new Error("Managed update journal bootstrap authority has closed.");
			assertManagedUpdateLeaseDatabaseIdentity(existingIdentity);
			assertSameManagedHandoffPath(fs.lstatSync(lock.lockPath, { bigint: true }), lockIdentity, "file");
			if (!fs.readFileSync(lock.lockPath).equals(lockBytes)) throw new Error("Managed update journal bootstrap lock changed.");
		};
		assertBootstrap();
		const { processState } = createManagedHandoffProcessIdentityReader({ env: params.serviceManagerEnv });
		const assertDeadOwner = (rows) => {
			if (!rows.length) return;
			const row = rows[0];
			const payload = parseManagedHandoffLeasePayload(row.payload_json);
			if (rows.length !== 1 || row.install_root !== installKey || !managedHandoffLeaseText.safeParse(row.owner).success || !Number.isSafeInteger(row.updated_at) || row.updated_at < 0 || row.recovery_json !== null || !payload || payload.version !== 2 || payload.mutationOriginal || payload.action.kind !== "update" || payload.action.mutationProtocol !== "original-cancellation-v1" || payload.action.custody !== void 0 || !isDeepStrictEqual(payload.helper, payload.executor)) throw new Error("Managed update journal recovery refuses foreign or retained executor custody.");
			if (processState(payload.helper) !== "dead" || processState(payload.executor) !== "dead") throw new Error("Managed update journal recovery requires a definitely dead original executor.");
		};
		const read = (db) => {
			const objects = db.prepare("SELECT type, name FROM sqlite_schema WHERE name <> 'sqlite_autoindex_managed_update_handoffs_1'").all();
			const table = db.prepare("PRAGMA table_list('managed_update_handoffs')").all().find((entry) => entry.schema === "main");
			const columns = db.prepare("PRAGMA table_info('managed_update_handoffs')").all();
			const expectedColumns = [
				[
					"install_root",
					"TEXT",
					1,
					1
				],
				[
					"owner",
					"TEXT",
					1,
					0
				],
				[
					"payload_json",
					"TEXT",
					1,
					0
				],
				[
					"updated_at",
					"INTEGER",
					1,
					0
				],
				[
					"recovery_json",
					"TEXT",
					0,
					0
				]
			];
			if (objects.length !== 1 || objects[0]?.type !== "table" || objects[0]?.name !== "managed_update_handoffs" || table?.type !== "table" || table.strict !== 1 || table.wr !== 0 || table.ncol !== 5 || columns.length !== expectedColumns.length || columns.some((column, index) => {
				const expected = expectedColumns[index];
				return column.name !== expected[0] || column.type !== expected[1] || column.notnull !== expected[2] || column.pk !== expected[3] || column.dflt_value !== null;
			})) throw new Error("Managed update journal recovery refuses an unknown lease schema.");
			const sizes = executeSqliteQuerySync(db, leaseQueries(db).selectFrom("managed_update_handoffs").select((eb) => [
				eb.fn("length", [eb.cast("payload_json", "blob")]).as("payloadBytes"),
				eb.fn("length", [eb.cast("owner", "blob")]).as("ownerBytes"),
				eb.fn("length", [eb.cast("install_root", "blob")]).as("keyBytes"),
				eb.fn("length", [eb.cast("recovery_json", "blob")]).as("recoveryBytes")
			]).limit(2)).rows;
			if (sizes.length > 1 || sizes.some((size) => size.payloadBytes > 16384 || size.ownerBytes > 4096 || size.keyBytes > 4096 || size.recoveryBytes !== null)) throw new Error("Managed update journal recovery refuses foreign or retained executor custody.");
			const rows = executeSqliteQuerySync(db, leaseQueries(db).selectFrom("managed_update_handoffs").selectAll().limit(2)).rows;
			assertDeadOwner(rows);
			return rows;
		};
		const recovery = await prepareSqliteRollbackRecovery({
			path: existingIdentity.databasePath,
			scratchRoot: path.dirname(existingIdentity.databasePath),
			assertIdentity: assertBootstrap,
			assertFileSafe: (_file, stat) => assertManagedHandoffPath(stat, "file"),
			read
		});
		recovery.admit(() => {
			assertBootstrap();
			assertDeadOwner(recovery.record);
		});
	} finally {
		active = false;
		await lock.release();
	}
}
//#endregion
export { recoverManagedUpdateLeaseJournal };
