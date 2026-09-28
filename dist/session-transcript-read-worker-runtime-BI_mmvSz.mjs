import { t as ensureSqliteLibrarySelected } from "./bun-sqlite-library-GOquVAYK.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { r as resolveRuntimeWorkerUrl } from "./runtime-worker-url-B4o9tqvO.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-cppt7dT0.mjs";
import { r as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-Crjo4FKU.mjs";
import { i as unwrapSessionTranscriptWorkerReply } from "./session-history-worker-errors-DS6WgDIN.mjs";
//#region src/config/sessions/session-transcript-read-worker-runtime.ts
function prepareSqliteReadWorker() {
	ensureSqliteLibrarySelected();
	return { options: {} };
}
const workerUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionTranscript);
const modelContextReads = new WorkerTaskPool({
	workerUrl,
	prepareWorker: prepareSqliteReadWorker,
	workerOptions: { resourceLimits: { maxOldGenerationSizeMb: 512 } },
	maxWorkers: 1
});
const sessionEntries = new WorkerTaskPool({
	workerUrl,
	prepareWorker: prepareSqliteReadWorker,
	workerOptions: { resourceLimits: { maxOldGenerationSizeMb: 512 } },
	maxWorkers: 1,
	sharedCompute: true
});
const branchSummaries = new WorkerTaskPool({
	workerUrl,
	prepareWorker: prepareSqliteReadWorker,
	workerOptions: { resourceLimits: { maxOldGenerationSizeMb: 512 } },
	maxWorkers: 1,
	sharedCompute: true
});
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
	return unwrapSessionTranscriptWorkerReply(await sessionEntries.run({
		kind: "session-entry",
		absPath,
		options,
		redaction,
		...receipt ? { admission: { ...receipt } } : {}
	}, { inputBytes: 2 * (absPath.length + options.agentId.length + options.sessionId.length + options.storePath.length + (options.sessionKey?.length ?? 0) + redaction.registeredSecretValues.reduce((bytes, value) => bytes + value.length, 0)) }));
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
export { runSessionBranchSummaryWorkerRequest as i, readSessionTranscriptModelContextAsync as n, resolveSessionSqliteTargetInWorker as r, prepareSessionEntryInWorker as t };
