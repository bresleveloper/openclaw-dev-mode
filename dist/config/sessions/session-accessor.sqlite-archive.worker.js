import { f as toStringifiedError } from "../../error-coercion-BwMr25F8.mjs";
import { c as isRecord } from "../../record-coerce-TIsquoVR.mjs";
import { i as routeLogsToStderr } from "../../console-CML7QnOp.mjs";
import { n as assertDatabasePathIdentity } from "../../sqlite-worker-identity-DLqVBf5J.mjs";
import { H as withSqliteDatabaseAdmissionExchange } from "../../sqlite-database-admission-CqdNF9iE.mjs";
import { a as encodeNativeWorkerFailure } from "../../resource-protocol-Bh2jG53d.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely, s as iterateSqliteQuerySync } from "../../kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "../../sqlite-transaction-CpDyZPQ0.mjs";
import { r as exchangeSqliteDatabaseAdmissions, t as bindSqliteDatabaseAdmissionUpstream } from "../../sqlite-worker-database-admission-relay-CPqKkejS.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "../../openclaw-agent-db-identity-CnM2kzVa.mjs";
import { a as withFreshOpenClawAgentDatabaseReadOnly } from "../../openclaw-agent-db-readonly-open-DcexysGa.mjs";
import { c as transcriptEventJsonSql } from "../../transcript-payload-Cu49oQKq.mjs";
import { a as resolveSqliteTranscriptArchivePath, n as hashSessionArchiveBytes, r as publishEncodedSessionTranscriptArchive, t as MAX_MATERIALIZED_ARCHIVE_BATCH_BYTES } from "../../session-accessor.sqlite-archive-artifact-2spMMDfj.mjs";
import { n as readSessionStateDeleteSnapshot, r as sqliteSessionStateDeleteSnapshotsEqual, t as planSessionStateDeleteIfUnreferenced } from "../../session-accessor.sqlite-delete-snapshot-C7Nn_aNm.mjs";
import { n as isRecentHistoricalSessionId } from "../../session-accessor.sqlite-history-recency-CKaFMd_L.mjs";
import { n as scheduleWorkerIdleGc, t as cancelWorkerIdleGc } from "../../worker-idle-gc-DrnCHdyX.mjs";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { MessagePort, parentPort, threadId, workerData } from "node:worker_threads";
import { on } from "node:events";
import zlib from "node:zlib";
import { Transform } from "node:stream";
import { pipeline as pipeline$1 } from "node:stream/promises";
//#region src/config/sessions/session-accessor.sqlite-archive.worker.ts
/** Worker entrypoint for SQLite transcript archive materialization off the gateway event loop. */
const TRANSCRIPT_ARCHIVE_WRITE_BUFFER_BYTES = 65536;
function stageTranscriptArchiveContent(database, sessionId, stagedPath) {
	const fd = fs.openSync(stagedPath, "wx", 384);
	let rowCount = 0;
	const bufferedParts = [];
	let bufferedBytes = 0;
	const flush = () => {
		if (bufferedBytes === 0) return;
		fs.writeFileSync(fd, bufferedParts.join(""));
		bufferedParts.length = 0;
		bufferedBytes = 0;
	};
	try {
		const db = getNodeSqliteKysely(database);
		for (const row of iterateSqliteQuerySync(database, db.selectFrom("transcript_events").select(transcriptEventJsonSql(database).as("event_json")).where("session_id", "=", sessionId).orderBy("seq", "asc"))) {
			if (typeof row.event_json !== "string") throw new Error(`Invalid transcript event row for ${sessionId}`);
			const rowBytes = Buffer.byteLength(row.event_json, "utf8") + 1;
			if (bufferedBytes + rowBytes > TRANSCRIPT_ARCHIVE_WRITE_BUFFER_BYTES) flush();
			if (rowBytes >= TRANSCRIPT_ARCHIVE_WRITE_BUFFER_BYTES) {
				fs.writeFileSync(fd, row.event_json);
				fs.writeFileSync(fd, "\n");
			} else {
				bufferedParts.push(row.event_json, "\n");
				bufferedBytes += rowBytes;
			}
			rowCount += 1;
		}
		flush();
		fs.fsyncSync(fd);
	} finally {
		fs.closeSync(fd);
	}
	return rowCount;
}
function createArchiveByteLimitTransform() {
	let encodedBytes = 0;
	return new Transform({ transform(chunk, encoding, callback) {
		let chunkBytes;
		if (typeof chunk === "string") chunkBytes = Buffer.byteLength(chunk, encoding);
		else if (chunk instanceof Uint8Array) chunkBytes = chunk.byteLength;
		else {
			callback(/* @__PURE__ */ new TypeError("Archive encoder emitted an unsupported chunk type"));
			return;
		}
		encodedBytes += chunkBytes;
		if (encodedBytes > 268435456) {
			callback(/* @__PURE__ */ new Error(`Archive exceeds ${MAX_MATERIALIZED_ARCHIVE_BATCH_BYTES} bytes during encoding`));
			return;
		}
		callback(null, chunk);
	} });
}
async function encodeStagedTranscriptArchive(params) {
	const createdAt = Date.now();
	const createZstdCompress = zlib.createZstdCompress;
	const compressed = typeof createZstdCompress === "function";
	const archivePath = `${resolveSqliteTranscriptArchivePath({
		archiveDirectory: params.archiveDirectory,
		generation: params.generation,
		identityOwner: "registry",
		reason: params.reason,
		sessionId: params.sessionId,
		nowMs: createdAt
	})}${compressed ? ".zst" : ""}`;
	const encodedPath = `${archivePath}.${randomUUID()}.stage`;
	try {
		await pipeline$1([
			fs.createReadStream(params.stagedPath),
			...compressed ? [createZstdCompress.call(zlib)] : [],
			createArchiveByteLimitTransform(),
			fs.createWriteStream(encodedPath, {
				flags: "wx",
				mode: 384
			})
		]);
		const bytes = fs.readFileSync(encodedPath);
		return {
			archiveName: path.basename(archivePath),
			bytes,
			createdAt,
			encoding: compressed ? "zstd" : "identity",
			sha256: hashSessionArchiveBytes(bytes)
		};
	} finally {
		fs.rmSync(encodedPath, { force: true });
	}
}
async function materializeTranscriptArchiveInWorker(input, env) {
	const history = "historyEviction" in input ? input.historyEviction : void 0;
	const assertSource = () => {
		if (history) assertDatabasePathIdentity(input.databasePath, history.expectedIdentity);
	};
	assertSource();
	const stagedPath = `${resolveSqliteTranscriptArchivePath({
		archiveDirectory: input.archiveDirectory,
		generation: "snapshot" in input ? input.snapshot.generation ?? void 0 : void 0,
		identityOwner: "registry",
		reason: input.reason,
		sessionId: input.sessionId
	})}.${randomUUID()}.jsonl-stage`;
	try {
		const opened = withFreshOpenClawAgentDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => {
			assertSource();
			if (history && isRecentHistoricalSessionId({
				database,
				sessionId: input.sessionId,
				preserveRecentMs: history.preserveRecentMs
			})) return null;
			const preparedPlan = "snapshot" in input ? void 0 : planSessionStateDeleteIfUnreferenced({
				...input,
				database,
				referencedSessionIds: /* @__PURE__ */ new Set()
			});
			const plan = "snapshot" in input ? input : preparedPlan;
			if (!plan) return null;
			if ("snapshot" in input && !sqliteSessionStateDeleteSnapshotsEqual(readSessionStateDeleteSnapshot(database.db, input.sessionId), input.snapshot)) throw new Error(`SQLite session state changed before archive materialization for ${input.sessionId}`);
			let rows = 0;
			if (plan.snapshot.lastSeq !== null) {
				fs.mkdirSync(input.archiveDirectory, {
					recursive: true,
					mode: 448
				});
				rows = stageTranscriptArchiveContent(database.db, input.sessionId, stagedPath);
			}
			return {
				plan,
				rows,
				preparedPlan
			};
		}, {
			databaseLabel: database.path,
			operationLabel: "session.archive.materialize"
		}), {
			agentId: input.agentId,
			path: input.databasePath,
			env
		});
		assertSource();
		if (!opened.found) {
			const reason = history ? opened.reason : opened.reason.replaceAll("-", " ");
			throw new Error(`Cannot archive SQLite transcript ${input.sessionId}: ${reason}`);
		}
		if (!opened.value) return {
			archive: null,
			sessionId: input.sessionId,
			preparedPlan: null
		};
		const { plan, rows, preparedPlan } = opened.value;
		const generation = plan.snapshot.generation;
		if (rows > 0 && !generation) throw new Error(`Cannot archive SQLite transcript without a generation for ${input.sessionId}`);
		const archive = rows > 0 && generation ? await encodeStagedTranscriptArchive({
			...input,
			generation,
			stagedPath
		}) : null;
		assertSource();
		return {
			archive,
			sessionId: input.sessionId,
			...history ? { preparedPlan } : {}
		};
	} finally {
		fs.rmSync(stagedPath, { force: true });
	}
}
async function* materializeTranscriptArchiveBatch(plans, env) {
	let bytes = 0;
	for (const plan of plans) {
		const result = await materializeTranscriptArchiveInWorker(plan, env);
		bytes += result.archive?.bytes.byteLength ?? 0;
		if (bytes > 268435456) throw new Error(`Archive batch exceeds ${MAX_MATERIALIZED_ARCHIVE_BATCH_BYTES} bytes; use fewer sessions`);
		yield result;
	}
}
function publishTranscriptArchiveInWorker(plan, env) {
	try {
		const opened = withFreshOpenClawAgentDatabaseReadOnly((database) => {
			if (plan.databaseIdentity !== void 0 && readOpenClawAgentDatabaseIdentity(database).identity !== plan.databaseIdentity) throw new Error("SQLite archive publication database was replaced");
			const db = getNodeSqliteKysely(database.db);
			return executeSqliteQuerySync(database.db, db.selectFrom("session_transcript_archives").select([
				"archive_blob",
				"archive_name",
				"archive_sha256"
			]).where("session_id", "=", plan.sessionId).where("generation", "=", plan.generation)).rows[0];
		}, {
			agentId: plan.agentId,
			path: plan.databasePath,
			env
		});
		if (!opened.found || !opened.value) throw new Error(`Canonical SQLite transcript archive is missing for ${plan.sessionId}`);
		if (hashSessionArchiveBytes(opened.value.archive_blob) !== opened.value.archive_sha256) throw new Error(`Canonical SQLite transcript archive is corrupt for ${plan.sessionId}`);
		return {
			archivedPath: publishEncodedSessionTranscriptArchive({
				archiveDirectory: plan.archiveDirectory,
				archiveName: opened.value.archive_name,
				bytes: opened.value.archive_blob,
				sha256: opened.value.archive_sha256
			}),
			generation: plan.generation,
			sessionId: plan.sessionId
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : String(error),
			generation: plan.generation,
			sessionId: plan.sessionId
		};
	}
}
async function runArchiveSession(port, env) {
	for await (const [message] of on(port, "message")) {
		cancelWorkerIdleGc();
		const request = message;
		if (request.type === "close") break;
		let response;
		if (request.operation === "materialize") {
			const results = [];
			for await (const result of materializeTranscriptArchiveBatch(request.plans, env)) results.push(result);
			response = {
				type: "done",
				results
			};
		} else if (request.operation === "publish") response = {
			type: "published",
			results: request.plans.map((plan) => publishTranscriptArchiveInWorker(plan, env))
		};
		else if (request.operation === "read-page") {
			const { readTranscriptArchivePageInWorker } = await import("../../session-accessor.sqlite-archive-read-CSaOy6G3.mjs");
			const results = [];
			for (const plan of request.plans) results.push(await readTranscriptArchivePageInWorker(plan, env));
			response = {
				type: "page-read",
				results
			};
		} else {
			const { readTranscriptArchiveFinalInWorker } = await import("../../session-accessor.sqlite-archive-read-CSaOy6G3.mjs");
			const results = [];
			for (const plan of request.plans) results.push(await readTranscriptArchiveFinalInWorker(plan, env));
			response = {
				type: "final-read",
				results
			};
		}
		port.postMessage(response);
		const failed = response.type === "published" && response.results.some((result) => result.error !== void 0);
		response.results.length = 0;
		request.plans = [];
		scheduleWorkerIdleGc();
		if (failed) break;
	}
	port.close();
}
if (isRecord(workerData) && workerData.type === "sqlite-transcript-archive-v2") {
	if (!parentPort) throw new Error("SQLite transcript archive worker requires a parent port");
	const workerPort = parentPort;
	const run = async (port) => {
		routeLogsToStderr();
		const operation = workerData.operation;
		if (operation === "canonical-validation-pool") {
			const { serveWorkerTasks } = await import("../../worker-task-server-BxttNAkS.mjs");
			const { runReclamationWorkerPort } = await import("../../session-accessor.sqlite-mutation-worker.runtime-Cr6P0S-L.mjs");
			const taskSequence = { operationId: 0 };
			serveWorkerTasks(async (value, channel) => {
				const task = value;
				try {
					if (!(task?.port instanceof MessagePort) || !channel) throw new Error("Canonical validation task requires its own message port");
					task.port.postMessage({
						type: "ready",
						threadId,
						operationId: taskSequence.operationId
					}, []);
					await runReclamationWorkerPort(task.port, task.databaseOptions, taskSequence);
					channel.consumeInput();
					return { status: "closed" };
				} catch (error) {
					return {
						status: "failed",
						error: encodeNativeWorkerFailure(toStringifiedError(error))
					};
				} finally {
					task?.port?.close();
				}
			});
		} else if (operation === "archive-session") await runArchiveSession(port, workerData.env);
		else if (operation === "materialize") {
			const data = workerData;
			for await (const result of materializeTranscriptArchiveBatch(data.plans)) port.postMessage({
				type: "done",
				results: [result]
			}, []);
			port.close();
		} else if (operation === "publish") {
			const results = workerData.plans.map((plan) => publishTranscriptArchiveInWorker(plan));
			port.postMessage({
				type: "published",
				results
			}, []);
			port.close();
		} else if (operation === "cold-prepare") {
			const { prepareSessionColdBatchInWorker } = await import("../../session-cold-storage-worker-BfyDy4H0.mjs");
			const result = await prepareSessionColdBatchInWorker(workerData.input);
			port.postMessage({
				type: "done",
				results: [result]
			}, []);
			port.close();
		} else if (operation === "maintenance-size") {
			const { readSessionTranscriptJsonlBytesInDatabase } = await import("../../session-accessor.sqlite-maintenance-store-MiklS5nj.mjs");
			const { input } = workerData;
			const opened = withFreshOpenClawAgentDatabaseReadOnly((database) => readSessionTranscriptJsonlBytesInDatabase(database, input.sessionIds), input);
			if (!opened.found) throw new Error(`Cannot size SQLite session transcripts: ${opened.reason.replaceAll("-", " ")}`);
			port.postMessage({
				type: "sized",
				results: [opened.value]
			}, []);
			port.close();
		} else if (operation === "cold-mutate" || operation === "reclaim") {
			const { runColdMutationWorkerPort, runReclamationWorkerPort } = await import("../../session-accessor.sqlite-mutation-worker.runtime-Cr6P0S-L.mjs");
			if (operation === "cold-mutate") await runColdMutationWorkerPort(port, workerData);
			else await runReclamationWorkerPort(port, workerData.databaseOptions);
		} else throw new Error("SQLite transcript archive worker requires a supported operation");
	};
	const admissionPort = workerData.databaseAdmissionPort;
	if (admissionPort instanceof MessagePort) {
		bindSqliteDatabaseAdmissionUpstream(admissionPort);
		try {
			await withSqliteDatabaseAdmissionExchange((admissions, location, create) => exchangeSqliteDatabaseAdmissions(admissionPort, admissions, location, create), () => run(workerPort));
		} finally {
			admissionPort.close();
		}
	} else await run(workerPort);
}
//#endregion
export { materializeTranscriptArchiveInWorker, publishTranscriptArchiveInWorker };
