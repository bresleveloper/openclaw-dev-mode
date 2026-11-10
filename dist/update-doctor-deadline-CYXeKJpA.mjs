//#region src/infra/update-doctor-deadline.ts
/** Translate a handoff timestamp once; wall-clock corrections cannot replenish Doctor work. */
function createDoctorServiceInspectionBudget(deadlineAtMs) {
	const deadline = deadlineAtMs === void 0 ? void 0 : performance.now() + deadlineAtMs - Date.now();
	return () => {
		if (deadline === void 0) return;
		const remainingMs = Math.ceil(deadline - performance.now());
		if (remainingMs <= 0) throw new Error("Doctor service-inspection deadline has expired.");
		return remainingMs;
	};
}
//#endregion
export { createDoctorServiceInspectionBudget as t };
