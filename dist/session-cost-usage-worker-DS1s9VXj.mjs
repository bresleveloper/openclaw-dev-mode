import { d as toErrorObject, r as collectErrorGraphCandidates } from "./error-coercion-BwMr25F8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { r as resolveRealpathOrAbsolute } from "./boundary-path-CAv_plX7.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { t as sha256Base64Url } from "./crypto-digest-y6oZN-_F.mjs";
import { D as readSqliteDatabaseScopedWriteTokenForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { i as executeSqliteQuerySync, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { o as runSqliteReadSnapshotSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { t as encodeOpenClawStateWorkerError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { t as SessionMetadataUnavailableError } from "./session-metadata-unavailable-error-DwD7IuoE.mjs";
import { r as WorkerTaskError } from "./src-NEpyeLp1.mjs";
import "./worker-task-pool-D6ogd941.mjs";
import "./session-key-CSDERtm3.mjs";
import { o as parseUsageCountedSessionIdFromFileName } from "./transcript-file-names-BZ8jA63H.mjs";
import { c as isUsageCountedSessionTranscriptFileName } from "./artifacts-C6u8F4sP.mjs";
import { a as resolveSessionArtifactDirectory } from "./paths-YgcBNLgG.mjs";
import { n as openOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-open-DcexysGa.mjs";
import { i as decodeUsageCostRollupEnvelope, n as canUseUsageCostRollupForPartial, o as isUsageCostRollupFresh, r as decodeUsageCostRollup, t as USAGE_COST_ROLLUP_SCOPE } from "./session-cost-usage-rollup-codec-BkTlisOD.mjs";
import { c as transcriptEventJsonSql } from "./transcript-payload-Cu49oQKq.mjs";
import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { l as scanSessionTranscriptTree, n as isSessionTranscriptLeafControl, t as isCanonicalSessionTranscriptEntry } from "./transcript-tree-D61jhi_i.mjs";
import { n as parseSqliteSessionFileMarker, t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-CkjJ0jcJ.mjs";
import { n as selectVisibleTranscriptEvents } from "./transcript-visible-events-Ct6pwJvk.mjs";
import { f as readWithCanonicalSessionReaderContinuation } from "./session-canonical-key-B7chVWi3.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { i as readSessionColdTranscript } from "./session-cold-storage-state-CWFSrppd.mjs";
import { r as UsageCostHostEffectError } from "./session-transcript-read-pools-DSkIQlUd.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { n as listSqliteSessionEntriesFromDatabase } from "./session-accessor.sqlite-entry-list.read-BLfvs7b2.mjs";
import { n as materializeSessionArchiveForRead } from "./archive-compression-wxOTBVKt.mjs";
import { t as listTranscriptArchivesFromDatabase } from "./session-accessor.sqlite-archive-read-BF_Zh6lU.mjs";
import { r as listTranscriptInstancesFromDatabase } from "./session-accessor.sqlite-history-DHJfVW84.mjs";
import { n as readTranscriptStatsBatchFromDatabase } from "./session-accessor.sqlite-transcript-stats-CaGrryDT.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { r as isTransientSqliteError } from "./unhandled-rejections-DMp6_o-z.mjs";
import { a as createSessionUsageRollupData } from "./session-cost-usage-rollup-EJwp1CTx.mjs";
import { c as projectCostUsageSummary, l as projectSessionCostSummaries, o as parseUsageCostTranscriptRecord, s as createUsageDayKeyFormatter, t as createUsageRollupScan } from "./session-cost-usage-rollup-scan-C-xPJUWE.mjs";
import { n as decodeSessionColdRecords, r as readVerifiedSessionColdArchive } from "./session-cold-storage-codec-C4tx_d3q.mjs";
import { a as readSessionCostUsagePartitionsInDatabase, c as decodeUsageCostPartition, l as partitionUsageCostRollup, n as readSessionCostUsageRollupBodyInDatabase, o as readSessionCostUsageRollupWithPartitionsInDatabase, r as readSessionCostUsageRollupRowsInDatabase } from "./session-cost-usage-cache.kernel-BoZYDRAH.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/session-cost-usage-collection.ts
const USAGE_COST_TRANSCRIPT_STAT_CONCURRENCY = 32;
async function materializeUsageCostTranscriptSource(source, access) {
	if (source.kind === "sqlite") return source;
	const { sourcePath, stats: sourceStats } = source;
	const filePath = await access.materializeArchive(sourcePath);
	const stats = filePath === sourcePath ? sourceStats : await fs.promises.stat(filePath);
	return {
		filePath,
		sourcePath,
		kind: "jsonl",
		sessionId: source.sessionId,
		size: stats.size,
		mtimeMs: sourceStats.mtimeMs,
		device: stats.dev,
		inode: stats.ino
	};
}
async function listUsageCountedTranscriptFileSources(agentId, params) {
	const { sessionsDir, storePath } = params;
	let entries;
	try {
		entries = await fs.promises.readdir(sessionsDir, { withFileTypes: true });
	} catch (error) {
		if (error.code === "ENOENT") return [];
		throw error;
	}
	const transcripts = entries.filter((entry) => entry.isFile() && isUsageCountedSessionTranscriptFileName(entry.name));
	const archiveNames = transcripts.map((entry) => entry.name);
	const stores = new Map(transcripts.length > 0 ? params.listSqliteMetadataStores(storePath).map((databasePath) => [resolveRealpathOrAbsolute(databasePath), databasePath]) : []);
	const archivesByStore = [];
	for (const databasePath of stores.values()) archivesByStore.push(await params.readSqliteArchives(agentId, databasePath, archiveNames));
	const archives = new Map(archivesByStore.flat().map((archive) => [archive.archiveName, archive]));
	const tasks = transcripts.filter((entry) => (archives.get(entry.name)?.agentId ?? agentId) === agentId).map((entry) => async () => {
		const filePath = path.join(sessionsDir, entry.name);
		try {
			const stats = await fs.promises.stat(filePath);
			if (params.minMtimeMs !== void 0 && stats.mtimeMs < params.minMtimeMs) return;
			return {
				kind: "jsonl",
				sourcePath: filePath,
				sessionId: archives.get(entry.name)?.sessionId ?? parseUsageCountedSessionIdFromFileName(entry.name) ?? void 0,
				mtimeMs: stats.mtimeMs,
				stats
			};
		} catch (error) {
			if (error.code === "ENOENT") return;
			throw error;
		}
	});
	const { firstError, hasError, results } = await runTasksWithConcurrency({
		tasks,
		limit: USAGE_COST_TRANSCRIPT_STAT_CONCURRENCY
	});
	if (hasError) throw firstError;
	return results.filter((file) => Boolean(file));
}
async function readUsageCostSqliteFiles(markers, access) {
	const statsByIndex = await access.readSqliteStats(markers);
	return markers.map((marker, index) => {
		const stats = statsByIndex[index];
		if (!stats) return;
		const storePath = access.resolveSqliteStorePath(marker.agentId, marker.storePath);
		const filePath = formatSqliteSessionFileMarker({
			...marker,
			storePath
		});
		return {
			filePath,
			sourcePath: filePath,
			kind: "sqlite",
			mtimeMs: stats.lastMutationAtMs ?? 0,
			sessionId: marker.sessionId,
			size: stats.sizeBytes,
			eventCount: stats.eventCount,
			maxSeq: stats.maxSeq,
			generation: stats.generation,
			cold: stats.cold
		};
	});
}
async function listUsageCountedTranscriptSources(agentId, params) {
	const logicalAgentId = normalizeAgentId(agentId);
	const storePath = resolveSessionStorePathForScope({
		agentId,
		env: params.env,
		storePath: params.storePath ?? (params.sessionsDir ? path.join(params.sessionsDir, "sessions.json") : void 0)
	});
	const sessionsDir = params.sessionsDir ?? resolveSessionArtifactDirectory(storePath);
	const fileBacked = await listUsageCountedTranscriptFileSources(logicalAgentId, {
		...params,
		sessionsDir,
		storePath
	});
	const sqliteBacked = (await readUsageCostSqliteFiles((await params.listSqliteInstances(agentId, storePath)).filter((instance) => instance.agentId === logicalAgentId && (params.minMtimeMs === void 0 || instance.updatedAtMs >= params.minMtimeMs)).map((instance) => ({
		agentId: logicalAgentId,
		sessionId: instance.sessionId,
		storePath
	})), params)).filter((file) => file !== void 0);
	const sqliteSessionIds = new Set(sqliteBacked.map((file) => file.sessionId).filter(Boolean));
	return [...fileBacked.filter((file) => !file.sessionId || !sqliteSessionIds.has(file.sessionId)), ...sqliteBacked];
}
async function listUsageCountedTranscriptStats(agentId, params) {
	const sources = await listUsageCountedTranscriptSources(agentId, params);
	const { firstError, hasError, results } = await runTasksWithConcurrency({
		tasks: sources.map((source) => async () => {
			try {
				return await materializeUsageCostTranscriptSource(source, params);
			} catch (error) {
				if (hasErrnoCode(error, "ENOENT")) return;
				throw error;
			}
		}),
		limit: USAGE_COST_TRANSCRIPT_STAT_CONCURRENCY
	});
	if (hasError) throw firstError;
	return results.filter((file) => Boolean(file));
}
async function resolveUsageCostTranscriptSource(sessionFile, access) {
	const marker = parseSqliteSessionFileMarker(sessionFile);
	if (marker) return (await readUsageCostSqliteFiles([marker], access))[0];
	try {
		const stats = await fs.promises.stat(sessionFile);
		return {
			kind: "jsonl",
			sourcePath: sessionFile,
			sessionId: parseUsageCountedSessionIdFromFileName(path.basename(sessionFile)) ?? void 0,
			mtimeMs: stats.mtimeMs,
			stats
		};
	} catch {
		return;
	}
}
async function resolveUsageCostTranscriptSources(sessionFiles, access) {
	const markers = sessionFiles.map(parseSqliteSessionFileMarker);
	const sqliteFiles = await readUsageCostSqliteFiles(markers.filter((marker) => marker !== void 0), access);
	const requestedSource = (file, index) => file ? {
		...file,
		sourcePath: sessionFiles[index]
	} : void 0;
	if (sqliteFiles.length === sessionFiles.length) return sqliteFiles.map(requestedSource);
	let sqliteIndex = 0;
	const tasks = sessionFiles.map((sessionFile, index) => {
		if (markers[index]) {
			const file = requestedSource(sqliteFiles[sqliteIndex++], index);
			return async () => file;
		}
		return () => resolveUsageCostTranscriptSource(sessionFile, access);
	});
	const { results } = await runTasksWithConcurrency({
		tasks,
		limit: USAGE_COST_TRANSCRIPT_STAT_CONCURRENCY
	});
	return results;
}
async function materializeUsageCostTranscriptSourceBestEffort(source, access) {
	if (!source) return;
	try {
		return await materializeUsageCostTranscriptSource(source, access);
	} catch {
		return;
	}
}
async function resolveUsageCostTranscriptFiles(sessionFiles, access) {
	const sources = await resolveUsageCostTranscriptSources(sessionFiles, access);
	const { results } = await runTasksWithConcurrency({
		tasks: sources.map((source) => () => materializeUsageCostTranscriptSourceBestEffort(source, access)),
		limit: USAGE_COST_TRANSCRIPT_STAT_CONCURRENCY
	});
	return results;
}
/** Resolve cache keys before deciding which transcripts need freshness statistics. */
async function resolveUsageCostTranscriptPaths(sessionFiles, access) {
	const { results, hasError, firstError } = await runTasksWithConcurrency({
		tasks: sessionFiles.map((sessionFile) => async () => {
			const marker = parseSqliteSessionFileMarker(sessionFile);
			if (marker) {
				const storePath = access.resolveSqliteStorePath(marker.agentId, marker.storePath);
				return formatSqliteSessionFileMarker({
					...marker,
					storePath
				});
			}
			try {
				return await access.materializeArchive(sessionFile);
			} catch {
				return;
			}
		}),
		limit: USAGE_COST_TRANSCRIPT_STAT_CONCURRENCY
	});
	if (hasError) throw firstError;
	return results;
}
//#endregion
//#region src/infra/session-cost-usage-refresh-inputs.worker.ts
const rollups = new LruCache(64, {
	maxBytes: 8388608,
	sizeOf: ({ value }) => 2 * value.row.valueJson.length + (value.body?.blob?.byteLength ?? 0) + (value.body?.partitions.reduce((bytes, partition) => bytes + 2 * partition.valueJson.length + partition.blob.byteLength, 0) ?? 0)
});
function usageRefreshInputs(databasePath) {
	const key = (id) => JSON.stringify([databasePath, id]);
	return {
		rollupReceipt: () => readSqliteDatabaseScopedWriteTokenForPath(databasePath, USAGE_COST_ROLLUP_SCOPE),
		readRollup(filePath, receipt) {
			const entry = rollups.get(key(filePath));
			return receipt !== void 0 && entry?.receipt === receipt ? entry.value : void 0;
		},
		retainRollup(receipt, value) {
			if (receipt !== void 0) rollups.set(key(value.row.key), {
				receipt,
				value
			});
		}
	};
}
function createUsageCostCollectionAccess(params) {
	const { input, control, target, readStore } = params;
	const { location, operation } = input;
	const { env } = location;
	const transcriptFacts = /* @__PURE__ */ new Map();
	const transcriptKey = (marker) => {
		const database = target(marker.agentId, marker.storePath);
		return JSON.stringify([
			database.path,
			database.agentId,
			marker.sessionId
		]);
	};
	if (operation.kind === "sessions") for (const session of operation.sessions) {
		const file = session.transcriptFile;
		const marker = file && parseSqliteSessionFileMarker(session.sessionFile);
		if (marker && file) transcriptFacts.set(transcriptKey(marker), {
			generation: file.generation ?? null,
			cold: file.cold === true
		});
	}
	const access = {
		env,
		materializeArchive: (sourcePath) => control.runNativeSection(() => materializeSessionArchiveForRead(sourcePath)),
		listSqliteMetadataStores: () => input.archiveStorePaths,
		resolveSqliteStorePath: (agentId, storePath) => target(agentId, storePath).path,
		readSqliteArchives: (agentId, storePath, archiveNames) => {
			const database = target(agentId, storePath);
			return readStore(agentId, storePath, () => {
				const result = withOpenClawAgentDatabaseReadOnly((opened) => listTranscriptArchivesFromDatabase(opened, void 0, [], archiveNames), {
					...database,
					env
				});
				return result.found ? result.value : [];
			});
		},
		listSqliteInstances: async (agentId, storePath) => {
			const database = target(agentId, storePath);
			return readStore(agentId, storePath, () => {
				const result = withOpenClawAgentDatabaseReadOnly((opened) => readWithCanonicalSessionReaderContinuation(opened, void 0, () => {
					const currentEntries = new Map(listSqliteSessionEntriesFromDatabase(opened, {
						agentId,
						databaseAgentId: database.agentId,
						path: database.path,
						env,
						sessionKey: ""
					}, {
						agentId,
						storePath,
						env,
						clone: false,
						projection: "list"
					}).map(({ sessionKey, entry }) => [sessionKey, entry]));
					return listTranscriptInstancesFromDatabase({
						currentEntries,
						database: opened,
						options: {},
						entryProjection: "list"
					});
				}), {
					...database,
					env
				});
				return result.found ? result.value : [];
			});
		},
		readSqliteStats: async (markers) => {
			const result = Array(markers.length);
			const groups = /* @__PURE__ */ new Map();
			for (const [index, marker] of markers.entries()) {
				const database = target(marker.agentId, marker.storePath);
				const key = JSON.stringify(database);
				const group = groups.get(key) ?? [];
				group.push({
					marker,
					index
				});
				groups.set(key, group);
			}
			for (const group of groups.values()) {
				const marker = group[0].marker;
				const database = target(marker.agentId, marker.storePath);
				const loadedStats = await readStore(marker.agentId, marker.storePath, () => {
					try {
						const read = withOpenClawAgentDatabaseReadOnly((opened) => readTranscriptStatsBatchFromDatabase(opened, group.map((item) => item.marker.sessionId), { includeGeneration: true }), {
							...database,
							env
						});
						if (!read.found) return [];
						for (const [index, item] of group.entries()) {
							const facts = read.value[index];
							transcriptFacts.set(transcriptKey(item.marker), {
								generation: facts.generation ?? null,
								cold: facts.cold === true
							});
						}
						return read.value;
					} catch (error) {
						if (!(error instanceof SessionMetadataUnavailableError)) throw error;
						return [];
					}
				});
				for (const [index, item] of group.entries()) result[item.index] = loadedStats[index] ?? void 0;
			}
			return result;
		}
	};
	const inventory = async (sessionsDir) => listUsageCountedTranscriptStats(location.agentId, {
		...access,
		storePath: location.storePath,
		sessionsDir
	});
	return {
		access,
		inventory,
		readFacts: (marker) => transcriptFacts.get(transcriptKey(marker)),
		readColdArchive: (marker) => {
			const database = target(marker.agentId, marker.storePath);
			const result = withOpenClawAgentDatabaseReadOnly((opened) => runSqliteReadSnapshotSync(opened.db, () => {
				const archive = readSessionColdTranscript(opened.db, marker.sessionId);
				if (!archive) return;
				const archive_blob = archive.storage === "sqlite" ? executeSqliteQuerySync(opened.db, getSessionKysely(opened.db).selectFrom("session_transcript_cold_archives").select("archive_blob").where("session_id", "=", marker.sessionId)).rows[0]?.archive_blob ?? null : null;
				return {
					...archive,
					archive_blob
				};
			}), {
				...database,
				env
			});
			return result.found ? result.value : void 0;
		}
	};
}
//#endregion
//#region src/infra/session-cost-usage-worker-refresh.ts
/** Reuse resolved model prices across the bounded pages of one worker operation. */
function createUsageCostWorkerPriceResolver(resolveMissing) {
	const prices = /* @__PURE__ */ new Map();
	return async (pairs) => {
		const missing = new Map(pairs.filter((pair) => !prices.has(JSON.stringify(pair))).map((pair) => [JSON.stringify(pair), pair]));
		if (missing.size > 0) {
			const keys = [...missing.keys()];
			const costs = await resolveMissing([...missing.values()]);
			keys.forEach((key, index) => prices.set(key, costs[index]));
		}
		return pairs.map((pair) => prices.get(JSON.stringify(pair)));
	};
}
const USAGE_COST_FILE_ANCHOR_BYTES = 4096;
async function readJsonlAnchorHash(filePath, offset) {
	const start = Math.max(0, offset - USAGE_COST_FILE_ANCHOR_BYTES);
	const length = offset - start;
	if (length === 0) return sha256Base64Url("");
	const handle = await fs.promises.open(filePath, "r").catch(() => null);
	if (!handle) return;
	try {
		const buffer = Buffer.alloc(length);
		const { bytesRead } = await handle.read(buffer, 0, length, start);
		return bytesRead === length ? sha256Base64Url(buffer) : void 0;
	} finally {
		await handle.close().catch(() => void 0);
	}
}
function parseJsonlRecord(line) {
	return safeParseJsonRecord(line.toString("utf8").trim());
}
async function scanJsonlRange(params) {
	if (params.endOffset <= params.startOffset) return params.startOffset;
	const stream = fs.createReadStream(params.filePath, {
		start: params.startOffset,
		end: params.endOffset - 1
	});
	const lineChunks = [];
	let lineBytes = 0;
	let chunkStart = params.startOffset;
	let processedOffset = params.startOffset;
	try {
		for await (const chunk of stream) {
			params.checkProgress?.();
			const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
			let lineStart = 0;
			for (let newline = bytes.indexOf(10); newline >= 0; newline = bytes.indexOf(10, lineStart)) {
				const fragment = bytes.subarray(lineStart, newline);
				let line = fragment;
				if (lineChunks.length > 0) {
					lineChunks.push(fragment);
					line = Buffer.concat(lineChunks, lineBytes + fragment.length);
					lineChunks.length = 0;
					lineBytes = 0;
				}
				const record = parseJsonlRecord(line);
				if (record) {
					const pending = params.onRecord(record);
					if (pending) await pending;
				}
				processedOffset = chunkStart + newline + 1;
				lineStart = newline + 1;
			}
			if (lineStart < bytes.length) {
				const fragment = bytes.subarray(lineStart);
				lineChunks.push(fragment);
				lineBytes += fragment.length;
			}
			chunkStart += bytes.length;
		}
		const firstChunk = lineChunks[0];
		if (firstChunk) {
			const record = parseJsonlRecord(lineChunks.length === 1 ? firstChunk : Buffer.concat(lineChunks, lineBytes));
			if (record) {
				const pending = params.onRecord(record);
				if (pending) await pending;
				processedOffset = params.endOffset;
			}
		}
		return processedOffset;
	} finally {
		stream.destroy();
	}
}
async function scanJsonlUsageRollup(params) {
	const previousCheckpoint = params.previous?.checkpoint.kind === "jsonl" ? params.previous.checkpoint : void 0;
	const identityMatches = previousCheckpoint && previousCheckpoint.device === params.file.device && previousCheckpoint.inode === params.file.inode && previousCheckpoint.parsedOffset <= params.file.size && params.file.size > previousCheckpoint.observedSize;
	const previousAnchor = identityMatches ? await readJsonlAnchorHash(params.file.filePath, previousCheckpoint.parsedOffset) : void 0;
	const appendOnly = Boolean(identityMatches && previousAnchor === previousCheckpoint?.anchorHash && params.previous);
	const startOffset = appendOnly ? previousCheckpoint?.parsedOffset ?? 0 : 0;
	const scan = createUsageRollupScan({
		...params,
		appendOnly
	});
	let pendingRecords = [];
	const processedOffset = await scanJsonlRange({
		filePath: params.file.filePath,
		startOffset,
		endOffset: params.file.size,
		checkProgress: params.checkProgress,
		onRecord: (record) => {
			pendingRecords.push(record);
			if (pendingRecords.length === 128) {
				const batch = pendingRecords;
				pendingRecords = [];
				return scan.addEntries(batch.flatMap((item) => {
					const entry = parseUsageCostTranscriptRecord(item);
					return entry ? [entry] : [];
				}));
			}
		}
	});
	await scan.addEntries(pendingRecords.flatMap((record) => {
		const entry = parseUsageCostTranscriptRecord(record);
		return entry ? [entry] : [];
	}));
	const postStats = await fs.promises.stat(params.file.filePath);
	if (postStats.dev !== params.file.device || postStats.ino !== params.file.inode || postStats.size < params.file.size) throw new Error(`transcript changed identity while scanning: ${params.file.filePath}`);
	const anchorHash = await readJsonlAnchorHash(params.file.filePath, processedOffset);
	if (!anchorHash) throw new Error(`transcript checkpoint unavailable: ${params.file.filePath}`);
	return scan.finish({
		kind: "jsonl",
		parsedOffset: processedOffset,
		observedSize: params.file.size,
		observedMtimeMs: params.file.mtimeMs,
		device: params.file.device ?? 0,
		inode: params.file.inode ?? 0,
		anchorHash
	});
}
function selectIncrementalSqliteRecords(records, previousLeafId) {
	let visibleLeafId = previousLeafId;
	for (const record of records) {
		if (isSessionTranscriptLeafControl(record) || record.appendMode === "side") return;
		if (!isCanonicalSessionTranscriptEntry(record)) continue;
		const id = typeof record.id === "string" && record.id ? record.id : void 0;
		if (!id) return;
		if (Object.hasOwn(record, "parentId")) {
			if ((record.parentId === null ? void 0 : record.parentId) !== visibleLeafId) return;
		}
		visibleLeafId = id;
	}
	return { visibleLeafId };
}
function sqliteCheckpointAnchorHash(event) {
	return sha256Base64Url(JSON.stringify(event));
}
async function scanSqliteUsageRollup(params) {
	const scope = parseSqliteSessionFileMarker(params.file.filePath);
	if (!scope) throw new Error(`invalid SQLite transcript marker: ${params.file.filePath}`);
	const maxSeq = params.file.maxSeq ?? 0;
	const eventCount = params.file.eventCount ?? 0;
	const generation = await params.readGeneration(scope);
	const previousCheckpoint = params.previous?.checkpoint.kind === "sqlite" ? params.previous.checkpoint : void 0;
	const appendCandidate = Boolean(params.previous && previousCheckpoint && generation !== void 0 && previousCheckpoint.generation === generation && previousCheckpoint.maxSeq < maxSeq && previousCheckpoint.eventCount < eventCount);
	const afterSeq = appendCandidate ? previousCheckpoint?.maxSeq ?? 0 : 0;
	let anchorHash = sha256Base64Url("");
	const readRange = async (startSeq, endSeq) => {
		let after = startSeq;
		const records = [];
		while (after < endSeq) {
			params.checkProgress?.();
			const lastSeq = await params.readRows(scope, after, endSeq, (seq, event) => {
				const record = {
					seq,
					usageEntry: isRecord(event) ? parseUsageCostTranscriptRecord(event) : null
				};
				if (isRecord(event)) {
					for (const key of [
						"type",
						"id",
						"parentId",
						"targetId",
						"appendParentId",
						"appendMode"
					]) if (Object.hasOwn(event, key)) record[key] = event[key];
				}
				if (seq === maxSeq) anchorHash = sqliteCheckpointAnchorHash(event);
				records.push(record);
			});
			params.checkProgress?.();
			if (lastSeq <= after) throw new Error(`SQLite transcript changed while scanning: ${params.file.filePath}`);
			after = lastSeq;
		}
		return records;
	};
	let records = await readRange(afterSeq, maxSeq);
	const incremental = appendCandidate ? selectIncrementalSqliteRecords(records, previousCheckpoint?.visibleLeafId) : void 0;
	const appendOnly = Boolean(incremental && params.previous);
	if (!appendOnly && afterSeq > 0) records = [...await readRange(0, afterSeq), ...records];
	const selected = appendOnly ? records.filter(isCanonicalSessionTranscriptEntry) : selectVisibleTranscriptEvents(records);
	const scan = createUsageRollupScan({
		...params,
		appendOnly
	});
	await scan.addEntries(selected.flatMap((record) => record.usageEntry ? [record.usageEntry] : []));
	const visibleLeafId = appendOnly ? incremental?.visibleLeafId : scanSessionTranscriptTree(records).leafId ?? void 0;
	return scan.finish({
		kind: "sqlite",
		maxSeq,
		eventCount,
		size: params.file.size,
		mtimeMs: params.file.mtimeMs,
		anchorHash,
		...generation !== void 0 ? { generation } : {},
		...visibleLeafId ? { visibleLeafId } : {}
	});
}
async function scanUsageCostRollupInWorker(params) {
	params.checkProgress?.();
	return params.file.kind === "sqlite" ? scanSqliteUsageRollup(params) : scanJsonlUsageRollup(params);
}
//#endregion
//#region src/infra/session-cost-usage-worker-report.ts
/** Prepare bounded cache inputs synchronously inside their shared read snapshot. */
function prepareUsageCostReportEntry(params) {
	params.throwIfCancelled();
	const blob = params.body(params.row);
	const envelope = decodeUsageCostRollupEnvelope(params.row.valueJson, params.pricingFingerprint);
	params.throwIfCancelled();
	const startMs = params.startMs ?? Number.NEGATIVE_INFINITY;
	const endMs = params.endMs ?? Number.POSITIVE_INFINITY;
	const aligned = (!Number.isFinite(startMs) || startMs % 9e5 === 0) && (!Number.isFinite(endMs) || (endMs + 1) % 9e5 === 0);
	const selected = blob && envelope?.projection && aligned ? params.partitions(params.row.key) : void 0;
	return {
		valueJson: params.row.valueJson,
		blob,
		envelope,
		selected
	};
}
/** Project captured cache inputs; replay opens its own bounded transcript reads. */
async function readUsageCostReportEntry(params) {
	const { file, scan } = params;
	params.throwIfCancelled();
	const { valueJson, blob, envelope, selected } = params.prepared;
	const cached = decodeUsageCostRollup(valueJson, scan.pricingFingerprint, blob, params.cacheBudget);
	params.throwIfCancelled();
	if (!cached || !envelope?.projection) return cached;
	if (!file) return;
	const startMs = params.startMs ?? Number.NEGATIVE_INFINITY;
	const endMs = params.endMs ?? Number.POSITIVE_INFINITY;
	if (selected) {
		const startMonth = Number.isFinite(startMs) ? `${new Date(startMs).toISOString().slice(0, 7)}-01` : "";
		const endMonth = Number.isFinite(endMs) ? `${new Date(endMs).toISOString().slice(0, 7)}-01` : "￿";
		const expected = envelope.projection.dates.filter((date) => {
			return date >= startMonth && date <= endMonth;
		});
		if (selected.length !== expected.length) return;
		const rollup = createSessionUsageRollupData();
		rollup.untimestamped = cached.rollup.untimestamped;
		for (const partition of selected) {
			params.throwIfCancelled();
			const day = decodeUsageCostPartition(partition.valueJson, partition.blob, params.cacheBudget);
			if (day === null) return null;
			if (!day) return;
			for (const [key, bucket] of Object.entries(day.buckets)) if (bucket.timestampMs >= startMs && bucket.timestampMs <= endMs) rollup.buckets[key] = bucket;
		}
		const formatDay = createUsageDayKeyFormatter(params.dayBucket);
		if (Object.values(rollup.buckets).every((bucket) => formatDay(new Date(bucket.firstTimestampMs ?? bucket.timestampMs)) === formatDay(new Date(bucket.lastTimestampMs ?? bucket.timestampMs)))) return {
			...cached,
			rollup
		};
	}
	const checkpoint = cached.checkpoint;
	const snapshotFile = checkpoint.kind === "sqlite" ? {
		...file,
		maxSeq: checkpoint.maxSeq,
		eventCount: checkpoint.eventCount,
		size: checkpoint.size,
		mtimeMs: checkpoint.mtimeMs
	} : {
		...file,
		size: checkpoint.observedSize,
		mtimeMs: checkpoint.observedMtimeMs
	};
	const budget = params.replayBudget;
	if (snapshotFile.size > budget.remainingBytes || performance.now() >= budget.deadline) return null;
	budget.remainingBytes -= snapshotFile.size;
	const exhausted = /* @__PURE__ */ new Error("Usage report replay budget exhausted");
	const checkProgress = () => {
		params.throwIfCancelled();
		if (performance.now() >= budget.deadline) throw exhausted;
	};
	const canonical = await scanUsageCostRollupInWorker({
		...scan,
		file: snapshotFile,
		checkProgress,
		resolveCosts: async (pairs) => {
			checkProgress();
			const costs = await scan.resolveCosts(pairs);
			checkProgress();
			return costs;
		}
	}).catch((error) => {
		params.throwIfCancelled();
		if (error === exhausted) return null;
		if (error instanceof UsageCostHostEffectError || error instanceof WorkerTaskError) throw error;
	});
	params.throwIfCancelled();
	if (canonical === null) return null;
	if (!canonical || canonical.checkpoint.anchorHash !== checkpoint.anchorHash) return;
	return {
		...canonical,
		scannedAt: cached.scannedAt
	};
}
//#endregion
//#region src/infra/session-cost-usage-worker.ts
async function executeUsageCostWorker(input, channel, control, readDatabase) {
	const { location, operation } = input;
	const { env } = location;
	channel.consumeInput();
	const host = async (kind, value, transfer = []) => {
		control.throwIfCancelled();
		const response = await channel.request({
			kind,
			input: value
		}, transfer);
		const reply = response.input;
		response.consumed();
		if (!reply.ok) throw new UsageCostHostEffectError(reply.origin, reply.message);
		control.throwIfCancelled();
		return reply.value;
	};
	const target = (agentId, storePath) => {
		const binding = input.stores.find((entry) => entry.agentId === agentId && entry.storePath === storePath)?.database;
		const owned = input.databases.find((entry) => entry.agentId === binding?.agentId && entry.path === binding.path);
		if (!owned) throw new Error("Usage worker requested an unowned database");
		return owned;
	};
	const readStore = (agentId, storePath, read) => {
		const database = target(agentId, storePath);
		return control.runNativeSection(() => readDatabase(database, read));
	};
	const refreshInputs = operation.kind === "refresh" ? usageRefreshInputs(location.databasePath) : void 0;
	const { access, readFacts, readColdArchive, inventory } = createUsageCostCollectionAccess({
		input,
		control,
		target,
		readStore
	});
	if (operation.kind === "inventory") {
		const selected = operation.sessionFiles;
		return {
			kind: "inventory",
			files: (selected ? (await resolveUsageCostTranscriptSources(selected, access)).filter((file) => file !== void 0) : await listUsageCountedTranscriptSources(location.agentId, {
				...access,
				storePath: location.storePath,
				minMtimeMs: operation.minMtimeMs
			})).map((file) => ({
				kind: file.kind,
				sourcePath: file.sourcePath,
				sessionId: file.sessionId,
				mtimeMs: file.mtimeMs,
				transcriptFile: file.kind === "sqlite" ? file : void 0
			}))
		};
	}
	const selectedFiles = operation.kind === "refresh" && operation.sessionFiles ? await resolveUsageCostTranscriptFiles(operation.sessionFiles, access) : [];
	const sessionPaths = operation.kind === "sessions" ? await resolveUsageCostTranscriptPaths(operation.sessions.map((session) => session.sessionFile), access) : void 0;
	const selectedPaths = sessionPaths ? sessionPaths.filter((file) => file !== void 0) : operation.kind === "refresh" && operation.sessionFiles ? selectedFiles.flatMap((file) => file ? [file.filePath] : []) : void 0;
	const cacheDatabase = input.databases.find((entry) => entry.path === location.databasePath && entry.agentId === location.agentId);
	if (!cacheDatabase) throw new Error("Usage cache database is not owned by this worker operation");
	const readCache = (read, missing) => {
		const result = withOpenClawAgentDatabaseReadOnly(({ db }) => read(db), {
			...cacheDatabase,
			env
		});
		return result.found ? result.value : missing;
	};
	const readMetadata = async () => {
		const receipt = refreshInputs?.rollupReceipt();
		const cached = selectedPaths?.flatMap((filePath) => {
			const value = refreshInputs?.readRollup(filePath, receipt);
			return value ? [value.row] : [];
		}) ?? [];
		const cachedKeys = new Set(cached.map((row) => row.key));
		const missing = selectedPaths?.filter((filePath) => !cachedKeys.has(filePath));
		if (missing?.length === 0) return {
			found: true,
			rows: cached
		};
		return control.runNativeSection(() => readDatabase(cacheDatabase, () => {
			try {
				const result = withOpenClawAgentDatabaseReadOnly((opened) => readSessionCostUsageRollupRowsInDatabase(opened.db, missing), {
					...cacheDatabase,
					env
				});
				const rows = result.found ? result.value : [];
				for (const row of rows) refreshInputs?.retainRollup(receipt, { row });
				return {
					found: result.found,
					rows: [...cached, ...rows]
				};
			} catch (error) {
				if (!isTransientSqliteError(error)) throw error;
				return {
					found: false,
					rows: []
				};
			}
		}));
	};
	const readBody = (row) => control.runNativeSection(() => readDatabase(cacheDatabase, () => readCache((db) => readSessionCostUsageRollupBodyInDatabase(db, row), void 0)));
	const readPartitionedBody = async (row) => {
		const receipt = refreshInputs?.rollupReceipt();
		const cached = refreshInputs?.readRollup(row.key, receipt);
		if (cached?.body && cached.row.updatedAt === row.updatedAt && cached.row.valueJson === row.valueJson) return cached.body;
		const body = await control.runNativeSection(() => readDatabase(cacheDatabase, () => readCache((db) => readSessionCostUsageRollupWithPartitionsInDatabase(db, row), void 0)));
		if (body) refreshInputs?.retainRollup(receipt, {
			row,
			body
		});
		return body;
	};
	const resolveCosts = createUsageCostWorkerPriceResolver((pairs) => host("pricing", pairs));
	const readGeneration = async (marker) => readFacts(marker)?.generation;
	const readRows = async (marker, afterSeq, throughSeq, consume) => {
		if (throughSeq <= afterSeq) return afterSeq;
		const database = target(marker.agentId, marker.storePath);
		return readStore(marker.agentId, marker.storePath, async () => {
			if (readFacts(marker)?.cold) {
				const archive = readColdArchive(marker);
				if (archive) {
					const bytes = await readVerifiedSessionColdArchive({
						storePath: database.path,
						archive
					});
					control.throwIfCancelled();
					let lastSeq = afterSeq;
					for (const record of decodeSessionColdRecords(bytes, archive)) {
						control.throwIfCancelled();
						if (record.kind === "event" && record.row.seq > afterSeq && record.row.seq <= throughSeq) {
							consume(record.row.seq, JSON.parse(record.row.event_json));
							lastSeq = record.row.seq;
						}
					}
					return lastSeq;
				}
			}
			const result = withOpenClawAgentDatabaseReadOnly((opened) => {
				const query = getSessionKysely(opened.db).selectFrom("transcript_events").select(["seq", transcriptEventJsonSql(opened.db).as("event_json")]).where("session_id", "=", marker.sessionId).where("seq", ">", afterSeq).where("seq", "<=", throughSeq).orderBy("seq", "asc").limit(1024);
				let lastSeq = afterSeq;
				let bytes = 0;
				for (const row of iterateSqliteQuerySync(opened.db, query)) {
					const size = Buffer.byteLength(row.event_json);
					if (lastSeq > afterSeq && bytes + size > 8388608) break;
					consume(row.seq, JSON.parse(row.event_json));
					lastSeq = row.seq;
					bytes += size;
				}
				return lastSeq;
			}, {
				...database,
				env
			});
			return result.found ? result.value : afterSeq;
		});
	};
	if (operation.kind === "summary" || operation.kind === "sessions") {
		const replayBudget = {
			remainingBytes: 16777216,
			deadline: performance.now() + 5e3
		};
		const metadataLimit = Math.min(selectedPaths ? new Set(selectedPaths).size : 2e4, 2e4);
		const cacheBudget = {
			remainingBytes: (operation.kind === "sessions" ? operation.reportBudgetBytes ?? 33554432 : 33554432) - metadataLimit * 256,
			deferredPaths: /* @__PURE__ */ new Set(),
			deferredMetadata: /* @__PURE__ */ new Map(),
			metadataLimit,
			pricingFingerprint: operation.pricingFingerprint
		};
		const project = async (rows, entries) => {
			const byPath = new Map(rows.map((row) => [row.key, row]));
			const sessions = operation.kind === "sessions" ? operation.sessions.filter((_, index) => byPath.has(sessionPaths?.[index] ?? "") || cacheBudget.deferredPaths.has(sessionPaths?.[index] ?? "")) : [];
			const discovered = sessions.flatMap((session) => session.transcriptFile ? [session.transcriptFile] : []);
			for (const file of discovered) {
				const checkpoint = entries.get(file.filePath)?.envelope?.checkpoint;
				if (checkpoint?.kind !== "sqlite") continue;
				const rewritten = (checkpoint.generation ?? null) !== (file.generation ?? null);
				if (rewritten) cacheBudget.deferredPaths.add(file.filePath);
				if (rewritten ? checkpoint.mtimeMs >= file.mtimeMs : checkpoint.maxSeq > (file.maxSeq ?? 0)) Object.assign(file, {
					size: checkpoint.size,
					mtimeMs: checkpoint.mtimeMs,
					eventCount: checkpoint.eventCount,
					maxSeq: checkpoint.maxSeq
				});
			}
			const reportFiles = operation.kind === "summary" ? await inventory() : [...discovered, ...await resolveUsageCostTranscriptFiles(sessions.filter((session) => !session.transcriptFile).map((session) => session.sessionFile), access)];
			const filesByPath = new Map(reportFiles.flatMap((file) => file ? [[file.filePath, file]] : []));
			const consumed = /* @__PURE__ */ new Set();
			const invalidRows = /* @__PURE__ */ new Map();
			const source = {
				deferredPaths: cacheBudget.deferredPaths,
				deferredMetadata: cacheBudget.deferredMetadata,
				readRow(filePath) {
					consumed.add(filePath);
					return byPath.get(filePath);
				},
				readBody: (row) => entries.get(row.key)?.blob ?? null,
				readEntry: (row) => readUsageCostReportEntry({
					prepared: entries.get(row.key),
					file: filesByPath.get(row.key),
					startMs: operation.startMs,
					endMs: operation.endMs,
					dayBucket: operation.dayBucket,
					throwIfCancelled: control.throwIfCancelled,
					replayBudget,
					cacheBudget,
					scan: {
						pricingFingerprint: operation.pricingFingerprint,
						resolveCosts,
						readGeneration,
						readRows
					}
				}),
				onInvalidBody(key) {
					const row = byPath.get(key);
					if (row) invalidRows.set(key, row);
				},
				remainingRows: (function* () {
					for (const row of rows) if (!consumed.has(row.key)) yield row;
				})()
			};
			const result = operation.kind === "summary" ? {
				kind: "summary",
				summary: await projectCostUsageSummary({
					...source,
					...operation,
					files: reportFiles.filter((file) => file !== void 0)
				})
			} : {
				kind: "sessions",
				...await projectSessionCostSummaries({
					...source,
					...operation,
					files: (sessionPaths ?? []).map((filePath) => filesByPath.get(filePath ?? ""))
				}),
				remainingReportBytes: Math.max(0, cacheBudget.remainingBytes)
			};
			control.throwIfCancelled();
			return {
				...result,
				invalidRows: [...invalidRows.values()]
			};
		};
		try {
			const snapshot = await control.runNativeSection(() => {
				const opened = openOpenClawAgentDatabaseReadOnly({
					...cacheDatabase,
					env
				});
				if (!opened.found) return {
					rows: [],
					entries: /* @__PURE__ */ new Map()
				};
				const { db } = opened.database;
				try {
					return runSqliteReadSnapshotSync(db, () => {
						const bodies = /* @__PURE__ */ new Map();
						const rows = readSessionCostUsageRollupRowsInDatabase(db, selectedPaths, {
							includeBody: true,
							throwIfCancelled: control.throwIfCancelled,
							budget: cacheBudget
						}).map(({ blob, ...row }) => {
							bodies.set(row.key, blob);
							return row;
						});
						let partitions;
						return {
							rows,
							entries: new Map(rows.map((row) => [row.key, prepareUsageCostReportEntry({
								row,
								...operation,
								throwIfCancelled: control.throwIfCancelled,
								body: (cachedRow) => bodies.get(cachedRow.key) ?? null,
								partitions: (filePath) => {
									partitions ??= readSessionCostUsagePartitionsInDatabase(db, rows.filter((cachedRow) => !cacheBudget.deferredPaths.has(cachedRow.key)).map((cachedRow) => cachedRow.key), operation.startMs, operation.endMs, control.throwIfCancelled, cacheBudget);
									return partitions.get(filePath) ?? [];
								}
							})]))
						};
					});
				} finally {
					opened.database.close();
				}
			});
			return await project(snapshot.rows, snapshot.entries);
		} catch (error) {
			if (!isTransientSqliteError(error)) throw error;
			return project([], /* @__PURE__ */ new Map());
		}
	}
	const { found: cacheFound, rows } = await readMetadata();
	const byPath = new Map(rows.map((row) => [row.key, row]));
	const requestedFiles = selectedFiles.filter((file) => file !== void 0);
	if (requestedFiles.length !== (operation.sessionFiles?.length ?? 0)) throw new WorkerTaskError("A requested usage transcript is unavailable", "unavailable");
	const files = operation.sessionFiles ? requestedFiles : await inventory(operation.sessionsDir);
	const filesByPath = new Map(files.map((file) => [file.filePath, file]));
	let pruned = false;
	for (const row of rows) {
		if (filesByPath.has(row.key)) continue;
		pruned = true;
		const bytes = new TextEncoder().encode(row.valueJson);
		await host("prune-row", {
			key: row.key,
			value: bytes,
			updatedAt: row.updatedAt
		}, [bytes.buffer]);
	}
	if (!operation.sessionFiles && cacheFound) await host("prune", {});
	const minMtimeMs = operation.sessionFiles ? void 0 : operation.startMs;
	const rebuildByPath = new Map(operation.rebuildRows?.map((row) => [row.key, row]));
	const stale = [];
	for (const file of filesByPath.values()) {
		if (minMtimeMs !== void 0 && file.mtimeMs < minMtimeMs) continue;
		const row = byPath.get(file.filePath);
		const envelope = row ? decodeUsageCostRollupEnvelope(row.valueJson, operation.pricingFingerprint) : void 0;
		const invalid = rebuildByPath.get(file.filePath);
		const rebuild = row && (invalid?.valueJson === row.valueJson && invalid.updatedAt === row.updatedAt || row.bodyBytes !== void 0 && envelope?.body.storedBytes !== row.bodyBytes);
		if (rebuild || !envelope?.projection || !isUsageCostRollupFresh({
			checkpoint: envelope?.checkpoint,
			file
		})) stale.push({
			file,
			row,
			envelope,
			rebuild
		});
	}
	stale.sort((a, b) => a.file.size - b.file.size || a.file.filePath.localeCompare(b.file.filePath));
	const maxFiles = operation.maxFiles !== void 0 && Number.isFinite(operation.maxFiles) && operation.maxFiles > 0 ? Math.floor(operation.maxFiles) : void 0;
	const batchDeadline = maxFiles ? performance.now() + 1e4 : Infinity;
	let completedFiles = 0;
	let changed = pruned;
	for (const { file, row, envelope, rebuild } of stale) {
		if (completedFiles > 0 && (completedFiles === maxFiles || performance.now() >= batchDeadline)) break;
		control.throwIfCancelled();
		await host("refresh-session", { sessionFile: file.filePath });
		let previous;
		let priorPartitions = [];
		if (!rebuild && row && envelope && canUseUsageCostRollupForPartial({
			checkpoint: envelope.checkpoint,
			file
		})) {
			let body;
			if (envelope.projection) {
				const snapshot = await readPartitionedBody(row);
				body = snapshot;
				priorPartitions = snapshot?.partitions ?? [];
			} else body = await readBody(row);
			previous = body ? decodeUsageCostRollup(row.valueJson, operation.pricingFingerprint, body.blob) : void 0;
		}
		if (previous && envelope?.projection) {
			if (priorPartitions.length !== envelope.projection.dates.length) previous = void 0;
			else for (const partition of priorPartitions) {
				const day = decodeUsageCostPartition(partition.valueJson, partition.blob);
				if (!day) {
					previous = void 0;
					break;
				}
				Object.assign(previous.rollup.buckets, day.buckets);
			}
		}
		const entry = previous && !envelope?.projection && isUsageCostRollupFresh({
			checkpoint: previous.checkpoint,
			file
		}) ? {
			...previous,
			version: 7
		} : await scanUsageCostRollupInWorker({
			file,
			previous,
			pricingFingerprint: operation.pricingFingerprint,
			resolveCosts,
			readGeneration,
			readRows,
			checkProgress: control.throwIfCancelled
		});
		const { valueJson, blob, partitions } = partitionUsageCostRollup(entry);
		const replacePartitions = previous === void 0 || !envelope?.projection;
		const previousPartitions = new Map(priorPartitions.map((partition) => [partition.date, partition.valueJson]));
		const changedPartitions = partitions.filter((partition) => replacePartitions || previousPartitions.get(partition.date) !== partition.valueJson);
		const dates = new Set(partitions.map((partition) => partition.date));
		const removedDates = envelope?.projection?.dates.filter((date) => !dates.has(date)) ?? [];
		const value = new TextEncoder().encode(valueJson);
		const retainedBody = 2 * valueJson.length + blob.byteLength + partitions.reduce((bytes, partition) => bytes + 2 * partition.valueJson.length + partition.blob.byteLength, 0) <= 8388608 ? {
			blob: Uint8Array.from(blob),
			partitions: structuredClone(partitions)
		} : void 0;
		if (!await host("write", {
			key: file.filePath,
			value,
			blob,
			updatedAt: entry.scannedAt,
			partitions: changedPartitions,
			removedDates,
			replacePartitions
		}, [
			value.buffer,
			blob.buffer,
			...changedPartitions.map((partition) => partition.blob.buffer)
		])) throw new Error(`usage rollup changed while refreshing: ${file.filePath}`);
		if (retainedBody) refreshInputs?.retainRollup(refreshInputs.rollupReceipt(), {
			row: {
				key: file.filePath,
				valueJson,
				updatedAt: entry.scannedAt
			},
			body: retainedBody
		});
		changed = true;
		completedFiles++;
	}
	if (stale.length === completedFiles) return {
		kind: "refresh",
		changed
	};
	const remaining = stale.slice(completedFiles).map(({ file }) => file);
	const remainingPaths = new Set(remaining.map((file) => file.filePath));
	return {
		kind: "refresh",
		changed,
		remainingFiles: (operation.sessionFiles ? requestedFiles.filter((file) => remainingPaths.has(file.filePath)) : remaining).map((file) => ({
			sessionFile: file.sourcePath,
			rollupId: file.filePath
		}))
	};
}
function usageCostWorkerFailure(error) {
	const hostFailure = collectErrorGraphCandidates(error, (entry) => entry instanceof Error ? [entry.cause, ...entry instanceof AggregateError ? entry.errors : []] : []).find((entry) => entry instanceof UsageCostHostEffectError);
	return {
		ok: false,
		error: {
			message: toErrorObject(error, "Usage cost worker failed").message,
			error: encodeOpenClawStateWorkerError(error, { includeOrdinary: true }),
			...hostFailure ? {
				hostOrigin: hostFailure.origin,
				hostFailureOnly: error === hostFailure
			} : {}
		}
	};
}
//#endregion
export { executeUsageCostWorker, usageCostWorkerFailure };
