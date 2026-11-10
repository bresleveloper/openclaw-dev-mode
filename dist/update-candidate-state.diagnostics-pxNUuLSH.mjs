import { a as extractErrorCode, r as collectErrorGraphCandidates } from "./error-coercion-BwMr25F8.mjs";
import { n as formatErrorMessageWithCode } from "./errors-DPfGDWk1.mjs";
import { Et as _enum, Fn as object, Jn as string, Pn as number } from "./schemas-BOYIvvln.mjs";
import { a as redactPublicSupportDiagnosticLine } from "./diagnostic-support-redaction-BP5XqJ7g.mjs";
import { n as isPublicUpdateFailureCode } from "./update-failure-public-codes-DWhlI7xl.mjs";
import { writeSync } from "node:fs";
import { StringDecoder } from "node:string_decoder";
//#region src/infra/update-candidate-state.diagnostics.ts
const UPDATE_STATE_INSPECTION_PROGRESS_PREFIX = "State schema progress: ";
function formatUpdateStateInspectionError(error) {
	const causes = collectErrorGraphCandidates(error, (current) => [current.cause]);
	const code = causes.map(extractErrorCode).findLast((value) => value && isPublicUpdateFailureCode(value));
	const detail = `${code ? `${code}\n` : ""}${formatErrorMessageWithCode(error)}`;
	return causes.length > 1 ? `${detail}\nCaused by: ${formatErrorMessageWithCode(causes.at(-1))}` : detail;
}
const ProgressSchema = object({
	phase: string(),
	path: string().optional(),
	completedIo: number().int().positive().optional(),
	snapshot: object({
		status: _enum(["copying", "completed"]),
		copiedPages: number().nonnegative(),
		totalPages: number().nonnegative(),
		copiedBytes: number().nonnegative().optional(),
		elapsedMs: number().nonnegative()
	}).optional()
});
/** Report completed filesystem work, not timer heartbeats or distinct file counts. */
function createUpdateStateIoReporter(path, phase, onProgress) {
	let completedIo = 0;
	let emittedAt = -Infinity;
	return () => {
		completedIo++;
		const now = performance.now();
		if (!onProgress || now - emittedAt < 500) return;
		emittedAt = now;
		onProgress({
			phase,
			path,
			completedIo
		});
	};
}
function createUpdateStateSnapshotReporter(path, phase, onProgress) {
	const started = performance.now();
	let emittedAt = -Infinity;
	let pages = {
		totalPages: 0,
		remainingPages: 0
	};
	const emit = (status, copiedBytes) => {
		const now = performance.now();
		if (status === "copying" && now - emittedAt < 1e3 && pages.remainingPages > 0) return;
		emittedAt = now;
		onProgress?.({
			phase,
			path,
			snapshot: {
				status,
				copiedPages: pages.totalPages - pages.remainingPages,
				totalPages: pages.totalPages,
				copiedBytes,
				elapsedMs: Math.max(0, now - started)
			}
		});
	};
	emit("copying");
	return {
		onProgress: (progress) => {
			pages = progress;
			emit("copying");
		},
		complete: (copiedBytes) => emit("completed", copiedBytes)
	};
}
/** Stderr leaves the released worker's stdout JSON contract unchanged. */
function createUpdateStateInspectionReporter(legacy = false, entryProgress = false) {
	let emittedBytes = 0;
	let exhausted = false;
	return (progress) => {
		if (progress.completedIo !== void 0 && !entryProgress) return;
		if (exhausted) return;
		let line = `${UPDATE_STATE_INSPECTION_PROGRESS_PREFIX}${JSON.stringify(progress)}\n`;
		if (legacy && emittedBytes + Buffer.byteLength(line) > 12e3) {
			exhausted = true;
			line = `${UPDATE_STATE_INSPECTION_PROGRESS_PREFIX}${JSON.stringify({ phase: "schema inspection; detailed progress omitted" })}\n`;
		}
		emittedBytes += Buffer.byteLength(line);
		try {
			writeSync(2, line);
		} catch (error) {
			const code = extractErrorCode(error);
			if (code !== "EAGAIN" && code !== "EWOULDBLOCK") throw error;
		}
	};
}
/** Keep the last source independently of diagnostic output volume and child lifetime. */
function createUpdateStateInspectionDiagnostics(params) {
	const startedAt = Date.now();
	const decoder = new StringDecoder("utf8");
	let progress = {
		phase: params.phase,
		...params.paths.length === 1 ? { path: params.paths[0] } : {}
	};
	let pending = "";
	let tail = "";
	let diagnosticBytes = 0;
	const checkLimit = (pendingBytes = 0) => {
		if (params.stderrLimit && diagnosticBytes + pendingBytes > params.stderrLimit.bytes) params.stderrLimit.onExceeded();
	};
	const receiveLine = (line) => {
		if (line.startsWith("State schema progress: ")) {
			let decoded;
			try {
				decoded = JSON.parse(line.slice(23));
			} catch {}
			const value = ProgressSchema.safeParse(decoded);
			if (value.success) {
				progress = value.data;
				params.onProgress?.(progress);
				return;
			}
		}
		diagnosticBytes += Buffer.byteLength(line) + 1;
		checkLimit();
		tail = `${tail}${line}\n`.slice(-12e3);
	};
	return {
		onOutputChunk: (chunk, stream) => {
			if (stream !== "stderr") return;
			const lines = `${pending}${decoder.write(chunk)}`.split("\n");
			const last = lines.pop() ?? "";
			checkLimit(Buffer.byteLength(last));
			pending = last.slice(-12e3);
			diagnosticBytes += Buffer.byteLength(last) - Buffer.byteLength(pending);
			for (const line of lines) receiveLine(line);
		},
		stderr: () => `${tail}${pending}`.trim(),
		failure(reason, termination) {
			const detail = formatErrorMessageWithCode(reason ?? "").trim();
			const summary = detail ? redactPublicSupportDiagnosticLine(detail, {
				env: {},
				stateDir: ""
			}) : "Worker exited without diagnostic output";
			const elapsed = Math.max(0, Date.now() - startedAt) / 1e3;
			const scope = params.paths.slice(0, 3).join(", ");
			const source = progress.path ?? `source scope [${scope}${params.paths.length > 3 ? ", …" : ""}]`;
			const signaled = termination === "signal" || termination?.startsWith("signal,");
			const advice = params.retryAdvice === false ? signaled ? " The worker was terminated by a signal during the reported step." : "" : signaled ? " The worker was terminated by a signal during the reported step. Check the host crash report or process supervisor, then retry the update." : " Check access to the reported source, free space, and storage performance, then retry the update.";
			return new Error(`${params.operation} failed${termination ? ` (${termination})` : ""}: ${summary}; after ${elapsed.toFixed(3)} seconds during ${progress.phase} for ${source} (scope: ${params.paths.length} source paths): ${detail}.${advice}`, reason instanceof Error ? { cause: reason } : void 0);
		}
	};
}
//#endregion
export { createUpdateStateSnapshotReporter as a, createUpdateStateIoReporter as i, createUpdateStateInspectionDiagnostics as n, formatUpdateStateInspectionError as o, createUpdateStateInspectionReporter as r, UPDATE_STATE_INSPECTION_PROGRESS_PREFIX as t };
