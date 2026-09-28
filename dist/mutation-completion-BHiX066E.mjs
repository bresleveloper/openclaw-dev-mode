import { n as captureAsyncWorkTracker } from "./async-work-scope-CWk2dk1h.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/cron/mutation-completion.ts
const mutationMethods = /* @__PURE__ */ new Set([
	"cron.add",
	"cron.update",
	"cron.remove",
	"cron.run",
	"cron.scratch.set"
]);
const currentMutation = new AsyncLocalStorage();
/** One in-process invocation may preserve only the effect its actual mutation owner accepted. */
function createCronMutationCompletion(method) {
	if (!mutationMethods.has(method)) return;
	const state = {
		method,
		open: true,
		committed: false,
		...method === "cron.run" ? { trackAdmission: captureAsyncWorkTracker() } : {}
	};
	return {
		isCommitted: () => state.committed,
		run: async (run) => {
			if (!state.open) throw new Error("Cron mutation completion has already settled.");
			try {
				return await currentMutation.run(state, run);
			} finally {
				state.open = false;
			}
		}
	};
}
/** Capture before acceptance; late callbacks cannot retain a settled or successor invocation. */
function captureCronRunAdmissionTracker() {
	const state = currentMutation.getStore();
	const track = state?.trackAdmission;
	if (!state?.open || state.method !== "cron.run" || !track) return;
	return async (run) => {
		if (!state.open) throw new Error("Cron mutation completion has already settled.");
		return await track(run);
	};
}
/** Capture at the effect owner; a late callback cannot mark a later invocation. */
function captureCronMutationCommit(method) {
	const state = currentMutation.getStore();
	if (!state?.open || state.method !== method) return;
	return () => {
		if (state.open) state.committed = true;
	};
}
/** Record the SQL commit before fallible coordinator cleanup, preserving existing hooks. */
function withCronMutationCommitHook(method, hooks) {
	const committed = captureCronMutationCommit(method);
	if (!committed) return hooks;
	return {
		...hooks,
		afterWrite: (db) => {
			deferSqlitePostCommitPublication(db, committed);
			return hooks?.afterWrite?.(db);
		}
	};
}
//#endregion
export { withCronMutationCommitHook as i, captureCronRunAdmissionTracker as n, createCronMutationCompletion as r, captureCronMutationCommit as t };
