import "./src-Djeo9OvP.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { Fn as object, Jn as string, Nt as array, Pn as number } from "./schemas-BOYIvvln.mjs";
import { Y as LEGACY_ACP_MIGRATION_COLUMN_DEFINITION } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-22SfWsLt.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { n as ensureColumn, o as tableHasColumn } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { a as recordLegacyMigrationReceipt, c as resolveLegacyMigrationSourceKey, i as readLegacyMigrationReceiptFromDatabase } from "./state-migrations.receipts-CikBNdPu.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { s as readExactSessionEntryRowValidated } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { createHash } from "node:crypto";
import path from "node:path";
//#region src/infra/legacy-acp-migration-source.ts
const RECEIPT_KIND = "deferred-plugin-acp-metadata";
const legacyAcpMigrationSourceSchema = object({
	sourcePath: string(),
	sourceSessionKey: string(),
	sessionId: string().optional(),
	lifecycleRevision: string().optional(),
	sourceSha256: string().regex(/^[0-9a-f]{64}$/),
	sourceSizeBytes: number().int().nonnegative()
});
function sourceBinding(source) {
	return {
		sessionKey: source.sourceSessionKey.trim(),
		sessionBinding: source.lifecycleRevision ?? source.sessionId ?? null
	};
}
function legacyAcpMigrationSourceKey(source) {
	return resolveLegacyMigrationSourceKey(RECEIPT_KIND, source.sourcePath, stableStringify(sourceBinding(source)));
}
function prepareLegacyAcpMigrationSource(params) {
	const serialized = stableStringify({
		...sourceBinding(params),
		meta: params.meta,
		...params.sourceEntry ? { sourceEntry: params.sourceEntry } : {}
	});
	return {
		sourcePath: path.resolve(params.sourcePath),
		sourceSessionKey: params.sourceSessionKey.trim(),
		...params.sessionId !== void 0 ? { sessionId: params.sessionId } : {},
		...params.lifecycleRevision !== void 0 ? { lifecycleRevision: params.lifecycleRevision } : {},
		sourceSha256: createHash("sha256").update(serialized).digest("hex"),
		sourceSizeBytes: Buffer.byteLength(serialized)
	};
}
function legacyAcpMigrationBindingMatches(source, entry) {
	return entry !== void 0 && entry.lifecycleRevision === source.lifecycleRevision && (source.lifecycleRevision !== void 0 || entry.sessionId === source.sessionId);
}
function hasLegacyAcpMigrationCompletion(database, source) {
	const receipt = readLegacyMigrationReceiptFromDatabase(database, legacyAcpMigrationSourceKey(source));
	if (!receipt) return false;
	if (receipt.sourceSha256 !== source.sourceSha256) throw new Error(`Retained ACP metadata changed after import in ${source.sourcePath}; resolve the source conflict before rerunning Doctor. Canonical metadata was not replayed.`);
	return true;
}
/** Canonical supersession and legacy import consume the same source component. */
function recordLegacyAcpMigrationCompletion(database, source, now) {
	if (hasLegacyAcpMigrationCompletion(database, source)) return;
	const sourceKey = legacyAcpMigrationSourceKey(source);
	recordLegacyMigrationReceipt(database, {
		sourceKey,
		migrationKind: RECEIPT_KIND,
		sourcePath: source.sourcePath,
		targetTable: "acp_sessions",
		sourceSha256: source.sourceSha256,
		sourceSizeBytes: source.sourceSizeBytes,
		sourceRecordCount: 1,
		runId: sourceKey,
		reportJson: "{}",
		now
	});
}
//#endregion
//#region src/state/openclaw-agent-legacy-acp-schema.ts
const provenanceSchemas = /* @__PURE__ */ new WeakSet();
function hasLegacyAcpMigrationProvenanceColumn(database) {
	if (provenanceSchemas.has(database)) return true;
	const { columnName, tableName } = LEGACY_ACP_MIGRATION_COLUMN_DEFINITION;
	const exists = tableHasColumn(database, tableName, columnName);
	if (exists && !database.isTransaction) provenanceSchemas.add(database);
	return exists;
}
function ensureLegacyAcpMigrationProvenanceColumn(database) {
	if (provenanceSchemas.has(database)) return;
	const { columnName, dataType, tableName } = LEGACY_ACP_MIGRATION_COLUMN_DEFINITION;
	if (!hasLegacyAcpMigrationProvenanceColumn(database) && !ensureColumn(database, tableName, `${columnName} ${dataType}`)) return;
	const rememberSchema = () => provenanceSchemas.add(database);
	if (database.isTransaction) deferSqlitePostCommitPublication(database, rememberSchema);
	else rememberSchema();
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-acp-provenance.ts
const sourcesSchema = array(legacyAcpMigrationSourceSchema);
function readSources(database, sessionKey) {
	if (!hasLegacyAcpMigrationProvenanceColumn(database)) return [];
	const row = executeSqliteQueryTakeFirstSync(database, getSessionKysely(database).selectFrom("session_nodes").select("legacy_acp_migration_json").where("session_key", "=", sessionKey));
	return row?.legacy_acp_migration_json ? sourcesSchema.parse(JSON.parse(row.legacy_acp_migration_json)) : [];
}
function readLegacyAcpMigrationContextInDatabase(database, sessionKey) {
	const selected = readExactSessionEntryRowValidated(database, sessionKey);
	return {
		entry: selected?.entry,
		sources: selected?.row.legacy_acp_migration_json ? sourcesSchema.parse(JSON.parse(selected.row.legacy_acp_migration_json)) : []
	};
}
/** Native ACP maintenance and offline import; runtime reads use the source worker. */
function readLegacyAcpMigrationContext(scope) {
	const resolved = resolveSqliteScope(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => readLegacyAcpMigrationContextInDatabase(database, resolved.sessionKey), toDatabaseOptions(resolved));
	return result.found ? result.value : {
		entry: void 0,
		sources: []
	};
}
function writeSources(database, sessionKey, sources) {
	ensureLegacyAcpMigrationProvenanceColumn(database);
	executeSqliteQuerySync(database, getSessionKysely(database).updateTable("session_nodes").set({ legacy_acp_migration_json: sources.length ? JSON.stringify(sources) : null }).where("session_key", "=", sessionKey));
}
/** Repair retries may carry the same source again, but cannot restamp its consumed identity. */
function recordLegacyAcpMigrationSources(database, sessionKey, sources) {
	if (!sources.length) return;
	const merged = new Map(readSources(database, sessionKey).map((source) => [legacyAcpMigrationSourceKey(source), source]));
	for (const source of sources) {
		const key = legacyAcpMigrationSourceKey(source);
		const existing = merged.get(key);
		if (existing && existing.sourceSha256 !== source.sourceSha256) throw new Error("Retained ACP source provenance changed during session import.");
		if (!existing) merged.set(key, source);
	}
	writeSources(database, sessionKey, [...merged.values()]);
}
/** The entry writer persists this projection together with its new lifecycle. */
function retainLegacyAcpMigrationSourcesJson(value, entry) {
	if (!value) return null;
	const sources = sourcesSchema.parse(JSON.parse(value));
	const retained = sources.filter((source) => legacyAcpMigrationBindingMatches(source, entry));
	return retained.length === sources.length ? value : retained.length ? JSON.stringify(retained) : null;
}
function prepareLegacyAcpMigrationSourcesForEntryWrite(database, sessionKey, entry, previousEntry, previousRow) {
	if (!previousEntry || previousEntry.sessionId === entry.sessionId && previousEntry.lifecycleRevision === entry.lifecycleRevision || !hasLegacyAcpMigrationProvenanceColumn(database.db)) return {};
	return { legacy_acp_migration_json: retainLegacyAcpMigrationSourcesJson(previousRow && "legacy_acp_migration_json" in previousRow ? previousRow.legacy_acp_migration_json : executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("session_nodes").select("legacy_acp_migration_json").where("session_key", "=", sessionKey))?.legacy_acp_migration_json, entry) };
}
function copyLegacyAcpMigrationSourcesForRepair(source, destination, sourceKeys, canonicalKey) {
	recordLegacyAcpMigrationSources(destination.db, canonicalKey, sourceKeys.flatMap((key) => readSources(source.db, key)));
}
//#endregion
export { recordLegacyAcpMigrationSources as a, legacyAcpMigrationBindingMatches as c, recordLegacyAcpMigrationCompletion as d, readLegacyAcpMigrationContextInDatabase as i, legacyAcpMigrationSourceKey as l, prepareLegacyAcpMigrationSourcesForEntryWrite as n, hasLegacyAcpMigrationProvenanceColumn as o, readLegacyAcpMigrationContext as r, hasLegacyAcpMigrationCompletion as s, copyLegacyAcpMigrationSourcesForRepair as t, prepareLegacyAcpMigrationSource as u };
