import { _ as executeSqliteQueryTakeFirstSync, g as executeSqliteQuerySync, i as openOpenClawStateDatabase, l as resolveOpenClawStateSqlitePath, o as runOpenClawStateWriteTransaction, v as getNodeSqliteKysely } from "./openclaw-state-db-CIiPwqG3.js";
import { existsSync } from "node:fs";
//#region src/plugins/official-external-plugin-catalog-snapshot-store.ts
/** Persists hosted official external plugin catalog snapshots in OpenClaw state. */
function resolveStoreEnv(options) {
	if (!options.stateDir) return options.env;
	return {
		...options.env ?? process.env,
		OPENCLAW_STATE_DIR: options.stateDir
	};
}
function resolveStateDatabaseOptions(options) {
	const env = resolveStoreEnv(options);
	return {
		...env ? { env } : {},
		...options.stateDatabasePath ? { path: options.stateDatabasePath } : {}
	};
}
function resolveStateDatabasePath(options) {
	if (options.stateDatabasePath) return options.stateDatabasePath;
	return resolveOpenClawStateSqlitePath(resolveStoreEnv(options) ?? process.env);
}
function rowToSnapshot(row) {
	if (!row) return null;
	const metadata = {
		url: row.feed_url,
		status: Number(row.status),
		checksum: row.checksum,
		...row.etag ? { etag: row.etag } : {},
		...row.last_modified ? { lastModified: row.last_modified } : {}
	};
	return {
		body: row.body,
		metadata,
		savedAt: row.saved_at
	};
}
/** Creates a snapshot store backed by the shared `state/openclaw.sqlite` database. */
function createSqliteHostedOfficialExternalPluginCatalogSnapshotStore(options = {}) {
	return {
		async read(url) {
			if (!existsSync(resolveStateDatabasePath(options))) return null;
			const database = openOpenClawStateDatabase(resolveStateDatabaseOptions(options));
			const stateDb = getNodeSqliteKysely(database.db);
			return rowToSnapshot(executeSqliteQueryTakeFirstSync(database.db, stateDb.selectFrom("official_external_plugin_catalog_snapshots").select([
				"feed_url",
				"body",
				"status",
				"etag",
				"last_modified",
				"checksum",
				"saved_at"
			]).where("feed_url", "=", url)));
		},
		async write(snapshot) {
			const now = Date.now();
			runOpenClawStateWriteTransaction((database) => {
				const stateDb = getNodeSqliteKysely(database.db);
				executeSqliteQuerySync(database.db, stateDb.insertInto("official_external_plugin_catalog_snapshots").values({
					feed_url: snapshot.metadata.url,
					body: snapshot.body,
					status: snapshot.metadata.status,
					etag: snapshot.metadata.etag ?? null,
					last_modified: snapshot.metadata.lastModified ?? null,
					checksum: snapshot.metadata.checksum,
					saved_at: snapshot.savedAt,
					updated_at_ms: now
				}).onConflict((conflict) => conflict.column("feed_url").doUpdateSet({
					body: snapshot.body,
					status: snapshot.metadata.status,
					etag: snapshot.metadata.etag ?? null,
					last_modified: snapshot.metadata.lastModified ?? null,
					checksum: snapshot.metadata.checksum,
					saved_at: snapshot.savedAt,
					updated_at_ms: now
				})));
			}, resolveStateDatabaseOptions(options));
		}
	};
}
//#endregion
export { createSqliteHostedOfficialExternalPluginCatalogSnapshotStore };
