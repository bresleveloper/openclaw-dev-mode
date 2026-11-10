import { f as readDatabasePathIdentitySync, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { t as captureOpenClawStateReadContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { i as captureAgentDatabaseAdmission } from "./agent-database-admission-CeDA0ojh.mjs";
import { n as measureStartup } from "./server-startup-trace-D_q4lWuA.mjs";
import { n as runSessionStartupMigration } from "./startup-migration-DbIjhSUu.mjs";
import { setImmediate } from "node:timers/promises";
//#region src/gateway/server-startup-session-migration.ts
/** Normalize legacy outcomes before readiness; retain admitted stores for later transcript repair. */
async function prepareGatewayStartupSessions(params) {
	const databases = [];
	await runSessionStartupMigration({
		...params,
		handoffDatabase: async (database) => {
			params.assertCurrent?.();
			const identity = readDatabasePathIdentitySync(resolveOpenClawAgentSqlitePath(database));
			const state = captureOpenClawStateReadContext(resolveOpenClawStateSqlitePath(database.env));
			const assertAdmitted = captureAgentDatabaseAdmission(database.agentId, { env: database.env });
			databases.push({
				database: {
					...database,
					path: identity.canonicalPath
				},
				assertCurrent: () => {
					state.admission.assertCurrent();
					assertAdmitted();
					assertExistingDatabaseIdentity(identity.canonicalPath, identity.key, identity.birthtime);
				}
			});
		}
	});
	return databases;
}
/** Repair admitted startup targets without rediscovering stores or repeating admission. */
async function runGatewaySessionStartupMaintenance(params) {
	let reconcile = params.deps?.reconcileSessionTranscriptIndexes;
	let reconciledSessions = 0;
	for (const { database, assertCurrent: assertDatabaseCurrent } of params.databases) {
		await setImmediate();
		const assertCurrent = () => {
			params.signal?.throwIfAborted();
			params.assertCurrent?.();
			assertDatabaseCurrent();
		};
		assertCurrent();
		const result = await measureStartup(params.startupTrace, "startup.maintenance.session-transcripts", async () => {
			reconcile ??= (await import("./config/sessions/session-transcript-reconcile.js")).reconcileSessionTranscriptIndexes;
			assertCurrent();
			return reconcile({
				...database,
				assertCurrent,
				signal: params.signal
			});
		});
		assertCurrent();
		reconciledSessions += result.reconciledSessions;
	}
	if (reconciledSessions > 0) params.log.info(`session: rebuilt ${reconciledSessions} transcript projection(s)`);
}
//#endregion
export { prepareGatewayStartupSessions, runGatewaySessionStartupMaintenance };
