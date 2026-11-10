import { o as resolveWorkerPoolSize, t as SESSION_TRANSCRIPT_FOREGROUND_WORKERS } from "./worker-pool-sizing-9MNT4hxr.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath, n as listSqliteTargetCandidatePathsForSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { n as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { o as unwrapSessionTranscriptWorkerReply } from "./session-history-worker-errors-D75quOgT.mjs";
import { t as createSessionTranscriptReadPool } from "./session-transcript-read-pools-DSkIQlUd.mjs";
import path from "node:path";
//#region src/config/sessions/session-transcript-read-worker-runtime.ts
const modelContextReads = createSessionTranscriptReadPool(SESSION_TRANSCRIPT_FOREGROUND_WORKERS);
const sessionEntries = createSessionTranscriptReadPool(resolveWorkerPoolSize("singleton"), true);
async function readSessionTranscriptModelContextInWorker(target, admission, signal, through, limits, expectedIdentity) {
	signal?.throwIfAborted();
	const value = unwrapSessionTranscriptWorkerReply(await modelContextReads.run({
		kind: "model-context",
		target,
		admission,
		through,
		limits,
		expectedIdentity
	}, {
		timeoutMs: 6e4,
		signal
	}, {
		storePaths: [target.storePath],
		admissionPaths: [resolveUnsuffixedSqliteTargetFromSessionStorePath(target.storePath).path]
	}));
	if (!("events" in value)) throw new Error("Session context worker returned a database target instead of context");
	return value;
}
async function resolveSessionSqliteTargetInWorker(input, signal) {
	signal?.throwIfAborted();
	const target = resolveUnsuffixedSqliteTargetFromSessionStorePath(input.storePath);
	const value = unwrapSessionTranscriptWorkerReply(await modelContextReads.run({
		kind: "sqlite-target",
		...input
	}, {
		inputBytes: JSON.stringify(input).length * 2,
		timeoutMs: 6e4,
		signal
	}, {
		storePaths: [input.storePath],
		admissionPaths: listSqliteTargetCandidatePathsForSessionStorePath(input.storePath),
		families: target.agentId || target.shared ? [] : [path.dirname(target.path)]
	}));
	if (!("target" in value)) throw new Error("Session context worker returned context instead of a database target");
	return value.target;
}
async function readSessionTranscriptContextMessagesInWorker(target, admission, signal, expectedIdentity) {
	signal?.throwIfAborted();
	const value = unwrapSessionTranscriptWorkerReply(await modelContextReads.run({
		kind: "context-messages",
		target,
		admission,
		expectedIdentity
	}, {
		timeoutMs: 6e4,
		signal
	}, {
		storePaths: [target.storePath],
		admissionPaths: [resolveUnsuffixedSqliteTargetFromSessionStorePath(target.storePath).path]
	}));
	if (!("messages" in value)) throw new Error("Session context worker returned a different context operation");
	return value;
}
async function prepareSessionEntryInWorker(absPath, options) {
	const result = await readSessionEntryInWorker({
		kind: "session-entry",
		absPath,
		options
	});
	if (!("entry" in result)) throw new Error("Session transcript worker returned a snapshot instead of an export");
	return result;
}
async function prepareSessionEntriesInWorker(entries) {
	const prepared = [];
	let received = 0;
	if (!("entries" in unwrapSessionTranscriptWorkerReply(await sessionEntries.run({
		kind: "session-entries",
		entries: entries.map((entry) => {
			const receipt = resolveSessionTranscriptReadFence(entry.options);
			return {
				...entry,
				...receipt ? { admission: { ...receipt } } : {}
			};
		})
	}, {
		inputBytes: JSON.stringify(entries).length * 2,
		onRequest: async (progress) => {
			const update = progress;
			if (update.kind !== "session-entries" || !Number.isInteger(update.index) || update.index < 0 || update.index >= entries.length || update.index in prepared) throw new Error("Invalid session export delivery");
			prepared[update.index] = update.value;
			received++;
			return {
				input: void 0,
				timeoutMs: 6e4
			};
		}
	}, {
		storePaths: entries.map(({ options }) => options.storePath),
		admissionPaths: [...new Set(entries.map(({ options }) => resolveUnsuffixedSqliteTargetFromSessionStorePath(options.storePath).path))]
	})))) throw new Error("Session transcript worker returned a single export instead of a batch");
	if (received !== entries.length) throw new Error("Session transcript worker returned an incomplete export batch");
	return prepared;
}
async function readSessionEntrySnapshotInWorker(absPath, options, includeOriginalMessages) {
	const result = await readSessionEntryInWorker({
		kind: "session-entry",
		mode: "snapshot",
		includeOriginalMessages,
		absPath,
		options
	});
	if (!("snapshot" in result)) throw new Error("Session transcript worker returned an export instead of a snapshot");
	return result.snapshot;
}
async function readSessionEntryInWorker(input) {
	const { absPath, options } = input;
	const receipt = resolveSessionTranscriptReadFence(options);
	const result = unwrapSessionTranscriptWorkerReply(await sessionEntries.run({
		...input,
		...receipt ? { admission: { ...receipt } } : {}
	}, { inputBytes: 2 * (absPath.length + options.agentId.length + options.sessionId.length + options.storePath.length + (options.sessionKey?.length ?? 0)) }, {
		storePaths: [options.storePath],
		admissionPaths: [resolveUnsuffixedSqliteTargetFromSessionStorePath(options.storePath).path]
	}));
	if (!("entry" in result) && !("snapshot" in result)) throw new Error("Session transcript worker returned reset metadata instead of an export");
	return result;
}
async function readSessionResetRecallCutoffInWorker(scope) {
	const receipt = resolveSessionTranscriptReadFence(scope);
	const result = unwrapSessionTranscriptWorkerReply(await sessionEntries.run({
		kind: "session-reset-recall",
		scope,
		...receipt ? { admission: { ...receipt } } : {}
	}, { inputBytes: JSON.stringify(scope).length * 2 }, {
		storePaths: [scope.storePath],
		admissionPaths: [resolveUnsuffixedSqliteTargetFromSessionStorePath(scope.storePath).path]
	}));
	if (!("cutoff" in result)) throw new Error("Session transcript worker returned an export instead of reset metadata");
	return result.cutoff;
}
//#endregion
export { readSessionTranscriptContextMessagesInWorker as a, readSessionResetRecallCutoffInWorker as i, prepareSessionEntryInWorker as n, readSessionTranscriptModelContextInWorker as o, readSessionEntrySnapshotInWorker as r, resolveSessionSqliteTargetInWorker as s, prepareSessionEntriesInWorker as t };
