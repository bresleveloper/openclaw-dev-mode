import { r as enableNodeSqliteKyselyStatementCache } from "./kysely-sync-cache-state-eUau8Jaa.mjs";
import { r as resolveExistingSqliteFileUri, t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { i as setSqliteBusyTimeout, r as runWithSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import fs from "node:fs";
//#region src/infra/sqlite-existing-database.ts
/** Reuse only the handle, never a snapshot, validation result, or authority. */
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
	const reader = retained?.database ?? openNodeSqliteDatabase(pathname, { readOnly: true });
	if (retained && !retained.database) {
		enableNodeSqliteKyselyStatementCache(reader);
		retained.database = reader;
	}
	let writer;
	let snapshotOpen = false;
	const releaseReader = () => {
		if (!reader.isOpen) return;
		try {
			if (snapshotOpen && reader.isTransaction) {
				reader.exec("PRAGMA locking_mode = NORMAL");
				reader.exec("ROLLBACK");
			}
			snapshotOpen = false;
		} finally {
			if (!retained) reader.close();
		}
	};
	try {
		options.assertIdentity();
		setSqliteBusyTimeout(reader, options.busyTimeoutMs);
		if (retained) reader.exec("PRAGMA shrink_memory; PRAGMA writable_schema = RESET");
		reader.exec("PRAGMA locking_mode = EXCLUSIVE");
		reader.exec("BEGIN");
		snapshotOpen = true;
		if (retained) reader.prepare("PRAGMA schema_version").get();
		const mode = reader.prepare("PRAGMA journal_mode").get()?.journal_mode;
		if (![
			"delete",
			"truncate",
			"persist"
		].includes(String(mode))) throw new Error("Existing SQLite storage requires rollback journal mode.");
		reader.exec("PRAGMA locking_mode = NORMAL");
		options.validate(reader);
		options.assertIdentity();
		if (!options.write) return operation(reader, () => {
			throw new Error("Read-only SQLite observation cannot admit a writer.");
		});
		writer = openNodeSqliteDatabase(resolveExistingSqliteFileUri(pathname));
		options.assertIdentity();
		setSqliteBusyTimeout(writer, options.busyTimeoutMs);
		const database = writer;
		let admitted = false;
		return operation(database, (write, transactionOptions) => {
			if (admitted && !database.isTransaction) throw new Error("Existing SQLite write admission has already settled.");
			options.assertIdentity();
			return runWithSqliteBusyTimeout(database, 0, (restore) => runSqliteImmediateTransactionSync(database, () => {
				if (!admitted) {
					admitted = true;
					releaseReader();
				}
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
