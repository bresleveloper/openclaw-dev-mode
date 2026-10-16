import "./src-CdRlGRnW.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { a as tableHasColumn, n as ensureColumn } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { Fn as object, Jn as string, Nt as array, Pn as number } from "./schemas-BOYIvvln.mjs";
import { r as LEGACY_ACP_MIGRATION_COLUMN_DEFINITION } from "./openclaw-agent-db-additive-columns-DEY4xthY.mjs";
import { i as readLegacyMigrationReceiptFromDatabase, l as resolveLegacyMigrationSourceKey, o as recordLegacyMigrationReceipt } from "./state-migrations.receipts-gEcgM3Aq.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { o as readExactSessionEntryRowValidated } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import path from "node:path";
import { createHash } from "node:crypto";
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
		meta: params.meta
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
function retainLegacyAcpMigrationSourcesForEntry(database, sessionKey, entry) {
	const sources = readSources(database, sessionKey);
	const retained = sources.filter((source) => legacyAcpMigrationBindingMatches(source, entry));
	if (retained.length !== sources.length) writeSources(database, sessionKey, retained);
}
function copyLegacyAcpMigrationSourcesForRepair(source, destination, sourceKeys, canonicalKey) {
	recordLegacyAcpMigrationSources(destination.db, canonicalKey, sourceKeys.flatMap((key) => readSources(source.db, key)));
}
//#endregion
export { retainLegacyAcpMigrationSourcesForEntry as a, legacyAcpMigrationBindingMatches as c, recordLegacyAcpMigrationCompletion as d, recordLegacyAcpMigrationSources as i, legacyAcpMigrationSourceKey as l, readLegacyAcpMigrationContext as n, hasLegacyAcpMigrationProvenanceColumn as o, readLegacyAcpMigrationContextInDatabase as r, hasLegacyAcpMigrationCompletion as s, copyLegacyAcpMigrationSourcesForRepair as t, prepareLegacyAcpMigrationSource as u };
