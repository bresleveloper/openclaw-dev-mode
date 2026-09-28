//#region src/cron/public-job.ts
/** Remove scheduler-only state before a cron job crosses a public API boundary. */
function toPublicCronJob(job) {
	const { skillLibrarySelections: _skillLibrarySelections, createdActor: _createdActor, toolsAllowProvenance: _toolsAllowProvenance, toolsAllowExecTarget: _toolsAllowExecTarget, toolsAllowExecTargetRequirement: _toolsAllowExecTargetRequirement, runtimeAuthority: _runtimeAuthority, runtimeAuthorityRecoveryRequired: _runtimeAuthorityRecoveryRequired, ...publicJob } = job;
	const state = { ...job.state };
	delete state.queuedAtMs;
	delete state.runningReceiptId;
	delete state.startupCatchupAtMs;
	delete state.pacedNextRunAtMs;
	delete state.forcePreservedNextRunAtMs;
	delete state.runningScheduleChangeId;
	delete state.failureAlertIncident;
	delete state.lastFailureNotificationId;
	return {
		...publicJob,
		state
	};
}
//#endregion
export { toPublicCronJob as t };
