import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { i as hasRegisteredSecretValuesForRedaction, o as redactRegisteredSecretValues } from "./secret-redaction-registry-CKxLTepq.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, t as compileSqliteQueryBindings } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as executeWithCachedStatement } from "./kysely-sync-cache-state-CFxglP-_.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { t as applyPrivateModeSync } from "./private-mode-B6dWGRb2.mjs";
import { o as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { a as registerSqliteCacheExitClose, t as configureSqliteConnectionPragmas } from "./sqlite-wal-BzoPsBh0.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { x as retainOpenClawStateDatabaseForIdle } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { i as resolveSqliteDatabaseFilePaths } from "./sqlite-files-eRv24eIu.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { t as migrateSqliteSchemaToStrict } from "./sqlite-strict-DxDkCm9i.mjs";
import { r as withResponseBodyTimeout } from "./http-response-body-timeout-QllykGBC.mjs";
import { r as normalizeRequestInitHeadersForFetch, t as isHeadersLike } from "./fetch-headers-DD03wtQj.mjs";
import { a as resolveEnabledDebugProxySettings } from "./env-BOt5Nx-y.mjs";
import { t as isLikelySensitiveModelProviderHeaderName } from "./model-provider-header-policy-CUWP5mEd.mjs";
import fs, { writeSync } from "node:fs";
import { URL } from "node:url";
import path from "node:path";
import { StringDecoder } from "node:string_decoder";
import { isUtf8 } from "node:buffer";
import { randomUUID } from "node:crypto";
import { gunzipSync, gzipSync } from "node:zlib";
//#region src/proxy-capture/header-redaction.ts
/**
* Canonical header redaction for debug proxy captures.
*
* Both capture writers — the patched-fetch runtime and the standalone proxy
* server — must redact identically. A capture that leaks credentials is worse
* than no capture, and the standalone path previously stored raw headers while
* the runtime path redacted, so this policy lives in one leaf module that both
* import rather than being duplicated per writer.
*/
const REDACTED_CAPTURE_HEADER_VALUE = "[REDACTED]";
function isSensitiveCaptureHeaderName(name) {
	const normalized = name.trim().toLowerCase();
	return isLikelySensitiveModelProviderHeaderName(normalized) || normalized === "cookie" || normalized === "set-cookie" || normalized.includes("session");
}
function redactedCaptureHeaders(headers, additionalSensitiveNames) {
	if (!headers) return;
	const additionalSensitive = new Set([...additionalSensitiveNames ?? []].map((name) => name.trim().toLowerCase()));
	const entries = isHeadersLike(headers) ? Array.from(headers.entries()) : Object.entries(headers);
	const redacted = {};
	for (const [name, value] of entries) {
		if (additionalSensitive.has(name.trim().toLowerCase()) || isSensitiveCaptureHeaderName(name)) {
			redacted[name] = REDACTED_CAPTURE_HEADER_VALUE;
			continue;
		}
		const flattened = Array.isArray(value) ? value.join(", ") : value ?? "";
		redacted[name] = redactRegisteredSecretValues(flattened, () => REDACTED_CAPTURE_HEADER_VALUE);
	}
	return redacted;
}
//#endregion
//#region src/proxy-capture/store-lifecycle.ts
const finalizers = /* @__PURE__ */ new WeakMap();
const closed = /* @__PURE__ */ new WeakSet();
function registerCaptureStoreFinalizer(store, finalize) {
	if (closed.has(store)) throw new Error("Capture store is already finalized.");
	let callbacks = finalizers.get(store);
	if (!callbacks) {
		callbacks = /* @__PURE__ */ new Set();
		finalizers.set(store, callbacks);
	}
	callbacks.add(finalize);
	return () => callbacks.delete(finalize);
}
function finalizeCaptureStore(store) {
	if (closed.has(store)) return;
	closed.add(store);
	const callbacks = finalizers.get(store);
	finalizers.delete(store);
	const errors = [];
	for (const finalize of callbacks ?? []) try {
		finalize();
	} catch (error) {
		errors.push(error);
	}
	if (errors.length) throw new AggregateError(errors, "Capture store finalization failed.");
}
//#endregion
//#region src/proxy-capture/store-readonly.ts
function listDebugProxyCaptureSessions(db, limit = 50) {
	const kysely = getNodeSqliteKysely(db);
	const sessions = kysely.selectFrom("capture_sessions").select([
		"id",
		"started_at",
		"ended_at",
		"mode",
		"source_process",
		"proxy_url"
	]).groupBy("id").orderBy("started_at", "desc").limit(limit).as("s");
	const query = kysely.selectFrom(sessions).select([
		"s.id",
		"s.started_at as startedAt",
		"s.ended_at as endedAt",
		"s.mode",
		"s.source_process as sourceProcess",
		"s.proxy_url as proxyUrl"
	]).select((eb) => eb.selectFrom("capture_events as e").select((event) => event.fn.count("e.id").as("count")).whereRef("e.session_id", "=", "s.id").as("eventCount")).orderBy("s.started_at", "desc");
	const { compiled, bind } = compileSqliteQueryBindings(() => query);
	return db.prepare(compiled.sql).all(...bind(void 0));
}
function findDebugProxyCaptureBlobReference(db, blobId) {
	const query = getNodeSqliteKysely(db).selectFrom("capture_events").select("data_blob_id as blobId").where("data_blob_id", "=", blobId).limit(1);
	const { compiled, bind } = compileSqliteQueryBindings(() => query);
	return db.prepare(compiled.sql).get(...bind(void 0))?.blobId || null;
}
function queryDebugProxyCapturePreset(db, preset, sessionId) {
	const kysely = getNodeSqliteKysely(db);
	let events = kysely.selectFrom("capture_events");
	if (sessionId) events = events.where("session_id", "=", sessionId);
	const locations = events.select(["host", "path"]);
	const count = kysely.fn.countAll();
	let query;
	switch (preset) {
		case "double-sends":
			query = locations.select(["method", count.as("duplicateCount")]).where("kind", "=", "request").groupBy([
				"host",
				"path",
				"method",
				"data_sha256"
			]).having(count, ">", 1).orderBy("duplicateCount", "desc").orderBy("host", "asc");
			break;
		case "retry-storms":
			query = locations.select(count.as("errorCount")).where("kind", "=", "response").where("status", ">=", 429).groupBy(["host", "path"]).having(count, ">", 1).orderBy("errorCount", "desc").orderBy("host", "asc");
			break;
		case "cache-busting":
			query = locations.select(count.as("variantCount")).where("kind", "=", "request").where((eb) => eb.or([
				eb("path", "like", "%?%"),
				eb("headers_json", "like", "%cache-control%"),
				eb("headers_json", "like", "%pragma%")
			])).groupBy(["host", "path"]).orderBy("variantCount", "desc").orderBy("host", "asc");
			break;
		case "ws-duplicate-frames":
			query = locations.select(count.as("duplicateFrames")).where("kind", "=", "ws-frame").where("direction", "=", "outbound").groupBy([
				"host",
				"path",
				"data_sha256"
			]).having(count, ">", 1).orderBy("duplicateFrames", "desc").orderBy("host", "asc");
			break;
		case "missing-ack":
			query = events.select([
				"flow_id as flowId",
				"host",
				"path",
				count.as("outboundFrames")
			]).where("kind", "=", "ws-frame").where("direction", "=", "outbound").where("flow_id", "not in", events.select("flow_id").where("kind", "=", "ws-frame").where("direction", "=", "inbound")).groupBy([
				"flow_id",
				"host",
				"path"
			]).orderBy("outboundFrames", "desc");
			break;
		case "error-bursts":
			query = locations.select(count.as("errorCount")).where("kind", "=", "error").groupBy(["host", "path"]).orderBy("errorCount", "desc").orderBy("host", "asc");
			break;
		default: return [];
	}
	const { compiled, bind } = compileSqliteQueryBindings(() => query);
	return db.prepare(compiled.sql).all(...bind(void 0));
}
function readDebugProxyCaptureSessionEvents(db, sessionId, limit = 500) {
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("capture_events").select([
		"id",
		"session_id as sessionId",
		"ts",
		"source_scope as sourceScope",
		"source_process as sourceProcess",
		"protocol",
		"direction",
		"kind",
		"flow_id as flowId",
		"method",
		"host",
		"path",
		"status",
		"close_code as closeCode",
		"content_type as contentType",
		"headers_json as headersJson",
		"data_text as dataText",
		"data_blob_id as dataBlobId",
		"data_sha256 as dataSha256",
		"error_text as errorText",
		"meta_json as metaJson"
	]).where("session_id", "=", sessionId).orderBy("ts", "desc").orderBy("id", "desc").limit(limit)).rows;
}
function parseMetaJson(metaJson) {
	if (typeof metaJson !== "string" || metaJson.trim().length === 0) return null;
	try {
		const parsed = JSON.parse(metaJson);
		return parsed && typeof parsed === "object" ? parsed : null;
	} catch {
		return null;
	}
}
function sortObservedCounts(counts) {
	return [...counts.entries()].map(([value, count]) => ({
		value,
		count
	})).toSorted((left, right) => right.count - left.count || left.value.localeCompare(right.value));
}
function summarizeDebugProxyCaptureSessionCoverage(db, sessionId) {
	const { compiled, bind } = compileSqliteQueryBindings((parameter) => getNodeSqliteKysely(db).selectFrom("capture_events").select(["host", "meta_json as metaJson"]).where("session_id", "=", parameter((value) => value)));
	const rows = db.prepare(compiled.sql).iterate(...bind(sessionId));
	const providers = /* @__PURE__ */ new Map();
	const apis = /* @__PURE__ */ new Map();
	const models = /* @__PURE__ */ new Map();
	const hosts = /* @__PURE__ */ new Map();
	const localPeers = /* @__PURE__ */ new Map();
	let totalEvents = 0;
	let unlabeledEventCount = 0;
	try {
		for (const row of rows) {
			totalEvents += 1;
			const meta = parseMetaJson(row.metaJson);
			const provider = normalizeNullableString(meta?.provider);
			const api = normalizeNullableString(meta?.api);
			const model = normalizeNullableString(meta?.model);
			const host = normalizeNullableString(row.host);
			if (!provider && !api && !model) unlabeledEventCount += 1;
			if (provider) providers.set(provider, (providers.get(provider) ?? 0) + 1);
			if (api) apis.set(api, (apis.get(api) ?? 0) + 1);
			if (model) models.set(model, (models.get(model) ?? 0) + 1);
			if (host) {
				hosts.set(host, (hosts.get(host) ?? 0) + 1);
				if (host.startsWith("127.0.0.1:") || host.startsWith("localhost:")) localPeers.set(host, (localPeers.get(host) ?? 0) + 1);
			}
		}
	} catch (error) {
		try {
			rows.return?.();
		} catch {}
		throw error;
	}
	return {
		sessionId,
		totalEvents,
		unlabeledEventCount,
		providers: sortObservedCounts(providers),
		apis: sortObservedCounts(apis),
		models: sortObservedCounts(models),
		hosts: sortObservedCounts(hosts),
		localPeers: sortObservedCounts(localPeers)
	};
}
function readDebugProxyCaptureBlob(db, blobId) {
	const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("capture_blobs").select(["encoding", "data"]).where("blob_id", "=", blobId));
	if (!row?.data) return null;
	const data = Buffer.from(row.data);
	return (row.encoding === "gzip" ? gunzipSync(data) : data).toString("utf8");
}
/** Read capture rows without joining or mutating the shared-state writer lifecycle. */
function createDebugProxyCaptureReader(params) {
	return {
		getSessionEvents(sessionId, limit) {
			return withExistingOpenClawStateDatabaseReadOnly(({ db }) => readDebugProxyCaptureSessionEvents(db, sessionId, limit), { env: params.env }) ?? [];
		},
		readBlob(blobId) {
			return withExistingOpenClawStateDatabaseReadOnly(({ db }) => readDebugProxyCaptureBlob(db, blobId), { env: params.env }) ?? null;
		}
	};
}
var DebugProxyCaptureKernel = class {
	constructor(options) {
		this.db = options.db;
		this.dbPath = options.dbPath;
		this.blobDir = options.blobDir;
		this.capturePathBased = options.pathBased;
		this.runWrite = options.runWrite;
	}
	upsertSession(session) {
		const pathBased = this.capturePathBased;
		const { compiled, bind } = compileSqliteQueryBindings((parameter) => {
			const values = {
				id: parameter((value) => value.id),
				started_at: parameter((value) => value.startedAt),
				ended_at: parameter((value) => value.endedAt ?? null),
				mode: parameter((value) => value.mode),
				source_scope: parameter((value) => value.sourceScope),
				source_process: parameter((value) => value.sourceProcess),
				proxy_url: parameter((value) => value.proxyUrl ?? null)
			};
			if (pathBased) return getNodeSqliteKysely(this.db).insertInto("capture_sessions").values({
				...values,
				db_path: parameter((value) => value.dbPath ?? this.dbPath),
				blob_dir: parameter((value) => value.blobDir ?? pathBased.blobDir)
			}).onConflict((conflict) => conflict.column("id").doUpdateSet((eb) => ({
				ended_at: eb.ref("excluded.ended_at"),
				proxy_url: eb.ref("excluded.proxy_url"),
				source_process: eb.ref("excluded.source_process")
			})));
			return getNodeSqliteKysely(this.db).insertInto("capture_sessions").values(values).onConflict((conflict) => conflict.column("id").doUpdateSet((eb) => ({
				started_at: eb.fn("min", ["capture_sessions.started_at", "excluded.started_at"]),
				ended_at: eb.ref("excluded.ended_at"),
				mode: eb.case().when("capture_sessions.mode", "=", "implicit").then(eb.ref("excluded.mode")).else(eb.ref("capture_sessions.mode")).end(),
				proxy_url: eb.ref("excluded.proxy_url"),
				source_process: eb.ref("excluded.source_process")
			})));
		});
		const upsert = () => {
			const parameters = bind(session);
			return executeWithCachedStatement(this.db, compiled.sql, parameters, (statement) => statement.run(...parameters));
		};
		if (pathBased) {
			upsert();
			return;
		}
		this.runWrite(upsert);
	}
	endSession(sessionId, endedAt = Date.now()) {
		const { compiled, bind } = compileSqliteQueryBindings(() => getNodeSqliteKysely(this.db).updateTable("capture_sessions").set({ ended_at: endedAt }).where("id", "=", sessionId));
		const update = () => {
			const parameters = bind();
			return executeWithCachedStatement(this.db, compiled.sql, parameters, (statement) => statement.run(...parameters));
		};
		if (this.capturePathBased) {
			update();
			return;
		}
		this.runWrite(update);
	}
	persistPayload(data, contentType) {
		const sha256 = sha256Hex(data);
		const blobId = sha256.slice(0, 24);
		if (this.capturePathBased) {
			fs.mkdirSync(this.capturePathBased.blobDir, {
				recursive: true,
				mode: 448
			});
			const outputPath = path.join(this.capturePathBased.blobDir, `${blobId}.bin.gz`);
			if (!fs.existsSync(outputPath)) fs.writeFileSync(outputPath, gzipSync(data), { mode: 384 });
			applyPrivateModeSync(outputPath, 384);
			return {
				blobId,
				path: outputPath,
				encoding: "gzip",
				sizeBytes: data.byteLength,
				sha256,
				...contentType ? { contentType } : {}
			};
		}
		const { compiled, bind } = compileSqliteQueryBindings((parameter) => getNodeSqliteKysely(this.db).insertInto("capture_blobs").orIgnore().values({
			blob_id: blobId,
			content_type: contentType ?? null,
			encoding: "gzip",
			size_bytes: parameter((value) => value.byteLength),
			sha256,
			data: parameter((value) => gzipSync(value)),
			created_at: parameter(() => Date.now())
		}));
		this.runWrite(() => executeWithCachedStatement(this.db, compiled.sql, [
			data,
			contentType ?? null,
			blobId,
			sha256
		], (statement) => statement.run(...bind(data))));
		return {
			blobId,
			encoding: "gzip",
			sizeBytes: data.byteLength,
			sha256,
			...contentType ? { contentType } : {}
		};
	}
	recordEvent(event) {
		if (this.capturePathBased) {
			this.insertEvent(event, event.dataBlobId ?? null);
			return;
		}
		this.runWrite(() => {
			const implicitSession = compileSqliteQueryBindings((parameter) => getNodeSqliteKysely(this.db).insertInto("capture_sessions").orIgnore().values({
				id: parameter((value) => value.sessionId),
				started_at: parameter((value) => value.ts),
				mode: "implicit",
				source_scope: parameter((value) => value.sourceScope),
				source_process: parameter((value) => value.sourceProcess)
			}));
			const sessionParameters = implicitSession.bind(event);
			executeWithCachedStatement(this.db, implicitSession.compiled.sql, sessionParameters, (statement) => statement.run(...sessionParameters));
			let dataBlobId = null;
			if (event.dataBlobId) {
				const blob = compileSqliteQueryBindings((parameter) => getNodeSqliteKysely(this.db).selectFrom("capture_blobs").select((eb) => eb.lit(1).as("present")).where("blob_id", "=", parameter((value) => value)));
				const blobParameters = blob.bind(event.dataBlobId);
				dataBlobId = executeWithCachedStatement(this.db, blob.compiled.sql, blobParameters, (statement) => statement.get(...blobParameters)) ? event.dataBlobId : null;
			}
			this.insertEvent(event, dataBlobId);
		});
	}
	insertEvent(event, dataBlobId) {
		const { compiled, bind } = compileSqliteQueryBindings((parameter) => getNodeSqliteKysely(this.db).insertInto("capture_events").values({
			session_id: parameter((value) => value.sessionId),
			ts: parameter((value) => value.ts),
			source_scope: parameter((value) => value.sourceScope),
			source_process: parameter((value) => value.sourceProcess),
			protocol: parameter((value) => value.protocol),
			direction: parameter((value) => value.direction),
			kind: parameter((value) => value.kind),
			flow_id: parameter((value) => value.flowId),
			method: parameter((value) => value.method ?? null),
			host: parameter((value) => value.host ?? null),
			path: parameter((value) => value.path ?? null),
			status: parameter((value) => value.status ?? null),
			close_code: parameter((value) => value.closeCode ?? null),
			content_type: parameter((value) => value.contentType ?? null),
			headers_json: parameter((value) => value.headersJson ?? null),
			data_text: parameter((value) => value.dataText ?? null),
			data_blob_id: dataBlobId,
			data_sha256: parameter((value) => value.dataSha256 ?? null),
			error_text: parameter((value) => value.errorText ?? null),
			meta_json: parameter((value) => value.metaJson ?? null)
		}));
		const parameters = bind(event);
		executeWithCachedStatement(this.db, compiled.sql, parameters, (statement) => statement.run(...parameters));
	}
	listSessions(limit = 50) {
		return listDebugProxyCaptureSessions(this.db, limit);
	}
	getSessionEvents(sessionId, limit = 500) {
		return readDebugProxyCaptureSessionEvents(this.db, sessionId, limit);
	}
	summarizeSessionCoverage(sessionId) {
		return summarizeDebugProxyCaptureSessionCoverage(this.db, sessionId);
	}
	readBlob(blobId) {
		if (this.capturePathBased) {
			const legacyBlobId = findDebugProxyCaptureBlobReference(this.db, blobId);
			if (!legacyBlobId) return null;
			const blobPath = path.join(this.capturePathBased.blobDir, `${legacyBlobId}.bin.gz`);
			return fs.existsSync(blobPath) ? gunzipSync(fs.readFileSync(blobPath)).toString("utf8") : null;
		}
		return readDebugProxyCaptureBlob(this.db, blobId);
	}
	queryPreset(preset, sessionId) {
		return queryDebugProxyCapturePreset(this.db, preset, sessionId);
	}
	purgeAll() {
		const kysely = getNodeSqliteKysely(this.db);
		const metadataDeletes = [kysely.deleteFrom("capture_events").compile().sql, kysely.deleteFrom("capture_sessions").compile().sql];
		if (this.capturePathBased) {
			const sessionCount = this.countCaptureRows("capture_sessions");
			const eventCount = this.countCaptureRows("capture_events");
			runSqliteImmediateTransactionSync(this.db, () => {
				for (const sql of metadataDeletes) executeWithCachedStatement(this.db, sql, [], (statement) => statement.run());
			});
			let blobs = 0;
			if (fs.existsSync(this.capturePathBased.blobDir)) for (const entry of fs.readdirSync(this.capturePathBased.blobDir)) {
				fs.rmSync(path.join(this.capturePathBased.blobDir, entry), { force: true });
				blobs += 1;
			}
			return {
				sessions: sessionCount,
				events: eventCount,
				blobs
			};
		}
		return this.runWrite(() => {
			const sessionCount = this.countCaptureRows("capture_sessions");
			const eventCount = this.countCaptureRows("capture_events");
			const blobCount = this.countCaptureRows("capture_blobs");
			for (const sql of [...metadataDeletes, kysely.deleteFrom("capture_blobs").compile().sql]) executeWithCachedStatement(this.db, sql, [], (statement) => statement.run());
			return {
				sessions: sessionCount,
				events: eventCount,
				blobs: blobCount
			};
		});
	}
	deleteSessions(sessionIds) {
		const uniqueSessionIds = normalizeUniqueStringEntries(sessionIds);
		if (uniqueSessionIds.length === 0) return {
			sessions: 0,
			events: 0,
			blobs: 0
		};
		if (this.capturePathBased) return this.deletePathBasedSessions(uniqueSessionIds);
		return this.runWrite(() => {
			const { blobRows, eventCount, sessionCount } = this.readSessionDeletionRows(uniqueSessionIds);
			this.deleteSessionMetadata(uniqueSessionIds);
			const candidateBlobIds = blobRows.map((row) => row.blobId?.trim()).filter((blobId) => Boolean(blobId));
			const remainingBlobRefs = this.findRemainingBlobReferences(candidateBlobIds);
			const { compiled, bind } = compileSqliteQueryBindings((parameter) => getNodeSqliteKysely(this.db).deleteFrom("capture_blobs").where("blob_id", "=", parameter((blobId) => blobId)));
			return {
				sessions: sessionCount,
				events: eventCount,
				blobs: executeWithCachedStatement(this.db, compiled.sql, candidateBlobIds, (statement) => {
					let deleted = 0;
					for (const blobId of candidateBlobIds) {
						if (remainingBlobRefs.has(blobId)) continue;
						const result = statement.run(...bind(blobId));
						if (Number(result.changes) > 0) deleted += 1;
					}
					return deleted;
				})
			};
		});
	}
	deletePathBasedSessions(sessionIds) {
		const pathBased = this.capturePathBased;
		if (!pathBased) throw new Error("path-based debug proxy capture store is unavailable");
		const { blobRows, eventCount, sessionCount } = this.readSessionDeletionRows(sessionIds);
		runSqliteImmediateTransactionSync(this.db, () => this.deleteSessionMetadata(sessionIds));
		const candidateBlobIds = blobRows.map((row) => row.blobId?.trim()).filter((blobId) => Boolean(blobId));
		const remainingBlobRefs = this.findRemainingBlobReferences(candidateBlobIds);
		let blobs = 0;
		for (const blobId of candidateBlobIds) {
			if (remainingBlobRefs.has(blobId)) continue;
			const blobPath = path.join(pathBased.blobDir, `${blobId}.bin.gz`);
			if (fs.existsSync(blobPath)) {
				fs.rmSync(blobPath, { force: true });
				blobs += 1;
			}
		}
		return {
			sessions: sessionCount,
			events: eventCount,
			blobs
		};
	}
	countCaptureRows(table) {
		const query = getNodeSqliteKysely(this.db).selectFrom(table).select((eb) => eb.fn.countAll().as("count"));
		return executeWithCachedStatement(this.db, query.compile().sql, [], (statement) => statement.get()).count ?? 0;
	}
	readSessionDeletionRows(sessionIds) {
		const kysely = getNodeSqliteKysely(this.db);
		const events = kysely.selectFrom("capture_events").where("session_id", "in", sessionIds);
		const blobs = compileSqliteQueryBindings(() => events.select("data_blob_id as blobId").distinct().where("data_blob_id", "is not", null));
		const blobParameters = blobs.bind(void 0);
		const blobRows = executeWithCachedStatement(this.db, blobs.compiled.sql, blobParameters, (statement) => statement.all(...blobParameters));
		const eventQuery = compileSqliteQueryBindings(() => events.select((eb) => eb.fn.countAll().as("count")));
		const eventParameters = eventQuery.bind(void 0);
		const eventRow = executeWithCachedStatement(this.db, eventQuery.compiled.sql, eventParameters, (statement) => statement.get(...eventParameters));
		const sessionQuery = compileSqliteQueryBindings(() => kysely.selectFrom("capture_sessions").select((eb) => eb.fn.countAll().as("count")).where("id", "in", sessionIds));
		const sessionParameters = sessionQuery.bind(void 0);
		const sessionRow = executeWithCachedStatement(this.db, sessionQuery.compiled.sql, sessionParameters, (statement) => statement.get(...sessionParameters));
		return {
			blobRows,
			eventCount: eventRow.count ?? 0,
			sessionCount: sessionRow.count ?? 0
		};
	}
	deleteSessionMetadata(sessionIds) {
		const kysely = getNodeSqliteKysely(this.db);
		const events = compileSqliteQueryBindings(() => kysely.deleteFrom("capture_events").where("session_id", "in", sessionIds));
		const eventParameters = events.bind(void 0);
		executeWithCachedStatement(this.db, events.compiled.sql, eventParameters, (statement) => statement.run(...eventParameters));
		const sessions = compileSqliteQueryBindings(() => kysely.deleteFrom("capture_sessions").where("id", "in", sessionIds));
		const sessionParameters = sessions.bind(void 0);
		executeWithCachedStatement(this.db, sessions.compiled.sql, sessionParameters, (statement) => statement.run(...sessionParameters));
	}
	findRemainingBlobReferences(candidateBlobIds) {
		if (candidateBlobIds.length === 0) return /* @__PURE__ */ new Set();
		const { compiled, bind } = compileSqliteQueryBindings(() => getNodeSqliteKysely(this.db).selectFrom("capture_events").select("data_blob_id as blobId").distinct().where("data_blob_id", "in", candidateBlobIds).where("data_blob_id", "is not", null));
		const parameters = bind(void 0);
		const rows = executeWithCachedStatement(this.db, compiled.sql, parameters, (statement) => statement.all(...parameters));
		return new Set(rows.map((row) => row.blobId?.trim()).filter((blobId) => Boolean(blobId)));
	}
};
//#endregion
//#region src/proxy-capture/store.sqlite.ts
const DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_VERSION = 1;
const DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS capture_sessions (
    id TEXT PRIMARY KEY,
    started_at INTEGER NOT NULL,
    ended_at INTEGER,
    mode TEXT NOT NULL,
    source_scope TEXT NOT NULL,
    source_process TEXT NOT NULL,
    proxy_url TEXT,
    db_path TEXT NOT NULL,
    blob_dir TEXT NOT NULL
  ) STRICT;
  CREATE TABLE IF NOT EXISTS capture_events (
    id INTEGER PRIMARY KEY,
    session_id TEXT NOT NULL,
    ts INTEGER NOT NULL,
    source_scope TEXT NOT NULL,
    source_process TEXT NOT NULL,
    protocol TEXT NOT NULL,
    direction TEXT NOT NULL,
    kind TEXT NOT NULL,
    flow_id TEXT NOT NULL,
    method TEXT,
    host TEXT,
    path TEXT,
    status INTEGER,
    close_code INTEGER,
    content_type TEXT,
    headers_json TEXT,
    data_text TEXT,
    data_blob_id TEXT,
    data_sha256 TEXT,
    error_text TEXT,
    meta_json TEXT
  ) STRICT;
  CREATE INDEX IF NOT EXISTS capture_events_session_ts_idx ON capture_events(session_id, ts);
  CREATE INDEX IF NOT EXISTS capture_events_flow_idx ON capture_events(flow_id, ts);
