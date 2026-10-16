import { n as assertExistingDatabaseIdentity } from "../../sqlite-worker-identity-KSR14F6C.mjs";
import { c as resolveOpenClawStateSqlitePath } from "../../openclaw-state-db.paths-DfifnSGp.mjs";
import { l as readSqliteSchemaCookie } from "../../sqlite-schema-contract-BTxZz0OV.mjs";
import { i as closeOpenClawStateDatabase, t as borrowOpenClawStateDatabaseForAsyncRead } from "../../openclaw-state-db-cache-BKCnj4of.mjs";
import { n as assertExistingOpenClawStateRuntimeSchema } from "../../openclaw-state-db-existing-schema-C4QR2GGf.mjs";
import "../../openclaw-state-db-D1jWDzK3.mjs";
import { c as claimOpenClawAgentDatabaseLease, g as releaseOpenClawAgentDatabaseLease } from "../../openclaw-agent-db-lease-D8zYIRzn.mjs";
import { n as openOpenClawAgentDatabaseReadOnly, t as hasOpenClawAgentReadOnlySchema } from "../../openclaw-agent-db-readonly-open-hQ4ohjUT.mjs";
import { n as serveWorkerTasks } from "../../worker-task-server-BC_7U18u.mjs";
import { c as listSessionsNeedingTranscriptIndexReconcile, v as prepareMemorySessionTranscriptProjection, y as prepareSessionTranscriptProjection } from "../../session-transcript-index-FbEuN6S5.mjs";
import { t as runSqliteReconciliationLifecyclePhase } from "../../session-accessor.sqlite-worker-coordination-CnWXpMvZ.mjs";
import { MessagePort } from "node:worker_threads";
//#region src/config/sessions/session-transcript-reconcile.worker.ts
/** Worker entrypoint for transcript parsing and active-branch resolution only. */
const ACTIVE_ROWS_PER_CHUNK = 512;
const FTS_ROWS_PER_CHUNK = 128;
const FTS_TEXT_BYTES_PER_CHUNK = 262144;
function parseWorkerInput(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const input = value;
	if (input.mode === "memory" && Array.isArray(input.sessionIds) && input.sessionIds.every((sessionId) => typeof sessionId === "string")) return {
		mode: "memory",
		sessionIds: input.sessionIds
	};
	if (typeof input.stateDir !== "string" || typeof input.externallySupervised !== "boolean") return;
	const owner = {
		stateDir: input.stateDir,
		externallySupervised: input.externallySupervised
	};
	if (input.mode === "release" && typeof input.leaseId === "string" && typeof input.path === "string") return {
		...owner,
		mode: "release",
		leaseId: input.leaseId,
		path: input.path
	};
	if (typeof input.agentId !== "string" || typeof input.path !== "string") return;
	if (input.preferredSessionId !== void 0 && typeof input.preferredSessionId !== "string") return;
	const plan = {
		...owner,
		agentId: input.agentId,
		path: input.path,
		...typeof input.preferredSessionId === "string" ? { preferredSessionId: input.preferredSessionId } : {}
	};
	if (input.mode === "disk" && typeof input.leaseId === "string") return {
		...plan,
		mode: "disk",
		leaseId: input.leaseId
	};
}
function orderSessionIds(sessionIds, preferredSessionId) {
	if (!preferredSessionId || !sessionIds.includes(preferredSessionId)) return sessionIds;
	return [preferredSessionId, ...sessionIds.filter((sessionId) => sessionId !== preferredSessionId)];
}
function resolveLeaseEnvironment(owner) {
	return {
		OPENCLAW_STATE_DIR: owner.stateDir,
		...owner.externallySupervised ? { OPENCLAW_SUPERVISOR_MODE: "external" } : {}
	};
}
function releaseLease(owner, port, readOnlyClosed = false) {
	let failure;
	try {
		releaseOpenClawAgentDatabaseLease(owner.leaseId, {
			env: resolveLeaseEnvironment(owner),
			initializationAgentPaths: [owner.path]
		}, readOnlyClosed ? "read-only" : void 0);
	} catch (error) {
		failure = error instanceof Error ? error : new Error(String(error));
	} finally {
		closeOpenClawStateDatabase();
	}
	if (failure) port.postMessage({
		type: "lease-release-failed",
		error: failure.message
	});
	else port.postMessage({ type: "lease-released" });
	port.close();
}
function waitForContinue(port) {
	return new Promise((resolve, reject) => {
		port.once("message", (message) => {
			if (message?.type !== "continue" || typeof message.accepted !== "boolean") {
				reject(/* @__PURE__ */ new Error("session transcript reconcile worker received an invalid command"));
				return;
			}
			resolve(message.accepted);
		});
	});
}
async function postAndWait(port, message, transferList = []) {
	port.postMessage(message, transferList);
	return await waitForContinue(port);
}
function encodeFtsChunk(rows) {
	const encoder = new TextEncoder();
	const encoded = rows.map((row) => ({
		bytes: encoder.encode(row.text),
		row
	}));
	const textBytes = new Uint8Array(encoded.reduce((total, entry) => total + entry.bytes.length, 0));
	let textByteOffset = 0;
	return {
		rows: encoded.map(({ bytes, row }) => {
			textBytes.set(bytes, textByteOffset);
			const result = {
				messageId: row.messageId,
				role: row.role,
				textByteLength: bytes.length,
				textByteOffset,
				timestamp: row.timestamp
			};
			textByteOffset += bytes.length;
			return result;
		}),
		textBytes
	};
}
function takeFtsChunkEnd(rows, start) {
	let bytes = 0;
	let end = start;
	while (end < rows.length && end - start < FTS_ROWS_PER_CHUNK) {
		const rowBytes = Buffer.byteLength(rows[end]?.text ?? "", "utf8");
		if (end > start && bytes + rowBytes > FTS_TEXT_BYTES_PER_CHUNK) break;
		bytes += rowBytes;
		end += 1;
	}
	return end;
}
async function streamPreparedProjection(plan, port) {
	const { activeRows, ftsRows, ...metadata } = plan;
	if (!await postAndWait(port, {
		type: "plan-start",
		plan: metadata
	})) return;
	for (let offset = 0; offset < activeRows.length; offset += ACTIVE_ROWS_PER_CHUNK) if (!await postAndWait(port, {
		type: "active-chunk",
		rows: activeRows.slice(offset, offset + ACTIVE_ROWS_PER_CHUNK),
		sessionId: plan.sessionId
	})) return;
	for (let offset = 0; offset < ftsRows.length;) {
		const end = takeFtsChunkEnd(ftsRows, offset);
		const chunk = encodeFtsChunk(ftsRows.slice(offset, end));
		if (!await postAndWait(port, {
			type: "fts-chunk",
			chunk,
			sessionId: plan.sessionId
		}, [chunk.textBytes.buffer])) return;
		offset = end;
	}
	await postAndWait(port, {
		type: "plan-finish",
		sessionId: plan.sessionId
	});
}
async function prepareMemoryProjection(sessionId, port) {
	const rows = /* @__PURE__ */ new Map();
	const decoder = new TextDecoder();
	let fragments = [];
	while (true) {
		const pending = new Promise((resolve) => {
			port.once("message", resolve);
		});
		port.postMessage({
			type: "source-read",
			sessionId
		});
		const frame = await pending;
		if (frame.type === "source-unavailable") return;
		if (frame.type === "source-end") {
			const plan = prepareMemorySessionTranscriptProjection(sessionId, frame.snapshot.transcriptUpdatedAt, rows, frame.snapshot.generation);
			rows.clear();
			return plan;
		}
		fragments.push(decoder.decode(frame.bytes, { stream: !frame.final }));
		if (frame.final) {
			rows.set(frame.seq, {
				seq: frame.seq,
				created_at: frame.createdAt,
				event_json: fragments.join("")
			});
			fragments = [];
		}
	}
}
async function run(input, port, coordination, sourceIdentity) {
	let unsettled = false;
	const phase = (name, operation) => coordination ? runSqliteReconciliationLifecyclePhase(coordination, name, operation, () => {
		unsettled = true;
	}) : Promise.resolve(operation());
	const assertSource = () => {
		if (input.mode === "disk") {
			if (!sourceIdentity) throw new Error("Transcript worker lost its captured source identity");
			assertExistingDatabaseIdentity(input.path, sourceIdentity);
		}
	};
	if (input.mode === "release") {
		await phase("close", () => releaseLease(input, port));
		return;
	}
	const reconcileInput = input;
	let closeDatabase;
	let sharedBorrow;
	let assertAdmittedSchemas;
	let terminalMessage;
	try {
		const database = await phase("open", () => {
			if (reconcileInput.mode === "memory") return;
			const options = {
				agentId: reconcileInput.agentId,
				path: reconcileInput.path,
				env: resolveLeaseEnvironment(reconcileInput)
			};
			assertSource();
			claimOpenClawAgentDatabaseLease(options, reconcileInput.leaseId);
			const opened = openOpenClawAgentDatabaseReadOnly(options);
			if (!opened.found) throw new Error(`Cannot prepare transcript indexes: ${opened.reason}`);
			closeDatabase = opened.database.close;
			assertSource();
			if (coordination?.reconciliation) {
				sharedBorrow = borrowOpenClawStateDatabaseForAsyncRead(coordination.databasePath);
				if (!sharedBorrow) throw new Error("Transcript worker lost its admitted shared-state handle");
				const shared = sharedBorrow.database;
				const sharedSchema = readSqliteSchemaCookie(shared.db);
				const agentSchema = readSqliteSchemaCookie(opened.database.db);
				if (typeof sharedSchema !== "number" || typeof agentSchema !== "number") throw new Error("Transcript worker cannot retain its admitted schema identities");
				assertAdmittedSchemas = () => {
					sharedBorrow?.assertCurrent();
					if (!shared.db.isOpen || readSqliteSchemaCookie(shared.db) !== sharedSchema || readSqliteSchemaCookie(opened.database.db) !== agentSchema) throw new Error("Transcript worker schema changed between lifecycle phases");
					assertExistingOpenClawStateRuntimeSchema(shared.db, shared.path);
					if (!hasOpenClawAgentReadOnlySchema(opened.database)) throw new Error("Transcript worker lost its admitted agent schema");
				};
			}
			return opened.database;
		});
		const sessionIds = reconcileInput.mode === "memory" ? reconcileInput.sessionIds : orderSessionIds(listSessionsNeedingTranscriptIndexReconcile(database.db), reconcileInput.preferredSessionId);
		for (const sessionId of sessionIds) {
			assertSource();
			const plan = reconcileInput.mode === "memory" ? await prepareMemoryProjection(sessionId, port) : prepareSessionTranscriptProjection(database.db, sessionId);
			if (plan) {
				await streamPreparedProjection(plan, port);
				assertSource();
			}
		}
		terminalMessage = { type: "done" };
	} catch (error) {
		if (unsettled) throw error;
		terminalMessage = {
			type: "failed",
			error: error instanceof Error ? error.message : String(error)
		};
	}
	try {
		if (!coordination?.reconciliation) closeDatabase?.();
		port.postMessage(terminalMessage);
		if (reconcileInput.mode === "disk") {
			await new Promise((resolve, reject) => {
				port.once("message", (message) => {
					if (message?.type !== "release") {
						reject(/* @__PURE__ */ new Error("session transcript reconcile worker expected lease release"));
						return;
					}
					resolve();
				});
			});
			await phase("close", () => {
				assertSource();
				assertAdmittedSchemas?.();
				if (coordination?.reconciliation) {
					closeDatabase?.();
					sharedBorrow?.release();
					sharedBorrow = void 0;
				}
				releaseLease(reconcileInput, port, closeDatabase !== void 0);
			});
		}
	} finally {
		if (reconcileInput.mode === "memory") port.close();
	}
}
serveWorkerTasks(async (value) => {
	if (!value || typeof value !== "object" || !("input" in value) || !("port" in value)) throw new Error("session transcript reconcile worker requires a task");
	const input = parseWorkerInput(value.input);
	if (!input || !(value.port instanceof MessagePort)) throw new Error("session transcript reconcile worker requires valid task data");
	const port = value.port;
	try {
		if (input.mode === "memory") await run(input, port);
		else {
			const { coordination, sourceIdentity } = value;
			if (!coordination?.reconciliation || coordination.actorId !== `transcript:${input.mode}:${input.leaseId}` || coordination.databasePath !== resolveOpenClawStateSqlitePath(resolveLeaseEnvironment(input))) throw new Error("Transcript worker shared-state owner changed");
			await run(input, port, coordination, sourceIdentity);
		}
	} catch {
		process.exit(1);
	} finally {
		value.port.close();
	}
});
//#endregion
export {};
