//#region src/agents/prepared-model-runtime-admission-errors.ts
var PreparedModelRuntimeOwnerNotPublishedError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.admissionBlocked = options?.admissionBlocked === true;
	}
};
/** Facts recorded by the recovery owner, including when another attempt is eligible. */
var PreparedModelRuntimeRecoveryError = class extends PreparedModelRuntimeOwnerNotPublishedError {
	constructor(agentId, reason, nextEligibleAt, options) {
		super(`prepared reply dispatch runtime owner was not published for ${agentId}; ${reason === "backoff" ? "recovery is waiting for retry" : "recovery failed"}. Check Gateway logs for the underlying publication error.`, options);
		this.reason = reason;
		this.nextEligibleAt = nextEligibleAt;
	}
};
//#endregion
export { PreparedModelRuntimeRecoveryError as n, PreparedModelRuntimeOwnerNotPublishedError as t };