`;
function isInMemoryDatabasePath(dbPath) {
	if (dbPath === ":memory:") return true;
	if (!dbPath.startsWith("file:")) return false;
	const fragmentIndex = dbPath.indexOf("#");
	const uriWithoutFragment = fragmentIndex === -1 ? dbPath : dbPath.slice(0, fragmentIndex);
	const queryIndex = uriWithoutFragment.indexOf("?");
	const uriPath = queryIndex === -1 ? uriWithoutFragment : uriWithoutFragment.slice(0, queryIndex);
	try {
		if (decodeURIComponent(uriPath.slice(5)) === ":memory:") return true;
	} catch {}
	return queryIndex !== -1 && new URLSearchParams(uriWithoutFragment.slice(queryIndex + 1)).get("mode") === "memory";
}
function hardenLegacyDatabaseFiles(dbPath) {
	for (const candidate of resolveSqliteDatabaseFilePaths(dbPath)) if (fs.existsSync(candidate)) applyPrivateModeSync(candidate, 384);
}
function openPathBasedDebugProxyCaptureStore(dbPath, blobDir) {
	const fileBackedPath = isInMemoryDatabasePath(dbPath) ? void 0 : dbPath;
	if (fileBackedPath) {
		fs.mkdirSync(path.dirname(fileBackedPath), {
			recursive: true,
			mode: 448
		});
		if (!fs.existsSync(fileBackedPath)) fs.closeSync(fs.openSync(fileBackedPath, "a", 384));
	}
	const db = openNodeSqliteDatabase(dbPath);
	let walMaintenance;
	try {
		if (fileBackedPath) applyPrivateModeSync(fileBackedPath, 384);
		walMaintenance = configureSqliteConnectionPragmas(db, {
			busyTimeoutMs: 5e3,
			databaseLabel: "debug-proxy-capture-sdk",
			...fileBackedPath ? { databasePath: fileBackedPath } : {},
			foreignKeys: true
		});
		const versionRow = db.prepare("PRAGMA user_version").get();
		const schemaVersion = Number(versionRow?.user_version ?? 0);
		if (schemaVersion > DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_VERSION) throw new Error(`Legacy debug proxy capture database uses newer schema version ${schemaVersion}; this build supports ${DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_VERSION}`);
		db.exec(DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_SQL);
		if (schemaVersion < DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_VERSION) {
			migrateSqliteSchemaToStrict(db, DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_SQL, { databaseLabel: fileBackedPath ?? dbPath });
			db.exec(`PRAGMA user_version = ${DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_VERSION};`);
		}
		if (fileBackedPath) hardenLegacyDatabaseFiles(fileBackedPath);
		return {
			db,
			pathBased: {
				blobDir,
				walMaintenance
			}
		};
	} catch (err) {
		walMaintenance?.close();
		db.close();
		throw err;
	}
}
function serializeJson(value) {
	return value == null ? null : JSON.stringify(value);
}
const sharedDebugProxyCaptureStates = /* @__PURE__ */ new WeakMap();
function runSharedDebugProxyCaptureWrite(owner, operation) {
	const shared = sharedDebugProxyCaptureStates.get(owner);
	if (!shared) throw new Error("shared debug proxy capture state is unavailable");
	return runOpenClawStateWriteTransaction(() => operation(), {
		database: shared.database,
		env: shared.env ?? process.env
	});
}
var DebugProxyCaptureStoreImpl = class extends DebugProxyCaptureKernel {
	constructor(optionsOrDbPath = {}, legacyBlobDir) {
		if (typeof optionsOrDbPath === "string") {
			if (!legacyBlobDir) throw new TypeError("legacy debug proxy capture store requires a blob directory");
			const opened = openPathBasedDebugProxyCaptureStore(optionsOrDbPath, legacyBlobDir);
			super({
				db: opened.db,
				dbPath: optionsOrDbPath,
				blobDir: legacyBlobDir,
				pathBased: opened.pathBased,
				runWrite: (operation) => runSharedDebugProxyCaptureWrite(this, operation)
			});
			this.pathBased = opened.pathBased;
			this.closed = false;
			this.closing = false;
			return;
		}
		const database = openOpenClawStateDatabase({ env: optionsOrDbPath.env });
		super({
			db: database.db,
			dbPath: database.path,
			blobDir: database.path,
			runWrite: (operation) => runSharedDebugProxyCaptureWrite(this, operation)
		});
		this.closed = false;
		this.closing = false;
		this.releaseIdleReference = retainOpenClawStateDatabaseForIdle(database);
		sharedDebugProxyCaptureStates.set(this, {
			database,
			env: optionsOrDbPath.env
		});
	}
	close() {
		if (this.closed || this.closing) return;
		this.closing = true;
		const errors = [];
		for (const close of [
			() => finalizeCaptureStore(this),
			() => this.releaseIdleReference?.(),
			() => this.pathBased?.walMaintenance.close(),
			() => {
				if (this.pathBased && this.db.isOpen) this.db.close();
			}
		]) try {
			close();
		} catch (error) {
			errors.push(error);
		}
		this.closed = true;
		this.closing = false;
		if (errors.length) throw new AggregateError(errors, "Capture store close failed.");
	}
	get isClosed() {
		return this.closed || !this.db.isOpen;
	}
};
const DebugProxyCaptureStore = DebugProxyCaptureStoreImpl;
const cachedStores = /* @__PURE__ */ new Map();
let unregisterExitClose = null;
function resolveDebugProxyCaptureStoreKey(optionsOrDbPath, legacyBlobDir) {
	return typeof optionsOrDbPath === "string" ? `legacy:${optionsOrDbPath}:${legacyBlobDir ?? ""}` : `shared:${openOpenClawStateDatabase({ env: optionsOrDbPath.env }).path}`;
}
function getDebugProxyCaptureStoreImpl(optionsOrDbPath = {}, legacyBlobDir) {
	const key = resolveDebugProxyCaptureStoreKey(optionsOrDbPath, legacyBlobDir);
	const cached = cachedStores.get(key);
	if (cached && !cached.store.isClosed) return cached.store;
	const store = new DebugProxyCaptureStoreImpl(optionsOrDbPath, legacyBlobDir);
	cachedStores.set(key, {
		store,
		leases: 0
	});
	unregisterExitClose ??= registerSqliteCacheExitClose(closeDebugProxyCaptureStore);
	return store;
}
function getDebugProxyCaptureStore(optionsOrDbPath = {}, legacyBlobDir) {
	return getDebugProxyCaptureStoreImpl(optionsOrDbPath, legacyBlobDir);
}
function closeDebugProxyCaptureStore() {
	unregisterExitClose?.();
	unregisterExitClose = null;
	const stores = [...cachedStores.values()];
	cachedStores.clear();
	const errors = [];
	for (const cached of stores) try {
		cached.store.close();
	} catch (error) {
		errors.push(error);
	}
	if (errors.length) throw new AggregateError(errors, "Capture stores failed to close.");
}
function acquireDebugProxyCaptureStore(optionsOrDbPath = {}, legacyBlobDir) {
	const key = resolveDebugProxyCaptureStoreKey(optionsOrDbPath, legacyBlobDir);
	const store = getDebugProxyCaptureStoreImpl(optionsOrDbPath, legacyBlobDir);
	const cached = cachedStores.get(key);
	if (!cached || cached.store !== store) throw new Error("debug proxy capture store cache changed while acquiring a lease");
	cached.leases += 1;
	let released = false;
	return {
		store,
		release: () => {
			if (released) return;
			released = true;
			const current = cachedStores.get(key);
			if (!current || current.store !== store) return;
			current.leases = Math.max(0, current.leases - 1);
			if (current.leases === 0) {
				cachedStores.delete(key);
				current.store.close();
			}
		}
	};
}
function persistEventPayload(store, params) {
	if (params.data == null) return {};
	const buffer = Buffer.isBuffer(params.data) ? params.data : Buffer.from(params.data);
	const previewLimit = params.previewLimit ?? 8192;
	const blob = store.persistPayload(buffer, params.contentType);
	return {
		dataText: new StringDecoder("utf8").write(buffer.subarray(0, previewLimit)),
		dataBlobId: blob.blobId,
		dataSha256: blob.sha256
	};
}
function safeJsonString(value) {
	return serializeJson(value) ?? void 0;
}
//#endregion
//#region src/proxy-capture/runtime-owner.ts
const DEBUG_PROXY_FETCH_PATCH_KEY = Symbol.for("openclaw.debugProxy.fetchPatch");
function resolveRuntimeDeps(deps = {}) {
	return {
		getStore: deps.getStore ?? getDebugProxyCaptureStore,
		closeStore: deps.closeStore,
		persistEventPayload: deps.persistEventPayload ?? ((store, payload) => persistEventPayload(store, payload)),
		safeJsonString: deps.safeJsonString ?? safeJsonString,
		fetchTarget: deps.fetchTarget ?? globalThis
	};
}
const captureOwners = /* @__PURE__ */ new WeakMap();
const globalFetchPatches = /* @__PURE__ */ new WeakMap();
/** Guarded requests own capture admission, including when given a saved patch. */
function resolveDebugProxyFetchTransport(fetchImpl) {
	return globalFetchPatches.get(fetchImpl)?.originalFetch ?? fetchImpl;
}
function hasDebugProxyFetchPatch(fetchTarget, admission) {
	return fetchTarget[DEBUG_PROXY_FETCH_PATCH_KEY]?.admission === admission;
}
/** Keep wrapper identity and its admission together for matching-owner teardown. */
function registerDebugProxyFetchPatch(fetchTarget, originalFetch, patchedFetch, admission) {
	const patch = {
		originalFetch,
		admission
	};
	fetchTarget[DEBUG_PROXY_FETCH_PATCH_KEY] = patch;
	globalFetchPatches.set(patchedFetch, patch);
	fetchTarget.fetch = patchedFetch;
}
function uninstallDebugProxyGlobalFetchPatch(deps = {}, admission) {
	const fetchTarget = resolveRuntimeDeps(deps).fetchTarget;
	const state = fetchTarget[DEBUG_PROXY_FETCH_PATCH_KEY];
	if (!state || admission && state.admission !== admission) return;
	fetchTarget.fetch = state.originalFetch;
	delete fetchTarget[DEBUG_PROXY_FETCH_PATCH_KEY];
}
function isDebugProxyGlobalFetchPatchInstalled() {
	return Boolean(globalThis[DEBUG_PROXY_FETCH_PATCH_KEY]);
}
function captureOwnerKey(settings) {
	return JSON.stringify([settings.dbPath, settings.sessionId]);
}
function reportCapturePersistenceFailure(owner, error) {
	owner.errors.push(error);
	try {
		const message = redactRegisteredSecretValues(error instanceof Error ? error.message : String(error), () => REDACTED_CAPTURE_HEADER_VALUE);
		writeSync(2, `[proxy-capture] Capture persistence failed: ${message}\n`);
	} catch {}
}
function finishCaptureOwner(owner) {
	if (!owner.active) return;
	owner.active = false;
	owner.admission.current = void 0;
	captureOwners.get(owner.runtime.getStore).owners.delete(captureOwnerKey(owner.settings));
	uninstallDebugProxyGlobalFetchPatch(owner.runtime, owner.admission);
	owner.unregister();
	for (const finish of owner.pending) finish();
	try {
		if (!owner.store.isClosed) owner.store.endSession(owner.settings.sessionId);
	} catch (error) {
		reportCapturePersistenceFailure(owner, error);
	}
	if (owner.errors.length) throw new AggregateError(owner.errors.splice(0), "Capture session finalization failed.");
}
function resolveCaptureOwner(settings, runtime, options = {}) {
	let registry = captureOwners.get(runtime.getStore);
	if (!registry) {
		registry = {
			owners: /* @__PURE__ */ new Map(),
			resolved: /* @__PURE__ */ new WeakMap()
		};
		captureOwners.set(runtime.getStore, registry);
	}
	const key = captureOwnerKey(settings);
	let owner = registry.owners.get(key);
	if (!owner) {
		const prior = options.explicit ? registry.resolved.get(settings) : registry.ambient?.sessionId === settings.sessionId && registry.ambient.dbPath === settings.dbPath ? registry.ambient.admission : void 0;
		if (!options.initialize && prior) return prior.current;
		const store = runtime.getStore();
		if (store.isClosed) return;
		owner = {
			settings,
			runtime,
			store,
			active: true,
			pending: /* @__PURE__ */ new Set(),
			errors: [],
			unregister: () => {},
			admission: {}
		};
		owner.admission.current = owner;
		const retainedOwner = owner;
		owner.unregister = registerCaptureStoreFinalizer(store, () => finishCaptureOwner(retainedOwner));
		registry.owners.set(key, owner);
	}
	if (options.explicit) registry.resolved.set(settings, owner.admission);
	else registry.ambient = {
		sessionId: settings.sessionId,
		dbPath: settings.dbPath,
		admission: owner.admission
	};
	return owner;
}
function finalizeDebugProxyCapture(resolved, deps = {}) {
	const settings = resolveEnabledDebugProxySettings(resolved);
	if (!settings) return;
	const runtime = resolveRuntimeDeps(deps);
	const owner = captureOwners.get(runtime.getStore)?.owners.get(captureOwnerKey(settings));
	if (owner) uninstallDebugProxyGlobalFetchPatch(deps, owner.admission);
	if (!owner?.active) return;
	const errors = [];
	try {
		finishCaptureOwner(owner);
	} catch (error) {
		errors.push(error);
	}
	try {
		if (owner.runtime.closeStore) owner.runtime.closeStore();
		else owner.store.close?.();
	} catch (error) {
		errors.push(error);
	}
	if (errors.length) throw new AggregateError(errors, "Capture finalization failed.");
}
//#endregion
//#region src/proxy-capture/runtime.ts
const REDACTED_CAPTURE_BINARY_PAYLOAD = Buffer.from("[REDACTED BINARY PAYLOAD]", "utf8");
const MAX_CAPTURED_RESPONSE_BODY_BYTES = 16777216;
const CAPTURED_RESPONSE_BODY_IDLE_TIMEOUT_MS = 1e4;
/** Distinguishes the capture deadline from a genuine response-stream failure. */
var CaptureReadIdleTimeoutError = class extends Error {};
function readCapturedResponseBodyBounded(response, maxBytes, owner, record, signal) {
	let reader;
	let chunks = [];
	let total = 0;
	let finished = false;
	let canceled = false;
	let detachAbort = () => {};
	const cancel = (reason) => {
		if (!reader || canceled) return;
		canceled = true;
		try {
			reader.cancel(reason).catch(() => void 0);
		} catch (error) {
			owner.errors.push(error);
		}
	};
	const release = () => {
		try {
			reader?.releaseLock();
		} catch {}
	};
	const finish = (result) => {
		if (finished) return;
		finished = true;
		detachAbort();
		owner.pending.delete(finalize);
		try {
			if (owner.store.isClosed) throw new Error("Capture store closed before its response could be finalized.");
			record(result);
		} catch (error) {
			reportCapturePersistenceFailure(owner, error);
		} finally {
			chunks = [];
			cancel();
			release();
		}
	};
	const finalize = () => finish({
		status: "finalized",
		buffer: Buffer.concat(chunks, total)
	});
	owner.pending.add(finalize);
	if (signal) {
		const onAbort = () => {
			setTimeout(() => {
				if (finished) return;
				finish({
					status: "failed",
					buffer: Buffer.concat(chunks, total),
					error: signal.reason instanceof Error ? signal.reason : new Error("Response capture aborted", { cause: signal.reason })
				});
			}, 0);
		};
		if (signal.aborted) onAbort();
		else {
			signal.addEventListener("abort", onAbort, { once: true });
			detachAbort = () => signal.removeEventListener("abort", onAbort);
		}
	}
	if (finished) return;
	(async () => {
		try {
			const clone = response.clone();
			const body = clone.body;
			if (!body || typeof body.getReader !== "function") {
				finish(clone instanceof Response && clone.body === null ? {
					status: "captured",
					buffer: Buffer.alloc(0)
				} : { status: "unavailable" });
				return;
			}
			reader = body.getReader();
			for (;;) {
				if (finished || !owner.active) return;
				const { done, value } = await withResponseBodyTimeout({
					timeoutMs: CAPTURED_RESPONSE_BODY_IDLE_TIMEOUT_MS,
					onTimeout: ({ timeoutMs }) => new CaptureReadIdleTimeoutError(`capture read stalled: no data for ${timeoutMs}ms`),
					cancel: async (error) => cancel(error),
					read: () => reader.read()
				});
				if (finished || !owner.active) return;
				if (done) {
					finish({
						status: "captured",
						buffer: Buffer.concat(chunks, total)
					});
					return;
				}
				if (!value?.length) continue;
				if (total + value.length > maxBytes) {
					finish({ status: "too-large" });
					return;
				}
				chunks.push(Buffer.from(value));
				total += value.length;
			}
		} catch (error) {
			if (!finished && owner.active) finish(error instanceof CaptureReadIdleTimeoutError ? {
				status: "stalled",
				buffer: Buffer.concat(chunks, total)
			} : {
				status: "failed",
				buffer: Buffer.concat(chunks, total),
				error
			});
		} finally {
			release();
		}
	})();
}
function parseDeclaredCaptureContentLength(raw) {
	if (raw === null || raw === void 0) return;
	const trimmed = raw.trim();
	if (!/^\d+$/.test(trimmed)) return;
	return BigInt(trimmed);
}
function protocolFromUrl(rawUrl) {
	try {
		switch (new URL(rawUrl).protocol) {
			case "https:": return "https";
			case "wss:": return "wss";
			case "ws:": return "ws";
			default: return "http";
		}
	} catch {
		return "http";
	}
}
function resolveUrlString(input) {
	if (input instanceof URL) return input.toString();
	if (typeof input === "string") return input;
	if (typeof Request !== "undefined" && input instanceof Request) return input.url;
	return null;
}
function redactCaptureUrl(rawUrl) {
	let url;
	try {
		url = new URL(rawUrl);
	} catch {
		return "https://redacted.invalid/%5BREDACTED%5D";
	}
	const redactComponent = (value) => redactRegisteredSecretValues(value, () => REDACTED_CAPTURE_HEADER_VALUE);
	const decodeComponent = (value) => {
		try {
			return decodeURIComponent(value);
		} catch {
			return value;
		}
	};
	if (redactComponent(url.hostname) !== url.hostname) url.hostname = "redacted.invalid";
	for (const key of ["username", "password"]) {
		const decoded = decodeComponent(url[key]);
		const redacted = redactComponent(decoded);
		if (redacted !== decoded) url[key] = redacted;
	}
	url.pathname = url.pathname.split("/").map((segment) => {
		try {
			const decoded = decodeURIComponent(segment);
			const redacted = redactComponent(decoded);
			return redacted === decoded ? segment : encodeURIComponent(redacted);
		} catch {
			return segment;
		}
	}).join("/");
	const searchParams = new URLSearchParams();
	let searchChanged = false;
	for (const [name, value] of url.searchParams.entries()) {
		const redactedName = redactComponent(name);
		const redactedValue = redactComponent(value);
		searchParams.append(redactedName, redactedValue);
		if (redactedName !== name || redactedValue !== value) searchChanged = true;
	}
	if (searchChanged) url.search = searchParams.toString();
	const decodedHash = decodeComponent(url.hash.slice(1));
	const redactedHash = redactComponent(decodedHash);
	if (redactedHash !== decodedHash) url.hash = redactedHash;
	const serialized = url.toString();
	return redactComponent(serialized) === serialized ? serialized : `${url.protocol}//redacted.invalid/%5BREDACTED%5D`;
}
function redactCaptureText(value) {
	return redactRegisteredSecretValues(value, () => REDACTED_CAPTURE_HEADER_VALUE);
}
function redactCapturePayload(value) {
	if (typeof value === "string") return redactCaptureText(value);
	if (!Buffer.isBuffer(value)) return value ?? null;
	if (!isUtf8(value)) return hasRegisteredSecretValuesForRedaction() ? REDACTED_CAPTURE_BINARY_PAYLOAD : value;
	const text = value.toString("utf8");
	const redacted = redactCaptureText(text);
	return redacted === text ? value : Buffer.from(redacted, "utf8");
}
function redactedCaptureJson(value, stringify = safeJsonString) {
	const serialized = stringify(value);
	return serialized === void 0 ? void 0 : redactCaptureText(serialized);
}
function createHttpCaptureEventBase(params) {
	return {
		sessionId: params.settings.sessionId,
		ts: Date.now(),
		sourceScope: "openclaw",
		sourceProcess: params.settings.sourceProcess,
		protocol: params.transport ?? protocolFromUrl(params.rawUrl),
		direction: params.direction,
		kind: params.kind,
		flowId: params.flowId,
		method: params.method,
		host: params.url.host,
		path: `${params.url.pathname}${params.url.search}`
	};
}
function installDebugProxyGlobalFetchPatch(owner, deps = {}) {
	const runtime = resolveRuntimeDeps(deps);
	const admission = owner.admission;
	const fetchTarget = runtime.fetchTarget;
	if (typeof fetchTarget.fetch !== "function") return;
	if (hasDebugProxyFetchPatch(fetchTarget, admission)) return;
	uninstallDebugProxyGlobalFetchPatch(deps);
	const fetchImpl = fetchTarget.fetch;
	const originalFetch = resolveDebugProxyFetchTransport(fetchImpl).bind(fetchTarget);
	const patchedFetch = async (input, init) => {
		const url = resolveUrlString(input);
		const normalizedInit = normalizeRequestInitHeadersForFetch(init);
		const admitted = Boolean(admission.current);
		let response;
		try {
			response = await originalFetch(input, normalizedInit);
		} catch (error) {
			const current = admission.current;
			if (admitted && current && url && /^https?:/i.test(url)) captureOwnedHttpError({
				url,
				method: (typeof Request !== "undefined" && input instanceof Request ? input.method : void 0) ?? normalizedInit?.method ?? "GET",
				error,
				meta: { captureOrigin: "global-fetch" }
			}, current);
			throw error;
		}
		const current = admission.current;
		if (admitted && current && url && /^https?:/i.test(url)) captureOwnedHttpExchange({
			url,
			method: (typeof Request !== "undefined" && input instanceof Request ? input.method : void 0) ?? normalizedInit?.method ?? "GET",
			requestHeaders: (typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0) ?? normalizedInit?.headers,
			requestBody: (typeof Request !== "undefined" && input instanceof Request ? input.body : void 0) ?? normalizedInit?.body ?? null,
			response,
			transport: "http",
			meta: {
				captureOrigin: "global-fetch",
				source: current.settings.sourceProcess
			}
		}, current);
		return response;
	};
	const mockState = fetchImpl.mock;
	if (typeof mockState === "object" && mockState !== null) patchedFetch.mock = mockState;
	registerDebugProxyFetchPatch(fetchTarget, originalFetch, patchedFetch, admission);
}
function initializeDebugProxyCapture(mode, resolved, deps = {}) {
	const settings = resolveEnabledDebugProxySettings(resolved);
	if (!settings) return;
	const owner = resolveCaptureOwner(settings, resolveRuntimeDeps(deps), {
		initialize: true,
		explicit: resolved !== void 0
	});
	if (!owner) return;
	owner.store.upsertSession({
		id: settings.sessionId,
		startedAt: Date.now(),
		mode,
		sourceScope: "openclaw",
		sourceProcess: settings.sourceProcess,
		proxyUrl: settings.proxyUrl
	});
	installDebugProxyGlobalFetchPatch(owner, deps);
}
/** Internal fetch seams retain this admission before awaiting network work. */
function prepareHttpCapture(resolved, deps = {}) {
	const settings = resolveEnabledDebugProxySettings(resolved);
	if (!settings) return;
	const admission = resolveCaptureOwner(settings, resolveRuntimeDeps(deps), { explicit: resolved !== void 0 })?.admission;
	return admission ? (params) => {
		if (admission.current) {
			if ("response" in params) captureOwnedHttpExchange(params, admission.current);
			else captureOwnedHttpError(params, admission.current);
		}
	} : void 0;
}
function captureHttpExchange(params, resolved, deps = {}) {
	prepareHttpCapture(resolved, deps)?.(params);
}
function captureOwnedHttpError(params, owner) {
	try {
		const captureUrl = redactCaptureUrl(params.url);
		owner.store.recordEvent({
			...createHttpCaptureEventBase({
				settings: owner.settings,
				rawUrl: captureUrl,
				url: new URL(captureUrl),
				transport: params.transport,
				direction: "local",
				kind: "error",
				flowId: params.flowId ?? randomUUID(),
				method: params.method
			}),
			errorText: redactCaptureText(params.error instanceof Error ? params.error.message : String(params.error)),
			metaJson: redactedCaptureJson(params.meta, owner.runtime.safeJsonString)
		});
	} catch (error) {
		reportCapturePersistenceFailure(owner, error);
	}
}
function captureOwnedHttpExchange(params, owner) {
	const { settings, runtime, store } = owner;
	const flowId = params.flowId ?? randomUUID();
	const captureUrl = redactCaptureUrl(params.url);
	const url = new URL(captureUrl);
	const requestBody = typeof params.requestBody === "string" || Buffer.isBuffer(params.requestBody) ? params.requestBody : null;
	const rawRequestContentType = params.requestHeaders ? isHeadersLike(params.requestHeaders) ? params.requestHeaders.get("content-type") ?? void 0 : params.requestHeaders["content-type"] : void 0;
	const requestContentType = rawRequestContentType === void 0 ? void 0 : redactCaptureText(rawRequestContentType);
	const rawResponseContentType = typeof params.response.headers?.get === "function" ? params.response.headers.get("content-type") ?? void 0 : void 0;
	const responseContentType = rawResponseContentType === void 0 ? void 0 : redactCaptureText(rawResponseContentType);
	try {
		const requestPayload = runtime.persistEventPayload(store, {
			data: redactCapturePayload(requestBody),
			contentType: requestContentType
		});
		store.recordEvent({
			...createHttpCaptureEventBase({
				settings,
				rawUrl: captureUrl,
				url,
				transport: params.transport,
				direction: "outbound",
				kind: "request",
				flowId,
				method: params.method
			}),
			contentType: requestContentType,
			headersJson: runtime.safeJsonString(redactedCaptureHeaders(params.requestHeaders, Array.isArray(params.meta?.sensitiveRequestHeaderNames) ? params.meta.sensitiveRequestHeaderNames.filter((name) => typeof name === "string") : void 0)),
			metaJson: redactedCaptureJson(params.meta, runtime.safeJsonString),
			...requestPayload
		});
	} catch (error) {
		reportCapturePersistenceFailure(owner, error);
		return;
	}
	const recordTerminal = (result) => {
		const failed = result.status === "failed";
		const payload = "buffer" in result ? runtime.persistEventPayload(store, {
			data: redactCapturePayload(result.buffer),
			contentType: responseContentType
		}) : {};
		store.recordEvent({
			...createHttpCaptureEventBase({
				settings,
				rawUrl: captureUrl,
				url,
				transport: params.transport,
				direction: failed ? "local" : "inbound",
				kind: failed ? "error" : "response",
				flowId,
				method: params.method
			}),
			status: params.response.status,
			contentType: responseContentType,
			headersJson: params.response.headers && typeof params.response.headers.entries === "function" ? runtime.safeJsonString(redactedCaptureHeaders(params.response.headers)) : void 0,
			errorText: failed ? redactCaptureText(result.error instanceof Error ? result.error.message : String(result.error)) : void 0,
			metaJson: redactedCaptureJson(result.status === "captured" ? params.meta : {
				...params.meta,
				bodyCapture: result.status,
				...failed ? { stage: "response-body" } : {}
			}, runtime.safeJsonString),
			...payload
		});
	};
	const recordMetadata = (status) => {
		try {
			recordTerminal({ status });
		} catch (error) {
			reportCapturePersistenceFailure(owner, error);
		}
	};
	if (typeof params.response.clone !== "function") {
		recordMetadata("unavailable");
		return;
	}
	const declaredLength = parseDeclaredCaptureContentLength(typeof params.response.headers?.get === "function" ? params.response.headers.get("content-length") : void 0);
	if (declaredLength !== void 0 && declaredLength > BigInt(MAX_CAPTURED_RESPONSE_BODY_BYTES)) {
		recordMetadata("too-large");
		return;
	}
	readCapturedResponseBodyBounded(params.response, MAX_CAPTURED_RESPONSE_BODY_BYTES, owner, recordTerminal, params.signal);
}
function captureWsEvent(params, resolved, deps = {}) {
	const settings = resolveEnabledDebugProxySettings(resolved);
	if (!settings) return;
	const owner = resolveCaptureOwner(settings, resolveRuntimeDeps(deps), { explicit: resolved !== void 0 });
	if (!owner) return;
	const { runtime, store } = owner;
	const captureUrl = redactCaptureUrl(params.url);
	const url = new URL(captureUrl);
	const payload = runtime.persistEventPayload(store, {
		data: redactCapturePayload(params.payload),
		contentType: "application/json"
	});
	store.recordEvent({
		sessionId: settings.sessionId,
		ts: Date.now(),
		sourceScope: "openclaw",
		sourceProcess: settings.sourceProcess,
		protocol: protocolFromUrl(captureUrl),
		direction: params.direction,
		kind: params.kind,
		flowId: params.flowId,
		host: url.host,
		path: `${url.pathname}${url.search}`,
		closeCode: params.closeCode,
		errorText: params.errorText === void 0 ? void 0 : redactCaptureText(params.errorText),
		metaJson: redactedCaptureJson(params.meta, runtime.safeJsonString),
		...payload
	});
}
//#endregion
export { finalizeDebugProxyCapture as a, DebugProxyCaptureStore as c, getDebugProxyCaptureStore as d, createDebugProxyCaptureReader as f, prepareHttpCapture as i, acquireDebugProxyCaptureStore as l, captureWsEvent as n, isDebugProxyGlobalFetchPatchInstalled as o, redactedCaptureHeaders as p, initializeDebugProxyCapture as r, resolveDebugProxyFetchTransport as s, captureHttpExchange as t, closeDebugProxyCaptureStore as u };
