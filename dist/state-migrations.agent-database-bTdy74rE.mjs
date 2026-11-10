import { t as admitSqliteSchema } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { s as createSqliteWalReclamationResult } from "./sqlite-wal-D2XTertL.mjs";
//#region src/infra/state-migrations.agent-database.ts
/** Adapt a migration-owned connection without transferring its WAL or close custody. */
function createMigrationDatabaseHandle(database, agentId, pathname) {
	admitSqliteSchema(database);
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
