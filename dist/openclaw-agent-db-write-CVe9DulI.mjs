import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { n as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { y as retainAgentDatabase } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { a as getOpenClawAgentDatabaseIfOpen, f as withOpenClawAgentDatabaseAsync } from "./openclaw-agent-db-DBug3LUA.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-CKOCIcah.mjs";
//#region src/state/openclaw-agent-db-write.ts
/** Admit a synchronous mutation without blocking a reclamation worker's parent callback. */
function withOpenClawAgentDatabaseWrite(inputOptions, operation, expectedDatabase, signal) {
	const options = {
		...inputOptions,
		env: cloneEnvWithPlatformSemantics(inputOptions.env ?? process.env)
	};
	options.env.OPENCLAW_STATE_DIR = resolveStateDir(options.env);
	const pathname = resolveOpenClawAgentSqlitePath(options);
	options.path = pathname;
	const run = async (database) => {
		const { identity, birthtime } = readOpenClawAgentDatabaseIdentity(database);
		if (typeof identity === "string") assertExistingDatabaseIdentity(pathname, `file:${identity}`, birthtime);
		const result = operation(database);
		if (isPromiseLike(result)) {
			await result;
			throw new Error("Agent database write callbacks must remain synchronous");
		}
		return result;
	};
	return runOpenClawAgentWriteAdmission(options, async (_identity, assertCurrent) => {
		if (!expectedDatabase) return await withOpenClawAgentDatabaseAsync(options, run, assertCurrent);
		const database = getOpenClawAgentDatabaseIfOpen(options);
		if (!database || database.db !== expectedDatabase || !expectedDatabase.isOpen) throw new Error("Borrowed agent database closed or changed before write admission");
		const release = retainAgentDatabase(expectedDatabase);
		try {
			return await run(database);
		} finally {
			release();
		}
	}, true, void 0, signal);
}
//#endregion
export { withOpenClawAgentDatabaseWrite as t };
