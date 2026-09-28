import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHI12YH5.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { a as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { g as retainAgentDatabase } from "./openclaw-agent-db-lifecycle-D7S9DdJC.mjs";
import { m as withOpenClawAgentDatabaseAsync, s as getOpenClawAgentDatabaseIfOpen } from "./openclaw-agent-db-CaQAStOA.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-b9fAKekK.mjs";
//#region src/state/openclaw-agent-db-write.ts
/** Admit a synchronous mutation without blocking a reclamation worker's parent callback. */
function withOpenClawAgentDatabaseWrite(inputOptions, operation, expectedDatabase) {
	const options = {
		...inputOptions,
		env: cloneEnvWithPlatformSemantics(inputOptions.env ?? process.env)
	};
	options.env.OPENCLAW_STATE_DIR = resolveStateDir(options.env);
	options.path = resolveOpenClawAgentSqlitePath(options);
	const run = async (database) => {
		const result = operation(database);
		if (isPromiseLike(result)) {
			await result;
			throw new Error("Agent database write callbacks must remain synchronous");
		}
		return result;
	};
	return runOpenClawAgentWriteAdmission(options, async () => {
		if (!expectedDatabase) return await withOpenClawAgentDatabaseAsync(options, run);
		const database = getOpenClawAgentDatabaseIfOpen(options);
		if (!database || database.db !== expectedDatabase || !expectedDatabase.isOpen) throw new Error("Borrowed agent database closed or changed before write admission");
		const release = retainAgentDatabase(expectedDatabase);
		try {
			return await run(database);
		} finally {
			release();
		}
	}, true);
}
//#endregion
export { withOpenClawAgentDatabaseWrite as t };
