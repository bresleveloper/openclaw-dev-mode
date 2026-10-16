import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { n as isActiveStoreWriter, r as runQueuedStoreWrite } from "./store-writer-queue-Cq6rziq_.mjs";
//#region src/state/openclaw-agent-write-admission.ts
const admission = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseWriteAdmission"), () => ({
	queues: /* @__PURE__ */ new Map(),
	workers: /* @__PURE__ */ new Map()
}));
const SQLITE_SESSION_WRITER_QUEUES = admission.queues;
function runOpenClawAgentWriteAdmission(options, run, reentrant = false, timing, signal) {
	const pathname = resolveOpenClawAgentSqlitePath(options);
	const identity = readDatabasePathIdentitySync(pathname);
	const storePath = identity.canonicalPath;
	const assertCurrent = () => {
		const current = readDatabasePathIdentitySync(pathname);
		if (current.canonicalPath !== storePath || identity.key.startsWith("file:") && (current.key !== identity.key || current.birthtime !== identity.birthtime)) throw new Error("Agent database target changed before write admission");
	};
	return runQueuedStoreWrite({
		queues: admission.queues,
		storePath,
		label: "agent database write admission",
		reentrant: reentrant && !admission.workers.has(storePath),
		fn: async () => {
			assertCurrent();
			return await run(identity, assertCurrent);
		},
		timing,
		signal
	});
}
/** Reserve a native write permit without admitting inherited foreground callbacks. */
function runOpenClawAgentWorkerWrite(options, run, timing, signal) {
	if ("target" in options) {
		const { handle, incarnation } = options.target;
		return runQueuedStoreWrite({
			queues: admission.queues,
			storePath: `ephemeral:${handle}:${incarnation}`,
			label: "incognito agent database write admission",
			reentrant: false,
			fn: async () => {
				options.assertCurrent();
				return run();
			},
			timing,
			signal
		});
	}
	return runOpenClawAgentWriteAdmission(options, async ({ canonicalPath: storePath }) => {
		const owner = {};
		admission.workers.set(storePath, owner);
		try {
			return await run();
		} finally {
			if (admission.workers.get(storePath) === owner) admission.workers.delete(storePath);
		}
	}, true, timing, signal);
}
/** Compose the existing foreground queues without inverting inherited acquisition order. */
async function runOpenClawAgentWriteAdmissions(options, run) {
	const selected = new Map(options.map((option) => [resolveOpenClawAgentSqlitePath(option), option]));
	const paths = [...selected.keys()].toSorted();
	const inherited = [...admission.queues.keys()].filter((pathname) => isActiveStoreWriter(admission.queues, pathname));
	if (paths.some((pathname) => inherited.includes(pathname))) throw new Error("Session read batch cannot reenter an active SQLite writer admission");
	if (paths.some((pathname) => inherited.some((held) => held > pathname))) throw new Error("Session read batch would invert inherited SQLite writer admission order");
	const acquire = (index) => {
		const pathname = paths[index];
		return pathname === void 0 ? Promise.resolve().then(run) : runOpenClawAgentWriteAdmission(selected.get(pathname), () => acquire(index + 1), true);
	};
	return await acquire(0);
}
//#endregion
export { runOpenClawAgentWriteAdmissions as i, runOpenClawAgentWorkerWrite as n, runOpenClawAgentWriteAdmission as r, SQLITE_SESSION_WRITER_QUEUES as t };
