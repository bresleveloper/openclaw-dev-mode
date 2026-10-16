//#region src/config/sessions/work-start-error.ts
/** Stable code that survives channel and framework error wrappers. */
const SESSION_WORK_START_INVALIDATED_ERROR_CODE = "SESSION_WORK_START_INVALIDATED";
const SESSION_WORK_START_CHANGED_ERROR_CODE = "SESSION_WORK_START_CHANGED";
const SESSION_RESTART_RECOVERY_TOMBSTONE_ERROR_CODE = "SESSION_RESTART_RECOVERY_TOMBSTONE";
var SessionWorkStartInvalidatedError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = SESSION_WORK_START_INVALIDATED_ERROR_CODE;
		this.name = "SessionWorkStartInvalidatedError";
	}
};
var SessionWorkStartChangedError = class extends Error {
	constructor(..._args2) {
		super(..._args2);
		this.code = SESSION_WORK_START_CHANGED_ERROR_CODE;
		this.name = "SessionWorkStartChangedError";
	}
};
function createSessionWorkStartChangedError(sessionKey) {
	return new SessionWorkStartChangedError(`Session "${sessionKey}" changed while starting work. Retry.`);
}
function isSessionWorkStartInvalidatedError(error) {
	return error instanceof SessionWorkStartInvalidatedError || error instanceof SessionWorkStartChangedError || typeof error === "object" && error !== null && "code" in error && (error.code === "SESSION_WORK_START_INVALIDATED" || error.code === "SESSION_WORK_START_CHANGED");
}
var SessionRestartRecoveryTombstoneError = class extends Error {
	constructor(..._args3) {
		super(..._args3);
		this.code = SESSION_RESTART_RECOVERY_TOMBSTONE_ERROR_CODE;
		this.name = "SessionRestartRecoveryTombstoneError";
	}
};
//#endregion
export { SessionWorkStartChangedError as a, isSessionWorkStartInvalidatedError as c, SessionRestartRecoveryTombstoneError as i, SESSION_WORK_START_CHANGED_ERROR_CODE as n, SessionWorkStartInvalidatedError as o, SESSION_WORK_START_INVALIDATED_ERROR_CODE as r, createSessionWorkStartChangedError as s, SESSION_RESTART_RECOVERY_TOMBSTONE_ERROR_CODE as t };
