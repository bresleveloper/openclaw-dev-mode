import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { M as resolveDatabasePath, f as detectOpenClawStateDatabaseSchemaMigrationsFromDatabase } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { s as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { existsSync } from "node:fs";
//#region src/state/openclaw-state-db-schema-discovery.ts
function detectOpenClawStateDatabaseSchemaMigrations(options = {}, behavior = {}) {
	const pathname = resolveDatabasePath(options);
	if (!existsSync(pathname)) return [];
	if (behavior.artifactPreservingReadOnly) return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => detectOpenClawStateDatabaseSchemaMigrationsFromDatabase(db, pathname), {
		...options,
		path: pathname
	}) ?? [];
	const db = openNodeSqliteDatabase(pathname, { readOnly: true });
	try {
		return detectOpenClawStateDatabaseSchemaMigrationsFromDatabase(db, pathname);
	} finally {
		db.close();
	}
}
//#endregion
export { detectOpenClawStateDatabaseSchemaMigrations as t };
