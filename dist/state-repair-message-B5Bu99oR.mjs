//#region src/infra/state-repair-message.ts
function formatDoctorStateRepairFailure(problem, recovery) {
	return `Doctor cannot repair this state: ${problem}. ${recovery}`;
}
var DoctorUnreadableStateDatabaseError = class extends Error {
	constructor(path, reason) {
		super(formatDoctorStateRepairFailure(`shared state database is unreadable at ${path}: ${reason}`, "Stop OpenClaw processes, then restore this file from a verified backup; the unreadable database was left unchanged."));
		this.name = "DoctorUnreadableStateDatabaseError";
	}
};
//#endregion
export { formatDoctorStateRepairFailure as n, DoctorUnreadableStateDatabaseError as t };
