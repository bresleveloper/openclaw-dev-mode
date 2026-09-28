import { d as toStringifiedError } from "../error-coercion-C787aVxk.mjs";
import { t as openNodeSqliteDatabase } from "../node-sqlite-BO6jRFcG.mjs";
import { i as setSqliteBusyTimeout } from "../sqlite-busy-timeout-DYrW2wFu.mjs";
import { n as readSqliteIntegrityFileIdentity } from "../sqlite-file-generation-bF3ZcoQs.mjs";
import { n as assertSqliteIntegrity } from "../sqlite-integrity-B4lhf3Iz.mjs";
import { t as configureSqliteMaintenanceCache } from "../sqlite-maintenance-cache-AYpxl8JZ.mjs";
import { performance } from "node:perf_hooks";
import { on } from "node:events";
//#region src/infra/sqlite-integrity.worker.ts
function nativeErrorDetails(error) {
	const nativeError = error;
	return {
		message: error.message,
		code: nativeError.code,
		errcode: nativeError.errcode
	};
}
if (!process.send || !process.disconnect) throw new Error("SQLite integrity child requires parent IPC.");
const sendMessage = process.send.bind(process);
const disconnect = process.disconnect.bind(process);
function sendPhase(phase) {
	return new Promise((resolve, reject) => {
		sendMessage({
			type: "phase",
			phase
		}, (error) => {
			if (error) reject(error);
			else resolve();
		});
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
		error: {
			name: failure.name,
			...nativeErrorDetails(failure),
			...failure.cause instanceof Error ? { cause: nativeErrorDetails(failure.cause) } : {}
		}
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
	await new Promise((resolve, reject) => {
		sendMessage(result, (error) => error ? reject(error) : resolve());
	});
	if (!input.reuse || !result.ok) {
		disconnect();
		break;
	}
}
//#endregion
export {};
