//#region src/infra/state-repair-message.ts
function formatDoctorStateRepairFailure(problem, recovery) {
	return `Doctor cannot repair this state: ${problem}. ${recovery}`;
}
/** Shared diagnosis for an unreadable state database; callers own the operation prefix. */
function describeUnreadableStateDatabase(path, reason) {
	return {
		problem: `shared state database is unreadable at ${path}: ${reason}`,
		recovery: "Stop OpenClaw processes, then restore this file from a verified backup; the unreadable database was left unchanged."
	};
}
var DoctorUnreadableStateDatabaseError = class extends Error {
	constructor(path, reason) {
		const { problem, recovery } = describeUnreadableStateDatabase(path, reason);
		super(formatDoctorStateRepairFailure(problem, recovery));
		this.name = "DoctorUnreadableStateDatabaseError";
	}
};
//#endregion
export { describeUnreadableStateDatabase as n, formatDoctorStateRepairFailure as r, DoctorUnreadableStateDatabaseError as t };
