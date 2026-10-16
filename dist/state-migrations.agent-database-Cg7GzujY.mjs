import { u as createSqliteWalReclamationResult } from "./sqlite-wal-DUSYRhyv.mjs";
//#region src/infra/state-migrations.agent-database.ts
/** Adapt a migration-owned connection without transferring its WAL or close custody. */
function createMigrationDatabaseHandle(database, agentId, pathname) {
	return {
		agentId,
		db: database,
		path: pathname,
		walMaintenance: {
			checkpoint: () => false,
			stop: async () => {},
			close: () => false,
			reclaimFreePages: createSqliteWalReclamationResult
		}
	};
}
//#endregion
export { createMigrationDatabaseHandle as t };
