import { c as isRecord } from "../../record-coerce-TIsquoVR.mjs";
import { a as getNodeSqliteKysely, o as iterateSqliteQuerySync, r as executeSqliteQuerySync } from "../../kysely-sync-K7ftY-g4.mjs";
import { i as routeLogsToStderr } from "../../console-BnFs8ZzT.mjs";
import { r as runSqliteDeferredTransactionSync } from "../../sqlite-transaction-DsZ3X6nD.mjs";
import { v as readOpenClawAgentDatabaseIdentity } from "../../openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { i as withFreshOpenClawAgentDatabaseReadOnly } from "../../openclaw-agent-db-readonly-open-hQ4ohjUT.mjs";
import { s as transcriptEventJsonSql } from "../../transcript-payload-Yc_w8Yx5.mjs";
import { n as scheduleWorkerIdleGc, t as cancelWorkerIdleGc } from "../../worker-idle-gc-DjILq491.mjs";
import { a as resolveSqliteTranscriptArchivePath, n as hashSessionArchiveBytes, r as publishEncodedSessionTranscriptArchive, t as MAX_MATERIALIZED_ARCHIVE_BATCH_BYTES } from "../../session-accessor.sqlite-archive-artifact-kIblIqSS.mjs";
import { n as sqliteSessionStateDeleteSnapshotsEqual, t as readSessionStateDeleteSnapshot } from "../../session-accessor.sqlite-delete-snapshot-BD2fHbEP.mjs";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { MessagePort, parentPort, threadId, workerData } from "node:worker_threads";
import { on } from "node:events";
import { Transform } from "node:stream";
import zlib from "node:zlib";
import { pipeline as pipeline$1 } from "node:stream/promises";
//#region src/config/sessions/session-accessor.sqlite-archive.worker.ts
/** Worker entrypoint for SQLite transcript archive materialization off the gateway event loop. */
function parsePublishWorkerPlans(value) {
	if (!isRecord(value)) return;
	const plans = value.plans;
	if (!Array.isArray(plans)) return;
	const parsed = [];
	for (const plan of plans) {
		if (!isRecord(plan)) return;
		if (typeof plan.agentId !== "string" || typeof plan.archiveDirectory !== "string" || typeof plan.databasePath !== "string" || typeof plan.generation !== "string" || typeof plan.sessionId !== "string" || plan.databaseIdentity !== void 0 && typeof plan.databaseIdentity !== "string") return;
		parsed.push({
			...typeof plan.databaseIdentity === "string" ? { databaseIdentity: plan.databaseIdentity } : {},
			agentId: plan.agentId,
			archiveDirectory: plan.archiveDirectory,
			databasePath: plan.databasePath,
			generation: plan.generation,
			sessionId: plan.sessionId
		});
	}
	return parsed;
}
function parseSessionStateDeleteSnapshot(snapshot) {
	if (!isRecord(snapshot)) return null;
	if (typeof snapshot.acpParentStreamEventCount !== "number" || snapshot.generation !== null && typeof snapshot.generation !== "string" || snapshot.lastSeq !== null && typeof snapshot.lastSeq !== "number" || snapshot.sessionKey !== null && typeof snapshot.sessionKey !== "string" || snapshot.sessionUpdatedAt !== null && typeof snapshot.sessionUpdatedAt !== "number" || snapshot.trajectoryLastSeq !== null && typeof snapshot.trajectoryLastSeq !== "number" || snapshot.transcriptUpdatedAt !== null && typeof snapshot.transcriptUpdatedAt !== "number") return null;
	return {
		acpParentStreamEventCount: snapshot.acpParentStreamEventCount,
		generation: snapshot.generation,
		lastSeq: snapshot.lastSeq,
		sessionKey: snapshot.sessionKey,
		sessionUpdatedAt: snapshot.sessionUpdatedAt,
		trajectoryLastSeq: snapshot.trajectoryLastSeq,
		transcriptUpdatedAt: snapshot.transcriptUpdatedAt
	};
}
function parseWorkerPlans(value) {
	if (!isRecord(value)) return;
	const plans = value.plans;
	if (!Array.isArray(plans)) return;
	const parsed = [];
	for (const plan of plans) {
		if (!isRecord(plan)) return;
		const snapshot = parseSessionStateDeleteSnapshot(plan.snapshot);
		if (typeof plan.agentId !== "string" || typeof plan.archiveDirectory !== "string" || typeof plan.databasePath !== "string" || plan.reason !== "deleted" && plan.reason !== "reset" || typeof plan.sessionId !== "string" || !snapshot) return;
		parsed.push({
			agentId: plan.agentId,
			archiveDirectory: plan.archiveDirectory,
			databasePath: plan.databasePath,
			reason: plan.reason,
			sessionId: plan.sessionId,
			snapshot
		});
	}
	return parsed;
}
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
async function materializeTranscriptArchiveInWorker(plan, env) {
	if (plan.snapshot.lastSeq === null) {
		const opened = withFreshOpenClawAgentDatabaseReadOnly((database) => readSessionStateDeleteSnapshot(database.db, plan.sessionId), {
			agentId: plan.agentId,
			path: plan.databasePath,
			env
		});
		if (!opened.found) throw new Error(`Cannot archive SQLite transcript ${plan.sessionId}: ${opened.reason.replaceAll("-", " ")}`);
		if (!sqliteSessionStateDeleteSnapshotsEqual(opened.value, plan.snapshot)) throw new Error(`SQLite session state changed before archive materialization for ${plan.sessionId}`);
		return {
			archive: null,
			sessionId: plan.sessionId
		};
	}
	fs.mkdirSync(plan.archiveDirectory, {
		recursive: true,
		mode: 448
	});
	const stagedPath = `${resolveSqliteTranscriptArchivePath({
		archiveDirectory: plan.archiveDirectory,
		generation: plan.snapshot.generation ?? void 0,
		identityOwner: "registry",
		reason: plan.reason,
		sessionId: plan.sessionId
	})}.${randomUUID()}.jsonl-stage`;
	try {
		const opened = withFreshOpenClawAgentDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => {
			const snapshot = readSessionStateDeleteSnapshot(database.db, plan.sessionId);
			if (!sqliteSessionStateDeleteSnapshotsEqual(snapshot, plan.snapshot)) throw new Error(`SQLite session state changed before archive materialization for ${plan.sessionId}`);
			return stageTranscriptArchiveContent(database.db, plan.sessionId, stagedPath);
		}, {
			databaseLabel: database.path,
			operationLabel: "session.archive.materialize"
		}), {
			agentId: plan.agentId,
			path: plan.databasePath,
			env
		});
		if (!opened.found) throw new Error(`Cannot archive SQLite transcript ${plan.sessionId}: ${opened.reason.replaceAll("-", " ")}`);
		const generation = plan.snapshot.generation;
		if (opened.value > 0 && !generation) throw new Error(`Cannot archive SQLite transcript without a generation for ${plan.sessionId}`);
		return {
			archive: opened.value > 0 && generation ? await encodeStagedTranscriptArchive({
				archiveDirectory: plan.archiveDirectory,
				generation,
				reason: plan.reason,
				sessionId: plan.sessionId,
				stagedPath
			}) : null,
			sessionId: plan.sessionId
		};
	} finally {
		fs.rmSync(stagedPath, { force: true });
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
async function runWorkerPort(port, plans) {
	let materializedBytes = 0;
	for (const plan of plans) {
		const result = await materializeTranscriptArchiveInWorker(plan);
		materializedBytes += result.archive?.bytes.byteLength ?? 0;
		if (materializedBytes > 268435456) throw new Error(`Archive batch exceeds ${MAX_MATERIALIZED_ARCHIVE_BATCH_BYTES} bytes; use fewer sessions`);
		port.postMessage({
			type: "done",
			results: [result]
		});
	}
	port.close();
}
function runPublishWorkerPort(port, plans) {
	const results = plans.map((plan) => publishTranscriptArchiveInWorker(plan));
	port.postMessage({
		type: "published",
		results
	});
	port.close();
}
async function runArchiveSession(port, env) {
	let operationId = 0;
	for await (const [message] of on(port, "message")) {
		cancelWorkerIdleGc();
		const request = message;
		if (request.type === "close") break;
		if (request.type !== "archive-operation" || request.operationId !== ++operationId) throw new Error("SQLite archive Worker received an invalid operation identity");
		let response;
		if (request.operation === "materialize") {
			const plans = parseWorkerPlans(request);
			if (!plans) throw new Error("SQLite transcript archive worker requires valid materialization data");
			const results = [];
			let bytes = 0;
			for (const plan of plans) {
				const result = await materializeTranscriptArchiveInWorker(plan, env);
				bytes += result.archive?.bytes.byteLength ?? 0;
				if (bytes > 268435456) throw new Error(`Archive batch exceeds ${MAX_MATERIALIZED_ARCHIVE_BATCH_BYTES} bytes; use fewer sessions`);
				results.push(result);
			}
			response = {
				type: "done",
				operationId,
				settled: true,
				results
			};
		} else if (request.operation === "publish") {
			const plans = parsePublishWorkerPlans(request);
			if (!plans) throw new Error("SQLite transcript archive worker requires valid publication data");
			response = {
				type: "published",
				operationId,
				settled: true,
				results: plans.map((plan) => publishTranscriptArchiveInWorker(plan, env))
			};
		} else if (request.operation === "read-page") {
			const { readTranscriptArchivePageInWorker } = await import("../../session-accessor.sqlite-archive-read-BnAhW65A.mjs");
			const results = [];
			for (const plan of request.plans) results.push(await readTranscriptArchivePageInWorker(plan, env));
			response = {
				type: "page-read",
				operationId,
				settled: true,
				results
			};
		} else if (request.operation === "read-final") {
			const { readTranscriptArchiveFinalInWorker } = await import("../../session-accessor.sqlite-archive-read-BnAhW65A.mjs");
			const results = [];
			for (const plan of request.plans) results.push(await readTranscriptArchiveFinalInWorker(plan, env));
			response = {
				type: "final-read",
				operationId,
				settled: true,
				results
			};
		} else throw new Error("SQLite archive Worker received an unsupported operation");
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
	routeLogsToStderr();
	const operation = workerData.operation;
	if (operation === "canonical-validation-pool") {
		const { serveWorkerTasks } = await import("../../worker-task-server-DCO6XUS8.mjs");
		const { runReclamationWorkerPort } = await import("../../session-accessor.sqlite-mutation-worker.runtime-j6AwotmG.mjs");
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
					error: error instanceof Error ? error.message : String(error)
				};
			} finally {
				task?.port?.close();
			}
		});
	} else if (operation === "archive-session") await runArchiveSession(parentPort, workerData.env);
	else if (operation === "materialize") {
		const plans = parseWorkerPlans(workerData);
		if (!plans) throw new Error("SQLite transcript archive worker requires valid materialization data");
		await runWorkerPort(parentPort, plans);
	} else if (operation === "publish") {
		const plans = parsePublishWorkerPlans(workerData);
		if (!plans) throw new Error("SQLite transcript archive worker requires valid publication data");
		runPublishWorkerPort(parentPort, plans);
	} else if (operation === "cold-prepare") {
		const { prepareSessionColdBatchInWorker } = await import("../../session-cold-storage-worker-BGLwMA4f.mjs");
		const result = await prepareSessionColdBatchInWorker(workerData.input);
		parentPort.postMessage({
			type: "done",
			results: [result]
		}, []);
		parentPort.close();
	} else if (operation === "maintenance-size") {
		const { readSessionTranscriptJsonlBytesInDatabase } = await import("../../session-accessor.sqlite-maintenance-store-C14WjdWY.mjs");
		const { input } = workerData;
		const opened = withFreshOpenClawAgentDatabaseReadOnly((database) => readSessionTranscriptJsonlBytesInDatabase(database, input.sessionIds), input);
		if (!opened.found) throw new Error(`Cannot size SQLite session transcripts: ${opened.reason.replaceAll("-", " ")}`);
		parentPort.postMessage({
			type: "sized",
			results: [opened.value]
		}, []);
		parentPort.close();
	} else if (operation === "cold-mutate" || operation === "reclaim") {
		const { runColdMutationWorkerPort, runReclamationWorkerPort } = await import("../../session-accessor.sqlite-mutation-worker.runtime-j6AwotmG.mjs");
		if (operation === "cold-mutate") await runColdMutationWorkerPort(parentPort, workerData);
		else await runReclamationWorkerPort(parentPort, workerData.databaseOptions);
	} else throw new Error("SQLite transcript archive worker requires a supported operation");
}
//#endregion
export { materializeTranscriptArchiveInWorker, publishTranscriptArchiveInWorker };
