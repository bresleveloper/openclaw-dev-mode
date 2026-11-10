import { r as assertExistingDatabaseIdentity } from "../../sqlite-worker-identity-DLqVBf5J.mjs";
import { o as closeOpenClawStateDatabase } from "../../openclaw-state-db-cache-R1v7ogY0.mjs";
import "../../openclaw-state-db-BtDOU_3j.mjs";
import { c as claimOpenClawAgentDatabaseLease, g as releaseOpenClawAgentDatabaseLease } from "../../openclaw-agent-db-lease-Brvd0WI4.mjs";
import { n as openOpenClawAgentDatabaseReadOnly } from "../../openclaw-agent-db-readonly-open-DcexysGa.mjs";
import { o as prepareSessionTranscriptProjection } from "../../session-transcript-projection-rebuild-b6i9E7jy.mjs";
import { t as runWithSqliteMutationWorkerCoordination } from "../../session-accessor.sqlite-worker-coordination-VYaqe2BP.mjs";
import { n as serveWorkerTasks } from "../../worker-task-server-sMsYUF1K.mjs";
import { MessagePort } from "node:worker_threads";
//#region src/config/sessions/session-transcript-reconcile.worker.ts
/** Worker entrypoint for transcript parsing and active-branch resolution only. */
const ACTIVE_ROWS_PER_CHUNK = 512;
const FTS_ROWS_PER_CHUNK = 128;
const FTS_TEXT_BYTES_PER_CHUNK = 262144;
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
function waitForMessage(port) {
	return new Promise((resolve) => {
		port.once("message", resolve);
	});
}
async function postAndWait(port, message, transferList = []) {
	port.postMessage(message, transferList);
	return await waitForMessage(port);
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
async function streamPreparedProjection(plan, port) {
	const { activeRows, ftsRows, ...metadata } = plan;
	if (!(await postAndWait(port, {
		type: "plan-start",
		plan: metadata
	})).accepted) return false;
	for (let offset = 0; offset < activeRows.length; offset += ACTIVE_ROWS_PER_CHUNK) if (!(await postAndWait(port, {
		type: "active-chunk",
		rows: activeRows.slice(offset, offset + ACTIVE_ROWS_PER_CHUNK),
		sessionId: plan.sessionId
	})).accepted) return false;
	let rows = [];
	let bytes = 0;
	const flush = async () => {
		const chunk = encodeFtsChunk(rows);
		rows = [];
		bytes = 0;
		return (await postAndWait(port, {
			type: "fts-chunk",
			chunk,
			sessionId: plan.sessionId
		}, [chunk.textBytes.buffer])).accepted;
	};
	for (const row of ftsRows) {
		const rowBytes = Buffer.byteLength(row.text, "utf8");
		if (rows.length > 0 && bytes + rowBytes > FTS_TEXT_BYTES_PER_CHUNK && !await flush()) return false;
		rows.push(row);
		bytes += rowBytes;
		if ((rows.length >= FTS_ROWS_PER_CHUNK || bytes >= FTS_TEXT_BYTES_PER_CHUNK) && !await flush()) return false;
	}
	if (rows.length > 0 && !await flush()) return false;
	return (await postAndWait(port, {
		type: "plan-finish",
		sessionId: plan.sessionId
	})).yield === true;
}
async function run(input, port, coordination, sourceIdentity) {
	const assertSource = () => {
		if (input.mode === "disk") {
			if (!sourceIdentity) throw new Error("Transcript worker lost its captured source identity");
			assertExistingDatabaseIdentity(input.path, sourceIdentity);
		}
	};
	if (input.mode === "release") {
		releaseLease(input, port);
		return;
	}
	const reconcileInput = input;
	let closeDatabase;
	let terminalMessage;
	try {
		const database = (() => {
			const options = {
				agentId: reconcileInput.agentId,
				path: reconcileInput.path,
				env: resolveLeaseEnvironment(reconcileInput)
			};
			assertSource();
			if (coordination?.reconciliation) assertExistingDatabaseIdentity(coordination.databasePath, coordination.reconciliation.identity);
			claimOpenClawAgentDatabaseLease(options, reconcileInput.leaseId);
			const opened = openOpenClawAgentDatabaseReadOnly(options);
			if (!opened.found) throw new Error(`Cannot prepare transcript indexes: ${opened.reason}`);
			closeDatabase = opened.database.close;
			return opened.database;
		})();
		const sessionIds = reconcileInput.sessionIds;
		let yielded = false;
		for (const [index, sessionId] of sessionIds.entries()) {
			const plan = prepareSessionTranscriptProjection(database.db, sessionId);
			if (plan) {
				if (await streamPreparedProjection(plan, port)) {
					yielded = index < sessionIds.length - 1;
					break;
				}
			}
		}
		terminalMessage = {
			type: "done",
			yielded
		};
	} catch (error) {
		terminalMessage = {
			type: "failed",
			error: error instanceof Error ? error.message : String(error)
		};
	}
	port.postMessage(terminalMessage);
	await waitForMessage(port);
	closeDatabase?.();
	releaseLease(reconcileInput, port, closeDatabase !== void 0);
}
serveWorkerTasks(async (value) => {
	if (!value || typeof value !== "object" || !("input" in value) || !("port" in value)) throw new Error("session transcript reconcile worker requires a task");
	if (!(value.port instanceof MessagePort)) throw new Error("session transcript reconcile worker requires valid task data");
	const { input, port, coordination, sourceIdentity } = value;
	try {
		if (!coordination?.reconciliation) throw new Error("Transcript worker requires lifecycle coordination");
		await runWithSqliteMutationWorkerCoordination(coordination, { env: resolveLeaseEnvironment(input) }, () => run(input, port, coordination, sourceIdentity));
	} finally {
		value.port.close();
	}
}, { retireOnError: true });
//#endregion
export {};
