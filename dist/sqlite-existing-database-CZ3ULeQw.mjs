import { r as enableNodeSqliteKyselyStatementCache } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { i as setSqliteBusyTimeout, r as runWithSqliteBusyTimeout } from "./sqlite-busy-timeout-COlIRjFZ.mjs";
import { a as resolveExistingSqliteFileUri, r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import fs from "node:fs";
//#region src/infra/sqlite-existing-database.ts
/** Reuse an admitted handle; every operation still owns its read snapshot. */
function createExistingSqliteRollbackReader(pathname, options) {
	const retained = {};
	let disposed = false;
	const close = () => {
		const database = retained.database;
		retained.database = void 0;
		if (database?.isOpen) database.close();
	};
	return Object.assign((operation) => {
		if (disposed || retained.database?.isTransaction) throw new Error("Existing SQLite reader is closed or already in use.");
		try {
			return withExistingSqliteRollbackDatabase(pathname, {
				...options,
				write: false
			}, operation, retained);
		} catch (error) {
			close();
			throw error;
		}
	}, { [Symbol.dispose]() {
		disposed = true;
		close();
	} });
}
/** Keep a SQLite-owned read lock until the existing writer has acquired its lock. */
function withExistingSqliteRollbackDatabase(pathname, options, operation, retained) {
	options.assertIdentity();
	if (fs.statSync(pathname).size === 0) throw new Error("Existing SQLite storage is empty.");
	const existing = retained?.database;
	const reader = existing ?? openNodeSqliteDatabase(pathname, { readOnly: true });
	if (retained && !retained.database) {
		enableNodeSqliteKyselyStatementCache(reader);
		retained.database = reader;
	}
	let writer;
	let snapshotOpen = false;
	let normalLocking = false;
	const releaseReader = () => {
		if (!reader.isOpen) return;
		try {
			if (snapshotOpen && reader.isTransaction) {
				reader.exec("ROLLBACK");
				if (normalLocking) reader.exec("PRAGMA page_count");
			}
			snapshotOpen = false;
		} finally {
			if (!retained) reader.close();
		}
	};
	try {
		if (!existing) setSqliteBusyTimeout(reader, options.busyTimeoutMs);
		reader.exec("PRAGMA locking_mode = EXCLUSIVE");
		reader.exec("BEGIN");
		snapshotOpen = true;
		const mode = reader.prepare("PRAGMA journal_mode").get()?.journal_mode;
		if (![
			"delete",
			"truncate",
			"persist"
		].includes(String(mode))) throw new Error("Existing SQLite storage requires rollback journal mode.");
		reader.exec("PRAGMA locking_mode = NORMAL");
		normalLocking = true;
		if (!existing) options.validate?.(reader);
		if (!options.write) return operation(reader, () => {
			throw new Error("Read-only SQLite observation cannot admit a writer.");
		});
		writer = openNodeSqliteDatabase(resolveExistingSqliteFileUri(pathname));
		setSqliteBusyTimeout(writer, options.busyTimeoutMs);
		const database = writer;
		return operation(database, (write, transactionOptions) => {
			return runWithSqliteBusyTimeout(database, 0, (restore) => runSqliteImmediateTransactionSync(database, () => {
				if (snapshotOpen) releaseReader();
				restore();
				options.assertIdentity();
				return write();
			}, transactionOptions));
		});
	} finally {
		try {
			if (writer?.isOpen) writer.close();
		} finally {
			releaseReader();
		}
	}
}
//#endregion
export { withExistingSqliteRollbackDatabase as n, createExistingSqliteRollbackReader as t };
