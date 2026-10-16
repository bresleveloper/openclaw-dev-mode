import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { t as assertCapturedSessionEntryReadSource } from "./session-accessor.sqlite-exact-read-JW6IveXD.mjs";
import { t as readPendingInputHistoryInDatabase } from "./session-pending-input-history.kernel-DyYa8lyP.mjs";
//#region src/config/sessions/session-pending-input-history-read.worker.ts
function readPendingInputHistoryInWorker(request) {
	const read = withOpenClawAgentDatabaseReadOnly((database) => {
		assertCapturedSessionEntryReadSource(request.source, database);
		return readPendingInputHistoryInDatabase(database, request.query);
	}, {
		...request.database,
		env: request.env
	});
	return read.found ? read.value : {
		rows: [],
		total: 0
	};
}
//#endregion
export { readPendingInputHistoryInWorker };
