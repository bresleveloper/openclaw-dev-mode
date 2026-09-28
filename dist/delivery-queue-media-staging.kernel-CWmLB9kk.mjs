import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { a as generateSecureUuid } from "./secure-random-BJtJxP9Y.mjs";
import { g as upsertDeliveryQueueEntryInDatabase, s as expireStagingAndLoadDeliveryQueueEntriesInDatabase } from "./delivery-queue-sqlite.kernel-Pf7zU9zY.mjs";
import { a as OUTBOUND_DELIVERY_QUEUE_NAME, n as LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME, o as OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME, r as OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME, t as DELIVERY_QUEUE_MEDIA_STAGING_QUEUE_NAME } from "./delivery-queue-namespaces-CO-cZrdV.mjs";
//#region src/infra/outbound/delivery-queue-media-staging.kernel.ts
function entryPayloads(entry) {
	if (Array.isArray(entry.payloads)) return entry.payloads;
	return (entry.preparedBatch?.entries ?? []).flatMap((prepared) => prepared.status === "accepted" && prepared.payload ? [prepared.payload] : []);
}
function createDeliveryQueueMediaRetentionInDatabase(database, artifacts, entryKind, prepared = {
	id: generateSecureUuid(),
	enqueuedAt: Date.now()
}) {
	const { id, enqueuedAt } = prepared;
	const entry = {
		id,
		enqueuedAt,
		retryCount: 0,
		artifacts: [...artifacts]
	};
	if (!upsertDeliveryQueueEntryInDatabase({
		queueName: "outbound-media-staging",
		entry,
		metadata: { entryKind },
		insertOnly: true
	}, database)) throw new Error(`Delivery queue media stage already exists: ${id}`);
	return id;
}
/**
* Atomically expire abandoned stages and return every artifact still owned by
* either a replayable outbound row or a producer that may still commit one.
*/
function loadDeliveryQueueMediaRetentionSnapshotInDatabase(database, params) {
	const snapshot = expireStagingAndLoadDeliveryQueueEntriesInDatabase(database, {
		queueNames: [
			OUTBOUND_DELIVERY_QUEUE_NAME,
			LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME,
			OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME,
			OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME
		],
		stagingQueueName: DELIVERY_QUEUE_MEDIA_STAGING_QUEUE_NAME,
		expireBeforeMs: params.expireBeforeMs
	});
	const { rows: migrationRows } = executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("migration_sources").select("report_json").where("migration_kind", "=", "delivery-queues").where("removed_source", "=", 0));
	const migrationMedia = migrationRows.flatMap((row) => {
		const report = asNullableRecord(JSON.parse(row.report_json));
		if (report?.mediaPreserved === true) return [];
		const paths = report?.mediaPaths;
		if (!Array.isArray(paths) || !paths.every((value) => typeof value === "string")) throw new Error("Cannot safely collect queue media with an invalid migration receipt");
		return paths;
	});
	return {
		payloads: snapshot.entries.map((entry) => entryPayloads(entry)),
		stagedArtifacts: snapshot.stagingEntries.flatMap((entry) => {
			const artifacts = entry.artifacts;
			return Array.isArray(artifacts) ? artifacts.filter((artifact) => typeof artifact === "string") : [];
		}).concat(migrationMedia)
	};
}
//#endregion
export { loadDeliveryQueueMediaRetentionSnapshotInDatabase as n, createDeliveryQueueMediaRetentionInDatabase as t };
