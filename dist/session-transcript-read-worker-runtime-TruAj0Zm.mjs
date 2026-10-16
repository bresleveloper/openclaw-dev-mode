import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DoBSDhBS.mjs";
import { r as ensureSqliteLibrarySelected } from "./bun-sqlite-library-CBSPJxTD.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-iI3pfrsK.mjs";
import { r as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-DfxRHzep.mjs";
import { o as unwrapSessionTranscriptWorkerReply } from "./session-history-worker-errors-NH8_8u1W.mjs";
//#region src/config/sessions/session-transcript-read-worker-runtime.ts
const workerUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionTranscript);
function createTranscriptReadPool(sharedCompute) {
	return new WorkerTaskPool({
		workerUrl,
		prepareWorker: () => {
			ensureSqliteLibrarySelected();
			return { options: {} };
		},
		workerOptions: { resourceLimits: { maxOldGenerationSizeMb: 512 } },
		maxWorkers: 1,
		...sharedCompute === void 0 ? {} : { sharedCompute }
	});
}
const modelContextReads = createTranscriptReadPool();
const sessionEntries = createTranscriptReadPool(true);
const branchSummaries = createTranscriptReadPool(true);
async function readSessionTranscriptModelContextAsync(target, admission, signal, through, limits) {
	signal?.throwIfAborted();
	const value = unwrapSessionTranscriptWorkerReply(await modelContextReads.run({
		kind: "model-context",
		target,
		admission,
		through,
		limits
	}, {
		timeoutMs: 6e4,
		signal
	}));
	if (!("events" in value)) throw new Error("Session context worker returned a database target instead of context");
	return value;
}
async function resolveSessionSqliteTargetInWorker(input, signal) {
	signal?.throwIfAborted();
	const value = unwrapSessionTranscriptWorkerReply(await modelContextReads.run({
		kind: "sqlite-target",
		...input
	}, {
		inputBytes: JSON.stringify(input).length * 2,
		timeoutMs: 6e4,
		signal
	}));
	if (!("target" in value)) throw new Error("Session context worker returned context instead of a database target");
	return value.target;
}
async function prepareSessionEntryInWorker(absPath, options, redaction) {
	const receipt = resolveSessionTranscriptReadFence(options);
	const result = unwrapSessionTranscriptWorkerReply(await sessionEntries.run({
		kind: "session-entry",
		absPath,
		options,
		redaction,
		...receipt ? { admission: { ...receipt } } : {}
	}, { inputBytes: 2 * (absPath.length + options.agentId.length + options.sessionId.length + options.storePath.length + (options.sessionKey?.length ?? 0) + redaction.registeredSecretValues.reduce((bytes, value) => bytes + value.length, 0)) }));
	if (!("entry" in result)) throw new Error("Session transcript worker returned reset metadata instead of an export");
	return result;
}
async function readSessionResetRecallCutoffInWorker(scope) {
	const receipt = resolveSessionTranscriptReadFence(scope);
	const result = unwrapSessionTranscriptWorkerReply(await sessionEntries.run({
		kind: "session-reset-recall",
		scope,
		...receipt ? { admission: { ...receipt } } : {}
	}, { inputBytes: JSON.stringify(scope).length * 2 }));
	if (!("cutoff" in result)) throw new Error("Session transcript worker returned an export instead of reset metadata");
	return result.cutoff;
}
async function runSessionBranchSummaryWorkerRequest(request, signal) {
	return unwrapSessionTranscriptWorkerReply(await branchSummaries.run({
		kind: "branch-summaries",
		request
	}, {
		inputBytes: 2 * (request.database.agentId.length + request.database.path.length + request.databaseIdentity.length + request.sessionKey.length + request.sessionId.length + (request.lifecycleRevision?.length ?? 0)),
		timeoutMs: 6e4,
		signal
	}));
}
//#endregion
export { runSessionBranchSummaryWorkerRequest as a, resolveSessionSqliteTargetInWorker as i, readSessionResetRecallCutoffInWorker as n, readSessionTranscriptModelContextAsync as r, prepareSessionEntryInWorker as t };
