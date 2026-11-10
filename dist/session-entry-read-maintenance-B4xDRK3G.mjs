import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as assertAgentDatabaseAdmitted } from "./agent-database-admission-CeDA0ojh.mjs";
import { c as maintenanceLane } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { u as withSessionStoreReaderInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
//#region src/config/sessions/session-entry-read-maintenance.ts
/** Keep the physical reader owner through a registry maintenance consumer and its commit guard. */
function withSessionRegistryEntriesInWorker(input, consume) {
	assertAgentDatabaseAdmitted(input.agentId, { env: input.env });
	return withSessionStoreReaderInWorker(input, async ({ reader, database, assertCurrent: assertReaderCurrent }) => {
		const assertCurrent = () => {
			assertAgentDatabaseAdmitted(input.agentId, { env: database.env });
			assertAgentDatabaseAdmitted(database.agentId, { env: database.env });
			assertReaderCurrent();
		};
		let afterSessionKey;
		do {
			assertCurrent();
			const { entries, nextCronRunSessionKey } = await reader.readEntries({
				agentId: database.agentId,
				storePath: database.path,
				env: database.env,
				cronRetention: {
					afterSessionKey,
					limit: 32
				}
			});
			assertCurrent();
			await consume(entries, assertCurrent);
			afterSessionKey = nextCronRunSessionKey ?? void 0;
		} while (afterSessionKey !== void 0);
	}, { lane: maintenanceLane });
}
/** Return owned full entries only for expired cron runs; live deletion guards stay on the host. */
async function readExpiredCronRunEntriesInWorker(input) {
	const expiredCronRuns = {
		agentId: normalizeAgentId(input.agentId),
		updatedBefore: input.updatedBefore
	};
	assertAgentDatabaseAdmitted(expiredCronRuns.agentId, { env: input.env });
	return withSessionStoreReaderInWorker(input, async ({ reader, database }) => {
		const { entries, nextCronRunUpdatedAt } = await reader.readEntries({
			agentId: database.agentId,
			storePath: database.path,
			env: database.env,
			expiredCronRuns
		});
		return {
			entries,
			nextCronRunUpdatedAt
		};
	}, {
		lane: maintenanceLane,
		dataOnly: true
	});
}
//#endregion
export { withSessionRegistryEntriesInWorker as n, readExpiredCronRunEntriesInWorker as t };
