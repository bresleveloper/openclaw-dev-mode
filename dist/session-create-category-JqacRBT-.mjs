import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { r as emitSessionsChanged } from "./session-change-event-B7XNN_I7.mjs";
import { t as sessionLog } from "./session-log-BRT6fN7h.mjs";
import "./sessions-shared-CHxhVZeL.mjs";
import { i as ensureSessionGroupRegistered } from "./session-groups-DKuQKdCB.mjs";
//#region src/gateway/server-methods/session-create-category.ts
/** Registration is bookkeeping for a witnessed session commit, not permission to retry it. */
async function registerCommittedSessionCategory(category, context, source) {
	if (!category?.trim()) return;
	let changed;
	try {
		source.assertCurrent();
		changed = await ensureSessionGroupRegistered(category, source.env, source.assertCurrent);
		source.assertCurrent();
	} catch (error) {
		sessionLog.warn(`session category ${JSON.stringify(category)} was saved, but group registration failed; retry the same category assignment to repair the catalog: ${formatErrorMessage(error)}`);
		changed = true;
	}
	if (changed) emitSessionsChanged(context, { reason: "groups" }, { catalogOnly: true });
}
//#endregion
export { registerCommittedSessionCategory as t };
