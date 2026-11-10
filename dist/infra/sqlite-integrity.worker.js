import { f as toStringifiedError } from "../error-coercion-BwMr25F8.mjs";
import { i as setSqliteBusyTimeout } from "../sqlite-busy-timeout-COlIRjFZ.mjs";
import { r as openNodeSqliteDatabase } from "../node-sqlite-CYaq-2Hb.mjs";
import { r as readSqliteIntegrityFileIdentity } from "../sqlite-file-generation-Cmk6kG35.mjs";
import { r as assertSqliteIntegrity } from "../sqlite-integrity-06TCB-az.mjs";
import { t as configureSqliteMaintenanceCache } from "../sqlite-maintenance-cache-AYpxl8JZ.mjs";
import { n as serializeNativeErrorResponse } from "../native-error-response-6ofCMHxA.mjs";
import { performance } from "node:perf_hooks";
import { on } from "node:events";
//#region src/infra/sqlite-integrity.worker.ts
if (!process.send || !process.disconnect) throw new Error("SQLite integrity child requires parent IPC.");
const sendMessage = process.send.bind(process);
const disconnect = process.disconnect.bind(process);
function send(message) {
	return new Promise((resolve, reject) => {
		sendMessage(message, (error) => {
			if (error) reject(error);
			else resolve();
		});
	});
}
function sendPhase(phase) {
	return send({
		type: "phase",
		phase
	});
}
async function check(input) {
	let database;
	let failure;
	let checkElapsedMs;
	try {
		await sendPhase("opening");
		readSqliteIntegrityFileIdentity(input.pathname, input.identity);
		database = openNodeSqliteDatabase(input.pathname, { readOnly: true });
		setSqliteBusyTimeout(database, input.busyTimeoutMs);
		configureSqliteMaintenanceCache(database);
		readSqliteIntegrityFileIdentity(input.pathname, input.identity);
		await sendPhase("checking");
		const startedAt = performance.now();
		try {
			assertSqliteIntegrity(database, input.databaseLabel);
		} finally {
			checkElapsedMs = performance.now() - startedAt;
		}
	} catch (error) {
		failure = toStringifiedError(error);
	} finally {
		if (database) try {
			await sendPhase("closing");
		} catch (error) {
			failure ??= toStringifiedError(error);
		}
		try {
			database?.close();
		} catch (error) {
			failure = toStringifiedError(error);
		}
	}
	let result = { ok: true };
	if (failure) result = {
		ok: false,
		error: serializeNativeErrorResponse(failure)
	};
	if (checkElapsedMs !== void 0) result.checkElapsedMs = checkElapsedMs;
	return result;
}
for await (const [input] of on(process, "message")) {
	if ("type" in input) {
		disconnect();
		break;
	}
	const result = await check(input);
	await send(result);
	if (!input.reuse || !result.ok) {
		disconnect();
		break;
	}
}
//#endregion
export {};
