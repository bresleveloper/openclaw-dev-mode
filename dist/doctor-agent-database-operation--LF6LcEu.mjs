import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
//#region src/commands/doctor-agent-database-operation.ts
/** Keep one unusable agent database from aborting sibling Doctor work. */
function runDoctorAgentDatabaseOperation(params) {
	try {
		return {
			ok: true,
			value: params.run()
		};
	} catch (error) {
		noteDoctorAgentDatabaseFailure(params, error);
		return { ok: false };
	}
}
async function runDoctorAgentDatabaseOperationAsync(params) {
	try {
		return {
			ok: true,
			value: await params.run()
		};
	} catch (error) {
		noteDoctorAgentDatabaseFailure(params, error);
		return { ok: false };
	}
}
function noteDoctorAgentDatabaseFailure(params, error) {
	note(`- Agent ${params.agentId} database ${shortenHomePath(params.path)}: ${formatErrorMessage(error)}`, "Doctor warnings");
}
//#endregion
export { runDoctorAgentDatabaseOperationAsync as n, runDoctorAgentDatabaseOperation as t };
