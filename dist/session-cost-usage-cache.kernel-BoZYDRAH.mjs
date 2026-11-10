import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { U as withSqliteDatabaseWriteScope } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { i as executeSqliteQuerySync, m as expressionBuilder, o as getNodeSqliteKysely, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { t as resolveZstdCodec } from "./zstd-codec-C-vEb3Qf.mjs";
import { a as encodeUsageCostRollup, i as decodeUsageCostRollupEnvelope, t as USAGE_COST_ROLLUP_SCOPE } from "./session-cost-usage-rollup-codec-BkTlisOD.mjs";
import { t as chunkItems } from "./chunk-items-2QWieLm-.mjs";
import { a as createSessionUsageRollupData, o as mergeSessionUsageRollupBucket } from "./session-cost-usage-rollup-EJwp1CTx.mjs";
import { isMainThread } from "node:worker_threads";
//#region src/infra/session-cost-usage-partitions.ts
const USAGE_COST_PARTITION_SCOPE = "session-cost-usage-projection-v1";
const USAGE_COST_QUARTER_MS = 9e5;
const codec = resolveZstdCodec();
function usageCostPartitionKey(sessionFile, date) {
	return `${sessionFile}\0${date}`;
}
function encodeUsageCostPartition(date, rollup) {
	const raw = Buffer.from(JSON.stringify(rollup));
	const compressed = raw.byteLength >= 1024 ? codec?.compress(raw, 1) : void 0;
	const useCompressed = compressed !== void 0 && compressed.byteLength < raw.byteLength;
	return {
		date,
		valueJson: JSON.stringify({
			encoding: useCompressed ? "zstd" : "identity",
			bytes: raw.byteLength,
			sha256: sha256Hex(raw)
		}),
		blob: Uint8Array.from(useCompressed ? compressed : raw)
	};
}
function decodeUsageCostPartition(valueJson, blob, budget) {
	if (!blob) return;
	try {
		const metadata = JSON.parse(valueJson);
		if (!isRecord(metadata) || metadata.encoding !== "identity" && metadata.encoding !== "zstd" || typeof metadata.bytes !== "number" || !Number.isSafeInteger(metadata.bytes) || metadata.bytes <= 0 || (metadata.encoding === "identity" ? metadata.bytes !== blob.byteLength : metadata.bytes <= blob.byteLength) || typeof metadata.sha256 !== "string") return;
		if (budget) {
			if (metadata.bytes > budget.remainingBytes) return null;
			budget.remainingBytes -= metadata.bytes;
		}
		const raw = metadata.encoding === "zstd" ? codec?.decompress(blob, metadata.bytes) : Buffer.from(blob.buffer, blob.byteOffset, blob.byteLength);
		if (!raw || raw.byteLength !== metadata.bytes || sha256Hex(raw) !== metadata.sha256) return;
		const value = JSON.parse(raw.toString("utf8"));
		if (!isRecord(value) || !isRecord(value.buckets) || !isRecord(value.untimestamped)) return;
		return value;
	} catch {
		return;
	}
}
function partitionUsageCostRollup(entry) {
	const months = /* @__PURE__ */ new Map();
	const buckets = Object.values(entry.rollup.buckets).toSorted((left, right) => left.timestampMs - right.timestampMs);
	for (const bucket of buckets) {
		const quarter = Math.floor(bucket.timestampMs / USAGE_COST_QUARTER_MS) * USAGE_COST_QUARTER_MS;
		const date = `${new Date(quarter).toISOString().slice(0, 7)}-01`;
		let month = months.get(date);
		if (!month) {
			month = createSessionUsageRollupData();
			months.set(date, month);
		}
		const current = month.buckets[String(quarter)];
		if (current) mergeSessionUsageRollupBucket(current, bucket);
		else month.buckets[String(quarter)] = {
			...structuredClone(bucket),
			timestampMs: quarter,
			firstTimestampMs: bucket.firstTimestampMs ?? bucket.timestampMs,
			lastTimestampMs: bucket.lastTimestampMs ?? bucket.timestampMs
		};
	}
	const checkpoint = {
		...entry,
		rollup: {
			...createSessionUsageRollupData(),
			lastUserTimestamp: entry.rollup.lastUserTimestamp,
			untimestamped: entry.rollup.untimestamped
		}
	};
	const encoded = encodeUsageCostRollup(checkpoint);
	const envelope = JSON.parse(encoded.valueJson);
	envelope.projection = {
		version: 2,
		dates: [...months.keys()],
		canonicalNumbers: false
	};
	return {
		valueJson: JSON.stringify(envelope),
		blob: encoded.blob,
		partitions: [...months].map(([date, rollup]) => encodeUsageCostPartition(date, rollup))
	};
}
//#endregion
//#region src/infra/session-cost-usage-partitions.worker.ts
function assertUsagePartitionWorker() {
	if (isMainThread) throw new Error("Usage partitions require the owning database worker");
}
function writeSessionCostUsagePartitionsInDatabase(db, params) {
	assertUsagePartitionWorker();
	const kysely = getNodeSqliteKysely(db);
	if (params.replacePartitions) executeSqliteQuerySync(db, kysely.deleteFrom("cache_entries").where("scope", "=", USAGE_COST_PARTITION_SCOPE).where("key", ">=", `${params.rollupId}\0`).where("key", "<", `${params.rollupId}\u0001`));
	for (const date of params.removedDates ?? []) executeSqliteQuerySync(db, kysely.deleteFrom("cache_entries").where("scope", "=", USAGE_COST_PARTITION_SCOPE).where("key", "=", usageCostPartitionKey(params.rollupId, date)));
	for (const partitions of chunkItems(params.partitions ?? [], 100)) executeSqliteQuerySync(db, kysely.insertInto("cache_entries").values(partitions.map((partition) => ({
		scope: USAGE_COST_PARTITION_SCOPE,
		key: usageCostPartitionKey(params.rollupId, partition.date),
		value_json: partition.valueJson,
		blob: partition.blob,
		expires_at: null,
		updated_at: params.updatedAt
	}))).onConflict((conflict) => conflict.columns(["scope", "key"]).doUpdateSet((eb) => ({
		value_json: eb.ref("excluded.value_json"),
		blob: eb.ref("excluded.blob"),
		expires_at: eb.ref("excluded.expires_at"),
		updated_at: eb.ref("excluded.updated_at")
	}))));
}
function readSessionCostUsagePartitionsInDatabase(db, filePaths, startMs = Number.NEGATIVE_INFINITY, endMs = Number.POSITIVE_INFINITY, throwIfCancelled, budget) {
	assertUsagePartitionWorker();
	const start = Number.isFinite(startMs) ? `${new Date(startMs).toISOString().slice(0, 7)}-01` : "";
	const end = Number.isFinite(endMs) ? `${new Date(endMs).toISOString().slice(0, 7)}-01` : "￿";
	const byPath = /* @__PURE__ */ new Map();
	const invalidPaths = /* @__PURE__ */ new Set();
	const kysely = getNodeSqliteKysely(db);
	for (const paths of chunkItems([...new Set(filePaths)], 100)) {
		throwIfCancelled?.();
		const query = kysely.selectFrom("cache_entries").select("key").select((eb) => [
			(budget ? eb.case().when(eb.fn("length", [eb.cast("value_json", "blob")]), "<=", 65536).then(eb.ref("value_json")).else(null).end() : eb.ref("value_json")).as("value_json"),
			(budget ? eb.case().when(eb.fn("length", ["blob"]), "<=", Math.min(1048576, budget.remainingBytes)).then(eb.ref("blob")).else(null).end() : eb.ref("blob")).as("blob"),
			eb.fn("length", [eb.cast("value_json", "blob")]).as("header_bytes"),
			eb.fn("length", ["blob"]).as("body_bytes")
		]).where((eb) => eb.or(paths.map((filePath) => eb.and([
			eb("scope", "=", USAGE_COST_PARTITION_SCOPE),
			eb("key", ">=", usageCostPartitionKey(filePath, start)),
			eb("key", "<=", usageCostPartitionKey(filePath, end))
		])))).orderBy("key", "asc");
		for (const row of iterateSqliteQuerySync(db, query)) {
			throwIfCancelled?.();
			const separator = row.key.lastIndexOf("\0");
			const filePath = row.key.slice(0, separator);
			if (invalidPaths.has(filePath)) continue;
			if (row.header_bytes === null || row.header_bytes > 65536) {
				invalidPaths.add(filePath);
				budget?.deferredPaths.delete(filePath);
				byPath.delete(filePath);
				continue;
			}
			const bytes = 2 * (row.value_json?.length ?? 0) + (row.blob?.byteLength ?? 0);
			if (budget && (row.body_bytes > 0 && row.blob === null || bytes > budget.remainingBytes)) {
				budget.deferredPaths.add(filePath);
				byPath.delete(filePath);
				continue;
			}
			if (row.value_json === null || row.blob === null || budget?.deferredPaths.has(filePath)) continue;
			if (budget) budget.remainingBytes -= bytes;
			const partitions = byPath.get(filePath) ?? [];
			partitions.push({
				date: row.key.slice(separator + 1),
				valueJson: row.value_json,
				blob: row.blob
			});
			byPath.set(filePath, partitions);
		}
	}
	return byPath;
}
function readSessionCostUsageRollupWithPartitionsInDatabase(db, snapshot) {
	assertUsagePartitionWorker();
	const rows = executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("cache_entries").select([
		"scope",
		"key",
		"value_json",
		"blob"
	]).where((eb) => eb.or([eb.and([
		eb("scope", "=", USAGE_COST_ROLLUP_SCOPE),
		eb("key", "=", snapshot.key),
		eb("updated_at", "=", snapshot.updatedAt),
		eb("value_json", "=", snapshot.valueJson)
	]), eb.and([
		eb("scope", "=", USAGE_COST_PARTITION_SCOPE),
		eb("key", ">=", `${snapshot.key}\0`),
		eb("key", "<", `${snapshot.key}\u0001`)
	])])).orderBy("key", "asc")).rows;
	const body = rows.find((row) => row.scope === USAGE_COST_ROLLUP_SCOPE);
	if (!body) return;
	return {
		blob: body.blob,
		partitions: rows.flatMap((row) => row.scope === "session-cost-usage-projection-v1" && row.value_json !== null && row.blob !== null ? [{
			date: row.key.slice(snapshot.key.length + 1),
			valueJson: row.value_json,
			blob: row.blob
		}] : [])
	};
}
function pruneSessionCostUsagePartitionsInDatabase(db, existing) {
	assertUsagePartitionWorker();
	const kysely = getNodeSqliteKysely(db);
	const expression = expressionBuilder();
	for (const row of existing) {
		const value = typeof row.valueJson === "string" ? row.valueJson : expression.cast(expression.val(row.valueJson), "text");
		if (executeSqliteQuerySync(db, kysely.selectFrom("cache_entries").select("key").where("scope", "=", "session-cost-usage-rollup-v3").where("key", "=", row.key).where("value_json", "=", value).where("updated_at", "=", row.updatedAt)).rows[0]) executeSqliteQuerySync(db, kysely.deleteFrom("cache_entries").where("scope", "=", USAGE_COST_PARTITION_SCOPE).where("key", ">=", `${row.key}\0`).where("key", "<", `${row.key}\u0001`));
	}
}
//#endregion
//#region src/infra/session-cost-usage-cache.kernel.ts
const LEGACY_CACHE_SCOPE = "session-cost-usage";
const LEGACY_CACHE_KEY = "cache";
const RETIRED_ROLLUP_SCOPES = ["session-cost-usage-rollup-v1", "session-cost-usage-rollup-v2"];
const ROLLUP_PRUNE_BATCH_SIZE = 32;
const cacheExpressions = expressionBuilder();
function cacheJsonText(value) {
	return typeof value === "string" ? value : cacheExpressions.cast(cacheExpressions.val(value), "text");
}
function readSessionCostUsageRollupRowsInDatabase(db, filePaths, options) {
	const kysely = getNodeSqliteKysely(db);
	const batches = filePaths ? chunkItems([...new Set(filePaths)], 500) : [void 0];
	const result = [];
	for (const keys of batches) {
		options?.throwIfCancelled?.();
		const budget = options?.budget;
		const query = kysely.selectFrom("cache_entries").select(["key", "updated_at"]).select((eb) => [
			(budget ? eb.case().when(eb.fn("length", [eb.cast("value_json", "blob")]), "<=", 65536).then(eb.ref("value_json")).else(null).end() : eb.ref("value_json")).as("value_json"),
			(options?.includeBody ? budget ? eb.case().when(eb.fn("length", ["blob"]), "<=", Math.min(1048576, budget.remainingBytes)).then(eb.ref("blob")).else(null).end() : eb.ref("blob") : eb.val(null)).as("blob"),
			eb.fn("coalesce", [eb.fn("length", ["blob"]), eb.val(0)]).as("body_bytes"),
			eb.fn("length", [eb.cast("value_json", "blob")]).as("header_bytes")
		]).where("scope", "=", USAGE_COST_ROLLUP_SCOPE);
		for (const row of iterateSqliteQuerySync(db, keys ? query.where("key", "in", keys) : query)) {
			options?.throwIfCancelled?.();
			const headerBytes = 2 * (row.value_json?.length ?? 0);
			const bytes = headerBytes + row.body_bytes;
			const deferred = budget && (row.header_bytes > 65536 || row.body_bytes > 0 && row.blob === null || bytes > budget.remainingBytes);
			if (deferred) {
				const envelope = row.value_json ? decodeUsageCostRollupEnvelope(row.value_json, budget.pricingFingerprint) : void 0;
				const invalidBody = envelope && envelope.body.storedBytes !== row.body_bytes;
				if (!invalidBody) budget.deferredPaths.add(row.key);
				if (row.value_json === null || headerBytes > budget.remainingBytes) {
					if (!invalidBody && envelope && budget.deferredMetadata.size < budget.metadataLimit) {
						const source = envelope.checkpoint;
						const checkpoint = source.kind === "jsonl" ? {
							kind: source.kind,
							observedSize: source.observedSize,
							observedMtimeMs: source.observedMtimeMs,
							device: source.device,
							inode: source.inode
						} : {
							kind: source.kind,
							maxSeq: source.maxSeq,
							eventCount: source.eventCount,
							size: source.size,
							mtimeMs: source.mtimeMs
						};
						if (Object.entries(checkpoint).every(([key, value]) => key === "kind" || typeof value === "number" && Number.isFinite(value)) && Number.isFinite(envelope.scannedAt)) budget.deferredMetadata.set(row.key, {
							checkpoint,
							scannedAt: envelope.scannedAt
						});
					}
					continue;
				}
				budget.remainingBytes -= headerBytes;
			} else if (budget) budget.remainingBytes -= bytes;
			if (row.value_json !== null) result.push({
				key: row.key,
				valueJson: row.value_json,
				updatedAt: row.updated_at,
				bodyBytes: row.body_bytes,
				...options?.includeBody ? { blob: deferred ? null : row.blob } : {}
			});
		}
	}
	return result;
}
function writeSessionCostUsageRollupInDatabase(db, params) {
	return withSqliteDatabaseWriteScope(db, [USAGE_COST_ROLLUP_SCOPE], () => {
		const kysely = getNodeSqliteKysely(db);
		const values = {
			value_json: cacheJsonText(params.valueJson),
			blob: params.blob,
			expires_at: null,
			updated_at: params.updatedAt
		};
		executeSqliteQuerySync(db, kysely.insertInto("cache_entries").values({
			scope: USAGE_COST_ROLLUP_SCOPE,
			key: params.rollupId,
			...values
		}).onConflict((conflict) => conflict.columns(["scope", "key"]).doUpdateSet(values)));
		if (params.partitions || params.removedDates || params.replacePartitions) writeSessionCostUsagePartitionsInDatabase(db, params);
		return true;
	});
}
/** Read one body only while its exact metadata snapshot still owns the row. */
function readSessionCostUsageRollupBodyInDatabase(db, row) {
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("cache_entries").select("blob").where("scope", "=", USAGE_COST_ROLLUP_SCOPE).where("key", "=", row.key).where("updated_at", "=", row.updatedAt).where("value_json", "=", cacheJsonText(row.valueJson))).rows[0];
}
function pruneSessionCostUsageRollupsInDatabase(db, existing) {
	return withSqliteDatabaseWriteScope(db, [USAGE_COST_ROLLUP_SCOPE], () => {
		const kysely = getNodeSqliteKysely(db);
		if (existing.length > 0) pruneSessionCostUsagePartitionsInDatabase(db, existing);
		for (const batch of chunkItems(existing, ROLLUP_PRUNE_BATCH_SIZE)) executeSqliteQuerySync(db, kysely.deleteFrom("cache_entries").where("scope", "=", USAGE_COST_ROLLUP_SCOPE).where("key", "in", batch.map((row) => row.key)).where((eb) => eb.or(batch.map((row) => eb.and([
			eb("key", "=", row.key),
			eb("value_json", "=", cacheJsonText(row.valueJson)),
			eb("updated_at", "=", row.updatedAt)
		])))));
		executeSqliteQuerySync(db, kysely.deleteFrom("cache_entries").where("scope", "=", LEGACY_CACHE_SCOPE).where("key", "=", LEGACY_CACHE_KEY));
		executeSqliteQuerySync(db, kysely.deleteFrom("cache_entries").where("scope", "in", RETIRED_ROLLUP_SCOPES));
	});
}
//#endregion
export { readSessionCostUsagePartitionsInDatabase as a, decodeUsageCostPartition as c, writeSessionCostUsageRollupInDatabase as i, partitionUsageCostRollup as l, readSessionCostUsageRollupBodyInDatabase as n, readSessionCostUsageRollupWithPartitionsInDatabase as o, readSessionCostUsageRollupRowsInDatabase as r, USAGE_COST_QUARTER_MS as s, pruneSessionCostUsageRollupsInDatabase as t };
