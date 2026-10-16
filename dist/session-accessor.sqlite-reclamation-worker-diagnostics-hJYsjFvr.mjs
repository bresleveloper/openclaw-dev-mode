import { d as toStringifiedError } from "./error-coercion-CvJK4lmH.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as formatErrorMessageWithCode } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { t as redactIdentifier } from "./node-crypto-BG4u3UnX.mjs";
import { isMainThread, threadId } from "node:worker_threads";
import { performance } from "node:perf_hooks";
//#region src/config/sessions/session-accessor.sqlite-reclamation-worker-diagnostics.ts
const log = createSubsystemLogger("session-sqlite");
const SLOW_RECLAMATION_WORKER_MS = 1e3;
function logSqliteReclamationWorkerRetirement(params) {
	try {
		const { startedAt, ...details } = params;
		const ageMs = Math.round(performance.now() - startedAt);
		log.info(`reclamation worker retired reason=${params.reason} kind=${params.kind} ageMs=${ageMs} opsServed=${params.opsServed}`, {
			...details,
			ageMs
		});
	} catch {}
}
/** A commit guard saw newer inputs; the caller owns the retry, so the Worker did not fail. */
var SqliteReclamationInputsChangedError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "SqliteReclamationInputsChangedError";
	}
};
function logSqliteReclamationWorkerOutcome(params) {
	const elapsedMs = Math.round(performance.now() - params.startedAt);
	if (params.outcome !== "rejected" && elapsedMs < SLOW_RECLAMATION_WORKER_MS) return;
	const failureText = (value) => {
		const text = formatErrorMessageWithCode(value);
		return truncateUtf16Safe(params.sessionId ? text.replaceAll(params.sessionId, redactIdentifier(params.sessionId)) : text, 2048);
	};
	const slow = elapsedMs >= SLOW_RECLAMATION_WORKER_MS;
	const superseded = params.failure instanceof SqliteReclamationInputsChangedError;
	log[superseded && !slow ? "debug" : "warn"](slow ? "slow SQLite reclamation Worker operation" : superseded ? "SQLite reclamation Worker superseded by newer inputs" : "SQLite reclamation Worker failed", {
		pid: process.pid,
		threadId,
		isMainThread,
		reclamationKind: params.kind,
		workerThreadId: params.workerThreadId,
		elapsedMs,
		outcome: params.outcome,
		exitCode: params.exitCode,
		...params.outcome === "rejected" ? {
			...params.sessionId ? { sessionIdHash: redactIdentifier(params.sessionId) } : {},
			error: failureText(params.failure),
			errorFrame: failureText(toStringifiedError(params.failure).stack?.split("\n").find((line) => line.trimStart().startsWith("at "))?.trim() ?? "")
		} : {}
	});
}
//#endregion
export { logSqliteReclamationWorkerOutcome as n, logSqliteReclamationWorkerRetirement as r, SqliteReclamationInputsChangedError as t };
